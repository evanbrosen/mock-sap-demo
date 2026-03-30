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
router.get('/api/fiori/PurchaseOrder/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const po = poModel.getById(id);

  if (!po) {
    res.status(404).json({ error: 'Purchase Order not found' });
    return;
  }

  res.json(po);
});

router.get('/api/fiori/PurchaseRequest/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const pr = prModel.getById(id);

  if (!pr) {
    res.status(404).json({ error: 'Purchase Request not found' });
    return;
  }

  res.json(pr);
});

router.get('/api/fiori/WorkOrder/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const wo = woModel.getById(id);

  if (!wo) {
    res.status(404).json({ error: 'Work Order not found' });
    return;
  }

  res.json(wo);
});

// Get all objects for list views
router.get('/api/fiori/PurchaseOrders', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  const records = poModel.getAll(limit, offset);
  const total = poModel.count();

  res.json({
    value: records,
    '@odata.count': total,
  });
});

router.get('/api/fiori/PurchaseRequests', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  const records = prModel.getAll(limit, offset);
  const total = prModel.count();

  res.json({
    value: records,
    '@odata.count': total,
  });
});

router.get('/api/fiori/WorkOrders', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  const records = woModel.getAll(limit, offset);
  const total = woModel.count();

  res.json({
    value: records,
    '@odata.count': total,
  });
});

export default router;
