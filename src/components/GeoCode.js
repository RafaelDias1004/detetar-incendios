const getCityFromCoords = async (lat, lng) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCPoJAXtZU9PdhZuwfSqDA4qTtikSjUHlE`
  );
  const data = await res.json();

  const components = data.results[0]?.address_components || [];

  const city = data.results[0]?.address_components?.find(component =>
    component.types.includes("locality")
  )?.long_name;

  const district = components.find(component =>
    component.types.includes("administrative_area_level_1")
  )?.long_name;

  return {
    city: city || "Localidade desconhecida",
    district: district || "Distrito desconhecido"
  };
};
export default getCityFromCoords;