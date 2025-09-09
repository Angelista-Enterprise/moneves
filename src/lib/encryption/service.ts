import { encrypt, decrypt, encryptObject, isEncrypted } from "./index";
import { getEncryptedFields, shouldEncryptField } from "./fields";

/**
 * Database encryption service
 * Provides methods to encrypt/decrypt data for database operations
 */
export class DatabaseEncryptionService {
  /**
   * Encrypt data before saving to database
   */
  static encryptForSave<T extends Record<string, unknown>>(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    data: T
  ): T {
    const encryptedFields = getEncryptedFields(tableName);

    if (encryptedFields.length === 0) {
      return data;
    }

    return encryptObject(data, encryptedFields as (keyof T)[]);
  }

  /**
   * Decrypt data after fetching from database
   * Throws error if unencrypted data is found in fields that should be encrypted
   */
  static decryptAfterFetch<T extends Record<string, unknown>>(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    data: T
  ): T {
    const encryptedFields = getEncryptedFields(tableName);

    if (encryptedFields.length === 0) {
      return data;
    }

    const result = { ...data };

    for (const field of encryptedFields) {
      const value = result[field] as string | null | undefined;

      if (value !== null && value !== undefined && value !== "") {
        // Check if the value is already encrypted
        if (isEncrypted(value)) {
          try {
            (result as Record<string, unknown>)[field] = decrypt(value);
          } catch (error) {
            throw new Error(
              `[Encryption] Failed to decrypt field '${field}' in table '${tableName}': ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        } else {
          // Value is not encrypted but should be - this is an error
          throw new Error(
            `[Encryption] Field '${field}' in table '${tableName}' contains unencrypted data but should be encrypted. This indicates a data integrity issue that needs to be resolved.`
          );
        }
      }
    }

    return result;
  }

  /**
   * Decrypt multiple records after fetching from database
   */
  static decryptMultipleAfterFetch<T extends Record<string, unknown>>(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    records: T[]
  ): T[] {
    return records.map((record) => this.decryptAfterFetch(tableName, record));
  }

  /**
   * Encrypt a single field value
   */
  static encryptField(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    fieldName: string,
    value: string | null | undefined
  ): string | null | undefined {
    if (!shouldEncryptField(tableName, fieldName)) {
      return value as string | null | undefined;
    }

    return encrypt(value);
  }

  /**
   * Decrypt a single field value
   */
  static decryptField(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    fieldName: string,
    value: string | null | undefined
  ): string | null | undefined {
    if (!shouldEncryptField(tableName, fieldName)) {
      return value as string | null | undefined;
    }

    return decrypt(value);
  }

  /**
   * Check if a field value is encrypted
   */
  static isFieldEncrypted(
    tableName: keyof typeof import("./fields").ENCRYPTED_FIELDS,
    fieldName: string,
    value: string | null | undefined
  ): boolean {
    if (!shouldEncryptField(tableName, fieldName)) {
      return false;
    }

    return value !== null && value !== undefined && value.length > 0;
  }
}

/**
 * Convenience functions for common database operations
 */
export const encryptForSave = DatabaseEncryptionService.encryptForSave;
export const decryptAfterFetch = DatabaseEncryptionService.decryptAfterFetch;
export const decryptMultipleAfterFetch =
  DatabaseEncryptionService.decryptMultipleAfterFetch;
export const encryptField = DatabaseEncryptionService.encryptField;
export const decryptField = DatabaseEncryptionService.decryptField;
export const isFieldEncrypted = DatabaseEncryptionService.isFieldEncrypted;
