var self = require("sdk/self");
var ui = require("sdk/ui");
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");

var styleBR = "div#rsbr_closebar{ background: url("+self.data.url("close.gif")+") 50% no-repeat !important; }\
div#rsbr_closebar:hover{ background: url('"+self.data.url("close_over.gif")+"') 50% no-repeat !important; }\
div#rsbr_closebar:active{ background: url("+self.data.url("close.gif")+") 50% no-repeat !important; }\
div#rsbr_slider{ background: transparent url("+self.data.url("line_slider.gif")+") 50% no-repeat !important; }\
div#rsbr_handle_light{ background: url("+self.data.url("handle_light.gif")+") !important; }\
div#rsbr_handle_light:hover{ background: url("+self.data.url("handle_light_over.gif")+") !important; }\
div#rsbr_handle_dark{ background: url("+self.data.url("handle_dark.gif")+") !important; }\
div#rsbr_handle_dark:hover{ background: url("+self.data.url("handle_dark_over.gif")+") !important; }\
div.rsbr_button#rsbr_play{ background: url("+self.data.url("play.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_play:hover{ background: url("+self.data.url("play_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_play:active{ background: url("+self.data.url("play.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_stop{ background: url("+self.data.url("stop.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_stop:hover{ background: url("+self.data.url("stop_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_stop:active{ background: url("+self.data.url("stop.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_bigger{ background: url("+self.data.url("bigger.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_bigger:hover{ background: url("+self.data.url("bigger_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_bigger:active{ background: url("+self.data.url("bigger.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_smaller{ background: url("+self.data.url("smaller.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_smaller:hover{ background: url("+self.data.url("smaller_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_smaller:active{ background: url("+self.data.url("smaller.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_donation{ background: url("+self.data.url("donation.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_donation:hover{ background: url("+self.data.url("donation_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_donation:active{ background: url("+self.data.url("donation.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_centre{ background: url("+self.data.url("centre.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_centre:hover{ background: url("+self.data.url("centre_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_centre:active{ background: url("+self.data.url("centre.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_left{ background: url("+self.data.url("left.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_left:hover{ background: url("+self.data.url("left_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_left:active{ background: url("+self.data.url("left.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_static{ background: url("+self.data.url("static.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_static:hover{ background: url("+self.data.url("static_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_static:active{ background: url("+self.data.url("static.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_dynamic{ background: url("+self.data.url("dynamic.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_dynamic:hover{ background: url("+self.data.url("dynamic_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_dynamic:active{ background: url("+self.data.url("dynamic.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_light{ background: url("+self.data.url("light.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_light:hover{ background: url("+self.data.url("light_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_light:active{ background: url("+self.data.url("light.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_help{ background: url("+self.data.url("help.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_help:hover{ background: url("+self.data.url("help_over.gif")+") 50% no-repeat !important; }\
div.rsbr_button#rsbr_help:active{ background: url("+self.data.url("help.gif")+") 50% no-repeat !important; }\
div#rsbr_progresscircle_light{ background: url("+self.data.url("progresscircle_light.gif")+") 50% no-repeat !important; }\
div#rsbr_progresscircle_dark{ background: url("+self.data.url("progresscircle_dark.gif")+") 50% no-repeat !important; }\
div#rsbr_coner{ background: url("+self.data.url("coner.png")+") 50% no-repeat !important; }";

pageMod.PageMod({
  include: "*",
  contentStyleFile: self.data.url("BReader.css"),
  contentStyle: styleBR,
  contentScriptFile: self.data.url("BReader.js"),
  attachTo: ["existing", "top"],
  onAttach: function(worker) { worker.tab.gWorker = worker; },
  contentScriptWhen: "end"
});

var action_button = ui.ActionButton({
  id: "BRL",
  label: "Best Reader Lite",
  icon: "./book.png",
  onClick: function(){ var ready = "yes";
                       tabs.activeTab.attach({contentScript: "if(document.readyState!='complete') { self.postMessage('notYet'); alert('Please wait while the page is loaded!');}",
                                              onMessage: function(data) { ready = data; }
                                             });
                       if(tabs.activeTab.gWorker && ready=="yes") { tabs.activeTab.gWorker.port.emit('run'); }
                     }
});
