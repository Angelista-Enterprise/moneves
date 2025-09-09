ALTER TABLE `users` ADD `bunq_api_key` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bunq_api_url` text DEFAULT 'http://localhost:8000';