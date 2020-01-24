import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { Term, FilterInfo } from '@quenk/search-filters/lib/compile/term';
import { Context } from '@quenk/search-filters/lib/compile';
/**
 * nativeOps maps the supported search-filters operators to mongodb operators.
 */
export declare const nativeOps: {
    [key: string]: string;
};
/**
 * Empty
 */
export declare class Empty {
    static create: () => Term<Object>;
    compile(): Except<Object>;
}
/**
 * And
 */
export declare class And {
    left: Term<Object>;
    right: Term<Object>;
    connective: string;
    constructor(left: Term<Object>, right: Term<Object>);
    static create: (_: Context<Object>, left: Term<Object>, right: Term<Object>) => Term<Object>;
    compile(): Except<Object>;
}
/**
 * Or
 */
export declare class Or extends And {
    connective: string;
    static create: (_: Context<Object>, left: Term<Object>, right: Term<Object>) => Term<Object>;
}
/**
 * Filter
 */
export declare class Filter {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    static create: (_: Context<Object>, { field, operator, value }: FilterInfo) => Term<Object>;
    compile(): Except<Object>;
}
/**
 * Match
 */
export declare class Match {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    static create: (_: Context<Object>, { field, operator, value }: FilterInfo) => Term<Object>;
    compile(): Except<Object>;
}
/**
 * MatchCI
 */
export declare class MatchCI extends Match {
    static create: (_: Context<Object>, { field, operator, value }: FilterInfo) => Term<Object>;
    compile(): Except<Object>;
}
