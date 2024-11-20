
<h1> 🎉 외국어 배우고 싶은 사람 다 나한테 말해봐! ONE PEAK </h1>

<br>


![인트로](https://github.com/user-attachments/assets/d6091c81-ee7f-4fd6-91c8-114c585f3cd4)


</div>

<br><br>

# 👨‍🏫 프로젝트 소개

**OnePick** 은 외국어를 배우고 싶은 사람들이 챗봇 및 화상 통화 그리고 퀴즈를 풀며 공부할 수 있는 서비스입니다.

**ONE PEAK**은 '누군가와 소통하고 함께 성장하는 최고의 정점을 향해 나아가자'는 의미를 담아,

‘Someone to speak'와 산봉우리 peak를 결합해 탄생한 이름입니다.

저희와 함께 **챗봇, 화상 통화** 그리고 **퀴즈**를 풀며 외국어 공부하러 가볼까요? 🏃‍♂️💨

<br><br>

# 🔗 배포 링크

| [원픽-ONEPEAK](https://one-peak-dev.vercel.app/) | 📱 모바일 | 🖥️  웹 |
|--------|--------|--------|


<br><br>


# 👨‍👩‍👧‍👦 팀 소개

|                    권다정                    |                    김병엽                    |                     김서연                     |                    박민정                    |                 안수영                 |
| :------------------------------------------: | :------------------------------------------: | :--------------------------------------------: | :------------------------------------------: | :------------------------------------: |
| [@kwondajung](https://github.com/kwondajung) | [@Byoung-yup](https://github.com/Byoung-yup) | [@kimseoyun98](https://github.com/kimseoyun98) | [@mingjeongg](https://github.com/mingjeongg) | [@soo0297](https://github.com/soo0297) |
| AI 튜터 / 메인페이지 / 캘린더 / STT | 전역상태관리 / 화상통화 / 실시간채팅 / STT | 마이페이지 / 챌린지 / PWA / AI프롬프팅 | 관리자페이지 / 1:1문의 / 신고하기 / 미들웨어 | 초기 설정 페이지 / AI코칭 / 오답노트 / TTS |


<br><br>


# 🕰️ 개발 기간
2024/10/18 ~ 2024/11/21 (총 5주)


<br><br>


# 📊 기술적 의사 결정

### **Next.js**

> 서버 사이드 렌더링 (SSR)을 기본적으로 지원해, **페이지 로딩 속도와 SEO 성능을 향상**시킵니다. 또한, 파일 및 폴더 구조로 라우트를 자동 생성해서, 개발을 단순화하고 코드의 가독성을 높이기 때문에 선택하였습니다.

### **TypeScript**

> 코드 작성 시점에 오류를 미리 잡아내어 **안정성과 유지 보수성**을 높여주는 장점이 있기 때문에 선택하였습니다.

### **TanstackQuery**

> 주로 API를 활용하는 서비스이기 때문에, 동일한 데이터에 대한 **불필요한 중복 요청을 줄이기 위하여** 선택하였고, 백그라운드에서 데이터를 업데이트하여 새로고침을 하지 않아도 바로 데이터 반영이 되게끔 하기 위함도 있습니다.

### **Zustand**

> 모바일 사이즈일 때의 UI와 PC 사이즈일 때의 UI가 많이 다른 페이지들이 있는데, **화면 크기의 상태를 관리**하기 위하여 선택했습니다. Redux와 달리 보일러플레이트 없이 간단하게 구현할 수 있으며, Context API와 달리 불필요한 리렌더링이 없다는 장점이 있습니다.

### **Tailwind CSS**

> 별도의 CSS 파일이나 styled-components 없이도 빠르게 스타일링을 할 수 있으며 **클래스명만으로도** 어떤 스타일이 적용되었는지 **직관적**으로 알 수 있다는 장점 때문에 선택하였습니다.

### **open AI API**

> **섬세한 프롬프트 엔지니어링**이 가능하고 **다양한 모델**을 상황에 맞게 선택할 수 있다는 장점이 있습니다. 이 프로젝트에서는 일반적인 AI와 TTS, STT 기능을 지원하는 AI 두 가지가 필요했는데, open AI의 gpt-whisper 모델이 해당 기능을 제공하고 있기 때문에 선택하였습니다. 추가로 안정적인 응답 품질과 많은 레퍼런스들이 있다는 장점도 있습니다.

### **Vercel**

> 저희가 선택한 Next.js가 만든 회사가 Vercel이라 Next.js **프로젝트에 대한 최적화**가 높은 수준으로 지원되며, git 연동을 통한 **자동 배포**, 실시간 분석 등의 기능이 있다는 장점 때문에 선택하였습니다.

### **PWA**

> 모바일 중심의 서비스이기 때문에 사용자의 모바일 디바이스에도 **알림**이 갈 수 있도록 하기 위해 선택하였습니다.

### **WebRTC**

> 실시간 화상 채팅이라는 기능을 위해 **브라우저 간 직접 연결**을 가능하게 하여 비디오, 오디오, 텍스트 데이터 등을 실시간으로 전송할 수 있게 해주는 기술이기 때문에 선택하였습니다.

### **TTS (Text-to-Speech)**

> 이 프로젝트는 Text-to-Speech (TTS) 기능을 사용하여 텍스트를 음성으로 변환할 수 있습니다. 이를 통해 사용자가 텍스트 콘텐츠를 쉽게 들을 수 있으며, 학습을 더욱 직관적이고 효율적으로 할 수 있습니다.

### **STT (Speech-to-Text)**

> Speech-to-Text (STT) 기능을 통해 사용자는 음성으로 입력할 수 있습니다. 이 기능은 사용자의 음성을 실시간으로 텍스트로 변환하여, 보다 직관적인 사용자 경험을 제공합니다.


<br><br>


# 📂 폴더 구조

<details>

  <summary> file tree 열어주세요! </summary>
  
```
📦src
 ┣ 📂api
 ┃ ┣ 📂firstSetting # 첫 회원 설정 관련 API
 ┃ ┃ ┣ 📜fetchLanguageName.ts
 ┃ ┃ ┗ 📜fetchMyLanguage.ts
 ┃ ┣ 📂openAI # OpenAI 관련 API
 ┃ ┃ ┣ 📜gpt.ts
 ┃ ┃ ┣ 📜tts.ts
 ┃ ┃ ┗ 📜whisper.ts
 ┃ ┗ 📂supabase # 데이터베이스 연동 관련 API
 ┃ ┃ ┣ 📜admin.ts
 ┃ ┃ ┣ 📜chat.ts
 ┃ ┃ ┣ 📜getUserClient.ts
 ┃ ┃ ┣ 📜getUserServer.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜match.ts
 ┃ ┃ ┗ 📜record.ts
 ┣ 📂app
 ┃ ┣ 📂(desktop) # 어드민 페이지
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┣ 📂aiPromptManagement
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂alarmManagement
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂blockManagement
 ┃ ┃ ┃ ┃ ┣ 📂[blockedUserId]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂faqManagement
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂languageManagement
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂userManagement
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📂(mobile)
 ┃ ┃ ┣ 📂attendance
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂challenge
 ┃ ┃ ┃ ┣ 📂grammar
 ┃ ┃ ┃ ┃ ┣ 📂(quiz)
 ┃ ┃ ┃ ┃ ┃ ┣ 📂English
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📂Korean
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂result
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📂wrongAnswerNote
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂word
 ┃ ┃ ┃ ┃ ┣ 📂(quiz)
 ┃ ┃ ┃ ┃ ┃ ┣ 📂English
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📂Korean
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂result
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📂wrongAnswerNote
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┣ 📂report
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂room
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┣ 📜Coaching.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜InputField.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜MessageList.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜MyChat.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜OhterChat.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂chatbot
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂lesson
 ┃ ┃ ┃ ┣ 📂room
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂loginInfo
 ┃ ┃ ┃ ┣ 📂marketingConsent
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂setLearnLanguage
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂setMyLanguage
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📂setNickname
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂myPage
 ┃ ┃ ┃ ┣ 📂(Detail)
 ┃ ┃ ┃ ┃ ┣ 📂faq
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂privacyPolicy
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂servicePolicy
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂settings
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📂subscription
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂editProfile
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂notifications
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂review
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂reviewList
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜Matching.tsx
 ┃ ┃ ┣ 📜ScreenSizeInitializer.tsx
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂(challange)
 ┃ ┃ ┃ ┣ 📂fetchGrammarQuiz
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂fetchWordQuiz
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂getRandomQuiz
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┗ 📂saveUserAnswer
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂chatBotMessage
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂chatBotSpeechToText
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂chatGeneration
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂speechToText
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┗ 📂textToSpeech
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📂callback
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂test
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂types
 ┃ ┃ ┗ 📂chatBotType
 ┃ ┃ ┃ ┗ 📜chatBotType.ts
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜global-error.tsx
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┣ 📜manifest.ts
 ┃ ┗ 📜provider.tsx
 ┣ 📂assets
 ┃ ┣ 📂chat
 ┃ ┃ ┗ 📜dots-three.svg
 ┃ ┣ 📂chatbot
 ┃ ┃ ┗ 📜return.svg
 ┃ ┣ 📂home
 ┃ ┃ ┣ 📜cafe.svg
 ┃ ┃ ┣ 📜food.svg
 ┃ ┃ ┣ 📜mart.svg
 ┃ ┃ ┣ 📜shop.svg
 ┃ ┃ ┣ 📜subway.svg
 ┃ ┃ ┗ 📜trip.svg
 ┃ ┣ 📂lesson
 ┃ ┃ ┣ 📜camera.svg
 ┃ ┃ ┣ 📜lesson-background.svg
 ┃ ┃ ┣ 📜lesson-charactor.svg
 ┃ ┃ ┣ 📜microphone.svg
 ┃ ┃ ┣ 📜power.svg
 ┃ ┃ ┣ 📜prohibit.svg
 ┃ ┃ ┗ 📜tablets-lesson-background.svg
 ┃ ┣ 📂result
 ┃ ┃ ┣ 📜one-point.svg
 ┃ ┃ ┣ 📜three-point.svg
 ┃ ┃ ┣ 📜two-point.svg
 ┃ ┃ ┗ 📜zero-point.svg
 ┃ ┣ 📂wrongAnswerNote
 ┃ ┃ ┗ 📜speaker-high.svg
 ┃ ┣ 📜active-check.svg
 ┃ ┣ 📜app-icon.png
 ┃ ┣ 📜arrow-Up.svg
 ┃ ┣ 📜bell-ringing.svg
 ┃ ┣ 📜calendar.svg
 ┃ ┣ 📜camera-icon.svg
 ┃ ┣ 📜caret-left.svg
 ┃ ┣ 📜caret-up.svg
 ┃ ┣ 📜chal-icon.svg
 ┃ ┣ 📜chall-icon-grammar.svg
 ┃ ┣ 📜chall-icon-word.svg
 ┃ ┣ 📜chat-icon.svg
 ┃ ┣ 📜check-icon.svg
 ┃ ┣ 📜check.svg
 ┃ ┣ 📜close-icon.svg
 ┃ ┣ 📜home-icon.svg
 ┃ ┣ 📜iPhone-13-mini-124.svg
 ┃ ┣ 📜lesson-icon.svg
 ┃ ┣ 📜logo-icon.svg
 ┃ ┣ 📜main-icon.svg
 ┃ ┣ 📜mike.svg
 ┃ ┣ 📜mypage-icon.svg
 ┃ ┣ 📜noactive-check.svg
 ┃ ┣ 📜not-answer.svg
 ┃ ┣ 📜rectangle-120.svg
 ┃ ┣ 📜rectangle-123.svg
 ┃ ┣ 📜rectangle-125.svg
 ┃ ┣ 📜report-icon.svg
 ┃ ┣ 📜send.svg
 ┃ ┣ 📜stamp.svg
 ┃ ┣ 📜star.svg
 ┃ ┗ 📜user-icon.svg
 ┣ 📂components
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📂blockManagement
 ┃ ┃ ┃ ┗ 📜BlcokedUserTable.tsx
 ┃ ┃ ┣ 📂languageManagement
 ┃ ┃ ┃ ┣ 📜AddLanguageForm.tsx
 ┃ ┃ ┃ ┗ 📜LanguageTable.tsx
 ┃ ┃ ┣ 📂usersManagement
 ┃ ┃ ┃ ┗ 📜UsersTable.tsx
 ┃ ┃ ┗ 📜PageNationUI.tsx
 ┃ ┣ 📂audio
 ┃ ┃ ┗ 📜Audio.tsx
 ┃ ┣ 📂calendar
 ┃ ┃ ┣ 📜Calendar.tsx
 ┃ ┃ ┣ 📜CalendarHeader.tsx
 ┃ ┃ ┣ 📜DateGrid.tsx
 ┃ ┃ ┗ 📜DayHeader.tsx
 ┃ ┣ 📂challenge
 ┃ ┃ ┣ 📜FetchGrammarQuizButton.tsx
 ┃ ┃ ┣ 📜FetchWordQuizButton.tsx
 ┃ ┃ ┣ 📜Quiz.tsx
 ┃ ┃ ┣ 📜RandomEnglishGrammarQuiz.tsx
 ┃ ┃ ┣ 📜RandomEnglishWordQuiz.tsx
 ┃ ┃ ┣ 📜RandomKoreanGrammarQuiz.tsx
 ┃ ┃ ┗ 📜RandomKoreanWordQuiz.tsx
 ┃ ┣ 📂chat
 ┃ ┃ ┣ 📜chat.tsx
 ┃ ┃ ┗ 📜overlay.tsx
 ┃ ┣ 📂chatBot
 ┃ ┃ ┣ 📂aiTutorHome
 ┃ ┃ ┃ ┣ 📜CustomizedLearn.tsx
 ┃ ┃ ┃ ┣ 📜Reviewing.tsx
 ┃ ┃ ┃ ┗ 📜TodayLearn.tsx
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┣ 📜ChatInput.tsx
 ┃ ┃ ┃ ┗ 📜ChatMessageList.tsx
 ┃ ┃ ┗ 📂review
 ┃ ┃ ┃ ┣ 📜ReviewItem.tsx
 ┃ ┃ ┃ ┗ 📜ReviewList.tsx
 ┃ ┣ 📂myPage
 ┃ ┃ ┣ 📜LanguageSelectorDropDown.tsx
 ┃ ┃ ┗ 📜UserProfile.tsx
 ┃ ┣ 📂nav
 ┃ ┃ ┗ 📜Navibar.tsx
 ┃ ┣ 📂newCalendar
 ┃ ┃ ┗ 📜NewCalendar.tsx
 ┃ ┣ 📂notificationPopup
 ┃ ┃ ┣ 📜NotificationBell.tsx
 ┃ ┃ ┗ 📜NotificationPopup.tsx
 ┃ ┣ 📂setNotification
 ┃ ┃ ┗ 📜IsNotificated.tsx
 ┃ ┣ 📂ui
 ┃ ┃ ┣ 📂button
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┣ 📂myChat
 ┃ ┃ ┃ ┃ ┗ 📜MyChatCard.tsx
 ┃ ┃ ┃ ┗ 📂otherChat
 ┃ ┃ ┃ ┃ ┗ 📜OtherChatCard.tsx
 ┃ ┃ ┣ 📂chatUserProfile
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂footer
 ┃ ┃ ┃ ┗ 📜Footer.tsx
 ┃ ┃ ┣ 📂header
 ┃ ┃ ┃ ┣ 📜Header.tsx
 ┃ ┃ ┃ ┗ 📜HeaderTop.tsx
 ┃ ┃ ┣ 📂icon
 ┃ ┃ ┃ ┣ 📜Icons.tsx
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂reviewContent
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂toggle
 ┃ ┃ ┃ ┗ 📜notificationToggle.tsx
 ┃ ┃ ┣ 📂typography
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂userProfile
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📜LoadingSpinner.tsx
 ┃ ┃ ┣ 📜NavbarGnb.tsx
 ┃ ┃ ┣ 📜NoIconHeader.tsx
 ┃ ┃ ┣ 📜SpinnerButton.tsx
 ┃ ┃ ┣ 📜WithIconHeader.tsx
 ┃ ┃ ┣ 📜card.tsx
 ┃ ┃ ┗ 📜chart.tsx
 ┃ ┣ 📂wrongAnswer
 ┃ ┃ ┣ 📜GrammarList.tsx
 ┃ ┃ ┗ 📜WordList.tsx
 ┃ ┣ 📜AccordionItem.tsx
 ┃ ┣ 📜BottomSheetModal.tsx
 ┃ ┣ 📜ChatModal.tsx
 ┃ ┣ 📜CountriesSelect.tsx
 ┃ ┣ 📜CountrySelect.tsx
 ┃ ┗ 📜MaterialTailwindWrapper.tsx
 ┣ 📂constants
 ┃ ┗ 📜aiPrompt.ts
 ┣ 📂hooks # 커스텀 훅
 ┃ ┣ 📜getUserInfo.ts
 ┃ ┣ 📜useAudioRecorder.ts
 ┃ ┣ 📜useCallerCallee.ts
 ┃ ┣ 📜useChatMessages.ts
 ┃ ┣ 📜useConversation.ts
 ┃ ┣ 📜useGrammarQuestions.ts
 ┃ ┣ 📜useLanguages.ts
 ┃ ┣ 📜useMatching.ts
 ┃ ┣ 📜useMessage.ts
 ┃ ┣ 📜useNotifications.ts
 ┃ ┣ 📜useProblems.ts
 ┃ ┣ 📜useQuiz.ts
 ┃ ┣ 📜useSlider.ts
 ┃ ┣ 📜useSubscription.ts
 ┃ ┣ 📜useUpdateIsReviewed.ts
 ┃ ┣ 📜useUpdateProfile.ts
 ┃ ┣ 📜useUser.ts
 ┃ ┣ 📜useUserInfo.ts
 ┃ ┣ 📜useUserProfile.ts
 ┃ ┣ 📜useUserWrongAnswers.ts
 ┃ ┣ 📜useWebRTC.ts
 ┃ ┗ 📜useWordQuestions.ts
 ┣ 📂lib
 ┃ ┗ 📜utils.ts
 ┣ 📂services
 ┃ ┣ 📜matchingService.ts
 ┃ ┣ 📜supabaseAuth.ts
 ┃ ┣ 📜supabaseChatbot.ts
 ┃ ┗ 📜webrtcService.ts
 ┣ 📂shared
 ┃ ┣ 📜StoreProvider.tsx
 ┃ ┗ 📜screen-store-provider.tsx
 ┣ 📂stores # 상태 관리 (Zustand)
 ┃ ┣ 📜matching-store.ts
 ┃ ┗ 📜screen-store.ts
 ┣ 📂stories
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📜accessibility.png
 ┃ ┃ ┣ 📜accessibility.svg
 ┃ ┃ ┣ 📜addon-library.png
 ┃ ┃ ┣ 📜assets.png
 ┃ ┃ ┣ 📜avif-test-image.avif
 ┃ ┃ ┣ 📜context.png
 ┃ ┃ ┣ 📜discord.svg
 ┃ ┃ ┣ 📜docs.png
 ┃ ┃ ┣ 📜figma-plugin.png
 ┃ ┃ ┣ 📜github.svg
 ┃ ┃ ┣ 📜share.png
 ┃ ┃ ┣ 📜styling.png
 ┃ ┃ ┣ 📜testing.png
 ┃ ┃ ┣ 📜theming.png
 ┃ ┃ ┣ 📜tutorials.svg
 ┃ ┃ ┗ 📜youtube.svg
 ┃ ┣ 📜Button.stories.ts
 ┃ ┣ 📜Button.tsx
 ┃ ┣ 📜Configure.mdx
 ┃ ┣ 📜Header.stories.ts
 ┃ ┣ 📜Header.tsx
 ┃ ┣ 📜Page.stories.ts
 ┃ ┣ 📜Page.tsx
 ┃ ┣ 📜button.css
 ┃ ┣ 📜header.css
 ┃ ┗ 📜page.css
 ┣ 📂types
 ┃ ┣ 📂chatType
 ┃ ┃ ┗ 📜chatType.ts
 ┃ ┣ 📂userType
 ┃ ┃ ┗ 📜userType.ts
 ┃ ┗ 📜wrongAnswerNote.ts
 ┣ 📂utils
 ┃ ┣ 📂chatbot
 ┃ ┃ ┣ 📜chatBotApi.ts
 ┃ ┃ ┗ 📜date.ts
 ┃ ┣ 📂formatting
 ┃ ┃ ┗ 📜format.ts
 ┃ ┣ 📂media
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂myPage
 ┃ ┃ ┣ 📜cancelAccount.ts
 ┃ ┃ ┣ 📜imageUpload.ts
 ┃ ┃ ┣ 📜logout.ts
 ┃ ┃ ┗ 📜updateLanguage.ts
 ┃ ┣ 📂notifications
 ┃ ┃ ┗ 📜pushSubscription.ts
 ┃ ┣ 📂supabase
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜middleware.ts
 ┃ ┃ ┗ 📜server.ts
 ┃ ┗ 📜randomNumber.ts
 ┣ 📜.DS_Store
 ┣ 📜middleware.ts
 ┗ 📜type.ts
```
</details>


<br><br>


# 🧩 주요 기능

- 사용자 인증:
> 로그인, 회원가입, 프로필 관리 기능
<br>

- 개인화된 학습:
> 사용자 맞춤형 학습 경로와 퀴즈 제공
<br>

- PWA 지원:
> 오프라인 사용, 빠른 로딩, 홈 화면 추가 기능
<br>

- 푸시 알림:
> 새로운 학습 자료나 알림을 푸시 알림으로 제공
<br>

- 반응형 디자인:
> 데스크톱과 모바일에서 최적화된 화면 제공
<br>

- 음성 관련 기능:
> TTS (Text-to-Speech): 텍스트를 음성으로 변환하여 사용자에게 읽어줍니다.

> STT (Speech-to-Text): 음성을 텍스트로 변환하여 사용자의 입력을 받습니다.


<br><br>


# 🪄 페이지 구성


![ai 튜터](https://github.com/user-attachments/assets/81aa831d-6ba7-409b-9a94-0d46566994e0)

- **AI 튜터**:
> 1. 난이도별로 무작위 회화 주제를 보여줍니다.
> 2. 원하는 주제 선택 시 AI 튜터에게 선택한 주제와 관련된 회화를 배울 수 있습니다.
> 3. 마이크를 통해 발음 연습을 할 경우 AI 튜터에게 피드백을 받을 수 있습니다.
> 4. 캘린더에서 날짜 클릭 시 해당 날짜에 AI 튜터와 나눴던 대화를 확인할 수 있습니다.
<br>


![언어수업](https://github.com/user-attachments/assets/925bb6d0-b7d6-4384-abc6-a040fc5d0408)

- **언어수업**:
> 1. 매칭하기 클릭 시 아래 두 가지 조건에 모두 해당되는 사용자와 매칭이 되어 화상으로 언어 수업을 받을 수 있습니다. 
> a. 나의 모국어가 상대방의 배우고 싶은 언어일 경우
> b. 나의 배우고 싶은 언어가 상대방의 모국어일 경우
<br>


![채팅창 수정버전](https://github.com/user-attachments/assets/e92ea8be-d66e-45aa-928e-b1fe44566dae)

- **채팅방**:
> 1. 언어 수업에서 나눴던 대화의 녹음본을 채팅방에서 확인할 수 있습니다.
> 2. 녹음본 선택 시 AI가 텍스트로 피드백을 해줍니다.
<br>

![챌린지](https://github.com/user-attachments/assets/07fe3db3-247c-4563-901b-fce26a589178)

- **챌린지/오답노트**:
> 1. AI가 생성한 무작위의 단어 및 문법 퀴즈를 풀 수 있습니다.
> 2. 사용자가 선택한 답에 대한 해설을 바로 확인할 수 있습니다.
> 3. 퀴즈에서 틀렸던 내용을 오답노트에서 확인할 수 있습니다.
> 4. 단어 오답노트의 경우 해당 단어 클릭 시 발음을 들을 수 있습니다.
<br>


![어드민2](https://github.com/user-attachments/assets/02c4418e-41b9-42eb-9a1d-b821ba3d52af)

- **내정보**:
> 내 프로필/ 언어변경/ 알림 허용/ 로그아웃/ 회원탈퇴/ 1:1 문의하기/ 구독관리/ 정책/ 약관

- **관리자페이지**:
> 1. 3번 이상 다른 사용자들에게 차단당한 사용자의 이용을 정지시킬 수 있습니다.
> 2. 서비스에서 지원하는 언어를 추가할 수 있습니다.
> 3. 사용자들의 상태를 관리할 수 있습니다.
> 4. 사용자들에게 알림을 발송할 수 있습니다.

<br><br>



# 🛠 Trouble Shooting

<details>

<summary> Trouble1️⃣ 웹 사이즈의 페이지에 모바일 사이즈의 레이아웃이 적용되는 문제 </summary>

### 🚨 문제 발생
    
관리자 페이지에서 불필요한 하단 탭이 노출되는 현상 발생
    
### 💡 해결 방법
    
1. 모바일 버전과 웹 버전 폴더를 분리한 후
2. app 폴더 안에 root layout 파일은 그대로 두고, 분리한 폴더 안에 각각 layout 파일을 넣어 CSS를 다르게 적용시켰습니다.
    
> root layout은 모든 페이지에서 공통적으로 적용되는 파일이기 때문에 app 폴더 안에 없으면 Next.js가 파일을 추적하지 못합니다. 따라서 기존의 layout 파일은 그대로 유지하였습니다.

![image](https://github.com/user-attachments/assets/2bafbfd5-c9c0-4ddd-93b6-c157d0512a91)

</details>


<details>

<summary> Trouble2️⃣ 로컬 날짜와 supabase 날짜 형식이 일치하지 않던 문제 </summary>

### 🚨 문제 발생
    
캘린더에서 오늘 날짜 클릭 시 어제 날짜의 데이터가 보이는 오류 발생

### 🔍 원인 추론

시간대를 변환하다 생긴 오류로 추정

```tsx
isSameDay: (date1: Date | string, date2: Date | string) => {
    // 모든 날짜를 YYYY-MM-DD 형식으로 통일
    const getDateOnly = (date: Date | string) => {
      if (typeof date === "string") {
        // UTC ISO 문자열인 경우
        return date.split("T")[0];
      }
      // Date 객체인 경우
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const d1Str = getDateOnly(date1);
    const d2Str = getDateOnly(date2);

    console.log("Comparing dates:", {
      d1: d1Str,
      d2: d2Str,
      isEqual: d1Str === d2Str
    });

    return d1Str === d2Str;
  },
```

1. `getFullYear()`, `getMonth()`, `getDate()`는 로컬 시간대(시스템 시간대) 기준으로 값을 반환

```tsx
getMonthAndDay: (date: Date | string) => {
    const [year, month, day] = dateUtils.formatDate(date).split("-");
    return {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10)
    };
}
```

1. 서버와 클라이언트의 시간대가 다르면 다른 날짜가 반환될 수 있는 가능성이 있다는 사실을 파악

### 💡 해결 방법

1. KST(한국 시간대)로 명시적으로 변환시켰습니다.
2. Supabase의 날짜 문자열을 그대로 사용하면서 로컬의 시간대도 같은 형식으로 통일시켰습니다.
3. 마지막으로 원본 날짜 부분만 직접 문자열로 추출하여 사용하였습니다.
</details>

<details>

<summary> Trouble3️⃣ service-worker 명칭 이슈 </summary>
    
### 🚨 문제 발생
    
PWA가 모바일 기기에서 서비스워커를 읽지 못하는 상황 발생
    
```tsx
const registeration = await navigator.serviceWorker.ready;
```
    
### 🔍 원인 추론
    
명칭을 잘못 지정한 것 같다고 판단
    
### 💡 해결 방법
    
ready가 아닌 명시적인 이름으로 지정하여 해결하였습니다.

```tsx
const registeration = await navigator.serviceWorker("/service-worker.js");
```
</details>


<details>

<summary> Trouble4️⃣ 모바일 디바이스에서만 작동하지 않는 STT </summary>

### 🚨 문제 발생

STT(Speech to Text) 기능을 활용하기 위하여 `MediaRecorder`를 이용하였는데, PC에서는 작동하지만 **모바일** **디바이스에서만 작동하지 않는 문제**가 발생

### 🔍 원인 추론

iOS에서 `MediaRecorder` 를 지원하지 않음

- 확장자 변경 전 마이크에도 접근하지 못 하는 상황
![image (1)](https://github.com/user-attachments/assets/953f5e64-63c1-4cb4-b9ae-ac9d6c2facf1)



- 확장자를 mp4로 변경하여 마이크 접근은 가능해졌지만 파일 변환 중 오류 생김
![image (2)](https://github.com/user-attachments/assets/e6acadce-0b40-4d71-a4c9-91dff0f0b1f4)


### 해결 방법

기존에 사용하던 `mediaRecorder` API 대신에 크로스 브라우징 호환성이 뛰어난 `RecordRTC` 라이브러리를 사용하였습니다. 

<aside>
💡

**크로스 브라우징(Cross Browsing)**이란?

웹 페이지 또는 웹 애플리케이션이 다양한 브라우저와 버전에서 개발자의 의도대로 올바르게 작동하도록 하는 작업

</aside>

❌ 수정 전: MediaRecorder API 사용

```jsx
const mediaRecorder = new MediaRecorder(stream, { mimeType });
```

✅ 수정 후: RecordRTC 사용

```jsx
import type RecordRTC from "recordrtc";
const { default: RecordRTC, StereoAudioRecorder } = await import("recordrtc");
const recorder = new RecordRTC(stream, {
  type: "audio",
  mimeType: "audio/wav",
  recorderType: StereoAudioRecorder,
  numberOfAudioChannels: 1,
  desiredSampRate: 16000,
  timeSlice: 1000
});
```

### 결과
![image (3)](https://github.com/user-attachments/assets/bb9a0317-8a3f-48e4-94c4-a252fedf06a2){: style="width:300px;" }

</details>



<details>

<summary> Trouble5️⃣ 새로고침을 해야만 나타나는 이슈 </summary>
    
### 🚨 문제 발생
    
챌린지 문제를 풀고 결과페이지에서 오답노트 페이지로 이동했을 때, 틀린 문제가 바로 오답노트 리스트에 나타나지 않고 새로고침을 해야만 나타남
    사용자의 틀린 문제와 답변 데이터를 불러올 때 useQuery를 사용했는데, 프로젝트에서 TanStack Query의 `QueryClient`를 생성할 때, 전역 설정으로 `defaultOptions`를 지정했을 가능성이 있으며, 이 시간이 0이 아닐 수 있다. 정말로 60초로 설정되어 있었다.

```jsx
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 환경에서는, 기본 staleTime을 0 이상으로 설정하여
        // 클라이언트에서 바로 다시 데이터를 가져오는 것을 방지하는 것이 일반적입니다.
        staleTime: 60 * 1000
      }
    }
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 💡 해결 방법

해결 방법 : 이 경우, `useQuery`에서 명시적으로 `staleTime: 0`을 설정하지 않으면 기본적으로 전역 설정이 적용됩니다. 따라서, useQuery를 사용할 때 `staleTime` 옵션을 0으로 명시적으로 설정했습니다.

```jsx
export const useUserWrongAnswers = (userId: string) => {
  const fetchUserWrongAnswers = async (): Promise<UserAnswerType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_answer")
      .select("*")
      .eq("user_id", userId)
      .eq("is_corrected", false);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: fetchUserWrongAnswers,
    staleTime: 0
  });
};
```

### 결과

결과는 새로고침 하지 않아도 문제를 풀고 결과페이지에서 오답노트페이지로 이동하자마자 바로 데이터를 불러올 수 있었습니다.

</details>



<details>

<summary> Trouble6️⃣ 테이블에 삽입되는 파싱값 이슈 </summary>
    
### 🚨 문제 발생
    
모든 답이 1번인 이슈 해결 후 오답이 1개가 아닌 2개로 변경해야하는 이슈. 
문자열로 오답을 받아온 데이터를 아래 형식으로 “questions” 테이블에 파싱됨

```jsx
{
  1: ["정답1", {"오답1","오답2"}],
  2: [{"오답2","오답3"}, "정답2"],
  3: ["정답3", {"오답4","오답5"}]
}
```

### 💡 해결 방법

1. **`shuffleAnswers` 호출**: `shuffleAnswers(allAnswers)`를 호출하여 정답과 오답 배열을 무작위로 섞는다.
2. **`acc`에 추가**: `question.id`를 키로 사용하여 `acc` 객체에 spread operator로 섞인 답변 배열을 저장.

### 결과

정답이 1개 오답이 2개로 변환 완료
![스크린샷 2024-11-21 오전 12 14 03](https://github.com/user-attachments/assets/5d871546-348c-4213-b95d-8819e749f211)


</details>

<details>

<summary> Trouble7️⃣ 중복 파일이 하나만 미리보기가 됨 </summary>

### 🚨 문제 발생

input type:file태그에 onChange에 useState를 활용하여 입력된 파일을 저장한 후 이를 미리보기 사진으로 사용.
각기 다른 파일을 넣을때는 문제가 없지만, 같은 파일을 두번 넣을 경우 사진이 두개 보여지는 것이 아니라 하나만 미리보기가 됨.

### 🔍 원인 추론

onChange를 통해서 함수가 돌아가는 환경에서, 같은 파일을 연속으로 선택하면 변화를 인지못하고 onChange가 작동 안함

```jsx
  // 파일 선택 시 실행될 함수
  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일 1개를 가진 배열
    const selectedImg = e.target.files?.[0];
    // 선택한 모든 파일을 담은 배열
    const imgUrlLists: string[] = [...previewImgs];

    if (selectedImg) {
      setFiles((prev) => [...prev, selectedImg]);
      const currentImgUrl = URL.createObjectURL(selectedImg!);
      imgUrlLists.push(currentImgUrl);
    }

    setPreviewImgs(imgUrlLists);
  };

return
        <input
          type="file"
          onChange={handleImgFile}
          multiple
          className="hidden"
          ref={fileInputRef}
        />{" "}

```

### 💡 해결 방법

 하여 onClick을 사용하여, 클릭할때마다 useState로 입력돼있는 값을 빈문자열로 초기화 시켜 같은 파일이 들어와도 빈문자열에서 파일이 생기는 것으로 되는거니까 변화라고 인식하게 함

```jsx
// 파일 선택 시 실행될 함수
  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일 1개를 가진 배열
    const selectedImg = e.target.files?.[0];
    // 선택한 모든 파일을 담은 배열
    const imgUrlLists: string[] = [...previewImgs];

    if (selectedImg) {
      setFiles((prev) => [...prev, selectedImg]);
      const currentImgUrl = URL.createObjectURL(selectedImg!);
      imgUrlLists.push(currentImgUrl);
    }
     
    setPreviewImgs(imgUrlLists);
  };

const resetInputValue = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

return
        <input
          type="file"
          onChange={handleImgFile}
          onClick={resetInputValue}
          multiple
          className="hidden"
          ref={fileInputRef}
        />{" "}
```

### 결과

동일한 파일도 연속으로 첨부 가능해짐

<img width="458" alt="image (4)" src="https://github.com/user-attachments/assets/c449f40e-e435-48b5-ad3c-8e1e91ed1d5a">

</details>



<br><br>

  
# 🧪 Technologies & Tools

## 📋 Languages

![javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## 📚 Frameworks, Platforms and Libraries

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

## 💾 Databases

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🎨 Design

![figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

## ☁️ Hosting/SaaS

![vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![pwa](https://img.shields.io/badge/Pwa-000000?style=for-the-badge&logo=pwa&logoColor=white)

## 💻 IDEs/Editors

![vscode](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

## 🕓 Version Control

![git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

## 💬 Social

![slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)

## 🥅 Other

![notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
