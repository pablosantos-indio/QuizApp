import { FileDataDto } from '../upload/dto/file-data.dto';
import * as XLSX from 'xlsx';
import { BadRequestException } from '@nestjs/common';

export async function getFileData(
  file: Express.Multer.File,
): Promise<FileDataDto> {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const headers: string[] = jsonData[0] as string[];
  const requiredColumns = [
    'user_login',
    'license',
    'url',
    'image_url',
    'scientific_name',
    'common_name',
    'taxon_class_name',
    'taxon_order_name',
    'taxon_family_name',
    'taxon_genus_name',
    'taxon_species_name',
  ];

  const indexMap = headers.reduce(
    (acc, header, index) => ({ ...acc, [header]: index }),
    {},
  );

  const missingColumns = requiredColumns.filter(
    (col) => indexMap[col] === undefined,
  );

  if (missingColumns.length > 0) {
    throw new BadRequestException(
      `Missing required columns: ${missingColumns.join(', ')}`,
    );
  }

  return { indexMap, jsonData };
}

export function validateFile(file: Express.Multer.File, token: string) {
  // Verify if a file was sent
  if (!file) {
    console.error('No file provided');
    throw new BadRequestException('No file provided');
  }

  if (!file.originalname.match(/\.xlsx$|\.xls$|\.csv$/)) {
    throw new BadRequestException('Only XLSX, XLS, or CSV files are accepted.');
  }

  if (!token) {
    console.error('No token provided');
    throw new BadRequestException('No token provided');
  }

  // Verify if the token is valid
  // if (!token.match(/[A-Za-z].[0-9]|[0-9].[A-Za-z]/)) {
  if (!token.match(/[A-Za-z][0-9]/)) {
    console.error('Invalid token format');
    throw new BadRequestException(
      'Token must include at least one letter and one number and cannot contain special characters or spaces.',
    );
  }
}
