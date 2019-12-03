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

            const playingStretch = this.stretches[i]
            this.skipped = false

            for (let currentSet = 1; currentSet <= playingStretch.sets; currentSet++) {
                if(this.isCancelled()) return
                if(this.skipped) break
                await this.onSetChange(currentSet)
    
                if(this.isCancelled()) return
                if(this.skipped) break
                this.currentPlayer = this.createStretchPlayer(playingStretch)
                await this.onStretchChange(playingStretch)
    
                if(this.isCancelled()) return
                if(this.skipped) break
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
        this.cancelled = true
    }

    this.skip = function(){
        this.currentPlayer.cancel()
        this.skipped = true
    }

    this.isCancelled = function(){
        return this.cancelled
    }

    this.createStretchPlayer = function(playableStretch){
        return this.playerFactory.createStretchPlayer(playableStretch, this.onStretchChange, this.onTimeChange)
    }
}

module.exports = PlayableStretchRoutine