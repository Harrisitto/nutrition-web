import { useFetchClientThemesProgress } from "../../../../../services/tanstack/user/appointments";
import { AssignThemeCard } from "./assignTheme";

// Unidades del viewBox: el tamaño en pantalla lo da --ring (progressStyles.card)
const RING_SIZE = 64;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const ThemeProgressItem = ({ theme }: { theme: NonNullable<ReturnType<typeof useFetchClientThemesProgress>['data']>[0] }) => {
    const percent = Math.round(theme.progress * 100);

    return (
        <div
            className={progressStyles.card}
            title={`${theme.theme_name}: ${theme.treated}/${theme.total}`}
        >
            <div className={progressStyles.titleBox}>
                <span className={progressStyles.title}>{theme.theme_name}</span>
            </div>
            <div
                className={progressStyles.ring}
                role="img"
                aria-label={`${theme.theme_name}: ${percent}%`}
            >
                <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className={progressStyles.svg}>
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth={RING_STROKE}
                        className={progressStyles.track}
                    />
                    {/* Con 0% no se pinta: el extremo redondeado dejaria un punto */}
                    {percent > 0 && (
                        <circle
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={RING_RADIUS}
                            fill="none"
                            strokeWidth={RING_STROKE}
                            strokeLinecap="round"
                            strokeDasharray={RING_CIRCUMFERENCE}
                            strokeDashoffset={RING_CIRCUMFERENCE * (1 - theme.progress)}
                            className={progressStyles.fill}
                        />
                    )}
                </svg>
                <span className={progressStyles.value}>{percent}%</span>
            </div>
        </div>
    );
};

const ChartsAppointmentProgress = () => {

    const query = useFetchClientThemesProgress({ limit: 10 });

    // La tarjeta de asignar sale siempre, aunque el progreso cargue o falle
    return (
        <>
            <AssignThemeCard />
            {query.data?.map((theme) => (
                <ThemeProgressItem key={theme.id} theme={theme} />
            ))}
        </>
    );
}

const progressStyles = {
    // Misma tarjeta que los InfoRow de la cabecera. --ring: diametro del anillo, crece con el
    // ancho de pantalla entre 48px y 80px (64px a ~1280px), como un moderateScale
    card: "group [--ring:clamp(3rem,2rem_+_2.5vw,5rem)] flex flex-col items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-fade-green shadow-2xs hover:border-nutrition-green/40 transition-all duration-200 w-[calc(var(--ring)+3rem)] shrink-0",

    // Reserva dos lineas (2lh) para que todas las tarjetas midan igual
    titleBox: "relative w-full h-[2lh] text-[10px] leading-tight",

    // Dos lineas como maximo; con hover se ve completo por encima del anillo, sin mover la fila
    title: "absolute inset-x-0 top-0 text-center font-bold uppercase tracking-wider text-text-muted select-none break-words line-clamp-2 group-hover:line-clamp-none group-hover:z-10 group-hover:bg-white group-hover:pb-1",

    ring: "relative flex items-center justify-center",

    svg: "-rotate-90 size-[var(--ring)]",

    // Pista: tono claro del mismo verde que el relleno
    track: "stroke-fade-green",

    fill: "stroke-nutrition-green transition-[stroke-dashoffset] duration-500",

    value: "absolute text-[length:calc(var(--ring)*0.22)] font-semibold text-text-body",
} as const;

export default ChartsAppointmentProgress;
