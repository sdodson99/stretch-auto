const AuthenticationApiClient = require('./utilities/authentication-api-client')
const ApiAuthenticationService = require('./services/api-authentication-service')
const Constants = require('./utilities/constants')
const ApiAccountService = require('./services/api-account-service')

async function authenticate(){
    const apiClient = new AuthenticationApiClient(new ApiAuthenticationService(Constants.authenticationApiUrl))
    const accountService = new ApiAccountService(Constants.accountApiUrl, apiClient)
    
    let account = await accountService.getAccountInfo()

    document.querySelectorAll('.auth').forEach((e) => {
        e.style.display = account ? "flex" : "none"
    })

    document.querySelectorAll('.not-auth').forEach((e) => {
        e.style.display = account ? "none" : "flex"
    })

    return account
}

module.exports = authenticate