<template>
  <div id="changeContab">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Seconds.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="second.cronEvery" label="1">
              {{ text.Seconds.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="2">
              {{ text.Seconds.interval[0] }}
              <el-input-number v-model="second.incrementIncrement" size="small" :min="1" :max="60" />
              {{ text.Seconds.interval[1]||'' }}
              <el-input-number v-model="second.incrementStart" size="small" :min="0" :max="59" />
              {{ text.Seconds.interval[2]||'' }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" class="long" label="3">
              {{ text.Seconds.specific }}
              <el-select v-model="second.specificSpecific" size="small" multiple>
                <el-option v-for="val in 60" :key="'sc' + val" :value="val-1">
                  {{ val-1 }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="4">
              {{ text.Seconds.cycle[0] }}
              <el-input-number v-model="second.rangeStart" size="small" :min="1" :max="60" />
              {{ text.Seconds.cycle[1]||'' }}
              <el-input-number v-model="second.rangeEnd" size="small" :min="0" :max="59" />
              {{ text.Seconds.cycle[2]||'' }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Minutes.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="minute.cronEvery" label="1">
              {{ text.Minutes.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="2">
              {{ text.Minutes.interval[0] }}
              <el-input-number v-model="minute.incrementIncrement" size="small" :min="1" :max="60" />
              {{ text.Minutes.interval[1] }}
              <el-input-number v-model="minute.incrementStart" size="small" :min="0" :max="59" />
              {{ text.Minutes.interval[2]||'' }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" class="long" label="3">
              {{ text.Minutes.specific }}
              <el-select v-model="minute.specificSpecific" size="small" multiple>
                <el-option v-for="val in 60" :key="'m' + val" :value="val-1">
                  {{ val-1 }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="4">
              {{ text.Minutes.cycle[0] }}
              <el-input-number v-model="minute.rangeStart" size="small" :min="1" :max="60" />
              {{ text.Minutes.cycle[1] }}
              <el-input-number v-model="minute.rangeEnd" size="small" :min="0" :max="59" />
              {{ text.Minutes.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Hours.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="hour.cronEvery" label="1">
              {{ text.Hours.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="2">
              {{ text.Hours.interval[0] }}
              <el-input-number v-model="hour.incrementIncrement" size="small" :min="0" :max="23" />
              {{ text.Hours.interval[1] }}
              <el-input-number v-model="hour.incrementStart" size="small" :min="0" :max="23" />
              {{ text.Hours.interval[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" class="long" label="3">
              {{ text.Hours.specific }}
              <el-select v-model="hour.specificSpecific" size="small" multiple>
                <el-option v-for="val in 24" :key="'h' + val" :value="val-1">
                  {{ val-1 }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="4">
              {{ text.Hours.cycle[0] }}
              <el-input-number v-model="hour.rangeStart" size="small" :min="0" :max="23" />
              {{ text.Hours.cycle[1] }}
              <el-input-number v-model="hour.rangeEnd" size="small" :min="0" :max="23" />
              {{ text.Hours.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Day.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="day.cronEvery" label="1">
              {{ text.Day.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="2">
              {{ text.Day.intervalWeek[0] }}
              <el-input-number v-model="week.incrementIncrement" size="small" :min="1" :max="7" />
              {{ text.Day.intervalWeek[1] }}
              <el-select v-model="week.incrementStart" size="small">
                <el-option v-for="val in 7" :key="'d' + val" :label="text.Week[val-1]" :value="val" />
              </el-select>
              {{ text.Day.intervalWeek[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="3">
              {{ text.Day.intervalDay[0] }}
              <el-input-number v-model="day.incrementIncrement" size="small" :min="1" :max="31" />
              {{ text.Day.intervalDay[1] }}
              <el-input-number v-model="day.incrementStart" size="small" :min="1" :max="31" />
              {{ text.Day.intervalDay[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" class="long" label="4">
              {{ text.Day.specificWeek }}
              <el-select v-model="week.specificSpecific" size="small" multiple>
                <el-option v-for="val in 7"
                           :key="'dc' + val"
                           :label="text.Week[val-1]"
                           :value="['SUN','MON','TUE','WED','THU','FRI','SAT'][val-1]"
                />
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" class="long" label="5">
              {{ text.Day.specificDay }}
              <el-select v-model="day.specificSpecific" size="small" multiple>
                <el-option v-for="val in 31" :key="'md' + val" :value="val">
                  {{ val }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="6">
              {{ text.Day.lastDay }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="7">
              {{ text.Day.lastWeekday }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="8">
              {{ text.Day.lastWeek[0] }}
              <el-select v-model="day.cronLastSpecificDomDay" size="small">
                <el-option v-for="val in 7" :key="'lw' + val" :label="text.Week[val-1]" :value="val" />
              </el-select>
              {{ text.Day.lastWeek[1]||'' }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="9">
              <el-input-number v-model="day.cronDaysBeforeEomMinus" size="small" :min="1" :max="31" />
              {{ text.Day.beforeEndMonth[0] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="10">
              {{ text.Day.nearestWeekday[0] }}
              <el-input-number v-model="day.cronDaysNearestWeekday" size="small" :min="1" :max="31" />
              {{ text.Day.nearestWeekday[1] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="11">
              {{ text.Day.someWeekday[0] }}
              <el-input-number v-model="week.cronNthDayNth" size="small" :min="1" :max="5" />
              <el-select v-model="week.cronNthDayDay" size="small">
                <el-option v-for="val in 7" :key="'wd' + val" :label="text.Week[val-1]" :value="val" />
              </el-select>
              {{ text.Day.someWeekday[1] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Month.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="month.cronEvery" label="1">
              {{ text.Month.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="2">
              {{ text.Month.interval[0] }}
              <el-input-number v-model="month.incrementIncrement" size="small" :min="0" :max="12" />
              {{ text.Month.interval[1] }}
              <el-input-number v-model="month.incrementStart" size="small" :min="0" :max="12" />
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" class="long" label="3">
              {{ text.Month.specific }}
              <el-select v-model="month.specificSpecific" size="small" multiple>
                <el-option v-for="val in 12" :key="'mt' + val" :label="val" :value="val" />
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="4">
              {{ text.Month.cycle[0] }}
              <el-input-number v-model="month.rangeStart" size="small" :min="1" :max="12" />
              {{ text.Month.cycle[1] }}
              <el-input-number v-model="month.rangeEnd" size="small" :min="1" :max="12" />
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> {{ text.Year.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="year.cronEvery" label="1">
              {{ text.Year.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="year.cronEvery" label="2">
              {{ text.Year.interval[0] }}
              <el-input-number v-model="year.incrementIncrement" size="small" :min="1" :max="99" />
              {{ text.Year.interval[1] }}
              <el-input-number v-model="year.incrementStart" size="small" :min="2020" :max="2120" />
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="year.cronEvery" class="long" label="3">
              {{ text.Year.specific }}
              <el-select v-model="year.specificSpecific" size="small" filterable multiple>
                <el-option v-for="val in 100" :key="'y' + val" :label="2020+val" :value="2020+val" />
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="year.cronEvery" label="4">
              {{ text.Year.cycle[0] }}
              <el-input-number v-model="year.rangeStart" size="small" :min="2020" :max="2120" />
              {{ text.Year.cycle[1] }}
              <el-input-number v-model="year.rangeEnd" size="small" :min="2020" :max="2120" />
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="bottom">
      <span class="value">{{ cron }}</span>
      <el-button type="info" @click="close">
        {{ text.Close }}
      </el-button>
      <el-button type="primary" @click="change">
        {{ text.Save }}
      </el-button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'VueCron',
  model: { prop: 'cronValue' },
  props: ['data', 'cronValue'],
  data() {
    return {
      // 显示为中文版本
      text: {
        Seconds: {
          name: '秒',
          every: '每一秒钟',
          interval: ['每隔', '秒执行 从', '秒开始'],
          specific: '具体秒数(可多选)',
          cycle: ['周期从', '到', '秒']
        },
        Minutes: {
          name: '分',
          every: '每一分钟',
          interval: ['每隔', '分执行 从', '分开始'],
          specific: '具体分钟数(可多选)',
          cycle: ['周期从', '到', '分']
        },
        Hours: {
          name: '时',
          every: '每一小时',
          interval: ['每隔', '小时执行 从', '小时开始'],
          specific: '具体小时数(可多选)',
          cycle: ['周期从', '到', '小时']
        },
        Day: {
          name: '天',
          every: '每一天',
          intervalWeek: ['每隔', '周执行 从', '开始'],
          intervalDay: ['每隔', '天执行 从', '天开始'],
          specificWeek: '具体星期几(可多选)',
          specificDay: '具体天数(可多选)',
          lastDay: '在这个月的最后一天',
          lastWeekday: '在这个月的最后一个工作日',
          lastWeek: ['在这个月的最后一个'],
          beforeEndMonth: ['在本月底前', '天'],
          nearestWeekday: ['最近的工作日（周一至周五）至本月', '日'],
          someWeekday: ['在这个月的第', '个']
        },
        Week: ['天', '一', '二', '三', '四', '五', '六'].map(val => `星期${val}`),
        Month: {
          name: '月',
          every: '每一月',
          interval: ['每隔', '月执行 从', '月开始'],
          specific: '具体月数(可多选)',
          cycle: ['从', '到', '月之间的每个月']
        },
        Year: {
          name: '年',
          every: '每一年',
          interval: ['每隔', '年执行 从', '年开始'],
          specific: '具体年份(可多选)',
          cycle: ['从', '到', '年之间的每一年']
        },
        Save: '保存',
        Close: '关闭'
      },
      second: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        intervalRule: /^([0-9]|[1-5]\d)\/([1-9]|[1-5]\d|60)$/,
        arrayRule: /^(([0-9]|[1-5]\d),)*([0-9]|[1-5]\d)$/,
        cycleRule: /^([1-9]|[1-5]\d|60)-([0-9]|[1-5]\d)$/
      },
      minute: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        intervalRule: /^([0-9]|[1-5]\d)\/([1-9]|[1-5]\d|60)$/,
        arrayRule: /^(([0-9]|[1-5]\d),)*([0-9]|[1-5]\d)$/,
        cycleRule: /^([1-9]|[1-5]\d|60)-([0-9]|[1-5]\d)$/
      },
      hour: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        intervalRule: /^([0-9]|1\d|2[0-3])\/([0-9]|1\d|2[0-3])$/,
        arrayRule: /^(([0-9]|1\d|2[0-3]),)*([0-9]|1\d|2[0-3])$/,
        cycleRule: /^([0-9]|1\d|2[0-3])-([0-9]|1\d|2[0-3])$/
      },
      day: {
        cronEvery: '',
        incrementStart: '1',
        incrementIncrement: '1',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: '',
        cronDaysNearestWeekday: '',
        intervalRule: /^([1-9]|[1-2]\d|3[0-1])\/([1-9]|[1-2]\d|3[0-1])$/,
        arrayRule: /^(([1-9]|[1-2]\d|3[0-1]),)*([1-9]|[1-2]\d|3[0-1])$/,
        cycleRule: /^([1-9]|[1-2]\d|3[0-1])-([1-9]|[1-2]\d|3[0-1])$/
      },
      week: {
        cronEvery: '',
        incrementStart: '1',
        incrementIncrement: '1',
        specificSpecific: [],
        cronNthDayDay: 1,
        cronNthDayNth: '1',
        arrayRule: /^((SUN|MON|TUE|WED|THU|FRI|SAT),)*(SUN|MON|TUE|WED|THU|FRI|SAT)$/,
        intervalRule: /^[1-7]\/[1-7]$/
      },
      month: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        intervalRule: /^(\d|1[0-2])\/(\d|1[0-2])$/,
        arrayRule: /^(([1-9]|1[0-2]),)*([1-9]|1[0-2])$/,
        cycleRule: /^([1-9]|1[0-2])-([1-9]|1[0-2])$/
      },
      year: {
        cronEvery: '',
        incrementStart: '2020',
        incrementIncrement: '1',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        intervalRule: /^(20[2-9]\d|21[0-1]\d|2120)\/([1-9]|[1-9]\d)$/,
        arrayRule: /^((20[2-9]\d|21[0-1]\d|2120),)*(20[2-9]\d|21[0-1]\d|2120)$/,
        cycleRule: /^(20[2-9]\d|21[0-1]\d|2120)-(20[2-9]\d|21[0-1]\d|2120)$/
      },
      output: {
        second: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        week: '',
        year: ''
      }
    }
  },
  computed: {
    secondsText() {
      let seconds = ''
      const { cronEvery } = this.second
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          seconds = '*'
          break
        case '2':
          seconds = `${this.second.incrementStart}/${this.second.incrementIncrement}`
          break
        case '3':
          // eslint-disable-next-line array-callback-return
          this.second.specificSpecific.map(val => {
            seconds += `${val},`
          })
          seconds = seconds.slice(0, -1)
          break
        case '4':
          seconds = `${this.second.rangeStart}-${this.second.rangeEnd}`
          break
      }
      return seconds
    },
    minutesText() {
      let minutes = ''
      const { cronEvery } = this.minute
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          minutes = '*'
          break
        case '2':
          minutes = `${this.minute.incrementStart}/${this.minute.incrementIncrement}`
          break
        case '3':
          // eslint-disable-next-line array-callback-return
          this.minute.specificSpecific.map(val => {
            minutes += `${val},`
          })
          minutes = minutes.slice(0, -1)
          break
        case '4':
          minutes = `${this.minute.rangeStart}-${this.minute.rangeEnd}`
          break
      }
      return minutes
    },
    hoursText() {
      let hours = ''
      const { cronEvery } = this.hour
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          hours = '*'
          break
        case '2':
          hours = `${this.hour.incrementStart}/${this.hour.incrementIncrement}`
          break
        case '3':
          // eslint-disable-next-line array-callback-return
          this.hour.specificSpecific.map(val => {
            hours += `${val},`
          })
          hours = hours.slice(0, -1)
          break
        case '4':
          hours = `${this.hour.rangeStart}-${this.hour.rangeEnd}`
          break
      }
      return hours
    },
    daysText() {
      let days = ''
      const { cronEvery } = this.day
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          break
        case '2':
        case '4':
        case '11':
          days = '?'
          break
        case '3':
          days = `${this.day.incrementStart}/${this.day.incrementIncrement}`
          break
        case '5':
          // eslint-disable-next-line array-callback-return
          this.day.specificSpecific.map(val => {
            days += `${val},`
          })
          days = days.slice(0, -1)
          break
        case '6':
          days = 'L'
          break
        case '7':
          days = 'LW'
          break
        case '8':
          days = `${this.day.cronLastSpecificDomDay}L`
          break
        case '9':
          days = `L-${this.day.cronDaysBeforeEomMinus}`
          break
        case '10':
          days = `${this.day.cronDaysNearestWeekday}W`
          break
      }
      return days
    },
    weeksText() {
      let weeks = ''
      const { cronEvery } = this.day
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
        case '3':
        case '5':
          weeks = '?'
          break
        case '2':
          weeks = `${this.week.incrementStart}/${this.week.incrementIncrement}`
          break
        case '4':
          // eslint-disable-next-line array-callback-return
          this.week.specificSpecific.map(val => {
            weeks += `${val},`
          })
          weeks = weeks.slice(0, -1)
          break
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          weeks = '?'
          break
        case '11':
          weeks = `${this.week.cronNthDayDay}#${this.week.cronNthDayNth}`
          break
      }
      return weeks
    },
    monthsText() {
      let months = ''
      const { cronEvery } = this.month
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          months = '*'
          break
        case '2':
          months = `${this.month.incrementStart}/${this.month.incrementIncrement}`
          break
        case '3':
          // eslint-disable-next-line array-callback-return
          this.month.specificSpecific.map(val => {
            months += `${val},`
          })
          months = months.slice(0, -1)
          break
        case '4':
          months = `${this.month.rangeStart}-${this.month.rangeEnd}`
          break
      }
      return months
    },
    yearsText() {
      let years = ''
      const { cronEvery } = this.year
      // eslint-disable-next-line default-case
      switch (cronEvery.toString()) {
        case '1':
          years = '*'
          break
        case '2':
          years = `${this.year.incrementStart}/${this.year.incrementIncrement}`
          break
        case '3':
          // eslint-disable-next-line array-callback-return
          this.year.specificSpecific.map(val => {
            years += `${val},`
          })
          years = years.slice(0, -1)
          break
        case '4':
          years = `${this.year.rangeStart}-${this.year.rangeEnd}`
          break
      }
      return years
    },
    cron() {
      return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'} ${this.yearsText || '*'}`
    }
  },
  watch: {
    data() {
      this.rest(this.$data)
    },
    cronValue(val) {
      this.changeTime(val)
    },
    output: {
      handler(curVal, oldVal) {
        Object.keys(curVal).forEach(key => {
          this.verifyAndConvert(key)
        })
      },
      deep: true
    }
  },
  created() {
    this.changeTime(this.cronValue)
  },
  methods: {
    getValue() {
      return this.cron
    },
    change() {
      this.$emit('change', this.cron)
      this.close()
    },
    close() {
      this.$emit('close')
    },
    rest(data) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i in data) {
        if (!(data[i] instanceof RegExp)) {
          if (data[i] instanceof Object) {
            this.rest(data[i])
          } else {
            // eslint-disable-next-line default-case
            switch (typeof data[i]) {
              case 'object': data[i] = []; break
              case 'string': data[i] = ''; break
            }
          }
        }
      }
    },
    changeTime(newValue) {
      const arr = newValue.trim().split(' ')
      // eslint-disable-next-line prefer-destructuring
      this.output.second = arr[0]
      // eslint-disable-next-line prefer-destructuring
      this.output.minute = arr[1]
      // eslint-disable-next-line prefer-destructuring
      this.output.hour = arr[2]
      // eslint-disable-next-line prefer-destructuring
      this.output.day = arr[3]
      // eslint-disable-next-line prefer-destructuring
      this.output.month = arr[4]
      // eslint-disable-next-line prefer-destructuring
      this.output.week = arr[5]
      this.output.year = arr.length === 7 ? arr[6] : ''
    },
    verifyAndConvert(key) {
      const tag = this[key]
      const value = this.output[key]
      if (value === '?') return
      if (value === '*') {
        tag.cronEvery = '1'
        if (key === 'week') {
          this.day.cronEvery = '4'
          tag.specificSpecific = []
        }
        return
      }
      if (value === 'L') {
        tag.cronEvery = '6'
        return
      }
      if (value === 'LW') {
        tag.cronEvery = '7'
        return
      }
      if (tag.intervalRule.test(value)) {
        const arr = value.trim().split('/')
        tag.cronEvery = key === 'day' ? '3' : '2'
        if (key === 'week') this.day.cronEvery = '2'
        else tag.cronEvery = key === 'day' ? '3' : '2'
        // eslint-disable-next-line radix
        tag.incrementIncrement = parseInt(arr[1])
        // eslint-disable-next-line radix
        tag.incrementStart = parseInt(arr[0])
        return
      }
      if (tag.arrayRule.test(value)) {
        const arr = value.trim().split(',')
        tag.specificSpecific = []
        if (key === 'week') {
          this.day.cronEvery = '4'
          arr.forEach(item => {
            tag.specificSpecific.push(item)
          })
          return
        }
        tag.cronEvery = key === 'day' ? '5' : '3'
        arr.forEach(item => {
          if (item && item !== '') {
            // eslint-disable-next-line radix
            tag.specificSpecific.push(parseInt(item))
          }
        })
        return
      }
      if (key !== 'week' && tag.cycleRule.test(value)) {
        const arr = value.trim().split('-')
        tag.cronEvery = '4'
        // eslint-disable-next-line radix
        tag.rangeStart = parseInt(arr[0])
        // eslint-disable-next-line radix
        tag.rangeEnd = parseInt(arr[1])
        return
      }
      if (key === 'day') {
        if (/^[1-7]L$/.test(value)) {
          tag.cronEvery = '8'
          // eslint-disable-next-line radix
          tag.cronLastSpecificDomDay = parseInt(value.charAt(0))
          return
        }
        if (/^L-([1-9]|[1-2]\d|3[0-1])$/.test(value)) {
          tag.cronEvery = '9'
          // eslint-disable-next-line radix
          tag.cronDaysBeforeEomMinus = parseInt(value.trim().split('-')[1])
          return
        }
        if (/^([1-9]|[1-2]\d|3[0-1])W$/.test(value)) {
          tag.cronEvery = '10'
          // eslint-disable-next-line radix
          tag.cronDaysNearestWeekday = parseInt(value.substr(0, value.length - 1))
          return
        }
      }
      if (key === 'week' && /^[1-7]#[1-5]$/.test(value)) {
        const arr = value.trim().split('#')
        this.day.cronEvery = '11'
        // eslint-disable-next-line prefer-destructuring
        tag.cronNthDayNth = arr[1]
        // eslint-disable-next-line prefer-destructuring
        tag.cronNthDayDay = arr[0]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#changeContab{
    .el-tabs{
        box-shadow: none;
    }
    /deep/.el-tabs__content{
        padding:0 6px !important;
        height:210px;
        overflow-y: auto;
    }
    .tabBody{
        .el-row{
            margin: 10px 0;
            .long{
                .el-select{
                    width:350px;
                }
            }
            .el-input-number{
                width: 110px;
            }
            }
    }
    .bottom{
        width: 100%;
        text-align: center;
        margin-top: 5px;
        position: relative;
        .value{
            font-size: 16px;
            vertical-align: middle;
        }
    }
}
</style>
