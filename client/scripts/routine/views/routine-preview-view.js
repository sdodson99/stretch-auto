function RoutinePreviewView(){

    this.addListButtonHandler = function(handler){
        this.listButton.addEventListener('click', handler)
    }

    this.addStartButtonHandler = function(handler){
        this.startButton.addEventListener('click', handler)
    }

    this.addStretch = function(stretchName){
        let newStretchItem = document.createElement('li')
        newStretchItem.innerHTML = stretchName

        this.stretchList.appendChild(newStretchItem)
    }

    this.isNarrate = function(){
        return this.narrateStretches.checked
    }

    this.isNarrateInstructions = function(){
        return this.narrateInstructions.checked
    }

    this.isNarrateChanged = function(){
        if(this.isNarrate()){
            this.narrateInstructions.disabled = false
        } else {
            this.narrateInstructions.disabled = true
        }
    }

    this.draw = function(root, displayNarration){
        root.innerHTML = this.getMarkup()

        this.listButton = document.querySelector("#routine-view-list")
        this.startButton = document.querySelector("#routine-start")
        this.stretchList = document.querySelector('#stretches')
        this.narrateStretches = document.querySelector("#narrate-stretches")
        this.narrateInstructions = document.querySelector("#narrate-instructions")

        this.narrateStretches.addEventListener("click", () => {
            this.isNarrateChanged()
        })
    
        this.isNarrateChanged()

        if(!displayNarration){
            document.querySelector("#narration").style.display = "none"
        }
    }

    this.getMarkup = function(){
        return `
        <div id="routine-preview" class="container">
            <button id="routine-view-list" class="routine-header-button" type="button">&lt; View Routines</button>
            <div id="routine-name" class="routine-section-header">Main</div>
            <div id="routine-stretches">
                <div class="subheader">Stretches</div>
                <ol id="stretches" class="content">
                </ol>
            </div>
            <div id="narration">
                <div class="subheader">Narration</div>
                <div class="content">
                    <div class="field">
                        <span class="field-header">Narrate stretches?</span>
                        <input id="narrate-stretches" class="field-content" type="checkbox" />
                    </div>
                    <div class="field">
                        <span class="field-header">Narrate instructions?</span>
                        <input id="narrate-instructions" class="field-content" type="checkbox" />
                    </div>                        
                </div>
            </div>
            <div id="action">
                <button id="routine-start" type="button">Start Stretching</button>
            </div>
        </div>`
    }
}

module.exports = RoutinePreviewView