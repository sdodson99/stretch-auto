const StretchPlayer = require('./stretch-player')
const UnilateralStretchPlayer = require('./unilateral-stretch-player')

function StretchPlayerFactory(unilateralMode){
    this.unilateralMode = unilateralMode

    this.createStretchPlayer = function(playableStretch, onStretchChange, onTimeChange){
        let stretchPlayer = new StretchPlayer(playableStretch.duration, onTimeChange)
        
        if(this.unilateralMode && playableStretch.stretch.isUnilateral){
            stretchPlayer = new UnilateralStretchPlayer(stretchPlayer, playableStretch, onStretchChange)
        }

        return stretchPlayer
    }
}

module.exports = StretchPlayerFactory