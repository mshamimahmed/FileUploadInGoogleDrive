import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GdriveController } from './controller/gdrive.controller';
import { Gdrive } from './model/gdrive.entity';
import { GdriveService } from './services/gdrive.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Gdrive]),
      ],
      controllers: [GdriveController],
      providers: [GdriveService]
})
export class GDriveModule {}
