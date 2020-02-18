import * as term from './term';

import { Object } from '@quenk/noni/lib/data/jsonx';
import { Except } from '@quenk/noni/lib/control/error';
import {
    AvailablePolicies as _AvailablePolicies,
    EnabledPolicies as _EnabledPolicies
} from '@quenk/search-filters/lib/compile/policy';
import {
    Options,
    Source,
    compile
} from '@quenk/search-filters/lib/compile';
import { newContext } from '@quenk/search-filters/lib/compile';
import { merge } from '@quenk/noni/lib/data/record';

export { Options }

/**
 * AvailablePolicies specialised for this module.
 */
export type AvailablePolicies = _AvailablePolicies<Object>;

/**
 * EnabledPolicies specialised to this module.
 */
export type EnabledPolicies = _EnabledPolicies<Object>;

/**
 * availablePolicies this module ships with.
 */
export const availablePolicies: AvailablePolicies = {

    /**
     * number filters numeric fields using equality or relational
     * operators.
     */
    number: {

        type: 'number',
        operators: ['=', '!=', '<', '>', '>=', '<='],
        term: term.Filter.create

    },

    /**
     * boolean filters boolean fields using the equality operators.
     */
    boolean: {

        type: 'boolean',
        operators: ['=', '!='],
        term: term.Filter.create

    },

    /**
     * string filters string fields using the equailty operators.
     */
    string: {

        type: 'string',
        operators: ['=', '!='],
        term: term.Filter.create

    },

    /**
     * match filters string fields using the '$regex' operator.
     *
     * This works by converting the user input into a regular expression.
     */
    match: {

        type: 'string',
        operators: ['='],
        term: term.Match.create

    },

    /**
     * matchci is the case-insensitive version of match.
     */
    matchci: {

        type: 'string',
        operators: ['='],
        term: term.MatchCI.create

    },

    /**
     * date filters for dates without time portion.
     * Users equality or relational operators.
     */
    date: {

        type: 'date',
        operators: ['=', '!=', '<', '>', '>=', '<='],
        term: term.DateFilter.create

    },

    /**
     * datetime filters for dates with time portion.
     * Uses equality or relational operators.
     */
    datetime: {

        type: 'datetime',
        operators: ['=', '!=', '<', '>', '>=', '<='],
        term: term.Filter.create

    },

    /**
     * numbers $in or $nin tests a field against a list of numbers.
     */
    numbers: {

        type: 'list-number',
        operators: ['in', '!in'],
        term: term.Filter.create

    },

    /**
     * booleans $in or $nin tests a field against a list of booleans.
     */
    booleans: {

        type: 'list-boolean',
        operators: ['in', '!in'],
        term: term.Filter.create

    },

    /**
     * strings $in or $nin tests a field against a list of strings.
     */
    strings: {

        type: 'list-string',
        operators: ['in', '!in'],
        term: term.Filter.create

    },

    /**
     * dates $in or $nin tests a field against a list of dates.
     */
    dates: {

        type: 'list-date',
        operators: ['in', '!in'],
        term: term.Filter.create

    },

    /**
     * datetimes $in or $nin tests a field against a list of datetime.
     */
    datetimes: {

        type: 'list-datetime',
        operators: ['in', '!in'],
        term: term.Filter.create

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
        public policies: AvailablePolicies = {},
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
    compile(enabled: EnabledPolicies, src: Source): Except<Object> {

        let { terms, policies, options } = this;

        return compile(newContext(terms, merge(availablePolicies, policies),
            options), enabled, src);

    }

}
