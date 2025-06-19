document.addEventListener('DOMContentLoaded', function() {
    // Get service ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        showError('Service ID is required');
        return;
    }

    // Fetch service details
    fetch(`php/get-service-detail.php?id=${serviceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayServiceDetails(data.service, data.provider);
            } else {
                showError(data.message || 'Failed to load service details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while loading service details');
        });

    setupContactAndWishlistButtons();
    // Observe DOM changes in case buttons are re-rendered by JS
    const observer = new MutationObserver(setupContactAndWishlistButtons);
    observer.observe(document.body, { childList: true, subtree: true });
});

function displayServiceDetails(service, provider) {
    // Update page title
    document.title = `${service.name || service.title} - Community Energy Connect`;
    
    // Update category badge and breadcrumb
    const categoryElement = document.querySelector('.category');
    if (categoryElement) {
        if (service.category && service.category.trim() !== '') {
            categoryElement.textContent = service.category;
            categoryElement.style.display = '';
        } else {
            categoryElement.style.display = 'none';
        }
    }
    const categoryBadge = document.querySelector('.category-badge');
    if (categoryBadge) {
        if (service.category && service.category.trim() !== '') {
            categoryBadge.textContent = service.category;
            categoryBadge.style.display = '';
        } else {
            categoryBadge.style.display = 'none';
        }
    }

    // Update service name
    const nameElement = document.querySelector('h1');
    if (nameElement) {
        nameElement.textContent = service.name || service.title || 'Service Name Not Available';
    }

    // Update service image
    const imageElement = document.querySelector('.service-image');
    if (imageElement) {
        imageElement.src = service.image_url || 'images/default-service.jpg';
        imageElement.alt = service.name || service.title || 'Service Image';
        imageElement.onerror = function() {
            this.src = 'images/default-service.jpg';
        };
    }

    // Update price
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        const price = service.price || service.pricing || 0;
        priceElement.textContent = `Starting at $${parseFloat(price).toFixed(2)}`;
    }

    // Update description
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        descriptionElement.textContent = service.description || 'No description available';
    }

    // Update features list
    const featuresList = document.querySelector('.features-list');
    if (featuresList) {
        let features = [];
        if (Array.isArray(service.features)) {
            features = service.features;
        } else if (typeof service.features === 'string' && service.features.trim() !== '') {
            try {
                features = JSON.parse(service.features);
            } catch (e) {
                features = service.features.split('\n');
            }
        }
        if (!Array.isArray(features)) features = [];
        console.log('Service features:', features); // Debug log
        if (features.length > 0) {
            featuresList.innerHTML = features.map(feature => 
                `<li><i class="fas fa-check"></i> ${feature}</li>`
            ).join('');
        } else {
            featuresList.innerHTML = '<li>No features listed</li>';
        }
    }

    // Update provider information if available
    if (provider) {
        displayProviderContactDetails(provider);
    }
}

function displayProviderContactDetails(provider) {
    const providerInfoCard = document.querySelector('.provider-info-card');
    const providerDetails = document.querySelector('.provider-details');
    
    if (providerInfoCard && providerDetails) {
        providerInfoCard.style.display = 'block';
        
        // Create provider details HTML
        providerDetails.innerHTML = `
            <div class="provider-detail-item">
                <i class="fas fa-building"></i>
                <span>${provider.company_name || 'N/A'}</span>
            </div>
            <div class="provider-detail-item">
                <i class="fas fa-user"></i>
                <span>${provider.contact_name || 'N/A'}</span>
            </div>
            <div class="provider-detail-item">
                <i class="fas fa-phone"></i>
                <span>${provider.phone_number || 'N/A'}</span>
            </div>
        `;
    }
}

function showError(message) {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message);
    }
}

function setupContactAndWishlistButtons() {
    // Remove wishlist button if present
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) wishlistBtn.remove();
} 