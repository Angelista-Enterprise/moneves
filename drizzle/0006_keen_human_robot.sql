ALTER TABLE `users` ADD `subscription_tier` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_start_date` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_end_date` text;--> statement-breakpoint
ALTER TABLE `users` ADD `currency` text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `locale` text DEFAULT 'en-US' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` text DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `date_format` text DEFAULT 'MM/dd/yyyy' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `number_format` text DEFAULT 'US' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email_notifications` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `budget_alerts` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `goal_reminders` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `weekly_reports` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `data_sharing` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `analytics_opt_in` integer DEFAULT true NOT NULL;