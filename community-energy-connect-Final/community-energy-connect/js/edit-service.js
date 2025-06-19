document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    
    if (!serviceId) {
        showError('Service ID is required');
        return;
    }

    // Load service details
    fetch(`php/get-service-detail.php?id=${serviceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateForm(data.service);
            } else {
                showError(data.message || 'Failed to load service details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while loading service details');
        });

    // Handle form submission
    document.getElementById('editServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const features = document.getElementById('features').value
            .split('\n')
            .map(feature => feature.trim())
            .filter(feature => feature.length > 0);
        
        const serviceData = {
            id: serviceId,
            title: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            subcategory: formData.get('subcategory'),
            pricing: formData.get('price'),

            features: JSON.stringify(features),
            image_url: formData.get('image_url')
        };

        // Send update request
        fetch('php/manage-services.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=update&${new URLSearchParams(serviceData).toString()}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Service updated successfully!');
                window.location.href = 'services-management.html';
            } else {
                showError(data.message || 'Failed to update service');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred while updating the service');
        });
    });
});

function populateForm(service) {
    document.getElementById('name').value = service.name || service.title || '';
    document.getElementById('category').value = service.category || '';
    document.getElementById('subcategory').value = service.subcategory || '';
    document.getElementById('price').value = service.price || service.pricing || '';
    document.getElementById('description').value = service.description || '';
    document.getElementById('image_url').value = service.image_url || '';
    document.getElementById('features').value = Array.isArray(service.features) 
        ? service.features.join('\n') 
        : (typeof service.features === 'string' ? JSON.parse(service.features).join('\n') : '');
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