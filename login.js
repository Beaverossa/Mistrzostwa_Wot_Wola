window.addEventListener('DOMContentLoaded', () => {
  const auth = window.auth;

  const authForm = document.getElementById('authForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const messageDiv = document.getElementById('message');

  function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : 'green';
  }

  // Login event
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      showMessage('Wypełnij email i hasło', true);
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      showMessage('Zalogowano pomyślnie!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (err) {
      showMessage('Błąd logowania: ' + err.message, true);
    }
  });

  // Register event
  registerBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      showMessage('Wypełnij email i hasło', true);
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      showMessage('Konto utworzone! Możesz się teraz zalogować.');
    } catch (err) {
      showMessage('Błąd rejestracji: ' + err.message, true);
    }
  });
});
