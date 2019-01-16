//游戏开始    定义变量
var count = 10;     //10滴水
var level = 1;      //级别  默认为第一关
var type = 'easy';      //难易度，默认为简单
function Game(){
    this.oBg = $('#bg');
    this.oValue = $('#value');
    this.oTxt = $('#txt');
    this.Mask = $('#mask');
    this.Level = $('#lev');
    this.Next = $('#next');
    this.LevWrap = $('#level');
    this.aImg = [];
    this.timer = null;
    //水滴的图片
    this.imgSrc = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png'];
    //水滴分裂的图片
    this.dropImgSrc = ['img/u.png','img/d.png','img/l.png','img/r.png'];
    this.row = 6;					//水滴行数
    this.col = 6;					//水滴列数
}

//扩展对象的原形链
Game.prototype={
    //初始化
    init:function(){
        var _this = this;
        this.count = count;					//十滴水~~~~~
        this.level = level;
        this.type = type;
        this.over = true;				//水滴是否运动完成;
        this.pass = false;				//是否过关
        this.aImg=$('<img>',this.oBg);      //获取所有的图片
        this.spread();                  //水滴分布
        this.events();                  //添加事件

        //游戏一开始，显示十滴水
        this.oTxt.innerHTML = parseInt(this.count)+'滴水';
        //每滴水，占10px高
        fnMove(this.oValue,{'height':parseInt((this.count/20)*200)});
        fnMove(this.Mask,{'opacity':0});
    },
    spread:function(){
        //存储数据
        var arr = [];
        //简单难度，所以数据随机
        if(this.type == 'easy'){
            for(var i=0;i<36;i++){
                //0-4的随机数   因为图片
                arr.push(Math.floor(Math.random()*5));
            }
        }else if(this.type == 'hand'){      //困难难度
            for(var i=0;i<6-this.level;i++){
                arr.push(4);
            }
            for(var i=0;i<9+this.level;i++){
                arr.push(3);
            }
            for(var i=0;i<11-this.level;i++){
                arr.push(2);
            }
            for(var i=0;i<5+this.level;i++){
                arr.push(1);
            }
            for(var i=31;i<36;i++){
                arr.push(0);
            }
            //随机打乱
            arr.sort(function (a,b){return Math.random()-0.5;});
        }
        //开始循环，生成数据
        for(var n=0;n<36;n++){
            var img = document.createElement('img');
            var div = document.createElement('div');
            img.value = arr[n];
            img.src = this.imgSrc[arr[n]];
            img.style.top = (parseInt(n/this.col)*100+10)+'px';
            img.style.left = ((n%this.col)*100+10) +'px';
            div.appendChild(img);
            this.oBg.appendChild(div);
        }
    },
    //添加事件
    events:function () {
        var _this=this;
        //鼠标移入移出事件
        var imgs=this.oBg.getElementsByTagName("img");
        for(var i=0;i<imgs.length;i++){
            imgs[i].index=i;        //记录一下索引位置
            imgs[i].onmouseover=function(){
                this.style.transform="scale(1.2)";
            };
            imgs[i].onmouseout=function(){
                this.style.transform="scale(1)";
            };
            //核心点，点击事件
            imgs[i].onclick=function(){
                //水减一
                _this.count--;
                count--;
                //每次点了之后判断一下是否过关，或者死亡
                _this.isPass();
                if( this.value>=4 ){
                    //水分裂
                    this.value=0;
                    this.src=_this.imgSrc[this.value];
                    //加水   每点破一滴水
                    _this.count+=0.25;
                    count+=0.25;
                    //移动水滴
                    _this.drop(this);
                }else{
                    //否则，则加水
                    this.value++;
                    this.src=_this.imgSrc[this.value];
                }
                //取整，这样就不会出现0.25的尴尬水点数
                _this.oTxt.innerHTML = parseInt(_this.count)+'滴水';
                fnMove(_this.oValue,{'height':parseInt((_this.count/20)*200)});
            }
        }
    },
    isPass:function(){
        var _this=this;
        if(  !this.timer ) {
            this.timer = setInterval(function (){
                _this.pass = true;
                for(var i=0;i<_this.aImg.length;i++){
                    //判断是否还有水滴，如果有水滴，则意味着没有过关
                    if(_this.aImg[i].value != 0){
                        _this.pass = false;
                    }
                }
                //判断，是过关，还是游戏结束
                if(parseInt( _this.count) < 1 && _this.over){       //等待水滴运动完才结束
                    clearInterval(_this.timer);
                    _this.timer  = null;

                    fnMove(_this.Mask,{'opacity':60});
                    _this.Mask.style.display = 'block';
                    _this.LevWrap.style.display = 'block';
                    fnMove(_this.LevWrap,{opacity:100});
                    _this.Level.innerHTML = '第'+ _this.level +'关失败！';
                    _this.Next.innerHTML = '重来';
                    count = 10;
                    level = 1;
                }
                //如果都为0，则意味着过关
                if(_this.pass){
                    clearInterval(_this.timer);
                    _this.timer  = null;
                    fnMove(_this.Mask,{'opacity':60});
                    _this.Mask.style.display = 'block';
                    _this.LevWrap.style.display = 'block';
                    fnMove(_this.LevWrap,{opacity:100});
                    if(_this.level >=9 && _this.type == 'diff'){
                        _this.Level.innerHTML = '第'+ _this.level +'关通过！';
                        _this.Next.innerHTML = '恭喜你通关了！再来一次！';
                        count = 10;
                        level = 1;
                    }else{
                        _this.Level.innerHTML = '第'+ _this.level +'关通过！';
                        _this.level++;
                        level++;
                        _this.Next.innerHTML = '下一关';
                    }
                }
            },500);
        }

    },
    onclick:function (obj){
        var _this = this;
        switch(obj.value){
            case 0:
                obj.src = _this.imgSrc[1];
                obj.value++;
                break;
            case 1:
                obj.src = _this.imgSrc[2];
                obj.value++;
                break;
            case 2:
                obj.src = _this.imgSrc[3];
                obj.value++;
                break;
            case 3:
                obj.src = _this.imgSrc[4];
                obj.value++;
                break;
            case 4:
                obj.src = _this.imgSrc[0];
                obj.value = 0;
                _this.drop(obj);
                _this.count+=0.25;
                count+=0.25;
                _this.oTxt.innerHTML = parseInt(_this.count)+'滴水';
                fnMove(_this.oValue,{'height':parseInt(_this.count)*10});
                break;
        }
    },
    //创建水滴
    drop:function(obj){     //是哪个水破了
        var oFrag = document.createDocumentFragment();
        var oUp = document.createElement('img');
        var oDown = document.createElement('img');
        var oLeft = document.createElement('img');
        var oRight = document.createElement('img');
        //赋值
        oUp.src = this.dropImgSrc[0];
        oDown.src = this.dropImgSrc[1];
        oLeft.src = this.dropImgSrc[2];
        oRight.src = this.dropImgSrc[3];
        oUp.value = oDown.value = oLeft.value = oRight.value = 0;
        oUp.className = oDown.className = oLeft.className = oRight.className = 'lit';
        oUp.style.left = oDown.style.left= oLeft.style.left= oRight.style.left= obj.offsetLeft+'px';
        oUp.style.top = oDown.style.top = oLeft.style.top = oRight.style.top = obj.offsetTop + 'px';
        oUp.index = oDown.index = oLeft.index = oRight.index = obj.index;

        oFrag.appendChild(oUp);
        oFrag.appendChild(oDown);
        oFrag.appendChild(oLeft);
        oFrag.appendChild(oRight);
        this.oBg.appendChild(oFrag);
        //这里两个方位值就行了，因为上和下，只是一个加，一个减的问题而已，可以通过符号控制
        this.dropMove(oUp,'top',-650);
        this.dropMove(oDown,'top',650);
        this.dropMove(oLeft,'left',-650);
        this.dropMove(oRight,'left',650);
    },
    //让水滴移动
    dropMove:function(obj,attr,target){
        var _this = this;
        var iCur = parseInt(getStyle(obj,attr));    //获取当前的值
        var speed = 0;  // 水滴移动的速度
        var i =0;
        var flag = true;
        obj.timer = setInterval(function (){
            _this.over = false;
            flag = true;
            if(iCur>target){        //意味着是向上，向左移动的
                speed = (iCur-=5);     //向上，向左移动，意味着是减少
                //水滴移动的过程中，还需要判断是否碰撞到了其他的水滴
                if(attr == 'top'){
                    //往上走，一次走一行
                    for(i=obj.index-_this.col;i>=0;i-=_this.col){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
                //往左走，一次走一格
                else if(attr == 'left'){
                    for(i=obj.index-1;i>=obj.index-(obj.index%_this.col);i--){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
            }
            if(iCur<target){
                speed = (iCur+=5);
                if(attr == 'top'){
                    for(i=obj.index+_this.col;i<_this.aImg.length;i+=_this.col){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
                else if(attr == 'left'){
                    for(i=obj.index+1;i<obj.index+(_this.col-(obj.index%_this.col));i++){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
            }
            //改变值
            obj.style[attr] = speed +'px';
            if(speed != target){
                flag = false;
            }
            if(flag){
                if(obj){
                    clearInterval(obj.timer);
                    _this.oBg.removeChild(obj);
                    obj.timer = null;
                }
                _this.over = true;  //水滴移动结束
            }
        },30)
    },
    //碰撞检测
    isCollision:function(obj1,obj2,attr){
        if(obj2.value && Math.abs(parseInt(getStyle(obj2,attr))-parseInt(getStyle(obj1,attr)))<=50){
            this.onclick(obj2);
            clearInterval(obj1.timer);
            this.oBg.removeChild(obj1);
            this.over = true;
        }
    }
};

/* 封装 */
//   ID   父元素标签节点
function $(str,oParent){
    var id = /^#[\w\d]+/;
    var tag = /^<\w{1,}>$/;
    if(id.test(str)){
        return (oParent||document).getElementById(str.substring(1));
    }
    if(tag.test(str)){
        return (oParent||document).getElementsByTagName(str.substring(1,(str.length-1)));
    }
}
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    return getComputedStyle(obj,false)[attr];
}
function getByClass(parent,sClass){
    var aEles = (parent||document).getElementsByTagName('*');
    var re = new RegExp('\\b'+sClass+'\\b');
    var result = [];
    for(var i=0; i<aEles.length; i++){
        if( re.test(aEles[i].className) ){
            result.push(aEles[i]);
        }
    }
    return result;
}
function fnMove(obj,json,fn){					//页面运动效果
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var flag=true;
        for(var attr in json){
            var iCur = 0;
            if( attr == 'opacity'){
                iCur = Math.round(getStyle(obj,attr)*100);
            }else{
                iCur = parseInt(getStyle(obj,attr));
            }
            var iSpeed = (json[attr]-iCur)/8;
            iSpeed = iSpeed >0 ? Math.ceil(iSpeed):Math.floor(iSpeed);

            if(iCur != json[attr]){
                flag=false;
            }
            if( attr == 'opacity'){
                obj.style.filter = 'alpha(opacity:'+(iCur+iSpeed)+')';
                obj.style.opacity = (iCur + iSpeed)/100;
            }else{
                obj.style[attr]=iCur+iSpeed+'px';
            }
        }
        if(flag){
            clearInterval(obj.timer);
            obj.timer = null;
            if(fn){
                fn();
            }
        }
    },30)
}