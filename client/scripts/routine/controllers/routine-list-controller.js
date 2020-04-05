const DisplayType = require('../navigators/routine-display-type')

function RoutineListController(view, navigator, routineService){
    this.view = view
    this.navigator = navigator
    this.routineService = routineService

    this.view.reset()
    this.view.setListCaption("Loading routines...")

    this.view.addCreateButtonHandler(() => {
        this.navigator.show(DisplayType.CREATE)
    })

    this.routineService.getAll().then((routines) => {
        routines.forEach(r => {
            this.view.addRoutine(r._id, r.name, () => {
                this.navigator.previewRoutine(r)
            }, () => {
                this.routineService.delete(r._id)
            })
        })

        if(routines.length == 0){
            this.view.setListCaption("You have no routines saved.")
        } else {
            this.view.setListCaption("")
        }
    })
}

module.exports = RoutineListController