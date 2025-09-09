# Database Encryption Implementation

This document describes the comprehensive database encryption system implemented for the Claru application.

## Overview

All sensitive data stored in the database is now automatically encrypted using AES-256-GCM encryption. The system provides transparent encryption/decryption for database operations while maintaining application functionality.

## Architecture

### Core Components

1. **Encryption Utilities** (`src/lib/encryption/index.ts`)
   - Core encrypt/decrypt functions using AES-256-GCM
   - Secure key management with environment variables
   - Base64 encoding for database storage

2. **Field Configuration** (`src/lib/encryption/fields.ts`)
   - Defines which fields in each table should be encrypted
   - Centralized configuration for easy maintenance

3. **Database Service** (`src/lib/encryption/service.ts`)
   - High-level service for encrypting/decrypting objects
   - Automatic field detection and processing

4. **Encrypted Database Wrapper** (`src/lib/db/encrypted-db.ts`)
   - Drop-in replacement for Drizzle ORM operations
   - Automatic encryption on save, decryption on fetch

## Encrypted Fields

The following fields are automatically encrypted:

### Users Table
- `email` - User email addresses
- `name` - User names
- `password` - Hashed passwords (additional security layer)
- `avatar` - Avatar URLs
- `image` - Profile images
- `bunqApiKey` - API keys (highly sensitive)

### Accounts Table (OAuth)
- `refresh_token` - OAuth refresh tokens
- `access_token` - OAuth access tokens
- `id_token` - OAuth ID tokens
- `session_state` - Session state data

### Sessions Table
- `sessionToken` - Session tokens

### Verification Tokens Table
- `token` - Verification tokens

### User Accounts Table
- `name` - Account names
- `iban` - Bank account IBANs

### Account Mappings Table
- `bunqAccountName` - Bunq account names
- `bunqAccountIban` - Bunq account IBANs

### Budget Categories Table
- `name` - Category names

### Budget Insights Table
- `title` - Insight titles
- `description` - Insight descriptions

### Budget Achievements Table
- `title` - Achievement titles
- `description` - Achievement descriptions

### Transactions Table
- `description` - Transaction descriptions

### Savings Goals Table
- `name` - Goal names

### Transaction Categories Table
- `name` - Category names

## Usage

### Environment Configuration

Set the encryption key in your environment:

```bash
# Generate a secure key
openssl rand -hex 32

# Set in .env file
DATABASE_ENCRYPTION_KEY=your-256-bit-hex-key-here
```

### Using Encrypted Database Operations

Replace standard Drizzle operations with encrypted versions:

```typescript
// Before (unencrypted)
const users = await db.select().from(users).where(eq(users.id, userId));
const newUser = await db.insert(users).values(userData).returning();

// After (encrypted)
const users = await selectEncrypted(users, 'users', { where: eq(users.id, userId) });
const newUser = await insertEncrypted(users, 'users', userData);
```

### Manual Encryption/Decryption

```typescript
import { encrypt, decrypt } from '@/lib/encryption';
import { DatabaseEncryptionService } from '@/lib/encryption/service';

// Encrypt a single value
const encrypted = encrypt('sensitive data');

// Decrypt a value
const decrypted = decrypt(encrypted);

// Encrypt/decrypt objects
const encryptedObj = DatabaseEncryptionService.encryptForSave('users', userData);
const decryptedObj = DatabaseEncryptionService.decryptAfterFetch('users', encryptedData);
```


## Security Features

### Encryption Algorithm
- **AES-256-GCM**: Authenticated encryption with associated data
- **Random IV**: Each encryption uses a unique initialization vector
- **Authentication Tag**: Prevents tampering and ensures data integrity
- **AAD**: Additional authenticated data for context

### Key Management
- **Environment Variables**: Keys stored in environment, not code
- **Scrypt Derivation**: String keys are derived using scrypt
- **Development Fallback**: Safe default for development (must be changed for production)

### Data Protection
- **Transparent Operation**: Application code doesn't need to handle encryption
- **Automatic Processing**: All sensitive fields encrypted/decrypted automatically
- **Type Safety**: Full TypeScript support with proper typing

## Testing

### Unit Tests

Comprehensive test suite covers:
- Encryption/decryption functionality
- Field configuration
- Database service operations
- Edge cases and error handling

Run tests:
```bash
npm test src/lib/encryption/__tests__/encryption.test.ts
```

### Test Coverage
- ✅ Basic encryption/decryption
- ✅ Null/undefined handling
- ✅ Special characters and Unicode
- ✅ Long strings
- ✅ Object encryption/decryption
- ✅ Field configuration
- ✅ Database service operations

## API Integration

### Updated Routes

The following API routes have been updated to use encryption:

- `/api/auth/register` - User registration with encrypted user data
- `/api/transactions` - Transaction operations with encrypted descriptions
- `/api/budget-categories` - Budget category operations with encrypted names
- Additional routes can be updated following the same pattern

### Backward Compatibility

- **API Responses**: No changes to API response format
- **Client Code**: No changes required in frontend code

## Performance Considerations

### Encryption Overhead
- **Minimal Impact**: AES-256-GCM is highly optimized
- **Selective Encryption**: Only sensitive fields are encrypted
- **Efficient Storage**: Base64 encoding adds ~33% size overhead

### Optimization Strategies
- **Batch Operations**: Multiple records processed together
- **Lazy Decryption**: Data decrypted only when needed
- **Caching**: Consider caching decrypted data for frequently accessed records

## Troubleshooting

### Common Issues

1. **Missing Encryption Key**
   ```
   Error: DATABASE_ENCRYPTION_KEY environment variable is required
   ```
   Solution: Set the environment variable with a valid encryption key

2. **Decryption Failures**
   ```
   Error: Decryption failed
   ```
   Solution: Verify the encryption key matches the one used for encryption


### Debug Mode

Enable debug logging:
```typescript
// Add to your environment
DEBUG_ENCRYPTION=true
```

## Best Practices

### Production Deployment

1. **Generate Strong Keys**: Use `openssl rand -hex 32` for production keys
2. **Secure Storage**: Store keys in secure environment variable management
3. **Key Rotation**: Plan for periodic key rotation
4. **Backup Keys**: Securely backup encryption keys
5. **Monitor Performance**: Watch for encryption-related performance impacts

### Development

1. **Use Different Keys**: Use different keys for each environment
2. **Verify Encryption**: Check that sensitive data is actually encrypted in the database
3. **Update Tests**: Ensure tests work with encrypted data

### Security

1. **Never Log Keys**: Never log encryption keys or sensitive data
2. **Secure Transmission**: Use HTTPS for all API communications
3. **Access Control**: Implement proper access controls for encrypted data
4. **Audit Logging**: Log access to sensitive encrypted data

## Future Enhancements

### Planned Features

1. **Key Rotation**: Automated key rotation with data re-encryption
2. **Field-Level Permissions**: Different encryption keys for different data types
3. **Performance Optimization**: Caching and optimization improvements
4. **Monitoring**: Encryption performance and health monitoring
5. **Compliance**: GDPR and other regulatory compliance features

### Integration Opportunities

1. **External Key Management**: Integration with AWS KMS, Azure Key Vault, etc.
2. **Hardware Security**: Hardware security module (HSM) integration
3. **Zero-Knowledge**: Client-side encryption for maximum privacy
4. **Audit Trail**: Comprehensive audit logging for encrypted data access

## Support

For issues or questions regarding the encryption implementation:

1. Check this documentation first
2. Review the test cases for usage examples
3. Verify environment configuration
4. Test with sample data in development

The encryption system is designed to be robust, secure, and easy to use while maintaining the existing application functionality.
