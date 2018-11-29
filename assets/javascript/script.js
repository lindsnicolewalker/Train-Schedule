
var video = document.getElementById("myVideo");
var btn = document.getElementById("myBtn");

function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
    } else {
        video.pause();
        btn.innerHTML = "Play";
    }
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDVgQdK6FeJvqGYMmUeb2VTqI39i-t2pOk",
    authDomain: "train-scheduler-9cfd1.firebaseapp.com",
    databaseURL: "https://train-scheduler-9cfd1.firebaseio.com",
    projectId: "train-scheduler-9cfd1",
    storageBucket: "train-scheduler-9cfd1.appspot.com",
    messagingSenderId: "804723778025"
};
firebase.initializeApp(config);
//set variable  
var database = firebase.database();
function stringForInt(str) {
    if (parseInt(str)) {
        return true;
    }
    else {
        return false;
    }
}
//click listener for event on click of submit button
$("#submit-button").on("click", function (event) {
    //prevent page from reloading on submit
    event.preventDefault();
    if (stringForInt($("#train-frequency-input").val().trim()) && stringForInt($("#first-train-input").val().trim()) && $("#train-name-input").val().trim() && $("#train-destination-input").val().trim() && $("#train-frequency-input").val().trim() && $("#first-train-input").val().trim()) {
        //var newtrain is an object with attributes of jquery selectors for input data
        var newTrain = {
            name: $("#train-name-input").val().trim(),
            destination: $("#train-destination-input").val().trim(),
            frequency: $("#train-frequency-input").val().trim(),
            firstTrain: $("#first-train-input").val().trim(),
        }
        //using js to push input data into our database as empty strings 
        database.ref().push(newTrain);
        $("#train-name-input").val("");
        $("#train-destination-input").val("");
        $("#train-frequency-input").val("");
        $("#first-train-input").val("");

    }

    else {
        $("#message").html("<h3>Please check input values</h3>").fadeOut(3000);
        // $("#message").empty(); 
    }
})
//on child added, execute function that takes in a snapshot and updates database?
database.ref().on("child_added", function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;
    var minutesUntil;
    var nextArrival;
    //  sending time back a year
    var trainStartConverted = moment(firstTrain, "hh:mm");
    //  calculate the diff between train start time and the current time 
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    // calculate the time apart
    var timeApart = diffTime % frequency;
    // minutes until the next train
    var minutesUntil = frequency - timeApart
    // next arrival time
    var nextArrival = moment().add(minutesUntil, "m").format("LT");

    console.log(minutesUntil);
    console.log(nextArrival);
    console.log(snapshot.val());
    // create a button assign it to a variable and put it in table row and add button click function for that button clear class "</td><td>" + $("<button class = 'clear' >") +
    $("#train-info").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesUntil + "</td></tr>");
    // $("#train-info")
})

