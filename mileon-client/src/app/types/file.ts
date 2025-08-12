import { environment } from '../../environments/environment';

export class File {
  fileID: number;
  fileFormatID: number;
  path: string;
  title: string;
  fileTypeID: number;
  isFullURL: boolean;
  fullPath?: string;

  constructor(args: File) {
    this.fileID = args?.fileID;
    this.fileFormatID = args?.fileFormatID;
    this.path = args?.path;
    this.title = args?.title;
    this.fileTypeID = args?.fileTypeID;
    this.isFullURL = args?.isFullURL;
    this.fullPath = environment.mediaUrl + this.path;
    // if (this.isFullURL) this.fullPath = environment.mediaUrl + this.path;
    // else this.fullPath = this.path;
  }
}
