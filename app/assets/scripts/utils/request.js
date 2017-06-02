/*
 * Request object that uses id_token from localstorage
 */

'use strict';
import axios from 'axios';
import config from '../config';
import xtend from 'xtend';

// Basic wrapper to take care of HTTP-requesting boilderplate
// Returns a promise with the response
export default (endpoint, method, options) => {
  const token = localStorage.getItem('id_token');
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  let reqParams = xtend(
    {
      url: endpoint,
      baseURL: config.baseUrl,
      method,
      headers,
      responseType: 'json'
    },
    options || {}
  );

  return axios(reqParams);
};
