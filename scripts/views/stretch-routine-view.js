function StretchRoutineView(){
    this.nameLabel = document.querySelector("#stretch-name")
    this.timeLabel = document.querySelector("#stretch-timer-value span")
    this.currentSetLabel = document.querySelector("#stretch-set-current")
    this.maxSetLabel = document.querySelector("#stretch-set-max")
    this.instructionsList = document.querySelector("#stretch-instructions")

    this.setName = function(name){
        this.nameLabel.textContent = name
    }

    this.setTime = function(time){
        this.timeLabel.textContent = time
    }

    this.setCurrentSet = function(set){
        this.currentSetLabel.textContent = set
    }

    this.setMaxSet = function(set){
        this.maxSetLabel.textContent = set
    }

    this.addInstruction = function(instruction){
        let newListItem = document.createElement("li")
        newListItem.innerText = instruction.content

        this.instructionsList.appendChild(newListItem)
    }

    this.resetInstructions = function(){
        this.instructionsList.innerHTML = ""
    }
}