function StretchHandlerFactory(){

    this.createStretchHandler = function(options){
        let handler = new CompositeStretchHandler()

        if(options.narrate){
            handler.addHandler(new SpeechStretchHandler(false, options.narrateInstructions, options.unilateralMode))
        }

        if(options.wait){
            handler.addHandler(new WaitStretchHandler(3))
        }
        
        if(options.unilateralMode){
            handler = new UnilateralStretchHandler(handler)
        }
    
        return handler
    }
}