// src/services/encryption.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 12;
  private readonly saltLength = 16;
  private readonly tagLength = 16;
  private readonly iterations = 100000;
  private readonly digest = 'sha256';

  constructor(private configService: ConfigService) {}

  /**
   * Encrypts sensitive data using AES-256-GCM
   * @param text - The text to encrypt
   * @param masterKey - The master encryption key
   * @returns Base64 encoded encrypted data
   */
  async encrypt(text: string, masterKey: string): Promise<string> {
    try {
      // Generate random salt and IV
      const salt = crypto.randomBytes(this.saltLength);
      const iv = crypto.randomBytes(this.ivLength);

      // Derive encryption key using PBKDF2
      const key = await this.deriveKey(masterKey, salt);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt the text
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
      ]);

      // Get authentication tag
      const tag = cipher.getAuthTag();

      // Combine all elements needed for decryption
      const result = Buffer.concat([
        salt, // 16 bytes
        iv, // 12 bytes
        tag, // 16 bytes
        encrypted, // Rest of the data
      ]);

      return result.toString('base64');
    } catch (error) {
      this.logger.error(`Encryption failed: ${error.message}`);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts encrypted data
   * @param encryptedData - Base64 encoded encrypted data
   * @param masterKey - The master encryption key
   * @returns Decrypted text
   */
  async decrypt(encryptedData: string, masterKey: string): Promise<string> {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(encryptedData, 'base64');

      // Extract components
      const salt = buffer.slice(0, this.saltLength);
      const iv = buffer.slice(this.saltLength, this.saltLength + this.ivLength);
      const tag = buffer.slice(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.tagLength,
      );
      const encrypted = buffer.slice(
        this.saltLength + this.ivLength + this.tagLength,
      );

      // Derive key using the same salt
      const key = await this.deriveKey(masterKey, salt);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(tag);

      // Decrypt the data
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      this.logger.error(`Decryption failed: ${error.message}`);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Derives encryption key from master key and salt using PBKDF2
   * @param masterKey - Master encryption key
   * @param salt - Random salt
   * @returns Derived key
   */
  private async deriveKey(masterKey: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        masterKey,
        salt,
        this.iterations,
        this.keyLength,
        this.digest,
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        },
      );
    });
  }

  /**
   * Generates a random encryption key
   * @returns Random encryption key
   */
  generateEncryptionKey(): string {
    return crypto.randomBytes(this.keyLength).toString('base64');
  }

  /**
   * Hashes sensitive data using SHA-256
   * @param data - Data to hash
   * @returns Hashed data
   */
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
