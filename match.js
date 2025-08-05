window.addEventListener('DOMContentLoaded', async () => {
  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  const positionInput = document.getElementById('position');
  const winnerSelect = document.getElementById('winnerSelect');
  const matchForm = document.getElementById('matchForm');

  async function loadPlayers() {
    const snapshot = await db.collection('tankLists').get();
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      player1Select.appendChild(option.cloneNode(true));
      player2Select.appendChild(option.cloneNode(true));
    });
  }

  matchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const p1 = player1Select.value;
    const p2 = player2Select.value;
    const pos = parseInt(positionInput.value) - 1;
    const winner = winnerSelect.value === "1" ? p1 : p2;

    const tanksP1 = (await db.collection('tankLists').doc(p1).get()).data().tanks;
    const tanksP2 = (await db.collection('tankLists').doc(p2).get()).data().tanks;

    const tank1 = tanksP1[pos] || "?";
    const tank2 = tanksP2[pos] || "?";

    await db.collection('matches').add({
      player1: p1,
      tank1: tank1,
      player2: p2,
      tank2: tank2,
      position: pos + 1,
      winner: winner,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Pojedynek zapisany!");
    matchForm.reset();
  });

  loadPlayers();
});
