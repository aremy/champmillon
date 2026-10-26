/**
 * Content schemas. Each collection is a folder in src/content/.
 * Field names are in French because contributors read and edit them.
 * A missing or misspelled field stops the build with a clear message.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Form editors may save empty fields as "" or null: treat them as "not filled in". */
const facultatif = <T extends z.ZodType>(schema: T) =>
  z.preprocess(v => (v === "" || v === null ? undefined : v), schema.optional());

const lien = z.object({ titre: z.string(), lien: z.string() });

const site = defineCollection({
  loader: glob({ pattern: "site.yaml", base: "./src/content/reglages" }),
  schema: z.object({
    nom: z.string(),
    slogan: z.string(),
    territoire: z.string(),
    description: z.string(),
    mairie: z.object({
      adresse: z.string(),
      telephone: z.string(),
      email: z.string(),
      horaires: z.array(z.object({ jour: z.string(), heures: z.string() })),
      note_horaires: z.string().optional(),
    }),
    menu: z.array(lien),
    liens_utiles: z.array(lien).default([]),
  }),
});

const accueil = defineCollection({
  loader: glob({ pattern: "accueil.yaml", base: "./src/content/reglages" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      texte: z.string(),
      photo: image(),
      photo_legende: facultatif(z.string()),
      acces_rapides: z.array(
        z.object({
          titre: z.string(),
          texte: z.string().optional(),
          lien: z.string(),
          icone: z.string().default("info"),
        }),
      ),
      decouvrir: z
        .object({
          titre: z.string(),
          texte: z.string(),
          photos: z.array(z.object({ photo: image(), legende: z.string() })),
        })
        .optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      description: z.string(),
      photo: facultatif(image()),
      photo_legende: facultatif(z.string()),
    }),
});

export const CATEGORIES = [
  "Mairie",
  "Vie du village",
  "Travaux",
  "Associations",
  "École",
  "Environnement",
] as const;

const actualites = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/actualites" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      date: z.coerce.date(),
      resume: z.string(),
      categorie: z.enum(CATEGORIES).default("Vie du village"),
      photo: facultatif(image()),
      photo_legende: facultatif(z.string()),
      // An event block without a date is ignored.
      evenement: z.preprocess(
        v => (v && typeof v === "object" && "date" in v && v.date ? v : undefined),
        z
          .object({
            date: z.coerce.date(),
            heure: facultatif(z.string()),
            lieu: facultatif(z.string()),
          })
          .optional(),
      ),
      brouillon: z.boolean().nullish().transform(v => v ?? false),
    }),
});

const alertes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/alertes" }),
  schema: z.object({
    titre: z.string(),
    niveau: z.enum(["info", "vigilance", "urgent"]).default("info"),
    resume: z.string(),
    debut: z.coerce.date(),
    fin: z.coerce.date(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: ({ image }) =>
    z.object({
      annee: z.number().int(),
      titre: z.string(),
      resume: z.string(),
      couverture: facultatif(image()),
      pdf: facultatif(z.string()),
    }),
});

export const collections = { site, accueil, pages, actualites, alertes, journal };
