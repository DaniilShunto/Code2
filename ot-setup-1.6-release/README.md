# OpenTalk deployment (lite)

[[_TOC_]]

This guide will take you through a quick installation to run a simple OpenTalk installation for a **small** setup on your own server. Be sure, that your network, firewall, domain names and certificates are configured properly before you start the OpenTalk services.

## Prepare your deployment environment

To run an OpenTalk instance, we assume that a certain infrastructure configuration already exists.
Please ensure, that the following resources are prepared.

### Note for existing installations

Starting with product version 1.4, the directory structure has changed. The 'lite' directory is no longer used. If necessary, move persistent data from `./lite/data/*` to `./data/``

### Server

We recommend a virtual machine with a minimum configuration of:

- CPU: 2 Cores
- RAM: 4GB
- HDD: 20GB
- 1 public network interface
- 1 private network interface

Installed with a Linux distribution of your choice.

### Services

To run OpenTalk with this deployment method, you need to have the `docker engine` and the plugin `compose` to be installed.
Please refer to the official documentation for **[docker engine](https://docs.docker.com/engine/install)** and the **[docker compose plugin](https://docs.docker.com/compose/install/linux)**.

We define the running application stack via a `docker-compose.yaml` file and we use the feature **[profiles](https://docs.docker.com/compose/profiles/)** to handle different deployment scenarios.

In the current state, the configuration that is ready to use out-of-the-box, covers the services tagged with the profile `core`.

| Service      | core      |
|--------------|-----------|
| Keycloak     | X         |
| postgresql   | X         |
| autoheal     | X         |
| rabbitmq     | X         |
| redis        | X         |
| web-frontend | X         |
| controller   | X         |
| minio        | X         |
| janus-gateway| X         |
| obelisk      |           |
| smtp-mailer  |           |
| spacedeck    |           |
| etherpad     |           |
| recorder     |           |

Of course, you can **extend** the OpenTalk lite setup to run all services available in the `docker-compose.yaml` file. However, this requires further configuration steps that are not part of this quick install guide. We will provide instructions for an extended setup later.

### open Firewall ports

Ensure, that the ports `80/tcp`, `443/tcp` and `20000-25000/udp` are opened in your firewall and accessible from public.

### DNS records

OpenTalk consists of several services. To make them work together, some services need a specific DNS record.
If your domain is for example `example.com`, you have to create the following DNS records and point them to your public IP-address.

- example.com (OpenTalk Web-UI)
- accounts.example.com (Keycloak instance)
- controller.example.com (OpenTalk controller service)

### Reverse-Proxy and SSL certificates

Get valid SSL certificates for your DNS records at the certificate authority of your choice. We recommend using [letsencrypt](https://letsencrypt.org/) in combination with [certbot](https://certbot.eff.org/) for this purpose.

Set up a reverse proxy that terminates the SSL connections and forward the requests to the appropriate OpenTalk upstream services.
When you use the default ports, the services listen on the following ports on the local interface:

- frontend:    localhost:8080
- controller:  localhost:8090
- keycloak:    localhost:8087

We recommend using nginx as reverse-proxy. Please refer the [official nginx documentation](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for further information.

As an inspiration, we provide configuration examples in the directory `./extras/nginx-samples`. Customize it to your needs.

## Setup OpenTalk services

### Clone the `ot-setup` repository

Clone the git repository to a location of your choice. Since we are using directory based docker volumes in this deployment guide, make sure there is enough storage on that location. We recommend using `/opt/opentalk` for this.

```bash
git clone https://gitlab.opencode.de/opentalk/ot-setup.git /opt/opentalk
```

Change to the root of this repository, and use it as base directory for the next steps.

```bash
cd /opt/opentalk
```

### Prepare `docker compose` configuration

Create a `.env` file from the provided `.env.sample`. The `.env` file is used to configure the OpenTalk services deployed by `docker compose`.

```bash
cp env.sample .env
```

### Prepare the controller configuration

Create the controller configuration from the sample file `controller.toml.sample` located in `config/` directory.

```bash
cp config/controller.toml.sample config/controller.toml
```

#### Edit the `.env` file settings

Customize the variables in `.env` according to your needs. In most cases, it is sufficient to adjust the values listed under `common variables`. You should always leave the `docker-compose.yaml` file unchanged to have an easier update process in future.

##### OPTIONAL: generate secrets with the `gen-common-params.sh` helper script

To simply copy+paste the secrets into the .env file, you might find this helpful.

**NOTE**: The script needs to have the package `pwgen` installed!

```bash
bash extras/gen-common-params.sh
```

It produces an output that you can use to replace the header area in the `.env` file.

**Sample output:**

```bash
###---> Common variables
# Domain name on wich you want to access the frontend
OT_DOMAIN=example.com

POSTGRES_PASSWORD=zohWahnieceequairaiwee4k
KEYCLOAK_ADMIN_PASSWORD=Ce4Xae8shaih9oghee1iehei
KC_CLIENT_SECRET=ooleic2aewai5chiC9jae6iu 

# If janus is running in docker host mode it needs a local host interface for rabbitmq to connect.
# Use only a SINGLE line and uncomment it:
# !!! DO NOT CHOOSE YOUR PUBLIC IP ADDRESS!!!
# RABBITMQ_HOST=20.30.40.50
# RABBITMQ_HOST=10.0.1.2
# RABBITMQ_HOST=172.17.0.1
# RABBITMQ_HOST=192.168.0.1
###<---
```

#### Edit the config/controller.toml configuration file

Replace the placeholders in the `controller.toml` with the same values as you have already set in the `.env` file.

```bash
vi config/controller.toml
```

Change the values for the configuration options:

```txt
[database]/url              (placeholder: MyPostgresPW)
[http]/cors.allowed_origin  (placeholder: MyOtDomain)
[keycloak]/base_url         (placeholder: MyOtDomain)
[keycloak]/client_secret    (placeholder: MyKcClientSecret)
```

### Run the OpenTalk stack

```bash
docker compose up -d
```

## Post installation tasks

After your configuration has been finished and the services are up and running, you probably want to create users to login into your new OpenTalk installation. We use Keycloak for the user management. You can find documentation about user management in Keycloak in the official [Keycloak administration](https://www.keycloak.org/docs/latest/server_admin/#assembly-managing-users_server_administration_guide) guide.

### Log in to Keycloak web interface and create users for OpenTalk

By default, the Keycloak web interface for OpenTalk is available at e.g. `https://accounts.example.com/auth`.
Use the credentials `admin` and the password, that you have defined with `KEYCLOAK_ADMIN_PASSWORD` the `.env` file.

After login to Keycloak administration, switch to the **realm** `opentalk` and create a new user with the default role `default-roles-opentalk`. As reference you can refer the `testuser` provided for demo purposes. You can also `enable` the testuser and reset the password for testing OpenTalk.

### Log in to your OpenTalk instance

If you have successfully created an OpenTalk user, you can now use it to log in to your new OpenTalk installation.
By default, the OpenTalk web interface is available at the root of your domain e.g. `https://example.com`.
