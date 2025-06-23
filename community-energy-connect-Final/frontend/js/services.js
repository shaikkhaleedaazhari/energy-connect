// DOM Elements
const servicesGrid = document.getElementById('servicesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const applyFiltersBtn = document.getElementById('applyFilters');
const categoryPills = document.querySelectorAll('.category-pill');

// State
let currentFilters = {
    category: '',
    priceRange: '',
    availability: '',
};

// Service Categories
const SERVICE_CATEGORIES = {
    'Solar Installation': 'Solar Installation',
    'Energy Audit': 'Energy Audit',
    'Maintenance': 'Maintenance',
    'Solar Energy Services': 'Solar Energy Services',
    'Energy Efficiency Services': 'Energy Efficiency Services',
    'Educational Workshops': 'Educational Workshops'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    setupEventListeners();
});

function setupEventListeners() {
    // Category pills click handler
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilters.category = pill.dataset.category === 'all' ? '' : pill.dataset.category;
            categoryFilter.value = currentFilters.category; // Sync with dropdown
            loadServices();
        });
    });

    // Apply filters button click handler
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            currentFilters.category = categoryFilter.value;
            currentFilters.priceRange = priceFilter.value;
            currentFilters.availability = availabilityFilter.value;
            loadServices();
        });
    }

    // Individual filter change handlers
    categoryFilter.addEventListener('change', () => {
        currentFilters.category = categoryFilter.value;
        // Update active pill
        categoryPills.forEach(pill => {
            if (pill.dataset.category === categoryFilter.value || 
                (categoryFilter.value === '' && pill.dataset.category === 'all')) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
        loadServices();
    });

    priceFilter.addEventListener('change', () => {
        currentFilters.priceRange = priceFilter.value;
        loadServices();
    });

    availabilityFilter.addEventListener('change', () => {
        currentFilters.availability = availabilityFilter.value;
        loadServices();
    });
}

// Functions
async function loadServices() {
    try {
        showLoading();
        const queryParams = new URLSearchParams();
        if (currentFilters.category) queryParams.append('category', currentFilters.category);
        if (currentFilters.priceRange) queryParams.append('priceRange', currentFilters.priceRange);
        if (currentFilters.availability) queryParams.append('availability', currentFilters.availability);
        const response = await fetch('./php/get-services.php?' + queryParams.toString());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
            displayServices(data.services);
        } else {
            throw new Error(data.message || 'Failed to load services');
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function getServiceIcon(category) {
    switch ((category || '').toLowerCase()) {
        case 'solar energy services':
        case 'solar installation':
        case 'solar':
            return '<span class="card-header-icon card-header-solar"><i class="fas fa-solar-panel"></i> ' + (category || '') + '</span>';
        case 'energy efficiency services':
        case 'energy efficiency':
            return '<span class="card-header-icon card-header-efficiency"><i class="fas fa-bolt"></i> ' + (category || '') + '</span>';
        case 'educational workshops':
        case 'workshop':
            return '<span class="card-header-icon card-header-workshop"><i class="fas fa-chalkboard-teacher"></i> ' + (category || '') + '</span>';
        default:
            return '<span class="card-header-icon card-header-other"><i class="fas fa-cogs"></i> ' + (category || '') + '</span>';
    }
}

function updateServicesStatusIcon(services) {
    const iconSpan = document.getElementById('servicesStatusIcon');
    if (!iconSpan) return;
    if (!services || services.length === 0) {
        iconSpan.innerHTML = '<i class="fas fa-plus-circle" style="color:#22c55e;" title="Add new service"></i>';
    } else {
        iconSpan.innerHTML = '<i class="fas fa-check-circle" style="color:#22c55e;" title="Existing services"></i>';
    }
}

const origDisplayServices = displayServices;
displayServices = function(services) {
    origDisplayServices(services);
    updateServicesStatusIcon(services);
}

function displayServices(services) {
    if (!services || !services.length) {
        servicesGrid.innerHTML = '<p class="no-results">No services found matching your criteria.</p>';
        return;
    }

    const servicesHTML = services.map(service => `
        <div class="service-card">
            ${getServiceIcon(service.category)}
            <div class="card-content">
                <h3 class="card-title">${service.name || service.title || ''}</h3>
                <p class="card-description">${service.description || 'No description available'}</p>
                <div class="card-badges">
                    <span class="card-badge-price">$${formatPrice(service.price || service.pricing)}</span>
                </div>
                <button onclick="viewService(${service.id})" class="learn-more-btn">Learn More</button>
            </div>
        </div>
    `).join('');

    servicesGrid.innerHTML = servicesHTML;
}

function formatPrice(price) {
    if (!price) return '0.00';
    return parseFloat(price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

function showError(message = 'Error loading services. Please try again later.') {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

function viewService(serviceId) {
    window.location.href = `./service-detail.html?id=${serviceId}`;
}

async function loadLocations() {
    try {
        const response = await fetch('./php/get-locations.php');
        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        if (data.success) {
            populateLocationFilter(data.locations);
        }
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

function populateLocationFilter(locations) {
    const options = locations.map(location => 
        `<option value="${location.id}">${location.name}</option>`
    ).join('');
    locationFilter.innerHTML += options;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getAvailabilityClass(availability) {
    if (!availability) return 'status-available';
    const status = availability.toLowerCase();
    if (status.includes('unavailable')) return 'status-unavailable';
    if (status.includes('coming')) return 'status-coming-soon';
    return 'status-available';
} 