const StretchHandlerFactory = require('../../models/stretch-handlers/stretch-handler-factory')
const StretchPlayerFactory = require('../../models/stretch-players/stretch-player-factory')
const StretchRoutineView = require('../views/stretch-routine-view')
const StretchSetupView = require('../views/stretch-setup-view')
const ApiStretchService = require('../../services/api-stretch-service')
const StretchSetupController = require('../controllers/stretch-setup-controller')
const StretchRoutineController = require('../controllers/stretch-routine-controller')
const PlayableStretchRoutine = require('../../models/stretch-routines/playable-stretch-routine')
const Constants = require('../../utilities/constants')
const DisplayType = require('./stretch-display-type')

function Navigator(){

    this.displayStretchSetup = document.querySelector("#stretch-setup")
    this.displayStretch = document.querySelector("#stretch")
    this.displays = document.querySelectorAll(".stretch-content")

    this.handlerFactory = new StretchHandlerFactory()
    this.routineView = new StretchRoutineView()
    this.setupView = new StretchSetupView()
    this.stretchService = new ApiStretchService(Constants.stretchApiUrl)

    //Hide all displays except for specified display
    this.show = function(displayType){

        this.displays.forEach((d) => {
            d.style.display = "none"
        })

        switch (displayType) {
            case DisplayType.SETUP:
                this.displayStretchSetup.style.display = "flex"
                break;
            case DisplayType.STRETCH:
                this.displayStretch.style.display = "flex"
                break;
            case DisplayType.DONE:
                this.displayStretchSetup.style.display = "flex"
            default:
                break;
        }
    }

    this.showSetup = function(){
        this.show(DisplayType.SETUP)
        this.currentController = new StretchSetupController(this.setupView, this, this.stretchService)
    }

    this.playRoutine = async function(routine, options){
        this.show(DisplayType.STRETCH)
        playableRoutine = new PlayableStretchRoutine(routine, new StretchPlayerFactory(options.unilateralMode))
        this.currentController = new StretchRoutineController(playableRoutine, this.routineView, this, this.handlerFactory, options)
        await this.currentController.startRoutine()
    }   
}

module.exports = Navigator