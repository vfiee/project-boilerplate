<template>
  <div id="softphone-bar" class="inline-block">
    <div id="phone_bar" class="clearFix">
      <div class="f-l" style="margin-top: 2px" v-if="!callStore.logged">
        <button @click="sign" type="button" class="btn btn-primary margin-r5">
          签入
        </button>
      </div>
      <div class="btn-group f-l">
        <button
          id="HoldEnable"
          type="button"
          class="btn btn-primary margin-r5"
          style="display: none"
          onclick="holly.hold();"
        >
          保持
        </button>
        <button
          id="HoldGetEnable"
          type="button"
          class="btn btn-primary margin-r5"
          onclick="holly.unHold();"
          style="display: none"
        >
          恢复
        </button>
        <div class="hidden">
          <button
            id="TransferEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.openTransferOrConsult('softphone_transfer');"
          >
            转接
          </button>
          <button
            id="ConsultTransferEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.transfer('9123456', 'number');"
          >
            转接
          </button>
          <button
            id="ConsultEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.openTransferOrConsult('softphone_consult');"
          >
            咨询
          </button>
          <button
            id="InvestigateEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.investigate();"
          >
            转调查
          </button>
          <button
            id="ValidateEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.validate();"
          >
            转验证
          </button>
          <button
            id="ThreeWayCallEnable"
            class="btn btn-primary margin-r5"
            style="display: none"
          >
            三方
          </button>
          <button
            id="ConsultThreeWayCallEnable"
            type="button"
            class="btn btn-primary margin-r5"
            style="display: none"
            onclick="holly.threeWayCall('9123456');"
          >
            三方
          </button>
          <button
            id="StopConsultEnable"
            type="button"
            class="btn btn-danger margin-r5"
            style="display: none"
            onclick="holly.stopConsult();"
          >
            结束咨询
          </button>
        </div>
        <button
          id="HangupEnable"
          type="button"
          class="btn btn-danger margin-r5"
          onclick="holly.hangup();"
          style="display: none"
        >
          挂机
        </button>
      </div>
      <div class="f-l">
        <input
          id="dialout_input"
          class="span2"
          type="text"
          value=""
          placeholder="请输入电话号码"
          style="display: none"
        />
        <button
          id="DialEnable"
          class="btn btn-primary margin-r5"
          type="button"
          @click="call()"
          style="display: none"
        >
          呼叫
        </button>
      </div>
      <div class="state_group f-l clearFix">
        <div id="softphone_phonestate" class="f-l state">未签入</div>
        <div id="softphone_dropdown" class="f-l state_dropdown">
          <b id="softphone_dropdown_caret" class="caret"></b>
        </div>
        <div id="softphone_timer" class="f-l state_time">00:00:00</div>
        <div id="softphone_otherstate" class="customer_db"></div>
      </div>
      <div class="f-l" style="margin-top: 2px">
        <button
          id="softPhoneBarKick"
          type="button"
          class="btn btn-primary margin-r5"
          style="display: none"
        >
          签出
        </button>
        <button
          id="softPhoneBarPick"
          type="button"
          class="btn btn-primary margin-r5"
          style="display: none"
        >
          签入
        </button>
      </div>
      <div
        class="f-l margin-t5"
        id="softWaitCountTotalDiv"
        style="display: none"
      >
        排队数：<span id="softWaitCountTotal">0 </span>
      </div>
      <!--以下代码仅使用webrtc时，需要引入-->
      <div
        id="AcceptBellingEnable"
        style="display: none; margin-left: 5px"
        onclick="holly.webRtc.processWebRTCButton('accept')"
      >
        <img
          src="http://a6.7x24cc.com/softPhone/img/accept.png"
          alt=""
          style="width: 22px; vertical-align: 2px; cursor: pointer"
        />
      </div>
      <div
        id="RefuseBellingEnable"
        style="display: none; margin-left: 5px"
        onclick="holly.webRtc.processWebRTCButton('reject')"
      >
        <img
          src="http://a6.7x24cc.com/softPhone/img/refuse.png"
          alt=""
          style="width: 22px; vertical-align: 2px; cursor: pointer"
        />
      </div>
      <div class="hidden">
        <div
          class="btn-group-dial"
          id="DialPlateBtnEnable"
          style="margin-top: 2px; display: none"
        >
          <button
            id=""
            type="button"
            class="btn btn-primary"
            onclick="holly.webRtc.showNum()"
          >
            拨号盘
          </button>
          <!--拨号盘-->
          <div class="dial-wrap" id="dial_plate" style="display: none">
            <div class="dial-phone-num">
              <span
                class="pushed1"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 1)"
                >1</span
              >
              <span
                class="pushed2"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 2)"
                >2</span
              >
              <span
                class="pushed3"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 3)"
                >3</span
              >
              <span
                class="pushed4"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 4)"
                >4</span
              >
              <span
                class="pushed5"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 5)"
                >5</span
              >
              <span
                class="pushed6"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 6)"
                >6</span
              >
              <span
                class="pushed7"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 7)"
                >7</span
              >
              <span
                class="pushed8"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 8)"
                >8</span
              >
              <span
                class="pushed9"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 9)"
                >9</span
              >
              <span
                class=""
                onclick="holly.webRtc.processWebRTCButton('dtmf', '*')"
                >*</span
              >
              <span
                class="pushed0"
                onclick="holly.webRtc.processWebRTCButton('dtmf', 0)"
                >0</span
              >
              <span
                class=""
                onclick="holly.webRtc.processWebRTCButton('dtmf', '#')"
                >#</span
              >
            </div>
          </div>
        </div>
      </div>

      <!--webrtc结束-->
    </div>
    <div id="softphone-bar-bgdiv" class="softphone-transfer-bg-div"></div>
    <div id="softphone_consult" class="softphone-transfer-div"></div>
    <div id="softphone_transfer" class="softphone-transfer-div"></div>
    <div id="icc_event"></div>
  </div>
</template>

<script setup>
import { useAssistantStore, useCallStore } from '@/pages/index/stores'
import { message } from 'ant-design-vue'

const assistantStore = useAssistantStore()

window.hollyglobal = {
  //软电话条登录成功回调函数
  loginSuccessCallback: function (peer) {
    console.log('loginSuccessCallback: ')
    console.log(peer)
  },
  //软电话条登录失败回调函数
  loginFailureCallback: function (peer) {
    console.log('loginFailureCallback: ')
    console.log(peer)
  },
  //来电事件回调函数
  ringEvent: async function (peer) {
    console.log('ringEvent: ', peer)
    console.dir(peer)
    await assistantStore.connect()
  },
  // 接通事件回调函数
  talkingEvent: function (peer) {
    console.log('接通事件回调函数', peer)
    console.dir(peer)
  },
  // 挂机事件回调函数
  hangupEvent: function (peer) {
    console.log('hangupEvent: ')
    console.log(peer)
  },
  isDisplayInvestigate: true, //是否开启转满意功能
  isDisplayConsult: false, //是否开启咨询功能
  isDisplayTransfer: true, //是否开启转接
  isDisplayValidate: true, //是否开启转验证
  isHiddenNumber: false // 是否开启隐藏号码功能
}

const callStore = useCallStore()

const sign = () => {
  if (!callStore.loaded) return
  if (callStore.account && callStore.password) {
    holly.loginPhoneBar(callStore.account, callStore.password, 'sip')
    callStore.logged = true
  } else {
    message.error('当前账号未配置外呼坐席!')
  }
}

const call = callStore.dial
</script>

<style lang="less" scoped></style>
