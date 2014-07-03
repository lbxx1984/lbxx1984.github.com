function title(str){
	document.write('<div class="title-right">'+str+'</div>');
}
function parent(str){
	document.write('<div class="title2-right">父类</div><div class="content">'+str+'</div>');	
}
function introduction(str){
	document.write('<div class="title2-right">简介</div><div class="content">'+str+'</div>');	
}
function explain(str){
	document.write('<div class="alert">说明:'+str+'</div>');	
}
function property(name,type,defaultvalue,action){
	document.write(
		'<div class="title3-right">'+name+'</div>'+
    	'<div class="content2">'+
    		'类型:'+type+'<br>'+
			'默认:'+defaultvalue+'<br>'+
			'作用:'+action+'<br>'+
    	'</div>'
	)
}
function events(arr){
	if(!arr||!arr.length){return;}
	document.write('<div class="title2-right">事件</div>');
	for(var n=0;n<arr.length;n++){
		document.write('<div class="title3-right">'+arr[n].label+'</div>');	
		document.write('<div class="content2">'+arr[n].info+'</div>');	
	}
}
function func(name,prop,returnvalue,action){
	document.write(
		'<div class="title3-right">'+name+'</div>'+
        '<div class="content2">'+
            '参数:'+prop+'<br>'+
			'返回:'+returnvalue+'<br>'+
			'作用:'+action+'<br>'+
		'</div>'
	)
}
function list(){
	document.write(
			'<a href="Example.html" class="list-link-title">Demo</a><br>'+
			'<a href="index.html" class="list-link-title">Abstract</a><br>'+
            '<a href="TcFrame.html" class="list-link-title">TcFrame</a><br>'+
            '<a href="" class="list-link-title">Core</a><br>'+
				'<a href="Application.html" class="list-link-item">Application</a><br>'+
                '<a href="Event.html" class="list-link-item">Event</a><br>'+
                '<a href="UIComponent.html" class="list-link-item">UIComponent</a><br>'+
				'<a href="Animation.html" class="list-link-item">Animation</a><br>'+
				'<a href="Open.html" class="list-link-item">Open</a><br>'+
				'<a href="Close.html" class="list-link-item">Close</a><br>'+
				'<a href="Drag.html" class="list-link-item">Drag</a><br>'+
				'<a href="Move.html" class="list-link-item">Move</a><br>'+
				'<a href="Resize.html" class="list-link-item">Resize</a><br>'+
				'<a href="Timer.html" class="list-link-item">Timer</a><br>'+
            '<a href="" class="list-link-title">Containers</a><br>'+
				'<a href="Canvas.html" class="list-link-item">Canvas</a><br>'+
                '<a href="Group.html" class="list-link-item">Group</a><br>'+
				'<a href="Accordion.html" class="list-link-item">Accordion</a><br>'+
				'<a href="TabNavigator.html" class="list-link-item">TabNavigator</a><br>'+  
                '<a href="Panel.html" class="list-link-item">Panel</a><br>'+
				'<a href="TitleWindow.html" class="list-link-item">TitleWindow</a><br>'+	         
            '<a href="" class="list-link-title">Controls</a><br>'+
				'<a href="Alert.html" class="list-link-item">Alert</a><br>'+	
                '<a href="Label.html" class="list-link-item">Label</a><br>'+
                '<a href="Button.html" class="list-link-item">Button</a><br>'+
				'<a href="ButtonBar.html" class="list-link-item">ButtonBar</a><br>'+
				'<a href="TabBar.html" class="list-link-item">TabBar</a><br>'+	
				'<a href="Link.html" class="list-link-item">Link</a><br>'+
				'<a href="LinkBar.html" class="list-link-item">LinkBar</a><br>'+
				'<a href="Image.html" class="list-link-item">Image</a><br>'+
				'<a href="ImageButton.html" class="list-link-item">ImageButton</a><br>'+
				'<a href="CheckBox.html" class="list-link-item">CheckBox</a><br>'+
				'<a href="CheckBoxGroup.html" class="list-link-item">CheckBoxGroup</a><br>'+
				'<a href="Radio.html" class="list-link-item">Radio</a><br>'+
				'<a href="RadioGroup.html" class="list-link-item">RadioGroup</a><br>'+
				'<a href="Number.html" class="list-link-item">Number</a><br>'+
                '<a href="TextInput.html" class="list-link-item">TextInput</a><br>'+
				'<a href="TextArea.html" class="list-link-item">TextArea</a><br>'+
				'<a href="TreeItem.html" class="list-link-item">TreeItem</a><br>'+
				'<a href="Tree.html" class="list-link-item">Tree</a><br>'+
				'<a href="ListItem.html" class="list-link-item">ListItem</a><br>'+
				'<a href="List.html" class="list-link-item">List</a><br>'+
				'<a href="ComboBox.html" class="list-link-item">ComboBox</a><br>'+
				'<a href="DropDownList.html" class="list-link-item">DropDownList</a><br>'+
				'<a href="MenuItem.html" class="list-link-item">MenuItem</a><br>'+
				'<a href="MenuList.html" class="list-link-item">MenuList</a><br>'+
				'<a href="Menu.html" class="list-link-item">Menu</a><br>'+
				'<a href="DateField.html" class="list-link-item">DateField</a><br>'+
				'<a href="DateChooser.html" class="list-link-item">DateChooser</a><br>'+
				'<a href="ColorField.html" class="list-link-item">ColorField</a><br>'+
				'<a href="ColorPicker.html" class="list-link-item">ColorPicker</a><br>'+
				'<a href="Rule.html" class="list-link-item">Rule</a><br>'+
				'<a href="Slider.html" class="list-link-item">Slider</a><br>'+
				'<a href="Progress.html" class="list-link-item">Progress</a><br>'+
				'<a href="RichTextEditor.html" class="list-link-item">RichTextEditor</a><br>'+
				'<a href="GridItem.html" class="list-link-item">GridItem</a><br>'+
				'<a href="GridLine.html" class="list-link-item">GridLine</a><br>'+
				'<a href="Grid.html" class="list-link-item">Grid</a><br>'+         
            '<a href="" class="list-link-title">Stage</a><br>'+
				'<a href="Stage2D.html" class="list-link-item">Stage2D</a><br>'+   
            '<a href="" class="list-link-title">Charts</a><br>'+
				'<a href="CoordinatePaper.html" class="list-link-item">CoordinatePaper</a><br>'+
				'<a href="RingPaper.html" class="list-link-item">RingPaper</a><br>'+
				'<a href="AreaChart.html" class="list-link-item">AreaChart</a><br>'+
				'<a href="LineChart.html" class="list-link-item">LineChart</a><br>'+
				'<a href="BubbleChart.html" class="list-link-item">BubbleChart</a><br>'+
				'<a href="PlotChart.html" class="list-link-item">PlotChart</a><br>'+
				'<a href="CandlestickChart.html" class="list-link-item">CandlestickChart</a><br>'+
				'<a href="ColumnChart.html" class="list-link-item">ColumnChart</a><br>'+
				'<a href="PieChart.html" class="list-link-item">PieChart</a><br>'+
				'<a href="RingChart.html" class="list-link-item">RingChart</a><br>'+ 
			'<a href="" class="list-link-title">Connector</a><br>'+	  
				'<a href="ShortConnection.html" class="list-link-item">ShortConnection</a><br>'+ 
				'<a href="Uploader.html" class="list-link-item">Uploader</a><br>'+         
            '<a href="" class="list-link-title">Event</a><br>'+
				'<a href="Events.html" class="list-link-item">Events</a><br>'+          
            '<a href=".html" class="list-link-title">Skin</a><br>'+
				'<a href="Black.html" class="list-link-item">Black</a><br>'+
				'<a href="Language.html" class="list-link-item">Language-ch</a><br>'           
            
	);	
}