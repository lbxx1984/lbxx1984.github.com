
var samples = {
    'interpolation': {
        template: '<div>Hi {{=it.name}}!</div>\n<div>{{=it.age}}</div>',
        data: '{"name":"Jake","age":31}'
    },
    'evaluation': {
        template: '{{ for(var prop in it) { }}\n<div>{{=prop}}</div>\n{{ } }}',
        data: '{"name":"Jake","age":31,"mother":"Kate","father":"John","interests":["basketball","hockey",'
            + '"photography"],"contact":{"email":"jake@xyz.com","phone":"999999999"}}',
    },
    'partials': {
        template: '{{##def.snippet:\n<div>{{=it.name}}</div>{{#def.joke}}\n#}}\n\n{{#def.snippet}}',
        defines: '{"joke":"<div>{{=it.name}} who?</div>"}',
        data: '{"name":"Jake","age":31}'
    },
    'conditionals': {
        template: '{{? it.name }}\n<div>Oh, I love your name, {{=it.name}}!</div>\n{{?? it.age '
            + '=== 0}}\n<div>Guess nobody named you yet!</div>\n{{??}}\nYou are {{=it.age}} and still dont '
            + 'have a name?\n{{?}}',
        data: '{"name":"Jake","age":31}'
    },
    'arrays': {
        template: '{{~it.array :value:index}}\n<div>{{=value}}!</div>\n{{~}}',
        data: '{"array":["banana","apple","orange"]}'
    }
};

var data = null;

var tpl = null;

var defines = null;

var func = null;


function changeDemo(demo) {
    data = JSON.parse(samples[demo].data);
    tpl = samples[demo].template;
    defines = (samples[demo].defines) ? JSON.parse(samples[demo].defines) : null;
    $('#data textarea').html(formate_js(JSON.stringify(data), 4, ' '));
    $('#defines textarea').html(formate_js(JSON.stringify(defines), 4, ' '));
    $('#template textarea').html(formate_html(tpl, 4, ' ', 80));
    compile();
    render();
}


function render() {
    if (func) {
        var result = func(data);
        var resultstr = formate_html(result, 4, ' ', 80);
        $('#result textarea').html(resultstr);
    }
}


function compile(fun) {
    func = fun ? fun : doT.template(tpl, undefined, defines);
    $('#compile textarea').html(formate_js(func.toString().replace('/**/', ''), 4, ' '));
}   


$('#data textarea').bind('keyup', function (event) {
    var val = $(event.target).val();
    var newdata = null;
    try {
        eval('newdata=(' + val + ')');
    } catch (e) {
        $('#data .error').html(e);
    }
    if (newdata != null) {
        $('#data .error').html('');
        data = newdata;
        render();
    }
});


$('#template textarea').bind('keyup', function (event) {
    var val = $(event.target).val();
    var fun = null;
    try {
        fun = doT.compile(val, defines);
    } catch (e) {
        $('#template .error').html(e);
    }
    if (fun != null) {
        $('#template .error').html('');
        compile(fun);
        render();
    }
});


$('#defines textarea').bind('keyup', function (event) {
    var val = $(event.target).val();
    var newdefine = null;
    try {
        eval('newdefine=(' + val + ')');
    } catch (e) {
        $('#defines textarea').html(e);
    }
    if (newdefine != null) {
        $('#defines textarea').html('');
        defines = newdefine;
        compile();
        render();
    }
});


$('li').bind('click', function (event) {
    $('li').removeClass('active');
    $(event.target).addClass('active');
    changeDemo(event.target.innerHTML);
});


$('#compile textarea').css("height", (document.body.scrollHeight - 127) + 'px');
$('#result textarea').css("height", (document.body.scrollHeight - 127) + 'px');
$('#data textarea').css("height", (document.body.scrollHeight - 417) + 'px');


changeDemo('interpolation');