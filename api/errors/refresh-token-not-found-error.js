class RefreshTokenNotFoundError extends Error{
    constructor(message) {
        super(message)
    }
}

module.exports = RefreshTokenNotFoundError