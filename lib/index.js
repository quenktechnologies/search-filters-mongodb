"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compile_1 = require("@quenk/facets-dsl/lib/compile");
var term_1 = require("./term");
/**
 * defaultTerms for supporting the DSL.
 */
exports.defaultTerms = {
    and: term_1.and, or: term_1.or, empty: term_1.empty
};
/**
 * defaultPolicies that can be specified as strings instead of maps.
 */
exports.defaultPolicies = {
    number: {
        type: 'number',
        operators: ['=', '>=', '>=', '<=', '>=', '<', '>'],
        term: term_1.operator
    },
    string: {
        type: 'string',
        operators: ['='],
        term: term_1.regex
    },
    date: {
        type: 'string',
        operators: ['=', '>=', '>=', '<=', '>=', '<', '>'],
        term: term_1.operator
    }
};
/**
 * defaultOptions used during compilation.
 */
exports.defaultOptions = {
    maxFilters: 100
};
/**
 * compile a string into a MongoDB query object.
 */
exports.compile = function (ctx, source) {
    return compile_1.source2Term(ctx, source).chain(function (t) { return t.compile(); });
};
//# sourceMappingURL=index.js.map