// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(clock) {
    "use strict";    return clock.ClockApplication = (function(_super) {
      __extends(ClockApplication, _super);

      function ClockApplication(element) {
        this.element = element;
        ClockApplication.__super__.constructor.call(this);
      }

      ClockApplication.prototype.init = function() {
        this.injector.mapClass('timer', clock.TimerModel, true);
        this.injector.mapClass('face', clock.FaceView);
        this.injector.mapClass('needleSeconds', clock.NeedleSeconds);
        this.injector.mapClass('needleMinutes', clock.NeedleMinutes);
        this.injector.mapClass('needleHours', clock.NeedleHours);
        this.mediators.create(clock.ClockMediator, this.element.querySelector('.clock'));
        return this.createTemplate(clock.SelectorView, this.element.querySelector('.clock-selector'));
      };

      ClockApplication.prototype.start = function() {
        return this.dispatcher.dispatch('create', clock.AnalogView);
      };

      return ClockApplication;

    })(soma.Application);
  })(window.clock = window.clock || {});

  new clock.ClockApplication(document.querySelector('.clock-app'));

}).call(this);
