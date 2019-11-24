require('babel-polyfill')
require('../../styles/sass/routine.scss')

const authenticate = require('../authenticate')
const Navigator = require('./navigators/routine-navigator')
const DisplayType = require('./navigators/routine-display-type')

authenticate().then((user) => {
    if(!user){
        window.location.href = "login.html"        
    }
})

let navigator = new Navigator()
navigator.show(DisplayType.LIST)