var c = document.getElementById('ceq12'),
cx = c.getContext('2d');

function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = c.width*(3/4); // ratio
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

    var filled = document.getElementsByClassName('eq12filled')[0].checked;

    if(!filled){
        // top
        cx.fillStyle = '#F25F5C';
        path(false); // false = positive sqrt

        // bottom
        cx.fillStyle = '#247BA0';
        path(true); // true = negative sqrt
    }else{
        // top
        cx.fillStyle = '#F25F5C';
        cx.beginPath();
        path(false, true); // false = positive sqrt
        cx.closePath();
        cx.fill();

        // bottom
        cx.fillStyle = '#247BA0';
        cx.beginPath();
        path(true, true); // true = negative sqrt
        cx.closePath();
        cx.fill();
    }
}

function draw(){
    var size = document.getElementsByClassName('eq12size')[0].value;
    drawHeart(cx.canvas.width/2,cx.canvas.height/2,cx.canvas.width*(size/1000));
}

setInterval(function(){
    cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
    draw();
},10);