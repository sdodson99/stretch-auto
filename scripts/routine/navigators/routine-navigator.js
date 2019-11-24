const DisplayType = require('./routine-display-type')
const StretchHandlerFactory = require('../../models/stretch-handlers/stretch-handler-factory')
const RoutineListView = require('../views/routine-list-view')
const RoutineListController = require('../controllers/routine-list-controller')
const RoutineCreateView = require('../views/routine-create-view')
const RoutineCreateController = require('../controllers/routine-create-controller')
const RoutinePlayView = require('../../quick-start/views/stretch-routine-view')
const RoutinePlayController = require('../../quick-start/controllers/stretch-routine-controller')
const StretchService = require('../../services/api-stretch-service')
const RoutineService = require('../../services/api-routine-service')
const RefreshService = require('../../services/api-authentication-service')
const ApiClient = require('../../utilities/authentication-api-client')
const Constants = require('../../utilities/constants')

function RoutineNavigator(){

    this.root = document.querySelector('#main')
    this.views = document.querySelectorAll('.routine-content')
    this.listView = document.querySelector('#routine-list')
    this.createView = document.querySelector('#routine-create')
    this.stretchHandlerFactory = new StretchHandlerFactory()
    this.stretchService = new StretchService(Constants.stretchApiUrl)
    this.routineService = new RoutineService(Constants.routineApiUrl, new ApiClient(new RefreshService(Constants.authenticationApiUrl)))
    this.routineCreateView = new RoutineCreateView()
    this.routineListView = new RoutineListView()
    this.routinePlayView = new RoutinePlayView()

    this.show = function(displayType){

        switch(displayType){
            case DisplayType.LIST:
                this.routineListView.draw(this.root)
                this.currentController = new RoutineListController(this.routineListView, this, this.routineService)
                break
            case DisplayType.CREATE:
                this.routineCreateView.draw(this.root)
                this.currentController = new RoutineCreateController(this.routineCreateView, this, this.routineService, this.stretchService)
                break
            case DisplayType.PLAY:
                this.routinePlayView.draw(this.root)
                break
        }
    }

    this.playRoutine = function(routine){
        this.show(DisplayType.PLAY)
        let stretchHandler = this.stretchHandlerFactory.createStretchHandler({})
        this.currentController = new RoutinePlayController(routine, this.routinePlayView, stretchHandler, {}, () => this.show(DisplayType.LIST))
    }
}

module.exports = RoutineNavigator