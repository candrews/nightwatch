module.exports = function(Nightwatch) {

  var MOUSE_BUTTON_LEFT = 'left',
      MOUSE_BUTTON_MIDDLE = 'middle',
      MOUSE_BUTTON_RIGHT = 'right',
      DIRECTION_UP = 'up',
      DIRECTION_DOWN = 'down';

  var Actions = {};

  //////////////////////////////////////////////////////////////////
  // Session related
  //////////////////////////////////////////////////////////////////
  /**
   * Get info about or delete the current session.
   *
   * @link /session
   * @param {string} action The http method to use, can be get or delete
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.session  = function(action, callback) {
    var options = {
      path : '/session'
    };

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      action = 'get';
    }

    switch (action) {
    case 'delete':
      options.path += '/' + Nightwatch.sessionId;
      options.method = 'DELETE';
      break;
    default:
      options.method = 'GET';
    }

    return sendRequest(options, callback);
  };

  /**
   * Returns a list of the currently active sessions.
   *
   * @link /sessions
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.sessions  = function(callback) {
    var options = {
      path : '/session',
      method : 'GET'
    };
    return sendRequest(options, callback);
  };

  /**
   * Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
   *
   * @link /session/:sessionId/timeouts
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.timeouts  = function(callback) {
    return postRequest('/timeouts', callback);
  };

  /**
   * Set the amount of time, in milliseconds, that asynchronous scripts executed by /session/:sessionId/execute_async are permitted to run before they are aborted and a |Timeout| error is returned to the client.
   *
   * @link /session/:sessionId/timeouts/async_script
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.timeoutsAsyncScript  = function(callback) {
    return postRequest('/timeouts/async_script', callback);
  };

  /**
   * Set the amount of time the driver should wait when searching for elements. If this command is never sent, the driver will default to an implicit wait of 0ms.
   *
   * @link /session/:sessionId/timeouts/implicit_wait
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.timeoutsImplicitWait  = function(callback) {
    return postRequest('/timeouts/implicit_wait', callback);
  };

  //////////////////////////////////////////////////////////////////
  // Element related
  //////////////////////////////////////////////////////////////////
  /**
   * Search for an element on the page, starting from the document root. The located element will be returned as a WebElement JSON object.
   *
   * @link /session/:sessionId/element
   * @param {string} using The locator strategy to use.
   * @param {string} value The search target.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.element = function(using, value, callback) {
    var strategies = ['class name', 'css selector', 'id', 'name', 'link text',
      'partial link text', 'tag name', 'xpath'];
    using = using.toLocaleLowerCase();

    if (strategies.indexOf(using) === -1) {
      throw new Error('Provided locating strategy is not supported: ' +
        using + '. It must be one of the following:\n' +
        strategies.join(', '));
    }

    return postRequest('/element', {
      using: using,
      value: value
    }, callback);
  };

  /**
   * Search for multiple elements on the page, starting from the document root. The located elements will be returned as a WebElement JSON objects.
   *
   * @link /session/:sessionId/elements
   * @param {string} using The locator strategy to use.
   * @param {string} value The search target.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elements = function(using, value, callback) {
    var check = /class name|css selector|id|name|link text|partial link text|tag name|xpath/gi;
    if (!check.test(using)) {
      throw new Error('Please provide any of the following using strings as the first parameter: ' +
        'class name, css selector, id, name, link text, partial link text, tag name or xpath');
    }

    return postRequest('/elements', {
      using: using,
      value: value
    }, callback);
  };

  /**
   * Get the element on the page that currently has focus.
   *
   * @link /session/:sessionId/element/active
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementActive = function(callback) {
    return postRequest('/element/active', {}, callback);
  };

  /**
   * Get the value of an element's attribute.
   *
   * @link /session/:sessionId/element/:id/attribute/:name
   * @param {string} id ID of the element to route the command to.
   * @param {string} attributeName The attribute name
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdAttribute = function(id, attributeName, callback) {
    return getRequest('/element/' + id + '/attribute/' + attributeName, callback);
  };

  /**
   * Click on an element.
   *
   * @link /session/:sessionId/element/:id/click
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdClick = function(id, callback) {
    return postRequest('/element/' + id + '/click', '', callback);
  };

  /**
   * Query the value of an element's computed CSS property.
   *
   * The CSS property to query should be specified using the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
   *
   * @link /session/:sessionId/element/:id/css/:propertyName
   * @param {string} id ID of the element to route the command to.
   * @param {string} cssPropertyName
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdCssProperty = function(id, cssPropertyName, callback) {
    return getRequest('/element/' + id + '/css/' + cssPropertyName, callback);
  };

  /**
   * Determine if an element is currently displayed.
   *
   * @link /session/:sessionId/element/:id/displayed
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdDisplayed = function(id, callback) {
    return getRequest('/element/' + id + '/displayed', callback);
  };

  /**
   * Determine an element's location on the screen once it has been scrolled into view.
   *
   * @link /session/:sessionId/element/:id/location_in_view
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdLocationInView = function(id, callback) {
    return getRequest('/element/' + id + '/location_in_view', callback);
  };

  /**
   * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
   *
   * The element's coordinates are returned as a JSON object with x and y properties.
   *
   * @link /session/:sessionId/element/:id/location
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   * @returns {x:number, y:number} The X and Y coordinates for the element on the page.
   */
  Actions.elementIdLocation = function(id, callback) {
    return getRequest('/element/' + id + '/location', callback);
  };


  /**
   * Query for an element's tag name.
   *
   * @link /session/:sessionId/element/:id/name
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdName = function(id, callback) {
    return getRequest('/element/' + id + '/name', callback);
  };

  /**
   * Clear a TEXTAREA or text INPUT element's value.
   *
   * @link /session/:sessionId/element/:id/clear
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdClear = function(id, callback) {
    return postRequest('/element/' + id + '/clear', callback);
  };

  /**
   * Determine if an OPTION element, or an INPUT element of type checkbox or radiobutton is currently selected.
   *
   * @link /session/:sessionId/element/:id/selected
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdSelected = function(id, callback) {
    return getRequest('/element/' + id + '/selected', callback);
  };

  /**
   * Determine if an element is currently enabled.
   *
   * @link /session/:sessionId/element/:id/enabled
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdEnabled = function(id, callback) {
    return getRequest('/element/' + id + '/enabled', callback);
  };

  /**
   * Test if two element IDs refer to the same DOM element.
   *
   * @link /session/:sessionId/element/:id/equals/:other
   * @param {string} id ID of the element to route the command to.
   * @param {string} otherId ID of the element to compare against.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdEquals = function(id, otherId, callback) {
    return getRequest('/element/' + id + '/equals/' + otherId, callback);
  };

  /**
   * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
   *
   * @link /session/:sessionId/element/:id/size
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdSize = function(id, callback) {
    return getRequest('/element/' + id + '/size', callback);
  };

  /**
   * Returns the visible text for the element.
   *
   * @link /session/:sessionId/element/:id/text
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdText = function(id, callback) {
    return getRequest('/element/' + id + '/text', callback);
  };


  /**
   * Send a sequence of key strokes to an element or returns the current value of the element.
   *
   * @link /session/:sessionId/element/:id/value
   * @param {string} id ID of the element to route the command to.
   * @param {string|none} [value] Value to send to element in case of a POST
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.elementIdValue = function(id, value, callback) {
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      callback = arguments[1];
      return getRequest('/element/' + id + '/value', callback);
    }

    value = String(value);
    return postRequest('/element/' + id + '/value', {
      value: value.split('')
    }, callback);
  };

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
   *
   * @link /session/:sessionId/element/:id/submit
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.submit = function(id, callback) {
    return postRequest('/element/' + id + '/submit', '', callback);
  };

  //////////////////////////////////////////////////////////////////
  // Mouse related
  //////////////////////////////////////////////////////////////////

  /**
   * Move the mouse by an offset of the specificed element. If no element is specified, the move is relative to the current mouse cursor. If an element is provided but no offset, the mouse will be moved to the center of the element.
   *
   * If the element is not visible, it will be scrolled into view.
   *
   * @link /session/:sessionId/moveto
   * @param {string} element Opaque ID assigned to the element to move to. If not specified or is null, the offset is relative to current position of the mouse.
   * @param {number} xoffset X offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
   * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.moveTo = function(element, xoffset, yoffset, callback) {
    var data = {};
    if (typeof element == 'string') {
      data.element = element;
    }
    if (typeof xoffset == 'number') {
      data.xoffset = xoffset;
    }
    if (typeof yoffset == 'number') {
      data.yoffset = yoffset;
    }
    return postRequest('/moveto', data, callback);
  };

  /**
   * Double-clicks at the current mouse coordinates (set by moveto).
   *
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.doubleClick = function(callback) {
    return postRequest('/doubleclick', callback);
  };

  /**
   * Click and hold the left mouse button (at the coordinates set by the last moveto command). Note that the next mouse-related command that should follow is `mouseButtonUp` . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
   *
   * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
   *
   * @link /session/:sessionId/buttondown
   * @param {string|number} button The mouse button
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.mouseButtonDown = function(button, callback) {
    return mouseButtonHandler(DIRECTION_DOWN, button, callback);
  };

  /**
   * Releases the mouse button previously held (where the mouse is currently at). Must be called once for every `mouseButtonDown` command issued.
   *
   * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
   *
   * @link /session/:sessionId/buttonup
   * @param {string|number} button The mouse button
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.mouseButtonUp = function(button, callback) {
    return mouseButtonHandler(DIRECTION_UP, button, callback);
  };

  /*!
   * Helper function for mouseButton actions
   *
   * @param {string} direction
   * @param {string|number} button
   * @param {function} callback
   * @private
   */
  function mouseButtonHandler(direction, button, callback) {
    var buttonIndex;
    if (typeof(button) === 'function') {
      callback = button;
      button = 0;
    }

    if (typeof button === 'string') {
      buttonIndex = [
        MOUSE_BUTTON_LEFT,
        MOUSE_BUTTON_MIDDLE,
        MOUSE_BUTTON_RIGHT
      ].indexOf(button.toLowerCase());

      if (buttonIndex !== -1) {
        button = buttonIndex;
      }
    }

    return postRequest('/button' + direction, {button: button}, callback);
  }

  /////////////////////////////////////////////////////////////////////////////
  // Window specific commands
  /////////////////////////////////////////////////////////////////////////////
  /*!
   * Helper function for execute and execute_async
   *
   * @param {string} path
   * @param {string|function} script
   * @param {Array} args
   * @param {function} callback
   * @private
   */
  function executeHandler(path, script, args, callback) {
    var fn;

    if (typeof script === 'function') {
      fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return ' +
        script.toString().replace(/\n+/g, '') + '.apply(window, passedArgs);';
    } else {
      fn = script;
    }

    if ((arguments.length === 3) && (typeof arguments[2] === 'function')) {
      callback = arguments[2];
      args = [];
    }

    return postRequest(path, {
      script: fn,
      args: args
    }, callback);
  }

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous and the result of evaluating the script is returned to the client.
   * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
   *
   * The function will be invoked with the  provided args array and the values may be accessed via the arguments object in the order specified.
   *
   * ```
   *  this.demoTest = function (browser) {
   *    browser.execute(function(data) {
   *      // resize operation
   *      return true;
   *    }, [imagedata], function(result) {
   *      ...
   *    });
   *  };
   * ```
   *
   * @link /session/:sessionId/execute
   * @param {string|function} body The function body to be injected.
   * @param {Array} args An array of arguments which will be passed to the function.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   * @returns {*} The script result.
   */
  Actions.execute = function(body, args, callback) {
    args = Array.prototype.slice.call(arguments, 0);
    args.unshift('/execute');

    return executeHandler.apply(null, args);
  };

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous and the result of evaluating the script is returned to the client.
   *
   * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for a script result, an error should be returned to the client.
   *
   * ```
   *  this.demoTest = function (browser) {
   *    browser.executeAsync(function(data) {
   *      // resize operation
   *      return true;
   *    }, [imagedata], function(result) {
   *      ...
   *    });
   *  };
   * ```
   *
   * @link /session/:sessionId/execute_async
   * @param {string|function} body The function body to be injected.
   * @param {Array} args An array of arguments which will be passed to the function.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   * @returns {*} The script result.
   */
  Actions.executeAsync = function(script, args, callback) {
    args = Array.prototype.slice.call(arguments, 0);
    args.unshift('/execute_async');

    return executeHandler.apply(null, args);
  };

  /*!
   * @deprecated
   */
  Actions.execute_async = Actions.executeAsync;

  /**
   * Change focus to another frame on the page. If the frame id is missing or null, the server should switch to the page's default content.
   *
   * @link /session/:sessionId/frame
   * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.frame = function(frameId, callback) {
    if (arguments.length === 1 && typeof frameId === 'function') {
      callback = frameId;
      return postRequest('/frame', callback);
    }

    return postRequest('/frame', {
      id: frameId
    }, callback);
  };

  /**
   * Change focus to another window or close the current window.
   *
   * @link /session/:sessionId/window
   * @param {string} method The HTTP method to use
   * @param {string} handleOrName The window to change focus to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @since v0.3.0
   * @api protocol
   */
  Actions.window = function(method, handleOrName, callback) {
    method = method.toUpperCase();

    switch (method) {
      case 'POST':
        if (arguments.length < 2) {
          throw new Error('POST requests to /window must include a name parameter also.');
        }

        return postRequest('/window', {
          name : handleOrName
        }, callback);

      case 'DELETE':
        return deleteRequest('/window', arguments[1]);
      default:
        throw new Error('This method expects first argument to be either POST or DELETE.');
    }
  };

  /**
   * Retrieve the current window handle.
   *
   * @link /session/:sessionId/window_handle
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.windowHandle =  function(callback) {
    return getRequest('/window_handle', callback);
  };

  /*!
   * @deprecated
   */
  Actions.window_handle = Actions.windowHandle;

  /**
   * Retrieve the list of all window handles available to the session.
   *
   * @link /session/:sessionId/window_handles
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.windowHandles = function(callback) {
    return getRequest('/window_handles', callback);
  };

  /*!
   * @deprecated
   */
  Actions.window_handles = Actions.windowHandles;

  /**
   * Change or get the size of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window size.
   *
   * @link /session/:sessionId/window/:windowHandle/size
   * @param {string} windowHandle
   * @param {number} width
   * @param {number} height
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.windowSize = function(windowHandle, width, height, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error('First argument must be a window handle string.');
    }

    var path = '/window/' + windowHandle + '/size';
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      return getRequest(path, arguments[1]);
    }

    width = Number(width);
    height = Number(height);

    if (typeof width !== 'number' || isNaN(width)) {
      throw new Error('Width and height arguments must be passed as numbers.');
    }

    if (typeof height !== 'number' || isNaN(height)) {
      throw new Error('Width and height arguments must be passed as numbers.');
    }

    return postRequest(path, {
      width : width,
      height : height
    }, callback);
  };

  /**
   * Refresh the current page.
   *
   * @link /session/:sessionId/refresh
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.refresh = function(callback) {
    return postRequest('/refresh', callback);
  };

  /**
   * Take a screenshot of the current page.
   *
   * @link /session/:sessionId/screenshot
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.screenshot = function(callback) {
    return getRequest('/screenshot', callback);
  };

  /**
   * Retrieve the URL of the current page or navigate to a new URL.
   *
   * @link /session/:sessionId/url
   * @param {string|function} url If missing, it will return the URL of the current page as an argument to the supplied callback
   * @param {Function} callback
   * @api protocol
   */
  Actions.url = function(url, callback) {
    if (typeof url == 'string') {
      return postRequest('/url', {
        url : url
      }, callback);
    }

    if (typeof url == 'function') {
      callback = url;
    }

    return getRequest('/url', callback);
  };

  /**
   * Query the server's current status.
   *
   * @link /status
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.status = function(callback) {
    return sendRequest({
      method : 'GET',
      path   : '/status'
    }, callback);
  };

  /**
   * Get the current page title.
   *
   * @link /session/:sessionId/title
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.title = function(callback) {
    return getRequest('/title', callback);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Cookies
  /////////////////////////////////////////////////////////////////////////////
  /**
   * Retrieve or delete all cookies visible to the current page or set a cookie.
   *
   * @link /session/:sessionId/cookie
   * @param {string} method Http method
   * @param {function|object} [callbackOrCookie] Optional callback function to be called when the command finishes.
   * @since v0.4.0
   * @api protocol
   */
  Actions.cookie = function(method, callbackOrCookie) {
    switch (method) {
      case 'GET':
        return getRequest('/cookie', callbackOrCookie);
      case 'POST':
        if (arguments.length < 2) {
          throw new Error('POST requests to /cookie must include a cookie object parameter also.');
        }
        return postRequest('/cookie', {
          cookie : callbackOrCookie
        }, arguments[2]);
      case 'DELETE':
        if (typeof callbackOrCookie === 'undefined' || typeof callbackOrCookie === 'function') {
          return deleteRequest('/cookie', callbackOrCookie);
        }
        return deleteRequest('/cookie/' + callbackOrCookie, arguments[2]);
      default:
        throw new Error('This method expects first argument to be either GET, POST or DELETE.');
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // Alert handling
  /////////////////////////////////////////////////////////////////////////////
  /**
   * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
   *
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.acceptAlert = function(callback) {
    return postRequest('/accept_alert', callback);
  };

  /*!
   * @deprecated
   */
  Actions.accept_alert = Actions.acceptAlert;

  /**
   * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
   *
   * For alert() dialogs, this is equivalent to clicking the 'OK' button.
   *
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  Actions.dismissAlert = function(callback) {
    return postRequest('/dismiss_alert', callback);
  };

  /*!
   * @deprecated
   */
  Actions.dismiss_alert = Actions.dismissAlert;

  /////////////////////////////////////////////////////////////////////////////
  // Helpers
  /////////////////////////////////////////////////////////////////////////////
  function getRequest(path, callback) {
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'GET'
    };
    return sendRequest(options, callback);
  }

  function deleteRequest(path, callback) {
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'DELETE'
    };
    return sendRequest(options, callback);
  }

  function postRequest(path, data, callback) {
    if (arguments.length === 2 && typeof data === 'function') {
      callback = data;
      data = '';
    }
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'POST',
      data : data || ''
    };
    return sendRequest(options, callback);
  }

  function sendRequest(options, callback) {
    callback = callback || function() {};
    return Nightwatch.runProtocolAction(options, callback).send();
  }

  return Actions;
};
