import { CompanyRecord } from "../domain-objects/company";
import { CompanyFactory } from "../domain-objects/company-factory";
import { defaultCompanyFactoryConfig, defaultPersonFactoryConfig } from "../domain-objects/default-factory-configs";
import { PersonRecord } from "../domain-objects/person";
import { PersonFactory } from "../domain-objects/person-factory";
import { FixtureRepository } from "../repositories/fixture-repository";
import { FixtureCreater } from "./fixture-creater";

describe('FixtureCreater class', () => {
  class TestFixtureRepository implements FixtureRepository {
    personCollectionsName: "persons" = 'persons';

    companyCollectionsName: "companies" = 'companies';

    protected persons: Record<PersonRecord['govID'], PersonRecord> = {};

    protected companies: Record<CompanyRecord['govID'], CompanyRecord> = {};

    async addPerson(person: PersonRecord): Promise<void> {
      this.persons[person.govID] = person;
    }

    async addCompany(company: CompanyRecord): Promise<void> {
      this.companies[company.govID] = company;
    }

    async getPersonByGovID(id: string): Promise<PersonRecord> {
      return this.persons[id];
    }

    async getCompanyByGovID(id: string): Promise<CompanyRecord> {
      return this.companies[id];
    }

    getPersonsKeys(): string[] {
      return Object.keys(this.persons);
    }

    getCompaniesKeys(): string[] {
      return Object.keys(this.companies);
    }
  }

  const personFactory = new PersonFactory(defaultPersonFactoryConfig);

  const companyFactory = new CompanyFactory(defaultCompanyFactoryConfig);

  describe('персоны добавляются', () => {
    test('в репозитории добавляется нобходиое количество персон', async () => {
      const testRepo = new TestFixtureRepository();
      const sut = new FixtureCreater(personFactory, companyFactory, testRepo);

      await sut.addFixtures(10, 2);
      const keys = testRepo.getPersonsKeys();
      expect(keys.length >= 10).toBe(true);
      expect(await testRepo.getPersonByGovID(keys[3])).toBeTruthy();
    });

    test('в репозитории добавляются компании', async () => {
      const testRepo = new TestFixtureRepository();
      const sut = new FixtureCreater(personFactory, companyFactory, testRepo);

      await sut.addFixtures(10, 2);
      const keys = testRepo.getCompaniesKeys();
      expect(keys.length > 0).toBe(true);
      expect(await testRepo.getCompanyByGovID(keys[3])).toBeTruthy();
      const company = await testRepo.getCompanyByGovID(keys[3]);
    })
  });
});
