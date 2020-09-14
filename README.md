![Build status](https://github.com/c-m-hunt/club-tools/workflows/Build/badge.svg)

# Club Tools (`ct`)

## Overview
Building a library of functionality to help run a cricket club.

Current functionality:
* Search members
* Edit members 
* Send invoices for match subs
* View owed match subs
* View current league tables

## Requirements
* Play Cricket API access
* MongoDB access
* PayPal account with API configured

## Optional
* Slack Webhook (for notifications)
* MailChimp API key (for syncing members with mailing list)

## Setup
Create a file called `.env` and `.env.prod` in the root of the application. Add the following lines and sub in all of the fields:
```
PAYPAL_CLIENT_ID=xxxxxxx
PAYPAL_SECRET=xxxxxxx
PAYPAL_SANDBOX=0
PAYPAL_INVOICER_BUSINESS=My Club Name
PAYPAL_INVOICER_CONTACT=My Treasurer's name
PAYPAL_INVOICER_EMAIL=treasurer@club.com
PAYPAL_INVOICER_LOGO=https://link_to_logo

SLACK_FINAANCES_WEBHOOK=http://link/to/slack/webhook
SLACK_COMMAND_TOKEN=SLACK_COMMAND_TOKEN

PLAY_CRICKET_API_KEY=xxxxx
PLAY_CRICKET_SITE_ID=1234
PLAY_CRICKET_TEAMS=123,145,1232,6234
PLAY_CRICKET_DIVISIONS=235,74563

MAILCHIMP_API_KEY=xxxxx
MAILCHIMP_LIST_ID=xxxx

CLUB_DB_CONNECTION=mongodb://localhost:27017/admin
CLUB_DB_NAME=clubname
```

The main difference between `.env` and `.env.prod` should be the `PAYPAL_SANDBOX` value should be 1 on `.env`. This allows you to test.

## Build
```
yarn build
```
## Install
Install on MacOS. Builds and copies executable to `/usr/local/bin`.
```
yarn install:ct
```

Run from code on other platforms, replace `ct` with `yarn run:prod` after building.

## Functionality

### Help
```
ct help
```
Displays available commands and options

### Search and edit members
```
ct search <surname>
```
A list of members are displayed. You can then select a member to edit.

### Send invoices
```
ct subs
```
You will then be presented with a number of days to select matches from. Generally, the default 6 is sufficient.

Then select the match you wish to charge subs for. The app will map the scorecard from Play Cricket against the fee band in the database. To be charged subs, a player must have an email address and a fee band. Errors will be shown at this point if players can't be charged.

You will be shown a list of all players and their fees. All will be selected. If you do not want to charge all, follow the on-screen instructions on how to unselect.

### List unpaid subs
```
ct owing
```
Will display a list of owed match subs and a summary of how much each member owes.

## Todo
* Add new members
* Display all member fee bands
* Web front end (but need more motivation to do this. CLI works fine for my needs.)


## Authentication

https://developer.okta.com/blog/2019/02/14/modern-token-authentication-in-node-with-express