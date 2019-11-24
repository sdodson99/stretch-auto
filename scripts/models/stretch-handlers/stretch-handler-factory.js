const CompositeStretchHandler = require('./composite-stretch-handler')
const SpeechStretchHandler = require('./speech-stretch-handler')
const WaitStretchHandler = require('./wait-stretch-handler')
const UnilateralStretchHandler = require('./unilateral-stretch-handler')

function StretchHandlerFactory(){

    this.createStretchHandler = function(options){
        let handler = new CompositeStretchHandler()

        if(options.narrate){
            handler.addHandler(new SpeechStretchHandler(false, options.narrateInstructions, options.unilateralMode))
        }

        if(options.wait){
            handler.addHandler(new WaitStretchHandler(3))
        }
        
        //if(options.unilateralMode){
            handler = new UnilateralStretchHandler(handler)
        //}
    
        return handler
    }
}

module.exports = StretchHandlerFactory