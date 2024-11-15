// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import packagejson from "./package.json";

Sentry.init({
  dsn: "https://b4dd90dd2b201ab51966454ddc9d2030@o4508296269594624.ingest.us.sentry.io/4508296272609280",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  release: packagejson.version,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
});
