'use strict';
/* global fis */

var path = require('path');

var config = require('./config');
// 利用package.json文件定义项目名和版本
var meta = require('./package.json');

var plugins = {
	webp: require('./build/fis/postprocessor/webp'),
	define: require('./build/fis/postprocessor/define'),
	frameworkConf: require('./build/fis/postpackager/framework-conf')
};

// 有限制使用本地自定义插件~~
var plugin = function(name, options) {
	var localPlugin = plugins[name];
	if (typeof localPlugin === 'function') {
		localPlugin.options = options;
		return localPlugin;
	} else {
		return fis.plugin.apply(fis, arguments);
	}
};

/** **************环境变量*****************/
fis
// 排除指定目录
	.set('project.files', ['!client/libs/**', '!dep/**'])
	.set('project.ignore', ['node_modules/**', '.gitignore', '**/_*.scss', '.docs/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js'])
	// 把scss映射为css
	.set('project.ext', {
		scss: 'css'
	})
	.set('name', meta.name)
	.set('version', meta.version)
	.set('urlPrefix', config.urlPrefix)
	.set('dest', /^\./i.test(config.dest) ? path.resolve(__dirname, config.dest) : config.dest)
	.set('framework', {
		cache: config.LSCache, // 开启localstorage缓存
		combo: config.combo, // 开启合并
		comboPattern: config.comboPattern,
		urlPattern: config.urlPattern, // 静态资源加载路径模式
		urlPrefix: config.urlPrefix // 静态资源加载路径模式
	});

// 测试环境屏蔽Hash
if (config.env === 'development') {
	fis.set('framework.useHash', false);
} else {
	fis.set('framework.useHash', true);
}

fis.hook('commonjs', {
	// 参考 http://imweb.io/topic/565c548a3ad940357eb99874
	paths: {
		'react': '../dep/react.js',
		'react-dom': '../dep/react-dom.js'
	}
});

/** **************语言编译*****************/
fis
.match('../dep/react', {
	isMod: true,
	moduleId: 'react'  // 为utils设置一个moduleId，希望以后能直接require('utils')
})
.match('../dep/react-dom', {
	isMod: true,
	moduleId: 'react-dom'  // 为utils设置一个moduleId，希望以后能直接require('utils')
})
/** 开发阶段不编译，太慢了。*/
.match(/\.js$/i, {
	isMod: true,
	// 设置js文件为babel解析，支持es6的写法。
	parser: plugin('babel', {
		// babel options
	}),

	// 自己的define包装
	postprocessor: plugin('define')
})

.match(/\.scss$/i, {
	rExt: '.css', // from .scss to .css
	parser: plugin('sass3', {
		// fis-parser-sass option
	})
})

.match('*.less', {
	parser: plugin('less'),
	rExt: '.css'
})

.match(/(\.webp)\.(png|jpg)$/i, {
	postprocessor: plugin('webp', {
		quality: 50
	})
})

.match('::package', {
	// npm install [-g] fis3-postpackager-loader
	// 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
	spriter: plugin('csssprites', {
		htmlUseSprite: true,
		layout: 'matrix',
		margin: '15',
		styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig
	}),

	// npm install [-g] fis3-postpackager-loader
	// 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
	postpackager: plugin('loader', {
		resourceType: 'mod',
		// allInOne: true,
		useInlineMap: true // 资源映射表内嵌
	})
});

/** ***********************目录规范*****************************/
fis
// 默认情况下不添加hash
.match('**', {
	useHash: false,
	release: false
})

