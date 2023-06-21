const inputNode = document.getElementById('expenseInput');
const categorySelectNode = document.getElementById('categorySelect');
const addButtonNode= document.getElementById('addButton');
const clearButtonNode = document.getElementById('clearButton');
const totalValueNode = document.getElementById('totalValue');
const statusNode = document.getElementById('statusText');
const historyList = document.getElementById('historyList');
const changeLimitBtn = document.getElementById('changeLimitBtn');
const openButtonNode = document.getElementById('openButton');
const closeButtonNode = document.getElementById('closeButton');
const limitInputNode = document.getElementById('limitInput');
const popup = document.getElementById('popup');
const limitNode = document.getElementById('limitValue');

const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';

let expenses = [];
let limit = parseInt(limitNode.innerText);

const getLimitFromUser = () => parseInt(limitInputNode.value);

function initLimit() {
   const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
   if (!limitFromStorage) {
      return;
   }
   limitNode.innerText = limitFromStorage;
   limit = parseInt(limitNode.innerText);
}
initLimit();

const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);

if (Array.isArray(expensesFromStorage)) {
   expenses = expensesFromStorage;
}
render();

function getTotal() {
   let sum = 0;
   expenses.forEach(function (expense) {
      sum += expense.amount;
   });
   return sum;
}

function renderStatus() {
   const total = getTotal(expenses);
   totalValueNode.innerText = total;
   if (total <= limit) {
      statusNode.innerText = STATUS_IN_LIMIT;
      statusNode.className = 'stats__statusText_positive';
   } else {
      statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб)`;
      statusNode.className = 'stats_statusText_negative';
   }
}

function renderHistory() {
   historyList.innerHTML = '';
   expenses.forEach(function (expense) {
      const historyItem = document.createElement('li');
      historyItem.className = 'rub';
      historyItem.innerText = `${expense.category} - ${expense.amount}`;
      historyList.appendChild(historyItem);
   })
}

function render() {
   renderStatus();
   renderHistory();
}

function getExpenseFromUser() {
   return parseInt(inputNode.value);
}

function getSelectedCategory() {
   return categorySelectNode.value;
}

function clearInput(input) {
   input.value = '';
}

function saveExpensesToStorage() {
   const expensesString = JSON.stringify(expenses);
   localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

function addButtonHandler() {
   const currentAmount = getExpenseFromUser();
   if (!currentAmount) {
      alert('Введите сумму трат');
      return;
   }

   const currentCategory = getSelectedCategory();
   if (currentCategory === 'Категория') {
      alert('Не задана категория');
      return;
   }

   const newExpense = { amount: currentAmount, category: currentCategory };
   console.log(newExpense);

   expenses.push(newExpense);
   saveExpensesToStorage();

   render();

   clearInput(inputNode);
}

function clearButtonHandler() {
   expenses = [];
   render();
}

function changeLimitHandler() {
   const newLimitValue = getLimitFromUser();
   if (!newLimitValue) {
      return;
   }

   limitNode.innerText = newLimitValue;
   limit = newLimitValue;
   localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue);
   render();
   clearInput(limitInputNode);
   closeButtonHandler();
}

function openButtonHandler() {
   popup.classList.add('popup_open');
}

function closeButtonHandler() {
   popup.classList.remove('popup_open');
}

addButtonNode.addEventListener('click', addButtonHandler);
clearButtonNode.addEventListener('click', clearButtonHandler);
changeLimitBtn.addEventListener('click', changeLimitHandler);
openButtonNode.addEventListener('click', openButtonHandler);
closeButtonNode.addEventListener('click', closeButtonHandler);