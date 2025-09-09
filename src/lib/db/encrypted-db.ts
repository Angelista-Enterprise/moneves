import { db } from "./index";
import { DatabaseEncryptionService } from "../encryption/service";
import { SQL } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * Enhanced database wrapper that automatically handles encryption/decryption
 */
export class EncryptedDatabase {
  /**
   * Select records with automatic decryption
   */
  static async select<T extends Record<string, unknown>>(
    table: SQLiteTable,
    tableName: keyof typeof import("../encryption/fields").ENCRYPTED_FIELDS,
    options?: {
      where?: SQL;
      orderBy?: SQL;
      limit?: number;
    }
  ): Promise<T[]> {
    const baseQuery = db.select().from(table);

    let results;
    if (options && options.where && options.orderBy && options.limit) {
      results = await baseQuery
        .where(options.where)
        .orderBy(options.orderBy)
        .limit(options.limit);
    } else if (options && options.where && options.orderBy) {
      results = await baseQuery.where(options.where).orderBy(options.orderBy);
    } else if (options && options.where && options.limit) {
      results = await baseQuery.where(options.where).limit(options.limit);
    } else if (options && options.orderBy && options.limit) {
      results = await baseQuery.orderBy(options.orderBy).limit(options.limit);
    } else if (options && options.where) {
      results = await baseQuery.where(options.where);
    } else if (options && options.orderBy) {
      results = await baseQuery.orderBy(options.orderBy);
    } else if (options && options.limit) {
      results = await baseQuery.limit(options.limit);
    } else {
      results = await baseQuery;
    }

    return DatabaseEncryptionService.decryptMultipleAfterFetch(
      tableName,
      results as T[]
    );
  }

  /**
   * Select a single record with automatic decryption
   */
  static async selectOne<T extends Record<string, unknown>>(
    table: SQLiteTable,
    tableName: keyof typeof import("../encryption/fields").ENCRYPTED_FIELDS,
    where: SQL
  ): Promise<T | null> {
    const results = await db.select().from(table).where(where).limit(1);

    if (results.length === 0) {
      return null;
    }

    return DatabaseEncryptionService.decryptAfterFetch(
      tableName,
      results[0]
    ) as T;
  }

  /**
   * Insert a record with automatic encryption
   */
  static async insert<T extends Record<string, unknown>>(
    table: SQLiteTable,
    tableName: keyof typeof import("../encryption/fields").ENCRYPTED_FIELDS,
    data: T
  ): Promise<T> {
    const encryptedData = DatabaseEncryptionService.encryptForSave(
      tableName,
      data
    );
    const result = await db.insert(table).values(encryptedData).returning();
    return DatabaseEncryptionService.decryptAfterFetch(
      tableName,
      result[0]
    ) as T;
  }

  /**
   * Update records with automatic encryption
   */
  static async update<T extends Record<string, unknown>>(
    table: SQLiteTable,
    tableName: keyof typeof import("../encryption/fields").ENCRYPTED_FIELDS,
    data: Partial<T>,
    where: SQL
  ): Promise<{ changes: number }> {
    const encryptedData = DatabaseEncryptionService.encryptForSave(
      tableName,
      data
    );
    const result = await db.update(table).set(encryptedData).where(where);
    // libSQL returns different structure than better-sqlite3
    return { changes: result.rowsAffected || 0 };
  }

  /**
   * Delete records
   */
  static async delete(
    table: SQLiteTable,
    where: SQL
  ): Promise<{ changes: number }> {
    const result = await db.delete(table).where(where);
    // libSQL returns different structure than better-sqlite3
    return { changes: result.rowsAffected || 0 };
  }
}

/**
 * Convenience functions for common operations
 */
export const selectEncrypted = EncryptedDatabase.select;
export const selectOneEncrypted = EncryptedDatabase.selectOne;
export const insertEncrypted = EncryptedDatabase.insert;
export const updateEncrypted = EncryptedDatabase.update;
export const deleteEncrypted = EncryptedDatabase.delete;
