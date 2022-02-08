import {CompanyFactory} from '../../../domain/fixture-creaters/company-factory';
import {
  defaultCompanyFactoryConfig,
  defaultPersonFactoryConfig,
} from '../../../domain/fixture-creaters/default-factory-configs';
import {PersonFactory} from '../../../domain/fixture-creaters/person-factory';
import {DomainSQLite3DriverRepository} from './domain-sqlite-driver';

describe('DomainSQLite3DriverRepository class', () => {
  describe('проверка начальной инициализации', () => {
    let sut: DomainSQLite3DriverRepository;
    beforeEach(async () => {
      sut = new DomainSQLite3DriverRepository(
        defaultPersonFactoryConfig,
        defaultCompanyFactoryConfig,
        ':memory:',
        'write',
      );
    });

    afterEach(async () => {
      await sut.close();
    });

    test('таблицы персон и компании создаются', async () => {
      await sut.initCollections();

      const expectResult = JSON.stringify([
        {name: 'persons'},
        {name: 'companies'},
      ]);
      const actualResult = JSON.stringify(await sut.listCollections());

      expect(actualResult).toStrictEqual(expectResult);
    });
  });

  describe('работа с записями', () => {
    let sut: DomainSQLite3DriverRepository;
    const personFactory = new PersonFactory(defaultPersonFactoryConfig);
    const companyFactory = new CompanyFactory(defaultCompanyFactoryConfig);

    beforeEach(async () => {
      sut = new DomainSQLite3DriverRepository(
        defaultPersonFactoryConfig,
        defaultCompanyFactoryConfig,
        ':memory:',
        'write',
      );
      await sut.initCollections();
    });

    afterEach(async () => {
      await sut.close();
    });

    test('чтение и запись Person', async () => {
      let i = 0;
      while (i < 5) {
        const person = await personFactory.getPerson();
        await sut.addPerson(person);
        const dbPersonGovID = (await sut.getPersonByGovID(person.govID)).govID;
        expect(dbPersonGovID).toBe(person.govID);
        i += 1;
      }
    });

    test('чтение и запись Company', async () => {
      let i = 0;
      while (i < 5) {
        const company = await companyFactory.getCompany();
        await sut.addCompany(company);
        const dbCompanyGovID = (await sut.getCompanyByGovID(company.govID))
          .govID;
        expect(dbCompanyGovID).toBe(company.govID);
        i += 1;
      }
    });
  });
});
