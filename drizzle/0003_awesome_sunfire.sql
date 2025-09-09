CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_session_token_unique` ON `sessions` (`session_token`);--> statement-breakpoint
CREATE TABLE `user_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`iban` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verification_tokens_token_unique` ON `verification_tokens` (`token`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state") SELECT "id", "user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_budget_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`color` text,
	`monthly_limit` real NOT NULL,
	`spent` real DEFAULT 0 NOT NULL,
	`remaining` real NOT NULL,
	`status` text DEFAULT 'on_track' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_budget_categories`("id", "user_id", "name", "icon", "color", "monthly_limit", "spent", "remaining", "status", "created_at") SELECT "id", "user_id", "name", "icon", "color", "monthly_limit", "spent", "remaining", "status", "created_at" FROM `budget_categories`;--> statement-breakpoint
DROP TABLE `budget_categories`;--> statement-breakpoint
ALTER TABLE `__new_budget_categories` RENAME TO `budget_categories`;--> statement-breakpoint
CREATE TABLE `__new_savings_goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`account_id` integer NOT NULL,
	`name` text NOT NULL,
	`target_amount` real NOT NULL,
	`current_amount` real DEFAULT 0 NOT NULL,
	`target_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `user_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_savings_goals`("id", "user_id", "account_id", "name", "target_amount", "current_amount", "target_date", "created_at") SELECT "id", "user_id", "account_id", "name", "target_amount", "current_amount", "target_date", "created_at" FROM `savings_goals`;--> statement-breakpoint
DROP TABLE `savings_goals`;--> statement-breakpoint
ALTER TABLE `__new_savings_goals` RENAME TO `savings_goals`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`account_id` integer,
	`category_id` integer,
	`amount` real NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`counterparty` text,
	`counterparty_account` text,
	`original_description` text,
	`import_hash` text,
	`is_imported` integer DEFAULT false,
	`needs_account_mapping` integer DEFAULT false,
	`needs_source_account_mapping` integer DEFAULT false,
	`source_account_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `user_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `budget_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_account_id`) REFERENCES `user_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "user_id", "account_id", "category_id", "amount", "description", "type", "date", "counterparty", "counterparty_account", "original_description", "import_hash", "is_imported", "needs_account_mapping", "needs_source_account_mapping", "source_account_id", "created_at") SELECT "id", "user_id", "account_id", "category_id", "amount", "description", "type", "date", "counterparty", "counterparty_account", "original_description", "import_hash", "is_imported", "needs_account_mapping", "needs_source_account_mapping", "source_account_id", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`email_verified` text,
	`image` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "avatar", "email_verified", "image", "created_at") SELECT "id", "email", "name", "avatar", "email_verified", "image", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);