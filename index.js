// Объявление переменных - Строковых констант
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';

// Объявление переменных - ссылок на html элементы
const inputNode = document.getElementById('expenseInput');
const categorySelectNode = document.getElementById('categorySelect');
const addButtonNode= document.getElementById('addButton');
const clearButtonNode = document.getElementById('clearButton');
const totalValueNode = document.getElementById('totalValue');
const statusNode = document.getElementById('statusText');
const historyList = document.getElementById('historyList');
const changeLimitBtn = document.getElementById('changeLimitBtn');

   // Получаем лимит из элемента HTML с id limitValue
   const limitNode = document.getElementById('limitValue');
   let limit = parseInt(limitNode.innerText);

function initLimit() {
   const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
   if (!limitFromStorage) {
      return;
   }
   limitNode.innerText = limitFromStorage;
   limit = parseInt(limitNode.innerText);
}

initLimit();
// Объявление нашей основной переменной
// При запуске она содержит в себе пустой массив
// который мы пополняем по нажатию на копку Добавить
const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if (Array.isArray(expensesFromStorage)) {
   expenses = expensesFromStorage;
}
render();

// ---------------- ФУНКЦИИ -----------------------------

// Подсчитываем и возвращаем сумму всех трат
function getTotal() {
   let sum = 0;
   // пробегаем по массиву объектов expense, берем из каждого поле amount и прибавляем к переменной sum
   expenses.forEach(function (expense) {
      sum += expense.amount;
   });

   return sum;
}

// отрисовываем/обновляем блок "Всего", "Лимит" и "Статус"
function renderStatus() {
   // создаем переменную total(всего) и записываем в нее результат выполнения getTotal
   const total = getTotal(expenses);
   totalValueNode.innerText = total;

   // условие сравнение - что больше всего или лимит
   if (total <= limit) {
      statusNode.innerText = STATUS_IN_LIMIT;
      statusNode.className = 'stats__statusText_positive';
   } else {
      // шаблонная строка - строка в которую можно вставить переменные
      statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб)`;
      statusNode.className = 'stats_statusText_negative';
   }
}

// Отрисовываем/обновляем блок
function renderHistory() {
   historyList.innerHTML = '';

   // цикл по массиву expenses, где каждый элемент - запись о расходе (сумма и категория)
   expenses.forEach(function (expense) {
      // создание массива li (он пока создан только в памяти)
      const historyItem = document.createElement('li');

      // через свойство className также можно прописывать классы
      historyItem.className = 'rub';

      // снова создаем шаблонную строку
      // формат категория - сумма (а не наоборот чтобы не усложнять html)
      historyItem.innerText = `${expense.category} - ${expense.amount}`;

      // берем наш li из памяти и вставляем в документ, в конец historyList
      historyList.appendChild(historyItem);
   })
}

// Отрисовываем/обновляем весь интерфейс ( историю, всего, статус)
function render() {
   // вызываем функцию обновления статуса и 'всего'
   renderStatus();

   // вызываем функцию обновления истории
   renderHistory();
}

// Возвращаем введенную пользователем сумму
function getExpenseFromUser() {
   return parseInt(inputNode.value);
}

// Возвращаем выбранную пользователем категорию
function getSelectedCategory() {
   return categorySelectNode.value;
}

// функция очистки поля ввода суммы
// на вход получаем переменную input в которой мы ожидаем html элемент input

const clearInput = (input) => {
   input.value = '';
}; 

function saveExpensesToStorage() {
   const expensesString = JSON.stringify(expenses);
   localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}
// Функция-обработчик которая будет вызвана при нажатии на кнопку добавить
function addButtonHandler() {
   // сохраняем в переменную currentAmount(текущаяСумма) введенная сумма
   const currentAmount = getExpenseFromUser();
   if (!currentAmount) {
      alert('Введите сумму трат');
      return;
   }

   // сохраняем в переменную currentCategory(текущая Категория) выбранную категорию
   const currentCategory = getSelectedCategory();
   // если текущаяКатегория равна значению Категория
   if (currentCategory === 'Категория') {
      // тогда выйди из функции, т.к это говорит нам о том что пользователь не выбрал категорию
      alert('Не задана категория');
      return;
   }

   // из полученных переменных собираем объект newExpense (новыйРасход)
   // который состоит из двух полей - amount, в которое записано  значение currentlyAmount и category, в которое записано currentCategory
   const newExpense = { amount: currentAmount, category: currentCategory };
   console.log(newExpense);

   // Добовляем наш новыйРасход в массив расходов
   expenses.push(newExpense);
   saveExpensesToStorage();

   // перерисовываем интерфейс
   render();

   //сбрсываем введенную сумму
   clearInput(inputNode);
}

// функция обработчик кнопки "Сбросить расходы"
function clearButtonHandler() {
   expenses = [];
   render();
}

// функция обработчик (хендлер) кнопки изменения лимита
function changeLimitHandler() {
   // в переменную newLimit записываем результат выполнения функции promt
   // которой передаем параметр "Новый лимит"
   // promt вызывает встроенную в браузер модалку с инпутом
   // а возвращает то что ввел в инпут пользователь
   const CHANGE_LIMIT_TEXT = 'Новый лимит';
   const newLimit = prompt(CHANGE_LIMIT_TEXT);

   // потому что там может быть строка
   const newLimitValue = parseInt(newLimit);

   if (!newLimitValue) {
      return;
   }

   // прописываем в html новое значение лимита
   limitNode.innerText = newLimitValue;
   // а также прописываем это значение в нашу переменную с лимитом
   limit = newLimitValue;
   localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue);
   //обновляем интерфейс
   render();
}


/* ----------------POPUP--------------------- */
/* const POPUP_OPENED_CLASSNAME = 'popup_open';
const BODY_FIXED_CLASSNAME = 'body_fixed';

const bodyNode = document.querySelector('body');
const popupNode = document.querySelector('.js-popup');
const btnOpenNode = document.querySelector('.js-btn');
const popupContentNode = document.querySelector('.js-popup__content')
const btnCloseNode = document.querySelector('.js-popup__close-btn');

btnOpenNode.addEventListener('click', togglePopup);
btnCloseNode.addEventListener('click', togglePopup);

popupNode.addEventListener('click', (event) => {
   const isClickOutsideContent = !event.composedPath().includes(popupContentNode)

   if (isClickOutsideContent) {
      togglePopup();
   }
})

function togglePopup() {
   popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
   bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);
} */


addButtonNode.addEventListener('click', addButtonHandler);
clearButtonNode.addEventListener('click', clearButtonHandler);
changeLimitBtn.addEventListener('click', changeLimitHandler);