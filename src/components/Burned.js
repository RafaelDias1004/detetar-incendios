const FireIconWithFill = ({ percentage }) => {
  const fillHeight = percentage;

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      {/* Preenchimento controlado por máscara */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: `${fillHeight}%`,
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          WebkitMaskImage: 'url(/img/burned.svg)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskImage: 'url(/img/burned-filled.svg)',
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
          maskPosition: 'center',
          zIndex: 1,
        }}
      />

      {/* Contorno por cima, se quiseres dar mais detalhe, opcional */}
      <img
        className="burned-icon"
        src="/img/burned.svg"
        alt="Contorno fogo"
      />

      {/* Percentagem no centro */}
      <div className="percentage">
        ≈{fillHeight}%
        <p style={{marginTop:"10px"}}>Zona queimada</p>
      </div>
    </div>
  );
};

export default FireIconWithFill;