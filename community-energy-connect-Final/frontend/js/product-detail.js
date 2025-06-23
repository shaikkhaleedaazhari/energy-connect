document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    // Fallback: try localStorage if not in URL
    if (!productId) {
        productId = localStorage.getItem('selectedProduct');
    }
    if (!productId) {
        showError('Product ID is required');
        return;
    }

    // Fetch product details
    fetch(`php/get-product-detail.php?id=${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayProductDetails(data.product, data.provider);
            } else {
                showError(data.message || 'Failed to load product details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while loading product details');
        });

    setupContactAndWishlistButtons();
    // Observe DOM changes in case buttons are re-rendered by JS
    const observer = new MutationObserver(setupContactAndWishlistButtons);
    observer.observe(document.body, { childList: true, subtree: true });
});

function displayProductDetails(product, provider) {
    // Update page title
    const productName = product.name || product.title || 'Product';
    document.title = `${productName} - Community Energy Connect`;
    
    // Update category badge and breadcrumb
    const categoryElement = document.querySelector('.category');
    if (categoryElement) {
        if (product.category && product.category.trim() !== '') {
            categoryElement.textContent = product.category;
            categoryElement.style.display = '';
        } else {
            categoryElement.style.display = 'none';
        }
    }
    const categoryBadge = document.querySelector('.category-badge');
    if (categoryBadge) {
        if (product.category && product.category.trim() !== '') {
            categoryBadge.textContent = product.category;
            categoryBadge.style.display = '';
        } else {
            categoryBadge.style.display = 'none';
        }
    }

    // Update product name
    const nameElement = document.querySelector('h1');
    if (nameElement) {
        nameElement.textContent = productName;
    }

    // Update product image
    const imageElement = document.querySelector('.product-image');
    if (imageElement) {
        imageElement.src = product.image_url || 'images/default-product.jpg';
        imageElement.alt = productName;
        imageElement.onerror = function() {
            this.src = 'images/default-product.jpg';
        };
    }

    // Update price
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        const price = product.price || product.pricing;
        priceElement.textContent = price ? `$${parseFloat(price).toFixed(2)}` : 'Price on request';
    }

    // Update description
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        descriptionElement.textContent = product.description || 'No description available';
    }

    // Update specifications list
    const specsList = document.querySelector('.specifications-list');
    if (specsList) {
        let specifications = [];
        try {
            if (Array.isArray(product.specifications)) {
                specifications = product.specifications;
            } else if (typeof product.specifications === 'string' && product.specifications.trim() !== '') {
                specifications = JSON.parse(product.specifications);
            }
        } catch (error) {
            console.warn('Error parsing specifications:', error);
        }
        if (!Array.isArray(specifications)) specifications = [];
        console.log('Product specifications:', specifications); // Debug log
        if (specifications.length > 0) {
            specsList.innerHTML = specifications.map(spec => 
                `<li><i class="fas fa-check"></i> ${spec}</li>`
            ).join('');
        } else {
            specsList.innerHTML = '<li>No specifications available</li>';
        }
    }

    // Update provider information if available
    if (provider) {
        displayProviderContactDetails(provider);
    }
}

function showError(message) {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll to error message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        alert(message);
    }
}

function isProvider() {
    // Use the auth manager to check if user is a provider
    return authManager && authManager.isProvider();
}

function setupContactAndWishlistButtons() {
    // Remove wishlist button if present
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) wishlistBtn.remove();
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