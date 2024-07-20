document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const timerText = document.getElementById("timer-text");
  const durationInput = document.getElementById("duration");
  const historyList = document.getElementById("history-list");
  const alarmSound = document.getElementById("alarm-sound");
  const progressCircle = document.getElementById("progress-circle");
  const presetButtons = document.querySelectorAll(".preset");
  const exportButton = document.getElementById("export");

  let timer;
  let isRunning = false;
  let timeLeft;
  let totalTime;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    const percentage = (timeLeft / totalTime) * 100;
    progressCircle.style.background = `conic-gradient(#007bff ${percentage}%, #e9ecef ${percentage}%)`;
  }

  function startTimer() {
    if (isRunning) return;
    const duration = parseInt(durationInput.value, 10);
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid number of minutes.");
      return;
    }
    totalTime = duration * 60;
    timeLeft = totalTime;
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        alarmSound.play();
        addHistoryEntry(duration);
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    const duration = parseInt(durationInput.value, 10);
    totalTime = duration * 60;
    timeLeft = totalTime;
    updateDisplay();
  }

  function addHistoryEntry(duration) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    listItem.textContent = `Completed ${duration} minute session at ${timeString}`;
    historyList.appendChild(listItem);
    saveHistory();
  }

  function saveHistory() {
    const historyItems = [];
    historyList.querySelectorAll("li").forEach((item) => {
      historyItems.push(item.textContent);
    });
    localStorage.setItem("pomodoroHistory", JSON.stringify(historyItems));
  }

  function loadHistory() {
    const historyItems =
      JSON.parse(localStorage.getItem("pomodoroHistory")) || [];
    historyItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = item;
      historyList.appendChild(listItem);
    });
  }

  function exportHistory() {
    const historyItems =
      JSON.parse(localStorage.getItem("pomodoroHistory")) || [];
    const blob = new Blob([JSON.stringify(historyItems, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pomodoro_history.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function setPresetTime(event) {
    const presetTime = event.target.getAttribute("data-time");
    durationInput.value = presetTime;
    resetTimer();
  }

  startButton.addEventListener("click", startTimer);
  resetButton.addEventListener("click", resetTimer);
  presetButtons.forEach((button) =>
    button.addEventListener("click", setPresetTime)
  );
  exportButton.addEventListener("click", exportHistory);

  loadHistory();
  resetTimer();
});
