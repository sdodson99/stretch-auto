require('babel-polyfill')
require('../styles/sass/login.scss')

const ApiAuthenticationService = require('./services/api-authentication-service')
const Constants = require('./utilities/constants')
const authenticate = require('./authenticate')

const emailInput = document.querySelector('#login-email')
const passwordInput = document.querySelector('#login-password')
const loginButton = document.querySelector('#login-submit')
const errorLabel = document.querySelector('#login-error')

authenticate()

const authenticationService = new ApiAuthenticationService(Constants.authenticationApiUrl)

async function login(){
    let response = await authenticationService.login(emailInput.value, passwordInput.value)

    if(response.success){
        localStorage.setItem('accessToken', response.content.accessToken)
        localStorage.setItem('refreshToken', response.content.refreshToken)
        
        window.location.href = 'index.html'
    } else {
        errorLabel.textContent = response.errorMessage
    }
}

loginButton.addEventListener('click', login)
