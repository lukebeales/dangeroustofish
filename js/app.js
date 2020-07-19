var splash;

var globalFont = "Bubblegum";
var globalStage;
var globalWidth = 480;
var globalHeight = 800;
var globalWaterDepth = globalHeight / 2;
var globalWaveHeight = 40;

var sky, water, wave, fish, clock, clockOutline, health, healthOutline, text, textOutline;

var fishCircle = { x: 0, y: 0, r: 0, s: 0 };
var fishMultiply = 1; // for when it jumps out of the water
var fishOutOfWater = true;
var fishAir = 100;
var fishWater = 100;

var stages = new Array("splash", "help1", "help2", "play", "dead");
var stage = 0;

var score = 0;

var waveOffset = 0;

var waterOffset = 0;

var healthOffset = 0;

var bubbles = [
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 },
	{ x: -20, y: -20, v: false, type: '', obj: '', size: 0 }
];

var obstacles = [
	{ x: -20, y: -20, v: false, s: false, type: 'float', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'float', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'fly', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'fly', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'fly', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'swim', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'swim', obj: ''},
	{ x: -20, y: -20, v: false, s: false, type: 'swim', obj: ''}
];
var obstacleStep = 0;

var health = [
	{ x: 0, y: 0, obj: '' },
	{ x: 0, y: 0, obj: '' },
	{ x: 0, y: 0, obj: '' },
	{ x: 0, y: 0, obj: '' },
	{ x: 0, y: 0, obj: '' }
];

// #####################################################################


function NoClickDelay(el) {
	this.element = el;
	if( window.Touch ) this.element.addEventListener('touchstart', this, false);
}

NoClickDelay.prototype = {

	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
		}
	},

	onTouchStart: function(e) {
		e.preventDefault();
		// this.moved = false;

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
	},

	onTouchMove: function(e) {
		// this.moved = true;
	},

	onTouchEnd: function(e) {
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);

		// if( !this.moved ) {
			// Place your code here or use the click simulation below
			var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
			if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;

			var theEvent = document.createEvent('MouseEvents');
			theEvent.initEvent('click', true, true);
			theTarget.dispatchEvent(theEvent);
		// }
	}
};


