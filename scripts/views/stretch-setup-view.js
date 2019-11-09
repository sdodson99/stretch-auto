function StretchSetupView(){
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

    this.narrateCheckbox.addEventListener("click", (event) => {
        this.isNarrateChanged()
    })

    this.isNarrateChanged()
}