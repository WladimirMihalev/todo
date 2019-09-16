class ToDoApp {
    execute() {
        const render = new Render();
        const store = new StorageEvent()
        const taskManager = new TaskManager()
        const todo = new TODO(taskManager, render)
        const titleInput = document.getElementById('title')
        const createTask = document.getElementById('create-tsk')
        const deleteTask = document.getElementById('delete-tsk')
        createTaskBtnRef.addEventListener('click', () => {

        })
    }
    toDo.init();
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
    constructor(store) {
      if (!(store instanceof AbstractStore)) {
        throw new Error("Store should be implements AbstractStore interface");
      }
      this._store = store;
    }
  
    createTask(title) {
      let id = Math.random()
        .toString(36)
        .substring(2, 16);
      let task = new Task(id, title);
      return this._store.saveTask(task);
    }
  
    getTasks() {
      return this._store.getTasks();
    }
  
    deleteTask(id) {
      return this._store.deleteTask(id);
    }
  
    toggleTask(id) {
      return this._store.toggleTask(id);
    }
  }

class Render {
    renderTask(task) {
        console.log(task);
    }
}

class Store extends AbstractStore {
    constructor() {
        super();
        this._storage = [];
    }

    saveTask(task) {
        let copyTask = task.copy();
        this._storage.push(task);
        return Promise.resolve(copyTask);
    }

    getTasks() {
        return Promise.resolve(
            this._storage.map(task => {
                let taskCopy = null;
                try {
                    taskCopy = task.copy();
                } catch (error) {
                    throw new Error("impossible get task with id = ${id}", error.message);
                }
                return taskCopy;
            })
        );
    }

    getTask(id) {
        const task = this._storage.find(task => task.id === id);

        if (!task) {
            throw new Error("There is no task with id = ${id}");
        }

        let taskCopy = null;
        try {
            taskCopy = task.copy();
        } catch (error) {
            throw new Error("impossible get task with id = ${id}", error.message);
        }

        return Promise.resolve(taskCopy);
    }

    deleteTask(id) {
        for (let index = 0; index < this._storage.length; index++) {
            if (this._storage[index].id === id) {
                this._storage.splice(index, 1);
            }
        }
        return Promise.resolve({});
    }

    toggleTask(id) {
        for (let index = 0; index < this._storage.length; index++) {
            if (this._storage[index].id === id) {
                this._storage[index].toggle();
                return Promise.resolve(this._storage[index].copy());
            }
        }
    }
}


class StoreLS extends AbstractStore {
    constructor() {
        super();
        this._prefix = "strLS";
    }

    getTask(id) {
        let key = this._prefix + id;
        const taskJson = localStorage.getItem(key);
        if (!taskJson) {
            throw new Error("There is no task with id = ${id}");
        }

        let task = null;
        try {
            task = Task.fromJSON(taskJson);
        } catch (error) {
            throw new Error("impossible get task with id = ${id}", error.message);
        }

        return Promise.resolve(task);
    }

    getTasks() {
        const tasks = [];
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);

            if (key.includes(this._prefix)) {
                let task = null;
                try {
                    task = Task.fromJSON(localStorage.getItem(key));
                } catch (error) {
                    throw new Error("impossible get task with id = ${id}", error.message);
                }
                tasks.push(task);
            }
        }
        return Promise.resolve(tasks);
    }

    saveTask(task) {
        let key = this._prefix + task.id;
        const json = Task.toJSON(task);
        localStorage.setItem(key, json);
        return Promise.resolve(task.copy());
    }

    deleteTask(id) {
        let key = this._prefix + id;
        localStorage.removeItem(key);
        return Promise.resolve({});
    }

    async toggleTask(id) {
        let key = this._prefix + id;
        let taskPromise = this.getTask(id);
        let task = await taskPromise.then();
        localStorage.setItem(key, Task.toJSON(task.toggle()));
        return Promise.resolve(task);
    }
}


class StoreJS extends AbstractStore {
    constructor() {
        super();
        this._headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, PATCH"
        };
    }

    async getTask(id) {
        let response = await fetch(`http://localhost:3000/tasks/${id}`);
        return await response.json();
    }

    async getTasks() {
        let response = await fetch("http://localhost:3000/tasks");
        return await response.json();
    }

    async saveTask(task, headers = this._headers) {
        let response = await fetch("http://localhost:3000/tasks", {
            headers,
            method: "POST",
            body: Task.toJSON(task)
        });
        return await response.json();
    }

    async deleteTask(id, headers = this._headers) {
        let response = await fetch(`http://localhost:3000/tasks/${id}`, {
            headers,
            method: "DELETE"
        });
        return await response.json();
    }

    async toggleTask(id, headers = this._headers) {
        let task = await this.getTask(id);
        let updateTask = new Task(
            task.id,
            task.title,
            !task.completed,
            task.creationMoment
        );
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            headers,
            method: "PUT",
            body: Task.toJSON(updateTask)
        });
        return await response.json();
    }
}