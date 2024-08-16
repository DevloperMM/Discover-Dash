class ExpressErr extends Error {
  constructor(status, msg) {
    super();
    this.statusCode = status;
    this.message = msg;
  }
}

module.exports = ExpressErr;
