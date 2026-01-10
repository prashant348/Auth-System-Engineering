import { prisma } from "../../config/db.js";

interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
}

export const authRepo = {
    userExists: async (email: string): Promise<User | null> => {
        return await prisma.user.findUnique({
            where: {
                email
            }
        })
    },

    createUser: async (email: string, passwordHash: string): Promise<User> => {
        return await prisma.user.create({
            data: {
                email,
                passwordHash
            }
        })
    }
}