const apiClient = new AuthenticationApiClient(new ApiAuthenticationService(authenticationApiUrl))
const accountService = new ApiAccountService(accountApiUrl, apiClient)

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