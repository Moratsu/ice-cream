document.getElementById("ic-form").onsubmit = () => {

    let isValid = true;

    //Clears all errors
    clearErrors();

    //Validates the users name
    let name = document.getElementById("name").value.trim();
    if(name === "") {
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }

    //Validates the users email
    let email = document.getElementById("email").value.trim();
    if(email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    //Validates the users flavor selection
    let flavor = document.getElementById("size").value;
    if(flavor == "Select") {
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }
    
    //Validates the users cone selection
    let methodSelected = false;
    let methodButtons = document.getElementsByName("method");
    for (let i=0; i<methodButtons.length; i++) {
        if(methodButtons[i].checked) {
            methodSelected = true;
        }
    }
    if (!methodSelected) {
        document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    return isValid;
};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}