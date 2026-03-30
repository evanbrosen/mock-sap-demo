import { BaseModel, IEntity } from './BaseModel';

export interface IPurchaseOrder extends IEntity {
  vendor_id: string;
  amount: number;
  currency: string;
}

export class PurchaseOrder extends BaseModel {
  constructor() {
    super('purchase_orders');
  }

  protected generateId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `PO-${timestamp}${random}`;
  }

  /**
   * Submit a purchase order for approval
   */
  async submit(id: string, userId: string): Promise<IPurchaseOrder | undefined> {
    const po = await this.getById(id) as IPurchaseOrder | undefined;
    if (!po || po.status !== 'DRAFT') return undefined;

    return (await this.update(id, {
      status: 'SUBMITTED',
      modified_by: userId,
    })) as IPurchaseOrder | undefined;
  }

  /**
   * Approve a purchase order
   */
  async approve(id: string, userId: string): Promise<IPurchaseOrder | undefined> {
    const po = await this.getById(id) as IPurchaseOrder | undefined;
    if (!po || po.status !== 'SUBMITTED') return undefined;

    return (await this.update(id, {
      status: 'APPROVED',
      modified_by: userId,
    })) as IPurchaseOrder | undefined;
  }

  /**
   * Reject a purchase order
   */
  async reject(id: string, userId: string): Promise<IPurchaseOrder | undefined> {
    const po = await this.getById(id) as IPurchaseOrder | undefined;
    if (!po || !['SUBMITTED', 'APPROVED'].includes(po.status)) return undefined;

    return (await this.update(id, {
      status: 'REJECTED',
      modified_by: userId,
    })) as IPurchaseOrder | undefined;
  }

  /**
   * Close a purchase order
   */
  async close(id: string, userId: string): Promise<IPurchaseOrder | undefined> {
    const po = await this.getById(id) as IPurchaseOrder | undefined;
    if (!po || po.status !== 'APPROVED') return undefined;

    return (await this.update(id, {
      status: 'CLOSED',
      modified_by: userId,
    })) as IPurchaseOrder | undefined;
  }
}
