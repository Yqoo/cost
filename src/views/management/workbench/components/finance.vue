<template>
  <div style="height: 100%">
    <el-row class="main-row">
      <el-col :span="17" class="left-col">
        <div class="title">
          <img :src="require('@/assets/images/icon/zwcl.png')" alt="">
          <span>账务处理-常用功能</span>
        </div>
        <div class="left-top-box">
          <div class="one">
            <router-link :to="{ name: 'Fill'}">
              <img :src="require('@/assets/images/middleImg/tzpz.png')" alt="">
            </router-link>
            <span>填制凭证</span>
            <img :src="require('@/assets/images/middleImg/djspz.png')" alt="">
            <span>单据生凭证</span>
            <div class="divider" />
          </div>
          <div class="two">
            <i class="el-icon-caret-right" />
            <img :src="require('@/assets/images/middleImg/shpz.png')" alt="" @click="goTo('Proof', 'WSH')">
            <span>审核凭证</span>
            <div class="divider" />
          </div>
          <div class="three">
            <i class="el-icon-caret-right" />
            <img :src="require('@/assets/images/middleImg/jz.png')" alt="" @click="goTo('Proof', 'YSH')">
            <span>记账</span>
            <div class="divider" />
            <i class="el-icon-caret-right" />
          </div>
          <div class="four">
            <div class="box">
              <router-link :to="{ name: 'CarryForward'}">
                <img :src="require('@/assets/images/middleImg/zdyjz.png')" alt="">
              </router-link>
              <span>自定义结转</span>
              <img :src="require('@/assets/images/middleImg/qmjz.png')" alt="" @click="goTo('SettleAccounts')">
              <span>期末结账</span>
            </div>
            <div class="divider" />
            <i class="el-icon-caret-right" />
          </div>
          <div class="five">
            <img :src="require('@/assets/images/middleImg/cwjz.png')" alt="">
            <span>财务结账</span>
          </div>
        </div>
        <div class="title">
          <img :src="require('@/assets/images/icon/bmjfqkb.png')" alt="">
          <span>成本核算流程图</span>
        </div>
        <div class="left-middle-box">
          <!-- <img :src="require('@/assets/images/bg/cbhslc.jpg')" alt=""> -->
        </div>
      </el-col>
      <el-col :span="7" class="right-col">
        <warningBox />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {
    warningBox: () => import('../components/warningBox.vue'),
    todo: () => import('../components/todo.vue')
  },
  methods: {
    goTo(name, status = '') {
      this.$router.push({
        name,
        params: {
          status
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  height: 100%;
  .el-col {
    height: 100%;
  }
  .left-col {
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-radius: 4px;
    .left-middle-box {
      position: relative;
      height: calc(100% - 300px);
      width: 100%;
      background: url('~@/assets/images/bg/cbhslc.jpg') center center no-repeat;
      background-size: 100%;
      img {
        width: 90%;
        position: absolute;
        top: 51%;
        left: 50%;
        height: 500px;
        transform: translate(-50%, -50%);
      }
    }
  }
  .right-col {
    padding-left: 10px;
    .right-outer-box {
      height: 100%;
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
    }
  }
  .title {
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    padding: 5px 0px 5px 10px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    span {
      font-weight: bold;
      font-size: 13px;
      padding-left: 10px;
    }
  }
  .left-top-box {
    img {
      width: 60px;
      height: 50px;
      cursor: pointer;
      position: absolute;
      background: #fff;
      padding-right: 5px;
    }
    .one {
      height: 100px;
      width: 100px;
      border: 1px dashed #333;
      margin: 50px 0px 50px 100px;
      border-left: none;
      position: relative;
      & :first-child {
        top: -28px;
        right: 75px;
      }
      & :nth-child(3) {
        bottom: -23px;
        right: 75px;
      }
      & :nth-child(2) {
        position: absolute;
        top: 25px;
        left: -30px
      }
      & :nth-child(4) {
        position: absolute;
        top: 125px;
        left: -35px
      }
      .divider {
        width: 50px;
        border: 1px dashed #333;
        border-bottom: none;
        position: absolute;
        top: 48px;
        right: -53px;
      }
    }
    .two {
      position: relative;
      margin-left: 260px;
      img {
        top: -130px;
      }
      i {
        position: absolute;
        top:-108px;
        left: -10px;
        z-index: 1;
      }
      span {
        position: absolute;
        top:-75px;
      }
      .divider {
        width: 50px;
        border: 1px dashed #333;
        border-bottom: none;
        position: absolute;
        top: -103px;
        left: 60px;
      }
    }
    .three {
      margin-left: 380px;
      position: relative;
      img {
        top: -130px;
        padding-left: 10px;
      }
      i:first-child {
        position: absolute;
        top:-108px;
        left: -10px;
        z-index: 1;
      }
      span {
        position: absolute;
        top:-75px;
        left: 25px;
      }
      .divider {
        width: 50px;
        border: 1px dashed #333;
        border-bottom: none;
        position: absolute;
        top: -103px;
        left: 70px;
      }
      i:last-child {
        position: absolute;
        top:-108px;
        left: 120px;
        z-index: 1;
      }
    }
    .four {
      position: relative;
      margin-left: 520px;
      box-sizing: border-box;
      .box {
        height: 99px;
        width: 200px;
        border: 1px dashed #333;
        position: absolute;
        top: -151px;
        & :nth-child(1) {
          top: -30px;
          right: 55px;
          padding: 0px 20px;
        }
        & :nth-child(2) {
          position: absolute;
          top: 25px;
          left: 70px;
        }
        & :nth-child(3) {
          top: 70px;
          right: 55px;
          padding: 0px 20px;
        }
        & :nth-child(4) {
          position: absolute;
          top: 125px;
          left: 76px;
        }
      }
      .divider {
        width: 50px;
        border: 1px dashed #333;
        border-bottom: none;
        position: absolute;
        top: -103px;
        left: 210px;
      }
      i {
        position: absolute;
        top:-108px;
        left: 260px;
        z-index: 1;
      }
    }
    .five {
      position: relative;
      margin-left: 800px;
      img {
        top: -130px;
      }
      span {
        position: absolute;
        top: -75px;
        left: 2px;
      }
    }
  }
  #echart {
    height: calc(100vh - 400px);
    width: 100%;
    padding: 10px 0px;
  }
}
</style>
