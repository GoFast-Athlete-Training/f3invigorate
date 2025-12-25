-- Creates a safe Prisma role that CANNOT alter schema
-- DO NOT RUN THIS DIRECTLY - Provide to DBA for manual application

CREATE ROLE prisma_safe_user LOGIN PASSWORD 'CHANGEME';

GRANT CONNECT ON DATABASE gofast TO prisma_safe_user;
GRANT USAGE ON SCHEMA public TO prisma_safe_user;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO prisma_safe_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE ON TABLES TO prisma_safe_user;

