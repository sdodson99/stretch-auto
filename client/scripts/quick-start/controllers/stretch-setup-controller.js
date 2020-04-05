function StretchSetupController(view, navigator, stretchService){

    this.view = view
    this.navigator = navigator
    this.stretchService = stretchService

    this.onStart = async function(){
        
        let amount = this.view.getAmount()
        let maxSets = this.view.getMaxSets()
        let duration = this.view.getDuration()
        let options = {
            narrate: this.view.isNarrate(),
            narrateInstructions: this.view.isNarrateInstructions(),
            unilateralMode: true
        }

        let stretches = await this.stretchService.getMaxAmount(amount)
        let playableStretches = []

        stretches.forEach((s) => {
            s.name += " Stretch"
            playableStretches.push({
                sets: maxSets,
                duration: duration,
                stretch: s
            })
        })

        let routine = {
            name: "Quick Start",
            stretches: playableStretches
        }
        
        this.navigator.playRoutine(routine, options)
    }

    this.view.addStartHandler(() => this.onStart())
}

module.exports = StretchSetupController