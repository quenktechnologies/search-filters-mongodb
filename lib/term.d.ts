import { Object, Value } from '@quenk/noni/lib/data/json';
import { Except } from '@quenk/noni/lib/control/error';
import { Term, FilterInfo } from '@quenk/facets-dsl/lib/compile/term';
import { Context } from '@quenk/facets-dsl/lib/compile/context';
/**
 * Empty compiles to an empty string.
 */
export declare class Empty {
    compile(): Except<Object>;
}
/**
 * And compiles to an SQL and.
 */
export declare class And {
    left: Term<Object>;
    right: Term<Object>;
    op: string;
    constructor(left: Term<Object>, right: Term<Object>);
    compile(): Except<Object>;
}
/**
 * Or compiles to an SQL or.
 */
export declare class Or extends And {
    op: string;
}
/**
 * Operator compiles to the supported SQL comparison.
 */
export declare class Operator {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    compile(): Except<Object>;
}
/**
 * Regex condition.
 */
export declare class Regex {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    compile(): Except<Object>;
}
/**
 * Date condition
 */
export declare class Date {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    compile(): Except<Object>;
}
/**
 * and Term provider.
 */
export declare const and: (_: Context<Object>, left: Term<Object>, right: Term<Object>) => Term<Object>;
/**
 * or Term provider.
 */
export declare const or: (_: Context<Object>, left: Term<Object>, right: Term<Object>) => Term<Object>;
/**
 * empty Term provider.
 */
export declare const empty: () => Term<Object>;
/**
 * operator Term provider.
 */
export declare const operator: (_: Context<Value>, { field, operator, value }: FilterInfo<Value>) => Term<Object>;
/**
 * regex term provider
 */
export declare const regex: (_: Context<Value>, { field, operator, value }: FilterInfo<Value>) => Term<Object>;
/**
 * date term provider
 */
export declare const date: (_: Context<Value>, { field, operator, value }: FilterInfo<Value>) => Term<Object>;
