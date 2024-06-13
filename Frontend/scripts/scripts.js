document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskObs = document.getElementById('task-obs');
    const taskList = document.getElementById('task-list');

    // Função para formatar data para DD/MM/YYYY
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Carregar tarefas do localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.date, task.obs, task.completed);
        });
    };

    // Adicionar tarefa ao DOM
    const addTaskToDOM = (taskText, taskDate, taskObs, completed = false) => {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;
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
            obsSpan.style.display = 'block'; // Garantir que a observação seja exibida em uma nova linha
            obsSpan.style.overflow = 'hidden';
            obsSpan.style.height = '50px'; // Altura inicial
            obsSpan.style.resize = 'none'; // Desativar redimensionamento manual
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
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                taskList.appendChild(li);
                completeBtn.textContent = 'Desmarcar';
                completeBtn.classList.remove('complete-btn');
                completeBtn.classList.add('incomplete-btn');
            } else {
                taskList.insertBefore(li, taskList.querySelector('li.completed') || null);
                completeBtn.textContent = 'Concluir';
                completeBtn.classList.remove('incomplete-btn');
                completeBtn.classList.add('complete-btn');
            }
            saveTasks();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            taskList.removeChild(li);
            saveTasks();
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

    // Salvar tarefas no localStorage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskText = li.firstChild.textContent;
            const taskDate = li.querySelector('.task-date') ? li.querySelector('.task-date').textContent.replace(' (Data: ', '').replace(')', '') : '';
            const taskObs = li.querySelector('.task-obs') ? li.querySelector('.task-obs').textContent : '';
            const completed = li.classList.contains('completed');
            const formattedDate = taskDate.split('/').reverse().join('-'); // Convertendo para o formato YYYY-MM-DD
            tasks.push({ text: taskText, date: formattedDate, obs: taskObs, completed });
        });
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Renderizar tarefas no DOM
    const renderTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.date, task.obs, task.completed);
        });
    };

    // Manipulador de evento para adicionar nova tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDateValue = taskDate.value;
        const taskObsValue = taskObs.value.trim();
        if (taskText !== '') {
            addTaskToDOM(taskText, taskDateValue, taskObsValue);
            saveTasks();
            taskInput.value = '';
            taskDate.value = '';
            taskObs.value = '';
            taskInput.focus();
        }
    });

    // Carregar tarefas ao iniciar a aplicação
    loadTasks();
});
