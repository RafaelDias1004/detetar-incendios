import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useState,useEffect } from 'react';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';
import getCityFromCoords from './GeoCode';

// Define o estilo do container do mapa (full width and height)
const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const Map = ({ eventData, center, zoom, mapRef, onMapReady}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE',
  });

  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    if (isLoaded && onMapReady) {
      onMapReady();
    }
  }, [isLoaded, onMapReady]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={map => mapRef.current = map}
      options={{
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false,
        mapTypeControl: false,
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180,
          },
          strictBounds: true,
        },
      }}
    >
      {eventData.map((fire, index) => {
        const lat = fire.latitude;
        const lng = fire.longitude;
        const date = fire.acq_date;
        const confidence = fire.confidence;

        return (
          <LocationMarker
            key={index}
            lat={lat}
            lng={lng}
            onClick={async () => {
              const {city, district} = await getCityFromCoords(lat, lng);
              
              setLocationInfo({
                date: date,
                city: ` ${city} - ${district}`,
                percentage: confidence === 'l' ? 25 : confidence === 'n' ? 50 : confidence === 'h' ? 90 : 0, 
              });
            }}
          />
        );
      })}

      {locationInfo && (
        <LocationInfoBox
          info={locationInfo}
          onClose={() => setLocationInfo(null)}
        />
      )}
    </GoogleMap>
  ) : (
    <h2>A carregar mapa...</h2>
  );
};

export default Map;
