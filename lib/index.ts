import { Object  } from '@quenk/noni/lib/data/json';
import { Except } from '@quenk/noni/lib/control/error';
import { TermConstructors } from '@quenk/facets-dsl/lib/compile/term';
import { Policies } from '@quenk/facets-dsl/lib/compile/context/policy';
import { Context } from '@quenk/facets-dsl/lib/compile/context';
import { Source, source2Term } from '@quenk/facets-dsl/lib/compile';
import { and, or, empty, operator, regex } from './term';

/**
 * defaultTerms for supporting the DSL.
 */
export const defaultTerms: TermConstructors<Object> = {
    and, or, empty
};

/**
 * defaultPolicies that can be specified as strings instead of maps.
 */
export const defaultPolicies: Policies<Object> = {

    number: {

        type: 'number',
        operators: ['=', '>=', '>=', '<=', '>=', '<', '>'],
        term: operator

    },
    string: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    date: {

        type: 'string',
        operators: ['=', '>=', '>=', '<=', '>=', '<', '>'],
        term: operator

    }

};

/**
 * defaultOptions used during compilation.
 */
export const defaultOptions = {

    maxFilters: 100

};

/**
 * compile a string into a MongoDB query object.
 */
export const compile = (ctx: Context<Object>, source: Source): Except<Object> =>
    source2Term(ctx, source).chain(t => t.compile());

