const ApiError = require('../error/apiErrors');

 errorHandlingMiddleware= function (err, req, res) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "Непредвиденная ошибка!"})
}
module.exports = errorHandlingMiddleware