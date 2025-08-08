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

      // Mapeia os dados para obter a cidade e distrito de cada coordenada
      const locationPromises = sorted.map(async (event) => {
        const key = `${event.latitude}-${event.longitude}`; // Chave única por coordenadas
        if (seenCoords.has(key)) return null; // Ignora coordenadas repetidas

        try {
          // Obtém cidade e distrito a partir das coordenadas
          const { city, district } = await getCityFromCoords(
            event.latitude,
            event.longitude
          );

          const name = `${city} - ${district}`;
          if (seenNames.has(name)) return null; // Ignora nomes repetidos

          seenCoords.add(key);     // Marca coordenada como vista
          seenNames.add(name);     // Marca nome como visto

          return {
            name,
            latitude: event.latitude,
            longitude: event.longitude,
            confidence: event.confidence,
          };
        } catch (e) {
          console.warn("Erro ao buscar cidade:", e); // Erro na API de geocodificação
          return null;
        }
      });

      // Aguarda que todas as promessas terminem
      const results = await Promise.all(locationPromises);

      // Remove valores nulos (eventos ignorados)
      const validLocations = results.filter((loc) => loc !== null);

      console.log("Localidades únicas carregadas:", validLocations);
      setUniqueLocations(validLocations); // Atualiza o estado com as localidades únicas
    };

    // Só carrega se existirem dados e o mapa estiver pronto
    if (eventData.length > 0 && mapIsReady) {
      loadLocations();
    }
  }, [eventData, mapIsReady]); // Executa sempre que os dados ou o mapa mudem
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
