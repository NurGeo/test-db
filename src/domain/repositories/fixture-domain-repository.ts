import {CompanyRecord} from '../domain-objects/company';
import {PersonRecord} from '../domain-objects/person';
import {DomainRepository} from './domain-repository';

export interface FixtureDomainRepository<
  P extends PersonRecord,
  C extends CompanyRecord
> extends DomainRepository<P, C> {
  fixturesMetaCollectionsName: 'fixturesMeta';
}

export type GeneralFixtureDomainRepository = FixtureDomainRepository<
  PersonRecord, CompanyRecord
>;
