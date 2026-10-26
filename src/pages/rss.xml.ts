import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getActualites, getSite } from "@/lib/content";

export async function GET(context: APIContext) {
  const site = await getSite();
  const items = await getActualites();
  return rss({
    title: `Actualités de ${site.nom}`,
    description: site.description,
    site: new URL(import.meta.env.BASE_URL, context.site),
    items: items.map(item => ({
      title: item.data.titre,
      description: item.data.resume,
      pubDate: item.data.date,
      link: `actualites/${item.id}/`,
    })),
    customData: "<language>fr-fr</language>",
  });
}
