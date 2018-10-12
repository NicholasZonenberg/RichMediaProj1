var index = 3;
//function to handle our xhr response
const handleResponse = (xhr) => {
    //grab the content section
    const content = document.querySelector("#content");
    
    ///parse the response text into a JSON object
    const obj = JSON.parse(xhr.response);
    
    //check the xhr status code and handle accordingly
    switch(xhr.status) {
    case 200: //success
        //displays the data from the entry
        content.innerHTML = '<p id="Name"></p><p id="Adress"></p><p id="phone"></p>';
        document.getElementById('Name').innerHTML=obj.name;
        document.getElementById('Adress').innerHTML=obj.address;
        document.getElementById('phone').innerHTML=obj.phoneNumber
        break;
    case 400: //bad request 
        content.innerHTML = `<b>Bad Request</b>`;
        break;
    case 404: //not found (requested resource does not exist)
        content.innerHTML = `<b>Resource Not Found</b>`;
        break;
    default: //default other errors we are not handling in this example
        content.innerHTML = `Error code not implemented by client.`;
        break;
    }
};

//function to send ajax
const sendAjax = (url) => {
    //create a new xhr (ajax) request. 
    //Remember that these are ASYNCHRONOUS
    const xhr = new XMLHttpRequest();
    //set the xhr to a GET request to a certain URL
    xhr.open('GET', url);
    //Set the accept headers to the desired response mime type
    //Server does NOT have to support this. It is a gentle request.
    xhr.setRequestHeader ("Accept", 'application/json');

    //When the xhr loads, call handleResponse and pass the xhr object
    xhr.onload = () => handleResponse(xhr);

    //send our ajax request to the server
    xhr.send();
};

// submits the form without leaving the page
function SubForm (){
    console.log('submitted')
    $.ajax({
        url:'/addInfo',
        type:'post',
        data:$('#nameForm').serialize(),
        statusCode:{
        201: function(){
            // gets an independent variable
            var tempInt=0;
            for (var x = 0; x <= index; x++){
            tempInt=x;
            }
            // creates the button that will be used to access this entry
            var button = document.createElement("button");
            button.innerHTML=document.getElementById('nameField').value;
            button.setAttribute("id", 'info'+tempInt);
            const tempFunc = () => sendAjax('/getinfo?index='+tempInt);
            document.getElementById("top").appendChild(button);
            const tempQuery = document.querySelector('#info'+tempInt);
            tempQuery.addEventListener('click', tempFunc);
            index++;
        }
        }
    });
}


//initialization function
const init = () => {
    // makes the three initial entries
    const successButton = document.querySelector("#info0");
    const badRequestButton = document.querySelector("#info1");
    const notFoundButton = document.querySelector("#info2");
    // sets up the submit button
    const submitButton = document.querySelector("#submit");
    
    //functions to call sendAjax for us with the correct parameters
    const success = () => sendAjax('/getinfo?index=0');
    const badRequest = () => sendAjax('/getinfo?index=1');
    const notFound = () => sendAjax('/getinfo?index=2');
    
    //attach the correct functions to the correct events
    successButton.addEventListener('click', success);
    badRequestButton.addEventListener('click', badRequest);
    notFoundButton.addEventListener('click', notFound);
    submitButton.addEventListener('click',SubForm);
};

window.onload = init;
