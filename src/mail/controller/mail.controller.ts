import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  Body,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { MailService } from '../service/mail.service';

import { Response } from 'express';
import { CreateMailDto } from '../dto/create-mail.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateMailDto } from '../dto/update-mail.dto';

@Controller('mail')
@UseGuards(AuthGuard('jwt'))
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('enviar/:id')
  sedEmail(@Param('id') id: string, @Res() res: Response) {
    return this.mailService.sendConfirmationEmail(+id, res);
  }

  @Get()
  findAllEmailStatus() {
    return this.mailService.getQueueStatus();
  }

  @Post()
  create(@Body() data: CreateMailDto) {
    return this.mailService.createMail(data);
  }

  @Get('list')
  findAll() {
    return this.mailService.findAll();
  }

  @Get('list/:id')
  findById(@Param('id') id: string) {
    return this.mailService.findByMailId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateMailDto) {
    return this.mailService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.mailService.remove(+id);
  }
}
