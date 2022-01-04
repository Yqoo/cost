<template>
  <div class="functionPage">
    <div class="function right-line">
      <UtilTitle class="icon" :info="{ label: '插入函数', value: 'charuhs', icon: 'charuhs' }" @start="insertFunction" />
      <UtilTitle
        class="icon"
        :info="{ label: '常用函数', icon: 'changyonghs', children: getChild('hanshu').changyonghs.value }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '全部', children:getChild('hanshu').all.value,icon: 'quanbuhs' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '财务', children:getChild('hanshu').caiwu.value, icon: 'caiwuhs' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '逻辑', children:getChild('hanshu').luoji.value, icon: 'luojihs' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '文本', children:getChild('hanshu').wenben.value, icon: 'wenbenhs' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '日期和时间', children:getChild('hanshu').date.value, icon: 'riqiheshijianhs' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '查找与引用', children:getChild('hanshu').find.value, icon: 'chazhaoheyy' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '数学和三角', children:getChild('hanshu').math.value, icon: 'shuxuehesj' }"
        @start="doClick"
      />
      <UtilTitle
        class="icon"
        :info="{ label: '其他函数', children:getChild('qitahs'), icon: 'qitahanshu' }"
        @start="doClick"
      />
    </div>
    <!-- <div class="formula right-line">
      <div class="two-item">
        <p>
          <i class="iconfont icon-dingyihanshu" />
          <span>定义函数</span>
        </p>
        <p>
          <i class="iconfont icon-xianshigongshi" />
          <span>公式求值</span>
        </p>
      </div>
      <div class="two-item">
        <p>
          <i class="iconfont icon-gongshiqiuzhi" />
          <span>显示公式</span>
        </p>
        <p>
          <i class="iconfont icon-cuowujiancha" />
          <span>错误检查</span>
        </p>
      </div>
    </div> -->
    <div class="calculate">
      <UtilTitle
        :class="status ? 'active': ''"
        class="icon"
        :info="{ label: '计算工作簿', value: 'jisuangzb', icon: 'jisuangongzuobu-03' }" @start="doClick"
      />
      <UtilTitle
        :class="!status ? 'active': ''"
        class="icon"
        :info="{ label: '编辑工作簿', value: 'edit', icon: 'bianjigongzuobu-03' }" @start="doClick"
      />
      <UtilTitle class="icon" :info="{ label: '保存数据', value: 'baocunsj', icon: 'baocun-03' }" @start="doClick" />
    </div>
    <Jsgzb v-if="jsgzb.show" :show.sync="jsgzb.show" :status="status" @getGsHs="getGsHs" />
  </div>
</template>

<script>
import UtilTitle from './utilTitle'
import Jsgzb from '../dialog/jsgzb'

