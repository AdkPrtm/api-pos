import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (error, req, res, next) => {

    if (!error) {
        next()
        return
    }

    if (error instanceof ResponseError) {
        res.status(error.status).json({
            error: error.message
        }).end()
    } else {
        res.status(500).json({
            error: error.message
        }).end();
    }
}

export {
    errorMiddleware
}