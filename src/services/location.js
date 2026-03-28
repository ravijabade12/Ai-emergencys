/**
 * Location services — Geolocation + Hospital search via OpenStreetMap Overpass API.
 * No API keys required.
 */

/**
 * Get user's current position using browser Geolocation API.
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied. Please enable location permissions.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'));
            break;
          default:
            reject(new Error('Failed to get your location.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  });
}

/**
 * Calculate distance between two coordinates using Haversine formula.
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearby hospitals using OpenStreetMap Overpass API.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusMeters - Search radius (default 5000m)
 * @returns {Promise<Array>} Array of hospital objects sorted by distance
 */
export async function findNearbyHospitals(lat, lng, radiusMeters = 5000) {
  // Overpass QL query: find hospitals (nodes and ways) within radius
  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
    );
    out center body;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse results
    const hospitals = data.elements
      .map((el) => {
        // For 'way' elements, use center coordinates
        const hLat = el.lat || el.center?.lat;
        const hLng = el.lon || el.center?.lon;

        if (!hLat || !hLng) return null;

        const name = el.tags?.name || el.tags?.['name:en'] || 'Unnamed Hospital';
        const phone = el.tags?.phone || el.tags?.['contact:phone'] || null;
        const distance = haversineDistance(lat, lng, hLat, hLng);

        return {
          name,
          lat: hLat,
          lng: hLng,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
          phone,
          type: el.tags?.amenity === 'clinic' ? 'Clinic' : 'Hospital',
        };
      })
      .filter(Boolean)
      // Remove duplicates by name
      .filter((h, i, arr) => arr.findIndex((x) => x.name === h.name) === i)
      // Sort by distance
      .sort((a, b) => a.distance - b.distance)
      // Top 3
      .slice(0, 3);

    // If no results in 5km, try 10km
    if (hospitals.length === 0 && radiusMeters < 10000) {
      return findNearbyHospitals(lat, lng, 10000);
    }

    return hospitals;
  } catch (error) {
    console.error('Hospital search error:', error);
    // Return empty array — UI will show fallback
    return [];
  }
}

/**
 * Generate a Google Maps directions URL.
 */
export function getGoogleMapsDirections(toLat, toLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${toLat},${toLng}&travelmode=driving`;
}

/**
 * Generate a Google Maps search link as fallback.
 */
export function getGoogleMapsSearchLink(lat, lng) {
  return `https://www.google.com/maps/search/hospital/@${lat},${lng},14z`;
}

/**
 * Generate a Google Maps link to a specific location.
 */
export function getGoogleMapsLink(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
