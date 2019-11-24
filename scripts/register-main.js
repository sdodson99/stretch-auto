require('babel-polyfill')
require('../styles/sass/register.scss')

const ApiAuthenticationService = require('./services/api-authentication-service')
const Constants = require('./utilities/constants')
const authenticate = require('./authenticate')

authenticate()

const emailInput = document.querySelector('#register-email')
const usernameInput = document.querySelector('#register-username')
const passwordInput = document.querySelector('#register-password')
const confirmPasswordInput = document.querySelector('#register-confirm-password')
const registerButton = document.querySelector('#register-submit')
const errorLabel = document.querySelector('#register-error')

const authenticationService = new ApiAuthenticationService(Constants.authenticationApiUrl)

async function register(){
    const registerResponse = await authenticationService.register(emailInput.value, usernameInput.value, 
        passwordInput.value, confirmPasswordInput.value)

    if(registerResponse.success){
        window.location.href = 'login.html'
    } else {
        errorLabel.innerText = registerResponse.error
    }
}

registerButton.addEventListener('click', register);