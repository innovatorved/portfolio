CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`content` text,
	`published_at` integer,
	`status` text DEFAULT 'Draft',
	`image` text,
	`type` text NOT NULL,
	`version` integer DEFAULT 1,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_slug_type` ON `posts` (`slug`,`type`);