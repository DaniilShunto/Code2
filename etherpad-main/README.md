# OT-Etherpad

## Configured Plugins

This container has some required plugins preconfigured.

### ep_auth_session

Allows the controller to generate links that automatically set the user's session-cookie.

### ep_read_session

Custom plugin to create read-only sessions.

## API key

By default, etherpad looks for an `APIKEY.txt` in its working directory. When the file is not found, a random apikey is generated. This image requires you to set the api key either via the environment variable `EP_APIKEY` or by binding the `/opt/etherpad-lite/APIKEY.txt` file. `The entrypoint.sh` exits with an error when the api key is not configured.

## Preconfigured Settings

This image has the following settings pre-configured in the image, these should not be changed:

```bash
REQUIRE_AUTHENTICATION=true
REQUIRE_AUTHORIZATION=true
REQUIRE_SESSION=true
EDIT_ONLY=true
INSTALL_SOFFICE=true
SOFFICE=/usr/bin/soffice
```

## Deployment

Settings that should be configured when deploying etherpad

| Variable         | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `ADMIN_PASSWORD` | An optional admin password (no admin user will be created when this is not set)  |
| `TRUST_PROXY`    | Should be true if etherpad is run behind a reverse proxy                         |
| `EP_APIKEY`      | Shared secret between etherpad and deployed controllers (See [APIKEY](#api-key)) |

An extensive list of possible options can be found [here](https://etherpad.org/doc/v1.8.17/#index_options-available-by-default). Make sure the [preconfigured settings](#preconfigured-settings) are not overwritten.

## PDF export

The image contains a libreoffice installation, enabling exports to DOC/PDF/ODT formats.
