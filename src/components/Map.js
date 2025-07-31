import { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';

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
  const [locationInfo, setLocationInfo] = useState(null);

  const markers = eventData
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
    });

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE'
        }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {markers}
      </GoogleMapReact>
      {locationInfo && (
        <LocationInfoBox
          info={locationInfo}
          onClose={() => setLocationInfo(null)}
        />
      )}
    </div>
  );
};

export default Map;