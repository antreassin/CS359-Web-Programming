// E-199 Emergency Management System
// Main Application JavaScript

// State Management
const state = {
    incidents: [],
    services: {
        fire: { units: 5, personnel: 25, active: 0, calls: 0 },
        medical: { units: 8, personnel: 32, active: 0, calls: 0 },
        police: { units: 12, personnel: 48, active: 0, calls: 0 }
    },
    messages: [],
    filters: {
        status: 'all',
        priority: 'all'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadDataFromStorage();
    setupEventListeners();
    updateUI();
});

// Initialize application
function initializeApp() {
    console.log('E-199 Emergency Management System initialized');
    
    // Add some sample data if no data exists
    if (state.incidents.length === 0) {
        addSampleIncidents();
    }
}

// Load data from localStorage
function loadDataFromStorage() {
    const storedIncidents = localStorage.getItem('e199_incidents');
    const storedServices = localStorage.getItem('e199_services');
    const storedMessages = localStorage.getItem('e199_messages');
    
    if (storedIncidents) {
        state.incidents = JSON.parse(storedIncidents);
    }
    
    if (storedServices) {
        state.services = JSON.parse(storedServices);
    }
    
    if (storedMessages) {
        state.messages = JSON.parse(storedMessages);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('e199_incidents', JSON.stringify(state.incidents));
    localStorage.setItem('e199_services', JSON.stringify(state.services));
    localStorage.setItem('e199_messages', JSON.stringify(state.messages));
}

// Add sample incidents for demonstration
function addSampleIncidents() {
    const sampleIncidents = [
        {
            id: generateIncidentId(),
            type: 'fire',
            priority: 'critical',
            location: '123 Main Street, Downtown',
            contactName: 'John Doe',
            contactPhone: '555-0123',
            description: 'Building fire reported on the 3rd floor',
            status: 'responding',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            service: 'fire'
        },
        {
            id: generateIncidentId(),
            type: 'medical',
            priority: 'high',
            location: '456 Oak Avenue, North District',
            contactName: 'Jane Smith',
            contactPhone: '555-0124',
            description: 'Person collapsed, unconscious',
            status: 'dispatched',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            service: 'medical'
        },
        {
            id: generateIncidentId(),
            type: 'accident',
            priority: 'medium',
            location: 'Highway 101, Mile Marker 45',
            contactName: 'Bob Johnson',
            contactPhone: '555-0125',
            description: 'Two-car collision, minor injuries',
            status: 'reported',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            service: 'police'
        }
    ];
    
    state.incidents = sampleIncidents;
    saveDataToStorage();
}

// Generate unique incident ID
function generateIncidentId() {
    const prefix = 'INC';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const viewName = e.currentTarget.dataset.view;
            switchView(viewName);
        });
    });
    
    // Incident form submission
    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', handleIncidentSubmit);
    }
    
    // Filters
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            state.filters.status = e.target.value;
            updateIncidentsTable();
        });
    }
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', (e) => {
            state.filters.priority = e.target.value;
            updateIncidentsTable();
        });
    }
    
    // Communication
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Modal
    const modal = document.getElementById('incidentModal');
    const closeButtons = document.querySelectorAll('.modal-close, .close-modal');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Switch between views
function switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update content views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
    });
    
    const activeView = document.getElementById(`${viewName}-view`);
    if (activeView) {
        activeView.classList.add('active-view');
    }
    
    // Update view-specific content
    if (viewName === 'incidents') {
        updateIncidentsTable();
    } else if (viewName === 'services') {
        updateServicesView();
    } else if (viewName === 'communication') {
        updateCommunicationFeed();
    } else if (viewName === 'dashboard') {
        updateDashboard();
    }
}

// Handle incident form submission
function handleIncidentSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: generateIncidentId(),
        type: document.getElementById('incidentType').value,
        priority: document.getElementById('priority').value,
        location: document.getElementById('location').value,
        contactName: document.getElementById('contactName').value,
        contactPhone: document.getElementById('contactPhone').value,
        description: document.getElementById('description').value,
        status: 'reported',
        timestamp: new Date().toISOString(),
        service: determineService(document.getElementById('incidentType').value)
    };
    
    // Add incident to state
    state.incidents.unshift(formData);
    saveDataToStorage();
    
    // Update service stats
    updateServiceStats(formData.service);
    
    // Add system message
    addSystemMessage(`New incident reported: ${formData.id} - ${formData.type} at ${formData.location}`);
    
    // Show success and reset form
    alert('Incident reported successfully! ID: ' + formData.id);
    e.target.reset();
    
    // Update UI
    updateUI();
    
    // Switch to incidents view
    switchView('incidents');
}

