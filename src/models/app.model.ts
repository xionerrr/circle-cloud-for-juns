export interface I_GetData<T> {
  message: string
  data: T
  timestamp: Date
}

export enum E_ServerStatus {
  OK = '200',
  FORBIDDEN = '403',
  NOTFOUND = '404',
}
