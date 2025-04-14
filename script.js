'use strict';

let toDoArr = [];
let toDoArrId = [];
let checkedArray = [];

// localStorage
const saveToDoToLocalStorage = function () {
  localStorage.setItem('toDoList', JSON.stringify(toDoArr));
  localStorage.setItem('checkedArray', JSON.stringify(checkedArray));
};

const loadToDoFromLocalStorage = function () {
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
  saveToDoToLocalStorage();
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

const addDeleteAllListener = function () {
  // add event listener for delete all button
  const deleteAllBtn = document.querySelector('#deleteAllButton');
  deleteAllBtn.addEventListener('click', function () {
    toDoArr = [];
    checkedArray = [];
    saveToDoToLocalStorage();
    updateToDo();
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
      saveToDoToLocalStorage();
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
    saveToDoToLocalStorage();
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

// Clock
const displayTime = document.getElementById('timeDisplay');

const showCurrentTime = () => {
  const now = new Date();
  displayTime.textContent = now.toLocaleTimeString();
};

let initialDocumentTitle = 'My TODO App';
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

const updateProgressBar = (timeDurationInTimer) => {
  console.log('progress bar updated');
  const progressBar = document.querySelector('#timerProgressBar');
  const progress = ((timeDuration - timeDurationInTimer) / timeDuration) * 100;
  progressBar.style.width = `${progress}%`;
  if (progress >= 100) {
    progressBar.style.width = `100%`;
    setTimeout(() => {
      progressBar.style.transition = 'none';
      progressBar.style.width = `0%`;
      // Re-enable transition for future updates
      setTimeout(() => {
        progressBar.style.transition = 'width 1s linear';
      }, 50);
    }, 3000);
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
    updateProgressBar(timeDurationInTimer);
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
    // reset progress bar
    console.log('update progress bar');
    updateProgressBar(0);
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
  // set mode timer duration
  if (mode === 'work') {
    timerDurationWork = timeDuration;
    localStorage.setItem('timerDurationWork', timerDurationWork);
  } else if (mode === 'break') {
    timerDurationBreak = timeDuration;
    localStorage.setItem('timerDurationBreak', timerDurationBreak);
  } else if (mode === 'longBreak') {
    timerDurationLongBreak = timeDuration;
    localStorage.setItem('timerDurationLongBreak', timerDurationLongBreak);
  }
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
  // set time durations when user clicks on different modes
  if (mode === 'work') {
    timeDuration = timerDurationWork;
  } else if (mode === 'break') {
    timeDuration = timerDurationBreak;
  } else if (mode === 'longBreak') {
    timeDuration = timerDurationLongBreak;
  }
  timeDurationInTimer = timeDuration;
  // set timer display to mode duration
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

const loadTimesFromLocalStorage = () => {
  const timerDurationWorkLoaded = localStorage.getItem('timerDurationWork');
  const timerDurationBreakLoaded = localStorage.getItem('timerDurationBreak');
  const timerDurationLongBreakLoaded = localStorage.getItem(
    'timerDurationLongBreak'
  );
  if (timerDurationWorkLoaded === null) {
    // if not set, set default values
    console.log(timerDurationBreak, timerDurationWork, timerDurationLongBreak);
    localStorage.setItem('timerDurationWork', timerDurationWork);
    localStorage.setItem('timerDurationBreak', timerDurationBreak);
    localStorage.setItem('timerDurationLongBreak', timerDurationLongBreak);
    return;
  } else {
    timerDurationWork = parseInt(timerDurationWorkLoaded);
    timerDurationBreak = parseInt(timerDurationBreakLoaded);
    timerDurationLongBreak = parseInt(timerDurationLongBreakLoaded);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('document loaded');
  // update to do array
  loadToDoFromLocalStorage();
  updateToDo();
  addDeleteAllListener();
  console.log(toDoArrId);
  console.log(...toDoArr);
  // update times overwriting default values
  loadTimesFromLocalStorage();
  setMode();
  console.log(timerDurationWork, timerDurationBreak, timerDurationLongBreak);
  // ensures that event listeners are added after DOM is loaded;
  addTimerListeners();
  addModeListeners();
  setInterval(showCurrentTime, 1000);
});
