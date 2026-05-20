const state = {
  story: null,
  cursor: 0,
  displayed: [],
  waiting: null,
  hiddenIds: new Set(),
};

const els = {
  intro: document.querySelector("#introCard"),
  start: document.querySelector("#startBtn"),
  continue: document.querySelector("#continueBtn"),
  jump: document.querySelector("#jumpBtn"),
  jumpPanel: document.querySelector("#jumpPanel"),
  jumpInput: document.querySelector("#jumpInput"),
  jumpConfirm: document.querySelector("#jumpConfirmBtn"),
  jumpCancel: document.querySelector("#jumpCancelBtn"),
  jumpHint: document.querySelector("#jumpHint"),
  restart: document.querySelector("#restartBtn"),
  log: document.querySelector("#storyLog"),
  advancePanel: document.querySelector("#advancePanel"),
  progressText: document.querySelector("#progressText"),
  progressBar: document.querySelector("#progressBar"),
  sceneLabel: document.querySelector("#sceneLabel"),
  modeText: document.querySelector("#modeText"),
  choicePanel: document.querySelector("#choicePanel"),
  choicePrompt: document.querySelector("#choicePrompt"),
  choices: document.querySelector("#choices"),
  soundToggle: document.querySelector("#soundToggleBtn"),
  volume: document.querySelector("#volumeSlider"),
  audioSceneText: document.querySelector("#audioSceneText"),
};

const scenes = [
  {
    key: "danger",
    label: "危险逼近",
    className: "scene-danger",
    words: ["枪", "危险", "杀", "血", "疼", "恐惧", "崩塌", "坏结局", "死亡", "攻击"],
  },
  {
    key: "stars",
    label: "星河夜幕",
    className: "scene-stars",
    words: ["星", "银河", "夜空", "天文", "观景台", "宇宙"],
  },
  {
    key: "ice",
    label: "冰雪之城",
    className: "scene-ice",
    words: ["冰", "冰雕", "寒冷", "冻", "霜"],
  },
  {
    key: "snow",
    label: "雪夜行旅",
    className: "scene-snow",
    words: ["雪", "下雪", "雪花", "伞"],
  },
  {
    key: "dream",
    label: "梦与记忆",
    className: "scene-dream",
    words: ["梦", "记忆", "错觉", "熟悉", "回忆", "幻"],
  },
  {
    key: "cable",
    label: "天空缆车",
    className: "scene-cable",
    words: ["缆车", "车厢", "候车", "车票", "上等车厢"],
  },
];

const soundScenes = [
  {
    key: "crowd",
    label: "候车人声",
    src: "audio/crowd.mp3",
    words: ["排队", "窗口", "服务生", "服务员", "候车", "羡慕", "前台"],
  },
  {
    key: "train",
    label: "缆车运行",
    src: "audio/train-interior.mp3",
    words: ["缆车", "车厢", "列车", "铁轨", "运行", "乘车", "登陆口"],
  },
  {
    key: "rain",
    label: "雨声",
    src: "audio/rain.mp3",
    words: ["雨", "下雨", "雨声", "雨水"],
  },
  {
    key: "snow",
    label: "落雪与风",
    src: "audio/wind-snow.mp3",
    words: ["雪", "下雪", "雪花", "冰", "寒冷", "冻", "霜"],
  },
  {
    key: "stars",
    label: "星夜风声",
    src: "audio/night-wind.mp3",
    volumeScale: 0.5,
    words: ["星河", "星空", "观星台", "观星", "夜空", "宇宙", "天文"],
  },
  {
    key: "danger",
    label: "低频不安",
    src: "audio/danger-wind.mp3",
    words: ["枪", "危险", "杀", "血", "疼", "恐惧", "崩塌", "死亡", "攻击"],
  },
];

const ambientResetWords = [
  "早上醒来",
  "醒来时",
  "下午",
  "晚上",
  "夜晚",
  "第二天",
  "第三天",
  "第二日",
  "第三日",
  "此时的时间",
  "时间已经",
  "时间还早",
  "走出",
  "离开",
  "进入",
  "回到",
  "去了",
  "去餐厅",
  "去观星台",
  "去活动室",
  "追逐结束",
];

