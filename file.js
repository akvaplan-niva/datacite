export const root = "dois";

export const dirFilename = (id) => {
  const [prefix, ...suf] = id.split("/");

  const dir = `${root}/${encodeURIComponent(prefix)}`;
  const filename = encodeURIComponent(suf.join("_") + ".json");

  return [dir, filename];
};

export const path = (id) => dirFilename(id).join("/");

export const readTextFile = async (id) => {
  try {
    await Deno.stat(path(id));
    return Deno.readTextFile(path(id));
  } catch (error) {
    throw error;
  }
};

export async function* files(dir=root) {
  const dirIter = Deno.readDir(dir);
  for await (const { name, isFile, ...meta } of dirIter) {
    if (isFile) {
      yield { name, ...meta };
    }
  }
}

