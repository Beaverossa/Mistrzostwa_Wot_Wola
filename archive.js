window.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const tankList = document.getElementById('tankList');

  const snapshot = await db.collection('tankLists').get();
  snapshot.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.id;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener('change', async () => {
    tankList.innerHTML = '';
    const name = userSelect.value;
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
  });
});