// #####################################################################
// ALL THE INIT FUNCTIONS
// #####################################################################


	function init() {

		//initialize the canvas
		var canvas = document.createElement("canvas");
		canvas.setAttribute("screencanvas", "1"); //performance improvement hint in cocoonjs
		canvas.setAttribute("id", "globalCanvas");
		canvas.setAttribute("width", "480");
		canvas.setAttribute("height", "800");
//		canvas.setAttribute("width", "240");
//		canvas.setAttribute("height", "400");
		// canvas.width  = window.innerWidth;
		// canvas.height = window.innerHeight;
		var ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = true;
		ctx.webkitImageSmoothingEnabled = true;
		// ctx.imageSmoothingEnabled = false;
		// ctx.webkitImageSmoothingEnabled = false;
		document.body.appendChild(canvas);

		new NoClickDelay(document.body);

		splash = document.getElementById("globalCanvas");
		splash.addEventListener("click", handleClick, false);

		globalStage = new createjs.Stage("globalCanvas");

		skyInit();
		waveInit();
		waterInit();
		textInit();
		bubbleInit();
		fishInit();

		// start the timer
		createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", tick);

		// refresh stage
		// globalStage.update();

	}


	function skyInit() {
		// create sky
		sky = new createjs.Shape();
		sky.graphics.beginLinearGradientFill(["#7dcdff","#afe2ff"], [0, 1], 0, 0, 0, globalHeight).rect(0, 0, globalWidth, globalHeight).endFill();
		globalStage.addChild(sky);
	}


	function waveInit() {
		// create wave
		wave = new createjs.Shape();
		wave.x = 0;
		wave.y = 0;
		wave.graphics.moveTo(0, globalHeight - globalWaterDepth);
		wave.graphics.bezierCurveTo(160, globalHeight - globalWaterDepth - 50, 320, globalHeight - globalWaterDepth + 50, globalWidth, globalWaterDepth);
		wave.graphics.lineTo(globalWidth, globalHeight).lineTo(0, globalHeight).lineTo(0, globalWaterDepth);
		globalStage.addChild(wave);
	}


	function waterInit() {
		// draw the bulk of the water
		water = new createjs.Shape();
		// water.graphics.beginLinearGradientFill(["#0095f4","#000653"], [0, 1], 0, globalHeight - globalWaterDepth - 50, 0, globalHeight).rect(0, globalHeight - globalWaterDepth - 50, globalWidth, globalHeight).endFill();
		globalStage.addChild(water);
		water.mask = wave;

	}

	function textInit() {
		textOutline = new createjs.Text('', "normal 72px '" + globalFont + "'", "#FFFFFF");
		textOutline.x = globalWidth / 2;
		textOutline.y = 120;
		textOutline.outline = 6;
		textOutline.textAlign = "center";
		globalStage.addChild(textOutline);

		text = new createjs.Text('', "normal 72px '" + globalFont + "'", "#000000");
		text.x = globalWidth / 2;
		text.y = 120;
		text.textAlign = "center";
		globalStage.addChild(text);
	}
	
	function bubbleInit() {
		var i;
		var ilen;
		for ( i = 0, ilen = bubbles.length; i < ilen; i++ ) {

			// draw a circle to represent the fish for now
			bubbles[i]["size"] = Math.round(Math.random()*8);

			bubbles[i]["obj"] = new createjs.Shape();
			bubbles[i]["obj"].graphics.setStrokeStyle(2,"round").beginStroke("#FFFFFF").drawCircle(0, 0, bubbles[i]["size"]);
			bubbles[i]["obj"].x = -50;
			bubbles[i]["obj"].y = -50;
			bubbles[i]["obj"].alpha = 0.75;

			globalStage.addChild(bubbles[i]["obj"]);
	
		}
	}

	
	function fishInit() {
		fishCircle["x"] = globalWidth / 3;
		fishCircle["y"] = -100;
		fishCircle["r"] = globalHeight - (globalWaterDepth / 2);
		fishCircle["s"] = 75;

		fish = new createjs.Bitmap("img/mullet.png");
		fish.x = fishCircle["x"];
		fish.y = fishCircle["y"];
		fish.regX = 60;
		fish.regY = 42;
		fish.rotation = 0;

		globalStage.addChild(fish);
	}

	
	function obstacleInit() {
		var i;
		for ( i = 0; i < obstacles.length; i++ ) {

			if ( obstacles[i]["type"] == 'swim' ) {
				obstacles[i]["obj"] = new createjs.Bitmap("img/shark.png");
				obstacles[i]["obj"].rotation = 0;
				obstacles[i]["obj"].regX = 60;
				obstacles[i]["obj"].regY = 60;
			} else if ( obstacles[i]["type"] == 'float' ) {
				obstacles[i]["obj"] = new createjs.Bitmap("img/duck.png");
				obstacles[i]["obj"].rotation = 0;
				obstacles[i]["obj"].regX = 40;
				obstacles[i]["obj"].regY = 60;
			} else if ( obstacles[i]["type"] == 'fly' ) {
				obstacles[i]["obj"] = new createjs.Bitmap("img/pelican.png");
				obstacles[i]["obj"].rotation = 0;
				obstacles[i]["obj"].regX = 40;
				obstacles[i]["obj"].regY = 30;
			}

			obstacles[i]["obj"].x = 0 - globalWidth;
			obstacles[i]["obj"].y = 0;
			// obstacles[i]["obj"].alpha = 1;

			globalStage.addChild(obstacles[i]["obj"]);
	
		}
	}

	
	function healthInit() {
		var i;
		for ( i = 0; i < 5; i++ ) {
			health[i]["obj"] = new createjs.Bitmap("img/heart.png");
			health[i]["x"] = 120 + (i * 50);
			health[i]["y"] = 32;
			health[i]["v"] = true;
			health[i]["obj"].x = health[i]["x"];
			health[i]["obj"].y = health[i]["y"];

			globalStage.addChild(health[i]["obj"]);
		}
	}

// #####################################################################
// ADVERTISING FUNCTIONS
// #####################################################################

/*
	Cocoon.Ad.banner.on("ready" , function(){
		if ( stages[stage] != 'dead' ) {
			adHide();
		} else {
			Cocoon.Ad.setBannerLayout(Cocoon.Ad.BannerLayout.TOP_CENTER);
			Cocoon.Ad.showBanner();
		}
	});
*/

	function adShow() {
		console.log("show ad");
//		Cocoon.Ad.loadBanner();
	}
	
	function adHide() {
		console.log("hide ad");
//		Cocoon.Ad.hideBanner();
	}

