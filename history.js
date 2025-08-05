window.addEventListener('DOMContentLoaded', async () => {
  const matchHistoryUl = document.getElementById('matchHistory');
  const rankingListUl = document.getElementById('rankingList');

  async function loadMatches() {
    const snapshot = await db.collection('matches').orderBy('createdAt', 'desc').get();
    matchHistoryUl.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${data.player1} (czołg #${data.player1Pos}) vs ${data.player2} (czołg #${data.player2Pos}) — zwycięzca: Gracz ${data.winner}`;
      matchHistoryUl.appendChild(li);
    });
  }

  async function loadRanking() {
    const snapshot = await db.collection('matches').get();
    const scores = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      if (!scores[data.player1]) scores[data.player1] = 0;
      if (!scores[data.player2]) scores[data.player2] = 0;
      if (data.winner === '1') scores[data.player1]++;
      else if (data.winner === '2') scores[data.player2]++;
    });

    const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    rankingListUl.innerHTML = '';

    ranking.forEach(([player, wins]) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${player}: ${wins} wygranych`;
      rankingListUl.appendChild(li);
    });
  }

  await loadMatches();
  await loadRanking();
});
