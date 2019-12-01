function StretchSetupView(){

    this.addStartHandler = function(handler){
        this.startButton.addEventListener("click", (event) => handler())
    }

    this.getAmount = function(){
        return this.stretchAmountInput.value || 1
    }

    this.getMaxSets = function(){
        return this.stretchMaxSetsInput.value || 2
    }

    this.getDuration = function(){
        return this.stretchDurationInput.value || 5
    }

    this.isNarrate = function(){
        return this.narrateCheckbox.checked
    }

    this.isNarrateInstructions = function(){
        return this.instructionsNarrateCheckbox.checked
    }

    this.isNarrateChanged = function(){
        if(this.isNarrate()){
            this.instructionsNarrateCheckbox.disabled = false
        } else {
            this.instructionsNarrateCheckbox.disabled = true
        }
    }

    this.draw = function(root){
        root.innerHTML = this.getMarkup()

        this.startButton = document.querySelector("#stretch-start")
        this.stretchAmountInput = document.querySelector("#stretch-amount")
        this.stretchMaxSetsInput = document.querySelector("#stretch-sets")
        this.stretchDurationInput = document.querySelector("#stretch-duration")
        this.narrateCheckbox = document.querySelector("#stretch-narrate")
        this.instructionsNarrateCheckbox = document.querySelector("#stretch-narrate-instructions")
        this.narrateFieldset = document.querySelector("#narration-fieldset")
    
        if(!Modernizr.speechsynthesis){
            this.narrateFieldset.style.display = "none"
        }

        this.narrateCheckbox.addEventListener("click", (event) => {
            this.isNarrateChanged()
        })
    
        this.isNarrateChanged()
    }

    this.getMarkup = function(){
        return `
        <section id="stretch-setup" class="stretch-content center-content container">
            <div class="stretch-fieldset">
                <p class="stretch-fieldset-header">Capacity</p>
                <div class="stretch-field">
                    <p class="prompt">How many stretches would you like to perform?*</p>
                    <input id="stretch-amount" type="text" maxlength="5" size="5"/>
                </div>     
                <div class="stretch-field">
                    <p class="prompt">How many sets would you like to perform for each stretch?</p>
                    <input id="stretch-sets" type="text" maxlength="5" size="5"/>
                </div>
                    <div class="stretch-field">
                    <p class="prompt">How many seconds would you like to perform each stretch?</p>
                    <input id="stretch-duration" type="text" maxlength="5" size="5"/>
                </div>
            </div>
            <div id="narration-fieldset" class="stretch-fieldset">
                <p class="stretch-fieldset-header">Narration</p>
                <div class="stretch-field">
                    <p class="prompt">Narrate routine?</p>
                    <input id="stretch-narrate" type="checkbox"/>
                </div>
                <div id="narrate-instructions" class="stretch-field">
                    <p class="prompt">Narrate instructions?</p>
                    <input id="stretch-narrate-instructions" type="checkbox"/>
                </div>
            </div>
            <div class="stretch-fieldset">
                <button id="stretch-start" type="button">Start Stretching</button>
            </div>
            <div id="stretch-legend">
                <p>* This is a maximum number. If the number entered is too large, 
                    the desired amount of stretches may not be provided.</p>
            </div>
        </section>`
    }
}

module.exports = StretchSetupView