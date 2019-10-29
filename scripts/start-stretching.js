const btnStart = document.querySelector("#stretch-start")
const btnPause = document.querySelector("#stretch-pause")
const btnCancel = document.querySelector("#stretch-cancel")
const inputStretchAmount = document.querySelector("#stretch-amount")
const inputStretchSets = document.querySelector("#stretch-sets")
const inputStretchDuration = document.querySelector("#stretch-duration")
const labelStretchName = document.querySelector("#stretch-name")
const labelStretchTimer = document.querySelector("#stretch-timer span")
const labelStretchSetCurrent = document.querySelector("#stretch-set-current")
const labelStretchSetMax = document.querySelector("#stretch-set-max")
const listStretchInstructions = document.querySelector("#stretch-instructions")

const displayStretchSetup = document.querySelector("#stretch-setup")
const displayStretch = document.querySelector("#stretch")
const displays = document.querySelectorAll(".stretch-content")

const stretchApiUrl = "http://localhost/stretch"

const StretchRoutine = function(stretches, sets, duration){
    this.stretches = stretches
    this.sets = sets
    this.duration = duration
}

const StretchController = function(stretchService, navigator){

    this.stretchService = stretchService
    this.navigator = navigator
    this.isCancelled = false
    this.isPaused = false
    this.isFinished = false

    this.startRoutine = async function(){
        this.unPauseRoutine()

        //Get inputs from user
        let stretchAmount = inputStretchAmount.value ? inputStretchAmount.value : 1
        let stretchSets = inputStretchSets.value ? inputStretchSets.value : 1
        let stretchDuration = inputStretchDuration.value ? inputStretchDuration.value : 5

        //Create routine from API stretches
        this.routine = new StretchRoutine(await stretchService.getStretches(stretchAmount), stretchSets, stretchDuration)

        labelStretchSetMax.textContent = this.routine.sets

        //Display each stretch
        for (let i = 0; i < this.routine.stretches.length; i++) {
            if(this.isCancelled) break

            const stretch = this.routine.stretches[i]

            //Display each set
            for (let set = 1; set <= this.routine.sets; set++) {
                if(this.isCancelled) break

                labelStretchSetCurrent.textContent = set
                await this.startStretch(stretch, stretchDuration)
            }
        }

        this.finishRoutine()
    }

    this.startStretch = async function(stretch, duration){
        stretch.isUnilateral ? 
            await this.startUnilateralStretch(stretch, duration) : 
            await this.startBilateralStretch(stretch, duration)
    }

    //Start a stretch on the left and right side
    this.startUnilateralStretch = async function(stretch, duration){
        let originalStretchName = stretch.name

        //Show stretch for left side
        stretch.name = "Left " + originalStretchName
        await this.showStretchForDuration(stretch, duration)

        //Show stretch for right side
        stretch.name = "Right " + originalStretchName
        await this.showStretchForDuration(stretch, duration)

        //Revert to old name
        stretch.name = originalStretchName
    }

    //Start a bilateral stretch
    this.startBilateralStretch = async function(stretch, duration){
        await this.showStretchForDuration(stretch, duration)
    }

    //Start a stretch for a specified duration
    this.showStretchForDuration = async function(stretch, duration){
        this.navigator.showStretch(stretch)

        for (let index = duration; index >= 1; index--) {
            if(this.isCancelled) break

            labelStretchTimer.textContent = index
            await wait(1)

            while(this.isPaused){
                await wait(1)
            }
        }
    }

    this.pauseRoutine = function(){
        this.togglePauseRoutine(true)
    }

    this.unPauseRoutine = function(){
        this.togglePauseRoutine(false)
    }

    this.togglePauseRoutine = function(isPaused){
        this.isPaused = isPaused
        this.isPaused ? btnPause.textContent = "Unpause Routine" : btnPause.textContent = "Pause Routine"
    }

    this.cancelRoutine = function(){
        this.isCancelled = true
        this.navigator.show(DisplayType.SETUP)
    }

    this.finishRoutine = function(){
        this.isFinished = true
        this.navigator.show(DisplayType.DONE)
    }
}

//Wait for amount of time
function wait(timeInSeconds){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeInSeconds * 1000)
    })
}

const StretchApiService = function(url){
    this.url = url

    this.getStretches = async function(amount){
        let fetchResult = await fetch(stretchApiUrl + `/?maxAmount=${amount}`)
    
        return await fetchResult.json()
    }
}

const DisplayType = {
    SETUP: "Setup",
    STRETCH: "Stretch",
    DONE: "Done"
}

const Navigator = function(){

    //Hide all displays except for specified display
    this.show = function(displayType){

        displays.forEach((d) => {
            d.style.display = "none"
        })

        switch (displayType) {
            case DisplayType.SETUP:
                displayStretchSetup.style.display = ""
                break;
            case DisplayType.STRETCH:
                displayStretch.style.display = ""
                break;
            case DisplayType.DONE:
                displayStretchSetup.style.display = ""
            default:
                break;
        }
    }

    //Display a stretch
    this.showStretch = function(stretch){
        labelStretchName.textContent = stretch.name + " Stretch"
        listStretchInstructions.innerHTML = ""

        stretch.instructions.sort((a, b) => a.order < b.order).forEach(instruction => {

            let newListItem = document.createElement("li")
            newListItem.innerText = instruction.content

            listStretchInstructions.appendChild(newListItem)
        })

        this.show(DisplayType.STRETCH)
    }
}

const navigator = new Navigator()
const stretchService = new StretchApiService(stretchApiUrl)
let currentController;

async function startStretching(e){
    currentController = new StretchController(stretchService, navigator)
    await currentController.startRoutine()
}

function pauseStretching(){
    currentController.isPaused ? currentController.unPauseRoutine() : currentController.pauseRoutine()
}

function stopStretching(){
    currentController.cancelRoutine()
}

btnStart.addEventListener("click", startStretching)
btnPause.addEventListener("click", pauseStretching)
btnCancel.addEventListener("click", stopStretching)
navigator.show(DisplayType.SETUP)

// const testStretch = {
//     name: "Test",
//     isUnilateral: false,
//     instructions : [
//         {
//             order: 1,
//             content: "Try as hard as possible."
//         },
//         {
//             order: 2,
//             content: "Hold."
//         },
//         {
//             order: 3,
//             content: "Slowly release."
//         }
//     ]
// }

// navigator.showStretch(testStretch)