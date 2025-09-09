import crypto from "crypto";

// Encryption configuration
const ALGORITHM = "aes-256-cbc";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

/**
 * Get encryption key from environment variables
 * Falls back to a default key for development (should be changed in production)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.DATABASE_ENCRYPTION_KEY;

  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_ENCRYPTION_KEY environment variable is required in production"
      );
    }
    // Development fallback - should be changed
    console.warn(
      "[encryption] Using default encryption key for development. Change DATABASE_ENCRYPTION_KEY in production!"
    );
    return crypto.scryptSync("default-dev-key-change-me", "salt", KEY_LENGTH);
  }

  // Convert hex string to buffer if provided as hex
  if (key.length === KEY_LENGTH * 2) {
    return Buffer.from(key, "hex");
  }

  // Derive key from string using scrypt
  return crypto.scryptSync(key, "salt", KEY_LENGTH);
}

/**
 * Encrypt a string value
 * Returns base64 encoded string containing IV + encrypted data
 */
export function encrypt(
  value: string | null | undefined
): string | null | undefined {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Combine IV + encrypted data (CBC doesn't need auth tag)
    const combined = Buffer.concat([iv, Buffer.from(encrypted, "hex")]);
    return combined.toString("base64");
  } catch (error) {
    console.error("[encryption] Error encrypting value:", error);
    throw new Error("Encryption failed");
  }
}

/**
 * Decrypt a base64 encoded string
 * Expects format: IV + encrypted data
 */
export function decrypt(
  encryptedValue: string | null | undefined
): string | null | undefined {
  if (
    encryptedValue === null ||
    encryptedValue === undefined ||
    encryptedValue === ""
  ) {
    return encryptedValue;
  }

  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedValue, "base64");

    // Extract IV and encrypted data (CBC format: IV + encrypted data)
    const iv = combined.subarray(0, IV_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("[encryption] Error decrypting value:", error);
    throw new Error("Decryption failed");
  }
}

/**
 * Check if a value is encrypted (starts with our encryption prefix)
 */
export function isEncrypted(value: string | null | undefined): boolean {
  if (!value) return false;

  try {
    const combined = Buffer.from(value, "base64");
    return combined.length >= IV_LENGTH;
  } catch {
    return false;
  }
}

/**
 * Encrypt multiple fields in an object
 */
export function encryptObject<T extends Record<string, unknown>>(
  obj: T,
  fieldsToEncrypt: (keyof T)[]
): T {
  const encrypted = { ...obj };

  for (const field of fieldsToEncrypt) {
    if (field in encrypted && encrypted[field] !== undefined) {
      encrypted[field] = encrypt(encrypted[field] as string) as T[keyof T];
    }
  }

  return encrypted;
}

/**
 * Decrypt multiple fields in an object
 * Throws error if unencrypted data is found in fields that should be encrypted
 */
export function decryptObject<T extends Record<string, unknown>>(
  obj: T,
  fieldsToDecrypt: (keyof T)[]
): T {
  const decrypted = { ...obj };

  for (const field of fieldsToDecrypt) {
    if (field in decrypted && decrypted[field] !== undefined) {
      const value = decrypted[field] as string;

      if (value !== null && value !== undefined && value !== "") {
        // Check if the value is already encrypted
        if (isEncrypted(value)) {
          try {
            decrypted[field] = decrypt(value) as T[keyof T];
          } catch (error) {
            throw new Error(
              `[Encryption] Failed to decrypt field '${String(field)}': ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        } else {
          // Value is not encrypted but should be - this is an error
          throw new Error(
            `[Encryption] Field '${String(
              field
            )}' contains unencrypted data but should be encrypted. This indicates a data integrity issue that needs to be resolved.`
          );
        }
      }
    }
  }

  return decrypted;
}
