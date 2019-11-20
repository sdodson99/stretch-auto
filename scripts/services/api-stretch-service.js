function ApiStretchService(url){
    this.url = url

    this.getStretches = async function(amount){
        let fetchResult = await fetch(this.url + `/?maxAmount=${amount}`)
        let stretches = await fetchResult.json()

        stretches.forEach((stretch) => {
            stretch.name = stretch.name + " Stretch"
            if(stretch.instructions){
                stretch.instructions.sort((a, b) => a.order > b.order)
            }
        })

        return stretches
    }
}

module.exports = ApiStretchService