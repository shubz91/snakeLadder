
var dice={
	scene:null,
	cube:null,
	parent:null,
	cubeEdge:40,
	active:false,
	render:function(parent){
		var dibase= document.createElement('div');
		dibase.setAttribute('class', "dice_scene");
		dibase.style.width=this.cubeEdge + "px";
		dibase.style.height=this.cubeEdge + "px";
		var dicube=document.createElement('div');
		dicube.setAttribute('class', "dice_cube");
		var e=this.cubeEdge;
		var diface=[], fctx=[];
		for(var i=1;i<=6;i++){
			diface[i]=document.createElement('div');
			diface[i].style.width=this.cubeEdge + "px";
			diface[i].style.height=this.cubeEdge + "px";
			diface[i].setAttribute('class', "dice_cube_face");
			var cnv=document.createElement('canvas');
			cnv.width = e;
			cnv.height = e;
			cnv.setAttribute('class', "dice_face_canvas");
			// diface[i].canvas=cnv;
			ctx=cnv.getContext('2d');
			ctx.fillStyle = "#fff";
			diface[i].ctx=ctx;
			diface[i].appendChild(cnv);
		}
		// Face 1
		diface[1].ctx.arc(e/2,e/2,e/10,0,2*Math.PI);
		diface[1].ctx.fill();
		// Face 2
		diface[2].ctx.arc(e/3,e/3,e/10,0,2*Math.PI);
		diface[2].ctx.arc(e*2/3,e*2/3,e/10,0,2*Math.PI);
		diface[2].ctx.fill();
		// Face 3
		diface[3].ctx.arc(e/2,e/2,e/10,0,2*Math.PI);
		diface[3].ctx.arc(e/3,e/3,e/10,0,2*Math.PI);
		diface[3].ctx.arc(e*2/3,e*2/3,e/10,0,2*Math.PI);
		diface[3].ctx.fill();
		// Face 4
		diface[4].ctx.arc(e/3,e/3,e/10,0,2*Math.PI);
		diface[4].ctx.moveTo(e/3,e*2/3);
		diface[4].ctx.arc(e/3,e*2/3,e/10,0,2*Math.PI);
		diface[4].ctx.moveTo(e*2/3,e/3);
		diface[4].ctx.arc(e*2/3,e/3,e/10,0,2*Math.PI);
		diface[4].ctx.moveTo(e*2/3,e*2/3);
		diface[4].ctx.arc(e*2/3,e*2/3,e/10,0,2*Math.PI);
		diface[4].ctx.fill();
		// Face 5
		diface[5].ctx.arc(e/3,e/3,e/10,0,2*Math.PI);
		diface[5].ctx.moveTo(e*2/3,e*2/3);
		diface[5].ctx.arc(e*2/3,e*2/3,e/10,0,2*Math.PI);
		diface[5].ctx.moveTo(e*2/3,e/3);
		diface[5].ctx.arc(e*2/3,e/3,e/10,0,2*Math.PI);
		diface[5].ctx.moveTo(e/3,e*2/3);
		diface[5].ctx.arc(e/3,e*2/3,e/10,0,2*Math.PI);
		diface[5].ctx.moveTo(e/2,e/2);
		diface[5].ctx.arc(e/2,e/2,e/10,0,2*Math.PI);
		diface[5].ctx.fill();
		// Face 6
		diface[6].ctx.arc(e/3,e/4,e/10,0,2*Math.PI);
		diface[6].ctx.arc(e/3,e/2,e/10,0,2*Math.PI);
		diface[6].ctx.arc(e/3,e*3/4,e/10,0,2*Math.PI);
		diface[6].ctx.moveTo(e*2/3,e/4);
		diface[6].ctx.arc(e*2/3,e/4,e/10,0,2*Math.PI);
		diface[6].ctx.moveTo(e*2/3,e/2);
		diface[6].ctx.arc(e*2/3,e/2,e/10,0,2*Math.PI);
		diface[6].ctx.moveTo(e*2/3,e*3/4);
		diface[6].ctx.arc(e*2/3,e*3/4,e/10,0,2*Math.PI);
		diface[6].ctx.fill();

		diface[1].style.transform="rotateY(0deg) translateZ(" + e/2 + "px)";
		diface[2].style.transform="rotateY(90deg) translateZ(" + e/2 + "px)";
		diface[3].style.transform="rotateY(180deg) translateZ(" + e/2 + "px)";
		diface[4].style.transform="rotateY(-90deg) translateZ(" + e/2 + "px)";
		diface[5].style.transform="rotateX(90deg) translateZ(" + e/2 + "px)";
		diface[6].style.transform="rotateX(-90deg) translateZ(" + e/2 + "px)";

		for(var i=1;i<=6;i++){
			dicube.appendChild(diface[i]);
		}
		dibase.appendChild(dicube);
		parent.appendChild(dibase);
		parent.dice=dibase;
		this.parent=parent;
		this.cube=dicube;
		this.scene=dibase;
		return(this);
	},
	rollTo:function(num, onComplete, options={}){
		if(this.active==false){
			this.active=true;
			this.cube.classList.add("dice_animate");
			this.scene.classList.add("dice_scene_animate");
			switch(num){
				case 1: this.cube.style.transform="rotateX(0deg) rotateY(0deg) rotateZ(0deg)"; break;
				case 2: this.cube.style.transform="rotateX(0deg) rotateY(-90deg) rotateZ(0deg)"; break;
				case 3: this.cube.style.transform="rotateX(180deg) rotateY(0deg) rotateZ(180deg)"; break;
				case 4: this.cube.style.transform="rotateX(0deg) rotateY(90deg) rotateZ(0deg)"; break;
				case 5: this.cube.style.transform="rotateX(-90deg) rotateY(0deg) rotateZ(0deg)"; break;
				case 6: this.cube.style.transform="rotateX(90deg) rotateY(0deg) rotateZ(0deg)"; break;
			}
			var toX=options.targetPosition.toX;
			var toY=options.targetPosition.toY;
			var toA=options.targetPosition.toA;
			this.scene.style.left=toX + "px";
			this.scene.style.top=toY + "px";
			this.scene.style.transform="rotateZ(" + toA + "deg)";
			setTimeout(()=>{
				this.active=false;
				this.cube.classList.remove("dice_animate");
				this.scene.classList.remove("dice_scene_animate");
				onComplete(options);
			},1000);
		}
		else{
			console.log("Already in Air");
		}
	},
	roll:function(onRoll){
		var newNum=Math.floor(Math.random() * 5.8) + 1;
		this.rollTo(newNum, onRoll);
	}
}
// d=dice.render(document.getElementById("board"));
// document.getElementById("board").dice.onclick=function(){d.roll();};
// function playDice(){
// 	d.roll();
// }
