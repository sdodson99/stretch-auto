function OptionsStretchHandler(stretchHandler, options){
    this.stretchHandler = stretchHandler
    this.options = options

    this.onStretchChange = async function(sender, stretch){
        if(this.options.unilateralMode && stretch.isUnilateral && !(stretch.name.startsWith("Left") || stretch.name.startsWith("Right")))
            return
        
        await stretchHandler.onStretchChange(sender, stretch)
    }

    this.onSetChange = async function(sender, set){   
        await stretchHandler.onSetChange(sender, set)
    }

    this.onTimeChange = async function(sender, time){
        await stretchHandler.onTimeChange(sender, time)
    }

    this.onFinish = async function(sender){
        await stretchHandler.onFinish(sender)
    }

    this.onCancel = async function(sender){
        await stretchHandler.onCancel(sender)
    }

    this.onSetPaused = async function(sender, paused){
        await stretchHandler.onSetPaused(sender, paused)
    }
}