import { fetchImages, pageLimit } from './js/pixabay-api';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const searchForm = document.querySelector('#search-form');
const formInput = document.querySelector('#search-form [name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('#load-more');
const scrollTop = document.querySelector('#scroll-top');

let gallerySimpleLightBox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionsDelay: 500,
});

let page = 1;
let numberOfPage = 1;
let inputValue = null;

function generateHTMLphotoCard(searchResults) {
  const myPictureHTML = searchResults.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`;
    }
  );

  gallery.insertAdjacentHTML('beforeend', myPictureHTML.join(''));
}

async function getImages(page, inputValue) {
  try {
    const images = await fetchImages(inputValue, page);
    const searchResult = images.hits;
    console.log(searchResult);

    numberOfPage = Math.ceil(images.totalHits / pageLimit);
    console.log(numberOfPage);

    if (images.totalHits === 0) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      return;
    }

    if (images.totalHits !== 0) {
      Notify.success(`Hooray! We found ${images.totalHits} images.`);
      generateHTMLphotoCard(searchResult);
      gallerySimpleLightBox.refresh();
    }

    if (images.totalHits > pageLimit) {
      loadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function deleteGallery(gallery) {
  while (gallery.firstChild) {
    gallery.firstChild.remove();
  }
}

async function onSubmitForm(event) {
  event.preventDefault();
  deleteGallery(gallery);
  page = 1;
  inputValue = formInput.value;
  loadMore.classList.add('is-hidden');

  console.log(inputValue);

  if (inputValue === '') {
    Notify.failure('Write something to search...');
    return;
  }

  event.currentTarget.reset();

  try {
    await getImages(page, inputValue);
  } catch (error) {
    console.log(error);
  }
}

async function displayMorePhoto() {
  if (page === numberOfPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMore.classList.add('is-hidden');
    return;
  } else {
    Loading.pulse('Loading data, please wait...');
    page += 1;
    try {
      const images = await fetchImages(inputValue, page);
      const searchResult = images.hits;
      console.log(searchResult);
      generateHTMLphotoCard(searchResult);
      gallerySimpleLightBox.refresh();
    } catch (error) {
      console.log(error);
    }
    Loading.remove();
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

searchForm.addEventListener('submit', onSubmitForm);
loadMore.addEventListener('click', displayMorePhoto);
scrollTop.addEventListener('click', scrollToTop);
