import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Regras recomendadas para TypeScript e Node.js (sem Next.js)
      ...tseslint.configs.recommended.rules,
    },
  },
  
  // Arquivos a serem ignorados
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
  },
];