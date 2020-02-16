"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var term = require("./term");
var compile_1 = require("@quenk/search-filters/lib/compile");
var compile_2 = require("@quenk/search-filters/lib/compile");
var record_1 = require("@quenk/noni/lib/data/record");
/**
 * availablePolicies this module ships with.
 */
exports.availablePolicies = {
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
     * date filters date fields using the equality or relational operators.
     */
    date: {
        type: 'date',
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
        type: 'list-dates',
        operators: ['in', '!in'],
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
    }
};
/**
 * MongoDBFilterCompiler provides a compiler for converting a valid search-filters
 * string into a valid mongodb filter.
 *
 * These filters are intended to be used with the mongodb package and may not
 * work with more opinionated libraries.
 */
var MongoDBFilterCompiler = /** @class */ (function () {
    function MongoDBFilterCompiler(options, policies, terms) {
        if (options === void 0) { options = {}; }
        if (policies === void 0) { policies = {}; }
        if (terms === void 0) { terms = term.requiredTerms; }
        this.options = options;
        this.policies = policies;
        this.terms = terms;
    }
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
    MongoDBFilterCompiler.prototype.compile = function (enabled, src) {
        var _a = this, terms = _a.terms, policies = _a.policies, options = _a.options;
        return compile_1.compile(compile_2.newContext(terms, record_1.merge(exports.availablePolicies, policies), options), enabled, src);
    };
    return MongoDBFilterCompiler;
}());
exports.MongoDBFilterCompiler = MongoDBFilterCompiler;
//# sourceMappingURL=index.js.map