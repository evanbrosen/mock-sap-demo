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
  start(id: string, userId: string): IWorkOrder | undefined {
    const wo = this.getById(id) as IWorkOrder | undefined;
    if (!wo || wo.status !== 'OPEN') return undefined;

    return this.update(id, {
      status: 'IN_PROGRESS',
      modified_by: userId,
    }) as IWorkOrder | undefined;
  }

  /**
   * Complete a work order
   */
  complete(id: string, userId: string): IWorkOrder | undefined {
    const wo = this.getById(id) as IWorkOrder | undefined;
    if (!wo || wo.status !== 'IN_PROGRESS') return undefined;

    return this.update(id, {
      status: 'COMPLETED',
      modified_by: userId,
    }) as IWorkOrder | undefined;
  }

  /**
   * Cancel a work order
   */
  cancel(id: string, userId: string): IWorkOrder | undefined {
    const wo = this.getById(id) as IWorkOrder | undefined;
    if (!wo || !['OPEN', 'IN_PROGRESS'].includes(wo.status)) return undefined;

    return this.update(id, {
      status: 'CANCELLED',
      modified_by: userId,
    }) as IWorkOrder | undefined;
  }

  /**
   * Reassign a work order to another user
   */
  reassign(id: string, newAssignee: string, userId: string): IWorkOrder | undefined {
    const wo = this.getById(id) as IWorkOrder | undefined;
    if (!wo) return undefined;

    return this.update(id, {
      assigned_to: newAssignee,
      modified_by: userId,
    }) as IWorkOrder | undefined;
  }

  /**
   * Get work orders by priority
   */
  getByPriority(priority: string): IWorkOrder[] {
    const db = require('../config/database').default;
    const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE priority = ?`);
    return stmt.all(priority) as IWorkOrder[];
  }

  /**
   * Get work orders assigned to a user
   */
  getByAssignee(assigneeId: string): IWorkOrder[] {
    const db = require('../config/database').default;
    const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE assigned_to = ?`);
    return stmt.all(assigneeId) as IWorkOrder[];
  }
}