// .match(/^\/components\/(.*)$/i, {
// 	// components下开启同名依赖，通常是为了自动加载样式文件。
// 	useSameNameRequire: true
// })
//
// .match(/^\/components\/(.*)$/i, {
// 	url: '${urlPrefix}/c/$1',
// 	release: '/public/c/$1'
// })
// // components相关
// .match(/^\/components\/(.*\.tpl)$/i, {
// 	useCache: false,
// 	isViews: true
// })
// .match(/^\/components\/(.*\.js)$/i, {
// 	moduleId: '$1',
// 	id: '$1',
// 	isMod: true,
// 	isES6: true,
// 	isComponent: true,
// 	useHash: false,
// 	url: '${urlPrefix}/c/$1',
// 	release: '/public/c/$1'
// })
// .match(/^\/components\/(.*)\.(scss|css)$/i, {
// 	moduleId: '$1.css',
// 	id: '$1.css',
// 	isMod: true,
// 	useSprite: true,
// 	useHash: false,
// 	url: '${urlPrefix}/c/$1.$2',
// 	release: '/public/c/$1.$2'
// })
// .match(/^\/components\/(.*)(\.webp)\.(png|jpg)$/i, {
// 	useWebP: true,
// 	url: '${urlPrefix}/c/$1.$3',
// 	release: '/public/c/$1.$3'
// })

// client文件夹相关
// libs下是bower下载的资源，不需要编译
// .match(/^\/client\/libs\/(.*)$/i, {
// 	useCompile: false,
// 	release: 'public/libs/$1'
// })

// dep 目录下是bower安装的，只制定需要编译的js
.match(/^\/dep\/jquery\/.*(jquery.*\.js)$/i, {
	isMod: false,
	useCache: true,
	release: '/public/dep/$1'
})
.match(/^\/dep\/(react.*\.js)$/i, {
	isMod: true,
	useCache: true,
	release: '/public/dep/$1'
})
.match(/(mod\.js)$/i, {
	isMod: false,
	useCache: true,
	release: '/public/dep/$1'
})

.match(/^\/client\/(.*)$/i, {
	isMod: true,
	useSprite: true,
	isViews: true,
	url: '${urlPrefix}/$1',
	release: '/public/$1'
})
.match(/^\/client\/(.*\.(?:html?|js))$/i, {
	isMod: true,
	useCache: false,
	isViews: true,
	isES6: false,
	url: '${urlPrefix}/$1',
	release: '/public/$1'
})
.match(/^\/client\/static\/(.*)$/i, {
	url: '/static/$1',
	release: '/static/$1'
})

// DOC 文件夹不发布
.match('docs/**', {
	release: false
})

// tmp文件夹
.match(/^\/\.tmp\/(.*\.js)$/i, {
	moduleId: '$1',
	id: '$1',
	isBaseMod: true,
	isES6: false,
	isMod: true,
	useHash: false,
	url: '${urlPrefix}/c/$1',
	release: '/public/c/$1'
})

// release一下，不然在postpackager无法获取到数据
.match('package.json', {
	release: '$0'
})

.match('map.json', {
	release: false
});

/** ********************测试/生产环境下*****************/
fis
.media('deploy')

.match(/\.nvmrc$/i, {
	release: '$0'
})

.match(/^\/client\/(.*)$/i, {
	useHash: true
})

.match(/^\/client\/static\/(.*)$/i, {
	useHash: false
})

.match(/\.(html|tpl)$/i, {
	useHash: false,

	// 指定压缩插件 fis-optimizer-html-minifier
	optimizer: plugin('html-minifier', {
		// fis直接将此配置传递给html-minfier模块
		// 因此相关配置项请直接参阅html-minifier文档
		removeComments: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		removeAttributeQuotes: true
	})
})

.match(/\.js$/i, {
	// 指定压缩插件 fis-optimizer-uglify-js
	optimizer: plugin('uglify-js', {
		// option of uglify-js
	}),

	lint: plugin('jshint')
})

.match(/\.(css|scss)$/i, {
	optimizer: plugin('clean-css')
})

.match(/\.png$/i, {
	optimizer: plugin('png-compressor')
})

// server文件不编译
.match(/^\/config\/(.*)$/i, {
	useCompile: false,
	release: '/config/$1'
})

// server文件不编译
.match(/^\/server\/(.*)$/i, {
	useCompile: false,
	release: '/server/$1'
});
