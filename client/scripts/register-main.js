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
const registerForm = document.querySelector('form')

const authenticationService = new ApiAuthenticationService(Constants.authenticationApiUrl)

passwordInput.addEventListener('input', () => passwordMatch(passwordInput))
confirmPasswordInput.addEventListener('input', () => passwordMatch(confirmPasswordInput))

function passwordMatch(sender){
    if(passwordInput.value != confirmPasswordInput.value){
        sender.setCustomValidity("Password and Confirm Password must match.")
    } else {
        sender.setCustomValidity("")
    }
}

async function register(){
    registerForm.reportValidity()

    if(grecaptcha.getResponse())
    {
        if(registerForm.checkValidity()){
            const registerResponse = await authenticationService.register(emailInput.value, usernameInput.value, 
                passwordInput.value, confirmPasswordInput.value)
        
            if(registerResponse.success){
                window.location.href = 'login.html'
            } else {
                errorLabel.innerText = registerResponse.error
            }
        }
    }
}

registerButton.addEventListener('click', register);