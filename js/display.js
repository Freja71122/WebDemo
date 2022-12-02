
var orbit = {
    // Initialize the orbiting
    init: function(selector) {
        this.elements = document.querySelectorAll(selector || '[data-orbit]');
        
        // Set the update interval
        this.setupIntervals();
    },

    // Setup the intervals for rotating
    setupIntervals: function() {
        var self = this;
        this.elements.forEach(function(el) {
            self.update(el);
            this.interval = setInterval(function() {
                self.update(el);
            }, 5000);
        });
    },
    
    // Update the orbit rotate3d
    update: function(el) {
        var min = -1;
        var max = 1;
        
        // Get our rotate values
        var rotate = [
        (Math.floor(Math.random() * (max - min + 1)) + min)+'.'+(Math.floor(Math.random() * 9) + 1),
        (Math.floor(Math.random() * (max - min + 1)) + min)+'.'+(Math.floor(Math.random() * 9) + 1)
        ];

        // Set the transform
        el.style.webkitTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.MozTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.msTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.OTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.transform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';        
    }
}

// Start it up
orbit.init();
//7VFVWXGNAOLS
function append(content,num,baseData){
    console.log(num);
    console.log("appendla");
    var popContent =[
    '<div class="col col--full">',
    '<div class="block--split-image block--split-image-'+num+'">',
    '<div class="block__content">',
    '<h2>'+content+'<br><small>(hover me)</small></h2>',
    '</div>',
    '<div class="block__image" data-orbit>',
    '<div class="part part-1"></div>',
    '<div class="part part-2"></div>',
    '<div class="part part-3"></div>',
    '<div class="part part-4"></div>',
    '</div></div></div>'
    ].join(' ');

    $('main').append(popContent);
    $('.block--split-image-'+num+'>.block__image>.part').css({
        'background-image': 'url(' + baseData + ')'});
}

// append("content",3)

function appendOkPicture(oknumber,pictures){
    console.log(pictures)
    // var baseData = pictures[0].baseData;
    for (var i = 1; i <= oknumber; i++) {
        var baseData=pictures[i-1].baseData;
        var content = "";
        if (pictures[i-1].note!="") {
            content = pictures[i-1].note;
        }
        else{
            content = "Just For You";
        }
        append(content,i,baseData);
    }
}
function appendPart(oknumber,pictures){
    for (var i = 1; i <= oknumber; i++) {
        var baseData=pictures[i-1].baseData;
        var content = "";
        if (pictures[i-1].note!="") {
            content = pictures[i-1].note;
        }
        else{
            content = "Just For You";
        }
        var block_image = '.block--split-image-'+i+'>.block__image>.part';
        var block_content = '.block--split-image-'+i+'>.block__content>h2';
        $(block_image).css({
            'background-image': 'url(' + baseData + ')'
        });
        $(block_content).html(content);
    }
}


var app = function () {
  var body = void 0;
  var menu_p4 = void 0;
  var menuItems_p4 = void 0;

  var init = function init() {
    body = document.querySelector('body');
    menu_p4 = document.querySelector('.menu-icon-p4');
    menuItems_p4 = document.querySelectorAll('.nav__list-item-p4');

    applyListeners_p4();
};
  var menustate_p4 = 0;//close
  var applyListeners_p4 = function applyListeners_p4() {
    menu_p4.addEventListener('click', function () {
        // setTimeout(toggle_nav_content1, 1000)
        menustate_p4 = (menustate_p4+1)%2;
        if (menustate_p4==0) {queryPassword_p4();}
        return toggleClass(body, 'nav-p4-active');
    });
};


var toggleClass = function toggleClass(element, stringClass) {
    if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
};

init();
}(); 

function toggle_nav_content1(){
    var targetid="nav__content-p4";
    target=document.getElementById(targetid);
    if (target.style.display=="block"){
        target.style.display="none";
    } else {
        target.style.display="block";
    }

}
function queryPassword_p4(){
    var password = document.getElementById("password--input-p4").value;
    var url = baseurl+"allPictures";
    var data={
        fromName:password,
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
              //更新secretes
              //重置游戏
              //更新oknumber
              console.log(data);
              var toName = data.data.toName;
              var oknumber = data.data.okNumber;
              var pictures = data.pictures;
              if (toName!=null) {$("#pen__subheading").html("TO: "+toName);}
              // appendOkPicture(oknumber,pictures);
              appendPart(oknumber,pictures);
              // if (lastFromName != password) {
              //     lastFromName = password;
              //     if (STATE.flag!='ready') {reset()}
              //     oknumber=data.data.okNumber
              //     document.getElementById('photos').innerHTML = oknumber + "<span>Photos</span>"
              //     document.getElementById('screte').innerHTML = data.data.allNumber + "<span>Scretes</span>"
              //     console.log(data.data.allNumber)
              // }
              console.log("上传成功");
          }else{
            console.log("上传失败");
        }
    },
    error:function(){
        console.log("上传失败");
    }
});

}