// #####################################################################
// GLOBAL FUNCTIONS
// #####################################################################

	function tick(event) {

		skyUpdate();
		waterUpdate();
		waveUpdate();
		bubbleUpdate();
		textUpdate();

		if ( stages[stage] != 'splash' ) {
			obstacleUpdate();
			fishUpdate();
			healthUpdate();
		}

		// refresh stage
		globalStage.update();
	}

	// given an x, it returns the depth of the water at that point
	function waterDepth(x) {

		return globalWaterDepth + Math.round(
			Math.sin(
				(
					(
						(2 * Math.PI) 
						/ globalWidth
					) * x
				) +
				(
					(
						(2 * Math.PI) / 100
					) * waveOffset
				)
			) * (globalWaveHeight / 2)
		);

	}


	// given an x, it returns the angle of the water at that point by averaging it over width
	function waterAngle(x, width) {

		return (360 / (Math.PI * 2)) * Math.atan2(waterDepth(x + (width/2)) - waterDepth(x - (width/2)), width) + Math.PI;

	}

	
	function waterUpdate() {
		waterOffset++;
		if ( waterOffset >= 1000 ) {
			waterOffset = 0;
		}

		var fishHealth = -100 + fishAir + fishWater;


		var r = Math.round((255 / 100) * ( 100 - fishHealth ));
		if ( r < 0 ) { r = 0; } else if ( r > 255 ) { r = 255; }
		var g = Math.round((200 / 100) * fishHealth);
		if ( g < 0 ) { g = 0; } else if ( g > 200 ) { g = 200; }
		var b = Math.round((255 / 100) * fishHealth);
		if ( b < 0 ) { b = 0; } else if ( b > 255 ) { b = 255; }

		water.graphics.clear();
		water.graphics.beginLinearGradientFill([rgbToHex(r, g, b), rgbToHex(Math.round(r/5), Math.round(g/5), Math.round(b/5))], [0, 1], 0, globalHeight - globalWaterDepth - 50, 0, globalHeight).rect(0, globalHeight - globalWaterDepth - 50, globalWidth, globalHeight).endFill();

	}


	function waveUpdate() {
		// move wave around here
		waveOffset += 1;
		if ( waveOffset >= 100 ) {
			waveOffset = 0;
		}
		wave.graphics.clear();
		wave.graphics.moveTo(0, globalHeight);	// start at the bottom left
		wave.graphics.setStrokeStyle(8, "round", "round").beginStroke("#FFFFFF");

		// draw the wave top
		var x;
		for ( x = 0; x <= 20; x++ ) {
			wave.graphics.lineTo((globalWidth / 20) * x, globalHeight - waterDepth((globalWidth / 20) * x));
		}
		wave.graphics.lineTo(globalWidth, globalHeight).lineTo(0, globalHeight);
	}

	
	function skyUpdate() {
		// move clouds and sun/moon around here
	}



	function textUpdate() {
		if ( stages[stage] == 'splash' ) {
			textOutline.text = 'DaNGeRouS\nTo\nFiSH!';
			text.text = 'DaNGeRouS\nTo\nFiSH!';
		} else if ( stages[stage] == 'help1' ) {
			textOutline.text = 'tap to swim,\njump and\navoid obstacles!';
			text.text = 'tap to swim,\njump and\navoid obstacles!';
		} else if ( stages[stage] == 'help2' ) {
			textOutline.text = 'swap between\nair and water\nto survive!';
			text.text = 'swap between\nair and water\nto survive!';
		} else if ( stages[stage] == 'play' ) {
			if ( ( -100 + fishAir + fishWater ) < 50 ) {
				textOutline.text = 'hurry!\n' + score;
				text.text = 'hurry!\n' + score;
			} else {
				textOutline.text = '\n' + score;
				text.text = '\n' + score;
			}
		} else {
			textOutline.text = 'oh no!\n' + score + '\ntap to try again!';
			text.text = 'oh no!\n' + score + '\ntap to try again!';
		}
	}

	
	function bubbleUpdate() {
		// if we choose to do a bubble
		if ( ( Math.random()*100 ) > 85 ) {
			var i;
			var ilen;
			for ( i = 0, ilen = bubbles.length; i < ilen; i++ ) {
				if ( bubbles[i]["v"] === false ) {
					if ( ( stages[stage] != "splash" ) && ( stages[stage] != "dead" ) && ( Math.random()*100 > 50 ) && ( fishOutOfWater === false ) ) {
						soundPlay('bubble' + (Math.floor(Math.random()*2) + 1));

						bubbles[i]["type"] = 'fish';
						bubbles[i]["x"] = fish.x + 50;
						bubbles[i]["y"] = fish.y;
					} else {
						bubbles[i]["type"] = 'ocean';
						bubbles[i]["x"] = globalWidth + 20;
						bubbles[i]["y"] = globalHeight - (Math.random() * (globalWaterDepth - globalWaveHeight));
					}
					bubbles[i]["v"] = true;
					break;
				}
			}
		}


		var i;
		var ilen;
		for ( i = 0, ilen = bubbles.length; i < ilen; i++ ) {
			if ( bubbles[i]["v"] !== false ) {

				if ( bubbles[i]["type"] == "fish" ) {
					bubbles[i]["y"] -= 6;
					bubbles[i]["x"] -= 6;
				} else {
					bubbles[i]["x"] -= (3 + (bubbles[i]["size"] / 2));
				}

				if ( bubbles[i]["x"] <= -20 ) {
					bubbles[i]["x"] = -50;
					bubbles[i]["y"] = -50;
					bubbles[i]["v"] = false;
				} else if ( bubbles[i]["y"] <= globalHeight - waterDepth(bubbles[i]["x"]) ) {
					// pop bubble here
					// soundPlay('pop');
					bubbles[i]["x"] = -50;
					bubbles[i]["y"] = -50;
					bubbles[i]["v"] = false;
				}


				if ( bubbles[i]["type"] == "fish" ) {
					bubbles[i]["obj"].x = bubbles[i]["x"] + ( Math.sin(bubbles[i]["y"] / 10) * 4 );
					bubbles[i]["obj"].y = bubbles[i]["y"];
				} else {
					bubbles[i]["obj"].x = bubbles[i]["x"]
					bubbles[i]["obj"].y = bubbles[i]["y"] + ( Math.sin(bubbles[i]["x"] / 20) * 2 );
				}
			}
		}
	}
	

	function obstacleUpdate() {

		obstacleStep++;
		if ( obstacleStep >= 20 + (Math.random() * 5) ) {
			obstacleStep = 0;
		}

		// if we choose to do an obstacle (while in play mode)
		if ( ( stages[stage] == "play" ) && ( obstacleStep == 0 ) ) {
			var i;
			var j = 0;
			while ( j < 100 ) {
				i = Math.round(Math.random()*obstacles.length);
				if ( obstacles[i]["v"] === false ) {
					if ( obstacles[i]["type"] == "swim" ) {
						obstacles[i]["y"] = globalHeight - Math.round(Math.random() * ((globalWaterDepth * 0.9) - (globalWaveHeight / 2)));
					} else if ( obstacles[i]["type"] == "fly" ) {
						obstacles[i]["y"] = Math.round(Math.random() * ((globalHeight - globalWaterDepth - ( globalWaveHeight / 2 )) * 0.8));
					}
					obstacles[i]["x"] = globalWidth + 50;
					obstacles[i]["v"] = true;
					obstacles[i]["s"] = false;

					break;
				} else {
					j++;
				}
			}
		}

		var hit = false;
		var i;
		var ilen;
		for ( i = 0, ilen = obstacles.length; i < ilen; i++ ) {
			if ( obstacles[i]["v"] !== false ) {

				if ( obstacles[i]["type"] == "fly" ) {
					obstacles[i]["x"] -= 6;
				} else if ( obstacles[i]["type"] == "swim" ) {
					obstacles[i]["x"] -= 10;
				} else {
					obstacles[i]["x"] -= 8;
				}

				if ( obstacles[i]["x"] <= -150 ) {
					obstacles[i]["x"] = 0 - globalWidth;
					obstacles[i]["y"] = 0;
					obstacles[i]["v"] = false;
				}

				obstacles[i]["obj"].x = obstacles[i]["x"];

				if ( obstacles[i]["type"] == "fly" ) {
					obstacles[i]["obj"].y = obstacles[i]["y"] + ( Math.sin(obstacles[i]["x"] / 60) * 10 );
				} else if ( obstacles[i]["type"] == "float" ) {
					obstacles[i]["y"] = globalHeight - waterDepth(obstacles[i]["x"]);
					obstacles[i]["obj"].y = obstacles[i]["y"] + ( Math.sin(obstacles[i]["x"] / 40) * 15 );
				} else {
					obstacles[i]["obj"].y = obstacles[i]["y"] + ( Math.sin(obstacles[i]["x"] / 60) * 10 );
				}

				// check if we have hit something
				if ( ( stages[stage] == "play" ) && ( fish.x > obstacles[i]["obj"].x - 40 ) && ( fish.x < obstacles[i]["obj"].x + 40 ) && ( fish.y > obstacles[i]["obj"].y - 30 ) && ( fish.y < obstacles[i]["obj"].y + 30 ) ) {
					hit = true;
					break;
				}

			}
		}

		if ( hit === true ) {
			fishDead();
		} else {
			if ( stages[stage] == 'play' ) {
				var i;
				var ilen;
				for ( i = 0, ilen = obstacles.length; i < ilen; i++ ) {
					if ( ( obstacles[i]["v"] !== false ) && ( obstacles[i]["s"] === false ) && ( obstacles[i]["x"] < fishCircle["x"] ) ) {
						obstacles[i]["s"] = true;
						soundPlay('coin');
						score++;
					}
				}
			}
		}

	}



	function healthUpdate() {
			healthOffset++;
			if ( healthOffset >= 100 ) {
				healthOffset = 0;
			}

			if ( -100 + fishAir + fishWater <= 0 ) {
				var i;
				for ( i = 0; i < 5; i++ ) {
					health[i]["obj"].alpha = 0;
				}			

				if ( stages[stage] == "play" ) {
					fishDead();
				}
			} else {
				var i;
				for ( i = 0; i < 5; i++ ) {
					if ( ( stages[stage] != 'play' ) || ( ( ( -100 + fishAir + fishWater ) < 50 ) && ( Math.round(healthOffset / 5) % 2 == 0 ) ) ) {
						health[i]["obj"].alpha = 0;
					} else {
						if ( ( -100 + fishAir + fishWater ) >= (i + 1) * 20 ) {
							health[i]["obj"].alpha = 1;
						} else if ( ( -100 + fishAir + fishWater ) > i * 20 ) {
							health[i]["obj"].alpha = (1 / 20) * (( -100 + fishAir + fishWater ) - (i * 20));
						} else {
							health[i]["obj"].alpha = 0;
						}
					}
					health[i]["obj"].y = health[i]["y"] + ( Math.sin(((Math.PI * 2) / 100) * ( healthOffset + (i * 20) )) * 5 );
				}
			}
	}

	
	function fishUpdate() {

		if ( stages[stage] != "dead" ) {

			// check if we are above the water
			if ( fish.y < ( globalHeight - waterDepth(fishCircle["x"]) ) ) {
				if ( fishOutOfWater === false ) {
					// we're jumping out
					soundPlay('splash2');
				}

				fishOutOfWater = true;
				fishMultiply = 2;
				// fishCircle["s"] -= 3;
			} else {
				if ( fishOutOfWater === true ) {
					// we're landing
					soundPlay('splash');
				}

				fishOutOfWater = false;
				fishMultiply = 1;
				// fishCircle["s"] -= 3;
			}
		} else {
			fishMultiply = 1;
		}

		if ( stages[stage] != "dead" ) {

			if ( stages[stage] == "play" ) {

				if ( fishOutOfWater === true ) {

					fishWater -= 0.5;

					if ( fishWater <= 0 ) {
						// fish is dead :(
						fishWater = 0;
					}

					if ( fishAir < 100 ) {
						fishAir += 2;
					} else {
						fishAir = 100;
					}

				} else {

					// take some air off
					fishAir -= 0.5;

					if ( fishAir <= 0 ) {
						// fish is dead :(
						fishAir = 0;
					}

					if ( fishWater < 100 ) {
						fishWater += 2;
					} else {
						fishWater = 100;
					}
				}

			}


			// the 19 thing is to prevent a bug where 20 may never be hit and therefore the fish will jump on its own
			if ( ( fishOutOfWater === true ) || ( fishCircle["s"] == 19 ) ) {
				fishCircle["s"] += 1;
			} else {
				fishCircle["s"] += 2;
			}

			if ( fishCircle["s"] >= 80 ) {
				fishCircle["s"] = 0;
			} else if ( fishCircle["s"] == "20" ) {
				fishMultiply = 1;
			}

			if ( fishOutOfWater === false ) {
				var h = waterDepth(fishCircle["x"]);
				var i = 1;
				var j = false;
				while ( j === false ) {

					// when fish is at the bottom of the sin curve
					if ( fishCircle["s"] == 20 ) {
						if ( i > 250 ) {
							fishCircle["r"] = Math.round(Math.random()*25);
						} else {
							fishCircle["r"] = Math.round(Math.random()*40) + 10;
						}
						fishCircle["y"] = fish.y - fishCircle["r"];
					// when fish is at the top of the sin curve
					} else if ( fishCircle["s"] == 60 ) {
						if ( i > 250 ) {
							fishCircle["r"] = Math.round(Math.random()*25);
						} else {
							fishCircle["r"] = Math.round(Math.random()*50) + 10;
						}
						fishCircle["y"] = fish.y + fishCircle["r"];
					}

					if (
						(
							( fishCircle["y"] - fishCircle["r"] > ( globalHeight - (h + (globalWaveHeight / 2))) ) &&
							( fishCircle["y"] + fishCircle["r"] < globalHeight )
						) ||
						( i > 500 )
					) {
						j = true;
					} else {
						i++;
					}

				}

			}

		} else {
			if ( ( fishCircle["s"] <= 20 ) || ( fishCircle["s"] >= 60 ) ) {
				fishCircle["s"] += 1;
				if ( fishCircle["s"] >= 80 ) {
					fishCircle["s"] = 0;
				}
			}
		}

		fish.y = fishCircle["y"] + Math.round(Math.sin(((Math.PI * 2) / 80) * fishCircle["s"]) * (fishCircle["r"] * fishMultiply));
		fish.rotation = Math.round((Math.sin(((Math.PI * 2) / 80) * fishCircle["s"] + 20) * 30) / 5) * 3;

	}


	// initiate a fishJump
	function fishJump() {
		// only work if the fish is in the water
		if ( ( stages[stage] == "play" ) && ( fishOutOfWater == false ) ) {
			soundPlay('swim');
			fishCircle["s"] = 40;
			fishCircle["r"] = 150;
			fishCircle["y"] = fish.y;
		}
	}


	function fishDead() {
		fishAir = 0;
		fishWater = 0;
		fishCircle["r"] = globalHeight - fish.y;
		fishCircle["s"] = 60;
		fishCircle["y"] = globalHeight;

		soundPlay('gameover');
		stageChange();
	}
	
	function soundPlay(snd) {
		createjs.Sound.play(snd);
	}

	
	function stageChange() {

		// move to the next stage
		if ( stages[stage] == "dead" ) {

			// check for any ongoing obstacles
			var hit = false;
			for ( i = 0; i < obstacles.length; i++ ) {
				if ( obstacles[i]["v"] !== false ) {
					hit = true;
					break;
				}
			}

			// only let dead fish play again if the obstacles have cleared
			if ( hit === false ) {
				fishAir = 100;
				fishWater = 100;

				// make fish drop from the top
				fishCircle["s"] = 75;
				fishCircle["y"] = 0;
				fishCircle["r"] = globalHeight - (globalWaterDepth / 2);

				fish.y = -1000;
				fishOutOfWater = false;

				// start the game stage
				stage = 3;
				score = 0;
				obstacleStep = 0;

				adHide();

			}

		} else {
			stage++;
			if ( stages[stage] == "dead" ) {
				adShow();
			} else {
				adHide();
			}
		}

		// unneeded as it does this during the 'tick' event?
		// textUpdate();

	}


	
	function rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}


	function handleClick(event) {
		splash.removeEventListener("click", handleClick, false);
		var myApp = new myNameSpace.MyApp();
	}

