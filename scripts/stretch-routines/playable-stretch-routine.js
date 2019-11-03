function PlayableStretchRoutine(routine, onChange, onFinish, options){
    this.stretches = routine.stretches
    this.sets = routine.sets
    this.duration = routine.duration

    this.onChange = onChange
    this.onFinish = onFinish
    this.options = options

    this.isCancelled = false
    this.isPaused = false
    this.isFinished = false

    this.start = async function(){
        for (let i = 0; i < this.stretches.length; i++) {
            if(this.isCancelled) break

            this.currentPlayer = this.createStretchPlayer(this.stretches[i], this.sets, this.duration, this.options, this.onChange)
            await this.currentPlayer.play()
        }

        this.onFinish(this)
    }

    this.togglePause = function(){
        this.isPaused = !this.isPaused
        this.currentPlayer.togglePause()
    }

    this.cancel = function(){
        this.isCancelled = true
        this.currentPlayer.cancel()
    }

    this.createStretchPlayer = function(stretch, sets, duration, options, onChange){
        if(options && options.narrate){
            return new SpeakingStretchPlayer(stretch, sets, duration, onChange)
        } else {
            return new StretchPlayer(stretch, sets, duration, onChange)
        }
    }
}