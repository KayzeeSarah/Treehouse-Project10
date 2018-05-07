// variables

var main = document.querySelector("main");
var overlay = document.querySelector(".overlay");
var employeesArray = [];
var employeesLimit = 12;
var container = document.querySelector(".employees-container");
var detailModalWindow = document.querySelector(".detail-modal-window");
var leftArrow = document.querySelector(".left-arrow");
var rightArrow = document.querySelector(".right-arrow");
var mainContainer = document.querySelector(".main-container");
var search = document.querySelector("#search");

// Ajax
// request
var randomEmployees = new XMLHttpRequest();
randomEmployees.onreadystatechange = function () {
  if(randomEmployees.readyState === 4) {
    var response = JSON.parse(randomEmployees.responseText); //parsing response
    var employeesObject = response.results;
          console.log(employeesObject); // place data in console
    for (let i=0; i<employeesObject.length; i+=1) {

      //place required data in an object
      var obj = {};
      obj.picture = employeesObject[i].picture.large;
      obj.name    = employeesObject[i].name.first + " " + employeesObject[i].name.last;
      obj.email   = employeesObject[i].email;
      obj.city    = employeesObject[i].location.city;
      obj.phone   = employeesObject[i].phone;
      obj.address = employeesObject[i].location.street + ", ";
      obj.address+= employeesObject[i].location.state + ", ";
      obj.address+= employeesObject[i].location.postcode;
      obj.birthday = employeesObject[i].dob.substr(0,10);

      //push objects inside array
      employeesArray.push(obj);
    } //for ends
    employeesDisplay();
  } //if ends

} //function ends

randomEmployees.open("GET","https://randomuser.me/api/?nat=gb&results="+employeesLimit);
randomEmployees.send();

function employeesDisplay () {

  for(i=0; i<employeesLimit; i+=1){
    var number = document.createElement('div');
    number.textContent = [i];
    number.classname = "number";

//create main individual employee div
    var individualBox = document.createElement('div');
    individualBox.className = "individualBox";

//create sub-main individual employee div
    var smallBox = document.createElement('div');
    smallBox.className = "smallBox";

    var bigBox = document.createElement('div');
    bigBox.className = "bigBox";


    //create img html
    var picture = document.createElement('img');
    picture.className = "picture";

    //create div for name
    var name = document.createElement('div');
    name.className = "name";
    //create div for email
    var email = document.createElement('div');
    email.className = "email";
    //create div for city
    var city = document.createElement('div');
    city.className = "city";

    //create div for phone
    var phone = document.createElement('div');
    phone.className = "phone";
    //create div for address
    var address = document.createElement('div');
    address.className = "address";
    //create div for birthday
    var birthday = document.createElement('div');
    birthday.className = "birthday";

    //insert data inside created divs
    picture.src = employeesArray[i].picture;
    name.textContent = employeesArray[i].name;
    email.textContent = employeesArray[i].email;
    city.textContent = employeesArray[i].city;
    phone.textContent = employeesArray[i].phone;
    address.textContent = employeesArray[i].address;
    birthday.textContent = "Birthday: " + employeesArray[i].birthday;

    //append infos to respective divs
    smallBox.appendChild(name);
    smallBox.appendChild(email);
    smallBox.appendChild(city);

    bigBox.appendChild(phone);
    bigBox.appendChild(address);
    bigBox.appendChild(birthday);

    individualBox.appendChild(number);
    number.style.display = "none";
    individualBox.appendChild(picture);
    individualBox.appendChild(smallBox);
    individualBox.appendChild(bigBox);

    container.appendChild(individualBox);

  } //for ends
} //function ends

// function to display overlay to call detail-modal-window
function displayDetailModalWindow (e) {
  var individualBox = document.querySelectorAll('.individualBox');
  //display overlay
  if(e.target.className !== ".main-container") {
      overlay.style.display = "block";
  }
  //insert data to detail-modal-window
  if(e.target.className  === "individualBox") {
    detailModalWindow.innerHTML = e.target.innerHTML;
  } else if(e.target.parentElement.className === "individualBox") {
    detailModalWindow.innerHTML = e.target.parentElement.innerHTML;
  } else if(e.target.parentElement.parentElement.className === "individualBox") {
    detailModalWindow.innerHTML = e.target.parentElement.parentElement.innerHTML;
  }
}

//function to get nextEmployee data when arrow is clicked
function nextEmployee () {
    var individualBox = document.querySelectorAll('.individualBox');
    var number = document.querySelector(".number");
    var numberInt = number.textContent;
    numberInt = parseInt(numberInt);
    numberInt += 1;
    //check if there's nextEmployee data
    if(numberInt <= employeesLimit - 1) {
      detailModalWindow.innerHTML = individualBox[numberInt].innerHTML;
    }
    if(numberInt == individualBox.length - 1) {
      rightArrow.style.display= "none";
    } else {
      rightArrow.style.display= "block";
      leftArrow.style.display= "block";
    }
}

//function to get previousEmployee data when arrow is clicked
function prevEmployee () {
    var individualBox = document.querySelectorAll('.individualBox');
    var number = document.querySelector(".number");
    var numberInt = number.textContent;
    numberInt = parseInt(numberInt);
    numberInt -= 1;
    //check if there's prevEmployee data
    if( numberInt >= 0) {
      detailModalWindow.innerHTML = individualBox[numberInt].innerHTML;
    }
    if(numberInt == 0) {
      leftArrow.style.display= "none";
    } else {
      rightArrow.style.display= "block";
      leftArrow.style.display= "block";
    }
}

//function to navigate detail-modal-window using left key and right key
function keysNavigation(e) {
  if(overlay.style.display === "block"){
  //if key = left key
   if(e.keyCode == 37) {
     prevEmployee();
   } else if(e.keyCode == 39) {  //if key = right key
     nextEmployee();
   }
  }
}

//function to search for employees
function searchEmployee() {
  var name = document.querySelectorAll(".name");
  var individualBox = document.querySelectorAll(".individualBox");
  for(let i=0; i<name.length; i+=1) {
    if (name[i].textContent.toLowerCase().indexOf(search.value.toLowerCase()) ==-1||
      name[i].textContent.toUpperCase().indexOf(search.value.toUpperCase()) ==-1) {
      individualBox[i].style.display = "none";
    } else if (name[i].textContent.toLowerCase().indexOf(search.value.toLowerCase()) !=-1||
                name[i].textContent.toUpperCase().indexOf(search.value.toUpperCase()) !=-1) {
      individualBox[i].style.display = "flex";
    }
  }
}

//===============================================================
//eventlisteners
//===============================================================

//call searchEmployee when something is inputted into input
search.addEventListener('input',searchEmployee);

//call detailModalWindow function
container.addEventListener('click',displayDetailModalWindow, false);

//event listener to navigate by calling precEmployee function and nextEmployee function
overlay.addEventListener('click',function (e) {
  //call prevEmployee function if left-arrow is clicked
  if(e.target.className === "arrow left-arrow") {
    prevEmployee();
  } else if(e.target.className === "arrow right-arrow") {  //call nextEmployee function if right-arrow is clicked
    nextEmployee();
  } else if(e.target.className === "screen" || e.target.className === "close" ) { //close detail-modal-window if screen or close is clicked
    rightArrow.style.display= "block";
    leftArrow.style.display= "block";
    overlay.style.display = "none";
  }
});

//call keysNavigation function for keyboard navigation
window.addEventListener('keydown',keysNavigation, false);
