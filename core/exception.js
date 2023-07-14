class DataNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class UserDataNotFoundException extends DataNotFoundException {
    constructor(resource) {
        super(`${resource} not found.`);
    }
}

module.exports = {
    DataNotFoundException,
    UserDataNotFoundException
};