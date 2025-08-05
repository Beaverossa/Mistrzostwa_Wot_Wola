window.addEventListener('DOMContentLoaded', () => {
  const auth = window.auth;
  const db = window.db;

  const matchForm = document.getElementById('matchForm');
  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  const player1Pos = document.getElementById('player1Pos');
  const player2Pos = document.getElementById('player2Pos');
  const winnerSelect = document.getElementById('winnerSelect');
  const showTank1Btn = document.getElementById('showTank1Btn');
  const showTank2Btn = document.getElementById('showTank2Btn');
  const tank1NameDiv = document.getElementById('tank1Name');
  const tank2NameDiv = document.getElementById('tank2Name');
  const logoutBtn = document.getElementById('logoutBtn');

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
    } else {
      matchForm.style.display = 'block';
      loadPlayers();
    }
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  });

  async function loadPlayers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      player1Select.innerHTML = '<option value="">-- wybierz gracza --</option>';
      player2Select.innerHTML = '<option value="">-- wybierz gracza --</option>';
      snapshot.forEach(doc => {
        const name = doc.id;
        player1Select.innerHTML += `<option value="${name}">${name}</option>`;
        player2Select.innerHTML += `<option value="${name}">${name}</option>`;
      });
    } catch (err) {
      alert('Błąd ładowania graczy: ' + err.message);
    }
  }

  async function getTankName(player, pos) {
    if (!player || !pos) return null;
    try {
      const doc = await db.collection('tankLists').doc(player).get();
      if (!doc.exists) return null;
      const tanks = doc.data().tanks;
      const idx = Number(pos) - 1;
      if (idx < 0 || idx >= tanks.length) return null;
      return tanks[idx];
    } catch {
      return null;
    }
  }

  showTank1Btn.addEventListener('click', async () => {
    const name = await getTankName(player1Select.value, player1Pos.value);
    tank1NameDiv.textContent = name ? name : 'Nie znaleziono czołgu na tej pozycji';
  });

  showTank2Btn.addEventListener('click', async () => {
    const name = await getTankName(player2Select.value, player2Pos.value);
    tank2NameDiv.textContent = name ? name : 'Nie znaleziono czołgu na tej pozycji';
  });

  matchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!player1Select.value || !player2Select.value) {
      alert('Wybierz oboje graczy.');
      return;
    }
    if (!player1Pos.value || !player2Pos.value) {
      alert('Wprowadź numery pozycji obu graczy.');
      return;
    }
    if (player1Select.value === player2Select.value && player1Pos.value === player2Pos.value) {
      alert('Obaj gracze nie mogą wybrać tego samego czołgu.');
      return;
    }

    const winner = winnerSelect.value;
    const user = auth.currentUser;

    try {
      await db.collection('matches').add({
        player1: player1Select.value,
        player2: player2Select.value,
        player1Pos: Number(player1Pos.value),
        player2Pos: Number(player2Pos.value),
        winner,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid
      });
      alert('Wynik zapisany!');
      matchForm.reset();
      tank1NameDiv.textContent = '';
      tank2NameDiv.textContent = '';
    } catch (err) {
      alert('Błąd zapisu wyniku: ' + err.message);
    }
  });
});
