function MockStretchService(){
    this.getStretches = function(amount){
        return [
            {
                name: "Test",
                isUnilateral: true,
                instructions : [
                {
                    order: 1,
                    content: "Try as hard as possible."
                }
                ]
            }
        ]
    }
}