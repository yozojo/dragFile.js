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
      console.log(file);
      // 获得拖拽过来的文件一维数组信息
    });
  },
  false
);
