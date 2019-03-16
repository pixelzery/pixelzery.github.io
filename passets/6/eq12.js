var c = document.getElementById('ceq12'),
cx = c.getContext('2d');

function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight*(3/4); // ratio
    draw();
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

/**
* @param x base
* @param m exponent numerator
* @param n exponent denominator
*/

function pow(x,m,n){
    if(x<0 && n%2==0){
        return NaN;
    }
    return Math.pow(Math.sign(x)*(Math.pow(Math.abs(x),1/n)),m);
}


/**
* @param s size
*/
function drawHeart(x,y,s){
    /**
    * @param n negative sqrt version or not
    */
    function f(x,n=false){
        var ret = pow(x,2,3);
        var part = pow(pow(x,4,3)-4*(x*x-1),1,2);
        
        if(n){
            part*=-1;
        }
        
        return (ret+part)/2;
    }

    function path(n=false, lines=false){
        for(var i=-1.2*s+x;i<1.2*s+x;i+=s/2000){
            var id = ((1/s)*i)-(x/s); // i dash: i with transformations applied
            var j = -s*f(id,n)+y;
            if(n){
                j-=s/40; // discontinuity correction
            }
            if(!lines){
                cx.fillRect(i,j,1,1);
            }else{
                cx.lineTo(i,j);
            }
        }
    }

    // options handling
    var filled = document.getElementsByClassName('eq12filled')[0].checked;

    var col1 = document.getElementsByClassName('eq12col1')[0];
    var col2 = document.getElementsByClassName('eq12col2')[0];

    var unicolour = document.getElementsByClassName('eq12unicol')[0].checked;
    col2.disabled = unicolour;

    var topcol = col1.value;
    var botcol = col2.value;
    if(unicolour){
        botcol = topcol;
    }

    // drawing
    // top
    cx.fillStyle = topcol;
    if(!filled){
        path(false);
    }else{
        cx.beginPath();
        path(false,true);
        cx.closePath();
        cx.fill();
    }

    // bottom
    cx.fillStyle = botcol;
    if(!filled){
        path(true);
    }else{
        cx.beginPath();
        path(true,true);
        cx.closePath();
        cx.fill();
    }
}

// drag handling
var hx = cx.canvas.width/2; // heart x coord
var hy = cx.canvas.height/2; // heart y coord

var hx1 = hx;
var hy1 = hy;

var mousex1 = 0;
var mousey1 = 0;
var mouseDown = false;

c.addEventListener("mousedown",function(e){
    mouseDown = true;
    mousex1 = e.clientX;
    mousey1 = e.clientY;
    hx1=hx;
    hy1=hy;
},false);

c.addEventListener("mouseup",function(e){
    mouseDown = false;
},false);

c.addEventListener("mousemove",function(e){
    if(!mouseDown){
        return;
    }

    var dx = e.clientX - mousex1;
    var dy = e.clientY - mousey1;

    if(dy*dy+dx*dx<100){
        // barely moved, disregard
        return;
    }

    hx=hx1+dx;
    hy=hy1+dy;

},false);

function draw(){
    var size = document.getElementsByClassName('eq12size')[0].value;
    drawHeart(hx,hy,cx.canvas.height*(size/1000));
}

setInterval(function(){
    cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
    draw();
},10);