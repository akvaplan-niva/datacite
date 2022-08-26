import {extra} from "./extra.js";

export const akvaplanQuery =
  `Akvaplan-niva OR creators.affiliation.name:Akvaplan-niva ${extra.map(doi=> `OR id:${doi.toLowerCase()}`).join(" ")}`.trim();