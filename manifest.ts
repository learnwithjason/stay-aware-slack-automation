import { Manifest } from "deno-slack-sdk/mod.ts";
import CheckRssWorkflow from "./workflows/check_rss.ts";
import RssFeedItemsDatastore from "./datastores/rss_feed_items.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "slack-rss-checker",
  description: "A template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  workflows: [CheckRssWorkflow],
  outgoingDomains: ["feeds.npr.org", "www.npr.org"],
  datastores: [RssFeedItemsDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
