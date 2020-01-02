import { Object } from '@quenk/noni/lib/data/json';
import { Except } from '@quenk/noni/lib/control/error';
import { TermConstructors } from '@quenk/facets-dsl/lib/compile/term';
import { Policies } from '@quenk/facets-dsl/lib/compile/context/policy';
import { Context } from '@quenk/facets-dsl/lib/compile/context';
/**
 * defaultTerms for supporting the DSL.
 */
export declare const defaultTerms: TermConstructors<Object>;
/**
 * defaultPolicies that can be specified as strings instead of maps.
 */
export declare const defaultPolicies: Policies<Object>;
/**
 * defaultOptions used during compilation.
 */
export declare const defaultOptions: {
    maxFilters: number;
};
/**
 * compile a string into a MongoDB query object.
 */
export declare const compile: (ctx: Context<Object>, source: string) => Except<Object>;
