// Mock SAP Frontend - Fiori Navigation App
const app = {
  currentView: 'home',
  apiBase: window.location.origin,
  currentModalType: null,

  objectTypes: {
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
  },

  init() {
    this.setupNavigation();
    this.setupHashNavigation();
    this.loadData();
  },

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
  },

  setupHashNavigation() {
    window.addEventListener('hashchange', () => {
      this.handleFioriNavigation();
    });
    this.handleFioriNavigation();
  },

  handleFioriNavigation() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const [intent, params] = hash.split('?');
    const [semantic, action] = intent.split('-');

    console.log('Fiori Navigation:', { semantic, action, params });

    // Handle different intents
    if (semantic === 'PurchaseOrder' && action === 'display') {
      const id = new URLSearchParams(params).get('PurchaseOrder');
      this.showDetail('PurchaseOrder', id);
    } else if (semantic === 'PurchaseRequest' && action === 'display') {
      const id = new URLSearchParams(params).get('PurchaseRequest');
      this.showDetail('PurchaseRequest', id);
    } else if (semantic === 'WorkOrder' && action === 'display') {
      const id = new URLSearchParams(params).get('WorkOrder');
      this.showDetail('WorkOrder', id);
    }
  },

  switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Show selected view
    const view = document.getElementById(viewName);
    if (view) {
      view.classList.add('active');
      document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
      this.currentView = viewName;

      // Load data for the view
      if (viewName === 'objects-grid') {
        this.loadObjectsGrid();
      } else if (viewName === 'purchase-orders') {
        this.loadPurchaseOrders();
      } else if (viewName === 'purchase-requests') {
        this.loadPurchaseRequests();
      } else if (viewName === 'work-orders') {
        this.loadWorkOrders();
      } else if (viewName === 'api-docs') {
        this.loadApiDocs();
      }
    }
  },

  async loadData() {
    await this.loadPurchaseOrders();
    await this.loadPurchaseRequests();
    await this.loadWorkOrders();
  },

  async loadPurchaseOrders() {
    try {
      const response = await fetch(`${this.apiBase}/api/fiori/PurchaseOrders`);
      const data = await response.json();
      this.renderTable('po-list', data.value, 'PurchaseOrder');
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      document.getElementById('po-list').innerHTML = '<tr><td colspan="6" class="error">Error loading data</td></tr>';
    }
  },

  async loadPurchaseRequests() {
    try {
      const response = await fetch(`${this.apiBase}/api/fiori/PurchaseRequests`);
      const data = await response.json();
      this.renderTable('pr-list', data.value, 'PurchaseRequest');
    } catch (error) {
      console.error('Error loading purchase requests:', error);
      document.getElementById('pr-list').innerHTML = '<tr><td colspan="6" class="error">Error loading data</td></tr>';
    }
  },

  async loadWorkOrders() {
    try {
      const response = await fetch(`${this.apiBase}/api/fiori/WorkOrders`);
      const data = await response.json();
      this.renderTable('wo-list', data.value, 'WorkOrder');
    } catch (error) {
      console.error('Error loading work orders:', error);
      document.getElementById('wo-list').innerHTML = '<tr><td colspan="6" class="error">Error loading data</td></tr>';
    }
  },

  async loadApiDocs() {
    try {
      const response = await fetch(`${this.apiBase}/api/docs`);
      const data = await response.json();
      const html = this.formatApiDocs(data);
      document.getElementById('api-content').innerHTML = html;
    } catch (error) {
      console.error('Error loading API docs:', error);
      document.getElementById('api-content').innerHTML = '<p class="error">Error loading API documentation</p>';
    }
  },

  renderTable(tableId, items, type) {
    const tbody = document.getElementById(tableId);
    if (!items || items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No records found</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(item => {
      const fioriLink = this.getFioriLink(type, item.id);
      return `
        <tr>
          <td><a href="${fioriLink}" class="link">${item.id}</a></td>
          <td>${item.vendor_id || item.requester_id || item.assigned_to || '-'}</td>
          <td>${item.amount || item.priority || '-'}</td>
          <td><span class="status status-${item.status.toLowerCase()}">${item.status}</span></td>
          <td>${new Date(item.created_date).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm" onclick="app.showDetail('${type}', '${item.id}')">View</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  getFioriLink(type, id) {
    if (type === 'PurchaseOrder') {
      return `/#PurchaseOrder-display?PurchaseOrder=${id}`;
    } else if (type === 'PurchaseRequest') {
      return `/#PurchaseRequest-display?PurchaseRequest=${id}`;
    } else if (type === 'WorkOrder') {
      return `/#WorkOrder-display?WorkOrder=${id}`;
    }
    return '#';
  },

  async showDetail(type, id) {
    try {
      const endpoint = type === 'PurchaseOrder' ? 'PurchaseOrder' :
                      type === 'PurchaseRequest' ? 'PurchaseRequest' : 'WorkOrder';
      const response = await fetch(`${this.apiBase}/api/fiori/${endpoint}/${id}`);
      const data = await response.json();

      alert(`${type} Details:\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert('Error loading details: ' + error.message);
    }
  },

  openCreateModal(type) {
    this.currentModalType = type;
    const config = this.objectTypes[type];
    const modal = document.getElementById('createModal');
    const modalTitle = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');
    const createForm = document.getElementById('createForm');

    modalTitle.textContent = `Create ${config.label.slice(0, -1)}`;
    
    formFields.innerHTML = config.fields.map(field => {
      const required = field.required ? 'required' : '';
      const value = field.default || '';
      
      if (field.type === 'textarea') {
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <textarea id="${field.name}" name="${field.name}" ${required}></textarea>
          </div>
        `;
      } else if (field.type === 'select') {
        const options = field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <select id="${field.name}" name="${field.name}" ${required}>
              <option value="">Select ${field.label}</option>
              ${options}
            </select>
          </div>
        `;
      } else {
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${required} />
          </div>
        `;
      }
    }).join('');

    createForm.dataset.type = type;
    modal.classList.add('active');
  },

  closeCreateModal() {
    const modal = document.getElementById('createModal');
    const createForm = document.getElementById('createForm');
    modal.classList.remove('active');
    createForm.reset();
    this.currentModalType = null;
  },

  async submitCreateForm(event) {
    event.preventDefault();
    
    const type = this.currentModalType;
    const config = this.objectTypes[type];
    const form = document.getElementById('createForm');
    const formData = new FormData(form);
    
    const data = {
      created_by: 'DEMO_USER',
    };
    
    config.fields.forEach(field => {
      const value = formData.get(field.name);
      if (value) {
        data[field.name] = field.type === 'number' ? parseFloat(value) : value;
      }
    });

    try {
      const response = await fetch(`${this.apiBase}/sap/opu/odata/sap/${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.closeCreateModal();
      
      // Reload data and show success
      await this.loadData();
      alert(`${config.label.slice(0, -1)} created successfully: ${result.id}`);
    } catch (error) {
      alert(`Error creating ${config.label.slice(0, -1)}: ${error.message}`);
    }
  },

  async loadObjectsGrid() {
    const grid = document.getElementById('objectsGrid');
    
    try {
      const cards = await Promise.all(
        Object.entries(this.objectTypes).map(async ([type, config]) => {
          try {
            const response = await fetch(`${this.apiBase}/api/fiori/${config.apiEndpoint}`);
            const data = await response.json();
            const items = data.value || [];
            
            const preview = items.slice(0, 3).map(item => {
              const id = item.id;
              const date = new Date(item.created_date).toLocaleDateString();
              const status = item.status;
              return `<div class="preview-item">${id} | ${date} | ${status}</div>`;
            }).join('');

            return `
              <div class="object-card">
                <div class="card-header" onclick="app.navigateToDashboard('${type}')">
                  <h3>${config.label}</h3>
                  <span class="card-count">${items.length}</span>
                </div>
                <div class="card-preview">
                  ${preview || '<div class="preview-item">No items yet</div>'}
                </div>
                <button class="btn btn-primary" onclick="app.openCreateModal('${type}')">
                  + Create
                </button>
              </div>
            `;
          } catch (error) {
            console.error(`Error loading ${type}:`, error);
            return `
              <div class="object-card">
                <div class="card-header">
                  <h3>${config.label}</h3>
                  <span class="card-count">0</span>
                </div>
                <div class="card-preview">
                  <div class="preview-item error">Error loading data</div>
                </div>
                <button class="btn btn-primary" onclick="app.openCreateModal('${type}')">
                  + Create
                </button>
              </div>
            `;
          }
        })
      );

      grid.innerHTML = cards.join('');
    } catch (error) {
      console.error('Error loading objects grid:', error);
      grid.innerHTML = '<div class="error">Error loading objects grid</div>';
    }
  },

  navigateToDashboard(type) {
    const viewMap = {
      'PurchaseOrder': 'purchase-orders',
      'PurchaseRequest': 'purchase-requests',
      'WorkOrder': 'work-orders'
    };
    this.switchView(viewMap[type]);
  },

  formatApiDocs(data) {
    let html = '<h3>OData API Endpoints</h3>';

    // Purchase Orders
    html += '<h4>Purchase Orders</h4><ul>';
    html += `<li><code>GET ${data.endpoints.odata.purchaseOrders.list}</code></li>`;
    html += `<li><code>GET ${data.endpoints.odata.purchaseOrders.get}</code></li>`;
    html += `<li><code>POST ${data.endpoints.odata.purchaseOrders.create}</code></li>`;
    html += `<li><code>PATCH ${data.endpoints.odata.purchaseOrders.update}</code></li>`;
    html += `<li><code>DELETE ${data.endpoints.odata.purchaseOrders.delete}</code></li>`;
    html += '</ul>';

    // Actions
    html += '<h4>Purchase Order Actions</h4><ul>';
    Object.entries(data.endpoints.odata.purchaseOrders.actions).forEach(([name, endpoint]) => {
      html += `<li><code>POST ${endpoint}</code> - ${name}</li>`;
    });
    html += '</ul>';

    // Fiori Navigation
    html += '<h3>Fiori Intent-Based Navigation</h3><ul>';
    Object.entries(data.fioriNavigation).forEach(([name, url]) => {
      html += `<li><code>${url}</code> - ${name}</li>`;
    });
    html += '</ul>';

    return html;
  },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
