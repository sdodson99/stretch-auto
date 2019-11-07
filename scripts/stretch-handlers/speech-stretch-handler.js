function SpeechStretchHandler(speakTime){
    this.speaker = new Speaker()
    this.speakTime = speakTime

    this.onStretchChange = async function(stretch){
        await this.speaker.speakAsync(stretch.name)     
        
        // for (let i = 0; i < stretch.instructions.length; i++) {
        //     const instruction = stretch.instructions[i]

        //     await speaker.speakAsync(instruction.order)        
        //     await speaker.speakAsync(instruction.content)        
        // }
    }

    this.onSetChange = async function(set){      
    }

    this.onTimeChange = async function(time){
        if(this.speakTime)
            await this.speaker.speakAsync(time)
    }

    this.onFinish = async function(){
        await this.speaker.speakAsync("all done")
    }

    this.onCancel = async function(){
        this.cancelled = true
        await this.speaker.cancel()
    }

    this.onSetPaused = async function(paused){
        await this.speaker.setPaused(paused)
    }
}