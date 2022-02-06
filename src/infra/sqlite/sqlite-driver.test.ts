import { CompanyFactory } from "../../app/domain-objects/company-factory";
import { defaultCompanyFactoryConfig, defaultPersonFactoryConfig } from "../../app/domain-objects/default-factory-configs";
import { PersonFactory } from "../../app/domain-objects/person-factory";
import { SQLite3Repository } from "./sqlite-driver"

describe('SQLite3DriverRepository class', () => {
  describe('проверка начальной инициализации', () => {
    let sut: SQLite3Repository;
    beforeEach(async () => {
      sut = new SQLite3Repository();
      await sut.open();
    });

    afterEach(async () => {
      await sut.close();
    });

    test('таблицы персон и компании создаются', async () => {
      await sut.initCollections(
        defaultPersonFactoryConfig,
        defaultCompanyFactoryConfig
      );

      const expectResult = JSON.stringify([{ name: 'persons' }, { name: 'companies' }])
      const actualResult = JSON.stringify(await sut.listCollections());

      expect(actualResult).toStrictEqual(expectResult);
    })

  })

  describe('работа с записями', () => {
    let sut: SQLite3Repository;
    const personFactory = new PersonFactory(
      defaultPersonFactoryConfig
    )
    const companyFactory = new CompanyFactory(
      defaultCompanyFactoryConfig
    )

    beforeEach(async () => {
      sut = new SQLite3Repository();
      await sut.open();
      await sut.initCollections(
        defaultPersonFactoryConfig,
        defaultCompanyFactoryConfig
      );
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
    })

    test('чтение и запись Company', async () => {
      let i = 0;
      while (i < 5) {
        const company = await companyFactory.getCompany();
        await sut.addCompany(company);
        const dbCompanyGovID = (await sut.getCompanyByGovID(company.govID)).govID;
        expect(dbCompanyGovID).toBe(company.govID);
        i += 1;
      }
    })
  })
})
