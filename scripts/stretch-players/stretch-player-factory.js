function StretchPlayerFactory(unilateralMode){
    this.unilateralMode = unilateralMode

    this.createStretchPlayer = function(stretch, sets, duration, onStretchChange, onSetChange, onTimeChange){
        let stretchPlayer = new StretchPlayer(duration, onTimeChange)
        
        if(this.unilateralMode && stretch.isUnilateral){
            stretchPlayer = new UnilateralStretchPlayer(stretchPlayer, stretch, onStretchChange)
        }

        return new StretchSetPlayer(stretchPlayer, sets, onSetChange)
    }
}