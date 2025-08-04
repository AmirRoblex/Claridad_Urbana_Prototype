// Mock user credentials for login
const userCredentials = {
    email: 'ana.martinez@community.org',
    password: 'password123'
};

// Mock community stories
const communityStories = [
    {
        author: 'Carlos G.',
        neighborhood: 'Cuauhtémoc',
        story: 'My family has lived in Doctores for three generations. The rent used to be affordable, but now landlords are doubling prices to attract tourists. We are being pushed out of our own community.'
    },
    {
        author: 'Elena R.',
        neighborhood: 'Cuauhtémoc',
        story: 'Condesa is beautiful, but it feels like a hotel now, not a neighborhood. Every other building is an Airbnb. The noise is constant, and local shops are being replaced by expensive cafes.'
    },
    {
        author: 'Juan P.',
        neighborhood: 'Iztapalapa',
        story: 'We need more investment in public services here, not just in the central areas. Our rents are lower, but our infrastructure is crumbling.'
    }
];

// Mock GeoJSON data for all 16 alcaldías of Mexico City.
// IMPORTANT: This is a simplified representation with synthetic data for prototyping.
const neighborhoods = {
    "type": "FeatureCollection",
    "features": [
        // NOTE: The coordinates are simplified bounding boxes for this prototype.
        // In a real application, these would be complex, accurate polygons.
        {
            "type": "Feature", "properties": { "name": "Álvaro Obregón", "stats": {
                "2022": { "airbnb_listings": 300, "avg_rent_mxn": 14000, "displacement_risk": 0.5, "eviction_notices": 40 },
                "2023": { "airbnb_listings": 450, "avg_rent_mxn": 15500, "displacement_risk": 0.55, "eviction_notices": 55 },
                "2024": { "airbnb_listings": 600, "avg_rent_mxn": 17000, "displacement_risk": 0.6, "eviction_notices": 70 },
                "2025": { "airbnb_listings": 750, "avg_rent_mxn": 18500, "displacement_risk": 0.65, "eviction_notices": 90 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.27, 19.38], [-99.19, 19.38], [-99.19, 19.31], [-99.27, 19.31], [-99.27, 19.38]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Azcapotzalco", "stats": {
                "2022": { "airbnb_listings": 100, "avg_rent_mxn": 9000, "displacement_risk": 0.3, "eviction_notices": 20 },
                "2023": { "airbnb_listings": 150, "avg_rent_mxn": 9500, "displacement_risk": 0.35, "eviction_notices": 25 },
                "2024": { "airbnb_listings": 200, "avg_rent_mxn": 10000, "displacement_risk": 0.4, "eviction_notices": 35 },
                "2025": { "airbnb_listings": 250, "avg_rent_mxn": 11000, "displacement_risk": 0.45, "eviction_notices": 45 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.20, 19.50], [-99.15, 19.50], [-99.15, 19.46], [-99.20, 19.46], [-99.20, 19.50]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Benito Juárez", "stats": {
                "2022": { "airbnb_listings": 1500, "avg_rent_mxn": 18000, "displacement_risk": 0.8, "eviction_notices": 90 },
                "2023": { "airbnb_listings": 1900, "avg_rent_mxn": 20000, "displacement_risk": 0.85, "eviction_notices": 110 },
                "2024": { "airbnb_listings": 2300, "avg_rent_mxn": 22000, "displacement_risk": 0.9, "eviction_notices": 130 },
                "2025": { "airbnb_listings": 2700, "avg_rent_mxn": 24000, "displacement_risk": 0.95, "eviction_notices": 150 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.18, 19.40], [-99.14, 19.40], [-99.14, 19.36], [-99.18, 19.36], [-99.18, 19.40]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Coyoacán", "stats": {
                "2022": { "airbnb_listings": 800, "avg_rent_mxn": 16000, "displacement_risk": 0.7, "eviction_notices": 60 },
                "2023": { "airbnb_listings": 1000, "avg_rent_mxn": 17500, "displacement_risk": 0.75, "eviction_notices": 75 },
                "2024": { "airbnb_listings": 1200, "avg_rent_mxn": 19000, "displacement_risk": 0.8, "eviction_notices": 90 },
                "2025": { "airbnb_listings": 1400, "avg_rent_mxn": 21000, "displacement_risk": 0.85, "eviction_notices": 110 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.18, 19.35], [-99.13, 19.35], [-99.13, 19.30], [-99.18, 19.30], [-99.18, 19.35]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Cuajimalpa", "stats": {
                "2022": { "airbnb_listings": 400, "avg_rent_mxn": 22000, "displacement_risk": 0.6, "eviction_notices": 30 },
                "2023": { "airbnb_listings": 550, "avg_rent_mxn": 24000, "displacement_risk": 0.65, "eviction_notices": 40 },
                "2024": { "airbnb_listings": 700, "avg_rent_mxn": 26000, "displacement_risk": 0.7, "eviction_notices": 50 },
                "2025": { "airbnb_listings": 900, "avg_rent_mxn": 28000, "displacement_risk": 0.75, "eviction_notices": 65 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.30, 19.39], [-99.24, 19.39], [-99.24, 19.33], [-99.30, 19.33], [-99.30, 19.39]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Cuauhtémoc", "stats": {
                "2022": { "airbnb_listings": 2500, "avg_rent_mxn": 20000, "displacement_risk": 0.9, "eviction_notices": 120 },
                "2023": { "airbnb_listings": 3200, "avg_rent_mxn": 24000, "displacement_risk": 0.95, "eviction_notices": 150 },
                "2024": { "airbnb_listings": 4000, "avg_rent_mxn": 28000, "displacement_risk": 0.98, "eviction_notices": 180 },
                "2025": { "airbnb_listings": 5000, "avg_rent_mxn": 32000, "displacement_risk": 1.0, "eviction_notices": 220 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.18, 19.45], [-99.12, 19.45], [-99.12, 19.40], [-99.18, 19.40], [-99.18, 19.45]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Gustavo A. Madero", "stats": {
                "2022": { "airbnb_listings": 150, "avg_rent_mxn": 8000, "displacement_risk": 0.25, "eviction_notices": 30 },
                "2023": { "airbnb_listings": 200, "avg_rent_mxn": 8500, "displacement_risk": 0.3, "eviction_notices": 40 },
                "2024": { "airbnb_listings": 280, "avg_rent_mxn": 9200, "displacement_risk": 0.35, "eviction_notices": 50 },
                "2025": { "airbnb_listings": 350, "avg_rent_mxn": 10000, "displacement_risk": 0.4, "eviction_notices": 60 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.15, 19.55], [-99.05, 19.55], [-99.05, 19.47], [-99.15, 19.47], [-99.15, 19.55]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Iztacalco", "stats": {
                "2022": { "airbnb_listings": 80, "avg_rent_mxn": 8500, "displacement_risk": 0.3, "eviction_notices": 25 },
                "2023": { "airbnb_listings": 120, "avg_rent_mxn": 9000, "displacement_risk": 0.35, "eviction_notices": 35 },
                "2024": { "airbnb_listings": 180, "avg_rent_mxn": 9800, "displacement_risk": 0.4, "eviction_notices": 45 },
                "2025": { "airbnb_listings": 250, "avg_rent_mxn": 10500, "displacement_risk": 0.45, "eviction_notices": 55 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.12, 19.40], [-99.08, 19.40], [-99.08, 19.37], [-99.12, 19.37], [-99.12, 19.40]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Iztapalapa", "stats": {
                "2022": { "airbnb_listings": 50, "avg_rent_mxn": 6000, "displacement_risk": 0.2, "eviction_notices": 40 },
                "2023": { "airbnb_listings": 80, "avg_rent_mxn": 6500, "displacement_risk": 0.25, "eviction_notices": 50 },
                "2024": { "airbnb_listings": 120, "avg_rent_mxn": 7000, "displacement_risk": 0.3, "eviction_notices": 65 },
                "2025": { "airbnb_listings": 200, "avg_rent_mxn": 8000, "displacement_risk": 0.35, "eviction_notices": 80 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.09, 19.36], [-99.00, 19.36], [-99.00, 19.30], [-99.09, 19.30], [-99.09, 19.36]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Magdalena Contreras", "stats": {
                "2022": { "airbnb_listings": 90, "avg_rent_mxn": 11000, "displacement_risk": 0.4, "eviction_notices": 15 },
                "2023": { "airbnb_listings": 130, "avg_rent_mxn": 12000, "displacement_risk": 0.45, "eviction_notices": 20 },
                "2024": { "airbnb_listings": 180, "avg_rent_mxn": 13000, "displacement_risk": 0.5, "eviction_notices": 30 },
                "2025": { "airbnb_listings": 240, "avg_rent_mxn": 14000, "displacement_risk": 0.55, "eviction_notices": 40 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.26, 19.33], [-99.20, 19.33], [-99.20, 19.28], [-99.26, 19.28], [-99.26, 19.33]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Miguel Hidalgo", "stats": {
                "2022": { "airbnb_listings": 2000, "avg_rent_mxn": 25000, "displacement_risk": 0.85, "eviction_notices": 100 },
                "2023": { "airbnb_listings": 2500, "avg_rent_mxn": 28000, "displacement_risk": 0.9, "eviction_notices": 120 },
                "2024": { "airbnb_listings": 3000, "avg_rent_mxn": 32000, "displacement_risk": 0.95, "eviction_notices": 140 },
                "2025": { "airbnb_listings": 3500, "avg_rent_mxn": 36000, "displacement_risk": 0.98, "eviction_notices": 170 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.24, 19.46], [-99.18, 19.46], [-99.18, 19.41], [-99.24, 19.41], [-99.24, 19.46]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Milpa Alta", "stats": {
                "2022": { "airbnb_listings": 10, "avg_rent_mxn": 4000, "displacement_risk": 0.1, "eviction_notices": 5 },
                "2023": { "airbnb_listings": 15, "avg_rent_mxn": 4200, "displacement_risk": 0.1, "eviction_notices": 8 },
                "2024": { "airbnb_listings": 25, "avg_rent_mxn": 4500, "displacement_risk": 0.15, "eviction_notices": 12 },
                "2025": { "airbnb_listings": 40, "avg_rent_mxn": 5000, "displacement_risk": 0.2, "eviction_notices": 18 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.10, 19.22], [-98.98, 19.22], [-98.98, 19.12], [-99.10, 19.12], [-99.10, 19.22]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Tláhuac", "stats": {
                "2022": { "airbnb_listings": 20, "avg_rent_mxn": 5000, "displacement_risk": 0.15, "eviction_notices": 10 },
                "2023": { "airbnb_listings": 30, "avg_rent_mxn": 5500, "displacement_risk": 0.2, "eviction_notices": 15 },
                "2024": { "airbnb_listings": 50, "avg_rent_mxn": 6000, "displacement_risk": 0.25, "eviction_notices": 20 },
                "2025": { "airbnb_listings": 80, "avg_rent_mxn": 6500, "displacement_risk": 0.3, "eviction_notices": 30 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.05, 19.30], [-98.95, 19.30], [-98.95, 19.24], [-99.05, 19.24], [-99.05, 19.30]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Tlalpan", "stats": {
                "2022": { "airbnb_listings": 250, "avg_rent_mxn": 12000, "displacement_risk": 0.45, "eviction_notices": 35 },
                "2023": { "airbnb_listings": 350, "avg_rent_mxn": 13000, "displacement_risk": 0.5, "eviction_notices": 45 },
                "2024": { "airbnb_listings": 500, "avg_rent_mxn": 14500, "displacement_risk": 0.55, "eviction_notices": 60 },
                "2025": { "airbnb_listings": 650, "avg_rent_mxn": 16000, "displacement_risk": 0.6, "eviction_notices": 75 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.25, 19.30], [-99.13, 19.30], [-99.13, 19.18], [-99.25, 19.18], [-99.25, 19.30]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Venustiano Carranza", "stats": {
                "2022": { "airbnb_listings": 200, "avg_rent_mxn": 9500, "displacement_risk": 0.4, "eviction_notices": 30 },
                "2023": { "airbnb_listings": 300, "avg_rent_mxn": 10500, "displacement_risk": 0.45, "eviction_notices": 40 },
                "2024": { "airbnb_listings": 450, "avg_rent_mxn": 11500, "displacement_risk": 0.5, "eviction_notices": 55 },
                "2025": { "airbnb_listings": 600, "avg_rent_mxn": 12500, "displacement_risk": 0.55, "eviction_notices": 70 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.12, 19.45], [-99.06, 19.45], [-99.06, 19.41], [-99.12, 19.41], [-99.12, 19.45]]] }
        },
        {
            "type": "Feature", "properties": { "name": "Xochimilco", "stats": {
                "2022": { "airbnb_listings": 120, "avg_rent_mxn": 7000, "displacement_risk": 0.2, "eviction_notices": 20 },
                "2023": { "airbnb_listings": 180, "avg_rent_mxn": 7500, "displacement_risk": 0.25, "eviction_notices": 28 },
                "2024": { "airbnb_listings": 250, "avg_rent_mxn": 8200, "displacement_risk": 0.3, "eviction_notices": 38 },
                "2025": { "airbnb_listings": 350, "avg_rent_mxn": 9000, "displacement_risk": 0.35, "eviction_notices": 50 }
            }}, "geometry": { "type": "Polygon", "coordinates": [[[-99.13, 19.28], [-99.02, 19.28], [-99.02, 19.20], [-99.13, 19.20], [-99.13, 19.28]]] }
        }
    ]
};
