window.addEventListener('DOMContentLoaded', async () => {
  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  const position1Input = document.getElementById('position1');
  const position2Input = document.getElementById('position2');
  const showTanksBtn = document.getElementById('showTanksBtn');
  const tank1Name = document.getElementById('tank1Name');
  const tank2Name = document.getElementById('tank2Name');
  const winnerSelect = document.getElementById('winnerSelect');
  const matchForm = document.getElementById('matchForm');

  async function loadPlayers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      player1Select.innerHTML = '<option value="">-- wybierz gracza --</option>';
      player2Select.innerHTML = '<option value="">-- wybierz gracza --</option>';
      snapshot.forEach(doc => {
        const option1 = document.createElement('option');
        option1.value = doc.id;
        option1.textContent = doc.id;
        player1Select.appendChild(option1);

        const option2 = option1.cloneNode(true);
        player2Select.appendChild(option2);
      });
    } catch (err) {
      alert('Błąd podczas ładowania graczy: ' + err.message);
    }
  }

  async function getTankName(player, position) {
    if (!player || !position) return null;
    try {
      const doc = await db.collection('tankLists').doc(player).get();
      if (doc.exists) {
        const tanks = doc.data().tanks || [];
        const idx = parseInt(position, 10) - 1;
        if (idx >= 0 && idx < tanks.length) {
          return tanks[idx];
        }
      }
    } catch (err) {
      console.error('Error fetching tank:', err);
    }
    return null;
  }

  showTanksBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const player1 = player1Select.value;
    const player2 = player2Select.value;
    const pos1 = position1Input.value;
    const pos2 = position2Input.value;

    if (!player1 || !player2 || !pos1 || !pos2) {
      alert('Wypełnij wszystkie pola aby pokazać nazwy czołgów.');
      return;
    }

    const tank1 = await getTankName(player1, pos1);
    const tank2 = await getTankName(player2, pos2);

    tank1Name.textContent = tank1 || 'Brak danych';
    tank2Name.textContent = tank2 || 'Brak danych';
  });

  matchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const player1 = player1Select.value;
    const player2 = player2Select.value;
    const pos1 = position1Input.value;
    const pos2 = position2Input.value;
    const winner = winnerSelect.value;

    if (!player1 || !player2 || !pos1 || !pos2 || !winner) {
      alert('Wypełnij wszystkie pola.');
      return;
    }

    try {
      await db.collection('matches').add({
        player1,
        player2,
        player1Pos: parseInt(pos1, 10),
        player2Pos: parseInt(pos2, 10),
        winner,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Pojedynek zapisany!');
      matchForm.reset();
      tank1Name.textContent = '';
      tank2Name.textContent = '';
    } catch (err) {
      alert('Błąd podczas zapisu pojedynku: ' + err.message);
    }
  });

  await loadPlayers();
});
