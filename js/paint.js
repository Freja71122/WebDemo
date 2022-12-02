var baseurl="http://localhost:9999/";
var c = $('#canvas')[0];
var canvas = document.getElementById("canvas");
var ctx = c.getContext('2d');
var selectedColor = '#A5BDBD';
var selectedThickness = 24;
var selectedLayer = 1;
var isPressed = false;
var prevPoint = [0, 0];
var overlay = $("#overlay"),
fab=$(".fab"),
save_icon = $("#save-icon"),
cancel = $("#cancel"),
getPass = $("#get-pass"),
submit = $("#submit");
save_icon.on('click', openFAB);
overlay.on('click', closeFAB);
cancel.on('click', closeFAB);
getPass.on('click', getPassWord);
submit.on('click', submitForm);

// begin of FAP
function closeFABAfter(){
    fab.removeClass('active');
    overlay.removeClass('dark-overlay');
}
function closeFAB(event) {
  if (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
	}
	closeFABAfter();
}

function openFAB(event) {
  if (event) event.preventDefault();
  fab.addClass('active');
  overlay.addClass('dark-overlay');
}

function getPassWord(event) {
  if (event) event.preventDefault();
  getPassAjax();
}

function getPassAjax(){
    var url = baseurl+"password";
  $.ajax({
    url:url,
    type:"get",
    success:function(data){
        $("#text0").parent().addClass("is-dirty");
        document.getElementById("text0").value=data.password;
    },
});
}

function CurentTime()
    { 
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    } 

function submitForm(event) {
  if (event) event.preventDefault();
  if(document.getElementById("text0").value==""){
    getPassAjax();
    return;
  }
  document.getElementById("submit").disabled=true;  
  var resizedCanvas = document.createElement("canvas");
var resizedContext = resizedCanvas.getContext("2d");
resizedCanvas.height = 300;
resizedCanvas.width = 500;
resizedContext.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
var image = resizedCanvas.toDataURL("image/jpeg",0.7);
  console.log(image.length);
  var url = baseurl+"image";
  var mytime=CurentTime();
  var data={
    baseData:image,
    toName:document.getElementById("text1").value,
    fromName:document.getElementById("text0").value,
    createTime:mytime,
    note:document.getElementById("text2").value
    };
    $.ajax({
        url:url,
        type:"post",
        data: JSON.stringify(data),
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        success:function(data){
            console.log(data);
            if (data.result=="ok"){
                document.getElementById('fab-hdr').style.background="#96D0FF";
                document.getElementById('save-res').innerHTML="SUCCESS";
                setTimeout('resetFAP()',3000); 
                setTimeout('closeFABAfter()',3000); 
                console.log("上传成功");
            }else{
                document.getElementById('fab-hdr').style.background="#F8EBEE";
                document.getElementById('save-res').innerHTML="FAILED";
                console.log("上传失败");
                setTimeout('resetFAP()',3000); 
            }
        },
        error:function(){
            resetFAP()
            console.log("上传失败");
        }
    });
}

function resetFAP(){
    document.getElementById('fab-hdr').style.background='#A5BDBD';
    document.getElementById('save-res').innerHTML="SAVE";
    document.getElementById("submit").disabled=false;  
}
// end of FAP


// Sets width of canvas

c.width = 1400;
c.height = 1000;

// Event listeners

$('.color').on('click', function(){
    $('.color.active').removeClass('active');
    $(this).addClass('active');
    
    selectedColor = $(this).data('color');
});

$('.thickness').on('click', function(){
    $('.thickness.active').removeClass('active');
    $(this).addClass('active');
    
    selectedThickness = $(this).data('thickness');
});

$(c).on('mousemove', function(e){
    var x = e.offsetX * 2;
    var y = e.offsetY * 2;
    
    if(isPressed){
        drawLine(x, y);
    }
});

$(c).on('mousedown', function(e){
    prevPoint = [(e.offsetX * 2), e.offsetY * 2];
    ctx.beginPath();
    ctx.moveTo(prevPoint[0], prevPoint[1]);
    isPressed = true;
});

$(c).on('mouseup mouseleave', function(){
    isPressed = false;
    ctx.closePath();
    saveImage();
});

$('[data-clear]').on('click', function(){
    clearCanvas();
    saveImage();
});

$('[data-redraw]').on('click', function(){
    $('.color.active').removeClass('active');
    selectedColor = "#FFF";
});

$('#save').on('click', function(){
    saveImage();
});

// Does what is says

function clearCanvas(){
    ctx.clearRect(0, 0, 1400, 1000);
    // 在canvas绘制前填充白色背景
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.width);
}

// Saves image to bg

function saveImage(){
    var image = c.toDataURL('image/png');
    
    $('.bg-img').css({
        'background-image': 'url(' + image + ')'
    });
}

// Draws a line

function drawLine(x, y){
    ctx.lineTo(x, y);
    ctx.lineWidth = selectedThickness;
    ctx.strokeStyle = selectedColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    prevPoint = [x, y];
}

// Draws the initial picture

function drawInit(){
    clearCanvas();
    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.lineTo(340, 700);
    
    ctx.moveTo(300, 500);
    ctx.lineTo(500, 480);
    
    ctx.moveTo(500, 250);
    ctx.lineTo(540, 700);
    
    ctx.moveTo(710, 400);
    ctx.lineTo(700, 700);
    
    ctx.moveTo(710, 210);
    ctx.lineTo(710, 240);
    
    ctx.moveTo(910, 210);
    ctx.lineTo(900, 540);
    
    ctx.moveTo(925, 620);
    ctx.lineTo(880, 720);
    
    ctx.moveTo(870, 630);
    ctx.lineTo(940, 720);
    
    ctx.closePath();
    ctx.lineWidth = '48';
    ctx.strokeStyle = '#A5BDBD';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    saveImage();
}

drawInit();

