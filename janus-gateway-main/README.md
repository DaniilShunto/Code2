# OpenTalk Janus Gateway docker image

This repository contains the [janus-gateway](https://janus.conf.meetecho.com/) docker image used in the OpenTalk infrastructure.

# Environment variables

| Name                         | Default          | Description                                                                                                                                                 |
| ---------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WAITTIMEOUT`                | `30`             | Timeout (seconds) for the startup rabbitmq connectivity test                                                                                                |
| `RABBITMQ_HOST`              | `localhost`      | Host of the rabbitmq server                                                                                                                                 |
| `RABBITMQ_PORT`              | `5672`           | Port of the rabbitmq server                                                                                                                                 |
| `RABBITMQ_USERNAME`          | `guest`          | Username for rabbitmq authentication                                                                                                                        |
| `RABBITMQ_PASSWORD`          | `guest`          | Password for rabbitmq authentication                                                                                                                        |
| `RABBITMQ_VHOST`             | `/`              | Rabbitmq VHOST                                                                                                                                              |
| `JANUS_ADMIN_SECRET`         | `janusoverlord`  | Set the secret for the admin API                                                                                                                            |
| `JANUS_DISABLE_WEBSOCKET`    | -                | If set to ANY value: Disable websocket transport                                                                                                            |
| `JANUS_DISABLE_HTTP`         | -                | If set to ANY value: Disable http transport                                                                                                                 |
| `JANUS_ENABLE_IPV6`          | `true`           | Enable IPv6 support.                                                                                                                                        |
| `JANUS_EXCHANGE`             | `janus-exchange` | Exchange janus should create its queue in                                                                                                                   |
| `JANUS_EXCHANGE_TYPE`        | `fanout`         | Rabbitmq exchange_type can be one of the available types: direct, topic, headers and fanout                                                                 |
| `JANUS_QUEUE_NAME`           | `janus-gateway`  | Queue name for incoming messages (if set and `JANUS_EXCHANGE_TYPE` is topic/direct, to_janus will be the routing key the queue is bound to the exchange on) |
| `JANUS_QUEUE_INCOMING`       | `to-janus`       | Name of the queue for incoming messages if queue_name isn't set, otherwise, the routing key that queue_name is bound to                                     |
| `JANUS_ROUTING_KEY_OUTGOING` | `from-janus`     | Routing key of the message sent from janus                                                                                                                  |
| `JANUS_ICE_IF`               | `eth0`           | Network interface janus uses to collect ICE candidates for the WebRTC connection establishment                                                              |
| `JANUS_UDP_PORT_RANGE`       | `20000-40000`    | Janus UDP port range                                                                                                                                        |
| `JANUS_EVENT_LOOPS`          | -                | Override how many event loops janus should spawn                                                                                                            |
| `JANUS_ICE_LITE`             | `false`          | Use ICE lite                                                                                                                                                |
| `JANUS_IGNORE_MDNS`          | `false`          | Do not try to resolve mDNS candidates (should be `true` for every non-local-network) deployment                                                             |
| `JANUS_NAT_1_1_MAPPING`      | -                | In case you're deploying Janus on a server which is configured with a 1:1 NAT, you might want to also specify the public IP                                 |
