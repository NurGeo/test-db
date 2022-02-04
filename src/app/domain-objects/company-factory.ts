import { CompanyFactoryConfig } from "../types";
import { CompanyRecord } from "./company";
import { DomainObjectFactory } from "./domain-object-factory";

export class CompanyFactory extends DomainObjectFactory<
  CompanyFactoryConfig
>{
  getCompany(): CompanyRecord {
    return {
      numID: this.nextNumID(),
      govID: this.nextGovID(),
      name: this.nextName(),
      employees: []
    }
  }

  protected nextName(): string {
    return super.nextRandomString(
      this.config.nameCharacters,
      this.config.nameLength
    )
  }
}
