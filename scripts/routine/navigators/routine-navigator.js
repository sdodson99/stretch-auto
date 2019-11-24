const DisplayType = require('./routine-display-type')
const RoutineListView = require('../views/routine-list-view')
const RoutineListController = require('../controllers/routine-list-controller')
const RoutineCreateView = require('../views/routine-create-view')
const RoutineCreateController = require('../controllers/routine-create-controller')
const StretchService = require('../../services/api-stretch-service')
const RoutineService = require('../../services/api-routine-service')
const RefreshService = require('../../services/api-authentication-service')
const ApiClient = require('../../utilities/authentication-api-client')
const Constants = require('../../utilities/constants')

function RoutineNavigator(){

    this.views = document.querySelectorAll('.routine-content')
    this.listView = document.querySelector('#routine-list')
    this.createView = document.querySelector('#routine-create')
    this.stretchService = new StretchService(Constants.stretchApiUrl)
    this.routineService = new RoutineService(Constants.routineApiUrl, new ApiClient(new RefreshService(Constants.authenticationApiUrl)))
    this.routineCreateView = new RoutineCreateView()
    this.routineListView = new RoutineListView()
    this.routineListController = new RoutineListController(this.routineListView, this, this.routineService)
    this.routineCreateController = new RoutineCreateController(this.routineCreateView, this, this.routineService, this.stretchService)

    this.show = function(displayType){
        this.views.forEach(v => {
            v.style.display = 'none'
        });

        switch(displayType){
            case DisplayType.LIST:
                this.currentController = this.routineListController
                this.routineListController.initialize()
                this.listView.style.display = 'flex'
                break
            case DisplayType.CREATE:
                this.currentController = this.routineCreateController
                this.routineCreateView.reset()
                this.createView.style.display = 'flex'
                break
        }
    }

}

module.exports = RoutineNavigator