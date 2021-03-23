/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var Alge={//代数表达式 本质上是对象
    /*从常数（自然数 整数 小数 分数（有理数、有限小数和无限循环小数） 无理数（无限不循环小数：无理代数数、超越数） 复数（实数、虚数）） 到 含变量（单、多）和运算（运算符、函数）的式子 
    
    
    所有代数式：
        属性：dom、vars（变量列表）、D（定义域，默认是实数域）
        需支持返回公式显示（html、mathml、LaTex）、
                简化表达式（降幂排序、字母表排序、字典排序）、
                因式分解形式（默认）、
                展开式、
                赋值计算
    
    变量：可指代各种形式的代数：常数、多项式、函数式、矩阵、向量、张量、命题、集合、置换、关系，
        属性：变量列表，取值范围
    
    
    常量：
        需支持返回不同精度、小数位、四舍五入或向上向下取整等
    
        复数，需支持返回三种形式（代数、三角、指数）
    
    */
        build:{//直接构造
            js:function(s){//从JS表达式中构造，得到整数或有限位浮点小数（精度不可控，完全依赖JS），即有理数
                var n=''+eval(s),sim=FracReduct(n);
                return {dom:DC+'num>'+sim+dc,vars:[],D:'Q', simp:'self', type:'Num', t:'Alge'};
            },
            obj:function(exp,dom,vars,D,type){//直接构造对象
                /*
                    exp 以Unicode输入的公式
                    dom lamda表达式（运算符都是前缀）字符串
                    vars 变量列表数组
                    D 各个变量的定义域（集合数组，与vars中变量顺序保持一一对应）
                        {1,3,4} 有限集
                        
                        
                        N 自然数 = Z0非负整数
                        Z 整数 Z-0非零整数  +Z正整数 -Z负整数 Z0非负整数 -Z0非正整数
                        D 小数 
                        P 素数 P<k 小于k的素数 Pk 第k个素数
                        Q 有理数 +Q正有理数 -Q负有理数
                        R 实数 +R正实数 -R负实数
                        C 复数 Ci纯虚数 
                        M 矩阵环 Mm,n m×n阶矩阵 Mn n阶方阵
                        V 向量
                        S 集合
                        
                        
                        ZP 整系数多项式环
                        1P 首1整系数多项式环 （首项系数为1）
                        QP 有理系数多项式环
                        
                        
                        常量：
                        I 单位矩阵
                        O 零矩阵（字母O，不是数字0）
                        e 自然常数：是超越数
                        π 圆周率：是超越数
                        i 虚数单位
                        γ 欧拉常数：有理数/无理数 未知
                        Φ 黄金分割 (√5-1)/2 ≈ 0.618  其倒数 是(√5+1)/2 ≈ 1.618 
                            满足恒等式：
                                Φ²+Φ-1=0
                                Φ = 1-Φ² = 1/(1+Φ) = 1/Φ-1 = (1-Φ)/Φ
                                1/Φ = 1+Φ = Φ/(1-Φ)
                                1-Φ = Φ² = Φ/(1+Φ) = (1-Φ²)² = (1+Φ)²(1-Φ)² = (1+Φ)²Φ⁴
    
                        ∞ 无穷大 
                        ∅ 空集
                        ⋯ 
                        ⋮
                        ⋰
                        ⋱
                        ⁞
    JS中内置的数学无理数常数
    
    Math.E
    Math.LN10
    Math.LN2
    Math.LOG10E
    Math.LOG2E
    Math.PI
    Math.SQRT1_2
    Math.SQRT2
                    simp 最简dom（用于存储和判断，表达式等价）：self表示：原dom已经是最简形式
                    
                    type 指定表达式结果的类型：
                        常数Num
                        矩阵Mtrx
                        集合Set
                        向量Vect
                        多项式Polynm
                        命题Prop
                        关系Rlt
                        置换Perm
                */
                var d=dom?dom:exp2dom(exp);
                
                var A={dom:d,vars:vars,D:D, simp:'', type:type, t:'Alge'};
                return A
            }
        },
        is:{//布尔逻辑
            b1:{//一元关系
                "C":function(A){return !isNaN(+A) || !A.vars || A.simp && Alge.is.b1.C(A.simp)},//是否为数学常数 等价于
    /*
                    数字（可以是字符串形式，字符串表达式只能表示0、正负整数、有限小数）
                    无变量的表达式 A.vars==''
                    有变量，但简化式是常量 sin(x+1-x)
    
    
                    复数表达式 a+bi
    */
                    
                "inN":function(A){return +Alge.is.b2('=',A,Alge.build.I(A.length))},//是否为自然数
    
            },
            b2:{//二元关系
                "=":function(A,B){
                    return +(A.length==B.length && A[0].length==B[0].length && Alge.toStr(A,'txt')==Alge.toStr(B,'txt'))
                },
                "≠":function(A,B){
                    return +!Alge.is.b2['='](A,B)
                },
    
                "⊆":function(A,B){//定义表达式的包含关系：前者在后者中
                    var m=A.length,n=A[0].length;
                    if(A.length!=B.length || A[0].length!=B[0].length){return 0}
                    for(var i=0;i<m;i++){
                        var Ai=A[i],Bi=B[i];
                        for(var j=0;j<n;j++){
                            var Aij=Ai[j];
                            if(Aij && Aij!=Bi[j]){
                                return 0
                            }
                        }
                    }
                    return 1
                },
                "⊂":function(A,B){return +(Alge.is.b2['⊆'](A,B) && !Alge.is.b2['='](A,B))},
                "⊇":function(A,B){return +Alge.is.b2['⊆'](B,A)},
                "⊃":function(A,B){return +(Alge.is.b2['⊆'](B,A) && !Alge.is.b2['='](A,B))},
                "⊄":function(A,B){return +(!Alge.is.b2['⊂'](A,B))},
                "⊅":function(A,B){return +(!Alge.is.b2['⊃'](A,B))},
                "⊈":function(A,B){return +(!Alge.is.b2['⊆'](A,B))},
                "⊉":function(A,B){return +(!Alge.is.b2['⊇'](A,B))},
            }
        },
        fromStr:function(s,p){//p指定类型，不同数学对象环境，满足不同的运算律
            var d=exp2dom(s);//函数来自 exp.js，将来需整合，删除exp.js
            
    
    
            return A
        },
    
        toStr:function(A,typ){//转成文本
            /* type输出类型
                txt纯文本、html（显示）、mathml、LaTex
            */
    
            var type=typ||'html',txt=type=='txt',r=[];
    
    
        },
        opr1:function(op,A){
    //一元运算
            var C=[];
    
            if(op=='simp'){//化简
                var dm='dom'+(new Date()).getTime();
                $('#dom').append('<div id='+dm+'>'+A.dom+dc);
                var d=$('#'+dm);
                
                
                
                A.simp=s;
                return A
            }
        },
        opr2:function(op,A,B){
    //二元运算
    /*
        同类对象之间运算，返回对象或其他值
        关系、逻辑型运算，返回逻辑值
        
    */
            var C=[];
    
            if(op=='^'){//幂
                return Alge.pow(A,B)
            }
        }
    
    };
/*
 * Copyright by zzllrr. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var HOME=Hs+'sites.google.com/site/zzllrrMather', GMAIL='mailto:zzllrr@gmail.com?subject=zzllrr%20Mather',

qrAli=Hs+'qr.alipay.com/', qrqq=Hs+'i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&a=1&u=122618817&ac=ZZLLRR&n=%E5%B0%8F%E4%B9%90%E7%AC%91%E4%BA%86&f=wallet',
qrwx='wxp://',
qrs={
	'V2aliPay':qrAli+'FKX0950616RXMKGXATWY52',
	'V2qqPay':qrqq.replace('ZZLLRR','A5692108EF5009E2392BE97029C628474D54816FED899014CB4EEA2D271CF645'),
	'V2weixinPay':qrwx+'f2f0KhK_RnSDrozki2q4gmcvsFMS0DQJPVas',
	
	'weixinZQR':H+'weixin.qq.com/r/uXUFCg3EKzNUhxxpnyCd'
},
qrJPG=function(t,d,wh,noReplace){
    $(d).empty();
    var w=wh||150;
    var qrcode001 = new QRCode($(d)[0], {
        text:t,
        width : w,
        height : w
    });
    if(!noReplace){
        setTimeout(function(){
            var x=$(d).children('canvas')[0];
            if(x){
                x=x.toDataURL('image/jpeg',1);
                $(d).html('<img width='+w+' src="'+x+'" />');
    
            }
    
        },2000);
    }
    
},
VRlib=ZLR('aframe-','animation-component particle-system-component extras.ocean gradient-sky'),
VRlibjs={
    'aframe-gradient-sky':'gradientsky'
},
ARlib='',
ARlibjs={
},
gitmd=Hs+'raw.githubusercontent.com/zzllrr/mather/master/',
enwiki=function(x,time,txt){return href(Hs+'en.wikipedia.org/wiki/'+x,txt?txt:fn1(x.replace(/_/g,' ')),'wikipedia" class="wikipedia')+(time?', '+time:'')},
enwiki0=function(x,time){return href(Hs+'en.wikipedia.org/wiki/'+fn0(x.replace(/ /g,'_')),x,'wikipedia" class="wikipedia')+(time?', '+time:'')},
github=function(x,githubio,text){return href(git(x,githubio),(text||githubio||x).replace(/(.+\/){2}/,'$1').replace(/-/g,' '),'Github" class="github')},

tooltip={
},
caps,

hasdoodle=isdoodle,// || ishome || isdoc || iswiki || issolve,

oHTML=function(x,notMD,elem,cb){
    var o=$(elem||'#oHTML').hide();

    //o.html(notMD?x:replaceNodeInner(x,'MD', md2html));
    //console.log('oHTML',x);
    if(notMD){
        var t=replaceNodeInner(x,'i18', gM,1);
        t=replaceNodeInner(t,'i18n', gM,1);
        t=replaceNodeInner(t,'en', GM,1);
        o.html(t)
        //o.html(replaceNodeInner(x,'i18', gM,1));

    }else{
        o.html(replaceNodeInner(x,'MD', md2html,1));
    }
    /*
    $(ZLR('i18 i18n en').join(',')).each(function(){
        all2html(this.nodeName,$(this).text(),this);
    });
*/
    $(ZLR(Mele+' '+Meles+' '+Mele2).join(',')).each(function(){
        all2html(this.nodeName,$(this).text(),this);
    });
    setTimeout(function(){
        $('#splash').remove();
        o.find('.wiki th.bds').click();
        o.find('.katex0').each(function(){
            if($(this).parents('.wiki').length<1){
                var t=$(this).text();
                katex.render(kx(t), this, {
                    throwOnError: true,
                    displayMode: $(this).is('div,td'),
                    
					trust:true
                });
            }

        });
        o.fadeIn();
        $('#panel').fadeIn();
        if(cb){
            setTimeout(cb,100)
        }
    },100);

    o.find('math[alttext]').each(function(){// 替换mathml 为 katex
        //$(this).replaceWith()
        //console.log($(this).attr('alttext'));
        katex.render($(this).attr('alttext'), this, {
            throwOnError: false,
            displayMode: false,
            trust:true
        });
    });
},
loadHTML=function (x) {
   var o=H_o(),tp=(o['type']||'HTML').toUpperCase(), s=o['src'], u=o['qa']||o['q'],refreshheads=function(){
    $('.mkdnhead:contains(#)').each(function(i){
        var me=$(this), v='_'+i;
        me.attr('href', me.attr('href')+v);
        me.next().attr('href', function(x,y){return y+v});
        me.parent().attr('id', function(x,y){return y+v});
    });
   },cb=function(){
        refreshheads()
   },t='';
   if(u){
       var A=Arrf(fn1,u.replace(/#.*/,'').split('/')),w=x;
       //console.log(A);

       t=w[A.slice(-1)[0]] || w[A.slice(-2).join('/')]  || w[A.slice(-2).reverse().join('/')] || w[A.join('/')] || w[u];
//console.log(x,t);
        titleRe(gM(A.slice(-1)[0])+' - '+gM('zzllrr Mather'));
        if(/#.+/.test(u)){
            cb=function(){
                refreshheads();
                var hs=$('.mkdnhead[href=#'+u.replace(/.+#/,'')+']');
                hs.parents('details').attr('open','');
                setTimeout(function(){

                    hs.click();
                },2000);
            }
        }
   }
   if(s){
       $.ajax({type:'get',url: s, success:function(x){
           oHTML(x,1,'',cb)
       }, error:function(){oHTML(t,1,'',cb)}
       })
   }else if(t){
       oHTML(t,1,'',cb);

   }else{
       oHTML(DCtv('abscenter hue rem3',imgSRC+'logo.jpg" />'))//gM('zzllrr Mather')
   }


}, fn0URL=function(t){
    return t.replace(/&/g,fn0).replace(/\n/g,fn0).replace(/ /g,fn0).replace(/=/g,fn0)
    
}, OHiframe=function(x,o,fullscr,fullURL){
    var oC=$('#oContent'), zM=$('#zMather'), src=(fullURL||H_o(x+'.html',o)).replace(/ /g,fn0),
        his=ZLR((L.iframeHistory||'').trim()), hisi=his.indexOf(src);
    if(!his[0]){
        his.shift()
    }
    if(hisi){
        if(hisi>0){
            his.splice(hisi,1);
        }
        his.unshift(src);
        his=his.slice(0,30);
        L.iframeHistory=his.join(' ');
        reloadHistory('iframe');
    }
    

    OH('<iframe src="'+src+'" width="'+(x=='solve'?45:98)+'%" height="'+
        Math.max($(window).height()-(oC.length?oC.position().top:0)+   (fullscr && zM.length?zM.height():0)-20,200)+
        'px" class="resize bd0"></iframe>')

}, toggler=function(A){
    return Arrf(function(x){return SCtv('toggler',x)}, A)
    
}, toggler2=function(A){
    return Arrf(function(xy){return '【'+Arrf(function(x){return SCtv('toggler',x)}, 
        /[,，、]/.test(xy)?xy.split(/[,，、]/):[xy.substr(0,xy.length/2), xy.substr(xy.length/2)]).join('')+'】'}, A)
};

L.removeItem('translation');

var oH,navhead={},navheadThen={},


concept0='Number Sequence Polynomial Vector Tensor Matrix Permutation Relation Function Proposition Logic Algebra Set Geometry Graph',
concepts={
	'Number':ZLR('Positive Natural Prime Rational Irrational Radical Transcendental Real Imaginary Complex'),
	'Sequence':ZLR('Arithmetic Geometric Harmonic'),
	'Algebra':ZLR('Group Ring Field Lattice'),
	
	'Relation':['Equivalence','Partial Order','Cover','Chain'],
	
	'Geometry':ZLR('Shape Surface Solid')
},

question0='Equation Inequation Limit',
questions={
	
},


solve={}, graphic={}, show={}, wiki={},
solves={}, graphics={}, shows={}, wikis={},
solveThen={}, graphicThen={}, wikiThen={},


teaching={},academic={}, technology={}, science={}, culture={}, explore={},
teachings={},academics={}, technologys={}, sciences={}, cultures={}, explores={},
teachingThen={}, academicThen={}, technologyThen={}, scienceThen={}, cultureThen={}, exploreThen={}


/*
	


单数名k，存储执行函数( 供Go按钮调用,例如solve ) 或字符串结果(例如navhead)
复数名ks，存储目录结构，默认第一个键值index存储一级目录索引
单数名kThen, 界面工具加载后的执行函数

键有歧义时，用路径URI


tooltip[tool].k，存储提示工具栏	键使用路径URI



		 		
*/



;


function sel(uriA,x,p,pp,ppp){
	var ux=(p?(pp?(ppp?ppp+'/':'')+pp+'/':'')+p+'/':'')+x;
	for(var i=0,l=uriA.length;i<l;i++){
		var u=uriA[i];
		if(ux==u || u.indexOf(ux)>=0){
			return 1
		}
	}
	return 0
}

function questionA(t){
	var A=[];
	$('#'+t+'Ground .task.seled').each(function(){
		A.push(furi($(this))[0].join('/'))
    });
    if(A.length<1){
        $('#'+t+'Ground .level.seled').each(function(){
            A.push(furi($(this))[0].join('/'));
            return false
            
        });
    }
	return Arrf(fn0,A)
}





$.each(lang,function(i,v){//扁平化处理i18n内部引用 @数字 @[a-z] @{键}	  ➡️ 值
	$.each(v,function(ii,vv){
		if(/@/.test(vv)){
			var f=function(I,V){
				var y=I.replace(/@([a-z]|\d+)/ig,function(x){return V[x.substr(1)]})
				.replace(/@\{[^\}]+\}/g,function(x){return V[x.substr(2).split('}')[0]]});
				return /@/.test(y)?f(y,V):y
			};
			v[ii]=f(vv,v);
				consolelog(v[ii]);
		}
	});
});
lang['zh_tw']=jSon(zh2big(jSoff(lang['zh_cn'])));
if(!i18n || H_o().lang !=L.lang){i18n=lang[H_o().lang||L.lang||'zh_cn']}



var MfS=function(x,typ){return Mtrx.fromStr(x,typ)},
	PfS=function(x){return Perm.fromStr(x.replace(/&.+/,''))},
	PtS=function(x,typ){return Perm.toStr(x,typ)};
	
function dayOrNight(){
	var isnight=L.night=='true';
	//$('#oHTML svg').css({"background-color":(isnight?'gainsboro':'transparent')});
    //$('#oHTML svg').css({"border":(isnight?'gainsboro solid 1px':'none')});

	if(isnight){
		$('#oHTML svg *[stroke=black]').attr('stroke','gainsboro');
        $('#oHTML svg *[fill=black]').attr('fill','gainsboro');
        $('#Caps textarea').filter(function(){var c=$(this).css('color');return c=='rgb(0, 0, 0)' || /white/.test(c)}).css('color','gainsboro');
        /*
        L.canvasCode='';
        L.legoCode='';
        */
        //scrn('eraser');
       // console.log($('#caps').length);
        setTimeout(function(){
            //console.log($('#caps').length);
            if(caps){

                caps.repaint(1);
            }
        },1000);

	}else{
		$('#oHTML svg *[stroke=gainsboro]').attr('stroke','black');	
        $('#oHTML svg *[fill=gainsboro]').attr('fill','black');	
        $('#allEraser').click();
        $('#color'+(isnight?3:0)).click();

        $('#Caps textarea').filter(function(){var c=$(this).css('color');return c=='rgb(220, 220, 220)' || /gainsboro/.test(c)}).css('color','black');
        
	}
	
}

function copy2clipboard(t){

    toolTip('<input type=text value="" />');
    
	$('#bar input').eq(0).val(t);
    $('#bar input').select();
    document.execCommand('copy', false, null);
    $('#bar input').remove();
    toolTip(gM('copiedtip'));
}


function mathsimp(x,tostr){
    if(math){
        var o=math.simplify(math.parse(x));
        return tostr?(tostr==1?math2str(o):Mfn.fromStr(o.toString()).toStr()):o
    }
    return x
}

function math2str(x,tex,opt){
    var o=opt||mathjsOutputOpt();
    //console.log(o);
    /*
    if(tex && o.handler===null){
        o.handler=function(i){
            console.log(i); //i是对象，不是字符串
            return i.replace(/\\exp (.+)/g,'e^{$1}')
        };
    }
    */
   if(tex){
       var f=function(t){
           //console.log(t);
            return '\\displaystyle{}'+t.replace(/.cdot/g,'')
                .replace(/\\left\( *([a-z])\\right\)/ig,' $1')
                .replace(/\\left\(([^\)]+)\\right\) *\/ *\\left\(([^\)]+)\\right\) *(\^\{[^\}]+\})?/g,'\\frac{$1}{$2$3}')
               
       };
   }
    return tex?f(x.toTex(o)):pp(x.toString(o))
}
function mathjsOutputOpt(par,imp,f){
    return {
        parenthesis: par||'auto',    // parenthesis option   keep|auto|all
        handler: f||null,   // handler to change the output
        implicit: (imp?'show':'hide')       // how to treat implicit multiplication     hide|show
    }
}

var rng2=function(t,neg){
	var A=(t.trim()||'0,0').split(/[^-\d\.]/);
	A[0]=+A[0];
	if(A.length==1){
		return [neg?-A[0]:A[0], A[0]]
	}
	A[1]=+A[1];
	return A

},rng4=function(t){
	var A=(t.trim()||'0;0').split(';');
	if(A.length==1){
		return [rng2(A[0],1),rng2(A[0],1)]
	}
	return [rng2(A[0],1),rng2(A[1],1)]

},color2rgba=function(o,isjQ){
	var me=$(o);
	if(isjQ && me.prev('label').find(':checkbox').not(':checked').length){
		return ''
	}
	if(isjQ && me.nextAll('label').find(':checked').length || !isjQ && o.grad){//渐变
		var grad=isjQ?Arrf(Number,me.nextAll('.grad').val().split(' ')):o.grad,
			color=isjQ?me.nextAll('.gradcolor').val().split(','):o.color;

		//var grd=ctx['create'+(grad.length==6?'Radial':'Linear')+'Gradient'].apply(null,grad);	Illegal invocation
		if(!/^[46]$/.test(grad.length)){//非法渐变
			return '';
		}
		
		var grd=grad.length==6?ctx.createRadialGradient(grad[0],grad[1],grad[2],grad[3],grad[4],grad[5]):ctx.createLinearGradient(grad[0],grad[1],grad[2],grad[3]);
		for(var i=0;i<color.length;i++){
			var c=color[i].split(' ');
		//	console.log(c);
			grd.addColorStop(+c[0],c[1]);
		}
		return grd
	}
	//console.log(me.val(),me.next().next().val(),hex2rgba(me.val(),me.next().next().val()),isjQ);
	return isjQ?hex2rgba(me.val(),me.next().next().val()):(/rgba/i.test(o.color)?o.color:hex2rgba(o.color,o.opa||1))

},shadow=function(obj,t){
	var	color3=color2rgba(obj?t.color3:$(t).find('.shadow .color'),!obj);

	if(color3){
		ctx.shadowBlur=+(obj?t.color3.blur:$(t).find('.shadow .blur').val())||0;
		var os=(obj?t.color3.offset:$(t).find('.shadow .offset').val())||'';
		if(os){
			ctx.shadowOffsetX=+os.split(' ')[0];
			ctx.shadowOffsetY=+os.split(' ')[1];
		}
		ctx.shadowColor=color3;
	}else{
		ctx.shadowBlur=0;
//		ctx.shadowColor=null;
		ctx.shadowOffsetX=0;
		ctx.shadowOffsetY=0;
	}
},atan=function(dy,dx){
	//return (n<0 || n==0 && 1/n < 0)?Math.PI+n:n
	if(dx==0){
		return dy<0?Math.PI*3/2:Math.PI/2
	}
	if(dy==0){
		return dx<0?Math.PI:0
	}
	if(dx>0 && dy>0){return Math.atan(dy/dx)}
	if(dx<0 && dy>0){return Math.atan(dy/dx)+Math.PI}
	if(dx<0 && dy<0){return Math.atan(dy/dx)+Math.PI}
	if(dx>0 && dy<0){return Math.atan(dy/dx)+Math.PI*2}
};


function all2html(type,V,dom){
    var w=$(dom), v=V||w.html(), vA=v.split('\n'), iv=(type||'').toUpperCase(),ivl=iv.toUpperCase();
    //console.log(V,type);
    if(/UNICODE_MATH|UM/.test(iv)){
        var Dp=$('.level.seled[data-i=Display]'),l=Dp.length;
        if(l){
        //	Dp.next().find('.task').click();
        //	$('#go').click();
        }else{
            w.html(asc2unicode(v).split('\n').join(br));
        }
        
    }else if(/MARKDOWN|MD/.test(iv)){
        w.html(md2html(v));
       // console.log(v);

    }else if(/JAVASCRIPT|JS/.test(iv)){
        try{
            w.html(Arrfc([eval,XML.decode],vA).join(br))
        }catch(e){
            w.html(v)
        }
    }else if(/LATEX|LA|LT|LX|TEX|LTX|IL/.test(iv)){
        var x=sub2n(v,1);
        try{
            x=kx(x)
        }catch(e){

        }
        katex.render(x, w[0], {
            throwOnError: false,
            displayMode: iv!='IL',
            trust:true
        });

    }else if(/Lego/i.test(iv)){
  
        try{
            var id=ivl+Random(12,1)+Time.now5();
            if(!w.is('canvas')){
                w.html('<canvas id='+id+' width='+(w.attr('width')||300)+' height='+(w.attr('height')||300)+'></canvas>');

            }
            //var C=new ctt($('#input0Preview canvas'),300,300), c=C.ctx;
            //var C=new ctt(cvs,300,300), c=C.ctx;
            var C=$('#'+id)[0];// work!
            c=C.getContext('2d');
            //var C=w.children()[0];    fail!
           // console.log(XML.decode(v));


         //  console.log(v);

            eval(XML.decode(v));

            w.addClass('lego');
        }catch(e){
            console.log(e);
            w.html(v)
        }

    }else if(/Rough/i.test(iv)){// Rough Canvas
  
        try{
            var id=ivl+Random(12,1)+Time.now5();
            if(!w.is('canvas')){
                w.html('<canvas id='+id+' width='+(w.attr('width')||300)+' height='+(w.attr('height')||300)+'></canvas>');

            }

            var C=$('#'+id)[0];// work!

            c=C.getContext('2d');
            eval(XML.decode(v));

            w.addClass('rough canvas');
        }catch(e){
            console.log(e);
            w.html(v)
        }

    }else if(/RF/i.test(iv)){// Rough SVG
  
        try{
            var id=ivl+Random(12,1)+Time.now5();
            if(!w.is('svg')){
                w.html('<svg id='+id+' xmlns="'+xmlns+'" xmlns:xlink="'+xmlnsxlink+'" version="1.1" width='+(w.attr('width')||300)+' height='+(w.attr('height')||300)+'></svg>');

            }

            var C=$('#'+id)[0], rc=rough.svg(C);

            eval(XML.decode(v));
            /*
            var t=eval(XML.decode(v));
            C.appendChild(t);
            */

/*      貌似draw只支持canvas
            var C=$('#'+id)[0], rs=rough.svg(C), rc=rs.generator;
            var t=eval(XML.decode(v));
            rs.draw(t);
*/
            w.addClass('rough svg');
        }catch(e){
            console.log(e);
            w.html(v)
        }

    }else if(/ZD/.test(iv)){
  
        try{
            var id=ivl+Random(12,1)+Time.now5();
            if(!w.is('canvas')){
                w.html('<canvas id='+id+' width='+(w.attr('width')||300)+' height='+(w.attr('height')||300)+'></canvas>');

            }
            //var C=new ctt($('#input0Preview canvas'),300,300), c=C.ctx;
            //var C=new ctt(cvs,300,300), c=C.ctx;
            var C=$('#'+id)[0];// work!
            //var C=w.children()[0];    fail!
   


         //  console.log(v);
            var xdv=XML.decode(v);
            eval(xdv);

            w.addClass('zdog').attr('data-code',xdv);
        }catch(e){
            console.log(e);
            w.html(v)
        }

/*
    }else if(/D2/.test(iv)){//JXG

        try{
            var id=ivl+Random(12,1)+Time.now5();
            if(!w.is('div')){
                w.html('<div id='+id+' style="width:'+(w.attr('width')||300)+'px;height:'+(w.attr('height')||300)+'px" class="jxgbox resize"></div>');

            }
            var C=$('#'+id)[0];
            eval(v);
        }catch(e){
            console.log(e);
            w.html(v)
        }
*/

    }else if(/^SV/.test(iv)){
        if(!w.is('svg')){
            w.html('<svg xmlns="'+xmlns+'" xmlns:xlink="'+xmlnsxlink+'" version="1.1">'+v+'</svg>');
        }else{

        }
        
    }else if(/CANVAS|CV/.test(iv)){
        try{
            var cvs=w;
            if(!w.is('canvas')){
                w.html(XML.wrapE('canvas'));
                cvs=w.children();
            }
            //var C=new ctt($('#input0Preview canvas'),300,300), c=C.ctx;
            var C=new ctt(cvs,300,300), c=C.ctx;
            eval(XML.decode(v));
        }catch(e){
            w.html(v)
        }
        
    }else if(iv=='YAML'){
        var x=jsyaml.load(v);
        w.html(XML.wrapE('pre',XML.wrapE('code',jSoff(x))));//txa

    }else if(/I18/.test(iv)){

        w.text(gM(v));

    }else if(/EN/i.test(iv)){
        //w.text(function(i,v){return gM(v)});
        w.text(GM(v,'','en'));

    }else if(/ECHARTS|EC/.test(iv)){
//consolelog(v);
        w.empty();
        Graphic.drawSVG('echarts',v,'',w);
    
    }else if(iv=='CODE'){
        w.html(XML.wrapE('pre',XML.wrapE('code',XML.encode(v))));

    }else if(/HTML|SLIDE/.test(iv)){
        w.html(v);
        w.find(ZLR(Mele+' '+Meles+' '+Mele2).join(',')).each(function(){
            all2html(this.nodeName,$(this).text(),this);
        });
    }else if(/[TC]SV/.test(iv)){
        if(iv=='TSV' || v.indexOf('\t')>-1){
            vA=Arrf(function(x){return x.split('\t')},vA);
        }else{
            vA=Arrf(csv2A,vA);
        }
        //console.log(vA);
        w.html(Table(vA.slice(0,1),vA.slice(1)));


    }else{// if(iv=='HTML')
        w.html(v);
    }
//console.log(w.html());
    w.find('math[alttext]').each(function(){// 替换mathml 为 katex
        //$(this).replaceWith()
        //console.log($(this).attr('alttext'));
        katex.render($(this).attr('alttext'), this, {
            throwOnError: false,
            displayMode: false,
            trust:true
        });
    });

}

function toolTip(s){
	var ts = (L.timeids_tip || '').trim();
	if (ts) {
		Arrfc([clearTimeout, Number], ZLR(ts));
	}
	$('#bar').html(SCtv('toolTip',s));
	L.timeids_tip=setTimeout(function(){
		$('#bar').empty();
    },3000);
}


function zdogs(w,h,s0,rotatexyz){
    return `
C.setAttribute('spinning',true);C.width=${w||100};C.height=${h||100};
let isSpinning = true;

let zo = new Zdog.Illustration({
	element: C,
	zoom: 1,
	dragRotate: true,

	onDragStart: function() {
		isSpinning = false;
	},
	onDragMove: function(p,mx,my) {
	},
	onDragEnd: function() {
		isSpinning = true;
	},
});

${s0||`let zz=new Zdog.Box({
    width:40,height:40,depth:40,

    leftFace: '${RandomColor()}',
    rightFace: '${RandomColor()}',
    frontFace: '${RandomColor()}',
    rearFace: '${RandomColor()}',
    topFace: '${RandomColor()}',
    bottomFace: '${RandomColor()}',

    color: '${RandomColor()}',

    addTo: zo,
    stroke: false,
});`}

function animate() {
    ${rotatexyz===0?'':`
	if ( isSpinning && C.getAttribute('spinning')=='true') {
		zo.rotate.${rotatexyz||'y'} = (zo.rotate.${rotatexyz||'y'}+0.03) % (Math.PI*2);

    }
    `}
	zo.updateRenderGraph();
	requestAnimationFrame( animate );
}
animate();
			
`
}

function reloadfavStar(){
    var fav=ZLR((L['favStar']||'').trim());
    if(!fav[0]){
        fav.shift()
    }
    if(fav[0]){

            $('#favStars').html(ol(Arrf(function(x){
                var o=H_o(x),txt=o.t||x;
                if(/\?q=/.test(txt)){
                    txt=gM(Arrf(fn1,txt.replace(/.+\?q=/,'').split('/'))).join('/')
                }
                return itv('favStar','star_border')+href(x,txt ,o.qa||'')+itv('clrfavStar','clear')
            },fav)));

        
    }else{

        $('#favStars').empty();

    }

}

function reloadHistory(t){
    var p=t||'tool',his=ZLR((L[p+'History']||'').trim());
    if(!his[0]){
        his.shift()
    }
    if(his[0]){
        if(p=='tool'){
            $('#toolHistory').html(itv('','history')+Arrf(function(x){
                var A=x.split('/'),x0=A[0], x1=A[1], fx1=fn1(x1), fx1A=fx1.split('/'), y=fx1A[fx1A.length-1];
                return SCtv('toolHistory hotk" title="'+fx1+'" data-path="'+fx1+'" data-by="'+x0,
                hanziCoreRe.test(y)?y:(/^[a-z -]+$/i.test(y) || /[a-z ]{2,}[^a-z ][a-z ]{2,}/i.test(y)?gM(y):zx(y))) 
            },his).join('')+itv('clrHistory','delete_forever'));
        }else{
            $('#iframeHistory').html(ol(Arrf(function(x){
                var o=H_o(x),txt=o.t||x;
                if(/\?q=/.test(txt)){
                    txt=gM(Arrf(fn1,txt.replace(/.+\?q=/,'').split('/'))).join('/')
                }
                return itv('iframeHistory','access_time')+href(x,txt ,o.qa||'')+itv('addfavStar" title="'+gM('Add to Favourite')+'" href="'+x,'star_border')+itv('clriframeHistory','clear')
            },his)));
        }
        
    }else{

        $('#'+p+'History').empty();

    }

}


$(function(){
    var d=document.title;
    titleRe(gM(d)+' - '+gM('zzllrr Mather'));

    d=d.toLowerCase();
    if(/solve|graphic|wiki|teaching|academic|explore|technology|science|culture/.test(d)){
        //console.log(d,eval(d));   //editor doodle about api
        loadHTML(eval(d));
    }

    $('#panel').prepend('<div id=menu>'+
        DCtv('abscenter" hidden id="QRCODE')+
        '<span id=bar>&nbsp;'+sc+
        itv('" id="zMatherOn','keyboard_arrow_up')+
        (ishome?'':itv('" id=home tip="Home','home'))+itv('" id=searchC tip="Search Content','search')+
        
        
        (hasdoodle?itv('" id=svgs tip="Doodle" hotkey="Esc','palette'):'')+

        itv('" tip=Widget id="Widget','widgets')+
        itv('" id=night tip="Night','brightness_3')+

        itv('" id="langu','language')+
        '<select id=lang hidden>'+Options(ZLR('lang en zh_cn zh_tw')).join('')+'</select>'+

        

        (isdoc?itv('" id=padding tip="Padding','compare_arrows')+itv('" id=print tip="Print','print'):'')+

        (ishome?'':itv('" id=qrcode tip="Share','share'))+
        itv('" id=SplitWindow tip="Split Window','burst_mode')+
        
    dc+DCtv('" id=Widgets hidden for="Widget',
        '<span id=Geogebra>'+
        '<svg id=Geogebragraphing tip="GGB Graphing" viewBox="0 0 24 24"><defs><style>.ggb_c1{fill:#99f}.ggb_c2{fill:#333}.ggb_c3{fill:#666}</style></defs><title>Graphing</title><path d="M2.5 21.5C4.13 10.64 7.89.56 12 12s7.76 1.36 9.51-9.5" fill="none" stroke="#666" stroke-miterlimit="10" stroke-width="1.3"></path><circle class="ggb_c1" cx="8.5" cy="6.5" r="2.5"></circle><circle class="ggb_c1" cx="15.5" cy="17.5" r="2.5"></circle><path class="ggb_c2" d="M15.5 15a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4.5a2 2 0 1 1 2-2 2 2 0 0 1-2 2zM8.5 4A2.5 2.5 0 1 0 11 6.5 2.5 2.5 0 0 0 8.5 4zm0 4.5a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path></svg>'+
        '<svg id=Geogebrageometry tip="GGB Geometry" viewBox="0 0 24 24"><title>Geometry</title><path class="ggb_c1" d="M14 4.02L20.27 15H7.72L14 4.02z"></path><circle class="ggb_c1" cx="9" cy="15" r="6"></circle><path class="ggb_c3" d="M14 2L6 16h16zm0 2l6.27 11H7.72z"></path><path class="ggb_c3" d="M9 8a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm0 13a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"></path><path d="M15 15H7.72L11 9.33A6 6 0 0 1 15 15z" fill="#6161ff"></path><path d="M11.47 8.46a6.93 6.93 0 0 0-1-.3L6 16h9.92a6.92 6.92 0 0 0-4.46-7.54zM7.72 15L11 9.33A6 6 0 0 1 15 15z" class="ggb_c2"></path></svg>'+
        '<svg id=Geogebracalculator tip="GGB Calculator" viewBox="0 0 512 512"><defs><clipPath id="scientific_svg__clip-path"><rect x="27" y="27" width="458" height="458" rx="44.76" fill="none"></rect></clipPath></defs><title>Scientific Calculator</title><g clip-path="url(#scientific_svg__clip-path)"><path class="ggb_c1" d="M0 331.1h512V475H0z"></path><path class="ggb_c3" d="M0-.77h512v513.54H0zm467 82.89C467 59.41 453.59 46 430.88 46H82.12C59.41 46 46 59.41 46 82.12v348.76C46 453.59 59.41 467 82.12 467h348.76c22.71 0 36.12-13.41 36.12-36.12z"></path><path class="ggb_c3" d="M0 173.67h512v18H0zM0 320.33h512v18H0z"></path></g><path class="ggb_c3" d="M159.5 99.66v-38h19v38h38.25v19.68H178.5v38h-19v-38h-38.25V99.66zM121.2 246.08h95.6v19.67h-95.6z"></path><path d="M216.8 371.88v19.67h-95.6v-19.67zm0 41.4V433h-95.6v-19.72z" class="ggb_c2"></path></svg>'+
        '<svg id=Geogebra3d tip="GGB 3D" viewBox="0 0 24 24"><title>3D</title><path class="ggb_c2" d="M8.47 21L2 17.57 10.83 3 8.47 21z"></path><path class="ggb_c3" d="M22 18.38L8.47 21l2.36-18L22 18.38z"></path><path fill="#6161ff" d="M7.64 19.37l-4.19-2.18 5.67-9.37-1.48 11.55z"></path><path class="ggb_c1" d="M20.18 17.69L9.66 19.73l1.82-14.06 8.7 12.02z"></path></svg>'+
        '<svg id=Geogebranotes tip="GGB Notes" viewBox="0 0 512 512"><title>Notes</title><defs><clipPath id="notes_svg__clip-path"><rect x="27" y="27" width="458" height="458" rx="44.76" fill="none"></rect></clipPath></defs><title>Notes</title><g clip-path="url(#notes_svg__clip-path)"><path class="ggb_c1" d="M0 331.1h512V475H0z"></path><path class="ggb_c3" d="M0-.77h512v513.54H0zm467 82.89C467 59.41 453.59 46 430.88 46H82.12C59.41 46 46 59.41 46 82.12v348.76C46 453.59 59.41 467 82.12 467h348.76c22.71 0 36.12-13.41 36.12-36.12z"></path><path class="ggb_c3" d="M0 320.33h512v18H0z"></path></g></svg>'+
        '<svg id=Geogebraclassic tip="GGB Classic" viewBox="0 0 512 512"><title>GGB Logo</title><g stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="#666" stroke-width="33.34" d="M432.345 250.876c0 87.31-75.98 158.088-169.705 158.088-93.726 0-169.706-70.778-169.706-158.088 0-87.31 75.98-158.09 169.706-158.09 93.725 0 169.705 70.78 169.705 158.09z" transform="matrix(1.0156 .01389 -.20152 .9924 42.924 8.75)"></path><path class="ggb_c1" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -225.59 242.796)"></path><path class="ggb_c1" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -151.12 72.004)"></path><path class="ggb_c1" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -421.29 266.574)"></path><path class="ggb_c1" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -483.632 100.362)"></path><path class="ggb_c1" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -329.052 -23.649)"></path></g></svg>'+
        '<svg id=Geogebracas tip="GGB CAS" viewBox="0 0 512 512"><title>CAS</title><defs><path d="M485 440.24c0 24.72-20.04 44.76-44.76 44.76H71.76C47.04 485 27 464.96 27 440.24V71.76C27 47.04 47.04 27 71.76 27h368.48C464.96 27 485 47.04 485 71.76v368.48z" id="H"/></defs><clipPath id="I"><use height="512" width="512" xlink:href="#H" overflow="visible"/></clipPath><g clip-path="url(#I)"><path class="ggb_c1" d="M0 0h150v512H0z"/><path d="M360.488 347.088h-56.055l-39.307-62.55-36.572 62.55h-52.637l62.55-93.652-56.397-81.348h55.713l34.52 51.61 29.737-51.61h52.295l-55.03 81.348 61.183 93.652zM512 239.947H376.174V219.38H512v20.567zM512 301H376.174v-20.895H512V301z" class="ggb_c3"/></g></svg>'+
        '<svg id=Geogebraprobability tip="GGB Probability" viewBox="0 0 512 512"><title>Probability</title><defs><path d="M485 440.24c0 24.72-20.04 44.76-44.76 44.76H71.76C47.04 485 27 464.96 27 440.24V71.76C27 47.04 47.04 27 71.76 27h368.48C464.96 27 485 47.04 485 71.76v368.48z" id="m"/></defs><clipPath id="n"><use height="512" width="512" xlink:href="#m" overflow="visible"/></clipPath><g clip-path="url(#n)"><path d="M155.564 446.51h200.873V180.524C310.847 108.107 281.302 73.24 256 73.24c-25.302 0-54.847 34.867-100.436 107.283V446.51z" class="ggb_c1"/><path d="M609 422.968s-130.97 21.405-207.06-147.7C325.85 106.16 287.184 65.487 256 65.487c-31.183 0-69.85 40.672-145.94 209.778S-97 422.968-97 422.968" fill="none" stroke="#666" stroke-width="26" stroke-miterlimit="10"/><path fill="none" stroke="#333" stroke-width="26" stroke-miterlimit="10" d="M-97 446.51h706"/></g></svg>'+
        '<svg id=Geogebraspreadsheet tip="GGB Spreadsheet" viewBox="0 0 20 20"><title>Spreadsheet</title><defs><path id="a" d="M485 440.24c0 24.72-20.04 44.76-44.76 44.76H71.76C47.04 485 27 464.96 27 440.24V71.76C27 47.04 47.04 27 71.76 27h368.48C464.96 27 485 47.04 485 71.76v368.48z"/></defs><clipPath id="b"><use width="512" height="512" overflow="visible" xlink:href="#a"/></clipPath><g transform="translate(-.016 .148) scale(.03906)" clip-path="url(#b)" class="ggb_c1"><path d="M26 26h460v130H26z"/><path d="M26 26h130v460H26z"/></g><path transform="translate(-.016 .148) scale(.03906)" clip-path="url(#b)" d="M157.504 19.333h24v186.333h-24z" fill="#fff"/><path transform="translate(-.016 .148) scale(.03906)" clip-path="url(#b)" d="M20 155.504h139.766v24H20zm0 156.328h140.766v24H20zM310.934 21h24v139.765h-24z" fill="#fff"/><path transform="translate(-.016 .148) scale(.03906)" clip-path="url(#b)" d="M156 311.832h330v24H156z" class="ggb_c3"/><path transform="translate(-.016 .148) scale(.03906)" clip-path="url(#b)" d="M310.934 156.252h24V486h-24z" class="ggb_c3"/><path d="M11.292 5.532h-.506l-.372-.92h-1.68l-.376.92h-.493l1.444-3.43h.52zM10.215 4.21L9.56 2.624 8.92 4.21h1.295zM4.13 11.61h-.44V8.746c-.178.124-.426.256-.745.395v-.394c.134-.082.263-.174.384-.275.118-.098.203-.173.252-.224.05-.05.075-.075.075-.072h.474v3.437zm.445 6.062H2.5v-.44c.404-.45.724-.81.96-1.074.238-.265.404-.47.5-.614.094-.144.14-.27.14-.38 0-.207-.04-.36-.12-.457-.08-.1-.216-.148-.405-.148-.167 0-.293.048-.377.144-.083.097-.138.25-.163.46h-.483c.05-.666.39-1 1.023-1 .313 0 .558.096.735.287.177.19.265.407.265.65 0 .073-.006.142-.018.203-.013.063-.033.128-.06.198-.03.07-.067.142-.115.216-.048.075-.108.16-.18.254-.074.095-.917 1.053-1.016 1.164-.1.112 1.543-.05 1.412.098" class="ggb_c2"/></svg>'+
        sc+
        '<span id=Desmos>'+
        '<svg id=DesmosGraphingCalculator tip="Desmos Graphing" viewBox="0 0 24 24"><defs><style>.des_c1{fill:#007090}.des_c2{fill:#333}.des_c3{fill:#666}</style></defs><title>Graphing</title><path d="M2.5 21.5C4.13 10.64 7.89.56 12 12s7.76 1.36 9.51-9.5" fill="none" stroke="#666" stroke-miterlimit="10" stroke-width="1.3"></path><circle class="des_c1" cx="8.5" cy="6.5" r="2.5"></circle><circle class="des_c1" cx="15.5" cy="17.5" r="2.5"></circle><path class="des_c2" d="M15.5 15a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4.5a2 2 0 1 1 2-2 2 2 0 0 1-2 2zM8.5 4A2.5 2.5 0 1 0 11 6.5 2.5 2.5 0 0 0 8.5 4zm0 4.5a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path></svg>'+
        '<svg id=DesmosGeometry tip="Desmos Geometry" viewBox="0 0 24 24">title>Geometry</title><path class="des_c1" d="M14 4.02L20.27 15H7.72L14 4.02z"></path><circle class="des_c1" cx="9" cy="15" r="6"></circle><path class="des_c3" d="M14 2L6 16h16zm0 2l6.27 11H7.72z"></path><path class="des_c3" d="M9 8a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm0 13a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"></path><path d="M15 15H7.72L11 9.33A6 6 0 0 1 15 15z" fill="green"></path><path d="M11.47 8.46a6.93 6.93 0 0 0-1-.3L6 16h9.92a6.92 6.92 0 0 0-4.46-7.54zM7.72 15L11 9.33A6 6 0 0 1 15 15z" class="des_c2"></path></svg>'+

        '<svg id=DesmosFourFunctionCalculator tip="Desmos Function Calculator" viewBox="0 0 512 512"><g clip-path="url(#I)"><path class="des_c1" d="M0 0h150v512H0z"/><path d="M360.488 347.088h-56.055l-39.307-62.55-36.572 62.55h-52.637l62.55-93.652-56.397-81.348h55.713l34.52 51.61 29.737-51.61h52.295l-55.03 81.348 61.183 93.652zM512 239.947H376.174V219.38H512v20.567zM512 301H376.174v-20.895H512V301z" class="des_c3"/></g></svg>'+
        '<svg id=DesmosScientificCalculator tip="Desmos Scientific Calculator" viewBox="0 0 512 512"><title>Scientific Calculator</title><g clip-path="url(#scientific_svg__clip-path)"><path class="des_c1" d="M0 331.1h512V475H0z"></path><path class="des_c3" d="M0-.77h512v513.54H0zm467 82.89C467 59.41 453.59 46 430.88 46H82.12C59.41 46 46 59.41 46 82.12v348.76C46 453.59 59.41 467 82.12 467h348.76c22.71 0 36.12-13.41 36.12-36.12z"></path><path class="des_c3" d="M0 173.67h512v18H0zM0 320.33h512v18H0z"></path></g><path class="des_c3" d="M159.5 99.66v-38h19v38h38.25v19.68H178.5v38h-19v-38h-38.25V99.66zM121.2 246.08h95.6v19.67h-95.6z"></path><path d="M216.8 371.88v19.67h-95.6v-19.67zm0 41.4V433h-95.6v-19.72z" class="des_c2"></path></svg>'+
      
      
      
        sc+
        itv('" id=DoodleOpen tip="Doodle','palette')+
        itv('" id=WidgetOpen tip="Launch','launch')+
        itv('" id=WidgetOn tip="Close','close')+


        '<div id=widget>'+dc
    )+DCtv('" id=searchContent hidden for="searchC',
        '<input type=search id=searchCbox placeholder="'+gM('Search Content')+'" title="'+gM('Support Regexp')+'" /><div id=searchCresult>'+dc+
        detail(itv('','folder_special')+gM('Favourite')+itv('addfavStar" title="'+gM('Add to Favourite'),'star_border'), '<div id=favStars>'+dc,'','id=favStar'))
    );
    $(':button').not('[value]').val(function(){return gM(this.id)});
    $('.Clear').attr('tip','Clear');
    $('.mi-span,i18').text(function(i,v){return gM(v)});
    
    $('#menu #home').on('click',function(){
        if (self != top) {

            top.location.href=self.location.href.replace(/\/[a-z0-9]+\.html.*/i,'/index.html')

        }else{

            open(loch.replace(/\/[a-z0-9]+\.html.*/i,'/index.html'))
        }
    });

    $('#Widgets > span svg').on('click',function(){
        var me=$(this),pa=me.parent(),pid=pa.attr('id'),
            Id=this.id,id=Id.substr(pid.length),tog=me.is('.toggle');
        if(tog){
            me.removeAttr('class');
            $('#widget').fadeOut();
        }else{
            me.attr('class','toggle');
            if(($('#widget').children().attr('id')||'').replace(/\d+$/,'')==Id){
                $('#widget').fadeIn()
            }else{
                var tid=Id+Time.now5()+(Math.random()+'').substr(2);
                $('#widget').show().html('<div id='+tid+'>'+dc);
                $('#widget').children().width($(window).width()).height($(window).height()*0.8);

                if(pid=='Geogebra'){
                    var ggbApp = new GGBApplet({
                        "appName": id,
                        "width": $(window).width(), 
                        "height": $(window).height()*0.8, 
                        "showToolBar": true,
                        "showAlgebraInput": true,
                        "showMenuBar": true 
                    }, true);ggbApp.inject(tid);

                }else if(pid=='Desmos'){
    
                    var calculator = Desmos[id]($('#'+tid)[0]);
                    /*
                    calculator.updateSettings && 
                    calculator.updateSettings({
                        language: (H_o().lang||L.lang||'zh_cn').replace(/_.+/,function(x){
                            return '-'+x.substr(1).toUpperCase()
                        }) 
                    });
                    */

                    //calculator.setExpression({id:'graph1', latex:'y=x^2'});

                }

            }
            
        }
        me.siblings('.toggle').removeAttr('class');
        me.parent().siblings().find('.toggle').removeAttr('class');

    });
  
    $('#WidgetOn').on('click',function(){
        $('#Widgets svg.toggle').click();
        $('#Widgets .toggle').click();
        $('#Widget.toggle').click();
    });


    $('#WidgetOpen').on('click',function(){
        open('widget.html')
    });
    $('#DoodleOpen').on('click',function(){
        open('doodle.html')
    });

    $('#SplitWindow').on('click',function(e){
        var l=location.href, shft=e.shiftKey || $('#Shift').is('.seled'), frm=$('body > .sideframe');
        if(frm.length){
            frm.toggle();
            if(frm.is(':visible')){
                $('#zMatherOn').click()
            }
        }else{

            $('body').append('<iframe src="'+(/doodle/.test(l)?'editor':(/editor/.test(l) && shft?'index':'doodle'))+
                '.html" width="50%" height="99%" class="resize sideframe bds" style="position:absolute;right:3rem;top:0rem"></iframe>');
            $('#zMatherOn').click()
        }
        $('#WidgetOn').click()
    });


    $('#padding').on('click',function(){
        var o=$('#oHTML'),p=o.is('.pd20p'),pl=o.is('.pd20pl'),pr=o.is('.pd20pr'),p20=o.is('.pd20');
        o.removeClass('pd20p pd20pl pd20pr pd20');
        //pd20p → pd20pl → pd20pr → pd20 → pd20p
        if(p){
            o.addClass('pd20pl');
        }else if(pl){
            o.addClass('pd20pr');
        }else if(pr){
            o.addClass('pd20');
        }else if(p20){
            o.addClass('pd20p');
        }
    });
    $('#print').on('click',function(){
        window.print();
    });
    $('#night').on('click',function(){
        var me=$(this),isnight=me.text()=='brightness_3';
        me.html(isnight?'wb_sunny':'brightness_3');
        $('body').toggleClass('night',isnight).toggleClass('day',!isnight);

        //$('html').toggleClass('darkmode', !isnight);

        L.night=isnight;

        dayOrNight();
    });

    if(L.night=='true'){
        $('#night').html('brightness_3').click();
    }


    $('#lang').on('change',function(){
		var v=$(this).val();
		L.lang=v;
		
		location.href=H_o('',{'lang':v})
    });
    

	$('#go').on('click',function(){
        var tool=$('[name=tool]:checked').val(), i0=$('#input0'),i1=$('#input1'),i0v=i0.val().trim(),i1v=i1.val().trim(),o={},
        his=L.toolHistory?ZLR(L.toolHistory):[], hisi;

		
		$('#svgs.toggle').click();
		if(tool=='solve'){
			if(!i0v){
				var v=$('.inputTip .eg').last().attr('data-eg')||'';
				i0.val(v);
				i0v=v;
            }
            o={ s:$('#solveGround .ground0 .seled').attr('data-i').toLowerCase(),
                t:fn0URL(i0v),
                qa:questionA('solve').join(';')
            };
//console.log(fn0URL(i0v), i0v,o);
            OHiframe('solve',o);

		}
		if(tool=='graphic'){

            
            if(!i0v){
				var v=$('.inputTip .eg').last().attr('data-eg')||'';
				i0.val(v);
				i0v=v;
            }


            o={ s:$('#graphicGround .ground0 .seled').attr('data-i').toLowerCase(),
                t:fn0URL(i0v),
                qa:questionA('graphic').join(';')
            };


            OHiframe('graphic',o);

			
		}
		if(tool=='show'){
			var s=$('#showGround .ground0 .level.seled').attr('data-i'), ss=s.toLowerCase();
			if(ss=='image'){
				ss='slide';
				o.type='image';
			}

            OHiframe(ss,o);
		}

        if(/solve|graphic/.test(tool)){
            var hisPath=tool+'/'+questionA(tool);
            hisi=his.indexOf(hisPath);
    
            if(hisi){
                if(hisi>0){
                    his.splice(hisi,1);
                }
                his.unshift(hisPath);
                his=his.slice(0,20);
                L.toolHistory=his.join(' ');
                reloadHistory('tool');
            }
        }

        
    });
    
	$('body').on('click','#menu > svg,#Widget,#svgs,#langu,#qrcode,#searchC',function(){
		var me=$(this),id=this.id,pa=me.parent(),tog=me.toggleClass('toggle').is('.toggle');
        if(me.is('svg')){
            tog=!tog;
            if(tog){
                me.attr('class','toggle');
                $('#zMatherOn:contains(up)').click();
                $('#iTextFold.seled').click();
            }else{
                me.removeAttr('class')
            }
        }
        if(id=='Widget'){
            if(tog){
                
                $('#zMatherOn:contains(up)').click();
                $('#iTextFold.seled').click();
            }
        }
		if(id=='svgs'){

			$('#zzllrrCanvas').removeClass('toggle').nextAll().hide();
			if(tog){
                $('#zMatherOn:contains(up)').click();
                $('#iTextFold.seled').click();
                $('#Caps').fadeIn();
                $('#caps').css('z-index',1);

			}else{
				if(!$('#tileTool').is(':visible')){
					$('#tileTool').fadeIn();
					me.addClass('toggle');

                    tog=true;
                    $('#caps').css('z-index',1);

				}else{
                    $('#zMatherOn:contains(down)').click();
                    
                    $('#caps').css('z-index',-1);
                }
                
			}

        }

        if(id=='langu'){
            $('#lang').toggle(tog)
        }

        if(id=='searchC'){
            $('#searchCbox').change()
        }

        if(id=='qrcode'){
            me.removeClass('toggle');

            var t;

            if($('#show').prop('checked')){
                losh.t=fn0($('#showGround .editorText').val().substr(0,50));
            }else{
                if($('#input0Type').length){
                    losh.type=$('#input0Type').val();
                    losh.t=fn0($('#input0').val());
                }
            }

            if(ishome){
                var x=$('#oHTML iframe').attr('src')||'';//location.href

                if(x){
                    t=x

                }else{

                    var grd=$('#'+$('[name=tool]:checked').attr('id')+'Ground');
                    losh.uri=[
                        grd.find('.ground0 .seled').index(),
                        grd.find('.ground1 .seled').index(),
                        grd.find('.ground2 .seled').index(),
                    ].join('.');
                    grd.find('.tasks .seled').each(function(i){
                        losh.uri+=(i?'+':'.')+i;
                    });
                }
            }
            if(!(ishome && x)){
                t=H_o('',losh)
            }

           // console.log(losh);
            var m=Math.ceil(Math.min($(window).width(),$(window).height())*0.4);
            //console.log(t,t.length);
            qrJPG(t,'#QRCODE',m);
            
            $('#QRCODE').fadeToggle();
            setTimeout(function(){$('#zMatherOn:contains(down)').click();},500);
            copy2clipboard(t);

            if(pa.is('#iTextOpt')){
                return
            }
        }


        me.siblings('.toggle').removeClass('toggle');
        me.siblings('svg').removeAttr('class');
		pa.nextAll('[for='+id+']').toggle(tog);
        pa.nextAll().not('[for='+id+']').hide();
        
	}).on('mousewheel','.zdog canvas',function(e){
        var d=Math.sign(e.originalEvent.wheelDelta), k=e.keyCode, shft=e.shiftKey || $('#Shift').is('.seled'), ctrl=e.ctrlKey, alt=e.altKey, 
            me=$(this), pa=me.parent(), c=pa.attr('data-code')||'';
        if(d){
            var c2=c.replace(/zoom: \d\.?\d*/,function(x){return 'zoom: '+
                +Math.max(0.1,Math.min(2,(+x.split(' ')[1]+(shft?0.01:(ctrl?0.5:(k==91||k==92?1:0.1)))*d))).toFixed(2)});
            pa.attr('data-code',c2).html(c2);
			all2html('zdog','',pa);
            e.stopPropagation()
        }
	}).on('click','.zdog canvas, .lego canvas, .rough canvas',function(e){
        L.drawShapeNow=$(this).parent().attr('id')

	}).on('click','.toggler',function(e){
        $(this).toggleClass('toggle')



    }).on('click','.clrHistory',function(e){

        if($(this).parents('#searchCresult').length){
            L.iframeHistory='';
            reloadHistory('iframe');
        }else{
            L.toolHistory='';
            reloadHistory('tool');
        }
        
    }).on('click','.toolHistory',function(e){
        var me=$(this), tool=me.attr('data-by');
        $('#home').click();
        if($('#toolnav > label:visible').length>1){
            $('#'+tool).click()
        }else if(L.tool!=tool){
            $('#'+L.tool).click();
            $('#'+tool).click()
        }
        $('.task.seled').click();
        loadToolPath(me.attr('data-path'), tool);
        
    }).on('click','.iframeHistory, .favStar',function(e){
        
        OHiframe('','','',$(this).next().attr('href'));
        
    }).on('click','.clriframeHistory',function(e){
        
        var s=$(this).prev().attr('href'), his=ZLR(L.iframeHistory), hisi=his.indexOf(s);
        his.splice(hisi,1);

        L.iframeHistory=his.join(' ');
        $(this).parent().remove()
        
   }).on('click','.addfavStar',function(e){
        var t=$(this).attr('href') || $('#oHTML iframe').attr('src') || location.pathname.replace(/.+\//,'')+location.search;
        var fav=ZLR(L.favStar ||'');
        if(fav.indexOf(t)<0){
            L.favStar=((L.favStar ||'')+' '+t).trim();
            reloadfavStar();
        }
       
        
    }).on('click','.clrfavStar',function(e){
        
        var s=$(this).prev().attr('href'), fav=ZLR(L.favStar), i=fav.indexOf(s);
        fav.splice(i,1);

        L.favStar=fav.join(' ');
        $(this).parent().remove()
        
    });



    $('#searchCbox').on('change',function(){
        var t=$(this).val().trim(), l=loch.split('?')[0].split('.html')[0].replace(/.+\//,'')||'index', A=[], el, Anmax=0, isreg=/^\/.+\//.test(t),b=[];
        $('#searchCresult').html(detail(itv('','access_time')+gM('History')+itv('clrHistory','delete_forever'), '<div id=iframeHistory>'+dc));
        reloadHistory('iframe');

        if(t.length<1){          
            return 0
        }

        if(l=='editor' || l=='index' || l=='doodle'){
            el={STRUC:jSoff(STRUC),SBSFn:jSoff(SBSFn),SBS:jSoff(SBS), FUNCS:jSoff(FUNCS), SBSFUN:SBSFUN, H5Colors:H5Colors, i18n:jSoff(i18n), fontHan:fontHan};


        }else if(l=='graphic'){
            el={Index:jSoff(graphics)};

        }else if(l=='solve'){
            el={Index:jSoff(solves)};
        }else{
            el=eval(l);
        }
        


        //console.log(el);
        $.each(el,function(k,v){
            if(isreg){
                var BA=split(v,eval(t)), a=BA[1];

                if(isStr(BA)){
                    return 1
                }
               // console.log(BA);
                b=BA[0];

            }else{

                var a=v.split(t);
                b=[t];
            }
            
            var n=a.length;

            if(n>1){
                Anmax=Math.max(Anmax,n);
                A.push([n,k,
                    Arrf(function(x){
                        var xl=x.length;
                        return XML.encode(xl>30?x.substr(0,15)+'...'+x.substr(-15):x)},a),
                    (isreg?b:copyA(t,n-1))
                    
                ]);
            }
        });
      //  console.log(A);
        if(A.length<1){
            $('#searchCresult').prepend(mark(gM('Not Found'),'Sorry'));
            return 1;
        }
        sort2(A);
        A.reverse();
        //console.log(b);
        var m=mark(XML.encode(b[0]),gM('Snippet'));
        $('#searchCresult').prepend(ol(Arrf(function(x){var t=l+'.html?q='+x[1];
            return inhref(t,meter(parseInt(x[0]*100/Anmax),'"0" tip="'+gM('Search Score')+'"')+gM(x[1]))+
            itv('addfavStar" title="'+gM('Add to Favourite')+'" href="'+t,'star_border')+
            (x[2].length>2?detail(x[2].slice(0,2).join(m),
                DCtv('searchCresult',Arrf(function(y,i){return (isreg?mark(XML.encode(x[3][i+1]),gM('Snippet')):m)+x[2][i+2]},x[2].slice(2)).join(br))   //x[2][i+1]+
            ):DCtv('searchCresult',x[2].join(m)))},A)));
    });
    $('#searchContent').on('dblclick','.searchCresult',function(){
        var me=$(this), a=me.prev('a').attr('href')||me.parent().prev('a').attr('href');
        //OHiframe(a.split('?')[0].split('.html')[0].replace(/.+\//,''), {q:a.split('.html?q=')[1]}, 1);
        OHiframe('','','',a)
    });


	$('#zMatherHide').on('click',function(){
		$('#zMatherOn').click();
	});
    

	$('#zMatherOn').on('click',function(){
		var me=$(this), isup=/up/.test(me.text());
		$('#nav').toggle();
		me.add('#zMatherHide').text('keyboard_arrow_'+(isup?'down':'up'));

		me.nextAll().not('select').toggle(!isup);

        if(isup){
            me.nextAll('select').hide();
            $('#langu').removeClass('toggle')
        }else{
            $('#search,#toolHistory').hide();
            $('.subhead').show();
        }
        $('#zMatherOn2').toggle(!isup);
        if($('#svgs').is('.toggle')){
            $('#svgs').click()
        }
    });
    
	

    if(!ishome){
        $('#zMatherOn').click()
    }

    if(ishome){
        $('#splash').hide().nextAll().fadeIn();
    }

    $('#QRCODE').on('click',function(){
        //$('#qrcode').click()
        $(this).fadeOut();
    });

    
    if(hasdoodle){
        $(window).resize(function(){
            caps.repaint();
        });
        
        $(document).scroll( function() {
            caps.repaint();
        });
	
    }

    $('body').on('keydown',function(e){
		var k=e.keyCode, shft=e.shiftKey || $('#Shift').is('.seled'), ctrl=e.ctrlKey, alt=e.altKey, act=document.activeElement, 
		node=act.tagName.toLowerCase(), me=$(act),id=me.attr('id')||'';
//console.log(k,node);

		if(node=='input' && k==13){
			/*if(id=='input0'){
				$('#go').click();
			}
			*/
			return

		}
		if(node=='textarea'){
            if(ctrl && k==69){act.value='';return false}
        }
    }).on('dblclick', function(e){
        var eos=e.originalEvent.srcElement, act=eos.tagName;



        if($(eos).parent('[id^=Zdog_],.zdog').length){
            //console.log(e,act,act.id);
            $(eos).attr('spinning',function(i,v){return v!='true'});
            e.stopPropagation();
        }else{

            if(hasdoodle){
                $('#caps ~ canvas').remove();
            
            }else if(/body/i.test(act)){
                location.href='index.html';
                //history.back()
            }
        }




	}).on('click','#launchCap',function(){

		open('doodle.html');

	}).on('click','#launch',function(){
		var x=$('#oHTML iframe').attr('src')||location.href, lv=$('.launch:visible');
		if(lv.length){
			lv.click()
		}else if(x){
			open(x);
		}else{
			$('#go').click()
		}

	}).on('click','#refresh',function(){
		var x=$('#oHTML iframe').attr('src')||location.href, lv=$('.launch:visible');
		if(x){
			$('#oHTML iframe').attr('src',x);
		}else{
			
		}

    }).on('click','#oHTML .katex',function(e){
        
        var shft=e.shiftKey||$('#Shift').is('.seled'), me=$(this),
            t1=me.find('annotation').eq(0).text(), t0=me.parent('.katex0').attr('data-katex0')||t1;
        copy2clipboard(shft?t1:t0);
        /*
        if(shft){
            OverCanvas($(this).find('annotation').eq(0).text());
            toolTip(gM('copied2Canvastip'));
            Scroll('scrollB');
        }
        */
        
    }).on('click','#oHTML svg[id]',function(e){
        var shft=e.shiftKey || $('#Shift').is('.seled');
        if(shft && $('#Caps').length){
            var zi=[],Z,me=$(this);
            $('#Caps').children('svg,textarea,span').each(function(){zi.push(+$(this).css('z-index')||2000)});
            Z=max(zi)+1;
            me.clone().appendTo('#Caps');
            $('#Caps').find('#'+this.id).attr({'id':'graphic'+Time.now5()+(Math.random()+'').substr(2)})
                .css({'position':'absolute', 'z-index':Z,'top':$('#Caps').position().top,'height':me.height()})
            //L.drawShapeNow='';

            $('#Pointer').click();
            toolTip(gM('copied2Canvastip'));
            //Scroll('scrollB');
        }
        
    }).on('mouseover','#oHTML .katex',function(e){//, #oHTML svg[id]
        var me=$(this),pa=me.parents('th');
        if(pa.length<1){

            toolTip(gM('copytip'))

        }

	}).on('mouseover', '#oHTML th:eq(0)',function(e){
		toolTip(gM('thtip'));

    }).on('click','th',function(e){
        
        var me=$(this), i=me.index(),shft=e.shiftKey, ctrl=e.ctrlKey, alt=e.altKey;
        if(alt){
            me.parent().parent().next().toggle();

        }else if(me.is('.Clear')){


        }else if(me.parents('.wiki').length || me.parent().parent().is('.OHLaTeX')){


            if(me.is('.katexed')){
            //	me.text(me.find('.katex-mathml annotation').text());
                
                me.removeClass('katexed').parent().parent().next().children().each(function(){
                    var td=$(this).children().eq(i),c=td.children('.katex0');
                    if(c.length){
                        td.find('.katex0').each(function(){
                            $(this).text(XML.decode($(this).find('.katex-mathml annotation').text()))
                        });
                    }else{
                        td.text(XML.decode(td.find('.katex-mathml annotation').text()))
                    }
                });
                if(me.children('.katex-display').length){

                    me.text(XML.decode(me.find('.katex-mathml annotation').text()))
                }else{
                    me.find('.katex0').each(function(){
                        $(this).text(XML.decode($(this).find('.katex-mathml annotation').text()))
                    });
                }
                

                
            }else{
                me.addClass('katexed').parent().parent().next().children().each(function(){
                    var td=$(this).children().eq(i),c=td.children();
                    if(c.length && c.not('br').length){// if(c.length && !(c.length==1 && c.is('br'))) 此处用于fix浏览器bug： contentEditable 复制粘贴文字时，会被chrome默认在td里面底部添加一个br
                        td.find('.katex0').each(function(){
                            var t=$(this).text();
                           // console.log($(this).is('div,td'),);
                            katex.render(kx(t), this, {
                                throwOnError: true,
                                displayMode: $(this).is('div,td'),
                                trust:true
                            });
                        });
                    }else if(!c.length){
                        var t=td.text();
                        if(td.length){
                            katex.render(kx(t), td[0], {
                                throwOnError: true,
                                displayMode: $(td).is('div,td'),
                                trust:true
                            });
                        }
                        
                    }
                });
                if(me.children().length){
                    me.find('.katex0').each(function(){
                        var t=$(this).text();
                        katex.render(kx(t), this, {
                            throwOnError: true,
                            displayMode: $(this).is('div,td'),
                            trust:true
                        });
                    });
                }else{
                    var t=me.text()
                    katex.render(kx(t), this, {
                        throwOnError: true,
                        displayMode: true,
                        trust:true
                    });
                }
            }
        }

    }).on('click','.katexvreplace',function(){
        var me=$(this), r=me.prev().val().trim(), k=me.prevAll('.katexv');
        if(r){
            var vvvvvv=k.val();
            k.val(eval('vvvvvv.replace('+r+')'))
            //k.val(eval('"'+k.val()+'".replace('+r+')'))
        }
    }).on('click','.katexvgo',function(){
        var me=$(this), v=me.prevAll('.katexv').val().trim(), k0=me.parent().prevAll('.katex0');
        if(v){
            katex.render(kx(v), k0[0], {
                throwOnError: true,
                displayMode: true,
                trust:true
            });
        }
        
    }).on('click','.katexv1',function(){
        var me=$(this), kf=me.prev('.katexf'), a=kf.val().trim().replace(/,/g,'","'), f=kf.attr('data-katexf');
        if(/;/.test(a)){
            a=a.split(';');
            a=a[Random(a.length)-1];
        }
        kf.prev('details').replaceWith(eval('(function'+f+')("'+a+'")'));
        
        
        kf.prev('details').attr('open','').find('.katex0').each(function(){
            var t=$(this).text();
            katex.render(kx(t), this, {
                throwOnError: true,
                displayMode: false,
                trust:true
            });
        });
        
    }).on('click','.katexv0',function(){
        var p=$(this).parent().parent(), v=p.find('.katexv');
        v.val(v.attr('data-katex'));
        


    }).on('click','.navHide',function(){
        var me=$(this),isup=me.text().indexOf('up')>0;
        $('#toolnav,#navhead').add(me.parent().parent().prev()).toggle(!isup);
        me.text('keyboard_arrow_'+(isup?'down':'up'))//.toggleClass('seled',isup);
        $('#panel').toggle(!isup);


	}).on('click','.subtabhead',function(e){
		var me=$(this).addClass('seled'), pa=me.parent(), i=me.index(),shft=e.shiftKey || $('#Shift').is('.seled');
        me.siblings('.subtabhead').removeClass('seled');
        var subtabi=pa.parent().find('.subtab').eq(i);
        subtabi.siblings('.subtab').hide();
        if(subtabi.is(':visible')){
            subtabi.hide();
            me.siblings().show();
        }else{
            subtabi.show();
            me.siblings().hide();
        }


    }).on('click','.launch',function(){
        var me=$(this);
        me.parent().nextAll('details').find('.play').click();

    }).on('click','.downTxt',function(){
        var me=$(this), t=me.parent().prev().val();
        saveText(t,
			gM('zzllrr Mather')+$('#showGround .level.seled').text()+Time.now()+'.txt'
		)


    }).on('click','.qrGen',function(){
        var t=$(this).parents('.ground1').find('.editorText').val();
        if(t){
            var tl=t.replace(hanziRe,"aa").length, limitL=1273;
            if(tl>=1273){
                saveText(v0,
                    gM('zzllrr Mather')+Time.now()+'.txt'
                )
                return
            }
            var m=Math.ceil(Math.min($(window).width(),$(window).height())*0.6);
            qrJPG(t,'#QRCODE',m);
            
            $('#QRCODE').fadeToggle();
        }

    }).on('click','.qrScan',function(){
        var qr = new QrcodeDecoder();

        sTo(function(){
            qr.decodeFromImage($('#video_Camera')[0]).then((res) => {
                //console.log(res);
                if(res){

                    var u=res.data;
                    if(/^https?:.+$/.test(u)){
                        window.open(u)

                    }else{
                        $('.editorText.showSlide').val(function(i,v){return v+brn+u});
    
                    }


                }

            });
        },500);

    }).on('dblclick','.katexf',function(){
        var me=$(this);
        me.val(me.attr('placeholder'));

    }).on('mouseover', '[tip]:not(#tileTool),[hotkey]',function(e){
		var me=$(this),hk=me.attr('hotkey')||'';
		if($('#navHide').is('.seled') && me.is('#iClear') || isMobile){
			hk='';
        }
        if(me.parent('#iTextOpt').length * $('#iTextFold').not('.seled').length * $('#zMatherHide:contains(down)').length){
            return
        }
        toolTip(gM(me.attr('tip')||this.id||'')+(hk?' | '+gM('Hotkey')+' '+hk:''));
        
    }).on('keydown',function(e){
    
		var k=e.keyCode, shft=e.shiftKey || $('#Shift').is('.seled'), ctrl=e.ctrlKey, alt=e.altKey, act=document.activeElement, 
		node=act.tagName.toLowerCase(), me=$(act),id=me.attr('id')||'';
//console.log(k,node);

		if(ctrl && shft && k==13){
            $('.launch').eq(0).click()
        }

    });

    reloadfavStar();
});
/*
 * zzllrr Mather
 * zzllrr@gmail
 * Released under MIT License
 */

var deepClone = function(obj) {
	// 先检测是不是数组和Object
	// let isArr = Object.prototype.toString.call(obj) === '[object Array]';
	let isArr = Array.isArray(obj);
	let isJson = Object.prototype.toString.call(obj) === '[object Object]';
	if (isArr) {
	  // 克隆数组
	  let newObj = [];
	  for (let i in obj) {
		newObj[i] = deepClone(obj[i]);
	  }
	  return newObj;
	} else if (isJson) {
	  // 克隆Object
	  let newObj = {};
	  for (let i in obj) {
		newObj[i] = deepClone(obj[i]);
	  }
	  return newObj;
	}
	// 不是引用类型直接返回
	return obj;
  };
  
  Object.prototype.deepClone = function() {
	return deepClone(this);
  };
  Object.defineProperty(Object.prototype, 'deepClone', {enumerable: false});

var Fun={//抽象函数 [函数名, 参数数组expA] 	本质是数组
	build:{
		JS:function(t){//JS中的数学常数或函数，得到小数
/*
数学函数（共34个）

指数、对数	["exp", "expm1", "log", "log1p", "log10", "log2"]
	其中exp(x) 表示 e^x
	expm1(x) 表示e^x-1
	log(x) 表示ln x
	log1p(x) 表示ln (x+1)
	

（反）三角函数 	["asin", "acos", "atan", "atan2", "sin", "cos", "tan"]
	其中atan2(y,x) 接受两个参数
	
（反）双曲函数	["asinh", "acosh", "atanh", "sinh", "cosh", "tanh"]

近似、截取	["floor", "ceil", "trunc", "round", "fround", "clz32", "imul"]
	其中trunc(x) 截去小数部分，得到整数部分
	round(x) 四舍五入后的整数
	fround(x) 取与x最近的单精度浮点数
	clz32(x) 表示Count Leading Zeroes 32，取x转成二进制32位无符号整形数字开头0的个数
	imul(x,y) 表示两个整数按照类C语言的32位整数乘法运算结果
	
正负数	["sign", "abs"]

幂、开方	["sqrt", "cbrt", "hypot"]
	其中hypot() 函数返回它的所有参数的平方和的平方根



统计	["max", "min"]

随机	["random"]

常数（共8个）
	E		e 欧拉Euler自然常数
	LN10	ln 10
	LN2	ln 2
	LOG10E	log_{10}e
	LOG2E	log_{2}e
	PI		π
	SQRT1_2	√2 /2
	SQRT2      √2
*/
			return Math[t]
		},
		C:function(e,b,typ){//常数函数 e:表达式


		},
	},
	fromStr:function(s){/*数学lambda表达式→数组
		每个函数就是一个数组（常数，也是函数，是一个空数组）
		数组的属性：name→函数名
			rules→计算规则，函数满足的运算率数组[交换律，结合律，分配率，反交换率，反结合律]
			value: 数学lambda表达式
		函数的参数，就是数组的元素


		f1(f2,f3(f4,f2(f3,f1(f2,f2),f5(f7,f8(f9,f11(f11))),f6)))


		(()(()))

		f1(f2,f3(f4,f5(f6,f7(f8,f9),f10(f11,f12(f13,f14(f15))),f16)))
		
		
		Fun.fromStr('f1(f2,f3(f4,f5(f6,f7(f8,f9),f10(f11,f12(f13,f14(f15))),f16)))')
		
		
		Fun.toStr(Fun.fromStr('f1(f2,f3(f4,f5(f6,f7(f8,f9),f10(f11,f12(f13,f14(f15))),f16)))'))
			*/
		var t=''+s,A=[],tmp={},i=0;
		while(/\(.*\)/.test(t)){
			
			var ti=t.match(/[a-z\d\s]+\([^\(\)]*\)/ig)[0], tif=ti.split('(')[0].trim(), tic=ti.split('(')[1].split(')')[0].trim().replace(/ *, */g,',');
			t=t.replace(new RegExp(ti.replace(/ *([\(\)]) */g,' *\\$1 *'),'g'),'@'+i);
			tmp['@'+i]={'f':tif, 'c':tic};
			i++;
		}
		// consolelog(t,tmp,i);
		var f=function(str){
			if(/@\d/.test(str)){
				var a=[],ts=tmp[str];

				
				if(/,/.test(ts.c)){
					a=Arrf(f,ts.c.split(','));

				}else{
					a.push(f(ts.c))
				}
				a.name=ts.f;
				return a
					
			}else{
				var a=[];
				a.name=str;
				return a
			}
		};
		return f(t)
		
	
	},
	toStr:function(A){//A→lambda str
		//函数.value就直接得到表达式			仅当函数.value失真，或者局部变化后.value未同步更新，才需要递归更新
		if(typeof A == 'string'){
			return A
		}
		if(A.length){
			var s=A.name;
			s+='('+Arrf(Fun.toStr,A)+')';
			return s;
		}else{
			return A.name||''
		}
		
	},


}, Mfn={//数学函数 [引用, 引用索引{}, 引用数组[]] 本质上数组对象
	build:{//直接构造（通过已知对象）
		Num:function(a){//基本（有理元素）数学对象
			//注意，Mfn对象中，表达式.f是num时，仅指自然数、正小数、正百分数，及著名常数

			if(isStr(a) || typeof a == 'number'){//
				return Mfn.fromStr(a)
			}
			
			return Mfn.fromStr(a.toStr())
		},
		NumC:function(t){//著名常数 eπγi
			var a=['@0$',{'c':t, 'f':'num', 'v':c},['']];
			a.type='Mfn';a.toStr=function(l,p){return Mfn.toStr(this,l,p)};a.toStr4=function(p){return Mfn.toStr4(this,p)};a.ref=function(r){return Mfn.ref(this,r)};
			return a
		},
		Polynomy:function(a){
			
		},
		A:function(A,ref){//A是已知Mfn对象		ref是某一个子表达式的引用(@\d+$)
			var a=deepClone(A);
			//var a=[].concat(A);a.type='Mfn';a.toStr=function(l,p){return Mfn.toStr(this,l,p)};a.toStr4=function(p){return Mfn.toStr4(this,p)};a.ref=function(r){return Mfn.ref(this,r)};
			if(ref){
				a[0]=ref;
			}
			return a
		}

	},
	
	
	simRef:function(A,ref,p){/*化简子表达式，在原对象中修改	，返回新的ref引用地址
		参数ref 是A[1]中的索引
		参数p，指定环境，例如'Mtrx'
		*/
		
		var B=Mfn.build.A(A,ref), s0=B.toStr(), x=Mfn.opr1('=',B,p), s1=x.toStr();
		if(s0==s1){
			return ref
		}
		
		A[1]=x[1];
		A[2]=x[2];
		A[1][ref]=A[1][x[0]];
		
		
		
	},
	
	simp:function(A,ref,p){/*化简命令
		
		参数ref 是A[1]中的索引
		
		参数p命令：
		() 去括号
		/ 正有理数约分
		
		
		*/
		var l=A[2].length;
		
		
		
		if(ref){
			var i=+ref.replace(/\D/g,'');
			if(p=='()'){
				// consolelog(ref,A[2],A);
				var ref1='@'+i+'$';
				if(!A[1][ref1]){
					ref1='@'+i+'&'
				}

				var ref2=A[1][ref1].c;
			}
			
			var f=function(x){return x.replace(new RegExp(regReg(ref),'g'), ref2)};
// consolelog('下面开始替换()',ref,'替换成',ref2);
			for(var k=0;k<l;k++){
				if(A[2][k].indexOf(ref)>-1){
// consolelog('k = ',k,' A[2][k]= ',A[2][k]);
					A[2][k]=f(A[2][k]);
					var r='@'+k+'&', o=A[1][r];
					if(!o){
						r='@'+k+'$';o=A[1][r];
					}
					// consolelog(o);
					o.c=f(o.c);
					
					if(o.v && isArr(o.v)){
						if(isArr(o.v,1)){
							o.v[1]=Arrf(f,o.v[1])
						}else{
							o.v=Arrf(f,o.v)
						}
					}
					A[1][r]=o;
				}
				
			}
			return 
		}
		
		

		for(var i=0;i<l;i++){
			var t=A[2][i];
			if(p=='()' && /\(.+\)/.test(t)){
				Mfn.simp(A,'@'+i+'$','()')
			}
		}

	},
	
	uniRef:function(A,ref_A2){/*统一别称（不同的索引，指向同一实质）
	
		ref_A2是A[2]中的值（且非纯数字）
		
		*/
		//consolelog('uniRef',ref_A2);
		var l=A[2].length;
		if(ref_A2 && !/^\d+$/.test(ref_A2)){
			var i=A[2].indexOf(ref_A2), j=A[2].lastIndexOf(ref_A2);
			
			//consolelog('ref_A2'.ref_A2,i,j);
			if(i==-1 || i == j){//无别称
				return
			}
			var ref1='@'+i+'&', ref2='@'+j+'&';
			if(!A[1][ref1]){
				ref1='@'+i+'$'
			}
			if(!A[1][ref2]){
				ref2='@'+j+'$'
			}
			//consolelog('表达式含有 ',ref2,' 都要替换成 ',ref1,i,j);
			var f=function(x){return x.replace(new RegExp(regReg(ref2),'g'), ref1)};
			

			//consolelog(A[2].join(' ; '));
			A[2][j]='';	//替换为空值
			A[1][ref2]={};

			if(A[0]==ref2){
				A[0]=ref1;
			}
			
			
			for(var k=0;k<l;k++){
				if(k!=i && k!=j){
					var t=A[2][k];
					
					 //consolelog('遍历k =',k,'表达式 t = ',t);


					if(t.indexOf(ref2)>-1){//表达式含有无效需替换的引用
						A[2][k]=f(t);
						var r='@'+k+'&', o=A[1][r];
						if(!o){
							r='@'+k+'$';o=A[1][r];
						}
						//consolelog('o.c替换前',o.c);
						o.c=f(o.c);
					//consolelog('o.c替换后',o.c);

						if(o.v && isArr(o.v)){
							if(isArr(o.v,1)){
								o.v[1]=Arrf(f,o.v[1])
							}else{
								o.v=Arrf(f,o.v)
							}
						}
						A[1][r]=o;
					}

				}
			}
			return Mfn.uniRef(A,ref_A2);//再执行一次，确保多个同义别称索引都被替换
		}
		
		if(arguments.length<2){
			for(var i=0;i<l;i++){
				var t=A[2][i];
				if(t && !/^\d+$/.test(t)){
					//consolelog('遍历 进行 uniRef, ',i,t);
					Mfn.uniRef(A,t)
				}
			}
		}

		
		
	},
	
	
	ref:function(A,str){//获取索引（如不存在，则创建）
		// consolelog('ref ',str);
		if(/^@\d+.$/.test(str)){
			return str
		}
		var S=''+str,S0=S[0],SP=S.replace('-',''), i=A[2].indexOf(S), j=i>-1?i:A[2].length, r='@'+j+'&';


		if(/@/.test(S)){

			if(/^[-√∛∜]@\d+.$/.test(S)){
				A[1][r]={'f':S[0],'c':S.substr(1)};

				
			}else if(/\|/.test(S)){
				A[1][r]={'f':'||','c':S.replace(/\|/g,'')};

				
			}else if(/^@\d+.[\!‼#°]$/.test(S)){
				A[1][r]={'f':S.substr(-1),'c':S.substr(0,S.length-1)};

				
			}else if(/[\+\-]/.test(S)){
				A[1][r]={'f':'pms','c':S,'v':split(S,/[\+\-]/g)};

				
			}else if(/[×÷]/.test(S)){
				// consolelog('S = ',S);
				A[1][r]={'f':'tds','c':S,'v':split(S,/[×÷]/g)};

				
			}else if(/^[@\$&\d]+$/.test(S)){
				A[1][r]={'f':'times','c':S,'v':Arrf(function(x){return '@'+x},S.split('@').slice(1))};

				
			}else if(/\^/.test(S)){
				A[1][r]={'f':'pow','c':S.split('^').join(),'v':S.split('^')};

				
			}else if(/_/.test(S)){
				A[1][r]={'f':'_','c':S.split('_').join(),'v':S.split('_')};

				

				
			}else{//函数名@..@..
				A[1][r]={'f':S.split('@')[0],'c':S.replace(/^[^@]+/g,''),'v':S.replace(/^[^@]+/g,'').split(',')};

			}
			
			A[2][j]=S;
			return r
		}
			
	////consolelog(S,S0);
		S=S.replace('-','');
		var SA=S.split('/');
		if(S.indexOf('/')>0){//S是有理数

			var i=A[2].indexOf(SA[0]), j=i>-1?i:A[2].length, s='@'+j+'$';

			A[1][s]={'f':'num','c':SA[0],'v':Decimal.build.D(SA[0])};
			A[2][j]=SA[0];
			
			var i=A[2].indexOf(SA[1]), j=i>-1?i:A[2].length, t='@'+j+'$';

			A[1][t]={'f':'num','c':SA[1],'v':Decimal.build.D(SA[1])};
			A[2][j]=SA[1];
			
			var i=A[2].indexOf(s+'÷'+t), j=i>-1?i:A[2].length, u='@'+j+'&';

			A[1][u]={'f':'tds','c':s+'÷'+t,'v':[['÷'],[s,t]]};
			A[2][j]=s+'÷'+t;
			
		}else{
			
			var i=A[2].indexOf(S), j=i>-1?i:A[2].length, u='@'+j+'$';

			A[1][u]={'f':'num','c':S,'v':Decimal.build.D(S)};
			A[2][j]=S;

		}
	// consolelog('u = ',u);
		
		if(S0=='-'){
			var i=A[2].indexOf('-'+u), j=i>-1?i:A[2].length, v='@'+j+'&';

			A[1][v]={'f':'-','c':u};
			A[2][j]='-'+u;
			return v;
			
		}else{
			return u;
		}

	},
	has:{//子元素
		"var":function(A,ref){//是否含单变量或自身就是单变量
			var o=A[1][ref||A[0]];
			//console.log(ref,A[0],o);
			if(!o){
				return 0
			}
			var of=o.f, oc=o.c, ov=o.v;
			if(of=='var' || of=='_'){
				return 1
			}
			if(/num/.test(of)){//一些字母代表著名常数，不认为是变量
				return 0
			}

			if(ov){
				for(var i=0,l=ov.length;i<l;i++){
					var oi=ov[i];
					if(isArr(oi)){
						for(var j=0,m=oi.length;j<m;j++){
							if(/@/.test(oi[j]) && Mfn.has.var(A,oi[j])){
								return 1
							}
						}
					}

				}
			}else{
				return Mfn.has.var(A,oc)
			}
			return 0
		}
	},
	is:{//布尔逻辑
		b1:{//一元关系
			"var":function(A,ref){//是否单变量
				var o=A[1][ref||A[0]];
				return o && o.f=='var'
			},
			"var_":function(A,ref){//是否单变量（下标形式）
				var o=A[1][ref||A[0]];
				return o && o.f=='_'
			},
			"Var":function(A,ref){//是否广义单变量（含下标形式）
				var o=A[1][ref||A[0]];
				return o && (o.f=='_' || o.f=='var')
			},
			"num":function(A,ref){//是否num（自然数，非负小数，非负百分数）

				var o=A[1][ref||A[0]];
				return o && o.f=='num' && !isVar(o.c)
			},
			"Num":function(A,ref){//是否广义num（含字母常量）
				var o=A[1][ref||A[0]];
				return o && o.f=='num'
			},
			"frac":function(A,ref){//是否有理数形式
				var o=A[1][ref||A[0]];

				return o && o.f=='num' && !isVar(o.c) || 
					o.f=='tds' && o.v[0].length==1 && o.v[0][0]=='÷' && Mfn.is.b1.num(A,o.v[1][0]) && Mfn.is.b1.num(A,o.v[1][1]) || 
					o.f=='-' && Mfn.is.b1.frac(A,o.c)
			},
			"0":function(A,ref){//是否0
				var o=A[1][ref||A[0]];
				return o && o.c=='0'
			},
			"1":function(A,ref){//是否1
				var o=A[1][ref||A[0]];
				return o && o.c=='1'
			},
		},

		
		b2:{//二元关系
			"=":function(a,b){//输出字符串完全相等（外显表达式一样）
				return +(a.toStr()==b.toStr())
			},
			"==":function(a,b){//化简后相等（等值，等价，内涵实质相等）
				return +(Mfn.opr1('=',a).toStr()==Mfn.opr1('=',b).toStr())
			},
			"≠":function(a,b){
				return +(a.toStr()!=b.toStr())
			},
		}
	},
	fromStr:function(s){/*数学表达式→数组
注意：
		数学表达式  对空格比较敏感
		LaTex		空格不那么敏感



符号（中缀、前缀、后缀、围缀）	函数名

中缀
		+	sum
		-	minus
		* ×times
		/ ÷devide
		^ 	pow
		_	sub
		,	参数分隔符		一般与外围()同时使用	用于函数参数输入
		;	数组分隔符		一般与外围[]同时使用	用于矩阵元素输入
		mod 取余
		
		
		
	纯数字相关	. 小数点

前缀
		-	minus
		√  root
		㏒	log
		㏑  ln
		e^	exp
		
		
		SBS.Latex.func中涉及的函数（其中单字符除外）
		以及反双曲函数
后缀
		!
		!!	‼

		# 素数阶乘
		
		上⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻
		下₀₁₂₃₄₅₆₇₈₉₊₋
		
	纯数字相关	%
				‰
				‱
		
围缀
		()	优先运算、函数后及参数、
		[]	数组
		{}	集合
		<>  二元关系（有向）
		上下取整⌊⌋ ⌈⌉
		


需结合上下文，才能识别准确的案例：

		函数幂(参数)，表示迭代，而不是求幂

		常见函数名、前缀					后面有数字、字母 后面是参数（省略了括号）
		sinx
		cosπ
		√27
		∛27
		∜27
		
		
		数字、普通字母						后面有字母		一般表示乘法
		-4x
		-xy
		78y^2
		

		后缀								前面有()		括号表示优先运算，看成一个整体
		常见函数名、前缀					后面有()		括号中表示参数（如有多个参数，逗号隔开）
		普通字母（拉丁、希腊）、数字、符号 	后面有()		括号表示优先运算，看成一个整体，做乘法运算



运算优先级（从高到低）：
	括号
	百分数、小数 识别
	后缀
	
	函数名 前缀 优先识别
	
	下标
	上标
	
	√∛∜ 前缀
	
	数字字母，识别为乘法（省略了乘号）

	字母字母，识别为乘法（省略了乘号）
	- 前缀
	
	乘除
	加减

			*/
		var x=simExpression(''+s),AAA=[],tmp={},tmpA=[],i=0;
		
		// console.log('Mfn.fromStr    ',x);
		
		
		AAA.type='Mfn';AAA.toStr=function(l,p){return Mfn.toStr(this,l,p)};AAA.toStr4=function(p){return Mfn.toStr4(this,p)};AAA.ref=function(r){return Mfn.ref(this,r)};
		
		if(isVar(x)){
			AAA.push('@0&',{'@0&':{f: 'var', c: x, v: x}},[x]);
			return AAA
		}
		if(nisd(x)){
			if(/-/.test(x)){
				AAA.push('@1$',{'@0$':{f: 'num', c: x.substr(1), v: Decimal.build.D(x.substr(1))},
					'@1$':{f: '-', c: '@0$'}
				},[x.substr(1),'-@0$']);

			}else{
				AAA.push('@0$',{'@0$':{f: 'num', c: x, v: Decimal.build.D(x)}
				},[x]);
			}
			return AAA
		}
		if(nisVid(x)){
			var xA=x.split('_');
			if(nisd(xA[1])){
				AAA.push('@2&',{'@0&':{f: 'var', c: xA[0], v: xA[0]},
					'@1$':{f: 'num', c: xA[1], v: Decimal.build.D(xA[1])},
					'@2&':{f: '_', c: '@0&,@1$',v:['@0&','@1$']}},
				[xA[0],xA[1],'@0&_@1$']);

			}else{
				AAA.push('@2&',{'@0&':{f: 'var', c: xA[0], v: xA[0]},
					'@1&':{f: 'var', c: xA[1], v: xA[1]},
					'@2&':{f: '_', c: '@0&,@1&',v:['@0&','@1&']}},
				[xA[0],xA[1],'@0&_@1&']);
			}
			return AAA
		}
		if(nisfrac(x)){
			var xA=x.replace('-','').split('/');
			if(/-/.test(x)){
				AAA.push('@3&',{'@0$':{f: 'num', c: xA[0], v: Decimal.build.D(xA[0])},
					'@1$':{f: 'num', c: xA[1], v: Decimal.build.D(xA[1])},
					'@2&':{f: 'tds', c: '@0$÷@1$',v:[['÷'],['@0$','@1$']]},
					'@3&':{f: '-', c: '@2&'}},
				[xA[0],xA[1],'@0$÷@1$','-@2&']);

			}else{
				AAA.push('@2&',{'@0$':{f: 'num', c: xA[0], v: Decimal.build.D(xA[0])},
					'@1$':{f: 'num', c: xA[1], v: Decimal.build.D(xA[1])},
					'@2&':{f: 'tds', c: '@0$÷@1$',v:[['÷'],['@0$','@1$']]}},
				[xA[0],xA[1],'@0$÷@1$']);
			}
			return AAA
		}


		//预处理
		x=x.replace(/ *log */g,'㏒').replace(/ *ln */g,'㏑')		//化成单个字符的好处，替换时不会误替换
			//.replace(/ *e\^/g,' exp ')
			.replace(/sqrt/g,'√')
			.replace(/cbrt/g,'∛')
			.replace(/ *!!+ */g,'‼')
			.replace(/，/g,',')
			.replace(/[⋅]/g,'×').replace(/([^\^])\*/g,'$1×').replace(/[/]/g,'÷')
			.replace(/ *\d+[\d\s]*\d* */g, function(x){return '('+x.replace(/\s/g,'')+')'}).replace(/ *\^ *\( *-\((\d+)\)\) */g,'^(-$1)')		//数字加括号
			.replace(new RegExp(' *'+'['+SBS.Num[0][0]+']+ *','g'), function(x){return '^('+sub2n(x.trim())+')'}).replace(/ *\^ */g,'^')
			.replace(new RegExp(' *'+'['+SBS.Num[0][1]+']+ *','g'), function(x){return '_('+sub2n(x.trim())+')'}).replace(/ *_ */g,'_').replace(/_([a-zα-ω])/ig,'_($1)')
			.replace(/  +/g,' ')
			
			.replace(/\^\(-1\)/g,'⁼')

//2019-11-28 临时修复laTeX中的{}
			.replace(/\{/g,'(')
			.replace(/\}/g,')')
		
		/*缓存 目标：表达式最终只剩下一个函数：@纯数字&

			下标									变成@	&
			括号、小数（百分数）					变成@	$（原子、伪原子）
			后缀									变成@	&
			
			数学函数 								变成@	#（无参函数）

			√∛∜ 后面有@	[$&]、单个字母			变成@	&（有参函数）

			√∛∜ 									变成@	#（无参函数）

原子类（原子、伪原子）：@ $ 括号、小数（百分数）、后缀
						、@ &（有参函数）、纯数字、单个字母(拉丁、希腊)

			原子^原子					指数函数		@	&（有参函数）


			[纯数字,字母]后字母，是乘法函数				@	&（有参函数）
			


			无参函数@  #后面的@  [$&]
				应识别为参数，整体变成函数 				@	&（有参函数）

			中缀				变成函数				@	&（有参函数）


			
			
			

测试用例：
		
		
		8!! = 8 !!
		-8! ! = -((8!)!)
		
		
		log(2,x)
		
		
		sin^2x = (sin x)^2
		
		sin2x = sin(2x)
		sinxy = sin (x y)
		
		sin^2xy = (sin (xy))^2
		
		3^2x = 3^2 x
		
		sinx^2 = sin(x^2)
		
		x^2/y^2 = (x^2) / (y^2)
		
		

		
		√xy = √x y
		√2x = √2 x


		√x+y = √x + y
		√x/y = √x / y
		√x^2√y = (√x)^2 √y
		
		xy^2z = x y^2 z
		a^2x  = a^2 x
		
		x_1^2 = (x_1)^2
		x^2_1（非法！） = x^(2_1)		这一点，与LaTex有区别
		
		
		
		
		
		-3-4+5	= ((-3)-4)+5
		-3.41%+8x	=(-(3.41%)) + (8 x)

		-x/3 = -(x/3)
		-2/3x = -(2/(3x))
		-(2/3)x  = (-(2/3)) x = -((2/3)x)	两种解释
		
		-2xy/3	=-(((2x) y)/3)
		-(2/3)xy
		
		-2xs/3yt = -(((2x)s)/((3y)t))
		

		
		被禁止的不规范的逆函数的写法，以及相应规范写法：
			sin^(-1)x = sin⁻¹x   ：arcsin x
			²^(-1) = ²^⁽⁻¹⁾ = ²^(⁻¹) : √
			2^^(-1)x = log₂x = log_2x : log(2,x)
			
		
		注意：正式的数学表达式，函数后⁻¹，表示反函数（逆函数，不是求倒数！）；
								函数后是其它正整数幂，则是求函数值的n次方（并不是迭代，这是一个历史遗留的学术传统缺陷！）
								函数后的幂有小括号围着，表示算子迭代（例如，求导时表示高阶导数）

		*/
		
	var cache=function(x){
			var t=x;
// consolelog('cache开始 t = ',t);

		if(/^@\(\d+\)[\$&]$/i.test(t)){
			i++;
			
			t=t.replace(/[\(\)]/g,'');
			tmpA.push(t);
			// consolelog('直接输出 ',t);
			return t
		}



		while(/\(.*\)/.test(t)){
// consolelog('缓存括号',t);
			var ti=t.match(/\([^\(\)]*\)/ig)[0], tif='()', tic=ti.split('(')[1].split(')')[0].trim().replace(/ *, */g,','), tiv='',
				tai=tmpA.indexOf(ti), rg=new RegExp(ti.replace(/[\(\)\+\-\^\$]/g,' *\\$& *'),'g');
			if(/^\d+$/.test(tic)){
				tif='num';
				tiv=Decimal.build.D(tic);
			}
			// consolelog('缓存括号ing,  t =  ', t, rg,tic,tiv);
			t=t.replace(rg,'@'+(tai<0?i:tai)+'$');
			if(tai<0){
				// consolelog('缓存括号迭代,  t =  ', t,' i = ', i);
			
				i++;
				
				var j=i-1;
				tmpA.push(tif=='num'?tic:ti);	//tic:ti
				
				var ct=cache(tic);
				

				if(tif=='()'){
					tmp['@'+j+'$']={'f':tif, 'c':ct};
					tmpA[j]='('+ct+')';
				}else{
					tmp['@'+j+'$']={'f':tif, 'c':ct, 'v':tiv};
				}
				
				// consolelog('tif= ',tif, 'tic= ',tic, 'ti= ',ti);
			}
		}



		while(/\|.*\|/.test(t)){
			// consolelog('缓存绝对值符号',t);		存在嵌套歧义，只考虑相邻，暂不支持识别嵌套	|3|-1|-2|
			var ti=t.match(/\|[^\|]*\|/ig)[0], tif='||', tic=ti.split('|')[1].trim().replace(/ *, */g,','), tiv='',
				tai=tmpA.indexOf(ti), rg=new RegExp(ti.replace(/[\|\+\-\^\$]/g,' *\\$& *'),'g');
			if(/^\d+$/.test(tic)){
				tif='num';
				tiv=Decimal.build.D(tic);
			}
			//consolelog(tai,'缓存绝对值ing,  t =  ', t, rg,tic,tiv);
			t=t.replace(rg,'@'+(tai<0?i:tai)+'$');

			//consolelog(t);
			if(tai<0){
				// consolelog('缓存绝对值迭代,  t =  ', t,' i = ', i);
			
				i++;
				
				var j=i-1;
				tmpA.push(tif=='num'?tic:ti);	//tic:ti
				//consolelog(tic,tif);
				var ct=cache(tic);
				
				//consolelog(ct,tmp,tmpA);
				if(tif=='||'){
					tmp['@'+j+'$']={'f':tif, 'c':ct};
					tmpA[j]='|'+ct+'|';
				}else{
					tmp['@'+j+'$']={'f':tif, 'c':ct, 'v':tiv};
				}
				
				// consolelog('tif= ',tif, 'tic= ',tic, 'ti= ',ti);
			}
		}



		while(/[a-zα-ω]_(@\d+\$|[a-zα-ω])/i.test(t)){
// consolelog('缓存下标',t);
			var ti=t.match(/[a-zα-ω]_(@\d+\$|[a-zα-ω])/ig)[0].replace(/\s/g,''), tif='_', tiv=ti.split('_'), tic=ti,
				tai=tmpA.indexOf(tic), rg=new RegExp(' *'+ti.replace(/[\(\)\$]/g,' *\\$& *').replace(/[_]/g,' *$& *'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				
				var t0=tmpA.indexOf(ti[0]);
				tiv[0]='@'+(t0<0?i+1:t0)+'&';
				tic=tiv.join('_');
				
				tmp['@'+i+'&']={'f':tif, 'c':tiv.join(), 'v':tiv};
				tmpA.push(tic);
				i++;
				
				if(t0<0){
					tmp['@'+i+'&']={'f':'var', 'c':ti[0], 'v':ti[0]};
					tmpA.push(ti[0]);
					i++;
				}
			}
		}


		if(/,/.test(t)){
// consolelog('缓存逗号',t);
			var tA=t.split(','),tif=',',tiv=[];
			for(var j=0,l=tA.length;j<l;j++){
				// consolelog('i= ',i);
				tiv.push(cache(tA[j]));
				// consolelog('i = ',i);
			}
			var tic=tiv.join();
			tmp['@'+i+'$']={'f':tif, 'c':tic, 'v':tiv};	//tiv是数组
			tmpA.push(tic);
			i++;
// consolelog('tiv=',tiv,'@'+(i-1)+'$');
			return '@'+(i-1)+'$'
		}


		while(/\./.test(t)){
// consolelog('缓存小数',t);
			var ti=t.match(/@\d+\$\.@\d+\$/g)[0], tiA=ti.split('.'), tif='num', tic=ti,ticc=tic.replace(/@\d+\$/g,function(x){return tmp[x].c}), tiv=Decimal.build.D(ticc),
				tai=tmpA.indexOf(tic), rg=new RegExp(ti.replace(/[\.\$]/g,'\\$&'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'$');
			if(tai<0){
				tmp['@'+i+'$']={'f':tif, 'c':ticc, 'v':tiv};	//tiv是数组（小数）
				tmpA.push(ticc);
				i++;
			}
		}
		
		while(/\$[%‰‱]/.test(t)){
// consolelog('缓存百分数（含符号%‰‱）',t);
			var ti=t.match(/@\d+\$[%‰‱]/g)[0], tif='num', tic=tmp[ti.replace(/.$/,'')].c+ti.substr(-1), tiv=Decimal.build.D(tic),
				tai=tmpA.indexOf(tic), rg=new RegExp(ti.replace(/(\$[%‰‱])/,'\\$1 *'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'$');
			if(tai<0){
				tmp['@'+i+'$']={'f':tif, 'c':tic, 'v':tiv};	//tiv是数组（小数）
				tmpA.push(tic);
				i++;
			}
		}

		while(/[!‼#°]/.test(t)){//		后缀前面只可能是：括号@1$  纯数字	单个字母(拉丁、希腊)
// consolelog('缓存后缀',t);
			var ti=t.match(/([a-zα-ω]|@\d+[\$&]) *[!‼#°]+/ig)[0].replace(/\s/g,''), tic=ti, tif=ti.substr(-1),
				tai=tmpA.indexOf(tic), rg=new RegExp(' *'+ti.replace(/([!‼#°])/g,' *$1 *').replace(/[\$]/g,'\\$&'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				
				var t0=tmpA.indexOf(ti[0]);
				if(isVar(ti[0])){
					var ticc='@'+(t0<0?i+1:t0)+'&';
					tic=ticc;
				}
				
				
				tmp['@'+i+'&']={'f':tif, 'c':tic};
				tmpA.push(ti);
				i++;
				
				if(isVar(ti[0]) && t0<0){
					tmp[ticc]={'f':'var', 'c':ti[0], 'v':ti[0]};
					tmpA.push(ti[0]);
					i++;
				}
			}
		}


		var A=ZLR(SBSFUN);	//缓存三角双曲、及其他数学函数前缀
// consolelog('缓存函数前',t);
		for(var k=0,l=A.length;k<l;k++){
			var Ak=A[k].replace(/⁻¹/,'⁼');
			while(t.indexOf(Ak)>-1){
				var ti=t.match(new RegExp(' *'+Ak+' *','g'))[0].replace(/\s/g,''), tic='', tif=ti,
					tai=i, rg=new RegExp(' *'+tif+' *','g');
					//这里强制使用全局g，因为按现有函数顺序遍历，可以避免误替换
				t=t.replace(rg,'@'+(tai<0?i:tai)+'#');
			//	if(tai<0){
					tmp['@'+i+'#']={'f':tif, 'c':tic};
					tmpA.push(tic);
					i++;
			//	}
			}
		}

// consolelog('缓存函数之后',t);
		while(/⁼/.test(t)){
			tmp['@'+i+'$']={'f':'num', 'c':'1', 'v':Decimal.fromStr(1)};
			tmpA.push('1');
			i++;
			
			tmp['@'+i+'&']={'f':'-', 'c':'@'+(i-1)+'$'};
			tmpA.push('-@'+(i-1)+'&');
			t=t.replace(/⁼/g,'^@'+i+'&');
			i++;
		}
		
		
		
		while(/[√∛∜] *([a-zα-ω]|@\d+[\$&])/i.test(t)){
// consolelog('缓存根号（后及单变量）',t);
			var ti=t.match(/[√∛∜] *([a-zα-ω]|@\d+[\$&])/ig)[0].replace(/\s/g,''), tif=ti[0], tic=ti.substr(1),
				tai=tmpA.indexOf(tic), rg=new RegExp(ti.replace(/[√∛∜]/,' *$& *').replace(/[\$]/g,'\\$&'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				
				var t0=tmpA.indexOf(ti[1]);
				if(isVar(ti[1])){
					var ticc='@'+(t0<0?i+1:t0)+'&';
					tic=ticc;
				}
				
				tmp['@'+i+'&']={'f':tif, 'c':tic};
				tmpA.push(tif+tic);
				i++;
				
				if(isVar(ti[1]) && t0<0){
					tmp[ticc]={'f':'var', 'c':ti[1], 'v':ti[1]};
					tmpA.push(ti[1]);
					i++;
				}
				
			}
		}
		while(/[√∛∜]/.test(t)){
// consolelog('替换根号为无参函数',t);
			var ti=t.match(/[√∛∜]/g)[0], tif=ti.trim(), tic='',
				tai=i, rg=new RegExp(' *'+tif+' *','g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'#');
		//	if(tai<0){
				tmp['@'+i+'#']={'f':tif, 'c':tic};
				tmpA.push(tic);
				i++;
		//	}
		}
// consolelog(tmpA.join(';'),tmp['@1$']);

		while(/([a-zα-ω]|@\d+[&\$]) *\^ *([a-zα-ω]|@\d+[&\$])/i.test(t)){
// consolelog('指数函数',t);
			var ti=t.match(/([a-zα-ω]|@\d+[&\$]) *\^ *([a-zα-ω]|@\d+[&\$])/ig)[0].replace(/\s/g,''), tif='pow', tic=ti.replace('^',','), tiv=tic.split(','),
				tai=tmpA.indexOf(ti), rg=new RegExp(' *'+ti.replace(/[\$\^]/g,'\\$&'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				var t0=isVar(tiv[0]) && tmpA.indexOf(tiv[0])<0, t1=isVar(tiv[1]) && tmpA.indexOf(tiv[1])<0, tA=[].concat(tiv);
				if(isVar(tiv[0])){
					var ticc0='@'+(t0?i+1:tmpA.indexOf(tiv[0]))+'&';
					tiv[0]=ticc0;
				}
				if(isVar(tiv[1])){
					var ticc1='@'+(t1?i+1+(+t0):tmpA.indexOf(tiv[1]))+'&';
					tiv[1]=ticc1;
				}
				tic=tiv.join();

				tmp['@'+i+'&']={'f':tif, 'c':tic, 'v':tiv};	//tiv是数组：[底数, 幂次]
				tmpA.push(tiv.join('^'));
				i++;
				
				if(t0){
					tmp[ticc0]={'f':'var', 'c':tA[0], 'v':tA[0]};
					tmpA.push(tA[0]);
					i++;
				}
				if(t1){
					tmp[ticc1]={'f':'var', 'c':tA[1], 'v':tA[1]};
					tmpA.push(tA[1]);
					i++;
				}
			}
		}

		while(/# *\^ *([a-zα-ω]|@\d+[&\$])/i.test(t)){
// consolelog('无参函数的幂	变成复合无参函数',t);
			var ti=t.match(/@\d+# *\^ *([a-zα-ω]|@\d+[&\$])/ig)[0].replace(/\s/g,''), tif='pow', tic=ti.replace('^',','), tiv=tic.split(','),
				tai=tmpA.indexOf(ti), rg=new RegExp(' *'+ti.replace(/[\$\^]/g,'\\$&'),'g');

			t=t.replace(rg,'@'+(tai<0?i:tai)+'#');
			if(tai<0){
				var t1=tiv[1],t0=isVar(t1) && tmpA.indexOf(t1)<0;
				if(isVar(t1)){
					var ticc='@'+(t0?i+1:tmpA.indexOf(t1))+'&';
					tiv[1]=ticc;
					tic=tiv.join();
				}
				
				tmp['@'+i+'#']={'f':tif, 'c':tic, 'v':tiv};	//tiv是数组：[无参函数, 幂次]
				tmpA.push(tiv.join('^'));
				i++;
				
				if(t0){
					tmp[ticc]={'f':'var', 'c':t1, 'v':t1};
					tmpA.push(t1);
					i++;
				}
			}
		}


		while(/(@\d+#)+ *((@\d+[\$&]|[a-zα-ω]) *)+/i.test(t)){
// consolelog('无参变有参（#可能是一阶无参函数，也可能是复合无参函数）',t);
			var ti=t.match(/(@\d+#)+ *((@\d+[\$&]|[a-zα-ω]) *)+/ig)[0].replace(/\s/g,''), tif=ti.replace(/[^#]+$/,''), tic=ti.replace(/^.*#/,''),
				tai=tmpA.indexOf(ti), rg=new RegExp(' *'+ti.replace(/[\$]/g,' *\\$ *'));
				//这里不使用全局g，是因为替换#x时，会污染#xy
			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
// consolelog(t,tmp,tmpA);
			if(tai<0){
				var tm=tmp[tif];
// consolelog('tif = ',tif, 'tmp =', tmp);
				if(tm){
					// consolelog('一阶无参函数');
					if(tm.c && tm.f!='()'){
						// consolelog('无参函数的幂',tm.c,'tm.v = ',tm.v);
						//var tmc=tm.c.split(',');
						var tmc=tm.v;
						tif=tmp[tmc[0]].f;

						i++;
						var ticc='@'+i+'&,'+tmc[1], ticv=['@'+i+'&',tmc[1]];
						tmp['@'+(i-1)+'&']={'f':'pow', 'c':ticc, 'v':ticv};
						tmpA.push(ticv.join('^'));
						
						var t1=tic,t0=isVar(t1) && tmpA.indexOf(t1)<0;
						if(isVar(t1)){
							var ticc='@'+(t0?i+1:tmpA.indexOf(t1))+'&';
							tic=ticc;
						}
						tmp['@'+i+'&']={'f':tif, 'c':tic};
						tmpA.push(tic);
						
						if(t0){
							tmp[ticc]={'f':'var', 'c':t1, 'v':t1};
							tmpA.push(t1);
							i++;
						}
						
						
					}else{
						// consolelog('无参函数',tm);
						tif=tm.f;
						
						var t1=tic,t0=isVar(t1) && tmpA.indexOf(t1)<0;
						if(isVar(t1)){
							var ticc='@'+(t0?i+1:tmpA.indexOf(t1))+'&';
							tic=ticc;
						}
						
						tmp['@'+i+'&']={'f':tif, 'c':tic};
						tmpA.push(tif+tic);
						
						if(t0){
							tmp[ticc]={'f':'var', 'c':t1, 'v':t1};
							tmpA.push(t1);
							i++;
						}
					}


					
				}else{
					// consolelog('复合无参函数（高阶）');
					var tifs=tif.replace(/#$/,'').split('#');
					for(var j=0,l=tifs.length;j<l;j++){
						var tj=tifs[j]+'#', tmj=tmp[tj], tmjf=tmj.f, tmjc=tmj.c, tmjv=tmj.v;
						
						i++;
						if(j==l-1){break}
						var ticc='@'+i+'&';
						tmp['@'+(i-1)+'&']={'f':tmjf, 'c':ticc};
						tmpA.push(ticc);
					}
					tif=tmjf;
					tmp['@'+i+'&']={'f':tif, 'c':tic};
					tmpA.push(tic);
				}
				i++;
			}
			if(/(@\d+[\$&]|[a-zα-ω]){2}/i.test(tic)){
				// consolelog('隐式乘法',tic);
				var ticA=split(tic,/(@\d+[\$&]|[a-zα-ω])/ig), tiv=snake(ticA);
				tic=tiv.join('');

				
				tmp['@'+(i-1)+'&']={'f':tif, 'c':'@'+i+'&'};
				tmpA[tmpA.length-1]='@'+i+'&';
				
				tmpA.push(tic);
				var tA=[].concat(tiv),ti0=0,j=i+1;
				if(/[a-zα-ω]/i.test(tic)){
					for(var k=0,l=tiv.length;k<l;k++){
						var tk=tiv[k], t0=tmpA.indexOf(tk);
						if(isVar(tk)){
							var ticc='@'+(t0<0?j:t0)+'&';
							tiv[k]=ticc;
							if(t0<0){
								tmp['@'+j+'&']={'f':'var', 'c':tk,'v':tk};
								tmpA.push(tk);
								j++;
								ti0=1;
							}
							
						}
					}
				}
				tic=tiv.join('');
				tmp['@'+i+'&']={'f':'times', 'c':tic,'v':tiv};
				tmpA[i]=tic;
				i++;
				
				if(ti0){
					i=j;
				}
			}
		}
		while(/(@\d+[\$&] *|[a-zα-ω] *){2,}/i.test(t)){
// consolelog('处理隐式乘法',t);
			var ti=t.match(/(@\d+[\$&] *|[a-zα-ω] *){2,}/ig)[0].replace(/\s/g,''), tif='times', tic=ti,
				tai=tmpA.indexOf(tic), rg=new RegExp(' *'+ti.replace(/[\$]/g,' *\\$ *'));
				//这里不使用全局g，是因为替换xy时，会污染zxy
			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				
				var ticA=split(tic,/(@\d+[\$&]|[a-zα-ω])/ig), tiv=snake(ticA);
				tic=tiv.join('');


				tmpA.push(tic);
				var tA=[].concat(tiv),ti0=0,j=i+1;
				if(/[a-zα-ω]/i.test(tic)){
					for(var k=0,l=tiv.length;k<l;k++){
						var tk=tiv[k], t0=tmpA.indexOf(tk);
						if(isVar(tk)){
							var ticc='@'+(t0<0?j:t0)+'&';
							tiv[k]=ticc;
							if(t0<0){
								tmp['@'+j+'&']={'f':'var', 'c':tk,'v':tk};
								tmpA.push(tk);
								j++;
								ti0=1;
							}
							
							
						}
					}
				}
				tic=tiv.join('');
				tmp['@'+i+'&']={'f':tif, 'c':tic,'v':tiv};
				tmpA[i]=tic;
				i++;
				
				if(ti0){
					i=j;
				}
			}
		}

		while(/(@\d+[\$&]|[a-zα-ω]) *([×÷] *(@\d+[\$&]|[a-zα-ω]) *)+/i.test(t)){
// consolelog('乘除',t);
			var ti=t.match(/(@\d+[\$&]|[a-zα-ω]) *([×÷] *(@\d+[\$&]|[a-zα-ω]) *)+/ig)[0].replace(/\s/g,''), tif='tds', tic=ti, tiv=split(tic,/[×÷]/g);

			var tai=tmpA.indexOf(ti), rg=new RegExp(ti.replace(/\D/g,' *$& *').replace(/[\$]/g,' *\\$ *'));
				//这里不使用全局g，是因为替换x×y时，会污染z÷x×y
			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
			if(tai<0){
				
				tmpA.push(tic);
				var tA=[].concat(tiv[1]),ti0=0,j=i+1;
				if(/[a-zα-ω]/i.test(tA.join())){
					for(var k=0,l=tA.length;k<l;k++){
						var tk=tA[k], t0=tmpA.indexOf(tk);
						if(isVar(tk)){
							var ticc='@'+(t0<0?j:t0)+'&';
							tiv[1][k]=ticc;
							if(t0<0){
								tmp['@'+j+'&']={'f':'var', 'c':tk,'v':tk};
								tmpA.push(tk);
								j++;
								ti0=1;
							}
							
						}
					}
				}
				
				
				
				
				tmp['@'+i+'&']={'f':tif, 'c':snake(tiv).join(''), 'v':tiv};	//tiv是数组 [中缀数组, 元素数组]
				tmpA[i]=tic;
				i++;
				
				if(ti0){
					i=j;
				}
			}
		}

		while(/[\+-]?(@\d+[\$&]|[a-zα-ω]) *([\+-] *(@\d+[\$&]|[a-zα-ω]) *)+/i.test(t)){
// consolelog('表达式含+-',t);
			var ti=t.match(/[\+-]?(@\d+[\$&]|[a-zα-ω]) *([\+-] *(@\d+[\$&]|[a-zα-ω]) *)+/ig)[0].replace(/\s/g,''), tif='pms', tic=ti, tiv=split(tic,/[\+-]/g);
// consolelog('ti=',ti);
			var tai=tmpA.indexOf(ti), rg=new RegExp(ti.replace(/[@a-zα-ω]/ig,' *$& *').replace(/[\$\+\-]/g,' *\\$& *'));
				//这里不使用全局g，是因为替换x+y时，会污染z-x+y 、-x+y
			t=t.replace(rg,'@'+(tai<0?i:tai)+'&');
// consolelog('t=',t);
			if(tai<0){
				var ti0=tiv[1][0];
				
				tmpA.push(tic);
				var tA=[].concat(tiv[1]),ti0=0,j=i+1;
// consolelog(tA);
				if(/[a-zα-ω]|-@/i.test(tA.join())){
					for(var k=0,l=tA.length;k<l;k++){
						var tk=tA[k], t0=tmpA.indexOf(tk);
						if(/[a-zα-ω]|-@/i.test(tk)){
						
							if(isVar(tk)){//字母
								var ticc='@'+(t0<0?j:t0)+'&';
								tiv[1][k]=ticc;
								if(t0<0){
									tmp['@'+j+'&']={'f':'var', 'c':tk,'v':tk};
									tmpA.push(tk);
									j++;
									ti0=1;
								}
								
								
							}else if(isVar(tk[1])){//-字母
								var ticc='@'+(t0<0?j:t0)+'&', t1=tmpA.indexOf(tk[1]), ticc1='@'+(t1<0?j+1:t1)+'&';
								tiv[1][k]=ticc;
								if(t0<0){
									tmp['@'+j+'&']={'f':'-', 'c':ticc1};
									tmpA.push('-'+ticc1);
									j++;
									ti0=1;
									
									if(t1<0){
										tmp['@'+j+'&']={'f':'var', 'c':tk[1],'v':tk[1]};
										tmpA.push(tk[1]);
										j++;
									}
									
								}
								
							}else{//-@数字$
								var ticc='@'+(t0<0?j:t0)+'&';
								tiv[1][k]=ticc;
								if(t0<0){
									tmp['@'+j+'&']={'f':'-', 'c':tk.substr(1)};
									tmpA.push(tk);
									j++;
									ti0=1;
								}
								
							}
						}
					}
				}
				
				
				tmp['@'+i+'&']={'f':tif, 'c':snake(tiv).join(''), 'v':tiv};	//tiv是数组 [中缀数组, 元素数组]
				tic=snake(tiv).join('');
				tmpA[i]=tic;
				i++;
				
				if(ti0){
					i=j;
				}
				

			}
		}

		if(/^-(@\d+[&\$]|[a-zα-ω])$/i.test(t)){
// consolelog(' - 只剩一个负项  ',t)
			var tic=t.substr(1),t0=1;
			t='@'+i+'&';
			
			if(isVar(tic)){
				
				var t0=tmpA.indexOf(tic), ticc='@'+(t0<0?i+1:t0)+'&';
				if(t0<0){
					tmp[ticc]={'f':'var', 'c':tic, 'v':tic};
					tmpA.push(ticc,tic);
					tic=ticc;
				}
			}
			
			
			tmp[t]={'f':'-', 'c':tic};
			tmpA[i]='-'+tic;
			i++;
			if(t0<0){
				i++;
			}
		}

		if(isVar(t)){
			
			var tic=t;
			t='@'+i+'&';
			tmp[t]={'f':'var', 'c':tic, 'v':tic};
			tmpA.push(tic);
			i++;
		}

		// consolelog('t,tmp,i,tmpA = ',t,tmp,i,tmpA);
		return t;
	};	
	//return cache(x);
		
	AAA.push(cache(x), tmp, tmpA);
	// consolelog('Mfn.fromStr后 ',AAA);
	return AAA;

	
	},


	toStr4:function(A,p){// 简单情况下的四则运算 latex  补充省略的×号，\d/\d识别为分数线 /识别为÷		参数p 控制/识别为分数线

		var x=A.toStr(1).replace(/(\d+)((\\left)?\()/g,'$1×$2').replace(/(\) *)(\d+)/g,'$1×$2')	// 显示隐藏的×号
		.replace(/\\left\( ([a-z\d]+\/[a-z\d]+)\\right\) /g,'{$1}')	// 去多余的分数括号


		.replace(/\\left\( (\\frac\{\\displaystyle\{\}[a-z\d]+\}\{\\displaystyle\{\}[a-z\d]+\})\\right\) /gi,'{$1}')	// 去多余的分数括号
		//.replace(/\\left\( (\d+)\+00\+(\d+)\/(\d+)\\right\) /g,'$1\\frac{\\displaystyle{}$2}{\\displaystyle{}$3}')	// 带分数

		.replace(/\\left\( (\d+)\+00\+(\\frac\{\\displaystyle\{\}\d+\}\{\\displaystyle\{\}\d+\})\\right\) /g,'$1$2')	// 带分数

		.replace(/(\d+\.\d+)\/(\d+)/g,'$1÷$2')	// 小数
		.replace(/(\d+)\/(\d+\.\d+)/g,'$1÷$2')	// 小数

		.replace(/(\d+)\/(\d+)/g,'\\frac{\\displaystyle{}$1}{\\displaystyle{}$2}');	// 分数

		if(p && !/^-?[a-z]\/[a-z]$/i.test(x)){
			x=x.replace(/([a-z\d+])\/([a-z])/gi,'\\frac{\\displaystyle{}$1}{\\displaystyle{}$2}')
			;	// 分数
		}
		
		x=x.replace(/\//g,'÷')
		.replace(/\+00\+/g,'')

		return x

	},
	toStr:function(A, latex, p, prodCharOn){/*A → 数学表达式str (unicode Math)		latex指定返回LaTeX格式	p指定是否添加括号
			如果A本身就是字符串，则认为是数学表达式，转成LaTeX输出
		*/
		if(isStr(A)){
			return Mfn.fromStr(A).toStr(1)
		}
		var A0=A[0];
		var f=function(x0,nop){//参数nop，指定不保留括号
			var x=x0;
// consolelog('toStr: x = ',x,A[2].join(';'),A);
			if(/^@\d+.$/.test(x) && !A[1][x]){
				
				if(/^@\d+\$$/.test(x)){
					x=x.replace(/.$/,'&')
				}else{
					x=x.replace(/.$/,'$')
				}
				if(!A[1][x]){
					// consolelog('查不到索引',x,A);
					return ''

				}
				
			}
			
			if(/^@\d+[&\$]$/.test(x)){
				
				var o=A[1][x],of=o.f,oc=''+o.c,ov=o.v;
		//	if(!of){return ''}
				
				// consolelog(of, oc, ov,A[1]);
				
				
				if(of=='num'){
					return latex?oc.replace(/%/,'\\$&'):oc
				}
				if(of=='var'){
					return oc	//此处为了防止变量前面有函数字母，产生混淆, 前面需加空格，但加上之后，行列式公式，出现死循环
				}
				if(of=='_'){
					// consolelog(ov);
					var fx=f(ov[0],1)+'_', i=f(ov[1],1);
					if(!latex && /\D\D/.test(i)){
						i=pp(i)
					}
					return fx+(latex?pp(i,'{}'):i)
					
				}				
				
				
				
				if(of=='-'){
// consolelog('负项 ',A[1][oc].c);
					if(/@/.test(A[1][oc].c) && A[1][oc].f=='pms'){//添加必要的括号
						return of+(latex?zp:pp)(f(oc,1))
					}
					
					return of+f(oc,1)
				}
				if(/[!‼#°]/.test(of)){
					var py=1,fx=(latex?of.replace(/#/,'\\$&'):of);
					if(/@/.test(oc)){
						 var cf=A[1][oc].f, t=A[1][oc].c;
					 	if(cf=='()' && /num|var|_/.test(A[1][t].f)){//去括号
					 		py=0;
					 	}
					 	if(cf!='()' && !/num|var|_/.test(A[1][t].f)){//加括号
					 		return (latex?zp:pp)(f(oc,1))+fx;
					 	}
						
					}
					return f(oc,!py)+fx
				}


				if(/[√∛∜]/.test(of)){
					var foc=f(oc,1);
					
					
					
					return latex?kroot(foc,'01√∛∜'.indexOf(of)):of+(nisVid(foc,1)?foc:pp(foc))
				}

				if(/[㏑]/.test(of)){
					var foc=f(oc,1);
					
					
					
					return (latex?'\\ln ':of)+(nisVid(foc,1)?foc:pp(foc))
				}

				if(/[㏒]/.test(of)){// ㏒(x,y)
					//console.log(A[1][oc].c);
					var foc=A[1][A[1][oc].c];
					
					if(!foc){console.log(A);return ''}
					var focv=A[1][A[1][oc].c].v;//[x,y]

					var foc0=f(focv[0],1), foc1=f(focv[1],1);
					
					
					return latex?'\\log_{'+foc0+'}'+(nisVid(foc1,1)?foc1:pp(foc1)):of+pp(foc0+','+focv)
				}
				if(of=='pow'){
					var x0=f(ov[0],1).trim(), x1=f(ov[1],1).trim();

					var x0isVid=nisVid(x0,1), x1isVid=nisVid(x1,1)||nisSupSuffix(x1),
						X0=x0isVid?x0:(latex?zp:pp)(x0), X1=latex?pp(x1,'{}'):(x1isVid?x1:pp(x1));


		
					if(latex && /^1[/].+$/.test(x1)){
						
						return kroot(x0,x1.substr(2))
						
					}
					if(latex){
						var x1_=Mfn.toStr(Mfn.build.A(A,ov[1]));
						if(/^1[/].+$/.test(x1_)){
							return kroot(x0,x1_.substr(2))
						}
					}



					if(!latex && /^1[/][234]$/.test(x1)){
						
						// consolelog('x0=',x0,'X0 =',X0);
						return '√∛∜'[+x1.substr(2)-2]+X0
						
						
					}
					//consolelog(X0,X1);
					return X0+'^'+X1

				}
				
				if(of==','){
					return (latex?zp:pp)(Arrf(f,ov).join(','))

				}



				if(of=='()'){
					return nop?f(oc,1):(latex?zp:pp)(f(oc,1))
				}


				if(of=='||'){
					//consolelog(oc,A);
					return '|'+f(oc,1)+'|'
				}

				if(/^\(.+\)$/.test(of)){
					return (latex?zp:pp)(f(oc.replace(/\(|\)/g,''),1))
				}				
				if(of=='pms'){
					var s=ov[1][0];
					// consolelog('x=',x,'s= ',s,A[1],A[2]);
					if(/@/.test(s) && A[1][s].f=='()'){//去除加减式，首项不必要的括号
						ov[1][0]=A[1][s].c
					}
					for(var i=0,l=ov[1].length;i<l-1;i++){
						var s=ov[1][i+1], py=1, oi=ov[0][i];
						if(/@/.test(s)){
							var sf=A[1][s].f, t=A[1][s].c, sv=A[1][s].v;
							if(sf=='()'){//后面跟括号表达式
								if(/@/.test(t)){
									var tf=A[1][t].f;
									if(oi=='+'){
										if(tf=='pms'){//加减式
											var tt=A[1][t].v[1][0];
											if(/@/.test(tt) && A[1][tt].f!='-'){
												// consolelog('以非负数为首项的加减式，不需要括号',A[1][tt]);
												py=0;
											}
											
										}else if(tf!='-'){//只要不是取反，负数等，也不需要括号
											py=0;
										}
									}
									if(oi=='-'){
										if(['-','pms'].indexOf(tf)<0){//只要不是取反，负数，加减式等，也不需要括号
											py=0;
										}
									}
								}
		
								if(!py){//不需要括号
									ov[1][i+1]=t;
								}

							}else if(sf=='-' || sf=='pms' && !(oi=='+' && sv && isArr(sv,1) && /@/.test(sv[1][0]) && A[1][sv[1][0]].f!='-' )){//需要额外加括号
// consolelog(A, 't = ',t, 'sf = ',sf, 'oi = ',oi, 'sv = ',sv);
								ov[1][i+1]=(latex?zp:pp)(f(s,1));
							}
						}

					}
					
// consolelog(A, 'ov[0] = ',ov[0],'ov[1] = ',ov[1]);
					var a0=ov[0],a1=Arrf(f,ov[1]);
// consolelog(A, 'a0 = ',a0,'a1 = ',a1);
					return snake([a0,a1]).join('')
				}

				if(of=='times'){
					of='tds';
					ov=[copyA('×',ov.length-1),ov];
				}
				if(of=='tds'){

					var s=ov[1][0];//乘积的首项
					
 //console.log('首项',s,A);
					if(/@/.test(s)){
						var sf=A[1][s].f, t=A[1][s].c;
						if(sf=='()' && /@/.test(t)){
							var tf=A[1][t].f, tc=A[1][t].c;
							// consolelog(tf);
							if(tf!='pms' && !(tf=='-' && A[1][tc].f=='tds')){//去除乘除式，首项不必要的括号		if(['-','pms'].indexOf(tf)<0 )
								ov[1][0]=t
							}
						}else if(sf=='pms' || sf=='tds' && /÷/.test(t) && ov[0][0]=='×' || sf=='-' && A[1][t].f=='tds' && A[1][t].v[0]=='÷' ){//首项是加减式，或除式（且后一项是乘元） 或负除式 需要括号
							
							if(latex){
								if(sf!='pms'){//除式
									ov[1][0]=kfrac(f(s,1))
								}else{
									ov[1][0]=zp(f(s,1));
									//console.log(ov[1][0]);
								}
							}else{
								
								ov[1][0]=pp(f(s,1))
							}
							//ov[1][0]=(latex?zp:pp)(f(s,1));
	//console.log('此时 ',latex, ov[1][0]);
						}
					}
					for(var i=0,l=ov[1].length;i<l-1;i++){
						var s=ov[1][i+1], py=1, oi=ov[0][i];
						if(/@/.test(s)){
							var sf=A[1][s].f, t=A[1][s].c;
							
							// consolelog('乘除的每一项（',(i+1),'项）',s, sf, t, A, oi);
							
							if(sf=='()'){//后面跟括号表达式
								if(/@/.test(t)){
									var tf=A[1][t].f;
									// consolelog('tf = ',tf);
									if(oi=='×'){
										if(tf=='tds'){//乘除式
											var tt=A[1][t].v[1][0];
											py=0;
											
										}else if(['-','pms'].indexOf(tf)<0){//只要不是取反，负数等，也不需要括号
											py=0;
										}
									}
									if(oi=='÷'){
										if(['-','pms','tds','times'].indexOf(tf)<0){//只要不是取反，负数，加减式，乘除式等，也不需要括号
											py=0;
										}
									}
								}
		
								if(!py){//不需要括号
									ov[1][i+1]=t;
								}


							}else if(['-','pms'].indexOf(sf)>-1 || sf=='tds' && !(oi=='×' && /@/.test(A[1][s].v[1][0]) && A[1][A[1][s].v[1][0]].f!='-' )){//需要额外加括号

							//	ov[1][i+1]=(latex?zp:pp)(f(s,1));
								
								if(latex){
									if(sf=='tds'){//除式
										ov[1][i+1]=kfrac(f(s,1))
									}else{
										ov[1][i+1]=zp(kfrac(f(s,1)))
									}
								}else{
									
									ov[1][i+1]=pp(f(s,1));
								}
								
								
							}
						}

					}
					
				 //console.log('latex',latex,' ov[] = ',ov[0], ov[1],A);
					var a0=ov[0],a1=Arrf(f,ov[1]);
				// consolelog(' a0 = ',a0, ' a1 = ',a1);
					for(var i=0,l=a1.length;i<l-1;i++){//简化乘法符号
						var a=a1[i],b=a1[i+1],oi=a0[i], av=isVar(a), bv=isVar(b),
						//	an=a[0]=='@' && A[1][a].f=='num', bn=b[0]=='@' && A[1][b].f=='num',
						//	ap=a[0]=='(' || a[0]=='@' && A[1][a].f=='()', bp=b[0]=='(' || b[0]=='@' && A[1][b].f=='()';
							an=nisd(a), bn=nisd(b), avi=nisVid(a), bvi=nisVid(b),
							ap=a[0]=='(' || /\^/.test(a), bp=b[0]=='(' || /\^/.test(b);
						
						if(oi=='×'){
					// consolelog(' a = ',a, ' b = ',b);
							//if(av || ap || bp || (av || an) && bv || av && bn){
							//if((av || ap || bp || avi && bv || av && bn) && !prodCharOn ){
							
					
							//
							if(!(/\d$/.test(a) &&  /^\d/.test(b)) && !prodCharOn){
								a0[i]='';
				// consolelog(' a0 = ',a0);
							}
							
						}
						if(oi=='÷'){
							//a0[i]='/'	会修改A
						}
					}
					var y=snake([a0,a1]).join('').replace(/÷/g,'/');
					return /^-?\d+\/\d+$/.test(y) && latex?kfrac(y):y
				}// tds结束

 //consolelog(of);

				var isinv=/⁼/.test(of),of0=of.replace(/⁼/,''), fx=latex?(ZLR(SBS.Latex.func).indexOf(of0)<0?kxf(of0):'\\'+of0)+(isinv?'^{-1}':''):' ', s=oc;
				
				if(/@/.test(s)){
					// consolelog('s = ',s,' A[1][s] == ',A[1][s],'A[1] = ',A[1]);
					// consolelog('oc =  ',oc,'o = ',o);
					var sf=A[1][s].f, t=A[1][s].c;
					if(/@/.test(t)){
						if(sf=='()'){
							var tf=A[1][t].f;
							if(['var','num'].indexOf(tf)>-1){//去除不必要的括号
								ov=t
							}
						}
						if(sf!='()'){
							var tf=A[1][t].f;
							if(['var','num'].indexOf(tf)<0){//加括号
								ov=pp(t)
							}
						}
					}
				}
				
				//console.log(fx, ov,oc);
				if(!ov){
					return simExpression(fx+' '+f(oc,1))
				}
				return simExpression(fx+' '+f(ov,1))

				
			}
			return x
			
		};
		//return f(A0)
		
		return (p?(latex?zp:pp)(f(A0,1)):f(A0,1))
	},


	opr1:function(op,arr,sim,p){//一元运算(结果)	sim是参数，指定是否递归化简			p是参数
		// console.log('Mfn.opr1 op = ',op,'arr = ',arr,' p =',p);
		var A=isArr(arr)?Mfn.build.A(arr):Mfn.fromStr(arr), A0=A[0], oA=A[1][A0],of=oA.f,oc=oA.c,ov=oA.v;
		// consolelog('A = ',A);
		if(op=='type'){//公式类型（最外层的运算）
			return A[1][A[0]].f
		}

		if(op=='obj'){//返回Num类数学对象（Integer, Decimal, Frac, Root）	或 Polynomy
			var t=Mfn.toStr(A);
			return Num.fromStr(t)||Polynomy.fromStr(t)||A
		}

		if(op=='obj.type'){//返回对象子类型
			return Mfn.opr1('obj',A).type
		}

		if(op=='≈'){//直接求出最终近似解，返回整数、小数或复小数形式		参数sim指定小数位数精度
			if(of=='num'){
				return A.toStr()
			}
			
			
			
			
		}
	/*
		if(op=='ref'){//引用子对象，返回新Mfn
			Mfn.build.A(A,p)
			
		}
	*/
	
		if(op=='导数'){//
//console.log(of,Mfn.has.var(A),A);
			if(of=='var' || of=='_'){
				return Mfn.build.Num(1)
			}
			if(of=='num' || !Mfn.has.var(A)){
				return Mfn.build.Num(0)
			}
			
			if(of=='()'){
				A[0]=oc;
				return Mfn.opr1('导数',A,sim,p)
			}
			if(of=='-'){
				A[0]=oc;
				return Neg(Mfn.opr1('导数',A,sim,p),sim)
			}
			if(of=='pms'){
//console.log(snake([ov[0],seqA(0,l)]).join(''));
				var l=ov[1].length, B=Mfn.fromStr(snake([ov[0],seqA(0,l)]).join('')), bp={};
				for(var i=0;i<l;i++){
					var oi=ov[1][i];
					bp['@'+i+'$']=Mfn.opr1('导数',Mfn.build.A(A,oi),sim,p)
				}
				var C=Mfn.opr1(':',B,'',bp);

				return sim?Mfn.opr1('=',C,'',p):C

			}

			if(of=='times' || of=='tds' && ov[0].indexOf('÷')<0){

				var ist=of=='times', l=(ist?ov:ov[1]).length, B=Mfn.fromStr(snake([copyA('+',l-1),seqA(0,l)]).join('')), bp={};
				for(var i=0;i<l;i++){
					var oi=ist?ov[i]:ov[1][i],pi={};
					pi[oi]=Mfn.opr1('导数',Mfn.build.A(A,oi),sim,p);
					bp['@'+i+'$']=Mfn.opr1(':',B,'',pi);
				}
				var C=Mfn.opr1(':',B,'',bp);

				return sim?Mfn.opr1('=',C,'',p):C

			}


			if(of=='tds' && ov[0].length==1 && ov[0][0]=='÷'){

				var l=ov[1].length, o10=ov[1][0], o11=ov[1][1], bp={}, B;
				
				if(A[1][o10].f=='num' && A[1][o10].c=='1'){// 1/g    ->    -g'/g^2
					
					var t=A.ref(2);

					A[1][A0].v[1][1]=A.ref(o11+'^'+t);

					bp[o10]=Neg(Mfn.opr1('导数',Mfn.build.A(A,o11),sim,p));
					
					B=Mfn.opr1(':',A,'',bp);

					return sim?Mfn.opr1('=',B,'',p):B
				}
				

				// ( f′g−fg′)	/ g^2

				var f=Mfn.build.A(A,o10), g=Mfn.build.A(A,o11), f_=Mfn.opr1('导数',f,sim,p), g_=Mfn.opr1('导数',g,sim,p);
				return Divide([Minus([Times([f_, g]),Times([f, g_])]), Pow([g,2])],sim)

			}

			if(of=='pow'){
				var l=ov[1].length, o10=ov[1][0], o11=ov[1][1], bp={}, B;
				if(A[1][o10].f=='num'){// a^x
					
					var t=A.ref('㏑2');

					A[1][A0].v[1][1]=A.ref(o11+'^'+t);

					bp[o10]=Neg(Mfn.opr1('导数',Mfn.build.A(A,o11),sim,p));
					
					B=Mfn.opr1(':',A,'',bp);

					return sim?Mfn.opr1('=',B,'',p):B
				}

			}

		}
	

	
		if(op=='=='){//深度递归化简			bug	Mfn.opr1('=',Mfn.fromStr('1-25/(45+2)')).toStr()		Mfn.opr1('=',Mfn.fromStr('(25/9)^(1/2)-23'))
			var fresh=0;
			for(var i=0;i<A[2].length;i++){
				var ai='@'+i+'&',Ai=A[1][ai];
				if(!Ai){
					ai='@'+i+'$';Ai=A[1][ai];
				}
				
				if(Ai && A[2].join('').indexOf(ai)>-1 && !/num|var|_/.test(Ai.f)){
					var af=Ai.f,ac=ai.c,av=ai.v;

					if(af=='times'){
						for(var j=0,jl=av.length;j<jl;j++){
							
						}
					}
					if(af=='pow'){
						
						
					}
					
					if(/tds|pms/.test(af)){
						
						
					}
					if(af=='-'){
						
					}
				}
				
				
				
			}
			
			
			
		}










		if(op=='='){//普通化简（尽量不涉及递归运算）		此时参数p，指定数学对象环境（数域Num，矩阵Mtrx，布尔逻辑Bool）
 //console.log(' = 开始化简 A',A,' of = ',of);
			if(of=='num' || of=='var' || of=='_'){
				
				return A
			}

			Mfn.simp(A,'','()');//去括号
			
			if(of=='()'){
				A[0]=oc;
				return Mfn.opr1('=',A,sim,p)
			}
			
			
			
			
			if(of=='-'){
				var co=A[1][oc], cof=co.f, coc=co.c, cov=co.v;
				if(cof=='var' || cof=='num' || cof=='_'){
					return A
				}
				if(cof=='tds' && cov[0].length+cov[1].length==3 && cov[0][0]=='÷' && A[1][cov[1][0]].f=='num' && A[1][cov[1][1]].f=='num'){
					// consolelog(A[1][cov[1][0]].c, A[1][cov[1][1]].c);
					return Mfn.fromStr('-'+FracReduct([A[1][cov[1][0]].c, A[1][cov[1][1]].c]))
				}
				
				
				// consolelog('负值化简','co = ',co,' cof = ',cof,' coc = ',coc,' cov = ',cov,'arr = ',arr);
				
				if(cof=='-'){
					A[0]=coc;
					
				}else if(cof=='times'){
					cov.unshift(A.ref(-1));
					
					co.v=cov;
					A[1][oc]=co;
					A[0]=oc;
					
				}else if(cof=='tds'){
					cov[0].unshift('×');
					cov[1].unshift(A.ref(-1));


					co.v=cov;
					A[1][oc]=co;
					A[0]=oc;
					
				}else if(cof=='pms'){
					cov[0]=Arrf(opinv,cov[0]);// - (a-b+c)  →  (a+b-c)	→  (-a+b-c)
					var c0=cov[1][0], o0=A[1][c0], o0f=o0.f, o0c=o0.c, o0v=o0.v;
// consolelog('o0 =', o0, 'cov = ',cov);
					if(o0f=='-'){
						
// consolelog('o0f==- o0c = ', o0c);
						cov[1][0]=o0c;
						
					}else{
						cov[1][0]=A.ref('-'+c0);
					}
					A[1][oc].v=cov;
					A[0]=oc;
					
				}else if(cof=='pow'){
					A[0]=oc;
					return Mfn.opr1('-',Mfn.opr1('=',A))
					
				}else if(ZLR('sin csc tan cot sh csch th cth').indexOf(cof)>-1){
					if(A[1][coc].f=='-'){
						A[1][coc]=A[1][A[1][coc].c];
						A[0]=coc;
					}else{
						return Mfn.opr1('-',Mfn.opr1('=',A))
					}

				}else{
					A[0]=coc;
					return Mfn.opr1('-',Mfn.opr1('=',A))
				}
				
				// consolelog('=化简 - ',A);
				return Mfn.opr1('=',A)
			}
			
			$.each(A[1],function(i,v){//去括号
				if(v.f=='()'){
					A[1][i]=A[1][v.c];
				}
				
				
			});
			if(ZLR('cos sec ch sech').indexOf(of)>-1){
				var co=A[1][oc], cof=co.f, coc=co.c, cov=co.v;
				if(cof=='-'){//偶函数
					oc=coc;
					A[1][A0].c=coc;
					co=A[1][oc];
					cof=co.f;
					cov=co.v;
				}
				if(cof=='num'){//
					if(coc=='0'){
						return Mfn.fromStr(1);
					}
					if(coc=='π' && ZLR('cos sec').indexOf(of)>-1){
						return Mfn.fromStr(-1);
					}
					
					return A
				}
				
				if(cof=='°'){//度数
					oc=coc.replace(/.$/,'');
					co=A[1][oc];
					cof=co.f;
					cov=co.v;
					var n=+cov.toStr() % 360, n1=Math.abs(360-n);
					if(of=='cos'){
						if(!n){
							return Mfn.fromStr(1);
						}
						if(n==15 || n1==15){
							return Mfn.fromStr('(√6+√2)/4');
						}
						if(n==30 || n1==30){
							return Mfn.fromStr('√3/2');
						}
						if(n==45 || n1==45){
							return Mfn.fromStr('1/√2');
						}
						if(n==60 || n1==60){
							return Mfn.fromStr('1/2');
						}
						if(n==75 || n1==75){
							return Mfn.fromStr('(√6-√2)/4');
						}
						if(n==90 || n1==90){
							return Mfn.fromStr(0);
						}
						if(n==105 || n1==105){
							return Mfn.fromStr('(√2-√6)/4');
						}
						if(n==120 || n1==120){
							return Mfn.fromStr('-1/2');
						}
						if(n==135 || n1==135){
							return Mfn.fromStr('-1/√2');
						}
						if(n==150 || n1==150){
							return Mfn.fromStr('-√3/2');
						}
						if(n==165 || n1==165){
							return Mfn.fromStr('-(√6+√2)/4');
						}
						if(n==180){
							return Mfn.fromStr('-1');
						}

					}

				}

				if(cof=='var' || cof=='_'){
					return A
				}
				
				
				if(Mfn.has.var(A,oc)){

					
				}else{
					if(cof=='tds'){//π/2, /3, /4
						
						
						
					}
				}
				
				A[0]=co;
				A=Mfn.opr1('=',A);

				A[0]=A.ref(of+A[0]);;
				
				return A
			}


			if(ZLR('sin').indexOf(of)>-1){
				var co=A[1][oc], cof=co.f, coc=co.c, cov=co.v;

				
				if(cof=='°'){//度数
					oc=coc.replace(/.$/,'');
					co=A[1][oc];
					cof=co.f;
					cov=co.v;
					var n=+cov.toStr() % 360, n1=n-180;
					if(of=='sin'){
						if(!n || !n1){
							return Mfn.fromStr(0);
						}
						if(n==15 || n1==-15){
							return Mfn.fromStr('(√6-√2)/4');
						}
						if(n==30 || n1==-30){
							return Mfn.fromStr('1/2');
						}
						if(n==45 || n1==-45){
							return Mfn.fromStr('1/√2');
						}
						if(n==60 || n1==-60){
							return Mfn.fromStr('√3/2');
						}
						if(n==75 || n1==-75){
							return Mfn.fromStr('(√6+√2)/4');
						}
						if(n==90){
							return Mfn.fromStr(1);
						}
						if(n1==15 || n1-180==-15){
							return Mfn.fromStr('(√2-√6)/4');
						}
						if(n1==30 || n1-180==-30){
							return Mfn.fromStr('-1/2');
						}
						if(n1==45 || n1-180==-45){
							return Mfn.fromStr('-1/√2');
						}
						if(n1==60 || n1-180==-60){
							return Mfn.fromStr('-√3/2');
						}
						if(n1==75 || n1-180==-75){
							return Mfn.fromStr('-(√6+√2)/4');
						}
						if(n1==90){
							return Mfn.fromStr('-1');
						}


					}

				}


			}

			if(of=='pms'){// 加减式化简
 //console.log('pms 化简 ov=',ov.join(' ; '));



				if(ov[0].length==1){
					//console.log('比较x,y');
					//console.log(A);
					var x=Mfn.build.A(A,ov[1][0]), y=Mfn.build.A(A,ov[1][1]), y_=Mfn.opr1('-',Mfn.build.A(A,ov[1][1])), ov00=ov[0][0];
					if(Mfn.is.b2['=='](x, y)){
						//console.log('x=y');
						if(ov00=='-'){
							return Mfn.fromStr(0)
						}else{
							var t=A.ref(2);
							A[0]=A.ref(ov[1][0]+'×'+t);
							//console.log('x+x',A);
							return Mfn.opr1('=',A)
						}

					}else if(Mfn.is.b2['=='](x, y_)){
						//console.log('x=-y');
						if(ov00=='+'){
							return Mfn.fromStr(0)
						}else{
							var t=A.ref(2);
							A[0]=A.ref(ov[1][0]+'×'+t);
							//console.log('x--x',A);
							return Mfn.opr1('=',A)
							
						}
					}

					//console.log('比较x,y 后');
					//console.log(A);
				}
	



				for(var i=0;i<ov[1].length;i++){/*平面化	a-(b-c+d)+e	变成 a-b+c-d+e		a+(b-c+d)+e	变成 a+b-c+d+e
							a-(-b-c+d)+e	变成 a+b+c-d+e			a+(-b-c+d)+e	变成 a-b-c+d+e
					*/
					var oi=A[1][ov[1][i]], oif=oi.f, oic=oi.c, oiv=oi.v;
					if(oif=='pms'){
						if(i){
							if(ov[0][i-1]=='-'){
								oiv[0]=['-'].concat(Arrf(opinv,oiv[0]))
								
							}else{
								oiv[0]=['+'].concat(oiv[0])
							}
							
							
							ov[0].splice(i-1,1);
							ov[1].splice(i,1);
							for(j=0,l=oiv[0].length;j<l;j++){
								ov[0].splice(i-1,0,oiv[0][l-j-1]);
								ov[1].splice(i,0,oiv[1][l-j-1]);
							}
							
							
						}else{//首项也是加减式
							/*
			a-b
			c+d-e
				c+d-e-b
								*/
							//oiv[0]=oiv[0].concat('+');
							ov[0]=oiv[0].concat(ov[0]);
							ov[1]=oiv[1].concat(ov[1].slice(1));
							
							
						}
						


					}
					if(oif=='-'){
						//console.log('负值','ov[0]',ov[0],'ov[1]',ov[1]);
						if(i){
							ov[0][i-1]=opinv(ov[0][i-1]);
							ov[1][i]=oic;
						}else{

							
							//首项是负项，暂时不处理
						}

					}
				}

				for(var i=0;i<ov[1].length;i++){/*平面化第2步	-(-x) 化成x
					*/
					var oi=A[1][ov[1][i]], oif=oi.f, oic=oi.c, oiv=oi.v;
					if(oif=='-'){
						//console.log('负值','ov[0]',ov[0],'ov[1]',ov[1]);
						if(i){
							ov[0][i-1]=opinv(ov[0][i-1]);
							ov[1][i]=oic;
						}else{

							
							//首项是负项，暂时不处理
						}

					}
				}


		

				var o0=A[1][ov[1][0]], o0f=o0.f, o0c=o0.c, o0v=o0.v;
				/*
				if(o0f=='-'){
					console.log('首项是负项',ov.join(' ; '));
					ov[0].unshift('-');
					ov[1][0]=o0c;
					ov[1].unshift(A.ref(0));
					console.log(A.ref(0));
					console.log('首项是负项，改成',ov.join(' ; '));

				}
*/

				var i=ov[0].indexOf('+'),o0=A[1][ov[1][0]];
				if(i>-1 && o0.f=='-'){//-a...+b	变成 b-a...
// consolelog('-a...+b	变成 b-a...');
					ov[0][i]='-';
					ov[1][0]=ov[1][i+1];
					ov[1][i+1]=o0.c;

				}
				
				A[1][A0].v=ov;
	
 //console.log('平面化后 ov = ',ov.join(' ;;; '));
	
				var B0=[],B1=[],B2=0;//分别记录有理常数系数，含变量（以及根式常数等）表达式	有理数
				
// consolelog('ov = ',ov);
				for(var i=0;i<ov[1].length;i++){//把每一项（加减元），分离常数和变量[常数, 变量]
					var o1i=ov[1][i],oi=A[1][o1i], oif=oi.f, oic=oif=='var'||oif=='_'?'1×'+o1i:oi.c, oiv=oi.v, B1i=B1.indexOf(oic), neg0=!i && oif=='-', negi=i && ov[0][i-1]=='-' || neg0;
					
					if(oif=='var' || oif=='_'){
					//	o1i='1×'+o1i;
						
						var ojc=oic;// 1×a÷b	 1×a	 1÷b
						var B1j=B1.indexOf(ojc);
						
						if(B1j>-1){
							B0[B1j]=fracOpr(negi?'-':'+',B0[B1j],1)
							
						}else{
							B1.push(ojc);
							B0.push((negi?'-':'')+1)	//negi ^ /-/.test(1)
							
						}
						continue;
						
						
					}
					
					// consolelog('i = ',i);
					
					// consolelog('B1i = ',B1i,' B1[] = ',B1.join(' ; '));
					// consolelog('o1i = ',o1i,'oic = ',oic);
					if(neg0){//负项（且不是首项）
						o1i=oic;
						oi=A[1][o1i];
						oif=oi.f;
						oic=oi.c;
						oiv=oi.v;
						
					}

					
					// consolelog('i = ',i,'oif = ',oif,'oic = ',oic);

					if(oif=='num'){
						B2=fracOpr(negi?'-':'+',B2,oic)
						
					}else if(oif=='tds' || oif=='times'){//分离有理系数
						if(oif=='times'){
							oiv=[copyA('×',oiv.length-1),oiv];
						}
						var k='1',newV=[[],[]];//中缀运算符数组	元素数组
						for(var j=0,l=oiv[1].length;j<l;j++){
							var o0j=oiv[0][j-1], o1j=oiv[1][j], dividej=j && o0j=='÷';
							if(Mfn.is.b1.frac(A,o1j)){
								var kj=Mfn.toStr(Mfn.build.A(A,o1j));
								k=fracOpr(dividej?'/':'*',k,kj);

							}else if(A[1][o1j].f=='times'){
								var o1jo=A[1][o1j],o1jov=o1jo.v;
								for(var m=0,n=o1jov.length;m<n;m++){
									var om=o1jov[m];
									if(Mfn.is.b1.Var(A,om)){//是广义变量（含下标形式）
										newV[0].push(dividej?'÷':'×');
										newV[1].push(om);
									}else{//num
										var kj=Mfn.toStr(Mfn.build.A(A,om));
										k=fracOpr(dividej?'/':'*',k,kj);
										if(k=='0'){
											break 
										}
									}
									
								}

							}else{
								newV[0].push(dividej?'÷':'×');
								newV[1].push(o1j);
								
							}
							if(k=='0'){
								break 
							}
							if(newV[1].length >1 && p!='Mtrx'){//不是矩阵，则一般满足乘法交换律，此时乘法靠前，除法靠后
								var nV0=[],nV1=[];//分别记录乘元，除元
								for(var m=0,n=newV[1].length;m<n;m++){
									if(newV[0][m]=='×'){
										nV0.push(newV[1][m]);
									}else{
										nV1.push(newV[1][m]);
									}
								}
								
								
								// ×÷相消		抵消
								for(var ii=0;ii<nV0.length && nV1.length;ii++){
									var ni=nV0[ii],nj=nV1.indexOf(ni);
									if(nj>-1){
										nV0.splice(ii,1);
										nV1.splice(nj,1);
										ii--;
									}
								}
								
								
								if(nV0.length){

									newV[0]=['×'];
									if(nV0.length>1){
										nV0.sort(function(x,y){// 乘元 排序
											return Mfn.toStr(Mfn.build.A(A,x))<Mfn.toStr(Mfn.build.A(A,y))?-1:0;
										});
										newV[1]=[A.ref(nV0.join(''))];

									}else{
										newV[1]=nV0;
									}
								}else{
									newV[0]=[];
									newV[1]=[];
								}
								if(nV1.length){

									newV[0].push('÷');
									if(nV1.length>1){
										nV1.sort(function(x,y){// 除元 排序
											return Mfn.toStr(Mfn.build.A(A,x))<Mfn.toStr(Mfn.build.A(A,y))?-1:0;
										});
										newV[1].push(A.ref(nV1.join('')));

									}else{
										newV[1].push(nV1[0]);
									}
								}
								
							}
							
							
							
						}
						if(k=='0'){
							
						}else if(newV[0].length){
					// consolelog('k = ',k);
							// consolelog('中缀运算符数组	元素数组 newV = ',newV.join(' ; ; '));
							
							newV[1].unshift(1);
							
							var ojc=snake(newV).join('');// 1×a÷b	 1×a	 1÷b
							var B1j=B1.indexOf(ojc);
							
							if(B1j>-1){
								B0[B1j]=fracOpr(negi?'-':'+',B0[B1j],k)
								
							}else{
								B1.push(ojc);
								B0.push((negi ^ /-/.test(k)?'-':'')+k)
								
							}
							
						}else{//有理常数
							
							B2=fracOpr(negi?'-':'+',B2,k)
						}

						
					}else{//Mfn.has.var(A,o1i)	oif=='var'
					
						// consolelog('非乘积形式或单常数、单变量形式的表达式 B1i = ',B1i,' B1 = ',B1.join(' ; '),' B0 = ',B0.join(' ; '));
						if(B1i>-1){
							B0[B1i]=fracOpr(negi?'-':'+',B0[B1i],1)
							
						}else{
							
							// consolelog('oif = ',oif,'oic = ',oic,'o1i=',o1i);
						//	B1.push(oif=='var'?o1i:oic);
							B1.push(o1i);
							B0.push(negi?-1:1)
							
							
						}
						
					}
				}//每一项加减元，遍历结束
				
				
				
				B2=''+B2;
				
			//	console.log('有理常数系数 B0 = ',B0, '复杂表达式 B1 = ',B1,' 有理数 B2 = ',B2,'A = ',A);
				
				var C=[[],[]];//正项 负项
				for(var i=0;i<B0.length;i++){//B0有理系数数组，B1未知表达式数组
					var B0i=''+B0[i],Ci=0;
					if(B0i!='0'){
						if(B0i[0]=='-'){//负有理系数
							Ci=1;
							B0i=B0i.substr(1);
							//[123] 1/x ; 2/3 1/x
						}
						var B1i=B1[i];//表达式 
						// consolelog('单个复杂表达式 B1i = ',B1i,'有理系数数组 B0 = ',B0, '未知表达式数组B1 = ',B1, 'i = ',i,'相应有理系数B0i = ',B0i);
						if(/1×.+÷/.test(B1i)){
							
							if(B0i=='1'){
								B1i=B1i.substr(2);
							}
							var t0=A.ref(B1i),t=t0;

							
							if(B0i!='1'){//有理系数

								t=A.ref(B0i);

								t=A.ref(t+'×'+t0);
							}
							
							C[Ci].push(t);

						}else if(/1÷/.test(B1i)){//1÷
							B1i=B1i.substr(2);

							var t=A.ref(B0i);

							C[Ci].push(A.ref(t+'÷'+B1i));

						}else{//纯引用	或/1×/.test(B1i)

							if(/1×/.test(B1i)){
								B1i=B1i.substr(2);
							}
							if(B0i=='1'){
								
								C[Ci].push(B1i);
							}else{
								var t=A.ref(B0i);
	
								C[Ci].push(A.ref(t+B1i));
							}
						}
					}
					
				}
				
				//console.log('正负项数组：C = ',C,'B0 = ',B0, 'B1 = ',B1,  'B2 = ',B2);

				if(C[0].length && C[1].length){
					
					
					// +-相消		抵消
					for(var i=0;i<C[0].length && C[1].length;i++){
						var ni=C[0][i],nj=C[1].indexOf(ni);
						if(nj>-1){
							C[0].splice(i,1);
							C[1].splice(nj,1);
							i--;
						}
					}
					
				}
				
				if(C[0].length+C[1].length){
					
					//console.log('C=',C, 'B2=',B2);
					
					
					if(B2!='0'){

						var t=A.ref(B2.replace(/-/,''));
					}



					if(C[0].length>1){
						C[0].sort(function(x,y){// 加元排序
							//return Mfn.toStr(Mfn.build.A(A,x))<Mfn.toStr(Mfn.build.A(A,y))?-1:0;
							var a=Mfn.toStr(Mfn.build.A(A,x)), b=Mfn.toStr(Mfn.build.A(A,y));
							return sortBy.chrnum(a,b)
						});
					}
					if(C[1].length>1){
						C[1].sort(function(x,y){// 减元排序
							var a=Mfn.toStr(Mfn.build.A(A,x)), b=Mfn.toStr(Mfn.build.A(A,y));
							return sortBy.chrnum(a,b)
						});
					}

					//console.log('加、减元：C=',C, 'B2=',B2);
					
					if(C[0].length){// 有加元

						if(C[0].length==1 && C[1].length==0 && B2=='0'){
							A[0]=C[0][0];
							return A
						}
						
						var s=C[0].join('+')+(C[1].length?'-'+C[1].join('-'):'')+(B2!='0'?(B2[0]=='-'?'-':'+')+t:'');
						
					}else if(!/[-0]/.test(B2[0])){//正有理数
						var s=t+'-'+C[1].join('-');

					}else{//首项是负项
						
						C[1][0]=A.ref('-'+C[1][0]);
						var s=C[1].join('-')+(B2!='0'?'-'+t:'');
						
					}
//console.log('s=',s);
					A[0]=A.ref(s);
					
					return A
						
				}else{
					//console.log('只剩下有理数');
					return Mfn.fromStr(B2)
					
				}
				
				return A
			}
			
			if(of=='tds' || of=='times'){// 乘除式化简
				
// consolelog('化简 ',of,'ov = ',ov.join(' ;; '),A);
				if(of=='tds' && ov[0].length+ov[1].length==3 && ov[0][0]=='÷' && A[1][ov[1][0]].f=='num' && A[1][ov[1][1]].f=='num'){// 是分数
					// consolelog(A[1][ov[1][0]].c, A[1][ov[1][1]].c);
					return Mfn.fromStr(FracReduct([A[1][ov[1][0]].c, A[1][ov[1][1]].c]))
				}

				if(of=='tds' && ov[0].length==1 && /[×÷]/.test(ov[0][0]) &&
					A[1][ov[1][0]].f=='√' && A[1][ov[1][1]].f=='√' && 
					A[1][A[1][ov[1][0]].c].f=='num' && A[1][A[1][ov[1][1]].c].f=='num'){// 是两个根数
					// consolelog(ov[0][0],A[1][A[1][ov[1][0]].c].c,A[1][A[1][ov[1][1]].c].c);
					return Sqrt(fracOpr(ov[0][0],A[1][A[1][ov[1][0]].c].c,A[1][A[1][ov[1][1]].c].c),1)

				}

				if(of=='tds' && ov[0].length==1 && /[÷]/.test(ov[0][0]) &&
					Mfn.is.b2['=='](Mfn.build.A(A,ov[1][0]), Mfn.build.A(A,ov[1][1]))){// 是两个相同值相除

					return Mfn.fromStr(1)

				}

				if(of=='tds' && ov[0].length==1 && /[÷]/.test(ov[0][0]) &&
					Mfn.is.b2['=='](Mfn.build.A(A,ov[1][0]), Mfn.opr1('-',Mfn.build.A(A,ov[1][1])))){// 是两个相反值相除
					return Mfn.fromStr(-1)

				}


				if(of=='times'){
					ov=[copyA('×',ov.length-1),ov];
				}
				
				
				var k=1;
				for(var i=0;i<ov[1].length;i++){/* 乘除平面化	a÷(b÷c×d)	变成 a÷b×c÷d		a×(b÷c÷d) 变成 a×b÷c÷d
					
					*/
					var oi=A[1][ov[1][i]], oif=oi.f, oic=oi.c, oiv=oi.v;
					if(oif=='tds'){
						if(i){
							var isdivi=ov[0][i-1]=='÷';
							if(isdivi){
								oiv[0]=['÷'].concat(Arrf(opinv,oiv[0]))
								
							}else{
								oiv[0]=['×'].concat(oiv[0])
							}
							
							
							ov[0].splice(i-1,1);
							ov[1].splice(i,1);
							
							if(isdivi && p=='Mtrx'){//矩阵求逆，tds里面元素要逆序（因为不满足乘法交换律）
							
								for(j=0,l=oiv[0].length;j<l;j++){
									ov[0].splice(i-1,0,oiv[0][0]);
									ov[1].splice(i,0,oiv[1][0]);
								}
							}else{
								for(j=0,l=oiv[0].length;j<l;j++){
									ov[0].splice(i-1,0,oiv[0][l-j-1]);
									ov[1].splice(i,0,oiv[1][l-j-1]);
								}
							}
							
						}else{//首项也是乘除式

							//oiv[0]=oiv[0].concat('×');
							ov[0]=oiv[0].concat(ov[0]);
							ov[1]=oiv[1].concat(ov[1].slice(1));
						}
					}
					if(oif=='times'){
						if(i){

							ov[0]=copyA(ov[0][i-1],oiv.length-1).concat(ov[0]);
							ov[1].splice(i,1);
							for(j=0,l=oiv.length;j<l;j++){
								ov[1].splice(i,0,oiv[l-j-1]);
							}
							
							
						}else{//首项也是乘式

							ov[0]=copyA('×',oiv.length-1).concat(ov[0]);
							ov[1]=oiv.concat(ov[1].slice(1));
						}
					}
					
					
					if(oif=='-'){
						if(i){
							k=-k;
							ov[1][i]=oic;
						}else{
							
							if(!Mfn.is.b1.frac(A,o1c)){// 首项是 负式，但不是负有理数，也需提取系数-1
								k=-k;
								ov[1][i]=oic;
								
							}
							
							
							//首项是负项，暂时不处理
						}

					}
				}
				k=''+k;
				
				// consolelog('k = ',k);
				
				
				var newV=[[],[]],isnegk=0;// newV[中缀运算符A，元素A]		抽取有理系数
				for(var j=0,l=ov[1].length;j<l;j++){
					var o0j=ov[0][j-1], o1j=ov[1][j], dividej=j && o0j=='÷';
					
					if(Mfn.is.b1.frac(A,o1j)){
						
						// consolelog('乘积的一项，是有理数，A = ',A,'o1j = ',o1j,'A[1][o1j] = ',A[1][o1j],'o0j = ',o0j);
						var kj=Mfn.toStr(Mfn.build.A(A,o1j));
				// consolelog('k = ',k,'j = ',j, 'kj = ',kj,'j = ',j,'o0j = ', o0j,'dividej = ',dividej);
						//k=Mfn.oprs(dividej?'/':'*',[k,kj],1).toStr();
						k=fracOpr(dividej?'/':'*',k,kj);


				// consolelog('k = ',k,'j = ',j, 'kj = ',kj);
				
					}else if(A[1][o1j].f=='times'){
						
						var o1jo=A[1][o1j],o1jov=o1jo.v;
						for(var m=0,n=o1jov.length;m<n;m++){
							var om=o1jov[m];
							if(Mfn.is.b1.Var(A,om)){
								newV[0].push(dividej?'÷':'×');
								newV[1].push(om);
							}else{//num
								var kj=Mfn.toStr(Mfn.build.A(A,om));
								//console.log('k=',k,'kj = ',kj,' om = ',om,'dividej= ',dividej);
								k=fracOpr(dividej?'/':'*',k,kj);
								//k=Mfn.oprs(dividej?'/':'*',[k,kj],1).toStr();
				 //console.log('k = ',k,'j = ',j,' m = ',m);
								if(''+k=='0'){
									break 
								}
							}
							
						}
//consolelog('中缀运算符数组',newV[0].join('；'));
//consolelog('乘积项数组 ',newV[1].join('；'));


/*
					}else if(A[1][o1j].f=='pow'){
						
						var o1jo=A[1][o1j],o1jov=o1jo.v;
*/


					}else if(A[1][o1j].f=='tds'){
						
						var o1jo=A[1][o1j],o1jov=o1jo.v, o1joc=o1jo.c, tdsA=o1jov[0], o1jov1=o1jov[1];

						//consolelog(o1jo,o1jov,o1joc);
						for(var m=0,n=o1jov1.length;m<n;m++){
							var om=o1jov1[m], dividem=m && tdsA[m-1]=='÷';
							if(Mfn.is.b1.Var(A,om)){
								newV[0].push(dividej ^ dividem?'÷':'×');
								newV[1].push(om);
							}else{//num
								//consolelog(A,om);
								var kj=Mfn.toStr(Mfn.build.A(A,om));
								//consolelog('k = ',k,'kj = ',kj,' m = ',m);
								k=fracOpr(dividej ^ dividem?'/':'*',k,kj);
				// consolelog('k = ',k,'j = ',j,' m = ',m);
								if(''+k=='0'){
									break 
								}
							}
							
						}
/*
						//consolelog(newV[0][0],A[1][newV[1][0]]);
						if(newV[0][0]=='×' && A[1][newV[1][0]].c=='1'){
							newV[0].shift();
							newV[1].shift();
						}
*/
					}else{
						
						newV[0].push(dividej?'÷':'×');
						newV[1].push(o1j);
						
					}
					if(k=='0'){
						break 
					}

				}

 //consolelog('中缀运算符数组 变成',newV[0].join('；'));
 //consolelog('乘积项数组 变成',newV[1].join('；'),newV,A);

				if(k=='0'){
					return Mfn.fromStr(0)
				}

				if(newV[1].length >1 && p!='Mtrx'){//不是矩阵，则一般满足乘法交换律，此时乘法靠前，除法靠后
					
					var nV=[],nVP=[];//底，相应幂次数组
					for(var m=0,n=newV[1].length;m<n;m++){
						var n1m=newV[1][m], isn0mTime=newV[0][m]=='×', mo=A[1][n1m], ismop=mo.f=='pow', mi=nV.indexOf(n1m);
						
						if(mi>-1){//查到索引（显然一定是底）
							if(A[2][n1m]=='0'){
								return Mfn.fromStr(0)
							}
							
							nVP[mi].push(A.ref(isn0mTime?1:-1));
							// consolelog('查到索引（显然一定是底）',nVP.join(' ;; '),A[2].join(' ---- '));

						}else if(ismop){//是幂形式
							var mov0=mo.v[0], mov1=mo.v[1];
							
							// consolelog('是幂形式 mov0=',mov0,'mov1=',mov1);
							if(A[2][+mov0.replace(/\D/g,'')]=='0'){
								return Mfn.fromStr(0)
							}


							mi=nV.indexOf(mov0);
							
							if(mi<0){
								mi=nV.length;
								nV.push(mov0);
								nVP.push([]);
								// consolelog('是幂形式',nVP.join(' ;; '),A[2].join(' ---- '));
							}
							
							
							/*
							if(Mfn.is.b1.frac(A,mov1)){//幂是有理数
								nVPn[mi]=nVPn[mi]?fracOpr(isn0mTime?'+':'-',nVPn[mi], Mfn.build.A(A,mov1).toStr()):Mfn.build.A(A,mov1).toStr()
							}else{
							//	nVPv[mi]=nVPv[mi]?Mfn.simRef(A,A.ref(nVPv[mi]+'+'+mov1)):mov1

							}
							
							*/
							// consolelog('mi = ',mi);
							
							nVP[mi].push(isn0mTime?mov1:A.ref('-'+mov1))
							
							// consolelog(nVP.join(' ;; '),'A[2] = ',A[2].join(' ---- '));
							
						}else{//是底，未查到索引
							nV.push(n1m);
							nVP.push([A.ref(isn0mTime?1:-1)]);

							// consolelog('是底，未查到索引',nVP.join(' ;; '));
						}
					}
					
					
					//consolelog('底，nV=',nV.join(' ; '),'相应幂次数组 nVP=',nVP.join(' ; '),A,'k = ',k);
					
					var nV0=[],nV1=[];//乘元，除元
					for(var m=0,n=nV.length;m<n;m++){
						var nm=nV[m], nmP=nVP[m], //底，幂数组
							nmo=A[1][nm],nmof=nmo.f,nmoc=nmo.c,nmov=nmo.v; //底

						// consolelog('m=',m,'底 = ',nm,'幂数组 = ',nmP);
						if(nmof=='num'){//底是数
							if(nmoc=='1'){//1的任何次幂都是1
								nVP[m]=nm
							}else{
								
								
								
							}
							
							
							
						}
						
						
						if(isArr(nmP)){
							if(nmP.length>1){
								// consolelog('幂数组 ，做一次加法');
						
								var B=Mfn.build.A(A), Bi=B[2].length;
								B[0]='@'+Bi+'&';
								B[1][B[0]]={'f':'pms', 'c':nmP.join('+'), 'v':[copyA('+',nmP.length-1),nmP]};
								B[2].push(nmP.join('+'));
								
								var mo={};
								// consolelog(B,A,'B[2] = ',B[2].join(' ; '));
								
								// consolelog(B[0]);
								
								
								mo[B[0]]=Mfn.opr1('=',B,1).toStr();
								
								// consolelog(mo);
								Mfn.opr1(':',A,1,mo);
								nmP=B[0];
								// consolelog('化简为表达式，外换元后 A=',A,'nm = ',nm);
			
								
								
							}else{
								nmP=nmP[0]
							}
							
							var nmPo=A[1][nmP],nmPof=nmPo.f,nmPoc=nmPo.c,nmPov=nmPo.v; //幂
							
							// consolelog('幂 nmPof=',nmPo.f,'nmPoc=',nmPo.c,'nmPov=',nmPo.v,'A =', A);
							
							if(nmPof=='num'){
								if(nmPoc=='0'){
									
									
									
								}else if(nmPoc=='1'){
									nV0.push(nm)
									
									
								}else{
									
									nV0.push(A.ref(nm+'^'+nmP))
									
									
								}
								
								
								
								
							}else if(nmPof=='-'){
								
								
								
								var oi=A[1][nmPoc], oif=oi.f, oic=oi.c, oiv=oi.v;
								if(oif=='num'){
									if(oic=='1'){
										nV1.push(nm)
									
									
									}else{
										
										nV1.push(A.ref(nm+'^'+nmPoc))
										
										
									}
									
								}else{
									nV1.push(A.ref(nm+'^'+nmPoc))
									
									
								}
								
							}else if(nmPof=='pms' && nmPov[0].indexOf('+')<0 && A[1][nmPov[1][0]].f=='-'){// a^(-b-c)型
								nmP=A.ref([A[1][nmPov[1][0]].c].concat(nmPov[1].slice(1)).join('+'))
								nV1.push(A.ref(nm+'^'+nmP))
								
								
							}else{
								nV0.push(A.ref(nm+'^'+nmP))
							}
							
						}
						
						

						
					}//底幂 循环结束
					
					
			

					var nV0=[],nV1=[], nVV0=[], nVV1=[];//乘元，除元
					for(var m=0,n=newV[1].length;m<n;m++){

						if(newV[0][m]=='×'){
							
							
							
							
							nV0.push(newV[1][m]);
							nVV0.push(A[1][newV[1][m]].c);
						}else{
							
							
							
							
							nV1.push(newV[1][m]);
							nVV1.push(A[1][newV[1][m]].c);
						}
					}
					
					// ×÷相消		抵消
					for(var i=0;i<nV0.length && nV1.length;i++){
						var ni=nV0[i],nj=nV1.indexOf(ni);
////consolelog(nV1,ni,'nVV',nVV1,nVV0[i]);
						if(nj<0){
							nj=nVV1.indexOf(nVV0[i]);
						}


						if(nj>-1){
							nV0.splice(i,1);
							nV1.splice(nj,1);
							i--;
						}
					}
					
					
			 //consolelog('乘法交换律处理：newV[1] = ',newV[1], 'newV[0] = ',newV[0], '乘元 nV0 = ',nV0, ' 除元 nV1 = ',nV1);
					
					
					if(nV0.length){

						newV[0]=['×'];
						if(nV0.length>1){
							//consolelog('乘元排序',nV0);
							nV0.sort(function(x,y){// 乘元排序
								return Mfn.toStr(Mfn.build.A(A,x))<Mfn.toStr(Mfn.build.A(A,y))?-1:0;
							});
							newV[1]=[A.ref(nV0.join(''))];

						}else{
							newV[1]=nV0;
						}
					}else{
						newV[0]=[];
						newV[1]=[];
					}
					if(nV1.length){

						newV[0].push('÷');
						if(nV1.length>1){
							nV1.sort(function(x,y){// 除元排序
								return Mfn.toStr(Mfn.build.A(A,x))<Mfn.toStr(Mfn.build.A(A,y))?-1:0;
							});
							newV[1].push(A.ref(nV1.join('')));
						}else{
							newV[1].push(nV1[0]);
						}
					}
					
				}//乘法交换律 处理结束
				
				
				
				// consolelog('k = ',k);

				// consolelog('newV = ',newV.join('；'));
				

				
				

				
				
				if(newV[0].length){//有中缀运算符

					if(/-/.test(k)){
						isnegk=1;
						k=k.substr(1);
					}
					
					
					// consolelog('有中缀运算符 newV = ',newV.join(' ----- '));
					
					
					
						
					//乘法结合律	相邻项相同，或是同底的幂（幂合并）
					var nV0=[],nV1=[];//乘元，除元

				// consolelog('结合律处理完毕');
					
				
					
					
					
					
					
					
					
					
					
					
					newV[1].unshift(1);
					
					var ojc=snake(newV).join('');// 1×a÷b	 1×a	 1÷b
					
					var B1i=ojc;
					//consolelog('B1i = ',B1i,'k = ',k, 'k = ',k,'t0=',t0,'A = ');
					if(/1×.+÷/.test(B1i)){


						//if(+k==1){
							B1i=B1i.substr(2);
						//}
//consolelog(B1i);
						var t0=A.ref(B1i),t=t0;

						if(+k!=1){//有理系数

							t=A.ref(k);

							t=A.ref(t+'×'+t0);
							
						}
						A[0]=t;
//consolelog(A[0],t0,A);
					}else if(/1÷/.test(B1i)){//1÷
						B1i=B1i.substr(2);
// consolelog('B1i = ',B1i,'k = ',k);
						var t=A.ref(k);
// consolelog('t = ',t);
						A[0]=A.ref(t+'÷'+B1i);
// consolelog(A[0],A);
					}else{//纯引用	或/1×/.test(B1i)

						if(/1×/.test(B1i)){
							B1i=B1i.substr(2);
						}
						
// consolelog(k,B1i);
						
						if(k=='1'){
							A[0]=B1i;

						}else{
							var t=A.ref(k);

							A[0]=A.ref(t+B1i);
						}
					}
					
					if(isnegk){
// consolelog(A[0]);
						A[0]=A.ref('-'+A[0]);
					}
					
					
					return A
					
				}else{//有理常数
					
					return Mfn.fromStr(k)
				}
					
			}//tds化简完毕
			

			if(/√∛∜/.test(of)){
				//of='pow';

			}
			
			if(of=='pow'){
 //console.log('化简 pow（仅部分情况）， 以及其他情况暂不化简');
				
				var o0=A[1][ov[0]], o0c=o0.c, o0v=o0.v, o0f=o0.f,
					o1=A[1][ov[1]], o1c=o1.c, o1v=o1.v, o1f=o1.f;
				
				if(o0f=='num'){
					if(o0c=='0'){// 0^x
						return Mfn.fromStr(0);
					}
					if(o0c=='1'){// 1^x
						return Mfn.fromStr(1);
					}
					if(o0c=='-1'){// (-1)^x
						
					}
					
					
					
				}
				
				
				
				
				if(o1f=='num'){
					if(o1c=='0'){// x^0
						if(p=='Mtrx'){
							return Mfn.fromStr('I');
						}
						return Mfn.fromStr(1);
					}
					if(o1c=='1'){// x^1
						A[0]=ov[0]
						return Mfn.opr1('=',A,sim,p);
					}
					
				}
				if(o1f=='-' && p!='Mtrx'){
					if(o0f=='tds' && o0v[0].length==1 && o0v[0][0]=='÷'){// (a/b)^(-x) =(b/a)^x
						
						A[1][ov[0]].v[1]=[o0v[1][1],o0v[1][0]]
						
						A[1][A0].v[1]=o1c;
						return Mfn.opr1('=',A,sim,p);
					}
					
					if(A[1][o1c].f=='num' && A[1][o1c].c=='1'){// ^(-1)	=1/
						


						A[0]=ov[0];
						return Mfn.opr1('1/',A,sim,p);
						
						
					}
				}
				
				//console.log(ov);
				if(Mfn.is.b1.frac(A,ov[0]) && Mfn.is.b1.frac(A,ov[1])){//有理数幂
					var a=Mfn.build.A(A,ov[0]).toStr(),b=Mfn.build.A(A,ov[1]).toStr();
				 //console.log(a,b,fracOpr('^',a,b));
					return Mfn.fromStr(fracOpr('^',a,b))
				}else{
					
					
				}
				
				
			}
			
			
			
			
			
			
			return A
		}
		



		if(op==':num'){//内换元（数值）赋值或换数		参数p对象{'x':1, 'y':'2%', 'z':'0.73', '@4$':'6.8', 'π':'3.1415926', '2%':'4.5'}	键(变量单字母、@\d$引用、num值)：值（num值，非负整数、非负（百分）小数）
				// consolelog(':num内换元  p = ',p,'A = ',A);
			var iA=[];
			$.each(p,function(i,v){
				if((i+'')[0]=='@'){
					iA.push([i.replace(/\D/g,''),v])
				}else{
					iA.push([A[2].indexOf(i+''),v])
				}
			});
			for(var i=0,l=iA.length;i<l;i++){
				var i0=iA[i][0], ii='@'+i0+'&',iv=iA[i][1];
				// consolelog('num内换元ii , iv ',ii,iv);
				if(!A[1][ii]){
					ii='@'+i0+'$'	//注意，这里从num转变成var, 键没跟着改（@$ → @&），是因为会影响其他表达式的引用
				}
				if(A[1][ii]){
					// consolelog('num内换元',A[1][ii]);
					A[1][ii]={'f':'num','c':iv,'v':Decimal.fromStr(iv)};
					A[2][i0]=iv;
					// consolelog('数值替换 ',iv);
				}
				
			}
			// consolelog(':num A[2] = ',A[2].join(' ; '),'p: ',p);
			return A
		}
		
		
		if(op==':var'){//内换元（变量），置换变量		参数p对象{'x':'y', 'a':'b', '@2$':'c', '@3&':'d', '2.71828':'e'}键(变量单字母、@引用、num值)：值（变量单字母）
			
			var iA=[];
			$.each(p,function(i,v){
				if((i+'')[0]=='@'){
					iA.push([i.replace(/\D/g,''),v])
				}else{
					iA.push([A[2].indexOf(i+''),v])
				}
			});
			// consolelog('内换元 iA = ',iA.join('; '));
			for(var i=0,l=iA.length;i<l;i++){
				var i0=iA[i][0], ii='@'+i0+'&',iv=iA[i][1];
				if(!A[1][ii]){
					ii='@'+i0+'$'	//注意，这里从num转变成var, 键没跟着改（@$ → @&），是因为会影响其他表达式的引用
				}
				if(A[1][ii]){
					A[1][ii]={'f':'var','c':iv,'v':iv};
					A[2][i0]=iv;
				}
// consolelog('A[1][',ii,'] = ',A[1][ii],'A[2][',i0,'] = ',A[2][i0],A[2],A[1]);
			//	Mfn.uniRef(A,iv);		此处不能用，因为换元后，精简变量（无法确定后续是否有操作），可能影响后续的引用


			}
			return A
		}
		
		if(op==':@'){//内换元（引用），内部替换成内部引用		参数p对象{'x':'@1$', 'a':'@2&', '@2$':'@3&', '@3&':'@4&', '2.71828':'@5&'}键(变量单字母、@引用、num值)：值（内部引用@）

			var iA=[];
			$.each(p,function(i,v){
				if((i+'')[0]=='@'){
					iA.push([i.replace(/\D/g,''),v])
				}else{
					iA.push([A[2].indexOf(i+''),v])
				}
			});
			
			// consolelog('内换元 （引用） iA = ',iA.join('; '));
			for(var i=0,l=iA.length;i<l;i++){
				var i0=iA[i][0], ii='@'+i0+'&',iv=iA[i][1];
				if(!A[1][ii]){
					ii='@'+i0+'$'	//注意，这里从num转变成var, 键没跟着改（@$ → @&），是因为会影响其他表达式的引用
				}
				if(A[1][ii]){
					A[1][ii]=A[1][iv];
					A[2][i0]=iv;
				}
				
			}
			return A
		}
		


		if(op=='::'){//外换元（对象），从外面引进Mfn对象		参数p对象{'x':A, 'a':B, '@2$':C, '@3&':D, '2.71828':E}键(变量单字母、@引用、num值)：值（Mfn对象）
			// //consolelog('::外换元',p);
			var iA=[];
			$.each(p,function(i,v){

				if((i+'')[0]=='@'){
					iA.push([i.replace(/\D/g,''),v])	//明确给出的大索引序号, 对象

				}else{
					iA.push([A[2].indexOf(i+''),v])		//通过查找得到大索引序号, 对象
				}
			});

			for(var i=0,l=iA.length;i<l;i++){
				var i0=iA[i][0], ii='@'+i0+'&',iv=iA[i][1];
				if(!A[1][ii]){//未查到@ &索引
					ii='@'+i0+'$'	//注意，这里从num转变成var, 键没跟着改（@$ → @&），是因为会影响其他表达式的引用
				}


				if(A[1][ii]){//查到@ 索引

					//consolelog('查到@ 索引',ii,A[1][ii]);
					var y=iv[1][iv[0]];

					if(!y){
						continue
					}

					var yf=y.f, yc=y.c, yt=iv[2][+iv[0].replace(/\D/g,'')], Al=A[2].length;
					
					
					

					if(yf=='num' || yf=='var'){//数值、变量	// || yf=='_'
						/*
							if(yf=='num'){
								iv='@'+Al+'$';
							}else{
								iv='@'+Al+'&';
							}
							
							A[1][ii]=y;
							A[2].push(iv);
						*/
			// consolelog('外换元（对象）数值、变量 yc = ',yc);
						A[1][ii]=A[1][A.ref(yc)];
					
					}else{//其它复合表达式	直接嫁接到A
						$.each(iv[1],function(k,v){//遍历外部Mfn的索引关系
							var vf=v.f, k2=k.replace(/\d+/,function(x){return +x+Al});
							
	// consolelog('外部Mfn 索引 ',k,' 值 ',v);
							

							if(vf=='num' || vf=='var'){// || vf=='_'){
								
							}else{
								v.c=v.c.replace(/@\d+[&\$]/g,function(r){return r.replace(/\d+/g,function(x){return +x+Al})})
								if(v.v && isArr(v.v)){
									if(isArr(v.v,1)){
										// consolelog('二维中缀数组 v.v = ', v.v.join(' ; '));
										v.v[1]=Arrf(function(r){return r.replace(/\d+/g,function(x){return +x+Al})},v.v[1]);
										
									}else{

										// consolelog('数组 v.v = ', v.v.join(' ; '));

										v.v=Arrf(function(r){return r.replace(/\d+/g,function(x){return +x+Al})},v.v);
									}
								}
							}
							A[1][k2]=v;
							
	// consolelog('变成内部 索引 ',k2,' 值 ',v);
						});
						
						
						A[2]=A[2].concat(Arrf(function(r){return /@/.test(r)?r.replace(/\d+/g,function(x){return +x+Al}):r},iv[2]));

						var iv=iv[0].replace(/\d+/,function(x){return +x+Al});
						A[1][ii]=A[1][iv];

						A[2][i0]=A[2][+iv.replace(/\D/g,'')];
						
						//consolelog('开始统一变量别称 uniRef, A[2] = ',A[2].join(' '));
						//Mfn.uniRef(A);	此处启用会出现问题
					}

				}
				
			}
			return A
		}
		

		
		if(op==':'){//外换元，换函数，换数，赋值等			参数p对象{'x':'y', 'a':'-a', 'sin':'cos'}	键(变量单字母、@引用、num值、函数名)：值（Mfn对象、变量单字母、num数值、表达式字符串、内部引用@、函数名）
			 //consolelog('外换元: 开始 A[2] = ',A[2].join(' ; '),'p = ',p);

			$.each(p,function(i,v){
				var o={};
				o[i]=v;
				
			 
				if(isArr(v)){//数组，即Mfn对象

					A=Mfn.opr1('::',A,sim,o)
					
				}else if(isVar(v) || v=='*'){// A^*伴随矩阵
					A=Mfn.opr1(':var',A,sim,o)
						
				}else if(/@/.test(v)){
					A=Mfn.opr1(':@',A,sim,o)
					
				}else if(/^\d+(\.?\d)*[%‰‱]?$/.test(v)){
					// consolelog('外换元p:',p,'i= ',i,'v= ',v,'A = ',A);
					A=Mfn.opr1(':num',A,sim,o)
						
				}else if(ZLR(SBSFUN.replace(/⁻¹/g,'⁼')).indexOf((''+v).replace(/⁻¹/g,'⁼'))>-1){
					var v0=(''+v).replace(/⁻¹/g,'⁼'), i0=i.replace(/⁻¹/g,'⁼');
					// consolelog('是函数:',v0);
					
					$.each(A[1],function(k,vv){
						if(vv.f==i0){
							vv.f=v0;//A[1][k].f=v0;
							A[2][+k.replace(/\D/g,'')]=A[2][+k.replace(/\D/g,'')].replace(i0,v0)
						}
					});
				
				}else{//表达式字符串

					o[i]=Mfn.fromStr(v);
					A=Mfn.opr1('::',A,sim,o)
				
				}
				
			});


			return A

		}



//有理数的代数运算

		if(sim){//指定是否深度递归化简
			return Mfn.opr1('=',p?Mfn.opr1(op,A,'',p):Mfn.opr1(op,A))
		}
		

 //console.log('op = ',op);
		if(Mfn.is.b1.frac(A)){
			var Fr=FracReduct(Mfn.toStr(A));//bug 这里需弃用toStr	嫌慢
			 //console.log('A是有理数 ',Fr);
			var s=Frac.opr1(op,Fr,p);
			// consolelog('有理数一元运算结果 ',s);
			return Mfn.fromStr(isStr(s)?s:s.toStr())
		}

		
		if(op=='||'){//绝对值

			
			if(of=='-'){// |-x| = |x|
				A[0]=oc;
				return Mfn.opr1('||',A,sim)
			}

			if(of=='num'){
				A[0]=oc;
				return A
			}


			//一般情况下 |x|
			A[0]=A.ref('|'+A0+'|');
			return A

		}



//下面是常见一元代数运算：

		if(op=='-'){//相反数
			
			if(of=='-'){// - (-x) = x
				A[0]=oc;
				return A
			}
// consolelog('相反数 ',A);
			//一般情况下 -x
			

			A[0]=A.ref('-'+A0);

// consolelog('相反数后 ',A);
			return A

		}
		if(op=='1/'){//倒数

			if(of=='-'){// 1/(-x) = -(1/x)
				
// consolelog('1/- ',A[0]);
				
				A[0]=oc;
				return Mfn.opr1('-',Mfn.opr1('1/',A,sim),sim)
			}
			
			if(of=='tds' && ov[0].length==1 && ov[0][0]=='÷' && ov[1].length==2){
				
// consolelog('1/ , tds ov=',ov);
				if(ov[1][0][0]=='@' && A[1][ov[1][0]].f=='num' && A[1][ov[1][0]].c=='1'){// 1/ (1/x)  = x
					A[0]=ov[1][1];
					return A
				}
				A[1][A0].v=[ov[0],ov[1].reverse()];	// 1/(a/b) = b/a
				
				return A
			}
			if(of=='pow' && ov.length==2){
				if(ov[1][0]=='@'){
					var o1=A[1][ov[1]];
					if(o1.f=='-'){
						if(A[1][o1.c].f=='num' && A[1][o1.c].c=='1'){// 1/ x^(-1) = x
							A[0]=ov[0];
							return A
						}
						A[1][A0].v=[ov[0],o1.c]; // 1 / x^(-y) = x^y
						
						return A
					}

				}

			}
			if(of=='sin'){
				A[1][A0].f='csc';
				return A
			}
			if(of=='csc'){
				A[1][A0].f='sin';
				return A
			}
			if(of=='cos'){
				A[1][A0].f='sec';
				return A
			}
			if(of=='sec'){
				A[1][A0].f='cos';
				return A
			}
			if(of=='tan'){
				A[1][A0].f='cot';
				return A
			}
			if(of=='cot'){
				A[1][A0].f='tan';
				return A
			}

			if(of=='sh'){
				A[1][A0].f='csch';
				return A
			}
			if(of=='csch'){
				A[1][A0].f='sh';
				return A
			}
			if(of=='ch'){
				A[1][A0].f='sech';
				return A
			}
			if(of=='sech'){
				A[1][A0].f='ch';
				return A
			}
			if(of=='th'){
				A[1][A0].f='cth';
				return A
			}
			if(of=='cth'){
				A[1][A0].f='th';
				return A
			}




			//一般情况下		1/x
			var t=A.ref(1);
			A[0]=A.ref(t+'÷'+A0);
			return A


		}
		if(op=='^2'){
			if(of=='-'){// (-x)^2 = x^2
				A[0]=oc;
				return Mfn.opr1('^2',A,sim)
			}
			if(of=='√'){// (√x)^2 = x
				A[0]=oc;
				return A
			}
			if(of=='∜'){// (∜x)^2 = √x
				A[1][A0].f='√';
				return A
			}



			if(of=='pow' && ov.length==2){
				var s1=Mfn.build.A(A,ov[1]), st=s1.toStr();

				//if(ov[1][0]=='@' && A[1][ov[1]].f=='tds' && /^@\d+\$,@\d+\$$/.test(A[1][ov[1]].c) && ov[0][0]=='÷' && ){// ( x^(1/2) )^2 = x
				if(st=='1/2' || st=='0.5'){// ( x^(1/2) )^2 = x
					A[0]=ov[0];
					return A
				}
				
				// (x^y)^2 = x^(2y)
				
				/*
				A[1][A0].v=[ov[0],ov[1]];
				return A
				*/
				var o={};o[ov[1]]=Mfn.oprs('×',[Mfn.build.A(A,ov[1]),'2'],1);
		
				return Mfn.opr1(':',A,sim,o)	//换元
			}



			//一般情况下	x^2
		
			var t=A.ref(2);
			A[0]=A.ref(A0+'^'+t);
			return A
		}
		if(op=='^3'){

			if(of=='-'){// (-x)^3 = -x^3
				A[0]=oc;
				return Mfn.opr1('-',Mfn.opr1('^3',A,sim),sim)
			}
			if(of=='∛'){// (∛x)^3 = x
				A[0]=oc;
				return A
			}


			if(of=='pow' && ov.length==2){
				var s1=Mfn.build.A(A,ov[1]), st=s1.toStr();

				if(st=='1/3'){// ( x^(1/3) )^3 = x
					A[0]=ov[0];
					return A
				}
				
				// (x^y)^3 = x^(3y)
				
				/*
				A[1][A0].v=[ov[0],ov[1]];
				return A
				*/
				var o={};o[ov[1]]=Mfn.oprs('×',[Mfn.build.A(A,ov[1]),'3'],1);
				return Mfn.opr1(':',A,sim,o)	//换元
			}



			//一般情况下	x^3
			var t=A.ref(3);
			A[0]=A.ref(A0+'^'+t);
			return A
			
		}
		if(op=='√'){

//console.log('of=',of);
			if(of=='√'){// √(√x) = ∜x
				A[1][A0].f='∜';
				return A
			}




			if(of=='pow' && ov.length==2){// √(x^2) = |x|
				var s1=Mfn.build.A(A,ov[1]), st=s1.toStr();


				if(st=='2'){// √(x^2) = |x|
					A[0]=ov[0];
					return Mfn.opr1('||',A,sim)
				}
				
				// √(x^y) = x^(y/2)
				
				/*
				A[1][A0].v=[ov[0],ov[1]];
				return A
				*/
				var o={};o[ov[1]]=Mfn.oprs('÷',[Mfn.build.A(A,ov[1]),'2'],1);
				return Mfn.opr1(':',A,sim,o)	//换元
			}



			console.log('一般情况下	√x');
			A[0]=A.ref('√'+A0);
			
			return A
		}
		if(op=='∛'){

			if(of=='pow' && ov.length==2){
				var s1=Mfn.build.A(A,ov[1]), st=s1.toStr();


				if(st=='3'){// ∛(x^3) = x
					A[0]=ov[0];
					return A
				}
				
				// ∛(x^y) = x^(y/3)
				
				/*
				A[1][A0].v=[ov[0],ov[1]];
				return A
				*/
				var o={};o[ov[1]]=Mfn.oprs('÷',[Mfn.build.A(A,ov[1]),'3'],1);
				return Mfn.opr1(':',A,sim,o)	//换元
			}



			//一般情况下	∛x
			A[0]=A.ref('∛'+A0);

			return A
		}
		
		if(op=='∜'){
			

			if(of=='pow' && ov.length==2){
				var s1=Mfn.build.A(A,ov[1]), st=s1.toStr();


				if(st=='4'){// ∜(x^4) = |x|
					A[0]=ov[0];
					return Mfn.opr1('||',A,sim)
				}
				
				// ∜(x^y) = x^(y/4)
				
				/*
				A[1][A0].v=[ov[0],ov[1]];
				return A
				*/
				var o={};o[ov[1]]=Mfn.oprs('÷',[Mfn.build.A(A,ov[1]),'4'],1);
				return Mfn.opr1(':',A,sim,o)	//换元
			}



			//一般情况下	∜x
			A[0]=A.ref('∜'+A0);

			return A
		}
	},


	oprs:function(op,arr,sim,p){/*多元运算	op中缀运算符字符串，或同级运算符数组 	arr对象(或表达式字符串)数组	sim是参数，指定是否深度化简		p参数（数学环境）		返回Mfn对象

*/

// consolelog(sim);
		var l=arr.length, isAop=isArr(op), ops=isAop?[].concat(op):copyA(op,l-1), a=seqA(0,l),B=[];


//	// consolelog('oprs  :     ',op,'arr = ',arr,'str = ',snake([ops,seqA(0,l)]).join('')); 

		var o={};

		for(var i=0;i<l;i++){
			var ai=arr[i];
			if(isArr(ai)){
				o['@'+i+'$']=ai
			}else{
				o['@'+i+'$']=''+arr[i]
			}
		}
		// consolelog('oprs  :     ',op,'准备换元  o =',o);
		
		
		//consolelog(snake([ops,a]).join(''), o);

		var A=Mfn.opr1(':',Mfn.fromStr(snake([ops,a]).join('')),'',o);
		 //consolelog('下面去括号');
		Mfn.simp(A,'','()');//去括号

	
		return sim?Mfn.opr1('=',A,'',p):A


	},



	

}, Polynomy={/*多元多项式（一种典型（含未知变量）的函数、重要的数学表达式）	复数的算术运算（i^2 = -1），矩阵多项式（乘法不可交换）的化简都依赖它

		为了与其他开源的多项式库Polynomial区别开，改用Polynomy名字

		用n维矩阵来存储n元多项式，
		与1元多项式（使用数组存储）有区别

	*/









//下列涉及表达式类型识别

},eType=function(e){/*表达式类型	(形式判断，不考虑化简结果)
	numN:	自然数（非负整数）	
	numI:	整数				
	numD:	小数
	numF:	分数
	numQ:	有理数
	numA:	代数数
	numR:	实数
	numC:	复数
	

					
	nump:	幂									±a^b
	nump_n:	非负整幂（正整数次幂）				±a^n
	nump_i:	整幂（整数次幂）					±a^(±n)
	nump_r:	根（单位分数次幂，整数倒数次幂）	±a^(±1/n)
	nump_f:	分数幂（分数次幂，有理数次幂）		±a^(±m/n)

	*/



//下列涉及操作符类型识别

},oType=function(o){/*操作符类型
	返回数学实体名称
	
	*/
	if(/[∍∌∋⋑⊋⊉⊇⊅⊃⊂⊄⊆⊈⊊⋐∈∉∊]/.test(o)){
		return 'set'
	}
	if(/[=≠≡≢≣≈≉≋≥>≰|≱<≤]/.test(o)){
		return 'Num'
	}
	if(/[≻⊁⋡≽⋟≿⋩⊱⊰⋨≾⋞≼⋠⊀≺]/.test(o)){//抽象对象 偏序
		return 'Abstract'
	}



//下列涉及运算符 运算

},opneg=function(o){// 运算符取相反
	if(o[0]=='-'){
		return o.substr(1);
	}else{
		return '-'+o
	}

},opinv=function(o){/* 运算符取逆
	
	a^b ，x开b次方：x^(1/b)	逆运算得到a		(a^b)^(1/b)=a
		log_a(x) 逆运算得到b				log_a(a^b)=b
	
	log_a(b) , a^x	逆运算得到b				a^(log_a(b))=b
			b^(1/x) 逆运算得到a			b^(1/log_a(b)) = a
	*/
	if(o=='+'){return '-'}
	if(o=='-'){return '+'}
	if(o=='*'){return '/'}
	if(o=='/'){return '*'}
	if(o=='×'){return '÷'}
	if(o=='÷'){return '×'}

//下列涉及上下文处理（增加括号避免歧义、按数学习惯简化公式写法）

},pptd=function(t,atFirst,notlatex){//乘除环境	t是Mfn或者字符串，atFirst指定是否是第一项	返回字符串
	//console.log(pptd,t);
	var a=isArr(t),A=a?t:Mfn.fromStr(t), x=Mfn.opr1('type',A);
	//console.log('type',x);
	if(!a){
		if(/^1$/.test(t)){
			return ''
		}
		if(''+t=='-1' && atFirst){
			return '-'
		}
	}

// consolelog(x);

	if(x=='pms' || x=='-' && !atFirst){//加括号
		return Mfn.toStr(A,!notlatex,1)
	}
// consolelog(A,!notlatex);
	return Mfn.toStr(A,!notlatex)

},pppow=function(t,notlatex){//指数的底数环境（阶乘环境也适用）	t是Mfn对象或者字符串 	返回字符串
	var a=isArr(t),A=a?t:Mfn.fromStr(t), x=Mfn.opr1('type',A);
	
	if(x=='_' || x=='var' || x=='num'){
		return Mfn.toStr(A,!notlatex)
	}
	return Mfn.toStr(A,!notlatex,1)

}, simExpression=function(s){
	return (''+s).replace(/([^a-z]) +([a-z])/gi,'$1$2').replace(/^-0$/,'0').trim()


},simFactTimes=function(a){/*简化乘式中的阶乘a!
	a 数学表达式
	
	
	a=0,1，返回''
	a<3，返回计算结果a!
	
	否则，返回形式表达式
	
		返回latex字符串
		*/
	if(/^[01]$/.test(a) || ''+a==''){
		return ''
	}
	if(+a<3){
		return Fact(a)
	}
	return pppow(a)+'!'
	
},simTimesOf1=function(a,pms,tds){/*简化a(pms)tds
	被乘数	a 是数学表达式，不能是Latex字符串（因为a是乘积首项，要预先使用pptd(a,1)处理，而pptd处理Latex会报错！）
	乘数	pms(加减式 latex)
	乘数	tds(乘除式 latex)
	

		返回latex字符串
		*/
	var k=pptd(a,1);
	
	if(pms){
		if(k===''){
			return tds?zp(pms)+tds:pms
		}
		
		return k+zp(pms)+(tds||'')
	}
	
	if(k===''){
		return tds||''
	}
	if(k=='-' && !tds){
		return '-1'
	}
	
	
	if(/\d$/.test(k) && /^\d/.test(tds)){
		return k+'×'+tds
	}
	return tds?k+tds:a


},simPowOf1=function(a,b,pms,tds){/*简化a^b(pms)tds
	被乘式
		底数a  数学表达式
		指数b  数学表达式
	乘式 pms	加减式latex
	乘式 tds	乘除式latex
	
	如果a=1，则幂简化成1，并省略；
		否则a^b(pms)tds

		返回latex字符串
		*/
	
	if(''+a=='0'){
		return '0'
	}
	if(pms){
		if(''+a=='1'){
			return tds?zp(pms)+tds:pms
		}
		return pppow(a)+'^{'+b+'}'+zp(pms)+(tds||'')
	}
	return ''+a=='1'?(tds||''):pppow(a)+'^{'+b+'}'+(tds||'')

},simFracOf1=function(b,pmsA,tds){/*简化 /b pmsA tds

	分母b 数学表达式
	乘式 pmsA 加减式数组[符号数组, 元素数组(元素是latex字符串)]
	乘式 tds 乘除式latex
	
	
	
	
	如果b=1，则直接简化成分子
		(pms)tds 

	如果b=-1，则直接简化成分子的相反数
		
		pmsA符号数组中有-，(-pms)tds
		否则-(pms)tds 

	
	
	如果b是其它负数，
	
		pmsA符号数组中有-，(-pms)tds/_b
		否则-(pms)tds /_b

	
	其余情况，(pms)tds /b 
		
		
		
		返回latex字符串
		*/
	

	var t0=(tds && pmsA?zp(snake(pmsA).join('')):(pmsA?snake(pmsA).join(''):''))+(tds||''), t0_='-'+t0, hasneg=pmsA && pmsA[0].indexOf('-')>-1;
	if(hasneg){
		/*
		a-b+c 变成	b-c-a
		
		-a+b-c 变成 a+c-b
		*/
		var posA=[],negA=[];
		
		for(var i=0;i<=pmsA[0].length;i++){
			var a=pmsA[1][i], o=i?pmsA[0][i-1]:'+';
			if(i && o=='-'|| !i && /^-/.test(a)){
				posA.push(pmsA[1][i])
			}else{
				negA.push(pmsA[1][i])
			}
		}
		
		var pms=posA.join('+')+(negA.length?'-'+negA.join('-'):''), t1=tds?zp(pms)+tds:pms;
		
	}
	if(''+b=='1'){
		return t0
	}
	if(''+b=='-1'){
		if(hasneg){
			
			return t1
		}else{
		
			return t0_
			
		}
	}
	
	if(/^-/.test(b)){
		if(hasneg){
			return frac(t1,opneg(b),'')
				
		}else{
		
			return frac(t0_,opneg(b),'')
			
		}
	}
	
	return frac(t0,b,'')


},visiplus=function(t,notlatex){//加法环境	 t是Mfn对象或字符串	正数前加+，0省略，负数不变
	var a=isArr(t),A=a?t:Mfn.fromStr(t), x=Mfn.opr1('type',A);
	if(!a){
		if(/^0$/.test(t)){
			return ''
		}
	}

	if(x=='-'){
		return Mfn.toStr(A,!notlatex)
	}
	return '+'+Mfn.toStr(A,!notlatex)

},visiplusk=function(t){//加法环境（针对乘法系数k）	t是字符串表达式	非负数前加+，负数不变

	if(/^-/.test(t)){return t}
	return '+'+t
	
	

//下列涉及符号计算	函数首字母大写，表示对象，否则表示字符串输出

//对象
},Plus=function(A,sim){
	
	return Mfn.oprs('+',A,sim)
		
},Minus=function(A,sim){
	
	return Mfn.oprs('-',A,sim)

},Neg=function(A,sim){
	
	return Mfn.opr1('-',A,sim)


},Times=function(A,sim){
	
	return Mfn.oprs('×',A,sim)
		
},Divide=function(A,sim){
	
	return Mfn.oprs('÷',A,sim)

},Rcp=function(A,sim){
	
	return Mfn.opr1('1/',A,sim)
		
},Pow=function(A,sim){
	
	return Mfn.oprs('^',A,sim)
		
},Square=function(A,sim){
	
	return Mfn.opr1('^2',A,sim)
	
},Cubic=function(A,sim){
	
	return Mfn.opr1('^3',A,sim)
		
},Sqrt=function(A,sim){
	
	return Mfn.opr1('√',A,sim)
		
},Cbrt=function(A,sim){
	
	return Mfn.opr1('∛',A,sim)




//字符串输出
},plus=function(A,latex,nobug){
	
	return Mfn.oprs('+',A,!nobug).toStr(latex)
		
},minus=function(A,latex,nobug){
	
	return Mfn.oprs('-',A,!nobug).toStr(latex)

},neg=function(A,latex,nobug){
	
	return Mfn.opr1('-',A,!nobug).toStr(latex)


},times=function(A,latex,nobug){
	
	return Mfn.oprs('×',A,!nobug).toStr(latex)
		
},divide=function(A,latex,nobug){
	
	return Mfn.oprs('÷',A,!nobug).toStr(latex)

},rcp=function(A,latex,nobug){
	
	return Mfn.opr1('1/',A,!nobug).toStr(latex)
		
},pow=function(A,latex,nobug){
	
	return Mfn.oprs('^',A,!nobug).toStr(latex)
		
},square=function(A,latex,nobug){
	
	return Mfn.opr1('^2',A,!nobug).toStr(latex)
	
},cubic=function(A,latex,nobug){
	
	return Mfn.opr1('^3',A,!nobug).toStr(latex)
		
},sqrt=function(A,latex,nobug){
	
	return Mfn.opr1('√',A,!nobug).toStr(latex)
		
},cbrt=function(A,latex,nobug){
	
	return Mfn.opr1('∛',A,!nobug).toStr(latex)


},pmtds=function(A,i,latex){//四则运算，当含有变量时，不化简，返回表达式，当常量时，返回化简结果。
	var o=typeof i=='number'?'+-×÷'[i]:i.replace('*','×').replace('/','÷');
	if(o=='÷'){
		return hasVar(A)?simFracOf1(A[1],'',A[0]):FracReduct(A)//注意，FracReduct结果中的分数a/b 不是latex形式
	}
	return Mfn.oprs(o,A,!hasVar(A)).toStr(latex)


},sums=function(A,B,latex,nobug){//形式线性组合	ax+by
	if(nobug){
		return Mfn.fromStr(Mfn.oprs('+',Arrf(function(x,i){return Mfn.oprs('×',[A[i],x]).toStr()},B)).toStr()).toStr(latex)
	}
	return Mfn.fromStr(plus(Arrf(function(x,i){return times([A[i],x])},B))).toStr(latex)

},sumx=function(A,x,n,latex,nobug){//向量分量的线性组合	x是向量字母
	return sums(A,zlrA((x||'x')+'_',seqA(1,n||A.length)),latex,nobug)

},kap=function(k,a,p,latex,nobug){//形式幂		ka^p
	return times([k,pow([a,p])],latex,nobug)

},sump=function(A,x,deg,latex,nobug){//多项式形式		A[0]x^deg+A[1]x^(deg-1)+...
	return Arrf(function(k,i){var a=''+k||''; a= a && a!='0'?(times([a,pow([x,deg-i],'',nobug)],latex,nobug)):''; return /^-/.test(a)?a:(a?'+'+a:'')}, A).join('').replace(/^\+/,'')

},fmin=function(A){//最小值
	var B=[].concat(A);
	B.sort(sortBy.num);
	return B[0]
	
},fmax=function(A){//最大值
	var B=[].concat(A);
	B.sort(sortBy.num);
	return B.slice(-1)[0]

},e2h=function(x,sim){
	var m=Mfn.fromStr(x);
	return kfrac((sim?Mfn.opr1('=',m):m).toStr(1))

// 下列涉及解方程运算





},equationsMS=function(A,m){/*解同模多元一次同余方程组，只考虑系数矩阵列满秩（或可逆）情况
	输入二维数组[a1,b1,c1,d1;a2,b2,c2,d2;...]
	ax+by+cz≡d (mod m)
	
	返回[计算结果数组, 步骤数组]


	*/
	var X=[], S=[],K=[].concat(A),l=K.length,n=K[0].length, A_=subMtrx(K,1,l,1,n-1),B=subMtrx(K,1,l,n,n),A_1=Mtrx.opr1('inv',A_),C=[];
	S.push('同余方程组'+mod('AX','B','m')+'，解相应的线性方程组AX=B+mC',
		'（其中C是任意一个n维列向量，元素只能是0或1），',
		'把方程组解向量化成标准形式（各个分量都用绝对最小剩余系来表示）',
		'得到下列几组不同的解');

	for(var i=0,c=Math.pow(2,n-1);i<c;i++){
		var bin=('0'.repeat(n-2)+i.toString(2)).substr(1-n),Bi=Mtrx.opr1('拷',B);//Bi=[].concat(B)  concat无法真正复制，而是引用
		for(var j=0;j<n-1;j++){
			if(bin[j]=='1'){
				Bi[j][0]=+Bi[j][0]+m
			}
		}
		var Xi=Mtrx.opr2('*',A_1,Bi);
		Arrf(function(x){//整数、分数化绝对最小剩余
			x[0]=equationM(/\//.test(x[0])?[x[0].split('/')[1],neg(x[0].split('/')[0])]:[1,neg(x[0])], m)[0][0].split('m')[0];
		},Xi);
		Xi=Xi.join();
		if(X.indexOf(Xi)>-1){
			C[X.indexOf(Xi)]+=','+bin;
			
		}else{
			X.push(Xi);
			C.push(bin)
		}
	}
	
	S.push(Table('',[['X','C'],[X.join(hr),C.join(hr)]],'TBr2c2'));
	return [X,S]
	

},equationsMX=function(A,p){/*解（x≡）一元一次同余方程组
	输入二维数组[b1,m1;b2,m2;...]
	
	返回[计算结果数组, 步骤数组]	计算结果数组为空表示无解

	参数 p 指定算法：
		p为空：默认（逐步满足法、待定法、方程转移法，递归）、
		p=1：孙子定理(中国剩余定理)

	*/
	var X=[], S=[],K=[].concat(A),flag=0;
	if(p!=1){
		sort2(K,'',[1]);K.reverse();//按模降序
	}
	S.push('方程组：'+br+mtrx(Arrf(function(x){return mod('x',x[0],x[1])},K).join(br),'l'));
	
	//剩余数，求绝对最小剩余
	Arrf(function(x){
		var m=Mod(x[0],x[1]);
		if(x[0]+''!=m+''){
			x[0]=m;
			flag=1;
		}
	},K);
	if(flag){
		S.push('等价于方程组：'+br+mtrx(Arrf(function(x){return mod('x',x[0],x[1])},K).join(br),'l'));
	}
	
	//缩减方程数规模：剩余数相同时，模合并成最小公倍数
	flag=0;
	for(var i=0;i<K.length;i++){
		for(var j=i+1;j<K.length;j++){
			var m=K[i][1],n=K[j][1],a=K[i][0],b=K[j][0];
			if(a==b){
				m=lcm([m,n]);
				K[i][1]=m;
				K.splice(j,1);
				j--;
				flag=1;
			}
		}
	}
	if(flag){
		if(p!=1){
			sort2(K,'',[1]);K.reverse();//按模降序
		}
		S.push('等价于 方程组：'+br+mtrx(Arrf(function(x){return mod('x',x[0],x[1])},K).join(br),'l'));
	}
	

	//判断是否无解	方程组有解的充要条件：任意两个模的公因数，整除相应模的剩余数之差
	var l=K.length;
	for(var i=0;i<l;i++){
		for(var j=i+1;j<l;j++){
			var m=K[i][1],n=K[j][1],a=K[i][0],b=K[j][0],g=gcd([m,n]),a_b=minus([a,b]),mo=Mod(a_b,g);//mo=(+a_b)%(+g);
			if(mo){
				S.push('根据方程'+(i+1)+'、'+(j+1)+'，gcd('+m+','+n+')='+g+br+'但'+mod(mo+''!=a_b?[a+'-'+b,a_b]:a+'-'+b,mo,g)+'，则方程组无解。');
				return [[],S]
			}
		}
	}

	//模互质化
	var K0=Arri(K,0),K1=Arri(K,1), m=Arrf(factorA,K1),M=Uniq(Arri(m,0).join()).split(',').sort(sortBy.num),Ml=M.length, I=Arri(m,1), B=[];


	Arrf(function(x,j){//扩充指数集
		var t=copyA(0,Ml);
		Arrf(function(y,i){t[M.indexOf(y)]=x[1][i]}, x[0]);
		I[j]=t;
	},m);
	var I0=Mtrx.opr1('拷',I);

	flag=0;
	for(var i=0;i<Ml;i++){
		var Ii=Arri(I,i), mx=max(Ii),mx1=0;
		Arrf(function(x){
			var xi=x[i];
			if(!xi){
			}else if(xi<mx || xi==mx && mx1){
				x[i]=0;
				flag=1;
			}else if(xi==mx){
				mx1=1
			}
		},I);
	}

	
	if(flag){
		var deli=[];
		Arrf(function(x,i){
			var t=Arrf(function(y,j){return pow([M[j],y])},I[i]), n=times(t);
			B[i]=n;
			K[i][1]=n;//更新大数组的模
			
			if(n=='1'){
				deli.push(i)
			}
			
		},I);
		deli.reverse();
		Arrf(function(i){
			B.splice(i,1);	//新模
			I.splice(i,1);	//指数集合
			I0.splice(i,1); //原指数集合
			
			K0.splice(i,1);	//余数
			
			K.splice(i,1);	//大数组
		},deli);

		S.push('对模作质数分解，指数分别如下：'+br+Table([['模\\质因数'].concat(M),K1],I0,'TBrc'));
		S.push('每个质数，指数只保留一个最大值，得到相应模：'+br+
				Table([['模\\质因数'].concat(M),B],I,'TBrc'));
		/*
			'原方程组等价于：'+br+
				mtrx(Arrf(function(x,i){return mod('x',K0[i],x)},B).join(br),'l'));
				*/
		if(p!=1){
			sort2(K,'',[1]);K.reverse();//按模降序
		}
		S.push('原方程组等价于：'+br+
				mtrx(Arrf(function(x){return mod('x',x[0],x[1])},K).join(br),'l'));
		
		//剩余数，求绝对最小剩余
		flag=0;
		Arrf(function(x){
			var m=Mod(x[0],x[1]);
			if(x[0]+''!=m+''){
				x[0]=m;
				flag=1;
			}
		},K);
		if(flag){
			S.push('也即等价于方程组：'+br+mtrx(Arrf(function(x){return mod('x',x[0],x[1])},K).join(br),'l'));
		}
	
	}

	/*OH(equationsMX([[4,90],[5,25],[6,1170]])[1].join(br))
	OH(equationsMX([[4,19],[71019,23]])[1].join(br))
	
	OH(equationsMX([[2,3],[3,5],[2,7]])[1].join(br))
	OH(equationsMX([[1,5],[2,3]])[1].join(br))
	OH(equationsMX([[4,5],[2,3]])[1].join(br))
	OH(equationsMX([[2,7],[4,8],[3,9]])[1].join(br))
	OH(equationsMX([[2,5],[-2,6],[-3,7]])[1].join(br))
	OH(equationsMX([[2,3],[3,5],[4,7]])[1].join(br))
	
OH(equationsMX([[2,3],[3,5],[2,7],[1,11]],1)[1].join(br))

		通解结构：
		b1+m1(t1+m2(t2+m3(t3+m4*k)))
		b1+m1t1+m1m2t2+m1m2m3t3+m1m2m3m4*k
		
		
		b1+m1t1 ≡ b2 mod m2			    t1 ≡ (b2-b1)/m1 mod m2
											   
											   
		b1+m1(t1+m2t2) ≡ b3 mod m3	    	t2 ≡ ((b3-b1)/m1-t1)/m2 mod m3		= ((b3-b1)-m1t1)/m1m2 mod m3
		b1+m1t1+m1m2t2 ≡ b3 mod m3			   ≡ (b3-b2)/m1m2 + d2 mod m3		其中分数d2=((b2-b1)/m1-t1)/m2
		b2+s2m2 +m1m2t2 ≡ b3 mod m3？？	其中s2=(b1+m1t1-b2)/m2
											   ≡ (b3-(b1+m1t1))/m1m2 mod m3	选这种形式表示
											   ≡ (b3-b1)/m1m2 - t1/m2 mod m3
											   
											   
		b1+m1(t1+m2(t2+m3t3) ≡ b4 mod m4    t3 ≡ (((b4-b1)/m1-t1)/m2-t2)/m3 mod m4
		b1+m1t1+m1m2t2+m1m2m3t3 ≡ b4 mod m4	≡ ((b4-b1)/m1m2 -t1/m2 -t2)/m3 mod m4
		b3+s3m3 +m1m2m3t3 ≡ b4 mod m4？？
											   ≡ (b4-b3)/m1m2m3 + d3 mod m4		其中分数d3=(((b3-b1)/m1-t1)/m2-t2)/m3
											   
											   ≡ (b4-(b1+m1t1+m1m2t2))/m1m2m3 mod m4	选这种形式表示
											   ≡ (b4-b1)/m1m2m3 -t1/m2m3 -t2/m3  mod m4

		*/
	l=K.length;	K0=Arri(K,0);K1=Arri(K,1);
	var Kn=times(K1);
	
	if(l==1){
		X.push(K[0].join('m'));
		S.push('解是'+K[0].join(' mod '));
		
	}else if(l==2){
		X.push(equationM([K1[0], minus(K0)],K1[1])[0][0].split('m')[0]);

		S.push('通过解方程'+mod(K0[0]+'+'+K1[0]+msub('k1'),K0[1],K1[1]),
			'得到'+msub('k1')+'='+X[0]);
		
		
		S.push('代入通解表达式'+K0[0]+'+'+K1[0]+'⋅'+msub('k1')+' mod '+K1.join('⋅'));
		
		var t=plus([K0[0],times([K1[0],X[0]])]);
		X=[Mod(t,Kn)+'m'+Kn];
		S.push('即'+t+' mod '+Kn,
			'也即'+X[0].replace('m',' mod '));
		
	}else if(l==3){
		X.unshift(equationM([K1[0], minus([K0[0],K0[1]])],K1[1])[0][0].split('m')[0])

		S.push('通过解方程'+mod(K0[0]+'+'+K1[0]+msub('k1'),K0[1],K1[1]),
			'得到'+msub('k1')+'='+X[0]);

		X.unshift(equationM([times([K1[0],K1[1]]), minus([plus([K0[0],times([K1[0],X[0]])]),K0[2]])],K1[2])[0][0].split('m')[0])
		
		S.push('通过解方程'+mod(K0[0]+'+'+K1[0]+'⋅'+msub('k1')+'+'+K1[0]+'⋅'+K1[1]+msub('k2'),K0[2],K1[2]),
			'得到'+msub('k2')+'='+X[0]);

		S.push('代入通解表达式'+K0[0]+'+'+K1[0]+'⋅'+msub('k1')+'+'+K1[0]+'⋅'+K1[1]+'⋅'+msub('k2')+' mod '+K1.join('⋅'));
		
		var t=plus([K0[0],times([K1[0],X[1]]),times([K1[0],K1[1],X[0]])]);
		X=[Mod(t,Kn)+'m'+Kn];
		S.push('即'+t+' mod '+Kn,
			'也即'+X[0].replace('m',' mod '));

		
	}else if(p==1){//孙子定理
		/*
		使用孙子定理，通解结构，设M=m1m2m3m4...：
		b1t1M1 + b2t2M2 + b3t3M3+...	+m1m2m3m4*k
		
	=	M(b1t1/m1 + b2t2/m2 + )		+Mk
		
		
		其中Mi=M/mi
			tiMi≡1 (mod mi)
		*/
		S.push('应用孙子定理，最小公倍数M='+prod('i',1,l,msub('mi'))+'='+Kn+'，'+msub('Mi')+'='+frac('M',msub('mi'))+'，i=1,2,⋯,'+l,
			'分别解出方程'+mod(msub('xi')+msub('Mi'),1,msub('mi'))+'，得到'+msub('xi')+'，i=1,2,⋯,'+l);
		var B=[];
		for(var i=0;i<l;i++){
			var x=1;
			var mi=K1[i], Mi=divide([Kn,mi]);

			x=equationM([Mi, -1],mi)[0][0].split('m')[0];
			X.push(x);
			B.push(times([K0[i],x,Mi]));
		}
		S.push(X);

		var t=plus(B);
		X=[Mod(t,Kn)+'m'+Kn];
		S.push('代入通解表达式',
			sum('i',1,l,msub('bi')+msub('xi')+msub('Mi'))+' mod M',
			'得到'+t+' mod '+Kn,
			'也即'+X[0].replace('m',' mod '));

	}else{

		S.push('应用逐步满足法，根据方程组'+mod(msub('b1')+'+'+sum('i',1,'t-1',lrp(msub('ki')+prod('j',1,'i',msub('mj')))),msub('bt'),msub('mt')),
			'其中t=2,3,⋯'+l+'，依次解出'+msub('ki')+'，i=1,2,⋯,'+(l-1));

		var b=K0[0];
		for(var i=1;i<l;i++){
			var Ki=times(K1.slice(0,i));
			X.unshift(equationM([Ki, minus([b,K0[i]])],K1[i])[0][0].split('m')[0]);
			b=plus([b,times([Ki,X[0]])]);
		}
		X.reverse();
		S.push(X);
		X=[b+'m'+Kn];

		S.push('全部代入通解表达式',
				msub('b1')+'+'+sum('i',1,l,lrp(msub('ki')+prod('j',1,'i',msub('mj'))))+' mod M',
			'得到'+n+' mod '+Kn,
			'也即'+X[0].replace('m',' mod '));

	}

	if(/-/.test(X[0])){
		S.push('也即'+plus(X[0].split('m'))+X[0].replace(/.+m/,' mod '))
	}
	return [X,S]

},equationM=function(K,m,dtl){/*解一元同余方程
	输入整系数数组
	
	返回[计算结果13m27数组, 步骤数组]	计算结果数组为空表示无解

	参数 m 指定模
	参数 dtl 指定记录步骤
	*/

	var l=K.length,A=K.concat([]), fr=[neg(K[1]),K[0]], X=[], S=[], M=m, p='x';

	if(dtl){
		S.push(eq0([sump(A,p,1,1)],3,m));
	}
	if(/^-?1$/.test(K[0])){
		X.push(Mod(fr[0],M));
		if(fr[0]+''!=X[0]+'' && dtl){
			S.push(eqv(p,X[0],3,'','',M));
		}
		X[0]+='m'+M;
		return [X,S]
	}


	var g=gcd(A.concat(m));
	if(g!='1'){
		A=Arrf(function(t){return (+t)/(+g)},K);
		M=+m/g;

		if(dtl){
			S.push(eq0([sump(A,p,1,1)],3,M));
			X.push(frac(-A[1],A[0],''));
		}
	}else{
		if(dtl){
			X.push(kfrac(fr));
		}
	}
	
	var a=A.join();
	A=Arrf(function(t){return Mod(t,M)},A);//绝对最小剩余

	if(dtl && a!=A.join()){

		var t=eq0([sump(A,p,1,1)],3,M);
		S.push(t);
		X.push(frac(-A[1],A[0],''));
	}

//// consolelog(S);
	if(l==2){//ax+b≡0
		if(A[0]=='0'){//退化
			if(A[1]!='0'){
				if(dtl){
					S.push('方程无解');
				}
				//// consolelog(S);
				return [[],S]
			}
			if(dtl){
				S.push('方程有任意整数解');
			}
			//	// consolelog(S);
			return ['ℤ',S]
		}

		g=gcd([A[0],M]);

		if(g!='1' && Mod(A[1],g)!='0'){
			if(dtl){
				S.push('因为('+A[0]+','+M+') = '+g+'∤'+A[1]+ '，所以方程无解');
			}

			return [[],S]
		}

//// consolelog(fr);
		fr=fracReduct(-A[1],A[0]);
		if(!/\//.test(fr)){
			fr=Mod(fr,M);
			if(dtl){
				X.push(fr);
				S.push(eqM(X,M))
			}
			return [[fr+'m'+M],S]
		}

		if(fr!=-A[1]+'/'+A[0]){
			A[1]=-(+fr.split('/')[0]);
			A[0]=+fr.split('/')[1];
			if(dtl){
				X.push(frac(-A[1],A[0],''));
			}
		}

		var eM=equationM([M,A[1]],A[0],dtl);

		var k=divide([minus([-A[1],times([M,eM[0][0].split('m')[0]])]),A[0]]);
		k=Mod(k,M);
		
		if(dtl){

			X.push(frac(-A[1]+'-'+M+lrp('',frac(-A[1],M,'')+' mod '+A[0],'',''),A[0],''));
			X.push(k);
			
			S.push(eqM(X,M));


			S.push('其中'+eM[1].slice(/其中/.test(eM[1])?-2:-1).join(kbr2));
		}
		return [[k+'m'+M],S]
/*	使用穷举法：
	*/
		for(var i=1,h=M/2;i<=h;i++){
			var ii=[times([A[0],i]),A[1]], k=0;
			
			if(Mod(plus(ii),M)=='0'){
				k=i
			}
			if(Mod(minus(ii),M)=='0'){
				k=-i
			}

			if(k){

				X.push(k);
				if(dtl){
					S.push(eqM(X,M))
				}
				return [[k+'m'+M],S]
			}

		}

	}

},equationA=function(K,d,p){/*解一元代数方程
	输入有理系数数组	不考虑含其它未知变量的情况
	
	返回[计算结果数组, 步骤数组]	计算结果数组为空表示无解
	
	参数 d 指定数域（默认为空，是复数域）
		0 复数域
		1 实数域
		2 代数数域
		3 有理数域
		4 整数环
		5 自然数集合
		6 正整数集合
		
	参数 p 指定变量名 （此时会返回步骤数组）
	*/
	
	var A=Arrf(FracReduct,K),l=A.length, X=[], S=[];

	if(p){

		S.push(eq0(sump(A,p,l-1,1)));
	}
	if(l==2){//ax+b=0
		if(!/^0$/.test(A[0])){

			X.push(divide([neg(A[1]),A[0]]));
			if(p){
				S.push(eqv(sump([A[0]],p,1,1),neg(A[1],1)), eqv(p,e2h(X[0])));
			}
		}else{
			if(/^0$/.test(A[1])){
				if(p){
					S.push('等式恒成立，有无穷多组解');
				}
			}else{
				if(p){
					S.push('等式不成立，无解');
				}
			}
		}
	}
	if(l==3){//ax^2+bx+c=0
		if(!/^0$/.test(A[0])){
			if(/\//.test(A)){//整数化
				var m=lcmFrac(A);//分母最小公倍数
				A=Arrf(function(s){return times([s,m])},A);
				if(p){
					S.push(eq0(sump(A,p,l-1,1)));
				}
			}

			var m=gcd(A);

			if(m!='1'){//约分
				A=Arrf(function(s){return divide([s,m])},A);
				if(p){
					S.push(eq0(sump(A,p,l-1,1)));
				}
			}
			
			var delta=minus([square(A[1]),times([4,A[0],A[2]])]);
			 //console.log('判别式Δ = ',delta);
			if(/^0$/.test(delta)){//判别式=0
				delta=divide([neg(A[1]),times([2,A[0]])]);
				
				X.push(delta,delta);
				if(p){
					S.push(eq0(zp(e2h(p+'-'+pp(X[0]),1))+'^2'), eqv(p,X[0]));
				}
			}else if(/^-/.test(delta)){//判别式<0
				if(p){
					S.push('判别式Δ = '+e2h(delta)+ ' < 0，因此无实数解');
				}
				if(d){//实数域无解

				}else{
					//x=(-b+-√Δ)/(2a)
					// consolelog('Δ = ',delta);
					delta=times([sqrt(neg(delta)),'i']);
					// consolelog('√Δ = ',delta);
					var a2=times([2,A[0]]), b_2a=divide([A[1],a2]), delta_2a=divide([delta,a2]);
					//X.push(divide([minus([delta,A[1]]), times([2,A[0]])]), divide([plus([delta,A[1]]), times([-2,A[0]])]));
					X.push(minus([delta_2a,b_2a]), neg(plus([delta_2a,b_2a])));


					//console.log(X);
					if(p){
						S.push(
							eq0(zp(sump([1,neg(X[0])],p,1,1))+zp(sump([1,neg(X[1])],p,1,1))),
		
							eqv(p,e2h(X[0]))+' 或 '+e2h(X[1])
							);
					}
				}
			}else{//判别式>0
				if(p){
					S.push('判别式Δ = '+e2h(delta)+ ' > 0，有两个不相等的实根',
						'利用求根公式~x='+kfrac(['-b±'+kroot('b^2-4ac'),'2a']),
						'或十字相乘法'
					);
				}
				delta=sqrt(delta);
				var a2=times([2,A[0]]), b_2a=divide([A[1],a2]), delta_2a=divide([delta,a2]);
				//console.log('根号Δ = ',delta);
				//X.push(divide([minus([delta,A[1]]), a2]), divide([neg(plus([delta,A[1]])), a2]));
				X.push(minus([delta_2a,b_2a]), neg(plus([delta_2a,b_2a])));
				if(p){
					S.push(eq0(zp(sump([1,neg(X[0])],p,1,1))+zp(sump([1,neg(X[1])],p,1,1))),
						'解得~'+eqv(p,e2h(X[0]))+' 或 '+e2h(X[1])
						);
				}
			}
		}else{
			return equationA(A.slice(1),d,p)
		}
	}
	
	if(l==4){//ax^3+bx^2+cx+d=0				解法来自《实用数学手册(第2版)》P16
		if(/^0$/.test(A[0])){
			return equationA(A.slice(1),d,p)
		}
		
		if(/\//.test(A)){//整数化
			var m=lcmFrac(A);//分母最小公倍数
			A=Arrf(function(s){return times([s,m])},A);
			if(p){
				S.push(eq0(sump(A,p,3,1)));
			}
		}
		var m=gcd(A);
		if(m!='1'){//约分
			// consolelog(m,A);
			A=Arrf(function(s){return divide([s,m])},A);
			if(p){
				S.push(eq0(sump(A,p,3,1)));
			}
		}
		var _a=divide([A[1],A[0],-3]), // 标准方程的-a/3
			p3=minus([divide([A[2],A[0]]), divide([square(A[1]),square(A[0])])]),
			q2=minus([divide([A[3],A[0]]), divide([times([A[1],A[2]]),square(A[0])])]),
				q=divide([q2,2]),
			P3=divide([cubic(p3),27]), Q2=divide([square(q2),4]),
				
			delta=plus([P3,Q2]);
		if(p){
			S.push('判别式Δ = '+e2h(delta));
		}
		// consolelog('系数',A);
		// consolelog('3p=',p3,'2q=',q2,'q=',q,'p^3=',P3,'q^2=',Q2,'Δ = ',delta,'-a/3 = ',_a);
		if(/^0$/.test(delta)){//3个实根（其中2个相等）
			var q_3=cbrt(q);
			X.push(plus([_a,q_3]));
			X.push(X[0]);
			X.push(minus([_a, times([divide([A[3],A[0]]),2])]));
			if(p){
				S.push('因此存在两个相同的根'+e2h(X[0])+', 及'+e2h(X[2]));
			}
		}else if(/^-/.test(delta)){//判别式小于0
			
			/*
				无法直接套下面公式，因为Δ开方得到虚数，得出实根比较繁琐，要用其他方法
			delta=sqrt(delta);
			var x1=cbrt(plus([q,delta])), x2=cbrt(minus([q,delta])), x3=plus([x1,x2]), x4=minus([x1,x2]), x5=minus([_a,x3]);
			
			X.push(x5);
			*/
			
			/*
				根据根与系数关系，降阶为一元二次方程：
				
			*/
			
			
			if(p){
				S.push('因此存在3个不同实根');
			}
			
		
		}else{//判别式>0 1个实根 + 2个共轭复根
			delta=sqrt(delta);
			var x1=cbrt(plus([q,delta])), x2=cbrt(minus([q,delta])), x3=plus([x1,x2]), x4=minus([x1,x2]), x5=minus([_a,x3]);
			
			X.push(x5);
			if(d){//实数域无另外两个共轭解
				if(p){
					S.push('只有1个实根'+e2h(x5));
				}
			}else{
				var x6=plus([_a,divide([x3,2])]), x7=times(['√3/2',x4]);

				if(p){
					/*
					S.push('q='+q,'Δ='+delta);
					
					S.push('x_1=',e2h(x1),'x_2=',x2);
					S.push('x_3=',x3,'x_4=',x4);
					S.push('x_6=',x6,'x_7=',x7);
					*/
					S.push('有1个实根'+e2h(x5), '1对共轭复根'+e2h(x6)+' ± i'+zp(e2h(x7)));
				}
				X.push(plus([x6,times(['i',x7])]), plus([x6,times(['-i',x7])]));
			}
			
			
			
		}

		
		
	}
	
	return [X,S]
	
	
};
/*
	bug	

sump([1,neg("(1/24)(4√14i-8)")],'x',-2)


01-210-1-2-10 求合同变换，化成对角阵



*/
var RandomNumber={
    'sign':function(signA){
        var sn0=1, sn1=0;
        signA && (sn0=signA[0]);
        signA && signA.length>1 && (sn1=signA[1]);
        return sn0 && sn1?(Random(2)>1?'-':''):(sn1?'-':'')
    },
    'opr4':function(oprs){
        var s=oprs || '+-×÷';
        return s[Random(s.length)-1]
    },

    'isMixedFrac':function(t){
        return /\(\d+\)\d+\/\d+/.test(t)
    },
    'randN':function(digiAA,signAA, numberTypeA){
        var nA=numberTypeA || ['Integer','Fraction','Fraction Unit',
        'Propper Fraction','Impropper Fraction',//'Mixed Fraction',
        'Reducible Fraction','Irreducible Fraction',
        'Decimal','Pure Decimal'], nl=nA.length;
        var x=Random(nl)-1;
        return RandomNumber[nA[x]](isArr(digiAA,1)?digiAA[x]:digiAA, isArr(signAA,1)?signAA[x]:signAA)
    },
    'Opr4':function(digiAA,signAA, numberTypeA, layerA, oprs){
        var s=RandomNumber.randN(digiAA,signAA, numberTypeA), l0=1,l1=1;

        layerA && (l0=layerA[0]);
        layerA && (layerA.length>1) && (l1=layerA[1]);
        var l=l0+Random(l1-l0+1)-1;
        for(var i=0;i<l;i++){
            var A=['('+s+')', RandomNumber.randN(digiAA,signAA, numberTypeA)];
            if(Random(2)>1){
                A.reverse();
            }
            s=A.join(RandomNumber.opr4(oprs))
        }


        return Mfn.fromStr(s)
    },

    'Integer':function(digiA,signA){
        var d0=1, d1=3;
        digiA && (d0=digiA[0]);
        digiA && digiA.length>1 && (d1=digiA[1]);

        return RandomNumber.sign(signA)+(Random(10**d1-10**(d0-1))+10**(d0-1)-1)
    },
    'Fraction':function(digiA,signA){
        return RandomNumber.sign(signA)+[RandomNumber.Integer(digiA),RandomNumber.Integer(digiA)].join('/')
    },
    'Fraction Unit':function(digiA,signA){
        return RandomNumber.sign(signA)+[1,RandomNumber.Integer(digiA)].join('/')
    },
    'Propper Fraction':function(digiA,signA){
        var x=1, s=RandomNumber.sign(signA);
        while(x){
            var X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];
            if(+X[1]<+X[0]){X.reverse()}

            if(+X[0]<+X[1]){
                return s+X.join('/')
            }
        }
    },
    'Impropper Fraction':function(digiA,signA){
        var s=RandomNumber.sign(signA);
        var X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];
        if(+X[0]<+X[1]){X.reverse()}

        return s+X.join('/')
    },
    'Mixed Fraction':function(digiA,signA){
        var s=RandomNumber.sign(signA);
        var X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];

        return s+X[0]+'+00+'+X.slice(1).join('/') //s+X[0]+frac(X[1],X[2],'')
    },
    'Reducible Fraction':function(digiA,signA){
        var x=1, s=RandomNumber.sign(signA);
        while(x){
            var X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];
            if(FracReduct(X)!=X.join('/')){
                return s+X.join('/')
            }
        }
    },
    'Irreducible Fraction':function(digiA,signA){
        var x=1, s=RandomNumber.sign(signA);
        while(x){
            var X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];
            if(FracReduct(X)==X.join('/')){
                return s+X.join('/')
            }
        }
    },
    'Decimal':function(digiA,signA){
        var s=RandomNumber.sign(signA), X=[RandomNumber.Integer(digiA), RandomNumber.Integer(digiA)];
        return s+X.join('.')
    },
    'Pure Decimal':function(digiA,signA){
        var s=RandomNumber.sign(signA), x=RandomNumber.Integer(digiA);

        return s+'0.'+x
    },

    

}, RandomCharacter={

    'randN':function(digiAA,signAA, charAA, numberTypeA){
        var nA=numberTypeA || ['Integer','Fraction','Fraction Unit'], nl=nA.length;
        var x=Random(nl)-1;
        return RandomCharacter[nA[x]](isArr(digiAA,1)?digiAA[x]:digiAA, isArr(signAA,1)?signAA[x]:signAA, isArr(charAA,1)?charAA[x]:charAA)
    },
    'Opr4':function(digiAA,signAA,charAA, numberTypeA, layerA, oprs){
        var s=RandomCharacter.randN(digiAA,signAA,charAA, numberTypeA), l0=1,l1=1;

        layerA && (l0=layerA[0]);
        layerA && (layerA.length>1) && (l1=layerA[1]);
        var l=l0+Random(l1-l0+1)-1;
        for(var i=0;i<l;i++){
            var A=['('+s+')', RandomCharacter.randN(digiAA,signAA,charAA, numberTypeA)];
            if(Random(2)>1){
                A.reverse();
            }
            s=A.join(RandomNumber.opr4(oprs))
        }


        return Mfn.fromStr(s)
    },

    'Integer':function(digiA,signA, charA){
        var d0=1, d1=3;
        digiA && (d0=digiA[0]);
        digiA && digiA.length>1 && (d1=digiA[1]);
        var cA=charA||seqsA('a~z').slice(d0-1,d1)

        return RandomNumber.sign(signA)+cA[Random(cA.length)-1]
    },
    'Fraction':function(digiA,signA, charA){
        return RandomNumber.sign(signA)+[RandomCharacter.Integer(digiA,'', charA),RandomCharacter.Integer(digiA,'', charA)].join('/')
    },
    'Fraction Unit':function(digiA,signA, charA){
        return RandomNumber.sign(signA)+[1,RandomCharacter.Integer(digiA,'', charA)].join('/')
    }    

};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var gon=function(Arr,typ,o){//多边形，返回内线path点集		o指明迭代次数或嵌套参数（次数cnt或[marginx,marginy]）
	var S=[],M=[],B=[],A,A0, Cn=[0,0], C, err=function(x){
		return x
		for(var i=0,l=x.length;i<l;i++){
			if(isNaN(x[i])){
				return []
			}
		}

		return x
	};
	// console.log(typ);

	

	if(isArr(Arr) && Arr[0]!='M'){
		A=[].concat(Arr);
		A0=[].concat(Arr);
	}else if(Arr){
		A0=(isArr(Arr)?Arr.join(' '):Arr).replace(/([A-Z])(\d)/ig,'$1 $2').replace(/(\d)([A-Z])/ig,'$1 $2');
		while(/[HV]/.test(A0)){
			A0=A0.replace(/(-?\d\.?\d*) (-?\d\.?\d*) H (-?\d\.?\d*)/g,'$1 $2 L $3 $2');
			A0=A0.replace(/(-?\d\.?\d*) (-?\d\.?\d*) V (-?\d\.?\d*)/g,'$1 $2 L $1 $3')
		}
		//A0=A0.replace(/M (-?\d\.?\d*) (-?\d\.?\d*) (.+) \1 \2 Z/ig,'M $1 $2 $3 Z');
//	console.log(A0);
		A=A0.replace(/A \S+ \S+ ([01] ){3}/ig,' ').replace(/[MLZCQ]/ig,' ').replace(/ +/g,' ').trim();
//		console.log(A);
		A0=A0.split(' ');
		A=Arrf(Number,A.split(' '))
	}else{
		
	}
	if(!typ){
		return A
	}
	
	if(typ=='Orthocenter'){//垂心是高线三角形的内心
		
		return gon(gon(A,'PerpendicularFoot'),'Incenter');
	}
	
	var n=A.length/2, se=0;
	if(A[0]==A[n*2-2] && A[1]==A[n*2-1]){//起讫点重合，闭合曲线
		n--;
		se=1;
	}

	for(var i=0;i<n;i++){
		Cn[0]+=A[i*2];
		Cn[1]+=A[i*2+1]
	}
	if(typ=='CenterN'){//中心点的n倍
		return Cn
	}
	C=[Cn[0]/n, Cn[1]/n];
		
	if(typ=='Center'){//中心（重心） G
		return C
	}


	if(typ=='CentroidLine'){//中心线：顶点与中心连线，n条
		for(var i=0;i<n;i++){
			B.push('M',A[i*2],A[i*2+1], 'L',C[0],C[1])
		}
		return err(B)
	}



	for(var i=0;i<n;i++){
		S.push(Math.hypot(A[i*2+1]-A[((i+1)%n)*2+1], A[i*2]-A[((i+1)%n)*2]))
	}

	if(typ=='SideL'){//边长
		return S
	}
	
	var Cf=Arrf(function(s,t){return s+t},S,'cp2'), Lpd=Arrf(function(s,t){return s*t},S,'cp2');
	if(typ=='Circumference'){//周长
		return Cf
	}
	
	if(typ=='Area'){//面积
		if(n<3){
			return 0
		}else if(n==3){//三角形 使用海伦公式
			
			var p=Cf/2;
			return Math.sqrt(p*(p-S[0])*(p-S[1])*(p-S[2]))
				
		}else{//切割为多个三角形累加
			return gon(A.slice(0,6),typ)+gon(A.slice(0,2).concat(A.slice(4)),typ)
			
		}
		
	}

	if(/Circum(Circle|center)/.test(typ)){/*外接圆	仅讨论三角形或正多边形
		三角形：中垂线交点，外心O	满足：条件较复杂，计算量大，现利用欧拉线上矢量GH = -2GO的关系（定比分点 ，GH线，定比λ=-1/2）来求O坐标
			半径			满足：边长1*边长2*边长3 / (4R)=面积
		
		
		定比分点坐标：
		(y-Y1) / (x-X1)  = (Y2-Y1) / (X2-X1) 
			
			x=X1+λ(X2-X1)	= (1-λ)X1+λX2		=(3X1 - X2)/2
			y=Y1+λ(Y2-Y1)	= (1-λ)Y1+λY2		=(3Y1 - Y2)/2
		*/
		var H=gon(A,'Orthocenter');
		B=[(3*C[0]-H[0])/2, (3*C[1]-H[1])/2]

		if(typ=='Circumcenter'){
			return err(B)
		}
		if(typ=='CircumCircle'){
			return err(B.concat(Lpd/(4*gon(A,'Area'))))
		}
		if(typ=='CircumcenterLine'){
			var D=[];
			for(var i=0;i<n;i++){
				D.push('M',A[i*2],A[i*2+1], 'L',B[0],B[1])
			}
			return err(D)
		}
		
	}

	if(/Nine_point(Circle|center)/.test(typ)){/*九点圆	仅讨论三角形
		利用欧拉线上矢量GN = GH/4的关系（定比分点 ，GH线，定比λ=1/4）来求O坐标
			半径			满足：外径R/2
		
		
		定比分点坐标：
		(y-Y1) / (x-X1)  = (Y2-Y1) / (X2-X1) 
			
			x=X1+λ(X2-X1)	= (1-λ)X1+λX2		=(3X1 + X2)/4
			y=Y1+λ(Y2-Y1)	= (1-λ)Y1+λY2		=(3Y1 + Y2)/4
		*/
		var H=gon(A,'Orthocenter');
		B=[(3*C[0]+H[0])/2, (3*C[1]+H[1])/2];

		if(typ=='Nine_pointcenter'){
			return err(B)
		}
		if(typ=='Nine_pointCircle'){
			return err(B.concat(Lpd/(8*gon(A,'Area'))))
		}
	}

	if(/In(circle|center)/.test(typ)){/*内切圆	仅讨论三角形或正多边形
		三角形：角平分线交点，内心I	满足：（边长1/周长）点1+（边长2/周长）点2+（边长3/周长）点3
			半径			满足：(周长/2)×r=面积
		*/
		var D=[0,0];
		for(var i=0;i<n;i++){
			var k=S[(i+1)%n]/Cf;
			D[0]+=A[i*2]*k;
			D[1]+=A[i*2+1]*k;
		}
		if(typ=='Incenter'){
			return err(D)
		}
		if(typ=='Incircle'){
			return err(D.concat(gon(A,'Area')*2/Cf))
		}
		if(typ=='IncenterLine'){
			for(var i=0;i<n;i++){
				B.push('M',A[i*2],A[i*2+1], 'L',D[0],D[1])
			}
			return err(B)
		}
	}	

			


	if(typ=='RighttVC'){//（直角边水平或垂直的）直角三角形直角点与中心	外接圆心 外接圆半径R
		//return [A[0]==A[2]||A[0]==A[4]?A[0]:A[2], A[1]==A[3]||A[1]==A[5]?A[1]:A[3], C[0], C[1]]
		B=[A[0]==A[2]||A[0]==A[4]?A[0]:A[2], A[1]==A[3]||A[1]==A[5]?A[1]:A[3], C[0], C[1]];
		if(A[0]==A[2]){
			B.push((A[0]+A[4])/2, (A[1]+A[3])/2, Math.hypot(A[0]-A[4], A[1]-A[3])/2)
		}
		if(A[0]==A[4]){
			B.push((A[0]+A[2])/2, (A[1]+A[5])/2, Math.hypot(A[0]-A[2], A[1]-A[5])/2)
		}
		if(A[2]==A[4]){
			B.push((A[0]+A[2])/2, (A[3]+A[5])/2, Math.hypot(A[0]-A[2], A[3]-A[5])/2)
		}
		
	}
	if(typ=='RightxVC'){//（斜边水平或垂直的）直角三角形直角点与中心	外接圆心 外接圆半径R
		//return ((A[1]==A[3]||A[0]==A[2]) ?[A[4],A[5]] :(A[1]==A[5]||A[0]==A[4] ? [A[2],A[3]]:[A[0],A[1]])).concat(C[0], C[1])
		
		B=((A[1]==A[3]||A[0]==A[2]) ?[A[4],A[5]] :(A[1]==A[5]||A[0]==A[4] ? [A[2],A[3]]:[A[0],A[1]])).concat(C[0], C[1]);
		if(A[0]==A[2]){
			B.push(A[0], (A[1]+A[3])/2, Math.abs(A[1]-A[3])/2)
		}
		if(A[0]==A[4]){
			B.push(A[0], (A[1]+A[5])/2, Math.abs(A[1]-A[5])/2)
		}
		if(A[2]==A[4]){
			B.push(A[2], (A[3]+A[5])/2, Math.abs(A[3]-A[5])/2)
		}


		if(A[1]==A[3]){
			B.push((A[0]+A[2])/2, A[1], Math.abs(A[0]-A[2])/2)
		}
		if(A[1]==A[5]){
			B.push((A[0]+A[4])/2, A[1], Math.abs(A[0]-A[4])/2)
		}
		if(A[3]==A[5]){
			B.push((A[2]+A[4])/2, A[3], Math.abs(A[2]-A[4])/2)
		}
		
		return err(B)
		
	}
	
	for(var i=0;i<n;i++){
		M.push((A[i*2]+A[((i+1)%n)*2])/2, (A[i*2+1]+A[((i+1)%n)*2+1])/2)
	}
	if(typ=='MidPoint'){//n个中点
		if(o){
			return gon(M,typ,o-1)
		}else{
			return M
		}
	}
	if(typ=='Medians'){//中线：顶点与对边中点连线，n*(n-2)条	中点n个
		for(var i=0;i<n;i++){
			for(var j=0;j<n-2;j++){
				B.push('M',A[i*2],A[i*2+1], 'L',M[((i+1+j)%n)*2],M[((i+1+j)%n)*2+1])
			}
		}
		return err(B)
	}



	if(typ=='MidPointLine'){//中点连线（中位线，n=3时 'Midline'），顺次连接，n条(n>2时)
		if(o){
			return gon(M,typ,o-1)
		}else{
			return ['M'].concat(M,'z')	//此时省略L命令，是可以的
		}
	}
	
	if(typ=='OppositeMidPointLine'){//对边中点连线，隔点连接，n*(n-3)/2条
		for(var i=0;i<n;i++){
			for(var j=0;j<n-3 && i+j<n-2;j++){
				B.push('M',M[i*2],M[i*2+1], 'L',M[((i+2+j)%n)*2],M[((i+2+j)%n)*2+1])
			}
		}
		return err(B)

	}
	
	if(typ=='Diagonal'){//对角线，隔顶点连接，n*(n-3)/2条
		for(var i=0;i<n;i++){
			for(var j=0;j<n-3 && i+j<n-2;j++){
				B.push('M',A[i*2],A[i*2+1], 'L',A[((i+2+j)%n)*2],A[((i+2+j)%n)*2+1])
			}
		}
	//	console.log(typ, B);
		return err(B)
	}

	if(typ=='Nest'){//嵌套相似多边形（中心点是不变量）

		var NestA=function(D,num,allcnt){
//console.log(A0, D);
			var P=[], k=0;
			for(var i=0;i<A0.length;i++){
				var Ai=A0[i];
				if(k>D.length-1){
					D[k]=D[0];
					D[k+1]=D[1];
				}
				
				if(/[LMZCQ]/i.test(Ai)){
					P[i]=Ai;
				}else if(Ai=='A'){
					P[i]='A';
					P[i+1]=(+A0[i+1]*(1-num/(allcnt+1))).toFixed(2);
					P[i+2]=(+A0[i+2]*(1-num/(allcnt+1))).toFixed(2);
					P[i+3]=+A0[i+3]
					P[i+4]=+A0[i+4];
					P[i+5]=+A0[i+5];

					P[i+6]=D[k];
					P[i+7]=D[k+1];
					k+=2;
					i+=7;
				}else{

					P[i]=D[k];
					k++;
				}
			}
//console.log(P);
			return err(P)

		};
		if(isArr(o)){//[marginx,marginy]
			var stop,j=1;
			while(!stop){
				var D=[];
				for(var i=0;i<n;i++){
					var Dx=C[0]-A[i*2], Dy=C[1]-A[i*2+1], sgnX=Math.sign(Dx), sgnY=Math.sign(Dy);
					if(Math.abs(Dx)<4){
						sgnX=0;
					}
					if(Math.abs(Dy)<4){
						sgnY=0;
					}
					var dx=A[i*2]+o[0]*sgnX*j, dy=A[i*2+1]+o[1]*sgnY*j;
					
					if(dx<=4 || dy<=4 || sgnX*Math.sign(C[0]-dx)<0 || sgnY*Math.sign(C[1]-dy)<0){
						stop=1;
						break;
					}
					D.push(dx, dy)
				}
				if(!stop){

					B.push(D)
				}else{
					break
				}
				j++;
			}
			
		}else{//cnt
			for(var i=1;i<=(o||1);i++){
				var D=[];
				for(var j=0;j<n;j++){
					D.push(parseInt(A[j*2]+(C[0]-A[j*2])*i/(o+1)), parseInt(A[j*2+1]+(C[1]-A[j*2+1])*i/(o+1)))
				}
				B.push(D)
			}
		}

		if(B[0] && B[0].length<A0.length){
			for(var i=0;i<B.length;i++){
				B[i]=NestA(B[i],i+1,B.length)
			}
		}

		return err(B)
		
	}


	if(/Altitudes|PerpendicularFoot|OrthocenterLine/.test(typ)){/*高线：顶点与对边垂足连线，n*(n-2)条		垂足有n*(n-2)个		每条边上有n-2个垂足（需要排序）
	
	
		y=kx+b 
		y=-x/k+c
		
		kx+x/k+b-c=0
			x=(c-b)/(k+1/k) = (c-b)k/(1+k^2)
			y=(ck+b/k) /(k+1/k) = (b+ck^2)/(1+k^2)
		*/
		
		for(var i=0;i<n;i++){

			for(var j=1;j<n-1;j++){
				if(typ=='Altitudes'){
					B.push('M',A[i*2],A[i*2+1],'L')
				}

				if(A[((i+j)%n)*2]==A[((i+j+1)%n)*2]){
					B.push(A[((i+j)%n)*2],A[i*2+1])
				}else if(A[((i+j)%n)*2+1]==A[((i+j+1)%n)*2+1]){
					B.push(A[i*2],A[((i+j)%n)*2+1])
				}else{
					var k=(A[((i+j)%n)*2+1]-A[((i+j+1)%n)*2+1])/(A[((i+j)%n)*2]-A[((i+j+1)%n)*2]),
						k12=1+k*k, 
						b=A[((i+j)%n)*2+1]-k*A[((i+j)%n)*2],
						c=A[i*2+1]+A[i*2]/k ;
					B.push(parseInt((c-b)*k/k12), parseInt((b+c*k*k)/k12));
				}
			}
		}

		if(typ=='PerpendicularFoot'){//垂足有n*(n-2)个
			return err(B)
		}
		if(typ=='PerpendicularFootLine'){//垂足连线，顺次连接（实际上述垂足需要重新排序，暂未实现！）	n*(n-2)条
			if(o){
				return gon(B,typ,o-1)
			}else{
				return ['M'].concat(B,'z')	//此时省略L命令，是可以的
			}
		}
		if(typ=='Altitudes'){
			return err(B)
		}
		
		if(typ=='OrthocenterLine'){//利用垂心是高线三角形的内心
			var D=[],I=gon(B,'Incircle');
			for(var i=0;i<n;i++){
				D.push('M',A[i*2],A[i*2+1], 'L',I[0],I[1])
			}
			return err(D)
		}
		
	}

	return err(B)
		
		
		
};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */
/*
	todo
	https://zhidao.baidu.com/question/558757759834345092.html
	https://zhidao.baidu.com/question/1888431984538964628.html
	可达矩阵，布尔矩阵求幂
	
	
	*/
    var Mtrx={	//矩阵
        build:{//直接构造矩阵
            F:function(a,m,n){//形式矩阵aij
                var A=[];A.t='Mtrx';AtoStr(A);
                for(var i=0;i<m;i++){
                    A.push([]);
                    for(var j=0;j<(n||m);j++){
                        A[i].push(a+'_{'+(i+1)+(j+1)+'}')
                    }
                }
                
                return A
            },
            I:function(m,n,k){//m阶单位矩阵 n指定矩阵单位Matrix Unit：特殊最简行阶梯矩阵主对角线全为1，其余为0
                    //k指定数量矩阵，对角线都是k
                var isk=k!==undefined;
                if(!n || m==n){ 
                    var A=[];A.t='Mtrx';AtoStr(A);
                    for(var i=0;i<m;i++){
                        A.push([]);
                        for(var j=0;j<m;j++){
    
                            A[i].push(j==i?(isk?k:1):0)
                        }
                    }
                }else if(m>n){
                    A=Mtrx.build.B([[Mtrx.build.I(n,n,isk?k:1)],[Mtrx.build.N(m-n,n,0,true)]])
                }else{
                    A=Mtrx.build.B([[Mtrx.build.I(m,m,isk?k:1), Mtrx.build.N(m,n-m,0,true)]])
                }
                return A
            },
            N:function(m,n,k,k2num){//全为k的mxn阶矩阵	k2num指定转换为数字
                var A=[];A.t='Mtrx';AtoStr(A);
                for(var i=0;i<m;i++){
                    if(k2num){
                        A.push([]);
                        for(var j=0;j<n;j++){
                            A[i].push(+k)
                        }
                    }else{
                        A.push((k+(','+k).repeat(n-1)).split(','));
                        //Mtrx.build.A(k,n)
                    }
                }
                return A
            },
            A:function(n,k){//全为k的n长数组 nx1
                var A=[];A.t='Mtrx';AtoStr(A);
                for(var i=0;i<n;i++){
                    A.push(k);
                }
                return A
            },
            B:function(M){//分块：M为矩阵块组成的矩阵（4层数组） 
                //同一行的矩阵块之间, 行数要一致（列数可不作要求），才能拼接
                var A=[];A.t='Mtrx',m=M.length;AtoStr(A);
    //consolelog(M);
                for(var i=0;i<m;i++){
                    var Mi=M[i], n=Mi.length, Mi0=Mi[0];
                    if(!isArr(Mi)){	//M是一维数组
                        A=[].concat(M);
                        A.t='Mtrx';AtoStr(A);
                        return A;
                    }
                    var r=Mi0.length;
                    if(!isArr(Mi0)){
                        r=1;
                    }
                    for(var k=0;k<r;k++){
                        var Ak=[];
                        for(var j=0;j<n;j++){
                            var Mij=Mi[j];
                            Ak=Ak.concat(Mij[k])
                        }
                        A.push(Ak);
                    }
                }
                return A
            },
            BC:function(arr,b,leftcycle){/* b循环阵：b-cyclic
                    arr:第1行数组
                    b参数（b为-1时，就是反循环anti-cyclic，默认不填是1）
                    leftcycle指定向左循环（默认右循环）
    
                */
                var A=[],n=arr.length;A.t='Mtrx';AtoStr(A);
                for(var i=0;i<n;i++){
                    var Ai=[];
                    for(var j=0;j<n;j++){
                        Ai[(n+j+i*(1-2*(+leftcycle||0)))%n]=times([arr[j],b===undefined || b===true?1:b])
                    }
                    A.push(Ai);
                }
                return A
            },
    
            D:function(arr,counter){/*对角阵：arr为方阵块组成的数组，其余部分都为0 
                    counter指定副对角阵
                */
                var n=arr.length,nA=[];
                for(var i=0;i<n;i++){
                    nA.push(isArr(arr[i])?arr[i].length:1)
                }
    
                var nn=Arrf(function(a,b){return a+b},nA,'cp2'), A=Mtrx.build.N(nn,nn,0,true),Ai=0;
                for(var i=0;i<n;i++){
                    var a=arr[i],an=nA[i],isA=isArr(a);
                    for(var j=0;j<an;j++){
                        for(var k=0;k<an;k++){
                            A[Ai+j][counter?nn-Ai-an+k:Ai+k]=isA?a[j][k]:a
                        }
                    }
                    Ai+=an;
                }
                return A
            },
    
            LU:function(S){//上三角或下三角数组
                var A=[],n=S.length, isu=S[0].length==n;A.t='Mtrx';AtoStr(A);
                for(var i=0;i<n;i++){
                    var O=ZLR(0,isu?i:n-i-1).split(''), Si=isu?O.concat(S[i]):S[i].concat(O);
                    A.push(Si);
                }
                return A
            },
            S:function(S,skew){//（反）对称矩阵 S是上三角或下三角数组 skew反对称
                var A=[],n=S.length, isu=S[0].length==n;A.t='Mtrx';AtoStr(A);
                for(var i=0;i<n;i++){
                    var k=isu?i:n-i-1, O=ZLR(0, k).split(''), Si=isu?O.concat(S[i]):S[i].concat(O);
                    for(var j=0;j<k;j++){
                        var ii=isu?j:j+i+1, b=S[ii][isu?i-j:i], _b=neg(b);
                        if(!isNaN(b)){
                            _b=-(+b)
                        }
                        Si[ii]=skew?_b:b
                    }
                    A.push(Si);
                }
                return A
            },
            V:function(S,ev,T){//范德蒙矩阵数组	ev指定指数化成结果	T转置（不转置，首行都为1；转置，首列都为1）
                var A=[],n=S.length;A.t='Mtrx';AtoStr(A);
                for(var i=0;i<n;i++){
                    if(T){
                        if(i==0){
                            A=copyA([1],n)
                        }else if(i==1){
                            Arrf(function(t){t.push(S[i])},A);
                        }else{
                            Arrf(function(t){t.push(Pow([S[i],i],!ev).toStr())},A);
                        }
                    }else{
                        if(i==0){
                            A.push(copyA(1,n))
                        }else if(i==1){
                            A.push(S);
                        }else{
                            A.push(Arrf(function(t){return Pow([t,i],!ev).toStr()},S));
                        }
                    }
                }
                return A
            },
                    
            replace:function(M,arr,posA,direction){/* 替换原矩阵中的部分元素，构成新矩阵
                替换位置posA：
                    [i,j]		其中i,j是起始元素坐标（索引从1开始计数）
                    
                    如果不是数组，字符串形式：i3(替换第3行)		j4(替换第4列)
                    
                方向direction：
    
                    主对角线（-45°方向） d（往右下rb） d-（往左上lt）
                                
                    副对角线（45°方向） -d（往左下lb） -d-（往右上rt）
                    
                    水平h（向右r） h-（向左l）
                    竖直v（向下b） v-（向上t）
    
                */
                var A=Mtrx.opr1('拷',M), m=A.length,n=A[0].length,i=posA[0],j=posA[1], dir=direction;
                AtoStr(A);
                
                if(!isArr(posA)){
                    if(i=='i'){
                        i=+posA.substr(1);
                        j=1;
                        dir='h'
                    }else{
                        i=1;
                        j=+posA.substr(1);
                        dir='v'
                    }
                }
    //consolelog(i,j,dir);
                
                for(var k=0;k<arr.length;k++){
                    var di=/h/.test(dir)?0:(/-$/.test(dir)?-1:1)*k,
                        dj=/v/.test(dir)?0:(/^(-d|[dh]-)$/.test(dir)?-1:1)*k
                    A[i+di-1][j+dj-1]=arr[k]
                }
                return A
            }
        },
        is:{//布尔逻辑
            b2:{//二元关系
                "=":function(A,B){
                    return +(A.length==B.length && A[0].length==B[0].length && Mtrx.toStr(A,'txt')==Mtrx.toStr(B,'txt'))
                },
                "≠":function(A,B){
                    return +!Mtrx.is.b2['='](A,B)
                },
                "r=c":function(A,B){//判断是否行列数一致
                    return +(A.length==B.length && A[0].length==B[0].length)
                },
                "c=r":function(A,B){//判断是否满足矩阵可乘（前者列数等于后者行数）
                    return +(A[0].length==B.length)
                },
                "r=":function(A,B){//判断是否行数一致
                    return +(A.length==B.length)
                },
                "c=":function(A,B){//判断是否列数一致
                    return +(A[0].length==B[0].length)
                },
                "⊆":function(A,B){//定义（同阶）矩阵的包含关系：前者非零元，与后者相应位置的元都相等
                    var m=A.length,n=A[0].length;
                    if(A.length!=B.length || A[0].length!=B[0].length){return 0}
                    for(var i=0;i<m;i++){
                        var Ai=A[i],Bi=B[i];
                        for(var j=0;j<n;j++){
                            var Aij=Ai[j];
                            if(Aij && Aij!=Bi[j]){
                                return 0
                            }
                        }
                    }
                    return 1
                },
                "⊂":function(A,B){return +(Mtrx.is.b2['⊆'](A,B) && !Mtrx.is.b2['='](A,B))},
                "⊇":function(A,B){return +Mtrx.is.b2['⊆'](B,A)},
                "⊃":function(A,B){return +(Mtrx.is.b2['⊆'](B,A) && !Mtrx.is.b2['='](A,B))},
                "⊄":function(A,B){return +(!Mtrx.is.b2['⊂'](A,B))},
                "⊅":function(A,B){return +(!Mtrx.is.b2['⊃'](A,B))},
                "⊈":function(A,B){return +(!Mtrx.is.b2['⊆'](A,B))},
                "⊉":function(A,B){return +(!Mtrx.is.b2['⊇'](A,B))},
            },
            b1:{//一元关系
                "I":function(A){return +Mtrx.is.b2['='](A,Mtrx.build.I(A.length,A[0].length))},//是否为单位（或者行列不相等且有一个满秩时的标准型：左上角为单位阵，其余为0）矩阵
                "0":function(A){return +(A.length<1 || /^(0,)*0$/.test(A))},//是否为零矩阵或空矩阵
                "行阶梯":function(A){//特殊的上三角
                    var B=Mtrx.opr1('r1',A),iA=Arri(B,1),t=iA.join();
                    return +(iA.sort(sortBy.num).join()==t && set.unique(iA).length==B.length)
                },
                "列阶梯":function(A){//特殊的下三角
    
                    return Mtrx.is.b1['行阶梯'](Mtrx.opr1('T',A))
                },
                "行最简":function(A){//特殊的行阶梯、上三角
                    var B=Mtrx.opr1('r1',A);
                    for(var i=0,r=B.length;i<r;i++){
                        var j=B[i][1],v=B[i][0];
                        if(/^0$/.test(v)){continue}
                        if(!/^1$/.test(v) || !/^0*10*$/.test(Arri(A,j).join(''))){return 0} 
                    } 
                    return 1
                },
                "列最简":function(A){//特殊的列阶梯、下三角
                    /*
                    var B=Mtrx.opr1('c1',A);
                    for(var i=0,r=B.length;i<r;i++){
                        var j=B[i][1],v=B[i][0];
                        if(/^0$/.test(v)){continue}
                        if(!/^1$/.test(v) || !/^0*10*$/.test(A[j].slice(i).join(''))){return 0} 
                    } 
                    return 1
                    */
                    return Mtrx.is.b1['行最简'](Mtrx.opr1('T',A))
                    
                },
                "标准型":function(A){//不一定满秩的，行最简 且 列最简
                    
                    return +(Mtrx.is.b1['行最简'](A) && Mtrx.is.b1['列最简'](A))
                },
                "列正交":function(A){//列向量之间两两正交，但不一定是标准（规范）正交（不一定是单位向量）
                    var m=A.length,Ak=[];
                    for(var j=0,n=A[0].length;j<n;j++){
                        var Aj=Arri(A,j);
                        if(!j){
                            Ak.push(Aj);
                        }
                        for(var k=j+1;k<n;k++){
                            if(!j){
                                Ak.push(Arri(A,k));
                            }
                            var p=Mtrx.opr2('内积',Aj,Ak[k]);
                            if(p){
                                return 0
                            }
                        }
                    } 
                    return 1
                },
                "列等模":function(A){//列向量模都相等
                    var x;
                    for(var j=0,n=A[0].length;j<n;j++){
                        var Aj=Arri(A,j);
                        if(!j){
                            x=Mtrx.opr1('向量模1',Aj);
                        }else if(x!=Mtrx.opr1('向量模1',Aj)){
                            return 0
                        }
                    } 
                    return 1
                },
                "列等和":function(A){//列向量和都相等，此和必为特征值
                    var x;
                    for(var j=0,n=A[0].length;j<n;j++){
                        var Aj=Arri(A,j);
                        if(!j){
                            x=plus(Aj);
                        }else if(x!=plus(Aj)){
                            return 0
                        }
                    } 
                    return 1
                },
                "行等和":function(A){//行向量和都相等，此和必为特征值
                    var x;
                    for(var j=0,n=A.length;j<n;j++){
                        var Aj=A[j];
                        if(!j){
                            x=plus(Aj);
                        }else if(x!=plus(Aj)){
                            return 0
                        }
                    } 
                    return 1
                },
    
    
                "S":function(A){return +Mtrx.is.b2['='](A,Mtrx.opr1('T',A))},//是否为对称矩阵 symmetric
                "-S":function(A){return +Mtrx.is.b2['='](Mtrx.opr1('-',A),Mtrx.opr1('T',A))},//是否为斜（反）对称矩阵 Skew-symmetric
                "D":function(A){//是否为对角阵
                    var m=A.length, n=A[0].length;
                    for(var i=0;i<m;i++){
                        for(var j=0;j<n;j++){
                            if(i!=j && +A[i][j]!=0){
                                return 0
                            }
                        }
                    }
                    return 1
                },
                "qD":function(A){//是否为准对角阵
                    var m=A.length, n=A[0].length;
                    for(var i=0;i<m;i++){
                        for(var j=i+1;j<n;j++){
                            if(+A[i][j]!=0 || +A[j][i]!=0){
                                return 0
                            }
                        }
                    }
                    return 1
                },
                "U":function(A){//是否为上三角	每一行，对角线下方行都为0
                    var m=A.length, n=A[0].length;
                    for(var i=0;i<n;i++){
                        for(var j=i+1;j<m;j++){
                            if(+A[j][i]!=0){
                                return 0
                            }
                        }
                    }
                    return 1
                },
                "L":function(A){//是否为下三角	每一行，对角线右侧列都为0
                    
                    return Mtrx.is.b1['U'](Mtrx.opr1('T',A))
                },
                "UL":function(A){//是否为上或下三角
                    return Mtrx.is.b1.U(A) || Mtrx.is.b1.L(A)
                },
                "r0":function(A){var b=0;for(var i=0;i<A.length;i++){if(/^0+$/.test(A[i].join(''))){return b}} return b},//是否存在全为0的行
                "c0":function(A){var b=0;for(var i=0;i<A[0].length;i++){if(/^0+$/.test(Arri(A,i).join(''))){return b}} return b},//是否存在全为0的列
                "rc0":function(A){return +(Mtrx.is.b1.r0(A)||Mtrx.is.b1.c0(A))},//是否存在全为0的行或列
                "rk":function(A){//是否存在成比例的行
                        var b=0;
                        for(var i=0;i<A.length;i++){
                            if(/^0+$/.test(A[i].join(''))){return b}
                        }
                        return b},
                "ck":function(A){var b=0;for(var i=0;i<A[0].length;i++){if(/^0+$/.test(Arri(A,i).join(''))){return b}} return b},//是否存在成比例的列
                "rck":function(A){return +(Mtrx.is.b1.r0(A)||Mtrx.is.b1.c0(A))},//是否存在成比例的行或列
                "rck0":function(A){return +(Mtrx.is.b1.rc0(A)||Mtrx.is.b1.rck(A))},//是否存在全为0或成比例的行或列
    
                "R":function(A){return +Mtrx.is.b2['='](A,Mtrx.build.I(A.length))},//是否为实距阵
                "RS":function(A){return +(Mtrx.is.b1.S(A) && Mtrx.is.b1.R(A))},//是否为实对称阵
            }
        },
        fromStr:function(str,typ){
            var A,m,n,ij,e,rect, s=opreplace(str).replace(/&.*/,'');
            /*typ指定特殊类型输入
                1阶矩阵用[数字]表示（必须使用[]，否则超过1位数字时，无法区分1阶，还是其他方阵）
                sq 方阵 或 个位整数
                    下列格式自动识别3×3
                    |1 2 3;4 5 6;7 8 9|
                    1 2 3;4 5 6;7 8 9
                    1 2 3 4 5 6 7 8 9 
                    123456789
                    123-4-567-89
                    
                    个位整数
                    1234;-2356;1230 被识别为3×4  未实现（因为有歧义）
                    1234;2-356;1230 被识别为3×4	未实现
                    1234 2-356 1230 被识别为3×4 未实现
                    
                    1234,2-356,1230 被识别为3×4
                    1,2,3,4;2,-3,5,6;1,2,3,0 被识别为3×4
                    1,2,3,4 2,-3,5,6 1,2,3,0 被识别为3×4
    
                    个位分数或小数
                    1-1-110;1-11-31;1-1-2/43-1/2
                
                co 指定返回二次型系数（重新降序排列）
                
                
            str末尾有' 表示转置
            str末尾有H 表示共轭转置
            str末尾有* 表示伴随
            
            系数：-?\d*(\d+[\.\/]\d+)? 
            
                整数：-?\d+
                小数：-?\d+\.\d+
                分数：-?\d+\/\d+
                小数分数：-?\d+[\.\/]\d+
                负号：-\D
                
            单字母变量：/^[a-zα-ω]$/i
            
            特殊矩阵（命令或函数）：
                系数+字母（表示矩阵倍数）
                
                diag(,) 对角阵
                cdiag(,) 副对角阵
                I5 单位矩阵
                I5,4	(拟)单位矩阵
                O5 零矩阵
                I5,4 零矩阵
    
                -6I7 数量矩阵
                [数字]m,n
                N(m,n,k)
                
                BC(arr;[1,b];[1]) b循环
                N(-1,3) 元素相同矩阵 N(k,m,n) 	注意：与Mtrx.build.N参数顺序不一致
                S(;) 对称阵
                S2(;) 二次型对称阵（输入的非对角线元素是最终矩阵元素的2倍）	输入n(n+1)/2个元素
                
                QF() Quadratic Form二次型（含具体二次项xi^2,xixj等）
                Linear() 从线性方程组提取出矩阵（齐次则不含最后的零列）
                
                Skew2(;) 二次型拟反对称阵
                Skew(;) （拟）反对称阵（主对角线元素可以不为0）
                Sparse(;)m,n 稀疏矩阵（3元组表示的矩阵）
                V(,)[e指数化简] 范德蒙矩阵
            
            */
    
            if(/^[\d,-; ]+$/.test(s) && /[,; ]/.test(s)){
                if(/\d-\d/.test(s)){
                    s='['+Arrf(function(x){return x.replace(/-?\d/g,'$& ').trim()},s.split(/[ ;,]+/)).join(';')+']'
                }else{
                    s='['+s.replace(new RegExp('[^-\\d'+s.replace(/[-\d]/g,'')[0]+']','g'),';')
                        .replace(new RegExp(s.replace(/[-\d]/g,'')[0],'g'),' ')+']'
                }
    
            }
    
    //console.log(s);
    
            if(typ=='v'){//行向量
                A=s.replace(/[\[\]]/g,'').split(/[, ]/);A.t='Mtrx';AtoStr(A);
                return A
            }
            if(typ=='vT'){//列向量
                A=Arrf(function(x){return [x]},s.replace(/[\[\]]/g,'').split(/[, ]/));A.t='Mtrx';AtoStr(A);
                return A
            }
            
            if(/^\[\S+\]$/.test(s)){//一阶矩阵
                A=[[s.replace(/^\[|\]$/g,'')]];A.t='Mtrx';AtoStr(A);
                return A
                
            }
            
            if(/^-1?[a-z]/i.test(s)){//-命令字母
                return Mtrx.opr1('-',Mtrx.fromStr(s.replace(/^-1?/,''),typ||''))
            }
            if(/^-?\d+([\.\/]\d+)?[a-zα-ω]/i.test(s)){//-数字(整数、小数、分数)字母
                return Mtrx.opr2('*',s.replace(/[^\d\.\/].+$/,''),Mtrx.fromStr(s.replace(/^-?\d+([\.\/]\d+)?/,''),typ||''))
            }
    
            if(/['\*H]$/.test(s)){//转置 共轭转置H 伴随矩阵*
                var t=s.substr(-1);
                return Mtrx.opr1('T*H'["'*H".indexOf(t)],Mtrx.fromStr(s.substr(0,s.length-1),typ||''))
            }
            if(/^\[-?[\da-zα-ω]+([\.\/]\d+)?\]\d+(,\d+)?/i.test(s)){	//同数字（或字母）矩阵	[a]m,n
                var M=s.substr(1).replace(']',',').split(',');
                return Mtrx.build.N(M[1],M[2]||M[1],M[0])
            }
            if(/^N\(/.test(s)){//元素相同矩阵（同上）
                var M=s.replace(/^[^\(]+\(|\)$/g,'').split(',');
                return Mtrx.build.N(M[1],M[2]||M[1],M[0])
            }
            if(/^I\d+(,\d+)?$/.test(s)){//(拟)单位矩阵
                var M=s.substr(1).split(',');
                return Mtrx.build.I(M[0],M[1]||M[0])
            }
            if(/^O\d+(,\d+)?$/.test(s)){//零矩阵
                var M=s.substr(1).split(',');
                return Mtrx.build.N(M[0],M[1]||M[0],0)
            }
            if(/^V\(/.test(s)){//范德蒙矩阵
                var T=/'$/.test(s),ev=/\)1.?$/.test(s), M=s.replace(/^V.|\)[^\)]*$/g,'').split(',');
                return Mtrx.build.V(M,ev,T)
            }
            
            if(/^B\(/.test(s)){//分块
                return Mtrx.opr1('*',Mtrx.fromStr(s.substr(0,s.length-1),typ||''))
            }
            if(/^BC\(/.test(s)){//b循环
                var t=s.substr(3,s.length-4).split(';');
                return Mtrx.build.BC(Vect.fromStr(t[0]),t[1],t[2]);
            }
            if(/^c?diag\(/.test(s)){//对角 副对角
                if(!/,/.test(s)){
                    s=s.replace(/ /g,',');
                }
                
                var isC=/^c/.test(s), D=exp2arr(s.substr(+isC+5,s.length-6-(+isC)));
                //consolelog(s.substr(+isC+5,s.length-6-(+isC)),D);
    
            //diag(345,678,diag(13,56),diag(1,2,4,diag(3,4,5,diag(6,7))))	这里有递归！
                //return Mtrx.build.D(Arrf(Mtrx.fromStr,D),isC);
                return Mtrx.build.D(Arrf(function(t){return Mtrx.fromStr(/^\d+$/.test(t)?'['+t+']':t)},D),isC);
            
            }
            if(/^S(kew)?2?\(/.test(s)){//（反）对称
                /*
                    元素个数是n(n+1)/2 = x  则n^2+n-2x=0, n=(-1+√(1+8x))/2
                    元素个数逐行减少n n-1 n-2
                    对角线元素序号（从0编号）分别是0 n 2n-1 3n-3 4n-6 5n-10 ... in-i(i-1)/2
                    二次型元素序号（从0编号）分别是0 1 2 ... n-1;n n+1 ... 2n-2;2n-1 ... 3n-4;3n-3
                */
                var isSkew=/^Skew/.test(s), isS2=/^S(kew)?2\(/.test(s),sA=s.replace(/^[^\(]+\(|\)$/g,'').split(/[ ,;]/),n=(Math.sqrt(1+sA.length*8)-1)/2,M=[];
                for(var i=0;i<n;i++){
                    var Mi=i*n-i*(i-1)/2,Mi1=(i+1)*n-i*(i+1)/2,MiA=[];
                    for(var j=0;j<n-i;j++){
                        if(isS2){
                            MiA.push(j?divide([sA[Mi1+j-1],2]):sA[i])
                        }else{
                            MiA.push(sA[Mi+j])
                        }
                    }
                    M.push(MiA)
                }
                return Mtrx.build.S(M,isSkew);
            }
    
            if(/^QF\(/.test(s)){//二次型 （含变量二次项）	typ=='co'，最终也返回系数数组
                var s0=s.split('QF(')[1].replace(/\)$/,''),deg=+fmax(s0.match(/x\d/ig).join(',').replace(/x/ig,'').split(',')),
                    tA=Arrf(function(x){return exp2coe(s0,'x'+x+'\\^2')}, seqA(1,deg));
    //consolelog(deg,tA);
                    for(var i=1;i<=deg;i++){
                        tA=tA.concat(Arrf(function(j){return plus([exp2coe(s,'x'+i+'x'+j),exp2coe(s,'x'+j+'x'+i)])}, seqA(i+1,deg-i)))
                    }
    //consolelog(tA);
                var M=Mtrx.fromStr('S2('+tA.join(' ')+')');
    
                return typ=='co'?[M,tA]:M
    
            }
    
            if(/^Linear\(/.test(s)){//从线性方程组提取系数	（齐次，不含最后一列零向量）
                var s0=s.split('Linear(')[1].replace(/\)$/,''),deg=+fmax(s0.match(/x\d/ig).join(',').replace(/x/ig,'').split(',')), inhomo=/=[^0]/.test(s0);
                s0=s0.split(/ *[;,\n]/.test(s0)?/ *[;,\n]/g:' ');
                var m=s0.length,M=[]; //M=Mtrx.build.N(m,deg+(+inhomo),0);
                for(var j=0;j<m;j++){
                    var tA=Arrf(function(x){return exp2coe(s0[j],'x'+x)}, seqA(1,deg));
                    if(inhomo){
                        tA.push(exp2coe(s0[j],'='));
                    }
                    M.push(tA)
                }
    //consolelog(tA);
                
                M.t='Mtrx';M.toStr=function(p){return Mtrx.toStr(this,p)};
    
                return M
    
            }
    
    
    
            if(/^Sparse/.test(s)){//三元组表示的稀疏矩阵
                var M=s.replace(/^[^\(]+\(|\)[^\)]*$/g,'').split(';'), mn=s.replace(/.+\)/,'').split(','),m=+mn[0],n=mn.length<2?m:+mn[1];
                A=Mtrx.build.N(m,n,0);
                //consolelog(M);
                for(var i=0;i<M.length;i++){
                    var Mi=M[i];
                    if(/,/.test(Mi)){
                        Mi=Mi.split(',')
                    }else{
                        Mi=[Mi[0],Mi[1],Mi.substr(2)];
                    }
                //consolelog(Mi);
                    A[+Mi[0]-1][+Mi[1]-1]=Mi[2]
                }
                //consolelog(A);
                return A
            }
    
    /* 未被正确识别	，需修复	
        [-7;3] 单列
        x0y1 首个字符是字母
        
        
        
    */
            if(/^[\(\|].+[\)\|]$/.test(s) && !s.replace(/\([^\(\)]+\)/g,'').replace(/\|[^\|]+\|/g,'').trim().length){//	(0 1 3 -2)(2 1 -4 3)(2 3 2 -1)
                e=s.replace(/^.|.$/g,'').replace(/[, ]/g,' ').replace(/\)\(/g,';').replace(/\|\|/g,';');
                
            }else{
                if(typ=='sq' || !/\[/.test(s) && !/I|diag/.test(s)){
                    //consolelog(s);
                    e=s.replace(/ +/g,' ').trim().replace(/^\||\|$/g,'').replace(/[;,] */g,' ');//不用ntrim，因为会把开头的零去掉
    
                    A=[];A.t='Mtrx';AtoStr(A);
                    
    
                    
                    
                    if(!/ /.test(e)){//不含空格
        //consolelog(e);
                        if(/-/.test(e) || /^0/.test(e) || /\/.+\//.test(e) || !/\D/.test(e)){//[\da-zα-ω](?=\d|-)
                            ij=e.replace(/[\da-zα-ω](?![\/\.;,])/ig,'$& ').trim().split(' ')
        //consolelog(ij);
                        }else{
                            ij=e
                        }
                    }else{//含空格
                        /*
                        if(/\d-\d/.test(e)){
                            var es=e.split(' ');
                            m=es.length;
                            for(var i=0;i<m;i++){
                                A.push(es[i].replace(/[\da-zα-ω](?![\/\.;,])/g,'$& ').trim().split(' '))
                            }
                            return A
                        }
                        */
                        
                        ij=e.split(' ')
                    }
                    if(isArr(ij)){
                    
                        m=Math.sqrt(ij.length);
                        //consolelog(ij.length,m);
                        if(m%1){//根号开不尽？
                            m=ij.length;
                            rect=1;
                        }
    
                        for(var i=0;i<m;i++){
                            var a=[];
                            if(rect){
                                A.push(ij[i].replace(/[\da-zα-ω](?=![\/\.;,])/g,'$& ').trim().split(' '));
                            }else{
                                for(var j=0;j<m;j++){
                                    a.push(ij[i*m+j]);
                                }
                                A.push(a)
                            }
                        }
                    }else{
                        A[0]=[e]
                    }
                    return A
                }
                e=s.replace(/ +/g,' ').trim().replace(/^\[|\]/g,'');
            }
    
            
            ij=sub2n(s.replace(/ +/g,' ').trim().substr(e.length+2*(+/\[/.test(s)))).split(',');
            m=+ij[0]||1;
            n=ij.length<2?m:+ij[1];
    
            if(/[ ;]/.test(e)){
                A=e.split(';');
                m=A.length;
                for(var i=0;i<m;i++){
                    A[i]=ZLR(A[i])
                }
                A.t='Mtrx';AtoStr(A);
            }else if(/[ij]/.test(e)){//f(i,j)表达式形式
                //consolelog(e, ij);
                A=Mtrx.build.N(m,n,0);
    
                for(var i=0;i<m;i++){
                    for(var j=0;j<n;j++){
    
                        A[i][j]=Mfn.opr1('=',Mfn.opr1(':num',e,1,{"i":i+1,"j":j+1})).toStr()
                    }
                }
            }else{//（拟）单位矩阵I、数量矩阵
                ij=e.replace(/.*I/,'').split(',');
                var k=e.replace(/I.*/,'')||1
                m=+ij[0]||1;
                n=ij.length<2?m:+ij[1];
                A=Mtrx.build.I(m,n,k);
            }
    
    
            return A
        },
    
        toStr:function(A,typ){//转成文本
            /* typ输出类型
                txt纯文本 \t \n
                mtrx矩阵形式（默认 latex）
                det行列式形式
                soft常用软件输入形式, ;
                v矢量（行向量）
            */
            
    //consolelog(A,A[0]);
            var type=typ||(A.typ?A.typ:'mtrx'),txt=type=='txt',sft=type=='soft',a=txt||sft?'':SC+'"inblk '+type+'">',b=txt||sft?'':sc,n=A.length,m=isArr(A[0])?A[0].length:0,sepc=txt?'\t':(sft?',':''),sepr=txt?'\n':(sft?';':''),r=[];
            if(txt||sft){
                for(var i=0;i<n;i++){
                    r.push(A[i].join(sepc))
                }
                return r.join(sepr);
            }else if(typ=='v'){//行向量
                return '('+kfrac(A.join(', '),1,'t')+')'
            }else if(typ=='vT'){//列向量
                return '('+kfrac(A.join(', '),1,'t')+')^T'
            }else{
                //consolelog(A);
                return kmtrx(A)
            }
    
        },
    
        opr1:function(op,A,p){
    //矩阵一元运算 p是可选参数
    //consolelog('矩阵 opr1 ',op,A,p);
    
    
            var B=[],m=A.length,n=A[0].length,minmn=Math.min(m,n), ar=arguments, arl=ar.length;
    
            if(op=='3'){//三元组表示
                for(var i=0;i<m;i++){
                    //[1 1 2 2 1;0 2 1 5 -1;2 0 3 -1 3;1 1 0 4 -1]
                    var Ai=A[i];
                    for(var j=0;j<n;j++){
                        var Aij=Ai[j];
                        if(''+Aij!='0'){
                            B.push([i+1,j+1,Aij]);
                        }
                    }
                }
    
            }
            if(op=='bool'){//布尔化为 0-1矩阵
                B=Arrf(function(Ai){return Arrf(function(t){return +!/^0$/.test(t)},Ai)},A);
            }
    
    
    
    
            if(op=='r0'){//统计各行零数目的数组
                B=Arrf(function(Ai){return plus(Arrf(function(t){return +/^0$/.test(t)},Ai))},A);
            }
            if(op=='c0'){//统计各列零数目的数组
                B=Arrf(function(Ai){return plus(Arrf(function(t){return +/^0$/.test(t)},Ai))},Mtrx.opr1('T',A));
            }
            if(op=='r1'){//返回各行第1个非零数及索引（从0开始）的二维数组	[[非零数1, 2, 3], [索引1, 2, 3]]
                B=Arrf(function(Ai){for(var j=0;j<n;j++){if(!/^0$/.test(Ai[j])){return [Ai[j],j]}} return [0,-1]},A);
            }
    
            if(op=='c1'){//返回各列第1个非零数及索引（从0开始）的二维数组
                B=Arrf(function(Ai){for(var j=0;j<m;j++){if(!/^0$/.test(Ai[j])){return [Ai[j],j]}} return [0,-1]},Mtrx.opr1('T',A));
            }
    
    
    
            if(op=='T'){//转置
                for(var j=0;j<n;j++){
                    B.push([]);
                    for(var i=0;i<m;i++){
                        B[j].push(A[i][j])
                    }
                }
            }
    
            if(op=='-'){//负矩阵	p=='bool' 布尔矩阵取反：0，1互换
                B=Arrf(function(Ai){return Arrf(p=='bool'?is0:neg,Ai)},A);
            }
            if(op=='H'){//共轭转置
                for(var j=0;j<n;j++){
                    B.push([]);
                    for(var i=0;i<m;i++){
                        B[j].push(A[i][j])
                    }
                }
            }
    
            if(op=='/'){//将小数，百分数，分数化
                
                
                //B=Arrf(function(Ai){return Arrf(n2n,Ai)},A);
                B=Mtrx.opr1('拷',A);
            }
    
    
            if(op=='kA'){//分离公倍数， 返回数组[公倍数（公分母），新矩阵或向量]		参数p暂用不到
                
                var Ais2=isArr(A,true), Bj=[];
                if(Ais2){//二维
                    B=Mtrx.opr1('拷',A);
                    Arrf(function(x){Bj=Bj.concat(x)},B)
    
                }else{
                    B=[].concat(A);
                    Bj=B;
                }
                //console.log(Bj,A);
                var g=gcdFrac(Bj),l=lcmFrac(Bj);
                if(l!=1 || g!=1){//需整数化 或者需要约分
                    
                    for(var i=0;i<m;i++){
                        if(Ais2){
                            for(var j=0;j<n;j++){
                                if(l!=1){
                                    B[i][j]=times([B[i][j],l]);
                                }
                                if(g!=1){
                                    B[i][j]=divide([B[i][j],g]);
                                }
                            }
    
                        }else{
    
                            if(l!=1){
                                B[i]=times([B[i],l]);
                            }
                            if(g!=1){
                                B[i]=divide([B[i],g]);
                            }	
                        }
                    }
                }
                return [divide([g,l]),B]
            }
    
    
    
            if(op=='向量模1'){/*A是一维数组（行向量）1表示是1维数组，而不是矩阵
                参数p=2指定返回 自身内积（模平方）而不是模（内积开方）
                返回数
                    
                */
                var s=Arrf(square,A);//ArrfcA([plus,square],A);square不支持数组导致异常？
                //return p==2?plus(s,1):sqrt(plus(s),1)
                return p==2?plus(s):sqrt(plus(s))
            }
            if(op=='单位化1'){/*A是一维数组（行向量）1表示是1维数组，而不是矩阵 
                参数p=2指定除以自身内积（模平方）而不是模
                返回行向量
                    
                */
                var u=plus(Arrf(square,A));
                return Mtrx.opr2('/',[A],p==2?u:sqrt(u))[0]
            }
    
            if(op=='单位化'){//矩阵各列分别单位化
                
                B=Mtrx.opr1('拷',A);
                for(var j=0;j<n;j++){
                    var Aj=Arri(A,j), u=sqrt(plus(Arrf(square,Aj)));
                    //console.log(Aj,plus(Arrf(square,Aj)),u);
                    if(u){
                        for(var i=0;i<m;i++){
                            //console.log(Aj[i],u,divide([Aj[i],u]));
                            B[i][j]=divide([Aj[i],u])//Divide([Aj[i],u]).toStr()//divide([Aj[i],u]);
                        }
                        
                    }
                }
                //console.log(B)
    
            }
    
            
            if(op=='正交化'){/*矩阵各列施密特正交化
                返回 [正交化（或继续单位化）矩阵, 步骤]
                有参数p 需要单位化
    
            */	
                B=Mtrx.opr1('拷',A);
                var bu=[],Bjs=[],Bs=[A.toStr(1)],noteB=[];//bu记录各向量的模平方 
                for(var j=0;j<n;j++){
                    var Aj=Arri(A,j),abu=[],Bj=[];
                    for(var k=0;k<j;k++){
            //consolelog(k,Bjs[k]);
                        abu.push(Mtrx.opr2('内积',Aj,Bjs[k]));
                        
                    }
            //console.log(abu,'Bs=\n',Bs.join('\n'));
                    var not0=j && /[^0]/.test(abu.join(''));
                    if(not0){
                        for(var i=0;i<m;i++){
                            for(var k=0;k<j;k++){
                                if(!/^0$/.test(abu[k])){
                                    B[i][j]=minus([B[i][j],times([divide([abu[k],bu[k]]),B[i][k]])])
                                }
                            }
                            Bj.push(B[i][j]);
                        }
    
                    //consolelog('内积组',abu.join('\n'));
                        
                        //consolelog(abu, p);
                        noteB.push(['第'+(j+1)+'列，'+(j==1?'减去第1':'分别减去前'+(j==2?'两':j))+'列的'+
                            frac('(C_{'+(j+1)+'},C_{'+(j!=1?'i':j)+'})',
                                '('+['',',',''].join('C_{'+(j!=1?'i':j)+'}')+')','')+(j==1?'='+kfrac(divide([abu[0],bu[0]])):'')+'倍',
                            (j==1?'':'其中i='+seqA(1,j).join())
                            ]);
                        
                        //consolelog(Bs);
                        
                    }else{
                        Bj=Arri(B,j);
                    }
    
                    //console.log(Bj);
                    var g=gcdFrac(Bj),l=lcmFrac(Bj);
                    if(l!=1 || g!=1){//需整数化 或者需要约分
                        Bj=[];
                        for(var i=0;i<m;i++){
                            if(l!=1){
                                B[i][j]=times([B[i][j],l]);
                            }
                            if(g!=1){
                                //console.log(B[i][j],g);
                                //console.log(i,j,B);
    
                                B[i][j]=divide([B[i][j],g]);
                            }
                            Bj.push(B[i][j]);
                        }
                        var nt='第'+(j+1)+'列乘以'+kfrac(divide([l,g]));
                        if(not0){
                            noteB.slice(-1)[0][1]+=(j==1?'':'，')+'然后'+nt;
                        }else{
                            noteB.push(nt);
                        }
                    }
                    
                    if(not0 || l!=1 || g!=1){
                        Bs.push(B.toStr(1));
                    }
    //consolelog('Bj = ',Bj);
    //consolelog('Bj^2 = ',Arrf(square,Bj));
                    
                    var u=plus(Arrf(square,Bj));
    //consolelog('u = ',u);
                    
                    bu.push(u);
                    Bjs.push(Bj);
    //consolelog('j=',j,' ','u=',u, 'Bj='+Bj,'gcd=',g,'lcm=',l);
                }
                if(!noteB.length){
                    Bs.push(B.toStr(1));
                    noteB.push('矩阵列向量已经是两两正交的');
                }
                if(p){
                    
                    B=Mtrx.opr1('单位化',B);
                    Bs.push(B.toStr(1));
                    noteB.push('再单位化得到');
                }
    
        
                 B.t='Mtrx';B.toStr=function(p){return Mtrx.toStr(this,p)};
                 
    //consolelog(op,' 结束',p);
                 
                return [B,'\\small '+Eq(Bs,noteB,'','xrightarrow')+' \\normalsize'];
            }
            
            
            if(op=='^'){//幂
                if(ar[3]){
                    if(ar[3]=='d'){//对角阵求幂
                        for(var i=0;i<m;i++){
                            //consolelog(A[i][i],p);
                            B.push(pow([A[i][i],p]))
                        }
                        
                        return Mtrx.build.D(B)
                        
                    }
                    
                    
                }
                if(/^0$/.test(p)){
                    return Mtrx.build.I(m)
                }
                if(/^1$/.test(p)){
                    return Mtrx.opr1('拷',A);
                }
                if(+p>0){/*这里p是正整数，暂未推广到幂为有理数的情况(涉及到矩阵开方定义)。
                另外，还可定义矩阵的矩阵幂（得到分块矩阵，与Kronecker积思路类似）
        指数的矩阵幂，已经有定义了。是按照指数函数的幂级数展开得到。
        */
                    return Mtrx.opr2.apply(null,['*'].concat(copyA(A,p)))
                }
                if(+p==-1){
                    return Mtrx.opr1('逆',A)
                }else if(i<0){
                    return Mtrx.opr2('^',Mtrx.opr1('逆',A),-(+p))
                }
    
            }
    
    
            if(op=='.^'){//数幂
                B=Mtrx.opr1('拷',A);
                Arrf(function(x){Arrf(function(y,i){x[i]=Mfn.oprs('^',[y,p],1).toStr()},x)},B);
    
            }
    
            if(op=='b^'){//布尔幂
                if(/^0$/.test(p)){//0次幂，定义为单位矩阵
                    return Mtrx.build.I(m)
                }
                if(/^1$/.test(p) || Mtrx.is.b1.D(A) || ar[3] && ar[3]=='d'){//对角阵求幂
                    return Mtrx.opr1('bool',A);
                }
    
    
                if(+p>0){/*这里p是正整数
        */
                    return Mtrx.opr2.apply(null,['b⊙'].concat(copyA(A,p)))
                }
    
            }
    
            if(op=='b可达'){/*布尔可达矩阵。I+A+A²+A³ ⋯ 反复求幂及各幂和，直到不变化
                算法1：I+A , (I+A)², (I+A)³ 
                    利用 (I+A)^n=I+A+A²+A³ ⋯ （布尔意义上的等号） 
                */
                var IA=Mtrx.opr2('b∨',A,Mtrx.build.I(m));
    
                B=Mtrx.opr1('拷',IA);
    
                for(var i=1;i<100;i++){//迭代超过100次，强行终止
                    var C=Mtrx.opr1('拷',B);
                    B=Mtrx.opr2('b⊙',B,IA);
                    if(Mtrx.is.b2['='](B,C)){
                        return [B,i];
                    }
                }
                return [B,i]
            }
    
    
    
    
            if(op=='秩'){//秩 仅对已化成最简型（或非零的行、列向量线性无关的三角阵）的矩阵，非零行(列)计数
    
                var rm=0,rn=0,r;
                for(var i=0;i<m;i++){
                    if(/[^0]/.test(A[i].join(''))){
                        rm++;
                    }
                }
                for(var i=0;i<n;i++){
                    if(/[^0]/.test(Arri(A,i).join(''))){
                        rn++;
                    }
                }
                r=Math.min(rm,rn);
                return r
    
            }
    
            if(op=='极大无关组索引'){//二维数组 [无关组索引数组，其余向量索引数组]	 仅对已化成行阶梯形的矩阵，统计各行第1个非零元的列号（从1开始）
                for(var i=0;i<m;i++){
                    var Ai=A[i];
                    if(/[^0]/.test(Ai.join(''))){
                        for(var j=0;j<n;j++){
                            if(/[^0]/.test(Ai[j])){
                                B.push(j+1);
                                break;
                            }
                        }
                    }
                }
                 B.t='Mtrx';B.toStr=function(p){return Mtrx.toStr(this,p)};
                return [B,set.opr2('-',seqA(1,n),B)]
            }
            if(op=='part'){/*矩阵分块（返回分块数组） 参数p是十字分割线 写法与Table边框线命令一样
                I2_5J3_7表示用4条线（#）分成9块
                I3J3 表示左上角是3阶方阵
                r2	行平均分两块
                c2	列平均分两块
                r2c2  十字分隔
                D3_4_2		主对角阵分块（仅方阵）
                CD3_4_2		副对角阵分块（仅方阵）
                
                
    分4块的方法，可以满足分块乘法：
                r1c1 r1c2    *  c1rx c1ry   =   r1rx  r1ry
                r2c1 r2c2       c2rx c2ry       r2rx  r2ry
                第1个矩阵分块的第i列的分块列数，等于第2个矩阵分块的第i行的分块行数
                
    如没有参数p，则默认按平均分块[n/2,n/2;n/2;n/2]（偶数阶），[(n+1)/2,(n-1)/2;(n-1)/2,(n+1)/2]	（奇数阶）
                */
                var M,N;
                if(/[rc]/.test(p)){
                    M=+p.split('c')[0].replace('r','')||1;
                    N=+p.replace(/r\d+|c/g,'')||1;
                    var mM=m/M,nN=n/N;
                    for(var i=0;i<M;i++){
                        B.push([]);
                        for(var j=0;j<N;j++){
                            B[i].push(subMtrx(A,i*mM+1,(i+1)*mM,j*nN+1,(j+1)*nN));
                        }
                    }
                }
                if(/[CD]/.test(p)){
                    var nA=p.replace(/[CD]/g,'').split('_'),nAs=[0],nAsC=[m],isC=/C/.test(p);
                    M=nA.length;
                    for(var i=0;i<M;i++){
                        nAs.push(+nA[i]+nAs[i]);
                        nAsC.unshift(nAsC[i]-(+nA[i]));
                        B.push([]);
                        for(var j=0;j<M;j++){
                            B[i].push(subMtrx(A,1+nAs[i],nAs[i+1],1+(isC?nAsC[j]:nAs[j]),isC?nAsC[j+1]:nAs[j+1]));
                        }
                    }
                }
                if(/[IJ]/.test(p)){
                    var mA=/I/.test(p)?p.replace(/J.+|I/g,'').split('_'):[n],nA=/J/.test(p)?p.replace(/.+J/g,'').split('_'):[n];
                    M=mA.length;
                    N=nA.length;
                    mA.unshift(0);
                    nA.unshift(0);
                    for(var i=0;i<M;i++){
                        B.push([]);
                        for(var j=0;j<M;j++){
                            B[i].push(subMtrx(A,1+mA[i],mA[i+1],1+nA[j],nA[j+1]));
                        }
                    }
                }
    
            }
            if(op=='parts'){//显示分块矩阵 参数p是十字分割线 写法与Table边框线命令一样
    
                return kmtrx(A,'',p) 
            }
    
            if(op=='part0'){/*
                
                参数p是十字分割线 写法与Table边框线命令一样
                
                如无参数，分析零分块（四个角落至少有1个零分块，与零分块上下左右相邻的块需为方阵）的位置，进行自动分块2x2分块
                
                返回4个子分块矩阵
                
                0s,t	ss
                tt		0t,s
    
                s,s		0s,t
                0t,s	tt
    
                从4个角开始，沿对角线方向，找最大的连续零元素分块
                */
                return kmtrx(A,'',p)
            }
    
            if(op=='eval'){//化简计算结果
                if(A.t){//1个矩阵
                    //console.log(A);
                    B=Arrf(function(x){return Arrf(function(y){return Mfn.opr1('=',y,1).toStr()},x)},A);
                }else if(isArr(A)){
                    //B=Arrf(function(x){return Mtrx.opr1('eval',x)},A)
                    ////consolelog('矩阵组',A[0]);
                    B=Mtrx.opr1('eval',A[0])
                }else{
                    B=Arrf(function(x){return Arrf(function(y){return Mfn.opr1('=',y,1).toStr()},x)},A)
                }
                
            }
            if(op=='pt'){/*初等变换（结果不化简）
                参数p 变换命令
                
                返回 	[形式矩阵，系数, 步骤]
                
                */
                B.t='';
                B=[Mtrx.opr1('拷',A),1];
    /*
                基本：
                    i3+=i5×t	×号必需（作为分隔符），t是倍数（可以是表达式，无需括号）
                    i3-=i5×t
                    
                    i3×=t
                    i3*=t
                    i3÷=t
                    i3/=t
                    
                    i3≈i6	i3~~i6
                    
                    
                T 转置
                    
                复合：
                    
                    i1~i5+=i8×t 多对一一
                    i1,i5+=i8×t
                    i1,i5+=i8×t,s 多对一多 （分别加）
                    
                    i1,i5+=i8×?（省略相应的倍数，首个非零项化为0）
              ? 问号后加L或U （化下（上）三角模式，只在主对角线右（左）侧，才乘以倍数化零）
                    
                    
                    j3-=i8（省略相应的倍数，其余行，相应列化为0）
                    j3+=i8 计算步骤显示有误，bug尚未修复！
                    
                    i1,i3~i5+=i8×t,s,u,v
                    
                    i1+=i2~i5×t 一对多一 （连加）
                    i1+=i2~i5 一对多一 （连加，t=1时的简写）
                    i1+=i2~i3×t,s 一对多多 （分别加）
                    
                    i1,i6+=i2~i4×t 多对多一 （连加）
                    i1,i8,i9+=i2~i3×t,s 多对多多 （分别加）
                    
                    i1~i5*=t
                    i1~i5*=t,s,u,v,w
                    
                    i1~i5≈i2~i6 冒泡排序
                    
                高级缩写指令(只在PTs中支持，需要大量的判断)：
                        
                        i[SBb]/= 各行单位化（第1个非零元素化成1）
                        i[SBb]÷=
    
    
                        S仅对方阵部分
                        B仅对方阵之外的部分
                        b仅对方阵之外再偏移2行或2列的部分
                        
                        i[SBb]*= 各行整数化（元素去分母，凑成整数）
                        i[SBb]×=
                        
                        
                    不考虑需交换行列（退化）情况下的一些变换：
                    
                        [ij]E= 化成[行列]阶梯型 Echelon
    
                        [ij]L= 化成[行列]下三角
                        
                        [ij]U= 化成[行列]上三角
    
    
    
                        [ij]S= 化成[行列]最简形
    
                        [ij]D= 化成对角阵
    
                        [ij]I= 化成单位阵
    
    
                变量赋值：
                    ik+=i(k-1)×3 k=3,5
                    ik+=i(k-2)×3 k=3~4
                    ik+=i(k-2)×1,2 k=3~4
                    ik+=i(k-2),i(k-1)×1,2 k=3~4
                    ik+=i1 k=2~4
                    ik*=10 k=2~4
                    ik≈i(k-1) k=2,4,6
                    
                多次初等变换：
                    i2+=i1×t;i3+=i2×t;i4+=i3×t
    
    行列式计算：
                d 主对角线相乘
                d- 副对角线相乘
                
                = 计算最终结果
                
                0i1:i4 成比例
                0i1=0 都为0
                0i1=i4 相等
                
                
                a apart拆开
                L Laplace展开
                S 对角线法则Sarrus
                D 定义展开
                P 分块矩阵Part
            
                扩充为满秩矩阵
                fs[hi] 求基础解系fundamental system  齐次homogeneous 非齐次inhomogeneous/nonhomogeneous
                        A或A|b → 最简行（秩为r）
                        增行（补充主对角线为1，其余列为0的行，共n-r行），增列（增行，相应增单位列向量，共n-r列），使得满秩
    
    
    */
    //consolelog('pt开始 p=',p);
                var ps=p.split(';');
                for(var j=0;j<ps.length;j++){
                    var psj=ps[j],
                        p0=psj[0],
                        isi=p0=='i',
                        isk=/^ik/.test(psj),
                        isSwap=/≈/.test(psj),
                        isd=/^d/.test(psj),
                        isL=/^L/.test(psj),
                        isS=/^S/.test(psj),//对角线法则
                        isD=/^D/.test(psj),
                        ise=/^=/.test(psj),
                        isT=/^T/.test(psj),
                        isP=/^P/.test(psj),
                        isfs=/^fs/.test(psj), isfsh=/^fsh/.test(psj), isfsi=/^fsi/.test(psj);
                    
                    B[1]=1;
    //consolelog(j,'psj = ',psj,A);
                    if(isd){//对角线相乘
                        var isd_=/^d-/.test(psj);//副对角线
                        B[0]=[[times(Mtrx.opr1('取',A,(isd_?'-':'')+'D'))]];
                        B[2]=times(Mtrx.opr1('取',A,(isd_?'-':'')+'D'),1);
    //consolelog(B[0]);
                        return B
                    }
                    if(/^0/.test(psj)){
                        B[0]=[[0]];
                        return B
                    }
    
                    if(isL){//Laplace展开
                        B=Mtrx.opr1('detLaplace',A,psj.substr(1))[0][0];
                        //B=Mtrx.opr1('detLaplace',A,psj.substr(1));//[ [行列式,系数]+ 数组, 步骤]
                        return B
                    }
                    if(isS){//对角线法则展开
                        var Sar=Mtrx.opr1('detSar',A);
                        //consolelog('对角线法则展开',Sar[0]);
                        B[0]=[[Sar[0]]];
                        B[2]=Sar[1];
                        return B
                    }
                    if(isD){//定义展开
                        var Def=Mtrx.opr1('detDef',A);
                        B[0]=[[Def[0]]];
                        B[2]=Def[1];
                        return B
                    }
                    if(isP){//分块
                        var Par=Mtrx.opr1('detPart',A);
                        B[0]=[[Par[0]]];
                        B[2]=Par[1];
                        return B
                    }
                    if(isT){//转置
                        B[0]=Mtrx.opr1('T',A);
                        return B
                    }
                    if(isfs){//基础解系扩充（也可能减去零行）行列 左边是单位阵 右下角是n-r-(+isfsi)阶单位阵（也可能不是单位阵，当增加的行只在下面增加，而不是插入时，才会是单位阵）
                            //非齐次 返回n-1行 n-1 + 1 + (n-1-r)列 
                            //齐次 返回n行 n+(n-r)列	
                        var r=Mtrx.opr1('秩',A),IA=[],mj=n;
                        if(isfsi && r==n-1){//非齐次	只有唯一解
                    //		//consolelog(A.join('\n'))
                            //return subMtrx(A,1,r,1,n)
                        //	return Mtrx.opr1('拷',A)
                            B[0]=Mtrx.opr1('拷',A);
                            return B;
                        }
    
    
                        B[0]=Mtrx.build.I(n-(+isfsi), 2*n-r-(+isfsi));
                        for(var i=0;i<m;i++){
                            var Ai=A[i];
                            if(!/^0+$/.test(Ai.join(''))){
                                for(var j=0;j<n;j++){
                                    if(!/^0$/.test(Ai[j])){
                                        for(var k=j+1;k<n;k++){
                                            B[0][j][k]=Ai[k];
                                        }
                                        IA.push(j);//记录原来非零元的行号(从0开始)
                                        break
                                    }
                                }
                            }
                        }
                        for(var i=0;i<n-(+isfsi);i++){
                            if(IA.indexOf(i)<0){
                                B[0][i][mj]=1;
                                mj++;
                            }
                        }
                    //consolelog(B.join('\n'))
                        return B
                    }
    //consolelog('此时psj = ',psj);
                    var pA=psj.split(/(.=|≈)/g),ops=pA[1][0],
                        kA=isk?seqsA(pA[2].split('k=')[1]):'',isSelf=!/[\+\-≈]/.test(ops),
                        pA0=isk?kA:seqsA(pA[0].replace(/[ij]/g,'')),pA1A=pA[2].replace(/ .+|[LU]/,'').split('×'),	//被改的行或列，索引
                        pA1=isSelf?'':(isk?pA1A[0].replace(/[ij]/g,''):seqsA(pA1A[0].replace(/[ij]/g,''))),		//参与的行或列，索引
                        pA2=isSelf?seqsA(pA1A[0]):seqsA(pA1A[1]||'1');											//倍数
                    
        //consolelog(pA1,pA1A[0]);
    //consolelog('pA0 ',pA0.length);
    //consolelog('pA1 ',pA1.length);
    //consolelog('pA2 ',pA2.length);
    //consolelog(pA,'pA0 ',pA0)
    //consolelog('pA2 =[ ',pA2.join(''))
                    B[1]=isSwap?1-2*(pA0.length%2):1;
    
    
                    for(var pi=0;pi<pA0.length;pi++){
    //consolelog('pi=',pi+' / '+pA0.length);
    
                        var pa0=pA0[pi]-1, pa1=pA1, pi2=pA2.length<pi+1?pA2[0]:pA2[pi];
    //consolelog('pi2=',pi2,'isk = ',isk,pA1,pA1);
                        if(isk){
                            pa1=Arrf(eval,'['+pA1+']');
                        }
                        
    //consolelog('pa1=',pa1);
    //consolelog('ops=',ops);
    //consolelog('isSelf=',isSelf);
                        if(isSelf){
    //consolelog('自乘 pi2=',pi2);
                            
                            var isTime=/[×\*]/.test(ops);
                            for(var i=0;i<(isi?n:m);i++){
                                var s=isi?pa0:i,t=isi?i:pa0;
    
                                if(!(/[×\*\/÷]/.test(ops) && /^0$/.test(B[0][s][t]))){
                                    if(!pi2){
                                        pi2=B[0][s][t];
    //consolelog('省略了 pi2',pi2);
                                    }
    
                                    B[0][s][t]=(isTime?times:divide)([B[0][s][t],pi2])
                                }
                            }
    
    
                            B[1]=(isTime?divide:times)([B[1],pi2]);
                        }else{
                            for(var k=0;k<pa1.length;k++){
    
                                var pi1=+(pa1.length<pi+1?pa1[k]:pa1[k])-1;
    //consolelog('pi1=',pi1);
    
                                    
    if(pA0.length==1 && pA2.length>1){
    //consolelog('pi2=','pA2[k]',pA2[k]);
        pi2=pA2[k];
    }
            
    
                                for(var i=0;i<(isi?n:m);i++){
    //consolelog('i=',i);
                                    var s=isi?pa0:i,t=isi?i:pa0, u=isi?pi1:i,v=isi?i:pi1;
    //consolelog('s t u v',s,t,u,v,B[0][u]);
    
                                    if(isSwap){
                                        var st=B[0][s][t],uv=B[0][u][v];
    //consolelog(uv);
                                        B[0][s][t]=uv;
                                        B[0][u][v]=st;
                                    }else{
                                        if(!/^0$/.test(B[0][u][v])){
    ////consolelog('ops = ',ops,'B0st = ',B[0][s][t],'B[0][u][v] = ',B[0][u][v], 'pi2 = ',pi2);
                                            B[0][s][t]=Mfn.oprs(ops,[B[0][s][t],times([B[0][u][v],pi2])],1).toStr()
    
    //consolelog('B[0][s][t] = ',B[0][s][t]);
                                        }
    
                                    }
                                }
                            }
                        }
                    }
                    
    
                }
                return B
            }
            if(op=='PT'){/*初等变换（计算结果）
                
                参数p 变换命令
                
                返回	[结果矩阵，系数]
                
                
                */
                var R=[];
                ////consolelog(A);
                B=Mtrx.opr1('pt',A,p);//[矩阵(不化简)，系数，过程]
    
                R.push(Mtrx.opr1('eval',B[0]),times([ar[3]||1, B[1]]));
                if(/^[SD]$/.test(p)){
                    R.push(B[2])//B[0][0][0]
                }
                return R;
                
            }
            if(/PTs/.test(op)){/*初等变换（步骤）
                
                参数p 	变换命令
                第4个参数ar[3] 	指定【不】获取步骤
            
                返回	[[结果矩阵，系数], 过程html, 变换命令数组]
                
                如果是detPTs求行列式，
                
                返回	[结果, 过程html, 变换命令数组]
                
                    变换命令数组，用来得到相应的若干个初等矩阵
                操作符op：
    
                    detPTs 行列式
                    invPTs 求逆（初等行变换）			A|E → I|A⁻¹
                    invlPTs	A左除B	A\B		A|B → I|A⁻¹B
                    invrPTs	A右除B	B/A		A → I
                                            B    BA⁻¹
                    
    
                    congPTs 合同变换	congruent	行列变换交替进行：PAPT | PE    ->   B | P	暂不实现
                                                    列行变换交替进行：PTAP ; EP   ->  B ; P			(需手动输入命令，先列后行！，暂不实现自动）
                    
                    normPTs 化标准型
                    rankPTs 求秩
                    
                    fs[hi]PTs 求基础解系fundamental system  齐次homogeneous 非齐次inhomogeneous/nonhomogeneous
                            A或A|b → 最简行（秩为r）
                            增行（补充主对角线为1，其余列为0的行，共n-r行），增列（增行，相应增单位列向量，共n-r列），使得满秩
                            
                            
                            
                            继续化最简行
                            
                            基础解系：
                                齐次：所增列
                                非齐次：特解（原最后1列）+ 齐次基础解系（所增列）
                    
                */
    
    
                var psA=[], isdet=/det/.test(op), isinv=/inv/.test(op),isinvl=/invl/.test(op),isinvr=/invr/.test(op),
                    iscong=/cong/.test(op), isnorm=/norm/.test(op),isrank=/rank/.test(op),
                    isBc=isinv && !isinvr && !isinvl,//列增广（横向）矩阵进行初等变换
                    isBr=iscong,//行增广（纵向）矩阵进行初等变换		
                    isfs=/fs/.test(op), //基础解系
                    isfsi=/fsi/.test(op), //非齐次
                    
                    isTc=isBr||isinvr, //是否有列变换
                    
                    coe=[], Coe=1, Bini=Mtrx.opr1('/',A),//化成分数
    
                    TB=isinv||iscong||isfsi?(isfsi?'J'+(n-1):(isBc?'J'+n:(iscong?'I'+m:(isinvl?'J'+m:'I'+n+'  .')))):'';	//'j'+m+'r':'i'+n+'b'
                    //console.log(op,TB);
                    
                //var ps=(p||(isBr?'jL':'iU')+'='+(isdet?';d;=':'')).split(';');
                var ps=(p||'iU='+(isdet?';d;=':'')).split(';');
                
                if(isBc){
                    Bini=Mtrx.build.B([[Bini,Mtrx.build.I(m)]])
                }
                if(isBr){
                    Bini=Mtrx.build.B([[Bini],[Mtrx.build.I(n)]])
                }
                var B=[[Bini,1], ar[3]?'':(isdet?'|A| = '+kdet(A):(isBc||isBr?'增广矩阵~':'')+kmtrx(isBc||isBr?Bini:A, '',isinv||iscong||isfsi?TB:''))],
                    As=[B[1]],noteA=[];
                //consolelog(isBc,isBr,B[1]);
    
                //扩行 Mtrx.opr1('拷',A).concat(Mtrx.build.I(m))
    //consolelog('变换：',ps,'参数p',p);
                for(var j=0;j<ps.length;j++){
    //consolelog('变换 j ',j,'/',ps.length,' ps = ',ps.join(' ；'));
    if(j>30){break}//防止死循环 //consolelog('初等变换超过30次循环，强制break');
    
    
                    var psj=ps[j],B00=B[0][0],m=B00.length,n=B00[0].length,nextj='',end='',pts=0;
    
    //consolelog(j,psj,'行m 列n',m,n);
                    var p0=psj[0],
                        isi=p0=='i',//行变换
                        isU=/iU=/.test(psj),isL=/jL=/.test(psj),isUL=isU||isL,//三角阵	不一定是行（列）阶梯
                        isD=/[ij]D=/.test(psj),//对角阵
                        
                        isE=/[ij]E=/.test(psj),//阶梯
                        isS=/[ij]S=/.test(psj),//最简形
                        isI=/[ij]I=/.test(psj);//单位阵（标准型：左上角单位阵，其余为0）
                        
    
                    var viA=Mtrx.opr1('cr'[+isi]+1,B00), viv=Arri(viA,0), vii=Arri(viA,1), ui=[],uv=[], BmaybeE=1, headIndexUnique=1;
                /*	//consolelog('viv = \n',viv);
                    //consolelog('viA = \n',viA);
                    
                */
                    for(var i=0;i<vii.length;i++){
                    //consolelog(i,vii[i]);
                        if(vii[i]>-1){
                        //consolelog(i,vii[i]);
                            if(headIndexUnique && ui.indexOf(vii[i])>-1){
                                headIndexUnique=0
                            }
                            ui.push(vii[i]);
                            uv.push(viv[i]);
                        }
                    //consolelog(BmaybeE);
                        if(BmaybeE && i && (vii[i-1]>vii[i] && vii[i]>-1 || vii[i-1]<vii[i] && vii[i-1]<0)){
                            BmaybeE=0
                        }
                //		//consolelog(vii,i,(vii[i-1]>vii[i] && vii[i]>-1 || vii[i-1]<vii[i] && vii[i-1]<0));
                    }
    
                    var BisU=Mtrx.is.b1.U(B00), BisL=Mtrx.is.b1.L(B00), BisD=BisU && BisL,
                        BisE=BmaybeE && headIndexUnique, BisS=BisE && Mtrx.is.b1['列行'[+isi]+'最简'](B00), BisI=BisD && BisS && Mtrx.is.b1['行列'[+isi]+'最简'](B00);//与Mtrx.is.b1.I(B00)是准单位阵不同
    
    //consolelog(vii.join());
                    if(isU && BisU || isL && BisL || isD && BisD || isE && BisE || isS && BisS || isI && BisI){
                        continue;
                    }
    
    //consolelog(B00, BisE);
    //consolelog('B00矩阵 = ');
    //consolelog(B00.join('\n'));
    //BisD && consolelog('是对角阵吗？', BisD);
    //BisE && consolelog('是'+'列行'[+isi]+'阶梯型吗？', BisE, BisE?'':['索引集有逆序吗？',BmaybeE,'索引集有重复吗？',headIndexUnique,'索引集: ',viA.join('\n')].join('\n'));
    //BisS && consolelog('是'+'列行'[+isi]+'最简形吗？', BisS);
    //BisI && consolelog('是标准型形吗？', BisI);
    
                    if(isU || isD && !BisU){
                    //consolelog('化上三角');
                        for(var i=0;i<m-1;i++){
                            var v1=Arri(B00,i).slice(i+1);
                            if(/[^0]/.test(v1.join(''))){
                                var Bii=''+B00[i][i],kvA=[],kA=[];
                                if(Bii=='0' || Bii!='1'){//vii[i]>i 从剩下的非零元，找1，或非零数
                                    
                                    var psi=[];
                                    for(var k=i+1;k<m;k++){
                                        var vk=''+viv[k];
                                        /*
                                            //consolelog('k = \n',k);
                                            //consolelog('viv = \n',viv);
                                            //consolelog('vk = \n',vk);
                                            //consolelog('vii[k] = \n',vii[k]);
                                            //consolelog('i = \n',i);
                                            */
                                        if(vii[k]==i){
                                            if(vk=='1'){
                                                psi.push('i'+(i+1)+'~~'+'i'+(k+1));
                                            //consolelog(ps);
                                                pts++;
                                                nextj=1;
                                                break;
                                            }else{
                                                kvA.push(vk);
                                                kA.push(k);
                                            }
                                        }
                                    }
    
                                    if(nextj){
                                        ps.splice.apply(ps,[j+1,0].concat(psi));
                                        break
                                    }
                                    
                                    if(Bii=='0'){
                                        
                                        //consolelog('kvA = ',kvA);
                                        //consolelog('kA = ',kA);
                                        
                                        ps.splice(j+1,0,'i'+(i+1)+'~~'+'i'+(kA[kvA.indexOf(''+fmin(kvA))]+1));
                                        
                                        //consolelog(ps);
                                        pts++;
                                        nextj=1;
                                        break;
                                    }
                                }
                                if(Bii=='1'){
                                    
                                    var psi=[];
                                    for(var k=i+1;k<m;k++){
                                        if(vii[k]==i){
                                            psi.push('i'+(k+1)+'-=i'+(i+1)+'×'+viv[k]);
                                            pts++;
                                        }
                                    }
    
                                    ps.splice.apply(ps,[j+1,0].concat(psi));
    
                                    
                                    nextj=1;
                                    break;
                                }
                            //consolelog('kvA = \n',kvA.join('\n'));
                            
                            
                                var psi=[];
                                for(var k=0;k<kA.length;k++){
                                    
                                    psi.push('i'+(kA[k]+1)+'-=i'+(i+1)+'×'+divide([kvA[k],Bii]));
                                    pts++;
                                }
                                
                                ps.splice.apply(ps,[j+1,0].concat(psi));
                                
                                nextj=1;
                                break;
                            }
                        }
                        if(nextj){
                            ps.splice(j+1+pts,0,psj);
                            continue
                        }
                    }
    
    
                    if(isL || isD && !BisL){
                    //consolelog('化下三角');
                        for(var i=0;i<n-1;i++){
                            var v1=B00[i].slice(i+1);
                            if(/[^0]/.test(v1.join(''))){
                                var Bii=''+B00[i][i],kvA=[],kA=[];
                                if(Bii=='0' || Bii!='1'){//vii[i]>i 从剩下的非零元，找1，或非零数
                                    
                                    var psi=[];
                                    for(var k=i+1;k<n;k++){
                                        var vk=''+viv[k];
                                        if(vii[k]==i){
                                            if(vk=='1'){
                                                psi.push('j'+(i+1)+'~~'+'j'+(k+1));
                                                pts++;
                                                nextj=1;
                                                break;
                                            }else{
                                                kvA.push(vk);
                                                kA.push(k);
                                            }
                                        }
                                    }
                                    
                                    if(nextj){
                                        ps.splice.apply(ps,[j+1,0].concat(psi));
                                        break
                                    }
                                    
                                    if(Bii=='0'){
                                        ps.splice(j+1,0,'j'+(i+1)+'~~'+'j'+(kA[kvA.indexOf(''+fmin(kvA))]+1));
                                        pts++;
                                        nextj=1;
                                        break;
                                    }
                                }
                                if(Bii=='1'){
                                    
                                    var psi=[];
                                    for(var k=i+1;k<n;k++){
                                        if(vii[k]==i){
    
                                            psi.push('j'+(k+1)+'-=j'+(i+1)+'×'+viv[k]);
                                            pts++;
                                        }
                                    }
                                    ps.splice.apply(ps,[j+1,0].concat(psi));
                                    
                                    nextj=1;
                                    break;
                                }
                                
                                var psi=[];
                                for(var k=0;k<kA.length;k++){
    
                                    psi.push('j'+(kA[k]+1)+'-=j'+(i+1)+'×'+divide([kvA[k],Bii]));
                                    pts++;
                                }
                                ps.splice.apply(ps,[j+1,0].concat(psi));
                                
                                nextj=1;
                                break;
                            }
                        }
                        if(nextj){
                            ps.splice(j+1+pts,0,psj);
                            continue
                        }
                    }
    
    
    
    
                    if(isE || (isS||isI) && !BisE){
                    //consolelog('化阶梯');
                        for(var i=0,l=(isi?m:n);i<l;i++){
                            if(vii[i]<0){vii[i]=(isi?n:m)}
                            var i1=vii.slice(i+1).filter(function(t){return t>-1}),	mi1=fmin(i1);
    //[0 0 -1 -1;1 4 -1 0;-1 -4 2 -1]
            //				//consolelog('i = '+i,' vii=',vii.slice(i+1));
                            if(isArr(mi1)){//下面行全是0，这一条件不需要判断？
                                //consolelog('下面行全是0？');
                                //nextj=1;
                            //	end=1;
                                break;
                            }
            //				//consolelog(mi1, vii[i]);
                            if(mi1<=vii[i]){
                                var Bii=''+B00[isi?i:mi1][isi?mi1:i],kvA=[],kA=[];
                                if(Bii=='0' || Bii!='1'){//vii[i]>i 从剩下的非零元，找1，或非零数
                                    
                                    var psi=[];
                                    for(var k=i+1;k<l;k++){
                                        if(vii[k]==mi1){
                                            if(''+viv[k]=='1'){
                                                ps.splice(j+1,0,'ji'[+isi]+(i+1)+'~~'+'ji'[+isi]+(k+1));
                                                pts++;
                                                nextj=1;
                                                break;
                                            }else{
                                                kvA.push(viv[k]);
                                                kA.push(k);
                                            }
                                        }
                                    }
                                    if(nextj){
                                        ps.splice.apply(ps,[j+1,0].concat(psi));
                                    
                                        break
                                    }
                                    if(Bii=='0'){
                                        
                                        
                                        ps.splice(j+1,0,'ji'[+isi]+(i+1)+'~~'+'ji'[+isi]+(kA[kvA.indexOf(''+fmin(kvA))]+1));
                                        pts++;
                                        nextj=1;
                                        break;
                                    }
                                }
                                if(Bii=='1'){
                                    
                                    var psi=[];
                                    for(var k=i+1;k<l;k++){
                                        if(vii[k]==mi1){
                                            psi.push('ji'[+isi]+(k+1)+'-='+'ji'[+isi]+(i+1)+'×'+viv[k]);
                                            pts++;
                                        }
                                    }
                                    ps.splice.apply(ps,[j+1,0].concat(psi));
                                    
                                    nextj=1;
                                    break;
                                }
                                
                                var psi=[];
                                for(var k=0;k<kA.length;k++){
    
                                    psi.push('ji'[+isi]+(kA[k]+1)+'-='+'ji'[+isi]+(i+1)+'×'+divide([kvA[k],Bii]));
                                    pts++;
                                }
                                ps.splice.apply(ps,[j+1,0].concat(psi));
    
                                nextj=1;
                                break;
                            }
                        }
                        if(nextj){
                            ps.splice(j+1+pts,0,psj);
                            continue
                        }
                    }
    
    
    
                    if(isS && BisE || isI && !BisS){
                    //consolelog('化最简',ps.join(' ; '));
                        var psi=[];
                        for(var i=0,l=(isi?m:n);i<l;i++){
                            if(!/^[01]$/.test(viv[i])){
                                psi.push('ji'[+isi]+(i+1)+'/='+viv[i]);
                                pts++;
                                nextj=1;
                            }
                        }
                        if(nextj){
                            ps.splice.apply(ps,[j+1,0].concat(psi));
                            ps.splice(j+1+pts,0,psj);
                            continue
                        }
                        
                        
                        var psi=[];
                        for(var i=0,l=(isi?m:n);i<l;i++){
                            if(vii[i]<0){continue}
                            var Aj=isi?Arri(B00,vii[i]):[].concat(B00[vii[i]]);
                            Aj.splice(i,1);
                            if(/[^0]/.test(Aj.join(''))){
                                psi.push('ij'[+isi]+(vii[i]+1)+'+='+'ji'[+isi]+(i+1));
                                pts++;
                                nextj=1;
                            }
                        }
                        if(nextj){
                            ps.splice.apply(ps,[j+1,0].concat(psi));
                            ps.splice(j+1+pts,0,psj);
                            continue
                        }
                    }
    
                    if(isI){
    //consolelog('后续的变换有：',ps.slice(j).join(';'));
    //				//consolelog('下面的变换是 化标准型（准单位阵）');
    
                            ps.splice(j+1,0,psj.replace(/[ij]/,'ij'[+isi]));
                            continue
    
                    }
    
    
    
    
    
    //consolelog(ps.join(';'));
                    if(!end){
    //consolelog('开始变换',ps.slice(j).join(';'));
                        var psj=ps[j].replace(/~~/g,'≈')
    
                        .replace(/j\d+.=i\d+[LU]?/g,function(t){//将j列（除i行外），都化为0
                            var tA=t.replace(/[ijLU]/g,'').split(/.=/),ts=[],ks=[],tj=+tA[0]-1,ti=+tA[1]-1,C=B[0][0],is_=/-=/.test(t),isL=/L/.test(t),isU=/U/.test(t);
                            for(var i=(isU?tj+1:0);i<(isL?tj:m);i++){
                                if(i!=ti && !/^0$/.test(C[i][tj])){
                                    ts.push('i'+(i+1));
                                    
                                    //consolelog(ti,tj,C[ti][tj],C);
                                    
                                    ks.push(Mfn.oprs(['*','/'],[(+is_)*2-1,C[i][tj],C[ti][tj]],1).toStr());
        //consolelog(ks.join(' ; '));
                                }
                            }
                            
                            return ts.join()+'+-'[+is_]+'=i'+(ti+1)+'×'+(ks.join()||0)
    
                        }).replace(/i\d+.=j\d+[LU]?/g,function(t){//将i行（除j列外），都化为0
                            var tA=t.replace(/[ij]/g,'').split(/.=/),ts=[],ks=[],ti=+tA[0]-1,tj=+tA[1]-1,C=B[0][0],is_=/-=/.test(t),isL=/L/.test(t),isU=/U/.test(t);
                            for(var i=(isL?ti+1:0);i<(isU?ti:n);i++){
                                if(i!=tj && !/^0$/.test(C[ti][i])){
                                    ts.push('j'+(i+1));
                                    
                                    //consolelog(ti,tj,C[ti][tj],C);
                                    
                                    ks.push(Mfn.oprs(['*','/'],[(+is_)*2-1,C[ti][i],C[ti][tj]],1).toStr());
        //consolelog(ks.join(' ; '));
                                }
                            }
                            return ts.join()+'+-'[+is_]+'=j'+(tj+1)+'×'+(ks.join()||0)
    
                        }).replace(/[ij][SBb]?[\*×\/÷]=/g,function(t){//各行（列）单位化或整数化
                            /*
                                S指定只针对方阵部分
                                B指定只针对方阵之外的部分
                                b指定只针对方阵之外再偏移2行或2列的部分（主要用于非齐次线性方程组的基础解系）
                                    
                                /÷ 各行（列）单位化（首个非零元素，化为1）
                                *× 各行（列）整数化（元素都化为整数）	同时针对特解（方阵后一列）化为整数（只考虑基础解系中只有1个解向量的情况）
                            */
                            //consolelog(t);
                            var isi=/^i/.test(t), isS=/S/.test(t), isB=/B/.test(t), isb=/b/.test(t), istime=/[\*×]/.test(t),C=B[0][0],ks=[],ts=[],tejie='',
                                m=B[0][0].length,n=B[0][0][0].length, minmn=Math.min(m,n);
                            
    //consolelog('新 m,n',m,n);
                            
                            if(istime){
        //						//consolelog(t,isb);
                                if(isi){
    
                                    for(var i=(isB||isb?minmn+(+isb):0);i<(isS?minmn:m);i++){
                                        var Cij=lcmFrac(C[i]);
                                        if(Cij==1){
                                            continue;
                                        }
                                        ts.push('i'+(i+1));
                                        ks.push(Cij);
                                    }
                                }else{
    
    var newj=0;
                                    for(var i=(isB||isb?minmn+(+isb):0);i<(isS?minmn:n);i++){
    //consolelog(i,n,'minmn=',minmn,m,n);
                                        var Cij=lcmFrac(Arri(C,i));
        //consolelog(Arri(C,i),'Cij = ',Cij,'\n',A.join('\n'));
                                        if(Cij==1){
                                            continue;
                                        }
                                        ts.push('j'+(i+1));
                                        ks.push(Cij);
                                        newj++;
                                    }
                                    
    //consolelog(newj,'newj = ',newj,'\n','isb = ',isb,' m+2 = ', m+2,'n =',n);
                                //	if(!newj && isb && m+2<=n){
                                    if(isb && m+2<=n){
                                    //	var jm1=Arri(C,minmn+1);
                                        var jm1=Arri(C,m);
                                        //consolelog('jm1 ',jm1);
                                        if(/\//.test(jm1)){
                                            Cij=lcmFrac(jm1);
                                            //consolelog('Cij ',Cij);
                                            if(Cij>1){
                                                //tejie=';j'+(m+1)+'+=j'+n+'×1/'+Cij
                                                
                                                var jk=ts[ts.length-1]||'j'+n,J=+jk.substr(1),K=m-(n-J)-1;
                                                
                                                //tejie=';j'+(m+1)+(Arri(C,J-1).slice(0,K-1).join(' ')==jm1.slice(0,K-1).join(' ')?'-':'+')+'='+jk+'×1/'+Cij
                                                var CJ1=Arri(C,J-1).slice(0,K-1),JM1=jm1.slice(0,K-1),a='1/'+Cij;
                                                for(var x=0;x<JM1.length;x++){
                                                    if(''+JM1[x]!='0' && ''+CJ1[x]!='0'){
                                                        a=divide([JM1[x],CJ1[x],Cij,-1]);
                                                        break;
                                                    }
                                                }
                                                
                                                tejie=';j'+(m+1)+'+='+jk+'×'+a;
                                            }
                                        }
                                    }
                                    
                                }
                            }else{
                                if(isi){
                                //consolelog(m,n);
                                    for(var i=(isB||isb?minmn+(+isb):0);i<(isS?minmn:m);i++){
                                        for(var k=0;k<n;k++){
                                            var Cij=C[i][k];
                                            if(/^1$/.test(Cij)){
                                                break
                                            }
                                            if(!/^[01]$/.test(Cij)){
                                            //consolelog(i,k,Cij);
                                                ts.push('i'+(i+1));
    
                                                ks.push(Cij);
                                                break;
                                            }
                                        }
                                    }
                                }else{
                                    for(var i=(isB||isb?minmn+(+isb):0);i<(isS?minmn:n);i++){
                                        for(var k=0;k<m;k++){
                                            var Cij=C[k][i];
                                            if(/^1$/.test(Cij)){
                                                break
                                            }
                                            if(!/^[01]$/.test(Cij)){
                            //consolelog(Cij);
                                                ts.push('j'+(i+1));
    
                                                ks.push(Cij);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
    
        //consolelog('ts.length = ',ts.length,tejie);
    
    
    
        //consolelog(ts.join()+'/*'[+istime]+'='+(ks.join()||0)+tejie);
    
                            return ts.join()+'/*'[+istime]+'='+(ks.join()||0)+tejie
    
                        }).replace(/.+\?[LU]?/g,function(t){//自动计算倍数，将其余指定行列，化为0
    //consolelog('？');
                            var isi=/^i/.test(t), tA=t.replace(/[ijLU]/g,'').split(/.=/),is_=/-=/.test(t),isL=/L/.test(t),isU=/U/.test(t);
                                ks=[],ts=seqsA(tA[0]),ij=+tA[1].replace(/\D/g,'')-1,C=B[0][0];
                            for(var i=0;i<ts.length;i++){
                                if(isi){
                                    for(var k=(isL?ij+1:0);k<(isU?ij+1:n);k++){
                                        var Cij=C[+ts[i]-1][k];
                                        if(!/^0$/.test(Cij)){
                                            var kk='i'+ts[i]+'+-'[+is_]+'=i'+(ij+1)+'×'+Mfn.oprs(['*','/'],[(+is_)*2-1,Cij,C[ij][k]],1).toStr();
                                            ks.push(kk);
                                            break;
                                        }
                                    }
                                }else{
                                    for(var k=(isU?ij+1:0);k<(isL?ij+1:m);k++){
                                        var Cij=C[k][+ts[i]-1];
                                        if(!/^0$/.test(Cij)){
                                            var kk='j'+ts[i]+'+-'[+is_]+'=j'+(ij+1)+'×'+Mfn.oprs(['*','/'],[(+is_)*2-1,Cij,C[k][ij]],1).toStr();
                                            ks.push(kk);
                                            break;
                                        }
                                    }
                                }
                            }
                            return ks.join(';')
                        });
        //console.log(B[0],psj);
    
                        if(/;/.test(psj)){//出现多个指令
                            psA=psA.concat(psj.split(';'));
    
                            ps.splice.apply(ps,[j+1,0].concat(psj.split(';')));
                            //console.log(ps);
                            //consolelog(psA);
                            continue;
                        }
    
    
    //consolelog('\n矩阵是\n',B[0][0].join('\n'));
                        if(/[\+\-]=.+×-/.test(psj)){
        //consolelog('原来',psj);
                            psj=psj.split('=')[0].replace(/[\+\-]$/,opinv)+'='+
                                psj.split('=')[1].replace(/[×,]./g,function(t){return t[0]+opneg(t[1])});
                            
        //consolelog('后来',psj);
                            
                        }
                        psj=psj.replace(/×1(,1)*$/,'');
    
    
        //consolelog('接下来变换：',psj);
                        if(/[×\*\/÷\+\-=]0/.test(psj)){//无需变换
                            continue
                        }
                        if(!psj){//相应行、列变换
                            psj=psA[j-1].replace(/i/g,'行').replace(/j/g,'i').replace(/行/g,'j');
                        }
    
                        psA.push(psj);
    
    
    
                        if(/^=/.test(psj)){
                        //consolelog(B[0]);
    
                            B[0]=times([B[0][0][0][0],B[0][1]]);
    //consolelog(psj);
                            if(!ar[3]){
                                if(B[0]!=As.slice(-1)[0]){
                                    As.push(B[0]);
                                    noteA.push('最终结果');
                                }
    
                            }
                            break;
                        }
                        //consolelog(psj);
                        if(/[ij][ULDESI]/.test(psj)){
        //consolelog('继续 ',psj);
                            continue;
                        }
    
    
    //consolelog(psj,B[0]);
    
    
                        B[0]=Mtrx.opr1('PT',B[0][0],psj,B[0][1]||1);//[结果矩阵，系数]
        ////consolelog(psj,B[0]);
    
                    }
    
                    if(!ar[3]){//需要步骤（默认不填此参数）
    
                        var B00=B[0][0],B01=B[0][1];
    
                        coe.push(B01);
    
    
                        Coe=B01;
    
                        var isSD=/^[SD]$/.test(psj), isfshi=/^fs/.test(psj);
                        if(isfshi){
                            TB='J'+(/^fsi/.test(psj)?(n-1)+(B00[0].length>n?'_'+n:''):n);
                        }
    
    ////consolelog('B00 =',B00);
    ////consolelog('B[0] =',B[0]);
    ////consolelog('B =',B);
                        var Asi=isdet?(B00.length>1?times([Coe,'x']).replace('x',kdet(B00)):times([Coe,B00[0][0]])):
    
                            kmtrx(B00,'',isinv||iscong||TB?TB:'');
                        if(Asi!=As.slice(-1)[0]){
                            ////consolelog('Asi = ',Asi,A);
                            if(/^L[ij]\d/.test(psj) && isdet){
                                Asi=Mtrx.opr1('detLaplace',A,psj.substr(1))[1][1];
                            //	//consolelog(Asi);
                            }
    
                            As.push(Asi);
    
    
                        //consolelog(psj);
                            noteA.push(kfrac(Mtrx.note.PT(psj),1,'t'));
                        }
    
                        //consolelog(psj);
                    }
                }//j循环结束
    
    
    
    
    
                if(isSD){
                    noteA.push('化简')
                }
    
                if(isdet){
                    As[As.length-1]=kfrac(As[As.length-1],1);
                }
    
                if(isrank){
                    As.push('秩是'+kfrac(Mtrx.opr1('秩',B00),1));
                    noteA.push('数一下非零行的行数');
                }
    //consolelog('求逆：'+isinv,psj,j+1,'/',ps.length);
                //if((isinv||iscong) && j+1>=ps.length){
            //	if(!(isrank || isdet) && j+1>=ps.length && B00[0].length > m){
            //consolelog(m,n,op,isBr,'ps,j+1 = ',ps,j+1,'n列,m行 = ',n,m);
            
            //consolelog(op,!(isrank || isdet || op=='PTs'), j+1>=ps.length, isTc && n<m, !isBr && n>m);
            
                if(!(isrank || isdet || op=='PTs') && j+1>=ps.length && (isTc && n<m || !isBr && n>m)){
                    //consolelog(B00,1,m,m+1,n);
                    //consolelog(B00,n+1,m,1,n);
    
                //consolelog(isinvr,iscong);
                //consolelog(1,m,A[0].length+(isfsi?0:1));
                    As.push(kmtrx(isinvr||iscong?subMtrx(B00,n+1,isBr?B00.length:m,1,n):subMtrx(B00,1,m, isinvl?m+1:A[0].length+(isfsi?0:1))));
    //consolelog(end,'求逆或合同',psj);
                    noteA.push('得到'+(isinv && !isinvl && !isinvr?(A.length!=A[0].length?'可':'')+'逆':'')+'矩阵');//+(isinvl?'A左除B A\\B':(isinvr?'A右除B B/A':''))
                }
    
                B[1]='\\small '+Eq(As,noteA,'',isdet?'':'xrightarrow') +' \\normalsize';
                B[2]=psA;
    //consolelog(psA);
    
    
                return B
            }
    
    
            if(op=='Ak'){//k阶顺序主子矩阵 参数p:k阶	返回：矩阵
                if(p==1){
                    return [[A[0][0]]];
                }
                B=Mtrx.opr1('拷',A);
        
                B.splice(p,m);
    
                for(var k=0;k<p;k++){
                    B[k].splice(p,m);
                }
    
            }
            if(op=='Dk'){//k阶顺序主子式 参数p:k阶	返回：[矩阵，行列式值，步骤]
                if(p==1){
                    var A00=A[0][0];
                    return [[[A00]],A00,A00];
                }
                var Ak=Mtrx.opr1('Ak',A,p),dP=Mtrx.opr1('detPTs',Ak,'iU=;d;=');
                return [Ak,dP[0],dP[1]]
            }
            if(op=='Dk判断正定'){//根据各阶顺序主子式的符号判断正定性	返回：字符串
                if(/^1(,1)*$/.test(A)){
                    return '正定'
                }
                if(/^-1(,1,-1)*(,1)?$/.test(A)){
                    return '负定'
                }
                return '不定'
            }
            if(op=='Mij'){//余子式 参数p：[行号,列号] 	返回：余子式矩阵
                var i=+p[0],j=+p[1]||i;
    
                B=Mtrx.opr1('拷',A);
                B.splice(i-1,1);//去掉第i行
    
                for(var k=0;k<m-1;k++){
                    B[k].splice(j-1,1);
                }
    
            }
            if(op=='Aij'){//1阶代数余子式数组 参数p：[行号,列号] 	返回：[余子式矩阵, 子式, 符号] 
                var i=+p[0],j=+p[1]||i;
    /*
        偶+-偶 = 偶
        偶+-奇 = 奇
        奇+-奇 = 偶
        奇+-偶 = 奇
    */
                B=[Mtrx.opr1('Mij',A,[i,j]),A[i-1][j-1],1-2*((i+j)%2)];
                return B
            }
            if(op=='Aij1'){/*1阶代数余子式数组 按1行或1列展开 
                参数p：i行号 或j列号 (从1开始编号)
                
                返回：[余子式矩阵, 子式, 符号]+
                
                */
                var isi=/i/.test(p), ij=+p.substr(1);
                for(var i=1;i<m+1;i++){
                    B.push(Mtrx.opr1('Aij',isi?[ij,i]:[i,ij]));
                }
                return B
            }
            if(op=='Aijs'){/*K阶代数余子式数组 参数p：1,3,7,8;3,5
            
            返回	[余子式矩阵, K阶子式,系数, 子式行列索引数组]+ 
    
                    i3,j5（缩写为3,5） 1阶子式
                    i1,i3,j7,j8（缩写为1,3,7,8） 2阶子式
                    i1,i3 指定第1、3行，选列有Cm2种
                    单独1个i1或j1，指定某一行，某一列
                    
                    多个命令用;隔开
                */
                var ps=Arrf(function(t){return t.replace(/^[ij]\d+$/g,function(t){
                    var ts=t.replace(/[ij]/g,'');
                    return /i/.test(t)?ZLR(ts+',',seqA(1,m).join(' ')).join(';'):zlr2(seqA(1,m).join(' '),','+ts).replace(/ /g,';');
                }).replace(/i\d+(,i\d+)+/g,function(t){
                    var ts=t.replace(/i/g,''),ta=ts.split(','),tsn=ta.length;
                    return ZLR(ts+',',Arrf(function(s){return Arrf(Arr1,s)}, CombinN(m,tsn)).join(' ')).join(';');
                }).replace(/j\d+(,j\d+)+/g,function(t){
                    var ts=t.replace(/j/g,''),ta=ts.split(','),tsn=ta.length;
                    return zlr2(Arrf(function(s){return Arrf(Arr1,s)}, CombinN(m,tsn)),','+ts).replace(/ /g,';');
                })
                },p.split(';')).join(';').split(';');
                for(var bi=0;bi<ps.length;bi++){
                    var ij=ps[bi].replace(/[ij]/g,'').split(','),K=ij.length/2,KA=[];
    //consolelog(ij);
                    var Bi=[Mtrx.opr1('拷',A),'',1-2*(eval(ij.join('+'))%2),ij];	//1-2*(eval(ij.join('+'))%2)
                    KA.t='Mtrx';
                    KA.typ='det';
        //consolelog(A);
        //consolelog(K);
                    for(var i=0;i<K;i++){
    
                        Bi[0].splice(+ij[i]-1-i,1);//挖行
                        for(var j=0;j<n-i-1;j++){
                            Bi[0][j].splice(+ij[i+K]-1-i,1);//挖列
                        }
    
                        var KAi=[];
                        for(var j=0;j<K;j++){
                            //consolelog(ij,);
                            KAi.push(A[+ij[i]-1][+ij[j+K]-1])
                        }
                        KA.push(KAi);
                    }
                    if(K==1){
                        //consolelog(K);
                        Bi[1]=KA[0][0]
                    }else{
                        Bi[1]=KA;
                    }
                    Bi[0].typ='det';
                    B.push(Bi);
                }
                return B
            }
            if(op=='*'){//伴随矩阵：代数余子式矩阵化后转置
                /*
                    11 12  22 -12
                    21 22  -21 11
                    
                    11 12 13    2233-3223 -(1233-3213) 1223-2213
                    21 22 23    -(2133-3123) 1133-3113 -(1123-2113)
                    31 32 33    2132-3122 -(1132-3112) 1122-2112
                */
                for(var i=0;i<m;i++){
                    B.push([]);
                    for(var j=0;j<n;j++){
    //consolelog(j,i);
                        var Aji=Mtrx.opr1('Aij',A,[j+1,i+1]);
                        //consolelog(Mtrx.opr1('det',Aji[0]));
                        ////consolelog(Aji[2]);
                        B[i].push(times([Mtrx.opr1('det',Aji[0]),Aji[2]]))
    
                    }
                }
    
            }
            if(op=='cramer'){/*Cramer法则
                
                输入增广矩阵	(最后1列是等式右边的值)
                输出矩阵数组：[D,D1,D2,...,Dn]
                
                
                */
                var a=Arri(A,m);
                B.push(subMtrx(A,1,m,1,m));
                for(var i=0;i<m;i++){
                    B.push(Mtrx.build.replace(B[0],a,[1,i+1],'v'));
                }
                return B
                
            }
    
            if(op=='Cramer'){/*Cramer法则（步骤）
                输入增广矩阵A|b
                    参数p是数组：每个行列式的步骤
                    
                    第4个参数ar[3]，指定变量风格x1（默认） 或 abcd 或 xyzw 等
    
                返回：[解集数组R, 变换数组C[[行列式,步骤]+], 步骤数组S]  解集用空数组表示无解
                */
                var B=Mtrx.opr1('cramer',A), n=B[0].length,C=[],R=[],vars=ar[3]||'x1',ms=seqA(1,m);
            //consolelog(B);
                C.push(Mtrx.opr1('detPTs',B[0],(arl>2?p[0]:'')||(n<3?'S':'iU=;d;=')));
    
                var d=C[0][0];
    
    //consolelog(d);
                if(/\d/.test(vars)){
                    ms=seqA(+vars.replace(/\D/g,''),m);
                    var indx=Arrf(function(t){return '_{'+t+'}'},ms);
                    vars=concat(copyA(vars.replace(/\d/g,''),m),indx);
                }else if(vars.length==1){
                    vars=fCC(seqA(vars.charCodeAt(0),m)).split('');
                }
                if(''+d=='0'){//无解或多解
                    
                    
                }else{//唯一解
                    //consolelog('唯一解');
                    
                    
                    
                    for(var i=0;i<m;i++){
                        var Ci=Mtrx.opr1('detPTs',B[i+1],p[i+1]||(n<3?'S':'iU=;d;='));
                        C.push(Ci);
                        R.push(divide([Ci[0],d]))
                    }
    
    
    
                    var S=Arrf(function(k){return C[k][1].replace('A','D'+(k?'_{'+k+'}':''))},seqA(0,m+1)).concat(
                        concat(vars,'=',Arrf(function(k){return frac('D_{'+k+'}','D','')},ms),
                            '=',Arrf(function(k){return frac(C[k][0]||'0',d,'')},ms),
                            '=',Arrf(kfrac,R)));
        
                    //consolelog(S);
                    return [R,C,S]
                }
    
            }
    
    
    
            if(op=='detDef'){/*行列式 按定义展开
                返回 [结果, 步骤]
                */
                
                var R=[],Def=[], r0=Mtrx.opr1('r0',A), c0=Mtrx.opr1('c0',A), r0m=fmax(r0), c0m=fmax(c0), byC=c0m>r0m;//列零数，行零数
                
                Def=Arrf(function(x){var Ax=Arr1(x);return [nInvOrder_(Ax)].concat(Mtrx.opr1('取',A,byC?[Ax,seqA(1,m)]:Ax))}, PermutN(m,m));
    
                //R=[ArrfcA([plus,times],Def),ArrfcA([plus,times],Def,1)];
                R=[!/\d/.test(A)?'省略':ArrfcA([plus,times],Def),ArrfcA([plus,times],Def,1)];
                return R
                
            }
            if(op=='detSar'){/*行列式 按对角线法则（萨鲁斯法则Sarrus rule）展开二阶、三阶
            
                返回 [结果，步骤]
    
                参数p 指定需要步骤
    */
                var R=[],Sar=[];
                if(m==1){
                    R=[A[0][0],A[0][0]]
                }
                if(m==2){
    
                    if(p){
                        Sar=[times([A[0][0],A[1][1]]), times([A[1][0],A[0][1]])];
                    }
                    
                    R=[ArrfcA([minus,times],[[A[0][0],A[1][1]],[A[1][0],A[0][1]]]), p?minus(Sar,1):''];
    
                    
                }
                if(m==3){
                    var B=[[[A[0][0],A[1][1],A[2][2]],[A[0][1],A[1][2],A[2][0]],[A[0][2],A[1][0],A[2][1]]],
                        [[A[0][2],A[1][1],A[2][0]],[A[0][1],A[1][0],A[2][2]],[A[0][0],A[1][2],A[2][1]]]];
                    R.push(ArrfcA([minus,plus,times],B));
    
                    R.push(ArrfcA([function(s){return minus(s,1,0)}, function(s){return plus(s,1,0)}, function(s){return times(s,1,1)} ],B));
                        
    
                }
                if(p){
                //consolelog(R[1]);
                    R[1]=kdet(A)+' = '+R[1]+' = '+ R[0]
                }
                return R
            }
    
    
            if(op=='detLaplace'){/*行列式Laplace展开  		[[[余子式矩阵,系数]+], htmlA]
                返回	[[余子式矩阵,系数]+，步骤数组]
                */
                var ps=p.split(';');
                for(var j=0;j<ps.length;j++){
                    var psj=ps[j],p0=psj[0],isi=p0=='i',k=+psj.substr(1),a=[kdet(A),''];	//,eq(Mtrx.note.PT('l'+psj))
                    for(var i=0;i<(isi?n:m);i++){
                        var s=isi?k-1:i,t=isi?i:k-1;
                        ////consolelog(s,t,k,isi,psj);
                        if(+A[s][t]!=0){
                            var Aij=Mtrx.opr1('Aij',A,[s+1,t+1]);//[余子式矩阵, 子式, 系数]
    
                            ////consolelog(Aij);
                            if(!Mtrx.is.b1.rc0(Aij[0])){//其实还需判断，是否有相同或成比例的行（列） rck0
                                ////consolelog(Aij);
                                //Aij[1]=times([Aij[1],A[s][t]]);	
                                Aij[1]=times([Aij[1],Aij[2]]);
    
                                B.push(Aij);
                                a[1]+=Aij[1]+kdet(Aij[0])+' + ';
                            }
                        }
                    }
                }
                a[1]=a[1].replace(/ \+ -/,' -').replace(/ \+ $/,'');
                
                ////consolelog(B,a);
    
                return [B,a]//[B,a.replace(/ \+ $/,'')]
            }
    
    
    
            if(op=='Det'){//行列式 （结果不化简） 		[[[余子式矩阵,系数]+], html]
    
    
            }
            if(op=='det'){//行列式 determinant 自动寻找方法计算结果
                
                
                
                
        //		if(m<=3){
                    //consolelog(A,Mtrx.opr1('detSar',A).join('+'));
                    //return Mtrx.opr1('eval',[[Arrf(nWrap,Mtrx.opr1('detSar',A)).join('+')]])[0][0]
                    
                    
        //			return Mtrx.opr1('eval',[[Mtrx.opr1('detSar',A)[0]]])[0][0]	//报错！
        //		}else{
                    return Mtrx.opr1('detPTs',A,p||'iU=;d;=',1)[0]
                //		}
            
                return ''
            }
            if(op=='r'){//rank秩	使用初等变换求秩
                var B00=Mtrx.opr1('rankPTs',A,'iE=',1)[0][0];
                //consolelog(B00);
                //return +Mtrx.opr1('秩',B00)[0][0][0][0]
                return Mtrx.opr1('秩',B00)
            }
            if(op=='tr'){ //trace迹
                return plus(Mtrx.opr1('取',A,'D'))
                
            }
            if(op=='谱'){
                
                
                return ''
            }
            if(op=='norm'){//范数norm 有多种
                
                
                return ''
            }
            if(op=='特征矩阵'){
        //		//consolelog(op);
                return Mtrx.opr2('-',Mtrx.build.D(copyA('λ',m)),A)
            }
    
            if(op=='尝试求特征值'){/*适合3阶以内 以及特殊的矩阵（对角阵）
                参数p:已知特征值数组：[特征值1，特征值2，...]	注意，重根输入重数次
                参数ar[3]: 第4个参数指定获取步骤
    
                返回 [特征值数组, 步骤]
                
                */
                
                var C=[],es=Arrf(function(t){return ''+t},[].concat(p||[])), esn=es.length;
                if(esn==m){
                    return [es,'特征值已知']
                }
                if(Mtrx.is.b1.UL(A)){
                    return [Mtrx.opr1('取',A,'D'), '三角阵的特征值就是主对角线元素']
                }
                
                var trA=Mtrx.opr1('tr',A),tr=trA,r=Mtrx.opr1('r',A);
                //consolelog('求出迹',trA,tr,r);
                
                var dete=r<m?0:Mtrx.opr1('detPTs',A,'iU=;d;=')[0];
                if(esn){
                    //consolelog('已知特征值：',p,es);
                    tr=minus([tr,plus(es)]);
                }
                var f=function(i,k){//给出特征值i, 以及重数k，添加到集合中
                    var l=k-es.filter(function(t){return t==''+i}).length;
                    if(l){
                        //consolelog('此前 迹',tr);
                        //consolelog('特征值',i,' 遗漏重数',l);
                        es=es.concat(copyA(''+i,l));
                        esn+=l;
                        if(''+dete!='0'){
                            //consolelog('行列式',dete);
                            dete=divide([dete,pow([i,l])]);
                        }
                        if((''+i)!='0'){
                            //consolelog('迹',tr);
                            tr=minus([tr,times([i,l])]);
                        }
                        if(esn+1==m){
                            //consolelog('最后1个特征值是 '+tr);
                            es.unshift(tr);
                            esn++;
                        }
                    }
                };
    
                if(''+dete=='0'){
                    //consolelog('行列式为0，有特征值0');
                    f(0,m-r);
                    if(ar[3]){
                        //consolelog('行列式为0，秩为'+r+',则含有特征值0（'+(m-r)+'重）');
                        C.push('行列式为0，秩为'+r+',则含有特征值0（'+(m-r)+'重）');
                    }
                    /*
                        得到特征值0后，需对行列式dete进行去零
                        |λI-A|
                        Ax=0 基础解系中向量个数(n-r) ≤ 特征值0的（代数）重数r'
                        Ax=kx
                        
                        选A的相似矩阵B=P^(-1)AP			A,B特征向量之间的关系（只相差一个可逆变换矩阵P）：Ax=kx By=ky PB=AP PBy=APy A(Py)=APy=PBy=P(ky)=k(Py)	说明Py是A的特征向量
                        B=diag(C, 0)
                         =
                            C 0
                            0 0
                        求C特征值c，特征向量y Cy=cy
                        C O  y
                        O O  0
                        即B有特征值c，特征向量
                            cy
                            O
                        
                        A有特征值c，特征向量
                            Pcy
                            0
                        
                        
                        设Ax=0基础解系x1,x2
                        
                        
                        
                        
                        
                    */
                }
    
                if(esn && esn<m){/*将已知特征值，检查重数，进行补充，
                    注意，用特征矩阵的秩r，来判断特征值重数(n-r)，是可能低估重数的
                        因此后续特征值求不全时，可以再检查一下已知特征值
                    */
                    var es0=[].concat(es0),esn0=esn;
                    for(var i=0;i<esn0;i++){
                        if(es0[i]){
                            var r0=Mtrx.opr1('r',Mtrx.opr2('-',Mtrx.build.D(copyA(es0[i],m)),A));
                            //f(Aii,r0);
                            f(Aii,m-r0);
                        }
                    }
                }
    
                if(esn<m){
                    for(var i=0;i<m;i++){//某一行（列）只有1个非零元（在主对角线上）
                        if(esn==m){break}
                        var Aii=''+A[i][i];
                        if(es.indexOf(Aii)>-1){
                            continue;
                        }
                        var Ai=[].concat(A[i]), Aj=Arri(A,i);
                        Ai.splice(i,1);
                        Aj.splice(i,1);
                        if(/^0*$/.test(Ai.join('')) || /^0*$/.test(Aj.join(''))){
                            var r0=Mtrx.opr1('r',Mtrx.opr2('-',Mtrx.build.D(copyA(Aii,m)),A));
                            //consolelog('主对角线 有特征值 '+Aii,' 迹：',tr);
                            //f(Aii,r0);
                            f(Aii,m-r0);
                            if(r[3]){
                                
                                C.push('第'+(i+1)+'行列'[+/^0*$/.test(Aj.join(''))]+'非主对角线元素都为0,','则有特征值（即该主对角线元素）：'+Aii);
                            }
                        }
                    }
                }
                if(esn<m){
                    for(var i=1;i<10;i++){
                        if(esn==m){break}
                        if(es.indexOf(''+i)<0){
                            //consolelog('猜测特征值 ',i);
                            var r0=Mtrx.opr1('r',Mtrx.opr2('-',Mtrx.build.D(copyA(i,m)),A));
                            if(r0<m){//m-r0就是该特征值的重数
                                f(i,m-r0);
                            }
                        }
                        
                        if(esn==m){break}
                        if(es.indexOf('-'+i)<0){
                            //consolelog('猜测特征值 -',i);
                            var r0=Mtrx.opr1('r',Mtrx.opr2('+',Mtrx.build.D(copyA(i,m)),A));
                            if(r0<m){//m-r0就是该特征值的重数
                                f(-i,m-r0);
                            }
                        }
                    }
                }
                if(esn<m){
                    if(Mtrx.is.b1['列正交'](A) && Mtrx.is.b1['列等模'](A)){/*列正交向量单位化，会得到正交矩阵Q（特征值是±1） AP=Q 或A/x=Q	特征值是±列向量模x
                        数量实正交矩阵kQ，特征值是±k，其中负特征值的个数s满足tr(kQ) = k(n-2s)  |kQ| = (-1)^s k^n
                        */
                        //consolelog('列正交  列等模');
                        
                        var k=Mtrx.opr1('向量模1',Arri(A,0));
                        //consolelog('向量模1',k);
                        if(es.indexOf(''+k)<0){
                            var s=minus([m,divide([trA,k])])/2;
                            //consolelog('重数s= ',s);
                            
                            if(/√/.test(k)){//出现开方√，除法运算出现死循环，特别处理一下，直接添加成对±k，未考虑重数>1的情况
                                es.unshift(k,neg(k));
                                esn+=2;
                                
                                                
                            }else{
                            
                                f(k,m-s);
                                //consolelog('es= ',es,'esn= ',esn,'m= ',m);
                                f(neg(k),s);
                                //consolelog('es= ',es,'esn= ',esn,'m= ',m);
                                if(r[3]){
                                    //consolelog('数量实正交矩阵kQ，','则有特征值是±'+k);
                                    C.push('数量实正交矩阵kQ，','则有特征值是±'+k);
                                }
                            }
                        }
    
                    }
                }
                if(esn<m){
                    if(Mtrx.is.b1['列等和'](A)){/*列向量和相等，则此和必为特征值
                        */
                        //consolelog('列等和 ');
                        var k=plus(A[0]);
                        if(es.indexOf(''+k)<0){
                            var r0=Mtrx.opr1('r',Mtrx.opr2('-',Mtrx.build.D(copyA(k,m)),A));
                            f(k,m-r0);
                            if(r[3]){
                                C.push('各列和相等，都是'+k,'则有特征值是'+k);
                            }
                        }
                    }
                    if(Mtrx.is.b1['行等和'](A)){/*行向量和相等，则此和必为特征值
                        */
                        //consolelog('行等和 ');
                        var k=plus(Arri(A,0));
                        if(es.indexOf(''+k)<0){
                            var r0=Mtrx.opr1('r',Mtrx.opr2('-',Mtrx.build.D(copyA(k,m)),A));
                            f(k,m-r0);
                            if(r[3]){
                                C.push('各行和相等，都是'+k,'则有特征值是'+k);
                            }
                        }
                    }
                    
                    
                }
                if(esn<m){
                    if(m-esn==2){//此时用二次方程求根公式
                        
                        if(''+dete=='0'){/*此时求特征矩阵|xE-A|主对角线元素（代数）余子式（x都替换为0）之和，即为特征方程中x一次项的系数
                                也即-A的主对角线元素(代数)余子式之和，
                                也即-A的伴随矩阵的迹 tr((-A)*) = tr( (-1)^(n-1)A* ) = (-1)^(n-1) tr(A*)
                            */
                            dete=Mtrx.opr1('tr',Mtrx.opr1('*',Mtrx.opr1('-',A)));
                            //consolelog('tr((-A)*) = ',dete);
                            
                            
                        }
                        
                        //consolelog('二次方程求根');
                        var last2=equationA([1,neg(tr),dete]);
                        es.push(last2[0][0],last2[0][1]);
                        esn=m;
                        
                    }
                    if(m-esn==3){//此时用三次方程求根公式
                        var f1=Mtrx.opr1('detPTs',Mtrx.opr2('-',Mtrx.build.D(copyA(1,m)),A),'iU=;d;=')[0],
                            f_1=Mtrx.opr1('detPTs',Mtrx.opr2('-',Mtrx.build.D(copyA(-1,m)),A),'iU=;d;=')[0],
                            a1=divide([minus([f1,f_1]),2]);
                        //consolelog('3次方程1次项系数是',a1);
    
                        var last3=equationA([1,neg(tr),a1,neg(dete)]);
                        //console.log(last3);
                        es.push(last3[0][0],last3[0][1],last3[0][2]);
                        esn=m;
                        
                    }
                    
                    if(esn==1){//此时猜测是重根（用迹、行列式来校验，但未严格证明，可能有误）	示例矩阵：2-125-33-10-2
    
                        if(tr==times([es[0],m-esn]) && ''+dete==''+pow([es[0],m-esn])){
                            es=copyA(es[0],m);
                        }
                        
                    }
                }
                //consolelog(C.join('\n\n'));
                if(es.filter(function(t){return nisn(t,'',0)}).length==m){//全是整数，进行排序
                    es.sort(sortBy.num);
                }
                return [es, C.join(br)]
            }
            if(op=='特征值'){/*特征值 eigenvalue 
                参数p:已知特征值数组：[特征值1，特征值2，...]	注意，重根输入重数次
                参数ar[3]: 第4个参数指定获取步骤
                
                返回 [特征值数组, 步骤]
    
    
    
    
        http://wenku.baidu.com/link?url=4syLqIl3c1o4dP4heVbONNu7QNgT3pwj5Koy2zd6Q6-kKemvD82-OPUI1WKorwKOLCaarwblkJpla0-qWbcGv_wC7WLRqQ3Gs84n_UXYmRO
        
        http://wenku.baidu.com/view/d9e9f707cc1755270722081d.html
        
        
        
        P ⁻¹AP=Λ 		3 -2 0 -2 2 -2 0 -2 1&-1,2,5
        http://wenku.baidu.com/link?url=UxM_0HcXUUv61MznLR6jto0tgDqhECnjDNKXf8Malkk3UgOd9Q1F7t0lqohTyb6hddXcaFDvdlOIxzMBSTrP5-WoBcg4YIPks5j1ahvcPou
    
    
        
                */
                var C=[],es=Arrf(function(t){return ''+t},[].concat(p||[])), esn=es.length;
                if(esn<m){
                    var esC1=Mtrx.opr1('尝试求特征值',A,es,ar[3]);
                    es=esC1[0];
                }
                //consolelog(es);
                if(ar[3]){
                    var eM=Mtrx.opr1('特征矩阵',A), eP=Mtrx.opr1('特征多项式',A,es,ar[3]);
                    C.push('|λI-A|',kdet(eM),eP[0],0);
                    var esA=countA(es);//[特征值去重数组，相应重数数组]
        //		//consolelog(esA);
                //consolelog(esA.join('\n'));
                    esA[0]=Arrf(Mfn.toStr,esA[0]);
                    C=['A='+kmtrx(A)+', '+C.join('='),'解得λ = '+count2pow(esA,2)];//, '备注：',esC1[1]];
    
                }
    
            
                return [es, C]
            }
    
            if(op=='特征多项式'){/*特征多项式 eigenpolynomial |xI-A| 即所有不变因子的乘积
    
                [必需]参数p:特征值数组：[特征值1，特征值2，...]	注意，重根输入重数次
                参数ar[3]: 第4个参数指定获取步骤
                
                返回 [多项式，步骤]
                
                最小多项式是标准型（主对角线上为：d₁(λ) d₂(λ)。。。，称为不变因子）中最后一项：dr(λ)，r为秩
                    https://wenku.baidu.com/view/8ae707d02cc58bd63186bda6.html
                初等因子：将不变因子分解为互不相同的一次因子的乘积（相同的一次因子写成幂，不需分解）
                不变因子：将所有初等因子按幂作降序排列（行排列），然后各行后面补齐1（使每行都有n个因子），然后从左到右，同一列的上下初等因子相乘，依次得到dr(λ) dr₋₁(λ)。。。d₁(λ) 
                
                */
    
    
                return [count2pow(countA(Arrf(pptd,Mtrx.opr2('-',[copyA('λ',m)],[p])[0]))),'过程略']
            }
    
            if(op=='特征向量'){/* eigenvector
                参数p:特征值数组：[特征值1，特征值2，...]	注意，重根输入重数次
                参数ar[3]: 第4个参数指定获取步骤
                
                返回 [向量矩阵, 步骤, n个特征值数组，[[特征值1,重数,特征向量], [特征值2,重数,特征向量]], 是否可对角化diaged]
                
                */
                var C=[],Bs,es=Arrf(function(t){return ''+t},[].concat(p||[])), esn=es.length, diaged=1;
                
                if(esn<m){
                    var esC1=Mtrx.opr1('特征值',A,es,ar[3]);
                    es=esC1[0];
                    esn=es.length;
                    if(ar[3]){
                        C.push(esC1[1],'\\\\');
                    }
                }
    
                var esA=countA(es),esA0=esA[0],esA1=esA[1], eVA=[], CA=[];
        //		//consolelog('统计特征值',esA.join('\n'))
                for(var i=0;i<esA0.length;i++){//遍历不同的特征值
                    //Mtrx.opr2('*',Mtrx.build.I(m),p[i])
    
                    //consolelog(i, Mtrx.opr2('-',Mtrx.build.I(m,m,esA0[i]),A));
                    var Bi=Mtrx.opr1('fshPTs',Mtrx.opr2('-',Mtrx.build.I(m,m,esA0[i]),A),'iS=;fsh;iS=;jB*=',!ar[3]), Bi00=Bi[0][0];//[[结果矩阵，系数],过程html]
                    var ei=subMtrx(Bi00,1,m,m+1),ein=ei[0].length,eiv=[],eivs=[];
                    B.push(ei);//特征向量组
                    for(var j=0;j<ein;j++){
                        var ej=Arri(ei,j);
                        eiv.push(ej);
                    //	es.push(p[i]);//记录特征值
                        if(ar[3]){
                            //eivs.push('('+ej.join()+')^T');
                            eivs.push(ej);
                        }
                    }
                    eVA.push([esA0[i],esA1[i],eiv]);//[特征值1,重数,特征向量]
                    
                    if(diaged && ein<esA1[i]){//不可对角化
                        diaged=0
                    }
                    
                //consolelog('几何重数：',ein,'\n','代数重数：',esA1[i]);
                    if(ar[3]){
                        //CA.push(['将特征值'+kfrac(esA0[i],1)+'代入特征方程(λI-A)x=0',Bi[1],'得到属于特征值'+esA0[i]+'的特征向量'+kfrac(eivs.join(', '),1)]);
                        CA.push(['将特征值'+kfrac(esA0[i],1)+'代入特征方程(λI-A)x=0',Bi[1],'得到属于特征值'+esA0[i]+'的特征向量'+Arrf(kmtrx,eivs).join(', ')]);
    
                    }
                }
                
                
                Bs=Mtrx.build.B([B]);
                if(ar[3]){
                    C.push(ztable(CA));
                    C.push('得到特征向量矩阵P = ',kmtrx(Bs));
                    if(diaged){
                        C.push('并且有P^{-1}AP = Λ = '+kxf('diag')+zp(kfrac(''+es,1)));
                    }else{
                        C.push('矩阵A不可对角化');
                    }
                }
    
                return [Bs, kxA(C), es, eVA,diaged]
            }
            if(op=='奇异值'){/*AA^H（也是A^HA）的特征值的算术平方根
                p指定获取步骤
                
                返回[奇异值数组，步骤]
                
                */
                
                var AAH=Mtrx.opr2('*',A,Mtrx.opr1('H',A)), EGV=Mtrx.opr1('特征值',AAH,'',p),S=Arrf(sqrt,EGV[0]);
                //U=Mtrx.opr1('特征向量',AAH), V=Mtrx.opr1('特征向量',AHA);	,AHA=Mtrx.opr2('*',Mtrx.opr1('H',A),A)
                return [S,p?EGV[1]+br+'再分别求出特征值的算术平方根，'+br+'得到'+S:'']
                
            }
            
    
            if(op=='inv'){//逆
                /*
    参数p 求逆方法：
                    d 对角阵 对角线元素（或分块）取逆 
                    d- 副对角阵 副对角线元素（逆序，分块较复杂，需满足矩阵分块可乘）取逆
                    
                    * 伴随矩阵求逆
                    PTs	初等行变换求逆
                    part 分块矩阵求逆（ 暂仅支持2×2分块，（副）对角线上分块可逆，且至少有1个分块是零矩阵）
                    
                    e 初等矩阵求逆 elementary matrices
                */
                if(p=='e'){
                    var D=Mtrx.opr1('取',A,'D');
                    if(/(1,)*0(,1)*,0(,1)*/.test(D)){//交换, 逆矩阵是自身：满足A^2=I=AA^T 是正交矩阵
                        return Mtrx.opr1('拷',A)
                    }
                    if(/^(1,)*1$/.test(D)){//i行的倍数加到j行, 逆矩阵是2I-A：满足2A-A^2=I即(A-I)^2=0； A特征值都是1
                        return Mtrx.opr2('-',Mtrx.build.I(m,m,2),A)
                    }
                    //数乘，逆矩阵是对角线上非1元，替换为倒数；A特征值：n-1个1，以及1个非1元
                    var a=[];
                    for(var i=0;i<m;i++){
                        if(+A[i][i]!=1){
                            a.push(i);
                            break;
                        }
                    }
                    return Mtrx.build.replace(Mtrx.build.I(m),[divide([1,A[i][i]])],[i+1,i+1])	
                }
                if(p=='d'){
                    for(var i=0;i<m;i++){
                        var Aii=A[i][i], isA=isArr(Aii);
                        B.push(isA?Mtrx.opr1('inv',Aii):divide([1,A[i][i]]));
                    }
                    return Mtrx.build.D(B)
                }
                if(p=='d-'){
                    for(var i=0;i<m;i++){
                        var Aii=A[m-i-1][m-i-1], isA=isArr(Aii);
                        B.push(isA?Mtrx.opr1('inv',Aii):divide([1,A[i][i]]));
                    }
                    return Mtrx.build.D(B)
                }
                if(p=='*'){
                    return Mtrx.opr2('/',Mtrx.opr1('*',A) , Mtrx.opr1('det',A))
                }
                if(p=='PTs' || !p){
                    var B00=Mtrx.opr1('invPTs',A,'iS=',1)[0][0];
                    return subMtrx(B00,1,m,m+1)//subMtrx(B00,1,m,m*2)
                }
                if(p=='part'){
                    return Mtrx.opr1('invPTs',A,'P',1)[0]
                }
            }
            if(op=='逆'){//直接用初等行变换求逆矩阵，返回矩阵
                //return Mtrx.opr1('invPTs',A,'iS=',1)[0][0];
                return Mtrx.opr1('inv',A);
            }
    
            if(op=='指'){/*指数矩阵数组（到零矩阵结束）
                    返回数组 [A,A²,A³⋯Aⁿ]  Aⁿ⁺¹=0
                */
                B.push(Mtrx.opr1('拷',A));
                
                for(var i=0;i<10;i++){
                    var Bi=Mtrx.opr2('*',B[i],A);
                    //consolelog(i,Bi,Mtrx.toStr(Bi));
                    if(Mtrx.is.b1[0](Bi)){
                        break
                    }else{
                        B.push(Bi);
                    }
                }
            }
            if(op=='exp'){/*指数e的矩阵幂 幂级数展开
                    返回数组 [结果矩阵,指数矩阵数组]
                */
                var C=Mtrx.opr1('指',A),R=Mtrx.build.I(m);
                for(var i=0;i<C.length;i++){
                    R=Mtrx.opr2('+',R,Mtrx.opr2('/',C[i],Fact(i+1)));
                }
                B=[R].concat(C);
            }
            
            if(op=='分解'){/*
                
                ar[3]	指定获取步骤
                
                
                */
                
                if(p=='T'){/*	ar[3] 指定a，得到唯一解 ，返回[αT,β]
                
                    T分解（不唯一）：适合行(列)间成比例（或相等）的矩阵分解 
                        (a b c)T * (i j k) = 
                        ai aj ak
                        bi bj bk
                        ci cj ck
                        
                        行间相同时，得到 (1 1 1)T * (i j k)
                        列间相同时，得到 (a b c)T * (1 1 1)
                    
                    
                */
                
    
                    var a=ar[3], B0=[[a]],B1=[[]];
                    //consolelog(a);
                    for(var i=0;i<m;i++){
    
                        B1[0].push(divide([A[0][i],a]));
                        if(i){
                            B0.push([divide([A[i][0],B1[0][0]])])
                        }
                    }
                    B=[B0,B1];
                }
    
                if(p=='SVD'){
                    
                    
                }
                if(p=='ps'){/*分解为初等矩阵的乘积	
                    返回 [初等矩阵数组, 步骤, 变换命令组]
                    */
                    //consolelog(ar[3]);
                    var B=Mtrx.opr1('invlPTs',A,'iS=',!ar[3]);
                    //consolelog(B,m);
                    
                    B[0]=Mtrx.pt.ps2invAs(B[2],m);
                    
                    if(ar[3]){
                        //consolelog(B);
                        var l=B[0].length, Qs=Mtrx.pt.ps2As(B[2],m),S=seqA(1,l),R=seqA(1,l).reverse();
                        B[1]+=['','上述每一步,相应初等变换矩阵分别是',
                        concat(ZLR(ZLR3('P_{',S,'}',' ')), copyA('=',l), Arrf(zmtrx,Qs)),
                            ZLR3('P_{',R,'}','')+'A=E',
                            '则A='+ZLR3('P_{',S,'}^{-1}',''),
                            concat(ZLR(ZLR3('P_{',S,'}^{-1}',' ')), copyA('=',l), Arrf(zmtrx,B[0])),''].join(kbr2)
                    }
                }
            }
            
            
            if(op=='拷'){
                for(var i=0;i<m;i++){
                    B.push([]);
                    for(var j=0;j<n;j++){
                        B[i].push(A[i][j])
                    }
                }
            }
            if(op=='取'){//根据元素位置索引（从1开始），返回子集	[[行1,列1],[行2,列2],[行3,列3]]	[[行1,行2,行3](缺失时，默认为[1,2,...,n]),[列1,列2,列3]]
            //	ar[3] 指定索引风格ijij	iijj[默认]	[[行1,列1]]
            //	p: D主对角线上元素 -D副对角线元素
                var s=[],pij=arl>3 && ar[3]=='ijij';
                if(p=='D'){
                    for(var i=0;i<minmn;i++){
                        B.push(A[i][i])
                    }
                }else if(p=='-D'){
                    for(var i=0;i<minmn;i++){
                        B.push(A[i][n-i-1])
                    }
                }else{
                    var p0A=isArr(p[0]), pn=pij?p.length:(p0A?p[0].length:p.length)
                    for(var i=0;i<pn;i++){
                        B.push(pij?A[+p[i][0]-1][+p[i][1]-1]:A[p0A?+p[0][i]-1:i][(p0A?+p[1][i]:+p[i])-1])
                    }
                }
            }
            
             B.t='Mtrx';B.toStr=function(p){return Mtrx.toStr(this,p)};
            
            return B
            
        },
            
        opr2:function(op,A,B,p){
    //矩阵二元运算
    //当A、B中有1个是矩阵，另一个是数字，则对矩阵作相应的位操作
    //求负矩阵 opr2('-',0,B) opr2('*',A,-1) opr2('*',-1,B) opr2('/',A,-1)
    //consolelog(op,A,B);
            var C=[],AA=isArr(A),BB=isArr(B),Ar=A.length,Ac=AA?A[0].length:1,Br=B.length,Bc=BB?B[0].length:1,ars=$.makeArray(arguments).slice(1),arl=ars.length;
            C.t='Mtrx';
    
    
            if(op=='⊕'){//克罗内克和 Kronecker sum 设两个方阵Am、Bn，A⊕B=A⊗In+Im⊗B。 http://mathworld.wolfram.com/KroneckerSum.html
                C=Mtrx.opr2('+',Mtrx.opr2('⊗',A,Mtrx.build.I(Br)),Mtrx.opr2('⊗',Mtrx.build.I(Ar),B));
            }
            if(op=='⊗'){//克罗内克积 Kronecker product 将m×n矩阵A的所有元素，分别与p×q矩阵B相乘，得到mp×nq的分块矩阵。
                var mn=[];
                for(var i=0;i<Ar;i++){
                    var mni=[];
                    for(var j=0;j<Ac;j++){
                        mni.push(Mtrx.opr2('*',B,A[i][j]))
                    }
                    mn.push(mni)
                }
                C=Mtrx.build.B(mn);
            }
            if(op=='∔'){//直和 构成准对角阵
                return Mtrx.build.D(ars)
            }
            if(op=='内积'){/*
                A,B均为1维数组：行向量
                */
    
                var a=0;
                for(var i=0;i<Ar;i++){
                    a=plus([a,times([A[i],B[i]])])
                }
                return a
            }
            
            
            if(op=='左除' || op=='\\'){//左除	A左除B	A\B
                
        /*
                    invPTs 求逆			A|E → I|A⁻¹
                        A左除B	A\B		A|B → I|A⁻¹B
                        A右除B	B/A		A → I
                                        B    BA⁻¹
        */
                
                C=Mtrx.opr2('*',Mtrx.opr1('逆',A),B)
            }
            
            if((op=='/' || op=='右除') && AA && BB){//矩阵右除	A右除B	B/A
                C=Mtrx.opr2('*',B,Mtrx.opr1('逆',A));
    
            }else if(/^[\*\/\+\-\^]$/.test(op)){//四则运算
                var N;
                if(op=='/' && BB){
                    N=Mtrx.opr1('逆',B);
                }else{
                    N=B
                }
                if(AA && BB){
                    if(/[\+\-]/.test(op)){//矩阵加减（行列数要一致）
                        C=Mtrx.opr2('.'+op,A,B)
                    }else if(op=='^'){//幂 这里是二元幂A^B，需要改写定义
            //矩阵的矩阵幂（得到分块矩阵，与Kronecker积思路类似）
                        //C=
    
                    }else{//矩阵乘除  	A的列数等于B的行数 :Ac==Br 返回Ar×Bc阶矩阵
                        for(var m=0;m<Ar;m++){
                            C.push([]);
                            for(var n=0;n<Bc;n++){
                                
                                
                                var a=0;
                                for(var k=0;k<Ac;k++){
                                    a=plus([a,times([A[m][k],N[k][n]])])
                                }
                                
                                C[m].push(a)
                            }
                        }
                    }
                }else{//矩阵与数，点运算 每个元素都作同样的加减乘除、幂
                    var M,Mr,Mc,m;
                    if(AA){
                        M=A;Mr=Ar;Mc=Ac;m=B
                    }else{
                        M=N;Mr=Br;Mc=Bc;m=A
                    }
                    for(var i=0;i<Mr;i++){
                        C.push([]);
                        for(var j=0;j<Mc;j++){
                            C[i].push(Mfn.oprs(AA && op=='/'?'/':(/[\+\-\^]/.test(op)?op:'*'),[M[i][j],m],1).toStr())
                        }
                    }
                }
            }
            if(/\.[\*\/\^\+\-]/.test(op)){//矩阵之间点乘、点除、点幂，点加、点减，就是普通的矩阵加减
                for(var i=0;i<Br;i++){
                    C.push([]);
                    for(var j=0;j<Bc;j++){
                        //console.log(op[1],i,j,[A[i][j],B[i][j]],A,B);
                        C[i].push(Mfn.oprs(op[1],[A[i][j]||0,B[i][j]||0],1).toStr())
                    }
                }
            }
    
            if(/b∨/.test(op)){//布尔矩阵并∨（Join或）
                for(var i=0;i<Br;i++){
                    C.push([]);
                    for(var j=0;j<Bc;j++){
                        var ais1=1-is0(A[i][j]),bis1=1-is0(B[i][j]);
                        C[i].push(ais1||bis1)
                        
                    }
                }
            }
    
            if(/b∧/.test(op)){//布尔矩阵交∧（Meet且）
                for(var i=0;i<Br;i++){
                    C.push([]);
                    for(var j=0;j<Bc;j++){
                        var ais1=1-is0(A[i][j]),bis1=1-is0(B[i][j]);
                        C[i].push(ais1*bis1)
                        
                    }
                }
            }
    
            if(/b⊙/.test(op)){//布尔矩阵积⊙（类似于普通矩阵乘法）	A的列数等于B的行数 :Ac==Br 返回Ar×Bc阶矩阵
                for(var i=0;i<Ar;i++){
                    C.push([]);
                    for(var j=0;j<Bc;j++){
                        
                        var a=0;
                        for(var k=0;k<Ac;k++){
                            var ais1=1-is0(A[i][k]),bis1=1-is0(B[k][j]);
                            
                            a+=ais1*bis1;
                            if(a){
                                break
                            }
                        }
                        C[i].push(a)
                        
                    }
                }
            }
    
            C.t='Mtrx';C.toStr=function(p){return Mtrx.toStr(this,p)};
            
            return arl<3?C:Mtrx.opr2.apply(null,[op,C].concat(ars.slice(2)));
            //return arl<3?C:Arrf(function(x,y){return Mtrx.opr2(op,x,y)},ars,'cp2')
        },
    
        coo:function(op,E,p){/*复合运算	E是表达式 p是参数
            E
    
    */
            var B=[],m=A.length,n=A[0].length, ar=arguments, arl=ar.length; B.t='Mtrx';
            if(op=='化简'){
                
            }
        },
    
        note:{
            PT:function(t){//初等变换 步骤说明
                //consolelog(t);
                return t.replace(/(\d)[LUDI]/g,'$1').replace(/^0/,'显然为0：').replace(/:([ij]\d+)/,'、$1成比例')
                    .replace(/fs[hi]/,'增行增列，求基础解系').replace(/[ij]U=/g,'化上三角').replace(/[ij]L=/g,'化下三角').replace(/[ij]D=/g,'化对角阵').replace(/[ij]I=/g,'化最简形')
                    .replace(/i(\d+)/g, '第$1行').replace(/j(\d+)/g, '第$1列').replace(/≈|~~/g,'交换').replace(/~/g,'到')
                    .replace(/jb\*=/ig,'基础解系乘以倍数，凑成整数')
                    .replace(/(第\d+[行列],?)+\+=/g,function(x){return x.replace('+=', (/,/.test(x)?'，分别':'')+'加上')})
                    .replace(/(第\d+[行列],?)+\-=/g,function(x){return x.replace('-=', (/,/.test(x)?'，分别':'')+'减去')})
    
                    .replace(/[\/÷]=/g,', 提取公因子')
                    
                    .replace(/[×⋅\*]=/g,', 乘以')
                    .replace(/^d-/g,'副对角线相乘').replace(/^d/g,'主对角线元素相乘')
                    .replace(/^L(ap)*/g,kxf('Laplace')+'展开').replace(/^D/g,'按定义展开').replace(/^S/g,'按对角线法则展开')
                    .replace(/^T/g,'转置').replace(/^a/g,'拆开')//.replace(/-?\d+\/\d+/g,function(s){return s})//pptd(s)
    
            },
            Det:function(t){//行列式 步骤说明
                return t.replace(/(\d)[LUDI]/g,'$1').replace(/(\d+)/,'第$&项').replace(/项\.(\d+)/g,'项中的第$1项')
                    .replace(/[ij]U/g,'化上三角').replace(/[ij]L/g,'化下三角').replace(/[ij]D/g,'化对角阵').replace(/[ij]I/g,'化最简形')
                    .replace(/^≈(\d+)/,'与第$1项交换').replace(/^\+=([\d,]+)/,'与第$1项合并').replace(/^\*=(.+)/,'提取公因子$1')
                    .replace(/^Def/g,'按定义展开').replace(/^Sar/g,'按对角线法则展开').replace(/^L(ap)*/g,'Laplace展开').replace(/^d/g,'主对角线元素相乘')
                    .replace(/^a.\d+=.+/g, function(s){return '拆开'+Mtrx.note.PT(s.split('=')[0].substr(1))})
                    .replace(/^Up/,'去括号')
                    .replace(/^FVan/g,'是范德蒙行列式').replace(/^F.*cyc/g, function(s){'是'+'反b '[s[1].charCodeAt(0)-97]+'循环行列式'})
                    .replace(/^PT.+/g, function(s){return Mtrx.note.PT(s.substr(2))})//.replace(/-?\d+\/\d+/g,function(s){return s});//pptd(s)
            }
        }
        
    };
    
    Mtrx.pt={
        p2A:function(p,n){//单个变换，返回相应初等矩阵	n是阶数
            return Mtrx.opr1('PT',Mtrx.build.I(n),p)[0]
        },
        ps2As:function(a,n){//根据变换命令数组，转换得到相应初等矩阵数组
            var A=[]
            for(var i=0;i<a.length;i++){
                A.push(Mtrx.opr1('PT',Mtrx.build.I(n),a[i])[0])
                
                
            }
            //var A=Arrf(function(t){Mtrx.opr1('PT',Mtrx.build.I(n),t)[0]}, a);	计算太耗时，不能使用Arrf，需用for
            return A
        },
        pinv:function(p){//单个变换，返回逆变换命令
            //consolelog(p);
            var q='';
            if(/≈/.test(p)){
                q=p
            }else if(/[\+\-]=/.test(p)){
                q=p.replace(/×.+/,function(t){return '×'+neg(t.substr(1))})
            }else if(/[\/\*]=/.test(p)){
                q=p.replace(/=.+/,function(t){return '='+rcp(t.substr(1))})
            }
            return q
        },
        psinv:function(a){//根据变换命令数组，返回逆变换命令数组
            return Arrf(Mtrx.pt.pinv,a)
        },
        ps2invAs:function(a,n){//根据变换命令数组，得到相应逆变换初等矩阵数组
            return Mtrx.pt.ps2As(Mtrx.pt.psinv(a),n)
        },
    };
    
    
    /*
    
    Jordan标准型
    http://wenku.baidu.com/link?url=H0czQt5-dWKzdNpKxFmNelcdFalbVhtwmCrrWn77WP8ws-GU5eybaHrHaz7wTjuganKlfxA_1u9EfYON631XNEHR4Mw_pwh5GakT_x6k8_C
    
    http://wenku.baidu.com/link?url=srskYWcBVSs6p29FWmJhdXTqV0G40L8U2q4bX6rE18B8e7HoUmQAPk65PVofGzF111QG8e17TebCorfgr2QbyelffwnwBLLC7nHMP-HOfT3
    
    特征值多种性质
    https://wenku.baidu.com/view/556a39263169a4517723a347.html
    
    矩阵的特征值与特征向量的求法：亮点是增广矩阵同时求特征值、特征向量
    
    方法1： 对增广矩阵施行初等列变换，化成下三角
    λE-A	→	G
    E			Q
    
    令|G|=0，解得特征值
    特征值代入，零向量，下方对应的就是特征向量
    
    方法2：对增广矩阵施行行列互逆变换，化成若尔当Jordan矩阵
    A	→	J
    E		P
    
    
    
    */
    
    AtoStr=function(A){A.toStr=function(p){return Mtrx.toStr(this,p)}};
    /*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */
 
/*
	Integer 整数：字符串
		+-×^封闭
		÷ 数组[商,余数]
		^
	Decimal 有理小数：数组[整数字符串, 10的幂次, 循环节长度]
		
		+-×÷ 封闭
		
		^ 根数：数组




	Frac （有理）分数：数组[分子,分母]
	
		+-×÷ 封闭
		
		^ 根数：数组
		
	Root （有理元素）根数 (有理数的有理数幂次)：
				本质是二维数组：[(-1)^的有理幂次（默认0）,有理系数（默认1）,底数（正分数，默认1）,分数幂次（正分数，默认1）]
				本身是有理数，或 无理代数数
		
		×÷^（有理幂（分母奇数）） 封闭
		负数的^（有理幂（分母偶数）） 复数
		+- 代数数

		^（无理幂） 超越数
		

			
	Num 上述任意数：
		
	
	
*/
 
 
var Integer={/*整数 (本质是字符串)
	不直接支持 x,10的幂 这种写法（此时建议用Decimal.build.I）
	
	
	*/
	build:{//直接构造典型数列中的整数
		Mersenne:function(p,Mp){/*返回梅森数 参数p是素数	Mp指定返回双重梅森数：2^(2^p-1)-1
			
			*/
			
		},
		
		
		
		Prime:function(){//典型素数
			
			
		},
		
	},
	is:{//布尔逻辑
		b2:{//二元关系
			"=":function(a,b){
				return +(''+a==''+b)
			},
			"≠":function(a,b){
				return +(''+a!=''+b)
			},
			">":function(a,b){
				var A=''+a,B=''+b,n=A.length,m=B.length, aisNeg=A[0]=='-', bisNeg=B[0]=='-';
				if(A==B || aisNeg && !bisNeg || aisNeg && bisNeg && n>m || !aisNeg && !bisNeg && m>n){
					return 0
				}
				
				if(!aisNeg && bisNeg || aisNeg && bisNeg && m>n || !aisNeg && !bisNeg && n>m){
					return 1
				}

				for(var i=0;i<n;i++){
					if(A[i]!=B[i]){
						return aisNeg ^ (A[i]>B[i])	//异或
					}
				}

			},
			"≥":function(a,b){
				return +(''+a==''+b || Integer.is.b2['>'](a,b))
			},
			"<":function(a,b){
				return Integer.is.b2['>'](b,a)
			},
			"≤":function(a,b){
				return Integer.is.b2['≥'](b,a)
			},
			"|":function(a,b){/* a整除b
				
				位数相差不多时，可以用试除法，求余数
				否则尽量利用a的倍数的性质（充要条件）来判断
				
				454646545 78798

				*/
				var A=''+a,B=''+b,Al=A.length,Bl=B.length;
				if(B=='0' || A=='1' || A=='-1' || A==B){return 1}
				if(A=='0' || Integer.is.b2['<'](B,A)){return 0}
				
				if(A=='10'){return +(B.substr(-1)=='0')}//末位是0
				//console.log(A,B);
				if(/^10+$/.test(A)){return +/^0+$/.test(B.substr(1-A.length))}//末尾是连续的0

				if(A=='2'){return 1-(+B.substr(-1) % 2)}//末位是偶数
				if(A=='5'){return +/[05]/.test(B.substr(-1))}//末位是0或5

				if(A=='3' || A=='9'){return Bl==1?(A=='3'?/[369]/.test(B):/[9]/.test(B)):Integer.is.b2['|'](A,Integer.oprs('+',B.split('')))}//各位和是倍数 A=An*9...9+An-1*9...9+...A2*9 + (An+An-1+...+A1)
				if(A=='4' || A=='25'){return +B.substr(-2) % +A?0:1}//末两位数是倍数
				if(A=='8' || A=='125'){return +B.substr(-3) % +A?0:1}//末三位数是倍数


				if(A=='6'){return Integer.is.b2['|'](2,B) && Integer.is.b2['|'](3,B)}//
				
				if(Bl<10){return +B%(+A)?0:1}//被除数较小时，直接用JS取余数判断整除
				

/*
				
				方法1：奇数位（从左向右数）之和减去偶数位之和是倍数	A=An*9...9 + An-2*9...9 +  + ... +_A4A3_*99 +(An + An-2 + ... + A2) - ( An-1 + An-3 + ... + A1 )
				

*/
				if(/^10*1$/.test(A)){//
					var A0=A.replace(/1/g,'').length;
					return Integer.is.b2['|'](A, Integer.oprs('-',[B.substr(0,Bl-A0),B.substr(-A0)]))
					
				}


				if(/^1{2,}$/.test(A) || /^3{2,}$/.test(A)  || /^9{2,}$/.test(A) ){//重位数
					return Integer.is.b2['|'](A, Integer.oprs('+',ZLR(0,Integer.oprs('/',[Bl,Al])[1])+B).split(new RegExp('\\d{'+Al+'}','g')))
				}



			},
		},
		b1:{//一元关系
			'0':function(n){//
				return +(n[0]=='0')
			},
			'+':function(n){//是正数
				return +(n[0]!='0' && n[0]!='-')
			},
			'-':function(n){//是负数
				return +(n[0]=='-')
			},
			'2n+1':function(n){//是奇数
				return +/[^02468]$/.test(n)
			},
			'2n':function(n){//是偶数
				return +/[02468]$/.test(n)
			},
			'prime':function(n){/*
				方法1：检验√n以内的所有质数，是否整除n
				
				
				*/
				
				
			}
		}
	},
	fromStr:function(s){
		if(/^-?\d+$/.test(s)){
			return ''+s
		}
		return undefined
	},
	toStr:function(n,typ){//转成文本
		/* 
			typ数字类型
				整数 （默认）
				. 小数
				, 每3位数字一个逗号分隔符
				%‰‱ 百(千万)分数
				/ 分数
				一 中文小写
				一元 中文货币小写
				壹圆	中文货币大写
				10	科学计数法
				1000 工程计数法
		*/
		return typ?Decimal.toStr([n,0], typ):n+'';
	},

	opr1:function(op,n,p){//一元运算	p是参数
		var a=''+n,l=a.length,aisNeg=a[0]=='-';
		if(op=='-' || op=='+'){/*	相反数		绝对值
			*/
			return aisNeg?a.substr(1):(op=='+'?'':'-')+a
		}

		if(op=='进制'){/*	10进制转p进制
			返回数组，而不是字符串，是为了表示高进制（10个数字+26个字母，此时不够用）
			
			JS 最多支持32进制,	另外	JS中2的幂，Math.pow(2,54) 再高次幂就失真了
			*/
			var b=''+p,A=[];
			while(Integer.is.b2['≥'](a,b)){
				
				var B=Integer.oprs('/',[a,b]);//得到余数
				////console.log(a,b,A,B);
				A.unshift(B[1]);
				a=B[0]
			}
			A.unshift(a);
			if(aisNeg){A.unshift('-')}
			return A
		}
		if(op=='因式分解'){//	【只考虑正数】
			
			
		}
		if(op=='*0~9'){//一次性获得a的0～9倍，得到数组 【只考虑自然数】
			if(a=='0'){
				return copyA('0',10)//ZLR(0,10).split('')
			}
			if(/^10*$/.test(a)){
				return [0].concat(zlrA2(seqsA('1~9'),ZLR(0,l-1)))
			}
			return ['0'].concat(Arrf(function(t){return Integer.oprs('+',[t,a])},['0'].concat(Array(8)),'cp1'))

		}
		if(op=='^2'){//求平方	【只考虑自然数】
			/*平方尾数
				
				1 1	1 1 1
				2 4	6 6 6
				3 9 1 1 1
				4 6 6 6 6
				5 5 5 5 5
				6 6 6 6 6
				7 9 1 1 1
				8 4 6 6 6
				9 1 1 1 1
				
				3个吸引子
					2,8 4 6 6 6	偶数最终到6
					3,7	9 1 1 1 奇数（5除外）最终到1
					5	  5	5 5 奇数5最终到5
				
			a^(2^m) m>=2时，尾数只能是0,1，5，6
			
				立方尾数
				1 1	1
				2 8	2
				3 7	3
				4 4	4
				5 5 5
				6 6 6
				7 3 7
				8 2 8
				9 9 9
				
				1 ... 1
				2 8 2 8 ...
				3 7 3 7 ...
				4 ... 4
				5 ... 5
				6 ... 6
				9 ... 9
			
				4方尾数（参见平方尾数）
					奇数（5除外）最终到1
					奇数5最终到5
					偶数最终到6
				
				5方尾数
					到自身
				
				6方尾数（同平方尾数）

				1 1	1
				2 4	6
				3 9	1
				4 6	6
				5 5 5
				6 6 6
				7 9 1
				8 4 6
				9 1 1
				
				7方尾数（同立方尾数）

			
			*/
			if(a=='0' || a=='1'){return a}
			
			if(/^10*1$/.test(a)){//(10^t+1)^2=10^2t+2*10^t+1
				return a.replace(/1$/,a.replace('1','2'))
			}
			if(/^9+$/.test(a)){//(10^t-1)^2=10^2t-2*10^t+1
				return a.replace(/9$/,8+ZLR(0,l-1)+1)
			}
			if(/^10*2$/.test(a)){//(10^t+2)^2=10^2t+2*2*10^t+4
				return a.replace(/2$/,a.replace('1',4).replace(2,4))
			}
			if(/^9+8$/.test(a)){//(10^t-2)^2=10^2t-2*2*10^t+4
				return a.replace(/9$/,6+ZLR(0,l-1)+4)
			}
			if(/^10*3$/.test(a)){//(10^t+3)^2=10^2t+2*3*10^t+9
				return a.replace(/3$/,a.replace('1',6).replace(3,9))
			}
			if(/^9+7$/.test(a)){//(10^t-3)^2=10^2t-2*3*10^t+9	继续推广有难度，因为二项式展开，最后一项已经不是个位数了。
				return a.replace(/9$/,4+ZLR(0,l-1)+9)
			}
			
			return Integer.oprs('*',[a,a]);
			
		}
		if(op=='^3'){/*求立方	【只考虑自然数】
			
			立方尾数
				1 1	1
				2 8	2
				3 7	3
				4 4	4
				5 5 5
				6 6 6
				7 3 7
				8 2 8
				9 9 9
				
				1 ... 1
				2 8 2 8 ...
				3 7 3 7 ...
				4 ... 4
				5 ... 5
				6 ... 6
				9 ... 9
			
			*/
			if(a=='0' || a=='1'){return a}
			

			
			return Integer.oprs('*',[Integer.opr1('^2',a),a]);
			
		}
		if(op=='^1/2'){/*求开平方（向下取整）
			*/
			if(a=='0' || a=='1'){return a}
			
			//(10^t+[123])^2=10^2t+2[123]*10^t+[123]^2
			if(a=='121' || /^1(0*)2\1[1]$/.test(a)){
				return a.replace(/2.+$/,'1')
			}
			if(a=='141' || /^1(0*)4\1[4]$/.test(a)){
				return a.replace(/4.+$/,'2')
			}
			if(a=='161' || /^1(0*)6\1[9]$/.test(a)){
				return a.replace(/6.+$/,'3')
			}
			//(10^t-[123])^2=10^2t-2[123]*10^t+[123]^2
			if(/^9*80*1$/.test(a) && a.indexOf('8')==l/2-1){
				return ZLR(9,l/2)
			}
			if(/^9*60*4$/.test(a) && a.indexOf('6')==l/2-1){
				return ZLR(9,l/2-1)+'8'
			}
			if(/^9*40*9$/.test(a) && a.indexOf('4')==l/2-1){
				return ZLR(9,l/2-1)+'7'
			}

			/*
				a=b*10^2t
				√a = √b *10^t
				21334345323534534 ≈ 前15位 * 10^(l-15)
				a=a1* 10^(l-15) + a2*10^(l-30) + a3*10^(l-45)
				
				每15位一截，利用不等式，进行求近似值：
				 |√a-√b| = √(a+b-2√ab) <√(a+b) < √(a+b+2√ab) = √a+√b
			*/
			return Integer.oprs('*',[a,a]);
			
		}
		
		
		if(op=='数根'){/*求数根 digital root 反复求各位数之和，迭代到结果为个位数为止时的数	【只考虑自然数】
			参数p，返回数组[最终结果，中间结果数组]
			*/
			var A=['',[]];
			while(l>1){
				a=Integer.oprs('+',a.split(''));
				l=a.length;
				if(p){//计算过程
					A[1].push(a);
					//console.log(A[1])
				}
			}
			if(p){
				A[0]=a;
				//console.log(A);
				return A
			}else{
				return a
			}
			
		}
		
	},
	
	oprs:function(op,arr,p){//多元运算	p是参数
	//op 可以是单个运算符，也可以是同级运算符数组
		var aA=arr.join().split(','),al=aA.length, aA0=aA[0],aA1=aA[1];
		if(al<2){
			return aA0
		}
		var aisNeg=aA0[0]=='-', bisNeg=aA1[0]=='-', islastNeg=aA[al-1][0]=='-', negCnt=aA.filter(function(t){return t[0]=='-'}).length;

		if(isArr(op)){//op是数组时，依次执行（这里不考虑正负数先抵消的优化，Mfn中才考虑）
			var x=aA0;
			for(var i=1;i<al;i++){
				x=Integer.oprs(op[i-1],[x,aA[i]])
			}
			return x
		}

		if(op=='+'){//加法

			if(al>2){/*	暂不实现算法：参数p是策略：按顺序（默认），'加减分离', ''，
			而是死算
				*/
				return Integer.oprs('+',[Integer.oprs('+',aA.slice(0,al-1)),aA[al-1]])
			}

			if(aA0=='0'){
				return aA1
			}
			if(aA1=='0'){
				return aA0
			}
			
			if(aisNeg && bisNeg){
				return '-'+Integer.oprs('+',[aA0.substr(1),aA1.substr(1)])
			}else if(aisNeg ^ bisNeg){
				return Integer.oprs('-',[aA[+aisNeg],aA[+bisNeg].substr(1)])
			}
			
			//下面算法仅支持两个正数相加
			
			if(BigInt){
				return BigInt(aA0)+BigInt(aA1)+''
			}

			var agb=Integer.is.b2['>'](aA0,aA1),a=agb?aA0:aA1,b=agb?aA1:aA0,al=a.length,bl=b.length,A=a.split('');
////console.log(a+' + '+b+' = ?');
			for(var i=0;i<bl;i++){
				var bi=+b[bl-i-1],ai=al-i-1;
				
				if(bi){
					var si=bi+(+A[ai]);
					//	//console.log('si='+si);
					if(si>9){

						A[ai]=(''+si).substr(-1);
						if(i==bl-1){
							
							if(ai<1){
						//		//console.log('已经到达b的第1位，且a也达到第1位 '+a+' + '+b+' = ' +(''+si)[0]+A.join(''));
								return (''+si)[0]+A.join('')
							}

							return Integer.oprs('+',[A.slice(0,ai).join(''),(''+si)[0]])+A.slice(ai).join('')
						//	return Integer.oprs('+',[A.slice(0,ai).join(''),(''+si).substr(0,(''+si).length-1)])+A.slice(ai).join('')
						}else{
							var ai1=+A[ai-1]+(+(''+si)[0]);
						//	//console.log('前一位' + A[ai-1]+ ' + '+(''+si)[0] + ' == '+ai1);
							if(ai1>9){
////console.log('ai1 = '+ai1+' 替换前2位，A[ai-2]为'+(+A[ai-2]+(+(''+ai1)[0])));
								return Integer.oprs('+',[A.slice(0,ai).join(''),(''+si)[0],b.substr(0,bl-i-1)])+A.slice(ai).join('')

							}else{
								A[ai-1]=ai1;
							}

						}
						
					}else{
						////console.log('si<9 直接替换A[ai] '+ A[ai]+' -> '+si);
						A[ai]=si;
					}
				}
			}

	//		//console.log(a+' + '+b+' = ' +A.join(''));
			return A.join('')

		}
		if(op=='-'){//减法	暂不考虑al>2
			
			if(BigInt){
				return BigInt(aA0)-BigInt(aA1)+''
			}
			if(aA0==aA1){return '0'}
			var agb=Integer.is.b2['>'](aA0,aA1);

			if(!aisNeg && bisNeg){return Integer.oprs('+',[aA0,aA1.substr(1)])}	//+ -
			if(!aisNeg && !bisNeg && !agb){return '-'+Integer.oprs('-',[aA1,aA0])}	//+ < +
			if(aisNeg && !bisNeg){return '-'+Integer.oprs('+',[aA0.substr(1),aA1])}	//- +
			if(aisNeg && bisNeg && !agb){return '-'+Integer.oprs('-',[aA0.substr(1),aA1.substr(1)])}	//- < -
			if(aisNeg && bisNeg && agb){return Integer.oprs('-',[aA1.substr(1),aA0.substr(1)])}	//- > -


			var a=aA0,b=aA1,al=a.length,bl=b.length,A=a.split('');

			for(var i=0;i<bl;i++){
				var bi=+b[bl-i-1];
						////console.log(bi);
				if(bi){
					var si=+A[al-i-1]-bi;
					
					////console.log(bi,si);
					if(si<0){
					//	//console.log(si);
						si+=10;
						A[al-i-1]=si;
						////console.log(si);
						////console.log(A.slice(al-i-1).join(''));
						if(i==bl-1){
							return Integer.oprs('-',[A.slice(0,al-i-1).join(''),'1']).replace(/^0+/,'')+A.slice(al-i-1).join('')
						}else{
							return Integer.oprs('-',[A.slice(0,al-i-1).join(''),Integer.oprs('+',[b.slice(0,bl-i-1),'1'])]).replace(/^0+/,'')+A.slice(al-i-1).join('')
						}
						
					}else{
						A[al-i-1]=si;
					}
				}
			}
		//	//console.log('- ',A);
			return A.join('').replace(/^0+/,'')

		}
		if(op=='*1'){//仅计算乘数b是个位数的情况，仅限2元运算	【只考虑非负数a】
			
			if(BigInt){
				return BigInt(aA0)*BigInt(aA1)+''
			}

			var b=+aA[1];
			if(!b){
				return '0'
			}
			var n=aA0.length,A=aA0.split(''),B=new Array(n);

			for(var i=0;i<n;i++){
				var ai=+A[n-i-1];

				////console.log('A='+A);
				var si=b*ai;
				if(B[n-i-1]){
					si+=B[n-i-1];
				}
				
				if(si>9){
					if(i==n-1){
						////console.log(A);
						return si+A.slice(1).join('')
					}else{
						////console.log(si,A);
						A[n-i-1]=(''+si).substr(-1);
						////console.log('A ='+A);
						B[n-i-2]=+(''+si)[0];
						////console.log(B[n-i-2]);
						////console.log(' A='+A);
							
					}
					
				}else{
					A[n-i-1]=si;
				}

			}
			return A.join('')

		}

		if(op=='*'){//乘法
			if(aA.indexOf('0')>-1){return '0'}
			if(al>2){

				return Integer.oprs('*',[Integer.oprs('*',aA.slice(0,al-1)),aA[al-1]])	//左结合
				//return Integer.oprs('*',[aA0,Integer.oprs('*',aA.slice(1))])	//右结合
			}

			if(BigInt){
				if(/[a-z]/.test(aA0)||/[a-z]/.test(aA1)){
					return aA0+''+aA1
				}
				return BigInt(aA0)*BigInt(aA1)+''
			}


			if(aisNeg || bisNeg){return (aisNeg && bisNeg?'':'-')+Integer.oprs('*',[aisNeg?aA0.substr(1):aA0, bisNeg?aA1.substr(1):aA1])}

			var n0=aA0.length,n1=aA1.length,m0=aA0.match(/[^0]/g).length,m1=aA1.match(/[^0]/g).length,
				a=m0>m1?aA0:aA1,b=m0>m1?aA1:aA0,an=a.length,bn=b.length,A=[],B=Integer.opr1('*0~9',a);

			for(var i=0;i<bn;i++){
				var bi=+b[bn-i-1];
				if(bi){
					A.push(B[bi]+ZLR(0,i));//计算被乘数与单个数字的乘积，并补充末0
					//A.unshift(Integer.oprs('*1',[a,bi+''])+ZLR(0,i))

				}
			}

			return Integer.oprs('+',A)
		}
		
		
		if(op=='/'){/*返回数组[商,余数]，仅限2元运算
			
			带余除法 a=  b   p  +   r
					 a=(-b)(-p) +   r
					-a=  b (-p) + (-r)
					-a=(-b)  p  + (-r)
					
					与JS中运算符%规则一致
			
			*/
			var a=aA0,b=aA1;
			if(b=='1' || b=='0'){return [a,'0']}	//除数为0时，认为是1
			if(a==b){return ['1','0']}
			if(negCnt){
			//	//console.log(a,b,aisNeg?a.substr(1):a, bisNeg?b.substr(1):b);
				var A=Integer.oprs('/',[aisNeg?a.substr(1):a, bisNeg?b.substr(1):b]);
				return [(negCnt>1 || a[0]=='0'?'':'-')+a[0],(!aisNeg && bisNeg?'':'-')+a[1]]
			}

			if(Integer.is.b2['<'](a,b)){return ['0',a]}

			
			if(BigInt){
				return [BigInt(aA0)/BigInt(aA1)+'',BigInt(aA0) % BigInt(aA1)+'']
			}



			var n0=a.length,n1=b.length,q='',a0=a.substr(0,n1),bI=[];
			/*
				方法1【累减法】：被除数减去除数（减法若干次，次数是商），直至余数小于除数
				方法2【试商法】：被除数减去除数的倍数（0～9倍），得到商的各位数字（各位最多做乘法9次+1次减法，迭代次数是商的位数）和最终余数
			*/
			for(var i=1;i<10;i++){
				bI.push(Integer.oprs('*1',[b,i]));
			}
			for(var i=n1;i<n0+1;i++){
				////console.log(i,n0+1);//Integer.oprs('/',['1232402135','10334302'])
				if(Integer.is.b2['>'](b,a0)){
					if(q){q+='0'}
				}else{
					var a0n=a0.length;
					
					for(var j=9;j>0;j--){
						var bj=bI[j-1];
						//	//console.log('j='+j+', bj='+bj);
						if(bj==a0){
							q+=j;
							a0='';
						//	//console.log('bj==a0, q='+q+', a0='+a0);
							break;
						}
						if(Integer.is.b2['<'](bj,a0)){
							q+=j;
						//	//console.log(a0,bj);
							a0=Integer.oprs('-',[a0,bj]);
						//	//console.log('bj<a0  q='+q+', a0='+a0);
							break;
						}
					}
				}
			//	//console.log(i,a[i-1],n0);
				if(i==n0){
					return [q,a0||'0']
				}

				if(a0=='0'){
					a0=a[i]
				}else{
					a0+=a[i];
				}
			//	//console.log(i,'a0='+a0);
			}

		}

		if(op=='^p'){/* a^p = a^b 素数p次幂（p>2）
			
			p=q+1 ，对q进行因式分解求幂
			p=s1^k1 * s2^k2 * s3^k3 + t1^j1
			
			算法：对于p=2，直接算平方
			对于其他素数p，用a的p-1次幂，乘以a
			
			*/

			if(BigInt){
				return BigInt(aA0) ** BigInt(aA1)+''
			}

			var b=aA1;
			if(b=='2'){
				//return Integer.oprs('2^',[aA0,aA1])
				return Integer.oprs('*',[aA0,aA0])
			}
			return Integer.oprs('*',[Integer.oprs('^',[aA0,Integer.oprs('-',[b,1])]),aA0])

		}
		if(op=='^'){/*幂		【仅考虑幂是自然数的情况】
			从a,a^2开始，迭代求幂
			迭代函数：
				f(x)=x*x
				f(x)=x*a
				f(x)=x*a^2
				f(x)=x*a^i（i是已计算出的幂）
				
				b是2的n次幂时，a^b=a^(2^n)=(...((a^2)^2)^2...)^2 至少做n次乘法（平方）
				b是2^n+1时，至少做n+1次乘法
				b是2^n+2时，至少做n+1次乘法
				b是2^n+2+1时，至少做n+2次乘法(a^3未知时)，做n+1次乘法(a^3已知时)
				b是2^n+2^2时，至少做n+1次乘法
				b是2^n+2^2+1时，至少做n+2次乘法
				b是2^n+2^2+2时，至少做n+2次乘法
				b是2^n+2^2+2+1时，至少做n+3次乘法
				b是2^n+2^3时，至少做n+1次乘法
				b是2^n+2^3+1时，至少做n+2次乘法
				
				b转成2进制，至少做（取第1位1对应的2的幂次k + 其余1的个数，介于k~2k之间）次乘法,
				但这种乘法次数不一定是最少的，事实上，可以对b做因式分解，15=3*5 2+3（因式分解方法）<6（二进制方法）	15二进制2^3+2^2+2+1
				
				b因式分解：f1f2...fk (((b)^f1)^f2)^f3... 共需乘法f1+f2+f3+..+fk - k次
					由于xy-1 > x-1 + y-1 (因为(x-1)(y-1)>0) 因此因式分解越细越好
					
					
			*/
			var a=aA0,b=aA1;
			if(a=='0'){return '0'}//这里不考虑0的0次幂
			if(a=='1'){return '1'}
			if(b=='0'){return '1'}
			if(b=='1'){return a}

			if(aA.indexOf('0')>-1){return Integer.oprs('^',aA.slice(0,aA.indexOf('0')-1))}
			if(aA.indexOf('1')>-1){return Integer.oprs('^',aA.slice(0,aA.indexOf('1')))}

			
		//	if(al==1){return aA0}	可省略
			if(al>2){
				return Integer.oprs('^',aA.slice(0,al-2).concat(Integer.oprs('^',aA.slice(al-2))))
			}
			
			if(a[0]=='-'){
				var evenb=/[02468]$/.test(b);
				return (evenb?'':'-')+Integer.oprs('^',[a.substr(1),b])
			}
/*
			if(/^10+$/.test(a)){//10的b次幂			下面用+b，默认为幂次不会很高，否则结果太大，计算不了
				return '1'+ZLR(0,(+b)*(a.length-1));
			}
*/
			if(/0+$/.test(a)){//末尾含0的b次幂
				return Integer.oprs('^',[a.replace(/0+$/,''),b])+ZLR(0,(+b)*(a.length-a.replace(/0+$/,'').length));
			}
			
//			//console.log(b);
			if(b=='2'){
				return Integer.oprs('*',[a,a]);
			}


			if(BigInt){
				return BigInt(aA0) ** BigInt(aA1)+''
			}

			var f=(''+factor(b)).split('×'),fl=f.length,x=a;
			//console.log('aA = ',aA);
			//console.log(f, b, factor(b));

			for(var i=0;i<fl;i++){
				x=Integer.oprs('^p',[x,f[i]])
			}
			
			return x
		}
		if(op=='2^'){/*	a^(2^b) 反复求平方	（迭代平方b次）
				当a=2时，结果是费马数-1
			
				目前已知最大的梅森素数M49 = 2^74207281-1 约等于2^(2^26.14505741099363)-1	位数有22,338,618
				

				
				计算极限： Integer.oprs('2^',[2,13]).length 2467	部分电脑上b是13即不可算出结果，出现 Uncaught RangeError: Maximum call stack size exceeded(…)
											[3,13]	.length 3909
											[4~14,11].length -28681-
											[248,10].length 
											Integer.oprs('2^',[179,5]).length ----74 Integer.oprs('2^',[181,5]).length 83 也异常
				
			*/
			var a=aA0,b=aA1;
			if(a=='0' || a=='1' || b=='0'){return a}
			if(/^10+$/.test(a)){
				return '1'+ZLR(0,Integer.oprs('*',[Integer.oprs('^',[2,b]),a.length-1]));
				
			}
			
	

			while(b!='0'){
				//a=Integer.opr1('^2',a);
				a=Integer.oprs('*',[a,a]);
				////console.log(b+ ' !!! '+a);
				b=Integer.oprs('-',[b,1]);
			}
			
			return a
			//return Arrf(function(t){return Integer.opr1('^2',t)},new Array(b),'cp1')	//返回每一次求平方的结果 数组
		}
		
		if(op=='%'){/*	a%b 求余数
			算法：
			比较长度：a小，则返回a
			用数论方法判断是否a/b 整除及余数
			
			
			*/
			if(BigInt){
				return BigInt(aA0) % BigInt(aA1)+''
			}
			return (+aA0) % (+aA1)+''
		}
		if(op=='^%'){/*	a^b mod p 求幂余数		仅限2元运算
			p是素数情况下，
				a^p≡a (mod p) 
				a^(p-1)≡1 (mod p) 费马小定理
				
				a^b≡a^(k(p-1)+t)≡a^(1+t) (mod p) 
			*/
			var a=aA0,b=aA1;
			if(a=='0' || a=='1'){return a}
			if( b=='0'){return '1'}


			if(isPrime(p)){
				if(b==p){
					return Integer.oprs('%',[a,p])
				}
				if(b==Integer.oprs('-',[p,1])){
					return '1'
				}
				//if(Integer.is.b2['>'](b,p-1)){
				b=Integer.oprs('%',[b,Integer.oprs('-',[p,1])]);
				return Integer.oprs('^%',[a,Integer.oprs('+',[b,1])],p)

			}else{

				Integer.oprs('%',[Integer.oprs('^',[a,b]),p]);
			}

		}

		if(op=='^/'){/*返回幂余数组 [幂次k, 系数c]	a=cb^k 		[k,c]		仅限（正整数）2元运算
			a<b 或者 a中不含因子b(不能被b整除)	a=ab^0	返回[0,a]
			a=b 								a=1b^1	返回[1,1]
			a=b^k 								a=1b^k	返回[k,1]
			
			ln a = ln c + k ln b	类似于除法
			*/
			var a=aA0,b=aA1,r=1,k=0;
			while(r){
				var qr=Integer.oprs('/',[a,b]);
				if(qr[1]=='0'){
					a=qr[0];
					k=Integer.oprs('+',[k,1]);
				}else{
					break
				}
			}
			return [k,a]
		}
	}



}, Decimal={/*小数(有理数，分数)		本质是数组：[整数(不含尾0), 尾0数（负数）, 循环节长度]


有限小数（化成最简分数时，分母没有2、5之外的因数）	除法不封闭
无限小数（无限循环小数化成最简分数时，分母有2、5之外的因数，无限不循环是无理数）


	*/
	build:{
		I:function(t,b){//长整数（本质是数组）t是数字串， b是进制（默认为空，是10）
			var s=''+((b||10) == 10?t:parseInt(t,b));
			s=s.replace(/^-0$/,0);
			var i=''+(s.replace(/0+$/,'')||0), A=[i,i=='0'?0:s.replace(/.*[^0]/,'').length,0];
			A.type='Decimal';A.toStr=function(p){return Decimal.toStr(this,p)};
			return A
		},
		D:function(t,m,len){//小数（本质是数组）t是数字串（可以含小数点，或者百分号等后缀）， m是后缀10的幂次 %(-2)‰(-3)‱(-4) len是循环节长度
			//t中可以含2个小数点（此时是无限循环小数的写法，例如：0.13.3），其中第2个小数点后数字表示循环节
			var s=(''+t).replace(/[%‰‱]$/,''),d=+m||0;
			
			if(s.split('.').length>2){//含2个小数点
				return Decimal.build.D(s.replace(/\.\d+$/,''),0,s.split('.')[2].length)
				
			}
			
			
			
			if(/\./.test(s)){
				s=s.replace(/0+$/,'');
				d+=-s.split('.')[1].length;
				s=s.replace('.','').replace(/^([-]?)0+/,'$1');
			}
			//console.log(s,d);
			if(/[%‰‱]$/.test(t)){
				d-='01%‰‱'.indexOf((''+t).substr(-1));
			}
			var i=''+(s.replace(/0+$/,'')||0), A=[i,i=='0'?0:d+(s.match(/0+$/)||[''])[0].length,len||0];
			A.type='Decimal';A.toStr=function(p){return Decimal.toStr(this,p)};
			return A
		},
		'10':function(t){//t是科学计数法字符串	Decimal.build['10']('-2.8×10^(-3)')
			return Decimal.build.D(t.replace(/×10\^.+/,''), /×10\^/.test(t)?wrapTrim(t.replace(/.+×10\^/,'')):0)
		},
		F:function(t){//t是分数字符串a/b或数组	化成小数对象
			var s=''+t;
			if(/[\/,]/.test(s)){
				return Frac.opr1('.',s.split(/[\/,]/))

			}else{
				return Decimal.build.I(s)
			}

		},


		JS:function(t){//JS表达式，得到有限小数（精度不可控！）
			return Decimal.build.D(eval(t))
		}
	},
	is:{//布尔逻辑
		b2:{//二元关系
			"=":function(A,B){
				return +(A.join()==B.join())
			},
			"≠":function(A,B){
				return +(A.join()!=B.join())
			},
			">":function(A,B){
				return Frac.is.b2['>'](Frac.build.D(A),Frac.build.D(B))
			},
			"≥":function(A,B){
				return Frac.is.b2['≥'](Frac.build.D(A),Frac.build.D(B))
			},
			"<":function(A,B){
				return Frac.is.b2['<'](Frac.build.D(A),Frac.build.D(B))
			},
			"≤":function(A,B){
				return Frac.is.b2['≤'](Frac.build.D(A),Frac.build.D(B))
			},
		},
		b1:{//一元关系
			"1":function(A){return +(+A[0]==1 && A[1]==0 && A[2]==0)},
			"0":function(A){return +(+A[0]==0)},
			"+":function(A){return +(+A[0]!=0 && (A[0]+'')[0]!='-')},
			"-":function(A){return +((A[0]+'')[0]=='-')},
			".":function(A){return +(A[1]<0)},
			"Z":function(A){return +(A[1]>=0)},//整数
			"N":function(A){return +((A[0]+'')[0]!='-' && A[1]>=0 )},//自然数
			"+Z":function(A){return +(+A[0]!=0 && (A[0]+'')[0]!='-' && A[1]>=0)},//正整数
			"-Z":function(A){return +((A[0]+'')[0]=='-' && A[1]>=0 )},//负整数

		}
	},
	fromStr:function(s){
		if(/^-?\d+$/.test(s)){
			return Decimal.build.I(s)
		}
		if(/^-?[\d\.]+[%‰‱]?$/.test(s)){//含百分号、无限循环小数、有限小数等情况
			return Decimal.build.D(s)
		}
		if(/^-?[\d\.]+×10\^.+$/.test(s)){
			return Decimal.build['10'](s)
		}
		if(/^-?\d+[/]\d+$/.test(s)){
			return Decimal.build.F(s)
		}
		return undefined
	},
	toStr:function(A,typ){//转成文本
		/* typ数字类型
				. 小数 （默认）
				, 每3位数字一个逗号分隔符
				%‰‱ 百(千万)分数
				/ 分数
				一 中文小写
				一元 中文货币小写
				壹圆	中文货币大写
				10	科学计数法
				1000 工程计数法
		*/
		var type=typ||'.',str=A[0]+'',d=A[1],I=str.replace(/^-/,'').length,isNeg=str[0]=='-';
		if(type=='/'){
			str=Frac.toStr(Frac.build.D(A))
				
		}else if(type=='10'){
			str=(I>1?str.replace(/\d/,'$&.'):str)+(str.substr(-1)=='1' && d==1?'0':(I==1 && d || I>1?'×10'+(d+I-1?'^'+(d+I-1):'').replace(/\^1$/,''):''))

			
		}else if(type=='1000'){
			if(I<4 && d%3==0){
				str+=d?'×10^'+(d):''
			}else{
				str=str.replace(new RegExp('\\d{'+(I-(I+d)%3+(I+d<0?-3:0))+'}$'),'.$&')+'×10^'+(I+d-(I+d)%3+(I+d<0?-3:0))
			}
			str=str.replace(/^-\./,'-0.').replace(/^\./,'0.');
			
		}else{
		
			if(/[%‰‱]/.test(type)){
				d+='%‰‱'.indexOf(type)+2;
			}

			if(d){
				if(d>0){
					str+=ZLR(0,d)
				}else if(I>-d){
					str=str.replace(new RegExp('\\d{'+(-d)+'}$'),'.$&')
				}else{
					str=(isNeg?'-':'')+'0.'+ZLR(0,-d-I)+(isNeg?str.substr(1):str)
				}
			}
			if(type==','){
				str=str.replace(/^[^\.]+/,function(t){return t.split('').reverse().join('').replace(/\d{3}/g,'$&,').split('').reverse().join('').replace(/^,/,'').replace(/-,/,'-')})
					.replace(/\..+/,function(t){return t.replace(/\d{3}/g,'$&,').replace(/,$/,'')})
			}

			if(/[%‰‱]/.test(type)){
				str+=type
			}
			if(type=='一'){
				str=n2Zh(str)
			}
			if(type=='一元'){
				str=n2Zh(str,0,1)
			}
			if(type=='壹圆'){
				str=n2Zh(str,1,1)
			}
			
			if(A[2]){//循环节长度
				//console.log(str,A[2]);
				str=str.replace(new RegExp('(\\d\\.?){'+A[2]+'}$'),function(x){return x.replace(/\d/,'\\dot$&').replace(/(\d.*)(\d)$/,'$1\\dot$2')})
			}
		}
		return str

	},
	opr1:function(op,arr,p){//一元运算	p是参数
		var A=[].concat(arr),str=A[0],d=A[1],I=str.replace(/^-/,'').length,isNeg=str[0]=='-';
		A.type='Decimal';
		if(op=='-'){//相反数
			if(A[0][0]!='0'){
				A[0]=A[0][0]=='-'?A[0].substr(1):'-'+A[0];
			}
			return A
		}
		if(op=='/'){//小数化既约分数（数组）
			return Frac.build.D(A)
		}
		
		if(op=='I'){//取整	参数p：u(p)向上 d(own)向下 t(runc)截取 r(ound)四舍五入
			if(d<0){
				if(I<=-d){
					if(p=='u'){A=[''+(+!isNeg),0,0]}
					if(p=='d'){A=[(isNeg?'-':'')+(+isNeg),0,0]}
					if(p=='t'){A=['0',0,0]}
					if(p=='r'){A=[(isNeg?'-':'')+(+(+str[+isNeg]>4)),0,0]}
					A.type='Decimal';
				}else{
					if(p=='u'){A=Decimal.oprs('+',[Decimal.build.D(str.substr(0,I+d)),[''+(+!isNeg),0]])}
					if(p=='d'){A=Decimal.oprs('-',[Decimal.build.D(str.substr(0,I+d)),[''+(+isNeg),0]])}
					if(p=='t'){A=Decimal.build.D(str.substr(0,I+d+(+isNeg)))}
					if(p=='r'){A=Decimal.oprs('+',Decimal.build.D(str.substr(0,I+d+(+isNeg))),[(+(+str.substr(d+1)>4))*(isNeg?-1:1),0])}
				}
				
			}
			return A
		}
		if(op=='d'){//取小数
			if(d<0){
				if(I>-d){
					A[0]=Decimal.build.D(str.substr(d),d)
				}
			}else{
				A=['0',0,0];
				A.type='Decimal';
			}
			return A
		}
		
		if(op=='r_0'){//四舍五入（不强制保留小数中尾0）	得到数组，	参数	p是小数位数（负数表示取整百整千...）
			//console.log('小数位数 p=',p,' 原来小数点d在',d,'p+d+1= ',p+d+1);

			if(p+d+1<=0){//-p>=d+1
				var I0=str.replace(/^-/,'').substr(0,I+p+d+1);
				if(I0.length<p+1){
					I0='0'.repeat(p+1-I0.length)+I0;
				}
//console.log('I0 = ',I0,'-p= ',-p)
				if(/[5-9]$/.test(I0)){
					I0=Integer.oprs('+',[I0.substr(0,I0.length-1),1]);
					if(I0.length<p+1){
						I0='0'.repeat(p+1-I0.length)+I0;
					}
				}else{
					I0=I0.substr(0,I0.length-1)
					
				}
				A=Decimal.build.D((isNeg?'-':'')+I0, -p)
				
				
			}else{//-p<d+1	p+d+1>0
				
			}
			
			return A
		}
		if(op=='r'){//四舍五入（强制保留小数中尾0）	返回字符串		参数	p是小数位数（负数表示取整百整千...）
			A=Decimal.toStr(Decimal.opr1('r_0',A,p));
			if(/\./.test(A) && p>A.split('.')[1].length){
				A+='0'.repeat(p-A.split('.')[1].length)
			}
			if(p && (!/\./.test(A) || p>A.split('.')[1].length)){
				if(/\./.test(A)){
					A+='0'.repeat(p-A.split('.')[1].length)
				
				}else{
					A+='.'+'0'.repeat(p)
				}
			}
			
			return A
		}
		
		
	},
	
	oprs:function(op,arrA,p){//多元运算	p是参数
		var aA=[].concat(arrA),al=aA.length, t;
		if(!(aA[0] instanceof Array)){
			aA=Arrf(Decimal.build.D,aA);
		}
		

		if(op=='竖式'){// 此时arrA是算式，字符串
			t=opreplace0(opreplace(arrA),1);
			var sep=t.match(/[\+\-\*\/]/);
			if(sep){
				
				return Decimal.oprs('竖式'+sep[0], t.split(sep))
			}
			return t
		}

		if(/竖式[\+-]/.test(op)){//参数p：+或-，支持二元以上同一种运算（但不支持+-混合）

//console.log(aA.join(brn),al);
			var p0=p || op.slice(-1)[0];
			aA.push(Decimal.oprs(p0,aA));
			aA=Arrf(Decimal.toStr,aA);
//console.log(aA.join(brn),al);
			t=aA.slice(0,al).join(p0)+'='+aA[al];
			Arrf(function(x,i){aA[i]=(''+x).split('.')},aA);
//console.log(aA.join(';'),max(Arri(aA,0)),max(Arri(aA,1)));

			var nl=(''+max(Arri(aA,0))).length,nr=(''+max(Arri(aA,1))).length;
//console.log(aA.join(brn), nl, nr);
			Arrf(function(x,i){
				x[0]=hp().repeat(Math.abs(nl-(''+x[0]).length))+x[0];
				if(!x[1]){
					x[1]=x[0]+hp('.'+'0'.repeat(nr))
					x[0]='';
				}else{
					x[1]+=nr-(''+x[1]).length?hp('0'.repeat(nr-(''+x[1]).length)):'';
					x[1]=x.join('.');
					x[0]='';
				}
				
			},aA);
			aA[al-1][0]=p0;
//console.log(aA.join(brn),al);
			return [mtrx(aA,'.','.','','I'+al),t,''].join(kbr+'\\widetilde{'+'~'.repeat(27)+'}'+kbr);
		}
		if(op=='竖式*'){//二元
			
			/* 测试用例：
$Decimal.oprs('竖式*',[1.234,20.15])$

$Decimal.oprs('竖式*',[0.002,20.15])$

$Decimal.oprs('竖式*',[0.002,0.01])$

$Decimal.oprs('竖式*',[0.002,300])$
*/

			//console.log(aA.join('; '));
			var a=aA[0][0],b=aA[1][0], bl=b.length, nr0=max([aA[0][1], aA[1][1], aA[0][1]+aA[1][1], 0]);
	//console.log(a,b,bl,nr0);

			t=Decimal.toStr(aA[0])+'×'+Decimal.toStr(aA[1])+'='+Decimal.toStr(Decimal.oprs('*',aA));

			var tA=[];

			for(var i=bl-1;i>-1;i--){
				if(b[i]!='0'){
					tA.push([Integer.oprs('*1',[a,b[i]]), bl-i-1]);
				}
			}

			var tAl=tA.length;
			if(bl>1){
				//tA.push(Decimal.oprs('+',tA));
				var x=Decimal.oprs('+',tA);
				tA.push([x[0],x[1]]);

			//	console.log(tA[tAl][0], tA[tAl][1]);

				tA[tAl][0]=tA[tAl][0]+'0'.repeat(tA[tAl][1]);
				tA[tAl][1]=0;
			//	console.log(tA.join(' ; '));
			}else{
				tAl--;
				tA[tAl][0]=tA[tAl][0]+'0'.repeat(tA[tAl][1]);
				tA[tAl][1]=0;
			//	console.log(tA.join(' ; '));
			}
			
			var nl=max([tA.slice(-1)[0][0].length, -aA[0][0].length-aA[0][1]+1, -aA[1][0].length-aA[1][1]+1]),
				d=Integer.oprs('+',[aA[0][1], aA[1][1]]), dA=[];
//console.log(nl,d,'tA=',tA.join(' ; '));
			if(aA[0][1]<0){
				aA[0][0]=Decimal.toStr(aA[0]);
				dA.push(aA[0][1]);

			}
			if(aA[1][1]<0){
				aA[1][0]=Decimal.toStr(aA[1]);
				if(dA.indexOf(aA[1][1])<0){
					dA.push(aA[1][1]);
				}

			}
			if(+d<0 && bl>=1){
				
				
				
				var t0=tA[tAl][0];
				
				//console.log('t0= ',t0,'tA[tAl][0]=',tA[tAl][0]);
				tA[tAl][0]=t0.replace(new RegExp('(\\d{'+(-d)+'})$'),'.$1');
				
				t0=tA[tAl][0];
				//console.log('t0= ',t0,'tA[tAl][0]=',tA[tAl][0]);
				if(t0[0]=='.'){
					tA[tAl][0]=0+t0;
					nl++;
				}else if(!/\./.test(t0)){
					tA[tAl][0]='0.'+'0'.repeat(-d-t0.length)+t0.replace(/0+$/,function(t){return '∅'.repeat(t.length)});
					
					//console.log(tA[tAl]);
					nl=-d+1;
					
				}
				if(dA.indexOf(+d)<0){
					dA.push(+d);
				}
			}
			
			//console.log(nl,tA.join('; '));
			Arrf(function(x){
				//console.log('x=',x,' nl= ',nl,nr0,(''+x[0]).replace(/[\.①]/g,'').length,nl-(''+x[0]).replace(/[\.①]/g,'').length-x[1]);
				
				x[1]='⓪'.repeat(Math.max(nl-(''+x[0]).replace(/[\.①]/g,'').length-x[1],0))	//透明0
					+x[0]
					+'⓪'.repeat(x[1]+nr0);	//透明0
				
				//console.log('x[1]= ',x[1]);
				if(/\./.test(x[1])){
					x[1]=x[1].replace(/0+$/,function(t){return '∅'.repeat(t.length)})
				}
				x[0]='';
			},tA);
			
			//console.log(aA.join(' aA= '));
			
			aA[0]=['','⓪'.repeat(Math.max(nl-(''+aA[0][0]).replace(/[\.①]/g,'').length,0))
						+aA[0][0]
						+'0'.repeat(aA[0][1]>0?aA[0][1]:0)
						+'⓪'.repeat(nr0-Math.max(aA[0][1],0))];
			aA[1]=['×','⓪'.repeat(Math.max(nl-(''+aA[1][0]).replace(/[\.①]/g,'').length,0))
						+aA[1][0]
						+'0'.repeat(aA[1][1]>0?aA[1][1]:0)
						+'⓪'.repeat(nr0-Math.max(aA[1][1],0))];


			//console.log('dA ',dA, 'nl ',nl);
			var dotf=function(x){
				if(x[1].split('.').length-1<dA.length){
					for(var i=dA.length-1;i>=0;i--){

						var y=x[1].replace(/①/g,'.').replace(/⓪/g,'0'), yl=y.length;
		
						//console.log('y ',y,'nl-dA['+i+']= ',nl+dA[i]);

						if(!(new RegExp('^([^\\.]\\.*){'+(nl+dA[i])+'}\\.')).test(y)){

							x[1]=x[1].replace(new RegExp('^(([⓪\\d][①|\\.]*){'+(nl+dA[i])+'})'),'$1①');

								
							if(x[1].split(/[\.①]/).length-1==dA.length){
								break;
							}
						}
					}
				}
				x[1]=x[1].replace(/∅/g,kancel(0)).replace(/①/g,hp('.')).replace(/⓪/g,hp());
			};
			dotf(aA[0]);
			dotf(aA[1]);
			for(var i=tA.length-1;i>=0;i--){
				dotf(tA[i]);
			}

			//console.log(tA[tAl][1], d);
			if(+d>0){
				//console.log(tA[tAl][1], d);
				tA[tAl][1]=tA[tAl][1].replace(new RegExp('(\\\\hphantom\\{0\\}){'+nr0+'}$'), '0'.repeat(d)+kancel(0).repeat(Math.max(nr0-d,0)));
				//console.log(tA[tAl][1]);

			}else{
				//console.log(tA[tAl][1], d);
				tA[tAl][1]=tA[tAl][1].replace(new RegExp('\\.0+(\\\\hphantom\\{0\\})*$'), function(x){return Arrf(kancel,x.split('\\')[0].split('')).join('')+'\\'+x.split('\\')[1]});

			}


			var h0=/^\\hphantom\{\.\}/.test(aA[0][1]), h1=/^\\hphantom\{\.\}/.test(aA[1][1]);
			if(h0||h1){
				var dots=h0 && /^\d+\./.test(aA[1][1])?aA[1][1].split('.')[0].length:(h1 && /^\d+\./.test(aA[0][1])?aA[0][1].split('.')[0].length:0), s=hp(0).repeat(dots);
				for(var i=aA.length-1;i>=0;i--){
					if(/^\\hphantom\{\.\}/.test(aA[i][1])){
						aA[i][1]=s+aA[i][1];
					}
				}

				for(var i=tA.length-1;i>=0;i--){
					if(/^\\hphantom\{\.\}/.test(tA[i][1])){
						tA[i][1]=s+tA[i][1];
					}
				}

			}
//console.log(aA,tA);
			return [mtrx(aA.concat(tA),'.','.','','I2'+(bl>=2?'_'+(tA.length+1):'')),t,''].join(kbr+'\\widetilde{'+'~'.repeat(27)+'}'+kbr);
		}



		if(op=='竖式/'){//二元 p需计算到的小数位
			
			/* 测试用例：
$Decimal.oprs('竖式/',[1.43,0.13])$\\
$Decimal.oprs('竖式/',[1.234,20.15],5)$\\
$Decimal.oprs('竖式/',[1.234,20.15])$\\
$Decimal.oprs('竖式/',[1.3,0.78],1)$\\
$Decimal.oprs('竖式/',[0.002,20.15])$\\

$Decimal.oprs('竖式/',[0.002,0.01])$\\
$Decimal.oprs('竖式/',[0.002,300])$\\

$Decimal.oprs('竖式/',[0.02,0.01])$\\
*/

			//console.log(aA.join('; '));
			var a=aA[0][0],b=aA[1][0],
				al=a.length, bl=b.length,
				atens=aA[0][1], btens=aA[1][1],
				
				c='', d=aA[0][1]-aA[1][1],q='',
				Da=Decimal.toStr(aA[0]), Db=Decimal.toStr(aA[1]),
				sa=Da, sb=/\./.test(Db)?Db.replace('.','③'):Db, //.replace(/0+$/,function(x){return x.replace(/0/g,'②')}),
				rep01=function(x){return x.replace(/[\d②]/g,'⓪').replace(/[\.③]/g,'①')},//.replace(/[\.③⑤]/g,'①')},
				rep4=function(x){return x.replace(/[⓪①②③⑤]/g,'')},
				repI=function(x){return x.replace(/[①③⑤\.]/g,'').replace(/[⓪②]/g,'0').replace(/^0+/,'')},
				repopa=function(x){return x.replace(/[①③⑤]/g,'.').replace(/[⓪②]/g,'0')};
			//把b化成整数（a相应扩大或缩小倍数）		透明0：⓪ 		透明. :①		kancel(0): ②		kancel('.')：③			hp(kancel('.'))：⑤	




			 
 			if(btens){
 				sa=sa.replace('.','③');
			 }

			if(btens>0){//sa小数点向左偏移	
				if(/0$/.test(sa)){//atens>0
					
					var r0=sa.replace(/.*[^0]/,'').length;
					if(r0>=btens){// atens >=btens 
						sa=sa.substr(0,sa.length-btens)+'②'.repeat(btens)
					}else{
						//sa=sa.substr(0,sa.length-btens)+'.'+sa.substr(sa.length-btens,sa.length-r0)+'②'.repeat(r0)
						sa=sa.substr(0,sa.length-btens)+'.'+sa.substr(sa.length-btens,sa.length-r0)+'0'.repeat(r0)
						
					}
					

				}else{//atens<=0
					var n=atens<0?sa.split('③')[0].length:al;
					if(n>btens){
						sa=sa.substr(0,n-btens)+'.'+sa.substr(n-btens,sa.length)
					}else{
						sa='0.'+'0'.repeat(btens-n)+sa
					}
				}



			}
			if(btens>0){
				aA[1][0]=aA[1][0]+'0'.repeat(btens);
				btens=0;
				aA[1][1]=0;
				
			}

			/*
			bug 45000÷1250    45000÷125000
			*/

			if(btens<0){//sa小数点向右偏移
				if(atens>=0){//atens>0
					sa+='0'.repeat(-btens);
				}else{// if(/\./.test(sa)){//atens<0
					
					var dotr=sa.split('③')[1].length;
					if(dotr>-btens){
						sa=sa.substr(0,sa.length-(dotr+btens))+'.'+sa.substr(sa.length-(dotr+btens),sa.length)
					}else if(dotr==-btens){
						sa+='①';
					}else{
						//sa='0.'+'0'.repeat(-btens-dotr)+sa
						console.log(sa);
						sa=(/^0③/.test(sa)?sa.replace(/0③0*/,function(x){return x.replace(/0/g,'②')}):sa)+'0'.repeat(-btens-dotr)+'①'
					}
				}
				console.log(sa);
				if(/0③\d+\./.test(sa)){
					sa=sa.replace('0','②')
				}
			}
			
			
			
			//  以下待续
			var sl=sa.length, nop=p==undefined, fx=nop?8:p, fxi=0,r='',A='',IA='', tA=[sa];

//console.log('sa= ',sa, '小数精度位数 fx = ',fx);
			for(var i=0;i<sl+fx+2;i++){
//console.log('i= ',i, 'c= ',c,'r= ',r,'A= ',A,'IA =',IA);


				if(/^0+$/.test(rep4(r))){//余数为0
					break;
				}

				if(fxi>=fx+1){
					//console.log('小数精度达标',fxi,' >= ',fx,'+1');
					
					break;
				}


				var dos=0;

				do{
//console.log('do循环开始：i= ',i,'c= ',c);
					var si=i<sl?sa[i]:(/[\.①③]/.test(sa) || i>sl?'0':'①');//'⓪':'①'
					A+=si;
					IA=repI(A);


//console.log('小循环开始：i= ',i,'si= ',si, 'sa = ',sa, 'sl = ',sl);
	
//console.log('si = ',si,'sa= ',sa,'c= ',c,'A= ',A,'IA= ',IA,'fxi= ', fxi,'fx+1= ',fx+1,'(b,IA) = ',b,IA);
					
					if(/[\.①]/.test(si)){
//console.log('si = ',si,'fx = ',fx,'c = ',c,'fxi = ',fxi);
						if(!fx && si=='①'){
							c=c.replace(/⓪$/,'0');
							fxi=1;
							A=A.replace(/①$/,'')
							break
						}
						
						c=c.replace(/⓪$/,'0')+'.'
						
					}else if(/③/.test(si)){
						
						c+='⑤';
					}else if(Integer.is.b2['>'](b,IA)){
						if(/\d/.test(c)){
							c+=0;
						}else{
							c+='⓪';
						}
					}

//console.log('小循环尾声 i= ',i,'c= ',c);
					fxi=(rep4(c).split('.')[1]||'').length;
					

					i++;
					dos=1;
//console.log('商 c= ',c,' 小数位数 fxi= ',fxi,'此时i= ',i);
					
				}while(Integer.is.b2['>'](b,IA) && fxi<fx+1)

//console.log('i= ',i,'qr之前，c= ',c);
				var qr=Integer.oprs('/',[IA,b]);
//console.log(IA,'/',b,' = qr= ',qr);

//console.log('i= ',i,'tA= ',tA,'A= ',A,'fxi= ',fxi,' fx+1 = ',fx, '+1');
if(tA.length>1){
	tA[tA.length-1]=A;
}
				if(qr[0]=='0' && fxi>=fx+1){
					//console.log('精度足够，退出循环');
					r=A;
					break
				}




				if(!/\d/.test(c) && qr[0]=='0'){
					c+='⓪'
					
				}else{
					c+=qr[0]
				}
				fxi=(rep4(c).split('.')[1]||'').length;
//console.log('qr之后，c= ',c,'此时商的小数位数 fxi = ',fxi);

				var pd=Integer.oprs('-',[IA,qr[1]]);
				
//console.log('pd= ',pd);

				var pdi=rep01(c).split('');
//console.log('pdi= ',pdi.join(''),'c= ',c,'c.length',c.length);
				for(var j=c.length-1;j>-1;j--){
//console.log('c[',j,'] = ',c[j], /[\.①③⑤]/.test(c[j]));
					if(!/[\.①③⑤]/.test(c[j])){
						pdi[j]=pd.slice(-1);
						pd=pd.substr(0,pd.length-1);
						
//console.log('j= ',j,' pdi= ',pdi.join(''),' pd =', pd);
						if(!pd){
							break
						}
						
					}
				}
				tA.push(pdi.join(''));
//console.log('后来 pdi= ',pdi.join(''));
				

				
				var ri=rep01(c).split(''), qr1=qr[1];
//console.log('ri= ',ri.join(''));
				for(var j=c.length-1;j>-1;j--){
					if(!/[\.①③⑤]/.test(c[j])){
						ri[j]=qr1.slice(-1);
						qr1=qr1.substr(0,qr1.length-1);
						if(!qr1){
							break
						}
						
					}
				}
				A=ri.join('');
				IA=repI(A);
//console.log('余数 A= ',A,'IA = ',IA);
				r=A;
				if(i<sl){
//console.log('局部余数= ',r,'A = ',A);

					r+=sa.substr(i);
//console.log('整体余数= ',r);
				}
				
//console.log('大循环尾声 i= ',i,'c= ',c,'r= ',r, 'sa= ',sa, 'fxi= ',fxi, 'fx+1=',fx,'+1',' dos= ',dos);

//这里需要更新A, IA, C
				tA.push(r);
				
				
				
				
				if(dos){
					i--;
					
				}
			}

			if(c.length<sl){
				
				//console.log('此时 c=',c );
				//console.log('sa= ',sa );
				
				//c+=rep01(sa.substr(c.length))
				c+=rep01(sa.substr(c.length));
				
				//console.log('然后 c=',c );
				



				if(/⓪+$/.test(c)){
					
					c=c.replace(/⓪+$/,function(x){return '0'.repeat(x.length)})
				}
				
				if(/⑤\d+⓪+①$/.test(c)){
					
					c=c.replace(/(⓪+)①$/,function(x){return '0'.repeat(x.length-1)+'①'})
				}


			}
			var cl=c.length;
			Arrf(function(x,i){
				if(x.length<cl){
					tA[i]+=rep01(c.substr(x.length))
				}
				//console.log(tA[i]);

				if(i%2){//需加下划线的行
					if(/^\D*0.*\d/.test(tA[i+1])){
						var l0=tA[i+1].match(/^\D*0[0\D]*/g)[0].length+1-tA[i].replace(/\d.+/,'').length;
						tA[i]=tA[i].replace(/(\d.*)*\d.*/,function(x){return x.length>l0?kxu(x.substr(0,l0))+x.substr(l0):kxu(x)})
					}else{
						tA[i]=tA[i].replace(/(\d.*)*\d/,function(x){return kxu(x)})
					}
				}else{
//console.log(tA[i]);
					if(/^\D*0.*\d/.test(tA[i])){
						var l0=tA[i].replace(/[^0].*/,'').length;
						//tA[i]=tA[i].replace(/^\D*0[0\D]*/, function(x){return x.replace(/0/g,'⓪')});
					//	tA[i]=tA[i].replace(/^\D*00+/, function(x){var x0=x.split('0')[0]+0;return x0+x.substr(x0.length).replace(/0/g,'⓪')});
						tA[i]=tA[i].replace(/00+$/, function(x){return x.replace(/0/g,'⓪').replace(/⓪$/,'0')});
						tA[i]=tA[i].replace(/^\D*0+[1-9]/, function(x){return x.replace(/0/g,'⓪')});
//console.log(tA[i]);

						tA[i]=tA[i].replace(/^\D*0+0/, function(x){return x.substr(0,x.length-1).replace(/0/g,'⓪')+0});
						tA[i]=tA[i].replace(/^\D*0\D+[1-9]/, function(x){return x.replace(/0/g,'⓪').replace(/③/,'⑤')});

						tA[i]=tA[i].replace(/\./g, '①');
					}
				}
				if(i>1 &&  /\./.test(tA[i])){
					tA[i]=tA[i].replace('.','①')
				}
				
				tA[i]=(i?hp(sb+')'):sb+')')+tA[i]
			},tA);
			
			tA.unshift(hp(sb)+kxu(hp(')')+c));


			
			c=rep4(c);
//console.log('尾声r = ',r,c);
if(r.length<sl){
	r+=sa.substr(r.length);
	//console.log('实际上 r = ',r);
}

			r=/[1-9]/.test(r)?repopa(/⑤/.test(r)?r.replace('⑤','.').replace('①',''):r.replace('①','.')):'0';
			//r=/[1-9]/.test(r)?rep4(r.replace(/⓪/g,'0').replace(/①/g,'.')).replace(/^0+/,''):'0';
			r=r.replace(/^0+/,'');
			if(r[0]=='.'){
				r=0+r
			}

//console.log('最终r = ',r);

			t=Da+'÷'+Db+'='+c+
				(r?'\\cdots '+r+(fx?'\\\\ '+Da+'÷'+Db+'≈'+Decimal.opr1('r',Decimal.build.D(c),fx)+'（保留'+fx+'位小数）':''):'');
			
			/*
				js精度bug
				(0.000099255).toFixed(8)
				
				
			*/

			return [mtrx(tA,'.','.','').replace(/⓪/g,hp()).replace(/①/g,hp('.')).replace(/②/g,kancel(0)).replace(/③/g,kancel('.')).replace(/⑤/g,hp(kancel('.'))),t,''].join(kbr+'\\widetilde{'+'~'.repeat(27)+'}'+kbr);
		}



		if(op=='+'){
			for(var i=0;i<al;i++){
				if(aA[i][0]=='0'){
					aA.splice(i,1);
					al--;
					i--;
				}
			}
			
			if(al<2){return aA[0]}
			
			var sA=[];
			for(var i=0;i<al;i++){
				sA.push(aA[i].join())
			}
			for(var i=0;i<al;i++){
				for(var j=i+1;j<al;j++){
					if(sA[i]=='-'+sA[j] || sA[j]=='-'+sA[i]){
						sA.splice(i,1);
						sA.splice(j-1,1);
						aA.splice(i,1);
						aA.splice(j-1,1);
						al-=2;
						i--;
						break;
					}
				}
			}
			

			if(al==0){var A=['0',0,0];A.type='Decimal';return A}
			if(al<2){return aA[0]}
			
			if(al>2){

				return Decimal.oprs('+',[Decimal.oprs('+',aA.slice(0,al-1)),aA[al-1]])

			}else{
				var a0=''+aA[0][0],a1=aA[0][1],b0=''+aA[1][0],b1=aA[1][1],isNega=a0[0]=='-',isNegb=b0[0]=='-',isNegSame=isNega==isNegb,
					Ia=a0.replace(/^-/,'').length,Ib=b0.replace(/^-/,'').length,Na=a0.replace(/-/,''),Nb=b0.replace(/-/,'');
//console.log(Na,Nb,isNegSame,isNega,isNegb);
				
				if(isNegSame){
					
					if(a1>=Ib+b1){
						return [a0+ZLR(0,a1-Ib-b1)+b0.substr(+isNegb),b1]
					}
					if(b1>=Ia+a1){
						return [b0+ZLR(0,b1-Ia-a1)+a0.substr(+isNega),a1]
					}

					if(a1==b1){
						return Decimal.build.D((isNega?'-':'')+Integer.oprs('+',[Na,Nb]),a1)
					}
					
					if(a1>b1){
						return Decimal.build.D((isNega?'-':'')+Integer.oprs('+',[Na+ZLR(0,a1-b1),Nb]),b1)
					}
					if(a1<b1){
						return Decimal.build.D((isNega?'-':'')+Integer.oprs('+',[Nb+ZLR(0,b1-a1),Na]),a1)
					}
				}else{
					////console.log(isNegb?[aA[0],[Nb,b1]]:[aA[1],[Na,a1]]);
					return Decimal.oprs('-',isNegb?[aA[0],[Nb,b1]]:[aA[1],[Na,a1]])
				}
			}

		}
		if(op=='-'){
			for(var i=1;i<al;i++){
				if(aA[i][0]=='0'){
					aA.splice(i,1);
					al--;
					i--;
				}
			}
			
			if(al<2){return aA[0]}
//console.log(aA.join(brn), al);
			if(aA[0][0]=='0'){
				if(al==2){
					return Decimal.opr1('-',aA[0])
				}else{
					return Decimal.opr1('-',Decimal.oprs('+',aA.slice(1)))
				}
			}
			
			if(al>2){
				return Decimal.oprs('-',[aA[0],Decimal.oprs('+',aA.slice(1))])
				
			}else{
//console.log(aA.join(brn), al);
				var a0=aA[0][0],a1=aA[0][1],b0=aA[1][0],b1=aA[1][1],isNega=a0[0]=='-',isNegb=b0[0]=='-',isNegSame=isNega==isNegb,
					Ia=a0.replace(/^-/,'').length,Ib=b0.replace(/^-/,'').length,Na=a0.replace(/-/,''),Nb=b0.replace(/-/,'');
//console.log(isNegSame,isNega,isNegb,aA[0],aA[1]);

				if(isNegSame){
					var agb=Decimal.is.b2['≥'](aA[0],aA[1]);
					if(a1==b1){
						return Decimal.build.D((agb?'':'-')+Integer.oprs('-',[Na,Nb]).replace(/-/,''),a1)
					}
					
//console.log(a1,b1,agb);

					if(a1>b1){
						////console.log(Na+ZLR(0,a1-b1),Nb);
						return Decimal.build.D((agb?'':'-')+Integer.oprs('-',[Na+ZLR(0,a1-b1),Nb]).replace(/-/,''),b1)
					}
					if(a1<b1){
						return Decimal.build.D((agb?'':'-')+Integer.oprs('-',[Na,Nb+ZLR(0,b1-a1)]).replace(/-/,''),a1)
					}
				}else{
					return isNegb?Decimal.oprs('+',[aA[0],[b0.substr(1),b1]]):Decimal.opr1('-',Decimal.oprs('+',[[a0.substr(1),a1],aA[1]]))
				}
			}
		}

		if(op=='*'){
			if(al<2){return aA[0]}
			for(var i=0;i<al;i++){
				if(aA[i][0]=='0'){
					var A=['0',0,0];A.type='Decimal';
					return A
				}
			}
			var tens=0,isneg=0,nA=[];
			for(var i=0;i<al;i++){
				var ai=aA[i];
				if(ai[0]=='-'){
					isneg=!isneg;
					if(ai[0]!='-1'){
						nA.push(ai[0].substr(1));
					}
				}else{
					if(ai[0]!='1'){
						nA.push(ai[0]);
					}
				}
				if(ai[1]){
					tens+=ai[1];
				}
			}
			
			al=nA.length;
			
			if(al<2){var A=[nA[0],tens];A.type='Decimal';return A}
			if(al>2){
				return Decimal.oprs('*',[Decimal.build.D(Integer.oprs('*',nA.slice(0,al-1))),[nA[al-1],tens]])
			}else{
				var A=[Integer.oprs('*',nA),tens,0];
				A.type='Decimal';
				if(/0+$/.test(A[0])){
					A[1]+=A[0].replace(/^.*[^0]/,'').length;
					A[0]=A[0].replace(/0+$/,'');
				}
				return A
			}
		}
		if(op=='/'){
			return Frac.opr1('.',Frac.oprs('/',Arrf(Frac.build.D,aA)))
		}
		if(op=='^'){//有理小数幂运算不封闭，可能得到根号形式的无理数
			return Frac.oprs('^',Arrf(Frac.build.D,aA))
		}
	}
	
/*函数依赖关系：

Decimal.build.F 依赖于 Frac.opr1('.',A)
Decimal.toStr(,'/') 依赖于 Frac.toStr(Frac.build.D(A))
Decimal.opr1('/') 依赖于 Frac.build.D(A)

*/
}, Frac={/*分数(分子，分母)		本质是数组：[分子，分母]

	*/
	build:{
		A:function(a){//分子，分母数组
			var A=[].concat(a);
			A.type='Frac';A.toStr=function(p){return Frac.toStr(this,p)};
			return A
		},
		I:function(t){//整数数字串
			var A=[t+'','1'];
			A.type='Frac';A.toStr=function(p){return Frac.toStr(this,p)};
			return A
		},
		D:function(a){//有理小数Decimal对象	或有限小数字符串
			var A=isArr(a)?[].concat(a):[a,0,0];
			if(A.length==1){
				A.push(0,0)
			}
			if(A.length==1){
				A.push(0)
			}
			A[0]=Decimal.toStr(Decimal.build.D(A[0],A[1]));
			
			return Frac.build.F(n2frac(A[0],A[2]))
		},
		F:function(t){//t是分数字符串a/b 或整数字符串
			var s=wrapTrim(''+t), A=s.split('/');
			A.type='Frac';A.toStr=function(p){return Frac.toStr(this,p)};
			if(!/\//.test(s)){
				A.push('1');
			}
			return A
		}

	},
	is:{//布尔逻辑
		b2:{//二元关系
			"=":function(A,B){
				return +(FracReduct(A)==FracReduct(B))
			},
			"≠":function(A,B){
				return +(FracReduct(A)!=FracReduct(B))
			},
			">":function(A,B){
				return +/-/.test(fracOpr('-',B,A))
			},
			"≥":function(A,B){
				return +!/-/.test(fracOpr('-',A,B))
			},
			"<":function(A,B){
				return +/-/.test(fracOpr('-',A,B))
			},
			"≤":function(A,B){
				return +!/-/.test(fracOpr('-',B,A))
			},
		},
		b1:{//一元关系
			"1":function(A){return +(A[0]+''==A[1]+'' && A[0]+''!='0')},
			"0":function(A){return +(A[0]+''=='0')},
			"+":function(A){return +(A[0]+''!='0' && (A[0]+'')[0]!='-')},
			"-":function(A){return +((A[0]+'')[0]=='-')},

		}
	},
	fromStr:function(s){
		if(/^-?\d+$/.test(s)){
			return Frac.build.I(s)
		}
		if(/^-?[\d\.]+[%‰‱]?$/.test(s)){
			return Frac.build.D(s)
		}
		if(/^-?[\d\.]+×10\^.+$/.test(s)){
			return Frac.build.D(Decimal.build['10'](s))
		}
		if(/^-?\d+[/]\d+$/.test(s)){
			return Frac.build.F(s)
		}
		return undefined
	},
	toStr:function(A,latex){//转成文本
		/* 	
			分数文本
			参数latex 指定输出latex形式
		*/
		var t=A.join('/').replace(/\/1$/,'');
		return latex && A[1]!='1'?kfrac(t):t

	},
	opr1:function(op,arr,p){//一元运算	p是参数			运算结果仍是有理数，则返回分数数组，否则返回表达式字符串！
		var A=FracReduct(arr).split('/'),a=A[0],b=A[1]||'1',isNeg=a[0]=='-', aa=isNeg?a.substr(1):a;
		if(!A[1]){
			A[1]='1'
		}
		A.type='Frac';A.toStr=function(p){return Frac.toStr(this,p)};
		if(op=='-'){//相反数
			if(a!='0'){
				A[0]=isNeg?aa:'-'+a;
			}
		}
		if(op=='||'){//绝对值
			if(isNeg){
				A[0]=aa;
			}
		}
		
		if(op=='1/'){//倒数
			if(a!='0'){
				A[0]=isNeg?'-'+b:b;
				A[1]=aa;
			}
		}

		if(op=='^2'){//平方
			if(a!='0'){
				A[0]=Integer.opr1('^2',aa);
				A[1]=Integer.opr1('^2',b);
			}
		}
		if(op=='^3'){//立方
			if(a!='0'){
				A[0]=Integer.opr1('^3',aa);
				A[1]=Integer.opr1('^3',b);
			}
		}

		if(op=='√'){//开方
			return Frac.oprs('^',[A,[1,2]])
		}
		if(op=='∛'){//开立方
			return Frac.oprs('^',[A,[1,3]])
		}
		if(op=='∜'){//开四次方
			return Frac.oprs('^',[A,[1,4]])
		}


		if(op=='.'){//分数化小数对象	a=qb+r
			if(a=='0'){
				return Decimal.build.I(0)
			}
			a=a.replace('-','');
			//console.log(a,b,'化小数对象');
			var al=a.length,q='',r='',qr=[],len=0;
			while(!len || r!='0'){
				var x=Integer.oprs('/',[a,b]),X=x.join();
				//console.log(a,'/',b,' = ',x);

				r=x[1];
				
				if(r=='0'){//除尽
					q+=x[0];
					return Decimal.build.D(nTrim(q.replace(/^0+([1-9])/,'$1').replace(/^0+\./,'0.')),0,0)
				}
				if(qr.indexOf(X)>-1){//发现循环节
					
					if(qr.indexOf(X)>-1){
						len=qr.length-qr.indexOf(X);
					}
					return Decimal.build.D(nTrim(q.replace(/^0+([1-9])/,'$1').replace(/^0+\./,'0.')),0,len)

				}
				
				qr.push(X);
				
				q+=x[0];
				if(q.length==al && r!='0'){
					q+='.'
				}
				a=r+'0';
			}
		}

		if(op=='='){/*约分化简	分子、分母都是整数
			*/
			var t=gcd(A);
			if(a=='0'){A[0]='0';return A}
			var s=isNeg ^ b[0]=='-'?'-':'';

			a=Integer.oprs('/',[a.replace('-',''),t])[0];
			b=Integer.oprs('/',[b.replace('-',''),t])[0];
			
			A[0]=s+a;
			A[1]=b;

		}
		return A
	},
	
	oprs:function(op,arr,p){//多元运算	p是参数
		var A=[].concat(arr),l=A.length;
		A.type='Frac';A.toStr=function(p){return Frac.toStr(this,p)};
		if(/^[\+\-\*\/×÷]$/.test(op)){
			return Frac.build.F(Arrf(function(x,y){return fracOpr(op,x,y)},A,'cp2'))
		}


		if(op=='^'){
			var t=fracOpr(op,A[0],A[1]);
			if(t.indexOf('(-1)^')>-1){//负数开偶次方，得到复数
				return t
				
			}else if(t.indexOf('^')>-1){//开方 根数
				
				return t
				
			}else{
				if(l>2){
					A.shift();
					A[0]=Frac.build.F(t);
					return Frac.oprs('^',A)
				}else{
					return Frac.build.F(t)
				}
			}

		}
	}



}, Root={/*根数		本质是二维数组：[(-1)^的有理幂次（默认0）,有理系数（默认1）,底数（正分数，默认1）,分数幂次（正分数，默认1）]

	*/
	build:{
		I:function(t){//整数字符串
			var A=[Frac.build.I('0'),Frac.build.I(t),Frac.build.I('1'),Frac.build.I('1')];
			A.type='Root';A.toStr=function(p){return Root.toStr(this,p)};
			return A
		},

		D:function(a){//小数对象
			var A=[Frac.build.I('0'),Frac.build.D(a),Frac.build.I('1'),Frac.build.I('1')];
			A.type='Root';A.toStr=function(p){return Root.toStr(this,p)};
			return A
		},

		F:function(t){//t是分数字符串a/b 或数组
			var A=[Frac.build.I('0'),isArr(t)?t:Frac.build.F(t),Frac.build.I('1'),Frac.build.I('1')];
			A.type='Root';A.toStr=function(p){return Root.toStr(this,p)};
			return A
		},

		FP:function(t){/* t是分数幂字符串(-1)^(奇数/偶数)×(e/f)×(a/b)^(c/d) 或分数数组[[a0,a1],[b0,b1]]
				(-1)^(1/2)											[1,2], [1,1], [1,1], [1,1]
				(-1)^(1/2)×(e/f)×(a/b)^(c/d)						[1,2], [e,f], [a,b], [c,d]
				(-1)^(1/2)×(-1)×(a/b)^(c/d)						[1,2], [-1,1], [a,b], [c,d]
				(-1)^(1/2)×(e/f)									[1,2], [e,f], [1,1], [1,1]
				(-1)^(1/2)×(a/b)^(c/d)								[1,2], [1,1], [a,b], [c,d]

				(e/f)×(a/b)^(c/d)									[0,1], [e,f], [a,b], [c,d]
				-(a/b)^(c/d)										[0,1], [-1,1], [a,b], [c,d]
				e/f													[0,1], [e,f], [1,1], [1,1]
				(a/b)^(c/d)											[0,1], [1,1], [a,b], [c,d]
				
				
			*/
			var A=isArr(t)?[Frac.build.I('0'),Frac.build.I('1')].concat(t):(t.indexOf('(-1)^')>-1?[
				Frac.build.F(t.split('×')[0].split('^')[1]),
				Frac.build.F((t.split('×')[1]||'1^').indexOf('^')>0?'1':t.split('×')[1]),
				Frac.build.F(t.split('^').length>2?t.split('^')[1].replace(/.+×/,''):'1'),
				Frac.build.F(t.split('^').length>2?t.split('^')[2]:'1'),
				]:[
				Frac.build.F('0'),
				Frac.build.F(t.split('×')[0].indexOf('^')>0?(t.split('×')[0][0]=='-'?'-1':'1'):t.split('×')[0]),
				Frac.build.F(t.split('^').length>1?t.split('^')[0].replace(/^(-|.+×)/g,''):'1'),
				Frac.build.F(t.split('^').length>1?t.split('^')[1]:'1'),
				]);
				A.type='Root';A.toStr=function(p){return Root.toStr(this,p)};
			return A
		},


	},
	is:{//布尔逻辑
		b2:{//二元关系
			"=":function(A,B){
				return +(A.join()==B.join())
			},
			"≠":function(A,B){
				return +(A.join()!=B.join())
			},
			">":function(A,B){

			},
			"≥":function(A,B){
				
			},
			"<":function(A,B){
				
			},
			"≤":function(A,B){
				
			},
		},
		b1:{//一元关系
			"1":function(A){return +(A.join(';')==[[0,1],[1,1],[1,1],[1,1]].join(';'))},
			"0":function(A){return +(A[1][0]=='0')},
			"+":function(A){return +(A[1][0]!='0' && A[1][0]!='-')},//忽略虚数系数
			"-":function(A){return +(A[1][0]=='-')},//忽略虚数系数


		}
	},
	fromStr:function(s){
		if(/^-?\d+$/.test(s)){
			return Root.build.I(s)
		}
		if(/^-?[\d\.]+[%‰‱]?$/.test(s)){
			return Root.build.F(Frac.build.D(s))
		}
		if(/^-?[\d\.]+×10\^.+$/.test(s)){
			return Root.build.D(Decimal.build['10'](s))
		}
		if(/^-?\d+[/]\d+$/.test(s)){
			return Root.build.F(s)
		}
		
		
		if(/^(\(-1\)\^[\d/\(\)]+|-)?(×?[\d/\(\)]+)?(×?[\d/\(\)]+\^[\d/\(\)]+)?$/.test(s)){
			return Root.build.FP(s)
		}
		return undefined
	},
	toStr:function(A,latex){//转成文本
		/* 	
			根数文本
			参数latex 指定输出latex形式
		*/
		var a=[],b,haspow=A[2].join()!='1,1';
		if(A[1][0]=='0'){
			return '0'
		}
		
		if(A[0][0]!='0'){//-1的幂次
			b=Frac.toStr(A[0]);
			a.push('(-1)^'+pp((b.indexOf('/')>0 && latex?kfrac(b,'',1):b),latex?'{}':'()'))
		}
		if(A[1].join()!='1,1'){//有理系数
			b=Frac.toStr(A[1]);
			if(b=='-1'){
				if(haspow){
					if(a.length<1){
						a.push('-')
					}
				}else{// (-1)^ ×(-1)	变成 (-1)^ 
					if(a.length<1){
						return '-1'
					}
					b=Frac.toStr(Frac.oprs('+',[A[0],['1','0']]));
					return '(-1)^'+pp((b.indexOf('/')>0 && latex?kfrac(b,'',1):b),latex?'{}':'()')
				}
			}else{
				if((b.indexOf('/')>0 || b[0]=='-') && (a.length || haspow)){
					
					a.push(latex?zp(b.indexOf('/')>0?kfrac(b):b):pp(b,'()'))

				}else{
					a.push(b)
				}
			}
		}
		if(haspow){//有理底数
			b=Frac.toStr(A[2]);
			var c=b.indexOf('/')>0?(latex?zp(kfrac(b)):pp(b,'()')):b;
			c+='^';
			b=Frac.toStr(A[3]);
			if(latex){
				c+=pp(b.indexOf('/')>0?kfrac(b,'',1):b,'{}')
				
			}else{
				c+=b.indexOf('/')>0?pp(b,'()'):b;
			}
			a.push(c)
		}
		
		////console.log(a,b,c);
		b=a.join('×').replace('-×','-')

		return b
	},
	opr1:function(op,arr,p){//一元运算	p是参数
		var A=Arrfc([Frac.build.F,FracReduct],arr),isNeg=A[1][0][0]=='-';
		A.toStr=function(p){return Root.toStr(this,p)};
		
		if(op=='-'){//相反数
			if(A[1][0]!='0'){
				A[1][0]=isNeg?A[1][0].substr(1):'-'+A[1][0];
			}
			return A
		}
		if(op=='='){//化简
			if(A[1][0]=='0' || A[2][0]=='0'){//系数或底数为0
				A[0][0]='0';
				A[0][1]='1';
				A[1][0]='0';
				A[1][1]='1';
				A[2][0]='1';
				A[2][1]='1';
				A[3][0]='1';
				A[3][1]='1';
				return A
			}
			
			if(A[2][0][0]=='-' && /[02468]$/.test(A[3][0])){// 负底数的偶次幂
				A[2][0]=A[2][0].substr(1);
			}

			if(A[2][0][0]=='-' && /[13579]$/.test(A[3][0]) && /[13579]$/.test(A[3][1])){// 负底数的奇次幂
				A[1][0]=A[1][0][0]=='-'?A[1][0].substr(1):'-'+A[1][0];

				A[2][0]='1';
				A[2][1]='1';
				A[3][0]='1';
				A[3][1]='1';
			}
			if(A[2][0][0]=='-' && /[13579]$/.test(A[3][0]) && /[02468]$/.test(A[3][1])){// 负底数的奇次幂，然后开偶次方
				var f=Frac.oprs('+',[A[0],A[3]]);
				A[0][0]=f[0];
				A[0][1]=f[1];
				
				A[2][0]==A[2][0].substr(1);

			}

			if(A[3][0]=='0' || A[2].join()=='1,1'){// 幂次为0，或底数为1

				A[2][0]='1';
				A[2][1]='1';
				A[3][0]='1';
				A[3][1]='1';
			}

			if(A[3][0][0]=='-'){// 负幂，底数变成倒数
				var f=Frac.opr1('1/',A[2]);
				A[2][0]=f[0];
				A[2][1]=f[1];
				A[3][0]=A[3][0].substr(1);
			}
			
			if(A[3][0]!='1' && A[3][1]=='1'){// 底数的整数幂，化成，纯底数
				var f=Frac.oprs('*',[A[1],Frac.oprs('^',[A[2],A[3]])]);
				A[1][0]=f[0];
				A[1][1]=f[1];
				
				A[2][0]='1';
				A[2][1]='1';
				A[3][0]='1';
				A[3][1]='1';
			}



			if(A[3][0]!='1' || A[3][1]!='1'){// 底数的分数幂
				var f=Frac.oprs('^',[A[2],A[3]]);
				
				if(isStr(f)){//
					
					
				}else{
					f=Frac.oprs('*',[A[1],f]);
				
					A[1][0]=f[0];
					A[1][1]=f[1];
					
					A[2][0]='1';
					A[2][1]='1';
					A[3][0]='1';
					A[3][1]='1';
				}
			}
			
			
			
			return A
		}


		
	},
	
	oprs:function(op,arr,p){//多元运算	p是参数
		var aA=[].concat(arr),al=aA.length, t;

		if(op=='+'){


		}
		if(op=='-'){

		}
		if(op=='*'){


			return A
		}
		if(op=='/'){
			
			return A
		}
		if(op=='^'){//第2个元素，只能是有理数，不能是根数（否则变成超越数）
			
			return A
		}
	}



}, Num={//上述基本（有理元素）数学对象的统一全体（不含变量）	运算结果，可能得到上述之外的数学表达式对象（Mfn）
	build:function(a){
		return isStr(a)?a:[].concat(a)
	},
	fromStr:function(s){//根据表达式自动识别数字类型，返回基本（有理元素）数学对象Integer Decimal Frac Root
		var x=Frac.fromStr(s);
		if(x==undefined){
			x=Root.fromStr(s);
		}
		return x
	},
	toStr:function(a,p){
		if(isStr(a)){
			return a
		}
//console.log(a);
		var x=a.type;
		if(x){
			//return eval(x).toStr(a,p)
			return a.toStr(p);
		}
		return undefined
	},
	is:{//布尔逻辑
		b2:{//二元关系
			"=":function(a,b){
				return +(''+a==''+b)
			},
			"≠":function(a,b){
				return +(''+a!=''+b)
			},

		},
		b1:{//一元关系
			'0':function(n){//
				return +(n[0]=='0')
			},
			'+':function(n){//是正数
				return +(n[0]!='0' && n[0]!='-')
			},
			'-':function(n){//是负数
				return +(n[0]=='-')
			},
		}
	},
	opr1:function(op,n,latex){//一元运算		latex指定不计算，得到形式字符串（LaTeX格式）


		if(op=='-'){//相反数

		}
		if(op=='1/'){//倒数

		}



	},


		
	oprs:function(op,A,latex){//多元运算		latex指定不计算，得到形式字符串（LaTeX格式）

		if(ZLR('+ - * / × ÷').indexOf(op)>-1){

		}
		if(op=='^'){

		}
		
		
		
	}

//下列涉及数字转换

},percnt2n=function(n){//百分数转小数
	var p=''+n,A=p.replace(/[%‰‱]/,'').split('.'),pcnt='%‰‱'.indexOf(p.substr(-1))+2;
	if(pcnt>1){
		if(A.length<2){
			A.push('');
		}
		A[0]=A[0].replace(/(\d)/,'0'.repeat(pcnt)+'$1');
		A[1]=A[0].substr(-pcnt)+A[1];
		A[0]=A[0].substr(0,A[0].length-pcnt).replace(/^-?0+(.)/,'$1');
	}
	return A.join('.')

},n2percnt=function(n,dgts,force){/*小数化百分比	[小数, 小数位数, 强制保留]
	参数force 强制保留几位小数（尾0不丢弃）
	*/
	var d=dgts||0,p=percnt2n(n),ds=0;
	if(/\./.test(p)){
		ds=p.split('.')[1].length
	}
	p=(+p*100).toFixed(d||ds);
	if(!force){
		p=nTrim(p)
	}
	return p+'%'


},n2frac=function(n,len){/*小数转成分数	
	假分数improper 
	带分数vulgar 暂不支持 
	真分数
	
	参数 len 指定循环节长度（n最末尾的m个数字作为循环节）
	
	*/
	var p=percnt2n(n),A=p.split('.');
	if(/^-/.test(p)){
		return '-'+n2frac(p.substr(1),len)
	}
	if(/\//.test(p)){
		if(A.length<2){
			return p
		}else{
			A=p.split('/');
			return n2frac(A[0])
		}
	}
	if(A.length>1){
		if(len){//循环小数
			var m=+len;
			if(A[0]=='0' && A[1].length==m){//纯循环小数
				/*
					0.a...b a...b a...b ...
					q*a...b*(1-q^n)/(1-q) 其中q=10^(-m)
					n→+∞，取极限，得到q*a...b/(1-q) = a...b/9...9
					
				*/
				A[0]=ZLR('9',m);
				return fracReduct(A[1],A[0])
			}else{//混循环
				var B=[A.join('').substr(0,p.length-1-m),A.join('').substr(-m)];

				/*
					c...d . a...b a...b a...b ...
					c...d+q*a...b*(1-q^n)/(1-q) 其中q=10^(-m)
					n→+∞，取极限，得到c...d+q*a...b/(1-q) = c...d + a...b/9...9 
						= [c...d*(10^m-1) + a...b]/9...9  = [c...d*10^m + a...b - c...d]/9...9
				*/

				var A0l=A[0].length,A1l=A[1].length, B0l=B[0].length;

				return fracOpr('+',A0l==B0l?B[0]:(A0l<B0l?B[0].substr(0,A0l)+'.'+B[0].substr(A0l-B0l):B[0]+ZLR('0',A0l-B0l)), 
					fracOpr('/',B[1]+ZLR('0',Math.max(m-A1l,0)),ZLR('9',m)+ZLR('0',Math.max(A1l-m,0))))
			}
			
		}else{
			A[0]=+A[0].replace(/^-/,'');
			A[1]=A[1].replace(/0+$/,'');
			A[1]=[+A[1],A[1].length,A[1].length];
			while(!(A[1][0]%2) && A[1][1]){
				A[1][0]/=2;
				A[1][1]--;
			}
			while(!(A[1][0]%5) && A[1][2]){
				A[1][0]/=5;
				A[1][2]--;
			}
			A[1][1]=Math.pow(2,A[1][1])*Math.pow(5,A[1][2]);
			A[0]=(/^-/.test(p)?'-':'')+(A[0]*A[1][1]+A[1][0])+'/'+A[1][1]
		}
	}
	return A[0]

	
},n2ArabBig=function(n){//数字转大号阿拉伯数字
	var SN='０１２３４５６７８９';
	return (''+n).replace(/\d/g,function(s){return SN[s]});

},n2Roman=function(m,c){/*I（1）、V（5）、X（10）、L（50）、C（100）、D（500）、 M（1000）
		参数c 指定小写

		I II III IV V VI VII VIII IX X XI XII XIII XIV XV
	
		每3位一个组合，加几个横线，表示乘以1000的几次幂
		1,2,3 以几个1表示
		4,9,以5,10前放个1表示
		6,7,8, 11,12,13以5,10后放几个1表示
		
	*/
	var n=+m,t=''+m,tl=t.length, ks=Math.ceil(tl/3),r='',caps=+c||0,f1=function(x,c){//个位数
		var u=('0'+x).substr(-1),v=+u,c=+c||0;
		return v<4?ZLR('Ii'[c],v):(v==9||v==4?'Ii'[c]+'VvXx'[+(v==9)*2+c]:'Vv'[c]+ZLR('Ii'[c],v-5))
	},f2=function(x,c){//两位数
		var u=('00'+x).substr(-2),u0=u[0],u1=u[1],v0=+u0,v1=+u1,c=+c||0;
		return (v0<4?ZLR('Xx'[c],v0):(v0==9||v0==4?'Xx'[c]+'LlCc'[+(v0==9)*2+c]:'Ll'[c]+ZLR('Xx'[c],v0-5)))+f1(v1,c)
	},f3=function(x,c){//三位数
		var u=('000'+x).substr(-3),u0=u[0],u1=u.substr(1),v0=+u0,v1=+u1,c=+c||0;
		return (v0<4?ZLR('Cc'[c],v0):(v0==9||v0==4?'Cc'[c]+'DdMm'[+(v0==9)*2+c]:'Dd'[c]+ZLR('Cc'[c],v0-5)))+f2(v1,c)
	},f4=function(x,c){//四位数
		var u=('0000'+x).substr(-4),u0=u[0],u1=u.substr(1),v0=+u0,v1=+u1,c=+c||0;
		return (v0<4?ZLR('Mm'[c],v0):kxo(f1(v0,c)))+f3(v1,c)
	};
	if(tl<5){
		return [f1,f2,f3,f4][tl-1](n,caps)
	}
	r=f3(t.substr(-3),caps);
	tl=ks*3;
	t=('00'+t).substr(-tl);
	////console.log(t);
	for(var i=2;i<ks+1;i++){
		////console.log(t.substr(tl-i*3,3));
		r=Arrfc(copyA(kxo,i-1),f3(t.substr(tl-i*3,3),caps))+r;
	}
	return r

},Roman2n=function(s){//罗马数字（如有横线，字母后加逗号）转成普通数字
	var fi=function(t){//判断单个罗马字母表示几位数
		return t==''?0:(/IV/i.test(t)?1:(/XL/i.test(t)?2:(/CD/i.test(t)?3:4)))
	},k2n=function(t){/*将千以内罗马字母转成数字
		*/
		var tl=t.length,r;
		if(tl){
		//	//console.log(t);
			var t0=t[0].toUpperCase(),t1=(t[1]||'').toUpperCase(),ti0=fi(t0),ti1=fi(t1),is5=/[VLD]/.test(t0),ten=Math.pow(10,(is5?'VLD':'IXCM').indexOf(t0));
			if(is5){
				r=ten*5;
				if(/[XCM]/.test(t1) && ti0==ti1){
					t1=t.replace(new RegExp('^.'+t1+'+','i'),'');
					r+=ten*(tl-t1.length-1)+k2n(t1);
				}else{
					r+=k2n(t.substr(1));
				}
			}else if(ti1==ti0+1){//^10 100
		//		//console.log('^10 100');
				r=ten*9+k2n(t.substr(2))
			}else if(ti1==ti0 && /[VLD]/.test(t1)){//^10 50
		//		//console.log('^10 50');
				r=ten*4+k2n(t.substr(2))
			}else if(t1==t0){//^10+
		//		//console.log('^10+');
				t1=t.replace(new RegExp('^'+t0+'+','i'),'');
				r=ten*(tl-t1.length)+k2n(t1);
			}else{
		//		//console.log('^10 1 10*');
				r=ten+k2n(t.substr(1));
			}

			return r
		}
		return 0
	};
	return s.replace(/\D+,/g, function(t){return ('00'+k2n(t.replace(',',''))).substr(-3)}).replace(/\D+/g, function(t){return ('00'+k2n(t)).substr(-3)}).replace(/^0+/,'')
	


//下列涉及数字正则


},nRegofab=function(s){/*1a2a3b 含字母数字串，转为正则
	1aaa	-> 1(.)\1{2}
	1a2		-> 1(.)[2]
	*/
	var t=s;
	if(/a/.test(s)){
		for(var i=0;i<26;i++){
			var c=String.fromCharCode(97+i);
			if(t.indexOf(c)>-1){
				t=t.replace(new RegExp(c+'+[^'+c+']?','gi'), function(x){
					var l=x.length;
					if(/\d/.test(x[l-1])){
						return copyA('\\'+(i+1),l-1).join('')+'['+x[l-1]+']'
					}else{
						return x.replace(new RegExp(c,'gi'),'\\'+(i+1))
					}
				}).replace('\\'+(i+1),'(.)');
			}else{
				return t
			}
		}
	}
	return t
},nReg2dot=function(r){//数字正则转换成点号表达式。为简化，正则做限制：不允许使用*，只允许[] () . \数字1～9 {数字}
	var s=r.replace(/\[[^\]]+\]/g,'.').replace(/(\\\d|[\.\d])\{\d+\}/g,
		function(t){return ZLR(t.replace(/\{.+/,''),+t.replace(/.+\{|\}/g,''))}).replace(/(\(\.+\))\{\d+\}/g,
		function(t){return t.replace(/\{.+/,'')+ZLR(t.replace(/\).+|\(/g,''),+t.replace(/.+\{|\}/g,'')-1)});
	for(var i=1;i<10;i++){
		if(/\(/.test(s)){
			var p=s.match(/\([^\)]+\)/g)[0].replace(/\(|\)/g,'');
			s=s.replace(new RegExp('\\\\'+i,'g'),p).replace(/\([^\)]+\)/,p);
		}else{
			break
		}
	}
	return s

},nReg2digits=function(r){//正则转换成满足正则条件（但(\d+).+\1这种无法精确满足）的数字串（含[]）。为简化，正则做限制：不允许使用*，只允许[] () . \数字1～9 {数字}
	var s=r.replace(/(\\\d|[\.\d])\{\d+\}/g,function(t){return ZLR(t.replace(/\{.+/,''),+t.replace(/.+\{|\}/g,''))})
		.replace(/\./g,'[0123456789]').replace(/\d-\d/g,function(t){return seqsA(t.replace('-','~')).join('')})
		.replace(/\^\d+/g,function(t){return '0123456789'.replace(new RegExp('['+t.substr(1)+']','g'),'')})
		.replace(/\[\d+\]\{\d+\}/g,
		function(t){return ZLR(t.replace(/\]\{.+/,'')+']',+t.replace(/.+\{|\}/g,''))})
		.replace(/(\(\.+\))\{\d+\}/g,
		function(t){return t.replace(/\{.+/,'')+ZLR(t.replace(/\).+|\(/g,''),+t.replace(/.+\{|\}/g,'')-1)});
	for(var i=1;i<10;i++){
		if(/\(/.test(s)){
			var p=s.match(/\([^\)]+\)/g)[0].replace(/\(|\)/g,'');
			s=s.replace(new RegExp('\\\\'+i,'g'),p).replace(/\([^\)]+\)/,p);
		}else{
			break
		}
	}
	return s

},nReg2A=function(r){//正则转换成满足正则条件（但(\d+).+\1这种无法精确满足）的笛卡尔数组。为简化，正则做限制：不允许使用*，只允许[] () . \数字1～9 {数字}
	var s=nReg2digits(r);
	return Arrf(function(t){return t.join('')}, cartestian(eval(('['+s+']').replace(/[\d\]](?!\]|$)/g,'$&,')))).filter(function(t){return t[0]!='0'})




//下列涉及数字识别


},is0=function(t){return +/^0$/.test(t)

},nis=function(a,pos,negA,pos1,neg1){/*判断正整数a是否满足表达式：整数,2n,2n+1,3n,3n-1,p素数,c合数
		pos 必须都满足的表达式组
		negA 必须都不满足的表达式组
		
		pos1 表达式组中至少有1个被满足
		neg1 表达式组中至少有1个不被满足
	*/
	var n=+a,pA=(pos||'').split(','),nA=(negA||'').split(','),p1A=(pos1||'').split(','),n1A=(neg1||'').split(',');
	var f=function(k,e){//判断满足表达式
		if(/[pc]/.test(e)){
			return e=='p' ^ !isPrime(k)	//异或
		}
		if(/n/.test(e)){//算术表达式
			var b=+(e.split('n')[0])||1, r=+e.split('n')[1]||0;
			if(r<0){r+=b}
			return +((+k)%b==r)
		}

		return +(''+k==e)	//常数

	};
	for(var i=0,l=pA.length;i<l;i++){
		var e=pA[i];
		if(e && !f(n,e)){
			return 0
		}
	}
	for(var i=0,l=nA.length;i<l;i++){
		var e=nA[i];
		if(e && f(n,e)){
			return 0
		}
	}
	
	if(pos1){
		var r=0;
		for(var i=0,l=p1A.length;i<l;i++){
			var e=p1A[i];
			if(e && f(n,e)){
				r=1;
				break;
			}
		}
		if(!r){
			return 0
		}
	}
	
	if(neg1){
		var r=0;
		for(var i=0,l=n1A.length;i<l;i++){
			var e=n1A[i];
			if(e && !f(n,e)){
				r=1;
				break;
			}
		}
		if(!r){
			return 0
		}
	}
	return 1

},nAis=function(A,pos,negA, pos1,neg1, pos1All,neg1All, posA1,negA1){/*判断数组A中正整数a是否满足表达式
		pos 必须都满足的表达式组
		negA 必须都不满足的表达式组
		
		pos1 表达式组中每个表达式至少有A中1个元素满足		满射
		neg1 表达式组中每个表达式至少有A中1个元素不满足		满射

		pos1All 至少有A中1个元素满足表达式组中所有表达式
		neg1All 至少有A中1个元素不满足表达式组中所有表达式
		
		posA1 A中元素都满足表达式组中至少1个表达式			单射
		negA1 A中元素都不满足表达式组中至少1个表达式		单射

	*/

	var n=A.length,p1A=(pos||'').split(','),nA=(negA||'').split(',');
	if(pos || negA){
		for(var i=0;i<n;i++){
			if(pos && !nis(A[i],pos) || negA && !nis(A[i],'',negA)){
				return 0
			}
		}
	}
	if(posA1 || negA1){
		for(var i=0;i<n;i++){
			if(posA1 && !nis(A[i],'','',posA1) || negA1 && !nis(A[i],'','','',posA1)){
				return 0
			}
		}
	}

	if(pos1All){
		var r=0;
		for(var i=0;i<n;i++){
			if(nis(A[i],pos1All)){
				r=1;
				break;
			}
		}
		if(!r){//A中没有元素全满足
			return 0
		}
	}
	if(neg1All){
		var r=0;
		for(var i=0;i<n;i++){
			if(nis(A[i],'',neg1All)){
				r=1;
				break;
			}
		}
		if(!r){//A中没有元素全不满足
			return 0
		}
	}


	if(pos1){
		for(var i=0,l=p1A.length;i<l;i++){
			var r=0;
			for(var j=0;j<n;j++){
				var a=A[j];
				if(nis(a,p1A[i])){//只要有1个元素a满足
					r=1;
					break;
				}
			}
			if(!r){//A中没有元素满足
				return 0
			}
		}
	}
	if(neg1){
		for(var i=0,l=n1A.length;i<l;i++){
			var r=0;
			for(var j=0;j<n;j++){
				var a=A[j];
				if(nis(a,'',n1A[i])){//只要有1个元素a不满足
					r=1;
					break;
				}
			}
			if(!r){//A中没有元素满足
				return 0
			}
		}
	}
	return 1

},nisd=function(n,notNeg){//判断表达式是数字（仅整数、小数）	参数notNeg 指定是否非负
	return /^-?\d+\.?\d*$/.test(n) && (notNeg?!/-/.test(n):1)

},nisVd=function(n,notNeg){//判断表达式是单字母或数字
	return isVar(n)||nisd(n,notNeg)

},nisVid=function(n,notNeg){//判断表达式是单字母（可含下标格式：A_i A_12 A_{1i} A_(1i) A_(10,23) A_(i,j) A_{i,j} A_{i_1} A_{i_{1k}} A_{i_1,j_2} A_{i_{1m},j_{2n}} ）或数字
	if(nisVd(n,notNeg)){
		return true
	}
	if(notNeg && /^-\d+/.test(n) || !notNeg && /^[^a-z]/i.test(n)){
		return false
	}
	if(/_/.test(n) && isVar(n.split('_')[0])){
		var n1=n.split('_')[1];
		if(nisVd(n1)){return true}
		
		if(/^\(.+\)$/.test(n1) || /^\{.+\}$/.test(n1)){
			n1=n1.replace(/^.|.$/g,'');
			if(/^[\da-z]+[,\da-z]*$/i.test(n1) || nisVid(n1)){return true}
			if(/,/.test(n1)){
				return Arrf(nisVid,n1.split(',')).indexOf(false)<0
			}
		}
	}
	return false
	
},nisSupSuffix=function(n){//判断表达式是上标后缀
	return /^[\*TH†]$/.test(n)

},nisfrac=function(n,notNeg){//判断表达式是有理数	参数notNeg 指定是否非负
	return /^-?\d+[/]?\d*$/.test(n) && (notNeg?!/-/.test(n):1)

},nisn=function(n0,sign,qType,fracType){/*判断表达式是数字（整数、分数、有理数）	不考虑小数、百（千、万）分数等情况
	参数
		sign	符号为（-1负数,0,1正数）	默认值：null任意
		qType 有理数类型（-1小数，0整数，1分数）	默认值：null任意
		fracType 分数类型
				-2假分数（分子>=分母） 
				-1非既约分数（可约分）
				0（化简后是整数）的假分数
				1最简分数(既约分数，不含整数)
				2真分数（分子<分母））
			默认值：null任意
				非null, 则认为qType=1
			
		*/
	var n=nTrim(n0),l=arguments.length;
	if(!/^-?\d+([\/\.]\d+)?$/.test(n)){
		return 0
	}
	if(l==1){
		return 1
	}

	if(sign===1 && (/^-/.test(n) || n=='0') || sign===-1 && !/^-/.test(n) || sign===0 && n!='0'){
		return 0
	}

	if(qType===-1 && !/^-?\d+\.\d+$/.test(n) || qType===0 && !/^-?\d+$/.test(n) || (qType===1||l>3) && !/^-?\d+\/\d+$/.test(n)){
		return 0
	}

	if(l>3){
		var A=n.replace(/-/,'').split('/');
		if(fracType===0 && A[0]!=A[1] || fracType===2 && !Integer.is.b2['<'](A[0],A[1]) || fracType===-2 && Integer.is.b2['<'](A[0],A[1])){
			return 0
		}
		var F=FracReduct(n);
		if(fracType===-1 && F==n|| fracType===1 && F!=n){
			return 0
		}
	}
	return	1



//下列涉及数字精度计算
		
},digi=function(n,k){//精确到小数位，然后去除小数尾0
	return +(n.toFixed(k||2).replace(/\.0+$/,'').replace(/(\.\d)0/,'$1'));

},Nsqrt=function(n){/*大整数取平方根（向下取整） n是BigInt类型


Math.sqrt(Number(444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444n))
2.1081851067789195e+55


	a² < x² < b²
	(a+b)^2=a^2+2ab+b^2
	2ab+b^2=(ab+b^2/2)^2
	
	
	目前最好的算法，是卡马克算法（优点：无除法，循环迭代少，精度高；缺点：依赖一个Magic Number神奇初始值0x5f375a86，需要理解数字存储机制，难理解）
	
	其它算法：二分法（慢），牛顿法
	
	https://blog.csdn.net/yutianzuijin/article/details/78839981
	
	
	2345436565565465464576859231434
	
	2
	*/
	
	if(BigInt){
	
		var r=Math.trunc(Math.sqrt(Number(n))), m=BigInt(0);
		if(/e/.test(r)){
			r=BigInt((''+r).replace(/\.|e.+/g,'')+'0'.repeat(+(''+r).split('+')[1]-(''+r).replace(/.\.|e.+/g,'').length))
		}else{
			r=BigInt(r)
		}

		while(m<n){
			r++;
			m=r*r;
		}
		return r
	}else{
		return Math.trunc(Math.sqrt(Number(n)))
		
	}




//下列涉及分数化简计算


	
},fracReduct=function(m,n){/*约分	分子、分母都是整数
	返回字符串：a/b 或者整数a
	*/

	var a=nTrim(m),b=nTrim(n),t=gcd([a,b]);
	if(a=='0'){return 0}
	var s=a[0]=='-' ^ b[0]=='-'?'-':'';


	a=Integer.oprs('/',[a.replace('-',''),t])[0];
	b=Integer.oprs('/',[b.replace('-',''),t])[0];
	
	return s+a+(b=='1'?'':'/'+b)

},FracReduct=function(f,vulgar){/*化成既约分数 返回字符串
	参数f 		可以是字符串，或数组[分子,分母]
	参数 vulgar 指定返回带分数数组['k','a/b']

	*/
	if(isArr(f)){
		var v=fracReduct(f[0],f[1]);
	}else{
		var m=nTrim(f), md=/[\.%‰‱]/.test(m),mf=/\//.test(m),v=''+m;
		if(md){
			v=n2frac(m)
		}else if(mf){
			v=m.split('/');
			v=fracReduct(v[0],v[1]);
		}else{//是整数
			v=v.replace(/^0+/,'')||'0'
		}
	}
	if(vulgar){
		v=v.split('/');
		if(v.length==2){
			var v0=+v[0].replace(/-/,''),v1=+v[1];
			return [v[0][0].replace(/[^-]/,'')+Math.floor(v0/v1),(v0%v1)+'/'+v1]	//这里需要用Integer.oprs('/',[v0,v1]) 进行改造，以支持大数
		}else{
			return ['0',v.join('/')]
		}
	}
	return v

},fracOpr=function(o,x,y){/*分数二元运算 
		分数运算	返回 字符串


			+ - * / 封闭
			^ 整数幂 封闭
			  分数幂 得到开根号的无理数 (a/b)^(c/d)

			  含根号数乘除有理数
			 
		关系运算		返回 逻辑0,1
	
	*/

	
//console.log(o,x,y);
	var A=(''+FracReduct(x)).split('/'),B=(''+FracReduct(y)).split('/'),l=A.length+B.length,s,op=opreplace0(o,1),m=A.join('/'),n=B.join('/');

	if(/[\|∤]/.test(op)){
		if(+m==0||l>2){return 0}
		return +(op=='|' && !((+n)%(+m))||op=='∤' && (+n)%(+m))

	}
	
	if(/[≤=≥<>]=?/.test(op)){
		var r=fracOpr('-',m,n);
		if(/^0$/.test(r)){
			return +/[≤=≥]/.test(op)
		}if(/^-/.test(r)){
			return +/[≤<]/.test(op)
		}else{
			return +/[≥>]/.test(op)
		}
	}
//console.log(op,m,n);

	var Ahasi=/i/.test(m),Bhasi=/i/.test(n);
	if(Ahasi || Bhasi){
		//var mon=(m[0]=='-' && op!='^'?'-'+pp(m.substr(1)):pp(m))+op+pp(n);	//mathjs bug math.simplify(math.parse('(-1/24)*(4i-8)')).toString()
		var mon=pp(m)+op+pp(n);
		console.log(mon);
		if(/√/.test(mon)){
			mon=mon.replace(/√(\d+)/g,'^(1/$1)');
		}
		var r=Mfn.fromStr(math.simplify(math.parse(mon)).toString()).toStr();
		console.log('r=',r);
		return r
	}

	if(l==2){//整数运算
		if(op=='/'){
			return fracReduct(m,n)
		}else if(op=='^'){
			return Integer.oprs(op,[m,n]) //Math.pow(m,n)
		}else if(op=='#'){//商，忽略余数	相当于JS中的 (m-m%n)/n 以及 Math.floor(m/n)
			return Integer.oprs('/',[m,n])[0]
		}else if(op=='%'){//余数	相当于JS中的 m%n
			return Integer.oprs('/',[m,n])[1]
		}else if(/^[\+\-\*\/]$/.test(op)){//
			return Integer.oprs(op,[m,n])

		}else{
			//console.log(m,op,n);
			return eval(m+op+pp(n)) //加括号，防止n是负数时报错
		}
	}
	if(l==3){
		if(A.length==1){
			A[1]=1
		}else{
			B[1]=1
		}
	}
	A[0]=+A[0];A[1]=+A[1];//m的分子，分母
	B[0]=+B[0];B[1]=+B[1];//n的分子，分母

	if(/[\+\-]/.test(op)){
//		//console.log(A,B);
		s=lcm([A[1],B[1]]);
		A[0]=s/A[1]*A[0];
		B[0]=s/B[1]*B[0];
//		//console.log(A,B);
		return fracReduct(A[0]+B[0]*(op=='+'?1:-1),s)

	}else if(/[\*\/]/.test(op)){
		return fracReduct(A[0]*B[op=='*'?0:1],A[1]*B[op=='*'?1:0])

	}else if(/[\^]/.test(op)){

		if(l==3 && A[1]!=1){	//分数的整数幂
			if(!B[0]){
				return 1
			}
			s=Math.abs(B[0]);
			if(s!=1){
				A[0]=Math.pow(A[0],s);
				A[1]=Math.pow(A[1],s);
			}
			if(B[0]<0){
				s=A[0];
				A[0]=A[1];
				A[1]=Math.abs(s);
				if(s<0){
					A[0]=-A[0];
				}
			}
			return A[0]+(A[1]==1?'':'/'+A[1])
		}
		if(B[0]<0){	//负幂
			B[0]=-B[0];
			s=A[0];
			A[0]=A[1];
			A[1]=Math.abs(s);
			if(s<0 && B[0]%2){
				A[0]=-A[0]
			}
		}
		//var isneg=A[0]<0?(B[1]%2 && B[0]%2?'-':(B[0]%2?'(-1)^('+B[0]+'/'+B[1]+')×':'')):'';
		var isneg=A[0]<0?(B[1]%2 && B[0]%2?'-':(B[0]%2?(B.join('/')=='1/2'?'i':'(-1)^('+B[0]+'/'+B[1]+')×'):'')):'';
		if(A[0]<0){
			A[0]=-A[0]
		}

		//console.log('有理数幂',A.join('/'),B.join('/'),A,B);
		
		//下面对A分子，分母分别进行因式分解，因子公重数(>1)，如果与B分母，可以约分，则化简
		if(A[1]!=1){//分数的分数幂
			var a=factorA(A[0]),ga=+gcd(a[1]);
			var b=factorA(A[1]),gb=+gcd(b[1]);
			//console.log('A: ','a=',a.join(' ;; '),'b=',b.join(' ;; '),'ga = ',ga,'gb = ',gb)
			if(gb>1){
				var gab=A[0]==1?gb:+gcd([ga,gb]);
				//var gab=+gcd([ga,gb]);
				if(gab>1){
					//console.log('gab= ',gab)
					var gabc=+gcd([gab,B[1]]);
					if(gabc>1){
						
						//console.log(A,B,'gabc = ',gabc);
						//console.log('a = ',a.join(' ; '),'b = ',b.join(' ; '));
						
						a[1]=Arrf(function(x){return x=='1'?x:Integer.oprs('/',[x,gabc])[0]},a[1]);
						//console.log('a = ',a[0],' ;;; ',a[1]);
						a=factorA2n(a);
						
						
						//console.log('a = ',a);
						b[1]=Arrf(function(x){return x=='1'?x:Integer.oprs('/',[x,gabc])[0]},b[1]);
						b=factorA2n(b);
						
						//console.log('b = ',b);
						
						A=[a,b];
						
						//console.log('A = ',A);
						
						B[1]/=gabc;
						
						if(B[1]==1){//整数幂
							if(B[0]==1){
								return  isneg?isneg+(isneg=='-'?A.join('/'):pp(A.join('/'))):A.join('/')
									
							}else{//2^10 3^6 4^5 5^4 (6~10)^3 (11~32)^2
								//console.log(A,B);
								var m=max(A);
								if(m<=32 && B[0]<=10 && Math.pow(m,B[0])<=1024){
									Arrf(function(t){return Math.pow(t,B[0])},A);
									return  isneg+Arrf(function(t){return Math.pow(t,B[0])},A).join('/')
									
								}else{
									
									return  isneg+pp(A.join('/'))+'^'+B[0];
								}
							}
						}
						
					}
				}
			}

		}else{//整数的分数幂
			if(A[0]=='1'){
				return isneg||'1'
			}
			var a=factorA(A[0]);
			//遍历质因数，重数是分数幂的分母的倍数，则约分；或者重数比分数幂的分母大时，减去最大的倍数，约分后，移到根号外
			var IA=[[],[]];
			//	console.log(a.join(' & '),B[1]);
				a[1]=Arrf(function(x,i){
					if(x!='1' && Integer.is.b2['≤'](B[1],x)){	//Integer.is.b2['|'](B[1],x)
						var y=Integer.oprs('/',[x,B[1]]);
						IA[0].push(a[0][i]);
						IA[1].push(y[0]);
						return y[1]
					}
					return x
				},a[1]);

				if(IA[0].length){

					a=factorA2n(a);
					var k=isneg+factorA2n(IA);
					
					if(a=='1'){
						return k
					}
					if(a=='-1'){
						if(B.join('/')=='1/2'){
							return k+'i'
						}
						console.log(-1,B.join('/'));
						return k+pp(a)+'^('+B.join('/')+')'
					}
					//A=[a,1];
					return k+'⋅'+a+'^('+B.join('/')+')'
				}

			return isneg+A[0]+'^('+B.join('/')+')';
		}


	//console.log('最终 ',isneg+pp(A.join('/'))+'^('+B.join('/')+')');
		return isneg+pp(A.join('/'))+'^('+B.join('/')+')';
	}

};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var Perm={//置换 本质上是一维数组（行向量，n列）
	//A.t='Perm';

	build:{//直接构造

		I:function(m){//单位恒等置换 m指定元素数
			var A=seqA(1,m);A.t='Perm';
			return A
		},
		C:function(CA,m){//轮换 m指定元素数
			var A=seqA(1,m),n=CA.length;A.t='Perm';
			for(var i=0;i<n;i++){
				var CAi=CA[i];
				A[CAi-1]=CA[(i+1)%n]

			}
			return A
		},
		replace:function(V,arr,j){/* 替换向量中的部分列（从第j列开始），构成新向量
			*/
			var A=Perm.opr1('拷',V);
			for(var k=0;k<arr.length;k++){
				A[j-1+k]=arr[k]
			}
			return A
		}
	},
	is:{//布尔逻辑
		b1:{//一元关系
			"I":function(A){return +/^(0,)*1(,0)*$/.test(A)},//是否为单位向量
			"0":function(A){return +(A.length<1 || /^(0,)*0$/.test(A))},//是否为零或空数组
			
		},
		b2:{//二元关系
			"=":function(A,B){
				return +(A.join()==B.join())
			},
			"≠":function(A,B){
				return +(A.join()!=B.join())
			},
			"n=":function(A,B){//判断是否维数一致
				return +(A.length==B.length)
			},

			"⊆":function(A,B){//定义（同维）向量的包含关系：前者非零元，与后者相应位置的元都相等
				var n=A.length;
				if(n!=B.length){return 0}
				for(var j=0;j<n;j++){
					var Aj=A[j];
					if(Aj && Aj!=B[j]){
						return 0
					}
				}
				return 1
			},
			"⊂":function(A,B){return +(!Perm.is.b2['='](A,B) && Perm.is.b2['⊆'](A,B))},
			"⊇":function(A,B){return +Perm.is.b2['⊆'](B,A)},
			"⊃":function(A,B){return +(!Perm.is.b2['='](A,B) && Perm.is.b2['⊆'](B,A))},
			"⊄":function(A,B){return +(!Perm.is.b2['⊂'](A,B))},
			"⊅":function(A,B){return +(!Perm.is.b2['⊃'](A,B))},
			"⊈":function(A,B){return +(!Perm.is.b2['⊆'](A,B))},
			"⊉":function(A,B){return +(!Perm.is.b2['⊇'](A,B))},
		}
	},
	fromStr:function(s){
		//两种输入：直接：12345相应的新号、轮换乘积()()n
		var str2A=function(t){
			return Arrf(function(x){return +x},t.replace(/\(|\)/g,'').split(/[ ,]/.test(s)?/[ ,]/:''))
		},A;

		if(/\(/.test(s)){//轮换乘积
			var ones=!/[ ,]/.test(s),Cs=s.match(/\([^\)]+\)/g),n=Cs.length,m=+s.replace(/.+\)/,'')||max(s.replace(/\D/g,ones?'':' ').split(ones?'':/[ ,]/));
			if(n<2){
				return Perm.build.C(str2A(Cs[0]),m)
			}else{
				A=seqA(1,m);
				for(var i=0;i<n;i++){
					A=Perm.opr2('*',[A,Perm.build.C(str2A(Cs[i]),m)])
				}
			}

		}else{
			A=str2A(s);
		}
		A.t='Perm';
		return A
	},

	toStr:function(A,typ){//转成文本
		/* typ输出类型
			txt纯文本 \t \n
			Perm矩阵形式（默认）
			CT 轮换或对换乘积	cyclic permutation循环置换,轮换	transposition 对换

		*/
		
//console.log(A,A[0]);
consolelog(A,typ);
		var type=typ||(A.typ?A.typ:'Perm'),txt=type=='txt',sft=type=='soft',n=2,m=A.length,sepc=txt?'\t':(sft?',':''),sepr=txt?'\n':(sft?';':''),r=[];
		if(txt||sft){
			for(var i=0;i<n;i++){
				r.push((i?A:seqA(1,m)).join(sepc))
			}
			return r.join(sepr);
		}else{
			consolelog(A,type);
			if(type=='CT'){//A是二维数组

				for(var i=0;i<m;i++){
					r.push('('+A[i].join(' ')+')')
				}
				return r.join('')
			}
			return lrp('',zarray([seqA(1,m),A]),'','')
		}

	},

	opr1:function(op,A,p){
//向量一元运算 p是可选参数
consolelog(op,A,p);
//console.log('p ',p);
		var B=[],n=A.length,ar=arguments, arl=ar.length; B.t='Perm';

		if(op=='奇偶性'){


		}
		if(op=='逆'){
			for(var i=0;i<n;i++){
				B.push(A.indexOf(i+1)+1)
			}
		}
		if(op=='阶'){//置换写成不交轮换的乘积,然后置换的阶就是每个轮换的阶(即长度）的最小公倍数
			return lcm(Arrf(function(t){return t.length},Perm.opr1('轮换分解',A)))
		}
		if(op=='轮换分解'){
			B.t='CT';
			var C=[];
			
			for(var i=0;i<n;i++){
				if(C.length==n){break}
				var Ai=A[i];
				if(Ai>i+1 && C.indexOf(Ai)<0){
					var Bi=[i+1,Ai],b=1;
					C.push(i+1,Ai);
					while(b){
						var Aj=A[Bi.slice(-1)[0]-1];
						if(Aj!=Bi[0]){
							Bi.push(Aj);
							C.push(Aj);
						}else{
							break;
						}
					}
					B.push(Bi)
				}
			}
		}
		if(op=='对换分解单个轮换'){
			for(var i=0;i<n-1;i++){
				B.unshift([A[i],A[(i+1)%n]])
			}
		}
		if(op=='对换分解'){
			var C=Perm.opr1('轮换分解',A),cn=C.length;
			for(var i=0;i<cn;i++){
				B=B.concat(Perm.opr1('对换分解单个轮换',C[i]))
			}

		}
		if(op=='拷'){
			for(var j=0;j<n;j++){
				B.push(A[j])
			}
		}
		return B
		
	},
		
	opr2:function(op,A){
		//置换二元运算
		var C=[],l=A.length,n=A[0].length;
		C.t='Perm';


		if(op=='*'){/*置换乘积	从右往左运算
			相当于第1行为原始序号
			第2行是B
			第3行是以B为序号，从A中查找相应值
			得到结果为新置换值
			*/
			C=Perm.opr1('拷',A[l-1]);
			for(var i=0;i<n;i++){
				var a=A[l-2][i];
				if(a!=i+1){
					C[C.indexOf(i+1)]=''+a;
				}
			}
			C=Arrf(Number, C);
			return l<3?C:Perm.opr2('*',[].concat(A.slice(0,l-2),C));
		}
		if(op=='^'){//置换幂，反复左乘A
			C=Perm.opr1('拷',A[0]);
			for(var i=0;i<A[1];i++){
				C=Perm.opr2('*',[A[0],C]);
			}
			return C
		}



	}


//下列涉及排列组合函数
},factoradicDirectSum=function(A){//阶乘进制	 直和加法（不实现进位，退位）
	var B=[];
	for(var i=0,l=A.length;i<l;i++){
		var Ai=A[i], Ain=Ai.length, Bn=B.length;
		if(Bn<Ain){
			B=copyA(BigInt('0'),Ain-Bn).concat(B);
			Bn=Ain;
		}
		for(var j=0;j<Ain;j++){
			B[Bn-j-1]=(B[Bn-j-1]||BigInt(0))+Ai[Ain-j-1]
		}

	}
	return B
},factoradicNorm=function(A,p){//阶乘进制	 规范化（各位值绝对值，不大于索引号，从右往左1! 2! 3! ... ）（参数p，指定进位的符号方向，1，往正数方向计算；-1，往负数方向；0，往绝对值最小的方向）
	var n=A.length,B=[].concat(A);
	for(var i=0;i<n;i++){
		var ni=n-1-i, Bi=B[ni], d=i+1, bd=BigInt(d), pi=p;

		if(!p){
			if(Bi>bd){
				pi=1;
			}
			if(-Bi>=bd){
				pi=-1;
			}
		}

		if(pi==1){
			if(Bi>bd){// 进位
				var q=Bi / bd, r=Bi % bd;
				B[ni]=r;
				if(ni){
					B[ni-1]+=q;
				}else{
					B.unshift(q)
				}

			}else if(Bi<0){// 补位
				var q=(-Bi) / bd+BigInt(1), r=bd - (-Bi) % bd;
				B[ni]=r;
				if(ni){
					B[ni-1]-=q;
				}else{
					B.unshift(-q)
				}
			}

		}else if(pi==-1){
			if(-Bi>=bd){// 进位
				var q=(-Bi) / bd, r=(-Bi) % bd;
				B[ni]=-r;
				if(ni){
					B[ni-1]-=q;
				}else{
					B.unshift(-q)
				}

			}else if(Bi>0){// 补位
				var q=Bi / bd+BigInt(1), r=bd - Bi % bd;
				B[ni]=-r;
				if(ni){
					B[ni-1]+=q;
				}else{
					B.unshift(q)
				}
			}
		}
		
	}


	return B


},factoradic=function(n){//十进制 整数（暂不实现小数） 转成 阶乘进制	
	var t=BigInt(n||0),rA=[], r=t,i=BigInt(2);
	if(t<=BigInt(0)){return [BigInt(0)]}

	while(t){
		var r=t%i;
		rA.unshift(r);
		t=t/i;
		i++;
	}
	return rA

},factoradic2bigInt=function(A){//阶乘进制	整数（暂不实现小数） 转成 十进制	
	var i=BigInt(A.length),j=BigInt(0), x=BigInt(0);

	while(i){
		if(A[j]){
			x+=A[j]*Factb(i);
			//console.log(x);
		}
		i--;
		j++;
	}
	return x

},Factb=function(n){//阶乘		factorial	b使用BigInt
	var t=BigInt(n||0);
	if(t<=BigInt(0) || t==BigInt(1)){return BigInt(1)}
	return Factb(t-BigInt(1))*t

},FactbTrim0=function(n,div2){//阶乘 去除尾零	参数div2，指定需要除以2的幂次（弥补之前除以5之后的影响，修正目的）

	/*

	计算极限
(999999999n**10478n+'').length == 94302

(Factb(9675)+'').length == 34362


(FactbTrim0(9674)+'').length == 31943

FactbTrim0(9675)		 Uncaught SyntaxError: Invalid regular expression: /0+$/: Stack overflow

	*/


	
//方法1
	var t=BigInt(n||0);
	if(t<=BigInt(0) || t==BigInt(1)){return BigInt(1)}
	var x=Factb(t-BigInt(1))*t;
	while(!(x%BigInt(10))){
		x/=BigInt(10)
	}
	return x

//方法2

var t=BigInt(n||0);
if(t<=BigInt(0) || t==BigInt(1)){return BigInt(1)}
if(/0$/.test(t)){
	var s=BigInt((t+'').replace(/0+$/,''));
	return BigInt((FactbTrim0(t-BigInt(1),d)*s+'').replace(/0+$/,''))
}

return BigInt((FactbTrim0(t-BigInt(1))*t+'').replace(/0+$/,''))




//方法3


	var t=BigInt(n||0), d=div2||0;
	if(t<=BigInt(0) || t==BigInt(1)){return BigInt(1)}
	if(/0$/.test(t)){
		var s=BigInt((t+'').replace(/0+$/,''));
		while(/5$/.test(s)){
			s/=BigInt(5);
			d++;
		}

		while(/[2468]$/.test(s) && d){
			s/=BigInt(2);
			d--;
		}

		return FactbTrim0(t-BigInt(1),d)*s
	}

	var s=t;
	while(/5$/.test(s)){
		s/=BigInt(5);
		d++;
	}

	while(/[2468]$/.test(s) && d){
		s/=BigInt(2);
		d--;
	}

	return FactbTrim0((t-BigInt(1)),d)*s

},Fact=function(n){//阶乘 n<22时
	var t=+n||0;
	if(t<=0 || t==1){return 1}
	return Fact(t-1)*t
		
},Fact2=function(n){//双阶乘
	var t=+n||0;
	if(t<=0 || t==1){return 1}
	return Fact2(t-2)*t
		
},Permut=function(n,m){//排列数
	var t=+n||0,s=+m||0,v=1;
	for(var i=s;i>0;i--){
		v*=t--
	}
	return v
},Combin=function(n,m){//组合数
	var t=+n||0,s=+m||0;
	if(t==s){return 1}
	if(t<s || t<0 || s<0){return 0}
	if(t<s*2){
		return Combin(t,t-s)
	}
	
	if(s==0){
		return 1
	}
	
	return Permut(n,m)/Fact(m)

},FactN=function(n){//阶乘，全排列索引【n只允许是个位数，两位数运算量太大】	从1开始计数
	if(n>9){
		return 0
	}
	var t=+n||0,a=[];
	if(t<=1){return ['1']}
	var s=FactN(t-1);
	for(var j=0;j<=s[0].length;j++){
		for(var i=0;i<s.length;i++){
			a.push(s[i].substr(0,j)+n+s[i].substr(j))
		}
	}
	return a

},PermutN=function(n,m,A){//生成排列数索引 [,,,]+	A过滤条件数组[列号（从1开始编号）,[条件数组（正数表示肯定，负数表示否定，从1开始编号）]]+：[[3,[1,2]],[6,[-1,-2]], [4,-1]]	
//	【n一般只允许是个位数，两位数运算量太大】		返回索引，从0开始计数
	if(m>9){
		return 0
	}
    var t=[],P=[],ms=FactN(m),CN=CombinN(n,m);

	if(m==0){
		return []
	}
	if(m==1){
		return seqA(0,n)
	}

	Arrf(function(j){//组合数索引中的1条
		Arrf(function(k){//全排列索引中的1条
			var jk=Arrf(function(s){return j[+s-1]},k.split(''));
			if(A){
				for(var ai=0;ai<A.length;ai++){
					var Ai=A[ai],Ai0=Ai[0]-1,Ai1=Ai[1],Ai1A=isArr(Ai1),ji=jk[Ai0],neg=Ai1A && Ai1[0]<0 || !Ai1A && Ai1<0;
					
					if(neg && (Ai1A && Ai1.indexOf(-ji-1)>-1 || !Ai1A && ji==-Ai1) || !neg && (Ai1A && Ai1.indexOf(ji+1)<0 || !Ai1A && ji!=Ai1)){
						return 
					}
				}
			}
			P.push(jk)
			},ms);
		},CN);

	return P.sort()

},CombinN=function(n,m){//生成组合数索引 [,,,]+		从0开始计数
	var t=[];
	if(m==0){
		return []
	}
	if(m==1){
		return seqA(0,n)
	}
	Arrf(function(i){
		t=t.concat(Arrf(function(j){return [i].concat(Arrf(function(k){return k+i+1},j))},CombinN(n-1-i,m-1)));
	},seqA(0,n-m+1));
	return t


},RandomPermutN=function(n,m){//生成随机排列数索引（有顺序）
	
},RandomCombinN=function(n,m){//生成随机组合数索引（无顺序）
	var a=[];
	while(a.length<m){
		var t=Random(n);
		if(a.indexOf(t)<0){
			a.push(t)
		}
	}
	return a

},RandomCombinA=function(A,m){//生成某个集合的随机组合子集（随机选m个元素）
	return ArrI(A,RandomCombinN(A.length,m),1)





//下列涉及排列逆序数

},nInvOrder=function(A){//逆序数
	var a=0,n=A.length;
	for(var i=0;i<n;i++){
		var Ai=+A[i];
		for(var j=i+1;j<n;j++){
			if(+A[j]<Ai){
				a++;
			}
		}
	}
	return a

},nInvOrder_=function(A){//逆序数奇偶性，得出正负符号
	
	return 1-2*(nInvOrder(A)%2)



};

/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var Prop={//命题 本质上是dom（html）
	build:{
		
	},
	wrap:function(op,t){//操作符加壳
		var o,os,opr='∨∧↓↑↔↮→↛',OPR='disj conj ndisj nconj equi nequi impl nimpl',Opr=opr.split(''),oprs=ZLR(OPR);
		if(/[a-z]/.test(op)){
			os=op;
			o=opr[oprs.indexOf(os)]
		}else{
			o=op;
			os=oprs[opr.indexOf(o)]
		}
		return DCtv('opr '+os+'" data-opr="'+o+'" data-oprs="'+os,t)
	},
	fromStr:function(s, typ){//数学表达式（字符串）→html   typ:	set指定集合运算形式的公式
		if(typ=='set' || /[∩∪∅U]/g.test(s)){
			var v=s.replace(/-/g,'∧¬').replace(/[∩∪∅U⊕⊗]/g,function(s){return '∧∨FT↮↔'['∩∪∅U⊕⊗'.indexOf(s)]})
		}else if(typ=='bool' || /[⋅\+01']/g.test(s)){
			var v=s.replace(/[a-z]{2,}/ig,function(t){return t.split('').join('∧')}).replace(/([a-z\)])\(/ig,'$1∧(')
					.replace(/([a-z])\'/ig,'¬$1').replace(/\(([^\(\)]*\([^\(\)]+\)[^\(\)]*)*\)\'/ig,function(t){return '¬'+t.substr(0,t.length-1)})
					.replace(/-/g,'∧¬').replace(/[⋅\+01⊕⊗]/g,function(s){return '∧∨FT↮↔'['⋅+01⊕⊗'.indexOf(s)]})

		}else{
			var	v=s.replace(/​/g,'').replace(/\s/g,'').replace(/〉/g,'>').replace(/〈/g,'<')
				.replace(/‐/g,'-').replace(/(←→)|(<-+>)|⊗/g,'↔').replace(/⊕/g,'↮').replace(/-+>/g,'→')
				.replace(/[┐┒┓-﹁]/g,'¬').replace(/[⋀Λ⋂∩\*\^]/g,'∧').replace(/[⋁⋃∪\+]/g,'∨')
				.replace(/[\[（﹙〔]/g,'(').replace(/[\]）﹚〕]/g,')');
			if(/[a-u]|[w-z]/.test(v) && /V/.test(v)){
				v=v.replace(/V/g,'∨')
			}
		}
//console.log(v);
		var E=('('+v+')').replace(/([A-Z])/ig,DCtv('var','$1')).replace(/0/g,DCtv('false')).replace(/1/g,DCtv('true'));
		while(/¬</.test(E)){
			E=E.replace(/¬(<[^/]+\/div>)/g,DCtv('neg','$1'));
		}
//console.log(E);
		while(/\(/.test(E)){
			E=E.replace(/¬*\([^\(\)]+\)/g, function(t){
				var neg=/^¬/.test(t), s=t.replace(/^¬*\(|\)$/g,''), T, o=$('<div>'+s+dc), chd='';
				o.children().each(function(){
					chd+=this.outerHTML;
				});
				o.children().remove();
				o=o.text();
//console.log(o);
				if(o){
					o=o[0];
//console.log(o);
					T=Prop.wrap(o,chd);
				}else{
					T=s
				}
//console.log(T);
				if(neg){
					for(var i=0;i<t.replace(/[^¬]+.*$/,'').length;i++){
						T=DCtv('neg',T)
					}
				}
//console.log(T);
				return T
			});
		}
//console.log(E);
		return E
	},

	toStr:function(d, typ, direct){//html→数学表达式（字符串）	set指定返回集合运算形式的公式 direct直接字符串替换，无需dom
		var t=(''+Math.random()).substr(-5);//Time.now5()+(''+Math.random()).substr(-5);
		if(!direct){
			$('#dom').append(DCtv('dom" id="d'+t,typeof d == 'string'?d:$(d).html()));
			var D=$('#d'+t), ds=D.children(), end=false, endn=0;
	//console.log('#d'+t,ds.length);
			while(!end && endn<100){
				ds.each(function(){
					var d=$(this);
					if(d.is('.neg')){
						d.replaceWith('¬'+d.html());
					}else if(d.is('.opr')){
						d.children().slice(0,d.children().length-1).after(d.attr('data-opr'));
						d.replaceWith('('+d.html()+')');
					}else if(d.is('.var')){
						d.replaceWith(d.text())
					}else if(d.is('.false,.true')){
						d.replaceWith(d.attr('class').toUpperCase())
					}
				});
				ds=D.children();
				end=!ds.length;
				endn++;
			}
	//console.log($('#d'+t).html(),ds.length);
			var s=D.text().replace(/^\((.+)\)$/,'$1');
			D.remove();
		}else{
			var s=d
		}
//console.log(D.html(),s);

		if(typ=='set'){//命题→集合运算
			s=s.replace(/∧¬/g,'-').replace(/[∧∨FT↮↔]/g,function(s){return '∩∪∅U⊕⊗'['∧∨FT↮↔'.indexOf(s)]})
		}
		if(typ=='bool'){//命题→布尔代数
			s=s.replace(/¬([a-z])/ig,'$1\'').replace(/∧¬/g,'-').replace(/[∧∨FT↮↔]/g,function(s){return '⋅+01⊕⊗'['∧∨FT↮↔'.indexOf(s)]}).replace(/⋅/g,'')
		}

		return s;
	},

	opr1:function(op,d){//一元运算
		var D=$(d),h=D[0].outerHTML;
		if(op=='¬'){//反命题
			if(D.is('.true')){
				h=h.replace(/true/,'false');
			}else if(D.is('.false')){
				h=h.replace(/false/,'true');
			}else if(D.is('.neg')){
				h=D.html();
			}else{
				h=DCtv('neg',h);
			}
		}
		if(op=='偶'){//对偶 
					//合取 Conjunctive 析取 Disjunctive 蕴含 Implication 等价 Equivalence
			var t=Time.now5()+(''+Math.random()).substr(-5);$('#dom').append(DCtv('dom" id="d'+t,typeof d == 'string'?d:$(d)[0].outerHTML));
			var D=$('#d'+t);
	//T ←→ F
			D.find('.true').toggleClass('true false');
	//∨ ←→ ∧
	//↑ ←→ ↓
	//p↔q ⇒ p↮q ⇔ ¬(p→q)
	//p→q ⇒ q↛p ⇔ ¬(q→p)
			var d1,d2,oprs=ZLR('disj conj ndisj nconj equi nequi impl nimpl');
			for(var i=0;i<4;i++){
				var m=oprs[i*2],n=oprs[i*2+1];
				d1=D.find('.'+m);
				d2=D.find('.'+n);
				d1.each(function(){
					var me=$(this),h=me.html();
					if(m=='impl'){
						var chd=me.children();
						h=chd[1].outerHTML+chd[0].outerHTML;
					}
					me.replaceWith(Prop.wrap(n,h))
				});
				d2.each(function(){
					var me=$(this),h=me.html();
					if(n=='impl'){
						var chd=me.children();
						h=chd[1].outerHTML+chd[0].outerHTML;
					}
					me.replaceWith(Prop.wrap(m,h))
				});
			}
			h=D.html();
			D.remove();
		}
		if(op=='简'){//最简范式
			
		}
		if(op=='主'){//主析取、合取范式
			
		}
		if(op=='拷'){

		}

		return h
	},

	opr2:function(op,A,B){//二元运算
		var C=[],m=A.length,n=B.length,Cs=[], ar=arguments, arl=ar.length;C.t='set';

		if(op=='∧'){//合取
			if(D.is('.true')){
				h=h.replace(/true/,'false');
			}else if(D.is('.false')){
				h=h.replace(/false/,'true');
			}else if(D.is('.neg')){
				h=D.html();
			}else{
				h=DCtv('neg',h);
			}
		}
		if(op=='∨'){//析取
			if(D.is('.true')){
				h=h.replace(/true/,'false');
			}else if(D.is('.false')){
				h=h.replace(/false/,'true');
			}else if(D.is('.neg')){
				h=D.html();
			}else{
				h=DCtv('neg',h);
			}
		}
		return C
	}
};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var Rlt={//关系 本质上也是集合
	/*存储方式 二维数组（存储索引，从0开始）的数组A=[[i1,j1],[i2,j2]]
		关系矩阵A.m = 
		前域A.src1
		陪域A.src2
	默认是二元关系，将来推广到三元、更多元
	*/

	build:{
		obj:function(arr,s,src,mtrx,src1,src2){//直接构造对象 src是集合 【arr和mtrx二选一】 src1前域 src2陪域 src=src1 ∪ src2
			//mtrx是布尔矩阵（元素仅为0或1）
			var A=[].concat(arr);A.t='Rlt';A.s=s||'';A.src=src||(src1?set.opr2('∪',src1,src2):'');A.m=mtrx||'';
			if(src1){
				A.src1=set.opr1('拷',src1);
				A.src2=set.opr1('拷',src2);
			}
			if(!arr){
				return Rlt.fromMtrx(mtrx,A.src)
			}
			if(!mtrx){
				A.m=Rlt.toMtrx(A,A.src)
			}
			return A
		},
		I:function(src){//恒等关系
			var A=[],n=typeof src == 'number'?src:src.length;A.t='Rlt';A.s='I';A.src=src||'';A.m=Mtrx.build.I(n);
			for(var i=0;i<n;i++){
				A.push([i,i]);
			}
			return A
		},
		O:function(src){//空关系
			var A=[],n=typeof src == 'number'?src:src.length;A.t='Rlt';A.s='O';A.src=src||'';A.m=Mtrx.build.N(n,n,0);
			return A
		},
		A:function(src){//全域关系
			var A=[],n=typeof src == 'number'?src:src.length;A.t='Rlt';A.s='A';A.src=src||'';A.m=Mtrx.build.N(n,n,1);
			return A
		},
		N:function(src){//不等关系
			var A=[],n=typeof src == 'number'?src:src.length;A.t='Rlt';A.s='A';A.src=src||'';A.m=Mtrx.opr2('-',Mtrx.build.N(n,n,1),Mtrx.build.I(n));
			for(var i=0;i<n;i++){
				for(var j=0;j<n;j++){
					if(i!=j){
						A.push([i,i]);
					}
				}
			}
			return A
		},
	},
	is:{//布尔逻辑
		b1:{//一元关系
			"I":function(A){return Mtrx.is.b1.I(A.m)},//是否为恒等关系
			"0":function(A){return A.length<1},//是否为空关系，如果用矩阵判断：空集上是空矩阵，非空集上是0矩阵
			"r":function(A){return Mtrx.opr1('tr',A.m)=A.m.length},//是否为自反关系
			"s":function(A){return Mtrx.is.b1.T(A.m)},//是否为对称关系
			"t":function(A){return Rlt.opr1('t',A).length==A.length},//是否为传递关系
		},
		b2:{//二元关系
			"=":function(A,B){
				return A.length==B.length && Mtrx.is.b2('=',A.m,B.m)
			},
			"≠":function(A,B){
				return !Rlt.is.b2['='](A,B)
			},	
			"⊆":function(A,B){
				var m=A.length,n=B.length,t=m<=n;
				if(!t){return 0}
				for(var i=0;i<m;i++){
					if(!set.is.b2['∈'](A[i],B)){
						return 0
					}
				}
				return 1
			},
			"⊂":function(A,B){return +(A.length<B.length && set.is.b2['⊆'](A,B))},
			"⊇":function(A,B){return +set.is.b2['⊆'](B,A)},
			"⊃":function(A,B){return +(A.length>B.length && set.is.b2['⊆'](B,A))},
			"⊄":function(A,B){return +(!set.is.b2['⊂'](A,B))},
			"⊅":function(A,B){return +(!set.is.b2['⊃'](A,B))},
			"⊈":function(A,B){return +(!set.is.b2['⊆'](A,B))},
			"⊉":function(A,B){return +(!set.is.b2['⊇'](A,B))},
		}
	},
	fromStr:function(s){
		//
		
		
		
	},
	toStr:function(A){
		var str=A.s||'',src=A.src;
		if(str){return str}
		str=[];
		for(var k=0;k<A.length;k++){
			var Ak=A[k],i=src[Ak[0]],j=src[Ak[1]];
			//其实需要将i,j进行toStr转换（如果是Mtrx，set）
			//str+='<'+i+','+j+'>,';
			str.push('&lt;'+i+','+j+'&gt;');
		}
		return '{'+str.join()+'}'
	},

	fromMtrx:function(M,src){//关系矩阵
		var n=src.length,A=[];A.t='Rlt';A.s='';A.src=src;A.m=M;
		
		for(var i=0;i<M.length;i++){
			var mi=M[i],mil=mi.length;
			for(var j=0;j<mil;j++){
				if(M[i][j]){
					A.push([i,j])
				}
			}
		}
		return A
	},
	toMtrx:function(A,src){//关系矩阵
		var ts=typeof(A);
		if(ts=='string'){
			return 
		}
		if(A.m){
			return A.m
		}
		var n=src.length,M=Mtrx.build.N(n,n,0,true);
		
		for(var k=0;k<A.length;k++){
			var Ak=A[k];
			M[Ak[0]][Ak[1]]=1;
		}
		return M
	},

	opr1:function(op,R){//一元运算
		var S;
		if(op=='拷'){
			S=[].concat(R);
			S.t='Rlt';
			S.s=R.s||'';
			S.src=set.opr1('拷',R.src);
			if(R.src1){
				S.src1=set.opr1('拷',R.src1);
			}
			if(R.src2){
				S.src2=set.opr1('拷',R.src2);
			}
			S.m=Mtrx.opr1('拷',R.m);
		}
		if(/^[DR]$/.test(op)){//定义域 值域
			S=set.opr1('拷',R.src);
			var B=[],n=R.length;
			for(var i=0;i<n;i++){
				B.push(R[i][+(op=='R')])
			}
			return set.opr2('取',S,B)
		}
		if(/^[前陪]$/.test(op)){//前域 陪域
			return set.opr1('拷',R['src'+(1+(op=='陪'))]||R.src);
		}
		if(op=='逆'){
			S=Rlt.opr1('拷',R);
			S.m=Mtrx.opr1('T',S.m);
			for(var i=S.length-1;i>-1;i--){
				S[i].reverse();
			}
		}
		if(op=='r'){//自反闭包
			S=Rlt.opr1('拷',R);
			if(Rlt.is.b1('r')){
				return S
			}
			var Sm=S.m, n=Sm.length;
			for(var i=0;i<n;i++){
				if(!Sm[i][i]){
					Sm[i][i]=1;
					S.push([i,i]);
				}
			}
			//S.m=Mtrx.opr1('+',Sm,Mtrx.build.I(n));
			//Rlt.opr1('r',Rlt.build.obj([[1,2],[1,1]],'',['a','b','c']))

		}
		if(op=='s'){//对称闭包
			S=Rlt.opr1('拷',R);
			if(Rlt.is.b1('s')){
				return S
			}
			var Sm=S.m, n=Sm.length;
			for(var i=0;i<n;i++){
				for(var j=i+1;j<n;j++){
					if(Sm[i][j]+Sm[j][i]==1){
						if(Sm[i][j]){
							Sm[j][i]=1;
							S.push([j,i]);
						}else{
							Sm[i][i]=1;
							S.push([i,i]);
						}
					}
				}
			}
		}
		if(op=='t'){//传递闭包 直接求闭包，并没有判断是否满足传递关系
			S=Rlt.opr1('拷',R);
			var Sm=S.m, n=Sm.length;
			for(var i=0;i<n;i++){
				for(var j=0;j<n;j++){
					if(i!=j && Sm[i][j]){
						for(var k=0;k<n;k++){
							if(Sm[j][k] && !Sm[i][k]){
								Sm[i][k]=1;
								S.push([i,k]);
							}
						}
					}
				}
			}
		}

		if(op=='COV'){//Cover 盖住关系 覆盖关系
			S=Rlt.opr1('拷',R);
			var Sm=S.m, n=Sm.length;
			for(var i=0;i<n;i++){
				for(var j=0;j<n;j++){
					if(Sm[i][j]){
						if(i==j){
							Sm[i][j]=0;
						}else{
							for(var k=0;k<n;k++){
								if(Sm[j][k] && !Sm[i][k]){
									Sm[i][k]=1;
									S.push([i,k]);
								}
							}
						}
						
					}

				}
			}
		}



		if(op=='hasse'){//哈斯图精简掉自反、传递中介关系
			S=Rlt.opr1('拷',R);
			var Sm=S.m, n=Sm.length,Sn=S.length;
			for(var i=0;i<Sn;i++){
				var Si=S[i];
				if(Si[0]==Si[1]){//自反
					Sm[Si[0]][Si[0]]=0;
					S.splice(i,1);
					i--;
					Sn--;
				}
				
			}
/*
			for(var i=0;i<n;i++){
				if(Sm[i][i]){//对角线清空
					Sm[i][i]=0;
				}
			}
*/
			

			for(var i=0;i<n;i++){//去除传递中介
				for(var j=0;j<n;j++){
					if(Sm[i][j]){
						for(var k=0;k<n;k++){
							if(Sm[j][k] && Sm[i][k]){//有共同的上界，去掉长边
								for(var t=0;t<Sn;t++){
									if(S[t].join()==[i,k].join()){
										S.splice(t,1);
										break;
									}
								}
								
								
								Sm[i][k]=0;
								Sn--;
								break;
							}
						}
						for(var k=0;k<n;k++){
							if(Sm[i][k] && Sm[k][j]){//有传递介质，去掉本身
								for(var t=0;t<Sn;t++){
									if(S[t].join()==[i,j].join()){
										S.splice(t,1);
										break;
									}
								}
								Sm[i][j]=0;
								Sn--;
								break;
							}
						}
					}
				}
			}


		}
		
		
		return S
	},

	opr2:function(op,A,B){//二元运算
		var C=[],m=A.length,n=B.length,Cs=[];C.t='Rlt';
		if(/[=≠∈∉∋∌⊂⊄⊃⊅⊆⊈⊇⊉]/.test(op)){
			return rltBool2[op](A,B)
		}
		if(op=='∘'){
			
			
		}


		return C
	}
};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var set={//集合 本质上是数组
	build:{
		obj:function(arr){//直接构造集合
			var A=[].concat(arr);A.t='set';A.s='';
			return A
		}
	},
	is:{//布尔逻辑
		b2:{//二元关系
			"∈":function(a,A){
				var s=set.toStr(a);
				for(var i=0;i<A.length;i++){
					if(s==set.toStr(A[i])){
						return 1
					}
				}
				return 0
			},
			"∉":function(a,A){return +!set.is.b2['∉'](a,A)},
			"∋":function(a,A){return +set.is.b2['∈'](A,a)},
			"∌":function(a,A){return +!set.is.b2['∈'](A,a)},
			"⊆":function(A,B){
				var m=A.length,n=B.length,t=m<=n;
				if(!t){return 0}
				for(var i=0;i<m;i++){
					if(!set.is.b2['∈'](A[i],B)){
						return 0
					}
				}
				return 1
			},
			"⊂":function(A,B){return +(A.length<B.length && set.is.b2['⊆'](A,B))},
			"⊇":function(A,B){return +set.is.b2['⊆'](B,A)},
			"⊃":function(A,B){return +(A.length>B.length && set.is.b2['⊆'](B,A))},
			"⊄":function(A,B){return +(!set.is.b2['⊂'](A,B))},
			"⊅":function(A,B){return +(!set.is.b2['⊃'](A,B))},
			"⊈":function(A,B){return +(!set.is.b2['⊆'](A,B))},
			"⊉":function(A,B){return +(!set.is.b2['⊇'](A,B))},
			"=":function(A,B){return +(set.is.b2['⊆'](A,B) && set.is.b2['⊆'](B,A))},
			"≠":function(A,B){return +(!set.is.b2['='](A,B))}
		}
	},
	fromStr:function(s){//集合 → 数组对象
		var	v=s;
		if(/^P\(/.test(v)){//幂集
			return set.opr1('幂',set.fromStr(v.replace(/^P\(|\)$/g,'')))
		}else if(/^A\/R=/.test(v)){//from 商集
			return set.fromStrQuo(v.substr(4))
		}else if(v==='∅' || !s.length){
			v=[];v.t='set';
			v.s=''
		}else{
			v=v.replace(/​/g,'').replace(/\s/g,'').replace(/〉/g,'>').replace(/〈/g,'<')
				.replace(/[（﹙〔]/g,'(').replace(/[）﹚〕]/g,')');
			//var vi=v.split(/[\(<\[\{]/)[0];
			var tp=/<.+,.+>/.test(v)?'<>':(/\(.+,.+\)/.test(v)?'()':'');
		//	console.log(tp);
			v=v.replace(/[\(<\[\{]/g,'[').replace(/[\)>\]\}]/g,']').replace(/∅/g,'[]').replace(/(\d*[^\[,\]\d]\d*)/g,'"$1"');
			//console.log(v);
			v=eval(v);
			v.t='set'+(tp?'_Cartestian_'+tp:'');
			v.s=s;
		}
		return v
	},
	toStr:function(A,typ){/* 参数typ 指定输出类型
			html 指定字符串需html转义（<>）
			latex 需要对{}进行转义
			*/
		var str='',PA=['{[<(','}]>)'],ts=typeof(A),p=typ||'';

		if(ts=='string'){
			return A
		}else if(ts=='number'){
			return ''+A
		}else if(!A.length || A.s===''){
			return '∅'
		}else if(A.s){
			if(p=='html'){return XML.encode(A.s)}//.replace(/</g,'&lt;').replace(/>/g,'&gt;')
			if(p=='latex'){return encodeLatex(A.s)}
			return A.s
		}else if(/set_Cartesian/.test(A.t)){
			var tp=A.t.substr(-2);
			if(p=='html' && tp=='<>'){
				tp=['&lt;','&gt;'];
			}
		//	console.log(tp);
			for(var k=0;k<A.length;k++){
				str+=set.toStr(A[k],p)+',';
			}
		//	console.log(str);
			return tp[0]+str.replace(/,$/,tp[1])
		}else{
			for(var k=0;k<A.length;k++){
				str+=set.toStr(A[k],p)+',';
			}
			if(p=='latex'){
				return '\\{'+str.replace(/,$/,'\\}')
			}else{
				return '{'+str.replace(/,$/,'}')
			}
		}
	},

	unique:function(A){	//去重
		var B=[],n=A.length,Bs=[];B.t='set';
		if(n<1){
			return set.fromStr('')
		}
		for(var k=0;k<n;k++){
			var s=set.toStr(A[k]);
			if(Bs.indexOf(s)<0){
				Bs.push(s);
			}
		}
		Bs.sort();
		for(var k=0;k<Bs.length;k++){
			B.push(set.fromStr(Bs[k]))
		}
		B.s='{'+Bs.join(',')+'}';
		return B
	},
	opr1:function(op,A,p){//集合一元运算 p是可选参数
		var B=[],n=A.length,Bs=[];B.t='set';
		if(op=='势'){
			return n
		}
		if(op=='幂'){/*幂集 测试案例： set.toStr(set.opr1('幂',set.fromStr('{1,{1,2}}')))
			参数p = 
				str 返回字符串
			*/

			var pn=Math.pow(2,n);
			for(var i=0;i<pn;i++){
				var s=i.toString(2),v=[];

				for(j=1;j<n+1;j++){
					if(j>s.length){break}
					if(s.slice(-j)[0]=='1'){
						v.unshift(set.toStr(A[n-j]))
					}
				}
				if(v.length){
					//console.log(v);
					Bs.unshift('{'+v.join(',')+'}')
				}
			}
			Bs.sort(function(a,b){
				return a.split(',').length-b.split(',').length || +([a,b].sort()[0]!=a)*2-1
			});

			Bs.unshift('∅');
//console.log(Bs.join(','));
			var str='{'+Bs.join(',')+'}';
			if(p=='str'){return str}
			B=set.fromStr(str);

		}

		if(op=='拷'){/*
			参数p 指定拷贝份数
			*/
			if(A.s===''){
				B.s=''
			}else if(A.s){
				B=set.fromStr(A.s)
			}else{
				B=set.fromStr(set.toStr(A))
			}
			if(p){
				var ars=[];
				for(var i=0;i<p;i++){
					ars.push(set.opr1('拷',A));
				}
				B=ars;
			}
		}
		if(op=='取'){/*	根据元素位置索引（从0开始编号），返回子集
			参数p 是索引数组
			*/
			if(!p){return set.opr1('拷',A)}
			for(var i=0,l=p.length;i<l;i++){
				B.push(A[p[i]])
			}
		}
		return B
	},

	opr2:function(op,A,B,p){//集合二元（多元）运算 p是可选参数 
		var C=[],m=A.length,n=B.length,Cs=[], ar=arguments, arl=ar.length,ars=$.makeArray(ar).slice(1);
		C.t='set';
		if(/[=≠∈∉∋∌⊂⊄⊃⊅⊆⊈⊇⊉]/.test(op)){
			//return rltBool2[op](A,B)
			return set.is.b2(op,A,B)
		}
		if(op=='搜'){//搜索元素，返回位置索引
			var s=set.toStr(B);
//console.log(B,s,s[0]);
			for(var k=0;k<m;k++){

				if(s==set.toStr(A[k])){
//console.log(k);
					return k //从0开始计数！
				}
			}
			return -1
		}

		if(op=='并'){//仅限无交集的并
			if(A.s==='' || B.s===''){
				C=set.opr1('拷',A.s===''?B:A)
			}else{
				C=set.fromStr(A.s.replace(/\}$/,',') + B.s.replace(/^\{/,''));
			}
		}
		if(op=='∪'){
			if(A.s==='' || B.s===''){
				C=set.opr1('拷',A.s===''?B:A)
			}else{
				C=set.unique(set.fromStr(A.s.replace(/\}$/,',') + B.s.replace(/^\{/,'')));
			}
		}

		if(/[-¬∩]/.test(op)){//差集和交集
			var inters=op=='∩';
			if(A.s==='' || B.s===''){
				if(inters){
					C.s=''
				}else{
					C=set.opr1('拷',A)
				}
			}else{

				var a=[],b=[],c0,c1;
				for(var k=0;k<m;k++){
					a.push(set.toStr(A[k]))
				}
				for(var k=0;k<n;k++){
					b.push(set.toStr(B[k]))
				}

				if(inters && m>n){
					c0=b;
					c1=a;
				}else{
					c0=a;
					c1=b;
				}
				for(var k=0;k<c0.length;k++){
					var s=c0[k],i=c1.indexOf(s);
					if(inters && i>-1 || !inters && i<0){
						C.push(set.fromStr(s));
						Cs.push(s);
					}
				}

				if(C.length){
					C.s='{'+Cs.join(',')+'}';
				}else{
					C.s=''
				}
			}
		}
		if(op=='⊕'){//环和 (对称差) 最后1个参数（可选），指定求法
			var islastP=arl>3 && typeof ar[arl-1] == 'string', para=!islastP||!ar[arl-1]?'-+-':ar[arl-1];
			if(para=='-+-'){
				//C=set.opr2('∪',set.opr2('-',A,B),set.opr2('-',B,A))
				return Arrf(function(x,y){return set.opr2('∪',set.opr2('-',x,y),set.opr2('-',y,x))},islastP?ars.slice(0,arl-2):ars,'cp2')
			}
			if(para=='+-*'){
				//C=set.opr2('-',set.opr2('∪',A,B),set.opr2('∩',A,B))
				return Arrf(function(x,y){return set.opr2('-',set.opr2('∪',x,y),set.opr2('∩',x,y))},islastP?ars.slice(0,arl-2):ars,'cp2')
			}
		}
		if(op=='⊗'){//环积 （对称补）			
			/*	最后1个参数p（可选）U：全集，
				倒数第2个参数是（必选），即判断p非字符串时，表示缺省。
			*/
			var islastP=arl>4 && typeof ar[arl-1] == 'string', para=!islastP|!ar[arl-1]?'-(+)':ar[arl-1], U=ars.slice(-1)[0];
			if(para=='-(+)'){
				//C=set.opr2('-',ars.slice(-1)[0],set.opr2('⊕',A,B))
				return Arrf(function(x,y){return set.opr2('-',U,set.opr2('⊕',x,y))},ars.slice(0,arl-(islastP?2:1)),'cp2')
			}
			if(para=='--'){
				//C=set.opr2('-',ars.slice(-1)[0],set.opr2('-',A,B),set.opr2('-',B,A))
				return Arrf(function(x,y){return set.opr2('-',U,set.opr2('-',x,y),set.opr2('-',y,x))},ars.slice(0,arl-(islastP?2:1)),'cp2')
			}
			if(para=='-+'){
				//C=set.opr2('∪',set.opr2('-',ars.slice(-1)[0],set.opr2('∪',A,B)),set.opr2('∩',A,B))
				return Arrf(function(x,y){return set.opr2('∪',U,set.opr2('-',U,set.opr2('∪',x,y)),set.opr2('∩',x,y))},ars.slice(0,arl-(islastP?2:1)),'cp2')
			}
			/*
			if(arl>5){
				var U=set.opr1('拷',ars.slice(-1)[0]);
				return Arrf(function(x,y){return set.opr2('⊗',x,y,p||'-(+)',U)},ars.slice(4,arl-1),'cp2')
			}
			*/
		}

		if(arl>3 && /[∩∪-]/.test(op)){//3元以上的运算
			return Arrf(function(x,y){return set.opr2(op,x,y)},ars,'cp2')
		}
		if(op=='×'){//笛卡尔积（直积、外积）
			if(typeof B ==  'number'){ //笛卡尔幂
				ars=set.opr1('拷',A,B);
			}
			C=cartestian(ars);
		}
		return C
	}
};
set.fromStrQuo=function(s){//从商集得到集合：商集元素取并集
	var Q=set.fromStr(s),S=[];
	for(var i=0;i<Q.length;i++){
		S.push(set.toStr(Q[i]).replace(/^\{|\}$/g,''))
	}
	return set.fromStr('{'+S.join(',')+'}');
};
/*
 * zzllrr Mather
 * Copyright by zzllrr since 2013. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

	
var floor=function(A,m,reorder,indx){/*A中不超过m的最大的数
	参数reorder 默认为空或0，表A是升序（顺序，从小到大）数组；-1，表A是降序（逆序，从大到小）数组；1，表A是乱序
	
	参数indx 默认为空或0，表示返回数
			1 返回索引
			2 返回[数，索引]数组
	*/
	var l=A.length,s,j=A.indexOf(m);
	if(j>-1){
		return indx?(indx==2?[m,j]:j):m
	}

	if(reorder==1){
		s=A[0];
		for(var i=0;i<l;i++){
			var Ai=A[i];
			if(Ai<m && Ai>s){
				s=Ai;
				j=i;
			}
		}
		return s>m?null:(indx?(indx==2?[s,j]:j):s)
	}
	if(reorder==-1){
		s=A.slice(-1)[0];
		for(var i=0;i<l;i++){
			var Ai=A[i];
			if(Ai<m){
				return indx?(indx==2?[Ai,i]:i):Ai
			}
		}
		return null
	}
	for(var i=l-1;i>=0;i--){
		var Ai=A[i];
		if(Ai<m){
			return indx?(indx==2?[Ai,i]:i):Ai
		}
	}
	return null

},ceil=function(A,m,reorder,indx){//A中不小于m的最小的数	参数reorder、indx 含义见floor
	var l=A.length,s,j=A.indexOf(m);
	if(j>-1){
		return indx?(indx==2?[m,j]:j):m
	}

	if(reorder==1){
		s=A[0];
		for(var i=0;i<l;i++){
			var Ai=A[i];
			if(Ai>m && Ai<s){
				s=Ai;
				j=i
			}
		}
		return s<m?null:(indx?(indx==2?[s,j]:j):s)
	}
	if(reorder==-1){
		s=A.slice(-1)[0];
		for(var i=l-1;i>=0;i--){
			var Ai=A[i];
			if(Ai>m){
				return indx?(indx==2?[Ai,i]:i):Ai
			}
		}
		return null
	}
	for(var i=0;i<l;i++){
		var Ai=A[i];
		if(Ai>m){
			return indx?(indx==2?[Ai,i]:i):Ai
		}
	}
	return null

},subA=function(A,gt,lt,unsort){//从升序数组，截取大于gt或小于lt的子集		指定unsort，则表示是无序数组
	var B=[],l=A.length;

	for(var i=0;i<l;i++){
		var a=A[i];
		if(gt?a>gt:(lt?a<lt:1)){
			B.push(a);
			
			if(!unsort && !lt){
				return B.concat(A.slice(i+1))
			}
		}else if(!unsort && lt && a<=lt){
			return B
		}
	}
	return B



},count2pow=function(A,style){/*计数，并写成幂乘积形式	A是二维数组[去重数组, 相应重数数组]
		参数 style 连接风格
			默认	空
			1	指定以乘法点号连接‧（纯数字之间乘法）
			2	指定以中文逗号连接，	幂写成大括号{}：（重数）	并以latex显示
		*/
	return concat(A[0],
		Arrf(function(t){return t>1?(style==2?'（'+(t<5?'两三四'[t-2]:t)+'重）':('^{'+t+'}')):''},A[1])).join(style?'‧，'[style-1]:'')

};
/*
 * zzllrr Mather
 * zzllrr@gmail
 * Released under MIT License
 */
if (!lang) { var lang = {} }
lang['zh_cn'] = {


	//non-standard key for Interface
	' ': '',
	'en': '英语',
	'zh_cn': '简体',
	'zh_tw': '繁体',

	'Obj': '对象',
	'fonT': '字体',
	'bW': '边宽',
	'Bw': '边宽',

	'H1': '一级标题',
	'Fgc': '前景色',
	'bg': '背景',
	'BGC': '背景色',
	'bgc': '背景色',
	'Opts': '选项',
	'Opa': '透明度',
	'Backvisi': '背面可见',
	"flipy": "水平翻转",
	"flipx": "垂直翻转",
	"flip0": "正常",
	"rotate1": "顺转90°",
	"rotate2": "旋转180°",
	"rotate3": "逆转90°",
	'Preserve 3D':'保持3D',
	'Perspective':'透视',
	'Nav':'导航',

	'copy2input': '复制到命令输入框',
	'copyAll2input': '复制所有到命令输入框',

	'Bright': '亮度',
	'hueRotate': '色相',

	'dropShadow': '阴影',

	'attr': '属性',
	'Sq': '平方',
	'Cb': '立方',


	'Launch': '在新窗口运行',

	'English':'英语',
	'Chinese':'中文',
	'Egyptian':'埃及',
	'Arabic':'阿拉伯',
	'Babylonian':'巴比伦',

	'The':' ',
	'the First Kind':'第一类',
	'the Second Kind':'第二类',
	'the Third Kind':'第三类',

	'Del': '删除',

	'Linebreak': '换行',

	'nodesXY': '笛卡尔节点',
	'nodesPolar': '极坐标节点',
	'MidPointLine': '中点连线',
	'MidPointLineon': '中点连线',


	'thtip': '点击表头，可以显示/编辑LaTeX',
	'sbsontip': '@{clickWithShift}则得到Unicode字符@{notLaTeX}',
	'funcsontip': "@{clickWithShift}则函数后面不自动加(括号)",
	'strucontip': "@{clickWithShift}则得到$内部函数命令$@{notLaTeX}",
	'tasktip': "@{clickWithShift}则自动输入示例命令",
	'copytip': "点击复制到剪贴板",
	'showEditip': '输入文本、网址，或拖放文件（文本文件、二维码图片、数学公式图片）至此',

	'copy2Canvas': '复制到画布上方',
	'clickWithShift': '点击并按住Shift键，',
	'notLaTeX': '，而不是LaTeX格式',

	'donatip': '需要您的支持！',
	'donatip0': '万物皆数',
	'Accnum': '收款账号',
	'copiedtip': '已复制到剪贴板',
	'copied2Canvastip': '已复制到画布',
	'resetAlert': '确定重置吗？',



	'International Standard Open-Sourced Math Tool Program by Experts': '国际通用标准的专家级开源数学工具项目',
	'Customized Math Tool Program based on Mather by zzllrr': '小乐基于Mather个性化开发的数学工具项目',
	'Customized Math Tool Program based on Mather by someone': '某人基于Mather个性化开发的数学工具项目',
	'Unless Otherwise Stated': '如无特殊说明',
	'Standing on the shoulders of giants!':'站在巨人的肩膀上！',

	// standard 


	// noun	

	// 人和组织
	'Person': '人物',
	'User': '用户',

	'Officer':'军官',
	'Student': '学生',
	'Parent': '父母',
	'Teacher': '老师',
	'Schoolgirl':'女生',
	'Schoolboy':'男生',
	'Baby':'婴儿',
'Neighborhood':'邻居',
	'Enthusiast': '爱好者',
	'Geek': '极客',
	'Author':'作者',
	'Writer':'作家',
	'Research':'研究',
	'Researcher': '科研工作者',
	'Educator': '教育工作者',
	'Scholar': '学者',
	'Philosopher': '哲学家',
	'Artist': '艺术家',
	'Mathematician': '数学家',

	'Engineer': '工程师',

	'Publisher': '出版工作者',
	'Legal Worker': '法律工作者',

	'Amateur': '业余者',
	'Barber':'理发师',

	'Participant': '参与者',

	'Backer': '资助者',
	'Sponsor': '赞助者',
	'Contributor': '贡献者',
	'Dedicator': '奉献者',
	'Volunteer': '志愿者',
	'Worker': '工作者',
	'Supporter': '支持者',
	'Public': '公众',
	'Company': '公司',


	'zzllrr': '小乐',
	'zzllrr Mather': '小乐数学',
	'Mather': '数学客',
	'Organism': '有机体',

	'Payee': '收款人',

	'3rd-party': '第三方',
	'third-party': '第三方',

	'WeChat': '微信公众号',

	'Other':'其他',
	'Tip':'提示',
	'Syntax':'句法',


	// 百科

	'Dictionary':'辞典',
	'Wiki': '百科',
	'Enclyclopedia':'百科全书',
	

	'Concept': '概念',
	'Name': '名称',
	'Notation': '记法',
	'Define':'定义',
	'Definition': '定义',
	'Summary': '简介',
	'Details':'详情',
	'Description': '描述',
	'Property': '性质',


	'Thesis':'论文',
	'Theses':'论文',
	'Monograph':'专著',
	
	'Theorem': '定理',
	'Aureum Theorema':'黄金定理',
	'Axiom': '公理',
	'Axiomatic':'公理',
	'Lemma': '引理',
	'Principle':'原理',
	'Principal':'主',
	'Auxiliary':'辅助',

	'Criteria':'准则',
	'Criterion':'准则',

	'Conjecture':'猜想',
	'Conjectures':'猜想',

	'Hypothesis': '假设',
	'Hypotheses': '假设',
	'Suppose': '假设',
	'Postulate': '假设',

	'Antinomy':'悖论',
	'Paradox':'矛盾',
	'Error':'误差;错误',
	'Deviation':'偏差',
	'Possibility':'可能性',
	'Posteriori':'后验',
	'Priori':'先验',

	'Denial':'否定',
	'Deny':'否定',
	
	'Proof': '证明',
	'Prove': '证明',
	'Prover':'证明机',
	'Proved':'已证明',
	'Disproved':'已否定',

	'such that':'满足',

	'Inference': '推断',
	'Corollary':'推论',
	'Statement':'陈述',

	'Restriction':'限制',
	'Admissible':'可接受',

	'Calculate': '计算',
	'Computation': '计算',
	'Calculation': '计算',
	'Estimate':'估计',

	'Extension':'扩张;扩展',
	'Extensionality':'外延',

	'Category':'范畴',

	'Method': '方法',
	'Methodology': '方法论',

	'Revenge':'复仇',
	'Recurrence':'复现',

	'Orbit':'轨道',

	'Formula': '公式',
	'Formulae': '公式',
	'Formulas': '公式',

	'Letter':'字母',
	'Letters':'字母数',

	'Thought': '思想',


	'Direct':'直接',
	'Indirect':'间接',

	'Induce':'归纳',
	'Inductive':'归纳',
	'Analogy':'类比',
	'Analogize':'类比',
	'Dual':'对偶',
	'Duality':'对偶',
	
	'Holographic':'全息',
	'Conservation':'守恒',

	'Entropy':'熵',
	'Period':'周期',
	'Periodic':'周期',
	'Periodicity':'周期',
	'Aperiodic':'反周期',

	'Comprehensive':'综合',
	'Complete':'完全',
	'Incomplete':'不完全',

	'Holistic':'整体性',

	'Predict':'预测',

	'Uniq':'去重',
	'Unique':'唯一',
	'Repeat':'重复',

	'Same':'相同',
	'Distinct':'不同',
	'Different':'不同',

	'Given':'给定',

	'Ergodic':'遍历',
	'Ergodicity':'遍历',
	'Reverse':'逆转',

	'Thinking':'思维',
	'Converge':'收敛',
	'Convergent':'收敛',
	'Diverge':'发散',

	'Divergent':'发散',

	'Generalise':'推广',
	'Generalize':'推广',
	'Generalising':'推广',
	'Generalized':'广义',

	'Integrate':'整合',
	'Reduction to Absurdity':'归谬',

	'Illusion':'幻觉',

	'Dialectical':'辩证的',
	'Dialectic':'辩证',

	'Experiment':'实验',
	'Deduce':'演绎',
	'Deductive':'演绎',
	'Deduction':'推理',

	'Counterpose':'对立',
	'Penetrate':'穿透',
	'Abstract':'抽象',
	'Abstraction':'抽象',

	'Reasoning': '推理',

	'Pattern': '模式;图案',
	'Paradigm':'范式',




	'Topic': '课题',
	'Foldable':'可折叠',
	'Folding':'折叠',




	//教学

	'MOOC':'慕课',
	'Teaching': '教学',
	'Course': '课程',
	'Curriculum':'课程',
	'Curricula':'全部课程',
	'Pedagogy':'教学法',
	'Test Question Library':'试题库',

	'Test':'检验;测验',
	'Drill': '练习',
	'Assign':'布置',
	'Assignment':'作业',
	'Checking':'检查',
	'Task':'任务',

	'Examination Paper':'试卷',
	'Set Examination Paper':'出卷',

	'Exam': '考试',
	'Quiz':'小测验',
	'Online':'在线',

	'Vote':'投票',

	'Ballot':'投票',
	'Poll':'民测投票',
	'Survey':'调查',
	'Investigation':'调查研究',
	'Questionnaire':'问卷',
	'Draft':'草稿',


	'Discuss':'讨论',
	'Discussion':'讨论',
	
	'Question':'问题',
	'Problem':'难题',
	'Answer':'答案',
	'Q & A':'问答',

	'Respond':'响应',
	'Reply':'回复',


	'Score': '得分',
	'fill in the blank': '填空',
	'Choice': '选择',
	'Judgement': '判断',

	'Semester':'学期',
	'Glean':'费力搜集',

	'Choose':'选择',

	//学术

	'Document': '文档',
	'Periodical':'期刊',
	'Journal':'刊物',
	'Preprint':'预印本',
	'Bi-weekly':'双周',
	'Annual':'每年',
	'Monthly':'每月',
	'Bimonthly':'双月',
	'Quarterly':'季刊',
	'Biannual':'一年两次',
	'Biennial':'两年一次',
	'Triennial':'三年一次',
	'Quadrennial':'四年一次',
	'Annals':'年鉴',
	'Year':'年',
	'Month':'月',
	'Date':'日',
	'Minute':'分',

	'Arc Second':'弧秒',
	'Arcsecond':'秒',

	'Now':'现在',
	'Tomorrow':'明天',
	'Yesterday':'昨天',

	'Reference': '引用',
	'Newsletter':'新闻通讯',

	'AMS':'美国数学学会',
	'MAA':'美国数学协会',
	'SIAM':'工业和应用数学学会',

	'Meeting':'会议',

	'Academic':'学术',
	'Seminar':'研讨会',
	'Webinar':'网络研讨会',
	'Symposium':'专题研讨会',
	'Workshop':'讲习',
	'Conference':'会议',
	'Lecture':'讲座',

	'Lab':'实验室',

	'Syllabus':'教学大纲',
	'Hons':'学士学位',
	'FSc':'理学教员',
	'BSc':'理学学士',
	'MSc':'理学硕士',
	'B.S.':'理学学士',
	'M.S.':'理学硕士',
	'Baccalaureate':'学士学位',
	'Ph.D.':'博士学位',
	'Sc.D.':'理学博士',
	'M.Phil.':'哲学硕士',
	'Matric':'中学毕业学年',
	'Doctor':'博士',
	'Doctoral':'博士',

	'Undergraduate':'本科',
	'Postgraduate':'研究生',
	'University':'大学',
	'Institue':'研究院',
	'College':'学院',

	'Professor':'教授',
	'Alumni':'校友',
	'Prospectus':'简章',

	'Race':'比赛',
	'Contest':'竞赛',
	'Competetion':'竞争',

	'Prize':'奖',
	'Awards':'奖项',
	'Award':'奖',
	'Bonus':'奖金',
	'Laureate':'获奖者',
	'Medalist':'奖章获得者',

	'Institution': '机构',
	'Organization': '组织',
	'Faculty':'院系',

	'Society':'社会',
	'Math Society':'数学会',
	'Association':'协会',
	'Founder':'创立者',

	'Mascot':'吉祥物',

	//技术

	'GGB':'GeoGebra',
	'Technology': '技术',
	'Model':'模型',
	'Modeling':'建模',
	'Optimization':'优化',
	'Standardization': '标准化',

	'Programming': '编程',
	'Programmatic': '程序化',
	'Algorithm':'算法',
	'Algorithmic':'算法',

	'Standard':'标准',
	'Software': '软件',
	'Hardware': '硬件',

	'Library': '库',
	'Industry': '行业',
	'Project': '项目',
	'Feature':'特征',
	'Features':'特色',

	'Texture':'纹理',
	'Rough':'粗糙',
	'Roughness':'粗糙度',
	'Hachure':'蓑状线',
	'Simplification':'简化',
	'Disable':'停用',
	'Enable':'启用',
	'Plan':'计划',

	//科学

	'Science':'科学',
	'Scientific':'科学',
	'Fiction':'幻想',
	'Science Fiction':'科幻',

	'Potential Science':'潜科学',
	'Religion':'宗教',
	'Superstition':'迷信',

	'Universe':'宇宙',
	'Life':'生命',
	'Health':'健康',
	'Environment': '环境',
	'Climate':'气候',
	'Polution':'污染',
	'Waste':'废弃',
	'Environmental Protection':'环保',
	'Eco-Friendly': '环保的',

	'Astronomy':'天文',
	'Geography':'地理',
	'Physics':'物理',
	'Chemistry':'化学',
	'Biology':'生物',
	'Geographic':'地理',

	'Medicine':'药物',
	'AI': '人工智能',
	'Intelligent': '智能',
	'Intelligence': '智能',
	'Psychology':'心理',

	'Geodesic':'测地',


	//文化

	'Culture':'文化',

	'Humanism':'人文主义',
	'Humanity':'人性',
	'Innumeracy':'数盲',
	'Illiteracy':'文盲',
	'Numeracy':'算数能力',
	'Literacy':'读写能力',
	'Phobias':'恐惧症',

	'Business':'商业',
	'Politics':'政治',
	'Economy':'经济',
	'Sports':'体育',
	'Game': '游戏',
	'Toy':'玩具',
	'Literature':'文学',

	'Electronic':'电子',
	'Video Game':'电玩',
	'Simulation':'模拟',

	'Backgammon':'双陆棋',
	'Billiard':'台球',
	'Recreational':'消遣',
	'Maze':'迷宫',
	'Paper Cutting':'剪纸',
	'Paper Folding':'折纸',
	'Origami':'日本折纸',
	'Rubik Cube':'魔方',
	'Magic':'魔术',
	'Sudoku':'数独',
	'Tangram':'七巧板',
	'Tessellation':'镶嵌',
	'Tiling':'镶嵌',
	'Knot':'纽结',

	'Unknot':'解纽',

	'Plasticine':'橡皮泥',
	'Tetris':'俄罗斯方块',
	'Puzzle':'解谜',
	'Emoji':'表情',
	'Minesweeper':'扫雷',

	'Fine Art':'美术',
	'Comic':'漫画',
	'Cartoon':'卡通',
	'Animation': '动画',
	'Animate': '动画',
	'Doodle': '涂鸦',
	'Gifs':'动图',
	'Joke':'笑话',
	'Humor':'幽默',

	'History':'历史',
	
	'Interview':'访谈',
	'Report':'报道',
	'Blog':'博客',
	'Podcast':'播客',
	'Vlog':'视频博客',
	'Ebook':'电子书',
	'Movie':'影视',
	'Painting':'画',

	'Chess':'棋',
	'Cards':'牌',
	'Poker':'扑克',

	'Philosophy':'哲学',
	'Art':'艺术',
	'Architecture':'建筑',
	'Sculpture':'雕塑',
	'Photography':'摄影',
	'Opera':'歌剧',
	'Poem':'诗歌',
	'Novel':'小说',
	'Drama':'戏剧',
	'Programme':'节目',
	'TV':'电视',
	'Radio':'广播',

	'Piano':'钢琴',

	'Social':'社交',
	'Community':'社区',

	'Activity':'活动',
	'Interest':'兴趣',
	'Festival':'节日',
	'Carnival':'嘉年华',
	'Museum':'博物馆',
	'Camp':'营',

	'Fair':'公平',
	'Happy':'开心',
	// 工程	

	'Making':'制作',
	'Client':'客户端',
	'Run': '运行',
	'Split': '分开',
	'Merge': '合并',

	'Program': '项目;纲领',

	'Tool':'工具',
	'Toolset':'工具箱',
	'File': '文件',
	'Folder':'文件夹',
	'Engine': '引擎',
	'Favourite':'最爱',
	'Like':'喜欢',

	'Design':'设计',
	'Application': '应用',
	'by-product': '副产品',
	'Goal': '目标',

	'Virtual':'虚拟',
	'Virtual Machine':'虚拟机',
	'Machine':'机器',
	'Web': '网络',
	'Network': '网络',

	'Pursuit':'追及',

	'Balance':'平衡',
	'Balanced':'平衡',

	'Webpage': '网页',
	'Home': '首页',
	'Homepage': '主页',

	'Window':'窗口',
	'Interface': '界面',
	'Night': '夜间',
	'Help': '帮助',
	'Example': '示例',
	'Format': '格式',
	'Preview': '预览',



	'Ubiquitous':'普遍存在的',

	'Scope': '范围',
	'Textarea': '文本框',
	'Computer': '计算机',

	'Stack':'栈',
	'Pitfall': '陷阱',
	'Todo': '待办',

	'Statistic': '统计',
	'Population':'总体',//统计学中
	'Sample':'样本',
	'Mean':'平均',
	'Average':'平均',
	'Seek':'寻找',
	'See':'参见',

	'Intermediate':'中',
	'Correlation':'相关系数',
	'Covariance':'协方差',
	'Coefficient':'系数',
	'Variance':'方差',
	'Variation':'变分',
	'Variational Calculus':'变分法',
	'Surely':'肯定',

	'Prune':'剪枝',
	'Amalgamate':'合并',

	'Alphabet':'字母表',
	'Variety':'簇',
	'Varieties':'簇',

	'Convolution':'卷积',
	'Distribution':'分布',
	'Distributed':'分布',


	'Lottery': '彩票',
	'Sudoku': '数独',

	'Head': '头',
	'Body': '正文',
	'Foot': '尾',
	'Foot Note': '脚注',
	'End Note': '尾注',
	'Child': '子元素',

	'Container': '容器',
	'Box': '盒子',
	'Node': '节点',
	'Acnode':'孤立点',

	'Dash': '虚线',
	'Dashed': '虚线',
	'Dots': '点',
	'Hatch':'孵化',
	'Zigzag':'Z字形',

	'Arrow': '箭头;阿罗',
	'Arrowhead':'箭头',
	'Round Corner': '圆角',
	'Rounded': '圆角',

	'White':'白;怀特',
	'Black':'黑;布莱克',
	'Gray':'灰',
	'Gold':'金',
	'Golden':'黄金',
	'Silver':'银',
	'Bronze':'铜',
	'Iron':'铁',
	'Brown':'棕;布朗',
	'Red':'红',
	'Orange':'橙',
	'Yellow':'黄',
	'Green':'绿;格林',
	'Blue':'蓝',
	'Indigo':'靛',
	'Violet':'紫',

	'Ball':'球',

	'Borderless': '无框',
	'Visible':'可见',
	'Visibility':'可视',

	
	'Pie': '饼',
	'Bar': '条形',
	'Flowchart': '流程',
	'Scatter': '散点',
	'Flow':'流',

	'Interactive':'交互',
	'Inspiration':'灵感',
	'Compilation':'编纂',

	'Canvas': '画布',
	'Graphic': '作图',
	'Graphics': '图形',

	'Flatten':'扁平化',

	'Chart':'图形',
	'Charts':'制图',
	'Plot':'绘制',
	'Phase':'相位',
	'Mask': '遮罩',
	'Clipboard': '剪贴板',

	'Instant': '即时',
	'Timeout': '延时',
	'Text': '文本',
	'Image': '图片',
	'Mic': '麦克风',
	'Calculator': '计算器',
	'Editor': '编辑器',
	'Script': '脚本',

	'Translator': '翻译',

	'Reader': '阅读器',
	'Camera': '摄像头',
	'Video': '视频',
	'Live':'直播',
	'Replay':'回放',

	'Media':'媒体',
	'Audio': '音频',
	'Sound': '声音',
	'Speech': '语音',
	'Voice': '嗓音',
	'Music': '音乐',
	'Chord':'和弦',
	'Noise': '噪音',
	'Usage': '使用量',
	'Cache': '缓存',
	'Export': '导出',
	'Import': '导入',
	'Browser': '浏览器',
	'Share': '分享',
	'Check':'检查',
	'Necklace':'项链',

	'Effects': '特效',
	'Action': '动作',
	'Scene': '场景',
	'Scenario':'场合',
	'Aside':'旁白',

	'Gadget': '部件',
	'Widget':'部件',
	'Show': '演示',
	'Slide': '幻灯片',

	'Compression': '压缩',
	'Synthesis': '合成',
	'Note': '注释',
	'Notes':'笔记',
	'Sticky Notes':'便笺',
	'Notebook':'笔记本',
	'Essay':'散文',
	'Brainstorm':'头脑风暴',
	'Brainstorming':'集思',

	'Bucket':'水桶',

	'Result': '结果',
	'Title': '标题',
	'Background': '背景',

	'Backface': '背面',
	'Frontface': '前面',

	'Keyword': '关键词',
	'Layer': '层',
	'Layers': '层数',
	'Pointer': '指针',
	'Erase':'擦除',
	'Eraser': '橡皮擦',
	'Tab': '制表符',
	'Indent': '缩进',
	'List': '列表',
	'Table': '表格',
	'Ordered': '有序',
	'Unordered': '无序',

	'Well Order':'良序',
	'Well-Defined':'良定',

	'Superscript': '上标',
	'Subscript': '下标',
	'Prefix': '前缀',
	'Suffix': '后缀',
	'Infix': '中缀',
	'Affix':'缀',

	'Gate':'门',
	'Aggregate':'总数',

	'Converse':'反命题',
	
	// 助词	或 词根
	'if':'如果',
	'iif':'当且仅当',
	'when':'当',
	'And': '与',
	'and': '和',
	'or': '或',
	


	'About': '关于',
	'Anti': '反',
	'Non':'非',
	'Un':'不',
	'Co': '互;共;同;协;余',

	

	'By': '按',
	'For':'为了;因为;至于',

	'From': '从;于',

	'To': '到',
	'Semi': '半',
	'Demi': '半',
	'Hemi': '半',
	'Per': '每',

	'Super':'超',
	'Hyper':'超',
	'Ultra':'超',
	'Ultimate':'终极',

	'Sub': '子',
	'Quasi': '准',
	'Pseudo':'伪',
	'Pseudoprime':'伪素数',
	'Multi': '多',
	'Except': '除了',

	'With': '以',

	'Alternant':'交错',
	'Alternate':'交错;交替',

	// measure

	// 空间

	'Margin': '间距',
	'Spacing': '间隔',
	'Position': '位置',
	'Size': '大小',
	'Length': '长度',
	'Shape': '形状',
	'Row': '行',
	'Column': '列',
	'Rows': '行数',
	'Columns': '列数',
	'Pitch': '音调',

	'Progress': '进度',

	'Style': '样式',
	'Color': '颜色',
	'Colors': '颜色',
	'Colorful':'彩色',

	'Colouring':'着色',
	'Coloring':'着色',

	'Packing':'装填;填充',

	'Hue':'色调',
	'Gradient': '渐变',
	'Contrast': '对比度',
	'Brightness': '亮度',
	'Saturate': '饱和度',
	'Grayscale': '灰度',
	'Sepia': '色偏',
	'Invert': '反相',
	'DropShadow':'投影',
	'Projection':'投影',

	// 时间		
	'Time': '时间',
	'Times': '次数',
	'Frequency':'频率',
	'Count':'计数',
	'Speed': '速度',

	// 抽象属性
	'Path': '路径',
	'URL': '网址',
	'Version': '版本',
	'Type': '类型',
	'Classification': '分类',
	'Parameter': '参数',
	'Argument':'参数',

	'Structure': '结构',
	'Hotkey': '快捷键',

	'Unit': '单位',
	'Value': '值',
	'Values': '值',

	'Information': '信息',
	'Font': '字体',
	'Padding':'内边距',
	'Language': '语言',

	'Difficulty': '困难',
	'Eagerness': '热切程度',
	'Step': '步;步长',

	'Event': '事件',
	'Reusability': '复用性',

	// 自由描述



	'Glossary': '词汇表',
	'Lexicon':'词汇表',
	'Corpus': '语料',
	'Grammar': '语法',
	'Context': '语境',
	'Linguistics': '语言学',

	'Tautology':'重言式', // 永真式
	'Contradiction':'矛盾',

	'Expression': '表达式',

	'Code': '代码',
	'Encode':'编码',
	'Decode':'解码',
	'Coding':'编码',
	'QRcode': '二维码',

	'Snippet': '片段',
	'Char': '字符',
	'Character': '字符',
	'Content': '内容',
	'Contents': '目录',

	'Hidden': '隐藏',
	'Element': '元素',
	'Support': '支持',
	'Presentation Markup': '表现型标记',
	'Content Markup': '内容型标记',
	'Markup': '标记',
	'Mark': '标记',
	'Readonly':'只读',

	'Object': '对象',
	'Entity': '实体',

	'Component': '组件',
	'Closure': '闭包',
	'Computing Power': '计算能力',
	'Synergy': '协同能力',

	'Latin': '拉丁字母',
	'Greek': '希腊字母',
	'Hebrew': '希伯来文',
	'Lowercase': '小写',
	'Uppercase': '大写',
	'Case Sensitive':'区分大小写',

	'Rule': '法则',
	'Aims': '宗旨',
	'Vision': '愿景',
	'Protocol': '协议',
	'Whitepaper': '白皮书',
	'Copyright': '版权',
	'Licence': '许可证',
	'Privacy': '隐私',
	'Policies': '政策',
	'Terms': '条款',
	'Knowledge':'知识',

	'Creative Commons': '知识共享',

	'Consensus': '共识',
	'Cooperation': '合作',
	'Reciprocity':'互惠',
	'Condition': '条件',

	'Absorb':'吸收',
	'Tangle':'缠结',

	// adj.	prep.

	'Discrete':'离散',
	'Continuous':'连续',
	'Continuation':'延拓',
	'Continued':'连',

	'Big': '大',
	'Small': '小',
	'Double': '双',
	'Triple': '三',
	'Random': '随机',
	'Stochastic':'随机',
	'Default': '默认',
	'Advanced': '高级',

	'Core': '核心',
	'Blended': '混合',
	'Mixed': '混合',
	'Compound': '复合',

	'Related': '相关',
	'Source': '源',
	'Native': '原生',
	'Static': '静态',
	'Dynamic': '动态',

	'Accident':'意外',
	'Universal': '全称;普适',
	'Typical': '典型',
	'Elementary': '初等',
	'Key': '关键',
	'Horizontal': '水平',
	'Vertical': '垂直',
	'Center': '居中',
	'Full Screen': '全屏',
	'Phantom': '隐形',
	'Inner': '内',
	'Outer': '外',
	'Endo':'内',
	'Symmetric': '对称',
	'Asymmetric': '反对称',
	'Antisymmetric':'反对称',
	'Symmetry': '对称',

	'Unsolved': '未解',
	'Solved':'已解决',
	'Open': '开放',
	'Compatible': '相容',

	'Comparison':'比较',

	'High': '高',
	'Low': '低',
	'Long': '长',
	'Short': '短',

	'Up': '上',
	'Down': '下',
	'Left': '左',
	'Right': '右',
	'Backward':'后向;向后',
	'Forward':'前向;向前',


	'Upper':'上',
	'Lower':'下',

	'Half':'半',

	'Clockwise': '顺时针',
	'Anticlockwise': '逆时针',

	'Rad': '弧度',
	'Degree': '度;程度',

	'Bold': '加粗',
	'Italic': '斜体',
	'Underline': '下划线',
	'Strikeline': '删除线',
	'Highlight': '高亮',

	'ul': '无序列表',
	'ol': '有序列表',
	'dl': '定义列表',
	'Block': '块',
	'Inline': '行内',
	'Quote': '引用',
	'Quotes':'名言',
	'Blockquote': '块引用',

	'Checkbox': '勾选框',

	'Almost':'几乎',
	'All': '全部',
	'Everywhere':'处处',

	'Summarize': '概括',

	'Systematized': '系统化',
	'Semantical': '语义化',
	'Structural': '结构化',
	'Organized': '组织化',

	'Organic': '有机',
	'Self-improvement': '自我完善的',
	'Self-consistent': '自洽的',

	'Legal': '合法的',

	'Stable': '稳定的',
	'Stability':'稳定性',

	'Portable': '便携的',

	'Efficient': '高效的',
	
	'Auto':'自',
	'Automate': '自动',
	'Flexible': '灵活的',
	'Agile': '敏捷的',
	'Compact': '紧',
	'Noncompact':'非紧',
	'Extend':'扩展',
	'Extendable': '可扩展',
	'Enumeration':'枚举',
	'Customizable': '可定制',
	'Convenient': '方便的',
	'Handy': '便利的',
	'Easy': '容易的',
	'Free': '自由的;免费',

	'Layered': '分层的',
	'Hierarchical': '等级的',
	'Practical': '实用的',
	'Unambiguous': '无歧义的',
	'Functional': '功能性的',
	'Reusable': '可重用的',
	'Inspiring': '启发性的',
	'Detailed': '详细的',
	'Stepwise': '提供步骤的',
	'Interpretable': '可解释的',

	'Timely': '及时',
	'Non-discriminatory': '无歧视',
	'Kind': '友善的',
	'Pally': '亲密的',
	'Peace-loving': '爱好和平的',

	'On':'关于;开',
	'Off':'关',
	'Only':'只',
	'Smooth': '平滑',
	'Offline': '离线',
	'Local': '本地',
	'Localized': '本地化',
	'Online Connection': '联网',
	'Energy Consumption Minimization': '能耗最小化',
	'Open Access': '开放获取',

	'Symbol': '符号',

	'if':'如果',
	'iff':'当且仅当',


	'Numeral': '数值',
	'Numerical': '数值',
	'String': '字符串',
	'Region': '区域',
	'Data': '数据',
	'Database':'数据库',
	'Data Base':'数据库',
	'Opacity': '透明度',

	'Edge':'边',
	'Band':'带',
	'Bandwidth':'带宽',
	'Width': '宽',
	'Height': '高',
	'Depth':'深度',
	'Shadow': '阴影',
	'Direction': '方向',
	'Directional': '方向',
	'Grad':'梯度',
	'Partial':'偏',
	'Total':'全',
	'Basic':'基本',
	'Option': '选项',

	'Branch':'分支',
	'Attribute': '属性',
	// action
	'Append': '添加',
	'Focus': '聚焦',
	'Begin': '开始',
	'at first': '最先',
	'End': '结束',
	'at last': '最终',
	'Start': '开始',
	'Finish': '完成',
	'Yield':'生成',

	'Need': '需要',
	'Ignore': '忽略',
	'Filter': '过滤;滤镜',
	'Measure': '测量',
	'Get': '获取',
	'Create': '创建',
	'Put': '放置',
	'Close': '关闭',
	'Composite': '复合',
	'Draw': '画',
	'Drag': '拖拽',
	'Download': '下载',
	'Upload': '上传',
	'New': '新',

	'Old': '旧',

	'TOC': '目录',
	'Generate': '生成',
	'Scan': '扫描',
	'Update': '更新',
	'Render': '渲染',
	'Remove': '移除',
	'Illustration': '插图',
	'Zoom': '缩放',
	'Resize': '调整尺寸',

	'More':'更多',
	'Less':'更少',

	'More than':'多于',

	'Greater than':'大于',
	'Less than':'小于;少于',

	'Earlier than':'先于',
	'Later than':'晚于',

	'At Least':'至少',
	'At Most':'至多',

	'Solve': '解题',
	'Question Type': '题型',

	'Setting': '设置',
	'Reset':'重置',

	'Decomposition': '分解',
	'Emotionalization': '情感化',
	'Parameterize':'参数化',
	'Parameterization': '参数化',

	'Forcing':'力迫',

	'Classify':'分类',
	'Symbolize':'符号化',
	'Symbolization':'符号化',
	'Functionalize':'函数化',
	'Functionalization': '函数化',

	'Aural':'听觉',
	'Visual':'视觉',
	'Visualize':'可视化',
	'Visualization': '可视化',
	'Decentralization': '去中心化',

	'Integration': '整合',


	'Initialize': '初始化',
	'Operation': '运算',
	'Operate': '操作',
	'Explore': '探索',
	'Reconnaissance':'勘探',
	'Reconnoitering':'侦察',
	'Reconnoitre':'侦察',

	'Investigate':'研究',
	'Exhaust':'穷举',
	'Concretize':'具体化',
	'Counter-example':'反例',
	'Counterexample':'反例',
	'Search': '搜索',
	'Not Found':'未找到',
	'Index':'索引',
	'Regexp':'正则表达式',

	'Contact': '联系',
	'Donate': '捐助',

	'Interoperability': '互操作',

	'Align': '对齐',
	'Overlap': '重叠',
	'Clip': '裁剪',
	'Crop': '裁剪',
	'Trim':'去空',

	'Offset': '偏移',
	'Scale': '缩放',
	'Skew': '扭曲',
	'Translate': '平移;翻译',
	'Transitive':'传递',

	'Rotate': '旋转',
	'Display': '显示',
	'Toggle': '切换',
	'Collapse': '折叠',
	'Hide': '隐藏',
	'Blur': '模糊',
	'Fill': '填充',
	'Stroke': '描边',
	'Move': '移动',

	'Move Left': '左移',
	'Move Right': '右移',
	'Move Up': '上移',
	'Move Down': '下移',

	'Increase': '增加',
	'Decrease': '减少',

	'Select': '选择',
	'Select All':'全选',
	'Selection':'已选中部分',

	'Printing':'打印',
	'Bet':'注',
	'Append':'添加',
	'AppendTo':'添加到',
	'Edit': '编辑',
	'Replace': '替换',
	'Copy': '复制',
	'Clone': '克隆',
	'Duplicate':'复制',
	'Cut': '剪切',
	'Delete': '删除',
	'Clear': '清除',
	'Refresh': '刷新',
	'Paste': '粘贴',
	'Redo': '重做',
	'Undo': '撤销',
	'Record': '录制',
	'Play': '播放',
	'Pause': '暂停',
	'Stop': '停止',
	'Save': '保存',
	'SaveAs': '另存',

	'Initial':'始',
	'Terminal':'终',
	'Incidence':'入射',

	'Input': '输入',
	'Output': '输出',
	'Refer': '参考',
	'Reference':'参考资料',

	'Reflect':'反射',
	'Reflexive':'自反',

	'Link': '链',
	'href': '超链接',
	'Lerp': '线性插值',

	'i18n': '国际化',//	'Internationalization':'国际化',
	'l10n': '本土化',	//Localization 
	'Misc':'杂项',
	'Miscellaneous':'杂项',

	'Nationality':'国籍',
	'Nation':'国家',

	'Avatar':'头像',
	'Card':'卡片',
	'Process':'流程',
	'Words': '文字',
	'Command': '命令',

	'Comment':'评论',
	'Badge':'徽章',
	'Overlay':'覆盖',
	'Button':'按钮',

	'Classic':'经典',
	'Classical':'古典',

	'Commercial':'商业',

	'Resource':'资源',

	'Deprecated':'不推荐',

	'Available':'可用',
	'Jargon':'行话',
	'Parlance':'术语',
	'Metaphor':'隐喻',
	'Ansatz':'拟设',

	'Word':'词',
	'Communicate':'交流',


	//自然事物 0000

	'Arch':'拱',
	'Atlas':'地图册',
	'Atom':'原子',
	
	'Banana':'香蕉',

	'Barbell':'杠铃',
	'Bean':'豆',
	'Beast':'野兽',
	'Bee':'蜜蜂',
	'Beetle':'甲虫',
	'Bridge':'桥',

	'Cattle':'牛',

	'Fern':'蕨',
	'Gallery':'画廊',



	'Island':'岛',

	
	'Pistol':'手枪',
	'Propeller':'螺旋桨',


	'Sieve':'筛',
	'Tortoise':'乌龟',

	'Tree':'树',

	'Wave':'波',

	'Wheel':'车轮',
	'Worm':'蠕虫',


	//Math concept

	// noun

	// structure entity

	'Zero':'零',
	'One':'一',
	'Two':'二',
	'Three':'三',
	'Four':'四',
	'Five':'五',
	'Six':'六',
	'Seven':'七',
	'Eight':'八',
	'Nine':'九',
	'Ten':'十',
	'Eleven':'十一',
	'Twelve':'十二',
	'Thirteen':'十三',
	'Fourteen':'十四',
	'Fifteen':'十五',
	'Sixteen':'十六',
	'Seventeen':'十七',
	'Eighteen':'十八',
	'Nineteen':'十九',
	'Twenty':'二十',


	'First':'第一',
	'Second':'第二;秒',
	'Third':'第三',
	'Fourth':'第四',
	'Fifth':'第五',
	'Sixth':'第六',
	'Seventh':'第七',
	'Eighth':'第八',
	'Nineth':'第九',
	'Tenth':'第十',
	'Eleventh':'第十一',
	'Twelfth':'第十二',
	'Thirteenth':'第十三',
	'Fourteenth':'第十四',
	'Fifteenth':'第十五',
	'Sixteenth':'第十六',
	'Seventeenth':'第十七',
	'Eighteenth':'第十八',
	'Nineteenth':'第十九',
	'Twentyth':'第二十',

	'One-Third':'三分之一',
	'Two-Thirds':'三分之二',

	'Twice':'两次',
	'Thrice':'三次',

	'Twin':'孪生',
	'Twin Prime':'孪生素数',
	'Pairwise Coprime':'两两互素',
	'Zeros':'零点',

	'Sort':'排序',
	'Ascending':'升序',
	'Descending':'降序',

	'Null':'空',
	'Blank':'空',
	'Number': '数',
	'Comma':'逗号',
	'Semicolon':'分号',

	'Prime Mersenne Number': '梅森素数',
	'Amicable':'亲和',

	'Form': '型;形式',
	'Normal Form': '标准型',

	'Abnormal':'反常',
	'Anomalous':'异常',
	'Anomaly':'异常',
	'Cancellation':'消去',

	'Array': '数组',
	'Integer': '整数',
	'Fraction': '分数',

	'Mixed Fraction':'带分数',
	'Propper':'真',
	'Impropper':'假',

	'Reducible':'可约',
	'Irreducible':'既约',
	'Irreducibility':'不可约',

	'Persistent':'持续',
	'Sign':'符号',
	'Asterisk':'星号',

	'Digits':'位数',
	'Quantity':'数量',
	'Constant':'常数',
	'Variable':'变量',
	'Variant':'变量',
	'Invariant':'不变量',
	'Equivariant':'等变',

	'Variate':'变量',
	'Spline':'样条',
	'Monster':'魔',

	'Pure':'纯',
	'Decimal': '小数',
	'Sequence': '数列',
	'Sequences': '数列',

	'Aliquot':'因数和余',

	'Poly':'多',
	'Uni':'单',
	'Bi':'二',
	'Tri':'三',
	'Tetra':'四',
	'Penta':'五',
	'Hexa':'六',

	'Octa':'八',
	'Hendeca':'十一',
	'Dodeca':'十二',
	'Icosa':'二十',

	'Grand':'大',

	'Partite':'分',
	'Bipartite':'二分',
	'Partition':'分割',

	'Nomial': '项式',
	'Polynomial': '多项式',
	'Power': '幂',
	'Series': '级数',
	'Logarithm':'对数',

	'Equation': '方程',
	'Equations': '方程组',
	'Equation Array': '方程组',
	'Inequation': '不等式',
	'Analysis': '分析',
	'Analytic': '解析',
	'Limit': '极限',

	'Encompass':'包含',
	'Identity':'恒等式',
	'Consecutive':'连续',
	'Derivative': '导数',
	'Partial Derivative': '偏导数',

	'Ideal':'理想',
	'Cohomology':'上同调',
	'Homology':'同调',
	'Homologous':'同调',
	'Homological':'同调',
	'Homography':'单应性',

	'Congruent':'全等',
	'Congruence':'同余式',
	'mod':'模',
	'Mod':'模',

	'Separate':'分隔',
	'Connectivity':'连通性',

	'Vector': '向量',
	'Tensor': '张量',
	'Matrix': '矩阵',
	'Matroid':'拟阵',
	'Identity Matrix': '单位矩阵',
	'Square Matrix': '方阵',

	'Potential':'势',
	'Vector Field':'向量场',
	'Vector Space':'向量空间',

	'Space': '空间;空格',

	'Backslash':'反斜杠',

	'Kernel': '核',
	'Pair':'对',


	'Spectral':'谱',
	'Actuarial':'精算',

	'Permutation': '置换',
	'Substitution':'替换',
	'Substitute':'替换',
	'Relation': '关系',
	'Function': '函数',
	'Proposition': '命题',

	'Logic': '逻辑',
	'Algebra': '代数',
	'Algebroidal':'代数体',

	'Ausdehnungslehre':'扩张论',//德语

	'Axonometry':'轴侧图',

	'Azimuth':'方位角',
	'Azimuthal':'方位角',

	'Aztec':'阿兹特克',

	'Geometry': '几何',
	'Straight-edge':'直尺',
	'Compass':'圆规',
	'Graph': '图',
	'Diagram':'图',
	'Graphing': '作图',
	'Digraph':'有向图',

	'Set': '集;集合',
	'Subset':'子集',

	'Empty':'空',



	'Group': '群;群组',

	'Monoid':'幺半群;独异点',

	'Monodromy':'单值',

	'Unicity':'单一性',
	'Multiplicity':'多重性',

	'Ring': '环',
	'Field': '域',
	'Lattice': '格',

	'Arbitrary':'任意',
	'Approximate':'近似',
	'Approximately':'约',
	'Approximation':'逼近',
	'Approximable':'逼近',

	'Equal':'等',
	'Equals':'等于',
	'Equal To':'等于',
	'Equality': '等式',
	'Non-equality': '不等式',
	'Inequality':'不等式',
	'Inequalities':'不等式',

	'Equivalence': '等价关系',
	'Partial Order': '偏序',
	'Total Order': '全序',

	'Poset':'偏序集',
	'Cover': '覆盖',
	'Chain': '链',
	'Inversion': '逆序',

	
	'Connect':'连接',

	'Dot': '点',

	'System': '系;系统',



	'Sine':'正弦',
	'Cosine':'余弦',
	'Tangent':'正切',
	'Cotangent':'余切',
	'Secant':'正割',
	'Cosecant':'余割',

	// 几何相关

	'Point': '点',
	'Vertex': '顶点',
	'Vertices': '顶点',
	'Origin': '原点',
	'Centroid': '质心',
	'Barycentric':'重心',
	'Orthocenter': '垂心',
	'Incenter': '内心',
	'Circumcenter': '外心',
	'Parallel':'平行',
	'Perpendicular':'垂直',
	'Perpendicular Foot': '垂足',
	'Foci': '焦点',

	'Horned':'有角',

	'Quadrant':'象限',
	'Over': '上',
	'Under': '下',

	'Coordinate': '坐标',
	'Centroid Coordinate': '中心坐标',
	'Abscissa':'横坐标',
	'Ordinate':'纵坐标',

	'Axis': '轴',
	'Axial':'轴',
	'Tick': '刻度',
	'Grid': '网格',


	'Line': '线;行;直线',

	'Line Segment': '线段',

	'Angle': '角',
	'Rt': '直角',

	'Angle of Attack':'攻角',//迎角
	'Angle-Preserving':'保角',
	'Length-Preserving':'保长',
	'Sphere-Preserving':'保球面',
	'Area-Preserving':'保积',
	'Measure-Preserving':'保测',
	'Orientation-Preserving':'保向',
	'Orientation-Reversing':'逆向',

	'Distance':'距离',
	'Velocity':'速度',

	'gon': '边形',
	'Polygon':'多边形',
	'Regular Polygon': '正多边形',


	'Polyiamond':'三角面多边形',
	'Triangle': '三角形',
	'Angular':'角',
	'Right Triangle': '直角三角形',
	'Outer Napoleon Triangle':'第一拿破仑三角形',
	'Inner Napoleon Triangle':'第二拿破仑三角形',
	'Tangential Triangle':'外切三角形',
	'Altitude Triangle':'高线三角形',
	'Medial':'中位',
	'Median Triangle':'中线三角形',
	'Oblique':'斜',
	'Acute':'锐',
	'Acute Triangle':'锐角三角形',

	'Square': '正方形;平方',
	'Squarefree':'无平方',
	
	'Rectangle': '矩形;长方形',

	'Lateral':'边',
	'Quadrilateral': '四边形',
	'Parallelogram': '平行四边形',
	'Rhombus': '菱形',
	'Trapezoid': '梯形',

	'Pentagon':'五边形',
	'Hexagon':'六边形',
	'Hex':'六边形',
	'Enneagon':'九边形',
	'Nonagon':'九边形',

	'Sextic':'六次',
	'Fish Bladder':'鱼鳔形',
	'Parabola': '抛物线',
	'Hyperbola': '双曲线',


	'Circle': '圆',
	'Ellipse': '椭圆',
	'Incircle': '内切圆',
	'Circumcircle':'外接圆',
	'Excircle':'外切圆',
	'Escribed':'旁切',
	"Elliptic": "椭圆型",

	"Parabolic": "抛物型",

	'Ellipsoid':'椭球',
	'Cone': '圆锥',
	'Cylinder': '圆柱',

	'Curve': '曲线',
	'Section':'等分',
	'Conic Section': '圆锥曲线',
	'Catacaustic':'回光',


	'Arc': '弧;反',
	'Polyline': '折线',
	'lineHV': '横竖线',
	'Vertex Line': '顶点连线',
	'Bisector': '平分线',
	'Midline': '中位线',
	'Median': '中位数',
	'Median Line': '中线',
	'Altitude': '高',
	'Latitude':'纬度',
	'Longitude':'经度',
	'Amplitude':'振幅',

	'Magnitude':'大小',
	'Midpoint': '中点',
	'MidPoint Line': '中点连线',
	'Opposite Mid Point Line': '对边中点连线',
	'Perpendicular Foot Line': '垂足连线',

	'Bowing':'弯度',
	'Weight':'重量',
	'Seed':'种子',
	'Gap':'空隙',
	'Fitting':'贴合',

	'Surface': '表面',
	'Curved Surface': '曲面',
	'Plane': '平面',
	'Sphere': '球面',

	'Volume':'体',
	'Solid': '立体',
	'Solids': '多面体',

	'Equator': '赤道',
	'Fractal': '分形',


	'Polytope':'多胞形',
	'Hedron':'面体',
	'Polyhedron':'多面体',
	'Polyhedra':'多面体',
	'Regular Polyhedron':'正多面体',
	'Uniform Polyhedron':'正多边形多面体',
	'Noble polyhedron':'正直多面体',

	'Polychoron':'四维多胞体',

	'Tetrahedron':'四面体',
	'Octahedron':'八面体',
	'Hendecahedron':'十一面体',
	'Dodecahedron':'十二面体',
	'Icosahedron':'二十面体',
	'Rhombohedron':'菱面体;斜方六面体',
	'Parallelepiped':'平行六面体',

	'Stellating':'星形',
	'Stellation':'星形',
	'Astroid':'星状',
	'Prismatoid':'拟柱体',
	'Diamond':'钻石',

	'Broken':'坏',
	'Prism':'棱柱',
	'Pyramid':'棱锥',

	'Frustum':'棱台',

	'Touch':'相切',
	'Intouch':'内切',
	'Extouch':'旁切',

	'Coaxal':'共轴',

	'Special':'特殊',
	'Equi':'等',
	'Isosceles': '等腰',
	'Isogonal':'等角',
	'Isotoxal':'等边',
	'Isohedral':'等面',
	'Isotopy':'合痕',

	'Anisohedral':'非等面',

	'Authalic':'等积',
	'Equidistant':'等距',

	'Identical':'恒等',

	'Reduced':'简化',

	'Kepler–Poinsot':'正星形',


	'Cube':'正方体;立方',


	'Cuboid':'长方体',


	'Manifold':'流形',


	'Persistence':'持久性',
	'Adequate':'足够',
	'Adiabatic':'绝热',

	// measure
	//代数
	'Domain': '定义域',
	'Range': '值域',


	'Sum': '求和',
	'Prod': '求积',
	'Direct Sum':'直和',
	'Direct Product':'直积',

	'Add':'添加',
	'Addition':'加法',
	'Additive':'加性',
	'Addend':'加数',
	'Adjunct':'附加',
	'Ambient':'连带',
	'Admittance':'导纳',

	'Subtraction':'减法',
	'Multiplication':'乘法',
	'Harmonic': '调和;和谐',
	'Anharmonic':'不和谐',
	'Law':'法则;定律;法律',

	'Anonymous':'匿名',

	'Combination': '组合',
	'Combination Number':'组合数',
	'Permutation Number':'排列数',

	'Combinatorial': '组合',
	'Combinator':'组合子',
	'Permanent':'积和式',
	'Immanant':'',

	'Exponential':'指数',

	'Arrangement':'排列',

	'Factorization': '分解',
	'Factorize': '分解',
	'Expansion': '展开',
	'Factorial': '阶乘',
	'Factorial Base': '阶乘进制',
	'Factoriadic': '阶乘进制',

	'Divisor':'因子',
	'Factor':'因子',

	'Greatest Common Divisor': '最大公约数',
	'Least Common Multiple': '最小公倍数',
	'Division': '除法',
	'Aliquant':'除不尽',

	'Fiber':'纤维',
	'Bundle':'丛',
	'Cluster':'聚类;集群',

	'Base': '基',
	'Basis':'基',

	'Product': '积',
	'Cross Product': '叉积',
	'Digit': '数位',

	'Block': '分块',
	'Rank': '秩',
	'Trace': '迹',
	'Order': '阶;序',
	'Piece': '分段',

	'Det': '行列式',
	'Determinant': '行列式',
	'Determined':'定',

	'Unexpected':'意外',
	'Unfinished':'未完成',
	'Underdamped':'欠阻尼',
	'Norm': '模',
	'Inverse': '逆',
	'Cofactor': '余子式',
	'Minor': '子式',

	'Leading Principle Minor': '顺序主子式',

	'Dependent':'相关',
	'Independent':'无关',
	'Independence':'独立',
	'Max':'最大',
	'Min':'最小',
	'Extremum':'极值',
	'Extreme':'极',

	'Maximum':'最大值',
	'Minimum':'最小值',

	'Maximal':'最大',
	'Minimal':'最小',

	'Moment':'矩',
	'Involution':'对合;内卷',
	'Monotone':'单调',

	'Interpolation':'插值',
	'Extrapolation':'外推',

	'Binom': '二项式',
	'Subsup': '上下标',

	'Dimension': '维',
	'Phenomenon':'现象',
	// 几何

	'Diameter': '直径',
	'Radii': '半径',
	'Side':'边',
	'Sides': '边数',
	'Side Length': '边长',
	'Hypotenuse':'斜边',
	'Perimeter':'周长',
	'Area':'面积',
	'Surface Area':'表面积',
	'Similar':'相似',

	'Density':'密度',
	'Fixed':'不动',

	'Contour':'等高线',
	'Adjacent':'邻',


	// verb

	'Swap': '切换',

	'Convert': '转换',
	'Express': '表示',
	'Representation':'表示',
	'Simplify': '化简',

	'Simply':'简单',
	'Simplicial':'单',

	'Divide': '整除',

	'Transpose': '转置',
	'Normalize': '单位化',
	'Orthogonal':'正交',
	'Orthogonalize': '正交化',
	'Gram-Schmidt': '正交单位化',
	'Enumerate': '枚举',
	'Diagonalize': '对角化',

	// 几何

	'Transform': '变换',
	'Transformation': '变换',

	'Map': '映射;地图',
	'Mapping': '映射',




	'Wavelet':'小波',

	// adj
	'Strong':'强',
	'Weak':'弱',

	'Perfect':'完全',
	'Antipode':'对跖',
	'Antipodal':'对跖',

	//代数
	'Absolute': '绝对',
	'Positive': '正',
	'Negative': '负',
	'Natural': '自然',
	'Prime': '质',
	'Primality':'素性',

	'Primitive':'原;本原',

	'Totient':'与因子互素数',

	'Palindrome':'回文',

	'Thrackle':'单满交线',

	'Rational': '有理',
	'Irrational': '无理',
	'Rationalize':'有理化',
	
	'Radical': '根式',
	'Root': '根',
	'Roots': '根',
	'Solution':'解',

	'Ratio':'比例',
	'Rate':'比',
	//'Ratio':'比率',
	'Account for':'占',

	'Transcendental': '超越',
	'Real': '实',
	'Imaginary': '虚',
	'Complex': '复',

	'Complexity':'复杂度',
	'Implicit':'隐',
	'Cycle':'循环',

	'Cyclic':'周期',
	'Acyclic':'非周期',

	'Iterative':'迭代',
	'Iterate':'迭代',

	'Regular': '正则',
	'Regularized':'正则化',


	'Singular': '奇异',
	'Linear': '线性',

	'Eigen': '特征',
	'Adjoint': '伴随',	//伴随变换，共轭变换，共轭转置矩阵A^H
	'Adjugate': '伴随',	 //伴随矩阵，代数余子式矩阵转置
	'Conjugate': '共轭',
	'Augmented': '增广',
	'Augmentation': '增广',
	'Diagonal': '对角',
	'Hermitian': '共轭转置',

	'Coprime': '互素',
	'Recursive': '递归',
	'Cross': '交叉',

	'Commutative':'交换',
	'Associative':'结合',
	'Associated':'相伴',

	'Parentheses': '括号',
	'Nest': '嵌套',
	'Symmetry': '对称',
	'Asymptotic':'渐进',
	'Asymptote':'渐近线',
	'Asymptosy':'渐近线',

	'Primary': '主',
	'Secondary': '次',

	'Symplectic':'辛',

	'Simple': '简单',
	'Closed': '闭合',
	'Clockwise': '顺时针',
	'Counterclockwise': '逆时针',


	'Infinite': '无穷;无限',
	'Finite':'有限',
	'Infinity':'无限',

	'Cell':'胞',
	
	'Cellular':'元胞',
	'Automaton':'自动机',
	'Automata':'自动机',
	'Automorphy':'自守',
	'Automorphism':'自同构',
	'Morphism':'态射',
	'Diffeomorphism':'微分同胚',
	'Homeomorphism':'同胚',
	'Homomorphism':'同态',
	'Isomorphism':'同构',
	'Endomorphism':'自同态',

	'Holomorphic':'全纯',
	'Isomorphic':'同构',

	'Reconstruction':'重构',

	'Quantum':'量子',

	'Unary': '一元',
	'Binary': '二元',
	'Ternary': '三元',
	'Multiary': '多元',//Multiary n-ary Polyadic

	'Quadratic': '二次',
	'Quadric': '二次',
	'Cubic': '三次',

	'Quintic':'五次',
	'Sextic':'六次',

	'Triplet':'三元',
	'Quadruple':'四元',
	'Quaternion':'四元数',
	'Octonion':'八元数',
	'Sedenion':'十六元数',

	'Regress':'回归',
	'Regressive':'回归',
	'Regression':'回归',



	//几何

	'Conic': '圆锥',
	'Convex': '凸',
	'Concave': '凹',
	'Circum': '外接',


	'Equilateral':'等边',
	'Scalene':'不等边',
	'Pedal':'垂足',
	'Orthic Triangle':'高线三角形',

	'Radial': '径向',
	'Straight': '直',

	'Pole':'极',
	'Polar': '极坐标',
	'Cartesian':'笛卡尔',
	'Affine':'仿射',
	'Affine Hull':'仿射包',

	'Agonic':'无偏',

	'Cylindrical': '柱面',
	'Spherical': '球面',

	'Truncate':'截短;缩短',
	
	'Sphenocorona':'球形屋根',

	'Curvature':'曲率',
	'Torsion':'挠率',

	'Gasket':'垫圈',


	//of Math subject
	'Arithmetic': '算术',
	'Algebraic': '代数',
	'Algebraically':'代数',

	'Geometric': '几何',
	'Trigonometric': '三角',
	'Hyperbolic': '双曲',

	'Logistic': '逻辑',
	'Probabilistic': '概率',
	'Probability':'概率',

	'Topology': '拓扑',
	'Anchor Ring':'环面',
	'Annulus':'圆环',
	'Torus':'环面',



	'Spreadsheet':'表格',

	'Operator':'算子',
	'Functor':'函子',
	'Attractor':'吸引子',
	'Commutator':'交换子',

	'Attract':'吸引',

	'Scheme':'概形',
	'Schema':'模式',

	'Formal': '形式',
	'Conformal':'共形',
	'Differential': '微分',
	'Differentiable':'可微',

	'Difference':'差分;区别',

	'Integral': '积分',
	'Integrable':'可积',

	'Contour Integral': '围线积分',


	'Uniform':'一致;统一',
	'Convergence':'收敛',
	'Uniform Convergence':'一致收敛',

	'Uniformization':'单值化',
	'Unimodal':'单峰',
	'Unimodular':'幺模',
	'Modular':'模',

	'Module':'模',
	'modulo':'模',

	'Moduli':'模',

	'Union':'并',
	'Unitary':'酉',

	'Complemented':'补',
	'Complementary':'余',
	'Supplementary':'补',

	'Ant':'蚂蚁',
	'Ant Colony':'蚁群',
	'Percolation':'渗流',

	'Abacus':'算盘',

	'Abundancy':'丰度',
	'Abundance':'丰富性',
	'Abundant':'盈',
	
	'Braid':'辫',
	'Spiral':'螺旋',
	'Helix':'螺旋线',

	
	'Magnetic':'磁',
	'Ferromagnetic':'铁磁',
	

	'Accelerate':'加速',
	'Accuracy':'精度',
	'Precision':'精度',

	'Accumulate':'积累',
	'Accrete':'堆积',
	'Advect':'平流',

	'Boolean': '布尔',

	'Indefinite': '不定',
	'Definite': '定',

	'Theory':'理论',

	'Set Theory':'集合论',
	// 人名


'von':'冯·',//⋅
'van':'范·',
'der':'德',

'Abelian':'阿贝尔',
'Abelianization':'阿贝尔化',

'Apollonian':'阿波罗',
'Archimedean':'阿基米德',
'Artinian':'阿廷',
'Aurifeuillian':'奥利菲力',


'Bayesian':'贝叶斯',

'Diophantine':'丢番图',

'Hamiltonian':'哈密顿',

'Jacobian':'雅可比',

'Laplacian':'拉普拉斯',

'Noetherian':'诺特',

'Platonic':'柏拉图',



'Abel':'阿贝尔',
'Achilles':'阿基里斯;阿喀琉斯',
'Ackermann':'阿克曼',

'Adams':'亚当斯',
'Adelard':'阿德拉德',
'Adèle':'阿黛尔',


'Adleman':'阿德勒曼',
'Ado':'阿朵',
'Adomian':'阿朵米安',

'Agnesi':'阿涅西',
"Agnesi's Witch":'箕舌线',	//意大利语versoria 与女巫versiera 类似
'Agnésienne':'箕舌线',

'Agoh':'艾构',
'Agrawal':'阿格拉瓦尔',

'Ahlfors':'阿尔福斯',
'Ahmed':'阿麦德',

'Aida Yasuaki':'会田安明',
'Airy':'艾里',
'Aitken':'艾特肯',
'Aiyar':'艾亚尔',
'Ajima':'阿吉玛',
'Ajima Naonobu':'安岛直圆',


'Akhmim':'艾赫米姆',

'Akinetor':'广义张量',


'Alaoglu':'阿劳格鲁',

'Albanese':'阿尔巴内塞',
'Albers':'阿尔伯斯',
'Albert':'阿尔伯特',
'Alberti':'阿尔贝蒂',

'Alcuin':'阿尔昆',


'Alhazen':'阿尔哈曾',
'Al-haytham':'海什木',

'Al-karaji':'卡拉吉',
'Al-kashi':'卡西',
'Al-khwarizmi':'花拉子米',
'Al-khowarizmi':'花拉子米',

'Allendoerfer':'艾伦多弗',



'Alexander':'亚历山大',
'Alexandrov':'亚历山德罗夫',
'Aleksandrov':'亚历山德罗夫',


'Alon':'阿隆',

'Alvero':'阿弗罗',

'Anaxagoras':'安纳萨格拉斯',
'Anderson':'安德森',

'Andrásfai':'安德拉法',
'André':'安德烈',
'Andreini':'安德尼',
'Andrew':'安德鲁',
'Andrews':'安德鲁斯',

'Andrica':'安德里克',

'Anger':'安格尔',

'Anosov':'阿诺索夫',

'Anthonisz':'安托尼兹',
'Antiphon':'安蒂丰',

'Antoine':'安托万',

'Apéry':'阿佩里',
'Apollonius':'阿波罗尼奥斯',

'Appell':'阿佩尔',


'Arakelov':'阿拉克洛夫',

'Araya':'阿拉亚',


'Archimedes':'阿基米德',
'Archytas':'阿契塔斯',

'Argand':'阿尔冈',

'Aristotle':'亚里士多德',

'Armanios':'阿玛尼奥斯',
'Armstrong':'阿姆斯特朗',

'Arnauld':'阿尔诺',

'Arnold':'阿诺德',


'Aronhold':'阿龙霍尔德',

'Aronson':'阿伦森',





'Artin':'阿廷',
'Aryabhata':'阿耶波多',


'Aschbacher':'阿什巴赫',

'Atiyah':'阿蒂亚',

'Aubel':'奥布尔',

'Aurifeuille':'奥利菲力',

'Babbage':'巴贝奇',

'Bachelier':'巴舍利耶',
'Bachet':'巴谢',

'Backhouse':'巴克豪斯',

'Backus':'巴克斯',

'Bader':'巴德',
'Baer':'巴尔',
'Bahadur':'巴哈杜尔',

'Bailey':'拜莱',

'Baillie':'贝里',

'Baire':'拜尔',

'Bairstow':'巴尔斯托',


'Baker':'贝克',

'Bakos':'巴科斯',

'Balaban':'巴拉班',

'Ballantine':'巴兰坦',

'Ballieu':'巴留',


'Balthasart':'巴萨萨特',


'Banach':'巴拿赫',
'Bang':'邦',
'Bankoff':'班科夫',
'Banzhaf':'班扎夫',


'Baranyai':'鲍劳尼奥伊',

'Barban':'巴班',
'Barbier':'巴比尔',

'Bargmann':'巴格曼',

'Barlow':'巴洛',

'Barnes':'巴恩斯',
'Barnette':'巴尼特',
'Barnsley':'巴恩斯利',
'Barrow':'巴罗',
'Bartlett':'巴特利特',

'Bashforth':'巴什福思',
'Bateman':'贝特曼',
'Batman':'蝙蝠侠',

'Baudet':'鲍德特',
'Bauer':'鲍尔',

'Baum':'鲍姆',
'Baxter':'巴克斯特',
'Bayes':'贝叶斯',

'Bays':'拜斯',


'Beal':'毕尔',

'Beauzamy':'毕优扎米',

'Beda':'比德',



'Beelphegor':'贝尔菲戈尔',

'Beineke':'贝因克',

'Beilinson':'贝林松',

'Belphegor':'贝尔菲戈尔',
'Behrmann':'贝尔曼',

'Bell':'贝尔',
'Bellman':'贝尔曼',
'Beltrami':'贝尔特拉米',

'Bendixson':'本迪克松',

'Benford':'本福特',

'Benham':'贝纳姆',

'Benjamin':'本杰明',

'Bennequin':'贝内坎',

'Benney':'本尼',

'Benson':'本森',


'Beraha':'贝拉哈',

'Berezin':'别列津',

'Berge':'宝捷',

'Berger':'伯格',

'Bergman':'伯格曼',
'Berkeley':'伯克莱',

'Berlekamp':'伯利坎普',
'Bernays':'贝尔奈斯',
'Bernoulli':'伯努利',

'Bernstein':'伯恩斯坦',


'Berry':'贝利',

'Bers':'贝尔斯',
'Bertrand':'伯特兰德',

'Bessaga':'贝沙加',
'Bessel':'贝塞尔',

'Betti':'贝蒂',
'Bézier':'贝塞尔',
'Bezier':'贝塞尔',

'Bézout':'贝祖',

'Bhaskara':'婆什伽罗',

'Bhattacharyya':'巴塔恰里亚',
'Bianchi':'比安基',
'Bieberbach':'比伯巴赫',
'Binet':'比内',
'Bing':'宾',
'Biot':'比奥',
'Birch':'伯奇',
'Birkhoff':'伯克霍夫',
'Bitsadze':'比察捷',
'Bjerknes':'比耶克内斯',

'Blackwell':'布莱克威尔',

'Blaschke':'布拉施克',

'Bloch':'布洛赫',

'Bluementhal':'布卢门塔尔',
'Bochner':'博赫纳',
'Boethius':'博伊西斯',
'Bogolyubov':'博戈柳博夫',
'Bogorelov':'波格列洛夫',
'Bohr':'波尔',
'Bolibruch':'鲍里布鲁克',

'Boltzmann':'玻尔兹曼',


'Bolyai':'波尔约',
'Bolza':'博尔扎',
'Bolzano':'波尔扎诺',
'Bombelli':'邦贝利',
'Bombieri':'邦别里',

'Bona':'博纳',

'Bonnet':'博内',

'Boole':'布尔',
'Borcherds':'博切尔兹',
'Borel':'博雷尔',
'Born':'博恩',

'Borwein':'博温',


'Bosák':'博萨克',

'Bosse':'博斯',

'Bost':'博斯特',

'Bott':'博特',
'Bourbaki':'布尔巴基',
'Bourgain':'布尔盖恩',
'Boussinesq':'布西内斯克',

'Box':'博克斯',
'Boyer':'博耶',

'Bradwardine':'布拉德沃丁',



'Brahmagupta':'婆罗摩及多',


'Branges':'布朗斯',

'Brauer':'布饶尔',
'Bravais':'布拉维',

'Brennan':'布伦南',

'Brianchon':'布里昂雄',
'Briggs':'布里格斯',

'Brillouin':'布里渊',


'Brocard':'布洛卡',

'Brouncker':'布隆克尔',

'Brouwer':'布劳威尔',
'Browder':'布劳德',
'Bruhat':'布吕阿',


'Bruijn':'布鲁因',

'Brumer':'布鲁默',

'Brun':'布伦',

'Bryan':'布莱恩',
'Bryson':'布里松',
'Bucy':'布西',


'Buffon':'蒲丰',


'Bunyakovski':'布尼亚科夫斯基',
'Bunyakovsky':'布尼亚科夫斯基',

'Burali':'布拉里',

'Burgi':'比尔吉',

'Burnside':'伯恩赛德',
'Busemann':'布斯曼',
'Byron':'拜伦',


'Cajory':'卡约里',
'Calabi':'卡拉比',
'Caldron':'卡尔德龙',
'Campanus':'坎帕努斯',
'Campbell':'坎贝尔',



'Cantor':'康托尔',

'Carathéodory':'卡拉赛多利',

'Cardano':'卡丹诺',
'Carleman':'卡莱曼',

'Carleson':'卡勒松',
'Carlson':'卡尔松',


'Carmichael':'卡迈克尔',

'Carnot':'卡诺',


'Carroll':'卡罗尔',

'Cartan':'嘉当',
'Cartier':'卡吉耶',

'Casas':'卡萨斯',
'Cassels':'卡塞尔斯',

'Catalan':'卡塔兰',





'Cauchy':'柯西',
'Cavalieri':'卡瓦列里',
'Cayley':'凯莱',

'Čech':'切赫',

'Cesaro':'切萨罗',
'Chan-chan Tsoo':'姜立夫',
'Chandra':'钱德拉',
'Chang Sun-Yung':'张圣蓉',
'Chaplygin':'恰普雷金',

'Chapman':'查普曼',
'Charpit':'沙比',

'Chasles':'沙勒',
'Chebyshev':'切比雪夫;车比雪夫',
'Chen Ching-Jun':'陈景润',
'Chen Kien-Kwong':'陈建功',
'Chen Shiing-Shen':'陈省身',

'Chevalley':'谢瓦莱',
'Chiang L.F.':'姜立夫',
'Chou Wei-Liang':'周炜良',

'Chowla':'周拉',

'Christoffel':'克里斯托费尔',

'Chun Kai-Lai':'钟开莱',

'Chuquet':'许凯',
'Church':'丘奇',

'Civita':'齐维塔',
'Clairaut':'克莱罗',

'Clavius':'克拉维乌斯',
'Clliford':'克利福德',

'Cohen':'科恩',
'Cohn-Vossen':'康福森',

'Collatz':'卡拉兹',
'Cole':'科尔',
'Condorcet':'孔多塞',
'Connes':'孔涅',



'Conway':'康威',

'Cooper':'库珀',



'Copernicus':'哥白尼',

'Cormack':'科马克',

'Cornu':'考纽',

'Corput':'科普',

'Cotes':'科茨',
'Courant':'库朗',
'Cousin':'库赞',
'Coxeter':'考克斯特',
'Cramer':'卡莱姆',
'Cramér':'克拉默',
'Crelle':'克雷尔',
'Cremona':'克雷莫纳',
'Curtis':'柯蒂斯',



"d'Alembert":'达朗贝尔',
'da Vinci':'达芬奇',
'Daniel':'丹尼尔',
'Dantzig':'丹齐格',
'Darboux':'达布',

'Darling':'达令',
'Darwin':'达尔文',
'Davenport':'达文波特',
'Davis':'戴维斯',



'de':'德',
'De':'德',
'De-moivre':'棣莫弗',


'Deacartes':'笛卡尔',

'Debreu':'德布鲁',
'Debye':'德拜',
'Dedekind':'戴德金',

'Dégot':'德固特',

'Dehn':'德恩',
'Deligne':'德利涅',
'Delone':'杰洛涅',

'Democritus':'德谟克利特',

'Denjoy':'当茹瓦',

'Der':'德',
'Desargues':'德萨格',
'Descartes':'笛卡尔',

'Deuflhard':'杜甫哈特',
'Deuring':'多伊林',

'Dickson':'狄克森',
'Dieudonne':'迪厄多内',

'Dini':'迪尼',

'Dinostratus':'狄诺斯特拉托斯',
'Diophantus':'丢番图',

'Dirac':'狄拉克',
'Dirichlet':'狄利克雷',


'Dittert':'迪特尔特',

'Donaldson':'唐纳森',
'Doob':'杜布',
'Douglas':'道格拉斯',
"Drinfel'd":'德林费尔德',

'du':'杜',
'Du Bois-Reymond':'杜布瓦雷蒙',

'Duhamel':'杜阿梅尔',
'Dunford':'邓福德',
'Dupin':'迪潘',

'Dyer':'戴尔',
'Dynkin':'邓肯',

'Efimov':'叶菲莫夫',
'Egorov':'叶戈罗夫',
'Ehresmann':'埃雷斯曼',
'Eilenberg':'艾伦伯格',



'Einstein':'爱因斯坦',
'Eisenhart':'艾森哈特',
'Eisenstein':'艾森斯坦',

'Elliott':'艾略特',

'Elon':'埃隆',

'Emmy':'艾米',
'Engquist':'恩奎斯特',
'Enskog':'恩斯库格',


'Eratosthenes':'埃拉托色尼',
'Erdos':'厄多斯',
'Erdős':'厄多斯',
'Escher':'艾舍尔',
'Euclid':'欧几里得',
'Eudemus':'欧德莫斯',
'Eudoxus':'欧多克索斯',
'Euler':'欧拉',

'Faber':'法布尔',
'Faddeev':'法捷耶夫',
'Fagnano':'法尼亚诺',
'Faltings':'法尔廷斯',
'Fano':'法诺',

'Farey':'法里',
'Farkas':'法卡斯',

'Farrell':'法雷尔',

'Fatou':'法图',
'Federer':'费德雷尔',
'Fefferman':'费弗曼',
'Feit':'费特',
'Feller':'费勒',
'Fermat':'费马',
'Ferrari':'费拉里',
'Ferro':'费罗',
'Fibonacci':'斐波那契',
'Fields':'菲尔兹',
"Fikhtengol'tz":'菲赫金戈尔兹',
'Filon':'菲隆',

'Fine':'范因',
'Fink':'芬克',
'Finsler':'芬斯勒',
'Fior':'费奥尔',

'Firoozbakht':'费如巴赫特',
'Fischer':'费舍尔',
'Fisher':'费希尔',
'Fitting':'菲廷',

'Fock':'福克',
'Fourier':'傅里叶',


'Ford':'福特',
'Forti':'福蒂',

'Fortune':'福特纳',

'Fraenkel':'弗伦克尔',
'Frank':'弗兰克',

'Frankl':'弗兰克尔',
'Frechet':'弗雷歇',
'Fredholm':'弗雷德霍姆',
'Freedman':'弗里德曼',
'Frege':'弗雷格',
'Fresnel':'菲涅尔',
'Freudenthal':'弗罗伊登塔尔',
'Friedrichs':'弗里德里希斯',
'Frisch':'弗里施',
'Frobenius':'弗罗贝尼乌斯',
'Frohlich':'弗勒利希',
'Fubini':'富比尼',
'Fuchs':'富克斯',
'Furstenberg':'弗斯腾伯格',

'Galileo':'伽利略',
'Galle':'加勒',

'Galois':'伽罗瓦',
'Galton':'高尔顿',

'Ganea':'加内亚',

'Gauss':'高斯',
'Gegenbauer':'盖根鲍尔',
'Gelfand':'盖尔范德',
'Gelfond':'盖尔丰德',
'Gentzen':'根岑',
'Gerard':'杰拉德',
'Gerbert':'热尔贝',
'Gergonne':'热尔岗',

'Germain':'热尔曼',
'Gevrey':'热夫雷',
'Gibbs':'吉布斯',

'Gilbert':'吉尔伯特',


'Gilbreath':'吉尔布雷斯',

'Girard':'吉拉尔',
'Givens':'吉文斯',


'Giorgi':'乔治',


'Giuga':'吉伽',

'Gleason':'格利森',
'Glimm':'格利姆',
'Gnedenko':'格涅坚科',

'Godel':'哥德尔',
'Gödel':'哥德尔',
'Godunov':'戈杜诺夫',
'Goldbach':'哥德巴赫',

'Goldberg':'戈德堡',

'Goldstein':'戈尔德施泰因',
'Golubev':'戈卢别夫',
'Gomory':'戈莫里',


'Goormaghtigh':'郭茂基',
'Gordan':'戈丹',
'Gorden':'戈登',
'Gordon':'戈登',

'Gosset':'戈塞特',
'Goursat':'古尔萨',
'Gowers':'高尔斯',
'Gram':'格拉姆',
'Grandi':'格兰迪',

'Granville':'格兰威尔',
'Grassmann':'格拉斯曼',
'Gregory':'格雷戈里',
'Griess':'格里斯',
'Griffiths':'格里菲斯',


'Grimm':'格里姆',
'Grinstead':'格林斯蒂德',

'Gromov':'格罗莫夫',
'Gronwall':'格朗沃尔',
'Grossmann':'格罗斯曼',

'Grothendieck':'格罗滕迪克',
'Gudermann':'古德曼',

'Gyárfás':'吉亚法斯',


'Haar':'哈尔',
'Hadamard':'阿达马',
'Haefliger':'黑夫利格尔',

'Halberstam':'哈尔伯斯坦',
'Hall':'霍尔',
'Halley':'哈雷',
'Halmos':'哈尔莫斯',
'Hamel':'哈梅尔',
'Hamilton':'哈密尔顿;哈密顿',
'Hammerstein':'哈默斯坦',
'Hamming':'汉明',
'Hankel':'汉克尔',
'Hardy':'哈代',
'Harish':'哈里希',

'Harnack':'哈纳克',
'Hasse':'哈塞',


'Hausdorff':'豪斯道夫',
'Hawking':'霍金',

'Hayashi Tsuruichi':'林鹤一',
'Hayman':'海曼',


'Haytham':'海塞姆',

'Heath':'希思',
'Heaviside':'赫维赛德',
'Heawood':'希伍德',
'Hecke':'赫克',
'Heegaard':'赫戈',

'Heilbronn':'海尔布伦',
'Heine':'海涅',
'Heisenberg':'海森伯',
'Hellinger':'黑林格',
'Helmert':'赫尔默特',
'Helmholtz':'亥姆赫兹',
'Hensel':'亨泽尔',
'Hermite':'埃尔米特',
'Heron':'海伦',
'Heyting':'海廷',

'Hickerson':'希克森',
'Higman':'希格曼',

'Hilbert':'希尔伯特',
'Hill':'希尔',
'Hipparchus':'希帕科斯',
'Hippias':'希比阿斯',
'Hippocrates':'希波克拉底',
'Hire':'伊尔',
'Hironaka Heisuke':'广中平佑',

'Hirzebruch':'希策布鲁赫',
'Hobbes':'霍布斯',
'Hochschild':'霍赫希尔德',
'Hodge':'霍奇',


'Holmgren':'霍姆格伦',

'Holowinsky':'霍洛温斯基',

'Hopf':'霍普夫',
'Hopkins':'霍普金斯',
'Horn':'霍恩;号角',
'Horner':'霍纳',
'Hotelling':'霍特林',
'Householder':'豪斯霍尔德',
'Hsiang':'项',
'Hsiang Wu Yi':'项武义',

'Hsu Pao Lu':'许宝騄',
'Hua Loo Keng':'华罗庚',
'Hudde':'许德',
'Hukuhara Masuo':'福原满洲雄',
'Hunt':'亨特',
'Huntington':'亨廷顿',
'Hurewitz':'胡尔维奇',
'Hurwitz':'赫尔维茨',
'Huygens':'惠更斯',



'Hypatia':'希帕蒂娅',


'Ibn':'伊本',
'Ince':'英斯',

'Infeld':'因费尔德',

'Iwasawa':'岩泽',

'Iyanaga Shokichi':'弥永昌吉',



'Jacob':'雅克布',
'Jacobi':'雅可比',
'Jacobson':'雅各布森',

'James':'詹姆斯',

'Janko':'扬科',

'Jevons':'杰文斯',

'Jiushao':'秦九韶',

'John':'约翰',
'Johnson':'约翰逊',

'Jones':'琼斯',
'Jordan':'若尔当',
'Julia':'茹利亚',


'Kac':'卡茨',

'Kadison':'卡迪生',

'Kakeya':'挂谷',
'Kakutani Shizuo':'角谷静夫',
'Kalman':'卡尔曼',
'Kamke':'卡姆克',

'Kampen':'坎彭',


'Kannan':'坎楠',
'Kant':'康德',

'Kantorovich':'康托洛维奇',

'Kaplansky':'卡普兰斯基',
'Karlin':'卡林',
'Karpinsky':'卡尔平斯基',

'Kato':'加藤',




'Katz':'卡茨',

'Kawada Yukiyoshi':'河田敬义',


'Kayal':'卡亚勒',



'Kazdan':'卡兹丹',

'Keating':'基廷',

'Keldysh':'凯尔迪什',
'Keller':'凯勒',
'Kellogg':'凯洛格',
'Kelvin':'开尔文',

'Kempe':'肯普',
'Kendall':'肯德尔',

'Kenkichi':'健吉',

'Kepler':'开普勒',

'Khatri':'卡德里',

'Khayyam':'哈亚姆;海亚姆',

'Khinchin':'辛钦',
'Kiang Tsai Han':'江泽涵',

'Kiefer':'基弗',
'King Lai Hiong':'熊庆来',

'Kirchhoff':'基尔霍夫',
'Kleene':'克林',

'Klein':'克莱因',
'Kleinberg':'克莱因伯格',
'Kline':'克莱因',

'Kloosterman':'克鲁斯特曼',

'Knopp':'克诺普',

'Knuth':'克努特',
'Koch':'柯赫',

'Kodaira Kunihiko':'小平邦彦',

'Koebe':'克贝',
'Kolmogorov':'科尔莫戈洛夫',

'Kontsevich':'孔采维奇',
'Koopmans':'库普曼斯',
'Korteweg':'科尔泰沃赫',

'Kostant':'科斯坦特',
'Koszul':'科斯居尔',

'Köthe':'科特',
'Kotlin':'科特林',


'Kotzig':'科兹格',

'Kovalevskaya':'柯瓦列夫斯卡娅',

'Kravchuk':'克拉夫丘克',

'Krein':'克赖因',
'Kronecker':'克罗内克',
'Krull':'克鲁尔',
'Kruskal':'克鲁斯卡尔',
'Kubota Tadahiko':'洼田忠彦',
'Kummer':'库默尔',

'Kung':'康',

'Kuratowski':'库拉托夫斯基',
'Kurosh':'库洛什',
'Kutta':'库塔',


'La':'拉',

'Lacroix':'拉克鲁瓦',
'Ladyzhenskaya':'拉德任斯卡娅',
'Lafforgue':'拉福格',
'Lagrange':'拉格朗日',
'Laguerre':'拉盖尔',
'Lalande':'拉朗德',

'Lambert':'兰伯特',
'Lanchester':'兰彻斯特',

'Lanczos':'兰乔斯',
'Landau':'兰道',
'Landen':'兰登',

'Lane':'莱恩',

'Lang':'朗;语言',

'Langevin':'朗之万',
'Langlands':'朗兰兹',
'Laplace':'拉普拉斯',
'Laurent':'洛朗',
"Lavrent'ev":'拉夫连季耶夫',


'Lawson':'罗森',
'Lax':'拉克斯',


'Lederberg':'莱德伯格',
'Legendre':'勒让德',
'Leibniz':'莱布尼兹',
'Leonardo':'列奥纳多',

"L'Hospital":'洛必达',
'Lie':'李',
'Lobachevsky':'罗巴切夫斯基',



'Le':'勒',
'Lebesgue':'勒贝格',

'Leffler':'列夫勒',
'Lefschetz':'莱夫谢茨',

'Legendre':'勒让德',
'Lehmer':'莱默',

'Leibler':'莱布勒',

'Leibniz':'莱布尼兹',


'Lemoine':'勒穆瓦纳',

'Lenstra':'兰斯特拉',

'Leontief':'列昂惕夫',

'Leopoldt':'利奥波特',

'Leray':'勒雷',
'Levi':'莱维',

'Levinson':'莱文森',
'Levitan':'列维坦',
'Levy':'莱维',

'Lewy':'卢伊',
'Lie':'李',
'Lieb':'利布',
"Lin Chia Chiao":'林加翘',

'Lindeloef':'林德勒夫',
'Lindelöf':'林德勒夫',

'Lindemann':'林德曼',
'Lindenstrauss':'林登施特劳斯',

'Linnik':'林尼克',
'Lions':'利翁斯',
'Liouville':'刘维尔',
'Lipschitz':'利普希茨',
'Listing':'利斯廷',
'Littlewood':'李特尔伍德',
'Lobachevsky':'罗巴切夫斯基',
'Lojasiewicz':'洛雅西维奇',
'Loomis':'卢米斯',
'Lorentz':'洛伦兹',


'Lorenz':'洛伦兹',

'Lovász':'洛瓦兹',

'Lovelace':'拉芙蕾丝',
'Luzin':'卢津',
'Lyapunov':'李雅普诺夫',


'Mac':'麦克',
'Maclaurin':'麦克劳林',

'Madhava':'玛德瓦',

'Magenes':'马格内斯',

'Mahler':'马勒',

'Mahony':'马赫尼',

'Malfatti':'马尔法蒂',
'Malliavin':'马利亚万',

'Mandelbrot':'芒德布罗;芒德勃罗',

'Manin':'马宁',

'Margulis':'马尔古利斯',
'Markov':'马尔科夫',

'Markushevich':'马尔库舍维奇',


'Marshall':'马歇尔',

'Massey':'马西',

'Matiyasevich':'马蒂雅舍维奇',
'Matsunaga Yoshisuke':'松永良别',

'Maupertuis':'莫佩蒂',

'Maxwell':'麦克斯韦',

'Maynard':'梅纳德',

'Mazur':'马祖尔',

'McMullen':'麦克马伦',
'Menaechmus':'梅内克缪斯',

'Menelaus':'门纳劳斯',
'Mercator':'梅卡托',



'Mersenne':'梅森',

'Mikami Yoshio':'三上义夫',

'Mills':'米尔斯',
'Milnor':'米尔诺',
'Minfu Tan Hu':'胡明复',

'Minkowski':'闵可夫斯基',


'Mises':'米泽斯',
'Mittag':'米塔',

'Mirzakhani':'米尔扎哈尼',


'Möbius':'莫比乌斯',
'Monge':'蒙日',
'Montel':'蒙泰尔',

'Montgomery':'蒙哥马利',
'Montucla':'蒙蒂克拉',
'Morawetz':'莫拉维兹',
'Mordell':'莫德尔',
'Morgenstern':'莫根施特恩',
'Mori Shigefumi':'森重文',

'Morgan':'摩根',
'Morley':'莫利',
'Morse':'莫尔斯',
'Moser':'莫泽',
'Mosteller':'莫斯特勒',
'Mostow':'莫斯托',
'Mostowski':'莫斯托夫斯基',

'Moulton':'莫尔顿',


'Muir':'缪尔',
'Mumford':'芒福德',
'Murray':'默里',


'Nagata Masayosi':'永田雅宜',

'Naimark':'奈马克',

'Nakayama Tadasi':'中山正',


'Napier':'纳皮尔',
'Napoleon':'拿破仑',
'Nash':'纳什',

'Navier':'纳维',
'Neugebauer':'诺伊格鲍尔',


'Neumann':'诺依曼',

'Nevanlinna':'奈望林纳',
'Newman':'纽曼',


'Newton':'牛顿',
'Neyman':'奈曼',

'Nichomachus':'尼科马库斯',
'Nichomedes':'尼科米德',


'Nicolaus':'尼古拉',
'Nicomachus':'尼科马库斯',

'Nieuwentijt':'纽文泰特',



'Nightingale':'南丁格尔',

'Nirenberg':'尼伦伯格',


'Noether':'诺特',
'Novikov':'诺维科夫',


'Obuhov':'奥布霍夫',



'Ohm':'欧姆',
'Okounkov':'奥昆科夫',

'Oppermann':'奥普曼',

'Ore':'奥尔',

'Oresme':'奥里斯姆;奥雷姆',

'Orlicz':'奥尔利奇',
'Ornstein':'奥恩斯坦',
'Ostrogradsky':'奥斯特罗格拉茨基',
'Otto':'奥托',
'Oughtred':'奥特雷德',




'Pacioli':'帕西奥里;帕乔利',

'Papakyriakopoulos':'帕帕基里亚科普洛斯',
'Parent':'帕朗',
'Parmenides':'巴门尼德斯',
'Parseval':'帕塞瓦尔',

'Pascal':'帕斯卡',
'Pasch':'帕施',
'Peacock':'皮科克',

'Peano':'皮亚诺',

'Pearson':'皮尔逊',
'Peirce':'皮尔斯',
'Pell':'佩尔',



'Penrose':'彭罗斯',

'Percival':'珀西瓦尔',
'Perelman':'佩雷尔曼',

'Perron':'佩龙',

'Petersen':'彼得森',
'Peterson':'彼得松',
'Petrov':'彼得罗夫',
'Petrovsky':'彼得罗夫斯基',
'Peurbach':'波伊尔巴赫',

'Pfaff':'普法夫',
'Pfister':'菲斯特',

'Philolaus':'费洛劳斯',

'Piatetski':'皮亚捷茨基',

'Picard':'皮卡',

'Pierce':'皮尔斯',


'Pillai':'皮莱',
'Pingala':'平格拉',

'Pinsker':'平斯克',
'Planck':'普朗克',
'Plateau':'普拉托',


'Plato':'柏拉图',

'Playfair':'普莱菲尔',
'Plemelj':'普勒梅利',

'Plouffe':'普卢夫',
'Plutarch':'普鲁塔克',

'Poincare':'庞加莱',
'Poisson':'泊松',

'Pol':'波尔',

'Polignac':'波利尼亚克',

'Polya':'波利亚',
'Pólya':'波利亚',

'Pomerance':'波默朗斯',

'Poncelet':'蓬斯莱',
'Pontryagin':'庞特里亚金',
'Post':'波斯特',
'Powell':'鲍威尔',
'Prandtl':'普朗特',
'Privalov':'普里瓦洛夫',
'Proclus':'普罗克鲁斯',


'Ptolemy':'托勒密',

'Puppus':'帕波斯',
'Putnam':'普特南',
'Pythagoras':'毕达哥拉斯',


'Radau':'拉道',

'Rademacher':'拉德马赫',
'Radon':'拉东',

'Ramanujan':'拉马努金',
'Ramsey':'拉姆齐',
'Rankin':'兰金',
'Rao':'拉奥',
'Raphson':'拉弗森',
'Ratner':'拉特纳',
'Rayleigh':'瑞利',

'Razbborov':'拉兹波洛夫',
'Regiomontanus':'雷巧蒙塔努斯;雷格蒙塔努斯',
'Reidemeister':'赖德迈斯特',





'Remes':'列梅兹',
'Reynolds':'雷诺',


'Rham':'拉姆',

'Rheticus':'雷蒂库斯',

'Ricatti':'里卡蒂',
'Ricci':'里奇',
'Richardson':'理查森',



'Riemann':'黎曼',

'Riesz':'里斯',

'Ringel':'林格尔',
'Ritt':'里特',
'Ritz':'里茨',

'Robert':'罗伯特',

'Roberval':'罗伯瓦尔',

'Robin':'罗宾',

'Robinson':'鲁滨逊',
'Roch':'罗赫',

'Rodrigues':'罗德里格斯',
'Rogers':'罗杰斯',

'Rohrl':'勒尔',
'Rokhlin':'罗赫林',
'Rolle':'罗尔',


'Roman':'罗曼',
'Rosen':'罗森',

'Rosenberg':'罗森伯格',
'Roth':'罗特',

"Rozenfel'd":'罗森菲尔德',


'Rudin':'鲁丁',

'Ruffini':'鲁菲尼',

'Rumely':'鲁梅利',

'Runge':'龙格',
'Russell':'罗素',




'Saccheri':'萨凯里',

'Saks':'萨克斯',

'Samuelson':'萨缪尔森',


'Sarnak':'萨纳克',

'Sasaki Shigeo':'佐佐木重夫',

'Sato':'佐藤',
'Sato Mikio':'佐藤干夫',


'Saxena':'萨克塞纳',


'Schanuel':'尚努埃尔',

'Schauder':'绍德尔',

'Schimidt':'施密特',


'Schinzel':'辛泽尔',

'Schmid':'施密德',

'Schneider':'施耐德',

'Schoenfeld':'舍恩菲尔德',

'Scholz':'肖尔茨',
'Schooten':'斯霍滕',
'Schubert':'舒伯特',


'Schur':'舒尔',

'Schwartz':'施瓦兹',
'Schwarz':'施瓦兹',
'Segre':'塞格雷',
'Seidel':'赛德尔',
'Seifert':'塞弗特',
'Seki Takakazu':'关孝和',

'Selberg':'塞尔贝格',

'Selfridge':'塞尔福里奇',

'Sendov':'森多夫',

'Serre':'塞尔',

'Seymour':'西摩',

'Shafarevich':'沙法列维奇',



'Shannon':'香农',



'Shane':'沙恩',
'Shapiro':'沙皮罗',

'Shelah':'希拉;谢拉赫',


'Shijie':'朱世杰',

'Shimura Goro':'志村五郎',
"Shnirel'man":'施尼雷尔曼',

'Shoda Kenjiro':'正田建次郎',

'Shor':'肖尔',



'Siegel':'西格尔',

'Sierpiński':'谢尔宾斯基',

'Simon':'西蒙',

'Simpson':'辛普森',

'Singer':'辛格',


'Singmaster':'辛马斯特',

'Siu Yum Tong':'萧荫堂',

'Skolem':'斯科伦',


'Sluse':'斯吕塞',

'Smale':'斯梅尔',

'Smirnov':'斯米尔诺夫',

'Smith':'史密斯',
'Smogolenski':'穆尼阁',

'Snaith':'斯奈斯',

'Snell':'斯涅尔',

'Sobolev':'索伯列夫',

'Soundararajan':'桑德拉拉金',

'Spanier':'斯帕尼尔',
'Spencer':'斯潘塞',

'Sperner':'施佩纳',

'Sridhara':'斯里达拉',


'Stark':'史塔克',
'Staudt':'施陶特',
'Steenrod':'斯廷罗德',

'Stein':'斯坦',
'Steinberg':'斯坦贝格',
'Steiner':'施泰纳',

'Steinhaus':'斯坦因豪斯;施坦豪斯',
'Steinitz':'施泰尼兹',

'Steklov':'斯杰克洛夫',

'Stepanov':'斯杰潘诺夫',


'Stevin':'斯蒂文',

'Stickelberger':'施蒂克贝格',


'Stieltjes':'斯蒂尔切斯',

'Stiefel':'斯蒂弗尔',
'Stifel':'施蒂费尔',


'Stirling':'斯特林',

'Stokes':'斯托克斯',

'Stone':'斯通',

'Straus':'施特劳斯',

'Struik':'斯特罗伊克',
'Strutt':'斯特拉特',
'Sturm':'斯图姆',

'Su Bu Chin':'苏步青',

'Sudan':'苏丹',
'Suetuna Zyoiti':'末纲恕一',

'Sullivan':'沙利文',
'Suslin':'苏斯林',

'Swinnerton':'斯温纳顿',

'Sylow':'西罗',

'Sylvester':'西尔维斯特',


'Tabor':'泰伯',

'Takagi Teiji':'高木贞治',

'Takebe Katahiro':'建部贤弘',

'Tamarkin':'塔马金',

'Taniyama Yutaka':'谷山丰',

'Tannery':'塔内里',


'Tarsi':'塔司',

'Tarski':'塔斯基',
'Tartaglia':'塔尔塔利亚',

'Taryan':'塔尔杨',

'Tate':'泰特',

'Tauber':'陶伯',

'Taylor':'泰勒',
'Teichmueller':'泰希米勒',


'Thales':'泰勒斯',

'Theaetetus':'泰特托斯',

'Theodorus':'西奥多罗斯',
'Theodosius':'西奥多修斯',

'Theon':'塞翁',

'Toeplitz':'托普里兹',

'Thom':'托姆',

'Thompson':'汤普森',
'Thomson':'汤姆森',

'Thue':'图厄',
'Thurston':'瑟斯顿',
'Tikhonov':'吉洪诺夫',

'Tinbergen':'丁伯根',
'Tissot':'蒂索',

'Titchmarsh':'蒂奇马什',
'Tits':'蒂茨',

'Toeplitz':'特普利茨',
'Tonelli':'托内利',

'Torricelli':'托里拆利',


'Tosio':'敏夫',

'Traub':'特劳伯',

'Treves':'特利夫斯',

'Tricomi':'特里科米',
'Truesdell':'特鲁斯德尔',

'Tschirnhaus':'奇恩豪斯',

'Tsen Chiung Tze':'曾炯之',
'Tsen Tze Fan':'郑之藩',
'Tuan Hsio Fu':'段学复',
'Tucker':'塔克',
'Tukey':'图基',
'Turing':'图灵',


'Uhlenbeck':'乌伦贝克',
'Ulam':'乌拉姆',
'Urbanik':'乌尔班尼克',
'Uryson':'乌雷松',


'Valiant':'瓦林特',
'Valiron':'瓦利龙',

'Vandermonde':'范德蒙',

'Vandiver':'范迪福',

'Varadhan':'瓦拉德汉',

'Veblen':'维布伦',
'Venn':'维恩',

'Verrier':'维耶',
'Vieta':'韦达',
'Viète':'韦达',

'Vietoris':'菲托里斯',
'Ville':'维尔',

'Vinogradov':'维诺格拉多夫',
'Viterbi':'维特比',
'Viviani':'维维亚尼',

'Vizing':'维津',

'Voevodsky':'沃耶沃茨基',

'Vojta':'沃伊塔',

'Volterra':'沃尔泰拉',

'Von':'冯',

'Voronoi':'沃罗诺伊',

'Vries':'弗里斯',


'Waerden':'瓦尔登',

'Wagner':'瓦格纳',

'Wagstaff':'瓦格斯塔夫',

'Wald':'瓦尔德',
'Wall':'沃尔',
'Wallace':'华莱士',


'Wallis':'瓦利斯;沃利斯',

'Walras':'瓦尔拉',

'Walsh':'沃尔什',

'Wang Hao':'王浩',

'Wang Hsien Chung':'王宪钟',
'Wang Shianghaw':'王湘浩',
'Wantzel':'旺策尔',

'Waring':'华林',

'Watson':'沃森',

'Weber':'韦伯',
'Wedderburn':'韦德伯恩',

'Weierstrass':'魏尔斯特拉斯',
'Weil':'韦伊',


'Weinstein':'维因斯坦',

'Wells':'韦尔斯',

'Werner':'维尔纳',

'Wessel':'韦塞尔',

'Weyl':'外尔',

'Whewell':'休厄尔',
'Whitehead':'怀特黑德',
'Whitney':'惠特尼',

'Whittaker':'惠特克',
'Whyburn':'怀伯恩',



'Wiener':'维纳',
'Widgerson':'威格森',

'Wilder':'怀尔德',


'Wiles':'怀尔斯',

'Wilkes':'威尔克斯',

'Willmore':'威尔莫',
'Wiman':'威曼',
'Wintner':'温特纳',
'Wishart':'威沙特',
'Witt':'维特',

'Witten':'威顿;威滕',

'Wittgenstein':'维特根斯坦',
'Wolf':'沃尔夫',

'Woods':'伍兹',


'Wren':'雷恩',
'Wrongski':'朗斯基',

'Wu Hung Hsi':'伍鸿熙',
'Wylie':'伟烈亚力',

'Yanghui':'杨辉',
'Yang Chen Ning':'杨振宁',
'Yang Ko Chuen':'杨武之',

'Yates':'耶茨',
'Yau Shing Tung':'丘成桐',
'Yoccoz':'约柯兹',
'Yosida Kosaku':'吉田耕作',
'Youden':'尤登',
'Young':'杨',


'Yuk Wing Lee':'李郁荣',

'Yukawa Hideki':'汤川秀树',

'Yushkevich':'尤什凯维奇',


'Zabusky':'扎布斯基',
'Zadeh':'扎德',
'Zariski':'扎里斯基',

'Zauner':'佐纳',

'Zeeman':'塞曼',
'Zelmanov':'泽尔曼诺夫',
'Zeno':'芝诺',
'Zermelo':'策梅洛',
'Zeuthen':'措伊滕',
'Zhukovsky':'茹科夫斯基',
'Zipping':'齐平',

'Zorn':'佐恩',



	//Math subject
	'Level-1': '一级',
	'Level-2': '二级',
	'Math': '数学',
	'Mathematics': '数学',
	"Mathematical": '数学',

	"Discipline": "学科",
	"Subject": "学科",
	'Subject Classification GB': '中国国家标准数学学科分类',
/*
	"11": "数学史",
	"14": "数理逻辑与数学基础",
	"1410": "演绎逻辑学",
	"1420": "证明论",
	"1430": "递归论",
	"1440": "模型论",
	"1450": "公理集合论",
	"1460": "数学基础",
	"1499": "其它学科",
	"17": "数论",
	"1710": "初等数论",
	"1720": "解析数论",
	"1730": "代数数论",
	"1740": "超越数论",
	"1750": "丢番图逼近",
	"1760": "数的几何",
	"1770": "概率数论",
	"1780": "计算数论",
	"1799": "其它学科",
	"21": "代数学",
	"2110": "线性代数",
	"2115": "群论",
	"2120": "域论",
	"2125": "李群",
	"2130": "李代数",
	"2135": "Kac-Moody代数",
	"2140": "环论",
	"2145": "模论",
	"2150": "格论",
	"2155": "泛代数理论",
	"2160": "范畴论",
	"2165": "同调代数",
	"2170": "代数K理论",
	"2175": "微分代数",
	"2180": "代数编码理论",
	"2199": "其它学科",
	"24": "代数几何学",
	"27": "几何学",
	"2710": "几何学基础",
	"2715": "欧氏几何学",
	"2720": "非欧几何学",
	"2725": "球面几何学",
	"2730": "向量和张量分析",
	"2735": "仿射几何学",
	"2740": "射影几何学",
	"2745": "微分几何学",
	"2750": "分数维几何",
	"2755": "计算几何学",
	"2799": "其它学科",
	"31": "拓扑学",
	"3110": "点集拓扑学",
	"3115": "代数拓扑学",
	"3120": "同伦论",
	"3125": "低维拓扑学",
	"3130": "同调论",
	"3135": "维数论",
	"3140": "格上拓扑学",
	"3145": "纤维丛论",
	"3150": "几何拓扑学",
	"3155": "奇点理论",
	"3160": "微分拓扑学",
	"3199": "其它学科",
	"34": "数学分析",
	"3410": "微分学",
	"3420": "积分学",
	"3430": "级数论",
	"3499": "其它学科",
	"37": "非标准分析",
	"41": "函数论",
	"4110": "实变函数论",
	"4120": "单复变函数论",
	"4130": "多复变函数论",
	"4140": "函数逼近论",
	"4150": "调和分析",
	"4160": "复流形",
	"4170": "特殊函数论",
	"4199": "其它学科",
	"44": "常微分方程",
	"4410": "定性理论",
	"4420": "稳定性理论",
	"4430": "解析理论",
	"4499": "其它学科",
	"47": "偏微分方程",
	"4710": "椭圆型偏微分方程",
	"4720": "双曲型偏微分方程",
	"4730": "抛物型偏微分方程",
	"4740": "非线性偏微分方程",
	"4799": "其它学科",
	"51": "动力系统",
	"5110": "微分动力系统",
	"5120": "拓扑动力系统",
	"5130": "复动力系统",
	"5199": "其它学科",
	"54": "积分方程",
	"57": "泛函分析",
	"5710": "线性算子理论",
	"5715": "变分法",
	"5720": "拓扑线性空间",
	"5725": "希尔伯特空间",
	"5730": "函数空间",
	"5735": "巴拿赫空间",
	"5740": "算子代数",
	"5745": "测度与积分",
	"5750": "广义函数论",
	"5755": "非线性泛函分析",
	"5799": "其它学科",
	"61": "计算数学",
	"6110": "插值法与逼近论",
	"6120": "常微分方程数值解",
	"6130": "偏微分方程数值解",
	"6140": "积分方程数值解",
	"6150": "数值代数",
	"6160": "连续问题离散化方法",
	"6170": "随机数值实验",
	"6180": "误差分析",
	"6199": "其它学科",
	"64": "概率论",
	"6410": "几何概率",
	"6420": "概率分布",
	"6430": "极限理论",
	"6440": "随机过程",
	"6450": "马尔可夫过程",
	"6460": "随机分析",
	"6470": "鞅论",
	"6480": "应用概率论",
	"6499": "其它学科",
	"67": "数理统计学",
	"6710": "抽样理论",
	"6715": "假设检验",
	"6720": "非参数统计",
	"6725": "方差分析",
	"6730": "相关回归分析",
	"6735": "统计推断",
	"6740": "贝叶斯统计",
	"6745": "试验设计",
	"6750": "多元分析",
	"6755": "统计判决理论",
	"6760": "时间序列分析",
	"6799": "其它学科",
	"71": "应用统计数学",
	"7110": "统计质量控制",
	"7120": "可靠性数学",
	"7130": "保险数学",
	"7140": "统计模拟",
	"7199": "其它学科",
	"74": "运筹学",
	"7410": "线性规划",
	"7415": "非线性规划",
	"7420": "动态规划",
	"7425": "组合最优化",
	"7430": "参数规划",
	"7435": "整数规划",
	"7440": "随机规划",
	"7445": "排队论",
	"7450": "对策论",
	"7455": "库存论",
	"7460": "决策论",
	"7465": "搜索论",
	"7470": "图论",
	"7475": "统筹论",
	"7480": "最优化",
	"7499": "其它学科",
	"77": "组合数学",
	"81": "离散数学",
	"84": "模糊数学",
	"87": "应用数学",
	"99": "其它学科",
	"9910":'数学物理方法',
	"9920":'大数据',
	"9930":'编程算法',
	"9940":'人工智能',
*/
"History of Mathematics": "数学史",
"Math Logic and Math Basis": "数理逻辑与数学基础",
"Number Theory": "数论",
//"Algebra": "代数学",
"Algebraic Geometry": "代数几何",
//"Geometry": "几何学",
"Topology": "拓扑",
"Mathematical Analysis": "数学分析",
"Non-standard Analysis": "非标准分析",
"Functionalism": "函数论",
"Ordinary Differential Equation": "常微分方程",
"Partial Differential Equation": "偏微分方程",
"Dynamic System": "动力系统",
"Integral Equation": "积分方程",
"Functional Analysis": "泛函分析",
"Computational Mathematics": "计算数学",
"Probability Theory": "概率论",
"Mathematical Statistics": "数理统计学",
"Applied Statistical Mathematics": "应用统计数学",
"Operational Research": "运筹学",
"Combinatorial Mathematics": "组合数学",
"Discrete Mathematics": "离散数学",
"Fuzzy Mathematics": "模糊数学",
"Applied Mathematics": "应用数学",
"Other Disciplines": "其它学科",
"Deductive Logic": "演绎逻辑学",
"Theory of Proof": "证明论",
"Recursion Theory": "递归论",
"Model Theory": "模论",
"Axiomatic Set Theory": "公理集合论",
"Mathematical Foundation": "数学基础",
"Elementary Number Theory": "初等数论",
"Analytical Number Theory": "解析数论",
"Algebraic Number Theory": "代数数论",
"Transcendental Number Theory": "超越数论",
"Diophantine Approaching": "丢番图逼近",
"Geometry of Numbers": "数的几何",
"Probability Number Theory": "概率数论",
"Theory of Computational Number": "计算数论",
"Linear Algebra": "线性代数",
"Group Theory": "群论",
"Domain Theory": "域论",
"Lie Group": "李群",
"Lie Algebra": "李代数",
"Kac-Moody Algebra": "Kac-Moody代数",
"Ring Theory": "环论",
"Lattice Theory": "格论",
"Pan-Algebraic Theory": "泛代数理论",
"Category Theory": "范畴论",
"Homological Algebra": "同调代数",
"Algebraic K Theory": "代数K理论",
"Differential Algebra": "微分代数",
"Algebraic Coding Theory": "代数编码理论",
"Geometric Basis": "几何学基础",
"Euclidean Geometry": "欧氏几何学",
"Non-Euclidean Geometry": "非欧几何学",
"Spherical Geometry": "球面几何学",
"Vector and Tensor Analysis": "向量和张量分析",
"Affine Geometry": "仿射几何学",
"Projective Geometry": "射影几何学",
"Differential Geometry": "微分几何学",
"Fractal Geometry": "分数维几何",
"Computational Geometry": "计算几何学",
"Topology of Point Sets": "点集拓扑学",
"Algebraic Topology": "代数拓扑学",
"Homotopy": "同伦论",
"Low Dimensional Topology": "低维拓扑学",
"Coherence Theory": "同调论",
"Dimensionalism": "维数论",
"Lattice Topology": "格上拓扑学",
"Fibre Cluster Theory": "纤维丛论",
"Geometric Topology": "几何拓扑学",
"Singularity Theory": "奇点理论",
"Differential Topology": "微分拓扑学",
"Differentiation": "微分学",
"Integral Calculus": "积分学",
"Series Theory": "级数论",
"Real Variable Function Theory": "实变函数论",
"Theory of Single and Complex Variable Function": "单复变函数论",
"Theory of Multiple Complex Variables": "多复变函数论",
"Functional Approximation Theory": "函数逼近论",
"Harmonic Analysis": "调和分析",
"Complex Manifold": "复流形",
"Special Function Theory": "特殊函数论",
"Qualitative Theory": "定性理论",
"Stability Theory": "稳定性理论",
"Analytical Theory": "解析理论",
"Elliptic Partial Differential Equation": "椭圆型偏微分方程",
"Hyperbolic Partial Differential Equation": "双曲型偏微分方程",
"Parabolic Partial Differential Equation": "抛物型偏微分方程",
"NonLinear Partial Differential Equation": "非线性偏微分方程",
"Differential Dynamic System": "微分动力系统",
"Topological Dynamic System": "拓扑动力系统",
"Complex Dynamic System": "复动力系统",
"Linear Operator Theory": "线性算子理论",
"Variational Method": "变分法",
"Topological Linear Space": "拓扑线性空间",
"Hilbert Space": "希尔伯特空间",
"Functional Space": "函数空间",
"Banach Space": "巴拿赫空间",
"Operator Algebra": "算子代数",
"Measure and Integral": "测度与积分",
"Generalized Function Theory": "广义函数论",
"NonLinear Functional Analysis": "非线性泛函分析",
"Interpolation and Approximation Theory": "插值法与逼近论",
"Numerical solution of Ordinary Differential Equation": "常微分方程数值解",
"Numerical Solution of Partial Differential Equation": "偏微分方程数值解",
"Numerical solution of Integral Equation": "积分方程数值解",
"Numerical Algebra": "数值代数",
"Discrete Method for Continuous Problem": "连续问题离散化方法",
"Random Numerical Experiment": "随机数值实验",
"Error Analysis": "误差分析",
"Geometric Probability": "几何概率",
"Probability Distribution": "概率分布",
"Limit Theory": "极限理论",
"Stochastic Process": "随机过程",
"Markov process": "马尔可夫过程",
"Stochastic Analysis": "随机分析",
"Martingale Theory": "鞅论",
"Applied Probability Theory": "应用概率论",
"Sampling Theory": "抽样理论",
"Hypothesis Test": "假设检验",
"Nonparametric Statistics": "非参数统计",
"Analysis of Variance": "方差分析",
"Relevant regression Analysis": "相关回归分析",
"Statistical Inference": "统计推断",
"Bayesian Statistics": "贝叶斯统计",
"Test Design": "试验设计",
"Multivariate Analysis": "多元分析",
"Statistical Judgment Theory": "统计判决理论",
"Time Series Analysis": "时间序列分析",
"Statistical Quality Control": "统计质量控制",
"Reliability Mathematics": "可靠性数学",
"Insurance Mathematics": "保险数学",
"Statistical Simulation": "统计模拟",
"Linear Programming": "线性规划",
"NonLinear Programming": "非线性规划",
"Dynamic Planning": "动态规划",
"Combination Optimization": "组合最优化",
"Parametric Planning": "参数规划",
"Integer Planning": "整数规划",
"Random Programming": "随机规划",
"Queuing Theory": "排队论",
"Game Theory": "对策论",
"Inventory Theory": "库存论",
"Decision-making Theory": "决策论",
"Search Theory": "搜索论",
"Graph Theory": "图论",
"Overall Planning": "统筹论",
"Optimizing": "最优化",
"Mathematical Methods in Physics": "数学物理方法",
"Big Data": "大数据",
"Programming Algorithm": "编程算法",
'Finite Element':'有限元',
'Finite Element Analysis':'有限元分析',
'Combinatorics':'组合学',
//"AI": "人工智能",
	'Summarytip': '小乐数学zzllrr Mather，是小乐原创开源实现的一款跨平台可离线运行并满足多用户背景、多场景需要的数学软件。' +
		'目前这是一个Demo版本（雏形演示），功能上只实现了数学公式显示，初等代数、线性代数、离散数学等学科的部分解题，' +
		'因个人能力和精力有限，缺陷和错误难以避免' +
		'在正式版本发布之前，内核、界面、功能可能还需经历数次重构和迭代，因此仅供参考。',
	'Visiontip': '推动更多的数学、科学、教育、技术、工程、人文、互联网、物联网工作者，加入全球开源工具项目：Mather（译为数学客），更专业化地普及、研究、发展数学。',
	'Aimstip': '让数学更易学易练，易教易研，易赏易玩，易见易得，易传易及。',

};

/*
 * zzllrr Mather
 * zzllrr@gmail
 * Released under MIT License
 * 
 * 
 * 依赖：
 * 需先加载 KaTeX
*/


var SBSi=[zlr('Num',' 1 2 3'),
	zlr('ABC',' 1 2 3'),
	zlr('DEF',' 1 2 3'),
	zlr('Operator',' 1 2'),
	zlr('Relation',' 1 2'),
	zlr('Arrow',' 1 2 3 4 5'),
	zlr('Misc',' 1 2 3 4')
].join(' '),
SBS={

	Num:[['⁰¹²³⁴⁵⁶⁷⁸⁹','₀₁₂₃₄₅₆₇₈₉'],
		['⁺⁻⁼⁽⁾%‰‱','₊₋₌₍₎'],
		['①②③④⑤❶❷❸❹❺','⑥⑦⑧⑨⑩❻❼❽❾❿'],
		['➀➁➂➃➄','➅➆➇➈➉'],

	],

	Num1:[
		
		['⒈⒉⒊⒋⒌⒒⒓⒔⒕⒖','⒍⒎⒏⒐⒑⒗⒘⒙⒚⒛'],
		['⑴⑵⑶⑷⑸⑾⑿⒀⒁⒂','⑹⑺⑻⑼⑽⒃⒄⒅⒆⒇'],
		['⓵⓶⓷⓸⓹⑪⑫⑬⑭⑮㉑㉒㉓㉔㉕','⓺⓻⓼⓽⓾⑯⑰⑱⑲⑳'],
		['㉖㉗㉘㉙㉚㊱㊲㊳㊴㊵㊻㊼㊽㊾㊿','㉛㉜㉝㉞㉟㊶㊷㊸㊹㊺'],
		['➊➋➌➍➎⓫⓬⓭⓮⓯','➏➐➑➒➓⓰⓱⓲⓳⓴'],
	],

	Num2:[

		['⅟½⅓⅔ ⅗⅘⅙⅚','¼¾⅕⅖ ⅛⅜⅝⅞'],
		['㋀㋁㋂㋃㋄㋊㋋','㋅㋆㋇㋈㋉'],
		['㏠㏡㏢㏣㏤㏪㏫㏬㏭㏮㏴㏵㏶㏷㏸㏾','㏥㏦㏧㏨㏩㏯㏰㏱㏲㏳㏹㏺㏻㏼㏽'],
		['㍙㍚㍛㍜㍝㍣㍤㍥㍦㍧㍭㍮㍯㍰㍘','㍞㍟㍠㍡㍢㍨㍩㍪㍫㍬'],
	],

	Num3:[
		['一二三四五六七八九十百千万亿兆〇','壹贰叁肆伍陆柒捌玖拾佰仟萬亿兆零'],
		['㊀㊁㊂㊃㊄㈠㈡㈢㈣㈤','㊅㊆㊇㊈㊉㈥㈦㈧㈨㈩'],
		['甲乙丙丁戊子丑寅卯 申酉戌亥','己庚辛壬癸辰巳午未'],
		['㆙㆚㆛㆜ ㆖㆗㆘','㆒㆓㆔㆕ ㆝㆞㆟']
	],


	ABC:[
		['αβγδελμνξουφχψω','ζηθικπρςστ'],
		['ΑΒΓΔΕΛΜΝΞΟΥΦΧΨΩ','ΖΗΘΙΚΠΡ΢ΣΤ'],

	//	Arrf(fCC,[seqA(913,25), seqA(945,25)])
	//	Arrf(fCC,[seqA(65,26),seqA(97,26)]),
	//	Arrf(fCC,[seqA(8560,16),seqA(8544,16)]),

		['ℵℶℷℸ℘°℃℉ð₴','∞∝∅⍉⌀∂∇¬∀∃'],
		['ƒℎæœＣ₵açþÞ','ℲℏÆŒϹ∁āÇÐß'],

	],


	ABC1:[

		['ⅰⅱⅲⅳⅴⅺⅻ','ⅵⅶⅷⅸⅹⅼⅽⅾⅿ'],
		['ⅠⅡⅢⅣⅤⅪⅫ','ⅥⅦⅧⅨⅩⅬⅭⅮⅯ'],
		['ℂℍℙℚ ℭℌℑℜ','ℕℝℤℨ'],
		['ℬℰℱℋ ℯℊℴℓ','ℐℒℳℛ'],
		['⍶⍺ϐϒϕ⍳⍸⍴ϱ','ϵ⍷ℇϑϴ⍵⍹ϖ∂∇'],

	
		//	['+-	=.%|\\$<>,;^_~\'"&*/:?@#!删空',' '],		ℏ
	
			//['aāáǎàċ','äůâãă'],
				
	],



	ABC2:[
		['ａｂｃｄｅｋｌｍｎｏｕｖｗｘｙ','ｆｇｈｉｊｐｑｒｓｔｚ'],
		['ＡＢＣＤＥＫＬＭＮＯＵＶＷＸＹ','ＦＧＨＩＪＰＱＲＳＴＺ'],
		// Arrf(fCC,[seqA(65345,26),seqA(65313,26)]),
		// Arrf(fCC,[seqA(9372,52),seqA(9424,26)]),

		['⒜⒝⒞⒟⒠⒦⒧⒨⒩⒪⒰⒱⒲⒳⒴','⒡⒢⒣⒤⒥⒫⒬⒭⒮⒯⒵'],
		['ⓐⓑⓒⓓⓔⓚⓛⓜⓝⓞⓤⓥⓦⓧⓨ','ⓕⓖⓗⓘⓙⓟⓠⓡⓢⓣⓩ'],
		['ⒶⒷⒸⒹⒺⓀⓁⓂⓃⓄⓊⓋⓌⓍⓎ','ⒻⒼⒽⒾⒿⓅⓆⓇⓈⓉⓏ'],
	],

	ABC3:[
		['ᴬᴮᒼᴰᴱᴷᴸᴹᴺᴼᵁ៴ᵂ  ',' ᴳᴴᴵᴶᴾ ᴿ  ᙆ'],
		['ᵃᵇᶜᵈᵉᵏˡᵐⁿᵒᵘᵛʷˣʸ','ᶠᵍʰⁱʲᵖ ʳˢᵗz'],
		['ₐ ₑₒᵣᵪᵧ','  ᵤᵥₓ'],
		['␆␇␈␘␍␛␗␃␌␜␞␏␎␁␠','␡␐␙␅␄␝␉␊␕␤␂␚␖␟␋'],
	],

	DEF:[
		['āáǎàaēéěèeūúǔùu','ōóǒòoīíǐìiǖǘǚǜü'],


		[['æ','e','ɛ','//','[]', 'ɒ','ɑ','u','ʊ','ʌ',  'ɔː','ɔ','uː','u','ɑː' ],['i','ɪ','ə','ɚ','ɔ',  'iː','i','əː','ɜː','ɝ']],

		[['ei','eɪ','e','ai','aɪ',  'əʊ','oʊ','o','iə','ɪə',  'ʊə','ʊr','ˈ','ˌ','//'],['ɔi','ɔɪ','au','aʊ','əu',  'ɪr','ɛə','eə','ɛr','uə']],

		[['p','t','k','f','s', 'θ','ʃ','tʃ', 'n','m',  'h' ,'j','l','ℓ','r' ],['b','d','ɡ','v','z',  'ð','ʒ','dʒ', 'ŋ' ,'w']],

	],
	DEF1:Arrf(function(t,i){return [Latin(t,true).join('').replace('É','$&G'),
		Latin(t).join('').replace('⊙⋅⃛','i')
	]},entity.slice(4,9)),

	DEF2:Arrf(function(t,i){return [Latin(t,true).join(''),
		Latin(t).join('').replace('◯','')
	]},entity.slice(9)).concat([['₠₡₢₣₤₥₦₧₨₩','₪₫€₭₮₯₰₱₲₳']]),

	DEF3:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,(i==4?4:10)).concat(i==4?seqA(13169,6):[]))]},seqA(13184,5,'',20)),

	Operator:[
		['∑∏∐⋀⋂∮∯∰⨁⨂','∫∬∭⋁⋃∱∲∳⨀⨌'],
		['′″‴!† ¬∀∃∄√∛∜⨳','‵‶‷‼‡∂∇✓※'],
		['+×±⊕ ∧∨∩∪','-÷∓⊗∖'],
		[ ZLR('() [] {} <> 〈〉 ⁽⁾ ┌┐ ⌈⌉ ⎰⎱ ⟦⟧ ║║ ||'),
		ZLR('(,) [,] {,} <,> ⟨⟩ ₍₎ └┘ ⌊⌋ (,] [,)')],//⟮⟯
	],

	Operator1:[
		['+∓⍅⍏⌿⌗†⌶','⊹±⍆⍖⍀⋕#‡'],
		['‐‑‒−⁃¦∣∤','–—―－'],
		['‾∓∔∸∺∻÷∹⍎','_±‗⍘⍙⍚⍛⍜⍕'],
			
		['×⨉∕╱','╳⋇∖╲'],
			
		['⊕⨁⨂⊖⊗⦿⊙⨀⊚⌾','⊘⌽⊜⊝⍟⧀⧁⊛⌻⌼'],
	],

	Operator2:[
		
		['∧⋀⌃⌅⊼⌆⩞⋋⋏⨇','∨⋁⌄‸⊻ ⊽⋌⋎⨈'],
		['∩⋂⋓⋔ ⨃⨄⨅⊓','∪⋃⋒ ⊌⊍⊎⨆⊔'],

		['∡∠⦛⦣⦤⦠⦟⦞','∢⊿⊾⦢⦥⦡∟⦜⦝'],
		['⊞⊠⍁⌸⊡⍃⍄⌺⍐⍍⍓⍌⍰□■','⊟⌹⍂⍯⍠⍇⍈⍞⍗⍔'],
		['≖⋄','◯']

	],

	Relation:[

		['⋅∙•‧․∘°','⋆∗⁂⁑'],
		[':‥∷∟∠⋯⋰∵∦⊥','∶¨⁞⦜△⋮⋱∴▱◇'],
		['＝≡≣≗≘≙≚≛≜≝','≠≢≐≑≓≒≔≕≟≞'],
		['∼≈≋≀⌇≌⋍≃≅≊','≁≉⍭∾∿∽≂≄≇≆'],

	],

	Relation1:[
		['<>≤≥ ⋖⋗≦≧','≮≯≰≱ ⋜⋝≨≩'],

		['⊂⊃⊆⊇ ⊊⊋','⊄⊅⊈⊉ ⋐⋑'],
		['∈∋∊∍⋳⋻⋶⋽⋸∁','∉∌⋲⋺⋴⋼⋷⋾⋹⋵'],

		['≺≻≼≽ ⊰⊱≾≿','⊀⊁⋞⋟ ⋠⋡⋨⋩'],
		
		['≲≳≶≷ ⋚⋛≪≫','≴≵≸≹ ⋦⋧⋘⋙'],

	],

	Relation2:[
		['⊲⊳⊴⊵ ⋉⋊⋈','⋪⋫⋬⋭'],
		['⊏⊐⋤⋥⋿⌌⌍⌜⌝⌐','⊑⊒⋢⋣¬⌎⌏⌞⌟⌙'],
		['‖∥⊩⊫⧻','∦⧺⊮⊯⊪'],
		['⊺⊧⊤  ⊦⊨⍑','⊢⊣⊥  ⊬⊭⍊'],
		['⍤⍥⍡⍢','⍣⍨⍩'],
	],

	Arrow:[
		['←→↖↗ ⟵⟶↑↓','↚↛ ↙↘'],

		['↤↦↥  ⤒⇤⤟⤠','⟻⟼↧  ⤓⇥⤝⤞'],

		['⇷⇸⤉⇞','⇺⇻⤈⇟'],
		['↔⇹↕⤡⟷','↮⇼↨⤢⥈'],

	],
	Arrow1:[
		['↼⇀↿↾ ⥊⥏⥑⥎','↽⇁⇃⇂ ⥋⥌⥍⥐'],
		['⥚⥛⥠⥜ ⥒⥓⥘⥔','⥞⥟⥡⥝ ⥖⥗⥙⥕'],
		['⥢⥤⥣⥮ ⥦⥨⥪⥬','⇋⇌⥥⥯ ⥩⥧⥫⥭'],

		['⇐⇒⇑⇖⇗⇔⟺⟸⟹','⇍⇏⇓⇙⇘⇎⤄⤂⤃'],
		['⇇⇉⇈','⬱⇶⇊'],


	],
	Arrow2:[

		['⇆⇅⥃⥂ ⥶⥸','⇄⇵⥄  ⥹⥻'],
		['⤪⤨⤧  ⤮⤯⤲','⤫⤬⤩  ⤭⤰⤱'],
		['⤆⤇⇚  ⤊⟰','⟽⟾⇛  ⤋⟱'],
		['↞↠↟⥉ ⬴⤀⬻⤖ ⬼⤗⬶⤅','⤛⤜↡  ⬵⤁⬷⤐ ⬽⤘'],
	
		['↩↪⤣⤤ ↜↝↭⬳⟿','↫↬⤦⤥ ⇜⇝⬿⤳'],

	],
	Arrow3:[
		['⤿⤾⤺  ↶⤽⤼','⤷⤶⤻  ↷⤸⤹'],
			
		['⇠⇢⇡⤌⤍','⤎⤏⇣⬸⤑'],
		['⤙⤚⬹⤔','↢↣⬺⤕'],

		['⥳⥴⭋⭌ ⭊⥵⥆⥅','⭉⥲⭁⭇ ⭂⭈⭀⥱'],

		['⬰⇴⬾⥇⥷','⬲⟴⥺⭄⭃'],

	],
	Arrow4:[
		['↰↱⤴↴⇱','↲↳⤵↵⇲'],

		['⇦⇨⇕⇧⇳','⇽⇾⇿⇩'],
		
		['￩￫￪  ➚➶➹','‹›￬  ➘➴➷'],

		['↹⥰','↸☈↯⏎☇'],

	],
	Arrow5:[
		['➾➟➠➢➣➤➨➧➥➩','➙➝➞➡➔➜➲⇰➦➪'],
		['➬➮➱➳➵➺➼','➫➭➯➛➸➻➽'],
		['⇪⇫⇬⇭⇮⇯',''],
		['↻↺⥀','⟲⟳⥁'],
		
	],

	Misc:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,10))]},seqA(9632,4,'',20)),

	Misc1:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,10))]},seqA(9632+20*4,5,'',20)),

	Misc2:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,10))]},seqA(9632+20*9,5,'',20)),

	Misc3:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,10))]},seqA(9632+20*14,5,'',20)),

	Misc4:Arrf(function(x,i){return [fCC(seqA(x,10)),fCC(seqA(x+10,10))]},seqA(8962,3,'',20)).concat(
		[['卍卐⌘','']]
	),

/* 暂不收录的Unicode字符：
	27C0-27EF：杂项数学符号-A (Miscellaneous Mathematical Symbols-A) 
⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟	

*/
	SurPre:[ZLR("' ′ ″ ‴ ‵ ‶ ‷ % ‰ ‱ ‼ ! †"),ZLR('∫ ∬ ∭ ∮ ∯ ∰ ∱ ∲ ∳ ∑ ∏ ∐ ㏒ ㏑ √ ∛ ∜ ¬ ∀ ∃ ∄')],

/*
	entity=
 scr fr opf bar acute caron grave dot uml ring circ tilde breve 
 latex=
 mathcal mathfrak mathbb bar acute check grave dot ddot mathring hat tilde breve
 手写体 花体（哥特体） 空心体 上横线(第1声) 第2声 v形状(第3声) 第4声 点 双点 圆圈 上尖角 波浪线 u形状 
 𝒜𝔄𝔸 Á À ÄÅÃĂÂ
 𝒶𝔞𝕒āáǎàċäåâãă
*/

	Latex:{

'Α':'Alpha',
'Β':'Beta',
'Γ':'Gamma',
'Δ':'Delta',
'Ε':'Epsilon',
'Ζ':'Xeta',
'Η':'Eta',
'Θ':'Theta',
'Ι':'Iota',
'Κ':'Kappa',
'Λ':'Lambda',
'Μ':'Mu',
'Ν':'Nu',
'Ξ':'Xi',
'Ο':'Omikron',
'Π':'Pi',
'Ρ':'Rho',
'΢':'Zelta',//实际无此字母，暂以Zelta命名
'Σ':'Sigma',
'Τ':'Tau',
'Υ':'Upsilon',
'Φ':'Phi',
'Χ':'Chi',
'Ψ':'Psi',
'Ω':'Omega',
'Ϝ':'Digamma',//

'α':'alpha',
'β':'beta',
'γ':'gamma',
'δ':'delta',
'ε':'epsilon',
'ζ':'zeta',
'η':'eta',
'θ':'theta',
'ι':'iota',
'κ':'kappa',
'λ':'lambda',
'μ':'mu',
'ν':'nu',
'ξ':'xi',
'ο':'omikron',
'π':'pi',
'ρ':'rho',
//'ς':'zelta',//实际无此字母，暂以Zelta命名
'σ':'sigma',
'τ':'tau',
'υ':'upsilon',
'φ':'phi',
'χ':'chi',
'ψ':'psi',
'ω':'omega',
'ϝ':'digamma',

'ϵ':'varepsilon',


'ϑ':'vartheta',

'ϰ':'varkappa',

'ϖ':'varpi',

'ϱ':'varrho',


'ς':'varsigma',


'ϕ':'varphi',


'ı':'imath',
'ȷ':'jmath',


'ℵ':'aleph',
'ℶ':'beth',
'ℷ':'gimel',
'ℸ':'daleth',

'ð':'eth',




'ℬ':'mathscr{B}',
'ℰ':'mathscr{E}',
'ℱ':'mathscr{F}',
'ℋ':'mathscr{H}',
'ℐ':'mathscr{J}',
'ℒ':'mathscr{L}',
'ℳ':'mathscr{M}',
'ℛ':'mathscr{R}',
'ℯ':'mathscr{e}',
'ℊ':'mathscr{g}',
'ℴ':'mathscr{o}',

'ℭ':'mathfrak{C}',
'ℌ':'mathfrak{H}',
'ℑ':'mathfrak{J}',
'ℜ':'mathfrak{R}',
'ℨ':'mathfrak{Z}',




'ℂ':'mathbb{C}',
'ℍ':'mathbb{H}',
'ℕ':'mathbb{N}',
'ℙ':'mathbb{P}',
'ℚ':'mathbb{Q}',
'ℝ':'mathbb{R}',
'ℤ':'mathbb{Z}',




'ℝ':'mathbb{R}',
'ℎ':'mathit{h}',//mathnormal 
'Ｃ':'mathbf{C}',
'Ϲ':'mathsf{C}',
'∁':'mathtt{C}',	// complement

'⊺':'intercal',
'a':'mathrm{a}',
	
	
'ā':'bar{a}',
'á':'acute{a}',
'ǎ':'check{a}',
'à':'grave{a}',
'ċ':'dot{c}',
'ä':'ddot{a}',
'ů':'mathring{u}',
'â':'hat{a}',
'ã':'tilde{a}',
'ă':'breve{a}',


'†':'dag',
'‡':'ddag',

'∡':'measuredangle',
'∢':'sphericalangle',
'⋄':'diamond',
'◊':'Diamond',	//lozenge
'⧫':'blacklozenge',
'♢':'diamonds',	//diamondsuit	

'♣':'clubs',	//clubsuit
'♠':'spades',
'♡':'hearts',
'✠':'maltese',

'♮':'natural',
'♯':'sharp',
'♭':'flat',

'⋆':'star',
'★':'bigstar',

'∙':'bullet',

'℧':'mho',
'╱':'diagup',
'╲':'diagdown',
'∖':'setminus',

'⟨':'langle',
'⟩':'rangle',

'{':'lbrace',
'}':'rbrace',

'[':'lbrack',
']':'rbrack',

'|':'lvert',
'|':'llvert',

'∧':'land',
'∨':'lor',
'¬':'neg',	//lnot

'⊼':'barwedge',
'⩞':'doublebarwedge',

'¥':'yen',
'£':'pounds',

'⊛':'circledast',
'⊚':'circledcirc',
'⊝':'circleddash',
'®':'circledR',
'Ⓢ':'circledS',
'§':'text{\\S}',
'¶':'text{\\P}',

'■':'blacksquare',
'□':'square',	// Box
'⊡':'boxdot',
'⊟':'boxminus',
'⊞':'boxplus',
'⊠':'boxtimes',

'≀':'wr',

'⅟':kfrac('1/n').substr(1),
'½':kfrac('1/2').substr(1),
'⅓':kfrac('1/3').substr(1),
'⅔':kfrac('2/3').substr(1),
'¼':kfrac('1/4').substr(1),
'¾':kfrac('3/4').substr(1),
'⅕':kfrac('1/5').substr(1),
'⅖':kfrac('2/5').substr(1),
'⅗':kfrac('3/5').substr(1),
'⅘':kfrac('4/5').substr(1),
'⅙':kfrac('1/6').substr(1),
'⅚':kfrac('5/6').substr(1),
'⅛':kfrac('1/8').substr(1),
'⅜':kfrac('3/8').substr(1),
'⅝':kfrac('5/8').substr(1),
'⅞':kfrac('7/8').substr(1),

'㏒':'log',
'㏑':'ln',

'func_tri':[zlr2('sech csch cth th sh ch','⁻¹'),'sech csch cth th sh ch',
		zlr('arc','sin cos tan cot sec csc'),'sin cos tan cot sec csc'
		],
		//injlim	
'func':'# & % exp log ln lg arg gcd max min sup inf lim limsup liminf sin cos tan cot sec csc sh ch th cth tg ctg cotg tanh cosec arcsin arccos arctan arctg arcctg det dim deg hom ker Pr sinc si Si ci Ci Shi',

/*
'struc':{//结构

	
},
*/
//∘°度数

//\,, \:, \;, \quad, \qquad 空格由小到大
// 排版 equation, gather, align split alignat{n} 		gathered,aligned, alignedat intertext
// numberwithin eqref subequations 

		'±':'pm',
		'∓':'mp',
		'×':'times',
		'÷':'div',

		'⋇':'divideontimes',
		'∣':'mid',
		'∤':'nmid',
		'⋅':'cdot',	//cdotp centerdot




		'∘':'circ',
		'∗':'ast',
		'⨀':'bigodot',
		'⨂':'bigotimes',
		'⨁':'bigoplus',

		'⊕':'oplus',
		'⊖':'ominus',
		'⊗':'otimes',
		'⊘':'oslash',
		'⊙':'odot',

		'≡':'equiv',
		'≠':'ne',	// \ne \not= \neq

	//	'≠':'=\\not\\mathrlap{}',

/*
		bug	 不等号被Katex显示成 / = 		写成		=\not\mathrlap{}
	
2≠3\\
2\neq3\\
2\ne3\\

*/

		'✓':'checkmark',


		'≪':'ll',
		'≫':'gg',
		'⋘':'lll',
		'⋙':'ggg',

		'≤':'leq',
		'≥':'geq',

		'≦':'leqq',
		'≧':'geqq',
			
		'└':'llcorner',
		'┘':'lrcorner',

		'⋉':'ltimes',
		'⋊':'rtimes',

		'≈':'approx',
		'≃':'simeq',
		'≅':'cong',
		
		
		'∝':'propto',
		
		'∑':'sum',
		'∏':'prod',
		'∐':'coprod',
		'∐':'amalg',
			
		'√':'sqrt',
		'∛':'sqrt[3]',
		'∜':'sqrt[4]',

		'∅':'varnothing',
		'∅':'empty',
		'∅':'emptyset',
		'∈':'in',
		'∉':'notin',
		'⊂':'subset',
		'⊃':'supset',
		'⊆':'subseteq',
		'⊇':'supseteq',
		'⋒':'Cap',	// doublecap
		'∩':'cap',
		'⋓':'Cup',	// doublecup
		'∪':'cup',
		'⊓':'sqcap',
		'⊔':'sqcup',
		'⊏':'sqsubset',
		'⊐':'sqsupset',
		'⊑':'sqsubseteq',
		'⊒':'sqsupseteq',
		'⋢':'notsqsubseteq',
		'⋣':'notsqsupseteq',
		'⋤':'sqsubsetnoteq',
		'⋥':'sqsupsetnoteq',

		'⋂':'bigcap',
		'⋃':'bigcup',
		'⋁':'bigvee',
		'⋀':'bigwedge',
		'⨄':'biguplus',
		'⨆':'bigsqcup',
		'◯':'bigcirc',

		
		'.':'ldotp',
		
		'…':'ldots',	//dotsc	dotso
		'⋯':'cdots',	//dotsb	dotsm	idotsint
		'⋱':'ddots',
		'⋮':'vdots',
		'⋰':'iddots',

		'∵':'because',
		'∴':'therefore',
		'∀':'forall',
		'∃':'exists',
		'∄':'nexists',

		'≯':'not>',
		'̸⊄':'not\\subset',


		'⊥':'bot',
		'∠':'angle',
		'°':'^\\circ',
		
		'′':'prime',
		'″':"''",
		'‴':"'''",
		'‵':'backprime',
		'∫':'int',
		'∬':'iint',
		'∭':'iiint',
		'∬∬':'iiiint',
		'∮':'oint',
		'∯':'oiint',
		'∰':'oiiint',
		'∞':'infty',
		'∇':'nabla',
		'∂':'partial',

		'Ⅎ':'Finv',
			
		'ℜ':'Re',
		'ℜ':'real',
		'ℑ':'Im',
		'ℑ':'image',

		'ℓ':'ell',
		'ℏ':'hbar',
		'ℏ':'hslash',

		'℘':'wp',
		'℘':'weierp',
		'⅁':'Game',

		'ø':'text{\\o}',
		'Ø':'text{\\O}',

		'ı':'text{\\i}',
		'ȷ':'text{\\j}',


		'å':'text{\\aa}',
		'Å':'text{\\AA}',
		'æ':'text{\\ae}',
		'Æ':'text{\\AE}',
		'œ':'text{\\oe}',
		'Œ':'text{\\OE}',

		'ß':'text{\\ss}',

		

		'↑':'uparrow',
		'↓':'downarrow',
		'⇑':'Uparrow',
		'⇓':'Downarrow',

		'→':'rightarrow',
		'←':'leftarrow',
		'⇒':'Rightarrow',
		'⇐':'Leftarrow',
		'⟶':'longrightarrow',
		'⟵':'longleftarrow',
		'⟹':'Longrightarrow',
		'⟸':'Longleftarrow',
		
		'→':'to',
		'←':'gets',
		
		'↔':'leftrightarrow',
		'↮':'notleftrightarrow',
		
		'￫':'vec{}',
		
		'⎰':'lmoustache',
		'⎱':'rmoustache',
		'⌈':'lceil',
		'⌉':'rceil',
		'⌊':'lfloor',
		'⌋':'rfloor',
		
		
		






'↺':'circlearrowleft',
'↻':'circlearrowright',
'↶':'curvearrowleft',
'↷':'curvearrowright',
'⇓':'Darr',
'⇓':'dArr',
'↓':'darr',
'⇠':'dashleftarrow',
'⇢':'dashrightarrow',
'↓':'downarrow',
'⇓':'Downarrow',
'⇊':'downdownarrows',
'⇃':'downharpoonleft',
'⇂':'downharpoonright',
'←':'gets',
'⇔':'Harr',
'⇔':'hArr',
'↔':'harr',
'↩':'hookleftarrow',
'↪':'hookrightarrow',
'⟺':'iff',
'⟸':'impliedby',
'⟹':'implies',
'⇐':'Larr',
'⇐':'lArr',
'←':'larr',
'⇝':'leadsto',
'←':'leftarrow',
'⇐':'Leftarrow',
'↢':'leftarrowtail',
'↽':'leftharpoondown',
'↼':'leftharpoonup',
'⇇':'leftleftarrows',
'↔':'leftrightarrow',
'⇔':'Leftrightarrow',
'⇆':'leftrightarrows',
'⇋':'leftrightharpoons',
'↭':'leftrightsquigarrow',
'⇚':'Lleftarrow',
'⟵':'longleftarrow',
'⟸':'Longleftarrow',
'⟷':'longleftrightarrow',
'⟺':'Longleftrightarrow',
'⟼':'longmapsto',
'⟶':'longrightarrow',
'⟹':'Longrightarrow',
'↫':'looparrowleft',
'↬':'looparrowright',
'⇔':'Lrarr',
'⇔':'lrArr',
'↔':'lrarr',
'↰':'Lsh',
'↦':'mapsto',
'↗':'nearrow',
'↚':'nleftarrow',
'⇍':'nLeftarrow',
'↮':'nleftrightarrow',
'⇎':'nLeftrightarrow',
'↛':'nrightarrow',
'⇏':'nRightarrow',
'↖':'nwarrow',
'⇒':'Rarr',
'⇒':'rArr',
'→':'rarr',
'↾':'restriction',
'→':'rightarrow',
'⇒':'Rightarrow',
'↣':'rightarrowtail',
'⇁':'rightharpoondown',
'⇀':'rightharpoonup',
'⇄':'rightleftarrows',
'⇌':'rightleftharpoons',
'⇉':'rightrightarrows',
'⇝':'rightsquigarrow',
'⇛':'Rrightarrow',
'↱':'Rsh',
'↘':'searrow',
'↙':'swarrow',
'→':'to',
'↞':'twoheadleftarrow',
'↠':'twoheadrightarrow',
'⇑':'Uarr',
'⇑':'uArr',
'↑':'uarr',
'↑':'uparrow',
'⇑':'Uparrow',
'↕':'updownarrow',
'⇕':'Updownarrow',
'↿':'upharpoonleft',
'↾':'upharpoonright',
'⇈':'upuparrows',

'≈':'approx',
'≊':'approxeq',
'≍':'asymp',
'∍':'backepsilon',
'∽':'backsim',
'⋍':'backsimeq',
'≬':'between',
'⋈':'bowtie',
'≏':'bumpeq',
'≎':'Bumpeq',
'≗':'circeq',

':':'colon',
':≈':'colonapprox',
'::≈':'Colonapprox',
':−':'coloneq',
'::−':'Coloneq',
':=':'coloneqq',
'::=':'Coloneqq',
':∼':'colonsim',
'::∼':'Colonsim',
'≅':'cong',
'⋞':'curlyeqprec',
'⋟':'curlyeqsucc',
'⋎':'curlyvee',
'⋏':'curlywedge',

'⊣':'dashv',
'::':'dblcolon',
'≐':'doteq',
'≑':'Doteq',
'≑':'doteqdot',

'∔':'dotplus',

'≖':'eqcirc',
'−:':'eqcolon',
'−::':'Eqcolon',
'=:':'eqqcolon',
'=::':'Eqqcolon',
'≂':'eqsim',
'⪖':'eqslantgtr',
'⪕':'eqslantless',
'≡':'equiv',
'≒':'fallingdotseq',
'⌢':'frown',
'≥':'ge',
'≥':'geq',
'≧':'geqq',
'⩾':'geqslant',
'≫':'gg',
'⋙':'ggg',
'⋙':'gggtr',
'>':'gt',

'⋗':'gtrdot',
'⪆':'gtrapprox',
'⋛':'gtreqless',
'⪌':'gtreqqless',
'≷':'gtrless',
'≳':'gtrsim',
'∈':'in',
'∈':'isin',
'⋈':'Join',

'<':'lt',
'⋖':'lessdot',

'⩽':'leqslant',
'⪅':'lessapprox',
'⋚':'lesseqgtr',
'⪋':'lesseqqgtr',
'≶':'lessgtr',
'≲':'lesssim',
'≪':'ll',
'⋘':'lll',
'⋘':'llless',

'∣':'mid',
'⊨':'models',
'⊸':'multimap',
'∋':'owns',	//ni
'‖':'parallel',
'⊥':'perp',
'⋔':'pitchfork',
'≺':'prec',
'⪷':'precapprox',
'≼':'preccurlyeq',
'⪯':'preceq',
'≾':'precsim',
'∝':'propto',
'≓':'risingdotseq',
'∣':'shortmid',
'∥':'lVert',	//shortparallel
'∼':'sim',
'≃':'simeq',
'⌢':'smallfrown',
'⌣':'smallsmile',
'⌣':'smile',
'⊏':'sqsubset',
'⊑':'sqsubseteq',
'⊐':'sqsupset',
'⊒':'sqsupseteq',
'⋐':'Subset',
'⊂':'subset',
'⊂':'sub',
'⊆':'subseteq',
'⊆':'sube',
'⫅':'subseteqq',
'≻':'succ',
'⪸':'succapprox',
'≽':'succcurlyeq',
'⪰':'succeq',
'≿':'succsim',
'⋑':'Supset',
'⊃':'supset',
'⊇':'supseteq',
'⊇':'supe',
'⫆':'supseteqq',
'≈':'thickapprox',
'∼':'thicksim',
'⊴':'trianglelefteq',
'≜':'triangleq',
'⊵':'trianglerighteq',
'∝':'varpropto',
'△':'vartriangle',	//bigtriangleup
'▽':'triangledown',	//bigtriangledown
'◃':'triangleleft',
'▹':'triangleright',

'⊲':'lhd',	//vartriangleleft
'⊳':'rhd',	//vartriangleright

'▲':'blacktriangle',
'▼':'blacktriangledown',
'◀':'blacktriangleleft',
'▶':'blacktriangleright',

'⋋':'leftthreetimes',
'⋌':'rightthreetimes',

':':'vcentcolon',
'⊢':'vdash',
'⊨':'vDash',
'⊩':'Vdash',
'⊪':'Vvdash',

'⪊':'gnapprox',
'⪈':'gneq',
'≩':'gneqq',
'⋧':'gnsim',
'':'gvertneqq',
'⪉':'lnapprox',
'⪇':'lneq',
'≨':'lneqq',
'⋦':'lnsim',
'':'lvertneqq',
'≆':'ncong',
'̸​=':'ne',
'̸​=':'neq',
'≱':'ngeq',
'':'ngeqq',
'':'ngeqslant',
'≯':'ngtr',
'≰':'nleq',
'':'nleqq',
'':'nleqslant',
'≮':'nless',
'∤':'nmid',
'∈/​':'notin',
'̸​':'notni',
'∦':'nparallel',
'⊀':'nprec',
'⋠':'npreceq',
'':'nshortmid',
'':'nshortparallel',
'≁':'nsim',
'⊈':'nsubseteq',
'':'nsubseteqq',
'⊁':'nsucc',
'⋡':'nsucceq',
'⊉':'nsupseteq',
'':'nsupseteqq',
'⋪':'ntriangleleft',
'⋬':'ntrianglelefteq',
'⋫':'ntriangleright',
'⋭':'ntrianglerighteq',
'⊬':'nvdash',
'⊭':'nvDash',
'⊯':'nVDash',
'⊮':'nVdash',
'⪹':'precnapprox',
'⪵':'precneqq',
'⋨':'precnsim',
'⊊':'subsetneq',
'⫋':'subsetneqq',
'⪺':'succnapprox',
'⪶':'succneqq',
'⋩':'succnsim',
'⊋':'supsetneq',
'⫌':'supsetneqq',
'':'varsubsetneq',
'':'varsubsetneqq',
'':'varsupsetneq',
'':'varsupsetneqq'

	}

}
,FUNCSi=[ZLR('Trigonometric Hyperbolic'),
	['Arithmetic','Number Theory'],

	ZLR('Algebraic Analytical'),
	ZLR('Set Logistical'),
	ZLR('Geometric Topological'),
	ZLR('Probabilistic Statistical'),
]
	
,FUNCS={
	'Number Theory':['dr Re Im rad ind'],
	'Arithmetic':['gcd log exp Arg','lcm ln lg arg','mod sgn'],// ㏒ ㏑
	'Algebraic':['rank diag tr det','adj dim hom ker per','span proj Pr'],
	'Trigonometric':['sin tan sec','cos cot csc',
		zlr('arc','sin tan sec'),zlr('arc','cos cot csc'),
		'Si si sinc cis','Ci ci Cin arccis'
	],
	'Hyperbolic':['sh th sech','ch cth csch',
		zlr2('sh th sech','^{-1}'),zlr2('ch cth csch','^{-1}'),
		'Shi','Chi'

	],//⁻¹

	'Analytical':['lim sup inf grad','limsup liminf curl rot','inj~lim proj~lim div'],
	'Set':[],
	'Logistical':['OR AND XOR','NOR NAND XNOR'],
	'Probabilistic':['Bin Geo'],
	'Statistical':['min max'],

	'Topological':[],
	'Geometric':['deg',],
	'Combination':[],
}


,STRUCi=[//

	ZLR('Fraction Equality Non-equality'),
	ZLR('Subsup Root Differential'),

	ZLR('Sum Limit Integral'),
	

	ZLR('Align Linebreak Define'),
	ZLR('Matrix Det Summarize'),
	['Parentheses','Big Parentheses','Binom'],

	ZLR('Over Latin Color'),
	['Lowercase Greek','Uppercase Greek','Hebrew'],
	['Font','Math Font','Text Font'],

	ZLR('Note Reasoning Relation'),
	['Notes','Margin','Negative Margin'],
	['Margin Space','Margin Value','Size'],

]
	
,STRUC={


	'Fraction':[
		['1\\/2'].concat($A(zlrA3("kfrac(",[
			"[3,4]",
			"'1/2+3/4+5/6',1",
			
		],")"))).concat('{$Random(100)$}\\/{$Random(100)$} $\'+-×÷\'[Random(4)-1]$ {$Random(100)$}\\/{$Random(100)$}'),
		["$kfrac('1/2')$"].concat(zlrA3('\\',['','t'],'frac{1}{2}'),
		zlrA3('\\',['','t'],'frac{1}{1+\\frac{1}{2}}')),

		[],
		
		[
		"\\dfrac{1}{2}",
		"\\cfrac{1}{1 + \\cfrac{1}{2}}",
		"$mfracs([1,3,5],[2,4,6],'',1,'+','')$"
		],
		
	],


	'Note':[
		zlrA3("$eq(1,'",'→↔←↦'.split(''),"',2)$"),//katex 暂不支持 ⇆ ↤	//←↔→⇐⇔⇒=↩↪↞↠↼⇀↽⇁⇋⇌⇄↦
		['\\stackrel{1}{\\longrightarrow}'].concat(zlrA3("$eq(1,'",'↩↪↞↠'.split(''),"',2)$")),
		['\\stackrel{1}{\\longleftarrow}'].concat(zlrA3("$eq(1,'",'↼⇀↽⇁'.split(''),"',2)$")),
	
		
	],


	'Reasoning':[
		zlrA3("$eq(1,'",'=⇒⇔⇐'.split(''),"',2)$"),//katex 暂不支持 ⇆ ↤
		zlrA3("$eq(1,'",'⇋⇌⇄'.split(''),"',2)$"),
	],

	'Define':[
		['\\def\\zzllrr#1#2{{#1}+{#2}}\\zzllrr{\\pi}{4}',
		'\\newcommand\\test[2]{\\color{#1}{\\heartsuit}\\color{#2}{\\heartsuit}} \\test{red}{blue}']
	],


	'Relation':[['↖','↙'],
		zlrA3("$mtrx([",[
		
			"['A\\\\quad~~','\\\\stackrel {1}⟶','\\\\quad B'],['↖\\\\footnotesize{3}','','↙\\\\footnotesize{2}'],['','C','']",
			"['','A',''],['','↙\\\\footnotesize{1}\\\\quad ↖\\\\footnotesize{3}'],['B','\\\\stackrel{2}⟶','C']",
			],"],'.','.','')$"),	

		zlrA3("$mtrx([",[
			"['A~~~','\\\\stackrel {1}⟶','B'],['↑\\\\footnotesize{4}','',' ~~↓\\\\footnotesize2'],['D~~~','\\\\stackrel {3}⟵','C']",
			"['','A',''],['','~~↑\\\\footnotesize{1}',''],['D\\\\stackrel{4}←','O','\\\\stackrel {2}→B'],['','~~↓\\\\footnotesize3',''],['','C','']",
			],"],'.','.','')$")
	],
	


	'Root':[['√2','∛3','∜4','√{ab}'].concat($A(
		zlrA3('mroots(',ZLR("[2,3],['','x','y'],'','','+-',1"),",'')")
	)),
		$A(zlrA3("kroot('x'",['',',3',',4'],')')
			.concat(zlrA3("kfrac([",ZLR("kroot(2),2 kroot(5)+'-1','2'"),'])'))),
		[],
		$A(zlrA3("kfrac([",ZLR("'-b±'+kroot('b^2-4ac'),'2a'"),'])')),
		$A(zlrA3('mroots(',ZLR("[2,3,4,5],['',1,10,100,1000],'',1,'+',1"),",'')"))
	],

	
	'Equality':[['='].concat($A(
		zlrA3("Eq([",[
			"'x',''],'','line'",
			"'x','y',2],'','line'",
		],')').concat(
			[
				"eq0(['x','y'])",
			]
		))),

		$A(zlrA3("aligned(['x','= 1','= 2']",[
			"",
			",1"
		],")").concat("aligned(['~ \\\\quad x','= 1','= 2'])")).concat(
			$A(zlrA3("Eq([",[
				"['x','1'],'2']",
				"'x','1','2']",
				],')')
			)
		),

		[],
		$A([
			"kmod('a','b',2)",
			"eq0(['x','y'],3,5)",
		]),

		$A(zlrA3("Eq([",[
			"['x','1'],'2'],'','','≡'",
			"'x','1','2'],'','','≡'",
			],')').concat([
				"eqM([1,-1],2)"
			])
		),
		
		[],


	],

	'Non-equality':[['≤'].concat($A(zlrA3("Eq([",[
		"'x',''],'','line',['≤']",
		"'x','y',2],'','line',['=','≤']",

		],')'))),
		['≥'].concat($A([

			"Eq(['x','y',2],'','line',['=','≠'])",
		])),
		['≠'].concat($A([
			"kmod('a','b',2,1)",
		])),

	],


	'Summarize':Arrf(tinyA,[
		
		zlrA3("piece(",[
			"[1,2]",
			"[[1,2],[3,4]]",
		],')').concat("mtrx([[1,2],[3,4]],'B','B','')"),
		zlrA3('piece(',[
			"[1,2],1",
			"[[1,2],[3,4]],2",
			],')'),
		[],
		[
			"EqA(['1x+2y=3','4x-5y=6'])",
			"EqA(['1x+2y>=3','4x-5y<=6'])",
		]
	]),


	'Notes':Arrf($A,[

			zlrA3("kx",[
				"o('a+b','{'",
				"o('a+b','{','note'",
			],')'),
		
			zlrA3("kx",[
			"u('a+b','{'",
			"u('a+b','{','note'"
			],')'),

	]),

	'Parentheses':[zlrA3("$zp('x^2'",[
		"",
		",'<>'",
		",'[]'",
		",'{}'",
	
		",'/\\\\'",
		
		],')$'),
		zlrA3("$zp('x^2'",[
		",'||'",
		",'‖‖'",
		",'⌊⌋'",
		",'⌈⌉'",
	
		],')$'),
		zlrA3("$zp('x^2'",[
	
		",'↑↓'",
		",'↕↕'",
		",'⇑⇓'",
		",'⇕⇕'",
		],')$'),
		zlrA3("$zp('x,y'",[
			",'','(','.'",
			",'','.',')'",
			",'(]'",
			",'[)'",
	
		],')$'),
		["$pp('x,y')$",
		"$zp('x,y','','<','>')$",
		"\\mathopen\\lt a\\mathclose\\gt",
		'\\pod a'],
	],

	'Big Parentheses':Arrf($A,[
		['big(0)+big(0,1)','big(1)+big(1,1)','big(2)+big(2,1)','big(3)+big(3,1)'],
		['big(0,2)+big(0,3)','big(1,2)+big(1,3)','big(2,2)+big(2,3)','big(3,2)+big(3,3)'],
		['big(0,4)+big(0,5)','big(1,4)+big(1,5)','big(2,4)+big(2,5)','big(3,4)+big(3,5)'],
	
	]),

	'Matrix':Arrf(tinyA,[zlrA3("zmtrx([[1,2],[3,4]]",[
			"",
			",'','.',''",
			",'','p',''",
		],')'),
		
		zlrA3("zmtrx([[1,2",[
			"],[3,4]],'','r2c2'",
			",3,4],[5,6,7,8]],'','c2'"
		],')'),
		[],

		zlrA3("Eq([",[
			"zmtrx([[1,2],[3,4]]),zmtrx([[5,6],[7,8]])],[['1','2']],'','→'",	//\\begin{aligned} & ~ \\\\quad x \\\\  & =1 \\\\  & =2 \\end{aligned}
			"zmtrx([[1,2,3,4],[5,6,7,8]],'','c2'),zmtrx([[1,2,3,4],[5,6,7,8]],'','c2')],[['1','2']],'','→'"
		],')'),
		[],[],

		zlrA3("zmtrx(Arrf(ZLR,",[
			"['a_{11} a_{12} a_{13}','a_{21} a_{22} a_{23}','a_{31} a_{32} a_{33}']",
			"['a_{11} a_{12} a_{13} ⋯ a_{1n}','a_{21} a_{22} a_{23} ⋯ a_{2n}','a_{31} a_{32} a_{33} ⋯ a_{3n}','⋮ ⋮ ⋮ ⋱ ⋮','a_{n1} a_{n2} a_{n3} ⋯ a_{nn}']",

		],'))'),
		[],[],

	]),




	'Det':Arrf(tinyA,[

		["kdet([[1,2],[3,4]])",
		 "zdet(['1 2','3 4'])",
		 "mtrx([[1,2],[3,4]],'V','V','')",
		],
		
		zlrA3("Eq([",[
			"kdet([[1,2],[2,4]]),0],[['1st','2nd']]",
			"kdet([[1,2],[3,4]]),kdet([[5,6],[7,8]])],[['1st','2nd']]",
		],')'),
		[],
		
		zlrA3("zdet(",[
			"['a b   ','c a b  ',' ⋱ ⋱ ⋱ ','  c a b','   c a']",
			"['a     b',' ⋱   ⋰ ','  a b  ','  c d  ',' ⋰   ⋱ ','c     d']",

		],')'),[],[],

		zlrA3("zdet(",[
			"['a_{11} a_{12} a_{13} ⋯ a_{1n}','a_{21} a_{22} a_{23} ⋯ a_{2n}','a_{31} a_{32} a_{33} ⋯ a_{3n}','⋮ ⋮ ⋮ ⋱ ⋮','a_{n1} a_{n2} a_{n3} ⋯ a_{nn}']",
			"['1 1 1 ⋯ 1','a_1 a_2 a_3 ⋯ a_n','a_1^2 a_2^2 a_3^2 ⋯ a_n^2','⋮ ⋮ ⋮ ⋱ ⋮','a_1^{n-1} a_2^{n-1} a_3^{n-1} ⋯ a_n^{n-1}'],2",

		],')'),[],[],

		
		
	]),



	'Sum':[['\\Sigma','\\Pi','\\sum','\\prod']
	].concat(
		Arrf($A,[
			zlrA3("sum('i',0,'+','f',",[0,1,3,6],",'')").concat("sum('','i+j=10','','f',0,'')"),

			zlrA3("prod('i',0,'+','f',",[0,1,4,8],",'')").concat("prod('','i|24','','f',0,'')"),

			zlrA3("prod('i',0,'+','f',",[3,7],",'')").concat("sum('',['i+j=10','i<j'],'','f',0,'')"),
			
			zlrA3("sum('i',0,'+','f',",[2,4,5],",'')"),
			zlrA3("prod('i',0,'+','f',",[2,5,6],",'')"),
			
			["Opr('','-','+','f','*')"]
			

		])
	),

	'Limit':[['\\lim'].concat(
			zlrA3("$lim('x','",[
				"+','f','",
				"-','f','",
				],"','')$"
			)
		).concat('\\infty'),
		zlrA3("$lim('x','0",[
			"','f','",
			"+','f','",
			"','f','u",
			"','f','d",
			],"','')$"
		),
		[],
		["e^x=$lim('n','',kfraczp('1+'+kfrac(['x','n']),'','n'),'','')$",
			'\\lim\\limits_{\\substack{x→0\\\\y→0}}f(x,y)'
		]
	],
	

	'Differential':[
		$A(["difn('f')"].concat(zlrA3("difn('f','x',",[
			"''",
			"1",
			],")")
		,"difn()","difn('','',1)")),
		['\\d x','\\mathrm{d}y','∂x','\\d x∧\\d y','\\nabla'],
		[],
		$A(zlrA3("difn('f','x',",[
			"'',2",
			"1,2"
			],")").concat(zlrA3("difn('f',['x','y']",['',',1'],")"))),
		$A(["difn('(x,y)','(u,v)',1)", "zp(difn('(x,y)','(u,v)',1),'|')", "difn('f',['x','y','z'],1)"]),
	],

	'Integral':[['\\int','\\smallint','\\textstyle\\int',"\\int \\limits_{L}",
				"$iint('','L','','s',1,1)$",
				"$intl('F(x)','0','1','',-1)$"
				]
			].concat(Arrf($A,[
			["intl('f','-1','1','x',0,'')", "intl('f','-','+','x',0,'')", "intl('f(t)','0','x','t',0,'')","orifun('0','2π')"],
			[],

			["iint(['P','+Q'],'L','','x;y',1,1)", "iint('ω','∂M','',' ',1,1)+'='+iint('','M','','ω',1,1)",
				"intl('','0','2π','θ',0,'')+intl('f','0','1','ρ',0,'')"],
			["oint(['P','+Q'],'L','','x;y',1,1)+'='+iint(zp(difn('Q','x',1)+'-'+difn('P','y',1)),'D','','x,y',2,1)",
				"intl('','0','1','x',0,'')+intl('f','0','1','y',0,'')"],
			[],


			["iint('f','Σ','','',2,1)", "iint('f','Σ','','x,y',2,1)",  "iint('f','Σ','','φ,θ',2,1)", "iint('f',['x^2+y^2=1','x>=0'],'','x,y',2,1)"], 
			["oint(['P','+Q','+R'],'Σ','','x,y;y,z;z,x',2,1)", "iint('f','Σ','','x, y',2,1)",],
			[],
			["iint('f','Ω','','',3,1)", "iint('f','Ω','','x,y,z',3,1)","intl('f','-','+','x',6,'')"],
			["oint(['P','+Q'],'Ω','','x,y,z;y,z,t',3,1)","intl(intl(intl('f','0','R','r',0,''),'0','π','φ',0,''),'0','2π','θ',0,'')"],
			[],
			["intl('','0','1','x',0,'')+intl('','0','x','y',0,'')+intl('f(x,y,z)','0','z(x,y)','z',0,'')","intl('','0','2π','θ',0,'')+intl('f','0','θ','ρ',0,'')"],
			["intl('','0','2π','θ',0,'')+intl('','0','π','φ',0,'')+intl('f(r,φ,θ)','0','R','r',0,'')","intl('','0','2π','θ',0,'')+intl('f(ρ,θ)','ρ=0','ρ=a','',-1)"],
			[],
	])),




	'Over':Arrf($A,[zlrA3("kxo('a','",'-→↔←'.split(''),"')"),//katex 暂不支持 ⇐ ⇒
		zlrA3("kxu('a','",'-→↔←'.split(''),"')"),//katex 暂不支持  ↼ ⇀ < > ⇐ ⇒ 
		
		zlrA3("kxo('a','",'↼⇀<>'.split(''),"')"),
		zlrA3("kxo('a','",'I{(~='.split(''),"')"),
		zlrA3("kxu('a','",'I{(~='.split(''),"')")
	]),

	'Subsup':[zlrA('{x}',[
		'_1^2',
		'^2',
		'^3',
		'^{-1}',
		'_1',
		]),
		['{e}^{πi}','{r}e^{iθ}','{e}^{\\frac{iπ}2}','C_{n}^{m}'],
		[],
		['\\stackrel{1}{2}','\\overset{1}{2}','\\underset{2}{1}'],
		zlrA3('1 \\',['atop','above{}','above{1pt}','above{2pt}'],2)
	
	],

	
	'Binom':[
		zlrA3("$binom('2n','n'",[",'c'",'',",'t'",",'d'"],')$'),
		zlrA3("$genfrac(1,2",[
			",'','',1",
			",'','',1,0",
			",'','',1,1"
		],')$').concat('1 \\brack 2','1 \\brace 2'),
		$A(zlrA3("genfrac(1,2",[
			",'','','',0",
			'',
			",'','','',1"
		],')').concat("kfraczp('1/2','','3')")),
		

	],




//zlrA3("\\math",ZLR('rm bb it bf sf tt'),"{A}"),
	'Font':[zlrA3("$kxc('",Arrf(function(x){return x+"','"+x},ZLR('Bbb bf frak it rm')),"','')$"),
		zlrA3("$kxc('",Arrf(function(x){return x+"','"+x},ZLR('sf tt bm bold')),"','')$"),
		zlrA3("$kxc('",Arrf(function(x){return x+"','"+x},ZLR('boldsymbol')),"','')$").concat([
			'a \\pmb b c'
		]),
	
	],
	
	'Math Font':Arrf($A,[zlrA3("kxc('math",Arrf(function(x){return x+"','"+x},ZLR('bb bf cal')),"')"),
		zlrA3("kxc('math",Arrf(function(x){return x+"','"+x},ZLR('frak it rm')),"')"),
		zlrA3("kxc('math",Arrf(function(x){return x+"','"+x},ZLR('scr sf')),"')").concat("kxf('mathrm')")

	]),
	
	'Text Font':Arrf($A,[
		zlrA3("kxc('text",Arrf(function(x){return x+"','"+x},ZLR(' bf it sf')),"','text')"),
		zlrA3("kxc('text",Arrf(function(x){return x+"','"+x},ZLR('rm normal tt')),"','text')"),
	
	]),

	'Hebrew':[
		zlrA3("$kxc('",['A','B','C','D'],"','a')$"),
		zlrA3('\\',ZLR('Ka La '),'TeX'),
		['Q.~E.~D.~','Q.~E.~A.~'],
	],

	'Lowercase Greek':Arrf($A,[
		zlrA3("kxc('",['a','b','c','d','e'],"','g')"),
		zlrA3("kxc('",['f','g','h','i','k'],"','g')"),
		zlrA3("kxc('",['l','m','n','o','p'],"','g')"),	
		zlrA3("kxc('",['q','r','s','t','u'],"','g')"),
		zlrA3("kxc('",['v','w','x','y','z'],"','g')"),
	]),

	'Uppercase Greek':Arrf($A,[
		zlrA3("kxc('",['A','B','C','D','E'],"','g')"),
		zlrA3("kxc('",['F','G','H','I','K'],"','g')"),
		zlrA3("kxc('",['L','M','N','O','P'],"','g')"),	
		zlrA3("kxc('",['Q','R','S','T','U'],"','g')"),
		zlrA3("kxc('",['V','W','X','Y','Z'],"','g')"),
	]),

	'Margin':[zlrA('\\backslash',[',\\,',':\\:',';\\;']).concat('\\tilde~'),

		Arrf(function(x){return x+'\\'+x},zlrA2(ZLR(' q'),'quad')),
	],
	'Margin Space':[
		Arrf(function(x){return x+'\\'+x},zlrA2(ZLR('thin med thick'),'space')),
		Arrf(function(x){return x+'\\'+x},zlrA2(ZLR(' en nobreak'),'space')),
		['1\\mathinner{\\text{inner}}2','1\\mathpunct{.}2'],
	],

	'Margin Value':[zlrA3('\\',ZLR('mkern mskip hspace'),'{5mu}'),
		zlrA3('\\',ZLR('kern hskip hspace*'),'{0.25em}'),

		zlrA3('\\',ZLR('smash[b] raisebox{0.25em}'),'{A}'),

	],

	'Negative Margin':[
		['\\backslash!\\!'].concat(Arrf(function(x){return x+'\\'+x},zlrA2(ZLR('negthick'),'space'))),
		Arrf(function(x){return x+'\\'+x},zlrA3('neg',ZLR('thin med'),'space')),
		zlrA3('\\math',ZLR('l c r'),'lap{A}')
	],


	'Linebreak':[$A(['kbr','kbr2']).concat('\\sum_{\\substack{0<i<m\\\\0<j<n}}'),
		ZLR('phantom\\phantom{A} hphantom$hp()$ vphantom\\vphantom{A}'),
		ZLR('tag{1}{A} tag*{2}{B}'),
	
	],

	'Align':Arrf($A,[

		zlrA3("mtrx([[1,2],[3,4]],",[
			"'small','small'",
			"'.','.'"
		],",'')").concat("zmtrx([['',0,1],[0,0,1],[1,1,0],],'','I1J1','.','.')"),


		zlrA3("zmtrx([[1,2",[
			"],[3,4]],'','r2c2'",
			",3,4],[5,6,7,8]],'','c2'"
		],",'.','.')"),
		[],
		zlrA3("aligned([1,2,3]",[
			"",
			",1"
		],")"),
		
	]),//.concat(["\\def\\arraystretch{1.5}"+mtrx([[1,2],[3,4]],'.','.','')]),


	'Latin':[zlrA3('\\',ZLR('vec dot ddot mathring'),'{a}'),
		zlrA3('\\',ZLR('bar acute check grave'),'{a}'),
		zlrA3('\\',ZLR('hat tilde breve'),'{a}').concat(['\\stackrel{a}{.}']),
	
	],


	'Size':[zlrA3("$ksz('",[
		"tiny',-4",
		"scriptsize',-3",
		"footnotesize',-2",

		],")$"),
	
		zlrA3("$ksz('",[
		"small',-1",		
		"normalsize'",
		"large',1",
	
		],")$"),
	
		[],
	
		zlrA3("$ksz('",[
		"Large',2",
		"LARGE',3",
		],")$"),
		
		zlrA3("$ksz('",[

		"huge',4",
		"Huge',5",

		],")$"),
	],
	
	'Color':[["\\color{red}A",
		"$fcb('red','','A')$",
		"$fcb('red','yellow','A')$",
		"\\colorbox{aqua}{A}"
		],
		zlrA3("$kancel(1",ZLR(" ,'-' ,'b' ,'x'"),')$'),
		['\\not{1}'].concat($A(["kbox(1)","kbox('F','frak','math')"]),'\\fbox{A}'),
		
	]

},SBSFn=[],

//下列涉及LaTeX
zx=function(t,o){return katex.renderToString(kx(isArr(t)?t.join(kbr2):t),o||{}).replace(/\n/g,' ')},
zxdet=function(A,spacing){return zx(zdet(A,spacing))},
zxmtrx=function(A,spacing,parts){return zx(zmtrx(A,spacing,parts))},
zxul=function(A){return zx(piece(Arrf(ZLR,A)))},
zxsum=function(i,b,t,v,p){return zx(lrp('',sum(i,b,t,v,p,''),'',''))},
zxprod=function(i,b,t,v,p){return zx(lrp('',prod(i,b,t,v,p,''),'',''))},
zxfrac=function(t,b,zM){return zx(frac(t,b,zM))},
zxroot=function(t,n){return zx(root(t,n,'',''))},
zxmod=function(a,b,m,neg){return zx(mod(a,b,m,neg,'',''))},
zxEq=function(A,noteA,style,eqClass){return Eq(Arrf(zx,A),noteA,style,eqClass)},
zxdetail=function(s,v,o){return detail(zx(s),zx(v),o)},


//下列涉及DOM
OH=function(txt,cols){var isA=isArr(txt), t=isA && txt.length==1 && txt[0].indexOf(hr+br)>0?txt[0].split(hr+br):txt;
	$('#oHTML').html(isArr(t)?(cols || t.length>1 && t.length<2?Table('',[t],'TBc dash edit','vat pd10'):t.join(hr)):t);
},

//下列涉及输入编码
$2v=function(str,A){/*将含$字符串，替换为变量
	*/
	if(isArr(str)){
		return Arrf(function(s){return $2v(s,A)}, str)
	}else{
		return str.replace(/\$\d+/g,function(t){return isArr(A)?A[+t.substr(1)]:A})
	}



//下列涉及函数编程API
},fun2str=function(name,val,p){//参数p是完整点.路径
	var tp=typeof val;
	if(tp == 'object'){//遍历对象属性
		if(val instanceof RegExp){
			return sceg2(name)+val
		}
		
		var A=[];
		$.each(val,function(i,v){
			A.push(fun2str(i,v,(p?p+'.':'')+name));
		});
		return XML.wrapE('details','<summary class=obj>'+name+'</summary>'+ A.join(br))
	}

	if(tp == 'function'){
		var s=(''+val).replace(/^[^\(]+/,''), s0=s.split('{')[0], s1=s.substr(s0.length), c=s1.substr(1,s1.length-2),eg2='';
		s0=s0.trim();
		if(/【.+】/.test(c)){
			var A=c.match(/【.+】[^\n]+/g);
			//consolelog(A);
			eg2=Arrf(function(x){var x0=x.split('】')[0]+'】', x1=x.split('】 ')[1];return x0+sceg2(x1)}, A).join(br);
			c=c.replace(/【.+】[^\n]+/g,'');
		}
		return sceg2(name+'()','', p?p+'.':'')+eg2+
			(s0 && s0!='()'?detail(s0.substr(1,s0.length-2), XML.wrapE('pre',XML.encode(c))):'')
	}else{
		return sceg2(name,'',p?p+'.':'')+XML.encode(val)
	}

},API=function(A){/* A是JSON数组
	A=[{'zlr':[{'颜色':'a b c'},{'组件':'d e f'}]},{'io':[]}]
	
	bug OH(API([{'zlr':[{'颜色':[{'整数':'gcd'},{'数组':'Arrf'}]},{'组件':'lcm'}]},{'io':[]}]))
	*/
	var t='';
	return Arrf(function(x){
		var s='',u=[];
		//consolelog('x=',x);
		$.each(x,function(jsname,funcA){
			var tp=typeof funcA;
			if(isArr(funcA)){
				u.push(detail(jsname,API(funcA))) 
			}else if(tp ==  'object'){
				$.each(funcA,function(grp,funcs){
					if(isArr(funcs)){
						//consolelog(grp,funcs);
						u.push(detail(grp,API(funcs)))
					}else{
						u.push(detail(grp,Arrf(function(i){return fun2str(i,eval(i))},ZLR(funcs)).join(br)));
					}
				});
			}else if(tp ==  'string'){
				u.push(detail(jsname,Arrf(function(i){return fun2str(i,eval(i))},ZLR(funcA)).join(br)));
			}
		});
		return u.join(br);
	},A).join(br)


	


//下列涉及规范化字符、预处理


},n2sub=function(n,sup){//数字转Unicode上下标
	var S0=SBS.Num[0][0],S1=SBS.Num[0][1],i=S0.indexOf('⁰');
	return (n+'').replace(/./g,function(t){return /\d/.test(t)?(sup?S0:S1)[i+(+t)]:(sup?'⁺⁻⁼⁽⁾':'₊₋₌₍₎')['+-=()'.indexOf(t)]||t})

},sub2n=function(s,latex){//上下标字符转成普通字符 latex指定转换为latex
	var S0=SBS.Num[0][0],S1=SBS.Num[0][1],regS0=new RegExp('['+S0+']+','g'),regS1=new RegExp('['+S1+']+','g');
	if(latex){return s.replace(regS0,function(t){return sup(sub2n(t),'')}).replace(regS1,function(t){return sub(sub2n(t),'')})}
	return s.replace(/./g,function(t){return /[⁺⁻⁼₊₋₌⁽⁾₍₎]/.test(t)?'+-=+-=()()'['⁺⁻⁼₊₋₌⁽⁾₍₎'.indexOf(t)]:(''+Math.max(S0.indexOf(t),S1.indexOf(t))).replace(/-1/,t)})



},asc2unicode=function(s){//将普通字符转成专门字符
	var t=s.replace(/[\.。]{3}/g,'⋯').replace(/beta/g,'β').replace(/zeta/g,'ζ');
		
	$.each(SBS.Latex,function(k,v){
		if(/[a-z]{2,}/i.test(t)){
		//	if(v=='in'){
				
		//	}else{
		//		t=t.replace(new RegExp(v,'g'),k)
			//	}
			t=t.replace(new RegExp(' '+v+' ','g'),' '+k+' ')
		}else{
			return false
		}
	});
	
	return t

	
},opfrac=function(x){//分数显式表示
	return x.replace(/(\d+)\/(\d+)/g,'\\frac{\\displaystyle{}$1}{\\displaystyle{}$2}')	// 分数

},optrim=function(x){//省略运算符
	return x.replace(/(\d)[×‧](\D)/g,'$1$2') //省略数与非数之间的乘号

},opreplace=function(x){//运算符规范化预处理	算术运算
	return x.replace(/[]/g,'').replace(/​/g,'')	//不可见字符
		.replace(/ |&#8194;/g,' ')	//非标空格
		.replace(/[乘乖✖ⅹ╳‧][以于与]?/ig,'*').replace(/&#10008;/g,'*')
		.replace(/ʸ/g,'^y')
		.replace(/不等于/g,'≠').replace(/等于|＝/g,'=')

		.replace(/&#65409;&#10135;/g,'除').replace(/ﾁ7ￊ9|&#65409;7&#65482;9|&#10135;/g,'除').replace(/[除➗梅／][以于与]?/g,'/')
		.replace(/[减減]去?|－/g,'-').replace(/[＋加]上?/g,'+')//.replace(/\+\-/g,'±').replace(/\-\+/g,'∓')
		.replace(/（/g,'(').replace(/）/g,')').replace(/[·•。]/g,'.').replace(/[和与，、]/g,',').replace(/；/g,';')
		.replace(/[“”‘’]/g,"'").replace(/[？]/g,'?')
		.replace(/\(([\d\.]*)\)/g,'$1').replace(/∣/g,'|')
		.replace(/[三3]次根号下?/g,'∛').replace(/[四4]次根号下?/g,'∜').replace(/根号下?/g,'√')
		.replace(/log/g,'㏒').replace(/ln/g,'㏑').replace(/!{2,}/g,'‼')
		

},opreplace0=function(x,standard){/*运算符规范化预处理	常量（不含变量）运算
	参数standard 指定按*,/ 标准写法
	*/
	if(standard){
		//consolelog(x);
		return x.replace(/[xⅹ╳‧×]/ig,'*').replace(/[÷／]/ig,'/')
	}
	return x.replace(/[xⅹ╳‧]/ig,'×')
		.replace(/[\*]/ig,'×')
		.replace(/[\/]/g,'÷')

},opreplace1=function(x){//运算符规范化预处理	数论函数
	return x.replace(/PI|[π]/ig,'Π')//小于n的素数个数函数Π(n)

},opreplace2=function(x){//运算符规范化预处理	矩阵运算
	return x.replace(/\^T|'/g,'†')//转置（共轭转置）
		.replace(/\^?\*/g,'*')	//伴随矩阵
		.replace(/^\(?⁻¹?\)?/g,'⁻')	//逆（广义逆）

},opreplace3=function(x, formathjs){//运算符规范化预处理	微积分运算	参数formathjs指定按mathjs的风格
	var t=opreplace(x).replace(/[′']{3}/g,'‴').replace(/[′']+/g,'″').replace(/‵{3}/g,'‷').replace(/‵+/g,'″')
		.replace(/∫{3}/g,'∭').replace(/∫+/g,'∬').replace(/∮{3}/g,'∰').replace(/∮+/g,'∯')
		//.replace(/d([xyt])/g,'ⅾ$1')//暂用罗马数字ⅾd，表示微分算符
		.replace(/偏/g,'∂')
		.replace(/o{2,}/g,'∞')
		.replace(/㏒_([\da-z]+)\^([\da-z]+)/ig, formathjs?'log ($2,$1)':'㏒($1,$2)');

	return formathjs?t.replace(/[㏒㏑]/g,'log '):t
		


},opreplace6=function(x){//运算符规范化预处理	集合运算
	return x.replace(/[补]/g,'-')
		.replace(/[⋂交\*]/g,'∩').replace(/[⋃并\+]/g,'∪')


},opreplace7=function(x){//运算符规范化预处理	逻辑命题运算
	return re(x.replace(/[与非]/g,'↑').replace(/[或非]/g,'↓')
		.replace(/异或/,'⊕')
		.replace(/[┐┒┓非不]/g,'¬')
		
		.replace(/[⋀Λ且与]|合取/g,'∧').replace(/[⋁或]|析取/g,'∨'))

		.replace(/¬永真蕴含于/g,'⇍').replace(/¬永真蕴含/g,'⇏').replace(/¬等价/g,'⇎').replace(/¬等值/g,'↮').replace(/¬蕴含/g,'↛')
		.replace(/永真蕴含于/g,'⇐').replace(/永真蕴含/g,'⇒').replace(/等价/g,'⇔').replace(/等值/g,'↔').replace(/蕴含/g,'→')



},opreNumRlt=function(x){//关系符规范化预处理		数字关系
	return re(x.replace(/不等于/g,'≠')
		.replace(/〉/g,'>').replace(/〈/g,'<'))
		.replace(/大于等于/g,'≥').replace(/小于等于/g,'≤')
		.replace(/等于|＝/g,'=')

},opreplace16=function(x){//关系符规范化预处理		集合关系
	return x.replace(/不真包含于/g,'⊄')
		.replace(/真包含于/g,'⊂').replace(/不包含于/g,'⊈')

},opreSeqsA=function(x){/* 序列间隔符预处理
	*/
	return x.replace(/[ ，]/g,',')
	
},simOpr=function(s){//简化矩阵运算表达式
	return s.replace(/\+\-/g,'-').replace(/([\+\- ^])1([A-Z])/g,'$1$2').replace(/[\+\-]0I/g,'').replace(/\(A\)/g,'A')



//下列涉及信息提取

},exp2arr=function(str){//表达式内部（子元素按逗号,分隔） to 数组 
	var A=str.split(','),i=-1,chkpairs=function(s,p){//i标记数组中第几个元素括号成对出现（合规）chkpairs检查括号是否成对出现
		if(p){
			return s.length-s.replace(new RegExp('\\'+p,'g'),'').length
		}
		var s0=s.replace(/\(/g,'').length,s1=s.replace(/\)/g,'').length;
		if(s0<s1){
			return [')',s1-s0]
		}
		var s0=s.replace(/\[/g,'').length,s1=s.replace(/\]/g,'').length;
		if(s0<s1){
			return [']',s1-s0]
		}
		var s0=s.replace(/\{/g,'').length,s1=s.replace(/\}/g,'').length;
		if(s0<s1){
			return ['}',s1-s0]
		}
		return ['',0]
	};

	while(i+1<A.length){
		var t=A[i+1],c=chkpairs(t);
		if(!c[0]){
			i++;
		}else{
			A[i+1]+=','+A[i+2];
			A.splice(i+2,1);
		}
	}
	return A

},exp2coe=function(exp,regX,otherVars){/*表达式提取未知量前面的系数
	regX：未知量的正则表达式字符串
	otherVars：其它未知量变量字母串
	
	regX是1时，提取常数项（x的多项式降幂排列的常数项， 或齐次方程=左边的常数项， 或非齐次方程=右边的常数项）
	如果表达式e是方程，则regX是=时，提取等式右边的项
	
	*/
	var e=exp.replace(/ /g,''), R=regX||'x\\d*', r=new RegExp(R,'i'), r1=new RegExp('.*'+(/x\d/i.test(regX)?'x\\d+':'['+(otherVars||'a-zα-ω')+']')+'(\\^.)*','ig');
	//   /x1/.test(s)?e.match(/-*[\da-z]*x1/i)[0].replace(/x.+/,'').replace(/^-$/,-1)||1:0
	if(regX=='='){
		return e.split('=')[1]
	}
	if(''+regX=='1'){
		if(/=/.test(e) && !/=\s*0$/.test(e)){
			return e.split('=')[1]
		}
		
		return e.split('=')[0].replace(r1,'').replace(/^\+/,'')||0
	}

	return r.test(e)? e.split(r)[0].replace(r1,'').replace(/^-$/,-1).replace(/^\+/,'')||1 : 0




// 二维数组平面化


},Mtrx2str=function(A,tbClass,bds){//与矩阵字符串化略有区别，多了递归

	var m=A.length,n=A[0].length,B=[];
	for(var i=0;i<m;i++){
		var Bi=[],Ai=A[i];
		for(var j=0;j<n;j++){
			var Aij=Ai[j],s='';
			////consolelog(i,j,Aij);
			Bi.push(Aij.t?eval(Aij.t).toStr(Aij,Aij.typ||''):Aij)
		}
		B.push(Bi);
	}

	return Table('',B,tbClass||'bd0 alignc',bds)

},sbsTbltd=function(T,e,textareaId,ityp){//LaTeX输入面板功能
	var td=$(T),tr=td.parent(),me=td.children('span'),t=me.text(),iTyp=ityp||'LaTeX', istd=me.is('td'),
		mult=tr.is('.Operator9'), fn=td.is('.Fns'), st=td.is('.Sts'), shft=e.shiftKey || $('#Shift').is('.seled');//排版
	

	if(me.is('.symboli')){
		$('.Symboli td.seled').not(td).not(':has(.symboli_)').click();

		td.toggleClass('seled');
		var di=me.attr('data-i');
		if(!me.is('.symboli_') && !me.parent().parent().is('.Symboli_')){
			$('.symboli_').parent('.seled').removeClass('seled');
			$('.Symboli.Symboli_').hide();
		}

		//Scroll('scrollT');
		if(me.is('.symboli_')){

			$('.symboli_').not(me).parent().removeClass('seled');
			$('.Symboli.Symboli_').not(me.parent().parent().nextUntil('.Symboli:not(.Symboli_)')).hide();
			$(zlr3('.Symboli_[data-i='+di,seqA(1,10).join(' '),']',',')).toggle().find('td.seled').removeClass('seled');
			return
		}
		
		if(fn){
			$('.Fns[data-i="'+di+'"]').toggle();
		}else if(st){
			var divs=$('div.Sts[data-i="'+di+'"]');
			if(divs.filter(':visible').length){
				divs.add('.sbsTblPg, div.Sts[data-i]').hide()
			}else{
				divs.slice(0,3).show();
				if(divs.length>3){
					$('.sbsTblPg').show()
				}
			}
			
		}else{
			$('.'+di).toggle();
		}

		return
	}

	var t=me.text().replace('空',' '), SL=SBS.Latex,SLF=ZLR(SL.func);
	if(fn){//函数
		if(iTyp=='LaTeX'){

			var c=td.attr('title'),hassbl=/[^a-z].+/i.test(c),c0=c.replace(/[^a-z].+/i,''), word=/^[a-z~]+$/.test(c);

			t=(SLF.indexOf(c0)>-1?'\\'+c0:'\\text{'+(word?c:c0)+'}')+(hassbl && !word?c.replace(/^[a-z]+/i,''):'');

		}else{
			t=td.attr('title')
		}
		if(!shft){
			t+='()';
		}
		
	}else if(st){//结构
		var tl=td.attr('title');
		t=tl;

		if(iTyp=='LaTeX'){

//console.log(t);
			if(t){
				if(t.indexOf('$')>-1){
					if(!shft){
						t=t.replace(/\$[^\$]+\$/g,function(x){return eval(x.replace(/\$/g,''))});
					}else{

					}
					/*
					t=t.replace(/^[^\$]+/g,'');
					if(!shft){
						t=eval(t.replace(/\$/g,''))
					}
					t=tl.replace(/\$.+/,'')+t;
					*/
				}else{
					if(/tag/.test(t)){
		
						t='\\'+t;
					}
					
				//	t=(/^[\{\d\\]/.test(tl)?'':'\\')+tl;
					//t=/^[a-z]/i.test(t)?t.replace(/^[a-z]+/ig,''):t;
				}
			}
		}else if(t.indexOf('$')>-1){
			if(iTyp=='Markdown'){
				if(shft){
					//t='\n$$zx('+t.replace(/\$/g,'')+')$$\n';
					t='\n$'+t+'$\n';
				}else{
					t='$'+eval(t.replace(/\$/g,''))+'$'
				}
			}else if(iTyp=='JS'){
				
				t=t.replace(/\$/g,'');
				
			}
			
		}else{
			
			t='$'+t+'$';
		}

		
		
	}else if(iTyp=='LaTeX' && !isArr(t)){//字符	istd
		var tl=SL[t];
		
////consolelog(tl,t);
		if(tl && !shft && t=='≠'){
	//		t='=\\not\\mathrlap{}'	//fix bug of katex ≠
		}else{
			t=tl && !shft?(tl[0]=='^'?'':'\\')+tl+' ':t;
		}
////consolelog(tl,t);
	}
		

	var i=$('#'+textareaId), iv=i.val(), sS=i[0].selectionStart, sE=i[0].selectionEnd;
	if(shft && sS!=sE){// fix bug of shift on textarea 
		sS=sE
	}
////consolelog(iv,sS,sE);



	var v=iv.substr(0,sS+(t=='删'?-1:0))+(t=='删'?'':t)+(sE==iv.length?'':iv.substr(sE));
	i.val(v).change();

////consolelog(v,t);

	t=sS+(t=='删'?-1:(t.length%2==0 && mult?t.length/2:(istd && /\{/.test(t) && !/\(/.test(t)?t.indexOf('{')+1:(/,/.test(t)?(/..,/.test(t)?t.indexOf(',')+1:1):t.length-(+(fn && !shft))))));

	i[0].selectionStart=t;
	i[0].selectionEnd=t;
	//i.focus();
},

sbsTbl=function(){

	// LaTeX支持
	//SBS

	var str='<table class=sbsTbl>',str2='<table class="sbsTbl sbsiTbl">',SL=SBS.Latex,SLF=ZLR(SL.func);
	var strK=function(K,A){
	////consolelog(A);
		var si=1,s='',n=Math.max(A[0].length,A[1].length), f=function(c){
			if(c==' '){
				return ''
			}
			var tl=SL[c];
			return '<td'+(tl?' title="'+(tl[0]=='^'?tl:'\\'+tl)+'"':'')+'>'+SCtv('symbol'+si,c)+'</td>'
		},f5=function(i,j){
			var isstr=isStr(A[0]), x=isstr?A[j].substr(i*5,5).split(''):A[j].slice(i*5,i*5+5);
			return x.length?'<tr class='+K+'>'+
				Arrf(f,x).join('')+
				'</tr>':''
		};

		for(var i=0,l=Math.ceil(n/5);i<l;i++){
			s+=f5(i,0)+f5(i,1)
		}

		return s
	};
	var S=ZLR(SBSi),ii=0;
	for(var j=0;j<S.length;j++){
		var K=S[j],A=SBS[K], Kisd=/\d/.test(K);
		if(!Kisd){
			ii++;
		}
		str2+='<tr class="Symboli'+(Kisd?' Symboli_" data-i="'+K:((ii>3?' hidden':'')+'" data-ii="'+ii))+'">';

		for(var i=0;i<A.length;i++){
			str+=strK(K+i,A[i]);

			var uc=A[i][0][0];
			str2+='<td>'+SCtv('symboli" data-i="'+K+i,uc)+'</td>'
		}
		if(!Kisd){
			str2+='<td>'+SCtv('symboli symboli_" data-i="'+K,'...')+'</td>'
		}

		str2+='</tr>'
	}


	$('#sbs').append(str+'</table>');
	$('#isbs').append(str2+'</table>');

	//FUNCS
	var str='<div class=sbsTbl>',str2='<table class="sbsTbl sbsiTbl">';
	var strK=function(K,A){

		var s='<div class=Fns data-i="'+K+'">',n=A.length;
		for(var i=0;i<n;i++){
			var c=A[i],hassbl=/[^a-z].+/i.test(c),c0=c.replace(/[^a-z].+/i,''), word=/^[a-z~]+$/.test(c);

			s+=DCtv('Fns td" title="'+c, SCtv('symboln',zx((SLF.indexOf(c0)>-1?'\\'+c0:'\\text{'+(word?c:c0)+'}')+(hassbl && !word?c.replace(/^[a-z]+/i,''):''))));
		}
		s+=DCtv('clear')+dc;
		return s
	};
	for(var i=0,l=FUNCSi.length;i<l;i++){
		var S=FUNCSi[i];
		str2+='<tr class="Symboli'+(i>2?' hidden':'')+'" data-ii="'+(i+1)+'">';
		for(var j=0;j<S.length;j++){
			var K=S[j],A=FUNCS[K];
			str+=Arrf(function(x){return strK(K,ZLR(x))},A).join('');
			str2+='<td class=Fns>'+SCtv('symboli" data-i="'+K, gM(K.replace(/^Set$/,'Set.1')))+'</td>'

		}
		str2+='</tr>';
	}

	$('#funcs').append(str+dc);
	$('#ifuncs').append(str2+'</table>');

	//STRUC
	var strPg=strbtn+'∧" class=sbsTblPg hidden />';
	var str='<div class=sbsTbl>'+strPg,str2='<table class="sbsTbl sbsiTbl">';
	var strK=function(K,A){
	////consolelog(K,A);
		var s='<div class=Sts data-i="'+K+'">',n=A.length;
		for(var i=0;i<n;i++){
			var c=A[i];
			if(K=='Margin Value'){
				c=c.split('{')[0].substr(1)+c
			}
//console.log(K,c);
			s+=DCtv('Sts td" title="'+c.replace(/.backslash./,'')
				.replace(/^[a-z]{4,}/g,'')
				.replace('\\tilde~','~')
				.replace(/^(\*|\[b\])/,''),
				SCtv('symboln',zx(c.replace(/math(.lap)/,'$1').replace(/phantom/,'p')
				)));
		}
		s+=DCtv('clear')+dc;
		return s
	};
	var SA=STRUCi;
	for(var i=0;i<SA.length;i++){
		var S=SA[i];
		str2+='<tr class="Symboli'+(i>=3?' hidden':'')+'" data-ii="'+(i+1)+'">';
		for(var j=0;j<S.length;j++){

			var K=S[j],A=STRUC[K];
			//str+=strK(K,A);
			//consolelog(K,A);
			str+=Arrf(function(x){return strK(K,x)},A).join('');
			
			A=A[0];
			
			str2+='<td class=Sts title="'+gM(K)+'">'+SCtv('symboli" data-i="'+K, zx(K=='Margin Value'?A[0].split('{')[0].substr(1)+A[0]:A[0]))+'</td>'//K
		}
		str2+='</tr>'
	}

	$('#struc').append(str+strPg.replace('∧','∨')+dc);
	$('#istruc').append(str2+'</table>');

	$('.sbsTbl > tbody > tr, .sbsTbl > div').not('.Symboli:not(.Symboli_)').hide();	
};



$.each(FUNCS,function(i,v){SBSFn=SBSFn.concat(Arrf(ZLR,v.join(' ')))});

var SBSFUN=SBS.Latex.func_tri.concat(SBS.Latex.func.replace(/.+% |log ln |sin .+ arcctg /g,'')+
			' Arg ㏒ ㏑').join(' ');
var snippet={
	Ini:function(){
		L.snippets=L.snippets||1;
		L.snippetName1=L.snippetName1 || gM('Snippet');
		L.snippetType1=L.snippetType1 || 'LA';
		L.snippet1=L.snippet1 || '';
	},
	Save:function(){
		var s=$('.snippet.seled'), i=s.index()+1, p=$('#input0Type').val();
		L['snippetName'+i]=s.find('.snippetName').text();
		L['snippetType'+i]=ZLR(Meles)[ZLR(Mele).indexOf(p)]||p;
		L['snippet'+i]=$('#input0').val();
		L['snippets']=$('.snippet').length;
	},
	Str:function(name,type,selected){
		return DCtv('snippet'+(selected?' seled':'')+'" data-type="'+type,
				SCtv('snippetName" contentEditable="true',name)+
				(itv('snippetSend" tip="copy2input',$('#send2textBox').is(':visible')?'arrow_upward':''))+
			(selected?itv('snippetNew','add'):''))
	},
	load:function(i){
		$('#input0').val(L['snippet'+i]||'');let t=L['snippetType'+i];
		$('.snippet').removeClass('seled').find('.snippetNew').remove();

		if($('.snippet').length<i){
			$('#snippets').append(snippet.Str(L['snippetName'+i],t,1));
		}else{
			$('.snippet').eq(i-1).replaceWith(snippet.Str(L['snippetName'+i],t,1));
		}

		$('#input0Type').val(Meleo[t]||t).change();
	},
	Del:function(i){
		var s=$('.snippet.seled'), x=i || s.index()+1, l=$('.snippet').length;
		if(x){
			for(var j=x;j<=l;j++){
				L['snippetName'+j]=L['snippetName'+(j+1)];
				L['snippetType'+j]=L['snippetType'+(j+1)];
				L['snippet'+j]=L['snippet'+(j+1)];
			}
			L['snippets']=l-1;

		}

	}
};







snippet.Ini();










var OverCanvas=function(t){

	var iT=$('#input0Type').val();
	L.drawShapeNow='';
	$('#TextBoxType').val(iT);
	$('#TextBox').val(t);
	$('#TextBoxGo').click();
	$('#Pointer').click();


}, preDisplay=function(){
	$('.imgHTMLEditor').toggle($('#toggleHTMLEditor').is('.seled'));
	try{
		var iv=$('#input0Type').val(),ov=$('#output0Type').val();
		if(!iv){
			iv='LaTeX';
			$('#input0Type').val(iv);
		}
		var i=iv[0],o=ov[0],v=$('#input0').val().trim(),w=$('#input0Preview');


		if(iv==ov && ov!='HTML'){
			w.add('#previewTool').hide();
			
		}else if(iv=='LaTeX' && o!='H'){
			var x=v, kxx=kx(sub2n(v,1));

			if(o=='P' && v){
				katex.render(kxx, w[0], {
					throwOnError: false,
					displayMode: true,
					trust:true
				});
				x=XML.wrapE('code',XML.encode(w.find('.katex-mathml').html().replace(/math/,'math xmlns="'+xmml+'"')));
				
			}



			w.html(x).add('#previewTool').show();

			if(o=='S' && v && MathJax){
				//console.log(w[0]);
				w.empty();
				var options = MathJax.getMetricsFor(w[0]);
				options.display = $('#displayMode').is('.seled');

				//MathJax.tex2svg 返回node  示例：MathJax.tex2svg('\\frac{1}{x^2-1}', {display: true});
				MathJax.tex2svgPromise(kxx, options).then(function (node) {
				  //
				  //  The promise returns the typeset node, which we add to the output
				  //  Then update the document to include the adjusted CSS for the
				  //    content of the new equation.
				  //
				  //console.log(node);
				  w[0].appendChild(node);
				  /*
				  MathJax.startup.document.clear();
				  MathJax.startup.document.updateDocument();
				  */
				}).catch(function (err) {
				  //
				  //  If there was an error, put the message into the output instead
				  //
				  w[0].appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
				}).then(function () {
				  //
				  //  Error or not
				  //
				  if(!$('#SVGLinkMode').is('.seled')){

					/* https://www.jb51.net/article/166239.htm


标签里的background的url()里，地址不能加引号，单引号双引号都不行，否则会被微信编辑器过滤掉。
标签里不能有id属性
不能有style script a标签

涉及动画，需要给涉及到的元素的 <g> 设置style="outline:none"，包括 <g> 内的所有子 <g> 

					*/
					var MJ=$('#input0Preview .MathJax');
					MJ.find('use').each(function(){
						var id=$(this).attr('xlink:href');
						$(this).replaceWith($(id)[0].outerHTML.replace(/id="[^"]+" /,''))
					});
					MJ.find('defs, style, script, a').remove();
					MJ.find('svg').removeAttr('aria-hidden role focusable');
					MJ.find('g').removeAttr('data-mml-node data-mjx-texclass');
					MJ.find('[stroke="currentColor"]').removeAttr('stroke');
					MJ.find('[fill="currentColor"]').removeAttr('fill');
				  }
				  
				});
				
			}

			
		}else if(o=='H'){
			w.add('#previewTool').show();
			if(v){
				$('#input0Preview').css('min-height',$('#input0').height()-15+'px');
				all2html(iv,v,w);

			}else{
				w.empty()
			}
		}
		$('#input0Preview>.katex-display>.katex').css('text-align','left')

	}catch(e){

	}
};



$(function(){
	$('#zMather').append(DCtv('pd2" id="iContent',

	'<div id=iText>'+
		'<div id=iTextMain>'+
			DCtv('pd10 resize" hidden contentEditable=true id="HTMLEditor')+
			DCtv('pd10 resize" hidden contentEditable=true id="input0Preview')+
			DCtv('resize','<textarea id=input0>'+(L.snippet1||'')+'</textarea>'+
				'<div id=Snippets hidden>'+
					

					(isedi?'':itv('" id=send2textBox tip="copy2input','arrow_upward'))+

					//itv('" id=navHide tip="Collapse','keyboard_arrow_up')+

					'<select id=input0Type>'+optgrp(gM('Snippet Editor')+':',
					OptGrps(jSon('[{"'+
						gM('Math Formula')+
						'":"LaTeX Ascii_Math Unicode_Math Content_MathML Presentation_MathML"},{"'+
						gM('Webpage Editor')+
						'":"Markdown HTML CSS"},{"'+
						gM('Graphics')+
						'":"Canvas SVG Echarts Zdog Lego Rough 2D 3D"},{"'+
						gM('Show')+
						'":"Slide VR AR"},{"'+
				
						gM('Calculator')+' | '+gM('Script')+
						'":"JavaScript"},{"'+

						gM('Translator')+
						'":"I18N EN"},{"'+

						gM('Data')+' | '+gM('Text')+
						'":"TXT TSV CSV XML YAML JSON"}]')
					)
					)+'</select>'+
					itvc('rotate180" id="tClear')+
					//(isedi?'':itv('" id=zMatherHide tip="Collapse','keyboard_arrow_up'))+br+
					br+

					itv('" id=UploadSnippetFile tip="Import File','file_upload')+
					itv('" id=DownloadSnippetFile tip="Download Snippet Text File','file_download')+

					itv('" id=linebreakEqual tip="Linebreak Equality','drag_handle')+
					itv('" id=linebreak tip="Linebreak','subdirectory_arrow_left')+

					itv('" id=input0Size tip="Font Size','format_size')+


					itv('Del" id=snippetDel tip="Delete Snippet','remove_circle')+

					
					
					'<input type="file" id=inputSnippetFile hidden />'+


					DCtv('resize" id="snippets',
						Arrf(function(i){return snippet.Str(L['snippetName'+i]||gM('Snippet'),
							L['snippetType'+i]||'LA',i==1)}, 
						seqA(1,+L.snippets||1)).join('')
					)
				+dc
			)+
			DCtv('opac" hidden id="input0Tool',

				'<div id=inputTools>'+
					itvc('" id=iClear hotkey="Ctrl + E')+

					strbtn+'⋮" id=Condon class=tool hidden />'+
					SCtv('iTextLaTeXon',
						
						strbtn+'T" id=editTexton class=tool tip=EditText />'+
						strbtn+'α" id=sbson tip=UnicodeCharacter class=tool />'+
						strbtn+'ƒ" id=funcson tip=Function class=tool />'+
						strbtn+'∑" id=strucon tip=Structure class=tool />'+
						strbtn+'?" id=randon tip=Random class=tool />'
					)+
					itvc('rotate180" id="tClear2')+
					
				dc+
				DCtv('onbox" hidden id="editText',[
					DCtv('editTextBox',[
						gM('By')+Arrf(function(x){return SCtv('hotk" data-v="'+x, gM({Comma:',',Semicolon:';'}[x]||x)) },
							ZLR('Comma Semicolon Space Tab')).join(' '),
							strtxt+'id=lineByChar />',
						strbtn+gM('Merge Line.1')+'" id=lineMerge tip="Line.1 Merge" />'+
						strbtn+gM('Split Line.1')+'" id=lineSplit tip="Line.1 Split" />'
						]
					).join(''),

					
					DCtv('editTextBox hidden',[
						strbtn+gM('Uniq Line.1')+'" id=lineUnique tip="Line.1 Uniq" />',
						strbtn+gM('Delete Blank Line.1')+'" id=blankLineTrim tip="Blank Line.1 Trim" />',
						gM('Head Foot Trim')+strbtn+'↤↦" id=lineTrim tip="Line.1 Head Foot Trim" />'+
						strbtn+'↤" id=lineTrimHead tip="Line.1 Head Trim" />'+
						strbtn+'↦" id=lineTrimFoot tip="Line.1 Foot Trim" />'
						]
					).join(''),


					DCtv('editTextBox hidden',[
						gM('Sort')+': '+gM('By')+
							XML.wrapE('label', strradio0+'name=txtsortby value=char checked tip=Char />'+gM('Char'))+
							XML.wrapE('label', strradio0+'name=txtsortby value=len tip="Char Length" />'+gM('Length'))+
							XML.wrapE('label', strradio0+'name=txtsortby value=num tip="Number Value" />'+gM('Number Value')),

						strbtn+'↑" id=lineSortUp tip=AscendingSort />'+
						strbtn+'↓" id=lineSortDown tip=DescendingSort />'+
						strbtn+'?" id=lineSortRandom tip=RandomSort />',
						
						gM('Reverse')+
						strbtn+'↕" id=reverseLine tip="Reverse Line.1" />'+
						strbtn+'↔" id=reversePerLine tip="Reverse Per Line.1" />'
						]
					).join(''),



					DCtv('editTextBox hidden',[
					

						gM('With')+Arrf(function(x){return SCtv('hotk" data-v="'+x, gM({Comma:',',Semicolon:';'}[x]||x)) },
							ZLR('Comma Semicolon Space Tab')).join(' ')+br+
							strtxt+'id=replaceWithChar />',

						strbtn+gM('Replace')+'" id=Replace />'+Arrf(function(x){return SCtv('hotk" data-v="'+x, gM({Comma:',',Semicolon:';'}[x]||x)) },
							ZLR('Comma Semicolon Space Tab')).join(' ')+br+
							strtxt+'id=replaceByChar />',

						
						XML.wrapE('label',strchkbx0+'id=replaceCaseSensitive />'+gM('Case Sensitive'))+
						XML.wrapE('label',strchkbx0+'id=replaceRegexp />'+gM('Regexp'))

						]
					).join(''),



					DCtv('editTextBox hidden',[
						gM('Clone')+': ',
						XML.wrapE('label',gM('Line.1')+' / '+gM('Selection')+strchkbx0+'id=RepeatSelection />'),

						Arrf(function(x){return strbtn+'×'+x+'" tip=Repeat id=Repeat'+x+' />'},ZLR('2 3 5 7 11')).join('')
						]
					).join(''),
				].join(''))+


				DCtv('onbox" hidden id="rand',[
					DCtv('randBox',[
						
						gM('Range')+': '+num(1,1)+'~'+num(100)+br+
							strbtn+gM('Random Positive Integer')+'" id=randInt tip="Random Positive Integer" />'+gM('Quantity')+': '+num(10),

						gM('Range')+': '+num()+'~'+num(1)+br+
							strbtn+gM('Random Decimal')+'" id=randDeci tip="Random Decimal" />'+gM('Quantity')+': '+num(10),

						
						gM('Digit')+': '+num(10)+'~'+num(30)+br+
							strbtn+gM('Random Big Integer')+'" id=randBigInt tip="Random Big Integer" />'+gM('Quantity')+': '+num(10),

						]
					).join(''),


					DCtv('randBox hidden',[
						
						gM('From')+num(5)+gM('Choose')+num(2)+br+
						strbtn+gM('Random Combination Index')+'" id=randCombinIndex tip="Random Combination Index" />'+gM('Quantity')+': '+num(5),

						gM('From')+strtxt+'value="a,b,c,d,e" />'+br+
						strbtn+gM('Random Choose')+'" id=randCombin tip="Random Combination" />'+num(2)+' '+gM('Quantity')+': '+num(5),

						strbtn+gM('Random Permutation')+'" id=randPermut tip="Random Permutation" />',
						]
					).join(''),


					DCtv('randBox hidden',[
						XML.wrapE('label',gM('Arithmetic / Geometric')+strchkbx0+'id=randSequenceType />')+
							gM('Step.1')+': '+num(2),

						gM('Start From.1')+num(3),

						strbtn+gM('Sequence')+'" id=randSequence tip="Sequence" />'+gM('Quantity')+': '+num(5),

					
						]
					).join(''),


					DCtv('randBox hidden',[
					
						XML.wrapE('label','HEX / RGBA'+strchkbx0+'id=randColorType />'),
						strbtn+gM('Random Color')+'" id=randColor tip="Random Color" />'+
							gM('Quantity')+': '+num(5),
						]
					).join(''),

				].join(''))+

				DCtv('onbox" id="ITextLaTeXBox',
					DCtv('TextLaTeXBox" id="iTextLaTeXBox',
						DCtv('iTextLaTeX" hidden id="isbs')+
						DCtv('iTextLaTeX" hidden id="ifuncs')+
						DCtv('iTextLaTeX" hidden id="istruc')
					)+

					DCtv('TextLaTeXBox" id="TextLaTeXBox',
						DCtv('TextLaTeX" hidden id="sbs')+
						DCtv('TextLaTeX" hidden id="funcs')+
						DCtv('TextLaTeX" hidden id="struc')
					)+
					DCtv('clear')
				)
			)+

			

			
			'<div id=input0Tip hidden>'+
			'<select id=input0TipType>'+optgrp(gM('API Help')+':',
			OptGrps(jSon('[{"'+
				gM('Math Object')+
				'":"Number Sequence Permutation Matrix Proposition Series Function Set Relation"},{"'+
				

				gM('Data')+' | '+gM('Script')+
				'":"YAML JavaScript"},{"'+
				
				gM('Translator')+
				'":"I18N EN"},{"'+

				gM('Math Formula')+
				'":"LaTeX"},{"'+
				gM('Webpage Editor')+
				'":"Markdown HTML"},{"'+
				gM('Graphics')+
				'":"Canvas SVG Echarts Zdog Lego Rough"},{"'+
				gM('Show')+
				'":"Slide VR AR"}]'
				),1
			)
			)+'</select>'+
			dc+
			DCtv('clear')+

		dc+


		'<div hidden id=Cond>'+
			'<div id=input1Preview>'+dc+
			'<textarea id=input1></textarea>'+
			DCtv('opac" id="input1Tool',
				'<div>'+itvc('hidden" id="cClear')+dc
			)+
			'<div id=input1Tip>'+dc+
			DCtv('clear')+
		dc+

		'<div id=iTextPreview>'+
			'<span id=previewTool hidden class=opac>'+


				/*
				itvc('rotate90" id="previewOff')+
				itv('" id=displayOverCanvas tip="copy2Canvas','exit_to_app')+
*/

				'<select id=output0Type>'+optgrp(gM('Output Format')+':', Options(ZLR('HTML Ascii_Math Unicode_Math Presentation_MathML')))+'</select>'+

				itv('" id=downloadPreview tip="Download HTML File','file_download')+


				itv('" id=alignPreview tip="Center Align','format_align_center')+



				itv('" id=toggleHTMLEditor tip="Toggle HTML Editor','chrome_reader_mode')+
				SCtv('imgHTMLEditor',
					itv('" id=zoomHTMLEditor tip="Zoom Image','loupe')+
					itv('" id=rotateHTMLEditor tip="Rotate Image','rotate_90_degrees_ccw')+
					itv('" id=invertHTMLEditor tip="Invert Image Color','invert_colors')+
					itv('" id=removeHTMLEditor tip="Remove Image','remove_circle_outline')
				)+

				itv('" id=editorLaunch tip="Launch','launch')+
			sc+

		dc+

	dc

)+

(ishome || isedi?DCtv('pd2" id="iTextOpt',

(ishome?itvc('oClear rotate270" id="oHClear'):'')+

itv('tool seled" tip=Preview id="preview','remove_red_eye')+

(ishome?itv('seled" id=iTextFold tip="Snippet Editor','edit'):'')+


itv('tool" tip="More Snippet" id="Snippetson','subject')+
itv('" id=input0Toolon tip="Toggle Editor Tool','functions')+
itv('seled" id=input0Tipon tip="API Help','help_outline')+

itv('tool" tip=Shift id="Shift','keyboard_capslock')+

(ishome?itv('" id=go tip="Run" hotkey="Ctrl + Enter','play_circle_outline')+
	itv('" id=refresh tip="Refresh','refresh')+
	itv('" id=launch tip="Launch','launch')+
	itv('" id=qrcode tip="Share','share')+
	itv('" id=zMatherOn2 tip="Collapse','keyboard_arrow_up'):'')


):''));
	sbsTbl();//
	$('#input0Tool input,#preview').not('.Clear,[tip]').attr('tip',function(){return this.id});


	$('#input0Tip').attr('title',gM('Help')+' | '+gM('Example')).on('click','button',function(){

		var me=$(this), t=me.attr('data-tool'),i0=$('#input0'),pa=me.parents('.inputTip'), tl=pa.attr('data-tool');
		if(tl=='Matrix' && t=='line Merge'){
			i0.val(function(i,x){return '['+Arrf(function(s){
					var isfsi=/=\s*[^0]/.test(s), a=s, b=isfsi?exp2coe(s,'='):'';
					if(/x\d/i.test(s)){
						var deg=+max(s.match(/x\d/ig).join(',').replace(/x/ig,'').split(','));
						a=Arrf(function(x){return exp2coe(s,'x'+deg)}, seqA(1,deg)).join(' ')
					}else if(/.+[xyz].+[xyz]/i.test(s)){
						a=[exp2coe(s,'x','yz'),exp2coe(s,'y','xz'),exp2coe(s,'z','xy')].join(' ')
					}else{
						a=s
					}
					return (a+' '+b).trim()
				
				},x.replace(/\t/g,' ').trim().split(brn)).join(';')+']'});
		}
		
	}).on('click','i',function(){

		var me=$(this), pa=me.parents('.inputTip');
		if(me.is('.remove')){
			pa.remove();
		}

	});

	$('body').on('click', '.sbsTbl td, .sbsTbl .td',function(e){

		var p=$('#input0Type').val();
		if(/Canvas|JavaScript|HTML|3D/.test(p)){
			p='JavaScript';
		}
		sbsTbltd(this,e,'input'+$('#input1.seled').length,p);

	}).on('click', '.sbsTblPg',function(e){
		var me=$(this),pa=me.parent(),pc=pa.children(), i=me.index(),
		x=pc.filter('div:visible'), di=x.attr('data-i'),
		ii=pc.filter('[data-i="'+di+'"]'),
		d0=ii.first().index(), d1=ii.last().index(),
		i0=x.first().index(), i1=x.last().index();
		x.hide();

		if(i){

			if(d1>i1){

				pc.slice(i1+1, Math.min(d1+1,i1+4)).show();
			}else{
				pc.slice(d0, Math.min(d1+1,d0+3)).show();
			}
		}else{

			if(d0<i0){

				pc.slice(Math.max(d0,i0-3), i0).show();
			}else{
				pc.slice(Math.max(d0,d1-2), d1+1).show();
			}

		}
		
	}).on('click', '.snippetName',function(){

		var me=$(this),pa=me.parent(), t=pa.attr('data-type'), i=pa.index()+1;
		if(me.nextAll('.snippetNew').length<1){

			me.next().after(itv('snippetNew','add'));
		}
		pa.addClass('seled').siblings().removeClass('seled').find('.snippetNew').remove();

		$('#input0Type').val(Meleo[t]||t);//.change();
		$('#input0').val(L['snippet'+i]);

	}).on('change keyup mouseup', '.snippetName',function(){

		var me=$(this), t=me.text().trim(), pa=me.parent();
		var i=pa.index()+1;
		L['snippetName'+i]=t;

	}).on('click', '.snippetSend',function(){

		$('#input0').change();
		var v=L['snippet'+($(this).parent().index()+1)],
			ta='#'+L.tool+'Ground .ground1 .editorText';
		if(v.trim()){
			textareaAdd(v,ta);
			$(ta).change();
		}

	}).on('click', '.snippetNew',function(){

		var me=$(this),pa=me.parent();

		pa.removeClass('seled').after(snippet.Str(me.prevAll('.snippetName').text(),
			pa.attr('data-type'),1));
		var i=$('.snippet').length;
		L.snippets=i;

		me.remove();
		snippet.Save();

	}).on('click','#snippetDel',function(){

		if($('.snippet').length>1){
			snippet.Del();
			var i=$('.snippet.seled').index()+1;
			$('.snippet.seled').remove();
			snippet.load(i>$('.snippet').length?1:i);
		}

	}).on('click','#input0Size',function(){
		var me=$(this), a=+me.attr('data-size')||0.6,i=me.attr('data-sizeup')||'true';
		
		if(a>=2){
			i='false'
		}
		if(a<=0.6){
			i='true'
		}
		var b=(a+(i=='false'?-1:1)*0.2).toFixed(2);
		me.attr({'data-sizeup':i, 'data-size':b});
		$('#input0').css('font-size',b+'rem');

	}).on('mouseover', '#TextLaTeXBox .sbsTbl td, #TextLaTeXBox .sbsTbl .td',function(e){

		var me=$(this),t=me.attr('title'),iT=$('#input0Type').val();
		if(iT!='LaTeX' || !t && me.parents('#sbs').length || me.is('.Sts.td') && !/^\$.+\$/.test(t)){

		}else{
			var id=me.parents('.iTextLaTeX').attr('id')||'';
			id && toolTip(gM(id.replace(/^i/,'')+'ontip'));
		}

	}).on('click','.eg', function(e){

		var me=$(this),t=me.attr('data-eg'),shft=e.shiftKey || $('#Shift').is('.seled'),
			i1=me.parents('.inputTip').parent().attr('id'),
			isjs=me.is('.js'), isnode=me.is('.node'),
			tbt=me.parents('#TextBoxTool').length, fxTXT=me.parents('#fxTXT').length;
		if(isjs){
			t+=';\n'
		}else if(isnode){
			t=XML.wrapE(t)
		}else{
			t=t.replace(/&&(?! )/g,brn)
		}
		if(!(i1 || tbt || fxTXT)){
			copy2clipboard(t)
			return
		}

		var is2=me.is('.eg2'),
			i=fxTXT?'fxTxt':(tbt?'TextBox':'input'+i1.replace(/\D/g,''));
		i=$('#'+i);
		var iv=i.val();

		if(is2){
			var td=$('#sbsTbl td').filter(function(){return $(this).text()==t}).eq(0);
			if(td.length){
				i.click();
				td.click();
				return
			}else if(!isjs){
				if(/\.\d/.test(t)){
					t=t.replace(/\.(\d+)/,'[$1]')	//这里要确认.何时需要替换为[]?
				}
				

			}
		}else if(i1 && iv && !shft){
			
		}else{
			i.val(t);
			if(!tbt && $('#preview.seled').length){
				preDisplay()
			}
			return
		
		}
		
		var sS=i[0].selectionStart, sE=i[0].selectionEnd;
		i.val(iv.substr(0,sS)+t+(sE==iv.length?'':iv.substr(sE)));
		var s2=sS+t.length;
		//i.focus();
		i[0].selectionStart=s2;
		i[0].selectionEnd=s2;
		
		if(!tbt && $('#preview.seled').length){
			preDisplay()
		}


	}).on('click','#swap',function(){

		$('.Symboli td:visible:not(:has(.symboli_)).seled').click();
		$('.Symboli td.seled:visible').click();
		var id=($('.iTextLaTeXon .tool.seled').attr('id')||'').replace(/on/,''), shifton=$('#Shift').is('.seled');
		if(id=='editText'){
			var tr=$('#editText .editTextBox'),
			i=tr.filter(':visible').index();
		}else if(id=='rand'){
			var tr=$('#rand .randBox'),
			i=tr.filter(':visible').index();
		}else{
			var tr=$('#i'+id+' .sbsiTbl tr').not('.Symboli_'),
			i=tr.filter(':visible').eq(0).prevAll().not('.Symboli_').length;
		}

		var tn=tr.hide().length;
		if(shifton){
			if(i-3<0){
				i=tn-3
			}else if(i-3==0){
				i=0
			}else{
				i-=3;
			}


		}else{
			if(i+3>tn-1){
				i=0
			}else if(i+3==tn-1){
				i=tn-1
			}else{
				i+=3;
			}

		}

		tr.slice(i,i+3).show();
		


		
	}).on('click','#SVGLinkMode,#displayMode',function(e){
		var me=$(this).toggleClass('seled');
		preDisplay();

	}).on('dblclick','#input0Preview',function(e){
		var m=$(this).find('svg'), shft=e.shiftKey||$('#Shift').is('.seled'), ctrl=e.ctrlKey;
		if(m.length){
			copy2clipboard(m[0].outerHTML)
		}


	}).on('click','#toggleHTMLEditor',function(e){
		var me=$(this).toggleClass('seled');
		$('#HTMLEditor,.imgHTMLEditor').toggle(me.is('.seled'))

	}).on('click','#HTMLEditor img',function(e){
		$('#toggleHTMLEditor.seled').click()

	}).on('click','#alignPreview',function(e){
		var me=$(this),a=me.attr('data-align')||'left', A=ZLR('left center right'),
			b=A[(A.indexOf(a)+1)%3];
		me.attr('data-align',b);
		$('#input0Preview>.katex-display>.katex').css('text-align',b)

	}).on('click','#linebreak',function(e){
		var p=$('#input0Type').val(), shifton=$('#Shift').is('.seled'), t=p=='LaTeX'?(shifton?kbr2:kbr):(p=='HTML'?br:'\n');
		$('#input0').val(function(i,v){return Arrf(function(x){return x.lastIndexOf(t)==x.length-t.length?x:x+t},v.split(brn)).join(brn)+brn}).change();

	}).on('click','#linebreakEqual',function(e){
		var p=$('#input0Type').val(), shifton=$('#Shift').is('.seled'), t=p=='LaTeX'?(shifton?kbr2:kbr):(p=='HTML'?br:'\n');
		$('#input0').val(function(i,v){return Arrf(function(x,i){return (i && x[0]!='='?'=':'')+(x.lastIndexOf(t)==x.length-t.length?x:x+t)},v.split(brn)).join(brn)+brn}).change();

	}).on('click','#zoomHTMLEditor',function(e){
		$('#HTMLEditor img').css('zoom',function(i,v){var x=+v||1, me=$(this),z=me.attr('data-zooming')||'out';
			if(x<=0.2 || x==1 && z=='in'){
				z='in';
			}
			if(x>=1.2){
				z='out';
			}
	
			var y=(z=='in'?x+0.2:x-0.2).toFixed(2);
			me.attr({'data-zooming':z,'title':gM('Zooming')+' '+y});
			return y
		})
	}).on('click','#invertHTMLEditor',function(e){
		$('#HTMLEditor img').css('filter',function(i,v){var me=$(this),z=+me.attr('data-invert')||0;

			me.attr({'data-invert':1-z});

			return 'invert('+(1-z)+')'
		})

	}).on('click','#rotateHTMLEditor',function(e){
		$('#HTMLEditor img').css('transform',function(i,v){var me=$(this),z=+me.attr('data-rotating')||0,
			x=(z+1)%6, y=x<4?'rotate('+x*90+'deg)':'rotate'+'XY'[x-5]+'(180deg)';
			me.attr({'data-rotating':x, 'title':y});

			return y
		})

	}).on('click','#removeHTMLEditor',function(e){
		$('#HTMLEditor img').remove()
		

	}).on('click','#downloadPreview',function(e){

		var v1=$('#input0Preview').html(), v=$('#input0').val(),
			p=$('#input0Type').val(),tp=p.toLowerCase(), t,hd='',
			nm=gM('zzllrr Mather')+'_'+p+Time.now(), ext='html';
		if(p=='LaTeX'){
			t=csslib.katex+v1

		}else if(p=='Markdown'){
			t=csslib.katex+csslib.markdown+v1

		}else if(/Echarts/.test(p)){
			t=jslib[tp]+jslib[tp+'_eval'](v)

		}else if(/Zdog|Canvas/.test(p)){
			t=(jslib[tp]||'')+jslib['canvas_eval'](v)

		}else if(/Slide/.test(p)){
			hd=csslib['katex']+csslib['webslides']+jslib[tp];
			t='<main role="main"><article id="webslides"'+
				($('#slideSwapV').prop('checked')?' class="vertical"':'')+'>'+
				v1+'</article></main>';
			var sh=$('#slidehead').val(),sf=$('#slidefoot').val();
			if(sh){
				t='<header role="banner">'+sh+
					'</header>'+t
			}
			if(sf){
				t+='<footer role="contentinfo">'+sf+
				'</footer>'
			}

		}else if(/VR/.test(p)){
			t=jslib['aframe']+v1;
			$('.VRTool .jslib:checked').each(function(){
				var x=$(this).attr('data-lib');
				hd+=referf(unpkg(x,(VRlibjs[x]||x)+'.min'))
			});
			if(hd){
				hd=XML.wrapE('head',hd)
			}

		}else if(/AR/.test(p)){
			t=jslib['aframe']+jslib['aframe-ar']+v1;
			$('.ARTool .jslib:checked').each(function(){
				var x=$(this).attr('data-lib');
				hd+=referf(unpkg(x,(ARlibjs[x]||x)+'.min'))
			});
			if(hd){
				hd=XML.wrapE('head',hd)
			}
		}else if(p=='SVG'){
			//t=v1;
			t=svgAs('#input0Preview svg');
			ext='svg'
			
		}else if(p=='JavaScript'){
			t=v1;

		}else {
			t=v1
		}

		if(ext=='html'){
			t='<html>'+(hd||'')+'<body>'+t+'</body><html>'

		}
		saveText(t,nm+'.'+ext);
		


	}).on('click','.editTextBox .hotk',function(){
		var me=$(this), T=me.nextAll(':text').eq(0);
		if(T.length<1){
			T=me.parent().next().find(':text').eq(0);
		}
		T.val(function(i,v){
			var o={'Comma':',', 'Semicolon':';', 'Space':' ', 'Tab':'\t'};
			return v+o[me.attr('data-v')]
		});

	}).on('click','#lineSplit',function(){

		var t=$('#input0Type').val(), by=$('#lineByChar').val(), isreg=/^\/.+\/[gi]?$/.test(by);
		
		$('#input0').val(function(i,v){return v.replace(new RegExp(isreg?by.substr(1).replace(/\/[gi]?$/,''):regReg(by), isreg?by.replace(/.+\//,''):'g'),brn)});
		/*
		if(t=='LaTeX'){
			$('#input0').val(function(i,v){return v.replace(/(\\\\)*\n/g,'\\\\\n')});
			if($('#preview.seled').length){
				preDisplay()
			}
		}else if(t=='graphic'){
			$('#input0').val(function(i,v){return v.replace(/&&/g,brn)});
		}else{
			
		}
		*/
				
	}).on('click','#lineMerge',function(){

		var t=$('#input0Type').val(), by=$('#lineByChar').val();
		$('#input0').val(function(i,v){return v.replace(/\n+/g,by)});
		/*
		if(t=='LaTeX'){
			$('#input0').val(function(i,v){return v.replace(/\n+/g,'').replace(/\\\\/g,'')});
			if($('#preview.seled').length){
				preDisplay()
			}
		}else if(t=='graphic'){
			$('#input0').val(function(i,v){return v.replace(/\n+/g,'&&')});
		}else{
			$('#input0').val(function(i,v){return v.replace(/\n+/g,'')});
		}
		*/

	}).on('click','#lineUnique',function(){

		var v=$('#input0').val(),vA=v.split(brn),n=vA.length, B=[], C=[], caseOn=$('#Shift').is('.seled');//是否区分大小写
		if(caseOn){
			for(var i=0;i<n;i++){
				var t=vA[i];
				if(B.indexOf(t)<0){
					B.push(t)
				}
			}
		}else{
			var uA=v.toLowerCase().split(brn);
			for(var i=0;i<n;i++){
				var t=uA[i];
				if(C.indexOf(t)<0){
					C.push(t);
					B.push(vA[i]);
				}
			}
		}
		$('#input0').val(B.join(brn));

	}).on('click',zlr('#lineTrim',' Head Foot',',')+',#blankLineTrim',function(){

		var T=$('#input0'),v=T.val(),vA=v.split(brn), id=this.id;

		if(id=='lineTrim'){
			T.val(v.replace(/\s*\n\s*/g,brn).trim())
		}
		if(id=='lineTrimHead'){
			T.val(v.replace(/\n\s*/g,brn).trim())
		}
		if(id=='lineTrimFoot'){
			T.val(v.replace(/\s*\n/g,brn).trim())
		}
		if(id=='blankLineTrim'){
			T.val(v.replace(/\n+/g,brn).replace(/^\n/g,'').replace(/\n$/g,''))
		}

	}).on('click','#Replace',function(){
		var T=$('#input0'),v=T.val(),
		t0=$('#replaceByChar').val(), t1=$('#replaceWithChar').val(),
		isreg=$('#replaceRegexp').prop('checked'),
		iscase=$('#replaceCaseSensitive').prop('checked');
//console.log(isreg?t0:regReg(t0), t1);
		T.val(v.replace(new RegExp(isreg?t0:regReg(t0), 'g'+(iscase?'':'i')), t1))


	}).on('click','#lineSortUp,#lineSortDown,#lineSortRandom',function(){

		var v=$('#input0').val(),vA=v.split(brn), B=[], C=[], tp=this.id.substr(8), by=$('[name=txtsortby]:checked').val();
		if(tp=='Random'){
			vA.sort(sortBy.random)
		}else{
			if(by=='len'){
				vA.sort(sortBy.lenchr)
			}else if(by=='char'){
				vA.sort()
			}else if(by=='num'){
				vA.sort(sortBy.num)
			}

			if(tp=='Down'){
				vA.reverse()
			}
		}

		$('#input0').val(vA.join(brn));


	}).on('click','#reverseLine,#reversePerLine',function(){
		var v=$('#input0').val(),vA=v.split(brn); 
		if(this.id=='reverseLine'){
			vA.reverse()
		}else{
			vA=Arrf(function(x){return x.split('').reverse().join('')}, vA)
		}

		$('#input0').val(vA.join(brn));

	}).on('click',zlr('#Repeat','2 3 5 7 11',','),function(){
		
		var sel=$('#RepeatSelection').prop('checked'), i=$('#input0'), iv=i.val(), caseOn=$('#Shift').is('.seled'), n=+this.id.substr(6)+(+caseOn);//是否新增n次（而不是n-1次）
		if(sel){
			var sS=i[0].selectionStart, sE=i[0].selectionEnd, t=iv.substring(sS, sE);
			i.val(iv.substr(0,sS)+t.repeat(n)+(sE==iv.length?'':iv.substr(sE)));
			var s2=sS+t.length*n;
			//i.focus();
			setTimeout(function(){
				i[0].selectionStart=sS;
				i[0].selectionEnd=s2;
			},200);


		}else{
			i.val(iv.replace(/[^\n]+(\n|$)/g,function(x){return x.repeat(n)}));

		}

	}).on('click','#rand :button',function(e){
		var me=$(this),id=this.id, pa=me.parent(), pap=pa.prev(),
		q=+me.nextAll(':number').eq(0).val()||1,q2=+me.nextAll(':number').eq(1).val()||1,
		prop=me.prevAll(':checkbox').first(),
		num1=me.prevAll(':number').first(),
		txt=me.prevAll(':text').first(),
		i=$('#input0'), iv=i.val(),t='', shifton=$('#Shift').is('.seled');

		if(prop.length<1){
			prop=pap.find(':checkbox').last();
			if(prop.length<1){
				prop=pap.prev().find(':checkbox').last();
				
			}
		}
		if(num1.length<1){
			num1=pap.find(':number').last();
			if(num1.length<1){
				num1=pap.prev().find(':number').last();
				
			}
		}
		var num0=num1.prevAll(':number').first();
		if(num0.length<1){
			num0=num1.parent().prev().find(':number').last();
			
		}

		if(txt.length<1){
			txt=pap.find(':text').last();
			
		}

		txt=txt.val();


		prop=prop.prop('checked');
		num0=+num0.val();
		num1=+num1.val();

		

		if(id=='randInt'){
			t=Arrf(function(){return Random(num1-num0+1)+num0-1},seqA(1,q)).join(',')
		}else if(id=='randDeci'){
			t=Arrf(function(){return Random(num1-num0)+num0-1+Math.random()},seqA(1,q)).join(',')
		}else if(id=='randBigInt'){
			t=Arrf(function(){return Random(9)+Arrf(function(){return Random(10)-1}, 
				seqA(1,Random(num1-num0+1)+num0-1)).join('')},seqA(1,q)).join(',')
		}else if(id=='randCombinIndex'){
			t=Arrf(function(){return jSoff(RandomCombinN(num0,num1))},seqA(1,q)).join(',')
		}else if(id=='randCombin'){
			t=Arrf(function(){return jSoff(RandomCombinA(txt.split(','),q))},seqA(1,q2)).join(',')
		}else if(id=='randPermut'){
			t=Arrf(function(){return jSoff(RandomCombinA(txt.split(','),txt.split(',').length))},seqA(1,num1)).join(',')
		}else if(id=='randSequence'){
			t=jSoff(seqA(num1,q,prop?'geo':'',num0))
		}else if(id=='randColor'){
			if(prop){
				t=Arrf(function(){return RandomColor()},seqA(1,q)).join(',')
			}else{
				t=Arrf(function(){return hex2rgba(RandomColor())},seqA(1,q)).join(',')
			}
		}

		if(shifton){
			i.val('');
			iv='';
		}

		var sS=i[0].selectionStart, sE=i[0].selectionEnd;
		i.val(iv.substr(0,sS)+t+(sE==iv.length?'':iv.substr(sE)));
		var s2=sS+t.length;
		//i.focus();
		i[0].selectionStart=s2;
		i[0].selectionEnd=s2;

	}).on('click','#DownloadSnippetFile',function(e){

		var k=e.keyCode, shft=e.shiftKey||$('#Shift').is('.seled'), ctrl=e.ctrlKey,
			v0=$('#input0').val(),v1=$('#input0Preview').html(),
			tp0=$('#input0Type').val().toLowerCase(),
			tp=$('#output0Type').val().toLowerCase(),
			ismd=/markdown/.test(tp0), isjs=/js/.test(tp0), ishtml=/html/.test(tp0), issvg=/svg/.test(tp0),isxml=/xml/.test(tp0), ismathml=/mathml/.test(tp0);

		if(ishtml){
			v0=csslib.katex+v0;
		}
		if(ismathml){
			//v0='<math xmlns="'+xmlns+'" xmlns:xlink="'+xmlnsxlink'">'+v0+'</math>';
			v0='<math xmlns="'+xmml+'">'+v0+'</math>';
		}
		if(isxml){
			v0=XML.head+v0;
		}

		if(issvg){
			v0=svgAs('#input0Preview svg');
		}
		saveText(v0,
			gM('zzllrr Mather')+Time.now()+'.'+ZLR('md js html svg xml mathml txt')[[ismd,isjs,ishtml,issvg,isxml,ismathml,true].indexOf(true)]
		)

	}).on('click','#input0',function(){//.on('mouseover', function(){this.focus()})

		$('#input1').removeClass('seled');
		$(this).addClass('seled');
	
			
	}).on('change keyup mouseover','#input0',function(){//mouseout 

		var v=$(this).val(),p=$('#input0Type').val(), vt=v.trim();
		var s=$('.snippet.seled'), i=s.index()+1, l0=(L['snippet'+i]||'').trim();
		L['snippet'+i]=v;
		
		if(l0!=vt && $('#preview').is('.seled') && vt){

			preDisplay();
		}

	}).on('drop', '#input0', function (e) {
		e.stopPropagation(); e.preventDefault(); $(this).removeClass('drop');

		var f = e.originalEvent.dataTransfer.files[0];
		if (!f || f.type.indexOf('image') < 0) { return }
		//console.log(f); File {webkitRelativePath: "", lastModifiedDate: xxx, name: "VIP.png", type: "image/png", size: 10628}

		var reader = new FileReader(), shft=e.shiftKey || $('#Shift').is('.seled');
		reader.onload = function (event) {
			var src = this.result;
			//console.log(this);
			var sne = picSrcNameExt(src), img0='<img src="'+src+'" />';
			if(shft){
				$('#HTMLEditor').append(img0);
			}else{
				$('#HTMLEditor').html(img0)
			}
			var qr = new QrcodeDecoder();

			sTo(function(){
				qr.decodeFromImage($('#HTMLEditor img').last()[0]).then((res) => {
					//console.log(res);
					if(res){

						var u=res.data;
						if(/^https?:.+/.test(u)){
							$('#input0').val(function(i,v){return v+brn+u});
	
						}else if(/\.html/.test(u)){
							window.open(u)
		
						}else if(u.length<100){
							$('#input0').val(function(i,v){return v+brn+u});
						}


					}
	
				});
			},500);


			$('#toggleHTMLEditor').not('.seled').click();
			$('#preview').not('.seled').click();
		};
		reader.readAsDataURL(f);

	}).on('paste', '#input0', function (e) {
		//console.log(e);
		var ts = e.originalEvent.clipboardData.items, shft=e.shiftKey || $('#Shift').is('.seled');


		if (ts.length) {
			for (var i = 0; i < ts.length; i++) {
				if (ts[i].kind == 'file') {
	

					var blob = ts[i].getAsFile(), reader = new FileReader();
					//console.log(ts[i]);  DataTransferItem {type: "image/png", kind: "file"}
					reader.onload = function (event) {
						//console.log(event);
						var src = event.target.result; //webkitURL.createObjectURL(blob);


						var sne = picSrcNameExt(src), img0='<img src="'+src+'" />';
						if(shft){
							$('#HTMLEditor').append(img0);
						}else{
							$('#HTMLEditor').html(img0)
						}
						var qr = new QrcodeDecoder();

						sTo(function(){
							qr.decodeFromImage($('#HTMLEditor img').last()[0]).then((res) => {
								//console.log(res);
								if(res){

									var u=res.data;
									if(/^https?:.+/.test(u)){
										$('#input0').val(function(i,v){return v+brn+u});
				
									}else if(/\.html/.test(u)){
										window.open(u)
					
									}else if(u.length<100){
										$('#input0').val(function(i,v){return v+brn+u});
									}


								}
				
							});
						},500);

						$('#toggleHTMLEditor').not('.seled').click();
						$('#preview').not('.seled').click();
						/*
						var img = new Image();
						img.onerror = function(){
							$(this).remove()
						};
						img.onload = function () {
							var w = this.width;
							var h = this.height;
						
		
						};
						img.src = src;
						*/

					};
					reader.readAsDataURL(blob);
					break;
				}
			}
		}




	}).on('click','#input1',function(){

		$('#input0').removeClass('seled');
		$(this).addClass('seled');


	}).on('change','#input0TipType', function(){

		var v=$(this).val()||'JavaScript', it=$('#input0Tip > [data-tool="'+v+'"]'), tv=tooltip[v];
		if(v=='Echarts'){
			tv=tooltip.graphic['Statistics/Echarts']
		}
		if(v=='I18N' || v=='EN'){
			tv=v;
		}
		var opti=$(this).find('option[value='+v+']').parent().index(),
		width=Math.max($('#input0').width(),$('#input0Tool').width())||200,
		height=Math.max($('#input0').height(),$('#input0Tool').height(),400),
		strc='class="inputTip inputTypeTip" style="max-height:'+height+'px" data-tool="';

		if(tv){
			if(!opti){
				tv+=tooltip[v+' Operation']||''
			}
			if(tv=='I18N'){
				tv='';
				$.each(i18n,function(i,j){
					tv+=sceg2(i)+' → '+sceg2(j)+br
				});
			}
			if(tv=='EN'){
				tv='';
				$.each(i18n,function(i,j){
					tv+=sceg2(j)+' → '+sceg2(i)+br
				});
			}

			if(v=='LaTeX'){
				tv+=br;
				$.each(SBS.Latex,function(i,j){
					if(!/func/.test(i)){
						tv+=sceg2(i)+' : '+sceg2('\\'+j+' ')+br
					}
				});
			}



			$('#input0Tip').append(detail((v!='LaTeX'&&v!='JavaScript'?gM(v):v)+itv('remove" tip="Remove','remove_circle'),tv,'',strc+v+'"'));

		}
		

	}).on('change','#input0Type', function(){
	
		var v=$(this).val()||'TXT', it=$('#input0Tip > [data-tool="'+v+'"]'), tv=tooltip[v];
		if(v=='Echarts'){
			tv=tooltip.graphic['Statistics/Echarts']
		}
		if(v=='I18N' || v=='EN'){
			tv=v;
		}

		var ii=ZLR(Mele).indexOf(v),i=$('.snippet.seled').index()+1, p=ii>-1?ZLR(Meles)[ii]:v;
		//console.log(v,p);
		L['snippetType'+i]=p;

		$('.snippet.seled').attr('data-type',p);
		var i=ZLR('LaTeX Ascii_Math Unicode_Math Presentation_MathML Content_MathML').indexOf(v);
		$('#output0Type').html(optgrp(gM('Output Format')+':', Options(set.opr1('取',ZLR('HTML Ascii_Math Unicode_Math LaTeX Presentation_MathML Content_MathML SVG'),
			i<0?[[0]]:[[0,2,4,6],[0,2,3,4,5], [0,1,3,4,5], [0,2,3,5], [0,2,3,4]][i])
		)));
		$('.inputTypeTip').remove();

		var opti=$(this).find('option[value='+v+']').parent().index(),
			width=Math.max($('#input0').width(),$('#input0Tool').width())||200,
			height=Math.max($('#input0').height(),$('#input0Tool').height(),400),
			strc='class="inputTip inputTypeTip" style="max-height:'+height+'px" data-tool="';

		if(tv && it.length<1){

			if(tv=='I18N'){
				tv='';
				$.each(i18n,function(i,j){
					tv+=sceg2(i)+' → '+sceg2(j)+br
				});
			}
			if(tv=='EN'){
				tv='';
				$.each(i18n,function(i,j){
					tv+=sceg2(j)+' → '+sceg2(i)+br
				});
			}

			if(v=='LaTeX'){
				tv+=br;
				$.each(SBS.Latex,function(i,j){
					if(!/func/.test(i)){
						tv+=sceg2(i)+' : '+sceg2('\\'+j+' ')+br
					}
				});
			}



			$('#input0Tip').prepend(detail(v+itv('remove" tip="Remove','remove_circle'),tv,'',strc+v+'"'));


			$('.inputTip.inputTypeTip').last().prevAll().remove();

		}
		
		if($('#preview.seled').length){
			preDisplay()
		}

	}).on('change','#output0Type', function(){
		var me=$(this), v=me.val(), isSVG=v=='SVG';
		if($('#preview.seled').length){
			preDisplay()
		}
		if(isSVG && $('#displayMode').length<1){
			me.after(
				itv('" id=displayMode tip="Display / Inline','wrap_text')+
				itv('seled" id=SVGLinkMode tip="SVG Link','link')
			)
		}
		$('#displayMode,#SVGLinkMode').toggle($(this).val()=='SVG')
	
	}).on('click','#send2textBox',function(){

		var v=$('#input0').val();
		if(v.trim()){
			textareaAdd(v,'#'+L.tool+'Ground .ground1 .editorText')
		}

	}).on('click','.Mele', function(){
		var t=$(this).text(),o=Meleo[t]||t;
		if(!/HTML|Slide/i.test(t)){
			textareaAdd(XML.wrapE(t),'#showGround .editorText',1,t.length+3);
		}
		if($('#input0Type option[value="'+o+'"]').length && $('#input0Type').val()!=o){
			var s=$('.snippet[data-type="'+t+'"]');
			if(s.length){
				s.eq(0).find('.snippetName').click();
			}else if($('#input0').val()==''){
				$('#input0Type').val(o).change();
			}
			

			$('#iTextFold').not('.seled').click();
		}

	}).on('click','#UploadSnippetFile',function(){

		$('#inputSnippetFile').click()

	}).on('change','#inputSnippetFile',function(){
		var v=$(this).val();
		if(v){
			var files=this.files, fl=files.length, l=+L.snippets||1;
			for(var i=0;i<fl;i++){
				var f=files[i], s=f.size, ext=f.type.replace(/(text|application)[/]/,''), m=f.name;

//console.log(f,m,s,ext);
				ext=ext.toUpperCase();
				if(ZLR(Mele+' '+Mele2).indexOf(ext)>-1){
					ext=ZLR(Meles)[ZLR(Mele).indexOf(ZLR(Mele2).indexOf(ext)>-1?Meleo[ext]:ext)]
				}
				if(!ext){
					ext='TXT';
				}
/*
					if(!s){s='?KB'}else{
						s=sizeKB(s)
					}
*/
					var reader=new FileReader();
					reader.onload = function(e){
						//var txt = this.result;
						var txt=e.target.result;

						L['snippet'+(l+1)]=txt;
						
						L['snippetName'+(l+1)]=m;

						L['snippetType'+(l+1)]=ext;
						L.snippets=l+1;
						snippet.load(l+1);
					};
					//reader.readAsDataURL(f);
					reader.readAsText(f);

			}
		}


	}).on('click','#iClear',function(){

		if($('#input0').val()==''){
			$('#preview.seled').click();
		}else{
			$('#input0').val('');
			$('#input0Preview').empty().removeAttr('style');
		}

	}).on('click','#iClear2',function(){

		$('#input2').val('');

	}).on('click','#cClear',function(){

		$('#input1').val('');

	}).on('click','#tClear,#tClear2',function(){

		var t=$('.iTextLaTeXon .seled');
		if(t.length){
			t.click();
		}else if($('#input0Tip > .inputTip').length>1){
			$('#input0Tip > .inputTip').last().prevAll().remove()
		}else{
			$('#input0Tip > .inputTip').remove();
		}

	}).on('click','#iTextFold',function(){
	
		var me=$(this), sel=me.toggleClass('seled').is('.seled');
		$('#preview,#input0Toolon,#Snippetson,#Shift').toggle(sel);
		if(sel){
			$('#iTextMain').show();

			if($('#preview').is('.seled')){
				$('#previewTool').show();
			}

		}else{
			$('#preview.seled').click();
			$('#iTextPreview').prevAll().hide();

		}

	}).on('click','#input0Toolon',function(){
		var me=$(this), sel=me.toggleClass('seled').is('.seled');
		$('#input0Tool').toggle(sel);

	}).on('click','#input0Tipon',function(){
		var me=$(this), sel=me.toggleClass('seled').is('.seled');
		$('#input0Tip').toggle(sel);

		if(sel && $('#input0Tip .inputTip').length<1){
			$('#input0TipType').val($('#input0Type').val()).change();

		}

	}).on('click','#displayOverCanvas',function(){
		
		OverCanvas($('#input0').val());



	}).on('click','.tool', function(e){

		var me=$(this).toggleClass('seled'),id=me.attr('id'),se=me.is('.seled'), nm=me.attr('name');

		if(nm){
			me.siblings('.seled.tool[name='+nm+']').removeClass('seled')
		}
		if(me.is('.radio')){
			se=1;
			me.addClass('seled');
		}

		if(/on/.test(id)){
			var Id=id.replace(/on$/,'');
			$('#i'+Id+',#'+Id).toggle(se);
			

			if(id=='Condon'){
				$('#input1').val('');
				$('#cClear').toggle();

			}else if(/sbs|funcs|struc|editText|rand/.test(id)){

				me.siblings('.seled.tool').removeClass('seled').each(function(){
					var tid=this.id.replace(/on$/,'');
					$('#struc > .sbsTbl').children().hide();
					$('#i'+tid+',#'+tid).hide();

				});
				$('#swap').remove();
				if(se){
					if(!me.next().is('#swap')){
						me.after(itv('" tip=Swap id="swap','swap_vert'));
					}
			
				}
				if(/struc/.test(id)){
					$('#istruc .Sts.seled').click();
					$('#struc .sbsTbl > *').hide();
				}

			}

		}


		if(id=='preview'){
			var v=$('#input0').val().trim();
			if(se){// && v
				preDisplay();
			}else{

				$('#input0Preview, #previewTool').hide();

			}

			$('.inputTip').removeAttr('open');
		}


	}).on('click','#editorLaunch',function(){

		window.open('editor.html'+(ishome?'?type='+$('#input0Type').val()+'&t='+fn0($('#input0').val()):''))

	}).on('click','.oClear',function(){
		
	//	bodyFocus();
		
		if($(this).is('#oHClear')){
			if($('#oHTML').html()==''){
				if($('#capsimg+div').next().length){
					$('#noteEraser').click();
				}else{
					$('#clear').click();
				}
			}else{
				$('#oHTML').empty();
			}
			$('#menu > i.toggle').click();

		}else{
			
			$('#oHTML').empty();
		}

		$('#zMatherOn:contains(down)').click();


	}).on('click','#zMatherOn2',function(){

		$('#zMatherOn:contains(up)').click();
		$('#panel').show()

	}).on('keydown',function(e){

		var k=e.keyCode, shft=e.shiftKey || $('#Shift').is('.seled'), ctrl=e.ctrlKey, alt=e.altKey, act=document.activeElement, 
		node=act.tagName.toLowerCase(), me=$(act),id=me.attr('id')||'';
//console.log(k,node);

		if(node=='textarea'){

			var iv=me.val(), sS=act.selectionStart, sE=act.selectionEnd,
			A=[iv.substr(0,sS),iv.substring(sS,sE),iv.substr(sE)],t=sS, iT=$('#input0Type').val();
			if(k==9 && !alt){
			
				//consolelog(A);
				if(shft){
					A[1]=A[1].replace(/^\t/,'').replace(/\n\t/g,brn);
				}else{
					A[1]='\t'+A[1].replace(/\n/g,'\n\t');
					t++;
				}
				me.val(A.join(''));
				act.selectionStart=t;
				act.selectionEnd=t;
				return false
			}
			
			//consolelog(k);
			if(ctrl && iT=='Markdown' && id=='input0' && [73,66,85,81,75].indexOf(k)>-1){
				//consolelog(sS,iv,sE);
				if(k==73){
					if(sS==sE){
						A[1]='**';
					}else{
						A[1]='*'+A[1]+'*'
					}
					t++
				}
				if(k==66){
					if(sS==sE){
						A[1]='** **'
					}else{
						A[1]='**'+A[1]+'**'
					}
					t+=2
				}
				if(k==85){
					if(sS==sE){
						A[1]='__ __'
					}else{
						A[1]='__'+A[1]+'__'
					}
					t+=2;
					
				}
				if(k==81){
					if(sS==sE){
						A[1]='\n> '
					}else{
						A[1]='\n> '+A[1]
					}
					t+=3
				}
				
				if(k==75){
					if(sS==sE){
						A[1]='[](http:// '+gM('Title')+')';
						t++;
					}else{
						A[1]='['+A[1]+'](http:// '+gM('Title')+')'
						t+=10+A[1].length;
					}
				}
				
				me.val(A.join(''));
				act.selectionStart=t;
				act.selectionEnd=t;
				
				if(k==85){
					return false
				}

			}
			
			
		}

		if(/^(input|textarea)$/.test(node)){
			if(ctrl){
				if(k==13){
					if(/^input[01]/.test(id)){
						$('#go').click();
					}
					if(id=='TextBox'){
						$('#TextBoxGo').click();
					}
				}
				if(k==83){//s

					return false
				}
			}
			if(shft){
				if(k==13){
					//$('#preview').click();
				}	
			}
		}

		if(alt){
			if(k==50 || k==98){
				var t=getSelection().toString();
				if(t){saveText(t, gM('zzllrr Mather')+'_'+Time.now()+'.txt')}
			}
		}

	

	});
	

	$('#input0Type').val(Meleo[L.snippetType1]||L.snippetType1).change();
	sTo(function(){$('#input0Tipon').click()},300);
});
/*
 * zzllrr lib
 * Copyright by zzllrr. All rights reserved.
 * zzllrr@gmail
 * Released under MIT License
 */

var L=localStorage,sch=location.search, H = 'http://', Hs = 'https://', w3c = 'www.w3.org/', xmlns = H + w3c + '2000/svg', xhtml = H + w3c + '1999/xhtml', xmlnsxlink = H + w3c + '1999/xlink', xmml = H + w3c + '1998/Math/MathML',
	logon = false, isMobile=/Mobile/.test(navigator.userAgent), i18n = typeof lang == 'undefined' ? '' : lang[H_o().lang || L.lang || 'zh_cn'] || '', loch=location.href,losh={}, ishome=/index\.html|mather\/$|^\/$/.test(location.pathname), 
	isdoodle=/doodle\.html/.test(loch), 
	isdoc=/document\.html/.test(loch),
	iswiki=/wiki\.html/.test(loch),
	issolve=/solve\.html/.test(loch),
	isedi=/editor\.html/.test(loch),
	Mele='LaTeX Ascii_Math Unicode_Math Content_MathML Presentation_MathML SVG Canvas Echarts Markdown YAML I18N EN JavaScript 3D 2D Zdog Lego Rough',
	Meles='LA AM UM CM PM SV CV EC MD YM I18 EN JS D3 D2 ZD LG RF',
	Mele2='LT LX LTX TEX IL YML',
	Meleo={'IL':'Inline LaTeX','LX':'LaTeX','TEX':'LaTeX','YML':'YAML'};
	
if (typeof BigInt == 'undefined') {
	var BigInt = function (x) { return +x }
}
var uri = '^(blob|file|ftp|https?):.+', uriRe = new RegExp(uri, 'i'), dataRe = /^data:.+[/].+;.+/,
	imgPreReg = '(blob|data|file|ftp|https?):.+',
	imgPre = new RegExp(imgPreReg, 'gi'), imgPreRe = new RegExp('^' + imgPreReg, 'gi'),

	hanziCoreRe = /[\u4E00-\u9FA5\uFF00-\uFFFF]/g, hanziRe = /[^\x00-\xff]/g,//含中文标点	注意使用test时，正则有全局g时，需重置hanziRe.lastIndex=0
	enPunc = /[,\.\?!\/\-_:;'"\(\)\[\]\{\}]/g, enPhrase = /^[a-z]+ [a-z ]+$/i,
	hanziPunc = /[，。？！—：；‘’“”（）【】]/g,
	punc = /[,\.\?!\/\-_:;'"\(\)\[\]\{\}，。？！—：；‘’“”（）【】]/g,
	fontReData = /^data.+font[/].{40,}/i, imgPreReData = /^data.+image\/.{40,}/gi, txtPreReData = /^data.+text\/plain/gi,
	fontHan = '{"windows":{"宋体":"SimSun","黑体":"SimHei","微软雅黑":"Microsoft Yahei","微软正黑体":"Microsoft JhengHei","楷体":"KaiTi","新宋体":"NSimSun","仿宋":"FangSong"},"OS X":{"苹方":"PingFang SC","$黑体":"STHeiti","$楷体":"STKaiti","$宋体":"STSong","$仿宋":"STFangsong","$中宋":"STZhongsong","$琥珀":"STHupo","$新魏":"STXinwei","$隶书":"STLiti","$行楷":"STXingkai","冬青黑体简":"Hiragino Sans GB","兰亭黑-简":"Lantinghei SC","翩翩体-简":"Hanzipen SC","手札体-简":"Hannotate SC","宋体-简":"Songti SC","娃娃体-简":"Wawati SC","魏碑-简":"Weibei SC","行楷-简":"Xingkai SC","雅痞-简":"Yapi SC","圆体-简":"Yuanti SC"},"office":{"幼圆":"YouYuan","隶书":"LiSu","$细黑":"STXihei","$楷体":"STKaiti","$宋体":"STSong","$仿宋":"STFangsong","$中宋":"STZhongsong","$彩云":"STCaiyun","$琥珀":"STHupo","$新魏":"STXinwei","$隶书":"STLiti","$行楷":"STXingkai","@舒体":"FZShuTi","@姚体":"FZYaoti"},"open":{"思源黑体":"Source Han Sans CN","思源宋体":"Source Han Serif SC","文泉驿微米黑":"WenQuanYi Micro Hei"},"hanyi":{"!旗黑":"HYQihei 40S","!旗黑":"HYQihei 50S","!旗黑":"HYQihei 60S","!大宋简":"HYDaSongJ","!楷体":"HYKaiti","!家书简":"HYJiaShuJ","!PP体简":"HYPPTiJ","!乐喵体简":"HYLeMiaoTi","!小麦体":"HYXiaoMaiTiJ","!程行体":"HYChengXingJ","!黑荔枝":"HYHeiLiZhiTiJ","!雅酷黑W":"HYYaKuHeiW","!大黑简":"HYDaHeiJ","!尚魏手书W":"HYShangWeiShouShuW"},"fangzheng":{"@粗雅宋#":"FZYaSongS-B-GB","@报宋#":"FZBaoSong-Z04S","@粗圆#":"FZCuYuan-M03S","@大标宋#":"FZDaBiaoSong-B06S","@大黑#":"FZDaHei-B02S","@仿宋#":"FZFangSong-Z02S","@黑体#":"FZHei-B01S","@琥珀#":"FZHuPo-M04S","@楷体#":"FZKai-Z03S","@隶变#":"FZLiBian-S02S","@隶书#":"FZLiShu-S01S","@美黑#":"FZMeiHei-M07S","@书宋#":"FZShuSong-Z01S","@舒体#":"FZShuTi-S05S","@水柱#":"FZShuiZhu-M08S","@宋黑#":"FZSongHei-B07S","@宋三#":"FZSong","@魏碑#":"FZWeiBei-S03S","@细等线#":"FZXiDengXian-Z06S","@细黑一#":"FZXiHei I-Z08S","@细圆#":"FZXiYuan-M01S","@小标宋#":"FZXiaoBiaoSong-B05S","@行楷#":"FZXingKai-S04S","@姚体#":"FZYaoTi-M06S","@中等线#":"FZZhongDengXian-Z07S","@准圆#":"FZZhunYuan-M02S","@综艺#":"FZZongYi-M05S","@彩云#":"FZCaiYun-M09S","@隶二#":"FZLiShu II-S06S","@康体#":"FZKangTi-S07S","@超粗黑#":"FZChaoCuHei-M10S","@新报宋#":"FZNew BaoSong-Z12S","@新舒体#":"FZNew ShuTi-S08S","@黄草#":"FZHuangCao-S09S","@少儿#":"FZShaoEr-M11S","@稚艺#":"FZZhiYi-M12S","@细珊瑚#":"FZXiShanHu-M13S","@粗宋#":"FZCuSong-B09S","@平和#":"FZPingHe-S11S","@华隶#":"FZHuaLi-M14S","@瘦金书#":"FZShouJinShu-S10S","@细倩#":"FZXiQian-M15S","@中倩#":"FZZhongQian-M16S","@粗倩#":"FZCuQian-M17S","@胖娃#":"FZPangWa-M18S","@宋一#":"FZSongYi-Z13S","@剪纸#":"FZJianZhi-M23S","@流行体#":"FZLiuXingTi-M26S","@祥隶#":"FZXiangLi-S17S","@粗活意#":"FZCuHuoYi-M25S","@胖头鱼#":"FZPangTouYu-M24S","@卡通#":"FZKaTong-M19S","@艺黑#":"FZYiHei-M20S","@水黑#":"FZShuiHei-M21S","@古隶#":"FZGuLi-S12S","@幼线#":"FZYouXian-Z09S","@启体#":"FZQiTi-S14S","@小篆体":"FZXiaoZhuanTi-S13T","@硬笔楷书#":"FZYingBiKaiShu-S15S","@毡笔黑#":"FZZhanBiHei-M22S","@硬笔行书#":"FZYingBiXingShu-S16S"}}'.replace(/!/g, '汉仪').replace(/@/g, '方正').replace(/#/g, '简体').replace(/\$/g, '华文'),

	cssLinkRe = /\.css($|\?.*)/i, fontRe = /\.(eot|[ot]tf|ttc|font?|woff2?)($|#|\?.*)/i,
	cssImgReg = 'url\\([\'"]?[^\\\'"\\)\\s]+[\'"]?\\)', cssImgRe = new RegExp(cssImgReg, 'gi'), textCssImgRe = new RegExp('([\\s:,]|^)' + cssImgReg, 'gi'),

	imgReg = '(avif|bmp|gif|ico|jpeg|jpg|apng|png|svg|webp)',
	hrefImgRe = new RegExp('\\S*\\.' + imgReg + '[\\?\\&]*.*', 'i'), textImgRe = new RegExp('(file|ftp|https?):[/]+[^\'"\\s\\(\\)]*\\.' + imgReg, 'gi'),
	digiReg = /^\d+(\.\d)?$/,
	regReg = function (t) { return t.replace(/[\^\$\*\.\+\-\?\!\(\)\[\]\{\}]/g, '\\$&') },

	ruby=function(s,top,a1){// a1 a2 a3 a4
		return XML.wrapE('ruby',s+XML.wrapE('rt',top||(a1?a1.replace(/.\d/g,function(x){return ['aāáǎà','oōóǒò','eēéěè','iīíǐì','uūúǔù','üǖǘǚǜ']['aoeiuv'.indexOf(x[0])][+x[1]]}):'')))
	},
	sTo=setTimeout,sTi=setInterval,
	oneDay = 24 * 3600 * 1000,
	Engin = {
		bd: function (html, u) {
			var bd = $(XML.wrapE('div', (html || '')));

			bd.find(zlr2('img :image', '[src]', ',')).each(function () {
				var me = $(this), s0 = me.attr('file') || me.attr('data-original') || me.attr('src'), s = H_a(s0, u);
				if (s != s0) { me.attr('src', s) }
			});

			bd.find('form').attr('method', '');
			bd.find(':button, :submit').attr('disabled', 'disabled');
			var ZBD = '#ZBD' + Time.now5() + ' ';
			bd.attr('id', 'ZBD').find('style').html(function (i, v) {
				return ZBD + v.trim().replace(/[\},(\*\/)][\n\s]+/g, '$&' + ZBD).trim();
			});

			bd.find(zlr3('[on', 'click load', ']', ',')).removeAttr(zlr('on', 'click load'));
			bd.find(zlr3('a[href', '^="javascript:" ="#"', ']', ',')).removeAttr('href');
			bd.find('a[href]').not('[href^="#"]').attr('target', '_blank').not(zlr3('[href^=', 'http "mailto:"', ']', ',')).attr('href', function (i, v) { return H_a(v, u) });

			bd.find('object').has('embed[src]').each(function () {
				var em = $(this).find('embed[src]'), src = em.attr('src'), wd = em.attr('width'), ht = em.attr('height');
				$(this).replaceWith('<iframe src="' + src + '" style="width:' + (wd || 500) + 'px;height:' + (ht || 400) + 'px" >');
			});

			return bd;
		},

		bdLoadHtml: function (html, aB) {
			aB.html(html || '');
			return Engin
		}

	}, git=function(x,githubio){
		return Hs+(githubio!==undefined?x+'.github.io/'+githubio:'github.com/'+x)

	}, delivr=function(x,y,type){
		return Hs+'cdn.jsdelivr.net/npm/'+x+'/dist/'+(y||x+'.min')+'.'+(type||'js')

	}, unpkgTmp=Hs+'unpkg.com/@/dist/@.min.js', unpkg=function(x,y,type){
		return Hs+'unpkg.com/'+x+'/dist/'+(y||x+'.min')+'.'+(type||'js')

	}, referf=function(x,y,type){
		return type=='css'?'<link rel="stylesheet" href="' + x+'"'+(y||'')+'>':(
			type=='js'||!type?'<script src="'+x+'"'+(y||'')+'></script>':''
		)
	}, refer=function(A){
		return detail(gM('Reference'),ol(A))

	}, jslib={
		'katex':referf(delivr('katex')),
		'echarts':referf(delivr('echarts'))+referf(unpkg('echarts-gl')),
		// www.npmjs.com/package/echarts
		'echarts_eval':function(t){return '<div id=echarts0 style="width:90%;height:600px">'+
	t+dc+XML.wrapE('script',
`	var d=document.getElementById('echarts0'),dt=d.innerText,o=eval(dt);
	var myChart = echarts.init(d);
	myChart.setOption(o);
`)},
		'd3':referf(unpkg('d3')),

		'function-plot':referf(unpkg('function-plot','function-plot')),

		'zdog':referf(delivr('zdog','.dist.min')),

		'lego':referf(unpkg('legra')),

		'canvas_eval':function(t){return '<div id=js hidden>'+t+dc+
	'<canvas id=cvs width="300" height="300"></canvas>'+
	XML.wrapE('script',
`
	var C=document.getElementById('cvs'),c=C.getContext('2d'),ct=document.getElementById('js').innerText;
	eval(ct);
`)},
		//'aframe':referf(delivr('aframe','aframe-master')),
		//'aframe':referf(unpkg('aframe')),
		//'aframe':referf(Hs+'aframe.io/releases/0.9.2/aframe.min.js'),
		'aframe':referf(Hs+'unpkg.com/aframe'),
		'aframe-ar':referf(unpkg('aframe-ar')),

		'slide':referf(Hs+'unpkg.com/webslides'),

	}, csslib = {
		'katex': referf(delivr('katex','','css'),'',
			//' integrity="sha384-yFRtMMDnQtDRO8rLpMIKrtPCD5jdktao2TV19YiZYWMDkUR5GQZR/NOVTdquEx1j" crossorigin="anonymous"',
			'css'),
		
		'webslides': referf(Hs+'unpkg.com/webslides/static/css/webslides.css','','css')+
			referf(Hs+'unpkg.com/webslides/static/css/svg-icons.css','','css'),

		'markdown': XML.wrapE('style', `
blockquote{
    padding:0 10px;
    border-left: solid 6px #ff5400;
    margin-left: 0px;
    background-color: rgba(242,97,9,.1);
    border-radius: 10px;
}

code, pre{
    background: rgba(0,0,0,0.1);
    border-radius: 5px;
    padding:2px
}


body:not(.night) .bds{
	border: solid black 1px;
}

body:not(.night) .bdr{
	border-right: solid black 1px;
}

body:not(.night) .bdl{
	border-left: solid black 1px;
}

body:not(.night) .bdt{
	border-top: solid black 1px;
}

body:not(.night) .bdb{
	border-bottom: solid black 1px;
}

.night .bds{
	border: solid gainsboro 1px;
}

.night .bdr{
	border-right: solid gainsboro 1px;
}

.night .bdl{
	border-left: solid gainsboro 1px;
}

.night .bdt{
	border-top: solid gainsboro 1px;
}

.night .bdb{
	border-top: solid gainsboro 1px;
}

.collapse{border-collapse: collapse}
.pd10{
	padding:10px
}
.mg10{
	margin:10px
}
.mg20{
	margin:20px
}

.hidden{
	display:none
}
	`),
	};


$.expr[':'].bottom = function (obj) { return $(obj).css('position') == 'fixed' && $(obj).css('bottom') == '0px' };
$.expr[':'].top = function (obj) { return $(obj).css('position') == 'fixed' && $(obj).css('top') == '0px' };
$.expr[':'].left = function (obj) { return $(obj).css('position') == 'fixed' && $(obj).css('left') == '0px' };
$.expr[':'].right = function (obj) { return $(obj).css('position') == 'fixed' && $(obj).css('right') == '0px' };

$.expr[':'].fixed = function (obj) { return $(obj).length ? $(obj).css('position') == 'fixed' : false };
$.expr[':'].abs = function (obj) { return $(obj).css('position') == 'absolute' };

$.expr[':'].encoded = function (obj) { return /:?encoded/i.test($(obj)[0].localName) };
$.expr[':'].number = function (obj) { return $(obj).attr('type') == 'number' };
$.expr[':'].range = function (obj) { return $(obj).attr('type') == 'range' };
$.expr[':'].color = function (obj) { return $(obj).attr('type') == 'color' };
$.expr[':'].date = function (obj) { return $(obj).attr('type') == 'date' };
$.expr[':'].time = function (obj) { return $(obj).attr('type') == 'time' };

$.expr[':'].search = function (obj) { return $(obj).attr('type') == 'search' };
$.expr[':'].commentRss = function (obj) { return /commentRss/i.test($(obj)[0].localName) };
$.expr[':'].creator = function (obj) { return $(obj)[0].localName == 'creator' };

$.fn.extend({
	twinkle: function () {
		return $(this).fadeTo('slow', 0).fadeTo('slow', 1);
	}
});

function consolelog() {
	if (logon) {
		console.log.apply(null, arguments)
	}
}
function GM(txt,fromLang,toLang) {
	var l0=fromLang||H_o().lang || L.lang || 'zh_cn', l1=toLang||'en';
	//分词. 多源词.0 .1 .2 
	if(isArr(txt)){
		return Arrf(function (i) { return GM(i, l0, l1) }, txt) 
	}
	var A=split(txt,/\.\d*/g), f=function(x){
		var t='',xA=x.split('.'), y=x[0],yi=+x[1]||0, xi=-1;
		$.each(lang[l0],function(i,v){
			if(x==v){
				xi++;
				t=i;
				if(xi==yi){
					return false
				}
			}
		});
		//if(l1!='en'){
			return gM(t,'',lang[l1])
		//}
		//return t
	};
	if(isArr(A)){
		if(A[1].length==2 && A[1][1]==''){
			return f(A[1][0])||A[1][0]
		}
		//console.log(concat(A[1],A[0].concat('')));
		//return Arrf(f,concat(A[1],A[0].concat(''))).join(/zh/.test(toLang)?'':' ')
		return Arrf(function(x){return GM(x,l0,l1)},concat(A[1],A[0].concat(''))).join(/zh/.test(toLang)?'':' ')
	}else{
		if(/ /.test(txt)){
			return Arrf(f, txt.split(' ')).join(/zh/.test(toLang)?'':' ')

		}else{
			return f(txt)||txt
		}

	}

}
function gM(mesg, str, o) {
	if (isArr(mesg)) { return Arrf(function (i) { return gM(i, str, o) }, mesg) }
	
	var msg = '' + mesg, m0=msg[0] || '', m1=(msg || '').substr(1),
		M = m0 + m1, M_=m0.toUpperCase()+m1, O = o || i18n, x = O ? O[msg] || O[M] || O[M_] || '' : '';
	try {
		if (!x && chrome && chrome.i18n) {
			x = chrome.i18n.getMessage(msg, str)
		}

	} catch (e) {


	}
	var iscn=O['Anti']=='反', front=msg.replace(/ [^ ]+$/,''), fronted=front+'ed', fronting=front+'ing';
	if(!x && /\.\d+$/.test(msg) && O[msg.replace(/\..+/,'')]){// 多义字
		//console.log(msg);
		return O[msg.replace(/\..+/,'')].split(';')[+msg.replace(/.+\./,'')]
	}
	if( /;/.test(x)){
		return x.split(';')[0]
	}


	if(!x && msg.split(' ').length==3 && (O[front] || O[fronted] || O[fronting])){
		return (O[front] || O[fronted] || O[fronting])+(iscn?'':' ')+gM(msg.replace(/.+ /,''))
	}


	
	if(iscn && !x && / of /.test(msg)){
		return msg.replace(/(.+) of (.+)/, function(t){var A=t.split(' of '); return gM(A[1]) + gM(A[0])})
	}

	if (!x && /[a-z]+2[a-z]/i.test(msg)) {
		x = gM(msg.replace(/2/g, ' to '), str, o)
	}

	if (!x && /[a-z]+[A-Z][a-z]*$/.test(msg)) {
		x = gM(msg.replace(/([a-z])([A-Z])/g, '$1 $2'), str, o)
	}
	if (!x && / & /.test(msg)) {
		x = Arrf(function (t) { return gM(t, str, o) }, msg.split(' & ')).join(' & ');
		hanziRe.lastIndex = 0;
		if (hanziRe.test(x)) {
			x = x.replace(/ & /g, '与')
		}
	}
	if (!x && /[^ ]&[^ ]/.test(msg)) {
		x = Arrf(function (t) { return gM(t, str, o) }, msg.split('&')).join('&');
	}

	if (!x && / /.test(msg)) {
		if (msg == ' ') {
			return ''
		}
		var msg0 = msg.replace(/ .+/, ''), msg1 = msg.replace(/[^ ]+ /, '');
		if (O[msg1]) {
			x = gM(msg0, str, o) + ' ' + gM(msg1, str, o)
		} else {
			x = Arrf(function (t) { return gM(t, str, o) }, msg.split(' ')).join(' ');
		}
		hanziRe.lastIndex = 0;
		if (hanziRe.test(x)) {
			x = x.replace(/. ./g, function (x) { return /[a-z] [a-z]/i.test(x) ? x : x.replace(/ /g, '') })
		}
	}
	if (!x && /[-]/.test(msg)) {
		x = Arrf(function (t) { return gM(t, str, o) }, msg.split(/[-]/)).join('-');
		hanziRe.lastIndex = 0;
		if (hanziRe.test(x)) {
			x = x.replace(/[-](\D)/g, '$1')
		}
	}

	if (!x && /[–]/.test(msg)) {
		x = Arrf(function (t) { return gM(t, str, o) }, msg.split(/[–]/)).join('–');
	}

	if (!x && /\./.test(msg)) {// .无需翻译

		return msg.split('.')[0]
	}


	
	if(!x && iscn){
		//无需翻译的后缀
		if (/[sd]$/.test(msg)) {
			var t=msg.replace(/.$/,''), ot=O[t];

			if(ot){
				return ot
			}
		}

		if (/'s$/.test(msg)) {
			var t=msg.replace(/.{2}$/,'.1'), t2=msg.replace(/.{2}$/,''), ot=O[t] || O[t2];

			if(ot){
				return ot
			}
			return t2
		}
		if (/[sz]'$/.test(msg)) {
			var t=msg.replace(/.$/,'.1'), t2=msg.replace(/.$/,''), ot=O[t] || O[t2];

			if(ot){
				return ot
			}
			return t2
		}


		if (/([e]s|ly|ed)$/.test(msg)) {
			var t=msg.replace(/.{2}$/,''), ot=O[t];

			if(ot){
				return ot
			}
		}
		

		if (/cy$/.test(msg)) {
			var t=msg.replace(/.{2}$/,''), ot=O[t] || O[t+'t'] || O[t+'te'];

			if(ot){
				return ot+'度'
			}
		}

		if (/ic$/.test(msg)) {
			var t=msg.replace(/.{2}$/,''), ot=O[t] || O[t+'e'] || O[t+'y'];

			if(ot){
				return ot
			}
		}

		if (/(ive|ity)$/.test(msg)) {
			var t=msg.replace(/.{3}$/,''), ot=O[t] || O[t+'e'];

			if(ot){
				return ot
			}
		}

		if (/ie[sd]$/.test(msg)) {
			
			var t=msg.replace(/ies$/,'y'), ot=O[t];
			if(ot){
				return ot
			}

		}

		if (/(al)$/.test(msg)) {
			var t=msg.replace(/.{2}$/,''), ot=O[t];

			if(ot){
				return ot
			}

			var t=msg.replace(/ical$/,'y'), ot=O[t];

			if(ot){
				return ot
			}

		}

		if (/ing$/.test(msg)) {
			
			var t=msg.replace(/ing$/,''), ot=O[t];
			if(ot){
				return ot
			}

			t+='e';ot=O[t];
			if(ot){
				return ot
			}

			t=msg.replace(/ying$/,'')+'ie'; ot=O[t];
			if(ot){
				return ot
			}

			t=msg.replace(/(.)\1ing$/,'$1'); ot=O[t];
			if(ot){
				return ot
			}
		}

		if (/ion$/.test(msg)) {
			
			var t=msg.replace(/ion$/,''), ot=O[t];
			if(ot){
				return ot
			}
			t+='e';ot=O[t];
			if(ot){
				return ot
			}

			t=msg.replace(/ption$/,'b'); ot=O[t];
			if(ot){
				return ot
			}
		}


		if (/est$/.test(msg)) {
			var t=msg.replace(/.{3}$/,''), ot=O[t] || O[t+'e'];

			if(ot){
				return '最'+ot
			}
		}

		if (/ness$/.test(msg)) {
			var t=msg.replace(/.{4}$/,''), ot=O[t];

			if(ot){
				return ot+'性'
			}
		}

		if (/(ment|atic)$/.test(msg)) {
			var t=msg.replace(/.{4}$/,''), ot=O[t];

			if(ot){
				return ot
			}
		}

		//可拆开翻译的前缀

		if (/^(Pseudo)/i.test(msg)) {// 6字开头
			var t=msg.substr(6).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];
	
			if(ot){
				return gM(msg.substr(0,6), str, o) + ot
			}
				
		}

		
		if (/^(Quasi|Multi|Hyper|Super|Ultra|Arc)/i.test(msg)) {// 5字开头
			var t=msg.replace(/Arc/i,'$&.1').substr(5).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];
	
			if(ot){
				return gM(msg.replace(/Arc/i,'$&.1').substr(0,5), str, o) + ot
			}
		}


		if (/^([SDH]emi|Poly|Anti|Auto)/i.test(msg)) {// 4字开头
			var t=msg.substr(4).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];

			if(ot){
				return gM(msg.substr(0,4), str, o) + ot
			}
				
		}

		if (/^(Su[bp]|Non|Tri|Uni)/i.test(msg)) {// 3字开头
			var t=msg.substr(3).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];
	
			if(ot){
				return gM(msg.substr(0,3), str, o) + ot
			}
				
		}


		if (/^([UI][mn]|Ab)/i.test(msg)) {// 2字开头
			var t=msg.substr(2).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];
	
			if(ot){
				return '不' + ot
			}
				
		}
		if (/^(Bi)/i.test(msg)) {// 2字开头
			var t=msg.substr(2).replace(/./,function(x){return x.toUpperCase()}), ot=O[t];
	
			if(ot){
				return gM(msg.substr(0,2), str, o) + ot
			}
				
		}






	}




	return x || M
}

function gM2(t,reverse, sep,f){
	var s=gM(t), ft=f?f(t):t;
	return s==t?s:(reverse?s+(sep?sep+t:' ('+t+')'):ft+(sep?sep+s:' ('+s+')'))

}

function cacheUsage(){
	var x=0;
	for(let item in L) {
		if(L.hasOwnProperty(item)) {
		 	x += L.getItem(item).length;
		}
	}
	return [sizeKB(x),x]
}
function fMatrixPly(A, B) {
	var n = A.length, m = 1, C = new Array(n);
	if (B[0] instanceof Array) { m = B[0].length }
	for (var i = 0; i < n; i++) {
		C[i] = new Array(m);
		for (var j = 0; j < m; j++) {
			var s = 0;
			for (var k = 0; k < n; k++) {
				s += A[i][k] * (m < 2 ? B[k] : B[k][j]);
			}
			C[i][j] = s;
		}
	}
	return C;
}
function fMatrix(fltr, a0) {
	var MA = new Array(5), a = a0, CA = [.2126, .7152, .0722];
	for (var i = 0; i < 5; i++) {
		MA[i] = new Array(5);
		for (var j = 0; j < 5; j++) {
			MA[i][j] = j == i ? 1 : 0;
		}
	}

	if (fltr == 'hue') { a = a % 360 }

	if (fltr == 'opa' && a != 1) {
		MA[3][3] = a;
	}
	if (fltr == 'contra' && a != 1) {
		for (var i = 0; i < 3; i++) {
			MA[i][i] = a;
			MA[i][4] = Math.round((1 - a) * 25500 / 2) / 100;
		}
	}
	if (fltr == 'bright' && a != 1) {
		for (var i = 0; i < 3; i++) {
			MA[i][i] = a;
		}
	}
	if (fltr == 'sat' && a != 1) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				MA[i][j] = Math.round(((j == i ? a : 0) + CA[j] * (1 - a)) * 100) / 100;
			}
		}
	}
	if (fltr == 'gray' && a) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				MA[i][j] = Math.round(((j == i ? 1 - a : 0) + a / 3) * 100) / 100;
			}
		}
	}
	if (fltr == 'sepia' && a) {
		CA = [[.393, .769, .189], [.349, .686, .168], [.272, .534, .131]];
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				MA[i][j] = Math.round(((j == i ? 1 - a : 0) + CA[i][j] * a) * 100) / 100;
			}
		}
	}
	if (fltr == 'inv' && a) {
		for (var i = 0; i < 3; i++) {
			MA[i][i] = 1 - a * 2;
			MA[i][4] = Math.round(a * 25500) / 100;
		}
	}
	if (fltr == 'hue' && a) {
		var S = Math.sin(Math.PI * a / 180), C = Math.cos(Math.PI * a / 180);
		/*
		A0=[C0*(1-hueS)+(1-C0)*hueC, C1*(1-hueC-hueS), C2*(1-hueC)+(1-C2)*hueS];
		A1=[C0*(1-hueC)+ 0.143*hueS, C1+(1-C1)*hueC+ 0.14*hueS, C2*(1-hueC)- 0.283*hueS];
		A2=[C0*(1-hueC)-(1-C0)*hueS, C1*(1-hueC+hueS), C2*(1+hueS)+(1-C2)*hueC];
CA=[.2126, .7152, .0722]
		// C0=.213, C1=.715, C2=.0722
		A0=[C0*(1-hueC-hueS)+hueC, C1*(1-hueC-hueS), C2*(1-hueC-hueS)+hueS];
		A1=[C0*(1-hueC)+ 0.143*hueS, C1*(1-hueC)+hueC+ 0.14*hueS, C2*(1-hueC)- 0.283*hueS];
		A2=[C0*(1-hueC+hueS)-hueS, C1*(1-hueC+hueS), C2*(1-hueC+hueS)+hueC];

		A0=[C0*(1-C-S)+C, C1*(1-C-S), C2*(1-C-S)+S];
		A1=[C0*(1-C)+ 0.143*S, C1*(1-C)+C+ 0.14*S, C2*(1-C)- 0.283*S];
		A2=[C0*(1-C+S)-S, C1*(1-C+S), C2*(1-C+S)+C];

		A0=[C0*(1-C-S)    +C,       C1*(1-C-S),            C2*(1-C-S)     +S];
		A1=[C0*(1-C)      +0.143*S, C1*(1-C)   +C+ 0.14*S, C2*(1-C)       -0.283*S];
		A2=[C0*(1-C+S)    -S,       C1*(1-C+S),            C2*(1-C+S)     +C];

*/
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				MA[i][j] = Math.round(((j == i ? C : 0) + CA[j] * (1 - C + S * (i - 1)) + S * [.143, .14, -.283, -1, 0, 1][i == 2 ? j : (i * j == 0 && i + j == 2 ? 3 + j : 4)]) * 100) / 100;
			}
		}

	}
	if (fltr == 'blur') {

	}
	return MA;
}

var H5Colors = 'aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,blanchedalmond,blue,blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta,darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkslategrey,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick,floralwhite,forestgreen,fuchsia,gainsboro,ghostwhite,gold,goldenrod,gray,green,greenyellow,grey,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,lightgrey,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,lightyellow,lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue,purple,red,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,silver,skyblue,slateblue,slategray,slategrey,snow,springgreen,steelblue,tan,teal,thistle,tomato,turquoise,violet,wheat,white,whitesmoke,yellow,yellowgreen';
function H5Color(neg, pos) {
	var A = H5Colors.replace(/[^,]*grey[^,]*,/g, '').replace(/,(cyan|magenta),/g, ',');
	if (neg) {
		var B = neg.split(',');
		for (var i = 0; i < B.length; i++) {
			A = A.replace(new RegExp('[^,]*' + B[i] + '[^,]*', 'g'), '');
		}
	}
	A = A.replace(/,{2,}/g, ',').replace(/^,|,$/g, ',').split(',');
	if (pos) {
		var B = pos.split(','), C = [];
		for (var j = 0; j < A.length; j++) {
			var b = false;
			for (var i = 0; i < B.length; i++) {
				if (A[j].indexOf(B[i]) > -1) {
					b = true;
					break
				}
			}
			if (b) {
				C.push(A[j])
			}
		}
		A = C.slice();
	}
	return A
}
var ZRL = 'aphanomkkjgledipighdfjnilhfenpam', ZRC = 'jobnmmcljcfepgnecadofbjdklkibgei', ZIG = 'gfjhimhkjmipphnaminnnnjpnlneeplk', ZIL = 'bedbigoemkinkepgmcmgnapjcahnedmn', ZAin1 = 'alhfmphdglcigimlmnkemofpdhfaloep', ZIV = 'minhgcmabmapnkcoddbbeclkmpnandhp', webStore = Hs + 'chrome.google.com/webstore/detail/', CN = '', isCN = false, isCNzh = false;

if (gM('@@ui_locale').slice(0, 2) == 'zh') { isCN = true; isCNzh = gM('@@ui_locale') == 'zh_CN'; CN = '?hl=zh_cn' }
var HOM = {
	'ZIG': webStore + ZIG + CN,
	'ZIL': webStore + ZIL + CN,
	'ZIB': Hs + 'blog.sina.com.cn/zzllrrimager',
	'ZIV': webStore + ZIV + CN,
	'ZRL': webStore + ZRL + CN,
	'ZRC': webStore + ZRC + CN,
	'ZAin1': webStore + ZAin1 + CN,
	'Z': webStore.replace('detail', 'search') + 'zzllrr',
	'ZQR': Hs + 'site.douban.com/127068/',
	'ZIGPic': Hs + 'img3.douban.com/view/photo/photo/public/p1376698902.jpg',
	'ZRPic': Hs + 'img5.douban.com/view/photo/photo/public/p1990186399.jpg',
	'ZMATHER': Hs + 'zzllrr.github.io/mather',
	'ZMATHERcn': H + 'zzllrr.gitee.io/mather/',
	'ZMather': Hs + 'github.com/zzllrr/mather'
};

var strop = '</option><option value=', strradio0 = '<input type=radio ', strchkbx0 = '<input type=checkbox ', strbtn = '<input type=button value="', btnGo = strbtn + 'GO" class=vipurl />',
	num = function (x, min, max) { return '<input type=number value="' + (x||0) + '" min="'+(min||0)+'"' + (max ? ' max="' + max +'"' : '') + ' />' },
	colorbx = function (v) { return '<input type=color value="'+(v||'')+'" />' },
	rng = function (v,min,max) { return '<input type=range value="'+(v||0)+'" min="'+(min||0)+'" max="'+(max||0)+'" />' },
	imgSRC = '<img src="img/', prog = imgSRC + 'loading.gif" width=16 class=prog />', chked = ' checked', seled = ' selected', 
	strtxt='<input type=text ', txtreadonly = function (x,id) { return strtxt+'readonly value="' + fnq(x) + '" id="'+id+'" />' },
	meter = function (i, low, optimum, high) { return '<meter min=0 max=100' + (low || low === 0 ? ' low=' + low : '') + (optimum || optimum === 0 ? ' optimum=' + optimum : '') + (high || high === 0 ? ' high=' + high : '') + ' value=' + i + ' />' },
	bgfrom = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(', bgto = '), to(', grad = function (t) {
		//return '-webkit-gradient(radial, 20 20, 0, 20 20, 50, from(white), to(white), color-stop(.9,'+t+'))'
		return '-webkit-linear-gradient(top, white, ' + t + ' 20%, ' + t + ' 80%, white)'
	},
	fcb = function (c, b, t) { return isArr(t)?Arrf(function(x){return fcb(c,b,x)},t) : '\\fcolorbox{' + c + '}{' + (b || 'transparent') + '}{' + t + '}' },
	txa = function (t, c) { return '<textarea' + (c ? ' class="' + c + '"' : '') + '>' + (t||'') + '</textarea>' },
	SC = '<span class=', sc = '</span>', sC = sc + SC, SCtv = function (t, v) { if(isArr(v)){return Arrf(function(x){return SCtv(t,x)},v)} return SC + '"' + t + '">' + (v || '') + sc },
	itv = function (t, v) { return '<i class="mi' + (t?' '+t:'') + '">' + (v || '') + '</i>' }, itvc=function (c) {return itv('Clear'+(c?' '+c:'')+'" tip="Clear','backspace')},
	spanmi=function(t,v,c){return '<span class="mi-span'+(c?' '+c:'')+'" mi='+t+'>'+v+sc},
	DC = '<div class=', dc = '</div>', dC = dc + DC, DCtv = function (t, v) { if(isArr(v)){return Arrf(function(x){return DCtv(t,x)},v)} return DC + '"' + t + '">' + (v || '') + dc },
	br = '<br/>', hr = '<hr/>', kbr = '\\\\ ', kbr2 = '\\\\ ~ \\\\ ~', brn='\n',
	brA=function(A,js){return (js?$js(A):A).join(br)}, hrA=function(A,js){return (js?$js(A):A).join(hr)},
	kbrA = function (A) { return Arrf(function (x) { return '$' + x + '$' }, A).join(br) },
	khrA = function (A) { return Arrf(function (x) { return '$' + x + '$' }, A).join(hr) },
	i18=function(x){return isArr(x)?Arrf(i18,x):XML.wrapE('i18',x)},	
	I18=function(x,A){return (isArr(x)?x.join('\n'):x)+'\n'+XML.wrapE('i18',isArr(x)?x[0]:x)+(A?'\n'+A.join('\n'):'')},
	fieldset = function (s, v, c) { return '<fieldset' + (c ? ' ' + c : '') + '><legend>' + s + '</legend>' + v + '</fieldset>' },
	fieldseth = function (s, v, c, h) { return '<fieldset class=rem13' + (c ? ' ' + c : '') + '><legend>' + XML.wrapE('h'+(h||3),s) + '</legend>' + v + '</fieldset>' },
	subtabs = function (hA,vA,seli) { if(seli==-1){
		return DCtv('subtabs',DCtv('subtabheads', SCtv('subtabhead',hA).join(''))+DCtv('subtab',vA).join(''))
		}else{var j=seli||0;
		return DCtv('subtabs',DCtv('subtabheads', Arrf(function(x,i){return SCtv('subtabhead'+(i==j?' seled':''),x)},hA).join(''))+Arrf(function(x,i){return DCtv('subtab'+(i==j?'':' hidden'),x)},vA).join(''))
		}
	},
	detail = function (s, v, o, c, cs) { return '<details' + (o ? ' open' : '') + (c ? ' ' + c : '') + '><summary'+(cs?' '+cs:'')+'>' + s + '</summary>' + (v||'') + '</details>' },
	zdetail = function (s, v, notsk, notvk, notEdit, o) {
		return detail(notsk ? s : ksc(s), notvk ? v : kdc(v) + (notEdit ? '' :
			detail(gM('Edit') + strbtn + gM('Default') + '" class="katexv0" />',
				txa(v, 'katexv" data-katex="' + v) + br + strtxt+'class=katexvrule />' + strbtn + gM('Replace') + '" class="katexvreplace" />' + strbtn + 'GO" class="katexvgo" />')), o)
	},
	kdetail = function (s, v, notsk, notvk) { return zdetail(s, v, notsk, notvk, 1) },

	jdetail = function (A, i18nObj, subTool, uri) {
		var f = function (t, subtool) {
			if (isStr(t)) {
				var tool = t.replace(/[…—“][\S\s]+/, ''), ts = t.split('…'),
				title = ts.length > 1 ? ts[1].replace(/[—“].+[\s\S]*/, '') : '',
				tip = (t.split('—')[1] || '').replace(/“.+[\s\S]*/, ''),
				eg = t.split('“')[1] || '';

				var m = /^[-a-z &→]+$/i.test(tool) ? gM(tool) : tool, ft = fnv0(tool);
				return subtool == 'task' ? SCtv('task" data-tool="' + ft
					+ '" title="' + gM(title)
					+ '" data-tip="' + (tip ? gM(tip) : ft)
					+ '" data-uri="'+(uri||'')
					+ '" data-eg="' + eg,
					/^\$.+\$$/.test(m) ? zx(fnv0(m)) : m) : SCtv('level ' + (subtool || '') + '" data-i="' + tool, gM(tool, '', i18nObj))
			}
			if (isArr(t)) {
				return Arrf(function (x) { return f(x, subtool) }, t).join('')
			}
			if (isObj(t)) {
				var y = ''; $.each(t, function (i, v) {
					y += detail(gM(i, '', i18nObj), f(v, subtool), '', 'data-i="' + i + '"')
				}); return y
			}
		}; return Arrf(function (x) { return f(x, subTool) }, A).join('')
	},

	fdetail = function (f, A) {
		return DCtv('fdetail', eval('(function' + f + ')("' + ('' + A[0]).replace(/,/g, '","') + '")') +
			strtxt+'class=katexf data-katexf="' + f + '" placeholder="' + A.join(';') + '" value="' + A[0] + '" />' +
			strbtn + gM('Parameter') + '" class="katexv1" />')
	},
	mark = function (v, t) { return '<mark title="' + (t || 'API') + '">' + v + '</mark>' }, del = function (s) { return XML.wrapE('del', s) },
	href = function (url, text, title) { return '<a href="' + url + '" target="_blank" ' + (title ? 'title="' + title + '" ' : '') + 'rel="noopener noreferrer external">' + (text || url) + '</a>' },
	hrefA= function(u,A,sub){return Arrf(function(X){var x=X.toLowerCase(); return href(Hs+(sub?x+'.'+u:(/@@/.test(u)?u.replace(/@@/g,x):u+'/'+x)),X.replace(/.+#/,''))},A)},
	inhref = function (url, text, title) { return '<a href="' + url + '" ' + (title ? 'title="' + title + '" ' : '') + '>' + (text || url) + '</a>' },
	ol = function (A, c, start) { return '<ol class="alignl ' + (c != null ? c : '') + '"' + (start != null ? ' start=' + start : '') + '>' + Arrf(function (t) { return XML.wrapE('li', t) }, A).join('') + '</ol>' }, kol = function (A, c, start) { return ol(Arrf(function (x) { return x || x === 0 ? '$' + x + '$' : x }, A), c, start) },
	ul = function (A, c) { return '<ul class="alignl ' + (c != null ? c : '') + '">' + Arrf(function (t) { return XML.wrapE('li', t) }, A).join('') + '</ul>' }, kul = function (A, c) { return ul(Arrf(function (x) { return x || x === 0 ? '$' + x + '$' : x }, A), c) },
	dl = function (A, B, c) { return '<dl class="alignl ' + (c != null ? c : '') + '">' + concat(Arrf(function (t) { return XML.wrapE('dt', t) }, A), Arrf(function (t) { return XML.wrapE('dd', t) }, B)).join('') + '</dl>' }, kdl = function (A, B, c) { return dl(Arrf(function (x) { return x || x === 0 ? '$' + x + '$' : x }, A), B, c) },

	$js=function(x,encode){return x instanceof Array ?Arrf(function(t){return $js(t,encode)},x):'$$$'+(encode?x.trim().replace(/\\/g,'\\\\'):x.trim())+'$$$'},
	$A = function (A) { return Arrf(function (x) { return x instanceof Array ? $A(x) : (x || x === 0 ? '$' + x + '$' : '') }, A) },
	tinyA=function(A, size){return A.length==0?[]:Arrf(function(x){return '\\'+ZLR('tiny scriptsize footnotesize small normalsize large Large LARGE huge Huge')[size!==undefined?size:3]+' '+$A(x)},A)},
	encodeLatex = function (t) { return ('' + t).replace(/[\{\}]/g, '\\$&') },
	$B = function (A, esc) { return Arrf(function (x) { return x instanceof Array ? $B(x, esc) : (esc ? encodeLatex(x) : (x || x === 0 ? '{' + x + '}' : '')) }, A) },

	Kx = function (t) { return t.replace(/\${3}[^\$]*\${3}/g, function (x) {var t=x.substr(3, x.length - 6);return t? '㆖'+t+'㆘':''})
		.replace(/\$\$[^\$]+\$\$/g, function (x) { return kdc(x.substr(2, x.length - 4)) })
		.replace(/\$[^\$]+\$/g, function (x) { return ksc(x.substr(1, x.length - 2)) })
		.replace(/㆖[^㆖㆘]+㆘/g, function (x) { return ksc($A(x.substr(1, x.length - 2))) })
	},
	KxA = function (A) { return ksc(A.join(kbr2)) },
	kx = function (t) {
		var s = re(('' + t).replace(/−/g, '-').replace(/​/g, '').replace(/[ ]/g, ' ')
			.replace(/\$[^\x00-\xff][^\$]+\$/g, function (x) {
				var x0=x.replace(/\$/g, ''), x00=x0.split('(')[0], x01=x0.substr(x00.length+1).replace(/\)$ */,''), o0={
					'竖式':'Decimal.oprs',
					'竖式+':'Decimal.oprs',
					'竖式-':'Decimal.oprs',
					'竖式*':'Decimal.oprs',
					'竖式/':'Decimal.oprs',
				},o1={

				};
				if(o0[x00]){
	
					return eval(x0.replace(x00+'(', o0[x00]+"('"+x00+"',"))
				}
				return eval(x0.replace(x00, o1[x00])) 
			})
			.replace(/\$[^\$]+\$/g, function (x) { return eval(x.replace(/\$/g, '')) }))

			//	.replace(/≠/g,'=\\not\\mathrlap{}').replace(/≢/g,'≡\\not\\mathrlap{}')
			// fix latex ≠ bug
			//	.replace(/\\not([^\\ ])/g,function(x){return '$1\\not\\mathrlap{}'})		// fix latex ≠ bug V0.10.0

			.replace(/≢/g, '\\not \\mathrlap{} \\negthickspace \\negthickspace ≡')	// fix latex ≢ bug	V0.10.1				katex bug:	table元素中使用katex，不等号会错位	字体显示≢会丢失 删除线



			//add math function names in katex.js ,"\\arccot","\\arcsec","\\arccsc","\\sech","\\csch","\\sinc","\\si","\\Si","\\ci","\\Ci","\\Shi","\\sgn","\\cis","\\arccis","\\Arg"

			//extension 
			.replace(/\\b (\{[^\{\}]+\})/g,'\\pmb {\\red$1}')	//加粗斜体红色
			.replace(/\\b ([^\{}])/g,'\\pmb {\\red{$1}}')	//加粗斜体红色(单个字)
			.replace(/\\r (\{[^\{\}]+\})/g,'\\textbf \\red $1')	//加粗正体红色
			.replace(/\\r ([^\{}])/g,'\\textbf \\red{$1}')	//加粗正体红色(单个字)
			.replace(/\\d /g,'\\hskip{0.1em}\\text{d}')	//微分d

			.replace(/\\Rt/g,'\\text{Rt△}')	//直角三角形

			.replace(/\\\(/g,'\\left(')
			.replace(/\\\)/g,'\\right)')
			.replace(/\\\[/g,'\\left[')
			.replace(/\\\]/g,'\\right]')


			.replace(/iddots/g,'kern3mu \\raisebox2mu{.}\\kern1mu\\raisebox7mu{.}\\kern1mu\\raisebox13mu{.}\\kern4mu')
		//	.replace(/(inj|proj) ?(lim)/g, 'mathrm{$1~$2}')
			.replace(/FUNC([A-Za-z]+)/g, '\\mathrm{$1}')		//函数字体FUNC* <=> \\mathrm{*}
			.replace(/(\{[^\}]+\}|.) *\\\/ *(\{[^\}]+\}|.)/g, '\\frac{$1}{$2}')				//无嵌套分数形式	a\/b  <=> \frac{a}{b}
			.replace(/(\{[^\}]+\}|.) *\\t\/ *(\{[^\}]+\}|.)/g, '\\tfrac{$1}{$2}')				//无嵌套分数形式	a\t/b  <=> \tfrac{a}{b}
			.replace(/[√∛∜](-?[\d\.]+|\{[^\}]+\})/g, function(x){var i='√∛∜'.indexOf(x[0]);return '\\sqrt'+(i?'['+(i+2)+']':'')+'{'+x.substr(1)+'}'})


		;


		//中文及标点

		if (!/\\text\{.*\}/.test(s)) {
			s = s.replace(/[\u4E00-\u9FA5\uFF00-\uFFFF]+/g, '\\text{$&}')	//[^\x00-\xff]
				.replace(/[，、；。：⋰？！～“”‘’《》【】（）｛｝⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]+/g, '\\text{$&}')
		}
		if (enPhrase.test(s)) {//纯英文字母，且有空格
			return '\\text{' + s + '}'
		}
		/*
		if(!/\\text\{.*\}/.test(s)){
			hanziRe.lastIndex=0;
			if(hanziRe.test(s)){// 汉字
				return s.replace(/[^\x00-\xff]+/g,'\\text{$&}')
				//return '\\text{'+s+'}'
			}
		}
		
		\text{∏} error
		*/
		return s


	},
	kxf = function (t, v) { return '\\text{' + t + '}' + (v ? zp(v) : '') },//不使用mathrm，因为它忽略空格
	kxA = function (A, b) { return b ? '\\begin{array}{}' + Arrf(function (x) { return x instanceof Array ? x.join(' & ') : x }, A).join('\\\\ ') + ' \\end{array}' : A.join('\\\\ ') },
	kxc = function (t, p, pfx) {
		var c = ('' + t).charCodeAt(0), g = 'ΑΒΓΔΕϜΦΗΙ΢ΚΛΜΝΟΡΠΘΣΤΥΞΩΧΨΖ'[c > 90 ? c - 97 : c - 65], a = 'ℵℶℷℸ'[c > 90 ? c - 97 : c - 65];
		return p == 'a' ? a : (p == 'g' ? (c > 90 ? g.toLowerCase() : g) : '\\' + (pfx === undefined ? 'math' + (p || 'bb') : pfx + (pfx === 'text' && p === '' ? '' : p || 'bf')) + '{' + t + '}')
	},/*
		math: bb bf	   cal frak it rm scr sf
		text: '' bf             it rm     sf normal tt
		'' : Bbb bf 	   frak	it rm     sf		tt bm bold boldsymbol
*/
	kos = function (t) {
		return /x/.test(t) ? t : (['xleftarrow', 'xleftrightarrow', 'xrightarrow', 'xLeftarrow', 'xLeftrightarrow', 'xRightarrow', 'xlongequal',
			'xhookleftarrow', 'xhookrightarrow', 'xtwoheadleftarrow', 'xtwoheadrightarrow', 'xleftharpoonup', 'xrightharpoonup', 'xleftharpoondown', 'xrightharpoondown',
			'xleftrightharpoons', 'xrightleftharpoons', 'xtofrom', 'xfromto', 'xmapsfrom', 'xmapsto'
		]['←↔→⇐⇔⇒=↩↪↞↠↼⇀↽⇁⇋⇌⇄⇆↤↦'.indexOf(t || '=')] || t)
	},

	kxo = function (t, p, t2) {
		return '\\' + ['overline', 'overleftarrow', 'overleftrightarrow', 'overrightarrow', 'overlinesegment', 'overleftharpoon', 'overrightharpoon', 'Overleftarrow', 'Overrightarrow',
			'overbrace', 'overgroup', 'widehat', 'widetilde', 'widecheck', 'xlongequal']['-←↔→I↼⇀⇐⇒{(<~>='.indexOf(p || '-')]
			+ (p == '=' ? '[' + t + ']{' + (t2 || '') + '}' : '{' + (t || '') + '}') + (p == '{' && t2 ? '^{\\text{' + t2 + '}}' : '')
	},
	kxu = function (t, p, t2) {
		return '\\' + (['underline', 'underleftarrow', 'underleftrightarrow', 'underrightarrow', 'underlinesegment', 'underleftharpoon', 'underrightharpoon', 'Underleftarrow', 'Underrightarrow',
			'underbrace', 'undergroup', 'uhat', 'utilde', 'ucheck', 'xlongequal']['-←↔→I↼⇀⇐⇒{(<~>='.indexOf((p || '-').replace('_', '-'))])
			+ (p == '=' && t2 ? '[' + t2 + ']' : '{' + (t || '') + '}') + (p == '{' && t2 ? '_{\\text{' + t2 + '}}' : '')
	},
	kancel = function (t, p) { return '\\' + (p == '-' ? 'sout' : (p || '') + 'cancel') + '{' + t + '}' },

	boxed = function (t) { return '\\boxed{' + t + '}' }, hp = function (t) { return '\\hphantom{' + (t || 0) + '}' },
	kbox = function (t, p, pfx) { return boxed(kxc(t, p || 'bf', pfx || 'text')) },

	ksc = function (t) { return isArr(t)?Arrf(ksc,t):SCtv('katex0" data-katex0="'+t.replace(/^\$|\$/g,'').trim(), t) }, 
	kdc = function (t) { return isArr(t)?Arrf(kdc,t):DCtv('katex0" data-katex0="'+t.replace(/^\$|\$/g,'').trim(), t) },
	ksz = function (t, n) { return '\\' + ['tiny', 'scriptsize', 'footnotesize', 'small', 'normalsize', 'large', 'Large', 'LARGE', 'huge', 'Huge'][(n || 0) + 4] + ' ' + t },


	kroot = function (t, n) { return root(t, n || '', '', '') },
	kfrac = function (t, p, tiny) {
		if (t instanceof Array) { return frac(t[0], t[1], tiny || '') }
		if (p) { return ('' + t).replace(/(\d+|[a-zα-ω])\/(\d+|[a-zα-ω])/ig, function (x) { return kfrac(x, '', tiny || '') }) }
		return /\//.test(t) && t.split('/').length==2 ? (t[0] == '-' ? '-' : '') + frac(t.split('/')[0].replace('-', ''), t.split('/')[1], tiny || '') : t
	},
	kfraczp = function (t, tiny, T) { return kfrac(zp(t) + (T ? '^{' + T + '}' : ''), 1, tiny || '') },
	kxAfrac = function (A, p) { return Arrf(function (x) { return kfrac(x, 1) }, A).join(kbr2) },


	sup = function (v, zM) { return arguments.length == 2 ? '^{' + v + '}' : XML.wrapE('sup', v) }, sub = function (v, zM) { return arguments.length == 2 ? '_{' + v + '}' : XML.wrapE('sub', v) },
	msub = function (m, v, r2l, zM) { var s = SCtv('inblk', v != null ? m : m[0]), M = (('' + m).length == 1 ? m : '{' + m + '}'); return arguments.length == 4 ? (r2l ? '' : M) + '_{' + v + '}' + (r2l ? M : '') : SCtv('scbox', (r2l ? '' : s) + XML.wrapE('sub', v != null ? v : m.substr(1)) + (r2l ? s : '')) },
	msup = function (m, v, r2l, zM) { var s = SCtv('inblk', v != null ? m : m[0]), M = (('' + m).length == 1 ? m : '{' + m + '}'); return arguments.length == 4 ? (r2l ? '' : M) + '^{' + v + '}' + (r2l ? M : '') : SCtv('scbox', (r2l ? '' : s) + XML.wrapE('sup', v != null ? v : m.substr(1)) + (r2l ? s : '')) },
	msups = function (A, zM) { return Arrf(arguments.length == 2 ? function (a, b) { return (('' + a).length == 1 ? a : '{' + a + '}') + '^' + (('' + b).length == 1 ? b : '{' + b + '}') } : msup, A, '-cp2') },
	msubs = function (A, zM) { return Arrf(arguments.length == 2 ? function (a, b) { return (('' + a).length == 1 ? a : '{' + a + '}') + '_' + (('' + b).length == 1 ? b : '{' + b + '}') } : msub, A, '-cp2') },
	ksups = function (a, n) { return msups(copyA(a, n), '') }, ksubs = function (a, n) { return msubs(copyA(a, n), '') },
	subsup = function (b, t, zM) { return arguments.length == 3 ? '_' + (('' + b).length == 1 ? b : '{' + b + '}') + '^' + (('' + t).length == 1 ? t : '{' + t + '}') : SCtv('scbox', SCtv('inblk alignl', sub(t) + br + sup(b))) },
	msubsup = function (m, b, t, r2l, zM) { var s = SCtv('inblk', b ? m : m[0]), M = (('' + m).length == 1 ? m : '{' + m + '}'), B = (('' + b).length == 1 ? b : '{' + b + '}'); return arguments.length == 5 ? (r2l ? '' : M) + '_' + B + '^{' + t + '}' + (r2l ? M : '') : SCtv('scbox', (r2l ? '' : s) + SCtv('inblk alignl', sub(t) + br + sup(b || m.substr(1))) + (r2l ? s : '')) },
	Msubsup = function (M, b, t) { var s = SCtv('inblk large', M); return SCtv('scbox', s + SCtv('inblk alignl', sub(t) + br + sup(b == null ? '' : b))) },

	subReg = function (v, b, u) { var t = u ? v.replace(u, function (t) { return sup(t) }) : v; return b ? t.replace(b, function (t) { return sub(t) }) : t },

	scRed = function (v) { return SCtv('red', v) }, scGain = function (v) { return SCtv('gainsboro', v) }, scHotk = function (v) { return SCtv('hotk', v) },
	sci = function () { var ar = arguments, s = Array().join.apply(ar); return SCtv('inblk', s) },
	scit = function (v) { return SCtv('bdt inblk notm', v) }, scib = function (v) { return SCtv('bdb inblk notm', v) }, scil = function (v) { return SCtv('bdl inblk notm', v) }, scir = function (v) { return SCtv('bdr inblk notm', v) },
	scbt = function (v, brad) { return SCtv('bdb bdt' + (arguments.length > 1 ? ' brad' : ''), v) }, sclr = function (v) { return SCtv('bdl bdr' + (arguments.length > 1 ? ' brad' : ''), v) },//参数brad 是border radius
	scbox = function (v, b) { return SCtv('bdl bdr bdb bdt scbox ' + (b || ''), v) }, scblr = function (v, b) { return SCtv('bdl bdr bdb scbox inblk' + (b || ''), v) }, sctlr = function (v, b) { return SCtv('bdl bdr bdt scbox inblk' + (b || ''), v) },
	tmb = function (t, m, b, v) { return SCtv('inblk alignc', sub(t) + br + m + br + sup(b)) + sci(v) },//tmb=function(t,m,b,v){return SCtv('inblk alignc',SCtv('small',t)+DCtv('large',m)+SCtv('vat small',b))+sci(v)},
	lim = function (n, x, v, ud, zM) {
		var x0 = (x == null ? '' : '' + x).replace(/[\+-]$/, ''), lr = /[\+-]$/.test(x) && !/^[\+-]/.test(x) ? x.substr(-1) : '', t5 = arguments.length >= 5,
		ntox0 = '{' + n + ' \\to ' + (x0 || (/^[\+-]$/.test(x) ? x : '') + '∞') + (lr ? '^' + lr : '') + '}'; //ud=u(p) d(own) s(up) i(nf) ''
		return t5 ? (/[ud]/.test(ud) ? '\\underset' + [ntox0 + '{\\', 'line{\\lim}}\\,'].join(ud == 'u' ? 'over' : 'under') : '\\lim' + (/[si]/.test(ud) ? (ud == 's' ? 'sup' : 'inf') : '') +
			'\\limits_' + ntox0) + v : SCtv('inblk alignc', (ud == 'u' ? scit('lim') : (ud == 'd' ? scib('lim') : 'lim')) + br + sup(n + '→' + (x0 || (/^[\+-]$/.test(x) ? x : '') + '∞') + (lr ? sup(lr) : ''))) + (v || '')
	},

	sum = function (i, b, t, v, p, zM) {
		return arguments.length >= 6 ? '\\' + (!zM ? 'display' : 'text') + 'style{\\' + ['sum', 'bigcup', 'mathop{+}', 'bigvee', 'sup', 'max', 'bigoplus'][p || 0] + (!zM ? '\\limits' : '') +
			'_{' + (i ? i + '=' + b : (b instanceof Array ? '\\substack{' + b.join('\\\\ ') + '}' : (b == '-' ? b + '∞' : b))) + '}' + (t ? '^{' + (t == '+' ? '∞' : t) + '}' : '') +
			v + '}' : SCtv('inblk alignc', sub(t == '+' ? '∞' : t) + br + ['∑', '∪', '+', '⋁', 'sup', 'max', '⊕'][p || 0] + br + sup(i ? i + '=' + b : b)) + sci(v)
	},

	prod = function (i, b, t, v, p, zM) {
		return arguments.length >= 6 ? '\\' + (!zM ? 'display' : 'text') + 'style{\\' + ['prod', 'bigcap', 'mathop{×}', 'coprod', 'bigwedge', 'inf', 'min', 'bigodot', 'bigotimes'][p || 0] + (!zM ? '\\limits' : '') +
			'_{' + (i ? i + '=' + b : (b instanceof Array ? '\\substack{' + b.join('\\\\ ') + '}' : (b == '-' ? b + '∞' : b))) + '}' + (t ? '^{' + (t == '+' ? '∞' : t) + '}' : '') +
			v + '}' : SCtv('inblk alignc', sub(t == '+' ? '∞' : t) + br + ['∏', '∩', '×', '∐', '∧', 'inf', 'min', '⊙', '⊗'][p || 0] + br + sup(i ? i + '=' + b : b)) + sci(v)
	},

	intl = function (fA, b, t, d, p, zM) {
		var s=/, /.test(d)?'∧':'';
		if(p==-1){
			return fA+orifun(b, t)
		}
		return arguments.length >= 6 ? '\\' + (!zM||zM==1 ? 'display' : 'text') + 'style{\\' + ['int', 'iint', 'iiint', 'oint', 'oiint', 'oiiint', 'int\\dotsi\\int'][p || 0] + (!zM ? '\\nolimits' : (zM==1?'\\limits':'')) +
			'_{' + (/^[\+\-]$/.test(b) ? b + '∞' : (b instanceof Array ? '\\substack{' + b.join('\\\\ ') + '}':(b||b==0?b:''))) + '}' + 
			(t||t===0 ? '^{' + (/^[\+\-]$/.test(t) ? t + '∞' : t) + '}' : '') + (isArr(fA)?
			snake([zlrA3('\\mathrm{d}{',(d || 'x,y;y,z;z,x').replace(/,/g, s+'\\mathrm{d}').split(';'), '}'),fA]).join('')+'}':fA + 
			(d==' '?'':'\\,'+
			zlrA3('\\mathrm{d}{',(d || 'xyz'.substr(0,p || 2).split('').join()).split(','), '}').join(s)+'}')) : 
				Msubsup('∫∬∭∮∯∰∱∲∳'[p || 0], b == null ? '' : b, (/[\+\-]/.test(t) ? t + '∞' : t) || (b == null ? '' : '+∞')) + v + 'd' + (d || 'x')
	},


	iint = function (fA, b, t, d,p,zM) {
		var s=/, /.test(d)?'∧':'';
		return  '\\' + (!zM||zM==1 ? 'display' : 'text') + 'style{\\' + ['','int','iint', 'iiint'][p || 2] + (!zM ? '\\nolimits' : (zM==1?'\\limits':'')) +
			'_{' + (b instanceof Array ? '\\substack{' + b.join('\\\\ ') + '}':(b||b==0?b:'')) + '}' + (t||t===0  ? '^{' + t + '}' : '') + (isArr(fA)?
			snake([zlrA3('\\mathrm{d}{',(d || 'x,y;y,z;z,x').replace(/,/g, s+'\\mathrm{d}').split(';'), '}'),fA]).join(''):fA + '\\,'+
			(d==' '?'':(!d?('\\mathrm{d}'+'  σV'[p || 2]):
			zlrA3('\\mathrm{d}{',(d || 'xyz'.substr(0,p || 2).split('').join()).split(','), '}').join(s))))+'}' 
	},

	oint = function (fA, b, t, d,p,zM) {
		var s=/, /.test(d)?'∧':'';
		return  '\\' + (!zM||zM==1 ? 'display' : 'text') + 'style{\\' + ['oint','oint','oiint','oiiint'][p || 0] + (!zM ? '\\nolimits' : (zM==1?'\\limits':'')) +
			'_{' + (b instanceof Array ? '\\substack{' + b.join('\\\\ ') + '}':(b||b==0?b:'')) + '}' + (t||t===0  ? '^{' + t + '}' : '') +
			(!/,/.test(d) && !isArr(fA)?fA +(d==' '?'':'\\,\\mathrm{d}'+d):snake([zlrA3('\\mathrm{d}{',(d || 'x,y;y,z;z,x').replace(/,/g, s+'\\mathrm{d}').split(';'), '}'),fA]).join(''))+'}' 
	},





	orifun =function(x0,x1){
		return '\\LARGE|\\normalsize\\substack{'+(x1||'')+'\\\\\\\\ '+x0+'}'
	},
	difn = function (f, x, p, g) { var d = (p ? '∂' : '\\mathrm{d}') + ' ', 
		dx= +g>1?d + (x || 'x'):d,
		dg = +g>1? '^{' + g + '}' : (isArr(x)?'^{' +x.length+'}':''),
		dg_= +g>1 ? '^{' + g + '}' : (isArr(x)?x.join(d):(x || 'x'));
		return ' \\tfrac{' + d + dg + (f || '') + '}{' + dx + dg_ + '}' },

	Opr = function (i, b, t, v, p) { return '\\mathop{' + p + '}\\limits' + '_{' + (i ? i + '=' + b : (b=='-'?'-∞':b)) + '}' + (t ? '^{' + (t == '+' ? '∞' : t) + '}' : '') + (v || '') },
	/* katex 不支持 ⋰ (已使用\iddots 命令修复) ∱∲∳ \idotsint 多重积分 ∫⋅⋅⋅∫ 与MathJax区别
	
	 http://www.cnblogs.com/suerchen/p/4833381.html
	 https://katex.org/docs/supported.html
	 https://www.cnblogs.com/Coolxxx/p/5982439.html
	 */

	mfrac = function (A, zM) { return Arrf(zM ? function (a, b) { return '\\' + (zM || '') + 'frac {\\displaystyle ' + a + '}{\\displaystyle ' + b + '}' } : frac, A, '-cp2') },
	mfracs = function (A, b, infMid, infEnd, ops, zM) {//连分式 b0+a0/(b1+a1/(b2+a2/...)) ops指定连接符序列：+(默认),-,+-,-+,+--,-++
		var An = A.length, B = [].concat(b), Bn = b.length, t = '', a6 = arguments.length >= 6;//Bn比An大1，否则如相等，则最外层分式之前无内容
		if (Bn == An) {
			B = [''].concat(b);
			Bn++;
		}
		if (Bn == 2) {
			var op = /^..$/.test(ops) ? ops[0] : (ops || '+').substr(-1);
			return B[0] + (infMid ? op + '⋯' : '') + op + (a6 ? frac(A[0], B[1] + (infEnd ? op + '⋱' : ''), zM || '') : frac(A[0], B[1] + (infEnd ? op + '⋱' : '')))
		} else {
			var ops2 = ops || '+', op = ops2;
			if (op == '+--' || op == '-++') {
				op = op[0];
				ops = ops[1];
			} else if (op == '+-' || op == '-+') {
				op = op[0];
				ops = ops[1] + op;
			}
			return (B[0] !== '' ? B[0] + op : '') + (a6 ? frac(A[0], mfracs(A.slice(1), B.slice(1), infMid, infEnd, ops, ''), zM || '') : frac(A[0], mfracs(A.slice(1), B.slice(1), infMid, infEnd, ops)))
		}
	},

	mroots = function (A, B, infMid, infEnd, ops, Aisindex, zM) {//连根式 b0+a0√(b1+a1√(b2+a2√...)) ops指定连接符序列：+(默认),-,+-,-+,+--,-++	Aisindex指定数组A是根次，而不是倍数
		var An = A.length, Bn = B.length, t = '', a7 = arguments.length == 7;//Bn比An大1
		if (Bn == 2) {
			var op = /^..$/.test(ops) ? ops[0] : (ops || '+').substr(-1);
			return B[0] + (infMid ? op + '⋯' : '') + op + (An && !Aisindex ? A[0] : '') + (a7 ? kroot : root)(B[1] + (infEnd ? op + '⋯' : ''), (An && Aisindex ? A[0] : ''))
		} else {
			var ops2 = ops || '+', op = ops2;
			if (op == '+--' || op == '-++') {
				op = op[0];
				ops = ops[1];
			} else if (op == '+-' || op == '-+') {
				op = op[0];
				ops = ops[1] + op;
			}
			return (B[0] + op == '+' ? '' : B[0] + op) + (An && !Aisindex ? A[0] : '') + (a7 ? kroot : root)(a7 ? mroots(A.slice(1), B.slice(1), infMid, infEnd, ops, Aisindex, '') : mroots(A.slice(1), B.slice(1), infMid, infEnd, ops, Aisindex), (An && Aisindex ? A[0] : ''))
		}
	},

	re = function (t) {
		return ('' + t).replace(/>=/g, '≥').replace(/<=/g, '≤').replace(/=\//g, '≠').replace(/-=/g, '≡').replace(/≡\//g, '≢')
			.replace(/←→|<->/g, '↔').replace(/->/g, '→').replace(/-</g, '←').replace(/↔\//g, '↮').replace(/→\//g, '↛').replace(/←\//g, '↚')
			.replace(/<=>/g, '⇔').replace(/=>/g, '⇒').replace(/=</g, '⇐').replace(/⇔\//g, '⇎').replace(/⇒\//g, '⇏').replace(/⇐\//g, '⇍')
	},
	rel = function (A, rA, style) {//通用模板
		var l = A.length, r = style ? br : ' ', s = '';
		Arrf(function (t, i) { if (i) { s += r + rA[i - 1] + ' ' + t } else { s = t } }, A)
		return s
	},
	binom = function (n, m, p) { return p == 'C' ? 'C_{' + n + '}^{' + m + '}' : (p == 'c' ? '{' + n + ' \\choose ' + m + '}' : '\\' + (p || '') + 'binom{' + n + '}{' + m + '}') },//p=t d '' c (for choose)
	mod = function (a, b, m, neg, pow, zM) { var a6 = arguments.length == 6, M = ('' + m).length == 1 ? m : '{' + m + '}'; return (isArr(a) ? a.join('≡') : a) + (neg ? (a6 ? kx('≢') : '≢') : '≡') + b + (a6 ? (pow ? ' ~ (\\mathrm{pow} ~ ' + M + ')' : '\\pmod ' + M) : ' (' + (pow ? 'pow' : 'mod') + ' ' + m + ')') },	//'\\not\\equiv '
	kmod = function (a, b, m, neg, pow) { return mod(a, b, m, neg, pow, '') },
	imply = function (A, b, single, neg, inv, style) { var isA = isArr(A), s = inv ? (single ? '←' : '⇐') : (single ? '→' : '⇒'), l = A.length, r = style ? br : ' '; return (isArr(A) ? A.slice(0, l - 1).join(r + s + ' ') : A) + r + (neg ? (inv ? (single ? '↚' : '⇍') : (single ? '↛' : '⇏')) : s) + ' ' + (isA ? A[l - 1] : b) },
	eqv = function (A, b, n, neg, style, m) {/*
	equivalent等价关系
	n是符号编号
	0 =
	1 ↔
	2 ⇔
	3 ≡
	4 ~	[用波浪线~，而不是∼]
	5 ≈
	6 ≋
	7 ≃
	8 ≅
	9 
	10 
	
	参数 b 当A非数组时有用，A=b
	参数 style指定换行（否则默认是空格）
	参数 m 指定当n=3时 (mod m)
	
	
*/
		var c = ['=↔⇔≡~≈≋≃≅', '≠↮⇎≢≁≉ ≄≇'], isA = isArr(A), s = c[0][n || 0], l = A.length, r = style ? br : ' ';
		return (isA ? A.slice(0, l - 1).join(r + s + ' ') : A) + r + (neg ? c[1][n || 0] : s) + ' ' + (isA ? A[l - 1] : b) + (n == 3 && m ? ' (mod ' + m + ')' : '')
	},
	eq0 = function (A, n, m) {/*
	等于0
	
	参数n指定等号样式，当n=3时，m是mod m
*/
		return eqv(isArr(A) ? [].concat(A, 0) : [A, 0], '', n) + (n == 3 ? ' \\pmod {' + m + '}' : '')	//' (mod '+m+')'
	},
	lt = function (A, b, nm, style) {/*
	nm是数组[连续的符号编号, 类别序号]
		符	号	编	号
		0	1	2	3	4	5	6	7	8	9	a	b	c	d	e	f	g	h	i	j
类	0	≤	<	=	≠	≮	≰	≪	⋘	⋖	⋜	≦	≨	≲	≴	⋦	≶	≸	⋚
别	1	≼	≺	=	≠	⊀	⋠	⋞	≾	⋨	⊰
序	2
号	3



*/
		var c = [], isA = isArr(A), r = style ? br : ' ';
		return isA ? rel(A, Arrf(function (t) { return c[nm[1]][+t || parseInt(t, 36)] }, nm[0].split('')), style) : A + r + c[nm ? nm[1] : 0][nm ? nm[0] || parseInt(+nm[0], 36) : 0] + ' ' + b
	},
	gt = function (A, b, nm, style) {/*
	nm是数组[连续的符号编号, 类别序号]
		符	号	编	号
		0	1	2	3	4	5	6	7	8	9	a	b	c	d	e	f	g	h	i	j
类	0	≥	>	=	≠	≯	≱	≫	⋙	⋗	⋝	≧	≩	≳	≵	⋧	≷	≹	⋛
别	1	≽	≻	=	≠	⊁	⋡	⋟	≿	⋩	⊱
序	2
号	3

*/
		var c = [], isA = isArr(A), r = style ? br : ' ';
		return isA ? rel(A, Arrf(function (t) { return c[nm[1]][+t || parseInt(t, 36)] }, nm[0].split('')), style) : A + r + c[nm ? nm[1] : 0][nm ? nm[0] || parseInt(+nm[0], 36) : 0] + ' ' + b

	},
	aligned=function(A,leftElement){
		var a=[].concat(A);
		if(leftElement){
			a[1]=a[0]+' & '+a[1];
			a.shift();
		}else{
			a[0]='& '+a[0]
		}
		return ['\\begin{aligned}',
		a.join(kbr+brn+'& '),
		'\\end{aligned}'].join(brn)
	},

	eq = function (t, m, b) { var k = kos(m); return (t || b) ? '\\' + k + (b ? '[' + b + ']' : '') + '{' + (t || '') + '}' : (/x/.test(k) ? '\\' + k : k) },
	eqM = function (A, m) { return A.join(eq('', '', '\\mod ' + m)) },
	Eq = function (A, noteA, style, eqClass) {
		/*
		A 等值	数组元素，如也是数组，则在等号两侧
		noteA 备注
		style 指定排版风格
			line 排成一行；注释都在等号上
	
			br 换行；等号对齐（默认，仅每行第1个=）；注释都在等号上
			table 换行；等号对齐（都在第2列）；注释都在第4列
			
		eqClass 连接符（默认是等号eq）	= ≡ 支持数组(与noteA一一对应),表示依次使用不同连接符号
	
	
		*/



		var n = A.length, a = [], sty = style || 'br', isbr = sty == 'br', isline = sty == 'line', istable = sty == 'table',
			eqC = eqClass || '', iseqCA = eqClass instanceof Array, isA0 = A[0] instanceof Array;
		for (var i = 0; i < n; i++) {
			var Ai = A[i], isA = Ai instanceof Array, nAi = noteA && (i || isA0 || isline) ? (noteA[!isA0 && !isline ? i - 1 : i] || '') : '',
				eqCi = (iseqCA ? eqC[(i || isA0 || isline) && !isA0 && !isline ? i - 1 : i] : (eqC || '=')) || '',
				ai = '', isnA = nAi instanceof Array;
			if (isbr) {
				//	console.log(isnA?nAi.join(';;;;;;'):nAi);
				ai = i || isA0 ? (isA ? Ai : ['', Ai]).join(' & ' + (!(isnA || nAi) ? (eqCi || '=') : eq((isnA ? nAi[0] : nAi), (eqCi), (isnA ? nAi[1] : '') || ''))) : ' & ~ \\quad ' + Ai
			}
			if (istable) {
				ai = i || isA0 ? (isA ? Ai : ['', Ai]).join(' & ' + eqCi) + (nAi ? ' & ' + nAi : '') : ' & ~ \\quad ' + Ai
			}
			if (isline) {
				ai = Ai + (i == n - 1 ? '' : (!(isnA || nAi) ? eqCi : eq((isnA ? nAi[0] : nAi), eqCi, (isnA ? nAi[1] : nAi) || '')))
			}
			a.push(ai)
		}
		return isline ? a.join(' ') : '\\begin{aligned}' + a.join(' \\\\ ') + ' \\end{aligned}'
	},
	EqA = function (A, lr, splitter) {/* 对齐方程组(不等式组)
	A是二维数组(已按对齐要求分割),或者一维数组(方程的数组,需按splitter分割)
	lr 指定大括号0{ 1} 2{} 3''
	splitter是对齐标志(正则表达式) 默认按多元一次线性方程(或不等式)组	split('123x+4y=23',/[a-z≤≥<>=≠≡≢]/g)
		
	*/
		var s0 = '\\left' + ['\\{', '', '\\{', ''][+lr || 0], s1 = '\\right' + ['.', '\\}', '\\}', ''][+lr || 0], sp = splitter || /[a-z≤≥<>=≠≡≢]/g, isDim2 = A[0] instanceof Array, c = 0, B = [].concat(A);
		if (isDim2) {
			c = A[0].length;
		} else {
			var spA = A.join('').replace(/[^a-z]/g, '').split('').sort().join('').replace(/(.)\1+/g, '$1').split('').concat('=');	//Arrf(String.fromCharCode,seqA(97,26))
			c = spA.length;
			Arrf(function (x, i) {

				B[i] = split(kx(x), sp, 1);
				if (B[i][0].length != c) {
					for (var j = 0; j < c - 1; j++) {
						if (B[i][0].indexOf(spA[j]) < 0) {
							if (j) {
								B[i][0].splice(j, 0, '');//插入
								B[i][1].splice(j, 0, '');
							} else {
								B[i][0].unshift('');
								B[i][1].unshift('');
							}
						}
					}
				}
				var C = [];
				for (var j = 0; j < c * 2 + 1; j++) {
					C.push(B[i][1 - j % 2][Math.floor(j / 2)])
				}
				B[i] = C;
			}, B);
			c *= 2;

		}
		return s0 + '\\begin{alignedat}{' + c + '}' + Arrf(function (x) { return x.join(' & ') }, B).join(kbr) + '\\end{alignedat}' + s1
		/*
		   10&x &  +3 &y & =& 0\\
		   3&x & + 12 &  y & =&1 0 \\
		   & &   18&y & =& 40 \\
		
		   10&x &  & & =& 230\\
		*/


	},
	Table = function (thead, t, bd, tbodyClass, theadClass) {	//bd 指定边框风格（或其他class） thead是数组，末项（n>1时）是列标题，前n-1项是行标题
		/*
			bd：表格class（控制表格边框 或 水平对齐）
			
				bd0 无边框（默认）
				
				TBalignl (默认)
				TBalignc_3_5
				TBalignr_2
				
				
				TBtimes （群、九九）乘法表：首行bdb 首列bdr
				TBr 全部行(不含最后一行)
				TBc 全部列(不含最后一列)
				TBrc 所有单元格
				
				TBr2	行平均分两块
				TBc2	列平均分两块
				TBr2c2  十字分隔 
					注意 r2、c2是或关系
	
				
				TBD3_4_2		主对角阵分块（仅方阵）
				TBCD3_4_2		副对角阵分块（仅方阵）
	
				除法（长除、短除、辗转相除）
			
				TBcalc 竖式计算（+ - × ÷ √）
				
				TBI2J2 第2行或第2列加边框
				TBI2_4J2_3 第2、4行或第2、3列加边框
	
				TB[i2][j3][lrbt]		部分单元格边框
					注意i、j小写是且关系，大写是或
						[lrbt] 默认全选
					TBi2j3lr 第2行且第3列加左右边框
					TBj3r
					TBi2b
				TBi2j3_TBi4j2 多个单元格，用下划线_隔开
	

				span[i2j3][i4j6] 合并单元格(第2行第3列，至第4行第6列的单元格区域)

				Span[i2j3][i4j6] 合并单元格(单元格区域内，有连续相同值的子区域时，才按需合并)
				

	bds 指定线条风格
			
				dashed	虚线
					solid
					dash(ed)
					dot(ted)
					double
					groove
					inset
					outset（默认）
					ridge
	
			
		*/
		//console.log(t);


		var th = '', b = '</tbody></table>', colh = '', edi = /edit/.test(bd),
			bds = /dash|dot|dou|set|ridge|solid/.test(bd) ? bd.match(/solid|dash|dot|double|groove|inset|outset|ridge/g).join(' ') : '',
			span=/spani\d+j\d+/.test(bd)?Arrf(function(x){return Arrf(Number,x.split(/\D+/g))}, bd.match(/spani\d+j\d+i\d+j\d+/g)):'',
			Span=/Spani\d+j\d+/.test(bd)?Arrf(function(x){return Arrf(Number,x.split(/\D+/g))}, bd.match(/Spani\d+j\d+i\d+j\d+/g)):'',
			r = [], isA = t instanceof Array, A = isA ? t : t.split('\n'), n = A.length, m = (isA ? (n?A[0]:[]) : A[0].split('\t')).length;

		if (thead) {
			var thn = thead.length;
			for (var i = 0; i < thn; i++) {
				if (i && i == thn - 1) {
					colh = thead[i];
					break;
				}
				var thi = '<tr>', hdi = thead[i];
				for (var j = 0, l = Math.max(m + (thn > 1 ? 1 : 0), isArr(hdi) ? hdi.length : 1); j < l; j++) {
					thi += '<th'+(/bd0/.test(theadClass)?'':' class=bds')+'>' + hdi[j] + '</th>';//thi+='<th'+(j?' class=bdl':'')+'>'+hdi[j]+'</th>'
				}
				thi += '</tr>';
				th += thi;
			}
			th = '<thead' + (theadClass ? ' class="' + theadClass +'"' : '') + '>' + th + '</thead>'; //class=cnt
		}
		var a = '<table class="collapse mg10 ' + (bd || 'bd0') + '">' + th + '<tbody' + (tbodyClass ? ' class="' + tbodyClass + '"' : '') + '>';
		if (bd && /TB[CD]/.test(bd)) {
			var isC = /TBC/.test(bd), iA = bd.split(' ')[0].split('D')[1].split('_'), iAn = iA.length, jA = iA.join(',').split(',').reverse();

			for (var i = 0; i < iAn; i++) {
				if (i == 0) {
					iA[i] = +iA[i]
				} else {
					iA[i] = +iA[i] + iA[i - 1]
				}

				if (isC) {
					if (i == 0) {
						jA[i] = +jA[i]
					} else {
						jA[i] = +jA[i] + jA[i - 1]
					}
				}
			}

			if (isC) {

			} else {
				jA = iA;
			}

		}


		if(Span){
			var SpanA=[], Arr=[];


			for (var i = 0; i < n; i++) {
				var ri = [], Ai = isA ? A[i] : A[i].split('\t');
				Arr.push(Ai)
			}

			for(var k=0;k<Span.length;k++){
				var Sk=Span[k];
				if(Sk[1]==Sk[3]){
					for(j=Sk[2]-1;j<Sk[4]-1;j++){
						if(Arr[Sk[1]-1][j]!=Arr[Sk[1]-1][j+1]){
							Sk[2]=j+1;
						}
					}
					if(Sk[2]!=Sk[4]){
						SpanA.push(Sk)
					}

				}else if(Sk[2]==Sk[4]){
					for(i=Sk[1]-1;i<Sk[3]-1;i++){
						if(Arr[i][Sk[2]-1]!=Arr[i+1][Sk[2]-1]){
							Sk[1]=i+1;
						}
					}
					if(Sk[1]!=Sk[3]){
						SpanA.push(Sk)
					}
				}else if(Arr[Sk[1]-1][Sk[2]-1]!=Arr[Sk[1]][Sk[2]]){
					
					Span.splice(k,0,['',Sk[1], Sk[2], Sk[1], Sk[4]], ['',Sk[1], Sk[2], Sk[3], Sk[2]],  ['',Sk[1]+1, Sk[2]+1, Sk[3], Sk[4]])

				}else if(Arr[Sk[1]-1][Sk[2]-1]!=Arr[Sk[1]-1][Sk[2]]){

					Span.splice(k,0,['',Sk[1], Sk[2]+1, Sk[1], Sk[4]], ['',Sk[1], Sk[2], Sk[3], Sk[2]],  ['',Sk[1]+1, Sk[2]+1, Sk[3], Sk[4]])
					
				}else if(Arr[Sk[1]-1][Sk[2]-1]!=Arr[Sk[1]][Sk[2]-1]){

					Span.splice(k,0,['',Sk[1], Sk[2], Sk[1], Sk[4]], ['',Sk[1]+1, Sk[2], Sk[3], Sk[2]],  ['',Sk[1]+1, Sk[2]+1, Sk[3], Sk[4]])
				}else{
					var bk=0;
					for(j=Sk[2];j<Sk[4]-1;j++){
						
						for(var i=Sk[1]-1;i<Sk[3]-1;i++){
							if(Arr[i][j]!=Arr[Sk[1]-1][Sk[2]-1]){
								Sk[4]=j;
								bk=1;
								break;
							}
						}
						if(bk){
							break
						}
					}



					var bk=0;
					for(i=Sk[1];i<Sk[3]-1;i++){
						
						for(var j=Sk[2]-1;j<Sk[4]-1;j++){
							if(Arr[i][j]!=Arr[Sk[1]-1][Sk[2]-1]){
								Sk[3]=i;
								SpanA.push(Sk);
								bk=1;
								break;
							}
						}
						if(bk){
							break
						}
					}
					if(!bk){
						SpanA.push(Sk);
					}

				}


			}

			if(span){
				span=span.concat(SpanA);
			}else{
				span=SpanA;
			}
		}


		//console.log(span);
		for (var i = 0; i < n; i++) {
			var ri = [], Ai = isA ? A[i] : A[i].split('\t');
			for (var j = 0; j < m; j++) {
				var c = '';
				if (bd) {
					if (/TBrc/.test(bd)) {
						c += 'bdl bdr bdb bdt'
					} else if (/TBc(?!\d)/.test(bd)) {
						c += (j == 0 ? '' : 'bdl ') + (j == m - 1 ? '' : 'bdr ');
					} else if (/TBr(?!\d)/.test(bd)) {
						c += (i == 0 ? '' : 'bdt ') + (i == n - 1 ? '' : 'bdb ');
					}

					if (/TBtimes/.test(bd)) {
						if (!i) { c += 'bdb ' }
						if (!j) { c += 'bdr ' }
					}

					if (/TB(r\d+)?c\d+/.test(bd) && j == m / +bd.match(/TB(r\d+)?c\d+/)[0].split('c')[1] - 1) {
						c += 'bdr '
					}
					if (/TBr\d+/.test(bd) && i == n / +bd.match(/TBr\d+/)[0].split('r')[1] - 1) {
						c += 'bdb '
					}
					if (/TB(I[\d_]+)?J\d+/.test(bd) && bd.match(/TB(I[\d_]+)?J[\d_]+/)[0].split('J')[1].split('_').indexOf('' + (j + 1)) > -1) {
						c += 'bdr '
					}
					if (/TBI[\d_]+/.test(bd) && bd.match(/TBI[\d_]+/)[0].split('I')[1].split('_').indexOf('' + (i + 1)) > -1) {
						c += 'bdb '
					}
					if (/TB[CD]/.test(bd)) {
						if (iA.indexOf(i + 1) > -1 && i < n - 1) {
							c += 'bdb '
						}
						if (jA.indexOf(j + 1) > -1 && j < m - 1) {
							c += 'bdr '
						}
					}
					if (/TB[ij]\d+/.test(bd)) {
						var ijs = bd.match(/TB([ij]\d+)+[lrbt]?/g);
						for (k = 0; k < ijs.length; k++) {
							var ijb = ijs[k].substr(2), ij = ijb.replace(/\D+$/, '');
							if (eval(ij.replace(/[ij]/g, '$&==').replace(/\d+/g, '$&-1').replace(/-1j/g, '-1 && j'))) {
								c += (ijb.substr(ij.length) || 'lrbt').replace(/./g, 'bd$& ')
							}
						}
					}


					if (/TBalign[cr]($| )/.test(bd)) {
						c += ' align' + bd.replace(/ TBalign.\d+(_\d+)*/g, '').split('align')[1]
					} else {
						var cc = bd.match(new RegExp('align.(\\d+_)*' + (j + 1) + '(?!\\d)'));
						if (cc) {

							c += ' ' + cc[0].substr(0, 6)
						}

					}

				}
				//console.log(Ai[j]);
				var s='', same='';
				for(var k=0;k< span.length;k++){
					var si=span[k];
					if(i+1 == si[1] && j+1 == si[2]){

						s=(si[3]>si[1] ?' rowspan='+(si[3]-si[1]+1):'')+(si[4]>si[2] ?' colspan='+(si[4]-si[2]+1):'');
						break;
					}
					if(i+1 >= si[1] && j+1 >= +si[2] && i+1 <= +si[3] && j+1 <= +si[4] ){
						s='inRange';
						break
					}

				}
				if(s!='inRange'){
					ri.push('<td'+s+' class="' + (c ? zlr2(c, bds || '').trim() : 'bd0') + (edi ? '" contenteditable="true' : '') + '">' + (Ai[j] == undefined ? '' : Ai[j]) + '</td>')
				}
				
			}
			r.push(XML.wrapE('tr', (colh ? '<th class="bdr bdt' +
				(/TBr?c/.test(bd) || (new RegExp('I(\\d+_)*' + (i + 1), '')).test(bd) ? ' bdl bdb' : '') +

				'">' + (colh[i] == undefined ? '' : colh[i]) + '</th>' : '') + ri.join('')))
		}
		return /scroll/.test(bd) ? DCtv('scroll', a + r.join('') + b) : a + r.join('') + b
	},
	mtrx = function (v, lr, lcr, spacing, parts) {/* 参数 lr, lcr，
		在latex下 用于设置括号类型：
matrix命令下	p() b[] B{} v|| V‖‖ 
array命令下		()	[]	\{\}	||	\|
		在html下 用于控制左右对齐
		
	parts 参数，控制分块
		参考Table的部分TB命令 + 列虚、实线':|' + 行虚、实线'._'
								无行分块时，列线默认都用虚线
								无列分块时，行线默认都用实线
								行列都有分块，行列线默认都是虚线
		rc 全部行列
		r全部行
		c全部列
		r3c2	均分
		I2_5J3_7	指定行列 (编号从1开始)
		[C]D3_4_2	[副]主对角阵	(仅方阵)
	
	*/
		var al = arguments.length, r = v.length, c = (v[0] instanceof Array ? v[0] : '1').length, I = [], J = [], A;
		if (parts) {

			A = Arrf(function (t) { return t instanceof Array ? t.join(' & ') : t }, v);
			if (/I/.test(parts)) {
				I = Arrf(Number, parts.match(/I\d+(_\d+)*/g)[0].substr(1).split('_'));
			}
			if (/J/.test(parts)) {
				J = Arrf(Number, parts.match(/J\d+(_\d+)*/g)[0].substr(1).split('_'));
			}
			if (/r/.test(parts)) {
				if (/r\d/.test(parts)) {
					var t = +parts.match(/r\d+/g)[0].substr(1);
					I = I.concat(seqA(r / t, t - 1, '', r / t))
				} else {
					I = seqA(1, r)
				}
			}
			if (/c/.test(parts)) {
				if (/c\d/.test(parts)) {
					var t = +parts.match(/c\d+/g)[0].substr(1);
					J = J.concat(seqA(c / t, t, '', c / t))
				} else {
					J = seqA(1, c)
				}
			}
			if (/[CD]/.test(parts)) {// bug 0 1 0 0 0 0 1 0 0 0 0 1 a b c d&CD3_1
				var D = antidiff(Arrf(Number, parts.match(/[CD]+\d+(_\d+)*/g)[0].replace(/[CD]/g, '').split('_'))), D2 = [].concat(D);
				Arrf(function (t) { uniPush(D, t, 1) }, I);
				Arrf(function (t) { uniPush(D2, t, 1) }, J);
				I = D;
				if (/C/.test(parts)) {
					var s = D.slice(-1)[0];
					
					J = Arrf(function (x) { return s - x }, D2).reverse();
					J = J.slice(1).concat(s);
				} else {
					J = D2;
				}
				
			}
			var ls = parts.split(' '), hline = ls[2] || (J.length ? '.' : '_'), vline = ls[1] || (I.length < 1 || I.length * J.length ? ':' : '|');


			if (J.length) {
				//	console.log('J=',J);
				if (J.slice(-1)[0] != c) {
					J.push(c);
				}
				J = Arrf(function (t) { return 'c'.repeat(t) }, diff(J));
				J = concat(J.slice(0, J.length - 1), vline).join('') + J.slice(-1)[0];
			} else {
				J = 'c'.repeat(c);
			}

			if (I.slice(-1)[0] == r) {
				I.pop();
			}


			//	Arrf(function(t){A[t]='\\hline '+A[t]},I);

			Arrf(function (t, i) { A[t] = '\\h' + ((hline[i] || hline[0]) == '.' ? 'dash' : '') + 'line ' + A[t] }, I);
			//	console.log(J);
			return (spacing?'\\def\\arraystretch{'+spacing+'}':'')+'\\left' + (lr || '[') + ' \\begin{array}{' + J + '}' +
				A.join(' \\\\ ') +
				' \\end{array}' + ' \\right' + (lcr || ']')

		}

		return al > 3 ? (spacing?'\\def\\arraystretch{'+spacing+'}':'')+'\\begin{' + (lr == '.' ? '' : (lr || 'b')) + 'matrix}' + Arrf(function (x) { return x instanceof Array ? x.join(' & ') : x }, v).join(' \\\\ ') + ' \\end{' + (lcr == '.' ? '' : (lcr || 'b')) +
			'matrix}' : SCtv('mtrx' + (lr || '') + ' inblk align' + (lcr || lr || 'c'), v instanceof Array ? Table('', v) : v)
	},
	zmtrx = function (A, spacing, parts,lr,lcr) { return mtrx(A, lr||'', lcr||'', spacing, parts) },
	kmtrx = function (A, fracOff, parts,lr,lcr) { var t = mtrx((Mfn ? Arrf(function (a) { return isArr(a) ? Arrf(function (x) { return Mfn.fromStr(x).toStr(1) }, a) : Mfn.fromStr(a).toStr(1) }, A) : A), lr||'', lcr||'', /frac/.test(A) || !fracOff && /\//.test(A) ? 1.5 : '', parts); return fracOff ? t : kfrac(t, 1, 't') },

	zstrx = function (t, p) { return Arrf(function (x) { return ZLR(x, '', p == undefined ? ' ' : '') }, t.split(';')) },
	zarray = function (A, spacing, parts) { return mtrx(A, '.', '.', spacing, parts) },
	tableT = function (A) {/* Transpose	转置 */
		var B = [], m = A.length, n = A[0].length;
		for (var j = 0; j < n; j++) {
			B.push([]);
			for (var i = 0; i < m; i++) {
				B[j].push(A[i][j])
			}
		}
		return B
	},
	tableL = function (A, row, col) {/* 一维数组Line	转成二维表格（指定列数或行数） 分组 */
		var B = [], l = A.length, n = col || Math.ceil(l / row), m = row || Math.ceil(l / col), c = 0;

		for (var i = 0; i < m; i++) {
			if (c == l) { break }
			var a = [];
			for (var j = 0; j < n; j++) {
				if (c == l) { break }
				a.push(A[c]);
				c++;
			}
			B.push(a);
		}
		return B
	},
	ztable = function (A, nobox, spacing) { var t = mtrx(A, '.', '.', spacing || '', 'rc  _'); return nobox ? t : boxed(t) },
	det = function (A, spacing, tiny) { var al = arguments.length; return al >= 2 ? (spacing?'\\def\\arraystretch{'+spacing+'}':'')+'\\begin{vmatrix}' + Arrf(function (x) { return kfrac(x.join(' & '), 1, tiny || '') }, A).join(' \\\\ ')
		.replace(/⋰/g,'\\iddots') + '\\end{vmatrix}' : SCtv('bdl bdr inblk alignc', Table('', A)) },
	zdet = function (A, spacing) { return det(Arrf(ZLR, A), spacing) },
	kdet = function (A, fracOff) { return det(A, /frac/.test(A) || !fracOff && /\//.test(A) ? 1.5 : '', fracOff ? '' : 't') },

	lp = function (l, v, zM) { var t = arguments.length == 1, t3 = arguments.length >= 3; return zM ? '\\left' + (l || '\\{') + v + '\\right.' : (!t && !l ? '' : SCtv('inblk xxlarge', t ? '{' : l)) + SCtv('inblk alignl', t ? l : v) },
	rp = function (v, r, zM) { return arguments.length == 3 ? '\\left.' + v + '\\right' + (r || '\\{') : SCtv('inblk alignr', v) + (r === '' ? '' : SCtv('inblk xxlarge', r || '}')) },
	lrp = function (l, v, r, zM) { var t = arguments.length == 1, t4 = arguments.length >= 4; return t4 ? (l || '\\' + (zM || 'bigg') + 'l(') + v + (r || '\\' + (zM || 'bigg') + 'r)') : SCtv('inblk xxlarge', t ? '(' : l) + sci(t ? l : v) + SCtv('inblk xxlarge', t ? ')' : r) },
	lrpfrac = function (a, b, l, r) { return lrp(l || '', frac(a, b, 'd'), r || '', '') }, genfrac = function (a, b, l, r, size, linethick) { return '\\genfrac' + (l || '(') + (r || ')') + '{' + (linethick === undefined ? '' : linethick + 'pt') + '}{' + (size || 0) + '}{' + a + '}{' + b + '}' },
	zp = function (v, c, l, r) {
		if (v === '') { return '' } var A = ['(', ')', '[', ']', '|', '/', '\\{', '\\}', '\\|', '\\langle', '\\rangle', '\\backslash', '\\lfloor', '\\rfloor', '\\lceil', '\\rceil', '\\uparrow', '\\updownarrow', '\\downarrow', '\\Uparrow', '\\Updownarrow', '\\Downarrow'],
			t = '()[]|/{}‖<>\\⌊⌋⌈⌉↑↕↓⇑⇕⇓';
		return lrp('\\left' + (c ? (A[t.indexOf(c[0])] || c[0]) : (l || '(')) + ' ', v, '\\right' + (c ? (A[t.indexOf(c[1] || c[0])] || c[0]) : (r || ')')) + ' ', '')
	},
	pp = function (v, c, l, r) { if (v === '') { return '' } return (c ? c[0] : (l || '(')) + v + (c ? c[1] : (r || ')')) },
	big = function (size, lr, lmr) {return '\\'+(['big','Big','bigg','Bigg'][size||0]+(lmr||''))+'()[]{}'[lr||0].replace(/[\{\}]/g,'\\$&') },
	frac = function (t, b, zM) { var nob = b == undefined, t3 = arguments.length >= 3; return t3 ? '\\' + (/^[td]$/.test(zM) ? zM : '') + 'frac{' + (zM == 't' ? '' : '\\displaystyle{}') + (zM == 'p' ? '∂' : '') + t + '}{' + (zM == 't' ? '' : '\\displaystyle{}') + (zM == 'p' ? '∂' : '') + b + '}' : SCtv('inblk alignc', SCtv('alignc', nob ? t[0] : t) + DCtv('fracline') + SCtv('alignc', nob ? t[1] : b)) },

	root = function (t, n, s, zM) {
		return arguments.length >= 4 ? '\\sqrt' + (n && +n != 2 ? '[' + n + ']' : '') + '{' + t + '}' : SCtv('rootleft inblk notm" data-size="' + (s || 1), DCtv('rootleftline" data-index="' +
			(n && !/^[234]$/.test(n) ? n : '')) +
			SCtv('symbol', /^[34]$/.test(n) ? '∛∜'[+n - 3] : '√')) + sci(DCtv('fracline') + t)
	},

	piece = function (A, r) { return arguments.length >= 2 ? mtrx(A, ['\\{', '.', '\\{'][+r], (+r ? '\\}' : '.'), '', ' ') : '\\begin{cases} ' + (A[0] instanceof Array ? Arrf(function (a) { return a[0] + (a[1] ? ' & ' + a[1] : '') }, A) : A).join(' \\\\ ') + ' \\end{cases}' },



	sceg = function (s, substr, hiddenpre, hiddensuf) { var v = '' + s; return SCtv('eg" tip=copy2input data-eg="' + (hiddenpre || '') + fnq('' + s)+ (hiddensuf || '') , XML.encode(typeof substr == 'number' ? (substr < 0 ? v.substr(substr) : v.substr(0, substr)) : v)) },
	sceg2 = function (s, substr, hiddenpre, hiddensuf) { var v = '' + s; return SCtv('eg eg2" tip=copy2input data-eg="' + (hiddenpre || '') + fnq('' + s)+ (hiddensuf || ''), XML.encode(typeof substr == 'number' ? (substr < 0 ? v.substr(substr) : v.substr(0, substr)) : v)) },
	scegj = function (s, substr, c) { var v = '' + s; return SCtv('eg js' + (c ? ' ' + c : '') + '" tip=copy2input data-eg="' + fnq('' + s), XML.encode(typeof substr == 'number' ? (substr < 0 ? v.substr(substr) : v.substr(0, substr)) : v)) },
	scegc = function (s, substr, c) { var v = '' + s; return SCtv('eg' + (c ? ' ' + c : '') + '" tip=copy2input data-eg="&lt;' + fnq('' + s) + ' /&gt;&&', XML.encode(typeof substr == 'number' ? (substr < 0 ? v.substr(substr) : v.substr(0, substr)) : v)) },
	scegn = function (s, substr, c) { var v = '' + s; return SCtv('eg node' + (c ? ' ' + c : '') + '" tip=copy2input data-eg="'+s, XML.encode(typeof substr == 'number' ? (substr < 0 ? v.substr(substr) : v.substr(0, substr)) : v)) },
	
	zMath = function (v) { return SCtv('zMath" title="' + v, v) };



var FNS = {
	'share': 'addthis Share.ico'
}, Random = function (n, digits) {//从1～n中随机选1个数字		指定digits，则随机给出一个n位10进制数（文本形式）
	if (digits) {
		var s = '' + Math.round(Math.random() * (10 - 1) + 1);
		for (var i = 1; i < n; i++) {
			s += Math.round(Math.random() * (10 - 1))
		}
		return s
	}
	return Math.round(Math.random() * (n - 1) + 1)
}, RandomColor = function (i) {
	var c = '#' + ('00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).substr(-6);
	if (i > 1) {
		return [c].concat(RandomColor(i - 1))
	} else {
		return c
	}

}, jSoff = JSON.stringify;

function zlr(pre, s, sep) { var t = (sep === undefined ? ' ' : sep) + pre; return pre + s.split(' ').join(t) }
function zlr2(s, suf, sep) { var t = suf + (sep === undefined ? ' ' : sep); return s.split(' ').join(t) + suf }
function zlr3(pre, s, suf, sep) { return zlr(pre, zlr2(s, suf), sep) }
function zlrA(pre, A) { return Arrf(function (t) { return pre + t }, A) }
function zlrA2(A, suf) { return Arrf(function (t) { return t + suf }, A) }
function zlrA3(pre, A, suf) { return Arrf(function (t) { return pre + t + suf }, A) }


function ZLR(s0, s1, s) {
	var al = arguments.length;
	if (al == 1) { return s0.split(' ') }
	if (typeof (s1) == 'number') {

		try {
			return Array(s1 + 1).join(s0);
		} catch (e) {
			console.log(s1, e)
		}
	} else {
		return zlr(s0, s1).split(al < 3 ? ' ' : s);
	}
}
function copyA(s, n) {
	//return ZLR(s+'\n',n).trim().split('\n')
	var a = [];
	for (var i = 0; i < n; i++) {
		a.push(s);
	}
	return a;
}

function ZLR3(preA, sA, sufA, sep) {//拼接字符串 ⋯后面的指数忽略
	var n = sA.length, s = '', PA = preA instanceof Array, SA = sufA instanceof Array, sp = sep === undefined ? ',' : sep;

	for (var i = 0; i < n; i++) {
		s += (sA[i] === '⋯' ? '⋯' : (PA ? preA[i] : preA) + sA[i] + (SA ? sufA[i] : sufA)) + sp;
	}
	return s.substr(0, s.length - sp.length)
}

function imgFav(t) { return 'chrome://favicon/size/16@1x/' + (t.indexOf(Hs) == 0 ? Hs : H) + H_W1(t) }

function altTxt(t) { return (t || '').replace(/[\s\r?\n]+/g, ' ').replace(/\\/g, '').trim() }
function pathTxt(t, single) {
	return (t || '').replace(/\\/g, '/').replace(/(\s*\/+\s*)/g, '/').trim()
		.replace(/^\/+|\/+$/g, '').replace(/["\\:\?\*<>\|]/g, '-').replace(/\//g, single ? '_' : '/').replace(/~/g, '_')
}
function replaceNodeInner(str,node,f,ignoreCase){
	return str.replace(new RegExp('<'+node+'>([\\s\\S](?!<\\/'+node+'>))+[\\s\\S]?<\\/'+node+'>','g'+(ignoreCase?'i':'')),
		function(t){var nl=node.length;return f(t.substr(nl+2,t.length-nl*2-5).trim())}
	);
}

function CntN(t, i) {
	var arr = (t || '').replace(/[\s\(\)]/g, '').split('-'), tArr = Array(4), t;

	if (arr.length < 2) { tArr[2] = 1; tArr[3] = 1 } else {
		t = arr[1].split('/');
		tArr[2] = t[0];
		if (t.length < 2) { tArr[3] = t[0] }
	}
	t = arr[0].split('/');
	tArr[0] = t[0];
	if (t.length < 2) { tArr[1] = t[0] }

	return Number(tArr[i || 0]);
}
function Cnt(n, n2, m, m2) {
	var arg = arguments.length, t1 = n, t2 = '';

	if (arg >= 2) {
		t1 = n + (n == n2 ? '' : '/' + n2);
		if (arg > 2) {
			t2 = m + (m == m2 ? '' : '/' + m2);
			t2 = t2 == '1' ? '' : '-' + t2;
		}
	}
	return ' (' + t1 + t2 + ')'
}


function spanRed(t) { return SC + 'red>' + t + sc }
function spanHotk(t) { return SC + 'hotk>' + t + sc }

function q_key(s, a, ins, noAppend, hotk) {
	var tR = RegExp(a), tr = RegExp(a, 'i'), inS = ins ? '<ins>$&</ins>' : '&$&', t;
	t = tR.test(s) ? s.replace(tR, inS) : ((tr.test(s) || noAppend) ? s : s + '(' + a + ')').replace(tr, inS);
	return hotk ? t.replace(/\(.+\)/, spanHotk(a)) : t;
}



function scrollH() { return Math.max(document.body ? document.body.scrollHeight : 1, document.documentElement.scrollHeight) }
//document.body.scrollHeight = $('body').height() = document.body.clientHeight > document.documentElement.scrollHeight

function scrollW() { return Math.max(document.body ? document.body.scrollWidth : 1, document.documentElement.scrollWidth) }
//return $('body').width() || document.documentElement.scrollWidth
//console.log(document.body.scrollWidth , $('body').width() , document.body.clientWidth ,document.documentElement.scrollWidth)


function Scroll(t) {
	if (/scroll[TB]$/.test(t)) { document.documentElement.scrollTop = (t == 'scrollT' ? 0 : scrollH()) }
	if (/scroll[LR]$/.test(t)) { document.documentElement.scrollLeft = (t == 'scrollL' ? 0 : scrollW()) }

	if (/scroll(Up|Down)/.test(t)) { document.documentElement.scrollTop = (document.documentElement.scrollTop + $(window).height() * (t == 'scrollDown' ? 1 : -1)) }

	//window.innerHeight > document.documentElement.clientHeight = $(window).height()
	if (/scroll(Left|Right)/.test(t)) { document.documentElement.scrollLeft = (document.documentElement.scrollLeft + $(window).width() * (t == 'scrollRight' ? 1 : -1)) }
	//console.log(window.innerWidth ,'>', document.documentElement.clientWidth ,'=',$(window).width())


	if (t == 'scrollY') { document.documentElement.scrollTop = window.scrollY }
	if (t == 'scrollX') { document.documentElement.scrollLeft = window.scrollX }
}

function titleRe(t) { document.title = t }

function Node(node) {
	var t = $(node);
	$('iframe').each(function () {
		try {
			//if(this.contentDocument){
			t = t.add($(this.contentDocument.body).find(node));
			//console.log(node, t.length, this.src);
			//}
		} catch (e) {
			return t
			console.log('iframe err', e);
		}

	});
	return t;
}
function uniPush(A, x, ord) {//ord指定按序插入：0不考虑原数组是否升序降序 1：已知A升序 -1：已知A降序
	if (A.indexOf(x) < 0) {
		if (ord) {
			var j = 0;
			if (ord == 1) {
				for (var i = A.length - 1; i--; i > -1) {
					if (A[i] < x) {
						A.splice(i, 0, x);
						return x
					}
				}
				A.unshift(x)
			} else {
				for (var i = A.length - 1; i--; i > -1) {
					if (A[i] > x) {
						A.splice(i, 0, x);
						return x
					}
				}
				A.unshift(x)
			}

		} else {
			A.push(x)
		}
	}
}
function attr2dataset(t) {
	return t.replace(/data-(.+)/, 'dataset.$1').replace(/-[^-]+/g, function (a) { return a.substr(1, 1).toUpperCase() + a.substr(2) })
}
function urlArr(jQExp, attr, attr2) {
	var jQ = jQExp || 'a[href]:has(img)', t = [], a, s;
	Node(jQ).each(function () {
		if (attr) {
			if (attr == 'style') {
				s = $(this).attr(attr) || '';
			} else {
				s = eval('this.' + attr2dataset(attr)) || ''
			}
		} else {
			s = this.href
		}
		if (attr2) {
			if (attr2 == 'style') {
				a = $(this).attr(attr2) || '';
			} else {
				a = (eval('this.' + attr2dataset(attr2)) || '').trim()
			}
			a += '\t';
		} else {
			a = ''
		}
		if (s && s.indexOf('javascript:') < 0 && t.indexOf(a + s) < 0) { t.push(a + s) }
	});
	return t;
}
function tableArr(jQExp, type) {//type=str/arr/csv
	var jQ = jQExp || 'table', typ = type || 'str', isCSV = typ == 'CSV', isA = typ == 'arr', t = [];

	Node(jQ).children().each(function () {
		$(this).children().each(function () {
			var s = [];
			$(this).children().each(function () {
				var td = $(this).text().trim();
				if (isCSV) {
					if (/"/.test(td)) {
						td = td.replace(/"/g, "'");
					}
					if (/,/.test(td)) {
						td = '"' + td + '"';
					}
				}
				s.push(td);
			})
			t.push(isA ? s : s.join(isCSV ? ',' : '\t'))
		})
	});
	if (typ != 'arr') {
		t = t.join('\n')
	}
	return t;
}

function isArr(obj, dim) { return obj instanceof Array && (dim ? obj[0] instanceof Array : 1) } //Object.prototype.toString.call(obj) === '[object Array]'} //x instanceof Array
function isStr(o) { return typeof o == 'string' }
function isObj(o) { return typeof o == 'object' }
function isVar(o) { return /^[a-zα-ω]$/i.test(o) }

function hasVar(o) {
	if (isArr(o)) {
		for (var i = 0; i < o.length; i++) {
			if (hasVar(o[i])) {
				return true
			}
		}
		return false
	}
	return /[a-zα-ω]/i.test(o)
}


function fn0(k) { return encodeURIComponent(k) }
function fn1(k) { return decodeURIComponent(k) }
function fna(k) { return k.replace(/ /g, '+') }
function fna0(k) { return fn0(k).replace(/%20/g, '+') }
function fnb(k) { return k }
function fnc(k) { return escape(k) }
function fnd(k) { return k.replace(/ /g, '_') }
function fne(k) { return escape(k.replace(/ /g, '-')) }
function fnt(k) { return escape(H_d(k)) }
function fnx(k) { return k.replace(/^<!\[CDATA\[|\]{2}>$/g, '') }
function fnr(k) { return k.replace(/\\/g, '\\\\') }
function fnq(k) { return k.replace(/"/g, '&#34;') }
function fnv0(k) { return k.replace(/^\$|\$$/g, '') }
function fnv(k) { return k.replace(/\$[^\$]+\$/g, function (t) { return eval(fnv0(t)) }) }


function fns(webid, url, title, smry, pic) {
	var arr = (FNS[webid] || '').split(' '), p = pic ? '&pic=' + pic : '', str, k, web = webid;
	if (webid == 'share') { web = '' }
	str = 'addthis.com/bookmark.php?pubid=ra-4eeb29d528c674a8&description';

	return H + 'www.' + str + '=' + fn0(smry) + web + '&url=' + url + '&title=' + fn0(title);
}


function dataURItoBlob(dataURI) {
	var byteStr = atob(dataURI.split(',')[1]);
	var array = [];
	for (var i = 0; i < byteStr.length; i++) {
		array.push(byteStr.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

function H_u(t) { return (t || '').replace(/[\?&]utm_.+=.*&utm_.+=.*&utm_.+=[^#]*/, '') }
function H_w(t) { return (t || '').replace(/^https*:[/]{2}/, '') }
function H_w1(t) { return (t || '').replace(/^http:[/]{2}/, '') }
function H_W(t) { return H_w(t).replace(/[/\?].*$/, '') }
function H_W1(t) { return H_W(t).replace(/.+\.(.*\.co.*)/, '$1') }
function H_d(t) { return H_W(t).replace(/^www\./, '') }
function H_h(F, H) { var f = H_W(F), h = H_w(H); if (h == f || h == f + '/') { h = '' } return h }

function H_a(u, base) {

	var b = base || (location.origin+location.pathname);
	if(/\?.+\//.test(b)){
		b=b.replace(/\?.+/,'')
	}

	if (b.indexOf('/', 8) > 0) {
		var b0 = b.substr(0, b.indexOf('/', 8)) + '/';
		var b1 = b.substr(0, b.lastIndexOf('/')) + '/';
	} else {
		var b0 = b + '/';
		var b1 = b + '/';
	}

	if (/chrome-extension:\/\/[^\/]+\./.test(u || '')) {
		return u.replace('chrome-extension', 'http');
	}
	var t = (u || '').replace(/chrome-extension:\/\/[^\/]+/, '').replace(/\n/g, '').trim();
	if (!t) { return "" }

	if (/^file/.test(b) && /^\/[A-Z]:\//i.test(u)) {
		return 'file://' + u
	}

	imgPreReData.lastIndex = 0;
	if (imgPreReData.test(t) || /^(blob|chrome|file):[/]{2}/.test(t)) { return t.replace(/\s/g, '') }
	if (/^\?/.test(t)) { return b.replace(/\?.+/, t) }

	var src = t.replace(/[/\\]{2,}/g, '//');
	imgPreRe.lastIndex = 0;
	if (!src.match(imgPreRe)) {
		if (t.substr(0, 2) == '//') {
			src = b.split('//')[0] + t;
		} else if (t.charAt(0) == '/') {
			src = b0 + t.substr(1);
		} else if (t.match(/\.\.[/].+/)) {
			var i = t.lastIndexOf('../') + 3;
			var j = t.slice(0, i).split('../').length * (-1);
			if (b1 == b0) {
				var tmpAry = (b1 + '/').split('/');
			} else {
				var tmpAry = b1.split('/');
			}
			src = tmpAry.slice(0, j).join('/') + '/' + t.substr(i);

		} else {
			src = b1 + t.replace('./', '');
		}
	}

	return src;
}

function H_o(u,o) {

	var url = u || window.location.href, ha=location.hash;
	var search = url.substring(url.lastIndexOf('?') + 1);
	var obj = {};
	var reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, function (rs, $1, $2) {
		var name = fn1($1);
		var val = '' + fn1($2);
		obj[name] = val;
		return rs;
	});
	if(o){
		var s='';
		$.each(o,function(k,v){
			obj[k]=v;
		})
		$.each(obj,function(k,v){
			s+='&'+k+'='+v
		})
		return url.replace(/[#\?].+/,'')+s.replace(/^&/,'?')
	}
	return obj;
}

function html2txt(h) { return $('<b>' + h + '</b>').text().trim() }
function html2html(h) { return $('<div>' + h + dc).html().trim() }
function csv2A(t){
	var X=t.replace(/("")+/g,function(x){return 'zZlLrR'.repeat(x.length/2)});
	while(/"/.test(X)){
		if(/^[^"]*,"[^"]*"[^,]/.test(X) || /^"[^"]*"[^,]/.test(X)){
			X=X.replace(/"([^"]*)"/,'$1')
		}else if(/^[^"]*","/.test(X)){
			X=X.replace(/","/,'ZzLlRr')
		}else{
			X.X.replace(/"/,'zZlLrR')
		}
	}
	X=X.replace(/zZlLrR/g,'"');

	return Arrf(function(x){return x.replace(/ZzLlRr/g,',')},X.split(','))
}

function saveText(t, filename) {
	var mime = 'text/plain';
	saveAs('data:' + mime + ';charset=utf-8;base64,' + Base64.encode(t), filename)
}
function saveAs(Url, filename, referer) {
	var blob = new Blob([''], { type: 'application/octet-stream' }), u = URL || webkitURL;
	var url = u.createObjectURL(blob);
	var a = document.createElementNS(xhtml, 'a');
	if (referer) {
		console.log(referer);
		a.Referer = referer
	}
	a.href = Url;
	a.download = filename;
	var e = document.createEvent('MouseEvents');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);
	u.revokeObjectURL(url);
}
function svgAs(svg, base64) {
	var t = $(svg).attr('xmlns', xmlns).attr('xmlns:xlink', xmlnsxlink), xml = (new XMLSerializer).serializeToString(t[0]);
	return (base64 ? "data:image/svg+xml;base64," + Base64.encode(xml) : xml);
}

var svgf = {
	marker:function(id,rx,ry,w,h,vBox,chd){
		return '<marker id='+id+' refX='+(rx||8)+' refY='+(ry||5)+' markerWidth='+(w||4)+' markerHeight='+(h||4)+' viewBox="'+(vBox||'0 0 10 10')+'">'+chd+'</marker>'
	},
	path: function (d, strk,fil) {
		if(isArr(d)){
			return Arrf(function(x){return svgf.path(x, strk, fil)},d)
		}
		return '<path d="' + d + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></path>'
	}, 
	polygon: function (d, strk,fil) {
		if(isArr(d)){
			return Arrf(function(x){return svgf.polygon(x, strk, fil)},d)
		}
		return '<polygon points="' + d + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></polygon>'
	}, 
	text: function (text, yxSize, strk, fil) {
		if(isArr(text,2)){
			return Arrf(function(x){return svgf.text.apply(null, x)},text)
		}
		return '<text y="' + (yxSize ? yxSize[0] : 22) + '" x="' + (yxSize ? yxSize[1] : 6) + '" font-size="' + (yxSize ? yxSize[2] : 16) + '"'+(strk?' stroke="'+(strk||'white')+'"':'')+' fill="'+(fil||'white')+'">' + text + '</text>'
	}, 
	rect: function (x, y, w, h, strk,fil) {
		if(isArr(x,2)){
			return Arrf(function(i){return svgf.rect.apply(null, i)},x)
		}
		return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h || w) + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></rect>'
	}, 
	circle: function (cx, cy, r, strk,fil) {
		if(isArr(cx,2)){
			return Arrf(function(x){return svgf.circle.apply(null, x)},cx)
		}
		return '<circle r="' + (r||1) + '" cx="' + cx + '" cy="' + cy + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></circle>'
	}, 
	line: function (x1, y1, x2, y2, strk, fil) {
		if(isArr(x1,2)){
			return Arrf(function(x){return svgf.line.apply(null, x)},x1)
		}
		return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></line>'
	}, 
	ellipse: function (cx, cy, rx, ry, strk, fil) {
		if(isArr(cx,2)){
			return Arrf(function(x){return svgf.ellipse.apply(null, x)},cx)
		}
		return '<ellipse rx="' + rx+ '" ry="' + ry + '" cx="' + cx + '" cy="' + cy + '" stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'"></ellipse>'
	}, 
	id: function (id,v,noVieWBox,w, strk, fil) {
		if(isArr(id,2)){
			return Arrf(function(x){return svgf.id.apply(null, x)},id)
		}else if(isArr(id)){
			return Arrf(function(x){return svgf.id(x,v,noVieWBox,w)},id)
		}
		return '<svg id="' + id+ '"' + (noVieWBox?'':' viewBox="0 0 30 30"') + ' stroke="'+(strk||'white')+'" fill="'+(fil||'none')+'" stroke-width="'+(w||2)+'">'+(v||'')+'</svg>'
	},
	ani: function(id, attr,from,to,dur,cnt){
		return '<animate xlink:href="#'+id+'" attributeName="'+(attr||'stroke-dashoffset')
			+'" from="'+(from===undefined?3000:from)+'" to="'+(to===undefined?0:to)
			+'" dur="'+(dur||10)+'s" repeatCount="'+(cnt||'indefinite')+'" />'
	},
	obj2js: function (obj, path, haschd) {
		var o=$(obj), os={
			marker:function(){
				var id=o.attr('id'), rx=o.attr('refX'), ry=o.attr('refY'), w=o.attr('markerWidth'), h=o.attr('markerHeight'), vBox=o.attr('viewBox'),
					chd=haschd?"'"+o.html().replace(/'/g,"\\'")+"'":'markerplaceholder';
				return `svgf.marker('${id}',${rx},${ry},${w},${h},'${vBox}',${chd})`

			},
			path: function () {
				var d=o.attr('d'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				return `svgf.path('${d}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			polygon: function () {
				var d=o.attr('points'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				if(path){
					return `svgf.path('${Arrf(function(x,i){i?(i==2?'L'+x:x):'M'+x},d.split(/[ ,]+/)).join(' ')+'z'}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
				}
				return `svgf.polygon('${d}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			text: function () {
				var text=o.text(), yxSize=[o.attr('y'),o.attr('x'),o.attr('font-size')], strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				return `svgf.text('${text.replace(/'/g,"\\'")}',[${yxSize}],'${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			rect: function () {
				var x=+o.attr('x'), y=+o.attr('y'),w=+o.attr('width'),h=+o.attr('height'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				if(path){
					return `svgf.path('M${x} ${y} H${x+w} V${y+h} H${x} V${y}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
				}
				return `svgf.rect(${x},${y},${w},${h},'${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			circle: function () {
				var cx=+o.attr('cx'), cy=+o.attr('cy'),r=+o.attr('r'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				if(path){
					return `svgf.path('M${cx} ${cy-r} A${r} ${r} 0 1 1 ${cx} ${cy+r}  ${r} ${r} 0 1 1 ${cx} ${cy-r}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
				}
				return `svgf.circle(${cx},${cy},${r},'${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			line: function () {
				var x1=o.attr('x1'), y1=o.attr('y1'),x2=o.attr('x2'),y2=o.attr('y2'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				if(path){
					return `svgf.path('M${x1} ${y1} L${x2} ${y2}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
				}
				return `svgf.line(${x1},${y1},${x2},${y2},'${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`

			}, 
			ellipse: function () {
				var cx=+o.attr('cx'), cy=+o.attr('cy'),rx=+o.attr('rx'),ry=+o.attr('ry'), strk=o.attr('stroke'),fil=o.attr('fil'), tf=o.attr('transform');
				if(path){
					return `svgf.path('M${cx} ${cy-ry} A${rx} ${ry} 0 1 1 ${cx} ${cy+ry}  ${rx} ${ry} 0 1 1 ${cx} ${cy-ry}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
				}
				return `svgf.ellipse(${cx},${cy},${rx},${ry},'${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`
			}, 
			svg: function () {
				var id=o.attr('id'), wd=o.attr('width')||o.width(), ht=o.attr('height')||o.height(), w=o.attr('stroke-width')||'', vBox=o.attr('viewBox'), 
					v=haschd?"'"+o.html().replace(/'/g,"\\'")+"'":'childplaceholder', strk=o.attr('stroke')||'',fil=o.attr('fil'), tf=o.attr('transform');
				return `svgf.id('${id+(wd||ht?'" width="'+wd+'" height="'+ht+'"':'')}',${v},'${vBox||1}','${w}','${strk+(tf?'" transform="'+tf:'')+(fil?",'"+fil+"'":'')}')`.replace(/,'','',''\)$/,')')

			},
			g: function () {
				/*
				var A=[];o.children().each(function(){A.push(os[this.tagName.toLowerCase()]())});
				return A.join('+')
				*/
				return "'"+o.html()+"'"
			}
		};
		
		//console.log(o[0].tagName.toLowerCase(), os[o[0].tagName.toLowerCase()]);
		return os[o[0].tagName.toLowerCase()]()
	},

}, svgs = {
	imgr: svgf.path('M11 5 H19 V15 H25 L15 25 5 15 H11 V5z')
	, home: svgf.path('M7 25 H23 V13 L15 5 7 13 V25 M12 25 V18 H18 V25z')
	, func: svgf.text('Fn')
	, code: svgf.text('JS', [22, 8, 16])
	, sech: svgf.circle(10, 10, 6) + svgf.line(14, 14, 24, 24)
	, weib: svgf.path('M22 18 L23 25 17 20 A10 8 0 1 1 22 18z')
	, wdgt: svgf.path('M5 15 Q10 5 15 15 T 25 15 M5 15 Q10 25 15 15 T 25 15')
	, dona: svgf.path('M15 8 C15 7 14 5 10 5 C4 5 4 10 4 10 C4 16 8 20 15 24 C22 20 26 16 26 12 C26 12 26 5 20 5 C17 5 15 7 15 8z')
	, qrcd: svgf.rect(8, 8, 5) + svgf.rect(18, 8, 5) + svgf.rect(8, 18, 5)
	, memo: svgf.circle(15, 16, 8) + svgf.path('M10 14 L14 20 20 10 M10 5 A6 6 0 0 0 5 10Z M20 5 A6 6 0 0 1 25 10Z')
	, text: svgf.path('M 7 6 H 23 V 16 A 10 10 0 0 1 13 26 H 7 V7 M10 12 H20 M10 17 H17 M10 22 H14')
	, cap: svgf.rect(5, 8, 20, 14)

},
	Time = {
		now: function (TDA) {
			var d = new Date(), t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.toTimeString().substr(0, 8).replace(/:/g, '.');
			if (/Time|Date/.test(TDA)) { t = t.split('_')[TDA == 'Time' ? 1 : 0] }
			return t;
		},
		now5: function (t) { var d = t || new Date(); return (d.getTime() + '').substr(5) },
		YMD: function (t, TDA) {
			var d = t || new Date(), t = [d.getFullYear(), (d.getMonth() + 1), d.getDate()].join('-') + '_' + [('0' + d.getHours()).substr(-2), ('0' + d.getMinutes()).substr(-2)].join(':');
			if (/Time|Date/.test(TDA)) { t = t.split('_')[TDA == 'Time' ? 1 : 0] }
			return t;
		},
		fromZH: function (t) {
			if (/^星期/.test(t)) {
				return Date.parse(t.replace(/星期., /, '').replace(/\S+月/, function (s) {
					return ZLR('Jan Feb Mar Apr May Jun Jul Aug Sept Oct Nov Dec')[ZLR('一 二 三 四 五 六 七 八 九 十 十一 十二').indexOf(s.replace('月', ''))]
				}))
			} else {
				return Date.parse(t)
			}
		},
		lastM: function (t) { var d = t || new Date(), m = d.getMonth(), jan = m == 0; return d.getFullYear() + (jan ? -1 : 0) + '-' + (jan ? 12 : d.getMonth()) },
		lastDate: function (fmt, tim, t) {
			var tm = (t || new Date()).getTime(), d0 = new Date(), d1 = new Date(), tO = { "y": 0, "M": 0, "w": 0, "d": 0, "H": 0, "m": 0, "s": 0, "S": 0 }, y = 0, m = 0, d = 0, ys = 0;
			if (/\d/.test(tim)) {
				//tim = \d+[yMwdHmsS]
				tO[tim.substr(-1)] = Number(tim.replace(/[A-z]/g, ''));
				d1.setTime(tm + (tO.w * 7 * 24 + tO.d * 24 + tO.H) * 3600 * 1000 + tO.m * 60 * 1000 + tO.s * 1000 + tO.S);
			}

			if (tO.M) {
				var dm=(d0.getMonth() + tO.M) % 12;
				tO.y += Math.floor((d0.getMonth() + tO.M) / 12);
				d1.setMonth(dm);
				if((d1.getMonth()-d0.getMonth()) % 12 !=tO.M){//修正误差  例如：2019-12-31 -1M, 是2019-11-30 而不是2019-12-1
					if(tO.M<0){
						d1.setMonth((dm+1)% 12,1);
						//console.log(dm, d1);
						d1.setTime(d1.getTime()-oneDay);
					}else{
						d1.setMonth(dm,1);
					}
				}
			}

			if (tO.y) { d1.setFullYear(d0.getFullYear() + tO.y) }

			if (fmt) {
				//format case sensitive! Dd Hh Mm q Ss y

				//yyyy-MM(OOO)-dd HHhh:mm:ss.SSS A/P 上/下午 DDD q

				var MM = d1.getMonth() + 1, HH = d1.getHours(), hh = HH == 12 ? 12 : HH % 12, o = {
					'M+': MM,
					'd+': d1.getDate(),
					'H+': HH,
					'h+': hh,
					'm+': d1.getMinutes(),
					's+': d1.getSeconds(),
					'S+': d1.getMilliseconds()
				}, week = { "0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六" };


				for (var k in o) {
					var r = new RegExp(k, 'g'), ok = o[k];
					if (r.test(fmt)) {
						fmt = fmt.replace(r, function (t) { return t.length == 1 ? ok : ('00' + ok).substr(-1 * t.length) })
					}
				}

				fmt = fmt.replace(/y+/g, function (t) { return (d1.getFullYear() + '').substr(4 - t.length) });

				return fmt.replace(/A[/]P/g, (HH < 12 ? 'A' : 'P') + 'M').replace(/上[/]下午/g, (HH < 12 ? '上' : '下') + '午')
					.replace(/D{3}/g, (d1 + '').split(' ')[0]).replace(/D/g, week[d1.getDay() + ''])
					.replace(/q/g, Math.ceil(MM / 3)).replace(/O{3}/g, (d1 + '').split(' ')[1]);
			}
			return d1
		},
		week: function (t, deltaDays) {
			var d = new Date();

			d.setTime(Date.parse(t || d) + (deltaDays || 0) * oneDay);

			var y = d.getFullYear(),
				days = Math.floor((d - Date.parse(y + '-1-1')) / oneDay),
				days2018 = Math.floor((d - Date.parse('2018-1-1')) / oneDay),
				A = [(days2018 % 7) + 1, Math.floor(days / 7), (days % 7) + 1];
			if (A[0] < 0) {
				A[0] += 7
			}
			return A.concat([y, d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()])
		},
		reg: function (t) {
			var o = {
				"M": "[个個]?(Month|月)",
				"S": "(milli|ms|毫秒)",
				"s": "[s|秒]",
				"m": "(m|分[钟鐘]?)",
				"H": "[个個]?[h小]",
				"d": "[d天]",
				"w": "[个個]?[w周星禮礼]",
				"y": "[y年]",
			}, n = { "〇": 0, "零": 0, "日": 0, "天": 0, "元": 1, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 }, M = {
				"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
			}, D = {
				"Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6
			};

			var s = t.replace(/公元/g, '').replace(/(周+|期|拜)[天日一二三四五六七八九]/, function (t) { return t + ' ' }).trim()
				.replace(/一十/g, '十').replace(/廿/g, '二十').replace(/卅/g, '三十')
				.replace(/[二三四五]十[一二三四五六七八九]/g, function (t) { return '' + n[t.substr(0, 1)] + n[t.substr(-1)] })
				.replace(/[二三四五]十/g, function (t) { return '' + n[t.substr(0, 1)] + 0 })
				.replace(/十[一二三四五六七八九]/g, function (t) { return '1' + n[t.substr(-1)] })
				.replace(/十/g, '10').replace(/[〇零元一二三四五六七八九]/g, function (t) { return n[t] })
				.replace(/[13]刻/, function (t) { return 15 * Number(t.substr(0, 1)) + '分钟' });

			if (/[点點时時]/.test(s) && !/小/.test(s)) {
				s = s.replace(/[点點时時分]/g, ':').replace(/半/g, '30').replace(/整/g, '00')
					.replace(/[13]刻/g, function (t) { return 15 * n[t.substr(0, 1)] }).replace(/毫?秒/g, '');
			}

			s = s.replace(/半/g, 0.5);

			var tim = (s.match(/[01]?\d(:[0-5]?\d)+/) || [''])[0];
			if (!tim & /[01]?\d:/.test(s)) { tim = s.match(/[01]?\d:/)[0] + '00' }
			if (tim && /下午|晚|夜|PM/i.test(s)) { tim = tim.replace(/^\d+/, function (t) { return Number(t) < 12 ? Number(t) + 12 : t }) }

			var yr = (s.match(/\d{4}/) || [''])[0], ys, ms, ds;
			if (yr) { s = s.replace(/\d{4}[-年/]?/, '') }
			//console.log(yr);
			var Md = (s.match(/[01]?\d[-月/][0-3]?\d/) || s.match(/\d+(\.\d+){2}/) || [''])[0]
				.replace(/\d+\./, '').split(/\D+/),
				MM = Md[0], dd = Md.length > 1 ? Md[1] : 0, tdy = /[今本当當这這]1?[天日]|(to|this )day/i.test(s);
			//console.log(Md, MM, dd, tdy);
			if (yr && !MM) {
				//.replace(/[月\./]/g,'-').split('-')
				if (/\d{8}/.test(t)) {
					Md = t.match(/\d{8}/)[0].substr(4);
					MM = Md.substr(0, 2); dd = Md.substr(2);
				} else {
					Md = (t.match(/\d{4}[-年/\.][01]?\d[-月/\.][0-3]?\d?/) || [''])[0].replace(/^\d+\D+/, '').split(/\D+/);
					MM = Md[0]; dd = Md.length > 1 ? Md[1] : 0;
				}
			}
			//console.log(Md, MM, dd);
			if (/[前去明后後]年|(last|next) year|yesteryear/i.test(s)) {
				ys = (/大.年/.test(s) ? 3 : (/[前后後]年|year (before|after)/i.test(t) ? 2 : 1)) *
					(/[前去]年|year before|(last |yester)year/i.test(s) ? -1 : (/[明后後]年|year after|next year/i.test(s) ? 1 : 0));
				if (tdy) {
					return Time.lastDate('yyyy-MM-dd ', ys + 'y') + tim;
				}
				yr = Time.lastDate('yyyy', ys + 'y');
			}
			//console.log(ys, yr);
			if (/[上下本当當这這][个個]?月|(last|next|this) month/i.test(s)) {
				ms = (/[上下]{2}.?月|month (before|after)/i.test(s) ? 2 : 1) *
					(/[上]1?[个個]?月|month before|last month/i.test(s) ? -1 : (/[本当當这這]1?[个個]?月/.test(s) ? 0 : 1));
				if (tdy) {
					return Time.lastDate('yyyy-MM-dd ', ms + 'M') + tim;
				}
				MM = Time.lastDate('MM', ms + 'M');

				dd = (s.match(/[0-3]?\d[日号號]/) || [''])[0];
				if (dd) { return (yr || Time.lastDate('yyyy')) + '-' + MM + '-' + dd + ' ' + tim }
			}

			if (/([上下本这這]1?[个個]?)?(周+|星期|[禮礼]拜)[天日\d]/.test(s)) {
				ds = Number(s.split(/周+|星期|[禮礼]拜/)[1].substr(0, 1).replace(/天|日/, 0)) - n[Time.lastDate('D')] +
					7 * (/[上下]{2}.?(周+|星期|[禮礼]拜)/.test(s) ? 2 : 1) *
					(/上1?[个個]*(周+|星期|[禮礼]拜)/.test(s) ? -1 : (/下1?[个個]*(周+|星期|[禮礼]拜)/.test(s) ? 1 : 0))
				return Time.lastDate('yyyy-MM-dd ', ds + 'd') + tim;
			}

			if (/last|next|this/.test(s)) {
				for (var k in D) {
					var Dk = D[k], r = new RegExp(k, 'i');
					if (r.test(s)) {
						ds = Dk - n[Time.lastDate('D')] +
							7 * (/last/i.test(s) ? -1 : (/next/i.test(s) ? 1 : 0))
						return Time.lastDate('yyyy-MM-dd ', ds + 'd') + tim;
					}
				}

			}

			if (/[前昨明后後]天|yesterday|tomorrow/i.test(s)) {
				ds = (/大.天/.test(s) ? 3 : (/[前后後]天|day (before|after)/i.test(t) ? 2 : 1)) *
					(/[前昨]天|day before|yesterday/i.test(s) ? -1 : 1);
				return (yr || Time.lastDate('yyyy')) + '-' + Time.lastDate('MM-dd ', ds + 'd') + tim;
			}
			if (tdy) { return (yr || Time.lastDate('yyyy')) + '-' + (MM || Time.lastDate('MM')) + '-' + Time.lastDate('dd') + ' ' + tim }

			if (!MM) {

				for (var k in M) {
					var Mk = M[k], r = new RegExp(k, 'i');
					if (r.test(s)) {

						MM = Mk;
						var tmp = s.split(r);
						tmp[0] = tmp[0].split(/\D+/);
						if (tmp[0].length > 1) { tmp[0] = tmp[0][tmp[0].length - 2] } else { tmp[0] = tmp[0][0] }
						tmp[1] = tmp[1].split(/\D+/);
						if (tmp[1].length > 1) { tmp[1] = tmp[1][1] } else { tmp[1] = tmp[1][0] }

						dd = tmp[0] || tmp[1] || 0;
						if (dd) { return (yr || Time.lastDate('yyyy')) + '-' + MM + '-' + dd + ' ' + tim }
					}
				}
			}

			if (MM || dd) { return (yr || Time.lastDate('yyyy')) + '-' + (MM || Time.lastDate('MM')) + '-' + (dd || '01') + ' ' + tim }



			for (var k in o) {
				var ok = o[k], r = new RegExp('\\d *' + ok, 'i'), nA = s.split(/[^\d\.]+/);

				if (r.test(s)) {

					return Time.lastDate('yyyy-MM-dd HH:mm:ss', (/later|后|後/i.test(s) ? '' : '-') +
						Number(nA[0] || nA[1]) + k);

				}
			}

			return (yr || Time.lastDate('yyyy')) + '-' + Time.lastDate('MM-dd ') + tim;
		},
		local: function (d, timOrDat) {
			if (d && timOrDat) { return timOrDat == 'Date' ? d.toLocaleDateString() : d.toLocaleTimeString() }
			return (d || new Date()).toLocaleString().replace(/:00$/, '').replace(/:00 /, ' ');
		},
		lite: function (d) {
			var n = new Date();
			if (d.getFullYear() != n.getFullYear()) { return d.toLocaleDateString() }
			var today = Date.parse((new Date()).toDateString());

			if (d >= today - oneDay && d < today) { return gM('yesterday') }

			if (d > today && d < Date.parse(Time.reg('tomorrow'))) {
				return d.toLocaleTimeString().replace(/:\d+$/, '').replace(/:\d+ /, ' ');
			}
			return d.toLocaleDateString().replace(/\D*20\d+\D*/, '');

		},
		str2date: function (s, func, timOrDat) {
			var tm = new Date();
			tm.setTime(Date.parse(s));
			if (func) {
				if (timOrDat) { return Time[func](tm, timOrDat) }
				return Time[func](tm);
			}
			return tm;
		}
	};


function attr2jSon(s) {
	//return JSON.parse(('{'+s+'}').replace(/=/g,':').replace(/ /g,',').replace(/([\w#]+-*\w*)/g,'"$1"'))
	return JSON.parse(('{' + s.trim().replace(/([^" ]+)=([^" ]+)/g, '"$1":"$2"').replace(/([^" ]+)=/g, '"$1":').replace(/=([^" ]+)/g, ':"$2"').replace(/ /g, ',') + '}'))
}
function jSon(str) {
	//return JSON.parse(str);
	//return eval('('+ Str +')');
	//return (new Function("return " + str))();
	var Str = (str || '').trim();
	try {
		return JSON.parse(str);
	} catch (e) {
		//	console.log(str);
		//	console.log(e);
		if (/^\{/.test(Str) && /\}$/.test(Str)) {
			var str0 = Str.replace(/^\{|\}$/g, '').replace(/,([^":]*):/g, ',"$1":').replace(/^([^":]*):/g, '"$1":');

			return JSON.parse('{' + str0 + '}');
		}
		return Str;
	}
}

function jSon2str(json) { //json is an array
	var str = '[';
	for (var i in json) {
		var tmp = '{';
		$.each(json[i], function (j, n) {
			tmp += '"' + j + '":"' + n + '",';
		});
		str += tmp.replace(/,$/, '') + '},';
	}
	return str.replace(/,$/, '') + ']';
}
function jSon2attr(json) {
	var str = '';
	$.each(json, function (j, n) {
		str += j + '="' + n + '" ';
	});
	return str.trim();
}

function urlTran(urls) {
	var tArr = urls.match(/\S+/gi);
	if (!tArr) { return '' }

	var patt0 = /^.+\[\*[^(\[\*)]+\].*$/;
	var patt1 = /\[\*[^(\[\*)]+\]/;	//[* ]
	var patt2 = /\d+-\d+/;
	//var patt3 = new RegExp(/\D+-\D+/);
	var patt4 = /^0\d+/;
	var patt5 = /[1-9]\d*/;
	var patt6 = /\[>\d*\]/;
	for (var i in tArr) {
		var u = tArr[i];
		imgPreRe.lastIndex = 0;
		if (!imgPreRe.test(u)) { u = H + u; tArr[i] = u }
		if (patt0.test(u)) {
			var tmpStr0 = u.match(patt1);	//[* ]
			var tmpAry3 = tmpStr0[0].substr(2, tmpStr0[0].length - 3).split(',');	//a-z,2,4,6-9
			for (var k in tmpAry3) {
				if (tmpAry3[k].indexOf('-') == -1) { continue }
				var s0 = tmpAry3[k].split('-')[0];
				var s1 = tmpAry3[k].split('-')[1];
				var tmpStr = s0;

				if (patt2.test(tmpAry3[k])) {	//02-45
					if (patt4.test(s0)) {		//00-18
						var t = 1;
						if (patt5.test(s0)) { t = parseInt(s0.match(patt5)[0]) + 1 }
						for (var l = t; l <= parseInt(s1.match(patt5)[0]); l++) {
							tmpStr += ',' + '00000'.substr(0, s0.length - ('' + l).length) + l;  //!no more than 5 '0's
						}
					} else {
						for (var l = parseInt(s0) + 1; l <= parseInt(s1); l++) { tmpStr += ',' + l }
					}
				} else {
					for (var l = s0.charCodeAt(0) + 1; l <= s1.charCodeAt(0); l++) { tmpStr += ',' + String.fromCharCode(l) }
				}
				tmpAry3[k] = tmpStr;
			}

			var tmpAry = tmpAry3.join(',').split(',');
			tArr[i] = '';
			for (var k in tmpAry) {
				tArr[i] += u.replace(tmpStr0[0], tmpAry[k]).replace(patt6, tmpAry[k]) + ' ';
			}
		}
	}
	var t = tArr.join(' ').match(/\S+/gi).join('\n');
	if (patt1.test(t)) { return urlTran(t) } else { return t }
}

function hex2rgba(h, a, arr) {
	var Arr = [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16), isNaN(+a) ? 1 : +a];
	if (arr) { return Arr }
	return 'RGBA(' + Arr.join(',') + ')';
}
function rgb2hex(r, g, b) {//r*256^2 + g*256 + b = r*2^16 + g*2^8+ b
	return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).substring(1);
}

function bigintsim(s, toLaTeX, vars){// + - * /	vars指定字母变量赋值（整数）
	if(toLaTeX){
		return s.replace(/\)\*\(/g,')(').replace(/\*/g,'‧')
			.replace(/\*\*/g,'^').replace(/\d+/g,'{$&}')
			.replace(/>=/g,'≥').replace(/<=/g,'≤')
			.replace(/!=/g,'≠').replace(/==/g,'=')
	}
	var t=s||'';
	if(vars){
		if(vars['n']){
			t=t.replace(new RegExp('n','g'), '('+vars['n']+')')
		}
		$.each(vars,function(i,v){
			if(i!='n'){
				t=t.replace(new RegExp(i,'g'), '('+v+')')
			}
		});
	}

	return eval(t.replace(/[\{\[]/g,'(').replace(/[\}\]]/g,')')
		.replace(/\)(\d)/g,')*$1').replace(/(\d)\(/g,'$1*(')
		.replace(/\)\(/g,')*(').replace(/\d+/g,'($&n)')
		.replace(/\^/g,'**').replace(/‧/g,'*')
		.replace(/≥/g,'>=').replace(/≤/g,'<=')
		.replace(/≠/g,'!=').replace(/([^\!><=])=([^\!><=])/g,'$1==$2')
		)
}

function bodyFocus() {
	$('body')[0].tabIndex = 0;
	$('body').focus();
}
function imgdatasrc(src, u) { return src ? '<img data-src="' + H_a(src, u || '') + '" />' : '' }
var OffSet = function (obj, r, c, build) {//表格单元格偏移，如果找不到，则新建tr、td，扩充为大表
	var p = obj.parent(), pi = p.index(), pp = p.parent(), ppc = pp.children(), ppcl = ppc.length, tr = ppc.eq(pi + r), i = obj.index(), pcl = p.children().length;
	if (build) {
		var tds = c > 0 ? Math.max(i + c + 1, pcl) : pcl - Math.min(i + c, 0), tdsAdd = tds - pcl;
		var trsAdd = r > 0 ? Math.max(pi + r + 1 - ppcl, 0) : -Math.min(pi + r, 0), trs = trsAdd + ppcl;
		var s = '<tr>' + ZLR('<td></td>', tds) + '</tr>', sAdd = ZLR('<td></td>', tdsAdd);
		if (trsAdd) {
			if (r > 0) {
				pp.append(ZLR(s, trsAdd));
			} else {
				pp.prepend(ZLR(s, trsAdd));
			}
		}
		if (tdsAdd) {
			if (i + c + 1 > pcl) {
				ppc.append(sAdd)
			} else if (i + c + 1 < 0) {
				ppc.prepend(sAdd)
			}
		}

		tr = pp.children().eq(trsAdd ? (r > 0 ? trs - 1 : 0) : pi + r);
	}

	return tr.children().eq(tdsAdd ? (c > 0 ? tds - 1 : 0) : i + c);

}, Admin = {
	testAjax: function (t) { $.ajax({ type: 'get', url: t, success: function (d) { saveText(d, '123.txt') } }) },
	testAjax2: function (t,e,f) { $.ajax({ type: 'get', url: t, success: function (d) { var x=$(d).find(e).text();console.log(f?f(x):x) } }) }
}, fCC = function (A) {
	return String.fromCharCode.apply(null, A)
}, sizeKB = function (sz) {
	var s=sz||0;
	s=s/1024;
	if(s>=1024){s=(s/1024).toFixed(1)+'MB'}else{s=s.toFixed(1)+'KB'}
	return s
}, seqA = function (start, n, type, step) {//序列: 初始值，个数n，类型，步长	参数 n小于0时，逆序
	/*
	var isBig=typeof start=='bigint', t=[],y=type||'arith',p=step==undefined?(isBig?1n:1):step, N=n>=0?n:-n;
	for(var i=(isBig?0n:0);i<N;i++){
		
	*/

	var t = [], y = type || 'arith', p = step == undefined ? 1 : step, N = n >= 0 ? n : -n;
	for (var i = 0; i < N; i++) {
		t.push(y == 'arith' ? start + i * p : (y == 'geo' ? start * Math.pow(p, i) : ''));	//Math.pow(p,i)	**
	}
	if (n < 0) {
		t.reverse();
	}

	return t
}, seqsA = function (s) {//连续序列：缩写 ,~
	var t = s.replace(/\d+~\d+/g, function (t) { var tA = t.split('~'); return seqA(+tA[0], +tA[1] - (+tA[0]) + 1).join() })
		.replace(/[A-z]~[A-z]/g, function (t) { var tA = t.split('~'), t0 = tA[0].charCodeAt(0), t1 = tA[1].charCodeAt(0); return fCC(seqA(t0, t1 - t0 + 1)).split('').join() })
		.split(',')
	return t
}, diff = function (a) {
	var A = [].concat(a); Arrf(function (t, i) { if (i) { A[A.length - i] -= A[A.length - i - 1] } }, A); return A //差分运算
}, antidiff = function (a) {
	var A = [].concat(a); Arrf(function (t, i) { if (i) { A[i] = t + A[i - 1] } }, A); return A //		累计求和（逆差分运算）

}, Arri = function (A, i) {//提取矩阵第i列（从0开始编号）	负数表示从最后1列往前
	var t = [];
	for (var j = 0; j < A.length; j++) { t.push(A[j][i < 0 ? A[j].length + i : i]) }
	return t
}, ArrI = function (A, a, start) {//提取数组元素，按照索引集和起始偏移
	var t = [];
	for (var j = 0; j < a.length; j++) { t.push(A[a[j] - (start || 0)]) }
	return t
}, subMtrx = function (A, i1, i2, j1, j2) {//提取矩阵的子矩阵，编号从1开始
	var t = [], J2 = j2 == undefined ? A[0].length : j2;//t.t='Mtrx'
	for (var i = i1 - 1; i < i2; i++) {
		var ti = [];
		for (var j = j1 - 1; j < J2; j++) { ti.push(A[i][j]) }
		t.push(ti);
	}
	return t
}, Arrf = function (f, A, rtnTyp) {//数组函数，循环次数确定
	if (A.length < 1) { return [] }
	var ty = rtnTyp || 'arr', g = function (j, k) {
		var t, ar = arguments, an = ar.length;
		if (ty == '-cp2') {
			for (var i = an - 1; i > 0; i--) {
				/*逆向二元迭代(递归)，返回一个数（从数组最后元素往前迭代，上次迭代结果，与数组中上一个元素，二元运算）
					
						连幂式 Arrf(msup,[1,2,3,4],'-cp2')
					*/
				if (i == an - 1) { t = ar[i] } else {
					t = f(ar[i], t)
				}

			}
			return t
		}


		for (var i = 1; i < an; i++) {
			if (ty == 'arr') {//映射数组
				if (i == 1) { t = [] }
				//t.push(f(ar[i]))
				if (f.length > 1 && !f.name) {/*匿名函数第2个参数是索引值i（此时从1开始计数）
					
					
					
					console.log(f.toString(),f.valueOf());
					用f.length>1
					无法区分是匿名函数，还是有名称的函数。
					用f.name 区分是否匿名
					
					但可以用toString区分 function abc()	/^function \(/.test(f.toString())
					用window[函数名]，区分是否全局函数


var A=[2,3,4,5,7];Arrf(function(t,i){if(i){A[i]=t+A[i-1]}},A);A		累计求和（逆差分运算）
var A=[2,3,4,5,7];Arrf(function(t,i){if(i){A[A.length-i]-=A[A.length-i-1]}},A);A	差分运算

					*/

					t.push(f(ar[i], i - 1))
					//	t.push(f(ar[i]))
				} else {
					t.push(f(ar[i]))
				}

			} else if (ty == 'str') {//字符串累加
				if (i == 1) { t = '' }
				t += f(ar[i])
			} else if (ty == 'cp1') {/*一元迭代(递归)，返回数组（每次迭代都有步骤记录，此时数组A是形式需要：只需要满足迭代次数等于A.length）
				典型例子：
					等差数列（过程）		Arrf(function(t){return tn+2n},[0].concat(Array(10)),'cp1')
					等比数列 （过程）	Arrf(function(t){return tn*2n},[1].concat(Array(10)),'cp1')
					Fibonacci 斐波那契数列（过程） Arri(Arrf(function(t){return !t?[0n,1n]:[t[1],t[0]+t[1]]},Array(10),'cp1'),1)
					阶乘数列	Arri(Arrf(function(t){return !t?[1n,1n]:[t[0]+1n,(t[0]+1n)*t[1]]},Array(10),'cp1'),1)
等差前n项和（过程） Arrf(function(t){return !t?[1]:t.concat(t[t.length-1]+5)},Array(10),'cp1')

高阶差分（过程）		Arrf(diff,[[2,4,5,8,10]].concat(Array(10)),'cp1')
高阶逆差分（过程） Arrf(antidiff,[[2,4,5,8,10]].concat(Array(10)),'cp1')


				*/
				if (i == 1) { t = [f(ar[i])] } else {
					t.push(f(t[t.length - 1]))
				}
			} else if (ty == 'cp2') {/*二元迭代(递归)，返回一个数（上次迭代结果，与数组中下一个元素，二元运算）
				
					Fibonacci 斐波那契 Arrf(function(t){return !t?[1n,1n]:[t[1],t[0]+t[1]]},Array(10),'cp2')[1]
					阶乘 Arrf(function(s,t){return s*t},seqA(1,7),'cp2')
					gcd
					lcm

等差前n项和 Arrf(function(t){return !t?[1]:t.concat(t[t.length-1]+5)},Array(10),'cp2')
高阶逆差分 Arrf(antidiff,[[2,4,5,8,10]].concat(Array(10)),'cp2')
高阶差分 Arrf(diff,[[2,4,5,8,10]].concat(Array(10)),'cp2')
				*/
				if (i == 1) { t = ar[i]; continue } else {
					t = f(t, ar[i])
				}
			}
		}
		return t
	}; return g.apply(null, [f].concat(A))

}, Arrfc = function (fA, x, p) {//多重函数迭代（从右向左迭代）	p是函数序列，均支持的参数
	var up = p === undefined, xisArr = isArr(x), t = xisArr ? [].concat(x) : x, fn = fA.length;

	for (var i = 0; i < fn; i++) {
		if (xisArr) {
			t = Arrf(up ? fA[fn - 1 - i] : function (s) { return fA[fn - 1 - i](s, p) }, t)
		} else {
			t = up ? fA[fn - 1 - i](t) : fA[fn - 1 - i](t, p)
		}
	}
	return t
}, ArrfcA = function (fA, A, p) {//多重函数（数组函数）递归（从左到右） 	初始值A是多层数组，递归后降维
	/*
		[f0,f1,f2] A[[[0],[0]],[[1],[1]]]
		f0()
		
		ArrfcA([ntimes,nadd,ntimes],[[['2','x'],['3','y']],[['4','x'],['5','y']]],1,1)
	*/
	var up = p === undefined, t;
	if (fA.length == 1) {
		//console.log(A);
		if (A.length == 1 || A.length == 2 && A[1] == undefined) {
			return A[0]
		}
		return fA[0](A, p)//fA[0].apply(null,up?[A]:[A,p])
	} else {
		var a = [];
		for (var i = 0; i < A.length; i++) {
			a.push(ArrfcA(fA.slice(1), A[i], p))
		}
		//return ArrfcA([fA[0]],a,p)
		return fA[0](a, p)
	}
}, Arr1 = function (A) {//数组每个元素都加1
	return Arrf(function (t) { return t + 1 }, A)
}, Arr_1 = function (A) {//数组每个元素都减1
	return Arrf(function (t) { return t - 1 }, A)
}, max = function (A) {
	return Arrf(Math.max, Arrf(function (x) { return x || 0 }, A), 'cp2')
}, min = function (A) {
	return Arrf(Math.min, Arrf(function (x) { return x || 0 }, A), 'cp2')

}, cartestian = function (A, typ) {//笛卡尔乘积 序列化	typ指定括号类型，用于字符串输出括号风格
	var t = [A.slice(0)], n = A.length, tmp = new Array(n), tp = typ || '()';
	for (var i = 0; i < n; i++) {//维数
		var Ai = A[i], Ain = Ai.length, AA = [];
		for (var j = 0; j < t.length; j++) {
			var tj = t[j], arr = Arrf(function (a) { var tt = [].concat(tj); tt[i] = a; return tt }, Ai);
			//arr.t='Set_Cartesian'; 注意concat会丢失arr.t信息
			AA = AA.concat(arr);
		}
		t = AA;
	}
	for (var i = 0; i < AA.length; i++) {
		AA[i].t = 'Set_Cartesian_' + tp;
	}
	return t

}, countA = function (A, noParse, index) {/*对数组中元素进行计数		参数noParse 指定不强制转换成同一类型（例如字符串与数字），进行判断相同
		参数index指定，同时返回原索引(第一次出现)
	返回二维数组：去重数组，相应重数数组, 索引数组（如指定index参数）。
	
	*/
	var a = [], b = [], x = [];
	for (var i = 0, l = A.length; i < l; i++) {
		var c = noParse ? A[i] : '' + A[i];//默认强制转换成字符串比较相同
		if (a.indexOf(c) < 0) {
			a.push(c);
			b.push(1);
			if (index) {
				x.push(i);
			}
		} else {
			//b[b.length-1]++;
			b[a.indexOf(c)]++;
		}
	}
	return index ? [a, b, x] : [a, b]

}, concat = function () {//数组中元素分别字符串拼接，得到新数组
	var ar = arguments, arl = ar.length, n = 1, t = [];
	for (var i = 0; i < arl; i++) {
		var ai = ar[i];
		if (isArr(ai)) {
			n = ai.length;
			break;
		}
	}

	for (var j = 0; j < n; j++) {
		var s = '';
		for (var i = 0; i < arl; i++) {

			var ai = ar[i];
			if (ai.length) {
				s += isArr(ai) ? ai[j] : ai;
			}
		}
		t.push(s)
	}
	return t
}, cartt = function (A) {//笛卡尔乘积 序列化后拼接为字符串数组
	return Arrf(function (t) { return t.join('') }, cartestian(A))

}, carttNext = function (A, Al) {/*笛卡尔乘积 求下一个索引数组，并赋值给A		如果成功返回1；如果下一个不存在，则返回0
	参数A是当前索引数组，Al是各分量的索引区间长度，构成的数组
	*/
	var l = A.length;
	for (var i = l - 1; i >= 0; i--) {
		if (A[i] < Al[i] - 1) {
			A[i]++;
			for (var j = i + 1; j < l; j++) {
				A[j] = 0;
			}
			return 1
		}
	}
	return 0
}, carttPrev = function (A, Al) {/*笛卡尔乘积 求上一个索引数组，并赋值给A		如果成功返回1；如果上一个不存在，则返回0
	参数A是当前索引数组，Al是各分量的索引区间长度，构成的数组
	*/
	var l = A.length;
	for (var i = l - 1; i >= 0; i--) {
		if (A[i]) {
			A[i]--;
			for (var j = i + 1; j < l; j++) {
				A[j] = Al[j] - 1;
			}
			return 1
		}
	}
	return 0

}, subwd = function (t, len) {/*字符串t，截取前len个字符，但如果正好在单词内部截取，则再往前截取，使得单词完整
	*/
	return t.length>len?(t[101]==' '?t.substr(0,len):t.substring(0,t.substr(0,len).lastIndexOf(' '))):t
	
}, split = function (t, r, noshift) {/*字符串t，按(中缀)正则split分成两个数组 A[匹配到的分隔符数组A[0], 被分割后得到的数组A[1]]
	如果不匹配返回字符串本身
	如果A[1]首项为空，shift一下（未指定noshift的默认情况下）
	*/
	var re, si = [0], ops = [], A = [];
	r.lastIndex = 0;
	if (r.test(t)) {
		if (!r.global) {//只匹配1次
			re = t.split(r)[0];
			A.push(re);
			re = t.substr(re.length);
			A.push(re.replace(r, ''));
			ops.push(re.substr(0, re.length - A[1].length));
			return [ops, A]
		}


		r.lastIndex = 0;
		while ((re = r.exec(t)) != null) {
			ops.push(re[0]);
			si.push(re.index + re[0].length);//存储下一个表达式截取起始位置
			//console.log('si',si,' ; ','ops',ops,' ; ','A',A.length,A);
			A.push(t.substring(si.slice(-2)[0], re.index));
			//	console.log('A',A.length,A);
		}
		A.push(t.substr(si.slice(-1)[0]));

		//	console.log('A',A.length,A);

		if (!noshift && A[0] == '') {
			A.shift();
			A[0] = ops[0] + A[0];
			ops.shift();
		}
		return [ops, A]
	}
	return t
}, snake = function (AB) {//蛇形拼接两数组，过滤掉空字符串	主要用于处理split后的数组
	var A = [], n = AB[1].length;
	for (var j = 0; j < n; j++) {
		for (var i = 1; i >= 0; i--) {
			if (AB[i][j] || AB[i][j] === 0) {
				A.push(AB[i][j])
			}
		}
	}
	return A



	//下列涉及排序、去重

}, Uniq = function (s,useSet) {//字符或数字（数组，逗号隔开）去重，结果会自动排序	此方法去重不彻底，换成 Array.from(new Set([])).sort().join(',')
	if(useSet){//只返回去重后的排序数组，不join
		return Array.from(new Set(isStr(s)?s.split(','):s)).sort()
	}
	return (','+s.split(',').sort().join(',,') + ',').replace(/(,[^,]+,)\1+/g, '$1').replace(/,{2,}/g, ',').replace(/^,|,$/g, '')

}, sortBy = {
	random: function(a,b){return Random(3)-2},	//随机排序
	numInt: function (a, b) { var r = (BigInt(a) - BigInt(b)).toString(); return /^-/.test(r) ? -1 : (/^0$/.test(r) ? 0 : 1) },	//大整数数字大小排序
	num: function (a, b) { var r = minus ? minus([a, b]) : a - b; return /-/.test(r) ? -1 : (/^0$/.test(r) ? 0 : 1) },	//普通数字大小排序
	abs: function (a, b) { var t = Math.abs(+a) - Math.abs(+b); return t || (+a) - (+b) },	//数字绝对值大小排序
	len: function (x, y) {//按长度排序 长度相同时
		var a = '' + x, b = '' + y;
		return a.length - b.length
	},
	lenchr: function (x, y) {//按长度及字母排序
		var a = '' + x, b = '' + y, l = a.length - b.length;

		if (l) {
			return l
		}
		return a - b
	},
	chr: function (x, y) {//按字母排序	也就是默认的Array.sort()	此处有误，字符相减得到NaN
		var a = '' + x, b = '' + y;
		return a - b
	},
	chrlen: function (x, y) {//按字母及长度排序	
		var a = '' + x, b = '' + y;

		if (a == b) { return 0 }
		var la = a.length, lb = b.length, m = Math.min(la, lb);

		for (var i = 0; i < m; i++) {
			var t = a[i].charCodeAt(0) - b[i].charCodeAt(0);
			if (t) {
				return Math.sign(t)
			}
		}
		return la - lb
	},
	chrlen2: function (x, y) {//按字母及长度排序	大小写不敏感
		var a = '' + x, b = '' + y;

		if (a == b) { return 0 }
		var la = a.length, lb = b.length, m = Math.min(la, lb);

		for (var i = 0; i < m; i++) {
			var t = a[i].toLowerCase().charCodeAt(0) - b[i].toLowerCase().charCodeAt(0);
			if (t) {
				return Math.sign(t)
			}
		}
		return la - lb
	},
	chrnum: function (a, b) { //数字排在字母后，同含字母，按未知数排序；同为数字，比较数字大小
		if (/^\d+$/.test(a)) {
			if (/^\d+$/.test(b)) {
				return sortBy.num(a, b)
			}
			return 1
		}
		return sortBy.kxyz(a, b)

	},
	kxyz: function (a, b) {//按未知数排序
		var A1 = ('' + a).replace(/[^a-zα-ω]/ig, ''), B1 = ('' + b).replace(/[^a-zα-ω]/ig, '');
		return sortBy.chr(A1, B1)
	},
	monomial: function (a, b) {//按单项式幂次降序

		var A1 = Polynomial.opr1('^', a), B1 = Polynomial.opr1('^', b);
		if (A1 == B1) {
			return sortBy.kxyz(a, b)
		} else {
			return A1 - B1
		}
	}

}, sort2 = function (A, sortBys, cols, addNumCol, addValue) {/*二维数组排序（表格排序）
	参数
	sortBys	规则数组 指定各列排序规则
		如果不是数组，则所有参与排序的列cols，都按此规则排序
		如果为空，则
			有理数字按sortBy.num
			其它按sortBy.chr
			
	cols 	指定参与排序的列索引数组（索引从0开始编号）
		不指定，则只按第1列排序
		
	addNumCol	指定添加1列，标出原来的序号（从1开始编号）
	addValue	指定添加1列，标出排序值0,1	相等的为0，严格大小的为1
	*/
	var cA = cols || [0], sA = isArr(sortBys) ? sortBys : copyA(sortBys ? sortBys : (/[^\d\/\.,-]/.test(A.toString()) ? sortBy.chr : sortBy.num), cols ? cols.length : 1);

	//	console.log(arguments);
	//	console.log(sA);
	if (addNumCol) {
		Arrf(function (a, i) { a.push(i + 1) }, A);
	}
	if (addValue) {
		Arrf(function (a) { a.push(1) }, A);
	}
	//	console.log(sA);
	var n = A[0].length;
	A.sort(function (a, b) {
		for (var i in cA) {
			//		console.log(cA[i], sA[cA[i]]);
			//	var j=cA[i],sj=sA[j],aj=a[j],bj=b[j],r=sj(aj,bj);
			var j = cA[i], sj = sA[i], aj = a[j], bj = b[j], r = sj(aj, bj);
			if (r) {
				return r
			}
		}
		if (addValue) {//需要捕捉相等值
			a[n - 1] = 0;
			b[n - 1] = 0;
		}
		return 0
	});


}, compressBy={
	prefix:function(v, decompress){
		var vA=v.split(brn);
		if(decompress){
			for(var i=0;i<vA.length-1;i++){
				var vi=vA[i], vit=vi.trim(),
					vj=vA[i+1], v0=vj.length-vj.replace(/^ +/,'').length;
				if(!/^ /.test(vi) && v0){
					if(vi==vit){

					}else{
						vA.splice(i,1);
						vA[i]=vA[i].replace(/^ +/,vi)
					}
					
					for(var j=i+1;j<vA.length;j++){
						var vj=vA[j], vj0=vj.length-vj.replace(/^ +/,'').length;
						if(vj0==v0){
							vA[j]=vj.replace(/^ +/,vi+(vi==vit?' ':''))
	
						}else if(!vj0){
							break
						}
					}
					if(vi!=vit){
						i--;
					}
				}
			}

			return vA
		}
		for(var i=0;i<vA.length-1;i++){
			var vi=vA[i], viA=vi.trim().split(' '), v0=viA[0], v0indx=vi.indexOf(v0),
				vj=vA[i+1], vjA=vj.trim().split(' ');
			if(/[A-Z]/i.test(v0) && vj.indexOf(v0)==v0indx && vjA.indexOf(v0)==0){
				if(viA.length>1){
					vA.splice(i,0,vi.substr(0,v0indx+v0.length+1))
				}else{
					//vA[i]=vi.substr(0,v0indx+v0.length+1);
				}
				
				for(var j=i+1;j<vA.length;j++){
					var vj=vA[j], vjA=vj.trim().split(' ');
					if(vj.indexOf(v0)==v0indx && vjA.indexOf(v0)==0){
						vA[j]=vj.replace(v0,'')

					}else{
						break
					}
				}
			}
		}
		return vA
	}

}, Latin = function (t, caps) {
	var f = function (i) { var s = html2txt('&' + String.fromCharCode(i) + t + ';'); if (/;/.test(s)) { s = '' } return s };
	return Arrf(f, seqA(65 + 32 * (+!caps), 26))
}, Options = function (A, tB, selev) {//返回数组
	if (tB) {
		var B = tB == 1 ? gM(A) : tB, n = B.length, C = copyA('">', n), s = A.indexOf(selev || '');
		if (selev && s > -1) {
			C[s] = '"' + seled + '>';
		}
		return concat(copyA('<option value="', n), A, C, B, copyA('</option>', n));
	}
	var f = function (i) { return i ? '<option value="' + i + '"' + (selev && i == selev ? seled : '') + '>' + i + '</option>' : '' };
	return Arrf(f, A)

}, optgrp = function (t,v) {//返回字符串
	return '<optgroup label="'+t+'">'+v+'</optgroup>'
}, OptGrps = function (A, getI18) {//返回字符串	A=[{'label1':[{'t':'','v':'','s':1},]},]
	var s = '';
	for (var i = 0, l = A.length; i < l; i++) {
		var a = A[i];
		$.each(a, function (x, v) {
			s += '<optgroup label="' + x + '">' + (isStr(v) ? Arrf(function (k) { return '<option value="' + k + '">' + (getI18 && k!='LaTeX' && k!='JavaScript'?gM(k):k) + '</option>' },
				ZLR(v)) : Arrf(function (j) {
					var tv=j.t || j.v;
					return '<option value="' + (j.v || j.t) + '"' + (j.s ? seled : '') + '>' + (getI18 && tv!='LaTeX' && tv!='JavaScript'?gM(tv):tv) + '</option>'
				}, v)).join('') + '</optgroup>'
		});
	}
	return s

}, entity = ZLR('scr fr opf bar acute caron grave dot uml ring circ tilde breve'), printF = {
	'table': function (tbl, separateStyle, blankStyle) {
		var t = [];
		$(tbl).children().each(function () {
			$(this).children().each(function () {
				var s = '';
				$(this).children().each(function () {
					s += ($(this).text().trim() || blankStyle || '') + (separateStyle == '' ? '' : (separateStyle || '\t'))
				})
				t.push(s)
			})
		});
		return t.join('\n');
	}
}, isSupportFontFamily = function (f) {
	if (typeof f != 'string') {
		return false;
	}

	var df = 'Arial';
	if (f.toLowerCase() == df.toLowerCase()) {
		return true;
	}

	var defaultLetter = 'a';
	var defaultFontSize = 100;

	// 使用该字体绘制的canvas
	var width = 100, height = 100;
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;
	// 全局一致的绘制设定
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.textBaseline = 'middle';
	var getFontData = function (f) {
		// 清除
		ctx.clearRect(0, 0, width, height);
		// 设置字体
		ctx.font = defaultFontSize + 'px ' + f + ', ' + df;
		ctx.fillText(defaultLetter, width / 2, height / 2);

		var data = ctx.getImageData(0, 0, width, height).data;

		return [].slice.call(data).filter(function (value) {
			return value != 0;
		});
	};

	return getFontData(df).join('') !== getFontData(f).join('');
};



function cell2rows(t, colA, sepA, blanklines) {//单元格拆为多行	colA：需要拆行的列号数组(列号从0开始)  sepA：相应拆行标识符	blanklines间隔空行数
	var A = Arrf(function (x) { return x.split('\t') }, t.split('\n')), l = blanklines;
	//console.log(colA,sepA);
	for (var i = 0; i < A.length; i++) {
		//console.log('a= '+A[i],A);
		var a = A[i], m = a.length, b = Arrf(function (x, j) { return x.split(sepA[j]) }, ArrI(a, colA)), n = max(Arrf(function (x) { return x.length }, b));
		//console.log('b= '+b,n);
		if (n > 1) {
			Arrf(function (x, j) { a[x] = b[j][0] }, colA);

			for (var ii = 0; ii < n; ii++) {
				var B = copyA('', m);
				Arrf(function (x, j) {
					B[x] = b[j][ii + 1] || '';
				}, colA);
				A.splice(i + ii + 1, 0, B);
			}
			i += n;
		}
		if (l && i && i + 1 < A.length) {//首行（标题）不间隔空行
			for (var ii = 0; ii < l; ii++) {
				A.splice(i + 1, 0, copyA('', m));
			}
			i += l;
		}
	}
	return Arrf(function (s) { return s.join('\t') }, A).join('\n')

}

function cell2cols(t, colA, sepA, fixedA) {//单元格拆为多列	colA：需要拆列的列号数组(列号从0开始)  sepA：相应拆列标识符	fixedA各拆列数目
	var A = Arrf(function (x) { return x.split('\t') }, t.split('\n')), B = fixedA;

	if (!B) {
		B = Arrf(function (x, j) { return max(Arrf(function (y) { return y.split(sepA[j]).length }, Arri(A, x))) }, colA);
	}

	for (var i = 0; i < A.length; i++) {
		for (var ii = 0; ii < colA.length; ii++) {
			var j = colA[ii], a = A[i][j].split(sepA[ii]);
			A[i][j] = a.concat(copyA('', B[ii] - a.length)).join('\t')
		}
	}
	return Arrf(function (s) { return s.join('\t') }, A).join('\n')

}




function n2Zh(m, big, currency) {//数字转中文	[数字, 大小写, 货币单位]
	var AB = ('' + m).split('.'), A = AB[0].replace(/^-/g, ''), B = AB.length == 2 ? AB[1] : '', SN = big ? "零壹贰叁肆伍陆柒捌玖拾佰仟萬亿兆" : "〇一二三四五六七八九十百千万亿兆", K = SN.substr(10, 6), S = '';
	for (var i = 0; i < A.length; i++) {
		var j = Math.floor(i / 4), k = i % 4, n = A[A.length - i - 1], t = n.replace(/\d/, function (s) { return SN[s] });
		S = (n == '0' ? (k > 0 && A[A.length - i] != '0' ? t : '') : (n == '1' && k == 1 && i == A.length - 1 ? '' : t) + (k > 0 ? K[k - 1] : '')) + (j > 0 && k == 0 ? K[j + 2] : '') + S
	}
	if (currency) {
		if (A.length && !/^0+$/.test(A)) {
			S += '元圆'[big ? 1 : 0] + (B && /[1-9]/.test(B) ? '' : '整')
		}
	} else if (B) {
		S += '点'
	}
	K = '角分厘毫丝忽';
	for (var i = 0; i < B.length; i++) {
		var n = B[i], t = n.replace(/\d/, function (s) { return SN[s] });
		if (currency) {
			S += n == '0' ? (B[i + 1] && B[i + 1] != '0' ? t : '') : t + (i < 5 ? K[i] : '')
		} else {
			S += t
		}
	}
	if (/^点/.test(S)) {
		S = '零' + S
	}
	if (/^-/.test(m)) {
		S = '负' + S
	}
	if (currency) {
		S = S.replace(/^〇/, '')
	}
	if (/[%‰‱]$/.test(S)) { S = '百千万'['%‰‱'.indexOf(S.substr(-1))] + '分之' + S.substr(0, S.length - 1) }
	return S

}
function Zh2n(s) {//中文字符转成数字 只做简单替换处理
	return (s + '').replace(/[零壹贰叁肆伍陆柒捌玖]/gi, function (t) { return '零壹贰叁肆伍陆柒捌玖'.indexOf(t) })
		.replace(/[〇一二三四五六七八九]/gi, function (t) { return '〇一二三四五六七八九'.indexOf(t) })
		.replace(/[０１２３４５６７８９]/gi, function (t) { return '０１２３４５６７８９'.indexOf(t) })
		.replace(/[oO点两俩／拾佰仟萬]/g, function (t) { return '00.22/十百千万'['oO点两俩／拾佰仟萬'.indexOf(t)] })
		.replace(/^[百千万]/g, function (t) { return 1 + ZLR(0, '百千万'.indexOf(t) + 2) })
		.replace(/[十百千万]$/g, function (t) { return ZLR(0, '十百千万'.indexOf(t) + 1) }).replace(/亿$/, '00000000').replace(/兆$/, '000000')
		.replace(/[百千万]\D/g, function (t) { return ZLR(0, '百千万'.indexOf(t[0]) + 2) + t.substr(1) })
		.replace(/[百千万](.)/g, '$1')
		.replace(/([1-9])十([1-9])/g, '$1$2')
		.replace(/([1-9])[十]/, '$10')
		.replace(/[十]([1-9])/, '1$1')
		.replace(/[十]/, '10')
		.replace(/(.+)分之(.+)/g, '$2/$1').replace(/／/g, '/')
}

function nTrim(n) {//去除小数点后尾0
	return ('' + n).replace(/(\..*[1-9])0+$/, '$1').replace(/\.0+$/, '')
}
function wrapTrim(n) {//去除首尾括号
	return ('' + n).replace(/^\(|\)$/g, '')
}

function sbc2dbc(str) {
	var result = "";
	var len = str.length;
	for (var i = 0; i < len; i++) {
		var cCode = str.charCodeAt(i);
		//全角与半角相差（除空格外）：65248(十进制)
		cCode = (cCode >= 0x0021 && cCode <= 0x007E) ? (cCode + 65248) : cCode;
		//处理空格
		cCode = (cCode == 0x0020) ? 0x03000 : cCode;
		result += String.fromCharCode(cCode);
	}
	return result;
}

function dbc2sbc(str) {
	var result = "";
	var len = str.length;
	for (var i = 0; i < len; i++) {
		var cCode = str.charCodeAt(i);
		//全角与半角相差（除空格外）：65248（十进制）
		cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
		//处理空格
		cCode = (cCode == 0x03000) ? 0x0020 : cCode;
		result += String.fromCharCode(cCode);
	}
	return result;
}
function zh2big(s, big2zh) {
	var zh_s = '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补布参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉号阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧将浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘浏龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗啰逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹你拟馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试适寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞台抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶一医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮隐樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';
	var zh_t = '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補佈參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢號閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗將漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆歷瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉瀏龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅囉邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧妳擬餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽籤謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試適壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻臺擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉壹醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲隱櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';
	return s.replace(hanziRe, function (t) { return (big2zh ? zh_s[zh_t.indexOf(t)] : zh_t[zh_s.indexOf(t)]) || t })
}

function txt2audio(t, spd, pit, per, lan, eng) {/*spd=[0~9] pit=[0~9] per=[0~4]

	5 Google https://translate.google.com/translate_tts?ie=UTF-8&q=%E4%B8%BA%E4%BB%80%E4%B9%88&tl=zh-CN&total=1&idx=0&textlen=3&tk=469016.95129&client=t&prev=input
		https://translate.google.com/translate_tts?ie=UTF-8&q=%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E5%9C%A8%E8%BF%99%E9%87%8C&tl=zh-CN&total=1&idx=0&textlen=7&tk=957539.575458&client=t&prev=input
		tk不正确无法使用
		
		需另外使用chrome tts API
		
	*/
	if (!eng) {//0 百度	yuyin.baidu.com/docs/tts/136
		return Hs + 'tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&spd=' + (spd || 6) + '&pit=' + (pit || 5) + '&per=' + (per || 0) + '&tex=' + fn0(t)
	}
	if (eng == 1) {//1 搜狗
		return H + 'fanyi.sogou.com/reventondc/microsoftGetSpeakFile?from=translateweb&spokenDialect=' + ['zh-CHS', 'zh-CHT', 'zh-CHT', 'en', 'en'][+lan] + '&text=' + fn0(t)
	}
	if (eng == 2) {//2 腾讯
		return H + 'audiodetect.browser.qq.com:8080/tts?platform=PC_Website&language=' + (+(+lan > 2)) + '&text=' + fn0(t) + '&guid='//+L.audioEngine2TK;// 从翻译页面获取cookie值 $.cookie("fy_guid")
	}
	if (eng == 3) {//3 Bing
		return Hs + 'www.bing.com/translator/api/language/Speak?locale=' + ['zh-CN', 'zh-HK', 'zh-TW', 'en-US', 'en-GB'][+lan] + '&gender=' + (['male', 'female'][+per] || 'male') + '&media=audio/mp3&text=' + fn0(t)
	}
	if (eng == 4) {//4 有道
		return H + 'tts.youdao.com/fanyivoice?le=eng&word=' + fn0(t)//+'&keyfrom=fanyi%2Eweb%2Eindex	只能读英语
	}
	if (eng == 5) {//5 Google
		return ''
	}
}
function txt2A(t) {
	var splitA = function (A, k) {
		var B = [].concat(A);
		for (var i = 0; i < B.length; i++) {
			var s = B[i].trim(), sA = s.split(k), sAl = sA.length;
			if (sAl > 2 || sAl == 2 && sA[0].trim() != '' && sA[1].trim() != '') {
				for (var j = 0; j < sAl - 1; j++) {
					sA[j] += k
				}
				B = B.slice(0, i).concat(sA, B.slice(i + 1));
			}
		}
		return B
	}, A = t.split(/\n/g), kA = ['。', '. ', '? ', '？', '！', '! ', '；', ';', '，', ', '];
	for (var i = 0; i < kA.length; i++) {
		A = splitA(A, kA[i]);
	}

	return A.filter(function (v, i) { return v.trim() != '' })
}
function ubb2html(t0, webview) {

	var t = t0, a0 = '<a target="_blank" href="', a1 = '</a>', r0 = /^[^\]]+\]|\[[^\[]+\]$/g;
	var tA = ZLR('b bold i italic u h\\w sub sup center cite code dfn em kbd samp strong var big del mark pre strike ul ol p q s wbr list \\* quote');

	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[\\/?' + tA[i] + '\\]', 'gi'), function (w) { return w.replace('[', '<').replace(']', '>').replace(/list|\*/g, 'li').replace('quote', 'q').replace('bold', 'b').replace('italic', 'i') });
	}

	tA = ZLR('red green blue white purple yellow violet brown black pink orange gold #\\w*');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[\\/?' + tA[i] + '\\]', 'gi'), function (w) { return w.substr(1, 1) == '/' ? '</font>' : w.replace('[' + tA[i] + ']', '<font color=' + tA[i] + '>') });
	}

	tA = ZLR('img image');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<img src="' + w.replace(r0, '') + '" />' });
	}

	tA = ZLR('url download ref refer');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return a0 + w.replace(r0, '') + '">' + w.replace(r0, '') + a1 });
		t = t.replace(new RegExp('\\[' + tA[i] + '=[^\\]]*?\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return a0 + w.split(']')[0].split('=')[1] + '">' + w.replace(r0, '') + a1 });
	}

	tA = ZLR('fly move');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<marquee direction=right behavior=scroll scrollamount=10 scrolldelay=200>' + w.replace(r0, '') + '</marquee>' });
	}

	tA = ZLR('left right');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<p align=' + w.split(']')[0].substr(1) + '>' + w.replace(r0, '') + '</p>' });
	}

	tA = ZLR('color size font');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '=[^\\]]*?\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<font ' + w.split(']')[0].substr(1).replace(/^font/i, 'face') + '>' + w.replace(r0, '') + '</font>' });
	}

	tA = ZLR('align');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '=[^\\]]*?\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<p ' + w.split(']')[0].substr(1) + '>' + w.replace(r0, '') + '</p>' });
	}

	tA = ZLR('rm mp dir qt');
	for (var i = tA.length - 1; i > -1; i--) {
		t = t.replace(new RegExp('\\[' + tA[i] + '=[^\\]]*?\\].*?\\[\\/' + tA[i] + '\\]', 'gi'), function (w) { return '<video controls=controls width=' + w.split(']')[0].split('=')[1].replace(',', ' height=') + ' src="' + w.replace(r0, '') + '">' + w.replace(r0, '') + '</video>' });
	}

	t = t.replace(/\[list=[^\]]*?\].*?\[\/list\]/gi, function (w) { return '<ol type=' + w.split(']')[0].split('=')[1] + '>' + w.replace(r0, '') + '</ol>' });
	t = t.replace(/\[w\].*?\[\/w\]/gi, function (w) {
		var w0 = w.substr(3, w.length - 7), wb = webview ? 'webview' : 'iframe';
		return '<' + wb + ' src="' + u + '" style="width:98%;height:500px" />'
	});
	t = t.replace(/\[email\].*?\[\/email\]/gi, function (w) { return a0 + 'mailto:' + w.replace(r0, '') + '">' + w.replace(r0, '') + a1 });
	t = t.replace(/\[email=[^\]]*?\].*?\[\/email\]/gi, function (w) { return a0 + 'mailto:' + w.split(']')[0].split('=')[1] + '">' + w.replace(r0, '') + a1 });
	return t;
}


function fixed4(d) {
	return d.toFixed(4).replace(/(\.[^0]*)0+/, '$1').replace(/\.$/, '')
}

function linear2nest(Arr) {//平面线性二维数组[[相对层级,内容]+] 转成 立体嵌套对象[[索引,子对象数组[[索引,子对象数组[索引,索引]],[索引]]]+]
	var A = Arrf(function (i, ii) { return i.concat(ii) }, Arr);//第三列添加自然索引（以0开始计数）
	var f = function (a) {
		var al = a.length, m = min(Arri(a, 0)), B = [], C = [];
		for (var i = 0; i < al; i++) {
			if (!i || a[i][0] == m) {
				B.push([a[i]])
			} else {
				B[B.length - 1].push(a[i])
			}
		}

		for (var i = 0, l = B.length; i < l; i++) {

			if (B[i].length > 1) {
				C.push([B[i][0][2]].concat(f(B[i].slice(1))));
			} else {
				C.push(B[i][0][2])
			}
		}
		return C
	};
	return f(A)
}

function precode(t){
	return XML.wrapE('pre', XML.wrapE('code',t))
}
function md2html(str, sep) {
	var codeblockA = [], headA = [], listA = [], listOU = {},
		lnk = {}, footlnk = {}, footlnkA = [],
		mlnk = {}, mA = [], mlnkA = [],
		s = '\n' + str + '\n';

	s=replaceNodeInner(s,'js', eval);
	s=replaceNodeInner(s,'en', GM);
	s=replaceNodeInner(s,'i18n', gM);
	s=replaceNodeInner(s,'i18', gM);

	while (/\n\[[^\]]+\]:.+/.test(s)) {
		s = s.replace(/\n\[[^\]]+\]:.+/, function (x) {
			var k = x.split(']:')[0].substr(2), v = x.replace(/\n\[[^\]]+\]:/, '').replace(/ +/g, ' ').trim(), isfoot = /^\^/.test(k);
			if (isfoot) {
				footlnk[k.substr(1)] = v
			} else {
				lnk[k] = v;
			}
			return ''
		});

	}


	while (/```[^`]+```/.test(s)) {
		s = s.replace(/```[^`]+```/, function (t) {
			codeblockA.push(t.replace(/`/g, ''));
			return '<codeblockquote>' + (codeblockA.length - 1) + '</codeblockquote>'
		});
	}

	while (/\$\$[\s\S]+\$\$/.test(s)) {//JS 	$$2+3$$	$$1+2+3$$	$$zx(f)$$
		s = s.replace(/\$\$[^\$]+\$\$/, function (x) {

			var t = x.replace(/^..|..$/g, '');
			/*
			return eval(t)
			*/
			try {

				return '$' + eval(t) + '$'
			} catch (e) {
				return t
			}
		});

	}

	while(/<math .+alttext=".+">[\s\S]+<\/math>/.test(s)){// 替换mathml 为 katex
		var t=s.split('</math>'), t0=t[0].split('<math ');
		console.log(s.substr(t0[0].length,t[0].length-t0[0].length+7), '\n\n',t0[1].replace(/.+alttext="([^"]+)".+/,'$1'));
		s=s.replace(s.substr(t0[0].length,t[0].length-t0[0].length+7), '$'+t0[1].replace(/.+alttext="([^"]+)".+/,'$1')+'$')
	}

	while (/\$[^\$]+\$#.+#/.test(s)) {
		s = s.replace(/\$[^\$]+\$#.+#/, function (x) {
			var k = x.substr(1).split('$')[0], t = x.replace(/\$[^\$]+\$/, '').replace(/^.|.$/g, ''), z = zx(k);
			mlnk[t] = z;
			mlnkA.push(z);
			mA.push(k);
			return 'katex#' + (mlnkA.length - 1) + '#' //z
		});
	}
	while (/\$@[^\$]+@\$/.test(s)) {
		s = s.replace(/\$@[^\$]+@\$/, function (x) {
			var t = x.replace(/^..|..$/g, '');
			return 'katex#' + mlnkA.indexOf(mlnk[t]) + '#' //mlnk[t]
		});
	}
	while (/\$[^\$]+\$/.test(s)) {
		s = s.replace(/\$[^\$]+\$/, function (x) {
			var k = x.replace(/^.|.$/g, ''), z = zx(k), i = mA.indexOf(k);
			if (i < 0) {
				i = mA.length;
				mlnkA.push(z);
				mA.push(k);

			}
			return 'katex#' + i + '#'  //z
		});
	}



	while (/\n> +./.test(s)) {
		s = s.replace(/\n> +.+(\n> +.+)*/, function (x) {
			return XML.wrapE('blockquote', x.replace(/\n> +/g, '\n').replace(/^\n/, ''))
		})
	}


	if (/\n[ \t]*([\-\*\+]|\d+\.) .+/.test(s)) {//ol ul
		var fou = function (str) {

			var listA = [], ouA = [];
			var st = str.replace(/\n[ \t]*([\-\*\+]|\d+\.) .+/g, function (x) {
				var t = x.trim(), n = x.split(/[\-\*\+]|\d+\./)[0].length - 1, ht = t.replace(/([\-\*\+]|\d+\.) */, '');
				listA.push([n, ht]);
				var oui = 'uo'[+/^\d/.test(t[0])] + 'l';
				ouA.push(oui);
				return '\n<' + oui + 'li' + n + '>' + (listA.length - 1)


			});

			while (/\n<[uo]lli\d+>\d+\n(?!<[uo]lli\d+>\d+)/.test(st)) {
				st = st.replace(/\n<[uo]lli\d+>\d+\n.+/, function (x) {
					var xA = x.trim().split('\n');
					if (/<[uo]lli\d+>\d+/.test(xA[1])) {
						return '\n' + xA.join('#\n')
					} else {
						listA[+xA[0].split('>')[1]][1] += '\n' + xA[1]
						return '\n' + xA[0]
					}
				})
			}


			st = st.replace(/(\n<[uo]lli\d+>\d+)#/g, '$1');
			var ne = linear2nest(listA);


			var g = function (x) {
				return x.replace(/^\[ \]/, strchkbx0 + 'disabled />').replace(/^\[x\]/i, strchkbx0 + 'disabled' + chked + ' />')
			}, f = function (x) {
				if (isArr(x)) {

					var s = g(listA[x[0]][1]), x1 = x.slice(1);

					return s + (x.length > 1 ? (ouA[x[0] + 1] == 'ul' ? ul : ol)(Arrf(f, x1)) : '');
				} else {
					return g(listA[x][1])
				}
			};

			return (ouA[0] == 'ul' ? ul : ol)(Arrf(f, ne));

		};
		s = s.replace(/(\n[ \t]*([\-\*\+]|\d+\.) .+)+/g, function (x) {
			return '\n' + fou(x)
		});
	};

	if (/-+ *:?\|:?-+/.test(s)) {
		//Table
		var ftb = function (x) {
			var sep, sepi, A = Arrf(function (t, i) {
				if (!/[^-\|:]/.test(t)) {
					sep = t;
					sepi = i;
				}
				return t.replace(/^\||\|$/g, '').split('|')
			}, x.replace(/^\n|\n$/g, '').split('\n')),
				sepA = sep.replace(/^\||\|$/g, '').split('|'), cols = sepA.length;

			var c = '';
			if (/^\|.+\|$/.test(sep)) {
				c = 'TBrc'
			} else if (/^\|/.test(sep)) {
				c = 'TBc'
			} else if (/\|$/.test(sep)) {

			} else {
				c = 'TBr'
			}

			if (/:/.test(sep)) {

				c += ' ' + Arrf(function (k, j) {
					var a = 'l';
					if (/^:.+:$/.test(k)) {
						a = 'c'
					} else if (/:$/.test(k)) {
						a = 'r'
					}
					return 'TBalign' + a + (j + 1)
				}, sepA).join(' ')

			}


			return Table(A.slice(0, sepi), A.slice(sepi + 1, A.length), c)
		};
		s = s.replace(/\n?(.+\n)*\|?:?-+ *:?(\|:?-+ *:?)+.+(\n.+)*\n/g, ftb);
	}


	s = s.replace(/\n(-{3,}|\*{3,}|_{3,})\n/g, '\n<hr />\n').replace(/\n(-{3,}|\*{3,}|_{3,})$/g, '\n<hr />')

		.replace(/\n#+ .+/g, function (x) {
			var t = x.trim(), n = t.split(' ')[0].length, ht = t.replace(/^#+ | #+$/g, '');
			headA.push([n, ht]);
			var hi = 'TOChi' + (headA.length - 1);
			//return '\n' + inhref('#' + hi + '" class="mkdnhead', '<h' + n + ' id=' + hi + '>' + ht + '</h' + n + '>')
			return '\n' + '<h' + n + ' id=' + hi + '>' + inhref('#' + hi + '" class="mkdnhead', '# ')+
			 ht +  inhref('#TOChi0" class="mkdnhead', ' ↑')+ '</h' + n + '>'
		})

		.replace(/\*{3}[^\*\n].*[^\\\n]\*{3}/g, function (x) {
			return '<b><i>' + x.replace(/^...|...$/g, '').trim() + '</i></b>'
		})

		.replace(/\*{2}[^\*\n].*[^\\\n]\*{2}/g, function (x) {
			return '<b>' + x.replace(/^..|..$/g, '').trim() + '</b>'
		})	//strong

		.replace(/\*[^\\\* \n][^\\\*\n]*\*/g, function (x) {
			return '<i>' + x.replace(/^.|.$/g, '').trim() + '</i>'
		})	//em


		.replace(/__[^ \n_][^_]*[^\\\n_]__/g, function (x) {
			return scib(x.replace(/^..|..$/g, '').trim())
		})	//underline

		.replace(/_[^\\\_\n]+_/g, function (x) {
			return '<i>' + x.replace(/^.|.$/g, '').trim() + '</i>'
		})	//em 2


		.replace(/~~.+[^\\\n]~~/g, function (x) {
			return '<del>' + x.replace(/^..|..$/g, '').trim() + '</del>'
		})

		.replace(/==.+[^\\\n]==/g, function (x) {
			return '<mark>' + x.replace(/^..|..$/g, '').trim() + '</mark>'
		})

		.replace(/`[^`\\\n]+`/g, function (x) {
			return '<q>' + x.replace(/^.|.$/g, '').trim() + '</q>'
		})


		.replace(/\!\[[^\]]*\]\([^\)]+\)/g, function (x) {
			var t = x.replace(/\!\[.+\]/, '').replace(/^.|.$/g, ''), u = t.split(' ')[0];
			return '<img src="' + u + '" alt="' + x.split('(')[0].replace(/^..|.$/g, '') + '"' + (/ /.test(t) ? ' title="' + t.replace(/[^ ]+ /, '').replace(/^"|"$/g, '') + '"' : '') + ' />';
		})

		.replace(/\[<img src=[^\]]+\]\([^\)]+\)/g, function (x) {
			var t = x.replace(/.+\(|\)/g, ''), u = t.split(' ')[0],
				hf = uriRe.test(u) ? href : inhref;
				//console.log(x.split('(')[0].replace(/^.|.$/g, ''));
				//console.log(/ /.test(t) ? t.replace(/[^ ]+ /, '').replace(/^"|"$/g, '') : '');
			return hf(u, x.split('(')[0].replace(/^.|.$/g, ''), / /.test(t) ? t.replace(/[^ ]+ /, '').replace(/^"|"$/g, '') : '')
		})

		.replace(/\[[^\]\^]+\]\([^\)]+\)/g, function (x) {// 暂不支持链接文字中含有()
			var t = x.replace(/\[.+\]/, '').replace(/^.|.$/g, ''), u = t.split(' ')[0], hf = uriRe.test(u) ? href : inhref;
			return hf(u, x.split('(')[0].replace(/^.|.$/g, ''), / /.test(t) ? t.replace(/[^ ]+ /, '').replace(/^"|"$/g, '') : '')
		})


		.replace(/\n+(<h\d+[> ])/g, '$1').replace(/(<\/h\d+>)\n+/g, '$1')
		.replace(/(<\/[ou]l>)\n+/g, '$1')
		.replace(/\n*(<hr \/>)\n*/g, '$1')
		.replace(/\n?(<.?blockquote>)\n?/g, '$1')


		.replace(/<\S+@\S+\.\>/g, function (x) {
			var t = x.replace(/^.|.$/g, '');
			return href('mailto:' + t, t)
		})
		.replace(/<[^>\s]+[:\/\.\?\&][^>\s]+>/g, function (x) {
			var t = x.replace(/^.|.$/g, ''), hf = uriRe.test(t) ? href : inhref;
			return hf(t)
		})
		.replace(/\[[^\]\^]+\] *\[[^\s\]\^]+\]/g, function (x) {
			var t = x.replace(/^.|.$/g, '').split(/\] *\[/), lnkt = lnk[t[1]];

			if (lnkt) {
				var u = lnkt.split(' ')[0], tt = / /.test(lnkt) ? lnkt.replace(/\S+ /, '').replace(/"/g, '') : '', hf = uriRe.test(u) ? href : inhref;
				return hf(u, t[0], tt)

			} else {

				return x.replace(/\] *\[/, ']?[')
			}
		})
		.replace(/\[\^[^\]]+\]/g, function (x) {
			var t = x.replace(/^..|.$/g, ''), lnkt = footlnk[t];


			if (lnkt) {
				var ki = footlnkA.indexOf(t);

				if (ki < 0) {
					ki = footlnkA.length;
					footlnkA.push(t);
				}
				return sup(inhref('#TOFNi' + ki, (ki + 1), lnkt))

			} else {
				return x
			}
		})
		.replace(/\\([^\\])/g, '$1');



	if (/\[U?TOC\]/.test(s) && headA.length) {
		var ne = linear2nest(headA), toc = SCtv('bold',gM('Contents'));

		var f = function (x, u) {
			if (isArr(x)) {
				var s = headA[x[0]][1], x1 = x.slice(1);
				return inhref('#TOChi' + x[0], s) + (x.length > 1 ? (u ? ul : ol)(Arrf(function (y) { return f(y, u) }, x1)) : '');
			} else {
				return inhref('#TOChi' + x, headA[x][1])
			}
		};

		s = s.replace(/\[TOC\]/g, detail(toc,ol(Arrf(f, ne)),1,'id=TOCcontents'));
		s = s.replace(/\[UTOC\]/g, detail(toc,ul(Arrf(function (y) { return f(y, 1) }, ne)),1,'id=TOCcontents'));
	}



	if (codeblockA.length) {
		s = s.replace(/<codeblockquote>\d+<.codeblockquote>/g, function (x) {
			return precode(XML.encode(codeblockA[+x.replace(/\D/g, '')]))
		});
	}

	if (footlnkA.length) {

		s += '\n' + Arrf(function (x, i) { return '[' + (i + 1) + '] ' + footlnk[x] }, footlnkA).join('\n')
	}

	if (mA.length) {
		var kA = [];
		s = s.replace(/\n*katex#\d+#\n*/g, function (x) {
			var i = +x.replace(/\D/g, ''), isblk = /^\n/.test(x) && /\n$/.test(x);
			if (isblk) {
				var k = kA.indexOf(i);
				if (k < 0) {
					kA.push(i);
					k = kA.length;
				} else {
					k++;

				}

				var v = zx(mA[i], { "displayMode": true }); //mlnkA[i];

				return '<table width="100%"><tbody><tr><td width="95%">' + v + '</td><td align=right>(' + k + ')</td></tr></tbody></table>'

			} else {
				return x.replace(/[^\n]+/, mlnkA[i])
			}

		});
	}


	//s=s.replace(/<JS>([\s\S](?!<\/JS>))+.?<\/JS>/g,function(t){setTimeout(function(){eval(t.substr(4,t.length-9).trim())},100);return ''});
	s=replaceNodeInner(s,'JS', function(t){setTimeout(function(){eval(t)},100);return ''});


	return s.replace(/^\n+/, '').replace(/\n+$/, '\n').replace(/\n/g, sep === undefined ? br : sep)

}

function xhrcb(src, cb) {
	//cb(length,type)
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', src, true);
	xhr.onerror = function () {
		xhr.abort();
	};
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status == 206) {
				var s = xhr.getResponseHeader('Content-Length') || 0, t = (xhr.getResponseHeader('Content-Type') || '').replace(/image[/]/, '').replace('x-icon', 'ico').replace(/[;\+].*/, '');
				cb(s, t);
				//console.log(xhr.getAllResponseHeaders());

			}
		}
	};
	xhr.send();
}


function picSrcNameExt(tSrc) {
	imgPreReData.lastIndex = 0;
	if (imgPreReData.test(tSrc)) {
		var psrc = unescape(tSrc);
		var pname = psrc.replace(/[;,].*/, '');
		var pext = pname.split('/')[1].toLowerCase().replace('x-icon', 'ico').replace('+xml', '');
		pname = pname.replace(/[:\/]/g, '_');
	} else {
		var psrc = unescape(tSrc).replace(/z@z@l@l@r@r/g, '%');
		var pname = psrc.replace(/[\?#].+$/g, '').replace(/.+[/]/, '');
		try {
			pname = decodeURIComponent(pname);
		} catch (e) {
			console.log(pname);
			console.log(e);
		}
		var pext = pname.replace(/.+\./, '').replace(/\&.+$/, '');
		if (/x-oss-process.+format,/.test(psrc)) {
			pext = psrc.split(/.+format,/)[0].split('/')[0]
		}
	}
	return [psrc, pname, pext]
}
function blking(t, Neg) {
	var s = t, arr;
	//s=s.replace(/<script[^>]*>[\D\d]*<[/]script>/gi,'');
	arr = s.split(/<\/script>/gi);
	for (var i in arr) {
		arr[i] = arr[i].split(/<script/gi)[0];
	}
	s = arr.join('');

	arr = s.split(/<\/style>/gi);
	for (var i in arr) {
		arr[i] = arr[i].split(/<style/gi)[0];
	}
	s = arr.join('');
	return s;
}
function textareaAdd(str, obj, newline, sellen) {
	var O = $(obj), ov = O.val(), sS = O[0].selectionStart, sE = O[0].selectionEnd,
		v = ov.substr(0, sS) + (newline && sS?'\n':'')+(str || '') + (sE == ov.length ? '' : ov.substr(sE)),
		t=v.length;
	O.val(v);
	if(sellen==-1){
		t=Math.max(t-1,0);
	}else if(newline && sellen && !sS){
		t=sS + sellen -1;
	}else{
		t=sS + (sellen||(str || '').length);
	}

	O.focus();
	O[0].selectionStart = t;
	O[0].selectionEnd = t;
}
function detectZoom (){ 
	var ratio = 0,
	  screen = window.screen,
	  ua = navigator.userAgent.toLowerCase();
  
	if (window.devicePixelRatio !== undefined) {
		ratio = window.devicePixelRatio;
	}else if (~ua.indexOf('msie')) {  
	  if (screen.deviceXDPI && screen.logicalXDPI) {
		ratio = screen.deviceXDPI / screen.logicalXDPI;
	  }
	}else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
	  ratio = window.outerWidth / window.innerWidth;
	}
		
	return ratio;
}

function copy2clipboard(t){
    $('body').append('<input id=zzllrrclip hidden type=text value="'+t+'" />');
    $('#zzllrrclip').select();
    document.execCommand('copy', false, null);
    $('#zzllrrclip').remove();
}

var Melef=function(x){var t=Meleo[x]||'';return SCtv('Mele'+(t?'" tip="'+t+'." title="'+t:''),x)};
	Arrf(function(v,i){Meleo[ZLR(Meles)[i]]=v}, ZLR(Mele));