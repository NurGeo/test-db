import {CompanyRecord} from '../domain-objects/company';
import {CompanyFactory} from './company-factory';
import {
  defaultCompanyFactoryConfig,
  defaultPersonFactoryConfig,
} from './default-factory-configs';
import {PersonRecord} from '../domain-objects/person';
import {PersonFactory} from './person-factory';
import {FixtureDomainRepository} from '../repositories/fixture-domain-repository';
import {FixtureCreater} from './fixture-creater';

describe('FixtureCreater class', () => {
  class TestFixtureRepository
    implements FixtureDomainRepository<PersonRecord, CompanyRecord>
  {
    fixturesMetaCollectionsName: 'fixturesMeta' = 'fixturesMeta';

    personCollectionsName: 'persons' = 'persons';

    companyCollectionsName: 'companies' = 'companies';

    protected collections: Record<string, any> = {};

    async initCollections(): Promise<void> {
      this.collections[this.personCollectionsName] = {};
      this.collections[this.companyCollectionsName] = {};
      this.collections[this.fixturesMetaCollectionsName] = {};
    }

    async listCollections(): Promise<{ name: string; }[]> {
      const arr: Record<'name', string>[] = [];
      Object.keys(this.collections).forEach((key) => {
        arr.push({ name: key });
      });
      return arr;
    }
    
    async addPerson(person: PersonRecord): Promise<void> {
      this.getPersonCollections()[person.govID] = person;
    }

    async addCompany(company: CompanyRecord): Promise<void> {
      this.getCompanyCollections()[company.govID] = company;
    }

    async getPersonByGovID(id: string): Promise<PersonRecord> {
      return this.getPersonCollections()[id];
    }

    async getCompanyByGovID(id: string): Promise<CompanyRecord> {
      return this.getCompanyCollections()[id];
    }

    getPersonsKeys(): string[] {
      return Object.keys(this.getPersonCollections());
    }

    getCompaniesKeys(): string[] {
      return Object.keys(this.getCompanyCollections());
    }

    private getPersonCollections(): Record<string, any> {
      return this.collections[this.personCollectionsName];
    }

    private getCompanyCollections(): Record<string, any> {
      return this.collections[this.companyCollectionsName];
    }
  }

  const personFactory = new PersonFactory(defaultPersonFactoryConfig);

  const companyFactory = new CompanyFactory(defaultCompanyFactoryConfig);

  describe('таблицы добавляются', () => {
    test('', async () => {
      const testRepo = new TestFixtureRepository();
      await testRepo.initCollections();

      const collectionsNames = await testRepo.listCollections();
      const expectCollectionsNames = [
        { name: 'persons' },
        { name: 'companies' },
        { name: 'fixturesMeta' }
      ];
      expect(collectionsNames).toStrictEqual(expectCollectionsNames);
    })
  })

  describe('персоны добавляются', () => {
    let sut: FixtureCreater;
    let testRepo: TestFixtureRepository;

    beforeEach(async () => {
      testRepo = new TestFixtureRepository();
      await testRepo.initCollections();
      sut = new FixtureCreater(personFactory, companyFactory, testRepo);
    });

    test('в репозитории добавляется нобходиое количество персон', async () => {
      await sut.addFixtures(10, 2);
      const keys = testRepo.getPersonsKeys();
      expect(keys.length >= 10).toBe(true);
      expect(await testRepo.getPersonByGovID(keys[3])).toBeTruthy();
    });

    test('в репозитории добавляются компании', async () => {
      await sut.addFixtures(10, 2);
      const keys = testRepo.getCompaniesKeys();
      expect(keys.length > 0).toBe(true);
      expect(await testRepo.getCompanyByGovID(keys[3])).toBeTruthy();
    });
  });
});
