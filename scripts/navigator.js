const DisplayType = {
    SETUP: "Setup",
    STRETCH: "Stretch",
    DONE: "Done"
}

function Navigator(){

    this.displayStretchSetup = document.querySelector("#stretch-setup")
    this.displayStretch = document.querySelector("#stretch")
    this.displays = document.querySelectorAll(".stretch-content")

    this.handlerFactory = new StretchHandlerFactory()
    this.routineView = new StretchRoutineView()
    this.setupView = new StretchSetupView()
    this.stretchService = new ApiStretchService(stretchApiUrl)

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