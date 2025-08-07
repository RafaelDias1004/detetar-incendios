import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/fire-alert";
import getCityFromCoords from "./GeoCode";

const Header = ({
  eventData, // Dados dos eventos de incêndio
  onSelectLocation, // Função para centralizar o mapa numa localização selecionada do dropdown
  mapIsReady, // Indica se o mapa está carregado
  setSelectedDays, // Função para atualizar o número de dias selecionados
  selectedDays, // Número de dias atualmente selecionados
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      const seenCoords = new Set();
      const seenNames = new Set();

      // Ordena os dados por confiança (alta > média > baixa)
      const sorted = [...eventData].sort((a, b) => {
        const confA = a.confidence === "h" ? 3 : a.confidence === "n" ? 2 : 1;
        const confB = b.confidence === "h" ? 3 : b.confidence === "n" ? 2 : 1;
        return confB - confA;
      });

      // Array para armazenar as localidades únicas
      const results = [];

      // Mapeia os dados para obter a cidade e distrito de cada coordenada
      for (const event of sorted) {
        const key = `${event.latitude}-${event.longitude}`;
        if (seenCoords.has(key)) continue; // Ignora coordenadas repetidas

        //Tenta ober a cidade e distrito usando as coordenadas da função getCityFromCoords
        try {
          const { city, district } = await getCityFromCoords(
            event.latitude,
            event.longitude
          );

          const name = `${city} - ${district}`;
          if (seenNames.has(name)) return null; //Ignora nomes repetidos

          seenCoords.add(key);
          seenNames.add(name);

          // Adiciona a localização única ao array de resultados
          results.push({
            name,
            latitude: event.latitude,
            longitude: event.longitude,
            confidence: event.confidence,
          });

          // Aguarda um pouco para evitar sobrecarga de requisições
          await new Promise((res) => setTimeout(res, 50));
        } catch (e) {
          console.warn("Erro ao buscar cidade:", e);
        }
      }
      // Atualiza o estado com as localidades únicas
      setUniqueLocations(results);
    };

    // Carrega as localidades apenas se houver dados de eventos e o mapa estiver pronto
    if (eventData.length > 0 && mapIsReady) {
      loadLocations();
    }
  }, [eventData, mapIsReady]); // Recarrega as localidades quando os dados de eventos ou o estado do mapa mudarem

  //Interface do Header
  return (
    <header className="header">
      <h1>
        <Icon icon={locationIcon} />
        Detetor de Incêndios (Possibilitado pela NASA)
      </h1>

      {/* Dropdown principal com botão de ver localidades e seletor de dias */}
      <div className="dropdown-container">
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          Ver Localidades ▾
        </button>

        {/*Dropdown para selecionar o número de dias*/}
        <select
          className="dropdown-button"
          style={{ marginLeft: "10px" }}
          value={selectedDays}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <option key={day} value={day}>
              Últimos {day} dias
            </option>
          ))}
        </select>

        {/* Menu com as localidades únicas, só aparece se isOpen for true */}
        {isOpen && (
          <ul className="dropdown-menu">
            {uniqueLocations.length === 0 ? (
              <li>A carregar localidades...</li>
            ) : (
              //Lista de localidades únicas com clique para centralizar no mapa
              uniqueLocations.map((loc, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onSelectLocation(loc); // Centraliza o mapa na localização selecionada
                    setIsOpen(false); // Fecha o dropdown
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
