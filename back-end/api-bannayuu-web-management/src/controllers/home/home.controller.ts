import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { HomeService } from './home.service';

@Controller('webbannayuu/api/home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly dbconnection: dbConnection,
    private readonly errMessageUtilsTh: ErrMessageUtilsTH,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('get-all')
  getAllHome(@Body() body, @Request() req) {
    return this.homeService.getAllHome(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-home')
  async createHome(@Body() body, @Request() req) {
    const checkhomeDuplicate = await this.checkHomeDuplicate(body);
    if (checkhomeDuplicate)
      throw new StatusException(
        {
          error: checkhomeDuplicate,
          result: null,
          message: checkhomeDuplicate,
          statusCode: 200,
        },
        200,
      );
    else return await this.homeService.createHome(body, req.user);
  }
  //-------------------------------------Edit
  @UseGuards(JwtAuthGuard)
  @Post('get-home-by-id')
  async getHomeInfoById(@Body() body, @Request() req) {
    const checkhomeInbase = await this.checkHomeInbase(body);
    if (checkhomeInbase)
      throw new StatusException(
        {
          error: checkhomeInbase,
          result: null,
          message: checkhomeInbase,
          statusCode: 200,
        },
        200,
      );
    else return this.homeService.getHomeInfoByID(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit-home')
  async editHomeInfo(@Body() body, @Request() req) {
    const checkhomeInbase = await this.checkHomeInbase(body);
    if (checkhomeInbase)
      throw new StatusException(
        {
          error: checkhomeInbase,
          result: null,
          message: checkhomeInbase,
          statusCode: 200,
        },
        200,
      );
    else {
      const checkhomeDuplicate = await this.checkEditHomeDuplicate(body);
      if (checkhomeDuplicate)
        throw new StatusException(
          {
            error: checkhomeDuplicate,
            result: null,
            message: checkhomeDuplicate,
            statusCode: 200,
          },
          200,
        );
      else return this.homeService.editHomeInfo(body, req.user);
    }
  }
  //--------------------------------------Delete
  @UseGuards(JwtAuthGuard)
  @Post('delete-home')
  async deleteHome(@Body() body, @Request() req) {
    const checkhomeInbase = await this.checkHomeInbase(body);
    if (checkhomeInbase)
      throw new StatusException(
        {
          error: checkhomeInbase,
          result: null,
          message: checkhomeInbase,
          statusCode: 200,
        },
        200,
      );
    else return this.homeService.deleteHomeByID(body, req.user);
  }

  async checkHomeDuplicate(body: any) {
    console.log(body);
    const company_id = body.company_id;
    const home_address = body.home_address;
    let sql = `select * from m_home where delete_flag = 'N' and company_id = $1 and home_address = $2;`;
    const query = {
      text: sql,
      values: [company_id, home_address],
    };
    const res = await this.dbconnection.getPgData(query);
    if (res.error) return this.errMessageUtilsTh.messageProcessFail;
    else if (res.result.length > 0)
      return this.errMessageUtilsTh.errHomeAddressIsDuplicate;
    else return null;
  }

  async checkEditHomeDuplicate(body: any) {
    const company_id = body.company_id;
    const home_address = body.home_address;
    const home_id = body.home_id;
    let sql = `select * from m_home where delete_flag = 'N' and company_id = $1 and home_address = $2 and home_id != $3;`;
    const query = {
      text: sql,
      values: [company_id, home_address, home_id],
    };
    const res = await this.dbconnection.getPgData(query);
    if (res.error) return this.errMessageUtilsTh.messageProcessFail;
    else if (res.result.length > 0)
      return this.errMessageUtilsTh.errHomeAddressIsDuplicate;
    else return null;
  }

  async checkHomeInbase(body: any) {
    const home_id = body.home_id;
    const company_id = body.company_id;
    let sql = `select * from m_home where  company_id = $1 and home_id = $2;`;
    const query = {
      text: sql,
      values: [company_id, home_id],
    };
    const res = await this.dbconnection.getPgData(query);
    if (res.error) return this.errMessageUtilsTh.messageProcessFail;
    else if (res.result.length === 0)
      return this.errMessageUtilsTh.errHomeAddressNotInBase;
    else return null;
  }
}
