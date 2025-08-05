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

  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');

  try {
    const snapshot = await db.collection('tankLists').get();
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      userSelect.appendChild(option);
    });
  } catch (error) {
    alert("Błąd podczas ładowania użytkowników: " + error.message);
  }

  userSelect.addEventListener('change', async () => {
    tankList.innerHTML = '';
    const name = userSelect.value;
    if (!name) return;

    try {
      const doc = await db.collection('tankLists').doc(name).get();
      if (!doc.exists) return;
      const tanks = doc.data().tanks || [];
      tanks.forEach((tank, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `Pozycja ${index + 1}`;
        li.addEventListener('click', () => {
          li.textContent = `Pozycja ${index + 1}: ${tank}`;
        });
        tankList.appendChild(li);
      });
    } catch (error) {
      alert("Błąd podczas ładowania czołgów: " + error.message);
    }
  });
});
