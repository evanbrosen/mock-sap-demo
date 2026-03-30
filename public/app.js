// Mock SAP Frontend - Fiori Navigation App
const app = {
  currentView: 'home',
  apiBase: window.location.origin,

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
      if (viewName === 'purchase-orders') {
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

  createNew(type) {
    const data = {
      vendor_id: 'VENDOR-001',
      requester_id: 'USER-001',
      assigned_to: 'USER-001',
      amount: 1000,
      currency: 'USD',
      priority: 'MEDIUM',
      description: 'New ' + type,
      created_by: 'DEMO_USER',
    };

    const endpoint = type === 'PurchaseOrder' ? 'Z_PURCHASE_ORDER_SRV/PurchaseOrderSet' :
                    type === 'PurchaseRequest' ? 'Z_PURCHASE_REQUEST_SRV/PurchaseRequestSet' :
                    'Z_WORK_ORDER_SRV/WorkOrderSet';

    fetch(`${this.apiBase}/sap/opu/odata/sap/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(r => r.json())
      .then(result => {
        alert(`${type} created: ${result.id}`);
        this.loadData();
      })
      .catch(err => alert('Error: ' + err.message));
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
