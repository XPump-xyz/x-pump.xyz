import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  error(message: string, trace: string) {
    // Add custom error handling logic here
    super.error(message, trace);
  }
}
