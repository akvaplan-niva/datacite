import { read, slurp } from "./file.js";
import metafile from "./meta.json" assert { type: "json" };
import { base } from "./base.js";

import { serve } from "std/http/server.ts";

const { updated, meta, links, ids } = metafile;

const data = await slurp({ ids });

const headers = [["access-control-allow-origin", "*"]];

const has = (id) => new Set(ids).has(id);

const proxy = async (request) => {
  const url = new URL(request.url);
  url.protocol = "https:";
  url.hostname = new URL(base).hostname;
  url.port = "443";
  console.warn("proxy", url.href);
  return await fetch(url.href, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });
};

const response = (object) => Response.json(object, { headers });

const doi = async ({ doi }) => response({ data: await read(doi) });

const index = () => response({ updated, meta, links, ids });

const dois = (request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const emptyQuery = !query || query?.length === 0;
  return emptyQuery ? response({ updated, data, meta, links }) : proxy(request);
};

const routes = new Map([["/", index], ["/dois", dois]]);

serve(async (request) => {
  const { pathname } = new URL(request.url);
  const pattern = new URLPattern({ pathname: "/dois/:prefix/:suffix" });

  const { prefix, suffix } = pattern.exec(request.url)?.pathname?.groups ?? {};
  if (prefix && suffix) {
    const id = `${prefix}/${suffix}`;
    request.doi = id;
    return has(id) ? await doi(request) : await proxy(request);
  } else if (routes.has(pathname)) {
    return routes.get(pathname)(request);
  }
});
