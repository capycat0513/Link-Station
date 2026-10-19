
console.log("settings.js 실행됨");

document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const contactBtn = document.getElementById("developer-contact-btn");
  const contactPanel = document.getElementById("developer-contact-panel");
  const copyEmailBtn = document.getElementById("copy-developer-email-btn");

  // 필수 HTML 요소 확인
  if (!settingsBtn || !settingsModal) {
    console.error("설정 버튼 또는 설정 모달을 찾을 수 없습니다.");
    return;
  }

  // 설정 창 열기
  function openSettings() {
    settingsModal.classList.add("active");
  }

  // 설정 창 닫기
  function closeSettings() {
    settingsModal.classList.remove("active");
    contactPanel?.classList.add("hidden");
  }

  // 설정 버튼 클릭
  settingsBtn.addEventListener("click", openSettings);

  // X 버튼 클릭
  closeSettingsBtn?.addEventListener("click", closeSettings);

  // 모달 바깥 영역 클릭
  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettings();
    }
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      settingsModal.classList.contains("active")
    ) {
      closeSettings();
    }
  });

  // 개발자 문의 펼치기 / 접기
  contactBtn?.addEventListener("click", () => {
    contactPanel?.classList.toggle("hidden");
  });

  // 이메일 주소 복사
  copyEmailBtn?.addEventListener("click", async () => {
    const email = "linkstation0010@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = "복사 완료!";
    } catch (error) {
      console.error("이메일 복사 실패:", error);
      copyEmailBtn.textContent = "복사 실패 — 이메일을 직접 선택해 주세요.";
    }

    setTimeout(() => {
      copyEmailBtn.textContent = "이메일 주소 복사";
    }, 2000);
  });
});
