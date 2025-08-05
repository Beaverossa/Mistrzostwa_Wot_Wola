window.addEventListener('DOMContentLoaded', () => {
  const auth = window.auth;
  const db = window.db;

  const matchHistory = document.getElementById('matchHistory');
  const rankingList = document.getElementById('rankingList');
  const logoutBtn = document.getElementById('logoutBtn');

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
    } else {
      loadMatches();
    }
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  });

  async function loadMatches() {
    try {
      const snapshot = await db.collection('matches').orderBy('createdAt', 'desc').get();
      matchHistory.innerHTML = '';
      snapshot.forEach(doc => {
        const m = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${m.player1} [${m.player1Pos}] vs ${m.player2} [${m.player2Pos}] - Zwycięzca: Gracz ${m.winner}`;
        matchHistory.appendChild(li);
      });

      loadRanking(snapshot.docs.map(d => d.data()));
    } catch (err) {
      alert('Błąd ładowania historii: ' + err.message);
    }
  }

  function loadRanking(matches) {
    const scores = {};

    matches.forEach(m => {
      const winnerKey = m.winner === '1' ? m.player1 : m.player2;
      if (!scores[winnerKey]) scores[winnerKey] = 0;
      scores[winnerKey]++;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    rankingList.innerHTML = '';
    sorted.forEach(([player, wins]) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${player} - ${wins} wygranych`;
      rankingList.appendChild(li);
    });
  }
});
