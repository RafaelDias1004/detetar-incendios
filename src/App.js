import { useState,useEffect } from "react";
import Map from './components/Map';
import Loader from './components/Loader';
import Header from './components/Header';

function App() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events');
      const {events} = await res.json()

      setEventData(events)
      setLoading(false)
      }

      fetchEvents()

    }, [])

  return (
    <div>
      <Header/>
      { !loading ? (<Map eventData={eventData} center = {{ lat: 40.3999, lng: -8.6196 }} zoom = {10} /> ) :  (<h1><Loader/></h1> )}
    </div>
  );
}

export default App;
