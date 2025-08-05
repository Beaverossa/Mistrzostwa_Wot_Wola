// ===================
// DANE (localStorage)
// ===================

function getTankData() {
  return JSON.parse(localStorage.getItem('tankData') || '{}');
}

function saveTankData(data) {
  localStorage.setItem('tankData', JSON.stringify(data));
}

function getMatchResults() {
  return JSON.parse(localStorage.getItem('matchResults') || '[]');
}

function saveMatchResult(result) {
  const results = getMatchResults();
  results.push(result);
  localStorage.setItem('matchResults', JSON.stringify(results));
}

// ===================
// FORMULARZ – index.html
// ===================

const nameSelect = document.getElementById('nameSelect');
const tankCountContainer = document.getElementById('tankCountContainer');
const tankForm = document.getElementById('tankForm');
const saveButton = document.getElementById('saveButton');

if (nameSelect) {
  nameSelect.addEventListener('change', () => {
    if (nameSelect.value) {
      tankCountContainer.classList.remove('d-none');
    } else {
      tankCountContainer.classList.add('d-none');
      tankForm.innerHTML = '';
      saveButton.classList.add('d-none');
    }
  });
}

function generateTankInputs() {
  const count = parseInt(document.getElementById('tankCount').value);
  if (isNaN(count) || count <= 0) {
    alert('Podaj poprawną liczbę czołgów!');
    return;
  }

  tankForm.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.className = 'form-control my-1';
    input.placeholder = `Czołg #${i}`;
    input.required = true;
    tankForm.appendChild(input);
  }

  saveButton.classList.remove('d-none');
}

function saveList() {
  const name = nameSelect.value;
  const inputs = tankForm.querySelectorAll('input');
  const tanks = Array.from(inputs).map(input => input.value.trim());

  if (tanks.some(name => name === '')) {
    alert('Uzupełnij wszystkie pola z nazwami czołgów!');
    return;
  }

  const data = getTankData();
  data[name] = tanks;
  saveTankData(data);

  alert('Lista zapisana!');
  location.reload();
}

// ===================
// ARCHIWUM – archive.html
// ===================

const userSelect = document.getElementById('userSelect');
const tankList = document.getElementById('tankList');
const deleteBtn = document.getElementById('deleteBtn');

if (userSelect) {
  const data = getTankData();
  Object.keys(data).forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = user;
    userSelect.appendChild(option);
  });
}

function loadUserTanks() {
  const name = userSelect.value;
  tankList.innerHTML = '';
  deleteBtn.classList.add('d-none');

  if (!name) return;

  const tanks = getTankData()[name];
  if (!tanks) return;

  tanks.forEach((tank, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}`;
    li.dataset.tank = tank;
    li.addEventListener('click', function () {
      li.textContent = `${i + 1}. ${this.dataset.tank}`;
    });
    tankList.appendChild(li);
  });

  deleteBtn.classList.remove('d-none');
}

function deleteUser() {
  const name = userSelect.value;
  if (!confirm(`Na pewno usunąć dane dla ${name}?`)) return;

  const data = getTankData();
  delete data[name];
  saveTankData(data);
  alert('Dane usunięte.');
  location.reload();
}

// ===================
// POJEDYNKI – match.html
// ===================

const p1 = document.getElementById('player1');
const p2 = document.getElementById('player2');
const matchContainer = document.getElementById('matchContainer');
const tankNum1 = document.getElementById('tankNum1');
const tankNum2 = document.getElementById('tankNum2');
const revealed1 = document.getElementById('revealed1');
const revealed2 = document.getElementById('revealed2');
const matchResult = document.getElementById('matchResult');
const winnerSelect = document.getElementById('winner');

if (p1 && p2) {
  const data = getTankData();
  Object.keys(data).forEach(user => {
    const opt1 = document.createElement('option');
    opt1.value = user;
    opt1.textContent = user;
    p1.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = user;
    opt2.textContent = user;
    p2.appendChild(opt2);
  });
}

function startMatch() {
  const name1 = p1.value;
  const name2 = p2.value;
  if (!name1 || !name2 || name1 === name2) {
    alert('Wybierz dwóch różnych graczy.');
    return;
  }

  const data = getTankData();
  tankNum1.max = data[name1]?.length || 1;
  tankNum2.max = data[name2]?.length || 1;

  tankNum1.value = '';
  tankNum2.value = '';
  revealed1.textContent = '';
  revealed2.textContent = '';
  winnerSelect.value = '';

  matchContainer.classList.remove('d-none');
  matchResult.classList.add('d-none');
}

function revealMatch() {
  const name1 = p1.value;
  const name2 = p2.value;
  const index1 = parseInt(tankNum1.value) - 1;
  const index2 = parseInt(tankNum2.value) - 1;

  const data = getTankData();
  const tank1 = data[name1]?.[index1];
  const tank2 = data[name2]?.[index2];

  if (!tank1 || !tank2) {
    alert('Nieprawidłowy numer czołgu.');
    return;
  }

  revealed1.textContent = tank1;
  revealed2.textContent = tank2;
  matchResult.classList.remove('d-none');
}

function saveResult() {
  const name1 = p1.value;
  const name2 = p2.value;
  const tank1 = revealed1.textContent;
  const tank2 = revealed2.textContent;
  const winner = winnerSelect.value;

  if (!winner) {
    alert('Wybierz zwycięzcę.');
    return;
  }

  const result = {
    player1: name1,
    player2: name2,
    tank1,
    tank2,
    winner: winner === '1' ? name1 : name2,
    timestamp: new Date().toISOString()
  };

  saveMatchResult(result);
  alert('Wynik zapisany!');
  location.reload();
}

// ===================
// DEMO DANE (jeśli brak danych)
// ===================
if (!localStorage.getItem('tankData')) {
  saveTankData({
    'Jakub': ['Leopard 1', 'T-62A', 'IS-7'],
    'Miłosz': ['T110E5', 'Centurion AX'],
    'Kacper': ['Obj. 140', 'T-100 LT']
  });
}
