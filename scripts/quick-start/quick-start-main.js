require('babel-polyfill')
require('../utilities/modernizr')
require('../../styles/sass/quick-start.scss')

const authenticate = require('../authenticate')
const Navigator = require('./navigators/stretch-navigator')

authenticate()

const navigator = new Navigator()
navigator.showSetup()

