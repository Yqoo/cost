/**
 * 接口api总出口文件
 */
import * as user from './user'
import * as unit from './unit'
import * as accounting from './accounting'
import * as role from './role'
import * as menu from './menu'
import * as kemuModel from './kemuModel'
import * as record from './record'
import { category, voucher } from './category'
import * as cash from './cash'
import * as business from './business'
import { differences, balance } from './differences'
import * as auxiliary from './auxiliary'
import * as auxiliaryZT from './auxiliaryZT'
import * as accountants from './accountants'
import * as abstract from './abstract'
import * as auxiliaryGlgx from './auxiliaryGlgx'
import * as dataRole from './dataRole'
import enclosure from './enclosure'
import beginning from './beginning'
import systemParameter from './systemParameter'
import * as fill from './fill'
import * as backup from './backup'
import * as proof from './proof'
import * as invoiceInterface from './invoiceInterface'
import * as invoiceSystem from './invoiceSystem'
import * as invoiceFolder from './invoiceFolder'
import * as reportxm from './reportxm'
import dataSource from './dataSource'
import * as functionCenter from './functionCenter'
import kettle from './kettle'
import dataMap from './dataMap'
import dataMapManage from './dataMapManage'
import * as mxGraph from './mxGraph'
import ztParameter from './ztParameter'
import * as reportDesign from './reportDesign'
import { gb } from './globalBox'
import * as printTemplate from './printTemplate'
import * as carryForward from './carryForward'
import * as settleAccounts from './settleAccounts'
import * as earlyWarning from './earlyWarning'
import * as dataComparison from './dataComparison'

export default {
  user,
  unit,
  accounting,
  role,
  menu,
  kemuModel,
  record,
  category,
  cash,
  business,
  differences,
  balance,
  auxiliary,
  voucher,
  auxiliaryZT,
  accountants,
  abstract,
  enclosure,
  beginning,
  auxiliaryGlgx,
  systemParameter,
  dataRole,
  fill,
  backup,
  proof,
  invoiceInterface,
  invoiceSystem,
  invoiceFolder,
  reportxm,
  dataSource,
  functionCenter,
  kettle,
  dataMap,
  dataMapManage,
  mxGraph,
  ztParameter,
  reportDesign,
  gb,
  printTemplate,
  carryForward,
  settleAccounts,
  earlyWarning,
  dataComparison
}
