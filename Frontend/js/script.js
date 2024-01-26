// Import 'axios' using its CDN
import axios from 'https://cdn.skypack.dev/axios';
const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

let taskId = 0;
let editId;
let editData;

const loadTasks = async () => {
    let response = await axios.get('http://localhost:8080/getTasks');
    console.log("fetch data", response);

}

const upsertTask = () => {
    let taskDescription = inputBox.value;
    console.log(inputBox.innerHTML)
    if (!taskDescription) {
        alert("Please enter your works to be done");
    }
    else if (taskDescription.length > 30) {
        alert("Please enter your works to be done in 30 characters");
        inputBox.value = '';
    }
    else {
        if (document.getElementById('upsert').innerHTML == 'Add') {
            taskId++;
            let listElement = document.createElement('li');
            let taskDetails = document.createElement('h5')
            listElement.setAttribute('id', `task-${taskId}`);
            taskDetails.innerHTML = taskDescription;
            listContainer.appendChild(listElement);
            inputBox.value = '';
            let span = document.createElement('span');
            span.setAttribute('class', 'modify-icons');
            let editIcon = document.createElement('img');
            let removeIcon = document.createElement('img');
            editIcon.setAttribute('src', './images/edit.svg');
            editIcon.setAttribute('alt', 'edit');
            editIcon.setAttribute('class', 'icon-resize');
            editIcon.setAttribute('id', `edit-icon-${taskId}`);
            editIcon.setAttribute('name', 'edit-icon');
            removeIcon.setAttribute('src', './images/remove.svg');
            removeIcon.setAttribute('alt', 'remove');
            removeIcon.setAttribute('class', 'icon-resize');
            removeIcon.setAttribute('id', `remove-icon-${taskId}`);
            removeIcon.setAttribute('name', `remove-icon`);
            span.appendChild(editIcon);
            span.appendChild(removeIcon);
            listElement.appendChild(taskDetails);
            listElement.appendChild(span);
        }
        else {
            console.log(document.getElementById(`task-${editId}`).childNodes[0].innerHTML)
            document.getElementById(`task-${editId}`).childNodes[0].innerHTML = taskDescription;
            inputBox.value = '';
            document.getElementById('upsert').innerHTML = 'Add';

        }
    }
}

listContainer.addEventListener('click', (e) => {
    console.log(e.target.name, e.target.id)
    if (e.target.name == 'edit-icon') {
        editTask(e);
    }
    else if (e.target.name == 'remove-icon') {
        removeTask(e);
    }
    else {
        taskStatus(e);
    }
})

const editTask = (e) => {
    editData = e;
    editId = e.target.id.split('-')[2];
    console.log(editId)
    console.log(document.getElementById(`task-${editId}`).textContent)
    inputBox.value = document.getElementById(`task-${editId}`).textContent;
    console.log(" document.getElementById('add')", document.getElementById('upsert'))
    document.getElementById('upsert').innerHTML = 'Update';
}

const removeTask = (e) => {
    let id = e.target.id.split('-')[2]
    console.log(id)
    console.log(document.getElementById(`task-${id}`))
    document.getElementById(`task-${id}`).remove()
}

const taskStatus = (e) => {
    e.target.classList.toggle('checked');
}

window.onload = loadTasks;

