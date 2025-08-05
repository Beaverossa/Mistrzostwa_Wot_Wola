window.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');
  const deleteAllBtn = document.getElementById('deleteAllBtn');

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
    deleteAllBtn.style.display = userId ? 'inline-block' : 'none';

    if (!userId) return;

    try {
      const docRef = db.collection('tankLists').doc(userId);
      const doc = await docRef.get();
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
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const label = document.createElement('span');
        label.textContent = `Pozycja ${index + 1}`;
        label.style.cursor = 'pointer';
        label.onclick = () => alert(`Czołg na pozycji ${index + 1}: ${tank}`);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-outline-danger';
        delBtn.textContent = 'Usuń';
        delBtn.onclick = async () => {
          if (!confirm(`Czy chcesz usunąć pozycję ${index + 1}?`)) return;
          tanks.splice(index, 1); // usuń dany czołg
          await docRef.set({ tanks: tanks, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
          showPositions(userId); // odśwież
        };

        li.appendChild(label);
        li.appendChild(delBtn);
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

  deleteAllBtn.addEventListener('click', async () => {
    const userId = userSelect.value;
    if (!userId) return;

    const confirmDelete = confirm(`Czy na pewno chcesz usunąć całą listę gracza "${userId}"?`);
    if (!confirmDelete) return;

    try {
      await db.collection('tankLists').doc(userId).delete();
      alert(`Lista gracza ${userId} została usunięta.`);
      userSelect.value = '';
      tankList.innerHTML = '';
      deleteAllBtn.style.display = 'none';
      await loadUsers();
    } catch (err) {
      alert('Błąd przy usuwaniu: ' + err.message);
    }
  });

  await loadUsers();
});
