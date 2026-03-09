export default class ClientError extends Error {
  public status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status ?? 400;
    this.name = 'ClientError';
  }
}
