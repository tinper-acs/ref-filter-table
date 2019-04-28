'use strict';

exports.__esModule = true;
exports.createRefMultipleTableModal = exports.createRefMultipleTable = exports.RefFilterTable = exports.RefFilterTableWithInput = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _setPrototypeOf = require('babel-runtime/core-js/object/set-prototype-of');

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _extends = _assign2["default"] || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RefFilterTableBaseUI = require('./components/RefFilterTableBaseUI');

var _RefFilterTableBaseUI2 = _interopRequireDefault(_RefFilterTableBaseUI);

var _RefCoreWithInput = require('ref-core/lib/refs/RefCoreWithInput');

var _RefCoreWithInput2 = _interopRequireDefault(_RefCoreWithInput);

var _createApi = require('ref-core/lib/utils/createApi.js');

var _RefCoreGlobal = require('ref-core/lib/refs/RefCoreGlobal');

var _RefCoreGlobal2 = _interopRequireDefault(_RefCoreGlobal);

require('ref-core/css/refcore.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2["default"])(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2["default"] ? (0, _setPrototypeOf2["default"])(subClass, superClass) : subClass.__proto__ = superClass; }

// import './index.less' //webpack打包需要放开
function RefFilterTable(props) {
    return _react2["default"].createElement(
        _RefCoreGlobal2["default"],
        props,
        _react2["default"].createElement(_RefFilterTableBaseUI2["default"], null)
    );
}
function createRefMultipleTable(selector, props, callback) {
    return (0, _createApi.createRefInput)(selector, _react2["default"].createElement(RefFilterTableWithInput, null), props, function (param) {
        if (typeof callback === 'function') {
            callback(param);
        }
    });
}
function createRefMultipleTableModal(props, callback) {
    return (0, _createApi.createRefModal)(_extends({
        component: _react2["default"].createElement(RefFilterTable, null)
    }, props), function (param) {
        if (typeof callback === 'function') {
            callback(param);
        }
    });
}

var RefFilterTableWithInput = function (_Component) {
    _inherits(RefFilterTableWithInput, _Component);

    function RefFilterTableWithInput() {
        _classCallCheck(this, RefFilterTableWithInput);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    RefFilterTableWithInput.prototype.render = function render() {
        return _react2["default"].createElement(
            _RefCoreWithInput2["default"],
            this.props,
            _react2["default"].createElement(RefFilterTable, null)
        );
    };

    return RefFilterTableWithInput;
}(_react.Component);

exports["default"] = _RefFilterTableBaseUI2["default"];
exports.RefFilterTableWithInput = RefFilterTableWithInput;
exports.RefFilterTable = RefFilterTable;
exports.createRefMultipleTable = createRefMultipleTable;
exports.createRefMultipleTableModal = createRefMultipleTableModal;