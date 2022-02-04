/** BaseUser */
export type User = {
  govID: string;
  fName: string;
  lName: string;
  age: number;
  familyStatus: boolean;
  companyID: string;
};

export type ObjIDUser = User & {
  objID: string;
};

export type NumIDUser = User & {
  numID: number;
};

/** for fixtures record */
export type UserRecord = ObjIDUser & NumIDUser;
