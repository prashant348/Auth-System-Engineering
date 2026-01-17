import { prisma } from "../../config/db.js";

interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
}

interface Session {
    id: string;
    userId: string;
    createdAt?: Date;
    expiresAt?: Date
}

interface SessionWithUser extends Session {
    user: User;
}

interface BatchPayLoad {
    count: number
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
    },

    createSession: async (userId: string): Promise<Session> => {
        return await prisma.session.create({
            data: {
                userId
            }
        })
    },

    getSessionWithUser: async (session_id: string): Promise<SessionWithUser | null> => {
        const result = await prisma.session.findUnique({
            where: {
                id: session_id
            },
            include: {
                user: true
            }
        })
        return result
    },

    deleteSessionById: async (sessionId: string): Promise<BatchPayLoad> => {
        const res = await prisma.session.deleteMany({
            where: {
                id: sessionId
            }
        })

        console.log(res)
        return res
    },

    getActiveSessions: async (userId: string): Promise<Session[]> => {
        return await prisma.session.findMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date() // if expirey date is greater than current date, the session and valid/active
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });
    },


    createSessionWithLimit: async (userId: string): Promise<Session> => {

        const activeSessions = await authRepo.getActiveSessions(userId);

        if (activeSessions.length >= 3) {
            const oldestSession = activeSessions[0];
            await authRepo.deleteSessionById(oldestSession!.id);
        }

        return await prisma.session.create({
            data: {
                userId
            }
        })
    },

}