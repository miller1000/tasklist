
const taskIndexes = [];

document.addEventListener('DOMContentLoaded', () => {
    if (Boolean(localStorage.getItem('taskIndexes') && localStorage.getItem('taskIndexes').length > 0)) {
        (JSON.parse(localStorage.getItem('taskIndexes'))).forEach(item => {
            addTask(localStorage.getItem(item), item);
        });
    }

    // By default, submit button is disabled
    document.querySelector('#submit').disabled = true;

    // Only activate the submit button if input field is not empty
    document.querySelector('#task').onkeyup = () => {
        if (document.querySelector('#task').value.length > 0) {
            document.querySelector('#submit').disabled = false;
        } else {
            document.querySelector('#submit').disabled = true;
        }
    }

    //Add new task
    document.querySelector('form').onsubmit = () => {
        taskTimestamp = Date.now();
        const taskContent = document.querySelector('#task').value;
        localStorage.setItem(taskTimestamp, taskContent);

        addTask(taskContent, taskTimestamp);
        
        document.querySelector('#task').value = '';
        document.querySelector('#submit').disabled = true;

        // Stop form from submitting
        return false;
    }

    document.addEventListener("click", (event) => {
        if (event.target.className === "remove-button") {
            const buttonToRemove = event.target.id;
            removeTask(Number(buttonToRemove.slice(buttonToRemove.indexOf('-') + 1)));
        };

        if (event.target.classList.contains("edit-button")) {
            const buttonToEdit = event.target.id;
            editTask(Number(buttonToEdit.slice(buttonToEdit.indexOf('-') + 1)))
        }
    })

    document.addEventListener("click", (event) => {

    })

})

function addTask(taskValue, taskID) {
    const div = document.createElement('div');
    div.id = `Item-${taskID}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.id = `Remove-${taskID}`;
    removeBtn.classList.add('remove-button');

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.id = `Edit-${taskID}`;
    editBtn.classList.add('edit-button');

    const li = document.createElement('li');
    li.textContent = taskValue;
    li.id = `Task-${taskID}`;
    li.classList.add('task-text');
    li.contentEditable = false;

    div.append(li);
    div.append(editBtn);
    div.append(removeBtn);
    document.querySelector('#tasks').append(div);
    taskIndexes.push(taskID);
    localStorage.setItem('taskIndexes', JSON.stringify(taskIndexes));
}

function removeTask(taskID) {
    document.getElementById(`Item-${taskID}`).remove();
    localStorage.removeItem(taskID);
    taskIndexes.splice(taskIndexes.indexOf(taskID), 1);
    localStorage.setItem('taskIndexes', JSON.stringify(taskIndexes));
}

function editTask(taskID) {
    document.getElementById(`Task-${taskID}`).contentEditable = 
        !parseBool(document.getElementById(`Task-${taskID}`).contentEditable);
    
    document.getElementById(`Edit-${taskID}`).classList.toggle("activeEl");
    document.getElementById(`Task-${taskID}`).classList.toggle("activeEl");
    
    if (!parseBool(document.getElementById(`Task-${taskID}`).contentEditable)) {
        document.getElementById(`Edit-${taskID}`).textContent = "Edit"
        localStorage.setItem(taskID, document.getElementById(`Task-${taskID}`).textContent);

        document.querySelectorAll("button, input").forEach((element) => {
            element.disabled = false;
        })

        if (document.querySelector('#task').value.length === 0) {
            document.querySelector('#submit').disabled = true;
        }

    } else {
        document.getElementById(`Edit-${taskID}`).textContent = "Done";

        document.querySelectorAll("button, input").forEach((element) => {
            if (!element.classList.contains("activeEl")) {
                element.disabled = true;
            }
        })
    }
    
    

}

function parseBool(stringBool) {
    return stringBool === "true" ? true : false;
}