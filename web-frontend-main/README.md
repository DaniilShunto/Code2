# OpenTalk-Web Monorepo

This includes:

- a fluent_conv fork [@opentalk/fluent_conv](packages/fluent_conv)
- a i18next-fluent fork [@opentalk/i18next-fluent](packages/i18next-fluent)
- the OpenTalk web client [@opentalk/opentalk](app)

# Getting Started

## Dependencies

You need a running controller (https://git.heinlein-video.de/heinlein-video/k3k-controller) and keycloak instance.

## Use the container image

To run the container, use a command similar to:

```bash
podman run --rm -p 8090:80 -e CONTROLLER_HOST=localhost:1234 -e BASE_URL=localhost:8090 -e OIDC_ISSUER =localhost:9101 -it git.heinlein-video.de:5050/heinlein-video/k3k-web-frontend:latest
```

or using docker:

```bash
docker run --rm -p 8090:80 -e CONTROLLER_HOST=localhost:1234 -e BASE_URL=http://localhost:8090 -e OIDC_ISSUER =localhost:9101 -it git.heinlein-video.de:5050/heinlein-video/k3k-web-frontend:latest
```

The frontend will then be available via http://localhost:8090

### Environment variables used in the container

| Variable Name            | Required | Default                                           | Description                                                                                                                                                                                           |
| ------------------------ | -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CONTROLLER_HOST          | yes      |                                                   | The hostname and port under which the controller is reachable, do not include http here.                                                                                                              |
| INSECURE                 | no       | false                                             | Whether the connections to the controller should be tls encrypted (http(s), ws(s)) WARNING! This is needed when connecting to a controller hosted on localhost without a TLS cert                     |
| BASE_URL                 | yes      |                                                   | Base URL of the frontend                                                                                                                                                                              |
| HELPDESK_URL             | yes      |                                                   | The URL to the helpdesk                                                                                                                                                                               |
| ERROR_REPORT_ADDRESS     | yes      |                                                   | An email address, where the error reports should be send                                                                                                                                              |
| IS_BETA_RELEASE           | no       | true                                              | This flag will show a beta badge for the application                                                                                                                                                  |
| BETA_BADGE_URL           | no       |                                                   | add a link to the Badge                                                                                                                                                                               |
| LIBRAVATAR_DEFAULT_IMAGE | no       | robohash                                          | defaultImage for the Avatar, possible values: '404', 'mm', 'monsterid', 'wavatar', 'retro', 'robohash', 'pagan'                                                                                       |
| OIDC_ISSUER              | yes      |                                                   | Authority URL (used for discovery using AUTHORITY/.well-known/openid-configuration) (Old name: KEYCLOAK_AUTHORITY)                                                                                    |
| OIDC_CLIENT_ID           | no       | Frontend                                          | Client ID for the Authorization Code flow                                                                                                                                                             |
| USER_SURVEY_URL          | no       |                                                   | To enable user feedback collection configure a collection URL. (optional) & API KEY                                                                                                                   |
| USER_SURVEY_API_KEY      | no       |                                                   | To enable user feedback collection configure a collection URL. (optional) & API KEY                                                                                                                   |
| NDT_SERVER               | yes      |                                                   | NDT Server to use for the test                                                                                                                                                                        |
| ACTIVE_FEATURES          | no       | { userSearch: true... }     | An object with boolean values to activate specific features, possible values are: |
| FEATURE_USER_SEARCH      | no       | { userSearch: true}                               | to enable dashboard feature of geting list of user for inviting them to the event |
| FEATURE_MUTE_USER        | no       | { muteUsers: true}                                | to enable moderator option to mute user / users |
| FEATURE_RESET_HANDRAISES | no       | { resetHandraises: true}                          | to enable moderator option to reset users' raised hands |
| FEATURE_ADD_USER         | no       | { addUser: false}                                 | under construction |
| JOIN_WITHOUT_MEDIA       | no       | { joinWithoutMedia: false}                        | if is set to true, it will prevent user to join conference with audio/video on |
| VIDEO_BACKGROUNDS        | no       | []                                                | An array with a configuration of the background (Example: `[{ altText: 'OpenTalk', url: '/assets/videoBackgrounds/elevate-bg.png', thumb: '/assets/videoBackgrounds/thumbs/elevate-bg-thumb.png',}]`) |
| SIGN_OUT_REDIRECT_URI    | no       | /dashboard                             | Uri to redirect the client after signing out
frontend                                                                                                                                                                        |
| CHANGE_PASSWORD_ACTIVE           | no       | false                              | enable the reset password button in the dashboard profile settings |
| CHANGE_PASSWORD_URL       | no       | null                               | set the reset password url for password button in dashboard profile settings |
| FEATURE_SHARED_FOLDER           | no       | false                              | enable the shared folder feature |
| IMPRINT_URL             | no      |                                                   | The URL to the imprint page |
| DATA_PROTECTION_URL             | no      |                                                   | The URL to the data protection page |
| ACCOUNT_MANAGEMENT_URL             | no      |                                                   | The account management url for use the dashboard menu, if provider.active is true |
| DISALLOW_CUSTOM_DISPLAY_NAME  | no  | false                                             | Disable editing of display name in profile and lobby page |
| SENTRY_DSN  | no  |                                              | Adding a valid sentry dsn will activate error logging |

## Use yarn to build a local version

You will need yarn and node installed on your system.

Run `yarn && yarn build`

Place the following file with correct values into app/public/config.js, without the comments

```
window.config = {
    // The hostname and port under which the controller is reachable, do not include http here.
    "controller": "localhost:8000",
    // Whether the connections to the controller should be tls encrypted (http(s), ws(s))
    "insecure": true,
    // Base URL of the frontend
    "baseUrl": "http://localhost:3000",
    // OIDC Config
    beta: {
      isBeta: '${IS_BETA_RELEASE:-true}', // show Badge
      badgeUrl: "${BETA_BADGE_URL}" // add a link to the Badge
    },
    provider: {
      // indicates if we are are in the provider context
	    active: false, 
      // The account management url for the dashboard menu, if active is true
	    accountManagementUrl: '${ACCOUNT_MANAGEMENT_URL}',
    },
    // defaultImage for the Avatar, possible values: '404', 'mm', 'monsterid', 'wavatar', 'retro', 'robohash', 'pagan',
    "libravatarDefaultImage": 'robohash',
    // disable edditing the display name field in the dashboard profile and lobby page
    disallowCustomDisplayName: '${DISALLOW_CUSTOM_DISPLAY_NAME}',
    // OIDC Config
    "oidcConfig": {
        // Authority URL (used for discovery using AUTHORITY/.well-known/openid-configuration)
        "authority": "https://keycloak.local/auth/realms/K3K",
        // Client ID for the Authorization Code flow
        "clientId": "Frontend",
        // Scope
        "scope": "openid profile email",
        // Path under the base_url to which the OP redirects after sign out
        "signOutRedirectUri": "/dashboard",
        // Path under the base_url to which the OP redirects
        "redirectPath": "/auth/callback",
        // Path under the base_url to which the OP redirects in a popup
        "popupRedirectPath": "/auth/popup_callback",
    },
    // Flag and Url to the authority to change the own password
    changePassword: {
        active: true,
        url: '/my-test-change-password-url'
    },
    // Speed-Test configuration, see also https://github.com/m-lab/ndt7-js and https://www.measurementlab.net/blog/ndt7-introduction/
    "speedTest": {
      // NDT Server to use for the test
      "ntdServer": 'localhost:10443',
      // js worker file to use for the download test
      "ntdDownloadWorkerJs": '/workers/ndt7-download-worker.js',
      // js worker file to use for the upload test
      "ntdUploadWorkerJs": '/workers/ndt7-upload-worker.js',
    },
    // To enable user feedback collection configure a collection URL. (optional) & API KEY
    "userSurveyUrl":"https://your-survey.collection/endpoint",
    "userSurveyApiKey: 'api_key',
    "videoBackgrounds": [
      {
        altText: 'OpenTalk',
        url: '/assets/videoBackgrounds/elevate-bg.png',
        thumb: '/assets/videoBackgrounds/thumbs/elevate-bg-thumb.png',
      },
    ],
    // Configure the maximum video bandwidth.
    "maxVideoBandwidth":600000,
    "errorReportAddress": 'report@opentalk.eu',
    // Activate error logging for frontend
    glitchtip: {
      dsn: '${SENTRY_DSN}',
    },
    // Available moderator's features, can be enabled by setting feature to true
    "features": {
      "userSearch": true,
      "muteUsers": true,
      "resetHandraises": true,
      "addUser": true,
      "joinWithoutMedia": false,
      "sharedFolder": false,
    }
}

```

After that you need a webserver to serve the files from the /app/dist directory.

# Development

## To install & run

Instead of `npm` we use `yarn`.

To install all dependencies run: `yarn` in this project directory.
Yarn should be included in all recent node versions.
If you run ubuntu you might have a very old node version installed. Use node version manager (`nvm`) to install a more recent version (>v14.0.0)

After that you can run `yarn start`, see further down.

You need to add the same config to app/public/config.js as in the Step `Use yarn to build a local version` (See futher up)

## Guidelines

This repository is a monorepo. Libraries here are considered unstable and their inclusion should ease their development.
Libraries, except the app, will be moved to a separate repository and released to NPM once they are mature enough.

### Development

`@opentalk` packages/libraries are not a part of the app. Therefore the default hot reload mechanism will not work for changes you make there.
If you work on a package and want to speed-up the development by using hot reload, you need additional setup on your local system.
For details, please refer to the `app/hotReload/Instructions.md` manual.


#### Commands

In this directory, you can run:

### `yarn start`

Builds libraries and calls `yarn start` in `@opentalk/opentalk`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits in the app.\
You will also see any lint errors in the console.
If you plan to modify one of the libraries in this monorepo, execute a watcher inside of that library. See [Development](Development) for details information how to that.

### `yarn start:hot`

Similar to `yarn start` with extended hot reload functionality for the `@opentalk` packages.
For details, please refer to the `app/hotReload/Instructions.md` manual.

### `yarn test`

Builds libraries and calls `yarn test` in `@opentalk/opentalk`
Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds libraries and calls `yarn build` in `@opentalk/opentalk`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build:profiler`

Builds libraries and calls `yarn build:profiler` in `@opentalk/opentalk`, this build 
can be used for profiling the application. 

## Build the container image

The `Dockerfile` for the app is located in `ci/Dockerfile`.

To build the image, execute in the root of the repository:

```bash
 docker build -f ci/Dockerfile . --tag <your tag>
```

## Git Hooks and Continuous Integration

In `example/git_hooks/` there are pre-commit git hooks that mimic the projects CI-pipeline.

There are two flavors:

- **Fancy** -- Install the [pre-commit tool](https://pre-commit.com) and use it with our CI config:

```bash
cp example/git_hooks/.pre-commit-config.yaml ./
pre-commit install
```

- **Old School** -- Activate it by copying

```bash
cp example/git_hooks/pre-commit .git/hooks/
```
