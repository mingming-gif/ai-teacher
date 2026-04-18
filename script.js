//题库
const COURSE_DATA={lessons:[
    {name:"初中七年级",list:[
        {q:"3x+6=0 解是",opt:["x=2","x=-2","x=3","x=-3"],ans:"x=-2"},
        {q:"|a|=5",opt:["5","-5","±5","0"],ans:"±5"},
        {q:"多边形内角和",opt:["(n-2)*180","n*180","(n+2)*180","n*90"],ans:"(n-2)*180"}
    ]},
    {name:"初中八年级",list:[
        {q:"y=-3x+2 斜率",opt:["-3","3","2","-2"],ans:"-3"},
        {q:"勾股定理",opt:["a²+b²=c²","a+b=c","a²-b²=c²"],ans:"a²+b²=c²"}
    ]}
]};
const daily=[
    {q:"-2+-3=?",opt:["-5","-1","5","1"],ans:"-5"},
    {q:"2x=10",opt:["2","5","10","20"],ans:"5"}
];
const test=[
    {q:"2x-4=0",opt:["1","2","3","4"],ans:"2"},
    {q:"正方形面积16边长",opt:["2","4","8","16"],ans:"4"}
];

let studentName="";
let total=0,right=0,wrongList=[],point=0;
let allStudents=[],msgs=[],tasks=[];

//身份切换
document.getElementById("toStudent").onclick=()=>{
    document.getElementById("role-box").style.display="none";
    document.getElementById("student-login").style.display="block";
};
document.getElementById("toParent").onclick=()=>{
    document.getElementById("role-box").style.display="none";
    document.getElementById("parent-login").style.display="block";
};
document.getElementById("toTeacher").onclick=()=>{
    document.getElementById("role-box").style.display="none";
    document.getElementById("teacher-login").style.display="block";
};

//学生登录
document.getElementById("stuLoginBtn").onclick=()=>{
    let name=document.getElementById("stuName").value.trim();
    if(!name){alert("请输入名字");return;}
    studentName=name;
    document.getElementById("stuShowName").innerText=name;
    document.getElementById("student-login").style.display="none";
    document.getElementById("student-main").style.display="block";
    renderAll();
};

//家长登录
document.getElementById("parentLoginBtn").onclick=()=>{
    let name=document.getElementById("parentChildName").value.trim();
    if(!name){alert("输入孩子姓名");return;}
    let s=allStudents.find(i=>i.name===name);
    let html=s?`
        <div class="student-card">
            <h3>${s.name} 学习报告</h3>
            <p>总题：${s.total}</p><p>正确：${s.right}</p><p>错误：${s.wrong}</p>
            <p>正确率：${s.total?Math.round(s.right/s.total*100):0}%</p>
            <p>积分：${s.point||0}</p>
        </div>
    `:"<p>未找到该学生</p>";
    document.getElementById("parentResult").innerHTML=html;
    document.getElementById("parent-login").style.display="none";
    document.getElementById("parent-main").style.display="block";
};

//教师登录
document.getElementById("teaLoginBtn").onclick=()=>{
    let u=document.getElementById("teaUser").value,p=document.getElementById("teaPwd").value;
    if(u==="teacher"&&p==="123456"){
        document.getElementById("teacher-login").style.display="none";
        document.getElementById("teacher-main").style.display="block";
        refreshTeacher();
    }else alert("账号密码错误");
};

//标签切换
document.querySelectorAll(".tab").forEach((tab,i)=>{
    tab.onclick=()=>{
        document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll(".panel")[i].classList.add("active");
        if(document.querySelectorAll(".panel")[i].id==="wrong")renderWrong();
        if(document.querySelectorAll(".panel")[i].id==="msg")renderMsg();
        if(document.querySelectorAll(".panel")[i].id==="task")renderTask();
    };
});
document.querySelectorAll(".tea-tab").forEach((t,i)=>{
    t.onclick=()=>{
        document.querySelectorAll(".tea-tab").forEach(x=>x.classList.remove("active"));
        document.querySelectorAll(".tea-panel").forEach(x=>x.classList.remove("active"));
        t.classList.add("active");
        document.querySelectorAll(".tea-panel")[i].classList.add("active");
        refreshTeacher();
    };
});

//渲染
function renderAll(){renderQuiz();renderDaily();renderTest();refreshStats();renderMsg();renderTask();}
function renderQuiz(){
    let b=document.getElementById("quiz-list");b.innerHTML="";
    COURSE_DATA.lessons.forEach((les,li)=>{
        let d=document.createElement("div");
        d.innerHTML=`<h3 class="lesson-title">${les.name}</h3>`;
        les.list.forEach((q,qi)=>{
            let id=li*100+qi;
            d.innerHTML+=`
                <div class="quiz-item">
                    <p>题目${qi+1}：${q.q}</p>
                    ${q.opt.map(o=>`<label class="option"><input type="radio" name="q${id}" value="${o}">${o}</label>`).join('')}
                    <button onclick="check(${li},${qi},${id})">提交</button>
                    <p id="res${id}" class="result"></p>
                </div>`;
        });
        b.appendChild(d);
    });
}
function renderDaily(){
    let b=document.getElementById("daily-list");b.innerHTML="";
    daily.forEach((q,i)=>{
        b.innerHTML+=`
            <div class="quiz-item">
                <p>每日${i+1}：${q.q}</p>
                ${q.opt.map(o=>`<label class="option"><input type="radio" name="d${i}" value="${o}">${o}</label>`).join('')}
                <button onclick="checkDaily(${i})">提交</button>
                <p id="dres${i}" class="result"></p>
            </div>`;
    });
}
function renderTest(){
    let b=document.getElementById("test-list");b.innerHTML="";
    test.forEach((q,i)=>{
        b.innerHTML+=`
            <div class="quiz-item">
                <p>测试${i+1}：${q.q}</p>
                ${q.opt.map(o=>`<label class="option"><input type="radio" name="t${i}" value="${o}">${o}</label>`).join('')}
            </div>`;
    });
}

