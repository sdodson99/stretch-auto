function RoutineCreateView(){
    this.listButton = document.querySelector('#routine-view-list')
    this.addStretchButton = document.querySelector('#routine-stretch-add')
    this.createButton = document.querySelector('#routine-create-submit')
    this.stretchList = document.querySelector('#routine-stretch-items')
    this.routineNameInput = document.querySelector('#routine-name-input')

    this.getRoutineName = function(){
        return this.routineNameInput.value
    }

    this.getRoutineStretches = function(){
        let routineStretches = []

        this.stretchList.querySelectorAll("li").forEach(item => {
            let stretchComboBox = item.querySelector('select')
            let stretchId = stretchComboBox.options[stretchComboBox.selectedIndex].value
            let stretchOrder = item.querySelector('.stretch-order').value

            routineStretches.push({
                order: stretchOrder,
                stretch: stretchId
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
        this.createButton.addEventListener('click', handler)
    }

    this.reset = function(){
        this.routineNameInput.value = ""
        this.stretchList.innerHTML = ""
    }

    this.addStretch = function(stretches){
        let newListItem = document.createElement("li")
        newListItem.innerHTML = `
            <div class="stretch-option">
                <p>Order</p>
                <input class="stretch-order" type="text" value=${this.getNextOrderValue()}>
            </div>
            <div class="stretch-option">
                <p>Stretch</p>
                <select>
                    <option disabled selected value> -- Select a stretch -- </option>
                    ${this.createStretchOptions(stretches)}
                </select>
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