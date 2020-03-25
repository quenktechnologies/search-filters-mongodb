import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { FieldName, Operator, FoldFunc, Term as ITerm, TermFactory } from '@quenk/search-filters/lib/compile/term';
export { FieldName, Operator };
export declare const TYPE_AND = "and";
export declare const TYPE_OR = "or";
export declare const TYPE_FILTER = "filter";
export declare const TYPE_MATCH = "match";
export declare const TYPE_MATCH_CI = "matchci";
/**
 * Term type specialised for this module.
 */
export declare type Term = ITerm<Object>;
/**
 * nativeOps maps the supported search-filters operators to mongodb operators.
 */
export declare const nativeOps: {
    [key: string]: string;
};
/**
 * BaseTerm
 */
export declare abstract class BaseTerm implements Term {
    abstract type: string;
    abstract compile(): Except<Object>;
    fold<A>(prev: A, f: FoldFunc<Object, A>): A;
}
/**
 * Empty
 */
export declare class Empty {
    type: string;
    compile(): Except<Object>;
    fold<A>(prev: A, f: FoldFunc<Object, A>): A;
}
/**
 * And
 */
export declare class And extends BaseTerm {
    lhs: Term;
    rhs: Term;
    type: string;
    constructor(lhs: Term, rhs: Term);
    compile(): Except<Object>;
    fold<A>(prev: A, f: FoldFunc<Object, A>): A;
}
/**
 * Or
 */
export declare class Or extends And {
    type: string;
}
/**
 * Filter
 */
export declare class Filter extends BaseTerm {
    field: string;
    operator: Operator;
    value: Value;
    constructor(field: string, operator: Operator, value: Value);
    type: string;
    static create: (field: string, operator: string, value: Value) => Term;
    compile(): Except<Object>;
}
/**
 * DateFilter
 */
export declare class DateFilter extends Filter {
    static create: (field: string, operator: string, value: Value) => Term;
    compile(): Except<Object>;
}
/**
 * Match
 */
export declare class Match extends BaseTerm {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    type: string;
    static create: (field: string, operator: string, value: Value) => Term;
    compile(): Except<Object>;
}
/**
 * MatchCI
 */
export declare class MatchCI extends Match {
    type: string;
    static create: (field: string, operator: string, value: Value) => Term;
    compile(): Except<Object>;
}
/**
 * requiredTerms all search-filters compilers must support.
 */
export declare const requiredTerms: TermFactory<Object>;
