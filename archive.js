window.addEventListener('DOMContentLoaded', () => {
  const auth = window.auth;
  const db = window.db;

  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');
  const deleteListBtn = document.getElementById('deleteListBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  let currentUser = null;

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
    } else {
      currentUser = user;
      loadUsers();
    }
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  });

  async function loadUsers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      userSelect.innerHTML = '<option value="">-- wybierz gracza --</option>';
      snapshot.forEach(doc => {
        userSelect.innerHTML += `<option value="${doc.id}">${doc.id}</option>`;
      });
      deleteListBtn.disabled = true;
      tankList.innerHTML = '';
    } catch (err) {
      alert('Błąd ładowania list: ' + err.message);
    }
  }

  userSelect.addEventListener('change', async () => {
    const name = userSelect.value;
    tankList.innerHTML = '';
    deleteListBtn.disabled = true;
    if (!name) return;

    try {
      const doc = await db.collection('tankLists').doc(name).get();
      if (!doc.exists) {
        tankList.innerHTML = '<li class="list-group-item">Brak danych</li>';
        return;
      }
      const tanks = doc.data().tanks;
      tanks.forEach((tank, i) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${i + 1}. ${tank}`;
        tankList.appendChild(li);
      });
      deleteListBtn.disabled = false;
    } catch (err) {
      alert('Błąd podczas pobierania listy: ' + err.message);
    }
  });

  deleteListBtn.addEventListener('click', async () => {
    const name = userSelect.value;
    if (!name) return;

    if (!confirm(`Czy na pewno chcesz usunąć listę gracza ${name}?`)) return;

    try {
      await db.collection('tankLists').doc(name).delete();
      alert('Lista usunięta.');
      await loadUsers();
      tankList.innerHTML = '';
      deleteListBtn.disabled = true;
      userSelect.value = '';
    } catch (err) {
      alert('Błąd podczas usuwania: ' + err.message);
    }
  });
});