//判题+积分
function check(li,qi,id){
    let q=COURSE_DATA.lessons[li].list[qi];
    let s=document.querySelector(`input[name="q${id}"]:checked`);
    if(!s){document.getElementById(`res${id}`).innerText="请选择";return;}
    total++;
    if(s.value===q.ans){right++;point+=5;document.getElementById(`res${id}`).innerText="✅ +5积分";}
    else{wrongList.push({q:q.q,you:s.value,ans:q.ans});document.getElementById(`res${id}`).innerText="❌ "+q.ans;}
    save();refreshStats();
}
function checkDaily(i){
    let q=daily[i];let s=document.querySelector(`input[name="d${i}"]:checked`);
    if(!s)return;total++;
    if(s.value===q.ans){right++;point+=3;document.getElementById(`dres${i}`).innerText="✅ +3积分";}
    else{wrongList.push({q:q.q,you:s.value,ans:q.ans});document.getElementById(`dres${i}`).innerText="❌ "+q.ans;}
    save();refreshStats();
}
document.getElementById("submitTest").onclick=()=>{
    let r=0;test.forEach((q,i)=>{let s=document.querySelector(`input[name="t${i}"]:checked`);if(s&&s.value===q.ans)r++;});
    document.getElementById("test-result").innerText=`得分：${r}/${test.length}`;
    point+=r*2;save();refreshStats();
};

//统计
function refreshStats(){
    document.getElementById("total").innerText=total;
    document.getElementById("right").innerText=right;
    document.getElementById("wrong-count").innerText=wrongList.length;
    document.getElementById("rate").innerText=(total?Math.round(right/total*100):0)+"%";
    document.getElementById("scorePoint").innerText=point;
}
function renderWrong(){
    let b=document.getElementById("wrong-list");
    b.innerHTML=wrongList.length?wrongList.map((w,i)=>`
        <div class="wrong-item"><p>错题${i+1}：${w.q}</p><p>你：${w.you} 正确：${w.ans}</p></div>
    `).join(''):"<p>暂无错题</p>";
}

//留言
document.getElementById("sendMsg").onclick=()=>{
    let c=document.getElementById("msgInput").value;if(!c)return;
    msgs.push({name:studentName,content:c,time:new Date().toLocaleString()});
    document.getElementById("msgInput").value="";renderMsg();
};
function renderMsg(){
    document.getElementById("msgList").innerHTML=msgs.map(m=>`
        <div class="msg-item"><b>${m.name}</b> ${m.time}<br>${m.content}</div>
    `).join('');
}

//作业
document.getElementById("sendTask").onclick=()=>{
    let c=document.getElementById("taskContent").value;if(!c)return;
    tasks.push({name:studentName,content:c,time:new Date().toLocaleString()});
    document.getElementById("taskContent").value="";renderTask();alert("提交成功");
};
function renderTask(){
    document.getElementById("taskList").innerHTML=tasks.filter(t=>t.name===studentName).map(t=>`
        <div class="task-item">${t.time}<br>${t.content}</div>
    `).join('');
}

//保存学生
function save(){
    let d={name:studentName,total,right,wrong:wrongList.length,point,wrongList};
    let i=allStudents.findIndex(s=>s.name===studentName);
    if(i>=0)allStudents[i]=d;else allStudents.push(d);
}

//教师刷新
function refreshTeacher(){
    document.getElementById("student-data").innerHTML=allStudents.map(s=>`
        <div class="student-card"><h3>${s.name}</h3><p>总题：${s.total} 正确：${s.right} 积分：${s.point||0}</p></div>
    `).join('');
    document.getElementById("teacherTaskList").innerHTML=tasks.map(t=>`
        <div class="task-item"><b>${t.name}</b> ${t.time}<br>${t.content}</div>
    `).join('');
    document.getElementById("teacherMsgList").innerHTML=msgs.map(m=>`
        <div class="msg-item"><b>${m.name}</b> ${m.time}<br>${m.content}</div>
    `).join('');
}

//教师加题
document.getElementById("addQuestion").onclick=()=>{
    let q=document.getElementById("qTitle").value,o1=document.getElementById("qOpt1").value,o2=document.getElementById("qOpt2").value,a=document.getElementById("qAns").value;
    if(!q||!o1||!o2||!a){alert("填写完整");return;}
    COURSE_DATA.lessons[0].list.push({q,opt:[o1,o2,document.getElementById("qOpt3").value,document.getElementById("qOpt4").value],ans:a});
    alert("添加成功");renderQuiz();
};