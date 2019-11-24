function RoutineCreateView(){

    this.getRoutineName = function(){
        return this.routineNameInput.value
    }

    this.getRoutineStretches = function(){
        let routineStretches = []

        this.stretchList.querySelectorAll("li").forEach(item => {
            let stretchComboBox = item.querySelector('select')
            let stretchId = stretchComboBox.options[stretchComboBox.selectedIndex].value
            let stretchOrder = item.querySelector('.stretch-order').value || this.getNextOrderValue()
            let sets = item.querySelector('.stretch-sets').value || 1
            let duration = item.querySelector('.stretch-duration').value || 10

            routineStretches.push({
                order: stretchOrder,
                stretch: stretchId,
                sets: sets,
                duration: duration
            })  
        })

        return routineStretches
    }

    this.addListButtonHandler = function(handler){
        this.listButton.addEventListener('click', handler)
    }

    this.addStretchAddButtonHandler = function(handler){
        this.addStretchButton.addEventListener('click', handler)
    }

    this.addCreateButtonHandler = function(handler){
        this.createButton.addEventListener('click', () => {
            if(this.createForm.checkValidity()){
                handler()
            }
        })
    }

    this.reset = function(){
        this.routineNameInput.value = ""
        this.stretchList.innerHTML = ""
    }

    this.draw = function(root){
        root.innerHTML = this.getMarkup()

        this.listButton = document.querySelector('#routine-view-list')
        this.addStretchButton = document.querySelector('#routine-stretch-add')
        this.createButton = document.querySelector('#routine-create-submit')
        this.stretchList = document.querySelector('#routine-stretch-items')
        this.routineNameInput = document.querySelector('#routine-name-input')    
        this.createForm = document.querySelector('form')   
        
        this.createButton.addEventListener('click', () => this.createForm.reportValidity())
    }

    this.getMarkup = function(){
        return `
        <section id="routine-create" class="routine-content center-content container">
            <button id="routine-view-list" class="routine-header-button" type="button">&lt; View Routines</button>
            <div class="routine-section-header">New Routine</div>
            <div class="routine-create-content">
                <div class="routine-create-fieldset">
                    <p class="prompt">Name</p>
                    <input class="routine-field" id="routine-name-input" type="text" required/>
                </div>
                <div class="routine-create-stretches">
                    <div id="routine-stretch-header">
                        Stretches
                        <button id="routine-stretch-add" type="button">+</button>
                    </div>
                    <ul id="routine-stretch-items">
                    </ul>
                </div>
                <button id="routine-create-submit" type="button">Create</button>
            </div>
        </section>`
    }

    this.addStretch = function(stretches){
        let newListItem = document.createElement("li")
        newListItem.classList.add('routine-stretch-list-item')
        newListItem.innerHTML = `
            <div class="stretch-option">
                <p>Order</p>
                <input class="stretch-order" type="text" pattern="^[0-9]*$" value=${this.getNextOrderValue()}>
            </div>
            <div class="stretch-option">
                <p>Stretch</p>
                <select required>
                    <option disabled selected value> -- Select a stretch -- </option>
                    ${this.createStretchOptions(stretches)}
                </select>
            </div>
            <div class="stretch-option">
                <p>Sets</p>
                <input class="stretch-sets" type="text" required pattern="^[0-9]*$">
            </div>
            <div class="stretch-option">
                <p>Duration</p>
                <input class="stretch-duration" type="text" required pattern="^[0-9]*$"}>
            </div>
            <div class="stretch-remove">
                <button class="routine-stretch-remove delete-button">Remove</button>
            </div>`

        this.stretchList.appendChild(newListItem)

        let removeButton = newListItem.querySelector('.routine-stretch-remove')
        removeButton.addEventListener('click', () => this.removeStretch(removeButton)) 
    }

    this.createStretchOptions = function(stretches){
        let optionsString = ""

        stretches.forEach(stretch => {
            optionsString += `<option value=${stretch._id}>${stretch.name}</option>`
        })

        return optionsString
    }

    this.removeStretch = function(sender){
        sender.closest("li").remove()
    }

    this.getNextOrderValue = function(){
        let orders = [0]

        document.querySelectorAll('.stretch-order').forEach((input) => {
            let num = parseInt(input.value)
            if(num){
                orders.push(num)
            }
        })

        return Math.max(...orders) + 1
    }
}

module.exports = RoutineCreateView