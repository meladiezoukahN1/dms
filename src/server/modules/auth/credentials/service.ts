import { compare } from "bcryptjs";
import { CredentialsPolicy } from "./policy";
import { CredentialsRepository } from "./repository";
import { CredentialsValidator } from "./validator";
import type { AuthenticatedUser } from "./types";

export class CredentialsService {
  static async authenticate(payload: unknown): Promise<AuthenticatedUser | null> {
    const input = CredentialsValidator.validate(payload);
    const user = await CredentialsRepository.findByEmail(input.email);

    if (!user) {
      return null;
    }

    if (!CredentialsPolicy.canLogin(user.status)) {
      return null;
    }

    const hash = user.passwordHash;
    if (!hash) {
      return null;
    }

    const isValidPassword = await compare(input.password, hash);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
    };
  }
}
