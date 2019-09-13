class ToDoApp {
    execute() {
        const render = new Render();
        const store = new StorageEvent()
        const taskManager = new TaskManager()
        const todo = new TODO(taskManager, render)
        const titleInput = document.getElementById('title')
        const createTask = document.getElementById('create-tsk')
        const deleteTask = document.getElementById('delete-tsk')
        createTaskBtnRef.addEventListener('click', ()=> {
            
        })
    }

}


class TODO {
    constructor(taskManager, render) {
        this._taskManager = taskManager
        this._render = render;
    }

    addTask(title) {

    }
}


class TaskManager {

createTask(title){

}

removeTask(id){

}

updateTask(){

}

}

class Store {

    getTask(){

    }
 
    removeTask(){

    }

    getTask(id) {

    }

    updateTask (task) {

    }


}


class Task {

    get id() {


    }


    get title() {


    }


    isDone() {


    }

    toggle()  {



    }

}