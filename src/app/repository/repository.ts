import { NumIDUser, ObjIDUser, User } from "../domain-objects/user";
import { RepositoryType } from "../types";

export interface Repository {
  readonly repositoryType: RepositoryType;

  addUser(user: User): void

  getUserByNumID(id: number): NumIDUser

  getUserByObjID(id: string): ObjIDUser

  getUserByGovID(govID: string): User
}
