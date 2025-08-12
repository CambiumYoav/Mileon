import { Injectable } from '@angular/core';
import mime from 'mime';
import { FileType } from '../types/enum/fileType.enum';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}

  checkFileType(file: File, expectedTypes: FileType | FileType[]): boolean {
    // Attempt to get the MIME type from the file name
    let fileType = mime.lookup(file.name) as FileType | null;
    if (file.name.endsWith('.DAT') || file.name.endsWith('.dat')) {
      fileType = FileType.DAT;
    }
    // Check if the detected file type matches one of the expected types
    if (Array.isArray(expectedTypes)) {
      return expectedTypes.includes(fileType as FileType);
    } else {
      return fileType === expectedTypes;
    }
  }
}
