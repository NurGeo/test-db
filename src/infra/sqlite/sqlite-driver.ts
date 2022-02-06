const sqlite3 = require('sqlite3');
import { CompanyRecord } from '../../app/domain-objects/company';
import { PersonRecord } from '../../app/domain-objects/person';
import { Repository } from '../../app/repositories/repository';
import { CompanyFactoryConfig, PersonFactoryConfig } from '../../app/types';

let db: any;

export class SQLite3Repository implements Repository<
  PersonRecord, CompanyRecord
> {
  personCollectionsName: 'persons' = 'persons';

  companyCollectionsName: 'companies' = 'companies';

  async open(filePath = ':memory:', mode: 'read' | 'open' = 'open'): Promise<string> {
    return new Promise(function(resolve, reject) {
      const modeFlags =
        mode === 'read'
          ? sqlite3.sqlite3.OPEN_READONLY
          : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;

      db = new sqlite3.Database(
        filePath,
        modeFlags,
        (err: Error | null) => {
          if(err) reject(`sqlite <${filePath}> open error: ${err.message}`)
          else resolve(`sqlite <${filePath}> opened`)
        }
      );
    });
  }

  async close(): Promise<true> {
    return new Promise(function(resolve) {
        db.close();
        resolve(true);
    });
  }

  async initCollections(
    personConfig: PersonFactoryConfig,
    companyConfig: CompanyFactoryConfig
  ): Promise<void> {
    const createPersonTableSQL = `
      CREATE TABLE ${this.personCollectionsName} (
        numID INTEGER PRIMARY KEY,
        govID VARCHAR(${personConfig.govIDdigitLength}) UNIQUE ON CONFLICT ABORT,
        objID VARCHAR(${personConfig.objIDByteLength * 2}) UNIQUE ON CONFLICT ABORT,
        firstName VARCHAR(${personConfig.firstNameLength}) NOT NULL ON CONFLICT ABORT,
        lastName VARCHAR(${personConfig.lastNameLength}) NOT NULL ON CONFLICT ABORT,
        age INTEGER NOT NULL ON CONFLICT ABORT,
        familyStatus BOOLEAN NOT NULL ON CONFLICT ABORT,
        companyID VARCHAR(${companyConfig.govIDdigitLength})
          REFERENCES ${this.companyCollectionsName}
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`;
    await this.run(createPersonTableSQL);

    const createCompanyTableSQL = `
      CREATE TABLE ${this.companyCollectionsName} (
        numID INTEGER PRIMARY KEY,
        govID VARCHAR(${companyConfig.govIDdigitLength}),
        objID VARCHAR(${personConfig.objIDByteLength * 2}),
        name varchar(${personConfig.firstNameLength}),
        employees TEXT
      )
    `;
    await this.run(createCompanyTableSQL);
  }

  async listCollections(): Promise<{ name: string }[]> {
    const listTablesAQL = `
      SELECT name FROM sqlite_master
      WHERE type = 'table'
    `
    const result = await this.all<{ name: string }[]>(listTablesAQL);
    return result;
  }

  async addPerson(person: PersonRecord): Promise<void> {
    const insertSQL = this.getInsertSQL(this.personCollectionsName, person);
    await this.run(insertSQL);
  }
  
  async addCompany(company: CompanyRecord): Promise<void> {
    const insertSQL = this.getInsertSQL(this.companyCollectionsName, company);
    await this.run(insertSQL);
  }

  async getPersonByGovID(id: string): Promise<PersonRecord> {
    return await this.get(this.getSimpleSelectSql(
      this.personCollectionsName, id
    ));
  }

  async getCompanyByGovID(id: string): Promise<CompanyRecord> {
    return await this.get(this.getSimpleSelectSql(
      this.companyCollectionsName, id
    ));
  }

  /** any query: insert/delete/update */
  protected async run(sql: string): Promise<true> {
    return new Promise(function(resolve, reject) {
      db.run(sql,
        function(err: Error | null)  {
          if(err) {
            console.log(`sqlite.run(...) call error: ${err.message}`)
            reject(err.message)
          }
          else {
          // //@ts-ignore: 
            //resolve(this); // функция вернет объект Statement
            resolve(true);
          }
      })
    })    
  }

  /** first row read */
  protected async get<R>(sql: string, params?: any): Promise<R> {
    return new Promise(function(resolve, reject) {
      db.get(sql, params ?? [], function(err: Error, row: R)  {
        if(err) {
          console.log(`sqlite.get(...) call error: ${err.message}`)
          reject(err.message)
        }
        else {
          resolve(row);
        }
      })
    }) 
  }
  
  /** set of rows read */
  protected async all<R>(sql: string, params?: any): Promise<R> {
    return new Promise(function(resolve, reject) {
      db.all(sql, params ?? [], function(err: Error, rows: R)  {
        if(err) {
          console.log(`sqlite.all(...) call error: ${err.message}`)
          reject(err.message)
        }
        else resolve(rows);
      })
    }) 
  }
  
// each row returned one by one 
  protected async each<R>(
    sql: string,
    params: any,
    action: (row: R) => void
  ): Promise<true> {
    return new Promise(function(resolve, reject) {
      db.serialize(function() {
        db.each(sql, params ?? [], function(err: Error | null, row: R)  {
          if(err) {
            console.log(`sqlite.each(...) call error: ${err.message}`)
            reject(err.message)
          }
          else { if(row) action(row) }
        });
        db.get("", function(err: Error | null, row: R)  {
            resolve(true);
        });
      });
    });
  }

  protected getInsertSQL(
    tableName: string,
    row: Record<string, number | string | boolean>
  ): string {
    let columnNames = '';
    let values = '';
    Object.keys(row).forEach((key) => {
      columnNames = columnNames == '' ? `"${key}"` : `${columnNames}, "${key}"`;
      values = values == '' ? `"${row[key].toString()}"` : `${values}, "${row[key]}"`;
    });

    return `INSERT INTO ${tableName} (${columnNames}) VALUES (${values})`
  }

  protected getSimpleSelectSql<R extends Record<string, unknown>>(
    tableList: string,
    value: number | string | boolean,
    whereAttrName: keyof R = 'govID',
    selectColumnsList = '*',
  ): string {
    return `SELECT ${selectColumnsList} FROM ${tableList} WHERE "${whereAttrName}" = "${value}";`
  }
}
