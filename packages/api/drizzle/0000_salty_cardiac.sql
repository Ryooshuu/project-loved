CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"country" varchar(32),
	"restricted" boolean DEFAULT false NOT NULL,
	"apiFetchedAt" timestamp DEFAULT now() NOT NULL,
	"tokens" json DEFAULT '[]'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"sessionToken" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
