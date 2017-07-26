/*
 * The Auth component is responsible for communication with
 * Auth0 using the implicit grant flow: https://auth0.com/docs/api-auth/grant/implicit
 *
 * The component requests an access token (auth0 session token) and an id token (api access token)
 * from Auth0 and adds this token to localstorage.
 *
 * The API access token (id_token) is used to sign requests to the API. It is a JWT
 * that encodes the user roles (IP, SP, Admin) as well as an 'openid' that identifies the user
 */

import Auth0Lock from 'auth0-lock';
import decode from 'jwt-decode';

import {updateTokenStatus, updateSecretStatus, logoutSuccess} from '../actions/index';
import {clientUrl} from '../config';

function getTokenExpirationDate (token) {
  const decoded = decode(token);
  if (!decoded.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
}

function isTokenExpired (token) {
  if (!token) {
    return true;
  }
  try {
    const date = getTokenExpirationDate(token);
    const offsetSeconds = 0;
    if (date === null) {
      return false;
    }

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  // if token is corrupted return that it is expired
  } catch (err) {
    return true;
  }
}

export function getRolesFromToken (token) {
  const decoded = decode(token);

  if (!decoded.roles) {
    return null;
  }

  return decoded.roles;
}

export default class AuthService {
  constructor (clientID, domain, store) {
    if (!this.getSecret()) {
      this.newSecret();
    }
    const secret = this.getSecret();
    this.auth0 = new Auth0Lock(
      clientID,
      domain,
      {
        auth: {
          autoParseHash: false,
          redirectUrl: clientUrl,
          responseType: 'token',
          sso: false,
          params: {
            scope: 'openid roles',
            state: secret
          }
        }
      }
    );

    this.store = store;
  }

  parseHash (hash) {
    // complete the authentication flow
    this.auth0.resumeAuth(
      hash,
      (err, authResult) => {
        // Check the state param to ensure it is correct
        if (!this.checkSecret(authResult.state)) {
          this.store.dispatch(updateSecretStatus('Bad secret returned from Auth0. CSRF protections enabled.'));
        // Won't get here (set token) if the state param is not properly set.
        } else {
          this.setToken(authResult.idToken);
          this.store.dispatch(updateTokenStatus(null, authResult.idToken));
          // Check if authentication failed
          if (err || (authResult && authResult.error)) {
            this.store.dispatch(updateTokenStatus(authResult.error));
          }
        }
      }
    );
  }

  showLock () {
    this.auth0.show();
  }

  loggedIn () {
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  tokenValidJWT (token) {
    if (!token) {
      return true;
    }
    try {
      if (decode(token)) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return true;
  }

  tokenExpired () {
    const token = this.getToken();
    return isTokenExpired(token);
  }

  setToken (idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken () {
    return localStorage.getItem('id_token');
  }

  logout () {
    localStorage.removeItem('id_token');
    return this.store.dispatch(logoutSuccess());
  }

  setSecret (secret) {
    localStorage.setItem('secret', secret);
  }

  checkSecret (secret) {
    return this.getSecret() === secret;
  }

  getSecret () {
    return localStorage.getItem('secret');
  }

  newSecret () {
    // Create secret
    const secret = this.createNonce(30);
    // return secret
    this.setSecret(secret);
  }

  createNonce (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
