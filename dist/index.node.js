module.exports =
/******/ (function(modules) { // webpackBootstrap
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

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/http.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/adapters/http.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var httpFollow = __webpack_require__(/*! follow-redirects */ "follow-redirects").http;
var httpsFollow = __webpack_require__(/*! follow-redirects */ "follow-redirects").https;
var url = __webpack_require__(/*! url */ "url");
var zlib = __webpack_require__(/*! zlib */ "zlib");
var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var isHttps = /https:?/;

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }


        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


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
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/http.js");
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

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/*! exports provided: name, version, description, main, scripts, repository, keywords, author, license, bugs, homepage, devDependencies, browser, typings, dependencies, bundlesize, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"axios\",\"version\":\"0.19.2\",\"description\":\"Promise based HTTP client for the browser and node.js\",\"main\":\"index.js\",\"scripts\":{\"test\":\"grunt test && bundlesize\",\"start\":\"node ./sandbox/server.js\",\"build\":\"NODE_ENV=production grunt build\",\"preversion\":\"npm test\",\"version\":\"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json\",\"postversion\":\"git push && git push --tags\",\"examples\":\"node ./examples/server.js\",\"coveralls\":\"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js\",\"fix\":\"eslint --fix lib/**/*.js\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/axios/axios.git\"},\"keywords\":[\"xhr\",\"http\",\"ajax\",\"promise\",\"node\"],\"author\":\"Matt Zabriskie\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/axios/axios/issues\"},\"homepage\":\"https://github.com/axios/axios\",\"devDependencies\":{\"bundlesize\":\"^0.17.0\",\"coveralls\":\"^3.0.0\",\"es6-promise\":\"^4.2.4\",\"grunt\":\"^1.0.2\",\"grunt-banner\":\"^0.6.0\",\"grunt-cli\":\"^1.2.0\",\"grunt-contrib-clean\":\"^1.1.0\",\"grunt-contrib-watch\":\"^1.0.0\",\"grunt-eslint\":\"^20.1.0\",\"grunt-karma\":\"^2.0.0\",\"grunt-mocha-test\":\"^0.13.3\",\"grunt-ts\":\"^6.0.0-beta.19\",\"grunt-webpack\":\"^1.0.18\",\"istanbul-instrumenter-loader\":\"^1.0.0\",\"jasmine-core\":\"^2.4.1\",\"karma\":\"^1.3.0\",\"karma-chrome-launcher\":\"^2.2.0\",\"karma-coverage\":\"^1.1.1\",\"karma-firefox-launcher\":\"^1.1.0\",\"karma-jasmine\":\"^1.1.1\",\"karma-jasmine-ajax\":\"^0.1.13\",\"karma-opera-launcher\":\"^1.0.0\",\"karma-safari-launcher\":\"^1.0.0\",\"karma-sauce-launcher\":\"^1.2.0\",\"karma-sinon\":\"^1.0.5\",\"karma-sourcemap-loader\":\"^0.3.7\",\"karma-webpack\":\"^1.7.0\",\"load-grunt-tasks\":\"^3.5.2\",\"minimist\":\"^1.2.0\",\"mocha\":\"^5.2.0\",\"sinon\":\"^4.5.0\",\"typescript\":\"^2.8.1\",\"url-search-params\":\"^0.10.0\",\"webpack\":\"^1.13.1\",\"webpack-dev-server\":\"^1.14.1\"},\"browser\":{\"./lib/adapters/http.js\":\"./lib/adapters/xhr.js\"},\"typings\":\"./index.d.ts\",\"dependencies\":{\"follow-redirects\":\"1.5.10\"},\"bundlesize\":[{\"path\":\"./dist/axios.min.js\",\"threshold\":\"5kB\"}]}");

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
var events_1 = __webpack_require__(/*! events */ "events");
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
var react_native_murmurhash_1 = __webpack_require__(/*! react-native-murmurhash */ "react-native-murmurhash");
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
var events_1 = __webpack_require__(/*! events */ "events");
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
var events_1 = __webpack_require__(/*! events */ "events");
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
var js_sdk_logs_1 = __webpack_require__(/*! @flagship.io/js-sdk-logs */ "@flagship.io/js-sdk-logs");
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


/***/ }),

/***/ "./src/lib/loggerHelper.ts":
/*!*********************************!*\
  !*** ./src/lib/loggerHelper.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_logs_1 = __webpack_require__(/*! @flagship.io/js-sdk-logs */ "@flagship.io/js-sdk-logs");
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


/***/ }),

/***/ "@flagship.io/js-sdk-logs":
/*!*******************************************!*\
  !*** external "@flagship.io/js-sdk-logs" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@flagship.io/js-sdk-logs");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "follow-redirects":
/*!***********************************!*\
  !*** external "follow-redirects" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("follow-redirects");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "react-native-murmurhash":
/*!******************************************!*\
  !*** external "react-native-murmurhash" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-native-murmurhash");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ })["default"];
//# sourceMappingURL=index.node.js.map