import { read, slurp } from "./file.js";
import metafile from "./meta.json" assert { type: "json" };
import { proxy } from "./proxy.js";
import { serve } from "std/http/server.ts";

const { updated, meta, links, ids } = metafile;

const data = await slurp({ ids });

const has = (id) => new Set(ids).has(id?.toLowerCase());

const headers = [
  ["content-type", "application/json; charset=utf-8"],
  ["access-control-allow-origin", "*"],
];

const response = (object) => Response.json(object, { headers });

const doi = async (request) =>
  has(request.doi)
    ? response({ data: await read(request.doi) })
    : await proxy(request);

const index = () => response({ updated, meta, links, ids });

const dois = (request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const emptyQuery = !query || query?.length === 0;
  return emptyQuery ? response({ updated, data, meta, links }) : proxy(request);
};

const routes = new Map([["/", index], ["/meta", index], ["/dois", dois]]);

serve((request) => {
  const { pathname } = new URL(request.url);
  const pattern = new URLPattern({ pathname: "/dois/:prefix/:suffix" });

  const { prefix, suffix } = pattern.exec(request.url)?.pathname?.groups ?? {};
  if (prefix && suffix) {
    request.doi = `${prefix}/${suffix}`;
    return doi(request);
  } else if (routes.has(pathname)) {
    return routes.get(pathname)(request);
  }
});
