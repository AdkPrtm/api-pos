import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { getUserValidation, loginUserValidation, registerUserValidation, updateDataUserValidation } from "../validation/user-validation.js"
import { validation } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const register = async (request) => {
    const validate = validation(registerUserValidation, request)

    const userCount = await prismaClient.user.count({
        where: {
            email: validate.email,
        }
    })

    if (userCount === 1) {
        throw new ResponseError(400, "Email already exist")
    }

    validate.password = await bcrypt.hash(validate.password, 10)

    return prismaClient.user.create({
        data: validate,
        select: {
            name: true,
            number_phone: true,
            email: true,
            avatar: true,
            role: true,
        }
    })
}

const login = async (request) => {
    const loginRequest = validation(loginUserValidation, request)

    const userExist = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email,
        },
        select: {
            name: true,
            number_phone: true,
            username: true,
            email: true,
            avatar: true,
            password: true,
            role: true,
        }
    })

    if (!userExist) {
        throw new ResponseError(401, "Email or password wrong")
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, userExist.password)

    if (!isPasswordValid) {
        throw new ResponseError(401, "Email or password wrong")
    }

    userExist.token = jwt.sign(
        {
            email: loginRequest.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '60d' }
    );
    delete userExist.password
    return userExist
}

const getCurrent = async (request) => {
    const resValidate = validation(getUserValidation, request)
    const userExist = await prismaClient.user.findFirst({
        where: {
            email: resValidate.email,
        },
        select: {
            name: true,
            number_phone: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
        }
    })

    if (!userExist) {
        throw new ResponseError(404, "User not found")
    }

    return userExist
}

const getAllUser = async () => {
    const result = await prismaClient.user.findMany({
        where: {
            role: {
                in: ["OWNER", "CASHIER"]
            }
        }
    })

    result.map((data) => {
        delete data.password
        return data
    })

    return result
}

const updateDataUser = async (data, request) => {
    const validate = validation(updateDataUserValidation, request)

    const userTotal = await prismaClient.user.findUnique({
        where: {
            email: data.email,
        },
        select: {
            email: true,
            password: true
        }
    })

    if (!userTotal) {
        throw new ResponseError(404, "User not found")
    }

    //UPDATE PASSWORD
    if (validate.password) {
        const isPasswordValid = await bcrypt.compare(validate.old_password, userTotal.password)

        if (!isPasswordValid) {
            throw new ResponseError(401, "Wrong password")
        }

        const newPassword = await bcrypt.hash(validate.password, 10)

        return prismaClient.user.update({
            where: {
                email: userTotal.email
            }, data: {
                password: newPassword
            },
            select: {
                name: true,
                number_phone: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
            }
        })
    }

    //UPDATE EMAIL
    if (validate.email) {
        if (userTotal.email != validate.old_email) {
            throw new ResponseError(401, "User not found")
        }
        return prismaClient.user.update({
            where: {
                email: userTotal.email
            },
            data: {
                email: validate.email
            },
            select: {
                name: true,
                number_phone: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
            }

        })
    }

    //UPDATE DATA
    return prismaClient.user.update({
        where: {
            email: userTotal.email
        },
        data: {
            name: validate.name,
            number_phone: validate.number_phone,
            username: validate.username,
            avatar: validate.avatar,
            role: validate.role,
        },
        select: {
            name: true,
            number_phone: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            updatedAt: true,
        }
    })
}

export default {
    register,
    login,
    getCurrent,
    getAllUser,
    updateDataUser
}