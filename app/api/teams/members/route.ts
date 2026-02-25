import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { member, team, teamMember, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request) {
    const teamId = new URL(request.url).searchParams.get("teamId");

    if (!teamId) {
        return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamRecord = await db.query.team.findFirst({
        where: eq(team.id, teamId),
        columns: { id: true, organizationId: true },
    });

    if (!teamRecord) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const membership = await db.query.member.findFirst({
        where: and(
            eq(member.organizationId, teamRecord.organizationId),
            eq(member.userId, session.user.id)
        ),
        columns: { role: true },
    });

    if (!membership || !membership.role || !["admin", "owner"].includes(membership.role)) {
        // Only allow team members with admin or owner role in the organization to view team members
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await db
        .select({
            id: teamMember.id,
            userId: teamMember.userId,
            teamId: teamMember.teamId,
            createdAt: teamMember.createdAt,
            name: user.name,
            email: user.email,
        })
        .from(teamMember)
        .innerJoin(user, eq(teamMember.userId, user.id))
        .where(eq(teamMember.teamId, teamId));

    return NextResponse.json({ members });
}
