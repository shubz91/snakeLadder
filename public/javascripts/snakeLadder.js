
var snakeLadder={
	parent:null,
	cells:[],
	ladders:[],
	snakes:[],
	players:{},
	boardWidth:500,
	boardHeight:500,
	cellWidth:50,
	cellHeight:50,
	ladderWidth:20,
	renderboard:function(parent,config=null){
		this.boardWidth=parent.offsetWidth;
		this.cellWidth=parent.offsetWidth/10;
		this.boardHeight=parent.offsetHeight;
		this.cellHeight=parent.offsetHeight/10;
		this.parent=parent;
		this.cells=[],
		this.ladders=[],
		this.snakes=[],
		this.players={},
		parent.innerHTML="";
		for (var r = 0; r <= 9; r++) {
			for(var c=1;c<=10;c++){
				this.cells[this.getNum(r,c)]=this.rendercell(r,c)
			}
		}
		if(config==null){
			// var snkCnt=Math.floor(Math.random()*4)+7;
			// var ladCnt=Math.floor(Math.random()*(snkCnt-5))+6;
			this.generateConfig(8,7);
			// this.generateConfig(9,8);
			parent.board=this;
		}
		else{
			parent.board=this;
			this.loadConfig(config);
		}
		return(this);
	},
	getRandomHex:function(){
		return('#'+Math.floor(Math.random()*16777215).toString(16));
	},
	generateConfig:function(snakes,ladders){
		var snc=0,ldc=0;
		// this.createLadder([28,28],[68,68]);
		// this.createLadder([9,9],[33,33]);
		while(ldc<=ladders){
			this.createLadder([80,5],[95,10]);
			ldc++;
		}
		this.createSnake([99,95],[80,30],this.getRandomHex());
		this.createSnake([90,80],[80,30],this.getRandomHex());
		while(snc<=(snakes-2)){
			this.createSnake([99,25],[85,5],this.getRandomHex());
			snc++;
		}
		console.log(this.snakes, this.ladders);
	},
	createLadder:function(fromR,toR){
		var trycnt=0;
		while(trycnt<50){
			var from=Math.floor(Math.random() * (fromR[0]-fromR[1])) + fromR[1];
			var to=Math.floor(Math.random() * (toR[0]-toR[1])) + toR[1];
			if(this.validateLadder(from,to)){
				return(this.renderLadder(from,to));
			}
			trycnt++;
		}
		return(false);
	},
	createSnake:function(fromR,toR,hex){
		var trycnt=0;
		while(trycnt<20){
			var from=Math.floor(Math.random() * (fromR[0]-fromR[1])) + fromR[1];
			var to=Math.floor(Math.random() * (toR[0]-toR[1])) + toR[1];
			if(this.validateSnake(from,to)){
				return(this.renderSnake(from,to,hex));
			}
			trycnt++;
		}
		return(false);
	},
	validateLadder:function(from,to){
		// console.log("validatin ladder",from,to);
		if((to-from)>20 & (to-from)<50){
			if(Math.abs(this.cells[to].offsetLeft - this.cells[from].offsetLeft) < this.cellWidth*2){
				if(this.checkCell(from)==false & this.checkCell(to)==false){
					var int_cnt=0;
					for(var i=0; i<this.ladders.length; i++){
						var l=this.ladders[i];
						var int=this.checkLineIntersection(from,to,l.from,l.to);
						// console.log(from,to,l.from,l.to,int);
						if(int){
							int_cnt++;
							return(false);
						}
					}
					if(int_cnt<2){
						return(true);
					}
				}
			}
		}
		return(false);
	},
	validateSnake:function(from,to){
		var snakesinrow=0, snakescloseby=0;
		if((from-to)>10 & this.checkCell(from)==false & this.checkCell(to)==false){
			var cell_f=this.cells[from];
			var cell_t=this.cells[to];
			var l= Math.sqrt(Math.pow(cell_f.offsetLeft-cell_t.offsetLeft,2) + Math.pow(cell_f.offsetTop-cell_t.offsetTop,2))
			if(l>this.cellWidth*4){
				for(var i=0; i<this.snakes.length; i++){
					//Check if snake already exists on that cell. if it does, then return false
					if(this.snakes[i].from==from || this.snakes[i].to==from || this.snakes[i].from==to || this.snakes[i].to==to){
						return(false);
					}
					//Count snakes in same row
					if(Math.floor(Math.abs(this.snakes[i].from-from)/10) == 0){
						snakesinrow++;
						if(snakesinrow>2){return(false);}
					}
					//Count snakes closeby
					if(Math.abs(this.snakes[i].from-from)<20){
						snakescloseby++;
						// console.log(this.snakes[i].from, from, snakescloseby);
						if(snakescloseby>3){return(false);}
					}
				}
				return(true);
			}
		}
		return(false);
	},
	checkLineIntersection:function(from1,to1,from2,to2){
		var l1p1={x:this.cells[from1].offsetLeft,y:this.cells[from1].offsetTop};
		var l1p2={x:this.cells[to1].offsetLeft,y:this.cells[to1].offsetTop};
		var l2p1={x:this.cells[from2].offsetLeft,y:this.cells[from2].offsetTop};
		var l2p2={x:this.cells[to2].offsetLeft,y:this.cells[to2].offsetTop};
		// console.log(l1p1,l1p2,l2p1,l2p2);
		if((l1p2.x-l1p1.x)==0 & Math.max(l2p1.x,l2p2.x) >= l1p1.x & Math.min(l2p1.x,l2p2.x) <= l1p1.x){return(true);}
		if((l2p2.x-l2p1.x)==0 & Math.max(l1p1.x,l1p2.x) >= l2p1.x & Math.min(l1p1.x,l1p2.x) <= l2p1.x){return(true);}
		var m1=(l1p2.y-l1p1.y)/(l1p2.x-l1p1.x);
		var m2=(l2p2.y-l2p1.y)/(l2p2.x-l2p1.x);
		// if(m1==m2){return(false);}
		var c1=l1p2.y - m1*l1p2.x;
		var c2=l2p2.y - m2*l2p2.x;
		var x=(c2-c1)/(m1-m2);
		// console.log(l1p1,l1p2,l2p1,l2p2,x,(x>=Math.min(l1p1.x,l1p2.x) & x<=Math.max(l1p1.x,l1p2.x) ? true : false));
		return((x>=Math.min(l1p1.x,l1p2.x) & x<=Math.max(l1p1.x,l1p2.x) ? true : false));
	},
	checkCell:function(cell){
		for(var i=0; i<this.ladders.length; i++){
			if(this.ladders[i].from==cell || this.ladders[i].to==cell){
				return(this.ladders);
			}
		}
		for(var i=0; i<this.snakes.length; i++){
			if(this.snakes[i].from==cell || this.snakes[i].to==cell){
				return(this.snakes);
			}
		}
		return(false);
	},
	getNum:function(r,c){
		if(r % 2==1){
			return(r*10 + (11-c));
		}else{
			return(r*10 + c);
		}
	},
	rendercell:function(r,c){
		var ccell= document.createElement('div');
		var num = this.getNum(r,c);
		// ccell.id = "cell_" + num;
		ccell.setAttribute('class', "board_cell cell_" + num + " cell_" + (num % 2 == 0 ? "even" : "odd"));
		ccell.style.top=(this.boardHeight - this.cellHeight*(r+1))+"px";
		ccell.style.left=this.cellWidth*(c-1) + "px";
		ccell.innerHTML="<div class='cell_label'>" + num + "</div>";
		this.parent.appendChild(ccell);
		return(ccell);
	},
	renderLadder:function(fromCell,toCell){
		var cell_f=this.cells[fromCell];
		var cell_t=this.cells[toCell];
		var l= Math.sqrt(Math.pow(cell_f.offsetLeft-cell_t.offsetLeft,2) + Math.pow(cell_f.offsetTop-cell_t.offsetTop,2))
		var angle=90-((90*7/11)*Math.atan((cell_t.offsetTop-cell_f.offsetTop)/(cell_f.offsetLeft-cell_t.offsetLeft)));
		var ladBase= document.createElement('div');
		ladBase.setAttribute('class', "ladder");
		ladBase.from=fromCell;
		ladBase.to=toCell;
		ladBase.style.position="absolute";
		ladBase.style.transform="rotate("+angle+"deg)";
		ladBase.style.left=(cell_f.offsetLeft+cell_t.offsetLeft)/2 + this.cellHeight/4 +"px";
		ladBase.style.top=(cell_f.offsetTop+cell_t.offsetTop)/2 + this.cellHeight*2/3 - l/2 +"px";
		var part_cnt=Math.floor(l/this.ladderWidth);
		for(var i=1;i<=part_cnt;i++){
			var l_elem=document.createElement('div');
			l_elem.setAttribute('class', 'ladder_part');
			ladBase.appendChild(l_elem);
		}
		this.parent.appendChild(ladBase);
		this.ladders[this.ladders.length]=ladBase;
		return(ladBase);
	},
	renderSnake:function(fromCell,toCell,hex){
		var cell_f=this.cells[fromCell];
		var cell_t=this.cells[toCell];
		var l= Math.sqrt(Math.pow(cell_f.offsetLeft-cell_t.offsetLeft,2) + Math.pow(cell_f.offsetTop-cell_t.offsetTop,2));
		var ang = ((90*7/11)*Math.atan((cell_t.offsetTop-cell_f.offsetTop)/(cell_f.offsetLeft-cell_t.offsetLeft)));
		var angle=(ang > 0 ? 90-ang : 270-ang);
		var snBase= document.createElement('div');
		snBase.setAttribute('class', "snake");
		snBase.from=fromCell;
		snBase.to=toCell;
		snBase.color=hex;
		snBase.style.position="absolute";
		snBase.style.width=l/3 +"px";
		snBase.style.height=l+20  +"px";
		snBase.style.left=(cell_f.offsetLeft+cell_t.offsetLeft)/2 - l/9 +"px";
		snBase.style.top=(cell_f.offsetTop+cell_t.offsetTop)/2 + this.cellHeight/2 - l/2 +"px";

		var cnv=document.createElement('canvas');
		cnv.setAttribute('class', "sncanvas");
		cnv.style.position="absolute";
		cnv.width = l/3;
		cnv.height = l+20;
		this.parent.appendChild(snBase);
		snBase.appendChild(cnv);
		var ctx = cnv.getContext("2d");
		// x will start from mid of width and oscillate between one edge to another
		// y will move linearly from 0 to height
		var snakehead1 = new Image();
		snakehead1.src = '/images/snakehead3.png';
		var snheadlen=40;
		var snheadwid=20;
		var snbodylen=l-snheadlen;
		var rgbColor=this.hexToRgb(hex);
		snakehead1.onload=function(){
			ctx.drawImage(snakehead1,cnv.width/2-snheadwid/2,0,snheadwid,snheadlen);
			var imageData = ctx.getImageData(cnv.width/2-snheadwid/2,0,snheadwid,snheadlen);
			var data = imageData.data;
			for(var p = 0, len = data.length; p < len; p+=4) {
				if(data[p + 0]>200 & data[p + 1]>200 & data[p + 2]>200){
			    data[p + 0] = rgbColor.r;
			    data[p + 1] = rgbColor.g;
			    data[p + 2] = rgbColor.b;
					data[p + 3] = 255;
				}
			}
			ctx.putImageData(imageData, cnv.width/2-snheadwid/2,0);
		}
		var curve=Math.floor(1.5*snbodylen/this.boardHeight)+1;
		var x=cnv.width/2;
		var y=snheadlen;
		ctx.moveTo(x,snheadlen/2);
		ctx.lineTo(x,snheadlen);
		var shift=cnv.width/(curve*2.5);
		var maxIter=180;
		var i=maxIter/(4*curve);
		ctx.quadraticCurveTo(cnv.width/2,(i/maxIter)*snbodylen/5 + snheadlen,Math.sin(2*Math.PI*curve*(i/maxIter))*shift/2 + cnv.width/2,(i/maxIter)*snbodylen/2 + snheadlen);
		var i=maxIter/(2*curve);
		ctx.quadraticCurveTo(cnv.width*(curve==1 ? 8/7 : 4/5),(i/maxIter)*snbodylen-snheadlen/4,x,(i/maxIter)*snbodylen + snheadlen);
		for(i; i<=maxIter; i+=5){
			ctx.lineWidth = (maxIter-i<50 ? (Math.sqrt(maxIter-i))+4 : 7);
			// ctx.lineWidth = 6;
			ctx.shadowBlur = 2;
			ctx.shadowColor = 'rgb(0, 0, 0)';
	    y = (i/maxIter)*snbodylen + snheadlen;
	    x =  Math.sin(2*Math.PI*curve*(i/maxIter))*shift + cnv.width/2;
	    ctx.lineTo(x,y);
			ctx.moveTo(x,y);
	    ctx.stroke();
			ctx.setLineDash([5,1]);
			ctx.strokeStyle = hex;
		}
		snBase.style.transform="rotate("+angle+"deg)";
		this.snakes[this.snakes.length]=snBase;
		return(snBase);
	},
	hexToRgb:function(color){
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			color = color.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
			});
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
			return (result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
			} : {
					r: 0,
					g: 0,
					b: 0
			})
	},
	addPlayer:function(id,data){
		var pl= document.createElement('div');
		pl.name=data.name;
		pl.color=data.color;
		pl.setAttribute('class', "board_player");
		pl.style.position="absolute";
		pl.style.width=this.cellWidth/3 + "px";
		pl.style.height=this.cellHeight/3 + "px";
		pl.style.background=data.color;
		this.players[id]=pl;
		this.parent.appendChild(pl);
		this.movePlayerToCell(id,1);
		return(pl);
	},
	removePlayers:function(){
		for(var k in this.players){
			this.players[k].parentNode.removeChild(this.players[k]);
			delete this.players[k];
		}
	},
	movePlayerToCell:function(id,toCell){
		var pl=this.players[id];
		var pos=Object.keys(this.players).indexOf(id)/Object.keys(this.players).length;
		pl.cell=toCell;
		pl.style.left=this.cells[toCell].offsetLeft + this.cellWidth/6 + (pos*this.cellWidth/2) + "px";
		pl.style.top=this.cells[toCell].offsetTop + this.cellHeight/2 + "px";
		var trig=this.getTrigger(toCell);
		if(trig){
			setTimeout(()=>{
				this.movePlayerToCell(id,trig.to);
			},600);
		}
	},
	start_game:function(pls){
		for(var k in pls){
			this.addPlayer(k,pls[k]);
		}
	},
	sleep:function(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  },
	movePlayerBy:function(id,cnt){
		var pl=this.players[id];
		var newCell=pl.cell+cnt;
		this.movePlayerToCell(id,newCell);
	},
	getTrigger:function(cell){
		for(var i=0; i<this.ladders.length; i++){
			if(this.ladders[i].from==cell){
				return(this.ladders[i]);
			}
		}
		for(var i=0; i<this.snakes.length; i++){
			if(this.snakes[i].from==cell){
				return(this.snakes[i]);
			}
		}
		return(false);
	},
	getConfig:function(){
		return({
			cellEdge:this.cellWidth,
			boardEdge:this.boardWidth,
			ladder:this.ladders,
			snakes:this.snakes
		});
	},
	loadConfig:function(cnf){
		for(i in cnf.ladder){
			this.renderLadder(cnf.ladder[i].from,cnf.ladder[i].to);
		}
		for(i in cnf.snakes){
			this.renderSnake(cnf.snakes[i].from,cnf.snakes[i].to,cnf.snakes[i].color);
		}
	}
}



// module.exports = snakeLadder;
// console.log("Loaded ");
// b=board.renderboard(document.getElementById("board"));
// p1=b.addPlayer("as","#f00");
// b.movePlayerToCell(p1,6);
