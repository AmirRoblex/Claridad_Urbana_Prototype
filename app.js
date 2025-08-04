document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTICATION CHECK ---
    if (localStorage.getItem('isLoggedIn') !== 'true' && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // --- GLOBAL STATE & VARIABLES ---
    const state = {
        mapYear: '2025',
        visYear: '2025',
        selectedNeighborhood: null,
        visInitialized: false // Flag to track if visualizations have been rendered once
    };

    // Chart and map variables
    let map, geojsonLayer, legend;
    let rentChart, airbnbChart, scatterChart, heatmap;
    const { jsPDF } = window.jspdf;

    // --- INITIALIZATION ---
    function initializeApp() {
        initMap();
        initEventListeners();
        populateDropdowns();
        displayStories();
        updateDashboard(state.mapYear);
    }

    // --- MAP FUNCTIONS ---
    function initMap() {
        map = L.map('map').setView([19.35, -99.1332], 10); // Zoom out to see all of CDMX
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">'
        }).addTo(map);

        legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            updateLegend();
            return div;
        };
        legend.addTo(map);
    }
    
    function getRiskColor(risk) {
        return risk > 0.9 ? '#d73027' : risk > 0.7 ? '#fc8d59' : risk > 0.5 ? '#fee08b' : risk > 0.3 ? '#d9ef8b' : '#91cf60';
    }

    function styleGeoJSON(feature) {
        const risk = feature.properties.stats[state.mapYear].displacement_risk;
        return { fillColor: getRiskColor(risk), weight: 2, opacity: 1, color: 'white', dashArray: '3', fillOpacity: 0.7 };
    }

    function updateMap() {
        if (geojsonLayer) map.removeLayer(geojsonLayer);
        geojsonLayer = L.geoJson(neighborhoods, {
            style: styleGeoJSON,
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: e => {
                        const l = e.target;
                        l.setStyle({ weight: 5, color: '#666', dashArray: '' });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) l.bringToFront();
                    },
                    mouseout: () => geojsonLayer.resetStyle(layer),
                    click: e => {
                        state.selectedNeighborhood = e.target.feature.properties.name;
                        // If visualizations are visible, update the line chart
                        if (state.visInitialized) {
                           renderAirbnbChart(state.selectedNeighborhood);
                        }
                        map.fitBounds(e.target.getBounds());
                    }
                });
                const stats = feature.properties.stats[state.mapYear];
                layer.bindPopup(`<b>${feature.properties.name} (${state.mapYear})</b><br/>Avg. Rent: $${stats.avg_rent_mxn.toLocaleString()} MXN<br/>Airbnb Listings: ${stats.airbnb_listings.toLocaleString()}<br/>Displacement Risk: ${(stats.displacement_risk * 100).toFixed(0)}%`);
            }
        }).addTo(map);
        updateLegend();
    }

    function updateLegend() {
        const grades = [0, 0.3, 0.5, 0.7, 0.9];
        const div = document.querySelector('.legend');
        if (!div) return;
        let content = '<h4>Displacement Risk</h4>';
        for (let i = 0; i < grades.length; i++) {
            content += `<i style="background:${getRiskColor(grades[i] + 0.1)}"></i> ${(grades[i] * 100)}${grades[i + 1] ? '&ndash;' + (grades[i + 1] * 100) + '%<br>' : '%+'}`;
        }
        div.innerHTML = content;
    }

    // --- NEW VISUALIZATION RENDERING LOGIC ---
    /**
     * Destroys all chart and map instances to allow for clean re-initialization.
     * This is the key to fixing the resizing issue.
     */
    function destroyVisualizations() {
        if (rentChart) rentChart.destroy();
        if (airbnbChart) airbnbChart.destroy();
        if (scatterChart) scatterChart.destroy();
        if (heatmap) {
            heatmap.remove(); // Leaflet maps have a .remove() method
            heatmap = null;
        }
    }

    /**
     * Renders all visualizations for a given year.
     * It first destroys any existing instances to ensure they are created
     * with the correct dimensions in a visible container.
     * @param {string} year The year to render data for.
     */
    function renderVisualizations(year) {
        destroyVisualizations(); // Destroy previous instances

        state.visYear = year;
        document.querySelectorAll('.dynamic-year').forEach(el => el.textContent = year);
        
        // Re-create all charts and the heatmap
        renderRentChart(year);
        renderAirbnbChart(state.selectedNeighborhood);
        renderScatterPlot(year);
        renderHeatmap(year);
        updateStatsTable(year);

        state.visInitialized = true;
    }

    function renderRentChart(year) {
        const defaultOptions = { responsive: true, maintainAspectRatio: false };
        rentChart = new Chart(document.getElementById('rent-chart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: neighborhoods.features.map(f => f.properties.name),
                datasets: [{
                    data: neighborhoods.features.map(f => f.properties.stats[year].avg_rent_mxn),
                    backgroundColor: 'rgba(0, 90, 156, 0.7)'
                }]
            },
            options: { ...defaultOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    function renderAirbnbChart(neighborhoodName = null) {
        let datasets;
        if (neighborhoodName) {
            const feature = neighborhoods.features.find(f => f.properties.name === neighborhoodName);
            datasets = [{ label: `Listings in ${neighborhoodName}`, data: Object.keys(feature.properties.stats).map(y => feature.properties.stats[y].airbnb_listings), borderColor: '#e31b23', tension: 0.1 }];
        } else {
            const avgData = ['2022', '2023', '2024', '2025'].map(y => neighborhoods.features.reduce((s, f) => s + f.properties.stats[y].airbnb_listings, 0) / neighborhoods.features.length);
            datasets = [{ label: `City-wide Average Listings`, data: avgData, borderColor: '#005a9c', tension: 0.1 }];
        }
        if (airbnbChart) airbnbChart.destroy();
        airbnbChart = new Chart(document.getElementById('airbnb-chart').getContext('2d'), {
            type: 'line',
            data: { labels: ['2022', '2023', '2024', '2025'], datasets: datasets },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }
    
    function renderScatterPlot(year) {
        const defaultOptions = { responsive: true, maintainAspectRatio: false };
        const scatterData = neighborhoods.features.map(f => ({
            x: f.properties.stats[year].airbnb_listings,
            y: f.properties.stats[year].avg_rent_mxn,
            label: f.properties.name
        }));
        scatterChart = new Chart(document.getElementById('scatter-chart').getContext('2d'), {
            type: 'scatter',
            data: { datasets: [{ data: scatterData, backgroundColor: '#e31b23' }] },
            options: { ...defaultOptions, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw.label}: (${c.raw.x}, ${c.raw.y.toLocaleString()})` } } }, scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Airbnb Listings' } }, y: { title: { display: true, text: 'Average Rent (MXN)' } } } }
        });
    }
    
    function renderHeatmap(year) {
        const heatPoints = [];
        neighborhoods.features.forEach(f => {
            const stats = f.properties.stats[year];
            const risk = stats.displacement_risk;
            // Get center of polygon
            const center = L.geoJson(f).getBounds().getCenter();
            heatPoints.push([center.lat, center.lng, risk]);
        });

        heatmap = L.map('heatmap-vis').setView([19.35, -99.1332], 10);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">'
        }).addTo(heatmap);

        L.heatLayer(heatPoints, { radius: 25, blur: 40, maxZoom: 12, max: 1.0 }).addTo(heatmap);
    }

    function updateStatsTable(year) {
        const container = document.getElementById('stats-table-container');
        const headers = ['Alcaldía', 'Avg Rent (MXN)', 'Airbnb Listings', 'Displacement Risk', 'Eviction Notices'];
        let tableHTML = '<table class="stats-table"><thead><tr>';
        headers.forEach(h => tableHTML += `<th>${h}</th>`);
        tableHTML += '</tr></thead><tbody>';
        neighborhoods.features.forEach(f => {
            const stats = f.properties.stats[year];
            tableHTML += `<tr>
                <td>${f.properties.name}</td>
                <td>$${stats.avg_rent_mxn.toLocaleString()}</td>
                <td>${stats.airbnb_listings.toLocaleString()}</td>
                <td>${(stats.displacement_risk * 100).toFixed(0)}%</td>
                <td>${stats.eviction_notices}</td>
            </tr>`;
        });
        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    // --- UI & EVENT LISTENERS ---
    function initEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(sectionId).classList.add('active');
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                if (sectionId === 'dashboard') {
                    setTimeout(() => map.invalidateSize(), 10);
                } else if (sectionId === 'visualizations') {
                    // Render visualizations only when tab is clicked.
                    renderVisualizations(state.visYear);
                }
            });
        });
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
        document.getElementById('year-slider').addEventListener('input', e => {
            state.mapYear = e.target.value;
            document.getElementById('year-label').textContent = state.mapYear;
            updateDashboard(state.mapYear);
        });
        document.getElementById('vis-year-select').addEventListener('change', e => renderVisualizations(e.target.value));
        document.getElementById('story-form').addEventListener('submit', handleStorySubmit);
        document.getElementById('generate-pdf-btn').addEventListener('click', generatePDF);
    }
    
    function populateDropdowns() {
        const names = neighborhoods.features.map(f => f.properties.name);
        const reportSelect = document.getElementById('report-neighborhood');
        const storySelect = document.getElementById('story-neighborhood');
        reportSelect.innerHTML = ''; // Clear existing
        storySelect.innerHTML = ''; // Clear existing
        names.forEach(name => {
            reportSelect.innerHTML += `<option value="${name}">${name}</option>`;
            storySelect.innerHTML += `<option value="${name}">${name}</option>`;
        });
    }

    // --- DATA HANDLING & UPDATES ---
    function updateDashboard(year) {
        state.mapYear = year;
        updateMap();
    }

    function displayStories() {
        const list = document.getElementById('story-list');
        list.innerHTML = '';
        communityStories.forEach(story => addStoryToDOM(story));
    }

    function addStoryToDOM(story) {
        const list = document.getElementById('story-list');
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `<p class="story-text">"${story.story}"</p><p class="story-meta"><strong>- ${story.author}</strong>, from ${story.neighborhood}</p>`;
        list.prepend(card);
    }

    function handleStorySubmit(e) {
        e.preventDefault();
        const newStory = { author: document.getElementById('story-name').value, neighborhood: document.getElementById('story-neighborhood').value, story: document.getElementById('story-text').value };
        communityStories.push(newStory);
        addStoryToDOM(newStory);
        e.target.reset();
    }

    // --- PDF GENERATION ---
    function generatePDF() {
        const doc = new jsPDF();
        const selectedHoods = Array.from(document.getElementById('report-neighborhood').selectedOptions).map(opt => opt.value);
        const selectedYears = Array.from(document.querySelectorAll('input[name="report-year"]:checked')).map(cb => cb.value);
        const selectedData = Array.from(document.querySelectorAll('input[name="report-data"]:checked')).map(cb => cb.value);
        
        if (selectedHoods.length === 0 || selectedYears.length === 0 || selectedData.length === 0) {
            alert("Please select at least one alcaldía, year, and data point for the report.");
            return;
        }

        doc.setFontSize(22);
        doc.text("Claridad Urbana Housing Report", 14, 22);
        
        const headerMap = { avg_rent_mxn: 'Avg Rent', airbnb_listings: 'Airbnbs', displacement_risk: 'Risk', eviction_notices: 'Evictions' };
        const headers = ['Alcaldía', 'Year', ...selectedData.map(d => headerMap[d] || d)];
        
        const body = [];
        selectedYears.forEach(year => {
            neighborhoods.features
                .filter(f => selectedHoods.includes(f.properties.name))
                .forEach(f => {
                    const row = [f.properties.name, year];
                    const stats = f.properties.stats[year];
                    selectedData.forEach(key => {
                        let val = stats[key];
                        if (key === 'displacement_risk') val = `${(val * 100).toFixed(0)}%`;
                        else if (key === 'avg_rent_mxn') val = `$${val.toLocaleString()}`;
                        else val = val ? val.toLocaleString() : 'N/A';
                        row.push(val);
                    });
                    body.push(row);
                });
        });
        
        doc.autoTable({ startY: 30, head: [headers], body: body });
        doc.save(`Claridad_Urbana_Report.pdf`);
    }

    // --- START THE APP ---
    if (document.getElementById('dashboard')) {
        initializeApp();
    }
});
