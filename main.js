var colors = [
    'blue', 'blue', 'blue', 'blue', 'blue',
    'green', 'green', 'green', 'green', 'green',
    'yellow',
    'orange',
    'red',
    'purple',
    'gray',
    'brown', 'brown', 'brown', 'brown', 'brown',
    'cyan'
];
var elements = ['header', 'lamp', 'content'];
var currentPage = 0;
var lastWheelTime = 0;
var paddingWheelTime = 300;

window.onload = function () {
    loadPage(document.body.clientWidth, $(window).height());
    var r = parseInt(Math.random() * colors.length);
    loadSkin(colors[r]);
    $('#lamp').bind('click', function (event) {
        var n = Number(event.target.dataset.index);
        if (isNaN(n)) {
            return;
        }
        window.location.hash = n + 1;
    });
    function change() {
        var n = parseInt(window.location.hash.replace('#', ''));
        if (isNaN(n) || n === currentPage + 1) {
            return;
        }
        var max = $('#content>div').length;
        n = n - 1;
        if (n >= max) {
            n = max -1;
        }
        if (n < 0) {
            n = 0;
        }
        changePage(n);
    }
    setTimeout(change, 500);
};

window.onresize = function () {
    loadPage(document.body.clientWidth, $(window).height());
    changePage(currentPage);
};

window.onmousewheel = function (e) {
    var detal = e.wheelDelta || e.detail;
    var time = new Date().getTime();
    if (time - lastWheelTime < paddingWheelTime) {
        return;
    }
    lastWheelTime = time;
    if (detal > 0) {
        nextPage(false);
    }
    else {
        nextPage(true);
    }
}
window.onhashchange = function () {
    var n = parseInt(window.location.hash.replace('#', ''));
    var max = $('#content>div').length;
    if (isNaN(n)) {
        return;
    }
    n = n - 1;
    if (n >= max) {
        n = max -1;
    }
    if (n < 0) {
        n = 0;
    }
    changePage(n);
};

function loadPage(width, height) {
    var pages = $('#content>div');
    var str = '';
    for (var n = 0; n < pages.length; n++) {
        if (n === currentPage) {
            str += '<div class="active" data-index="' + n + '"></div>';
        }
        else {
            str += '<div data-index="' + n + '"></div>';
        }
        $(pages[n]).css({
            width: width + 'px',
            height: height + 'px',
            left: n * width + 'px'
        });
    }
    $('#copyright').css({top: height - 30 + 'px', left: '0px'});
    $('#lamp').html(str);
    $('#content').css({
        width: width * pages.length + 'px',
        height: height + 'px',
        left: '0px'
    });
}

function loadSkin(color) {
    for (var n = 0; n < elements.length; n++) {
        $('#' + elements[n]).attr('class', '').addClass(color + '-' + elements[n]);
    }
}

function nextPage(isNext) {
    var max = $('#content>div').length;
    if (isNext) {
        currentPage++;
    }
    else {
        currentPage--;
    }
    if (currentPage < 0) {
        currentPage = 0;
    }
    window.location.hash = currentPage + 1;
}

function changePage(cur) {
    var lamps = $('#lamp div');
    lamps.removeClass('active');
    $(lamps[cur]).addClass('active');
    $('#content').animate({left: -1 * cur * document.body.clientWidth + 'px'}, 'fast');
    currentPage = cur;
}
