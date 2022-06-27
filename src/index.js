import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const form = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

form.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();

  const searchCountryName = e.target.value.trim();

  return fetchCountries(searchCountryName)
    .then(response => {
      console.log(response);
      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (response.length >= 2 && response.length <= 10) {
        const createMarkupList = response.map(countryListMarkup).join('');
        countryList.innerHTML = createMarkupList;
        cleanCountryInfo();
      }
      if (response.length === 1) {
        const createMarkupInfo = response.map(countryInfoMarkup).join('');
        countryInfo.innerHTML = createMarkupInfo;
        cleanCountryList();
      }
    })
    .catch(Error => Notify.failure('Oops, there is no country with that name'));
}

function countryListMarkup(country) {
  return `<li class="country-item"  >
          <img class="img-item" src="${country.flags.svg}" alt="" />
          <h2 class="title-item">${country.name.official}</h2>
          </li>`;
}

function countryInfoMarkup(country) {
  return `<h1 class="title">${country.name.official}</h1>
            <img class="img-info" src="${country.flags.svg}"  alt="" />
              <ul class="list-info">
                <li class="item-info">Capital: ${country.capital}</li>
                <li class="item-info">Languages: ${Object.values(
                  country.languages
                )}</li>
                <li class="item-info">Population: ${country.population}</li>
              </ul>`;
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error('Error fetching data');
    }
    return response.json();
  });
}

function cleanCountryList() {
  countryList.innerHTML = '';
}
function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}
