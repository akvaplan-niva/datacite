import { base } from "./base.js";

const dois = new URL("/dois", base).href;

const defaults = { "page[size]": 1000, affiliation: true };

const url = (params) =>
  new URL("?" + new URLSearchParams({ ...defaults, ...params }), dois);

export const fetchDatacite = async (params) =>
  await fetch(url(params)).then((r) => r.json());

export const fetchQuery = async (query) => await fetchDatacite({ query });
