const btnStart = document.querySelector("#stretch-start")
const btnPause = document.querySelector("#stretch-pause")
const btnCancel = document.querySelector("#stretch-cancel")

const inputStretchAmount = document.querySelector("#stretch-amount")
const inputStretchSets = document.querySelector("#stretch-sets")
const inputStretchDuration = document.querySelector("#stretch-duration")
const inputStretchNarrate = document.querySelector("#stretch-narrate")
const inputNarrationFieldset = document.querySelector("#narration-fieldset")

const labelStretchName = document.querySelector("#stretch-name")
const labelStretchTimer = document.querySelector("#stretch-timer-value span")
const labelStretchSetCurrent = document.querySelector("#stretch-set-current")
const labelStretchSetMax = document.querySelector("#stretch-set-max")

const listStretchInstructions = document.querySelector("#stretch-instructions")

const stretchApiUrl = "http://52.170.19.168/stretch"

function StretchRoutine(stretches, sets, duration){
    this.stretches = stretches
    this.sets = sets
    this.duration = duration
}

function PlayableStretchRoutine(routine, onChange, onFinish, options){
    this.stretches = routine.stretches
    this.sets = routine.sets
    this.duration = routine.duration

    this.onChange = onChange
    this.onFinish = onFinish
    this.options = options

    this.isCancelled = false
    this.isPaused = false
    this.isFinished = false

    this.start = async function(){
        
        //Display each stretch
        for (let i = 0; i < this.stretches.length; i++) {
            if(this.isCancelled) break

            this.currentPlayer = this.createStretchPlayer(this.stretches[i], this.sets, this.duration, this.options, this.onChange)
            await this.currentPlayer.play()
        }

        this.onFinish(this)
    }

    this.togglePause = function(){
        this.isPaused = !this.isPaused
        this.currentPlayer.togglePause()
    }

    this.cancel = function(){
        this.isCancelled = true
        this.currentPlayer.cancel()
    }

    this.createStretchPlayer = function(stretch, sets, duration, options, onChange){
        if(options && options.narrate){
            return new SpeakingStretchPlayer(stretch, sets, duration, onChange)
        } else {
            return new StretchPlayer(stretch, sets, duration, onChange)
        }
    }
}

function StretchPlayer(stretch, sets, duration, onChange){
    this.stretch = stretch
    this.duration = duration
    this.sets = sets

    this.currentSet = 1
    this.currentTime = duration
    this.onChange = onChange

    this.cancelled = false
    this.isPaused = false

    this.play = async function(){
        for (this.currentSet = 1; this.currentSet <= this.getSets(); this.currentSet++) {
            if(this.isCancelled()) break

            this.stretch.isUnilateral ? 
                await this.playUnilateral() :
                await this.playBilateral()

            if(this.getCurrentSet() != this.getSets())
            {
                await this.wait(5)
            }
        }
    }

    this.playBilateral = async function(){
        await this.waitForDuration()
    }

    this.playUnilateral = async function(){
        await this.playOneSide(true)
        await this.playOneSide(false)
    }

    this.playOneSide = async function(isLeft){
        this.setNameOneSide(isLeft)
        await this.waitForDuration()
        this.resetOriginalName()
    }

    this.setNameOneSide = function(isLeft){
        this.originalStretchName = this.stretch.name
        let prefix = isLeft ? "Left " : "Right "
        this.stretch.name = prefix + this.originalStretchName
    }

    this.resetOriginalName = function(){
        this.stretch.name = this.originalStretchName || this.stretch.name
    }

    this.waitForDuration = async function(){
        for (this.currentTime = this.duration; this.currentTime >= 1; this.currentTime--) {
            if(this.isCancelled()) break

            this.onChange(this)
            await this.wait(1)

            while(this.isPaused){
                await this.wait(1)
            }
        }

        this.currentTime = this.duration
    }

    this.togglePause = function(){
        this.isPaused = !this.isPaused
    }

    this.cancel = function(){
        this.cancelled = true
    }

    this.isCancelled = function(){
        return this.cancelled
    }

    this.getCurrentSet = function(){
        return this.currentSet
    }

    this.setCurrentSet = function (set){
        this.currentSet = set
    }

    this.getStretch = function(){
        return this.stretch
    }

    this.getSets = function(){
        return this.sets
    }

    this.getCurrentTime = function(){
        return this.currentTime
    }

    this.wait = function(timeInSeconds){
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeInSeconds * 1000)
        })
    }
}

