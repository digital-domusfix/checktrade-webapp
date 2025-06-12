import { FlatCompat } from '@eslint/eslintrc';
import eslintrc from './.eslintrc.cjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default compat.config(eslintrc);
