//TODO: Pass in cancellation/pause token to waitForDuration?

function Timer(onTimeChange){
    this.onTimeChange = onTimeChange
    this.cancelled = false
    this.paused = false
    this.tickRate = 10

    this.waitForDuration = async function(duration){
        this.cancelled = false
        this.paused = false

        for (let time = duration; time >= 1; time--) {
            if(this.isCancelled()) return

            await this.onTimeChange(time)

            for (let ms = 0; ms < this.tickRate; ms++) {
                if(this.isCancelled()) return

                await this.wait(1 / this.tickRate)                
            }

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

module.exports = Timer