const form = document.getElementById('contact-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const textarea = document.getElementById('textarea');
const messageError = document.getElementById('messageError');

if (form && name && email && textarea && messageError) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!name.value.trim()) {
      messageError.textContent = 'Enter your name.';
      name.focus();
      return;
    }

    if (!email.value.trim() || !email.validity.valid) {
      messageError.textContent = 'Enter a valid email address.';
      email.focus();
      return;
    }

  if (!textarea.value.trim()) {
    messageError.textContent = 'Fill the message box.';
    textarea.focus();
    return;
  }

    window.location.href = 'response.html';
  });
}
