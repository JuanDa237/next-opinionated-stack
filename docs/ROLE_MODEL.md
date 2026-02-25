# Roles and Access

## Global roles

- tics: manage users and organizations
- admin: can create organizations (no user management)
- user: default for new signups; no access until promoted or invited

## Organization roles

- Stored in organization membership (member.role)
- Can be custom per organization

## Role assignment flow

- Only tics can set global roles
- Admins and tics can create organizations
- Users gain org access only through invitation or assignment
