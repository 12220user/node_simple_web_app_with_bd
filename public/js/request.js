function request_easy(url, callback) {
    let myData;
    fetch(url)
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .then((data) => {
            myData = data;
            callback(data)
        });
}


function post_request(url, postObj, callback) {
    var details = postObj

    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    let myData;
    fetch(url, {
            method: 'post',
            body: formBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .then((data) => {
            myData = data;
            callback(data)
        });
}