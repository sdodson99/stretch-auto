function UnilateralStretchPlayer(stretchPlayer, stretch, onStretchChange){
    this.stretchPlayer = stretchPlayer
    this.stretch = stretch
    this.onStretchChange = onStretchChange

    this.start = async function(){
        this.originalStretchName = this.stretch.name
        this.stretch.name = "Left " + this.originalStretchName
        await this.onStretchChange(this.stretch)
        if(this.isCancelled()) return
        await this.stretchPlayer.start()

        if(this.isCancelled()) return

        this.stretch.name = "Right " + this.originalStretchName
        await this.onStretchChange(this.stretch)
        if(this.isCancelled()) return
        await this.stretchPlayer.start()

        this.stretch.name = this.originalStretchName
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