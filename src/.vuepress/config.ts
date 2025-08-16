import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'
import theme from "./theme.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineUserConfig({
  base: "/interview/",

  // bundler: viteBundler({
  //   viteOptions: {
  //     resolve: {
  //       alias: {
  //         '@images': resolve(__dirname, 'public/images')
  //       }
  //     },
  //     build: {
  //       rollupOptions: {
  //         external: (id) => {
  //           return (
  //             // 使用相对路径匹配图片
  //             /\.(png|jpe?g|gif|svg|webp)$/.test(id) ||
  //             // 同时忽略临时文件验证 (重要!)
  //             id.endsWith('.html.vue')
  //           );
  //         }
  //       }
  //     },
  //     // 明确指定公共目录
  //     publicDir: resolve(__dirname, 'public'),
  //     // 添加资源处理配置
  //     assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp']
  //   },
  // }),

  locales: {
    "/": {
      lang: "zh-CN",
      title: "老马啸西风",
      description: "老马啸西风的技术博客",
    },
  },

  theme,
});
