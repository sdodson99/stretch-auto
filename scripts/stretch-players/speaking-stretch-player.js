function SpeakingStretchPlayer(stretchPlayer){
    this.stretchPlayer = stretchPlayer
    this.speaker = new Speaker()

    this.play = async function(){

        for (let currentSet = 1; currentSet <= this.getSets(); currentSet++) {
            if(this.isCancelled()) break            

            this.setCurrentSet(currentSet)

            this.getStretch().isUnilateral ? 
                await this.playUnilateral() :
                await this.playBilateral()
            
            if(!this.isCancelled() && this.getCurrentSet() != this.getSets()){
                this.speaker.speakAsync("Relax.")
                await this.stretchPlayer.wait(5)
                await this.speakNextSet()
            }
        }

        await this.speakFinished()
    }

    this.playBilateral = async function(){
        this.onChange(this)

        if(this.getCurrentSet() == 1){
            await this.speakName(this.getStretch())
            await this.speakInstructions(this.getStretch())
        }

        await this.stretchPlayer.waitForDuration()
    }

    this.playUnilateral = async function(){
        await this.playLeftSide()
        if(this.isCancelled()) return
        await this.playRightSide()
    }

    this.playLeftSide = async function(){
        this.stretchPlayer.setNameOneSide(true)
        this.onChange(this)

        if(this.getCurrentSet() == 1){
            await this.speakName(this.getStretch())
            await this.speakInstructions(this.getStretch())
        }

        await this.stretchPlayer.waitForDuration()
        this.stretchPlayer.resetOriginalName()
    }

    this.playRightSide = async function(){
        this.stretchPlayer.setNameOneSide(false)
        this.onChange(this)
        await this.speakSwitch()
        await this.stretchPlayer.waitForDuration()
        this.stretchPlayer.resetOriginalName()
    }

    this.speakName = async function(stretch){
        if(this.isCancelled()) return
        await this.speaker.speakAsync(stretch.name)
    }

    this.speakInstructions = async function(stretch){
        let instructions = stretch.instructions

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i]

            if(this.isCancelled()) return
            await this.speaker.speakAsync(instruction.order + ".")

            if(this.isCancelled()) return
            await this.speaker.speakAsync(instruction.content)
        }
    }

    this.speakSwitch = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Switch sides.")
    }

    this.speakNextSet = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Start next set.")
    }

    this.speakFinished = async function(){
        if(this.isCancelled()) return
        await this.speaker.speakAsync("Stretching completed.")
    }

    this.togglePause = function(){
        this.stretchPlayer.togglePause()
        this.speaker.togglePause()
    }

    this.cancel = function(){
        this.stretchPlayer.cancel()
        this.speaker.cancel()
    }

    this.isCancelled = function(){
        return this.stretchPlayer.isCancelled()
    }

    this.getCurrentSet = function(){
        return this.stretchPlayer.currentSet
    }

    this.setCurrentSet = function (set){
        this.stretchPlayer.currentSet = set
    }

    this.getStretch = function(){
        return this.stretchPlayer.stretch
    }

    this.getSets = function(){
        return this.stretchPlayer.sets
    }

    this.getCurrentTime = function(){
        return this.stretchPlayer.currentTime
    }

    this.onChange = function(sender){
        this.stretchPlayer.onChange(sender)
    }
}