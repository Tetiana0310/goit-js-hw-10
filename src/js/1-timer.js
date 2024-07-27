// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const refs = {
  input: document.querySelector('input#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  mins: document.querySelector('[data-minutes]'),
  secs: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (checkRightDate(userSelectedDate.getTime())) {
      refs.btnStart.disabled = false;
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      refs.btnStart.disabled = true;
    }
  },
};

refs.btnStart.disabled = true;

refs.btnStart.addEventListener('click', onCountTimer);

flatpickr(refs.input, options);

function onCountTimer(evt) {
  evt.preventDefault();
  
  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please select a date first',
    });
    return;
    }
    
    refs.btnStart.disabled = true;
  refs.input.disabled = true;

  const countdownId = setInterval(() => {
    const countdownTime = checkRightDate(userSelectedDate.getTime());
    
    if (countdownTime !== null) {
      displayCountdown(countdownTime);
    } else {
      clearInterval(countdownId)
        refs.input.disabled = false;
      };
    } , 1000);
}

function displayCountdown(time) {
  const { days, hours, minutes, seconds } = convertMs(time);
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.mins.textContent = addLeadingZero(minutes);
  refs.secs.textContent = addLeadingZero(seconds);
}

function checkRightDate(date) {
  const currentDate = Date.now();
  const distance = date - currentDate;

  return date > currentDate ? distance : null;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}