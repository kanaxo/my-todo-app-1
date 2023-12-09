'use strict';

let toDoArr = ['Wake up', 'Make Coffee', 'Brush Teeth'];
let toDoArrId = [];

const removeElement = function (e) {
  // remove element from toDoArr
  // obtain index
  const selectedElem = e.target.id; // D1
  const selectedIndex = selectedElem.slice(1); // 1
  toDoArr.splice(selectedIndex, 1);
  toDoArrId.splice(selectedIndex, 1);
  // update list
  updateToDo();
};
// add event listener for button
const addDeleteListener = function () {
  const deleteElems = document.querySelectorAll(
    toDoArrId.map((id) => `#D${id}`).join(',')
  );
  console.log(deleteElems);
  deleteElems.forEach((deleteElem) => {
    deleteElem.addEventListener('click', removeElement);
  });
};

const updateToDo = function () {
  const mainList = document.getElementById('toDoList');
  mainList.innerHTML = '';
  toDoArr.forEach((Task, index) => {
    const id = `${index}`;
    toDoArrId.push(id);
    const listElement = `<li>
    <input id = "C${id}" class="strikethrough" type = "checkbox"> <label for="C${id}" class="checkboxText"> ${Task} </label>
    <button id="D${id}">Delete</button> 
    </li> 
    `;
    mainList.innerHTML += listElement;
  });
  addDeleteListener();
};

const submitToDo = function () {
  const taskInput = document.getElementById('Task');
  const taskInputVal = taskInput.value.trim();
  console.log(taskInputVal);
  if (taskInputVal !== '') {
    toDoArr.push(taskInputVal);
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
updateToDo();
console.log(toDoArrId);
console.log(...toDoArr);
