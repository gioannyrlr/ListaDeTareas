
// Obtiene la referencia al formulario, a los elementos que se obtienen del input y a la lista de tarea.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const taskList = document.getElementById('task-list');

// Inicializa la matriz de tareas con los valores almacenados en el almacenamiento local o una matriz vacía si no hay tareas almacenadas.
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Muestra las tareas en la lista de tareas.
function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        <div class="d-flex flex-row justify-content-between align-items-center">
                <button class="btn-done btn-sm btn-link ${task.isDone ? 'btnIsDone' : ''}" data-index="${index}">
                    <i class="fas fa-check" style="pointer-events: none;"></i>
                </button>
            <div class="task-text mr-auto ${task.isDone ? 'taskDone' : ''}">${task.text}&nbsp;</div>
            <div>
                <button class="btn-edit btn-sm btn-link" data-index="${index}">
                        <i class="far fa-edit" style="pointer-events: none;"></i>
                </button>
                <button class="btn-delete btn-sm btn-link" data-index="${index}">
                        <i class="far fa-trash-alt" style="pointer-events: none;"></i>
                </button>
            </div>
        </div>  
    `;
    taskList.appendChild(li);
  });
}

// Agrega una nueva tarea a la lista de tareas.
function addTask(e) { // El evento de envío del formulario.
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText) {
    if (tasks.find(task => task.text === taskText)) {
      Swal.fire({
        title: 'Oops...',
        text: 'Esta tarea ya existe.',
      });
      return;
    }
    const newTask = { text: taskText, isDone: false };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    displayTasks();
  }
}

// Elimina una tarea de la lista de tareas.
function deleteTask(index) { // El índice de la tarea a eliminar.
  Swal.fire({
    title: '¿Eliminar esta tarea?',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    }
  })
}

// Edita una tarea de la lista de tareas.
function editTask(index, newText) { // El índice de la tarea a editar y el nuevo texto de la tarea.
  tasks[index].text = newText;
  saveTasks();
  displayTasks();
}

// Muestra un cuadro de diálogo para editar una tarea.
function showEditPopup(index) { // El índice de la tarea a editar.
  Swal.fire({
    title: 'Editar',
    input: 'text',
    inputValue: tasks[index].text,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar'
  }).then((result) => {
    if (result.isConfirmed) {
      const newText = result.value.trim();
      if (newText) {
        editTask(index, newText);
      }
    }
  })
}

// Guarda las tareas en el almacenamiento local.
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Carga las tareas almacenadas del almacenamiento local.
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
}

// Maneja los clics en la lista de tareas.
taskList.addEventListener('click', (e) => { // El evento de clic.
  if (e.target.classList.contains('btn-edit')) {
    const index = e.target.dataset.index;
    showEditPopup(index);
  } else if (e.target.classList.contains('btn-delete')) {
    const index = e.target.dataset.index;
    deleteTask(index);
  } else if (e.target.classList.contains('btn-done')) {
    const index = e.target.dataset.index;
    taskIsDone(index);
    e.target.classList.toggle('btnIsDone');
    tasks[index].isDone = !tasks[index].isDone;
    saveTasks();
  }
});

// Maneja el envío del formulario de tareas.
taskForm.addEventListener('submit', (e) => { // El evento de envío del formulario.
  e.preventDefault();
  const input = e.target.elements.taskInput;
  const taskText = input.value.trim();
  if (taskText) {
    addTask(taskText);
    input.value = '';
  }
});

taskForm.addEventListener('submit', addTask);

displayTasks();

// Muestra las tareas completadas o no completadas.
function taskIsDone(index) { // El índice de la tarea.
  const taskItem = document.querySelectorAll('.list-group-item')[index];
  taskItem.querySelector('.task-text').classList.toggle('taskDone');
  saveTasks();
}

// Elimina todas las tareas completadas de la lista.
function deleteTasksDone() {
  const uncompletedTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].isDone) {
      uncompletedTasks.push(tasks[i]);
    }
  }

  Swal.fire({
    title: '¿Eliminar todas las tareas completadas?',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = uncompletedTasks;
      saveTasks();
      displayTasks();
    }
  });
};

// Carga las tareas almacenadas cuando se carga la ventana.
window.addEventListener('load', loadTasks);