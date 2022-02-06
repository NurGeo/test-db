import { CompanyFactoryConfig, PersonFactoryConfig } from "../types";

const defNameCharacters = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789' +
  'ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ' +
  'йцукенгшщзхъфывапролджэячсмитьбю'
);

export const defaultPersonFactoryConfig: PersonFactoryConfig = {
  ageMaxValue: 60,
  ageMinValue: 12,
  lastNameLength: 50,
  firstNameLength: 50,
  lastNameCharacters: defNameCharacters,
  firstNameCharacters: defNameCharacters,
  objIDByteLength: 12,
  govIDdigitLength: 12,
}

export const defaultCompanyFactoryConfig: CompanyFactoryConfig = {
  objIDByteLength: 12,
  nameLength: 50,
  nameCharacters: defNameCharacters,
  govIDdigitLength: 12,
}
