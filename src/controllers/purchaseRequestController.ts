import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { PurchaseRequest } from '../models/PurchaseRequest';

export class PurchaseRequestController extends BaseController {
  private prModel: PurchaseRequest;

  constructor() {
    const model = new PurchaseRequest();
    super(model);
    this.prModel = model;
  }

  /**
   * Submit a purchase request for approval
   */
  async submit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.prModel.submit(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot submit PR in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit PR' });
    }
  }

  /**
   * Approve a purchase request
   */
  async approve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.prModel.approve(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot approve PR in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve PR' });
    }
  }

  /**
   * Reject a purchase request
   */
  async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.prModel.reject(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot reject PR in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to reject PR' });
    }
  }

  /**
   * Convert a purchase request to a purchase order
   */
  async convertToPO(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.prModel.convertToPO(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot convert PR in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to convert PR to PO' });
    }
  }
}
