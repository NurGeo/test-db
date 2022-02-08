import { defaultCompanyFactoryConfig, defaultPersonFactoryConfig } from '../domain/fixture-creaters/default-factory-configs';

export const defaultAppConfig = {
  personFactoryConfig: defaultPersonFactoryConfig, 

  companyFactoryConfig: defaultCompanyFactoryConfig,

  fixturesPath: 'src/fixtures.sqlite3',
}
