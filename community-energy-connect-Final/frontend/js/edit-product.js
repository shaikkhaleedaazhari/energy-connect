document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('Product ID is required');
        return;
    }

    // Load product details
    fetch(`php/get-product-detail.php?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateForm(data.product);
            } else {
                showError(data.message || 'Failed to load product details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while loading product details');
        });

    // Handle form submission
    document.getElementById('editProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const specifications = document.getElementById('specifications').value
            .split('\n')
            .map(spec => spec.trim())
            .filter(spec => spec.length > 0);
        
        const productData = {
            id: productId,
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            subcategory: formData.get('subcategory'),
            pricing: formData.get('pricing'),
            availability: formData.get('availability'),
            quantity: formData.get('quantity'),
            specifications: JSON.stringify(specifications),
            image_url: formData.get('image_url')
        };

        // Send update request
        fetch('php/manage-products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=update&${new URLSearchParams(productData).toString()}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Product updated successfully!');
                window.location.href = 'products.html';
            } else {
                showError(data.message || 'Failed to update product');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while updating the product');
        });
    });
});

function populateForm(product) {
    document.getElementById('productId').value = product.id;
    document.getElementById('title').value = product.name || product.title || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('category').value = product.category || '';
    document.getElementById('subcategory').value = product.subcategory || '';
    document.getElementById('pricing').value = product.price || product.pricing || '';

    // Normalize availability
    document.getElementById('image_url').value = product.image_url || '';
    
    // Handle specifications
    let specs = [];
    try {
        if (Array.isArray(product.specifications)) {
            specs = product.specifications;
        } else if (typeof product.specifications === 'string') {
            specs = JSON.parse(product.specifications);
        }
    } catch (error) {
        console.warn('Error parsing specifications:', error);
    }
    document.getElementById('specifications').value = Array.isArray(specs) ? specs.join('\n') : '';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll to error message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        alert(message);
    }
} 