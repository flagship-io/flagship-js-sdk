(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flagship"] = factory();
	else
		root["flagship"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@flagship.io/js-sdk-logs/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@flagship.io/js-sdk-logs/dist/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FlagshipLogger = {
    getLogger: function (config, name) {
        if (name === void 0) { name = 'Flagship SDK'; }
        var enableConsoleLogs = config.enableConsoleLogs, nodeEnv = config.nodeEnv;
        var printTimestamp = function () { return "[" + new Date().toISOString().slice(11, -5) + "]"; };
        return {
            warn: function (str) { return (enableConsoleLogs ? console.warn(printTimestamp() + " - " + name + " - " + str) : null); },
            error: function (str) { return (enableConsoleLogs ? console.error(printTimestamp() + " - " + name + " - " + str) : null); },
            info: function (str) { return (enableConsoleLogs ? console.log(printTimestamp() + " - " + name + " - " + str) : null); },
            fatal: function (str) {
                return enableConsoleLogs ? console.error(printTimestamp() + " - FATAL - " + name + " - " + str) : null;
            },
            debug: function (str) {
                return nodeEnv && nodeEnv !== 'production' && enableConsoleLogs
                    ? console.log(printTimestamp() + " - DEBUG - " + name + " - " + str)
                    : null;
            }
        };
    }
};
exports.default = FlagshipLogger;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };
    var errorListener;

    // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.
    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/buffer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/buffer/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/react-native-murmurhash/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-native-murmurhash/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, Buffer) {global.Buffer = global.Buffer || __webpack_require__(/*! buffer */ "./node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer;
const createBuffer =
  Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow
    ? Buffer.from
    : // support for Node < 5.10
      (val) => new Buffer(val);

/**
 * JS Implementation of MurmurHash2
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {Buffer} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function MurmurHashV2(str, seed) {
  if (!Buffer.isBuffer(str)) str = createBuffer(str);
  var l = str.length,
    h = seed ^ l,
    i = 0,
    k;

  while (l >= 4) {
    k =
      (str[i] & 0xff) |
      ((str[++i] & 0xff) << 8) |
      ((str[++i] & 0xff) << 16) |
      ((str[++i] & 0xff) << 24);

    k =
      (k & 0xffff) * 0x5bd1e995 + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16);
    k ^= k >>> 24;
    k =
      (k & 0xffff) * 0x5bd1e995 + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16);

    h =
      ((h & 0xffff) * 0x5bd1e995 +
        ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^
      k;

    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str[i + 2] & 0xff) << 16;
    case 2:
      h ^= (str[i + 1] & 0xff) << 8;
    case 1:
      h ^= str[i] & 0xff;
      h =
        (h & 0xffff) * 0x5bd1e995 +
        ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16);
  h ^= h >>> 15;

  return h >>> 0;
}

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {Buffer} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function MurmurHashV3(key, seed) {
  if (!Buffer.isBuffer(key)) key = createBuffer(key);

  var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

  remainder = key.length & 3; // key.length % 4
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 =
      (key[i] & 0xff) |
      ((key[++i] & 0xff) << 8) |
      ((key[++i] & 0xff) << 16) |
      ((key[++i] & 0xff) << 24);
    ++i;

    k1 =
      ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 =
      ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b =
      ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (key[i + 2] & 0xff) << 16;
    case 2:
      k1 ^= (key[i + 1] & 0xff) << 8;
    case 1:
      k1 ^= key[i] & 0xff;

      k1 =
        ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
        0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 =
        ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
        0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 =
    ((h1 & 0xffff) * 0x85ebca6b +
      ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 13;
  h1 =
    ((h1 & 0xffff) * 0xc2b2ae35 +
      ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

const murmur = {
  MurmurHashV2,
  MurmurHashV3,
};

module.exports = murmur;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../node-libs-browser/node_modules/buffer/index.js */ "./node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/validate.js/validate.js":
/*!**********************************************!*\
  !*** ./node_modules/validate.js/validate.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*!
 * validate.js 0.13.1
 *
 * (c) 2013-2019 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */

(function(exports, module, define) {
  "use strict";

  // The main function that calls the validators specified by the constraints.
  // The options are the following:
  //   - format (string) - An option that controls how the returned value is formatted
  //     * flat - Returns a flat array of just the error messages
  //     * grouped - Returns the messages grouped by attribute (default)
  //     * detailed - Returns an array of the raw validation data
  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
  //
  // Please note that the options are also passed to each validator.
  var validate = function(attributes, constraints, options) {
    options = v.extend({}, v.options, options);

    var results = v.runValidations(attributes, constraints, options)
      , attr
      , validator;

    if (results.some(function(r) { return v.isPromise(r.error); })) {
      throw new Error("Use validate.async if you want support for promises");
    }
    return validate.processValidationResults(results, options);
  };

  var v = validate;

  // Copies over attributes from one or more sources to a single destination.
  // Very much similar to underscore's extend.
  // The first argument is the target object and the remaining arguments will be
  // used as sources.
  v.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var attr in source) {
        obj[attr] = source[attr];
      }
    });
    return obj;
  };

  v.extend(validate, {
    // This is the version of the library as a semver.
    // The toString function will allow it to be coerced into a string
    version: {
      major: 0,
      minor: 13,
      patch: 1,
      metadata: null,
      toString: function() {
        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
        if (!v.isEmpty(v.version.metadata)) {
          version += "+" + v.version.metadata;
        }
        return version;
      }
    },

    // Below is the dependencies that are used in validate.js

    // The constructor of the Promise implementation.
    // If you are using Q.js, RSVP or any other A+ compatible implementation
    // override this attribute to be the constructor of that promise.
    // Since jQuery promises aren't A+ compatible they won't work.
    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

    EMPTY_STRING_REGEXP: /^\s*$/,

    // Runs the validators specified by the constraints object.
    // Will return an array of the format:
    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
    runValidations: function(attributes, constraints, options) {
      var results = []
        , attr
        , validatorName
        , value
        , validators
        , validator
        , validatorOptions
        , error;

      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
        attributes = v.collectFormValues(attributes);
      }

      // Loops through each constraints, finds the correct validator and run it.
      for (attr in constraints) {
        value = v.getDeepObjectValue(attributes, attr);
        // This allows the constraints for an attribute to be a function.
        // The function will be called with the value, attribute name, the complete dict of
        // attributes as well as the options and constraints passed in.
        // This is useful when you want to have different
        // validations depending on the attribute value.
        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

        for (validatorName in validators) {
          validator = v.validators[validatorName];

          if (!validator) {
            error = v.format("Unknown validator %{name}", {name: validatorName});
            throw new Error(error);
          }

          validatorOptions = validators[validatorName];
          // This allows the options to be a function. The function will be
          // called with the value, attribute name, the complete dict of
          // attributes as well as the options and constraints passed in.
          // This is useful when you want to have different
          // validations depending on the attribute value.
          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
          if (!validatorOptions) {
            continue;
          }
          results.push({
            attribute: attr,
            value: value,
            validator: validatorName,
            globalOptions: options,
            attributes: attributes,
            options: validatorOptions,
            error: validator.call(validator,
                value,
                validatorOptions,
                attr,
                attributes,
                options)
          });
        }
      }

      return results;
    },

    // Takes the output from runValidations and converts it to the correct
    // output format.
    processValidationResults: function(errors, options) {
      errors = v.pruneEmptyErrors(errors, options);
      errors = v.expandMultipleErrors(errors, options);
      errors = v.convertErrorMessages(errors, options);

      var format = options.format || "grouped";

      if (typeof v.formatters[format] === 'function') {
        errors = v.formatters[format](errors);
      } else {
        throw new Error(v.format("Unknown format %{format}", options));
      }

      return v.isEmpty(errors) ? undefined : errors;
    },

    // Runs the validations with support for promises.
    // This function will return a promise that is settled when all the
    // validation promises have been completed.
    // It can be called even if no validations returned a promise.
    async: function(attributes, constraints, options) {
      options = v.extend({}, v.async.options, options);

      var WrapErrors = options.wrapErrors || function(errors) {
        return errors;
      };

      // Removes unknown attributes
      if (options.cleanAttributes !== false) {
        attributes = v.cleanAttributes(attributes, constraints);
      }

      var results = v.runValidations(attributes, constraints, options);

      return new v.Promise(function(resolve, reject) {
        v.waitForResults(results).then(function() {
          var errors = v.processValidationResults(results, options);
          if (errors) {
            reject(new WrapErrors(errors, options, attributes, constraints));
          } else {
            resolve(attributes);
          }
        }, function(err) {
          reject(err);
        });
      });
    },

    single: function(value, constraints, options) {
      options = v.extend({}, v.single.options, options, {
        format: "flat",
        fullMessages: false
      });
      return v({single: value}, {single: constraints}, options);
    },

    // Returns a promise that is resolved when all promises in the results array
    // are settled. The promise returned from this function is always resolved,
    // never rejected.
    // This function modifies the input argument, it replaces the promises
    // with the value returned from the promise.
    waitForResults: function(results) {
      // Create a sequence of all the results starting with a resolved promise.
      return results.reduce(function(memo, result) {
        // If this result isn't a promise skip it in the sequence.
        if (!v.isPromise(result.error)) {
          return memo;
        }

        return memo.then(function() {
          return result.error.then(function(error) {
            result.error = error || null;
          });
        });
      }, new v.Promise(function(r) { r(); })); // A resolved promise
    },

    // If the given argument is a call: function the and: function return the value
    // otherwise just return the value. Additional arguments will be passed as
    // arguments to the function.
    // Example:
    // ```
    // result('foo') // 'foo'
    // result(Math.max, 1, 2) // 2
    // ```
    result: function(value) {
      var args = [].slice.call(arguments, 1);
      if (typeof value === 'function') {
        value = value.apply(null, args);
      }
      return value;
    },

    // Checks if the value is a number. This function does not consider NaN a
    // number like many other `isNumber` functions do.
    isNumber: function(value) {
      return typeof value === 'number' && !isNaN(value);
    },

    // Returns false if the object is not a function
    isFunction: function(value) {
      return typeof value === 'function';
    },

    // A simple check to verify that the value is an integer. Uses `isNumber`
    // and a simple modulo check.
    isInteger: function(value) {
      return v.isNumber(value) && value % 1 === 0;
    },

    // Checks if the value is a boolean
    isBoolean: function(value) {
      return typeof value === 'boolean';
    },

    // Uses the `Object` function to check if the given argument is an object.
    isObject: function(obj) {
      return obj === Object(obj);
    },

    // Simply checks if the object is an instance of a date
    isDate: function(obj) {
      return obj instanceof Date;
    },

    // Returns false if the object is `null` of `undefined`
    isDefined: function(obj) {
      return obj !== null && obj !== undefined;
    },

    // Checks if the given argument is a promise. Anything with a `then`
    // function is considered a promise.
    isPromise: function(p) {
      return !!p && v.isFunction(p.then);
    },

    isJqueryElement: function(o) {
      return o && v.isString(o.jquery);
    },

    isDomElement: function(o) {
      if (!o) {
        return false;
      }

      if (!o.querySelectorAll || !o.querySelector) {
        return false;
      }

      if (v.isObject(document) && o === document) {
        return true;
      }

      // http://stackoverflow.com/a/384380/699304
      /* istanbul ignore else */
      if (typeof HTMLElement === "object") {
        return o instanceof HTMLElement;
      } else {
        return o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
      }
    },

    isEmpty: function(value) {
      var attr;

      // Null and undefined are empty
      if (!v.isDefined(value)) {
        return true;
      }

      // functions are non empty
      if (v.isFunction(value)) {
        return false;
      }

      // Whitespace only strings are empty
      if (v.isString(value)) {
        return v.EMPTY_STRING_REGEXP.test(value);
      }

      // For arrays we use the length property
      if (v.isArray(value)) {
        return value.length === 0;
      }

      // Dates have no attributes but aren't empty
      if (v.isDate(value)) {
        return false;
      }

      // If we find at least one property we consider it non empty
      if (v.isObject(value)) {
        for (attr in value) {
          return false;
        }
        return true;
      }

      return false;
    },

    // Formats the specified strings with the given values like so:
    // ```
    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
    // ```
    // If you want to write %{...} without having it replaced simply
    // prefix it with % like this `Foo: %%{foo}` and it will be returned
    // as `"Foo: %{foo}"`
    format: v.extend(function(str, vals) {
      if (!v.isString(str)) {
        return str;
      }
      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
        if (m1 === '%') {
          return "%{" + m2 + "}";
        } else {
          return String(vals[m2]);
        }
      });
    }, {
      // Finds %{key} style patterns in the given string
      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
    }),

    // "Prettifies" the given string.
    // Prettifying means replacing [.\_-] with spaces as well as splitting
    // camel case words.
    prettify: function(str) {
      if (v.isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        }
      }

      if (v.isArray(str)) {
        return str.map(function(s) { return v.prettify(s); }).join(", ");
      }

      if (v.isObject(str)) {
        if (!v.isDefined(str.toString)) {
          return JSON.stringify(str);
        }

        return str.toString();
      }

      // Ensure the string is actually a string
      str = "" + str;

      return str
        // Splits keys separated by periods
        .replace(/([^\s])\.([^\s])/g, '$1 $2')
        // Removes backslashes
        .replace(/\\+/g, '')
        // Replaces - and - with space
        .replace(/[_-]/g, ' ')
        // Splits camel cased words
        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
          return "" + m1 + " " + m2.toLowerCase();
        })
        .toLowerCase();
    },

    stringifyValue: function(value, options) {
      var prettify = options && options.prettify || v.prettify;
      return prettify(value);
    },

    isString: function(value) {
      return typeof value === 'string';
    },

    isArray: function(value) {
      return {}.toString.call(value) === '[object Array]';
    },

    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    isHash: function(value) {
      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
    },

    contains: function(obj, value) {
      if (!v.isDefined(obj)) {
        return false;
      }
      if (v.isArray(obj)) {
        return obj.indexOf(value) !== -1;
      }
      return value in obj;
    },

    unique: function(array) {
      if (!v.isArray(array)) {
        return array;
      }
      return array.filter(function(el, index, array) {
        return array.indexOf(el) == index;
      });
    },

    forEachKeyInKeypath: function(object, keypath, callback) {
      if (!v.isString(keypath)) {
        return undefined;
      }

      var key = ""
        , i
        , escape = false;

      for (i = 0; i < keypath.length; ++i) {
        switch (keypath[i]) {
          case '.':
            if (escape) {
              escape = false;
              key += '.';
            } else {
              object = callback(object, key, false);
              key = "";
            }
            break;

          case '\\':
            if (escape) {
              escape = false;
              key += '\\';
            } else {
              escape = true;
            }
            break;

          default:
            escape = false;
            key += keypath[i];
            break;
        }
      }

      return callback(object, key, true);
    },

    getDeepObjectValue: function(obj, keypath) {
      if (!v.isObject(obj)) {
        return undefined;
      }

      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
        if (v.isObject(obj)) {
          return obj[key];
        }
      });
    },

    // This returns an object with all the values of the form.
    // It uses the input name as key and the value as value
    // So for example this:
    // <input type="text" name="email" value="foo@bar.com" />
    // would return:
    // {email: "foo@bar.com"}
    collectFormValues: function(form, options) {
      var values = {}
        , i
        , j
        , input
        , inputs
        , option
        , value;

      if (v.isJqueryElement(form)) {
        form = form[0];
      }

      if (!form) {
        return values;
      }

      options = options || {};

      inputs = form.querySelectorAll("input[name], textarea[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);

        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        var name = input.name.replace(/\./g, "\\\\.");
        value = v.sanitizeFormValue(input.value, options);
        if (input.type === "number") {
          value = value ? +value : null;
        } else if (input.type === "checkbox") {
          if (input.attributes.value) {
            if (!input.checked) {
              value = values[name] || null;
            }
          } else {
            value = input.checked;
          }
        } else if (input.type === "radio") {
          if (!input.checked) {
            value = values[name] || null;
          }
        }
        values[name] = value;
      }

      inputs = form.querySelectorAll("select[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);
        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        if (input.multiple) {
          value = [];
          for (j in input.options) {
            option = input.options[j];
             if (option && option.selected) {
              value.push(v.sanitizeFormValue(option.value, options));
            }
          }
        } else {
          var _val = typeof input.options[input.selectedIndex] !== 'undefined' ? input.options[input.selectedIndex].value : /* istanbul ignore next */ '';
          value = v.sanitizeFormValue(_val, options);
        }
        values[input.name] = value;
      }

      return values;
    },

    sanitizeFormValue: function(value, options) {
      if (options.trim && v.isString(value)) {
        value = value.trim();
      }

      if (options.nullify !== false && value === "") {
        return null;
      }
      return value;
    },

    capitalize: function(str) {
      if (!v.isString(str)) {
        return str;
      }
      return str[0].toUpperCase() + str.slice(1);
    },

    // Remove all errors who's error attribute is empty (null or undefined)
    pruneEmptyErrors: function(errors) {
      return errors.filter(function(error) {
        return !v.isEmpty(error.error);
      });
    },

    // In
    // [{error: ["err1", "err2"], ...}]
    // Out
    // [{error: "err1", ...}, {error: "err2", ...}]
    //
    // All attributes in an error with multiple messages are duplicated
    // when expanding the errors.
    expandMultipleErrors: function(errors) {
      var ret = [];
      errors.forEach(function(error) {
        // Removes errors without a message
        if (v.isArray(error.error)) {
          error.error.forEach(function(msg) {
            ret.push(v.extend({}, error, {error: msg}));
          });
        } else {
          ret.push(error);
        }
      });
      return ret;
    },

    // Converts the error mesages by prepending the attribute name unless the
    // message is prefixed by ^
    convertErrorMessages: function(errors, options) {
      options = options || {};

      var ret = []
        , prettify = options.prettify || v.prettify;
      errors.forEach(function(errorInfo) {
        var error = v.result(errorInfo.error,
            errorInfo.value,
            errorInfo.attribute,
            errorInfo.options,
            errorInfo.attributes,
            errorInfo.globalOptions);

        if (!v.isString(error)) {
          ret.push(errorInfo);
          return;
        }

        if (error[0] === '^') {
          error = error.slice(1);
        } else if (options.fullMessages !== false) {
          error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
        }
        error = error.replace(/\\\^/g, "^");
        error = v.format(error, {
          value: v.stringifyValue(errorInfo.value, options)
        });
        ret.push(v.extend({}, errorInfo, {error: error}));
      });
      return ret;
    },

    // In:
    // [{attribute: "<attributeName>", ...}]
    // Out:
    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
    groupErrorsByAttribute: function(errors) {
      var ret = {};
      errors.forEach(function(error) {
        var list = ret[error.attribute];
        if (list) {
          list.push(error);
        } else {
          ret[error.attribute] = [error];
        }
      });
      return ret;
    },

    // In:
    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
    // Out:
    // ["<message 1>", "<message 2>"]
    flattenErrorsToArray: function(errors) {
      return errors
        .map(function(error) { return error.error; })
        .filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
    },

    cleanAttributes: function(attributes, whitelist) {
      function whitelistCreator(obj, key, last) {
        if (v.isObject(obj[key])) {
          return obj[key];
        }
        return (obj[key] = last ? true : {});
      }

      function buildObjectWhitelist(whitelist) {
        var ow = {}
          , lastObject
          , attr;
        for (attr in whitelist) {
          if (!whitelist[attr]) {
            continue;
          }
          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
        }
        return ow;
      }

      function cleanRecursive(attributes, whitelist) {
        if (!v.isObject(attributes)) {
          return attributes;
        }

        var ret = v.extend({}, attributes)
          , w
          , attribute;

        for (attribute in attributes) {
          w = whitelist[attribute];

          if (v.isObject(w)) {
            ret[attribute] = cleanRecursive(ret[attribute], w);
          } else if (!w) {
            delete ret[attribute];
          }
        }
        return ret;
      }

      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
        return {};
      }

      whitelist = buildObjectWhitelist(whitelist);
      return cleanRecursive(attributes, whitelist);
    },

    exposeModule: function(validate, root, exports, module, define) {
      if (exports) {
        if (module && module.exports) {
          exports = module.exports = validate;
        }
        exports.validate = validate;
      } else {
        root.validate = validate;
        if (validate.isFunction(define) && define.amd) {
          define([], function () { return validate; });
        }
      }
    },

    warn: function(msg) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[validate.js] " + msg);
      }
    },

    error: function(msg) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[validate.js] " + msg);
      }
    }
  });

  validate.validators = {
    // Presence validates that the value isn't empty
    presence: function(value, options) {
      options = v.extend({}, this.options, options);
      if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
        return options.message || this.message || "can't be blank";
      }
    },
    length: function(value, options, attribute) {
      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var is = options.is
        , maximum = options.maximum
        , minimum = options.minimum
        , tokenizer = options.tokenizer || function(val) { return val; }
        , err
        , errors = [];

      value = tokenizer(value);
      var length = value.length;
      if(!v.isNumber(length)) {
        return options.message || this.notValid || "has an incorrect length";
      }

      // Is checks
      if (v.isNumber(is) && length !== is) {
        err = options.wrongLength ||
          this.wrongLength ||
          "is the wrong length (should be %{count} characters)";
        errors.push(v.format(err, {count: is}));
      }

      if (v.isNumber(minimum) && length < minimum) {
        err = options.tooShort ||
          this.tooShort ||
          "is too short (minimum is %{count} characters)";
        errors.push(v.format(err, {count: minimum}));
      }

      if (v.isNumber(maximum) && length > maximum) {
        err = options.tooLong ||
          this.tooLong ||
          "is too long (maximum is %{count} characters)";
        errors.push(v.format(err, {count: maximum}));
      }

      if (errors.length > 0) {
        return options.message || errors;
      }
    },
    numericality: function(value, options, attribute, attributes, globalOptions) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var errors = []
        , name
        , count
        , checks = {
            greaterThan:          function(v, c) { return v > c; },
            greaterThanOrEqualTo: function(v, c) { return v >= c; },
            equalTo:              function(v, c) { return v === c; },
            lessThan:             function(v, c) { return v < c; },
            lessThanOrEqualTo:    function(v, c) { return v <= c; },
            divisibleBy:          function(v, c) { return v % c === 0; }
          }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      // Strict will check that it is a valid looking number
      if (v.isString(value) && options.strict) {
        var pattern = "^-?(0|[1-9]\\d*)";
        if (!options.onlyInteger) {
          pattern += "(\\.\\d+)?";
        }
        pattern += "$";

        if (!(new RegExp(pattern).test(value))) {
          return options.message ||
            options.notValid ||
            this.notValid ||
            this.message ||
            "must be a valid number";
        }
      }

      // Coerce the value to a number unless we're being strict.
      if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
        value = +value;
      }

      // If it's not a number we shouldn't continue since it will compare it.
      if (!v.isNumber(value)) {
        return options.message ||
          options.notValid ||
          this.notValid ||
          this.message ||
          "is not a number";
      }

      // Same logic as above, sort of. Don't bother with comparisons if this
      // doesn't pass.
      if (options.onlyInteger && !v.isInteger(value)) {
        return options.message ||
          options.notInteger ||
          this.notInteger ||
          this.message ||
          "must be an integer";
      }

      for (name in checks) {
        count = options[name];
        if (v.isNumber(count) && !checks[name](value, count)) {
          // This picks the default message if specified
          // For example the greaterThan check uses the message from
          // this.notGreaterThan so we capitalize the name and prepend "not"
          var key = "not" + v.capitalize(name);
          var msg = options[key] ||
            this[key] ||
            this.message ||
            "must be %{type} %{count}";

          errors.push(v.format(msg, {
            count: count,
            type: prettify(name)
          }));
        }
      }

      if (options.odd && value % 2 !== 1) {
        errors.push(options.notOdd ||
            this.notOdd ||
            this.message ||
            "must be odd");
      }
      if (options.even && value % 2 !== 0) {
        errors.push(options.notEven ||
            this.notEven ||
            this.message ||
            "must be even");
      }

      if (errors.length) {
        return options.message || errors;
      }
    },
    datetime: v.extend(function(value, options) {
      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
      }

      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var err
        , errors = []
        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
        , latest = options.latest ? this.parse(options.latest, options) : NaN;

      value = this.parse(value, options);

      // 86400000 is the number of milliseconds in a day, this is used to remove
      // the time from the date
      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
        err = options.notValid ||
          options.message ||
          this.notValid ||
          "must be a valid date";
        return v.format(err, {value: arguments[0]});
      }

      if (!isNaN(earliest) && value < earliest) {
        err = options.tooEarly ||
          options.message ||
          this.tooEarly ||
          "must be no earlier than %{date}";
        err = v.format(err, {
          value: this.format(value, options),
          date: this.format(earliest, options)
        });
        errors.push(err);
      }

      if (!isNaN(latest) && value > latest) {
        err = options.tooLate ||
          options.message ||
          this.tooLate ||
          "must be no later than %{date}";
        err = v.format(err, {
          date: this.format(latest, options),
          value: this.format(value, options)
        });
        errors.push(err);
      }

      if (errors.length) {
        return v.unique(errors);
      }
    }, {
      parse: null,
      format: null
    }),
    date: function(value, options) {
      options = v.extend({}, options, {dateOnly: true});
      return v.validators.datetime.call(v.validators.datetime, value, options);
    },
    format: function(value, options) {
      if (v.isString(options) || (options instanceof RegExp)) {
        options = {pattern: options};
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is invalid"
        , pattern = options.pattern
        , match;

      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }

      if (v.isString(pattern)) {
        pattern = new RegExp(options.pattern, options.flags);
      }
      match = pattern.exec(value);
      if (!match || match[0].length != value.length) {
        return message;
      }
    },
    inclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (v.contains(options.within, value)) {
        return;
      }
      var message = options.message ||
        this.message ||
        "^%{value} is not included in the list";
      return v.format(message, {value: value});
    },
    exclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (!v.contains(options.within, value)) {
        return;
      }
      var message = options.message || this.message || "^%{value} is restricted";
      if (v.isString(options.within[value])) {
        value = options.within[value];
      }
      return v.format(message, {value: value});
    },
    email: v.extend(function(value, options) {
      options = v.extend({}, this.options, options);
      var message = options.message || this.message || "is not a valid email";
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }
      if (!this.PATTERN.exec(value)) {
        return message;
      }
    }, {
      PATTERN: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
    }),
    equality: function(value, options, attribute, attributes, globalOptions) {
      if (!v.isDefined(value)) {
        return;
      }

      if (v.isString(options)) {
        options = {attribute: options};
      }
      options = v.extend({}, this.options, options);
      var message = options.message ||
        this.message ||
        "is not equal to %{attribute}";

      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
        throw new Error("The attribute must be a non empty string");
      }

      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
        , comparator = options.comparator || function(v1, v2) {
          return v1 === v2;
        }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      if (!comparator(value, otherValue, options, attribute, attributes)) {
        return v.format(message, {attribute: prettify(options.attribute)});
      }
    },
    // A URL validator that is used to validate URLs with the ability to
    // restrict schemes and some domains.
    url: function(value, options) {
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is not a valid url"
        , schemes = options.schemes || this.schemes || ['http', 'https']
        , allowLocal = options.allowLocal || this.allowLocal || false
        , allowDataUrl = options.allowDataUrl || this.allowDataUrl || false;
      if (!v.isString(value)) {
        return message;
      }

      // https://gist.github.com/dperini/729294
      var regex =
        "^" +
        // protocol identifier
        "(?:(?:" + schemes.join("|") + ")://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:";

      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

      if (allowLocal) {
        tld += "?";
      } else {
        regex +=
          // IP address exclusion
          // private & local networks
          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
      }

      regex +=
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          // host name
          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
          // domain name
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
          tld +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
      "$";

      if (allowDataUrl) {
        // RFC 2397
        var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
        var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
        var dataurl = "data:(?:"+mediaType+")?(?:;base64)?,"+urlchar;
        regex = "(?:"+regex+")|(?:^"+dataurl+"$)";
      }

      var PATTERN = new RegExp(regex, 'i');
      if (!PATTERN.exec(value)) {
        return message;
      }
    },
    type: v.extend(function(value, originalOptions, attribute, attributes, globalOptions) {
      if (v.isString(originalOptions)) {
        originalOptions = {type: originalOptions};
      }

      if (!v.isDefined(value)) {
        return;
      }

      var options = v.extend({}, this.options, originalOptions);

      var type = options.type;
      if (!v.isDefined(type)) {
        throw new Error("No type was specified");
      }

      var check;
      if (v.isFunction(type)) {
        check = type;
      } else {
        check = this.types[type];
      }

      if (!v.isFunction(check)) {
        throw new Error("validate.validators.type.types." + type + " must be a function.");
      }

      if (!check(value, options, attribute, attributes, globalOptions)) {
        var message = originalOptions.message ||
          this.messages[type] ||
          this.message ||
          options.message ||
          (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");

        if (v.isFunction(message)) {
          message = message(value, originalOptions, attribute, attributes, globalOptions);
        }

        return v.format(message, {attribute: v.prettify(attribute), type: type});
      }
    }, {
      types: {
        object: function(value) {
          return v.isObject(value) && !v.isArray(value);
        },
        array: v.isArray,
        integer: v.isInteger,
        number: v.isNumber,
        string: v.isString,
        date: v.isDate,
        boolean: v.isBoolean
      },
      messages: {}
    })
  };

  validate.formatters = {
    detailed: function(errors) {return errors;},
    flat: v.flattenErrorsToArray,
    grouped: function(errors) {
      var attr;

      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = v.flattenErrorsToArray(errors[attr]);
      }
      return errors;
    },
    constraint: function(errors) {
      var attr;
      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = errors[attr].map(function(result) {
          return result.validator;
        }).sort();
      }
      return errors;
    }
  };

  validate.exposeModule(validate, this, exports, module, __webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js"));
}).call(this,
         true ? /* istanbul ignore next */ exports : undefined,
         true ? /* istanbul ignore next */ module : undefined,
        __webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js"));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/class/bucketing/bucketing.ts":
/*!******************************************!*\
  !*** ./src/class/bucketing/bucketing.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var default_1 = __webpack_require__(/*! ../../config/default */ "./src/config/default.ts");
