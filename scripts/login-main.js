const emailInput = document.querySelector('#login-email')
const passwordInput = document.querySelector('#login-password')
const loginButton = document.querySelector('#login-submit')
const registerButton = document.querySelector('#login-register')
const errorLabel = document.querySelector('#login-error')

const authenticationService = new ApiAuthenticationService(authenticationApiUrl)

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
