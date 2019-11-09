function StretchHandlerFactory(){

    this.createStretchHandler = function(options){
        let handler = new CompositeStretchHandler()

        if(options.narrate){
            handler.addHandler(new SpeechStretchHandler(false, options.narrateInstructions))
        }

        if(options.unilateralMode){
            handler = new OptionsStretchHandler(handler, options)
        }
    
        return handler
    }
}