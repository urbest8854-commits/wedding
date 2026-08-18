// 계좌번호 펼치기
const accountToggle = document.querySelector(".account-toggle");
const accountDetail = document.querySelector(".account-detail");

if (accountToggle && accountDetail) {
  accountToggle.addEventListener("click", () => {
    const isHidden = accountDetail.hidden;
    accountDetail.hidden = !isHidden;
    accountToggle.setAttribute("aria-expanded", String(isHidden));
    accountToggle.textContent = isHidden ? "계좌번호 닫기" : "계좌번호 보기";
  });
}

// 계좌번호 복사
const copyButton = document.querySelector(".copy-button");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const accountText = "은행명 000-0000-0000";

    try {
      await navigator.clipboard.writeText(accountText);
      copyButton.textContent = "복사되었습니다";
      setTimeout(() => {
        copyButton.textContent = "계좌번호 복사";
      }, 1500);
    } catch {
      alert("계좌번호를 직접 복사해 주세요.");
    }
  });
}

// 갤러리 이미지를 누르면 새 창에서 크게 보기
document.querySelectorAll(".gallery-grid img").forEach((image) => {
  image.addEventListener("click", () => {
    window.open(image.src, "_blank");
  });
});
