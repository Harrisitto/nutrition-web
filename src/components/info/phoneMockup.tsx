export const PhoneMockup = () => {
  return (
    <div className="lg:col-span-5 relative flex justify-center">
      <div className="lg:col-span-5 relative flex items-center justify-center py-6">
        {/* Glow ambiental vertical con colores de la app */}
        <div className="absolute -inset-4 bg-gradient-to-b from-nutrition-green/25 via-nutrition-blue/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-fade-green rounded-full blur-2xl pointer-events-none" />

        {/* Frame Principal del Mockup (Proporción muy vertical: aspect-[9/19.5]) */}
        <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/19.5] rounded-[3rem] bg-black-green p-3.5 shadow-2xl ring-1 ring-white-green/10 border-4 border-dark-green transition-transform duration-500 hover:scale-[1.01]">

          {/* Isleta / Notch superior */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black-green rounded-full z-20 flex items-center justify-center gap-2 border border-dark-green/50">
            <div className="w-2 h-2 rounded-full bg-nutrition-green/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-nutrition-blue/80" />
          </div>

          {/* Contenedor interno de la captura con borde estilizado */}
          <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden border-2 border-nutrition-green/40 bg-white-green shadow-inner">
            <img
              src="/src/assets/screenshots/app-calendar.jpg"
              alt="phone mockup"
              className="w-full h-full object-cover object-top"
            />

            {/* Degradado tenue sobre la pantalla */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-green/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Detail Badge flotante 1: Progreso Nutricional */}
          <div className="absolute -left-8 bottom-24 z-30 bg-white-green/95 backdrop-blur-md border-2 border-nutrition-green/40 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-nutrition-green flex items-center justify-center text-white-green font-bold text-sm shadow-sm">
              🥗
            </div>
            <div>
              <p className="text-xs font-bold text-text-title leading-tight">Plan Diario</p>
            </div>
          </div>

          {/* Detail Badge flotante 2: Estado de la App */}
          <div className="absolute -right-6 top-20 z-30 bg-dark-green/95 text-white-green border border-nutrition-green/30 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-nutrition-blue animate-pulse" />
            <span className="text-xs font-medium tracking-wide">Sincronizado</span>
          </div>

          {/* Indicador Home Bar inferior */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-fade-white-green rounded-full z-20" />
        </div>
      </div>
    </div>
  );
};
