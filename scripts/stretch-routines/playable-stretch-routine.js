function PlayableStretchRoutine(routine, handler){
    this.stretches = routine.stretches
    this.sets = routine.sets
    this.duration = routine.duration

    this.onTimeChange = (time) => handler.onTimeChange(time)
    this.onStretchChange = (stretch) => handler.onStretchChange(stretch)
    this.onSetChange = (set) => handler.onSetChange(set)
    this.onFinish = () => handler.onFinish()
    this.onCancel = () => handler.onCancel()
    this.onSetPaused = (paused) => handler.onSetPaused(paused)

    this.start = async function(){
        for (let i = 0; i < this.stretches.length; i++) {
            if(this.isCancelled()) return

            const currentStretch = this.stretches[i]

            this.currentPlayer = this.createStretchPlayer(currentStretch)
            await this.onStretchChange(currentStretch)

            await this.currentPlayer.start()
        }

        this.onFinish()
    }

    this.setPaused = function(paused){
        this.currentPlayer.setPaused(paused)
        this.onSetPaused(paused)
    }

    this.isPaused = function(){
        return this.currentPlayer.isPaused()
    }

    this.cancel = function(){
        this.currentPlayer.cancel()
        this.onCancel()
    }

    this.isCancelled = function(){
        return this.currentPlayer && this.currentPlayer.isCancelled()
    }

    this.createStretchPlayer = function(stretch){
        let stretchPlayer = new StretchPlayer(this.duration, this.onTimeChange)
        
        if(stretch.isUnilateral){
            stretchPlayer = new UnilateralStretchPlayer(stretchPlayer, stretch, this.onStretchChange)
        }

        return new StretchSetPlayer(stretchPlayer, this.sets, this.onSetChange)
    }
}