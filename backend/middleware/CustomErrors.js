class ExistingUserError extends Error {
    constructor(message) {
      super(message);
      this.message = "User already exists";
    }
}

class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.message = "Page not found, sowgy >.< ";
    }
}

class NoUserFound extends Error {
  constructor(message) {
    super(message);
    this.message = "User not found, sowgy >.< ";
  }
}


module.exports = {ExistingUserError, NotFoundError, NoUserFound }
