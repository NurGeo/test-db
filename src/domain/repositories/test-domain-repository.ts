import {Company} from '../domain-objects/company';
import {Person} from '../domain-objects/person';
import {RepositoryType} from '../types';
import {DomainRepository} from './domain-repository';

export interface DomainTestRepository<P extends Person, C extends Company>
  extends DomainRepository<P, C> {
  readonly repositoryType: RepositoryType;
}

export type GeneralTestRepository = DomainTestRepository<Person, Company>;
