const loadingDiv = document.getElementById('loading');
const loginDiv = document.getElementById('login');
const mainDiv = document.getElementById('main');
const nameInput = document.getElementById('nameInput');
const enterButton = document.getElementById('enterButton');
const greeting = document.getElementById('greeting');
const loadTime = 3000;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
      loadingDiv.style.display = 'none';

      const name = localStorage.getItem('SEName');
      if (name) {
          greeting.textContent = `Olá, ${name}`;
          mainDiv.style.display = 'block';
      } else {
          loginDiv.style.display = 'block';
      }
  }, loadTime);
})

enterButton.addEventListener('click', () => {
    const name = nameInput.value;
    if (name.trim() !== '') {
        localStorage.setItem('SEName', name);
        loginDiv.style.display = 'none';
        greeting.textContent = `Olá, ${name}`;
        mainDiv.style.display = 'block';
    }
});


function fetchFromStorage(key) {
    const item = localStorage.getItem(key);
    return JSON.parse(item);
}

function saveInStorage(key, value) {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
}