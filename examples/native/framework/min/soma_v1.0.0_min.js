(function(){soma={};if(!Function.prototype.bind){Function.prototype.bind=function c(f){var g=this;if(typeof g!="function"){throw new Error("Error, you must bind a function.")}var d=Array.prototype.slice.call(arguments,1);var e=function(){if(this instanceof e){var j=function(){};j.prototype=g.prototype;var i=new j;var h=g.apply(i,d.concat(Array.prototype.slice.call(arguments)));if(Object(h)===h){return h}return i}else{return g.apply(f,d.concat(Array.prototype.slice.call(arguments)))}};return e}}soma.applyProperties=function(d,f){for(var e in f){d[e]=f[e]}};soma.inherit=function(g,f){var d;if(f&&f.hasOwnProperty("constructor")){d=f.constructor}else{d=function(){return g.apply(this,arguments)}}soma.applyProperties(d.prototype,g.prototype);var e=function(){};e.prototype=g.prototype;d.prototype=new e();if(f){soma.applyProperties(d.prototype,f,g.prototype)}d.prototype.constructor=d;d.parent=g.prototype;d.extend=function(h){return soma.inherit(d,h)};return d};soma.extend=function(d){return soma.inherit(function(){},d)};var b=soma.extend({dispatchEvent:function(){this.instance.dispatchEvent.apply(this.instance,arguments)},addEventListener:function(){this.instance.addEventListener.apply(this.instance,arguments)},removeEventListener:function(){this.instance.removeEventListener.apply(this.instance,arguments)},hasCommand:function(d){return this.instance.hasCommand(d)},getCommand:function(d){return this.instance.getCommand(d)},getCommands:function(){return this.instance.getCommands()},addCommand:function(e,d){this.instance.controller.addCommand(e,d)},removeCommand:function(d){this.instance.controller.removeCommand(d)},hasWire:function(d){return this.instance.hasWire(d)},getWire:function(d){return this.instance.getWire(d)},addWire:function(e,d){return this.instance.addWire(e,d)},removeWire:function(d){this.instance.removeWire(d)},hasModel:function(d){return this.instance.hasModel(d)},getModel:function(d){return this.instance.getModel(d)},addModel:function(d,e){return this.instance.addModel(d,e)},removeModel:function(d){this.instance.removeModel(d)},getSequencer:function(d){return !!this.instance.controller?this.instance.controller.getSequencer(d):null},stopSequencerWithEvent:function(d){return !!this.instance.controller?this.instance.controller.stopSequencerWithEvent(d):null},stopSequencer:function(d){if(this.instance.controller){return this.instance.controller.stopSequencer(d)}},stopAllSequencers:function(){if(this.instance.controller){this.instance.controller.stopAllSequencers()}},isPartOfASequence:function(d){return !!this.instance.controller?this.instance.controller.isPartOfASequence(d):false},getLastSequencer:function(){return !!this.instance.controller?this.instance.controller.getLastSequencer():null},getRunningSequencers:function(){return !!this.instance.controller?this.instance.controller.getRunningSequencers():null},hasView:function(d){return this.instance.hasView(d)},getView:function(d){return this.instance.getView(d)},addView:function(e,d){return this.instance.addView(e,d)},removeView:function(d){this.instance.removeView(d)}});soma.AutoBind={blackList:["initialize","parent","constructor","$constructor","addEventListener","removeEventListener"],autobind:function(){if(this.wasAutoBound){return}var g=this;var e=g.AutoBindPattern;var f="([lL]istener|[hH]andler|[cB]allback)$";if(!e){e=f}else{e=f+"|"+e}for(var d in g){if(typeof g[d]=="function"){if(this._autobindIsBlacklisted(d)){continue}if(!d.match(e)){continue}g[d]=g[d].bind(g)}}},_autobindIsBlacklisted:function(d){var f=this.blackList;for(var e=0;e<f.length;e++){if(f[e]==d){return true}}return false}};soma.Command=b.extend({instance:null,registerInstance:function(d){this.instance=d},execute:function(d){},toString:function(){return"[soma.Command]"}});var a=soma.extend({event:null,sequenceId:null,constructor:function(d){this.event=d}});soma.SequenceCommand=soma.Command.extend({commands:null,currentCommand:null,id:null,constructor:function(d){if(d==null){throw new Error("SequenceCommand Children expect an unique id as constructor arg")}this.commands=[];this.id=d;soma.Command.call(this)},registerInstance:function(d){this.instance=d;this.initializeSubCommands()},initializeSubCommands:function(){throw new Error("Subclasses of SequenceCommand must implement initializeSubCommands()")},addSubCommand:function(d){var e=new a(d);this.commands.push(e);this.instance.controller.registerSequencedCommand(this,e)},execute:function(d){if(this.commands==null||this.commands.length===0){return}this.currentCommand=this.commands.shift();if(this.hasCommand(this.currentCommand.event.type)){this.dispatchEvent(this.currentCommand.event)}},executeNextCommand:function(){if(this.commands==null){return}this.instance.controller.unregisterSequencedCommand(this,this.currentCommand.event.type);if(this.commands.length>0){this.execute(this.commands[0].event)}else{this.commands=null;this.currentCommand=null}},getLength:function(){if(this.commands==null){return -1}return this.commands.length},stop:function(){this.commands=null;this.commands=null;this.currentCommand=null;return this.instance.controller.unregisterSequencer(this)},getCurrentCommand:function(){return this.currentCommand},getCommands:function(){return this.commands},toString:function(){return"[soma.SequenceCommand]"}});soma.ParallelCommand=soma.Command.extend({commands:null,constructor:function(){this.commands=[]},registerInstance:function(d){this.instance=d;this.initializeSubCommands()},initializeSubCommands:function(){throw new Error("Subclasses of ParallelCommand must implement initializeSubCommands()")},addSubCommand:function(d){this.commands.push(d)},execute:function(){while(this.commands.length>0){var d=this.commands.shift();if(this.hasCommand(d.type)){this.dispatchEvent(d)}}this.commands=null},getLength:function(){return this.commands!=null?this.commands.length:-1},getCommands:function(){return this.commands},toString:function(){return"[soma.ParallelCommand]"}});soma.Wire=b.extend({name:null,instance:null,constructor:function(d){this.name=d},registerInstance:function(d){this.instance=d},init:function(){},dispose:function(){},getName:function(){return this.name},setName:function(d){this.name=d},toString:function(){return"[soma.Wire]"}});soma.applyProperties(soma.Wire.prototype,soma.AutoBind);soma.IDisposable=soma.extend({dispose:function(){}});soma.SomaController=soma.extend({instance:null,constructor:function(d){this.boundInstance=this.instanceHandler.bind(this);this.boundDomtree=this.domTreeHandler.bind(this);this.commands={};this.sequencers={};this.sequencersInfo={};this.lastEvent=null;this.lastSequencer=null;this.instance=d},addInterceptor:function(d){if(!soma){throw new Error("soma package has been overwritten by local variable")}if(this.instance.body.addEventListener){this.instance.body.addEventListener(d,this.boundDomtree,true)}this.instance.addEventListener(d,this.boundInstance,-Number.MAX_VALUE)},removeInterceptor:function(d){if(this.instance.body.removeEventListener){this.instance.body.removeEventListener(d,this.boundDomtree,true)}this.instance.removeEventListener(d,this.boundInstance)},executeCommand:function(f){var d=f.type;if(this.hasCommand(d)){var g=new this.commands[d]();g.registerInstance(this.instance);g.execute(f)}},registerSequencedCommand:function(d,f){if(!(f instanceof a)){throw new Error("capsulate sequence commands in SequenceCommandProxy objects!")}var e=this.sequencersInfo;if(e[d.id]==null||this.sequencers[d.id]==null){this.lastSequencer=d;e[d.id]=[];this.sequencers[d.id]=d}f.sequenceId=d.id;e[d.id].push(f)},unregisterSequencedCommand:function(e,g){if(typeof g!="string"){throw new Error("Controller::unregisterSequencedCommand() expects commandName to be of type String, given:"+g)}var h=this.sequencersInfo;if(h[e.id]!=null&&h[e.id]!=undefined){var d=h[e.id].length;for(var f=0;f<d;f++){if(h[e.id][f].event.type==g){h[e.id][f]=null;h[e.id].splice(f,1);if(h[e.id].length==0){h[e.id]=null;delete h[e.id]}break}}}},unregisterSequencer:function(e){var g=this.sequencers;if(g[e.id]!=null&&g[e.id]!=undefined){g[e.id]=null;delete g[e.id];g=this.sequencersInfo;if(g[e.id]!=null){var d=g[e.id].length;for(var f=0;f<d;f++){g[e.id][f]=null}g[e.id]=null;delete g[e.id];return true}}return false},hasCommand:function(d){return this.commands[d]!=null},getCommand:function(d){if(this.hasCommand(d)){return this.commands[d]}return null},getCommands:function(){var e=[];var d=this.commands;for(var f in d){e.push(f)}return e},addCommand:function(d,e){if(this.hasCommand(d)){throw new Error("Error in "+this+' Command "'+d+'" already registered.')}this.commands[d]=e;this.addInterceptor(d)},removeCommand:function(d){if(!this.hasCommand(d)){return}this.commands[d]=null;delete this.commands[d];this.removeInterceptor(d)},getSequencer:function(j){var g=this.sequencersInfo;for(var h in g){var d=g[h].length;for(var f=0;f<d;f++){if(g[h][f]&&g[h][f].event.type===j.type){var e=this.sequencers[g[h][f].sequenceId];return !!e?e:null}}}return null},stopSequencerWithEvent:function(j){var g=this.sequencersInfo;for(var h in g){var d=g[h].length;for(var f=0;f<d;f++){if(g[h][f].event.type===j.type){try{this.sequencers[g[h][f].sequenceId].stop()}catch(k){return false}return true}}}return false},stopSequencer:function(d){if(d==null){return false}d.stop();return true},stopAllSequencers:function(){var e=this.sequencers;var g=this.sequencersInfo;for(var f in e){if(g[f]==null){continue}var d=g[f].length;g[f]=null;delete g[f];e[f].stop();e[f]=null;delete e[f]}},isPartOfASequence:function(d){return(this.getSequencer(d)!=null)},getRunningSequencers:function(){var d=[];var e=this.sequencers;for(var f in e){d.push(e[f])}return d},getLastSequencer:function(){return this.lastSequencer},dispose:function(){for(var e in this.commands){this.removeCommand(e)}for(var d in this.sequencers){this.sequencers[d]=null;delete this.sequencers[d]}this.commands=null;this.sequencers=null;this.lastEvent=null;this.lastSequencer=null},domTreeHandler:function(f){if(f.bubbles&&this.hasCommand(f.type)&&!f.isCloned){if(f.stopPropagation){f.stopPropagation()}else{f.cancelBubble=true}var d=f.clone();this.lastEvent=d;this.instance.dispatchEvent(d);if(!d.isDefaultPrevented()){this.executeCommand(f)}this.lastEvent=null}},instanceHandler:function(d){if(d.bubbles&&this.hasCommand(d.type)){if(this.lastEvent!=d){if(!d.isDefaultPrevented()){this.executeCommand(d)}}}this.lastEvent=null}});soma.SomaViews=soma.extend({views:null,autoBound:false,instance:null,constructor:function(d){this.views={};this.instance=d},hasView:function(d){return this.views[d]!=null},addView:function(e,d){if(this.hasView(e)){throw new Error('View "'+e+'" already exists')}if(document.attachEvent){d.instance=this.instance}if(!this.autoBound){soma.applyProperties(soma.View.prototype,soma.AutoBind);this.autoBound=true}if(d.shouldAutobind){d.autobind()}this.views[e]=d;if(d.init!=null){d.init()}return d},getView:function(d){if(this.hasView(d)){return this.views[d]}return null},getViews:function(){var e={};for(var d in this.views){e[d]=this.views[d]}return e},removeView:function(d){if(!this.hasView(d)){return}if(this.views[d]["dispose"]!=null){this.views[d].dispose()}this.views[d]=null;delete this.views[d]},dispose:function(){for(var d in this.views){this.removeView(d)}this.views=null;this.instance=null}});soma.EventDispatcher=soma.extend({listeners:null,constructor:function(){this.listeners=[]},addEventListener:function(e,f,d){if(!this.listeners||!e||!f){return}if(isNaN(d)){d=0}this.listeners.push({type:e,listener:f,priority:d,scope:this})},removeEventListener:function(f,h){if(!this.listeners||!f||!h){return}var e=0;var d=this.listeners.length;for(e=d-1;e>-1;e--){var g=this.listeners[e];if(g.type==f&&g.listener==h){this.listeners.splice(e,1)}}},hasEventListener:function(f){if(!this.listeners||!f){return false}var e=0;var d=this.listeners.length;for(;e<d;++e){var g=this.listeners[e];if(g.type==f){return true}}return false},dispatchEvent:function(f){if(!this.listeners||!f){return}var e=[];var d;for(d=0;d<this.listeners.length;d++){var g=this.listeners[d];if(g.type==f.type){e.push(g)}}e.sort(function(i,h){return h.priority-i.priority});for(d=0;d<e.length;d++){e[d].listener.apply((f.srcElement)?f.srcElement:f.currentTarget,[f])}},getListeners:function(){return this.listeners.slice()},toString:function(){return"[soma.EventDispatcher]"},dispose:function(){this.listeners=null}});soma.Application=soma.EventDispatcher.extend({body:null,models:null,controller:null,wires:null,views:null,constructor:function(){soma.EventDispatcher.call(this);this.body=document.body;if(!this.body){throw new Error("soma requires body of type Element")}this.controller=new soma.SomaController(this);this.models=new soma.SomaModels(this);this.wires=new soma.SomaWires(this);this.views=new soma.SomaViews(this);this.init();this.registerModels();this.registerViews();this.registerCommands();this.registerWires();this.start()},hasCommand:function(d){return(!this.controller)?false:this.controller.hasCommand(d)},getCommand:function(d){return(!this.controller)?null:this.controller.getCommand(d)},getCommands:function(){return(!this.controller)?null:this.controller.getCommands()},addCommand:function(d,e){this.controller.addCommand(d,e)},removeCommand:function(d){this.controller.removeCommand(d)},hasWire:function(d){return(!this.wires)?false:this.wires.hasWire(d)},getWire:function(d){return(!this.wires)?null:this.wires.getWire(d)},getWires:function(){return(!this.wires)?null:this.wires.getWires()},addWire:function(e,d){return this.wires.addWire(e,d)},removeWire:function(d){this.wires.removeWire(d)},hasModel:function(d){return(!this.models)?false:this.models.hasModel(d)},getModel:function(d){return(!this.models)?null:this.models.getModel(d)},getModels:function(){return(!this.models)?null:this.models.getModels()},addModel:function(d,e){return this.models.addModel(d,e)},removeModel:function(d){this.models.removeModel(d)},hasView:function(d){return(!this.views)?false:this.views.hasView(d)},getView:function(d){return(!this.views)?null:this.views.getView(d)},getViews:function(){return(!this.views)?null:this.views.getViews()},addView:function(e,d){return this.views.addView(e,d)},removeView:function(d){this.views.removeView(d)},getSequencer:function(d){return !!this.controller?this.controller.getSequencer(d):null},isPartOfASequence:function(d){return(this.getSequencer(d)!=null)},stopSequencerWithEvent:function(d){return !!this.controller?this.controller.stopSequencerWithEvent(d):false},stopSequencer:function(d){return !!this.controller?this.controller.stopSequencer(d):false},stopAllSequencers:function(){if(this.controller){this.controller.stopAllSequencers()}},getRunningSequencers:function(){return !!this.controller?this.controller.getRunningSequencers():null},getLastSequencer:function(){return !!this.controller?this.controller.getLastSequencer():null},dispose:function(){soma.EventDispatcher.prototype.dispose.call(this);if(this.models){this.models.dispose();this.models=null}if(this.views){this.views.dispose();this.views=null}if(this.controller){this.controller.dispose();this.controller=null}if(this.wires){this.wires.dispose();this.wires=null}this.body=null},toString:function(){return"[soma.Application]"},init:function(){},registerModels:function(){},registerViews:function(){},registerCommands:function(){},registerWires:function(){},start:function(){}});soma.SomaModels=soma.extend({models:null,instance:null,constructor:function(d){this.models={};this.instance=d},hasModel:function(d){return this.models[d]!=null},getModel:function(d){if(this.hasModel(d)){return this.models[d]}return null},getModels:function(){var f={};var e=this.models;for(var d in e){f[d]=e[d]}return f},addModel:function(d,e){if(this.hasModel(d)){throw new Error('Model "'+d+'" already exists')}this.models[d]=e;if(!e.dispatcher){e.dispatcher=this.instance}e.init();return e},removeModel:function(d){if(!this.hasModel(d)){return}this.models[d].dispose();this.models[d]=null;delete this.models[d]},dispose:function(){for(var d in this.models){this.removeModel(d)}this.models=null;this.instance=null}});soma.Model=soma.extend({name:null,data:null,dispatcher:null,constructor:function(d,f,e){this.data=f;this.dispatcher=e;if(d!=null){this.name=d}},init:function(){},dispose:function(){},dispatchEvent:function(){if(this.dispatcher){this.dispatcher.dispatchEvent.apply(this.dispatcher,arguments)}},addEventListener:function(){if(this.dispatcher){this.dispatcher.addEventListener.apply(this.dispatcher,arguments)}},removeEventListener:function(){if(this.dispatcher){this.dispatcher.addEventListener.apply(this.dispatcher,arguments)}},getName:function(){return this.name},setName:function(d){this.name=d},toString:function(){return"[soma.Model]"}});soma.View=soma.extend({instance:null,domElement:null,constructor:function(f){var e;if(f!=undefined){if(f.nodeType){e=f}else{throw new Error("domElement has to be a DOM-ELement")}}else{e=document.body}this.domElement=e},dispatchEvent:function(d){if(this.domElement.dispatchEvent){this.domElement.dispatchEvent(d)}else{if(this.instance){this.instance.dispatchEvent(d)}}},addEventListener:function(){if(this.domElement.addEventListener){this.domElement.addEventListener.apply(this.domElement,arguments)}else{if(this.instance){this.instance.addEventListener.apply(this.instance,arguments)}}},removeEventListener:function(){if(this.domElement.addEventListener){this.domElement.removeEventListener.apply(this.domElement,arguments)}else{if(this.instance){this.instance.removeEventListener.apply(this.instance,arguments)}}},init:function(){},dispose:function(){},toString:function(){return"[soma.View]"}});soma.SomaWires=soma.extend({wires:null,instance:null,constructor:function(d){this.wires={};this.instance=d},hasWire:function(d){return this.wires[d]!=null},addWire:function(e,d){if(this.hasWire(e)){throw new Error('Wire "'+e+'" already exists')}if(d.shouldAutobind){d.autobind()}this.wires[e]=d;d.registerInstance(this.instance);d.init();return d},getWire:function(d){if(this.hasWire(d)){return this.wires[d]}return null},getWires:function(){var e={};for(var d in this.wires){e[d]=this.wires[d]}return e},removeWire:function(d){if(!this.hasWire(d)){return}this.wires[d].dispose();this.wires[d]=null;delete this.wires[d]},dispose:function(){for(var d in this.wires){this.removeWire(d)}this.wires=null;this.instance=null}});soma.Mediator=soma.Wire.extend({viewComponent:null,constructor:function(d){soma.Wire.call(this,d);this.viewComponent=viewComponent},dispose:function(){this.viewComponent=null},toString:function(){return"[soma.Mediator]"}});soma.Event=soma.extend({constructor:function(g,i,f,d){var h=soma.Event.createGenericEvent(g,f,d);if(i!=null&&i!=undefined){h.params=i}h.isCloned=false;h.clone=this.clone.bind(h);h.isIE9=this.isIE9;h.isDefaultPrevented=this.isDefaultPrevented;if(this.isIE9()||!h.preventDefault||(h.getDefaultPrevented==undefined&&h.defaultPrevented==undefined)){h.preventDefault=this.preventDefault.bind(h)}if(this.isIE9()){h.IE9PreventDefault=false}return h},clone:function(){var d=soma.Event.createGenericEvent(this.type,this.bubbles,this.cancelable);d.params=this.params;d.isCloned=true;d.clone=this.clone;d.isDefaultPrevented=this.isDefaultPrevented;d.isIE9=this.isIE9;if(this.isIE9()){d.IE9PreventDefault=this.IE9PreventDefault}return d},preventDefault:function(){if(!this.cancelable){return false}this.defaultPrevented=true;if(this.isIE9()){this.IE9PreventDefault=true}this.returnValue=false;return this},isDefaultPrevented:function(){if(!this.cancelable){return false}if(this.isIE9()){return this.IE9PreventDefault}if(this.defaultPrevented!=undefined){return this.defaultPrevented}else{if(this.getDefaultPrevented!=undefined){return this.getDefaultPrevented()}}return false},isIE9:function(){return document.body.style.scrollbar3dLightColor!=undefined&&document.body.style.opacity!=undefined},toString:function(){return"[soma.Event]"}});soma.Event.createGenericEvent=function(g,f,d){var h;f=f!==undefined?f:true;if(document.createEvent){h=document.createEvent("Event");h.initEvent(g,f,!!d)}else{h=document.createEventObject();h.type=g;h.bubbles=!!f;h.cancelable=!!d}return h};soma.IResponder=soma.extend({fault:function(d){},result:function(d){}})})();