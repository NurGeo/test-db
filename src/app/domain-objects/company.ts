import {ObjIDUser} from './user';

/** BaseCompany */
export type Company = {
  govID: string;
  numID: number;
  name: string;
};

/** for fixtures record */
export type CompanyRecord = Company & {
  employees: ObjIDUser['objID'][];
};
