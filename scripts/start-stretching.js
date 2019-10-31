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

const stretchApiUrl = "http://52.170.19.168/stretch"

function StretchRoutine(stretches, sets, duration){
    this.stretches = stretches
    this.sets = sets
    this.duration = duration
}

function PlayableStretchRoutine(routine, onTimeChange, onFinish){
    this.stretches = routine.stretches
    this.sets = routine.sets
    this.duration = routine.duration

    this.onTimeChange = onTimeChange
    this.onFinish = onFinish

    this.isCancelled = false
    this.isPaused = false
    this.isFinished = false

    this.start = async function(){

        //Display each stretch
        for (let i = 0; i < this.stretches.length; i++) {
            if(this.isCancelled) break

            //Display each set
            for (this.currentSet = 1; this.currentSet <= this.sets; this.currentSet++) {
                if(this.isCancelled) break

                await this.startStretch(this.stretches[i], this.duration)
            }
        }

        this.onFinish(this)
    }

    //Start a stretch
    this.startStretch = async function(stretch, duration){
        stretch.isUnilateral ? 
            await this.startUnilateralStretch(stretch, duration) : 
            await this.startBilateralStretch(stretch, duration)
    }

    //Start a stretch on the left and right side
    this.startUnilateralStretch = async function(stretch, duration){
        let originalStretchName = stretch.name

        //Play stretch for left side
        stretch.name = "Left " + originalStretchName
        await this.playStretchForDuration(stretch, duration)

        //Play stretch for right side
        stretch.name = "Right " + originalStretchName
        await this.playStretchForDuration(stretch, duration)

        //Revert to old name
        stretch.name = originalStretchName
    }

    //Start a bilateral stretch
    this.startBilateralStretch = async function(stretch, duration){
        await this.playForDuration(stretch, duration)
    }

    //Play stretch for a specified duration
    this.playStretchForDuration = async function(stretch, duration){
        this.currentStretch = stretch

        for (this.currentTime = duration; this.currentTime >= 1; this.currentTime--) {
            if(this.isCancelled) break

            this.onTimeChange(this)
            await this.wait(1)

            while(this.isPaused){
                await this.wait(1)
            }
        }
    }

    //Wait for amount of time
    this.wait = function(timeInSeconds){
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeInSeconds * 1000)
        })
    }
}

function StretchApiService(url){
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

function Navigator(){

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
let currentRoutine;

async function startStretching(){

    btnPause.textContent = "Pause Routine"

    //Get inputs from user
    let stretchAmount = inputStretchAmount.value ? inputStretchAmount.value : 1
    let stretchSets = inputStretchSets.value ? inputStretchSets.value : 1
    let stretchDuration = inputStretchDuration.value ? inputStretchDuration.value : 5

    //Create routine from API stretches
    let routine = new StretchRoutine(await stretchService.getStretches(stretchAmount), stretchSets, stretchDuration)
    currentRoutine = new PlayableStretchRoutine(routine, updateUI, () => navigator.show(DisplayType.DONE))

    currentRoutine.start()
}

function pauseStretching(){
    currentRoutine.isPaused = !currentRoutine.isPaused
    btnPause.textContent = currentRoutine.isPaused ? "Unpause Routine" : "Pause Routine"
}

function stopStretching(){
    currentRoutine.isCancelled = true
    navigator.show(DisplayType.SETUP)
}

function updateUI(routine){
    labelStretchSetMax.textContent = routine.sets
    labelStretchSetCurrent.textContent = routine.currentSet
    labelStretchTimer.textContent = routine.currentTime

    navigator.showStretch(routine.currentStretch)
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