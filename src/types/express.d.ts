declare global {
  namespace Express {
    interface Response {
      requestId?: string;
    }
  }
}

export {};
