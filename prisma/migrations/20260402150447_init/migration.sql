-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'office', 'attendance', 'parent');

-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('ballet', 'jazz', 'tap', 'contemporary', 'hip_hop', 'lyrical', 'acro', 'musical_theatre', 'pointe');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('tiny_tots', 'minis', 'juniors', 'teens', 'seniors', 'adults');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- CreateEnum
CREATE TYPE "Room" AS ENUM ('studio_a', 'studio_b', 'studio_c', 'studio_d');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('active', 'waitlisted', 'trial', 'withdrawn', 'graduated');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'pending', 'overdue', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "HouseholdStatus" AS ENUM ('active', 'inactive', 'archived');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('active', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('upcoming', 'active', 'completed');

-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('monthly', 'per_session', 'per_camp');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('female', 'male', 'other');

-- CreateEnum
CREATE TYPE "GuardianRelationship" AS ENUM ('mother', 'father', 'guardian', 'grandparent', 'other');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('email', 'sms', 'both');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('sent', 'scheduled', 'draft');

-- CreateEnum
CREATE TYPE "ConversationChannel" AS ENUM ('sms', 'email', 'facebook', 'instagram', 'webchat');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('open', 'closed', 'snoozed');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'excused');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('new_lead', 'contacted', 'trial_scheduled', 'trial_completed', 'registered', 'lost');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('website', 'walk_in', 'referral', 'trial', 'social_media', 'phone');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('lead', 'household');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('follow_up', 'reminder', 'welcome', 'billing', 'general');

-- CreateEnum
CREATE TYPE "AutomationTrigger" AS ENUM ('new_lead', 'trial_booked', 'trial_completed', 'enrollment', 'missed_class', 'invoice_overdue', 'birthday');

-- CreateEnum
CREATE TYPE "AutomationStepType" AS ENUM ('send_sms', 'send_email', 'wait', 'condition', 'update_stage', 'add_tag', 'notify_staff');

-- CreateEnum
CREATE TYPE "AutomationStatus" AS ENUM ('active', 'paused', 'draft');

-- CreateEnum
CREATE TYPE "RecitalStatus" AS ENUM ('planning', 'ordering', 'rehearsals', 'show_week', 'completed');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('instructor', 'assistant', 'sub', 'staff_admin');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('active', 'on_leave', 'inactive');

-- CreateEnum
CREATE TYPE "SubRequestStatus" AS ENUM ('open', 'covered', 'cancelled');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('policies_procedures', 'curriculum_lesson_plans', 'studio_operations', 'sub_handbook', 'hr_staff');

-- CreateEnum
CREATE TYPE "ReviewPlatform" AS ENUM ('google', 'facebook', 'yelp');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('completed', 'missed', 'voicemail');

-- CreateEnum
CREATE TYPE "CompetitionEventStatus" AS ENUM ('registered', 'pending', 'upcoming');

-- CreateEnum
CREATE TYPE "TeamFeeStatus" AS ENUM ('paid', 'pending', 'overdue');

-- CreateEnum
CREATE TYPE "WaiverStatus" AS ENUM ('signed', 'not_signed');

