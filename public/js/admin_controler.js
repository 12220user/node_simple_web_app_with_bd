let containers = {
    Header: document.getElementById('Method_Text'),
    Name: document.getElementById('Name'),
    Author: document.getElementById('Author'),
    RecordData: RecordDataField,
    Status: document.getElementById('status'),
    Submit: document.getElementById('submit')
}
let makeNew = false

let currentPassword = 'root'
let editedID = undefined
let isTruePassword = false
containers.Submit.addEventListener('click', Submit)
let searchValue = ''

function passwordCheck() {
    let btn = document.getElementById('t_pass')
    let pass = document.getElementById('passField').value
    post_request('/api/passCheck', { pass: pass }, (data) => {
        if (!data.result) {
            btn.style.color = 'red'
            document.getElementById('passField').value = ''
        } else {
            btn.style.color = 'green'
            currentPassword = pass
        }
        isTruePassword = data.result
    })
}

function RecordDataField() {
    return document.getElementById('RecordData')
}

function closeForm() {
    document.getElementById('formcreate_change').style.display = 'none'
}

function OpenNewForm() {
    if (!isTruePassword) {
        alert('Пожалуйста введите верный пароль для создания записей')
        return
    }
    FormClear()
    makeNew = true
    containers.Header.innerHTML = 'Создание записи'
    document.getElementById('formcreate_change').style.display = 'flex'
}

function OpenForm(id) {
    if (!isTruePassword) {
        alert('Пожалуйста введите верный пароль для редактирования записей')
        return
    }
    editedID = id
    FormClear()
    makeNew = false
    request_easy('/api/records/' + id,
        (data) => {
            console.log(data)
            containers.Header.innerHTML = 'Редактирование записи'
            containers.Name.value = data.name
            containers.Author.value = data.author
            containers.RecordData().value = data.RecordData
            containers.Status.value = data.status
            document.getElementById('formcreate_change').style.display = 'flex'
        }
    )
}

function Submit(id = undefined) {
    let postUrl = makeNew ? '/api/records/create' : '/api/records/edit'
    let data = {}
    data.rulePass = currentPassword
    data.name = containers.Name.value
    data.author = containers.Author.value
    data.RecordData = containers.RecordData().value
    data.status = containers.Status.value == 'Редактируется' ? 0 : containers.Status.value == 'Скрыто' ? 1 : 2
    console.log(data)
    if (!makeNew && id != undefined) {
        data.id = editedID
        editedID = undefined
    }
    console.log(data)
    post_request(postUrl, data, (result) => {
        console.log(result)
    })
    closeForm()
    UpdateRecords()
}

function FormClear() {
    containers.Header.innerHTML = ''
    containers.Name.value = ''
    containers.Author.value = ''
    containers.RecordData().value = ''
    containers.Status.value = 'Скрыто'
}

function DeliteRecord(id) {
    if (!isTruePassword) {
        alert('Пожалуйста введите верный пароль для удаления записи')
        return
    }
    if (confirm('Вы действительно хотите удалить запись (ее востановление будет невозможно!!!)')) {
        post_request('/api/records/delite', { rulePass: currentPassword, id: id }, (data) => {
            UpdateRecords()
        })
    }
}

let card_container = document.getElementById('recContainer')

function UpdateRecords() {
    card_container.innerHTML = ''
    if (searchValue == '') {
        request_easy('api/records/all', (r) => {
            if (r.length > 0) {
                r.forEach(data => {
                    card_container.innerHTML += recordCard(data.record_id, data.name, data.author, data.date, data.dateChange, data.status)
                });
            } else {
                card_container.innerHTML = "Записи не найдены"
            }
        })
    } else {
        post_request('/api/records/filtred', { filter: 'search', param: searchValue }, (r) => {
            if (r.length > 0) {
                r.forEach(data => {
                    card_container.innerHTML += recordCard(data.record_id, data.name, data.author, data.date, data.dateChange, data.status)
                });
            } else {
                card_container.innerHTML = "<br><span>Записи не найдены</span>"
            }
        })
    }
}

function recordCard(id, name, author, date, update, status) {
    return `
    <div class="record_container">
                <p>${name}</p>
                <p style="color: rgb(37, 55, 172);">${author}</p>
                <p> ${date}</p>
                <p>${update}</p>
                <p>${status==0? 'Редактируется' : status == 1 ? 'Скрыто' : 'Опубликовано'}</p>
                <button onclick="OpenForm('${id}')">Изменить</button>
                <button onclick="DeliteRecord('${id}')">Удалить</button>
            </div>
    `
}

function updateSearch() {
    searchValue = document.getElementById('serachField').value
    UpdateRecords()
}

UpdateRecords()