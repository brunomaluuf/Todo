document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskObs = document.getElementById('task-obs');
    const taskList = document.getElementById('task-list');

    const baseUrl = 'http://localhost:8080/tasks';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchTasks = () => {
        fetch(baseUrl)
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.sort((a, b) => new Date(a.data) - new Date(b.data));
                tasks.forEach(task => {
                    addTaskToDOM(task.id, task.titulo, task.data, task.descricao, task.concluida);
                });
            })
            .catch(error => console.error('Erro ao buscar tarefas:', error));
    };

    const addTaskToDOM = (taskId, taskTitle, taskDate, taskObs, completed = false) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.dataset.id = taskId;
        const textSpan = document.createElement('span');
        textSpan.textContent = taskTitle;
        li.appendChild(textSpan);

        if (completed) {
            li.classList.add('completed');
        }

        if (taskDate) {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = ` (Data: ${formatDate(taskDate)})`;
            dateSpan.classList.add('task-date');
            li.appendChild(dateSpan);
        }

        if (taskObs) {
            const obsSpan = document.createElement('span');
            obsSpan.textContent = taskObs;
            obsSpan.classList.add('task-obs');
            obsSpan.style.display = 'block';
            obsSpan.style.overflow = 'hidden';
            obsSpan.style.height = '50px';
            obsSpan.style.resize = 'none';
            li.appendChild(obsSpan);

            const expandBtn = document.createElement('button');
            expandBtn.textContent = 'Mostrar Mais';
            expandBtn.classList.add('expand-btn');
            expandBtn.onclick = () => {
                if (obsSpan.style.height === '50px') {
                    obsSpan.style.height = 'auto';
                    expandBtn.textContent = 'Mostrar Menos';
                } else {
                    obsSpan.style.height = '50px';
                    expandBtn.textContent = 'Mostrar Mais';
                }
            };
            li.appendChild(expandBtn);
        }

        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = completed ? 'Desmarcar' : 'Concluir';
        completeBtn.classList.add(completed ? 'incomplete-btn' : 'complete-btn');
        completeBtn.onclick = () => {
            toggleTaskCompletion(taskId, !completed, li, completeBtn);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            deleteTask(taskId, li);
        };

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(btnGroup);

        if (completed) {
            taskList.appendChild(li);
        } else {
            taskList.insertBefore(li, taskList.querySelector('li.completed') || null);
        }
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskTitle = taskInput.value.trim();
        const taskDateValue = taskDate.value;
        const taskObsValue = taskObs.value.trim();
        if (taskTitle !== '') {
            const newTask = {
                titulo: taskTitle,
                data: taskDateValue,
                descricao: taskObsValue,
                concluida: false
            };
            addNewTask(newTask);
        }
    });

    const addNewTask = (task) => {
        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(task => {
            addTaskToDOM(task.id, task.titulo, task.data, task.descricao, task.concluida);
            taskForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar tarefa:', error));
    };

    const deleteTask = (taskId, taskElement) => {
        fetch(`${baseUrl}/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            taskList.removeChild(taskElement);
        })
        .catch(error => console.error('Erro ao excluir tarefa:', error));
    };

    const toggleTaskCompletion = (taskId, completed, taskElement, completeBtn) => {
        fetch(`${baseUrl}/${taskId}/concluir`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ concluida: completed })
        })
        .then(response => response.json())
        .then(task => {
            taskElement.classList.toggle('completed');
            if (completed) {
                taskList.appendChild(taskElement);
                completeBtn.textContent = 'Desmarcar';
                completeBtn.classList.remove('complete-btn');
                completeBtn.classList.add('incomplete-btn');
            } else {
                taskList.insertBefore(taskElement, taskList.querySelector('li.completed') || null);
                completeBtn.textContent = 'Concluir';
                completeBtn.classList.remove('incomplete-btn');
                completeBtn.classList.add('complete-btn');
            }
        })
        .catch(error => console.error('Erro ao concluir tarefa:', error));
    };

    fetchTasks();
});
