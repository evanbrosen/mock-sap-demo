import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { PurchaseOrder } from '../models/PurchaseOrder';

export class PurchaseOrderController extends BaseController {
  private poModel: PurchaseOrder;

  constructor() {
    const model = new PurchaseOrder();
    super(model);
    this.poModel = model;
  }

  /**
   * Submit a purchase order for approval
   */
  async submit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.poModel.submit(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot submit PO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit PO' });
    }
  }

  /**
   * Approve a purchase order
   */
  async approve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.poModel.approve(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot approve PO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve PO' });
    }
  }

  /**
   * Reject a purchase order
   */
  async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.poModel.reject(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot reject PO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to reject PO' });
    }
  }

  /**
   * Close a purchase order
   */
  async close(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.poModel.close(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot close PO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to close PO' });
    }
  }
}
