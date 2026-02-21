-- CreateEnum
CREATE TYPE "AOMemberRole" AS ENUM ('MEMBER', 'Q', 'SITE_Q');

-- CreateEnum
CREATE TYPE "AttendanceSource" AS ENUM ('BACKBLAST', 'SELF');

-- CreateEnum
CREATE TYPE "ServiceCause" AS ENUM ('VETERANS', 'YOUTH_KIDS', 'FAMILIES_OF_FALLEN', 'HOMELESS_HOUSING', 'ENVIRONMENT', 'DISASTER_RELIEF', 'FAITH_BASED', 'EDUCATION', 'HEALTH_WELLNESS', 'COMMUNITY_GENERAL');

-- CreateEnum
CREATE TYPE "CommitmentType" AS ENUM ('ONE_TIME', 'RECURRING', 'PROJECT_BASED', 'ASYNC');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('IN_PERSON', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('ORGANIZER', 'PARTICIPANT');

-- CreateTable
CREATE TABLE "f3_hims" (
    "id" TEXT NOT NULL,
    "firebaseId" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "f3Handle" TEXT,
    "photoURL" TEXT,
    "bio" TEXT,
    "phoneNumber" TEXT,
    "city" TEXT,
    "state" TEXT,
    "myCauses" "ServiceCause"[] DEFAULT ARRAY[]::"ServiceCause"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "f3_hims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "f3_profiles" (
    "f3himId" TEXT NOT NULL,
    "volunteerSkills" TEXT,
    "availability" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "f3_profiles_pkey" PRIMARY KEY ("f3himId")
);

-- CreateTable
CREATE TABLE "aos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ao_central" (
    "id" TEXT NOT NULL,
    "f3himId" TEXT NOT NULL,
    "aoId" TEXT NOT NULL,
    "role" "AOMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ao_central_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "f3_activity_log" (
    "id" TEXT NOT NULL,
    "f3himId" TEXT NOT NULL,
    "aoId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "calories" INTEGER,
    "durationSec" INTEGER,
    "calPerMin" DOUBLE PRECISION,
    "source" "AttendanceSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "f3_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "f3_projects" (
    "id" TEXT NOT NULL,
    "aoId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "estimatedHours" INTEGER,
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "partnerOrg" TEXT,
    "causes" "ServiceCause"[] DEFAULT ARRAY[]::"ServiceCause"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "f3_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_central" (
    "id" TEXT NOT NULL,
    "f3ProjectId" TEXT NOT NULL,
    "f3himId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'PARTICIPANT',
    "hoursLogged" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_central_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactEmail" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_opportunities" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skillsNeeded" TEXT,
    "hoursCommitment" INTEGER,
    "locationType" "LocationType" NOT NULL DEFAULT 'IN_PERSON',
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "commitmentType" "CommitmentType" NOT NULL,
    "causes" "ServiceCause"[] DEFAULT ARRAY[]::"ServiceCause"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_commitments" (
    "id" TEXT NOT NULL,
    "f3himId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "hoursLogged" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_commitments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "f3_hims_firebaseId_key" ON "f3_hims"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "f3_hims_f3Handle_key" ON "f3_hims"("f3Handle");

-- CreateIndex
CREATE INDEX "aos_city_state_idx" ON "aos"("city", "state");

-- CreateIndex
CREATE INDEX "ao_central_aoId_idx" ON "ao_central"("aoId");

-- CreateIndex
CREATE INDEX "ao_central_f3himId_idx" ON "ao_central"("f3himId");

-- CreateIndex
CREATE UNIQUE INDEX "ao_central_f3himId_aoId_key" ON "ao_central"("f3himId", "aoId");

-- CreateIndex
CREATE INDEX "f3_activity_log_f3himId_date_idx" ON "f3_activity_log"("f3himId", "date");

-- CreateIndex
CREATE INDEX "f3_activity_log_aoId_idx" ON "f3_activity_log"("aoId");

-- CreateIndex
CREATE UNIQUE INDEX "f3_projects_slug_key" ON "f3_projects"("slug");

-- CreateIndex
CREATE INDEX "f3_projects_startTime_idx" ON "f3_projects"("startTime");

-- CreateIndex
CREATE INDEX "f3_projects_endTime_idx" ON "f3_projects"("endTime");

-- CreateIndex
CREATE INDEX "f3_projects_aoId_idx" ON "f3_projects"("aoId");

-- CreateIndex
CREATE INDEX "project_central_f3ProjectId_idx" ON "project_central"("f3ProjectId");

-- CreateIndex
CREATE INDEX "project_central_f3himId_idx" ON "project_central"("f3himId");

-- CreateIndex
CREATE INDEX "project_central_role_idx" ON "project_central"("role");

-- CreateIndex
CREATE UNIQUE INDEX "project_central_f3ProjectId_f3himId_key" ON "project_central"("f3ProjectId", "f3himId");

-- CreateIndex
CREATE INDEX "volunteer_opportunities_status_idx" ON "volunteer_opportunities"("status");

-- CreateIndex
CREATE INDEX "volunteer_opportunities_locationType_idx" ON "volunteer_opportunities"("locationType");

-- CreateIndex
CREATE INDEX "volunteer_opportunities_organizationId_idx" ON "volunteer_opportunities"("organizationId");

-- CreateIndex
CREATE INDEX "volunteer_commitments_f3himId_idx" ON "volunteer_commitments"("f3himId");

-- CreateIndex
CREATE INDEX "volunteer_commitments_opportunityId_idx" ON "volunteer_commitments"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_commitments_f3himId_opportunityId_key" ON "volunteer_commitments"("f3himId", "opportunityId");

-- AddForeignKey
ALTER TABLE "f3_profiles" ADD CONSTRAINT "f3_profiles_f3himId_fkey" FOREIGN KEY ("f3himId") REFERENCES "f3_hims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ao_central" ADD CONSTRAINT "ao_central_f3himId_fkey" FOREIGN KEY ("f3himId") REFERENCES "f3_hims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ao_central" ADD CONSTRAINT "ao_central_aoId_fkey" FOREIGN KEY ("aoId") REFERENCES "aos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "f3_activity_log" ADD CONSTRAINT "f3_activity_log_f3himId_fkey" FOREIGN KEY ("f3himId") REFERENCES "f3_hims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "f3_activity_log" ADD CONSTRAINT "f3_activity_log_aoId_fkey" FOREIGN KEY ("aoId") REFERENCES "aos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "f3_projects" ADD CONSTRAINT "f3_projects_aoId_fkey" FOREIGN KEY ("aoId") REFERENCES "aos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_central" ADD CONSTRAINT "project_central_f3ProjectId_fkey" FOREIGN KEY ("f3ProjectId") REFERENCES "f3_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_central" ADD CONSTRAINT "project_central_f3himId_fkey" FOREIGN KEY ("f3himId") REFERENCES "f3_hims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_opportunities" ADD CONSTRAINT "volunteer_opportunities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_commitments" ADD CONSTRAINT "volunteer_commitments_f3himId_fkey" FOREIGN KEY ("f3himId") REFERENCES "f3_hims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_commitments" ADD CONSTRAINT "volunteer_commitments_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "volunteer_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
