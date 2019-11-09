function StretchRoutineController(routine, view, navigator, handlerFactory, options){
    this.routine = routine
    this.view = view
    this.navigator = navigator
    this.options = options
    this.stretchHandler = handlerFactory.createStretchHandler(options)
    
    this.startRoutine = async function(){
        this.view.setPaused(false)
        this.view.setMaxSet(this.routine.sets)
        this.view.addPauseHandler(() => this.onPause())
        this.view.addCancelHandler(() => this.onCancel())

        this.routine.onStretchChange = this.onStretchChange.bind(this)
        this.routine.onSetChange = this.onSetChange.bind(this)
        this.routine.onTimeChange = this.onTimeChange.bind(this)
        this.routine.onFinish = this.onFinish.bind(this)

        await this.routine.start()
    }

    this.onStretchChange = async function(stretch){   
        
        this.view.setTime(this.routine.duration)
        this.view.setName(stretch.name)
        this.view.resetInstructions()
        
        stretch.instructions.forEach(i => {
            this.view.addInstruction(i)
        })
        
        this.currentStretch = stretch
        await this.stretchHandler.onStretchChange(this, stretch)
    }

    this.onSetChange = async function(set){
        this.view.setCurrentSet(set)
        this.currentSet = set
        await this.stretchHandler.onSetChange(this, set)
    }

    this.onTimeChange = async function(time){
        this.view.setTime(time)
        await this.stretchHandler.onTimeChange(this, time)
    }

    this.onFinish = async function(){
        this.navigator.show(DisplayType.DONE)
        this.stretchHandler.onFinish(this)
    }
    
    this.onPause = function(){
        this.routine.setPaused(!this.routine.isPaused())
        this.view.setPaused(this.routine.isPaused())
        this.stretchHandler.onSetPaused(this, this.routine.isPaused())
    }

    this.onCancel = function(){
        this.routine.cancel()
        this.navigator.show(DisplayType.SETUP)
        this.stretchHandler.onCancel(this)
    }
}