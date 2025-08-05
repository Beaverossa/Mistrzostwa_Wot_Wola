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
  const position1Input = document.getElementById('position1');
  const position2Input = document.getElementById('position2');
  const showTanksBtn = document.getElementById('showTanksBtn');
  const tanksDisplay = document.getElementById('tanksDisplay');
  const tankName1Span = document.getElementById('tankName1');
  const tankName2Span = document.getElementById('tankName2');
  const winnerSelect = document.getElementById('winnerSelect');
  const matchForm = document.getElementById('matchForm');

  let tanksP1 = [];
  let tanksP2 = [];

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

  async function loadTanksForPlayer(playerId) {
    if (!playerId) return [];
    try {
      const doc = await db.collection('tankLists').doc(playerId).get();
      if (!doc.exists) return [];
      return doc.data().tanks || [];
    } catch (error) {
      alert(`Błąd podczas ładowania czołgów dla gracza ${playerId}: ${error.message}`);
      return [];
    }
  }

  showTanksBtn.addEventListener('click', async () => {
    // Debug log
    console.log('Pokaż nazwy czołgów - kliknięte');

    const p1 = player1Select.value;
    const p2 = player2Select.value;
    const pos1 = parseInt(position1Input.value);
    const pos2 = parseInt(position2Input.value);

    if (!p1 || !p2) {
      alert("Wybierz obu graczy.");
      return;
    }
    if (!pos1 || pos1 < 1 || !pos2 || pos2 < 1) {
      alert("Wpisz poprawne numery czołgów (>=1).");
      return;
    }

    if (player1Select.dataset.loaded !== p1) {
      tanksP1 = await loadTanksForPlayer(p1);
      player1Select.dataset.loaded = p1;
      console.log('Załadowano czołgi gracza 1:', tanksP1);
    }
    if (player2Select.dataset.loaded !== p2) {
      tanksP2 = await loadTanksForPlayer(p2);
      player2Select.dataset.loaded = p2;
      console.log('Załadowano czołgi gracza 2:', tanksP2);
    }

    const tank1 = tanksP1[pos1 - 1] || "Brak czołgu na tej pozycji";
    const tank2 = tanksP2[pos2 - 1] || "Brak czołgu na tej pozycji";

    tankName1Span.textContent = tank1;
    tankName2Span.textContent = tank2;

    tanksDisplay.style.display = 'block';
  });

  await loadPlayers();
});
