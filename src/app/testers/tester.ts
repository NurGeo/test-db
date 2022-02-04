import { Repository } from "../repository/repository";
import { TesterResult } from "../types";

export abstract class Tester {
  protected abstract testType: string;

  constructor(protected repositories: Repository[]) {}

  abstract test(): TesterResult
}
