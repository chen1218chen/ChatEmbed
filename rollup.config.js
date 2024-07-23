import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

const extensions = ['.ts', '.tsx'];

const isProduction = process.env.NODE_ENV === 'production';

const indexConfig = {
  plugins: [
    resolve({ extensions, browser: true }),
    commonjs(),
    uglify(),
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['solid', '@babel/preset-typescript'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    terser({ output: { comments: false } }),
    /* If you want to see the live app*/
    serve({
      open: true,
      verbose: true,
      contentBase: ['dist'],
      host: 'localhost',
      port: 56789,
    }),
    livereload({ watch: 'dist' }),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: './src/web.ts',
    output: {
      format: 'umd',
      name: 'web', // 如果format是umd, name必填否则报错
      file: 'dist/web.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
      // banner: Global
    },
  },
];

export default configs;
