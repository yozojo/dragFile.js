/**
 * @file: src/drag.js
 * @author: youzuqiang
 */

export default class Drag {
    constructor() {
        this.files = [];
    }
    async initFiles(e) {
        // 调用获取拖拽文件信息列表
        if (!e.dataTransfer) {
            return this.files;
        }
        this.files = e.dataTransfer.files;
        if (this.files.length) {
            let items = e.dataTransfer.items;
            if (items && items.length && items[0].webkitGetAsEntry !== null) {
                await this.addFilesFromItems(items).then(files => {
                    this.files = this.flatten(files);
                });
            } else {
                // 单独对safari和低版本不支持webkitGetAsEntry做处理；
                await this.handleSafari(this.files).then(files => {
                    this.files = files.filter(item => item !== undefined);
                });
            }
        }
        return this.files;
    }

    handleSafari(files) {
        files = [].slice.call(files).map(item => {
            return this.fileReader(item)
                .then(file => {
                    file.fullPath = file.name;
                    Object.defineProperty(file, 'webkitRelativePath', {
                        value: file.name
                    });
                    return file;
                })
                .catch(() => {});
        });
        return Promise.all(files);
    }

    fileReader(file) {
        let reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = e => {
                resolve(file);
            };
            reader.onerror = e => {
                reject();
            };
            reader.readAsDataURL(file);
        });
    }

    addFilesFromItems(items) {
        items = [].slice.call(items).map(item => {
            let entry;
            if (item.webkitGetAsEntry !== null && (entry = item.webkitGetAsEntry())) {
                if (entry.isFile) {
                    return this.addFile(item);
                }
                else if (entry.isDirectory) {
                    return this.addFilesFromDirectory(entry, entry.name).then(data => this.flatten(data));
                }
            }
            else if (item.getAsFile != null) {
                if (item.kind === null || item.kind === 'file') {
                    return Promise.resolve(item.getAsFile());
                }
            }
        });
        return Promise.all(items);
    }

    addFile(item) {
        return new Promise((resolve, reject) => {
            let file = item.getAsFile();
            file.fullPath = file.name;
            Object.defineProperty(file, 'webkitRelativePath', {
                value: file.name
            });
            resolve(file);
        });
    }

    addFilesFromDirectory(directory, path) {
        // 根据文件夹多维生成多维数组；
        return this.readEntries(directory).then(entries => {
            if (entries.length > 0) {
                entries = entries.map(entry => {
                    if (entry.isFile) {
                        return this.file(entry).then(file => {
                            file.fullPath = path + '/' + file.name;
                            Object.defineProperty(file, 'webkitRelativePath', {
                                value: path + '/' + file.name
                            });
                            return file;
                        });
                    } else if (entry.isDirectory) {
                        return this.addFilesFromDirectory(
                            entry,
                            path + '/' + entry.name
                        );
                    }
                });
            }
            return Promise.all(entries);
        });
    }

    readEntries(directory) {
        let dirReader = directory.createReader();
        return new Promise((resolve, reject) => {
            dirReader.readEntries(entries => {
                resolve(entries);
            });
        });
    }

    file(entry) {
        return new Promise((resolve, reject) => {
            entry.file(file => {
                resolve(file);
            });
        });
    }

    flatten(arr) {
        function isArray(arr) {
            return (
                Array.isArray(arr) ||
                Object.prototype.toString.call(arr) === '[object Array]'
            );
        }
        let ret = [];
        let item;
        if (!isArray(arr)) {
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            item = arr[i];
            if (isArray(item)) {
                ret = ret.concat(this.flatten(item));
            } else {
                ret.push(item);
            }
        }
        return ret;
    }
}
