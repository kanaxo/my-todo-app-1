'use strict';

let toDoArr = [];
let toDoArrId = [];
let checkedArray = [];

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
    const listElement = `<li class="list-group-item list-group-item-action d-flex">
    <input id = "C${id}" class="strikethrough mr-2" type = "checkbox" ${
      checkedArray.includes(Task) ? 'checked' : ''
    } > 
    <label for="C${id}" class="checkboxText"> ${Task} </label>
    <button class="btn btn-outline-danger btn-sm deleteTask" id="D${id}">Delete</button> 
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

// Clock
const displayTime = document.getElementById('timeDisplay');

const showCurrentTime = () => {
  const now = new Date();
  displayTime.textContent = now.toLocaleTimeString();
};

let initialDocumentTitle;
// Timer
let mode = 'work'; // work, break, longBreak
let timerDurationWork = 1; // 25 minutes in seconds
let timerDurationBreak = 2; // 5 minutes in seconds
let timerDurationLongBreak = 3; // 15 minutes in seconds
let workCounter = 0; // counter for break time

let timeDuration;
let timeDurationInTimer;
let pausedTime;
let timerID;
let timeStart = false;
let changeTimerFlag = false;
timeDuration = timerDurationWork; // time duration which is set in the timer
timeDurationInTimer = timeDuration; // time duration which is displayed and reduced

const timerDisplay = document.querySelector('#timerDisplay');
const timerStart = document.querySelector('.startPauseTimer');
const timerStop = document.querySelector('.stopTimer');
const timerInputMin = document.querySelector('#timerInputMin');
const timerInputSec = document.querySelector('#timerInputSec');
const timerSubmit = document.querySelector('#setTimer');
const timerEdit = document.querySelector('.editTimer');

const workTab = document.querySelector('#workTab');
const sBreakTab = document.querySelector('#sBreakTab');
const lBreakTab = document.querySelector('#lBreakTab');
const timerTabs = document.querySelectorAll('.timerTab');

const getTimeFormat = (timeDuration) => {
  let durationDisplayMin = Math.floor(timeDuration / 60);
  let durationDisplaySec = timeDuration % 60;
  let durationDisplay = `${durationDisplayMin}:${
    durationDisplaySec < 10 ? '0' : ''
  }${durationDisplaySec}`;
  return durationDisplay;
};

const displayTimer = (timeDuration) => {
  let durationDisplay = getTimeFormat(timeDuration);
  timerDisplay.textContent = durationDisplay;
  // display timer in title
  if (timeStart) {
    document.title = `⏳ ${durationDisplay}`;
  } else {
    document.title = initialDocumentTitle;
  }
};

const showTimerEndedMessage = () => {
  const timerEndedModal = document.getElementById('timerEndedModal');
  const modal = new bootstrap.Modal(timerEndedModal);
  modal.show();
  // hide modal after 5 seconds
  setTimeout(() => {
    modal.hide();
  }, 3000);
};

const reduceTimer = () => {
  if (timeDurationInTimer > 0) {
    timeDurationInTimer--;
    displayTimer(timeDurationInTimer);
    console.log('timeDurationInTimer:', timeDurationInTimer);
  } else {
    // play audio
    const alarm = new Audio('audio/microwave-sound.mp3');
    alarm
      .play()
      .then(() => {
        console.log('Audio played successfully');
        showTimerEndedMessage();
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        showTimerEndedMessage();
      });
    // alert('Timer Ended!');
    stopTimer();
    // set mode to next mode
    if (mode === 'work') {
      if ((workCounter + 1) % 4 === 0) {
        mode = 'longBreak';
      } else {
        mode = 'break';
      }
      workCounter++;
    } else if (mode === 'break') {
      mode = 'work';
    } else if (mode === 'longBreak') {
      mode = 'work';
    }
    setMode();
    console.log('Timer Start', timeStart);
    console.log('work counter:', workCounter);
  }
};

const startTimer = () => {
  if (timeStart) {
    clearInterval(timerID);
    timerStart.textContent = 'Start!';
    document.title = `⏳ ${getTimeFormat(timeDurationInTimer)} ❚❚`;
  } else {
    timerStart.textContent = 'Pause!';
    timerID = setInterval(reduceTimer, 1000);
    document.title = `⏳ ${getTimeFormat(timeDurationInTimer)} ▶`;
  }
  timeStart = !timeStart;
  console.log('(start) Timer Start:', timeStart);
};

const stopTimer = () => {
  clearInterval(timerID);
  timeStart = false;
  timerStart.textContent = 'Start!';
  displayTimer(timeDuration);
  timeDurationInTimer = timeDuration;
  console.log('(stop) Timer Start:', timeStart);
};

const editTimer = (e) => {
  e.preventDefault();
  if (!timeStart) {
    // if timer is not running
    changeTimerFlag = !changeTimerFlag;
  }
  if (changeTimerFlag) {
    console.log('changeTimerFlag:', changeTimerFlag);
    toggleTimerInputDivOn();
    changeTimer();
  }
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

  timerDisplay.addEventListener('click', editTimer);
  timerEdit.addEventListener('click', editTimer);
  timerSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    handleTimerChange();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && changeTimerFlag === true) {
      e.preventDefault();
      console.log('Enter pressed');
      handleTimerChange();
    }
  });

  // Add spacebar event listener to start/pause timer
  document.addEventListener('keydown', (e) => {
    if (
      e.key === ' ' &&
      !changeTimerFlag &&
      document.activeElement.tagName !== 'INPUT'
    ) {
      e.preventDefault();
      console.log('Spacebar pressed');
      startTimer();
    }
  });
};

const validateTimerInput = (timerInputMin, timerInputSec) => {
  const re = /^[0-9]+$/;
  if (!re.test(timerInputMin) || !re.test(timerInputSec)) {
    displayTimerError('Please enter a valid time!');
    // set timer input to previous value
    setTimerInputDurationDisplay();
    return false;
  }

  if (Number(timerInputSec) > 59) {
    console.log(Number(timerInputSec));
    displayTimerError('Enter a number between 0-59!');
    // set timer input to previous value
    setTimerInputDurationDisplay();
    return false;
  }

  return true;
};

const displayTimerError = (errorMsg) => {
  let errorMsgPara = document.getElementById('errorMsg');
  errorMsgPara.style.display = 'block';
  errorMsgPara.textContent = errorMsg;
  setTimeout(() => {
    errorMsgPara.style.display = 'none';
  }, 3000);
};

const setTimerInputDurationDisplay = () => {
  let durationDisplayMin = Math.floor(timeDuration / 60);
  let durationDisplaySec = timeDuration % 60;
  let timerInputMin = document.querySelector('#timerInputMin');
  let timerInputSec = document.querySelector('#timerInputSec');
  // change timerDisplay to input text
  timerInputMin.value = durationDisplayMin;
  timerInputSec.value = `${
    durationDisplaySec < 10 ? '0' : ''
  }${durationDisplaySec}`;
};

const handleTimerChange = () => {
  // validate input
  let validateInput = validateTimerInput(
    timerInputMin.value,
    timerInputSec.value
  );
  // if validation fails, exit the function and don't proceed
  console.log('Validate Input:', validateInput);
  if (!validateInput) return;
  // if validation passes, set the new time duration
  changeTimerFlag = false;
  setDurationDisplay();
  toggleTimerInputDivOff();
  console.log('changeTimerFlag', changeTimerFlag);
};

const changeTimer = () => {
  setTimerInputDurationDisplay();
};

const setDurationDisplay = () => {
  timeDuration = getDurationDisplayMin() * 60 + getDurationDisplaySec();
  timeDurationInTimer = timeDuration;
  displayTimer(timeDuration);
};

const toggleTimerInputDivOn = () => {
  document.getElementById('timerDivDisplay').style.display = 'none';
  document.getElementById('timerInputDiv').style.display = 'flex';
  timerEdit.disabled = true;
  timerStart.disabled = true;
  timerStop.disabled = true;
};

const toggleTimerInputDivOff = () => {
  document.getElementById('timerDivDisplay').style.display = 'flex';
  document.getElementById('timerInputDiv').style.display = 'none';
  timerEdit.disabled = false;
  timerStart.disabled = false;
  timerStop.disabled = false;
};

const getDurationDisplayMin = () => {
  return parseInt(document.querySelector('#timerInputMin').value);
};

const getDurationDisplaySec = () => {
  return parseInt(document.querySelector('#timerInputSec').value);
};

const setActiveTimerTab = () => {
  timerTabs.forEach((tab) => {
    tab.classList.remove('active');
  });
  switch (mode) {
    case 'work':
      workTab.classList.add('active');
      break;
    case 'break':
      sBreakTab.classList.add('active');
      break;
    case 'longBreak':
      lBreakTab.classList.add('active');
      break;
  }
};

const setMode = () => {
  if (mode === 'work') {
    timeDuration = timerDurationWork;
  } else if (mode === 'break') {
    timeDuration = timerDurationBreak;
  } else if (mode === 'longBreak') {
    timeDuration = timerDurationLongBreak;
  }
  timeDurationInTimer = timeDuration;
  displayTimer(timeDuration);
  setActiveTimerTab();
};

const addModeListeners = () => {
  timerTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      switch (tab.id) {
        case 'workTab':
          mode = 'work';
          break;
        case 'sBreakTab':
          mode = 'break';
          break;
        case 'lBreakTab':
          mode = 'longBreak';
          break;
      }
      timerTabs.forEach((tab) => {
        tab.classList.remove('active');
      });
      tab.classList.add('active');
      setMode();
      stopTimer();
      // reset timer to default
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // ensures that event listeners are added after DOM is loaded
  initialDocumentTitle = 'My TODO App';
  displayTimer(timeDuration);
  addTimerListeners();
  addModeListeners();
  setInterval(showCurrentTime, 1000);
});
