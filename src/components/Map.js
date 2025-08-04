import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};


// Função para obter a cidade e o distrito por reverse geocoding
const getCityFromCoords = async (lat, lng) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE`
  );
  const data = await res.json();

  const components = data.results[0]?.address_components || [];

  const city = data.results[0]?.address_components?.find(component =>
    component.types.includes("locality")
  )?.long_name;

  const district = components.find(component =>
    component.types.includes("administrative_area_level_1")
  )?.long_name;

  return {
    city: city || "Localidade desconhecida",
    district: district || "Distrito desconhecido"
  };
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
        maxZoom: 12,
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
        //const frp = fire.frp;

        return (
          <LocationMarker
            key={index}
            lat={lat}
            lng={lng}
            onClick={async () => {
              const {city, district} = await getCityFromCoords(lat, lng);
              setLocationInfo({
                title: `Fogo (${confidence})`,
                date: date,
                city: ` ${city} - ${district}`,
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
