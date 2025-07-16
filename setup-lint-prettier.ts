const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 要安装的依赖
const devDependencies = [
  'eslint',
  'prettier',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-plugin-react',
  'eslint-plugin-import',
  '@commitlint/cli',
  '@commitlint/config-conventional',
  'husky',
  'lint-staged',
];

// 生成 ESLint 配置文件
const eslintConfig = {
  env: {
    browser: true, // 设置为浏览器环境，定义了一些全局变量，如 window 和 document。
    es2021: true, // 启用 ES2021 语法特性。
    node: true, // 设置为 Node.js 环境，定义了一些全局变量，如 module 和 process。
    jest: true, // 设置为 Jest 测试环境，定义了一些全局变量，如 test 和 expect。
  },
  extends: [
    'eslint:recommended', // 使用 ESLint 推荐的默认规则。
    'plugin:react/recommended', // 使用 react 插件推荐的规则，适用于 React 项目。
    'plugin:import/errors', // 使用 import 插件的错误规则，帮助管理和检查 ES6 导入语句。
    'plugin:import/warnings', // 使用 import 插件的警告规则，帮助管理和检查 ES6 导入语句。
    'plugin:prettier/recommended', // 使用 Prettier 推荐的规则，以解决与 ESLint 规则的冲突，确保代码格式一致。
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // 启用 JSX 语法特性，适用于 React 项目。
    },
    ecmaVersion: 2021, // 设置 ECMAScript 语法版本为 2021。
    sourceType: 'module', // 指定代码使用 ES 模块。
  },
  plugins: [
    'react', // 启用 react 插件，帮助管理和检查 React 代码。
    'import', // 启用 import 插件，帮助管理和检查 ES6 导入语句。
    'prettier', // 启用 prettier 插件，以确保代码格式一致。
  ],
  rules: {
    'prettier/prettier': ['error'], // 强制执行 Prettier 的代码格式规则，若不符合则报错。
    'react/prop-types': ['off'], // 禁用 React 的 prop-types 校验规则。
    'react/react-in-jsx-scope': 'off', // 在 React 17 中，禁用必须在 JSX 中使用 React 的规则。
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'ignore',
      },
    ],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }], // 引入文件时可以忽略这些文件格式的后缀
    'no-unused-vars': 'warn', // 对未使用的变量发出警告。
  },
  settings: {
    react: {
      version: 'detect', // 自动检测已安装的 React 版本。
    },
    'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
  },
};

// 生成 Prettier 配置文件
const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'auto',
};

// 生成 commitlint 配置文件
const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复问题
        'docs', // 文档变更
        'style', // 代码格式（不影响功能）
        'refactor', // 代码重构（不包含修复或新特性）
        'perf', // 性能优化
        'test', // 添加或修改测试
        'build', // 构建系统或外部依赖变更
        'ci', // 持续集成配置
        'chore', // 其他杂项
        'revert', // 恢复上一个提交
      ],
    ],
    'scope-enum': [
      2,
      'always',
      ['core', 'ui', 'docs', 'tests'], // 自定义的影响范围
    ],
    'subject-case': [0, 'never', ['sentence-case']], // 关闭主题大小写规则
    'header-max-length': [2, 'always', 72], // 限制提交描述的最大长度
  },
};

// 写入配置文件
fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));
fs.writeFileSync('.prettierignore', 'node_modules\nbuild\n.env\nyarn.lock\npackage-lock.json\npublic');
fs.writeFileSync('.commitlintrc.json', JSON.stringify(commitlintConfig, null, 2));

// 安装依赖
const installDeps = `npm install --save-dev --f ${devDependencies.join(' ')}`;
execSync(installDeps, { stdio: 'inherit' });

// 初始化 Husky
execSync('npx husky install', { stdio: 'inherit' });

// 创建 pre-commit 钩子
const preCommitScript = 'npm run lint-staged';
fs.writeFileSync(path.join('.husky', 'pre-commit'), `${preCommitScript}\n`);
fs.chmodSync(path.join('.husky', 'pre-commit'), '755');

// 创建 commit-msg 钩子
const commitMsgScript = 'npm run commitlint "$1"';
fs.writeFileSync(path.join('.husky', 'commit-msg'), `${commitMsgScript}\n`);
fs.chmodSync(path.join('.husky', 'commit-msg'), '755');

console.log('Husky hooks created successfully!');

// 读取 package.json 文件
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// 添加 scripts 配置
packageJson.scripts = {
  ...packageJson.scripts,
  lint: 'eslint . --fix',
  prettier: 'prettier --write .',
  prepare: 'husky install',
  'lint-staged': 'lint-staged',
  commitlint: 'commitlint --edit',
};

// 添加 lint-staged 配置
packageJson['lint-staged'] = {
  '*.js': ['eslint --fix', 'prettier --write', 'git add'],
  '*.jsx': ['eslint --fix', 'prettier --write', 'git add'],
  '*.css': ['prettier --write', 'git add'],
};

// 写入更新后的 package.json 文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('ESLint 和 Prettier 配置完成！');
