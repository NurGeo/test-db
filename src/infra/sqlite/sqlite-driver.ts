/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import {assert} from 'console';

const sqlite3 = require('sqlite3');

let db: any;

export abstract class SQLite3DriverRepository {

  constructor(filePath: string, mode: 'read' | 'write') {
    this.open(filePath, mode);
  }

  protected async open(filePath: string, mode: 'read' | 'write'): Promise<string> {
    return new Promise((resolve, reject) => {
      const modeFlags =
        mode === 'read'
          ? sqlite3.OPEN_READONLY
          : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;

      db = new sqlite3.Database(filePath, modeFlags, (err: Error | null) => {
        if (err) reject(`sqlite <${filePath}> open error: ${err.message}`);
        else resolve(`sqlite <${filePath}> opened`);
      });
    });
  }

  async close(): Promise<true> {
    return new Promise(resolve => {
      db.close();
      resolve(true);
    });
  }

  /** any query: insert/delete/update */
  protected async run(sql: string): Promise<true> {
    return new Promise((resolve, reject) => {
      assert(db !== undefined);
      db.run(sql, (err: Error | null) => {
        if (err) {
          console.log(`sqlite.run(...) call error: ${err.message}`);
          reject(err.message);
        } else {
          // //@ts-ignore:
          //resolve(this); // функция вернет объект Statement
          resolve(true);
        }
      });
    });
  }

  /** first row read */
  protected async get<R>(sql: string, params?: any): Promise<R> {
    return new Promise((resolve, reject) => {
      assert(db !== undefined);
      db.get(sql, params ?? [], (err: Error, row: R) => {
        if (err) {
          console.log(`sqlite.get(...) call error: ${err.message}`);
          reject(err.message);
        } else {
          resolve(row);
        }
      });
    });
  }

  /** set of rows read */
  protected async all<R>(sql: string, params?: any): Promise<R> {
    return new Promise((resolve, reject) => {
      assert(db !== undefined);
      db.all(sql, params ?? [], (err: Error, rows: R) => {
        if (err) {
          console.log(`sqlite.all(...) call error: ${err.message}`);
          reject(err.message);
        } else resolve(rows);
      });
    });
  }

  // each row returned one by one
  protected async each<R>(
    sql: string,
    params: any,
    action: (row: R) => void
  ): Promise<true> {
    return new Promise((resolve, reject) => {
      assert(db !== undefined);
      db.serialize(() => {
        db.each(sql, params ?? [], (err: Error | null, row: R) => {
          if (err) {
            console.log(`sqlite.each(...) call error: ${err.message}`);
            reject(err.message);
          } else {
            if (row) action(row);
          }
        });
        db.get('', (err: Error | null, row: R) => {
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
    Object.keys(row).forEach(key => {
      columnNames =
        columnNames === '' ? `"${key}"` : `${columnNames}, "${key}"`;

      values =
        values === '' ? `"${row[key].toString()}"` : `${values}, "${row[key]}"`;
    });

    return `INSERT INTO ${tableName} (${columnNames}) VALUES (${values})`;
  }

  protected getSimpleSelectSql<R extends Record<string, unknown>>(
    tableList: string,
    value: number | string | boolean,
    whereAttrName: keyof R = 'govID',
    selectColumnsList = '*'
  ): string {
    return `SELECT ${selectColumnsList} FROM ${tableList} WHERE "${whereAttrName}" = "${value}";`;
  }
}
