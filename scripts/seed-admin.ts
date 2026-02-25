import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db } from "../lib/db/drizzle";
import { account, user } from "../lib/db/schema";

async function seed() {
    const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD ?? "a4gbW8PK!2Yn!R";
    const name = process.env.SEED_ADMIN_NAME ?? "Admin User";

    const now = new Date();

    const [existingUser] = await db
        .select({ id: user.id, role: user.role, name: user.name, emailVerified: user.emailVerified })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

    let userId = existingUser?.id;

    if (!userId) {
        const [createdUser] = await db
            .insert(user)
            .values({
                id: randomUUID(),
                name,
                email,
                emailVerified: true,
                role: "admin",
                createdAt: now,
                updatedAt: now,
            })
            .returning({ id: user.id });

        userId = createdUser?.id;
        console.log(`Created admin user ${email}.`);

        const [credentialAccount] = await db
            .select({ id: account.id })
            .from(account)
            .where(and(eq(account.userId, userId), eq(account.providerId, "credential")))
            .limit(1);

        const hashedPassword = await hashPassword(password);

        if (!credentialAccount) {
            await db.insert(account).values({
                id: randomUUID(),
                accountId: userId,
                providerId: "credential",
                userId,
                password: hashedPassword,
                createdAt: now,
                updatedAt: now,
            });

            console.log("Created credential account for admin user.");
        }
    } else {
        console.log(`Admin user already exists for ${email}.`);
    }

    console.log("Seed complete.");
}

seed()