DS.Stub = Ember.Object.extend({
  init: function() {
    this.spyMeta = {};
  },

  spyOn: function(methodName) {
    var func = this[methodName],
        meta = this.spyMeta;

    if (func && func.isSpy) { return; }

    if (!func) {
      func = function() { };
    }

    this[methodName] = function() {
      var callCount = meta[methodName] || 0;

      meta[methodName] = ++callCount;

      return func.apply(this, arguments);
    };

    this[methodName].isSpy = true;
  },

  shouldHaveBeenCalled: function(methodName, times) {
    times = times === undefined ? 1 : times;

    equal(this.spyMeta[methodName], times, methodName+" was called "+times+ " times");
  }
});

DS.StubModel = DS.Stub.extend({
  init: function() {
    this.resetEvents();

    return this._super();
  },

  send: function(event) {
    this.receivedEvents.push(event);
  },

  resetEvents: function() {
    this.receivedEvents = [];
  },

  didReceiveEvent: function(event) {
    return -1 !== this.receivedEvents.indexOf(event);
  },

  shouldHaveReceived: function() {
    var events = Array.prototype.slice.call(arguments);

    Ember.ArrayPolyfills.forEach.call(events, function(event) {
      ok(this.didReceiveEvent(event), "record received event "+event);
    }, this);
  },

  shouldNotHaveReceived: function() {
    var events = Array.prototype.slice.call(arguments);

    Ember.ArrayPolyfills.forEach.call(events, function(event) {
      ok(!this.didReceiveEvent(event), "record did not received event "+event);
    }, this);
  },

  becomeDirty: function(type) {
    this.get('transaction').recordBecameDirty(type, this);
  },

  setupData: Ember.K
});

DS.StubModel.reopenClass({
  _create: function() {
    return this.create.apply(this, arguments);
  }
});

