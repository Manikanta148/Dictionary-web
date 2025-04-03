let element = document.querySelector('.toggling');
let container = document.querySelector('.container');
let aside = document.querySelector('aside');
let header = document.querySelector('header');
let result = document.querySelector('.result');
let togglingButton = document.querySelector('.toggling-button');
let historyButton = document.querySelector('.history-button');
let searchButton = document.querySelector('.search');
let speakButton = document.querySelector('.speak');
togglingButton.addEventListener('click',()=>{toggle()});
historyButton.addEventListener('click',()=>{sidebar()});
searchButton.addEventListener('click',()=>{search()});
speakButton.addEventListener('click',()=>{speak()});

function toggle(){

    if(element.classList.contains('bx-sun')){
        container.style.backgroundColor = "#333";
        container.style.color = "#ddd";
        aside.style.borderRight = '2px solid #ddd';
        aside.style.color = '#ddd';
        aside.style.backgroundColor = '#333';
        document.querySelector('.aside-top').style.borderColor = '#ddd';
        header.style.borderBottom = '2px solid #ddd';
        element.classList.remove('bx-sun');
        element.classList.add('bx-moon');
    }
    else{
        container.style.backgroundColor = "#ddd";
        container.style.color = "#333";
        aside.style.borderRight = '2px solid #333';
        aside.style.color = '#333';
        aside.style.backgroundColor = '#ddd';
        document.querySelector('.aside-top').style.borderColor = '#333';
        header.style.borderBottom = '2px solid #333';
        element.classList.remove('bx-moon');
        element.classList.add('bx-sun');
    }
}

function sidebar(){

    if(aside.style.display === 'block'){
        aside.style.display = 'none';
    }
    else{
        sidebarLists();
        aside.style.display = 'block';
    }
}

let meaning;
async function search(){

    let word = document.querySelector('.input-text').value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    if(word.trim() === ''){
        result.innerHTML = 'Please Enter a word!';
        return;
    }
    try{
        let response = await fetch(url);
        let data = await response.json();
        meaning = data[0].meanings[0].definitions[0].definition;
        result.innerHTML = `Meaning : ${meaning}`;
        storeData(word,meaning); 
    }
    catch(error){
        result.innerHTML = 'No meanings found';
        console.log('Error :'+ error);
    }
}

function speak(){

    let sentence;
    if(result.innerHTML === 'Please Enter a word!' || result.innerHTML === ''){
        sentence = 'Please enter a word';
    }
    else{
        sentence='Meaning;'+meaning;
    }
    let speech = new SpeechSynthesisUtterance(sentence);
    
    let voices = speechSynthesis.getVoices();
    speech.voice = voices.find(voice => voice.lang === "en-US") || voices[0];
    speechSynthesis.speak(speech);
}


function storeData(w,m){

    let lists = JSON.parse(localStorage.getItem('listitems')) || [];
    if (!lists.some(item => item.word.toLowerCase() === w.toLowerCase())) {
        lists.push({ word: w, meaning: m });
        localStorage.setItem('listitems', JSON.stringify(lists)); 
    }
    sidebarLists();
}

function sidebarLists(){

    let lists = JSON.parse(localStorage.getItem('listitems')) || [];
    let ul =document.querySelector('ul');
    ul.innerHTML= '';
    console.log(lists);
    if(lists && Array.isArray(lists)){
        lists.forEach(item => {
            let li = document.createElement('li');
            li.classList.add('list');
            li.addEventListener('click',()=>{selectItem(li.innerHTML)});
            li.innerHTML = item.word;
            ul.appendChild(li);
        });
    }
    else {
        console.log("lists is not an array:", lists);
    }
}

function selectItem(text){
    document.querySelector('.input-text').value = text;
    if(window.innerWidth<=500){
        aside.style.display = 'none';
    }
}

let trashButton = document.querySelector('.trash-button');
trashButton.addEventListener('click',()=>{
    localStorage.clear();
    sidebarLists();
    document.querySelector('.input-text').value = '';
    result.innerHTML = '';
})
