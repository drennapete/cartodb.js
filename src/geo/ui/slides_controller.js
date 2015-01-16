cdb.geo.ui.SlidesControllerItem = cdb.core.View.extend({

  tagName: "li",

  events: {
    "click a": "_onClick",
  },

  template: cdb.core.Template.compile("<a href='#'></a>"),

  initialize: function() {

    this.model = new cdb.core.Model(this.options);
    this.model.bind("change:active", this._onChangeActive, this);

  },

  _onChangeActive: function(e) {

    if (this.model.get("active")) {
      this.$el.find("a").addClass("active");
    } else {
      this.$el.find("a").removeClass("active");
    }

  },

  _onClick: function(e) {
    if (e) this.killEvent(e);
    this.trigger("onClick", this)
  },

  render: function() {

    this.$el.html(this.template());

    this._onChangeActive();

    return this;
  }

});

cdb.geo.ui.SlidesController = cdb.core.View.extend({

  events: {
    'click a.next': "_next",
    'click a.prev': "_prev"
  },

  tagName: "div",

  className: "cartodb-slides-controller",

  template: cdb.core.Template.compile("<div class='slides-controller-content'><a href='#' class='prev'></a><ul></ul><a href='#' class='next'></a></div>"),

  initialize: function() {
    this.slidesCount = this.options.slides_data.length + 1;
  },

  _prev: function(e) {

    if (e) this.killEvent(e);
    
    console.log(this.options.slides.state());

    var currentSlide = this.options.slides.state();

    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = this.options.slides_data.length;
    }

    this.options.slides.go(currentSlide)

  },

  _next: function(e) {
    if (e) this.killEvent(e);

    var currentSlide = this.options.slides.state();
    console.log(this.options.slides.state());

    if (currentSlide <= this.options.slides_data.length - 1) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }

    this.options.slides.go(currentSlide);

  },

  _renderDots: function() {

    var currentActiveSlide = this.options.slides.state();

    for (var i = 0; i < this.options.slides_data.length + 1; i++) {

      var item = new cdb.geo.ui.SlidesControllerItem({ num: i, active: i == currentActiveSlide });
      item.bind("onClick", this._onSlideClick, this);
      this.$el.find("ul").append(item.render().$el);

    }

  },

  _onSlideClick: function(slide) {
    this.options.slides.go(slide.options.num);
  },

  render: function() {

    this.$el.html(this.template());

    if (this.options.slides) {
      this._renderDots();
    }

    return this;
  }

});