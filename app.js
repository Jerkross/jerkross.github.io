document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');
    const searchInput = document.getElementById('search-input');
    loadTasksFromLocalStorage();
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            removeTask(e.target.parentElement.parentElement);
        } else if (e.target.classList.contains('edit-button')) {
            editTask(e.target.parentElement.parentElement);
        } else if (e.target.classList.contains('task-checkbox')) {
            toggleTask(e.target.closest('li'));
        }
    });
    filterAll.addEventListener('click', () => filterTasks('all'));
    filterActive.addEventListener('click', () => filterTasks('active'));
    filterCompleted.addEventListener('click', () => filterTasks('completed'));
    searchInput.addEventListener('input', searchTasks);
    function addTask(task) {
        if (task.trim() === '') return;
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        const taskText = document.createElement('span');
        taskText.textContent = task;
        taskText.classList.add('task-text');
        const taskDate = document.createElement('span');
        taskDate.textContent = new Date().toLocaleString();
        taskDate.classList.add('task-date');
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-buttons');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-button');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(taskDate);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
        saveTasksToLocalStorage();
    }
    function removeTask(taskElement) {
        taskList.removeChild(taskElement);
        saveTasksToLocalStorage();
    }
    function toggleTask(taskElement) {
        taskElement.classList.toggle('completed');
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.checked = taskElement.classList.contains('completed');
        saveTasksToLocalStorage();
    }
    function editTask(taskElement) {
        const currentTask = taskElement.querySelector('.task-text').textContent;
        const newTask = prompt('Edita la tarea:', currentTask);
        if (newTask !== null && newTask.trim() !== '') {
            taskElement.querySelector('.task-text').textContent = newTask;
            saveTasksToLocalStorage();
        }
    }
    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskElement => {
            tasks.push({
                text: taskElement.querySelector('.task-text').textContent,
                completed: taskElement.classList.contains('completed'),
                createdAt: taskElement.querySelector('.task-date').textContent
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.classList.add('task-text');
            const taskDate = document.createElement('span');
            taskDate.textContent = task.createdAt;
            taskDate.classList.add('task-date');
            if (task.completed) {
                li.classList.add('completed');
                checkbox.checked = true;
            }
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('task-buttons');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-button');
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit-button');
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(taskDate);
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    }
    function filterTasks(filter) {
        const allTasks = taskList.querySelectorAll('li');
        allTasks.forEach(taskElement => {
            switch (filter) {
                case 'all':
                    taskElement.style.display = '';
                    break;
                case 'active':
                    if (taskElement.classList.contains('completed')) {
                        taskElement.style.display = 'none';
                    } else {
                        taskElement.style.display = '';
                    }
                    break;
                case 'completed':
                    if (taskElement.classList.contains('completed')) {
                        taskElement.style.display = '';
                    } else {
                        taskElement.style.display = 'none';
                    }
                    break;
            }
        });
        filterAll.classList.toggle('active', filter === 'all');
        filterActive.classList.toggle('active', filter === 'active');
        filterCompleted.classList.toggle('active', filter === 'completed');
    }
    function searchTasks() {
        const searchText = searchInput.value.toLowerCase();
        const allTasks = taskList.querySelectorAll('li');
        allTasks.forEach(taskElement => {
            const taskText = taskElement.querySelector('.task-text').textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                taskElement.style.display = '';
            } else {
                taskElement.style.display = 'none';
            }
        });
    }
});
