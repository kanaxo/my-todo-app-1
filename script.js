'use strict';

let toDoArr = [];
let toDoArrId = [];

// localStorage
const saveToLocalStorage = function () {
  localStorage.setItem('toDoList', JSON.stringify(toDoArr));
  localStorage.setItem('checkedArray', JSON.stringify(checkedArray));
};

const loadFromLocalStorage = function () {
  const savedTasks = localStorage.getItem('toDoList');
  const savedCheckedTasks = localStorage.getItem('checkedArray');
  if (savedTasks) {
    toDoArr = JSON.parse(savedTasks);
  }
  if (savedCheckedTasks) {
    checkedArray = JSON.parse(savedCheckedTasks);
  }
};

const removeElement = function (e) {
  // remove element from toDoArr
  // obtain index
  const selectedIndex = parseInt(e.target.id.slice(1));
  toDoArr.splice(selectedIndex, 1);
  saveToLocalStorage();
  // update list
  updateToDo();
};

// add event listener for button
const addDeleteListener = function () {
  const deleteElems = document.querySelectorAll('button[id^="D"]');
  console.log(deleteElems);
  deleteElems.forEach((btn) => {
    btn.addEventListener('click', removeElement);
  });
};

let checkedArray = [];

// add event listener for checkbox
const addCheckListener = function () {
  const checkboxes = document.querySelectorAll('.strikethrough');
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      const taskText = toDoArr[index];

      if (checkbox.checked) {
        // add to checkedArray
        checkedArray.push(taskText);
      } else {
        const taskIndex = checkedArray.indexOf(taskText);
        if (taskIndex !== -1) checkedArray.splice(taskIndex, 1);
      }
      saveToLocalStorage();
    });
  });
};

const updateToDo = function () {
  const mainList = document.getElementById('toDoList');
  mainList.innerHTML = '';
  toDoArrId = []; // reset to prevent duplication
  toDoArr.forEach((Task, index) => {
    const id = `${index}`;
    toDoArrId.push(id);
    const listElement = `<li>
    <input id = "C${id}" class="strikethrough" type = "checkbox" ${
      checkedArray.includes(Task) ? 'checked' : ''
    } > 
    <label for="C${id}" class="checkboxText"> ${Task} </label>
    <button class="btn btn-outline-primary btn-sm" id="D${id}">Delete</button> 
    </li> 
    `;
    mainList.innerHTML += listElement;
  });
  addDeleteListener();
  addCheckListener();
};

const submitToDo = function () {
  const taskInput = document.getElementById('Task');
  const taskInputVal = taskInput.value.trim();
  console.log(taskInputVal);
  if (taskInputVal !== '') {
    toDoArr.push(taskInputVal);
    saveToLocalStorage();
  }
  updateToDo();
  taskInput.value = '';
};

// add event listener for submit
let toDoForm = document.getElementById('toDoForm');
toDoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // handlesubmit
  submitToDo();
});

// driver code
loadFromLocalStorage();
updateToDo();
console.log(toDoArrId);
console.log(...toDoArr);

// Timer

let timeDuration = 25 * 60;
const timerDisplay = document.querySelector('#timerDisplay');
const timerStart = document.querySelector('.startPauseTimer');
const timerStop = document.querySelector('.stopTimer');
let timerID;
let timeStart = false;

const displayTimer = (timeDuration) => {
  let durationDisplayMin = Math.floor(timeDuration / 60);
  let durationDisplaySec = timeDuration % 60;
  let durationDisplay = `${durationDisplayMin}:${
    durationDisplaySec < 10 ? '0' : ''
  }${durationDisplaySec}`;
  timerDisplay.textContent = durationDisplay;
};

const reduceTimer = () => {
  if (timeDuration > 0) {
    timeDuration -= 1;
    displayTimer(timeDuration);
  } else {
    clearInterval(timerID);
    timerStart.textContent = 'Start!';
    timeStart = false;
  }
};

const startTimer = () => {
  if (timerStart.textContent === 'Pause!') {
    timerStart.textContent = 'Start!';
    timeStart = false;
    clearInterval(timerID);
  } else {
    timerStart.textContent = 'Pause!';
    timeStart = true;
    timerID = setInterval(reduceTimer, 1000);
  }
  console.log('Timer Start:', timeStart);
};

const stopTimer = () => {
  clearInterval(timerID);
  timeStart = false;
  timerStart.textContent = 'Start!';
  timeDuration = 25 * 60;
  displayTimer(timeDuration);
};

const addTimerListeners = () => {
  timerStart.addEventListener('click', (e) => {
    e.preventDefault();
    startTimer();
  });

  timerStop.addEventListener('click', (e) => {
    e.preventDefault();
    stopTimer();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  displayTimer(timeDuration);
  addTimerListeners();
});
