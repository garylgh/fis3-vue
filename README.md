# fis3-vue

这个demo集成了目前前端开发比较流行的开源工具。
适用用于简单的前后端分离，移动端开发。

开发关键字：**MVVM**， **模块化**，**ES6**，**Combo**，**自动化部署**

------

包括：

  * Node.js
  * Express
  * Fis3
  * Vue
  * Sass
  * PM2
  * Gulp
  * Babel
  * Webpack
  * BrowserSync


界面和样式是直接copy腾讯CDC的idesign.qq.com

### 截图

![](http://i1.tietuku.com/8f4dd53803c48148.png)

![](http://i1.tietuku.com/50a4afbf50a549fc.png)

------

[点击查看demo](http://idesign.kulife.net/)

------

#### 快速开始
    // 运行项目
    cd fis3-vue
    cnpm install
    bower install
    npm run dev

    // 需要预先配置好发布信息
    // 初始化服务器环境
    npm run setup

    // 发布项目
    npm run deploy

    // 回滚操作
    npm run revert

    // 服务器启动/重启服务
    npm run start

------

#### 目录结构

![](http://i1.tietuku.com/c13327378bc09699.png)

-----
#### 项目说明
    1. 无分号，2Tab缩进.

    2. 通过package.json的components字段，可以添加指定的库。例如：
      "components": [
        "vue",
        "vue-resource",
        "vue-view"
      ]
      说明指定vue,vue-resource,vue-view,这三个为前端库。
      使用的时候可以直接require('vue'),require('vue-resource')。
      当然你需要确认库是否已经在node_modules里了。

    3. 通过配置config/config.json可以配置pm2相关设置，发布相关也在这个配置文件中.

    4. 可以把图片命名为xxx.webp.jpg或xxx.webp.png
      这样可以同时生成webp和(png, jpg)两个版本的图片, 然后通过filter webp进行自动切换.

    5. 新手可以使用我的编辑器配置:
      Sublime Text 3: https://github.com/okoala/sublime-bak.git
      Atom: https://github.com/okoala/atom-bak.git
      已经集成目前比较流行的插件~~项目解压覆盖到对应的文件, 然后重启编辑器即可.


------
