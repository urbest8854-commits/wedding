// ========================================
// Account: 펼치기 / 접기
// ========================================

document.querySelectorAll(".account-group-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const targetId = button.getAttribute("aria-controls");
    const accountList = document.getElementById(targetId);

    if (!accountList) return;

    button.setAttribute("aria-expanded", String(!isExpanded));
    accountList.hidden = isExpanded;
  });
});


// ========================================
// Account: 계좌번호 복사
// ========================================

document.querySelectorAll(".account-copy").forEach((button) => {
  button.addEventListener("click", async () => {
    const accountItem = button.closest(".account-item");
    const numberElement = accountItem?.querySelector(".account-number");

    if (!numberElement) return;

    // 은행명은 제외하고 계좌번호만 복사
    const accountText = numberElement.textContent.trim();
    const accountNumber = accountText.replace(/^[^\d]+/, "").trim();

    if (!accountNumber) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(accountNumber);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = accountNumber;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const success = document.execCommand("copy");
        textarea.remove();

        if (!success) {
          throw new Error("복사 실패");
        }
      }

      const originalText = button.textContent;
      button.textContent = "완료 ✓";

      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);

    } catch (error) {
      window.prompt("계좌번호를 직접 복사해 주세요.", accountNumber);
    }
  });
});

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

  // 초기 상태: 9장만 표시
  images.forEach((image, index) => {
    image.style.display = index < initialCount ? "block" : "none";
  });

  // 그리드 높이 측정
  function getHeight() {
    return galleryGrid.getBoundingClientRect().height;
  }

  // 높이 애니메이션
  function animateHeight(startHeight, endHeight, onFinish) {
    let finished = false;

    galleryGrid.style.transition = "none";
    galleryGrid.style.height = `${startHeight}px`;

    // 시작 높이를 브라우저에 반영
    galleryGrid.offsetHeight;

    galleryGrid.style.transition = `height ${duration}ms ease`;
    galleryGrid.style.height = `${endHeight}px`;

    function finish() {
      if (finished) return;
      finished = true;

      clearTimeout(fallbackTimer);
      galleryGrid.removeEventListener("transitionend", onTransitionEnd);

      galleryGrid.style.transition = "none";
      onFinish();

      // 다음 애니메이션을 위해 transition 초기화
      requestAnimationFrame(() => {
        galleryGrid.style.transition = "";
      });
    }

    function onTransitionEnd(event) {
      if (
        event.target === galleryGrid &&
        event.propertyName === "height"
      ) {
        finish();
      }
    }

    galleryGrid.addEventListener("transitionend", onTransitionEnd);

    const fallbackTimer = setTimeout(finish, duration + 100);
  }

  // 더보기 / 접기 버튼
  galleryMoreButton.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;

    const startHeight = getHeight();

    if (!isExpanded) {
      // =========================
      // 더보기
      // =========================

      // 나머지 사진 표시
      images.forEach((image, index) => {
        if (index >= initialCount) {
          image.style.display = "block";
        }
      });

      // 펼쳐진 상태의 높이 측정
      galleryGrid.style.height = "auto";
      const endHeight = getHeight();

      // 기존 높이에서 전체 높이까지 부드럽게 펼치기
      animateHeight(startHeight, endHeight, () => {
        galleryGrid.style.height = "auto";
        isExpanded = true;
        isAnimating = false;
      });

      galleryMoreButton.setAttribute("aria-expanded", "true");
      galleryMoreButton.innerHTML = '접기 <span>⌃</span>';

    } else {
      // =========================
      // 접기
      // =========================

      // 추가 사진을 숨기지 않고
      // 처음 9장만 표시했을 때의 높이를 계산
      const extraImages = images.slice(initialCount);

      extraImages.forEach(image => {
        image.style.visibility = "hidden";
        image.style.position = "absolute";
      });

      const endHeight = getHeight();

      // 추가 사진의 원래 스타일 복원
      extraImages.forEach(image => {
        image.style.visibility = "";
        image.style.position = "";
      });

      // 전체 높이에서 접힌 높이까지 부드럽게 줄이기
      animateHeight(startHeight, endHeight, () => {
        // 애니메이션이 끝난 뒤에 추가 사진 숨김
        extraImages.forEach(image => {
          image.style.display = "none";
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

// ========================================
// 주소 복사
// ========================================

const copyAddressButton = document.querySelector("#copy-address");

if (copyAddressButton) {
  copyAddressButton.addEventListener("click", async () => {
    const address = "서울특별시 광진구 워커힐로 177";

    try {
      // 기본 클립보드 복사
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        // 클립보드 API를 지원하지 않는 환경을 위한 대체 방법
        const textarea = document.createElement("textarea");

        textarea.value = address;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        textarea.setAttribute("readonly", "");

        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const success = document.execCommand("copy");
        textarea.remove();

        if (!success) {
          throw new Error("주소 복사에 실패했습니다.");
        }
      }

      // 복사 완료 표시
      copyAddressButton.textContent = "복사 완료 ✓";

      setTimeout(() => {
        copyAddressButton.textContent = "주소 복사";
      }, 2000);

    } catch (error) {
      console.error("주소 복사 실패:", error);

      // 복사에 실패하면 주소를 직접 확인할 수 있도록 표시
      window.prompt("아래 주소를 직접 복사해 주세요.", address);
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
