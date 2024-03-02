import jwt from "jsonwebtoken"
import { prismaClient } from "../application/database.js"

export const authMiddleware = async (req, res, next) => {
    const authTokenHeader = req.header('Authorization')

    if (!authTokenHeader) {
        res.status(401).json({
            error: "Unauthorized"
        }).end()
    } else {
        const token = authTokenHeader.split(' ')[1]
        const userVerify = jwt.verify(token, process.env.JWT_SECRET)
        if (!userVerify) {
            res.status(401).json({
                error: "Unauthorized"
            }).end()
        } else {
            const user = await prismaClient.user.findFirst({
                where: {
                    email: userVerify.email
                },
                select: {
                    email:true,
                    password:true
                }
            })
            
            req.user = user

            next()
        }
    }

}