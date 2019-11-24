function PlayableStretchRoutine(stretches, playerFactory){
    this.stretches = stretches
    this.playerFactory = playerFactory

    this.onTimeChange = function(){}
    this.onStretchChange = function(){}
    this.onSetChange = function(){}
    this.onFinish = function(){}
    this.onCancel = function(){}
    this.onSetPaused = function(){}

    this.start = async function(){
        for (let i = 0; i < this.stretches.length; i++) {
            if(this.isCancelled()) return

            const currentStretch = this.stretches[i]

            for (let currentSet = 1; currentSet <= currentStretch.sets; currentSet++) {
                if(this.isCancelled()) return
                await this.onSetChange(currentSet)
    
                if(this.isCancelled()) return
                this.currentPlayer = this.createStretchPlayer(currentStretch)
                await this.onStretchChange(currentStretch)
    
                if(this.isCancelled()) return
                await this.currentPlayer.start()
            }
        }

        await this.onFinish()
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
        return this.playerFactory.createStretchPlayer(stretch, stretch.duration, this.onStretchChange, this.onTimeChange)
    }
}

module.exports = PlayableStretchRoutine