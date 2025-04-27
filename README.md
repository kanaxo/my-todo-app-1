# my-todo-app-1

Trying to build a todo app from scratch

## Bundled with webpack

- To bundle code,
  - `npx webpack` OR
  - `npm run build`
- Configuration for webpack defined in `webpack.config.js`.
- Note that the assets are just copied over using CopyPlugin
- Note that html is copied over using HTMLWebpackPlugin. (Don't have to add
  script tags or css tags in html. Does it for you).
- Any changes in the code will need to be bundled before changes can be loaded
  in the browser

## To show in dev environment

- run either:
  - `serve dist` - serves the dist folder
  - `npm run start` - runs the command as defined in `package.json`:
    `npx webpack serve` - automatically loads browser when code changes
  - `npx webpack serve`

* Remember to bundle code before running the code
