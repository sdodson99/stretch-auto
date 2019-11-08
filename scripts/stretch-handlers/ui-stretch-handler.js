function UIStretchHandler(navigator, stretchRoutineView){
    this.navigator = navigator
    this.stretchRoutineView = stretchRoutineView

    this.onStretchChange = async function(stretch){
        this.stretchRoutineView.setName(stretch.name)
        this.stretchRoutineView.resetInstructions()
        
        stretch.instructions.forEach(i => {
            this.stretchRoutineView.addInstruction(i)
        })
    }

    this.onSetChange = async function(set){
        this.stretchRoutineView.setCurrentSet(set)
    }

    this.onTimeChange = async function(time){
        this.stretchRoutineView.setTime(time)
    }

    this.onFinish = async function(){
        this.navigator.show(DisplayType.DONE)
    }

    this.onCancel = async function(){

    }

    this.onSetPaused = async function(paused){

    }
}