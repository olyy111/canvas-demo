(function (){
	window.onload = function (){
		var oC = document.getElementById("c");
		var ctx = oC.getContext("2d");
		ctx.lineCap = "round";
		var oTrail = document.getElementById("trail");
		var oClear = document.getElementById("clear");
		var box = document.getElementById("zl");
		box.style.width = window.innerWidth + "px";
		box.style.height = window.innerHeight + "px";
		oClear.flag = false;
		var w = oC.width = window.innerWidth;
		var h = oC.height = window.innerHeight;
		var arr = []; //存放线段对象的数组
		//产生一个一定范围的随机数，来改变speed
		function rand(iMin, iMax){
			return iMin + Math.floor((iMax-iMin)*Math.random())
		}
		function create(mx, my){ 
			var dx = w/2 - mx;
			var dy = h/2 - my;
			var dist  = Math.sqrt(dx*dx + dy*dy);
			var angle = Math.atan2(dy, dx); 
			arr.push({
				/*	x,y:线段的终点
				 * 	lastX, lastY：线段的起点
				 * 	radius:点距离圆心的距离
				 * 	angle:根据三角函数,确定终点的位置（）
				 * 	speed:改变angle,使得终点发生微小偏移
				 * 	size:对speed做出微小改变, 实线段产生参差感
				 * 	color:线段的颜色用于hsla的hue值
				*/	
				x:mx,
				y:my,
				lastX:mx,
				lastY:my,
				radius:dist, 
				angle:angle + Math.PI/2,
				speed:0.015+(rand(5,10)/1000)*(dist/1000),
				size:rand(1,4)/2,
				color:0,
				//调用draw函数,在canvas上面绘制线段
				draw:function (){
					ctx.strokeStyle = "hsla("+ this.color +", 100%, 50%, .5)";
					ctx.lineWidth = this.size;
					ctx.beginPath();
					ctx.moveTo(this.lastX, this.lastY);
					ctx.lineTo(this.x, this.y);
					ctx.stroke();
				}, 
				//调用step，更新数据
				step:function (){
					this.color ++;
					this.color %= 360;
					//绘制线段的关键，每一次调用setp函数，都会更新线段的起点和终点，speed
					//使this.angle每次发生微小改变，线段就有了错开的感觉
					this.lastX = this.x;
					this.lastY = this.y;
					this.x = w/2 + Math.sin(this.angle*-1)*this.radius; 
					this.y = h/2 + Math.cos(this.angle*-1)*this.radius; 
					this.angle += this.speed;
				}
			})
		}
		//初始化放入100个线段对象
		var count = 100;
		while(count--){
			create(w/2, h/2+(count*2)); 
		}
		
		//	按下去的时候生成一个线段对象,每一次move触发也会生成一个对象 
		
		oC.onmousedown = function (ev){
			var ev = ev || event;
			var mx = ev.clientX - oC.offsetLeft;
			var my = ev.clientY - oC.offsetTop;
			create(mx, my);
			oC.onmousemove = function (ev){
				var mx = ev.pageX - oC.offsetLeft; 
				var my = ev.pageY - oC.offsetTop;	
				create(mx, my);
			}
			oC.onmouseup = function (){
				oC.onmousemove = null;
			}
			return false;
		}
		//点击清除按钮会将存放线段对象的数组清空
		oClear.onclick = function (){
			oClear.flag = !oClear.flag;
			if(oClear.flag){
				arr = [];
			}
		}
		//动画
		function loop(){ 
				window.requestAnimationFrame(loop); 
				//当保留痕迹的时候，每一次都在叠加一个半透明，画布大小的黑色块 
				if(oTrail.checked){
					ctx.fillStyle = "rgba(0, 0, 0, .2)";
					ctx.fillRect(0, 0, w, h);
				}else {
				//不保留痕迹，每一次清理画布，重新绘制
					ctx.clearRect(0, 0, w, h);
				}
				//数组里的每一个线段对象,更新三次数据,绘制三段线段
				var m = arr.length;
				for(var i=0;i<m;i++){
					var cir = arr[i];
					for(var j=0;j<3;j++){
						cir.step();
						cir.draw(ctx);
					}
				} 
			
		}
		loop();
	}
})()
