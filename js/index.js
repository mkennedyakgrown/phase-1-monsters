document.addEventListener('DOMContentLoaded', () => {
    addMonsterForm();
    document.getElementById('back').addEventListener('click', pageTurn);
    document.getElementById('forward').addEventListener('click', pageTurn);
    fetch('http://localhost:3000/monsters/?_limit=50')
    .then(res => res.json())
    .then(json => loadMonsters(json))
    .then(json => {
        const span = document.createElement('span');
        span.setAttribute('id', 'page-number');
        span.innerText = " page 1";
        document.getElementById('back').insertAdjacentElement("afterend", span);
    });
});

function pageTurn(event) {
    let pageNum;
    if (event.target.id === 'back') {
        pageNum = parseInt(document.getElementById('page-number').innerText.slice(6)) - 1;
    } else {
        pageNum = parseInt(document.getElementById('page-number').innerText.slice(6)) + 1;
    }
    if (pageNum === 0) {
        return;
    }
    fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
    .then(res => res.json())
    .then(json => loadMonsters(json))
    .then(json => document.getElementById('page-number').innerText = ` page ${pageNum}`);
}

function addMonsterForm() {
    const createDiv = document.getElementById('create-monster');
    const createMonster = document.createElement('form');
    const monstName = addElement('input', 'placeholder', 'name...');
    const monstAge = addElement('input', 'placeholder', 'age...');
    const monstDes = addElement('input', 'placeholder', 'description...');
    const monstSub = addElement('input', 'type', 'submit');
    monstSub.setAttribute('value', 'Create');
    createMonster.appendChild(monstName);
    createMonster.appendChild(monstAge);
    createMonster.appendChild(monstDes);
    createMonster.appendChild(monstSub);
    createDiv.appendChild(createMonster);
    createMonster.addEventListener('submit', handleMonsterCreate);
}

function addElement(tag, att1a, att1b, innerText) {
    const element = document.createElement(tag);
    element.setAttribute(att1a, att1b);
    while (innerText) {
        element.innerText = innerText;
    }
    return element;
}

function loadMonsters(data) {
    const monsterList = document.getElementById('monster-container');
    while (monsterList.firstChild) {monsterList.removeChild(monsterList.firstChild);};
    data.forEach(element =>  loadOneMonster(element));
}

function loadOneMonster(element) {
    const monsterList = document.getElementById('monster-container');
    const name = document.createElement('h2');
    const age = document.createElement('b');
    const bio = document.createElement('p');
    const div = document.createElement('div');
    const br = document.createElement('br');
    div.setAttribute('name', element.name);
    div.setAttribute('id', element.id);
    name.innerText = element.name;
    age.innerText = `Age: ${element.age}`;
    bio.innerText = `Bio: ${element.description}`;
    div.appendChild(name);
    div.appendChild(br);
    div.appendChild(age);
    div.appendChild(br);
    div.appendChild(bio);
    monsterList.appendChild(div);
}

function handleMonsterCreate(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('[placeholder="name..."]').value;
    const age = form.querySelector('[placeholder="age..."]').value;
    const bio = form.querySelector('[placeholder="description..."]').value;
    fetch('http://localhost:3000/monsters', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            name: name,
            age: age,
            description: bio
        })
    })
    .then(res => res.json())
    .then(json => loadOneMonster(json))
    .then(json => form.reset())
}