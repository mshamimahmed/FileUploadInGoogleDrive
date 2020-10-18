import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GDriveModule } from './g-drive/g-drive.module';
import { config } from "dotenv";
import { Gdrive } from './g-drive/model/gdrive.entity';
config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: process.env.DATABASE,
      username: process.env.DBUSERNAME,
      password: process.env.PASSWORD,
      host: process.env.DBHOST,
      type:"postgres",
      synchronize: true,
      entities:[
        Gdrive
      ],
    }),
    GDriveModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
