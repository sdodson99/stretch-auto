function RoutineListView(){

    this.addCreateButtonHandler = function(handler){
        this.createButton.addEventListener('click', handler)
    }

    this.addRoutine = function(routineId, routineName, playHandler, deleteHandler){
        let newRoutineItem = document.createElement('li')
        newRoutineItem.classList.add('routine-list-item')
        newRoutineItem.innerHTML = `
            <div class="routine-name">${routineName}</div>
            <div class="routine-operations">
                <button class="routine-play">Play</button>
                <button class="routine-delete delete-button">Delete</button>
            </div>`

        this.list.appendChild(newRoutineItem)

        newRoutineItem.querySelector('.routine-delete').addEventListener('click', () => {
            this.removeRoutine(newRoutineItem)
            deleteHandler(routineId)
        })

        newRoutineItem.querySelector('.routine-play').addEventListener('click', () => {
            playHandler(routineId)
        })
    }

    this.setListCaption = function(text){
        this.listCaption.innerText = text
        this.listCaption.style.display = text == "" ? "none" : "block"
    }

    this.removeRoutine = function(sender){
        sender.closest("li").remove()
    }

    this.reset = function(){
        this.listCaption.innerText = ""
        this.list.innerHTML = ""
    }

    this.draw = function(root){
        root.innerHTML = this.getMarkup()

        this.createButton = document.querySelector('#routine-view-create')
        this.list = document.querySelector('#routine-list-items')
        this.listCaption = document.querySelector('#routine-list-caption')
    }

    this.getMarkup = function(){
        return `
        <section id="routine-list" class="routine-content center-content container">
            <button id="routine-view-create" class="routine-header-button">Create Routine</button>
            <div class="routine-section-header">Saved Routines</div>
            <p id="routine-list-caption"></p>
            <ul id="routine-list-items">
            </ul>
        </section>`
    }
}

module.exports = RoutineListView