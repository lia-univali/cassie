(function () {
  /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
  var k,
    aa = function (a) {
      var b = 0;
      return function () {
        return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
      };
    },
    ba =
      "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, b, c) {
            if (a == Array.prototype || a == Object.prototype) return a;
            a[b] = c.value;
            return a;
          },
    da = function (a) {
      a = [
        "object" == typeof globalThis && globalThis,
        a,
        "object" == typeof window && window,
        "object" == typeof self && self,
        "object" == typeof global && global,
      ];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c;
      }
      throw Error("Cannot find global object");
    },
    l = da(this),
    ea = function (a, b) {
      if (b)
        a: {
          var c = l;
          a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
            var e = a[d];
            if (!(e in c)) break a;
            c = c[e];
          }
          a = a[a.length - 1];
          d = c[a];
          b = b(d);
          b != d &&
            null != b &&
            ba(c, a, { configurable: !0, writable: !0, value: b });
        }
    };
  ea("Symbol", function (a) {
    if (a) return a;
    var b = function (e, f) {
      this.ti = e;
      ba(this, "description", { configurable: !0, writable: !0, value: f });
    };
    b.prototype.toString = function () {
      return this.ti;
    };
    var c = 0,
      d = function (e) {
        if (this instanceof d)
          throw new TypeError("Symbol is not a constructor");
        return new b("jscomp_symbol_" + (e || "") + "_" + c++, e);
      };
    return d;
  });
  ea("Symbol.iterator", function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
          " "
        ),
        c = 0;
      c < b.length;
      c++
    ) {
      var d = l[b[c]];
      "function" === typeof d &&
        "function" != typeof d.prototype[a] &&
        ba(d.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return fa(aa(this));
          },
        });
    }
    return a;
  });
  var fa = function (a) {
      a = { next: a };
      a[Symbol.iterator] = function () {
        return this;
      };
      return a;
    },
    m = function (a) {
      var b =
        "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      return b ? b.call(a) : { next: aa(a) };
    },
    ha = function (a) {
      if (!(a instanceof Array)) {
        a = m(a);
        for (var b, c = []; !(b = a.next()).done; ) c.push(b.value);
        a = c;
      }
      return a;
    },
    ia =
      "function" == typeof Object.create
        ? Object.create
        : function (a) {
            var b = function () {};
            b.prototype = a;
            return new b();
          },
    ja;
  if ("function" == typeof Object.setPrototypeOf) ja = Object.setPrototypeOf;
  else {
    var ka;
    a: {
      var la = { Gj: !0 },
        ma = {};
      try {
        ma.__proto__ = la;
        ka = ma.Gj;
        break a;
      } catch (a) {}
      ka = !1;
    }
    ja = ka
      ? function (a, b) {
          a.__proto__ = b;
          if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
          return a;
        }
      : null;
  }
  var na = ja,
    q = function (a, b) {
      a.prototype = ia(b.prototype);
      a.prototype.constructor = a;
      if (na) na(a, b);
      else
        for (var c in b)
          if ("prototype" != c)
            if (Object.defineProperties) {
              var d = Object.getOwnPropertyDescriptor(b, c);
              d && Object.defineProperty(a, c, d);
            } else a[c] = b[c];
      a.I = b.prototype;
    };
  ea("Array.prototype.find", function (a) {
    return a
      ? a
      : function (b, c) {
          a: {
            var d = this;
            d instanceof String && (d = String(d));
            for (var e = d.length, f = 0; f < e; f++) {
              var g = d[f];
              if (b.call(c, g, f, d)) {
                b = g;
                break a;
              }
            }
            b = void 0;
          }
          return b;
        };
  });
  var oa = function (a, b, c) {
    if (null == a)
      throw new TypeError(
        "The 'this' value for String.prototype." +
          c +
          " must not be null or undefined"
      );
    if (b instanceof RegExp)
      throw new TypeError(
        "First argument to String.prototype." +
          c +
          " must not be a regular expression"
      );
    return a + "";
  };
  ea("String.prototype.endsWith", function (a) {
    return a
      ? a
      : function (b, c) {
          var d = oa(this, b, "endsWith");
          b += "";
          void 0 === c && (c = d.length);
          c = Math.max(0, Math.min(c | 0, d.length));
          for (var e = b.length; 0 < e && 0 < c; )
            if (d[--c] != b[--e]) return !1;
          return 0 >= e;
        };
  });
  ea("String.prototype.startsWith", function (a) {
    return a
      ? a
      : function (b, c) {
          var d = oa(this, b, "startsWith");
          b += "";
          var e = d.length,
            f = b.length;
          c = Math.max(0, Math.min(c | 0, d.length));
          for (var g = 0; g < f && c < e; ) if (d[c++] != b[g++]) return !1;
          return g >= f;
        };
  });
  ea("String.prototype.repeat", function (a) {
    return a
      ? a
      : function (b) {
          var c = oa(this, null, "repeat");
          if (0 > b || 1342177279 < b)
            throw new RangeError("Invalid count value");
          b |= 0;
          for (var d = ""; b; ) if ((b & 1 && (d += c), (b >>>= 1))) c += c;
          return d;
        };
  });
  var pa = function (a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
    },
    qa =
      "function" == typeof Object.assign
        ? Object.assign
        : function (a, b) {
            for (var c = 1; c < arguments.length; c++) {
              var d = arguments[c];
              if (d) for (var e in d) pa(d, e) && (a[e] = d[e]);
            }
            return a;
          };
  ea("Object.assign", function (a) {
    return a || qa;
  });
  ea("Promise", function (a) {
    function b() {
      this.rb = null;
    }
    function c(g) {
      return g instanceof e
        ? g
        : new e(function (h) {
            h(g);
          });
    }
    if (a) return a;
    b.prototype.og = function (g) {
      if (null == this.rb) {
        this.rb = [];
        var h = this;
        this.pg(function () {
          h.Rj();
        });
      }
      this.rb.push(g);
    };
    var d = l.setTimeout;
    b.prototype.pg = function (g) {
      d(g, 0);
    };
    b.prototype.Rj = function () {
      for (; this.rb && this.rb.length; ) {
        var g = this.rb;
        this.rb = [];
        for (var h = 0; h < g.length; ++h) {
          var n = g[h];
          g[h] = null;
          try {
            n();
          } catch (p) {
            this.Jj(p);
          }
        }
      }
      this.rb = null;
    };
    b.prototype.Jj = function (g) {
      this.pg(function () {
        throw g;
      });
    };
    var e = function (g) {
      this.U = 0;
      this.ha = void 0;
      this.wc = [];
      this.uh = !1;
      var h = this.Xe();
      try {
        g(h.resolve, h.reject);
      } catch (n) {
        h.reject(n);
      }
    };
    e.prototype.Xe = function () {
      function g(p) {
        return function (t) {
          n || ((n = !0), p.call(h, t));
        };
      }
      var h = this,
        n = !1;
      return { resolve: g(this.lk), reject: g(this.Pf) };
    };
    e.prototype.lk = function (g) {
      if (g === this)
        this.Pf(new TypeError("A Promise cannot resolve to itself"));
      else if (g instanceof e) this.nk(g);
      else {
        a: switch (typeof g) {
          case "object":
            var h = null != g;
            break a;
          case "function":
            h = !0;
            break a;
          default:
            h = !1;
        }
        h ? this.kk(g) : this.eh(g);
      }
    };
    e.prototype.kk = function (g) {
      var h = void 0;
      try {
        h = g.then;
      } catch (n) {
        this.Pf(n);
        return;
      }
      "function" == typeof h ? this.pk(h, g) : this.eh(g);
    };
    e.prototype.Pf = function (g) {
      this.bi(2, g);
    };
    e.prototype.eh = function (g) {
      this.bi(1, g);
    };
    e.prototype.bi = function (g, h) {
      if (0 != this.U)
        throw Error(
          "Cannot settle(" +
            g +
            ", " +
            h +
            "): Promise already settled in state" +
            this.U
        );
      this.U = g;
      this.ha = h;
      2 === this.U && this.mk();
      this.Tj();
    };
    e.prototype.mk = function () {
      var g = this;
      d(function () {
        if (g.fk()) {
          var h = l.console;
          "undefined" !== typeof h && h.error(g.ha);
        }
      }, 1);
    };
    e.prototype.fk = function () {
      if (this.uh) return !1;
      var g = l.CustomEvent,
        h = l.Event,
        n = l.dispatchEvent;
      if ("undefined" === typeof n) return !0;
      "function" === typeof g
        ? (g = new g("unhandledrejection", { cancelable: !0 }))
        : "function" === typeof h
        ? (g = new h("unhandledrejection", { cancelable: !0 }))
        : ((g = l.document.createEvent("CustomEvent")),
          g.initCustomEvent("unhandledrejection", !1, !0, g));
      g.promise = this;
      g.reason = this.ha;
      return n(g);
    };
    e.prototype.Tj = function () {
      if (null != this.wc) {
        for (var g = 0; g < this.wc.length; ++g) f.og(this.wc[g]);
        this.wc = null;
      }
    };
    var f = new b();
    e.prototype.nk = function (g) {
      var h = this.Xe();
      g.Bd(h.resolve, h.reject);
    };
    e.prototype.pk = function (g, h) {
      var n = this.Xe();
      try {
        g.call(h, n.resolve, n.reject);
      } catch (p) {
        n.reject(p);
      }
    };
    e.prototype.then = function (g, h) {
      function n(D, ca) {
        return "function" == typeof D
          ? function (Da) {
              try {
                p(D(Da));
              } catch (T) {
                t(T);
              }
            }
          : ca;
      }
      var p,
        t,
        C = new e(function (D, ca) {
          p = D;
          t = ca;
        });
      this.Bd(n(g, p), n(h, t));
      return C;
    };
    e.prototype.catch = function (g) {
      return this.then(void 0, g);
    };
    e.prototype.Bd = function (g, h) {
      function n() {
        switch (p.U) {
          case 1:
            g(p.ha);
            break;
          case 2:
            h(p.ha);
            break;
          default:
            throw Error("Unexpected state: " + p.U);
        }
      }
      var p = this;
      null == this.wc ? f.og(n) : this.wc.push(n);
      this.uh = !0;
    };
    e.resolve = c;
    e.reject = function (g) {
      return new e(function (h, n) {
        n(g);
      });
    };
    e.race = function (g) {
      return new e(function (h, n) {
        for (var p = m(g), t = p.next(); !t.done; t = p.next())
          c(t.value).Bd(h, n);
      });
    };
    e.all = function (g) {
      var h = m(g),
        n = h.next();
      return n.done
        ? c([])
        : new e(function (p, t) {
            function C(Da) {
              return function (T) {
                D[Da] = T;
                ca--;
                0 == ca && p(D);
              };
            }
            var D = [],
              ca = 0;
            do
              D.push(void 0),
                ca++,
                c(n.value).Bd(C(D.length - 1), t),
                (n = h.next());
            while (!n.done);
          });
    };
    return e;
  });
  var ra = function (a, b) {
    a instanceof String && (a += "");
    var c = 0,
      d = !1,
      e = {
        next: function () {
          if (!d && c < a.length) {
            var f = c++;
            return { value: b(f, a[f]), done: !1 };
          }
          d = !0;
          return { done: !0, value: void 0 };
        },
      };
    e[Symbol.iterator] = function () {
      return e;
    };
    return e;
  };
  ea("Array.prototype.keys", function (a) {
    return a
      ? a
      : function () {
          return ra(this, function (b) {
            return b;
          });
        };
  });
  ea("Object.entries", function (a) {
    return a
      ? a
      : function (b) {
          var c = [],
            d;
          for (d in b) pa(b, d) && c.push([d, b[d]]);
          return c;
        };
  });
  ea("Object.is", function (a) {
    return a
      ? a
      : function (b, c) {
          return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
        };
  });
  ea("Array.prototype.includes", function (a) {
    return a
      ? a
      : function (b, c) {
          var d = this;
          d instanceof String && (d = String(d));
          var e = d.length;
          c = c || 0;
          for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
            var f = d[c];
            if (f === b || Object.is(f, b)) return !0;
          }
          return !1;
        };
  });
  ea("String.prototype.includes", function (a) {
    return a
      ? a
      : function (b, c) {
          return -1 !== oa(this, b, "includes").indexOf(b, c || 0);
        };
  });
  ea("Array.prototype.values", function (a) {
    return a
      ? a
      : function () {
          return ra(this, function (b, c) {
            return c;
          });
        };
  });
  ea("WeakMap", function (a) {
    function b() {}
    function c(n) {
      var p = typeof n;
      return ("object" === p && null !== n) || "function" === p;
    }
    function d(n) {
      if (!pa(n, f)) {
        var p = new b();
        ba(n, f, { value: p });
      }
    }
    function e(n) {
      var p = Object[n];
      p &&
        (Object[n] = function (t) {
          if (t instanceof b) return t;
          Object.isExtensible(t) && d(t);
          return p(t);
        });
    }
    if (
      (function () {
        if (!a || !Object.seal) return !1;
        try {
          var n = Object.seal({}),
            p = Object.seal({}),
            t = new a([
              [n, 2],
              [p, 3],
            ]);
          if (2 != t.get(n) || 3 != t.get(p)) return !1;
          t.delete(n);
          t.set(p, 4);
          return !t.has(n) && 4 == t.get(p);
        } catch (C) {
          return !1;
        }
      })()
    )
      return a;
    var f = "$jscomp_hidden_" + Math.random();
    e("freeze");
    e("preventExtensions");
    e("seal");
    var g = 0,
      h = function (n) {
        this.S = (g += Math.random() + 1).toString();
        if (n) {
          n = m(n);
          for (var p; !(p = n.next()).done; )
            (p = p.value), this.set(p[0], p[1]);
        }
      };
    h.prototype.set = function (n, p) {
      if (!c(n)) throw Error("Invalid WeakMap key");
      d(n);
      if (!pa(n, f)) throw Error("WeakMap key fail: " + n);
      n[f][this.S] = p;
      return this;
    };
    h.prototype.get = function (n) {
      return c(n) && pa(n, f) ? n[f][this.S] : void 0;
    };
    h.prototype.has = function (n) {
      return c(n) && pa(n, f) && pa(n[f], this.S);
    };
    h.prototype.delete = function (n) {
      return c(n) && pa(n, f) && pa(n[f], this.S) ? delete n[f][this.S] : !1;
    };
    return h;
  });
  ea("Map", function (a) {
    if (
      (function () {
        if (
          !a ||
          "function" != typeof a ||
          !a.prototype.entries ||
          "function" != typeof Object.seal
        )
          return !1;
        try {
          var h = Object.seal({ x: 4 }),
            n = new a(m([[h, "s"]]));
          if (
            "s" != n.get(h) ||
            1 != n.size ||
            n.get({ x: 4 }) ||
            n.set({ x: 4 }, "t") != n ||
            2 != n.size
          )
            return !1;
          var p = n.entries(),
            t = p.next();
          if (t.done || t.value[0] != h || "s" != t.value[1]) return !1;
          t = p.next();
          return t.done ||
            4 != t.value[0].x ||
            "t" != t.value[1] ||
            !p.next().done
            ? !1
            : !0;
        } catch (C) {
          return !1;
        }
      })()
    )
      return a;
    var b = new WeakMap(),
      c = function (h) {
        this.Pc = {};
        this.na = f();
        this.size = 0;
        if (h) {
          h = m(h);
          for (var n; !(n = h.next()).done; )
            (n = n.value), this.set(n[0], n[1]);
        }
      };
    c.prototype.set = function (h, n) {
      h = 0 === h ? 0 : h;
      var p = d(this, h);
      p.list || (p.list = this.Pc[p.id] = []);
      p.ea
        ? (p.ea.value = n)
        : ((p.ea = {
            next: this.na,
            pb: this.na.pb,
            head: this.na,
            key: h,
            value: n,
          }),
          p.list.push(p.ea),
          (this.na.pb.next = p.ea),
          (this.na.pb = p.ea),
          this.size++);
      return this;
    };
    c.prototype.delete = function (h) {
      h = d(this, h);
      return h.ea && h.list
        ? (h.list.splice(h.index, 1),
          h.list.length || delete this.Pc[h.id],
          (h.ea.pb.next = h.ea.next),
          (h.ea.next.pb = h.ea.pb),
          (h.ea.head = null),
          this.size--,
          !0)
        : !1;
    };
    c.prototype.clear = function () {
      this.Pc = {};
      this.na = this.na.pb = f();
      this.size = 0;
    };
    c.prototype.has = function (h) {
      return !!d(this, h).ea;
    };
    c.prototype.get = function (h) {
      return (h = d(this, h).ea) && h.value;
    };
    c.prototype.entries = function () {
      return e(this, function (h) {
        return [h.key, h.value];
      });
    };
    c.prototype.keys = function () {
      return e(this, function (h) {
        return h.key;
      });
    };
    c.prototype.values = function () {
      return e(this, function (h) {
        return h.value;
      });
    };
    c.prototype.forEach = function (h, n) {
      for (var p = this.entries(), t; !(t = p.next()).done; )
        (t = t.value), h.call(n, t[1], t[0], this);
    };
    c.prototype[Symbol.iterator] = c.prototype.entries;
    var d = function (h, n) {
        var p = n && typeof n;
        "object" == p || "function" == p
          ? b.has(n)
            ? (p = b.get(n))
            : ((p = "" + ++g), b.set(n, p))
          : (p = "p_" + n);
        var t = h.Pc[p];
        if (t && pa(h.Pc, p))
          for (h = 0; h < t.length; h++) {
            var C = t[h];
            if ((n !== n && C.key !== C.key) || n === C.key)
              return { id: p, list: t, index: h, ea: C };
          }
        return { id: p, list: t, index: -1, ea: void 0 };
      },
      e = function (h, n) {
        var p = h.na;
        return fa(function () {
          if (p) {
            for (; p.head != h.na; ) p = p.pb;
            for (; p.next != p.head; )
              return (p = p.next), { done: !1, value: n(p) };
            p = null;
          }
          return { done: !0, value: void 0 };
        });
      },
      f = function () {
        var h = {};
        return (h.pb = h.next = h.head = h);
      },
      g = 0;
    return c;
  });
  ea("Set", function (a) {
    if (
      (function () {
        if (
          !a ||
          "function" != typeof a ||
          !a.prototype.entries ||
          "function" != typeof Object.seal
        )
          return !1;
        try {
          var c = Object.seal({ x: 4 }),
            d = new a(m([c]));
          if (
            !d.has(c) ||
            1 != d.size ||
            d.add(c) != d ||
            1 != d.size ||
            d.add({ x: 4 }) != d ||
            2 != d.size
          )
            return !1;
          var e = d.entries(),
            f = e.next();
          if (f.done || f.value[0] != c || f.value[1] != c) return !1;
          f = e.next();
          return f.done ||
            f.value[0] == c ||
            4 != f.value[0].x ||
            f.value[1] != f.value[0]
            ? !1
            : e.next().done;
        } catch (g) {
          return !1;
        }
      })()
    )
      return a;
    var b = function (c) {
      this.l = new Map();
      if (c) {
        c = m(c);
        for (var d; !(d = c.next()).done; ) this.add(d.value);
      }
      this.size = this.l.size;
    };
    b.prototype.add = function (c) {
      c = 0 === c ? 0 : c;
      this.l.set(c, c);
      this.size = this.l.size;
      return this;
    };
    b.prototype.delete = function (c) {
      c = this.l.delete(c);
      this.size = this.l.size;
      return c;
    };
    b.prototype.clear = function () {
      this.l.clear();
      this.size = 0;
    };
    b.prototype.has = function (c) {
      return this.l.has(c);
    };
    b.prototype.entries = function () {
      return this.l.entries();
    };
    b.prototype.values = function () {
      return this.l.values();
    };
    b.prototype.keys = b.prototype.values;
    b.prototype[Symbol.iterator] = b.prototype.values;
    b.prototype.forEach = function (c, d) {
      var e = this;
      this.l.forEach(function (f) {
        return c.call(d, f, f, e);
      });
    };
    return b;
  });
  ea("Object.values", function (a) {
    return a
      ? a
      : function (b) {
          var c = [],
            d;
          for (d in b) pa(b, d) && c.push(b[d]);
          return c;
        };
  });
  ea("String.prototype.padStart", function (a) {
    return a
      ? a
      : function (b, c) {
          var d = oa(this, null, "padStart");
          b -= d.length;
          c = void 0 !== c ? String(c) : " ";
          return (
            (0 < b && c
              ? c.repeat(Math.ceil(b / c.length)).substring(0, b)
              : "") + d
          );
        };
  });
  var sa = sa || {},
    r = this || self,
    ta = /^[\w+/_-]+[=]{0,2}$/,
    ua = null,
    va = function (a) {
      return (a = a.querySelector && a.querySelector("script[nonce]")) &&
        (a = a.nonce || a.getAttribute("nonce")) &&
        ta.test(a)
        ? a
        : "";
    },
    wa = function () {},
    xa = function (a) {
      var b = typeof a;
      return "object" != b ? b : a ? (Array.isArray(a) ? "array" : b) : "null";
    },
    ya = function (a) {
      var b = xa(a);
      return "array" == b || ("object" == b && "number" == typeof a.length);
    },
    za = function (a) {
      return u(a) && "function" == typeof a.getFullYear;
    },
    u = function (a) {
      var b = typeof a;
      return ("object" == b && null != a) || "function" == b;
    },
    Ca = function (a) {
      return (
        (Object.prototype.hasOwnProperty.call(a, Aa) && a[Aa]) || (a[Aa] = ++Ba)
      );
    },
    Aa = "closure_uid_" + ((1e9 * Math.random()) >>> 0),
    Ba = 0,
    Ea = function (a, b, c) {
      return a.call.apply(a.bind, arguments);
    },
    Fa = function (a, b, c) {
      if (!a) throw Error();
      if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function () {
          var e = Array.prototype.slice.call(arguments);
          Array.prototype.unshift.apply(e, d);
          return a.apply(b, e);
        };
      }
      return function () {
        return a.apply(b, arguments);
      };
    },
    v = function (a, b, c) {
      v =
        Function.prototype.bind &&
        -1 != Function.prototype.bind.toString().indexOf("native code")
          ? Ea
          : Fa;
      return v.apply(null, arguments);
    },
    Ga = function (a, b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return function () {
        var d = c.slice();
        d.push.apply(d, arguments);
        return a.apply(this, d);
      };
    },
    w = function (a, b) {
      a = a.split(".");
      var c = r;
      a[0] in c ||
        "undefined" == typeof c.execScript ||
        c.execScript("var " + a[0]);
      for (var d; a.length && (d = a.shift()); )
        a.length || void 0 === b
          ? (c = c[d] && c[d] !== Object.prototype[d] ? c[d] : (c[d] = {}))
          : (c[d] = b);
    },
    x = function (a, b) {
      function c() {}
      c.prototype = b.prototype;
      a.I = b.prototype;
      a.prototype = new c();
      a.prototype.constructor = a;
      a.Bk = function (d, e, f) {
        for (
          var g = Array(arguments.length - 2), h = 2;
          h < arguments.length;
          h++
        )
          g[h - 2] = arguments[h];
        return b.prototype[e].apply(d, g);
      };
    },
    Ha = function (a) {
      return a;
    };
  var y = function () {
    this.Ta = this.Ta;
    this.Wd = this.Wd;
  };
  y.prototype.Ta = !1;
  y.prototype.Sa = function () {
    this.Ta || ((this.Ta = !0), this.A());
  };
  y.prototype.A = function () {
    if (this.Wd) for (; this.Wd.length; ) this.Wd.shift()();
  };
  var Ia = function (a) {
    a && "function" == typeof a.Sa && a.Sa();
  };
  var Ja = function (a, b) {
    this.type = a;
    this.currentTarget = this.target = b;
    this.defaultPrevented = this.ac = !1;
  };
  Ja.prototype.stopPropagation = function () {
    this.ac = !0;
  };
  Ja.prototype.preventDefault = function () {
    this.defaultPrevented = !0;
  };
  function Ka(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, Ka);
    else {
      var b = Error().stack;
      b && (this.stack = b);
    }
    a && (this.message = String(a));
  }
  x(Ka, Error);
  Ka.prototype.name = "CustomError";
  var La;
  var Ma = function (a, b) {
    a = a.split("%s");
    for (var c = "", d = a.length - 1, e = 0; e < d; e++)
      c += a[e] + (e < b.length ? b[e] : "%s");
    Ka.call(this, c + a[d]);
  };
  x(Ma, Ka);
  Ma.prototype.name = "AssertionError";
  var Na = function (a, b, c, d) {
      var e = "Assertion failed";
      if (c) {
        e += ": " + c;
        var f = d;
      } else a && ((e += ": " + a), (f = b));
      throw new Ma("" + e, f || []);
    },
    z = function (a, b, c) {
      a || Na("", null, b, Array.prototype.slice.call(arguments, 2));
    },
    Oa = function (a, b) {
      throw new Ma(
        "Failure" + (a ? ": " + a : ""),
        Array.prototype.slice.call(arguments, 1)
      );
    },
    Pa = function (a, b, c) {
      "number" !== typeof a &&
        Na(
          "Expected number but got %s: %s.",
          [xa(a), a],
          b,
          Array.prototype.slice.call(arguments, 2)
        );
      return a;
    },
    Qa = function (a, b, c) {
      "string" !== typeof a &&
        Na(
          "Expected string but got %s: %s.",
          [xa(a), a],
          b,
          Array.prototype.slice.call(arguments, 2)
        );
    },
    Ra = function (a, b, c) {
      "function" !== typeof a &&
        Na(
          "Expected function but got %s: %s.",
          [xa(a), a],
          b,
          Array.prototype.slice.call(arguments, 2)
        );
    },
    Sa = function (a, b, c) {
      u(a) ||
        Na(
          "Expected object but got %s: %s.",
          [xa(a), a],
          b,
          Array.prototype.slice.call(arguments, 2)
        );
      return a;
    };
  var Ta = Array.prototype.indexOf
      ? function (a, b) {
          z(null != a.length);
          return Array.prototype.indexOf.call(a, b, void 0);
        }
      : function (a, b) {
          if ("string" === typeof a)
            return "string" !== typeof b || 1 != b.length
              ? -1
              : a.indexOf(b, 0);
          for (var c = 0; c < a.length; c++) if (c in a && a[c] === b) return c;
          return -1;
        },
    Ua = Array.prototype.lastIndexOf
      ? function (a, b) {
          z(null != a.length);
          return Array.prototype.lastIndexOf.call(a, b, a.length - 1);
        }
      : function (a, b) {
          var c = a.length - 1;
          0 > c && (c = Math.max(0, a.length + c));
          if ("string" === typeof a)
            return "string" !== typeof b || 1 != b.length
              ? -1
              : a.lastIndexOf(b, c);
          for (; 0 <= c; c--) if (c in a && a[c] === b) return c;
          return -1;
        },
    Va = Array.prototype.forEach
      ? function (a, b, c) {
          z(null != a.length);
          Array.prototype.forEach.call(a, b, c);
        }
      : function (a, b, c) {
          for (
            var d = a.length,
              e = "string" === typeof a ? a.split("") : a,
              f = 0;
            f < d;
            f++
          )
            f in e && b.call(c, e[f], f, a);
        },
    Wa = Array.prototype.filter
      ? function (a, b) {
          z(null != a.length);
          return Array.prototype.filter.call(a, b, void 0);
        }
      : function (a, b) {
          for (
            var c = a.length,
              d = [],
              e = 0,
              f = "string" === typeof a ? a.split("") : a,
              g = 0;
            g < c;
            g++
          )
            if (g in f) {
              var h = f[g];
              b.call(void 0, h, g, a) && (d[e++] = h);
            }
          return d;
        },
    Xa = Array.prototype.map
      ? function (a, b, c) {
          z(null != a.length);
          return Array.prototype.map.call(a, b, c);
        }
      : function (a, b, c) {
          for (
            var d = a.length,
              e = Array(d),
              f = "string" === typeof a ? a.split("") : a,
              g = 0;
            g < d;
            g++
          )
            g in f && (e[g] = b.call(c, f[g], g, a));
          return e;
        },
    Ya = Array.prototype.some
      ? function (a, b) {
          z(null != a.length);
          return Array.prototype.some.call(a, b, void 0);
        }
      : function (a, b) {
          for (
            var c = a.length,
              d = "string" === typeof a ? a.split("") : a,
              e = 0;
            e < c;
            e++
          )
            if (e in d && b.call(void 0, d[e], e, a)) return !0;
          return !1;
        },
    Za = Array.prototype.every
      ? function (a, b, c) {
          z(null != a.length);
          return Array.prototype.every.call(a, b, c);
        }
      : function (a, b, c) {
          for (
            var d = a.length,
              e = "string" === typeof a ? a.split("") : a,
              f = 0;
            f < d;
            f++
          )
            if (f in e && !b.call(c, e[f], f, a)) return !1;
          return !0;
        };
  function $a(a, b) {
    var c = 0;
    Va(
      a,
      function (d, e, f) {
        b.call(void 0, d, e, f) && ++c;
      },
      void 0
    );
    return c;
  }
  function ab(a) {
    a: {
      var b = bb;
      for (
        var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0;
        e < c;
        e++
      )
        if (e in d && b.call(void 0, d[e], e, a)) {
          b = e;
          break a;
        }
      b = -1;
    }
    return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b];
  }
  function cb(a, b) {
    return 0 <= Ta(a, b);
  }
  function eb(a) {
    if (!Array.isArray(a)) for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0;
  }
  function fb(a, b) {
    b = Ta(a, b);
    var c;
    (c = 0 <= b) && gb(a, b);
    return c;
  }
  function gb(a, b) {
    z(null != a.length);
    Array.prototype.splice.call(a, b, 1);
  }
  function hb(a) {
    return Array.prototype.concat.apply([], arguments);
  }
  function ib(a) {
    var b = a.length;
    if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
      return c;
    }
    return [];
  }
  function jb(a, b) {
    for (var c = 1; c < arguments.length; c++) {
      var d = arguments[c];
      if (ya(d)) {
        var e = a.length || 0,
          f = d.length || 0;
        a.length = e + f;
        for (var g = 0; g < f; g++) a[e + g] = d[g];
      } else a.push(d);
    }
  }
  function kb(a, b, c) {
    z(null != a.length);
    return 2 >= arguments.length
      ? Array.prototype.slice.call(a, b)
      : Array.prototype.slice.call(a, b, c);
  }
  function lb(a) {
    for (var b = {}, c = 0, d = 0; d < a.length; ) {
      var e = a[d++];
      var f = e;
      f = u(f) ? "o" + Ca(f) : (typeof f).charAt(0) + f;
      Object.prototype.hasOwnProperty.call(b, f) || ((b[f] = !0), (a[c++] = e));
    }
    a.length = c;
  }
  function mb(a) {
    var b = [];
    if (0 > a - 0) return [];
    for (var c = 0; c < a; c += 1) b.push(c);
    return b;
  }
  function nb(a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
      var d = arguments[c];
      if (Array.isArray(d))
        for (var e = 0; e < d.length; e += 8192) {
          var f = kb(d, e, e + 8192);
          f = nb.apply(null, f);
          for (var g = 0; g < f.length; g++) b.push(f[g]);
        }
      else b.push(d);
    }
    return b;
  }
  var ob = String.prototype.trim
      ? function (a) {
          return a.trim();
        }
      : function (a) {
          return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
        },
    pb = /&/g,
    qb = /</g,
    rb = />/g,
    sb = /"/g,
    tb = /'/g,
    ub = /\x00/g,
    vb = /[\x00&<>"']/,
    wb = function (a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    };
  var xb;
  a: {
    var yb = r.navigator;
    if (yb) {
      var zb = yb.userAgent;
      if (zb) {
        xb = zb;
        break a;
      }
    }
    xb = "";
  }
  var Ab = function (a) {
    return -1 != xb.indexOf(a);
  };
  var Bb = function (a, b, c) {
      for (var d in a) b.call(c, a[d], d, a);
    },
    Cb = function (a, b) {
      var c = {},
        d;
      for (d in a) b.call(void 0, a[d], d, a) && (c[d] = a[d]);
      return c;
    },
    Db = function (a, b, c) {
      var d = {},
        e;
      for (e in a) d[e] = b.call(c, a[e], e, a);
      return d;
    },
    Eb = function (a, b) {
      for (var c in a) if (b.call(void 0, a[c], c, a)) return !0;
      return !1;
    },
    Fb = function (a) {
      var b = [],
        c = 0,
        d;
      for (d in a) b[c++] = a[d];
      return b;
    },
    Gb = function (a) {
      var b = [],
        c = 0,
        d;
      for (d in a) b[c++] = d;
      return b;
    },
    Hb = function (a, b) {
      for (var c in a) if (a[c] == b) return !0;
      return !1;
    },
    Kb = function (a) {
      var b = Jb,
        c;
      for (c in b) if (a.call(void 0, b[c], c, b)) return c;
    },
    Lb = function (a) {
      for (var b in a) return !1;
      return !0;
    },
    Mb = function (a, b) {
      b in a && delete a[b];
    },
    Nb = function (a) {
      var b = {},
        c;
      for (c in a) b[c] = a[c];
      return b;
    },
    Ob = function (a) {
      if (!a || "object" !== typeof a) return a;
      if ("function" === typeof a.clone) return a.clone();
      var b = Array.isArray(a)
          ? []
          : "function" !== typeof ArrayBuffer ||
            "function" !== typeof ArrayBuffer.isView ||
            !ArrayBuffer.isView(a) ||
            a instanceof DataView
          ? {}
          : new a.constructor(a.length),
        c;
      for (c in a) b[c] = Ob(a[c]);
      return b;
    },
    Pb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
      " "
    ),
    Qb = function (a, b) {
      for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (var f = 0; f < Pb.length; f++)
          (c = Pb[f]),
            Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
      }
    };
  var Rb = function (a) {
    return a;
  };
  var Sb;
  var Vb = function (a, b) {
    this.cg = (a === Tb && b) || "";
    this.uj = Ub;
  };
  Vb.prototype.sf = !0;
  Vb.prototype.mf = function () {
    return this.cg;
  };
  Vb.prototype.toString = function () {
    return "Const{" + this.cg + "}";
  };
  var Wb = function (a) {
      if (a instanceof Vb && a.constructor === Vb && a.uj === Ub) return a.cg;
      Oa("expected object of type Const, got '" + a + "'");
      return "type_error:Const";
    },
    Ub = {},
    Tb = {};
  var Yb = function (a, b) {
    this.Lf = b === Xb ? a : "";
  };
  Yb.prototype.sf = !0;
  Yb.prototype.mf = function () {
    return this.Lf.toString();
  };
  Yb.prototype.toString = function () {
    return "TrustedResourceUrl{" + this.Lf + "}";
  };
  var Zb = function (a) {
      if (a instanceof Yb && a.constructor === Yb) return a.Lf;
      Oa(
        "expected object of type TrustedResourceUrl, got '" +
          a +
          "' of type " +
          xa(a)
      );
      return "type_error:TrustedResourceUrl";
    },
    dc = function (a) {
      var b = Wb($b);
      if (!ac.test(b)) throw Error("Invalid TrustedResourceUrl format: " + b);
      var c = b.replace(bc, function (d, e) {
        if (!Object.prototype.hasOwnProperty.call(a, e))
          throw Error(
            'Found marker, "' +
              e +
              '", in format string, "' +
              b +
              '", but no valid label mapping found in args: ' +
              JSON.stringify(a)
          );
        d = a[e];
        return d instanceof Vb ? Wb(d) : encodeURIComponent(String(d));
      });
      return cc(c);
    },
    bc = /%{(\w+)}/g,
    ac = /^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i,
    Xb = {},
    cc = function (a) {
      if (void 0 === Sb) {
        var b = null;
        var c = r.trustedTypes;
        if (c && c.createPolicy)
          try {
            b = c.createPolicy("goog#html", {
              createHTML: Ha,
              createScript: Ha,
              createScriptURL: Ha,
            });
          } catch (d) {
            r.console && r.console.error(d.message);
          }
        Sb = b;
      }
      a = (b = Sb) ? b.createScriptURL(a) : a;
      return new Yb(a, Xb);
    };
  var fc = function (a, b) {
    this.Kf = b === ec ? a : "";
  };
  fc.prototype.sf = !0;
  fc.prototype.mf = function () {
    return this.Kf.toString();
  };
  fc.prototype.toString = function () {
    return "SafeUrl{" + this.Kf + "}";
  };
  var gc = function (a) {
      if (a instanceof fc && a.constructor === fc) return a.Kf;
      Oa("expected object of type SafeUrl, got '" + a + "' of type " + xa(a));
      return "type_error:SafeUrl";
    },
    hc = /^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)|font\/\w+|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|video\/(?:mpeg|mp4|ogg|webm|quicktime|x-matroska))(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i,
    ic = function (a) {
      if (hc.test(a.type)) {
        var b =
          void 0 !== r.URL && void 0 !== r.URL.createObjectURL
            ? r.URL
            : void 0 !== r.webkitURL && void 0 !== r.webkitURL.createObjectURL
            ? r.webkitURL
            : void 0 !== r.createObjectURL
            ? r
            : null;
        if (null == b)
          throw Error("This browser doesn't seem to support blob URLs");
        a = b.createObjectURL(a);
      } else a = "about:invalid#zClosurez";
      return new fc(a, ec);
    },
    ec = {};
  var jc = function (a, b) {
    a: {
      try {
        var c = a && a.ownerDocument,
          d = c && (c.defaultView || c.parentWindow);
        d = d || r;
        if (d.Element && d.Location) {
          var e = d;
          break a;
        }
      } catch (g) {}
      e = null;
    }
    if (
      e &&
      "undefined" != typeof e.HTMLScriptElement &&
      (!a ||
        (!(a instanceof e.HTMLScriptElement) &&
          (a instanceof e.Location || a instanceof e.Element)))
    ) {
      if (u(a))
        try {
          var f =
            a.constructor.displayName ||
            a.constructor.name ||
            Object.prototype.toString.call(a);
        } catch (g) {
          f = "<object could not be stringified>";
        }
      else f = void 0 === a ? "undefined" : null === a ? "null" : typeof a;
      Oa(
        "Argument is not a %s (or a non-Element, non-Location mock); got: %s",
        "HTMLScriptElement",
        f
      );
    }
    a.src = Zb(b);
    (b = a.ownerDocument && a.ownerDocument.defaultView) && b != r
      ? (b = va(b.document))
      : (null === ua && (ua = va(r.document)), (b = ua));
    b && a.setAttribute("nonce", b);
  };
  var kc = function (a, b) {
      for (
        var c = a.split("%s"),
          d = "",
          e = Array.prototype.slice.call(arguments, 1);
        e.length && 1 < c.length;

      )
        d += c.shift() + e.shift();
      return d + c.join("%s");
    },
    lc = function (a) {
      vb.test(a) &&
        (-1 != a.indexOf("&") && (a = a.replace(pb, "&amp;")),
        -1 != a.indexOf("<") && (a = a.replace(qb, "&lt;")),
        -1 != a.indexOf(">") && (a = a.replace(rb, "&gt;")),
        -1 != a.indexOf('"') && (a = a.replace(sb, "&quot;")),
        -1 != a.indexOf("'") && (a = a.replace(tb, "&#39;")),
        -1 != a.indexOf("\x00") && (a = a.replace(ub, "&#0;")));
      return a;
    },
    mc = function (a) {
      var b = 1;
      a = a.split(":");
      for (var c = []; 0 < b && a.length; ) c.push(a.shift()), b--;
      a.length && c.push(a.join(":"));
      return c;
    };
  var nc = function (a) {
    nc[" "](a);
    return a;
  };
  nc[" "] = wa;
  var pc = function (a, b) {
    var c = oc;
    return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : (c[a] = b(a));
  };
  var qc = Ab("Opera"),
    rc = Ab("Trident") || Ab("MSIE"),
    sc = Ab("Edge"),
    tc =
      Ab("Gecko") &&
      !(-1 != xb.toLowerCase().indexOf("webkit") && !Ab("Edge")) &&
      !(Ab("Trident") || Ab("MSIE")) &&
      !Ab("Edge"),
    uc = -1 != xb.toLowerCase().indexOf("webkit") && !Ab("Edge"),
    vc = function () {
      var a = r.document;
      return a ? a.documentMode : void 0;
    },
    wc;
  a: {
    var xc = "",
      yc = (function () {
        var a = xb;
        if (tc) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (sc) return /Edge\/([\d\.]+)/.exec(a);
        if (rc) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (uc) return /WebKit\/(\S+)/.exec(a);
        if (qc) return /(?:Version)[ \/]?(\S+)/.exec(a);
      })();
    yc && (xc = yc ? yc[1] : "");
    if (rc) {
      var zc = vc();
      if (null != zc && zc > parseFloat(xc)) {
        wc = String(zc);
        break a;
      }
    }
    wc = xc;
  }
  var Ac = wc,
    oc = {},
    Bc = function (a) {
      return pc(a, function () {
        for (
          var b = 0,
            c = ob(String(Ac)).split("."),
            d = ob(String(a)).split("."),
            e = Math.max(c.length, d.length),
            f = 0;
          0 == b && f < e;
          f++
        ) {
          var g = c[f] || "",
            h = d[f] || "";
          do {
            g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
            h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
            if (0 == g[0].length && 0 == h[0].length) break;
            b =
              wb(
                0 == g[1].length ? 0 : parseInt(g[1], 10),
                0 == h[1].length ? 0 : parseInt(h[1], 10)
              ) ||
              wb(0 == g[2].length, 0 == h[2].length) ||
              wb(g[2], h[2]);
            g = g[3];
            h = h[3];
          } while (0 == b);
        }
        return 0 <= b;
      });
    },
    Cc;
  if (r.document && rc) {
    var Dc = vc();
    Cc = Dc ? Dc : parseInt(Ac, 10) || void 0;
  } else Cc = void 0;
  var Ec = Cc;
  var Fc =
    Object.freeze ||
    function (a) {
      return a;
    };
  var Gc = !rc || 9 <= Number(Ec),
    Hc = rc && !Bc("9"),
    Ic = (function () {
      if (!r.addEventListener || !Object.defineProperty) return !1;
      var a = !1,
        b = Object.defineProperty({}, "passive", {
          get: function () {
            a = !0;
          },
        });
      try {
        r.addEventListener("test", wa, b), r.removeEventListener("test", wa, b);
      } catch (c) {}
      return a;
    })();
  var Kc = function (a, b) {
    Ja.call(this, a ? a.type : "");
    this.relatedTarget = this.currentTarget = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
    this.key = "";
    this.charCode = this.keyCode = 0;
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.Ia = null;
    if (a) {
      var c = (this.type = a.type),
        d =
          a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : null;
      this.target = a.target || a.srcElement;
      this.currentTarget = b;
      if ((b = a.relatedTarget)) {
        if (tc) {
          a: {
            try {
              nc(b.nodeName);
              var e = !0;
              break a;
            } catch (f) {}
            e = !1;
          }
          e || (b = null);
        }
      } else
        "mouseover" == c
          ? (b = a.fromElement)
          : "mouseout" == c && (b = a.toElement);
      this.relatedTarget = b;
      d
        ? ((this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX),
          (this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY),
          (this.screenX = d.screenX || 0),
          (this.screenY = d.screenY || 0))
        : ((this.offsetX = uc || void 0 !== a.offsetX ? a.offsetX : a.layerX),
          (this.offsetY = uc || void 0 !== a.offsetY ? a.offsetY : a.layerY),
          (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX),
          (this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY),
          (this.screenX = a.screenX || 0),
          (this.screenY = a.screenY || 0));
      this.button = a.button;
      this.keyCode = a.keyCode || 0;
      this.key = a.key || "";
      this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
      this.ctrlKey = a.ctrlKey;
      this.altKey = a.altKey;
      this.shiftKey = a.shiftKey;
      this.metaKey = a.metaKey;
      this.pointerId = a.pointerId || 0;
      this.pointerType =
        "string" === typeof a.pointerType
          ? a.pointerType
          : Jc[a.pointerType] || "";
      this.state = a.state;
      this.Ia = a;
      a.defaultPrevented && this.preventDefault();
    }
  };
  x(Kc, Ja);
  var Jc = Fc({ 2: "touch", 3: "pen", 4: "mouse" });
  Kc.prototype.stopPropagation = function () {
    Kc.I.stopPropagation.call(this);
    this.Ia.stopPropagation
      ? this.Ia.stopPropagation()
      : (this.Ia.cancelBubble = !0);
  };
  Kc.prototype.preventDefault = function () {
    Kc.I.preventDefault.call(this);
    var a = this.Ia;
    if (a.preventDefault) a.preventDefault();
    else if (((a.returnValue = !1), Hc))
      try {
        if (a.ctrlKey || (112 <= a.keyCode && 123 >= a.keyCode)) a.keyCode = -1;
      } catch (b) {}
  };
  var Lc = "closure_listenable_" + ((1e6 * Math.random()) | 0),
    Mc = function (a) {
      return !(!a || !a[Lc]);
    },
    Nc = 0;
  var Oc = function (a, b, c, d, e) {
      this.listener = a;
      this.Xd = null;
      this.src = b;
      this.type = c;
      this.capture = !!d;
      this.nb = e;
      this.key = ++Nc;
      this.yc = this.Ad = !1;
    },
    Pc = function (a) {
      a.yc = !0;
      a.listener = null;
      a.Xd = null;
      a.src = null;
      a.nb = null;
    };
  var Qc = function (a) {
    this.src = a;
    this.ba = {};
    this.rd = 0;
  };
  Qc.prototype.add = function (a, b, c, d, e) {
    var f = a.toString();
    a = this.ba[f];
    a || ((a = this.ba[f] = []), this.rd++);
    var g = Rc(a, b, d, e);
    -1 < g
      ? ((b = a[g]), c || (b.Ad = !1))
      : ((b = new Oc(b, this.src, f, !!d, e)), (b.Ad = c), a.push(b));
    return b;
  };
  Qc.prototype.remove = function (a, b, c, d) {
    a = a.toString();
    if (!(a in this.ba)) return !1;
    var e = this.ba[a];
    b = Rc(e, b, c, d);
    return -1 < b
      ? (Pc(e[b]),
        gb(e, b),
        0 == e.length && (delete this.ba[a], this.rd--),
        !0)
      : !1;
  };
  var Sc = function (a, b) {
    var c = b.type;
    c in a.ba &&
      fb(a.ba[c], b) &&
      (Pc(b), 0 == a.ba[c].length && (delete a.ba[c], a.rd--));
  };
  Qc.prototype.ld = function (a) {
    a = a && a.toString();
    var b = 0,
      c;
    for (c in this.ba)
      if (!a || c == a) {
        for (var d = this.ba[c], e = 0; e < d.length; e++) ++b, Pc(d[e]);
        delete this.ba[c];
        this.rd--;
      }
  };
  Qc.prototype.Uc = function (a, b, c, d) {
    a = this.ba[a.toString()];
    var e = -1;
    a && (e = Rc(a, b, c, d));
    return -1 < e ? a[e] : null;
  };
  Qc.prototype.hasListener = function (a, b) {
    var c = void 0 !== a,
      d = c ? a.toString() : "",
      e = void 0 !== b;
    return Eb(this.ba, function (f) {
      for (var g = 0; g < f.length; ++g)
        if (!((c && f[g].type != d) || (e && f[g].capture != b))) return !0;
      return !1;
    });
  };
  var Rc = function (a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];
      if (!f.yc && f.listener == b && f.capture == !!c && f.nb == d) return e;
    }
    return -1;
  };
  var Tc = "closure_lm_" + ((1e6 * Math.random()) | 0),
    Uc = {},
    Vc = 0,
    Xc = function (a, b, c, d, e) {
      if (d && d.once) return Wc(a, b, c, d, e);
      if (Array.isArray(b)) {
        for (var f = 0; f < b.length; f++) Xc(a, b[f], c, d, e);
        return null;
      }
      c = Yc(c);
      return Mc(a)
        ? a.Ya(b, c, u(d) ? !!d.capture : !!d, e)
        : Zc(a, b, c, !1, d, e);
    },
    Zc = function (a, b, c, d, e, f) {
      if (!b) throw Error("Invalid event type");
      var g = u(e) ? !!e.capture : !!e,
        h = $c(a);
      h || (a[Tc] = h = new Qc(a));
      c = h.add(b, c, d, g, f);
      if (c.Xd) return c;
      d = ad();
      c.Xd = d;
      d.src = a;
      d.listener = c;
      if (a.addEventListener)
        Ic || (e = g),
          void 0 === e && (e = !1),
          a.addEventListener(b.toString(), d, e);
      else if (a.attachEvent) a.attachEvent(bd(b.toString()), d);
      else if (a.addListener && a.removeListener)
        z("change" === b, "MediaQueryList only has a change event"),
          a.addListener(d);
      else throw Error("addEventListener and attachEvent are unavailable.");
      Vc++;
      return c;
    },
    ad = function () {
      var a = cd,
        b = Gc
          ? function (c) {
              return a.call(b.src, b.listener, c);
            }
          : function (c) {
              c = a.call(b.src, b.listener, c);
              if (!c) return c;
            };
      return b;
    },
    Wc = function (a, b, c, d, e) {
      if (Array.isArray(b)) {
        for (var f = 0; f < b.length; f++) Wc(a, b[f], c, d, e);
        return null;
      }
      c = Yc(c);
      return Mc(a)
        ? a.dd(b, c, u(d) ? !!d.capture : !!d, e)
        : Zc(a, b, c, !0, d, e);
    },
    dd = function (a, b, c, d, e) {
      if (Array.isArray(b))
        for (var f = 0; f < b.length; f++) dd(a, b[f], c, d, e);
      else
        (d = u(d) ? !!d.capture : !!d),
          (c = Yc(c)),
          Mc(a)
            ? a.le(b, c, d, e)
            : a && (a = $c(a)) && (b = a.Uc(b, c, d, e)) && ed(b);
    },
    ed = function (a) {
      if ("number" !== typeof a && a && !a.yc) {
        var b = a.src;
        if (Mc(b)) Sc(b.Ha, a);
        else {
          var c = a.type,
            d = a.Xd;
          b.removeEventListener
            ? b.removeEventListener(c, d, a.capture)
            : b.detachEvent
            ? b.detachEvent(bd(c), d)
            : b.addListener && b.removeListener && b.removeListener(d);
          Vc--;
          (c = $c(b))
            ? (Sc(c, a), 0 == c.rd && ((c.src = null), (b[Tc] = null)))
            : Pc(a);
        }
      }
    },
    bd = function (a) {
      return a in Uc ? Uc[a] : (Uc[a] = "on" + a);
    },
    gd = function (a, b, c, d) {
      var e = !0;
      if ((a = $c(a)))
        if ((b = a.ba[b.toString()]))
          for (b = b.concat(), a = 0; a < b.length; a++) {
            var f = b[a];
            f &&
              f.capture == c &&
              !f.yc &&
              ((f = fd(f, d)), (e = e && !1 !== f));
          }
      return e;
    },
    fd = function (a, b) {
      var c = a.listener,
        d = a.nb || a.src;
      a.Ad && ed(a);
      return c.call(d, b);
    },
    cd = function (a, b) {
      if (a.yc) return !0;
      if (!Gc) {
        if (!b)
          a: {
            b = ["window", "event"];
            for (var c = r, d = 0; d < b.length; d++)
              if (((c = c[b[d]]), null == c)) {
                b = null;
                break a;
              }
            b = c;
          }
        d = b;
        b = new Kc(d, this);
        c = !0;
        if (!(0 > d.keyCode || void 0 != d.returnValue)) {
          a: {
            var e = !1;
            if (0 == d.keyCode)
              try {
                d.keyCode = -1;
                break a;
              } catch (g) {
                e = !0;
              }
            if (e || void 0 == d.returnValue) d.returnValue = !0;
          }
          d = [];
          for (e = b.currentTarget; e; e = e.parentNode) d.push(e);
          a = a.type;
          for (e = d.length - 1; !b.ac && 0 <= e; e--) {
            b.currentTarget = d[e];
            var f = gd(d[e], a, !0, b);
            c = c && f;
          }
          for (e = 0; !b.ac && e < d.length; e++)
            (b.currentTarget = d[e]), (f = gd(d[e], a, !1, b)), (c = c && f);
        }
        return c;
      }
      return fd(a, new Kc(b, this));
    },
    $c = function (a) {
      a = a[Tc];
      return a instanceof Qc ? a : null;
    },
    hd = "__closure_events_fn_" + ((1e9 * Math.random()) >>> 0),
    Yc = function (a) {
      z(a, "Listener can not be null.");
      if ("function" === typeof a) return a;
      z(a.handleEvent, "An object listener must have handleEvent method.");
      a[hd] ||
        (a[hd] = function (b) {
          return a.handleEvent(b);
        });
      return a[hd];
    };
  var A = function () {
    y.call(this);
    this.Ha = new Qc(this);
    this.Hj = this;
    this.If = null;
  };
  x(A, y);
  A.prototype[Lc] = !0;
  k = A.prototype;
  k.addEventListener = function (a, b, c, d) {
    Xc(this, a, b, c, d);
  };
  k.removeEventListener = function (a, b, c, d) {
    dd(this, a, b, c, d);
  };
  k.dispatchEvent = function (a) {
    id(this);
    var b = this.If;
    if (b) {
      var c = [];
      for (var d = 1; b; b = b.If) c.push(b), z(1e3 > ++d, "infinite loop");
    }
    b = this.Hj;
    d = a.type || a;
    if ("string" === typeof a) a = new Ja(a, b);
    else if (a instanceof Ja) a.target = a.target || b;
    else {
      var e = a;
      a = new Ja(d, b);
      Qb(a, e);
    }
    e = !0;
    if (c)
      for (var f = c.length - 1; !a.ac && 0 <= f; f--) {
        var g = (a.currentTarget = c[f]);
        e = jd(g, d, !0, a) && e;
      }
    a.ac ||
      ((g = a.currentTarget = b),
      (e = jd(g, d, !0, a) && e),
      a.ac || (e = jd(g, d, !1, a) && e));
    if (c)
      for (f = 0; !a.ac && f < c.length; f++)
        (g = a.currentTarget = c[f]), (e = jd(g, d, !1, a) && e);
    return e;
  };
  k.A = function () {
    A.I.A.call(this);
    this.Ha && this.Ha.ld(void 0);
    this.If = null;
  };
  k.Ya = function (a, b, c, d) {
    id(this);
    return this.Ha.add(String(a), b, !1, c, d);
  };
  k.dd = function (a, b, c, d) {
    return this.Ha.add(String(a), b, !0, c, d);
  };
  k.le = function (a, b, c, d) {
    this.Ha.remove(String(a), b, c, d);
  };
  var jd = function (a, b, c, d) {
    b = a.Ha.ba[String(b)];
    if (!b) return !0;
    b = b.concat();
    for (var e = !0, f = 0; f < b.length; ++f) {
      var g = b[f];
      if (g && !g.yc && g.capture == c) {
        var h = g.listener,
          n = g.nb || g.src;
        g.Ad && Sc(a.Ha, g);
        e = !1 !== h.call(n, d) && e;
      }
    }
    return e && !d.defaultPrevented;
  };
  A.prototype.Uc = function (a, b, c, d) {
    return this.Ha.Uc(String(a), b, c, d);
  };
  A.prototype.hasListener = function (a, b) {
    return this.Ha.hasListener(void 0 !== a ? String(a) : void 0, b);
  };
  var id = function (a) {
    z(
      a.Ha,
      "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?"
    );
  };
  var kd =
      "StopIteration" in r
        ? r.StopIteration
        : { message: "StopIteration", stack: "" },
    ld = function () {};
  ld.prototype.next = function () {
    throw kd;
  };
  ld.prototype.ic = function () {
    return this;
  };
  var md = function (a) {
      if (a instanceof ld) return a;
      if ("function" == typeof a.ic) return a.ic(!1);
      if (ya(a)) {
        var b = 0,
          c = new ld();
        c.next = function () {
          for (;;) {
            if (b >= a.length) throw kd;
            if (b in a) return a[b++];
            b++;
          }
        };
        return c;
      }
      throw Error("Not implemented");
    },
    nd = function (a, b) {
      if (ya(a))
        try {
          Va(a, b, void 0);
        } catch (c) {
          if (c !== kd) throw c;
        }
      else {
        a = md(a);
        try {
          for (;;) b.call(void 0, a.next(), void 0, a);
        } catch (c) {
          if (c !== kd) throw c;
        }
      }
    };
  var od = function (a, b) {
    this.l = {};
    this.H = [];
    this.td = this.J = 0;
    var c = arguments.length;
    if (1 < c) {
      if (c % 2) throw Error("Uneven number of arguments");
      for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1]);
    } else a && this.addAll(a);
  };
  k = od.prototype;
  k.M = function () {
    return this.J;
  };
  k.T = function () {
    pd(this);
    for (var a = [], b = 0; b < this.H.length; b++) a.push(this.l[this.H[b]]);
    return a;
  };
  k.Ka = function () {
    pd(this);
    return this.H.concat();
  };
  k.vb = function (a) {
    return qd(this.l, a);
  };
  k.Oc = function (a) {
    for (var b = 0; b < this.H.length; b++) {
      var c = this.H[b];
      if (qd(this.l, c) && this.l[c] == a) return !0;
    }
    return !1;
  };
  k.equals = function (a, b) {
    if (this === a) return !0;
    if (this.J != a.M()) return !1;
    b = b || rd;
    pd(this);
    for (var c, d = 0; (c = this.H[d]); d++)
      if (!b(this.get(c), a.get(c))) return !1;
    return !0;
  };
  var rd = function (a, b) {
    return a === b;
  };
  od.prototype.isEmpty = function () {
    return 0 == this.J;
  };
  od.prototype.clear = function () {
    this.l = {};
    this.td = this.J = this.H.length = 0;
  };
  od.prototype.remove = function (a) {
    return qd(this.l, a)
      ? (delete this.l[a],
        this.J--,
        this.td++,
        this.H.length > 2 * this.J && pd(this),
        !0)
      : !1;
  };
  var pd = function (a) {
    if (a.J != a.H.length) {
      for (var b = 0, c = 0; b < a.H.length; ) {
        var d = a.H[b];
        qd(a.l, d) && (a.H[c++] = d);
        b++;
      }
      a.H.length = c;
    }
    if (a.J != a.H.length) {
      var e = {};
      for (c = b = 0; b < a.H.length; )
        (d = a.H[b]), qd(e, d) || ((a.H[c++] = d), (e[d] = 1)), b++;
      a.H.length = c;
    }
  };
  k = od.prototype;
  k.get = function (a, b) {
    return qd(this.l, a) ? this.l[a] : b;
  };
  k.set = function (a, b) {
    qd(this.l, a) || (this.J++, this.H.push(a), this.td++);
    this.l[a] = b;
  };
  k.addAll = function (a) {
    if (a instanceof od)
      for (var b = a.Ka(), c = 0; c < b.length; c++)
        this.set(b[c], a.get(b[c]));
    else for (b in a) this.set(b, a[b]);
  };
  k.forEach = function (a, b) {
    for (var c = this.Ka(), d = 0; d < c.length; d++) {
      var e = c[d],
        f = this.get(e);
      a.call(b, f, e, this);
    }
  };
  k.clone = function () {
    return new od(this);
  };
  k.ic = function (a) {
    pd(this);
    var b = 0,
      c = this.td,
      d = this,
      e = new ld();
    e.next = function () {
      if (c != d.td)
        throw Error("The map has changed since the iterator was created");
      if (b >= d.H.length) throw kd;
      var f = d.H[b++];
      return a ? f : d.l[f];
    };
    return e;
  };
  var qd = function (a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  };
  var sd = function (a) {
      if (a.M && "function" == typeof a.M) a = a.M();
      else if (ya(a) || "string" === typeof a) a = a.length;
      else {
        var b = 0,
          c;
        for (c in a) b++;
        a = b;
      }
      return a;
    },
    td = function (a) {
      if (a.T && "function" == typeof a.T) return a.T();
      if ("string" === typeof a) return a.split("");
      if (ya(a)) {
        for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
        return b;
      }
      return Fb(a);
    },
    ud = function (a) {
      if (a.Ka && "function" == typeof a.Ka) return a.Ka();
      if (!a.T || "function" != typeof a.T) {
        if (ya(a) || "string" === typeof a) {
          var b = [];
          a = a.length;
          for (var c = 0; c < a; c++) b.push(c);
          return b;
        }
        return Gb(a);
      }
    },
    vd = function (a, b, c) {
      if (a.forEach && "function" == typeof a.forEach) a.forEach(b, c);
      else if (ya(a) || "string" === typeof a) Va(a, b, c);
      else
        for (var d = ud(a), e = td(a), f = e.length, g = 0; g < f; g++)
          b.call(c, e[g], d && d[g], a);
    },
    wd = function (a, b) {
      if ("function" == typeof a.every) return a.every(b, void 0);
      if (ya(a) || "string" === typeof a) return Za(a, b, void 0);
      for (var c = ud(a), d = td(a), e = d.length, f = 0; f < e; f++)
        if (!b.call(void 0, d[f], c && c[f], a)) return !1;
      return !0;
    };
  var xd = function (a) {
      this.l = new od();
      a && this.addAll(a);
    },
    yd = function (a) {
      var b = typeof a;
      return ("object" == b && a) || "function" == b
        ? "o" + Ca(a)
        : b.substr(0, 1) + a;
    };
  k = xd.prototype;
  k.M = function () {
    return this.l.M();
  };
  k.add = function (a) {
    this.l.set(yd(a), a);
  };
  k.addAll = function (a) {
    a = td(a);
    for (var b = a.length, c = 0; c < b; c++) this.add(a[c]);
  };
  k.ld = function (a) {
    a = td(a);
    for (var b = a.length, c = 0; c < b; c++) this.remove(a[c]);
  };
  k.remove = function (a) {
    return this.l.remove(yd(a));
  };
  k.clear = function () {
    this.l.clear();
  };
  k.isEmpty = function () {
    return this.l.isEmpty();
  };
  k.contains = function (a) {
    return this.l.vb(yd(a));
  };
  k.th = function (a) {
    var b = new xd();
    a = td(a);
    for (var c = 0; c < a.length; c++) {
      var d = a[c];
      this.contains(d) && b.add(d);
    }
    return b;
  };
  k.bf = function (a) {
    var b = this.clone();
    b.ld(a);
    return b;
  };
  k.T = function () {
    return this.l.T();
  };
  k.clone = function () {
    return new xd(this);
  };
  k.equals = function (a) {
    return this.M() == sd(a) && zd(this, a);
  };
  var zd = function (a, b) {
    var c = sd(b);
    if (a.M() > c) return !1;
    !(b instanceof xd) && 5 < c && (b = new xd(b));
    return wd(a, function (d) {
      var e = b;
      return e.contains && "function" == typeof e.contains
        ? e.contains(d)
        : e.Oc && "function" == typeof e.Oc
        ? e.Oc(d)
        : ya(e) || "string" === typeof e
        ? cb(e, d)
        : Hb(e, d);
    });
  };
  xd.prototype.ic = function () {
    return this.l.ic(!1);
  };
  var ee = {},
    Ad = function (a, b, c) {
      A.call(this);
      this.ak = b;
      this.token = c;
      this.Db = [];
      this.gg = new xd();
      this.Bb = 0;
      this.url = a;
    };
  x(Ad, A);
  w("ee.AbstractOverlay", Ad);
  var Bd = function (a, b, c) {
    var d = 1 << c,
      e = b.x % d;
    0 > e && (e += d);
    return [a.ak, c, e, b.y].join("/");
  };
  Ad.prototype.Vc = function () {
    return this.Db.length;
  };
  var Cd = function (a) {
    Ja.call(this, "tileevent");
    this.count = a;
  };
  x(Cd, Ja);
  var Dd = function () {},
    Ed = new Dd();
  function Fd(a) {
    return Object.assign({ R: {}, Dk: {}, keys: [], Ba: {}, s: {}, K: {} }, a);
  }
  var B = function () {
      this.a = {};
    },
    E = function (a, b) {
      return a.a.hasOwnProperty(b) ? a.a[b] : null;
    },
    F = function (a, b) {
      return null != a.a[b];
    };
  function Gd(a, b) {
    return E(b, a);
  }
  function Hd(a, b, c) {
    b[a] = c;
  }
  function Id() {
    return {};
  }
  function Jd(a, b) {
    var c = new a();
    return null == b ? c : Kd(b, Ld, Md, Nd, a);
  }
  function Ld(a, b) {
    return b[a];
  }
  function Md(a, b, c) {
    b.a[a] = c;
  }
  function Nd(a) {
    if (null == a)
      throw Error("Cannot deserialize, target constructor was null.");
    return new a();
  }
  function Kd(a, b, c, d, e) {
    e = d(e);
    var f = Od(a, e),
      g = f.R || {},
      h = f.s || {},
      n = f.Ba || {},
      p = {};
    f = m(f.keys || []);
    for (var t = f.next(); !t.done; p = { Hc: p.Hc }, t = f.next()) {
      t = t.value;
      var C = b(t, a);
      if (null != C) {
        var D = void 0;
        g.hasOwnProperty(t)
          ? (D = Pd(C, b, c, d, !0, !0, g[t]))
          : h.hasOwnProperty(t)
          ? (D = Pd(C, b, c, d, !1, !0, h[t]))
          : n.hasOwnProperty(t)
          ? ((p.Hc = n[t]),
            (D = p.Hc.oa
              ? C.map(
                  (function (ca) {
                    return function (Da) {
                      return Qd(Da, ca.Hc, b, c, d);
                    };
                  })(p)
                )
              : Qd(C, p.Hc, b, c, d)))
          : (D = Array.isArray(C)
              ? Pd(C, b, c, d, !0, !1)
              : C instanceof Dd
              ? null
              : C);
        c(t, e, D);
      }
    }
    return e;
  }
  function Qd(a, b, c, d, e) {
    for (
      var f = {}, g = m(Object.keys(a)), h = g.next();
      !h.done;
      h = g.next()
    ) {
      h = h.value;
      var n = a[h];
      null != n && (f[h] = Pd(n, c, d, e, b.qa, b.pa, b.ia));
    }
    return f;
  }
  function Pd(a, b, c, d, e, f, g) {
    if (f && null == g)
      throw Error(
        "Cannot deserialize a reference object without a constructor."
      );
    return null == a
      ? a
      : e && f
      ? a.map(function (h) {
          return Kd(h, b, c, d, g);
        })
      : e && !f
      ? a.map(function (h) {
          return h;
        })
      : !e && f
      ? Kd(a, b, c, d, g)
      : a instanceof Dd
      ? null
      : "object" === typeof a
      ? JSON.parse(JSON.stringify(a))
      : a;
  }
  function Od(a, b) {
    if (b instanceof B) a = Fd(b.f());
    else if (a instanceof B) a = Fd(a.f());
    else throw Error("Cannot find ClassMetadata.");
    return a;
  }
  var Rd = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,
    Sd = function (a, b) {
      if (a) {
        a = a.split("&");
        for (var c = 0; c < a.length; c++) {
          var d = a[c].indexOf("="),
            e = null;
          if (0 <= d) {
            var f = a[c].substring(0, d);
            e = a[c].substring(d + 1);
          } else f = a[c];
          b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
        }
      }
    };
  var Td = function (a, b) {
    this.lb = this.ec = this.Ab = "";
    this.xc = null;
    this.Tb = this.ob = "";
    this.za = this.Yj = !1;
    if (a instanceof Td) {
      this.za = void 0 !== b ? b : a.za;
      Ud(this, a.Ab);
      var c = a.ec;
      Vd(this);
      this.ec = c;
      c = a.lb;
      Vd(this);
      this.lb = c;
      Wd(this, a.xc);
      this.setPath(a.getPath());
      Xd(this, a.Ca.clone());
      a = a.Tb;
      Vd(this);
      this.Tb = a;
    } else
      a && (c = String(a).match(Rd))
        ? ((this.za = !!b),
          Ud(this, c[1] || "", !0),
          (a = c[2] || ""),
          Vd(this),
          (this.ec = Yd(a)),
          (a = c[3] || ""),
          Vd(this),
          (this.lb = Yd(a, !0)),
          Wd(this, c[4]),
          this.setPath(c[5] || "", !0),
          Xd(this, c[6] || "", !0),
          (a = c[7] || ""),
          Vd(this),
          (this.Tb = Yd(a)))
        : ((this.za = !!b), (this.Ca = new Zd(null, this.za)));
  };
  Td.prototype.toString = function () {
    var a = [],
      b = this.Ab;
    b && a.push($d(b, ae, !0), ":");
    var c = this.lb;
    if (c || "file" == b)
      a.push("//"),
        (b = this.ec) && a.push($d(b, ae, !0), "@"),
        a.push(
          encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")
        ),
        (c = this.xc),
        null != c && a.push(":", String(c));
    if ((c = this.getPath()))
      this.lb && "/" != c.charAt(0) && a.push("/"),
        a.push($d(c, "/" == c.charAt(0) ? be : ce, !0));
    (c = this.Ca.toString()) && a.push("?", c);
    (c = this.Tb) && a.push("#", $d(c, de));
    return a.join("");
  };
  Td.prototype.resolve = function (a) {
    var b = this.clone(),
      c = !!a.Ab;
    c ? Ud(b, a.Ab) : (c = !!a.ec);
    if (c) {
      var d = a.ec;
      Vd(b);
      b.ec = d;
    } else c = !!a.lb;
    c ? ((d = a.lb), Vd(b), (b.lb = d)) : (c = null != a.xc);
    d = a.getPath();
    if (c) Wd(b, a.xc);
    else if ((c = !!a.ob)) {
      if ("/" != d.charAt(0))
        if (this.lb && !this.ob) d = "/" + d;
        else {
          var e = b.getPath().lastIndexOf("/");
          -1 != e && (d = b.getPath().substr(0, e + 1) + d);
        }
      e = d;
      if (".." == e || "." == e) d = "";
      else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
        d = 0 == e.lastIndexOf("/", 0);
        e = e.split("/");
        for (var f = [], g = 0; g < e.length; ) {
          var h = e[g++];
          "." == h
            ? d && g == e.length && f.push("")
            : ".." == h
            ? ((1 < f.length || (1 == f.length && "" != f[0])) && f.pop(),
              d && g == e.length && f.push(""))
            : (f.push(h), (d = !0));
        }
        d = f.join("/");
      } else d = e;
    }
    c ? b.setPath(d) : (c = "" !== a.Ca.toString());
    c ? Xd(b, a.Ca.clone()) : (c = !!a.Tb);
    c && ((a = a.Tb), Vd(b), (b.Tb = a));
    return b;
  };
  Td.prototype.clone = function () {
    return new Td(this);
  };
  var Ud = function (a, b, c) {
      Vd(a);
      a.Ab = c ? Yd(b, !0) : b;
      a.Ab && (a.Ab = a.Ab.replace(/:$/, ""));
    },
    Wd = function (a, b) {
      Vd(a);
      if (b) {
        b = Number(b);
        if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
        a.xc = b;
      } else a.xc = null;
    };
  Td.prototype.getPath = function () {
    return this.ob;
  };
  Td.prototype.setPath = function (a, b) {
    Vd(this);
    this.ob = b ? Yd(a, !0) : a;
    return this;
  };
  var Xd = function (a, b, c) {
    Vd(a);
    b instanceof Zd
      ? ((a.Ca = b), a.Ca.Wf(a.za))
      : (c || (b = $d(b, fe)), (a.Ca = new Zd(b, a.za)));
  };
  Td.prototype.getQuery = function () {
    return this.Ca.toString();
  };
  Td.prototype.removeParameter = function (a) {
    Vd(this);
    this.Ca.remove(a);
    return this;
  };
  var Vd = function (a) {
    if (a.Yj) throw Error("Tried to modify a read-only Uri");
  };
  Td.prototype.Wf = function (a) {
    this.za = a;
    this.Ca && this.Ca.Wf(a);
  };
  var ge = function (a) {
      return a instanceof Td ? a.clone() : new Td(a, void 0);
    },
    Yd = function (a, b) {
      return a
        ? b
          ? decodeURI(a.replace(/%25/g, "%2525"))
          : decodeURIComponent(a)
        : "";
    },
    $d = function (a, b, c) {
      return "string" === typeof a
        ? ((a = encodeURI(a).replace(b, he)),
          c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
          a)
        : null;
    },
    he = function (a) {
      a = a.charCodeAt(0);
      return "%" + ((a >> 4) & 15).toString(16) + (a & 15).toString(16);
    },
    ae = /[#\/\?@]/g,
    ce = /[#\?:]/g,
    be = /[#\?]/g,
    fe = /[#\?@]/g,
    de = /#/g,
    Zd = function (a, b) {
      this.J = this.N = null;
      this.ua = a || null;
      this.za = !!b;
    },
    ie = function (a) {
      a.N ||
        ((a.N = new od()),
        (a.J = 0),
        a.ua &&
          Sd(a.ua, function (b, c) {
            a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
          }));
    };
  k = Zd.prototype;
  k.M = function () {
    ie(this);
    return this.J;
  };
  k.add = function (a, b) {
    ie(this);
    this.ua = null;
    a = je(this, a);
    var c = this.N.get(a);
    c || this.N.set(a, (c = []));
    c.push(b);
    this.J = Pa(this.J) + 1;
    return this;
  };
  k.remove = function (a) {
    ie(this);
    a = je(this, a);
    return this.N.vb(a)
      ? ((this.ua = null),
        (this.J = Pa(this.J) - this.N.get(a).length),
        this.N.remove(a))
      : !1;
  };
  k.clear = function () {
    this.N = this.ua = null;
    this.J = 0;
  };
  k.isEmpty = function () {
    ie(this);
    return 0 == this.J;
  };
  k.vb = function (a) {
    ie(this);
    a = je(this, a);
    return this.N.vb(a);
  };
  k.Oc = function (a) {
    var b = this.T();
    return cb(b, a);
  };
  k.forEach = function (a, b) {
    ie(this);
    this.N.forEach(function (c, d) {
      Va(
        c,
        function (e) {
          a.call(b, e, d, this);
        },
        this
      );
    }, this);
  };
  k.Ka = function () {
    ie(this);
    for (var a = this.N.T(), b = this.N.Ka(), c = [], d = 0; d < b.length; d++)
      for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
    return c;
  };
  k.T = function (a) {
    ie(this);
    var b = [];
    if ("string" === typeof a)
      this.vb(a) && (b = hb(b, this.N.get(je(this, a))));
    else {
      a = this.N.T();
      for (var c = 0; c < a.length; c++) b = hb(b, a[c]);
    }
    return b;
  };
  k.set = function (a, b) {
    ie(this);
    this.ua = null;
    a = je(this, a);
    this.vb(a) && (this.J = Pa(this.J) - this.N.get(a).length);
    this.N.set(a, [b]);
    this.J = Pa(this.J) + 1;
    return this;
  };
  k.get = function (a, b) {
    if (!a) return b;
    a = this.T(a);
    return 0 < a.length ? String(a[0]) : b;
  };
  k.setValues = function (a, b) {
    this.remove(a);
    0 < b.length &&
      ((this.ua = null),
      this.N.set(je(this, a), ib(b)),
      (this.J = Pa(this.J) + b.length));
  };
  k.toString = function () {
    if (this.ua) return this.ua;
    if (!this.N) return "";
    for (var a = [], b = this.N.Ka(), c = 0; c < b.length; c++) {
      var d = b[c],
        e = encodeURIComponent(String(d));
      d = this.T(d);
      for (var f = 0; f < d.length; f++) {
        var g = e;
        "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
        a.push(g);
      }
    }
    return (this.ua = a.join("&"));
  };
  k.clone = function () {
    var a = new Zd();
    a.ua = this.ua;
    this.N && ((a.N = this.N.clone()), (a.J = this.J));
    return a;
  };
  var je = function (a, b) {
    b = String(b);
    a.za && (b = b.toLowerCase());
    return b;
  };
  Zd.prototype.Wf = function (a) {
    a &&
      !this.za &&
      (ie(this),
      (this.ua = null),
      this.N.forEach(function (b, c) {
        var d = c.toLowerCase();
        c != d && (this.remove(c), this.setValues(d, b));
      }, this));
    this.za = a;
  };
  Zd.prototype.extend = function (a) {
    for (var b = 0; b < arguments.length; b++)
      vd(
        arguments[b],
        function (c, d) {
          this.add(d, c);
        },
        this
      );
  };
  function ke(a) {
    if (null != a.o) {
      var b = {},
        c;
      for (c in a.o) void 0 !== a.o[c] && (b[c] = a.o[c]);
      a.o = b;
    }
  }
  function G(a) {
    for (
      var b = {}, c = m(Object.entries(le)), d = c.next();
      !d.done;
      d = c.next()
    ) {
      var e = m(d.value);
      d = e.next().value;
      e = e.next().value;
      d in a && (b[e] = a[d]);
    }
    return b;
  }
  var me = function () {};
  me.prototype.B = function (a, b) {
    a = String(a);
    if (!b.test(a))
      throw Error(
        "parameter [" + a + "] does not match pattern [" + b.toString() + "]"
      );
  };
  function ne(a) {
    var b = a.body instanceof B ? Kd(a.body, Gd, Hd, Id) : a.body;
    return { path: a.path, u: a.u, D: a.D, body: b, o: a.o, fi: a.fi && a.fi };
  }
  function oe(a, b) {
    if (null == a) return null;
    a = a.Ek(b);
    return null == a ? null : a;
  }
  var pe = function (a, b) {
    this.P = a;
    this.Wj = void 0 === b ? null : b;
  };
  q(pe, me);
  var qe = function (a, b, c) {
      var d = oe(a.Wj, b);
      if (null == d) return c;
      d.Fk();
      return c.then(
        function (e) {
          d.Hk(e);
          return e;
        },
        function (e) {
          d.Gk(e);
          throw e;
        }
      );
    },
    H = function (a, b) {
      var c = b.G || void 0;
      return qe(a, b, a.P.send(ne(b), c));
    };
  var re = {
      se: "ADMIN_READ",
      ue: "DATA_READ",
      ve: "DATA_WRITE",
      dj: "LOG_TYPE_UNSPECIFIED",
      values: function () {
        return [re.dj, re.se, re.ve, re.ue];
      },
    },
    se = {
      se: "ADMIN_READ",
      vi: "ADMIN_WRITE",
      ue: "DATA_READ",
      ve: "DATA_WRITE",
      lj: "PERMISSION_TYPE_UNSPECIFIED",
      values: function () {
        return [se.lj, se.se, se.vi, se.ue, se.ve];
      },
    },
    te = {
      Di: "CAPABILITY_GROUP_UNSPECIFIED",
      Ei: "CLOUD_ALPHA",
      Ni: "EXTERNAL",
      Xi: "INTERNAL",
      $i: "LIMITED",
      mj: "PREAUTHORIZED",
      oj: "PREVIEW",
      Ic: "PUBLIC",
      values: function () {
        return [te.Di, te.Ic, te.Xi, te.Ni, te.$i, te.mj, te.oj, te.Ei];
      },
    },
    ue = {
      ui: "ADMIN_ACTIVITY",
      Hi: "DATA_ACCESS",
      Bj: "UNSPECIFIED_LOG_NAME",
      values: function () {
        return [ue.Bj, ue.ui, ue.Hi];
      },
    },
    ve = {
      we: "DEFAULT_OBJECT_ACL",
      Ic: "PUBLIC",
      He: "TILE_PERMISSIONS_UNSPECIFIED",
      values: function () {
        return [ve.He, ve.Ic, ve.we];
      },
    },
    we = {
      yi: "APPROVER",
      zi: "ATTRIBUTION",
      Ai: "AUTHORITY",
      Fi: "CREDENTIALS_TYPE",
      Gi: "CREDS_ASSERTION",
      Zi: "JUSTIFICATION_TYPE",
      De: "NO_ATTR",
      rj: "SECURITY_REALM",
      values: function () {
        return [we.De, we.Ai, we.zi, we.rj, we.yi, we.Zi, we.Fi, we.Gi];
      },
    },
    xe = {
      Li: "DISCHARGED",
      Mi: "EQUALS",
      Ti: "IN",
      fj: "NOT_EQUALS",
      gj: "NOT_IN",
      ij: "NO_OP",
      values: function () {
        return [xe.ij, xe.Mi, xe.fj, xe.Ti, xe.gj, xe.Li];
      },
    },
    ye = {
      Yi: "IP",
      ej: "NAME",
      De: "NO_ATTR",
      pj: "REGION",
      sj: "SERVICE",
      values: function () {
        return [ye.De, ye.pj, ye.sj, ye.ej, ye.Yi];
      },
    },
    ze = {
      bj: "LOG_FAIL_CLOSED",
      cj: "LOG_MODE_UNSPECIFIED",
      values: function () {
        return [ze.cj, ze.bj];
      },
    },
    Ae = {
      Pi: "FOLDER",
      Ri: "IMAGE",
      Si: "IMAGE_COLLECTION",
      wj: "TABLE",
      xj: "TYPE_UNSPECIFIED",
      values: function () {
        return [Ae.xj, Ae.Ri, Ae.Si, Ae.wj, Ae.Pi];
      },
    },
    Be = {
      Eb: "AUTO_JPEG_PNG",
      Fb: "GEO_TIFF",
      Gb: "IMAGE_FILE_FORMAT_UNSPECIFIED",
      Hb: "JPEG",
      Ib: "MULTI_BAND_IMAGE_TILE",
      Jb: "NPY",
      Kb: "PNG",
      Lb: "TF_RECORD_IMAGE",
      Mb: "ZIPPED_GEO_TIFF",
      Nb: "ZIPPED_GEO_TIFF_PER_BAND",
      values: function () {
        return [
          Be.Gb,
          Be.Hb,
          Be.Kb,
          Be.Eb,
          Be.Jb,
          Be.Fb,
          Be.Lb,
          Be.Ib,
          Be.Mb,
          Be.Nb,
        ];
      },
    },
    Ce = {
      Cj: "V1",
      Dj: "V2",
      Ej: "VERSION_UNSPECIFIED",
      values: function () {
        return [Ce.Ej, Ce.Cj, Ce.Dj];
      },
    },
    De = {
      Eb: "AUTO_JPEG_PNG",
      Fb: "GEO_TIFF",
      Gb: "IMAGE_FILE_FORMAT_UNSPECIFIED",
      Hb: "JPEG",
      Ib: "MULTI_BAND_IMAGE_TILE",
      Jb: "NPY",
      Kb: "PNG",
      Lb: "TF_RECORD_IMAGE",
      Mb: "ZIPPED_GEO_TIFF",
      Nb: "ZIPPED_GEO_TIFF_PER_BAND",
      values: function () {
        return [
          De.Gb,
          De.Hb,
          De.Kb,
          De.Eb,
          De.Jb,
          De.Fb,
          De.Lb,
          De.Ib,
          De.Mb,
          De.Nb,
        ];
      },
    },
    Ee = {
      Qi: "HORIZONTAL",
      jj: "ORIENTATION_UNSPECIFIED",
      Fj: "VERTICAL",
      values: function () {
        return [Ee.jj, Ee.Qi, Ee.Fj];
      },
    },
    Fe = {
      we: "DEFAULT_OBJECT_ACL",
      Ic: "PUBLIC",
      He: "TILE_PERMISSIONS_UNSPECIFIED",
      values: function () {
        return [Fe.He, Fe.Ic, Fe.we];
      },
    },
    Ge = {
      MAX: "MAX",
      cb: "MEAN",
      MIN: "MIN",
      eb: "MODE",
      fb: "PYRAMIDING_POLICY_UNSPECIFIED",
      gb: "SAMPLE",
      values: function () {
        return [Ge.fb, Ge.cb, Ge.gb, Ge.MIN, Ge.MAX, Ge.eb];
      },
    },
    He = {
      MAX: "MAX",
      cb: "MEAN",
      MIN: "MIN",
      eb: "MODE",
      fb: "PYRAMIDING_POLICY_UNSPECIFIED",
      gb: "SAMPLE",
      values: function () {
        return [He.fb, He.cb, He.gb, He.MIN, He.MAX, He.eb];
      },
    },
    Ie = {
      MAX: "MAX",
      cb: "MEAN",
      MIN: "MIN",
      eb: "MODE",
      fb: "PYRAMIDING_POLICY_UNSPECIFIED",
      gb: "SAMPLE",
      values: function () {
        return [Ie.fb, Ie.cb, Ie.gb, Ie.MIN, Ie.MAX, Ie.eb];
      },
    },
    Je = {
      Eb: "AUTO_JPEG_PNG",
      Fb: "GEO_TIFF",
      Gb: "IMAGE_FILE_FORMAT_UNSPECIFIED",
      Hb: "JPEG",
      Ib: "MULTI_BAND_IMAGE_TILE",
      Jb: "NPY",
      Kb: "PNG",
      Lb: "TF_RECORD_IMAGE",
      Mb: "ZIPPED_GEO_TIFF",
      Nb: "ZIPPED_GEO_TIFF_PER_BAND",
      values: function () {
        return [
          Je.Gb,
          Je.Hb,
          Je.Kb,
          Je.Eb,
          Je.Jb,
          Je.Fb,
          Je.Lb,
          Je.Ib,
          Je.Mb,
          Je.Nb,
        ];
      },
    },
    Ke = {
      MAX: "MAX",
      cb: "MEAN",
      MIN: "MIN",
      eb: "MODE",
      fb: "PYRAMIDING_POLICY_UNSPECIFIED",
      gb: "SAMPLE",
      values: function () {
        return [Ke.fb, Ke.cb, Ke.gb, Ke.MIN, Ke.MAX, Ke.eb];
      },
    },
    Le = {
      Bi: "CANCELLED",
      Ci: "CANCELLING",
      Oi: "FAILED",
      kj: "PENDING",
      qj: "RUNNING",
      tj: "STATE_UNSPECIFIED",
      vj: "SUCCEEDED",
      values: function () {
        return [Le.tj, Le.kj, Le.qj, Le.Ci, Le.vj, Le.Bi, Le.Oi];
      },
    },
    Me = {
      xe: "DOUBLE",
      FLOAT: "FLOAT",
      INT: "INT",
      nj: "PRECISION_UNSPECIFIED",
      values: function () {
        return [Me.nj, Me.INT, Me.FLOAT, Me.xe];
      },
    },
    Ne = {
      wi: "ALLOW",
      xi: "ALLOW_WITH_LOG",
      Ji: "DENY",
      Ki: "DENY_WITH_LOG",
      aj: "LOG",
      hj: "NO_ACTION",
      values: function () {
        return [Ne.hj, Ne.wi, Ne.xi, Ne.Ji, Ne.Ki, Ne.aj];
      },
    },
    Oe = {
      te: "CSV",
      ye: "GEO_JSON",
      Ae: "KML",
      Be: "KMZ",
      Ee: "SHP",
      Fe: "TABLE_FILE_FORMAT_UNSPECIFIED",
      Ge: "TF_RECORD_TABLE",
      values: function () {
        return [Oe.Fe, Oe.te, Oe.ye, Oe.Ae, Oe.Be, Oe.Ee, Oe.Ge];
      },
    },
    Pe = {
      te: "CSV",
      ye: "GEO_JSON",
      Ae: "KML",
      Be: "KMZ",
      Ee: "SHP",
      Fe: "TABLE_FILE_FORMAT_UNSPECIFIED",
      Ge: "TF_RECORD_TABLE",
      values: function () {
        return [Pe.Fe, Pe.te, Pe.ye, Pe.Ae, Pe.Be, Pe.Ee, Pe.Ge];
      },
    },
    Qe = {
      Eb: "AUTO_JPEG_PNG",
      Fb: "GEO_TIFF",
      Gb: "IMAGE_FILE_FORMAT_UNSPECIFIED",
      Hb: "JPEG",
      Ib: "MULTI_BAND_IMAGE_TILE",
      Jb: "NPY",
      Kb: "PNG",
      Lb: "TF_RECORD_IMAGE",
      Mb: "ZIPPED_GEO_TIFF",
      Nb: "ZIPPED_GEO_TIFF_PER_BAND",
      values: function () {
        return [
          Qe.Gb,
          Qe.Hb,
          Qe.Kb,
          Qe.Eb,
          Qe.Jb,
          Qe.Fb,
          Qe.Lb,
          Qe.Ib,
          Qe.Mb,
          Qe.Nb,
        ];
      },
    },
    Re = {
      MAX: "MAX",
      cb: "MEAN",
      MIN: "MIN",
      eb: "MODE",
      fb: "PYRAMIDING_POLICY_UNSPECIFIED",
      gb: "SAMPLE",
      values: function () {
        return [Re.fb, Re.cb, Re.gb, Re.MIN, Re.MAX, Re.eb];
      },
    },
    Se = {
      Ii: "DATA_TYPE_UNSPECIFIED",
      xe: "DOUBLE",
      FLOAT: "FLOAT",
      Ui: "INT16",
      Vi: "INT32",
      Wi: "INT8",
      yj: "UINT16",
      zj: "UINT32",
      Aj: "UINT8",
      values: function () {
        return [
          Se.Ii,
          Se.Wi,
          Se.Aj,
          Se.Ui,
          Se.yj,
          Se.Vi,
          Se.zj,
          Se.FLOAT,
          Se.xe,
        ];
      },
    },
    Te = {
      ze: "GIF",
      Ce: "MP4",
      Ie: "VIDEO_FILE_FORMAT_UNSPECIFIED",
      Je: "VP9",
      values: function () {
        return [Te.Ie, Te.Ce, Te.ze, Te.Je];
      },
    },
    Ue = {
      ze: "GIF",
      Ce: "MP4",
      Ie: "VIDEO_FILE_FORMAT_UNSPECIFIED",
      Je: "VP9",
      values: function () {
        return [Ue.Ie, Ue.Ce, Ue.ze, Ue.Je];
      },
    },
    Ve = function (a) {
      a = void 0 === a ? {} : a;
      this.a = {};
      this.a.scaleX = null == a.Sf ? null : a.Sf;
      this.a.shearX = null == a.Xf ? null : a.Xf;
      this.a.translateX = null == a.jg ? null : a.jg;
      this.a.shearY = null == a.Yf ? null : a.Yf;
      this.a.scaleY = null == a.Tf ? null : a.Tf;
      this.a.translateY = null == a.kg ? null : a.kg;
    };
  q(Ve, B);
  Ve.prototype.f = function () {
    return {
      keys: "scaleX scaleY shearX shearY translateX translateY".split(" "),
    };
  };
  l.Object.defineProperties(Ve.prototype, {
    Sf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "scaleX") ? E(this, "scaleX") : null;
      },
      set: function (a) {
        this.a.scaleX = a;
      },
    },
    Tf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "scaleY") ? E(this, "scaleY") : null;
      },
      set: function (a) {
        this.a.scaleY = a;
      },
    },
    Xf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "shearX") ? E(this, "shearX") : null;
      },
      set: function (a) {
        this.a.shearX = a;
      },
    },
    Yf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "shearY") ? E(this, "shearY") : null;
      },
      set: function (a) {
        this.a.shearY = a;
      },
    },
    jg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "translateX") ? E(this, "translateX") : null;
      },
      set: function (a) {
        this.a.translateX = a;
      },
    },
    kg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "translateY") ? E(this, "translateY") : null;
      },
      set: function (a) {
        this.a.translateY = a;
      },
    },
  });
  var We = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.description = null == a.description ? null : a.description;
    this.a.returnType = null == a.Rf ? null : a.Rf;
    this.a.arguments = null == a.arguments ? null : a.arguments;
    this.a.deprecated = null == a.deprecated ? null : a.deprecated;
    this.a.deprecationReason = null == a.$e ? null : a.$e;
    this.a.hidden = null == a.hidden ? null : a.hidden;
    this.a.preview = null == a.preview ? null : a.preview;
    this.a.sourceCodeUri = null == a.sourceCodeUri ? null : a.sourceCodeUri;
  };
  q(We, B);
  We.prototype.f = function () {
    return {
      R: { arguments: Xe },
      keys: "arguments deprecated deprecationReason description hidden name preview returnType sourceCodeUri".split(
        " "
      ),
    };
  };
  l.Object.defineProperties(We.prototype, {
    arguments: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "arguments") ? E(this, "arguments") : null;
      },
      set: function (a) {
        this.a.arguments = a;
      },
    },
    deprecated: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "deprecated") ? E(this, "deprecated") : null;
      },
      set: function (a) {
        this.a.deprecated = a;
      },
    },
    $e: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "deprecationReason")
          ? E(this, "deprecationReason")
          : null;
      },
      set: function (a) {
        this.a.deprecationReason = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    hidden: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "hidden") ? E(this, "hidden") : null;
      },
      set: function (a) {
        this.a.hidden = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    preview: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "preview") ? E(this, "preview") : null;
      },
      set: function (a) {
        this.a.preview = a;
      },
    },
    Rf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "returnType") ? E(this, "returnType") : null;
      },
      set: function (a) {
        this.a.returnType = a;
      },
    },
    sourceCodeUri: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sourceCodeUri") ? E(this, "sourceCodeUri") : null;
      },
      set: function (a) {
        this.a.sourceCodeUri = a;
      },
    },
  });
  var Xe = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.argumentName = null == a.yd ? null : a.yd;
    this.a.type = null == a.type ? null : a.type;
    this.a.description = null == a.description ? null : a.description;
    this.a.optional = null == a.optional ? null : a.optional;
    this.a.defaultValue = null == a.defaultValue ? null : a.defaultValue;
  };
  q(Xe, B);
  Xe.prototype.f = function () {
    return {
      keys: ["argumentName", "defaultValue", "description", "optional", "type"],
    };
  };
  l.Object.defineProperties(Xe.prototype, {
    yd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "argumentName") ? E(this, "argumentName") : null;
      },
      set: function (a) {
        this.a.argumentName = a;
      },
    },
    defaultValue: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "defaultValue") ? E(this, "defaultValue") : null;
      },
      set: function (a) {
        this.a.defaultValue = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    optional: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "optional") ? E(this, "optional") : null;
      },
      set: function (a) {
        this.a.optional = a;
      },
    },
    type: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "type") ? E(this, "type") : null;
      },
      set: function (a) {
        this.a.type = a;
      },
    },
  });
  var Ye = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.values = null == a.values ? null : a.values;
  };
  q(Ye, B);
  Ye.prototype.f = function () {
    return { R: { values: Ze }, keys: ["values"] };
  };
  l.Object.defineProperties(Ye.prototype, {
    values: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "values") ? E(this, "values") : null;
      },
      set: function (a) {
        this.a.values = a;
      },
    },
  });
  var $e = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.service = null == a.$h ? null : a.$h;
    this.a.exemptedMembers = null == a.Sc ? null : a.Sc;
    this.a.auditLogConfigs = null == a.sg ? null : a.sg;
  };
  q($e, B);
  $e.prototype.f = function () {
    return {
      R: { auditLogConfigs: af },
      keys: ["auditLogConfigs", "exemptedMembers", "service"],
    };
  };
  l.Object.defineProperties($e.prototype, {
    sg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "auditLogConfigs") ? E(this, "auditLogConfigs") : null;
      },
      set: function (a) {
        this.a.auditLogConfigs = a;
      },
    },
    Sc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "exemptedMembers") ? E(this, "exemptedMembers") : null;
      },
      set: function (a) {
        this.a.exemptedMembers = a;
      },
    },
    $h: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "service") ? E(this, "service") : null;
      },
      set: function (a) {
        this.a.service = a;
      },
    },
  });
  var af = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.logType = null == a.Dh ? null : a.Dh;
    this.a.exemptedMembers = null == a.Sc ? null : a.Sc;
    this.a.ignoreChildExemptions = null == a.qh ? null : a.qh;
  };
  q(af, B);
  af.prototype.f = function () {
    return {
      K: { logType: re },
      keys: ["exemptedMembers", "ignoreChildExemptions", "logType"],
    };
  };
  l.Object.defineProperties(af.prototype, {
    Sc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "exemptedMembers") ? E(this, "exemptedMembers") : null;
      },
      set: function (a) {
        this.a.exemptedMembers = a;
      },
    },
    qh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "ignoreChildExemptions")
          ? E(this, "ignoreChildExemptions")
          : null;
      },
      set: function (a) {
        this.a.ignoreChildExemptions = a;
      },
    },
    Dh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "logType") ? E(this, "logType") : null;
      },
      set: function (a) {
        this.a.logType = a;
      },
    },
  });
  var bf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.permissionType = null == a.Oh ? null : a.Oh;
  };
  q(bf, B);
  bf.prototype.f = function () {
    return { K: { permissionType: se }, keys: ["permissionType"] };
  };
  l.Object.defineProperties(bf.prototype, {
    Oh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "permissionType") ? E(this, "permissionType") : null;
      },
      set: function (a) {
        this.a.permissionType = a;
      },
    },
  });
  var cf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.role = null == a.Bc ? null : a.Bc;
    this.a.members = null == a.Yb ? null : a.Yb;
    this.a.condition = null == a.Gg ? null : a.Gg;
    this.a.bindingId = null == a.vg ? null : a.vg;
  };
  q(cf, B);
  cf.prototype.f = function () {
    return {
      keys: ["bindingId", "condition", "members", "role"],
      s: { condition: df },
    };
  };
  l.Object.defineProperties(cf.prototype, {
    vg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bindingId") ? E(this, "bindingId") : null;
      },
      set: function (a) {
        this.a.bindingId = a;
      },
    },
    Gg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "condition") ? E(this, "condition") : null;
      },
      set: function (a) {
        this.a.condition = a;
      },
    },
    Yb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "members") ? E(this, "members") : null;
      },
      set: function (a) {
        this.a.members = a;
      },
    },
    Bc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "role") ? E(this, "role") : null;
      },
      set: function (a) {
        this.a.role = a;
      },
    },
  });
  var ef = function () {
    this.a = {};
  };
  q(ef, B);
  ef.prototype.f = function () {
    return { keys: [] };
  };
  var ff = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.capabilities = null == a.Cg ? null : a.Cg;
  };
  q(ff, B);
  ff.prototype.f = function () {
    return { K: { capabilities: te }, keys: ["capabilities"] };
  };
  l.Object.defineProperties(ff.prototype, {
    Cg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "capabilities") ? E(this, "capabilities") : null;
      },
      set: function (a) {
        this.a.capabilities = a;
      },
    },
  });
  var gf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.logName = null == a.Ch ? null : a.Ch;
    this.a.authorizationLoggingOptions = null == a.tg ? null : a.tg;
  };
  q(gf, B);
  gf.prototype.f = function () {
    return {
      K: { logName: ue },
      keys: ["authorizationLoggingOptions", "logName"],
      s: { authorizationLoggingOptions: bf },
    };
  };
  l.Object.defineProperties(gf.prototype, {
    tg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "authorizationLoggingOptions")
          ? E(this, "authorizationLoggingOptions")
          : null;
      },
      set: function (a) {
        this.a.authorizationLoggingOptions = a;
      },
    },
    Ch: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "logName") ? E(this, "logName") : null;
      },
      set: function (a) {
        this.a.logName = a;
      },
    },
  });
  var hf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.bucket = null == a.lc ? null : a.lc;
    this.a.filenamePrefix = null == a.fa ? null : a.fa;
    this.a.permissions = null == a.permissions ? null : a.permissions;
    this.a.bucketCorsUris = null == a.mc ? null : a.mc;
  };
  q(hf, B);
  hf.prototype.f = function () {
    return {
      K: { permissions: ve },
      keys: ["bucket", "bucketCorsUris", "filenamePrefix", "permissions"],
    };
  };
  l.Object.defineProperties(hf.prototype, {
    lc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bucket") ? E(this, "bucket") : null;
      },
      set: function (a) {
        this.a.bucket = a;
      },
    },
    mc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bucketCorsUris") ? E(this, "bucketCorsUris") : null;
      },
      set: function (a) {
        this.a.bucketCorsUris = a;
      },
    },
    fa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "filenamePrefix") ? E(this, "filenamePrefix") : null;
      },
      set: function (a) {
        this.a.filenamePrefix = a;
      },
    },
    permissions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "permissions") ? E(this, "permissions") : null;
      },
      set: function (a) {
        this.a.permissions = a;
      },
    },
  });
  l.Object.defineProperties(hf, {
    Permissions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return ve;
      },
    },
  });
  var jf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.uris = null == a.wa ? null : a.wa;
  };
  q(jf, B);
  jf.prototype.f = function () {
    return { keys: ["uris"] };
  };
  l.Object.defineProperties(jf.prototype, {
    wa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uris") ? E(this, "uris") : null;
      },
      set: function (a) {
        this.a.uris = a;
      },
    },
  });
  var kf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.expression = null == a.i ? null : a.i;
  };
  q(kf, B);
  kf.prototype.f = function () {
    return { keys: ["expression"], s: { expression: lf } };
  };
  l.Object.defineProperties(kf.prototype, {
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
  });
  var mf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.result = null == a.result ? null : a.result;
  };
  q(mf, B);
  mf.prototype.f = function () {
    return { keys: ["result"] };
  };
  l.Object.defineProperties(mf.prototype, {
    result: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "result") ? E(this, "result") : null;
      },
      set: function (a) {
        this.a.result = a;
      },
    },
  });
  var nf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.iam = null == a.mh ? null : a.mh;
    this.a.sys = null == a.ji ? null : a.ji;
    this.a.svc = null == a.ii ? null : a.ii;
    this.a.op = null == a.Mh ? null : a.Mh;
    this.a.values = null == a.values ? null : a.values;
  };
  q(nf, B);
  nf.prototype.f = function () {
    return {
      K: { iam: we, op: xe, sys: ye },
      keys: ["iam", "op", "svc", "sys", "values"],
    };
  };
  l.Object.defineProperties(nf.prototype, {
    mh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "iam") ? E(this, "iam") : null;
      },
      set: function (a) {
        this.a.iam = a;
      },
    },
    Mh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "op") ? E(this, "op") : null;
      },
      set: function (a) {
        this.a.op = a;
      },
    },
    ii: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "svc") ? E(this, "svc") : null;
      },
      set: function (a) {
        this.a.svc = a;
      },
    },
    ji: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sys") ? E(this, "sys") : null;
      },
      set: function (a) {
        this.a.sys = a;
      },
    },
    values: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "values") ? E(this, "values") : null;
      },
      set: function (a) {
        this.a.values = a;
      },
    },
  });
  var of = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.destinationName = null == a.Rb ? null : a.Rb;
    this.a.overwrite = null == a.overwrite ? null : a.overwrite;
    this.a.bandIds = null == a.da ? null : a.da;
  };
  q(of, B);
  of.prototype.f = function () {
    return { keys: ["bandIds", "destinationName", "overwrite"] };
  };
  l.Object.defineProperties(of.prototype, {
    da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bandIds") ? E(this, "bandIds") : null;
      },
      set: function (a) {
        this.a.bandIds = a;
      },
    },
    Rb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "destinationName") ? E(this, "destinationName") : null;
      },
      set: function (a) {
        this.a.destinationName = a;
      },
    },
    overwrite: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "overwrite") ? E(this, "overwrite") : null;
      },
      set: function (a) {
        this.a.overwrite = a;
      },
    },
  });
  var pf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.metric = null == a.Fh ? null : a.Fh;
    this.a.field = null == a.Xg ? null : a.Xg;
    this.a.customFields = null == a.Og ? null : a.Og;
  };
  q(pf, B);
  pf.prototype.f = function () {
    return {
      R: { customFields: qf },
      keys: ["customFields", "field", "metric"],
    };
  };
  l.Object.defineProperties(pf.prototype, {
    Og: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "customFields") ? E(this, "customFields") : null;
      },
      set: function (a) {
        this.a.customFields = a;
      },
    },
    Xg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "field") ? E(this, "field") : null;
      },
      set: function (a) {
        this.a.field = a;
      },
    },
    Fh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "metric") ? E(this, "metric") : null;
      },
      set: function (a) {
        this.a.metric = a;
      },
    },
  });
  var qf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.value = null == a.value ? null : a.value;
  };
  q(qf, B);
  qf.prototype.f = function () {
    return { keys: ["name", "value"] };
  };
  l.Object.defineProperties(qf.prototype, {
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    value: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "value") ? E(this, "value") : null;
      },
      set: function (a) {
        this.a.value = a;
      },
    },
  });
  var rf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.logMode = null == a.Bh ? null : a.Bh;
  };
  q(rf, B);
  rf.prototype.f = function () {
    return { K: { logMode: ze }, keys: ["logMode"] };
  };
  l.Object.defineProperties(rf.prototype, {
    Bh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "logMode") ? E(this, "logMode") : null;
      },
      set: function (a) {
        this.a.logMode = a;
      },
    },
  });
  var sf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.values = null == a.values ? null : a.values;
  };
  q(sf, B);
  sf.prototype.f = function () {
    return {
      keys: ["values"],
      Ba: { values: { ia: Ze, oa: !1, pa: !0, qa: !1 } },
    };
  };
  l.Object.defineProperties(sf.prototype, {
    values: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "values") ? E(this, "values") : null;
      },
      set: function (a) {
        this.a.values = a;
      },
    },
  });
  var tf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.min = null == a.min ? null : a.min;
    this.a.max = null == a.max ? null : a.max;
  };
  q(tf, B);
  tf.prototype.f = function () {
    return { keys: ["max", "min"] };
  };
  l.Object.defineProperties(tf.prototype, {
    max: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "max") ? E(this, "max") : null;
      },
      set: function (a) {
        this.a.max = a;
      },
    },
    min: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "min") ? E(this, "min") : null;
      },
      set: function (a) {
        this.a.min = a;
      },
    },
  });
  var uf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.folder = null == a.jf ? null : a.jf;
    this.a.filenamePrefix = null == a.fa ? null : a.fa;
  };
  q(uf, B);
  uf.prototype.f = function () {
    return { keys: ["filenamePrefix", "folder"] };
  };
  l.Object.defineProperties(uf.prototype, {
    fa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "filenamePrefix") ? E(this, "filenamePrefix") : null;
      },
      set: function (a) {
        this.a.filenamePrefix = a;
      },
    },
    jf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "folder") ? E(this, "folder") : null;
      },
      set: function (a) {
        this.a.folder = a;
      },
    },
  });
  var vf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.tilestoreLocation = null == a.ni ? null : a.ni;
    this.a.cloudStorageLocation = null == a.Fg ? null : a.Fg;
    this.a.tilestoreEntry = null == a.mi ? null : a.mi;
    this.a.gcsLocation = null == a.fh ? null : a.fh;
    this.a.type = null == a.type ? null : a.type;
    this.a.name = null == a.name ? null : a.name;
    this.a.id = null == a.id ? null : a.id;
    this.a.updateTime = null == a.Oa ? null : a.Oa;
    this.a.title = null == a.title ? null : a.title;
    this.a.description = null == a.description ? null : a.description;
    this.a.properties = null == a.properties ? null : a.properties;
    this.a.startTime = null == a.startTime ? null : a.startTime;
    this.a.endTime = null == a.endTime ? null : a.endTime;
    this.a.geometry = null == a.geometry ? null : a.geometry;
    this.a.bands = null == a.bands ? null : a.bands;
    this.a.sizeBytes = null == a.Da ? null : a.Da;
    this.a.quota = null == a.quota ? null : a.quota;
    this.a.expression = null == a.i ? null : a.i;
  };
  q(vf, B);
  vf.prototype.f = function () {
    return {
      R: { bands: wf },
      K: { type: Ae },
      keys: "bands cloudStorageLocation description endTime expression gcsLocation geometry id name properties quota sizeBytes startTime tilestoreEntry tilestoreLocation title type updateTime".split(
        " "
      ),
      Ba: {
        geometry: { ia: null, oa: !1, pa: !1, qa: !1 },
        properties: { ia: null, oa: !1, pa: !1, qa: !1 },
      },
      s: {
        cloudStorageLocation: jf,
        expression: lf,
        gcsLocation: xf,
        quota: yf,
        tilestoreEntry: zf,
        tilestoreLocation: Af,
      },
    };
  };
  l.Object.defineProperties(vf.prototype, {
    bands: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bands") ? E(this, "bands") : null;
      },
      set: function (a) {
        this.a.bands = a;
      },
    },
    Fg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudStorageLocation")
          ? E(this, "cloudStorageLocation")
          : null;
      },
      set: function (a) {
        this.a.cloudStorageLocation = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    endTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endTime") ? E(this, "endTime") : null;
      },
      set: function (a) {
        this.a.endTime = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    fh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "gcsLocation") ? E(this, "gcsLocation") : null;
      },
      set: function (a) {
        this.a.gcsLocation = a;
      },
    },
    geometry: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "geometry") ? E(this, "geometry") : null;
      },
      set: function (a) {
        this.a.geometry = a;
      },
    },
    id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "id") ? E(this, "id") : null;
      },
      set: function (a) {
        this.a.id = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    properties: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "properties") ? E(this, "properties") : null;
      },
      set: function (a) {
        this.a.properties = a;
      },
    },
    quota: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "quota") ? E(this, "quota") : null;
      },
      set: function (a) {
        this.a.quota = a;
      },
    },
    Da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sizeBytes") ? E(this, "sizeBytes") : null;
      },
      set: function (a) {
        this.a.sizeBytes = a;
      },
    },
    startTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startTime") ? E(this, "startTime") : null;
      },
      set: function (a) {
        this.a.startTime = a;
      },
    },
    mi: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilestoreEntry") ? E(this, "tilestoreEntry") : null;
      },
      set: function (a) {
        this.a.tilestoreEntry = a;
      },
    },
    ni: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilestoreLocation")
          ? E(this, "tilestoreLocation")
          : null;
      },
      set: function (a) {
        this.a.tilestoreLocation = a;
      },
    },
    title: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "title") ? E(this, "title") : null;
      },
      set: function (a) {
        this.a.title = a;
      },
    },
    type: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "type") ? E(this, "type") : null;
      },
      set: function (a) {
        this.a.type = a;
      },
    },
    Oa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "updateTime") ? E(this, "updateTime") : null;
      },
      set: function (a) {
        this.a.updateTime = a;
      },
    },
  });
  var Bf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
  };
  q(Bf, B);
  Bf.prototype.f = function () {
    return { keys: ["name"] };
  };
  l.Object.defineProperties(Bf.prototype, {
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
  });
  var Cf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.expression = null == a.i ? null : a.i;
    this.a.fileFormat = null == a.C ? null : a.C;
    this.a.bandIds = null == a.da ? null : a.da;
    this.a.visualizationOptions = null == a.fc ? null : a.fc;
  };
  q(Cf, B);
  Cf.prototype.f = function () {
    return {
      K: { fileFormat: Be },
      keys: [
        "bandIds",
        "expression",
        "fileFormat",
        "name",
        "visualizationOptions",
      ],
      s: { expression: lf, visualizationOptions: Df },
    };
  };
  l.Object.defineProperties(Cf.prototype, {
    da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bandIds") ? E(this, "bandIds") : null;
      },
      set: function (a) {
        this.a.bandIds = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    fc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "visualizationOptions")
          ? E(this, "visualizationOptions")
          : null;
      },
      set: function (a) {
        this.a.visualizationOptions = a;
      },
    },
  });
  var Ef = function () {
    this.a = {};
  };
  q(Ef, B);
  Ef.prototype.f = function () {
    return { keys: [] };
  };
  var Ff = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.fileExportOptions = null == a.la ? null : a.la;
    this.a.assetExportOptions = null == a.ib ? null : a.ib;
    this.a.expression = null == a.i ? null : a.i;
    this.a.description = null == a.description ? null : a.description;
    this.a.maxPixels = null == a.Ef ? null : a.Ef;
    this.a.grid = null == a.L ? null : a.L;
    this.a.requestId = null == a.requestId ? null : a.requestId;
    this.a.maxWorkers = null == a.sa ? null : a.sa;
    this.a.maxWorkerCount = null == a.W ? null : a.W;
  };
  q(Ff, B);
  Ff.prototype.f = function () {
    return {
      keys: "assetExportOptions description expression fileExportOptions grid maxPixels maxWorkerCount maxWorkers requestId".split(
        " "
      ),
      s: {
        assetExportOptions: Gf,
        expression: lf,
        fileExportOptions: Hf,
        grid: If,
      },
    };
  };
  l.Object.defineProperties(Ff.prototype, {
    ib: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "assetExportOptions")
          ? E(this, "assetExportOptions")
          : null;
      },
      set: function (a) {
        this.a.assetExportOptions = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    la: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileExportOptions")
          ? E(this, "fileExportOptions")
          : null;
      },
      set: function (a) {
        this.a.fileExportOptions = a;
      },
    },
    L: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "grid") ? E(this, "grid") : null;
      },
      set: function (a) {
        this.a.grid = a;
      },
    },
    Ef: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxPixels") ? E(this, "maxPixels") : null;
      },
      set: function (a) {
        this.a.maxPixels = a;
      },
    },
    W: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkerCount") ? E(this, "maxWorkerCount") : null;
      },
      set: function (a) {
        this.a.maxWorkerCount = a;
      },
    },
    sa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkers") ? E(this, "maxWorkers") : null;
      },
      set: function (a) {
        this.a.maxWorkers = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
  });
  var Jf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.expression = null == a.i ? null : a.i;
    this.a.description = null == a.description ? null : a.description;
    this.a.tileOptions = null == a.dc ? null : a.dc;
    this.a.tileExportOptions = null == a.cc ? null : a.cc;
    this.a.requestId = null == a.requestId ? null : a.requestId;
    this.a.maxWorkers = null == a.sa ? null : a.sa;
    this.a.maxWorkerCount = null == a.W ? null : a.W;
  };
  q(Jf, B);
  Jf.prototype.f = function () {
    return {
      keys: "description expression maxWorkerCount maxWorkers requestId tileExportOptions tileOptions".split(
        " "
      ),
      s: { expression: lf, tileExportOptions: Hf, tileOptions: Kf },
    };
  };
  l.Object.defineProperties(Jf.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    W: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkerCount") ? E(this, "maxWorkerCount") : null;
      },
      set: function (a) {
        this.a.maxWorkerCount = a;
      },
    },
    sa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkers") ? E(this, "maxWorkers") : null;
      },
      set: function (a) {
        this.a.maxWorkers = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
    cc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileExportOptions")
          ? E(this, "tileExportOptions")
          : null;
      },
      set: function (a) {
        this.a.tileExportOptions = a;
      },
    },
    dc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileOptions") ? E(this, "tileOptions") : null;
      },
      set: function (a) {
        this.a.tileOptions = a;
      },
    },
  });
  var Lf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.fileExportOptions = null == a.la ? null : a.la;
    this.a.assetExportOptions = null == a.ib ? null : a.ib;
    this.a.expression = null == a.i ? null : a.i;
    this.a.description = null == a.description ? null : a.description;
    this.a.selectors = null == a.selectors ? null : a.selectors;
    this.a.requestId = null == a.requestId ? null : a.requestId;
    this.a.maxErrorMeters = null == a.Wb ? null : a.Wb;
    this.a.maxWorkers = null == a.sa ? null : a.sa;
    this.a.maxWorkerCount = null == a.W ? null : a.W;
    this.a.maxVertices = null == a.maxVertices ? null : a.maxVertices;
  };
  q(Lf, B);
  Lf.prototype.f = function () {
    return {
      keys: "assetExportOptions description expression fileExportOptions maxErrorMeters maxVertices maxWorkerCount maxWorkers requestId selectors".split(
        " "
      ),
      s: { assetExportOptions: Mf, expression: lf, fileExportOptions: Nf },
    };
  };
  l.Object.defineProperties(Lf.prototype, {
    ib: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "assetExportOptions")
          ? E(this, "assetExportOptions")
          : null;
      },
      set: function (a) {
        this.a.assetExportOptions = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    la: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileExportOptions")
          ? E(this, "fileExportOptions")
          : null;
      },
      set: function (a) {
        this.a.fileExportOptions = a;
      },
    },
    Wb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxErrorMeters") ? E(this, "maxErrorMeters") : null;
      },
      set: function (a) {
        this.a.maxErrorMeters = a;
      },
    },
    maxVertices: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxVertices") ? E(this, "maxVertices") : null;
      },
      set: function (a) {
        this.a.maxVertices = a;
      },
    },
    W: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkerCount") ? E(this, "maxWorkerCount") : null;
      },
      set: function (a) {
        this.a.maxWorkerCount = a;
      },
    },
    sa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkers") ? E(this, "maxWorkers") : null;
      },
      set: function (a) {
        this.a.maxWorkers = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
    selectors: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "selectors") ? E(this, "selectors") : null;
      },
      set: function (a) {
        this.a.selectors = a;
      },
    },
  });
  var Of = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.expression = null == a.i ? null : a.i;
    this.a.description = null == a.description ? null : a.description;
    this.a.videoOptions = null == a.Qa ? null : a.Qa;
    this.a.tileOptions = null == a.dc ? null : a.dc;
    this.a.tileExportOptions = null == a.cc ? null : a.cc;
    this.a.requestId = null == a.requestId ? null : a.requestId;
    this.a.version = null == a.version ? null : a.version;
    this.a.maxWorkers = null == a.sa ? null : a.sa;
    this.a.maxWorkerCount = null == a.W ? null : a.W;
  };
  q(Of, B);
  Of.prototype.f = function () {
    return {
      K: { version: Ce },
      keys: "description expression maxWorkerCount maxWorkers requestId tileExportOptions tileOptions version videoOptions".split(
        " "
      ),
      s: {
        expression: lf,
        tileExportOptions: Pf,
        tileOptions: Kf,
        videoOptions: Qf,
      },
    };
  };
  l.Object.defineProperties(Of.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    W: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkerCount") ? E(this, "maxWorkerCount") : null;
      },
      set: function (a) {
        this.a.maxWorkerCount = a;
      },
    },
    sa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkers") ? E(this, "maxWorkers") : null;
      },
      set: function (a) {
        this.a.maxWorkers = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
    cc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileExportOptions")
          ? E(this, "tileExportOptions")
          : null;
      },
      set: function (a) {
        this.a.tileExportOptions = a;
      },
    },
    dc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileOptions") ? E(this, "tileOptions") : null;
      },
      set: function (a) {
        this.a.tileOptions = a;
      },
    },
    version: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "version") ? E(this, "version") : null;
      },
      set: function (a) {
        this.a.version = a;
      },
    },
    Qa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "videoOptions") ? E(this, "videoOptions") : null;
      },
      set: function (a) {
        this.a.videoOptions = a;
      },
    },
  });
  var Rf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.expression = null == a.i ? null : a.i;
    this.a.description = null == a.description ? null : a.description;
    this.a.videoOptions = null == a.Qa ? null : a.Qa;
    this.a.fileExportOptions = null == a.la ? null : a.la;
    this.a.requestId = null == a.requestId ? null : a.requestId;
    this.a.maxWorkers = null == a.sa ? null : a.sa;
    this.a.maxWorkerCount = null == a.W ? null : a.W;
  };
  q(Rf, B);
  Rf.prototype.f = function () {
    return {
      keys: "description expression fileExportOptions maxWorkerCount maxWorkers requestId videoOptions".split(
        " "
      ),
      s: { expression: lf, fileExportOptions: Pf, videoOptions: Qf },
    };
  };
  l.Object.defineProperties(Rf.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    la: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileExportOptions")
          ? E(this, "fileExportOptions")
          : null;
      },
      set: function (a) {
        this.a.fileExportOptions = a;
      },
    },
    W: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkerCount") ? E(this, "maxWorkerCount") : null;
      },
      set: function (a) {
        this.a.maxWorkerCount = a;
      },
    },
    sa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxWorkers") ? E(this, "maxWorkers") : null;
      },
      set: function (a) {
        this.a.maxWorkers = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
    Qa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "videoOptions") ? E(this, "videoOptions") : null;
      },
      set: function (a) {
        this.a.videoOptions = a;
      },
    },
  });
  var df = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.expression = null == a.i ? null : a.i;
    this.a.title = null == a.title ? null : a.title;
    this.a.description = null == a.description ? null : a.description;
    this.a.location = null == a.location ? null : a.location;
  };
  q(df, B);
  df.prototype.f = function () {
    return { keys: ["description", "expression", "location", "title"] };
  };
  l.Object.defineProperties(df.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    location: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "location") ? E(this, "location") : null;
      },
      set: function (a) {
        this.a.location = a;
      },
    },
    title: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "title") ? E(this, "title") : null;
      },
      set: function (a) {
        this.a.title = a;
      },
    },
  });
  var lf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.values = null == a.values ? null : a.values;
    this.a.result = null == a.result ? null : a.result;
  };
  q(lf, B);
  lf.prototype.f = function () {
    return {
      keys: ["result", "values"],
      Ba: { values: { ia: Ze, oa: !1, pa: !0, qa: !1 } },
    };
  };
  l.Object.defineProperties(lf.prototype, {
    result: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "result") ? E(this, "result") : null;
      },
      set: function (a) {
        this.a.result = a;
      },
    },
    values: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "values") ? E(this, "values") : null;
      },
      set: function (a) {
        this.a.values = a;
      },
    },
  });
  var Sf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.expression = null == a.i ? null : a.i;
    this.a.orientation = null == a.orientation ? null : a.orientation;
    this.a.fileFormat = null == a.C ? null : a.C;
    this.a.grid = null == a.L ? null : a.L;
  };
  q(Sf, B);
  Sf.prototype.f = function () {
    return {
      K: { fileFormat: De, orientation: Ee },
      keys: ["expression", "fileFormat", "grid", "name", "orientation"],
      s: { expression: lf, grid: If },
    };
  };
  l.Object.defineProperties(Sf.prototype, {
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    L: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "grid") ? E(this, "grid") : null;
      },
      set: function (a) {
        this.a.grid = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    orientation: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "orientation") ? E(this, "orientation") : null;
      },
      set: function (a) {
        this.a.orientation = a;
      },
    },
  });
  var yf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.sizeBytes = null == a.Da ? null : a.Da;
    this.a.maxSizeBytes = null == a.Xb ? null : a.Xb;
    this.a.assetCount = null == a.Ne ? null : a.Ne;
    this.a.maxAssets = null == a.Eh ? null : a.Eh;
    this.a.maxAssetCount = null == a.Cf ? null : a.Cf;
  };
  q(yf, B);
  yf.prototype.f = function () {
    return {
      keys: [
        "assetCount",
        "maxAssetCount",
        "maxAssets",
        "maxSizeBytes",
        "sizeBytes",
      ],
    };
  };
  l.Object.defineProperties(yf.prototype, {
    Ne: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "assetCount") ? E(this, "assetCount") : null;
      },
      set: function (a) {
        this.a.assetCount = a;
      },
    },
    Cf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxAssetCount") ? E(this, "maxAssetCount") : null;
      },
      set: function (a) {
        this.a.maxAssetCount = a;
      },
    },
    Eh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxAssets") ? E(this, "maxAssets") : null;
      },
      set: function (a) {
        this.a.maxAssets = a;
      },
    },
    Xb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxSizeBytes") ? E(this, "maxSizeBytes") : null;
      },
      set: function (a) {
        this.a.maxSizeBytes = a;
      },
    },
    Da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sizeBytes") ? E(this, "sizeBytes") : null;
      },
      set: function (a) {
        this.a.sizeBytes = a;
      },
    },
  });
  var Tf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.argumentNames = null == a.kc ? null : a.kc;
    this.a.body = null == a.body ? null : a.body;
  };
  q(Tf, B);
  Tf.prototype.f = function () {
    return { keys: ["argumentNames", "body"] };
  };
  l.Object.defineProperties(Tf.prototype, {
    kc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "argumentNames") ? E(this, "argumentNames") : null;
      },
      set: function (a) {
        this.a.argumentNames = a;
      },
    },
    body: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "body") ? E(this, "body") : null;
      },
      set: function (a) {
        this.a.body = a;
      },
    },
  });
  var Uf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.functionName = null == a.functionName ? null : a.functionName;
    this.a.functionReference = null == a.Wa ? null : a.Wa;
    this.a.arguments = null == a.arguments ? null : a.arguments;
  };
  q(Uf, B);
  Uf.prototype.f = function () {
    return {
      keys: ["arguments", "functionName", "functionReference"],
      Ba: { arguments: { ia: Ze, oa: !1, pa: !0, qa: !1 } },
    };
  };
  l.Object.defineProperties(Uf.prototype, {
    arguments: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "arguments") ? E(this, "arguments") : null;
      },
      set: function (a) {
        this.a.arguments = a;
      },
    },
    functionName: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "functionName") ? E(this, "functionName") : null;
      },
      set: function (a) {
        this.a.functionName = a;
      },
    },
    Wa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "functionReference")
          ? E(this, "functionReference")
          : null;
      },
      set: function (a) {
        this.a.functionReference = a;
      },
    },
  });
  var Vf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.bucket = null == a.lc ? null : a.lc;
    this.a.filenamePrefix = null == a.fa ? null : a.fa;
    this.a.permissions = null == a.permissions ? null : a.permissions;
    this.a.bucketCorsUris = null == a.mc ? null : a.mc;
  };
  q(Vf, B);
  Vf.prototype.f = function () {
    return {
      K: { permissions: Fe },
      keys: ["bucket", "bucketCorsUris", "filenamePrefix", "permissions"],
    };
  };
  l.Object.defineProperties(Vf.prototype, {
    lc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bucket") ? E(this, "bucket") : null;
      },
      set: function (a) {
        this.a.bucket = a;
      },
    },
    mc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bucketCorsUris") ? E(this, "bucketCorsUris") : null;
      },
      set: function (a) {
        this.a.bucketCorsUris = a;
      },
    },
    fa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "filenamePrefix") ? E(this, "filenamePrefix") : null;
      },
      set: function (a) {
        this.a.filenamePrefix = a;
      },
    },
    permissions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "permissions") ? E(this, "permissions") : null;
      },
      set: function (a) {
        this.a.permissions = a;
      },
    },
  });
  l.Object.defineProperties(Vf, {
    Permissions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return Fe;
      },
    },
  });
  var xf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.uris = null == a.wa ? null : a.wa;
  };
  q(xf, B);
  xf.prototype.f = function () {
    return { keys: ["uris"] };
  };
  l.Object.defineProperties(xf.prototype, {
    wa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uris") ? E(this, "uris") : null;
      },
      set: function (a) {
        this.a.uris = a;
      },
    },
  });
  var Wf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.cloudOptimized = null == a.Re ? null : a.Re;
    this.a.tileDimensions = null == a.Na ? null : a.Na;
    this.a.skipEmptyFiles = null == a.$f ? null : a.$f;
  };
  q(Wf, B);
  Wf.prototype.f = function () {
    return {
      keys: ["cloudOptimized", "skipEmptyFiles", "tileDimensions"],
      s: { tileDimensions: Xf },
    };
  };
  l.Object.defineProperties(Wf.prototype, {
    Re: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudOptimized") ? E(this, "cloudOptimized") : null;
      },
      set: function (a) {
        this.a.cloudOptimized = a;
      },
    },
    $f: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "skipEmptyFiles") ? E(this, "skipEmptyFiles") : null;
      },
      set: function (a) {
        this.a.skipEmptyFiles = a;
      },
    },
    Na: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileDimensions") ? E(this, "tileDimensions") : null;
      },
      set: function (a) {
        this.a.tileDimensions = a;
      },
    },
  });
  var Yf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.options = null == a.options ? null : a.options;
  };
  q(Yf, B);
  Yf.prototype.f = function () {
    return { keys: ["options"], s: { options: Zf } };
  };
  l.Object.defineProperties(Yf.prototype, {
    options: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "options") ? E(this, "options") : null;
      },
      set: function (a) {
        this.a.options = a;
      },
    },
  });
  var Zf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.requestedPolicyVersion = null == a.Vh ? null : a.Vh;
  };
  q(Zf, B);
  Zf.prototype.f = function () {
    return { keys: ["requestedPolicyVersion"] };
  };
  l.Object.defineProperties(Zf.prototype, {
    Vh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestedPolicyVersion")
          ? E(this, "requestedPolicyVersion")
          : null;
      },
      set: function (a) {
        this.a.requestedPolicyVersion = a;
      },
    },
  });
  var Xf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.width = null == a.width ? null : a.width;
    this.a.height = null == a.height ? null : a.height;
  };
  q(Xf, B);
  Xf.prototype.f = function () {
    return { keys: ["height", "width"] };
  };
  l.Object.defineProperties(Xf.prototype, {
    height: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "height") ? E(this, "height") : null;
      },
      set: function (a) {
        this.a.height = a;
      },
    },
    width: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "width") ? E(this, "width") : null;
      },
      set: function (a) {
        this.a.width = a;
      },
    },
  });
  var $f = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.x = null == a.x ? null : a.x;
    this.a.y = null == a.y ? null : a.y;
  };
  q($f, B);
  $f.prototype.f = function () {
    return { keys: ["x", "y"] };
  };
  l.Object.defineProperties($f.prototype, {
    x: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "x") ? E(this, "x") : null;
      },
      set: function (a) {
        this.a.x = a;
      },
    },
    y: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "y") ? E(this, "y") : null;
      },
      set: function (a) {
        this.a.y = a;
      },
    },
  });
  var ag = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.id = null == a.id ? null : a.id;
    this.a.updateTime = null == a.Oa ? null : a.Oa;
    this.a.title = null == a.title ? null : a.title;
    this.a.description = null == a.description ? null : a.description;
    this.a.properties = null == a.properties ? null : a.properties;
    this.a.startTime = null == a.startTime ? null : a.startTime;
    this.a.endTime = null == a.endTime ? null : a.endTime;
    this.a.geometry = null == a.geometry ? null : a.geometry;
    this.a.bands = null == a.bands ? null : a.bands;
    this.a.sizeBytes = null == a.Da ? null : a.Da;
  };
  q(ag, B);
  ag.prototype.f = function () {
    return {
      R: { bands: wf },
      keys: "bands description endTime geometry id name properties sizeBytes startTime title updateTime".split(
        " "
      ),
      Ba: {
        geometry: { ia: null, oa: !1, pa: !1, qa: !1 },
        properties: { ia: null, oa: !1, pa: !1, qa: !1 },
      },
    };
  };
  l.Object.defineProperties(ag.prototype, {
    bands: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bands") ? E(this, "bands") : null;
      },
      set: function (a) {
        this.a.bands = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    endTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endTime") ? E(this, "endTime") : null;
      },
      set: function (a) {
        this.a.endTime = a;
      },
    },
    geometry: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "geometry") ? E(this, "geometry") : null;
      },
      set: function (a) {
        this.a.geometry = a;
      },
    },
    id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "id") ? E(this, "id") : null;
      },
      set: function (a) {
        this.a.id = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    properties: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "properties") ? E(this, "properties") : null;
      },
      set: function (a) {
        this.a.properties = a;
      },
    },
    Da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sizeBytes") ? E(this, "sizeBytes") : null;
      },
      set: function (a) {
        this.a.sizeBytes = a;
      },
    },
    startTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startTime") ? E(this, "startTime") : null;
      },
      set: function (a) {
        this.a.startTime = a;
      },
    },
    title: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "title") ? E(this, "title") : null;
      },
      set: function (a) {
        this.a.title = a;
      },
    },
    Oa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "updateTime") ? E(this, "updateTime") : null;
      },
      set: function (a) {
        this.a.updateTime = a;
      },
    },
  });
  var Gf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.earthEngineDestination = null == a.Sb ? null : a.Sb;
    this.a.pyramidingPolicy =
      null == a.pyramidingPolicy ? null : a.pyramidingPolicy;
    this.a.pyramidingPolicyOverrides = null == a.Mf ? null : a.Mf;
    this.a.tileSize = null == a.tileSize ? null : a.tileSize;
  };
  q(Gf, B);
  Gf.prototype.f = function () {
    return {
      K: { pyramidingPolicy: Ge, pyramidingPolicyOverrides: He },
      keys: [
        "earthEngineDestination",
        "pyramidingPolicy",
        "pyramidingPolicyOverrides",
        "tileSize",
      ],
      Ba: { pyramidingPolicyOverrides: { ia: null, oa: !1, pa: !1, qa: !1 } },
      s: { earthEngineDestination: Bf },
    };
  };
  l.Object.defineProperties(Gf.prototype, {
    Sb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "earthEngineDestination")
          ? E(this, "earthEngineDestination")
          : null;
      },
      set: function (a) {
        this.a.earthEngineDestination = a;
      },
    },
    pyramidingPolicy: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pyramidingPolicy") ? E(this, "pyramidingPolicy") : null;
      },
      set: function (a) {
        this.a.pyramidingPolicy = a;
      },
    },
    Mf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pyramidingPolicyOverrides")
          ? E(this, "pyramidingPolicyOverrides")
          : null;
      },
      set: function (a) {
        this.a.pyramidingPolicyOverrides = a;
      },
    },
    tileSize: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileSize") ? E(this, "tileSize") : null;
      },
      set: function (a) {
        this.a.tileSize = a;
      },
    },
  });
  var wf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.id = null == a.id ? null : a.id;
    this.a.dataType = null == a.dataType ? null : a.dataType;
    this.a.grid = null == a.L ? null : a.L;
    this.a.pyramidingPolicy =
      null == a.pyramidingPolicy ? null : a.pyramidingPolicy;
    this.a.tilesets = null == a.tilesets ? null : a.tilesets;
    this.a.missingData = null == a.missingData ? null : a.missingData;
  };
  q(wf, B);
  wf.prototype.f = function () {
    return {
      R: { tilesets: bg },
      K: { pyramidingPolicy: Ie },
      keys: "dataType grid id missingData pyramidingPolicy tilesets".split(" "),
      s: { dataType: cg, grid: If, missingData: dg },
    };
  };
  l.Object.defineProperties(wf.prototype, {
    dataType: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dataType") ? E(this, "dataType") : null;
      },
      set: function (a) {
        this.a.dataType = a;
      },
    },
    L: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "grid") ? E(this, "grid") : null;
      },
      set: function (a) {
        this.a.grid = a;
      },
    },
    id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "id") ? E(this, "id") : null;
      },
      set: function (a) {
        this.a.id = a;
      },
    },
    missingData: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "missingData") ? E(this, "missingData") : null;
      },
      set: function (a) {
        this.a.missingData = a;
      },
    },
    pyramidingPolicy: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pyramidingPolicy") ? E(this, "pyramidingPolicy") : null;
      },
      set: function (a) {
        this.a.pyramidingPolicy = a;
      },
    },
    tilesets: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesets") ? E(this, "tilesets") : null;
      },
      set: function (a) {
        this.a.tilesets = a;
      },
    },
  });
  var Hf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.driveDestination = null == a.ja ? null : a.ja;
    this.a.cloudStorageDestination = null == a.ub ? null : a.ub;
    this.a.gcsDestination = null == a.ma ? null : a.ma;
    this.a.geoTiffOptions = null == a.Id ? null : a.Id;
    this.a.tfRecordOptions = null == a.ge ? null : a.ge;
    this.a.fileFormat = null == a.C ? null : a.C;
  };
  q(Hf, B);
  Hf.prototype.f = function () {
    return {
      K: { fileFormat: Je },
      keys: "cloudStorageDestination driveDestination fileFormat gcsDestination geoTiffOptions tfRecordOptions".split(
        " "
      ),
      s: {
        cloudStorageDestination: hf,
        driveDestination: uf,
        gcsDestination: Vf,
        geoTiffOptions: Wf,
        tfRecordOptions: eg,
      },
    };
  };
  l.Object.defineProperties(Hf.prototype, {
    ub: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudStorageDestination")
          ? E(this, "cloudStorageDestination")
          : null;
      },
      set: function (a) {
        this.a.cloudStorageDestination = a;
      },
    },
    ja: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "driveDestination") ? E(this, "driveDestination") : null;
      },
      set: function (a) {
        this.a.driveDestination = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    ma: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "gcsDestination") ? E(this, "gcsDestination") : null;
      },
      set: function (a) {
        this.a.gcsDestination = a;
      },
    },
    Id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "geoTiffOptions") ? E(this, "geoTiffOptions") : null;
      },
      set: function (a) {
        this.a.geoTiffOptions = a;
      },
    },
    ge: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tfRecordOptions") ? E(this, "tfRecordOptions") : null;
      },
      set: function (a) {
        this.a.tfRecordOptions = a;
      },
    },
  });
  var fg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.properties = null == a.properties ? null : a.properties;
    this.a.uriPrefix = null == a.sd ? null : a.sd;
    this.a.tilesets = null == a.tilesets ? null : a.tilesets;
    this.a.bands = null == a.bands ? null : a.bands;
    this.a.maskBands = null == a.Bf ? null : a.Bf;
    this.a.footprint = null == a.dh ? null : a.dh;
    this.a.missingData = null == a.missingData ? null : a.missingData;
    this.a.pyramidingPolicy =
      null == a.pyramidingPolicy ? null : a.pyramidingPolicy;
    this.a.startTime = null == a.startTime ? null : a.startTime;
    this.a.endTime = null == a.endTime ? null : a.endTime;
  };
  q(fg, B);
  fg.prototype.f = function () {
    return {
      R: { bands: gg, maskBands: hg, tilesets: ig },
      K: { pyramidingPolicy: Ke },
      keys: "bands endTime footprint maskBands missingData name properties pyramidingPolicy startTime tilesets uriPrefix".split(
        " "
      ),
      Ba: { properties: { ia: null, oa: !1, pa: !1, qa: !1 } },
      s: { footprint: jg, missingData: dg },
    };
  };
  l.Object.defineProperties(fg.prototype, {
    bands: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bands") ? E(this, "bands") : null;
      },
      set: function (a) {
        this.a.bands = a;
      },
    },
    endTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endTime") ? E(this, "endTime") : null;
      },
      set: function (a) {
        this.a.endTime = a;
      },
    },
    dh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "footprint") ? E(this, "footprint") : null;
      },
      set: function (a) {
        this.a.footprint = a;
      },
    },
    Bf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maskBands") ? E(this, "maskBands") : null;
      },
      set: function (a) {
        this.a.maskBands = a;
      },
    },
    missingData: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "missingData") ? E(this, "missingData") : null;
      },
      set: function (a) {
        this.a.missingData = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    properties: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "properties") ? E(this, "properties") : null;
      },
      set: function (a) {
        this.a.properties = a;
      },
    },
    pyramidingPolicy: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pyramidingPolicy") ? E(this, "pyramidingPolicy") : null;
      },
      set: function (a) {
        this.a.pyramidingPolicy = a;
      },
    },
    startTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startTime") ? E(this, "startTime") : null;
      },
      set: function (a) {
        this.a.startTime = a;
      },
    },
    tilesets: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesets") ? E(this, "tilesets") : null;
      },
      set: function (a) {
        this.a.tilesets = a;
      },
    },
    sd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uriPrefix") ? E(this, "uriPrefix") : null;
      },
      set: function (a) {
        this.a.uriPrefix = a;
      },
    },
  });
  var kg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.uris = null == a.wa ? null : a.wa;
    this.a.affineTransform = null == a.Ob ? null : a.Ob;
  };
  q(kg, B);
  kg.prototype.f = function () {
    return { keys: ["affineTransform", "uris"], s: { affineTransform: Ve } };
  };
  l.Object.defineProperties(kg.prototype, {
    Ob: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "affineTransform") ? E(this, "affineTransform") : null;
      },
      set: function (a) {
        this.a.affineTransform = a;
      },
    },
    wa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uris") ? E(this, "uris") : null;
      },
      set: function (a) {
        this.a.uris = a;
      },
    },
  });
  var lg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.imageManifest = null == a.rf ? null : a.rf;
    this.a.description = null == a.description ? null : a.description;
    this.a.overwrite = null == a.overwrite ? null : a.overwrite;
    this.a.requestId = null == a.requestId ? null : a.requestId;
  };
  q(lg, B);
  lg.prototype.f = function () {
    return {
      keys: ["description", "imageManifest", "overwrite", "requestId"],
      s: { imageManifest: fg },
    };
  };
  l.Object.defineProperties(lg.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    rf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "imageManifest") ? E(this, "imageManifest") : null;
      },
      set: function (a) {
        this.a.imageManifest = a;
      },
    },
    overwrite: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "overwrite") ? E(this, "overwrite") : null;
      },
      set: function (a) {
        this.a.overwrite = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
  });
  var mg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.tableManifest = null == a.eg ? null : a.eg;
    this.a.description = null == a.description ? null : a.description;
    this.a.overwrite = null == a.overwrite ? null : a.overwrite;
    this.a.requestId = null == a.requestId ? null : a.requestId;
  };
  q(mg, B);
  mg.prototype.f = function () {
    return {
      keys: ["description", "overwrite", "requestId", "tableManifest"],
      s: { tableManifest: ng },
    };
  };
  l.Object.defineProperties(mg.prototype, {
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    overwrite: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "overwrite") ? E(this, "overwrite") : null;
      },
      set: function (a) {
        this.a.overwrite = a;
      },
    },
    requestId: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "requestId") ? E(this, "requestId") : null;
      },
      set: function (a) {
        this.a.requestId = a;
      },
    },
    eg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tableManifest") ? E(this, "tableManifest") : null;
      },
      set: function (a) {
        this.a.tableManifest = a;
      },
    },
  });
  var og = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.algorithms = null == a.Jc ? null : a.Jc;
  };
  q(og, B);
  og.prototype.f = function () {
    return { R: { algorithms: We }, keys: ["algorithms"] };
  };
  l.Object.defineProperties(og.prototype, {
    Jc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "algorithms") ? E(this, "algorithms") : null;
      },
      set: function (a) {
        this.a.algorithms = a;
      },
    },
  });
  var pg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.assets = null == a.assets ? null : a.assets;
    this.a.nextPageToken = null == a.Za ? null : a.Za;
  };
  q(pg, B);
  pg.prototype.f = function () {
    return { R: { assets: vf }, keys: ["assets", "nextPageToken"] };
  };
  l.Object.defineProperties(pg.prototype, {
    assets: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "assets") ? E(this, "assets") : null;
      },
      set: function (a) {
        this.a.assets = a;
      },
    },
    Za: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "nextPageToken") ? E(this, "nextPageToken") : null;
      },
      set: function (a) {
        this.a.nextPageToken = a;
      },
    },
  });
  var qg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.images = null == a.images ? null : a.images;
    this.a.nextPageToken = null == a.Za ? null : a.Za;
  };
  q(qg, B);
  qg.prototype.f = function () {
    return { R: { images: ag }, keys: ["images", "nextPageToken"] };
  };
  l.Object.defineProperties(qg.prototype, {
    images: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "images") ? E(this, "images") : null;
      },
      set: function (a) {
        this.a.images = a;
      },
    },
    Za: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "nextPageToken") ? E(this, "nextPageToken") : null;
      },
      set: function (a) {
        this.a.nextPageToken = a;
      },
    },
  });
  var rg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.operations = null == a.La ? null : a.La;
    this.a.nextPageToken = null == a.Za ? null : a.Za;
  };
  q(rg, B);
  rg.prototype.f = function () {
    return { R: { operations: sg }, keys: ["nextPageToken", "operations"] };
  };
  l.Object.defineProperties(rg.prototype, {
    Za: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "nextPageToken") ? E(this, "nextPageToken") : null;
      },
      set: function (a) {
        this.a.nextPageToken = a;
      },
    },
    La: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "operations") ? E(this, "operations") : null;
      },
      set: function (a) {
        this.a.operations = a;
      },
    },
  });
  var tg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.counter = null == a.counter ? null : a.counter;
    this.a.dataAccess = null == a.Pg ? null : a.Pg;
    this.a.cloudAudit = null == a.Eg ? null : a.Eg;
  };
  q(tg, B);
  tg.prototype.f = function () {
    return {
      keys: ["cloudAudit", "counter", "dataAccess"],
      s: { cloudAudit: gf, counter: pf, dataAccess: rf },
    };
  };
  l.Object.defineProperties(tg.prototype, {
    Eg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudAudit") ? E(this, "cloudAudit") : null;
      },
      set: function (a) {
        this.a.cloudAudit = a;
      },
    },
    counter: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "counter") ? E(this, "counter") : null;
      },
      set: function (a) {
        this.a.counter = a;
      },
    },
    Pg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dataAccess") ? E(this, "dataAccess") : null;
      },
      set: function (a) {
        this.a.dataAccess = a;
      },
    },
  });
  var dg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.values = null == a.values ? null : a.values;
  };
  q(dg, B);
  dg.prototype.f = function () {
    return { keys: ["values"] };
  };
  l.Object.defineProperties(dg.prototype, {
    values: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "values") ? E(this, "values") : null;
      },
      set: function (a) {
        this.a.values = a;
      },
    },
  });
  var ug = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.destinationName = null == a.Rb ? null : a.Rb;
  };
  q(ug, B);
  ug.prototype.f = function () {
    return { keys: ["destinationName"] };
  };
  l.Object.defineProperties(ug.prototype, {
    Rb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "destinationName") ? E(this, "destinationName") : null;
      },
      set: function (a) {
        this.a.destinationName = a;
      },
    },
  });
  var sg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.metadata = null == a.Ff ? null : a.Ff;
    this.a.done = null == a.done ? null : a.done;
    this.a.error = null == a.error ? null : a.error;
    this.a.response = null == a.response ? null : a.response;
  };
  q(sg, B);
  sg.prototype.f = function () {
    return {
      keys: ["done", "error", "metadata", "name", "response"],
      Ba: {
        metadata: { ia: null, oa: !1, pa: !1, qa: !1 },
        response: { ia: null, oa: !1, pa: !1, qa: !1 },
      },
      s: { error: vg },
    };
  };
  l.Object.defineProperties(sg.prototype, {
    done: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "done") ? E(this, "done") : null;
      },
      set: function (a) {
        this.a.done = a;
      },
    },
    error: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "error") ? E(this, "error") : null;
      },
      set: function (a) {
        this.a.error = a;
      },
    },
    Ff: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "metadata") ? E(this, "metadata") : null;
      },
      set: function (a) {
        this.a.metadata = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    response: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "response") ? E(this, "response") : null;
      },
      set: function (a) {
        this.a.response = a;
      },
    },
  });
  var wg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.state = null == a.state ? null : a.state;
    this.a.description = null == a.description ? null : a.description;
    this.a.type = null == a.type ? null : a.type;
    this.a.priority = null == a.priority ? null : a.priority;
    this.a.createTime = null == a.Ye ? null : a.Ye;
    this.a.updateTime = null == a.Oa ? null : a.Oa;
    this.a.startTime = null == a.startTime ? null : a.startTime;
    this.a.endTime = null == a.endTime ? null : a.endTime;
    this.a.attempt = null == a.attempt ? null : a.attempt;
    this.a.scriptUri = null == a.Uf ? null : a.Uf;
    this.a.destinationUris = null == a.af ? null : a.af;
  };
  q(wg, B);
  wg.prototype.f = function () {
    return {
      K: { state: Le },
      keys: "attempt createTime description destinationUris endTime priority scriptUri startTime state type updateTime".split(
        " "
      ),
    };
  };
  l.Object.defineProperties(wg.prototype, {
    attempt: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "attempt") ? E(this, "attempt") : null;
      },
      set: function (a) {
        this.a.attempt = a;
      },
    },
    Ye: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "createTime") ? E(this, "createTime") : null;
      },
      set: function (a) {
        this.a.createTime = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    af: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "destinationUris") ? E(this, "destinationUris") : null;
      },
      set: function (a) {
        this.a.destinationUris = a;
      },
    },
    endTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endTime") ? E(this, "endTime") : null;
      },
      set: function (a) {
        this.a.endTime = a;
      },
    },
    priority: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "priority") ? E(this, "priority") : null;
      },
      set: function (a) {
        this.a.priority = a;
      },
    },
    Uf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "scriptUri") ? E(this, "scriptUri") : null;
      },
      set: function (a) {
        this.a.scriptUri = a;
      },
    },
    startTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startTime") ? E(this, "startTime") : null;
      },
      set: function (a) {
        this.a.startTime = a;
      },
    },
    state: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "state") ? E(this, "state") : null;
      },
      set: function (a) {
        this.a.state = a;
      },
    },
    type: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "type") ? E(this, "type") : null;
      },
      set: function (a) {
        this.a.type = a;
      },
    },
    Oa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "updateTime") ? E(this, "updateTime") : null;
      },
      set: function (a) {
        this.a.updateTime = a;
      },
    },
  });
  var cg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.precision = null == a.precision ? null : a.precision;
    this.a.range = null == a.kd ? null : a.kd;
    this.a.dimensionsCount = null == a.Tg ? null : a.Tg;
  };
  q(cg, B);
  cg.prototype.f = function () {
    return {
      K: { precision: Me },
      keys: ["dimensionsCount", "precision", "range"],
      s: { range: tf },
    };
  };
  l.Object.defineProperties(cg.prototype, {
    Tg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dimensionsCount") ? E(this, "dimensionsCount") : null;
      },
      set: function (a) {
        this.a.dimensionsCount = a;
      },
    },
    precision: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "precision") ? E(this, "precision") : null;
      },
      set: function (a) {
        this.a.precision = a;
      },
    },
    kd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "range") ? E(this, "range") : null;
      },
      set: function (a) {
        this.a.range = a;
      },
    },
  });
  var jg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.points = null == a.Ph ? null : a.Ph;
    this.a.bandId = null == a.ug ? null : a.ug;
  };
  q(jg, B);
  jg.prototype.f = function () {
    return { R: { points: $f }, keys: ["bandId", "points"] };
  };
  l.Object.defineProperties(jg.prototype, {
    ug: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bandId") ? E(this, "bandId") : null;
      },
      set: function (a) {
        this.a.bandId = a;
      },
    },
    Ph: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "points") ? E(this, "points") : null;
      },
      set: function (a) {
        this.a.points = a;
      },
    },
  });
  var If = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.crsCode = null == a.Ze ? null : a.Ze;
    this.a.crsWkt = null == a.Lg ? null : a.Lg;
    this.a.dimensions = null == a.dimensions ? null : a.dimensions;
    this.a.affineTransform = null == a.Ob ? null : a.Ob;
  };
  q(If, B);
  If.prototype.f = function () {
    return {
      keys: ["affineTransform", "crsCode", "crsWkt", "dimensions"],
      s: { affineTransform: Ve, dimensions: Xf },
    };
  };
  l.Object.defineProperties(If.prototype, {
    Ob: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "affineTransform") ? E(this, "affineTransform") : null;
      },
      set: function (a) {
        this.a.affineTransform = a;
      },
    },
    Ze: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "crsCode") ? E(this, "crsCode") : null;
      },
      set: function (a) {
        this.a.crsCode = a;
      },
    },
    Lg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "crsWkt") ? E(this, "crsWkt") : null;
      },
      set: function (a) {
        this.a.crsWkt = a;
      },
    },
    dimensions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dimensions") ? E(this, "dimensions") : null;
      },
      set: function (a) {
        this.a.dimensions = a;
      },
    },
  });
  var xg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.version = null == a.version ? null : a.version;
    this.a.bindings = null == a.zd ? null : a.zd;
    this.a.auditConfigs = null == a.rg ? null : a.rg;
    this.a.rules = null == a.rules ? null : a.rules;
    this.a.etag = null == a.df ? null : a.df;
    this.a.iamOwned = null == a.nh ? null : a.nh;
  };
  q(xg, B);
  xg.prototype.f = function () {
    return {
      R: { auditConfigs: $e, bindings: cf, rules: yg },
      keys: "auditConfigs bindings etag iamOwned rules version".split(" "),
    };
  };
  l.Object.defineProperties(xg.prototype, {
    rg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "auditConfigs") ? E(this, "auditConfigs") : null;
      },
      set: function (a) {
        this.a.auditConfigs = a;
      },
    },
    zd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bindings") ? E(this, "bindings") : null;
      },
      set: function (a) {
        this.a.bindings = a;
      },
    },
    df: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "etag") ? E(this, "etag") : null;
      },
      set: function (a) {
        this.a.etag = a;
      },
    },
    nh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "iamOwned") ? E(this, "iamOwned") : null;
      },
      set: function (a) {
        this.a.iamOwned = a;
      },
    },
    rules: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "rules") ? E(this, "rules") : null;
      },
      set: function (a) {
        this.a.rules = a;
      },
    },
    version: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "version") ? E(this, "version") : null;
      },
      set: function (a) {
        this.a.version = a;
      },
    },
  });
  var yg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.description = null == a.description ? null : a.description;
    this.a.permissions = null == a.permissions ? null : a.permissions;
    this.a.action = null == a.action ? null : a.action;
    this.a["in"] = null == a.sh ? null : a.sh;
    this.a.notIn = null == a.Hh ? null : a.Hh;
    this.a.conditions = null == a.conditions ? null : a.conditions;
    this.a.logConfig = null == a.Ah ? null : a.Ah;
  };
  q(yg, B);
  yg.prototype.f = function () {
    return {
      R: { conditions: nf, logConfig: tg },
      K: { action: Ne },
      keys: "action conditions description in logConfig notIn permissions".split(
        " "
      ),
    };
  };
  l.Object.defineProperties(yg.prototype, {
    action: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "action") ? E(this, "action") : null;
      },
      set: function (a) {
        this.a.action = a;
      },
    },
    conditions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "conditions") ? E(this, "conditions") : null;
      },
      set: function (a) {
        this.a.conditions = a;
      },
    },
    description: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "description") ? E(this, "description") : null;
      },
      set: function (a) {
        this.a.description = a;
      },
    },
    sh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "in") ? E(this, "in") : null;
      },
      set: function (a) {
        this.a["in"] = a;
      },
    },
    Ah: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "logConfig") ? E(this, "logConfig") : null;
      },
      set: function (a) {
        this.a.logConfig = a;
      },
    },
    Hh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "notIn") ? E(this, "notIn") : null;
      },
      set: function (a) {
        this.a.notIn = a;
      },
    },
    permissions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "permissions") ? E(this, "permissions") : null;
      },
      set: function (a) {
        this.a.permissions = a;
      },
    },
  });
  var zg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.policy = null == a.Jf ? null : a.Jf;
    this.a.updateMask = null == a.Fc ? null : a.Fc;
  };
  q(zg, B);
  zg.prototype.f = function () {
    return { keys: ["policy", "updateMask"], s: { policy: xg } };
  };
  l.Object.defineProperties(zg.prototype, {
    Jf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "policy") ? E(this, "policy") : null;
      },
      set: function (a) {
        this.a.policy = a;
      },
    },
    Fc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "updateMask") ? E(this, "updateMask") : null;
      },
      set: function (a) {
        this.a.updateMask = a;
      },
    },
  });
  var vg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.code = null == a.code ? null : a.code;
    this.a.message = null == a.message ? null : a.message;
    this.a.details = null == a.details ? null : a.details;
  };
  q(vg, B);
  vg.prototype.f = function () {
    return {
      keys: ["code", "details", "message"],
      Ba: { details: { ia: null, oa: !0, pa: !1, qa: !1 } },
    };
  };
  l.Object.defineProperties(vg.prototype, {
    code: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "code") ? E(this, "code") : null;
      },
      set: function (a) {
        this.a.code = a;
      },
    },
    details: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "details") ? E(this, "details") : null;
      },
      set: function (a) {
        this.a.details = a;
      },
    },
    message: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "message") ? E(this, "message") : null;
      },
      set: function (a) {
        this.a.message = a;
      },
    },
  });
  var Ag = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.expression = null == a.i ? null : a.i;
    this.a.fileFormat = null == a.C ? null : a.C;
    this.a.selectors = null == a.selectors ? null : a.selectors;
    this.a.filename = null == a.filename ? null : a.filename;
  };
  q(Ag, B);
  Ag.prototype.f = function () {
    return {
      K: { fileFormat: Pe },
      keys: ["expression", "fileFormat", "filename", "name", "selectors"],
      s: { expression: lf },
    };
  };
  l.Object.defineProperties(Ag.prototype, {
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    filename: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "filename") ? E(this, "filename") : null;
      },
      set: function (a) {
        this.a.filename = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    selectors: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "selectors") ? E(this, "selectors") : null;
      },
      set: function (a) {
        this.a.selectors = a;
      },
    },
  });
  var Mf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.earthEngineDestination = null == a.Sb ? null : a.Sb;
  };
  q(Mf, B);
  Mf.prototype.f = function () {
    return {
      keys: ["earthEngineDestination"],
      s: { earthEngineDestination: Bf },
    };
  };
  l.Object.defineProperties(Mf.prototype, {
    Sb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "earthEngineDestination")
          ? E(this, "earthEngineDestination")
          : null;
      },
      set: function (a) {
        this.a.earthEngineDestination = a;
      },
    },
  });
  var Nf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.driveDestination = null == a.ja ? null : a.ja;
    this.a.cloudStorageDestination = null == a.ub ? null : a.ub;
    this.a.gcsDestination = null == a.ma ? null : a.ma;
    this.a.fileFormat = null == a.C ? null : a.C;
  };
  q(Nf, B);
  Nf.prototype.f = function () {
    return {
      K: { fileFormat: Oe },
      keys: [
        "cloudStorageDestination",
        "driveDestination",
        "fileFormat",
        "gcsDestination",
      ],
      s: {
        cloudStorageDestination: hf,
        driveDestination: uf,
        gcsDestination: Vf,
      },
    };
  };
  l.Object.defineProperties(Nf.prototype, {
    ub: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudStorageDestination")
          ? E(this, "cloudStorageDestination")
          : null;
      },
      set: function (a) {
        this.a.cloudStorageDestination = a;
      },
    },
    ja: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "driveDestination") ? E(this, "driveDestination") : null;
      },
      set: function (a) {
        this.a.driveDestination = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    ma: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "gcsDestination") ? E(this, "gcsDestination") : null;
      },
      set: function (a) {
        this.a.gcsDestination = a;
      },
    },
  });
  var ng = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.properties = null == a.properties ? null : a.properties;
    this.a.uriPrefix = null == a.sd ? null : a.sd;
    this.a.sources = null == a.sources ? null : a.sources;
    this.a.startTime = null == a.startTime ? null : a.startTime;
    this.a.endTime = null == a.endTime ? null : a.endTime;
  };
  q(ng, B);
  ng.prototype.f = function () {
    return {
      R: { sources: Bg },
      keys: "endTime name properties sources startTime uriPrefix".split(" "),
      Ba: { properties: { ia: null, oa: !1, pa: !1, qa: !1 } },
    };
  };
  l.Object.defineProperties(ng.prototype, {
    endTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endTime") ? E(this, "endTime") : null;
      },
      set: function (a) {
        this.a.endTime = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    properties: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "properties") ? E(this, "properties") : null;
      },
      set: function (a) {
        this.a.properties = a;
      },
    },
    sources: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sources") ? E(this, "sources") : null;
      },
      set: function (a) {
        this.a.sources = a;
      },
    },
    startTime: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startTime") ? E(this, "startTime") : null;
      },
      set: function (a) {
        this.a.startTime = a;
      },
    },
    sd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uriPrefix") ? E(this, "uriPrefix") : null;
      },
      set: function (a) {
        this.a.uriPrefix = a;
      },
    },
  });
  var Bg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.uris = null == a.wa ? null : a.wa;
    this.a.charset = null == a.charset ? null : a.charset;
    this.a.maxErrorMeters = null == a.Wb ? null : a.Wb;
    this.a.maxVertices = null == a.maxVertices ? null : a.maxVertices;
    this.a.crs = null == a.crs ? null : a.crs;
    this.a.geodesic = null == a.geodesic ? null : a.geodesic;
    this.a.primaryGeometryColumn = null == a.Qh ? null : a.Qh;
    this.a.xColumn = null == a.ri ? null : a.ri;
    this.a.yColumn = null == a.si ? null : a.si;
    this.a.dateFormat = null == a.Qg ? null : a.Qg;
    this.a.csvDelimiter = null == a.Mg ? null : a.Mg;
    this.a.csvQualifier = null == a.Ng ? null : a.Ng;
  };
  q(Bg, B);
  Bg.prototype.f = function () {
    return {
      keys: "charset crs csvDelimiter csvQualifier dateFormat geodesic maxErrorMeters maxVertices primaryGeometryColumn uris xColumn yColumn".split(
        " "
      ),
    };
  };
  l.Object.defineProperties(Bg.prototype, {
    charset: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "charset") ? E(this, "charset") : null;
      },
      set: function (a) {
        this.a.charset = a;
      },
    },
    crs: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "crs") ? E(this, "crs") : null;
      },
      set: function (a) {
        this.a.crs = a;
      },
    },
    Mg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "csvDelimiter") ? E(this, "csvDelimiter") : null;
      },
      set: function (a) {
        this.a.csvDelimiter = a;
      },
    },
    Ng: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "csvQualifier") ? E(this, "csvQualifier") : null;
      },
      set: function (a) {
        this.a.csvQualifier = a;
      },
    },
    Qg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dateFormat") ? E(this, "dateFormat") : null;
      },
      set: function (a) {
        this.a.dateFormat = a;
      },
    },
    geodesic: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "geodesic") ? E(this, "geodesic") : null;
      },
      set: function (a) {
        this.a.geodesic = a;
      },
    },
    Wb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxErrorMeters") ? E(this, "maxErrorMeters") : null;
      },
      set: function (a) {
        this.a.maxErrorMeters = a;
      },
    },
    maxVertices: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxVertices") ? E(this, "maxVertices") : null;
      },
      set: function (a) {
        this.a.maxVertices = a;
      },
    },
    Qh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "primaryGeometryColumn")
          ? E(this, "primaryGeometryColumn")
          : null;
      },
      set: function (a) {
        this.a.primaryGeometryColumn = a;
      },
    },
    wa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "uris") ? E(this, "uris") : null;
      },
      set: function (a) {
        this.a.uris = a;
      },
    },
    ri: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "xColumn") ? E(this, "xColumn") : null;
      },
      set: function (a) {
        this.a.xColumn = a;
      },
    },
    si: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "yColumn") ? E(this, "yColumn") : null;
      },
      set: function (a) {
        this.a.yColumn = a;
      },
    },
  });
  var eg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.tileDimensions = null == a.Na ? null : a.Na;
    this.a.marginDimensions = null == a.Af ? null : a.Af;
    this.a.compress = null == a.Ue ? null : a.Ue;
    this.a.maxSizeBytes = null == a.Xb ? null : a.Xb;
    this.a.defaultValue = null == a.defaultValue ? null : a.defaultValue;
    this.a.tensorDepths = null == a.fe ? null : a.fe;
    this.a.sequenceData = null == a.Vf ? null : a.Vf;
    this.a.collapseBands = null == a.Se ? null : a.Se;
    this.a.maxMaskedRatio = null == a.Df ? null : a.Df;
  };
  q(eg, B);
  eg.prototype.f = function () {
    return {
      keys: "collapseBands compress defaultValue marginDimensions maxMaskedRatio maxSizeBytes sequenceData tensorDepths tileDimensions".split(
        " "
      ),
      Ba: { tensorDepths: { ia: null, oa: !1, pa: !1, qa: !1 } },
      s: { marginDimensions: Xf, tileDimensions: Xf },
    };
  };
  l.Object.defineProperties(eg.prototype, {
    Se: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "collapseBands") ? E(this, "collapseBands") : null;
      },
      set: function (a) {
        this.a.collapseBands = a;
      },
    },
    Ue: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "compress") ? E(this, "compress") : null;
      },
      set: function (a) {
        this.a.compress = a;
      },
    },
    defaultValue: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "defaultValue") ? E(this, "defaultValue") : null;
      },
      set: function (a) {
        this.a.defaultValue = a;
      },
    },
    Af: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "marginDimensions") ? E(this, "marginDimensions") : null;
      },
      set: function (a) {
        this.a.marginDimensions = a;
      },
    },
    Df: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxMaskedRatio") ? E(this, "maxMaskedRatio") : null;
      },
      set: function (a) {
        this.a.maxMaskedRatio = a;
      },
    },
    Xb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxSizeBytes") ? E(this, "maxSizeBytes") : null;
      },
      set: function (a) {
        this.a.maxSizeBytes = a;
      },
    },
    Vf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sequenceData") ? E(this, "sequenceData") : null;
      },
      set: function (a) {
        this.a.sequenceData = a;
      },
    },
    fe: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tensorDepths") ? E(this, "tensorDepths") : null;
      },
      set: function (a) {
        this.a.tensorDepths = a;
      },
    },
    Na: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileDimensions") ? E(this, "tileDimensions") : null;
      },
      set: function (a) {
        this.a.tileDimensions = a;
      },
    },
  });
  var Cg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.expression = null == a.i ? null : a.i;
    this.a.fileFormat = null == a.C ? null : a.C;
    this.a.bandIds = null == a.da ? null : a.da;
    this.a.visualizationOptions = null == a.fc ? null : a.fc;
    this.a.grid = null == a.L ? null : a.L;
    this.a.filenamePrefix = null == a.fa ? null : a.fa;
  };
  q(Cg, B);
  Cg.prototype.f = function () {
    return {
      K: { fileFormat: Qe },
      keys: "bandIds expression fileFormat filenamePrefix grid name visualizationOptions".split(
        " "
      ),
      s: { expression: lf, grid: If, visualizationOptions: Df },
    };
  };
  l.Object.defineProperties(Cg.prototype, {
    da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bandIds") ? E(this, "bandIds") : null;
      },
      set: function (a) {
        this.a.bandIds = a;
      },
    },
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    fa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "filenamePrefix") ? E(this, "filenamePrefix") : null;
      },
      set: function (a) {
        this.a.filenamePrefix = a;
      },
    },
    L: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "grid") ? E(this, "grid") : null;
      },
      set: function (a) {
        this.a.grid = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    fc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "visualizationOptions")
          ? E(this, "visualizationOptions")
          : null;
      },
      set: function (a) {
        this.a.visualizationOptions = a;
      },
    },
  });
  var Kf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.endZoom = null == a.Vg ? null : a.Vg;
    this.a.maxZoom = null == a.maxZoom ? null : a.maxZoom;
    this.a.scale = null == a.scale ? null : a.scale;
    this.a.startZoom = null == a.ei ? null : a.ei;
    this.a.minZoom = null == a.minZoom ? null : a.minZoom;
    this.a.skipEmpty = null == a.ci ? null : a.ci;
    this.a.skipEmptyTiles = null == a.ag ? null : a.ag;
    this.a.mapsApiKey = null == a.zf ? null : a.zf;
    this.a.dimensions = null == a.dimensions ? null : a.dimensions;
    this.a.tileDimensions = null == a.Na ? null : a.Na;
    this.a.stride = null == a.bg ? null : a.bg;
    this.a.zoomSubset = null == a.mg ? null : a.mg;
  };
  q(Kf, B);
  Kf.prototype.f = function () {
    return {
      keys: "dimensions endZoom mapsApiKey maxZoom minZoom scale skipEmpty skipEmptyTiles startZoom stride tileDimensions zoomSubset".split(
        " "
      ),
      s: { dimensions: Xf, tileDimensions: Xf, zoomSubset: Dg },
    };
  };
  l.Object.defineProperties(Kf.prototype, {
    dimensions: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dimensions") ? E(this, "dimensions") : null;
      },
      set: function (a) {
        this.a.dimensions = a;
      },
    },
    Vg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "endZoom") ? E(this, "endZoom") : null;
      },
      set: function (a) {
        this.a.endZoom = a;
      },
    },
    zf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "mapsApiKey") ? E(this, "mapsApiKey") : null;
      },
      set: function (a) {
        this.a.mapsApiKey = a;
      },
    },
    maxZoom: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxZoom") ? E(this, "maxZoom") : null;
      },
      set: function (a) {
        this.a.maxZoom = a;
      },
    },
    minZoom: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "minZoom") ? E(this, "minZoom") : null;
      },
      set: function (a) {
        this.a.minZoom = a;
      },
    },
    scale: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "scale") ? E(this, "scale") : null;
      },
      set: function (a) {
        this.a.scale = a;
      },
    },
    ci: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "skipEmpty") ? E(this, "skipEmpty") : null;
      },
      set: function (a) {
        this.a.skipEmpty = a;
      },
    },
    ag: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "skipEmptyTiles") ? E(this, "skipEmptyTiles") : null;
      },
      set: function (a) {
        this.a.skipEmptyTiles = a;
      },
    },
    ei: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "startZoom") ? E(this, "startZoom") : null;
      },
      set: function (a) {
        this.a.startZoom = a;
      },
    },
    bg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "stride") ? E(this, "stride") : null;
      },
      set: function (a) {
        this.a.stride = a;
      },
    },
    Na: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tileDimensions") ? E(this, "tileDimensions") : null;
      },
      set: function (a) {
        this.a.tileDimensions = a;
      },
    },
    mg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "zoomSubset") ? E(this, "zoomSubset") : null;
      },
      set: function (a) {
        this.a.zoomSubset = a;
      },
    },
  });
  var ig = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.id = null == a.id ? null : a.id;
    this.a.sources = null == a.sources ? null : a.sources;
    this.a.dataType = null == a.dataType ? null : a.dataType;
    this.a.crs = null == a.crs ? null : a.crs;
    this.a.subdatasetPrefix = null == a.gi ? null : a.gi;
    this.a.subdatasetSuffix = null == a.hi ? null : a.hi;
  };
  q(ig, B);
  ig.prototype.f = function () {
    return {
      R: { sources: kg },
      K: { dataType: Se },
      keys: "crs dataType id sources subdatasetPrefix subdatasetSuffix".split(
        " "
      ),
    };
  };
  l.Object.defineProperties(ig.prototype, {
    crs: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "crs") ? E(this, "crs") : null;
      },
      set: function (a) {
        this.a.crs = a;
      },
    },
    dataType: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dataType") ? E(this, "dataType") : null;
      },
      set: function (a) {
        this.a.dataType = a;
      },
    },
    id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "id") ? E(this, "id") : null;
      },
      set: function (a) {
        this.a.id = a;
      },
    },
    sources: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sources") ? E(this, "sources") : null;
      },
      set: function (a) {
        this.a.sources = a;
      },
    },
    gi: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "subdatasetPrefix") ? E(this, "subdatasetPrefix") : null;
      },
      set: function (a) {
        this.a.subdatasetPrefix = a;
      },
    },
    hi: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "subdatasetSuffix") ? E(this, "subdatasetSuffix") : null;
      },
      set: function (a) {
        this.a.subdatasetSuffix = a;
      },
    },
  });
  var gg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.id = null == a.id ? null : a.id;
    this.a.tilesetId = null == a.Dc ? null : a.Dc;
    this.a.tilesetBandIndex = null == a.li ? null : a.li;
    this.a.missingData = null == a.missingData ? null : a.missingData;
    this.a.pyramidingPolicy =
      null == a.pyramidingPolicy ? null : a.pyramidingPolicy;
  };
  q(gg, B);
  gg.prototype.f = function () {
    return {
      K: { pyramidingPolicy: Re },
      keys: [
        "id",
        "missingData",
        "pyramidingPolicy",
        "tilesetBandIndex",
        "tilesetId",
      ],
      s: { missingData: dg },
    };
  };
  l.Object.defineProperties(gg.prototype, {
    id: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "id") ? E(this, "id") : null;
      },
      set: function (a) {
        this.a.id = a;
      },
    },
    missingData: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "missingData") ? E(this, "missingData") : null;
      },
      set: function (a) {
        this.a.missingData = a;
      },
    },
    pyramidingPolicy: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pyramidingPolicy") ? E(this, "pyramidingPolicy") : null;
      },
      set: function (a) {
        this.a.pyramidingPolicy = a;
      },
    },
    li: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesetBandIndex") ? E(this, "tilesetBandIndex") : null;
      },
      set: function (a) {
        this.a.tilesetBandIndex = a;
      },
    },
    Dc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesetId") ? E(this, "tilesetId") : null;
      },
      set: function (a) {
        this.a.tilesetId = a;
      },
    },
  });
  var hg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.tilesetId = null == a.Dc ? null : a.Dc;
    this.a.bandIds = null == a.da ? null : a.da;
  };
  q(hg, B);
  hg.prototype.f = function () {
    return { keys: ["bandIds", "tilesetId"] };
  };
  l.Object.defineProperties(hg.prototype, {
    da: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bandIds") ? E(this, "bandIds") : null;
      },
      set: function (a) {
        this.a.bandIds = a;
      },
    },
    Dc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesetId") ? E(this, "tilesetId") : null;
      },
      set: function (a) {
        this.a.tilesetId = a;
      },
    },
  });
  var zf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.sources = null == a.sources ? null : a.sources;
    this.a.pathPrefix = null == a.pathPrefix ? null : a.pathPrefix;
  };
  q(zf, B);
  zf.prototype.f = function () {
    return { R: { sources: Eg }, keys: ["pathPrefix", "sources"] };
  };
  l.Object.defineProperties(zf.prototype, {
    pathPrefix: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pathPrefix") ? E(this, "pathPrefix") : null;
      },
      set: function (a) {
        this.a.pathPrefix = a;
      },
    },
    sources: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sources") ? E(this, "sources") : null;
      },
      set: function (a) {
        this.a.sources = a;
      },
    },
  });
  var Af = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.sources = null == a.sources ? null : a.sources;
    this.a.pathPrefix = null == a.pathPrefix ? null : a.pathPrefix;
  };
  q(Af, B);
  Af.prototype.f = function () {
    return { R: { sources: Eg }, keys: ["pathPrefix", "sources"] };
  };
  l.Object.defineProperties(Af.prototype, {
    pathPrefix: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pathPrefix") ? E(this, "pathPrefix") : null;
      },
      set: function (a) {
        this.a.pathPrefix = a;
      },
    },
    sources: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "sources") ? E(this, "sources") : null;
      },
      set: function (a) {
        this.a.sources = a;
      },
    },
  });
  var Eg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.pathSuffix = null == a.pathSuffix ? null : a.pathSuffix;
    this.a.headerSizeBytes = null == a.lh ? null : a.lh;
  };
  q(Eg, B);
  Eg.prototype.f = function () {
    return { keys: ["headerSizeBytes", "pathSuffix"] };
  };
  l.Object.defineProperties(Eg.prototype, {
    lh: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "headerSizeBytes") ? E(this, "headerSizeBytes") : null;
      },
      set: function (a) {
        this.a.headerSizeBytes = a;
      },
    },
    pathSuffix: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "pathSuffix") ? E(this, "pathSuffix") : null;
      },
      set: function (a) {
        this.a.pathSuffix = a;
      },
    },
  });
  var bg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.fileIndexes = null == a.Yg ? null : a.Yg;
    this.a.firstTileIndex = null == a.$g ? null : a.$g;
    this.a.tilesPerFile = null == a.ki ? null : a.ki;
  };
  q(bg, B);
  bg.prototype.f = function () {
    return { keys: ["fileIndexes", "firstTileIndex", "tilesPerFile"] };
  };
  l.Object.defineProperties(bg.prototype, {
    Yg: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileIndexes") ? E(this, "fileIndexes") : null;
      },
      set: function (a) {
        this.a.fileIndexes = a;
      },
    },
    $g: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "firstTileIndex") ? E(this, "firstTileIndex") : null;
      },
      set: function (a) {
        this.a.firstTileIndex = a;
      },
    },
    ki: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "tilesPerFile") ? E(this, "tilesPerFile") : null;
      },
      set: function (a) {
        this.a.tilesPerFile = a;
      },
    },
  });
  var Fg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.asset = null == a.Me ? null : a.Me;
    this.a.updateMask = null == a.Fc ? null : a.Fc;
  };
  q(Fg, B);
  Fg.prototype.f = function () {
    return { keys: ["asset", "updateMask"], s: { asset: vf } };
  };
  l.Object.defineProperties(Fg.prototype, {
    Me: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "asset") ? E(this, "asset") : null;
      },
      set: function (a) {
        this.a.asset = a;
      },
    },
    Fc: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "updateMask") ? E(this, "updateMask") : null;
      },
      set: function (a) {
        this.a.updateMask = a;
      },
    },
  });
  var Ze = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.constantValue = null == a.kb ? null : a.kb;
    this.a.integerValue = null == a.Vb ? null : a.Vb;
    this.a.bytesValue = null == a.tb ? null : a.tb;
    this.a.arrayValue = null == a.Fa ? null : a.Fa;
    this.a.dictionaryValue = null == a.Ga ? null : a.Ga;
    this.a.functionDefinitionValue = null == a.Va ? null : a.Va;
    this.a.functionInvocationValue = null == a.ya ? null : a.ya;
    this.a.argumentReference = null == a.Pb ? null : a.Pb;
    this.a.valueReference = null == a.Pa ? null : a.Pa;
  };
  q(Ze, B);
  Ze.prototype.f = function () {
    return {
      keys: "argumentReference arrayValue bytesValue constantValue dictionaryValue functionDefinitionValue functionInvocationValue integerValue valueReference".split(
        " "
      ),
      s: {
        arrayValue: Ye,
        dictionaryValue: sf,
        functionDefinitionValue: Tf,
        functionInvocationValue: Uf,
      },
    };
  };
  l.Object.defineProperties(Ze.prototype, {
    Pb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "argumentReference")
          ? E(this, "argumentReference")
          : null;
      },
      set: function (a) {
        this.a.argumentReference = a;
      },
    },
    Fa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "arrayValue") ? E(this, "arrayValue") : null;
      },
      set: function (a) {
        this.a.arrayValue = a;
      },
    },
    tb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "bytesValue") ? E(this, "bytesValue") : null;
      },
      set: function (a) {
        this.a.bytesValue = a;
      },
    },
    kb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "constantValue") ? E(this, "constantValue") : null;
      },
      set: function (a) {
        this.a.constantValue = a;
      },
    },
    Ga: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "dictionaryValue") ? E(this, "dictionaryValue") : null;
      },
      set: function (a) {
        this.a.dictionaryValue = a;
      },
    },
    Va: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "functionDefinitionValue")
          ? E(this, "functionDefinitionValue")
          : null;
      },
      set: function (a) {
        this.a.functionDefinitionValue = a;
      },
    },
    ya: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "functionInvocationValue")
          ? E(this, "functionInvocationValue")
          : null;
      },
      set: function (a) {
        this.a.functionInvocationValue = a;
      },
    },
    Vb: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "integerValue") ? E(this, "integerValue") : null;
      },
      set: function (a) {
        this.a.integerValue = a;
      },
    },
    Pa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "valueReference") ? E(this, "valueReference") : null;
      },
      set: function (a) {
        this.a.valueReference = a;
      },
    },
  });
  var Pf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.driveDestination = null == a.ja ? null : a.ja;
    this.a.cloudStorageDestination = null == a.ub ? null : a.ub;
    this.a.gcsDestination = null == a.ma ? null : a.ma;
    this.a.fileFormat = null == a.C ? null : a.C;
  };
  q(Pf, B);
  Pf.prototype.f = function () {
    return {
      K: { fileFormat: Te },
      keys: [
        "cloudStorageDestination",
        "driveDestination",
        "fileFormat",
        "gcsDestination",
      ],
      s: {
        cloudStorageDestination: hf,
        driveDestination: uf,
        gcsDestination: Vf,
      },
    };
  };
  l.Object.defineProperties(Pf.prototype, {
    ub: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "cloudStorageDestination")
          ? E(this, "cloudStorageDestination")
          : null;
      },
      set: function (a) {
        this.a.cloudStorageDestination = a;
      },
    },
    ja: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "driveDestination") ? E(this, "driveDestination") : null;
      },
      set: function (a) {
        this.a.driveDestination = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    ma: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "gcsDestination") ? E(this, "gcsDestination") : null;
      },
      set: function (a) {
        this.a.gcsDestination = a;
      },
    },
  });
  var Qf = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.framesPerSecond =
      null == a.framesPerSecond ? null : a.framesPerSecond;
    this.a.maxFrames = null == a.maxFrames ? null : a.maxFrames;
    this.a.maxPixelsPerFrame =
      null == a.maxPixelsPerFrame ? null : a.maxPixelsPerFrame;
  };
  q(Qf, B);
  Qf.prototype.f = function () {
    return { keys: ["framesPerSecond", "maxFrames", "maxPixelsPerFrame"] };
  };
  l.Object.defineProperties(Qf.prototype, {
    framesPerSecond: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "framesPerSecond") ? E(this, "framesPerSecond") : null;
      },
      set: function (a) {
        this.a.framesPerSecond = a;
      },
    },
    maxFrames: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxFrames") ? E(this, "maxFrames") : null;
      },
      set: function (a) {
        this.a.maxFrames = a;
      },
    },
    maxPixelsPerFrame: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "maxPixelsPerFrame")
          ? E(this, "maxPixelsPerFrame")
          : null;
      },
      set: function (a) {
        this.a.maxPixelsPerFrame = a;
      },
    },
  });
  var Gg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.name = null == a.name ? null : a.name;
    this.a.expression = null == a.i ? null : a.i;
    this.a.videoOptions = null == a.Qa ? null : a.Qa;
    this.a.fileFormat = null == a.C ? null : a.C;
    this.a.grid = null == a.L ? null : a.L;
  };
  q(Gg, B);
  Gg.prototype.f = function () {
    return {
      K: { fileFormat: Ue },
      keys: ["expression", "fileFormat", "grid", "name", "videoOptions"],
      s: { expression: lf, grid: If, videoOptions: Qf },
    };
  };
  l.Object.defineProperties(Gg.prototype, {
    i: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "expression") ? E(this, "expression") : null;
      },
      set: function (a) {
        this.a.expression = a;
      },
    },
    C: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "fileFormat") ? E(this, "fileFormat") : null;
      },
      set: function (a) {
        this.a.fileFormat = a;
      },
    },
    L: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "grid") ? E(this, "grid") : null;
      },
      set: function (a) {
        this.a.grid = a;
      },
    },
    name: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "name") ? E(this, "name") : null;
      },
      set: function (a) {
        this.a.name = a;
      },
    },
    Qa: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "videoOptions") ? E(this, "videoOptions") : null;
      },
      set: function (a) {
        this.a.videoOptions = a;
      },
    },
  });
  var Df = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.ranges = null == a.Nf ? null : a.Nf;
    this.a.paletteColors = null == a.hd ? null : a.hd;
    this.a.gamma = null == a.gamma ? null : a.gamma;
    this.a.opacity = null == a.opacity ? null : a.opacity;
  };
  q(Df, B);
  Df.prototype.f = function () {
    return {
      R: { ranges: tf },
      keys: ["gamma", "opacity", "paletteColors", "ranges"],
    };
  };
  l.Object.defineProperties(Df.prototype, {
    gamma: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "gamma") ? E(this, "gamma") : null;
      },
      set: function (a) {
        this.a.gamma = a;
      },
    },
    opacity: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "opacity") ? E(this, "opacity") : null;
      },
      set: function (a) {
        this.a.opacity = a;
      },
    },
    hd: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "paletteColors") ? E(this, "paletteColors") : null;
      },
      set: function (a) {
        this.a.paletteColors = a;
      },
    },
    Nf: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "ranges") ? E(this, "ranges") : null;
      },
      set: function (a) {
        this.a.ranges = a;
      },
    },
  });
  var Dg = function (a) {
    a = void 0 === a ? {} : a;
    this.a = {};
    this.a.start = null == a.start ? null : a.start;
    this.a.end = null == a.end ? null : a.end;
    this.a.min = null == a.min ? null : a.min;
    this.a.max = null == a.max ? null : a.max;
  };
  q(Dg, B);
  Dg.prototype.f = function () {
    return { keys: ["end", "max", "min", "start"] };
  };
  l.Object.defineProperties(Dg.prototype, {
    end: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "end") ? E(this, "end") : null;
      },
      set: function (a) {
        this.a.end = a;
      },
    },
    max: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "max") ? E(this, "max") : null;
      },
      set: function (a) {
        this.a.max = a;
      },
    },
    min: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "min") ? E(this, "min") : null;
      },
      set: function (a) {
        this.a.min = a;
      },
    },
    start: {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return F(this, "start") ? E(this, "start") : null;
      },
      set: function (a) {
        this.a.start = a;
      },
    },
  });
  var le = {
      $Xgafv: "$.xgafv",
      access_token: "access_token",
      alt: "alt",
      assetId: "assetId",
      callback: "callback",
      endTime: "endTime",
      fields: "fields",
      filter: "filter",
      key: "key",
      oauth_token: "oauth_token",
      overwrite: "overwrite",
      pageSize: "pageSize",
      pageToken: "pageToken",
      prettyPrint: "prettyPrint",
      quotaUser: "quotaUser",
      region: "region",
      startTime: "startTime",
      uploadType: "uploadType",
      upload_protocol: "upload_protocol",
      view: "view",
    },
    Hg = function (a) {
      this.j = "v1alpha";
      this.h = new pe(a, null);
    };
  Hg.prototype.list = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.algorithms.list",
      path: "/" + this.j + "/" + a + "/algorithms",
      o: G(b),
      G: og,
    });
  };
  var Ig = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Ig.prototype.getCapabilities = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.getCapabilities",
      path: "/" + this.j + "/" + a + "/capabilities",
      o: G(b),
      G: ff,
    });
  };
  Ig.prototype.bd = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.listAssets",
      path: "/" + this.j + "/" + a + ":listAssets",
      o: G(b),
      G: pg,
    });
  };
  var Jg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  k = Jg.prototype;
  k.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.assets.create",
      path: "/" + this.j + "/" + a + "/assets",
      o: G(c),
      G: vf,
    });
  };
  k.delete = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    return H(this.h, {
      body: null,
      u: "DELETE",
      D: "earthengine.projects.assets.delete",
      path: "/" + this.j + "/" + a,
      o: G(b),
      G: Ef,
    });
  };
  k.get = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.assets.get",
      path: "/" + this.j + "/" + a,
      o: G(b),
      G: vf,
    });
  };
  k.link = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.assets.link",
      path: "/" + this.j + "/" + a + ":link",
      o: G(c),
      G: vf,
    });
  };
  k.bd = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.assets.listAssets",
      path: "/" + this.j + "/" + a + ":listAssets",
      o: G(b),
      G: pg,
    });
  };
  var Kg = function (a, b, c) {
    c = void 0 === c ? {} : c;
    a.h.B(b, /^projects\/[^/]+\/assets\/.*$/);
    return H(a.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.assets.listImages",
      path: "/" + a.j + "/" + b + ":listImages",
      o: G(c),
      G: qg,
    });
  };
  Jg.prototype.move = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.assets.move",
      path: "/" + this.j + "/" + a + ":move",
      o: G(c),
      G: vf,
    });
  };
  var Lg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Lg.prototype.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.filmstripThumbnails.create",
      path: "/" + this.j + "/" + a + "/filmstripThumbnails",
      o: G(c),
      G: Sf,
    });
  };
  var Mg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Mg.prototype.mb = function (a, b) {
    var c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.image.export",
      path: "/" + this.j + "/" + a + "/image:export",
      o: G(c),
      G: sg,
    });
  };
  Mg.prototype.import = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.image.import",
      path: "/" + this.j + "/" + a + "/image:import",
      o: G(c),
      G: sg,
    });
  };
  var Ng = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Ng.prototype.mb = function (a, b) {
    var c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.map.export",
      path: "/" + this.j + "/" + a + "/map:export",
      o: G(c),
      G: sg,
    });
  };
  var Og = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Og.prototype.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.maps.create",
      path: "/" + this.j + "/" + a + "/maps",
      o: G(c),
      G: Cf,
    });
  };
  var Pg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  k = Pg.prototype;
  k.cancel = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+\/operations\/.*$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.operations.cancel",
      path: "/" + this.j + "/" + a + ":cancel",
      o: G(c),
      G: Ef,
    });
  };
  k.delete = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+\/operations\/.*$/);
    return H(this.h, {
      body: null,
      u: "DELETE",
      D: "earthengine.projects.operations.delete",
      path: "/" + this.j + "/" + a,
      o: G(b),
      G: Ef,
    });
  };
  k.get = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+\/operations\/.*$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.operations.get",
      path: "/" + this.j + "/" + a,
      o: G(b),
      G: sg,
    });
  };
  k.list = function (a, b) {
    b = void 0 === b ? {} : b;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: null,
      u: "GET",
      D: "earthengine.projects.operations.list",
      path: "/" + this.j + "/" + a + "/operations",
      o: G(b),
      G: rg,
    });
  };
  k.wait = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+\/operations\/.*$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.operations.wait",
      path: "/" + this.j + "/" + a + ":wait",
      o: G(c),
      G: sg,
    });
  };
  var Qg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Qg.prototype.mb = function (a, b) {
    var c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.table.export",
      path: "/" + this.j + "/" + a + "/table:export",
      o: G(c),
      G: sg,
    });
  };
  Qg.prototype.import = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.table.import",
      path: "/" + this.j + "/" + a + "/table:import",
      o: G(c),
      G: sg,
    });
  };
  var Rg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Rg.prototype.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.tables.create",
      path: "/" + this.j + "/" + a + "/tables",
      o: G(c),
      G: Ag,
    });
  };
  var Sg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Sg.prototype.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.thumbnails.create",
      path: "/" + this.j + "/" + a + "/thumbnails",
      o: G(c),
      G: Cg,
    });
  };
  var Tg = function (a) {
      this.j = "v1alpha";
      this.h = new pe(a, null);
    },
    Ug = function (a, b, c) {
      var d = void 0 === d ? {} : d;
      a.h.B(b, /^projects\/[^/]+$/);
      return H(a.h, {
        body: c,
        u: "POST",
        D: "earthengine.projects.value.compute",
        path: "/" + a.j + "/" + b + "/value:compute",
        o: G(d),
        G: mf,
      });
    },
    Vg = function (a) {
      this.j = "v1alpha";
      this.h = new pe(a, null);
    };
  Vg.prototype.mb = function (a, b) {
    var c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.video.export",
      path: "/" + this.j + "/" + a + "/video:export",
      o: G(c),
      G: sg,
    });
  };
  var Wg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Wg.prototype.mb = function (a, b) {
    var c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.videoMap.export",
      path: "/" + this.j + "/" + a + "/videoMap:export",
      o: G(c),
      G: sg,
    });
  };
  var Xg = function (a) {
    this.j = "v1alpha";
    this.h = new pe(a, null);
  };
  Xg.prototype.create = function (a, b, c) {
    c = void 0 === c ? {} : c;
    this.h.B(a, /^projects\/[^/]+$/);
    return H(this.h, {
      body: b,
      u: "POST",
      D: "earthengine.projects.videoThumbnails.create",
      path: "/" + this.j + "/" + a + "/videoThumbnails",
      o: G(c),
      G: Gg,
    });
  };
  var Yg = function () {};
  Yg.prototype.send = function (a, b) {
    ke(a);
    return (void 0).then(function (c) {
      return b ? Jd(b, c) : c;
    });
  };
  var Zg = function (a, b) {
    this.Zj = 100;
    this.Pj = a;
    this.jk = b;
    this.Vd = 0;
    this.na = null;
  };
  Zg.prototype.get = function () {
    if (0 < this.Vd) {
      this.Vd--;
      var a = this.na;
      this.na = a.next;
      a.next = null;
    } else a = this.Pj();
    return a;
  };
  Zg.prototype.put = function (a) {
    this.jk(a);
    this.Vd < this.Zj && (this.Vd++, (a.next = this.na), (this.na = a));
  };
  var $g = !rc || 9 <= Number(Ec),
    ah = (!tc && !rc) || (rc && 9 <= Number(Ec)) || (tc && Bc("1.9.1"));
  var bh = function (a, b) {
    this.x = void 0 !== a ? a : 0;
    this.y = void 0 !== b ? b : 0;
  };
  k = bh.prototype;
  k.clone = function () {
    return new bh(this.x, this.y);
  };
  k.toString = function () {
    return "(" + this.x + ", " + this.y + ")";
  };
  k.equals = function (a) {
    return (
      a instanceof bh &&
      (this == a ? !0 : this && a ? this.x == a.x && this.y == a.y : !1)
    );
  };
  k.ceil = function () {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  };
  k.floor = function () {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  };
  k.round = function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  };
  k.translate = function (a, b) {
    a instanceof bh
      ? ((this.x += a.x), (this.y += a.y))
      : ((this.x += Number(a)), "number" === typeof b && (this.y += b));
    return this;
  };
  k.scale = function (a, b) {
    this.x *= a;
    this.y *= "number" === typeof b ? b : a;
    return this;
  };
  var ch = function (a, b) {
    this.width = a;
    this.height = b;
  };
  k = ch.prototype;
  k.clone = function () {
    return new ch(this.width, this.height);
  };
  k.toString = function () {
    return "(" + this.width + " x " + this.height + ")";
  };
  k.aspectRatio = function () {
    return this.width / this.height;
  };
  k.isEmpty = function () {
    return !(this.width * this.height);
  };
  k.ceil = function () {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this;
  };
  k.floor = function () {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this;
  };
  k.round = function () {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this;
  };
  k.scale = function (a, b) {
    this.width *= a;
    this.height *= "number" === typeof b ? b : a;
    return this;
  };
  var eh = function (a, b) {
      Bb(b, function (c, d) {
        c && "object" == typeof c && c.sf && (c = c.mf());
        "style" == d
          ? (a.style.cssText = c)
          : "class" == d
          ? (a.className = c)
          : "for" == d
          ? (a.htmlFor = c)
          : dh.hasOwnProperty(d)
          ? a.setAttribute(dh[d], c)
          : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0)
          ? a.setAttribute(d, c)
          : (a[d] = c);
      });
    },
    dh = {
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      colspan: "colSpan",
      frameborder: "frameBorder",
      height: "height",
      maxlength: "maxLength",
      nonce: "nonce",
      role: "role",
      rowspan: "rowSpan",
      type: "type",
      usemap: "useMap",
      valign: "vAlign",
      width: "width",
    },
    gh = function (a, b, c) {
      return fh(document, arguments);
    },
    fh = function (a, b) {
      var c = String(b[0]),
        d = b[1];
      if (!$g && d && (d.name || d.type)) {
        c = ["<", c];
        d.name && c.push(' name="', lc(d.name), '"');
        if (d.type) {
          c.push(' type="', lc(d.type), '"');
          var e = {};
          Qb(e, d);
          delete e.type;
          d = e;
        }
        c.push(">");
        c = c.join("");
      }
      c = hh(a, c);
      d &&
        ("string" === typeof d
          ? (c.className = d)
          : Array.isArray(d)
          ? (c.className = d.join(" "))
          : eh(c, d));
      2 < b.length && ih(a, c, b, 2);
      return c;
    },
    ih = function (a, b, c, d) {
      function e(h) {
        h && b.appendChild("string" === typeof h ? a.createTextNode(h) : h);
      }
      for (; d < c.length; d++) {
        var f = c[d];
        if (!ya(f) || (u(f) && 0 < f.nodeType)) e(f);
        else {
          a: {
            if (f && "number" == typeof f.length) {
              if (u(f)) {
                var g =
                  "function" == typeof f.item || "string" == typeof f.item;
                break a;
              }
              if ("function" === typeof f) {
                g = "function" == typeof f.item;
                break a;
              }
            }
            g = !1;
          }
          Va(g ? ib(f) : f, e);
        }
      }
    },
    hh = function (a, b) {
      b = String(b);
      "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
      return a.createElement(b);
    },
    jh = function (a) {
      return a && a.parentNode ? a.parentNode.removeChild(a) : null;
    },
    kh = function (a) {
      for (; a && 1 != a.nodeType; ) a = a.nextSibling;
      return a;
    },
    lh = function (a) {
      z(a, "Node cannot be null or undefined.");
      return 9 == a.nodeType ? a : a.ownerDocument || a.document;
    },
    mh = function (a) {
      this.Dd = a || r.document || document;
    };
  k = mh.prototype;
  k.getElementsByTagName = function (a, b) {
    return (b || this.Dd).getElementsByTagName(String(a));
  };
  k.Oj = function (a, b, c) {
    return fh(this.Dd, arguments);
  };
  k.createElement = function (a) {
    return hh(this.Dd, a);
  };
  k.createTextNode = function (a) {
    return this.Dd.createTextNode(String(a));
  };
  k.appendChild = function (a, b) {
    z(
      null != a && null != b,
      "goog.dom.appendChild expects non-null arguments"
    );
    a.appendChild(b);
  };
  k.append = function (a, b) {
    ih(lh(a), a, arguments, 1);
  };
  k.canHaveChildren = function (a) {
    if (1 != a.nodeType) return !1;
    switch (a.tagName) {
      case "APPLET":
      case "AREA":
      case "BASE":
      case "BR":
      case "COL":
      case "COMMAND":
      case "EMBED":
      case "FRAME":
      case "HR":
      case "IMG":
      case "INPUT":
      case "IFRAME":
      case "ISINDEX":
      case "KEYGEN":
      case "LINK":
      case "NOFRAMES":
      case "NOSCRIPT":
      case "META":
      case "OBJECT":
      case "PARAM":
      case "SCRIPT":
      case "SOURCE":
      case "STYLE":
      case "TRACK":
      case "WBR":
        return !1;
    }
    return !0;
  };
  k.removeNode = jh;
  k.hh = function () {
    return ah && void 0 != (void 0).children
      ? (void 0).children
      : Wa((void 0).childNodes, function (a) {
          return 1 == a.nodeType;
        });
  };
  k.contains = function (a, b) {
    if (!a || !b) return !1;
    if (a.contains && 1 == b.nodeType) return a == b || a.contains(b);
    if ("undefined" != typeof a.compareDocumentPosition)
      return a == b || !!(a.compareDocumentPosition(b) & 16);
    for (; b && a != b; ) b = b.parentNode;
    return b == a;
  };
  var nh = function (a) {
      r.setTimeout(function () {
        throw a;
      }, 0);
    },
    oh,
    ph = function () {
      var a = r.MessageChannel;
      "undefined" === typeof a &&
        "undefined" !== typeof window &&
        window.postMessage &&
        window.addEventListener &&
        !Ab("Presto") &&
        (a = function () {
          var e = hh(document, "IFRAME");
          e.style.display = "none";
          document.documentElement.appendChild(e);
          var f = e.contentWindow;
          e = f.document;
          e.open();
          e.close();
          var g = "callImmediate" + Math.random(),
            h =
              "file:" == f.location.protocol
                ? "*"
                : f.location.protocol + "//" + f.location.host;
          e = v(function (n) {
            if (("*" == h || n.origin == h) && n.data == g)
              this.port1.onmessage();
          }, this);
          f.addEventListener("message", e, !1);
          this.port1 = {};
          this.port2 = {
            postMessage: function () {
              f.postMessage(g, h);
            },
          };
        });
      if ("undefined" !== typeof a && !Ab("Trident") && !Ab("MSIE")) {
        var b = new a(),
          c = {},
          d = c;
        b.port1.onmessage = function () {
          if (void 0 !== c.next) {
            c = c.next;
            var e = c.Dg;
            c.Dg = null;
            e();
          }
        };
        return function (e) {
          d.next = { Dg: e };
          d = d.next;
          b.port2.postMessage(0);
        };
      }
      return function (e) {
        r.setTimeout(e, 0);
      };
    };
  var qh = function () {
      this.pe = this.hc = null;
    },
    sh = new Zg(
      function () {
        return new rh();
      },
      function (a) {
        a.reset();
      }
    );
  qh.prototype.add = function (a, b) {
    var c = sh.get();
    c.set(a, b);
    this.pe ? (this.pe.next = c) : (z(!this.hc), (this.hc = c));
    this.pe = c;
  };
  qh.prototype.remove = function () {
    var a = null;
    this.hc &&
      ((a = this.hc),
      (this.hc = this.hc.next),
      this.hc || (this.pe = null),
      (a.next = null));
    return a;
  };
  var rh = function () {
    this.next = this.scope = this.hf = null;
  };
  rh.prototype.set = function (a, b) {
    this.hf = a;
    this.scope = b;
    this.next = null;
  };
  rh.prototype.reset = function () {
    this.next = this.scope = this.hf = null;
  };
  var xh = function (a, b) {
      th || uh();
      vh || (th(), (vh = !0));
      wh.add(a, b);
    },
    th,
    uh = function () {
      if (r.Promise && r.Promise.resolve) {
        var a = r.Promise.resolve(void 0);
        th = function () {
          a.then(yh);
        };
      } else
        th = function () {
          var b = yh;
          "function" !== typeof r.setImmediate ||
          (r.Window &&
            r.Window.prototype &&
            !Ab("Edge") &&
            r.Window.prototype.setImmediate == r.setImmediate)
            ? (oh || (oh = ph()), oh(b))
            : r.setImmediate(b);
        };
    },
    vh = !1,
    wh = new qh(),
    yh = function () {
      for (var a; (a = wh.remove()); ) {
        try {
          a.hf.call(a.scope);
        } catch (b) {
          nh(b);
        }
        sh.put(a);
      }
      vh = !1;
    };
  var zh = function (a) {
    if (!a) return !1;
    try {
      return !!a.$goog_Thenable;
    } catch (b) {
      return !1;
    }
  };
  var Ch = function (a) {
      this.U = 0;
      this.ha = void 0;
      this.nc = this.jb = this.O = null;
      this.Ld = this.ef = !1;
      if (a != wa)
        try {
          var b = this;
          a.call(
            void 0,
            function (c) {
              Ah(b, 2, c);
            },
            function (c) {
              if (!(c instanceof Bh))
                try {
                  if (c instanceof Error) throw c;
                  throw Error("Promise rejected.");
                } catch (d) {}
              Ah(b, 3, c);
            }
          );
        } catch (c) {
          Ah(this, 3, c);
        }
    },
    Dh = function () {
      this.next = this.context = this.vc = this.Zb = this.Qb = null;
      this.wd = !1;
    };
  Dh.prototype.reset = function () {
    this.context = this.vc = this.Zb = this.Qb = null;
    this.wd = !1;
  };
  var Eh = new Zg(
      function () {
        return new Dh();
      },
      function (a) {
        a.reset();
      }
    ),
    Fh = function (a, b, c) {
      var d = Eh.get();
      d.Zb = a;
      d.vc = b;
      d.context = c;
      return d;
    };
  Ch.prototype.then = function (a, b, c) {
    null != a && Ra(a, "opt_onFulfilled should be a function.");
    null != b &&
      Ra(
        b,
        "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
      );
    return Gh(
      this,
      "function" === typeof a ? a : null,
      "function" === typeof b ? b : null,
      c
    );
  };
  Ch.prototype.$goog_Thenable = !0;
  Ch.prototype.cancel = function (a) {
    if (0 == this.U) {
      var b = new Bh(a);
      xh(function () {
        Hh(this, b);
      }, this);
    }
  };
  var Hh = function (a, b) {
      if (0 == a.U)
        if (a.O) {
          var c = a.O;
          if (c.jb) {
            for (
              var d = 0, e = null, f = null, g = c.jb;
              g && (g.wd || (d++, g.Qb == a && (e = g), !(e && 1 < d)));
              g = g.next
            )
              e || (f = g);
            e &&
              (0 == c.U && 1 == d
                ? Hh(c, b)
                : (f
                    ? ((d = f),
                      z(c.jb),
                      z(null != d),
                      d.next == c.nc && (c.nc = d),
                      (d.next = d.next.next))
                    : Ih(c),
                  Jh(c, e, 3, b)));
          }
          a.O = null;
        } else Ah(a, 3, b);
    },
    Lh = function (a, b) {
      a.jb || (2 != a.U && 3 != a.U) || Kh(a);
      z(null != b.Zb);
      a.nc ? (a.nc.next = b) : (a.jb = b);
      a.nc = b;
    },
    Gh = function (a, b, c, d) {
      var e = Fh(null, null, null);
      e.Qb = new Ch(function (f, g) {
        e.Zb = b
          ? function (h) {
              try {
                var n = b.call(d, h);
                f(n);
              } catch (p) {
                g(p);
              }
            }
          : f;
        e.vc = c
          ? function (h) {
              try {
                var n = c.call(d, h);
                void 0 === n && h instanceof Bh ? g(h) : f(n);
              } catch (p) {
                g(p);
              }
            }
          : g;
      });
      e.Qb.O = a;
      Lh(a, e);
      return e.Qb;
    };
  Ch.prototype.uk = function (a) {
    z(1 == this.U);
    this.U = 0;
    Ah(this, 2, a);
  };
  Ch.prototype.vk = function (a) {
    z(1 == this.U);
    this.U = 0;
    Ah(this, 3, a);
  };
  var Ah = function (a, b, c) {
      if (0 == a.U) {
        a === c &&
          ((b = 3), (c = new TypeError("Promise cannot resolve to itself")));
        a.U = 1;
        a: {
          var d = c,
            e = a.uk,
            f = a.vk;
          if (d instanceof Ch) {
            null != e && Ra(e, "opt_onFulfilled should be a function.");
            null != f &&
              Ra(
                f,
                "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
              );
            Lh(d, Fh(e || wa, f || null, a));
            var g = !0;
          } else if (zh(d)) d.then(e, f, a), (g = !0);
          else {
            if (u(d))
              try {
                var h = d.then;
                if ("function" === typeof h) {
                  Mh(d, h, e, f, a);
                  g = !0;
                  break a;
                }
              } catch (n) {
                f.call(a, n);
                g = !0;
                break a;
              }
            g = !1;
          }
        }
        g ||
          ((a.ha = c),
          (a.U = b),
          (a.O = null),
          Kh(a),
          3 != b || c instanceof Bh || Nh(a, c));
      }
    },
    Mh = function (a, b, c, d, e) {
      var f = !1,
        g = function (n) {
          f || ((f = !0), c.call(e, n));
        },
        h = function (n) {
          f || ((f = !0), d.call(e, n));
        };
      try {
        b.call(a, g, h);
      } catch (n) {
        h(n);
      }
    },
    Kh = function (a) {
      a.ef || ((a.ef = !0), xh(a.Sj, a));
    },
    Ih = function (a) {
      var b = null;
      a.jb && ((b = a.jb), (a.jb = b.next), (b.next = null));
      a.jb || (a.nc = null);
      null != b && z(null != b.Zb);
      return b;
    };
  Ch.prototype.Sj = function () {
    for (var a; (a = Ih(this)); ) Jh(this, a, this.U, this.ha);
    this.ef = !1;
  };
  var Jh = function (a, b, c, d) {
      if (3 == c && b.vc && !b.wd) for (; a && a.Ld; a = a.O) a.Ld = !1;
      if (b.Qb) (b.Qb.O = null), Oh(b, c, d);
      else
        try {
          b.wd ? b.Zb.call(b.context) : Oh(b, c, d);
        } catch (e) {
          Ph.call(null, e);
        }
      Eh.put(b);
    },
    Oh = function (a, b, c) {
      2 == b ? a.Zb.call(a.context, c) : a.vc && a.vc.call(a.context, c);
    },
    Nh = function (a, b) {
      a.Ld = !0;
      xh(function () {
        a.Ld && Ph.call(null, b);
      });
    },
    Ph = nh,
    Bh = function (a) {
      Ka.call(this, a);
    };
  x(Bh, Ka);
  Bh.prototype.name = "cancel";
  var Qh = function (a, b) {
    A.call(this);
    this.zb = a || 1;
    this.pd = b || r;
    this.yg = v(this.tk, this);
    this.yh = Date.now();
  };
  x(Qh, A);
  k = Qh.prototype;
  k.enabled = !1;
  k.Y = null;
  k.setInterval = function (a) {
    this.zb = a;
    this.Y && this.enabled
      ? (this.stop(), this.start())
      : this.Y && this.stop();
  };
  k.tk = function () {
    if (this.enabled) {
      var a = Date.now() - this.yh;
      0 < a && a < 0.8 * this.zb
        ? (this.Y = this.pd.setTimeout(this.yg, this.zb - a))
        : (this.Y && (this.pd.clearTimeout(this.Y), (this.Y = null)),
          this.dispatchEvent("tick"),
          this.enabled && (this.stop(), this.start()));
    }
  };
  k.start = function () {
    this.enabled = !0;
    this.Y ||
      ((this.Y = this.pd.setTimeout(this.yg, this.zb)), (this.yh = Date.now()));
  };
  k.stop = function () {
    this.enabled = !1;
    this.Y && (this.pd.clearTimeout(this.Y), (this.Y = null));
  };
  k.A = function () {
    Qh.I.A.call(this);
    this.stop();
    delete this.pd;
  };
  var Rh = function (a, b, c) {
    if ("function" === typeof a) c && (a = v(a, c));
    else if (a && "function" == typeof a.handleEvent) a = v(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : r.setTimeout(a, b || 0);
  };
  var Sh = function (a, b, c) {
    y.call(this);
    this.ed = null != c ? a.bind(c) : a;
    this.zb = b;
    this.xd = null;
    this.Cc = !1;
    this.jd = 0;
    this.Y = null;
  };
  q(Sh, y);
  k = Sh.prototype;
  k.Hd = function (a) {
    this.xd = arguments;
    this.Y || this.jd ? (this.Cc = !0) : this.qc();
  };
  k.stop = function () {
    this.Y &&
      (r.clearTimeout(this.Y),
      (this.Y = null),
      (this.Cc = !1),
      (this.xd = null));
  };
  k.pause = function () {
    this.jd++;
  };
  k.resume = function () {
    this.jd--;
    this.jd || !this.Cc || this.Y || ((this.Cc = !1), this.qc());
  };
  k.A = function () {
    y.prototype.A.call(this);
    this.stop();
  };
  k.qc = function () {
    var a = this;
    this.Y = Rh(function () {
      a.Y = null;
      a.Cc && !a.jd && ((a.Cc = !1), a.qc());
    }, this.zb);
    var b = this.xd;
    this.xd = null;
    this.ed.apply(null, b);
  }; /*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
  var Uh = function (a) {
    var b = Th;
    this.ae = [];
    this.Ih = b;
    this.Rg = a || null;
    this.Xc = this.sc = !1;
    this.ha = void 0;
    this.Zf = this.wg = this.Oe = !1;
    this.ke = 0;
    this.O = null;
    this.Pe = 0;
  };
  Uh.prototype.cancel = function (a) {
    if (this.sc) this.ha instanceof Uh && this.ha.cancel();
    else {
      if (this.O) {
        var b = this.O;
        delete this.O;
        a ? b.cancel(a) : (b.Pe--, 0 >= b.Pe && b.cancel());
      }
      this.Ih ? this.Ih.call(this.Rg, this) : (this.Zf = !0);
      this.sc || Vh(this, new Wh(this));
    }
  };
  Uh.prototype.Hg = function (a, b) {
    this.Oe = !1;
    Xh(this, a, b);
  };
  var Xh = function (a, b, c) {
      a.sc = !0;
      a.ha = c;
      a.Xc = !b;
      Yh(a);
    },
    $h = function (a) {
      if (a.sc) {
        if (!a.Zf) throw new Zh(a);
        a.Zf = !1;
      }
    };
  Uh.prototype.callback = function (a) {
    $h(this);
    ai(a);
    Xh(this, !0, a);
  };
  var Vh = function (a, b) {
      $h(a);
      ai(b);
      Xh(a, !1, b);
    },
    ai = function (a) {
      z(
        !(a instanceof Uh),
        "An execution sequence may not be initiated with a blocking Deferred."
      );
    },
    bi = function (a, b, c) {
      z(!a.wg, "Blocking Deferreds can not be re-used");
      a.ae.push([b, c, void 0]);
      a.sc && Yh(a);
    };
  Uh.prototype.then = function (a, b, c) {
    var d,
      e,
      f = new Ch(function (g, h) {
        d = g;
        e = h;
      });
    bi(this, d, function (g) {
      g instanceof Wh ? f.cancel() : e(g);
    });
    return f.then(a, b, c);
  };
  Uh.prototype.$goog_Thenable = !0;
  var ci = function (a) {
      return Ya(a.ae, function (b) {
        return "function" === typeof b[1];
      });
    },
    Yh = function (a) {
      if (a.ke && a.sc && ci(a)) {
        var b = a.ke,
          c = di[b];
        c && (r.clearTimeout(c.S), delete di[b]);
        a.ke = 0;
      }
      a.O && (a.O.Pe--, delete a.O);
      b = a.ha;
      for (var d = (c = !1); a.ae.length && !a.Oe; ) {
        var e = a.ae.shift(),
          f = e[0],
          g = e[1];
        e = e[2];
        if ((f = a.Xc ? g : f))
          try {
            var h = f.call(e || a.Rg, b);
            void 0 !== h &&
              ((a.Xc = a.Xc && (h == b || h instanceof Error)), (a.ha = b = h));
            if (
              zh(b) ||
              ("function" === typeof r.Promise && b instanceof r.Promise)
            )
              (d = !0), (a.Oe = !0);
          } catch (n) {
            (b = n), (a.Xc = !0), ci(a) || (c = !0);
          }
      }
      a.ha = b;
      d &&
        ((h = v(a.Hg, a, !0)),
        (d = v(a.Hg, a, !1)),
        b instanceof Uh ? (bi(b, h, d), (b.wg = !0)) : b.then(h, d));
      c && ((b = new ei(b)), (di[b.S] = b), (a.ke = b.S));
    },
    Zh = function () {
      Ka.call(this);
    };
  x(Zh, Ka);
  Zh.prototype.message = "Deferred has already fired";
  Zh.prototype.name = "AlreadyCalledError";
  var Wh = function () {
    Ka.call(this);
  };
  x(Wh, Ka);
  Wh.prototype.message = "Deferred was canceled";
  Wh.prototype.name = "CanceledError";
  var ei = function (a) {
    this.S = r.setTimeout(v(this.sk, this), 0);
    this.Gd = a;
  };
  ei.prototype.sk = function () {
    z(di[this.S], "Cannot throw an error that is not scheduled.");
    delete di[this.S];
    throw this.Gd;
  };
  var di = {};
  var ii = function (a) {
      var b = {},
        c = b.document || document,
        d = Zb(a).toString(),
        e = hh(document, "SCRIPT"),
        f = { Zh: e, od: void 0 },
        g = new Uh(f),
        h = null,
        n = null != b.timeout ? b.timeout : 5e3;
      0 < n &&
        ((h = window.setTimeout(function () {
          fi(e, !0);
          Vh(g, new gi(1, "Timeout reached for loading script " + d));
        }, n)),
        (f.od = h));
      e.onload = e.onreadystatechange = function () {
        (e.readyState &&
          "loaded" != e.readyState &&
          "complete" != e.readyState) ||
          (fi(e, b.Ck || !1, h), g.callback(null));
      };
      e.onerror = function () {
        fi(e, !0, h);
        Vh(g, new gi(0, "Error while loading script " + d));
      };
      f = b.attributes || {};
      Qb(f, { type: "text/javascript", charset: "UTF-8" });
      eh(e, f);
      jc(e, a);
      hi(c).appendChild(e);
    },
    hi = function (a) {
      var b;
      return (b = (a || document).getElementsByTagName("HEAD")) && 0 != b.length
        ? b[0]
        : a.documentElement;
    },
    Th = function () {
      if (this && this.Zh) {
        var a = this.Zh;
        a && "SCRIPT" == a.tagName && fi(a, !0, this.od);
      }
    },
    fi = function (a, b, c) {
      null != c && r.clearTimeout(c);
      a.onload = wa;
      a.onerror = wa;
      a.onreadystatechange = wa;
      b &&
        window.setTimeout(function () {
          jh(a);
        }, 0);
    },
    gi = function (a, b) {
      var c = "Jsloader error (code #" + a + ")";
      b && (c += ": " + b);
      Ka.call(this, c);
      this.code = a;
    };
  x(gi, Ka);
  var ki = function (a) {
      return new ji(void 0).X(a);
    },
    ji = function (a) {
      this.Zd = a;
    };
  ji.prototype.X = function (a) {
    var b = [];
    li(this, a, b);
    return b.join("");
  };
  var li = function (a, b, c) {
      if (null == b) c.push("null");
      else {
        if ("object" == typeof b) {
          if (Array.isArray(b)) {
            var d = b;
            b = d.length;
            c.push("[");
            for (var e = "", f = 0; f < b; f++)
              c.push(e),
                (e = d[f]),
                li(a, a.Zd ? a.Zd.call(d, String(f), e) : e, c),
                (e = ",");
            c.push("]");
            return;
          }
          if (
            b instanceof String ||
            b instanceof Number ||
            b instanceof Boolean
          )
            b = b.valueOf();
          else {
            c.push("{");
            f = "";
            for (d in b)
              Object.prototype.hasOwnProperty.call(b, d) &&
                ((e = b[d]),
                "function" != typeof e &&
                  (c.push(f),
                  mi(d, c),
                  c.push(":"),
                  li(a, a.Zd ? a.Zd.call(b, d, e) : e, c),
                  (f = ",")));
            c.push("}");
            return;
          }
        }
        switch (typeof b) {
          case "string":
            mi(b, c);
            break;
          case "number":
            c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");
            break;
          case "boolean":
            c.push(String(b));
            break;
          case "function":
            c.push("null");
            break;
          default:
            throw Error("Unknown type: " + typeof b);
        }
      }
    },
    ni = {
      '"': '\\"',
      "\\": "\\\\",
      "/": "\\/",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\x0B": "\\u000b",
    },
    oi = /\uffff/.test("\uffff")
      ? /[\\"\x00-\x1f\x7f-\uffff]/g
      : /[\\"\x00-\x1f\x7f-\xff]/g,
    mi = function (a, b) {
      b.push(
        '"',
        a.replace(oi, function (c) {
          var d = ni[c];
          d ||
            ((d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).substr(1)),
            (ni[c] = d));
          return d;
        }),
        '"'
      );
    };
  var pi = function (a, b, c) {
    this.reset(a, b, c, void 0, void 0);
  };
  pi.prototype.Wg = null;
  var qi = 0;
  pi.prototype.reset = function (a, b, c, d, e) {
    "number" == typeof e || qi++;
    this.ad = a;
    delete this.Wg;
  };
  pi.prototype.ai = function (a) {
    this.ad = a;
  };
  var ri = function (a) {
      this.dk = a;
      this.kh = this.Qe = this.ad = this.O = null;
    },
    si = function (a, b) {
      this.name = a;
      this.value = b;
    };
  si.prototype.toString = function () {
    return this.name;
  };
  var ti = new si("SEVERE", 1e3),
    ui = new si("INFO", 800),
    vi = new si("CONFIG", 700),
    wi = new si("FINE", 500);
  ri.prototype.getParent = function () {
    return this.O;
  };
  ri.prototype.hh = function () {
    this.Qe || (this.Qe = {});
    return this.Qe;
  };
  ri.prototype.ai = function (a) {
    this.ad = a;
  };
  var xi = function (a) {
    if (a.ad) return a.ad;
    if (a.O) return xi(a.O);
    Oa("Root logger has no level set.");
    return null;
  };
  ri.prototype.log = function (a, b, c) {
    if (a.value >= xi(this).value)
      for (
        "function" === typeof b && (b = b()),
          a = new pi(a, String(b), this.dk),
          c && (a.Wg = c),
          c = this;
        c;

      ) {
        var d = c,
          e = a;
        if (d.kh) for (var f = 0; (b = d.kh[f]); f++) b(e);
        c = c.getParent();
      }
  };
  ri.prototype.info = function (a, b) {
    this.log(ui, a, b);
  };
  var yi = {},
    zi = null,
    Ai = function (a) {
      zi || ((zi = new ri("")), (yi[""] = zi), zi.ai(vi));
      var b;
      if (!(b = yi[a])) {
        b = new ri(a);
        var c = a.lastIndexOf("."),
          d = a.substr(c + 1);
        c = Ai(a.substr(0, c));
        c.hh()[d] = b;
        b.O = c;
        yi[a] = b;
      }
      return b;
    };
  var Bi = function (a, b) {
    a && a.log(wi, b, void 0);
  };
  var Ci = function (a) {
    switch (a) {
      case 200:
      case 201:
      case 202:
      case 204:
      case 206:
      case 304:
      case 1223:
        return !0;
      default:
        return !1;
    }
  };
  var Di = function () {};
  Di.prototype.Bg = null;
  var Fi = function (a) {
    var b;
    (b = a.Bg) ||
      ((b = {}), Ei(a) && ((b[0] = !0), (b[1] = !0)), (b = a.Bg = b));
    return b;
  };
  var Gi,
    Hi = function () {};
  x(Hi, Di);
  var Ii = function (a) {
      return (a = Ei(a)) ? new ActiveXObject(a) : new XMLHttpRequest();
    },
    Ei = function (a) {
      if (
        !a.ph &&
        "undefined" == typeof XMLHttpRequest &&
        "undefined" != typeof ActiveXObject
      ) {
        for (
          var b = [
              "MSXML2.XMLHTTP.6.0",
              "MSXML2.XMLHTTP.3.0",
              "MSXML2.XMLHTTP",
              "Microsoft.XMLHTTP",
            ],
            c = 0;
          c < b.length;
          c++
        ) {
          var d = b[c];
          try {
            return new ActiveXObject(d), (a.ph = d);
          } catch (e) {}
        }
        throw Error(
          "Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"
        );
      }
      return a.ph;
    };
  Gi = new Hi();
  var Ji = function (a) {
    A.call(this);
    this.headers = new od();
    this.re = a || null;
    this.Ea = !1;
    this.qe = this.m = null;
    this.$c = this.xh = this.Sd = "";
    this.Ub = this.tf = this.Pd = this.cf = !1;
    this.Ec = 0;
    this.he = null;
    this.Ac = "";
    this.me = this.hk = this.pi = !1;
  };
  x(Ji, A);
  var Ki = Ji.prototype,
    Li = Ai("goog.net.XhrIo");
  Ki.ra = Li;
  var Mi = /^https?$/i,
    Ni = ["POST", "PUT"],
    Oi = [];
  Ji.prototype.Nj = function () {
    this.Sa();
    fb(Oi, this);
  };
  Ji.prototype.send = function (a, b, c, d) {
    if (this.m)
      throw Error(
        "[goog.net.XhrIo] Object is active with another request=" +
          this.Sd +
          "; newUri=" +
          a
      );
    b = b ? b.toUpperCase() : "GET";
    this.Sd = a;
    this.$c = "";
    this.xh = b;
    this.cf = !1;
    this.Ea = !0;
    this.m = this.re ? Ii(this.re) : Ii(Gi);
    this.qe = this.re ? Fi(this.re) : Fi(Gi);
    this.m.onreadystatechange = v(this.Lh, this);
    this.hk &&
      "onprogress" in this.m &&
      ((this.m.onprogress = v(function (f) {
        this.Kh(f, !0);
      }, this)),
      this.m.upload && (this.m.upload.onprogress = v(this.Kh, this)));
    try {
      Bi(this.ra, Pi(this, "Opening Xhr")),
        (this.tf = !0),
        this.m.open(b, String(a), !0),
        (this.tf = !1);
    } catch (f) {
      Bi(this.ra, Pi(this, "Error opening Xhr: " + f.message));
      this.Gd(5, f);
      return;
    }
    a = c || "";
    var e = this.headers.clone();
    d &&
      vd(d, function (f, g) {
        e.set(g, f);
      });
    d = ab(e.Ka());
    c = r.FormData && a instanceof r.FormData;
    !cb(Ni, b) ||
      d ||
      c ||
      e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    e.forEach(function (f, g) {
      this.m.setRequestHeader(g, f);
    }, this);
    this.Ac && (this.m.responseType = this.Ac);
    "withCredentials" in this.m &&
      this.m.withCredentials !== this.pi &&
      (this.m.withCredentials = this.pi);
    try {
      Qi(this),
        0 < this.Ec &&
          ((this.me = Ri(this.m)),
          Bi(
            this.ra,
            Pi(
              this,
              "Will abort after " +
                this.Ec +
                "ms if incomplete, xhr2 " +
                this.me
            )
          ),
          this.me
            ? ((this.m.timeout = this.Ec),
              (this.m.ontimeout = v(this.od, this)))
            : (this.he = Rh(this.od, this.Ec, this))),
        Bi(this.ra, Pi(this, "Sending request")),
        (this.Pd = !0),
        this.m.send(a),
        (this.Pd = !1);
    } catch (f) {
      Bi(this.ra, Pi(this, "Send error: " + f.message)), this.Gd(5, f);
    }
  };
  var Ri = function (a) {
      return (
        rc && Bc(9) && "number" === typeof a.timeout && void 0 !== a.ontimeout
      );
    },
    bb = function (a) {
      return "content-type" == a.toLowerCase();
    };
  Ji.prototype.od = function () {
    "undefined" != typeof sa &&
      this.m &&
      ((this.$c = "Timed out after " + this.Ec + "ms, aborting"),
      Bi(this.ra, Pi(this, this.$c)),
      this.dispatchEvent("timeout"),
      this.abort(8));
  };
  Ji.prototype.Gd = function (a, b) {
    this.Ea = !1;
    this.m && ((this.Ub = !0), this.m.abort(), (this.Ub = !1));
    this.$c = b;
    Si(this);
    Ui(this);
  };
  var Si = function (a) {
    a.cf ||
      ((a.cf = !0), a.dispatchEvent("complete"), a.dispatchEvent("error"));
  };
  Ji.prototype.abort = function () {
    this.m &&
      this.Ea &&
      (Bi(this.ra, Pi(this, "Aborting")),
      (this.Ea = !1),
      (this.Ub = !0),
      this.m.abort(),
      (this.Ub = !1),
      this.dispatchEvent("complete"),
      this.dispatchEvent("abort"),
      Ui(this));
  };
  Ji.prototype.A = function () {
    this.m &&
      (this.Ea &&
        ((this.Ea = !1), (this.Ub = !0), this.m.abort(), (this.Ub = !1)),
      Ui(this, !0));
    Ji.I.A.call(this);
  };
  Ji.prototype.Lh = function () {
    this.Ta || (this.tf || this.Pd || this.Ub ? Vi(this) : this.gk());
  };
  Ji.prototype.gk = function () {
    Vi(this);
  };
  var Vi = function (a) {
    if (a.Ea && "undefined" != typeof sa)
      if (a.qe[1] && 4 == a.xb() && 2 == a.getStatus())
        Bi(a.ra, Pi(a, "Local request error detected and ignored"));
      else if (a.Pd && 4 == a.xb()) Rh(a.Lh, 0, a);
      else if ((a.dispatchEvent("readystatechange"), 4 == a.xb())) {
        Bi(a.ra, Pi(a, "Request complete"));
        a.Ea = !1;
        try {
          var b = a.getStatus(),
            c;
          if (!(c = Ci(b))) {
            var d;
            if ((d = 0 === b)) {
              var e = String(a.Sd).match(Rd)[1] || null;
              if (!e && r.self && r.self.location) {
                var f = r.self.location.protocol;
                e = f.substr(0, f.length - 1);
              }
              d = !Mi.test(e ? e.toLowerCase() : "");
            }
            c = d;
          }
          if (c) a.dispatchEvent("complete"), a.dispatchEvent("success");
          else {
            try {
              var g = 2 < a.xb() ? a.m.statusText : "";
            } catch (h) {
              Bi(a.ra, "Can not get status: " + h.message), (g = "");
            }
            a.$c = g + " [" + a.getStatus() + "]";
            Si(a);
          }
        } finally {
          Ui(a);
        }
      }
  };
  Ji.prototype.Kh = function (a, b) {
    z(
      "progress" === a.type,
      "goog.net.EventType.PROGRESS is of the same type as raw XHR progress."
    );
    this.dispatchEvent(Wi(a, "progress"));
    this.dispatchEvent(Wi(a, b ? "downloadprogress" : "uploadprogress"));
  };
  var Wi = function (a, b) {
      return {
        type: b,
        lengthComputable: a.lengthComputable,
        loaded: a.loaded,
        total: a.total,
      };
    },
    Ui = function (a, b) {
      if (a.m) {
        Qi(a);
        var c = a.m,
          d = a.qe[0] ? wa : null;
        a.m = null;
        a.qe = null;
        b || a.dispatchEvent("ready");
        try {
          c.onreadystatechange = d;
        } catch (e) {
          (a = a.ra) &&
            a.log(
              ti,
              "Problem encountered resetting onreadystatechange: " + e.message,
              void 0
            );
        }
      }
    },
    Qi = function (a) {
      a.m && a.me && (a.m.ontimeout = null);
      a.he && (r.clearTimeout(a.he), (a.he = null));
    };
  Ji.prototype.Qd = function () {
    return !!this.m;
  };
  Ji.prototype.xb = function () {
    return this.m ? this.m.readyState : 0;
  };
  Ji.prototype.getStatus = function () {
    try {
      return 2 < this.xb() ? this.m.status : -1;
    } catch (a) {
      return -1;
    }
  };
  var Xi = function (a) {
    try {
      if (!a.m) return null;
      if ("response" in a.m) return a.m.response;
      switch (a.Ac) {
        case "":
        case "text":
          return a.m.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.m)
            return a.m.mozResponseArrayBuffer;
      }
      var b = a.ra;
      b &&
        b.log(
          ti,
          "Response type " + a.Ac + " is not supported on this browser",
          void 0
        );
      return null;
    } catch (c) {
      return Bi(a.ra, "Can not get response: " + c.message), null;
    }
  };
  Ji.prototype.getResponseHeader = function (a) {
    if (this.m && 4 == this.xb())
      return (a = this.m.getResponseHeader(a)), null === a ? void 0 : a;
  };
  Ji.prototype.getAllResponseHeaders = function () {
    return this.m && 4 == this.xb() ? this.m.getAllResponseHeaders() || "" : "";
  };
  var Yi = function (a) {
      var b = {};
      a = a.getAllResponseHeaders().split("\r\n");
      for (var c = 0; c < a.length; c++)
        if (!/^[\s\xa0]*$/.test(a[c])) {
          var d = mc(a[c]),
            e = d[0];
          d = d[1];
          if ("string" === typeof d) {
            d = d.trim();
            var f = b[e] || [];
            b[e] = f;
            f.push(d);
          }
        }
      return Db(b, function (g) {
        return g.join(", ");
      });
    },
    Pi = function (a, b) {
      return b + " [" + a.xh + " " + a.Sd + " " + a.getStatus() + "]";
    };
  var Zi,
    $i = /^\/(table).*/,
    I = function (a, b) {
      aj();
      this.callback = a;
      this.P = new bj(!a, b);
    },
    J = function (a, b) {
      b instanceof Promise
        ? a.callback &&
          b
            .then(function (c) {
              return a.callback(c);
            })
            .catch(function (c) {
              return a.callback(void 0, c);
            })
        : b.then(function (c) {
            b = c;
          });
      return b;
    },
    cj = function () {
      return "projects/" + Zi;
    };
  k = I.prototype;
  k.Jc = function () {
    return new Hg(this.P);
  };
  k.assets = function () {
    return new Jg(this.P);
  };
  k.La = function () {
    return new Pg(this.P);
  };
  k.value = function () {
    return new Tg(this.P);
  };
  k.maps = function () {
    return new Og(this.P);
  };
  k.map = function () {
    return new Ng(this.P);
  };
  k.image = function () {
    return new Mg(this.P);
  };
  k.table = function () {
    return new Qg(this.P);
  };
  k.video = function () {
    return new Vg(this.P);
  };
  var bj = function (a, b) {
    this.sync = a = void 0 === a ? !1 : a;
    this.Wh = null != b ? b : a ? 5 : 10;
  };
  q(bj, Yg);
  bj.prototype.send = function (a, b) {
    var c = this;
    ke(a);
    var d = a.path || "",
      e = dj() + d,
      f = K(a.o || {}),
      g = a.body ? JSON.stringify(a.body) : void 0;
    if (this.sync) {
      d = L(e, f, void 0, a.u, g, this.Wh);
      d = b ? Jd(b, d) : d;
      var h = function (n) {
        return {
          then: function (p) {
            return h(p(n));
          },
        };
      };
      return h(d);
    }
    return new Promise(function (n, p) {
      L(
        e,
        f,
        function (t, C) {
          C ? p(C) : n(t);
        },
        a.u,
        g,
        c.Wh
      );
    }).then(function (n) {
      return b ? Jd(b, n) : n;
    });
  };
  var fj = function (a) {
    I.call(this, a);
    this.P = new ej();
  };
  q(fj, I);
  fj.prototype.send = function (a, b) {
    var c = this,
      d = dj() + "/batch",
      e =
        a
          .map(function (g) {
            var h = m(g);
            g = h.next().value;
            h = m(h.next().value);
            var n = h.next().value;
            h.next();
            return (
              "--batch_EARTHENGINE_batch\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\nMIME-Version: 1.0\r\nContent-ID: <" +
              g +
              ">\r\n\r\n" +
              n +
              "\r\n"
            );
          })
          .join("") + "--batch_EARTHENGINE_batch--\r\n",
      f = function (g) {
        var h = {};
        a.forEach(function (n) {
          var p = m(n);
          n = p.next().value;
          p = m(p.next().value);
          p.next();
          p = p.next().value;
          null != g[n] && (h[n] = Jd(p, g[n]));
        });
        return b ? b(h) : h;
      };
    return this.callback
      ? (L(
          d,
          null,
          function (g, h) {
            return c.callback(h ? g : f(g), h);
          },
          "multipart/mixed; boundary=batch_EARTHENGINE_batch",
          e
        ),
        null)
      : f(
          L(
            d,
            null,
            void 0,
            "multipart/mixed; boundary=batch_EARTHENGINE_batch",
            e
          )
        );
  };
  var ej = function () {};
  q(ej, Yg);
  ej.prototype.send = function (a, b) {
    var c = [a.u + " " + a.path + " HTTP/1.1"];
    c.push("Content-Type: application/json; charset=utf-8");
    var d = gj();
    null != d && c.push("Authorization: " + d);
    a = a.body ? JSON.stringify(a.body) : "";
    return [c.join("\r\n") + "\r\n\r\n" + a, b];
  };
  var hj = function (a, b, c) {
      a = m(b.split("--" + a.split("; boundary=")[1]));
      for (b = a.next(); !b.done; b = a.next())
        if (((b = b.value.split("\r\n\r\n")), !(3 > b.length))) {
          var d = b[0].match(/\r\nContent-ID: <response-([^>]*)>/)[1],
            e = Number(b[1].match(/^HTTP\S*\s(\d+)\s/)[1]);
          c(d, e, b.slice(2).join("\r\n\r\n"));
        }
    },
    dj = function () {
      var a = ij.replace(/\/api$/, "");
      return "window" in r && !a.match(/^https?:\/\/content-/)
        ? a.replace(/^(https?:\/\/)(.*\.googleapis\.com)$/, "$1content-$2")
        : a;
    },
    oj = function (a, b, c) {
      jj &&
        kj &&
        jj(
          { client_id: String(kj), immediate: !0, scope: lj.join(" ") },
          function (d) {
            if ("immediate_failed" == d.error && c) c();
            else if (M && "window" in r)
              try {
                mj(function () {
                  try {
                    r.gapi.auth.setToken(d), nj(a, b, d);
                  } catch (e) {
                    b(e.toString());
                  }
                });
              } catch (e) {
                b(e.toString());
              }
            else nj(a, b, d);
          }
        );
    },
    gj = function () {
      pj && 0 <= Date.now() - pj && qj();
      return rj;
    },
    qj = function () {
      pj = rj = null;
    },
    sj = function (a, b) {
      kj = a;
      lj = b;
    },
    aj = function (a, b, c) {
      null != a
        ? (ij = a)
        : tj || (ij = "https://earthengine.googleapis.com/api");
      null != b ? (uj = b) : tj || (uj = "https://earthengine.googleapis.com");
      void 0 !== c && (vj = c);
      M && (Zi = Zi || "earthengine-legacy");
      tj = !0;
    },
    L = function (a, b, c, d, e, f) {
      aj();
      var g = wj,
        h = "application/x-www-form-urlencoded";
      e &&
        ((h = "application/json"),
        d && d.startsWith("multipart") && ((h = d), (d = "POST")));
      d = d || "POST";
      h = { "Content-Type": h };
      var n = $i.test(a);
      if (M && !n) {
        var p = "0.1.236";
        "0.1.236" === p && (p = "latest");
        h["x-goog-api-client"] = "ee-js/" + p;
      }
      p = gj();
      if (null != p) h.Authorization = p;
      else if (c && jj && kj)
        return (
          oj(function () {
            xj(g, function () {
              L(a, b, c, d);
            });
          }),
          null
        );
      b = b ? b.clone() : new Zd();
      null != yj && b.add("key", yj);
      M
        ? (g && (h["X-Earth-Engine-Computation-Profile"] = "1"),
          Zi &&
            "earthengine-legacy" !== Zi &&
            !n &&
            (h["X-Goog-User-Project"] = Zi))
        : g && b.add("profiling", "1");
      b = zj(b, a);
      null != vj && (h["X-XSRF-Token"] = vj);
      null != Aj && (h["X-Earth-Engine-App-ID-Token"] = Aj);
      n = e || null;
      p = b ? b.toString() : "";
      "POST" === d && void 0 === e
        ? (n = p)
        : /^[\s\xa0]*$/.test(p) ||
          ((a += -1 != a.indexOf("?") ? "&" : "?"), (a += p));
      e = a.startsWith("/") ? ij + a : a;
      if (c) return Bj.push(Cj(e, c, d, n, h, f)), Dj.Hd(), null;
      p = function (D, ca) {
        this.setRequestHeader && this.setRequestHeader(ca, D);
      };
      var t = 0;
      for (f = null != f ? f : 5; ; ) {
        var C = Ii(Gi);
        C.open(d, e, !1);
        Bb(h, p, C);
        C.send(n);
        if (429 != C.status || t > f) break;
        t++;
      }
      return Ej(
        C.status,
        function (D) {
          try {
            return C.getResponseHeader(D);
          } catch (ca) {
            return null;
          }
        },
        C.responseText,
        g,
        void 0,
        e,
        d
      );
    },
    Cj = function (a, b, c, d, e, f) {
      var g = 0,
        h = { url: a, method: c, content: d, headers: e },
        n = wj,
        p = null != f ? f : 10;
      h.callback = function (t) {
        t = t.target;
        if (429 == t.getStatus() && g < p)
          return (
            g++,
            setTimeout(function () {
              Bj.push(h);
              Dj.Hd();
            }, Math.min(12e4, 1e3 * Math.pow(2, g))),
            null
          );
        var C = Ej,
          D = t.getStatus(),
          ca = v(t.getResponseHeader, t);
        try {
          var Da = t.m ? t.m.responseText : "";
        } catch (T) {
          Bi(t.ra, "Can not get responseText: " + T.message), (Da = "");
        }
        return C(D, ca, Da, n, b, a, c);
      };
      return h;
    },
    xj = function (a, b) {
      var c = wj;
      try {
        (wj = a), b.call(void 0);
      } finally {
        wj = c;
      }
    },
    Ej = function (a, b, c, d, e, f, g) {
      var h = d ? b("X-Earth-Engine-Computation-Profile") : "";
      h && d && d(h);
      var n = function (T) {
          return M ? T : T.data;
        },
        p = function (T) {
          try {
            var db = JSON.parse(T);
            return u(db) && "error" in db && "message" in db.error
              ? db.error.message
              : { parsed: db };
          } catch (Ib) {
            return "Invalid JSON: " + T;
          }
        },
        t = function (T) {
          if (0 === T)
            return "Failed to contact Earth Engine servers. Please check your connection, firewall, or browser extension settings.";
          if (200 > T || 300 <= T)
            return "Server returned HTTP code: " + T + " for " + g + " " + f;
        },
        C;
      b = b("Content-Type") || "application/json";
      d = b.replace(/;.*/, "");
      if ("application/json" === d || "text/json" === d)
        if (((b = p(c)), b.parsed)) {
          var D = n(b.parsed);
          void 0 === D && (C = "Malformed response: " + c);
        } else C = b;
      else if ("multipart/mixed" === d) {
        D = {};
        var ca = [];
        hj(b, c, function (T, db, Ib) {
          Ib = p(Ib);
          Ib.parsed && (D[T] = n(Ib.parsed));
          (db = (Ib.parsed ? "" : Ib) || t(db)) && ca.push(T + ": " + db);
        });
        ca.length && (C = ca.join("\n"));
      } else var Da = "Response was unexpectedly not JSON, but " + d;
      C = C || t(a) || Da;
      if (e) return e(D, C), null;
      if (!C) return D;
      throw Error(C);
    },
    mj = function (a) {
      var b = function () {
        r.gapi.config.update("client/cors", !0);
        jj || (jj = r.gapi.auth.authorize);
        a();
      };
      if (
        u(r.gapi) &&
        u(r.gapi.auth) &&
        "function" === typeof r.gapi.auth.authorize
      )
        b();
      else {
        for (var c = Date.now().toString(36); c in r; ) c += "_";
        r[c] = function () {
          delete r[c];
          b();
        };
        ii(dc({ onload: c }));
      }
    },
    nj = function (a, b, c) {
      if (c.access_token) {
        b = c.token_type + " " + c.access_token;
        if (c.expires_in || 0 === c.expires_in) {
          c = 900 * c.expires_in;
          var d = setTimeout(oj, 0.9 * c);
          void 0 !== d.unref && d.unref();
          pj = Date.now() + c;
        }
        rj = b;
        a && a();
      } else b && b(c.error || "Unknown error.");
    },
    K = function (a) {
      var b = new Zd();
      a = m(Object.entries(a));
      for (var c = a.next(); !c.done; c = a.next()) {
        var d = m(c.value);
        c = d.next().value;
        d = d.next().value;
        b.set(c, d);
      }
      return b;
    },
    Bj = [],
    Dj = new Sh(function () {
      var a = Bj.shift();
      if (a) {
        var b = a.url,
          c = a.callback,
          d = a.method,
          e = a.content;
        a = a.headers;
        var f = Fj,
          g = new Ji();
        Oi.push(g);
        c && g.Ya("complete", c);
        g.dd("ready", g.Nj);
        f && (g.Ec = Math.max(0, f));
        g.send(b, d, e, a);
      }
      0 == Bj.length || Dj.Hd();
    }, 350),
    ij = null,
    uj = null,
    vj = null,
    Aj = null,
    zj = Rb,
    rj = null,
    pj = null,
    kj = null,
    lj = [],
    jj = null,
    $b = new Vb(Tb, "https://apis.google.com/js/client.js?onload=%{onload}"),
    yj = null,
    M = !0,
    tj = !1,
    Fj = 0,
    wj = null;
  w("ee.api.ListAssetsResponse", pg);
  w("ee.api.EarthEngineAsset", vf);
  w("ee.api.ListImagesResponse", qg);
  w("ee.api.Image", ag);
  w("ee.api.Operation", sg);
  var Gj = function () {},
    Hj = function (a) {
      if (void 0 === a || null === a) a = Ed;
      return new Ze({ kb: a });
    },
    Ij = function (a) {
      return new Ze({ Pa: a });
    },
    Jj = function (a) {
      return new Ze({ Fa: new Ye({ values: a }) });
    },
    Kj = function (a) {
      return new Ze({ Ga: new sf({ values: a }) });
    },
    Lj = function (a, b) {
      return new Ze({ ya: new Uf({ functionName: a, arguments: b }) });
    },
    Mj = function (a, b) {
      return new Ze({ ya: new Uf({ Wa: a, arguments: b }) });
    },
    Nj = function (a, b) {
      return new Ze({ Va: new Tf({ kc: a, body: b }) });
    },
    Oj = function (a) {
      if (!a) return "AUTO_JPEG_PNG";
      a = a.toUpperCase();
      switch (a) {
        case "JPG":
          return "JPEG";
        case "AUTO":
          return "AUTO_JPEG_PNG";
        case "TIF":
        case "TIFF":
        case "GEOTIF":
        case "GEOTIFF":
          return "GEO_TIFF";
        case "TF_RECORD":
        case "TFRECORD":
          return "TF_RECORD_IMAGE";
        case "NUMPY":
          return "NPY";
        case "ZIPPED_TIF":
        case "ZIPPED_TIFF":
        case "ZIPPED_GEOTIF":
        case "ZIPPED_GEOTIFF":
          return "ZIPPED_GEO_TIFF";
        case "ZIPPED_TIF_PER_BAND":
        case "ZIPPED_TIFF_PER_BAND":
        case "ZIPPED_GEOTIF_PER_BAND":
        case "ZIPPED_GEOTIFF_PER_BAND":
          return "ZIPPED_GEO_TIFF_PER_BAND";
        default:
          return a;
      }
    },
    Pj = function (a) {
      if (!a) return "CSV";
      a = a.toUpperCase();
      switch (a) {
        case "TF_RECORD":
        case "TFRECORD":
          return "TF_RECORD_TABLE";
        case "JSON":
        case "GEOJSON":
          return "GEO_JSON";
        default:
          return a;
      }
    },
    Qj = function (a) {
      if (!a) return "VERTICAL";
      a = a.toUpperCase();
      if ("HORIZONTAL" !== a || "VERTICAL" !== a)
        throw Error('Orientation must be "horizontal" or "vertical"');
      return a;
    },
    Rj = function (a) {
      if (!a) return [];
      if ("string" === typeof a) return a.split(",");
      if (Array.isArray(a)) return a;
      throw Error("Invalid band list " + a);
    },
    Uj = function (a) {
      var b = new Df(),
        c = !1;
      "palette" in a &&
        ((c = a.palette),
        (b.hd = "string" === typeof c ? c.split(",") : c),
        (c = !0));
      var d = [];
      if ("gain" in a || "bias" in a) {
        if ("min" in a || "max" in a)
          throw Error("Gain and bias can't be specified with min and max");
        var e = b.hd ? b.hd.length - 1 : 255;
        d = Sj(a, "bias", "gain").map(function (f) {
          var g = -f.bias / f.gain;
          return { min: g, max: e / f.gain + g };
        });
      } else if ("min" in a || "max" in a) d = Sj(a, "min", "max");
      0 !== d.length &&
        ((b.Nf = d.map(function (f) {
          return new tf(f);
        })),
        (c = !0));
      a = Tj(a.gamma);
      if (1 < a.length) throw Error("Only one gamma value is supported");
      1 === a.length && ((b.gamma = a[0]), (c = !0));
      return c ? b : null;
    },
    Tj = function (a) {
      return a ? a.split(",").map(Number) : [];
    },
    Sj = function (a, b, c) {
      var d = Tj(a[b]),
        e = Tj(a[c]);
      if (0 === d.length)
        return e.map(function (f) {
          var g = {};
          return (g[b] = 0), (g[c] = f), g;
        });
      if (0 === e.length)
        return d.map(function (f) {
          var g = {};
          return (g[b] = f), (g[c] = 1), g;
        });
      if (d.length !== e.length)
        throw Error("Length of " + b + " and " + c + " must match.");
      return d.map(function (f, g) {
        var h = {};
        return (h[b] = f), (h[c] = e[g]), h;
      });
    },
    Vj = function (a) {
      var b = function (g) {
          var h = {};
          h.description = g.description || "";
          h.type = g.type || "";
          null != g.yd && (h.name = g.yd);
          void 0 !== g.defaultValue && (h["default"] = g.defaultValue);
          null != g.optional && (h.optional = g.optional);
          return h;
        },
        c = function (g) {
          var h = {};
          h.args = (g.arguments || []).map(b);
          h.description = g.description || "";
          h.returns = g.Rf || "";
          null != g.hidden && (h.hidden = g.hidden);
          g.preview && (h.preview = g.preview);
          g.deprecated && (h.deprecated = g.$e);
          g.sourceCodeUri && (h.sourceCodeUri = g.sourceCodeUri);
          return h;
        },
        d = {};
      a = m(a.Jc || []);
      for (var e = a.next(); !e.done; e = a.next()) {
        e = e.value;
        var f = e.name.replace(/^algorithms\//, "");
        d[f] = c(e);
      }
      return d;
    },
    Wj = /^projects\/((?:\w+(?:[\w\-]+\.[\w\-]+)*?\.\w+:)?[a-z][a-z0-9\-]{4,28}[a-z0-9])\/.+/,
    Xj = /^projects\/((?:\w+(?:[\w\-]+\.[\w\-]+)*?\.\w+:)?[a-z][a-z0-9\-]{4,28}[a-z0-9])\/assets\/(.*)$/,
    Yj = /^projects\/((?:\w+(?:[\w\-]+\.[\w\-]+)*?\.\w+:)?[a-z][a-z0-9\-]{4,28}[a-z0-9])\/assets\/?$/,
    Zj = function (a) {
      return (a = Wj.exec(a)) ? a[1] : "earthengine-legacy";
    },
    ak = function (a) {
      return Xj.exec(a)
        ? a
        : /^(users|projects)\/.*/.exec(a)
        ? "projects/earthengine-legacy/assets/" + a
        : "projects/earthengine-public/assets/" + a;
    },
    ck = function (a) {
      return (a.assets || []).map(bk);
    },
    ek = function (a) {
      return (a.images || []).map(dk);
    },
    fk = function (a) {
      switch (a) {
        case "ALGORITHM":
          return "Algorithm";
        case "FOLDER":
          return "Folder";
        case "IMAGE":
          return "Image";
        case "IMAGE_COLLECTION":
          return "ImageCollection";
        case "TABLE":
          return "Table";
        default:
          return "Unknown";
      }
    },
    bk = function (a) {
      var b = gk(fk(a.type), a.name),
        c = Object.assign({}, a.properties || {});
      a.Da && (c["system:asset_size"] = Number(a.Da));
      a.startTime && (c["system:time_start"] = Date.parse(a.startTime));
      a.endTime && (c["system:time_end"] = Date.parse(a.endTime));
      a.geometry && (c["system:footprint"] = a.geometry);
      "string" === typeof a.title && (c["system:title"] = a.title);
      "string" === typeof a.description &&
        (c["system:description"] = a.description);
      a.Oa && (b.version = 1e3 * Date.parse(a.Oa));
      b.properties = c;
      a.bands &&
        (b.bands = a.bands.map(function (d) {
          var e = {
            id: d.id,
            crs: d.L.Ze,
            dimensions: void 0,
            crs_transform: void 0,
          };
          if (d.L) {
            if (null != d.L.Ob) {
              var f = d.L.Ob;
              e.crs_transform = [
                f.Sf || 0,
                f.Xf || 0,
                f.jg || 0,
                f.Yf || 0,
                f.Tf || 0,
                f.kg || 0,
              ];
            }
            null != d.L.dimensions &&
              (e.dimensions = [d.L.dimensions.width, d.L.dimensions.height]);
          }
          d.dataType &&
            ((f = { type: "PixelType" }),
            (f.precision = (d.dataType.precision || "").toLowerCase()),
            d.dataType.kd &&
              ((f.min = d.dataType.kd.min || 0), (f.max = d.dataType.kd.max)),
            (e.data_type = f));
          return e;
        }));
      return b;
    },
    hk = function (a) {
      var b = new vf(),
        c = Object.assign({}, a),
        d;
      a = function (e) {
        d = c[e];
        delete c[e];
        return d;
      };
      a("system:asset_size") && (b.Da = String(d));
      a("system:time_start") &&
        (b.startTime = new Date(Number(d)).toISOString());
      a("system:time_end") && (b.endTime = new Date(Number(d)).toISOString());
      a("system:footprint") && (b.geometry = d);
      "string" === typeof a("system:title") && null == c.title && (c.title = d);
      "string" === typeof a("system:description") &&
        null == c.description &&
        (c.description = d);
      b.properties = c;
      return b;
    },
    dk = function (a) {
      return gk("Image", a.name);
    },
    gk = function (a, b) {
      var c = {};
      c.type = a;
      null != b &&
        ((a = b.split("/")),
        (b =
          "projects" === a[0] &&
          "assets" === a[2] &&
          ["earthengine-legacy", "earthengine-public"].includes(a[1])
            ? a.slice(3).join("/")
            : b),
        (c.id = b));
      return c;
    },
    jk = function (a) {
      var b = {};
      a.num && (b.pageSize = a.num);
      a.starttime && (b.startTime = new Date(a.starttime).toISOString());
      a.endtime && (b.endTime = new Date(a.endtime).toISOString());
      a.bbox && (b.region = ik(a.bbox));
      a.region && (b.region = a.region);
      a.bbox &&
        a.region &&
        console.warn("Multiple request parameters converted to region");
      var c = "id num starttime endtime bbox region".split(" ");
      a = m(
        Object.keys(a).filter(function (e) {
          return !c.includes(e);
        })
      );
      for (var d = a.next(); !d.done; d = a.next())
        console.warn("Unrecognized key " + d.value + " ignored");
      b.fields = "assets(type,path)";
      return b;
    },
    ik = function (a) {
      return (
        '{"type":"Polygon","coordinates":[[[' +
        [
          [0, 1],
          [2, 1],
          [2, 3],
          [0, 3],
          [0, 1],
        ]
          .map(function (b) {
            return a[b[0]] + "," + a[b[1]];
          })
          .join("],[") +
        "]]]}"
      );
    },
    kk = function (a) {
      var b = {};
      (a.zd || []).forEach(function (f) {
        b[f.Bc] = f.Yb;
      });
      var c = new Set(),
        d = function (f) {
          var g = f.replace(/^group:|^user:|^serviceAccount:/, "");
          f.startsWith("group:") && c.add(g);
          return g;
        };
      a = b["roles/viewer"] || [];
      var e = a.filter(function (f) {
        return "allUsers" !== f;
      });
      d = {
        owners: (b["roles/owner"] || []).map(d),
        writers: (b["roles/editor"] || []).map(d),
        readers: e.map(d),
      };
      0 < c.size && (d.groups = c);
      a.length != e.length && (d.all_users_can_read = !0);
      return d;
    },
    lk = function (a) {
      var b = function (d) {
          return (a[d] || []).map(function (e) {
            var f = "user:";
            a.groups && a.groups.has(e)
              ? (f = "group:")
              : e.match(/[@|\.]gserviceaccount\.com$/) &&
                (f = "serviceAccount:");
            return f + e;
          });
        },
        c = a.all_users_can_read ? ["allUsers"] : [];
      b = [
        { Bc: "roles/owner", Yb: b("owners") },
        { Bc: "roles/viewer", Yb: b("readers").concat(c) },
        { Bc: "roles/editor", Yb: b("writers") },
      ].map(function (d) {
        return new cf(d);
      });
      return new xg({
        zd: b.filter(function (d) {
          return d.Yb.length;
        }),
        df: null,
      });
    },
    mk = function (a) {
      return "projects/earthengine-legacy/operations/" + a;
    },
    nk = function (a) {
      var b = /^.*operations\/(.*)$/.exec(a);
      return b ? b[1] : a;
    },
    ok = function (a) {
      var b = {},
        c = function (f, g) {
          null != g && (b[f] = Date.parse(g));
        },
        d = function (f) {
          switch (f) {
            case "PENDING":
              return "READY";
            case "RUNNING":
              return "RUNNING";
            case "CANCELLING":
              return "CANCEL_REQUESTED";
            case "SUCCEEDED":
              return "COMPLETED";
            case "CANCELLED":
              return "CANCELLED";
            case "FAILED":
              return "FAILED";
            default:
              return "UNKNOWN";
          }
        },
        e = Jd(wg, a.Ff || {});
      null != e.description && (b.description = e.description);
      null != e.state && (b.state = d(e.state));
      c("creation_timestamp_ms", e.Ye);
      c("update_timestamp_ms", e.Oa);
      c("start_timestamp_ms", e.startTime);
      b.attempt = e.attempt;
      a.done && null != a.error && (b.error_message = a.error.message);
      null != a.name && ((b.id = nk(a.name)), (b.name = a.name));
      b.task_type = e.type || "UNKNOWN";
      b.output_url = e.af;
      b.source_url = e.Uf;
      return b;
    },
    pk = function (a) {
      var b = { started: "OK" };
      a.name && ((b.taskId = nk(a.name)), (b.name = a.name));
      a.error && (b.note = a.error.message);
      return b;
    },
    qk = function (a) {
      return a.primaryPath
        ? [a.primaryPath].concat(ha(a.additionalPaths || []))
        : null;
    },
    tk = function (a) {
      var b = function (f) {
          var g = Jd(kg, f);
          g.wa = qk(f);
          return g;
        },
        c = Jd(fg, a);
      c.name = ak(a.id);
      c.tilesets = (a.tilesets || []).map(function (f) {
        var g = Jd(ig, f);
        g.sources = (f.sources || []).map(b);
        return g;
      });
      c.bands = (a.bands || []).map(function (f) {
        var g = Jd(gg, f);
        g.missingData = rk(f.missingData);
        return g;
      });
      c.missingData = rk(a.missingData);
      c.Bf = nb((a.tilesets || []).map(sk));
      c.pyramidingPolicy = a.pyramidingPolicy || null;
      if (a.properties) {
        var d = Object.assign({}, a.properties),
          e;
        a = function (f) {
          e = d[f];
          delete d[f];
          return e;
        };
        a("system:time_start") &&
          (c.startTime = new Date(Number(e)).toISOString());
        a("system:time_end") && (c.endTime = new Date(Number(e)).toISOString());
        c.properties = d;
      }
      return c;
    },
    sk = function (a) {
      var b = [];
      if (!Array.isArray(a.fileBands)) return b;
      var c = function (d) {
        var e = [];
        null != d &&
          Array.isArray(d.bandId) &&
          (e = d.bandId.map(function (f) {
            return f || "";
          }));
        return new hg({ Dc: a.id || "", da: e });
      };
      a.fileBands.forEach(function (d) {
        d.maskForAllBands
          ? b.push(c(null))
          : null != d.maskForBands && b.push(c(d.maskForBands));
      });
      return b;
    },
    uk = function (a) {
      var b = Jd(ng, a);
      b.name = ak(a.id);
      b.sources = (a.sources || []).map(function (e) {
        var f = Jd(Bg, e);
        f.wa = qk(e);
        e.maxError && (f.Wb = e.maxError);
        return f;
      });
      if (a.properties) {
        var c = Object.assign({}, a.properties),
          d;
        a = function (e) {
          d = c[e];
          delete c[e];
          return d;
        };
        a("system:time_start") &&
          (b.startTime = new Date(Number(d)).toISOString());
        a("system:time_end") && (b.endTime = new Date(Number(d)).toISOString());
        b.properties = c;
      }
      return b;
    },
    rk = function (a) {
      if (null == a) return null;
      var b = new dg({ values: [] });
      null != a.value && "number" === typeof a.value && b.values.push(a.value);
      Array.isArray(a.values) &&
        a.values.map(function (c) {
          "number" === typeof c && b.values.push(c);
        });
      return 0 == b.values.length ? null : b;
    };
  var vk = function () {
    this.sb = -1;
  };
  var wk = function () {
    this.sb = 64;
    this.$ = Array(4);
    this.Kj = Array(this.sb);
    this.je = this.Lc = 0;
    this.reset();
  };
  x(wk, vk);
  wk.prototype.reset = function () {
    this.$[0] = 1732584193;
    this.$[1] = 4023233417;
    this.$[2] = 2562383102;
    this.$[3] = 271733878;
    this.je = this.Lc = 0;
  };
  var xk = function (a, b, c) {
    c || (c = 0);
    var d = Array(16);
    if ("string" === typeof b)
      for (var e = 0; 16 > e; ++e)
        d[e] =
          b.charCodeAt(c++) |
          (b.charCodeAt(c++) << 8) |
          (b.charCodeAt(c++) << 16) |
          (b.charCodeAt(c++) << 24);
    else
      for (e = 0; 16 > e; ++e)
        d[e] = b[c++] | (b[c++] << 8) | (b[c++] << 16) | (b[c++] << 24);
    b = a.$[0];
    c = a.$[1];
    e = a.$[2];
    var f = a.$[3];
    var g = (b + (f ^ (c & (e ^ f))) + d[0] + 3614090360) & 4294967295;
    b = c + (((g << 7) & 4294967295) | (g >>> 25));
    g = (f + (e ^ (b & (c ^ e))) + d[1] + 3905402710) & 4294967295;
    f = b + (((g << 12) & 4294967295) | (g >>> 20));
    g = (e + (c ^ (f & (b ^ c))) + d[2] + 606105819) & 4294967295;
    e = f + (((g << 17) & 4294967295) | (g >>> 15));
    g = (c + (b ^ (e & (f ^ b))) + d[3] + 3250441966) & 4294967295;
    c = e + (((g << 22) & 4294967295) | (g >>> 10));
    g = (b + (f ^ (c & (e ^ f))) + d[4] + 4118548399) & 4294967295;
    b = c + (((g << 7) & 4294967295) | (g >>> 25));
    g = (f + (e ^ (b & (c ^ e))) + d[5] + 1200080426) & 4294967295;
    f = b + (((g << 12) & 4294967295) | (g >>> 20));
    g = (e + (c ^ (f & (b ^ c))) + d[6] + 2821735955) & 4294967295;
    e = f + (((g << 17) & 4294967295) | (g >>> 15));
    g = (c + (b ^ (e & (f ^ b))) + d[7] + 4249261313) & 4294967295;
    c = e + (((g << 22) & 4294967295) | (g >>> 10));
    g = (b + (f ^ (c & (e ^ f))) + d[8] + 1770035416) & 4294967295;
    b = c + (((g << 7) & 4294967295) | (g >>> 25));
    g = (f + (e ^ (b & (c ^ e))) + d[9] + 2336552879) & 4294967295;
    f = b + (((g << 12) & 4294967295) | (g >>> 20));
    g = (e + (c ^ (f & (b ^ c))) + d[10] + 4294925233) & 4294967295;
    e = f + (((g << 17) & 4294967295) | (g >>> 15));
    g = (c + (b ^ (e & (f ^ b))) + d[11] + 2304563134) & 4294967295;
    c = e + (((g << 22) & 4294967295) | (g >>> 10));
    g = (b + (f ^ (c & (e ^ f))) + d[12] + 1804603682) & 4294967295;
    b = c + (((g << 7) & 4294967295) | (g >>> 25));
    g = (f + (e ^ (b & (c ^ e))) + d[13] + 4254626195) & 4294967295;
    f = b + (((g << 12) & 4294967295) | (g >>> 20));
    g = (e + (c ^ (f & (b ^ c))) + d[14] + 2792965006) & 4294967295;
    e = f + (((g << 17) & 4294967295) | (g >>> 15));
    g = (c + (b ^ (e & (f ^ b))) + d[15] + 1236535329) & 4294967295;
    c = e + (((g << 22) & 4294967295) | (g >>> 10));
    g = (b + (e ^ (f & (c ^ e))) + d[1] + 4129170786) & 4294967295;
    b = c + (((g << 5) & 4294967295) | (g >>> 27));
    g = (f + (c ^ (e & (b ^ c))) + d[6] + 3225465664) & 4294967295;
    f = b + (((g << 9) & 4294967295) | (g >>> 23));
    g = (e + (b ^ (c & (f ^ b))) + d[11] + 643717713) & 4294967295;
    e = f + (((g << 14) & 4294967295) | (g >>> 18));
    g = (c + (f ^ (b & (e ^ f))) + d[0] + 3921069994) & 4294967295;
    c = e + (((g << 20) & 4294967295) | (g >>> 12));
    g = (b + (e ^ (f & (c ^ e))) + d[5] + 3593408605) & 4294967295;
    b = c + (((g << 5) & 4294967295) | (g >>> 27));
    g = (f + (c ^ (e & (b ^ c))) + d[10] + 38016083) & 4294967295;
    f = b + (((g << 9) & 4294967295) | (g >>> 23));
    g = (e + (b ^ (c & (f ^ b))) + d[15] + 3634488961) & 4294967295;
    e = f + (((g << 14) & 4294967295) | (g >>> 18));
    g = (c + (f ^ (b & (e ^ f))) + d[4] + 3889429448) & 4294967295;
    c = e + (((g << 20) & 4294967295) | (g >>> 12));
    g = (b + (e ^ (f & (c ^ e))) + d[9] + 568446438) & 4294967295;
    b = c + (((g << 5) & 4294967295) | (g >>> 27));
    g = (f + (c ^ (e & (b ^ c))) + d[14] + 3275163606) & 4294967295;
    f = b + (((g << 9) & 4294967295) | (g >>> 23));
    g = (e + (b ^ (c & (f ^ b))) + d[3] + 4107603335) & 4294967295;
    e = f + (((g << 14) & 4294967295) | (g >>> 18));
    g = (c + (f ^ (b & (e ^ f))) + d[8] + 1163531501) & 4294967295;
    c = e + (((g << 20) & 4294967295) | (g >>> 12));
    g = (b + (e ^ (f & (c ^ e))) + d[13] + 2850285829) & 4294967295;
    b = c + (((g << 5) & 4294967295) | (g >>> 27));
    g = (f + (c ^ (e & (b ^ c))) + d[2] + 4243563512) & 4294967295;
    f = b + (((g << 9) & 4294967295) | (g >>> 23));
    g = (e + (b ^ (c & (f ^ b))) + d[7] + 1735328473) & 4294967295;
    e = f + (((g << 14) & 4294967295) | (g >>> 18));
    g = (c + (f ^ (b & (e ^ f))) + d[12] + 2368359562) & 4294967295;
    c = e + (((g << 20) & 4294967295) | (g >>> 12));
    g = (b + (c ^ e ^ f) + d[5] + 4294588738) & 4294967295;
    b = c + (((g << 4) & 4294967295) | (g >>> 28));
    g = (f + (b ^ c ^ e) + d[8] + 2272392833) & 4294967295;
    f = b + (((g << 11) & 4294967295) | (g >>> 21));
    g = (e + (f ^ b ^ c) + d[11] + 1839030562) & 4294967295;
    e = f + (((g << 16) & 4294967295) | (g >>> 16));
    g = (c + (e ^ f ^ b) + d[14] + 4259657740) & 4294967295;
    c = e + (((g << 23) & 4294967295) | (g >>> 9));
    g = (b + (c ^ e ^ f) + d[1] + 2763975236) & 4294967295;
    b = c + (((g << 4) & 4294967295) | (g >>> 28));
    g = (f + (b ^ c ^ e) + d[4] + 1272893353) & 4294967295;
    f = b + (((g << 11) & 4294967295) | (g >>> 21));
    g = (e + (f ^ b ^ c) + d[7] + 4139469664) & 4294967295;
    e = f + (((g << 16) & 4294967295) | (g >>> 16));
    g = (c + (e ^ f ^ b) + d[10] + 3200236656) & 4294967295;
    c = e + (((g << 23) & 4294967295) | (g >>> 9));
    g = (b + (c ^ e ^ f) + d[13] + 681279174) & 4294967295;
    b = c + (((g << 4) & 4294967295) | (g >>> 28));
    g = (f + (b ^ c ^ e) + d[0] + 3936430074) & 4294967295;
    f = b + (((g << 11) & 4294967295) | (g >>> 21));
    g = (e + (f ^ b ^ c) + d[3] + 3572445317) & 4294967295;
    e = f + (((g << 16) & 4294967295) | (g >>> 16));
    g = (c + (e ^ f ^ b) + d[6] + 76029189) & 4294967295;
    c = e + (((g << 23) & 4294967295) | (g >>> 9));
    g = (b + (c ^ e ^ f) + d[9] + 3654602809) & 4294967295;
    b = c + (((g << 4) & 4294967295) | (g >>> 28));
    g = (f + (b ^ c ^ e) + d[12] + 3873151461) & 4294967295;
    f = b + (((g << 11) & 4294967295) | (g >>> 21));
    g = (e + (f ^ b ^ c) + d[15] + 530742520) & 4294967295;
    e = f + (((g << 16) & 4294967295) | (g >>> 16));
    g = (c + (e ^ f ^ b) + d[2] + 3299628645) & 4294967295;
    c = e + (((g << 23) & 4294967295) | (g >>> 9));
    g = (b + (e ^ (c | ~f)) + d[0] + 4096336452) & 4294967295;
    b = c + (((g << 6) & 4294967295) | (g >>> 26));
    g = (f + (c ^ (b | ~e)) + d[7] + 1126891415) & 4294967295;
    f = b + (((g << 10) & 4294967295) | (g >>> 22));
    g = (e + (b ^ (f | ~c)) + d[14] + 2878612391) & 4294967295;
    e = f + (((g << 15) & 4294967295) | (g >>> 17));
    g = (c + (f ^ (e | ~b)) + d[5] + 4237533241) & 4294967295;
    c = e + (((g << 21) & 4294967295) | (g >>> 11));
    g = (b + (e ^ (c | ~f)) + d[12] + 1700485571) & 4294967295;
    b = c + (((g << 6) & 4294967295) | (g >>> 26));
    g = (f + (c ^ (b | ~e)) + d[3] + 2399980690) & 4294967295;
    f = b + (((g << 10) & 4294967295) | (g >>> 22));
    g = (e + (b ^ (f | ~c)) + d[10] + 4293915773) & 4294967295;
    e = f + (((g << 15) & 4294967295) | (g >>> 17));
    g = (c + (f ^ (e | ~b)) + d[1] + 2240044497) & 4294967295;
    c = e + (((g << 21) & 4294967295) | (g >>> 11));
    g = (b + (e ^ (c | ~f)) + d[8] + 1873313359) & 4294967295;
    b = c + (((g << 6) & 4294967295) | (g >>> 26));
    g = (f + (c ^ (b | ~e)) + d[15] + 4264355552) & 4294967295;
    f = b + (((g << 10) & 4294967295) | (g >>> 22));
    g = (e + (b ^ (f | ~c)) + d[6] + 2734768916) & 4294967295;
    e = f + (((g << 15) & 4294967295) | (g >>> 17));
    g = (c + (f ^ (e | ~b)) + d[13] + 1309151649) & 4294967295;
    c = e + (((g << 21) & 4294967295) | (g >>> 11));
    g = (b + (e ^ (c | ~f)) + d[4] + 4149444226) & 4294967295;
    b = c + (((g << 6) & 4294967295) | (g >>> 26));
    g = (f + (c ^ (b | ~e)) + d[11] + 3174756917) & 4294967295;
    f = b + (((g << 10) & 4294967295) | (g >>> 22));
    g = (e + (b ^ (f | ~c)) + d[2] + 718787259) & 4294967295;
    e = f + (((g << 15) & 4294967295) | (g >>> 17));
    g = (c + (f ^ (e | ~b)) + d[9] + 3951481745) & 4294967295;
    a.$[0] = (a.$[0] + b) & 4294967295;
    a.$[1] =
      (a.$[1] + (e + (((g << 21) & 4294967295) | (g >>> 11)))) & 4294967295;
    a.$[2] = (a.$[2] + e) & 4294967295;
    a.$[3] = (a.$[3] + f) & 4294967295;
  };
  wk.prototype.update = function (a, b) {
    void 0 === b && (b = a.length);
    for (var c = b - this.sb, d = this.Kj, e = this.Lc, f = 0; f < b; ) {
      if (0 == e) for (; f <= c; ) xk(this, a, f), (f += this.sb);
      if ("string" === typeof a)
        for (; f < b; ) {
          if (((d[e++] = a.charCodeAt(f++)), e == this.sb)) {
            xk(this, d);
            e = 0;
            break;
          }
        }
      else
        for (; f < b; )
          if (((d[e++] = a[f++]), e == this.sb)) {
            xk(this, d);
            e = 0;
            break;
          }
    }
    this.Lc = e;
    this.je += b;
  };
  wk.prototype.digest = function () {
    var a = Array((56 > this.Lc ? this.sb : 2 * this.sb) - this.Lc);
    a[0] = 128;
    for (var b = 1; b < a.length - 8; ++b) a[b] = 0;
    var c = 8 * this.je;
    for (b = a.length - 8; b < a.length; ++b) (a[b] = c & 255), (c /= 256);
    this.update(a);
    a = Array(16);
    for (b = c = 0; 4 > b; ++b)
      for (var d = 0; 32 > d; d += 8) a[c++] = (this.$[b] >>> d) & 255;
    return a;
  };
  var yk = function (a) {
    this.ud = "__ee_hash__";
    this.Rd = !1 !== a;
    this.$a = [];
    this.xa = {};
    this.lg = [];
    this.Nd = new WeakMap();
  };
  w("ee.Serializer", yk);
  var zk = new ji(),
    Ak = new wk(),
    Ck = function (a, b) {
      return Bk(new yk(void 0 !== b ? b : !0), a);
    };
  w("ee.Serializer.encode", Ck);
  var Dk = function (a) {
    return zk.X(Ck(a));
  };
  w("ee.Serializer.toJSON", Dk);
  var Fk = function (a) {
    return Ek(Ck(a, !1));
  };
  w("ee.Serializer.toReadableJSON", Fk);
  var Ek = function (a) {
      return "JSON" in r ? r.JSON.stringify(a, null, "  ") : zk.X(a);
    },
    Bk = function (a, b) {
      b = a.Fd(b);
      a.Rd &&
        ((b =
          u(b) && "ValueRef" == b.type && 1 == a.$a.length
            ? a.$a[0][1]
            : { type: "CompoundValue", scope: a.$a, value: b }),
        (a.$a = []),
        Va(
          a.lg,
          v(function (c) {
            delete c[this.ud];
          }, a)
        ),
        (a.lg = []),
        (a.xa = {}));
      return b;
    };
  yk.prototype.Fd = function (a) {
    if (void 0 === a) throw Error("Can't encode an undefined value.");
    var b = u(a) ? a[this.ud] : null;
    if (this.Rd && null != b && this.xa[b])
      return { type: "ValueRef", value: this.xa[b] };
    if (
      null === a ||
      "boolean" === typeof a ||
      "number" === typeof a ||
      "string" === typeof a
    )
      return a;
    if (za(a))
      return {
        type: "Invocation",
        functionName: "Date",
        arguments: { value: Math.floor(a.getTime()) },
      };
    if (a instanceof Gj) {
      var c = a.encode(v(this.Fd, this));
      if (!(Array.isArray(c) || (u(c) && "ArgumentRef" != c.type))) return c;
    } else if (Array.isArray(a))
      c = Xa(
        a,
        function (e) {
          return this.Fd(e);
        },
        this
      );
    else if (u(a) && "function" !== typeof a)
      (c = Db(
        a,
        function (e) {
          if ("function" !== typeof e) return this.Fd(e);
        },
        this
      )),
        Mb(c, this.ud),
        (c = { type: "Dictionary", value: c });
    else throw Error("Can't encode object: " + a);
    if (this.Rd) {
      b = Gk(c);
      if (this.xa[b]) var d = this.xa[b];
      else (d = String(this.$a.length)), this.$a.push([d, c]), (this.xa[b] = d);
      a[this.ud] = b;
      this.lg.push(a);
      return { type: "ValueRef", value: d };
    }
    return c;
  };
  var Gk = function (a) {
      Ak.reset();
      Ak.update(zk.X(a));
      return Ak.digest().toString();
    },
    Ik = function (a) {
      return Kd(Hk(a), Gd, Hd, Id);
    };
  w("ee.Serializer.encodeCloudApi", Ik);
  var Hk = function (a) {
      return Jk(new yk(!0), a);
    },
    Kk = function (a) {
      a = Jk(new yk(!1), a);
      var b = a.values,
        c = function (d) {
          if (!u(d)) return d;
          var e = Array.isArray(d) ? [] : {},
            f = d instanceof Object.getPrototypeOf(Ze);
          d = m(Object.entries(f ? d.a : d));
          for (var g = d.next(); !g.done; g = d.next()) {
            var h = m(g.value);
            g = h.next().value;
            h = h.next().value;
            f
              ? null !== h &&
                (e[g] =
                  "functionDefinitionValue" === g && null != h.body
                    ? { argumentNames: h.kc, body: c(b[h.body]) }
                    : "functionInvocationValue" === g && null != h.Wa
                    ? {
                        arguments: Db(h.arguments, c),
                        functionReference: c(b[h.Wa]),
                      }
                    : "constantValue" === g
                    ? h === Ed
                      ? null
                      : h
                    : c(h))
              : (e[g] = c(h));
          }
          return e;
        };
      return a.result && c(b[a.result]);
    };
  w("ee.Serializer.encodeCloudApiPretty", Kk);
  var Lk = function (a) {
    return zk.X(Ik(a));
  };
  w("ee.Serializer.toCloudApiJSON", Lk);
  var Mk = function (a) {
    return Ek(Kk(a));
  };
  w("ee.Serializer.toReadableCloudApiJSON", Mk);
  var Jk = function (a, b) {
      try {
        var c = Nk(a, b),
          d = new Ok(c, a.$a, a.Rd),
          e = Pk(d, d.Yh);
        return new lf({ result: e, values: d.Nh });
      } finally {
        (a.Nd = new WeakMap()), (a.xa = {}), (a.$a = []);
      }
    },
    Nk = function (a, b) {
      var c = function (e) {
        var f = Gk(e);
        u(b) && a.Nd.set(b, f);
        if (a.xa[f]) return a.xa[f];
        var g = String(a.$a.length);
        a.$a.push([g, e]);
        return (a.xa[f] = g);
      };
      if (u(b) && a.xa[a.Nd.get(b)]) return a.xa[a.Nd.get(b)];
      if (
        null === b ||
        "boolean" === typeof b ||
        "string" === typeof b ||
        "number" === typeof b
      )
        return c(Hj(b));
      if (za(b)) return c(Lj("Date", { value: Hj(Math.floor(b.getTime())) }));
      if (b instanceof Gj)
        return c(
          b.ka(function (e) {
            return Nk(a, e);
          })
        );
      if (Array.isArray(b))
        return c(
          Jj(
            b.map(function (e) {
              return Ij(Nk(a, e));
            })
          )
        );
      if (u(b) && "function" !== typeof b) {
        var d = {};
        Object.keys(b)
          .sort()
          .forEach(function (e) {
            d[e] = Ij(Nk(a, b[e]));
          });
        return c(Kj(d));
      }
      throw Error("Can't encode object: " + b);
    },
    Ok = function (a, b, c) {
      var d = this;
      this.Yh = a;
      this.values = {};
      b.forEach(function (e) {
        return (d.values[e[0]] = e[1]);
      });
      this.Sh = c ? Qk(this) : null;
      this.Nh = {};
      this.Of = {};
      this.ek = 0;
    },
    Pk = function (a, b) {
      if (b in a.Of) return a.Of[b];
      var c = String(a.ek++);
      a.Of[b] = c;
      a.Nh[c] = Rk(a, a.values[b], 0);
      return c;
    },
    Rk = function (a, b, c) {
      var d = function (p) {
          return null !== p.kb;
        },
        e = function (p) {
          return p === Ed ? null : p;
        };
      if (d(b) || null != b.Vb || null != b.tb || null != b.Pb) return b;
      if (null != b.Pa)
        return (
          (d = a.values[b.Pa]),
          null === a.Sh || (50 > c && 1 === a.Sh[b.Pa])
            ? Rk(a, d, c)
            : Sk(d)
            ? d
            : Ij(Pk(a, b.Pa))
        );
      if (null != b.Fa) {
        var f = b.Fa.values.map(function (p) {
          return Rk(a, p, c + 3);
        });
        return f.every(d)
          ? Hj(
              f.map(function (p) {
                return e(p.kb);
              })
            )
          : Jj(f);
      }
      if (null != b.Ga) {
        f = {};
        var g = {};
        b = m(Object.entries(b.Ga.values || {}));
        for (var h = b.next(); !h.done; h = b.next()) {
          var n = m(h.value);
          h = n.next().value;
          n = n.next().value;
          f[h] = Rk(a, n, c + 3);
          null !== g && d(f[h]) ? (g[h] = e(f[h].kb)) : (g = null);
        }
        return null !== g ? Hj(g) : Kj(f);
      }
      if (null != b.Va) return (d = b.Va), Nj(d.kc || [], Pk(a, d.body || ""));
      if (null != b.ya) {
        d = b.ya;
        f = {};
        g = m(Object.keys(d.arguments || {}));
        for (b = g.next(); !b.done; b = g.next())
          (b = b.value), (f[b] = Rk(a, d.arguments[b], c + 3));
        return d.functionName
          ? Lj(d.functionName, f)
          : Mj(Pk(a, d.Wa || ""), f);
      }
      throw Error("Can't optimize value: " + b);
    },
    Sk = function (a) {
      var b = a.kb;
      return null !== b
        ? b === Ed || "number" === typeof b || "boolean" === typeof b
        : null != a.Pb;
    },
    Qk = function (a) {
      var b = {},
        c = function (e) {
          b[e] ? b[e]++ : ((b[e] = 1), d(a.values[e]));
        },
        d = function (e) {
          null != e.Fa
            ? e.Fa.values.forEach(d)
            : null != e.Ga
            ? Object.values(e.Ga.values).forEach(d)
            : null != e.Va
            ? c(e.Va.body)
            : null != e.ya
            ? ((e = e.ya),
              null != e.Wa && c(e.Wa),
              Object.values(e.arguments).forEach(d))
            : null != e.Pa && c(e.Pa);
        };
      c(a.Yh);
      return b;
    };
  var Yk = function (a) {
    if (null == a.element) throw Error('"element" not found in params ' + a);
    var b = a.selectors || null;
    null != b && "string" === typeof b && (b = b.split(","));
    b = new Lf({
      i: Hk(a.element),
      description: Tk(a.description),
      la: null,
      ib: null,
      selectors: b,
      Wb: Uk(a.maxErrorMeters),
      requestId: Tk(a.id),
      W: Uk(a.maxWorkers),
    });
    var c = Vk(a);
    switch (c) {
      case "GOOGLE_CLOUD_STORAGE":
      case "DRIVE":
        var d = new Nf({ ma: null, ja: null, C: Pj(a.fileFormat) });
        "GOOGLE_CLOUD_STORAGE" === c ? (d.ma = Wk(a)) : (d.ja = Xk(a));
        b.la = d;
        break;
      case "ASSET":
        b.ib = new Mf({ Sb: new Bf({ name: ak(a.assetId) }) });
        break;
      default:
        throw Error('Export destination "' + c + '" unknown');
    }
    return b;
  };
  function Tk(a) {
    return null != a ? String(a) : null;
  }
  function Uk(a) {
    return null != a ? Number(a) : null;
  }
  var Vk = function (a) {
      var b = "DRIVE";
      if (null == a) return b;
      null != a.outputBucket || null != a.outputPrefix
        ? (b = "GOOGLE_CLOUD_STORAGE")
        : null != a.assetId && (b = "ASSET");
      return b;
    },
    $k = function (a) {
      var b = new eg({
        Ue: !!a.tfrecordCompressed,
        Xb: Tk(a.tfrecordMaxFileSize),
        Vf: !!a.tfrecordSequenceData,
        Se: !!a.tfrecordCollapseBands,
        Df: Uk(a.tfrecordMaskedThreshold),
        defaultValue: Uk(a.tfrecordDefaultValue),
        Na: Zk(a.tfrecordPatchDimensions),
        Af: Zk(a.tfrecordKernelSize),
        fe: null,
      });
      a = a.tfrecordTensorDepths;
      if (null != a)
        if (u(a)) {
          var c = {};
          Bb(a, function (d, e) {
            if ("string" !== typeof e || "number" !== typeof d)
              throw Error(
                '"tensorDepths" option must be an object of type Object<string, number>'
              );
            c[e] = d;
          });
          b.fe = c;
        } else
          throw Error(
            '"tensorDepths" option needs to have the form Object<string, number>.'
          );
      return b;
    },
    al = function (a, b) {
      var c = new Hf({
        ma: null,
        ja: null,
        Id: null,
        ge: null,
        C: Oj(a.fileFormat),
      });
      if ("GEO_TIFF" === c.C) {
        if (a.fileDimensions && a.tiffFileDimensions)
          throw Error(
            'Export cannot set both "fileDimensions" and "tiffFileDimensions".'
          );
        var d = new Wf({
          Re: !!a.tiffCloudOptimized,
          $f: !!a.tiffSkipEmptyFiles,
          Na: Zk(a.fileDimensions || a.tiffFileDimensions),
        });
        c.Id = d;
      } else "TF_RECORD_IMAGE" === c.C && (c.ge = $k(a));
      "GOOGLE_CLOUD_STORAGE" === b ? (c.ma = Wk(a)) : (c.ja = Xk(a));
      return c;
    },
    bl = function (a, b) {
      var c = new Pf({ ma: null, ja: null, C: "MP4" });
      "GOOGLE_CLOUD_STORAGE" === b ? (c.ma = Wk(a)) : (c.ja = Xk(a));
      return c;
    },
    cl = function (a) {
      var b = Uk(a.maxZoom),
        c = Uk(a.scale),
        d = Uk(a.minZoom),
        e = !!a.skipEmptyTiles,
        f = Tk(a.mapsApiKey),
        g = Zk(a.tileDimensions),
        h = Uk(a.stride);
      var n = Uk(a.minTimeMachineZoomSubset);
      a = Uk(a.maxTimeMachineZoomSubset);
      if (null == n && null == a) n = null;
      else {
        var p = new Dg({ min: 0, max: null });
        null != n && (p.min = n);
        p.max = a;
        n = p;
      }
      return new Kf({
        maxZoom: b,
        scale: c,
        minZoom: d,
        ag: e,
        zf: f,
        Na: g,
        bg: h,
        mg: n,
      });
    },
    Zk = function (a) {
      if (null == a) return null;
      var b = new Xf({ height: 0, width: 0 });
      "string" === typeof a &&
        (-1 !== a.indexOf("x")
          ? (a = a.split("x").map(Number))
          : -1 !== a.indexOf(",") && (a = a.split(",").map(Number)));
      if (Array.isArray(a))
        if (2 === a.length) (b.height = a[0]), (b.width = a[1]);
        else if (1 === a.length) (b.height = a[0]), (b.width = a[0]);
        else throw Error("Unable to construct grid from dimensions: " + a);
      else if ("number" !== typeof a || isNaN(a))
        if (u(a) && null != a.height && null != a.width)
          (b.height = a.height), (b.width = a.width);
        else throw Error("Unable to construct grid from dimensions: " + a);
      else (b.height = a), (b.width = a);
      return b;
    },
    Wk = function (a) {
      var b = null;
      null != a.writePublicTiles &&
        (b = a.writePublicTiles ? "PUBLIC" : "DEFAULT_OBJECT_ACL");
      return new Vf({
        lc: Tk(a.outputBucket),
        fa: Tk(a.outputPrefix),
        mc: a.bucketCorsUris || null,
        permissions: b,
      });
    },
    Xk = function (a) {
      return new uf({ jf: Tk(a.driveFolder), fa: Tk(a.driveFileNamePrefix) });
    };
  var dl = function () {
    this.Mc = [];
  };
  dl.prototype.length = function () {
    return this.Mc.length;
  };
  dl.prototype.end = function () {
    var a = this.Mc;
    this.Mc = [];
    return a;
  };
  var fl = function (a, b) {
      this.hb = a;
      this.ne = b;
      this.l = {};
      this.Kc = !0;
      if (0 < this.hb.length) {
        for (a = 0; a < this.hb.length; a++) {
          b = this.hb[a];
          var c = b[0];
          this.l[c.toString()] = new el(c, b[1]);
        }
        this.Kc = !0;
      }
    },
    gl = function (a) {
      if (a.Kc) {
        if (a.ne) {
          var b = a.l,
            c;
          for (c in b)
            if (Object.prototype.hasOwnProperty.call(b, c)) {
              var d = b[c].Gc;
              d && gl(d);
            }
        }
      } else {
        a.hb.length = 0;
        b = hl(a);
        b.sort();
        for (c = 0; c < b.length; c++) {
          var e = a.l[b[c]];
          (d = e.Gc) && gl(d);
          a.hb.push([e.key, e.value]);
        }
        a.Kc = !0;
      }
      return a.hb;
    };
  k = fl.prototype;
  k.getLength = function () {
    return hl(this).length;
  };
  k.clear = function () {
    this.l = {};
    this.Kc = !1;
  };
  k.entries = function () {
    var a = [],
      b = hl(this);
    b.sort();
    for (var c = 0; c < b.length; c++) {
      var d = this.l[b[c]];
      a.push([d.key, il(this, d)]);
    }
    return new jl(a);
  };
  k.keys = function () {
    var a = [],
      b = hl(this);
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(this.l[b[c]].key);
    return new jl(a);
  };
  k.values = function () {
    var a = [],
      b = hl(this);
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(il(this, this.l[b[c]]));
    return new jl(a);
  };
  k.forEach = function (a, b) {
    var c = hl(this);
    c.sort();
    for (var d = 0; d < c.length; d++) {
      var e = this.l[c[d]];
      a.call(b, il(this, e), e.key, this);
    }
  };
  k.set = function (a, b) {
    var c = new el(a);
    this.ne ? ((c.Gc = b), (c.value = gl(b))) : (c.value = b);
    this.l[a.toString()] = c;
    this.Kc = !1;
    return this;
  };
  var il = function (a, b) {
    return a.ne ? (b.Gc || (b.Gc = new a.ne(b.value)), b.Gc) : b.value;
  };
  fl.prototype.get = function (a) {
    if ((a = this.l[a.toString()])) return il(this, a);
  };
  fl.prototype.has = function (a) {
    return a.toString() in this.l;
  };
  var hl = function (a) {
      a = a.l;
      var b = [],
        c;
      for (c in a) Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
      return b;
    },
    el = function (a, b) {
      this.key = a;
      this.value = b;
      this.Gc = void 0;
    },
    jl = function (a) {
      this.oh = 0;
      this.hb = a;
    };
  jl.prototype.next = function () {
    return this.oh < this.hb.length
      ? { done: !1, value: this.hb[this.oh++] }
      : { done: !0, value: void 0 };
  };
  "undefined" != typeof Symbol &&
    "undefined" != typeof Symbol.iterator &&
    (jl.prototype[Symbol.iterator] = function () {
      return this;
    });
  Object.freeze && Object.freeze([]);
  var ll = function (a, b, c, d, e) {
    var f = ["https://www.googleapis.com/auth/earthengine"];
    M && f.push("https://www.googleapis.com/auth/cloud-platform");
    d && (jb(f, d), lb(f));
    sj(a, f);
    null === a
      ? qj()
      : mj(function () {
          oj(b, c, e || Ga(kl, b, c));
        });
  };
  w("ee.data.authenticateViaOauth", ll);
  var ml = function (a, b, c, d, e) {
    ll(a, b, c, d, e);
  };
  w("ee.data.authenticate", ml);
  var kl = function (a, b) {
    r.gapi.auth.authorize(
      { client_id: kj, immediate: !1, scope: lj.join(" ") },
      Ga(nj, a, b)
    );
  };
  w("ee.data.authenticateViaPopup", kl);
  var nl = function (a, b, c, d) {
    if ("window" in r)
      throw Error(
        "Use of private key authentication in the browser is insecure. Consider using OAuth, instead."
      );
    var e = [
      "https://www.googleapis.com/auth/earthengine",
      "https://www.googleapis.com/auth/devstorage.read_write",
    ];
    M && e.push("https://www.googleapis.com/auth/cloud-platform");
    d && (jb(e, d), lb(e));
    sj(a.client_email, e);
    var f = new google.auth.JWT(a.client_email, null, a.private_key, e, null);
    jj = function (g, h) {
      f.authorize(function (n, p) {
        n
          ? h({ error: n })
          : h({
              access_token: p.access_token,
              token_type: p.token_type,
              expires_in: (p.expiry_date - Date.now()) / 1e3,
            });
      });
    };
    oj(b, c);
  };
  w("ee.data.authenticateViaPrivateKey", nl);
  var ol = [];
  ol.push("setApiKey");
  ol.push("setProject");
  ol.push("getProject");
  ol.push("setCloudApiEnabled");
  ol.push("getCloudApiEnabled");
  w("ee.data.setExpressionAugmenter", function (a) {
    pl = a || Rb;
  });
  var pl = Rb;
  w("ee.data.setAuthToken", function (a, b, c, d, e, f, g) {
    var h = ["https://www.googleapis.com/auth/earthengine"];
    M && h.push("https://www.googleapis.com/auth/cloud-platform");
    e && (jb(h, e), lb(h));
    kj = a;
    lj = h;
    var n = {
      token_type: b,
      access_token: c,
      state: h.join(" "),
      expires_in: d,
    };
    nj(void 0, void 0, n);
    !1 === g
      ? f && f()
      : mj(function () {
          r.gapi.auth.setToken(n);
          f && f();
        });
  });
  w("ee.data.refreshAuthToken", oj);
  w("ee.data.setAuthTokenRefresher", function (a) {
    jj = a;
  });
  w("ee.data.getAuthToken", gj);
  w("ee.data.clearAuthToken", qj);
  w("ee.data.getAuthClientId", function () {
    return kj;
  });
  w("ee.data.getAuthScopes", function () {
    return lj;
  });
  w("ee.data.setDeadline", function (a) {
    Fj = a;
  });
  w("ee.data.setParamAugmenter", function (a) {
    zj = a || Rb;
  });
  var ql = function (a) {
      if (M)
        return (
          (a = new I(a)), J(a, a.Jc().list(cj(), { prettyPrint: !1 }).then(Vj))
        );
      var b = L("/algorithms", null, a, "GET");
      return a ? null : b;
    },
    sl = function (a, b) {
      if (M) {
        if ("string" === typeof a.image)
          throw Error("Image as JSON string not supported.");
        if (void 0 !== a.version)
          throw Error("Image version specification not supported.");
        a = new Cf({
          name: null,
          i: pl(Hk(a.image)),
          C: Oj(a.format),
          da: Rj(a.bands),
          fc: Uj(a),
        });
        var c = new I(b);
        return J(
          c,
          c
            .maps()
            .create(cj(), a, { fields: ["name"] })
            .then(function (e) {
              return rl(e.name, "");
            })
        );
      }
      a = Nb(a);
      "string" !== typeof a.image && (a.image = a.image.X(!0));
      var d = function (e) {
        return rl(e.mapid, e.token);
      };
      return b
        ? (L("/mapid", K(a), function (e, f) {
            return b(e && d(e), f);
          }),
          null)
        : d(L("/mapid", K(a)));
    };
  w("ee.data.getMapId", sl);
  var tl = function (a, b, c, d) {
    if (!a.formatTileUrl) {
      var e = rl(a.mapid, a.token, a.urlFormat);
      a.urlFormat = e.urlFormat;
      a.formatTileUrl = e.formatTileUrl;
    }
    return a.formatTileUrl(b, c, d);
  };
  w("ee.data.getTileUrl", tl);
  var rl = function (a, b, c) {
      var d = void 0 === c ? "" : c;
      d ||
        (aj(),
        (c = uj),
        (d = b
          ? c + "/map/" + a + "/{z}/{x}/{y}?token=" + b
          : c + "/v1alpha/" + a + "/tiles/{z}/{x}/{y}"));
      return {
        mapid: a,
        token: b,
        formatTileUrl: function (e, f, g) {
          var h = Math.pow(2, g);
          e %= h;
          e = String(0 > e ? e + h : e);
          return d.replace("{x}", e).replace("{y}", f).replace("{z}", g);
        },
        urlFormat: d,
      };
    },
    ul = function (a, b) {
      if (M)
        return (
          (a = pl(Hk(a))),
          (b = new I(b)),
          J(
            b,
            Ug(b.value(), cj(), new kf({ i: a })).then(function (c) {
              return c.result;
            })
          )
        );
      a = { json: Dk(a) };
      return L("/value", K(a), b);
    };
  w("ee.data.computeValue", ul);
  var vl = function (a, b) {
    if (M) {
      if ("string" === typeof a.image)
        throw Error("Image as JSON string not supported.");
      if (void 0 !== a.version)
        throw Error("Image version specification not supported.");
      if (void 0 !== a.region)
        throw Error(
          '"region" not supported in call to ee.data.getThumbId. Use ee.Image.getThumbURL.'
        );
      if (void 0 !== a.dimensions)
        throw Error(
          '"dimensions" is not supported in call to ee.data.getThumbId. Use ee.Image.getThumbURL.'
        );
      a = new Cg({
        name: null,
        i: pl(Hk(a.image)),
        C: Oj(a.format),
        fa: a.name,
        da: Rj(a.bands),
        fc: Uj(a),
        L: null,
      });
      b = new I(b);
      return J(
        b,
        new Sg(b.P).create(cj(), a, { fields: ["name"] }).then(function (d) {
          return { thumbid: d.name, token: "" };
        })
      );
    }
    a = Nb(a);
    Array.isArray(a.dimensions) && (a.dimensions = a.dimensions.join("x"));
    var c = a.image || a.imageCollection;
    "string" !== typeof c && (c = c.X(!0));
    a.image = c;
    delete a.imageCollection;
    a = K(a).add("getid", "1");
    return L("/thumb", a, b);
  };
  w("ee.data.getThumbId", vl);
  var wl = function (a, b) {
    if (!M) throw Error("getVideoThumbId is only supported in Cloud API mode.");
    var c = new Qf({
      framesPerSecond: a.framesPerSecond || null,
      maxFrames: a.maxFrames || null,
      maxPixelsPerFrame: a.maxPixelsPerFrame || null,
    });
    a = new Gg({
      name: null,
      i: pl(Hk(a.imageCollection)),
      C: Oj(a.format),
      Qa: c,
      L: null,
    });
    b = new I(b);
    return J(
      b,
      new Xg(b.P).create(cj(), a, { fields: ["name"] }).then(function (d) {
        return { thumbid: d.name, token: "" };
      })
    );
  };
  w("ee.data.getVideoThumbId", wl);
  ol.push("getVideoThumbId");
  var xl = function (a, b) {
    if (!M)
      throw Error("getFilmstripThumbId is only supported in Cloud API mode.");
    a = new Sf({
      name: null,
      i: pl(Hk(a.imageCollection)),
      C: Oj(a.format),
      orientation: Qj(a.orientation),
      L: null,
    });
    b = new I(b);
    return J(
      b,
      new Lg(b.P).create(cj(), a, { fields: ["name"] }).then(function (c) {
        return { thumbid: c.name, token: "" };
      })
    );
  };
  w("ee.data.getFilmstripThumbId", xl);
  ol.push("getFilmstripThumbId");
  var yl = function (a) {
    return M
      ? uj + "/v1alpha/" + a.thumbid + ":getPixels"
      : uj + "/api/thumb?thumbid=" + a.thumbid + ("&token=" + a.token);
  };
  w("ee.data.makeThumbUrl", yl);
  var Al = function (a, b) {
    if (M) {
      a = Object.assign({}, a);
      a.id && (a.image = new N(a.id));
      if ("string" === typeof a.image)
        throw Error("Image as serialized JSON string not supported.");
      if (!a.image) throw Error("Missing ID or image parameter.");
      a.filePerBand = !1 !== a.filePerBand;
      a.format =
        a.format ||
        (a.filePerBand ? "ZIPPED_GEO_TIFF_PER_BAND" : "ZIPPED_GEO_TIFF");
      if (
        null != a.region &&
        (null != a.scale || null != a.crs_transform) &&
        null != a.dimensions
      )
        throw Error(
          "Cannot specify (bounding region, crs_transform/scale, dimensions) simultaneously."
        );
      if ("string" === typeof a.bands)
        try {
          a.bands = JSON.parse(a.bands);
        } catch (d) {
          a.bands = Rj(a.bands);
        }
      if (a.bands && !Array.isArray(a.bands))
        throw Error("Bands parameter must be an array.");
      a.bands &&
        a.bands.every(function (d) {
          return "string" === typeof d;
        }) &&
        (a.bands = a.bands.map(function (d) {
          return { id: d };
        }));
      if (
        a.bands &&
        a.bands.some(function (d) {
          return null == d.id;
        })
      )
        throw Error("Each band dictionary must have an id.");
      "string" === typeof a.region && (a.region = JSON.parse(a.region));
      if ("string" === typeof a.crs_transform)
        try {
          a.crs_transform = JSON.parse(a.crs_transform);
        } catch (d) {}
      var c = zl(a.image, a);
      a = new Cg({
        name: null,
        i: pl(Hk(c)),
        C: Oj(a.format),
        fa: a.name,
        da:
          a.bands &&
          Rj(
            a.bands.map(function (d) {
              return d.id;
            })
          ),
        L: null,
      });
      b = new I(b);
      return J(
        b,
        new Sg(b.P).create(cj(), a, { fields: ["name"] }).then(function (d) {
          return { docid: d.name, token: "" };
        })
      );
    }
    a = Nb(a);
    return L("/download", K(a), b);
  };
  w("ee.data.getDownloadId", Al);
  var Bl = function (a) {
    aj();
    var b = uj;
    return M
      ? b + "/v1alpha/" + a.docid + ":getPixels"
      : b + "/api/download?docid=" + a.docid + "&token=" + a.token;
  };
  w("ee.data.makeDownloadUrl", Bl);
  var Cl = function (a, b) {
    if (M) {
      b = new I(b);
      var c = Pj(a.format),
        d = pl(Hk(a.table)),
        e = null;
      if (null != a.selectors)
        if ("string" === typeof a.selectors) e = a.selectors.split(",");
        else if (
          Array.isArray(a.selectors) &&
          a.selectors.every(function (f) {
            return "string" === typeof f;
          })
        )
          e = a.selectors;
        else throw Error("'selectors' parameter must be an array of strings.");
      a = new Ag({
        name: null,
        i: d,
        C: c,
        selectors: e,
        filename: a.filename || null,
      });
      return J(
        b,
        new Rg(b.P).create(cj(), a, { fields: ["name"] }).then(function (f) {
          return { docid: f.name || "", token: "" };
        })
      );
    }
    a = Nb(a);
    return L("/table", K(a), b);
  };
  w("ee.data.getTableDownloadId", Cl);
  var Dl = function (a) {
    return M
      ? uj + "/v1alpha/" + a.docid + ":getFeatures"
      : uj + "/api/table?docid=" + a.docid + "&token=" + a.token;
  };
  w("ee.data.makeTableDownloadUrl", Dl);
  var El = function (a, b) {
    if (M) {
      var c = function (e) {
        return Math.floor(Math.random() * Math.pow(2, 4 * e))
          .toString(16)
          .padStart(e, "0");
      };
      a = mb(a || 1).map(function () {
        return [
          c(8),
          c(4),
          "4" + c(3),
          (8 + Math.floor(4 * Math.random())).toString(16) + c(3),
          c(12),
        ].join("-");
      });
      return b ? b(a) : a;
    }
    var d = {};
    "number" === typeof a && (d.count = a);
    return L("/newtaskid", K(d), b);
  };
  w("ee.data.newTaskId", El);
  var Gl = function (a, b) {
    if (M) {
      var c = Fl(a).map(mk);
      if (1 === c.length)
        return (
          (b = new I(b)),
          J(
            b,
            b
              .La()
              .get(c[0])
              .then(function (e) {
                return [ok(e)];
              })
          )
        );
      b = new fj(b);
      var d = b.La();
      return b.send(
        c.map(function (e) {
          return [e, d.get(e)];
        }),
        function (e) {
          return c.map(function (f) {
            return ok(e[f]);
          });
        }
      );
    }
    a = "/taskstatus?q=" + Fl(a).join();
    return L(a, null, b, "GET");
  };
  w("ee.data.getTaskStatus", Gl);
  var Fl = function (a) {
      if ("string" === typeof a) return [a];
      if (Array.isArray(a)) return a;
      throw Error("Invalid value: expected a string or an array of strings.");
    },
    Il = function (a) {
      return Hl(void 0, a);
    };
  w("ee.data.getTaskList", Il);
  var Hl = function (a, b) {
    function c(h) {
      var n = { pagesize: 500 };
      a && (n.pagesize = Math.min(n.pagesize, a - e.tasks.length));
      h && (n.pagetoken = h);
      return n;
    }
    function d(h, n) {
      n = c(n);
      L(
        "/tasklist",
        K(n),
        function (p, t) {
          t
            ? h(e, t)
            : (jb(e.tasks, p.tasks),
              !p.next_page_token || (a && e.tasks.length >= a)
                ? h(e)
                : d(h, p.next_page_token));
        },
        "GET"
      );
    }
    if (M)
      return b
        ? (Jl(a, function (h, n) {
            return b(h ? { tasks: h.map(ok) } : null, n);
          }),
          null)
        : { tasks: Jl(a).map(ok) };
    var e = { tasks: [] };
    if (b) return d(b), null;
    for (var f = ""; ; ) {
      f = c(f);
      var g = L("/tasklist", K(f), void 0, "GET");
      jb(e.tasks, g.tasks);
      f = g.next_page_token;
      if (!g.next_page_token || (a && e.tasks.length >= a)) break;
    }
    return e;
  };
  w("ee.data.getTaskListWithLimit", Hl);
  var Jl = function (a, b) {
    var c = [],
      d = { pageSize: 500 },
      e = function (h) {
        jb(c, h.La || []);
        !h.Za || (a && c.length >= a)
          ? b && b(a ? c.slice(0, a) : c)
          : ((d.pageToken = h.Za), J(f, g.list(cj(), d).then(e)));
        return null;
      },
      f = new I(
        b
          ? function (h, n) {
              return n && b(h, n);
            }
          : void 0
      ),
      g = f.La();
    J(f, g.list(cj(), d).then(e));
    return b ? null : a ? c.slice(0, a) : c;
  };
  w("ee.data.listOperations", Jl);
  ol.push("listOperations");
  var Kl = function (a, b) {
    a = Fl(a);
    var c = new ef();
    if (1 === a.length) (b = new I(b)), J(b, b.La().cancel(a[0], c));
    else {
      b = new fj(b);
      var d = b.La();
      b.send(
        a.map(function (e) {
          return [e, d.cancel(e, c)];
        })
      );
    }
  };
  w("ee.data.cancelOperation", Kl);
  ol.push("cancelOperation");
  var Ll = function (a, b) {
    var c = Fl(a).map(mk);
    if (!Array.isArray(a)) return (a = new I(b)), J(a, a.La().get(c[0]));
    a = new fj(b);
    var d = a.La();
    return a.send(
      c.map(function (e) {
        return [e, d.get(e)];
      })
    );
  };
  w("ee.data.getOperation", Ll);
  ol.push("getOperation");
  var Nl = function (a, b) {
    return Ml(a, "CANCEL", b);
  };
  w("ee.data.cancelTask", Nl);
  var Ml = function (a, b, c) {
    if (!Hb(Ol, b)) throw Error("Invalid action: " + b);
    a = Fl(a);
    return M
      ? ((a = a.map(mk)), Kl(a, c), null)
      : L("/updatetask", K({ id: a, action: b }), c, "POST");
  };
  w("ee.data.updateTask", Ml);
  var Tl = function (a, b, c) {
    if (M) {
      b.id = a;
      var d = b.type;
      a = null != b.sourceUrl ? { __source_url__: b.sourceUrl } : {};
      var e = new I(c);
      c = function (f) {
        return J(e, f.then(pk));
      };
      switch (d) {
        case "EXPORT_IMAGE":
          return (b = Pl(b, a)), c(e.image().mb(cj(), b));
        case "EXPORT_FEATURES":
          return (b = Yk(b)), (b.i = pl(b.i, a)), c(e.table().mb(cj(), b));
        case "EXPORT_VIDEO":
          return (b = Ql(b, a)), c(e.video().mb(cj(), b));
        case "EXPORT_TILES":
          return (b = Rl(b, a)), c(e.map().mb(cj(), b));
        case "EXPORT_VIDEO_MAP":
          return (b = Sl(b)), c(new Wg(e.P).mb(cj(), b));
        default:
          throw Error("Unable to start processing for task of type " + d);
      }
    }
    b = Nb(b);
    null != b.element && ((b.json = b.element.X(!0)), delete b.element);
    Array.isArray(b.crs_transform) &&
      (b.crs_transform = b.crs_transform.toString());
    b.id = a;
    return L("/processingrequest", K(b), c);
  };
  w("ee.data.startProcessing", Tl);
  var Pl = function (a, b) {
      var c = Ul(a);
      if (null == c.element) throw Error('"element" not found in params ' + c);
      a = new Ff({
        i: Hk(c.element),
        description: Tk(c.description),
        la: null,
        ib: null,
        L: null,
        Ef: Tk(c.maxPixels),
        requestId: Tk(c.id),
        W: Uk(c.maxWorkers),
      });
      var d = Vk(c);
      switch (d) {
        case "GOOGLE_CLOUD_STORAGE":
        case "DRIVE":
          a.la = al(c, d);
          break;
        case "ASSET":
          d = c.pyramidingPolicy || {};
          try {
            d = JSON.parse(d);
          } catch (f) {}
          var e = "PYRAMIDING_POLICY_UNSPECIFIED";
          "string" === typeof d
            ? ((e = d), (d = {}))
            : d[".default"] && ((e = d[".default"]), delete d[".default"]);
          c = new Gf({
            Sb: new Bf({ name: ak(c.assetId) }),
            pyramidingPolicy: e,
            Mf: Lb(d) ? null : d,
          });
          a.ib = c;
          break;
        default:
          throw Error('Export destination "' + d + '" unknown');
      }
      a.i = pl(a.i, b);
      return a;
    },
    Ql = function (a, b) {
      a = Vl(a);
      if (null == a.element) throw Error('"element" not found in params ' + a);
      var c = new Rf({
        i: Hk(a.element),
        description: Tk(a.description),
        Qa: new Qf({
          framesPerSecond: Uk(a.framesPerSecond),
          maxFrames: Uk(a.maxFrames),
          maxPixelsPerFrame: Tk(a.maxPixels),
        }),
        la: null,
        requestId: Tk(a.id),
        W: Uk(a.maxWorkers),
      });
      c.la = bl(a, Vk(a));
      c.i = pl(c.i, b);
      return c;
    },
    Rl = function (a, b) {
      var c = a.scale;
      delete a.scale;
      a = Ul(a);
      a.scale = c;
      if (null == a.element) throw Error('"element" not found in params ' + a);
      c = new Jf({
        i: Hk(a.element),
        description: Tk(a.description),
        dc: cl(a),
        cc: al(a, "GOOGLE_CLOUD_STORAGE"),
        requestId: Tk(a.id),
        W: Uk(a.maxWorkers),
      });
      c.i = pl(c.i, b);
      return c;
    },
    Sl = function (a) {
      var b = a.scale;
      delete a.scale;
      a = Vl(a);
      a.scale = b;
      if (null == a.element) throw Error('"element" not found in params ' + a);
      b = new Of({
        i: Hk(a.element),
        description: Tk(a.description),
        Qa: new Qf({
          framesPerSecond: Uk(a.framesPerSecond),
          maxFrames: Uk(a.maxFrames),
          maxPixelsPerFrame: null,
        }),
        dc: cl(a),
        cc: bl(a, "GOOGLE_CLOUD_STORAGE"),
        requestId: Tk(a.id),
        version: Tk(a.version),
        W: Uk(a.maxWorkers),
      });
      b.i = pl(b.i);
      return b;
    },
    Xl = function (a, b, c) {
      if (M) {
        b = tk(b);
        var d = function (e) {
          return e ? pk(e) : null;
        };
        return d(
          Wl(
            a,
            b,
            c &&
              function (e, f) {
                return c(d(e), f);
              }
          )
        );
      }
      a = { id: a, request: ki(b) };
      return L("/ingestionrequest", K(a), c);
    };
  w("ee.data.startIngestion", Xl);
  var Wl = function (a, b, c) {
      b = new lg({ rf: b, requestId: a, overwrite: null, description: null });
      a = new I(c, a ? void 0 : 0);
      return J(a, a.image().import(cj(), b));
    },
    Yl = function (a, b, c) {
      b = new mg({ eg: b, requestId: a, overwrite: null, description: null });
      a = new I(c, a ? void 0 : 0);
      return J(a, a.table().import(cj(), b));
    },
    Zl = function (a, b, c) {
      if (M) {
        b = uk(b);
        var d = function (e) {
          return e ? pk(e) : null;
        };
        return d(
          Yl(
            a,
            b,
            c &&
              function (e, f) {
                return c(d(e), f);
              }
          )
        );
      }
      a = { id: a, tableRequest: ki(b) };
      return L("/ingestionrequest", K(a), c);
    };
  w("ee.data.startTableIngestion", Zl);
  var $l = function (a, b) {
    return M
      ? ((b = new I(b)),
        (a = ak(a)),
        J(b, b.assets().get(a, { prettyPrint: !1 }).then(bk)))
      : L("/info", new Zd().add("id", a), b);
  };
  w("ee.data.getAsset", $l);
  ol.push("getAsset");
  w("ee.data.getInfo", $l);
  var am = function (a, b) {
    if (M) {
      b = new I(b);
      var c = b.assets(),
        d = ak(a.id),
        e = Yj.test(a.id);
      e && ((c = new Ig(b.P)), (d = "projects/" + Zj(a.id)));
      if (
        Object.keys(a).every(function (f) {
          return "id" === f || "num" === f;
        })
      )
        return J(b, c.bd(d, { pageSize: a.num }).then(ck));
      if (e)
        throw Error(
          "getList on a project does not support filtering options. Please provide a full asset path. Got: " +
            a.id
        );
      a = jk(a);
      return J(b, Kg(c, d, a).then(ek));
    }
    a = K(a);
    return L("/list", a, b);
  };
  w("ee.data.getList", am);
  var bm = function (a, b, c) {
    b = void 0 === b ? {} : b;
    var d = Yj.test(a);
    c = new I(c);
    var e = d ? new Ig(c.P) : c.assets();
    a = d ? "projects/" + Zj(a) : ak(a);
    return J(c, e.bd(a, b));
  };
  w("ee.data.listAssets", bm);
  ol.push("listAssets");
  var cm = function (a, b, c) {
    b = void 0 === b ? {} : b;
    c = new I(c);
    return J(c, Kg(c.assets(), a, b));
  };
  w("ee.data.listImages", cm);
  ol.push("listImages");
  var dm = function (a, b) {
    b = new I(b);
    return J(b, new Ig(b.P).bd(a || cj()));
  };
  w("ee.data.listBuckets", dm);
  ol.push("listBuckets");
  var em = function (a) {
    return M
      ? ((a = new I(a)), J(a, new Ig(a.P).bd(cj()).then(ck)))
      : L("/buckets", null, a, "GET");
  };
  w("ee.data.getAssetRoots", em);
  var fm = function (a, b) {
    if (M) {
      var c = "projects/" + Zj(a);
      a = "projects/earthengine-legacy" === c ? a : void 0;
      var d = new vf({ type: "Folder" });
      b = new I(b);
      J(b, b.assets().create(c, d, { assetId: a }).then(bk));
    } else (c = K({ id: a })), L("/createbucket", c, b);
  };
  w("ee.data.createAssetHome", fm);
  var gm = function (a, b, c, d, e) {
    if (M) {
      if (c) throw Error("Asset overwrite not supported.");
      if ("string" === typeof a)
        throw Error("Asset cannot be specified as string.");
      c = a.name || (b && ak(b));
      if (!c) throw Error("Either asset name or opt_path must be specified.");
      var f = c.indexOf("/assets/");
      if (-1 === f) throw Error("Asset name must contain /assets/.");
      a = new vf(a);
      b = c.slice(0, f);
      c = c.slice(f + 8);
      a.id = null;
      a.name = null;
      d && !a.properties && (a.properties = d);
      a: switch (((d = a.type), d)) {
        case "ImageCollection":
          d = "IMAGE_COLLECTION";
          break a;
        case "Folder":
          d = "FOLDER";
      }
      a.type = d;
      e = new I(e);
      return J(e, e.assets().create(b, a, { assetId: c }).then(bk));
    }
    "string" !== typeof a && (a = ki(a));
    a = { value: a };
    void 0 !== b && (a.id = b);
    a.force = c || !1;
    void 0 != d && (a.properties = ki(d));
    return L("/create", K(a), e);
  };
  w("ee.data.createAsset", gm);
  var hm = function (a, b, c) {
    return M
      ? gm({ type: "Folder" }, a, b, void 0, c)
      : L("/createfolder", K({ id: a, force: b || !1 }), c);
  };
  w("ee.data.createFolder", hm);
  var im = function (a, b, c) {
    M
      ? ((a = ak(a)),
        (b = ak(b)),
        (b = new ug({ Rb: b })),
        (c = new I(c)),
        J(c, c.assets().move(a, b).then(bk)))
      : L("/rename", K({ sourceId: a, destinationId: b }), c);
  };
  w("ee.data.renameAsset", im);
  var jm = function (a, b, c, d) {
    if (M) {
      a = ak(a);
      b = ak(b);
      c = new of({ Rb: b, overwrite: null != c ? c : null });
      d = new I(d);
      b = bk;
      var e = d.assets();
      var f = void 0 === f ? {} : f;
      e.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
      f = H(e.h, {
        body: c,
        u: "POST",
        D: "earthengine.projects.assets.copy",
        path: "/" + e.j + "/" + a + ":copy",
        o: G(f),
        G: vf,
      });
      J(d, f.then(b));
    } else
      (f = { sourceId: a, destinationId: b }),
        c && (f.allowOverwrite = c),
        L("/copy", K(f), d);
  };
  w("ee.data.copyAsset", jm);
  var km = function (a, b) {
    M
      ? ((b = new I(b)), J(b, b.assets().delete(ak(a))))
      : L("/delete", K({ id: a }), b);
  };
  w("ee.data.deleteAsset", km);
  var lm = function (a, b) {
    if (M) {
      a = ak(a);
      var c = new Yf();
      b = new I(b);
      var d = b.assets(),
        e = { prettyPrint: !1 };
      e = void 0 === e ? {} : e;
      d.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
      a = H(d.h, {
        body: c,
        u: "POST",
        D: "earthengine.projects.assets.getIamPolicy",
        path: "/" + d.j + "/" + a + ":getIamPolicy",
        o: G(e),
        G: xg,
      });
      return J(b, a.then(kk));
    }
    return L("/getacl", K({ id: a }), b, "GET");
  };
  w("ee.data.getAssetAcl", lm);
  var mm = function (a, b, c, d) {
    b = new Fg({ Me: b, Fc: (c || []).join(",") });
    d = new I(d);
    c = bk;
    var e = d.assets();
    a = ak(a);
    var f = void 0 === f ? {} : f;
    e.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
    f = H(e.h, {
      body: b,
      u: "PATCH",
      D: "earthengine.projects.assets.patch",
      path: "/" + e.j + "/" + a,
      o: G(f),
      G: vf,
    });
    return J(d, f.then(c));
  };
  w("ee.data.updateAsset", mm);
  var nm = function (a, b, c) {
    if (M) {
      a = ak(a);
      b = lk(b);
      b = new zg({ Jf: b });
      c = new I(c);
      var d = c.assets(),
        e = { prettyPrint: !1 };
      e = void 0 === e ? {} : e;
      d.h.B(a, /^projects\/[^/]+\/assets\/.*$/);
      a = H(d.h, {
        body: b,
        u: "POST",
        D: "earthengine.projects.assets.setIamPolicy",
        path: "/" + d.j + "/" + a + ":setIamPolicy",
        o: G(e),
        G: xg,
      });
      J(c, a);
    } else
      (b = {
        readers: b.readers,
        writers: b.writers,
        all_users_can_read: b.all_users_can_read,
      }),
        (a = { id: a, value: ki(b) }),
        L("/setacl", K(a), c);
  };
  w("ee.data.setAssetAcl", nm);
  var om = function (a, b, c) {
    if (M) {
      var d = hk(b);
      b = Fd(d.f())
        .keys.filter(function (e) {
          return "properties" !== e && F(d, e);
        })
        .map(function (e) {
          return e.replace(/([A-Z])/g, function (f, g) {
            return "_" + g.toLowerCase();
          });
        })
        .concat(
          Object.keys(d.properties || {}).map(function (e) {
            return 'properties."' + e + '"';
          })
        );
      mm(a, d, b, c);
    } else (a = { id: a, properties: ki(b) }), L("/setproperties", K(a), c);
  };
  w("ee.data.setAssetProperties", om);
  var pm = function (a, b) {
    if (M) {
      var c = ak(a);
      b = new I(b);
      var d = b.assets(),
        e = d.h.B;
      d.h.B = function (f, g) {
        "^projects\\/[^/]+\\/assets\\/.+$" === g.source &&
          (g = /^projects\/[^/]+\/assets\/.*$/);
        return e(f, g);
      };
      c = d.get(c, { prettyPrint: !1 });
      return J(
        b,
        c.then(function (f) {
          if (!(f instanceof vf && f.quota))
            throw Error(a + " is not a root folder.");
          f = f.quota;
          return {
            asset_count: { usage: Number(f.Ne || 0), limit: Number(f.Cf || 0) },
            asset_size: { usage: Number(f.Da || 0), limit: Number(f.Xb || 0) },
          };
        })
      );
    }
    return L("/quota", K({ id: a }), b, "GET");
  };
  w("ee.data.getAssetRootQuota", pm);
  var Ol = { xk: "CANCEL", Ak: "UPDATE" };
  var O = function (a, b, c) {
    if (!(this instanceof O)) return qm(O, arguments);
    if (c && (a || b))
      throw Error(
        'When "opt_varName" is specified, "func" and "args" must be null.'
      );
    if (a && !b)
      throw Error('When "func" is specified, "args" must not be null.');
    this.F = a;
    this.args = b;
    this.V = c || null;
  };
  x(O, Gj);
  w("ee.ComputedObject", O);
  O.prototype.evaluate = function (a) {
    if (!a || "function" !== typeof a)
      throw Error("evaluate() requires a callback function.");
    ul(this, a);
  };
  O.prototype.evaluate = O.prototype.evaluate;
  O.prototype.Z = function (a) {
    return ul(this, a);
  };
  O.prototype.getInfo = O.prototype.Z;
  O.prototype.encode = function (a) {
    if (null === this.F && null === this.args)
      return { type: "ArgumentRef", value: this.V };
    var b = {},
      c;
    for (c in this.args) void 0 !== this.args[c] && (b[c] = a(this.args[c]));
    b = { type: "Invocation", arguments: b };
    a = a(this.F);
    b["string" === typeof a ? "functionName" : "function"] = a;
    return b;
  };
  O.prototype.ka = function (a) {
    if (null === this.F && null === this.args)
      return new Ze({ Pb: this.V || "" });
    var b = {},
      c;
    for (c in this.args)
      void 0 !== this.args[c] && (b[c] = Ij(a(this.args[c])));
    return "string" === typeof this.F ? Lj(String(this.F), b) : this.F.Ed(a, b);
  };
  O.prototype.X = function (a) {
    return (void 0 === a ? 0 : a) ? Dk(this) : Lk(this);
  };
  O.prototype.serialize = O.prototype.X;
  O.prototype.toString = function () {
    return "ee." + this.name() + "(" + Fk(this) + ")";
  };
  w("ee.ComputedObject.prototype.toString", O.prototype.toString);
  O.prototype.name = function () {
    return "ComputedObject";
  };
  O.prototype.ng = function (a, b) {
    var c = ib(arguments);
    c[0] = this;
    a.apply(r, c);
    return this;
  };
  O.prototype.aside = O.prototype.ng;
  var rm = function (a, b) {
      if (b instanceof a.constructor) return b;
      var c = function () {};
      c.prototype = a.constructor.prototype;
      a = new c();
      a.F = b.F;
      a.args = b.args;
      a.V = b.V;
      return a;
    },
    qm = function (a, b) {
      function c() {
        return a.apply(this, b);
      }
      c.prototype = a.prototype;
      return new c();
    };
  var sm = {},
    tm = function (a, b) {
      if (b == a) return !0;
      switch (a) {
        case "Element":
          return (
            "Element" == b ||
            "Image" == b ||
            "Feature" == b ||
            "Collection" == b ||
            "ImageCollection" == b ||
            "FeatureCollection" == b
          );
        case "FeatureCollection":
        case "Collection":
          return (
            "Collection" == b ||
            "ImageCollection" == b ||
            "FeatureCollection" == b
          );
        case "Object":
          return !0;
        default:
          return !1;
      }
    },
    um = function (a) {
      return "number" === typeof a || (a instanceof O && "Number" == a.name());
    },
    vm = function (a) {
      return "string" === typeof a || (a instanceof O && "String" == a.name());
    },
    wm = function (a) {
      return u(a) && "function" !== typeof a
        ? ((a = Object.getPrototypeOf(a)),
          null !== a && null === Object.getPrototypeOf(a))
        : !1;
    },
    xm = function (a, b, c) {
      return 1 === a.length &&
        wm(a[0]) &&
        ((a = b.args), (void 0 === c ? 0 : c) && (a = a.slice(1)), a.length)
        ? !(1 === a.length || a[1].optional) || "Dictionary" !== a[0].type
        : !1;
    };
  var ym = function () {
    if (!(this instanceof ym)) return new ym();
  };
  x(ym, Gj);
  w("ee.Function", ym);
  var zm = Rb;
  ym.prototype.call = function (a) {
    return this.apply(Am(this, Array.prototype.slice.call(arguments, 0)));
  };
  ym.prototype.call = ym.prototype.call;
  ym.prototype.apply = function (a) {
    a = new O(this, Bm(this, a));
    return zm(a, this.aa().returns);
  };
  ym.prototype.apply = ym.prototype.apply;
  var Cm = function (a, b, c) {
      var d = void 0 !== b,
        e = a.aa();
      if (xm(c, e, d)) {
        if (((c = Nb(c[0])), d)) {
          d = e.args[0].name;
          if (d in c)
            throw Error(
              "Named args for " + e.name + " can't contain keyword " + d
            );
          c[d] = b;
        }
      } else c = Am(a, d ? [b].concat(c) : c);
      return a.apply(c);
    },
    Bm = function (a, b) {
      for (var c = a.aa().args, d = {}, e = {}, f = 0; f < c.length; f++) {
        var g = c[f].name;
        if (g in b && void 0 !== b[g]) d[g] = zm(b[g], c[f].type);
        else if (!c[f].optional)
          throw Error(
            "Required argument (" + g + ") missing to function: " + a
          );
        e[g] = !0;
      }
      c = [];
      for (var h in b) e[h] || c.push(h);
      if (0 < c.length)
        throw Error("Unrecognized arguments (" + c + ") to function: " + a);
      return d;
    },
    Am = function (a, b) {
      var c = a.aa().args;
      if (c.length < b.length)
        throw Error("Too many (" + b.length + ") arguments to function: " + a);
      a = {};
      for (var d = 0; d < b.length; d++) a[c[d].name] = b[d];
      return a;
    };
  ym.prototype.toString = function (a, b) {
    var c = this.aa(),
      d = [];
    d.push(a || c.name);
    d.push("(");
    d.push(
      Xa(c.args.slice(b ? 1 : 0), function (f) {
        return f.name;
      }).join(", ")
    );
    d.push(")\n");
    d.push("\n");
    c.description ? d.push(c.description) : d.push("Undocumented.");
    d.push("\n");
    if (c.args.length)
      for (d.push("\nArgs:\n"), a = 0; a < c.args.length; a++) {
        b && 0 == a ? d.push("  this:") : d.push("\n  ");
        var e = c.args[a];
        d.push(e.name);
        d.push(" (");
        d.push(e.type);
        e.optional && d.push(", optional");
        d.push("): ");
        e.description ? d.push(e.description) : d.push("Undocumented.");
      }
    return d.join("");
  };
  ym.prototype.X = function (a) {
    return (void 0 === a ? 0 : a) ? Dk(this) : Lk(this);
  };
  var P = function (a, b) {
    if (void 0 === b) return Dm(a);
    if (!(this instanceof P)) return qm(P, arguments);
    this.ab = Ob(b);
    this.ab.name = a;
  };
  x(P, ym);
  w("ee.ApiFunction", P);
  var Q = function (a, b) {
    return ym.prototype.call.apply(
      Dm(a),
      Array.prototype.slice.call(arguments, 1)
    );
  };
  w("ee.ApiFunction._call", Q);
  var Em = function (a, b) {
    return Dm(a).apply(b);
  };
  w("ee.ApiFunction._apply", Em);
  P.prototype.encode = function () {
    return this.ab.name;
  };
  P.prototype.Ed = function (a, b) {
    return Lj(this.ab.name, b);
  };
  P.prototype.aa = function () {
    return this.ab;
  };
  var Fm = null,
    Gm = {},
    Im = function () {
      Hm();
      return Db(Fm, function (a) {
        return a.aa();
      });
    },
    Jm = function () {
      Hm();
      return Cb(Fm, function (a, b) {
        return !Gm[b];
      });
    },
    Dm = function (a) {
      var b = Km(a);
      if (!b) throw Error("Unknown built-in function name: " + a);
      return b;
    };
  w("ee.ApiFunction.lookup", Dm);
  var Km = function (a) {
      Hm();
      return Fm[a] || null;
    },
    Hm = function (a, b) {
      if (Fm) a && a();
      else {
        var c = function (d, e) {
          e
            ? b && b(Error(e))
            : ((Fm = Db(d, function (f, g) {
                f.returns = f.returns.replace(/<.*>/, "");
                for (var h = 0; h < f.args.length; h++)
                  f.args[h].type = f.args[h].type.replace(/<.*>/, "");
                return new P(g, f);
              })),
              a && a());
        };
        a ? ql(c) : c(ql());
      }
    },
    Lm = function (a, b, c, d) {
      Hm();
      var e = d || "";
      Bb(Fm, function (f, g) {
        var h = g.split(".");
        if (2 == h.length && h[0] == b) {
          h = e + h[1];
          var n = f.aa();
          Gm[g] = !0;
          var p = !1;
          n.args.length &&
            ((g = n.args[0].type), (p = "Object" != g && tm(g, c)));
          g = p ? a.prototype : a;
          (h in g && !g[h].signature) ||
            ((g[h] = function (t) {
              return Cm(
                f,
                p ? this : void 0,
                Array.prototype.slice.call(arguments, 0)
              );
            }),
            (g[h].toString = v(f.toString, f, h, p)),
            (g[h].signature = n));
        }
      });
    },
    Mm = function (a) {
      var b = function (c) {
        for (var d in c)
          "function" === typeof c[d] && c[d].signature && delete c[d];
      };
      b(a);
      b(a.prototype || {});
    };
  var R = function (a, b) {
      var c = Nm(a),
        d = Xa(c, function (n) {
          return n.replace(/^opt_/, "");
        });
      a = (a = r.EXPORTED_FN_INFO
        ? r.EXPORTED_FN_INFO[a.toString()].name.split(".").pop() + "()"
        : null)
        ? " to function " + a
        : "";
      var e = {},
        f = b[0],
        g =
          u(f) &&
          "function" !== typeof f &&
          !Array.isArray(f) &&
          "Object" === Object.getPrototypeOf(f).constructor.name;
      if (1 < b.length || !g) {
        if (b.length > d.length)
          throw Error(
            "Received too many arguments" +
              a +
              ". Expected at most " +
              d.length +
              " but got " +
              b.length +
              "."
          );
        for (f = 0; f < b.length; f++) e[d[f]] = b[f];
      } else {
        g = new xd(Gb(f));
        var h = new xd(d);
        if (h.th(g).isEmpty()) e[d[0]] = b[0];
        else {
          b = g.bf(h);
          if (!b.isEmpty())
            throw Error("Unexpected arguments" + a + ": " + b.T().join(", "));
          e = Nb(f);
        }
      }
      b = new xd(Gb(e));
      c = new xd(
        Wa(c, function (n) {
          return 0 != n.lastIndexOf("opt_", 0);
        })
      ).bf(b);
      if (!c.isEmpty())
        throw Error("Missing required arguments" + a + ": " + c.T().join(", "));
      return e;
    },
    Nm = function (a) {
      var b = Om,
        c = [];
      r.EXPORTED_FN_INFO
        ? ((a = r.EXPORTED_FN_INFO[a.toString()]),
          u(a) || Pm(),
          (c = a.paramNames),
          Array.isArray(c) || Pm())
        : ((a = a.toString().replace(Qm, "").match(b)),
          null === a && Pm(),
          (c = (a[1].split(",") || []).map(function (d) {
            return d.replace(Rm, "");
          })));
      return c;
    },
    Pm = function () {
      throw Error("Failed to locate function parameters.");
    },
    Qm = /((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/gm,
    Om = /^function[^\(]*\(([^\)]*)\)/m,
    Rm = /=.*$/;
  var S = function (a, b, c) {
    O.call(this, a, b, c);
    Sm();
  };
  x(S, O);
  w("ee.Element", S);
  var Tm = !1,
    Sm = function () {
      Tm || (Lm(S, "Element", "Element"), (Tm = !0));
    };
  S.prototype.name = function () {
    return "Element";
  };
  S.prototype.set = function (a) {
    var b;
    if (1 >= arguments.length) {
      var c = arguments[0];
      if ((b = wm(c)))
        a: {
          b = Gb(c);
          var d = ["properties"];
          if (ya(b) && ya(d) && b.length == d.length) {
            for (var e = b.length, f = 0; f < e; f++)
              if (b[f] !== d[f]) {
                b = !1;
                break a;
              }
            b = !0;
          } else b = !1;
        }
      b && u(c.properties) && (c = c.properties);
      if (wm(c)) {
        b = this;
        for (var g in c) (d = c[g]), (b = Q("Element.set", b, g, d));
      } else if (c instanceof O && Km("Element.setMulti"))
        b = Q("Element.setMulti", this, c);
      else
        throw Error(
          "When Element.set() is passed one argument, it must be a dictionary."
        );
    } else {
      if (0 != arguments.length % 2)
        throw Error(
          "When Element.set() is passed multiple arguments, there must be an even number of them."
        );
      b = this;
      for (c = 0; c < arguments.length; c += 2)
        (g = arguments[c]),
          (d = arguments[c + 1]),
          (b = Q("Element.set", b, g, d));
    }
    return rm(this, b);
  };
  S.prototype.set = S.prototype.set;
  var U = function (a, b, c, d) {
    if (!(this instanceof U)) return qm(U, arguments);
    if (!("type" in a)) {
      var e = R(U, arguments);
      a = e.geoJson;
      b = e.proj;
      c = e.geodesic;
      d = e.evenOdd;
    }
    Um();
    e = null != b || null != c || null != d;
    if (a instanceof O && !(a instanceof U && a.qb)) {
      if (e)
        throw Error(
          "Setting the CRS, geodesic, or evenOdd flag on a computed Geometry is not supported.  Use Geometry.transform()."
        );
      O.call(this, a.F, a.args, a.V);
    } else {
      a instanceof U && (a = a.encode());
      if (!Vm(a)) throw Error("Invalid GeoJSON geometry: " + JSON.stringify(a));
      O.call(this, null, null);
      this.qb = a.type;
      this.Ig = null != a.coordinates ? Ob(a.coordinates) : null;
      this.gh = a.geometries || null;
      if (null != b) this.$b = b;
      else if ("crs" in a)
        if (
          u(a.crs) &&
          "name" == a.crs.type &&
          u(a.crs.properties) &&
          "string" === typeof a.crs.properties.name
        )
          this.$b = a.crs.properties.name;
        else
          throw Error(
            "Invalid CRS declaration in GeoJSON: " + new ji().X(a.crs)
          );
      this.tc = c;
      void 0 === this.tc && "geodesic" in a && (this.tc = !!a.geodesic);
      this.rc = d;
      void 0 === this.rc && "evenOdd" in a && (this.rc = !!a.evenOdd);
    }
  };
  x(U, O);
  w("ee.Geometry", U);
  var Wm = !1,
    Um = function () {
      Wm || (Lm(U, "Geometry", "Geometry"), (Wm = !0));
    },
    Xm = function (a, b) {
      if (!(this instanceof Xm)) return Ym(Xm, arguments);
      var c = Zm(Xm, "Point", 1, arguments);
      if (!(c instanceof O)) {
        var d = c.coordinates;
        if (!Array.isArray(d) || 2 != d.length)
          throw Error("The Geometry.Point constructor requires 2 coordinates.");
      }
      U.call(this, c);
    };
  x(Xm, U);
  U.Point = Xm;
  var $m = function (a, b) {
    if (!(this instanceof $m)) return Ym($m, arguments);
    U.call(this, Zm($m, "MultiPoint", 2, arguments));
  };
  x($m, U);
  U.MultiPoint = $m;
  var an = function (a, b, c, d) {
    if (!(this instanceof an)) return Ym(an, arguments);
    var e = Zm(an, "Rectangle", 2, arguments);
    if (!(e instanceof O)) {
      var f = e.coordinates;
      if (2 != f.length)
        throw Error(
          "The Geometry.Rectangle constructor requires 2 points or 4 coordinates."
        );
      var g = f[0][0],
        h = f[0][1],
        n = f[1][0];
      f = f[1][1];
      e.coordinates = [
        [
          [g, f],
          [g, h],
          [n, h],
          [n, f],
        ],
      ];
      e.type = "Polygon";
    }
    U.call(this, e);
  };
  x(an, U);
  U.Rectangle = an;
  var bn = function (a, b, c, d) {
    if (!(this instanceof bn)) return Ym(bn, arguments);
    var e = [a, b, c, d];
    if (cn(e)) return new P("GeometryConstructors.BBox").apply(e);
    if (!(Infinity > a)) throw Error("Geometry.BBox: west must not be " + a);
    if (!(-Infinity < c)) throw Error("Geometry.BBox: east must not be " + c);
    if (!(90 >= b))
      throw Error(
        "Geometry.BBox: south must be at most +90\u00b0, but was " +
          b +
          "\u00b0"
      );
    if (!(-90 <= d))
      throw Error(
        "Geometry.BBox: north must be at least -90\u00b0, but was " +
          d +
          "\u00b0"
      );
    b = Math.max(b, -90);
    d = Math.min(d, 90);
    360 <= c - a
      ? ((a = -180), (c = 180))
      : ((a = dn(a)), (c = dn(c)), c < a && (c += 360));
    U.call(
      this,
      {
        type: "Polygon",
        coordinates: [
          [
            [a, d],
            [a, b],
            [c, b],
            [c, d],
          ],
        ],
      },
      void 0,
      !1,
      !0
    );
  };
  x(bn, an);
  U.BBox = bn;
  var dn = function (a) {
      a %= 360;
      180 < a ? (a -= 360) : -180 > a && (a += 360);
      return a;
    },
    en = function (a, b, c, d) {
      if (!(this instanceof en)) return Ym(en, arguments);
      U.call(this, Zm(en, "LineString", 2, arguments));
    };
  x(en, U);
  U.LineString = en;
  var fn = function (a, b, c, d) {
    if (!(this instanceof fn)) return Ym(fn, arguments);
    U.call(this, Zm(fn, "LinearRing", 2, arguments));
  };
  x(fn, U);
  U.LinearRing = fn;
  var gn = function (a, b, c, d) {
    if (!(this instanceof gn)) return Ym(gn, arguments);
    U.call(this, Zm(gn, "MultiLineString", 3, arguments));
  };
  x(gn, U);
  U.MultiLineString = gn;
  var hn = function (a, b, c, d, e) {
    if (!(this instanceof hn)) return Ym(hn, arguments);
    U.call(this, Zm(hn, "Polygon", 3, arguments));
  };
  x(hn, U);
  U.Polygon = hn;
  var jn = function (a, b, c, d, e) {
    if (!(this instanceof jn)) return Ym(jn, arguments);
    U.call(this, Zm(jn, "MultiPolygon", 4, arguments));
  };
  x(jn, U);
  U.MultiPolygon = jn;
  U.prototype.encode = function (a) {
    if (!this.qb) {
      if (!a)
        throw Error(
          "Must specify an encode function when encoding a computed geometry."
        );
      return O.prototype.encode.call(this, a);
    }
    a = { type: this.qb };
    "GeometryCollection" == this.qb
      ? (a.geometries = this.gh)
      : (a.coordinates = this.Ig);
    null != this.$b &&
      (a.crs = { type: "name", properties: { name: this.$b } });
    null != this.tc && (a.geodesic = this.tc);
    null != this.rc && (a.evenOdd = this.rc);
    return a;
  };
  U.prototype.qd = function () {
    if (this.F)
      throw Error(
        "Can't convert a computed Geometry to GeoJSON. Use evaluate() instead."
      );
    return this.encode();
  };
  U.prototype.toGeoJSON = U.prototype.qd;
  U.prototype.ig = function () {
    if (this.F)
      throw Error(
        "Can't convert a computed Geometry to GeoJSON. Use evaluate() instead."
      );
    return new ji().X(this.qd());
  };
  U.prototype.toGeoJSONString = U.prototype.ig;
  U.prototype.X = function (a) {
    return (void 0 === a ? 0 : a) ? Dk(this) : Lk(this);
  };
  U.prototype.serialize = U.prototype.X;
  U.prototype.toString = function () {
    return "ee.Geometry(" + this.ig() + ")";
  };
  U.prototype.ka = function (a) {
    if (!this.qb) {
      if (!a)
        throw Error(
          "Must specify an encode function when encoding a computed geometry."
        );
      return O.prototype.ka.call(this, a);
    }
    var b = {},
      c = "";
    "GeometryCollection" === this.qb
      ? ((b.geometries = this.gh.map(function (e) {
          return new U(e);
        })),
        (c = "GeometryConstructors.MultiGeometry"))
      : ((b.coordinates = this.Ig), (c = "GeometryConstructors." + this.qb));
    null != this.$b &&
      (b.crs =
        "string" === typeof this.$b
          ? new P("Projection").call(this.$b)
          : this.$b);
    var d = "Point" !== this.qb && "MultiPoint" !== this.qb;
    null != this.tc && d && (b.geodesic = this.tc);
    null != this.rc && (b.evenOdd = this.rc);
    return new P(c).apply(b).ka(a);
  };
  var Vm = function (a) {
      var b = a.type;
      if ("GeometryCollection" == b) {
        b = a.geometries;
        if (!Array.isArray(b)) return !1;
        for (a = 0; a < b.length; a++) if (!Vm(b[a])) return !1;
        return !0;
      }
      a = a.coordinates;
      var c = kn(a);
      return (
        ("Point" == b && 1 == c) ||
        ("MultiPoint" == b && (2 == c || 0 == a.length)) ||
        ("LineString" == b && 2 == c) ||
        ("LinearRing" == b && 2 == c) ||
        ("MultiLineString" == b && (3 == c || 0 == a.length)) ||
        ("Polygon" == b && 3 == c) ||
        ("MultiPolygon" == b && (4 == c || 0 == a.length))
      );
    },
    kn = function (a) {
      if (!Array.isArray(a)) return -1;
      if (Array.isArray(a[0])) {
        for (var b = kn(a[0]), c = 1; c < a.length; c++)
          if (kn(a[c]) != b) return -1;
        return b + 1;
      }
      for (c = 0; c < a.length; c++) if ("number" !== typeof a[c]) return -1;
      return 0 == a.length % 2 ? 1 : -1;
    },
    ln = function (a) {
      if ("number" !== typeof a[0] || 2 == a.length) return a;
      if (0 != a.length % 2)
        throw Error("Invalid number of coordinates: " + a.length);
      for (var b = [], c = 0; c < a.length; c += 2) b.push([a[c], a[c + 1]]);
      return b;
    },
    Zm = function (a, b, c, d) {
      a = mn(a, d);
      if (cn(a.coordinates) || null != a.crs || null != a.maxError)
        return new P("GeometryConstructors." + b).apply(a);
      a.type = b;
      a.coordinates = nn(c, a.coordinates);
      (b = cb(["Polygon", "Rectangle", "MultiPolygon"], b)) &&
        null == a.evenOdd &&
        (a.evenOdd = !0);
      if (b && !1 === a.geodesic && !1 === a.evenOdd)
        throw Error("Planar interiors must be even/odd.");
      return a;
    },
    mn = function (a, b) {
      if (Za(b, um)) return { coordinates: ib(b) };
      a = R(a, b);
      a.coordinates = a.coords;
      delete a.coords;
      a.crs = a.proj;
      delete a.proj;
      return Cb(a, function (c) {
        return null != c;
      });
    },
    cn = function (a) {
      return Array.isArray(a) ? Ya(a, cn) : a instanceof O;
    },
    nn = function (a, b) {
      if (1 > a || 4 < a) throw Error("Unexpected nesting level.");
      Za(b, function (e) {
        return "number" === typeof e;
      }) && (b = ln(b));
      for (var c = b, d = 0; Array.isArray(c); ) (c = c[0]), d++;
      for (; d < a; ) (b = [b]), d++;
      if (kn(b) != a) throw Error("Invalid geometry");
      for (c = b; Array.isArray(c) && 1 == c.length; ) c = c[0];
      return Array.isArray(c) && 0 == c.length ? [] : b;
    },
    Ym = function (a, b) {
      var c = function () {};
      c.prototype = a.prototype;
      c = new c();
      a = a.apply(c, b);
      return void 0 !== a ? a : c;
    };
  U.prototype.name = function () {
    return "Geometry";
  };
  var V = function (a) {
    if (!(this instanceof V)) return qm(V, arguments);
    if (a instanceof V) return a;
    on();
    if (Array.isArray(a)) {
      if (0 == a.length) throw Error("Empty list specified for ee.Filter().");
      if (1 == a.length) return new V(a[0]);
      O.call(this, new P("Filter.and"), { filters: a });
    } else if (a instanceof O) O.call(this, a.F, a.args, a.V);
    else if (void 0 === a) O.call(this, null, null);
    else throw Error("Invalid argument specified for ee.Filter(): " + a);
  };
  x(V, O);
  w("ee.Filter", V);
  var pn = !1,
    on = function () {
      pn || (Lm(V, "Filter", "Filter"), (pn = !0));
    },
    qn = {
      equals: "equals",
      less_than: "lessThan",
      greater_than: "greaterThan",
      contains: "stringContains",
      starts_with: "stringStartsWith",
      ends_with: "stringEndsWith",
    };
  V.prototype.uc = function () {
    return Q("Filter.not", this);
  };
  V.prototype.not = V.prototype.uc;
  var rn = function (a, b) {
    var c = R(rn, arguments);
    return Q("Filter.equals", c.name, c.value);
  };
  V.eq = rn;
  var sn = function (a, b) {
    var c = R(sn, arguments);
    return rn(c.name, c.value).uc();
  };
  V.neq = sn;
  var tn = function (a, b) {
    var c = R(tn, arguments);
    return Q("Filter.lessThan", c.name, c.value);
  };
  V.lt = tn;
  var un = function (a, b) {
    var c = R(un, arguments);
    return tn(c.name, c.value).uc();
  };
  V.gte = un;
  var vn = function (a, b) {
    var c = R(vn, arguments);
    return Q("Filter.greaterThan", c.name, c.value);
  };
  V.gt = vn;
  var wn = function (a, b) {
    var c = R(wn, arguments);
    return vn(c.name, c.value).uc();
  };
  V.lte = wn;
  var xn = function (a) {
    return Q("Filter.and", Array.prototype.slice.call(arguments));
  };
  V.and = xn;
  var yn = function (a) {
    return Q("Filter.or", Array.prototype.slice.call(arguments));
  };
  V.or = yn;
  var zn = function (a, b) {
    var c = R(zn, arguments);
    c = Q("DateRange", c.start, c.end);
    return Em("Filter.dateRangeContains", {
      leftValue: c,
      rightField: "system:time_start",
    });
  };
  V.date = zn;
  var An = function (a, b, c, d) {
    var e = R(An, arguments);
    return Em("Filter.listContains", {
      leftField: e.rightField,
      rightValue: e.leftValue,
      rightField: e.leftField,
      leftValue: e.rightValue,
    });
  };
  V.inList = An;
  var Bn = function (a, b) {
    return Em("Filter.intersects", {
      leftField: ".all",
      rightValue: Q("Feature", a),
      maxError: b,
    });
  };
  V.bounds = Bn;
  V.prototype.name = function () {
    return "Filter";
  };
  var Cn = function (a, b, c) {
    b = b.toLowerCase();
    var d = !1;
    0 == b.lastIndexOf("not_", 0) && ((d = !0), (b = b.substring(4)));
    if (!(b in qn)) throw Error("Unknown filtering operator: " + b);
    a = Q("Filter." + qn[b], a, c);
    return d ? a.uc() : a;
  };
  V.metadata = Cn;
  var W = function (a, b, c) {
    S.call(this, a, b, c);
    Dn();
  };
  x(W, S);
  w("ee.Collection", W);
  var En = !1,
    Dn = function () {
      En ||
        (Lm(W, "Collection", "Collection"),
        Lm(W, "AggregateFeatureCollection", "Collection", "aggregate_"),
        (En = !0));
    };
  W.prototype.filter = function (a) {
    a = R(W.prototype.filter, arguments).filter;
    if (!a) throw Error("Empty filters.");
    return rm(this, Q("Collection.filter", this, a));
  };
  W.prototype.filter = W.prototype.filter;
  W.prototype.gf = function (a, b, c) {
    var d = R(W.prototype.gf, arguments);
    return this.filter(Cn(d.name, d.operator, d.value));
  };
  W.prototype.filterMetadata = W.prototype.gf;
  W.prototype.Zg = function (a) {
    return this.filter(Bn(a));
  };
  W.prototype.filterBounds = W.prototype.Zg;
  W.prototype.ff = function (a, b) {
    var c = R(W.prototype.ff, arguments);
    return this.filter(zn(c.start, c.end));
  };
  W.prototype.filterDate = W.prototype.ff;
  W.prototype.limit = function (a, b, c) {
    var d = R(W.prototype.limit, arguments);
    return rm(
      this,
      Q("Collection.limit", this, d.max, d.property, d.ascending)
    );
  };
  W.prototype.limit = W.prototype.limit;
  W.prototype.sort = function (a, b) {
    var c = R(W.prototype.sort, arguments);
    return rm(
      this,
      Q("Collection.limit", this, void 0, c.property, c.ascending)
    );
  };
  W.prototype.sort = W.prototype.sort;
  W.prototype.name = function () {
    return "Collection";
  };
  W.prototype.elementType = function () {
    return S;
  };
  W.prototype.map = function (a, b) {
    var c = this.elementType();
    return rm(
      this,
      Q(
        "Collection.map",
        this,
        function (d) {
          return a(new c(d));
        },
        b
      )
    );
  };
  W.prototype.map = W.prototype.map;
  W.prototype.vh = function (a, b) {
    b = void 0 !== b ? b : null;
    var c = this.elementType();
    return Q(
      "Collection.iterate",
      this,
      function (d, e) {
        return a(new c(d), e);
      },
      b
    );
  };
  W.prototype.iterate = W.prototype.vh;
  var X = function (a, b) {
    if (!(this instanceof X)) return qm(X, arguments);
    if (a instanceof X) {
      if (b)
        throw Error("Can't create Feature out of a Feature and properties.");
      return a;
    }
    if (2 < arguments.length)
      throw Error(
        "The Feature constructor takes at most 2 arguments (" +
          arguments.length +
          " given)"
      );
    Fn();
    if (a instanceof U || null === a)
      S.call(this, new P("Feature"), { geometry: a, metadata: b || null });
    else if (a instanceof O) S.call(this, a.F, a.args, a.V);
    else if ("Feature" == a.type) {
      var c = a.properties || {};
      if ("id" in a) {
        if ("system:index" in c)
          throw Error('Can\'t specify both "id" and "system:index".');
        c = Nb(c);
        c["system:index"] = a.id;
      }
      S.call(this, new P("Feature"), {
        geometry: new U(a.geometry),
        metadata: c,
      });
    } else
      S.call(this, new P("Feature"), {
        geometry: new U(a),
        metadata: b || null,
      });
  };
  x(X, S);
  w("ee.Feature", X);
  var Gn = !1,
    Fn = function () {
      Gn || (Lm(X, "Feature", "Feature"), (Gn = !0));
    };
  X.prototype.Z = function (a) {
    return X.I.Z.call(this, a);
  };
  X.prototype.getInfo = X.prototype.Z;
  X.prototype.getMap = function (a, b) {
    var c = R(X.prototype.getMap, arguments);
    return Q("Collection", [this]).getMap(c.visParams, c.callback);
  };
  X.prototype.getMap = X.prototype.getMap;
  X.prototype.name = function () {
    return "Feature";
  };
  var Ul = function (a) {
      var b = {},
        c = Hn(a.element, a);
      c = In(c, a, b);
      b.element = c;
      return b;
    },
    Vl = function (a) {
      var b = {},
        c = a.element.map(function (d) {
          d = Hn(d, a);
          return In(d, a, b);
        });
      b.element = c;
      return b;
    },
    In = function (a, b, c) {
      var d = {},
        e = ["maxDimension", "width", "height", "scale"];
      Bb(b, function (f, g) {
        switch (g) {
          case "dimensions":
            g =
              "string" === typeof f
                ? f.split("x").map(Number)
                : Array.isArray(f)
                ? f
                : "number" === typeof f
                ? [f]
                : [];
            if (1 === g.length) d.maxDimension = g[0];
            else if (2 === g.length) (d.width = g[0]), (d.height = g[1]);
            else throw Error("Invalid dimensions " + f);
            break;
          case "bbox":
            null != d.geometry &&
              console.warn("Multiple request parameters converted to region.");
            if (!(f instanceof an)) {
              g = f;
              if ("string" === typeof f)
                try {
                  g = JSON.parse(f);
                } catch (h) {
                  g = f.split(/\s*,\s*/).map(Number);
                }
              if (Array.isArray(g)) {
                if (g.some(isNaN))
                  throw Error(
                    "Invalid bbox `{bboxArray}`, please specify a list of numbers."
                  );
                f = new an(g, null, !1);
              } else
                throw Error(
                  'Invalid bbox "{bbox}" type, must be of type Array<number>'
                );
            }
            d.geometry = f;
            break;
          case "region":
            null != d.geometry &&
              console.warn("Multiple request parameters converted to region.");
            if (!(f instanceof U)) {
              g = f;
              if ("string" === typeof f)
                try {
                  g = JSON.parse(f);
                } catch (h) {
                  throw Error(
                    'Region string "' + f + '" is not valid GeoJSON.'
                  );
                }
              if (Array.isArray(g)) f = new hn(g, null, !1);
              else if (u(g)) f = new U(g, null, !1);
              else
                throw Error(
                  "Region {region} was not convertible to an ee.Geometry."
                );
            }
            d.geometry = f;
            break;
          case "scale":
            d.scale = Number(f);
            break;
          default:
            c[g] = f;
        }
      });
      Lb(d) ||
        ((d.input = a),
        (a = e.some(function (f) {
          return f in d;
        })
          ? Em("Image.clipToBoundsAndScale", d)
          : Em("Image.clip", d)));
      return a;
    },
    Hn = function (a, b) {
      var c = b.crs || "",
        d = b.crsTransform || b.crs_transform;
      null != d && (d = Jn(d));
      if (!c && !d) return a;
      if (d && !c)
        throw Error('Must specify "crs" if "crsTransform" is specified.');
      if (d) {
        if (
          ((a = Em("Image.reproject", { image: a, crs: c, crsTransform: d })),
          null != b.dimensions && null == b.scale && null == b.region)
        ) {
          var e = b.dimensions;
          "string" === typeof e && (e = e.split("x").map(Number));
          2 === e.length &&
            (delete b.dimensions,
            (c = new P("Projection").call(c, d)),
            (b.region = new an([0, 0, e[0], e[1]], c, !1)));
        }
      } else
        a = Em("Image.setDefaultProjection", {
          image: a,
          crs: c,
          crsTransform: [1, 0, 0, 0, -1, 0],
        });
      return a;
    },
    Jn = function (a) {
      if ("string" === typeof a)
        try {
          a = JSON.parse(a);
        } catch (b) {}
      if (Array.isArray(a)) {
        if (
          6 === a.length &&
          Za(a, function (b) {
            return "number" === typeof b;
          })
        )
          return a;
        throw Error(
          "Invalid argument, crs transform must be a list of 6 numbers."
        );
      }
      throw Error("Invalid argument, crs transform was not a string or array.");
    },
    Ln = function (a, b) {
      var c = {};
      b = Kn(b, c);
      Lb(b) || ((b.image = a), (a = Em("Image.visualize", b)));
      c.image = a;
      return c;
    },
    Kn = function (a, b) {
      var c = "bands gain bias min max gamma palette opacity forceRgbOutput".split(
          " "
        ),
        d = {};
      Bb(a, function (e, f) {
        cb(c, f) ? (d[f] = e) : (b[f] = e);
      });
      return d;
    },
    zl = function (a, b) {
      b = Object.assign({}, b);
      var c = function (e) {
          var f = {};
          ["crs", "crs_transform", "dimensions", "region"].forEach(function (
            g
          ) {
            g in e && (f[g] = e[g]);
          });
          null != e.scale && null == e.dimensions && (f.scale = e.scale);
          return f;
        },
        d = function (e) {
          var f = e.id;
          if (void 0 === f)
            throw Error("Each band dictionary must have an id.");
          f = a.select(f);
          var g = c(b);
          e = c(e);
          e = c(Object.assign(g, e));
          f = Hn(f, e);
          return (f = In(f, e, {}));
        };
      "ZIPPED_GEO_TIFF_PER_BAND" === b.format && b.bands && b.bands.length
        ? ((d = b.bands.map(d)),
          (a = d.reduce(function (e, f) {
            return Q("Image.addBands", e, f, null, !0);
          }, d.shift())))
        : ((d = c(b)), (a = Hn(a, d)), (a = In(a, d, {})));
      return a;
    };
  var N = function (a) {
    if (!(this instanceof N)) return qm(N, arguments);
    if (a instanceof N) return a;
    Mn();
    var b = arguments.length;
    if (0 == b || (1 == b && void 0 === a))
      S.call(this, new P("Image.mask"), { image: new N(0), mask: new N(0) });
    else if (1 == b)
      if (um(a)) S.call(this, new P("Image.constant"), { value: a });
      else if (vm(a)) S.call(this, new P("Image.load"), { id: a });
      else {
        if (Array.isArray(a))
          return Nn(
            Xa(a, function (d) {
              return new N(d);
            })
          );
        if (a instanceof O)
          "Array" == a.name()
            ? S.call(this, new P("Image.constant"), { value: a })
            : S.call(this, a.F, a.args, a.V);
        else
          throw Error(
            "Unrecognized argument type to convert to an Image: " + a
          );
      }
    else if (2 == b) {
      b = arguments[0];
      var c = arguments[1];
      if (vm(b) && um(c))
        S.call(this, new P("Image.load"), { id: b, version: c });
      else
        throw Error(
          "Unrecognized argument types to convert to an Image: " + arguments
        );
    } else
      throw Error(
        "The Image constructor takes at most 2 arguments (" + b + " given)"
      );
  };
  x(N, S);
  w("ee.Image", N);
  var On = !1,
    Mn = function () {
      On ||
        (Lm(N, "Image", "Image"),
        Lm(N, "Window", "Image", "focal_"),
        (On = !0));
    };
  N.prototype.Z = function (a) {
    return N.I.Z.call(this, a);
  };
  N.prototype.getInfo = N.prototype.Z;
  N.prototype.getMap = function (a, b) {
    var c = this,
      d = R(N.prototype.getMap, arguments),
      e = Ln(this, d.visParams);
    if (d.callback) {
      var f = d.callback;
      sl(e, function (g, h) {
        g = g ? Object.assign(g, { image: c }) : void 0;
        f(g, h);
      });
    } else return (d = sl(e)), (d.image = this), d;
  };
  N.prototype.getMap = N.prototype.getMap;
  N.prototype.wb = function (a, b) {
    var c = R(N.prototype.wb, arguments),
      d = c.params ? Nb(c.params) : {};
    d.image = M ? this : this.X(!0);
    if (c.callback) {
      var e = c.callback;
      Al(d, function (f, g) {
        f ? e(Bl(f)) : e(null, g);
      });
    } else return Bl(Al(d));
  };
  N.prototype.getDownloadURL = N.prototype.wb;
  N.prototype.Jd = function (a, b) {
    var c = R(N.prototype.wb, arguments),
      d = c.params ? Nb(c.params) : {};
    if (M) {
      var e = {},
        f = Hn(this, d);
      f = In(f, d, e);
      d = Ln(f, e);
    } else if (((d = Ln(this, d)), d.region))
      if (
        (d.region instanceof U && (d.region = d.region.qd()),
        Array.isArray(d.region) || wm(d.region))
      )
        d.region = ki(d.region);
      else if ("string" !== typeof d.region)
        throw Error(
          "The region parameter must be an array or a GeoJSON object."
        );
    return c.callback ? (vl(d, c.callback), null) : vl(d);
  };
  N.prototype.getThumbId = N.prototype.Jd;
  N.prototype.lf = function (a, b) {
    var c = R(N.prototype.lf, arguments);
    if (c.callback)
      this.Jd(c.params, function (d, e) {
        var f = "";
        if (void 0 === e)
          try {
            f = yl(d);
          } catch (g) {
            e = String(g.message);
          }
        c.callback(f, e);
      });
    else return yl(this.Jd(c.params));
  };
  N.prototype.getThumbURL = N.prototype.lf;
  var Pn = function (a, b, c) {
    var d = R(Pn, arguments);
    return Nn([d.r, d.g, d.b], ["vis-red", "vis-green", "vis-blue"]);
  };
  N.rgb = Pn;
  var Qn = function (a) {
    return Nn(Array.prototype.slice.call(arguments), null);
  };
  N.cat = Qn;
  var Nn = function (a, b) {
    if (0 == a.length) return Q("Image.constant", []);
    for (var c = new N(a[0]), d = 1; d < a.length; d++)
      c = Q("Image.addBands", c, a[d]);
    b && (c = c.select([".*"], b));
    return c;
  };
  N.prototype.select = function (a) {
    var b = Array.prototype.slice.call(arguments),
      c = { input: this, bandSelectors: b[0] || [] };
    if (2 < b.length || vm(b[0]) || um(b[0])) {
      for (var d = 0; d < b.length; d++)
        if (!(vm(b[d]) || um(b[d]) || b[d] instanceof O))
          throw Error("Illegal argument to select(): " + b[d]);
      c.bandSelectors = b;
    } else b[1] && (c.newNames = b[1]);
    return Em("Image.select", c);
  };
  N.prototype.select = N.prototype.select;
  N.prototype.i = function (a, b) {
    var c = R(N.prototype.i, arguments),
      d = ["DEFAULT_EXPRESSION_IMAGE"],
      e = { DEFAULT_EXPRESSION_IMAGE: this };
    if (c.map) {
      var f = c.map,
        g;
      for (g in f) d.push(g), (e[g] = new N(f[g]));
    }
    var h = Q(
      "Image.parseExpression",
      c.expression,
      "DEFAULT_EXPRESSION_IMAGE",
      d
    );
    c = new ym();
    c.encode = function (n) {
      return h.encode(n);
    };
    c.Ed = function (n, p) {
      return Mj(n(h), p);
    };
    c.aa = function () {
      return {
        name: "",
        args: Xa(
          d,
          function (n) {
            return { name: n, type: "Image", optional: !1 };
          },
          this
        ),
        returns: "Image",
      };
    };
    return c.apply(e);
  };
  N.prototype.expression = N.prototype.i;
  N.prototype.clip = function (a) {
    try {
      a = new U(a);
    } catch (b) {}
    return Q("Image.clip", this, a);
  };
  N.prototype.clip = N.prototype.clip;
  N.prototype.Uh = function (a) {
    var b =
      1 != arguments.length || vm(arguments[0]) ? ib(arguments) : arguments[0];
    return Q("Image.rename", this, b);
  };
  N.prototype.rename = N.prototype.Uh;
  N.prototype.name = function () {
    return "Image";
  };
  var Rn = function (a) {
    if (this instanceof Rn) {
      if (1 < arguments.length)
        throw Error("ee.List() only accepts 1 argument.");
      if (a instanceof Rn) return a;
    } else return qm(Rn, arguments);
    Sn();
    if (Array.isArray(a)) O.call(this, null, null), (this.cd = a);
    else if (a instanceof O) O.call(this, a.F, a.args, a.V), (this.cd = null);
    else throw Error("Invalid argument specified for ee.List(): " + a);
  };
  x(Rn, O);
  w("ee.List", Rn);
  var Tn = !1,
    Sn = function () {
      Tn || (Lm(Rn, "List", "List"), (Tn = !0));
    };
  Rn.prototype.encode = function (a) {
    return Array.isArray(this.cd)
      ? Xa(this.cd, function (b) {
          return a(b);
        })
      : Rn.I.encode.call(this, a);
  };
  Rn.prototype.ka = function (a) {
    return Array.isArray(this.cd) ? Ij(a(this.cd)) : Rn.I.ka.call(this, a);
  };
  Rn.prototype.name = function () {
    return "List";
  };
  var Y = function (a, b) {
    if (!(this instanceof Y)) return qm(Y, arguments);
    if (a instanceof Y) return a;
    if (2 < arguments.length)
      throw Error(
        "The FeatureCollection constructor takes at most 2 arguments (" +
          arguments.length +
          " given)"
      );
    Un();
    a instanceof U && (a = new X(a));
    a instanceof X && (a = [a]);
    if (vm(a)) {
      var c = { tableId: a };
      b && (c.geometryColumn = b);
      W.call(this, new P("Collection.loadTable"), c);
    } else if (Array.isArray(a))
      W.call(this, new P("Collection"), {
        features: Xa(a, function (d) {
          return new X(d);
        }),
      });
    else if (a instanceof Rn)
      W.call(this, new P("Collection"), { features: a });
    else if (a instanceof Object && "FeatureCollection" === a.type)
      W.call(this, new P("Collection"), {
        features: a.features.map(function (d) {
          return new X(d);
        }),
      });
    else if (a instanceof O) W.call(this, a.F, a.args, a.V);
    else
      throw Error(
        "Unrecognized argument type to convert to a FeatureCollection: " + a
      );
  };
  x(Y, W);
  w("ee.FeatureCollection", Y);
  var Vn = !1,
    Un = function () {
      Vn || (Lm(Y, "FeatureCollection", "FeatureCollection"), (Vn = !0));
    };
  Y.prototype.getMap = function (a, b) {
    var c = R(Y.prototype.getMap, arguments),
      d = Em("Collection.draw", {
        collection: this,
        color: (c.visParams || {}).color || "000000",
      });
    if (c.callback) d.getMap(void 0, c.callback);
    else return d.getMap();
  };
  Y.prototype.getMap = Y.prototype.getMap;
  Y.prototype.Z = function (a) {
    return Y.I.Z.call(this, a);
  };
  Y.prototype.getInfo = Y.prototype.Z;
  Y.prototype.wb = function (a, b, c, d) {
    var e = R(Y.prototype.wb, arguments),
      f = {};
    f.table = M ? this : this.X();
    e.format && (f.format = e.format.toUpperCase());
    e.filename && (f.filename = e.filename);
    e.selectors && (f.selectors = e.selectors);
    if (e.callback)
      Cl(f, function (g, h) {
        g ? e.callback(Dl(g)) : e.callback(null, h);
      });
    else return Dl(Cl(f));
  };
  Y.prototype.getDownloadURL = Y.prototype.wb;
  Y.prototype.select = function (a, b, c) {
    if (vm(a)) {
      var d = Array.prototype.slice.call(arguments);
      return this.map(function (f) {
        return f.select(d);
      });
    }
    var e = R(Y.prototype.select, arguments);
    return this.map(function (f) {
      return f.select(e);
    });
  };
  Y.prototype.select = Y.prototype.select;
  Y.prototype.name = function () {
    return "FeatureCollection";
  };
  Y.prototype.elementType = function () {
    return X;
  };
  var Z = function (a) {
    if (!(this instanceof Z)) return qm(Z, arguments);
    if (a instanceof Z) return a;
    if (1 != arguments.length)
      throw Error(
        "The ImageCollection constructor takes exactly 1 argument (" +
          arguments.length +
          " given)"
      );
    Wn();
    a instanceof N && (a = [a]);
    if (vm(a)) W.call(this, new P("ImageCollection.load"), { id: a });
    else if (Array.isArray(a))
      W.call(this, new P("ImageCollection.fromImages"), {
        images: Xa(a, function (b) {
          return new N(b);
        }),
      });
    else if (a instanceof Rn)
      W.call(this, new P("ImageCollection.fromImages"), { images: a });
    else if (a instanceof O) W.call(this, a.F, a.args, a.V);
    else
      throw Error(
        "Unrecognized argument type to convert to an ImageCollection: " + a
      );
  };
  x(Z, W);
  w("ee.ImageCollection", Z);
  var Xn = !1,
    Wn = function () {
      Xn ||
        (Lm(Z, "ImageCollection", "ImageCollection"),
        Lm(Z, "reduce", "ImageCollection"),
        (Xn = !0));
    };
  Z.prototype.kf = function (a, b) {
    var c = R(Z.prototype.kf, arguments);
    return Yn(this, c, ["png", "jpg", "jpeg"], "filmstrip");
  };
  Z.prototype.getFilmstripThumbURL = Z.prototype.kf;
  Z.prototype.nf = function (a, b) {
    var c = R(Z.prototype.nf, arguments);
    return Yn(this, c, ["gif"], "video");
  };
  Z.prototype.getVideoThumbURL = Z.prototype.nf;
  var Yn = function (a, b, c, d) {
    var e = {};
    a = a.map(function (h) {
      h = Hn(h, b.params);
      return In(h, b.params, e);
    });
    var f = {},
      g = Kn(e, f);
    f.imageCollection = a.map(function (h) {
      g.image = h;
      return Em("Image.visualize", g);
    });
    null != b.params.dimensions && (f.dimensions = b.params.dimensions);
    if (f.format) {
      if (
        !Ya(c, function (h) {
          return h.toLowerCase() == f.format.toLowerCase();
        })
      )
        throw Error("Invalid format specified.");
    } else f.format = c[0];
    c = vl;
    if (M)
      switch (d) {
        case "video":
          c = wl;
          break;
        case "filmstrip":
          c = xl;
      }
    if (b.callback)
      c(f, function (h, n) {
        var p = "";
        if (void 0 === n)
          try {
            p = yl(h);
          } catch (t) {
            n = String(t.message);
          }
        b.callback(p, n);
      });
    else return yl(c(f));
  };
  Z.prototype.getMap = function (a, b) {
    var c = R(Z.prototype.getMap, arguments),
      d = Q("ImageCollection.mosaic", this);
    if (c.callback) d.getMap(c.visParams, c.callback);
    else return d.getMap(c.visParams);
  };
  Z.prototype.getMap = Z.prototype.getMap;
  Z.prototype.Z = function (a) {
    return Z.I.Z.call(this, a);
  };
  Z.prototype.getInfo = Z.prototype.Z;
  Z.prototype.select = function (a, b) {
    var c = arguments;
    return this.map(function (d) {
      return d.select.apply(d, c);
    });
  };
  Z.prototype.select = Z.prototype.select;
  Z.prototype.first = function () {
    return new N(Q("Collection.first", this));
  };
  Z.prototype.first = Z.prototype.first;
  Z.prototype.name = function () {
    return "ImageCollection";
  };
  Z.prototype.elementType = function () {
    return N;
  };
  var Zn = function (a) {
      this.Ve = a;
      this.id = null;
    },
    ao = function (a) {
      var b = { element: $n(a) };
      Object.assign(b, a);
      b = Cb(b, function (c) {
        return null != c;
      });
      return new Zn(b);
    };
  Zn.prototype.start = function (a, b) {
    var c = this;
    z(this.Ve, "Task config must be specified for tasks to be started.");
    if (a) {
      var d = function () {
        Qa(c.id);
        Tl(c.id, c.Ve, function (e, f) {
          f ? b(f) : a();
        });
      };
      this.id
        ? d()
        : El(1, function (e) {
            (e = e && e[0])
              ? ((c.id = e), d())
              : b("Failed to obtain task ID.");
          });
    } else
      (this.id = this.id || El(1)[0]),
        Qa(this.id, "Failed to obtain task ID."),
        Tl(this.id, this.Ve);
  };
  Zn.prototype.start = Zn.prototype.start;
  var bo = function (a, b, c, d, e, f, g, h, n, p) {
    var t = R(bo, arguments);
    t = co(t, "ASSET", "EXPORT_IMAGE");
    return ao(t);
  };
  w("ee.batch.Export.image.toAsset", bo);
  var eo = function (a, b, c, d, e, f, g, h, n, p, t, C, D, ca, Da) {
    var T = R(eo, arguments);
    T = co(T, "GOOGLE_CLOUD_STORAGE", "EXPORT_IMAGE");
    return ao(T);
  };
  w("ee.batch.Export.image.toCloudStorage", eo);
  var fo = function (a, b, c, d, e, f, g, h, n, p, t, C, D, ca, Da) {
    var T = R(fo, arguments);
    T = co(T, "DRIVE", "EXPORT_IMAGE");
    return ao(T);
  };
  w("ee.batch.Export.image.toDrive", fo);
  var go = function (a, b, c, d, e, f, g, h, n, p, t, C) {
    var D = R(go, arguments);
    D = co(D, "GOOGLE_CLOUD_STORAGE", "EXPORT_TILES");
    return ao(D);
  };
  w("ee.batch.Export.map.toCloudStorage", go);
  var ho = function (a, b, c, d, e, f) {
    var g = R(ho, arguments);
    g = co(g, "GOOGLE_CLOUD_STORAGE", "EXPORT_FEATURES");
    return ao(g);
  };
  w("ee.batch.Export.table.toCloudStorage", ho);
  var io = function (a, b, c, d, e, f) {
    var g = R(io, arguments);
    g.type = "EXPORT_FEATURES";
    g = co(g, "DRIVE", "EXPORT_FEATURES");
    return ao(g);
  };
  w("ee.batch.Export.table.toDrive", io);
  var jo = function (a, b, c) {
    var d = R(jo, arguments);
    d = co(d, "ASSET", "EXPORT_FEATURES");
    return ao(d);
  };
  w("ee.batch.Export.table.toAsset", jo);
  var ko = function (a, b, c, d, e, f, g, h, n, p, t, C) {
    var D = R(ko, arguments);
    D = co(D, "GOOGLE_CLOUD_STORAGE", "EXPORT_VIDEO");
    return ao(D);
  };
  w("ee.batch.Export.video.toCloudStorage", ko);
  var lo = function (a, b, c, d, e, f, g, h, n, p, t, C) {
    var D = R(lo, arguments);
    D = co(D, "DRIVE", "EXPORT_VIDEO");
    return ao(D);
  };
  w("ee.batch.Export.video.toDrive", lo);
  var mo = function (
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    n,
    p,
    t,
    C,
    D,
    ca,
    Da,
    T,
    db,
    Ib,
    mq,
    nq
  ) {
    var Ti = R(mo, arguments);
    Ti = co(Ti, "GOOGLE_CLOUD_STORAGE", "EXPORT_VIDEO_MAP");
    return ao(Ti);
  };
  w("ee.batch.Export.videoMap.toCloudStorage", mo);
  var $n = function (a) {
      var b = function (d) {
          return d in a;
        },
        c = no.find(b);
      z(1 === $a(no, b), 'Expected a single "image" or "collection" key.');
      b = a[c];
      if (
        !(b instanceof N || b instanceof Y || b instanceof Z || b instanceof S)
      )
        throw Error(
          "Unknown element type provided: " +
            typeof b +
            ". Expected:  ee.Image, ee.ImageCollection, ee.FeatureCollection or ee.Element."
        );
      delete a[c];
      return b;
    },
    co = function (a, b, c) {
      var d = void 0 === d ? !0 : d;
      var e = { type: c };
      Object.assign(e, a);
      switch (c) {
        case "EXPORT_IMAGE":
          null == e.fileFormat && (e.fileFormat = "GeoTIFF");
          a = e.fileFormat;
          null == a && (a = "GEO_TIFF");
          a = a.toUpperCase();
          switch (a) {
            case "TIFF":
            case "TIF":
            case "GEO_TIFF":
            case "GEOTIFF":
              a = "GEO_TIFF";
              break;
            case "TF_RECORD":
            case "TF_RECORD_IMAGE":
            case "TFRECORD":
              a = "TF_RECORD_IMAGE";
              break;
            default:
              throw Error(
                "Invalid file format " +
                  a +
                  ". Supported formats are: 'GEOTIFF', 'TFRECORD'."
              );
          }
          null != e.formatOptions &&
            ((a = oo(e, a)), delete e.formatOptions, Object.assign(e, a));
          e = po(e, b);
          null != e.crsTransform &&
            ((e.crs_transform = e.crsTransform), delete e.crsTransform);
          break;
        case "EXPORT_TILES":
          e = b = po(e, b);
          break;
        case "EXPORT_FEATURES":
          Array.isArray(e.selectors) && (e.selectors = e.selectors.join());
          e = po(e, b);
          break;
        case "EXPORT_VIDEO":
          e = qo(e);
          e = po(e, b);
          null != e.crsTransform &&
            ((e.crs_transform = e.crsTransform), delete e.crsTransform);
          break;
        case "EXPORT_VIDEO_MAP":
          e = qo(e);
          e.version = e.version || "V1";
          e.stride = e.stride || 1;
          e.tileDimensions = {
            width: e.tileWidth || 256,
            height: e.tileHeight || 256,
          };
          e = po(e, b);
          break;
        default:
          throw Error("Unknown export type: " + e.type);
      }
      if (d && null != e.region) {
        d = e;
        b = e.region;
        if (b instanceof U) b = b.qd();
        else if ("string" === typeof b)
          try {
            b = Sa(JSON.parse(b));
          } catch (f) {
            throw Error(
              "Invalid format for region property. Region must be GeoJSON LinearRing or Polygon specified as actual coordinates or serialized as a string. See Export documentation."
            );
          }
        if (!(u(b) && "type" in b))
          try {
            new en(b);
          } catch (f) {
            try {
              new hn(b);
            } catch (g) {
              throw Error(
                "Invalid format for region property. Region must be GeoJSON LinearRing or Polygon specified as actual coordinates or serialized as a string. See Export documentation."
              );
            }
          }
        b = ki(b);
        d.region = b;
      }
      return e;
    },
    po = function (a, b) {
      switch (b) {
        case "GOOGLE_CLOUD_STORAGE":
          a.outputBucket = a.bucket || "";
          a.outputPrefix = a.fileNamePrefix || a.path || "";
          delete a.fileNamePrefix;
          delete a.path;
          delete a.bucket;
          break;
        case "ASSET":
          a.assetId = a.assetId || "";
          break;
        default:
          b = xa(a.folder);
          if (!cb(["string", "undefined"], b))
            throw Error(
              'Error: toDrive "folder" parameter must be a string, but is of type ' +
                b +
                "."
            );
          a.driveFolder = a.folder || "";
          a.driveFileNamePrefix = a.fileNamePrefix || "";
          delete a.folder;
          delete a.fileNamePrefix;
      }
      return a;
    },
    ro = {
      GEO_TIFF: ["cloudOptimized", "fileDimensions"],
      TF_RECORD_IMAGE: "patchDimensions kernelSize compressed maxFileSize defaultValue tensorDepths sequenceData collapseBands maskedThreshold".split(
        " "
      ),
    },
    so = { GEO_TIFF: "tiff", TF_RECORD_IMAGE: "tfrecord" },
    qo = function (a) {
      a.videoOptions = a.framesPerSecond || 5;
      a.maxFrames = a.maxFrames || 1e3;
      a.maxPixels = a.maxPixels || 1e8;
      a.fileFormat = "MP4";
      return a;
    },
    oo = function (a, b) {
      var c = a.formatOptions;
      if (null == c) return {};
      if (
        Object.keys(a).some(function (n) {
          return null !== c && n in c;
        })
      )
        throw Error(
          "Parameter specified at least twice: once in config, and once in config format options."
        );
      a = so[b];
      for (
        var d = ro[b], e = {}, f = m(Object.entries(c)), g = f.next();
        !g.done;
        g = f.next()
      ) {
        var h = m(g.value);
        g = h.next().value;
        h = h.next().value;
        if (!cb(d, g))
          throw Error(
            '"' +
              g +
              '" is not a valid option, the image format "' +
              b +
              '""may have the following options: ' +
              (d.join(", ") + '".')
          );
        e[a + g[0].toUpperCase() + g.substring(1)] = Array.isArray(h)
          ? h.join()
          : h;
      }
      return e;
    },
    no = ["image", "collection"];
  var to = function (a) {
    if (!(this instanceof to)) return qm(to, arguments);
    if (a instanceof to) return a;
    uo();
    if ("number" === typeof a) O.call(this, null, null), (this.fd = a);
    else if (a instanceof O) O.call(this, a.F, a.args, a.V), (this.fd = null);
    else throw Error("Invalid argument specified for ee.Number(): " + a);
  };
  x(to, O);
  w("ee.Number", to);
  var vo = !1,
    uo = function () {
      vo || (Lm(to, "Number", "Number"), (vo = !0));
    };
  to.prototype.encode = function (a) {
    return "number" === typeof this.fd ? this.fd : to.I.encode.call(this, a);
  };
  to.prototype.ka = function (a) {
    return "number" === typeof this.fd ? Ij(a(this.fd)) : to.I.ka.call(this, a);
  };
  to.prototype.name = function () {
    return "Number";
  };
  var wo = function (a) {
    if (!(this instanceof wo)) return qm(wo, arguments);
    if (a instanceof wo) return a;
    xo();
    if ("string" === typeof a) O.call(this, null, null), (this.nd = a);
    else if (a instanceof O)
      (this.nd = null),
        a.F && "String" == a.F.aa().returns
          ? O.call(this, a.F, a.args, a.V)
          : O.call(this, new P("String"), { input: a }, null);
    else throw Error("Invalid argument specified for ee.String(): " + a);
  };
  x(wo, O);
  w("ee.String", wo);
  var yo = !1,
    xo = function () {
      yo || (Lm(wo, "String", "String"), (yo = !0));
    };
  wo.prototype.encode = function (a) {
    return "string" === typeof this.nd ? this.nd : wo.I.encode.call(this, a);
  };
  wo.prototype.ka = function (a) {
    return "string" === typeof this.nd ? Ij(a(this.nd)) : wo.I.ka.call(this, a);
  };
  wo.prototype.name = function () {
    return "String";
  };
  var zo = function (a, b) {
    if (!(this instanceof zo)) return qm(zo, arguments);
    for (var c = [], d = a.args, e = 0; e < d.length; e++) {
      var f = d[e],
        g = f.type;
      c.push(Ao(g in sm ? sm[g] : null, f.name));
    }
    if (void 0 === b.apply(null, c))
      throw Error("User-defined methods must return a value.");
    this.ab = Bo(a, c, b);
    this.xg = b.apply(null, c);
  };
  x(zo, ym);
  w("ee.CustomFunction", zo);
  zo.prototype.encode = function (a) {
    return {
      type: "Function",
      argumentNames: Xa(this.ab.args, function (b) {
        return b.name;
      }),
      body: a(this.xg),
    };
  };
  zo.prototype.ka = function (a) {
    return Nj(
      this.ab.args.map(function (b) {
        return b.name;
      }),
      a(this.xg)
    );
  };
  zo.prototype.Ed = function (a, b) {
    return Mj(a(this), b);
  };
  zo.prototype.aa = function () {
    return this.ab;
  };
  var Ao = function (a, b) {
      a = a || Object;
      if (!(a.prototype instanceof O))
        if (a && a != Object)
          if (a == String) a = wo;
          else if (a == Number) a = to;
          else if (a == Array) a = r.ee.List;
          else
            throw Error(
              "Variables must be of an EE type, e.g. ee.Image or ee.Number."
            );
        else a = O;
      var c = function (d) {
        this.args = this.F = null;
        this.V = d;
      };
      c.prototype = a.prototype;
      return new c(b);
    },
    Co = function (a, b) {
      b = {
        name: "",
        returns: "Object",
        args: Xa(b, function (c) {
          return {
            name: null,
            type:
              "string" === typeof c
                ? c
                : c.prototype instanceof O
                ? c.prototype.name.call(null)
                : c == Number
                ? "Number"
                : c == String
                ? "String"
                : c == Array
                ? "Array"
                : c == Date
                ? "Date"
                : "Object",
          };
        }),
      };
      return new zo(b, a);
    },
    Bo = function (a, b, c) {
      for (var d = [], e = 0; e < b.length; e++) null === b[e].V && d.push(e);
      if (0 === d.length) return a;
      c =
        "_MAPPING_VAR_" +
        (function (h) {
          var n = function (t) {
              return t.map(p).reduce(function (C, D) {
                return C + D;
              }, 0);
            },
            p = function (t) {
              return t.Va
                ? 1
                : t.Fa
                ? n(t.Fa.values)
                : t.Ga
                ? n(Object.values(t.Ga.values))
                : t.ya
                ? n(Object.values(t.ya.arguments))
                : 0;
            };
          return n(Object.values(h.values));
        })(Hk(c.apply(null, b))) +
        "_";
      for (e = 0; e < d.length; e++) {
        var f = d[e],
          g = c + e;
        b[f].V = g;
        a.args[f].name = g;
      }
      return a;
    };
  var Do = function (a, b) {
    if (!(this instanceof Do)) return qm(Do, arguments);
    if (a instanceof Do) return a;
    Eo();
    var c = R(Do, arguments);
    a = c.date;
    c = c.tz;
    var d = new P("Date"),
      e = {},
      f = null;
    if (vm(a)) {
      if (((e.value = a), c))
        if (vm(c)) e.timeZone = c;
        else
          throw Error(
            "Invalid argument specified for ee.Date(..., opt_tz): " + c
          );
    } else if (um(a)) e.value = a;
    else if (za(a)) e.value = Math.floor(a.getTime());
    else if (a instanceof O)
      a.F && "Date" == a.F.aa().returns
        ? ((d = a.F), (e = a.args), (f = a.V))
        : (e.value = a);
    else throw Error("Invalid argument specified for ee.Date(): " + a);
    O.call(this, d, e, f);
  };
  x(Do, O);
  w("ee.Date", Do);
  var Fo = !1,
    Eo = function () {
      Fo || (Lm(Do, "Date", "Date"), (Fo = !0));
    };
  Do.prototype.name = function () {
    return "Date";
  };
  w("ee.Deserializer", function () {});
  var Ho = function (a) {
    return Go(JSON.parse(a));
  };
  w("ee.Deserializer.fromJSON", Ho);
  var Go = function (a) {
    if ("result" in a && "values" in a) return Io(a);
    var b = {};
    if (u(a) && "CompoundValue" === a.type) {
      for (var c = a.scope, d = 0; d < c.length; d++) {
        var e = c[d][0],
          f = c[d][1];
        if (e in b)
          throw Error('Duplicate scope key "' + e + '" in scope #' + d + ".");
        b[e] = Jo(f, b);
      }
      a = a.value;
    }
    return Jo(a, b);
  };
  w("ee.Deserializer.decode", Go);
  var Jo = function (a, b) {
      if (
        null === a ||
        "number" === typeof a ||
        "boolean" === typeof a ||
        "string" === typeof a
      )
        return a;
      if (Array.isArray(a))
        return Xa(a, function (e) {
          return Jo(e, b);
        });
      if (!u(a) || "function" === typeof a)
        throw Error("Cannot decode object: " + a);
      var c = a.type;
      switch (c) {
        case "ValueRef":
          if (a.value in b) return b[a.value];
          throw Error("Unknown ValueRef: " + a);
        case "ArgumentRef":
          a = a.value;
          if ("string" !== typeof a) throw Error("Invalid variable name: " + a);
          return Ao(Object, a);
        case "Date":
          a = a.value;
          if ("number" !== typeof a) throw Error("Invalid date value: " + a);
          return new Do(a / 1e3);
        case "Bytes":
          return Ko(new Ze({ tb: a }), a);
        case "Invocation":
          return (
            (c =
              "functionName" in a ? Dm(a.functionName) : Jo(a["function"], b)),
            (a = Db(a.arguments, function (e) {
              return Jo(e, b);
            })),
            Lo(c, a)
          );
        case "Dictionary":
          return Db(a.value, function (e) {
            return Jo(e, b);
          });
        case "Function":
          var d = Jo(a.body, b);
          a = {
            name: "",
            args: Xa(a.argumentNames, function (e) {
              return { name: e, type: "Object", optional: !1 };
            }),
            returns: "Object",
          };
          return new zo(a, function () {
            return d;
          });
        case "Point":
        case "MultiPoint":
        case "LineString":
        case "MultiLineString":
        case "Polygon":
        case "MultiPolygon":
        case "LinearRing":
        case "GeometryCollection":
          return new U(a);
        case "CompoundValue":
          throw Error("Nested CompoundValues are disallowed.");
        default:
          throw Error("Unknown encoded object type: " + c);
      }
    },
    Ko = function (a, b) {
      var c = function () {};
      q(c, Gj);
      c.prototype.encode = function () {
        return b;
      };
      c.prototype.ka = function () {
        return a;
      };
      return new c();
    },
    Lo = function (a, b) {
      if (a instanceof ym) return a.apply(b);
      if (a instanceof O) {
        var c = function () {
          return ym.apply(this, arguments) || this;
        };
        q(c, ym);
        c.prototype.encode = function (d) {
          return a.encode(d);
        };
        c.prototype.Ed = function (d, e) {
          return Mj(d(a), e);
        };
        return new O(new c(), b);
      }
      throw Error("Invalid function value");
    },
    Mo = function (a) {
      return Io(JSON.parse(a));
    };
  w("ee.Deserializer.fromCloudApiJSON", Mo);
  var Io = function (a) {
    var b = Jd(lf, a),
      c = {},
      d = function (g, h) {
        if (!(g in c)) {
          if (!(g in b.values)) throw Error("Cannot find " + h + " " + g);
          c[g] = e(b.values[g]);
        }
        return c[g];
      },
      e = function (g) {
        if (null !== g.kb) g = g.kb;
        else if (null !== g.Fa) g = g.Fa.values.map(e);
        else if (null !== g.Ga) g = Db(g.Ga.values, e);
        else if (null !== g.Pb) g = Ao(Object, g.Pb);
        else if (null !== g.Va) g = f(g.Va);
        else if (null !== g.ya) {
          var h = g.ya;
          g = h.Wa ? d(h.Wa, "function") : Dm(h.functionName);
          h = Db(h.arguments, e);
          g = Lo(g, h);
        } else
          g =
            null !== g.tb
              ? Ko(new Ze({ tb: g.tb }), g.tb)
              : null !== g.Vb
              ? Ko(new Ze({ Vb: g.Vb }), g.Vb)
              : null !== g.Pa
              ? d(g.Pa, "reference")
              : null;
        return g;
      },
      f = function (g) {
        var h = d(g.body, "function body");
        g = {
          args: g.kc.map(function (n) {
            return { name: n, type: "Object", optional: !1 };
          }),
          name: "",
          returns: "Object",
        };
        return new zo(g, function () {
          return h;
        });
      };
    return d(b.result, "result value");
  };
  w("ee.Deserializer.decodeCloudApi", Io);
  var No = function (a) {
    if (!(this instanceof No)) return qm(No, arguments);
    if (a instanceof No) return a;
    Oo();
    wm(a)
      ? (O.call(this, null, null), (this.Rc = a))
      : (a instanceof O && a.F && "Dictionary" == a.F.aa().returns
          ? O.call(this, a.F, a.args, a.V)
          : O.call(this, new P("Dictionary"), { input: a }, null),
        (this.Rc = null));
  };
  x(No, O);
  w("ee.Dictionary", No);
  var Po = !1,
    Oo = function () {
      Po || (Lm(No, "Dictionary", "Dictionary"), (Po = !0));
    };
  No.prototype.encode = function (a) {
    return null !== this.Rc ? a(this.Rc) : No.I.encode.call(this, a);
  };
  No.prototype.ka = function (a) {
    return null !== this.Rc ? Ij(a(this.Rc)) : No.I.ka.call(this, a);
  };
  No.prototype.name = function () {
    return "Dictionary";
  };
  var Qo = {};
  w("ee.Terrain", Qo);
  Qo.uf = !1;
  Qo.Xj = function () {
    Qo.uf || (Lm(Qo, "Terrain", "Terrain"), (Qo.uf = !0));
  };
  Qo.reset = function () {
    Mm(Qo);
    Qo.uf = !1;
  };
  var Wo = function (a, b, c, d, e) {
    if ("ready" != Ro || a || b) {
      var f = null != c;
      if (d)
        if (f) So.push(d);
        else
          throw Error(
            "Can't pass an error callback without a success callback."
          );
      if ("loading" == Ro && f) To.push(c);
      else if (((Ro = "loading"), aj(a, b, e), f)) To.push(c), Hm(Uo, Vo);
      else
        try {
          Hm(), Uo();
        } catch (g) {
          throw (Vo(g), g);
        }
    } else c && c();
  };
  w("ee.initialize", Wo);
  var Zo = function () {
    Ro = "not_ready";
    vj = uj = ij = null;
    tj = !1;
    Fm = null;
    Gm = {};
    Mm(Do);
    Fo = !1;
    Mm(No);
    Po = !1;
    Mm(S);
    Tm = !1;
    Mm(N);
    On = !1;
    Mm(X);
    Gn = !1;
    Mm(W);
    En = !1;
    Mm(Z);
    Xn = !1;
    Mm(Y);
    Vn = !1;
    Mm(V);
    pn = !1;
    Mm(U);
    Wm = !1;
    Mm(Rn);
    Tn = !1;
    Mm(to);
    vo = !1;
    Mm(wo);
    yo = !1;
    Qo.reset();
    for (var a = r.ee, b = 0; b < Xo.length; b++) {
      var c = Xo[b];
      Mm(a[c]);
      delete a[c];
    }
    Xo = [];
    sm = a;
    a = Yo;
    for (var d in a) delete a[d];
  };
  w("ee.reset", Zo);
  var $o = { yk: "not_ready", LOADING: "loading", zk: "ready" };
  w("ee.InitState", $o);
  w("ee.InitState.NOT_READY", "not_ready");
  w("ee.InitState.LOADING", "loading");
  w("ee.InitState.READY", "ready");
  var Ro = "not_ready",
    To = [],
    So = [];
  w("ee.TILE_SIZE", 256);
  var Xo = [],
    Yo = {};
  w("ee.Algorithms", Yo);
  var ap = function (a, b) {
    "string" === typeof a && (a = new P(a));
    return ym.prototype.call.apply(a, Array.prototype.slice.call(arguments, 1));
  };
  w("ee.call", ap);
  var bp = function (a, b) {
    "string" === typeof a && (a = new P(a));
    return a.apply(b);
  };
  w("ee.apply", bp);
  var Uo = function () {
      if ("loading" == Ro) {
        try {
          Eo();
          Oo();
          Sm();
          Mn();
          Fn();
          Dn();
          Wn();
          Un();
          on();
          Um();
          Sn();
          uo();
          xo();
          Qo.Xj();
          var a = Im(),
            b = {},
            c = {},
            d;
          for (d in a) {
            b[-1 != d.indexOf(".") ? d.slice(0, d.indexOf(".")) : d] = !0;
            var e = a[d].returns.replace(/<.*>/, "");
            c[e] = !0;
          }
          var f = r.ee,
            g;
          for (g in b)
            g in c &&
              !(g in f) &&
              ((f[g] = cp(g)),
              Xo.push(g),
              a[g]
                ? ((f[g].signature = a[g]),
                  (f[g].signature.isConstructor = !0),
                  (Gm[g] = !0))
                : (f[g].signature = {}));
          sm = f;
          dp();
        } catch (h) {
          Vo(h);
          return;
        }
        Ro = "ready";
        for (So = []; 0 < To.length; ) To.shift()();
      }
    },
    Vo = function (a) {
      if ("loading" == Ro)
        for (Ro = "not_ready", To = []; 0 < So.length; ) So.shift()(a);
    },
    dp = function () {
      var a = Jm();
      Gb(a)
        .sort()
        .forEach(function (b) {
          var c = a[b],
            d = c.aa();
          if (!d.hidden) {
            b = b.split(".");
            var e = Yo;
            for (e.signature = {}; 1 < b.length; ) {
              var f = b[0];
              f in e || (e[f] = { signature: {} });
              e = e[f];
              b = kb(b, 1);
            }
            f = function (g) {
              return Cm(c, void 0, Array.prototype.slice.call(arguments, 0));
            };
            f.signature = d;
            f.toString = v(c.toString, c);
            e[b[0]] = f;
          }
        });
    },
    cp = function (a) {
      var b = function (c) {
        var d = r.ee[a],
          e = Array.prototype.slice.call(arguments),
          f = 1 == e.length;
        if (f && e[0] instanceof d) return e[0];
        if (!(this instanceof d)) return qm(d, e);
        d = Km(a);
        var g = !(e[0] instanceof O),
          h = !1;
        d &&
          (f
            ? g
              ? (h = !0)
              : (e[0].F && e[0].F.aa().returns == d.aa().returns) || (h = !0)
            : (h = !0));
        if (h) (e = xm(e, d.aa()) ? e[0] : Am(d, e)), O.call(this, d, Bm(d, e));
        else {
          if (!f) throw Error("Too many arguments for ee." + a + "(): " + e);
          if (g)
            throw Error(
              "Invalid argument for ee." +
                a +
                "(): " +
                e +
                ". Must be a ComputedObject."
            );
          e = e[0];
          O.call(this, e.F, e.args, e.V);
        }
      };
      x(b, O);
      b.prototype.name = function () {
        return a;
      };
      Lm(b, a, a);
      return b;
    };
  zm = function (a, b) {
    if (null === a) return null;
    if (void 0 !== a) {
      var c = r.ee;
      switch (b) {
        case "Image":
          return new N(a);
        case "Feature":
          return a instanceof W
            ? Q("Feature", Q("Collection.geometry", a))
            : new X(a);
        case "Element":
          if (a instanceof S) return a;
          if (a instanceof U) return new X(a);
          if (a instanceof O) return new S(a.F, a.args, a.V);
          throw Error("Cannot convert " + a + " to Element.");
        case "Geometry":
          return a instanceof Y ? Q("Collection.geometry", a) : new U(a);
        case "FeatureCollection":
        case "Collection":
          return a instanceof W ? a : new Y(a);
        case "ImageCollection":
          return new Z(a);
        case "Filter":
          return new V(a);
        case "Algorithm":
          if ("string" === typeof a) return new P(a);
          if ("function" === typeof a) {
            b = a.length;
            c = [];
            for (var d = 0; d < b; d++) c[d] = "Object";
            return Co(a, c);
          }
          if (a instanceof Gj) return a;
          throw Error("Argument is not a function: " + a);
        case "String":
          return vm(a) || a instanceof wo || a instanceof O ? new wo(a) : a;
        case "Dictionary":
          return wm(a) ? a : new No(a);
        case "List":
          return new Rn(a);
        case "Number":
        case "Float":
        case "Long":
        case "Integer":
        case "Short":
        case "Byte":
          return new to(a);
        default:
          if (b in c) {
            d = Km(b);
            if (a instanceof c[b]) return a;
            if (d) return new c[b](a);
            if ("string" === typeof a) {
              if (a in c[b]) return c[b][a].call();
              throw Error("Unknown algorithm: " + b + "." + a);
            }
            return new c[b](a);
          }
          return a;
      }
    }
  };
  var ep = function (a, b, c) {
    Ad.call(this, a, b, c);
    this.tileSize = new google.maps.Size(256, 256);
    this.bh = new od();
    this.ah = new od();
  };
  q(ep, Ad);
  ep.prototype.getTile = function (a, b) {
    var c = Bd(this, a, b);
    b = [this.url, c].join("/") + "?token=" + this.token;
    c = [c, this.Bb, this.token].join("/");
    this.Db.push(c);
    this.Bb += 1;
    var d = gh("DIV");
    fp(this, b, a, c, d);
    gp(this);
    return d;
  };
  var fp = function (a, b, c, d, e) {
      var f = Ii(Gi);
      f.open("GET", b, !0);
      f.responseType = "arraybuffer";
      f.onreadystatechange = v(function () {
        if (f.readyState === XMLHttpRequest.DONE && 200 === f.status) {
          var g = f.response;
          if (g)
            (g = new Float32Array(g)),
              this.bh.set(c, g),
              this.ah.set(c, e),
              fb(this.Db, d),
              gp(this);
          else
            throw (
              (this.gg.add(d),
              Error("Unable to request floating point array buffers."))
            );
        }
      }, a);
      f.send();
    },
    gp = function (a) {
      a.dispatchEvent(new Cd(a.Db.length));
    };
  ep.prototype.A = function () {
    this.ah = this.bh = null;
    Ad.prototype.A.call(this);
  };
  w("ee.FloatTileOverlay", ep);
  var hp = function () {
    this.ce = new Map();
  };
  hp.prototype.clear = function () {
    this.ce.clear();
  };
  var ip = function (a, b) {
    a.ce.has(b) ||
      a.ce.set(b, { throttleCount: 0, errorCount: 0, tileLatencies: [] });
    return a.ce.get(b);
  };
  var jp = function (a) {
    y.call(this);
    this.Xa = a;
    this.H = {};
  };
  x(jp, y);
  var kp = [];
  jp.prototype.Ya = function (a, b, c, d) {
    Array.isArray(b) || (b && (kp[0] = b.toString()), (b = kp));
    for (var e = 0; e < b.length; e++) {
      var f = Xc(a, b[e], c || this.handleEvent, d || !1, this.Xa || this);
      if (!f) break;
      this.H[f.key] = f;
    }
    return this;
  };
  jp.prototype.dd = function (a, b, c, d) {
    return lp(this, a, b, c, d);
  };
  var lp = function (a, b, c, d, e, f) {
    if (Array.isArray(c))
      for (var g = 0; g < c.length; g++) lp(a, b, c[g], d, e, f);
    else {
      b = Wc(b, c, d || a.handleEvent, e, f || a.Xa || a);
      if (!b) return a;
      a.H[b.key] = b;
    }
    return a;
  };
  jp.prototype.le = function (a, b, c, d, e) {
    if (Array.isArray(b))
      for (var f = 0; f < b.length; f++) this.le(a, b[f], c, d, e);
    else
      (c = c || this.handleEvent),
        (d = u(d) ? !!d.capture : !!d),
        (e = e || this.Xa || this),
        (c = Yc(c)),
        (d = !!d),
        (b = Mc(a)
          ? a.Uc(b, c, d, e)
          : a
          ? (a = $c(a))
            ? a.Uc(b, c, d, e)
            : null
          : null),
        b && (ed(b), delete this.H[b.key]);
  };
  jp.prototype.ld = function () {
    Bb(
      this.H,
      function (a, b) {
        this.H.hasOwnProperty(b) && ed(a);
      },
      this
    );
    this.H = {};
  };
  jp.prototype.A = function () {
    jp.I.A.call(this);
    this.ld();
  };
  jp.prototype.handleEvent = function () {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var np = function (a, b) {
    void 0 !== a.name
      ? ((this.name = a.name), (this.code = Jb[a.name]))
      : ((this.code = a = Pa(a.code)), (this.name = mp(a)));
    Ka.call(this, kc("%s %s", this.name, b));
  };
  x(np, Ka);
  var mp = function (a) {
      var b = Kb(function (c) {
        return a == c;
      });
      if (void 0 === b) throw Error("Invalid code: " + a);
      return b;
    },
    Jb = {
      AbortError: 3,
      EncodingError: 5,
      InvalidModificationError: 9,
      InvalidStateError: 7,
      NotFoundError: 1,
      NotReadableError: 4,
      NoModificationAllowedError: 6,
      PathExistsError: 12,
      QuotaExceededError: 10,
      SecurityError: 2,
      SyntaxError: 8,
      TypeMismatchError: 11,
    };
  var op = function (a, b) {
    Ja.call(this, a.type, b);
    this.Ia = a;
  };
  x(op, Ja);
  var pp = function () {
    A.call(this);
    this.ca = new FileReader();
    this.ca.onloadstart = v(this.pc, this);
    this.ca.onprogress = v(this.pc, this);
    this.ca.onload = v(this.pc, this);
    this.ca.onabort = v(this.pc, this);
    this.ca.onerror = v(this.pc, this);
    this.ca.onloadend = v(this.pc, this);
  };
  x(pp, A);
  k = pp.prototype;
  k.abort = function () {
    try {
      this.ca.abort();
    } catch (a) {
      throw new np(a, "aborting read");
    }
  };
  k.xb = function () {
    return this.ca.readyState;
  };
  k.getError = function () {
    return this.ca.error && new np(this.ca.error, "reading file");
  };
  k.pc = function (a) {
    this.dispatchEvent(new op(a, this));
  };
  k.A = function () {
    pp.I.A.call(this);
    delete this.ca;
  };
  k.readAsBinaryString = function (a) {
    this.ca.readAsBinaryString(a);
  };
  k.readAsArrayBuffer = function (a) {
    this.ca.readAsArrayBuffer(a);
  };
  k.readAsText = function (a, b) {
    this.ca.readAsText(a, b);
  };
  var qp = function (a, b, c, d) {
    this.top = a;
    this.right = b;
    this.bottom = c;
    this.left = d;
  };
  k = qp.prototype;
  k.clone = function () {
    return new qp(this.top, this.right, this.bottom, this.left);
  };
  k.toString = function () {
    return (
      "(" +
      this.top +
      "t, " +
      this.right +
      "r, " +
      this.bottom +
      "b, " +
      this.left +
      "l)"
    );
  };
  k.contains = function (a) {
    return this && a
      ? a instanceof qp
        ? a.left >= this.left &&
          a.right <= this.right &&
          a.top >= this.top &&
          a.bottom <= this.bottom
        : a.x >= this.left &&
          a.x <= this.right &&
          a.y >= this.top &&
          a.y <= this.bottom
      : !1;
  };
  k.expand = function (a, b, c, d) {
    u(a)
      ? ((this.top -= a.top),
        (this.right += a.right),
        (this.bottom += a.bottom),
        (this.left -= a.left))
      : ((this.top -= a),
        (this.right += Number(b)),
        (this.bottom += Number(c)),
        (this.left -= Number(d)));
    return this;
  };
  k.ceil = function () {
    this.top = Math.ceil(this.top);
    this.right = Math.ceil(this.right);
    this.bottom = Math.ceil(this.bottom);
    this.left = Math.ceil(this.left);
    return this;
  };
  k.floor = function () {
    this.top = Math.floor(this.top);
    this.right = Math.floor(this.right);
    this.bottom = Math.floor(this.bottom);
    this.left = Math.floor(this.left);
    return this;
  };
  k.round = function () {
    this.top = Math.round(this.top);
    this.right = Math.round(this.right);
    this.bottom = Math.round(this.bottom);
    this.left = Math.round(this.left);
    return this;
  };
  k.translate = function (a, b) {
    a instanceof bh
      ? ((this.left += a.x),
        (this.right += a.x),
        (this.top += a.y),
        (this.bottom += a.y))
      : (Pa(a),
        (this.left += a),
        (this.right += a),
        "number" === typeof b && ((this.top += b), (this.bottom += b)));
    return this;
  };
  k.scale = function (a, b) {
    b = "number" === typeof b ? b : a;
    this.left *= a;
    this.right *= a;
    this.top *= b;
    this.bottom *= b;
    return this;
  };
  var rp = function (a, b, c, d) {
    this.left = a;
    this.top = b;
    this.width = c;
    this.height = d;
  };
  k = rp.prototype;
  k.clone = function () {
    return new rp(this.left, this.top, this.width, this.height);
  };
  k.toString = function () {
    return (
      "(" +
      this.left +
      ", " +
      this.top +
      " - " +
      this.width +
      "w x " +
      this.height +
      "h)"
    );
  };
  k.th = function (a) {
    var b = Math.max(this.left, a.left),
      c = Math.min(this.left + this.width, a.left + a.width);
    if (b <= c) {
      var d = Math.max(this.top, a.top);
      a = Math.min(this.top + this.height, a.top + a.height);
      if (d <= a)
        return (
          (this.left = b),
          (this.top = d),
          (this.width = c - b),
          (this.height = a - d),
          !0
        );
    }
    return !1;
  };
  k.intersects = function (a) {
    return (
      this.left <= a.left + a.width &&
      a.left <= this.left + this.width &&
      this.top <= a.top + a.height &&
      a.top <= this.top + this.height
    );
  };
  k.bf = function (a) {
    b: {
      var b = Math.max(this.left, a.left);
      var c = Math.min(this.left + this.width, a.left + a.width);
      if (b <= c) {
        var d = Math.max(this.top, a.top),
          e = Math.min(this.top + this.height, a.top + a.height);
        if (d <= e) {
          b = new rp(b, d, c - b, e - d);
          break b;
        }
      }
      b = null;
    }
    if (b && b.height && b.width) {
      b = [];
      c = this.top;
      d = this.height;
      e = this.left + this.width;
      var f = this.top + this.height,
        g = a.left + a.width,
        h = a.top + a.height;
      a.top > this.top &&
        (b.push(new rp(this.left, this.top, this.width, a.top - this.top)),
        (c = a.top),
        (d -= a.top - this.top));
      h < f && (b.push(new rp(this.left, h, this.width, f - h)), (d = h - c));
      a.left > this.left && b.push(new rp(this.left, c, a.left - this.left, d));
      g < e && b.push(new rp(g, c, e - g, d));
      a = b;
    } else a = [this.clone()];
    return a;
  };
  k.contains = function (a) {
    return a instanceof bh
      ? a.x >= this.left &&
          a.x <= this.left + this.width &&
          a.y >= this.top &&
          a.y <= this.top + this.height
      : this.left <= a.left &&
          this.left + this.width >= a.left + a.width &&
          this.top <= a.top &&
          this.top + this.height >= a.top + a.height;
  };
  k.distance = function (a) {
    var b =
      a.x < this.left
        ? this.left - a.x
        : Math.max(a.x - (this.left + this.width), 0);
    a =
      a.y < this.top
        ? this.top - a.y
        : Math.max(a.y - (this.top + this.height), 0);
    return Math.sqrt(b * b + a * a);
  };
  k.getCenter = function () {
    return new bh(this.left + this.width / 2, this.top + this.height / 2);
  };
  k.ceil = function () {
    this.left = Math.ceil(this.left);
    this.top = Math.ceil(this.top);
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this;
  };
  k.floor = function () {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this;
  };
  k.round = function () {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this;
  };
  k.translate = function (a, b) {
    a instanceof bh
      ? ((this.left += a.x), (this.top += a.y))
      : ((this.left += Pa(a)), "number" === typeof b && (this.top += b));
    return this;
  };
  k.scale = function (a, b) {
    b = "number" === typeof b ? b : a;
    this.left *= a;
    this.width *= a;
    this.top *= b;
    this.height *= b;
    return this;
  };
  var sp = function (a, b) {
    z(a);
    a = a.style;
    "opacity" in a
      ? (a.opacity = b)
      : "MozOpacity" in a
      ? (a.MozOpacity = b)
      : "filter" in a &&
        (a.filter = "" === b ? "" : "alpha(opacity=" + 100 * Number(b) + ")");
  };
  var tp = function (a, b) {
    A.call(this);
    b = b || {};
    this.minZoom = b.minZoom || 0;
    this.maxZoom = b.maxZoom || 20;
    if (!window.google || !window.google.maps)
      throw Error("Google Maps API hasn't been initialized.");
    this.tileSize = b.tileSize || new google.maps.Size(256, 256);
    this.name = b.name;
    this.opacity = "opacity" in b ? b.opacity : 1;
    this.be = new hp();
    this.Cb = new od();
    this.Bb = 0;
    this.fg = a;
    this.nb = new jp(this);
    this.projection = null;
    this.radius = 0;
    this.alt = null;
  };
  q(tp, A);
  k = tp.prototype;
  k.Le = function (a) {
    return Xc(this, "tile-load", a);
  };
  k.Qf = function (a) {
    ed(a);
  };
  k.Vc = function () {
    return up(this, "throttled") + up(this, "loading") + up(this, "new");
  };
  k.setOpacity = function (a) {
    this.opacity = a;
    this.Cb.forEach(function (b) {
      sp(b.ta, this.opacity);
    }, this);
  };
  k.getStats = function () {
    return this.be;
  };
  k.getTile = function (a, b, c) {
    var d = 1 << b;
    if (b < this.minZoom || 0 > a.y || a.y >= d) return c.createElement("div");
    var e = a.x % d;
    0 > e && (e += d);
    d = new google.maps.Point(e, a.y);
    a = [[a.x, a.y, b, this.Bb++].join("-"), this.fg.jh()].join("-");
    b = this.Kg(d, b, c, a);
    b.tileSize = this.tileSize;
    sp(b.ta, this.opacity);
    this.Cb.set(a, b);
    vp(this, b);
    this.dispatchEvent(new wp(this.Vc()));
    this.fg.zh(b, new Date().getTime() / 1e3);
    return b.ta;
  };
  k.releaseTile = function (a) {
    var b = this.Cb.get(a.id);
    this.Cb.remove(a.id);
    b && (b.abort(), Ia(b));
  };
  var vp = function (a, b) {
    a.nb.Ya(b, "status-changed", function () {
      switch (b.getStatus()) {
        case "loaded":
          var c = b.$j,
            d = new Date().getTime();
          ip(this.be, b.zoom).tileLatencies.push(d - c);
          this.dispatchEvent(new xp(this.Vc()));
          break;
        case "throttled":
          ip(this.be, b.zoom).throttleCount++;
          this.dispatchEvent(new yp(b.Ma));
          break;
        case "failed":
          ip(this.be, b.zoom).errorCount++;
          this.dispatchEvent(new zp(b.Ma, b.Qj));
          break;
        case "aborted":
          this.dispatchEvent(new Ap(this.Vc()));
      }
    });
  };
  tp.prototype.A = function () {
    A.prototype.A.call(this);
    this.Cb.forEach(Ia);
    this.Cb.clear();
    this.Cb = null;
    Ia(this.nb);
    this.fg = this.nb = null;
  };
  var up = function (a, b) {
    return $a(a.Cb.T(), function (c) {
      return c.getStatus() == b;
    });
  };
  w("ee.layers.AbstractOverlay", tp);
  tp.prototype.removeTileCallback = tp.prototype.Qf;
  tp.prototype.addTileCallback = tp.prototype.Le;
  var xp = function () {
    Ja.call(this, "tile-load");
  };
  q(xp, Ja);
  var wp = function () {
    Ja.call(this, "tile-start");
  };
  q(wp, Ja);
  var yp = function () {
    Ja.call(this, "tile-throttle");
  };
  q(yp, Ja);
  var zp = function (a, b) {
    Ja.call(this, "tile-fail");
    this.errorMessage = b;
  };
  q(zp, Ja);
  var Ap = function () {
    Ja.call(this, "tile-abort");
  };
  q(Ap, Ja);
  var Bp = function (a, b, c, d) {
    A.call(this);
    this.oc = a;
    this.zoom = b;
    this.ta = c.createElement("div");
    this.ta.id = d;
    this.bk = 5;
    this.Yd = function () {};
    this.de = "new";
    this.Xh = 0;
    this.wf = !1;
  };
  q(Bp, A);
  var Dp = function (a) {
    if (!a.wf && "loading" == a.getStatus())
      throw Error(
        "startLoad() can only be invoked once. Use retryLoad() after the first attempt."
      );
    Cp(a, "loading");
    a.$j = new Date().getTime();
    a.bb = new Ji();
    a.bb.Ac = "blob";
    a.bb.Ya(
      "complete",
      function () {
        var b = Xi(this.bb),
          c = this.bb.getStatus();
        429 == c && Cp(this, "throttled");
        if (Ci(c)) {
          var d = {};
          Bb(Yi(this.bb), function (f, g) {
            d[g.toLowerCase()] = f;
          });
          this.qk = d;
          this.di = b;
          this.Tc();
        } else if (b) {
          var e = new pp();
          e.Ya(
            "loadend",
            function () {
              this.md(e.ca.result);
            },
            void 0,
            this
          );
          e.readAsText(b);
        } else this.md("Failed to load tile.");
      },
      !1,
      a
    );
    a.bb.dd("ready", Ga(Ia, a.bb));
    a.Ma &&
      a.Ma.endsWith("&profiling=1") &&
      M &&
      ((a.Ma = a.Ma.replace("&profiling=1", "")),
      a.bb.headers.set("X-Earth-Engine-Computation-Profile", "1"));
    a.bb.send(a.Ma, "GET");
  };
  k = Bp.prototype;
  k.Tc = function () {
    this.Yd(this);
    Cp(this, "loaded");
  };
  k.Nc = function () {
    Ia(this.bb);
  };
  k.md = function (a) {
    var b = function (c) {
      try {
        if (((c = JSON.parse(c)), c.error && c.error.message))
          return c.error.message;
      } catch (d) {}
      return c;
    };
    this.Xh >= this.bk
      ? ((this.Qj = b(a)), Cp(this, "failed"))
      : (this.Nc(),
        setTimeout(
          v(function () {
            this.Ta || ((this.wf = !0), Dp(this), (this.wf = !1));
          }, this),
          1e3 * Math.pow(2, this.Xh++)
        ));
  };
  k.abort = function () {
    this.Nc();
    "aborted" != this.getStatus() &&
      "removed" != this.getStatus() &&
      Cp(this, this.de in Ep ? "removed" : "aborted");
  };
  k.getStatus = function () {
    return this.de;
  };
  var Cp = function (a, b) {
    a.de = b;
    a.dispatchEvent("status-changed");
  };
  Bp.prototype.A = function () {
    A.prototype.A.call(this);
    this.Nc();
    this.ta.remove();
    this.Yd = null;
  };
  var Ep = { aborted: !0, failed: !0, loaded: !0, removed: !0 };
  var Fp = function () {
    y.call(this);
  };
  q(Fp, y);
  var Gp = function (a, b) {
    tp.call(this, a, b);
    this.Ag = new od();
    this.Ug = new od();
  };
  q(Gp, tp);
  Gp.prototype.Kg = function (a, b, c, d) {
    var e = new Hp(a, b, c, d);
    this.nb.Ya(e, "status-changed", function () {
      "loaded" == e.getStatus() &&
        (this.Ag.set(a, new Float32Array(e.Mc)), this.Ug.set(a, e.ta));
    });
    return e;
  };
  Gp.prototype.A = function () {
    tp.prototype.A.call(this);
    this.Ug = this.Ag = null;
  };
  w("ee.layers.BinaryOverlay", Gp);
  var Hp = function (a, b, c, d) {
    Bp.call(this, a, b, c, d);
  };
  q(Hp, Bp);
  Hp.prototype.Tc = function () {
    var a = new pp();
    a.Ya(
      "loadend",
      function () {
        this.Mc = a.ca.result;
        Bp.prototype.Tc.call(this);
      },
      void 0,
      this
    );
    a.readAsArrayBuffer(this.di);
  };
  var Ip = function (a) {
    A.call(this);
    this.Zc = {};
    this.Yc = {};
    this.Xa = new jp(this);
    this.O = a;
    this.Te = !1;
  };
  x(Ip, A);
  var Jp = [rc && !Bc("11") ? "readystatechange" : "load", "abort", "error"],
    Kp = function (a, b, c) {
      if ((c = "string" === typeof c ? c : c.src))
        (a.Te = !1), (a.Zc[b] = { src: c, Jg: null });
    },
    Lp = function (a, b) {
      delete a.Zc[b];
      var c = a.Yc[b];
      c && (delete a.Yc[b], a.Xa.le(c, Jp, a.Jh));
    };
  Ip.prototype.start = function () {
    var a = this.Zc;
    Va(
      Gb(a),
      function (b) {
        var c = a[b];
        if (c && (delete a[b], !this.Ta)) {
          if (this.O) {
            var d = this.O;
            d = (d ? new mh(lh(d)) : La || (La = new mh())).Oj("IMG");
          } else d = new Image();
          c.Jg && (d.crossOrigin = c.Jg);
          this.Xa.Ya(d, Jp, this.Jh);
          this.Yc[b] = d;
          d.id = b;
          d.src = c.src;
        }
      },
      this
    );
  };
  Ip.prototype.Jh = function (a) {
    var b = a.currentTarget;
    if (b) {
      if ("readystatechange" == a.type)
        if ("complete" == b.readyState) a.type = "load";
        else return;
      "undefined" == typeof b.naturalWidth &&
        ("load" == a.type
          ? ((b.naturalWidth = b.width), (b.naturalHeight = b.height))
          : ((b.naturalWidth = 0), (b.naturalHeight = 0)));
      Lp(this, b.id);
      this.dispatchEvent({ type: a.type, target: b });
      !this.Ta &&
        Lb(this.Yc) &&
        Lb(this.Zc) &&
        !this.Te &&
        ((this.Te = !0), this.dispatchEvent("complete"));
    }
  };
  Ip.prototype.A = function () {
    delete this.Zc;
    delete this.Yc;
    Ia(this.Xa);
    Ip.I.A.call(this);
  };
  var Mp = function (a, b) {
    tp.call(this, a, b);
  };
  q(Mp, tp);
  Mp.prototype.Kg = function (a, b, c, d) {
    return new Np(a, b, c, d);
  };
  w("ee.layers.ImageOverlay", Mp);
  var Np = function (a, b, c, d) {
    Bp.call(this, a, b, c, d);
    this.Yd = Op;
    this.rh = this.ga = this.Od = null;
    this.gd = "";
  };
  q(Np, Bp);
  Np.prototype.Tc = function () {
    try {
      var a = ic(this.di);
      this.gd = gc(a);
      var b = "about:invalid#zClosurez" !== this.gd ? this.gd : this.Ma;
    } catch (c) {
      b = this.Ma;
    }
    this.ga = new Ip();
    Kp(this.ga, this.ta.id + "-image", b);
    this.rh = Wc(
      this.ga,
      Pp,
      function (c) {
        "load" == c.type
          ? ((this.Od = c.target), Bp.prototype.Tc.call(this))
          : this.md();
      },
      void 0,
      this
    );
    this.ga.start();
  };
  Np.prototype.Nc = function () {
    Bp.prototype.Nc.call(this);
    this.ga && (ed(this.rh), Ia(this.ga));
  };
  Np.prototype.A = function () {
    Bp.prototype.A.call(this);
    this.gd && URL.revokeObjectURL(this.gd);
  };
  var Op = function (a) {
      a.ta.appendChild(a.Od);
    },
    Pp = ["load", "abort", "error"];
  var Qp = function (a) {
    for (var b = arguments[0], c = 1; c < arguments.length; c++) {
      var d = arguments[c];
      if (0 == d.lastIndexOf("/", 0)) b = d;
      else {
        var e;
        (e = "" == b) ||
          ((e = b.length - 1), (e = 0 <= e && b.indexOf("/", e) == e));
        b = e ? b + d : b + ("/" + d);
      }
    }
    return b;
  };
  var Rp = function (a, b, c, d) {
    y.call(this);
    this.zg = a;
    this.ob = b;
    this.dg = d || "";
    this.Ud = c;
  };
  q(Rp, Fp);
  Rp.prototype.zh = function (a) {
    if (a.zoom <= this.Ud) a.Ma = this.Kd(a.oc, a.zoom);
    else {
      var b = a.zoom - this.Ud,
        c = Math.pow(2, b);
      c = new google.maps.Point(Math.floor(a.oc.x / c), Math.floor(a.oc.y / c));
      a.Ma = this.Kd(c, a.zoom - b);
      a.Yd = Ga(Sp, this.Ud);
    }
    var d = v(a.md, a);
    a.md = v(function (e) {
      e &&
      (e.includes("The specified key does not exist.") ||
        e.includes("AccessDenied"))
        ? Cp(a, "loaded")
        : d(e);
    }, a);
    Dp(a);
  };
  Rp.prototype.jh = function () {
    return [this.zg, this.ob, this.Ud, this.dg].join("-");
  };
  Rp.prototype.Kd = function (a, b) {
    a = Qp(
      "https://storage.googleapis.com",
      this.zg,
      this.ob,
      String(b),
      String(a.x),
      String(a.y)
    );
    this.dg && (a += this.dg);
    return a;
  };
  var Sp = function (a, b) {
    if (!b.Od) throw Error("Tile must have an image element to be rendered.");
    a = Math.pow(2, b.zoom - a);
    var c = b.tileSize.width,
      d = b.ta.ownerDocument.createElement("canvas");
    d.setAttribute("width", c);
    d.setAttribute("height", c);
    b.ta.appendChild(d);
    d = d.getContext("2d");
    d.imageSmoothingEnabled = !1;
    d.mozImageSmoothingEnabled = !1;
    d.webkitImageSmoothingEnabled = !1;
    d.drawImage(
      b.Od,
      (c / a) * (b.oc.x % a),
      (c / a) * (b.oc.y % a),
      c / a,
      c / a,
      0,
      0,
      c,
      c
    );
  };
  w("ee.layers.CloudStorageTileSource", Rp);
  var Tp = function () {
    this.Ja = [];
    this.Ra = [];
  };
  k = Tp.prototype;
  k.enqueue = function (a) {
    this.Ra.push(a);
  };
  k.Qc = function () {
    0 == this.Ja.length &&
      ((this.Ja = this.Ra), this.Ja.reverse(), (this.Ra = []));
    return this.Ja.pop();
  };
  k.M = function () {
    return this.Ja.length + this.Ra.length;
  };
  k.isEmpty = function () {
    return 0 == this.Ja.length && 0 == this.Ra.length;
  };
  k.clear = function () {
    this.Ja = [];
    this.Ra = [];
  };
  k.contains = function (a) {
    return cb(this.Ja, a) || cb(this.Ra, a);
  };
  k.remove = function (a) {
    var b = this.Ja;
    var c = Ua(b, a);
    0 <= c ? (gb(b, c), (b = !0)) : (b = !1);
    return b || fb(this.Ra, a);
  };
  k.T = function () {
    for (var a = [], b = this.Ja.length - 1; 0 <= b; --b) a.push(this.Ja[b]);
    var c = this.Ra.length;
    for (b = 0; b < c; ++b) a.push(this.Ra[b]);
    return a;
  };
  var Up = function (a, b) {
    y.call(this);
    this.Gh = a || 0;
    this.Td = b || 10;
    if (this.Gh > this.Td)
      throw Error("[goog.structs.Pool] Min can not be greater than max");
    this.Ua = new Tp();
    this.yb = new xd();
    this.delay = 0;
    this.xf = null;
    this.vd();
  };
  x(Up, y);
  Up.prototype.Wc = function () {
    var a = Date.now();
    if (!(null != this.xf && a - this.xf < this.delay)) {
      for (var b; 0 < this.Ua.M() && ((b = this.Ua.Qc()), !this.Gf(b)); )
        this.vd();
      !b && this.M() < this.Td && (b = this.We());
      b && ((this.xf = a), this.yb.add(b));
      return b;
    }
  };
  var Vp = function (a, b) {
    return a.yb.remove(b) ? (a.Ke(b), !0) : !1;
  };
  k = Up.prototype;
  k.Ke = function (a) {
    this.yb.remove(a);
    this.Gf(a) && this.M() < this.Td ? this.Ua.enqueue(a) : this.Cd(a);
  };
  k.vd = function () {
    for (var a = this.Ua; this.M() < this.Gh; ) a.enqueue(this.We());
    for (; this.M() > this.Td && 0 < this.Ua.M(); ) this.Cd(a.Qc());
  };
  k.We = function () {
    return {};
  };
  k.Cd = function (a) {
    if ("function" == typeof a.Sa) a.Sa();
    else for (var b in a) a[b] = null;
  };
  k.Gf = function (a) {
    return "function" == typeof a.Mj ? a.Mj() : !0;
  };
  k.contains = function (a) {
    return this.Ua.contains(a) || this.yb.contains(a);
  };
  k.M = function () {
    return this.Ua.M() + this.yb.M();
  };
  k.isEmpty = function () {
    return this.Ua.isEmpty() && this.yb.isEmpty();
  };
  k.A = function () {
    Up.I.A.call(this);
    if (0 < this.yb.M())
      throw Error("[goog.structs.Pool] Objects not released");
    delete this.yb;
    for (var a = this.Ua; !a.isEmpty(); ) this.Cd(a.Qc());
    delete this.Ua;
  };
  var Wp = function (a, b) {
    this.wh = a;
    this.oe = b;
  };
  Wp.prototype.getKey = function () {
    return this.wh;
  };
  Wp.prototype.clone = function () {
    return new Wp(this.wh, this.oe);
  };
  var Xp = function (a) {
      this.Aa = [];
      if (a)
        a: {
          if (a instanceof Xp) {
            var b = a.Ka();
            a = a.T();
            if (0 >= this.M()) {
              for (var c = this.Aa, d = 0; d < b.length; d++)
                c.push(new Wp(b[d], a[d]));
              break a;
            }
          } else (b = Gb(a)), (a = Fb(a));
          for (d = 0; d < b.length; d++) Yp(this, b[d], a[d]);
        }
    },
    Yp = function (a, b, c) {
      var d = a.Aa;
      d.push(new Wp(b, c));
      b = d.length - 1;
      a = a.Aa;
      for (c = a[b]; 0 < b; )
        if (((d = (b - 1) >> 1), a[d].getKey() > c.getKey()))
          (a[b] = a[d]), (b = d);
        else break;
      a[b] = c;
    };
  k = Xp.prototype;
  k.remove = function () {
    var a = this.Aa,
      b = a.length,
      c = a[0];
    if (!(0 >= b)) {
      if (1 == b) eb(a);
      else {
        a[0] = a.pop();
        a = 0;
        b = this.Aa;
        for (var d = b.length, e = b[a]; a < d >> 1; ) {
          var f = 2 * a + 1,
            g = 2 * a + 2;
          f = g < d && b[g].getKey() < b[f].getKey() ? g : f;
          if (b[f].getKey() > e.getKey()) break;
          b[a] = b[f];
          a = f;
        }
        b[a] = e;
      }
      return c.oe;
    }
  };
  k.T = function () {
    for (var a = this.Aa, b = [], c = a.length, d = 0; d < c; d++)
      b.push(a[d].oe);
    return b;
  };
  k.Ka = function () {
    for (var a = this.Aa, b = [], c = a.length, d = 0; d < c; d++)
      b.push(a[d].getKey());
    return b;
  };
  k.Oc = function (a) {
    return Ya(this.Aa, function (b) {
      return b.oe == a;
    });
  };
  k.vb = function (a) {
    return Ya(this.Aa, function (b) {
      return b.getKey() == a;
    });
  };
  k.clone = function () {
    return new Xp(this);
  };
  k.M = function () {
    return this.Aa.length;
  };
  k.isEmpty = function () {
    return 0 == this.Aa.length;
  };
  k.clear = function () {
    eb(this.Aa);
  };
  var Zp = function () {
    Xp.call(this);
  };
  x(Zp, Xp);
  Zp.prototype.enqueue = function (a, b) {
    Yp(this, a, b);
  };
  Zp.prototype.Qc = function () {
    return this.remove();
  };
  var $p = function (a, b) {
    this.Sg = void 0;
    this.$d = new Zp();
    Up.call(this, a, b);
  };
  x($p, Up);
  k = $p.prototype;
  k.Wc = function (a, b) {
    if (!a)
      return (
        (a = $p.I.Wc.call(this)) &&
          this.delay &&
          (this.Sg = r.setTimeout(v(this.Md, this), this.delay)),
        a
      );
    this.$d.enqueue(void 0 !== b ? b : 100, a);
    this.Md();
  };
  k.Md = function () {
    for (var a = this.$d; 0 < a.M(); ) {
      var b = this.Wc();
      if (b) a.Qc().apply(this, [b]);
      else break;
    }
  };
  k.Ke = function (a) {
    $p.I.Ke.call(this, a);
    this.Md();
  };
  k.vd = function () {
    $p.I.vd.call(this);
    this.Md();
  };
  k.A = function () {
    $p.I.A.call(this);
    r.clearTimeout(this.Sg);
    this.$d.clear();
    this.$d = null;
  };
  var aq = function (a, b) {
    y.call(this);
    this.yf = a;
    this.va = b || null;
  };
  q(aq, Fp);
  aq.prototype.zh = function (a, b) {
    var c = Xc(
      a,
      "status-changed",
      function () {
        switch (a.getStatus()) {
          case "loaded":
            var e = a.qk["x-earth-engine-computation-profile"];
            this.va && e && this.va.Ij(a.ta.id, e);
            break;
          case "failed":
          case "aborted":
            this.va && "" !== a.ta.id && this.va.ik(a.ta.id), ed(c);
        }
      },
      void 0,
      this
    );
    a.Ma = this.Kd(a.oc, a.zoom);
    var d = v(this.pf, this, a);
    bq().Wc(d, b);
  };
  aq.prototype.jh = function () {
    return this.yf.mapid + "-" + this.yf.token;
  };
  aq.prototype.pf = function (a, b) {
    var c = bq();
    if (a.Ta || "aborted" == a.getStatus()) Vp(c, b);
    else {
      var d = Xc(a, "status-changed", function () {
        a.de in Ep && (ed(d), Vp(c, b));
      });
      Dp(a);
    }
  };
  aq.prototype.Kd = function (a, b) {
    a = tl(this.yf, a.x, a.y, b);
    return this.va && this.va.isEnabled() ? a + "&profiling=1" : a;
  };
  var bq = function () {
    cq || (cq = new $p(0, 4));
    return cq;
  };
  w("ee.layers.EarthEngineTileSource", aq);
  var cq = null;
  var eq = function () {
    A.call(this);
    this.ie = new dq(0, 60);
    this.zc = new od();
  };
  q(eq, A);
  eq.prototype.send = function (a, b, c, d, e) {
    if (this.zc.get(a)) throw Error("[ee.MapTileManager] ID in use");
    b = new fq(a, b, d, v(this.Th, this), void 0 !== e ? e : 1);
    this.zc.set(a, b);
    a = v(this.pf, this, b);
    this.ie.Wc(a, c);
    return b;
  };
  eq.prototype.abort = function (a) {
    if ((a = this.zc.get(a)))
      a.jc || ((a.jc = !0), (a.Ia = new Ja("abort"))), this.Th(a);
  };
  eq.prototype.pf = function (a, b) {
    if (a.ga || a.jc) gq(this, b);
    else if (
      ((a.oi = b), b.setActive(!0), (b = new Ip()), (a.ga = b), !a.retry())
    )
      throw Error("Cannot dispatch first request!");
  };
  eq.prototype.Th = function (a) {
    this.zc.remove(a.getId());
    a.ga && (gq(this, a.oi), a.ga.Sa());
    a.qf && a.qf(a.Ia, a.Rh);
  };
  var gq = function (a, b) {
    b.setActive(!1);
    if (!Vp(a.ie, b)) throw Error("Object not released");
  };
  eq.prototype.A = function () {
    A.prototype.A.call(this);
    this.ie.Sa();
    this.ie = null;
    var a = this.zc;
    Va(a.T(), function (b) {
      b.Sa();
    });
    a.clear();
    this.zc = null;
  };
  w("ee.MapTileManager", eq);
  eq.vf = void 0;
  eq.ih = function () {
    return eq.vf ? eq.vf : (eq.vf = new eq());
  };
  var fq = function (a, b, c, d, e) {
    y.call(this);
    this.S = a;
    this.wk = b;
    this.ck = void 0 !== e ? e : 1;
    this.qf = c;
    this.bc = d;
  };
  q(fq, y);
  k = fq.prototype;
  k.getId = function () {
    return this.S;
  };
  k.getUrl = function () {
    return this.wk;
  };
  k.Vj = function (a) {
    if (this.jc) this.bc && this.bc(this);
    else
      switch (a.type) {
        case "load":
          this.Ia = a;
          this.bc && this.bc(this);
          break;
        case "error":
        case "abort":
          this.retry() || ((this.Ia = a), this.bc && this.bc(this));
      }
  };
  k.A = function () {
    y.prototype.A.call(this);
    delete this.qf;
    delete this.bc;
  };
  k.retry = function () {
    if (this.qg > this.ck) return !1;
    this.qg++;
    Lp(this.ga, this.S);
    setTimeout(v(this.rk, this), 0);
    return !0;
  };
  k.rk = function () {
    if (!this.jc) {
      var a = v(function (d) {
          this.jc ||
            (Kp(this.ga, this.S, d),
            Wc(this.ga, hq, v(this.Vj, this)),
            this.ga.start());
        }, this),
        b = this.getUrl();
      if (ge(b).Ca.vb("profiling")) {
        var c = new Ji();
        c.Ac = "blob";
        c.Ya(
          "complete",
          v(function () {
            this.Rh =
              c.getResponseHeader("X-Earth-Engine-Computation-Profile") || null;
            if (200 <= c.getStatus() && 300 > c.getStatus())
              try {
                var d = gc(ic(Xi(c)));
                var e = "about:invalid#zClosurez" !== d;
              } catch (f) {}
            a(e ? d : b);
          }, this)
        );
        c.dd("ready", v(c.Sa, c));
        c.send(b, "GET");
      } else a(b);
    }
  };
  k.qg = 0;
  k.jc = !1;
  k.ga = null;
  k.oi = null;
  k.Ia = null;
  k.Rh = null;
  var hq = ["load", "abort", "error"],
    iq = function () {
      y.call(this);
      this.Ea = !1;
    };
  q(iq, y);
  iq.prototype.setActive = function (a) {
    this.Ea = a;
  };
  iq.prototype.Qd = function () {
    return this.Ea;
  };
  var dq = function (a, b) {
    $p.call(this, a, b);
  };
  q(dq, $p);
  dq.prototype.We = function () {
    return new iq();
  };
  dq.prototype.Cd = function (a) {
    a.Sa();
  };
  dq.prototype.Gf = function (a) {
    return !a.Ta && !a.Qd();
  };
  var jq = function (a, b, c, d, e) {
    Ad.call(this, a, b, c, d, e);
    this.minZoom = d.minZoom || 0;
    this.maxZoom = d.maxZoom || 20;
    if (!window.google || !window.google.maps)
      throw Error("Google Maps API hasn't been initialized.");
    this.tileSize = d.tileSize || new google.maps.Size(256, 256);
    this.name = d.name;
    this.hg = new xd();
    this.Hf = 1;
    this.va = e || null;
  };
  q(jq, Ad);
  k = jq.prototype;
  k.Le = function (a) {
    return Xc(this, "tileevent", a);
  };
  k.Qf = function (a) {
    ed(a);
  };
  k.getTile = function (a, b, c) {
    if (b < this.minZoom || 0 > a.y || a.y >= 1 << b)
      return (
        (a = c.createElement("IMG")),
        (a.style.width = "0px"),
        (a.style.height = "0px"),
        a
      );
    b = Bd(this, a, b);
    a = [this.url, b].join("/") + "?token=" + this.token;
    this.va && this.va.isEnabled() && (a += "&profiling=1");
    b = [b, this.Bb, this.token].join("/");
    this.Bb += 1;
    c = gh("DIV", { id: b });
    var d = new Date().getTime() / 1e3;
    this.Db.push(b);
    eq.ih().send(b, a, d, v(this.Uj, this, c, b));
    gp(this);
    return c;
  };
  k.Vc = function () {
    return this.Db.length;
  };
  k.releaseTile = function (a) {
    eq.ih().abort(a.id);
    this.hg.remove(
      void 0 !== a.firstElementChild ? a.firstElementChild : kh(a.firstChild)
    );
    "" !== a.id && (this.gg.remove(a.id), this.va && this.va.ik(a.id));
  };
  k.setOpacity = function (a) {
    this.Hf = a;
    var b = this.hg.ic();
    nd(b, function (c) {
      sp(c, a);
    });
  };
  k.Uj = function (a, b, c, d) {
    "error" == c.type
      ? (fb(this.Db, b), this.gg.add(b), this.dispatchEvent(c))
      : (fb(this.Db, b),
        c.target &&
          "load" == c.type &&
          ((c = c.target),
          this.hg.add(c),
          1 != this.Hf && sp(c, this.Hf),
          a.appendChild(c)),
        gp(this));
    this.va && null !== d && this.va.Ij(b, d);
  };
  w("ee.MapLayerOverlay", jq);
  jq.prototype.removeTileCallback = jq.prototype.Qf;
  jq.prototype.addTileCallback = jq.prototype.Le;
  jq.prototype.getTile = jq.prototype.getTile;
  jq.prototype.setOpacity = jq.prototype.setOpacity;
  jq.prototype.releaseTile = jq.prototype.releaseTile;
  var kq = function (a, b) {
    if (!(this instanceof kq)) return new kq(a, b);
    this.ob = a;
    this.ab = b;
  };
  x(kq, ym);
  w("ee.SavedFunction", kq);
  kq.prototype.encode = function (a) {
    return Q("LoadAlgorithmById", this.ob).encode(a);
  };
  kq.prototype.aa = function () {
    return this.ab;
  };
  var lq = function (a, b, c) {
    y.call(this);
    this.ed = a;
    this.zb = b || 0;
    this.Xa = c;
    this.Lj = v(this.qc, this);
  };
  x(lq, y);
  k = lq.prototype;
  k.S = 0;
  k.A = function () {
    lq.I.A.call(this);
    this.stop();
    delete this.ed;
    delete this.Xa;
  };
  k.start = function (a) {
    this.stop();
    this.S = Rh(this.Lj, void 0 !== a ? a : this.zb);
  };
  k.stop = function () {
    this.Qd() && r.clearTimeout(this.S);
    this.S = 0;
  };
  k.Hd = function () {
    this.stop();
    this.qc();
  };
  k.Qd = function () {
    return 0 != this.S;
  };
  k.qc = function () {
    this.S = 0;
    this.ed && this.ed.call(this.Xa);
  };
  (function () {
    var a = {},
      b = "ee.ApiFunction._call ee.ApiFunction.lookup ee.ApiFunction._apply ee.batch.Export.table.toAsset ee.batch.Export.map.toCloudStorage ee.batch.Export.image.toCloudStorage ee.batch.Export.video.toCloudStorage ee.batch.Export.videoMap.toCloudStorage ee.batch.Export.image.toAsset ee.batch.Export.image.toDrive ee.batch.Export.video.toDrive ee.batch.Export.table.toCloudStorage ee.batch.Export.table.toDrive ee.Collection.prototype.map ee.Collection.prototype.filterBounds ee.Collection.prototype.iterate ee.Collection.prototype.filterDate ee.Collection.prototype.limit ee.Collection.prototype.filter ee.Collection.prototype.filterMetadata ee.Collection.prototype.sort ee.ComputedObject.prototype.getInfo ee.ComputedObject.prototype.serialize ee.ComputedObject.prototype.aside ee.ComputedObject.prototype.evaluate ee.data.listBuckets ee.data.startTableIngestion ee.data.getAssetRoots ee.data.authenticateViaPopup ee.data.getAsset ee.data.createAssetHome ee.data.authenticateViaPrivateKey ee.data.getInfo ee.data.createAsset ee.data.getList ee.data.createFolder ee.data.listImages ee.data.listAssets ee.data.renameAsset ee.data.getMapId ee.data.authenticate ee.data.getTileUrl ee.data.getDownloadId ee.data.copyAsset ee.data.setAssetProperties ee.data.getTaskList ee.data.authenticateViaOauth ee.data.startProcessing ee.data.getAssetRootQuota ee.data.deleteAsset ee.data.getTaskListWithLimit ee.data.makeDownloadUrl ee.data.getAssetAcl ee.data.getTableDownloadId ee.data.listOperations ee.data.getOperation ee.data.computeValue ee.data.makeTableDownloadUrl ee.data.getThumbId ee.data.cancelOperation ee.data.newTaskId ee.data.updateAsset ee.data.getVideoThumbId ee.data.startIngestion ee.data.cancelTask ee.data.getTaskStatus ee.data.makeThumbUrl ee.data.setAssetAcl ee.data.updateTask ee.data.getFilmstripThumbId ee.Date ee.Deserializer.decode ee.Deserializer.fromJSON ee.Deserializer.fromCloudApiJSON ee.Deserializer.decodeCloudApi ee.Dictionary ee.initialize ee.call ee.reset ee.apply ee.TILE_SIZE ee.Algorithms ee.InitState ee.Element.prototype.set ee.Feature ee.Feature.prototype.getMap ee.Feature.prototype.getInfo ee.FeatureCollection.prototype.select ee.FeatureCollection.prototype.getInfo ee.FeatureCollection ee.FeatureCollection.prototype.getMap ee.FeatureCollection.prototype.getDownloadURL ee.Filter.gt ee.Filter.eq ee.Filter.bounds ee.Filter.neq ee.Filter ee.Filter.lt ee.Filter.gte ee.Filter.or ee.Filter.lte ee.Filter.and ee.Filter.date ee.Filter.inList ee.Filter.prototype.not ee.Filter.metadata ee.Function.prototype.apply ee.Function.prototype.call ee.Geometry.prototype.serialize ee.Geometry.Point ee.Geometry.MultiPoint ee.Geometry.MultiLineString ee.Geometry ee.Geometry.LineString ee.Geometry.MultiPolygon ee.Geometry.prototype.toGeoJSON ee.Geometry.Rectangle ee.Geometry.prototype.toGeoJSONString ee.Geometry.BBox ee.Geometry.LinearRing ee.Geometry.Polygon ee.Image.prototype.select ee.Image.cat ee.Image.prototype.rename ee.Image.prototype.getDownloadURL ee.Image.rgb ee.Image.prototype.getThumbId ee.Image.prototype.clip ee.Image ee.Image.prototype.getMap ee.Image.prototype.expression ee.Image.prototype.getInfo ee.Image.prototype.getThumbURL ee.ImageCollection ee.ImageCollection.prototype.select ee.ImageCollection.prototype.getMap ee.ImageCollection.prototype.first ee.ImageCollection.prototype.getInfo ee.ImageCollection.prototype.getVideoThumbURL ee.ImageCollection.prototype.getFilmstripThumbURL ee.List ee.Number ee.Serializer.encode ee.Serializer.toReadableCloudApiJSON ee.Serializer.toCloudApiJSON ee.Serializer.encodeCloudApiPretty ee.Serializer.toReadableJSON ee.Serializer.encodeCloudApi ee.Serializer.toJSON ee.String ee.Terrain".split(
        " "
      ),
      c = [
        ["name", "var_args"],
        ["name"],
        ["name", "namedArgs"],
        ["collection", "opt_description", "opt_assetId"],
        "image opt_description opt_bucket opt_fileFormat opt_path opt_writePublicTiles opt_scale opt_maxZoom opt_minZoom opt_region opt_skipEmptyTiles opt_mapsApiKey".split(
          " "
        ),
        "image opt_description opt_bucket opt_fileNamePrefix opt_dimensions opt_region opt_scale opt_crs opt_crsTransform opt_maxPixels opt_shardSize opt_fileDimensions opt_skipEmptyTiles opt_fileFormat opt_formatOptions".split(
          " "
        ),
        "collection opt_description opt_bucket opt_fileNamePrefix opt_framesPerSecond opt_dimensions opt_region opt_scale opt_crs opt_crsTransform opt_maxPixels opt_maxFrames".split(
          " "
        ),
        "collection opt_description opt_bucket opt_fileNamePrefix opt_framesPerSecond opt_writePublicTiles opt_minZoom opt_maxZoom opt_scale opt_region opt_skipEmptyTiles opt_minTimeMachineZoomSubset opt_maxTimeMachineZoomSubset opt_tileWidth opt_tileHeight opt_tileStride opt_videoFormat opt_version opt_mapsApiKey opt_bucketCorsUris".split(
          " "
        ),
        "image opt_description opt_assetId opt_pyramidingPolicy opt_dimensions opt_region opt_scale opt_crs opt_crsTransform opt_maxPixels".split(
          " "
        ),
        "image opt_description opt_folder opt_fileNamePrefix opt_dimensions opt_region opt_scale opt_crs opt_crsTransform opt_maxPixels opt_shardSize opt_fileDimensions opt_skipEmptyTiles opt_fileFormat opt_formatOptions".split(
          " "
        ),
        "collection opt_description opt_folder opt_fileNamePrefix opt_framesPerSecond opt_dimensions opt_region opt_scale opt_crs opt_crsTransform opt_maxPixels opt_maxFrames".split(
          " "
        ),
        "collection opt_description opt_bucket opt_fileNamePrefix opt_fileFormat opt_selectors".split(
          " "
        ),
        "collection opt_description opt_folder opt_fileNamePrefix opt_fileFormat opt_selectors".split(
          " "
        ),
        ["algorithm", "opt_dropNulls"],
        ["geometry"],
        ["algorithm", "opt_first"],
        ["start", "opt_end"],
        ["max", "opt_property", "opt_ascending"],
        ["filter"],
        ["name", "operator", "value"],
        ["property", "opt_ascending"],
        ["opt_callback"],
        ["legacy"],
        ["func", "var_args"],
        ["callback"],
        ["project", "opt_callback"],
        ["taskId", "request", "opt_callback"],
        ["opt_callback"],
        ["opt_success", "opt_error"],
        ["id", "opt_callback"],
        ["requestedId", "opt_callback"],
        ["privateKey", "opt_success", "opt_error", "opt_extraScopes"],
        ["id", "opt_callback"],
        ["value", "opt_path", "opt_force", "opt_properties", "opt_callback"],
        ["params", "opt_callback"],
        ["path", "opt_force", "opt_callback"],
        ["parent", "params", "opt_callback"],
        ["parent", "params", "opt_callback"],
        ["sourceId", "destinationId", "opt_callback"],
        ["params", "opt_callback"],
        [
          "clientId",
          "success",
          "opt_error",
          "opt_extraScopes",
          "opt_onImmediateFailed",
        ],
        ["id", "x", "y", "z"],
        ["params", "opt_callback"],
        ["sourceId", "destinationId", "opt_overwrite", "opt_callback"],
        ["assetId", "properties", "opt_callback"],
        ["opt_callback"],
        [
          "clientId",
          "success",
          "opt_error",
          "opt_extraScopes",
          "opt_onImmediateFailed",
        ],
        ["taskId", "params", "opt_callback"],
        ["rootId", "opt_callback"],
        ["assetId", "opt_callback"],
        ["opt_limit", "opt_callback"],
        ["id"],
        ["assetId", "opt_callback"],
        ["params", "opt_callback"],
        ["opt_limit", "opt_callback"],
        ["operationName", "opt_callback"],
        ["obj", "opt_callback"],
        ["id"],
        ["params", "opt_callback"],
        ["operationName", "opt_callback"],
        ["opt_count", "opt_callback"],
        ["assetId", "asset", "updateFields", "opt_callback"],
        ["params", "opt_callback"],
        ["taskId", "request", "opt_callback"],
        ["taskId", "opt_callback"],
        ["taskId", "opt_callback"],
        ["id"],
        ["assetId", "aclUpdate", "opt_callback"],
        ["taskId", "action", "opt_callback"],
        ["params", "opt_callback"],
        ["date", "opt_tz"],
        ["json"],
        ["json"],
        ["json"],
        ["json"],
        ["opt_dict"],
        [
          "opt_baseurl",
          "opt_tileurl",
          "opt_successCallback",
          "opt_errorCallback",
          "opt_xsrfToken",
        ],
        ["func", "var_args"],
        [],
        ["func", "namedArgs"],
        [],
        [],
        [],
        ["var_args"],
        ["geometry", "opt_properties"],
        ["opt_visParams", "opt_callback"],
        ["opt_callback"],
        ["propertySelectors", "opt_newProperties", "opt_retainGeometry"],
        ["opt_callback"],
        ["args", "opt_column"],
        ["opt_visParams", "opt_callback"],
        ["opt_format", "opt_selectors", "opt_filename", "opt_callback"],
        ["name", "value"],
        ["name", "value"],
        ["geometry", "opt_errorMargin"],
        ["name", "value"],
        ["opt_filter"],
        ["name", "value"],
        ["name", "value"],
        ["var_args"],
        ["name", "value"],
        ["var_args"],
        ["start", "opt_end"],
        ["opt_leftField", "opt_rightValue", "opt_rightField", "opt_leftValue"],
        [],
        ["name", "operator", "value"],
        ["namedArgs"],
        ["var_args"],
        ["legacy"],
        ["coords", "opt_proj"],
        ["coords", "opt_proj"],
        ["coords", "opt_proj", "opt_geodesic", "opt_maxError"],
        ["geoJson", "opt_proj", "opt_geodesic", "opt_evenOdd"],
        ["coords", "opt_proj", "opt_geodesic", "opt_maxError"],
        ["coords", "opt_proj", "opt_geodesic", "opt_maxError", "opt_evenOdd"],
        [],
        ["coords", "opt_proj", "opt_geodesic", "opt_evenOdd"],
        [],
        ["west", "south", "east", "north"],
        ["coords", "opt_proj", "opt_geodesic", "opt_maxError"],
        ["coords", "opt_proj", "opt_geodesic", "opt_maxError", "opt_evenOdd"],
        ["var_args"],
        ["var_args"],
        ["var_args"],
        ["params", "opt_callback"],
        ["r", "g", "b"],
        ["params", "opt_callback"],
        ["geometry"],
        ["opt_args"],
        ["opt_visParams", "opt_callback"],
        ["expression", "opt_map"],
        ["opt_callback"],
        ["params", "opt_callback"],
        ["args"],
        ["selectors", "opt_names"],
        ["opt_visParams", "opt_callback"],
        [],
        ["opt_callback"],
        ["params", "opt_callback"],
        ["params", "opt_callback"],
        ["list"],
        ["number"],
        ["obj", "opt_isCompound"],
        ["obj"],
        ["obj"],
        ["obj"],
        ["obj"],
        ["obj"],
        ["obj"],
        ["string"],
        [],
      ];
    [
      Q,
      Dm,
      Em,
      jo,
      go,
      eo,
      ko,
      mo,
      bo,
      fo,
      lo,
      ho,
      io,
      W.prototype.map,
      W.prototype.Zg,
      W.prototype.vh,
      W.prototype.ff,
      W.prototype.limit,
      W.prototype.filter,
      W.prototype.gf,
      W.prototype.sort,
      O.prototype.Z,
      O.prototype.X,
      O.prototype.ng,
      O.prototype.evaluate,
      dm,
      Zl,
      em,
      kl,
      $l,
      fm,
      nl,
      $l,
      gm,
      am,
      hm,
      cm,
      bm,
      im,
      sl,
      ml,
      tl,
      Al,
      jm,
      om,
      Il,
      ll,
      Tl,
      pm,
      km,
      Hl,
      Bl,
      lm,
      Cl,
      Jl,
      Ll,
      ul,
      Dl,
      vl,
      Kl,
      El,
      mm,
      wl,
      Xl,
      Nl,
      Gl,
      yl,
      nm,
      Ml,
      xl,
      Do,
      Go,
      Ho,
      Mo,
      Io,
      No,
      Wo,
      ap,
      Zo,
      bp,
      256,
      Yo,
      $o,
      S.prototype.set,
      X,
      X.prototype.getMap,
      X.prototype.Z,
      Y.prototype.select,
      Y.prototype.Z,
      Y,
      Y.prototype.getMap,
      Y.prototype.wb,
      vn,
      rn,
      Bn,
      sn,
      V,
      tn,
      un,
      yn,
      wn,
      xn,
      zn,
      An,
      V.prototype.uc,
      Cn,
      ym.prototype.apply,
      ym.prototype.call,
      U.prototype.X,
      Xm,
      $m,
      gn,
      U,
      en,
      jn,
      U.prototype.qd,
      an,
      U.prototype.ig,
      bn,
      fn,
      hn,
      N.prototype.select,
      Qn,
      N.prototype.Uh,
      N.prototype.wb,
      Pn,
      N.prototype.Jd,
      N.prototype.clip,
      N,
      N.prototype.getMap,
      N.prototype.i,
      N.prototype.Z,
      N.prototype.lf,
      Z,
      Z.prototype.select,
      Z.prototype.getMap,
      Z.prototype.first,
      Z.prototype.Z,
      Z.prototype.nf,
      Z.prototype.kf,
      Rn,
      to,
      Ck,
      Mk,
      Lk,
      Kk,
      Fk,
      Ik,
      Dk,
      wo,
      Qo,
    ].forEach(function (d, e) {
      d && (a[d.toString()] = { name: b[e], paramNames: c[e] });
    });
    r.EXPORTED_FN_INFO = a;
  })();
}.call(this));
