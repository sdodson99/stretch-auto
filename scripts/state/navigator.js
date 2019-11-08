const DisplayType = {
    SETUP: "Setup",
    STRETCH: "Stretch",
    DONE: "Done"
}

function Navigator(){

    this.displayStretchSetup = document.querySelector("#stretch-setup")
    this.displayStretch = document.querySelector("#stretch")
    this.displays = document.querySelectorAll(".stretch-content")

    //Hide all displays except for specified display
    this.show = function(displayType){

        this.displays.forEach((d) => {
            d.style.display = "none"
        })

        switch (displayType) {
            case DisplayType.SETUP:
                this.displayStretchSetup.style.display = ""
                break;
            case DisplayType.STRETCH:
                this.displayStretch.style.display = ""
                break;
            case DisplayType.DONE:
                this.displayStretchSetup.style.display = ""
            default:
                break;
        }
    }
}