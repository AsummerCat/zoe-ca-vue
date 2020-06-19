<template>
  <div>
    <caSignature ref="caSignature"
                 :showFlag="showFlag"
                 :ApiAddress="ApiAddress"
                 :CaAddress="CaAddress"
                 @encryptionValue="encryptionValue=$event"
                 @verifyUserFlag="verifyUserFlag=$event"
                 @verifyFlag="verifyFlag=$event"
                 @serialNo="serialNo=$event"
                 @userInfo="userInfo=$event"
                 @userInfoDetail="userInfoDetail=$event"
                 @caCertificationContent="caCertificationContent=$event"
                 @stampImage="stampImage=$event"
                 @caAvailable="caAvailable=$event"
                 @dataTimeStamp="dataTimeStamp=$event"

    />
    <div>============================================================</div>
    <div>============================================================</div>
    <div>============================================================</div>
    <div>============================================================</div>
    <h2>测试功能</h2>

    <div>获取CA信息</div>
    <div v-for="(value, key, index) in userInfoDetail">
      {{ key }} - {{ value }}
    </div>
    <div>============================================================</div>
    <div>检测CA是否可用</div>
    <button @click="getCheckCAStatus()">检测CA是否可用</button>
    <div>{{caAvailable}}</div>

    <div>============================================================</div>
    <div>获取CA用户</div>
    <button @click="getCAUserInfo()">获取CA用户</button>
    <div v-for="(value, key, index) in userInfo">
      {{ key }} - {{ value }}
    </div>
    <div>============================================================</div>

    <div>获取key序列号</div>
    <button @click="getSerialNo()">获取key序列号</button>
    <div>{{serialNo}}</div>


    <div>============================================================</div>

    <div>获取key证书</div>
    <button @click="getCaCertificationContent()">获取key证书</button>
    <div>{{caCertificationContent}}</div>

    <div>============================================================</div>

    <div>获取签章图片</div>
    <button @click="getCaSignPicture()">获取签章图片</button>
    <div>{{stampImage}}</div>

    <div>============================================================</div>

    <input v-model="passWord">
    <button @click="loginCA(passWord)">发送密码</button>
    <div>密码:{{passWord}}</div>
    <div>检验是否通过:{{verifyUserFlag}}</div>

    <div>============================================================</div>

    <input v-model="originalText">
    <button @click="encryptCA(originalText)">发送原文</button>
    <div>加密原文:{{originalText}}</div>
    <div>加密密文:{{encryptionValue}}</div>

    <div>============================================================</div>
    <button @click="decodeCA(originalText,encryptionValue)">发送密文</button>
    <div>验签情况:{{verifyFlag}}</div>
    <div>============================================================</div>

    <div>============================================================</div>
    <button @click="getTimeStamp(originalText)">发送原文获取时间戳</button>
    <div>获取时间戳:{{dataTimeStamp}}</div>
    <div>============================================================</div>
  </div>
</template>

<script>
  import caSignature from './components/caSignature'

  export default {
    data() {
      return {
        showFlag: false, //开启调试
        originalText: '',//原文
        encryptionValue: '',//密文
        passWord: '',//检验密码后才能签名
        verifyUserFlag: false, //用户密码校验
        verifyFlag: false, //验签是否成功
        serialNo: '', //系列号
        userInfo: {}, //获取CA用户
        userInfoDetail: {},//CA信息
        ApiAddress:"", //获取系统参数的api地址
        CaAddress:"http://localhost:8070/sent/xxx", //CaApi地址
        caCertificationContent:"",
        stampImage:"", //盖章图片
        caAvailable:false, //CA是否可用
        dataTimeStamp:"",//时间戳
      }
    },
    components: {caSignature},
    methods: {
      encryptCA() {//加密
        this.$refs.caSignature.getCaSignature(this.originalText);
      },
      loginCA() {//登录CA
        this.$refs.caSignature.checkPassword(this.passWord);
      },
      decodeCA() {//解密
        this.$refs.caSignature.checkSignature(this.originalText, this.encryptionValue);
      },
      getSerialNo(){ //获取序列号
        this.$refs.caSignature.getCAKeySerial();
      },
      getCaCertificationContent(){//获取key证书
        this.$refs.caSignature.getCACertificationInfo();
      },
      getCaSignPicture(){//获取签章图片
        this.$refs.caSignature.getCaSignPicture();
      },
      getCheckCAStatus(){//获取CA是否可用
        this.$refs.caSignature.checkCAStatus();
      },
      getCAUserInfo(){//获取CA用户
        this.$refs.caSignature.getCAUserInfo();
      },
      getTimeStamp(){ //获取时间戳
        this.$refs.caSignature.getTimeStamp(this.originalText);
      }

    }
  }
</script>

<style>

</style>
