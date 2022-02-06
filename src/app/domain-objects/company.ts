import {Person} from './person';

/** BaseCompany */
export type Company = {
  govID: string;
  name: string;
};

export type ObjIDCompany = Company & {
  objID: string;
}

export type NumIDCompany = Company & {
  numID: number;
}

/** for fixtures record */
export type CompanyNoSQLRecord = ObjIDCompany & NumIDCompany & {
  employees: Person['govID'][];
};

/** for fixtures record */
export type CompanyRecord = ObjIDCompany & NumIDCompany & {
  employees: string;
};
