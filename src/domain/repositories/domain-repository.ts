import {Company} from '../domain-objects/company';
import {Person} from '../domain-objects/person';

/** Repository for test-db project */
export interface DomainRepository<P extends Person, C extends Company> {
  personCollectionsName: 'persons';

  companyCollectionsName: 'companies';

  initCollections(): Promise<void>

  listCollections(): Promise<{name: string}[]>

  addPerson(person: P): Promise<void>;

  addCompany(company: C): Promise<void>;

  getPersonByGovID(id: string): Promise<P>;

  getCompanyByGovID(id: string): Promise<C>;
}

export type GeneralDomainRepository = DomainRepository<Person, Company>;
