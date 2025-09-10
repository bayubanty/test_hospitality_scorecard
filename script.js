document.addEventListener('DOMContentLoaded', function() {
    let hospitalsData = [];
    let filteredHospitals = [];
    let currentMetric = '';

    // Fetch hospital data
    fetch('hospitals.json')
        .then(response => response.json())
        .then(data => {
            hospitalsData = data.georgiaHospitals;
            filteredHospitals = [...hospitalsData];
            displayHospitals(filteredHospitals);
        })
        .catch(error => {
            console.error('Error loading hospital data:', error);
            // Fallback data in case JSON fails to load
            hospitalsData = getFallbackData();
            filteredHospitals = [...hospitalsData];
            displayHospitals(filteredHospitals);
        });

    // Add click event to metrics
    const metrics = document.querySelectorAll('.metrics-list li');
    metrics.forEach(metric => {
        metric.addEventListener('click', function() {
            const metricType = this.getAttribute('data-metric');
            
            // Toggle active class
            metrics.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Sort by selected metric
            sortHospitalsByMetric(metricType);
            currentMetric = metricType;
        });
    });
    
    // Add click event to details buttons (using event delegation)
    document.getElementById('hospitalResults').addEventListener('click', function(e) {
        if (e.target.classList.contains('details-button')) {
            const hospitalId = e.target.getAttribute('data-id');
            const hospital = hospitalsData.find(h => h.id == hospitalId);
            showHospitalDetails(hospital);
        }
    });
    
    // Search button functionality
    document.getElementById('searchBtn').addEventListener('click', function() {
        filterHospitals();
    });
    
    // Download button functionality
    document.getElementById('downloadBtn').addEventListener('click', function() {
        downloadResults();
    });
    
    // Enter key functionality for search inputs
    document.getElementById('hospitalName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterHospitals();
        }
    });
    
    document.getElementById('zipCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterHospitals();
        }
    });

    function displayHospitals(hospitals) {
        const resultsContainer = document.getElementById('hospitalResults');
        const resultsCount = document.getElementById('resultsCount');
        
        resultsCount.textContent = `Viewing ${hospitals.length} results`;
        
        let html = '';
        hospitals.forEach((hospital, index) => {
            html += `
                <tr>
                    <td>${index + 1} ${hospital.rank}</td>
                    <td>Beds #: ${hospital.beds}<br>Critical Access: ${hospital.criticalAccess}<br>System: ${hospital.system}<br>County: ${hospital.county}</td>
                    <td>${hospital.name}<br>${hospital.address}</td>
                    <td><button class="details-button" data-id="${hospital.id}">Details</button></td>
                </tr>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }
    
    function filterHospitals() {
        const nameFilter = document.getElementById('hospitalName').value.toLowerCase();
        const zipFilter = document.getElementById('zipCode').value;
        const typeFilter = document.getElementById('hospitalType').value;
        
        filteredHospitals = hospitalsData.filter(hospital => {
            const nameMatch = hospital.name.toLowerCase().includes(nameFilter);
            const zipMatch = !zipFilter || hospital.address.includes(zipFilter);
            const typeMatch = !typeFilter || 
                (typeFilter === 'rural' && hospital.criticalAccess === 'Yes') ||
                (typeFilter === 'urban' && hospital.criticalAccess === 'No');
            
            return nameMatch && zipMatch && typeMatch;
        });
        
        // Reapply metric sorting if one is selected
        if (currentMetric) {
            sortHospitalsByMetric(currentMetric);
        } else {
            displayHospitals(filteredHospitals);
        }
    }
    
    function sortHospitalsByMetric(metric) {
        filteredHospitals.sort((a, b) => {
            return b.metrics[metric] - a.metrics[metric];
        });
        
        displayHospitals(filteredHospitals);
    }
    
    function showHospitalDetails(hospital) {
        alert(`Hospital Details:\nName: ${hospital.name}\nAddress: ${hospital.address}\nBeds: ${hospital.beds}\nCounty: ${hospital.county}\nType: ${hospital.type}`);
    }
    
    function downloadResults() {
        alert('Download functionality would be implemented here. This would typically generate a CSV or PDF file.');
    }
    
    function getFallbackData() {
        return [
            {
                "id": 1,
                "rank": "A",
                "name": "Auckland Memorial Hospital",
                "address": "Gordon Ave, Therrasville, GA 31792",
                "beds": 250,
                "criticalAccess": "Yes/No",
                "system": "",
                "county": "Thomas",
                "type": "Nonprofit",
                "metrics": {
                    "birth": 4.2,
                    "mars": 3.8,
                    "witchers": 4.5,
                    "financialTransparency": 3.9,
                    "healthcareAffordability": 4.1,
                    "accessAndResponsibility": 4.3
                }
            },
            {
                "id": 2,
                "rank": "B",
                "name": "Northside Hospital",
                "address": "1000 Johnson Ferry Rd, Atlanta, GA 30342",
                "beds": 180,
                "criticalAccess": "No",
                "system": "",
                "county": "Fulton",
                "type": "Nonprofit",
                "metrics": {
                    "birth": 4.5,
                    "mars": 4.2,
                    "witchers": 4.1,
                    "financialTransparency": 4.4,
                    "healthcareAffordability": 4.0,
                    "accessAndResponsibility": 4.6
                }
            },
            {
                "id": 3,
                "rank": "C",
                "name": "Memorial Health University Medical Center",
                "address": "4700 Waters Ave, Savannah, GA 31404",
                "beds": 350,
                "criticalAccess": "No",
                "system": "",
                "county": "Chatham",
                "type": "Nonprofit",
                "metrics": {
                    "birth": 3.9,
                    "mars": 4.0,
                    "witchers": 4.2,
                    "financialTransparency": 4.1,
                    "healthcareAffordability": 3.8,
                    "accessAndResponsibility": 4.4
                }
            },
            {
                "id": 4,
                "rank": "D",
                "name": "Coffee Regional Medical Center",
                "address": "1101 Ocilla Rd, Douglas, GA 31533",
                "beds": 120,
                "criticalAccess": "Yes",
                "system": "",
                "county": "Coffee",
                "type": "Nonprofit",
                "metrics": {
                    "birth": 4.0,
                    "mars": 3.7,
                    "witchers": 4.0,
                    "financialTransparency": 3.8,
                    "healthcareAffordability": 4.2,
                    "accessAndResponsibility": 4.1
                }
            },
            {
                "id": 5,
                "rank": "E",
                "name": "Early Memorial Hospital",
                "address": "11745 Columbia St, Blakely, GA 39823",
                "beds": 95,
                "criticalAccess": "Yes",
                "system": "",
                "county": "Early",
                "type": "Nonprofit",
                "metrics": {
                    "birth": 3.8,
                    "mars": 3.9,
                    "witchers": 3.7,
                    "financialTransparency": 3.6,
                    "healthcareAffordability": 4.3,
                    "accessAndResponsibility": 3.9
                }
            }
        ];
    }
});
