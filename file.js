const { readDir, mkdir, writeTextFile } = Deno;

export const root = "dois";

export async function* files(dir) {
  for await (const { name, isFile, ...meta } of readDir(dir)) {
    if (isFile) {
      yield { name, ...meta };
    }
  }
}

export const dirFilename = (id) => {
  const [prefix, ...suf] = id.split("/");
  const dir = `${root}/${encodeURIComponent(prefix)}`;
  const filename = encodeURIComponent(suf.join("_") + ".json");

  return [dir, filename];
};

export const path = (id) => dirFilename(id).join("/");

export const read = async (doi) => {
  // const mod = await import("./" + path(id), { assert: { type: "json" } });
  // return mod.default;
  return JSON.parse(await Deno.readTextFile(path(doi)));
};

export const slurp = async ({ids}) => {
  const dois = [];
  for await (const doi of ids) {
    dois.push(await read(doi));
  }   
  return dois;
};

export const save = async (datacite) => {
  const { id } = datacite;
  //const { doi} = datacite.attributes.doi;
  //todo assertEquals
  const [dir, filename] = dirFilename(id);
  await mkdir(dir, { recursive: true });
  await writeTextFile(
    `${dir}/${filename}`,
    JSON.stringify(datacite) + "\n",
  );
};

export const saveMeta = async ({ data, query, meta, links }) => {
  const ids = [...new Set(data.map(({ id }) => id))];
  const updated = [
    ...new Set(data.map(({ attributes: { updated } }) => updated)),
  ].sort().at(-1);
  await writeTextFile(
    "meta.json",
    JSON.stringify({ updated, query, ids, meta, links }) + "\n",
  );
};
