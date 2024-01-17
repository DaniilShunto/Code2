// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

'use strict';

const apiHandler = require("ep_etherpad-lite/node/handler/APIHandler");
const HTTPError = require('http-errors');


let readSessionsStore = {};

function addSession(groupID, sessionID) {
  groupID = trim(groupID);
  sessionID = trim(sessionID);

  //initialize group if it does not exist
  if (!readSessionsStore[groupID]) {
    readSessionsStore[groupID] = {};
  }

  readSessionsStore[groupID][sessionID] = {};

}

function deleteSession(sessionID) {
  sessionID = trim(sessionID);

  for (const [_key, value] of Object.entries(readSessionsStore)) {
    if (sessionID in value) {
      delete value[sessionID];
    }
  }
}


function hasSession(sessionID) {
  sessionID = trim(sessionID);

  for (const [_key, value] of Object.entries(readSessionsStore)) {
    if (sessionID in value) {
      return true;
    }
  }

  return false;
}

function removeGroup(groupID) {
  groupID = trim(groupID);

  delete readSessionsStore[groupID];
}

function trim(id) {
  return id.toString().replace('.', '');
}

/**
 * Handles an error thrown by an API function
 *
 * Sets an appropriate response statusCode and returns the default JSON response format.
 *
 * NOTE: This is stitched together from etherpads internal error handling. Etherpad itself does not 
 * provide utility to plugins to create such response.
 */
function handle_error(err, res) {
  let response = null;

  if (HTTPError.isHttpError(err)) {
    res.statusCode = err.statusCode || 500;
  } else if (err.name === 'apierror') {
    // Bad request
    res.statusCode = 400;
  } else {
    // Unknown error
    console.log("Unknown error in ep_read_session plugin: " + err.toString());
    res.statusCode = 500;
  }

  switch (res.statusCode) {
    case 403: // forbidden
      response = { code: 4, message: err.message, data: null };
      break;
    case 401: // unauthorized (no or wrong api key)
      response = { code: 4, message: err.message, data: null };
      break;
    case 404: // not found (no such function)
      response = { code: 3, message: err.message, data: null };
      break;
    case 500: // server error (internal error)
      response = { code: 2, message: err.message, data: null };
      break;
    case 400: // bad request (wrong parameters)
      // respond with 200 OK to keep old behavior and pass tests
      res.statusCode = 200; // @TODO: this is bad api design
      response = { code: 1, message: err.message, data: null };
      break;
    default:
      response = { code: 1, message: err.message, data: null };
      break;
  }

  return response
}

// Prefix for all plugin routes to avoid possible collision with other plugins
const prefix = 'readSession';

exports.registerRoute = (hookName, args) => {

  /**
   * Creates a new readonly session.
   * 
   * Acts like the normal `createSession` endpoint but additionally flags the created
   * session as readonly
   */
  args.app.get(`/${prefix}/createReadSession`, function (req, res) {
    (async () => {
      let response = null;

      try {
        // use the APIHandler.handle() function to let etherpad check the api_key
        let session = await apiHandler.handle("1", "createSession", req.query, req, res);

        addSession(req.query.groupID, session.sessionID);

        res.status(200);

        response = { code: 0, message: "ok", data: session };
      } catch (err) {
        response = handle_error(err, res)
      }

      return res.send(JSON.stringify(response));
    })();
  });

  /** 
 * Delete a group and its associated readonly sessions.
 * 
 * Acts like the real `deleteGroup` endpoint but also deletes the readonly session flags
 * 
 * NOTE: 
 * Since there is no `deleteGroup` hook we could utilize, this endpoint should be used to 
 * delete groups when using the readonly session plugin.
 */
  args.app.get(`/${prefix}/deleteGroup`, function (req, res) {
    (async () => {
      let response = null;

      try {
        // use the APIHandler.handle() function to let etherpad check the api_key
        await apiHandler.handle("1", "deleteGroup", req.query, req, res);

        // removes the group and the related sessions
        removeGroup(req.query.groupID);

        res.status(200);

        response = { code: 0, message: "ok", data: null };
      } catch (err) {
        response = handle_error(err, res)
      }

      return res.send(JSON.stringify(response));
    })();
  });

  /** 
  * Deletes a session
  *
  * Acts like the real `deleteSession` endpoint but also deletes the readonly session flags.
  */
  args.app.get(`/${prefix}/deleteSession`, function (req, res) {
    (async () => {
      let response = null;

      try {
        // use the APIHandler.handle() function to let etherpad check the api_key
        await apiHandler.handle("1", "deleteSession", req.query, req, res);

        deleteSession(req.query.sessionID);

        res.status(200);

        response = { code: 0, message: "ok", data: null };
      } catch (err) {
        response = handle_error(err, res)
      }

      return res.send(JSON.stringify(response));
    })();
  });
}


/** 
* Authorize users based on their session. If the provided session is flagged as readonly,
* the user will only get read access to the requested pad.
*/
exports.authorize = (_hookName, context, cb) => {
  const sessionId = context.req.cookies.sessionID;

  // ignore this request if no session is set
  if (sessionId == null) {
    return cb([]);
  }

  // check if the session is flagged as readonly
  if (hasSession(sessionId)) {
    return cb(['readOnly']);
  }

  return cb([true])
};

/** 
* Authenticate each user with an 'pass through' user effectively dismissing any need
* for authentication. This hook needs to be enabled in order to enable the authorize hook.
*
* Requests to '/admin' resources falls back to basic auth (or whatever is the default authentication)
*/
exports.authenticate = (_hookName, context, cb) => {
  if (context.req.path.startsWith('/admin')) {
    // fallback to default auth for admin endpoints
    return cb([]);
  }

  let session = context.req.session;
  if (!session) {
    return cb([])
  }

  // authenticate every other endpoint with a fake user.
  const pass_through = {
    password: "empty",
    is_admin: false,
  }

  session.user = pass_through;
  return cb([true]);
};


/** 
* Skip authorization for all ReadSession 'api' endpoints and the `auth_session` endpoint.
*/
exports.preAuthorize = (_hookName, context, cb) => {
  if (context.req.path.startsWith(`/${prefix}/`) || context.req.path.startsWith(`/auth_session`)) {
    return cb([true]);
  }

  return cb([])
};
