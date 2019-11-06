function StretchSetPlayer(stretchPlayer, sets, onSetChange){
    this.stretchPlayer = stretchPlayer
    this.sets = sets
    this.onSetChange = onSetChange

    this.start = async function(){
        for (let currentSet = 1; currentSet <= sets; currentSet++) {
            this.onSetChange(currentSet)
            await this.stretchPlayer.start()
        }
    }

    this.setPaused = function(paused){
        this.stretchPlayer.setPaused(paused)
    }

    this.isPaused = function(){
        return this.stretchPlayer.isPaused()
    }

    this.cancel = function(){
        this.stretchPlayer.cancel()
    }

    this.isCancelled = function(){
        return this.stretchPlayer.isCancelled()
    }
}