'use strict';

exports.__esModule = true;

var _AccessibilityUtil = require('../AccessibilityUtil');

var _AccessibilityUtil2 = _interopRequireDefault(_AccessibilityUtil);

var _StyleSheet = require('../../exports/StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _registry = require('../../exports/StyleSheet/registry');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
} /**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

var emptyObject = {};

var resetStyles = _StyleSheet2.default.create({
  ariaButton: {
    cursor: 'pointer'
  },
  button: {
    appearance: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'inherit'
  },
  heading: {
    font: 'inherit'
  },
  link: {
    backgroundColor: 'transparent',
    color: 'inherit',
    textDecorationLine: 'none'
  },
  list: {
    listStyle: 'none'
  }
});

var pointerEventsStyles = _StyleSheet2.default.create({
  auto: {
    pointerEvents: 'auto'
  },
  'box-none': {
    pointerEvents: 'box-none'
  },
  'box-only': {
    pointerEvents: 'box-only'
  },
  none: {
    pointerEvents: 'none'
  }
});

var defaultStyleResolver = function defaultStyleResolver(style) {
  return _registry2.default.resolve(style);
};

var createDOMProps = function createDOMProps(component, props, styleResolver) {
  if (!styleResolver) {
    styleResolver = defaultStyleResolver;
  }

  if (!props) {
    props = emptyObject;
  }

  var _props = props,
    accessibilityLabel = _props.accessibilityLabel,
    accessibilityLiveRegion = _props.accessibilityLiveRegion,
    importantForAccessibility = _props.importantForAccessibility,
    pointerEvents = _props.pointerEvents,
    providedStyle = _props.style,
    testID = _props.testID,
    accessible = _props.accessible,
    accessibilityComponentType = _props.accessibilityComponentType,
    accessibilityRole = _props.accessibilityRole,
    accessibilityTraits = _props.accessibilityTraits,
    domProps = _objectWithoutProperties(_props, [
      'accessibilityLabel',
      'accessibilityLiveRegion',
      'importantForAccessibility',
      'pointerEvents',
      'style',
      'testID',
      'accessible',
      'accessibilityComponentType',
      'accessibilityRole',
      'accessibilityTraits'
    ]);

  var isDisabled = _AccessibilityUtil2.default.isDisabled(props);
  var role = _AccessibilityUtil2.default.propsToAriaRole(props);
  var tabIndex = _AccessibilityUtil2.default.propsToTabIndex(props);
  var reactNativeStyle = [
    component === 'a' && resetStyles.link,
    component === 'button' && resetStyles.button,
    role === 'heading' && resetStyles.heading,
    component === 'ul' && resetStyles.list,
    role === 'button' && !isDisabled && resetStyles.ariaButton,
    providedStyle,
    pointerEvents && pointerEventsStyles[pointerEvents]
  ];

  var _styleResolver = styleResolver(reactNativeStyle),
    className = _styleResolver.className,
    style = _styleResolver.style;

  if (isDisabled) {
    domProps['aria-disabled'] = true;
  }
  if (importantForAccessibility === 'no-hide-descendants') {
    domProps['aria-hidden'] = true;
  }
  if (accessibilityLabel && accessibilityLabel.constructor === String) {
    domProps['aria-label'] = accessibilityLabel;
  }
  if (accessibilityLiveRegion && accessibilityLiveRegion.constructor === String) {
    domProps['aria-live'] = accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion;
  }
  if (className && className.constructor === String) {
    domProps.className = domProps.className ? domProps.className + ' ' + className : className;
  }
  if (component === 'a' && domProps.target === '_blank') {
    domProps.rel = (domProps.rel || '') + ' noopener noreferrer';
  }
  if (role && role.constructor === String && role !== 'label') {
    domProps.role = role;
  }
  if (style) {
    domProps.style = style;
  }
  if (tabIndex) {
    domProps.tabIndex = tabIndex;
  }
  if (testID && testID.constructor === String) {
    domProps['data-testid'] = testID;
  }

  return domProps;
};

exports.default = createDOMProps;
