import { akvaplanQuery as query } from "./akvaplan.js";
import { fetchQuery } from "./dois.js";
import { save, saveMeta } from "./file.js";
if (import.meta.main) {
  const { data, meta, links } = await fetchQuery(query);
  await saveMeta({ data, meta, links, query });
  data.map(save);
}