const bgmRanges = [
  {
    key: "3-daily",
    label: "3-daily",
    src: "audio/bgm/3-daily.mp3",
    startId: 16,
    endId: 93,
  },
  {
    key: "time-machine",
    label: "time machine",
    src: "audio/bgm/time-machine.mp3",
    startId: 131,
    endId: 172,
  },
  {
    key: "3-daily-morning",
    label: "3-daily",
    src: "audio/bgm/3-daily.mp3",
    startId: 497,
    endId: 568,
  },
  {
    key: "stars-surfing",
    label: "Stars Surfing",
    src: "audio/bgm/stars-surfing.mp3",
    startId: 437,
    endId: 488,
  },
  {
    key: "credo",
    label: "Credo",
    src: "audio/bgm/credo.mp3",
    startId: 618,
    endId: 678,
  },
  {
    key: "timeless-notebook",
    label: "Timeless",
    src: "audio/bgm/timeless.mp3",
    startId: 692,
    endId: 842,
  },
  {
    key: "undercover",
    label: "Undercover Experiment",
    src: "audio/bgm/undercover-experiment.mp3",
    startId: 849,
    endId: 973,
  },
  {
    key: "timeless-bar",
    label: "Timeless",
    src: "audio/bgm/timeless.mp3",
    startId: 974,
    endId: 1057,
  },
  {
    key: "new-days",
    label: "new days",
    src: "audio/bgm/new-days.mp3",
    startId: 1058,
    endId: Infinity,
  },
];

const audioState = {
  current: null,
  currentAudio: null,
  enabled: true,
  retiredAudios: new Set(),
  fadeTimers: new Map(),
};

const bgmState = {
  current: null,
  currentAudio: null,
  enabled: true,
  retiredAudios: new Set(),
  fadeTimers: new Map(),
};

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function getScene(item) {
  const text = item?.raw ?? item?.text ?? "";
  return scenes.find((scene) => scene.words.some((word) => text.includes(word))) ?? scenes[5];
}

function applyScene(item) {
  const scene = getScene(item);
  document.body.classList.remove(...scenes.map((entry) => entry.className));
  document.body.classList.add(scene.className);
  els.sceneLabel.textContent = scene.label;
}

function getSoundScene(text) {
  if (ambientResetWords.some((word) => text.includes(word))) return { key: "silence", label: "环境声暂停" };
  return soundScenes.find((scene) => scene.words.some((word) => text.includes(word))) ?? null;
}

function roleFor(item) {
  if (item.kind === "qiming") return "你";
  if (item.kind === "miku") return "弥久";
  return "";
}

function renderEntry(viewItem) {
  const li = document.createElement("li");
  li.className = `entry entry-${viewItem.kind}`;
  li.dataset.id = viewItem.id;
  li.dataset.kind = viewItem.kind;
  li.dataset.raw = viewItem.raw;

  const role = roleFor(viewItem);
  const roleHtml = role ? `<span class="entry-speaker">${escapeHtml(role)}</span>` : "";
  li.innerHTML = `
    ${roleHtml}
    <p class="entry-text">${escapeHtml(viewItem.text)}</p>
  `;
  return li;
}

function render() {
  if (!state.story) return;
  els.log.replaceChildren(...state.displayed.filter((item) => !state.hiddenIds.has(item.id)).map(renderEntry));

  const total = state.story.items.length;
  els.progressText.textContent = `${state.cursor} / ${total}`;
  els.progressBar.style.width = `${Math.round((state.cursor / total) * 100)}%`;
  els.continue.disabled = Boolean(state.waiting) || state.cursor >= total;
  els.advancePanel.hidden = Boolean(state.waiting) || state.cursor >= total || state.displayed.length === 0;
  els.modeText.textContent = state.waiting ? "等待你的选择。" : state.cursor >= total ? "故事已结束。" : "剧情推进中。";

  const current = state.displayed[state.displayed.length - 1];
  if (current) applyScene(current);
  requestAnimationFrame(updateAudioFromViewport);
}

