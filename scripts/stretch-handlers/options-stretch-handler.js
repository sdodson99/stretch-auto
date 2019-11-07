function OptionsStretchHandler(stretchHandler, options){
    this.stretchHandler = stretchHandler
    this.options = options

    this.onStretchChange = async function(stretch){
        if(this.options.unilateralMode && stretch.isUnilateral && !(stretch.name.startsWith("Left") || stretch.name.startsWith("Right")))
            return
        
        await stretchHandler.onStretchChange(stretch)
    }

    this.onSetChange = async function(set){   
        await stretchHandler.onSetChange(set)
    }

    this.onTimeChange = async function(time){
        await stretchHandler.onTimeChange(time)
    }

    this.onFinish = async function(){
        await stretchHandler.onFinish()
    }

    this.onCancel = async function(){
        await stretchHandler.onCancel()
    }

    this.onSetPaused = async function(paused){
        await stretchHandler.onSetPaused(paused)
    }
}