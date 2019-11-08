const btnStart = document.querySelector("#stretch-start")
const btnPause = document.querySelector("#stretch-pause")
const btnCancel = document.querySelector("#stretch-cancel")

const inputStretchAmount = document.querySelector("#stretch-amount")
const inputStretchSets = document.querySelector("#stretch-sets")
const inputStretchDuration = document.querySelector("#stretch-duration")
const inputStretchNarrate = document.querySelector("#stretch-narrate")
const inputNarrationFieldset = document.querySelector("#narration-fieldset")

const stretchApiUrl = "http://52.170.19.168/stretch"

const navigator = new Navigator()
const stretchRoutineView = new StretchRoutineView()
const stretchService = new ApiStretchService(stretchApiUrl)
let currentRoutine;

async function startStretching(){

    btnPause.textContent = "Pause Routine"

    //Get inputs from user
    let stretchAmount = inputStretchAmount.value ? inputStretchAmount.value : 1
    let stretchSets = inputStretchSets.value ? inputStretchSets.value : 1
    let stretchDuration = inputStretchDuration.value ? inputStretchDuration.value : 5
    let options = {
        narrate: inputStretchNarrate.checked,
        unilateralMode: true
    }

    stretchRoutineView.setMaxSet(stretchSets)
    stretchRoutineView.setTime(stretchDuration)

    //Create routine from API stretches
    let handler = createStretchHandler(options, stretchDuration)
    
    let routine = new StretchRoutine(await stretchService.getStretches(stretchAmount), stretchSets, stretchDuration)
    currentRoutine = new PlayableStretchRoutine(routine, handler);

    navigator.show(DisplayType.STRETCH)
    await currentRoutine.start()
}

function createStretchHandler(options){
    let compositeHandler = new CompositeStretchHandler()

    compositeHandler.addHandler(new UIStretchHandler(navigator, stretchRoutineView))

    if(options.narrate){
        compositeHandler.addHandler(new SpeechStretchHandler(false))
    }

    return new OptionsStretchHandler(compositeHandler, options)
}

function pauseStretching(){
    currentRoutine.setPaused(!currentRoutine.isPaused())
    btnPause.textContent = currentRoutine.isPaused() ? "Unpause Routine" : "Pause Routine"
}

function stopStretching(){
    currentRoutine.cancel()
    navigator.show(DisplayType.SETUP)
}

if(!Modernizr.speechsynthesis){
    inputNarrationFieldset.style.display = "none"
}

btnStart.addEventListener("click", startStretching)
btnPause.addEventListener("click", pauseStretching)
btnCancel.addEventListener("click", stopStretching)
navigator.show(DisplayType.SETUP)

