var $ = require("jquery");
var apiURL = "http://localhost:3000";

//duration in seconds
let duration = 30;

var timeleft = duration;

var win = false;

//grid size
let columns = 7;
let rows = 4;

//randomize array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

let fruits = [
  "apple",
  "banana",
  "orange",
  "lime",
  "pomegranate",
  "apricot",
  "lemon",
  "strawberry",
  "green-apple",
  "peach",
  "grape",
  "watermelon",
  "plum",
  "pear",
  "cherry",
  "raspberry",
  "mango",
  "yellow-cherry",
];

//build grid
buildGrid(columns, rows);

//display best score
showBestScore(false);

//click on start button
$("#start-button").click(() => {
  launchGame();
});

/**
 * To animate progress bar and display timer
 * @param {*} timeleft
 * @param {*} timetotal
 * @param {*} initalBarWidth
 */
function launchTimer(timeleft, timetotal, initalBarWidth) {
  let progressBarWidth = (timeleft * initalBarWidth) / timetotal;
  //change width of progress bar with animation
  //be careful the animation breaks when switching tabs, it's a jquery bug.
  //use this function instead :
  //$("#bar").width(progressBarWidth)
  $("#bar").animate({ width: progressBarWidth }, 900);

  //write the number of seconds
  $("#start-button").html(timeleft + " sec");
  if (timeleft >= 0) {
    //if the game is in progress
    if (!win) {
      setTimeout(() => {
        //decrement one second
        timeleft -= 1;

        //recursive each 1 second
        launchTimer(timeleft, timetotal, initalBarWidth);
      }, 1000);
    } else {
      //HTTP request
      //post duration with API url
      $.post(apiURL + "/game", {
        duration: duration - timeleft,
      })
        .done(function (success) {
          console.log(success);
        })
        .fail(function (error) {
          console.error("Error " + error.status + " " + error.statusText);
        });

      //call finish function
      finish();
    }
  } else {
    //if timer is finish
    finish();
  }
}

/**
 * When the game is finish
 */
function finish() {
  //show results
  showBestScore(true);

  //button start is enabled
  $("#start-button").prop("disabled", false);
  $("#start-button").html("start");
}

/**
 * To manage card behavior
 */
function returnCard() {
  $("td").click((event) => {
    let selectedElement = event.currentTarget;

    //if selected element is not displayed
    if (!$(selectedElement).hasClass("show")) {
      //show card
      $(selectedElement).addClass("show");
      $(selectedElement).addClass("selected");
      let elementsSelected = $(".selected");

      //if two elements are not already compare
      if (elementsSelected.length === 2) {
        //compare two elements
        if (
          $(elementsSelected[0]).attr("data-card") ===
          $(elementsSelected[1]).attr("data-card")
        ) {
          //keep elements displayed
          $(elementsSelected).removeClass("selected");

          let boxes = $("td");
          let showBoxes = $(".show");

          //if boxes are all displayed
          if (boxes.length === showBoxes.length) {
            win = true;
          }
        }
      } else if (elementsSelected.length >= 2) {
        // hide cards
        $(elementsSelected).removeClass("selected");
        $(elementsSelected).removeClass("show");
      }
    }
  });
}

/**
 * To build board game
 * @param {*} columns
 * @param {*} rows
 */
function buildGrid(columns, rows) {
  let grid = "";

  for (var i = 0; i < rows; i++) {
    grid += "<tr>";
    for (var j = 0; j < columns; j++) {
      grid += "<td></td>";
    }
    grid += "</tr>";
  }

  $("table").append(grid);
}

/**
 * To launch game
 */
function launchGame() {
  //hide results
  $(".results").css("display", "none");
  win = false;
  let boxes = $("td");

  //clean all class
  boxes.removeClass();

  //shuffle fruits array
  // shuffle(fruits);
  //shuffle grid array
  //shuffle(boxes);

  //add attribute for each box if not have already
  if (!$(boxes.first()).attr("data-card")) {
    let duplicate = 0;
    let counter = 0;
    boxes.each(function (index, element) {
      //add attribute with the first fruit in array
      $(element).attr("data-card", fruits[counter]);

      //if fruit is display twice
      if (duplicate === 1) {
        duplicate = 0;
        //next fruit index
        counter++;
      } else {
        duplicate++;
      }
    });
  }

  //initialize progress bar size
  $("#bar").width("100%");
  var initalBarWidth = $("#bar").width();

  //start timer
  launchTimer(timeleft, duration, initalBarWidth);

  //game in progress -> disabled start button
  $("#start-button").prop("disabled", true);

  //start game
  returnCard();
}

/**
 * Display best score
 * @param {*} afterGame
 */
function showBestScore(afterGame) {
  //launch HTTP get request to API
  $.get(apiURL + "/game/min")
    .done(function (datas) {
      if (datas.length > 0) {
        let content = " ";

        //if is after game show success or fail message
        if (afterGame) {
          if (win) {
            $(".results #win").html("C'EST GAGNE !!! &#128513;");
          } else {
            $(".results #win").html("C'EST PERDU !!! &#128546;");
          }
        }

        //foreach datas
        $(datas).each(function (index, data) {
          content += "<li>" + data + " secondes </li>";
        });

        // add content to results class
        $(".results ul").html(content);
        //show results
        $(".results").css("display", "block");
      }
    })
    .fail(function (error) {
      console.error("Error " + error.status + " " + error.statusText);
    });
}
