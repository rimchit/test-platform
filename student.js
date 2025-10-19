let currentQuestion = 0;
let questions = [];
let userAnswers = [];
let time = 2*60*60; // 2 soat

function startTest() {
  const code = document.getElementById('testCode').value.trim();
  if(!code){ alert("Test kodini kiriting"); return; }

  fetch(`/api/test/${code}`)
    .then(res=>res.json())
    .then(data=>{
      questions = data.questions;
      userAnswers = Array(questions.length).fill(null);
      document.getElementById('test-section').style.display='none';
      document.getElementById('question-section').style.display='block';
      showQuestion();
      startTimer();
    })
    .catch(err=>{ alert("Test topilmadi"); console.log(err); });
}

function showQuestion() {
  const q = questions[currentQuestion];
  let optionsHtml = '';
  q.options.forEach((opt,index)=>{
    const checked = userAnswers[currentQuestion]===index?'checked':'';
    optionsHtml += `<label><input type="radio" name="option" value="${index}" ${checked}> ${opt}</label>`;
  });
  document.getElementById('question-container').innerHTML = `<div class="question-text">${q.text}</div><div class="options">${optionsHtml}</div>`;
  document.getElementById('prevBtn').disabled = currentQuestion===0;
  document.getElementById('nextBtn').style.display = currentQuestion===questions.length-1?'none':'inline-block';
  document.getElementById('finishBtn').style.display = currentQuestion===questions.length-1?'inline-block':'none';
  updateProgress();
}

function nextQuestion(){ saveAnswer(); if(currentQuestion<questions.length-1) currentQuestion++; showQuestion();}
function prevQuestion(){ saveAnswer(); if(currentQuestion>0) currentQuestion--; showQuestion();}
function saveAnswer(){ const sel=document.querySelector('input[name="option"]:checked'); if(sel) userAnswers[currentQuestion]=parseInt(sel.value);}
function updateProgress(){ const answered=userAnswers.filter(a=>a!==null).length; document.getElementById('progress').style.width=(answered/questions.length*100)+'%';}

function finishTest() {
  saveAnswer();
  const studentName = prompt("Ismingizni kiriting:");
  fetch('/api/answer',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({student:studentName, testCode:document.getElementById('testCode').value, answers:userAnswers})
  })
  .then(res=>res.json())
  .then(data=>{
    let score=0, result='Xato javoblar:\n';
    questions.forEach((q,i)=>{
      if(userAnswers[i]===q.answer) score++;
      else result+=`${i+1}-savol: To'g'ri javob: ${q.options[q.answer]}\n`;
    });
    alert(`Siz ${score} ta to'g'ri javob berdingiz.\n\n${result}`);
  })
  .catch(err=>{ alert("Xatolik yuz berdi"); console.log(err); });
}

// Timer
function startTimer(){
  const timerEl=document.getElementById('timer');
  const interval = setInterval(()=>{
    let h=Math.floor(time/3600).toString().padStart(2,'0');
    let m=Math.floor((time%3600)/60).toString().padStart(2,'0');
    let s=(time%60).toString().padStart(2,'0');
    timerEl.textContent=`${h}:${m}:${s}`;
    time--;
    if(time<0){ clearInterval(interval); finishTest(); }
  },1000);
}
