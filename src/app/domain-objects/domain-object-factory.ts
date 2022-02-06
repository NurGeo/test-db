import { randomBytes  } from "crypto";
import {DomainObjectFactoryConfig} from '../types';

export abstract class DomainObjectFactory<C extends DomainObjectFactoryConfig> {
  private i = 0;

  protected config: C;

  constructor(factoryConfig: C) {
    this.config = factoryConfig;
  }

  protected nextNumID(): number {
    this.i += 1;
    return this.i;
  }

  protected nextGovID(): string {
    return String(
      Math.floor(Math.random() * Math.pow(10, this.config.govIDdigitLength))
    ).padStart(this.config.govIDdigitLength, '0');
  }

  protected nextObjID(): string {
    return randomBytes(this.config.objIDByteLength).toString('hex');
  }

  protected nextRandomString(characters: string, length: number): string {
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
