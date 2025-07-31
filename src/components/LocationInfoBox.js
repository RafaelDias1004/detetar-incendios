const LocationInfoBox = ({info, onClose}) => {
  return (
    <div className="location-info">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Informação do evento local</h2>
        <ul>
            <li>ID: <b>{info.id}</b></li>
            <li>Título: <b>{info.title}</b></li>
            <li>Data de Início:  <b>{new Date(info.date).toLocaleDateString()}</b></li>
            <li>Cidade: <b>{info.city}</b></li>
        </ul>
    </div>
  )
}

export default LocationInfoBox;