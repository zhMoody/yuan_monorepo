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
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL, // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    base: loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH
  })
}
