'use client';

import { useEffect, useState } from 'react';
import { STATES, getCityOptions } from '@/lib/locationData';
import { fetchLocationByPincode } from '@/app/actions/pincode';

interface UsePincodeFetchProps {
  pinCode: string;
  setValue: any;
  setError: any;
  clearErrors: any;
  setCityOptions: (options: { value: string; label: string }[]) => void;
}

// Clean and normalize name for comparison
function cleanName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\band\b/g, '&')
    .replace(/[^a-z0-9&]/g, '')
    .trim();
}

// Capitalize strings to Title Case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Refine fetched location to fix common legacy database inaccuracies in India
function refineFetchedLocation(stateName: string, cityName: string): { stateName: string; cityName: string } {
  let refinedState = stateName;
  const refinedCity = toTitleCase(cityName);

  const cleanCityLower = cityName.toLowerCase();

  // 1. Correct Andhra Pradesh / Telangana legacy mismatch (Telangana was formed in 2014)
  const telanganaKeywords = [
    'hyderabad', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar', 
    'khammam', 'ramagundam', 'nalgonda', 'rangareddy', 'ghatkesar', 
    'medchal', 'cyberabad', 'block hyd', 'hyd'
  ];
  if (stateName.toLowerCase() === 'andhra pradesh') {
    const isTelangana = telanganaKeywords.some(keyword => cleanCityLower.includes(keyword));
    if (isTelangana) {
      refinedState = 'Telangana';
      console.log(`[PincodeFetch] Corrected legacy state from Andhra Pradesh to Telangana for city: ${cityName}`);
    }
  }

  // 2. Correct National Capital Region (NCR) mismatches where Noida/Gurgaon are mapped to Delhi
  const upKeywords = ['noida', 'ghaziabad', 'greater noida'];
  const haryanaKeywords = ['gurgaon', 'gurugram', 'faridabad'];

  if (upKeywords.some(keyword => cleanCityLower.includes(keyword))) {
    refinedState = 'Uttar Pradesh';
    console.log(`[PincodeFetch] Corrected NCR state to Uttar Pradesh for city: ${cityName}`);
  } else if (haryanaKeywords.some(keyword => cleanCityLower.includes(keyword))) {
    refinedState = 'Haryana';
    console.log(`[PincodeFetch] Corrected NCR state to Haryana for city: ${cityName}`);
  }

  return { stateName: refinedState, cityName: refinedCity };
}

// Robust state matching including spelling variations
function matchState(fetchedState: string) {
  const cleanedFetched = cleanName(fetchedState);
  
  // 1. Direct match on cleaned name
  const matched = STATES.find(s => cleanName(s.name) === cleanedFetched);
  if (matched) return matched;

  // 2. Custom variations mapping
  const mappings: Record<string, string> = {
    'pondicherry': 'PY',
    'orissa': 'OD',
    'uttaranchal': 'UK',
    'nctofdelhi': 'DL',
    'nationalcapitalterritoryofdelhi': 'DL',
    'andaman&nicobarislands': 'AN',
    'dadra&nagarhaveli&daman&diu': 'DN',
    'daman&diu': 'DD',
    'dadra&nagarhaveli': 'DN',
  };

  const code = mappings[cleanedFetched];
  if (code) {
    return STATES.find(s => s.code === code);
  }

  // 3. Fallback: substring match
  return STATES.find(s => {
    const cleanedAppName = cleanName(s.name);
    return cleanedAppName.includes(cleanedFetched) || cleanedFetched.includes(cleanedAppName);
  });
}

// Smart city matching to map fetched names to pre-defined app cities
function findBestCityMatch(fetchedCity: string, defaultCities: { value: string; label: string }[]) {
  const cleanedFetched = fetchedCity.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Try to find if any predefined city name is part of the fetched city or vice-versa
  for (const city of defaultCities) {
    const cleanedCity = city.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanedFetched.includes(cleanedCity) || cleanedCity.includes(cleanedFetched)) {
      return city.value;
    }
  }
  return null;
}

export function usePincodeFetch({
  pinCode,
  setValue,
  setError,
  clearErrors,
  setCityOptions,
}: UsePincodeFetchProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!pinCode) {
      setIsLocked(false);
      return;
    }

    const sanitizedPin = pinCode.replace(/\s+/g, '').replace(/[^0-9]/g, '');

    if (sanitizedPin.length === 6 && /^\d{6}$/.test(sanitizedPin)) {
      const fetchLocation = async () => {
        setIsFetching(true);
        clearErrors('pin_code');
        console.log(`[PincodeFetch] Requesting location for PIN ${sanitizedPin} from Server Action...`);

        try {
          const result = await fetchLocationByPincode(sanitizedPin);

          if (result.success && result.state && result.city) {
            // Apply legacy and regional database refinements
            const refined = refineFetchedLocation(result.state, result.city);

            const matchedStateObj = matchState(refined.stateName);

            if (matchedStateObj) {
              const defaultCities = getCityOptions(matchedStateObj.code);
              
              // Try to find best match among seed cities, or fallback to the fetched name
              const bestMatchedCity = findBestCityMatch(refined.cityName, defaultCities) || refined.cityName;
              
              const hasCity = defaultCities.some(
                c => c.value.toLowerCase() === bestMatchedCity.toLowerCase()
              );
              const finalCities = hasCity
                ? defaultCities
                : [...defaultCities, { value: bestMatchedCity, label: bestMatchedCity }];

              console.log(`[PincodeFetch] Resolution success! State: ${refined.stateName} (${matchedStateObj.code}), City: ${bestMatchedCity}`);
              setCityOptions(finalCities);
              setValue('state_code', matchedStateObj.code, { shouldValidate: true });
              setValue('city', bestMatchedCity, { shouldValidate: true });
              clearErrors('pin_code');
              setIsLocked(true); // Lock fields since it resolved successfully
            } else {
              console.warn(`[PincodeFetch] State '${refined.stateName}' is not supported in the app config.`);
              setError('pin_code', { type: 'manual', message: `State '${refined.stateName}' not supported` });
              setValue('state_code', '');
              setValue('city', '');
              setIsLocked(false); // Keep open for manual edit
            }
          } else {
            console.warn(`[PincodeFetch] PIN code could not be resolved on server.`);
            setError('pin_code', { type: 'manual', message: 'PIN code not found. Please enter State and City manually.' });
            setValue('state_code', '');
            setValue('city', '');
            setIsLocked(false); // Keep open for manual edit
          }
        } catch (err) {
          console.error(`[PincodeFetch] Error calling Server Action:`, err);
          setError('pin_code', { type: 'manual', message: 'Failed to fetch location. Enter manually.' });
          setIsLocked(false);
        } finally {
          setIsFetching(false);
        }
      };

      fetchLocation();
    } else if (sanitizedPin.length > 0 && sanitizedPin.length < 6) {
      // Clear values if pincode becomes incomplete
      setValue('state_code', '');
      setValue('city', '');
      setIsLocked(false);
    } else {
      setIsLocked(false);
    }
  }, [pinCode, setValue, setError, clearErrors, setCityOptions]);

  return { isFetching, isLocked };
}
