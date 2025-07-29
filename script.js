// script.js

document.addEventListener("DOMContentLoaded", () => {
    // ——— Интервал ожидания: 1 час 30 минут в секундах ———
    const DEFAULT_WAIT_SECONDS = 1.5 * 60 * 60; // 5400 секунд
  
    // ——— Список экранов Part 7–9 ———
    const screens = [
      // Part 7
      "part7-start", "part7-question", "part7-answer", "part7-correct", "part7-wrong", "part7-wait",
      // Part 8
      "part8-start", "part8-question", "part8-answer", "part8-wait",
      // Part 9
      "part9-start", "part9-question", "part9-answer", "part9-correct", "part9-wrong",
      "part9-info", "part9-extra", "part9-final"
    ];
  
    // ——— Правильные ответы для Part 7–9 ———
    const correct = {
      part7: ["арбатун","албатун","арбатская"],
      // part8 — без ввода
      part9: ["лотос"]
    };
  
    // ——— Куда переходим после экрана ожидания ———
    const waitNext = {
      "part7-wait": "part8-start",
      "part8-wait": "part9-start"
      // дальше просто финал, таймер не нужен
    };
  
    // ——— Глобальные элементы и таймер ———
    const app       = document.getElementById("app");
    const blocker   = document.getElementById("desktop-blocker");
    const timerBar  = document.getElementById("timer-bar");
    const timerDisp = document.getElementById("timer-display");
    let timerHandle;
  
    // ——— Функция показа экрана ———
    function showScreen(id) {
      // скрываем все секции из списка
      screens.forEach(s => document.getElementById(s)?.classList.remove("active"));
      // показываем нужную
      document.getElementById(id)?.classList.add("active");
      // сохраняем прогресс
      localStorage.setItem("currentScreen", id);
      // запускаем или останавливаем таймер
      if (waitNext[id]) startTimer(id);
      else stopTimer();
    }
  
    // ——— Блокировка десктопа ———
    function checkWidth() {
      if (window.innerWidth > 600) {
        blocker.style.display = "flex";
        app.style.filter      = "blur(4px) brightness(0.7)";
      } else {
        blocker.style.display = "none";
        app.style.filter      = "none";
      }
    }
  
    // ——— Таймер с хранением в localStorage ———
    function startTimer(waitId) {
      stopTimer();
      const key = `waitEnd_${waitId}`;
      let endTS = localStorage.getItem(key);
  
      if (!endTS) {
        endTS = Date.now() + DEFAULT_WAIT_SECONDS * 1000;
        localStorage.setItem(key, endTS);
      } else {
        endTS = Number(endTS);
      }
  
      timerBar.style.display = "flex";
  
      function tick() {
        const rem = Math.ceil((endTS - Date.now()) / 1000);
        if (rem <= 0) {
          clearInterval(timerHandle);
          timerBar.style.display = "none";
          localStorage.removeItem(key);
          showScreen(waitNext[waitId]);
        } else {
          const h = Math.floor(rem / 3600);
          const m = Math.floor((rem % 3600) / 60);
          const s = rem % 60;
          timerDisp.textContent =
            (h > 0 ? String(h).padStart(2, "0") + ":" : "") +
            String(m).padStart(2, "0") + ":" +
            String(s).padStart(2, "0");
        }
      }
  
      tick();
      timerHandle = setInterval(tick, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerHandle);
      timerBar.style.display = "none";
    }
  
    // ——— При загрузке страницы ———
    window.addEventListener("load", () => {
      // проверка ширины
      checkWidth();
      window.addEventListener("resize", checkWidth);
  
      // сбрасываем прогресс и таймеры для всех Part 1–6
      localStorage.removeItem("currentScreen");
      ["screen-wait","part2-wait","part3-wait","part4-wait","part5-wait","part6-wait"]
        .forEach(id => localStorage.removeItem(`waitEnd_${id}`));
  
      // привязка кнопок для Part 7
      document.getElementById("btn-part7-start"   ).onclick = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-answer").onclick = () => showScreen("part7-answer");
      document.getElementById("btn-part7-submit"  ).onclick = () => {
        const v = document.getElementById("input-part7").value.trim().toLowerCase();
        showScreen(correct.part7.includes(v) ? "part7-correct" : "part7-wrong");
      };
      document.getElementById("btn-part7-try"     ).onclick = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-wait" ).onclick = () => showScreen("part7-wait");
  
      // привязка кнопок для Part 8
      document.getElementById("btn-part8-start"   ).onclick = () => showScreen("part8-question");
      document.getElementById("btn-part8-to-answer").onclick = () => showScreen("part8-answer");
      document.getElementById("btn-part8-to-wait" ).onclick = () => showScreen("part8-wait");
  
      // привязка кнопок для Part 9
      document.getElementById("btn-part9-start"   ).onclick = () => showScreen("part9-question");
      document.getElementById("btn-part9-to-answer").onclick = () => showScreen("part9-answer");
      document.getElementById("btn-part9-submit"  ).onclick = () => {
        const v = document.getElementById("input-part9").value.trim().toLowerCase();
        showScreen(correct.part9.includes(v) ? "part9-correct" : "part9-wrong");
      };
      document.getElementById("btn-part9-try"     ).onclick = () => showScreen("part9-question");
      document.getElementById("btn-part9-info"    ).onclick = () => showScreen("part9-info");
      document.getElementById("btn-part9-extra"   ).onclick = () => showScreen("part9-extra");
      document.getElementById("btn-part9-final"   ).onclick = () => showScreen("part9-final");
  
      // сразу показываем старт Part 9
      showScreen("part9-start");
    });
  });
  