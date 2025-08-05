window.addEventListener('DOMContentLoaded', async () => {
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

  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  const positionInput = document.getElementById('position');
  const winnerSelect = document.getElementById('winnerSelect');
  const matchForm = document.getElementById('matchForm');

  async function loadPlayers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      if (snapshot.empty) {
        alert("Brak dostępnych list czołgów w bazie danych!");
        return;
      }
      snapshot.forEach(doc => {
        const option1 = document.createElement('option');
        option1.value = doc.id;
        option1.textContent = doc.id;
        player1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = doc.id;
        option2.textContent = doc.id;
        player2Select.appendChild(option2);
      });
    } catch (error) {
      alert("Błąd podczas ładowania graczy: " + error.message);
      console.error(error);
    }
  }

  matchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const p1 = player1Select.value;
    const p2 = player2Select.value;
    const pos = parseInt(positionInput.value) - 1;
    const winner = winnerSelect.value === "1" ? p1 : p2;

    try {
      const tanksP1Doc = await db.collection('tankLists').doc(p1).get();
      const tanksP2Doc = await db.collection('tankLists').doc(p2).get();

      if (!tanksP1Doc.exists || !tanksP2Doc.exists) {
        alert("Brak listy czołgów dla jednego z graczy!");
        return;
      }

      const tanksP1 = tanksP1Doc.data().tanks || [];
      const tanksP2 = tanksP2Doc.data().tanks || [];

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
    } catch (error) {
      alert("Błąd podczas zapisu pojedynku: " + error.message);
      console.error(error);
    }
  });

  await loadPlayers();
});
