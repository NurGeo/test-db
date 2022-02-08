import {CompanyFactoryConfig} from '../types';
import {CompanyRecord} from '../domain-objects/company';
import {DomainObjectFactory} from './domain-object-factory';

export class CompanyFactory extends DomainObjectFactory<CompanyFactoryConfig> {
  async getCompany(): Promise<CompanyRecord> {
    return {
      numID: this.nextNumID(),
      govID: this.nextGovID(),
      objID: this.nextObjID(),
      name: this.nextName(),
      employees: [],
    };
  }

  protected nextName(): string {
    return super.nextRandomString(
      this.config.nameCharacters,
      this.config.nameLength
    );
  }
}
