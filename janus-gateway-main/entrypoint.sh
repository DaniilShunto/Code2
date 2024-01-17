#!/bin/bash

# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

echo "===Janus RabbitMQ Helper==="
echo "RabbitMQ Connection Timeout: ${WAITTIMEOUT:-30} Sekunden"
echo "RabbitMQ Host: ${RABBITMQ_HOST:-"localhost"}"
echo "RabbitMQ Port: ${RABBITMQ_PORT:-5672}"
echo "RabbitMQ Username: ${RABBITMQ_USERNAME:-"guest"}"
echo "RabbitMQ VHost: ${RABBITMQ_VHOST:-"/"}"
echo "Janus exchange name: ${JANUS_EXCHANGE:-"janus-exchange"}"
echo "Janus exchange type: ${JANUS_EXCHANGE_TYPE:-"fanout"}"
echo "Janus queue name: ${JANUS_QUEUE_NAME:-"janus-gateway"}"
echo "Janus incoming queue: ${JANUS_QUEUE_INCOMING:-"to-janus"}"
echo "Janus outgoing routing key: ${JANUS_ROUTING_KEY_OUTGOING:-"from-janus"}"
echo "Janus disable websocket transport: ${JANUS_DISABLE_WEBSOCKET:-"not set"}"
echo "Janus ICE network interface: ${JANUS_ICE_IF:-"eth0"}"
echo "Janus port range: ${JANUS_UDP_PORT_RANGE:-"20000-40000"}"
echo "Janus event loops: ${JANUS_EVENT_LOOPS:-"not set"}"
echo "Janus use ICE lite: ${JANUS_ICE_LITE:-"false"}"
echo "Janus ignore mDns candidates: ${JANUS_IGNORE_MDNS:-"false"}"

WAITTIMEOUT=${WAITTIMEOUT:-30}
RT=$((WAITTIMEOUT+1))

until echo 'exit' | telnet ${RABBITMQ_HOST:-"localhost"} ${RABBITMQ_PORT:-5672} &> /dev/null
do
  echo "Connection retry $((RT-WAITTIMEOUT)) unsuccessfull"
  sleep 1
  ((WAITTIMEOUT--))
  if [ "${WAITTIMEOUT}" -eq "0" ]; then
    echo 'Connection refused'
    exit 1
  fi
done

echo 'Connection successfull'

./make_janus_jcfg.sh
./make_rabbitmq_jcfg.sh
./make_pfunix_jcfg.sh

exec "$@"
