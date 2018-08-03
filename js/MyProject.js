let aPages = document.querySelectorAll(".page_box")
let aBut = document.querySelectorAll(".circle")
let index = 0
let lastIndex = 0
let liIndex = 0
let liLastindex = 0
let timer = null
let aLi = document.querySelectorAll(".carousel")
let aWrap = document.querySelectorAll(".btn_win")

let scrollFunc = function(e){
    e = e||window.event
    clearTimeout(timer)
    timer = setTimeout(function(){
        if(e.wheelDelta){
            if(e.wheelDelta < 0) change(1)
            else change(2)
        }
        else if(e.detail){ //firefox
            if(e.detail > 0 ) change(1)
            else change(2)
        }
    },500)
}

if(document.addEventListener){  //firefox
    document.addEventListener('DOMMouseScroll',scrollFunc,false)
}

document.onmousewheel = scrollFunc

//依据滚轮向下向上以及鼠标悬停位置选择动画
function change(n){
    aBut[lastIndex].className=''
    aPages[lastIndex].className = ('page_box show')
    switch(n){
    case 1:                     //滚轮向下
        index ++
        index %= aPages.length
        botTotop()
        break
    case 2:                     //滚轮向上
        index --
        if(index < 0 ) index = aPages.length -1
        topTObot()
        break
    case 3:                     //鼠标悬停的位置高于上一次位置
        botTotop()
        break
    case 4:                     //鼠标悬停位置低于上一次位置
        topTObot()
    }
    aBut[index].className='cur'
    setTimeout(function(){
        aPages[lastIndex].classList.remove('show')
        lastIndex = index
    },500)
}

//下往上的动画效果
function botTotop(){
    aPages[index].className = ('page_box show')
    aPages[lastIndex].classList.add('mid_to_top') 
    aPages[index].classList.add('show','bot_to_mid')
}
//上往下的动画效果
function topTObot(){
    aPages[index].className = ('page_box show')
    aPages[lastIndex].classList.add('mid_to_bot')
    aPages[index].classList.add('show','top_to_mid')
}

//鼠标悬停事件
$(document).ready(function(){
    $('.circle').mouseover(function(){
        th = this
        clearTimeout(timer)
        timer = setTimeout(function(){
        index = $(th).index()
        if(index > lastIndex) change(3)
        else if(index < lastIndex) change(4)
        },500)
    })

    $('.select').click(function(){
        index = $(this).index()
        console.log(index)
        if(index > lastIndex) change(3)
        else if(index < lastIndex) change(4)
    })

    $('.btn_win').mouseover(function(){
        th = this
        clearTimeout(timer)
        timer = setTimeout(function(){
        liIndex = $(th).index()
        aLi[liLastindex].classList.remove('show')  //将上一位置li class中的'show'替换为'cur'
        aWrap[liLastindex].classList.remove('wraplight')
        aLi[liLastindex].classList.add('cur')
        aWrap[liLastindex].classList.add('wrap')
        aLi[liIndex].classList.remove('cur')       //将当前位置li class中的'cur'替换为'show'
        aWrap[liIndex].classList.remove('wrap')
        aLi[liIndex].classList.add('show')
        aWrap[liIndex].classList.add('wraplight')
        liLastindex = liIndex
        let len = (liIndex)*152
        $('.ic_line').css('left',len)
        },300)
    })

    $("#nav_more").mouseover(function(){
        $(".more_nav").addClass("show")
    })

    $(".more_nav").mouseleave(function(){
        $(".more_nav").removeClass("show")
    })

    enterAndleave('.part_one','#part_one')
    enterAndleave('.part_two','#part_two')
    enterAndleave('.part_three','#part_three')
    enterAndleave('.four_part_one','#four_part_one')
    enterAndleave('.four_part_two','#four_part_two')
    enterAndleave('.four_part_three','#four_part_three')
    enterAndleave('.four_part_four','#four_part_four')

})

function enterAndleave(para1,para2){
    $(para1).mouseenter(function(){
        $(para2).css('left',0)
    })
    $(para1).mouseleave(function(){
        $(para2).css('left','100%')
    })
}

//canvas实现悬浮动画
let oCanvas = document.getElementById("BubbleCanvas")
let w = window.innerWidth
let h = window.innerHeight
let bcolor = ['#e03636','#edd0be','#25c6fc','#5ed5d1','#ff6e97']
let aBubble =[]
let mx = 0
let my = 0

$(document).ready(function(){
    $('*').mousemove(function(e){
    e = e||window.event
    mx = e.clientX
    my = e.clientY
})
})
oCanvas.height = h
oCanvas.width = w 

window.onresize = function(){
    w = window.innerWidth
    h = window.innerHeight
    oCanvas.height = h
    oCanvas.width = w 
}

let bCanvas = oCanvas.getContext("2d")

function random(min,max){
    return Math.random()*(max-min)+min
}

function Bubble(){}

Bubble.prototype = {
    init:function(){
        this.x = random(0,w)
        this.y = random(0,h)
        this.r = random(2,5)
        this.color = 'rgb(144,145,150)'
        this.vx = random(-1,1)
        this.vy = random(-1,1)
    },
    draw:function(){
        bCanvas.beginPath()
        bCanvas.fillStyle = this.color
        bCanvas.arc(this.x,this.y,this.r,0,Math.PI*2)
        bCanvas.fill()
        for(let i=0;i<aBubble.length; i++){
            if(this.x - mx<120&&this.x-mx>-120&&this.y - my<120&&this.y-my>-120&&getDistance(this,aBubble[i])<120){
                lineBubble(this.x,this.y,aBubble[i].x,aBubble[i].y)             //粒子之间连线
            }
        }
    },
    move:function(){
        this.x += this.vx
        if(this.x-this.r<0||this.x+this.r>w){          //碰撞墙壁反弹
            this.vx = -this.vx
        }
        this.y += this.vy  
        if(this.y-this.r<0||this.y+this.r>h){           //碰撞墙壁反弹
            this.vy = -this.vy
        }
        this.draw()
    }

}


function createBubble(num){            //创建粒子
    for(let i = 0; i < num; i++){
        let bubble = new Bubble()
        bubble.init()
        bubble.draw()
        aBubble.push(bubble)
    }
}

createBubble(200)

setInterval(function(e){           //粒子动画效果实现
    e = e||window.event
    bCanvas.clearRect(0,0,w,h)
    for(let item of aBubble){
        
        item.move() 
    }
},1000/60)

function lineBubble(cx,cy,tx,ty){      //粒子之间连线
    bCanvas.moveTo(cx,cy)
    bCanvas.lineTo(tx,ty)
    bCanvas.strokeStyle = '#FFF'
    bCanvas.stroke()
}

function getDistance(point1,point2){
    return Math.sqrt(Math.pow(point1.x-point2.x,2) + Math.pow(point1.y - point2.y ,2));
}


   




