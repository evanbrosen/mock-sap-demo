import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

interface ObjectItem {
  id: string
  vendor_id?: string
  requester_id?: string
  assigned_to?: string
  amount?: number
  currency?: string
  priority?: string
  status: string
  created_date: string
  description?: string
}

function DashboardPage() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const { objectTypes, formatCurrency } = useApp()
  const [items, setItems] = useState<ObjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const config = type ? objectTypes[type] : null

  useEffect(() => {
    if (!config) return

    const loadData = async () => {
      try {
        const response = await fetch(`/api/fiori/${config.apiEndpoint}`)
        const result = await response.json()
        setItems(result.value || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [config])

  const handleCreateClick = () => {
    setFormData({})
    setShowCreateDialog(true)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!config) return

    const data: Record<string, any> = {
      created_by: 'DEMO_USER',
    }

    config.fields.forEach(field => {
      const value = formData[field.name]
      if (value) {
        data[field.name] = field.type === 'number' ? parseFloat(value) : value
      }
    })

    try {
      const response = await fetch(`/sap/opu/odata/sap/${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setShowCreateDialog(false)
        // Reload data
        const reloadResponse = await fetch(`/api/fiori/${config.apiEndpoint}`)
        const result = await reloadResponse.json()
        setItems(result.value || [])
      }
    } catch (error) {
      console.error('Error creating object:', error)
    }
  }

  const handleRowClick = (id: string) => {
    if (!type) return
    navigate(`/${type}-display?${type}=${id}`)
  }

  if (!config) {
    return <div>Invalid object type</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{config.label}</h1>
          <p className="text-muted-foreground mt-2">Manage all {config.label.toLowerCase()}</p>
        </div>
        <Button onClick={handleCreateClick} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          New {config.label.slice(0, -1)}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>
                  {type === 'PurchaseOrder' && 'Vendor'}
                  {type === 'PurchaseRequest' && 'Requester'}
                  {type === 'WorkOrder' && 'Assigned To'}
                </TableHead>
                <TableHead>
                  {type === 'WorkOrder' ? 'Priority' : 'Amount'}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="font-medium text-primary">{item.id}</TableCell>
                  <TableCell>
                    {item.vendor_id || item.requester_id || item.assigned_to || '-'}
                  </TableCell>
                  <TableCell>
                    {item.amount ? formatCurrency(item.amount, item.currency) : item.priority || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      item.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(item.created_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create {config.label.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    required={field.required}
                    defaultValue={field.default}
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardPage
