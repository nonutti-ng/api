CREATE TABLE `entries` (
	`entry_id` varchar(36) NOT NULL,
	`try_id` varchar(36) NOT NULL,
	`date` timestamp(3) NOT NULL,
	`status` varchar(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `entries_entry_id` PRIMARY KEY(`entry_id`)
);
--> statement-breakpoint
CREATE TABLE `tries` (
	`try_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`year` varchar(4) NOT NULL,
	`state` varchar(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `tries_try_id` PRIMARY KEY(`try_id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `browser_notification_token` text;--> statement-breakpoint
ALTER TABLE `entries` ADD CONSTRAINT `entries_try_id_tries_try_id_fk` FOREIGN KEY (`try_id`) REFERENCES `tries`(`try_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tries` ADD CONSTRAINT `tries_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;