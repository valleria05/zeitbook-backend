class ValidationError extends Error {
    constructor(m) {
        super(m);
    }
}

module.exports = ValidationError;
