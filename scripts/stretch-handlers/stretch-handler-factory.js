function StretchHandlerFactory(){

    this.createStretchHandler = function(options){
        let compositeHandler = new CompositeStretchHandler()

        if(options.narrate){
            compositeHandler.addHandler(new SpeechStretchHandler(false))
        }
    
        return new OptionsStretchHandler(compositeHandler, options)
    }
}