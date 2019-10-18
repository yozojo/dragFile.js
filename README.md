## dragFile.js

### 可以通过拖拽本地文件或者文件夹到浏览器中。
### 读取本地文件和文件夹，基于原生实现。
### 支持读取文件以及文件夹，safari只支持文件
### 如果对你有帮助，加颗star，谢谢支持了。

### 使用方式
```javascript

// 大致使用demo

import Drag from './drag';

const drag = new Drag();

/* eslint-disable */
let el = document.querySelector('body');
// 拖拽目标放置点,可以知己设置
/* eslint-enable */
el.addEventListener(
  'dragover',
  e => {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);
el.addEventListener(
  'dragenter',
  e => {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);
el.addEventListener(
  'drop',
  e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    drag.initFiles(e).then(files => {
      console.log(files);
      // 获得拖拽过来的文件一维数组信息
    });
  },
  false
);


```
