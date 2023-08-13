const SEDataStorageSchema = {
  name: '',
  expenses: [],
  incomes: [],
  energy: {
    kWh: 0.00,
    energyExpenses: []
  }
}

const loadingDiv = document.getElementById('loading');
const loginDiv = document.getElementById('login');
const mainDiv = document.getElementById('main');
const nameInput = document.getElementById('nameInput');
const enterButton = document.getElementById('enterButton');
const greeting = document.getElementById('greeting');
const loadTime = 500;
const totalSpan = document.getElementById('total');

const incomesBtn = document.getElementById('incomesBtn');
const expensesBtn = document.getElementById('expensesBtn');
const energyBtn = document.getElementById('energyBtn');

// List Page
const listDiv = document.getElementById('list');
const textItemInput = document.getElementById('textItem');
const numberItemInput = document.getElementById('numberItem');
const addItemButton = document.getElementById('addItemButton');
const itemsListUl = document.getElementById('itemsList');
const listLabel = document.getElementById('listLabel');
const returnButton = document.getElementById('returnButton');
let currentList = '';
let balance = 0.0;

const returnMainButton = document.getElementById('returnMainButton');
const addkWhButton = document.getElementById('addkWhButton');
const addItemEnergyButton = document.getElementById('addItemEnergyButton');
const energyListDiv = document.getElementById('energyList');
const energyKWhInput = document.getElementById('kWhValue');
const currentKWhValue = document.getElementById('currentKWhValue');
const energyItemsList = document.getElementById('energyItemsList');
const energyItemInput = document.getElementById('energyItem');
const energyValueInput = document.getElementById('valueItem');
const energyHoursInput = document.getElementById('hoursItem');
const energyTotalSpan = document.getElementById('energyTotal');
let currentKWh = 0.0;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    loadingDiv.classList.add('hidden');

    const name = fetchFromStorage('name');

    if (name) {
      greeting.textContent = `Olá, ${name}`;
      calculateTotal();
      mainDiv.classList.remove('hidden');
    } else {
      loginDiv.classList.remove('hidden');
    }
  }, loadTime);
})

enterButton.addEventListener('click', () => {
  const name = nameInput.value;
  if (name.trim() !== '') {
    saveInStorage('name', name);
    loginDiv.classList.add('hidden');
    greeting.textContent = `Olá, ${name}`;
    mainDiv.classList.remove('hidden');
  }
});

incomesBtn.addEventListener('click', () => {
  populateList('incomes');
});

expensesBtn.addEventListener('click', () => {
  populateList('expenses');
})

energyBtn.addEventListener('click', () => {
  mainDiv.classList.add('hidden');
  energyListDiv.classList.remove('hidden');
  const energy = fetchFromStorage('energy');
  currentKWhValue.textContent = '0.00';
  if (energy) {
    currentKWh = energy.kWh;
    currentKWhValue.textContent = currentKWh;
    showEnergyItems(energy.energyExpenses);
  }
})

function populateList(kind) {
  listLabel.textContent = (kind === 'expenses') ? 'Despesas' : 'Ganhos';
  currentList = kind;
  const items = fetchFromStorage(kind);
  mainDiv.classList.add('hidden');
  listDiv.classList.remove('hidden');
  itemsListUl.innerHTML = ''
  if (items && items.length > 0) {
    showListItems(items);
  }
}

function fetchFromStorage(key) {
  const storage = localStorage.getItem('SEDataStorageSchema');
  if (storage) {
    const data = JSON.parse(storage);
    return data[key];
  }
}

function saveInStorage(key, value) {
  const item = localStorage.getItem('SEDataStorageSchema') ? JSON.parse(localStorage.getItem('SEDataStorageSchema')) : { ...SEDataStorageSchema };
  item[key] = value;
  localStorage.setItem('SEDataStorageSchema', JSON.stringify(item));
}

