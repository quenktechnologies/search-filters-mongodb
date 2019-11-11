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
var moment = require("moment");
var either_1 = require("@quenk/noni/lib/data/either");
var ops = {
    '>': '$gt',
    '<': '$lt',
    '=': '$eq',
    '!=': '$neq',
    '>=': '$gte',
    '<=': '$lte',
};
/**
 * Empty compiles to an empty string.
 */
var Empty = /** @class */ (function () {
    function Empty() {
    }
    Empty.prototype.compile = function () {
        return either_1.right({});
    };
    return Empty;
}());
exports.Empty = Empty;
/**
 * And compiles to an SQL and.
 */
var And = /** @class */ (function () {
    function And(left, right) {
        this.left = left;
        this.right = right;
        this.op = '$and';
    }
    And.prototype.compile = function () {
        var _a;
        var eitherL = this.left.compile();
        if (eitherL.isLeft())
            return eitherL;
        var eitherR = this.right.compile();
        if (eitherR.isLeft())
            return eitherR;
        return either_1.right((_a = {}, _a[this.op] = [eitherL.takeRight(), eitherR.takeRight()], _a));
    };
    return And;
}());
exports.And = And;
/**
 * Or compiles to an SQL or.
 */
var Or = /** @class */ (function (_super) {
    __extends(Or, _super);
    function Or() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.op = '$or';
        return _this;
    }
    return Or;
}(And));
exports.Or = Or;
/**
 * Operator compiles to the supported SQL comparison.
 */
var Operator = /** @class */ (function () {
    function Operator(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
    Operator.prototype.compile = function () {
        var _a, _b;
        return either_1.right((_a = {}, _a[this.field] = (_b = {}, _b[ops[this.operator]] = this.value, _b), _a));
    };
    return Operator;
}());
exports.Operator = Operator;
/**
 * Regex condition.
 */
var Regex = /** @class */ (function () {
    function Regex(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
    Regex.prototype.compile = function () {
        var _a;
        return either_1.right((_a = {},
            _a[this.field] = {
                $regex: escapeR(this.value),
                $options: 'i'
            },
            _a));
    };
    return Regex;
}());
exports.Regex = Regex;
/**
 * Date condition
 */
var Date = /** @class */ (function () {
    function Date(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
    Date.prototype.compile = function () {
        var _a, _b;
        var d = moment.utc(String(this.value)).startOf('day');
        return either_1.right((_a = {},
            _a[this.field] = (_b = {},
                _b[ops[this.operator]] = d.toDate(),
                _b),
            _a));
    };
    return Date;
}());
exports.Date = Date;
var escapeR = function (value) {
    var s = String(value);
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
/**
 * and Term provider.
 */
exports.and = function (_, left, right) { return new And(left, right); };
/**
 * or Term provider.
 */
exports.or = function (_, left, right) { return new Or(left, right); };
/**
 * empty Term provider.
 */
exports.empty = function () { return new Empty(); };
/**
 * operator Term provider.
 */
exports.operator = function (_, _a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return new Operator(field, operator, value);
};
/**
 * regex term provider
 */
exports.regex = function (_, _a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return new Regex(field, operator, value);
};
/**
 * date term provider
 */
exports.date = function (_, _a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return new Date(field, operator, value);
};
//# sourceMappingURL=term.js.map