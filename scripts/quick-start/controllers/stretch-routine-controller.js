const StretchPlayerFactory = require('../../models/stretch-players/stretch-player-factory')
const PlayableStretchRoutine = require('../../models/stretch-routines/playable-stretch-routine')

function StretchRoutineController(routine, view, stretchHandler, options, onDone){
    this.routine = routine
    this.playableRoutine = new PlayableStretchRoutine(routine.stretches, new StretchPlayerFactory(options.unilateralMode))
    this.view = view
    this.onDone = onDone
    this.options = options
    this.stretchHandler = stretchHandler
    
    this.startRoutine = async function(){

        this.view.setPaused(false)
        this.view.addPauseHandler(() => this.onPause())
        this.view.addCancelHandler(() => this.onCancel())

        this.playableRoutine.onStretchChange = this.onStretchChange.bind(this)
        this.playableRoutine.onSetChange = this.onSetChange.bind(this)
        this.playableRoutine.onTimeChange = this.onTimeChange.bind(this)
        this.playableRoutine.onFinish = this.onFinish.bind(this)

        await this.playableRoutine.start()
    }

    this.onStretchChange = async function(playableStretch){   
        
        this.view.setTime(playableStretch.duration)
        this.view.setMaxSet(playableStretch.sets)

        let stretch = playableStretch.stretch
        this.view.setName(stretch.name)
        this.view.resetInstructions()
        
        if(stretch.instructions){
            stretch.instructions.forEach(i => {
                this.view.addInstruction(i)
            })
        }
        
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
        this.stretchHandler.onFinish(this)
        this.onDone()
    }
    
    this.onPause = function(){
        this.playableRoutine.setPaused(!this.playableRoutine.isPaused())
        this.view.setPaused(this.playableRoutine.isPaused())
        this.stretchHandler.onSetPaused(this, this.playableRoutine.isPaused())
    }

    this.onCancel = function(){
        this.playableRoutine.cancel()
        this.stretchHandler.onCancel(this)
        this.onDone()
    }

    this.startRoutine()
}

module.exports = StretchRoutineController