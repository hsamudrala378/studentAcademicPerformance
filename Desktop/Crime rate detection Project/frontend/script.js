const API_URL = 'http://127.0.0.1:5000';

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const predictBtn = document.getElementById('predictBtn');
    const spinner = document.getElementById('spinner');
    const resultContainer = document.getElementById('resultContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous results and errors
    resultContainer.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading state
    predictBtn.disabled = true;
    spinner.style.display = 'block';
    predictBtn.querySelector('span').textContent = 'Predicting...';
    
    // Get form data
    const formData = {
        city: document.getElementById('city').value,
        area_type: document.getElementById('areaType').value,
        population_density: parseInt(document.getElementById('populationDensity').value),
        time_of_day: document.getElementById('timeOfDay').value,
        month: parseInt(document.getElementById('month').value),
        day_of_week: parseInt(document.getElementById('dayOfWeek').value)
    };
    
    try {
        console.log('Sending request to:', `${API_URL}/predict`);
        console.log('Request data:', formData);
        
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
            mode: 'cors'
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Get response text first
        const responseText = await response.text();
        console.log('Response text:', responseText.substring(0, 200));
        
        // Check if response is OK
        if (!response.ok) {
            // Try to parse as JSON
            try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.error || `Server error: ${response.status}`);
            } catch (e) {
                throw new Error(`Server error: ${response.status} - ${responseText.substring(0, 100)}`);
            }
        }
        
        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
        
        if (data.success) {
            // Display results
            displayResults(data);
            resultContainer.style.display = 'block';
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = `Error: ${error.message}. Make sure the backend server is running on ${API_URL}`;
        errorMessage.style.display = 'block';
    } finally {
        // Reset button state
        predictBtn.disabled = false;
        spinner.style.display = 'none';
        predictBtn.querySelector('span').textContent = 'Predict Crime Rate';
    }
});

function displayResults(data) {
    // Update city name
    document.getElementById('resultCity').textContent = data.city || 'Selected Area';
    
    // Update crime rate
    document.getElementById('crimeRate').textContent = data.crime_rate.toFixed(2);
    
    // Update risk badge
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.textContent = data.risk_level;
    riskBadge.style.backgroundColor = data.risk_color;
    
    // Update crime rate color based on risk
    const rateValue = document.getElementById('crimeRate');
    rateValue.style.color = data.risk_color;
    
    // Display factors
    const factorsGrid = document.getElementById('factorsGrid');
    factorsGrid.innerHTML = '';
    
    const factorLabels = {
        'area_type_impact': 'Area Type Impact',
        'population_impact': 'Population Impact',
        'time_impact': 'Time Impact',
        'seasonal_impact': 'Seasonal Impact',
        'weekend_impact': 'Weekend Impact'
    };
    
    for (const [key, value] of Object.entries(data.factors)) {
        const factorItem = document.createElement('div');
        factorItem.className = 'factor-item';
        
        const label = document.createElement('div');
        label.className = 'factor-label';
        label.textContent = factorLabels[key] || key;
        
        const val = document.createElement('div');
        val.className = 'factor-value';
        val.textContent = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
        val.style.color = value > 0 ? '#c62828' : '#2e7d32';
        
        factorItem.appendChild(label);
        factorItem.appendChild(val);
        factorsGrid.appendChild(factorItem);
    }
}

// Add some helpful interactions
document.getElementById('areaType').addEventListener('change', (e) => {
    const areaType = e.target.value;
    const densityInput = document.getElementById('populationDensity');
    
    // Suggest population density based on area type
    switch(areaType) {
        case 'urban':
            densityInput.value = 8000;
            break;
        case 'suburban':
            densityInput.value = 3000;
            break;
        case 'rural':
            densityInput.value = 500;
            break;
    }
});

// Check if backend is available on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            console.log('Backend server is running');
        }
    } catch (error) {
        console.warn('Backend server not reachable. Make sure it\'s running on port 5000.');
    }
});

