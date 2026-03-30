import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/purchaseOrderController';
import { PurchaseRequestController } from '../controllers/purchaseRequestController';
import { WorkOrderController } from '../controllers/workOrderController';

const router = Router();

// Initialize controllers
const poController = new PurchaseOrderController();
const prController = new PurchaseRequestController();
const woController = new WorkOrderController();

// ============================================
// Purchase Order OData Routes
// ============================================

// GET /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet
router.get('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet', (req, res) =>
  poController.getAll(req, res)
);

// GET /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')
router.get('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id', (req, res) =>
  poController.getById(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet
router.post('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet', (req, res) =>
  poController.create(req, res)
);

// PATCH /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')
router.patch('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id', (req, res) =>
  poController.update(req, res)
);

// DELETE /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')
router.delete('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id', (req, res) =>
  poController.delete(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')/Submit
router.post('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Submit', (req, res) =>
  poController.submit(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')/Approve
router.post('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Approve', (req, res) =>
  poController.approve(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')/Reject
router.post('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Reject', (req, res) =>
  poController.reject(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet('{id}')/Close
router.post('/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Close', (req, res) =>
  poController.close(req, res)
);

// ============================================
// Purchase Request OData Routes
// ============================================

// GET /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet
router.get('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet', (req, res) =>
  prController.getAll(req, res)
);

// GET /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')
router.get('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id', (req, res) =>
  prController.getById(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet
router.post('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet', (req, res) =>
  prController.create(req, res)
);

// PATCH /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')
router.patch('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id', (req, res) =>
  prController.update(req, res)
);

// DELETE /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')
router.delete('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id', (req, res) =>
  prController.delete(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')/Submit
router.post('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Submit', (req, res) =>
  prController.submit(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')/Approve
router.post('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Approve', (req, res) =>
  prController.approve(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')/Reject
router.post('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Reject', (req, res) =>
  prController.reject(req, res)
);

// POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet('{id}')/ConvertToPO
router.post('/sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/ConvertToPO', (req, res) =>
  prController.convertToPO(req, res)
);

// ============================================
// Work Order OData Routes
// ============================================

// GET /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet
router.get('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet', (req, res) =>
  woController.getAll(req, res)
);

// GET /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')
router.get('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id', (req, res) =>
  woController.getById(req, res)
);

// POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet
router.post('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet', (req, res) =>
  woController.create(req, res)
);

// PATCH /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')
router.patch('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id', (req, res) =>
  woController.update(req, res)
);

// DELETE /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')
router.delete('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id', (req, res) =>
  woController.delete(req, res)
);

// POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')/Start
router.post('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Start', (req, res) =>
  woController.start(req, res)
);

// POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')/Complete
router.post('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Complete', (req, res) =>
  woController.complete(req, res)
);

// POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')/Cancel
router.post('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Cancel', (req, res) =>
  woController.cancel(req, res)
);

// POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet('{id}')/Reassign
router.post('/sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Reassign', (req, res) =>
  woController.reassign(req, res)
);

export default router;
