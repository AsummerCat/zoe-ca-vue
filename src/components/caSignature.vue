<template>
  <div v-show="showFlag">
    <div>CA启用状态:============================>{{caEnableState}}</div>
    <div>证书信息:==============================>{{caCertificationContent}}</div>
    <div>盖章图片:==============================>{{stampImage}}</div>
    <div>ca厂家:================================>{{caFactory}}</div>
    <div>序列号:================================>{{serialNo}}</div>
    <div>用户身份信息:==========================>{{userIdInfo}}</div>
    <div>密文:==================================>{{encryptionValue}}</div>
    <div>验签是否成功:==========================>{{verifyFlag}}</div>
    <div>CA证书有效性验证:======================>{{checkCaValidState}}</div>
    <div>验签是否成功:==========================>{{verifyFlag}}</div>
    <div>用户身份信息(身份证):==================>{{userIdInfo}}</div>
    <br/>
    <br/>
    <div>userInfoDetail.用户名:=================>{{userInfoDetail.username}}</div>
    <div>userInfoDetail.序列号:=================>{{userInfoDetail.serialNo}}</div>
    <div>userInfoDetail.用户身份信息:===========>{{userInfoDetail.userIdInfo}}</div>
    <div>userInfoDetail.证书信息:===============>{{userInfoDetail.caCertificationContent}}</div>
    <br/>
    <br/>
    <div>userInfo.用户名:=======================>{{userInfo.username}}</div>
    <div>userInfo.用户身份信息(身份证):========>{{userInfo.userIdInfo}}</div>
  </div>
</template>

