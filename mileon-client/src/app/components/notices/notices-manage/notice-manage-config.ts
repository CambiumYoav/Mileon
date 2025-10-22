import { FileTypeExtension } from '../../../types/enum/fileType.enum';   

export const FILE_CONFIG = {
  Printing: {
    fileName: 'Final_Manot_File.txt',
    fileType: FileTypeExtension.TXT,
    serviceMethod: 'restoreMana',
  },
  Production: {
    fileName: 'Final_Manot_File.pdf',
    fileType: FileTypeExtension.PDF, 
    serviceMethod: 'restoreManaLocal',
  },
} as const;
