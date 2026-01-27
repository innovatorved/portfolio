CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content" text,
	"published_at" timestamp with time zone,
	"status" text DEFAULT 'Draft',
	"image" text,
	"type" text NOT NULL,
	"version" integer DEFAULT 1,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_slug_type" UNIQUE("slug","type")
);
