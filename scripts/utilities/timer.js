//TODO: Pass in cancellation/pause token to waitForDuration?

function Timer(onTimeChange){
    this.onTimeChange = onTimeChange
    this.cancelled = false
    this.paused = false

    this.waitForDuration = async function(duration){
        this.cancelled = false
        this.paused = false

        for (let time = duration; time >= 1; time--) {
            if(this.isCancelled()) return

            this.onTimeChange(time)

            await this.wait(1)

            while(this.isPaused()){
                await this.wait(1)
            }
        }
    }

    this.wait = function(timeInSeconds){
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeInSeconds * 1000)
        })
    }

    this.setPaused = function(paused){
        this.paused = paused
    }

    this.isPaused = function(){
        return this.paused
    }

    this.cancel = function(){
        this.cancelled = true
    }

    this.isCancelled = function(){
        return this.cancelled
    }
}