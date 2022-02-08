import {GeneralTestRepository} from '../repositories/test-domain-repository';
import {TesterResult} from '../types';

export abstract class Tester {
  protected abstract testType: string;

  constructor(protected repositories: GeneralTestRepository[]) {}

  abstract test(): TesterResult;
}
