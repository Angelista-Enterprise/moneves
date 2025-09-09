CREATE TABLE `avatar_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`image_id` text NOT NULL,
	`bunq_api_key` text NOT NULL,
	`expires_at` text NOT NULL,
	`is_used` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