var loggerHelper_1 = __webpack_require__(/*! ../../lib/loggerHelper */ "./src/lib/loggerHelper.ts");
var flagshipSdkHelper_1 = __webpack_require__(/*! ../../lib/flagshipSdkHelper */ "./src/lib/flagshipSdkHelper.ts");
var Bucketing = /** @class */ (function (_super) {
    __extends(Bucketing, _super);
    function Bucketing(envId, config, panic) {
        var _this = _super.call(this) || this;
        _this.panic = panic;
        _this.config = config;
        _this.log = loggerHelper_1.default.getLogger(_this.config, "Flagship SDK - Bucketing");
        _this.envId = envId;
        _this.data = (config.initialBucketing && flagshipSdkHelper_1.default.checkBucketingApiResponse(config.initialBucketing, _this.log)) || null;
        _this.isPollingRunning = false;
        _this.lastModifiedDate = (_this.data && _this.data.lastModifiedDate) || null;
        // init listeners
        _this.on('launched', function ( /* {status} */) {
            if (flagshipSdkHelper_1.default.checkPollingIntervalValue(_this.config.pollingInterval) === 'ok' && _this.isPollingRunning) {
                _this.log.debug("startPolling - polling finished successfully. Next polling in " + _this.config.pollingInterval + " minute(s)");
                setTimeout(function () {
                    if (_this.isPollingRunning) {
                        _this.pollingMechanism();
                    }
                    else {
                        _this.log.debug('on("launched") listener - bucketing stop detected.');
                    }
                }, _this.config.pollingInterval * 1000); // nbSeconds * 1000 ms
            } // no need to do logs on "else" statement because already done before
        });
        _this.on('error', function (error) {
            if (flagshipSdkHelper_1.default.checkPollingIntervalValue(_this.config.pollingInterval) === 'ok' && _this.isPollingRunning) {
                _this.log.error("startPolling - polling failed with error \"" + error + "\". Next polling in " + _this.config.pollingInterval + " minute(s)");
                setTimeout(function () {
                    _this.pollingMechanism();
                }, _this.config.pollingInterval * 60 * 1000);
            }
        });
        return _this;
    }
    Bucketing.validateStatus = function (status) {
        return status < 400; // Resolve only if the status code is less than 400
    };
    Bucketing.prototype.callApi = function () {
        var _this = this;
        var axiosConfig = {
            headers: {
                'If-Modified-Since': this.lastModifiedDate !== null ? this.lastModifiedDate : ''
            },
            validateStatus: Bucketing.validateStatus
        };
        var url = default_1.internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId);
        return axios_1.default.get(url, axiosConfig)
            .then(function (_a) {
            var bucketingData = _a.data, status = _a.status, other = __rest(_a, ["data", "status"]);
            _this.panic.checkPanicMode(bucketingData);
            if (!_this.panic.enabled) {
                if (status === 304) {
                    _this.log.info("callApi - current bucketing up to date (api status=304)");
                }
                else if (status === 200) {
                    if (!other.headers['last-modified']) {
                        _this.log.warn("callApi - http GET request (url=\"" + url + "\") did not return attribute \"last-modified\"");
                    }
                    else {
                        _this.lastModifiedDate = other.headers['last-modified'];
                    }
                    _this.log.info("callApi - current bucketing updated");
                    _this.data = __assign(__assign({}, bucketingData), { lastModifiedDate: _this.lastModifiedDate });
                }
                else {
                    _this.log.error("callApi - unexpected status (=\"" + status + "\") received. This polling will be ignored.");
                }
            }
            _this.emit('launched', { status: status });
            return bucketingData;
        })
            .catch(function (response) {
            _this.log.fatal('An error occurred while fetching using bucketing...');
            _this.emit('error', response);
        });
    };
    Bucketing.prototype.stopPolling = function () {
        this.isPollingRunning = false;
    };
    Bucketing.prototype.pollingMechanism = function () {
        switch (flagshipSdkHelper_1.default.checkPollingIntervalValue(this.config.pollingInterval)) {
            case 'ok':
                this.isPollingRunning = true;
                this.log.debug("startPolling - starting a new polling...");
                this.callApi();
                break;
            case 'notSupported':
                this.isPollingRunning = false;
                this.log.error("startPolling - The \"pollingInterval\" setting has value=\"" + this.config.pollingInterval + "\" and type=\"" + typeof this.config
                    .pollingInterval + "\" which is not supported. The setting will be ignored and the bucketing api will be called only once for initialization.)");
                this.callApi();
                break;
            case 'underLimit':
            default:
                this.isPollingRunning = false;
                this.log.error("startPolling - The \"pollingInterval\" setting is below the limit (" + default_1.internalConfig.pollingIntervalMinValue + " second). The setting will be ignored and the bucketing api will be called only once for initialization.");
                this.callApi();
        }
    };
    Bucketing.prototype.startPolling = function () {
        if (this.isPollingRunning) {
            this.log.warn('startPolling - already running');
            return;
        }
        if (this.data === null) {
            this.log.debug('startPolling - initializing bucket');
        }
        this.pollingMechanism();
    };
    return Bucketing;
}(events_1.EventEmitter));
exports.default = Bucketing;


