# ep_read_session

An etherpad plugin to create read-only sessions

## Usage

 This plugin 'proxies' the following api endpoints to handle read only sessions.
 When using this plugin, calls to the api routes:

 ```text
  /api/1/deleteGroup
  /api/1/deleteSession
 ```

 should be replaced with:

 ```text
 /readSession/deleteGroup
 /readSession/deleteSession
 ```

A read-only session can be created with the `/readSession/createReadSession` route. It takes the same parameters as the `/api/1/createSession` route.

## Necessary Etherpad options

The following options have to be set on the etherpad instance that uses this plugin:

```text
REQUIRE_AUTHENTICATION=true
REQUIRE_AUTHORIZATION=true
```
