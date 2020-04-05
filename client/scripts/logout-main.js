require('babel-polyfill')
require('../styles/sass/_common.scss')

const authenticate = require('./authenticate')
const ApiAuthenticationService = require('./services/api-authentication-service')
const Constants = require('./utilities/constants')

authenticate()

const authenticationService = new ApiAuthenticationService(Constants.authenticationApiUrl)

authenticationService.logout(localStorage.getItem("refreshToken")).then((success) => {

    if(success){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "login.html"
    }
})