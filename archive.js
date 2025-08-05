window.addEventListener('DOMContentLoaded', () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');

  async function waitForDbReady() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (typeof db !== 'undefined' && db) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  async function loadUsers() {
    const snapshot = await db.collection('tankLists').get();
    userSelect.innerHTML = '<option value="">-- Wybierz użytkownika --</option>';
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

    const doc = await db.collection('tankLists').doc(userId).get();
    if (!doc.exists) {
      tankList.innerHTML = '<li class="list-group-item">Brak danych dla tego użytkownika.</li>';
      return;
    }

    const tanks = doc.data().tanks || [];
    if (tanks.length === 0) {
      tankList.innerHTML = '<li class="list-group-item">Brak czołgów w tej liście.</li>';
      return;
    }

    tanks.forEach((tank, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>Pozycja ${index + 1}</span>
        <button class="btn btn-sm btn-outline-primary">Pokaż</button>
      `;

      const button = li.querySelector('button');
      button.addEventListener('click', () => {
        alert(`Czołg: ${tank}`);
      });

      tankList.appendChild(li);
    });
  }

  userSelect.addEventListener('change', () => {
    const selectedUser = userSelect.value;
    showTanksForUser(selectedUser);
  });

  waitForDbReady().then(loadUsers);
});
