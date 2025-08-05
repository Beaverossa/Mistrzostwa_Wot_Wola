window.addEventListener('DOMContentLoaded', async () => {
  const matchHistory = document.getElementById('matchHistory');
  const rankingList = document.getElementById('rankingList');
  const ranking = {};

  const snapshot = await db.collection('matches').orderBy('timestamp', 'desc').get();
  snapshot.forEach(doc => {
    const match = doc.data();
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    li.innerHTML = `
      <span>
        ${match.player1} (${match.tank1}) vs ${match.player2} (${match.tank2})<br>
        Zwycięzca: <strong>${match.winner}</strong>
      </span>
      <button class="btn btn-sm btn-danger" data-id="${doc.id}">Usuń</button>
    `;
    matchHistory.appendChild(li);

    ranking[match.winner] = (ranking[match.winner] || 0) + 1;
  });

  Object.entries(ranking).sort((a, b) => b[1] - a[1]).forEach(([name, wins]) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = `${name}: ${wins} zwycięstw`;
    rankingList.appendChild(li);
  });

  matchHistory.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      if (confirm('Czy na pewno chcesz usunąć ten pojedynek?')) {
        await db.collection('matches').doc(id).delete();
        e.target.closest('li').remove();
      }
    }
  });
});
