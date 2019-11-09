function StretchPlayerFactory(unilateralMode){
    this.unilateralMode = unilateralMode

    this.createStretchPlayer = function(stretch, duration, onStretchChange, onTimeChange){
        let stretchPlayer = new StretchPlayer(duration, onTimeChange)
        
        if(this.unilateralMode && stretch.isUnilateral){
            stretchPlayer = new UnilateralStretchPlayer(stretchPlayer, stretch, onStretchChange)
        }

        return stretchPlayer
    }
}