// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts');
const { terser } = require('rollup-plugin-terser');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const url = require('@rollup/plugin-url');
const svgr = require('@svgr/rollup');
const pkg = require('./package.json');
const path = require('path');

const dist = path.resolve(__dirname, './dist');

module.exports = [
  {
    input: 'index.ts',
    output: [
      {
        file: path.resolve(dist, 'cjs', 'index.development.js'),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: path.resolve(dist, 'esm', 'index.development.js'),
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      url(),
      svgr({ icon: true }),
    ],
    external: Object.keys(pkg.peerDependencies),
  },
  {
    input: 'index.ts',
    output: [
      {
        file: path.resolve(dist, 'cjs', 'index.production.js'),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: path.resolve(dist, 'esm', 'index.production.js'),
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
      typescript({ tsconfig: './tsconfig.json' }),
      url(),
      svgr({ icon: true }),
    ],
    external: Object.keys(pkg.peerDependencies),
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
  },
];
