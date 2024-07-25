// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener('submit', onSubmit);

function promiseCreate(delay, radioCheck) {
  const data = { delay, radioCheck };

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (radioCheck === 'fulfilled') {
        res(data);
      } else {
        rej(data);
      }
    }, delay);
  });
}

function onSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const delay = Number(form.elements.delay.value);
  const radioChecked = form.elements.state.value;

  promiseCreate(delay, radioChecked)
    .then(({ delay }) => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay} ms`,
      });
    })
    .catch(({ delay }) => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay} ms`,
      });
    });

  form.reset();
}

