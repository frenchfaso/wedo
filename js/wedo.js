const db = Gun() // need a relay to sync between clients

document.addEventListener('alpine:init', () => {

    Alpine.store('activeView', 'lists');

    Alpine.data('ListVM', () => ({
        newList: '',
        lists: {},

        init() {
            db.get('lists').on((lists, id) => {
                this.lists = lists
                // for (let [key, value] of Object.entries(lists)) {
                //     this.lists.push({
                //         id: key,
                //         name: value
                //     })
                // }
            });
        },

        addList() {
            let name = this.newList.trim()
            if (name !== '') {
                db.get('lists').set(name)
                this.newList = ''
            }
        },
        removeList(id) {
            // this.lists = this.lists.filter(list => list.id !== id)
            console.log('remove:', id)
            // let lists = db.get('lists')
            // let item = lists.get(id)
            // this.lists.unset(item)
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