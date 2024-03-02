import { prismaClient } from "../src/application/database"
import bcrypt from "bcrypt"

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            email: {
                in: ["test@gmail.com", "owner@gmail.com", "cashier@gmail.com", "andhikapratama685@gmail.com"]
            }
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            name: "Andhika Pratama",
            number_phone: "6285156172708",
            username: "adkprtm",
            email: "test@gmail.com",
            password: await bcrypt.hash("Maklo123!", 10),
            avatar: "/images/profile.jpg",
            role: "ADMIN"
        }
    })
    await prismaClient.user.create({
        data: {
            name: "Andhika Pratama",
            number_phone: "6285156172708",
            username: "adkprtm",
            email: "owner@gmail.com",
            password: await bcrypt.hash("Maklo123!", 10),
            avatar: "/images/profile.jpg",
            role: "OWNER"
        }
    })
    await prismaClient.user.create({
        data: {
            name: "Andhika Pratama",
            number_phone: "6285156172708",
            username: "adkprtm",
            email: "cashier@gmail.com",
            password: await bcrypt.hash("Maklo123!", 10),
            avatar: "/images/profile.jpg",
            role: "CASHIER"
        }
    })
}