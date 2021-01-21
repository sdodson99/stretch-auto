function ErrorResponse(code, message){
    this.error = {
        code: code,
        message: message
    }
}

module.exports = ErrorResponse