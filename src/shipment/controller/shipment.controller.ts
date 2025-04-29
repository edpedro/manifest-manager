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
  Res,
} from '@nestjs/common';
import { ShipmentService } from '../service/shipment.service';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, UploadDto } from 'src/upload/file-upload.dto';
import { ReqUserDto } from 'src/auth/dto/req-user.dto';
import { DateShipmentDto } from '../dto/date-shipment.dto';
import { Response } from 'express';

@Controller('shipment')
//@UseGuards(AuthGuard('jwt'))
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadExcel(@UploadedFile() file: UploadDto, @Req() req: ReqUserDto) {
    return this.shipmentService.create(file, req);
  }

  @Get('/model/export')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  modelExcel(@Res() res: Response) {
    return this.shipmentService.modelExcel(res);
  }

  @Get('/expedition/model/export')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  modelExpeditionExcel(@Res() res: Response) {
    return this.shipmentService.modelExpeditionExcel(res);
  }

  @Post('/expedition')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadExpeditionExcel(
    @UploadedFile() file: UploadDto,
    @Req() req: ReqUserDto,
  ) {
    return this.shipmentService.ExpeditionExcel(file, req);
  }

  @Post('/date/export')
  exportDateExcel(
    @Body() data: DateShipmentDto,
    @Req() req: ReqUserDto,
    @Res() res: Response,
  ) {
    return this.shipmentService.exportDateExcel(data, req, res);
  }

  @Post('/st/export')
  exportStExcel(
    @Body() st: string[],
    @Req() req: ReqUserDto,
    @Res() res: Response,
  ) {
    return this.shipmentService.exportStExcel(st, req, res);
  }

  @Post('/supply/export')
  exportSupplyExcel(
    @Body() supply: string[],
    @Req() req: ReqUserDto,
    @Res() res: Response,
  ) {
    return this.shipmentService.exportSupplyExcel(supply, req, res);
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

  @Get('data/dashboard')
  dashboard() {
    return this.shipmentService.dashboard();
  }
}