// #####################################################################
// ALL THE OTHER FUNCTIONS
// #####################################################################

this.myNameSpace = this.myNameSpace || {};
(function() {
	function MyApp() {
	    this.init();
	}

	MyApp.prototype = {

		displayMessage:null,

		// initialise the whole game
		init: function() {

			soundInit();
			obstacleInit();
			healthInit();

			document.getElementById("globalCanvas").addEventListener("click", function(evt) {
				if ( stages[stage] == "play" ) {
					fishJump();
				} else {
					stageChange();
				}
				evt.preventDefault();
			}, false);

			stageChange();

		}

	}


	function soundInit() {
		if (!createjs.Sound.initializeDefaultPlugins()) {return;}
		 
		var audioPath = "snd/";
		var manifest = [
		    {id:"bubble1", src:"bubble.ogg"},
		    {id:"bubble2", src:"bubble2.ogg"},
		    {id:"splash", src:"splash.ogg"},
		    {id:"splash2", src:"splash2.ogg"},
		    {id:"gameover", src:"gameover.ogg"},
		    {id:"coin", src:"coin.ogg"},
		    {id:"swim", src:"swim.ogg"}
		];
	 
		createjs.Sound.alternateExtensions = ["mp3"];
		// createjs.Sound.addEventListener("fileload", handleLoad);
		createjs.Sound.registerSounds(manifest, audioPath);
	}


	myNameSpace.MyApp = MyApp;
}());

init();
