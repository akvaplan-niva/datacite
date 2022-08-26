# datacite

Akvaplan-niva datasets from DataCite's [REST API v2](https://api.datacite.org/).

## Edge services

Data services, powered by Deno [Deploy](https://deno.com/deploy):

- [meta](https://datacite.deno.dev/)
- [dois](https://datacite.deno.dev/dois)

HTTP server source code: [deploy.js](./deploy.js)

## Command line tool

Fetch Akvaplan-niva datasets into `dois`:

```sh
datacite_fetch_akvaplan
```

**Install** via local git:

```sh
git clone https://github.com/akvaplan-niva/datacite
cd datacite
deno install -f --allow-net=api.datacite.org --allow-write=./dois,meta.json datacite_fetch_akvaplan.js
```

Requires [Deno](https://deno.land) (>= v1.24).

### Dev

Start local development server:

```sh
deno task dev
```
