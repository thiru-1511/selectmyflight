// Duffel Global NDC & GDS Airline Service
// Connects to 300+ Airlines (Emirates, Qatar, Air India, British Airways, etc.)

const DUFFEL_TOKEN = import.meta.env?.VITE_DUFFEL_TOKEN || '';

// Exchange rates to INR for uniform cart & checkout
const RATES_TO_INR = {
  USD: 86.5,
  EUR: 93.8,
  GBP: 111.2,
  AED: 23.5,
  INR: 1.0
};

// Helper: Parse ISO 8601 duration (e.g., 'PT7H58M') to minutes
function parseDurationToMinutes(durationStr) {
  if (!durationStr) return 150;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 150;
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const mins = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + mins;
}

// Helper: Format ISO date string to HH:mm
function formatIsoTime(isoString) {
  if (!isoString) return '10:00';
  try {
    const d = new Date(isoString);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  } catch {
    return '10:00';
  }
}

export const duffelService = {
  /**
   * Search real-time flights via Duffel Offer Requests API
   * @param {Object} params - { origin, destination, departureDate, cabinClass, adults }
   */
  async searchFlights({ origin, destination, departureDate, cabinClass = 'economy', adults = 1 }) {
    if (!origin || !destination) return [];

    // Ensure departure date is in the future
    let depDate = departureDate;
    if (!depDate || new Date(depDate) < new Date()) {
      const future = new Date();
      future.setDate(future.getDate() + 14); // 2 weeks out by default
      depDate = future.toISOString().split('T')[0];
    }

    // Map cabin class to Duffel standard
    const cabinMap = {
      Economy: 'economy',
      'Premium Economy': 'premium_economy',
      Business: 'business',
      First: 'first',
      All: 'economy'
    };
    const mappedCabin = cabinMap[cabinClass] || 'economy';

    const payload = {
      data: {
        slices: [
          {
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departure_date: depDate
          }
        ],
        passengers: Array.from({ length: Math.max(1, adults) }, () => ({ type: 'adult' })),
        cabin_class: mappedCabin
      }
    };

    try {
      // In Vite dev, call the configured dev proxy to bypass CORS cleanly.
      // If deployed or in backend proxy, fallback to direct Duffel endpoint
      const url = '/duffel-api/air/offer_requests?return_offers=true';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DUFFEL_TOKEN}`,
          'Duffel-Version': 'v2',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn('Duffel API returned status:', response.status);
        return [];
      }

      const json = await response.json();
      const offers = json?.data?.offers || [];

      // Map Duffel offers to SelectMyFlight flight card schema
      return offers.map((offer, idx) => {
        const slice = offer.slices?.[0] || {};
        const segments = slice.segments || [];
        const firstSegment = segments[0] || {};
        const lastSegment = segments[segments.length - 1] || firstSegment;

        const owner = offer.owner || {};
        const operatingCarrier = firstSegment.operating_carrier || owner;
        const carrierCode = operatingCarrier.iata_code || owner.iata_code || 'SM';
        const flightNum = firstSegment.operating_carrier_flight_number || (100 + idx);

        const durationMinutes = parseDurationToMinutes(slice.duration);
        const depTime = formatIsoTime(firstSegment.departing_at);
        const arrTime = formatIsoTime(lastSegment.arriving_at);

        // Calculate INR price from raw currency
        const rawAmount = parseFloat(offer.total_amount) || 250;
        const currency = offer.total_currency || 'USD';
        const rate = RATES_TO_INR[currency] || 86.5;
        const inrPrice = Math.round(rawAmount * rate);

        // Baggage rules
        const baggageList = firstSegment.passengers?.[0]?.baggages || [];
        const checkedBags = baggageList.find(b => b.type === 'checked');
        const checkedWeight = checkedBags?.quantity ? checkedBags.quantity * 23 : 20;

        return {
          id: offer.id,
          duffelOfferId: offer.id,
          isLiveDuffel: true,
          flightNumber: `${carrierCode}-${flightNum}`,
          airlineName: owner.name || 'International Airline',
          airlineCode: carrierCode,
          airlineLogo: owner.logo_symbol_url || owner.logo_lockup_url || null,
          originCode: firstSegment.origin?.iata_code || origin.toUpperCase(),
          destinationCode: lastSegment.destination?.iata_code || destination.toUpperCase(),
          departureTime: depTime,
          arrivalTime: arrTime,
          durationMinutes: durationMinutes,
          stops: Math.max(0, segments.length - 1),
          basePrice: inrPrice,
          originalAmount: rawAmount,
          originalCurrency: currency,
          cabinClass: cabinClass === 'All' ? 'Economy' : cabinClass,
          cabinBaggageKg: 7,
          checkedBaggageKg: checkedWeight,
          refundable: true,
          cancellationFee: Math.round(inrPrice * 0.15),
          changeFee: Math.round(inrPrice * 0.08),
          aircraftModel: firstSegment.aircraft?.name || 'Boeing 777 / Airbus A350',
          airlineColor: '#0052cc',
          conditionsOfCarriageUrl: owner.conditions_of_carriage_url || null
        };
      });
    } catch (err) {
      console.warn('Duffel API live search skipped (using standard catalog):', err.message);
      return [];
    }
  }
};
