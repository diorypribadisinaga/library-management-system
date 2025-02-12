const ClientException = require('../exceptions/ClientException');

function errorMiddleware(err, req, res, next){
    // console.log(err);
    if (err instanceof ClientException){
        res.status(err.code).json({
            status:'fail',
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        status:'fail',
        message: 'internal server error',
    })
}

module.exports = errorMiddleware;
