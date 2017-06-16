/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.initializePuzzle();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		document.addEventListener("backbutton", onBackKeyDown, true);
		this.initializePuzzle();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    initializePuzzle:function(){
    	var context = document.getElementById('puzzle').getContext('2d');
var slideSound = document.getElementById("sp");
// var img = new Image();
// img.src = '../img/3x3.jpg';
// img.onload = function() { 
// drawTiles();
// };
//img.addEventListener('load', drawTiles, false);

var img = document.getElementById('myImg');
img.onload = function() { 
drawTiles();
};
var boardSize = document.getElementById('puzzle').width;
var tileCount = 3;

var tileSize = boardSize / tileCount;

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var boardParts = new Object;
setBoard();

// document.getElementById('scale').onchange = function() {
//   tileCount = this.value;
//   tileSize = boardSize / tileCount;
//   setBoard();
//   drawTiles();
// };

document.getElementById('puzzle').onmousemove = function(e) {
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
};

document.getElementById('puzzle').onclick = function() {
console.log('distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) is',distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y));
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if (solved) {
    setTimeout(function() {alert("You solved it!");}, 500);
  }
};

function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = new Object;
      boardParts[i][j].x = i;
      boardParts[i][j].y = j;
    }
  }
  initTiles();
  initEmpty();
  if (!isSolvable(tileCount, tileCount, emptyLoc.y + 1)) {
    if (emptyLoc.y == 0 && emptyLoc.x <= 1) {
      swapTiles(tileCount - 2, tileCount - 1, tileCount - 1, tileCount - 1);
    } else {
      swapTiles(0, 0, 1, 0);
    }
    initEmpty();
  }
  solved = false;
}

function initTiles() {
  var i = tileCount * tileCount - 1;
  while (i > 0) {
    var j = Math.floor(Math.random() * i);
    var xi = i % tileCount;
    var yi = Math.floor(i / tileCount);
    var xj = j % tileCount;
    var yj = Math.floor(j / tileCount);
    swapTiles(xi, yi, xj, yj);
    --i;
  }

}

function swapTiles(i, j, k, l) {
  var temp = new Object();
  temp = boardParts[i][j];
  boardParts[i][j] = boardParts[k][l];
  boardParts[k][l] = temp;
}

function isSolvable(width, height, emptyRow) {
  if (width % 2 == 1) {
    return (sumInversions() % 2 == 0)
  } else {
    return ((sumInversions() + height - emptyRow) % 2 == 0)
  }
}

function sumInversions() {
  var inversions = 0;
  for (var j = 0; j < tileCount; ++j) {
    for (var i = 0; i < tileCount; ++i) {
      inversions += countInversions(i, j);
    }
  }
  return inversions;
}

function countInversions(i, j) {
  var inversions = 0;
  var tileNum = j * tileCount + i;
  var lastTile = tileCount * tileCount;
  var tileValue = boardParts[i][j].y * tileCount + boardParts[i][j].x;
  for (var q = tileNum + 1; q < lastTile; ++q) {
    var k = q % tileCount;
    var l = Math.floor(q / tileCount);

    var compValue = boardParts[k][l].y * tileCount + boardParts[k][l].x;
    if (tileValue > compValue && tileValue != (lastTile - 1)) {
      ++inversions;
    }
  }
  return inversions;
}

function initEmpty() {
  for (var j = 0; j < tileCount; ++j) {
    for (var i = 0; i < tileCount; ++i) {
      if (boardParts[i][j].x == tileCount - 1 && boardParts[i][j].y == tileCount - 1) {
        emptyLoc.x = i;
        emptyLoc.y = j;
      }
    }
  }
}

function drawTiles() {
  context.clearRect ( 0 , 0 , boardSize , boardSize );
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
            i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    slideSound.play();
    checkSolved();
  }
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}
		
    
    }
};
