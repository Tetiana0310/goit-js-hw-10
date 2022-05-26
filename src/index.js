import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function resetInput() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}


function onInputSearch(evt) { 
  const inputValue = evt.target.value.trim();  
  if (inputValue === '') { 
    resetInput(); 
    return; 
  }
  fetchCountries(inputValue) 
    .then(countries => {  
      if (countries.length > 10) { 
        resetInput(); 
        Notify.info('Too many matches found. Please enter a more specific query!'); 
        return; 
      }
      else if (countries.length === 1) { 
        resetInput(); 
        renderCountry(countries[0]); 
        return;  
      }
        renderCountries(countries);  
      
    })
    .catch(error => {  
      resetInput();  
      Notify.failure('Oops, there is no country with that name!'); 
    }
    );
}

let country = null; 

function renderCountry(country) { 
  countryInfo.innerHTML = ` 
      <div class="info-title">
        <img src = "${country.flags.svg}" alt = Flag of"${country.name.official} class = "flag" width="50" ">
        <h1>${country.name.official}</h1>
        <p><span>Capital:</span> ${country.capital}</p>
        <p><span>Population:</span> ${country.population}</p>
        <p><span>Language:</span> ${Object.values(country.languages).join(', ')}</p> 
        </div>`; 
} 

function renderCountries(countries) {  
  resetInput();  
  countries.map(country => {  
    const countryItem = `
      <li>
        <img src = "${country.flags.svg}" alt = Flag of"${country.name.official} width="50" ">
        <span>${country.name.official}</span>
      </li>`; 
    countryList.insertAdjacentHTML('beforeend', countryItem);
  }
);}