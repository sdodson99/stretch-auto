const StretchHandlerFactory = require('../../models/stretch-handlers/stretch-handler-factory')
const StretchRoutineView = require('../views/stretch-routine-view')
const StretchSetupView = require('../views/stretch-setup-view')
const ApiStretchService = require('../../services/api-stretch-service')
const StretchSetupController = require('../controllers/stretch-setup-controller')
const StretchRoutineController = require('../controllers/stretch-routine-controller')
const Constants = require('../../utilities/constants')
const DisplayType = require('./stretch-display-type')
require('../../utilities/modernizr')
const isMobile = require('../../utilities/mobile-check')

function Navigator(){

    this.root = document.querySelector('#main')
    this.displayStretchSetup = document.querySelector("#stretch-setup")
    this.displayStretch = document.querySelector("#stretch")
    this.displays = document.querySelectorAll(".stretch-content")
    this.displayNarration = Modernizr.speechsynthesis && !isMobile()

    this.handlerFactory = new StretchHandlerFactory()
    this.routineView = new StretchRoutineView()
    this.setupView = new StretchSetupView()
    this.stretchService = new ApiStretchService(Constants.stretchApiUrl)

    //Hide all displays except for specified display
    this.show = function(displayType){
        switch (displayType) {
            case DisplayType.SETUP:
                this.setupView.draw(this.root, this.displayNarration)
                break;
            case DisplayType.STRETCH:
                this.routineView.draw(this.root)
                break;
            case DisplayType.DONE:
                this.setupView.draw(this.root)
                break
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
        let stretchHandler = this.handlerFactory.createStretchHandler(options)
        this.currentController = new StretchRoutineController(routine, this.routineView, stretchHandler, options, () => this.showSetup())
    }   
}

module.exports = Navigator