call npx webpack
type dist\index.js >> dist\temp.js
echo.#! /usr/bin/env node> dist\index.js
type dist\temp.js >> dist\index.js
del dist\temp.js
call npm i -g