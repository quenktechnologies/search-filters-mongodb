import * as term from './term';

import { Object } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import {
    AvailablePolicies,
    EnabledPolicies
} from '@quenk/search-filters/lib/compile/policy';
import {
    Options,
    Source,
    compile
} from '@quenk/search-filters/lib/compile';
import { newContext } from '@quenk/search-filters/lib/compile';
import { merge } from '@quenk/noni/lib/data/record';

export { AvailablePolicies, EnabledPolicies, Options }

/**
 * availablePolicies this module ships with.
 */
export const availablePolicies: AvailablePolicies<Object> = {

    number: {

        type: 'number',
        operators: ['=', '<', '>', '>=', '<=', '!='],
        term: term.Filter.create

    },
    boolean: {

        type: 'boolean',
        operators: ['=', '<', '>', '>=', '<=', '!='],
        term: term.Filter.create

    },
    string: {

        type: 'string',
        operators: ['=', '!='],
        term: term.Filter.create

    },
    date: {

        type: 'date',
        operators: ['=', '<', '>', '>=', '<=', '!='],
        term: term.Filter.create

    },
    match: {

        type: 'string',
        operators: ['='],
        term: term.Match.create

    },
    matchci: {

        type: 'string',
        operators: ['='],
        term: term.MatchCI.create

    }

};

/**
 * MongoDBFilterCompiler provides a compiler for converting a valid search-filters
 * string into a valid mongodb filter. 
 *
 * These filters are intended to be used with the mongodb package and may not
 * work with more opinionated libraries.
 */
export class MongoDBFilterCompiler {

    constructor(
        public options: Partial<Options> = {},
        public policies: AvailablePolicies<Object> = {},
        public terms = term.requiredTerms) { }

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
    compile(enabled: EnabledPolicies<Object>, src: Source): Except<Object> {

        let { terms, policies, options } = this;

        return compile(newContext(terms, merge(availablePolicies, policies),
            options), enabled, src);

    }

}
