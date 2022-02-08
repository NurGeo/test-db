import { defaultCompanyFactoryConfig, defaultPersonFactoryConfig } from "../../../domain/fixture-creaters/default-factory-configs";
import { FixtureDomainSqlite3DriverRepository } from "./fixture-domain-sqlite-driver-repository"

describe('FixtureDomainSqlite3DriverRepository class', () => {
  test('тестирование создания таблицы fixturesMeta', async () => {
    const sut = new FixtureDomainSqlite3DriverRepository(
      defaultPersonFactoryConfig,
      defaultCompanyFactoryConfig,
      ':memory:',
      'write',
    );
    await sut.initCollections();
    const actualResult = JSON.stringify(await sut.listCollections());
    const expectResult = JSON.stringify([
      { name: 'persons' },
      { name: 'companies' },
      { name: 'fixturesMeta' },
    ]);
    expect(actualResult).toStrictEqual(expectResult);
  })
})
