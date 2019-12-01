function StretchRoutineView(){

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
        newListItem.classList.add('instruction')
        newListItem.innerText = instruction.content

        this.instructionsList.appendChild(newListItem)
    }

    this.resetInstructions = function(){
        this.instructionsList.innerHTML = ""
    }

    this.setPaused = function(paused){
        this.pauseButton.textContent = paused ? "Unpause Routine" : "Pause Routine"
    }

    this.addPauseHandler = function(handler){
        this.pauseButton.addEventListener("click", (e) => handler())
    }

    this.addCancelHandler = function(handler){
        this.cancelButton.addEventListener("click", (e) => handler())
    }
    
    this.draw = function(root){
        root.innerHTML = this.getMarkup()

        this.nameLabel = document.querySelector("#stretch-name")
        this.timeLabel = document.querySelector("#stretch-timer-value span")
        this.currentSetLabel = document.querySelector("#stretch-set-current")
        this.maxSetLabel = document.querySelector("#stretch-set-max")
        this.instructionsList = document.querySelector("#stretch-instructions")
        this.pauseButton = document.querySelector("#stretch-pause")
        this.cancelButton = document.querySelector("#stretch-cancel")
    }

    this.getMarkup = function(){
        return `
        <section id="stretch" class="stretch-content center-content container">
            <div id="stretch-volume">
                <div id="stretch-set">
                    Set: <span id="stretch-set-current">1</span>/<span id="stretch-set-max">0</span>
                </div>
                <div id="stretch-timer">
                    Time Remaining: <span id="stretch-timer-value"><span>0</span> second(s)</span> 
                </div>
            </div>
            <div id="stretch-information">
                <div id="stretch-name">Stretch</div>
                <ol id="stretch-instructions">

                </ol>
            </div>
            <div id="stretch-buttons">
                <button id="stretch-pause" type="button">Pause Routine</button>
                <button id="stretch-cancel" type="button">Cancel Routine</button>
            </div>
        </section>`
    }
}

module.exports = StretchRoutineView