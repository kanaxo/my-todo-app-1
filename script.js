"use strict";

let toDoArr = ["Wake up", "Make Coffee", "Brush Teeth"];
let toDoArrId = [];

const removeElement = function (e) {
	// remove element from toDoArr
	// obtain index
	const selectedElem = e.target.id; // A1
	const selectedIndex = selectedElem.slice(1); // 1
	toDoArr.splice(selectedIndex, 1);
	toDoArrId.splice(selectedIndex, 1);
	// update list
	updateToDo();
};
// add event listener for button
const addDeleteListener = function () {
	const deleteElems = document.querySelectorAll(
		toDoArrId.map((id) => `#${id}`).join(",")
	);
	console.log(deleteElems);
	deleteElems.forEach((deleteElem) => {
		deleteElem.addEventListener("click", removeElement);
	});
};

const updateToDo = function () {
	const mainList = document.getElementById("toDoList");
	mainList.innerHTML = "";
	toDoArr.forEach((Task, index) => {
		const id = `A${index}`;
		toDoArrId.push(id);
		const listElement = `<li>${Task}<button id="${id}">Delete</button> </li> `;
		mainList.innerHTML += listElement;
	});
	addDeleteListener();
};

const submitToDo = function () {
	const taskInput = document.getElementById("Task");
	const taskInputVal = taskInput.value.trim();
	console.log(taskInputVal);
	if (taskInputVal !== "") {
		toDoArr.push(taskInputVal);
	}
	updateToDo();
	taskInput.value = "";
};

// driver code
updateToDo();
console.log(toDoArrId);
console.log(...toDoArr);
