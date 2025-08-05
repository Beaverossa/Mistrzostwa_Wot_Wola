window.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');
  const deleteListBtn = document.getElementById('deleteListBtn');

  async function loadPlayers() {
    const snapshot = await db.collection('tankLists').get();
    userSelect.innerHTML = '<option value="">-- wybierz gracza --</option>';
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      userSelect.appendChild(option);
    });
  }

  function clearTanks() {
    tankList.innerHTML = '';
    deleteListBtn.style.display = 'none';
  }

  userSelect.addEventListener('change', async () => {
    clearTanks();
    const selectedUser = userSelect.value;
    if (!selectedUser) return;

    try {
      const doc = await db.collection('tankLists').doc(selectedUser).get();
      if (doc.exists) {
        const tanks = doc.data().tanks || [];
        tanks.forEach((tank, i) => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.textContent = `${i + 1}. ${tank}`;
          tankList.appendChild(li);
        });
        deleteListBtn.style.display = 'inline-block';
      }
    } catch (err) {
      alert('Błąd podczas wczytywania listy: ' + err.message);
    }
  });

  deleteListBtn.addEventListener('click', async () => {
    const selectedUser = userSelect.value;
    if (!selectedUser) return;
    if (!confirm(`Czy na pewno chcesz usunąć listę gracza ${selectedUser}?`)) return;

    try {
      await db.collection('tankLists').doc(selectedUser).delete();
      alert('Lista została usunięta!');
      clearTanks();
      await loadPlayers();
      userSelect.value = '';
    } catch (err) {
      alert('Błąd podczas usuwania listy: ' + err.message);
    }
  });

  await loadPlayers();
});
