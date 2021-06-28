class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;

    }
}

function user_add(){
    let http_request = new XMLHttpRequest();
    let user = new User();


    user.username = document.getElementById("inputUsername").value;
    user.email = document.getElementById("inputEmail").value;
    user.password = document.getElementById("inputPasswort").value;


     http_request.open("POST", "http://127.0.0.1:5000/user/add", true);
     console.log(user)
     http_request.send(JSON.stringify(user));
}


function user_edit() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let user = new User(
        parseInt(id),

        document.getElementById("inputUsername").value,
        document.getElementById("inputEmail").value,
        document.getElementById("inputPassword").value,

    );
    let http_request = new XMLHttpRequest();
    http_request.open("PUT", "http://127.0.0.1:5000/user/edit/" + id, true);
    http_request.send(JSON.stringify(user));
}


function user_delete(id){

    let http_request = new XMLHttpRequest();
    http_request.open("DELETE", "http://127.0.0.1:5000/user/delete/" + id, true);
    http_request.send();
    http_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loaduser();
        }
    }
}



function loaduser(){
     let http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let user = JSON.parse(this.responseText);
            for(let i=0; i < user.length; i++) {
                let node_tr = document.createElement("tr");

                let node_td2 = document.createElement("td");
                node_tr.append(node_td2);
                let node_text2 = document.createTextNode(user[i][1]);
                node_td2.appendChild(node_text2);

                let node_td3 = document.createElement("td");
                node_tr.append(node_td3);
                let node_text3 = document.createTextNode(user[i][2]);
                node_td3.appendChild(node_text3);

                let node_td4 = document.createElement("td");
                node_tr.append(node_td4);
                let node_text4 = document.createTextNode(user[i][3]);
                node_td4.appendChild(node_text4);



                let node_td10 = document.createElement("td");
                node_tr.append(node_td10);
                let node_text10 = document.createElement("BUTTON");
                node_text10.innerHTML ="Bearbeiten";
                node_text10.setAttribute("onclick", "window.location.href='/useredit?id=" + user[i][0] + "'");
                node_td10.appendChild(node_text10);

                let node_td11 = document.createElement("td");
                node_tr.append(node_td11);
                let node_text11 = document.createElement("BUTTON");
                node_text11.innerHTML ="Löschen";
                node_text11.setAttribute("onclick", "user_delete("+ user[i][0]+")");
                node_td11.appendChild(node_text11);


                document.getElementById("tbody").append(node_tr);
            }
        }
    };
    http_request.open("GET", "http://127.0.0.1:5000/user", true);
    http_request.send();
}
