<script setup lang="ts">
import SubmitForm from "@/components/common/submits/SubmitForm.vue";
import {computed, ref, watch} from "vue";

const emits = defineEmits(['on-submit-terms-agree']);

const serviceTermsAgree = ref<boolean>(false);
const privacyPolicyAgree = ref<boolean>(false);

watch(serviceTermsAgree, (state) => {
  console.log(state);
})

watch(privacyPolicyAgree, (state) =>{
  console.log(state);
})

const enableNextBtn = computed(() => {
  return serviceTermsAgree.value && privacyPolicyAgree.value;
})

function onSubmitTermAgree() {
  emits("on-submit-terms-agree");
}

function onAgreeServicePolicy() {
  serviceTermsAgree.value = !serviceTermsAgree.value
}

function onAgreePrivacyPolicy() {
  privacyPolicyAgree.value = !privacyPolicyAgree.value
}

</script>

<template>
  <SubmitForm :isSubmitWaiting="false" submitResultMsg="" btnMsg="다음" :enableBtn="enableNextBtn" @on-submit="onSubmitTermAgree">
    <template v-slot:header>
      <p :class="$style['title']">약관 동의</p>
    </template>
    <template v-slot:content>
      <p :class="$style['terms-header']"><span @mousedown.left="onAgreeServicePolicy">서비스 이용약관에 동의합니다.</span> <input type="checkbox" v-model="serviceTermsAgree"></p>
    
      <pre :class="$style['terms-content']">
모두의토론 회원 가입 약관

1. 약관의 동의
'모두의토론' 웹사이트(이하 '사이트')에 회원으로 가입하시는 경우, 본 약관의 모든 조항에 동의하신 것으로 간주됩니다.

2. 회원 가입
회원 가입은 무료이며, 이메일 주소를 제공해야 합니다.

3. 회원 정보의 변경
회원은 언제든지 '내 정보' 페이지를 통해 자신의 정보를 업데이트할 수 있습니다.

4. 회원의 의무
회원은 본인의 계정 정보를 관리할 책임이 있으며, 이를 타인과 공유하거나 양도할 수 없습니다.
불법적, 비도덕적, 타인의 권리를 침해하는 행위를 금지합니다.

5. 서비스 이용
모두의토론은 실제 서비스 중인 상태가 아니며 포트폴리오로써 공개된 상태입니다. 언제든지 서비스를 사용할 수 없는 상태가 될 수 있습니다.
그런 경우, 개인정보처리방침에 의거하여 회원 정보는 일괄 삭제 처리될 것입니다. 사이트는 회원에게 다양한 온라인 토론 및 커뮤니케이션 서비스를 제공합니다. 사이트는 서비스 개선을 위해 예고 없이 서비스를 변경할 수 있습니다.

6. 개인정보 보호
사이트는 회원의 개인정보 보호를 위해 최선을 다하며, 관련 법령을 준수합니다.

7. 약관의 변경
사이트는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 사이트에 공지됩니다.

8. 면책 조항
현 모두의토론은 실제 서비스 중인 상태가 아니며 포트폴리오로써 공개된 상태입니다. 사이트는 서비스 중단에 대해 책임지지 않습니다.

9. 분쟁 해결
서비스 이용 중 발생한 분쟁은 사이트 운영 정책 및 관련 법령에 따라 해결합니다.
      </pre>
      <p :class="$style['terms-header']"><span @mousedown.left="onAgreePrivacyPolicy">개인정보 처리방침에 동의합니다.</span> <input type="checkbox" v-model="privacyPolicyAgree"></p>
      <pre :class="$style['terms-content']">
모두의토론 개인정보 처리 방침

1. 개인정보의 수집 및 이용 목적
'모두의토론'은 회원가입 및 서비스 제공을 위해 최소한의 개인정보를 수집하고 있습니다. 수집하는 개인정보 항목은 다음과 같습니다.

필수항목: 이메일 주소

2. 개인정보의 처리 및 보유 기간
모두의토론은 정식 서비스가 아닌 포트폴리오로 공개된 사이트 입니다. 때문에, 회원 정보는 매일 00시에 일괄 삭제 됩니다.

3. 개인정보의 제3자 제공
'모두의토론'은 원칙적으로 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 법적인 요구가 있는 경우 제한적으로 정보를 공유할 수 있습니다.

4. 개인정보의 안전성 확보 조치
'모두의토론'은 개인정보의 안전한 처리를 위하여 다음과 같은 보안 조치를 취하고 있습니다.

비밀번호의 암호화
접근 제한 및 관리

5. 개인정보 보호 책임자
extension.master.91@gmail.com

6. 권리 및 의무 안내
회원은 언제든지 내 정보 페이지에서 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 요청할 수도 있습니다.

7. 변경사항 공지
본 방침은 법령 및 내부 정책 변경에 따라 수시로 변경될 수 있으며, 변경사항은 웹사이트 공지사항을 통해 알려드립니다.
      </pre>
    </template>

  </SubmitForm>
</template>

<style module lang="scss">

.title {
  text-align: center;
  font-weight: bold;
  border-bottom: none;
  margin-bottom: 1rem;
}

.terms-header {
  width: 300px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  > span {
    cursor: pointer;
  }
}

.terms-header:nth-of-type(2) {
  margin-top: 1rem;
}

.terms-content {
  width: 300px;
  height: 150px;
  padding: 1rem;
  overflow: auto;
  white-space: pre-line;
  border: $border-weak-line;
  background-color: #fcfcfc;
  &::-webkit-scrollbar {
    display: none;
  }
}

</style>