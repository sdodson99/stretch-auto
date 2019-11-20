function AuthenticationApiClient(refreshService){
    this.refreshService = refreshService

    this.makeRequest = async function(url, request){

        //Try making request.
        response = await this.makeAuthenticatedRequest(url, request)

        //If request error code is token expired.
        if(response.error && response.error.code == 1){

            //Refresh the token.
            let refreshResponse = await this.refreshService.refresh(localStorage.getItem('refreshToken'))

            //If successful refresh, set new access token and retry the request.
            if(refreshResponse.success){
                localStorage.setItem('accessToken', refreshResponse.content.accessToken)
                response = await this.makeAuthenticatedRequest(url, request)
            }
        }

        return response
    }

    this.makeAuthenticatedRequest = async function(url, request){
        request.headers.Authorization = 'bearer ' + localStorage.getItem('accessToken')
        const result = await fetch(url, request)

        try {
            let response = await result.json()
            response.success = result.ok
            
            return response
        } catch (error) {
            return {
                success: false,
                error: {
                    code: result.status,
                    message: result.statusText
                }
            }
        }
    }
}

module.exports = AuthenticationApiClient