export class ErrorHandler {
    static throwError(message: string): never {
      throw new Error(message);
    }
  }
  