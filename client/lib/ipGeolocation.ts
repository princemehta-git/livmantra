/**
 * Utility to detect user's country from IP address
 * Uses a free IP geolocation service
 */

export interface IPGeolocationResponse {
  country_code?: string;
  country?: string;
  country_name?: string;
}

/**
 * Detect user's country code from IP address
 * Falls back to 'US' if detection fails
 */
export async function detectCountryFromIP(): Promise<string> {
  try {
    // Try multiple free IP geolocation services
    const services = [
      "https://ipapi.co/json/",
      "https://ip-api.com/json/?fields=countryCode",
      "https://api.country.is/",
    ];

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) continue;

        const data = await response.json();

        // Different services return different formats
        let countryCode: string | undefined;

        if (data.country_code) {
          countryCode = data.country_code;
        } else if (data.countryCode) {
          countryCode = data.countryCode;
        } else if (data.country) {
          countryCode = data.country;
        }

        if (countryCode && countryCode.length === 2) {
          return countryCode.toUpperCase();
        }
      } catch (error) {
        // Try next service
        continue;
      }
    }

    // Fallback to US if all services fail
    return "US";
  } catch (error) {
    console.debug("Error detecting country from IP:", error);
    return "US";
  }
}
