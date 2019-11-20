const AuthenticationApiClient = require('./utilities/authentication-api-client')
const ApiAuthenticationService = require('./services/api-authentication-service')
const Constants = require('./utilities/constants')
const ApiAccountService = require('./services/api-account-service')

function authenticate(){
    const apiClient = new AuthenticationApiClient(new ApiAuthenticationService(Constants.authenticationApiUrl))
    const accountService = new ApiAccountService(Constants.accountApiUrl, apiClient)
    
    accountService.getAccountInfo().then((account) => {
    
        if(account.success){
            document.querySelectorAll('.auth').forEach((e) => {
                e.style.display = "block"
            })
        } else {
            document.querySelectorAll('.not-auth').forEach((e) => {
                e.style.display = "block"
            })
        }
    })
}

module.exports = authenticate