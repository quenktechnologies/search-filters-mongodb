import { Object } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import { AvailablePolicies as _AvailablePolicies, EnabledPolicies as _EnabledPolicies } from '@quenk/search-filters/lib/compile/policy';
import { Options, Source } from '@quenk/search-filters/lib/compile';
export { Options };
/**
 * AvailablePolicies specialised for this module.
 */
export declare type AvailablePolicies = _AvailablePolicies<Object>;
/**
 * EnabledPolicies specialised to this module.
 */
export declare type EnabledPolicies = _EnabledPolicies<Object>;
/**
 * availablePolicies this module ships with.
 */
export declare const availablePolicies: AvailablePolicies;
/**
 * MongoDBFilterCompiler provides a compiler for converting a valid search-filters
 * string into a valid mongodb filter.
 *
 * These filters are intended to be used with the mongodb package and may not
 * work with more opinionated libraries.
 */
export declare class MongoDBFilterCompiler {
    options: Partial<Options>;
    policies: AvailablePolicies;
    terms: import("@quenk/search-filters/lib/compile/term").TermFactory<Object>;
    constructor(options?: Partial<Options>, policies?: AvailablePolicies, terms?: import("@quenk/search-filters/lib/compile/term").TermFactory<Object>);
    /**
     * compile a Source string into a filter according to the EnabledPolicies
     * provided.
     *
     * The EnabledPolicies can make use of the builtin availableProperties
     * exported by using the key name instead of a Policy definition.
     *
     * The options and policies passed in the constructor are merged with
     * the defaults to allow additional options and AvailablePolicies to be
     * specified.
     */
    compile(enabled: EnabledPolicies, src: Source): Except<Object>;
}
