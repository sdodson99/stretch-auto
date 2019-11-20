require('babel-polyfill')
const authenticate = require('./authenticate')
const Navigator = require('./navigators/stretch-navigator')

authenticate()
const navigator = new Navigator()
navigator.showSetup()

