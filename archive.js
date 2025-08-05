window.addEventListener('DOMContentLoaded', () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');

  // ⏳ Czekaj aż firebase_script.js ustawi db
  async function waitForDbReady() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (typeof db !== 'undefined' && db !== null) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  async function loadUsers() {
    const snapshot = await db.collection('tankLists').get();
    userSelect.innerHTML = '<option value="">-- wybierz --</option>';
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      userSelect.appendChild(option);
    });
  }

  async function showTanksForUser(userId) {
    tankList.innerHTML = '';
    if (!userId) return;

    const docRef = db.collection('tankLists').doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      tankList.innerHTML = '<li class="list-group-item">Brak danych.</li>';
      return;
    }

    const tanks = docSnap.data().tanks || [];

    if (tanks.length === 0) {
      tankList.innerHTML = '<li class="list-group-item">Brak czołgów.</li>';
      return;
    }

    tanks.forEach((tank, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        Pozycja ${index + 1}
        <button class="btn btn-sm btn-outline-secondary float-end" onclick="alert('Czołg: ${tank}')">Pokaż</button>
      `;
      tankList.appendChild(li);
    });
  }

  userSelect.addEventListener('change', () => {
    const selectedUser = userSelect.value;
    showTanksForUser(selectedUser);
  });

  // 🔁 Start
  waitForDbReady().then(loadUsers);
});
