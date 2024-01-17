// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import cjs from '@rollup/plugin-commonjs';
import { builtinModules } from 'module';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';

import pkg from './package.json';

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'index.ts',
    plugins: [
      ts({
        transpiler: 'swc',
      }),
      cjs(),
      terser(),
    ],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    external: [
      ...builtinModules,
      ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
      ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
      ...(pkg.peerDependencies == null ? [] : Object.keys(pkg.peerDependencies)),
      '@reduxjs/toolkit/query',
      '@reduxjs/toolkit/query/react',
    ],
  },
];
