import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { CheckRssFeedsDefinition } from "../functions/check_rss_feeds.ts";

/**
 * @see https://api.slack.com/automation/workflows
 */
const CheckRssWorkflow = DefineWorkflow({
  callback_id: "check_rss_workflow",
  title: "Keep Up With RSS Feeds",
  description:
    "Checks one or more RSS feeds for new items and displays them in a target channel.",
  input_parameters: {
    properties: {},
    required: [],
  },
});

/**
 * @see https://api.slack.com/automation/functions/custom
 */
CheckRssWorkflow.addStep(CheckRssFeedsDefinition, {});

export default CheckRssWorkflow;
