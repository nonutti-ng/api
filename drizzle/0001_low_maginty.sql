CREATE TABLE `user_onboarding` (
	`id` varchar(36) NOT NULL,
	`age_group` varchar(10) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`has_done_state` varchar(30) NOT NULL,
	`why_doing` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_onboarding_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `has_completed_onboarding` boolean DEFAULT false NOT NULL;