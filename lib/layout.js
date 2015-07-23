// source /src/umd.es6
(function(root, factory) {
  var _global = typeof global !== 'undefined' ? global : window,
      _mask = _global.mask || (_global.atma && _global.atma.mask);
  if (_mask == null)
    throw Error('MaskJS was not loaded');
  factory(_global, _mask);
}(this, function(global, mask) {
  'use strict';
  var requestAnimationFrame = (function(window) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(fn) {
      return window.setTimeout(fn, 1000 / 60);
    };
  }(global));
  var css_BORDER_BOX = {
    '-moz-box-sizing': 'border-box',
    'box-sizing': 'border-box'
  };
  var throw_;
  (function() {
    throw_ = function(msg) {
      throw new Error('[Layout Component] ' + msg);
    };
  }());
  var node_div,
      node_addCss,
      node_writeCss;
  (function() {
    node_div = function(children, attr) {
      return {
        tagName: 'div',
        type: mask.Dom.NODE,
        nodes: children,
        attr: attr
      };
    };
    node_addCss = function(node, mix, val) {
      if (mix == null)
        return;
      var style = node.attr.style;
      if (typeof mix === 'string') {
        style = joinCss(style, mix, val);
      } else {
        for (var key in mix) {
          style = joinCss(style, key, mix[key]);
        }
      }
      node.attr.style = style;
    };
    node_writeCss = function(node, style) {
      var current = node.attr.style;
      node.attr.style = (current || '') + ';' + style;
    };
    function joinCss(current, key, val) {
      if (val == null || val === '')
        return current;
      return (current || '') + ';' + key + ':' + val;
    }
  }());
  var dom_addCss,
      dom_writeCss,
      dom_isElement;
  (function() {
    dom_addCss = function(node, mix, val) {
      if (mix == null)
        return;
      if (typeof mix === 'string') {
        addStyle(node, mix, val);
        return;
      }
      for (var key in mix) {
        addStyle(node, key, mix[key]);
      }
    };
    dom_writeCss = function(node, css) {
      var current = node.getAttribute('style');
      node.setAttribute('style', current + ';' + css);
    };
    dom_isElement = function(node) {
      return node != null && node.nodeType === 1;
    };
    function addStyle(node, key, val) {
      if (val == null)
        return;
      node.style.setProperty(key, val);
    }
  }());
  var arr_mapAny,
      arr_each;
  (function() {
    arr_mapAny = function(x, fn) {
      if (x == null || typeof x !== 'object')
        return [];
      if (typeof x.length !== 'number')
        return [fn(x, 0)];
      var imax = x.length,
          i = 0,
          arr = new Array(imax);
      for (; i < imax; i++) {
        arr[i] = fn(x[i], i);
      }
      return arr;
    };
    arr_each = function(arr, fn) {
      var imax = arr.length,
          i = 0;
      for (; i < imax; i++) {
        fn(arr[i], i);
      }
    };
  }());
  var obj_extend;
  (function() {
    obj_extend = function(target) {
      for (var args = [],
          $__0 = 1; $__0 < arguments.length; $__0++)
        args[$__0 - 1] = arguments[$__0];
      if (target == null)
        target = {};
      var imax = args.length,
          i = 0,
          obj;
      for (; i < imax; i++) {
        obj = args[i];
        if (obj == null)
          continue;
        for (var key in obj) {
          target[key] = obj[key];
        }
      }
      return target;
    };
  }());
  var class_create;
  (function() {
    class_create = function() {
      for (var args = [],
          $__0 = 0; $__0 < arguments.length; $__0++)
        args[$__0] = arguments[$__0];
      var Proto = args.pop();
      if (Proto == null) {
        Proto = {};
      }
      var Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null,
          BaseCtor;
      var i = args.length,
          x,
          Parent;
      while (--i > -1) {
        x = args[i];
        if (typeof x === 'function') {
          if (Ctor == null && BaseCtor == null)
            BaseCtor = x;
          x = x.prototype;
        }
        for (var key in x) {
          if (Proto[key] == null) {
            Proto[key] = x[key];
          }
        }
        if (Parent == null) {
          Parent = x;
        }
      }
      Proto.Parent = Parent;
      if (Ctor == null) {
        Ctor = function() {
          for (var args = [],
              $__1 = 0; $__1 < arguments.length; $__1++)
            args[$__1] = arguments[$__1];
          if (BaseCtor)
            return BaseCtor.apply(this, args);
        };
      }
      Ctor.prototype = Proto;
      return Ctor;
    };
  }());
  var layout_hasType,
      layout_wrapBlocks,
      layout_createMeta;
  (function() {
    layout_hasType = function(nodes, stretchCss, type, i, imax) {
      if (arguments.length === 3) {
        i = 0;
        imax = nodes.length;
      }
      for (; i < imax; i++) {
        var actual = Size.parseType(nodes[i].attr[stretchCss]);
        if (actual === type)
          return true;
      }
      return false;
    };
    layout_wrapBlocks = function(nodes, stretchCss, index, imax) {
      if (arguments.length === 2) {
        index = 0;
        imax = nodes.length;
      }
      var i,
          wrapperSize,
          size;
      for (i = index; i < imax; i++) {
        size = new Size(nodes[i].attr[stretchCss]);
        if (wrapperSize == null) {
          wrapperSize = size;
          continue;
        }
        if (wrapperSize.type !== size.type) {
          wrapperSize.type = 'auto';
          break;
        }
        wrapperSize.value += size.value;
      }
      var node = node_div(nodes.slice(index, imax), {});
      node.attr[stretchCss] = String(wrapperSize);
      return node;
    };
    layout_createMeta = function(node, stretchCss, cssObj) {
      var attr = node.attr;
      var size = attr[stretchCss],
          min = attr['min-' + stretchCss],
          max = attr['max-' + stretchCss],
          overflow = attr['overflow'];
      ;
      if (size !== 'flex') {
        node_addCss(node, stretchCss, size);
      }
      node_addCss(node, 'min-' + stretchCss, min);
      node_addCss(node, 'max-' + stretchCss, max);
      node_addCss(node, 'overflow', overflow);
      node_addCss(node, cssObj);
      if (size != null)
        attr[stretchCss] = null;
      if (min != null)
        attr['min-' + stretchCss] = null;
      if (max != null)
        attr['max-' + stretchCss] = null;
      if (overflow != null)
        attr['overflow'] = null;
      if (size == null)
        size = 'flex';
      return {
        size: size,
        min: min,
        max: max,
        overflow: overflow
      };
    };
  }());
  var browser_detect,
      browser_parseUserAgent;
  (function() {
    browser_detect = function(ctx) {
      var ua = ctx && ctx.req && ctx.req.headers ? ctx.req.headers['User-Agent'] : navigator.userAgent;
      return parse(ua);
    };
    browser_parseUserAgent = parse;
    var Matchers = [['bot', 'bot'], ['Opera', 'opera', /Version\/? ?(\d+(\.\d+)*)/], ['MSIE', 'ie', /MSIE (\d+(\.\d+)*)/], ['Android', 'android', /Android ?(\d+(\.\d+)*)/], ['BlackBerry', 'blackberry', /Version\/? ?(\d+(\.\d+)*)/], ['Firefox', 'firefox', /Firefox\/(\d+(\.\d+)*)/], ['Chrome', 'chrome', /Chrome\/(\d+(\.\d+)*)/], ['Safari', 'safari', /Version\/(\d+(\.\d+)*)/], ['rv:', 'ie', /rv:(\d+(\.\d+)*)/]];
    var Default = {
      browser: 'unknown',
      version: 0
    };
    function parse(ua) {
      var $__0;
      if (!ua)
        return Default;
      var imax = Matchers.length,
          i = 0,
          str,
          browser,
          version,
          rgx_version;
      for (; i < imax; i++) {
        ($__0 = Matchers[i], str = $__0[0], browser = $__0[1], rgx_version = $__0[2], $__0);
        if (ua.indexOf(str) === -1)
          continue;
        if (rgx_version == null)
          return {browser: browser};
        var match = rgx_version.exec(ua);
        if (match && match.length > 1)
          version = parseFloat(match[1]);
        return {
          browser: browser,
          version: version || 0
        };
      }
      return Default;
    }
  }());
  var flex_supports,
      flex_css_CONTAINER,
      flex_css_BLOCK,
      flex_css_STRETCH;
  (function() {
    flex_supports = function(ctx) {
      var agent = browser_detect(ctx),
          value = Caniuse[agent.browser];
      if (value === true)
        return true;
      return value <= agent.version;
    };
    flex_css_CONTAINER = function() {
      var direction = arguments[0] !== (void 0) ? arguments[0] : 'row';
      return ("display: -webkit-flex; display: flex; -webkit-flex-direction: " + direction + "; flex-direction: " + direction);
    };
    flex_css_BLOCK = function() {
      var count = arguments[0] !== (void 0) ? arguments[0] : 1;
      return ("-webkit-flex: " + count + "; flex: " + count);
    };
    flex_css_STRETCH = function(stretchCss, overflow) {
      var key = stretchCss;
      var obj = {};
      if (overflow === 'visible') {
        key = 'min-' + key;
      }
      obj[key] = '100%';
      return obj;
    };
    var Caniuse = {
      'bot': true,
      'ie': 11,
      'firefox': 28,
      'chrome': 21,
      'safari': 7,
      'opera': 12.1,
      'blackberry': 10,
      'android': 4.4
    };
  }());
  var ResizeListener;
  (function() {
    var layouts_ = [];
    ResizeListener = {
      register: function(layout) {
        if (layout == null)
          return;
        layouts_.unshift(layout);
        startResizeListener();
      },
      unregister: function(layout) {
        if (layout == null)
          return;
        var i = listeners_.indexOf(layout);
        if (i !== -1) {
          layouts_.splice(i, 1);
        }
      }
    };
    function reflow() {
      var imax = layouts_.length,
          i;
      for (i = 0; i < imax; i++) {
        layouts_[i].checkReflowRequired();
      }
      for (i = 0; i < imax; i++) {
        layouts_[i].reflow();
      }
    }
    var startResizeListener;
    (function() {
      startResizeListener = function() {
        startResizeListener = function() {};
        window.addEventListener('resize', onresize, false);
      };
      var debounced = false;
      function onresize() {
        if (debounced)
          return;
        debounced = true;
        requestAnimationFrame((function() {
          debounced = false;
          reflow();
        }));
      }
    }());
  }());
  (function() {
    mask.registerHandler('l:center', {renderStart: function() {
        this.nodes = createNode('display: table; height: 100%; width: 100%; overflow: auto', createNode('display: table-cell; vertical-align: middle', createNode('margin: 0 auto', this.nodes, this.attr)));
      }});
    function createNode(style, nodes, attr) {
      if (attr == null)
        return node_div(nodes, {style: style});
      attr.style = attr.style ? attr.style + ';' + style : style;
      ;
      return node_div(nodes, attr);
    }
  }());
  var Size;
  (function() {
    Size = function(val) {
      this.type = Size.parseType(val);
      if ('px' === this.type || '%' === this.type)
        this.value = parseFloat(val);
    };
    Size.prototype = {
      type: 'flex|auto|px|%',
      value: null,
      toString: function() {
        switch (this.type) {
          case 'px':
          case '%':
            return this.value + this.type;
          case 'auto':
            return 'auto';
          default:
            return null;
        }
      }
    };
    Size.parseType = function(val) {
      if (val == null || val === 'flex')
        return 'flex';
      if (val === 'auto')
        return val;
      if (val.indexOf('px') !== -1)
        return 'px';
      if (val.indexOf('%') !== -1)
        return '%';
      throw_(("Invalid size value " + val));
    };
  }());
  var Block,
      BlockAbsolute,
      BlockFluid;
  (function() {
    Block = function(element, opts) {
      this.size = new Size(opts.size);
      this.overflow = opts.overflow;
      this.element = element;
    };
    Block.prototype = {
      element: null,
      name: 'Width|Height',
      css: 'width|height',
      overflow: 'auto|scroll|visible',
      size: null,
      offsetBefore: null,
      offsetAfter: null,
      isFlex: function() {
        return this.size.type === 'flex';
      },
      ensureStrict: function(owner, index, parentSize, offsetBefore) {
        this.offsetBefore = offsetBefore;
        var val = this.size.value;
        switch (this.size.type) {
          case 'px':
            return val;
          case '%':
            return parentSize * val / 100;
          case 'auto':
            if (val == null)
              val = this.size.value = this.offsetSize();
            return val;
        }
        throw Error('Unsupported type: ' + this.size.type);
      },
      ensureFlex: function(size, owner, index, parentSize, offsetBefore) {
        this.offsetBefore = offsetBefore;
        if (this.overflow !== 'visible') {
          this.size.value = size;
          this.element.style[this.css] = size + 'px';
          return 0;
        }
        this.size.value = size;
        this.element.style['min-height'] = size + 'px';
        var diff = this.offsetSize() - size;
        return diff < 0 ? 0 : diff;
      },
      dispose: function() {
        this.element = null;
      },
      offsetSize: function() {
        return this.element['offset' + this.name];
      },
      scrollSize: function() {
        return this.element['scroll' + this.name];
      },
      setCss: function(mix, val) {
        dom_addCss(this.element, mix, val);
        return this;
      }
    };
    BlockAbsolute = {
      ensureStrict: function(owner, index, parentSize, offsetBefore, anchor) {
        var position = anchor === 'before' ? this.cssBefore : this.cssAfter;
        ;
        if (offsetBefore !== this.offsetBefore)
          this.element.style[position] = offsetBefore + 'px';
        return Block.prototype.ensureStrict.call(this, owner, index, parentSize, offsetBefore);
      },
      ensureFlex: function(size, owner, index, parentSize, offsetBefore, offsetAfter) {
        var style = this.element.style;
        if (offsetBefore !== this.offsetBefore) {
          style[this.cssBefore] = (this.offsetBefore = offsetBefore) + 'px';
        }
        if (offsetAfter !== this.offsetAfter) {
          style[this.cssAfter] = (this.offsetAfter = offsetAfter) + 'px';
        }
        return offsetAfter - offsetBefore;
      }
    };
    BlockFluid = {
      ensureStrict: function(owner, index, parentSize, offsetBefore, anchor) {
        if ('after' === anchor) {
          var offset = this.element['offset' + this.name];
          dom_addCss(this.element, ("margin-" + this.cssBefore), ("-" + offset + "px"));
        }
        return Block.prototype.ensureStrict.call(this, owner, index, parentSize, offsetBefore);
      },
      ensureFlex: function(size, owner, index, parentSize, offsetBefore, offsetAfter) {
        if (this.offsetBefore !== offsetBefore) {
          if (this.offsetBefore != null || offsetBefore !== 0) {
            this.setCss(("margin-" + this.cssBefore), ("-" + offsetBefore + "px")).setCss(("padding-" + this.cssBefore), (offsetBefore + "px"));
          }
          this.offsetBefore = offsetBefore;
        }
        if (this.offsetAfter !== offsetAfter) {
          if (this.offsetAfter != null || offsetAfter !== 0) {
            this.setCss(("padding-" + this.cssAfter), (offsetAfter + "px"));
          }
          this.offsetAfter = offsetAfter;
        }
        return offsetAfter - offsetBefore;
      }
    };
  }());
  var MaskLayout,
      MaskLayoutAbsolute,
      MaskLayoutFluid;
  ;
  (function() {
    MaskLayout = class_create({
      constructor: function(nodes, metas, attr) {
        this.nodes = nodes;
        this.metas = metas;
      },
      beforeCount: 0,
      afterCount: 0,
      performLayout: function() {
        var imax = this.metas.length,
            layout = {
              before: {
                value: 0,
                unit: 'px'
              },
              after: {
                value: 0,
                unit: 'px'
              }
            },
            size,
            flexIndex = null,
            current = 'before';
        for (var i = 0; i < imax; i++) {
          size = new Size(this.metas[i].size);
          if (size.type === 'flex') {
            flexIndex = i;
            current = 'after';
            continue;
          }
          this[current + 'Count'] += 1;
          var data = layout[current];
          this.setStrict(this.nodes[i], this.metas[i], data.value + data.unit, current);
          data.unit = size.type;
          data.value += size.value;
        }
        this.setFlex(this.nodes[flexIndex], this.metas[flexIndex], layout.before.value + layout.before.unit, layout.after.value + layout.after.unit);
      },
      requiresDomController: function() {
        var imax = this.metas.length,
            i = 0;
        var position = 'before',
            units = null,
            x,
            type;
        for (; i < imax; i++) {
          type = Size.parseType(this.metas[i].size);
          if ('flex' === type) {
            if (position === 'after') {
              return true;
            }
            position = 'after';
            units = null;
            continue;
          }
          if ('auto' === type)
            return true;
          if (units == null) {
            units = type;
            continue;
          }
          if (units !== type)
            return true;
        }
        return false;
      },
      nodes: null,
      metas: null
    });
    MaskLayout.prepairBlockMetas = function(nodes, type, cssObj) {
      return arr_mapAny(nodes, (function(node) {
        return layout_createMeta(node, type, cssObj);
      }));
    };
    MaskLayoutAbsolute = class_create(MaskLayout, {
      cssBefore: null,
      cssAfter: null,
      setStrict: function(node, meta, offset, position) {
        var css = position === 'before' ? this.cssBefore : this.cssAfter;
        ;
        node_addCss(node, css, offset);
      },
      setFlex: function(node, meta, offsetBefore, offsetAfter) {
        var css = {};
        css[this.cssBefore] = offsetBefore;
        css[this.cssAfter] = offsetAfter;
        node_addCss(node, css);
      }
    });
    MaskLayoutFluid = class_create(MaskLayout, {
      cssMargin: 'margin-top|margin-left',
      setStrict: function(node, meta, offset, position) {
        if (position === 'after') {
          node_addCss(node, this.css, meta.size);
          node_addCss(node, this.cssMargin, '-' + meta.size);
        }
      },
      setFlex: function(node, meta, offsetBefore, offsetAfter) {
        var css = {};
        if (this.beforeCount !== 0) {
          css['margin-' + this.cssBefore] = '-' + offsetBefore;
          css['padding-' + this.cssBefore] = offsetBefore;
        }
        if (this.afterCount !== 0) {
          css['padding-' + this.cssAfter] = offsetAfter;
        }
        node_addCss(node, css);
      }
    });
  }());
  var NodeTransform;
  (function() {
    NodeTransform = {
      wrapFlexBlocks: function(nodes, stretchCss, offsetCss, childCssObj, wrapCssObj) {
        var length = nodes.length,
            i,
            min,
            max;
        for (i = 0; i < length; i++) {
          if (isFlexNode(nodes[i], stretchCss))
            break;
        }
        min = i;
        for (i = length - 1; i > min; i--) {
          if (isFlexNode(nodes[i], stretchCss))
            break;
        }
        max = ++i;
        var node = null;
        var count = max - min;
        if (count < 2) {
          return returnSingleOrNone(nodes, stretchCss, min, max, wrapCssObj);
        }
        node = node_div(nodes.splice(min, count), {});
        this.shareSpace(node.nodes, stretchCss, offsetCss, childCssObj);
        node_addCss(node, wrapCssObj);
        nodes.splice(min, 0, node);
        return node;
      },
      wrapBefore: function(nodes, stretchCss, css) {
        var imax = nodes.length,
            i;
        for (i = 0; i < imax; i++) {
          if (isFlexNode(nodes[i], stretchCss))
            break;
        }
        if (i < 2) {
          return returnSingleOrNone(nodes, stretchCss, 0, i, css);
        }
        imax = i;
        return wrapNodes(nodes, stretchCss, 0, imax, css);
      },
      wrapAfter: function(nodes, stretchCss, css) {
        var imax = nodes.length,
            i;
        for (i = imax - 1; i > -1; i--) {
          if (isFlexNode(nodes[i], stretchCss))
            break;
        }
        if (i >= imax - 2) {
          return returnSingleOrNone(nodes, stretchCss, i + 1, imax, css);
        }
        return wrapNodes(nodes, stretchCss, i + 1, imax, css);
      },
      shareSpace: function(nodes, stretchCss, offsetCss, childCssObj) {
        var offset = 0;
        var size = 100 / nodes.length;
        arr_each(nodes, (function(node) {
          var css = stretchCss;
          if (node.attr.overflow === 'visible') {
            css = 'min-' + css;
          } else {
            node_writeCss(node, 'overflow: auto');
          }
          node_addCss(node, css, size + '%');
          node_addCss(node, offsetCss, offset + '%');
          node_addCss(node, childCssObj);
          offset += size;
        }));
      }
    };
    function isFlexNode(node, stretchCss) {
      var attr = node.attr[stretchCss];
      return attr == null || attr === 'flex';
    }
    function wrapNodes(nodes, stretchCss, iStart, iEnd, cssObj) {
      var node = layout_wrapBlocks(nodes, stretchCss, iStart, iEnd);
      arr_each(node.nodes, (function(node) {
        return layout_createMeta(node, stretchCss);
      }));
      node_addCss(node, cssObj);
      nodes.splice(iStart, iEnd - iStart, node);
      return node;
    }
    function returnSingleOrNone(nodes, stretchCss, iStart, iEnd, cssObj) {
      var count = iEnd - iStart;
      if (count === 0)
        return null;
      var node = nodes[iStart];
      node_addCss(node, cssObj);
      return node;
    }
  }());
  var LayoutCompo = {
    tagName: 'div',
    type: 'width|height',
    layout: null,
    resizerType: 'dynamic',
    attr: {overflow: 'auto'},
    slots: {
      domInsert: function() {
        if (this.layout == null)
          return;
        this.layout.ensureElement();
        this.layout.checkReflowRequired();
        this.layout.reflow();
      },
      layout_Recalculate: function() {
        return this.layout.checkReflowRequired();
      },
      layout_Reflow: function() {
        this.layout.reflow();
      }
    },
    renderStart: function() {
      this.handleAttr_();
      this.handleExpression_();
      var blocks = this.prepairBlocks_();
      if (blocks == null) {
        this.slots = null;
      } else {
        this.scope = {$blocks: blocks};
      }
    },
    renderEnd: function(els, model, ctx, el) {
      var blocks = this.scope && this.scope.$blocks;
      if (blocks == null)
        return;
      var $__0 = this.resolveElements(els, model, ctx, el),
          container = $__0[0],
          elements = $__0[1];
      this.layout = new this.LayoutController(container, elements, blocks, this.attr);
      if (this.resizerType === 'dynamic')
        ResizeListener.register(this.layout);
    },
    resolveElements: function(els) {
      var container = els[0],
          elements = Array.prototype.slice.call(container.childNodes);
      return [container, elements];
    },
    dispose: function() {
      if (this.layout == null)
        return;
      this.layout.dispose();
      ResizeListener.unregister(this.layout);
    },
    handleExpression_: function() {
      if (this.expression == null)
        return;
      var $__0 = this,
          nodes = $__0.nodes,
          type = $__0.type,
          expression = $__0.expression;
      var sizes = expression.split(expression.indexOf(',') === -1 ? ' ' : ',');
      if (sizes.length !== nodes.length) {
        throw Error(("Expression for " + sizes.length + ", but expected for " + nodes.length + " elements. " + expression));
      }
      arr_each(nodes, (function(node, i) {
        return node.attr[type] = sizes[i].trim();
      }));
    },
    handleAttr_: function() {
      var width = 'width: 100%',
          height = 'height: 100%';
      if (this.attr.overflow === 'visible') {
        width = 'min-' + width;
        height = 'min-' + height;
      }
      node_writeCss(this, width + ';' + height);
    }
  };
  var LayoutCompoFluid = {
    attr: {'overflow': 'visible'},
    handleAttr_: function() {
      this.tagName = null;
    },
    resolveElements: function(els, model, ctx, container) {
      return [container, els];
    },
    resizerType: 'dynamic'
  };
  var LayoutController;
  (function() {
    LayoutController = class_create({
      constructor: function(container, elements, metas, attr) {
        var $__0 = this;
        this.overflow = attr.overflow || 'auto';
        this.element = container;
        this.blocks = new Array(metas.length);
        if (metas.length !== elements.length)
          throw Error('Element-Meta mismatch');
        if (container.nodeType === global.Node.DOCUMENT_FRAGMENT_NODE) {
          this.element = null;
        }
        metas.forEach((function(x, i) {
          var el = elements[i],
              meta = metas[i],
              block = new $__0.Block(el, meta);
          var type = block.size.type;
          if (type === 'flex') {
            $__0.flexCount++;
          }
          if (type === 'auto') {
            $__0.autoCount++;
          }
          $__0.blocks[i] = block;
        }));
      },
      name: 'Width|Height',
      css: 'width|height',
      element: null,
      size: 0,
      sizeGetter: 'offsetSize',
      flexCount: 0,
      autoCount: 0,
      reflowRequired: true,
      Block: null,
      checkReflowRequired: function() {
        var size = this[this.sizeGetter]();
        if (this.autoCount === 0 && size === this.size) {
          return false;
        }
        this.size = size;
        this.reflowRequired = true;
        return true;
      },
      ensureElement: function() {
        if (this.element == null) {
          this.element = this.blocks[0].element.parentNode;
        }
      },
      reflow: function() {
        if (this.reflowRequired !== true)
          return;
        var size = this.processReflow_();
        this.reflowRequired = false;
        if (this.overflow === 'visible' && this.size < size) {
          this.size = Math.ceil(size);
          this.element.style[this.css] = this.size + 'px';
        }
      },
      processReflow_: function() {
        var size = this.size,
            strictSize = 0,
            flexSize = 0,
            flexCount = this.flexCount,
            flexSingleSize = 0;
        ;
        var imax = this.blocks.length,
            imin,
            i,
            x,
            offset,
            offsetStrictTop,
            offsetStrictBottom,
            blockSize;
        for (i = 0, offset = 0; i < imax; i++) {
          x = this.blocks[i];
          if (x.isFlex() === true)
            break;
          blockSize = x.ensureStrict(this, i, size, offset, 'before');
          strictSize += blockSize;
          offset += blockSize;
        }
        imin = i;
        offsetStrictTop = offset;
        for (i = imax - 1, offset = 0; i > imin; i--) {
          x = this.blocks[i];
          if (x.isFlex() === true)
            break;
          blockSize = x.ensureStrict(this, i, size, offset, 'after');
          strictSize += blockSize;
          offset += blockSize;
        }
        imax = ++i;
        offsetStrictBottom = offset;
        flexSingleSize = Math.round((size - strictSize) / flexCount);
        for (i = imin, offset = offsetStrictTop; i < imax; i++) {
          x = this.blocks[i];
          if (x.isFlex() === false) {
            console.error('<strict block size in the middle>');
            continue;
          }
          var overflowed = x.ensureFlex(flexSingleSize, this, i, size, offsetStrictTop, offsetStrictBottom);
          blockSize = flexSingleSize + overflowed;
          flexSize += blockSize;
          offset += blockSize;
        }
        return flexSize + strictSize;
      },
      offsetSize: function() {
        return this.element['offset' + this.name];
      },
      scrollSize: function() {
        return this.element['scroll' + this.name];
      },
      dispose: function() {
        this.element = null;
        this.blocks.forEach((function(x) {
          return x.dispose();
        }));
      }
    });
  }());
  var ColBlock,
      ColBlockAbsolute,
      ColBlockFluid;
  (function() {
    ColBlock = class_create(Block, {
      name: 'Width',
      css: 'width',
      cssBefore: 'left',
      cssAfter: 'right'
    });
    ColBlockAbsolute = class_create(ColBlock, BlockAbsolute, null);
    ColBlockFluid = class_create(ColBlock, BlockFluid, null);
  }());
  var LayoutCols;
  (function() {
    LayoutCols = class_create(LayoutController, {
      name: 'Width',
      css: 'width',
      Block: ColBlock
    });
  }());
  var LayoutColsAbsolute;
  (function() {
    LayoutColsAbsolute = class_create(LayoutController, {
      name: 'Width',
      css: 'width',
      Block: ColBlockAbsolute
    });
  }());
  var LayoutColsFluid;
  (function() {
    LayoutColsFluid = class_create(LayoutController, {
      name: 'Width',
      css: 'width',
      Block: ColBlockFluid
    });
  }());
  var MaskLayoutCols,
      MaskLayoutColsAbsolute,
      MaskLayoutColsFluid;
  (function() {
    MaskLayoutCols = class_create(MaskLayout, {
      name: 'Width',
      css: 'width',
      cssBefore: 'left',
      cssAfter: 'right'
    });
    MaskLayoutColsAbsolute = class_create(MaskLayoutCols, MaskLayoutAbsolute, null);
    MaskLayoutColsFluid = class_create(MaskLayoutCols, MaskLayoutFluid, {cssMargin: 'margin-left'});
  }());
  mask.registerHandler('l:rows', Compo({
    tagName: 'div',
    attr: {'class': '-l-rows'},
    slots: {
      resize: 'reflow_',
      domInsert: 'reflow_'
    },
    flexContainer_: null,
    constructor: function() {
      this.reflow_ = this.reflow_.bind(this);
    },
    renderStart: function() {
      var rows = FlexContainerCols.prepairMask(this.nodes);
      this.scope = {$rows: rows};
    },
    renderEnd: function(els) {
      var container = els[0],
          elements = Array.prototype.slice.call(container.childNodes);
      this.flexContainer_ = new FlexContainerRows(container, elements, this.scope.$rows, this.attr);
      ResizeListener.bind(this.reflow_);
    },
    reflow_: function() {
      this.flexContainer_.reflow();
    },
    dispose: function() {
      this.flexContainer_.dispose();
      ResizeListener.unbind(this.reflow_);
    }
  }));
  mask.registerHandler('l:cols:absolute', Compo(LayoutCompo, {
    attr: {
      'class': '-l-rows __absolute',
      'style': 'position: relative; width: 100%; height: 100%;'
    },
    resizerType: 'once',
    type: 'width',
    prepairBlocks_: function() {
      NodeTransform.wrapFlexBlocks(this.nodes, 'width', 'left', {
        bottom: '0px',
        top: '0px',
        position: 'absolute'
      });
      var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'width', {
        position: 'absolute',
        top: '0px',
        height: '100%'
      });
      var layout = new MaskLayoutColsAbsolute(this.nodes, blocks, this.attr, this.expression);
      if (layout.requiresDomController() === true) {
        return blocks;
      }
      layout.performLayout();
      return null;
    },
    LayoutController: LayoutColsAbsolute
  }));
  var LColsFluid = Compo(LayoutCompo, LayoutCompoFluid, {
    compoName: 'l:cols:fluid',
    attr: {
      'class': '-l-cols __fluid',
      'style': 'position: relative; width: 100%; min-height: 100%; vertical-align: top'
    },
    type: 'width',
    prepairBlocks_: function() {
      NodeTransform.wrapBefore(this.nodes, 'width', {
        'position': 'relative',
        'height': '100%',
        'display': 'inline-block',
        'vertical-align': 'top'
      });
      NodeTransform.wrapAfter(this.nodes, 'width', {
        'display': 'inline-block',
        'height': '100%',
        'vertical-align': 'top'
      });
      NodeTransform.wrapFlexBlocks(this.nodes, 'width', null, null, {
        'height': '100%',
        'min-width': '100%',
        'box-sizing': 'border-box',
        '-moz-box-sizing': 'border-box',
        'display': 'inline-block',
        'vertical-align': 'top'
      });
      var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'width');
      var layout = new MaskLayoutColsFluid(this.nodes, blocks, this.attr, this.expression);
      if (layout.requiresDomController() === true) {
        return blocks;
      }
      layout.performLayout();
      return null;
    },
    LayoutController: LayoutColsFluid
  });
  mask.registerHandler('l:cols:fluid', LColsFluid);
  mask.registerHandler('l:cols:flex', Compo(LayoutCompo, {
    compoName: 'l:cols:flex',
    attr: {
      'class': '-l-cols __flex',
      'style': 'position: relative;' + flex_css_CONTAINER('row'),
      'overflow': 'scroll'
    },
    resizerType: 'none',
    type: 'width',
    constructor: function(node, model, ctx, container) {
      if (flex_supports(ctx) === false)
        return new LColsFluid();
      if (dom_isElement(container)) {
        dom_writeCss(container, flex_css_CONTAINER('row'));
        this.tagName = null;
      }
    },
    prepairBlocks_: function() {
      arr_each(this.nodes, (function(node) {
        var meta = layout_createMeta(node, 'width');
        if (meta.size === 'flex') {
          node_writeCss(node, flex_css_BLOCK());
        }
      }));
      return null;
    }
  }));
  var RowBlock,
      RowBlockAbsolute,
      RowBlockFluid;
  (function() {
    RowBlock = class_create(Block, {
      name: 'Height',
      css: 'height',
      cssBefore: 'top',
      cssAfter: 'bottom'
    });
    RowBlockAbsolute = class_create(RowBlock, BlockAbsolute, null);
    RowBlockFluid = class_create(RowBlock, BlockFluid, null);
  }());
  var LayoutRows;
  (function() {
    LayoutRows = class_create(LayoutController, {
      name: 'Height',
      css: 'height',
      Block: RowBlock
    });
  }());
  var LayoutRowsAbsolute;
  (function() {
    LayoutRowsAbsolute = class_create(LayoutController, {
      name: 'Height',
      css: 'height',
      Block: RowBlockAbsolute
    });
  }());
  var LayoutRowsFluid;
  (function() {
    LayoutRowsFluid = class_create(LayoutController, {
      name: 'Height',
      css: 'height',
      Block: RowBlockFluid
    });
  }());
  var MaskLayoutRows,
      MaskLayoutRowsAbsolute,
      MaskLayoutRowsFluid;
  (function() {
    MaskLayoutRows = class_create(MaskLayout, {
      name: 'Height',
      css: 'height',
      cssBefore: 'top',
      cssAfter: 'bottom'
    });
    MaskLayoutRowsAbsolute = class_create(MaskLayoutRows, MaskLayoutAbsolute, null);
    MaskLayoutRowsFluid = class_create(MaskLayoutRows, MaskLayoutFluid, {cssMargin: 'margin-top'});
  }());
  mask.registerHandler('l:rows', Compo({
    tagName: 'div',
    attr: {'class': '-l-rows'},
    slots: {
      resize: 'reflow_',
      domInsert: 'reflow_'
    },
    flexContainer_: null,
    constructor: function() {
      this.reflow_ = this.reflow_.bind(this);
    },
    renderStart: function() {
      var rows = FlexContainerRows.prepairMask(this.nodes);
      this.scope = {$rows: rows};
    },
    renderEnd: function(els) {
      var container = els[0],
          elements = Array.prototype.slice.call(container.childNodes);
      this.flexContainer_ = new FlexContainerRows(container, elements, this.scope.$rows, this.attr);
      ResizeListener.bind(this.reflow_);
    },
    reflow_: function() {
      this.flexContainer_.reflow();
    },
    dispose: function() {
      this.flexContainer_.dispose();
      ResizeListener.unbind(this.reflow_);
    }
  }));
  mask.registerHandler('l:rows:absolute', Compo(LayoutCompo, {
    compoName: 'l:rows:absolute',
    attr: {
      'class': '-l-rows __absolute',
      'style': 'position: relative; width: 100%;'
    },
    resizerType: 'once',
    type: 'height',
    prepairBlocks_: function() {
      NodeTransform.wrapFlexBlocks(this.nodes, 'height', 'top', {
        left: '0px',
        right: '0px',
        position: 'absolute'
      });
      var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'height', {
        position: 'absolute',
        left: '0px',
        width: '100%'
      });
      var layout = new MaskLayoutRowsAbsolute(this.nodes, blocks, this.attr, this.expression);
      if (layout.requiresDomController() === true) {
        return blocks;
      }
      layout.performLayout();
      return null;
    },
    LayoutController: LayoutRowsAbsolute
  }));
  var LRowsFluid = Compo(LayoutCompo, LayoutCompoFluid, {
    compoName: 'l:rows:fluid',
    attr: {'class': '-l-rows __fluid'},
    type: 'height',
    prepairBlocks_: function() {
      var before = NodeTransform.wrapBefore(this.nodes, 'height', {position: 'relative'});
      var after = NodeTransform.wrapAfter(this.nodes, 'height');
      if (before != null || after != null) {
        NodeTransform.wrapFlexBlocks(this.nodes, 'height', null, null, obj_extend(this.attr.overflow === 'visible' ? {'min-height': '100%'} : {'height': '100%'}, css_BORDER_BOX));
      } else {
        NodeTransform.shareSpace(this.nodes, 'height');
      }
      var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'height');
      var layout = new MaskLayoutRowsFluid(this.nodes, blocks, this.attr, this.expression);
      if (layout.requiresDomController() === true) {
        return blocks;
      }
      layout.performLayout();
      return null;
    },
    LayoutController: LayoutRowsFluid
  });
  mask.registerHandler('l:rows:fluid', LRowsFluid);
  mask.registerHandler('l:rows:flex', Compo(LayoutCompo, {
    compoName: 'l:rows:flex',
    attr: {
      'class': '-l-rows __flex',
      'style': 'position: relative;' + flex_css_CONTAINER('column'),
      'overflow': 'scroll'
    },
    resizerType: 'none',
    type: 'height',
    constructor: function(node, model, ctx, container) {
      if (flex_supports(ctx) === false)
        return new LRowsFluid();
      if (dom_isElement(container)) {
        dom_writeCss(container, flex_css_CONTAINER('column'));
        this.tagName = null;
      }
    },
    prepairBlocks_: function() {
      arr_each(this.nodes, (function(node) {
        var meta = layout_createMeta(node, 'height');
        if (meta.size === 'flex') {
          node_writeCss(node, flex_css_BLOCK());
        }
      }));
      return null;
    }
  }));
}));

// end:source /src/umd.es6