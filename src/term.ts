import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';
import {
    FieldName,
    Operator,
    FoldFunc,
    Term as ITerm,
    TermFactory
} from '@quenk/search-filters/lib/compile/term';
import moment = require('moment');

export { FieldName, Operator }

export const TYPE_AND = 'and';
export const TYPE_OR = 'or';
export const TYPE_FILTER = 'filter';
export const TYPE_MATCH = 'match';
export const TYPE_MATCH_CI = 'matchci';

/**
 * Term type specialised for this module.
 */
export type Term = ITerm<Object>;

/**
 * nativeOps maps the supported search-filters operators to mongodb operators.
 */
export const nativeOps: { [key: string]: string } = {

    '>': '$gt',
    '<': '$lt',
    '=': '$eq',
    '!=': '$neq',
    '>=': '$gte',
    '<=': '$lte',
    'in': '$in',
    '!in': '$nin'

}

/**
 * BaseTerm
 */
export abstract class BaseTerm implements Term {

    abstract type: string;

    abstract compile(): Except<Object>;

    fold<A>(prev: A, f: FoldFunc<Object, A>): A {

        return f(prev, this);

    }

}

/**
 * Empty 
 */
export class Empty {

    type = 'empty';

    compile(): Except<Object> {

        return right({});

    }

    fold<A>(prev: A, f: FoldFunc<Object, A>): A {

        return f(prev, this);

    }

}

/**
 * And 
 */
export class And extends BaseTerm {

    type = TYPE_AND;

    constructor(public lhs: Term, public rhs: Term) { super(); }

    compile(): Except<Object> {

        let op = `$${this.type}`;

        let eLeft = this.lhs.compile();

        if (eLeft.isLeft()) return eLeft;

        let eRight = this.rhs.compile();

        if (eRight.isLeft()) return eRight;

        let lval = eLeft.takeRight();
        let rval = eRight.takeRight();

        if (this.lhs.type === this.type) {

            if (this.rhs.type === this.type)
                lval[op] = [...(<Object[]>lval[op]), ...(<Object[]>rval[op])];
            else
                (<Object[]>lval[op]).push(rval);

            return right(lval);

        } else {

            return right({

                [op]: [eLeft.takeRight(), eRight.takeRight()]

            });

        }

    }

    fold<A>(prev: A, f: FoldFunc<Object, A>): A {

        return f(f(prev, this.lhs), this.rhs);

    }

}

/**
 * Or 
 */
export class Or extends And {

    type = TYPE_OR;

}

/**
 * Filter 
 */
export class Filter extends BaseTerm {

    constructor(
        public field: string,
        public operator: Operator,
        public value: Value) { super(); }

    type = TYPE_FILTER;

    static create = (field: FieldName, operator: Operator, value: Value)
        : Term => new Filter(field, operator, value);

    compile(): Except<Object> {

        return right({

            [this.field]: { [nativeOps[this.operator]]: this.value }

        });

    }

}

const endDayOp = ['>', '<='];

/**
 * DateFilter
 */
export class DateFilter extends Filter {

    static create = (field: FieldName, operator: Operator, value: Value)
        : Term => new DateFilter(field, operator, value);

    compile(): Except<Object> {

        let value = moment.utc(<Date>this.value);
        let op = this.operator;

        if (endDayOp.indexOf(op) > -1)
            value = value.endOf('day');

        return right({

            [this.field]: { [nativeOps[this.operator]]: value.toDate() }

        });

    }

}

/**
 * Match
 */
export class Match extends BaseTerm {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { super(); }

    type = TYPE_MATCH;

    static create = (field: FieldName, operator: Operator, value: Value)
        : Term => new Match(field, operator, value);

    compile(): Except<Object> {

        return right({

            [this.field]: {

                $regex: escapeR(this.value)

            }

        });

    }

}

/**
 * MatchCI
 */
export class MatchCI extends Match {

    type = TYPE_MATCH_CI;

    static create = (field: FieldName, operator: Operator, value: Value)
        : Term => new MatchCI(field, operator, value);

    compile(): Except<Object> {

        return right({

            [this.field]: {

                $regex: escapeR(this.value),

                $options: 'i'

            }

        });

    }

}

const escapeR = (value: Value) => {

    let s = String(value);

    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

}

/**
 * requiredTerms all search-filters compilers must support.
 */
export const requiredTerms: TermFactory<Object> = {

    empty(): Term {

        return new Empty();

    },

    and(lhs: Term, rhs: Term): Term {

        return new And(lhs, rhs);

    },

    or(lhs: Term, rhs: Term): Term {

        return new Or(lhs, rhs);

    }

};
