function ApiStretchService(url){
    this.url = url

    this.getAll = async function(){
        return await this.fetchStretches()
    }

    this.getMaxAmount = async function(amount){
        return await this.fetchStretches(`/?maxAmount=${amount}`)
    }

    this.fetchStretches = async function(params = ""){
        let fetchResult = await fetch(this.url + params)

        let stretchResult = await fetchResult.json()
        let stretches = stretchResult.content || []

        stretches.forEach((stretch) => {
            if(stretch.instructions){
                stretch.instructions.sort((a, b) => a.order > b.order)
            }
        })

        return stretches
    }
}

module.exports = ApiStretchService