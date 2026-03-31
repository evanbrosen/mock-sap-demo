import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ObjectType {
  label: string
  endpoint: string
  apiEndpoint: string
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'number' | 'textarea' | 'select'
    required?: boolean
    default?: string
    options?: string[]
  }>
}

interface AppContextType {
  objectTypes: Record<string, ObjectType>
  formatCurrency: (amount: number | null | undefined, currency?: string) => string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const objectTypes: Record<string, ObjectType> = {
    PurchaseOrder: {
      label: 'Purchase Orders',
      endpoint: 'Z_PURCHASE_ORDER_SRV/PurchaseOrderSet',
      apiEndpoint: 'PurchaseOrders',
      fields: [
        { name: 'vendor_id', label: 'Vendor ID', type: 'text', required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
        { name: 'currency', label: 'Currency', type: 'text', default: 'USD' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]
    },
    PurchaseRequest: {
      label: 'Purchase Requests',
      endpoint: 'Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet',
      apiEndpoint: 'PurchaseRequests',
      fields: [
        { name: 'requester_id', label: 'Requester ID', type: 'text', required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
        { name: 'currency', label: 'Currency', type: 'text', default: 'USD' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]
    },
    WorkOrder: {
      label: 'Work Orders',
      endpoint: 'Z_WORK_ORDER_SRV/WorkOrderSet',
      apiEndpoint: 'WorkOrders',
      fields: [
        { name: 'assigned_to', label: 'Assigned To', type: 'text', required: true },
        { name: 'priority', label: 'Priority', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'], required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true }
      ]
    }
  }

  const formatCurrency = useCallback((amount: number | null | undefined, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-'
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  }, [])

  const value: AppContextType = {
    objectTypes,
    formatCurrency,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
