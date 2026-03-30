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
  getAll(limit?: number, offset?: number): IEntity[] {
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

    const stmt = db.prepare(query);
    return stmt.all(...params) as IEntity[];
  }

  /**
   * Get a single record by ID
   */
  getById(id: string): IEntity | undefined {
    const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    return stmt.get(id) as IEntity | undefined;
  }

  /**
   * Create a new record
   */
  create(data: Partial<IEntity>): IEntity {
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

    const stmt = db.prepare(
      `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES (${placeholders})`
    );
    stmt.run(...values);

    return record;
  }

  /**
   * Update a record
   */
  update(id: string, data: Partial<IEntity>): IEntity | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      created_date: existing.created_date, // Preserve creation date
      modified_date: now,
    };

    const columns = Object.keys(updated).filter(col => col !== 'id');
    const setClause = columns.map(col => `${col} = ?`).join(',');
    const values = columns.map(col => updated[col as keyof IEntity]);

    const stmt = db.prepare(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return updated;
  }

  /**
   * Delete a record
   */
  delete(id: string): boolean {
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Filter records by status
   */
  getByStatus(status: string): IEntity[] {
    const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE status = ?`);
    return stmt.all(status) as IEntity[];
  }

  /**
   * Count total records
   */
  count(): number {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    const result = stmt.get() as { count: number };
    return result.count;
  }

  /**
   * Generate a unique ID (override in subclasses for custom ID generation)
   */
  protected generateId(): string {
    return `${this.tableName.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
