import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";

export type GlobalRole = "tics" | "admin" | "user";

const roleRank: Record<GlobalRole, number> = {
    user: 0,
    admin: 1,
    tics: 2,
};

const splitRoles = (role?: string | null) => {
    return (role ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
};

export const normalizeRole = (role?: string | null): GlobalRole => {
    const roles = splitRoles(role);

    if (roles.includes("tics")) {
        return "tics";
    }

    if (roles.includes("admin")) {
        return "admin";
    }

    return "user";
};

export const canAccessRole = (required: GlobalRole, actual: GlobalRole) => {
    return roleRank[actual] >= roleRank[required];
};

export const getUserRole = async (userId: string): Promise<GlobalRole> => {
    const [record] = await db
        .select({ role: user.role })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    return normalizeRole(record?.role ?? null);
};

export const getSessionRole = async (
    session: { user?: { id?: string; role?: string | null } } | null,
): Promise<GlobalRole> => {
    if (!session?.user?.id) {
        return "user";
    }

    const normalized = normalizeRole(session.user.role);
    if (normalized !== "user" || session.user.role === "user") {
        return normalized;
    }

    return getUserRole(session.user.id);
};
