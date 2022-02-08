import { PersonFactoryConfig, CompanyFactoryConfig } from '../domain/types';

export type AppConfig = {
  personFactoryConfig: PersonFactoryConfig, 

  companyFactoryConfig: CompanyFactoryConfig,

  fixturesPath: string;
}
