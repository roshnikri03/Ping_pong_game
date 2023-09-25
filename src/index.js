import "./styles.css";

var rod1 = document.getElementById("rod-1");
var rod2 = document.getElementById("rod-2");
var ball = document.getElementById("ball");

const rod1Name = "Rod-1";
const rod2Name = "Rod-2";
let rodName;

let highScore;
let ballMoving;
let score = 0;
let gameStart = false;
let moveX = 2;
let moveY = 2;
let border = 12;
let movement = 20;

localStorage.setItem("winner", "null");
localStorage.setItem("highScore", "null");

(function () {
  rodName = localStorage.getItem("winner");
  highScore = localStorage.getItem("highScore");

  if (highScore == "null" || rodName == "null") {
    alert(
      "Hello! Welcome to Pong Game.\nHere you can start the game by pressing Enter.\nTo control the rods use A-D/left-right arrow key."
    );
    highScore = 0;
    rodName = rod2Name;
  } else {
    alert(rodName + " has a maximum score of " + highScore * 10);
  }
  gameReset(rodName);
})();

function gameReset(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = rod1.style.left;
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  if (rodName === rod1Name) {
    ball.style.top =
      rod2.getBoundingClientRect().y -
      rod2.getBoundingClientRect().height +
      "px";
    moveY = -2;
  } else if (rodName === rod2Name) {
    ball.style.top = rod1.getBoundingClientRect().height + "px";
    moveY = 2;
  }
  score = 0;
  gameStart = false;
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 65 || event.keyCode == 37) {
    // left key
    if (parseInt(rod1.style.left) > border) {
      rod1.style.left = parseInt(rod1.style.left) - movement + "px";
      rod2.style.left = rod1.style.left;
    }
  } else if (event.keyCode == 68 || event.keyCode == 39) {
    // right key
    if (
      parseInt(rod1.style.left) <
      window.innerWidth - rod1.offsetWidth - border
    ) {
      rod1.style.left = parseInt(rod1.style.left) + movement + "px";
      rod2.style.left = rod1.style.left;
    }
  } else if (event.keyCode == 13) {
    if (!gameStart) {
      gameStart = true;

      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDiameter = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      ballMoving = setInterval(function () {
        let rod1x = rod1.getBoundingClientRect().x;
        let rod2x = rod2.getBoundingClientRect().x;

        let ballCenter = ballX + ballDiameter / 2;

        ballX += moveX;
        ballY += moveY;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDiameter > window.innerWidth || ballX < 0) {
          moveX = -moveX;
        }

        if (ballY <= rod1Height) {
          moveY = -moveY;
          score++;
          if (ballCenter < rod1x || ballCenter > rod1x + rod1Width) {
            storeData(score, rod2Name);
          }
        }

        if (ballY + ballDiameter >= window.innerHeight - rod2Height) {
          moveY = -moveY;
          score++;
          if (ballCenter < rod2x || ballCenter > rod2x + rod2Width) {
            storeData(score, rod1Name);
          }
        }
      }, 10);
    }
  }
});

function storeData(score, winningRod) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("winner", winningRod);
    localStorage.setItem("highScore", highScore);
  }
  clearInterval(ballMoving);
  gameReset(winningRod);
  alert(
    winningRod +
      " wins with the score of " +
      score * 100 +
      "\nMax Score: " +
      highScore * 100
  );
}
