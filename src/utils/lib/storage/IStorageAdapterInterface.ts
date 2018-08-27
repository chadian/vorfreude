export default interface IStorageAdapterInterface {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
}
