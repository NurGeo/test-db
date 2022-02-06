import { CompanyRecord } from "../domain-objects/company";
import { PersonRecord } from "../domain-objects/person";
import { Repository } from "./repository";

export interface FixtureRepository extends Repository<
  PersonRecord, CompanyRecord
>{ }
