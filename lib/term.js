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
    function And(left, right) {
        this.left = left;
        this.right = right;
        this.type = 'and';
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
        _this.type = 'and';
        _this.connective = '$or';
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
        this.type = 'filter';
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
        this.type = 'match';
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
        _this.type = 'matchci';
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
    and: function (left, right) {
        return new And(left, right);
    },
    or: function (left, right) {
        return new Or(left, right);
    }
};
//# sourceMappingURL=term.js.map