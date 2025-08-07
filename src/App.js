import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import Map from "./components/Map";
import Loader from "./components/Loader";
import Header from "./components/Header";

function App() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const mapRef = useRef();

  <Map
    eventData={eventData}
    center={{ lat: 40.3999, lng: -8.6196 }}
    zoom={7}
    onMapReady={() => setMapReady(true)}
    mapRef={mapRef}
  />;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch(
        `https://firms.modaps.eosdis.nasa.gov/api/country/csv/0e4b2a5f3dafb0176931fc28e13a2d9e/VIIRS_SNPP_NRT/PRT/${selectedDays}`
      );
      const text = await res.text(); // lê como texto bruto
      //console.log(text);

      const parsedData = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      
      setEventData(parsedData.data);
      setLoading(false);
    };

    fetchEvents();
  }, [selectedDays]);

  return (
    <div>
    <Header 
    eventData={eventData} 
    mapIsReady={mapReady}
    selectedDays={selectedDays}
    setSelectedDays={setSelectedDays}
    onSelectLocation={(location) => {
      if (mapRef.current) {
        mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
        mapRef.current.setZoom(12);
      }
    }} />
      {!loading ? (
        <Map
          eventData={eventData}
          center={{ lat: 40.3999, lng: -8.6196 }}
          zoom={7}
          mapRef={mapRef}
          onMapReady={() => setMapReady(true)}
        />
      ) : (
        <h1>
          <Loader />
        </h1>
      )}
    </div>
  );
}

export default App;
