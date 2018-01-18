'use strict';

exports.__esModule = true;
exports.default = renderApplication;
exports.getApplication = getApplication;

var _AppContainer = require('./AppContainer');

var _AppContainer2 = _interopRequireDefault(_AppContainer);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _hydrate = require('../../modules/hydrate');

var _hydrate2 = _interopRequireDefault(_hydrate);

var _render = require('../render');

var _render2 = _interopRequireDefault(_render);

var _StyleSheet = require('../StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

var renderFn = process.env.NODE_ENV !== 'production' ? _render2.default : _hydrate2.default;

function renderApplication(RootComponent, initialProps, rootTag) {
  (0, _invariant2.default)(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  renderFn(
    _react2.default.createElement(
      _AppContainer2.default,
      { rootTag: rootTag },
      _react2.default.createElement(RootComponent, initialProps)
    ),
    rootTag
  );
}

function getApplication(RootComponent, initialProps) {
  var element = _react2.default.createElement(
    _AppContainer2.default,
    { rootTag: {} },
    _react2.default.createElement(RootComponent, initialProps)
  );
  var stylesheets = _StyleSheet2.default.getStyleSheets().map(function(sheet) {
    return (// ensure that CSS text is not escaped
      _react2.default.createElement('style', {
        dangerouslySetInnerHTML: { __html: sheet.textContent },
        id: sheet.id,
        key: sheet.id
      }) );
  });
  return { element: element, stylesheets: stylesheets };
}
