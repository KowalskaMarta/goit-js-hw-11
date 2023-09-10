import axios from 'axios';

const AUTH_TOKEN = '39289578-81c44a31b0c9c16ae76a18111';
// axios.defaults.headers.common['x-api-key'] = AUTH_TOKEN;  //not working with pixabay, only key

const API_CAT_URL = 'https://pixabay.com/api/';

const pageLimit = 40;

const fetchImages = async (queryToFetch, pagetoFetch) => {
  try {
    const { data } = await axios.get(API_CAT_URL, {
      params: {
        key: AUTH_TOKEN,
        q: queryToFetch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pagetoFetch,
        per_page: pageLimit,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { fetchImages, pageLimit };
