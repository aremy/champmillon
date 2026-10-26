import { getCollection, getEntry, type CollectionEntry } from "astro:content";

const DAY = 24 * 60 * 60 * 1000;

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", ...options });

export const formatDate = (d: Date) => fmt({ day: "numeric", month: "long", year: "numeric" }).format(d);
export const formatDay = (d: Date) => fmt({ day: "numeric" }).format(d);
export const formatMonth = (d: Date) => fmt({ month: "short" }).format(d).replace(".", "");
export const formatWeekday = (d: Date) => fmt({ weekday: "long" }).format(d);

export async function getSite() {
  const entry = await getEntry("site", "site");
  if (!entry) throw new Error("Fichier manquant : src/content/reglages/site.yaml");
  return entry.data;
}

export async function getAccueil() {
  const entry = await getEntry("accueil", "accueil");
  if (!entry) throw new Error("Fichier manquant : src/content/reglages/accueil.yaml");
  return entry.data;
}

/** Published news, newest first. */
export async function getActualites() {
  const all = await getCollection("actualites", ({ data }) => !data.brouillon);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** News items that announce an event today or later, soonest first. */
export async function getAgenda(now = new Date()) {
  const news = await getActualites();
  return news
    .filter(n => n.data.evenement && n.data.evenement.date.getTime() + DAY > now.getTime())
    .sort((a, b) => a.data.evenement!.date.getTime() - b.data.evenement!.date.getTime());
}

/** Alert end time: the whole "fin" day is included. */
export const alerteFin = (a: CollectionEntry<"alertes">) => a.data.fin.getTime() + DAY;

const NIVEAU_ORDRE = { urgent: 0, vigilance: 1, info: 2 } as const;

/** Alerts currently in force, most serious first. */
export async function getAlertesActives(now = new Date()) {
  const all = await getCollection("alertes");
  return all
    .filter(a => a.data.debut.getTime() <= now.getTime() && now.getTime() < alerteFin(a))
    .sort((a, b) => NIVEAU_ORDRE[a.data.niveau] - NIVEAU_ORDRE[b.data.niveau]);
}

export async function getToutesAlertes() {
  const all = await getCollection("alertes");
  return all.sort((a, b) => b.data.debut.getTime() - a.data.debut.getTime());
}

export async function getJournaux() {
  const all = await getCollection("journal");
  return all.sort((a, b) => b.data.annee - a.data.annee);
}

/** True when a journal issue has a web version (text below the front matter). */
export const hasWebVersion = (j: CollectionEntry<"journal">) => (j.body ?? "").trim().length > 0;
