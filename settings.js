console.log("settings.js 실행됨");

document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsBtn = document.getElementById("close-settings-btn");

  const contactBtn = document.getElementById("developer-contact-btn");
  const contactPanel = document.getElementById("developer-contact-panel");
  const copyEmailBtn = document.getElementById("copy-developer-email-btn");

  const backupBtn = document.getElementById("backup-menu-btn");
  const backupPanel = document.getElementById("backup-panel");
  const exportBackupBtn = document.getElementById("export-backup-btn");
  const importBackupBtn = document.getElementById("import-backup-btn");
  const backupFileInput = document.getElementById("backup-file-input");

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
    backupPanel?.classList.add("hidden");
  }

  settingsBtn.addEventListener("click", openSettings);
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

  // 개발자 문의 패널
  contactBtn?.addEventListener("click", () => {
    contactPanel?.classList.toggle("hidden");
  });

  // 백업 및 복원 패널
  backupBtn?.addEventListener("click", () => {
    backupPanel?.classList.toggle("hidden");
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

  // 바로가기 URL 검사
  function isSafeHttpUrl(value) {
    if (typeof value !== "string") return false;

    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  // 백업 파일 다운로드
  exportBackupBtn?.addEventListener("click", () => {
    try {
      const rawData = localStorage.getItem("my_shortcuts");
      const shortcuts = rawData ? JSON.parse(rawData) : [];

      if (!Array.isArray(shortcuts)) {
        alert("저장된 바로가기 데이터가 올바르지 않습니다.");
        return;
      }

      const backupData = {
        format: "Link Station Backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        shortcuts
      };

      const blob = new Blob(
        [JSON.stringify(backupData, null, 2)],
        { type: "application/json;charset=utf-8" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `link-station-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("백업 파일 생성 실패:", error);
      alert("백업 파일을 만들지 못했습니다.");
    }
  });

  // 백업 파일 선택 창 열기
  importBackupBtn?.addEventListener("click", () => {
    if (backupFileInput) {
      backupFileInput.click();
    }
  });

  // JSON 백업 파일 가져오기
  backupFileInput?.addEventListener("change", async () => {
    const file = backupFileInput.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Link Station 백업 형식 또는 바로가기 배열 형식 지원
      const importedShortcuts = Array.isArray(data)
        ? data
        : data?.format === "Link Station Backup" &&
          Array.isArray(data.shortcuts)
          ? data.shortcuts
          : null;

      if (!importedShortcuts) {
        alert("올바른 Link Station JSON 백업 파일이 아닙니다.");
        return;
      }

      // 잘못된 항목이 하나라도 있으면 전체 가져오기를 거부
      const valid = importedShortcuts.every((shortcut) => {
        return shortcut &&
          typeof shortcut === "object" &&
          !Array.isArray(shortcut) &&
          typeof shortcut.name === "string" &&
          typeof shortcut.url === "string" &&
          isSafeHttpUrl(shortcut.url);
      });

      if (!valid) {
        alert("백업 파일에 잘못된 바로가기 데이터가 있습니다. 기존 데이터는 변경되지 않았습니다.");
        return;
      }

      const confirmed = confirm(
        `백업 파일의 바로가기 ${importedShortcuts.length}개를 가져올까요?\n\n현재 바로가기 목록은 백업 파일의 목록으로 교체됩니다. 기존 목록을 먼저 백업해 두세요.`
      );

      if (!confirmed) return;

      // 기존 데이터 교체
      localStorage.setItem(
        "my_shortcuts",
        JSON.stringify(importedShortcuts)
      );

      alert("백업 복원이 완료되었습니다. 페이지를 새로고침합니다.");
      location.reload();
    } catch (error) {
      console.error("백업 파일 가져오기 실패:", error);
      alert("파일을 읽을 수 없습니다. 올바른 JSON 파일인지 확인해 주세요.");
    } finally {
      // 같은 파일을 다시 선택해도 change 이벤트 발생
      backupFileInput.value = "";
    }
  });
});
