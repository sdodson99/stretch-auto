function CompositeStretchHandler(...handlers){
    this.handlers = handlers

    this.addHandler = function(handler){
        this.handlers.push(handler)
    }

    this.onStretchChange = async function(sender, stretch){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onStretchChange(sender, stretch)
        }    
    }

    this.onSetChange = async function(sender, set){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onSetChange(sender, set)
        }      
    }

    this.onTimeChange = async function(sender, time){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onTimeChange(sender, time)
        } 
    }

    this.onFinish = async function(sender){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onFinish(sender)
        } 
    }

    this.onCancel = async function(sender){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onCancel(sender)
        } 
    }

    this.onSetPaused = async function(sender, paused){
        for (let i = 0; i < this.handlers.length; i++) {
            await this.handlers[i].onSetPaused(sender, paused)
        } 
    }
}