import { useGestureStore } from '../../hooks/useGestureStore';

export function InfoPanel() {
  const selectedPlanet = useGestureStore((state) => state.selectedPlanet);
  const clearSelectedPlanet = useGestureStore((state) => state.clearSelectedPlanet);

  if (!selectedPlanet) return null;

  return (
    <div
      className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm border border-white/10 animate-in fade-in duration-300"
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <button
        onClick={clearSelectedPlanet}
        className="absolute top-2 right-2 text-white/60 hover:text-white text-xl leading-none"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-bold text-white mb-1">
        {selectedPlanet.name}
        <span className="text-white/60 text-sm ml-2">{selectedPlanet.nameCn}</span>
      </h2>

      <p className="text-white/80 text-sm mb-3">{selectedPlanet.description}</p>
      <p className="text-white/60 text-xs mb-3">{selectedPlanet.descriptionCn}</p>

      {selectedPlanet.facts && (
        <div className="space-y-1 text-xs">
          {Object.entries(selectedPlanet.facts).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-white/90">{value}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
