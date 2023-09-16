document.addEventListener('alpine:init', () => {
    const db = Gun(['http://raspberrypi.local:8765/gun']).get('wedo'); // 'http://raspberrypi.local:8765/gun' 'https://gun-manhattan.herokuapp.com/gun'

    Alpine.store('activeView', 'lists');

    Alpine.data('ListVM', () => ({
        newList: '',
        lists: [],

        init() {
            db.get('lists').map().on((list, id) => {
                if (list) {
                    if (!this.lists.some(el => el.id === id)) {
                        this.lists.push({
                            id: id,
                            date: list.date,
                            name: list.name
                        })
                    }
                }
                else {
                    this.lists = this.lists.filter(item => item.id !== id)
                }

            });
        },
        addList() {
            let list = this.newList.trim()
            if (list !== '') {
                db.get('lists').set({
                    date: Date.now(),
                    name: list
                })
                this.newList = ''
            }
        },
        removeList(id) {
            db.get('lists').get(id).put(null)
        },
        selectList(id) {
            if (Alpine.store('currentList') === id) {
                Alpine.store('currentList', '')
            }
            else {
                Alpine.store('currentList', id)
            }
        },
    }));

    Alpine.data('TaskVM', (listId) => ({
        newTask: '',
        tasks: [],

        init() {
            // console.log(listId)
            db.get('lists').get(listId).get('tasks').map().on((task, id) => {
                // console.log(task)
                if (task) {
                    if (!this.tasks.some(el => el.id === id)) {
                        this.tasks.push({
                            id: id,
                            date: task.date,
                            name: task.name,
                            done: task.done
                        })
                    }
                }
                else {
                    this.tasks = this.tasks.filter(item => item.id !== id)
                }

            });
        },
        addTask() {
            let task = this.newTask.trim()
            if (task !== '') {
                db.get('lists').get(Alpine.store('currentList')).get('tasks').set({
                    date: Date.now(),
                    name: this.newTask,
                    done: false
                })
                this.newTask = ''
            }
        },
        removeTask(id) {
            // this.tasks = this.tasks.filter(item => item.id !== id)
            db.get('lists').get(Alpine.store('currentList')).get('tasks').get(id).put(null)
            // db.get(id).put(null)
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
    }));

})