-- CreateEnum
CREATE TYPE "RolloverResponseStatus" AS ENUM ('confirmed', 'opted_out', 'change_requested', 'no_response');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'parent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "status" "HouseholdStatus" NOT NULL DEFAULT 'active',
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paymentMethodType" TEXT,
    "paymentMethodLast4" TEXT,
    "paymentMethodExpiry" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardian" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" "GuardianRelationship" NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "medicalNotes" TEXT,
    "enrollmentStatus" "EnrollmentStatus" NOT NULL DEFAULT 'active',
    "measurements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "billingRate" DECIMAL(10,2) NOT NULL,
    "billingType" "BillingType" NOT NULL DEFAULT 'monthly',
    "status" "SeasonStatus" NOT NULL DEFAULT 'upcoming',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "instructorId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "monthlyRate" DECIMAL(10,2) NOT NULL,
    "ageRangeMin" INTEGER NOT NULL,
    "ageRangeMax" INTEGER NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_schedule" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" "Room" NOT NULL,

    CONSTRAINT "class_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'active',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paidDate" TIMESTAMP(3),
    "stripeInvoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_item" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "invoice_line_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_override" (
    "id" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "originalAmount" DECIMAL(10,2) NOT NULL,
    "newAmount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_override_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_config" (
    "id" TEXT NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "monthlyCap" DECIMAL(10,2) NOT NULL,
    "registrationFee" DECIMAL(10,2) NOT NULL,
    "lateFee" DECIMAL(10,2) NOT NULL,
    "lateFeeGraceDays" INTEGER NOT NULL,
    "siblingDiscount" DECIMAL(5,2) NOT NULL,
    "trialFee" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_record" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedBy" TEXT NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "disciplines" "Discipline"[],
    "status" "StaffStatus" NOT NULL DEFAULT 'active',
    "payRate" DECIMAL(10,2) NOT NULL,
    "payType" TEXT NOT NULL DEFAULT 'hourly',
    "avatar" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "certifications" JSONB,
    "availability" JSONB,
    "weeklyHours" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "monthlyCompensation" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_request" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "originalInstructorId" TEXT NOT NULL,
    "status" "SubRequestStatus" NOT NULL DEFAULT 'open',
    "coveredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childAge" INTEGER NOT NULL,
    "interestDiscipline" "Discipline" NOT NULL,
    "source" "LeadSource" NOT NULL,
    "stage" "LeadStage" NOT NULL DEFAULT 'new_lead',
    "notes" TEXT NOT NULL DEFAULT '',
    "assignedTo" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "contactId" TEXT NOT NULL,
    "channel" "ConversationChannel" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'open',
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "lastMessage" TEXT NOT NULL DEFAULT '',
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "channel" "ConversationChannel" NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "audience" TEXT NOT NULL,
    "audienceCount" INTEGER NOT NULL,
    "sentBy" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MessageStatus" NOT NULL DEFAULT 'draft',
    "deliveredCount" INTEGER,
    "openedCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "shortcut" TEXT,

    CONSTRAINT "text_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "trigger" "AutomationTrigger" NOT NULL,
    "status" "AutomationStatus" NOT NULL DEFAULT 'draft',
    "runsCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_step" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "type" "AutomationStepType" NOT NULL,
    "label" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "automation_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trial_slot" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "instructorName" TEXT NOT NULL,
    "availableSpots" INTEGER NOT NULL,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "trial_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "theme" TEXT,
    "description" TEXT,
    "status" "RecitalStatus" NOT NULL DEFAULT 'planning',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine" (
    "id" TEXT NOT NULL,
    "recitalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL,
    "costume" JSONB NOT NULL,
    "lineupPosition" INTEGER NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "studentCount" INTEGER NOT NULL,

    CONSTRAINT "routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "disciplines" "Discipline"[],
    "ageGroup" "AgeGroup" NOT NULL,
    "headCoach" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL,
    "financials" JSONB NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competition_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "feeStatus" "TeamFeeStatus" NOT NULL DEFAULT 'pending',
    "waiverStatus" "WaiverStatus" NOT NULL DEFAULT 'not_signed',
    "teamFee" DECIMAL(10,2) NOT NULL,
    "competitionFees" DECIMAL(10,2) NOT NULL,
    "costumeFees" DECIMAL(10,2) NOT NULL,
    "totalOwed" DECIMAL(10,2) NOT NULL,
    "totalPaid" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_event" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "entryDeadline" TIMESTAMP(3) NOT NULL,
    "status" "CompetitionEventStatus" NOT NULL DEFAULT 'upcoming',
    "entryFees" DECIMAL(10,2) NOT NULL,
    "travelCost" DECIMAL(10,2) NOT NULL,
    "hotelCost" DECIMAL(10,2) NOT NULL,
    "routines" TEXT[],
    "logistics" TEXT,

    CONSTRAINT "competition_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "platform" "ReviewPlatform" NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "responseBody" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_segment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "contactCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_record" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "direction" "CallDirection" NOT NULL,
    "duration" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" "CallStatus" NOT NULL,

    CONSTRAINT "call_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base_article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "relatedArticleIds" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_base_article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rollover_config" (
    "id" TEXT NOT NULL,
    "sourceSeasonId" TEXT NOT NULL,
    "sourceSeasonName" TEXT NOT NULL,
    "targetSeasonName" TEXT NOT NULL,
    "rolloverDate" TIMESTAMP(3) NOT NULL,
    "registrationFee" DECIMAL(10,2) NOT NULL,
    "notificationDate" TIMESTAMP(3) NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rollover_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rollover_household_response" (
    "id" TEXT NOT NULL,
    "rolloverConfigId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "householdName" TEXT NOT NULL,
    "status" "RolloverResponseStatus" NOT NULL DEFAULT 'no_response',
    "currentClasses" TEXT[],
    "suggestedClasses" TEXT[],
    "requestedChanges" TEXT,
    "reason" TEXT,

    CONSTRAINT "rollover_household_response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "household_stripeCustomerId_key" ON "household"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "guardian_email_key" ON "guardian"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guardian_userId_key" ON "guardian"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_studentId_classId_key" ON "enrollment"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_stripeInvoiceId_key" ON "invoice"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "invoice_householdId_date_idx" ON "invoice"("householdId", "date");

-- CreateIndex
CREATE INDEX "attendance_record_classId_date_idx" ON "attendance_record"("classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_record_classId_studentId_date_key" ON "attendance_record"("classId", "studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_member_email_key" ON "staff_member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_member_userId_key" ON "staff_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "team_member_teamId_studentId_key" ON "team_member"("teamId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "rollover_household_response_rolloverConfigId_householdId_key" ON "rollover_household_response"("rolloverConfigId", "householdId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "staff_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedule" ADD CONSTRAINT "class_schedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_override" ADD CONSTRAINT "billing_override_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "invoice_line_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_member" ADD CONSTRAINT "staff_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_request" ADD CONSTRAINT "sub_request_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_request" ADD CONSTRAINT "sub_request_originalInstructorId_fkey" FOREIGN KEY ("originalInstructorId") REFERENCES "staff_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "conversation_message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_step" ADD CONSTRAINT "automation_step_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_slot" ADD CONSTRAINT "trial_slot_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_recitalId_fkey" FOREIGN KEY ("recitalId") REFERENCES "recital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "competition_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_event" ADD CONSTRAINT "competition_event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "competition_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rollover_household_response" ADD CONSTRAINT "rollover_household_response_rolloverConfigId_fkey" FOREIGN KEY ("rolloverConfigId") REFERENCES "rollover_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rollover_household_response" ADD CONSTRAINT "rollover_household_response_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
