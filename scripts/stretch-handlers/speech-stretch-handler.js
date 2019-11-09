function SpeechStretchHandler(speakTime, speakInstructions){
    this.speaker = new Speaker()
    this.speakTime = speakTime
    this.speakInstructions = speakInstructions

    this.onStretchChange = async function(sender, stretch){
        if(stretch.isUnilateral){
            await this.speakStretch(stretch, sender.currentSet)
        }
    }

    this.onSetChange = async function(sender, set){
        if(!sender.currentStretch.isUnilateral){
            await this.speakStretch(sender.currentStretch, set)
        }
    }

    this.speakStretch = async function(stretch, set){
        if(set > 1 || stretch.name.startsWith("Right")){
            stretch.isUnilateral ? await this.speaker.speakAsync("switch sides") : await this.speaker.speakAsync("repeat")
        } else {
            await this.speaker.speakAsync(stretch.name)     
            
            if(this.speakInstructions){
                for (let i = 0; i < stretch.instructions.length; i++) {
                    if(this.cancelled) return
                    const instruction = stretch.instructions[i]

                    await this.speaker.speakAsync(instruction.order)    
                    if(this.cancelled) return
                    await this.speaker.speakAsync(instruction.content)        
                }
            }
        }
    }

    this.onTimeChange = async function(sender, time){
        if(this.speakTime)
            await this.speaker.speakAsync(time)
    }

    this.onFinish = async function(sender){
        await this.speaker.speakAsync("finished")
    }

    this.onCancel = async function(sender){
        this.cancelled = true
        await this.speaker.cancel()
    }

    this.onSetPaused = async function(sender, paused){
        await this.speaker.setPaused(paused)
    }
}