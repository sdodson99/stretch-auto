function Speaker(){
    this.synth = window.speechSynthesis

    this.speakAsync = async function(content){
        return new Promise((resolve) => {
            let utterance = new SpeechSynthesisUtterance(content)
            utterance.onend = resolve
            this.synth.speak(utterance)
        })
    }

    this.togglePause = function(){
        this.synth.paused ? this.synth.resume() : this.synth.pause()
    }

    this.cancel = function(){
        this.synth.cancel()
    }
}