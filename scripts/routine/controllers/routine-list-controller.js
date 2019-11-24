const DisplayType = require('../navigators/routine-display-type')

function RoutineListController(view, navigator, routineService){
    this.view = view
    this.navigator = navigator
    this.routineService = routineService

    this.initialize = async function(){
        this.view.reset()
        this.view.setListCaption("Loading routines...")
    
        this.view.addCreateButtonHandler(() => {
            this.navigator.show(DisplayType.CREATE)
        })
    
        let routines = await this.routineService.getAll()
        routines.forEach(r => {
            this.view.addRoutine(r._id, r.name, (id) => {

            }, (id) => {
                this.routineService.delete(id)
            })
        })

        if(routines.length == 0){
            this.view.setListCaption("You have no routines saved.")
        } else {
            this.view.setListCaption("")
        }
    }
}

module.exports = RoutineListController