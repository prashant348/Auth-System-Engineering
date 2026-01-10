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

        return {
            id: user.id,
            email: user.email
        }

    }
}