/***/ }),

/***/ "./src/class/bucketingVisitor/bucketingVisitor.ts":
/*!********************************************************!*\
  !*** ./src/class/bucketingVisitor/bucketingVisitor.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_murmurhash_1 = __webpack_require__(/*! react-native-murmurhash */ "./node_modules/react-native-murmurhash/index.js");
var loggerHelper_1 = __webpack_require__(/*! ../../lib/loggerHelper */ "./src/lib/loggerHelper.ts");
var flagshipSdkHelper_1 = __webpack_require__(/*! ../../lib/flagshipSdkHelper */ "./src/lib/flagshipSdkHelper.ts");
var BucketingVisitor = /** @class */ (function () {
    function BucketingVisitor(envId, visitorId, visitorContext, config, globalBucket) {
        var bucketingData = globalBucket.data;
        this.config = config;
        this.visitorId = visitorId;
        this.visitorContext = visitorContext;
        this.global = globalBucket;
        this.log = loggerHelper_1.default.getLogger(this.config, "Flagship SDK - Bucketing (visitorId=" + this.visitorId + ")");
        this.envId = envId;
        this.data = bucketingData || null;
        this.computedData = bucketingData ? { visitorId: this.visitorId, campaigns: this.getEligibleCampaigns() } : null;
    }
    BucketingVisitor.transformIntoDecisionApiPayload = function (variation, campaign, variationGroupId) {
        return {
            id: campaign.id,
            variationGroupId: variationGroupId,
            variation: {
                id: variation.id,
                // reference: variation.reference,
                modifications: __assign({}, variation.modifications)
            }
        };
    };
    BucketingVisitor.prototype.updateCache = function () {
        if (this.data !== this.global.data) {
            this.log.debug('Updating cache.');
            this.data = this.global.data;
            this.computedData = { visitorId: this.visitorId, campaigns: this.getEligibleCampaigns() };
            return true; // an update has been done
        }
        return true; // no updates needed
    };
    BucketingVisitor.prototype.updateVisitorContext = function (newContext) {
        this.log.debug("Updating bucketing visitor context from " + JSON.stringify(this.visitorContext) + " to " + JSON.stringify(newContext));
        this.visitorContext = flagshipSdkHelper_1.default.checkVisitorContext(newContext, this.log);
    };
    BucketingVisitor.prototype.computeMurmurAlgorithm = function (variations, variationGroupId) {
        var assignedVariation = null;
        // generates a v3 hash
        var murmurAllocation = react_native_murmurhash_1.MurmurHashV3(variationGroupId + this.visitorId, undefined) % 100; // 2nd argument is set to 0 by default
        this.log.debug("computeMurmurAlgorithm - murmur returned value=\"" + murmurAllocation + "\"");
        var variationTrafficCheck = variations.reduce(function (sum, v) {
            var variationAllocation = v.allocation || 0;
            var nextSum = variationAllocation + sum;
            if (assignedVariation === null && murmurAllocation < nextSum) {
                assignedVariation = v;
            }
            return nextSum;
        }, 0);
        if (variationTrafficCheck < 100) {
            this.log.debug("computeMurmurAlgorithm - the total variation traffic allocation is equal to \"" + variationTrafficCheck + "\"");
            if (assignedVariation === null) {
                this.log.info("computeMurmurAlgorithm - current visitor will be untracked as it is outside the total variation traffic allocation");
            }
        }
        if (variationTrafficCheck > 100) {
            this.log.fatal("computeMurmurAlgorithm - the total variation traffic allocation is equal to \"" + variationTrafficCheck + "\" instead of being equal to \"100\"");
            return null;
        }
        return assignedVariation;
    };
    BucketingVisitor.prototype.getEligibleCampaigns = function () {
        var _this = this;
        var result = [];
        var _a = this, visitorId = _a.visitorId, visitorContext = _a.visitorContext, log = _a.log, bucketingData = _a.data;
        var reportIssueBetweenValueTypeAndOperator = function (type, operator) {
            log.warn("getEligibleCampaigns - operator \"" + operator + "\" is not supported for type \"" + type + "\". Assertion aborted.");
        };
        var checkAssertion = function (vcValue, apiValueArray, assertionCallback) {
            return apiValueArray.map(function (apiValue) { return assertionCallback(vcValue, apiValue); }).filter(function (answer) { return answer === true; }).length > 0;
        };
        var computeAssertion = function (_a, compareWithVisitorId) {
            var operator = _a.operator, key = _a.key, value = _a.value;
            var vtc = compareWithVisitorId ? visitorId : visitorContext[key]; // vtc = 'value to compare'
            if (typeof vtc === 'undefined' || vtc === null) {
                log.debug("getEligibleCampaigns - Assertion aborted because visitor context key (=\"" + key + "\") does not exist");
                return false;
            }
            var checkTypeMatch = function (vcValue, apiValue, vcKey) {
                if (typeof apiValue !== 'object' && typeof vcValue !== typeof apiValue) {
                    log.error("getEligibleCampaigns - The bucketing API returned a value which have not the same type (\"" + typeof vcValue + "\") as the visitor context key=\"" + vcKey + "\"");
                    return false;
                }
                if (typeof apiValue === 'object' && !Array.isArray(apiValue)) {
                    log.error('getEligibleCampaigns - The bucketing API returned a json object which is not supported by the SDK.');
                    return false;
                }
                if (Array.isArray(apiValue)) {
                    if (apiValue.filter(function (v) { return typeof v !== typeof vcValue; }).length > 0) {
                        log.error("getEligibleCampaigns - The bucketing API returned an array where some elements do not have same type (\"" + typeof vcValue + "\") as the visitor context key=\"" + vcKey + "\"");
                        return false;
                    }
                }
                return true;
            };
            switch (operator) {
                case 'EQUALS':
                    if (Array.isArray(value)) {
                        return checkAssertion(vtc, value, function (a, b) { return a === b; });
                    }
                    return vtc === value;
                case 'NOT_EQUALS':
                    if (Array.isArray(value)) {
                        return checkAssertion(vtc, value, function (a, b) { return a !== b; });
                    }
                    return vtc !== value;
                case 'LOWER_THAN':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a.toLowerCase() < b.toLowerCase(); });
                                }
                                return vtc.toLowerCase() < value.toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a < b; });
                                }
                                return vtc < value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'LOWER_THAN_OR_EQUALS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a.toLowerCase() <= b.toLowerCase(); });
                                }
                                return vtc.toLowerCase() <= value.toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a <= b; });
                                }
                                return vtc <= value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN_OR_EQUALS');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'GREATER_THAN':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a.toLowerCase() > b.toLowerCase(); });
                                }
                                return vtc.toLowerCase() > value.toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a > b; });
                                }
                                return vtc > value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'GREATER_THAN_OR_EQUALS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a.toLowerCase() >= b.toLowerCase(); });
                                }
                                return vtc.toLowerCase() >= value.toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return a >= b; });
                                }
                                return vtc >= value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN_OR_EQUALS');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'STARTS_WITH':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) {
                                        return a.toLowerCase().startsWith(b.toLowerCase());
                                    });
                                }
                                return vtc.toLowerCase().startsWith(value.toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'STARTS_WITH');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'STARTS_WITH');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'ENDS_WITH':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) {
                                        return a.toLowerCase().endsWith(b.toLowerCase());
                                    });
                                }
                                return vtc.toLowerCase().endsWith(value.toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'ENDS_WITH');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'ENDS_WITH');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'CONTAINS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) {
                                        return a.toLowerCase().includes(b.toLowerCase());
                                    });
                                }
                                return vtc.toLowerCase().includes(value.toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'CONTAINS');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'CONTAINS');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'NOT_CONTAINS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion(vtc, value, function (a, b) { return !a.toLowerCase().includes(b.toLowerCase()); });
                                }
                                return !vtc.toLowerCase().includes(value.toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'NOT_CONTAINS');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'NOT_CONTAINS');
                                return false;
                        }
                    }
                    else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                default:
                    log.error("getEligibleCampaigns - unknown operator \"" + operator + "\" found in bucketing api answer. Assertion aborted.");
                    return false;
            }
        };
        if (!bucketingData || !bucketingData.campaigns) {
            log.warn('getEligibleCampaigns - no bucketing data found');
            return result;
        }
        bucketingData.campaigns.forEach(function (campaign) {
            var matchingVgId = null;
            // take the FIRST variation group which match the visitor context
            campaign.variationGroups.forEach(function (vg) {
                if (matchingVgId === null) {
                    var operatorOrBox_1 = [];
                    // each variation group is a 'OR' condition
                    vg.targeting.targetingGroups.forEach(function (tg) {
                        var operatorAndBox = [];
                        // each variation group is a 'OR' condition
                        tg.targetings.forEach(function (targeting) {
                            switch (targeting.key) {
                                case 'fs_all_users':
                                    operatorAndBox.push(true);
                                    break;
                                case 'fs_users':
                                    operatorAndBox.push(computeAssertion(targeting, true));
                                    break;
                                default:
                                    operatorAndBox.push(computeAssertion(targeting, false));
                                    break;
                            }
                        });
                        operatorOrBox_1.push(operatorAndBox.filter(function (answer) { return answer !== true; }).length === 0);
                    });
                    matchingVgId = operatorOrBox_1.filter(function (answer) { return answer === true; }).length > 0 ? vg.id : null;
                }
            });
            if (matchingVgId !== null) {
                log.debug("Bucketing - campaign (id=\"" + campaign.id + "\") is matching visitor context");
                var cleanCampaign = __assign(__assign({}, campaign), { variationGroups: campaign.variationGroups.filter(function (varGroup) { return varGroup.id === matchingVgId; }) }); // = campaign with only the desired variation group
                var variationToAffectToVisitor = _this.computeMurmurAlgorithm(cleanCampaign.variationGroups[0].variations, matchingVgId);
                if (variationToAffectToVisitor !== null) {
                    result.push(BucketingVisitor.transformIntoDecisionApiPayload(variationToAffectToVisitor, campaign, matchingVgId));
                }
                else {
                    log.debug("computeMurmurAlgorithm - Unable to find the corresponding variation (campaignId=\"" + campaign.id + "\") using murmur for visitor (id=\"" + visitorId + "\"). This visitor will be untracked.");
                }
            }
            else {
                log.debug("Bucketing - campaign (id=\"" + campaign.id + "\") NOT MATCHING visitor");
            }
        });
        return result;
    };
    return BucketingVisitor;
}());
exports.default = BucketingVisitor;


