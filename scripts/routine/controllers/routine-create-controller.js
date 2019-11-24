const DisplayType = require('../navigators/routine-display-type')

function RoutineCreateController(view, navigator, routineService, stretchService){
    this.view = view
    this.navigator = navigator
    this.routineService = routineService
    this.stretchService = stretchService

    this.view.addListButtonHandler(() => {
        this.navigator.show(DisplayType.LIST)
    })

    this.view.addStretchAddButtonHandler(async () => {

        if(!this.stretches){
            this.stretches = await this.stretchService.getAll()
        }

        this.view.addStretch(this.stretches)
    })

    this.view.addCreateButtonHandler(async () => {
        let routineName = this.view.getRoutineName()
        let routineStretches = this.view.getRoutineStretches()
        let routine = {
            name: routineName,
            stretches: routineStretches
        }

        let createdRoutine = await this.routineService.create(routine)
        
        if(createdRoutine){
            this.navigator.show(DisplayType.LIST)
        }
    })
}

module.exports = RoutineCreateController