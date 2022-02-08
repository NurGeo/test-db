import { CompanyRecord } from "../../../domain/domain-objects/company";
import { PersonRecord } from "../../../domain/domain-objects/person";
import { FixtureDomainRepository } from "../../../domain/repositories/fixture-domain-repository";
import { DomainSQLite3DriverRepository } from "./domain-sqlite-driver";

export class FixtureDomainSqlite3DriverRepository
  extends DomainSQLite3DriverRepository
  implements FixtureDomainRepository<PersonRecord, CompanyRecord>
{
  fixturesMetaCollectionsName: 'fixturesMeta' = 'fixturesMeta';

  async initCollections(): Promise<void> {
    await super.initCollections();
    const createFixturesTableSQL = `
      CREATE TABLE ${this.fixturesMetaCollectionsName} (
        numID INTEGER PRIMARY KEY
      )
    `;
        //govID VARCHAR(${this.companyConfig.govIDdigitLength}),
        //objID VARCHAR(${this.personConfig.objIDByteLength * 2}),
        //name varchar(${this.personConfig.firstNameLength}),
        //employees TEXT
    await this.run(createFixturesTableSQL);
  }
}
