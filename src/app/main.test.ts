import fs = require("fs");
import fsPromises = require("fs/promises");
import { CompanyRecord } from "../domain/domain-objects/company";
import { PersonRecord } from "../domain/domain-objects/person";
import { FixtureDomainSqlite3DriverRepository } from "../infra/sqlite/domain-repositories/fixture-domain-sqlite-driver-repository";
import { defaultAppConfig } from "./default-app-config";
import { createFixtures, getProjectFilePath } from "./main";

const testAppConfig = {
  ...defaultAppConfig,
  fixturesPath: '/test-fixtures.sqlite3'
}

const removeFixtureFile = async () => {
  const filePath = process.cwd() + testAppConfig.fixturesPath;
  if(fs.existsSync(filePath)) await fsPromises.rm(filePath);
}

describe('main.ts test', () => {
  describe('разные утилиты', () => {
    test('получение пути к фикстурам', () => {
      const fixturesPath = getProjectFilePath(defaultAppConfig.fixturesPath);
      expect(fixturesPath.endsWith(defaultAppConfig.fixturesPath)).toBe(true);
    });

    test('не удачное получение пути к фикстурам', () => {
      const cb = () => { getProjectFilePath('notValidConfig/test-db.sqlite3') };
      expect(cb).toThrow('Не валидный путь к файлу фикстуры');
    });
  });

  describe('фикстуры создаются', () => {
    const sut = createFixtures;

    beforeEach(async () => {
      await removeFixtureFile();
    })

    afterEach(async () => {
      await removeFixtureFile();
    })

    test('записи созданы в реальной БД', async () => {
      await sut(true, 25, 5, testAppConfig);

      const sqliteRepository = new FixtureDomainSqlite3DriverRepository(
        testAppConfig.personFactoryConfig,
        testAppConfig.companyFactoryConfig,
        getProjectFilePath(testAppConfig.fixturesPath),
        'read',
      );

      const personSql = sqliteRepository['getSimpleSelectSql'](
        'persons', true, 'familyStatus'
      );
      const person = await sqliteRepository['get']<PersonRecord>(personSql);
      expect(person.familyStatus).toBe('true');

      const companySql = sqliteRepository['getSimpleSelectSql'](
        'companies', 1, 'numID'
      );
      const company = await sqliteRepository['get']<CompanyRecord>(companySql);
      expect(company.numID).toBe(1);
    })
  })
})
