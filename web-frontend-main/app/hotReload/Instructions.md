## Configuration

Create a file `./packages.tsconfig.json` inside hotReload directory (you can reuse `./packages.tsconfig.example.json`)
and insert all the packages you want to be hot reloaded and their paths on your machine.

e.g.

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@opentalk/components": ["../../../components"],
      "@opentalk/common": ["../../packages/common"]
      // ... insert more, if you like
    }
  }
}
```

IMPORTANT: Please ensure, that `"@opentalk/components"` path match the exact location to the `@opentalk/components` folder on your machine.

For now avaliable packages for hot reload are:

1. @opentalk/common
2. @opentalk/components
3. @opentalk/rest-api-rtk-query
4. @opentalk/react-redux-appauth

### @opentalk/components specific

1. Match @opentalk/common version in your local components library

- go to your local @opentalk/components/package.json
- modify devDependency version of @opentalk/common to match your local latest version (monorepo/packages/common/package.json)
- install the updated dependency

```bash
   yarn install
```

2. Delete all build files in your local @opentalk/components (/dist - folder)

```bash
   rm -rf dist
```

3. run the frontend app

```bash
   yarn start:hot
```
