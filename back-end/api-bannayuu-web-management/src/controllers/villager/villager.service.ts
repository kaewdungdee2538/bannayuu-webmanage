import { Body, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class VillagerService {
  constructor(
    private readonly errMessageUtilsTh: ErrMessageUtilsTH,
    private readonly dbconnecttion: dbConnection,
  ) { }
  async getAllHome(body: any) {
    const company_id = body.company_id;
    const home_address = body.home_address ? body.home_address : '';
    let sql = `select home_id,home_code,home_name,home_address
    , home_data,home_remark,create_date,update_date,
    case when delete_flag = 'N' then 'active'
    else 'inactive' end as status
    from m_home 
    where company_id = $1 and delete_flag = 'N'`
    if(home_address)
      sql += ` and home_address like '%${home_address}%'`
    sql += `order by home_address
    ;`
    const query = {
      text: sql
      , values: [company_id]
    }
    const res = await this.dbconnecttion.getPgData(query);
    if (res.error) throw new StatusException({
      error: res.error,
      result: null,
      message: this.errMessageUtilsTh.messageProcessFail,
      statusCode: 200
    }, 200);
    else throw new StatusException({
      error: null,
      result: res.result,
      message: this.errMessageUtilsTh.messageSuccess,
      statusCode: 200
    }, 200);
  }

  async getVillagerAllByHomeID(body: any) {
    const company_id = body.company_id;
    const home_id = body.home_id;
    let sql = `select 
        home_line_id,home_id
        ,home_line_code
        ,home_line_first_name,home_line_last_name
        ,home_line_mobile_phone
        ,home_line_remark
        ,case when delete_flag = 'N' then 'active'
        else 'inactive' end as status
        from m_home_line
        where 
        company_id = $1
         and home_id = $2
         order by home_line_first_name,home_line_last_name,home_line_mobile_phone;`;
    const query = {
      text: sql,
      values: [company_id, home_id],
    };
    const res = await this.dbconnecttion.getPgData(query);
    if (res.error)
      throw new StatusException(
        {
          error: res.error,
          result: null,
          message: this.errMessageUtilsTh.messageProcessFail,
          statusCode: 200,
        },
        200,
      );
    else
      throw new StatusException(
        {
          error: null,
          result: res.result,
          message: this.errMessageUtilsTh.messageSuccess,
          statusCode: 200,
        },
        200,
      );
  }

  async addVillager(body: any, req: any) {
    const employeeObj = req.user.employee
    const company_id = body.company_id;
    const home_id = body.home_id;
    const home_line_first_name = body.home_line_first_name;
    const home_line_last_name = body.home_line_last_name;
    const home_line_mobile_phone = body.home_line_mobile_phone;
    const home_line_remark = body.home_line_remark;
    const employee_id = employeeObj.employee_id
    let sql = `insert into m_home_line(
        home_id
        ,home_line_code,home_line_first_name,home_line_last_name
        ,home_line_mobile_phone,home_line_remark
        ,create_by,create_date
        ,company_id
    ) values(
        $1
        ,fun_generate_uuid('HOMELINE'||trim(to_char(${company_id},'000'))||trim(to_char(${home_id},'0000')),6)
        ,$2,$3
        ,$4,$5
        ,$6,current_timestamp
        ,$7
    );`
    const query = {
      text: sql
      , values: [
        home_id
        , home_line_first_name, home_line_last_name
        , home_line_mobile_phone, home_line_remark
        , employee_id
        , company_id
      ]
    }
    const res = await this.dbconnecttion.savePgData([query]);
    if (res.error) throw new StatusException({
      error: res.error,
      result: null,
      message: this.errMessageUtilsTh.messageProcessFail,
      statusCode: 200
    }, 200);
    else throw new StatusException({
      error: null,
      result: this.errMessageUtilsTh.messageSucceessEn,
      message: this.errMessageUtilsTh.messageSuccess,
      statusCode: 200
    }, 200);
  }
  //------------------------------------Edit
  async getVillagerByLineID(body: any, req: any) {
    const company_id = body.company_id;
    const home_id = body.home_id;
    const home_line_id = body.home_line_id;
    let sql = `select 
        home_line_id,mhl.home_id
        ,home_line_code
        ,home_line_first_name,home_line_last_name
        ,home_line_mobile_phone
        ,home_line_remark
        ,mhl.create_date
        ,mhl.update_date
        ,mh.home_code
        ,mh.home_address
        ,mc.company_name
        ,case when mhl.delete_flag = 'N' then 'active'
        else 'inactive' end as status
         from m_home_line mhl left join m_company mc on mhl.company_id = mc.company_id
        left join m_home mh on mhl.home_id = mh.home_id
         where 
         mhl.company_id = $1
         and mhl.home_id = $2
         and mhl.home_line_id =$3
         order by home_line_first_name,home_line_last_name,home_line_mobile_phone;`;
    const query = {
      text: sql,
      values: [company_id, home_id, home_line_id],
    };
    const res = await this.dbconnecttion.getPgData(query);
    if (res.error)
      throw new StatusException(
        {
          error: res.error,
          result: null,
          message: this.errMessageUtilsTh.messageProcessFail,
          statusCode: 200,
        },
        200,
      );
    else
      throw new StatusException(
        {
          error: null,
          result: res.result,
          message: this.errMessageUtilsTh.messageSuccess,
          statusCode: 200,
        },
        200,
      );
  }

  async editVillager(body: any, req: any) {
    const employeeObj = req.user.employee
    const company_id = body.company_id;
    const home_id = body.home_id;
    const home_line_id = body.home_line_id;
    const home_line_first_name = body.home_line_first_name;
    const home_line_last_name = body.home_line_last_name;
    const home_line_mobile_phone = body.home_line_mobile_phone;
    const home_line_remark = body.home_line_remark;
    const employee_id = employeeObj.employee_id
    let query1;
    if (body.home_enable) {
      let sql = `update m_home_line set
      home_line_first_name=$1,home_line_last_name=$2
      ,home_line_mobile_phone=$3,home_line_remark=$4
      ,update_by=$5,update_date=current_timestamp
      ,delete_flag='N'
      where home_line_id=$6 and company_id=$7
      ;`
      query1 = {
        text: sql
        , values: [
          home_line_first_name, home_line_last_name
          , home_line_mobile_phone, home_line_remark
          , employee_id
          , home_line_id, company_id
        ]
      }
    } else {
      let sql = `update m_home_line set
      home_line_first_name=$1,home_line_last_name=$2
      ,home_line_mobile_phone=$3,home_line_remark=$4
      ,update_by=$5,update_date=current_timestamp
      ,delete_flag='Y',delete_date=current_timestamp,delete_by=$6
      where home_line_id=$7 and company_id=$8
      ;`
      query1 = {
        text: sql
        , values: [
          home_line_first_name, home_line_last_name
          , home_line_mobile_phone, home_line_remark
          , employee_id
          , employee_id
          , home_line_id, company_id
        ]
      }
    }

    const querys = [query1];

    const res = await this.dbconnecttion.savePgData(querys);
    if (res.error) throw new StatusException({
      error: res.error,
      result: null,
      message: this.errMessageUtilsTh.messageProcessFail,
      statusCode: 200
    }, 200);
    else throw new StatusException({
      error: null,
      result: this.errMessageUtilsTh.messageSucceessEn,
      message: this.errMessageUtilsTh.messageSuccess,
      statusCode: 200
    }, 200);
  }

  //--------------------------Delete
  async deleteVillager(body: any, req: any) {
    const employeeObj = req.user.employee
    const company_id = body.company_id;
    const home_id = body.home_id;
    const home_line_id = body.home_line_id;
    const employee_id = employeeObj.employee_id
    let sql = `update m_home_line set
    delete_flag = 'Y',delete_date = current_timestamp
    ,delete_by = $1
    where company_id = $2
    and home_line_id = $3
    ;`
    const query = {
      text: sql
      , values: [
        employee_id
        , company_id
        , home_line_id
      ]
    }
    const res = await this.dbconnecttion.savePgData([query]);
    if (res.error) throw new StatusException({
      error: res.error,
      result: null,
      message: this.errMessageUtilsTh.messageProcessFail,
      statusCode: 200
    }, 200);
    else throw new StatusException({
      error: null,
      result: this.errMessageUtilsTh.messageSucceessEn,
      message: this.errMessageUtilsTh.messageSuccess,
      statusCode: 200
    }, 200);
  }
 //--------------------------Delete
 async homeChangeVillager(body: any, req: any) {
  const employeeObj = req.user.employee
  const company_id = body.company_id;
  const home_id = body.home_id;
  const home_line_id = body.home_line_id;
  const employee_id = employeeObj.employee_id
  let sql = `update m_home_line set
  home_id = $1,update_date = current_timestamp
  ,update_by = $2
  where company_id = $3
  and home_line_id = $4
  ;`
  const query = {
    text: sql
    , values: [
      home_id
      , employee_id
      , company_id
      , home_line_id
    ]
  }
  const res = await this.dbconnecttion.savePgData([query]);
  if (res.error) throw new StatusException({
    error: res.error,
    result: null,
    message: this.errMessageUtilsTh.messageProcessFail,
    statusCode: 200
  }, 200);
  else throw new StatusException({
    error: null,
    result: this.errMessageUtilsTh.messageSucceessEn,
    message: this.errMessageUtilsTh.messageSuccess,
    statusCode: 200
  }, 200);
}
  
}
