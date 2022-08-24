import { dirFilename } from "./file.js";

const dois = "https://api.datacite.org/dois";

const defaults = { "page[size]": 1000 };

const url = (params) =>
  new URL("?" + new URLSearchParams({ ...defaults, ...params }), dois);

const fetchDatacite = async (params) =>
  await fetch(url(params)).then((r) => r.json());

const fetchQuery = async (query) => {
  const { data } = await fetchDatacite({ query, affiliation: true });
  return data;
};

const ndjson = (o) => console.log(JSON.stringify(o));

const save = async (meta) => {
  const { id } = meta;
  const [dir, filename] = dirFilename(id);
  await Deno.mkdir(dir, { recursive: true });
  Deno.writeTextFile(`${dir}/${filename}`, JSON.stringify(meta) + "\n");
};

const fetchAkvaplan = async () => {
  const data = await fetchQuery("Akvaplan-niva");
  const ids = new Set(data.map(({ id }) => id));

  const data2 = await fetchQuery("creators.affiliation.name:Akvaplan-niva");
  const add = data2.filter(({ id }) => !ids.has(id));
  add.map(({ id }) => ids.add(id));
  return [...data, ...add];
};

if (import.meta.main) {
  const data = await fetchAkvaplan();
  data.map(ndjson);
  data.map(save);
}
