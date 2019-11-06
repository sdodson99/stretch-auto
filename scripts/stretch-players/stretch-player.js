function StretchPlayer(duration, onTimeChange){
    this.duration = duration
    this.timer = new Timer(onTimeChange)

    this.start = async function(){
        await this.timer.waitForDuration(this.duration)
    }

    this.setPaused = function(paused){
        this.timer.setPaused(paused)
    }

    this.isPaused = function(){
        return this.timer.isPaused()
    }

    this.cancel = function(){
        this.timer.cancel()
    }

    this.isCancelled = function(){
        return this.timer.isCancelled()
    }
}