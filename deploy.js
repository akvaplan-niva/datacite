import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { files, readTextFile, root } from "./file.js";

const getDOI = async (doi) => {
  const text = await readTextFile(doi);
  return new Response(text, { type: "application/json" });
};

const streamDOIs = async () => {
  const dois = [];
  for await (const { name, isDirectory } of Deno.readDir(root)) {
    if (isDirectory) {
      const dir = name;
      for await (const { name } of files(`${root}/${dir}`)) {
        const text = await Deno.readTextFile(`${root}/${dir}/${name}`);
        dois.push(JSON.parse(text));
      }
    }
  }
  return Response.json(dois);
};

serve(async ({ url }) => {
  const pattern = new URLPattern({ pathname: "/dois/:prefix/:suffix" });
  const { prefix, suffix } = pattern.exec(url)?.pathname?.groups ?? {};
  if (prefix && suffix) {
    return await getDOI(`${prefix}/${suffix}`);
  } else {
    return streamDOIs();
  }
});
