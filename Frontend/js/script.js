const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

const addTask = () => {
    let taskDescription = inputBox.value;
    if (!taskDescription) {
        alert("Please enter your works to be done");
    }
    else {
        let listElement = document.createElement('li');
        listElement.innerHTML = taskDescription;
        listContainer.appendChild(listElement);
        inputBox.value = '';
    }
}