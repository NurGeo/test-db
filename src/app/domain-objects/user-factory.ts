import { randomBytes  } from "crypto";
import { UserFactoryConfig } from "../types";
import { DomainObjectFactory } from "./domain-object-factory";
import { UserRecord } from "./user";

export class UserFactory extends DomainObjectFactory<UserFactoryConfig>{

  getUser(): UserRecord {
    return {
      numID: this.nextNumID(),
      govID: this.nextGovID(),
      objID: this.nextObjID(),
      fName: this.nextName('firstName'),
      lName: this.nextName('lastName'),
      age: this.nextAge(),
      familyStatus: this.nextFamilyStatus(),
      companyID: '',
    }
  }

  private nextObjID(): string {
    return randomBytes(this.config.objIDByteLength).toString('hex');
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
