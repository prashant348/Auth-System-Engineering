import { hashPassword } from "../../utils/password.js";
import { authRepo } from "./auth.repo.js";

export const authService = {
    signup: async (email: string, password: string) => {

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await authRepo.userExists(normalizedEmail);

        if (userExists) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        const passwordHash = await hashPassword(password);

        const user = await authRepo.createUser(normalizedEmail, passwordHash);

        return {
            id: user.id,
            email: user.email
        }
    }
}

