window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tankForm');
  const nameSelect = document.getElementById('nameSelect');
  const tankCountInput = document.getElementById('tankCount');
  const tankInputs = document.getElementById('tankInputs');
  const tankCountContainer = document.getElementById('tankCountContainer');

  nameSelect.addEventListener('change', () => {
    tankCountContainer.style.display = nameSelect.value ? 'block' : 'none';
    tankInputs.innerHTML = '';
    tankCountInput.value = '';
  });

  tankCountInput.addEventListener('input', () => {
    const count = parseInt(tankCountInput.value);
    tankInputs.innerHTML = '';
    if (count > 0 && count <= 50) {
      for (let i = 1; i <= count; i++) {
        tankInputs.innerHTML += `
          <div class="mb-2">
            <label class="form-label">Czołg ${i}:</label>
            <input type="text" class="form-control" required />
          </div>
        `;
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!db) {
      alert("Baza danych jeszcze się ładuje. Spróbuj za chwilę.");
      return;
    }

    const name = nameSelect.value;
    const inputs = tankInputs.querySelectorAll('input');
    const tanks = [...inputs].map(input => input.value.trim()).filter(v => v !== '');

    if (tanks.length === 0) {
      alert('Wprowadź co najmniej jeden czołg.');
      return;
    }

    try {
      await db.collection('tankLists').doc(name).set({
        tanks: tanks,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Zapisano listę!');
      form.reset();
      tankInputs.innerHTML = '';
      tankCountContainer.style.display = 'none';
    } catch (err) {
      alert('Błąd podczas zapisu: ' + err.message);
    }
  });
});
