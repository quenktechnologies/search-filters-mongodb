"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
exports.TYPE_AND = 'and';
exports.TYPE_OR = 'or';
exports.TYPE_FILTER = 'filter';
exports.TYPE_MATCH = 'match';
exports.TYPE_MATCH_CI = 'matchci';
/**
 * nativeOps maps the supported search-filters operators to mongodb operators.
 */
exports.nativeOps = {
    '>': '$gt',
    '<': '$lt',
    '=': '$eq',
    '!=': '$neq',
    '>=': '$gte',
    '<=': '$lte',
    'in': '$in',
    '!in': '$nin'
};
/**
 * Empty
 */
var Empty = /** @class */ (function () {
    function Empty() {
        this.type = 'empty';
    }
    Empty.prototype.compile = function () {
        return either_1.right({});
    };
    return Empty;
}());
exports.Empty = Empty;
/**
 * And
 */
var And = /** @class */ (function () {
    function And(lhs, rhs) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.type = exports.TYPE_AND;
    }
    And.prototype.compile = function () {
        var _a;
        var op = "$" + this.type;
        var eLeft = this.lhs.compile();
        if (eLeft.isLeft())
            return eLeft;
        var eRight = this.rhs.compile();
        if (eRight.isLeft())
            return eRight;
        var lval = eLeft.takeRight();
        var rval = eRight.takeRight();
        if (this.lhs.type === this.type) {
            if (this.rhs.type === this.type)
                lval[op] = __spreadArrays(lval[op], rval[op]);
            else
                lval[op].push(rval);
            return either_1.right(lval);
        }
        else {
            return either_1.right((_a = {},
                _a[op] = [eLeft.takeRight(), eRight.takeRight()],
                _a));
        }
    };
    return And;
}());
exports.And = And;
/**
 * Or
 */
var Or = /** @class */ (function (_super) {
    __extends(Or, _super);
    function Or() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.TYPE_OR;
        return _this;
    }
    return Or;
}(And));
exports.Or = Or;
/**
 * Filter
 */
var Filter = /** @class */ (function () {
    function Filter(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.type = exports.TYPE_FILTER;
    }
    Filter.prototype.compile = function () {
        var _a, _b;
        return either_1.right((_a = {},
            _a[this.field] = (_b = {}, _b[exports.nativeOps[this.operator]] = this.value, _b),
            _a));
    };
    Filter.create = function (field, operator, value) { return new Filter(field, operator, value); };
    return Filter;
}());
exports.Filter = Filter;
/**
 * Match
 */
var Match = /** @class */ (function () {
    function Match(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.type = exports.TYPE_MATCH;
    }
    Match.prototype.compile = function () {
        var _a;
        return either_1.right((_a = {},
            _a[this.field] = {
                $regex: escapeR(this.value)
            },
            _a));
    };
    Match.create = function (field, operator, value) { return new Match(field, operator, value); };
    return Match;
}());
exports.Match = Match;
/**
 * MatchCI
 */
var MatchCI = /** @class */ (function (_super) {
    __extends(MatchCI, _super);
    function MatchCI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.TYPE_MATCH_CI;
        return _this;
    }
    MatchCI.prototype.compile = function () {
        var _a;
        return either_1.right((_a = {},
            _a[this.field] = {
                $regex: escapeR(this.value),
                $options: 'i'
            },
            _a));
    };
    MatchCI.create = function (field, operator, value) { return new MatchCI(field, operator, value); };
    return MatchCI;
}(Match));
exports.MatchCI = MatchCI;
var escapeR = function (value) {
    var s = String(value);
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
/**
 * requiredTerms all search-filters compilers must support.
 */
exports.requiredTerms = {
    empty: function () {
        return new Empty();
    },
    and: function (lhs, rhs) {
        return new And(lhs, rhs);
    },
    or: function (lhs, rhs) {
        return new Or(lhs, rhs);
    }
};
//# sourceMappingURL=term.js.map