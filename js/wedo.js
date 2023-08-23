const db = Gun(['https://raspberrypi.local:8765/gun/']); // 'https://gun-manhattan.herokuapp.com/gun'

document.addEventListener('alpine:init', () => {

    Alpine.store('activeView', 'lists');

    Alpine.data('ListVM', () => ({
        newList: '',
        lists: [],

        init() {
            db.get('lists').map().on((list, id) => {
                // if (this.lists.find(elem => elem.id === id) === undefined) {
                if (list) {
                    if (!this.lists.some(el => el.id === id)) {
                        this.lists.push({
                            id: id,
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
            let name = this.newList.trim()
            if (name !== '') {
                db.get('lists').set({
                    name: name
                })
                this.newList = ''
            }
        },
        removeList(id) {
            console.log('remove:', id)
            db.get('lists').get(id).put(null)
        },
        selectList(id) {
            Alpine.store('currentList', id)
            Alpine.store('activeView', 'tasks')
        }
    }));

    Alpine.data('TaskVM', () => ({
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
    }));

})