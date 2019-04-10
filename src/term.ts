import { Object, Value } from '@quenk/noni/lib/data/json';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';
import { Term, FilterInfo } from '@quenk/facets-dsl/lib/compile/term';
import { Context } from '@quenk/facets-dsl/lib/compile/context';

const ops: { [key: string]: string } = {

    '>': '$gt',
    '<': '$lt',
    '=': '$eq',
    '!=': '$neq',
    '>=': '$gte',
    '<=': '$lte',

}

/**
 * Empty compiles to an empty string.
 */
export class Empty {

    compile(): Except<Object> {

        return right({});

    }

}

/**
 * And compiles to an SQL and.
 */
export class And {

    op = '$and';

    constructor(public left: Term<Object>, public right: Term<Object>) { }

    compile(): Except<Object> {

        let eitherL = this.left.compile();

        if (eitherL.isLeft())
            return eitherL;

        let eitherR = this.right.compile();

        if (eitherR.isLeft())
            return eitherR;

        return right({ [this.op]: [eitherL.takeRight(), eitherR.takeRight()] });

    }

}

/**
 * Or compiles to an SQL or.
 */
export class Or extends And {

    op = '$or';

}

/**
 * Operator compiles to the supported SQL comparison.
 */
export class Operator {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    compile(): Except<Object> {

        return right({ [this.field]: { [ops[this.operator]]: this.value } });

    }

}

/**
 * Regex condition.
 */
export class Regex {
    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    compile(): Except<Object> {

        return right({ [this.field]: { $regex: escapeR(this.value) } });

    }

}

const escapeR = (value: Value) => {

    let s = String(value);

    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

}

/**
 * and Term provider.
 */
export const and = (_: Context<Object>, left: Term<Object>, right: Term<Object>)
    : Term<Object> => new And(left, right);

/**
 * or Term provider.
 */
export const or = (_: Context<Object>, left: Term<Object>, right: Term<Object>)
    : Term<Object> => new Or(left, right);

/**
 * empty Term provider.
 */
export const empty = (): Term<Object> => new Empty();

/**
 * operator Term provider.
 */
export const operator =
    (_: Context<Value>, { field, operator, value }: FilterInfo<Value>)
        : Term<Object> => new Operator(field, operator, value);

/**
 * regex term provider
 */
export const regex =
    (_: Context<Value>, { field, operator, value }: FilterInfo<Value>)
        : Term<Object> => new Regex(field, operator, value);
