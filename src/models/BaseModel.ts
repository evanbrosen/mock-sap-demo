import db from '../config/database';

export interface IEntity {
  id: string;
  status: string;
  description?: string;
  created_date: string;
  modified_date: string;
  created_by?: string;
  modified_by?: string;
}

export abstract class BaseModel {
  protected tableName: string = '';

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records from the table
   */
  getAll(limit?: number, offset?: number): Promise<IEntity[]> {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];

      if (limit) {
        query += ` LIMIT ?`;
        params.push(limit);
      }

      if (offset) {
        query += ` OFFSET ?`;
        params.push(offset);
      }

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as IEntity[]);
      });
    });
  }

  /**
   * Get a single record by ID
   */
  getById(id: string): Promise<IEntity | undefined> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as IEntity | undefined);
      });
    });
  }

  /**
   * Create a new record
   */
  create(data: Partial<IEntity>): Promise<IEntity> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const record: IEntity = {
        id: data.id || this.generateId(),
        status: data.status || 'DRAFT',
        description: data.description || '',
        created_date: now,
        modified_date: now,
        created_by: data.created_by || 'SYSTEM',
        modified_by: data.modified_by || 'SYSTEM',
        ...data,
      };

      const columns = Object.keys(record);
      const placeholders = columns.map(() => '?').join(',');
      const values = columns.map(col => record[col as keyof IEntity]);

      db.run(
        `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES (${placeholders})`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve(record);
        }
      );
    });
  }

  /**
   * Update a record
   */
  async update(id: string, data: Partial<IEntity>): Promise<IEntity | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updated = {
        ...existing,
        ...data,
        id,
        created_date: existing.created_date,
        modified_date: now,
      };

      const columns = Object.keys(updated).filter(col => col !== 'id');
      const setClause = columns.map(col => `${col} = ?`).join(',');
      const values = columns.map(col => updated[col as keyof IEntity]);

      db.run(
        `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
        [...values, id],
        (err) => {
          if (err) reject(err);
          else resolve(updated);
        }
      );
    });
  }

  /**
   * Delete a record
   */
  delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  /**
   * Filter records by status
   */
  getByStatus(status: string): Promise<IEntity[]> {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${this.tableName} WHERE status = ?`, [status], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as IEntity[]);
      });
    });
  }

  /**
   * Count total records
   */
  count(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM ${this.tableName}`, (err, row: any) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  /**
   * Generate a unique ID (override in subclasses for custom ID generation)
   */
  protected generateId(): string {
    return `${this.tableName.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
