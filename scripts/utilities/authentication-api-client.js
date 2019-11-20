function AuthenticationApiClient(refreshService){

    this.refreshService = refreshService

    this.makeRequest = async function(url, request){

        response = await this.makeAuthenticatedRequest(url, request)

        if(response.error && response.error.code == 1){
            let refreshResponse = await this.refreshService.refresh(localStorage.getItem('refreshToken'))

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

            return {
                success: result.ok,
                content: response
            }
        } catch (error) {
            return {
                success: false,
                errorCode: result.status,
                errorMessage: result.statusText
            }
        }
    }
}