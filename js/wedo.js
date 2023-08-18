const db = Gun()

function ListVM() {
    return {
        newList: '',
        listItem: {},
        lists: [],
        dbLists: null,

        init() {
            this.dbLists = db.get('lists')
            this.dbLists.map().on((list, id) => {
                this.lists.push({
                    id: id,
                    name: list
                })
            });
        },

        addList() {
            let name = this.newList.trim()
            if (name !== '') {
                // this.lists.push({
                //     id: Date.now(),
                //     name: name
                // });
                this.dbLists.set(name)
                this.newList = ''
            }
        },
        removeList(id) {
            // this.lists = this.lists.filter(list => list.id !== id)
            this.dbLists.get(id).put(null)
            console.log(id)
        },
        selectList(id) {
            Alpine.store('currentList', id)
            Alpine.store('activeView', 'tasks')
        }
    }
}

function TaskVM() {
    return {
        newTask: '',
        taskItem: {},
        tasks: [],

        addTask() {
            let item = this.newTask.trim()
            if (item !== '') {
                this.tasks.push({
                    id: Date.now(),
                    listId: Alpine.store('currentList'),
                    name: item,
                    done: false
                });
                this.newTask = ''
            }
        },
        removeTask(id) {
            this.tasks = this.tasks.filter(item => item.id !== id)
        },
        removeTasksByListId(listId) {
            this.tasks = this.tasks.filter(item => item.listId !== listId)
        },
        toggleTask(index) {
            let task = this.tasks[index]
            task.done != task.done
        },
        get currentTasks() {
            return this.tasks.filter(task => task.listId === Alpine.store('currentList'))
        }
    }
}

document.addEventListener('alpine:init', () => {
    Alpine.store('activeView', 'lists')
})