export interface DBClient {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}
