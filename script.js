// 课程与测验数据
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
      },
      {
        question: "哪个关键字用于条件判断？",
        options: ["loop", "check", "if"],
        answer: 2
      }
    ]
  }
};

let studentName = "";
let currentLesson = "python_basics";

// 页面切换
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
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
  document.getElementById('chat').innerHTML = '<div class="message ai">你好！我是你的 AI 编程老师，有什么可以帮你的吗？</div>';
}

function goHome() {
  showScreen('welcome');
}

// 渲染课程
function renderLesson() {
  const lesson = COURSE_DATA[currentLesson];
  document.getElementById('lessonTitle').innerText = `📚 ${lesson.title}`;
  
  const contentEl = document.getElementById('lessonContent');
  contentEl.innerHTML = '';
  lesson.content.forEach(line => {
    const li = document.createElement('li');
    li.textContent = line;
    contentEl.appendChild(li);
  });

  // 渲染测验
  const quizEl = document.getElementById('quiz');
  quizEl.innerHTML = '';
  lesson.quiz.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.innerHTML = `
      <p><strong>问题 ${idx + 1}:</strong> ${q.question}</p>
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
  const correct = COURSE_DATA[currentLesson].quiz[qIdx].answer;
  
  if (!selected) {
    resultEl.innerText = "请先选择一个答案！";
    resultEl.style.color = "orange";
    return;
  }

  if (parseInt(selected.value) === correct) {
    resultEl.innerHTML = "✅ 正确！";
    resultEl.style.color = "green";
  } else {
    resultEl.innerHTML = "❌ 错了哦~ 正确答案是：" + COURSE_DATA[currentLesson].quiz[qIdx].options[correct];
    resultEl.style.color = "red";
  }
}

// AI 答疑（调用 Hugging Face 免费 API）
async function askAI() {
  const input = document.getElementById('userQuestion');
  const question = input.value.trim();
  if (!question) return;

  const chat = document.getElementById('chat');
  
  // 显示用户消息
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = question;
  chat.appendChild(userMsg);
  chat.scrollTop = chat.scrollHeight;
  
  input.value = '';
  input.disabled = true;
  input.placeholder = "AI 思考中...";

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-0.5B-Instruct",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `<|im_start|>system\n你是一位耐心的编程老师，用简洁中文回答学生问题。<|im_end|>\n<|im_start|>user\n${question}<|im_end|>\n<|im_start|>assistant\n`,
          parameters: { max_new_tokens: 256, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    let answer = "抱歉，AI 暂时无法回答。";
    
    if (data && data[0] && data[0].generated_text) {
      answer = data[0].generated_text.split("<|im_start|>assistant\n").pop() || answer;
    }

    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    aiMsg.textContent = answer;
    chat.appendChild(aiMsg);
  } catch (err) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message ai';
    errorMsg.textContent = "⚠️ 网络错误，请检查网络后重试。";
    chat.appendChild(errorMsg);
  }

  input.disabled = false;
  input.placeholder = "例如：什么是列表？";
  chat.scrollTop = chat.scrollHeight;
}

// 初始化
showScreen('welcome');