/***/ }),

/***/ "./src/class/flagship/flagship.ts":
/*!****************************************!*\
  !*** ./src/class/flagship/flagship.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var default_1 = __webpack_require__(/*! ../../config/default */ "./src/config/default.ts");
var flagshipSdkHelper_1 = __webpack_require__(/*! ../../lib/flagshipSdkHelper */ "./src/lib/flagshipSdkHelper.ts");
var loggerHelper_1 = __webpack_require__(/*! ../../lib/loggerHelper */ "./src/lib/loggerHelper.ts");
var bucketing_1 = __webpack_require__(/*! ../bucketing/bucketing */ "./src/class/bucketing/bucketing.ts");
var flagshipVisitor_1 = __webpack_require__(/*! ../flagshipVisitor/flagshipVisitor */ "./src/class/flagshipVisitor/flagshipVisitor.ts");
var panicMode_1 = __webpack_require__(/*! ../panicMode/panicMode */ "./src/class/panicMode/panicMode.ts");
var utils_1 = __webpack_require__(/*! ../../lib/utils */ "./src/lib/utils.ts");
var Flagship = /** @class */ (function () {
    function Flagship(envId, apiKey, config) {
        if (config === void 0) { config = {}; }
        var _a = flagshipSdkHelper_1.default.checkConfig(config, apiKey), cleanCustomConfig = _a.cleanConfig, ignoredConfig = _a.ignoredConfig;
        this.config = __assign(__assign({}, default_1.default), cleanCustomConfig);
        this.log = loggerHelper_1.default.getLogger(this.config);
        this.eventEmitter = new events_1.EventEmitter();
        this.bucket = null;
        this.panic = new panicMode_1.default(this.config);
        this.envId = envId;
        if (!apiKey) {
            this.log.warn('WARNING: "start" function signature will change in the next major release. "start(envId, settings)" will be "start(envId, apiKey, settings)", please make this change ASAP!');
        }
        else if (this.config && this.config.apiKey && flagshipSdkHelper_1.default.isUsingFlagshipApi('v1', this.config)) {
            // force API v2 if apiKey is set, whatever how
            this.config.flagshipApi = default_1.internalConfig.apiV2;
            this.log.debug('apiKey detected, forcing the use of Flagship api V2');
        }
        if (cleanCustomConfig) {
            this.log.debug('Custom flagship SDK config attribute(s) detected');
        }
        if (this.config.decisionMode === 'Bucketing') {
            this.bucket = new bucketing_1.default(this.envId, this.config, this.panic);
            if (this.config.fetchNow) {
                this.startBucketingPolling();
            }
        }
        // logs adjustment made on settings
        flagshipSdkHelper_1.default.logIgnoredAttributesFromObject(ignoredConfig, this.log, 'custom flagship SDK config');
        if (config.timeout && config.timeout !== this.config.timeout) {
            this.log.warn("\"timeout\" setting is incorrect (value specified =>\"" + config.timeout + "\"). The default value (=" + this.config.timeout + " seconds) has been set instead.");
        }
    }
    Flagship.prototype.newVisitor = function (id, context) {
        var _this = this;
        var logBook = {
            API: {
                newVisitorInfo: "new visitor (id=\"" + id + "\") calling decision API for initialization (waiting to be ready...)",
                modificationSuccess: "new visitor (id=\"" + id + "\") decision API finished (ready !)",
                modificationFailed: function (error) {
                    return "new visitor (id=\"" + id + "\") decision API failed during initialization with error \"" + error + "\"";
                }
            },
            Bucketing: {
                newVisitorInfo: "new visitor (id=\"" + id + "\") check for existing bucketing data (waiting to be ready...)",
                modificationSuccess: "new visitor (id=\"" + id + "\") (ready !)"
            }
        };
        this.log.info("Creating new visitor (id=\"" + id + "\")");
        var flagshipVisitorInstance = new flagshipVisitor_1.default(this.envId, this.config, this.bucket, id, context, this.panic);
        if (this.config.fetchNow || this.config.activateNow) {
            this.log.info(logBook[this.config.decisionMode].newVisitorInfo);
            flagshipVisitorInstance
                .getAllModifications(this.config.activateNow, { force: true })
                .then(function () {
                _this.log.info(logBook[_this.config.decisionMode].modificationSuccess);
                flagshipVisitorInstance.callEventEndpoint();
                flagshipVisitorInstance.emit('ready');
            })
                .catch(function (response) {
                if (_this.config.decisionMode !== 'Bucketing') {
                    _this.log.fatal(logBook[_this.config.decisionMode].modificationFailed(response));
                }
                flagshipVisitorInstance.emit('ready');
            });
        }
        else {
            // Before emit('ready'), make sure there is listener to it
            flagshipVisitorInstance.once('newListener', function (event, listener) {
                if (event === 'ready') {
                    listener();
                }
            });
        }
        return flagshipVisitorInstance;
    };
    // Pre-req: envId + visitorId must be the same
    /**
     * @returns {IFlagshipVisitor}
     * @description Used internally only. Don't use it outside the SDK !
     */
    Flagship.prototype.updateVisitor = function (visitorInstance, context) {
        this.log.debug("updateVisitor - updating visitor (id=\"" + visitorInstance.id + "\")");
        var flagshipVisitorInstance = new flagshipVisitor_1.default(this.envId, this.config, this.bucket, visitorInstance.id, context, this.panic, visitorInstance);
        if (((!utils_1.default.deepCompare(visitorInstance.context, context) || flagshipVisitorInstance.fetchedModifications === null) &&
            this.config.fetchNow) ||
            this.config.activateNow) {
            this.log.debug("updateVisitor - visitor(id=\"" + visitorInstance.id + "\") does not have modifications or context has changed + (fetchNow=" + this.config.fetchNow + " || activateNow=" + this.config.activateNow + ") detected, trying a synchronize...");
            flagshipVisitorInstance
                .synchronizeModifications(this.config.activateNow)
                .then(function () {
                flagshipVisitorInstance.emit('ready');
            })
                .catch(function () {
                flagshipVisitorInstance.emit('ready');
            });
        }
        else {
            flagshipVisitorInstance.once('newListener', function (event, listener) {
                if (event === 'ready') {
                    listener();
                }
            });
        }
        return flagshipVisitorInstance;
    };
    Flagship.prototype.startBucketingPolling = function () {
        var _this = this;
        if (this.bucket !== null && !this.bucket.isPollingRunning) {
            this.bucket.startPolling();
            this.bucket.on('launched', function (_a) {
                var status = _a.status;
                _this.eventEmitter.emit('bucketPollingSuccess', {
                    status: status,
                    payload: _this.bucket.data
                });
            });
            this.bucket.on('error', function (error) {
                _this.eventEmitter.emit('bucketPollingFailed', error);
            });
            return {
                success: true
            };
        }
        if (this.bucket !== null && this.bucket.isPollingRunning) {
            this.log.warn("startBucketingPolling - bucket already polling with interval set to \"" + this.config.pollingInterval + "\" minute(s).");
            return {
                success: false,
                reason: "startBucketingPolling - bucket already polling with interval set to \"" + this.config.pollingInterval + "\" minute(s)."
            };
        }
        this.log.error('startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"');
        return {
            success: false,
            reason: 'startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"'
        };
    };
    Flagship.prototype.stopBucketingPolling = function () {
        if (this.bucket !== null && this.bucket.isPollingRunning) {
            this.bucket.stopPolling();
            this.log.info('stopBucketingPolling - bucketing is stopped');
            return {
                success: true
            };
        }
        this.log.info('stopBucketingPolling - bucketing is already stopped');
        return {
            success: false,
            reason: 'stopBucketingPolling - bucketing is already stopped'
        };
    };
    return Flagship;
}());
exports.default = Flagship;


