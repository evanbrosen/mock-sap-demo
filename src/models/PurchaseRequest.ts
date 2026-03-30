import { BaseModel, IEntity } from './BaseModel';

export interface IPurchaseRequest extends IEntity {
  requester_id: string;
  amount: number;
  currency: string;
}

export class PurchaseRequest extends BaseModel {
  constructor() {
    super('purchase_requests');
  }

  protected generateId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `PR-${timestamp}${random}`;
  }

  /**
   * Submit a purchase request for approval
   */
  async submit(id: string, userId: string): Promise<IPurchaseRequest | undefined> {
    const pr = await this.getById(id) as IPurchaseRequest | undefined;
    if (!pr || pr.status !== 'DRAFT') return undefined;

    return (await this.update(id, {
      status: 'SUBMITTED',
      modified_by: userId,
    })) as IPurchaseRequest | undefined;
  }

  /**
   * Approve a purchase request
   */
  async approve(id: string, userId: string): Promise<IPurchaseRequest | undefined> {
    const pr = await this.getById(id) as IPurchaseRequest | undefined;
    if (!pr || pr.status !== 'SUBMITTED') return undefined;

    return (await this.update(id, {
      status: 'APPROVED',
      modified_by: userId,
    })) as IPurchaseRequest | undefined;
  }

  /**
   * Reject a purchase request
   */
  async reject(id: string, userId: string): Promise<IPurchaseRequest | undefined> {
    const pr = await this.getById(id) as IPurchaseRequest | undefined;
    if (!pr || !['SUBMITTED', 'APPROVED'].includes(pr.status)) return undefined;

    return (await this.update(id, {
      status: 'REJECTED',
      modified_by: userId,
    })) as IPurchaseRequest | undefined;
  }

  /**
   * Convert a purchase request to a purchase order
   */
  async convertToPO(id: string, userId: string): Promise<IPurchaseRequest | undefined> {
    const pr = await this.getById(id) as IPurchaseRequest | undefined;
    if (!pr || pr.status !== 'APPROVED') return undefined;

    return (await this.update(id, {
      status: 'CONVERTED_TO_PO',
      modified_by: userId,
    })) as IPurchaseRequest | undefined;
  }
}
