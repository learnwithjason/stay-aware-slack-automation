import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { parse } from "https://deno.land/x/xml@2.1.2/mod.ts";
import RssFeedItemsDatastore from "../datastores/rss_feed_items.ts";

type ParsedXmlFeed = {
  channel: {
    item: {
      title: string;
      link: string;
      pubDate: string;
      description: string;
      author?: string;
      "dc:creator"?: string;
    }[];
  };
};

/**
 * @see https://api.slack.com/automation/functions/custom
 */
export const CheckRssFeedsDefinition = DefineFunction({
  callback_id: "check_rss_feeds",
  title: "Check RSS Feeds",
  description: "Cycles through all RSS feeds and checks for new items.",
  source_file: "functions/check_rss_feeds.ts",
});

/**
 * I found this list of topic IDs for NPR that appears to still work
 * @see https://legacy.npr.org/api/mappingCodes.php
 */
const urls = [
  1032, // books
  1167, // climate
  1051, // diversions
  1053, // food
  1052, // humor / fun
  1045, // movies
  1143, // photography
  1048, // pop culture
  1026, // space
  1146, // strange news
  1019, // technology
  1039, // music
  1110, // music videos
].map((id) => `https://feeds.npr.org/${id}/rss.xml`);

export default SlackFunction(
  CheckRssFeedsDefinition,
  async ({ client }) => {
    /**
     * fetch in parallel
     * @see https://lwj.dev/blog/keep-async-await-from-blocking-execution/
     */
    const responses = await Promise.all(urls.map((url) => fetch(url)));

    if (responses.some((res) => !res.ok)) {
      return { outputs: {} };
    }

    const xmlArray = await Promise.all(responses.map((res) => {
      return res.text();
    }));

    // turn all the fetched feeds into a single array of news items
    const items = xmlArray.map((xml) => {
      const data = parse(xml) as { rss: unknown };
      const rss = data.rss as ParsedXmlFeed;

      return rss.channel.item.slice(0, 5);
    }).flat();

    /**
     * @see https://api.slack.com/automation/datastores
     */
    const savedItems = await client.apps.datastore.query<
      typeof RssFeedItemsDatastore.definition
    >({
      datastore: "RssFeedItems",
    });

    // empty the database for testing
    // savedItems.items.forEach(async (item) => {
    //   await client.apps.datastore.delete<
    //     typeof RssFeedItemsDatastore.definition
    //   >({
    //     datastore: "RssFeedItems",
    //     id: item.item_id,
    //   });
    // });

    // display up to 5 items, starting with the most recent
    const newItems = items.filter((item) => {
      const alreadyShared = savedItems.items.some(({ item_id }) =>
        item.link === item_id
      );

      return !alreadyShared;
    }).slice(-5);

    // bail if no new items have been published
    if (newItems.length < 1) {
      return { outputs: {} };
    }

    // save all the new items into the datastore so we don’t double post
    await Promise.all(newItems.map((item) => {
      return client.apps.datastore.put({
        datastore: "RssFeedItems",
        item: {
          feed_id: "npr", // hard-coding because I’m out of time
          item_id: item.link,
        },
      });
    }));

    // Slack formatting to post linked text
    const referenceLinks = newItems.map((item, index) => {
      return `<${item.link}|${index + 1}>`;
    }).join(", ");

    /**
     * use the client call so we can send blocks
     * @see https://api.slack.com/automation/apicalls
     */
    client.chat.postMessage({
      channel: "C062LD6BQAV",
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `New items from NPR have been published: ${referenceLinks}`,
          },
        },
        { "type": "divider" },
      ],
    });

    return { outputs: {} };
  },
);
