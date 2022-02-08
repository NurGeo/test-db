import path = require("path");
import fs = require("fs");
import assert = require("assert");
import { FixtureDomainSqlite3DriverRepository } from "../infra/sqlite/domain-repositories/fixture-domain-sqlite-driver-repository";
import { defaultAppConfig } from "./default-app-config";
import { PersonFactory } from "../domain/fixture-creaters/person-factory";
import { CompanyFactory } from "../domain/fixture-creaters/company-factory";
import { FixtureCreater } from "../domain/fixture-creaters/fixture-creater";
import { AppConfig } from "./types";

export function getProjectFilePath(filePath: string): string {
    const fullFilePath = path.join(process.cwd(), '/', filePath);
    const dirPath = path.dirname(filePath);
    const pathIsCorrect = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
    assert(pathIsCorrect, 'Не валидный путь к файлу фикстуры');
    return fullFilePath;
}

export async function createFixtures(
  newFixtures: boolean,
  personCount: number,
  avgEmployeesCount: number,
  appConfig?: AppConfig,
): Promise<true | string> {
  try {
    const currentConfig = appConfig ?? defaultAppConfig;
    const fixturesRepository = new FixtureDomainSqlite3DriverRepository(
      currentConfig.personFactoryConfig,
      currentConfig.companyFactoryConfig,
      getProjectFilePath(currentConfig.fixturesPath),
      'write'
    );
    const personFactory = new PersonFactory(currentConfig.personFactoryConfig);
    const companyFactory = new CompanyFactory(currentConfig.companyFactoryConfig);

    const creator = new FixtureCreater(
      personFactory,
      companyFactory,
      fixturesRepository,
    );
    await creator.addFixturesToNewRepository(personCount, avgEmployeesCount);
    return true;
  } catch(err) {
    return (err as Error).message;
  }
}
