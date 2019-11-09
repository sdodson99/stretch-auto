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
            unilateralMode: false
        }
        
        let routine = new StretchRoutine(await this.stretchService.getStretches(amount), maxSets, duration)
        this.navigator.playRoutine(routine, options)
    }

    this.view.addStartHandler(() => this.onStart())
}