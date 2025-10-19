const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.')); // HTML, CSS, JS fayllarni xizmat qiladi

// Testlarni olish
app.get('/api/test/:code', (req, res)=>{
    const code = req.params.code;
    const tests = JSON.parse(fs.readFileSync('./data/tests.json'));
    const test = tests.find(t=>t.code === code);
    if(test){
        res.json(test);
    }else{
        res.status(404).json({error:"Test topilmadi"});
    }
});

// Javoblarni saqlash
app.post('/api/answer', (req,res)=>{
    const {student, testCode, answers} = req.body;
    let allAnswers = [];
    if(fs.existsSync('./data/answers.json')){
        allAnswers = JSON.parse(fs.readFileSync('./data/answers.json'));
    }
    allAnswers.push({student, testCode, answers, date: new Date()});
    fs.writeFileSync('./data/answers.json', JSON.stringify(allAnswers,null,2));
    res.json({status:"ok"});
});

// Admin test yaratish
app.post('/api/createTest', (req,res)=>{
    const {name, code} = req.body;
    let tests = [];
    if(fs.existsSync('./data/tests.json')){
        tests = JSON.parse(fs.readFileSync('./data/tests.json'));
    }
    if(tests.find(t=>t.code===code)) return res.status(400).json({error:"Bunday kod mavjud"});
    tests.push({name, code, questions:[]});
    fs.writeFileSync('./data/tests.json', JSON.stringify(tests,null,2));
    res.json({status:"ok"});
});

// Admin savol qo‘shish
app.post('/api/addQuestion', (req,res)=>{
    const {testCode, text, options, answer, points} = req.body;
    let tests = JSON.parse(fs.readFileSync('./data/tests.json'));
    const test = tests.find(t=>t.code===testCode);
    if(!test) return res.status(404).json({error:"Test topilmadi"});
    test.questions.push({text, options, answer, points});
    fs.writeFileSync('./data/tests.json', JSON.stringify(tests,null,2));
    res.json({status:"ok"});
});

app.listen(PORT, ()=>console.log(`Server ${PORT} portda ishlayapti`));
