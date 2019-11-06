function PlayableStretchRoutine(routine, onStretchChange, onSetChange, onTimeChange, onFinish){
    this.stretches = routine.stretches
    this.sets = routine.sets
    this.duration = routine.duration

    this.onTimeChange = onTimeChange
    this.onStretchChange = onStretchChange
    this.onSetChange = onSetChange
    this.onFinish = onFinish

    this.start = async function(){
        for (let i = 0; i < this.stretches.length; i++) {
            const currentStretch = this.stretches[i]

            this.onStretchChange(currentStretch)
            this.currentPlayer = this.createStretchPlayer(currentStretch)

            await this.currentPlayer.start()
        }

        this.onFinish()
    }

    this.createStretchPlayer = function(stretch){
        let baseStretchPlayer = new StretchPlayer(this.duration, this.onTimeChange)
        let unilateralStretchPlayer = new UnilateralStretchPlayer(baseStretchPlayer, stretch, this.onStretchChange)

        return new StretchSetPlayer(unilateralStretchPlayer, 2, this.onSetChange)
    }
}