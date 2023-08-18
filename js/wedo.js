const db = Gun() // need a relay to sync between clients

document.addEventListener('alpine:init', () => {

    Alpine.store('activeView', 'lists');

    Alpine.data('ListVM', () => ({
        newList: '',
        listItem: {},
        lists: [],
        // dbLists: null,

        init() {
            db.get('lists').on((lists, id) => {
                for (let [key, value] of Object.entries(lists)) {
                    console.log(key, value);
                }
                // this.lists.push({
                //     id: id,
                //     name: list
                // })
            });
        },

        addList() {
            let name = this.newList.trim()
            if (name !== '') {
                // this.lists.push({
                //     id: Date.now(),
                //     name: name
                // });
                db.get('lists').set(name)
                this.newList = ''
            }
        },
        removeList(id) {
            // this.lists = this.lists.filter(list => list.id !== id)
            console.log(id)
            let lists = db.get('lists')
            let item = lists.get(id)
            this.lists.unset(item)
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