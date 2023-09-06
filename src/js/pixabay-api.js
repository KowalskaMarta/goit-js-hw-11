import axios from 'axios';

const AUTH_TOKEN =
  '39289578-81c44a31b0c9c16ae76a18111';
axios.defaults.headers.common['x-api-key'] = AUTH_TOKEN;

const API_CAT_URL = 'https://api.thecatapi.com/v1';