<script>
  import {
    GetUserList,
    GetPic,
    GetSignCert,
    GetExtCertInfoByOID,
    SetOnUsbKeyChangeCallBack,
    VerifyUserPIN,
    SignedData,
    ValidateCert,
    VerifySignedData
  } from "../js/bjxtx/XTXSAB.js";

  export default {
    name: 'zoe-ca-vue',
    data() {
      return {
        caEnableState: false, //CA启用状态
        caCertificationContent: '',//证书信息
        stampImage: '',   //盖章图片
        caFactory: '', //ca厂家
        serialNo: '',//序列号
        userIdInfo: '',//用户身份信息
        encryptionValue: '',//密文
        verifyFlag: false,//验签是否成功
        checkCaValidState: false, //CA证书有效性验证
        verifyUserFlag: false, //用户密码校验
        caAvailable: false, //CA是否可用
        userInfoDetail: {
          username: '', //用户名
          serialNo: '', //序列号
          userIdInfo: '', //用户身份信息
          caCertificationContent: '' //证书信息
        },
        userInfo: {
          username: '', //用户名
          userIdInfo: '', //用户身份信息(身份证)
        },
      }
    },
    props: {
      showFlag: { //是否开启调试
        type: Boolean,
        default: 'false'
      },
      ApiAddress: { //API地址
        type: String,
        default: ''
      },
      CaAddress: { //CA服务器地址
        type: String,
        default: ''
      },
    },

    methods: {
      //获取系统参数厂商
      getCaFactory() {
        //发送ajax请求;
        let data = "bjxtx";
        this.caFactory = data;


        /**
         * ********
         * 测试
         * ********
         */
        this.caEnableState = true;
        if (this.caEnableState) {
          //开启监听
          this.interpositionMonitor();
          //获取CA数据
          this.getCAInfo();
        }
        /**
         * ********
         * 测试
         * ********
         */
        //获取系统参数
        // let paramList = [
        //     {paramEnglishName:"CA_ENABLE_STATE"},
        //     {paramEnglishName:"CA_VENDOR"}
        //   ];
        // this.$getSysParamList({paramEnglishNameList: paramList}).then(data=>{
        //   console.log(data[0].paramValue);
        //   console.log(data[1].paramValue);
        //   this.caFactory = data[1].paramValue;
        //   //如果开启CA
        //    this.caEnableState= 1===data[0].paramValue;
        //   if(this.caEnableState){
        //     //开启监听
        //     this.checkCAStatus();
        //     //获取CA数据
        //     this.getCAInfo();
        //   }
        // });
      },

      //返回key用户信息
      getCAInfo() {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          GetUserList(
            function (res) {
              if (res.retVal != "") {
                let data = res.retVal.split("||");
                _sel.serialNo = data[1].replace("&&&", "");
                _sel.userInfoDetail.username = data[0];
                _sel.userInfoDetail.serialNo = data[1].replace("&&&", "");
                _sel.caAvailable = true;
                //检验证书有效性并获取证书
                _sel.getCaValidState();
                //获取盖章
                _sel.getCaSignPicture();
              } else {
                _sel.caAvailable = false;
              }
              _sel.$emit('userInfoDetail', _sel.userInfoDetail);
            }
          );
        }
      },
      //获取key序列号
      getCAKeySerial() {
        if (this.caFactory === 'bjxtx') {
          this.serialNo;
        }
        this.$emit('serialNo', this.serialNo);
      },
      //测CA是否可用
      checkCAStatus() {
        if (this.caFactory === 'bjxtx') {
          this.$emit('caAvailable', this.caAvailable);
        }
      },
      //获取CA用户
      getCAUserInfo() {
        if (this.caFactory === 'bjxtx') {
          this.userInfo.username = this.userInfoDetail.username;
          this.userInfo.userIdInfo = this.userInfoDetail.userIdInfo;
        }
        this.$emit('userInfo', this.userInfo);
      },

      //获取key证书
      getCACertificationInfo() {
        if (this.caFactory === 'bjxtx') {
          if (this.serialNo == "") {
            alert("请插入USBKey");
            return;
          }
          let _sel = this;
          this.caCertificationContent = GetSignCert(this.serialNo,
            function (res) {
              if (res.retVal != "") {
                _sel.caCertificationContent = res.retVal;
                _sel.userInfoDetail.caCertificationContent = res.retVal;
                _sel.getIdCard();
              } else {
                _sel.caCertificationContent = "";
                _sel.userInfoDetail.caCertificationContent = "";
              }
              _sel.$emit('caCertificationContent', _sel.caCertificationContent);
            });
        }
      },

      //获取签章图片
      getCaSignPicture() {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          GetPic(this.serialNo,
            function (res) {
              if (res.retVal != "") {
                _sel.stampImage = res.retVal;
              } else {
                _sel.stampImage = "";
              }
              _sel.$emit('stampImage', _sel.stampImage);
            });
        }
      },
      //实现CA签名
      getCaSignature(originalText) {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          SignedData(this.serialNo, originalText,
            function (res) {
              if (res.retVal != "") {
                console.log("CA数据签名成功");
                _sel.encryptionValue = res.retVal;
              } else {
                console.log("CA数据签名失败");
                _sel.encryptionValue = "";
              }
              _sel.$emit('encryptionValue', _sel.encryptionValue);
            });
        }
      },
      // 获取时间戳
      getTimeStamp(originalText) {
        let _sel = this;
        if (this.CaAddress == null || this.CaAddress == '' || this.CaAddress == undefined) {
          alert("未配置CA服务器");
          return
        }
        if (originalText == null || originalText == '' || originalText == undefined) {
          alert("未填写原文");
        }
        this.axios.get(this.CaAddress, {
          params: {
            dataVal: originalText
          }
        }).then(function (res) {
          _sel.$emit('dataTimeStamp', res.data);
        })

      },
      //校验密码
      checkPassword(passWord) {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          VerifyUserPIN(this.serialNo, passWord,
            function (res) {
              if (res.retVal == true) {
                console.log("校验PIN码成功");
                _sel.verifyUserFlag = true;
              } else {
                console.log("校验PIN码失败");
                _sel.verifyUserFlag = false;
              }
              _sel.$emit('verifyUserFlag', _sel.verifyUserFlag);
            });
        }
      },
      //校验签名
      checkSignature(originalText, signValue) {
        if (this.caFactory === 'bjxtx') {
          if (!this.checkCaValidState) {
            alert("证书非法");
            return;
          }
          let _sel = this;
          VerifySignedData(this.caCertificationContent, originalText, signValue,
            function (res) {
              if (res.retVal == true) {
                console.log("数据验签成功")
                _sel.verifyFlag = true;
              } else {
                console.log("数据验签失败")
                _sel.verifyFlag = false;
              }
              _sel.$emit('verifyFlag', _sel.verifyFlag);
            });
        }
      },


      //根据证书获取身份证
      getIdCard() {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          if (this.caCertificationContent == "") {
            return;
          }
          let RSA = '2.16.840.1.113732.2';
          GetExtCertInfoByOID(this.caCertificationContent, RSA,
            function (res) {
              if (res.retVal != "") {
                _sel.userIdInfo = res.retVal;
                _sel.userInfoDetail.userIdInfo = res.retVal;
                //获取CA用户
                _sel.getCAUserInfo();
              } else {
                _sel.userIdInfo = "";
                _sel.userInfoDetail.userIdInfo = "";
              }
            });
        }
      },
      //验证证书有效性
      getCaValidState() {
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          ValidateCert(this.caCertificationContent,
            function (res) {
              //alert(res.retVal)
              if (res.retVal == 0) {
                _sel.checkCaValidState = true;
                _sel.getCACertificationInfo();
                console.log("证书合法！");
              } else {
                _sel.checkCaValidState = false;
                console.log("证书失效！");
              }
            });
        }
      },
      interpositionMonitor() {//监听CA状态
        if (this.caFactory === 'bjxtx') {
          let _sel = this;
          SetOnUsbKeyChangeCallBack(function () {
            console.info("用户拔插Key,重新加载数据");
            _sel.clearData();
            _sel.clearParentData();
            _sel.getCAInfo();
          });
        }
      },

      //清除数据
      clearData() {
        //clear data
        this.userInfoDetail = [];
        this.stampImage = "";
        this.userInfo = [];
        this.userIdInfo = [];
        this.caCertificationContent = '';
        this.stampImage = '';
        this.serialNo = '';
        this.encryptionValue = '';
        this.verifyFlag = false;
        this.checkCaValidState = false; //CA证书有效性验证
        this.verifyUserFlag = false;
        this.caAvailable = false;
      },
      clearParentData() {
        this.$emit('userInfoDetail', this.userInfoDetail);
        this.$emit('serialNo', this.serialNo);
        this.$emit('userInfo', this.userInfo);
        this.$emit('caCertificationContent', this.caCertificationContent);
        this.$emit('stampImage', this.stampImage);
        this.$emit('encryptionValue', this.encryptionValue);
        this.$emit('verifyUserFlag', this.verifyUserFlag);
        this.$emit('verifyFlag', this.verifyFlag);
        this.$emit('userIdInfo', this.userIdInfo);

      }
    },
    created() {
      this.getCaFactory();
    },


  }
</script>
