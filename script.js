"use strict";

let toDoArr = ["Wake up", "Make Coffee", "Brush Teeth"];

for (const ele of toDoArr) {
	document.getElementById("toDoList").innerHTML += `<li>${ele}</li>`;
}

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

const updateToDo = function () {
	const mainList = document.getElementById("toDoList");
	mainList.innerHTML = "";
	toDoArr.forEach((Task) => {
		const listElement = `<li>${Task}</li>`;
		mainList.innerHTML += listElement;
	});
};

console.log(...toDoArr);
