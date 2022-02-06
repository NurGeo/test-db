import { assert } from "console";
import { CompanyFactory } from "../domain-objects/company-factory";
import { PersonRecord } from "../domain-objects/person";
import { PersonFactory } from "../domain-objects/person-factory";
import { FixtureRepository } from "../repositories/fixture-repository";

export class FixtureCreater {
  constructor (
    protected personFactory: PersonFactory,
    protected companyFactory: CompanyFactory,
    protected fixtureRepo: FixtureRepository,
  ) {}

  async addFixtures(personsCount: number, avgEmployeesCount: number): Promise<void> {
    assert(personsCount >= 0);
    assert(avgEmployeesCount > 0);

    let personIndex = 0;


    for(personIndex; personIndex < personsCount; personIndex) {
      const employees = await this.getEmployees(avgEmployeesCount);

      const company = await this.companyFactory.getCompany();
      company.employees = employees.map((employee) => employee.govID).join(',');
      await this.fixtureRepo.addCompany(company);

      employees.forEach((employee) => { employee.companyID = company.govID })
      await this.addPersons(employees);
      personIndex += employees.length;
    }
  }

  protected async getEmployees(avgEmployeesCount: number): Promise<PersonRecord[]> {
    const employees = [];
    const currentCompanyEmployeesCount = Math.floor(Math.random() * avgEmployeesCount * 2);
    let employeesIndex = 0;

    for(employeesIndex; employeesIndex < currentCompanyEmployeesCount; employeesIndex += 1) {
      employees.push(await this.personFactory.getPerson());
    }
    return employees;
  }

  protected async addPersons(persons: PersonRecord[]): Promise<void> {
    const promises = persons.map(
      (person): Promise<void> => { return this.fixtureRepo.addPerson(person) }
    );
    await Promise.all(promises);
  }
}
