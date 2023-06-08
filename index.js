const LIMIT = 10000;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'limit_red';

const inputNode = document.querySelector('.js-input');
const buttonNode = document.querySelector('.js-button');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');

const expenses = [];

init(expenses);

// обработчик события
buttonNode.addEventListener('click', function () {
   const expense = getExpanseFromUser();

   if (!expense) {
      return;
   }

   trackExpanse(expense);

   render(expenses);
});

//задаю первичные значения
function init(expenses) {
   limitNode.innerText = LIMIT;
   statusNode.innerText = STATUS_IN_LIMIT;
   sumNode.innerText = calculateExpanses(expenses);
};

function trackExpanse(expense) {
   expenses.push(expense);
}

// получение данных от пользователя
function getExpanseFromUser() {
   if (!inputNode.value) { // исключаем ввод пустой строки
      return null; 
   }

   const expense = parseInt(inputNode.value);
   
   clearInput();

   return expense;
}

 // сброс введенного значение из поля ввода
function clearInput() {
   inputNode.value = '';
}

// считаем сумму расходов
function calculateExpanses(expenses) {
   let sum = 0;

   expenses.forEach(element => {
      sum += element;
   });

   return sum;
}

// отрисовка данных
function render(expenses) {
   const sum = calculateExpanses(expenses);

   renderHistory(expenses);
   renderSum(sum);
   renderStatus(sum);
}

// отрисовка списка транзакций
function renderHistory(expenses) {
   let expensesListHTML = '';

   expenses.forEach(element => {
      expensesListHTML += `<li>${element} ${CURRENCY}</li>`;
   });

   historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

// отрисовка суммы
function renderSum(sum) {
   sumNode.innerText = sum;
}

// сравнение со статусом лимита и вывод состояния
function renderStatus(sum) {
   if (sum <= LIMIT) {
      statusNode.innerText = STATUS_IN_LIMIT;
   } else {
      statusNode.innerText = STATUS_OUT_OF_LIMIT;
      statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
   }
}