function showListItems(items) {
  itemsListUl.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.text} | R$ ${item.number}
    <button data-index="${index}" class="bg-red-500 text-white rounded-full py-1 px-2 leading-none">X</button>`;
    li.classList.add('my-2', 'p-2', 'border', 'border-gray-300', 'rounded-md', 'flex', 'justify-between', 'items-center');
    itemsListUl.appendChild(li);
  });
}

function showEnergyItems(items) {
  energyItemsList.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.text} | R$ ${item.value}
    <button data-index="${index}" class="bg-red-500 text-white rounded-full py-1 px-2 leading-none">X</button>`;
    li.classList.add('my-2', 'p-2', 'border', 'border-gray-300', 'rounded-md', 'flex', 'justify-between', 'items-center');
    energyItemsList.appendChild(li);
  });
}

addItemButton.addEventListener('click', () => {
  const text = textItemInput.value;
  const number = numberItemInput.value;
  if (text.trim() !== '') {
    const items = fetchFromStorage(currentList) || [];
    items.push({ text, number });
    saveInStorage(currentList, items);
    showListItems(items);
    textItemInput.value = '';
    numberItemInput.value = '';
  }
});

addItemEnergyButton.addEventListener('click', () => {
  const text = energyItemInput.value;
  const kw = energyValueInput.value;
  const hours = energyHoursInput.value;
  const value = (kw * hours * 30 * currentKWh).toFixed(2);
  if (text.trim() !== '') {
    const energy = fetchFromStorage('energy') || { ...SEDataStorageSchema.energy };
    energy.energyExpenses.push({ text, value });
    saveInStorage('energy', energy);
    showEnergyItems(energy.energyExpenses);
    energyItemInput.value = '';
    energyValueInput.value = '';
    energyHoursInput.value = '';
  }
});

addkWhButton.addEventListener('click', () => {
  const kWh = energyKWhInput.value;
  if (kWh.trim() !== '') {
    const energy = fetchFromStorage('energy') || { ...SEDataStorageSchema.energy };
    const parsedKWh = parseFloat(kWh).toFixed(2);
    currentKWh = parsedKWh;
    energy.kWh = parsedKWh;
    saveInStorage('energy', energy);
    currentKWhValue.textContent = parsedKWh;
    energyKWhInput.value = '';
  }
});

itemsListUl.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.getAttribute('data-index');
    const items = fetchFromStorage(currentList);
    items.splice(index, 1);
    saveInStorage(currentList, items);
    showListItems(items);
  }
});

energyItemsList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.getAttribute('data-index');
    const energy = fetchFromStorage('energy');
    energy.energyExpenses.splice(index, 1);
    saveInStorage('energy', energy);
    showEnergyItems(energy.energyExpenses);
  }
});

returnButton.addEventListener('click', () => {
  mainDiv.classList.remove('hidden');
  listDiv.classList.add('hidden');
  calculateTotal();
})

returnMainButton.addEventListener('click', () => {
  mainDiv.classList.remove('hidden');
  energyListDiv.classList.add('hidden');
  calculateTotal();
})

function calculateTotal() {
  const incomes = fetchFromStorage('incomes');
  const expenses = fetchFromStorage('expenses');

  let totalIncomes = 0;
  incomes.forEach((income) => {
    totalIncomes += parseFloat(income.number);
  });
  let totalExpenses = 0;
  expenses.forEach((expense) => {
    totalExpenses += parseFloat(expense.number);
  })
  const total = totalIncomes - totalExpenses;
  balance = total;
  totalSpan.textContent = total.toFixed(2);
  if (total < 0) {
    totalSpan.classList.add('text-red-500');
    totalSpan.classList.remove('text-green-500');
  } else {
    totalSpan.classList.add('text-green-500');
    totalSpan.classList.remove('text-red-500');
  }

  const energyExpenses = fetchFromStorage('energy').energyExpenses;
  let totalEnergyExpenses = 0;
  energyExpenses.forEach((expense) => {
    totalEnergyExpenses += parseFloat(expense.value);
  });
  energyTotalSpan.textContent = totalEnergyExpenses.toFixed(2);
}

function clearSEDataStorageSchema() {
  if (window.confirm("Deseja realmente excluir todos as informações?")) {
    localStorage.removeItem('SEDataStorageSchema');
    alert('Dados excluídos.');
    window.location.reload();
  } else {
    alert('Ação cancelada.');
  }
}
