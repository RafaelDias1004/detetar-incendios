import FireIconWithFill from './Burned';

const LocationInfoBox = ({info, onClose}) => {
  return (
    <div className="location-info">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Informação do evento local</h2>
        <ul>
            <li>Cidade: <b>{info.city}</b></li>
            <li>Data de Início:  <b>{new Date(info.date).toLocaleDateString()}</b></li>
            <FireIconWithFill percentage={info.percentage} />
        </ul>
    </div>
  )
}

export default LocationInfoBox;