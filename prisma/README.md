# ⚠️ Prisma Schema Safety Rules (MANDATORY)

Do NOT run `prisma db push` against the shared GoFast DB.

`--accept-data-loss` is forbidden.

All schema changes MUST follow this workflow:

1. Update `schema.prisma`
2. Run `npx prisma migrate dev` locally
3. Commit migration file
4. Open PR
5. CI checks diff against production DB
6. CI deploys migration using `prisma migrate deploy`

Any destructive schema changes must be explicitly approved and must NEVER be executed manually.

