import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';
import {
    FieldName,
    Operator,
    Term as ITerm,
    TermFactory
} from '@quenk/search-filters/lib/compile/term';

export { FieldName, Operator }

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

}

/**
 * Empty 
 */
export class Empty {

    type = 'empty';

    compile(): Except<Object> {

        return right({});

    }

}

/**
 * And 
 */
export class And {

    type = 'and';

    connective = '$and';

    constructor(public left: Term, public right: Term) { }

    compile(): Except<Object> {

        let eitherL = this.left.compile();

        if (eitherL.isLeft())
            return eitherL;

        let eitherR = this.right.compile();

        if (eitherR.isLeft())
            return eitherR;

        return right({

            [this.connective]: [eitherL.takeRight(), eitherR.takeRight()]

        });

    }

}

/**
 * Or 
 */
export class Or extends And {

    type = 'and';

    connective = '$or';


}

/**
 * Filter 
 */
export class Filter {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    type = 'filter';

    static create = (field: FieldName, operator: Operator, value: Value)
        : Term => new Filter(field, operator, value);

    compile(): Except<Object> {

        return right({

            [this.field]: { [nativeOps[this.operator]]: this.value }

        });

    }

}

/**
 * Match
 */
export class Match {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    type = 'match';

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

    type = 'matchci';

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

    and(left: Term, right: Term): Term {

        return new And(left, right);

    },

    or(left: Term, right: Term): Term {

        return new Or(left, right);

    }

};
