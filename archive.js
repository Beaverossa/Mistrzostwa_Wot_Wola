window.addEventListener('DOMContentLoaded', async () => {
  // Czekamy aż zmienna db (Firestore) będzie gotowa
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

  // Funkcja do pobrania listy użytkowników (dokumentów w kolekcji)
  async function loadUsers() {
    try {
      const snapshot = await db.collection('tankLists').get();
      if (snapshot.empty) {
        userSelect.innerHTML = '<option value="">Brak użytkowników w bazie</option>';
        return;
      }
      userSelect.innerHTML = '<option value="">-- wybierz użytkownika --</option>';
      snapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.id;
        userSelect.appendChild(option);
      });
    } catch (error) {
      alert('Błąd podczas ładowania użytkowników: ' + error.message);
    }
  }

  // Po wybraniu użytkownika pokazujemy listę pozycji (bez nazw)
  async function showPositions(userId) {
    tankList.innerHTML = ''; // Czyścimy listę
    if (!userId) return;

    try {
      const doc = await db.collection('tankLists').doc(userId).get();
      if (!doc.exists) {
        tankList.innerHTML = '<li class="list-group-item">Brak danych dla wybranego użytkownika.</li>';
        return;
      }
      const tanks = doc.data().tanks || [];
      if (tanks.length === 0) {
        tankList.innerHTML = '<li class="list-group-item">Lista czołgów jest pusta.</li>';
        return;
      }

      // Tworzymy element listy dla każdej pozycji
      tanks.forEach((tank, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = `Pozycja ${index + 1}`;
        li.style.cursor = 'pointer';

        // Po kliknięciu pokazujemy nazwę czołgu w alert lub możesz zmienić na inny sposób wyświetlania
        li.addEventListener('click', () => {
          alert(`Czołg na pozycji ${index + 1}: ${tank}`);
        });

        tankList.appendChild(li);
      });
    } catch (error) {
      alert('Błąd podczas pobierania listy czołgów: ' + error.message);
    }
  }

  // Nasłuchujemy zmiany wyboru użytkownika
  userSelect.addEventListener('change', () => {
    showPositions(userSelect.value);
  });

  // Start - wczytujemy użytkowników do selecta
  await loadUsers();
});
