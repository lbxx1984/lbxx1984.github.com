var logo=null;			//图表
var menu=null;		 	//整体菜单
var demoContainer=null;	//演示容器
var codeContainer=null; //代码容器
var application=null;	//整体
function init(){
	//系统初始化
	application=new TcFrame.Application({width:1000,height:550,language:0,container:document.getElementById('container')});
	if(!application.enable){return;}
	application.setStyle('backgroundColor',"#333");
	//图标
	logo=new TcFrame.Image({width:120,height:30,x:0,y:0,src:"logo.png"});
	//声明menu，导入数据
	menu=new TcFrame.Menu({left:120,right:0,top:0,height:30,itemWidth:230});
	menu.dataProvider([
		{id:"1",label:'Core',children:[
			{id:"1.1",label:"UIComponent"},
			{id:"1.2",label:"Animation"},
			{id:"1.3",label:"Open"},
			{id:"1.4",label:"Close"},	
			{id:"1.5",label:"Move"},
			{id:"1.6",label:"Resize"},
			{id:"1.7",label:"Timer"}
		]},
		{id:"2",label:'Containers',children:[
			{id:"2.1",label:"Accordion"},
			{id:"2.2",label:"Canvas"},
			{id:"2.3",label:"Group"},
			{id:"2.4",label:"Panel"},
			{id:"2.5",label:"TabNavigator"},
			{id:"2.6",label:"TitleWindow"}
		]},
		{id:"3",label:'Controls',children:[
			{id:"3.1",label:"demo1"},
			{id:"3.2",label:"demo2"},
			{id:"3.3",label:"demo3"}
		]},
		{id:"4",label:'Charts',children:[
			{id:"4.1",label:"AreaChart"},
			{id:"4.2",label:"LineChart"},
			{id:"4.3",label:"BubbleChart"},
			{id:"4.4",label:"PlotChart"},
			{id:"4.5",label:"ColumnChart"},
			{id:"4.6",label:"PieChart"},
			{id:"4.7",label:"RingChart"},
			{id:"4.8",label:"CandlestickChart"}
		]},
		{id:"5",label:'Stage',children:[
			{id:"5.1",label:"Stage2D"}
		]},
		{id:"6",label:'Connector',children:[
			{id:"6.1",label:"demo1"}
		]}
	]);
	menu.addEventListener("onClick",onMenuClick);
	//声明演示容器
	demoContainer=new TcFrame.Canvas({left:0,right:0,top:30,bottom:110});
	var a=document.createElement( 'div' );
	a.style.cssText='text-align:center;width:475px;margin:5em auto 0;font-family:微软雅黑;font-size:12px;background-color:#8f8f8f;color:#ffffff;padding:1em;'
	a.innerHTML="友情提示<br><br>请在菜单中点击组件，查看其演示代码<br><br>TcFrame v2.0";
	demoContainer.content.appendChild(a);
	//声明代码容器
	codeContainer=new TcFrame.TextArea({left:0,right:2,bottom:2,height:108});
	//添加到舞台
	application.add(menu);
	application.add(demoContainer);
	application.add(codeContainer);
	application.add(logo);
}
function onMenuClick(event){
	switch(event.target.currentID){
		case "1.1":showFunc(demoUIComponent);break;
		case "1.2":showFunc(demoAnimation);break;
		case "1.3":showFunc(demoOpen);break;
		case "1.4":showFunc(demoClose);break;
		case "1.5":showFunc(demoMove);break;
		case "1.6":showFunc(demoResize);break;
		case "1.7":showFunc(demoTimer);break;
		case "1.8":showFunc(demoTimer);break;
		case "2.1":showFunc(demoAccordion);break;
		case "2.2":showFunc(demoCanvas);break;
		case "2.3":showFunc(demoGroup);break;
		case "2.4":showFunc(demoPanel);break;
		case "2.5":showFunc(demoTabNavigator);break;
		case "2.6":showFunc(demoTitleWindow);break;
		case "3.1":showFunc(demoControls1);break;
		case "3.2":showFunc(demoControls2);break;
		case "3.3":showFunc(demoControls3);break;
		case "4.1":showFunc(demoAreaChart);break;
		case "4.3":showFunc(demoBubbleChart);break;
		case "4.8":showFunc(demoCandlestickChart);break;
		case "4.5":showFunc(demoColumnChart);break;
		case "4.2":showFunc(demoLineChart);break;
		case "4.6":showFunc(demoPieChart);break;
		case "4.4":showFunc(demoPlotChart);break;
		case "4.7":showFunc(demoRingChart);break;
		case "5.1":showFunc(demoStage2D);break;
		case "6.1":showFunc(demoShortConnection);break;
		default:break;
	}
}
function showFunc(fun){codeContainer.setValue(fun);fun();}
