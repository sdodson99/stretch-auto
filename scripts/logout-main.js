const authenticationService = new ApiAuthenticationService(authenticationApiUrl)

authenticationService.logout(localStorage.getItem("refreshToken")).then((success) => {

    if(success){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "login.html"
    }
})