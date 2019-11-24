function ApiRoutineService(url, client){
    this.url = url
    this.client = client

    this.getAll = async function(){
        const routineResponse = await client.makeRequest(this.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        return routineResponse.content
    }

    this.getById = async function(id){
        const routineResponse = await client.makeRequest(this.url + `/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        return routineResponse.content
    }

    this.create = async function(routine){
        const routineResponse = await client.makeRequest(this.url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routine)
        })

        return routineResponse.content
    }

    this.delete = async function(id){
        const routineResponse = await client.makeRequest(this.url + `/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return routineResponse.success
    }
}

module.exports = ApiRoutineService