'use strict';

exports.__esModule = true;

var _createReactDOMStyle = require('./createReactDOMStyle');

var _createReactDOMStyle2 = _interopRequireDefault(_createReactDOMStyle);

var _flattenArray = require('../../modules/flattenArray');

var _flattenArray2 = _interopRequireDefault(_flattenArray);

var _flattenStyle = require('./flattenStyle');

var _flattenStyle2 = _interopRequireDefault(_flattenStyle);

var _I18nManager = require('../I18nManager');

var _I18nManager2 = _interopRequireDefault(_I18nManager);

var _i18nStyle = require('./i18nStyle');

var _i18nStyle2 = _interopRequireDefault(_i18nStyle);

var _prefixStyles = require('../../modules/prefixStyles');

var _ReactNativePropRegistry = require('../../modules/ReactNativePropRegistry');

var _ReactNativePropRegistry2 = _interopRequireDefault(_ReactNativePropRegistry);

var _StyleManager = require('./StyleManager');

var _StyleManager2 = _interopRequireDefault(_StyleManager);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
} /**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * WARNING: changes to this file in particular can cause significant changes to
 * the results of render performance benchmarks.
 *
 * @noflow
 */

var emptyObject = {};

var createCacheKey = function createCacheKey(id) {
  var prefix = 'rn';
  return prefix + '-' + id;
};

var classListToString = function classListToString(list) {
  return list.join(' ').trim();
};

var StyleRegistry = (function() {
  function StyleRegistry() {
    _classCallCheck(this, StyleRegistry);

    this.cache = { ltr: {}, rtl: {} };
    this.styleManager = new _StyleManager2.default();
  }

  StyleRegistry.prototype.getStyleSheets = function getStyleSheets() {
    return this.styleManager.getStyleSheets();
  };

  /**
   * Registers and precaches a React Native style object to HTML class names
   */

  StyleRegistry.prototype.register = function register(flatStyle) {
    var id = _ReactNativePropRegistry2.default.register(flatStyle);
    this._registerById(id);
    return id;
  };

  StyleRegistry.prototype._registerById = function _registerById(id) {
    var _this = this;

    var dir = _I18nManager2.default.isRTL ? 'rtl' : 'ltr';
    if (!this.cache[dir][id]) {
      var style = (0, _flattenStyle2.default)(id);
      var domStyle = (0, _createReactDOMStyle2.default)((0, _i18nStyle2.default)(style));
      Object.keys(domStyle).forEach(function(styleProp) {
        var value = domStyle[styleProp];
        if (value != null) {
          _this.styleManager.setDeclaration(styleProp, value);
        }
      });
      this.cache[dir][id] = true;
    }
  };

  /**
   * Resolves a React Native style object to DOM attributes
   */

  StyleRegistry.prototype.resolve = function resolve(reactNativeStyle) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyObject;

    if (!reactNativeStyle) {
      return emptyObject;
    }

    // fast and cachable
    if (typeof reactNativeStyle === 'number') {
      this._registerById(reactNativeStyle);
      var _key = createCacheKey(reactNativeStyle);
      return this._resolveStyleIfNeeded(reactNativeStyle, options, _key);
    }

    // resolve a plain RN style object
    if (!Array.isArray(reactNativeStyle)) {
      return this._resolveStyle(reactNativeStyle, options);
    }

    // flatten the style array
    // cache resolved props when all styles are registered
    // otherwise fallback to resolving
    var flatArray = (0, _flattenArray2.default)(reactNativeStyle);
    var isArrayOfNumbers = true;
    for (var i = 0; i < flatArray.length; i++) {
      var id = flatArray[i];
      if (typeof id !== 'number') {
        isArrayOfNumbers = false;
      } else {
        this._registerById(id);
      }
    }
    var key = isArrayOfNumbers ? createCacheKey(flatArray.join('-')) : null;
    return this._resolveStyleIfNeeded(flatArray, options, key);
  };

  /**
   * Resolves a React Native style object to DOM attributes, accounting for
   * the existing styles applied to the DOM node.
   *
   * To determine the next style, some of the existing DOM state must be
   * converted back into React Native styles.
   */

  StyleRegistry.prototype.resolveStateful = function resolveStateful(
    rnStyleNext,
    domStyleProps,
    options
  ) {
    var _this2 = this;

    var rdomClassList = domStyleProps.classList,
      rdomStyle = domStyleProps.style;

    // Convert the DOM classList back into a React Native form
    // Preserves unrecognized class names.

    var _rdomClassList$reduce = rdomClassList.reduce(
        function(styleProps, className) {
          var _styleManager$getDecl = _this2.styleManager.getDeclaration(className),
            prop = _styleManager$getDecl.prop,
            value = _styleManager$getDecl.value;

          if (prop) {
            styleProps.style[prop] = value;
          } else {
            styleProps.classList.push(className);
          }
          return styleProps;
        },
        { classList: [], style: {} }
      ),
      rnClassList = _rdomClassList$reduce.classList,
      rnStyle = _rdomClassList$reduce.style;

    // Create next DOM style props from current and next RN styles

    var _resolve = this.resolve([rnStyle, rnStyleNext], options),
      rdomClassListNext = _resolve.classList,
      rdomStyleNext = _resolve.style;

    // Next class names take priority over current inline styles

    var style = Object.assign({}, rdomStyle);
    rdomClassListNext.forEach(function(className) {
      var _styleManager$getDecl2 = _this2.styleManager.getDeclaration(className),
        prop = _styleManager$getDecl2.prop;

      if (style[prop]) {
        style[prop] = '';
      }
    });

    // Next inline styles take priority over current inline styles
    Object.assign(style, rdomStyleNext);

    // Add the current class names not managed by React Native
    var className = classListToString(rdomClassListNext.concat(rnClassList));

    return { className: className, style: style };
  };

  /**
   * Resolves a React Native style object
   */

  StyleRegistry.prototype._resolveStyle = function _resolveStyle(reactNativeStyle, options) {
    var _this3 = this;

    var flatStyle = (0, _flattenStyle2.default)(reactNativeStyle);
    var domStyle = (0, _createReactDOMStyle2.default)(
      options.i18n === false ? flatStyle : (0, _i18nStyle2.default)(flatStyle)
    );

    var props = Object.keys(domStyle).reduce(
      function(props, styleProp) {
        var value = domStyle[styleProp];
        if (value != null) {
          var className = _this3.styleManager.getClassName(styleProp, value);
          if (className) {
            props.classList.push(className);
          } else {
            if (!props.style) {
              props.style = {};
            }
            // 4x slower render
            props.style[styleProp] = value;
          }
        }
        return props;
      },
      { classList: [] }
    );

    props.className = classListToString(props.classList);
    if (props.style) {
      props.style = (0, _prefixStyles.prefixInlineStyles)(props.style);
    }
    return props;
  };

  /**
   * Caching layer over 'resolveStyle'
   */

  StyleRegistry.prototype._resolveStyleIfNeeded = function _resolveStyleIfNeeded(
    style,
    options,
    key
  ) {
    var dir = _I18nManager2.default.isRTL ? 'rtl' : 'ltr';
    if (key) {
      if (!this.cache[dir][key]) {
        // slow: convert style object to props and cache
        this.cache[dir][key] = this._resolveStyle(style, options);
      }
      return this.cache[dir][key];
    }
    return this._resolveStyle(style, options);
  };

  return StyleRegistry;
})();

exports.default = StyleRegistry;
