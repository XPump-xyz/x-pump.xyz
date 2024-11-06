import { registerAs } from '@nestjs/config';

export default registerAs('encryption', () => ({
  masterKey: process.env.ENCRYPTION_MASTER_KEY,
}));
