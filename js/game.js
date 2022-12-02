//GGUBLOXQR4KB
var baseurl="http://localhost:9999/";
const STATE = { flag: 'ready', blocks: [], height: 200, width: 200, x: 0, y: 0 }
const SCENE = document.getElementById('scene')
const BLOCKS = document.getElementById('blocks')
const SCORE = document.getElementById('counting')
const START = document.getElementById('start')
const INSTRUCTIONS = document.getElementById('instructions')
const okNumberID = document.getElementById('okNumberID')
const getDepth = index => index * 30
const setCSS = (name, value) => document.documentElement.style.setProperty(name, value)
var oknumber=0;
var oknumber_display=0;
var lastFromName = "";
$("#overlay3").on('click', performInput);
window.addEventListener('keydown', e => (e.key === ' ') ? performInput() : null)
$("#photos").html(0 + "<span>Photos</span>");
$("#scores").html(0 + "<span>Scores</span>");
$("#screte").html("?"+ "<span>Scretes</span>");  
function queryPassword(){
  var password = document.getElementById("password--input").value;
  var url = baseurl+"allNumber";
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
              if (lastFromName != password) {
               lastFromName = password;
               if (STATE.flag!='ready') {reset()}
                 oknumber=data.data.okNumber
               document.getElementById('photos').innerHTML = oknumber + "<span>Photos</span>"
               document.getElementById('screte').innerHTML = data.data.allNumber + "<span>Scretes</span>"
               console.log(data.data.allNumber)
             }
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

// gets either the x or the y translation of `element` based on `x`
function getTranslateValue (element, x) {
  const transform = window.getComputedStyle(element).getPropertyValue('transform')
  let match = transform.match(/^matrix3d\((.+)\)$/)
  
  if (match) return parseFloat(match[1].split(', ')[x ? 12 : 13])
    match = transform.match(/^matrix\((.+)\)$/)

  return match ? parseFloat(match[1].split(', ')[x ? 4 : 5]) : 0
}
// creates a generic block element of `type` at `index`
function create (type, index, height, width) {
  const element = document.createElement('div')

  element.className = type
  element.style.height = `${height}px`
  element.style.width = `${width}px`
  element.style.backgroundColor = `rgb(${
    Math.floor(Math.sin(0.3 * index) * 55 + 200)}, ${
      Math.floor(Math.sin(0.3 * index + 2) * 55 + 200)}, ${
        Math.floor(Math.sin(0.3 * index + 4) * 55 + 200)})`

        return element
      }

// renders a temporary chunk
function renderChunk (index, height, width) {
  const chunk = create('chunk', index, height, width)

  chunk.classList.add(index % 2 === 0 ? 'fall-x' : 'fall-y')
  chunk.addEventListener('animationend', () => chunk.remove())
  SCENE.appendChild(chunk)
}

//begin of password
function closeEnterPassword(event) {
  if (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

// renders a temporary chunk
function renderChunk (index, height, width) {
  const chunk = create('chunk', index, height, width)

  chunk.classList.add(index % 2 === 0 ? 'fall-x' : 'fall-y')
  chunk.addEventListener('animationend', () => chunk.remove())
  SCENE.appendChild(chunk)
}
// renders the scene where `index` is the last block
function renderScene (index) {
  if (index === STATE.blocks.length - 1) BLOCKS.appendChild(STATE.blocks[index])
    STATE.blocks.forEach((block, id) => (id > index) ? block.remove() : null)
  SCENE.style.transform = `translateZ(${getDepth(-index)}px)`
  document.getElementById('scores').innerHTML = index + "<span>Scores</span>"
  oknumber_display=oknumber+parseInt(Math.pow(2,parseInt(index/10)))-1
  document.getElementById('photos').innerHTML =  oknumber_display+ "<span>Photos</span>"
  setCSS('--z', `${getDepth(index)}px`)
}

// attempts to place a block at the current position -- returns true / false
// (being a little cute here just to reuse the same function for both axes)
function placeBlock (index) {
  const even = index % 2 === 0
  const [size, pos, posPerp, cssPos, cssOffset, cssOffsetPerp] = even
  ? ['width', 'x', 'y', '--x', '--ox', '--oy']
  : ['height', 'y', 'x', '--y', '--oy', '--ox']
  const block = STATE.blocks[index]
  const offset = getTranslateValue(block, even)
  const delta = Math.abs(STATE[pos] - offset)
  const less = offset < STATE[pos]
  
  if ((STATE[size] -= delta) <= 1) return false // failed to place the block
    STATE[pos] = less ? offset + delta : offset
  setCSS(cssPos, `${less ? STATE[pos] : offset}px`)
  setCSS(cssOffset, `${less ? offset : offset + STATE[size]}px`)
  setCSS(cssOffsetPerp, `${STATE[posPerp]}px`)
  renderChunk(index, even ? STATE.height : delta, even ? delta : STATE.width)

  block.style.width = `${STATE.width}px`
  block.style.height = `${STATE.height}px`
  block.style.animation = 'none'
  block.style.transform = `translate3D(${STATE.x}px, ${STATE.y}px, ${getDepth(index)}px)`
  return true
}

function ready () {
  STATE.flag = 'play'
  START.classList.add('ready')
  SCORE.classList.add('ready')
  INSTRUCTIONS.classList.add('ready')
}

function init () {
  ['--x', '--y', '--z', '--ox', '--oy'].forEach(css => setCSS(css, '0px'))
  Object.assign(STATE, { flag: 'play', height: 200, width: 200, x: 0, y: 0 })
}

// recursively clears all blocks and initializes the game afterwards
function reset () {
  const block = STATE.blocks.pop()
  
  STATE.flag = 'reset'
  oknumber=0;
  SCORE.classList.remove('lose')
  block.classList.add('disappear')
  block.addEventListener('transitionend', () => block.remove())
  renderScene(STATE.blocks.length)

  if (STATE.blocks.length > 0) return setTimeout(reset, 75)
    return setTimeout(init, 250)
}

function lose () {
  //将当前的oknumber上传到服务器
  uploadOkNumber()
  STATE.flag = 'lose'
  SCORE.classList.add('lose')
  INSTRUCTIONS.classList.remove('ready')
  BLOCKS.lastChild.remove()
}

function uploadOkNumber(){
  var password = document.getElementById("password--input").value;
  var url = baseurl+"okNumber";
  var data={
    fromName:password,
    okNumber:oknumber_display,
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
              //保存将当前的数量展现
              okNumberID.classList.add('ready')
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

function performInput () {
  console.log("performInput")
  const index = STATE.blocks.length

  if (STATE.flag === 'ready') ready()
    if (STATE.flag === 'reset') return
      if (STATE.flag === 'lose') return reset()
        if (index > 0 && !placeBlock(index - 1)) return lose()
          if (index > 3) INSTRUCTIONS.classList.remove('ready')

            STATE.blocks.push(create('block', index, STATE.height, STATE.width))
          renderScene(index)
        }

        var app = function () {
          var body = void 0;
          var menu = void 0;
          var menuItems = void 0;

          var init = function init() {
            body = document.querySelector('body');
            menu = document.querySelector('.menu-icon');
            menuItems = document.querySelectorAll('.nav__list-item');

            applyListeners();
          };
  var menustate = 0;//close
  var applyListeners = function applyListeners() {
    menu.addEventListener('click', function () {
    	setTimeout(toggle_nav_content, 1000)

      menustate = (menustate+1)%2;
      if (menustate==0) {queryPassword();}
      return toggleClass(body, 'nav-active');
    });
  };


  var toggleClass = function toggleClass(element, stringClass) {
    if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
  };

  init();
}(); 

function toggle_nav_content(){
  var targetid="nav__content";
  target=document.getElementById(targetid);
  if (target.style.display=="block"){
    target.style.display="none";
  } else {
    target.style.display="block";
  }
}


