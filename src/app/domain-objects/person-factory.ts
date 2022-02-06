import { PersonFactoryConfig } from "../types";
import { DomainObjectFactory } from "./domain-object-factory";
import { PersonRecord } from "./person";

export class PersonFactory extends DomainObjectFactory<PersonFactoryConfig>{

  async getPerson(): Promise<PersonRecord> {
    return {
      numID: this.nextNumID(),
      govID: this.nextGovID(),
      objID: this.nextObjID(),
      firstName: this.nextName('firstName'),
      lastName: this.nextName('lastName'),
      age: this.nextAge(),
      familyStatus: this.nextFamilyStatus(),
    }
  }

  protected nextName(charsAttrsPrefix: 'lastName' | 'firstName'): string {
    const charactersAttrsName = (
      charsAttrsPrefix + 'Characters'
    ) as 'lastNameCharacters' | 'firstNameCharacters';
    const characters = this.config[charactersAttrsName];

    const lengthAttrsName = (
      charsAttrsPrefix + 'Length'
    ) as 'lastNameLength' | 'firstNameLength';
    const length = this.config[lengthAttrsName];

    return super.nextRandomString(characters,length);
  }

  private nextAge(): number {
    const age = Math.floor(Math.random() * this.config.ageMaxValue);
    if(age < this.config.ageMinValue) return this.nextAge();
    return age;
  }

  private nextFamilyStatus(): boolean {
    return (Math.random() * 1000) > 500;
  }
}
