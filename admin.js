let tests = [];

function createTest() {
  const name = document.getElementById('testName').value.trim();
  const code = document.getElementById('testCode').value.trim();
  if(!name || !code){ alert("Nom va kod kiriting"); return; }

  fetch('/api/createTest',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name, code})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error){ alert(data.error); return; }
    alert("Test yaratildi!");
    renderTests();
  })
  .catch(err=>{ alert("Xatolik"); console.log(err); });
}

function addQuestion() {
  const testCode = document.getElementById('testCode').value.trim();
  const text = document.getElementById('questionText').value.trim();
  const options = Array.from(document.querySelectorAll('.option')).map(input=>input.value.trim());
  const answer = parseInt(document.getElementById('correctOption').value);
  const points = parseInt(document.getElementById('points').value);

  if(!text || options.some(o=>!o) || !testCode){ alert("Barcha maydonlarni to‘ldiring"); return; }

  fetch('/api/addQuestion',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({testCode,text,options,answer,points})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error){ alert(data.error); return; }
    alert("Savol qo‘shildi!");
    clearQuestionForm();
    renderTests();
  })
  .catch(err=>{ alert("Xatolik yuz berdi"); console.log(err); });
}

function clearQuestionForm(){
  document.getElementById('questionText').value='';
  document.querySelectorAll('.option').forEach(input=>input.value='');
  document.getElementById('points').value='';
}

function renderTests(){
  fetch('./data/tests.json')
    .then(res=>res.json())
    .then(data=>{
      tests=data;
      const ul=document.getElementById('tests');
      ul.innerHTML='';
      tests.forEach(t=>{
        const li=document.createElement('li');
        li.textContent=`${t.name} (${t.code}) - ${t.questions.length} savol`;
        ul.appendChild(li);
      });
    }).catch(err=>console.log(err));
}
