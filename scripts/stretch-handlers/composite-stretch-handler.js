function CompositeStretchHandler(...handlers){
    this.handlers = handlers

    this.addHandler = function(handler){
        this.handlers.push(handler)
    }

    this.onStretchChange = async function(stretch){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onStretchChange(stretch)
        }    
    }

    this.onSetChange = async function(set){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onSetChange(set)
        }      
    }

    this.onTimeChange = async function(time){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onTimeChange(time)
        } 
    }

    this.onFinish = async function(){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onFinish()
        } 
    }

    this.onCancel = async function(){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onCancel()
        } 
    }

    this.onSetPaused = async function(paused){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onSetPaused(paused)
        } 
    }
}