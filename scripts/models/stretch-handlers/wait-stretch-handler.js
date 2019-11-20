function WaitStretchHandler(restSeconds){

    this.restSeconds = restSeconds
    this.timer = new Timer()

    this.onStretchChange = async function(sender, stretch){
        await this.timer.wait(restSeconds)
    }

    this.onSetChange = async function(sender, set){  
    }

    this.onTimeChange = async function(sender, time){
    }

    this.onFinish = async function(sender){
    }

    this.onCancel = async function(sender){
    }

    this.onSetPaused = async function(sender, paused){
    }
}