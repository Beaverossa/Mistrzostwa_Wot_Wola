window.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');
  const deleteBtn = document.getElementById('deleteBtn');

  function waitForDb() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (typeof db !== 'undefined' && db) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  await waitForDb();

  async function loadUsers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      userSelect.innerHTML = '<option value="">-- wybierz użytkownika --</option>';
      snapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.id;
        userSelect.appendChild(option);
      });
    } catch (error) {
      alert('Błąd podczas ładowania użytkowników: ' + error.message);
    }
  }

  async function showPositions(userId) {
    tankList.innerHTML = '';
    deleteBtn.style.display = userId ? 'inline-block' : 'none';

    if (!userId) return;

    try {
      const doc = await db.collection('tankLists').doc(userId).get();
      if (!doc.exists) {
        tankList.innerHTML = '<li class="list-group-item">Brak danych.</li>';
        return;
      }

      const tanks = doc.data().tanks || [];
      if (tanks.length === 0) {
        tankList.innerHTML = '<li class="list-group-item">Lista czołgów jest pusta.</li>';
        return;
      }

      tanks.forEach((tank, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = `Pozycja ${index + 1}`;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
          alert(`Czołg na pozycji ${index + 1}: ${tank}`);
        });
        tankList.appendChild(li);
      });
    } catch (error) {
      alert('Błąd podczas pobierania listy: ' + error.message);
    }
  }

  userSelect.addEventListener('change', () => {
    const userId = userSelect.value;
    showPositions(userId);
  });

  deleteBtn.addEventListener('click', async () => {
    const userId = userSelect.value;
    if (!userId) return;

    const confirmDelete = confirm(`Czy na pewno chcesz usunąć listę gracza "${userId}"?`);
    if (!confirmDelete) return;

    try {
      await db.collection('tankLists').doc(userId).delete();
      alert(`Lista gracza ${userId} została usunięta.`);
      userSelect.value = '';
      tankList.innerHTML = '';
      deleteBtn.style.display = 'none';
      await loadUsers();
    } catch (err) {
      alert('Błąd przy usuwaniu: ' + err.message);
    }
  });

  await loadUsers();
});
