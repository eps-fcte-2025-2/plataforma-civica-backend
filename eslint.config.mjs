import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
  
  {
    ignores: [
      // Dependencies
      'node_modules/**',
      'pnpm-lock.yaml',
      
      // Build outputs
      'dist/**',
      'build/**',
      'out/**',
      
      // Generated files
      'generated/**',
      '*.d.ts',
      
      // Environment files
      '.env*',
      
      // Docker files
      'Dockerfile',
      'docker-compose.yml',
      'docker-entrypoint.sh',
      
      // Prisma generated
      'prisma/migrations/**',
      
      // Logs
      'logs/**',
      '*.log',
      'npm-debug.log*',
      'pnpm-debug.log*',
      
      // Coverage directory
      'coverage/**',
      
      // IDE files
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',
      
      // OS generated files
      '.DS_Store',
      'Thumbs.db',
      
      // Config files
      '*.js',
      '*.mjs',
    ],
  }
);