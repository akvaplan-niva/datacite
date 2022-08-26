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

export const read = async (id) => {
  const mod = await import("./" + path(id), { assert: { type: "json" } });
  return mod.default;
};

export const slurp = async () => {
  const dois = [];
  for await (const { name, isDirectory } of readDir(root)) {
    if (isDirectory) {
      const dir = name;
      for await (const { name } of files(`${root}/${dir}`)) {
        const mod = await import(`./${root}/${dir}/${name}`, {
          assert: { type: "json" },
        });
        dois.push(mod.default);
      }
    }
  }
  return dois;
};

export const save = async (datacite) => {
  const { id } = datacite;
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
