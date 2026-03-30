import { Router, Request, Response } from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { PurchaseRequest } from '../models/PurchaseRequest';
import { WorkOrder } from '../models/WorkOrder';

const router = Router();

const poModel = new PurchaseOrder();
const prModel = new PurchaseRequest();
const woModel = new WorkOrder();

/**
 * Fiori intent-based navigation routes
 * These routes handle the hash-based navigation used by SAP Fiori apps
 * Example: /#PurchaseOrder-display?PurchaseOrder=PO-001
 */

// API endpoint to get object data for Fiori navigation
router.get('/api/fiori/PurchaseOrder/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const po = await poModel.getById(id);

    if (!po) {
      res.status(404).json({ error: 'Purchase Order not found' });
      return;
    }

    res.json(po);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Purchase Order' });
  }
});

router.get('/api/fiori/PurchaseRequest/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pr = await prModel.getById(id);

    if (!pr) {
      res.status(404).json({ error: 'Purchase Request not found' });
      return;
    }

    res.json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Purchase Request' });
  }
});

router.get('/api/fiori/WorkOrder/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wo = await woModel.getById(id);

    if (!wo) {
      res.status(404).json({ error: 'Work Order not found' });
      return;
    }

    res.json(wo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Work Order' });
  }
});

// Get all objects for list views
router.get('/api/fiori/PurchaseOrders', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const records = await poModel.getAll(limit, offset);
    const total = await poModel.count();

    res.json({
      value: records,
      '@odata.count': total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Purchase Orders' });
  }
});

router.get('/api/fiori/PurchaseRequests', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const records = await prModel.getAll(limit, offset);
    const total = await prModel.count();

    res.json({
      value: records,
      '@odata.count': total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Purchase Requests' });
  }
});

router.get('/api/fiori/WorkOrders', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const records = await woModel.getAll(limit, offset);
    const total = await woModel.count();

    res.json({
      value: records,
      '@odata.count': total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Work Orders' });
  }
});

export default router;
