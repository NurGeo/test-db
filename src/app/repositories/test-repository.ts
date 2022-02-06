import { Company } from '../domain-objects/company';
import { Person } from '../domain-objects/person';
import { RepositoryType } from '../types';
import { Repository } from './repository';

export interface TestRepository<
  P extends Person, C extends Company
> extends Repository<P, C> {
  readonly repositoryType: RepositoryType;
}

export type GeneralTestRepository = TestRepository<Person, Company>;
