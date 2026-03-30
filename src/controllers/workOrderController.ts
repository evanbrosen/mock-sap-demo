import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { WorkOrder } from '../models/WorkOrder';

export class WorkOrderController extends BaseController {
  private woModel: WorkOrder;

  constructor() {
    const model = new WorkOrder();
    super(model);
    this.woModel = model;
  }

  /**
   * Start a work order
   */
  async start(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.woModel.start(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot start WO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to start WO' });
    }
  }

  /**
   * Complete a work order
   */
  async complete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.woModel.complete(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot complete WO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete WO' });
    }
  }

  /**
   * Cancel a work order
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updated = this.woModel.cancel(id, userId || 'SYSTEM');

      if (!updated) {
        res.status(400).json({ error: 'Cannot cancel WO in current status' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel WO' });
    }
  }

  /**
   * Reassign a work order
   */
  async reassign(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { newAssignee, userId } = req.body;

      if (!newAssignee) {
        res.status(400).json({ error: 'newAssignee is required' });
        return;
      }

      const updated = this.woModel.reassign(id, newAssignee, userId || 'SYSTEM');

      if (!updated) {
        res.status(404).json({ error: 'Work order not found' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to reassign WO' });
    }
  }

  /**
   * Get work orders by priority
   */
  async getByPriority(req: Request, res: Response): Promise<void> {
    try {
      const { priority } = req.params;
      const records = this.woModel.getByPriority(priority);

      res.json({
        value: records,
        '@odata.count': records.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch work orders' });
    }
  }

  /**
   * Get work orders assigned to a user
   */
  async getByAssignee(req: Request, res: Response): Promise<void> {
    try {
      const { assigneeId } = req.params;
      const records = this.woModel.getByAssignee(assigneeId);

      res.json({
        value: records,
        '@odata.count': records.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch work orders' });
    }
  }
}
