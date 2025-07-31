import { OverlayView } from '@react-google-maps/api';
import { Icon } from '@iconify/react';
import locationIcon from '@iconify/icons-mdi/fire-alert';

const LocationMarker = ({ lat, lng, onClick }) => {
  return (
    <OverlayView
      position={{ lat, lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="location-marker" onClick={onClick}>
        <Icon icon={locationIcon} className="location-icon" />
      </div>
    </OverlayView>
  );
};

export default LocationMarker;