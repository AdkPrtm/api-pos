import userService from "../service/user-service.js"

const register = async (req, res, next) => {
    try {
        const result  = await userService.register(req.body)
        res.status(201).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const result  = await userService.login(req.body)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getCurrent = async (req, res, next) => {
    try {
        const result = await userService.getCurrent(req.body)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req, res, next) => {
    try {
        const result = await userService.getAllUser()
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const updateDataUser = async (req, res, next) => {
    try {
        const result = await userService.updateDataUser(req.user, req.body)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}
export default {
    register,
    login,
    getCurrent,
    getAllUser,
    updateDataUser
}