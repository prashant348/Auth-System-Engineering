import { hashPassword } from "../../utils/password.js";
import { authRepo } from "./auth.repo.js";
import { validatePassword } from "../../utils/password.js";

export const authService = {
    signup: async (email: string, password: string) => {

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await authRepo.userExists(normalizedEmail);

        if (userExists) {
            throw new Error("INVALID_EMAIL");
        }

        const passwordHash = await hashPassword(password);

        const user = await authRepo.createUser(normalizedEmail, passwordHash);

        return {
            id: user.id,
            email: user.email
        }
    },

    signin: async (email: string, password: string) => {

        const normalizedEmail = email.toString().trim();

        const user = await authRepo.userExists(normalizedEmail);

        if (!user) {
            throw new Error("INVALID_EMAIL");
        }

        const plainPassword = password;
        const storedPassword = user.passwordHash

        const ok = await validatePassword(plainPassword, storedPassword);

        if (!ok) {
            throw new Error("INVALID_PASSWORD")
        }

        // create session
        const session = await authRepo.createSession(user.id)

        return {
            id: user.id,
            email: user.email,
            session_id: session.id
        }
    },

    getUserFromSession: async (sessionId: string) => {

        // get session
        const session = await authRepo.getSessionWithUser(sessionId);

        // check if session exists
        if (!session) {
            throw new Error("INVALID_SESSION");
        }

        const now = new Date();
        const sessionExpiryDate = session.expiresAt!;

        // check if session is expired
        if (now > sessionExpiryDate) {
            throw new Error("SESSION_EXPIRED");
        }

        // check if user associated with session exists
        if (!session.user) {
            throw new Error("USER_NOT_FOUND");
        }

        // return associated user
        return {
            id: session.user.id,
            email: session.user.email
        }
    }
}
