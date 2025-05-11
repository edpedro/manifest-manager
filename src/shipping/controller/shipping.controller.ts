import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from '../service/shipping.service';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { ReqUserDto } from 'src/auth/dto/req-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateManifestDto } from '../dto/create-manifest.dto';
import { UpdateManifestDto } from '../dto/update-manifest.dto';

@Controller('shipping')
@UseGuards(AuthGuard('jwt'))
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  create(@Body() createShippingDto: CreateShippingDto, @Req() req: ReqUserDto) {
    return this.shippingService.create(createShippingDto, req);
  }

  @Post('manifest')
  createManifest(@Body() data: CreateManifestDto, @Req() req: ReqUserDto) {
    return this.shippingService.createManifest(data, req);
  }

  @Get()
  findAll(@Req() req: ReqUserDto) {
    return this.shippingService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: ReqUserDto) {
    return this.shippingService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.update(+id, updateShippingDto);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.updateStatus(+id, updateShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingService.remove(+id);
  }

  @Delete('manifest/:id')
  removeShipment(@Param('id') id: string, @Body() data: UpdateManifestDto) {
    return this.shippingService.removeManisfest(+id, data);
  }
}
