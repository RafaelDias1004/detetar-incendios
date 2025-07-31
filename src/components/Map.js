import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

// Função para obter a cidade por reverse geocoding
const getCityFromCoords = async (lat, lng) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE`
  );
  const data = await res.json();
  const city = data.results[0]?.address_components?.find(component =>
    component.types.includes("locality")
  )?.long_name;

  return city || "Localidade desconhecida";
};

const Map = ({ eventData, center, zoom }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE',
  });

  const [locationInfo, setLocationInfo] = useState(null);

  return isLoaded ? (
    <GoogleMap
  mapContainerStyle={containerStyle}
  center={center}
  zoom={zoom}
  options={{
    maxZoom: 12, // ou o valor que quiseres
    minZoom: 3,  // opcional, para evitar que se afaste demasiado
    streetViewControl: false,
    mapTypeControl: false,
  }}
>
      {eventData
        .filter(event => event.categories[0].id === 8)
        .map(event => {
          const lat = event.geometries[0].coordinates[1];
          const lng = event.geometries[0].coordinates[0];

          return (
            <LocationMarker
              key={event.id}
              lat={lat}
              lng={lng}
              onClick={async () => {
                const city = await getCityFromCoords(lat, lng);
                setLocationInfo({
                  id: event.id,
                  title: event.title,
                  date: event.geometries[0].date,
                  city: city
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
