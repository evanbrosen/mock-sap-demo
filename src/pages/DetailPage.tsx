import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface ObjectDetail {
  id: string
  status: string
  created_date: string
  created_by: string
  vendor_id?: string
  requester_id?: string
  assigned_to?: string
  amount?: number
  currency?: string
  priority?: string
  description?: string
  modified_date?: string
  modified_by?: string
}

function DetailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { objectTypes, formatCurrency } = useApp()
  const [detail, setDetail] = useState<ObjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Extract type and id from URL
  const pathname = window.location.pathname
  const match = pathname.match(/\/(\w+)-display/)
  const type = match ? match[1] : null
  const id = searchParams.get(type || '')

  const config = type ? objectTypes[type] : null

  useEffect(() => {
    if (!config || !id) return

    const loadDetail = async () => {
      try {
        const endpoint = type === 'PurchaseOrder' ? 'PurchaseOrder' :
                        type === 'PurchaseRequest' ? 'PurchaseRequest' : 'WorkOrder'
        const response = await fetch(`/api/fiori/${endpoint}/${id}`)
        const data = await response.json()
        setDetail(data)
      } catch (error) {
        console.error('Error loading detail:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [config, id, type])

  const handleAction = (action: string) => {
    alert(`Action "${action}" would be performed here`)
  }

  if (!config || !id) {
    return <div>Invalid object</div>
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!detail) {
    return <div className="text-center py-12">Object not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{config.label.slice(0, -1)}: {detail.id}</h1>
            <p className="text-muted-foreground mt-1">View and manage this object</p>
          </div>
        </div>
        <div className="flex gap-2">
          {detail.status === 'DRAFT' && (
            <Button onClick={() => handleAction('submit')}>Submit</Button>
          )}
          {detail.status === 'SUBMITTED' && (
            <>
              <Button onClick={() => handleAction('approve')}>Approve</Button>
              <Button variant="destructive" onClick={() => handleAction('reject')}>Reject</Button>
            </>
          )}
          {detail.status !== 'CLOSED' && detail.status !== 'CANCELLED' && (
            <Button variant="outline" onClick={() => handleAction('cancel')}>Cancel</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</p>
              <p className="text-lg font-medium">{detail.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                detail.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                detail.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                detail.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                detail.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {detail.status}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created Date</p>
              <p className="text-lg font-medium">{new Date(detail.created_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created By</p>
              <p className="text-lg font-medium">{detail.created_by}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {type === 'PurchaseOrder' && (
              <>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vendor ID</p>
                  <p className="text-lg font-medium">{detail.vendor_id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</p>
                  <p className="text-lg font-medium font-mono">{formatCurrency(detail.amount, detail.currency)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency</p>
                  <p className="text-lg font-medium">{detail.currency}</p>
                </div>
              </>
            )}
            {type === 'PurchaseRequest' && (
              <>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Requester ID</p>
                  <p className="text-lg font-medium">{detail.requester_id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</p>
                  <p className="text-lg font-medium font-mono">{formatCurrency(detail.amount, detail.currency)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency</p>
                  <p className="text-lg font-medium">{detail.currency}</p>
                </div>
              </>
            )}
            {type === 'WorkOrder' && (
              <>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned To</p>
                  <p className="text-lg font-medium">{detail.assigned_to}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority</p>
                  <p className="text-lg font-medium">{detail.priority}</p>
                </div>
              </>
            )}
            {detail.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</p>
                <p className="text-lg font-medium">{detail.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DetailPage
