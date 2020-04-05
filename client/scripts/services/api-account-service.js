function ApiAccountService(url, client){
    this.url = url
    this.client = client

    this.getAccountInfo = async function(){

        const accountResponse = await client.makeRequest(this.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('accessToken')
            },
        })

        return accountResponse.content
    }
}

module.exports = ApiAccountService