// Determine which service should handle the incident
function determineService(incidentType) {
    const serviceMap = {
        'fire': 'fire',
        'medical': 'medical',
        'accident': 'police',
        'hazmat': 'fire',
        'rescue': 'fire',
        'other': 'police'
    };
    
    return serviceMap[incidentType] || 'police';
}

// Update service statistics
function updateServiceStats(service) {
    if (state.services[service]) {
        state.services[service].calls++;
        saveDataToStorage();
    }
}

// Update all UI elements
function updateUI() {
    updateHeaderStats();
    updateDashboard();
    updateIncidentsTable();
    updateServicesView();
    updateCommunicationFeed();
}

// Update header statistics
function updateHeaderStats() {
    const activeIncidents = state.incidents.filter(inc => 
        inc.status !== 'resolved'
    ).length;
    
    const resolvedToday = state.incidents.filter(inc => {
        const incidentDate = new Date(inc.timestamp);
        const today = new Date();
        return inc.status === 'resolved' && 
               incidentDate.toDateString() === today.toDateString();
    }).length;
    
    // Calculate average response time (simulated)
    const avgResponseTime = calculateAverageResponseTime();
    
    document.getElementById('activeCount').textContent = activeIncidents;
    document.getElementById('resolvedCount').textContent = resolvedToday;
    document.getElementById('avgResponseTime').textContent = avgResponseTime;
}

// Calculate average response time
function calculateAverageResponseTime() {
    const resolvedIncidents = state.incidents.filter(inc => inc.status === 'resolved');
    
    if (resolvedIncidents.length === 0) {
        return 0;
    }
    
    // Simulate response times between 5-20 minutes
    const avgTime = Math.floor(Math.random() * 15) + 5;
    return avgTime;
}

// Update dashboard view
function updateDashboard() {
    updateRecentIncidents();
}

// Update recent incidents in dashboard
function updateRecentIncidents() {
    const container = document.getElementById('recentIncidents');
    const recentIncidents = state.incidents.slice(0, 5);
    
    if (recentIncidents.length === 0) {
        container.innerHTML = '<p class="no-data">No recent incidents</p>';
        return;
    }
    
    container.innerHTML = recentIncidents.map(incident => `
        <div class="incident-item" onclick="showIncidentDetails('${incident.id}')">
            <div class="incident-header">
                <span class="incident-id">${incident.id}</span>
                <span class="priority-badge priority-${incident.priority}">${incident.priority.toUpperCase()}</span>
            </div>
            <div class="incident-body">
                <p><strong>Type:</strong> ${incident.type}</p>
                <p><strong>Location:</strong> ${incident.location}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${incident.status}">${incident.status.toUpperCase()}</span></p>
                <p><strong>Time:</strong> ${formatTimestamp(incident.timestamp)}</p>
            </div>
        </div>
    `).join('');
}

