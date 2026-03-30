import { BaseModel, IEntity } from './BaseModel';

export interface IWorkOrder extends IEntity {
  assigned_to: string;
  priority: string;
}

export class WorkOrder extends BaseModel {
  constructor() {
    super('work_orders');
  }

  protected generateId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `WO-${timestamp}${random}`;
  }

  /**
   * Start a work order
   */
  async start(id: string, userId: string): Promise<IWorkOrder | undefined> {
    const wo = await this.getById(id) as IWorkOrder | undefined;
    if (!wo || wo.status !== 'OPEN') return undefined;

    return (await this.update(id, {
      status: 'IN_PROGRESS',
      modified_by: userId,
    })) as IWorkOrder | undefined;
  }

  /**
   * Complete a work order
   */
  async complete(id: string, userId: string): Promise<IWorkOrder | undefined> {
    const wo = await this.getById(id) as IWorkOrder | undefined;
    if (!wo || wo.status !== 'IN_PROGRESS') return undefined;

    return (await this.update(id, {
      status: 'COMPLETED',
      modified_by: userId,
    })) as IWorkOrder | undefined;
  }

  /**
   * Cancel a work order
   */
  async cancel(id: string, userId: string): Promise<IWorkOrder | undefined> {
    const wo = await this.getById(id) as IWorkOrder | undefined;
    if (!wo || !['OPEN', 'IN_PROGRESS'].includes(wo.status)) return undefined;

    return (await this.update(id, {
      status: 'CANCELLED',
      modified_by: userId,
    })) as IWorkOrder | undefined;
  }

  /**
   * Reassign a work order to another user
   */
  async reassign(id: string, newAssignee: string, userId: string): Promise<IWorkOrder | undefined> {
    const wo = await this.getById(id) as IWorkOrder | undefined;
    if (!wo) return undefined;

    return (await this.update(id, {
      assigned_to: newAssignee,
      modified_by: userId,
    })) as IWorkOrder | undefined;
  }

  /**
   * Get work orders by priority
   */
  async getByPriority(priority: string): Promise<IWorkOrder[]> {
    return new Promise((resolve, reject) => {
      const db = require('../config/database').default;
      db.all(`SELECT * FROM ${this.tableName} WHERE priority = ?`, [priority], (err: any, rows: any) => {
        if (err) reject(err);
        else resolve(rows as IWorkOrder[]);
      });
    });
  }

  /**
   * Get work orders assigned to a user
   */
  async getByAssignee(assigneeId: string): Promise<IWorkOrder[]> {
    return new Promise((resolve, reject) => {
      const db = require('../config/database').default;
      db.all(`SELECT * FROM ${this.tableName} WHERE assigned_to = ?`, [assigneeId], (err: any, rows: any) => {
        if (err) reject(err);
        else resolve(rows as IWorkOrder[]);
      });
    });
  }
}
