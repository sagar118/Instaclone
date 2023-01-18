const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-api");
const UnauthenticatedError = require("./unauthenticated");

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
};
