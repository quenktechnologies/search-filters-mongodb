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
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
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
};
/**
 * Empty
 */
var Empty = /** @class */ (function () {
    function Empty() {
    }
    Empty.prototype.compile = function () {
        return either_1.right({});
    };
    Empty.create = function () { return new Empty(); };
    return Empty;
}());
exports.Empty = Empty;
/**
 * And
 */
var And = /** @class */ (function () {
    function And(left, right) {
        this.left = left;
        this.right = right;
        this.connective = '$and';
    }
    And.prototype.compile = function () {
        var _a;
        var eitherL = this.left.compile();
        if (eitherL.isLeft())
            return eitherL;
        var eitherR = this.right.compile();
        if (eitherR.isLeft())
            return eitherR;
        return either_1.right((_a = {},
            _a[this.connective] = [eitherL.takeRight(), eitherR.takeRight()],
            _a));
    };
    And.create = function (_, left, right) { return new And(left, right); };
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
        _this.connective = '$or';
        return _this;
    }
    Or.create = function (_, left, right) { return new Or(left, right); };
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
    }
    Filter.prototype.compile = function () {
        var _a, _b;
        return either_1.right((_a = {},
            _a[this.field] = (_b = {}, _b[exports.nativeOps[this.operator]] = this.value, _b),
            _a));
    };
    Filter.create = function (_, _a) {
        var field = _a.field, operator = _a.operator, value = _a.value;
        return new Filter(field, operator, value);
    };
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
    }
    Match.prototype.compile = function () {
        var _a;
        return either_1.right((_a = {},
            _a[this.field] = {
                $regex: escapeR(this.value)
            },
            _a));
    };
    Match.create = function (_, _a) {
        var field = _a.field, operator = _a.operator, value = _a.value;
        return new Match(field, operator, value);
    };
    return Match;
}());
exports.Match = Match;
/**
 * MatchCI
 */
var MatchCI = /** @class */ (function (_super) {
    __extends(MatchCI, _super);
    function MatchCI() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    MatchCI.create = function (_, _a) {
        var field = _a.field, operator = _a.operator, value = _a.value;
        return new MatchCI(field, operator, value);
    };
    return MatchCI;
}(Match));
exports.MatchCI = MatchCI;
var escapeR = function (value) {
    var s = String(value);
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
//# sourceMappingURL=term.js.map