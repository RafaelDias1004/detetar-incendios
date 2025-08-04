import { useState,useEffect } from "react";
import Papa from "papaparse";
import Map from './components/Map';
import Loader from './components/Loader';
import Header from './components/Header';

function App() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch('https://firms.modaps.eosdis.nasa.gov/api/country/csv/0e4b2a5f3dafb0176931fc28e13a2d9e/VIIRS_SNPP_NRT/PRT/7');
      const text = await res.text(); // lê como texto bruto
      console.log(text);
     
      const parsedData = Papa.parse(text, { 
        header: true, 
        dynamicTyping: true, 
        skipEmptyLines: true 
      });
      
      setEventData(parsedData.data);
      setLoading(false)
      }

      fetchEvents()

    }, [])

  return (
    <div>
      <Header/>
      { !loading ? (
        <Map eventData={eventData} center = {{ lat: 40.3999, lng: -8.6196 }} zoom = {7} /> 
        ) :  (
        <h1><Loader/></h1> 
        )}
    </div>
  );
}

export default App;
