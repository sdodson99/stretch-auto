function ApiAuthenticationService(url){
    this.url = url

    this.login = async function(email, password){
        let response = {
            success: false
        }

        let body = JSON.stringify({
                email: email,
                password: password
        })

        let loginResult = await fetch(this.url + "/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })

        let loginResponse = await loginResult.json()

        if(loginResponse.accessToken && loginResponse.refreshToken){
            response.success = true
            response.content = loginResponse
        } else {
            response.errorMessage = loginResponse.errorMessage
        }

        return response
    }

    this.refresh = async function(refreshToken){
        let response = {
            success: false
        }
        
        let refreshResult = await fetch(this.url + "/refresh", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refreshToken: refreshToken})
        })

        let refreshResponse = await refreshResult.json()

        if(refreshResponse.accessToken){
            response.success = true
            response.content = refreshResponse
        } else {
            response.errorMessage = refreshResponse.errorMessage
        }

        return response
    }

    this.logout = async function(refreshToken){

        let logoutResult = await fetch(this.url + "/logout", {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refreshToken: refreshToken})
        })

        return logoutResult.ok
    }
}

module.exports = ApiAuthenticationService