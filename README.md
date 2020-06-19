# zoe-ca-vue

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install zoe-ca-vue

#use
import caSignature from './components/caSignature'

# 参数
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
    
    父页面接收参数设置:
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
            CaAddress:"", //CaApi地址
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
```
