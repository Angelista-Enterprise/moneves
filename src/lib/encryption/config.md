# Database Encryption Configuration

## Environment Variables

Add the following environment variable to your `.env` file:

```bash
# Database Encryption
# Generate a secure 256-bit (32-byte) encryption key for production
# You can generate one using: openssl rand -hex 32
DATABASE_ENCRYPTION_KEY=your-256-bit-hex-encryption-key-here
```

## Generating Encryption Keys

### For Production (Recommended)
Generate a secure 256-bit hex key:
```bash
openssl rand -hex 32
```

This will output something like: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

### For Development
You can use any string (it will be hashed to 256 bits using scrypt):
```bash
DATABASE_ENCRYPTION_KEY=my-development-key-change-me
```

## Security Notes

1. **Never commit encryption keys to version control**
2. **Use different keys for different environments** (dev, staging, production)
3. **Store production keys securely** (e.g., in environment variables, secret management systems)
4. **Rotate keys periodically** in production environments
5. **Backup keys securely** - losing the key means losing access to encrypted data

## Key Management

- The encryption key is used to encrypt/decrypt all sensitive database fields
- If you lose the key, all encrypted data becomes unrecoverable
- Consider using a key management service for production deployments
- Test key rotation procedures in staging before applying to production
