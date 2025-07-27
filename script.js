// script.js
const DEFAULT_WAIT_SECONDS = 4 * 60 * 60;

document.addEventListener("DOMContentLoaded", () => {
    // ——— Все экраны ———
    const screens = [
      // Part 1
      "screen-start","screen-question","screen-answer","screen-correct","screen-wrong","screen-wait",
      // Part 2
      "part2-start","part2-question","part2-answer","part2-correct","part2-wrong","part2-wait",
      // Part 3
      "part3-start","part3-question","part3-answer","part3-correct","part3-wrong","part3-wait",
      // Part 4
      "part4-start","part4-question","part4-answer","part4-correct","part4-wrong","part4-wait",
      // Part 5
      "part5-start","part5-question","part5-answer","part5-correct","part5-wrong","part5-wait",
      // Part 6
      "part6-start","part6-question","part6-answer","part6-correct","part6-wrong","part6-wait",
      // Part 7
      "part7-start","part7-question","part7-answer","part7-correct","part7-wrong","part7-wait",
      // Part 8
      "part8-start","part8-question","part8-answer","part8-wait",
      // Part 9
      "part9-start","part9-question","part9-answer","part9-correct","part9-wrong",
      "part9-info","part9-extra","part9-final"
    ];
  
    // ——— Правильные ответы ———
    const correct = {
      part1: ["майя","мая","племя майя","племя мая"],
      part2: ["пещера"],
      part3: ["из австралии","австралии","австралия"],
      part4: ["29.07.2025","29.07","29","29 июля"],
      part5: ["19:30"],
      part6: ["одежда","костюм","дресс-код","дрес-код"],
      part7: ["арбатун","албатун","арбатская"],
      // part8 — без проверки
      part9: ["лотос"]
    };
  
    // ——— Куда переходим после экрана ожидания ———
    const waitNext = {
      "screen-wait":  "part2-start",
      "part2-wait":   "part3-start",
      "part3-wait":   "part4-start",
      "part4-wait":   "part5-start",
      "part5-wait":   "part6-start",
      "part6-wait":   "part7-start",
      "part7-wait":   "part8-start",
      "part8-wait":   "part9-start"
    };
  
    // ——— Глобальные DOM‑элементы и таймер ———
    const app        = document.getElementById("app");
    const blocker    = document.getElementById("desktop-blocker");
    const timerBar   = document.getElementById("timer-bar");
    const timerDisp  = document.getElementById("timer-display");
    let   timerHandle, timerSec;
  
    // ——— Показать экран по ID и запустить/остановить таймер ———
    function showScreen(id) {
        screens.forEach(s => {
          document.getElementById(s)?.classList.remove("active");
        });
        document.getElementById(id)?.classList.add("active");
      
        // ——— сохраняем в localStorage, чтобы при перезагрузке знать, на каком экране были
        localStorage.setItem("currentScreen", id);
      
        if (waitNext[id]) {
          startTimer(id);
        } else {
          stopTimer();
        }
      }
      
  
    // ——— Проверка ширины экрана ———
    function checkWidth() {
      if (window.innerWidth > 600) {
        blocker.style.display = "flex";
        app.style.filter      = "blur(4px) brightness(0.7)";
      } else {
        blocker.style.display = "none";
        app.style.filter      = "none";
      }
    }
  
    // ——— Таймер ожидания (4 часа) ———
    function startTimer(waitId) {
        stopTimer();
        const key = `waitEnd_${waitId}`;
        // если в localStorage нет времени конца — сохраним дату "сейчас + DEFAULT_WAIT_SECONDS"
        let endTS = localStorage.getItem(key);
        if (!endTS) {
          endTS = Date.now() + DEFAULT_WAIT_SECONDS * 1000;
          localStorage.setItem(key, endTS);
        } else {
          endTS = Number(endTS);
        }
      
        timerBar.style.display = "flex";
      
        function tick() {
          const remaining = Math.ceil((endTS - Date.now()) / 1000);
          if (remaining <= 0) {
            clearInterval(timerHandle);
            timerBar.style.display = "none";
            localStorage.removeItem(key);
            showScreen(waitNext[waitId]);
          } else {
            const h = Math.floor(remaining / 3600);
            const m = Math.floor((remaining % 3600) / 60);
            const s = remaining % 60;
            timerDisp.textContent =
              (h > 0 ? String(h).padStart(2, "0") + ":" : "") +
              String(m).padStart(2, "0") + ":" +
              String(s).padStart(2, "0");
          }
        }
      
        // запустить сразу и потом каждую секунду
        tick();
        timerHandle = setInterval(tick, 1000);
      }
      
  
    function stopTimer() {
      clearInterval(timerHandle);
      timerBar.style.display = "none";
    }
  
    // ——— Навешиваем обработчики ———
    window.addEventListener("load", () => {
      // блокер для десктопа
      checkWidth();
      window.addEventListener("resize", checkWidth);
  
      // Part 1
      document.getElementById("btn-start").onclick     = () => showScreen("screen-question");
      document.getElementById("btn-to-answer").onclick = () => showScreen("screen-answer");
      document.getElementById("btn-submit").onclick    = () => {
        const ans = document.getElementById("answer").value.trim().toLowerCase();
        showScreen(correct.part1.includes(ans) ? "screen-correct" : "screen-wrong");
      };
      document.getElementById("btn-try-again").onclick = () => showScreen("screen-question");
      document.getElementById("btn-to-wait").onclick   = () => showScreen("screen-wait");
  
      // Part 2
      document.getElementById("btn-part2-start").onclick     = () => showScreen("part2-question");
      document.getElementById("btn-part2-to-answer").onclick = () => showScreen("part2-answer");
      document.getElementById("btn-part2-submit").onclick    = () => {
        const ans = document.getElementById("input-part2").value.trim().toLowerCase();
        showScreen(correct.part2.includes(ans) ? "part2-correct" : "part2-wrong");
      };
      document.getElementById("btn-part2-try").onclick       = () => showScreen("part2-question");
      document.getElementById("btn-part2-to-wait").onclick   = () => showScreen("part2-wait");
  
      // Part 3
      document.getElementById("btn-part3-start").onclick     = () => showScreen("part3-question");
      document.getElementById("btn-part3-to-answer").onclick = () => showScreen("part3-answer");
      document.getElementById("btn-part3-submit").onclick    = () => {
        const ans = document.getElementById("input-part3").value.trim().toLowerCase();
        showScreen(correct.part3.includes(ans) ? "part3-correct" : "part3-wrong");
      };
      document.getElementById("btn-part3-try").onclick       = () => showScreen("part3-question");
      document.getElementById("btn-part3-to-wait").onclick   = () => showScreen("part3-wait");
  
      // Part 4
      document.getElementById("btn-part4-start").onclick     = () => showScreen("part4-question");
      document.getElementById("btn-part4-to-answer").onclick = () => showScreen("part4-answer");
      document.getElementById("btn-part4-submit").onclick    = () => {
        const ans = document.getElementById("input-part4").value.trim().toLowerCase();
        showScreen(correct.part4.includes(ans) ? "part4-correct" : "part4-wrong");
      };
      document.getElementById("btn-part4-try").onclick       = () => showScreen("part4-question");
      document.getElementById("btn-part4-to-wait").onclick   = () => showScreen("part4-wait");
  
      // Part 5
      document.getElementById("btn-part5-start").onclick     = () => showScreen("part5-question");
      document.getElementById("btn-part5-to-answer").onclick = () => showScreen("part5-answer");
      document.getElementById("btn-part5-submit").onclick    = () => {
        const ans = document.getElementById("input-part5").value.trim().toLowerCase();
        showScreen(correct.part5.includes(ans) ? "part5-correct" : "part5-wrong");
      };
      document.getElementById("btn-part5-try").onclick       = () => showScreen("part5-question");
      document.getElementById("btn-part5-to-wait").onclick   = () => showScreen("part5-wait");
  
      // Part 6
      document.getElementById("btn-part6-start").onclick     = () => showScreen("part6-question");
      document.getElementById("btn-part6-to-answer").onclick = () => showScreen("part6-answer");
      document.getElementById("btn-part6-submit").onclick    = () => {
        const ans = document.getElementById("input-part6").value.trim().toLowerCase();
        showScreen(correct.part6.includes(ans) ? "part6-correct" : "part6-wrong");
      };
      document.getElementById("btn-part6-try").onclick       = () => showScreen("part6-question");
      document.getElementById("btn-part6-to-wait").onclick   = () => showScreen("part6-wait");
  
      // Part 7
      document.getElementById("btn-part7-start").onclick     = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-answer").onclick = () => showScreen("part7-answer");
      document.getElementById("btn-part7-submit").onclick    = () => {
        const ans = document.getElementById("input-part7").value.trim().toLowerCase();
        showScreen(correct.part7.includes(ans) ? "part7-correct" : "part7-wrong");
      };
      document.getElementById("btn-part7-try").onclick       = () => showScreen("part7-question");
      document.getElementById("btn-part7-to-wait").onclick   = () => showScreen("part7-wait");
  
      // Part 8
      document.getElementById("btn-part8-start").onclick     = () => showScreen("part8-question");
      document.getElementById("btn-part8-to-answer").onclick = () => showScreen("part8-answer");
      document.getElementById("btn-part8-to-wait").onclick   = () => showScreen("part8-wait");
  
      // Part 9
      document.getElementById("btn-part9-start").onclick     = () => showScreen("part9-question");
      document.getElementById("btn-part9-to-answer").onclick = () => showScreen("part9-answer");
      document.getElementById("btn-part9-submit").onclick    = () => {
        const ans = document.getElementById("input-part9").value.trim().toLowerCase();
        showScreen(correct.part9.includes(ans) ? "part9-correct" : "part9-wrong");
      };
      document.getElementById("btn-part9-try").onclick       = () => showScreen("part9-question");
      document.getElementById("btn-part9-info").onclick      = () => showScreen("part9-info");
      document.getElementById("btn-part9-extra").onclick     = () => showScreen("part9-extra");
      document.getElementById("btn-part9-final").onclick     = () => showScreen("part9-final");
  
      // экран из localStorage
  const saved = localStorage.getItem("currentScreen");
  if (saved && screens.includes(saved)) {
    showScreen(saved);
  } else {
    showScreen("screen-start");
  }

    });
  });
  