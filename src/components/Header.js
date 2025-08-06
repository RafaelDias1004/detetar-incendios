import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/fire-alert";
import getCityFromCoords from "./GeoCode";

const Header = ({ eventData, onSelectLocation, mapIsReady }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueLocations, setUniqueLocations] = useState([]);


useEffect(() => {
  const loadLocations = async () => {
    const seenCoords = new Set();
    const seenNames = new Set();

    const sorted = [...eventData].sort((a, b) => {
      const confA = a.confidence === "h" ? 3 : a.confidence === "n" ? 2 : 1;
      const confB = b.confidence === "h" ? 3 : b.confidence === "n" ? 2 : 1;
      return confB - confA;
    });

    // Cria um array de Promises (chamadas paralelas)
    const locationPromises = sorted.map(async (event) => {
      const key = `${event.latitude}-${event.longitude}`;
      if (seenCoords.has(key)) return null;

      try {
        const { city, district } = await getCityFromCoords(event.latitude, event.longitude);
        const name = `${city} - ${district}`;
        if (seenNames.has(name)) return null;

        seenCoords.add(key);
        seenNames.add(name);

        return {
          name,
          latitude: event.latitude,
          longitude: event.longitude,
          confidence: event.confidence,
        };
      } catch (e) {
        console.warn("Erro ao buscar cidade:", e);
        return null;
      }
    });

    // Espera que todas as chamadas terminem
    const results = await Promise.all(locationPromises);

    // Filtra os nulos
    const validLocations = results.filter((loc) => loc !== null);

    console.log("Localidades únicas carregadas:", validLocations);
    setUniqueLocations(validLocations);
  };

  if (eventData.length > 0 && mapIsReady) {
    loadLocations();
  }
}, [eventData, mapIsReady]);


  return (
    <header className="header">
      <h1>
        <Icon icon={locationIcon} /> 
        Detetor de Incêndios (Possibilitado pela NASA)
      </h1>

      <div className="dropdown-container">
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          Ver Localidades ▾
        </button>
        {isOpen && (
          <ul className="dropdown-menu">
            {uniqueLocations.length === 0 ? (
              <li>A carregar localidades...</li>
            ) : (
              uniqueLocations.map((loc, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                >
                  {loc.name} ({loc.confidence})
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
