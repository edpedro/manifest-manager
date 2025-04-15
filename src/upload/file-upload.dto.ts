import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export class UploadDto {
  readonly fieldname: string;
  readonly originalname: string;
  readonly encoding: string;
  readonly mimetype: string;
  readonly buffer: Buffer;
  readonly size: number;
  readonly company_id: string;
}

export const multerOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
};

export const multerOptionsPDF: MulterOptions = {
  storage: memoryStorage(), // Armazena o arquivo na memória
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Apenas arquivos Excel são permitidos'),
        false,
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
};

export class UploadPDFDto {
  readonly fieldname: string;
  readonly originalname: string;
  readonly encoding: string;
  readonly mimetype: string;
  readonly buffer: Buffer;
  readonly size: number;
  readonly company_id: string;
}
