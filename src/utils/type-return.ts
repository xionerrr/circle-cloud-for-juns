import { UpdateResult, DeleteResult, InsertResult } from 'typeorm'

export const typeReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>,
): Promise<T> => {
  return await mutation.then((res) => res.raw[0])
}
