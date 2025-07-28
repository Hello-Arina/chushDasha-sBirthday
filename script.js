// script.js

document.addEventListener("DOMContentLoaded", () => {
    // ——— Интервал ожидания между частями: 3 часа в секундах ———
    const DEFAULT_WAIT_SECONDS = 3 * 60 * 60;
  
    // ——— Список экранов только Part 6–9 ———
    const screens = [
      // Part 6
      "part6-start","part6-question","part6-answer","part6-correct","part6-wrong","part6-wait",
      // Part 7
      "part7-start","part7-question","part7-answer","part7-correct","part7-wrong","part7-wait",
      // Part 8
      "part8-start","part8-question","part8-answer","part8-wait",
      // Part 9
      "part9-start","part9-question","part9-answer","part9-correct","part9-wrong",
      "part9-info","part9-extra","part9-final"
    ];
  
    // ——— Правильные ответы для Part 6–9 ———
    const correct = {
      part6: ["одежда","костюм","дресс-код","дрес-код"],
      part7: ["арбатун","албатун","арбатская"],
      // part8 — нет поля ввода
      part9: ["лотос"]
    };
  
    // ——— Переходы после экрана ожидания ———
    const waitNext = {
      "part6-wait": "part7-start",
      "part7-wait": "part8-start",
      "part8-wait": "part9-start"
    };
  
    // ——— Глобальные DOM‑элементы и таймер ———
    const app       = document.getElementById("app");
    const blocker   = document.getElementById("desktop-blocker");
    const timerBar  = document.getElementById("timer-bar");
    const timerDisp = document.getElementById("timer-display");
    let timerHandle, timerSec;
  
    // ——— Показываем нужный экран и запускаем/останавливаем таймер ———
    function showScreen(id) {
      screens.forEach(s => document.getElementById(s)?.classList.remove("active"));
      document.getElementById(id)?.classList.add("active");
      localStorage.setItem("currentScreen", id);
      if (waitNext[id]) startTimer(id);
      else stopTimer();
    }
  
    // ——— Блокировка для десктопа ———
    function checkWidth() {
      if (window.innerWidth > 600) {
        blocker.style.display = "flex";
        app.style.filter      = "blur(4px) brightness(0.7)";
      } else {
        blocker.style.display = "none";
        app.style.filter      = "none";
      }
    }
  
    // ——— Таймер с сохранением состояния ———
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
        const rem = Math.ceil((endTS - Date.now())/1000);
        if (rem <= 0) {
          clearInterval(timerHandle);
          timerBar.style.display = "none";
          localStorage.removeItem(key);
          showScreen(waitNext[waitId]);
        } else {
          const h = Math.floor(rem/3600);
          const m = Math.floor((rem%3600)/60);
          const s = rem%60;
          timerDisp.textContent =
            (h>0?String(h).padStart(2,"0")+":":"") +
            String(m).padStart(2,"0")+":" +
            String(s).padStart(2,"0");
        }
      }
      tick();
      timerHandle = setInterval(tick, 1000);
    }
    function stopTimer() {
      clearInterval(timerHandle);
      timerBar.style.display = "none";
    }
  
    // ——— Привязка кнопок и запуск сразу Part 6 ———
    window.addEventListener("load", () => {
      checkWidth();
      window.addEventListener("resize", checkWidth);
  
      // Сбрасываем любые сохранённые экраны до Part 6
      localStorage.removeItem("currentScreen");
      ["screen-wait","part2-wait","part3-wait","part4-wait","part5-wait"]
        .forEach(id => localStorage.removeItem(`waitEnd_${id}`));
  
      // Part 6
      document.getElementById("btn-part6-start"   ).onclick = () => showScreen("part6-question");
      document.getElementById("btn-part6-to-answer").onclick = () => showScreen("part6-answer");
      document.getElementById("btn-part6-submit"  ).onclick = () => {
        const v = document.getElementById("input-part6").value.trim().toLowerCase();
        showScreen(correct.part6.includes(v) ? "part6-correct" : "part6-wrong");
      };
      document.getElementById("btn-part6-try"     ).onclick = () => showScreen("part6-question");
      document.getElementById("btn-part6-to-wait" ).onclick = () => showScreen("part6-wait");
  
      // Part 7
      document.getElementById("btn-part7-start"   ).onclick = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-answer").onclick = () => showScreen("part7-answer");
      document.getElementById("btn-part7-submit"  ).onclick = () => {
        const v = document.getElementById("input-part7").value.trim().toLowerCase();
        showScreen(correct.part7.includes(v) ? "part7-correct" : "part7-wrong");
      };
      document.getElementById("btn-part7-try"     ).onclick = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-wait" ).onclick = () => showScreen("part7-wait");
  
      // Part 8
      document.getElementById("btn-part8-start"   ).onclick = () => showScreen("part8-question");
      document.getElementById("btn-part8-to-answer").onclick = () => showScreen("part8-answer");
      document.getElementById("btn-part8-to-wait" ).onclick = () => showScreen("part8-wait");
  
      // Part 9
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
  
      // Показываем сразу Part 6
      showScreen("part6-start");
    });
  });
  
 