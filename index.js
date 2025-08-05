window.addEventListener('DOMContentLoaded', () => {
  const nameSelect = document.getElementById('name');
  const countInput = document.getElementById('count');
  const tankInputsDiv = document.getElementById('tankInputs');
  const tankForm = document.getElementById('tankForm');

  countInput.addEventListener('change', () => {
    tankInputsDiv.innerHTML = '';
    const count = parseInt(countInput.value);
    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.classList.add('form-control', 'mb-2');
        input.placeholder = `Czołg #${i}`;
        input.required = true;
        tankInputsDiv.appendChild(input);
      }
    }
  });

  tankForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameSelect.value;
    const inputs = tankInputsDiv.querySelectorAll('input');
    const tanks = Array.from(inputs).map(input => input.value.trim());

    try {
      await db.collection('tankLists').doc(name).set({ tanks });
      alert('Lista czołgów zapisana!');
      tankForm.reset();
      tankInputsDiv.innerHTML = '';
    } catch (error) {
      alert('Błąd podczas zapisu: ' + error.message);
    }
  });
});
