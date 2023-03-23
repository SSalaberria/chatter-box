import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit, OnModuleDestroy {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {}

  public onModuleInit(): void {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  public onModuleDestroy(): void {
    this.s3Client.destroy();
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.configService.getOrThrow<string>('AWS_BUCKET');
    const fileName = `${file.originalname}-${Date.now()}`;

    const payload = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    const result = await this.s3Client.send(payload);

    if (result.$metadata.httpStatusCode !== 200) {
      throw new Error('Error uploading file.');
    }

    const url = `https://${bucket}.s3.${this.configService.getOrThrow<string>(
      'AWS_REGION',
    )}.amazonaws.com/${fileName}`;

    return url;
  }
}