/***/ }),

/***/ "./src/class/flagshipVisitor/flagshipVisitor.ts":
/*!******************************************************!*\
  !*** ./src/class/flagshipVisitor/flagshipVisitor.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var flagshipSdkHelper_1 = __webpack_require__(/*! ../../lib/flagshipSdkHelper */ "./src/lib/flagshipSdkHelper.ts");
var loggerHelper_1 = __webpack_require__(/*! ../../lib/loggerHelper */ "./src/lib/loggerHelper.ts");
var bucketingVisitor_1 = __webpack_require__(/*! ../bucketingVisitor/bucketingVisitor */ "./src/class/bucketingVisitor/bucketingVisitor.ts");
var FlagshipVisitor = /** @class */ (function (_super) {
    __extends(FlagshipVisitor, _super);
    function FlagshipVisitor(envId, config, bucket, id, context, panic, previousVisitorInstance) {
        if (context === void 0) { context = {}; }
        if (previousVisitorInstance === void 0) { previousVisitorInstance = null; }
        var _this = _super.call(this) || this;
        _this.panic = panic;
        _this.config = config;
        _this.id = id;
        _this.log = loggerHelper_1.default.getLogger(_this.config, "Flagship SDK - visitorId:" + _this.id);
        _this.envId = envId;
        _this.context = flagshipSdkHelper_1.default.checkVisitorContext(context, _this.log);
        _this.isAllModificationsFetched = previousVisitorInstance ? previousVisitorInstance.isAllModificationsFetched : false;
        _this.bucket = null;
        // initialize "fetchedModifications" and "modificationsDetails"
        if (previousVisitorInstance) {
            _this.fetchedModifications = previousVisitorInstance ? previousVisitorInstance.fetchedModifications : null;
            _this.modificationsInternalStatus = previousVisitorInstance ? previousVisitorInstance.modificationsInternalStatus : null;
        }
        else if (config.initialModifications) {
            _this.saveModificationsInCache(config.initialModifications);
        }
        else {
            _this.fetchedModifications = null;
            _this.modificationsInternalStatus = null;
        }
        if (_this.config.decisionMode === 'Bucketing') {
            _this.bucket = new bucketingVisitor_1.default(_this.envId, _this.id, _this.context, _this.config, bucket);
        }
        return _this;
    }
    FlagshipVisitor.prototype.activateCampaign = function (variationId, variationGroupId, customLogs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            flagshipSdkHelper_1.default
                .postFlagshipApi({
                panic: _this.panic,
                config: _this.config,
                log: _this.log,
                endpoint: _this.config.flagshipApi + "activate",
                params: {
                    vid: _this.id,
                    cid: _this.envId,
                    caid: variationGroupId,
                    vaid: variationId
                }
            })
                .then(function (response) {
                var successLog = "VariationId \"" + variationId + "\" successfully activate with status code:" + response.status;
                if (customLogs && customLogs.success) {
                    successLog = customLogs.success + " with status code \"" + response.status + "\"";
                }
                _this.log.debug(successLog);
                resolve({ status: 200 });
            })
                .catch(function (error) {
                var failLog = "Trigger activate of variationId \"" + variationId + "\" failed with error \"" + error + "\"";
                if (customLogs && customLogs.fail) {
                    failLog = customLogs.fail + " failed with error \"" + error + "\"";
                }
                _this.log.fatal(failLog);
                reject(error);
            });
        });
    };
    FlagshipVisitor.prototype.activateModifications = function (modifications) {
        if (this.panic.shouldRunSafeMode('activateModifications')) {
            return;
        }
        var modificationsRequested = modifications.reduce(function (output, _a) {
            var key = _a.key;
            return __spreadArrays(output, [{ key: key, defaultValue: '', activate: true }]);
        }, []);
        if (this.fetchedModifications) {
            var detailsModifications = this.extractDesiredModifications(this.fetchedModifications, modificationsRequested).detailsModifications;
            this.triggerActivateIfNeeded(detailsModifications);
        }
    };
    FlagshipVisitor.prototype.triggerActivateIfNeeded = function (detailsModifications, activateAll) {
        var _this = this;
        if (detailsModifications === void 0) { detailsModifications = null; }
        if (activateAll === void 0) { activateAll = false; }
        var campaignsActivated = [];
        var internalModifications = this.modificationsInternalStatus;
        var activateBooks = [];
        var isAlreadyActivated = function (data) {
            if (data.archived.variationGroupId.length === 0 && data.archived.variationId.length === 0) {
                return false;
            }
            if (data.archived.variationGroupId[0] !== data.vgId || data.archived.variationId[0] !== data.vId) {
                _this.log.debug("triggerActivateIfNeeded - detecting a new variation (id=\"" + data.vId + "\") (variationGroupId=\"" + data.vgId + "\") which activates the same key as another older variation");
                return false;
            }
            _this.log.debug("triggerActivateIfNeeded - variation (vgId=\"" + data.vgId + "\") already activated");
            return true;
        };
        if (!this.isVisitorCacheExist()) {
            return;
        }
        Object.entries(detailsModifications || internalModifications).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return __awaiter(_this, void 0, void 0, function () {
                var activationRequested, isAlreadyActivatedValue, alreadyExist_1;
                return __generator(this, function (_b) {
                    activationRequested = !!value.isActivateNeeded || activateAll;
                    isAlreadyActivatedValue = isAlreadyActivated({
                        vgId: value.variationGroupId[0],
                        vId: value.variationId[0],
                        archived: internalModifications[key].activated
                    });
                    if (activationRequested && !isAlreadyActivatedValue) {
                        alreadyExist_1 = false;
                        activateBooks.forEach(function (_a, index) {
                            var vId = _a.vId, vgId = _a.vgId;
                            if (vId === value.variationId[0] && vgId === value.variationGroupId[0]) {
                                activateBooks[index].keys.push(key);
                                alreadyExist_1 = true;
                            }
                        });
                        if (!alreadyExist_1) {
                            activateBooks.push({
                                vgId: value.variationGroupId[0],
                                vId: value.variationId[0],
                                campaignId: value.campaignId[0],
                                keys: [key]
                            });
                        }
                    }
                    return [2 /*return*/];
                });
            });
        });
        var noteKey = function (_a, shouldRemove) {
            var keys = _a.keys, vgId = _a.vgId, vId = _a.vId;
            if (shouldRemove === void 0) { shouldRemove = false; }
            keys.forEach(function (key) {
                if (shouldRemove) {
                    _this.modificationsInternalStatus[key].activated.variationId.shift();
                    _this.modificationsInternalStatus[key].activated.variationGroupId.shift();
                }
                else {
                    _this.modificationsInternalStatus[key].activated.variationId.unshift(vId);
                    _this.modificationsInternalStatus[key].activated.variationGroupId.unshift(vgId);
                }
            });
        };
        activateBooks.forEach(function (_a) {
            var vId = _a.vId, vgId = _a.vgId, keys = _a.keys, campaignId = _a.campaignId;
            campaignsActivated.push(campaignId);
            noteKey({ vId: vId, vgId: vgId, keys: keys });
            _this.activateCampaign(vId, vgId, {
                success: "Modification key(s) \"" + keys.toString() + "\" successfully activate.",
                fail: "Trigger activate of modification key(s) \"" + keys.toString() + "\" failed."
            }).catch(function () {
                noteKey({ vId: vId, vgId: vgId, keys: keys }, true);
            });
        });
        // Logs unexpected behavior:
        var _a = this.checkCampaignsActivatedMultipleTimes(detailsModifications, activateAll), activateKey = _a.activateKey, activateCampaign = _a.activateCampaign;
        Object.entries(activateKey).forEach(function (_a) {
            var key = _a[0], count = _a[1];
            if (count > 1) {
                _this.log.warn("Key \"" + key + "\" has been activated " + count + " times because it was in conflict in further campaigns (debug logs for more details)");
                _this.log.debug("Here the details:" + Object.entries(activateCampaign).map(function (_a) {
                    var campaignId = _a[0], _b = _a[1], directActivate = _b.directActivate, indirectActivate = _b.indirectActivate;
                    if (indirectActivate.includes(key)) {
                        return "\n- because key \"" + key + "\" is also include inside campaign id=\"" + campaignId + "\" where key(s) \"" + directActivate.map(function (item) { return item + " "; }) + "\" is/are also requested.";
                    }
                    return null;
                }));
            }
            else {
                // everything good;
            }
        });
        // END of logs
    };
    FlagshipVisitor.prototype.isVisitorCacheExist = function () {
        if (!this.fetchedModifications || !this.modificationsInternalStatus) {
            this.log.debug('checkCampaignsActivatedMultipleTimes: Error "this.fetchedModifications" or/and "this.modificationsInternalStatus" is empty');
            return false;
        }
        return true;
    };
    FlagshipVisitor.prototype.checkCampaignsActivatedMultipleTimes = function (detailsModifications, activateAll) {
        var _this = this;
        if (detailsModifications === void 0) { detailsModifications = null; }
        if (activateAll === void 0) { activateAll = false; }
        var output = { activateCampaign: {}, activateKey: {} };
        var requestedActivateKeys;
        if (!this.isVisitorCacheExist()) {
            return output;
        }
        if (detailsModifications) {
            requestedActivateKeys = Object.entries(detailsModifications).filter(function (_a) {
                var keyInfo = _a[1];
                return keyInfo.isActivateNeeded === true;
            });
        }
        else if (activateAll) {
            requestedActivateKeys = Object.entries(this.modificationsInternalStatus);
        }
        else {
            return output;
        }
        var extractModificationIndirectKeysFromCampaign = function (campaignId, directKey) {
            if (_this.fetchedModifications) {
                var campaignDataArray = _this.fetchedModifications.filter(function (campaign) { return campaign.id === campaignId; });
                if (campaignDataArray.length === 1) {
                    return Object.keys(campaignDataArray[0].variation.modifications.value).filter(function (key) { return key !== directKey; });
                }
                _this.log.debug("extractModificationIndirectKeysFromCampaign - detected more than one campaign with same id \"" + campaignDataArray[0].id + "\"");
            }
            return [];
        };
        requestedActivateKeys.forEach(function (_a) {
            var key = _a[0], keyInfos = _a[1];
            if (output.activateCampaign[keyInfos.campaignId[0]]) {
                output.activateCampaign[keyInfos.campaignId[0]].directActivate.push(key);
            }
            else {
                output.activateCampaign[keyInfos.campaignId[0]] = {
                    directActivate: [key],
                    indirectActivate: extractModificationIndirectKeysFromCampaign(keyInfos.campaignId[0], key)
                };
            }
        });
        // then, clean indirect key which are also in direct
        Object.keys(output.activateCampaign).forEach(function (campaignId) {
            Object.values(output.activateCampaign[campaignId].directActivate).forEach(function (directKey) {
                if (output.activateCampaign[campaignId].indirectActivate.includes(directKey)) {
                    output.activateCampaign[campaignId].indirectActivate.splice(output.activateCampaign[campaignId].indirectActivate.indexOf(directKey), 1);
                }
            });
        });
        // then, fill "keyActivate"
        var extractNbTimesActivateCallForKey = function (key) {
            return Object.values(output.activateCampaign).reduce(function (count, _a) {
                var directActivate = _a.directActivate, indirectActivate = _a.indirectActivate;
                return count + indirectActivate.filter(function (item) { return item === key; }).length + directActivate.filter(function (item) { return item === key; }).length;
            }, 0);
        };
        requestedActivateKeys.forEach(function (_a) {
            var key = _a[0];
            output.activateKey[key] = extractNbTimesActivateCallForKey(key);
        });
        // done
        return output;
    };
    FlagshipVisitor.prototype.getModificationsInternalStatus = function () {
        var detailsModifications = FlagshipVisitor.analyseModifications(this.fetchedModifications).detailsModifications;
        var previousInternalStatus = this.modificationsInternalStatus;
        return Object.keys(detailsModifications).reduce(function (reducer, key) {
            var _a, _b;
            var _c = detailsModifications[key], value = _c.value, type = _c.type, campaignId = _c.campaignId, variationGroupId = _c.variationGroupId, variationId = _c.variationId;
            if (previousInternalStatus && previousInternalStatus[key]) {
                // update existing
                return __assign(__assign({}, reducer), (_a = {}, _a[key] = __assign(__assign({}, previousInternalStatus[key]), { // erase everything except "hasBeenActivated" in case of a new campaign impact the value
                    value: value,
                    type: type,
                    campaignId: campaignId,
                    variationId: variationId,
                    variationGroupId: variationGroupId }), _a));
            }
            return __assign(__assign({}, reducer), (_b = {}, _b[key] = {
                value: value,
                type: type,
                campaignId: campaignId,
                variationId: variationId,
                variationGroupId: variationGroupId,
                activated: {
                    variationId: [],
                    variationGroupId: []
                }
            }, _b));
        }, {});
    };
    FlagshipVisitor.analyseModifications = function (campaigns, activate, modificationsRequested) {
        if (campaigns === void 0) { campaigns = []; }
        if (activate === void 0) { activate = false; }
        var detailsModifications = {};
        var mergedModifications = {};
        campaigns.forEach(function (campaign) {
            Object.entries(campaign.variation.modifications.value).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                if (mergedModifications[key]) {
                    // This modif already exist on a previous campaign
                    detailsModifications[key].value.push(value);
                    detailsModifications[key].type.push(campaign.variation.modifications.type);
                    detailsModifications[key].campaignId.push(campaign.id);
                    detailsModifications[key].variationId.push(campaign.variation.id);
                    detailsModifications[key].variationGroupId.push(campaign.variationGroupId);
                }
                else {
                    // New modif
                    mergedModifications[key] = value;
                    detailsModifications[key] = {
                        value: [value],
                        type: [campaign.variation.modifications.type],
                        campaignId: [campaign.id],
                        variationId: [campaign.variation.id],
                        variationGroupId: [campaign.variationGroupId],
                        isRequested: false,
                        isActivateNeeded: !!activate
                    };
                    if (modificationsRequested) {
                        modificationsRequested.some(function (item) {
                            if (item.key === key) {
                                detailsModifications[key].isRequested = true;
                                if (!activate && !!item.activate) {
                                    detailsModifications[key].isActivateNeeded = item.activate;
                                }
                            }
                        });
                    }
                }
            });
            return null;
        });
        return { detailsModifications: detailsModifications, mergedModifications: mergedModifications };
    };
    FlagshipVisitor.prototype.extractDesiredModifications = function (response, modificationsRequested, activateAllModifications) {
        var _this = this;
        if (activateAllModifications === void 0) { activateAllModifications = null; }
        var desiredModifications = {};
        // Extract all modifications from "normal" answer and put them in "mergedModifications" as "simple" mode would do but with additional info.
        var _a = FlagshipVisitor.analyseModifications(response, !!activateAllModifications, modificationsRequested), detailsModifications = _a.detailsModifications, mergedModifications = _a.mergedModifications;
        // Notify modifications which have campaign conflict
        Object.entries(detailsModifications).forEach(function (_a) {
            var key = _a[0];
            // log only if it's a requested key
            if (detailsModifications[key].value.length > 1 && detailsModifications[key].isRequested) {
                _this.log.warn("Modification \"" + key + "\" has further values because the modification is involved in campaigns with (id=\"" + detailsModifications[key].campaignId.toString() + "\"). Modification value kept is " + key + "=\"" + detailsModifications[key].value[0] + "\"");
            }
        });
        // Check modifications requested (=modificationsRequested) match modifications fetched (=mergedModifications)
        (modificationsRequested || []).forEach(function (modifRequested) {
            if (typeof mergedModifications[modifRequested.key] !== 'undefined' && mergedModifications[modifRequested.key] !== null) {
                desiredModifications[modifRequested.key] = mergedModifications[modifRequested.key];
            }
            else {
                var defaultValue = modifRequested.defaultValue;
                desiredModifications[modifRequested.key] = defaultValue;
                // log only if we're not in panic mode
                if (_this.panic.enabled === false) {
                    _this.log.debug("No value found for modification \"" + modifRequested.key + "\".\nSetting default value \"" + defaultValue + "\"");
                    if (modifRequested.activate) {
                        _this.log.warn("Unable to activate modification \"" + modifRequested.key + "\" because it does not exist on any existing campaign...");
                    }
                }
            }
        });
        return { desiredModifications: desiredModifications, detailsModifications: detailsModifications };
    };
    FlagshipVisitor.prototype.getModificationsPostProcess = function (response, modificationsRequested, activateAllModifications) {
        if (activateAllModifications === void 0) { activateAllModifications = null; }
        var completeResponse = response;
        var responseData = completeResponse && completeResponse.data ? completeResponse.data : response;
        if (modificationsRequested && responseData && typeof responseData === 'object' && !Array.isArray(response)) {
            var _a = this.extractDesiredModifications(responseData.campaigns, modificationsRequested, activateAllModifications), desiredModifications = _a.desiredModifications, detailsModifications = _a.detailsModifications;
            this.log.debug("getModificationsPostProcess - detailsModifications:\n" + JSON.stringify(detailsModifications));
            this.triggerActivateIfNeeded(detailsModifications);
            return desiredModifications;
        }
        if (!modificationsRequested) {
            this.log.error("Requesting some specific modifications but the \"modificationsRequested\" argument is \"" + typeof modificationsRequested + "\"...");
        }
        return {};
    };
    FlagshipVisitor.prototype.getModifications = function (modificationsRequested, activateAllModifications) {
        if (activateAllModifications === void 0) { activateAllModifications = null; }
        if (this.panic.shouldRunSafeMode('getModifications')) {
            var desiredModifications = this.extractDesiredModifications([], modificationsRequested, false).desiredModifications;
            return desiredModifications;
        }
        if (!this.fetchedModifications) {
            this.log.warn('No modifications found in cache...');
            var desiredModifications = this.extractDesiredModifications([], modificationsRequested, activateAllModifications).desiredModifications;
            return desiredModifications;
        }
        var response = this.fetchAllModifications({
            activate: !!activateAllModifications,
            loadFromCache: true
        });
        return this.getModificationsPostProcess(response, modificationsRequested, activateAllModifications);
    };
    FlagshipVisitor.prototype.getModificationInfo = function (key) {
        var _this = this;
        if (this.panic.shouldRunSafeMode('getModificationInfo')) {
            return new Promise(function (resolve) { return resolve(null); });
        }
        var polishOutput = function (data) { return ({
            campaignId: data.id,
            variationId: data.variation.id,
            variationGroupId: data.variationGroupId
        }); };
        return new Promise(function (resolve, reject) {
            var fetchedModif = _this.fetchAllModifications({ activate: false, force: true });
            fetchedModif
                .then(function (response) {
                var castResponse = response;
                flagshipSdkHelper_1.default.checkDecisionApiResponseFormat(castResponse, _this.log);
                var campaigns = castResponse.data.campaigns;
                var detailsModifications = _this.extractDesiredModifications(campaigns, [{ key: key, defaultValue: '', activate: false }], false).detailsModifications;
                if (!detailsModifications[key]) {
                    resolve(null);
                }
                else if (detailsModifications[key].campaignId.length > 1) {
                    var consideredCampaignId_1 = detailsModifications[key].campaignId[0];
                    _this.log.warn("Modification \"" + key + "\" is involved in further campgains with:\nid=\"" + detailsModifications[key].campaignId.toString() + "\"\nKeeping data from:\ncampaignId=\"" + consideredCampaignId_1 + "\"");
                    resolve(polishOutput(campaigns.filter(function (cpgn) { return cpgn.id === consideredCampaignId_1; })[0]));
                }
                resolve(polishOutput(campaigns.filter(function (cpgn) { return cpgn.id === detailsModifications[key].campaignId[0]; })[0]));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    FlagshipVisitor.prototype.updateContext = function (context) {
        if (this.panic.shouldRunSafeMode('updateContext')) {
            return;
        }
        this.context = flagshipSdkHelper_1.default.checkVisitorContext(context, this.log);
    };
    FlagshipVisitor.prototype.synchronizeModifications = function (activate) {
        var _this = this;
        var _a, _b;
        if (activate === void 0) { activate = false; }
        var httpCallback = ((_b = (_a = this.config.internal) === null || _a === void 0 ? void 0 : _a.reactNative) === null || _b === void 0 ? void 0 : _b.httpCallback) || null;
        if (this.config.decisionMode !== 'API' && this.panic.shouldRunSafeMode('synchronizeModifications')) {
            return new Promise(function (resolve) { return resolve(400); });
        }
        return new Promise(function (resolve, reject) {
            var postSynchro = function (output, response) {
                _this.callEventEndpoint();
                resolve((response === null || response === void 0 ? void 0 : response.status) || 200);
            };
            if (_this.config.decisionMode === 'Bucketing') {
                if (_this.bucket !== null) {
                    _this.bucket.updateVisitorContext(_this.context);
                }
                // this if condition is to avoid unresolved promise if we call this.fetchAllModifications after
                if (!_this.bucket || (_this.bucket && !_this.bucket.global.isPollingRunning && !_this.bucket.computedData)) {
                    _this.log.info('synchronizeModifications - you might synchronize modifications too early because bucketing is empty or did not start');
                    postSynchro();
                    return;
                }
            }
            var fetchedModifPromise = _this.fetchAllModifications({
                activate: activate,
                force: true,
                httpCallback: httpCallback
            });
            fetchedModifPromise
                .then(function (response) {
                var output = flagshipSdkHelper_1.default.checkDecisionApiResponseFormat(response, _this.log);
                postSynchro(output, response);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    FlagshipVisitor.prototype.getModificationsForCampaign = function (campaignId, activate) {
        var _this = this;
        if (activate === void 0) { activate = false; }
        if (this.panic.shouldRunSafeMode('getModificationsForCampaign')) {
            return new Promise(function (resolve) { return resolve({ data: flagshipSdkHelper_1.default.generatePanicDecisionApiResponse(_this.id), status: 400 }); });
        }
        return this.fetchAllModifications({ activate: activate, campaignCustomID: campaignId });
    };
    FlagshipVisitor.prototype.getAllModifications = function (activate, options) {
        var _this = this;
        var _a, _b;
        if (activate === void 0) { activate = false; }
        if (options === void 0) { options = {}; }
        var httpCallback = ((_b = (_a = this.config.internal) === null || _a === void 0 ? void 0 : _a.reactNative) === null || _b === void 0 ? void 0 : _b.httpCallback) || null;
        if (this.panic.shouldRunSafeMode('getAllModifications')) {
            return new Promise(function (resolve) {
                if (options === null || options === void 0 ? void 0 : options.simpleMode) {
                    resolve({});
                }
                else {
                    resolve({
                        data: [],
                        status: 400
                    });
                }
            });
        }
        var defaultOptions = {
            force: false,
            simpleMode: false
        };
        var optionsToConsider = __assign(__assign({}, defaultOptions), options);
        return new Promise(function (resolve, reject) {
            _this.fetchAllModifications({ activate: activate, force: optionsToConsider.force, httpCallback: httpCallback })
                .then(function (response) {
                if (optionsToConsider.simpleMode) {
                    var detailsModifications_1 = FlagshipVisitor.analyseModifications(response.data.campaigns).detailsModifications;
                    resolve(Object.keys(detailsModifications_1).reduce(function (reducer, key) {
                        var _a;
                        return (__assign(__assign({}, reducer), (_a = {}, _a[key] = detailsModifications_1[key].value[0], _a)));
                    }, {}));
                }
                else {
                    resolve(response);
                }
            })
                .catch(function (error) { return reject(error); });
        });
    };
    FlagshipVisitor.prototype.fetchAllModificationsPostProcess = function (response, _a) {
        var activate = _a.activate, campaignCustomID = _a.campaignCustomID;
        var completeResponse = response;
        var reshapeResponse = completeResponse.data ? completeResponse : { data: response };
        var responseData = completeResponse.data ? completeResponse.data : response;
        var output = { data: {} };
        var analysedModifications = {};
        var filteredCampaigns = [];
        // PART 1: Compute the data (if needed)
        if (responseData && responseData.campaigns) {
            if (campaignCustomID) {
                // request data from ONE specific campaign
                filteredCampaigns = responseData.campaigns.filter(function (item) { return item.id === campaignCustomID; });
                var detailsModifications = FlagshipVisitor.analyseModifications(filteredCampaigns, !!activate).detailsModifications /* , mergedModifications */;
                analysedModifications = detailsModifications;
                output = __assign(__assign({}, reshapeResponse), { data: {
                        visitorId: this.id,
                        campaigns: filteredCampaigns
                    } });
            }
            else {
                // default behavior
                var detailsModifications = FlagshipVisitor.analyseModifications(responseData.campaigns, !!activate).detailsModifications /* , mergedModifications */;
                analysedModifications = detailsModifications;
                output = __assign({}, reshapeResponse);
            }
        }
        else {
            var warningMsg = 'No modification(s) found';
            if (campaignCustomID) {
                warningMsg += " for campaignId=\"" + campaignCustomID + "\"";
                output = __assign(__assign({}, reshapeResponse), { data: { campaigns: [], visitorId: this.id } });
            }
            else {
                output = __assign({}, reshapeResponse);
            }
            this.log.warn(warningMsg);
        }
        // PART 2: Handle activate (if needed)
        if (this.fetchedModifications) {
            this.triggerActivateIfNeeded(analysedModifications);
        }
        // PART 3: Return the data
        return output;
    };
    FlagshipVisitor.prototype.saveModificationsInCache = function (data) {
        var _this = this;
        var haveBeenCalled = false;
        var previousFM = this.fetchedModifications;
        var save = function (dataToSave) {
            if (dataToSave === void 0) { dataToSave = null; }
            _this.fetchedModifications = flagshipSdkHelper_1.default.validateDecisionApiData(dataToSave, _this.log);
            _this.modificationsInternalStatus = _this.fetchedModifications === null ? null : _this.getModificationsInternalStatus();
        };
        var callback = function (campaigns) {
            if (campaigns === void 0) { campaigns = data; }
            haveBeenCalled = true;
            if (previousFM !== campaigns) {
                // log only when there is a change
                _this.log.debug("saveModificationsInCache - saving in cache modifications returned by the callback: " + (Array.isArray(campaigns) ? JSON.stringify(campaigns) : campaigns));
            }
            save(campaigns);
        };
        // emit 'saveCache' with a callback if modifications need to be override
        this.emit('saveCache', {
            saveInCacheModifications: callback,
            modifications: {
                before: this.fetchedModifications,
                after: data || null
            }
        });
        // if callback not used, do default behavior
        if (!haveBeenCalled) {
            save(data);
            this.log.debug("saveModificationsInCache - saving in cache those modifications: \"" + (this.fetchedModifications ? JSON.stringify(this.fetchedModifications) : 'null') + "\"");
        }
    };
    FlagshipVisitor.prototype.fetchAllModifications = function (args) {
        var _this = this;
        var defaultArgs = {
            activate: false,
            campaignCustomID: null,
            force: false,
            loadFromCache: false
        };
        var _a = __assign(__assign({}, defaultArgs), args), activate = _a.activate, force = _a.force, loadFromCache = _a.loadFromCache, httpCallback = _a.httpCallback /* , campaignCustomID, */;
        var url = "" + this.config.flagshipApi + this.envId + "/campaigns?mode=normal";
        // check if need to return without promise
        if (loadFromCache) {
            if (this.fetchedModifications && !force) {
                this.log.debug('fetchAllModifications - loadFromCache enabled');
                return this.fetchAllModificationsPostProcess({ visitorId: this.id, campaigns: this.fetchedModifications }, __assign(__assign({}, defaultArgs), args)).data;
            }
            this.log.fatal('fetchAllModifications - loadFromCache enabled but no data in cache. Make sure you fetched at least once before.');
            return { visitorId: this.id, campaigns: this.fetchedModifications };
        }
        // default: return a promise
        return new Promise(function (resolve, reject) {
            var _a;
            if (_this.fetchedModifications && !force) {
                _this.log.info('fetchAllModifications - no calls to the Decision API because it has already been fetched before');
                resolve(_this.fetchAllModificationsPostProcess({ visitorId: _this.id, campaigns: _this.fetchedModifications }, __assign(__assign({}, defaultArgs), args)));
            }
            else if (_this.config.decisionMode === 'Bucketing') {
                var transformedBucketingData = { visitorId: _this.id, campaigns: [] };
                _this.bucket.updateCache();
                if ((_a = _this.bucket) === null || _a === void 0 ? void 0 : _a.computedData) {
                    transformedBucketingData = __assign(__assign({}, transformedBucketingData), { campaigns: _this.bucket.computedData.campaigns });
                    _this.saveModificationsInCache(transformedBucketingData.campaigns);
                    if (activate) {
                        _this.log.debug("fetchAllModifications - activateNow enabled with bucketing mode. Following keys \"" + Object.keys(_this.modificationsInternalStatus).join(', ') + "\" will be activated.");
                        // NOTE: triggerActivateIfNeeded trigger in post process
                    }
                }
                else {
                    _this.log.info("fetchAllModifications - the visitor won't have modifications assigned as the bucketing still didn't received any data. Consider do a synchronization a bit later.");
                }
                resolve(_this.fetchAllModificationsPostProcess(transformedBucketingData, __assign(__assign({}, defaultArgs), args)));
            }
            else {
                flagshipSdkHelper_1.default
                    .postFlagshipApi({
                    callback: httpCallback,
                    panic: _this.panic,
                    config: _this.config,
                    log: _this.log,
                    endpoint: url,
                    params: {
                        visitor_id: _this.id,
                        trigger_hit: activate,
                        // sendContextEvent: false, // NOTE: not set because endpoint "/events" is called only with bucketing mode
                        context: _this.context
                    }
                }, 
                // query params:
                {
                    params: {
                        exposeAllKeys: true,
                        sendContextEvent: false // hardcoded - tell decision api not to automatically manage events
                    }
                })
                    .then(function (response) {
                    _this.saveModificationsInCache(response.data.campaigns);
                    resolve(_this.fetchAllModificationsPostProcess(response, __assign(__assign({}, defaultArgs), args)));
                })
                    .catch(function (response) {
                    _this.log.fatal("fetchAllModifications - an error occurred while fetching " + ((response === null || response === void 0 ? void 0 : response.message) || '...')); // TODO: precise error
                    if (activate) {
                        _this.log.fatal('fetchAllModifications - activate canceled due to errors...');
                    }
                    reject(response);
                });
            }
        });
    };
    FlagshipVisitor.prototype.generateCustomTypeParamsOf = function (hitData) {
        var optionalAttributes = {};
        // TODO: move common optional attributes before switch statement (ie: "pageTitle", "documentLocation",...)
        switch (hitData.type.toUpperCase()) {
            case 'SCREEN':
            case 'SCREENVIEW': {
                var _a = hitData.data, documentLocation = _a.documentLocation, pageTitle = _a.pageTitle;
                if (!documentLocation || !pageTitle) {
                    if (!documentLocation)
                        this.log.error('sendHits(ScreenView) - failed because following required attribute "documentLocation" is missing...');
                    if (!pageTitle)
                        this.log.error('sendHits(ScreenView) - failed because following required attribute "pageTitle" is missing...');
                    return null;
                }
                return {
                    t: 'SCREENVIEW',
                    dl: documentLocation,
                    pt: pageTitle
                };
            }
            case 'TRANSACTION': {
                var _b = hitData.data, documentLocation = _b.documentLocation, pageTitle = _b.pageTitle, transactionId = _b.transactionId, affiliation = _b.affiliation, totalRevenue = _b.totalRevenue, shippingCost = _b.shippingCost, taxes = _b.taxes, currency = _b.currency, couponCode = _b.couponCode, paymentMethod = _b.paymentMethod, shippingMethod = _b.shippingMethod, itemCount = _b.itemCount;
                if (totalRevenue) {
                    optionalAttributes.tr = totalRevenue; // number, max length = NONE
                }
                if (shippingCost) {
                    optionalAttributes.ts = shippingCost; // number, max length = NONE
                }
                if (taxes) {
                    optionalAttributes.tt = taxes; // number, max length = NONE
                }
                if (currency) {
                    optionalAttributes.tc = currency; // string, max length = 10 BYTES
                }
                if (couponCode) {
                    optionalAttributes.tcc = couponCode; // string, max length = 10 BYTES
                }
                if (paymentMethod) {
                    optionalAttributes.pm = paymentMethod; // string, max length = 10 BYTES
                }
                if (shippingMethod) {
                    optionalAttributes.sm = shippingMethod; // string, max length = 10 BYTES
                }
                if (itemCount) {
                    optionalAttributes.icn = itemCount; // number, max length = NONE
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!transactionId || !affiliation) {
                    if (!transactionId)
                        this.log.error('sendHits(Transaction) - failed because following required attribute "transactionId" is missing...');
                    if (!affiliation)
                        this.log.error('sendHits(Transaction) - failed because following required attribute "affiliation" is missing...');
                    return null;
                }
                return __assign({ t: 'TRANSACTION', tid: transactionId, ta: affiliation }, optionalAttributes);
            }
            case 'ITEM': {
                var _c = hitData.data, transactionId = _c.transactionId, name_1 = _c.name, documentLocation = _c.documentLocation, pageTitle = _c.pageTitle, price = _c.price, code = _c.code, category = _c.category, quantity = _c.quantity;
                if (price) {
                    optionalAttributes.ip = price; // number, max length = NONE
                }
                if (quantity) {
                    optionalAttributes.iq = quantity; // number, max length = NONE
                }
                if (category) {
                    optionalAttributes.iv = category; // string, max length = 500 BYTES
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!transactionId || !name_1 || !code) {
                    if (!transactionId)
                        this.log.error('sendHits(Item) - failed because following required attribute "transactionId" is missing...');
                    if (!name_1)
                        this.log.error('sendHits(Item) - failed because following required attribute "name" is missing...');
                    if (!code)
                        this.log.error('sendHits(Item) - failed because following required attribute "code" is missing...');
                    return null;
                }
                return __assign({ t: 'ITEM', tid: transactionId, in: name_1, ic: code }, optionalAttributes);
            }
            case 'EVENT': {
                var _d = hitData.data, label = _d.label, value = _d.value, documentLocation = _d.documentLocation, category = _d.category, pageTitle = _d.pageTitle, action = _d.action;
                if (label) {
                    optionalAttributes.el = label; // string, max length = 500 BYTES
                }
                if (value) {
                    optionalAttributes.ev = value; // string, max length = 500 BYTES
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!category || !action) {
                    this.log.debug("sendHits(Event) - this hits is missing attributes:\n" + JSON.stringify(hitData));
                    if (!category)
                        this.log.error('sendHits(Event) - failed because following required attribute "category" is missing...');
                    if (!action)
                        this.log.error('sendHits(Event) - failed because following required attribute "action" is missing...');
                    return null;
                }
                return __assign({ t: 'EVENT', ea: action, ec: category }, optionalAttributes);
            }
            default:
                this.log.error("sendHits - no type found for hit: \"" + JSON.stringify(hitData) + "\"");
                return null;
        }
    };
    FlagshipVisitor.prototype.sendHits = function (hitsArray) {
        var _this = this;
        if (this.panic.shouldRunSafeMode('sendHits')) {
            return new Promise(function (resolve) { return resolve(); });
        }
        var payloads = [];
        var url = 'https://ariane.abtasty.com';
        var handleHitsError = function (error) {
            _this.log.fatal("sendHits - fail with error: \"" + error + "\"");
        };
        return new Promise(function (resolve, reject) {
            var promises = Promise.all(hitsArray.map(function (hit) { return __awaiter(_this, void 0, void 0, function () {
                var customParams, payload_1;
                return __generator(this, function (_a) {
                    customParams = this.generateCustomTypeParamsOf(hit);
                    if (customParams) {
                        payload_1 = __assign({ vid: this.id, cid: this.envId, ds: 'APP' }, customParams);
                        payloads.push(payload_1);
                        return [2 /*return*/, axios_1.default.post(url, payload_1).then(function () { return (__assign({ skipped: false }, payload_1)); })];
                    }
                    this.log.debug("sendHits - skip request to \"" + url + "\" because current hit not set correctly");
                    return [2 /*return*/, new Promise(function (resolveAuto) { return resolveAuto({ skipped: true }); })]; // do nothing
                });
            }); }));
            promises
                .then(function (data) {
                data.forEach(function (d) {
                    if (d && !d.skipped) {
                        _this.log.info("sendHits - hit (type\"" + d.t + "\") send successfully");
                        _this.log.debug("sendHits - with url " + url);
                        _this.log.debug("sendHits - with payload:\n" + payloads.map(function (p) { return JSON.stringify(p) + "\n"; }));
                    }
                });
                resolve();
            })
                .catch(function (error) {
                handleHitsError(error);
                reject(error);
            });
        });
    };
    FlagshipVisitor.prototype.sendHit = function (hitData) {
        if (this.panic.shouldRunSafeMode('sendHit')) {
            return new Promise(function (resolve) { return resolve(); });
        }
        return this.sendHits([hitData]);
    };
    FlagshipVisitor.prototype.callEventEndpoint = function () {
        var _this = this;
        if (this.panic.shouldRunSafeMode('callEventEndpoint', { logType: 'debug' })) {
            return new Promise(function (resolve) { return resolve(400); });
        }
        return new Promise(function (resolve, reject) {
            flagshipSdkHelper_1.default
                .postFlagshipApi({
                panic: _this.panic,
                config: _this.config,
                log: _this.log,
                endpoint: "" + _this.config.flagshipApi + _this.envId + "/events",
                params: {
                    visitor_id: _this.id,
                    type: 'CONTEXT',
                    data: __assign({}, _this.context)
                }
            })
                .then(function (response) {
                _this.log.debug("callEventEndpoint - returns status=" + response.status);
                resolve(response.status);
            })
                .catch(function (error) {
                _this.log.error("callEventEndpoint - failed with error=\"" + error + "\"");
                reject(error);
            });
        });
    };
    return FlagshipVisitor;
}(events_1.EventEmitter));
exports.default = FlagshipVisitor;


/***/ }),

/***/ "./src/class/panicMode/panicMode.ts":
/*!******************************************!*\
  !*** ./src/class/panicMode/panicMode.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_logs_1 = __webpack_require__(/*! @flagship.io/js-sdk-logs */ "./node_modules/@flagship.io/js-sdk-logs/dist/index.js");
var PanicMode = /** @class */ (function () {
    function PanicMode(config) {
        this.enabled = false;
        this.beginDate = null;
        this.log = js_sdk_logs_1.default.getLogger(config, "Flagship SDK - panic mode");
    }
    PanicMode.prototype.setPanicModeTo = function (value, options) {
        if (options === void 0) { options = { sendLogs: true }; }
        var sendLogs = options.sendLogs;
        if (value === this.enabled) {
            if (sendLogs) {
                this.log.debug(value ? "panic mode already ENABLED since " + this.beginDate.toDateString() : 'panic mode already DISABLED.');
            }
            return;
        }
        this.enabled = value;
        this.beginDate = value === false ? null : new Date();
        if (sendLogs) {
            this.log.info(value ? 'panic mode is ENABLED. SDK will turn into safe mode.' : 'panic mode is DISABLED. Everything is back to normal.');
        }
    };
    PanicMode.prototype.checkPanicMode = function (response) {
        var answer = !!(response === null || response === void 0 ? void 0 : response.panic);
        this.setPanicModeTo(answer, { sendLogs: answer !== this.enabled });
    };
    PanicMode.prototype.shouldRunSafeMode = function (functionName, options) {
        if (options === void 0) { options = { logType: 'error' }; }
        var logType = options.logType;
        if (this.enabled) {
            switch (logType) {
                case 'debug':
                    this.log.debug("Can't execute '" + functionName + "' because the SDK is in panic mode !");
                    break;
                default:
                    this.log.error("Can't execute '" + functionName + "' because the SDK is in panic mode !");
                    break;
            }
        }
        return this.enabled;
    };
    return PanicMode;
}());
exports.default = PanicMode;


/***/ }),

/***/ "./src/config/default.ts":
/*!*******************************!*\
  !*** ./src/config/default.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.internalConfig = void 0;
var defaultConfig = {
    fetchNow: true,
    activateNow: false,
    enableConsoleLogs: false,
    decisionMode: 'API',
    nodeEnv: 'production',
    flagshipApi: 'https://decision-api.flagship.io/v1/',
    pollingInterval: null,
    apiKey: null,
    timeout: 2,
    initialBucketing: null,
    initialModifications: null,
    internal: {
        react: null,
        reactNative: {
            httpCallback: null
        }
    }
};
exports.internalConfig = {
    bucketingEndpoint: 'https://cdn.flagship.io/@ENV_ID@/bucketing.json',
    apiV1: 'https://decision-api.flagship.io/v1/',
    apiV2: 'https://decision.flagship.io/v2/',
    pollingIntervalMinValue: 1 // (= 1 sec)
};
exports.default = defaultConfig;


/***/ }),

/***/ "./src/config/otherSdk.ts":
/*!********************************!*\
  !*** ./src/config/otherSdk.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react = {
    enableErrorLayout: false,
    enableSafeMode: false,
};
var reactNative = {};
var otherSdk = __assign(__assign({}, react), reactNative);
exports.default = otherSdk;


/***/ }),

