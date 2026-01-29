-- CreateEnum
CREATE TYPE "onboarding_steps" AS ENUM ('NOT_STARTED', 'ACCOUNTS_LINKED', 'INCOME_SET', 'BUDGET_CREATED', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "first_name" VARCHAR(70),
    "last_name" VARCHAR(70),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "has_image" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "ban_reason" TEXT,
    "ban_expires" TIMESTAMP(3),
    "two_factor_enabled" BOOLEAN DEFAULT false,
    "last_login_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_onboardings" (
    "user_id" VARCHAR(255) NOT NULL,
    "current_step" "onboarding_steps" NOT NULL DEFAULT 'NOT_STARTED',
    "monthly_net_income" MONEY,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_onboardings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "user_id" VARCHAR(255) NOT NULL,
    "impersonated_by" VARCHAR(255),
    "active_organization_id" VARCHAR(255),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" VARCHAR(255) NOT NULL,
    "account_id" VARCHAR(255) NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" VARCHAR(255) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "prefix" VARCHAR(20) NOT NULL,
    "key" TEXT NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "refill_interval" INTEGER,
    "refill_amount" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_time_window" INTEGER,
    "rate_limit_max" INTEGER,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER,
    "permissions" TEXT,
    "metadata" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_request" TIMESTAMP(3),
    "last_refill_at" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factors" (
    "id" VARCHAR(255) NOT NULL,
    "secret" TEXT NOT NULL,
    "backup_codes" TEXT NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_banned_idx" ON "users"("banned");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "user_onboardings_current_step_idx" ON "user_onboardings"("current_step");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_active_organization_id_idx" ON "sessions"("active_organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_provider_id_idx" ON "accounts"("provider_id");

-- CreateIndex
CREATE INDEX "accounts_account_id_provider_id_idx" ON "accounts"("account_id", "provider_id");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "verifications_expires_at_idx" ON "verifications"("expires_at");

-- CreateIndex
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");

-- CreateIndex
CREATE INDEX "api_keys_enabled_idx" ON "api_keys"("enabled");

-- CreateIndex
CREATE INDEX "api_keys_expires_at_idx" ON "api_keys"("expires_at");

-- CreateIndex
CREATE INDEX "api_keys_prefix_idx" ON "api_keys"("prefix");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "two_factors_user_id_idx" ON "two_factors"("user_id");

-- AddForeignKey
ALTER TABLE "user_onboardings" ADD CONSTRAINT "user_onboardings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
