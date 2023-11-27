"use strict";

const toDoArr = ["Wake up", "Make Coffee", "Brush Teeth"];

for (const ele of toDoArr) {
	document.getElementById("toDoList").innerHTML += `<li>${ele}</li>`;
}

console.log(...toDoArr);
