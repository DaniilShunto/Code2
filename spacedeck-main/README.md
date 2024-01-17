# OpenTalk SpaceDeck image

A custom spacedeck image for an OpenTalk deployment.

## Image changes

- Allows to configure spacedeck via environment variables
- Adds config options to configure a controller-user with a configured API token

## Configure API-token

Spacedeck has no global API token, instead, each spacedeck user can configure an API token for their account.
When set as the value of the `X-Spacedeck-API-Token` header, a user's API token can be used to authenticate API requests.

This image will create a controller-user on startup when the `SD_API_TOKEN` environment variable is set.

The user's mail address is fixed to `controller@localhost`. The password and API token are the value of `SD_API_TOKEN`.
