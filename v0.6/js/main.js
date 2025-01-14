var gdat = {};
var alms = new Audio('alarm_beep.mp3');
var ae = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

$(document).ready(function(){
  startClock();     // Initialize clock
  // Initial load
  $("#wrap").addClass("animate fadeIn");

  // Alarm select handler
  $("#btn-alarm").click(function(){
  $("#btn-control").empty();          // Clear control(direction) area
    addBtn("btn-reset");
    alarmCntl();
  });

  // Timer click handler
  $("#btn-timer").click(function(){
  $("#btn-control").empty();          // Clear control(direction) area
    addBtn("btn-reset");
    timerCntl();
  });

  // Reset click handler
  $("#btn-reset").click(function(){
    location.reload();      // Reload page (from cache)
  });

  $(".modal-close").click(function(){
    gdat["alarmSet"] = 0;
    alms.pause();         // Stop sound
    alms.currentTime = 0; // Current playback reset
    setStatus(0);         // Clear alarm display status
  });

  // Snooze click handler
  $(".modal-snz").click(function(){
    gdat["alarmTm"] = updTm(gdat["alarmTm"],5);// 5 minute snooze
    alms.pause();                           // Pause alarm sound
    alms.currentTime = 0;                   // Reset sound playback
    setStatus(1);                           // Set updated alarm status
    $(".modal-box, .modal-overlay").fadeOut(500, function() { // Fade out modal
      $(".modal-overlay").remove();         // Remove modal from DOM
    });
    gdat["alarmOn"] = 1;                    // Set alarm active
  });
 
  
  // Modal close handler
  $(".modal-close, .modal-overlay").click(function() {
    $(".modal-box, .modal-overlay").fadeOut(500, function() {
    });
  });
  
  // Adjust modal on window resize
  $(window).resize(function(){
    $(".modal-box").css({
      top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
      left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
  });
  $(window).resize();

});
  // Set and initalize timer
/*
  $('#set-tmr').click(function(){
    var x = 30;
    startTimer(x);
  });

function startTimer(duration) {
  var timer = duration, minutes, seconds;
  setInterval(function(){
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.text(minutes + ":" + seconds);

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
};

var display = $("#tmr-disp");
$(function($){
  startTimer(60);
});
*/



/* Helpers */
function startClock(){
  var today = new Date();       // Date/time obj
  var tdy = "";                 // Today date
  var dd = today.getDate();     // Day
  var mm = today.getMonth()+1;  // Month
  var yy = today.getFullYear(); // Year
  var h = today.getHours();     // Hours
  var m = today.getMinutes();   // Mins
  var s = today.getSeconds();   // Secs
  dd = zeroFmt(dd);          // Format date output
  mm = zeroFmt(mm);
  tdy = mm+'/'+dd+'/'+yy;     
  m = zeroFmt(m);
  s = zeroFmt(s);
  gdat["curTm"] = ""+h+m;
  var alm_h = "";
  var alm_m = "";
  alm_tm = "";
  if(gdat["alarmSet"] == 1){
    alm_h = gdat["alarmTm"].slice(0,2);
    alm_m = gdat["alarmTm"].slice(3,5);
    alm_tm = alm_h+alm_m;
    console.log(alm_tm);
    if(alm_tm == (""+h+m)){
      alarm();      // Start alarm sequence
    }
  }
  $("#date").children('h3').text(tdy);
  $("#real-time-clock").children('h1').text(h +":"+m+":"+s);
  var t = setTimeout(function(){startClock()},500);
};

// Choose alarm controller  
function alarmCntl(){
  var os = '<div class="input-group clockpicker">\
              <input type="text" class="form-control ns" value="06:32">\
              <span class="input-group-addon">\
                <span class="glyphicon glyphicon-time"></span>\
              </span>\
            </div>';
  $("#control").html(os);
  $(".clockpicker").addClass("animate fadeIn");
  var ai = $('.clockpicker').clockpicker({
    placement  : 'bottom',
    align      : 'left',
    donetext   : 'Set Alarm',
    afterDone  : function(){
      var almTime = $(".clockpicker").children(".form-control").val();  
      gdat = {                                // Set global data
        alarmSet : 1,
        alarmTm  : almTime,
        alarmOn : 1
      }
      setStatus(1);
    },
  });
};

// Sound the alarm!
function alarm(){
  alms.play();              // Play alarm sound
  if(gdat["alarmOn"] == 1){ // Alarm modal not active
    showModal();            // Show alarm modal controls
  }
};

// Alarm modal 
function showModal(){
  var at =  ("<div class='modal-overlay modal-close'></div>");
  $("body").append(at);
  $(".modal-overlay").fadeTo(500, 0.7);
  $('#popup').fadeIn($(this).data());
  gdat["alarmOn"] = 0;
};  

// Add button to dom
function addBtn(x){
  var btn = $("#"+x);
  btn.removeClass("hdn");
  btn.addClass("animate fadeIn");
  btn.one(ae,function(){
    btn.removeClass("animate fadeIn");
  });
};

// Status message control
function setStatus(x){
  var almDisp = $("#alarm-tm");
  var stat = $("#status");
  if (x == 0){        // Clear status
    almDisp.find("p").text("Alarm Not Set");
    almDisp.addClass("hdn");
    stat.find("p").addClass("hdn");
  } else {
    if (gdat["alarmSet"] == 1){                     // Alarm is set
      $("#btn-reset").removeClass("hdn");           // Enable reset button control  
      stat.html("<span><p>Alarm Set...</p></span>");// Add alarmset text
      stat.addClass("animate fadeInUp");            // Start animation
      stat.one(ae,function(){                       // Remove animation
        stat.removeClass("fadeInUp");
        stat.addClass("fadeOut");
        stat.one(ae,function(){                   
          stat.find("p").addClass("hdn");
          stat.removeClass("fadeOut");
        });
      });
      almDisp.find("p").text("Alarm Set: "+gdat['alarmTm']);  // Set visual alarm time
      almDisp.removeClass("hdn");                                            
      almDisp.addClass("animate fadeIn");
      almDisp.one(ae,function(){
        almDisp.removeClass("animate fadeIn");
      });
    }
  }  
};

// Add leading 0 when needed
function zeroFmt(i) {
  if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
};

// Not currently used (12 hour clock conversion)
function fmtHr(h_24) {
    var h = h_24 % 12;
    if (h === 0) h = 12;
    return (h < 10 ? '0' : '') + h + (h_24 < 12 ? 'am' : 'pm');
};

// Timer control
function timerCntl(){
  var proc = [];
  proc["h"] = 23;
  proc["m"] = 59;
  proc["s"] = 59;
  var os = "";
  os = "<div class='tmr-head'><p style='padding-left:25px;'>Hrs</p><p>Mins</p><p>Secs</p></div><div id='tmr-cntls'><form class='form-inline'>"; 
  for(var key in proc){   // Hours,mins,sec selbox control
    var mx = proc[key];   // Proc limit
    os += "<select id='tmr-"+key+"' class='form-control tmr-sel'>";
    for(var i = 0; i <= mx; i++){
      if(i<10){ i="0"+i; } // Visual choice fix
      os += "<option val='"+i+"'>"+i+"</option>";
    } 
    os += "</select>";   
  }
  os += "</form></div>";
  $("#control").addClass("tmr"); // Control has timer class
  $("#control").html(os); // Append to DOM
};


// Modify time string
// x - Time 
// y - Interval
function updTm(x,y){
  var tm_h = parseInt(x.substring(0,2));    // Curent hour
  var tm_m = parseInt(x.substring(3,5));    // Current minute
  var incr = y;                   // Increment 
  if((tm_m+incr) == 60){          // New hour
    tm_h = chkHr(tm_h);           // Set hour
    tm_m = 0;                     // Reset minute
  } else {
    tm_m = tm_m + incr;           // Set new minute           
  }
  return tm_h+":"+tm_m;

  function chkHr(x){
    x++;
    if(x == 24){
      x = 0;
    } else {
      x++;
    }
    return x;
  };
};