/***/ "./src/config/test.ts":
/*!****************************!*\
  !*** ./src/config/test.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoPollingInterval = void 0;
var default_1 = __webpack_require__(/*! ./default */ "./src/config/default.ts");
var testConfig = __assign(__assign({}, default_1.default), { nodeEnv: 'development' });
exports.demoPollingInterval = 0.005; // 1 000 * 0.022 = 1320 ms (1.3 sec)
exports.default = testConfig;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flagship_1 = __webpack_require__(/*! ./class/flagship/flagship */ "./src/class/flagship/flagship.ts");
function startLegacy(envId, config) {
    return new flagship_1.default(envId, undefined, config);
}
// NOTE: apiKeyOrSettings (any) will become apiKey (string) in next major release
function start(envId, apiKeyOrSettings, config) {
    if (typeof apiKeyOrSettings === 'object' && apiKeyOrSettings !== null && !Array.isArray(apiKeyOrSettings)) {
        return startLegacy(envId, apiKeyOrSettings);
    }
    return new flagship_1.default(envId, apiKeyOrSettings, config);
}
var flagship = {
    start: start
};
exports.default = flagship;


/***/ }),

/***/ "./src/lib/flagshipSdkHelper.ts":
/*!**************************************!*\
  !*** ./src/lib/flagshipSdkHelper.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
var validate_js_1 = __webpack_require__(/*! validate.js */ "./node_modules/validate.js/validate.js");
var default_1 = __webpack_require__(/*! ../config/default */ "./src/config/default.ts");
var otherSdk_1 = __webpack_require__(/*! ../config/otherSdk */ "./src/config/otherSdk.ts");
var test_1 = __webpack_require__(/*! ../config/test */ "./src/config/test.ts");
var checkRequiredSettingsForApiV2 = function (config, log) {
    if (config.flagshipApi && config.flagshipApi.includes('/v2/') && !config.apiKey) {
        log.fatal('initialization - flagshipApi v2 detected but required setting "apiKey" is missing !');
    }
};
var flagshipSdkHelper = {
    postFlagshipApi: function (_a, queryParams) {
        var panic = _a.panic, config = _a.config, log = _a.log, endpoint = _a.endpoint, callback = _a.callback, params = _a.params;
        if (queryParams === void 0) { queryParams = { headers: {} }; }
        var additionalParams = {};
        var additionalHeaderParams = {};
        checkRequiredSettingsForApiV2(config, log);
        var isNotApiV1 = !config.flagshipApi.includes('/v1/');
        if (config.apiKey && isNotApiV1) {
            additionalHeaderParams['x-api-key'] = config.apiKey;
        }
        var url = endpoint.includes(config.flagshipApi) ? endpoint : config.flagshipApi + endpoint;
        var cancelTokenSource = axios_1.default.CancelToken.source();
        var axiosFct = function () {
            return axios_1.default
                .post(url, __assign(__assign({}, params), additionalParams), __assign(__assign({}, queryParams), { cancelToken: cancelTokenSource.token, headers: __assign(__assign({}, queryParams.headers), additionalHeaderParams), timeout: url.includes('/campaigns') ? config.timeout * 1000 : undefined }))
                .then(function (response) {
                panic.checkPanicMode(response.data);
                return response;
            });
        };
        if (callback) {
            return callback(axiosFct, cancelTokenSource, config);
        }
        return axiosFct();
    },
    checkPollingIntervalValue: function (pollingIntervalValue) {
        var valueType = typeof pollingIntervalValue;
        switch (valueType) {
            case 'number':
                if (process && process.env && "development" === 'test' && pollingIntervalValue === test_1.demoPollingInterval) {
                    // for unit test
                    return 'ok';
                }
                return pollingIntervalValue >= default_1.internalConfig.pollingIntervalMinValue ? 'ok' : 'underLimit';
            case 'object':
                return pollingIntervalValue === null ? 'notSupported' : 'notSupported';
            case 'undefined':
            default:
                return 'notSupported';
        }
    },
    checkVisitorContext: function (unknownContext, fsLogger) {
        var validContext = {};
        Object.entries(unknownContext).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (typeof value === 'object' && !Array.isArray(value)) {
                // means value is a json
                fsLogger.warn("Context key \"" + key + "\" is an object (json) which is not supported. This key will be ignored...");
            }
            else if (Array.isArray(value)) {
                // means value is an array
                fsLogger.warn("Context key \"" + key + "\" is an array which is not supported. This key will be ignored...");
            }
            else if (typeof value === 'undefined' || value === null) {
                // means value is not an array
                fsLogger.warn("Context key \"" + key + "\" is null or undefined which is not supported. This key will be ignored...");
            }
            else {
                validContext[key] = value;
            }
        });
        return validContext;
    },
    logIgnoredAttributesFromObject: function (obj, log, objectName) {
        if (objectName === void 0) { objectName = ''; }
        var hasDirtyValues = false;
        Object.entries(obj).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            hasDirtyValues = true;
            log.warn("Unknown key \"" + key + "\" detected (with value=\"" + value + "\"). This key has been ignored... - " + objectName);
        });
        if (!hasDirtyValues) {
            log.debug("No unknown key detected :) - " + objectName);
        }
    },
    checkTimeout: function (value) {
        return typeof value === 'number' && value > 0 ? value : default_1.default.timeout;
    },
    checkConfig: function (unknownConfig, apiKey) {
        var cleanObject = {};
        var dirtyObject = {};
        var validAttributesList = [];
        Object.entries(default_1.default).forEach(function (_a) {
            var key = _a[0];
            return validAttributesList.push(key);
        });
        var whiteListedAttributesList = Object.keys(otherSdk_1.default); // specific config coming from other SDK.
        Object.keys(unknownConfig).forEach(function (foreignKey) {
            var value = unknownConfig[foreignKey];
            if (validAttributesList.includes(foreignKey)) {
                if (typeof value === 'undefined' || value === null) {
                    cleanObject[foreignKey] = default_1.default[foreignKey];
                }
                else {
                    switch (foreignKey) {
                        case 'timeout':
                            cleanObject[foreignKey] = flagshipSdkHelper.checkTimeout(value);
                            break;
                        default:
                            cleanObject[foreignKey] = value;
                            break;
                    }
                }
            }
            else if (whiteListedAttributesList.includes(foreignKey)) {
                // do nothing
            }
            else {
                dirtyObject[foreignKey] = value;
            }
        });
        // TODO: remove in next major release
        if (apiKey) {
            cleanObject.apiKey = apiKey;
        }
        return { cleanConfig: __assign({}, cleanObject), ignoredConfig: __assign({}, dirtyObject) };
    },
    checkDecisionApiResponseFormat: function (response, log) {
        if (!response.data || !response.data.campaigns) {
            log.warn('Unknow Decision Api response received or error happened'); // TODO: can be improved according status value
            return null;
        }
        return response.data;
    },
    checkBucketingApiResponse: function (response, log) {
        var constraints = {
            campaigns: {
                presence: { message: 'is missing' },
                type: { type: 'array', message: 'is not a array' }
            },
            lastModifiedDate: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            }
        };
        var constraintsBucketingCampaigns = {
            id: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            type: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            variationGroups: {
                presence: { message: 'is missing' },
                type: { type: 'array', message: 'is not a array' }
            }
        };
        var result = true;
        var errorLog = '';
        var firstCheck = validate_js_1.validate(response, constraints);
        if (!firstCheck) {
            response.campaigns.forEach(function (element, index) {
                var secondCheck = validate_js_1.validate(element, constraintsBucketingCampaigns);
                if (secondCheck) {
                    result = false;
                    errorLog += flagshipSdkHelper.generateValidateError(secondCheck, index);
                }
            });
        }
        else {
            result = false;
            errorLog += flagshipSdkHelper.generateValidateError(firstCheck);
        }
        if (result) {
            return response;
        }
        log.error(errorLog);
        return null;
    },
    generateValidateError: function (validateOutput, index) {
        var errorMsg = '';
        if (typeof index === 'number') {
            errorMsg += "Element at index=" + index + ":\n";
        }
        else {
            errorMsg += "Element:\n";
        }
        Object.keys(validateOutput).forEach(function (key) {
            errorMsg += "- \"" + key + "\" " + validateOutput[key].map(function (err, j) {
                return j === validateOutput[key].length - 1 ? "" + err : err + " and ";
            }) + ".\n";
        });
        errorMsg += '\n';
        return errorMsg;
    },
    validateDecisionApiData: function (data, log) {
        var constraints = {
            id: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            variationGroupId: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.id': {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.modifications.type': {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.modifications.value': {
                presence: { message: 'is missing' }
            }
        };
        var result = {};
        var errorMsg = 'Decision Api data does not have correct format:\n';
        if (!data || !Array.isArray(data)) {
            if (!Array.isArray(data) && data !== null) {
                log.error("validateDecisionApiData - received unexpected decision api data of type \"" + typeof data + "\"");
            }
            return null;
        }
        data.forEach(function (potentialCampaign, i) {
            var output = validate_js_1.validate(potentialCampaign, constraints);
            if (output) {
                result[i] = output;
                errorMsg += flagshipSdkHelper.generateValidateError(output, i);
            }
        });
        if (Object.keys(result).length === 0) {
            return data;
        }
        log.error(errorMsg);
        return null;
    },
    isUsingFlagshipApi: function (version, config) {
        switch (version) {
            case 'v1':
                return config.flagshipApi.includes(default_1.internalConfig.apiV1);
            case 'v2':
                return config.flagshipApi.includes(default_1.internalConfig.apiV2);
            default:
                return false;
        }
    },
    generatePanicDecisionApiResponse: function (visitorId) {
        return {
            visitorId: visitorId,
            campaigns: [],
            panic: true
        };
    }
};
exports.default = flagshipSdkHelper;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/lib/loggerHelper.ts":
/*!*********************************!*\
  !*** ./src/lib/loggerHelper.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_logs_1 = __webpack_require__(/*! @flagship.io/js-sdk-logs */ "./node_modules/@flagship.io/js-sdk-logs/dist/index.js");
exports.default = js_sdk_logs_1.default;


/***/ }),

/***/ "./src/lib/utils.ts":
/*!**************************!*\
  !*** ./src/lib/utils.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utilsHelper = {
    deepCompare: function (json1, json2) {
        if (Object.prototype.toString.call(json1) === Object.prototype.toString.call(json2)) {
            if (Object.prototype.toString.call(json1) === '[object Object]' || Object.prototype.toString.call(json1) === '[object Array]') {
                if (Object.keys(json1).length !== Object.keys(json2).length) {
                    return false;
                }
                return Object.keys(json1).every(function (key) {
                    return utilsHelper.deepCompare(json1[key], json2[key]);
                });
            }
            return json1 === json2;
        }
        return false;
    }
};
exports.default = utilsHelper;


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=index.reactNative.js.map