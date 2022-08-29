import { base } from "./base.js";

export const proxy = async (request) => {
  const url = new URL(request.url);
  url.protocol = "https:";
  url.hostname = new URL(base).hostname;
  url.port = 443;
  return await fetch(url.href, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });
};
