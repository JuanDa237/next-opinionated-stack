import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

export const adminAccessControl = createAccessControl({
    ...defaultStatements,
    // EXAMPLE Here you can define your custom statements for your access control.
    // These statements will be used to create roles and permissions in your application.
    // projects: ["list", "create", "update", "delete"],
});

export const admin = adminAccessControl.newRole(adminAc.statements)
export const user = adminAccessControl.newRole(userAc.statements)

export const tics = adminAccessControl.newRole({
    ...adminAc.statements,
    // EXAMPLE Here you can define your custom statements for the tics role.
    // projects: ["list", "create", "update", "delete"],
})

export const adminRoles = {
    admin,
    user,
    tics,
}