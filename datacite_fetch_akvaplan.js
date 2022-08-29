import { akvaplanQuery as query } from "./akvaplan.js";
import { fetchQuery } from "./dois.js";
import { save, saveMetafile } from "./file.js";
if (import.meta.main) {
  const { data, meta, links } = await fetchQuery(query);
  data.map(save);
  await saveMetafile({ data, meta, links, query });
}
