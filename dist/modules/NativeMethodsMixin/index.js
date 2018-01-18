'use strict';

exports.__esModule = true;

var _createDOMProps = require('../createDOMProps');

var _createDOMProps2 = _interopRequireDefault(_createDOMProps);

var _findNodeHandle = require('../../exports/findNodeHandle');

var _findNodeHandle2 = _interopRequireDefault(_findNodeHandle);

var _i18nStyle = require('../../exports/StyleSheet/i18nStyle');

var _i18nStyle2 = _interopRequireDefault(_i18nStyle);

var _registry = require('../../exports/StyleSheet/registry');

var _registry2 = _interopRequireDefault(_registry);

var _UIManager = require('../../exports/UIManager');

var _UIManager2 = _interopRequireDefault(_UIManager);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var hyphenPattern = /-([a-z])/g; /**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule NativeMethodsMixin
 *
 */

var toCamelCase = function toCamelCase(str) {
  return str.replace(hyphenPattern, function(m) {
    return m[1].toUpperCase();
  });
};

var NativeMethodsMixin = {
  /**
   * Removes focus from an input or view. This is the opposite of `focus()`.
   */
  blur: function blur() {
    _UIManager2.default.blur((0, _findNodeHandle2.default)(this));
  },

  /**
   * Requests focus for the given input or view.
   * The exact behavior triggered will depend the type of view.
   */
  focus: function focus() {
    _UIManager2.default.focus((0, _findNodeHandle2.default)(this));
  },

  /**
   * Determines the position and dimensions of the view
   */
  measure: function measure(callback) {
    _UIManager2.default.measure((0, _findNodeHandle2.default)(this), callback);
  },

  /**
   * Determines the location of the given view in the window and returns the
   * values via an async callback. If the React root view is embedded in
   * another native view, this will give you the absolute coordinates. If
   * successful, the callback will be called be called with the following
   * arguments:
   *
   *  - x
   *  - y
   *  - width
   *  - height
   *
   * Note that these measurements are not available until after the rendering
   * has been completed.
   */
  measureInWindow: function measureInWindow(callback) {
    _UIManager2.default.measureInWindow((0, _findNodeHandle2.default)(this), callback);
  },

  /**
   * Measures the view relative to another view (usually an ancestor)
   */
  measureLayout: function measureLayout(relativeToNativeNode, onSuccess, onFail) {
    _UIManager2.default.measureLayout(
      (0, _findNodeHandle2.default)(this),
      relativeToNativeNode,
      onFail,
      onSuccess
    );
  },

  /**
   * This function sends props straight to the underlying DOM node.
   * This works as if all styles were set as inline styles. Since a DOM node
   * may aleady be styled with class names and inline styles, we need to get
   * the initial styles from the DOM node and merge them with incoming props.
   */
  setNativeProps: function setNativeProps(nativeProps) {
    if (!nativeProps) {
      return;
    }

    // Copy of existing DOM state
    var node = (0, _findNodeHandle2.default)(this);
    var nodeStyle = node.style;
    var classList = Array.prototype.slice.call(node.classList);
    var style = {};
    // DOM style is a CSSStyleDeclaration
    // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
    for (var i = 0; i < node.style.length; i += 1) {
      var property = nodeStyle.item(i);
      if (property) {
        // DOM style uses hyphenated prop names and may include vendor prefixes
        // Transform back into React DOM style.
        style[toCamelCase(property)] = nodeStyle.getPropertyValue(property);
      }
    }

    var domStyleProps = { classList: classList, style: style };
    var props = Object.assign({}, nativeProps, {
      style: (0, _i18nStyle2.default)(nativeProps.style)
    });
    // Next DOM state
    var domProps = (0, _createDOMProps2.default)(null, props, function(style) {
      return _registry2.default.resolveStateful(style, domStyleProps, { i18n: false });
    });
    _UIManager2.default.updateView(node, domProps, this);
  }
};

exports.default = NativeMethodsMixin;
