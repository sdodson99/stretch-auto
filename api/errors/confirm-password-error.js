class ConfirmPasswordError extends Error {
    constructor(message)  {
        super(message)
    }
}

module.exports = ConfirmPasswordError