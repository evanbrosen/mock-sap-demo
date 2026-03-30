# Mock SAP S/4HANA Frontend

A mock SAP S/4HANA frontend demonstrating Fiori intent-based navigation and OData API endpoints. Perfect for integration demos and testing without needing a real SAP system.

## Features

- **Fiori Intent-Based Navigation**: URLs like `#PurchaseOrder-display?PurchaseOrder=PO-001`
- **OData API Endpoints**: RESTful API following SAP conventions (`/sap/opu/odata/sap/...`)
- **Business Actions**: Submit, Approve, Reject, Convert, Start, Complete, Cancel, Reassign
- **Three Object Types**: Purchase Orders, Purchase Requests, Work Orders
- **Extensible Architecture**: Easy to add new object types
- **SQLite Database**: Lightweight, file-based persistence
- **Modern Web UI**: Clean, responsive interface with Fiori-style navigation
- **Heroku Ready**: Deploy to Heroku with one command

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/evanbrosen/mock-sap-demo.git
   cd mock-sap-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Heroku

### Prerequisites

- Heroku CLI installed
- GitHub repository connected to Heroku

### Deploy

1. **Create a Heroku app**
   ```bash
   heroku create mock-sap-demo
   ```

2. **Deploy from GitHub**
   ```bash
   git push heroku main
   ```

3. **View logs**
   ```bash
   heroku logs --tail
   ```

4. **Open the app**
   ```bash
   heroku open
   ```

## API Documentation

### Base URL

- **Local**: `http://localhost:3000`
- **Heroku**: `https://mock-sap-demo.herokuapp.com`

### OData API Endpoints

#### Purchase Orders

```
GET    /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet
GET    /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id
POST   /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet
PATCH  /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id
DELETE /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id

POST   /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Submit
POST   /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Approve
POST   /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Reject
POST   /sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/:id/Close
```

#### Purchase Requests

```
GET    /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet
GET    /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id
POST   /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet
PATCH  /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id
DELETE /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id

POST   /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Submit
POST   /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Approve
POST   /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/Reject
POST   /sap/opu/odata/sap/Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet/:id/ConvertToPO
```

#### Work Orders

```
GET    /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet
GET    /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id
POST   /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet
PATCH  /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id
DELETE /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id

POST   /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Start
POST   /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Complete
POST   /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Cancel
POST   /sap/opu/odata/sap/Z_WORK_ORDER_SRV/WorkOrderSet/:id/Reassign
```

### Fiori Intent-Based Navigation

```
/#PurchaseOrder-display?PurchaseOrder={id}
/#PurchaseOrder-create
/#PurchaseRequest-display?PurchaseRequest={id}
/#PurchaseRequest-create
/#WorkOrder-display?WorkOrder={id}
/#WorkOrder-create
```

### Example Requests

#### Create a Purchase Order

```bash
curl -X POST http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": "VENDOR-001",
    "amount": 5000,
    "currency": "USD",
    "description": "Office supplies",
    "created_by": "USER-001"
  }'
```

#### Submit a Purchase Order

```bash
curl -X POST http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/PO-123456ABC/Submit \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER-001"}'
```

#### Get All Purchase Orders

```bash
curl http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet?$top=10&$skip=0
```

## Project Structure

```
mock-sap-demo/
├── src/
│   ├── server.ts                 # Express app setup
│   ├── config/
│   │   └── database.ts           # SQLite initialization
│   ├── models/
│   │   ├── BaseModel.ts          # Abstract base model
│   │   ├── PurchaseOrder.ts
│   │   ├── PurchaseRequest.ts
│   │   └── WorkOrder.ts
│   ├── controllers/
│   │   ├── baseController.ts     # Abstract base controller
│   │   ├── purchaseOrderController.ts
│   │   ├── purchaseRequestController.ts
│   │   └── workOrderController.ts
│   └── routes/
│       ├── odata.ts              # OData API routes
│       └── fiori.ts              # Fiori navigation routes
├── public/
│   ├── index.html                # Web UI
│   ├── app.js                    # Frontend JavaScript
│   └── styles.css                # Styling
├── package.json
├── tsconfig.json
├── Procfile                      # Heroku configuration
├── .env.example                  # Environment variables template
└── README.md
```

## Adding a New Object Type

To add a new object type (e.g., Sales Order):

### 1. Create the Model

Create `src/models/SalesOrder.ts`:

```typescript
import { BaseModel, IEntity } from './BaseModel';

export interface ISalesOrder extends IEntity {
  customer_id: string;
  amount: number;
  currency: string;
}

export class SalesOrder extends BaseModel {
  constructor() {
    super('sales_orders');
  }

  protected generateId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `SO-${timestamp}${random}`;
  }

  // Add business-specific methods here
}
```

### 2. Create the Controller

Create `src/controllers/salesOrderController.ts`:

```typescript
import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { SalesOrder } from '../models/SalesOrder';

export class SalesOrderController extends BaseController {
  private soModel: SalesOrder;

  constructor() {
    const model = new SalesOrder();
    super(model);
    this.soModel = model;
  }

  // Add business-specific action handlers here
}
```

### 3. Register Routes

Add to `src/routes/odata.ts`:

```typescript
const soController = new SalesOrderController();

router.get('/sap/opu/odata/sap/Z_SALES_ORDER_SRV/SalesOrderSet', (req, res) =>
  soController.getAll(req, res)
);
// ... add other routes
```

### 4. Update Database Schema

Add to `src/config/database.ts`:

```typescript
db.exec(`
  CREATE TABLE IF NOT EXISTS sales_orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'DRAFT',
    description TEXT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    modified_by TEXT
  )
`);
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/mock-sap.db
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3 with better-sqlite3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Heroku

## Testing

### Using cURL

```bash
# Create a purchase order
curl -X POST http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet \
  -H "Content-Type: application/json" \
  -d '{"vendor_id":"V1","amount":1000,"currency":"USD","description":"Test"}'

# Get all purchase orders
curl http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet

# Get a specific purchase order
curl http://localhost:3000/sap/opu/odata/sap/Z_PURCHASE_ORDER_SRV/PurchaseOrderSet/PO-123456ABC
```

### Using Postman

1. Import the API endpoints
2. Create requests for each endpoint
3. Test CRUD operations and business actions

## Troubleshooting

### Database Issues

If you encounter database errors, delete the database file and restart:

```bash
rm -rf data/mock-sap.db
npm run dev
```

### Port Already in Use

Change the port in `.env`:

```
PORT=3001
```

### Heroku Deployment Issues

Check logs:

```bash
heroku logs --tail
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
