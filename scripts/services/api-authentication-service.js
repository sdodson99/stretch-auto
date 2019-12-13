function ApiAuthenticationService(url){
    this.url = url

    this.login = async function(email, password){
        let response = {
            success: false
        }

        let loginResult = await fetch(this.url + "/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        let loginResponse = await loginResult.json()

        if(loginResponse.content){
            response.success = true
            response.content = loginResponse.content
        } else {
            response.errorMessage = loginResponse.error.message
        }

        return response
    }

    this.register = async function(email, username, password, confirmPassword){
        let response = {
            success: false
        }

        let registerResult = await fetch(this.url + "/register", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                confirmPassword: confirmPassword
            })
        })

        let registerResponse = await registerResult.json()

        if(registerResponse.success){
            response.success = true
        } else {
            registerResponse.success = false
            registerResponse.error = registerResponse.error.message
        }

        return registerResponse
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

        if(refreshResponse.content){
            response.success = true
            response.content = refreshResponse.content
        } else {
            response.errorMessage = refreshResponse.error.message
        }

        return response
    }

    this.logout = async function(refreshToken){

        let logoutResult = await fetch(this.url + "/logout", {
            method: 'POST',
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