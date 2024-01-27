import axios from 'https://cdn.skypack.dev/axios';

const inputBox = document.getElementById('input-box');
const taskListContainer = document.getElementById('list-container');

/* Loads the task details in the todo*/
const loadTasks = async () => {
    try {
        // Clears the task list
        taskListContainer.innerHTML = '';

        // Gets the task details
        let response = await axios.get('http://localhost:8080/getTasks');
        let data = response.data.data;

        // Binds the task details
        data.forEach((element) => {
            // li tag is created to load the task details
            let taskList = document.createElement('li');
            taskList.setAttribute("id", `task-${element._id}`);

            // check/uncheck Icon is created
            let todoIcon = document.createElement('img');
            setAttributes(todoIcon, {
                src: element.status == "done" ? './images/check.svg' : './images/uncheck.svg',
                alt: 'uncheck',
                class: element.status == "done" ? 'todoIcon checked' : 'todoIcon',
                id: `todo-icon-${element._id}`,
                name: 'todo-icon'
            });

            // Task description 
            let taskDetails = document.createElement('h5');
            taskDetails.innerHTML = element.description;
            element.status == "done" && taskDetails.classList.toggle('task-strike');

            // Action Icons - edit and remove
            let actionIcons = document.createElement('span');
            let editIcon = document.createElement('img');
            setAttributes(editIcon, {
                src: './images/edit.svg',
                alt: 'edit',
                class: element.status == "done" ? 'icon-resize disable' : 'icon-resize',
                id: `edit-icon-${element._id}`,
                name: 'edit-icon'
            })
            let removeIcon = document.createElement('img');
            setAttributes(removeIcon, {
                src: './images/remove.svg',
                alt: 'remove',
                class: 'icon-resize',
                id: `remove-icon-${element._id}`,
                name: 'remove-icon'
            })

            // Created child elements are appended to the parent element
            actionIcons.appendChild(editIcon);
            actionIcons.appendChild(removeIcon);
            taskList.appendChild(todoIcon);
            taskList.appendChild(taskDetails);
            taskList.appendChild(actionIcons);
            taskListContainer.appendChild(taskList);
        })
    }
    catch (e) {
        console.log("Error in loadTasks ", e)
    }
}

/* Creates or updates the task info in the todo*/
const upsertTask = async () => {
    try {
        let taskDescription = inputBox.value;
        // Mandatory validation 
        if (!taskDescription) {
            alert("Please enter your works to be done");
        }
        // validation Only 30<= characters are accepted 
        else if (taskDescription.length > 30) {
            alert("Please enter your works to be done in 30 characters");
        }
        // Creates or updates task info
        else {
            if (document.getElementById('upsert').innerHTML == 'Add') {
                await axios.post('http://localhost:8080/createTask', { description: taskDescription });
            }
            else {
                let id = document.getElementById('upsert').name;

                await axios.put('http://localhost:8080/updateTask/info',
                    {
                        id,
                        description: taskDescription
                    });
                document.getElementById('upsert').innerHTML = 'Add';

            }
            loadTasks()
        }
        inputBox.value = '';
    }
    catch (e) {
        console.log("Error in upsertTask ", e)
    }
}

// Edits the task
const editTask = (e) => {
    try {
        let id = e.target.id.split('-')[2];
        inputBox.value = document.getElementById(`task-${id}`).childNodes[1].textContent;
        document.getElementById('upsert').innerHTML = 'Update';
        document.getElementById('upsert').name = id;
    }
    catch (e) {
        console.log("Error in editTask ", e)
    }
}

// removes the task
const removeTask = async (e) => {
    try {
        let id = e.target.id.split('-')[2];
        await axios.put('http://localhost:8080/updateTask/remove',
            {
                id,
                isActive: false
            });
        loadTasks();
    }
    catch (e) {
        console.log("Error in removeTask ", e)
    }
}

// Updates the task status - done or undone
const taskStatus = async (e) => {
    try {
        let id = e.target.id.split('-')[2],
            status = Object.values(e.target.classList).includes('checked') ? "undone" : "done";
        document.getElementById('upsert').innerHTML = 'Add';
        inputBox.value = '';
        await axios.put('http://localhost:8080/updateTask/status',
            {
                id,
                status
            })
        loadTasks();
    }
    catch (e) {
        console.log("Error in taskStatus ", e)
    }
}

/* Added event listener to the edit, remove and todo icon 
to perform the respective events */
taskListContainer.addEventListener('click', (e) => {
    if (e.target.name == 'edit-icon') {
        editTask(e);
    }
    if (e.target.name == 'remove-icon') {
        removeTask(e);
    }
    if (e.target.name == "todo-icon") {
        taskStatus(e);
    }

})

// Multiple attributes are set for an element
const setAttributes = (element, attributes) => {
    try {
        Object.keys(attributes).forEach((attr) => {
            element.setAttribute(attr, attributes[attr])
        })
    }
    catch (e) {
        console.log("Error in setAttributes ", e)
    }
}

// Global contexts
window.onload = loadTasks;
window.upsertTask = upsertTask;

