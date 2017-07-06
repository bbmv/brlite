function TBestReader() {
//---------------------------------------------------------------------------
var win, titlebar, trackbar, closebar, textfield, curr_style_b, curr_style_s, vertScrollMask,
    horizScrollMask, coner, edgeLeft, edgeRight, track, field, speed, field_text, speed_text,
    slider, handle, btnPlay, btnStop, btnDonation, btnAlign, btnMode, btnLight, btnHelp, btnPlayOff,
    btnSmallerOff, btnBiggerOff, btnAlignOff, btnModeOff, winScreen, progresscircle, textShell,
    redLine, redLineX, redLineDelta;

var currMode = 'static'; // dynamic
var currAlign = 'centre'; // left
var currLight = 'light'; // dark

var flagTitDown = flagConerDown = flagEdgeLeftDown = flagEdgeRightDown = flagHandleDown = flagRedLineDown = false;
var sightField = 10;
var speedReading = 500;
var minTextfieldWidth = constMinTFWidth = 330;
var minTextfieldHeight = 270;
var charSize = 20;
var countTimes;
var scrollPos;
var shellRange;
//---------------------------------------------------------------------------
this.run = function() {
  if (document.contentType != 'text/html') { 
    alert('Best Reader Lite works only with HTML-documents. Sorry!');
    return; 
  }

  if (document.getElementById('rsbr_win')) closeDown(null)

  shellRange = getSelectedRange(); // получаем выделенную область - shellRange. Если область не выделена, возвращает облатсь BODY

  createDivs();
  initWindow();

  adjustMode();
  adjustAlign();
  adjustLight();

  arrWords.length = 0;
  searchTextNodes(shellRange.commonAncestorContainer);

  scrollPos = 0;
  getText();
}
//---------------------------------------------------------------------------
function adjustLight() {
  var bg_color = "#62677e";
  var mask_color = "#62677e";
  var txt_color = "white";
  curr_style_b = 'rsbr_dark_b';
  curr_style_s = 'rsbr_dark_s';
  progresscircle.id = "rsbr_progresscircle_dark";
  handle.id = "rsbr_handle_dark";

  if (currLight == 'light') {
    bg_color = "white";
    mask_color = "transparent";
    txt_color = "black";
    curr_style_b = 'rsbr_light_b';
    curr_style_s = 'rsbr_light_s';
    progresscircle.id = "rsbr_progresscircle_light";
    handle.id = "rsbr_handle_light";
  }

  panel.style.setProperty("background-color", bg_color, "important");
  panel.style.setProperty("background-color", bg_color, "important");
  textfield.style.setProperty("background-color", bg_color, "important");
  vertScrollMask.style.setProperty("background-color", mask_color, "important");
  horizScrollMask.style.setProperty("background-color", mask_color, "important");
  speed.style.setProperty("color", txt_color, "important");

  var offBtns = document.getElementsByClassName('rsbr_button_off');
  for (var i = 0; i < offBtns.length; i++) {
    offBtns[i].style.setProperty("background-color", bg_color, "important");
    offBtns[i].style.setProperty("border-color", bg_color, "important");
}
}
//---------------------------------------------------------------------------
function adjustMode() {
  if (currMode == 'static') {
    btnMode.id = "rsbr_static";
    emptyStart.style.height = textfield.clientHeight / 2 - parseInt(textfield.style.fontSize) + "px";;
    emptyEnd.style.height = textfield.clientHeight / 2 + "px";;
  } else {
    btnMode.id = "rsbr_dynamic";
    emptyStart.style.height = "0px";
    emptyEnd.style.height = textfield.clientHeight - parseInt(textfield.style.fontSize) + "px";
  }
}
//---------------------------------------------------------------------------
function adjustAlign() {
  if (currAlign == 'centre') {
    btnAlign.id = "rsbr_centre"
    textfield.style.setProperty("text-align", "center", "important");
    textShell.style.left = "0px";
  } else {
    btnAlign.id = "rsbr_left";
    textfield.style.setProperty("text-align", "left", "important");
    textShell.style.left = track.offsetLeft + edgeLeft.offsetWidth + "px";
  }
}
//---------------------------------------------------------------------------
function createDivs() {
  win = document.createElement("div");
  win.id = "rsbr_win";
  document.body.appendChild(win);

  titlebar = document.createElement("div");
  titlebar.id = "rsbr_titlebar";
  win.appendChild(titlebar);

  var span_progname = document.createElement("span");
  span_progname.className = "rsbr_progname";
  titlebar.appendChild(span_progname);

  span_progname.appendChild(document.createTextNode("Best Reader Lite"));

  closebar = document.createElement("div");
  closebar.id = "rsbr_closebar";
  titlebar.appendChild(closebar);

  panel = document.createElement("div");
  panel.id = "rsbr_panel";
  win.appendChild(panel);

  var div_toolbar1 = document.createElement("div");
  div_toolbar1.className = "rsbr_toolbar";
  panel.appendChild(div_toolbar1);

  speed = document.createElement("div");
  speed.id = "rsbr_speed";
  div_toolbar1.appendChild(speed);

  slider = document.createElement("div");
  slider.id = "rsbr_slider";
  div_toolbar1.appendChild(slider);

  handle = document.createElement("div");
  handle.className = "rsbr_handle";
  slider.appendChild(handle);

  var div_toolbar2 = document.createElement("div");
  div_toolbar2.className = "rsbr_toolbar";
  panel.appendChild(div_toolbar2);

  btnPlay = document.createElement("div");
  btnPlay.id = "rsbr_play";
  btnPlay.className = "rsbr_button";
  div_toolbar2.appendChild(btnPlay);

  btnStop = document.createElement("div");
  btnStop.id = "rsbr_stop";
  btnStop.className = "rsbr_button";
  div_toolbar2.appendChild(btnStop);

  btnBigger = document.createElement("div");
  btnBigger.id = "rsbr_bigger";
  btnBigger.className = "rsbr_button";
  div_toolbar2.appendChild(btnBigger);

  btnSmaller = document.createElement("div");
  btnSmaller.id = "rsbr_smaller";
  btnSmaller.className = "rsbr_button";
  div_toolbar2.appendChild(btnSmaller);

  btnAlign = document.createElement("div");
  btnAlign.id = "rsbr_left";
  btnAlign.className = "rsbr_button";
  div_toolbar2.appendChild(btnAlign);

  btnMode = document.createElement("div");
  btnMode.id = "rsbr_dynamic";
  btnMode.className = "rsbr_button";
  div_toolbar2.appendChild(btnMode);

  btnLight = document.createElement("div");
  btnLight.id = "rsbr_light";
  btnLight.className = "rsbr_button";
  div_toolbar2.appendChild(btnLight);

  btnHelp = document.createElement("div");
  btnHelp.id = "rsbr_help";
  btnHelp.className = "rsbr_button";
  div_toolbar2.appendChild(btnHelp);

  trackbar = document.createElement("div");
  trackbar.id = "rsbr_trackbar";
  win.appendChild(trackbar);

  track = document.createElement("div");
  track.id = "rsbr_track";
  trackbar.appendChild(track);

  edgeLeft = document.createElement("div");
  edgeLeft.id = "rsbr_edgeLeft";
  edgeLeft.className = "rsbr_edge";
  track.appendChild(edgeLeft);

  field = document.createElement("div");
  field.id = "rsbr_field";
  track.appendChild(field);

  edgeRight = document.createElement("div");
  edgeRight.id = "rsbr_edgeRight";
  edgeRight.className = "rsbr_edge";
  track.appendChild(edgeRight);

  textfield = document.createElement("div");
  textfield.id = "rsbr_textfield";
  win.appendChild(textfield);

  emptyStart = document.createElement("div");
  textfield.appendChild(emptyStart);

  textShell = document.createElement("span");
  textShell.id = "rsbr_textshell";
  textfield.appendChild(textShell);

  emptyEnd = document.createElement("div");
  textfield.appendChild(emptyEnd);

  vertScrollMask = document.createElement("div");
  vertScrollMask.className = "rsbr_scrollmask";
  win.appendChild(vertScrollMask);

  horizScrollMask = document.createElement("div");
  horizScrollMask.className = "rsbr_scrollmask";
  win.appendChild(horizScrollMask);

  redLine = document.createElement("div");
  redLine.id = "rsbr_redline";
  win.appendChild(redLine);

  btnPlayOff = document.createElement("div");
  btnPlayOff.id = "rsbr_play_off";
  btnPlayOff.className = "rsbr_button_off";
  win.appendChild(btnPlayOff);

  btnSmallerOff = document.createElement("div");
  btnSmallerOff.id = "rsbr_smaller_off";
  btnSmallerOff.className = "rsbr_button_off";
  win.appendChild(btnSmallerOff);

  btnBiggerOff = document.createElement("div");
  btnBiggerOff.id = "rsbr_bigger_off";
  btnBiggerOff.className = "rsbr_button_off";
  win.appendChild(btnBiggerOff);

  btnAlignOff = document.createElement("div");
  btnAlignOff.id = "rsbr_align_off";
  btnAlignOff.className = "rsbr_button_off";
  win.appendChild(btnAlignOff);

  btnModeOff = document.createElement("div");
  btnModeOff.id = "rsbr_mode_off";
  btnModeOff.className = "rsbr_button_off";
  win.appendChild(btnModeOff);

  btnLightOff = document.createElement("div");
  btnLightOff.id = "rsbr_light_off";
  btnLightOff.className = "rsbr_button_off";
  win.appendChild(btnLightOff);

  winScreen = document.createElement("div");
  winScreen.id = "rsbr_screen";
  win.appendChild(winScreen);

  progresscircle = document.createElement("div");
  progresscircle.className = "rsbr_progresscircle";
  progresscircle.id = "rsbr_progresscircle_light";
  win.appendChild(progresscircle);

  coner = document.createElement("div");
  coner.id = "rsbr_coner";
  win.appendChild(coner);

  var Sp = document.createElement("span");
  Sp.className = "rsbr_widthfield";
  field.appendChild(Sp);
  field_text = document.createTextNode("");
  Sp.appendChild(field_text);

  Sp = document.createElement("span");
  Sp.className = "rsbr_number";
  speed.appendChild(Sp);
  speed_text = document.createTextNode("");
  Sp.appendChild(speed_text);
  Sp.appendChild(document.createElement("br"));
  Sp.appendChild(document.createTextNode("wpm"));
}
//---------------------------------------------------------------------------
function initWindow() {
  if (tfWidthSaved != undefined && tfHeightSaved != undefined) {
    textfield.style.width = tfWidthSaved + "px";
    textfield.style.height = tfHeightSaved + "px";
  } else {
    var tfHeight = win.clientHeight - panel.offsetHeight - titlebar.offsetHeight;
    textfield.style.height = tfHeight + "px";
  }

  if (handleX != undefined) handle.style.left = handleX + "px";

  trackbar.style.width = textfield.clientWidth + "px";

  if (winX != undefined && winY != undefined) {
    win.style.left = winX + "px";
    win.style.top = winY + "px";
  } else {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    var winLeft = centerX - win.offsetWidth / 2;
    var winTop = centerY - win.offsetHeight / 2;
    win.style.left = winLeft + "px";
    win.style.top = winTop + "px";
  }

  textfield.style.fontSize = charSize + "px";

  //-- расчет ширины символа -------------------------
  var Sp = document.createElement("span");
  Sp.className = "rsbr_textformat";
  Sp.style.fontSize = charSize + "px";
  Sp.appendChild(document.createTextNode("ZWabcdefghijklm"));
  document.body.appendChild(Sp);
  charWidth = Sp.offsetWidth / 15;
  document.body.removeChild(Sp);
  //---------------------------------------------------
  track.style.width = parseInt(charWidth * sightField + edgeLeft.offsetWidth * 2) + "px";

  field_text.data = sightField + " chars";
  speed_text.data = parseInt(speedReading / 10);

  var conerLeft = win.clientWidth - coner.offsetWidth - (win.clientWidth - textfield.offsetWidth - textfield.offsetLeft);

  var conerTop = win.clientHeight - coner.offsetHeight - (win.clientHeight - textfield.offsetHeight - textfield.offsetTop);

  coner.style.left = conerLeft + "px";
  coner.style.top = conerTop + "px";

  setScrollMasks();

  var left = track.offsetWidth - edgeLeft.offsetWidth;
  edgeRight.style.left = left + "px";

  setRedLine();

  curr_style_b = 'rsbr_light_b';
  curr_style_s = 'rsbr_light_s';

  adjustMode();

  titlebar.addEventListener("mousedown", titDown, false);
  closebar.addEventListener("mousedown", closeDown, false);
  handle.addEventListener("mousedown", handleDown, false);
  btnPlay.addEventListener("click", clickPlay, false);
  btnStop.addEventListener("click", clickStop, false);
  btnSmaller.addEventListener("click", clickSmaller, false);
  btnBigger.addEventListener("click", clickBigger, false);
  btnAlign.addEventListener("click", clickAlign, false);
  btnMode.addEventListener("click", clickMode, false);
  btnLight.addEventListener("click", clickLight, false);

  btnHelp.addEventListener("click", clickHelp, false);
  document.body.addEventListener("mouseup", allUp, false);
  document.body.addEventListener("mousemove", allMove, false);
  coner.addEventListener("mousedown", conerDown, false);
  edgeLeft.addEventListener("mousedown", edgeLeftDown, false);
  edgeRight.addEventListener("mousedown", edgeRightDown, false);
  redLine.addEventListener("mousedown", redLineDown, false);
}
//---------------------------------------------------------------------------
function setRedLine() {
  redLine.style.height = textfield.clientHeight + "px";
  redLine.style.top = textfield.offsetTop + "px";

  var leftSide = textfield.offsetLeft + track.offsetLeft + edgeLeft.offsetWidth;
  var rightSide = textfield.offsetLeft + track.offsetLeft + track.offsetWidth - edgeRight.offsetWidth - redLine.offsetWidth;

  if (!redLineX) {
    redLineX = textfield.offsetLeft + track.offsetLeft + track.offsetWidth / 2 - redLine.offsetWidth / 2;
    redLineDelta = redLineX - (textfield.offsetLeft + track.offsetLeft + edgeLeft.offsetWidth);
  }
  var maxPoseRedLine = track.offsetWidth - edgeLeft.offsetWidth * 2 - redLine.offsetWidth;

  if (redLineDelta > maxPoseRedLine) redLineDelta = maxPoseRedLine;

  redLine.style.left = textfield.offsetLeft + track.offsetLeft + redLineDelta + edgeLeft.offsetWidth + "px";
}
//---------------------------------------------------------------------------
function setScrollMasks() {
  vertScrollMask.style.top = textfield.offsetTop + 'px';
  vertScrollMask.style.left = textfield.offsetLeft + textfield.clientWidth + 'px';
  vertScrollMask.style.height = textfield.offsetHeight + 'px';
  vertScrollMask.style.width = textfield.offsetWidth - textfield.clientWidth + 'px';

  horizScrollMask.style.top = textfield.offsetTop + textfield.clientHeight + 'px';
  horizScrollMask.style.left = textfield.offsetLeft + 'px';
  horizScrollMask.style.height = textfield.offsetHeight - textfield.clientHeight + 'px';
  horizScrollMask.style.width = textfield.clientWidth + 'px';
}
//---------------------------------------------------------------------------
var flagPlay = flagFirstPlay = false;
var tfHeightInStr, dontMove;
var winX, winY, conerX, conerY, handleX, trackWidth, tfHeightSaved, tfWidthSaved;
var X, Y;
var charWidth;
//---------------------------------------------------------------------------
function playOff() {
  var btn = btnPlay.getBoundingClientRect();
  var left = btn.left - win.offsetLeft;
  var top = btn.top - win.offsetTop;
  btnPlayOff.style.left = left + "px";
  btnPlayOff.style.top = top + "px";
  btnPlayOff.style.visibility = "visible";
}
//---------------------------------------------------------------------------
function buttonsOff() {
  var btn = btnPlay.getBoundingClientRect();
  var left = btn.left - win.offsetLeft;
  var top = btn.top - win.offsetTop;
  btnPlayOff.style.left = left + "px";
  btnPlayOff.style.top = top + "px";
  btnPlayOff.style.visibility = "visible";

  btn = btnSmaller.getBoundingClientRect();
  left = btn.left - win.offsetLeft;
  top = btn.top - win.offsetTop;
  btnSmallerOff.style.left = left + "px";
  btnSmallerOff.style.top = top + "px";
  btnSmallerOff.style.visibility = "visible";

  btn = btnBigger.getBoundingClientRect();
  left = btn.left - win.offsetLeft;
  top = btn.top - win.offsetTop;
  btnBiggerOff.style.left = left + "px";
  btnBiggerOff.style.top = top + "px";
  btnBiggerOff.style.visibility = "visible";

  btn = btnAlign.getBoundingClientRect();
  left = btn.left - win.offsetLeft;
  top = btn.top - win.offsetTop;
  btnAlignOff.style.left = left + "px";
  btnAlignOff.style.top = top + "px";
  btnAlignOff.style.visibility = "visible";

  btn = btnMode.getBoundingClientRect();
  left = btn.left - win.offsetLeft;
  top = btn.top - win.offsetTop;
  btnModeOff.style.left = left + "px";
  btnModeOff.style.top = top + "px";
  btnModeOff.style.visibility = "visible";

  btn = btnLight.getBoundingClientRect();
  left = btn.left - win.offsetLeft;
  top = btn.top - win.offsetTop;
  btnLightOff.style.left = left + "px";
  btnLightOff.style.top = top + "px";
  btnLightOff.style.visibility = "visible";

  winScreen.style.left = textfield.offsetLeft + "px";
  winScreen.style.top = trackbar.offsetTop + "px";
  winScreen.style.width = textfield.offsetWidth + "px";
  var height = textfield.offsetTop + textfield.offsetHeight - trackbar.offsetTop;
  winScreen.style.height = height + "px";
  winScreen.style.visibility = "visible";
}
//---------------------------------------------------------------------------
function buttonsOn() {
  btnPlayOff.style.visibility = "hidden";
  btnSmallerOff.style.visibility = "hidden";
  btnBiggerOff.style.visibility = "hidden";
  btnAlignOff.style.visibility = "hidden";
  btnModeOff.style.visibility = "hidden";
  btnLightOff.style.visibility = "hidden";
  winScreen.style.visibility = "hidden";
}
//---------------------------------------------------------------------------
function clickDonation(event) {
  window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8Z4BQVDF5F4GS");
}
//---------------------------------------------------------------------------
function clickAlign(event) {
  if (currAlign == 'centre') currAlign = 'left';
  else currAlign = 'centre';

  adjustAlign();
}
//---------------------------------------------------------------------------
function clickMode(event) {
  if (currMode == 'static') currMode = 'dynamic';
  else currMode = 'static';

  adjustMode();
}
//---------------------------------------------------------------------------
function clickLight(event) {
  if (currLight == 'light') currLight = 'dark';
  else currLight = 'light';

  adjustLight();
  saveScrollPos();
  getText();
}
//---------------------------------------------------------------------------
function clickHelp(event) {
  window.open("http://www.readerssoft.com/best_reader_lite.php");
}
//---------------------------------------------------------------------------
function clickSmaller(event) {
  if (!arrWords || arrWords.length == 0) return;
  saveScrollPos();
  charSize = parseInt(textfield.style.fontSize) - 2;

  //-- расчет ширины символа -------------------------
  Sp = document.createElement("span");
  Sp.className = "rsbr_textformat";
  Sp.style.fontSize = charSize + "px";
  Sp.appendChild(document.createTextNode("ZWabcdefghijklm"));
  document.body.appendChild(Sp);
  var tempCharWidth = Sp.offsetWidth / 15;
  document.body.removeChild(Sp);
  //---------------------------------------------------
  var tempSightField = parseInt((track.offsetWidth - edgeLeft.offsetWidth * 2) / tempCharWidth);
  if (charSize < 10) return;

  charWidth = tempCharWidth;
  sightField = tempSightField;
  textfield.style.fontSize = charSize + "px";

  adjustMode();
  getText();

  field_text.data = sightField + " chars";
}
//---------------------------------------------------------------------------
function clickBigger(event) {
  if (!arrWords || arrWords.length == 0) return;
  saveScrollPos();
  charSize = parseInt(textfield.style.fontSize) + 2;

  //-- расчет ширины символа -------------------------
  Sp = document.createElement("span");
  Sp.className = "rsbr_textformat";
  Sp.style.fontSize = charSize + "px";
  Sp.appendChild(document.createTextNode("ZWabcdefghijklm"));
  document.body.appendChild(Sp);
  var tempCharWidth = Sp.offsetWidth / 15;
  document.body.removeChild(Sp);
  //---------------------------------------------------
  var tempSightField = parseInt((track.offsetWidth - edgeLeft.offsetWidth * 2) / tempCharWidth);
  if (tempSightField < 10) return;

  charWidth = tempCharWidth;
  sightField = tempSightField;
  textfield.style.fontSize = charSize + "px";

  adjustMode();
  getText();

  field_text.data = sightField + " chars";
}
//---------------------------------------------------------------------------
var emptyEnd;
var emptyStart;

function clickPlay(event) {
  if (!arrWords || arrWords.length == 0) return;
  flagPlay = flagFirstPlay = true;

  strCount = parseInt((textfield.scrollTop + parseInt(textfield.style.fontSize) / 2) / parseInt(textfield.style.fontSize));
  textfield.scrollTop = strCount * parseInt(textfield.style.fontSize);

  N = textRng[strCount];

  tfHeightInStr = parseInt(textfield.clientHeight / parseInt(textfield.style.fontSize));
  dontMove = tfHeightInStr;

  runGlow(60000 * sightField / speedReading);
  buttonsOff();
}
//---------------------------------------------------------------------------
function clickStop(event) {
  if (!flagPlay) return;

  var sel = window.getSelection();
  sel.removeAllRanges();

  clearInterval(timer);

  flagPlay = false;
  buttonsOn();

  document.body.className = cN;
  textStrings[strCount - 1].className = curr_style_s;
}
//---------------------------------------------------------------------------
function titDown(event) {
  if (event.target == closebar) return;

  flagTitDown = true;
  X = event.clientX + window.scrollX;
  Y = event.clientY + window.scrollY;
  winX = win.offsetLeft;
  winY = win.offsetTop;
}
//---------------------------------------------------------------------------
function handleDown(event) {
  flagHandleDown = true;
  X = event.clientX + window.scrollX;
  handleX = handle.offsetLeft;
}
//---------------------------------------------------------------------------
function conerDown(event) {
  flagConerDown = true;
  X = event.clientX + window.scrollX;
  Y = event.clientY + window.scrollY;
  conerX = coner.offsetLeft;
  conerY = coner.offsetTop;
}
//---------------------------------------------------------------------------
function closeDown(event) {
  clickStop(null);

  winX = win.offsetLeft;
  winY = win.offsetTop;

  tfWidthSaved = textfield.offsetWidth;
  tfHeightSaved = textfield.offsetHeight;

  handleX = handle.offsetLeft;

  textfield.scrollTop = 0; // если не установить в 0, то при следующем создании элемента textfield, бегунок окажется на старом месте (глюк FF)

  win.parentNode.removeChild(win);
}
//---------------------------------------------------------------------------
function edgeLeftDown(event) {
  if (!arrWords || arrWords.length == 0) return;
  flagEdgeLeftDown = true;
  saveScrollPos();
  X = event.clientX + window.scrollX;
  trackWidth = track.offsetWidth;
  countTimes = -1;
  showTime = window.setInterval(showTextField, 30);
}
//---------------------------------------------------------------------------
function edgeRightDown(event) {
  if (!arrWords || arrWords.length == 0) return;
  flagEdgeRightDown = true;
  saveScrollPos();
  X = event.clientX + window.scrollX;
  trackWidth = track.offsetWidth;
  countTimes = -1;
  showTime = window.setInterval(showTextField, 30);
}
//---------------------------------------------------------------------------
function redLineDown(event) {
  flagRedLineDown = true;
  X = event.clientX + window.scrollX;
  redLineX = redLine.offsetLeft;
}
//---------------------------------------------------------------------------
function allUp(event) {
  if (flagEdgeLeftDown || flagEdgeRightDown) {
    clearInterval(showTime);
    var sizeField = parseInt((track.offsetWidth - edgeLeft.offsetWidth * 2) / charWidth);
    if (sightField != sizeField) {
      countTimes = 3; // Чтобы выполнился showTextField
      showTextField();
    }
  }
  flagTitDown = flagConerDown = flagEdgeLeftDown = flagEdgeRightDown = flagHandleDown = flagRedLineDown = false;
}
//---------------------------------------------------------------------------
function setProgressCircle() {
  var tf = textfield.getBoundingClientRect();
  var left = tf.left - win.offsetLeft + (textfield.offsetWidth - progresscircle.offsetWidth) / 2;
  var top = tf.top - win.offsetTop + (textfield.offsetHeight - progresscircle.offsetHeight) / 2;
  progresscircle.style.left = left + "px";
  progresscircle.style.top = top + "px";
}
//---------------------------------------------------------------------------
function showProgressCircle() {
  setProgressCircle();
  progresscircle.style.visibility = "visible";
}
//---------------------------------------------------------------------------
function hideProgressCircle() {
  progresscircle.style.visibility = "hidden";
}
//---------------------------------------------------------------------------
allMove = function(event) {
  if (flagTitDown) {
    var winLeft = winX + event.clientX + window.scrollX - X;
    var winTop = winY + event.clientY + window.scrollY - Y;

    var insideWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    var insideHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;

    if (insideWidth < winLeft + win.offsetWidth) winLeft = insideWidth - win.offsetWidth;
    if (insideHeight < winTop + win.offsetHeight) winTop = insideHeight - win.offsetHeight;
    if (winLeft < 0) winLeft = 0;
    if (winTop < 0) winTop = 0;

    setScrollMasks();

    win.style.left = winLeft + "px";
    win.style.top = winTop + "px";

    setProgressCircle();
  }
  if (flagConerDown) {
    var dX = event.clientX + window.scrollX - X;
    var dY = event.clientY + window.scrollY - Y;

    var conerLeft = conerX + dX;
    var conerTop = conerY + dY;

    var winPadding = (win.offsetWidth - textfield.offsetWidth) / 2;

    var insideWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    var insideHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;

    if (insideWidth < conerLeft + win.offsetLeft + coner.offsetWidth + winPadding)
        conerLeft = insideWidth - (win.offsetLeft + coner.offsetWidth + winPadding);

    if (insideHeight < conerTop + win.offsetTop + coner.offsetHeight + winPadding)
        conerTop = insideHeight - (win.offsetTop + coner.offsetHeight + winPadding);

    var width = conerLeft + coner.offsetWidth - textfield.offsetLeft;
    var height = conerTop + coner.offsetHeight - textfield.offsetTop;

    if (width < minTextfieldWidth) { width = minTextfieldWidth;
        conerLeft = width - (coner.offsetWidth - textfield.offsetLeft); }
    if (height < minTextfieldHeight) { height = minTextfieldHeight;
        conerTop = height - (coner.offsetHeight - textfield.offsetTop); }

    coner.style.left = conerLeft + "px";
    coner.style.top = conerTop + "px";

    textfield.style.width = width + "px";
    textfield.style.height = height + "px";

    trackbar.style.width = textfield.clientWidth + "px";

    setScrollMasks();
    setRedLine();

    adjustAlign();
    adjustMode();

    setProgressCircle();
  }
  if (flagEdgeLeftDown) {
    var dX = X - (event.clientX + window.scrollX);
    var width = trackWidth + dX * 2;
    if (width > textfield.clientWidth) width = textfield.clientWidth;
    if (charWidth * 10 > width - edgeLeft.offsetWidth * 2) width = charWidth * 10 + edgeLeft.offsetWidth * 2;
    minTextfieldWidth = width + textfield.offsetWidth - textfield.clientWidth;
    if (minTextfieldWidth < constMinTFWidth) minTextfieldWidth = constMinTFWidth;

    track.style.width = width + "px";
    var left = track.offsetWidth - edgeLeft.offsetWidth;
    edgeRight.style.left = left + "px";

    adjustAlign();
    setRedLine();

    countTimes = 0; // Запуск showTextField()
  }
  if (flagEdgeRightDown) {
    var dX = event.clientX + window.scrollX - X;

    var width = trackWidth + dX * 2;
    if (width > textfield.clientWidth) width = textfield.clientWidth;
    if (charWidth * 10 > width - edgeLeft.offsetWidth * 2) width = charWidth * 10 + edgeLeft.offsetWidth * 2;
    minTextfieldWidth = width + textfield.offsetWidth - textfield.clientWidth;
    if (minTextfieldWidth < constMinTFWidth) minTextfieldWidth = constMinTFWidth;

    track.style.width = width + "px";
    var left = track.offsetWidth - edgeLeft.offsetWidth;
    edgeRight.style.left = left + "px";

    adjustAlign();
    setRedLine();

    countTimes = 0; // Запуск showTextField()
  }
  if (flagHandleDown) {
    var dX = event.clientX + window.scrollX - X;
    var handleLeft = handleX + dX;
    if (handleLeft + handle.offsetWidth > slider.clientWidth) handleLeft = slider.clientWidth - handle.offsetWidth;
    if (handleLeft < 0) handleLeft = 0;

    handle.style.left = handleLeft + "px";
    speedReading = 500 + handleLeft * 6500 / (slider.clientWidth - handle.offsetWidth);
    speed_text.data = parseInt(speedReading / 10);

    if (flagPlay) {
      clearInterval(timer);
      timer = setInterval(GlowWords, 60000 * sightField / speedReading);
    }
  }
  if (flagRedLineDown) {
    var dX = event.clientX + window.scrollX - X;
    var redLineLeft = redLineX + dX;
    var leftSide = textfield.offsetLeft + track.offsetLeft + edgeLeft.offsetWidth;
    var rightSide = textfield.offsetLeft + track.offsetLeft + track.offsetWidth - edgeRight.offsetWidth - redLine.offsetWidth;

    if (redLineLeft > rightSide) redLineLeft = rightSide;
    if (redLineLeft < leftSide) redLineLeft = leftSide;

    redLine.style.left = redLineLeft + "px";
    redLineDelta = redLineLeft - (textfield.offsetLeft + track.offsetLeft + edgeLeft.offsetWidth);
  }
}
//---------------------------------------------------------------------------
showTextField = function() {
  var sizeField = parseInt((track.offsetWidth - edgeLeft.offsetWidth * 2) / charWidth);
  if (sightField != sizeField) {
    if (countTimes >= 3) {
      sightField = sizeField;
      countTimes = -1;
      getText();
      //field.innerHTML = "<span class='rsbr_widthfield'>"+sightField + " chars</span>";
      field_text.data = sightField + " chars";
    }
    if (countTimes != -1) countTimes++;
  }
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
splitByRegExp = function(str, regEx) {
  var arr = [];
  var res;
  var currPos = 0,
      nextPos;

  do {
    res = regEx.exec(str);
    if (res == null) nextPos = str.length;
    else nextPos = res.index + 1; // чтобы символ не входил в обе соседних подстроки

    arr.push(str.substring(currPos, nextPos));
    currPos = nextPos;
  } while (nextPos < str.length && res != null);

  regEx.lastIndex = 0;
  return arr;
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
var arrWords = [];
TObjWord = function() {
  var rng;
  var start;
  var end; 
}
//---------------------------------------------------------------------------
TObjWord.prototype.len = function() {
  var spliter = /\s$/;
  var word = this.rng.toString();
  var len = this.end - this.start;

  if (!spliter.test(word)) len += 1;

  return len;
}
//---------------------------------------------------------------------------
TObjWord.prototype.word = function() {
  var spliter = /\s$/;
  var word = this.rng.toString();

  if (!spliter.test(word)) word += " ";

  return word;
}
//---------------------------------------------------------------------------
prepareRngs = function(node) {
  var start, end, lenPart;
  var objWord;
  var arrParts = splitByRegExp(node.data, /[\s\.,\:;\?!\-\=_\+#\*\u2026\/\\]+?/g);
  var notPunct = /[^\s\.,\:;\?!\-\=_\+#\*\u2026\/\\]/i;
  var spliter = /\s$/;

  for (var i = 0, len = 0; i < arrParts.length; i++) {
    start = len;
    lenPart = arrParts[i].length;
    end = len + lenPart;
    len += lenPart;
    if (notPunct.test(arrParts[i])) {
      objWord = new TObjWord;
      objWord.rng = document.createRange();
      objWord.rng.setStart(node, start);
      objWord.rng.setEnd(node, end);
      objWord.start = start;
      objWord.end = end;

      var startRes = shellRange.compareBoundaryPoints(Range.START_TO_START, objWord.rng);
      var endRes = shellRange.compareBoundaryPoints(Range.END_TO_END, objWord.rng);
      if (startRes <= 0 && (endRes >= 0 || (node == shellRange.endContainer && end <= shellRange.endOffset + 1))) // последнее условие (node...endOffset+1) пришлось дописать т.к. в rng учитываются разделители
        arrWords.push(objWord);
    }
  }
}
//---------------------------------------------------------------------------
searchTextNodes = function(currNode) {
  if (currNode.nodeType == 1 || currNode.nodeType == 9) {
    if (!currNode || !currNode.tagName || currNode.tagName == "IFRAME" || currNode.tagName == "TEXTAREA" || currNode.tagName == "FORM" || currNode.tagName == "INPUT" || currNode.tagName == "SCRIPT" || currNode.tagName == "NOSCRIPT" || currNode.tagName == "META" || currNode.tagName == "STYLE" || currNode.tagName == "HEAD" || !window.getComputedStyle || !window.getComputedStyle(currNode, null) || window.getComputedStyle(currNode, null).display == "none" || window.getComputedStyle(currNode, null).visibility == "hidden" || currNode.offsetLeft < -1000 || currNode.offsetTop < -1000 || currNode.id == "rsbr_win") return;
    var children = currNode.childNodes;

    for (var i = 0; i < children.length; i++)
      searchTextNodes(children[i]);
  }
  if (currNode.nodeType == 3) {
    var pNode = currNode.parentNode;

    if (currNode.data && currNode.data.toLowerCase() != "\n" && currNode.data.toLowerCase() != "\r" && currNode.data.toLowerCase() != "\t" && currNode.data.toLowerCase() != " ")
      prepareRngs(currNode);
  }
}
//---------------------------------------------------------------------------
function getSelectedRange() {
  var rng = document.createRange();
  var sel = window.getSelection();

  if (sel.rangeCount > 0)
    rng = sel.getRangeAt(0);

  if (sel.rangeCount === 0 || rng.collapsed)
    rng.selectNodeContents(document.body);

  sel.removeAllRanges();
  return rng;
}

//---------------------------------------------------------------------------
var txtTime;
var flagTextOut = false;

function getText() {
  var lenArrWords = arrWords.length;
  if (lenArrWords < 1) return;
  showProgressCircle();
  textRng = [0];
  playOff();
  var i = 0;
  var firstTime = true;
  var flagBusy = false;
  flagTextOut = true;

  if (txtTime) clearInterval(txtTime);
  txtTime = window.setInterval(getPartOfText, 1);

  adjustAlign();

  function getPartOfText() {
    if (flagBusy) return;
    flagBusy = true;

    var span = document.createElement("span");
    span.className = "rsbr_textformat";

    for (var count = 0, tempLen = 0, tempStr = ""; i < lenArrWords && count < 500; i++) {
      tempLen += arrWords[i].len();
      tempStr += arrWords[i].word();

      if (scrollPos == i) savedPos = textRng.length - 1; // с самого начала в textRng есть один элемент - 0
      if (i == lenArrWords - 1 || tempLen + arrWords[i + 1].len() > sightField + 1) {
        if (i == lenArrWords - 1) { clearInterval(txtTime);
          buttonsOn();
          hideProgressCircle();
          flagTextOut = false; 
        }

        var b = document.createElement("b");
        b.className = curr_style_s;
        span.appendChild(b);
        b.appendChild(document.createTextNode(tempStr.substring(0, tempLen - 1)));
        span.appendChild(document.createElement("br"));

        textRng.push(i + 1); // i - номер ранга, которым заканчивается строка. Первая строка начинается всегда с нулевого ранга.
        tempLen = 0;
        tempStr = "";
        count++;
      }
    }
    if (firstTime) { //textfield.innerHTML = "";  
      while (textShell.firstChild != null) 
        textShell.removeChild(textShell.firstChild);
      firstTime = false;
    }
    textShell.appendChild(span);
    scrollToSavedPos();
    flagBusy = false;
  }
}
//---------------------------------------------------------------------------
var savedPos = 0;

function saveScrollPos() {
  if (flagTextOut) return;
  scrollPos = textRng[parseInt((textfield.scrollTop - emptyStart.offsetHeight + parseInt(textfield.style.fontSize) / 2) / parseInt(textfield.style.fontSize))];
}
//---------------------------------------------------------------------------
function scrollToSavedPos() {
  if (btnMode.id == "rsbr_static" && textfield.scrollTop <= textfield.clientHeight / 2 - parseInt(textfield.style.fontSize)) return;

  textfield.scrollTop = savedPos * parseInt(textfield.style.fontSize) + emptyStart.offsetHeight;
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
var timer;
var cN;
var textStrings = [];

function runGlow(interval) {
  textStrings = document.getElementById("rsbr_textshell").getElementsByTagName("b");

  cN = document.body.className;
  document.body.className += " rsbr_sel";

  timer = setInterval(GlowWords, interval);
  GlowWords();
}
//---------------------------------------------------------------------------
var N = 0,
  strCount;

GlowWords = function() {
  var spliter = /\s$/;
  var sel = window.getSelection();
  sel.removeAllRanges();

  if (N >= arrWords.length) { clickStop(null);
      return; }

  for (var count = 0, delta = 0, len = 0; N < arrWords.length; count++) // count нужен для отслеживания количества элементов
  {
    var rng = arrWords[N].rng;
    if (count == 0) {
      var fullRng = document.createRange();
      fullRng.setStart(rng.startContainer, rng.startOffset);
    }

    len += arrWords[N].end - arrWords[N].start;

    if (!spliter.test(rng.toString())) delta++; // В читалке, если на конце ранга не будет разделителя, то будет добавлен пробел. Это необходимо учитывать

    if (len + delta > sightField + 1 && count > 0) break; // +1, чтобы учесть последний разделитель в строке, который будет виден в окне браузера, но не в окне читалки.
    // Поэтому ширина поля зрения в читалке = sightField символов, а в бракзере = sightField+1
    fullRng.setEnd(rng.endContainer, rng.endOffset);

    sel.addRange(fullRng);

    N++;
  }

  if (strCount - 1 >= 0) textStrings[strCount - 1].className = curr_style_s;
  textStrings[strCount].className = curr_style_b;

  if (currMode == "static") {
    if (!flagFirstPlay) textfield.scrollTop += parseInt(textfield.style.fontSize);
      flagFirstPlay = false;
  } else {
      if (dontMove <= 0) { 
        dontMove = tfHeightInStr;
        textfield.scrollTop += parseInt(textfield.style.fontSize) * tfHeightInStr; 
      }
      dontMove--;
  }
  strCount++;

  var tempEl = document.createElement("rsbr");
  tempEl.appendChild(document.createTextNode("|"));
  rng.insertNode(tempEl);
  tempEl.scrollIntoView(false);
  tempEl.parentNode.removeChild(tempEl);
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
}
var BestReader = new TBestReader();
self.port.on('run', BestReader.run);
