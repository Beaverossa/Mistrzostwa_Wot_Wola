window.addEventListener('DOMContentLoaded', async () => {
  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  const player1PosInput = document.getElementById('player1Pos');
  const player2PosInput = document.getElementById('player2Pos');
  const winnerSelect = document.getElementById('winnerSelect');
  const matchForm = document.getElementById('matchForm');

  // Load all player names to selects
  async function loadPlayers() {
    const snapshot = await db.collection('tankLists').get();
    player1Select.innerHTML = '<option value="">-- wybierz --</option>';
    player2Select.innerHTML = '<option value="">-- wybierz --</option>';
    snapshot.forEach(doc => {
      const name = doc.id;
      const option1 = document.createElement('option');
      option1.value = name;
      option1.textContent = name;
      player1Select.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = name;
      option2.textContent = name;
      player2Select.appendChild(option2);
    });
  }

  await loadPlayers();

  matchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const player1 = player1Select.value;
    const player2 = player2Select.value;
    const player1Pos = parseInt(player1PosInput.value);
    const player2Pos = parseInt(player2PosInput.value);
    const winner = winnerSelect.value;

    if (!player1 || !player2 || !winner) {
      alert('Wypełnij wszystkie pola!');
      return;
    }
    if (player1 === player2) {
      alert('Wybierz różnych graczy!');
      return;
    }
    if (player1Pos < 1 || player2Pos < 1) {
      alert('Numer pozycji musi być >= 1!');
      return;
    }

    try {
      await db.collection('matches').add({
        player1,
        player2,
        player1Pos,
        player2Pos,
        winner,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Wynik zapisany!');
      matchForm.reset();
    } catch (err) {
      alert('Błąd zapisu: ' + err.message);
    }
  });
});
