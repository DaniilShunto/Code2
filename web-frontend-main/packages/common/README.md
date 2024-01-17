<!--
SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>

SPDX-License-Identifier: EUPL-1.2
-->

# Opentalk common components and types

This includes:

- All common component that are used in the main application and the modules
- All common types and interfaces
- Common utility functions and helpers
- Common assets

## Requirments

> ```node >= 17.5```

# Getting Started

## Installing

> yarn - `yarn add @opentalk/common`

> npm - `npm i @opentalk/common`

- In order to install the package you need to add the `npmRegistryServer` property in the `yarnrc.yml` file:

```
npmScopes:
  @scope:
    npmRegistryServer: https://your_domain_name/api/v4/projects/<project_id>/packages/npm/
```

Read more: https://docs.gitlab.com/ee/user/packages/npm_registry/

## Usage

- Importing AccordionItem as React component and Add icon as an asset

`import {AccordionItem, AddIcon} from '@opentalk/common'`

## Development

This library includes common components and types. All components are inside /components folder in the root of the application.

# Components

When creating a new component in the /component folder, the component should be also imported and re-exported in /component/index.ts file as a named export.

# Types

All types and interfaces that are used in the main application and the module libraries are considered to be common types and are included in this library.
They can be found in the /types folder as barrel files which are then expored in the /types/index.ts.

# Provider

For now component provider is not used, but it's there in case there are situations when we want to prevent prop drilling.

# Ambient Modules

Ambient modules is a TypeScript feature that allows importing libraries written in JavaScript and using them seamlessly and safely as if they were written in TypeScript.
An ambient declaration file is a file that describes the module’s type but doesn’t contain its implementation. Ambient declaration files are not transpiled, so they are not converted to JavaScript.

For now we have SVG, DateTimeFormat, StatelessComponent and mui themes ambient modules implementation.

## Assets

# 1. Create components

`createIconComponents.sh` generates `.tsx` components from your SVGs in `assets/icons/source`.

**Run `cd ${projectPath}/src/assets/icons/source`**.

From there **run `../helpers/createIconComponents.sh`.**

This will create a bunch of components in `assets/icons`.

# 2. Create index

`createIconIndex.sh` updates your `assets/icons/index.ts`. That means, in order to execute the script, an empty `index.ts` has to exist. The script adds _imports_ for all `IconComponents.tsx` in `assets/icons` and the exports them as modules. If the `index.ts` was not empty for some reason, you might end with duplicate entries.

**Run `cd ${projectPath}/src/assets/icons`** to go to where the `index.ts` lives.

From there **run `./helpers/createIconComponents.sh`.**

## Deployment

`yarn build`

After finishing the development phaze we need to build the distribution files.
This library uses rollup.js and all configuration can be found in /rollup.config.js.

For building a production version you can use `yarn build`.

(In case of need for a types build there are also `yarn build-ts` (for esm and cjs types build), or `yarn build:esm` and `yarn build:cjs` for building types accordingly).

## Publihing to the gitlab npm

In order for the package to be published, `package.json` needs to contain following publishing congif:

```
"publishConfig": {
      "access": "restricted",
      "@scope:registry": "https://your_domain_url/api/v4/projects/<project_id>/packages/npm/"
   }
```

Read more about publishing a package in gitlab: https://docs.gitlab.com/ee/user/packages/npm_registry/

## Deploying new npm version

When deploying new npm version it's important to update package.json version number. If the package version remains the same, new npm package wouldn't be created.

- old package.json:
```{
  "name": "@opentalk/common",
  "author": "John Doe",
  "version": "1.0.0" }
  ```
- new package.json:
```{
  "name": "@opentalk/common",
  "author": "John Doe",
  "version": "1.0.1" }
  ```
