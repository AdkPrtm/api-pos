import { ResponseError } from "../error/response-error.js"

const validation = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknwon: false
    })
    if (result.error) {
        throw new ResponseError(400, result.error.message)
    } else {
        return result.value
    }
}

export {
    validation
}