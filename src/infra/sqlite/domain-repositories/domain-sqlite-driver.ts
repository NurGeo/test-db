import {CompanyRecord} from '../../../domain/domain-objects/company';
import {PersonRecord} from '../../../domain/domain-objects/person';
import {DomainRepository} from '../../../domain/repositories/domain-repository';
import {CompanyFactoryConfig, PersonFactoryConfig} from '../../../domain/types';
import {SQLite3DriverRepository} from '../sqlite-driver';

type StringEmployeesCompany = Omit<CompanyRecord, 'employees'> & {
  employees: string,
}

export class DomainSQLite3DriverRepository
  extends SQLite3DriverRepository
  implements DomainRepository<PersonRecord, CompanyRecord>
{
  personCollectionsName: 'persons' = 'persons';

  companyCollectionsName: 'companies' = 'companies';

  protected personConfig: PersonFactoryConfig;

  protected companyConfig: CompanyFactoryConfig;

  constructor(
    personConfig: PersonFactoryConfig,
    companyConfig: CompanyFactoryConfig,
    filePath: string,
    mode: 'read' | 'write'
  ) {
    super(filePath, mode);
    this.personConfig = personConfig;
    this.companyConfig = companyConfig;
  }

  async initCollections(): Promise<void> {
    const createPersonTableSQL = `
      CREATE TABLE ${this.personCollectionsName} (
        numID INTEGER PRIMARY KEY,
        govID VARCHAR(${
          this.personConfig.govIDdigitLength
        }) UNIQUE ON CONFLICT ABORT,
        objID VARCHAR(${
          this.personConfig.objIDByteLength * 2
        }) UNIQUE ON CONFLICT ABORT,
        firstName VARCHAR(${
          this.personConfig.firstNameLength
        }) NOT NULL ON CONFLICT ABORT,
        lastName VARCHAR(${
          this.personConfig.lastNameLength
        }) NOT NULL ON CONFLICT ABORT,
        age INTEGER NOT NULL ON CONFLICT ABORT,
        familyStatus BOOLEAN NOT NULL ON CONFLICT ABORT,
        companyID VARCHAR(${this.companyConfig.govIDdigitLength})
          REFERENCES ${this.companyCollectionsName}
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`;
    await this.run(createPersonTableSQL);

    const createCompanyTableSQL = `
      CREATE TABLE ${this.companyCollectionsName} (
        numID INTEGER PRIMARY KEY,
        govID VARCHAR(${this.companyConfig.govIDdigitLength}),
        objID VARCHAR(${this.personConfig.objIDByteLength * 2}),
        name varchar(${this.personConfig.firstNameLength}),
        employees TEXT
      )
    `;
    await this.run(createCompanyTableSQL);
  }

  async listCollections(): Promise<{name: string}[]> {
    const listTablesSQL = `
      SELECT name FROM sqlite_master
      WHERE type = 'table'
    `;
    const result = await this.all<{name: string}[]>(listTablesSQL);
    return result;
  }

  async addPerson(person: PersonRecord): Promise<void> {
    const insertSQL = this.getInsertSQL(this.personCollectionsName, person);
    await this.run(insertSQL);
  }

  async addCompany(company: CompanyRecord): Promise<void> {
    const insertSQL = this.getInsertSQL(
      this.companyCollectionsName,
      this.employeesToString(company),
    );
    await this.run(insertSQL);
  }

  async getPersonByGovID(id: string): Promise<PersonRecord> {
    return await this.get(
      this.getSimpleSelectSql(this.personCollectionsName, id)
    );
  }

  async getCompanyByGovID(id: string): Promise<CompanyRecord> {
    return await this.get(
      this.getSimpleSelectSql(this.companyCollectionsName, id)
    );
  }

  protected employeesToString(company: CompanyRecord): StringEmployeesCompany {
    return { ...company, employees: company.employees.join(',') }
  }

  protected employeesToArray(company: StringEmployeesCompany): CompanyRecord {
    return { ...company, employees: ','.split(company.employees) }
  }
}
