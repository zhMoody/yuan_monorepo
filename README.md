## 开始

- node > 14

```js
 pnpm
install
```

## 使用技术栈

- vue3
- Typescript
- Pinia
- vue-route4
- pinia-plugin-persistedstate pinia持久化
- 动画库
  - nprogress 进度条
  - wow.js js动画
  - animate.css css动画
- store localstorage本地存储
- axios 请求
- vue3-lazy 图片懒加载

- @vicons/ionicons5 icon图标
- md-editor-v3 md文档编辑器


- package.json

```json

{
  "name": "vue3tstemplate",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "preview": "vite preview --port 3222"
  },
  "dependencies": {
    "animate.css": "^4.1.1",
    "axios": "0.21.1",
    "current-device": "0.10.2",
    "dayjs": "^1.11.7",
    "lodash": "4.17.21",
    "md-editor-v3": "2.8.0",
    "mitt": "2.1.0",
    "nprogress": "0.2.0",
    "pinia": "^2.0.23",
    "pinia-plugin-persistedstate": "^3.0.2",
    "screenfull": "5.1.0",
    "store": "2.0.12",
    "ua-parser-js": "0.7.28",
    "vue": "^3.2.41",
    "vue-router": "4.0.11",
    "vue3-lazy": "1.0.0-alpha.1",
    "wow.js": "^1.2.2"
  },
  "devDependencies": {
    "@sicons/ionicons5": "^0.12.0",
    "@types/node": "^18.11.7",
    "@types/nprogress": "^0.2.0",
    "@types/store": "^2.0.2",
    "@types/ua-parser-js": "^0.7.36",
    "@typescript-eslint/eslint-plugin": "^5.41.0",
    "@typescript-eslint/parser": "^5.41.0",
    "@vicons/ionicons5": "^0.12.0",
    "@vicons/utils": "^0.1.4",
    "@vitejs/plugin-vue": "^3.2.0",
    "autoprefixer": "^10.4.13",
    "eslint": "^8.26.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-define-config": "^1.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-vue": "^9.6.0",
    "less": "^4.1.3",
    "less-loader": "^11.1.0",
    "naive-ui": "^2.34.3",
    "postcss": "^8.4.18",
    "postcss-cli": "^10.0.0",
    "postcss-import": "^15.0.0",
    "postcss-pxtorem": "^6.0.0",
    "prettier": "^2.7.1",
    "stylelint": "^14.14.0",
    "stylelint-config-prettier": "^9.0.3",
    "stylelint-config-recess-order": "^3.0.0",
    "stylelint-config-standard": "^29.0.0",
    "typescript": "^4.6.4",
    "vfonts": "^0.0.3",
    "vite": "^3.2.0",
    "vite-plugin-compression": "^0.3.5",
    "vite-plugin-svg-icons": "^2.0.1",
    "vue-tsc": "^1.0.9"
  }
}

```

- vite-config.ts

```js
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import {resolve} from "path";
import postcssImport from "postcss-import";
import {defineConfig, loadEnv} from 'vite';
import viteCompression from 'vite-plugin-compression';
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default ({mode}) => {
  return defineConfig({
    plugins: [
      vue(),
      viteCompression(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    css: {
      preprocessorOptions: {
        javascriptEnabled: true,
        additionalData: `@import "${resolve(__dirname, 'src/styles/reset.less')}";`,
      },
      postcss: {
        plugins: [postcssImport, autoprefixer]
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      }
    },
    build: {
      // 清除console和debugger
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      //警报门槛，限制大文件大小
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          //对静态文件进行打包处理（文件分类）
          //此处打开后会导致背景图路径有问题，所以暂时隐藏，未找到合适的解决方案
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        }
      },
    },
    server: {
      open: true,
      port: 2333,
      proxy: {
        '^/api': {
          target: 'http://localhost:5021/api', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    base: loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH
  })
}

```



