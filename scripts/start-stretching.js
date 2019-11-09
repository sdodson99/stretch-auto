const btnStart = document.querySelector("#stretch-start")

const inputStretchAmount = document.querySelector("#stretch-amount")
const inputStretchSets = document.querySelector("#stretch-sets")
const inputStretchDuration = document.querySelector("#stretch-duration")
const inputStretchNarrate = document.querySelector("#stretch-narrate")
const inputNarrationFieldset = document.querySelector("#narration-fieldset")

const stretchApiUrl = "http://52.170.19.168/stretch"

const navigator = new Navigator()
const stretchRoutineView = new StretchRoutineView()
const handlerFactory = new StretchHandlerFactory()
const stretchService = new ApiStretchService(stretchApiUrl)
let currentRoutine;

async function startStretching(){

    //Get inputs from user
    let stretchAmount = inputStretchAmount.value ? inputStretchAmount.value : 1
    let stretchSets = inputStretchSets.value ? inputStretchSets.value : 1
    let stretchDuration = inputStretchDuration.value ? inputStretchDuration.value : 5
    let options = {
        narrate: inputStretchNarrate.checked,
        unilateralMode: true
    }
    
    let routine = new StretchRoutine(await stretchService.getStretches(stretchAmount), stretchSets, stretchDuration)
    currentRoutine = new PlayableStretchRoutine(routine);

    navigator.show(DisplayType.STRETCH)
    let stretchRoutineController = new StretchRoutineController(currentRoutine, stretchRoutineView, navigator, handlerFactory, options)
    await stretchRoutineController.startRoutine()
}

if(!Modernizr.speechsynthesis){
    inputNarrationFieldset.style.display = "none"
}

btnStart.addEventListener("click", startStretching)
navigator.show(DisplayType.SETUP)

