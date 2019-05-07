
declare const OSS;

export class FileUploadAdapter {
  loader;
  editor;
  http;
  constructor(loader, editor) {
    this.loader = loader;
    this.editor = editor;
    this.http = this.editor.config.get('http');
  }
  upload() {
    return new Promise((resolve, reject) => {
      resolve({ default: null })
    })
    
  }
  abort() {
    
  }
}

/**
 * 工厂方法，提供给ckeditor调用
 */
export function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new FileUploadAdapter(loader, editor);
  };
}