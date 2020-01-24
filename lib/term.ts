import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';
import { Term, FilterInfo } from '@quenk/search-filters/lib/compile/term';
import { Context } from '@quenk/search-filters/lib/compile';

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

    static create = (): Term<Object> => new Empty();

    compile(): Except<Object> {

        return right({});

    }

}

/**
 * And 
 */
export class And {

    connective = '$and';

    constructor(public left: Term<Object>, public right: Term<Object>) { }

    static create = (_: Context<Object>, left: Term<Object>, right: Term<Object>)
        : Term<Object> => new And(left, right);

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

    connective = '$or';

    static create = (_: Context<Object>, left: Term<Object>, right: Term<Object>)
        : Term<Object> => new Or(left, right);

}

/**
 * Filter 
 */
export class Filter {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    static create = (_: Context<Object>, { field, operator, value }: FilterInfo)
        : Term<Object> => new Filter(field, operator, value);

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

    static create = (_: Context<Object>, { field, operator, value }: FilterInfo)
        : Term<Object> => new Match(field, operator, value);

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

    static create = (_: Context<Object>, { field, operator, value }: FilterInfo)
        : Term<Object> => new MatchCI(field, operator, value);

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
