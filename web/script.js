// 获取 DOM 元素
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const questionText = document.getElementById("question");
const mainImage = document.getElementById("mainImage");

// URL 参数处理
const params = new URLSearchParams(window.location.search);
const username = params.get("name");

// 安全处理用户名
const sanitizeUsername = (name) => {
  const maxLength = 20;
  if (!name) return "???";
  // 过滤 HTML 特殊字符
  const safeName = name.replace(/[<>]/g, "").substring(0, maxLength);
  return safeName || "???";
};

const safeUsername = sanitizeUsername(username);

// 更新问题文本 (使用 textContent 防止 XSS)
questionText.innerHTML = `哦嗨呦，学妹！<br>${safeUsername}`;

let clickCount = 0;
const noTexts = [
  "？你认真的吗…", 
  "要不再想想？",
  "不许选这个！",
  "伤心…",
  "不行:("
];
const MAX_CLICKS = noTexts.length;

// 图片预加载 (防止切换时闪烁)
const preloadImages = () => {
  ["shocked", "think", "angry", "crying"].forEach(name => {
    new Image().src = `images/${name}.png`;
  });
};
preloadImages();

// No 按钮交互逻辑
noButton.addEventListener("click", () => {
  clickCount = Math.min(clickCount + 1, MAX_CLICKS);
  
  // 按钮样式变化
  yesButton.style.transform = `scale(${1 + clickCount * 1.2})`;
  noButton.style.transform = `translateX(${clickCount * 50}px)`;
  
  // 全局元素位移
  const verticalOffset = clickCount * 25;
  [mainImage, questionText].forEach(el => {
    el.style.transform = `translateY(-${verticalOffset}px)`;
  });

  // 更新文案和图片
  if (clickCount <= MAX_CLICKS) {
    noButton.textContent = noTexts[clickCount - 1];
    const imageMap = {
      1: "shocked",
      2: "think",
      3: "angry",
      4: "crying",
      5: "crying"
    };
    mainImage.src = `images/${imageMap[clickCount] || "heart"}.png`;
  }
});

// Yes 按钮成功页面
yesButton.addEventListener("click", () => {
  // 创建新页面结构
  document.body.innerHTML = `
    <div class="yes-screen">
      <h1 class="yes-text">${safeUsername}  ♡︎ᐝ(>᎑< )</h1>
      <img src="images/hug.png" alt="拥抱" class="yes-image"
           onerror="this.style.display='none'">
    </div>
  `;
  
  // 样式修正
  document.body.style.overflow = "hidden";
  
  // 添加回退动画
  const yesText = document.querySelector(".yes-text");
  yesText.animate([
    { transform: "scale(1)", opacity: 0 },
    { transform: "scale(1.2)", opacity: 1 }
  ], {
    duration: 800,
    iterations: 1
  });
});

// 图片加载失败处理
mainImage.addEventListener("error", () => {
  mainImage.style.display = "none";
});