import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface ObjectData {
  id: string
  created_date: string
  status: string
}

function ObjectsGridPage() {
  const navigate = useNavigate()
  const { objectTypes, formatCurrency } = useApp()
  const [gridData, setGridData] = useState<Record<string, { items: ObjectData[], loading: boolean, error?: string }>>({})

  useEffect(() => {
    const loadGridData = async () => {
      const data: Record<string, { items: ObjectData[], loading: boolean, error?: string }> = {}

      for (const [type, config] of Object.entries(objectTypes)) {
        data[type] = { items: [], loading: true }

        try {
          const response = await fetch(`/api/fiori/${config.apiEndpoint}`)
          const result = await response.json()
          data[type] = { items: result.value || [], loading: false }
        } catch (error) {
          data[type] = { items: [], loading: false, error: 'Failed to load' }
        }
      }

      setGridData(data)
    }

    loadGridData()
  }, [objectTypes])

  const handleCardClick = (type: string) => {
    navigate(`/dashboard/${type}`)
  }

  const handleCreateClick = (e: React.MouseEvent, type: string) => {
    e.stopPropagation()
    navigate(`/dashboard/${type}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Objects</h1>
        <p className="text-muted-foreground mt-2">Browse and manage all business objects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(objectTypes).map(([type, config]) => {
          const data = gridData[type]
          const items = data?.items || []
          const preview = items.slice(0, 3)

          return (
            <Card
              key={type}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCardClick(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{config.label}</CardTitle>
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 min-h-[80px]">
                  {data?.loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : data?.error ? (
                    <p className="text-sm text-destructive">{data.error}</p>
                  ) : preview.length > 0 ? (
                    preview.map((item) => (
                      <div key={item.id} className="text-xs text-muted-foreground border-b pb-2 last:border-0">
                        <div className="font-medium text-foreground">{item.id}</div>
                        <div className="flex justify-between">
                          <span>{new Date(item.created_date).toLocaleDateString()}</span>
                          <span className="text-primary">{item.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No items yet</p>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={(e) => handleCreateClick(e, type)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ObjectsGridPage
