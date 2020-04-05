const DisplayType = require('../navigators/routine-display-type')

function RoutinePreviewController(routine, view, navigator){
    this.routine = routine
    this.view = view
    this.navigator = navigator

    this.view.addListButtonHandler(() => {
        navigator.show(DisplayType.LIST)
    })

    this.view.addStartButtonHandler(() => {
        let options = {
            unilateralMode: true,
            narrate: this.view.isNarrate(),
            narrateInstructions: this.view.isNarrateInstructions()
        }

        navigator.playRoutine(this.routine, options)
    })

    this.routine.stretches.forEach(s => {
        this.view.addStretch(`${s.stretch.name} (${s.sets} set(s) of ${s.duration}s)`)
    });
}

module.exports = RoutinePreviewController