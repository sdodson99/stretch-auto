function Speaker(){
    this.synth = window.speechSynthesis

    this.speakAsync = async function(content){
        return new Promise((resolve) => {
            let utterance = new SpeechSynthesisUtterance(content)
            utterance.onend = resolve
            this.synth.speak(utterance)
        })
    }

    this.setPaused = function(paused){
        paused ? this.synth.pause() : this.synth.resume()
    }

    this.cancel = function(){
        this.synth.cancel()
    }
}