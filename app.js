const SEDataStorageSchema = {
    name: '',
    expenses: [],
    incomes: [],
    energy: {
        kwHour: 0.0,
        cost: 0.0,
        items: [],
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


// List Page
const listDiv = document.getElementById('list');
const textItemInput = document.getElementById('textItem');
const numberItemInput = document.getElementById('numberItem');
const addItemButton = document.getElementById('addItemButton');
const itemsListUl = document.getElementById('itemsList');
const listLabel = document.getElementById('listLabel');
const returnButton = document.getElementById('returnButton');
let currentList = '';


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




function populateList(kind) {
    listLabel.textContent = (kind === 'expenses') ? 'Despesas' : 'Ganhos';
    currentList = kind;
    const items = fetchFromStorage(kind);
    console.log(items);
    mainDiv.classList.add('hidden');
    listDiv.classList.remove('hidden');
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


itemsListUl.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.getAttribute('data-index');
        const items = fetchFromStorage(currentList);
        items.splice(index, 1);
        saveInStorage(currentList, items);
        showListItems(items);
    }
});


returnButton.addEventListener('click', () => {
    mainDiv.classList.remove('hidden');
    listDiv.classList.add('hidden');
    calculateTotal();
})


function calculateTotal() {
    // Calculate incomes minus expenses
    const incomes = fetchFromStorage('incomes');
    const expenses = fetchFromStorage('expenses');
    // Sum all incomes values
    let totalIncomes = 0;
    incomes.forEach((income) => {
        totalIncomes += parseFloat(income.number);
    });
    // Sum all expenses values
    let totalExpenses = 0;
    expenses.forEach((expense) => {
        totalExpenses += parseFloat(expense.number);
    })
    const total = totalIncomes - totalExpenses;
    totalSpan.textContent = total;
    if (total < 0) {
        totalSpan.classList.add('text-red-500');
        totalSpan.classList.remove('text-green-500');
    } else {
        totalSpan.classList.add('text-green-500');
        totalSpan.classList.remove('text-red-500');
    }
}
