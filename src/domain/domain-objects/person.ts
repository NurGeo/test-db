/** BasePerson */
export type Person = {
  govID: string;
  firstName: string;
  lastName: string;
  age: number;
  familyStatus: boolean;
  companyID?: string;
};

export type ObjIDPerson = Person & {
  objID: string;
};

export type NumIDPerson = Person & {
  numID: number;
};

/** for fixtures record */
export type PersonRecord = ObjIDPerson & NumIDPerson;
