var $ = require("jquery");
var apiURL = "http://localhost:3000";

//duration in seconds
var duration = 45;
var timeleft = duration;

//boolean game is win
var win = false;

//grid size
var columns = 7;
var rows = 4;

//randomize array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

var fruits = [
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
 * @param {number} timeleft
 * @param {number} timetotal
 * @param {number} initalBarWidth
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
  //if the game is in progress
  if (timeleft >= 0) {
    //if not won
    if (!win) {
      setTimeout(() => {
        //decrement one second
        timeleft -= 1;

        //recursive each 1 second
        launchTimer(timeleft, timetotal, initalBarWidth);
      }, 1000);
    } else {
      // if the game is won
      // insert duration in database
      //HTTP request
      //post duration with API url
      $.post(apiURL + "/game", {
        duration: duration - timeleft,
      })
        .done(function (msg) {
          console.log(msg);
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
 * @param {number} columns
 * @param {number} rows
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
  shuffle(fruits);
  //shuffle grid array
  shuffle(boxes);

  //add attribute for each box if not exist
  if (!$(boxes.first()).attr("data-card")) {
    let duplicate = 0;
    let counter = 0;
    boxes.each(function (index, element) {
      //add attribute with the fruit in array
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
 * @param {boolean} afterGame if is after game or not
 */
function showBestScore(afterGame) {
  //launch HTTP get request to API
  $.get(apiURL + "/game/min")
    .done(function (datas) {
      let content = " ";
      let show = false;

      //if is after game show success or fail message
      if (afterGame) {
        if (win) {
          $(".results #win").html("C'EST GAGNE !!! &#128513;");
        } else {
          $(".results #win").html("C'EST PERDU !!! &#128546;");
        }
        show = true;
      }

      if (datas.length > 0) {
        //foreach datas
        $(datas).each(function (index, data) {
          content += "<li>" + data + " secondes </li>";
        });

        // add content to results class
        $(".results ul").html(content);
        $("#results-header").css("display", "block");
        show = true;
      }

      if (show) {
        //show results
        $(".results").css("display", "block");
      }
    })
    .fail(function (error) {
      console.error("Error " + error.status + " " + error.statusText);
    });
}
