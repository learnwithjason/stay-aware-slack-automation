import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * @see https://api.slack.com/automation/datastores
 */
const RssFeedItemsDatastore = DefineDatastore({
  name: "RssFeedItems",
  primary_key: "item_id",
  attributes: {
    item_id: {
      type: Schema.types.string,
    },
    feed_id: {
      type: Schema.types.string,
    },
  },
});

export default RssFeedItemsDatastore;
