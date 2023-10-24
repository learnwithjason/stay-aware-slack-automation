import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import CheckRssWorkflow from "../workflows/check_rss.ts";

/**
 * @see https://api.slack.com/automation/triggers
 */
const checkRssTrigger: Trigger<typeof CheckRssWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Check RSS feed",
  description: "Trigger checking an RSS feed on a regular schedule",
  workflow: `#/workflows/${CheckRssWorkflow.definition.callback_id}`,
  schedule: {
    start_time: new Date(new Date().getTime() + 5 * 1000).toISOString(),
    end_time: "2037-12-31T23:59:59Z",
    frequency: {
      type: "hourly",
      repeats_every: 1,
    },
  },
};

export default checkRssTrigger;
