import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ShipmentService } from '../service/shipment.service';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, UploadDto } from 'src/upload/file-upload.dto';
import { ReqUserDto } from 'src/auth/dto/req-user.dto';

@Controller('shipment')
@UseGuards(AuthGuard('jwt'))
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadExcel(@UploadedFile() file: UploadDto, @Req() req: ReqUserDto) {
    return this.shipmentService.create(file, req);
  }

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipmentService.findOne(+id);
  }

  @Post('search')
  search(@Body() updateShipmentDto: UpdateShipmentDto, @Req() req: ReqUserDto) {
    return this.shipmentService.search(updateShipmentDto, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
    @Req() req: ReqUserDto,
  ) {
    return this.shipmentService.update(+id, updateShipmentDto, req);
  }

  @Patch('st/:id')
  updateST(
    @Param('id') id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
    @Req() req: ReqUserDto,
  ) {
    return this.shipmentService.updateAllST(+id, updateShipmentDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ReqUserDto) {
    return this.shipmentService.remove(+id, req);
  }
}
