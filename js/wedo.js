document.addEventListener('alpine:init', () => {
    const db = Gun(['http://raspberrypi.local:8765/gun']); // 'https://gun-manhattan.herokuapp.com/gun'

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
                            name: list //list.name
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
                db.get('lists').set(name)
                // db.get('lists').set({
                //     name: name
                // })
                this.newList = ''
            }
        },
        removeList(id) {
            console.log('remove:', id)
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
        addTask(listId, task){
            db.get(listId+'/tasks/').set({
                name: task,
                done: false
            })
        },
        getTasks(listId){
            return ['task 1', 'task 2', 'task 3']
        }
    }));

    Alpine.data('TaskVM', () => ({
        newTask: '',
        taskItem: {},
        tasks: [],

        addTaskOld() {
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