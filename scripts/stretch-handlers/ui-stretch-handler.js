function UIStretchHandler(navigator, setLabel, timeLabel, duration){
    this.navigator = navigator
    this.setLabel = setLabel
    this.timeLabel = timeLabel
    this.duration = duration

    this.onStretchChange = async function(stretch){
        this.onTimeChange(this.duration)
        this.navigator.showStretch(stretch)
    }

    this.onSetChange = async function(set){
        this.setLabel.textContent = set
    }

    this.onTimeChange = async function(time){
        this.timeLabel.textContent = time
    }

    this.onFinish = async function(){
        this.navigator.show(DisplayType.DONE)
    }

    this.onCancel = async function(){

    }

    this.onSetPaused = async function(paused){

    }
}