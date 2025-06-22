// DOM Elements
const productsGrid = document.getElementById('productsGrid');
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

// Product Categories
const PRODUCT_CATEGORIES = {
    'Solar Panels': 'Solar Panels',
    'Batteries': 'Batteries',
    'Inverters': 'Inverters',
    'Energy Efficiency Appliances': 'Energy Efficiency Appliances',
    'Home Energy Monitoring': 'Home Energy Monitoring'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadBrands();
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
            loadProducts();
        });
    });

    // Apply filters button click handler
    applyFiltersBtn.addEventListener('click', () => {
        currentFilters.category = categoryFilter.value;
        currentFilters.priceRange = priceFilter.value;
        currentFilters.availability = availabilityFilter.value;
        loadProducts();
    });

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
        loadProducts();
    });

    priceFilter.addEventListener('change', () => {
        currentFilters.priceRange = priceFilter.value;
        loadProducts();
    });

    availabilityFilter.addEventListener('change', () => {
        currentFilters.availability = availabilityFilter.value;
        loadProducts();
    });
}

// Functions
async function loadProducts() {
    try {
        showLoading();
        const queryParams = new URLSearchParams();
        
        // Only add non-empty filters to the query
        if (currentFilters.category) queryParams.append('category', currentFilters.category);
        if (currentFilters.priceRange) queryParams.append('priceRange', currentFilters.priceRange);
        if (currentFilters.availability) queryParams.append('availability', currentFilters.availability);
        
        const response = await fetch('./php/get-products.php?' + queryParams.toString());
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            displayProducts(data.products);
        } else {
            throw new Error(data.message || 'Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function getProductIcon(category) {
    switch ((category || '').toLowerCase()) {
        case 'renewable energy equipment':
        case 'solar panels':
            return '<span class="card-header-icon card-header-solar"><i class="fas fa-solar-panel"></i> ' + (category || '') + '</span>';
        case 'energy efficiency appliances':
            return '<span class="card-header-icon card-header-efficiency"><i class="fas fa-lightbulb"></i> ' + (category || '') + '</span>';
        case 'home energy monitoring':
            return '<span class="card-header-icon card-header-workshop"><i class="fas fa-broadcast-tower"></i> ' + (category || '') + '</span>';
        default:
            return '<span class="card-header-icon card-header-other"><i class="fas fa-cogs"></i> ' + (category || '') + '</span>';
    }
}

function displayProducts(products) {
    if (!products || !products.length) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }

    const productsHTML = products.map(product => `
        <div class="product-card">
            ${getProductIcon(product.category)}
            <div class="card-content">
                <h3 class="card-title">${product.name || product.title || ''}</h3>
                <p class="card-description">${product.description || 'No description available'}</p>
                <div class="card-badges">
                    <span class="card-badge-price">$${formatPrice(product.price || product.pricing)}</span>
                </div>
                <button onclick="viewProduct(${product.id})" class="learn-more-btn">Learn More</button>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;
    updateProductsStatusIcon(products);
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

function showError(message = 'Error loading products. Please try again later.') {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

async function loadBrands() {
    try {
        const response = await fetch('./php/get-brands.php');
        if (!response.ok) throw new Error('Failed to load brands');
        
        const data = await response.json();
        if (data.success && data.brands) {
            populateBrandFilter(data.brands);
        }
    } catch (error) {
        console.error('Error loading brands:', error);
    }
}

function populateBrandFilter(brands) {
    if (!brandFilter) return;
    
    const options = brands.map(brand => 
        `<option value="${brand.value}">${brand.label}</option>`
    ).join('');
    
    brandFilter.innerHTML = `
        <option value="">All Brands</option>
        ${options}
    `;
}

function viewProduct(productId) {
    window.location.href = `./product-detail.html?id=${productId}`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getAvailabilityClass(availability) {
    if (!availability) return 'status-available';
    const status = availability.toLowerCase();
    if (status.includes('out')) return 'status-unavailable';
    if (status.includes('coming')) return 'status-coming-soon';
    return 'status-available';
}

function updateProductsStatusIcon(products) {
    const iconSpan = document.getElementById('productsStatusIcon');
    if (!iconSpan) return;
    if (!products || products.length === 0) {
        iconSpan.innerHTML = '<i class="fas fa-plus-circle" style="color:#22c55e;" title="Add new product"></i>';
    } else {
        iconSpan.innerHTML = '<i class="fas fa-check-circle" style="color:#22c55e;" title="Existing products"></i>';
    }
} 