import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function HomePage() {
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-4">Welcome to Mock SAP Frontend</h2>
        <p className="text-muted-foreground mb-6">
          This is a mock SAP S/4HANA frontend demonstrating:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span><strong>Fiori Intent-Based Navigation:</strong> URLs like <code className="bg-muted px-2 py-1 rounded text-xs">#PurchaseOrder-display?PurchaseOrder=PO-001</code></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span><strong>OData API Endpoints:</strong> RESTful API following SAP conventions</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span><strong>Business Actions:</strong> Submit, Approve, Reject, and more</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span><strong>Extensible Architecture:</strong> Easy to add new object types</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/PurchaseOrder">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Create Purchase Order</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Start a new PO</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/PurchaseRequest">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Create Purchase Request</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Start a new PR</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/WorkOrder">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Create Work Order</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Start a new WO</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/api-docs">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>View all endpoints</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
