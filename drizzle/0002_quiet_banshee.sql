PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `budget_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "user_id", "account_id", "category_id", "amount", "description", "type", "date", "counterparty", "counterparty_account", "original_description", "import_hash", "is_imported", "needs_account_mapping", "created_at") SELECT "id", "user_id", "account_id", "category_id", "amount", "description", "type", "date", "counterparty", "counterparty_account", "original_description", "import_hash", "is_imported", "needs_account_mapping", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;