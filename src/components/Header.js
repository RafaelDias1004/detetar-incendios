import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/fire-alert";
import getCityFromCoords from "./GeoCode";

const Header = ({ eventData, onSelectLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      const seen = new Set();
      const temp = [];

      const sorted = [...eventData].sort((a, b) => {
        const confA = a.confidence === "h" ? 3 : a.confidence === "n" ? 2 : 1;
        const confB = b.confidence === "h" ? 3 : b.confidence === "n" ? 2 : 1;
        return confB - confA;
      });

      for (const event of sorted) {
        const key = `${event.latitude}-${event.longitude}`;
        if (!seen.has(key)) {
          seen.add(key);
          try {
            const { city, district } = await getCityFromCoords(
              event.latitude,
              event.longitude
            );
            const name = `${city} - ${district}`;

            // Evita duplicação por nome da localidade
            if (!temp.find((item) => item.name === name)) {
              temp.push({
                name,
                latitude: event.latitude,
                longitude: event.longitude,
                confidence: event.confidence,
              });
            }
          } catch (e) {
            console.warn("Erro ao buscar cidade:", e);
          }
        }
      }

      console.log("Localidades únicas carregadas:", temp);
      setUniqueLocations(temp);
    };

    if (eventData.length > 0) loadLocations();
  }, [eventData]);

  return (
    <header className="header">
      <h1>
        <Icon icon={locationIcon} /> Detetor de Incêndios (Possibilitado pela
        NASA)
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
