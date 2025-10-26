// import { Injectable } from '@angular/core';
// declare global {
//   interface Window {
//     CKEditor?: any;
//     ClassicEditor?: any;
//   }
// }
// @Injectable({
//   providedIn: 'root',
// })
// export class CkEditorService {
//   private isScriptLoading = false;
//   private loadPromise: Promise<any> | null = null;

//   loadEditor(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       let editorModule = (window as any).ClassicEditor;
//       if (editorModule) {
//         const Editor = editorModule.default ?? editorModule;
//         if (typeof Editor.create === 'function') {
//           return resolve(Editor);
//         }
//       }

//       const script = document.createElement('script');
//       script.src = 'assets/ckeditor5/ckeditor.js';
//       script.async = true;

//       script.onload = () => {
//         console.log('CKEditor script loaded:', window.ClassicEditor);
//         editorModule = (window as any).ClassicEditor;
//         if (!editorModule) {
//           return reject('window.ClassicEditor is undefined after script load.');
//         }
//         const Editor = editorModule.default ?? editorModule;
//         if (typeof Editor.create === 'function') {
//           resolve(Editor);
//         } else {
//           reject('ClassicEditor loaded but create() not found on module.');
//         }
//       };

//       script.onerror = (err) => {
//         reject('Failed to load CKEditor script: ' + err);
//       };

//       document.body.appendChild(script);
//     });
//   }
// }
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    CKEditor?: any;
    ClassicEditor?: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CkEditorService {
  private loadPromise: Promise<any> | null = null;
  private isScriptLoaded = false;
  private isScriptLoading = false;

  constructor() {
    // Start preloading immediately when service is created
    this.preloadEditor();
  }

  private preloadEditor(): void {
    // Don't preload if we're already loading or loaded
    if (this.loadPromise || this.isScriptLoaded || this.isScriptLoading) {
      return;
    }

    // Check if already available
    const editorModule = (window as any).ClassicEditor;
    if (editorModule) {
      const Editor = editorModule.default ?? editorModule;
      if (typeof Editor.create === 'function') {
        this.isScriptLoaded = true;
        return;
      }
    }

    // Start loading in background
    this.loadPromise = this.loadScript();
  }

  private loadScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Double-check if already loaded while we were waiting
      let editorModule = (window as any).ClassicEditor;
      if (editorModule) {
        const Editor = editorModule.default ?? editorModule;
        if (typeof Editor.create === 'function') {
          this.isScriptLoaded = true;
          return resolve(Editor);
        }
      }

      // Prevent multiple script loading attempts
      if (this.isScriptLoading) {
        return reject('Script loading already in progress');
      }

      this.isScriptLoading = true;

      const script = document.createElement('script');
      script.src = 'assets/ckeditor5/ckeditor.js';
      script.async = true;

      script.onload = () => {
        console.log('CKEditor script loaded:', window.ClassicEditor);
        this.isScriptLoading = false;

        editorModule = (window as any).ClassicEditor;
        if (!editorModule) {
          return reject('window.ClassicEditor is undefined after script load.');
        }

        const Editor = editorModule.default ?? editorModule;
        if (typeof Editor.create === 'function') {
          this.isScriptLoaded = true;
          resolve(Editor);
        } else {
          reject('ClassicEditor loaded but create() not found on module.');
        }
      };

      script.onerror = (err) => {
        this.isScriptLoading = false;
        this.loadPromise = null; // Reset so we can try again
        reject('Failed to load CKEditor script: ' + err);
      };

      document.body.appendChild(script);
    });
  }

  loadEditor(): Promise<any> {
    // If already loaded, return immediately
    if (this.isScriptLoaded) {
      const editorModule = (window as any).ClassicEditor;
      const Editor = editorModule.default ?? editorModule;
      return Promise.resolve(Editor);
    }

    // If loading is in progress, return the existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.loadPromise = this.loadScript();
    return this.loadPromise;
  }

  // Check if editor is ready (useful for showing different UI states)
  isEditorReady(): boolean {
    return this.isScriptLoaded;
  }

  // Get loading status
  isEditorLoading(): boolean {
    return this.isScriptLoading;
  }

  // Method to trigger preloading manually if needed
  public triggerPreload(): void {
    this.preloadEditor();
  }
}
