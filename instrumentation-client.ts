import posthog from "posthog-js";
import { initSDK } from "@embrace-io/web-sdk";
import { vemetric } from '@vemetric/web';

if (process.env.NODE_ENV !== "development") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    //debug: process.env.NODE_ENV === "development",
  });
  initSDK({
    appID: process.env.NEXT_PUBLIC_EMBRACE_APP_IDD!,
  });
  vemetric.init({
    token: process.env.NEXT_PUBLIC_VEMETRIC_TOKEN!,
    scriptUrl: '/_v_script.js',
    host: '/_v',
    trackPageViews: true,
    trackOutboundLinks: true,
    trackDataAttributes: true,
  });
}
