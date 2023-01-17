let container = document.getElementById('records_container')

function UpdateRecordView(isFilter = false, body = {}) {
    container.innerHTML = ''
    if (!isFilter) {
        request_easy('/api/records', (data) => {
            data.forEach(record => {
                container.innerHTML += RecordView(record.record_id, record.name, record.author, record.dateChange)
            });
        })

    } else {
        post_request('/api/records/filtred', body, (data) => {
            data.forEach(record => {
                container.innerHTML += RecordView(record.record_id, record.name, record.author, record.dateChange)
            });
        })
    }
}

function RecordView(id, name, author, date) {
    return `
    <div class="record">
    <h1>${name} : <span style="color: rgb(1, 64, 146)">${author}</span></h1>
    <p>${date}</p>
    <button onclick="openRecord('${id}')">Открыть</button>
    </div>
    `
}


function openRecord(id) {
    $('#record_frame').toggleClass('hide', '')
    request_easy('/api/records/' + id, (data) => {
        setRecordDataFullView(data.name, data.author, data.dateChange, data.RecordData)
    })
}

function setRecordDataFullView(name, author, date, content) {
    document.getElementById('rf_name').innerHTML = name
    document.getElementById('rf_author').innerHTML = author
    document.getElementById('rf_date').innerHTML = date
    document.getElementById('rf_content').innerHTML = content
}

function updateByFilters() {
    let search = document.getElementById('search_input').value
    let filter = document.getElementById('status').value
    let body = {}
    if (filter === '') {
        if (search === '') {
            UpdateRecordView()
            return
        }
        body.filter = 'search'
        body.param = search
    } else {
        if (search === '') {
            body.filter = 'sort'
            body.param = filter
        } else {
            body.filter = 'sortsearch'
            body.param = search
            body.arg = filter
        }
    }
    UpdateRecordView(true, body)
}


UpdateRecordView()