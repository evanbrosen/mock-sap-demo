import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import odataRoutes from './routes/odata';
import fioriRoutes from './routes/fiori';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database
initializeDatabase();

// Routes
app.use(odataRoutes);
app.use(fioriRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    name: 'Mock SAP Frontend',
    version: '1.0.0',
    description: 'Mock SAP S/4HANA frontend with Fiori intent-based navigation and OData API',
    endpoints: {
      odata: {
        purchaseOrders: {
          list: 'GET /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet',
          get: 'GET /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id',
          create: 'POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet',
          update: 'PATCH /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id',
          delete: 'DELETE /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id',
          actions: {
            submit: 'POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Submit',
            approve: 'POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Approve',
            reject: 'POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Reject',
            close: 'POST /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Close',
          },
        },
        purchaseRequests: {
          list: 'GET /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet',
          get: 'GET /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id',
          create: 'POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet',
          update: 'PATCH /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id',
          delete: 'DELETE /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id',
          actions: {
            submit: 'POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Submit',
            approve: 'POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Approve',
            reject: 'POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Reject',
            convertToPO: 'POST /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/ConvertToPO',
          },
        },
        workOrders: {
          list: 'GET /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet',
          get: 'GET /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id',
          create: 'POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet',
          update: 'PATCH /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id',
          delete: 'DELETE /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id',
          actions: {
            start: 'POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Start',
            complete: 'POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Complete',
            cancel: 'POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Cancel',
            reassign: 'POST /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Reassign',
          },
        },
      },
      fiori: {
        purchaseOrders: 'GET /api/fiori/PurchaseOrders',
        purchaseOrder: 'GET /api/fiori/PurchaseOrder/:id',
        purchaseRequests: 'GET /api/fiori/PurchaseRequests',
        purchaseRequest: 'GET /api/fiori/PurchaseRequest/:id',
        workOrders: 'GET /api/fiori/WorkOrders',
        workOrder: 'GET /api/fiori/WorkOrder/:id',
      },
    },
    fioriNavigation: {
      purchaseOrderDisplay: '/#PurchaseOrder-display?PurchaseOrder={id}',
      purchaseOrderCreate: '/#PurchaseOrder-create',
      purchaseRequestDisplay: '/#PurchaseRequest-display?PurchaseRequest={id}',
      purchaseRequestCreate: '/#PurchaseRequest-create',
      workOrderDisplay: '/#WorkOrder-display?WorkOrder={id}',
      workOrderCreate: '/#WorkOrder-create',
    },
  });
});

// Serve the web UI for all other routes (SPA)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Mock SAP Frontend running on http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api/docs`);
  console.log(`Health Check: http://localhost:${port}/health`);
});