function showChoices(waiting) {
  state.waiting = waiting;
  els.choicePrompt.textContent = waiting.prompt;
  els.choices.replaceChildren(...waiting.options.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => choose(option));
    return button;
  }));
  els.choicePanel.hidden = false;
  render();
  els.choicePanel.scrollIntoView({ block: "center", behavior: "smooth" });
}

function hideChoices() {
  state.waiting = null;
  els.choicePanel.hidden = true;
  els.choices.replaceChildren();
}

function diceSkill(text) {
  const match = text.match(/\.ra\s*([^\s]+)/i);
  return match ? match[1] : "";
}

function choiceLabelFor(item) {
  const body = item.body.trim();
  const skill = diceSkill(body);
  if (skill) {
    const labels = {
      "侦查": "四下张望看看",
      "聆听": "侧耳倾听",
      "图书馆": "查找资料",
      "心理学": "观察对方的反应",
      "灵感": "顺着直觉想一想",
      "幸运": "碰碰运气",
      "说服": "试着说服对方",
    };
    return labels[skill] ?? `尝试${skill}`;
  }
  if (/^["“]/.test(body)) return "这样回应";
  if (body.includes("？") || body.includes("?")) return "开口询问";
  if (body.includes("看") || body.includes("观察") || body.includes("瞄")) return "仔细看看";
  if (body.includes("决定") || body.includes("准备")) return "按自己的想法行动";
  if (body.length <= 18) return body;
  return body.slice(0, 18).replace(/[，。,.、：:；;]+$/, "") + "...";
}

function isDiceRobot(item) {
  return item.kind === "dice" || item.speaker.includes("封不觉") || item.raw.includes("检定结果");
}

function isJunkCommandOrResult(item) {
  const text = item.body.trim();
  const raw = item.raw.trim();
  return (
    /^\.(sc|st)\b/i.test(text) ||
    /^d100\s*=/i.test(raw) ||
    raw.startsWith("理智变化") ||
    raw.includes("理智检定") ||
    raw.includes("coc7属性录入完成") ||
    raw.startsWith("「坏结局」") ||
    raw.startsWith("理智归零") ||
    raw === "意料之中，或者说，好，不愧是你！" ||
    raw === "啧。"
  );
}

function pushItem(item) {
  state.displayed.push({
    id: item.id,
    kind: item.kind === "kp" || item.kind === "other" ? "narration" : item.kind,
    text: item.body,
    raw: item.raw,
  });
}

function clearSound(immediate = false) {
  clearAudioLayer(audioState, immediate);
}

function clearBgm(immediate = false) {
  clearAudioLayer(bgmState, immediate);
}

function clearAudioLayer(layer, immediate = false) {
  if (!layer.currentAudio) {
    if (immediate) stopRetiredAudios(layer);
    return;
  }
  const oldAudio = layer.currentAudio;
  layer.currentAudio = null;
  layer.current = null;
  layer.retiredAudios.add(oldAudio);
  fadeAudio(oldAudio, oldAudio.volume, 0, immediate ? 0 : 900, () => {
    oldAudio.pause();
    oldAudio.src = "";
    layer.retiredAudios.delete(oldAudio);
  });
}

function playSoundScene(scene) {
  if (!audioState.enabled || !scene) return;
  playAudioLayer(audioState, scene, targetVolume() * (scene.volumeScale ?? 1), "ambient");
  els.audioSceneText.textContent = scene.label;
}

function playBgm(range) {
  if (!bgmState.enabled || !range) return;
  playAudioLayer(bgmState, range, 0.46, "bgm");
}

function playAudioLayer(layer, scene, volume, layerName) {
  if (layer.current === scene.key && layer.currentAudio) return;

  stopRetiredAudios(layer);
  const oldAudio = layer.currentAudio;
  const nextAudio = new Audio(scene.src);
  nextAudio.loop = true;
  nextAudio.preload = "auto";
  nextAudio.volume = 0;
  layer.current = scene.key;
  layer.currentAudio = nextAudio;

  nextAudio.play().then(() => {
    fadeAudio(nextAudio, 0, volume, 1600);
    if (oldAudio) {
      layer.retiredAudios.add(oldAudio);
      fadeAudio(oldAudio, oldAudio.volume, 0, 900, () => {
        oldAudio.pause();
        oldAudio.src = "";
        layer.retiredAudios.delete(oldAudio);
      });
    }
  }).catch(() => {
    if (layerName === "ambient") els.audioSceneText.textContent = "点击继续后播放";
  });
}

function stopRetiredAudios(layer) {
  layer.retiredAudios.forEach((audio) => {
    const timer = layer.fadeTimers.get(audio);
    if (timer) window.clearInterval(timer);
    layer.fadeTimers.delete(audio);
    audio.pause();
    audio.src = "";
  });
  layer.retiredAudios.clear();
}

function targetVolume() {
  return Number(els.volume.value) / 100;
}

function fadeAudio(audio, from, to, duration, done) {
  const layer = audio === bgmState.currentAudio || bgmState.retiredAudios.has(audio) ? bgmState : audioState;
  const oldTimer = layer.fadeTimers.get(audio);
  if (oldTimer) window.clearInterval(oldTimer);
  if (duration === 0) {
    audio.volume = to;
    done?.();
    return;
  }
  const started = performance.now();
  audio.volume = from;
  const timer = window.setInterval(() => {
    const progress = Math.min(1, (performance.now() - started) / duration);
    audio.volume = from + (to - from) * progress;
    if (progress >= 1) {
      window.clearInterval(timer);
      layer.fadeTimers.delete(audio);
      done?.();
    }
  }, 50);
  layer.fadeTimers.set(audio, timer);
}

function updateAudioFromViewport() {
  const entries = [...document.querySelectorAll(".entry")];
  if (!entries.length) return;
  const viewportBottom = window.innerHeight;
  const visible = entries
    .map((entry) => ({ entry, rect: entry.getBoundingClientRect() }))
    .filter(({ rect }) => rect.top < viewportBottom && rect.bottom > 0)
    .sort((a, b) => a.rect.bottom - b.rect.bottom);
  const target = visible.at(-1)?.entry ?? entries.at(-1);
  const scene = getSoundScene(target.dataset.raw || target.innerText);
  if (scene?.key === "silence") {
    clearSound();
    els.audioSceneText.textContent = scene.label;
  } else if (scene) playSoundScene(scene);
  else clearSound();

  const id = Number(target.dataset.id);
  const range = bgmRanges.find((entry) => id >= entry.startId && id <= entry.endId);
  if (range) playBgm(range);
  else clearBgm();
}

function playUntilChoice() {
  if (!state.story || state.waiting) return;
  els.intro.classList.add("is-hidden");
  let released = 0;
  let releasedChars = 0;

  while (state.cursor < state.story.items.length) {
    const item = state.story.items[state.cursor];

    if (state.hiddenIds.has(item.id)) {
      state.cursor += 1;
      continue;
    }

    if (isJunkCommandOrResult(item)) {
      state.cursor += 1;
      continue;
    }

    if (isDiceRobot(item)) {
      state.cursor += 1;
      continue;
    }

    if (item.kind === "qiming") {
      const skill = diceSkill(item.body);
      showChoices({
        prompt: skill ? "你要怎么做？" : "轮到你回应。",
        options: [{ label: choiceLabelFor(item), item, isDice: Boolean(skill) }],
      });
      return;
    }

    pushItem(item);
    state.cursor += 1;
    released += 1;
    releasedChars += item.body.length;

    const next = state.story.items[state.cursor];
    const nextIsHidden = next && (isDiceRobot(next) || isJunkCommandOrResult(next) || state.hiddenIds.has(next.id));
    const nextIsChoice = next && next.kind === "qiming" && !isJunkCommandOrResult(next);
    const shouldPause =
      item.body.length >= 120 ||
      released >= 2 ||
      releasedChars >= 180 ||
      nextIsChoice ||
      (released >= 1 && nextIsHidden);

    if (shouldPause) break;
  }

  render();
  const last = els.log.lastElementChild;
  if (last) last.scrollIntoView({ block: "center", behavior: "smooth" });
  if (!state.waiting) els.advancePanel.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

async function init() {
  if (window.STORY_DATA) {
    state.story = window.STORY_DATA;
  } else {
    const response = await fetch("data/story.json");
    state.story = await response.json();
  }
  els.progressText.textContent = `0 / ${state.story.items.length}`;

  const saved = localStorage.getItem("galaxy-cable-save");
  const hiddenIds = JSON.parse(localStorage.getItem("galaxy-cable-hidden-ids") || "[]");
  state.hiddenIds = new Set(hiddenIds);
}

function toViewItem(item) {
  return {
    id: item.id,
    kind: item.kind === "kp" || item.kind === "other" ? "narration" : item.kind,
    text: item.body,
    raw: item.raw,
  };
}

function choose(option) {
  hideChoices();
  if (!option.isDice) pushItem(option.item);
  state.cursor += 1;
  while (
    state.cursor < state.story.items.length &&
    (
      isDiceRobot(state.story.items[state.cursor]) ||
      isJunkCommandOrResult(state.story.items[state.cursor]) ||
      state.hiddenIds.has(state.story.items[state.cursor].id)
    )
  ) {
    state.cursor += 1;
  }
  playUntilChoice();
}

function restart() {
  state.cursor = 0;
  state.displayed = [];
  hideChoices();
  els.intro.classList.remove("is-hidden");
  localStorage.removeItem("galaxy-cable-save");
  render();
}

function jumpToFloor() {
  if (!state.story) return;
  const total = state.story.items.length;
  const floor = Number(els.jumpInput.value);
  if (!Number.isInteger(floor) || floor < 1 || floor > total) {
    els.jumpHint.textContent = `请输入 1 到 ${total} 之间的整数。`;
    return;
  }

  hideChoices();
  state.cursor = floor;
  state.displayed = state.story.items
    .filter((item) => item.id <= floor)
    .filter((item) => !state.hiddenIds.has(item.id))
    .filter((item) => !isJunkCommandOrResult(item))
    .filter((item) => !isDiceRobot(item))
    .filter((item) => !diceSkill(item.body))
    .map(toViewItem);

  els.intro.classList.add("is-hidden");
  render();
  els.log.lastElementChild?.scrollIntoView({ block: "center", behavior: "smooth" });
  els.jumpPanel.hidden = true;
  els.jumpHint.textContent = "输入不超过当前总进度的数字。";
}

els.start.addEventListener("click", () => playUntilChoice());
els.continue.addEventListener("click", () => playUntilChoice());
els.jump.addEventListener("click", () => {
  if (!state.story) return;
  els.jumpPanel.hidden = !els.jumpPanel.hidden;
  els.jumpInput.max = String(state.story.items.length);
  els.jumpHint.textContent = `输入 1-${state.story.items.length} 的楼层编号。`;
  if (!els.jumpPanel.hidden) els.jumpInput.focus();
});
els.jumpConfirm.addEventListener("click", jumpToFloor);
els.jumpCancel.addEventListener("click", () => {
  els.jumpPanel.hidden = true;
  els.jumpInput.value = "";
});
els.soundToggle.addEventListener("click", () => {
  audioState.enabled = !audioState.enabled;
  els.soundToggle.textContent = audioState.enabled ? "关闭" : "开启";
  if (audioState.enabled) {
    updateAudioFromViewport();
  } else {
    clearSound(true);
    audioState.current = null;
    els.audioSceneText.textContent = "未播放";
  }
});
els.volume.addEventListener("input", () => {
  if (!audioState.currentAudio) return;
  audioState.currentAudio.volume = targetVolume();
});
els.restart.addEventListener("click", restart);
window.addEventListener("scroll", () => requestAnimationFrame(updateAudioFromViewport), { passive: true });
window.addEventListener("resize", () => requestAnimationFrame(updateAudioFromViewport));

init();
