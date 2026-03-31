import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ApiDocsPage() {
  const [docs, setDocs] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const response = await fetch('/api/docs')
        const data = await response.json()
        setDocs(data)
      } catch (error) {
        console.error('Error loading API docs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocs()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!docs) {
    return <div className="text-center py-12">Failed to load API documentation</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground mt-2">Complete reference for all available endpoints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OData API Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Purchase Orders</h3>
            <ul className="space-y-2 text-sm">
              <li><code className="bg-muted px-2 py-1 rounded">GET {docs.endpoints.odata.purchaseOrders.list}</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">GET {docs.endpoints.odata.purchaseOrders.get}</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">POST {docs.endpoints.odata.purchaseOrders.create}</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">PATCH {docs.endpoints.odata.purchaseOrders.update}</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">DELETE {docs.endpoints.odata.purchaseOrders.delete}</code></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Purchase Order Actions</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(docs.endpoints.odata.purchaseOrders.actions).map(([name, endpoint]: [string, any]) => (
                <li key={name}>
                  <code className="bg-muted px-2 py-1 rounded">POST {endpoint}</code> - {name}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fiori Intent-Based Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {Object.entries(docs.fioriNavigation).map(([name, url]: [string, any]) => (
              <li key={name}>
                <code className="bg-muted px-2 py-1 rounded">{url}</code> - {name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiDocsPage
