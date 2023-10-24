# Stay Aware (a Slack Automation)

I tend to be completely unaware of what’s going on in the world, and I need to be better about not getting my information from Twitter now that it seems to be... less trustworthy.

This is a Slack automation that pulls news from NPR in categories I want to stay updated on and shares new articles every hour.

It’s built with:

- NPR’s RSS feeds
- Slack automation:
  - Datastore to track which articles have already been shared
  - Scheduled trigger to run the workflow hourly
  - Custom function to fetch all the RSS feeds, compare to already shared items, and send new items to a given Slack channel

## FYI for local dev

Once you've set up the project using the steps below, running the CLI will register the trigger to run 5 seconds after it’s first added, then hourly.

When you make changes, restarting the CLI doesn’t re-add the trigger, so you have to delete and re-add it manually to test. (Alternatively, you could register a different type of trigger for testing manually, but I didn’t end up going that way.)

To remove/re-add the trigger:

```bash
# list all registered triggers
slack trigger list -a local -w YOUR_WORKSPACE_SLUG

# copy the trigger ID
# it will look something like this: Ft062F3D3PUK

# delete the trigger by its ID
slack trigger delete -a local -w YOUR_WORKSPACE_SLUG --trigger-id TRIGGER_ID_HERE

# restart the CLI, which will prompt you to re-add the trigger
slack run -a local -w YOUR_WORKSPACE_SLUG
```

> **NOTE:** the `-a local -w YOUR_WORKSPACE_SLUG` is optional. You’ll be prompted for these values if you don’t supply them. I found it was faster to have them in the command during development.

## Setup instructions

**Guide Outline**:

- [Stay Aware (a Slack Automation)](#stay-aware-a-slack-automation)
  - [FYI for local dev](#fyi-for-local-dev)
  - [Setup instructions](#setup-instructions)
  - [Setup](#setup)
    - [Install the Slack CLI](#install-the-slack-cli)
    - [Clone the Template](#clone-the-template)
  - [Running Your Project Locally](#running-your-project-locally)
  - [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
  - [Project Structure](#project-structure)
    - [`.slack/`](#slack)
    - [`datastores/`](#datastores)
    - [`functions/`](#functions)
    - [`triggers/`](#triggers)
    - [`workflows/`](#workflows)
    - [`manifest.ts`](#manifestts)
    - [`slack.json`](#slackjson)
  - [Resources](#resources)

---

## Setup

Before getting started, first make sure you have a development workspace where
you have permission to install apps. **Please note that the features in this
project require that the workspace be part of
[a Slack paid plan](https://slack.com/pricing).**

### Install the Slack CLI

To use this template, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

### Clone the Template

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-app -t learnwithjason/stay-aware-slack-automation

# Change into the project directory
$ cd my-app
```

## Running Your Project Locally

While building your app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Deploying Your App

Once development is complete, deploy the app to Slack infrastructure using
`slack deploy`:

```zsh
$ slack deploy
```

When deploying for the first time, you'll be prompted to
[create a new link trigger](#creating-triggers) for the deployed version of your
app. When that trigger is invoked, the workflow should run just as it did when
developing locally (but without requiring your server to be running).

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `datastores/`

[Datastores](https://api.slack.com/automation/datastores) securely store data
for your application on Slack infrastructure. Required scopes to use datastores
include `datastore:write` and `datastore:read`.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

## Resources

To learn more about developing automations on Slack, visit the following:

- [Automation Overview](https://api.slack.com/automation)
- [CLI Quick Reference](https://api.slack.com/automation/cli/quick-reference)
- [Samples and Templates](https://api.slack.com/automation/samples)
