function createPlayer(){var t=new GameEntity;return t.addComponent(new cP("pos")),t.addComponent(new cP("move")),t.addComponent(new cSound("move",new Beep(50,5,"sine",.25,1))),t.addComponent(new cTimer("move",150)),t.addComponent(new cLight(new Light(new Pt,.85))),t.addComponent(new cFlag("input",!1)),t.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[0])),t}function createMarker(t,e){void 0===e&&(e=0);var n=new GameEntity;n.addComponent(new cP("pos"));var i=new cSprite(SSM.spriteSheet("marker").sprites[t]);return i.r=e,n.addComponent(i),n}function createSwitch(){var t=new GameEntity;return t.addComponent(new cP("pos")),t.addComponent(new cFlag("state",!1)),t.addComponent(new cSprite(SSM.spriteSheet("guide").sprites[1])),t.addComponent(new cTag("type","switch")),t}function createObject(t){var e=new GameEntity;e.addComponent(new cP("pos")),e.addComponent(new cSprite(SSM.spriteSheet("objects").sprites[t])),e.addComponent(new cSound("collide",new Beep(50,5,"sine",.25,1)));var n=function(t){switch(t){case 0:return"exit";case 1:return"chest";case 2:return"gold";default:return"unknown"}}(t);return e.addComponent(new cTag("type",n)),e}function input(t){var e,n=t.components["p-move"].value;return n.x=n.y=0,Input.KB.isBindDown(Input.KB.META_KEY.UP)&&(n.y-=1,e=!0),Input.KB.isBindDown(Input.KB.META_KEY.DOWN)&&(n.y+=1,e=!0),Input.KB.isBindDown(Input.KB.META_KEY.LEFT)&&(n.x-=1,e=!0),Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)&&(n.x+=1,e=!0),e}function exit(t){}function activate(t){}function spawn(t){}function pickup(t){}function collision(t,e){var n=t.components,i=n["p-pos"].value,s=n["p-move"].value,r=new Pt(s.x,s.y),a=!1;return e.m[i.x+s.x+(i.y+s.y)*e.s.w]&TMASK.W&&!Game.gd.playerAt(new Pt(i.x+s.x,i.y+s.y))||(s.x=s.y=0,a=!0),0!==r.x&&e.m[i.x+r.x+i.y*e.s.w]&TMASK.W&&!Game.gd.playerAt(new Pt(i.x+r.x,i.y))?(s.x=r.x,a=!1):0!==r.y&&e.m[i.x+(i.y+r.y)*e.s.w]&TMASK.W&&!Game.gd.playerAt(new Pt(i.x,i.y+r.y))&&(s.y=r.y,a=!1),a}function animate(t){var e=t.components,n=e.sprite,i=e["p-move"].value;0===i.x&&0===i.y||(1===i.x?n.r+=90:-1===i.x?n.r-=90:-1!==i.y&&1!==i.y||n.r%180==0?-1!==i.y&&1!==i.y||n.r%180!=0||(n.r+=180):n.r=0,1===Math.abs(n.r%360)&&(n.r=0))}function movement(t){var e=t.components,n=e["p-pos"],i=e["p-move"].value;if(0!==i.x||0!==i.y){var s=Pt.from(n.value);return n.value.x+=i.x,n.value.y+=i.y,Game.gd.movePlayer(s,n.value),i.x=i.y=0,!0}return!1}function drawEnt(t,e,n){var i=e.components.sprite,s=i.value,r=e.components["p-pos"].value;r.x>0&&r.x<n.p.x+n.s.w&&r.y>0&&r.y<n.p.y+n.s.h&&(t.save(),t.translate(~~((r.x-n.p.x)*Game.T_S*2)+Game.T_S,~~((r.y-n.p.y)*Game.T_S*2)+Game.T_S),t.rotate(i.r*Math.PI/180),t.drawImage(s,0,0,Game.T_S,Game.T_S,-Game.T_S,-Game.T_S,2*Game.T_S,2*Game.T_S),t.restore())}function drawSpr(t,e,n,i,s){void 0===i&&(i=1),void 0===s&&(s=0),t.save(),t.translate(~~(n.x*Game.T_S*i),~~(n.y*Game.T_S*i)),t.rotate(s*Math.PI/180),t.drawImage(e,0,0,Game.T_S,Game.T_S,-Game.T_S,-Game.T_S,Game.T_S*i,Game.T_S*i),t.restore()}function randomInt(t,e){return Math.floor(Math.random()*(e-t+1))+t}function randomized(t,e){void 0===e&&(e=!0);var n=t,i=e,s=shuffle(n);return function(){if(0===s.length&&i)s=shuffle(n);else if(0===s.length&&!i)return;return s.pop()}}function shuffle(t){for(var e,n,i=t.length,s=t.slice();0!==i;)n=Math.floor(Math.random()*i),e=s[i-=1],s[i]=s[n],s[n]=e;return s}var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),Input;!function(t){!function(t){var e;!function(t){t[t.A=65]="A",t[t.D=68]="D",t[t.W=87]="W",t[t.S=83]="S",t[t.LEFT=37]="LEFT",t[t.RIGHT=39]="RIGHT",t[t.UP=38]="UP",t[t.DOWN=40]="DOWN",t[t.ENTER=13]="ENTER",t[t.SPACE=32]="SPACE",t[t.NUM_1=49]="NUM_1",t[t.NUM_2=50]="NUM_2",t[t.NUM_3=51]="NUM_3",t[t.NUM_4=52]="NUM_4",t[t.NUM_5=53]="NUM_5",t[t.C=67]="C",t[t.ESC=27]="ESC"}(e=t.KEY||(t.KEY={}));var n;!function(t){t[t.UP=0]="UP",t[t.DOWN=1]="DOWN",t[t.LEFT=2]="LEFT",t[t.RIGHT=3]="RIGHT",t[t.ACTION=4]="ACTION"}(n=t.META_KEY||(t.META_KEY={})),t.KEY_BIND=[],t.KEY_BIND[n.UP]=[e.W,e.UP],t.KEY_BIND[n.DOWN]=[e.S,e.DOWN],t.KEY_BIND[n.LEFT]=[e.A,e.LEFT],t.KEY_BIND[n.RIGHT]=[e.D,e.RIGHT],t.KEY_BIND[n.ACTION]=[e.SPACE,e.ENTER];for(var i=[],s=[],r=[],a=0;a<256;a++)s[a]=!0;t.isDown=function(t){return i[t]},t.wasDown=function(t){var e=r[t];return r[t]=!1,e},t.clearInputQueue=function(){for(var t in r)r[t]=!1},t.keyDown=function(t){var e=t.which;i[e]=!0,s[e]&&(r[e]=!0),s[e]=!1},t.keyUp=function(t){var e=t.which;i[e]=!1,s[e]=!0},t.isBindDown=function(e){for(var n=!1,s=0,r=t.KEY_BIND[e];s<r.length;s++){var a=r[s];n=n||i[a]}return n},t.wasBindDown=function(e){for(var n=!1,i=0,s=t.KEY_BIND[e];i<s.length;i++){var a=s[i];n=n||r[a],r[a]=!1}return n}}(t.KB||(t.KB={}))}(Input||(Input={}));var Game=function(){function t(){}return Object.defineProperty(t,"i",{get:function(){return t._i||(t._i=new t),t._i},enumerable:!0,configurable:!0}),Object.defineProperty(t,"gd",{get:function(){return t.i._gc||(t.i._gc=new GameData),t.i._gc},enumerable:!0,configurable:!0}),t.prototype.init=function(t,e,n){this._c=e,this._w=t,this._ac=n,ImageCache.Loader.add("sheet","./sheet.png"),ImageCache.Loader.load(this.done.bind(this))},t.prototype.done=function(){this.e=new Engine(this._c),this.bindings(),this.e.gsm.reg("main-menu",new MainMenu),this.e.gsm.reg("game-screen",new GameScreen),this.e.gsm.reg("marker-menu",new MarkerMenu),this.e.gsm.push("main-menu"),this.e.run()},t.prototype.bindings=function(){this._w.addEventListener("resize",this.onResize.bind(this),!1),this.onResize(),this._w.onkeydown=Input.KB.keyDown,this._w.onkeyup=Input.KB.keyUp,this._w.onblur=this.e.pause.bind(this.e),this._w.onfocus=this.e.unpause.bind(this.e),this.ae=new AudioEngine(this._ac),SSM.storeSheet(new SpriteSheet("sheet","sprites",8,0,new Dm(5,1))),SSM.storeSheet(new SpriteSheet("sheet","marker",8,0,new Dm(2,1),new Pt(8,0))),SSM.storeSheet(new SpriteSheet("sheet","floor",8,0,new Dm(3,1),new Pt(24,0))),SSM.storeSheet(new SpriteSheet("sheet","wall",8,0,new Dm(4,1),new Pt(48,0))),SSM.storeSheet(new SpriteSheet("sheet","guide",8,0,new Dm(3,1),new Pt(0,8))),SSM.storeSheet(new SpriteSheet("sheet","objects",8,0,new Dm(3,1),new Pt(24,8)))},t.prototype.onResize=function(){var t=window.innerWidth/this._c.width,e=window.innerHeight/this._c.height,n=0|Math.min(t,e);n=n<=0?1:n;var i=[this._c.width*n,this._c.height*n],s=[(window.innerWidth-i[0])/2,(window.innerHeight-i[1])/2],r=document.getElementById("stage"),a="translate("+~~s[0]+"px, "+~~s[1]+"px) scale("+~~n+")";r.style.transform=a,r.style.webkitTransform=a},t}();!function(t){t.P_W=512,t.P_H=288,t.T_W=64,t.T_H=36,t.T_S=8}(Game||(Game={}));var GameState=function(){function t(){this.redraw=!0,this.requestingClear=!1}return t.prototype.transitionIn=function(){this.redraw=!0,this.update(0)},t.prototype.transitionOut=function(){this.redraw=!0,this.update(0)},t}(),GameStateManager=function(){function t(){this.stateCollection={},this.stateStack=[]}return t.prototype.reg=function(t,e){this.stateCollection[t]=e},Object.defineProperty(t.prototype,"cur",{get:function(){return this.stateStack[this.stateStack.length-1]},enumerable:!0,configurable:!0}),t.prototype.push=function(t){this.cur&&this.cur.transitionOut(),this.stateStack.push(this.stateCollection[t]),this.cur&&this.cur.transitionIn()},t.prototype.pop=function(){this.cur&&this.cur.transitionOut(),this.stateStack.pop(),this.cur&&this.cur.transitionIn()},t}(),Engine=function(){function t(t){this.clearScreen=!1,this.redraw=!1,this.systemPause=!1,this.screen=t,this.ctx=this.screen.getContext("2d"),this.ctx.mozImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1,this.ctx.webkitImageSmoothingEnabled=!1,this.buffer=document.createElement("canvas"),this.buffer.width=this.screen.width,this.buffer.height=this.screen.height,this.bufferCtx=this.buffer.getContext("2d"),this.bufferCtx.mozImageSmoothingEnabled=!1,this.bufferCtx.imageSmoothingEnabled=!1,this.bufferCtx.webkitImageSmoothingEnabled=!1,this.gsm=new GameStateManager}return t.prototype.update=function(t){this.systemPause||this.gsm.cur.update(t)},t.prototype.draw=function(){(this.clearScreen||this.gsm.cur.requestingClear)&&(this.ctx.clearRect(0,0,this.screen.width,this.screen.height),this.bufferCtx.clearRect(0,0,this.screen.width,this.screen.height),this.clearScreen=this.gsm.cur.requestingClear=!1),this.systemPause||!this.redraw&&!this.gsm.cur.redraw?this.systemPause&&this.redraw&&(this.ctx.globalAlpha=.7,this.ctx.fillStyle="black",this.ctx.fillRect(0,0,Game.P_W,Game.P_H),this.ctx.globalAlpha=1,this.redraw=this.gsm.cur.redraw=!1):(this.bufferCtx.globalAlpha=1,this.bufferCtx.mozImageSmoothingEnabled=!1,this.bufferCtx.imageSmoothingEnabled=!1,this.bufferCtx.webkitImageSmoothingEnabled=!1,this.gsm.cur.draw(this.bufferCtx),this.ctx.globalAlpha=1,this.ctx.mozImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1,this.ctx.webkitImageSmoothingEnabled=!1,this.ctx.drawImage(this.buffer,0,0,Game.P_W,Game.P_H,0,0,Game.P_W,Game.P_H),this.redraw=this.gsm.cur.redraw=!1)},t.prototype.loop=function(){var t=window.performance.now(),e=t-this.then;this.then=t,this.update(e),this.draw(),this.loopHandle=window.requestAnimationFrame(this.loop.bind(this))},t.prototype.run=function(){this.loopHandle=window.requestAnimationFrame(this.loop.bind(this))},t.prototype.stop=function(){window.cancelAnimationFrame(this.loopHandle)},t.prototype.pause=function(){this.systemPause=!0,this.redraw=!0},t.prototype.unpause=function(){this.systemPause=!1,this.gsm.cur.redraw=this.clearScreen=!0},t}(),AudioEngine=function(){function t(t){this.audioContext=t}return t.prototype.beep=function(t){var e=this.audioContext,n=e.createOscillator(),i=e.createGain(),s=t.vol||1;n.type=t.shape,n.frequency.setValueAtTime(t.freq1,e.currentTime),n.frequency.exponentialRampToValueAtTime(t.freq2,e.currentTime+t.dur/2),n.frequency.exponentialRampToValueAtTime(t.freq1,e.currentTime+t.dur),i.gain.setValueAtTime(s,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+t.dur),n.connect(i),i.connect(e.destination),n.start(e.currentTime),n.stop(e.currentTime+t.dur)},t}(),Beep=function(){return function(t,e,n,i,s){this.freq1=t,this.freq2=e,this.shape=n,this.dur=i,this.vol=s}}(),Component=function(){return function(t){this.name=t}}(),GameEntity=function(){function t(){return this.components={},t.autoID||(t.autoID=0),this.id=t.autoID++,this}return t.prototype.addComponent=function(t){return this.components[t.name]=t,this},t}(),ImageCache;!function(t){var e={};t.getTexture=function(t){return e[t]};var n={},i=0;!function(t){t.add=function(t,e){n[t]=e,i++},t.load=function(t){var s={counter:0,loadCount:0,callback:t};for(var r in n)e[r]=new Image,e[r].src=n[r],e[r].onload=function(t){t.counter++===t.loadCount&&t.callback()}.bind(this,s),delete n[r];i=0}}(t.Loader||(t.Loader={}))}(ImageCache||(ImageCache={}));var Pt=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.x=t,this.y=e}return t.from=function(e){var n=new t;return n.x=e.x,n.y=e.y,n},t}(),Dm=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.w=t,this.h=e}return t.from=function(e,n){return new t(e,n)},t}(),SpriteSheet=function(){function t(t,e,n,i,s,r){void 0===i&&(i=0),void 0===s&&(s=new Dm(0,0)),void 0===r&&(r=new Pt(0,0)),this.sprites=[],this.name=e,this.offset=r,this.subsheet=s,this.tileSize=n,this.gutter=i,this.image=ImageCache.getTexture(t),this.storeSprites()}return t.prototype.reColourize=function(t,e,n,i,s){for(var r=this.sprites[t].getContext("2d").getImageData(0,0,this.tileSize,this.tileSize),a=0;a<this.tileSize*this.tileSize*4;a+=4)r.data[a]=e||r.data[a],r.data[a+1]=n||r.data[a+1],r.data[a+2]=i||r.data[a+2],r.data[a+3]=s||r.data[a+3];var o=document.createElement("canvas");return o.width=o.height=this.tileSize,o.getContext("2d").putImageData(r,0,0),o},t.prototype.storeSprites=function(t){void 0===t&&(t=null),this.spritesPerRow=0===this.subsheet.w||0===this.subsheet.h?this.image.width/this.tileSize:this.subsheet.w,this.spritesPerCol=0===this.subsheet.w||0===this.subsheet.h?this.image.height/this.tileSize:this.subsheet.h;for(var e,n=0;n<this.spritesPerCol;n++)for(var i=0;i<this.spritesPerRow;i++){var s=(e=this.sprites[i+n*this.spritesPerRow]=document.createElement("canvas")).getContext("2d");s.mozImageSmoothingEnabled=s.webkitImageSmoothingEnabled=s.imageSmoothingEnabled=!1,e.width=this.tileSize,e.height=this.tileSize,s.drawImage(this.image,(this.tileSize+this.gutter)*i+this.offset.x,(this.tileSize+this.gutter)*n+this.offset.y,this.tileSize,this.tileSize,0,0,this.tileSize,this.tileSize)}},t}(),SSM;!function(t){var e={};t.storeSheet=function(t){e[t.name]=t},t.spriteSheet=function(t){return e[t]}}(SSM||(SSM={}));var GameData=function(){function t(){this.p=[],this.m=[],this.o=[],this.lm=[],this.lights=[]}return t.prototype.buildObjBank=function(t,e){for(var n=[0],i=0;i<t;i++)n.push(1);for(i=0;i<e;i++)n.push(2);for(i=0;i<50;i++)n.push(3);for(i=0;i<25;i++)n.push(4);this.objectBank=randomized(n,!1)},t.prototype.addRandObj=function(t,e){var n=parseInt(this.objectBank()),i=new Pt(randomInt(t.x+1,t.x+e.w-2),randomInt(t.y+1,t.y+e.h-2));if(void 0!==n)switch(n){case 0:this.addObject(createObject(0),i);break;case 1:break;case 2:this.addObject(createSwitch(),i);break;case 3:this.addObject(createObject(1),i);break;case 4:default:this.addObject(createObject(2),i)}else this.addObject(createObject(2),i)},t.prototype.addEntity=function(t,e){t.components["p-pos"].value=e;var n=e.x+e.y*this.l.s.w;this.l.m[n]|=TMASK.P;var i=this.p.push(t);this.l.m[n]|=i<<24},t.prototype.addObject=function(t,e){t.components["p-pos"].value=e;var n=e.x+e.y*this.l.s.w;this.l.m[n]|=TMASK.O;var i=this.o.push(t);this.l.m[n]|=i<<16},t.prototype.addMarker=function(t,e){t.components["p-pos"].value=e;var n=e.x+e.y*this.l.s.w;this.l.m[n]|=TMASK.M;var i=this.m.push(t);this.l.m[n]|=i<<8},t.prototype.movePlayer=function(t,e){if(this.l.m[t.x+t.y*this.l.s.w]){var n=(this.l.m[t.x+t.y*this.l.s.w]>>24)-1;this.l.m[t.x+t.y*this.l.s.w]&=~(15<<24),this.l.m[t.x+t.y*this.l.s.w]&=~TMASK.P,void 0==this.l.m[e.x+e.y*this.l.s.w]&&(this.l.m[e.x+e.y*this.l.s.w]=0),this.l.m[e.x+e.y*this.l.s.w]|=n+1<<24,this.l.m[e.x+e.y*this.l.s.w]|=TMASK.P}},t.prototype.playerAt=function(t){return 0!=(this.l.m[t.x+t.y*this.l.s.w]&TMASK.P)},t.prototype.objectAt=function(t){return 0!=(this.l.m[t.x+t.y*this.l.s.w]&TMASK.O)},t.prototype.markerAt=function(t){return 0!=(this.l.m[t.x+t.y*this.l.s.w]&TMASK.M)},t.prototype.getPlayerAt=function(t){if(this.playerAt(t)){var e=(this.l.m[t.x+t.y*this.l.s.w]>>24)-1;return Game.gd.p[e]}},t.prototype.getObjectAt=function(t){if(this.objectAt(t)){var e=((this.l.m[t.x+t.y*this.l.s.w]&~(15<<24))>>16)-1;return Game.gd.o[e]}},t.prototype.getMarkerAt=function(t){if(this.markerAt(t)){var e=((-268369921&this.l.m[t.x+t.y*this.l.s.w])>>8)-1;return Game.gd.m[e]}},t.prototype.getCurrPlayer=function(){for(var t in this.p)if(this.p[t].components.input&&!0===this.p[t].components.input.value)return this.p[t]},t.prototype.getMarkerIndex=function(t){if(this.markerAt(t))return((-268369921&this.l.m[t.x+t.y*this.l.s.w])>>8)-1},t}(),Camera=function(){return function(t,e){this.p=t,this.s=e}}(),cAABB=function(t){function e(e){var n=e.w,i=void 0===n?0:n,s=e.h,r=void 0===s?0:s,a=t.call(this,"aabb")||this;return a.value=new Dm(i,r),a}return __extends(e,t),e}(Component),cP=function(t){function e(e,n){void 0===n&&(n=new Pt);var i=t.call(this,"p-"+e)||this;return i.value=n,i}return __extends(e,t),e}(Component),cStyle=function(t){function e(e){var n=t.call(this,"style")||this;return n.value=e,n}return __extends(e,t),e}(Component),cSprite=function(t){function e(e){var n=t.call(this,"sprite")||this;return n.r=0,n.value=e,n}return __extends(e,t),e}(Component),cTag=function(t){function e(e,n){var i=t.call(this,e)||this;return i.value=n,i}return __extends(e,t),e}(Component),cFlag=function(t){function e(e,n){var i=t.call(this,e)||this;return i.value=n,i}return __extends(e,t),e}(Component),cLight=function(t){function e(e){var n=t.call(this,"light")||this;return n.value=e,n}return __extends(e,t),e}(Component),cSound=function(t){function e(e,n){var i=t.call(this,"s-"+e)||this;return i.value=n,i}return __extends(e,t),e}(Component),cTimer=function(t){function e(e,n){var i=t.call(this,"t-"+e)||this;return i.cur=0,i.value=n,i}return __extends(e,t),e}(Component),TMASK;!function(t){t.W=1,t.O=2,t.M=4,t.P=8,t.FLOOR=16,t.WALL=32,t.S_WALL=64}(TMASK||(TMASK={}));var Level=function(){function t(t){void 0===t&&(t=new Dm(50,50)),this.m=[],this.r=!0,this.s=t,this.rc=document.createElement("canvas"),this.rc.width=t.w*Game.T_S,this.rc.height=t.h*Game.T_S,this.ctx=this.rc.getContext("2d"),this.ctx.mozImageSmoothingEnabled=!1,this.ctx.webkitImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1}return t.prototype.calcOrigin=function(t,e){var n=e.w===WALL.N,i=e.w===WALL.S,s=e.w===WALL.E,r=e.w===WALL.W,a=e.p.x-(n||i?~~(t.s.w/2):0)+(s?1:0)-(r?t.s.w:0),o=e.p.y-(s||r?~~(t.s.h/2):0)+(n?0:i?1:0)-(n?t.s.h:0);return new Pt(a,o)},t.prototype.addDoor=function(t,e){this.m[e.p.x+e.p.y*this.s.h]=TMASK.FLOOR|TMASK.W,e.w===WALL.N||e.w===WALL.S?(this.m[e.p.x-1+e.p.y*this.s.h]=TMASK.WALL|TMASK.S_WALL,this.m[e.p.x+1+e.p.y*this.s.h]=TMASK.WALL|TMASK.S_WALL,this.m[e.p.x+(e.p.y-1)*this.s.h]=TMASK.FLOOR|TMASK.W,this.m[e.p.x+(e.p.y+1)*this.s.h]=TMASK.FLOOR|TMASK.W):(this.m[e.p.x-1+e.p.y*this.s.h]=TMASK.FLOOR|TMASK.W,this.m[e.p.x+1+e.p.y*this.s.h]=TMASK.FLOOR|TMASK.W,this.m[e.p.x+(e.p.y-1)*this.s.h]=TMASK.WALL,this.m[e.p.x-1+(e.p.y-1)*this.s.h]=TMASK.WALL,this.m[e.p.x+1+(e.p.y-1)*this.s.h]=TMASK.WALL,this.m[e.p.x+(e.p.y+1)*this.s.h]=TMASK.WALL|TMASK.S_WALL)},t.prototype.scan=function(t,e){var n=!0,i=e.w===WALL.N,s=e.w===WALL.S,r=e.w===WALL.E,a=e.w===WALL.W,o=this.calcOrigin(t,e),h=o.x,c=o.y,p=t.s.w+(r||a?1:0),u=t.s.h+(i||s?1:0);n=h>0&&c>0&&h<this.s.w-t.s.w&&c<this.s.h-t.s.h;for(var m=h;m<h+p&&n;m++)for(var l=c;l<c+u&&n;l++)n=n&&void 0===this.m[m+l*this.s.h];return n},t.prototype.roomToMap=function(t,e){t.p.x=e.x,t.p.y=e.y;for(var n=e.x,i=0;i<t.s.w;i++){for(var s=e.y,r=0;r<t.s.h;r++)0===r&&0!==i&&i!==t.s.w-1?this.m[n+s*this.s.h]=TMASK.WALL:0===i||0===r||i===t.s.w-1||r===t.s.h-1?this.m[n+s*this.s.h]=TMASK.WALL|TMASK.S_WALL:this.m[n+s*this.s.h]=TMASK.FLOOR|TMASK.W,s++;n++}},t.prototype.generate=function(){var t,e,n,i,s,r=[],a=new Pt;for(t=n=Room.makeRoom(25,25),a=new Pt(randomInt(0,this.s.w-t.s.w),randomInt(0,this.s.h-t.s.h)),r.push(t),this.roomToMap(t,a),Game.gd.addRandObj(a,t.s);r.length>0;){for(;n.w.length>0&&null!==(i=n.getRandomWall());)if(e=Room.makeCorridor(i.w===WALL.N||i.w===WALL.S),this.scan(e,i))for(a=this.calcOrigin(e,i),this.roomToMap(e,a),this.addDoor(e,i);e.w.length>0&&(t=Room.makeRoom(25,25),null!==(s=e.getRandomWall()));)this.scan(t,s)&&(a=this.calcOrigin(t,s),this.roomToMap(t,a),this.addDoor(t,s),Game.gd.addRandObj(a,t.s),r.push(t),n=t);r.length>1?(r.pop(),n=r[r.length-1]):r.pop()}},t.prototype.update=function(t,e){},t.prototype.render=function(t){var e=this,n=randomized([0,1,1,2]),i=randomized([0,0,0,0,0,0,1,2]);this.m.forEach(function(s,r){var a,o=~~(r/e.s.w),h=r%e.s.w;s?s&TMASK.WALL?a=s&TMASK.S_WALL?SSM.spriteSheet("wall").sprites[3]:SSM.spriteSheet("wall").sprites[n()]:s&TMASK.FLOOR&&(a=SSM.spriteSheet("floor").sprites[i()]):(t.fillStyle="#000000",t.fillRect(h*Game.T_S,o*Game.T_S,Game.T_S,Game.T_S)),a&&t.drawImage(a,0,0,Game.T_S,Game.T_S,~~(h*Game.T_S),~~(o*Game.T_S),Game.T_S,Game.T_S)})},t.prototype.draw=function(t,e){this.r&&(this.render(this.ctx),this.r=!1),t.globalAlpha=1,Game.gd.DEBUG?t.drawImage(this.rc,~~(e.p.x*Game.T_S),~~(e.p.y*Game.T_S),~~(e.s.w*Game.T_S),~~(e.s.h*Game.T_S),0,0,~~(Game.T_W*Game.T_S),~~(Game.T_H*Game.T_S)):t.drawImage(this.rc,~~(e.p.x*Game.T_S),~~(e.p.y*Game.T_S),~~(e.s.w*Game.T_S),~~(e.s.h*Game.T_S),0,0,~~(e.s.w*Game.T_S*2),~~(e.s.h*Game.T_S*2))},t}(),Light=function(){function t(t,e){this.p=t,this.i=e,this.r=8}return t.prototype.calc=function(e,n){this.a=[];var i=t.poc(this.p.x,this.p.y,this.r);for(var s in i){var r=t.pol(this.p.x,this.p.y,i[s].x,i[s].y),a=this.i/r.length,o=0;for(var h in r){if(r[h].x<0||r[h].x>=n.w||r[h].y<0||r[h].y>=n.h)break;var c=r[h].y*n.w+r[h].x,p=a*(r.length-parseInt(h));if(e[c]&TMASK.FLOOR&&o>0)break;if(c in this.a&&!(this.a[c]>p)||(this.a[c]=1-(p>1?1:p)),e[c]&TMASK.S_WALL)break;if(e[c]&TMASK.WALL&&o>1)break;if(e[c]&TMASK.WALL&&o++,!e[c])break}}},t.reLM=function(t,e){var n=[];for(var i in t)for(var s in t[i].a)(!n[s]||n[s]>t[i].a[s])&&(n[s]=t[i].a[s]);return n},t.pol=function(t,e,n,i){var s=[],r=Math.abs(n-t),a=Math.abs(i-e),o=t,h=e,c=1+r+a,p=t<n?1:-1,u=e<i?1:-1,m=r-a;for(r*=2,a*=2;c>0;)s.push(new Pt(o,h)),m>0?(o+=p,m-=a):(h+=u,m+=r),c-=1;return s},t.poc=function(t,e,n){for(var i=[],s=n,r=0,a=~~(1-s);r<=s;)i.push(new Pt(s+t,r+e)),i.push(new Pt(r+t,s+e)),i.push(new Pt(-s+t,r+e)),i.push(new Pt(-r+t,s+e)),i.push(new Pt(-s+t,-r+e)),i.push(new Pt(-r+t,-s+e)),i.push(new Pt(s+t,-r+e)),i.push(new Pt(r+t,-s+e)),r+=1,a+=a<=0?2*r+1:2*(r-(s-=1))+1;return i},t}(),WALL;!function(t){t[t.N=0]="N",t[t.E=1]="E",t[t.S=2]="S",t[t.W=3]="W"}(WALL||(WALL={}));var ROOMTYPE;!function(t){t[t.CORRIDOR=0]="CORRIDOR",t[t.ROOM=1]="ROOM"}(ROOMTYPE||(ROOMTYPE={}));var Room=function(){function t(t,e,n,i){void 0===t&&(t=new Pt),void 0===e&&(e=new Dm),void 0===n&&(n=ROOMTYPE.ROOM),void 0===i&&(i=[WALL.N,WALL.E,WALL.S,WALL.W]),this.p=t,this.s=e,this.w=i,this.t=n,this.w=shuffle(this.w)}return t.prototype.getRandomWall=function(){if(0===this.w.length)return null;var t=this.w.pop(),e=new Pt;return t===WALL.N?(e.x=this.p.x+Math.floor(this.s.w/2),e.y=this.p.y-1):t===WALL.S?(e.x=this.p.x+Math.floor(this.s.w/2),e.y=this.p.y+this.s.h):t===WALL.W?(e.x=this.p.x-1,e.y=this.p.y+Math.floor(this.s.h/2)):t===WALL.E&&(e.x=this.p.x+this.s.w,e.y=this.p.y+Math.floor(this.s.h/2)),{p:e,w:t}},t.makeRoom=function(e,n){return new t(new Pt,new Dm(randomInt(7,e),randomInt(7,n)),ROOMTYPE.ROOM)},t.makeCorridor=function(e){return new t(new Pt,new Dm(e?5:randomInt(9,17),e?randomInt(9,17):5),ROOMTYPE.CORRIDOR)},t}(),GameScreen=function(t){function e(){var e=t.call(this)||this;e.c=new Camera(new Pt,new Dm(32,14)),Game.gd.buildObjBank(4,8),Game.gd.l=new Level(new Dm(250,250)),Game.gd.l.generate();var n=createPlayer();Game.gd.addEntity(n,new Pt(10,10));var i=createPlayer();i.components.input.value=!0,Game.gd.addEntity(i,new Pt(11,10));var s=Pt.from(Game.gd.getCurrPlayer().components["p-pos"].value);return e.c.p.x=s.x-~~(e.c.s.w/2),e.c.p.y=s.y-~~(e.c.s.h/2),e}return __extends(e,t),e.prototype.transitionIn=function(){this.requestingClear=!0,t.prototype.transitionIn.call(this)},e.prototype.transitionOut=function(){t.prototype.transitionOut.call(this)},e.prototype.update=function(t){if(Input.KB.wasDown(Input.KB.KEY.C)){Game.gd.DEBUG=!Game.gd.DEBUG,Game.gd.DEBUG?(this.c.s.w=Game.T_W,this.c.s.h=Game.T_H):(this.c.s.w=32,this.c.s.h=14);r=Pt.from(Game.gd.getCurrPlayer().components["p-pos"].value);this.c.p.x=r.x-~~(this.c.s.w/2),this.c.p.y=r.y-~~(this.c.s.h/2),this.redraw=!0}Game.gd.l.update(t,this.c);for(var e in Game.gd.p){var n=Game.gd.p[e].components,i=Game.gd.p[e];if(n.input&&n.input.value&&n["t-move"]){var s=n["t-move"];if(s.cur+=t,s.cur>=s.value&&n["p-move"]&&input(i)&&(s.cur=0,n["p-pos"]&&!collision(i,Game.gd.l)&&(n.sprite&&animate(i),movement(i)))){this.redraw=!0;var r=n["p-pos"].value;if(this.c.p.x=r.x-~~(this.c.s.w/2),this.c.p.y=r.y-~~(this.c.s.h/2),Game.gd.objectAt(r)){var a=Game.gd.getObjectAt(r);switch(a.components.type.value){case"gold":Game.i.ae.beep(new Beep(2500,2500,"square",.75,1)),pickup(a);break;case"chest":Game.i.ae.beep(new Beep(635,3,"square",.1,1)),pickup(a);break;case"switch":Game.i.ae.beep(new Beep(1900,1,"square",.1,1)),activate(a);break;case"exit":exit(i)}}else n["s-move"]&&Game.i.ae.beep(n["s-move"].value)}}}if(this.redraw){for(var e in Game.gd.p)if((n=Game.gd.p[e].components).light&&n["p-pos"]){var o=n.light.value;o.p=n["p-pos"].value,o.calc(Game.gd.l.m,Game.gd.l.s),Game.gd.lights.push(o)}Game.gd.lights.length>0&&(Game.gd.lm=Light.reLM(Game.gd.lights,Game.gd.l.s))}Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)&&Game.i.e.gsm.push("marker-menu"),this.requestingClear=this.redraw},e.prototype.draw=function(t){var e=this;if(this.redraw)if(Game.gd.l.draw(t,this.c),Game.gd.DEBUG){Game.gd.m.forEach(function(n){var i=n.components.sprite.value,s=n.components["p-pos"].value;t.drawImage(i,0,0,Game.T_S,Game.T_S,~~((s.x-e.c.p.x)*Game.T_S),~~((s.y-e.c.p.y)*Game.T_S),Game.T_S,Game.T_S)}),Game.gd.o.forEach(function(n){var i=n.components.sprite.value,s=n.components["p-pos"].value;t.drawImage(i,0,0,Game.T_S,Game.T_S,~~((s.x-e.c.p.x)*Game.T_S),~~((s.y-e.c.p.y)*Game.T_S),Game.T_S,Game.T_S)}),Game.gd.p.forEach(function(n){var i=n.components.sprite.value,s=n.components["p-pos"].value;t.drawImage(i,0,0,Game.T_S,Game.T_S,~~((s.x-e.c.p.x)*Game.T_S),~~((s.y-e.c.p.y)*Game.T_S),Game.T_S,Game.T_S)}),t.globalAlpha=.7;for(var n=new Pt,i=this.c.p.x;i<this.c.p.x+this.c.s.w;i++)for(var s=this.c.p.y;s<this.c.p.y+this.c.s.h;s++)n.x=i,n.y=s,Game.gd.l.m[i+s*Game.gd.l.s.w]&TMASK.W?t.fillStyle="green":t.fillStyle="red",Game.gd.markerAt(n)&&(t.fillStyle="yellow"),Game.gd.objectAt(n)&&(t.fillStyle="blue"),Game.gd.playerAt(n)&&(t.fillStyle="orange"),t.fillRect(~~(i-this.c.p.x)*Game.T_S+2,~~(s-this.c.p.y)*Game.T_S+2,4,4);t.globalAlpha=1}else if(Game.gd.m.forEach(function(n){drawEnt(t,n,e.c)}),Game.gd.o.forEach(function(n){drawEnt(t,n,e.c)}),Game.gd.p.forEach(function(n){drawEnt(t,n,e.c)}),Game.gd.lm.length>0){t.fillStyle="#0d0d0d";for(var r=this.c.p.x,a=0;r<this.c.p.x+this.c.s.w;r++){for(var o=this.c.p.y,h=0;o<this.c.p.y+this.c.s.h;o++){var c=Game.gd.lm[r+o*Game.gd.l.s.h];t.globalAlpha=c||1,t.fillRect(a*Game.T_S*2,h*Game.T_S*2,2*Game.T_S,2*Game.T_S),h++}a++}t.globalAlpha=1}},e}(GameState),MainMenu=function(t){function e(){var e=t.call(this)||this;return e.selectedIndex=0,e.menuOptions=["Start","Options","Exit"],e}return __extends(e,t),e.prototype.transitionIn=function(){this.requestingClear=!0,t.prototype.transitionIn.call(this)},e.prototype.transitionOut=function(){this.requestingClear=!0,t.prototype.transitionIn.call(this)},e.prototype.update=function(t){if(Input.KB.wasBindDown(Input.KB.META_KEY.ACTION))switch(this.selectedIndex){case 0:Game.i.e.gsm.push("game-screen");break;case 1:break;default:window.location.reload()}Input.KB.wasBindDown(Input.KB.META_KEY.DOWN)&&(this.selectedIndex=(this.selectedIndex+1)%this.menuOptions.length,this.redraw=this.requestingClear=!0),Input.KB.wasBindDown(Input.KB.META_KEY.UP)&&(0===this.selectedIndex?this.selectedIndex=this.menuOptions.length-1:this.selectedIndex=(this.selectedIndex-1)%3,this.redraw=this.requestingClear=!0)},e.prototype.draw=function(t){if(this.redraw){t.globalAlpha=1,t.font="18px Verdana",t.textAlign="center",t.fillStyle=t.strokeStyle="#DDDDDD",t.lineWidth=2,t.fillText("js13k 2017",~~(Game.P_W/2|0),64);for(var e=0;e<this.menuOptions.length;e++)t.fillText(this.menuOptions[e],~~(Game.P_W/2|0),~~((0|Game.P_H)-36*this.menuOptions.length+36*e));t.strokeRect(~~(Game.P_W/2-75),~~(Game.P_H-36*this.menuOptions.length+36*this.selectedIndex-18),150,24)}},e}(GameState),MarkerMenu=function(t){function e(){var e=t.call(this)||this;return e.selectedIndex=0,e}return __extends(e,t),e.prototype.transitionIn=function(){Input.KB.clearInputQueue(),this.selectedIndex=5,t.prototype.transitionIn.call(this)},e.prototype.transitionOut=function(){Input.KB.clearInputQueue(),t.prototype.transitionIn.call(this)},e.prototype.update=function(t){if(Input.KB.wasDown(Input.KB.KEY.ESC)&&Game.i.e.gsm.pop(),Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)){var e=Pt.from(Game.gd.getCurrPlayer().components["p-pos"].value),n=Game.gd.getMarkerIndex(e);if(void 0!==n&&(delete Game.gd.m[n],Game.gd.l.m[e.x+e.y*Game.gd.l.s.w]&=~TMASK.M),5!==this.selectedIndex){var i=createMarker(4===this.selectedIndex?1:0,90*this.selectedIndex);Game.gd.addMarker(i,e)}Game.i.e.gsm.pop()}Input.KB.wasBindDown(Input.KB.META_KEY.RIGHT)&&(this.selectedIndex=(this.selectedIndex+1)%6,this.redraw=!0),Input.KB.wasBindDown(Input.KB.META_KEY.LEFT)&&(0===this.selectedIndex?this.selectedIndex=5:this.selectedIndex=(this.selectedIndex-1)%6,this.redraw=!0)},e.prototype.draw=function(t){this.redraw&&(t.globalAlpha=1,t.fillStyle="black",t.fillRect(128,112,~~(Game.P_W-256),~~(Game.P_H-240)),drawSpr(t,SSM.spriteSheet("marker").sprites[0],new Pt(10,9),2),drawSpr(t,SSM.spriteSheet("marker").sprites[0],new Pt(12,9),2,90),drawSpr(t,SSM.spriteSheet("marker").sprites[0],new Pt(14,9),2,180),drawSpr(t,SSM.spriteSheet("marker").sprites[0],new Pt(16,9),2,270),drawSpr(t,SSM.spriteSheet("marker").sprites[1],new Pt(18,9),2),t.font="11px sans-serif",t.textAlign="left",t.fillStyle=t.strokeStyle="#FFFFFF",t.fillText("CLEAR",~~(39*Game.T_S),~~(18.5*Game.T_S)),t.font="11px sans-serif",t.textAlign="center",t.fillStyle=t.strokeStyle="#FFFFFF",t.fillText("PLACE A MARKER",~~(32*Game.T_S),~~(15.5*Game.T_S)),t.strokeStyle="green",t.lineWidth=2,t.strokeRect((19+4*this.selectedIndex)*Game.T_S-2,17*Game.T_S-2,4+(5===this.selectedIndex?6*Game.T_S:2*Game.T_S),2*Game.T_S+4))},e}(GameState);