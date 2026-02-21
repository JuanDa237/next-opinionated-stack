import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";
import { defaultStatements as organizationDefaultStatements, adminAc as orgAdminAc, ownerAc, memberAc } from "better-auth/plugins/organization/access";

// Define your organization-specific statements
const entityStatements = {
    reference: ["create", "read", "update", "delete"],
    warehouse: ["create", "read", "update", "delete"],
    vendor: ["create", "read", "update", "delete"],
};

export const organizationStatements = {
    ...organizationDefaultStatements,
    ...entityStatements,
} as const;

export const organizationAccessControl = createAccessControl(organizationStatements);

export const ownerOrg = organizationAccessControl.newRole({
    ...ownerAc.statements,
    ...entityStatements,
})

export const adminOrg = organizationAccessControl.newRole({
    ...orgAdminAc.statements,
    ...entityStatements,
})

export const memberOrg = organizationAccessControl.newRole({
    ...memberAc.statements,
})

export const organizationRoles = {
    owner: ownerOrg,
    admin: adminOrg,
    member: memberOrg,
}

// Define your application-specific statements
export const adminAccessControl = createAccessControl({
    ...defaultStatements,
    ...entityStatements,
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