const button = document.getElementById('button');
const name = document.getElementById('name');
const email = document.getElementById('email');
const textarea = document.getElementById('textarea');
const messageError = document.getElementById('messageError');
  
button.addEventListener('click', function() {
  if (!textarea.value.trim()) {
    messageError.textContent = 'Fill the message box.';
    messageError.style.color = 'rgba(46, 20, 78, 0.53)';
    return;
  }
  if (!email.value.trim()) {
    messageError.textContent = 'Enter your email.';
    messageError.style.color = 'rgba(46, 20, 78, 0.53)';
    return;
  }

  window.location.href = "response.html";
});