// Update incidents table
function updateIncidentsTable() {
    const tbody = document.getElementById('incidentsTableBody');
    let filteredIncidents = state.incidents;
    
    // Apply filters
    if (state.filters.status !== 'all') {
        filteredIncidents = filteredIncidents.filter(inc => inc.status === state.filters.status);
    }
    
    if (state.filters.priority !== 'all') {
        filteredIncidents = filteredIncidents.filter(inc => inc.priority === state.filters.priority);
    }
    
    if (filteredIncidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No incidents found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredIncidents.map(incident => `
        <tr>
            <td><strong>${incident.id}</strong></td>
            <td>${incident.type}</td>
            <td>${incident.location}</td>
            <td><span class="priority-badge priority-${incident.priority}">${incident.priority.toUpperCase()}</span></td>
            <td><span class="status-badge status-${incident.status}">${incident.status.toUpperCase()}</span></td>
            <td>${formatTimestamp(incident.timestamp)}</td>
            <td>
                <button class="btn-action" onclick="showIncidentDetails('${incident.id}')">View</button>
                ${incident.status !== 'resolved' ? 
                    `<button class="btn-action" onclick="updateIncidentStatus('${incident.id}')">Update</button>` : 
                    ''}
            </td>
        </tr>
    `).join('');
}

// Update services view
function updateServicesView() {
    // Update Fire Department
    document.getElementById('fireUnits').textContent = state.services.fire.units;
    document.getElementById('firePersonnel').textContent = state.services.fire.personnel;
    document.getElementById('fireActive').textContent = state.services.fire.active;
    document.getElementById('fireCalls').textContent = state.services.fire.calls;
    
    // Update Medical Emergency
    document.getElementById('medicalUnits').textContent = state.services.medical.units;
    document.getElementById('medicalPersonnel').textContent = state.services.medical.personnel;
    document.getElementById('medicalActive').textContent = state.services.medical.active;
    document.getElementById('medicalCalls').textContent = state.services.medical.calls;
    
    // Update Police Department
    document.getElementById('policeUnits').textContent = state.services.police.units;
    document.getElementById('policePersonnel').textContent = state.services.police.personnel;
    document.getElementById('policeActive').textContent = state.services.police.active;
    document.getElementById('policeCalls').textContent = state.services.police.calls;
}

// Update communication feed
function updateCommunicationFeed() {
    const feed = document.getElementById('communicationFeed');
    
    if (state.messages.length === 0) {
        feed.innerHTML = `
            <div class="communication-message system">
                <span class="message-time">System</span>
                <p>Communication center initialized. Ready to coordinate emergency responses.</p>
            </div>
        `;
        return;
    }
    
    feed.innerHTML = state.messages.map(msg => `
        <div class="communication-message ${msg.type}">
            <span class="message-time">${msg.time}</span>
            <p>${msg.content}</p>
        </div>
    `).join('');
    
    // Scroll to bottom
    feed.scrollTop = feed.scrollHeight;
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content) {
        return;
    }
    
    const message = {
        type: 'user',
        time: formatTimestamp(new Date().toISOString()),
        content: content
    };
    
    state.messages.push(message);
    saveDataToStorage();
    
    // Clear input
    input.value = '';
    
    // Update feed
    updateCommunicationFeed();
}

// Add system message
function addSystemMessage(content) {
    const message = {
        type: 'system',
        time: formatTimestamp(new Date().toISOString()),
        content: content
    };
    
    state.messages.push(message);
    saveDataToStorage();
}

// Show incident details in modal
function showIncidentDetails(incidentId) {
    const incident = state.incidents.find(inc => inc.id === incidentId);
    
    if (!incident) {
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Incident ID:</span>
            <span class="detail-value">${incident.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${incident.type}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Priority:</span>
            <span class="detail-value">
                <span class="priority-badge priority-${incident.priority}">${incident.priority.toUpperCase()}</span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
                <span class="status-badge status-${incident.status}">${incident.status.toUpperCase()}</span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${incident.location}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Contact Name:</span>
            <span class="detail-value">${incident.contactName || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Contact Phone:</span>
            <span class="detail-value">${incident.contactPhone || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${incident.description}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Assigned Service:</span>
            <span class="detail-value">${incident.service}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Reported Time:</span>
            <span class="detail-value">${formatTimestamp(incident.timestamp)}</span>
        </div>
        ${incident.status !== 'resolved' ? `
            <div class="status-actions">
                <button class="btn btn-primary" onclick="changeIncidentStatus('${incident.id}', 'dispatched')">Dispatch</button>
                <button class="btn btn-primary" onclick="changeIncidentStatus('${incident.id}', 'responding')">Responding</button>
                <button class="btn btn-primary" onclick="changeIncidentStatus('${incident.id}', 'resolved')">Resolve</button>
            </div>
        ` : ''}
    `;
    
    const modal = document.getElementById('incidentModal');
    modal.classList.add('active');
}

// Update incident status
function updateIncidentStatus(incidentId) {
    showIncidentDetails(incidentId);
}

// Change incident status
function changeIncidentStatus(incidentId, newStatus) {
    const incident = state.incidents.find(inc => inc.id === incidentId);
    
    if (!incident) {
        return;
    }
    
    const oldStatus = incident.status;
    incident.status = newStatus;
    
    // Update service active count
    const service = incident.service;
    if (newStatus === 'responding' && oldStatus !== 'responding') {
        state.services[service].active++;
    } else if (newStatus === 'resolved' && oldStatus === 'responding') {
        state.services[service].active--;
    }
    
    saveDataToStorage();
    
    // Add system message
    addSystemMessage(`Incident ${incidentId} status changed from ${oldStatus} to ${newStatus}`);
    
    // Update UI
    updateUI();
    
    // Close modal
    const modal = document.getElementById('incidentModal');
    modal.classList.remove('active');
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleString();
    }
}

// Export functions to global scope for HTML onclick handlers
window.showIncidentDetails = showIncidentDetails;
window.updateIncidentStatus = updateIncidentStatus;
window.changeIncidentStatus = changeIncidentStatus;
