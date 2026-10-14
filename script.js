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
// Gallery: Smooth Show More / Show Less
// ========================================

const galleryGrid = document.querySelector(".gallery-grid");
const galleryMoreButton = document.querySelector("#gallery-more");

if (galleryGrid && galleryMoreButton) {
  const images = Array.from(galleryGrid.querySelectorAll("img"));
  const initialCount = 9;
  const duration = 550;

  let isExpanded = false;
  let isAnimating = false;

  // 처음 표시할 사진과 나머지 사진 구분
  images.forEach((image, index) => {
    if (index >= initialCount) {
      image.style.display = "none";
    }
  });

  function animateHeight(startHeight, endHeight, onFinish) {
    galleryGrid.style.height = `${startHeight}px`;
    galleryGrid.offsetHeight;

    galleryGrid.style.transition = `height ${duration}ms ease`;
    galleryGrid.style.height = `${endHeight}px`;

    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;

      galleryGrid.removeEventListener("transitionend", onTransitionEnd);
      galleryGrid.style.transition = "";

      onFinish();
    }

    function onTransitionEnd(event) {
      if (event.target === galleryGrid && event.propertyName === "height") {
        finish();
      }
    }

    galleryGrid.addEventListener("transitionend", onTransitionEnd);

    // transitionend가 발생하지 않는 상황에 대한 안전장치
    setTimeout(finish, duration + 100);
  }

  galleryMoreButton.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;

    const startHeight = galleryGrid.getBoundingClientRect().height;

    if (!isExpanded) {
      // 나머지 사진을 표시하되, 높이는 현재 상태로 고정
      images.forEach((image, index) => {
        if (index >= initialCount) {
          image.style.display = "block";
        }
      });

      const endHeight = galleryGrid.scrollHeight;

      animateHeight(startHeight, endHeight, () => {
        galleryGrid.style.height = "auto";

        // 사진이 부드럽게 나타나도록 처리
        images.forEach((image, index) => {
          if (index >= initialCount) {
            image.style.opacity = "1";
          }
        });

        isExpanded = true;
        isAnimating = false;
      });

      images.forEach((image, index) => {
        if (index >= initialCount) {
          image.style.opacity = "0";
        }
      });

      galleryMoreButton.setAttribute("aria-expanded", "true");
      galleryMoreButton.innerHTML = '접기 <span>⌃</span>';
    } else {
      // 접기 전 전체 높이 측정
      galleryGrid.style.height =
        `${galleryGrid.getBoundingClientRect().height}px`;

      galleryGrid.offsetHeight;

      // 나머지 사진을 숨겼을 때의 높이 계산
      images.forEach((image, index) => {
        if (index >= initialCount) {
          image.style.display = "none";
        }
      });

      const endHeight = galleryGrid.scrollHeight;

      // 다시 펼칠 때를 위해 사진 표시 상태 복구 후 애니메이션
      images.forEach((image, index) => {
        if (index >= initialCount) {
          image.style.display = "block";
        }
      });

      animateHeight(startHeight, endHeight, () => {
        images.forEach((image, index) => {
          if (index >= initialCount) {
            image.style.display = "none";
            image.style.opacity = "";
          }
        });

        galleryGrid.style.height = "auto";

        isExpanded = false;
        isAnimating = false;
      });

      galleryMoreButton.setAttribute("aria-expanded", "false");
      galleryMoreButton.innerHTML = '더보기 <span>⌄</span>';
    }
  });
}

