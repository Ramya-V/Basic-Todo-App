const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

const addTask = () => {
    let taskDescription = inputBox.value;
    if (!taskDescription) {
        alert("Please enter your works to be done");
    }
    else if (taskDescription.length > 30) {
        alert("Please enter your works to be done in 30 characters");
        inputBox.value = '';
    }
    else {
        let listElement = document.createElement('li');
        listElement.innerHTML = taskDescription;
        listContainer.appendChild(listElement);
        inputBox.value = '';
        let span = document.createElement('span');
        span.setAttribute('class', 'modify-icons');
        let editIcon = document.createElement('img');
        let removeIcon = document.createElement('img');
        editIcon.setAttribute('src', './images/edit.svg');
        editIcon.setAttribute('alt', 'edit');
        editIcon.setAttribute('class', 'icon-resize');
        removeIcon.setAttribute('src', './images/remove.svg');
        removeIcon.setAttribute('alt', 'remove');
        removeIcon.setAttribute('class', 'icon-resize');
        span.appendChild(editIcon);
        span.appendChild(removeIcon);
        listElement.appendChild(span);
    }
}