function StretchPlayer(stretch, sets, duration, onChange){
    this.stretch = stretch
    this.duration = duration
    this.sets = sets

    this.currentSet = 1
    this.currentTime = duration
    this.onChange = onChange
    this.timer = new Timer((t) => {
        this.currentTime = t
        this.onChange(this)
    })

    this.cancelled = false
    this.isPaused = false

    this.play = async function(){
        for (this.currentSet = 1; this.currentSet <= this.getSets(); this.currentSet++) {
            if(this.isCancelled()) break

            this.stretch.isUnilateral ? 
                await this.playUnilateral() :
                await this.playBilateral()

            if(this.getCurrentSet() != this.getSets())
            {
                await this.wait(5)
            }
        }
    }

    this.playBilateral = async function(){
        await this.timer.waitForDuration(this.duration)
    }

    this.playUnilateral = async function(){
        await this.playOneSide(true)
        if(this.isCancelled) return
        await this.playOneSide(false)
    }

    this.playOneSide = async function(isLeft){
        this.setNameOneSide(isLeft)
        await this.timer.waitForDuration(this.duration)
        this.resetOriginalName()
    }

    this.setNameOneSide = function(isLeft){
        this.originalStretchName = this.stretch.name
        let prefix = isLeft ? "Left " : "Right "
        this.stretch.name = prefix + this.originalStretchName
    }

    this.resetOriginalName = function(){
        this.stretch.name = this.originalStretchName || this.stretch.name
    }

    this.togglePause = function(){
        this.isPaused = !this.isPaused
        this.timer.setPaused(this.isPaused)
    }

    this.cancel = function(){
        this.cancelled = true
        this.timer.cancel()
    }

    this.isCancelled = function(){
        return this.cancelled
    }

    this.getCurrentSet = function(){
        return this.currentSet
    }

    this.setCurrentSet = function (set){
        this.currentSet = set
    }

    this.getStretch = function(){
        return this.stretch
    }

    this.getSets = function(){
        return this.sets
    }

    this.getCurrentTime = function(){
        return this.currentTime
    }
}