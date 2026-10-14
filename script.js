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
const copyButton = document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const text = button.previousElementSibling.textContent;
    const accountNumber = text.match(/\d[\d-]+/)?.[0];

    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      button.textContent = "복사되었습니다 ✓";

      setTimeout(() => {
        button.textContent = "계좌번호 복사";
      }, 1500);
    }
  });
});

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

// ========================================
// Wedding Calendar
// ========================================

const calendar = document.querySelector("#wedding-calendar");

if (calendar) {
  const year = 2026;
  const month = 10; // JavaScript에서 10은 11월
  const weddingDay = 14;

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 요일 표시
  weekdays.forEach((day, index) => {
    const cell = document.createElement("div");

    cell.className = "calendar-cell weekday";

    if (index === 0) cell.classList.add("sunday");
    if (index === 6) cell.classList.add("saturday");

    cell.textContent = day;
    calendar.appendChild(cell);
  });

  // 11월 1일의 요일
  const firstDay = new Date(year, month, 1).getDay();

  // 11월의 마지막 날짜
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 첫 주의 빈칸
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell";
    calendar.appendChild(empty);
  }

  // 날짜 생성
  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    const number = document.createElement("span");

    cell.className = "calendar-cell";

    const weekday = new Date(year, month, day).getDay();

    if (weekday === 0) cell.classList.add("sunday");
    if (weekday === 6) cell.classList.add("saturday");

    if (day === weddingDay) {
      cell.classList.add("wedding-date");
    }

    number.textContent = day;
    cell.appendChild(number);

    calendar.appendChild(cell);
  }
}


// ========================================
// Wedding Countdown
// ========================================

const weddingDate = new Date("2026-11-14T13:30:00+09:00");

function updateCountdown() {
  const now = Date.now();
  const difference = weddingDate.getTime() - now;

  const daysElement = document.querySelector("#countdown-days");
  const hoursElement = document.querySelector("#countdown-hours");
  const minutesElement = document.querySelector("#countdown-minutes");
  const secondsElement = document.querySelector("#countdown-seconds");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  if (difference <= 0) {
    daysElement.textContent = "♥";
    hoursElement.textContent = "♥";
    minutesElement.textContent = "♥";
    secondsElement.textContent = "♥";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = days;
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ========================================
// Gallery: Show More / Show Less
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.querySelector(".gallery-grid");
  const galleryMoreButton = document.querySelector("#gallery-more");

  if (!galleryGrid || !galleryMoreButton) {
    return;
  }

  galleryMoreButton.addEventListener("click", () => {
    const isExpanded = galleryGrid.classList.toggle("expanded");

    galleryMoreButton.setAttribute(
      "aria-expanded",
      String(isExpanded)
    );

    const label = isExpanded ? "접기" : "더보기";

    galleryMoreButton.innerHTML = `${label} <span>${isExpanded ? "⌃" : "⌄"}</span>`;
  });
});

