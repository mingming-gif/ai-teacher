// 简化版 AI 教师 - 兼容性更强
const COURSE_DATA = {
  python_basics: {
    title: "Python 基础入门",
    content: [
      "变量用于存储数据，例如：name = 'Alice'",
      "条件语句用 if/elif/else 控制程序流程",
      "循环有两种：for 遍历序列，while 在条件为真时重复",
      "函数用 def 定义，可重复使用代码块"
    ],
    quiz: [
      {
        question: "以下哪项是定义函数的正确语法？",
        options: ["function my_func():", "def my_func():", "func my_func():"],
        answer: 1
      }
    ]
  }
};

let studentName = "";

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById(id).style.display = 'block';
}

function startLearning() {
  studentName = document.getElementById('studentName').value.trim() || "同学";
  renderLesson();
  showScreen('lesson');
}

function showLesson() {
  showScreen('lesson');
}

function showQnA() {
  showScreen('qna');
  const chat = document.getElementById('chat');
  chat.innerHTML = '<div class="message ai">你好！我是你的 AI 编程老师，请提问（如“什么是变量？”）</div>';
}

function goHome() {
  showScreen('welcome');
}

function renderLesson() {
  const lesson = COURSE_DATA.python_basics;
  document.getElementById('lessonTitle').innerText = `📚 ${lesson.title}`;
  
  const contentEl = document.getElementById('lessonContent');
  contentEl.innerHTML = '';
  lesson.content.forEach(line => {
    const li = document.createElement('li');
    li.textContent = line;
    contentEl.appendChild(li);
  });

  const quizEl = document.getElementById('quiz');
  quizEl.innerHTML = '';
  lesson.quiz.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.innerHTML = `
      <p><strong>问题:</strong> ${q.question}</p>
      ${q.options.map((opt, i) => 
        `<label class="option"><input type="radio" name="q${idx}" value="${i}"> ${opt}</label>`
      ).join('')}
      <button onclick="checkAnswer(${idx})">提交</button>
      <p id="result-${idx}"></p>
    `;
    quizEl.appendChild(div);
  });
}

function checkAnswer(qIdx) {
  const selected = document.querySelector(`input[name="q${qIdx}"]:checked`);
  const resultEl = document.getElementById(`result-${qIdx}`);
  const correct = COURSE_DATA.python_basics.quiz[qIdx].answer;
  
  if (!selected) {
    resultEl.innerText = "请先选择一个答案！";
    resultEl.style.color = "orange";
    return;
  }

  if (parseInt(selected.value) === correct) {
    resultEl.innerHTML = "✅ 正确！";
    resultEl.style.color = "green";
  } else {
    resultEl.innerHTML = "❌ 错了哦~ 正确答案是：" + COURSE_DATA.python_basics.quiz[qIdx].options[correct];
    resultEl.style.color = "red";
  }
}

// 使用更兼容的 AI 调用方式
async function askAI() {
  const input = document.getElementById('userQuestion');
  const question = input.value.trim();
  if (!question) return;

  const chat = document.getElementById('chat');
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = question;
  chat.appendChild(userMsg);
  chat.scrollTop = chat.scrollHeight;
  
  input.value = '';
  input.disabled = true;
  input.placeholder = "思考中...";

  try {
    // 使用公开 CORS 代理（临时解决跨域问题）
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-0.5B-Instruct';
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: `你是编程老师，用中文简洁回答：${question}`,
        parameters: { max_new_tokens: 200, temperature: 0.7 }
      })
    });

    const data = await response.json();
    let answer = "抱歉，AI 暂时无法回答。";

    if (typeof data === 'string') {
      answer = data;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    }

    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    aiMsg.textContent = answer;
    chat.appendChild(aiMsg);
  } catch (err) {
    console.error("AI Error:", err);
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message ai';
    errorMsg.textContent = "⚠️ AI 服务暂时不可用，请稍后再试。";
    chat.appendChild(errorMsg);
  }

  input.disabled = false;
  input.placeholder = "例如：什么是列表？";
  chat.scrollTop = chat.scrollHeight;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  showScreen('welcome');
});