class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;

    }
}

function user_add(){                //Todo
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
    let urlParams = new URLSearchParams(window.location.search); //Parameter in Url
    let id = urlParams.get('id');
    let user = new User(
        parseInt(id),

        document.getElementById("inputUsername").value,         //value read by ID
        document.getElementById("inputEmail").value,
        document.getElementById("inputPassword").value,

    );
    let http_request = new XMLHttpRequest();
    http_request.open("PUT", "http://127.0.0.1:5000/user/edit/" + id, true);
    http_request.send(JSON.stringify(user));
}


function user_delete(id){          //zeile 94 benutzt

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
     let http_request = new XMLHttpRequest();                               //Schleife läuft solange bis i die anzahl an user erreciht hat
    http_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let user = JSON.parse(this.responseText);
            for(let i=0; i < user.length; i++) {
                let node_tr = document.createElement("tr");         //erstellt tabelle

                let node_td2 = document.createElement("td");           //erstellt spalte
                node_tr.append(node_td2);
                let node_text2 = document.createTextNode(user[i][1]);           //schreibt in die Spalte id
                node_td2.appendChild(node_text2);

                let node_td3 = document.createElement("td");            //Spalte
                node_tr.append(node_td3);
                let node_text3 = document.createTextNode(user[i][2]);           //eckige klammer übergibt die Stelle im JSON file Mail zb
                node_td3.appendChild(node_text3);

                let node_td4 = document.createElement("td");
                node_tr.append(node_td4);
                let node_text4 = document.createTextNode(user[i][3]);
                node_td4.appendChild(node_text4);



                let node_td10 = document.createElement("td");
                node_tr.append(node_td10);
                let node_text10 = document.createElement("BUTTON");         //bearbeitungfile
                node_text10.innerHTML ="Bearbeiten";
                node_text10.setAttribute("onclick", "window.location.href='/useredit?id=" + user[i][0] + "'");      //übergibt userid und ruft funktion auf
                node_td10.appendChild(node_text10);

                let node_td11 = document.createElement("td");
                node_tr.append(node_td11);
                let node_text11 = document.createElement("BUTTON");
                node_text11.innerHTML ="Löschen";
                node_text11.setAttribute("onclick", "user_delete("+ user[i][0]+")");            //delete funktion aufgerufen
                node_td11.appendChild(node_text11);


                document.getElementById("tbody").append(node_tr);
            }
        }
    };
    http_request.open("GET", "http://127.0.0.1:5000/user", true);
    http_request.send();
}
