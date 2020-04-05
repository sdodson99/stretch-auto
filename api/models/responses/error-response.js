function ErrorResponse(code, message){
    this.success = false
    this.error = {
        code: code,
        message: message
    }
}

module.exports = ErrorResponse