export default {
  name: 'FunctionPage',
  components: {
    UtilTitle,
    Jsgzb
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      jsgzb: {
        show: false
      },
      jsObj: {},
      cell: [],
      data: [],
      mergeCell: null
    }
  },
  computed: {
    getChild() {
      // eslint-disable-next-line func-names
      return function (type) {
        const childs = {
          hanshu: {
            changyonghs: {
              label: '常用函数',
              value: [
                { label: '指定期折旧值', icon: 'zhidingzj', value: 'syd' },
                { label: '线性折旧值', icon: 'xianxingzj', value: 'sln' },
                { label: '年金利率', icon: 'nianjinlv', value: 'rate' },
                { label: '投资现值', icon: 'touzixz', value: 'pv' },
                { label: '固定利率分期付款', icon: 'fenqifk', value: 'ppmt' },
                { label: '分期付款', icon: 'fenqifk', value: 'pmt' }
              ]
            },
            all: {
              label: '全部',
              value: [
                { label: '绝对值', icon: 'jueduizhi', value: 'abs' },
                { label: '反余弦', icon: 'acos', value: 'acos' },
                { label: '反双曲余弦值', icon: 'acosh', value: 'acosh' },
                { label: '条件', icon: 'if', value: 'if' },
                { label: '双倍计算', icon: 'shuangbeijs', value: 'ddb' },
                { label: '条件求和', icon: 'sumif', value: 'sumif' },
                { label: '正弦值', icon: 'sin', value: 'sin' },
                { label: '随机数', icon: 'suijishu', value: 'rand' },
                { label: '向上舍入', icon: 'ceiling', value: 'ceiling' },
                { label: '数组相关序数', icon: 'correl', value: 'correl' },
                { label: '非空计数', icon: 'counta', value: 'counta' },
                { label: '空白格计数', icon: 'countblank', value: 'countblank' },
                { label: '条件格计数', icon: 'countif', value: 'countif' },
                { label: '多个条件格计数', icon: 'countifs', value: 'countifs' },
                { label: '十进制转二进制', icon: 'dec2bin', value: 'dec2bin' },
                { label: '十进制转十六进制', icon: 'dec2hex', value: 'dec2hex' },
                { label: '十进制转八进制', icon: 'dec2oct', value: 'dec2oct' },
                { label: '测等值', icon: 'delta', value: 'delta' },
                { label: '积分', icon: 'erf', value: 'erf' },
                { label: '余误差函数', icon: 'erfc', value: 'erfc' },
                { label: '十六进制转二进制', icon: 'hex2bin', value: 'hex2bin' },
                { label: '十六进制转十进制', icon: 'hex2dec', value: 'hex2dec' },
                { label: '小时', icon: 'hour', value: 'hour' },
                { label: '是否为空单元格', icon: 'isblank', value: 'isblank' },
                { label: '#N/A错误值', icon: 'iserr', value: 'iserr' },
                { label: '检测错误值', icon: 'iserror', value: 'iserror' },
                { label: '偶数', icon: 'iseven', value: 'iseven' },
                { label: '检测逻辑值', icon: 'islogical', value: 'islogical' },
                { label: '值#N/A', icon: 'isna', value: 'isna' },
                { label: '检测文本', icon: 'isnontext', value: 'isnontext' },
                { label: '检测数值', icon: 'isnumber', value: 'isnumber' },
                { label: '检测奇数', icon: 'isodd', value: 'isodd' },
                { label: '检测引用', icon: 'isref', value: 'isref' },
                { label: '检测是否为文本', icon: 'istext', value: 'istext' },
                { label: '参数列表最大值', icon: 'maxa', value: 'maxa' },
                { label: '给定数值集合的中值', icon: 'median', value: 'median' },
                { label: '最小值', icon: 'zuixiaozhi', value: 'min' },
                { label: '参数列表最小值', icon: 'mina', value: 'mina' },
                { label: '返回错误值#N/A', icon: 'na', value: 'na' },
                { label: '八进制转二进制', icon: 'oct2bin', value: 'oct2bin' },
                { label: '八进制转十进制', icon: 'oct2dec', value: 'oct2dec' },
                { label: '八进制转十六进制', icon: 'oct2hex', value: 'oct2hex' },
                { label: '返回转置单元格区域', icon: 'transpose', value: 'transpose' }
              ]
            },
            caiwu: {
              label: '财务',
              value: [
                { label: '利息数额', icon: 'cumipmt', value: 'cumipmt' },
                { label: '本金数额', icon: 'benjinse', value: 'cumprinc' },
                { label: '折旧值', icon: 'zhejiuz', value: 'db' },
                { label: '双倍计算', icon: 'shuangbeijs', value: 'ddb' },
                { label: '未来值', icon: 'weilaiz', value: 'fv' },
                { label: '利息', icon: 'lixi', value: 'ispmt' },
                { label: '返回投资期数', icon: 'fenqifk', value: 'nper' },
                { label: '分期付款额', icon: 'fenqifk', value: 'pmt' },
                { label: '固定利率分期付款', icon: 'fenqifk', value: 'ppmt' },
                { label: '投资现值', icon: 'touzixz', value: 'pv' },
                { label: '年金利率', icon: 'nianjinlv', value: 'rate' },
                { label: '线性折旧值', icon: 'xianxingzj', value: 'sln' },
                { label: '指定期折旧值', icon: 'zhidingzj', value: 'syd' }
              ]
            },
            luoji: {
              label: '逻辑',
              value: [
                { label: '并且', icon: 'cumipmt', value: 'and' },
                { label: '假值', icon: 'benjinse', value: 'false' },
                { label: '如果', icon: 'zhejiuz', value: 'if' },
                { label: '计算错误', icon: 'shuangbeijs', value: 'iferror' },
                { label: '表达式#N/A', icon: 'weilaiz', value: 'ifna' },
                { label: '逻辑值求反', icon: 'lixi', value: 'not' },
                { label: '或', icon: 'fenqifk', value: 'or' },
                { label: '匹配', icon: 'fenqifk', value: 'switch' },
                { label: 'TRUE', icon: 'fenqifk', value: 'true' }
              ]
            },
            wenben: {
              label: '文本',
              value: [
                { label: '字符集', icon: 'zifuji', value: 'char' },
                { label: '清除', icon: 'clean', value: 'clean' },
                { label: '数字代码', icon: 'code', value: 'code' },
                { label: '合并字符串', icon: 'hebing', value: 'concatenate' },
                { label: '查找', icon: 'find', value: 'find' },
                { label: '字符串返回公式', icon: 'formulatext', value: 'formulatext' },
                { label: '左开始', icon: 'left', value: 'left' },
                { label: '字符个数', icon: 'len', value: 'len' },
                { label: '首字母大写', icon: 'proper', value: 'proper' },
                { label: '重复显示', icon: 'rept', value: 'rept' },
                { label: '右开始', icon: 'right', value: 'right' },
                { label: '从左往右查找', icon: 'search', value: 'search' },
                { label: '转文本', icon: 'text', value: 'text' },
                { label: '去空', icon: 'trim', value: 'trim' }
              ]
            },
            date: {
              label: '日期和时间',
              value: [
                { label: '日期', icon: 'riqi', value: 'date' },
                { label: '计算日期', icon: 'datedif', value: 'datedif' },
                { label: '日期序列号', icon: 'datevalue', value: 'datevalue' },
                { label: '日期天数', icon: 'day', value: 'day' },
                { label: '天数之差', icon: 'days360', value: 'days360' },
                { label: '指定日期', icon: 'edate', value: 'edate' },
                { label: '指定月数', icon: 'eomonth', value: 'eomonth' },
                { label: '小时', icon: 'hour', value: 'hour' },
                { label: '分钟', icon: 'minute', value: 'minute' },
                { label: '月份', icon: 'month', value: 'month' },
                { label: '现在', icon: 'now', value: 'now' },
                { label: '秒数', icon: 'second', value: 'second' },
                { label: '特定时间', icon: 'time', value: 'time' },
                { label: '时间字符串', icon: 'timevalue', value: 'timevalu' },
                { label: '当前日期', icon: 'today', value: 'today' },
                { label: '返回星期几', icon: 'weekday', value: 'weekday' },
                { label: '第几周', icon: 'weeknum', value: 'weeknum' },
                { label: '年', icon: 'year', value: 'year' },
                { label: '日期百分比', icon: 'yearfrac', value: 'yearfrac' }
              ]
            },
            find: {
              label: '查找与引用',
              value: [
                { label: '选择', icon: 'choose', value: 'choose' },
                { label: '列', icon: 'columns', value: 'columns' },
                { label: '索引', icon: 'index', value: 'index' },
                { label: '匹配位置', icon: 'match', value: 'match' },
                { label: '抵消', icon: 'offset', value: 'offset' },
                { label: '引用行号', icon: 'rows', value: 'rows' },
                { label: '指定查找', icon: 'vlookup', value: 'vlookup' }
              ]
            },
            math: {
              label: '数学和三角',
              value: [
                { label: '绝对值', icon: 'jueduizhi', value: 'abs' },
                { label: '反余弦', icon: 'fanyuxuan', value: 'acos' },
                { label: '反双曲余弦值', icon: 'acosh', value: 'acosh' },
                { label: '反正弦', icon: 'asin', value: 'asin' },
                { label: '反双曲正弦值', icon: 'asinh', value: 'asinh' },
                { label: '反正切值', icon: 'atan', value: 'atan' },
                { label: 'XY坐标反正切值', icon: 'atan2', value: 'atan2' },
                { label: '反双曲正切值', icon: 'atanh', value: 'atanh' },
                { label: '余弦值', icon: 'cos', value: 'cos' },
                { label: '双曲余弦值', icon: 'cosh', value: 'cosh' },
                { label: '弧度转角度', icon: 'degrees', value: 'degrees' },
                { label: '偶数', icon: 'even', value: 'even' },
                { label: '幂', icon: 'exp', value: 'exp' },
                { label: '向下取整', icon: 'int', value: 'int' },
                { label: '自然对数', icon: 'ln', value: 'ln' },
                { label: '对数', icon: 'log', value: 'log' },
                { label: '10为底的对数', icon: 'log10', value: 'log10' },
                { label: '矩阵乘积', icon: 'mmult', value: 'mmult' },
                { label: '余数', icon: 'mod', value: 'mod' },
                { label: '奇数', icon: 'odd', value: 'odd' },
                { label: '常量PI', icon: 'pi', value: 'pi' },
                { label: '乘幂', icon: 'power', value: 'power' },
                { label: '乘积之和', icon: 'sumproduct', value: 'sumproduct' },
                { label: '角度转弧度', icon: 'radians', value: 'radians' },
                { label: '随机数', icon: 'rand', value: 'rand' },
                { label: '取整', icon: 'round', value: 'round' },
                { label: '向下取舍', icon: 'rounddown', value: 'rounddown' },
                { label: '向上取舍', icon: 'roundup', value: 'roundup' },
                { label: '正弦值', icon: 'sin', value: 'sin' },
                { label: '双曲正弦值', icon: 'sinh', value: 'sinh' },
                { label: '正平方根', icon: 'sqrt', value: 'sqrt' },
                { label: '求和', icon: 'sum', value: 'sum' },
                { label: '条件求和', icon: 'sumif', value: 'sumif' },
                { label: '多条件求和', icon: 'sumifs', value: 'sumifs' },
                { label: '平方和', icon: 'sumsq', value: 'sumsq' },
                { label: '正切值', icon: 'tan', value: 'tan' },
                { label: '双曲正切', icon: 'tanh', value: 'tanh' },
                { label: '截去小数点', icon: 'trunc', value: 'trunc' }
              ]
            }
          },
          qitahs: [
            {
              label: '统计',
              icon: 'tongji',
              value: 'tongji',
              children: [
                { label: '平均偏差', icon: '', value: 'avedev' },
                { label: '平均数', icon: '', value: 'average' },
                { label: '平均值', icon: '', value: 'averagea' },
                { label: '范围平均值', icon: '', value: 'averageif' },
                { label: '密度', icon: '', value: 'betadist' },
                { label: '倒数', icon: '', value: 'betainv' },
                { label: '二项式分布密度', icon: '', value: 'binom.dist' },
                { label: '逆二项式分布值', icon: '', value: 'binom.inv' },
                { label: '二项式分布密度', icon: '', value: 'binomdist' },
                { label: '概率', icon: '', value: 'chidist' },
                { label: '反函数', icon: '', value: 'chiinv' },
                { label: '分布值', icon: '', value: 'chisq.dist' },
                { label: '分布倒数', icon: '', value: 'chisq.inv' },
                { label: '平方测试值', icon: '', value: 'chitest' },
                { label: '检验值', icon: '', value: 'confidence' },
                { label: '相关系数', icon: '', value: 'correl' },
                { label: '计数', icon: '', value: 'count' },
                { label: '计值', icon: '', value: 'counta' },
                { label: '空单元格值', icon: '', value: 'countblank' },
                { label: '指定条件单元格数', icon: '', value: 'countif' },
                { label: '指定条件行和列计数', icon: '', value: 'countifs' },
                { label: '协方差', icon: '', value: 'covar' },
                { label: '数据集协方差', icon: '', value: 'covariance.p' },
                { label: '样本协方差', icon: '', value: 'covariance.s' },
                { label: '逆二项式分布值', icon: '', value: 'critbinom' },
                { label: '偏差平方和', icon: '', value: 'devsq' },
                { label: '指数分布密度', icon: '', value: 'expondist' },
                { label: '分布概率', icon: '', value: 'fdist' },
                { label: '逆函数', icon: '', value: 'finv' },
                { label: '转换值', icon: '', value: 'fisher' },
                { label: '逆转换值', icon: '', value: 'fisherinv' },
                { label: 'f-test值', icon: '', value: 'ftest' },
                { label: 'GAMM分布密度', icon: '', value: 'gammadist' },
                { label: 'GAMM分布值', icon: '', value: 'gammainv' },
                { label: 'GAMM自然对数', icon: '', value: 'gammaln' },
                { label: '几何平均值', icon: '', value: 'geomean' },
                { label: '谐波平均值', icon: '', value: 'harmean' },
                { label: '超几何分布密度', icon: '', value: 'hypgeomdist' },
                { label: '逆对数正态分布值', icon: '', value: 'loginv' },
                { label: '对数正态分布密度', icon: '', value: 'lognormdist' },
                { label: '最大值', icon: '', value: 'max' },
                { label: '最大值', icon: '', value: 'maxa' },
                { label: '中位数', icon: '', value: 'median' },
                { label: '最小值', icon: '', value: 'min' },
                { label: '最小值', icon: '', value: 'mina' },
                { label: '正态分布密度', icon: '', value: 'norm.dist' },
                { label: '逆正态分布值', icon: '', value: 'norm.inv' },
                { label: '正态分布密度', icon: '', value: 'normdist' },
                { label: '逆正态分布值', icon: '', value: 'norminv' },
                { label: '逆正态分布值', icon: '', value: 'norminv' },
                { label: '正态分布密度', icon: '', value: 'normsdist' },
                { label: '数据集相关系数', icon: '', value: 'pearson' },
                { label: 'poisson分布密度', icon: '', value: 'poisson' },
                { label: '数据集平方相关系数', icon: '', value: 'rsq' },
                { label: '偏度', icon: '', value: 'skew' },
                { label: '样本标准偏差', icon: '', value: 'stdev' },
                { label: '样本标准偏差', icon: '', value: 'stdev.s' },
                { label: '样本标准偏差', icon: '', value: 'stdeva' },
                { label: '总体标准偏差', icon: '', value: 'stdevp' },
                { label: '总体标准偏差', icon: '', value: 'stdevpa' },
                { label: 'x值y预测值的标准偏差', icon: '', value: 'steyx' },
                { label: 'Student-t分布密度', icon: '', value: 'tdist' },
                { label: '反向Student-t分布', icon: '', value: 'tinv' },
                { label: 't-test检测值', icon: '', value: 'ttest' },
                { label: '样本方差', icon: '', value: 'var' },
                { label: '总体方差', icon: '', value: 'var.p' },
                { label: '样本方差', icon: '', value: 'var.s' },
                { label: '样本方差', icon: '', value: 'vara' },
                { label: '总体方差', icon: '', value: 'varp' },
                { label: '总体方差', icon: '', value: 'varpa' },
                { label: 'Weibull分布密度', icon: '', value: 'weibull' },
                { label: ' f-test检测值', icon: '', value: 'ztest' }
              ]
            },
            {
              label: '工程',
              icon: 'gongcheng',
              value: 'gongcheng',
              children: [
                { label: '修正Bessel函数值', icon: '', value: 'besseli' },
                { label: 'Bessel函数值', icon: '', value: 'besselj' },
                { label: '修正Bessel函数值', icon: '', value: 'besselk' },
                { label: 'Bessel函数值', icon: '', value: 'bessely' },
                { label: '二进制转十进制', icon: '', value: 'bin2dec' },
                { label: '二进制转十六进制', icon: '', value: 'bin2hex' },
                { label: '二进制转八进制', icon: '', value: 'bin2oct' },
                { label: '参数的逻辑“和”', icon: '', value: 'bitand' },
                { label: '将数字左移n位', icon: '', value: 'bitlshift' },
                { label: '参数的逻辑“与”', icon: '', value: 'bitor' },
                { label: '将数字右移n位', icon: '', value: 'bitrshift' },
                { label: '按位逻辑“异或”', icon: '', value: 'bitxor' },
                { label: '从Re和Im部分返回复数', icon: '', value: 'complex' },
                { label: '在–512到511之间的十进制数的二进制数', icon: '', value: 'dec2bin' },
                { label: '十进制转十六进制', icon: '', value: 'dec2hex' },
                { label: '十进制转八进制', icon: '', value: 'dec2oct' },
                { label: '测试两值是否相等', icon: '', value: 'delta' },
                { label: 'Gaussian误差积分值', icon: '', value: 'erf' },
                { label: 'x和无穷大之间的Gaussian误差积分互补值', icon: '', value: 'erfc' },
                { label: '十六进制转二进制', icon: '', value: 'hex2bin' },
                { label: '十六进制转十进制', icon: '', value: 'hex2dec' },
                { label: '十六进制转八进制', icon: '', value: 'hex2otc' },
                { label: '复数的绝对值（模数）', icon: '', value: 'imabs' },
                { label: '复数的参数', icon: '', value: 'imargument' },
                { label: '复数的共轭数', icon: '', value: 'imconjugate' },
                { label: '复数的余弦值', icon: '', value: 'imcos' },
                { label: '除以两个复数', icon: '', value: 'imdiv' },
                { label: '复数的指数', icon: '', value: 'imexp' },
                { label: '复数的自然对数', icon: '', value: 'imln' },
                { label: '10为底的对数', icon: '', value: 'imlog10' },
                { label: '复数的二进制对数', icon: '', value: 'imlog2' },
                { label: '复数的整数幂', icon: '', value: 'impower' },
                { label: '复数的乘积', icon: '', value: 'improduct' },
                { label: '复数的实系数', icon: '', value: 'imreal' },
                { label: '复数的正弦值', icon: '', value: 'imsin' },
                { label: '复数的平方根', icon: '', value: 'imsqrt' },
                { label: '复数的差值', icon: '', value: 'imsub' },
                { label: '复数的和', icon: '', value: 'imsum' },
                { label: '八进制转二进制', icon: '', value: 'oct2bin' },
                { label: '八进制转十进制', icon: '', value: 'oct2dec' },
                { label: '八进制转十六进制', icon: '', value: 'oct2hex' }
              ]
            },
            {
              label: '信息',
              icon: 'xinxi',
              value: 'message',
              children: [
                { label: '是否为空单元格', icon: '', value: 'ISBLANK' },
                { label: '是否为#N/A以外的错误值', icon: '', value: 'ISERR' },
                { label: '是否为错误值', icon: '', value: 'ISERROR' },
                { label: '是否为偶数', icon: '', value: 'ISEVEN' },
                { label: '引用的单元格是否为公式', icon: '', value: 'ISFORMULA' },
                { label: '是否为逻辑值', icon: '', value: 'ISLOGICAL' },
                { label: '是否为#N/A', icon: '', value: 'ISNA' },
                { label: '是否为不是文本', icon: '', value: 'ISNONTEXT' },
                { label: '是否为数值', icon: '', value: 'ISNUMBER' },
                { label: '是否为奇数', icon: '', value: 'ISODD' },
                { label: '是否为引用', icon: '', value: 'ISREF' },
                { label: '是否为文本', icon: '', value: 'ISTEXT' },
                { label: '返回#N/A', icon: '', value: 'NA' }
              ]
            }
          ]
        }
        return childs[type]
      }
    }
  },
  methods: {
    insertFunction() { // 点击插入函数
      this.$emit('insertFunction')
    },
    getGsHs(val) {
      this.$emit('update:this.$parent.model', true)
      this.jsObj = { ...val }
      this.$emit('getGsHs', {
        val,
        mergeCells: this.mergeCell
      })
    },
    verify(data) {
      let flag = null
      for (let i = 0, len = data.length; i < len; i++) {
        flag = data[i].some(l => l)
        if (flag) break
      }
      return flag
    },
    doClick(type, val) {
      console.log(type, val)
      let newType = type
      const hot = this.$parent.$refs.hotTable.hotInstance
      const parentData = this.$parent.bbList
      const { data } = this.$parent.hotSettings
      const { realData } = this.$parent.hotSettings
      const changyonghArr = ['syd', 'sln', 'rate', 'pv', 'ppmt', 'pmt']
      const allArr = ['abs', 'acos', 'acosh', 'if', 'ddb', 'sumif', 'sin', 'rand', 'ceiling', 'correl',
        'counta', 'countblank', 'countif', 'countifs', 'countifs', 'dec2bin', 'dec2hex', 'dec2oct', 'delta',
        'erf', 'erfc', 'hex2bin', 'hex2dec', 'hour', 'isblank', 'iserr', 'iserror', 'iseven', 'islogical',
        'isna', 'isnontext', 'maxa', 'median', 'min', 'mina', 'na', 'oct2bin', 'oct2dec', 'oct2hex', 'transpose'
      ]
      const caiwuArr = ['cumipmt', 'cumprinc', 'db', 'ddb', 'fv', 'ispmt', 'nper', 'pmt', 'ppmt',
        'pv', 'rate', 'sln', 'syd'
      ]
      const luojiArr = ['and', 'false', 'if', 'iferror', 'ifna', 'not', 'or', 'switch', 'true']
      const wenbenArr = ['char', 'clean', 'code', 'concatenate', 'find', 'formulatext', 'left', 'len', 'proper', 'rept',
        'right', 'search', 'text', 'trim'
      ]
      const dateArr = ['date', 'datedif', 'datevalue', 'day', 'days360', 'edate', 'eomonth', 'hour', 'minute',
        'month', 'now', 'second', 'time', 'timevalu', 'today', 'weekday', 'weeknum', 'year', 'yearfrac'
      ]
      const findArr = ['choose', 'columns', 'index', 'match', 'offset', 'rows', 'vlookup']
      const mathArr = ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cos', 'cosh',
        'degrees', 'even', 'exp', 'int', 'ln', 'log', 'log10', 'mmult', 'mod', 'odd', 'pi', 'power', 'sumproduct',
        'sumproduct', 'radians', 'rand', 'round', 'rounddown', 'roundup', 'sin', 'sinh', 'sqrt', 'sum', 'sumif',
        'sumifs', 'sumsq', 'tan', 'tanh', 'trunc'
      ]
      const tongjiArr = ['avedev', 'average', 'averagea', 'averageif', 'betadist', 'betadist', 'betainv', 'binom.dist',
        'binom.inv', 'binomdist', 'chidist', 'chiinv', 'chisq.dist', 'chisq.inv', 'chitest', 'confidence', 'correl',
        'count', 'counta', 'countblank', 'countif', 'countifs', 'covar', 'covariance.p', 'covariance.s', 'critbinom',
        'devsq', 'expondist', 'fdist', 'finv', 'fisher', 'fisherinv', 'ftest', 'gammadist', 'gammainv', 'gammaln',
        'geomean', 'harmean', 'hypgeomdist', 'loginv', 'lognormdist', 'max', 'mina', 'norm.dist', 'norm.inv',
        'normdist', 'pearson', 'poisson', 'rsq', 'skew', 'stdev', 'stdev.s', 'stdeva', 'stdevp', 'stdevpa', 'steyx',
        'tdist', 'tinv', 'ttest', 'var', 'var.p', 'var.s', 'vara', 'varp', 'varpa', 'weibull', 'ztest'
      ]
      const gongchengArr = ['besseli', 'besselj', 'besselk', 'bessely', 'bin2dec', 'bin2hex', 'bin2oct', 'bitand',
        'bitlshift', 'bitor', 'bitrshift', 'bitxor', 'complex', 'dec2bin', 'dec2hex', 'dec2oct', 'imabs', 'imargument',
        'imconjugate', 'imcos', 'imdiv', 'imexp', 'imln', 'imlog10', 'imlog2', 'impower', 'improduct', 'imreal',
        'imsin', 'imsqrt', 'imsub', 'imsum', 'oct2bin', 'oct2dec', 'oct2hex'
      ]
      const messageArr = ['ISBLANK', 'ISERR', 'ISERROR', 'ISEVEN', 'ISFORMULA', 'ISLOGICAL', 'ISNA', 'ISNONTEXT',
        'ISNUMBER', 'ISODD', 'ISREF', 'ISTEXT', 'NA'
      ]
      if (changyonghArr.includes(type)) { newType = 'hanshuFormula' }
      if (allArr.includes(type)) { newType = 'hanshuFormula' }
      if (caiwuArr.includes(type)) { newType = 'hanshuFormula' }
      if (luojiArr.includes(type)) { newType = 'hanshuFormula' }
      if (wenbenArr.includes(type)) { newType = 'hanshuFormula' }
      if (dateArr.includes(type)) { newType = 'hanshuFormula' }
      if (findArr.includes(type)) { newType = 'hanshuFormula' }
      if (mathArr.includes(type)) { newType = 'hanshuFormula' }
      if (tongjiArr.includes(type)) { newType = 'hanshuFormula' }
      if (gongchengArr.includes(type)) { newType = 'hanshuFormula' }
      if (messageArr.includes(type)) { newType = 'hanshuFormula' }
      const {
        cell,
        colWidths,
        rowHeights,
        mergeCells,
        hiddenColumns,
        hiddenRows,
        fixedRowsTop,
        fixedColumnsLeft,
        fixedRowsBottom
      } = this.save(hot, data)
      const DEAL = {
        jisuangzb: () => { // 计算工作簿
          const flag = this.verify(data)
          if (!flag) {
            this.$message.warning('请填写需要计算的数据')
          } else if (!this.status) {
            this.$parent.newData = JSON.parse(JSON.stringify(data))

            console.log(flag)
            const param = {
              id: parentData.id,
              data: JSON.stringify({
                colWidths,
                rowHeights,
                cell,
                mergeCells,
                hiddenColumns,
                hiddenRows,
                data,
                realData,
                fixedRowsTop,
                fixedColumnsLeft,
                fixedRowsBottom
              })
            }
            if (parentData.id) {
              this.$api.reportDesign.saveData(param).then(s => {
                this.jsgzb.show = true
              }).catch(e => this.$message.error(e.message))
            }
          } else this.$message.warning('当前工作薄已计算')
        },
        edit: () => {
          if (this.$parent.model !== null) {
            this.$parent.model = false
            this.$emit('update:status', false)
            this.$parent.status = false
            // this.status = false
            this.$parent.hotSettings.data = this.$parent.newData
          }
        },
        baocunsj: () => {
          const localAcset = JSON.parse(localStorage.getItem('startZT'))
          const { ztsn } = localAcset
          const param = {}
          Object.assign(param, {
            sn: `${parentData.name}_${this.jsObj.kjqj}`,
            name: parentData.name,
            fileType: parentData.fileType,
            kjnd: this.jsObj.kjnd,
            kjqj: this.jsObj.kjqj,
            unit: this.jsObj.zth,
            desc_: '',
            ztsn,
            formsId: parentData.id
          })
          if (param.kjnd === undefined || param.kjqj === undefined || param.unit === undefined) {
            this.$message.warning('请先计算工作簿')
          } else if (this.status) {
            const formData = new FormData()
            Object.keys(param).forEach(k => {
              formData.append(k, param[k])
            })
            const Obj = {
              colWidths,
              rowHeights,
              cell,
              mergeCells,
              hiddenColumns,
              hiddenRows,
              data,
              fixedRowsTop,
              fixedColumnsLeft,
              fixedRowsBottom
            }
            formData.append('data', JSON.stringify(Obj))
            this.$api.reportDesign.yzSn({ sn: param.sn }).then(s => {
              if (s.data && s.data.sn === param.sn) {
                this.$confirm(`已生成编码为${param.sn}的数据,是否覆盖`, {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.saveData(formData)
                }).catch(e => e)
              } else {
                this.saveData(formData)
              }
            }).catch(e => this.$message.error(e.message))
          } else if (!this.status) this.$message.warning('请在计算模式下点击此按钮保存数据')
        },
        hanshuFormula: () => { // 所有函数公式
          const select = hot.getSelected()
          if (select) {
            const value = `=${type}( )`
            hot.setDataAtCell(select[0][0], select[0][1], value)
          }
          hot.render()
        }
      }
      DEAL[newType]()
    },
    save(hot, data) { // 保存需要的数据
      let cell = []
      const colWidths = []
      const rowHeights = []
      let mergeCells = []
      for (let i = 0, len = data[0].length; i < len; i++) {
        colWidths.push(hot.getColWidth(i))
      }
      for (let j = 0, lenth = data.length; j < lenth; j++) {
        rowHeights.push(hot.getRowHeight(j))
      }
      cell = hot.getCellsMeta().map(l => {
        const tmp = {}
        const keys = l && Object.keys(l)
        for (let i = 0, len = keys.length; i < len; i++) {
          if (keys[i] === 'instance') {
            // eslint-disable-next-line no-continue
            continue
          }
          tmp[keys[i]] = l[keys[i]]
        }
        return tmp
      })
      this.cell = cell
      mergeCells = hot.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      this.mergeCell = JSON.parse(JSON.stringify(mergeCells))
      const hiddenColumns = { columns: hot.getPlugin('hiddenColumns').hiddenColumns, indicators: true }
      const hiddenRows = { rows: hot.getPlugin('hiddenRows').hiddenRows, indicators: true }
      const { fixedRowsTop, fixedColumnsLeft, fixedRowsBottom } = this.$parent.hotSettings
      return {
        cell,
        colWidths,
        rowHeights,
        mergeCells,
        hiddenColumns,
        hiddenRows,
        fixedRowsTop,
        fixedColumnsLeft,
        fixedRowsBottom
      }
    },
    saveData(data) { // 保存数据
      this.$http.post('/bbReportFormsDataController/add', data).then(res => {
        this.$message.success('数据保存成功，可到报表数据进行查看')
        this.$parent.hotSettings.data = this.$parent.newData
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>

<style lang="scss" scoped>
.functionPage {
  width: 100%;
  display: flex;
  .right-line {
    position: relative;
    padding-right: 5px;
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      content: '';
      display: inline-block;
      width: 1px;
      height: 100%;
      background: #e0e0e0;
    }
  }
  .function {
    min-width: 44%;
    padding: 0 10px;
    display: flex;
    .icon {
      flex-grow: 1;
    }
  }
  .formula {
    min-width: 10%;
    padding: 0 10px;
    .two-item{
      display: flex;
      font-size: 12px;
      padding: 0 0 0 5px;
      & > p{
        flex-grow: 1;
        position: relative;
        line-height: 28px;
        cursor: context-menu;
      }
      i{
        vertical-align: middle;
        margin-right: 3px;
      }
    }
  }
  .calculate {
    padding: 0 10px;
    display: flex;
    .active {
      background: #ddd;
    }
  }
}
</style>
