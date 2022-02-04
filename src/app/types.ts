export type TestType =
  | 'write-objid-999'
  | 'write-numid-999'
  | 'write-objid-1'
  | 'read-objid-50'
  | 'read-numid-50'
  | 'read-unique-50';

export type RepositoryType =
  | 'mongo-db-driver'
  | 'mongo-db-typeorm'
  | 'postgress-driver'
  | 'postgress-typeorm'
  | 'sqlite-driver'
  | 'sqlite-typeorm';

export type RepoResult = {
  repoType: RepositoryType;
  time: number;
};

export type TesterResult = Record<TestType, RepoResult>;

export type DomainObjectFactoryConfig = {
  govIDdigitLength: number,
}

export type CompanyFactoryConfig = DomainObjectFactoryConfig & {
  nameLength: number,
  nameCharacters: string,
}

export type UserFactoryConfig = DomainObjectFactoryConfig & {
  objIDByteLength: number,
  firstNameLength: number,
  lastNameLength: number,
  firstNameCharacters: string,
  lastNameCharacters: string,
  ageMinValue: number,
  ageMaxValue: number,
}
