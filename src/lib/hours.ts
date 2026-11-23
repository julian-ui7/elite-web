import { site } from "@/data/site";

type Hours = Pick<typeof site.hours, "openMinutes" | "closeMinutes" | "timeZone"> & { days: readonly number[] };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["el domingo", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado"];

const hhmm = (mins: number) => `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;

/** Día de la semana (0 = domingo) y minutos desde medianoche en la zona horaria dada. */
function localParts(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dow = WEEKDAYS.indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { dow, minutes };
}

export type OpenStatus = { open: boolean; label: string };

/** ¿Está abierto ahora? Usa la hora de Ecuador sin importar dónde esté el visitante. */
export function getOpenStatus(now: Date = new Date(), hours: Hours = site.hours): OpenStatus {
  const { dow, minutes } = localParts(now, hours.timeZone);
  const workday = hours.days.includes(dow);

  if (workday && minutes >= hours.openMinutes && minutes < hours.closeMinutes) {
    return { open: true, label: `Abierto ahora · cerramos a las ${hhmm(hours.closeMinutes)}` };
  }

  let when: string;
  if (workday && minutes < hours.openMinutes) {
    when = "hoy";
  } else {
    let k = 1;
    while (k <= 7 && !hours.days.includes((dow + k) % 7)) k++;
    when = k === 1 ? "mañana" : DAY_NAMES[(dow + k) % 7];
  }
  return { open: false, label: `Cerrado ahora · abrimos ${when} a las ${hhmm(hours.openMinutes)}` };
}
