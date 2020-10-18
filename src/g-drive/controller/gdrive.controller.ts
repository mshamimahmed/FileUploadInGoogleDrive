import { Body, Controller, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { GdriveDto } from '../model/gdrive.dto';
import { GdriveService } from '../services/gdrive.service';
@Controller('gdrive')
export class GdriveController {
    constructor(
        private readonly gdriveService: GdriveService
    ){}

    @Put(':id')
    async updateProduct(@Param('id') id: number, @Body() gdrive: GdriveDto): Promise<Boolean> {
        return (await this.gdriveService.updateGmail(id, gdrive)).affected > 0
    }   
 
    @Post("create")
    @UseInterceptors(FileInterceptor('attachment'))
    addUser(@UploadedFile() attachment, @Body() gdrive: GdriveDto) {
        // console.log(attachment);
        return this.gdriveService.create(attachment,gdrive)
    }
}
