import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { DrizzleUserRepository } from "../database/repositories/user.repository";
import { UserEntity } from "../database/entities/User";
import { sha256 } from "@oslojs/crypto/sha2";
import { Err, None, Ok, Some } from "ts-results";

export function generateSessionToken() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(repository: DrizzleUserRepository, token: string, user: UserEntity) {
    const sessionToken = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const session = await repository.createSession({
        sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30))
    });

    if (session.err) {
        return Err(session.val);
    }

    return Ok(session.val);
}

export async function validateSessionToken(repository: DrizzleUserRepository, token: string) {
    const sessionToken = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const result = await repository.findSessionByToken(sessionToken);
    if (!result.some) {
        return None;
    }

    await result.val.loadUser();

    if (!result.val.user || result.val.isExpired()) {
        await repository.deleteSession(sessionToken);
        return None;
    }

    const fifteen_days = 1000 * 60 * 60 * 24 * 15;
    if (result.val.ValidToBeRenewed(fifteen_days)) {
        await repository.updateSession(sessionToken, {
            expiresAt: new Date(Date.now() + (fifteen_days * 2))
        });
    }

    return Some(result.val);
}