function SpeakingStretchPlayer(stretch, sets, duration, onChange){
    this.stretchPlayer = new StretchPlayer(stretch, sets, duration, onChange)
    this.speaker = new Speaker()

    this.play = async function(){

        for (let currentSet = 1; currentSet <= this.getSets(); currentSet++) {
            if(this.isCancelled()) break            

            this.setCurrentSet(currentSet)

            this.getStretch().isUnilateral ? 
                await this.playUnilateral() :
                await this.playBilateral()
            
            if(!this.isCancelled() && this.getCurrentSet() != this.getSets()){
                this.speaker.speakAsync("Relax.")
                await this.stretchPlayer.wait(5)
                await this.speakNextSet()
            }
        }

        await this.speakFinished()
    }

    this.playBilateral = async function(){
        this.onChange(this)

        if(this.getCurrentSet() == 1){
            await this.speakName(this.getStretch())
            await this.speakInstructions(this.getStretch())
        }

        await this.stretchPlayer.waitForDuration()
    }

    this.playUnilateral = async function(){
        await this.playLeftSide()
        if(this.isCancelled()) return
        await this.playRightSide()
    }

    this.playLeftSide = async function(){
        this.stretchPlayer.setNameOneSide(true)
        this.onChange(this)

        if(this.getCurrentSet() == 1){
            await this.speakName(this.getStretch())
            await this.speakInstructions(this.getStretch())
        }

        await this.stretchPlayer.waitForDuration()
        this.stretchPlayer.resetOriginalName()
    }

    this.playRightSide = async function(){
        this.stretchPlayer.setNameOneSide(false)
        this.onChange(this)
        await this.speakSwitch()
        await this.stretchPlayer.waitForDuration()
        this.stretchPlayer.resetOriginalName()
    }

    this.speakName = async function(stretch){
        if(this.isCancelled()) return
        await this.speaker.speakAsync(stretch.name)
    }

    this.speakInstructions = async function(stretch){
        let instructions = stretch.instructions

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i]

            if(this.isCancelled()) return
            await this.speaker.speakAsync(instruction.order + ".")

            if(this.isCancelled()) return
            await this.speaker.speakAsync(instruction.content)
        }
    }

    this.speakSwitch = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Switch sides.")
    }

    this.speakNextSet = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Start next set.")
    }

    this.speakFinished = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Stretching completed.")
    }

    this.togglePause = function(){
        this.stretchPlayer.togglePause()
        this.speaker.togglePause()
    }

    this.cancel = function(){
        this.stretchPlayer.cancel()
        this.speaker.cancel()
    }

    this.isCancelled = function(){
        return this.stretchPlayer.isCancelled()
    }

    this.getCurrentSet = function(){
        return this.stretchPlayer.currentSet
    }

    this.setCurrentSet = function (set){
        this.stretchPlayer.currentSet = set
    }

    this.getStretch = function(){
        return this.stretchPlayer.stretch
    }

    this.getSets = function(){
        return this.stretchPlayer.sets
    }

    this.getCurrentTime = function(){
        return this.stretchPlayer.currentTime
    }

    this.onChange = function(sender){
        this.stretchPlayer.onChange(sender)
    }
}

function StretchApiService(url){
    this.url = url

    this.getStretches = async function(amount){
        let fetchResult = await fetch(stretchApiUrl + `/?maxAmount=${amount}`)
        let stretches = await fetchResult.json()

        stretches.forEach((stretch) => {
            stretch.name = stretch.name + " Stretch"
            stretch.instructions.sort((a, b) => a.order > b.order)
        })

        return stretches
    }
}

function StretchMockService(){
    this.getStretches = function(amount){
        return [
            {
                name: "Test",
                isUnilateral: true,
                instructions : [
                {
                    order: 1,
                    content: "Try as hard as possible."
                }
                ]
            }
        ]
    }
}

const DisplayType = {
    SETUP: "Setup",
    STRETCH: "Stretch",
    DONE: "Done"
}

function Navigator(){

    this.displayStretchSetup = document.querySelector("#stretch-setup")
    this.displayStretch = document.querySelector("#stretch")
    this.displays = document.querySelectorAll(".stretch-content")

    //Hide all displays except for specified display
    this.show = function(displayType){

        this.displays.forEach((d) => {
            d.style.display = "none"
        })

        switch (displayType) {
            case DisplayType.SETUP:
                this.displayStretchSetup.style.display = ""
                break;
            case DisplayType.STRETCH:
                this.displayStretch.style.display = ""
                break;
            case DisplayType.DONE:
                this.displayStretchSetup.style.display = ""
            default:
                break;
        }
    }

    //Display a stretch
    this.showStretch = function(stretch){
        labelStretchName.textContent = stretch.name
        listStretchInstructions.innerHTML = ""

        stretch.instructions.forEach(instruction => {

            let newListItem = document.createElement("li")
            newListItem.innerText = instruction.content

            listStretchInstructions.appendChild(newListItem)
        })

        this.show(DisplayType.STRETCH)
    }
}

function Speaker(){
    this.synth = window.speechSynthesis

    this.speakAsync = async function(content){
        return new Promise((resolve) => {
            let utterance = new SpeechSynthesisUtterance(content)
            utterance.onend = resolve
            this.synth.speak(utterance)
        })
    }

    this.togglePause = function(){
        this.synth.paused ? this.synth.resume() : this.synth.pause()
    }

    this.cancel = function(){
        this.synth.cancel()
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
    let options = {
        narrate: inputStretchNarrate.checked
    }

    //Create routine from API stretches
    let routine = new StretchRoutine(await stretchService.getStretches(stretchAmount), stretchSets, stretchDuration)
    currentRoutine = new PlayableStretchRoutine(routine, updateUI, () => navigator.show(DisplayType.DONE), options)

    currentRoutine.start()
}

function pauseStretching(){
    currentRoutine.togglePause()
    btnPause.textContent = currentRoutine.isPaused ? "Unpause Routine" : "Pause Routine"
}

function stopStretching(){
    currentRoutine.cancel()
    navigator.show(DisplayType.SETUP)
}

function updateUI(routine){

    labelStretchSetMax.textContent = routine.getSets()
    labelStretchSetCurrent.textContent = routine.getCurrentSet()
    labelStretchTimer.textContent = routine.getCurrentTime()

    navigator.showStretch(routine.getStretch())
}

if(!Modernizr.speechsynthesis){
    inputNarrationFieldset.style.display = "none"
}

btnStart.addEventListener("click", startStretching)
btnPause.addEventListener("click", pauseStretching)
btnCancel.addEventListener("click", stopStretching)
navigator.show(DisplayType.SETUP)