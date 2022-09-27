'use strict';
(self.webpackChunkng_x_rocket = self.webpackChunkng_x_rocket || []).push([
  [179],
  {
    74: () => {
      function te(e) {
        return 'function' == typeof e;
      }
      function Uo(e) {
        const t = e((i) => {
          Error.call(i), (i.stack = new Error().stack);
        });
        return (t.prototype = Object.create(Error.prototype)), (t.prototype.constructor = t), t;
      }
      const Sa = Uo(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((i, r) => `${r + 1}) ${i.toString()}`)
                    .join('\n  ')}`
                : ''),
              (this.name = 'UnsubscriptionError'),
              (this.errors = t);
          }
      );
      function Rr(e, n) {
        if (e) {
          const t = e.indexOf(n);
          0 <= t && e.splice(t, 1);
        }
      }
      class Lt {
        constructor(n) {
          (this.initialTeardown = n), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
        }
        unsubscribe() {
          let n;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t))) for (const o of t) o.remove(this);
              else t.remove(this);
            const { initialTeardown: i } = this;
            if (te(i))
              try {
                i();
              } catch (o) {
                n = o instanceof Sa ? o.errors : [o];
              }
            const { _finalizers: r } = this;
            if (r) {
              this._finalizers = null;
              for (const o of r)
                try {
                  Tg(o);
                } catch (s) {
                  (n = n ?? []), s instanceof Sa ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new Sa(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) Tg(n);
            else {
              if (n instanceof Lt) {
                if (n.closed || n._hasParent(this)) return;
                n._addParent(this);
              }
              (this._finalizers = null !== (t = this._finalizers) && void 0 !== t ? t : []).push(n);
            }
        }
        _hasParent(n) {
          const { _parentage: t } = this;
          return t === n || (Array.isArray(t) && t.includes(n));
        }
        _addParent(n) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
        }
        _removeParent(n) {
          const { _parentage: t } = this;
          t === n ? (this._parentage = null) : Array.isArray(t) && Rr(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && Rr(t, n), n instanceof Lt && n._removeParent(this);
        }
      }
      Lt.EMPTY = (() => {
        const e = new Lt();
        return (e.closed = !0), e;
      })();
      const wg = Lt.EMPTY;
      function Ng(e) {
        return e instanceof Lt || (e && 'closed' in e && te(e.remove) && te(e.add) && te(e.unsubscribe));
      }
      function Tg(e) {
        te(e) ? e() : e.unsubscribe();
      }
      const qi = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Ma = {
          setTimeout(e, n, ...t) {
            const { delegate: i } = Ma;
            return i?.setTimeout ? i.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = Ma;
            return (n?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Eg(e) {
        Ma.setTimeout(() => {
          const { onUnhandledError: n } = qi;
          if (!n) throw e;
          n(e);
        });
      }
      function Pr() {}
      const fT = gu('C', void 0, void 0);
      function gu(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let Qi = null;
      function Oa(e) {
        if (qi.useDeprecatedSynchronousErrorHandling) {
          const n = !Qi;
          if ((n && (Qi = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: i } = Qi;
            if (((Qi = null), t)) throw i;
          }
        } else e();
      }
      class _u extends Lt {
        constructor(n) {
          super(), (this.isStopped = !1), n ? ((this.destination = n), Ng(n) && n.add(this)) : (this.destination = yT);
        }
        static create(n, t, i) {
          return new $o(n, t, i);
        }
        next(n) {
          this.isStopped
            ? vu(
                (function pT(e) {
                  return gu('N', e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? vu(
                (function hT(e) {
                  return gu('E', void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped ? vu(fT, this) : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
        }
        _next(n) {
          this.destination.next(n);
        }
        _error(n) {
          try {
            this.destination.error(n);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const _T = Function.prototype.bind;
      function mu(e, n) {
        return _T.call(e, n);
      }
      class mT {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (i) {
              Ia(i);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (i) {
              Ia(i);
            }
          else Ia(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              Ia(t);
            }
        }
      }
      class $o extends _u {
        constructor(n, t, i) {
          let r;
          if ((super(), te(n) || !n)) r = { next: n ?? void 0, error: t ?? void 0, complete: i ?? void 0 };
          else {
            let o;
            this && qi.useDeprecatedNextContext
              ? ((o = Object.create(n)),
                (o.unsubscribe = () => this.unsubscribe()),
                (r = {
                  next: n.next && mu(n.next, o),
                  error: n.error && mu(n.error, o),
                  complete: n.complete && mu(n.complete, o),
                }))
              : (r = n);
          }
          this.destination = new mT(r);
        }
      }
      function Ia(e) {
        qi.useDeprecatedSynchronousErrorHandling
          ? (function gT(e) {
              qi.useDeprecatedSynchronousErrorHandling && Qi && ((Qi.errorThrown = !0), (Qi.error = e));
            })(e)
          : Eg(e);
      }
      function vu(e, n) {
        const { onStoppedNotification: t } = qi;
        t && Ma.setTimeout(() => t(e, n));
      }
      const yT = {
          closed: !0,
          next: Pr,
          error: function vT(e) {
            throw e;
          },
          complete: Pr,
        },
        yu = ('function' == typeof Symbol && Symbol.observable) || '@@observable';
      function Zn(e) {
        return e;
      }
      function Sg(e) {
        return 0 === e.length
          ? Zn
          : 1 === e.length
          ? e[0]
          : function (t) {
              return e.reduce((i, r) => r(i), t);
            };
      }
      let he = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const i = new e();
            return (i.source = this), (i.operator = t), i;
          }
          subscribe(t, i, r) {
            const o = (function CT(e) {
              return (
                (e && e instanceof _u) ||
                ((function DT(e) {
                  return e && te(e.next) && te(e.error) && te(e.complete);
                })(e) &&
                  Ng(e))
              );
            })(t)
              ? t
              : new $o(t, i, r);
            return (
              Oa(() => {
                const { operator: s, source: a } = this;
                o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
              }),
              o
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (i) {
              t.error(i);
            }
          }
          forEach(t, i) {
            return new (i = Mg(i))((r, o) => {
              const s = new $o({
                next: (a) => {
                  try {
                    t(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: r,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var i;
            return null === (i = this.source) || void 0 === i ? void 0 : i.subscribe(t);
          }
          [yu]() {
            return this;
          }
          pipe(...t) {
            return Sg(t)(this);
          }
          toPromise(t) {
            return new (t = Mg(t))((i, r) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => r(s),
                () => i(o)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function Mg(e) {
        var n;
        return null !== (n = e ?? qi.Promise) && void 0 !== n ? n : Promise;
      }
      const wT = Uo(
        (e) =>
          function () {
            e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
          }
      );
      let pe = (() => {
        class e extends he {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const i = new Og(this, this);
            return (i.operator = t), i;
          }
          _throwIfClosed() {
            if (this.closed) throw new wT();
          }
          next(t) {
            Oa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers || (this.currentObservers = Array.from(this.observers));
                for (const i of this.currentObservers) i.next(t);
              }
            });
          }
          error(t) {
            Oa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: i } = this;
                for (; i.length; ) i.shift().error(t);
              }
            });
          }
          complete() {
            Oa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (null === (t = this.observers) || void 0 === t ? void 0 : t.length) > 0;
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
          }
          _innerSubscribe(t) {
            const { hasError: i, isStopped: r, observers: o } = this;
            return i || r
              ? wg
              : ((this.currentObservers = null),
                o.push(t),
                new Lt(() => {
                  (this.currentObservers = null), Rr(o, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: i, thrownError: r, isStopped: o } = this;
            i ? t.error(r) : o && t.complete();
          }
          asObservable() {
            const t = new he();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new Og(n, t)), e;
      })();
      class Og extends pe {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, i;
          null === (i = null === (t = this.destination) || void 0 === t ? void 0 : t.next) ||
            void 0 === i ||
            i.call(t, n);
        }
        error(n) {
          var t, i;
          null === (i = null === (t = this.destination) || void 0 === t ? void 0 : t.error) ||
            void 0 === i ||
            i.call(t, n);
        }
        complete() {
          var n, t;
          null === (t = null === (n = this.destination) || void 0 === n ? void 0 : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, i;
          return null !== (i = null === (t = this.source) || void 0 === t ? void 0 : t.subscribe(n)) && void 0 !== i
            ? i
            : wg;
        }
      }
      function Ig(e) {
        return te(e?.lift);
      }
      function Ae(e) {
        return (n) => {
          if (Ig(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (i) {
                this.error(i);
              }
            });
          throw new TypeError('Unable to lift unknown Observable type');
        };
      }
      function Ce(e, n, t, i, r) {
        return new NT(e, n, t, i, r);
      }
      class NT extends _u {
        constructor(n, t, i, r, o, s) {
          super(n),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (l) {
                    n.error(l);
                  }
                }
              : super._next),
            (this._error = r
              ? function (a) {
                  try {
                    r(a);
                  } catch (l) {
                    n.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = i
              ? function () {
                  try {
                    i();
                  } catch (a) {
                    n.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var n;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(), !t && (null === (n = this.onFinalize) || void 0 === n || n.call(this));
          }
        }
      }
      function L(e, n) {
        return Ae((t, i) => {
          let r = 0;
          t.subscribe(
            Ce(i, (o) => {
              i.next(e.call(n, o, r++));
            })
          );
        });
      }
      function Rg(e, n, t, i) {
        var s,
          r = arguments.length,
          o = r < 3 ? n : null === i ? (i = Object.getOwnPropertyDescriptor(n, t)) : i;
        if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) o = Reflect.decorate(e, n, t, i);
        else
          for (var a = e.length - 1; a >= 0; a--)
            (s = e[a]) && (o = (r < 3 ? s(o) : r > 3 ? s(n, t, o) : s(n, t)) || o);
        return r > 3 && o && Object.defineProperty(n, t, o), o;
      }
      function Xi(e) {
        return this instanceof Xi ? ((this.v = e), this) : new Xi(e);
      }
      function ST(e, n, t) {
        if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
        var r,
          i = t.apply(e, n || []),
          o = [];
        return (
          (r = {}),
          s('next'),
          s('throw'),
          s('return'),
          (r[Symbol.asyncIterator] = function () {
            return this;
          }),
          r
        );
        function s(f) {
          i[f] &&
            (r[f] = function (h) {
              return new Promise(function (p, g) {
                o.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function l(f) {
              f.value instanceof Xi ? Promise.resolve(f.value.v).then(c, u) : d(o[0][2], f);
            })(i[f](h));
          } catch (p) {
            d(o[0][3], p);
          }
        }
        function c(f) {
          a('next', f);
        }
        function u(f) {
          a('throw', f);
        }
        function d(f, h) {
          f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      }
      function MT(e) {
        if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function xg(e) {
              var n = 'function' == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                i = 0;
              if (t) return t.call(e);
              if (e && 'number' == typeof e.length)
                return {
                  next: function () {
                    return e && i >= e.length && (e = void 0), { value: e && e[i++], done: !e };
                  },
                };
              throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
            })(e)),
            (t = {}),
            i('next'),
            i('throw'),
            i('return'),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function i(o) {
          t[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function r(o, s, a, l) {
                  Promise.resolve(l).then(function (c) {
                    o({ value: c, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const Du = (e) => e && 'number' == typeof e.length && 'function' != typeof e;
      function Fg(e) {
        return te(e?.then);
      }
      function kg(e) {
        return te(e[yu]);
      }
      function Lg(e) {
        return Symbol.asyncIterator && te(e?.[Symbol.asyncIterator]);
      }
      function Vg(e) {
        return new TypeError(
          `You provided ${
            null !== e && 'object' == typeof e ? 'an invalid object' : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Bg = (function IT() {
        return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
      })();
      function jg(e) {
        return te(e?.[Bg]);
      }
      function Hg(e) {
        return ST(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: i, done: r } = yield Xi(t.read());
              if (r) return yield Xi(void 0);
              yield yield Xi(i);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function Gg(e) {
        return te(e?.getReader);
      }
      function ut(e) {
        if (e instanceof he) return e;
        if (null != e) {
          if (kg(e))
            return (function AT(e) {
              return new he((n) => {
                const t = e[yu]();
                if (te(t.subscribe)) return t.subscribe(n);
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
              });
            })(e);
          if (Du(e))
            return (function RT(e) {
              return new he((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (Fg(e))
            return (function PT(e) {
              return new he((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, Eg);
              });
            })(e);
          if (Lg(e)) return Ug(e);
          if (jg(e))
            return (function xT(e) {
              return new he((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (Gg(e))
            return (function FT(e) {
              return Ug(Hg(e));
            })(e);
        }
        throw Vg(e);
      }
      function Ug(e) {
        return new he((n) => {
          (function kT(e, n) {
            var t, i, r, o;
            return (function TT(e, n, t, i) {
              return new (t || (t = Promise))(function (o, s) {
                function a(u) {
                  try {
                    c(i.next(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(u) {
                  try {
                    c(i.throw(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(u) {
                  u.done
                    ? o(u.value)
                    : (function r(o) {
                        return o instanceof t
                          ? o
                          : new t(function (s) {
                              s(o);
                            });
                      })(u.value).then(a, l);
                }
                c((i = i.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = MT(e); !(i = yield t.next()).done; ) if ((n.next(i.value), n.closed)) return;
              } catch (s) {
                r = { error: s };
              } finally {
                try {
                  i && !i.done && (o = t.return) && (yield o.call(t));
                } finally {
                  if (r) throw r.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function ei(e, n, t, i = 0, r = !1) {
        const o = n.schedule(function () {
          t(), r ? e.add(this.schedule(null, i)) : this.unsubscribe();
        }, i);
        if ((e.add(o), !r)) return o;
      }
      function Ge(e, n, t = 1 / 0) {
        return te(n)
          ? Ge((i, r) => L((o, s) => n(i, o, r, s))(ut(e(i, r))), t)
          : ('number' == typeof n && (t = n),
            Ae((i, r) =>
              (function LT(e, n, t, i, r, o, s, a) {
                const l = [];
                let c = 0,
                  u = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !c && n.complete();
                  },
                  h = (g) => (c < i ? p(g) : l.push(g)),
                  p = (g) => {
                    o && n.next(g), c++;
                    let m = !1;
                    ut(t(g, u++)).subscribe(
                      Ce(
                        n,
                        (y) => {
                          r?.(y), o ? h(y) : n.next(y);
                        },
                        () => {
                          m = !0;
                        },
                        void 0,
                        () => {
                          if (m)
                            try {
                              for (c--; l.length && c < i; ) {
                                const y = l.shift();
                                s ? ei(n, s, () => p(y)) : p(y);
                              }
                              f();
                            } catch (y) {
                              n.error(y);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Ce(n, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(i, r, e, t)
            ));
      }
      function xr(e = 1 / 0) {
        return Ge(Zn, e);
      }
      const Jt = new he((e) => e.complete());
      function $g(e) {
        return e && te(e.schedule);
      }
      function Cu(e) {
        return e[e.length - 1];
      }
      function Aa(e) {
        return te(Cu(e)) ? e.pop() : void 0;
      }
      function Wo(e) {
        return $g(Cu(e)) ? e.pop() : void 0;
      }
      function Wg(e, n = 0) {
        return Ae((t, i) => {
          t.subscribe(
            Ce(
              i,
              (r) => ei(i, e, () => i.next(r), n),
              () => ei(i, e, () => i.complete(), n),
              (r) => ei(i, e, () => i.error(r), n)
            )
          );
        });
      }
      function zg(e, n = 0) {
        return Ae((t, i) => {
          i.add(e.schedule(() => t.subscribe(i), n));
        });
      }
      function Kg(e, n) {
        if (!e) throw new Error('Iterable cannot be null');
        return new he((t) => {
          ei(t, n, () => {
            const i = e[Symbol.asyncIterator]();
            ei(
              t,
              n,
              () => {
                i.next().then((r) => {
                  r.done ? t.complete() : t.next(r.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Ue(e, n) {
        return n
          ? (function WT(e, n) {
              if (null != e) {
                if (kg(e))
                  return (function jT(e, n) {
                    return ut(e).pipe(zg(n), Wg(n));
                  })(e, n);
                if (Du(e))
                  return (function GT(e, n) {
                    return new he((t) => {
                      let i = 0;
                      return n.schedule(function () {
                        i === e.length ? t.complete() : (t.next(e[i++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (Fg(e))
                  return (function HT(e, n) {
                    return ut(e).pipe(zg(n), Wg(n));
                  })(e, n);
                if (Lg(e)) return Kg(e, n);
                if (jg(e))
                  return (function UT(e, n) {
                    return new he((t) => {
                      let i;
                      return (
                        ei(t, n, () => {
                          (i = e[Bg]()),
                            ei(
                              t,
                              n,
                              () => {
                                let r, o;
                                try {
                                  ({ value: r, done: o } = i.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                o ? t.complete() : t.next(r);
                              },
                              0,
                              !0
                            );
                        }),
                        () => te(i?.return) && i.return()
                      );
                    });
                  })(e, n);
                if (Gg(e))
                  return (function $T(e, n) {
                    return Kg(Hg(e), n);
                  })(e, n);
              }
              throw Vg(e);
            })(e, n)
          : ut(e);
      }
      function Ra(...e) {
        const n = Wo(e),
          t = (function BT(e, n) {
            return 'number' == typeof Cu(e) ? e.pop() : n;
          })(e, 1 / 0),
          i = e;
        return i.length ? (1 === i.length ? ut(i[0]) : xr(t)(Ue(i, n))) : Jt;
      }
      function qg(e = {}) {
        const {
          connector: n = () => new pe(),
          resetOnError: t = !0,
          resetOnComplete: i = !0,
          resetOnRefCountZero: r = !0,
        } = e;
        return (o) => {
          let s,
            a,
            l,
            c = 0,
            u = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = l = void 0), (u = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Ae((g, m) => {
            c++, !d && !u && f();
            const y = (l = l ?? n());
            m.add(() => {
              c--, 0 === c && !d && !u && (a = wu(p, r));
            }),
              y.subscribe(m),
              !s &&
                c > 0 &&
                ((s = new $o({
                  next: (D) => y.next(D),
                  error: (D) => {
                    (d = !0), f(), (a = wu(h, t, D)), y.error(D);
                  },
                  complete: () => {
                    (u = !0), f(), (a = wu(h, i)), y.complete();
                  },
                })),
                ut(g).subscribe(s));
          })(o);
        };
      }
      function wu(e, n, ...t) {
        if (!0 === n) return void e();
        if (!1 === n) return;
        const i = new $o({
          next: () => {
            i.unsubscribe(), e();
          },
        });
        return n(...t).subscribe(i);
      }
      function ve(e) {
        for (let n in e) if (e[n] === ve) return n;
        throw Error('Could not find renamed property on target object.');
      }
      function Nu(e, n) {
        for (const t in n) n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
      }
      function ye(e) {
        if ('string' == typeof e) return e;
        if (Array.isArray(e)) return '[' + e.map(ye).join(', ') + ']';
        if (null == e) return '' + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return '' + n;
        const t = n.indexOf('\n');
        return -1 === t ? n : n.substring(0, t);
      }
      function Tu(e, n) {
        return null == e || '' === e ? (null === n ? '' : n) : null == n || '' === n ? e : e + ' ' + n;
      }
      const zT = ve({ __forward_ref__: ve });
      function ae(e) {
        return (
          (e.__forward_ref__ = ae),
          (e.toString = function () {
            return ye(this());
          }),
          e
        );
      }
      function G(e) {
        return Eu(e) ? e() : e;
      }
      function Eu(e) {
        return 'function' == typeof e && e.hasOwnProperty(zT) && e.__forward_ref__ === ae;
      }
      class S extends Error {
        constructor(n, t) {
          super(
            (function Pa(e, n) {
              return `NG0${Math.abs(e)}${n ? ': ' + n.trim() : ''}`;
            })(n, t)
          ),
            (this.code = n);
        }
      }
      function z(e) {
        return 'string' == typeof e ? e : null == e ? '' : String(e);
      }
      function xa(e, n) {
        throw new S(-201, !1);
      }
      function Gt(e, n) {
        null == e &&
          (function ue(e, n, t, i) {
            throw new Error(`ASSERTION ERROR: ${e}` + (null == i ? '' : ` [Expected=> ${t} ${i} ${n} <=Actual]`));
          })(n, e, null, '!=');
      }
      function M(e) {
        return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
      }
      function $(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Su(e) {
        return Qg(e, Fa) || Qg(e, Yg);
      }
      function Qg(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function Xg(e) {
        return e && (e.hasOwnProperty(Mu) || e.hasOwnProperty(eE)) ? e[Mu] : null;
      }
      const Fa = ve({ ɵprov: ve }),
        Mu = ve({ ɵinj: ve }),
        Yg = ve({ ngInjectableDef: ve }),
        eE = ve({ ngInjectorDef: ve });
      var B = (() => (
        ((B = B || {})[(B.Default = 0)] = 'Default'),
        (B[(B.Host = 1)] = 'Host'),
        (B[(B.Self = 2)] = 'Self'),
        (B[(B.SkipSelf = 4)] = 'SkipSelf'),
        (B[(B.Optional = 8)] = 'Optional'),
        B
      ))();
      let Ou;
      function Zt(e) {
        const n = Ou;
        return (Ou = e), n;
      }
      function Jg(e, n, t) {
        const i = Su(e);
        return i && 'root' == i.providedIn
          ? void 0 === i.value
            ? (i.value = i.factory())
            : i.value
          : t & B.Optional
          ? null
          : void 0 !== n
          ? n
          : void xa(ye(e));
      }
      function Ni(e) {
        return { toString: e }.toString();
      }
      var fn = (() => (((fn = fn || {})[(fn.OnPush = 0)] = 'OnPush'), (fn[(fn.Default = 1)] = 'Default'), fn))(),
        Fn = (() => {
          return (
            ((e = Fn || (Fn = {}))[(e.Emulated = 0)] = 'Emulated'),
            (e[(e.None = 2)] = 'None'),
            (e[(e.ShadowDom = 3)] = 'ShadowDom'),
            Fn
          );
          var e;
        })();
      const ge = (() =>
          (typeof globalThis < 'u' && globalThis) ||
          (typeof global < 'u' && global) ||
          (typeof window < 'u' && window) ||
          (typeof self < 'u' && typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope && self))(),
        Fr = {},
        ce = [],
        ka = ve({ ɵcmp: ve }),
        Iu = ve({ ɵdir: ve }),
        La = ve({ ɵpipe: ve }),
        Zg = ve({ ɵmod: ve }),
        ni = ve({ ɵfac: ve }),
        zo = ve({ __NG_ELEMENT_ID__: ve });
      let nE = 0;
      function yt(e) {
        return Ni(() => {
          const t = !0 === e.standalone,
            i = {},
            r = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: i,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === fn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: t,
              dependencies: (t && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || ce,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Fn.Emulated,
              id: 'c' + nE++,
              styles: e.styles || ce,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            o = e.dependencies,
            s = e.features;
          return (
            (r.inputs = n_(e.inputs, i)),
            (r.outputs = n_(e.outputs)),
            s && s.forEach((a) => a(r)),
            (r.directiveDefs = o ? () => ('function' == typeof o ? o() : o).map(e_).filter(t_) : null),
            (r.pipeDefs = o ? () => ('function' == typeof o ? o() : o).map(Mt).filter(t_) : null),
            r
          );
        });
      }
      function e_(e) {
        return _e(e) || St(e);
      }
      function t_(e) {
        return null !== e;
      }
      function K(e) {
        return Ni(() => ({
          type: e.type,
          bootstrap: e.bootstrap || ce,
          declarations: e.declarations || ce,
          imports: e.imports || ce,
          exports: e.exports || ce,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function n_(e, n) {
        if (null == e) return Fr;
        const t = {};
        for (const i in e)
          if (e.hasOwnProperty(i)) {
            let r = e[i],
              o = r;
            Array.isArray(r) && ((o = r[1]), (r = r[0])), (t[r] = i), n && (n[r] = o);
          }
        return t;
      }
      const I = yt;
      function Et(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function _e(e) {
        return e[ka] || null;
      }
      function St(e) {
        return e[Iu] || null;
      }
      function Mt(e) {
        return e[La] || null;
      }
      function Ut(e, n) {
        const t = e[Zg] || null;
        if (!t && !0 === n) throw new Error(`Type ${ye(e)} does not have '\u0275mod' property.`);
        return t;
      }
      const J = 11;
      function Vt(e) {
        return Array.isArray(e) && 'object' == typeof e[1];
      }
      function pn(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function Pu(e) {
        return 0 != (8 & e.flags);
      }
      function Ha(e) {
        return 2 == (2 & e.flags);
      }
      function Ga(e) {
        return 1 == (1 & e.flags);
      }
      function gn(e) {
        return null !== e.template;
      }
      function lE(e) {
        return 0 != (256 & e[2]);
      }
      function tr(e, n) {
        return e.hasOwnProperty(ni) ? e[ni] : null;
      }
      class dE {
        constructor(n, t, i) {
          (this.previousValue = n), (this.currentValue = t), (this.firstChange = i);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Ot() {
        return o_;
      }
      function o_(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = hE), fE;
      }
      function fE() {
        const e = a_(this),
          n = e?.current;
        if (n) {
          const t = e.previous;
          if (t === Fr) e.previous = n;
          else for (let i in n) t[i] = n[i];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function hE(e, n, t, i) {
        const r =
            a_(e) ||
            (function pE(e, n) {
              return (e[s_] = n);
            })(e, { previous: Fr, current: null }),
          o = r.current || (r.current = {}),
          s = r.previous,
          a = this.declaredInputs[t],
          l = s[a];
        (o[a] = new dE(l && l.currentValue, n, s === Fr)), (e[i] = n);
      }
      Ot.ngInherit = !0;
      const s_ = '__ngSimpleChanges__';
      function a_(e) {
        return e[s_] || null;
      }
      function Ke(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Ua(e, n) {
        return Ke(n[e]);
      }
      function nn(e, n) {
        return Ke(n[e.index]);
      }
      function Vu(e, n) {
        return e.data[n];
      }
      function jr(e, n) {
        return e[n];
      }
      function Wt(e, n) {
        const t = n[e];
        return Vt(t) ? t : t[0];
      }
      function l_(e) {
        return 4 == (4 & e[2]);
      }
      function $a(e) {
        return 64 == (64 & e[2]);
      }
      function Ti(e, n) {
        return null == n ? null : e[n];
      }
      function c_(e) {
        e[18] = 0;
      }
      function Bu(e, n) {
        e[5] += n;
        let t = e,
          i = e[3];
        for (; null !== i && ((1 === n && 1 === t[5]) || (-1 === n && 0 === t[5])); ) (i[5] += n), (t = i), (i = i[3]);
      }
      const W = { lFrame: v_(null), bindingsEnabled: !0 };
      function d_() {
        return W.bindingsEnabled;
      }
      function C() {
        return W.lFrame.lView;
      }
      function ie() {
        return W.lFrame.tView;
      }
      function nt() {
        let e = f_();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function f_() {
        return W.lFrame.currentTNode;
      }
      function kn(e, n) {
        const t = W.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function ju() {
        return W.lFrame.isParent;
      }
      function Hu() {
        W.lFrame.isParent = !1;
      }
      function It() {
        const e = W.lFrame;
        let n = e.bindingRootIndex;
        return -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
      }
      function Hr() {
        return W.lFrame.bindingIndex++;
      }
      function ri(e) {
        const n = W.lFrame,
          t = n.bindingIndex;
        return (n.bindingIndex = n.bindingIndex + e), t;
      }
      function ME(e, n) {
        const t = W.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), Gu(n);
      }
      function Gu(e) {
        W.lFrame.currentDirectiveIndex = e;
      }
      function g_() {
        return W.lFrame.currentQueryIndex;
      }
      function $u(e) {
        W.lFrame.currentQueryIndex = e;
      }
      function IE(e) {
        const n = e[1];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[6] : null;
      }
      function __(e, n, t) {
        if (t & B.SkipSelf) {
          let r = n,
            o = e;
          for (
            ;
            !((r = r.parent), null !== r || t & B.Host || ((r = IE(o)), null === r || ((o = o[15]), 10 & r.type)));

          );
          if (null === r) return !1;
          (n = r), (e = o);
        }
        const i = (W.lFrame = m_());
        return (i.currentTNode = n), (i.lView = e), !0;
      }
      function Wu(e) {
        const n = m_(),
          t = e[1];
        (W.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function m_() {
        const e = W.lFrame,
          n = null === e ? null : e.child;
        return null === n ? v_(e) : n;
      }
      function v_(e) {
        const n = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = n), n;
      }
      function y_() {
        const e = W.lFrame;
        return (W.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
      }
      const b_ = y_;
      function zu() {
        const e = y_();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function At() {
        return W.lFrame.selectedIndex;
      }
      function Ei(e) {
        W.lFrame.selectedIndex = e;
      }
      function Ve() {
        const e = W.lFrame;
        return Vu(e.tView, e.selectedIndex);
      }
      function za(e, n) {
        for (let t = n.directiveStart, i = n.directiveEnd; t < i; t++) {
          const o = e.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: c,
              ngOnDestroy: u,
            } = o;
          s && (e.contentHooks || (e.contentHooks = [])).push(-t, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(t, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(t, a)),
            l && (e.viewHooks || (e.viewHooks = [])).push(-t, l),
            c &&
              ((e.viewHooks || (e.viewHooks = [])).push(t, c),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(t, c)),
            null != u && (e.destroyHooks || (e.destroyHooks = [])).push(t, u);
        }
      }
      function Ka(e, n, t) {
        D_(e, n, 3, t);
      }
      function qa(e, n, t, i) {
        (3 & e[2]) === t && D_(e, n, t, i);
      }
      function Ku(e, n) {
        let t = e[2];
        (3 & t) === n && ((t &= 2047), (t += 1), (e[2] = t));
      }
      function D_(e, n, t, i) {
        const o = i ?? -1,
          s = n.length - 1;
        let a = 0;
        for (let l = void 0 !== i ? 65535 & e[18] : 0; l < s; l++)
          if ('number' == typeof n[l + 1]) {
            if (((a = n[l]), null != i && a >= i)) break;
          } else
            n[l] < 0 && (e[18] += 65536),
              (a < o || -1 == o) && (BE(e, t, n, l), (e[18] = (4294901760 & e[18]) + l + 2)),
              l++;
      }
      function BE(e, n, t, i) {
        const r = t[i] < 0,
          o = t[i + 1],
          a = e[r ? -t[i] : t[i]];
        if (r) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === n) {
            e[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class Yo {
        constructor(n, t, i) {
          (this.factory = n), (this.resolving = !1), (this.canSeeViewProviders = t), (this.injectImpl = i);
        }
      }
      function Qa(e, n, t) {
        let i = 0;
        for (; i < t.length; ) {
          const r = t[i];
          if ('number' == typeof r) {
            if (0 !== r) break;
            i++;
            const o = t[i++],
              s = t[i++],
              a = t[i++];
            e.setAttribute(n, s, a, o);
          } else {
            const o = r,
              s = t[++i];
            w_(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), i++;
          }
        }
        return i;
      }
      function C_(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function w_(e) {
        return 64 === e.charCodeAt(0);
      }
      function Xa(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let i = 0; i < n.length; i++) {
              const r = n[i];
              'number' == typeof r ? (t = r) : 0 === t || N_(e, t, r, null, -1 === t || 2 === t ? n[++i] : null);
            }
          }
        return e;
      }
      function N_(e, n, t, i, r) {
        let o = 0,
          s = e.length;
        if (-1 === n) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ('number' == typeof a) {
              if (a === n) {
                s = -1;
                break;
              }
              if (a > n) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ('number' == typeof a) break;
          if (a === t) {
            if (null === i) return void (null !== r && (e[o + 1] = r));
            if (i === e[o + 1]) return void (e[o + 2] = r);
          }
          o++, null !== i && o++, null !== r && o++;
        }
        -1 !== s && (e.splice(s, 0, n), (o = s + 1)),
          e.splice(o++, 0, t),
          null !== i && e.splice(o++, 0, i),
          null !== r && e.splice(o++, 0, r);
      }
      function T_(e) {
        return -1 !== e;
      }
      function Gr(e) {
        return 32767 & e;
      }
      function Ur(e, n) {
        let t = (function $E(e) {
            return e >> 16;
          })(e),
          i = n;
        for (; t > 0; ) (i = i[15]), t--;
        return i;
      }
      let Qu = !0;
      function Ya(e) {
        const n = Qu;
        return (Qu = e), n;
      }
      let WE = 0;
      const Ln = {};
      function Zo(e, n) {
        const t = Yu(e, n);
        if (-1 !== t) return t;
        const i = n[1];
        i.firstCreatePass && ((e.injectorIndex = n.length), Xu(i.data, e), Xu(n, null), Xu(i.blueprint, null));
        const r = Ja(e, n),
          o = e.injectorIndex;
        if (T_(r)) {
          const s = Gr(r),
            a = Ur(r, n),
            l = a[1].data;
          for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
        }
        return (n[o + 8] = r), o;
      }
      function Xu(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function Yu(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Ja(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
        let t = 0,
          i = null,
          r = n;
        for (; null !== r; ) {
          if (((i = x_(r)), null === i)) return -1;
          if ((t++, (r = r[15]), -1 !== i.injectorIndex)) return i.injectorIndex | (t << 16);
        }
        return -1;
      }
      function Za(e, n, t) {
        !(function zE(e, n, t) {
          let i;
          'string' == typeof t ? (i = t.charCodeAt(0) || 0) : t.hasOwnProperty(zo) && (i = t[zo]),
            null == i && (i = t[zo] = WE++);
          const r = 255 & i;
          n.data[e + (r >> 5)] |= 1 << r;
        })(e, n, t);
      }
      function M_(e, n, t) {
        if (t & B.Optional) return e;
        xa();
      }
      function O_(e, n, t, i) {
        if ((t & B.Optional && void 0 === i && (i = null), 0 == (t & (B.Self | B.Host)))) {
          const r = e[9],
            o = Zt(void 0);
          try {
            return r ? r.get(n, i, t & B.Optional) : Jg(n, i, t & B.Optional);
          } finally {
            Zt(o);
          }
        }
        return M_(i, 0, t);
      }
      function I_(e, n, t, i = B.Default, r) {
        if (null !== e) {
          if (1024 & n[2]) {
            const s = (function YE(e, n, t, i, r) {
              let o = e,
                s = n;
              for (; null !== o && null !== s && 1024 & s[2] && !(256 & s[2]); ) {
                const a = A_(o, s, t, i | B.Self, Ln);
                if (a !== Ln) return a;
                let l = o.parent;
                if (!l) {
                  const c = s[21];
                  if (c) {
                    const u = c.get(t, Ln, i);
                    if (u !== Ln) return u;
                  }
                  (l = x_(s)), (s = s[15]);
                }
                o = l;
              }
              return r;
            })(e, n, t, i, Ln);
            if (s !== Ln) return s;
          }
          const o = A_(e, n, t, i, Ln);
          if (o !== Ln) return o;
        }
        return O_(n, t, i, r);
      }
      function A_(e, n, t, i, r) {
        const o = (function QE(e) {
          if ('string' == typeof e) return e.charCodeAt(0) || 0;
          const n = e.hasOwnProperty(zo) ? e[zo] : void 0;
          return 'number' == typeof n ? (n >= 0 ? 255 & n : XE) : n;
        })(t);
        if ('function' == typeof o) {
          if (!__(n, e, i)) return i & B.Host ? M_(r, 0, i) : O_(n, t, i, r);
          try {
            const s = o(i);
            if (null != s || i & B.Optional) return s;
            xa();
          } finally {
            b_();
          }
        } else if ('number' == typeof o) {
          let s = null,
            a = Yu(e, n),
            l = -1,
            c = i & B.Host ? n[16][6] : null;
          for (
            (-1 === a || i & B.SkipSelf) &&
            ((l = -1 === a ? Ja(e, n) : n[a + 8]),
            -1 !== l && P_(i, !1) ? ((s = n[1]), (a = Gr(l)), (n = Ur(l, n))) : (a = -1));
            -1 !== a;

          ) {
            const u = n[1];
            if (R_(o, a, u.data)) {
              const d = qE(a, n, t, s, i, c);
              if (d !== Ln) return d;
            }
            (l = n[a + 8]),
              -1 !== l && P_(i, n[1].data[a + 8] === c) && R_(o, a, n)
                ? ((s = u), (a = Gr(l)), (n = Ur(l, n)))
                : (a = -1);
          }
        }
        return r;
      }
      function qE(e, n, t, i, r, o) {
        const s = n[1],
          a = s.data[e + 8],
          u = el(a, s, t, null == i ? Ha(a) && Qu : i != s && 0 != (3 & a.type), r & B.Host && o === a);
        return null !== u ? es(n, s, u, a) : Ln;
      }
      function el(e, n, t, i, r) {
        const o = e.providerIndexes,
          s = n.data,
          a = 1048575 & o,
          l = e.directiveStart,
          u = o >> 20,
          f = r ? a + u : e.directiveEnd;
        for (let h = i ? a : a + u; h < f; h++) {
          const p = s[h];
          if ((h < l && t === p) || (h >= l && p.type === t)) return h;
        }
        if (r) {
          const h = s[l];
          if (h && gn(h) && h.type === t) return l;
        }
        return null;
      }
      function es(e, n, t, i) {
        let r = e[t];
        const o = n.data;
        if (
          (function jE(e) {
            return e instanceof Yo;
          })(r)
        ) {
          const s = r;
          s.resolving &&
            (function KT(e, n) {
              const t = n ? `. Dependency path: ${n.join(' > ')} > ${e}` : '';
              throw new S(-200, `Circular dependency in DI detected for ${e}${t}`);
            })(
              (function le(e) {
                return 'function' == typeof e
                  ? e.name || e.toString()
                  : 'object' == typeof e && null != e && 'function' == typeof e.type
                  ? e.type.name || e.type.toString()
                  : z(e);
              })(o[t])
            );
          const a = Ya(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Zt(s.injectImpl) : null;
          __(e, i, B.Default);
          try {
            (r = e[t] = s.factory(void 0, o, e, i)),
              n.firstCreatePass &&
                t >= i.directiveStart &&
                (function VE(e, n, t) {
                  const { ngOnChanges: i, ngOnInit: r, ngDoCheck: o } = n.type.prototype;
                  if (i) {
                    const s = o_(n);
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(e, s),
                      (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(e, s);
                  }
                  r && (t.preOrderHooks || (t.preOrderHooks = [])).push(0 - e, r),
                    o &&
                      ((t.preOrderHooks || (t.preOrderHooks = [])).push(e, o),
                      (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(e, o));
                })(t, o[t], n);
          } finally {
            null !== l && Zt(l), Ya(a), (s.resolving = !1), b_();
          }
        }
        return r;
      }
      function R_(e, n, t) {
        return !!(t[n + (e >> 5)] & (1 << e));
      }
      function P_(e, n) {
        return !(e & B.Self || (e & B.Host && n));
      }
      class $r {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, i) {
          return I_(this._tNode, this._lView, n, i, t);
        }
      }
      function XE() {
        return new $r(nt(), C());
      }
      function qe(e) {
        return Ni(() => {
          const n = e.prototype.constructor,
            t = n[ni] || Ju(n),
            i = Object.prototype;
          let r = Object.getPrototypeOf(e.prototype).constructor;
          for (; r && r !== i; ) {
            const o = r[ni] || Ju(r);
            if (o && o !== t) return o;
            r = Object.getPrototypeOf(r);
          }
          return (o) => new o();
        });
      }
      function Ju(e) {
        return Eu(e)
          ? () => {
              const n = Ju(G(e));
              return n && n();
            }
          : tr(e);
      }
      function x_(e) {
        const n = e[1],
          t = n.type;
        return 2 === t ? n.declTNode : 1 === t ? e[6] : null;
      }
      const zr = '__parameters__';
      function qr(e, n, t) {
        return Ni(() => {
          const i = (function Zu(e) {
            return function (...t) {
              if (e) {
                const i = e(...t);
                for (const r in i) this[r] = i[r];
              }
            };
          })(n);
          function r(...o) {
            if (this instanceof r) return i.apply(this, o), this;
            const s = new r(...o);
            return (a.annotation = s), a;
            function a(l, c, u) {
              const d = l.hasOwnProperty(zr) ? l[zr] : Object.defineProperty(l, zr, { value: [] })[zr];
              for (; d.length <= u; ) d.push(null);
              return (d[u] = d[u] || []).push(s), l;
            }
          }
          return (
            t && (r.prototype = Object.create(t.prototype)), (r.prototype.ngMetadataName = e), (r.annotationCls = r), r
          );
        });
      }
      class k {
        constructor(n, t) {
          (this._desc = n),
            (this.ngMetadataName = 'InjectionToken'),
            (this.ɵprov = void 0),
            'number' == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = M({ token: this, providedIn: t.providedIn || 'root', factory: t.factory }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function zt(e, n) {
        void 0 === n && (n = e);
        for (let t = 0; t < e.length; t++) {
          let i = e[t];
          Array.isArray(i) ? (n === e && (n = e.slice(0, t)), zt(i, n)) : n !== e && n.push(i);
        }
        return n;
      }
      function oi(e, n) {
        e.forEach((t) => (Array.isArray(t) ? oi(t, n) : n(t)));
      }
      function k_(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function tl(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function is(e, n) {
        const t = [];
        for (let i = 0; i < e; i++) t.push(n);
        return t;
      }
      function Kt(e, n, t) {
        let i = Qr(e, n);
        return (
          i >= 0
            ? (e[1 | i] = t)
            : ((i = ~i),
              (function tS(e, n, t, i) {
                let r = e.length;
                if (r == n) e.push(t, i);
                else if (1 === r) e.push(i, e[0]), (e[0] = t);
                else {
                  for (r--, e.push(e[r - 1], e[r]); r > n; ) (e[r] = e[r - 2]), r--;
                  (e[n] = t), (e[n + 1] = i);
                }
              })(e, i, n, t)),
          i
        );
      }
      function td(e, n) {
        const t = Qr(e, n);
        if (t >= 0) return e[1 | t];
      }
      function Qr(e, n) {
        return (function B_(e, n, t) {
          let i = 0,
            r = e.length >> t;
          for (; r !== i; ) {
            const o = i + ((r - i) >> 1),
              s = e[o << t];
            if (n === s) return o << t;
            s > n ? (r = o) : (i = o + 1);
          }
          return ~(r << t);
        })(e, n, 1);
      }
      const rs = {},
        id = '__NG_DI_FLAG__',
        il = 'ngTempTokenPath',
        cS = /\n/gm,
        j_ = '__source';
      let os;
      function Xr(e) {
        const n = os;
        return (os = e), n;
      }
      function dS(e, n = B.Default) {
        if (void 0 === os) throw new S(-203, !1);
        return null === os ? Jg(e, void 0, n) : os.get(e, n & B.Optional ? null : void 0, n);
      }
      function N(e, n = B.Default) {
        return (
          (function tE() {
            return Ou;
          })() || dS
        )(G(e), n);
      }
      function $e(e, n = B.Default) {
        return (
          'number' != typeof n && (n = 0 | (n.optional && 8) | (n.host && 1) | (n.self && 2) | (n.skipSelf && 4)),
          N(e, n)
        );
      }
      function rd(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const i = G(e[t]);
          if (Array.isArray(i)) {
            if (0 === i.length) throw new S(900, !1);
            let r,
              o = B.Default;
            for (let s = 0; s < i.length; s++) {
              const a = i[s],
                l = fS(a);
              'number' == typeof l ? (-1 === l ? (r = a.token) : (o |= l)) : (r = a);
            }
            n.push(N(r, o));
          } else n.push(N(i));
        }
        return n;
      }
      function ss(e, n) {
        return (e[id] = n), (e.prototype[id] = n), e;
      }
      function fS(e) {
        return e[id];
      }
      const as = ss(qr('Optional'), 8),
        ls = ss(qr('SkipSelf'), 4);
      let sd, sl, al;
      function Jr(e) {
        return (
          (function ad() {
            if (void 0 === sl && ((sl = null), ge.trustedTypes))
              try {
                sl = ge.trustedTypes.createPolicy('angular', {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return sl;
          })()?.createHTML(e) || e
        );
      }
      function X_(e) {
        return (
          (function ld() {
            if (void 0 === al && ((al = null), ge.trustedTypes))
              try {
                al = ge.trustedTypes.createPolicy('angular#unsafe-bypass', {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return al;
          })()?.createHTML(e) || e
        );
      }
      class Z_ {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function Mi(e) {
        return e instanceof Z_ ? e.changingThisBreaksApplicationSecurity : e;
      }
      class PS {
        constructor(n) {
          this.inertDocumentHelper = n;
        }
        getInertBodyElement(n) {
          n = '<body><remove></remove>' + n;
          try {
            const t = new window.DOMParser().parseFromString(Jr(n), 'text/html').body;
            return null === t ? this.inertDocumentHelper.getInertBodyElement(n) : (t.removeChild(t.firstChild), t);
          } catch {
            return null;
          }
        }
      }
      class xS {
        constructor(n) {
          if (
            ((this.defaultDoc = n),
            (this.inertDocument = this.defaultDoc.implementation.createHTMLDocument('sanitization-inert')),
            null == this.inertDocument.body)
          ) {
            const t = this.inertDocument.createElement('html');
            this.inertDocument.appendChild(t);
            const i = this.inertDocument.createElement('body');
            t.appendChild(i);
          }
        }
        getInertBodyElement(n) {
          const t = this.inertDocument.createElement('template');
          if ('content' in t) return (t.innerHTML = Jr(n)), t;
          const i = this.inertDocument.createElement('body');
          return (i.innerHTML = Jr(n)), this.defaultDoc.documentMode && this.stripCustomNsAttrs(i), i;
        }
        stripCustomNsAttrs(n) {
          const t = n.attributes;
          for (let r = t.length - 1; 0 < r; r--) {
            const s = t.item(r).name;
            ('xmlns:ns1' === s || 0 === s.indexOf('ns1:')) && n.removeAttribute(s);
          }
          let i = n.firstChild;
          for (; i; ) i.nodeType === Node.ELEMENT_NODE && this.stripCustomNsAttrs(i), (i = i.nextSibling);
        }
      }
      const kS = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        LS =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      function ll(e) {
        return (e = String(e)).match(kS) || e.match(LS) ? e : 'unsafe:' + e;
      }
      function Vn(e) {
        const n = {};
        for (const t of e.split(',')) n[t] = !0;
        return n;
      }
      function fs(...e) {
        const n = {};
        for (const t of e) for (const i in t) t.hasOwnProperty(i) && (n[i] = !0);
        return n;
      }
      const nm = Vn('area,br,col,hr,img,wbr'),
        im = Vn('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
        rm = Vn('rp,rt'),
        cd = fs(
          nm,
          fs(
            im,
            Vn(
              'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'
            )
          ),
          fs(
            rm,
            Vn(
              'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'
            )
          ),
          fs(rm, im)
        ),
        ud = Vn('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
        dd = Vn('srcset'),
        om = fs(
          ud,
          dd,
          Vn(
            'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width'
          ),
          Vn(
            'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext'
          )
        ),
        VS = Vn('script,style,template');
      class BS {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(n) {
          let t = n.firstChild,
            i = !0;
          for (; t; )
            if (
              (t.nodeType === Node.ELEMENT_NODE
                ? (i = this.startElement(t))
                : t.nodeType === Node.TEXT_NODE
                ? this.chars(t.nodeValue)
                : (this.sanitizedSomething = !0),
              i && t.firstChild)
            )
              t = t.firstChild;
            else
              for (; t; ) {
                t.nodeType === Node.ELEMENT_NODE && this.endElement(t);
                let r = this.checkClobberedElement(t, t.nextSibling);
                if (r) {
                  t = r;
                  break;
                }
                t = this.checkClobberedElement(t, t.parentNode);
              }
          return this.buf.join('');
        }
        startElement(n) {
          const t = n.nodeName.toLowerCase();
          if (!cd.hasOwnProperty(t)) return (this.sanitizedSomething = !0), !VS.hasOwnProperty(t);
          this.buf.push('<'), this.buf.push(t);
          const i = n.attributes;
          for (let r = 0; r < i.length; r++) {
            const o = i.item(r),
              s = o.name,
              a = s.toLowerCase();
            if (!om.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = o.value;
            ud[a] && (l = ll(l)),
              dd[a] &&
                ((e = l),
                (l = (e = String(e))
                  .split(',')
                  .map((n) => ll(n.trim()))
                  .join(', '))),
              this.buf.push(' ', s, '="', sm(l), '"');
          }
          var e;
          return this.buf.push('>'), !0;
        }
        endElement(n) {
          const t = n.nodeName.toLowerCase();
          cd.hasOwnProperty(t) && !nm.hasOwnProperty(t) && (this.buf.push('</'), this.buf.push(t), this.buf.push('>'));
        }
        chars(n) {
          this.buf.push(sm(n));
        }
        checkClobberedElement(n, t) {
          if (
            t &&
            (n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(`Failed to sanitize html because the element is clobbered: ${n.outerHTML}`);
          return t;
        }
      }
      const jS = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        HS = /([^\#-~ |!])/g;
      function sm(e) {
        return e
          .replace(/&/g, '&amp;')
          .replace(jS, function (n) {
            return '&#' + (1024 * (n.charCodeAt(0) - 55296) + (n.charCodeAt(1) - 56320) + 65536) + ';';
          })
          .replace(HS, function (n) {
            return '&#' + n.charCodeAt(0) + ';';
          })
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
      let cl;
      function fd(e) {
        return 'content' in e &&
          (function US(e) {
            return e.nodeType === Node.ELEMENT_NODE && 'TEMPLATE' === e.nodeName;
          })(e)
          ? e.content
          : null;
      }
      var Qe = (() => (
        ((Qe = Qe || {})[(Qe.NONE = 0)] = 'NONE'),
        (Qe[(Qe.HTML = 1)] = 'HTML'),
        (Qe[(Qe.STYLE = 2)] = 'STYLE'),
        (Qe[(Qe.SCRIPT = 3)] = 'SCRIPT'),
        (Qe[(Qe.URL = 4)] = 'URL'),
        (Qe[(Qe.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
        Qe
      ))();
      function am(e) {
        const n = (function hs() {
          const e = C();
          return e && e[12];
        })();
        return n
          ? X_(n.sanitize(Qe.HTML, e) || '')
          : (function ds(e, n) {
              const t = (function RS(e) {
                return (e instanceof Z_ && e.getTypeName()) || null;
              })(e);
              if (null != t && t !== n) {
                if ('ResourceURL' === t && 'URL' === n) return !0;
                throw new Error(`Required a safe ${n}, got a ${t} (see https://g.co/ng/security#xss)`);
              }
              return t === n;
            })(e, 'HTML')
          ? X_(Mi(e))
          : (function GS(e, n) {
              let t = null;
              try {
                cl =
                  cl ||
                  (function em(e) {
                    const n = new xS(e);
                    return (function FS() {
                      try {
                        return !!new window.DOMParser().parseFromString(Jr(''), 'text/html');
                      } catch {
                        return !1;
                      }
                    })()
                      ? new PS(n)
                      : n;
                  })(e);
                let i = n ? String(n) : '';
                t = cl.getInertBodyElement(i);
                let r = 5,
                  o = i;
                do {
                  if (0 === r) throw new Error('Failed to sanitize html because the input is unstable');
                  r--, (i = o), (o = t.innerHTML), (t = cl.getInertBodyElement(i));
                } while (i !== o);
                return Jr(new BS().sanitizeChildren(fd(t) || t));
              } finally {
                if (t) {
                  const i = fd(t) || t;
                  for (; i.firstChild; ) i.removeChild(i.firstChild);
                }
              }
            })(
              (function Q_() {
                return void 0 !== sd ? sd : typeof document < 'u' ? document : void 0;
              })(),
              z(e)
            );
      }
      const pd = new k('ENVIRONMENT_INITIALIZER'),
        cm = new k('INJECTOR', -1),
        um = new k('INJECTOR_DEF_TYPES');
      class dm {
        get(n, t = rs) {
          if (t === rs) {
            const i = new Error(`NullInjectorError: No provider for ${ye(n)}!`);
            throw ((i.name = 'NullInjectorError'), i);
          }
          return t;
        }
      }
      function XS(...e) {
        return { ɵproviders: fm(0, e) };
      }
      function fm(e, ...n) {
        const t = [],
          i = new Set();
        let r;
        return (
          oi(n, (o) => {
            const s = o;
            gd(s, t, [], i) && (r || (r = []), r.push(s));
          }),
          void 0 !== r && hm(r, t),
          t
        );
      }
      function hm(e, n) {
        for (let t = 0; t < e.length; t++) {
          const { providers: r } = e[t];
          oi(r, (o) => {
            n.push(o);
          });
        }
      }
      function gd(e, n, t, i) {
        if (!(e = G(e))) return !1;
        let r = null,
          o = Xg(e);
        const s = !o && _e(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          r = e;
        } else {
          const l = e.ngModule;
          if (((o = Xg(l)), !o)) return !1;
          r = l;
        }
        const a = i.has(r);
        if (s) {
          if (a) return !1;
          if ((i.add(r), s.dependencies)) {
            const l = 'function' == typeof s.dependencies ? s.dependencies() : s.dependencies;
            for (const c of l) gd(c, n, t, i);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let c;
              i.add(r);
              try {
                oi(o.imports, (u) => {
                  gd(u, n, t, i) && (c || (c = []), c.push(u));
                });
              } finally {
              }
              void 0 !== c && hm(c, n);
            }
            if (!a) {
              const c = tr(r) || (() => new r());
              n.push(
                { provide: r, useFactory: c, deps: ce },
                { provide: um, useValue: r, multi: !0 },
                { provide: pd, useValue: () => N(r), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              oi(l, (u) => {
                n.push(u);
              });
          }
        }
        return r !== e && void 0 !== e.providers;
      }
      const YS = ve({ provide: String, useValue: ve });
      function _d(e) {
        return null !== e && 'object' == typeof e && YS in e;
      }
      function ir(e) {
        return 'function' == typeof e;
      }
      const md = new k('Set Injector scope.'),
        ul = {},
        ZS = {};
      let vd;
      function dl() {
        return void 0 === vd && (vd = new dm()), vd;
      }
      class Oi {}
      class _m extends Oi {
        constructor(n, t, i, r) {
          super(),
            (this.parent = t),
            (this.source = i),
            (this.scopes = r),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            bd(n, (s) => this.processProvider(s)),
            this.records.set(cm, Zr(void 0, this)),
            r.has('environment') && this.records.set(Oi, Zr(void 0, this));
          const o = this.records.get(md);
          null != o && 'string' == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(um.multi, ce, B.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            for (const n of this._onDestroyHooks) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(n) {
          this._onDestroyHooks.push(n);
        }
        runInContext(n) {
          this.assertNotDestroyed();
          const t = Xr(this),
            i = Zt(void 0);
          try {
            return n();
          } finally {
            Xr(t), Zt(i);
          }
        }
        get(n, t = rs, i = B.Default) {
          this.assertNotDestroyed();
          const r = Xr(this),
            o = Zt(void 0);
          try {
            if (!(i & B.SkipSelf)) {
              let a = this.records.get(n);
              if (void 0 === a) {
                const l =
                  (function rM(e) {
                    return 'function' == typeof e || ('object' == typeof e && e instanceof k);
                  })(n) && Su(n);
                (a = l && this.injectableDefInScope(l) ? Zr(yd(n), ul) : null), this.records.set(n, a);
              }
              if (null != a) return this.hydrate(n, a);
            }
            return (i & B.Self ? dl() : this.parent).get(n, (t = i & B.Optional && t === rs ? null : t));
          } catch (s) {
            if ('NullInjectorError' === s.name) {
              if (((s[il] = s[il] || []).unshift(ye(n)), r)) throw s;
              return (function hS(e, n, t, i) {
                const r = e[il];
                throw (
                  (n[j_] && r.unshift(n[j_]),
                  (e.message = (function pS(e, n, t, i = null) {
                    e = e && '\n' === e.charAt(0) && '\u0275' == e.charAt(1) ? e.slice(2) : e;
                    let r = ye(n);
                    if (Array.isArray(n)) r = n.map(ye).join(' -> ');
                    else if ('object' == typeof n) {
                      let o = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          o.push(s + ':' + ('string' == typeof a ? JSON.stringify(a) : ye(a)));
                        }
                      r = `{${o.join(', ')}}`;
                    }
                    return `${t}${i ? '(' + i + ')' : ''}[${r}]: ${e.replace(cS, '\n  ')}`;
                  })('\n' + e.message, r, t, i)),
                  (e.ngTokenPath = r),
                  (e[il] = null),
                  e)
                );
              })(s, n, 'R3InjectorError', this.source);
            }
            throw s;
          } finally {
            Zt(o), Xr(r);
          }
        }
        resolveInjectorInitializers() {
          const n = Xr(this),
            t = Zt(void 0);
          try {
            const i = this.get(pd.multi, ce, B.Self);
            for (const r of i) r();
          } finally {
            Xr(n), Zt(t);
          }
        }
        toString() {
          const n = [],
            t = this.records;
          for (const i of t.keys()) n.push(ye(i));
          return `R3Injector[${n.join(', ')}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new S(205, !1);
        }
        processProvider(n) {
          let t = ir((n = G(n))) ? n : G(n && n.provide);
          const i = (function tM(e) {
            return _d(e) ? Zr(void 0, e.useValue) : Zr(mm(e), ul);
          })(n);
          if (ir(n) || !0 !== n.multi) this.records.get(t);
          else {
            let r = this.records.get(t);
            r || ((r = Zr(void 0, ul, !0)), (r.factory = () => rd(r.multi)), this.records.set(t, r)),
              (t = n),
              r.multi.push(n);
          }
          this.records.set(t, i);
        }
        hydrate(n, t) {
          return (
            t.value === ul && ((t.value = ZS), (t.value = t.factory())),
            'object' == typeof t.value &&
              t.value &&
              (function iM(e) {
                return null !== e && 'object' == typeof e && 'function' == typeof e.ngOnDestroy;
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = G(n.providedIn);
          return 'string' == typeof t ? 'any' === t || this.scopes.has(t) : this.injectorDefTypes.has(t);
        }
      }
      function yd(e) {
        const n = Su(e),
          t = null !== n ? n.factory : tr(e);
        if (null !== t) return t;
        if (e instanceof k) throw new S(204, !1);
        if (e instanceof Function)
          return (function eM(e) {
            const n = e.length;
            if (n > 0) throw (is(n, '?'), new S(204, !1));
            const t = (function JT(e) {
              const n = e && (e[Fa] || e[Yg]);
              if (n) {
                const t = (function ZT(e) {
                  if (e.hasOwnProperty('name')) return e.name;
                  const n = ('' + e).match(/^function\s*([^\s(]+)/);
                  return null === n ? '' : n[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${t}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${t}" class.`
                  ),
                  n
                );
              }
              return null;
            })(e);
            return null !== t ? () => t.factory(e) : () => new e();
          })(e);
        throw new S(204, !1);
      }
      function mm(e, n, t) {
        let i;
        if (ir(e)) {
          const r = G(e);
          return tr(r) || yd(r);
        }
        if (_d(e)) i = () => G(e.useValue);
        else if (
          (function gm(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          i = () => e.useFactory(...rd(e.deps || []));
        else if (
          (function pm(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          i = () => N(G(e.useExisting));
        else {
          const r = G(e && (e.useClass || e.provide));
          if (
            !(function nM(e) {
              return !!e.deps;
            })(e)
          )
            return tr(r) || yd(r);
          i = () => new r(...rd(e.deps));
        }
        return i;
      }
      function Zr(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function oM(e) {
        return !!e.ɵproviders;
      }
      function bd(e, n) {
        for (const t of e) Array.isArray(t) ? bd(t, n) : oM(t) ? bd(t.ɵproviders, n) : n(t);
      }
      class vm {}
      class lM {
        resolveComponentFactory(n) {
          throw (function aM(e) {
            const n = Error(`No component factory found for ${ye(e)}. Did you add it to @NgModule.entryComponents?`);
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let ps = (() => {
        class e {}
        return (e.NULL = new lM()), e;
      })();
      function cM() {
        return eo(nt(), C());
      }
      function eo(e, n) {
        return new Ne(nn(e, n));
      }
      let Ne = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
        }
        return (e.__NG_ELEMENT_ID__ = cM), e;
      })();
      function uM(e) {
        return e instanceof Ne ? e.nativeElement : e;
      }
      class Dd {}
      let vn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function dM() {
                const e = C(),
                  t = Wt(nt().index, e);
                return (Vt(t) ? t : e)[J];
              })()),
            e
          );
        })(),
        fM = (() => {
          class e {}
          return (e.ɵprov = M({ token: e, providedIn: 'root', factory: () => null })), e;
        })();
      class gs {
        constructor(n) {
          (this.full = n),
            (this.major = n.split('.')[0]),
            (this.minor = n.split('.')[1]),
            (this.patch = n.split('.').slice(2).join('.'));
        }
      }
      const hM = new gs('14.1.3'),
        Cd = {};
      function Sd(e) {
        return e.ngOriginalError;
      }
      class to {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n);
          this._console.error('ERROR', n), t && this._console.error('ORIGINAL ERROR', t);
        }
        _findOriginalError(n) {
          let t = n && Sd(n);
          for (; t && Sd(t); ) t = Sd(t);
          return t || null;
        }
      }
      const Md = new Map();
      let TM = 0;
      const Id = '__ngContext__';
      function wt(e, n) {
        Vt(n)
          ? ((e[Id] = n[20]),
            (function SM(e) {
              Md.set(e[20], e);
            })(n))
          : (e[Id] = n);
      }
      function _s(e) {
        const n = e[Id];
        return 'number' == typeof n
          ? (function Tm(e) {
              return Md.get(e) || null;
            })(n)
          : n || null;
      }
      function Ad(e) {
        const n = _s(e);
        return n ? (Vt(n) ? n : n.lView) : null;
      }
      const kM = (() => ((typeof requestAnimationFrame < 'u' && requestAnimationFrame) || setTimeout).bind(ge))();
      function si(e) {
        return e instanceof Function ? e() : e;
      }
      var Bt = (() => (
        ((Bt = Bt || {})[(Bt.Important = 1)] = 'Important'), (Bt[(Bt.DashCase = 2)] = 'DashCase'), Bt
      ))();
      function Pd(e, n) {
        return undefined(e, n);
      }
      function ms(e) {
        const n = e[3];
        return pn(n) ? n[3] : n;
      }
      function xd(e) {
        return Pm(e[13]);
      }
      function Fd(e) {
        return Pm(e[4]);
      }
      function Pm(e) {
        for (; null !== e && !pn(e); ) e = e[4];
        return e;
      }
      function io(e, n, t, i, r) {
        if (null != i) {
          let o,
            s = !1;
          pn(i) ? (o = i) : Vt(i) && ((s = !0), (i = i[0]));
          const a = Ke(i);
          0 === e && null !== t
            ? null == r
              ? Bm(n, t, a)
              : rr(n, t, a, r || null, !0)
            : 1 === e && null !== t
            ? rr(n, t, a, r || null, !0)
            : 2 === e
            ? (function zm(e, n, t) {
                const i = fl(e, n);
                i &&
                  (function eO(e, n, t, i) {
                    e.removeChild(n, t, i);
                  })(e, i, n, t);
              })(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != o &&
              (function iO(e, n, t, i, r) {
                const o = t[7];
                o !== Ke(t) && io(n, e, i, o, r);
                for (let a = 10; a < t.length; a++) {
                  const l = t[a];
                  vs(l[1], l, e, n, i, o);
                }
              })(n, e, o, t, r);
        }
      }
      function Ld(e, n, t) {
        return e.createElement(n, t);
      }
      function Fm(e, n) {
        const t = e[9],
          i = t.indexOf(n),
          r = n[3];
        512 & n[2] && ((n[2] &= -513), Bu(r, -1)), t.splice(i, 1);
      }
      function Vd(e, n) {
        if (e.length <= 10) return;
        const t = 10 + n,
          i = e[t];
        if (i) {
          const r = i[17];
          null !== r && r !== e && Fm(r, i), n > 0 && (e[t - 1][4] = i[4]);
          const o = tl(e, 10 + n);
          !(function zM(e, n) {
            vs(e, n, n[J], 2, null, null), (n[0] = null), (n[6] = null);
          })(i[1], i);
          const s = o[19];
          null !== s && s.detachView(o[1]), (i[3] = null), (i[4] = null), (i[2] &= -65);
        }
        return i;
      }
      function km(e, n) {
        if (!(128 & n[2])) {
          const t = n[J];
          t.destroyNode && vs(e, n, t, 3, null, null),
            (function QM(e) {
              let n = e[13];
              if (!n) return Bd(e[1], e);
              for (; n; ) {
                let t = null;
                if (Vt(n)) t = n[13];
                else {
                  const i = n[10];
                  i && (t = i);
                }
                if (!t) {
                  for (; n && !n[4] && n !== e; ) Vt(n) && Bd(n[1], n), (n = n[3]);
                  null === n && (n = e), Vt(n) && Bd(n[1], n), (t = n && n[4]);
                }
                n = t;
              }
            })(n);
        }
      }
      function Bd(e, n) {
        if (!(128 & n[2])) {
          (n[2] &= -65),
            (n[2] |= 128),
            (function ZM(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let i = 0; i < t.length; i += 2) {
                  const r = n[t[i]];
                  if (!(r instanceof Yo)) {
                    const o = t[i + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = r[o[s]],
                          l = o[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(r);
                      } finally {
                      }
                  }
                }
            })(e, n),
            (function JM(e, n) {
              const t = e.cleanup,
                i = n[7];
              let r = -1;
              if (null !== t)
                for (let o = 0; o < t.length - 1; o += 2)
                  if ('string' == typeof t[o]) {
                    const s = t[o + 1],
                      a = 'function' == typeof s ? s(n) : Ke(n[s]),
                      l = i[(r = t[o + 2])],
                      c = t[o + 3];
                    'boolean' == typeof c
                      ? a.removeEventListener(t[o], l, c)
                      : c >= 0
                      ? i[(r = c)]()
                      : i[(r = -c)].unsubscribe(),
                      (o += 2);
                  } else {
                    const s = i[(r = t[o + 1])];
                    t[o].call(s);
                  }
              if (null !== i) {
                for (let o = r + 1; o < i.length; o++) (0, i[o])();
                n[7] = null;
              }
            })(e, n),
            1 === n[1].type && n[J].destroy();
          const t = n[17];
          if (null !== t && pn(n[3])) {
            t !== n[3] && Fm(t, n);
            const i = n[19];
            null !== i && i.detachView(e);
          }
          !(function MM(e) {
            Md.delete(e[20]);
          })(n);
        }
      }
      function Lm(e, n, t) {
        return (function Vm(e, n, t) {
          let i = n;
          for (; null !== i && 40 & i.type; ) i = (n = i).parent;
          if (null === i) return t[0];
          if (2 & i.flags) {
            const r = e.data[i.directiveStart].encapsulation;
            if (r === Fn.None || r === Fn.Emulated) return null;
          }
          return nn(i, t);
        })(e, n.parent, t);
      }
      function rr(e, n, t, i, r) {
        e.insertBefore(n, t, i, r);
      }
      function Bm(e, n, t) {
        e.appendChild(n, t);
      }
      function jm(e, n, t, i, r) {
        null !== i ? rr(e, n, t, i, r) : Bm(e, n, t);
      }
      function fl(e, n) {
        return e.parentNode(n);
      }
      function Hm(e, n, t) {
        return Um(e, n, t);
      }
      let Um = function Gm(e, n, t) {
        return 40 & e.type ? nn(e, t) : null;
      };
      function hl(e, n, t, i) {
        const r = Lm(e, i, n),
          o = n[J],
          a = Hm(i.parent || n[6], i, n);
        if (null != r)
          if (Array.isArray(t)) for (let l = 0; l < t.length; l++) jm(o, r, t[l], a, !1);
          else jm(o, r, t, a, !1);
      }
      function pl(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return nn(n, e);
          if (4 & t) return Hd(-1, e[n.index]);
          if (8 & t) {
            const i = n.child;
            if (null !== i) return pl(e, i);
            {
              const r = e[n.index];
              return pn(r) ? Hd(-1, r) : Ke(r);
            }
          }
          if (32 & t) return Pd(n, e)() || Ke(e[n.index]);
          {
            const i = Wm(e, n);
            return null !== i ? (Array.isArray(i) ? i[0] : pl(ms(e[16]), i)) : pl(e, n.next);
          }
        }
        return null;
      }
      function Wm(e, n) {
        return null !== n ? e[16][6].projection[n.projection] : null;
      }
      function Hd(e, n) {
        const t = 10 + e + 1;
        if (t < n.length) {
          const i = n[t],
            r = i[1].firstChild;
          if (null !== r) return pl(i, r);
        }
        return n[7];
      }
      function Gd(e, n, t, i, r, o, s) {
        for (; null != t; ) {
          const a = i[t.index],
            l = t.type;
          if ((s && 0 === n && (a && wt(Ke(a), i), (t.flags |= 4)), 64 != (64 & t.flags)))
            if (8 & l) Gd(e, n, t.child, i, r, o, !1), io(n, e, r, a, o);
            else if (32 & l) {
              const c = Pd(t, i);
              let u;
              for (; (u = c()); ) io(n, e, r, u, o);
              io(n, e, r, a, o);
            } else 16 & l ? Km(e, n, i, t, r, o) : io(n, e, r, a, o);
          t = s ? t.projectionNext : t.next;
        }
      }
      function vs(e, n, t, i, r, o) {
        Gd(t, i, e.firstChild, n, r, o, !1);
      }
      function Km(e, n, t, i, r, o) {
        const s = t[16],
          l = s[6].projection[i.projection];
        if (Array.isArray(l)) for (let c = 0; c < l.length; c++) io(n, e, r, l[c], o);
        else Gd(e, n, l, s[3], r, o, !0);
      }
      function qm(e, n, t) {
        e.setAttribute(n, 'style', t);
      }
      function Ud(e, n, t) {
        '' === t ? e.removeAttribute(n, 'class') : e.setAttribute(n, 'class', t);
      }
      function Qm(e, n, t) {
        let i = e.length;
        for (;;) {
          const r = e.indexOf(n, t);
          if (-1 === r) return r;
          if (0 === r || e.charCodeAt(r - 1) <= 32) {
            const o = n.length;
            if (r + o === i || e.charCodeAt(r + o) <= 32) return r;
          }
          t = r + 1;
        }
      }
      const Xm = 'ng-template';
      function oO(e, n, t) {
        let i = 0;
        for (; i < e.length; ) {
          let r = e[i++];
          if (t && 'class' === r) {
            if (((r = e[i]), -1 !== Qm(r.toLowerCase(), n, 0))) return !0;
          } else if (1 === r) {
            for (; i < e.length && 'string' == typeof (r = e[i++]); ) if (r.toLowerCase() === n) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Ym(e) {
        return 4 === e.type && e.value !== Xm;
      }
      function sO(e, n, t) {
        return n === (4 !== e.type || t ? e.value : Xm);
      }
      function aO(e, n, t) {
        let i = 4;
        const r = e.attrs || [],
          o = (function uO(e) {
            for (let n = 0; n < e.length; n++) if (C_(e[n])) return n;
            return e.length;
          })(r);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ('number' != typeof l) {
            if (!s)
              if (4 & i) {
                if (((i = 2 | (1 & i)), ('' !== l && !sO(e, l, t)) || ('' === l && 1 === n.length))) {
                  if (yn(i)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & i ? l : n[++a];
                if (8 & i && null !== e.attrs) {
                  if (!oO(e.attrs, c, t)) {
                    if (yn(i)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = lO(8 & i ? 'class' : l, r, Ym(e), t);
                if (-1 === d) {
                  if (yn(i)) return !1;
                  s = !0;
                  continue;
                }
                if ('' !== c) {
                  let f;
                  f = d > o ? '' : r[d + 1].toLowerCase();
                  const h = 8 & i ? f : null;
                  if ((h && -1 !== Qm(h, c, 0)) || (2 & i && c !== f)) {
                    if (yn(i)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !yn(i) && !yn(l)) return !1;
            if (s && yn(l)) continue;
            (s = !1), (i = l | (1 & i));
          }
        }
        return yn(i) || s;
      }
      function yn(e) {
        return 0 == (1 & e);
      }
      function lO(e, n, t, i) {
        if (null === n) return -1;
        let r = 0;
        if (i || !t) {
          let o = !1;
          for (; r < n.length; ) {
            const s = n[r];
            if (s === e) return r;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++r];
                for (; 'string' == typeof a; ) a = n[++r];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                r += 4;
                continue;
              }
            }
            r += o ? 1 : 2;
          }
          return -1;
        }
        return (function dO(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const i = e[t];
              if ('number' == typeof i) return -1;
              if (i === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function Jm(e, n, t = !1) {
        for (let i = 0; i < n.length; i++) if (aO(e, n[i], t)) return !0;
        return !1;
      }
      function fO(e, n) {
        e: for (let t = 0; t < n.length; t++) {
          const i = n[t];
          if (e.length === i.length) {
            for (let r = 0; r < e.length; r++) if (e[r] !== i[r]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function Zm(e, n) {
        return e ? ':not(' + n.trim() + ')' : n;
      }
      function hO(e) {
        let n = e[0],
          t = 1,
          i = 2,
          r = '',
          o = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ('string' == typeof s)
            if (2 & i) {
              const a = e[++t];
              r += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
            } else 8 & i ? (r += '.' + s) : 4 & i && (r += ' ' + s);
          else '' !== r && !yn(s) && ((n += Zm(o, r)), (r = '')), (i = s), (o = o || !yn(i));
          t++;
        }
        return '' !== r && (n += Zm(o, r)), n;
      }
      const q = {};
      function F(e) {
        ev(ie(), C(), At() + e, !1);
      }
      function ev(e, n, t, i) {
        if (!i)
          if (3 == (3 & n[2])) {
            const o = e.preOrderCheckHooks;
            null !== o && Ka(n, o, t);
          } else {
            const o = e.preOrderHooks;
            null !== o && qa(n, o, 0, t);
          }
        Ei(t);
      }
      function rv(e, n = null, t = null, i) {
        const r = ov(e, n, t, i);
        return r.resolveInjectorInitializers(), r;
      }
      function ov(e, n = null, t = null, i, r = new Set()) {
        const o = [t || ce, XS(e)];
        return (i = i || ('object' == typeof e ? void 0 : ye(e))), new _m(o, n || dl(), i || null, r);
      }
      let pt = (() => {
        class e {
          static create(t, i) {
            if (Array.isArray(t)) return rv({ name: '' }, i, t, '');
            {
              const r = t.name ?? '';
              return rv({ name: r }, t.parent, t.providers, r);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = rs),
          (e.NULL = new dm()),
          (e.ɵprov = M({ token: e, providedIn: 'any', factory: () => N(cm) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, n = B.Default) {
        const t = C();
        return null === t ? N(e, n) : I_(nt(), t, G(e), n);
      }
      function qd() {
        throw new Error('invalid');
      }
      function _l(e, n) {
        return (e << 17) | (n << 2);
      }
      function bn(e) {
        return (e >> 17) & 32767;
      }
      function Qd(e) {
        return 2 | e;
      }
      function ai(e) {
        return (131068 & e) >> 2;
      }
      function Xd(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function Yd(e) {
        return 1 | e;
      }
      function Cv(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let i = 0; i < t.length; i += 2) {
            const r = t[i],
              o = t[i + 1];
            if (-1 !== o) {
              const s = e.data[o];
              $u(r), s.contentQueries(2, n[o], o);
            }
          }
      }
      function yl(e, n, t, i, r, o, s, a, l, c, u) {
        const d = n.blueprint.slice();
        return (
          (d[0] = r),
          (d[2] = 76 | i),
          (null !== u || (e && 1024 & e[2])) && (d[2] |= 1024),
          c_(d),
          (d[3] = d[15] = e),
          (d[8] = t),
          (d[10] = s || (e && e[10])),
          (d[J] = a || (e && e[J])),
          (d[12] = l || (e && e[12]) || null),
          (d[9] = c || (e && e[9]) || null),
          (d[6] = o),
          (d[20] = (function EM() {
            return TM++;
          })()),
          (d[21] = u),
          (d[16] = 2 == n.type ? e[16] : d),
          d
        );
      }
      function oo(e, n, t, i, r) {
        let o = e.data[n];
        if (null === o)
          (o = (function lf(e, n, t, i, r) {
            const o = f_(),
              s = ju(),
              l = (e.data[n] = (function XO(e, n, t, i, r, o) {
                return {
                  type: t,
                  index: i,
                  insertBeforeIndex: null,
                  injectorIndex: n ? n.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: r,
                  attrs: o,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: n,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? o : o && o.parent, t, n, i, r));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== o &&
                (s ? null == o.child && null !== l.parent && (o.child = l) : null === o.next && (o.next = l)),
              l
            );
          })(e, n, t, i, r)),
            (function SE() {
              return W.lFrame.inI18n;
            })() && (o.flags |= 64);
        else if (64 & o.type) {
          (o.type = t), (o.value = i), (o.attrs = r);
          const s = (function Xo() {
            const e = W.lFrame,
              n = e.currentTNode;
            return e.isParent ? n : n.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return kn(o, !0), o;
      }
      function so(e, n, t, i) {
        if (0 === t) return -1;
        const r = n.length;
        for (let o = 0; o < t; o++) n.push(i), e.blueprint.push(i), e.data.push(null);
        return r;
      }
      function bl(e, n, t) {
        Wu(n);
        try {
          const i = e.viewQuery;
          null !== i && mf(1, i, t);
          const r = e.template;
          null !== r && wv(e, n, r, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Cv(e, n),
            e.staticViewQueries && mf(2, e.viewQuery, t);
          const o = e.components;
          null !== o &&
            (function zO(e, n) {
              for (let t = 0; t < n.length; t++) fI(e, n[t]);
            })(n, o);
        } catch (i) {
          throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), i);
        } finally {
          (n[2] &= -5), zu();
        }
      }
      function ys(e, n, t, i) {
        const r = n[2];
        if (128 != (128 & r)) {
          Wu(n);
          try {
            c_(n),
              (function h_(e) {
                return (W.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== t && wv(e, n, t, 2, i);
            const s = 3 == (3 & r);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && Ka(n, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && qa(n, c, 0, null), Ku(n, 0);
            }
            if (
              ((function uI(e) {
                for (let n = xd(e); null !== n; n = Fd(n)) {
                  if (!n[2]) continue;
                  const t = n[9];
                  for (let i = 0; i < t.length; i++) {
                    const r = t[i],
                      o = r[3];
                    0 == (512 & r[2]) && Bu(o, 1), (r[2] |= 512);
                  }
                }
              })(n),
              (function cI(e) {
                for (let n = xd(e); null !== n; n = Fd(n))
                  for (let t = 10; t < n.length; t++) {
                    const i = n[t],
                      r = i[1];
                    $a(i) && ys(r, i, r.template, i[8]);
                  }
              })(n),
              null !== e.contentQueries && Cv(e, n),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && Ka(n, c);
            } else {
              const c = e.contentHooks;
              null !== c && qa(n, c, 1), Ku(n, 1);
            }
            !(function $O(e, n) {
              const t = e.hostBindingOpCodes;
              if (null !== t)
                try {
                  for (let i = 0; i < t.length; i++) {
                    const r = t[i];
                    if (r < 0) Ei(~r);
                    else {
                      const o = r,
                        s = t[++i],
                        a = t[++i];
                      ME(s, o), a(2, n[o]);
                    }
                  }
                } finally {
                  Ei(-1);
                }
            })(e, n);
            const a = e.components;
            null !== a &&
              (function WO(e, n) {
                for (let t = 0; t < n.length; t++) dI(e, n[t]);
              })(n, a);
            const l = e.viewQuery;
            if ((null !== l && mf(2, l, i), s)) {
              const c = e.viewCheckHooks;
              null !== c && Ka(n, c);
            } else {
              const c = e.viewHooks;
              null !== c && qa(n, c, 2), Ku(n, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (n[2] &= -41),
              512 & n[2] && ((n[2] &= -513), Bu(n[3], -1));
          } finally {
            zu();
          }
        }
      }
      function KO(e, n, t, i) {
        const r = n[10],
          s = l_(n);
        try {
          !s && r.begin && r.begin(), s && bl(e, n, i), ys(e, n, t, i);
        } finally {
          !s && r.end && r.end();
        }
      }
      function wv(e, n, t, i, r) {
        const o = At(),
          s = 2 & i;
        try {
          Ei(-1), s && n.length > 22 && ev(e, n, 22, !1), t(i, r);
        } finally {
          Ei(o);
        }
      }
      function Nv(e, n, t) {
        if (Pu(n)) {
          const r = n.directiveEnd;
          for (let o = n.directiveStart; o < r; o++) {
            const s = e.data[o];
            s.contentQueries && s.contentQueries(1, t[o], o);
          }
        }
      }
      function cf(e, n, t) {
        !d_() ||
          ((function tI(e, n, t, i) {
            const r = t.directiveStart,
              o = t.directiveEnd;
            e.firstCreatePass || Zo(t, n), wt(i, n);
            const s = t.initialInputs;
            for (let a = r; a < o; a++) {
              const l = e.data[a],
                c = gn(l);
              c && sI(n, t, l);
              const u = es(n, e, a, t);
              wt(u, n), null !== s && aI(0, a - r, u, l, 0, s), c && (Wt(t.index, n)[8] = u);
            }
          })(e, n, t, nn(t, n)),
          128 == (128 & t.flags) &&
            (function nI(e, n, t) {
              const i = t.directiveStart,
                r = t.directiveEnd,
                o = t.index,
                s = (function OE() {
                  return W.lFrame.currentDirectiveIndex;
                })();
              try {
                Ei(o);
                for (let a = i; a < r; a++) {
                  const l = e.data[a],
                    c = n[a];
                  Gu(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && Av(l, c);
                }
              } finally {
                Ei(-1), Gu(s);
              }
            })(e, n, t));
      }
      function uf(e, n, t = nn) {
        const i = n.localNames;
        if (null !== i) {
          let r = n.index + 1;
          for (let o = 0; o < i.length; o += 2) {
            const s = i[o + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[r++] = a;
          }
        }
      }
      function Tv(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = df(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : n;
      }
      function df(e, n, t, i, r, o, s, a, l, c) {
        const u = 22 + i,
          d = u + r,
          f = (function qO(e, n) {
            const t = [];
            for (let i = 0; i < n; i++) t.push(i < e ? null : q);
            return t;
          })(u, d),
          h = 'function' == typeof c ? c() : c;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: n,
          data: f.slice().fill(null, u),
          bindingStartIndex: u,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: 'function' == typeof o ? o() : o,
          pipeRegistry: 'function' == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Ev(e, n, t, i) {
        const r = Vv(n);
        null === t ? r.push(i) : (r.push(t), e.firstCreatePass && Bv(e).push(i, r.length - 1));
      }
      function Sv(e, n, t) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            const r = e[i];
            (t = null === t ? {} : t).hasOwnProperty(i) ? t[i].push(n, r) : (t[i] = [n, r]);
          }
        return t;
      }
      function Mv(e, n) {
        const i = n.directiveEnd,
          r = e.data,
          o = n.attrs,
          s = [];
        let a = null,
          l = null;
        for (let c = n.directiveStart; c < i; c++) {
          const u = r[c],
            d = u.inputs,
            f = null === o || Ym(n) ? null : lI(d, o);
          s.push(f), (a = Sv(d, c, a)), (l = Sv(u.outputs, c, l));
        }
        null !== a && (a.hasOwnProperty('class') && (n.flags |= 16), a.hasOwnProperty('style') && (n.flags |= 32)),
          (n.initialInputs = s),
          (n.inputs = a),
          (n.outputs = l);
      }
      function qt(e, n, t, i, r, o, s, a) {
        const l = nn(n, t);
        let u,
          c = n.inputs;
        !a && null != c && (u = c[i])
          ? (vf(e, t, u, i, r), Ha(n) && Ov(t, n.index))
          : 3 & n.type &&
            ((i = (function YO(e) {
              return 'class' === e
                ? 'className'
                : 'for' === e
                ? 'htmlFor'
                : 'formaction' === e
                ? 'formAction'
                : 'innerHtml' === e
                ? 'innerHTML'
                : 'readonly' === e
                ? 'readOnly'
                : 'tabindex' === e
                ? 'tabIndex'
                : e;
            })(i)),
            (r = null != s ? s(r, n.value || '', i) : r),
            o.setProperty(l, i, r));
      }
      function Ov(e, n) {
        const t = Wt(n, e);
        16 & t[2] || (t[2] |= 32);
      }
      function ff(e, n, t, i) {
        let r = !1;
        if (d_()) {
          const o = (function iI(e, n, t) {
              const i = e.directiveRegistry;
              let r = null;
              if (i)
                for (let o = 0; o < i.length; o++) {
                  const s = i[o];
                  Jm(t, s.selectors, !1) &&
                    (r || (r = []), Za(Zo(t, n), e, s.type), gn(s) ? (Rv(e, t), r.unshift(s)) : r.push(s));
                }
              return r;
            })(e, n, t),
            s = null === i ? null : { '': -1 };
          if (null !== o) {
            (r = !0), Pv(t, e.data.length, o.length);
            for (let u = 0; u < o.length; u++) {
              const d = o[u];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              c = so(e, n, o.length, null);
            for (let u = 0; u < o.length; u++) {
              const d = o[u];
              (t.mergedAttrs = Xa(t.mergedAttrs, d.hostAttrs)),
                xv(e, t, n, c, d),
                oI(c, d, s),
                null !== d.contentQueries && (t.flags |= 8),
                (null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (t.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(t.index), (a = !0)),
                !l &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(t.index), (l = !0)),
                c++;
            }
            Mv(e, t);
          }
          s &&
            (function rI(e, n, t) {
              if (n) {
                const i = (e.localNames = []);
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r + 1]];
                  if (null == o) throw new S(-301, !1);
                  i.push(n[r], o);
                }
              }
            })(t, i, s);
        }
        return (t.mergedAttrs = Xa(t.mergedAttrs, t.attrs)), r;
      }
      function Iv(e, n, t, i, r, o) {
        const s = o.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const l = ~n.index;
          (function eI(e) {
            let n = e.length;
            for (; n > 0; ) {
              const t = e[--n];
              if ('number' == typeof t && t < 0) return t;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(i, r, s);
        }
      }
      function Av(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function Rv(e, n) {
        (n.flags |= 2), (e.components || (e.components = [])).push(n.index);
      }
      function oI(e, n, t) {
        if (t) {
          if (n.exportAs) for (let i = 0; i < n.exportAs.length; i++) t[n.exportAs[i]] = e;
          gn(n) && (t[''] = e);
        }
      }
      function Pv(e, n, t) {
        (e.flags |= 1), (e.directiveStart = n), (e.directiveEnd = n + t), (e.providerIndexes = n);
      }
      function xv(e, n, t, i, r) {
        e.data[i] = r;
        const o = r.factory || (r.factory = tr(r.type)),
          s = new Yo(o, gn(r), _);
        (e.blueprint[i] = s), (t[i] = s), Iv(e, n, 0, i, so(e, t, r.hostVars, q), r);
      }
      function sI(e, n, t) {
        const i = nn(n, e),
          r = Tv(t),
          o = e[10],
          s = Dl(e, yl(e, r, null, t.onPush ? 32 : 16, i, n, o, o.createRenderer(i, t), null, null, null));
        e[n.index] = s;
      }
      function Bn(e, n, t, i, r, o) {
        const s = nn(e, n);
        !(function hf(e, n, t, i, r, o, s) {
          if (null == o) e.removeAttribute(n, r, t);
          else {
            const a = null == s ? z(o) : s(o, i || '', r);
            e.setAttribute(n, r, a, t);
          }
        })(n[J], s, o, e.value, t, i, r);
      }
      function aI(e, n, t, i, r, o) {
        const s = o[n];
        if (null !== s) {
          const a = i.setInput;
          for (let l = 0; l < s.length; ) {
            const c = s[l++],
              u = s[l++],
              d = s[l++];
            null !== a ? i.setInput(t, d, c, u) : (t[u] = d);
          }
        }
      }
      function lI(e, n) {
        let t = null,
          i = 0;
        for (; i < n.length; ) {
          const r = n[i];
          if (0 !== r)
            if (5 !== r) {
              if ('number' == typeof r) break;
              e.hasOwnProperty(r) && (null === t && (t = []), t.push(r, e[r], n[i + 1])), (i += 2);
            } else i += 2;
          else i += 4;
        }
        return t;
      }
      function Fv(e, n, t, i) {
        return new Array(e, !0, !1, n, null, 0, i, t, null, null);
      }
      function dI(e, n) {
        const t = Wt(n, e);
        if ($a(t)) {
          const i = t[1];
          48 & t[2] ? ys(i, t, i.template, t[8]) : t[5] > 0 && pf(t);
        }
      }
      function pf(e) {
        for (let i = xd(e); null !== i; i = Fd(i))
          for (let r = 10; r < i.length; r++) {
            const o = i[r];
            if ($a(o))
              if (512 & o[2]) {
                const s = o[1];
                ys(s, o, s.template, o[8]);
              } else o[5] > 0 && pf(o);
          }
        const t = e[1].components;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const r = Wt(t[i], e);
            $a(r) && r[5] > 0 && pf(r);
          }
      }
      function fI(e, n) {
        const t = Wt(n, e),
          i = t[1];
        (function hI(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
        })(i, t),
          bl(i, t, t[8]);
      }
      function Dl(e, n) {
        return e[13] ? (e[14][4] = n) : (e[13] = n), (e[14] = n), n;
      }
      function gf(e) {
        for (; e; ) {
          e[2] |= 32;
          const n = ms(e);
          if (lE(e) && !n) return e;
          e = n;
        }
        return null;
      }
      function Lv(e) {
        !(function kv(e) {
          for (let n = 0; n < e.components.length; n++) {
            const t = e.components[n],
              i = Ad(t);
            if (null !== i) {
              const r = i[1];
              KO(r, i, r.template, t);
            }
          }
        })(e[8]);
      }
      function mf(e, n, t) {
        $u(0), n(e, t);
      }
      const gI = (() => Promise.resolve(null))();
      function Vv(e) {
        return e[7] || (e[7] = []);
      }
      function Bv(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Hv(e, n) {
        const t = e[9],
          i = t ? t.get(to, null) : null;
        i && i.handleError(n);
      }
      function vf(e, n, t, i, r) {
        for (let o = 0; o < t.length; ) {
          const s = t[o++],
            a = t[o++],
            l = n[s],
            c = e.data[s];
          null !== c.setInput ? c.setInput(l, r, i, a) : (l[a] = r);
        }
      }
      function Cl(e, n, t) {
        let i = t ? e.styles : null,
          r = t ? e.classes : null,
          o = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            'number' == typeof a ? (o = a) : 1 == o ? (r = Tu(r, a)) : 2 == o && (i = Tu(i, a + ': ' + n[++s] + ';'));
          }
        t ? (e.styles = i) : (e.stylesWithoutHost = i), t ? (e.classes = r) : (e.classesWithoutHost = r);
      }
      function wl(e, n, t, i, r = !1) {
        for (; null !== t; ) {
          const o = n[t.index];
          if ((null !== o && i.push(Ke(o)), pn(o)))
            for (let a = 10; a < o.length; a++) {
              const l = o[a],
                c = l[1].firstChild;
              null !== c && wl(l[1], l, c, i);
            }
          const s = t.type;
          if (8 & s) wl(e, n, t.child, i);
          else if (32 & s) {
            const a = Pd(t, n);
            let l;
            for (; (l = a()); ) i.push(l);
          } else if (16 & s) {
            const a = Wm(n, t);
            if (Array.isArray(a)) i.push(...a);
            else {
              const l = ms(n[16]);
              wl(l[1], l, a, i, !0);
            }
          }
          t = r ? t.projectionNext : t.next;
        }
        return i;
      }
      class bs {
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const n = this._lView,
            t = n[1];
          return wl(t, n, t.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(n) {
          this._lView[8] = n;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const n = this._lView[3];
            if (pn(n)) {
              const t = n[8],
                i = t ? t.indexOf(this) : -1;
              i > -1 && (Vd(n, i), tl(t, i));
            }
            this._attachedToViewContainer = !1;
          }
          km(this._lView[1], this._lView);
        }
        onDestroy(n) {
          Ev(this._lView[1], this._lView, null, n);
        }
        markForCheck() {
          gf(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          !(function _f(e, n, t) {
            const i = n[10];
            i.begin && i.begin();
            try {
              ys(e, n, e.template, t);
            } catch (r) {
              throw (Hv(n, r), r);
            } finally {
              i.end && i.end();
            }
          })(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new S(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function qM(e, n) {
              vs(e, n, n[J], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new S(902, !1);
          this._appRef = n;
        }
      }
      class _I extends bs {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          Lv(this._view);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class yf extends ps {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = _e(n);
          return new Ds(t, this.ngModule);
        }
      }
      function Gv(e) {
        const n = [];
        for (let t in e) e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class vI {
        constructor(n, t) {
          (this.injector = n), (this.parentInjector = t);
        }
        get(n, t, i) {
          const r = this.injector.get(n, Cd, i);
          return r !== Cd || t === Cd ? r : this.parentInjector.get(n, t, i);
        }
      }
      class Ds extends vm {
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function pO(e) {
              return e.map(hO).join(',');
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : []),
            (this.isBoundToModule = !!t);
        }
        get inputs() {
          return Gv(this.componentDef.inputs);
        }
        get outputs() {
          return Gv(this.componentDef.outputs);
        }
        create(n, t, i, r) {
          let o = (r = r || this.ngModule) instanceof Oi ? r : r?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new vI(n, o) : n,
            a = s.get(Dd, null);
          if (null === a) throw new S(407, !1);
          const l = s.get(fM, null),
            c = a.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || 'div',
            d = i
              ? (function QO(e, n, t) {
                  return e.selectRootElement(n, t === Fn.ShadowDom);
                })(c, i, this.componentDef.encapsulation)
              : Ld(
                  a.createRenderer(null, this.componentDef),
                  u,
                  (function mI(e) {
                    const n = e.toLowerCase();
                    return 'svg' === n ? 'svg' : 'math' === n ? 'math' : null;
                  })(u)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = (function wI(e, n) {
              return { components: [], scheduler: e || kM, clean: gI, playerHandler: n || null, flags: 0 };
            })(),
            p = df(0, null, null, 1, 0, null, null, null, null, null),
            g = yl(null, p, h, f, null, null, a, c, l, s, null);
          let m, y;
          Wu(g);
          try {
            const D = (function DI(e, n, t, i, r, o) {
              const s = t[1];
              t[22] = e;
              const l = oo(s, 22, 2, '#host', null),
                c = (l.mergedAttrs = n.hostAttrs);
              null !== c &&
                (Cl(l, c, !0),
                null !== e &&
                  (Qa(r, e, c), null !== l.classes && Ud(r, e, l.classes), null !== l.styles && qm(r, e, l.styles)));
              const u = i.createRenderer(e, n),
                d = yl(t, Tv(n), null, n.onPush ? 32 : 16, t[22], l, i, u, o || null, null, null);
              return (
                s.firstCreatePass && (Za(Zo(l, t), s, n.type), Rv(s, l), Pv(l, t.length, 1)), Dl(t, d), (t[22] = d)
              );
            })(d, this.componentDef, g, a, c);
            if (d)
              if (i) Qa(c, d, ['ng-version', hM.full]);
              else {
                const { attrs: b, classes: w } = (function gO(e) {
                  const n = [],
                    t = [];
                  let i = 1,
                    r = 2;
                  for (; i < e.length; ) {
                    let o = e[i];
                    if ('string' == typeof o) 2 === r ? '' !== o && n.push(o, e[++i]) : 8 === r && t.push(o);
                    else {
                      if (!yn(r)) break;
                      r = o;
                    }
                    i++;
                  }
                  return { attrs: n, classes: t };
                })(this.componentDef.selectors[0]);
                b && Qa(c, d, b), w && w.length > 0 && Ud(c, d, w.join(' '));
              }
            if (((y = Vu(p, 22)), void 0 !== t)) {
              const b = (y.projection = []);
              for (let w = 0; w < this.ngContentSelectors.length; w++) {
                const O = t[w];
                b.push(null != O ? Array.from(O) : null);
              }
            }
            (m = (function CI(e, n, t, i, r) {
              const o = t[1],
                s = (function ZO(e, n, t) {
                  const i = nt();
                  e.firstCreatePass &&
                    (t.providersResolver && t.providersResolver(t), xv(e, i, n, so(e, n, 1, null), t), Mv(e, i));
                  const r = es(n, e, i.directiveStart, i);
                  wt(r, n);
                  const o = nn(i, n);
                  return o && wt(o, n), r;
                })(o, t, n);
              if ((i.components.push(s), (e[8] = s), null !== r)) for (const l of r) l(s, n);
              if (n.contentQueries) {
                const l = nt();
                n.contentQueries(1, s, l.directiveStart);
              }
              const a = nt();
              return (
                !o.firstCreatePass ||
                  (null === n.hostBindings && null === n.hostAttrs) ||
                  (Ei(a.index), Iv(t[1], a, 0, a.directiveStart, a.directiveEnd, n), Av(n, s)),
                s
              );
            })(D, this.componentDef, g, h, [NI])),
              bl(p, g, null);
          } finally {
            zu();
          }
          return new bI(this.componentType, m, eo(y, g), g, y);
        }
      }
      class bI extends class sM {} {
        constructor(n, t, i, r, o) {
          super(),
            (this.location = i),
            (this._rootLView = r),
            (this._tNode = o),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new _I(r)),
            (this.componentType = n);
        }
        setInput(n, t) {
          const i = this._tNode.inputs;
          let r;
          if (null !== i && (r = i[n])) {
            const o = this._rootLView;
            vf(o[1], o, r, n, t), Ov(o, this._tNode.index);
          }
        }
        get injector() {
          return new $r(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      function NI() {
        const e = nt();
        za(C()[1], e);
      }
      function de(e) {
        let n = (function Uv(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          t = !0;
        const i = [e];
        for (; n; ) {
          let r;
          if (gn(e)) r = n.ɵcmp || n.ɵdir;
          else {
            if (n.ɵcmp) throw new S(903, !1);
            r = n.ɵdir;
          }
          if (r) {
            if (t) {
              i.push(r);
              const s = e;
              (s.inputs = bf(e.inputs)), (s.declaredInputs = bf(e.declaredInputs)), (s.outputs = bf(e.outputs));
              const a = r.hostBindings;
              a && MI(e, a);
              const l = r.viewQuery,
                c = r.contentQueries;
              if (
                (l && EI(e, l),
                c && SI(e, c),
                Nu(e.inputs, r.inputs),
                Nu(e.declaredInputs, r.declaredInputs),
                Nu(e.outputs, r.outputs),
                gn(r) && r.data.animation)
              ) {
                const u = e.data;
                u.animation = (u.animation || []).concat(r.data.animation);
              }
            }
            const o = r.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(e), a === de && (t = !1);
              }
          }
          n = Object.getPrototypeOf(n);
        }
        !(function TI(e) {
          let n = 0,
            t = null;
          for (let i = e.length - 1; i >= 0; i--) {
            const r = e[i];
            (r.hostVars = n += r.hostVars), (r.hostAttrs = Xa(r.hostAttrs, (t = Xa(t, r.hostAttrs))));
          }
        })(i);
      }
      function bf(e) {
        return e === Fr ? {} : e === ce ? [] : e;
      }
      function EI(e, n) {
        const t = e.viewQuery;
        e.viewQuery = t
          ? (i, r) => {
              n(i, r), t(i, r);
            }
          : n;
      }
      function SI(e, n) {
        const t = e.contentQueries;
        e.contentQueries = t
          ? (i, r, o) => {
              n(i, r, o), t(i, r, o);
            }
          : n;
      }
      function MI(e, n) {
        const t = e.hostBindings;
        e.hostBindings = t
          ? (i, r) => {
              n(i, r), t(i, r);
            }
          : n;
      }
      let Nl = null;
      function or() {
        if (!Nl) {
          const e = ge.Symbol;
          if (e && e.iterator) Nl = e.iterator;
          else {
            const n = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < n.length; ++t) {
              const i = n[t];
              'entries' !== i && 'size' !== i && Map.prototype[i] === Map.prototype.entries && (Nl = i);
            }
          }
        }
        return Nl;
      }
      function Cs(e) {
        return !!Df(e) && (Array.isArray(e) || (!(e instanceof Map) && or() in e));
      }
      function Df(e) {
        return null !== e && ('function' == typeof e || 'object' == typeof e);
      }
      function Nt(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function be(e, n, t, i) {
        const r = C();
        return Nt(r, Hr(), n) && (ie(), Bn(Ve(), r, e, n, t, i)), be;
      }
      function lo(e, n, t, i) {
        return Nt(e, Hr(), t) ? n + z(t) + i : q;
      }
      function Q(e, n, t, i, r, o, s, a) {
        const l = C(),
          c = ie(),
          u = e + 22,
          d = c.firstCreatePass
            ? (function LI(e, n, t, i, r, o, s, a, l) {
                const c = n.consts,
                  u = oo(n, e, 4, s || null, Ti(c, a));
                ff(n, t, u, Ti(c, l)), za(n, u);
                const d = (u.tViews = df(2, u, i, r, o, n.directiveRegistry, n.pipeRegistry, null, n.schemas, c));
                return null !== n.queries && (n.queries.template(n, u), (d.queries = n.queries.embeddedTView(u))), u;
              })(u, c, l, n, t, i, r, o, s)
            : c.data[u];
        kn(d, !1);
        const f = l[J].createComment('');
        hl(c, l, f, d), wt(f, l), Dl(l, (l[u] = Fv(f, l, f, d))), Ga(d) && cf(c, l, d), null != s && uf(l, d, a);
      }
      function j(e, n, t) {
        const i = C();
        return Nt(i, Hr(), n) && qt(ie(), Ve(), i, e, n, i[J], t, !1), j;
      }
      function Cf(e, n, t, i, r) {
        const s = r ? 'class' : 'style';
        vf(e, t, n.inputs[s], s, i);
      }
      function T(e, n, t, i) {
        const r = C(),
          o = ie(),
          s = 22 + e,
          a = r[J],
          l = (r[s] = Ld(
            a,
            n,
            (function LE() {
              return W.lFrame.currentNamespace;
            })()
          )),
          c = o.firstCreatePass
            ? (function BI(e, n, t, i, r, o, s) {
                const a = n.consts,
                  c = oo(n, e, 2, r, Ti(a, o));
                return (
                  ff(n, t, c, Ti(a, s)),
                  null !== c.attrs && Cl(c, c.attrs, !1),
                  null !== c.mergedAttrs && Cl(c, c.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, c),
                  c
                );
              })(s, o, r, 0, n, t, i)
            : o.data[s];
        kn(c, !0);
        const u = c.mergedAttrs;
        null !== u && Qa(a, l, u);
        const d = c.classes;
        null !== d && Ud(a, l, d);
        const f = c.styles;
        return (
          null !== f && qm(a, l, f),
          64 != (64 & c.flags) && hl(o, r, l, c),
          0 ===
            (function DE() {
              return W.lFrame.elementDepthCount;
            })() && wt(l, r),
          (function CE() {
            W.lFrame.elementDepthCount++;
          })(),
          Ga(c) && (cf(o, r, c), Nv(o, c, r)),
          null !== i && uf(r, c),
          T
        );
      }
      function E() {
        let e = nt();
        ju() ? Hu() : ((e = e.parent), kn(e, !1));
        const n = e;
        !(function wE() {
          W.lFrame.elementDepthCount--;
        })();
        const t = ie();
        return (
          t.firstCreatePass && (za(t, e), Pu(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function GE(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            Cf(t, n, C(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function UE(e) {
              return 0 != (32 & e.flags);
            })(n) &&
            Cf(t, n, C(), n.stylesWithoutHost, !1),
          E
        );
      }
      function gt(e, n, t, i) {
        return T(e, n, t, i), E(), gt;
      }
      function El(e, n, t) {
        const i = C(),
          r = ie(),
          o = e + 22,
          s = r.firstCreatePass
            ? (function jI(e, n, t, i, r) {
                const o = n.consts,
                  s = Ti(o, i),
                  a = oo(n, e, 8, 'ng-container', s);
                return (
                  null !== s && Cl(a, s, !0),
                  ff(n, t, a, Ti(o, r)),
                  null !== n.queries && n.queries.elementStart(n, a),
                  a
                );
              })(o, r, i, n, t)
            : r.data[o];
        kn(s, !0);
        const a = (i[o] = i[J].createComment(''));
        return hl(r, i, a, s), wt(a, i), Ga(s) && (cf(r, i, s), Nv(r, s, i)), null != t && uf(i, s), El;
      }
      function Sl() {
        let e = nt();
        const n = ie();
        return (
          ju() ? Hu() : ((e = e.parent), kn(e, !1)),
          n.firstCreatePass && (za(n, e), Pu(e) && n.queries.elementEnd(e)),
          Sl
        );
      }
      function Ns(e) {
        return !!e && 'function' == typeof e.then;
      }
      const wf = function ey(e) {
        return !!e && 'function' == typeof e.subscribe;
      };
      function fe(e, n, t, i) {
        const r = C(),
          o = ie(),
          s = nt();
        return (
          (function ny(e, n, t, i, r, o, s, a) {
            const l = Ga(i),
              u = e.firstCreatePass && Bv(e),
              d = n[8],
              f = Vv(n);
            let h = !0;
            if (3 & i.type || a) {
              const m = nn(i, n),
                y = a ? a(m) : m,
                D = f.length,
                b = a ? (O) => a(Ke(O[i.index])) : i.index;
              let w = null;
              if (
                (!a &&
                  l &&
                  (w = (function HI(e, n, t, i) {
                    const r = e.cleanup;
                    if (null != r)
                      for (let o = 0; o < r.length - 1; o += 2) {
                        const s = r[o];
                        if (s === t && r[o + 1] === i) {
                          const a = n[7],
                            l = r[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        'string' == typeof s && (o += 2);
                      }
                    return null;
                  })(e, n, r, i.index)),
                null !== w)
              )
                ((w.__ngLastListenerFn__ || w).__ngNextListenerFn__ = o), (w.__ngLastListenerFn__ = o), (h = !1);
              else {
                o = ry(i, n, d, o, !1);
                const O = t.listen(y, r, o);
                f.push(o, O), u && u.push(r, b, D, D + 1);
              }
            } else o = ry(i, n, d, o, !1);
            const p = i.outputs;
            let g;
            if (h && null !== p && (g = p[r])) {
              const m = g.length;
              if (m)
                for (let y = 0; y < m; y += 2) {
                  const x = n[g[y]][g[y + 1]].subscribe(o),
                    re = f.length;
                  f.push(o, x), u && u.push(r, i.index, re, -(re + 1));
                }
            }
          })(o, r, r[J], s, e, n, 0, i),
          fe
        );
      }
      function iy(e, n, t, i) {
        try {
          return !1 !== t(i);
        } catch (r) {
          return Hv(e, r), !1;
        }
      }
      function ry(e, n, t, i, r) {
        return function o(s) {
          if (s === Function) return i;
          gf(2 & e.flags ? Wt(e.index, n) : n);
          let l = iy(n, 0, i, s),
            c = o.__ngNextListenerFn__;
          for (; c; ) (l = iy(n, 0, c, s) && l), (c = c.__ngNextListenerFn__);
          return r && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function oe(e = 1) {
        return (function AE(e) {
          return (W.lFrame.contextLView = (function RE(e, n) {
            for (; e > 0; ) (n = n[15]), e--;
            return n;
          })(e, W.lFrame.contextLView))[8];
        })(e);
      }
      function GI(e, n) {
        let t = null;
        const i = (function cO(e) {
          const n = e.attrs;
          if (null != n) {
            const t = n.indexOf(5);
            if (0 == (1 & t)) return n[t + 1];
          }
          return null;
        })(e);
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          if ('*' !== o) {
            if (null === i ? Jm(e, o, !0) : fO(i, o)) return r;
          } else t = r;
        }
        return t;
      }
      function gy(e, n, t, i, r) {
        const o = e[t + 1],
          s = null === n;
        let a = i ? bn(o) : ai(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const u = e[a + 1];
          WI(e[a], n) && ((l = !0), (e[a + 1] = i ? Yd(u) : Qd(u))), (a = i ? bn(u) : ai(u));
        }
        l && (e[t + 1] = i ? Qd(o) : Yd(o));
      }
      function WI(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || 'string' != typeof n) && Qr(e, n) >= 0)
        );
      }
      const rt = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function _y(e) {
        return e.substring(rt.key, rt.keyEnd);
      }
      function my(e, n) {
        const t = rt.textEnd;
        return t === n
          ? -1
          : ((n = rt.keyEnd =
              (function QI(e, n, t) {
                for (; n < t && e.charCodeAt(n) > 32; ) n++;
                return n;
              })(e, (rt.key = n), t)),
            mo(e, n, t));
      }
      function mo(e, n, t) {
        for (; n < t && e.charCodeAt(n) <= 32; ) n++;
        return n;
      }
      function Be(e, n) {
        return (
          (function Cn(e, n, t, i) {
            const r = C(),
              o = ie(),
              s = ri(2);
            o.firstUpdatePass && wy(o, e, s, i),
              n !== q &&
                Nt(r, s, n) &&
                Ty(
                  o,
                  o.data[At()],
                  r,
                  r[J],
                  e,
                  (r[s + 1] = (function oA(e, n) {
                    return null == e || ('string' == typeof n ? (e += n) : 'object' == typeof e && (e = ye(Mi(e)))), e;
                  })(n, t)),
                  i,
                  s
                );
          })(e, n, null, !0),
          Be
        );
      }
      function ar(e) {
        wn(Kt, Un, e, !0);
      }
      function Un(e, n) {
        for (
          let t = (function KI(e) {
            return (
              (function yy(e) {
                (rt.key = 0), (rt.keyEnd = 0), (rt.value = 0), (rt.valueEnd = 0), (rt.textEnd = e.length);
              })(e),
              my(e, mo(e, 0, rt.textEnd))
            );
          })(n);
          t >= 0;
          t = my(n, t)
        )
          Kt(e, _y(n), !0);
      }
      function wn(e, n, t, i) {
        const r = ie(),
          o = ri(2);
        r.firstUpdatePass && wy(r, null, o, i);
        const s = C();
        if (t !== q && Nt(s, o, t)) {
          const a = r.data[At()];
          if (Sy(a, i) && !Cy(r, o)) {
            let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
            null !== l && (t = Tu(l, t || '')), Cf(r, a, s, t, i);
          } else
            !(function rA(e, n, t, i, r, o, s, a) {
              r === q && (r = ce);
              let l = 0,
                c = 0,
                u = 0 < r.length ? r[0] : null,
                d = 0 < o.length ? o[0] : null;
              for (; null !== u || null !== d; ) {
                const f = l < r.length ? r[l + 1] : void 0,
                  h = c < o.length ? o[c + 1] : void 0;
                let g,
                  p = null;
                u === d
                  ? ((l += 2), (c += 2), f !== h && ((p = d), (g = h)))
                  : null === d || (null !== u && u < d)
                  ? ((l += 2), (p = u))
                  : ((c += 2), (p = d), (g = h)),
                  null !== p && Ty(e, n, t, i, p, g, s, a),
                  (u = l < r.length ? r[l] : null),
                  (d = c < o.length ? o[c] : null);
              }
            })(
              r,
              a,
              s,
              s[J],
              s[o + 1],
              (s[o + 1] = (function iA(e, n, t) {
                if (null == t || '' === t) return ce;
                const i = [],
                  r = Mi(t);
                if (Array.isArray(r)) for (let o = 0; o < r.length; o++) e(i, r[o], !0);
                else if ('object' == typeof r) for (const o in r) r.hasOwnProperty(o) && e(i, o, r[o]);
                else 'string' == typeof r && n(i, r);
                return i;
              })(e, n, t)),
              i,
              o
            );
        }
      }
      function Cy(e, n) {
        return n >= e.expandoStartIndex;
      }
      function wy(e, n, t, i) {
        const r = e.data;
        if (null === r[t + 1]) {
          const o = r[At()],
            s = Cy(e, t);
          Sy(o, i) && null === n && !s && (n = !1),
            (n = (function ZI(e, n, t, i) {
              const r = (function Uu(e) {
                const n = W.lFrame.currentDirectiveIndex;
                return -1 === n ? null : e[n];
              })(e);
              let o = i ? n.residualClasses : n.residualStyles;
              if (null === r)
                0 === (i ? n.classBindings : n.styleBindings) &&
                  ((t = Ts((t = Ef(null, e, n, t, i)), n.attrs, i)), (o = null));
              else {
                const s = n.directiveStylingLast;
                if (-1 === s || e[s] !== r)
                  if (((t = Ef(r, e, n, t, i)), null === o)) {
                    let l = (function eA(e, n, t) {
                      const i = t ? n.classBindings : n.styleBindings;
                      if (0 !== ai(i)) return e[bn(i)];
                    })(e, n, i);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = Ef(null, e, n, l[1], i)),
                      (l = Ts(l, n.attrs, i)),
                      (function tA(e, n, t, i) {
                        e[bn(t ? n.classBindings : n.styleBindings)] = i;
                      })(e, n, i, l));
                  } else
                    o = (function nA(e, n, t) {
                      let i;
                      const r = n.directiveEnd;
                      for (let o = 1 + n.directiveStylingLast; o < r; o++) i = Ts(i, e[o].hostAttrs, t);
                      return Ts(i, n.attrs, t);
                    })(e, n, i);
              }
              return void 0 !== o && (i ? (n.residualClasses = o) : (n.residualStyles = o)), t;
            })(r, o, n, i)),
            (function UI(e, n, t, i, r, o) {
              let s = o ? n.classBindings : n.styleBindings,
                a = bn(s),
                l = ai(s);
              e[i] = t;
              let u,
                c = !1;
              if (Array.isArray(t)) {
                const d = t;
                (u = d[1]), (null === u || Qr(d, u) > 0) && (c = !0);
              } else u = t;
              if (r)
                if (0 !== l) {
                  const f = bn(e[a + 1]);
                  (e[i + 1] = _l(f, a)),
                    0 !== f && (e[f + 1] = Xd(e[f + 1], i)),
                    (e[a + 1] = (function xO(e, n) {
                      return (131071 & e) | (n << 17);
                    })(e[a + 1], i));
                } else (e[i + 1] = _l(a, 0)), 0 !== a && (e[a + 1] = Xd(e[a + 1], i)), (a = i);
              else (e[i + 1] = _l(l, 0)), 0 === a ? (a = i) : (e[l + 1] = Xd(e[l + 1], i)), (l = i);
              c && (e[i + 1] = Qd(e[i + 1])),
                gy(e, u, i, !0),
                gy(e, u, i, !1),
                (function $I(e, n, t, i, r) {
                  const o = r ? e.residualClasses : e.residualStyles;
                  null != o && 'string' == typeof n && Qr(o, n) >= 0 && (t[i + 1] = Yd(t[i + 1]));
                })(n, u, e, i, o),
                (s = _l(a, l)),
                o ? (n.classBindings = s) : (n.styleBindings = s);
            })(r, o, n, t, s, i);
        }
      }
      function Ef(e, n, t, i, r) {
        let o = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (-1 === a ? (a = t.directiveStart) : a++; a < s && ((o = n[a]), (i = Ts(i, o.hostAttrs, r)), o !== e); )
          a++;
        return null !== e && (t.directiveStylingLast = a), i;
      }
      function Ts(e, n, t) {
        const i = t ? 1 : 2;
        let r = -1;
        if (null !== n)
          for (let o = 0; o < n.length; o++) {
            const s = n[o];
            'number' == typeof s
              ? (r = s)
              : r === i && (Array.isArray(e) || (e = void 0 === e ? [] : ['', e]), Kt(e, s, !!t || n[++o]));
          }
        return void 0 === e ? null : e;
      }
      function Ty(e, n, t, i, r, o, s, a) {
        if (!(3 & n.type)) return;
        const l = e.data,
          c = l[a + 1];
        Ol(
          (function pv(e) {
            return 1 == (1 & e);
          })(c)
            ? Ey(l, n, t, r, ai(c), s)
            : void 0
        ) ||
          (Ol(o) ||
            ((function hv(e) {
              return 2 == (2 & e);
            })(c) &&
              (o = Ey(l, null, t, r, a, s))),
          (function rO(e, n, t, i, r) {
            if (n) r ? e.addClass(t, i) : e.removeClass(t, i);
            else {
              let o = -1 === i.indexOf('-') ? void 0 : Bt.DashCase;
              null == r
                ? e.removeStyle(t, i, o)
                : ('string' == typeof r && r.endsWith('!important') && ((r = r.slice(0, -10)), (o |= Bt.Important)),
                  e.setStyle(t, i, r, o));
            }
          })(i, s, Ua(At(), t), r, o));
      }
      function Ey(e, n, t, i, r, o) {
        const s = null === n;
        let a;
        for (; r > 0; ) {
          const l = e[r],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let f = t[r + 1];
          f === q && (f = d ? ce : void 0);
          let h = d ? td(f, i) : u === i ? f : void 0;
          if ((c && !Ol(h) && (h = td(l, i)), Ol(h) && ((a = h), s))) return a;
          const p = e[r + 1];
          r = s ? bn(p) : ai(p);
        }
        if (null !== n) {
          let l = o ? n.residualClasses : n.residualStyles;
          null != l && (a = td(l, i));
        }
        return a;
      }
      function Ol(e) {
        return void 0 !== e;
      }
      function Sy(e, n) {
        return 0 != (e.flags & (n ? 16 : 32));
      }
      function v(e, n = '') {
        const t = C(),
          i = ie(),
          r = e + 22,
          o = i.firstCreatePass ? oo(i, r, 1, n, null) : i.data[r],
          s = (t[r] = (function kd(e, n) {
            return e.createText(n);
          })(t[J], n));
        hl(i, t, s, o), kn(o, !1);
      }
      function Il(e) {
        return $n('', e, ''), Il;
      }
      function $n(e, n, t) {
        const i = C(),
          r = lo(i, e, n, t);
        return (
          r !== q &&
            (function li(e, n, t) {
              const i = Ua(n, e);
              !(function xm(e, n, t) {
                e.setValue(n, t);
              })(e[J], i, t);
            })(i, At(), r),
          $n
        );
      }
      function vo(e, n, t) {
        const i = C();
        return Nt(i, Hr(), n) && qt(ie(), Ve(), i, e, n, i[J], t, !0), vo;
      }
      const bo = 'en-US';
      let Qy = bo;
      function If(e, n, t, i, r) {
        if (((e = G(e)), Array.isArray(e))) for (let o = 0; o < e.length; o++) If(e[o], n, t, i, r);
        else {
          const o = ie(),
            s = C();
          let a = ir(e) ? e : G(e.provide),
            l = mm(e);
          const c = nt(),
            u = 1048575 & c.providerIndexes,
            d = c.directiveStart,
            f = c.providerIndexes >> 20;
          if (ir(e) || !e.multi) {
            const h = new Yo(l, r, _),
              p = Rf(a, n, r ? u : u + f, d);
            -1 === p
              ? (Za(Zo(c, s), o, a),
                Af(o, e, n.length),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                r && (c.providerIndexes += 1048576),
                t.push(h),
                s.push(h))
              : ((t[p] = h), (s[p] = h));
          } else {
            const h = Rf(a, n, u + f, d),
              p = Rf(a, n, u, u + f),
              g = h >= 0 && t[h],
              m = p >= 0 && t[p];
            if ((r && !m) || (!r && !g)) {
              Za(Zo(c, s), o, a);
              const y = (function bR(e, n, t, i, r) {
                const o = new Yo(e, t, _);
                return (o.multi = []), (o.index = n), (o.componentProviders = 0), D0(o, r, i && !t), o;
              })(r ? yR : vR, t.length, r, i, l);
              !r && m && (t[p].providerFactory = y),
                Af(o, e, n.length, 0),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                r && (c.providerIndexes += 1048576),
                t.push(y),
                s.push(y);
            } else Af(o, e, h > -1 ? h : p, D0(t[r ? p : h], l, !r && i));
            !r && i && m && t[p].componentProviders++;
          }
        }
      }
      function Af(e, n, t, i) {
        const r = ir(n),
          o = (function JS(e) {
            return !!e.useClass;
          })(n);
        if (r || o) {
          const l = (o ? G(n.useClass) : n).prototype.ngOnDestroy;
          if (l) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!r && n.multi) {
              const u = c.indexOf(t);
              -1 === u ? c.push(t, [i, l]) : c[u + 1].push(i, l);
            } else c.push(t, l);
          }
        }
      }
      function D0(e, n, t) {
        return t && e.componentProviders++, e.multi.push(n) - 1;
      }
      function Rf(e, n, t, i) {
        for (let r = t; r < i; r++) if (n[r] === e) return r;
        return -1;
      }
      function vR(e, n, t, i) {
        return Pf(this.multi, []);
      }
      function yR(e, n, t, i) {
        const r = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = es(t, t[1], this.providerFactory.index, i);
          (o = a.slice(0, s)), Pf(r, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), Pf(r, o);
        return o;
      }
      function Pf(e, n) {
        for (let t = 0; t < e.length; t++) n.push((0, e[t])());
        return n;
      }
      function Ee(e, n = []) {
        return (t) => {
          t.providersResolver = (i, r) =>
            (function mR(e, n, t) {
              const i = ie();
              if (i.firstCreatePass) {
                const r = gn(e);
                If(t, i.data, i.blueprint, r, !0), If(n, i.data, i.blueprint, r, !1);
              }
            })(i, r ? r(e) : e, n);
        };
      }
      class cr {}
      class C0 {}
      class w0 extends cr {
        constructor(n, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new yf(this));
          const i = Ut(n);
          (this._bootstrapComponents = si(i.bootstrap)),
            (this._r3Injector = ov(
              n,
              t,
              [
                { provide: cr, useValue: this },
                { provide: ps, useValue: this.componentFactoryResolver },
              ],
              ye(n),
              new Set(['environment'])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(n));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const n = this._r3Injector;
          !n.destroyed && n.destroy(), this.destroyCbs.forEach((t) => t()), (this.destroyCbs = null);
        }
        onDestroy(n) {
          this.destroyCbs.push(n);
        }
      }
      class xf extends C0 {
        constructor(n) {
          super(), (this.moduleType = n);
        }
        create(n) {
          return new w0(this.moduleType, n);
        }
      }
      class CR extends cr {
        constructor(n, t, i) {
          super(), (this.componentFactoryResolver = new yf(this)), (this.instance = null);
          const r = new _m(
            [...n, { provide: cr, useValue: this }, { provide: ps, useValue: this.componentFactoryResolver }],
            t || dl(),
            i,
            new Set(['environment'])
          );
          (this.injector = r), r.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(n) {
          this.injector.onDestroy(n);
        }
      }
      function Fl(e, n, t = null) {
        return new CR(e, n, t).injector;
      }
      function I0(e, n, t, i, r, o) {
        const s = n + t;
        return Nt(e, s, r)
          ? (function jn(e, n, t) {
              return (e[n] = t);
            })(e, s + 1, o ? i.call(o, r) : i(r))
          : (function Rs(e, n) {
              const t = e[n];
              return t === q ? void 0 : t;
            })(e, s + 1);
      }
      function Ps(e, n) {
        const t = ie();
        let i;
        const r = e + 22;
        t.firstCreatePass
          ? ((i = (function jR(e, n) {
              if (n)
                for (let t = n.length - 1; t >= 0; t--) {
                  const i = n[t];
                  if (e === i.name) return i;
                }
            })(n, t.pipeRegistry)),
            (t.data[r] = i),
            i.onDestroy && (t.destroyHooks || (t.destroyHooks = [])).push(r, i.onDestroy))
          : (i = t.data[r]);
        const o = i.factory || (i.factory = tr(i.type)),
          s = Zt(_);
        try {
          const a = Ya(!1),
            l = o();
          return (
            Ya(a),
            (function VI(e, n, t, i) {
              t >= e.data.length && ((e.data[t] = null), (e.blueprint[t] = null)), (n[t] = i);
            })(t, C(), r, l),
            l
          );
        } finally {
          Zt(s);
        }
      }
      function xs(e, n, t) {
        const i = e + 22,
          r = C(),
          o = jr(r, i);
        return (function Fs(e, n) {
          return e[1].data[n].pure;
        })(r, i)
          ? I0(r, It(), n, o.transform, t, o)
          : o.transform(t);
      }
      function Lf(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const U = class WR extends pe {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, i) {
          let r = n,
            o = t || (() => null),
            s = i;
          if (n && 'object' == typeof n) {
            const l = n;
            (r = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = Lf(o)), r && (r = Lf(r)), s && (s = Lf(s)));
          const a = super.subscribe({ next: r, error: o, complete: s });
          return n instanceof Lt && n.add(a), a;
        }
      };
      function zR() {
        return this._results[or()]();
      }
      class Vf {
        constructor(n = !1) {
          (this._emitDistinctChangesOnly = n),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = or(),
            i = Vf.prototype;
          i[t] || (i[t] = zR);
        }
        get changes() {
          return this._changes || (this._changes = new U());
        }
        get(n) {
          return this._results[n];
        }
        map(n) {
          return this._results.map(n);
        }
        filter(n) {
          return this._results.filter(n);
        }
        find(n) {
          return this._results.find(n);
        }
        reduce(n, t) {
          return this._results.reduce(n, t);
        }
        forEach(n) {
          this._results.forEach(n);
        }
        some(n) {
          return this._results.some(n);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(n, t) {
          const i = this;
          i.dirty = !1;
          const r = zt(n);
          (this._changesDetected = !(function ZE(e, n, t) {
            if (e.length !== n.length) return !1;
            for (let i = 0; i < e.length; i++) {
              let r = e[i],
                o = n[i];
              if ((t && ((r = t(r)), (o = t(o))), o !== r)) return !1;
            }
            return !0;
          })(i._results, r, t)) &&
            ((i._results = r), (i.length = r.length), (i.last = r[this.length - 1]), (i.first = r[0]));
        }
        notifyOnChanges() {
          this._changes && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let He = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = QR), e;
      })();
      const KR = He,
        qR = class extends KR {
          constructor(n, t, i) {
            super(), (this._declarationLView = n), (this._declarationTContainer = t), (this.elementRef = i);
          }
          createEmbeddedView(n, t) {
            const i = this._declarationTContainer.tViews,
              r = yl(this._declarationLView, i, n, 16, null, i.declTNode, null, null, null, null, t || null);
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return null !== s && (r[19] = s.createEmbeddedView(i)), bl(i, r, n), new bs(r);
          }
        };
      function QR() {
        return kl(nt(), C());
      }
      function kl(e, n) {
        return 4 & e.type ? new qR(n, e, eo(e, n)) : null;
      }
      let Nn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = XR), e;
      })();
      function XR() {
        return L0(nt(), C());
      }
      const YR = Nn,
        F0 = class extends YR {
          constructor(n, t, i) {
            super(), (this._lContainer = n), (this._hostTNode = t), (this._hostLView = i);
          }
          get element() {
            return eo(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new $r(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = Ja(this._hostTNode, this._hostLView);
            if (T_(n)) {
              const t = Ur(n, this._hostLView),
                i = Gr(n);
              return new $r(t[1].data[i + 8], t);
            }
            return new $r(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = k0(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(n, t, i) {
            let r, o;
            'number' == typeof i ? (r = i) : null != i && ((r = i.index), (o = i.injector));
            const s = n.createEmbeddedView(t || {}, o);
            return this.insert(s, r), s;
          }
          createComponent(n, t, i, r, o) {
            const s =
              n &&
              !(function ns(e) {
                return 'function' == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const d = t || {};
              (a = d.index), (i = d.injector), (r = d.projectableNodes), (o = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? n : new Ds(_e(n)),
              c = i || this.parentInjector;
            if (!o && null == l.ngModule) {
              const f = (s ? c : this.parentInjector).get(Oi, null);
              f && (o = f);
            }
            const u = l.create(c, r, void 0, o);
            return this.insert(u.hostView, a), u;
          }
          insert(n, t) {
            const i = n._lView,
              r = i[1];
            if (
              (function bE(e) {
                return pn(e[3]);
              })(i)
            ) {
              const u = this.indexOf(n);
              if (-1 !== u) this.detach(u);
              else {
                const d = i[3],
                  f = new F0(d, d[6], d[3]);
                f.detach(f.indexOf(n));
              }
            }
            const o = this._adjustIndex(t),
              s = this._lContainer;
            !(function XM(e, n, t, i) {
              const r = 10 + i,
                o = t.length;
              i > 0 && (t[r - 1][4] = n),
                i < o - 10 ? ((n[4] = t[r]), k_(t, 10 + i, n)) : (t.push(n), (n[4] = null)),
                (n[3] = t);
              const s = n[17];
              null !== s &&
                t !== s &&
                (function YM(e, n) {
                  const t = e[9];
                  n[16] !== n[3][3][16] && (e[2] = !0), null === t ? (e[9] = [n]) : t.push(n);
                })(s, n);
              const a = n[19];
              null !== a && a.insertView(e), (n[2] |= 64);
            })(r, i, s, o);
            const a = Hd(o, s),
              l = i[J],
              c = fl(l, s[7]);
            return (
              null !== c &&
                (function KM(e, n, t, i, r, o) {
                  (i[0] = r), (i[6] = n), vs(e, i, t, 1, r, o);
                })(r, s[6], l, i, c, a),
              n.attachToViewContainerRef(),
              k_(Bf(s), o, n),
              n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = k0(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              i = Vd(this._lContainer, t);
            i && (tl(Bf(this._lContainer), t), km(i[1], i));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              i = Vd(this._lContainer, t);
            return i && null != tl(Bf(this._lContainer), t) ? new bs(i) : null;
          }
          _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
          }
        };
      function k0(e) {
        return e[8];
      }
      function Bf(e) {
        return e[8] || (e[8] = []);
      }
      function L0(e, n) {
        let t;
        const i = n[e.index];
        if (pn(i)) t = i;
        else {
          let r;
          if (8 & e.type) r = Ke(i);
          else {
            const o = n[J];
            r = o.createComment('');
            const s = nn(e, n);
            rr(
              o,
              fl(o, s),
              r,
              (function tO(e, n) {
                return e.nextSibling(n);
              })(o, s),
              !1
            );
          }
          (n[e.index] = t = Fv(i, n, r, e)), Dl(n, t);
        }
        return new F0(t, e, n);
      }
      class jf {
        constructor(n) {
          (this.queryList = n), (this.matches = null);
        }
        clone() {
          return new jf(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Hf {
        constructor(n = []) {
          this.queries = n;
        }
        createEmbeddedView(n) {
          const t = n.queries;
          if (null !== t) {
            const i = null !== n.contentQueries ? n.contentQueries[0] : t.length,
              r = [];
            for (let o = 0; o < i; o++) {
              const s = t.getByIndex(o);
              r.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new Hf(r);
          }
          return null;
        }
        insertView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        detachView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        dirtyQueriesWithMatches(n) {
          for (let t = 0; t < this.queries.length; t++) null !== G0(n, t).matches && this.queries[t].setDirty();
        }
      }
      class V0 {
        constructor(n, t, i = null) {
          (this.predicate = n), (this.flags = t), (this.read = i);
        }
      }
      class Gf {
        constructor(n = []) {
          this.queries = n;
        }
        elementStart(n, t) {
          for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(n, t);
        }
        elementEnd(n) {
          for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
          let t = null;
          for (let i = 0; i < this.length; i++) {
            const r = null !== t ? t.length : 0,
              o = this.getByIndex(i).embeddedTView(n, r);
            o && ((o.indexInDeclarationView = i), null !== t ? t.push(o) : (t = [o]));
          }
          return null !== t ? new Gf(t) : null;
        }
        template(n, t) {
          for (let i = 0; i < this.queries.length; i++) this.queries[i].template(n, t);
        }
        getByIndex(n) {
          return this.queries[n];
        }
        get length() {
          return this.queries.length;
        }
        track(n) {
          this.queries.push(n);
        }
      }
      class Uf {
        constructor(n, t = -1) {
          (this.metadata = n),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(n, t) {
          this.isApplyingToNode(t) && this.matchTNode(n, t);
        }
        elementEnd(n) {
          this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
        }
        template(n, t) {
          this.elementStart(n, t);
        }
        embeddedTView(n, t) {
          return this.isApplyingToNode(n)
            ? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, t), new Uf(this.metadata))
            : null;
        }
        isApplyingToNode(n) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let i = n.parent;
            for (; null !== i && 8 & i.type && i.index !== t; ) i = i.parent;
            return t === (null !== i ? i.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(n, t) {
          const i = this.metadata.predicate;
          if (Array.isArray(i))
            for (let r = 0; r < i.length; r++) {
              const o = i[r];
              this.matchTNodeWithReadOption(n, t, eP(t, o)), this.matchTNodeWithReadOption(n, t, el(t, n, o, !1, !1));
            }
          else
            i === He
              ? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
              : this.matchTNodeWithReadOption(n, t, el(t, n, i, !1, !1));
        }
        matchTNodeWithReadOption(n, t, i) {
          if (null !== i) {
            const r = this.metadata.read;
            if (null !== r)
              if (r === Ne || r === Nn || (r === He && 4 & t.type)) this.addMatch(t.index, -2);
              else {
                const o = el(t, n, r, !1, !1);
                null !== o && this.addMatch(t.index, o);
              }
            else this.addMatch(t.index, i);
          }
        }
        addMatch(n, t) {
          null === this.matches ? (this.matches = [n, t]) : this.matches.push(n, t);
        }
      }
      function eP(e, n) {
        const t = e.localNames;
        if (null !== t) for (let i = 0; i < t.length; i += 2) if (t[i] === n) return t[i + 1];
        return null;
      }
      function nP(e, n, t, i) {
        return -1 === t
          ? (function tP(e, n) {
              return 11 & e.type ? eo(e, n) : 4 & e.type ? kl(e, n) : null;
            })(n, e)
          : -2 === t
          ? (function iP(e, n, t) {
              return t === Ne ? eo(n, e) : t === He ? kl(n, e) : t === Nn ? L0(n, e) : void 0;
            })(e, n, i)
          : es(e, e[1], t, n);
      }
      function B0(e, n, t, i) {
        const r = n[19].queries[i];
        if (null === r.matches) {
          const o = e.data,
            s = t.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const c = s[l];
            a.push(c < 0 ? null : nP(n, o[c], s[l + 1], t.metadata.read));
          }
          r.matches = a;
        }
        return r.matches;
      }
      function $f(e, n, t, i) {
        const r = e.queries.getByIndex(t),
          o = r.matches;
        if (null !== o) {
          const s = B0(e, n, r, t);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) i.push(s[a / 2]);
            else {
              const c = o[a + 1],
                u = n[-l];
              for (let d = 10; d < u.length; d++) {
                const f = u[d];
                f[17] === f[3] && $f(f[1], f, c, i);
              }
              if (null !== u[9]) {
                const d = u[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  $f(h[1], h, c, i);
                }
              }
            }
          }
        }
        return i;
      }
      function Re(e) {
        const n = C(),
          t = ie(),
          i = g_();
        $u(i + 1);
        const r = G0(t, i);
        if (e.dirty && l_(n) === (2 == (2 & r.metadata.flags))) {
          if (null === r.matches) e.reset([]);
          else {
            const o = r.crossesNgTemplate ? $f(t, n, i, []) : B0(t, n, r, i);
            e.reset(o, uM), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function We(e, n, t, i) {
        const r = ie();
        if (r.firstCreatePass) {
          const o = nt();
          H0(r, new V0(n, t, i), o.index),
            (function oP(e, n) {
              const t = e.contentQueries || (e.contentQueries = []);
              n !== (t.length ? t[t.length - 1] : -1) && t.push(e.queries.length - 1, n);
            })(r, e),
            2 == (2 & t) && (r.staticContentQueries = !0);
        }
        j0(r, C(), t);
      }
      function Pe() {
        return (function rP(e, n) {
          return e[19].queries[n].queryList;
        })(C(), g_());
      }
      function j0(e, n, t) {
        const i = new Vf(4 == (4 & t));
        Ev(e, n, i, i.destroy), null === n[19] && (n[19] = new Hf()), n[19].queries.push(new jf(i));
      }
      function H0(e, n, t) {
        null === e.queries && (e.queries = new Gf()), e.queries.track(new Uf(n, t));
      }
      function G0(e, n) {
        return e.queries.getByIndex(n);
      }
      function Wn(e, n) {
        return kl(e, n);
      }
      function Vl(...e) {}
      const Ls = new k('Application Initializer');
      let Bl = (() => {
        class e {
          constructor(t) {
            (this.appInits = t),
              (this.resolve = Vl),
              (this.reject = Vl),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((i, r) => {
                (this.resolve = i), (this.reject = r);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              i = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let r = 0; r < this.appInits.length; r++) {
                const o = this.appInits[r]();
                if (Ns(o)) t.push(o);
                else if (wf(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  t.push(s);
                }
              }
            Promise.all(t)
              .then(() => {
                i();
              })
              .catch((r) => {
                this.reject(r);
              }),
              0 === t.length && i(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Ls, 8));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      const Vs = new k('AppId', {
        providedIn: 'root',
        factory: function ab() {
          return `${Xf()}${Xf()}${Xf()}`;
        },
      });
      function Xf() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const lb = new k('Platform Initializer'),
        To = new k('Platform ID', { providedIn: 'platform', factory: () => 'unknown' }),
        cb = new k('appBootstrapListener');
      let TP = (() => {
        class e {
          log(t) {
            console.log(t);
          }
          warn(t) {
            console.warn(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'platform' })),
          e
        );
      })();
      const ci = new k('LocaleId', {
        providedIn: 'root',
        factory: () =>
          $e(ci, B.Optional | B.SkipSelf) ||
          (function EP() {
            return (typeof $localize < 'u' && $localize.locale) || bo;
          })(),
      });
      class MP {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let Yf = (() => {
        class e {
          compileModuleSync(t) {
            return new xf(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const i = this.compileModuleSync(t),
              o = si(Ut(t).declarations).reduce((s, a) => {
                const l = _e(a);
                return l && s.push(new Ds(l)), s;
              }, []);
            return new MP(i, o);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      const AP = (() => Promise.resolve(0))();
      function Jf(e) {
        typeof Zone > 'u'
          ? AP.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask('scheduleMicrotask', e);
      }
      class me {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: i = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new U(!1)),
            (this.onMicrotaskEmpty = new U(!1)),
            (this.onStable = new U(!1)),
            (this.onError = new U(!1)),
            typeof Zone > 'u')
          )
            throw new S(908, !1);
          Zone.assertZonePatched();
          const r = this;
          if (((r._nesting = 0), (r._outer = r._inner = Zone.current), Zone.AsyncStackTaggingZoneSpec)) {
            const o = Zone.AsyncStackTaggingZoneSpec;
            r._inner = r._inner.fork(new o('Angular'));
          }
          Zone.TaskTrackingZoneSpec && (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n && Zone.longStackTraceZoneSpec && (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)),
            (r.shouldCoalesceEventChangeDetection = !i && t),
            (r.shouldCoalesceRunChangeDetection = i),
            (r.lastRequestAnimationFrameId = -1),
            (r.nativeRequestAnimationFrame = (function RP() {
              let e = ge.requestAnimationFrame,
                n = ge.cancelAnimationFrame;
              if (typeof Zone < 'u' && e && n) {
                const t = e[Zone.__symbol__('OriginalDelegate')];
                t && (e = t);
                const i = n[Zone.__symbol__('OriginalDelegate')];
                i && (n = i);
              }
              return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
            })().nativeRequestAnimationFrame),
            (function FP(e) {
              const n = () => {
                !(function xP(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(ge, () => {
                      e.fakeTopEventTask ||
                        (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                          'fakeTopEventTask',
                          () => {
                            (e.lastRequestAnimationFrameId = -1),
                              eh(e),
                              (e.isCheckStableRunning = !0),
                              Zf(e),
                              (e.isCheckStableRunning = !1);
                          },
                          void 0,
                          () => {},
                          () => {}
                        )),
                        e.fakeTopEventTask.invoke();
                    })),
                    eh(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: 'angular',
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, i, r, o, s, a) => {
                  try {
                    return fb(e), t.invokeTask(r, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection && 'eventTask' === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      hb(e);
                  }
                },
                onInvoke: (t, i, r, o, s, a, l) => {
                  try {
                    return fb(e), t.invoke(r, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), hb(e);
                  }
                },
                onHasTask: (t, i, r, o) => {
                  t.hasTask(r, o),
                    i === r &&
                      ('microTask' == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask), eh(e), Zf(e))
                        : 'macroTask' == o.change && (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (t, i, r, o) => (t.handleError(r, o), e.runOutsideAngular(() => e.onError.emit(o)), !1),
              });
            })(r);
        }
        static isInAngularZone() {
          return typeof Zone < 'u' && !0 === Zone.current.get('isAngularZone');
        }
        static assertInAngularZone() {
          if (!me.isInAngularZone()) throw new S(909, !1);
        }
        static assertNotInAngularZone() {
          if (me.isInAngularZone()) throw new S(909, !1);
        }
        run(n, t, i) {
          return this._inner.run(n, t, i);
        }
        runTask(n, t, i, r) {
          const o = this._inner,
            s = o.scheduleEventTask('NgZoneEvent: ' + r, n, PP, Vl, Vl);
          try {
            return o.runTask(s, t, i);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(n, t, i) {
          return this._inner.runGuarded(n, t, i);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const PP = {};
      function Zf(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function eh(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function fb(e) {
        e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function hb(e) {
        e._nesting--, Zf(e);
      }
      class kP {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new U()),
            (this.onMicrotaskEmpty = new U()),
            (this.onStable = new U()),
            (this.onError = new U());
        }
        run(n, t, i) {
          return n.apply(t, i);
        }
        runGuarded(n, t, i) {
          return n.apply(t, i);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, i, r) {
          return n.apply(t, i);
        }
      }
      const pb = new k(''),
        jl = new k('');
      let ih,
        th = (() => {
          class e {
            constructor(t, i, r) {
              (this._ngZone = t),
                (this.registry = i),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                ih ||
                  ((function LP(e) {
                    ih = e;
                  })(r),
                  r.addToWindow(i)),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone = typeof Zone > 'u' ? null : Zone.current.get('TaskTrackingZone');
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      me.assertNotInAngularZone(),
                        Jf(() => {
                          (this._isZoneStable = !0), this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error('pending async requests below zero');
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks;
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Jf(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (i) => !i.updateCb || !i.updateCb(t) || (clearTimeout(i.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, i, r) {
              let o = -1;
              i &&
                i > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter((s) => s.timeoutId !== o)),
                    t(this._didWork, this.getPendingTasks());
                }, i)),
                this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: r });
            }
            whenStable(t, i, r) {
              if (r && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, i, r), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(t) {
              this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
              this.registry.unregisterApplication(t);
            }
            findProviders(t, i, r) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(me), N(nh), N(jl));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        nh = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, i) {
              this._applications.set(t, i);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, i = !0) {
              return ih?.findTestabilityInTree(this, t, i) ?? null;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'platform' })),
            e
          );
        })(),
        Pi = null;
      const gb = new k('AllowMultipleToken'),
        rh = new k('PlatformDestroyListeners');
      class _b {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function vb(e, n, t = []) {
        const i = `Platform: ${n}`,
          r = new k(i);
        return (o = []) => {
          let s = oh();
          if (!s || s.injector.get(gb, !1)) {
            const a = [...t, ...o, { provide: r, useValue: !0 }];
            e
              ? e(a)
              : (function jP(e) {
                  if (Pi && !Pi.get(gb, !1)) throw new S(400, !1);
                  Pi = e;
                  const n = e.get(bb);
                  (function mb(e) {
                    const n = e.get(lb, null);
                    n && n.forEach((t) => t());
                  })(e);
                })(
                  (function yb(e = [], n) {
                    return pt.create({
                      name: n,
                      providers: [
                        { provide: md, useValue: 'platform' },
                        { provide: rh, useValue: new Set([() => (Pi = null)]) },
                        ...e,
                      ],
                    });
                  })(a, i)
                );
          }
          return (function GP(e) {
            const n = oh();
            if (!n) throw new S(401, !1);
            return n;
          })();
        };
      }
      function oh() {
        return Pi?.get(bb) ?? null;
      }
      let bb = (() => {
        class e {
          constructor(t) {
            (this._injector = t), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, i) {
            const r = (function UP(e, n) {
                let t;
                return (t = 'noop' === e ? new kP() : ('zone.js' === e ? void 0 : e) || new me(n)), t;
              })(
                i?.ngZone,
                (function Db(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection: !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection: !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(i)
              ),
              o = [{ provide: me, useValue: r }];
            return r.run(() => {
              const s = pt.create({ providers: o, parent: this.injector, name: t.moduleType.name }),
                a = t.create(s),
                l = a.injector.get(to, null);
              if (!l) throw new S(402, !1);
              return (
                r.runOutsideAngular(() => {
                  const c = r.onError.subscribe({
                    next: (u) => {
                      l.handleError(u);
                    },
                  });
                  a.onDestroy(() => {
                    Hl(this._modules, a), c.unsubscribe();
                  });
                }),
                (function Cb(e, n, t) {
                  try {
                    const i = t();
                    return Ns(i)
                      ? i.catch((r) => {
                          throw (n.runOutsideAngular(() => e.handleError(r)), r);
                        })
                      : i;
                  } catch (i) {
                    throw (n.runOutsideAngular(() => e.handleError(i)), i);
                  }
                })(l, r, () => {
                  const c = a.injector.get(Bl);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        (function Xy(e) {
                          Gt(e, 'Expected localeId to be defined'),
                            'string' == typeof e && (Qy = e.toLowerCase().replace(/_/g, '-'));
                        })(a.injector.get(ci, bo) || bo),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, i = []) {
            const r = wb({}, i);
            return (function VP(e, n, t) {
              const i = new xf(t);
              return Promise.resolve(i);
            })(0, 0, t).then((o) => this.bootstrapModuleFactory(o, r));
          }
          _moduleDoBootstrap(t) {
            const i = t.injector.get(Eo);
            if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach((r) => i.bootstrap(r));
            else {
              if (!t.instance.ngDoBootstrap) throw new S(403, !1);
              t.instance.ngDoBootstrap(i);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new S(404, !1);
            this._modules.slice().forEach((i) => i.destroy()), this._destroyListeners.forEach((i) => i());
            const t = this._injector.get(rh, null);
            t && (t.forEach((i) => i()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(pt));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'platform' })),
          e
        );
      })();
      function wb(e, n) {
        return Array.isArray(n) ? n.reduce(wb, e) : { ...e, ...n };
      }
      let Eo = (() => {
        class e {
          constructor(t, i, r) {
            (this._zone = t),
              (this._injector = i),
              (this._exceptionHandler = r),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this._zone.run(() => {
                    this.tick();
                  });
                },
              }));
            const o = new he((a) => {
                (this._stable =
                  this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new he((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    me.assertNotInAngularZone(),
                      Jf(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  me.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = Ra(o, s.pipe(qg()));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(t, i) {
            const r = t instanceof vm;
            if (!this._injector.get(Bl).done)
              throw (
                (!r &&
                  (function wo(e) {
                    const n = _e(e) || St(e) || Mt(e);
                    return null !== n && n.standalone;
                  })(t),
                new S(405, false))
              );
            let s;
            (s = r ? t : this._injector.get(ps).resolveComponentFactory(t)), this.componentTypes.push(s.componentType);
            const a = (function BP(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(cr),
              c = s.create(pt.NULL, [], i || s.selector, a),
              u = c.location.nativeElement,
              d = c.injector.get(pb, null);
            return (
              d?.registerApplication(u),
              c.onDestroy(() => {
                this.detachView(c.hostView), Hl(this.components, c), d?.unregisterApplication(u);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new S(101, !1);
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(t));
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const i = t;
            this._views.push(i), i.attachToAppRef(this);
          }
          detachView(t) {
            const i = t;
            Hl(this._views, i), i.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView),
              this.tick(),
              this.components.push(t),
              this._injector
                .get(cb, [])
                .concat(this._bootstrapListeners)
                .forEach((r) => r(t));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((t) => t()),
                  this._views.slice().forEach((t) => t.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(t) {
            return this._destroyListeners.push(t), () => Hl(this._destroyListeners, t);
          }
          destroy() {
            if (this._destroyed) throw new S(406, !1);
            const t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(me), N(Oi), N(to));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      function Hl(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      let Tb = !0,
        En = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = zP), e;
        })();
      function zP(e) {
        return (function KP(e, n, t) {
          if (Ha(e) && !t) {
            const i = Wt(e.index, n);
            return new bs(i, i);
          }
          return 47 & e.type ? new bs(n[16], n) : null;
        })(nt(), C(), 16 == (16 & e));
      }
      class Ib {
        constructor() {}
        supports(n) {
          return Cs(n);
        }
        create(n) {
          return new ZP(n);
        }
      }
      const JP = (e, n) => n;
      class ZP {
        constructor(n) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = n || JP);
        }
        forEachItem(n) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) n(t);
        }
        forEachOperation(n) {
          let t = this._itHead,
            i = this._removalsHead,
            r = 0,
            o = null;
          for (; t || i; ) {
            const s = !i || (t && t.currentIndex < Rb(i, r, o)) ? t : i,
              a = Rb(s, r, o),
              l = s.currentIndex;
            if (s === i) r--, (i = i._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) r++;
            else {
              o || (o = []);
              const c = a - r,
                u = l - r;
              if (c != u) {
                for (let f = 0; f < c; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  u <= p && p < c && (o[f] = h + 1);
                }
                o[s.previousIndex] = u - c;
              }
            }
            a !== l && n(s, a, l);
          }
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachMovedItem(n) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        forEachIdentityChange(n) {
          let t;
          for (t = this._identityChangesHead; null !== t; t = t._nextIdentityChange) n(t);
        }
        diff(n) {
          if ((null == n && (n = []), !Cs(n))) throw new S(900, !1);
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let r,
            o,
            s,
            t = this._itHead,
            i = !1;
          if (Array.isArray(n)) {
            this.length = n.length;
            for (let a = 0; a < this.length; a++)
              (o = n[a]),
                (s = this._trackByFn(a, o)),
                null !== t && Object.is(t.trackById, s)
                  ? (i && (t = this._verifyReinsertion(t, o, s, a)),
                    Object.is(t.item, o) || this._addIdentityChange(t, o))
                  : ((t = this._mismatch(t, o, s, a)), (i = !0)),
                (t = t._next);
          } else
            (r = 0),
              (function PI(e, n) {
                if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
                else {
                  const t = e[or()]();
                  let i;
                  for (; !(i = t.next()).done; ) n(i.value);
                }
              })(n, (a) => {
                (s = this._trackByFn(r, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (i && (t = this._verifyReinsertion(t, a, s, r)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, r)), (i = !0)),
                  (t = t._next),
                  r++;
              }),
              (this.length = r);
          return this._truncate(t), (this.collection = n), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (n = this._previousItHead = this._itHead; null !== n; n = n._next) n._nextPrevious = n._next;
            for (n = this._additionsHead; null !== n; n = n._nextAdded) n.previousIndex = n.currentIndex;
            for (this._additionsHead = this._additionsTail = null, n = this._movesHead; null !== n; n = n._nextMoved)
              n.previousIndex = n.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(n, t, i, r) {
          let o;
          return (
            null === n ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
            null !== (n = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(i, null))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._reinsertAfter(n, o, r))
              : null !== (n = null === this._linkedRecords ? null : this._linkedRecords.get(i, r))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._moveAfter(n, o, r))
              : (n = this._addAfter(new ex(t, i), o, r)),
            n
          );
        }
        _verifyReinsertion(n, t, i, r) {
          let o = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(i, null);
          return (
            null !== o
              ? (n = this._reinsertAfter(o, n._prev, r))
              : n.currentIndex != r && ((n.currentIndex = r), this._addToMoves(n, r)),
            n
          );
        }
        _truncate(n) {
          for (; null !== n; ) {
            const t = n._next;
            this._addToRemovals(this._unlink(n)), (n = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail && (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(n, t, i) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
          const r = n._prevRemoved,
            o = n._nextRemoved;
          return (
            null === r ? (this._removalsHead = o) : (r._nextRemoved = o),
            null === o ? (this._removalsTail = r) : (o._prevRemoved = r),
            this._insertAfter(n, t, i),
            this._addToMoves(n, i),
            n
          );
        }
        _moveAfter(n, t, i) {
          return this._unlink(n), this._insertAfter(n, t, i), this._addToMoves(n, i), n;
        }
        _addAfter(n, t, i) {
          return (
            this._insertAfter(n, t, i),
            (this._additionsTail =
              null === this._additionsTail ? (this._additionsHead = n) : (this._additionsTail._nextAdded = n)),
            n
          );
        }
        _insertAfter(n, t, i) {
          const r = null === t ? this._itHead : t._next;
          return (
            (n._next = r),
            (n._prev = t),
            null === r ? (this._itTail = n) : (r._prev = n),
            null === t ? (this._itHead = n) : (t._next = n),
            null === this._linkedRecords && (this._linkedRecords = new Ab()),
            this._linkedRecords.put(n),
            (n.currentIndex = i),
            n
          );
        }
        _remove(n) {
          return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
          null !== this._linkedRecords && this._linkedRecords.remove(n);
          const t = n._prev,
            i = n._next;
          return null === t ? (this._itHead = i) : (t._next = i), null === i ? (this._itTail = t) : (i._prev = t), n;
        }
        _addToMoves(n, t) {
          return (
            n.previousIndex === t ||
              (this._movesTail = null === this._movesTail ? (this._movesHead = n) : (this._movesTail._nextMoved = n)),
            n
          );
        }
        _addToRemovals(n) {
          return (
            null === this._unlinkedRecords && (this._unlinkedRecords = new Ab()),
            this._unlinkedRecords.put(n),
            (n.currentIndex = null),
            (n._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = n), (n._prevRemoved = null))
              : ((n._prevRemoved = this._removalsTail), (this._removalsTail = this._removalsTail._nextRemoved = n)),
            n
          );
        }
        _addIdentityChange(n, t) {
          return (
            (n.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = n)
                : (this._identityChangesTail._nextIdentityChange = n)),
            n
          );
        }
      }
      class ex {
        constructor(n, t) {
          (this.item = n),
            (this.trackById = t),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class tx {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(n) {
          null === this._head
            ? ((this._head = this._tail = n), (n._nextDup = null), (n._prevDup = null))
            : ((this._tail._nextDup = n), (n._prevDup = this._tail), (n._nextDup = null), (this._tail = n));
        }
        get(n, t) {
          let i;
          for (i = this._head; null !== i; i = i._nextDup)
            if ((null === t || t <= i.currentIndex) && Object.is(i.trackById, n)) return i;
          return null;
        }
        remove(n) {
          const t = n._prevDup,
            i = n._nextDup;
          return (
            null === t ? (this._head = i) : (t._nextDup = i),
            null === i ? (this._tail = t) : (i._prevDup = t),
            null === this._head
          );
        }
      }
      class Ab {
        constructor() {
          this.map = new Map();
        }
        put(n) {
          const t = n.trackById;
          let i = this.map.get(t);
          i || ((i = new tx()), this.map.set(t, i)), i.add(n);
        }
        get(n, t) {
          const r = this.map.get(n);
          return r ? r.get(n, t) : null;
        }
        remove(n) {
          const t = n.trackById;
          return this.map.get(t).remove(n) && this.map.delete(t), n;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Rb(e, n, t) {
        const i = e.previousIndex;
        if (null === i) return i;
        let r = 0;
        return t && i < t.length && (r = t[i]), i + n + r;
      }
      class Pb {
        constructor() {}
        supports(n) {
          return n instanceof Map || Df(n);
        }
        create() {
          return new nx();
        }
      }
      class nx {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead;
        }
        forEachItem(n) {
          let t;
          for (t = this._mapHead; null !== t; t = t._next) n(t);
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousMapHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachChangedItem(n) {
          let t;
          for (t = this._changesHead; null !== t; t = t._nextChanged) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        diff(n) {
          if (n) {
            if (!(n instanceof Map || Df(n))) throw new S(900, !1);
          } else n = new Map();
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let t = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(n, (i, r) => {
              if (t && t.key === r) this._maybeAddToChanges(t, i), (this._appendAfter = t), (t = t._next);
              else {
                const o = this._getOrCreateRecordForKey(r, i);
                t = this._insertBeforeOrAppend(t, o);
              }
            }),
            t)
          ) {
            t._prev && (t._prev._next = null), (this._removalsHead = t);
            for (let i = t; null !== i; i = i._nextRemoved)
              i === this._mapHead && (this._mapHead = null),
                this._records.delete(i.key),
                (i._nextRemoved = i._next),
                (i.previousValue = i.currentValue),
                (i.currentValue = null),
                (i._prev = null),
                (i._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(n, t) {
          if (n) {
            const i = n._prev;
            return (
              (t._next = n),
              (t._prev = i),
              (n._prev = t),
              i && (i._next = t),
              n === this._mapHead && (this._mapHead = t),
              (this._appendAfter = n),
              n
            );
          }
          return (
            this._appendAfter ? ((this._appendAfter._next = t), (t._prev = this._appendAfter)) : (this._mapHead = t),
            (this._appendAfter = t),
            null
          );
        }
        _getOrCreateRecordForKey(n, t) {
          if (this._records.has(n)) {
            const r = this._records.get(n);
            this._maybeAddToChanges(r, t);
            const o = r._prev,
              s = r._next;
            return o && (o._next = s), s && (s._prev = o), (r._next = null), (r._prev = null), r;
          }
          const i = new ix(n);
          return this._records.set(n, i), (i.currentValue = t), this._addToAdditions(i), i;
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (this._previousMapHead = this._mapHead, n = this._previousMapHead; null !== n; n = n._next)
              n._nextPrevious = n._next;
            for (n = this._changesHead; null !== n; n = n._nextChanged) n.previousValue = n.currentValue;
            for (n = this._additionsHead; null != n; n = n._nextAdded) n.previousValue = n.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(n, t) {
          Object.is(t, n.currentValue) ||
            ((n.previousValue = n.currentValue), (n.currentValue = t), this._addToChanges(n));
        }
        _addToAdditions(n) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = n)
            : ((this._additionsTail._nextAdded = n), (this._additionsTail = n));
        }
        _addToChanges(n) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = n)
            : ((this._changesTail._nextChanged = n), (this._changesTail = n));
        }
        _forEach(n, t) {
          n instanceof Map ? n.forEach(t) : Object.keys(n).forEach((i) => t(n[i], i));
        }
      }
      class ix {
        constructor(n) {
          (this.key = n),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function xb() {
        return new $l([new Ib()]);
      }
      let $l = (() => {
        class e {
          constructor(t) {
            this.factories = t;
          }
          static create(t, i) {
            if (null != i) {
              const r = i.factories.slice();
              t = t.concat(r);
            }
            return new e(t);
          }
          static extend(t) {
            return { provide: e, useFactory: (i) => e.create(t, i || xb()), deps: [[e, new ls(), new as()]] };
          }
          find(t) {
            const i = this.factories.find((r) => r.supports(t));
            if (null != i) return i;
            throw new S(901, !1);
          }
        }
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: xb })), e;
      })();
      function Fb() {
        return new Bs([new Pb()]);
      }
      let Bs = (() => {
        class e {
          constructor(t) {
            this.factories = t;
          }
          static create(t, i) {
            if (i) {
              const r = i.factories.slice();
              t = t.concat(r);
            }
            return new e(t);
          }
          static extend(t) {
            return { provide: e, useFactory: (i) => e.create(t, i || Fb()), deps: [[e, new ls(), new as()]] };
          }
          find(t) {
            const i = this.factories.find((r) => r.supports(t));
            if (i) return i;
            throw new S(901, !1);
          }
        }
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: Fb })), e;
      })();
      const sx = vb(null, 'core', []);
      let ax = (() => {
        class e {
          constructor(t) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Eo));
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({})),
          e
        );
      })();
      function di(e) {
        return 'boolean' == typeof e ? e : null != e && 'false' !== e;
      }
      function uh(e, n) {
        const t = _e(e),
          i = n.elementInjector || dl();
        return new Ds(t).create(i, n.projectableNodes, n.hostElement, n.environmentInjector);
      }
      let Wl = null;
      function zn() {
        return Wl;
      }
      const Xe = new k('DocumentToken');
      let dh = (() => {
        class e {
          historyGo(t) {
            throw new Error('Not implemented');
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return (function dx() {
                return N(kb);
              })();
            },
            providedIn: 'platform',
          })),
          e
        );
      })();
      const fx = new k('Location Initialized');
      let kb = (() => {
        class e extends dh {
          constructor(t) {
            super(), (this._doc = t), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return zn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const i = zn().getGlobalEventTarget(this._doc, 'window');
            return i.addEventListener('popstate', t, !1), () => i.removeEventListener('popstate', t);
          }
          onHashChange(t) {
            const i = zn().getGlobalEventTarget(this._doc, 'window');
            return i.addEventListener('hashchange', t, !1), () => i.removeEventListener('hashchange', t);
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(t) {
            this.location.pathname = t;
          }
          pushState(t, i, r) {
            Lb() ? this._history.pushState(t, i, r) : (this.location.hash = r);
          }
          replaceState(t, i, r) {
            Lb() ? this._history.replaceState(t, i, r) : (this.location.hash = r);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Xe));
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return (function hx() {
                return new kb(N(Xe));
              })();
            },
            providedIn: 'platform',
          })),
          e
        );
      })();
      function Lb() {
        return !!window.history.pushState;
      }
      function fh(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith('/') && t++, n.startsWith('/') && t++, 2 == t ? e + n.substring(1) : 1 == t ? e + n : e + '/' + n
        );
      }
      function Vb(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ('/' === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function fi(e) {
        return e && '?' !== e[0] ? '?' + e : e;
      }
      let dr = (() => {
        class e {
          historyGo(t) {
            throw new Error('Not implemented');
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return $e(jb);
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      const Bb = new k('appBaseHref');
      let jb = (() => {
          class e extends dr {
            constructor(t, i) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref = i ?? this._platformLocation.getBaseHrefFromDOM() ?? $e(Xe).location?.origin ?? '');
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return fh(this._baseHref, t);
            }
            path(t = !1) {
              const i = this._platformLocation.pathname + fi(this._platformLocation.search),
                r = this._platformLocation.hash;
              return r && t ? `${i}${r}` : i;
            }
            pushState(t, i, r, o) {
              const s = this.prepareExternalUrl(r + fi(o));
              this._platformLocation.pushState(t, i, s);
            }
            replaceState(t, i, r, o) {
              const s = this.prepareExternalUrl(r + fi(o));
              this._platformLocation.replaceState(t, i, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(dh), N(Bb, 8));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        px = (() => {
          class e extends dr {
            constructor(t, i) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ''),
                (this._removeListenerFns = []),
                null != i && (this._baseHref = i);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let i = this._platformLocation.hash;
              return null == i && (i = '#'), i.length > 0 ? i.substring(1) : i;
            }
            prepareExternalUrl(t) {
              const i = fh(this._baseHref, t);
              return i.length > 0 ? '#' + i : i;
            }
            pushState(t, i, r, o) {
              let s = this.prepareExternalUrl(r + fi(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.pushState(t, i, s);
            }
            replaceState(t, i, r, o) {
              let s = this.prepareExternalUrl(r + fi(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.replaceState(t, i, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(dh), N(Bb, 8));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        hh = (() => {
          class e {
            constructor(t) {
              (this._subject = new U()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const i = this._locationStrategy.getBaseHref();
              (this._baseHref = Vb(Hb(i))),
                this._locationStrategy.onPopState((r) => {
                  this._subject.emit({ url: this.path(!0), pop: !0, state: r.state, type: r.type });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
            }
            path(t = !1) {
              return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, i = '') {
              return this.path() == this.normalize(t + fi(i));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function _x(e, n) {
                  return e && n.startsWith(e) ? n.substring(e.length) : n;
                })(this._baseHref, Hb(t))
              );
            }
            prepareExternalUrl(t) {
              return t && '/' !== t[0] && (t = '/' + t), this._locationStrategy.prepareExternalUrl(t);
            }
            go(t, i = '', r = null) {
              this._locationStrategy.pushState(r, '', t, i),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(t + fi(i)), r);
            }
            replaceState(t, i = '', r = null) {
              this._locationStrategy.replaceState(r, '', t, i),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(t + fi(i)), r);
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(t = 0) {
              this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
              return (
                this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((i) => {
                    this._notifyUrlChangeListeners(i.url, i.state);
                  })),
                () => {
                  const i = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(i, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = '', i) {
              this._urlChangeListeners.forEach((r) => r(t, i));
            }
            subscribe(t, i, r) {
              return this._subject.subscribe({ next: t, error: i, complete: r });
            }
          }
          return (
            (e.normalizeQueryParams = fi),
            (e.joinWithSlash = fh),
            (e.stripTrailingSlash = Vb),
            (e.ɵfac = function (t) {
              return new (t || e)(N(dr));
            }),
            (e.ɵprov = M({
              token: e,
              factory: function () {
                return (function gx() {
                  return new hh(N(dr));
                })();
              },
              providedIn: 'root',
            })),
            e
          );
        })();
      function Hb(e) {
        return e.replace(/\/index.html$/, '');
      }
      function Xb(e, n) {
        n = encodeURIComponent(n);
        for (const t of e.split(';')) {
          const i = t.indexOf('='),
            [r, o] = -1 == i ? [t, ''] : [t.slice(0, i), t.slice(i + 1)];
          if (r.trim() === n) return decodeURIComponent(o);
        }
        return null;
      }
      let Yb = (() => {
        class e {
          constructor(t, i, r, o) {
            (this._iterableDiffers = t),
              (this._keyValueDiffers = i),
              (this._ngEl = r),
              (this._renderer = o),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._initialClasses = []),
              (this._rawClass = null);
          }
          set klass(t) {
            this._removeClasses(this._initialClasses),
              (this._initialClasses = 'string' == typeof t ? t.split(/\s+/) : []),
              this._applyClasses(this._initialClasses),
              this._applyClasses(this._rawClass);
          }
          set ngClass(t) {
            this._removeClasses(this._rawClass),
              this._applyClasses(this._initialClasses),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._rawClass = 'string' == typeof t ? t.split(/\s+/) : t),
              this._rawClass &&
                (Cs(this._rawClass)
                  ? (this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create())
                  : (this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create()));
          }
          ngDoCheck() {
            if (this._iterableDiffer) {
              const t = this._iterableDiffer.diff(this._rawClass);
              t && this._applyIterableChanges(t);
            } else if (this._keyValueDiffer) {
              const t = this._keyValueDiffer.diff(this._rawClass);
              t && this._applyKeyValueChanges(t);
            }
          }
          _applyKeyValueChanges(t) {
            t.forEachAddedItem((i) => this._toggleClass(i.key, i.currentValue)),
              t.forEachChangedItem((i) => this._toggleClass(i.key, i.currentValue)),
              t.forEachRemovedItem((i) => {
                i.previousValue && this._toggleClass(i.key, !1);
              });
          }
          _applyIterableChanges(t) {
            t.forEachAddedItem((i) => {
              if ('string' != typeof i.item)
                throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${ye(i.item)}`);
              this._toggleClass(i.item, !0);
            }),
              t.forEachRemovedItem((i) => this._toggleClass(i.item, !1));
          }
          _applyClasses(t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach((i) => this._toggleClass(i, !0))
                : Object.keys(t).forEach((i) => this._toggleClass(i, !!t[i])));
          }
          _removeClasses(t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach((i) => this._toggleClass(i, !1))
                : Object.keys(t).forEach((i) => this._toggleClass(i, !1)));
          }
          _toggleClass(t, i) {
            (t = t.trim()) &&
              t.split(/\s+/g).forEach((r) => {
                i
                  ? this._renderer.addClass(this._ngEl.nativeElement, r)
                  : this._renderer.removeClass(this._ngEl.nativeElement, r);
              });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_($l), _(Bs), _(Ne), _(vn));
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [['', 'ngClass', '']],
            inputs: { klass: ['class', 'klass'], ngClass: 'ngClass' },
            standalone: !0,
          })),
          e
        );
      })();
      class eF {
        constructor(n, t, i, r) {
          (this.$implicit = n), (this.ngForOf = t), (this.index = i), (this.count = r);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let fr = (() => {
        class e {
          constructor(t, i, r) {
            (this._viewContainer = t),
              (this._template = i),
              (this._differs = r),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(t) {
            (this._ngForOf = t), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(t) {
            this._trackByFn = t;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(t) {
            t && (this._template = t);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const t = this._ngForOf;
              !this._differ && t && (this._differ = this._differs.find(t).create(this.ngForTrackBy));
            }
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf);
              t && this._applyChanges(t);
            }
          }
          _applyChanges(t) {
            const i = this._viewContainer;
            t.forEachOperation((r, o, s) => {
              if (null == r.previousIndex)
                i.createEmbeddedView(this._template, new eF(r.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
              else if (null == s) i.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = i.get(o);
                i.move(a, s), eD(a, r);
              }
            });
            for (let r = 0, o = i.length; r < o; r++) {
              const a = i.get(r).context;
              (a.index = r), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((r) => {
              eD(i.get(r.currentIndex), r);
            });
          }
          static ngTemplateContextGuard(t, i) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Nn), _(He), _($l));
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [['', 'ngFor', '', 'ngForOf', '']],
            inputs: { ngForOf: 'ngForOf', ngForTrackBy: 'ngForTrackBy', ngForTemplate: 'ngForTemplate' },
            standalone: !0,
          })),
          e
        );
      })();
      function eD(e, n) {
        e.context.$implicit = n.item;
      }
      let hr = (() => {
        class e {
          constructor(t, i) {
            (this._viewContainer = t),
              (this._context = new nF()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = i);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t), this._updateView();
          }
          set ngIfThen(t) {
            tD('ngIfThen', t), (this._thenTemplateRef = t), (this._thenViewRef = null), this._updateView();
          }
          set ngIfElse(t) {
            tD('ngIfElse', t), (this._elseTemplateRef = t), (this._elseViewRef = null), this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context)))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)));
          }
          static ngTemplateContextGuard(t, i) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Nn), _(He));
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [['', 'ngIf', '']],
            inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
            standalone: !0,
          })),
          e
        );
      })();
      class nF {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function tD(e, n) {
        if (n && !n.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${ye(n)}'.`);
      }
      let Ze = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({})),
          e
        );
      })();
      const rD = 'browser';
      function Sh(e) {
        return e === rD;
      }
      let AF = (() => {
        class e {}
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: () => new RF(N(Xe), window) })), e;
      })();
      class RF {
        constructor(n, t) {
          (this.document = n), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(n) {
          this.offset = Array.isArray(n) ? () => n : n;
        }
        getScrollPosition() {
          return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0];
        }
        scrollToPosition(n) {
          this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
          if (!this.supportsScrolling()) return;
          const t = (function PF(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if ('function' == typeof e.createTreeWalker && e.body && (e.body.createShadowRoot || e.body.attachShadow)) {
              const i = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let r = i.currentNode;
              for (; r; ) {
                const o = r.shadowRoot;
                if (o) {
                  const s = o.getElementById(n) || o.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                r = i.nextNode();
              }
            }
            return null;
          })(this.document, n);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
          if (this.supportScrollRestoration()) {
            const t = this.window.history;
            t && t.scrollRestoration && (t.scrollRestoration = n);
          }
        }
        scrollToElement(n) {
          const t = n.getBoundingClientRect(),
            i = t.left + this.window.pageXOffset,
            r = t.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(i - o[0], r - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const n = oD(this.window.history) || oD(Object.getPrototypeOf(this.window.history));
            return !(!n || (!n.writable && !n.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return !!this.window && !!this.window.scrollTo && 'pageXOffset' in this.window;
          } catch {
            return !1;
          }
        }
      }
      function oD(e) {
        return Object.getOwnPropertyDescriptor(e, 'scrollRestoration');
      }
      class sD {}
      class Mh extends class xF extends class ux {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function cx(e) {
            Wl || (Wl = e);
          })(new Mh());
        }
        onAndCancel(n, t, i) {
          return (
            n.addEventListener(t, i, !1),
            () => {
              n.removeEventListener(t, i, !1);
            }
          );
        }
        dispatchEvent(n, t) {
          n.dispatchEvent(t);
        }
        remove(n) {
          n.parentNode && n.parentNode.removeChild(n);
        }
        createElement(n, t) {
          return (t = t || this.getDefaultDocument()).createElement(n);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument('fakeTitle');
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
          return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
          return 'window' === t ? window : 'document' === t ? n : 'body' === t ? n.body : null;
        }
        getBaseHref(n) {
          const t = (function FF() {
            return (Us = Us || document.querySelector('base')), Us ? Us.getAttribute('href') : null;
          })();
          return null == t
            ? null
            : (function kF(e) {
                (tc = tc || document.createElement('a')), tc.setAttribute('href', e);
                const n = tc.pathname;
                return '/' === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          Us = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return Xb(document.cookie, n);
        }
      }
      let tc,
        Us = null;
      const aD = new k('TRANSITION_ID'),
        VF = [
          {
            provide: Ls,
            useFactory: function LF(e, n, t) {
              return () => {
                t.get(Bl).donePromise.then(() => {
                  const i = zn(),
                    r = n.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < r.length; o++) i.remove(r[o]);
                });
              };
            },
            deps: [aD, Xe, pt],
            multi: !0,
          },
        ];
      let jF = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const nc = new k('EventManagerPlugins');
      let ic = (() => {
        class e {
          constructor(t, i) {
            (this._zone = i),
              (this._eventNameToPlugin = new Map()),
              t.forEach((r) => (r.manager = this)),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, i, r) {
            return this._findPluginFor(i).addEventListener(t, i, r);
          }
          addGlobalEventListener(t, i, r) {
            return this._findPluginFor(i).addGlobalEventListener(t, i, r);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            const i = this._eventNameToPlugin.get(t);
            if (i) return i;
            const r = this._plugins;
            for (let o = 0; o < r.length; o++) {
              const s = r[o];
              if (s.supports(t)) return this._eventNameToPlugin.set(t, s), s;
            }
            throw new Error(`No event manager plugin found for event ${t}`);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(nc), N(me));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class lD {
        constructor(n) {
          this._doc = n;
        }
        addGlobalEventListener(n, t, i) {
          const r = zn().getGlobalEventTarget(this._doc, n);
          if (!r) throw new Error(`Unsupported event target ${r} for event ${t}`);
          return this.addEventListener(r, t, i);
        }
      }
      let cD = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(t) {
              const i = new Set();
              t.forEach((r) => {
                this._stylesSet.has(r) || (this._stylesSet.add(r), i.add(r));
              }),
                this.onStylesAdded(i);
            }
            onStylesAdded(t) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        $s = (() => {
          class e extends cD {
            constructor(t) {
              super(), (this._doc = t), (this._hostNodes = new Map()), this._hostNodes.set(t.head, []);
            }
            _addStylesToHost(t, i, r) {
              t.forEach((o) => {
                const s = this._doc.createElement('style');
                (s.textContent = o), r.push(i.appendChild(s));
              });
            }
            addHost(t) {
              const i = [];
              this._addStylesToHost(this._stylesSet, t, i), this._hostNodes.set(t, i);
            }
            removeHost(t) {
              const i = this._hostNodes.get(t);
              i && i.forEach(uD), this._hostNodes.delete(t);
            }
            onStylesAdded(t) {
              this._hostNodes.forEach((i, r) => {
                this._addStylesToHost(t, r, i);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((t) => t.forEach(uD));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(Xe));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function uD(e) {
        zn().remove(e);
      }
      const Oh = {
          svg: 'http://www.w3.org/2000/svg',
          xhtml: 'http://www.w3.org/1999/xhtml',
          xlink: 'http://www.w3.org/1999/xlink',
          xml: 'http://www.w3.org/XML/1998/namespace',
          xmlns: 'http://www.w3.org/2000/xmlns/',
          math: 'http://www.w3.org/1998/MathML/',
        },
        Ih = /%COMP%/g;
      function rc(e, n, t) {
        for (let i = 0; i < n.length; i++) {
          let r = n[i];
          Array.isArray(r) ? rc(e, r, t) : ((r = r.replace(Ih, e)), t.push(r));
        }
        return t;
      }
      function hD(e) {
        return (n) => {
          if ('__ngUnwrap__' === n) return e;
          !1 === e(n) && (n.preventDefault(), (n.returnValue = !1));
        };
      }
      let Ah = (() => {
        class e {
          constructor(t, i, r) {
            (this.eventManager = t),
              (this.sharedStylesHost = i),
              (this.appId = r),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Rh(t));
          }
          createRenderer(t, i) {
            if (!t || !i) return this.defaultRenderer;
            switch (i.encapsulation) {
              case Fn.Emulated: {
                let r = this.rendererByCompId.get(i.id);
                return (
                  r ||
                    ((r = new zF(this.eventManager, this.sharedStylesHost, i, this.appId)),
                    this.rendererByCompId.set(i.id, r)),
                  r.applyToHost(t),
                  r
                );
              }
              case 1:
              case Fn.ShadowDom:
                return new KF(this.eventManager, this.sharedStylesHost, t, i);
              default:
                if (!this.rendererByCompId.has(i.id)) {
                  const r = rc(i.id, i.styles, []);
                  this.sharedStylesHost.addStyles(r), this.rendererByCompId.set(i.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(ic), N($s), N(Vs));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Rh {
        constructor(n) {
          (this.eventManager = n), (this.data = Object.create(null)), (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t ? document.createElementNS(Oh[t] || t, n) : document.createElement(n);
        }
        createComment(n) {
          return document.createComment(n);
        }
        createText(n) {
          return document.createTextNode(n);
        }
        appendChild(n, t) {
          (gD(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, i) {
          n && (gD(n) ? n.content : n).insertBefore(t, i);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let i = 'string' == typeof n ? document.querySelector(n) : n;
          if (!i) throw new Error(`The selector "${n}" did not match any elements`);
          return t || (i.textContent = ''), i;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, i, r) {
          if (r) {
            t = r + ':' + t;
            const o = Oh[r];
            o ? n.setAttributeNS(o, t, i) : n.setAttribute(t, i);
          } else n.setAttribute(t, i);
        }
        removeAttribute(n, t, i) {
          if (i) {
            const r = Oh[i];
            r ? n.removeAttributeNS(r, t) : n.removeAttribute(`${i}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, i, r) {
          r & (Bt.DashCase | Bt.Important)
            ? n.style.setProperty(t, i, r & Bt.Important ? 'important' : '')
            : (n.style[t] = i);
        }
        removeStyle(n, t, i) {
          i & Bt.DashCase ? n.style.removeProperty(t) : (n.style[t] = '');
        }
        setProperty(n, t, i) {
          n[t] = i;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, i) {
          return 'string' == typeof n
            ? this.eventManager.addGlobalEventListener(n, t, hD(i))
            : this.eventManager.addEventListener(n, t, hD(i));
        }
      }
      function gD(e) {
        return 'TEMPLATE' === e.tagName && void 0 !== e.content;
      }
      class zF extends Rh {
        constructor(n, t, i, r) {
          super(n), (this.component = i);
          const o = rc(r + '-' + i.id, i.styles, []);
          t.addStyles(o),
            (this.contentAttr = (function UF(e) {
              return '_ngcontent-%COMP%'.replace(Ih, e);
            })(r + '-' + i.id)),
            (this.hostAttr = (function $F(e) {
              return '_nghost-%COMP%'.replace(Ih, e);
            })(r + '-' + i.id));
        }
        applyToHost(n) {
          super.setAttribute(n, this.hostAttr, '');
        }
        createElement(n, t) {
          const i = super.createElement(n, t);
          return super.setAttribute(i, this.contentAttr, ''), i;
        }
      }
      class KF extends Rh {
        constructor(n, t, i, r) {
          super(n),
            (this.sharedStylesHost = t),
            (this.hostEl = i),
            (this.shadowRoot = i.attachShadow({ mode: 'open' })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = rc(r.id, r.styles, []);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement('style');
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(n) {
          return n === this.hostEl ? this.shadowRoot : n;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(n, t) {
          return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, i) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, i);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
        }
      }
      let qF = (() => {
        class e extends lD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, i, r) {
            return t.addEventListener(i, r, !1), () => this.removeEventListener(t, i, r);
          }
          removeEventListener(t, i, r) {
            return t.removeEventListener(i, r);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Xe));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const _D = ['alt', 'control', 'meta', 'shift'],
        XF = {
          '\b': 'Backspace',
          '\t': 'Tab',
          '\x7f': 'Delete',
          '\x1b': 'Escape',
          Del: 'Delete',
          Esc: 'Escape',
          Left: 'ArrowLeft',
          Right: 'ArrowRight',
          Up: 'ArrowUp',
          Down: 'ArrowDown',
          Menu: 'ContextMenu',
          Scroll: 'ScrollLock',
          Win: 'OS',
        },
        mD = {
          A: '1',
          B: '2',
          C: '3',
          D: '4',
          E: '5',
          F: '6',
          G: '7',
          H: '8',
          I: '9',
          J: '*',
          K: '+',
          M: '-',
          N: '.',
          O: '/',
          '`': '0',
          '\x90': 'NumLock',
        },
        YF = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey };
      let JF = (() => {
        class e extends lD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, i, r) {
            const o = e.parseEventName(i),
              s = e.eventCallback(o.fullKey, r, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => zn().onAndCancel(t, o.domEventName, s));
          }
          static parseEventName(t) {
            const i = t.toLowerCase().split('.'),
              r = i.shift();
            if (0 === i.length || ('keydown' !== r && 'keyup' !== r)) return null;
            const o = e._normalizeKey(i.pop());
            let s = '';
            if (
              (_D.forEach((l) => {
                const c = i.indexOf(l);
                c > -1 && (i.splice(c, 1), (s += l + '.'));
              }),
              (s += o),
              0 != i.length || 0 === o.length)
            )
              return null;
            const a = {};
            return (a.domEventName = r), (a.fullKey = s), a;
          }
          static getEventFullKey(t) {
            let i = '',
              r = (function ZF(e) {
                let n = e.key;
                if (null == n) {
                  if (((n = e.keyIdentifier), null == n)) return 'Unidentified';
                  n.startsWith('U+') &&
                    ((n = String.fromCharCode(parseInt(n.substring(2), 16))),
                    3 === e.location && mD.hasOwnProperty(n) && (n = mD[n]));
                }
                return XF[n] || n;
              })(t);
            return (
              (r = r.toLowerCase()),
              ' ' === r ? (r = 'space') : '.' === r && (r = 'dot'),
              _D.forEach((o) => {
                o != r && (0, YF[o])(t) && (i += o + '.');
              }),
              (i += r),
              i
            );
          }
          static eventCallback(t, i, r) {
            return (o) => {
              e.getEventFullKey(o) === t && r.runGuarded(() => i(o));
            };
          }
          static _normalizeKey(t) {
            return 'esc' === t ? 'escape' : t;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Xe));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ik = vb(sx, 'browser', [
          { provide: To, useValue: rD },
          {
            provide: lb,
            useValue: function ek() {
              Mh.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Xe,
            useFactory: function nk() {
              return (
                (function NS(e) {
                  sd = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        yD = new k(''),
        bD = [
          {
            provide: jl,
            useClass: class BF {
              addToWindow(n) {
                (ge.getAngularTestability = (i, r = !0) => {
                  const o = n.findTestabilityInTree(i, r);
                  if (null == o) throw new Error('Could not find testability for element.');
                  return o;
                }),
                  (ge.getAllAngularTestabilities = () => n.getAllTestabilities()),
                  (ge.getAllAngularRootElements = () => n.getAllRootElements()),
                  ge.frameworkStabilizers || (ge.frameworkStabilizers = []),
                  ge.frameworkStabilizers.push((i) => {
                    const r = ge.getAllAngularTestabilities();
                    let o = r.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && i(s);
                    };
                    r.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(n, t, i) {
                return null == t
                  ? null
                  : n.getTestability(t) ??
                      (i
                        ? zn().isShadowRoot(t)
                          ? this.findTestabilityInTree(n, t.host, !0)
                          : this.findTestabilityInTree(n, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: pb, useClass: th, deps: [me, nh, jl] },
          { provide: th, useClass: th, deps: [me, nh, jl] },
        ],
        DD = [
          { provide: md, useValue: 'root' },
          {
            provide: to,
            useFactory: function tk() {
              return new to();
            },
            deps: [],
          },
          { provide: nc, useClass: qF, multi: !0, deps: [Xe, me, To] },
          { provide: nc, useClass: JF, multi: !0, deps: [Xe] },
          { provide: Ah, useClass: Ah, deps: [ic, $s, Vs] },
          { provide: Dd, useExisting: Ah },
          { provide: cD, useExisting: $s },
          { provide: $s, useClass: $s, deps: [Xe] },
          { provide: ic, useClass: ic, deps: [nc, me] },
          { provide: sD, useClass: jF, deps: [] },
          [],
        ];
      let rk = (() => {
          class e {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: e,
                providers: [{ provide: Vs, useValue: t.appId }, { provide: aD, useExisting: Vs }, VF],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(yD, 12));
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ providers: [...DD, ...bD], imports: [Ze, ax] })),
            e
          );
        })(),
        xh = (() => {
          class e {
            constructor(t) {
              this._doc = t;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(t) {
              this._doc.title = t || '';
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(Xe));
            }),
            (e.ɵprov = M({
              token: e,
              factory: function (t) {
                let i = null;
                return (
                  (i = t
                    ? new t()
                    : (function sk() {
                        return new xh(N(Xe));
                      })()),
                  i
                );
              },
              providedIn: 'root',
            })),
            e
          );
        })();
      typeof window < 'u' && window;
      const { isArray: pk } = Array,
        { getPrototypeOf: gk, prototype: _k, keys: mk } = Object;
      function ND(e) {
        if (1 === e.length) {
          const n = e[0];
          if (pk(n)) return { args: n, keys: null };
          if (
            (function vk(e) {
              return e && 'object' == typeof e && gk(e) === _k;
            })(n)
          ) {
            const t = mk(n);
            return { args: t.map((i) => n[i]), keys: t };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: yk } = Array;
      function kh(e) {
        return L((n) =>
          (function bk(e, n) {
            return yk(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      function TD(e, n) {
        return e.reduce((t, i, r) => ((t[i] = n[r]), t), {});
      }
      function ED(...e) {
        const n = Aa(e),
          { args: t, keys: i } = ND(e),
          r = new he((o) => {
            const { length: s } = t;
            if (!s) return void o.complete();
            const a = new Array(s);
            let l = s,
              c = s;
            for (let u = 0; u < s; u++) {
              let d = !1;
              ut(t[u]).subscribe(
                Ce(
                  o,
                  (f) => {
                    d || ((d = !0), c--), (a[u] = f);
                  },
                  () => l--,
                  void 0,
                  () => {
                    (!l || !d) && (c || o.next(i ? TD(i, a) : a), o.complete());
                  }
                )
              );
            }
          });
        return n ? r.pipe(kh(n)) : r;
      }
      let SD = (() => {
          class e {
            constructor(t, i) {
              (this._renderer = t), (this._elementRef = i), (this.onChange = (r) => {}), (this.onTouched = () => {});
            }
            setProperty(t, i) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, i);
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            setDisabledState(t) {
              this.setProperty('disabled', t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(vn), _(Ne));
            }),
            (e.ɵdir = I({ type: e })),
            e
          );
        })(),
        pr = (() => {
          class e extends SD {}
          return (
            (e.ɵfac = (function () {
              let n;
              return function (i) {
                return (n || (n = qe(e)))(i || e);
              };
            })()),
            (e.ɵdir = I({ type: e, features: [de] })),
            e
          );
        })();
      const Kn = new k('NgValueAccessor'),
        Dk = { provide: Kn, useExisting: ae(() => Lh), multi: !0 };
      let Lh = (() => {
        class e extends pr {
          writeValue(t) {
            this.setProperty('checked', t);
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (i) {
              return (n || (n = qe(e)))(i || e);
            };
          })()),
          (e.ɵdir = I({
            type: e,
            selectors: [
              ['input', 'type', 'checkbox', 'formControlName', ''],
              ['input', 'type', 'checkbox', 'formControl', ''],
              ['input', 'type', 'checkbox', 'ngModel', ''],
            ],
            hostBindings: function (t, i) {
              1 & t &&
                fe('change', function (o) {
                  return i.onChange(o.target.checked);
                })('blur', function () {
                  return i.onTouched();
                });
            },
            features: [Ee([Dk]), de],
          })),
          e
        );
      })();
      const Ck = { provide: Kn, useExisting: ae(() => oc), multi: !0 },
        Nk = new k('CompositionEventMode');
      let oc = (() => {
        class e extends SD {
          constructor(t, i, r) {
            super(t, i),
              (this._compositionMode = r),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function wk() {
                  const e = zn() ? zn().getUserAgent() : '';
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(t) {
            this.setProperty('value', t ?? '');
          }
          _handleInput(t) {
            (!this._compositionMode || (this._compositionMode && !this._composing)) && this.onChange(t);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(t) {
            (this._composing = !1), this._compositionMode && this.onChange(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(vn), _(Ne), _(Nk, 8));
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [
              ['input', 'formControlName', '', 3, 'type', 'checkbox'],
              ['textarea', 'formControlName', ''],
              ['input', 'formControl', '', 3, 'type', 'checkbox'],
              ['textarea', 'formControl', ''],
              ['input', 'ngModel', '', 3, 'type', 'checkbox'],
              ['textarea', 'ngModel', ''],
              ['', 'ngDefaultControl', ''],
            ],
            hostBindings: function (t, i) {
              1 & t &&
                fe('input', function (o) {
                  return i._handleInput(o.target.value);
                })('blur', function () {
                  return i.onTouched();
                })('compositionstart', function () {
                  return i._compositionStart();
                })('compositionend', function (o) {
                  return i._compositionEnd(o.target.value);
                });
            },
            features: [Ee([Ck]), de],
          })),
          e
        );
      })();
      function Fi(e) {
        return null == e || (('string' == typeof e || Array.isArray(e)) && 0 === e.length);
      }
      function MD(e) {
        return null != e && 'number' == typeof e.length;
      }
      const Tt = new k('NgValidators'),
        ki = new k('NgAsyncValidators'),
        Ek =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class OD {
        static min(n) {
          return (function ID(e) {
            return (n) => {
              if (Fi(n.value) || Fi(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t < e ? { min: { min: e, actual: n.value } } : null;
            };
          })(n);
        }
        static max(n) {
          return (function AD(e) {
            return (n) => {
              if (Fi(n.value) || Fi(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t > e ? { max: { max: e, actual: n.value } } : null;
            };
          })(n);
        }
        static required(n) {
          return RD(n);
        }
        static requiredTrue(n) {
          return (function PD(e) {
            return !0 === e.value ? null : { required: !0 };
          })(n);
        }
        static email(n) {
          return (function xD(e) {
            return Fi(e.value) || Ek.test(e.value) ? null : { email: !0 };
          })(n);
        }
        static minLength(n) {
          return (function FD(e) {
            return (n) =>
              Fi(n.value) || !MD(n.value)
                ? null
                : n.value.length < e
                ? { minlength: { requiredLength: e, actualLength: n.value.length } }
                : null;
          })(n);
        }
        static maxLength(n) {
          return (function kD(e) {
            return (n) =>
              MD(n.value) && n.value.length > e
                ? { maxlength: { requiredLength: e, actualLength: n.value.length } }
                : null;
          })(n);
        }
        static pattern(n) {
          return (function LD(e) {
            if (!e) return sc;
            let n, t;
            return (
              'string' == typeof e
                ? ((t = ''),
                  '^' !== e.charAt(0) && (t += '^'),
                  (t += e),
                  '$' !== e.charAt(e.length - 1) && (t += '$'),
                  (n = new RegExp(t)))
                : ((t = e.toString()), (n = e)),
              (i) => {
                if (Fi(i.value)) return null;
                const r = i.value;
                return n.test(r) ? null : { pattern: { requiredPattern: t, actualValue: r } };
              }
            );
          })(n);
        }
        static nullValidator(n) {
          return null;
        }
        static compose(n) {
          return UD(n);
        }
        static composeAsync(n) {
          return $D(n);
        }
      }
      function RD(e) {
        return Fi(e.value) ? { required: !0 } : null;
      }
      function sc(e) {
        return null;
      }
      function VD(e) {
        return null != e;
      }
      function BD(e) {
        return Ns(e) ? Ue(e) : e;
      }
      function jD(e) {
        let n = {};
        return (
          e.forEach((t) => {
            n = null != t ? { ...n, ...t } : n;
          }),
          0 === Object.keys(n).length ? null : n
        );
      }
      function HD(e, n) {
        return n.map((t) => t(e));
      }
      function GD(e) {
        return e.map((n) =>
          (function Sk(e) {
            return !e.validate;
          })(n)
            ? n
            : (t) => n.validate(t)
        );
      }
      function UD(e) {
        if (!e) return null;
        const n = e.filter(VD);
        return 0 == n.length
          ? null
          : function (t) {
              return jD(HD(t, n));
            };
      }
      function Vh(e) {
        return null != e ? UD(GD(e)) : null;
      }
      function $D(e) {
        if (!e) return null;
        const n = e.filter(VD);
        return 0 == n.length
          ? null
          : function (t) {
              return ED(HD(t, n).map(BD)).pipe(L(jD));
            };
      }
      function Bh(e) {
        return null != e ? $D(GD(e)) : null;
      }
      function WD(e, n) {
        return null === e ? [n] : Array.isArray(e) ? [...e, n] : [e, n];
      }
      function zD(e) {
        return e._rawValidators;
      }
      function KD(e) {
        return e._rawAsyncValidators;
      }
      function jh(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function ac(e, n) {
        return Array.isArray(e) ? e.includes(n) : e === n;
      }
      function qD(e, n) {
        const t = jh(n);
        return (
          jh(e).forEach((r) => {
            ac(t, r) || t.push(r);
          }),
          t
        );
      }
      function QD(e, n) {
        return jh(n).filter((t) => !ac(e, t));
      }
      class XD {
        constructor() {
          (this._rawValidators = []), (this._rawAsyncValidators = []), (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(n) {
          (this._rawValidators = n || []), (this._composedValidatorFn = Vh(this._rawValidators));
        }
        _setAsyncValidators(n) {
          (this._rawAsyncValidators = n || []), (this._composedAsyncValidatorFn = Bh(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(n) {
          this._onDestroyCallbacks.push(n);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((n) => n()), (this._onDestroyCallbacks = []);
        }
        reset(n) {
          this.control && this.control.reset(n);
        }
        hasError(n, t) {
          return !!this.control && this.control.hasError(n, t);
        }
        getError(n, t) {
          return this.control ? this.control.getError(n, t) : null;
        }
      }
      class xt extends XD {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Li extends XD {
        constructor() {
          super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
        }
      }
      class YD {
        constructor(n) {
          this._cd = n;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let JD = (() => {
          class e extends YD {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Li, 2));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [
                ['', 'formControlName', ''],
                ['', 'ngModel', ''],
                ['', 'formControl', ''],
              ],
              hostVars: 14,
              hostBindings: function (t, i) {
                2 & t &&
                  Be('ng-untouched', i.isUntouched)('ng-touched', i.isTouched)('ng-pristine', i.isPristine)(
                    'ng-dirty',
                    i.isDirty
                  )('ng-valid', i.isValid)('ng-invalid', i.isInvalid)('ng-pending', i.isPending);
              },
              features: [de],
            })),
            e
          );
        })(),
        ZD = (() => {
          class e extends YD {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(xt, 10));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [
                ['', 'formGroupName', ''],
                ['', 'formArrayName', ''],
                ['', 'ngModelGroup', ''],
                ['', 'formGroup', ''],
                ['form', 3, 'ngNoForm', ''],
                ['', 'ngForm', ''],
              ],
              hostVars: 16,
              hostBindings: function (t, i) {
                2 & t &&
                  Be('ng-untouched', i.isUntouched)('ng-touched', i.isTouched)('ng-pristine', i.isPristine)(
                    'ng-dirty',
                    i.isDirty
                  )('ng-valid', i.isValid)('ng-invalid', i.isInvalid)('ng-pending', i.isPending)(
                    'ng-submitted',
                    i.isSubmitted
                  );
              },
              features: [de],
            })),
            e
          );
        })();
      const Ws = 'VALID',
        cc = 'INVALID',
        So = 'PENDING',
        zs = 'DISABLED';
      function $h(e) {
        return (uc(e) ? e.validators : e) || null;
      }
      function t1(e) {
        return Array.isArray(e) ? Vh(e) : e || null;
      }
      function Wh(e, n) {
        return (uc(n) ? n.asyncValidators : e) || null;
      }
      function n1(e) {
        return Array.isArray(e) ? Bh(e) : e || null;
      }
      function uc(e) {
        return null != e && !Array.isArray(e) && 'object' == typeof e;
      }
      function i1(e, n, t) {
        const i = e.controls;
        if (!(n ? Object.keys(i) : i).length) throw new S(1e3, '');
        if (!i[t]) throw new S(1001, '');
      }
      function r1(e, n, t) {
        e._forEachChild((i, r) => {
          if (void 0 === t[r]) throw new S(1002, '');
        });
      }
      class dc {
        constructor(n, t) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = n),
            (this._rawAsyncValidators = t),
            (this._composedValidatorFn = t1(this._rawValidators)),
            (this._composedAsyncValidatorFn = n1(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(n) {
          this._rawValidators = this._composedValidatorFn = n;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(n) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Ws;
        }
        get invalid() {
          return this.status === cc;
        }
        get pending() {
          return this.status == So;
        }
        get disabled() {
          return this.status === zs;
        }
        get enabled() {
          return this.status !== zs;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
        }
        setValidators(n) {
          (this._rawValidators = n), (this._composedValidatorFn = t1(n));
        }
        setAsyncValidators(n) {
          (this._rawAsyncValidators = n), (this._composedAsyncValidatorFn = n1(n));
        }
        addValidators(n) {
          this.setValidators(qD(n, this._rawValidators));
        }
        addAsyncValidators(n) {
          this.setAsyncValidators(qD(n, this._rawAsyncValidators));
        }
        removeValidators(n) {
          this.setValidators(QD(n, this._rawValidators));
        }
        removeAsyncValidators(n) {
          this.setAsyncValidators(QD(n, this._rawAsyncValidators));
        }
        hasValidator(n) {
          return ac(this._rawValidators, n);
        }
        hasAsyncValidator(n) {
          return ac(this._rawAsyncValidators, n);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(n = {}) {
          (this.touched = !0), this._parent && !n.onlySelf && this._parent.markAsTouched(n);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }), this._forEachChild((n) => n.markAllAsTouched());
        }
        markAsUntouched(n = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((t) => {
              t.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        markAsDirty(n = {}) {
          (this.pristine = !1), this._parent && !n.onlySelf && this._parent.markAsDirty(n);
        }
        markAsPristine(n = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((t) => {
              t.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        markAsPending(n = {}) {
          (this.status = So),
            !1 !== n.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !n.onlySelf && this._parent.markAsPending(n);
        }
        disable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = zs),
            (this.errors = null),
            this._forEachChild((i) => {
              i.disable({ ...n, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((i) => i(!0));
        }
        enable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = Ws),
            this._forEachChild((i) => {
              i.enable({ ...n, onlySelf: !0 });
            }),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((i) => i(!1));
        }
        _updateAncestors(n) {
          this._parent &&
            !n.onlySelf &&
            (this._parent.updateValueAndValidity(n),
            n.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(n) {
          this._parent = n;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(n = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Ws || this.status === So) && this._runAsyncValidator(n.emitEvent)),
            !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
            this._parent && !n.onlySelf && this._parent.updateValueAndValidity(n);
        }
        _updateTreeValidity(n = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(n)),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? zs : Ws;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(n) {
          if (this.asyncValidator) {
            (this.status = So), (this._hasOwnPendingAsyncValidator = !0);
            const t = BD(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((i) => {
              (this._hasOwnPendingAsyncValidator = !1), this.setErrors(i, { emitEvent: n });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(), (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(n, t = {}) {
          (this.errors = n), this._updateControlsErrors(!1 !== t.emitEvent);
        }
        get(n) {
          let t = n;
          return null == t || (Array.isArray(t) || (t = t.split('.')), 0 === t.length)
            ? null
            : t.reduce((i, r) => i && i._find(r), this);
        }
        getError(n, t) {
          const i = t ? this.get(t) : this;
          return i && i.errors ? i.errors[n] : null;
        }
        hasError(n, t) {
          return !!this.getError(n, t);
        }
        get root() {
          let n = this;
          for (; n._parent; ) n = n._parent;
          return n;
        }
        _updateControlsErrors(n) {
          (this.status = this._calculateStatus()),
            n && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(n);
        }
        _initObservables() {
          (this.valueChanges = new U()), (this.statusChanges = new U());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? zs
            : this.errors
            ? cc
            : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(So)
            ? So
            : this._anyControlsHaveStatus(cc)
            ? cc
            : Ws;
        }
        _anyControlsHaveStatus(n) {
          return this._anyControls((t) => t.status === n);
        }
        _anyControlsDirty() {
          return this._anyControls((n) => n.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((n) => n.touched);
        }
        _updatePristine(n = {}) {
          (this.pristine = !this._anyControlsDirty()), this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        _updateTouched(n = {}) {
          (this.touched = this._anyControlsTouched()), this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        _registerOnCollectionChange(n) {
          this._onCollectionChange = n;
        }
        _setUpdateStrategy(n) {
          uc(n) && null != n.updateOn && (this._updateOn = n.updateOn);
        }
        _parentMarkedDirty(n) {
          return !n && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty();
        }
        _find(n) {
          return null;
        }
      }
      class fc extends dc {
        constructor(n, t, i) {
          super($h(t), Wh(i, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
        }
        registerControl(n, t) {
          return this.controls[n]
            ? this.controls[n]
            : ((this.controls[n] = t), t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange), t);
        }
        addControl(n, t, i = {}) {
          this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: i.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(n, t = {}) {
          this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(n, t, i = {}) {
          this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            t && this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: i.emitEvent }),
            this._onCollectionChange();
        }
        contains(n) {
          return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
        }
        setValue(n, t = {}) {
          r1(this, 0, n),
            Object.keys(n).forEach((i) => {
              i1(this, !0, i), this.controls[i].setValue(n[i], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (Object.keys(n).forEach((i) => {
              const r = this.controls[i];
              r && r.patchValue(n[i], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = {}, t = {}) {
          this._forEachChild((i, r) => {
            i.reset(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren({}, (n, t, i) => ((n[i] = t.getRawValue()), n));
        }
        _syncPendingControls() {
          let n = this._reduceChildren(!1, (t, i) => !!i._syncPendingControls() || t);
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          Object.keys(this.controls).forEach((t) => {
            const i = this.controls[t];
            i && n(i, t);
          });
        }
        _setUpControls() {
          this._forEachChild((n) => {
            n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(n) {
          for (const [t, i] of Object.entries(this.controls)) if (this.contains(t) && n(i)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren({}, (t, i, r) => ((i.enabled || this.disabled) && (t[r] = i.value), t));
        }
        _reduceChildren(n, t) {
          let i = n;
          return (
            this._forEachChild((r, o) => {
              i = t(i, r, o);
            }),
            i
          );
        }
        _allControlsDisabled() {
          for (const n of Object.keys(this.controls)) if (this.controls[n].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(n) {
          return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
        }
      }
      function Ks(e, n) {
        zh(e, n),
          n.valueAccessor.writeValue(e.value),
          e.disabled && n.valueAccessor.setDisabledState?.(!0),
          (function kk(e, n) {
            n.valueAccessor.registerOnChange((t) => {
              (e._pendingValue = t),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                'change' === e.updateOn && o1(e, n);
            });
          })(e, n),
          (function Vk(e, n) {
            const t = (i, r) => {
              n.valueAccessor.writeValue(i), r && n.viewToModelUpdate(i);
            };
            e.registerOnChange(t),
              n._registerOnDestroy(() => {
                e._unregisterOnChange(t);
              });
          })(e, n),
          (function Lk(e, n) {
            n.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                'blur' === e.updateOn && e._pendingChange && o1(e, n),
                'submit' !== e.updateOn && e.markAsTouched();
            });
          })(e, n),
          (function Fk(e, n) {
            if (n.valueAccessor.setDisabledState) {
              const t = (i) => {
                n.valueAccessor.setDisabledState(i);
              };
              e.registerOnDisabledChange(t),
                n._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(t);
                });
            }
          })(e, n);
      }
      function pc(e, n, t = !0) {
        const i = () => {};
        n.valueAccessor && (n.valueAccessor.registerOnChange(i), n.valueAccessor.registerOnTouched(i)),
          _c(e, n),
          e && (n._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
      }
      function gc(e, n) {
        e.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(n);
        });
      }
      function zh(e, n) {
        const t = zD(e);
        null !== n.validator ? e.setValidators(WD(t, n.validator)) : 'function' == typeof t && e.setValidators([t]);
        const i = KD(e);
        null !== n.asyncValidator
          ? e.setAsyncValidators(WD(i, n.asyncValidator))
          : 'function' == typeof i && e.setAsyncValidators([i]);
        const r = () => e.updateValueAndValidity();
        gc(n._rawValidators, r), gc(n._rawAsyncValidators, r);
      }
      function _c(e, n) {
        let t = !1;
        if (null !== e) {
          if (null !== n.validator) {
            const r = zD(e);
            if (Array.isArray(r) && r.length > 0) {
              const o = r.filter((s) => s !== n.validator);
              o.length !== r.length && ((t = !0), e.setValidators(o));
            }
          }
          if (null !== n.asyncValidator) {
            const r = KD(e);
            if (Array.isArray(r) && r.length > 0) {
              const o = r.filter((s) => s !== n.asyncValidator);
              o.length !== r.length && ((t = !0), e.setAsyncValidators(o));
            }
          }
        }
        const i = () => {};
        return gc(n._rawValidators, i), gc(n._rawAsyncValidators, i), t;
      }
      function o1(e, n) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          n.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function c1(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      function u1(e) {
        return 'object' == typeof e && null !== e && 2 === Object.keys(e).length && 'value' in e && 'disabled' in e;
      }
      const Qs = class extends dc {
        constructor(n = null, t, i) {
          super($h(t), Wh(i, t)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(n),
            this._setUpdateStrategy(t),
            this._initObservables(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
            uc(t) && (t.nonNullable || t.initialValueIsDefault) && (this.defaultValue = u1(n) ? n.value : n);
        }
        setValue(n, t = {}) {
          (this.value = this._pendingValue = n),
            this._onChange.length &&
              !1 !== t.emitModelToViewChange &&
              this._onChange.forEach((i) => i(this.value, !1 !== t.emitViewToModelChange)),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          this.setValue(n, t);
        }
        reset(n = this.defaultValue, t = {}) {
          this._applyFormState(n),
            this.markAsPristine(t),
            this.markAsUntouched(t),
            this.setValue(this.value, t),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(n) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(n) {
          this._onChange.push(n);
        }
        _unregisterOnChange(n) {
          c1(this._onChange, n);
        }
        registerOnDisabledChange(n) {
          this._onDisabledChange.push(n);
        }
        _unregisterOnDisabledChange(n) {
          c1(this._onDisabledChange, n);
        }
        _forEachChild(n) {}
        _syncPendingControls() {
          return !(
            'submit' !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), 0)
          );
        }
        _applyFormState(n) {
          u1(n)
            ? ((this.value = this._pendingValue = n.value),
              n.disabled ? this.disable({ onlySelf: !0, emitEvent: !1 }) : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = n);
        }
      };
      let g1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
              hostAttrs: ['novalidate', ''],
            })),
            e
          );
        })(),
        m1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      const Xh = new k('NgModelWithFormControlWarning'),
        Jk = { provide: xt, useExisting: ae(() => mc) };
      let mc = (() => {
        class e extends xt {
          constructor(t, i) {
            super(),
              (this.validators = t),
              (this.asyncValidators = i),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new U()),
              this._setValidators(t),
              this._setAsyncValidators(i);
          }
          ngOnChanges(t) {
            this._checkFormPresent(),
              t.hasOwnProperty('form') &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (_c(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(t) {
            const i = this.form.get(t.path);
            return Ks(i, t), i.updateValueAndValidity({ emitEvent: !1 }), this.directives.push(t), i;
          }
          getControl(t) {
            return this.form.get(t.path);
          }
          removeControl(t) {
            pc(t.control || null, t, !1),
              (function Gk(e, n) {
                const t = e.indexOf(n);
                t > -1 && e.splice(t, 1);
              })(this.directives, t);
          }
          addFormGroup(t) {
            this._setUpFormContainer(t);
          }
          removeFormGroup(t) {
            this._cleanUpFormContainer(t);
          }
          getFormGroup(t) {
            return this.form.get(t.path);
          }
          addFormArray(t) {
            this._setUpFormContainer(t);
          }
          removeFormArray(t) {
            this._cleanUpFormContainer(t);
          }
          getFormArray(t) {
            return this.form.get(t.path);
          }
          updateModel(t, i) {
            this.form.get(t.path).setValue(i);
          }
          onSubmit(t) {
            return (
              (this.submitted = !0),
              (function l1(e, n) {
                e._syncPendingControls(),
                  n.forEach((t) => {
                    const i = t.control;
                    'submit' === i.updateOn &&
                      i._pendingChange &&
                      (t.viewToModelUpdate(i._pendingValue), (i._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(t),
              !1
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(t) {
            this.form.reset(t), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((t) => {
              const i = t.control,
                r = this.form.get(t.path);
              i !== r && (pc(i || null, t), ((e) => e instanceof Qs)(r) && (Ks(r, t), (t.control = r)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(t) {
            const i = this.form.get(t.path);
            (function s1(e, n) {
              zh(e, n);
            })(i, t),
              i.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(t) {
            if (this.form) {
              const i = this.form.get(t.path);
              i &&
                (function Bk(e, n) {
                  return _c(e, n);
                })(i, t) &&
                i.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            zh(this.form, this), this._oldForm && _c(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Tt, 10), _(ki, 10));
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [['', 'formGroup', '']],
            hostBindings: function (t, i) {
              1 & t &&
                fe('submit', function (o) {
                  return i.onSubmit(o);
                })('reset', function () {
                  return i.onReset();
                });
            },
            inputs: { form: ['formGroup', 'form'] },
            outputs: { ngSubmit: 'ngSubmit' },
            exportAs: ['ngForm'],
            features: [Ee([Jk]), de, Ot],
          })),
          e
        );
      })();
      const tL = { provide: Li, useExisting: ae(() => Zh) };
      let Zh = (() => {
          class e extends Li {
            constructor(t, i, r, o, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.update = new U()),
                (this._ngModelWarningSent = !1),
                (this._parent = t),
                this._setValidators(i),
                this._setAsyncValidators(r),
                (this.valueAccessor = (function qh(e, n) {
                  if (!n) return null;
                  let t, i, r;
                  return (
                    Array.isArray(n),
                    n.forEach((o) => {
                      o.constructor === oc
                        ? (t = o)
                        : (function Hk(e) {
                            return Object.getPrototypeOf(e.constructor) === pr;
                          })(o)
                        ? (i = o)
                        : (r = o);
                    }),
                    r || i || t || null
                  );
                })(0, o));
            }
            set isDisabled(t) {}
            ngOnChanges(t) {
              this._added || this._setUpControl(),
                (function Kh(e, n) {
                  if (!e.hasOwnProperty('model')) return !1;
                  const t = e.model;
                  return !!t.isFirstChange() || !Object.is(n, t.currentValue);
                })(t, this.viewModel) &&
                  ((this.viewModel = this.model), this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(t) {
              (this.viewModel = t), this.update.emit(t);
            }
            get path() {
              return (function hc(e, n) {
                return [...n.path, e];
              })(null == this.name ? this.name : this.name.toString(), this._parent);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(), (this.control = this.formDirective.addControl(this)), (this._added = !0);
            }
          }
          return (
            (e._ngModelWarningSentOnce = !1),
            (e.ɵfac = function (t) {
              return new (t || e)(_(xt, 13), _(Tt, 10), _(ki, 10), _(Kn, 10), _(Xh, 8));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'formControlName', '']],
              inputs: {
                name: ['formControlName', 'name'],
                isDisabled: ['disabled', 'isDisabled'],
                model: ['ngModel', 'model'],
              },
              outputs: { update: 'ngModelChange' },
              features: [Ee([tL]), de, Ot],
            })),
            e
          );
        })(),
        gr = (() => {
          class e {
            constructor() {
              this._validator = sc;
            }
            ngOnChanges(t) {
              if (this.inputName in t) {
                const i = this.normalizeInput(t[this.inputName].currentValue);
                (this._enabled = this.enabled(i)),
                  (this._validator = this._enabled ? this.createValidator(i) : sc),
                  this._onChange && this._onChange();
              }
            }
            validate(t) {
              return this._validator(t);
            }
            registerOnValidatorChange(t) {
              this._onChange = t;
            }
            enabled(t) {
              return null != t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = I({ type: e, features: [Ot] })),
            e
          );
        })();
      const uL = { provide: Tt, useExisting: ae(() => vc), multi: !0 };
      let vc = (() => {
          class e extends gr {
            constructor() {
              super(...arguments),
                (this.inputName = 'required'),
                (this.normalizeInput = di),
                (this.createValidator = (t) => RD);
            }
            enabled(t) {
              return t;
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (i) {
                return (n || (n = qe(e)))(i || e);
              };
            })()),
            (e.ɵdir = I({
              type: e,
              selectors: [
                ['', 'required', '', 'formControlName', '', 3, 'type', 'checkbox'],
                ['', 'required', '', 'formControl', '', 3, 'type', 'checkbox'],
                ['', 'required', '', 'ngModel', '', 3, 'type', 'checkbox'],
              ],
              hostVars: 1,
              hostBindings: function (t, i) {
                2 & t && be('required', i._enabled ? '' : null);
              },
              inputs: { required: 'required' },
              features: [Ee([uL]), de],
            })),
            e
          );
        })(),
        P1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [m1] })),
            e
          );
        })(),
        x1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [P1] })),
            e
          );
        })(),
        F1 = (() => {
          class e {
            static withConfig(t) {
              return { ngModule: e, providers: [{ provide: Xh, useValue: t.warnOnNgModelWithFormControl }] };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [P1] })),
            e
          );
        })();
      class k1 extends dc {
        constructor(n, t, i) {
          super($h(t), Wh(i, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
        }
        at(n) {
          return this.controls[this._adjustIndex(n)];
        }
        push(n, t = {}) {
          this.controls.push(n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        insert(n, t, i = {}) {
          this.controls.splice(n, 0, t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: i.emitEvent });
        }
        removeAt(n, t = {}) {
          let i = this._adjustIndex(n);
          i < 0 && (i = 0),
            this.controls[i] && this.controls[i]._registerOnCollectionChange(() => {}),
            this.controls.splice(i, 1),
            this.updateValueAndValidity({ emitEvent: t.emitEvent });
        }
        setControl(n, t, i = {}) {
          let r = this._adjustIndex(n);
          r < 0 && (r = 0),
            this.controls[r] && this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            t && (this.controls.splice(r, 0, t), this._registerControl(t)),
            this.updateValueAndValidity({ emitEvent: i.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(n, t = {}) {
          r1(this, 0, n),
            n.forEach((i, r) => {
              i1(this, !1, r), this.at(r).setValue(i, { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (n.forEach((i, r) => {
              this.at(r) && this.at(r).patchValue(i, { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = [], t = {}) {
          this._forEachChild((i, r) => {
            i.reset(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this.controls.map((n) => n.getRawValue());
        }
        clear(n = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((t) => t._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }));
        }
        _adjustIndex(n) {
          return n < 0 ? n + this.length : n;
        }
        _syncPendingControls() {
          let n = this.controls.reduce((t, i) => !!i._syncPendingControls() || t, !1);
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          this.controls.forEach((t, i) => {
            n(t, i);
          });
        }
        _updateValue() {
          this.value = this.controls.filter((n) => n.enabled || this.disabled).map((n) => n.value);
        }
        _anyControls(n) {
          return this.controls.some((t) => t.enabled && n(t));
        }
        _setUpControls() {
          this._forEachChild((n) => this._registerControl(n));
        }
        _allControlsDisabled() {
          for (const n of this.controls) if (n.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(n) {
          n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(n) {
          return this.at(n) ?? null;
        }
      }
      function L1(e) {
        return !!e && (void 0 !== e.asyncValidators || void 0 !== e.validators || void 0 !== e.updateOn);
      }
      let _L = (() => {
        class e {
          constructor() {
            this.useNonNullable = !1;
          }
          get nonNullable() {
            const t = new e();
            return (t.useNonNullable = !0), t;
          }
          group(t, i = null) {
            const r = this._reduceControls(t);
            let o = {};
            return (
              L1(i) ? (o = i) : null !== i && ((o.validators = i.validator), (o.asyncValidators = i.asyncValidator)),
              new fc(r, o)
            );
          }
          control(t, i, r) {
            let o = {};
            return this.useNonNullable
              ? (L1(i) ? (o = i) : ((o.validators = i), (o.asyncValidators = r)), new Qs(t, { ...o, nonNullable: !0 }))
              : new Qs(t, i, r);
          }
          array(t, i, r) {
            const o = t.map((s) => this._createControl(s));
            return new k1(o, i, r);
          }
          _reduceControls(t) {
            const i = {};
            return (
              Object.keys(t).forEach((r) => {
                i[r] = this._createControl(t[r]);
              }),
              i
            );
          }
          _createControl(t) {
            return t instanceof Qs || t instanceof dc
              ? t
              : Array.isArray(t)
              ? this.control(t[0], t.length > 1 ? t[1] : null, t.length > 2 ? t[2] : null)
              : this.control(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: F1 })),
          e
        );
      })();
      function P(...e) {
        return Ue(e, Wo(e));
      }
      class ft extends pe {
        constructor(n) {
          super(), (this._value = n);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(n) {
          const t = super._subscribe(n);
          return !t.closed && n.next(this._value), t;
        }
        getValue() {
          const { hasError: n, thrownError: t, _value: i } = this;
          if (n) throw t;
          return this._throwIfClosed(), i;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      const yc = Uo(
        (e) =>
          function () {
            e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
          }
      );
      function bc(...e) {
        const n = Wo(e),
          t = Aa(e),
          { args: i, keys: r } = ND(e);
        if (0 === i.length) return Ue([], n);
        const o = new he(
          (function mL(e, n, t = Zn) {
            return (i) => {
              V1(
                n,
                () => {
                  const { length: r } = e,
                    o = new Array(r);
                  let s = r,
                    a = r;
                  for (let l = 0; l < r; l++)
                    V1(
                      n,
                      () => {
                        const c = Ue(e[l], n);
                        let u = !1;
                        c.subscribe(
                          Ce(
                            i,
                            (d) => {
                              (o[l] = d), u || ((u = !0), a--), a || i.next(t(o.slice()));
                            },
                            () => {
                              --s || i.complete();
                            }
                          )
                        );
                      },
                      i
                    );
                },
                i
              );
            };
          })(i, n, r ? (s) => TD(r, s) : Zn)
        );
        return t ? o.pipe(kh(t)) : o;
      }
      function V1(e, n, t) {
        e ? ei(t, e, n) : n();
      }
      function Vi(...e) {
        return (function vL() {
          return xr(1);
        })()(Ue(e, Wo(e)));
      }
      function Mo(e) {
        return new he((n) => {
          ut(e()).subscribe(n);
        });
      }
      function Oo(e, n) {
        const t = te(e) ? e : () => e,
          i = (r) => r.error(t());
        return new he(n ? (r) => n.schedule(i, 0, r) : i);
      }
      function np() {
        return Ae((e, n) => {
          let t = null;
          e._refCount++;
          const i = Ce(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (t = null);
            const r = e._connection,
              o = t;
            (t = null), r && (!o || r === o) && r.unsubscribe(), n.unsubscribe();
          });
          e.subscribe(i), i.closed || (t = e.connect());
        });
      }
      class ip extends he {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Ig(n) && (this.lift = n.lift);
        }
        _subscribe(n) {
          return this.getSubject().subscribe(n);
        }
        getSubject() {
          const n = this._subject;
          return (!n || n.isStopped) && (this._subject = this.subjectFactory()), this._subject;
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: n } = this;
          (this._subject = this._connection = null), n?.unsubscribe();
        }
        connect() {
          let n = this._connection;
          if (!n) {
            n = this._connection = new Lt();
            const t = this.getSubject();
            n.add(
              this.source.subscribe(
                Ce(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (i) => {
                    this._teardown(), t.error(i);
                  },
                  () => this._teardown()
                )
              )
            ),
              n.closed && ((this._connection = null), (n = Lt.EMPTY));
          }
          return n;
        }
        refCount() {
          return np()(this);
        }
      }
      function st(e, n) {
        return Ae((t, i) => {
          let r = null,
            o = 0,
            s = !1;
          const a = () => s && !r && i.complete();
          t.subscribe(
            Ce(
              i,
              (l) => {
                r?.unsubscribe();
                let c = 0;
                const u = o++;
                ut(e(l, u)).subscribe(
                  (r = Ce(
                    i,
                    (d) => i.next(n ? n(l, d, u, c++) : d),
                    () => {
                      (r = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function De(e) {
        return e <= 0
          ? () => Jt
          : Ae((n, t) => {
              let i = 0;
              n.subscribe(
                Ce(t, (r) => {
                  ++i <= e && (t.next(r), e <= i && t.complete());
                })
              );
            });
      }
      function Oe(e, n) {
        return Ae((t, i) => {
          let r = 0;
          t.subscribe(Ce(i, (o) => e.call(n, o, r++) && i.next(o)));
        });
      }
      function Cc(e) {
        return Ae((n, t) => {
          let i = !1;
          n.subscribe(
            Ce(
              t,
              (r) => {
                (i = !0), t.next(r);
              },
              () => {
                i || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function B1(e = yL) {
        return Ae((n, t) => {
          let i = !1;
          n.subscribe(
            Ce(
              t,
              (r) => {
                (i = !0), t.next(r);
              },
              () => (i ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function yL() {
        return new yc();
      }
      function Bi(e, n) {
        const t = arguments.length >= 2;
        return (i) => i.pipe(e ? Oe((r, o) => e(r, o, i)) : Zn, De(1), t ? Cc(n) : B1(() => new yc()));
      }
      function pi(e, n) {
        return te(n) ? Ge(e, n, 1) : Ge(e, 1);
      }
      function at(e, n, t) {
        const i = te(e) || n || t ? { next: e, error: n, complete: t } : e;
        return i
          ? Ae((r, o) => {
              var s;
              null === (s = i.subscribe) || void 0 === s || s.call(i);
              let a = !0;
              r.subscribe(
                Ce(
                  o,
                  (l) => {
                    var c;
                    null === (c = i.next) || void 0 === c || c.call(i, l), o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1), null === (l = i.complete) || void 0 === l || l.call(i), o.complete();
                  },
                  (l) => {
                    var c;
                    (a = !1), null === (c = i.error) || void 0 === c || c.call(i, l), o.error(l);
                  },
                  () => {
                    var l, c;
                    a && (null === (l = i.unsubscribe) || void 0 === l || l.call(i)),
                      null === (c = i.finalize) || void 0 === c || c.call(i);
                  }
                )
              );
            })
          : Zn;
      }
      function qn(e) {
        return Ae((n, t) => {
          let o,
            i = null,
            r = !1;
          (i = n.subscribe(
            Ce(t, void 0, void 0, (s) => {
              (o = ut(e(s, qn(e)(n)))), i ? (i.unsubscribe(), (i = null), o.subscribe(t)) : (r = !0);
            })
          )),
            r && (i.unsubscribe(), (i = null), o.subscribe(t));
        });
      }
      function bL(e, n, t, i, r) {
        return (o, s) => {
          let a = t,
            l = n,
            c = 0;
          o.subscribe(
            Ce(
              s,
              (u) => {
                const d = c++;
                (l = a ? e(l, u, d) : ((a = !0), u)), i && s.next(l);
              },
              r &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function j1(e, n) {
        return Ae(bL(e, n, arguments.length >= 2, !0));
      }
      function rp(e) {
        return e <= 0
          ? () => Jt
          : Ae((n, t) => {
              let i = [];
              n.subscribe(
                Ce(
                  t,
                  (r) => {
                    i.push(r), e < i.length && i.shift();
                  },
                  () => {
                    for (const r of i) t.next(r);
                    t.complete();
                  },
                  void 0,
                  () => {
                    i = null;
                  }
                )
              );
            });
      }
      function H1(e, n) {
        const t = arguments.length >= 2;
        return (i) => i.pipe(e ? Oe((r, o) => e(r, o, i)) : Zn, rp(1), t ? Cc(n) : B1(() => new yc()));
      }
      function G1(e) {
        return L(() => e);
      }
      function Xs(e) {
        return Ae((n, t) => {
          try {
            n.subscribe(t);
          } finally {
            t.add(e);
          }
        });
      }
      const Z = 'primary';
      class CL {
        constructor(n) {
          this.params = n || {};
        }
        has(n) {
          return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Io(e) {
        return new CL(e);
      }
      function wL(e, n, t) {
        const i = t.path.split('/');
        if (i.length > e.length || ('full' === t.pathMatch && (n.hasChildren() || i.length < e.length))) return null;
        const r = {};
        for (let o = 0; o < i.length; o++) {
          const s = i[o],
            a = e[o];
          if (s.startsWith(':')) r[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, i.length), posParams: r };
      }
      function Qn(e, n) {
        const t = e ? Object.keys(e) : void 0,
          i = n ? Object.keys(n) : void 0;
        if (!t || !i || t.length != i.length) return !1;
        let r;
        for (let o = 0; o < t.length; o++) if (((r = t[o]), !U1(e[r], n[r]))) return !1;
        return !0;
      }
      function U1(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            i = [...n].sort();
          return t.every((r, o) => i[o] === r);
        }
        return e === n;
      }
      function $1(e) {
        return Array.prototype.concat.apply([], e);
      }
      function W1(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function _t(e, n) {
        for (const t in e) e.hasOwnProperty(t) && n(e[t], t);
      }
      function gi(e) {
        return wf(e) ? e : Ns(e) ? Ue(Promise.resolve(e)) : P(e);
      }
      const EL = {
          exact: function q1(e, n, t) {
            if (
              !mr(e.segments, n.segments) ||
              !wc(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const i in n.children) if (!e.children[i] || !q1(e.children[i], n.children[i], t)) return !1;
            return !0;
          },
          subset: Q1,
        },
        z1 = {
          exact: function SL(e, n) {
            return Qn(e, n);
          },
          subset: function ML(e, n) {
            return Object.keys(n).length <= Object.keys(e).length && Object.keys(n).every((t) => U1(e[t], n[t]));
          },
          ignored: () => !0,
        };
      function K1(e, n, t) {
        return (
          EL[t.paths](e.root, n.root, t.matrixParams) &&
          z1[t.queryParams](e.queryParams, n.queryParams) &&
          !('exact' === t.fragment && e.fragment !== n.fragment)
        );
      }
      function Q1(e, n, t) {
        return X1(e, n, n.segments, t);
      }
      function X1(e, n, t, i) {
        if (e.segments.length > t.length) {
          const r = e.segments.slice(0, t.length);
          return !(!mr(r, t) || n.hasChildren() || !wc(r, t, i));
        }
        if (e.segments.length === t.length) {
          if (!mr(e.segments, t) || !wc(e.segments, t, i)) return !1;
          for (const r in n.children) if (!e.children[r] || !Q1(e.children[r], n.children[r], i)) return !1;
          return !0;
        }
        {
          const r = t.slice(0, e.segments.length),
            o = t.slice(e.segments.length);
          return !!(mr(e.segments, r) && wc(e.segments, r, i) && e.children[Z]) && X1(e.children[Z], n, o, i);
        }
      }
      function wc(e, n, t) {
        return n.every((i, r) => z1[t](e[r].parameters, i.parameters));
      }
      class _r {
        constructor(n, t, i) {
          (this.root = n), (this.queryParams = t), (this.fragment = i);
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Io(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return AL.serialize(this);
        }
      }
      class ee {
        constructor(n, t) {
          (this.segments = n), (this.children = t), (this.parent = null), _t(t, (i, r) => (i.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Nc(this);
        }
      }
      class Ys {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return this._parameterMap || (this._parameterMap = Io(this.parameters)), this._parameterMap;
        }
        toString() {
          return eC(this);
        }
      }
      function mr(e, n) {
        return e.length === n.length && e.every((t, i) => t.path === n[i].path);
      }
      let Y1 = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return new sp();
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      class sp {
        parse(n) {
          const t = new jL(n);
          return new _r(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
        }
        serialize(n) {
          const t = `/${Js(n.root, !0)}`,
            i = (function xL(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const i = e[t];
                  return Array.isArray(i) ? i.map((r) => `${Tc(t)}=${Tc(r)}`).join('&') : `${Tc(t)}=${Tc(i)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join('&')}` : '';
            })(n.queryParams);
          return `${t}${i}${
            'string' == typeof n.fragment
              ? `#${(function RL(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ''
          }`;
        }
      }
      const AL = new sp();
      function Nc(e) {
        return e.segments.map((n) => eC(n)).join('/');
      }
      function Js(e, n) {
        if (!e.hasChildren()) return Nc(e);
        if (n) {
          const t = e.children[Z] ? Js(e.children[Z], !1) : '',
            i = [];
          return (
            _t(e.children, (r, o) => {
              o !== Z && i.push(`${o}:${Js(r, !1)}`);
            }),
            i.length > 0 ? `${t}(${i.join('//')})` : t
          );
        }
        {
          const t = (function IL(e, n) {
            let t = [];
            return (
              _t(e.children, (i, r) => {
                r === Z && (t = t.concat(n(i, r)));
              }),
              _t(e.children, (i, r) => {
                r !== Z && (t = t.concat(n(i, r)));
              }),
              t
            );
          })(e, (i, r) => (r === Z ? [Js(e.children[Z], !1)] : [`${r}:${Js(i, !1)}`]));
          return 1 === Object.keys(e.children).length && null != e.children[Z]
            ? `${Nc(e)}/${t[0]}`
            : `${Nc(e)}/(${t.join('//')})`;
        }
      }
      function J1(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/g, '$')
          .replace(/%2C/gi, ',');
      }
      function Tc(e) {
        return J1(e).replace(/%3B/gi, ';');
      }
      function ap(e) {
        return J1(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
      }
      function Ec(e) {
        return decodeURIComponent(e);
      }
      function Z1(e) {
        return Ec(e.replace(/\+/g, '%20'));
      }
      function eC(e) {
        return `${ap(e.path)}${(function PL(e) {
          return Object.keys(e)
            .map((n) => `;${ap(n)}=${ap(e[n])}`)
            .join('');
        })(e.parameters)}`;
      }
      const FL = /^[^\/()?;=#]+/;
      function Sc(e) {
        const n = e.match(FL);
        return n ? n[0] : '';
      }
      const kL = /^[^=?&#]+/,
        VL = /^[^&#]+/;
      class jL {
        constructor(n) {
          (this.url = n), (this.remaining = n);
        }
        parseRootSegment() {
          return (
            this.consumeOptional('/'),
            '' === this.remaining || this.peekStartsWith('?') || this.peekStartsWith('#')
              ? new ee([], {})
              : new ee([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const n = {};
          if (this.consumeOptional('?'))
            do {
              this.parseQueryParam(n);
            } while (this.consumeOptional('&'));
          return n;
        }
        parseFragment() {
          return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
        }
        parseChildren() {
          if ('' === this.remaining) return {};
          this.consumeOptional('/');
          const n = [];
          for (
            this.peekStartsWith('(') || n.push(this.parseSegment());
            this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');

          )
            this.capture('/'), n.push(this.parseSegment());
          let t = {};
          this.peekStartsWith('/(') && (this.capture('/'), (t = this.parseParens(!0)));
          let i = {};
          return (
            this.peekStartsWith('(') && (i = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) && (i[Z] = new ee(n, t)),
            i
          );
        }
        parseSegment() {
          const n = Sc(this.remaining);
          if ('' === n && this.peekStartsWith(';')) throw new S(4009, !1);
          return this.capture(n), new Ys(Ec(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(';'); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = Sc(this.remaining);
          if (!t) return;
          this.capture(t);
          let i = '';
          if (this.consumeOptional('=')) {
            const r = Sc(this.remaining);
            r && ((i = r), this.capture(i));
          }
          n[Ec(t)] = Ec(i);
        }
        parseQueryParam(n) {
          const t = (function LL(e) {
            const n = e.match(kL);
            return n ? n[0] : '';
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let i = '';
          if (this.consumeOptional('=')) {
            const s = (function BL(e) {
              const n = e.match(VL);
              return n ? n[0] : '';
            })(this.remaining);
            s && ((i = s), this.capture(i));
          }
          const r = Z1(t),
            o = Z1(i);
          if (n.hasOwnProperty(r)) {
            let s = n[r];
            Array.isArray(s) || ((s = [s]), (n[r] = s)), s.push(o);
          } else n[r] = o;
        }
        parseParens(n) {
          const t = {};
          for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
            const i = Sc(this.remaining),
              r = this.remaining[i.length];
            if ('/' !== r && ')' !== r && ';' !== r) throw new S(4010, !1);
            let o;
            i.indexOf(':') > -1 ? ((o = i.slice(0, i.indexOf(':'))), this.capture(o), this.capture(':')) : n && (o = Z);
            const s = this.parseChildren();
            (t[o] = 1 === Object.keys(s).length ? s[Z] : new ee([], s)), this.consumeOptional('//');
          }
          return t;
        }
        peekStartsWith(n) {
          return this.remaining.startsWith(n);
        }
        consumeOptional(n) {
          return !!this.peekStartsWith(n) && ((this.remaining = this.remaining.substring(n.length)), !0);
        }
        capture(n) {
          if (!this.consumeOptional(n)) throw new S(4011, !1);
        }
      }
      function lp(e) {
        return e.segments.length > 0 ? new ee([], { [Z]: e }) : e;
      }
      function Mc(e) {
        const n = {};
        for (const i of Object.keys(e.children)) {
          const o = Mc(e.children[i]);
          (o.segments.length > 0 || o.hasChildren()) && (n[i] = o);
        }
        return (function HL(e) {
          if (1 === e.numberOfChildren && e.children[Z]) {
            const n = e.children[Z];
            return new ee(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new ee(e.segments, n));
      }
      function vr(e) {
        return e instanceof _r;
      }
      function $L(e, n, t, i, r) {
        if (0 === t.length) return Ao(n.root, n.root, n.root, i, r);
        const o = (function iC(e) {
          if ('string' == typeof e[0] && 1 === e.length && '/' === e[0]) return new nC(!0, 0, e);
          let n = 0,
            t = !1;
          const i = e.reduce((r, o, s) => {
            if ('object' == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  _t(o.outlets, (l, c) => {
                    a[c] = 'string' == typeof l ? l.split('/') : l;
                  }),
                  [...r, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...r, o.segmentPath];
            }
            return 'string' != typeof o
              ? [...r, o]
              : 0 === s
              ? (o.split('/').forEach((a, l) => {
                  (0 == l && '.' === a) || (0 == l && '' === a ? (t = !0) : '..' === a ? n++ : '' != a && r.push(a));
                }),
                r)
              : [...r, o];
          }, []);
          return new nC(t, n, i);
        })(t);
        return o.toRoot()
          ? Ao(n.root, n.root, new ee([], {}), i, r)
          : (function s(l) {
              const c = (function zL(e, n, t, i) {
                  if (e.isAbsolute) return new Ro(n.root, !0, 0);
                  if (-1 === i) return new Ro(t, t === n.root, 0);
                  return (function rC(e, n, t) {
                    let i = e,
                      r = n,
                      o = t;
                    for (; o > r; ) {
                      if (((o -= r), (i = i.parent), !i)) throw new S(4005, !1);
                      r = i.segments.length;
                    }
                    return new Ro(i, !1, r - o);
                  })(t, i + (Zs(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(o, n, e.snapshot?._urlSegment, l),
                u = c.processChildren
                  ? ta(c.segmentGroup, c.index, o.commands)
                  : up(c.segmentGroup, c.index, o.commands);
              return Ao(n.root, c.segmentGroup, u, i, r);
            })(e.snapshot?._lastPathIndex);
      }
      function Zs(e) {
        return 'object' == typeof e && null != e && !e.outlets && !e.segmentPath;
      }
      function ea(e) {
        return 'object' == typeof e && null != e && e.outlets;
      }
      function Ao(e, n, t, i, r) {
        let s,
          o = {};
        i &&
          _t(i, (l, c) => {
            o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
          }),
          (s = e === n ? t : tC(e, n, t));
        const a = lp(Mc(s));
        return new _r(a, o, r);
      }
      function tC(e, n, t) {
        const i = {};
        return (
          _t(e.children, (r, o) => {
            i[o] = r === n ? t : tC(r, n, t);
          }),
          new ee(e.segments, i)
        );
      }
      class nC {
        constructor(n, t, i) {
          if (
            ((this.isAbsolute = n), (this.numberOfDoubleDots = t), (this.commands = i), n && i.length > 0 && Zs(i[0]))
          )
            throw new S(4003, !1);
          const r = i.find(ea);
          if (r && r !== W1(i)) throw new S(4004, !1);
        }
        toRoot() {
          return this.isAbsolute && 1 === this.commands.length && '/' == this.commands[0];
        }
      }
      class Ro {
        constructor(n, t, i) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = i);
        }
      }
      function up(e, n, t) {
        if ((e || (e = new ee([], {})), 0 === e.segments.length && e.hasChildren())) return ta(e, n, t);
        const i = (function qL(e, n, t) {
            let i = 0,
              r = n;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; r < e.segments.length; ) {
              if (i >= t.length) return o;
              const s = e.segments[r],
                a = t[i];
              if (ea(a)) break;
              const l = `${a}`,
                c = i < t.length - 1 ? t[i + 1] : null;
              if (r > 0 && void 0 === l) break;
              if (l && c && 'object' == typeof c && void 0 === c.outlets) {
                if (!sC(l, c, s)) return o;
                i += 2;
              } else {
                if (!sC(l, {}, s)) return o;
                i++;
              }
              r++;
            }
            return { match: !0, pathIndex: r, commandIndex: i };
          })(e, n, t),
          r = t.slice(i.commandIndex);
        if (i.match && i.pathIndex < e.segments.length) {
          const o = new ee(e.segments.slice(0, i.pathIndex), {});
          return (o.children[Z] = new ee(e.segments.slice(i.pathIndex), e.children)), ta(o, 0, r);
        }
        return i.match && 0 === r.length
          ? new ee(e.segments, {})
          : i.match && !e.hasChildren()
          ? dp(e, n, t)
          : i.match
          ? ta(e, 0, r)
          : dp(e, n, t);
      }
      function ta(e, n, t) {
        if (0 === t.length) return new ee(e.segments, {});
        {
          const i = (function KL(e) {
              return ea(e[0]) ? e[0].outlets : { [Z]: e };
            })(t),
            r = {};
          return (
            _t(i, (o, s) => {
              'string' == typeof o && (o = [o]), null !== o && (r[s] = up(e.children[s], n, o));
            }),
            _t(e.children, (o, s) => {
              void 0 === i[s] && (r[s] = o);
            }),
            new ee(e.segments, r)
          );
        }
      }
      function dp(e, n, t) {
        const i = e.segments.slice(0, n);
        let r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (ea(o)) {
            const l = QL(o.outlets);
            return new ee(i, l);
          }
          if (0 === r && Zs(t[0])) {
            i.push(new Ys(e.segments[n].path, oC(t[0]))), r++;
            continue;
          }
          const s = ea(o) ? o.outlets[Z] : `${o}`,
            a = r < t.length - 1 ? t[r + 1] : null;
          s && a && Zs(a) ? (i.push(new Ys(s, oC(a))), (r += 2)) : (i.push(new Ys(s, {})), r++);
        }
        return new ee(i, {});
      }
      function QL(e) {
        const n = {};
        return (
          _t(e, (t, i) => {
            'string' == typeof t && (t = [t]), null !== t && (n[i] = dp(new ee([], {}), 0, t));
          }),
          n
        );
      }
      function oC(e) {
        const n = {};
        return _t(e, (t, i) => (n[i] = `${t}`)), n;
      }
      function sC(e, n, t) {
        return e == t.path && Qn(n, t.parameters);
      }
      class _i {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class fp extends _i {
        constructor(n, t, i = 'imperative', r = null) {
          super(n, t), (this.type = 0), (this.navigationTrigger = i), (this.restoredState = r);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ji extends _i {
        constructor(n, t, i) {
          super(n, t), (this.urlAfterRedirects = i), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Oc extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.reason = i), (this.code = r), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class aC extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.error = i), (this.target = r), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class XL extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class YL extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class JL extends _i {
        constructor(n, t, i, r, o) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.shouldActivate = o), (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class ZL extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class eV extends _i {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class tV {
        constructor(n) {
          (this.route = n), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class nV {
        constructor(n) {
          (this.route = n), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class iV {
        constructor(n) {
          (this.snapshot = n), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class rV {
        constructor(n) {
          (this.snapshot = n), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class oV {
        constructor(n) {
          (this.snapshot = n), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class sV {
        constructor(n) {
          (this.snapshot = n), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class lC {
        constructor(n, t, i) {
          (this.routerEvent = n), (this.position = t), (this.anchor = i), (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class cC {
        constructor(n) {
          this._root = n;
        }
        get root() {
          return this._root.value;
        }
        parent(n) {
          const t = this.pathFromRoot(n);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
          const t = hp(n, this._root);
          return t ? t.children.map((i) => i.value) : [];
        }
        firstChild(n) {
          const t = hp(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = pp(n, this._root);
          return t.length < 2 ? [] : t[t.length - 2].children.map((r) => r.value).filter((r) => r !== n);
        }
        pathFromRoot(n) {
          return pp(n, this._root).map((t) => t.value);
        }
      }
      function hp(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const i = hp(e, t);
          if (i) return i;
        }
        return null;
      }
      function pp(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const i = pp(e, t);
          if (i.length) return i.unshift(n), i;
        }
        return [];
      }
      class mi {
        constructor(n, t) {
          (this.value = n), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Po(e) {
        const n = {};
        return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
      }
      class uC extends cC {
        constructor(n, t) {
          super(n), (this.snapshot = t), gp(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function dC(e, n) {
        const t = (function lV(e, n) {
            const s = new Ic([], {}, {}, '', {}, Z, n, null, e.root, -1, {});
            return new hC('', new mi(s, []));
          })(e, n),
          i = new ft([new Ys('', {})]),
          r = new ft({}),
          o = new ft({}),
          s = new ft({}),
          a = new ft(''),
          l = new Hi(i, r, s, a, o, Z, n, t.root);
        return (l.snapshot = t.root), new uC(new mi(l, []), t);
      }
      class Hi {
        constructor(n, t, i, r, o, s, a, l) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = i),
            (this.fragment = r),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = this.params.pipe(L((n) => Io(n)))), this._paramMap;
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(L((n) => Io(n)))), this._queryParamMap
          );
        }
        toString() {
          return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
        }
      }
      function fC(e, n = 'emptyOnly') {
        const t = e.pathFromRoot;
        let i = 0;
        if ('always' !== n)
          for (i = t.length - 1; i >= 1; ) {
            const r = t[i],
              o = t[i - 1];
            if (r.routeConfig && '' === r.routeConfig.path) i--;
            else {
              if (o.component) break;
              i--;
            }
          }
        return (function cV(e) {
          return e.reduce(
            (n, t) => ({
              params: { ...n.params, ...t.params },
              data: { ...n.data, ...t.data },
              resolve: { ...t.data, ...n.resolve, ...t.routeConfig?.data, ...t._resolvedData },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(i));
      }
      class Ic {
        constructor(n, t, i, r, o, s, a, l, c, u, d, f) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = i),
            (this.fragment = r),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = c),
            (this._lastPathIndex = u),
            (this._correctedLastPathIndex = f ?? u),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = Io(this.params)), this._paramMap;
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Io(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return `Route(url:'${this.url.map((i) => i.toString()).join('/')}', path:'${
            this.routeConfig ? this.routeConfig.path : ''
          }')`;
        }
      }
      class hC extends cC {
        constructor(n, t) {
          super(t), (this.url = n), gp(this, t);
        }
        toString() {
          return pC(this._root);
        }
      }
      function gp(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => gp(e, t));
      }
      function pC(e) {
        const n = e.children.length > 0 ? ` { ${e.children.map(pC).join(', ')} } ` : '';
        return `${e.value}${n}`;
      }
      function _p(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            Qn(n.queryParams, t.queryParams) || e.queryParams.next(t.queryParams),
            n.fragment !== t.fragment && e.fragment.next(t.fragment),
            Qn(n.params, t.params) || e.params.next(t.params),
            (function NL(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!Qn(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.url.next(t.url),
            Qn(n.data, t.data) || e.data.next(t.data);
        } else (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function mp(e, n) {
        const t =
          Qn(e.params, n.params) &&
          (function OL(e, n) {
            return mr(e, n) && e.every((t, i) => Qn(t.parameters, n[i].parameters));
          })(e.url, n.url);
        return t && !(!e.parent != !n.parent) && (!e.parent || mp(e.parent, n.parent));
      }
      function na(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const i = t.value;
          i._futureSnapshot = n.value;
          const r = (function dV(e, n, t) {
            return n.children.map((i) => {
              for (const r of t.children) if (e.shouldReuseRoute(i.value, r.value.snapshot)) return na(e, i, r);
              return na(e, i);
            });
          })(e, n, t);
          return new mi(i, r);
        }
        {
          if (e.shouldAttach(n.value)) {
            const o = e.retrieve(n.value);
            if (null !== o) {
              const s = o.route;
              return (s.value._futureSnapshot = n.value), (s.children = n.children.map((a) => na(e, a))), s;
            }
          }
          const i = (function fV(e) {
              return new Hi(
                new ft(e.url),
                new ft(e.params),
                new ft(e.queryParams),
                new ft(e.fragment),
                new ft(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            r = n.children.map((o) => na(e, o));
          return new mi(i, r);
        }
      }
      const vp = 'ngNavigationCancelingError';
      function gC(e, n) {
        const { redirectTo: t, navigationBehaviorOptions: i } = vr(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
          r = _C(!1, 0, n);
        return (r.url = t), (r.navigationBehaviorOptions = i), r;
      }
      function _C(e, n, t) {
        const i = new Error('NavigationCancelingError: ' + (e || ''));
        return (i[vp] = !0), (i.cancellationCode = n), t && (i.url = t), i;
      }
      function mC(e) {
        return vC(e) && vr(e.url);
      }
      function vC(e) {
        return e && e[vp];
      }
      class hV {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new ia()),
            (this.attachRef = null);
        }
      }
      let ia = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, i) {
            const r = this.getOrCreateContext(t);
            (r.outlet = i), this.contexts.set(t, r);
          }
          onChildOutletDestroyed(t) {
            const i = this.getContext(t);
            i && ((i.outlet = null), (i.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let i = this.getContext(t);
            return i || ((i = new hV()), this.contexts.set(t, i)), i;
          }
          getContext(t) {
            return this.contexts.get(t) || null;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      const Ac = !1;
      let Rc = (() => {
        class e {
          constructor(t, i, r, o, s) {
            (this.parentContexts = t),
              (this.location = i),
              (this.changeDetector = o),
              (this.environmentInjector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new U()),
              (this.deactivateEvents = new U()),
              (this.attachEvents = new U()),
              (this.detachEvents = new U()),
              (this.name = r || Z),
              t.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.getContext(this.name)?.outlet === this &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const t = this.parentContexts.getContext(this.name);
              t &&
                t.route &&
                (t.attachRef ? this.attach(t.attachRef, t.route) : this.activateWith(t.route, t.injector));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new S(4012, Ac);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new S(4012, Ac);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
          }
          detach() {
            if (!this.activated) throw new S(4012, Ac);
            this.location.detach();
            const t = this.activated;
            return (this.activated = null), (this._activatedRoute = null), this.detachEvents.emit(t.instance), t;
          }
          attach(t, i) {
            (this.activated = t),
              (this._activatedRoute = i),
              this.location.insert(t.hostView),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, i) {
            if (this.isActivated) throw new S(4013, Ac);
            this._activatedRoute = t;
            const r = this.location,
              s = t._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new pV(t, a, r.injector);
            if (
              i &&
              (function gV(e) {
                return !!e.resolveComponentFactory;
              })(i)
            ) {
              const c = i.resolveComponentFactory(s);
              this.activated = r.createComponent(c, r.length, l);
            } else
              this.activated = r.createComponent(s, {
                index: r.length,
                injector: l,
                environmentInjector: i ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(), this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(
              _(ia),
              _(Nn),
              (function nr(e) {
                return (function KE(e, n) {
                  if ('class' === n) return e.classes;
                  if ('style' === n) return e.styles;
                  const t = e.attrs;
                  if (t) {
                    const i = t.length;
                    let r = 0;
                    for (; r < i; ) {
                      const o = t[r];
                      if (C_(o)) break;
                      if (0 === o) r += 2;
                      else if ('number' == typeof o) for (r++; r < i && 'string' == typeof t[r]; ) r++;
                      else {
                        if (o === n) return t[r + 1];
                        r += 2;
                      }
                    }
                  }
                  return null;
                })(nt(), e);
              })('name'),
              _(En),
              _(Oi)
            );
          }),
          (e.ɵdir = I({
            type: e,
            selectors: [['router-outlet']],
            outputs: {
              activateEvents: 'activate',
              deactivateEvents: 'deactivate',
              attachEvents: 'attach',
              detachEvents: 'detach',
            },
            exportAs: ['outlet'],
          })),
          e
        );
      })();
      class pV {
        constructor(n, t, i) {
          (this.route = n), (this.childContexts = t), (this.parent = i);
        }
        get(n, t) {
          return n === Hi ? this.route : n === ia ? this.childContexts : this.parent.get(n, t);
        }
      }
      let yC = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵcmp = yt({
            type: e,
            selectors: [['ng-component']],
            decls: 1,
            vars: 0,
            template: function (t, i) {
              1 & t && gt(0, 'router-outlet');
            },
            dependencies: [Rc],
            encapsulation: 2,
          })),
          e
        );
      })();
      function bC(e, n) {
        return e.providers && !e._injector && (e._injector = Fl(e.providers, n, `Route: ${e.path}`)), e._injector ?? n;
      }
      function bp(e) {
        const n = e.children && e.children.map(bp),
          t = n ? { ...e, children: n } : { ...e };
        return (
          !t.component && !t.loadComponent && (n || t.loadChildren) && t.outlet && t.outlet !== Z && (t.component = yC),
          t
        );
      }
      function an(e) {
        return e.outlet || Z;
      }
      function DC(e, n) {
        const t = e.filter((i) => an(i) === n);
        return t.push(...e.filter((i) => an(i) !== n)), t;
      }
      function CC(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let n = e.parent; n; n = n.parent) {
          const t = n.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class bV {
        constructor(n, t, i, r) {
          (this.routeReuseStrategy = n), (this.futureState = t), (this.currState = i), (this.forwardEvent = r);
        }
        activate(n) {
          const t = this.futureState._root,
            i = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, i, n), _p(this.futureState.root), this.activateChildRoutes(t, i, n);
        }
        deactivateChildRoutes(n, t, i) {
          const r = Po(t);
          n.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, r[s], i), delete r[s];
          }),
            _t(r, (o, s) => {
              this.deactivateRouteAndItsChildren(o, i);
            });
        }
        deactivateRoutes(n, t, i) {
          const r = n.value,
            o = t ? t.value : null;
          if (r === o)
            if (r.component) {
              const s = i.getContext(r.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, i);
          else o && this.deactivateRouteAndItsChildren(t, i);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const i = t.getContext(n.value.outlet),
            r = i && n.value.component ? i.children : t,
            o = Po(n);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], r);
          if (i && i.outlet) {
            const s = i.outlet.detach(),
              a = i.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, { componentRef: s, route: n, contexts: a });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const i = t.getContext(n.value.outlet),
            r = i && n.value.component ? i.children : t,
            o = Po(n);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], r);
          i &&
            i.outlet &&
            (i.outlet.deactivate(),
            i.children.onOutletDeactivated(),
            (i.attachRef = null),
            (i.resolver = null),
            (i.route = null));
        }
        activateChildRoutes(n, t, i) {
          const r = Po(t);
          n.children.forEach((o) => {
            this.activateRoutes(o, r[o.value.outlet], i), this.forwardEvent(new sV(o.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new rV(n.value.snapshot));
        }
        activateRoutes(n, t, i) {
          const r = n.value,
            o = t ? t.value : null;
          if ((_p(r), r === o))
            if (r.component) {
              const s = i.getOrCreateContext(r.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, i);
          else if (r.component) {
            const s = i.getOrCreateContext(r.outlet);
            if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(r.snapshot);
              this.routeReuseStrategy.store(r.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                _p(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = CC(r.snapshot),
                l = a?.get(ps) ?? null;
              (s.attachRef = null),
                (s.route = r),
                (s.resolver = l),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(r, s.injector),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, i);
        }
      }
      class wC {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Pc {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function DV(e, n, t) {
        const i = e._root;
        return ra(i, n ? n._root : null, t, [i.value]);
      }
      function xc(e, n, t) {
        return (CC(n) ?? t).get(e);
      }
      function ra(e, n, t, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
        const o = Po(n);
        return (
          e.children.forEach((s) => {
            (function wV(e, n, t, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
              const o = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function NV(e, n, t) {
                  if ('function' == typeof t) return t(e, n);
                  switch (t) {
                    case 'pathParamsChange':
                      return !mr(e.url, n.url);
                    case 'pathParamsOrQueryParamsChange':
                      return !mr(e.url, n.url) || !Qn(e.queryParams, n.queryParams);
                    case 'always':
                      return !0;
                    case 'paramsOrQueryParamsChange':
                      return !mp(e, n) || !Qn(e.queryParams, n.queryParams);
                    default:
                      return !mp(e, n);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l ? r.canActivateChecks.push(new wC(i)) : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  ra(e, n, o.component ? (a ? a.children : null) : t, i, r),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    r.canDeactivateChecks.push(new Pc(a.outlet.component, s));
              } else
                s && oa(n, a, r),
                  r.canActivateChecks.push(new wC(i)),
                  ra(e, null, o.component ? (a ? a.children : null) : t, i, r);
            })(s, o[s.value.outlet], t, i.concat([s.value]), r),
              delete o[s.value.outlet];
          }),
          _t(o, (s, a) => oa(s, t.getContext(a), r)),
          r
        );
      }
      function oa(e, n, t) {
        const i = Po(e),
          r = e.value;
        _t(i, (o, s) => {
          oa(o, r.component ? (n ? n.children.getContext(s) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new Pc(r.component && n && n.outlet && n.outlet.isActivated ? n.outlet.component : null, r)
          );
      }
      function sa(e) {
        return 'function' == typeof e;
      }
      function Dp(e) {
        return e instanceof yc || 'EmptyError' === e?.name;
      }
      const Fc = Symbol('INITIAL_VALUE');
      function xo() {
        return st((e) =>
          bc(
            e.map((n) =>
              n.pipe(
                De(1),
                (function Dc(...e) {
                  const n = Wo(e);
                  return Ae((t, i) => {
                    (n ? Vi(e, t, n) : Vi(e, t)).subscribe(i);
                  });
                })(Fc)
              )
            )
          ).pipe(
            L((n) => {
              for (const t of n)
                if (!0 !== t) {
                  if (t === Fc) return Fc;
                  if (!1 === t || t instanceof _r) return t;
                }
              return !0;
            }),
            Oe((n) => n !== Fc),
            De(1)
          )
        );
      }
      function NC(e) {
        return (function bT(...e) {
          return Sg(e);
        })(
          at((n) => {
            if (vr(n)) throw gC(0, n);
          }),
          L((n) => !0 === n)
        );
      }
      const Cp = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function TC(e, n, t, i, r) {
        const o = wp(e, n, t);
        return o.matched
          ? (function HV(e, n, t, i) {
              const r = n.canMatch;
              return r && 0 !== r.length
                ? P(
                    r.map((s) => {
                      const a = e.get(s),
                        l = (function IV(e) {
                          return e && sa(e.canMatch);
                        })(a)
                          ? a.canMatch(n, t)
                          : a(n, t);
                      return gi(l);
                    })
                  ).pipe(xo(), NC())
                : P(!0);
            })((i = bC(n, i)), n, t).pipe(L((s) => (!0 === s ? o : { ...Cp })))
          : P(o);
      }
      function wp(e, n, t) {
        if ('' === n.path)
          return 'full' === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? { ...Cp }
            : { matched: !0, consumedSegments: [], remainingSegments: t, parameters: {}, positionalParamSegments: {} };
        const r = (n.matcher || wL)(t, e, n);
        if (!r) return { ...Cp };
        const o = {};
        _t(r.posParams, (a, l) => {
          o[l] = a.path;
        });
        const s = r.consumed.length > 0 ? { ...o, ...r.consumed[r.consumed.length - 1].parameters } : o;
        return {
          matched: !0,
          consumedSegments: r.consumed,
          remainingSegments: t.slice(r.consumed.length),
          parameters: s,
          positionalParamSegments: r.posParams ?? {},
        };
      }
      function kc(e, n, t, i, r = 'corrected') {
        if (
          t.length > 0 &&
          (function $V(e, n, t) {
            return t.some((i) => Lc(e, n, i) && an(i) !== Z);
          })(e, t, i)
        ) {
          const s = new ee(
            n,
            (function UV(e, n, t, i) {
              const r = {};
              (r[Z] = i), (i._sourceSegment = e), (i._segmentIndexShift = n.length);
              for (const o of t)
                if ('' === o.path && an(o) !== Z) {
                  const s = new ee([], {});
                  (s._sourceSegment = e), (s._segmentIndexShift = n.length), (r[an(o)] = s);
                }
              return r;
            })(e, n, i, new ee(t, e.children))
          );
          return (s._sourceSegment = e), (s._segmentIndexShift = n.length), { segmentGroup: s, slicedSegments: [] };
        }
        if (
          0 === t.length &&
          (function WV(e, n, t) {
            return t.some((i) => Lc(e, n, i));
          })(e, t, i)
        ) {
          const s = new ee(
            e.segments,
            (function GV(e, n, t, i, r, o) {
              const s = {};
              for (const a of i)
                if (Lc(e, t, a) && !r[an(a)]) {
                  const l = new ee([], {});
                  (l._sourceSegment = e),
                    (l._segmentIndexShift = 'legacy' === o ? e.segments.length : n.length),
                    (s[an(a)] = l);
                }
              return { ...r, ...s };
            })(e, n, t, i, e.children, r)
          );
          return (s._sourceSegment = e), (s._segmentIndexShift = n.length), { segmentGroup: s, slicedSegments: t };
        }
        const o = new ee(e.segments, e.children);
        return (o._sourceSegment = e), (o._segmentIndexShift = n.length), { segmentGroup: o, slicedSegments: t };
      }
      function Lc(e, n, t) {
        return (!(e.hasChildren() || n.length > 0) || 'full' !== t.pathMatch) && '' === t.path;
      }
      function EC(e, n, t, i) {
        return !!(an(e) === i || (i !== Z && Lc(n, t, e))) && ('**' === e.path || wp(n, e, t).matched);
      }
      function SC(e, n, t) {
        return 0 === n.length && !e.children[t];
      }
      const Vc = !1;
      class Bc {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class MC {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function aa(e) {
        return Oo(new Bc(e));
      }
      function OC(e) {
        return Oo(new MC(e));
      }
      class QV {
        constructor(n, t, i, r, o) {
          (this.injector = n),
            (this.configLoader = t),
            (this.urlSerializer = i),
            (this.urlTree = r),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const n = kc(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new ee(n.segments, n.children);
          return this.expandSegmentGroup(this.injector, this.config, t, Z)
            .pipe(L((o) => this.createUrlTree(Mc(o), this.urlTree.queryParams, this.urlTree.fragment)))
            .pipe(
              qn((o) => {
                if (o instanceof MC) return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof Bc ? this.noMatchError(o) : o;
              })
            );
        }
        match(n) {
          return this.expandSegmentGroup(this.injector, this.config, n.root, Z)
            .pipe(L((r) => this.createUrlTree(Mc(r), n.queryParams, n.fragment)))
            .pipe(
              qn((r) => {
                throw r instanceof Bc ? this.noMatchError(r) : r;
              })
            );
        }
        noMatchError(n) {
          return new S(4002, Vc);
        }
        createUrlTree(n, t, i) {
          const r = lp(n);
          return new _r(r, t, i);
        }
        expandSegmentGroup(n, t, i, r) {
          return 0 === i.segments.length && i.hasChildren()
            ? this.expandChildren(n, t, i).pipe(L((o) => new ee([], o)))
            : this.expandSegment(n, i, t, i.segments, r, !0);
        }
        expandChildren(n, t, i) {
          const r = [];
          for (const o of Object.keys(i.children)) 'primary' === o ? r.unshift(o) : r.push(o);
          return Ue(r).pipe(
            pi((o) => {
              const s = i.children[o],
                a = DC(t, o);
              return this.expandSegmentGroup(n, a, s, o).pipe(L((l) => ({ segment: l, outlet: o })));
            }),
            j1((o, s) => ((o[s.outlet] = s.segment), o), {}),
            H1()
          );
        }
        expandSegment(n, t, i, r, o, s) {
          return Ue(i).pipe(
            pi((a) =>
              this.expandSegmentAgainstRoute(n, t, i, a, r, o, s).pipe(
                qn((c) => {
                  if (c instanceof Bc) return P(null);
                  throw c;
                })
              )
            ),
            Bi((a) => !!a),
            qn((a, l) => {
              if (Dp(a)) return SC(t, r, o) ? P(new ee([], {})) : aa(t);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(n, t, i, r, o, s, a) {
          return EC(r, t, o, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(n, t, r, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s)
              : aa(t)
            : aa(t);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s) {
          return '**' === r.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, i, r, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s);
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, i, r) {
          const o = this.applyRedirectCommands([], i.redirectTo, {});
          return i.redirectTo.startsWith('/')
            ? OC(o)
            : this.lineralizeSegments(i, o).pipe(
                Ge((s) => {
                  const a = new ee(s, {});
                  return this.expandSegment(n, a, t, s, r, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s) {
          const { matched: a, consumedSegments: l, remainingSegments: c, positionalParamSegments: u } = wp(t, r, o);
          if (!a) return aa(t);
          const d = this.applyRedirectCommands(l, r.redirectTo, u);
          return r.redirectTo.startsWith('/')
            ? OC(d)
            : this.lineralizeSegments(r, d).pipe(Ge((f) => this.expandSegment(n, t, i, f.concat(c), s, !1)));
        }
        matchSegmentAgainstRoute(n, t, i, r, o) {
          return '**' === i.path
            ? ((n = bC(i, n)),
              i.loadChildren
                ? (i._loadedRoutes
                    ? P({ routes: i._loadedRoutes, injector: i._loadedInjector })
                    : this.configLoader.loadChildren(n, i)
                  ).pipe(L((a) => ((i._loadedRoutes = a.routes), (i._loadedInjector = a.injector), new ee(r, {}))))
                : P(new ee(r, {})))
            : TC(t, i, r, n).pipe(
                st(({ matched: s, consumedSegments: a, remainingSegments: l }) =>
                  s
                    ? this.getChildConfig((n = i._injector ?? n), i, r).pipe(
                        Ge((u) => {
                          const d = u.injector ?? n,
                            f = u.routes,
                            { segmentGroup: h, slicedSegments: p } = kc(t, a, l, f),
                            g = new ee(h.segments, h.children);
                          if (0 === p.length && g.hasChildren())
                            return this.expandChildren(d, f, g).pipe(L((b) => new ee(a, b)));
                          if (0 === f.length && 0 === p.length) return P(new ee(a, {}));
                          const m = an(i) === o;
                          return this.expandSegment(d, g, f, p, m ? Z : o, !0).pipe(
                            L((D) => new ee(a.concat(D.segments), D.children))
                          );
                        })
                      )
                    : aa(t)
                )
              );
        }
        getChildConfig(n, t, i) {
          return t.children
            ? P({ routes: t.children, injector: n })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? P({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function jV(e, n, t, i) {
                  const r = n.canLoad;
                  return void 0 === r || 0 === r.length
                    ? P(!0)
                    : P(
                        r.map((s) => {
                          const a = e.get(s),
                            l = (function EV(e) {
                              return e && sa(e.canLoad);
                            })(a)
                              ? a.canLoad(n, t)
                              : a(n, t);
                          return gi(l);
                        })
                      ).pipe(xo(), NC());
                })(n, t, i).pipe(
                  Ge((r) =>
                    r
                      ? this.configLoader.loadChildren(n, t).pipe(
                          at((o) => {
                            (t._loadedRoutes = o.routes), (t._loadedInjector = o.injector);
                          })
                        )
                      : (function KV(e) {
                          return Oo(_C(Vc, 3));
                        })()
                  )
                )
            : P({ routes: [], injector: n });
        }
        lineralizeSegments(n, t) {
          let i = [],
            r = t.root;
          for (;;) {
            if (((i = i.concat(r.segments)), 0 === r.numberOfChildren)) return P(i);
            if (r.numberOfChildren > 1 || !r.children[Z]) return Oo(new S(4e3, Vc));
            r = r.children[Z];
          }
        }
        applyRedirectCommands(n, t, i) {
          return this.applyRedirectCreateUrlTree(t, this.urlSerializer.parse(t), n, i);
        }
        applyRedirectCreateUrlTree(n, t, i, r) {
          const o = this.createSegmentGroup(n, t.root, i, r);
          return new _r(o, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
        }
        createQueryParams(n, t) {
          const i = {};
          return (
            _t(n, (r, o) => {
              if ('string' == typeof r && r.startsWith(':')) {
                const a = r.substring(1);
                i[o] = t[a];
              } else i[o] = r;
            }),
            i
          );
        }
        createSegmentGroup(n, t, i, r) {
          const o = this.createSegments(n, t.segments, i, r);
          let s = {};
          return (
            _t(t.children, (a, l) => {
              s[l] = this.createSegmentGroup(n, a, i, r);
            }),
            new ee(o, s)
          );
        }
        createSegments(n, t, i, r) {
          return t.map((o) => (o.path.startsWith(':') ? this.findPosParam(n, o, r) : this.findOrReturn(o, i)));
        }
        findPosParam(n, t, i) {
          const r = i[t.path.substring(1)];
          if (!r) throw new S(4001, Vc);
          return r;
        }
        findOrReturn(n, t) {
          let i = 0;
          for (const r of t) {
            if (r.path === n.path) return t.splice(i), r;
            i++;
          }
          return n;
        }
      }
      class YV {}
      class e2 {
        constructor(n, t, i, r, o, s, a, l) {
          (this.injector = n),
            (this.rootComponentType = t),
            (this.config = i),
            (this.urlTree = r),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = l);
        }
        recognize() {
          const n = kc(
            this.urlTree.root,
            [],
            [],
            this.config.filter((t) => void 0 === t.redirectTo),
            this.relativeLinkResolution
          ).segmentGroup;
          return this.processSegmentGroup(this.injector, this.config, n, Z).pipe(
            L((t) => {
              if (null === t) return null;
              const i = new Ic(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  Z,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                r = new mi(i, t),
                o = new hC(this.url, r);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(n) {
          const t = n.value,
            i = fC(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(i.params)),
            (t.data = Object.freeze(i.data)),
            n.children.forEach((r) => this.inheritParamsAndData(r));
        }
        processSegmentGroup(n, t, i, r) {
          return 0 === i.segments.length && i.hasChildren()
            ? this.processChildren(n, t, i)
            : this.processSegment(n, t, i, i.segments, r);
        }
        processChildren(n, t, i) {
          return Ue(Object.keys(i.children)).pipe(
            pi((r) => {
              const o = i.children[r],
                s = DC(t, r);
              return this.processSegmentGroup(n, s, o, r);
            }),
            j1((r, o) => (r && o ? (r.push(...o), r) : null)),
            (function DL(e, n = !1) {
              return Ae((t, i) => {
                let r = 0;
                t.subscribe(
                  Ce(i, (o) => {
                    const s = e(o, r++);
                    (s || n) && i.next(o), !s && i.complete();
                  })
                );
              });
            })((r) => null !== r),
            Cc(null),
            H1(),
            L((r) => {
              if (null === r) return null;
              const o = IC(r);
              return (
                (function t2(e) {
                  e.sort((n, t) =>
                    n.value.outlet === Z ? -1 : t.value.outlet === Z ? 1 : n.value.outlet.localeCompare(t.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(n, t, i, r, o) {
          return Ue(t).pipe(
            pi((s) => this.processSegmentAgainstRoute(s._injector ?? n, s, i, r, o)),
            Bi((s) => !!s),
            qn((s) => {
              if (Dp(s)) return SC(i, r, o) ? P([]) : P(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(n, t, i, r, o) {
          if (t.redirectTo || !EC(t, i, r, o)) return P(null);
          let s;
          if ('**' === t.path) {
            const a = r.length > 0 ? W1(r).parameters : {},
              l = RC(i) + r.length;
            s = P({
              snapshot: new Ic(
                r,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                xC(t),
                an(t),
                t.component ?? t._loadedComponent ?? null,
                t,
                AC(i),
                l,
                FC(t),
                l
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = TC(i, t, r, n).pipe(
              L(({ matched: a, consumedSegments: l, remainingSegments: c, parameters: u }) => {
                if (!a) return null;
                const d = RC(i) + l.length;
                return {
                  snapshot: new Ic(
                    l,
                    u,
                    Object.freeze({ ...this.urlTree.queryParams }),
                    this.urlTree.fragment,
                    xC(t),
                    an(t),
                    t.component ?? t._loadedComponent ?? null,
                    t,
                    AC(i),
                    d,
                    FC(t),
                    d
                  ),
                  consumedSegments: l,
                  remainingSegments: c,
                };
              })
            );
          return s.pipe(
            st((a) => {
              if (null === a) return P(null);
              const { snapshot: l, consumedSegments: c, remainingSegments: u } = a;
              n = t._injector ?? n;
              const d = t._loadedInjector ?? n,
                f = (function n2(e) {
                  return e.children ? e.children : e.loadChildren ? e._loadedRoutes : [];
                })(t),
                { segmentGroup: h, slicedSegments: p } = kc(
                  i,
                  c,
                  u,
                  f.filter((m) => void 0 === m.redirectTo),
                  this.relativeLinkResolution
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(L((m) => (null === m ? null : [new mi(l, m)])));
              if (0 === f.length && 0 === p.length) return P([new mi(l, [])]);
              const g = an(t) === o;
              return this.processSegment(d, f, h, p, g ? Z : o).pipe(L((m) => (null === m ? null : [new mi(l, m)])));
            })
          );
        }
      }
      function r2(e) {
        const n = e.value.routeConfig;
        return n && '' === n.path && void 0 === n.redirectTo;
      }
      function IC(e) {
        const n = [],
          t = new Set();
        for (const i of e) {
          if (!r2(i)) {
            n.push(i);
            continue;
          }
          const r = n.find((o) => i.value.routeConfig === o.value.routeConfig);
          void 0 !== r ? (r.children.push(...i.children), t.add(r)) : n.push(i);
        }
        for (const i of t) {
          const r = IC(i.children);
          n.push(new mi(i.value, r));
        }
        return n.filter((i) => !t.has(i));
      }
      function AC(e) {
        let n = e;
        for (; n._sourceSegment; ) n = n._sourceSegment;
        return n;
      }
      function RC(e) {
        let n = e,
          t = n._segmentIndexShift ?? 0;
        for (; n._sourceSegment; ) (n = n._sourceSegment), (t += n._segmentIndexShift ?? 0);
        return t - 1;
      }
      function xC(e) {
        return e.data || {};
      }
      function FC(e) {
        return e.resolve || {};
      }
      const Np = Symbol('RouteTitle');
      function kC(e) {
        return 'string' == typeof e.title || null === e.title;
      }
      function Tp(e) {
        return st((n) => {
          const t = e(n);
          return t ? Ue(t).pipe(L(() => n)) : P(n);
        });
      }
      let LC = (() => {
          class e {
            buildTitle(t) {
              let i,
                r = t.root;
              for (; void 0 !== r; )
                (i = this.getResolvedTitleForRoute(r) ?? i), (r = r.children.find((o) => o.outlet === Z));
              return i;
            }
            getResolvedTitleForRoute(t) {
              return t.data[Np];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({
              token: e,
              factory: function () {
                return $e(VC);
              },
              providedIn: 'root',
            })),
            e
          );
        })(),
        VC = (() => {
          class e extends LC {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const i = this.buildTitle(t);
              void 0 !== i && this.title.setTitle(i);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(xh));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      class Ep {}
      class h2 extends class f2 {
        shouldDetach(n) {
          return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
          return !1;
        }
        retrieve(n) {
          return null;
        }
        shouldReuseRoute(n, t) {
          return n.routeConfig === t.routeConfig;
        }
      } {}
      const Sp = new k('', { providedIn: 'root', factory: () => ({}) }),
        Mp = new k('ROUTES');
      let Op = (() => {
        class e {
          constructor(t, i) {
            (this.injector = t),
              (this.compiler = i),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t)) return this.componentLoaders.get(t);
            if (t._loadedComponent) return P(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const i = gi(t.loadComponent()).pipe(
                at((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(t), (t._loadedComponent = o);
                }),
                Xs(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              r = new ip(i, () => new pe()).pipe(np());
            return this.componentLoaders.set(t, r), r;
          }
          loadChildren(t, i) {
            if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
            if (i._loadedRoutes) return P({ routes: i._loadedRoutes, injector: i._loadedInjector });
            this.onLoadStartListener && this.onLoadStartListener(i);
            const o = this.loadModuleFactoryOrRoutes(i.loadChildren).pipe(
                L((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(i);
                  let l,
                    c,
                    u = !1;
                  Array.isArray(a)
                    ? (c = a)
                    : ((l = a.create(t).injector), (c = $1(l.get(Mp, [], B.Self | B.Optional))));
                  return { routes: c.map(bp), injector: l };
                }),
                Xs(() => {
                  this.childrenLoaders.delete(i);
                })
              ),
              s = new ip(o, () => new pe()).pipe(np());
            return this.childrenLoaders.set(i, s), s;
          }
          loadModuleFactoryOrRoutes(t) {
            return gi(t()).pipe(
              Ge((i) => (i instanceof C0 || Array.isArray(i) ? P(i) : Ue(this.compiler.compileModuleAsync(i))))
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(pt), N(Yf));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      class g2 {}
      class _2 {
        shouldProcessUrl(n) {
          return !0;
        }
        extract(n) {
          return n;
        }
        merge(n, t) {
          return n;
        }
      }
      function m2(e) {
        throw e;
      }
      function v2(e, n, t) {
        return n.parse('/');
      }
      const y2 = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
        b2 = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' };
      function jC() {
        const e = $e(Y1),
          n = $e(ia),
          t = $e(hh),
          i = $e(pt),
          r = $e(Yf),
          o = $e(Mp, { optional: !0 }) ?? [],
          s = $e(Sp, { optional: !0 }) ?? {},
          a = $e(VC),
          l = $e(LC, { optional: !0 }),
          c = $e(g2, { optional: !0 }),
          u = $e(Ep, { optional: !0 }),
          d = new ht(null, e, n, t, i, r, $1(o));
        return (
          c && (d.urlHandlingStrategy = c),
          u && (d.routeReuseStrategy = u),
          (d.titleStrategy = l ?? a),
          (function D2(e, n) {
            e.errorHandler && (n.errorHandler = e.errorHandler),
              e.malformedUriErrorHandler && (n.malformedUriErrorHandler = e.malformedUriErrorHandler),
              e.onSameUrlNavigation && (n.onSameUrlNavigation = e.onSameUrlNavigation),
              e.paramsInheritanceStrategy && (n.paramsInheritanceStrategy = e.paramsInheritanceStrategy),
              e.relativeLinkResolution && (n.relativeLinkResolution = e.relativeLinkResolution),
              e.urlUpdateStrategy && (n.urlUpdateStrategy = e.urlUpdateStrategy),
              e.canceledNavigationResolution && (n.canceledNavigationResolution = e.canceledNavigationResolution);
          })(s, d),
          d
        );
      }
      let ht = (() => {
        class e {
          constructor(t, i, r, o, s, a, l) {
            (this.rootComponentType = t),
              (this.urlSerializer = i),
              (this.rootContexts = r),
              (this.location = o),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new pe()),
              (this.errorHandler = m2),
              (this.malformedUriErrorHandler = v2),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => P(void 0)),
              (this.urlHandlingStrategy = new _2()),
              (this.routeReuseStrategy = new h2()),
              (this.onSameUrlNavigation = 'ignore'),
              (this.paramsInheritanceStrategy = 'emptyOnly'),
              (this.urlUpdateStrategy = 'deferred'),
              (this.relativeLinkResolution = 'corrected'),
              (this.canceledNavigationResolution = 'replace'),
              (this.configLoader = s.get(Op)),
              (this.configLoader.onLoadEndListener = (f) => this.triggerEvent(new nV(f))),
              (this.configLoader.onLoadStartListener = (f) => this.triggerEvent(new tV(f))),
              (this.ngModule = s.get(cr)),
              (this.console = s.get(TP));
            const d = s.get(me);
            (this.isNgZoneEnabled = d instanceof me && me.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function TL() {
                return new _r(new ee([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = dC(this.currentUrlTree, this.rootComponentType)),
              (this.transitions = new ft({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(this.currentUrlTree),
                urlAfterRedirects: this.urlHandlingStrategy.extract(this.currentUrlTree),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: 'imperative',
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          setupNavigations(t) {
            const i = this.events;
            return t.pipe(
              Oe((r) => 0 !== r.id),
              L((r) => ({ ...r, extractedUrl: this.urlHandlingStrategy.extract(r.rawUrl) })),
              st((r) => {
                let o = !1,
                  s = !1;
                return P(r).pipe(
                  at((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? { ...this.lastSuccessfulNavigation, previousNavigation: null }
                        : null,
                    };
                  }),
                  st((a) => {
                    const l = this.browserUrlTree.toString(),
                      c = !this.navigated || a.extractedUrl.toString() !== l || l !== this.currentUrlTree.toString();
                    if (
                      ('reload' === this.onSameUrlNavigation || c) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        HC(a.source) && (this.browserUrlTree = a.extractedUrl),
                        P(a).pipe(
                          st((d) => {
                            const f = this.transitions.getValue();
                            return (
                              i.next(new fp(d.id, this.serializeUrl(d.extractedUrl), d.source, d.restoredState)),
                              f !== this.transitions.getValue() ? Jt : Promise.resolve(d)
                            );
                          }),
                          (function XV(e, n, t, i) {
                            return st((r) =>
                              (function qV(e, n, t, i, r) {
                                return new QV(e, n, t, i, r).apply();
                              })(e, n, t, r.extractedUrl, i).pipe(L((o) => ({ ...r, urlAfterRedirects: o })))
                            );
                          })(this.ngModule.injector, this.configLoader, this.urlSerializer, this.config),
                          at((d) => {
                            (this.currentNavigation = { ...this.currentNavigation, finalUrl: d.urlAfterRedirects }),
                              (r.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function s2(e, n, t, i, r, o) {
                            return Ge((s) =>
                              (function ZV(e, n, t, i, r, o, s = 'emptyOnly', a = 'legacy') {
                                return new e2(e, n, t, i, r, s, a, o).recognize().pipe(
                                  st((l) =>
                                    null === l
                                      ? (function JV(e) {
                                          return new he((n) => n.error(e));
                                        })(new YV())
                                      : P(l)
                                  )
                                );
                              })(e, n, t, s.urlAfterRedirects, i.serialize(s.urlAfterRedirects), i, r, o).pipe(
                                L((a) => ({ ...s, targetSnapshot: a }))
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.rootComponentType,
                            this.config,
                            this.urlSerializer,
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          at((d) => {
                            if (((r.targetSnapshot = d.targetSnapshot), 'eager' === this.urlUpdateStrategy)) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(d.urlAfterRedirects, d.rawUrl);
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new XL(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            i.next(f);
                          })
                        )
                      );
                    if (c && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
                      const { id: f, extractedUrl: h, source: p, restoredState: g, extras: m } = a,
                        y = new fp(f, this.serializeUrl(h), p, g);
                      i.next(y);
                      const D = dC(h, this.rootComponentType).snapshot;
                      return P(
                        (r = {
                          ...a,
                          targetSnapshot: D,
                          urlAfterRedirects: h,
                          extras: { ...m, skipLocationChange: !1, replaceUrl: !1 },
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), Jt;
                  }),
                  at((a) => {
                    const l = new YL(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(l);
                  }),
                  L((a) => (r = { ...a, guards: DV(a.targetSnapshot, a.currentSnapshot, this.rootContexts) })),
                  (function RV(e, n) {
                    return Ge((t) => {
                      const {
                        targetSnapshot: i,
                        currentSnapshot: r,
                        guards: { canActivateChecks: o, canDeactivateChecks: s },
                      } = t;
                      return 0 === s.length && 0 === o.length
                        ? P({ ...t, guardsResult: !0 })
                        : (function PV(e, n, t, i) {
                            return Ue(e).pipe(
                              Ge((r) =>
                                (function BV(e, n, t, i, r) {
                                  const o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
                                  return o && 0 !== o.length
                                    ? P(
                                        o.map((a) => {
                                          const l = xc(a, n, r);
                                          return gi(
                                            (function OV(e) {
                                              return e && sa(e.canDeactivate);
                                            })(l)
                                              ? l.canDeactivate(e, n, t, i)
                                              : l(e, n, t, i)
                                          ).pipe(Bi());
                                        })
                                      ).pipe(xo())
                                    : P(!0);
                                })(r.component, r.route, t, n, i)
                              ),
                              Bi((r) => !0 !== r, !0)
                            );
                          })(s, i, r, e).pipe(
                            Ge((a) =>
                              a &&
                              (function TV(e) {
                                return 'boolean' == typeof e;
                              })(a)
                                ? (function xV(e, n, t, i) {
                                    return Ue(n).pipe(
                                      pi((r) =>
                                        Vi(
                                          (function kV(e, n) {
                                            return null !== e && n && n(new iV(e)), P(!0);
                                          })(r.route.parent, i),
                                          (function FV(e, n) {
                                            return null !== e && n && n(new oV(e)), P(!0);
                                          })(r.route, i),
                                          (function VV(e, n, t) {
                                            const i = n[n.length - 1],
                                              o = n
                                                .slice(0, n.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function CV(e) {
                                                    const n = e.routeConfig ? e.routeConfig.canActivateChild : null;
                                                    return n && 0 !== n.length ? { node: e, guards: n } : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  Mo(() =>
                                                    P(
                                                      s.guards.map((l) => {
                                                        const c = xc(l, s.node, t);
                                                        return gi(
                                                          (function MV(e) {
                                                            return e && sa(e.canActivateChild);
                                                          })(c)
                                                            ? c.canActivateChild(i, e)
                                                            : c(i, e)
                                                        ).pipe(Bi());
                                                      })
                                                    ).pipe(xo())
                                                  )
                                                );
                                            return P(o).pipe(xo());
                                          })(e, r.path, t),
                                          (function LV(e, n, t) {
                                            const i = n.routeConfig ? n.routeConfig.canActivate : null;
                                            if (!i || 0 === i.length) return P(!0);
                                            const r = i.map((o) =>
                                              Mo(() => {
                                                const s = xc(o, n, t);
                                                return gi(
                                                  (function SV(e) {
                                                    return e && sa(e.canActivate);
                                                  })(s)
                                                    ? s.canActivate(n, e)
                                                    : s(n, e)
                                                ).pipe(Bi());
                                              })
                                            );
                                            return P(r).pipe(xo());
                                          })(e, r.route, t)
                                        )
                                      ),
                                      Bi((r) => !0 !== r, !0)
                                    );
                                  })(i, o, e, n)
                                : P(a)
                            ),
                            L((a) => ({ ...t, guardsResult: a }))
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  at((a) => {
                    if (((r.guardsResult = a.guardsResult), vr(a.guardsResult))) throw gC(0, a.guardsResult);
                    const l = new JL(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(l);
                  }),
                  Oe(
                    (a) => !!a.guardsResult || (this.restoreHistory(a), this.cancelNavigationTransition(a, '', 3), !1)
                  ),
                  Tp((a) => {
                    if (a.guards.canActivateChecks.length)
                      return P(a).pipe(
                        at((l) => {
                          const c = new ZL(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(c);
                        }),
                        st((l) => {
                          let c = !1;
                          return P(l).pipe(
                            (function a2(e, n) {
                              return Ge((t) => {
                                const {
                                  targetSnapshot: i,
                                  guards: { canActivateChecks: r },
                                } = t;
                                if (!r.length) return P(t);
                                let o = 0;
                                return Ue(r).pipe(
                                  pi((s) =>
                                    (function l2(e, n, t, i) {
                                      const r = e.routeConfig,
                                        o = e._resolve;
                                      return (
                                        void 0 !== r?.title && !kC(r) && (o[Np] = r.title),
                                        (function c2(e, n, t, i) {
                                          const r = (function u2(e) {
                                            return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
                                          })(e);
                                          if (0 === r.length) return P({});
                                          const o = {};
                                          return Ue(r).pipe(
                                            Ge((s) =>
                                              (function d2(e, n, t, i) {
                                                const r = xc(e, n, i);
                                                return gi(r.resolve ? r.resolve(n, t) : r(n, t));
                                              })(e[s], n, t, i).pipe(
                                                Bi(),
                                                at((a) => {
                                                  o[s] = a;
                                                })
                                              )
                                            ),
                                            rp(1),
                                            G1(o),
                                            qn((s) => (Dp(s) ? Jt : Oo(s)))
                                          );
                                        })(o, e, n, i).pipe(
                                          L(
                                            (s) => (
                                              (e._resolvedData = s),
                                              (e.data = fC(e, t).resolve),
                                              r && kC(r) && (e.data[Np] = r.title),
                                              null
                                            )
                                          )
                                        )
                                      );
                                    })(s.route, i, e, n)
                                  ),
                                  at(() => o++),
                                  rp(1),
                                  Ge((s) => (o === r.length ? P(t) : Jt))
                                );
                              });
                            })(this.paramsInheritanceStrategy, this.ngModule.injector),
                            at({
                              next: () => (c = !0),
                              complete: () => {
                                c || (this.restoreHistory(l), this.cancelNavigationTransition(l, '', 2));
                              },
                            })
                          );
                        }),
                        at((l) => {
                          const c = new eV(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(c);
                        })
                      );
                  }),
                  Tp((a) => {
                    const l = (c) => {
                      const u = [];
                      c.routeConfig?.loadComponent &&
                        !c.routeConfig._loadedComponent &&
                        u.push(
                          this.configLoader.loadComponent(c.routeConfig).pipe(
                            at((d) => {
                              c.component = d;
                            }),
                            L(() => {})
                          )
                        );
                      for (const d of c.children) u.push(...l(d));
                      return u;
                    };
                    return bc(l(a.targetSnapshot.root)).pipe(Cc(), De(1));
                  }),
                  Tp(() => this.afterPreactivation()),
                  L((a) => {
                    const l = (function uV(e, n, t) {
                      const i = na(e, n._root, t ? t._root : void 0);
                      return new uC(i, n);
                    })(this.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                    return (r = { ...a, targetRouterState: l });
                  }),
                  at((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(a.urlAfterRedirects, a.rawUrl)),
                      (this.routerState = a.targetRouterState),
                      'deferred' === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, n, t) => L((i) => (new bV(n, i.targetRouterState, i.currentRouterState, t).activate(e), i)))(
                    this.rootContexts,
                    this.routeReuseStrategy,
                    (a) => this.triggerEvent(a)
                  ),
                  at({
                    next() {
                      o = !0;
                    },
                    complete() {
                      o = !0;
                    },
                  }),
                  Xs(() => {
                    o || s || this.cancelNavigationTransition(r, '', 1),
                      this.currentNavigation?.id === r.id && (this.currentNavigation = null);
                  }),
                  qn((a) => {
                    if (((s = !0), vC(a))) {
                      mC(a) || ((this.navigated = !0), this.restoreHistory(r, !0));
                      const l = new Oc(r.id, this.serializeUrl(r.extractedUrl), a.message, a.cancellationCode);
                      if ((i.next(l), mC(a))) {
                        const c = this.urlHandlingStrategy.merge(a.url, this.rawUrlTree),
                          u = {
                            skipLocationChange: r.extras.skipLocationChange,
                            replaceUrl: 'eager' === this.urlUpdateStrategy || HC(r.source),
                          };
                        this.scheduleNavigation(c, 'imperative', null, u, {
                          resolve: r.resolve,
                          reject: r.reject,
                          promise: r.promise,
                        });
                      } else r.resolve(!1);
                    } else {
                      this.restoreHistory(r, !0);
                      const l = new aC(r.id, this.serializeUrl(r.extractedUrl), a, r.targetSnapshot ?? void 0);
                      i.next(l);
                      try {
                        r.resolve(this.errorHandler(a));
                      } catch (c) {
                        r.reject(c);
                      }
                    }
                    return Jt;
                  })
                );
              })
            );
          }
          resetRootComponentType(t) {
            (this.rootComponentType = t), (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(t) {
            this.transitions.next({ ...this.transitions.value, ...t });
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId && this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((t) => {
                const i = 'popstate' === t.type ? 'popstate' : 'hashchange';
                'popstate' === i &&
                  setTimeout(() => {
                    const r = { replaceUrl: !0 },
                      o = t.state?.navigationId ? t.state : null;
                    if (o) {
                      const a = { ...o };
                      delete a.navigationId, delete a.ɵrouterPageId, 0 !== Object.keys(a).length && (r.state = a);
                    }
                    const s = this.parseUrl(t.url);
                    this.scheduleNavigation(s, i, o, r);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(t) {
            this.events.next(t);
          }
          resetConfig(t) {
            (this.config = t.map(bp)), (this.navigated = !1), (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(), (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(t, i = {}) {
            const { relativeTo: r, queryParams: o, fragment: s, queryParamsHandling: a, preserveFragment: l } = i,
              c = r || this.routerState.root,
              u = l ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case 'merge':
                d = { ...this.currentUrlTree.queryParams, ...o };
                break;
              case 'preserve':
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = o || null;
            }
            return null !== d && (d = this.removeEmptyProps(d)), $L(c, this.currentUrlTree, t, d, u ?? null);
          }
          navigateByUrl(t, i = { skipLocationChange: !1 }) {
            const r = vr(t) ? t : this.parseUrl(t),
              o = this.urlHandlingStrategy.merge(r, this.rawUrlTree);
            return this.scheduleNavigation(o, 'imperative', null, i);
          }
          navigate(t, i = { skipLocationChange: !1 }) {
            return (
              (function C2(e) {
                for (let n = 0; n < e.length; n++) {
                  if (null == e[n]) throw new S(4008, false);
                }
              })(t),
              this.navigateByUrl(this.createUrlTree(t, i), i)
            );
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t);
          }
          parseUrl(t) {
            let i;
            try {
              i = this.urlSerializer.parse(t);
            } catch (r) {
              i = this.malformedUriErrorHandler(r, this.urlSerializer, t);
            }
            return i;
          }
          isActive(t, i) {
            let r;
            if (((r = !0 === i ? { ...y2 } : !1 === i ? { ...b2 } : i), vr(t))) return K1(this.currentUrlTree, t, r);
            const o = this.parseUrl(t);
            return K1(this.currentUrlTree, o, r);
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((i, r) => {
              const o = t[r];
              return null != o && (i[r] = o), i;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (t) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = t.id),
                  (this.currentPageId = t.targetPageId),
                  this.events.next(
                    new ji(t.id, this.serializeUrl(t.extractedUrl), this.serializeUrl(this.currentUrlTree))
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  this.titleStrategy?.updateTitle(this.routerState.snapshot),
                  t.resolve(!0);
              },
              (t) => {
                this.console.warn(`Unhandled Navigation Error: ${t}`);
              }
            );
          }
          scheduleNavigation(t, i, r, o, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, l, c;
            s
              ? ((a = s.resolve), (l = s.reject), (c = s.promise))
              : (c = new Promise((f, h) => {
                  (a = f), (l = h);
                }));
            const u = ++this.navigationId;
            let d;
            return (
              'computed' === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (r = this.location.getState()),
                  (d =
                    r && r.ɵrouterPageId
                      ? r.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: u,
                targetPageId: d,
                source: i,
                restoredState: r,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: t,
                extras: o,
                resolve: a,
                reject: l,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((f) => Promise.reject(f))
            );
          }
          setBrowserUrl(t, i) {
            const r = this.urlSerializer.serialize(t),
              o = { ...i.extras.state, ...this.generateNgRouterState(i.id, i.targetPageId) };
            this.location.isCurrentPathEqualTo(r) || i.extras.replaceUrl
              ? this.location.replaceState(r, '', o)
              : this.location.go(r, '', o);
          }
          restoreHistory(t, i = !1) {
            if ('computed' === this.canceledNavigationResolution) {
              const r = this.currentPageId - t.targetPageId;
              ('popstate' !== t.source &&
                'eager' !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === r
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === r &&
                  (this.resetState(t), (this.browserUrlTree = t.currentUrlTree), this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(r);
            } else
              'replace' === this.canceledNavigationResolution &&
                (i && this.resetState(t), this.resetUrlToCurrentUrlTree());
          }
          resetState(t) {
            (this.routerState = t.currentRouterState),
              (this.currentUrlTree = t.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, t.rawUrl));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              '',
              this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
            );
          }
          cancelNavigationTransition(t, i, r) {
            const o = new Oc(t.id, this.serializeUrl(t.extractedUrl), i, r);
            this.triggerEvent(o), t.resolve(!1);
          }
          generateNgRouterState(t, i) {
            return 'computed' === this.canceledNavigationResolution
              ? { navigationId: t, ɵrouterPageId: i }
              : { navigationId: t };
          }
        }
        return (
          (e.ɵfac = function (t) {
            qd();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return jC();
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      function HC(e) {
        return 'imperative' !== e;
      }
      class GC {}
      let UC = (() => {
        class e {
          constructor(t, i, r, o, s) {
            (this.router = t), (this.injector = r), (this.preloadingStrategy = o), (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Oe((t) => t instanceof ji),
                pi(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, i) {
            const r = [];
            for (const o of i) {
              o.providers && !o._injector && (o._injector = Fl(o.providers, t, `Route: ${o.path}`));
              const s = o._injector ?? t,
                a = o._loadedInjector ?? s;
              (o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) || (o.loadComponent && !o._loadedComponent)
                ? r.push(this.preloadConfig(s, o))
                : (o.children || o._loadedRoutes) && r.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return Ue(r).pipe(xr());
          }
          preloadConfig(t, i) {
            return this.preloadingStrategy.preload(i, () => {
              let r;
              r = i.loadChildren && void 0 === i.canLoad ? this.loader.loadChildren(t, i) : P(null);
              const o = r.pipe(
                Ge((s) =>
                  null === s
                    ? P(void 0)
                    : ((i._loadedRoutes = s.routes),
                      (i._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return i.loadComponent && !i._loadedComponent ? Ue([o, this.loader.loadComponent(i)]).pipe(xr()) : o;
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(ht), N(Yf), N(Oi), N(GC), N(Op));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const $C = new k('');
      let T2 = (() => {
        class e {
          constructor(t, i, r = {}) {
            (this.router = t),
              (this.viewportScroller = i),
              (this.options = r),
              (this.lastId = 0),
              (this.lastSource = 'imperative'),
              (this.restoredId = 0),
              (this.store = {}),
              (r.scrollPositionRestoration = r.scrollPositionRestoration || 'disabled'),
              (r.anchorScrolling = r.anchorScrolling || 'disabled');
          }
          init() {
            'disabled' !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration('manual'),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((t) => {
              t instanceof fp
                ? ((this.store[this.lastId] = this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState ? t.restoredState.navigationId : 0))
                : t instanceof ji &&
                  ((this.lastId = t.id),
                  this.scheduleScrollEvent(t, this.router.parseUrl(t.urlAfterRedirects).fragment));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((t) => {
              t instanceof lC &&
                (t.position
                  ? 'top' === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : 'enabled' === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(t.position)
                  : t.anchor && 'enabled' === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(t.anchor)
                  : 'disabled' !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(t, i) {
            this.router.triggerEvent(new lC(t, 'popstate' === this.lastSource ? this.store[this.restoredId] : null, i));
          }
          ngOnDestroy() {
            this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription && this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (t) {
            qd();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const WC = new k('ROUTER_FORROOT_GUARD'),
        zC = new k(''),
        E2 = [
          hh,
          { provide: Y1, useClass: sp },
          { provide: ht, useFactory: jC },
          ia,
          {
            provide: Hi,
            useFactory: function S2(e) {
              return e.routerState.root;
            },
            deps: [ht],
          },
          Op,
        ];
      function M2() {
        return new _b('Router', ht);
      }
      let ln = (() => {
        class e {
          constructor(t) {}
          static forRoot(t, i) {
            return {
              ngModule: e,
              providers: [
                E2,
                [],
                KC(t),
                { provide: WC, useFactory: R2, deps: [[ht, new as(), new ls()]] },
                { provide: Sp, useValue: i || {} },
                i?.useHash ? { provide: dr, useClass: px } : { provide: dr, useClass: jb },
                {
                  provide: $C,
                  useFactory: () => {
                    const e = $e(ht),
                      n = $e(AF),
                      t = $e(Sp);
                    return t.scrollOffset && n.setOffset(t.scrollOffset), new T2(e, n, t);
                  },
                },
                i?.preloadingStrategy ? B2(i.preloadingStrategy) : [],
                { provide: _b, multi: !0, useFactory: M2 },
                i?.initialNavigation ? x2(i) : [],
                [
                  { provide: qC, useFactory: P2 },
                  { provide: cb, multi: !0, useExisting: qC },
                ],
              ],
            };
          }
          static forChild(t) {
            return { ngModule: e, providers: [KC(t)] };
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(WC, 8));
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({})),
          e
        );
      })();
      function R2(e) {
        return 'guarded';
      }
      function KC(e) {
        return [{ provide: Mp, multi: !0, useValue: e }];
      }
      function P2() {
        const e = $e(pt);
        return (n) => {
          const t = e.get(Eo);
          if (n !== t.components[0]) return;
          const i = e.get(ht),
            r = e.get(QC);
          1 === e.get(Rp) && i.initialNavigation(),
            e.get(zC, null, B.Optional)?.setUpPreloading(),
            e.get($C, null, B.Optional)?.init(),
            i.resetRootComponentType(t.componentTypes[0]),
            r.next(),
            r.complete();
        };
      }
      const qC = new k('');
      function x2(e) {
        return [
          'disabled' === e.initialNavigation
            ? [
                {
                  provide: Ls,
                  multi: !0,
                  useFactory: () => {
                    const e = $e(ht);
                    return () => {
                      e.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Rp, useValue: 2 },
              ]
            : [],
          'enabledBlocking' === e.initialNavigation
            ? [
                { provide: Rp, useValue: 0 },
                {
                  provide: Ls,
                  multi: !0,
                  deps: [pt],
                  useFactory: (e) => {
                    const n = e.get(fx, Promise.resolve(null));
                    let t = !1;
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const o = e.get(ht),
                              s = e.get(QC);
                            (function i(r) {
                              e.get(ht)
                                .events.pipe(
                                  Oe((s) => s instanceof ji || s instanceof Oc || s instanceof aC),
                                  L(
                                    (s) =>
                                      s instanceof ji || (s instanceof Oc && (0 === s.code || 1 === s.code) && null)
                                  ),
                                  Oe((s) => null !== s),
                                  De(1)
                                )
                                .subscribe(() => {
                                  r();
                                });
                            })(() => {
                              r(!0), (t = !0);
                            }),
                              (o.afterPreactivation = () => (r(!0), t || s.closed ? P(void 0) : s)),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]
            : [],
        ];
      }
      const QC = new k('', { factory: () => new pe() }),
        Rp = new k('', { providedIn: 'root', factory: () => 1 });
      function B2(e) {
        return [UC, { provide: zC, useExisting: UC }, { provide: GC, useExisting: e }];
      }
      class XC {}
      class YC {}
      class vi {
        constructor(n) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            n
              ? (this.lazyInit =
                  'string' == typeof n
                    ? () => {
                        (this.headers = new Map()),
                          n.split('\n').forEach((t) => {
                            const i = t.indexOf(':');
                            if (i > 0) {
                              const r = t.slice(0, i),
                                o = r.toLowerCase(),
                                s = t.slice(i + 1).trim();
                              this.maybeSetNormalizedName(r, o),
                                this.headers.has(o) ? this.headers.get(o).push(s) : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(n).forEach((t) => {
                            let i = n[t];
                            const r = t.toLowerCase();
                            'string' == typeof i && (i = [i]),
                              i.length > 0 && (this.headers.set(r, i), this.maybeSetNormalizedName(t, r));
                          });
                      })
              : (this.headers = new Map());
        }
        has(n) {
          return this.init(), this.headers.has(n.toLowerCase());
        }
        get(n) {
          this.init();
          const t = this.headers.get(n.toLowerCase());
          return t && t.length > 0 ? t[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(n) {
          return this.init(), this.headers.get(n.toLowerCase()) || null;
        }
        append(n, t) {
          return this.clone({ name: n, value: t, op: 'a' });
        }
        set(n, t) {
          return this.clone({ name: n, value: t, op: 's' });
        }
        delete(n, t) {
          return this.clone({ name: n, value: t, op: 'd' });
        }
        maybeSetNormalizedName(n, t) {
          this.normalizedNames.has(t) || this.normalizedNames.set(t, n);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof vi ? this.copyFrom(this.lazyInit) : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate && (this.lazyUpdate.forEach((n) => this.applyUpdate(n)), (this.lazyUpdate = null)));
        }
        copyFrom(n) {
          n.init(),
            Array.from(n.headers.keys()).forEach((t) => {
              this.headers.set(t, n.headers.get(t)), this.normalizedNames.set(t, n.normalizedNames.get(t));
            });
        }
        clone(n) {
          const t = new vi();
          return (
            (t.lazyInit = this.lazyInit && this.lazyInit instanceof vi ? this.lazyInit : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
            t
          );
        }
        applyUpdate(n) {
          const t = n.name.toLowerCase();
          switch (n.op) {
            case 'a':
            case 's':
              let i = n.value;
              if (('string' == typeof i && (i = [i]), 0 === i.length)) return;
              this.maybeSetNormalizedName(n.name, t);
              const r = ('a' === n.op ? this.headers.get(t) : void 0) || [];
              r.push(...i), this.headers.set(t, r);
              break;
            case 'd':
              const o = n.value;
              if (o) {
                let s = this.headers.get(t);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length ? (this.headers.delete(t), this.normalizedNames.delete(t)) : this.headers.set(t, s);
              } else this.headers.delete(t), this.normalizedNames.delete(t);
          }
        }
        forEach(n) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((t) => n(this.normalizedNames.get(t), this.headers.get(t)));
        }
      }
      class j2 {
        encodeKey(n) {
          return JC(n);
        }
        encodeValue(n) {
          return JC(n);
        }
        decodeKey(n) {
          return decodeURIComponent(n);
        }
        decodeValue(n) {
          return decodeURIComponent(n);
        }
      }
      const G2 = /%(\d[a-f0-9])/gi,
        U2 = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '3D': '=', '3F': '?', '2F': '/' };
      function JC(e) {
        return encodeURIComponent(e).replace(G2, (n, t) => U2[t] ?? n);
      }
      function Gc(e) {
        return `${e}`;
      }
      class Ui {
        constructor(n = {}) {
          if (((this.updates = null), (this.cloneFrom = null), (this.encoder = n.encoder || new j2()), n.fromString)) {
            if (n.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
            this.map = (function H2(e, n) {
              const t = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, '')
                    .split('&')
                    .forEach((r) => {
                      const o = r.indexOf('='),
                        [s, a] =
                          -1 == o ? [n.decodeKey(r), ''] : [n.decodeKey(r.slice(0, o)), n.decodeValue(r.slice(o + 1))],
                        l = t.get(s) || [];
                      l.push(a), t.set(s, l);
                    }),
                t
              );
            })(n.fromString, this.encoder);
          } else
            n.fromObject
              ? ((this.map = new Map()),
                Object.keys(n.fromObject).forEach((t) => {
                  const i = n.fromObject[t],
                    r = Array.isArray(i) ? i.map(Gc) : [Gc(i)];
                  this.map.set(t, r);
                }))
              : (this.map = null);
        }
        has(n) {
          return this.init(), this.map.has(n);
        }
        get(n) {
          this.init();
          const t = this.map.get(n);
          return t ? t[0] : null;
        }
        getAll(n) {
          return this.init(), this.map.get(n) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(n, t) {
          return this.clone({ param: n, value: t, op: 'a' });
        }
        appendAll(n) {
          const t = [];
          return (
            Object.keys(n).forEach((i) => {
              const r = n[i];
              Array.isArray(r)
                ? r.forEach((o) => {
                    t.push({ param: i, value: o, op: 'a' });
                  })
                : t.push({ param: i, value: r, op: 'a' });
            }),
            this.clone(t)
          );
        }
        set(n, t) {
          return this.clone({ param: n, value: t, op: 's' });
        }
        delete(n, t) {
          return this.clone({ param: n, value: t, op: 'd' });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((n) => {
                const t = this.encoder.encodeKey(n);
                return this.map
                  .get(n)
                  .map((i) => t + '=' + this.encoder.encodeValue(i))
                  .join('&');
              })
              .filter((n) => '' !== n)
              .join('&')
          );
        }
        clone(n) {
          const t = new Ui({ encoder: this.encoder });
          return (t.cloneFrom = this.cloneFrom || this), (t.updates = (this.updates || []).concat(n)), t;
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom.keys().forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
              this.updates.forEach((n) => {
                switch (n.op) {
                  case 'a':
                  case 's':
                    const t = ('a' === n.op ? this.map.get(n.param) : void 0) || [];
                    t.push(Gc(n.value)), this.map.set(n.param, t);
                    break;
                  case 'd':
                    if (void 0 === n.value) {
                      this.map.delete(n.param);
                      break;
                    }
                    {
                      let i = this.map.get(n.param) || [];
                      const r = i.indexOf(Gc(n.value));
                      -1 !== r && i.splice(r, 1), i.length > 0 ? this.map.set(n.param, i) : this.map.delete(n.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class $2 {
        constructor() {
          this.map = new Map();
        }
        set(n, t) {
          return this.map.set(n, t), this;
        }
        get(n) {
          return this.map.has(n) || this.map.set(n, n.defaultValue()), this.map.get(n);
        }
        delete(n) {
          return this.map.delete(n), this;
        }
        has(n) {
          return this.map.has(n);
        }
        keys() {
          return this.map.keys();
        }
      }
      function ZC(e) {
        return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer;
      }
      function ew(e) {
        return typeof Blob < 'u' && e instanceof Blob;
      }
      function tw(e) {
        return typeof FormData < 'u' && e instanceof FormData;
      }
      class la {
        constructor(n, t, i, r) {
          let o;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = 'json'),
            (this.method = n.toUpperCase()),
            (function W2(e) {
              switch (e) {
                case 'DELETE':
                case 'GET':
                case 'HEAD':
                case 'OPTIONS':
                case 'JSONP':
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || r
              ? ((this.body = void 0 !== i ? i : null), (o = r))
              : (o = i),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new vi()),
            this.context || (this.context = new $2()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = t;
            else {
              const a = t.indexOf('?');
              this.urlWithParams = t + (-1 === a ? '?' : a < t.length - 1 ? '&' : '') + s;
            }
          } else (this.params = new Ui()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : ZC(this.body) ||
              ew(this.body) ||
              tw(this.body) ||
              (function z2(e) {
                return typeof URLSearchParams < 'u' && e instanceof URLSearchParams;
              })(this.body) ||
              'string' == typeof this.body
            ? this.body
            : this.body instanceof Ui
            ? this.body.toString()
            : 'object' == typeof this.body || 'boolean' == typeof this.body || Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || tw(this.body)
            ? null
            : ew(this.body)
            ? this.body.type || null
            : ZC(this.body)
            ? null
            : 'string' == typeof this.body
            ? 'text/plain'
            : this.body instanceof Ui
            ? 'application/x-www-form-urlencoded;charset=UTF-8'
            : 'object' == typeof this.body || 'number' == typeof this.body || 'boolean' == typeof this.body
            ? 'application/json'
            : null;
        }
        clone(n = {}) {
          const t = n.method || this.method,
            i = n.url || this.url,
            r = n.responseType || this.responseType,
            o = void 0 !== n.body ? n.body : this.body,
            s = void 0 !== n.withCredentials ? n.withCredentials : this.withCredentials,
            a = void 0 !== n.reportProgress ? n.reportProgress : this.reportProgress;
          let l = n.headers || this.headers,
            c = n.params || this.params;
          const u = n.context ?? this.context;
          return (
            void 0 !== n.setHeaders && (l = Object.keys(n.setHeaders).reduce((d, f) => d.set(f, n.setHeaders[f]), l)),
            n.setParams && (c = Object.keys(n.setParams).reduce((d, f) => d.set(f, n.setParams[f]), c)),
            new la(t, i, o, {
              params: c,
              headers: l,
              context: u,
              reportProgress: a,
              responseType: r,
              withCredentials: s,
            })
          );
        }
      }
      var et = (() => (
        ((et = et || {})[(et.Sent = 0)] = 'Sent'),
        (et[(et.UploadProgress = 1)] = 'UploadProgress'),
        (et[(et.ResponseHeader = 2)] = 'ResponseHeader'),
        (et[(et.DownloadProgress = 3)] = 'DownloadProgress'),
        (et[(et.Response = 4)] = 'Response'),
        (et[(et.User = 5)] = 'User'),
        et
      ))();
      class Pp {
        constructor(n, t = 200, i = 'OK') {
          (this.headers = n.headers || new vi()),
            (this.status = void 0 !== n.status ? n.status : t),
            (this.statusText = n.statusText || i),
            (this.url = n.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class xp extends Pp {
        constructor(n = {}) {
          super(n), (this.type = et.ResponseHeader);
        }
        clone(n = {}) {
          return new xp({
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class Uc extends Pp {
        constructor(n = {}) {
          super(n), (this.type = et.Response), (this.body = void 0 !== n.body ? n.body : null);
        }
        clone(n = {}) {
          return new Uc({
            body: void 0 !== n.body ? n.body : this.body,
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class nw extends Pp {
        constructor(n) {
          super(n, 0, 'Unknown Error'),
            (this.name = 'HttpErrorResponse'),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${n.url || '(unknown url)'}`
                : `Http failure response for ${n.url || '(unknown url)'}: ${n.status} ${n.statusText}`),
            (this.error = n.error || null);
        }
      }
      function Fp(e, n) {
        return {
          body: n,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let kp = (() => {
        class e {
          constructor(t) {
            this.handler = t;
          }
          request(t, i, r = {}) {
            let o;
            if (t instanceof la) o = t;
            else {
              let l, c;
              (l = r.headers instanceof vi ? r.headers : new vi(r.headers)),
                r.params && (c = r.params instanceof Ui ? r.params : new Ui({ fromObject: r.params })),
                (o = new la(t, i, void 0 !== r.body ? r.body : null, {
                  headers: l,
                  context: r.context,
                  params: c,
                  reportProgress: r.reportProgress,
                  responseType: r.responseType || 'json',
                  withCredentials: r.withCredentials,
                }));
            }
            const s = P(o).pipe(pi((l) => this.handler.handle(l)));
            if (t instanceof la || 'events' === r.observe) return s;
            const a = s.pipe(Oe((l) => l instanceof Uc));
            switch (r.observe || 'body') {
              case 'body':
                switch (o.responseType) {
                  case 'arraybuffer':
                    return a.pipe(
                      L((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error('Response is not an ArrayBuffer.');
                        return l.body;
                      })
                    );
                  case 'blob':
                    return a.pipe(
                      L((l) => {
                        if (null !== l.body && !(l.body instanceof Blob)) throw new Error('Response is not a Blob.');
                        return l.body;
                      })
                    );
                  case 'text':
                    return a.pipe(
                      L((l) => {
                        if (null !== l.body && 'string' != typeof l.body) throw new Error('Response is not a string.');
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(L((l) => l.body));
                }
              case 'response':
                return a;
              default:
                throw new Error(`Unreachable: unhandled observe type ${r.observe}}`);
            }
          }
          delete(t, i = {}) {
            return this.request('DELETE', t, i);
          }
          get(t, i = {}) {
            return this.request('GET', t, i);
          }
          head(t, i = {}) {
            return this.request('HEAD', t, i);
          }
          jsonp(t, i) {
            return this.request('JSONP', t, {
              params: new Ui().append(i, 'JSONP_CALLBACK'),
              observe: 'body',
              responseType: 'json',
            });
          }
          options(t, i = {}) {
            return this.request('OPTIONS', t, i);
          }
          patch(t, i, r = {}) {
            return this.request('PATCH', t, Fp(r, i));
          }
          post(t, i, r = {}) {
            return this.request('POST', t, Fp(r, i));
          }
          put(t, i, r = {}) {
            return this.request('PUT', t, Fp(r, i));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(XC));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class iw {
        constructor(n, t) {
          (this.next = n), (this.interceptor = t);
        }
        handle(n) {
          return this.interceptor.intercept(n, this.next);
        }
      }
      const $c = new k('HTTP_INTERCEPTORS');
      let K2 = (() => {
        class e {
          intercept(t, i) {
            return i.handle(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const q2 = /^\)\]\}',?\n/;
      let rw = (() => {
        class e {
          constructor(t) {
            this.xhrFactory = t;
          }
          handle(t) {
            if ('JSONP' === t.method)
              throw new Error('Attempted to construct Jsonp request without HttpClientJsonpModule installed.');
            return new he((i) => {
              const r = this.xhrFactory.build();
              if (
                (r.open(t.method, t.urlWithParams),
                t.withCredentials && (r.withCredentials = !0),
                t.headers.forEach((h, p) => r.setRequestHeader(h, p.join(','))),
                t.headers.has('Accept') || r.setRequestHeader('Accept', 'application/json, text/plain, */*'),
                !t.headers.has('Content-Type'))
              ) {
                const h = t.detectContentTypeHeader();
                null !== h && r.setRequestHeader('Content-Type', h);
              }
              if (t.responseType) {
                const h = t.responseType.toLowerCase();
                r.responseType = 'json' !== h ? h : 'text';
              }
              const o = t.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = r.statusText || 'OK',
                    p = new vi(r.getAllResponseHeaders()),
                    g =
                      (function Q2(e) {
                        return 'responseURL' in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader('X-Request-URL')
                          : null;
                      })(r) || t.url;
                  return (s = new xp({ headers: p, status: r.status, statusText: h, url: g })), s;
                },
                l = () => {
                  let { headers: h, status: p, statusText: g, url: m } = a(),
                    y = null;
                  204 !== p && (y = typeof r.response > 'u' ? r.responseText : r.response),
                    0 === p && (p = y ? 200 : 0);
                  let D = p >= 200 && p < 300;
                  if ('json' === t.responseType && 'string' == typeof y) {
                    const b = y;
                    y = y.replace(q2, '');
                    try {
                      y = '' !== y ? JSON.parse(y) : null;
                    } catch (w) {
                      (y = b), D && ((D = !1), (y = { error: w, text: y }));
                    }
                  }
                  D
                    ? (i.next(new Uc({ body: y, headers: h, status: p, statusText: g, url: m || void 0 })),
                      i.complete())
                    : i.error(new nw({ error: y, headers: h, status: p, statusText: g, url: m || void 0 }));
                },
                c = (h) => {
                  const { url: p } = a(),
                    g = new nw({
                      error: h,
                      status: r.status || 0,
                      statusText: r.statusText || 'Unknown Error',
                      url: p || void 0,
                    });
                  i.error(g);
                };
              let u = !1;
              const d = (h) => {
                  u || (i.next(a()), (u = !0));
                  let p = { type: et.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    'text' === t.responseType && !!r.responseText && (p.partialText = r.responseText),
                    i.next(p);
                },
                f = (h) => {
                  let p = { type: et.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), i.next(p);
                };
              return (
                r.addEventListener('load', l),
                r.addEventListener('error', c),
                r.addEventListener('timeout', c),
                r.addEventListener('abort', c),
                t.reportProgress &&
                  (r.addEventListener('progress', d),
                  null !== o && r.upload && r.upload.addEventListener('progress', f)),
                r.send(o),
                i.next({ type: et.Sent }),
                () => {
                  r.removeEventListener('error', c),
                    r.removeEventListener('abort', c),
                    r.removeEventListener('load', l),
                    r.removeEventListener('timeout', c),
                    t.reportProgress &&
                      (r.removeEventListener('progress', d),
                      null !== o && r.upload && r.upload.removeEventListener('progress', f)),
                    r.readyState !== r.DONE && r.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(sD));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Lp = new k('XSRF_COOKIE_NAME'),
        Vp = new k('XSRF_HEADER_NAME');
      class ow {}
      let X2 = (() => {
          class e {
            constructor(t, i, r) {
              (this.doc = t),
                (this.platform = i),
                (this.cookieName = r),
                (this.lastCookieString = ''),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ('server' === this.platform) return null;
              const t = this.doc.cookie || '';
              return (
                t !== this.lastCookieString &&
                  (this.parseCount++, (this.lastToken = Xb(t, this.cookieName)), (this.lastCookieString = t)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(Xe), N(To), N(Lp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Bp = (() => {
          class e {
            constructor(t, i) {
              (this.tokenService = t), (this.headerName = i);
            }
            intercept(t, i) {
              const r = t.url.toLowerCase();
              if ('GET' === t.method || 'HEAD' === t.method || r.startsWith('http://') || r.startsWith('https://'))
                return i.handle(t);
              const o = this.tokenService.getToken();
              return (
                null !== o &&
                  !t.headers.has(this.headerName) &&
                  (t = t.clone({ headers: t.headers.set(this.headerName, o) })),
                i.handle(t)
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(ow), N(Vp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Y2 = (() => {
          class e {
            constructor(t, i) {
              (this.backend = t), (this.injector = i), (this.chain = null);
            }
            handle(t) {
              if (null === this.chain) {
                const i = this.injector.get($c, []);
                this.chain = i.reduceRight((r, o) => new iw(r, o), this.backend);
              }
              return this.chain.handle(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(YC), N(pt));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        J2 = (() => {
          class e {
            static disable() {
              return { ngModule: e, providers: [{ provide: Bp, useClass: K2 }] };
            }
            static withOptions(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.cookieName ? { provide: Lp, useValue: t.cookieName } : [],
                  t.headerName ? { provide: Vp, useValue: t.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({
              providers: [
                Bp,
                { provide: $c, useExisting: Bp, multi: !0 },
                { provide: ow, useClass: X2 },
                { provide: Lp, useValue: 'XSRF-TOKEN' },
                { provide: Vp, useValue: 'X-XSRF-TOKEN' },
              ],
            })),
            e
          );
        })(),
        Z2 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({
              providers: [kp, { provide: XC, useClass: Y2 }, rw, { provide: YC, useExisting: rw }],
              imports: [J2.withOptions({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })],
            })),
            e
          );
        })();
      const eB = ['addListener', 'removeListener'],
        tB = ['addEventListener', 'removeEventListener'],
        nB = ['on', 'off'];
      function mt(e, n, t, i) {
        if ((te(t) && ((i = t), (t = void 0)), i)) return mt(e, n, t).pipe(kh(i));
        const [r, o] = (function oB(e) {
          return te(e.addEventListener) && te(e.removeEventListener);
        })(e)
          ? tB.map((s) => (a) => e[s](n, a, t))
          : (function iB(e) {
              return te(e.addListener) && te(e.removeListener);
            })(e)
          ? eB.map(sw(e, n))
          : (function rB(e) {
              return te(e.on) && te(e.off);
            })(e)
          ? nB.map(sw(e, n))
          : [];
        if (!r && Du(e)) return Ge((s) => mt(s, n, t))(ut(e));
        if (!r) throw new TypeError('Invalid event target');
        return new he((s) => {
          const a = (...l) => s.next(1 < l.length ? l : l[0]);
          return r(a), () => o(a);
        });
      }
      function sw(e, n) {
        return (t) => (i) => e[t](n, i);
      }
      const yi = new he(Pr),
        aB = { connector: () => new pe() };
      function aw(e, n = aB) {
        const { connector: t } = n;
        return Ae((i, r) => {
          const o = t();
          ut(
            e(
              (function sB(e) {
                return new he((n) => e.subscribe(n));
              })(o)
            )
          ).subscribe(r),
            r.add(i.subscribe(o));
        });
      }
      class uB extends Lt {
        constructor(n, t) {
          super();
        }
        schedule(n, t = 0) {
          return this;
        }
      }
      const Wc = {
          setInterval(e, n, ...t) {
            const { delegate: i } = Wc;
            return i?.setInterval ? i.setInterval(e, n, ...t) : setInterval(e, n, ...t);
          },
          clearInterval(e) {
            const { delegate: n } = Wc;
            return (n?.clearInterval || clearInterval)(e);
          },
          delegate: void 0,
        },
        jp = { now: () => (jp.delegate || Date).now(), delegate: void 0 };
      class ca {
        constructor(n, t = ca.now) {
          (this.schedulerActionCtor = n), (this.now = t);
        }
        schedule(n, t = 0, i) {
          return new this.schedulerActionCtor(this, n).schedule(i, t);
        }
      }
      ca.now = jp.now;
      const lw = new (class fB extends ca {
          constructor(n, t = ca.now) {
            super(n, t), (this.actions = []), (this._active = !1);
          }
          flush(n) {
            const { actions: t } = this;
            if (this._active) return void t.push(n);
            let i;
            this._active = !0;
            do {
              if ((i = n.execute(n.state, n.delay))) break;
            } while ((n = t.shift()));
            if (((this._active = !1), i)) {
              for (; (n = t.shift()); ) n.unsubscribe();
              throw i;
            }
          }
        })(
          class dB extends uB {
            constructor(n, t) {
              super(n, t), (this.scheduler = n), (this.work = t), (this.pending = !1);
            }
            schedule(n, t = 0) {
              var i;
              if (this.closed) return this;
              this.state = n;
              const r = this.id,
                o = this.scheduler;
              return (
                null != r && (this.id = this.recycleAsyncId(o, r, t)),
                (this.pending = !0),
                (this.delay = t),
                (this.id = null !== (i = this.id) && void 0 !== i ? i : this.requestAsyncId(o, this.id, t)),
                this
              );
            }
            requestAsyncId(n, t, i = 0) {
              return Wc.setInterval(n.flush.bind(n, this), i);
            }
            recycleAsyncId(n, t, i = 0) {
              if (null != i && this.delay === i && !1 === this.pending) return t;
              null != t && Wc.clearInterval(t);
            }
            execute(n, t) {
              if (this.closed) return new Error('executing a cancelled action');
              this.pending = !1;
              const i = this._execute(n, t);
              if (i) return i;
              !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
            }
            _execute(n, t) {
              let r,
                i = !1;
              try {
                this.work(n);
              } catch (o) {
                (i = !0), (r = o || new Error('Scheduled action threw falsy error'));
              }
              if (i) return this.unsubscribe(), r;
            }
            unsubscribe() {
              if (!this.closed) {
                const { id: n, scheduler: t } = this,
                  { actions: i } = t;
                (this.work = this.state = this.scheduler = null),
                  (this.pending = !1),
                  Rr(i, this),
                  null != n && (this.id = this.recycleAsyncId(t, n, null)),
                  (this.delay = null),
                  super.unsubscribe();
              }
            }
          }
        ),
        hB = lw;
      function cw(e, n) {
        return n
          ? (t) =>
              Vi(
                n.pipe(
                  De(1),
                  (function pB() {
                    return Ae((e, n) => {
                      e.subscribe(Ce(n, Pr));
                    });
                  })()
                ),
                t.pipe(cw(e))
              )
          : Ge((t, i) => e(t, i).pipe(De(1), G1(t)));
      }
      function Hp(e = 0, n, t = hB) {
        let i = -1;
        return (
          null != n && ($g(n) ? (t = n) : (i = n)),
          new he((r) => {
            let o = (function gB(e) {
              return e instanceof Date && !isNaN(e);
            })(e)
              ? +e - t.now()
              : e;
            o < 0 && (o = 0);
            let s = 0;
            return t.schedule(function () {
              r.closed || (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete());
            }, o);
          })
        );
      }
      function uw(e, n = lw) {
        const t = Hp(e, n);
        return cw(() => t);
      }
      const ua = 'Service workers are disabled or not supported by this browser';
      class zc {
        constructor(n) {
          if (((this.serviceWorker = n), n)) {
            const i = mt(n, 'controllerchange').pipe(L(() => n.controller)),
              o = Vi(
                Mo(() => P(n.controller)),
                i
              );
            (this.worker = o.pipe(Oe((u) => !!u))),
              (this.registration = this.worker.pipe(st(() => n.getRegistration())));
            const c = mt(n, 'message')
              .pipe(L((u) => u.data))
              .pipe(Oe((u) => u && u.type))
              .pipe(
                (function cB(e) {
                  return e
                    ? (n) => aw(e)(n)
                    : (n) =>
                        (function lB(e, n) {
                          const t = te(e) ? e : () => e;
                          return te(n) ? aw(n, { connector: t }) : (i) => new ip(i, t);
                        })(new pe())(n);
                })()
              );
            c.connect(), (this.events = c);
          } else
            this.worker =
              this.events =
              this.registration =
                (function _B(e) {
                  return Mo(() => Oo(new Error(e)));
                })(ua);
        }
        postMessage(n, t) {
          return this.worker
            .pipe(
              De(1),
              at((i) => {
                i.postMessage({ action: n, ...t });
              })
            )
            .toPromise()
            .then(() => {});
        }
        postMessageWithOperation(n, t, i) {
          const r = this.waitForOperationCompleted(i),
            o = this.postMessage(n, t);
          return Promise.all([o, r]).then(([, s]) => s);
        }
        generateNonce() {
          return Math.round(1e7 * Math.random());
        }
        eventsOfType(n) {
          let t;
          return (t = 'string' == typeof n ? (i) => i.type === n : (i) => n.includes(i.type)), this.events.pipe(Oe(t));
        }
        nextEventOfType(n) {
          return this.eventsOfType(n).pipe(De(1));
        }
        waitForOperationCompleted(n) {
          return this.eventsOfType('OPERATION_COMPLETED')
            .pipe(
              Oe((t) => t.nonce === n),
              De(1),
              L((t) => {
                if (void 0 !== t.result) return t.result;
                throw new Error(t.error);
              })
            )
            .toPromise();
        }
        get isEnabled() {
          return !!this.serviceWorker;
        }
      }
      let mB = (() => {
          class e {
            constructor(t) {
              if (((this.sw = t), (this.subscriptionChanges = new pe()), !t.isEnabled))
                return (this.messages = yi), (this.notificationClicks = yi), void (this.subscription = yi);
              (this.messages = this.sw.eventsOfType('PUSH').pipe(L((r) => r.data))),
                (this.notificationClicks = this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(L((r) => r.data))),
                (this.pushManager = this.sw.registration.pipe(L((r) => r.pushManager)));
              const i = this.pushManager.pipe(st((r) => r.getSubscription()));
              this.subscription = Ra(i, this.subscriptionChanges);
            }
            get isEnabled() {
              return this.sw.isEnabled;
            }
            requestSubscription(t) {
              if (!this.sw.isEnabled) return Promise.reject(new Error(ua));
              const i = { userVisibleOnly: !0 };
              let r = this.decodeBase64(t.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+')),
                o = new Uint8Array(new ArrayBuffer(r.length));
              for (let s = 0; s < r.length; s++) o[s] = r.charCodeAt(s);
              return (
                (i.applicationServerKey = o),
                this.pushManager
                  .pipe(
                    st((s) => s.subscribe(i)),
                    De(1)
                  )
                  .toPromise()
                  .then((s) => (this.subscriptionChanges.next(s), s))
              );
            }
            unsubscribe() {
              return this.sw.isEnabled
                ? this.subscription
                    .pipe(
                      De(1),
                      st((i) => {
                        if (null === i) throw new Error('Not subscribed to push notifications.');
                        return i.unsubscribe().then((r) => {
                          if (!r) throw new Error('Unsubscribe failed!');
                          this.subscriptionChanges.next(null);
                        });
                      })
                    )
                    .toPromise()
                : Promise.reject(new Error(ua));
            }
            decodeBase64(t) {
              return atob(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(zc));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        vB = (() => {
          class e {
            constructor(t) {
              if (((this.sw = t), !t.isEnabled))
                return (
                  (this.versionUpdates = yi),
                  (this.available = yi),
                  (this.activated = yi),
                  void (this.unrecoverable = yi)
                );
              (this.versionUpdates = this.sw.eventsOfType([
                'VERSION_DETECTED',
                'VERSION_INSTALLATION_FAILED',
                'VERSION_READY',
                'NO_NEW_VERSION_DETECTED',
              ])),
                (this.available = this.versionUpdates.pipe(
                  Oe((i) => 'VERSION_READY' === i.type),
                  L((i) => ({ type: 'UPDATE_AVAILABLE', current: i.currentVersion, available: i.latestVersion }))
                )),
                (this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED')),
                (this.unrecoverable = this.sw.eventsOfType('UNRECOVERABLE_STATE'));
            }
            get isEnabled() {
              return this.sw.isEnabled;
            }
            checkForUpdate() {
              if (!this.sw.isEnabled) return Promise.reject(new Error(ua));
              const t = this.sw.generateNonce();
              return this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', { nonce: t }, t);
            }
            activateUpdate() {
              if (!this.sw.isEnabled) return Promise.reject(new Error(ua));
              const t = this.sw.generateNonce();
              return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', { nonce: t }, t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(zc));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class Gp {}
      const dw = new k('NGSW_REGISTER_SCRIPT');
      function yB(e, n, t, i) {
        return () => {
          if (!Sh(i) || !('serviceWorker' in navigator) || !1 === t.enabled) return;
          let o;
          if (
            (navigator.serviceWorker.addEventListener('controllerchange', () => {
              null !== navigator.serviceWorker.controller &&
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }),
            'function' == typeof t.registrationStrategy)
          )
            o = t.registrationStrategy();
          else {
            const [a, ...l] = (t.registrationStrategy || 'registerWhenStable:30000').split(':');
            switch (a) {
              case 'registerImmediately':
                o = P(null);
                break;
              case 'registerWithDelay':
                o = fw(+l[0] || 0);
                break;
              case 'registerWhenStable':
                o = l[0] ? Ra(hw(e), fw(+l[0])) : hw(e);
                break;
              default:
                throw new Error(`Unknown ServiceWorker registration strategy: ${t.registrationStrategy}`);
            }
          }
          e.get(me).runOutsideAngular(() =>
            o
              .pipe(De(1))
              .subscribe(() =>
                navigator.serviceWorker
                  .register(n, { scope: t.scope })
                  .catch((a) => console.error('Service worker registration failed with:', a))
              )
          );
        };
      }
      function fw(e) {
        return P(null).pipe(uw(e));
      }
      function hw(e) {
        return e.get(Eo).isStable.pipe(Oe((t) => t));
      }
      function bB(e, n) {
        return new zc(Sh(n) && !1 !== e.enabled ? navigator.serviceWorker : void 0);
      }
      let DB = (() => {
        class e {
          static register(t, i = {}) {
            return {
              ngModule: e,
              providers: [
                { provide: dw, useValue: t },
                { provide: Gp, useValue: i },
                { provide: zc, useFactory: bB, deps: [Gp, To] },
                { provide: Ls, useFactory: yB, deps: [pt, dw, Gp, To], multi: !0 },
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({ providers: [mB, vB] })),
          e
        );
      })();
      function $i(e) {
        return !!e && (e instanceof he || (te(e.lift) && te(e.subscribe)));
      }
      class CB extends pe {
        constructor(n = 1 / 0, t = 1 / 0, i = jp) {
          super(),
            (this._bufferSize = n),
            (this._windowTime = t),
            (this._timestampProvider = i),
            (this._buffer = []),
            (this._infiniteTimeWindow = !0),
            (this._infiniteTimeWindow = t === 1 / 0),
            (this._bufferSize = Math.max(1, n)),
            (this._windowTime = Math.max(1, t));
        }
        next(n) {
          const { isStopped: t, _buffer: i, _infiniteTimeWindow: r, _timestampProvider: o, _windowTime: s } = this;
          t || (i.push(n), !r && i.push(o.now() + s)), this._trimBuffer(), super.next(n);
        }
        _subscribe(n) {
          this._throwIfClosed(), this._trimBuffer();
          const t = this._innerSubscribe(n),
            { _infiniteTimeWindow: i, _buffer: r } = this,
            o = r.slice();
          for (let s = 0; s < o.length && !n.closed; s += i ? 1 : 2) n.next(o[s]);
          return this._checkFinalizedStatuses(n), t;
        }
        _trimBuffer() {
          const { _bufferSize: n, _timestampProvider: t, _buffer: i, _infiniteTimeWindow: r } = this,
            o = (r ? 1 : 2) * n;
          if ((n < 1 / 0 && o < i.length && i.splice(0, i.length - o), !r)) {
            const s = t.now();
            let a = 0;
            for (let l = 1; l < i.length && i[l] <= s; l += 2) a = l;
            a && i.splice(0, a + 1);
          }
        }
      }
      function pw(e, n, t) {
        let i,
          r = !1;
        return (
          e && 'object' == typeof e
            ? ({ bufferSize: i = 1 / 0, windowTime: n = 1 / 0, refCount: r = !1, scheduler: t } = e)
            : (i = e ?? 1 / 0),
          qg({ connector: () => new CB(i, n, t), resetOnError: !0, resetOnComplete: !1, resetOnRefCountZero: r })
        );
      }
      class Kc {}
      let gw = (() => {
        class e extends Kc {
          getTranslation(t) {
            return P({});
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (i) {
              return (n || (n = qe(e)))(i || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Up {}
      let _w = (() => {
        class e {
          handle(t) {
            return t.key;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function da(e, n) {
        if (e === n) return !0;
        if (null === e || null === n) return !1;
        if (e != e && n != n) return !0;
        let r,
          o,
          s,
          t = typeof e;
        if (t == typeof n && 'object' == t) {
          if (!Array.isArray(e)) {
            if (Array.isArray(n)) return !1;
            for (o in ((s = Object.create(null)), e)) {
              if (!da(e[o], n[o])) return !1;
              s[o] = !0;
            }
            for (o in n) if (!(o in s) && typeof n[o] < 'u') return !1;
            return !0;
          }
          if (!Array.isArray(n)) return !1;
          if ((r = e.length) == n.length) {
            for (o = 0; o < r; o++) if (!da(e[o], n[o])) return !1;
            return !0;
          }
        }
        return !1;
      }
      function Qt(e) {
        return typeof e < 'u' && null !== e;
      }
      function $p(e) {
        return e && 'object' == typeof e && !Array.isArray(e);
      }
      function mw(e, n) {
        let t = Object.assign({}, e);
        return (
          $p(e) &&
            $p(n) &&
            Object.keys(n).forEach((i) => {
              $p(n[i])
                ? i in e
                  ? (t[i] = mw(e[i], n[i]))
                  : Object.assign(t, { [i]: n[i] })
                : Object.assign(t, { [i]: n[i] });
            }),
          t
        );
      }
      class qc {}
      let vw = (() => {
        class e extends qc {
          constructor() {
            super(...arguments), (this.templateMatcher = /{{\s?([^{}\s]*)\s?}}/g);
          }
          interpolate(t, i) {
            let r;
            return (
              (r =
                'string' == typeof t
                  ? this.interpolateString(t, i)
                  : 'function' == typeof t
                  ? this.interpolateFunction(t, i)
                  : t),
              r
            );
          }
          getValue(t, i) {
            let r = 'string' == typeof i ? i.split('.') : [i];
            i = '';
            do {
              (i += r.shift()),
                !Qt(t) || !Qt(t[i]) || ('object' != typeof t[i] && r.length)
                  ? r.length
                    ? (i += '.')
                    : (t = void 0)
                  : ((t = t[i]), (i = ''));
            } while (r.length);
            return t;
          }
          interpolateFunction(t, i) {
            return t(i);
          }
          interpolateString(t, i) {
            return i
              ? t.replace(this.templateMatcher, (r, o) => {
                  let s = this.getValue(i, o);
                  return Qt(s) ? s : r;
                })
              : t;
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (i) {
              return (n || (n = qe(e)))(i || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Qc {}
      let yw = (() => {
        class e extends Qc {
          compile(t, i) {
            return t;
          }
          compileTranslations(t, i) {
            return t;
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (i) {
              return (n || (n = qe(e)))(i || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class bw {
        constructor() {
          (this.currentLang = this.defaultLang),
            (this.translations = {}),
            (this.langs = []),
            (this.onTranslationChange = new U()),
            (this.onLangChange = new U()),
            (this.onDefaultLangChange = new U());
        }
      }
      const Wp = new k('USE_STORE'),
        zp = new k('USE_DEFAULT_LANG'),
        Kp = new k('DEFAULT_LANGUAGE'),
        qp = new k('USE_EXTEND');
      let Fo = (() => {
          class e {
            constructor(t, i, r, o, s, a = !0, l = !1, c = !1, u) {
              (this.store = t),
                (this.currentLoader = i),
                (this.compiler = r),
                (this.parser = o),
                (this.missingTranslationHandler = s),
                (this.useDefaultLang = a),
                (this.isolate = l),
                (this.extend = c),
                (this.pending = !1),
                (this._onTranslationChange = new U()),
                (this._onLangChange = new U()),
                (this._onDefaultLangChange = new U()),
                (this._langs = []),
                (this._translations = {}),
                (this._translationRequests = {}),
                u && this.setDefaultLang(u);
            }
            get onTranslationChange() {
              return this.isolate ? this._onTranslationChange : this.store.onTranslationChange;
            }
            get onLangChange() {
              return this.isolate ? this._onLangChange : this.store.onLangChange;
            }
            get onDefaultLangChange() {
              return this.isolate ? this._onDefaultLangChange : this.store.onDefaultLangChange;
            }
            get defaultLang() {
              return this.isolate ? this._defaultLang : this.store.defaultLang;
            }
            set defaultLang(t) {
              this.isolate ? (this._defaultLang = t) : (this.store.defaultLang = t);
            }
            get currentLang() {
              return this.isolate ? this._currentLang : this.store.currentLang;
            }
            set currentLang(t) {
              this.isolate ? (this._currentLang = t) : (this.store.currentLang = t);
            }
            get langs() {
              return this.isolate ? this._langs : this.store.langs;
            }
            set langs(t) {
              this.isolate ? (this._langs = t) : (this.store.langs = t);
            }
            get translations() {
              return this.isolate ? this._translations : this.store.translations;
            }
            set translations(t) {
              this.isolate ? (this._translations = t) : (this.store.translations = t);
            }
            setDefaultLang(t) {
              if (t === this.defaultLang) return;
              let i = this.retrieveTranslations(t);
              typeof i < 'u'
                ? (null == this.defaultLang && (this.defaultLang = t),
                  i.pipe(De(1)).subscribe((r) => {
                    this.changeDefaultLang(t);
                  }))
                : this.changeDefaultLang(t);
            }
            getDefaultLang() {
              return this.defaultLang;
            }
            use(t) {
              if (t === this.currentLang) return P(this.translations[t]);
              let i = this.retrieveTranslations(t);
              return typeof i < 'u'
                ? (this.currentLang || (this.currentLang = t),
                  i.pipe(De(1)).subscribe((r) => {
                    this.changeLang(t);
                  }),
                  i)
                : (this.changeLang(t), P(this.translations[t]));
            }
            retrieveTranslations(t) {
              let i;
              return (
                (typeof this.translations[t] > 'u' || this.extend) &&
                  ((this._translationRequests[t] = this._translationRequests[t] || this.getTranslation(t)),
                  (i = this._translationRequests[t])),
                i
              );
            }
            getTranslation(t) {
              this.pending = !0;
              const i = this.currentLoader.getTranslation(t).pipe(pw(1), De(1));
              return (
                (this.loadingTranslations = i.pipe(
                  L((r) => this.compiler.compileTranslations(r, t)),
                  pw(1),
                  De(1)
                )),
                this.loadingTranslations.subscribe({
                  next: (r) => {
                    (this.translations[t] =
                      this.extend && this.translations[t] ? { ...r, ...this.translations[t] } : r),
                      this.updateLangs(),
                      (this.pending = !1);
                  },
                  error: (r) => {
                    this.pending = !1;
                  },
                }),
                i
              );
            }
            setTranslation(t, i, r = !1) {
              (i = this.compiler.compileTranslations(i, t)),
                (this.translations[t] = (r || this.extend) && this.translations[t] ? mw(this.translations[t], i) : i),
                this.updateLangs(),
                this.onTranslationChange.emit({ lang: t, translations: this.translations[t] });
            }
            getLangs() {
              return this.langs;
            }
            addLangs(t) {
              t.forEach((i) => {
                -1 === this.langs.indexOf(i) && this.langs.push(i);
              });
            }
            updateLangs() {
              this.addLangs(Object.keys(this.translations));
            }
            getParsedResult(t, i, r) {
              let o;
              if (i instanceof Array) {
                let s = {},
                  a = !1;
                for (let l of i) (s[l] = this.getParsedResult(t, l, r)), $i(s[l]) && (a = !0);
                return a
                  ? ED(i.map((c) => ($i(s[c]) ? s[c] : P(s[c])))).pipe(
                      L((c) => {
                        let u = {};
                        return (
                          c.forEach((d, f) => {
                            u[i[f]] = d;
                          }),
                          u
                        );
                      })
                    )
                  : s;
              }
              if (
                (t && (o = this.parser.interpolate(this.parser.getValue(t, i), r)),
                typeof o > 'u' &&
                  null != this.defaultLang &&
                  this.defaultLang !== this.currentLang &&
                  this.useDefaultLang &&
                  (o = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], i), r)),
                typeof o > 'u')
              ) {
                let s = { key: i, translateService: this };
                typeof r < 'u' && (s.interpolateParams = r), (o = this.missingTranslationHandler.handle(s));
              }
              return typeof o < 'u' ? o : i;
            }
            get(t, i) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              if (this.pending)
                return this.loadingTranslations.pipe(pi((r) => ($i((r = this.getParsedResult(r, t, i))) ? r : P(r))));
              {
                let r = this.getParsedResult(this.translations[this.currentLang], t, i);
                return $i(r) ? r : P(r);
              }
            }
            getStreamOnTranslationChange(t, i) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              return Vi(
                Mo(() => this.get(t, i)),
                this.onTranslationChange.pipe(
                  st((r) => {
                    const o = this.getParsedResult(r.translations, t, i);
                    return 'function' == typeof o.subscribe ? o : P(o);
                  })
                )
              );
            }
            stream(t, i) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              return Vi(
                Mo(() => this.get(t, i)),
                this.onLangChange.pipe(
                  st((r) => {
                    const o = this.getParsedResult(r.translations, t, i);
                    return $i(o) ? o : P(o);
                  })
                )
              );
            }
            instant(t, i) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              let r = this.getParsedResult(this.translations[this.currentLang], t, i);
              if ($i(r)) {
                if (t instanceof Array) {
                  let o = {};
                  return (
                    t.forEach((s, a) => {
                      o[t[a]] = t[a];
                    }),
                    o
                  );
                }
                return t;
              }
              return r;
            }
            set(t, i, r = this.currentLang) {
              (this.translations[r][t] = this.compiler.compile(i, r)),
                this.updateLangs(),
                this.onTranslationChange.emit({ lang: r, translations: this.translations[r] });
            }
            changeLang(t) {
              (this.currentLang = t),
                this.onLangChange.emit({ lang: t, translations: this.translations[t] }),
                null == this.defaultLang && this.changeDefaultLang(t);
            }
            changeDefaultLang(t) {
              (this.defaultLang = t), this.onDefaultLangChange.emit({ lang: t, translations: this.translations[t] });
            }
            reloadLang(t) {
              return this.resetLang(t), this.getTranslation(t);
            }
            resetLang(t) {
              (this._translationRequests[t] = void 0), (this.translations[t] = void 0);
            }
            getBrowserLang() {
              if (typeof window > 'u' || typeof window.navigator > 'u') return;
              let t = window.navigator.languages ? window.navigator.languages[0] : null;
              return (
                (t =
                  t || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage),
                typeof t > 'u'
                  ? void 0
                  : (-1 !== t.indexOf('-') && (t = t.split('-')[0]), -1 !== t.indexOf('_') && (t = t.split('_')[0]), t)
              );
            }
            getBrowserCultureLang() {
              if (typeof window > 'u' || typeof window.navigator > 'u') return;
              let t = window.navigator.languages ? window.navigator.languages[0] : null;
              return (
                (t =
                  t || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage),
                t
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(bw), N(Kc), N(Qc), N(qc), N(Up), N(zp), N(Wp), N(qp), N(Kp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Dw = (() => {
          class e {
            constructor(t, i, r) {
              (this.translateService = t),
                (this.element = i),
                (this._ref = r),
                this.onTranslationChangeSub ||
                  (this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe((o) => {
                    o.lang === this.translateService.currentLang && this.checkNodes(!0, o.translations);
                  })),
                this.onLangChangeSub ||
                  (this.onLangChangeSub = this.translateService.onLangChange.subscribe((o) => {
                    this.checkNodes(!0, o.translations);
                  })),
                this.onDefaultLangChangeSub ||
                  (this.onDefaultLangChangeSub = this.translateService.onDefaultLangChange.subscribe((o) => {
                    this.checkNodes(!0);
                  }));
            }
            set translate(t) {
              t && ((this.key = t), this.checkNodes());
            }
            set translateParams(t) {
              da(this.currentParams, t) || ((this.currentParams = t), this.checkNodes(!0));
            }
            ngAfterViewChecked() {
              this.checkNodes();
            }
            checkNodes(t = !1, i) {
              let r = this.element.nativeElement.childNodes;
              r.length ||
                (this.setContent(this.element.nativeElement, this.key), (r = this.element.nativeElement.childNodes));
              for (let o = 0; o < r.length; ++o) {
                let s = r[o];
                if (3 === s.nodeType) {
                  let a;
                  if ((t && (s.lastKey = null), Qt(s.lookupKey))) a = s.lookupKey;
                  else if (this.key) a = this.key;
                  else {
                    let l = this.getContent(s),
                      c = l.trim();
                    c.length &&
                      ((s.lookupKey = c),
                      l !== s.currentValue
                        ? ((a = c), (s.originalContent = l || s.originalContent))
                        : s.originalContent
                        ? (a = s.originalContent.trim())
                        : l !== s.currentValue && ((a = c), (s.originalContent = l || s.originalContent)));
                  }
                  this.updateValue(a, s, i);
                }
              }
            }
            updateValue(t, i, r) {
              if (t) {
                if (i.lastKey === t && this.lastParams === this.currentParams) return;
                this.lastParams = this.currentParams;
                let o = (s) => {
                  s !== t && (i.lastKey = t),
                    i.originalContent || (i.originalContent = this.getContent(i)),
                    (i.currentValue = Qt(s) ? s : i.originalContent || t),
                    this.setContent(i, this.key ? i.currentValue : i.originalContent.replace(t, i.currentValue)),
                    this._ref.markForCheck();
                };
                if (Qt(r)) {
                  let s = this.translateService.getParsedResult(r, t, this.currentParams);
                  $i(s) ? s.subscribe({ next: o }) : o(s);
                } else this.translateService.get(t, this.currentParams).subscribe(o);
              }
            }
            getContent(t) {
              return Qt(t.textContent) ? t.textContent : t.data;
            }
            setContent(t, i) {
              Qt(t.textContent) ? (t.textContent = i) : (t.data = i);
            }
            ngOnDestroy() {
              this.onLangChangeSub && this.onLangChangeSub.unsubscribe(),
                this.onDefaultLangChangeSub && this.onDefaultLangChangeSub.unsubscribe(),
                this.onTranslationChangeSub && this.onTranslationChangeSub.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Fo), _(Ne), _(En));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [
                ['', 'translate', ''],
                ['', 'ngx-translate', ''],
              ],
              inputs: { translate: 'translate', translateParams: 'translateParams' },
            })),
            e
          );
        })(),
        Cw = (() => {
          class e {
            constructor(t, i) {
              (this.translate = t), (this._ref = i), (this.value = ''), (this.lastKey = null), (this.lastParams = []);
            }
            updateValue(t, i, r) {
              let o = (s) => {
                (this.value = void 0 !== s ? s : t), (this.lastKey = t), this._ref.markForCheck();
              };
              if (r) {
                let s = this.translate.getParsedResult(r, t, i);
                $i(s.subscribe) ? s.subscribe(o) : o(s);
              }
              this.translate.get(t, i).subscribe(o);
            }
            transform(t, ...i) {
              if (!t || !t.length) return t;
              if (da(t, this.lastKey) && da(i, this.lastParams)) return this.value;
              let r;
              if (Qt(i[0]) && i.length)
                if ('string' == typeof i[0] && i[0].length) {
                  let o = i[0]
                    .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
                    .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
                  try {
                    r = JSON.parse(o);
                  } catch {
                    throw new SyntaxError(
                      `Wrong parameter in TranslatePipe. Expected a valid Object, received: ${i[0]}`
                    );
                  }
                } else 'object' == typeof i[0] && !Array.isArray(i[0]) && (r = i[0]);
              return (
                (this.lastKey = t),
                (this.lastParams = i),
                this.updateValue(t, r),
                this._dispose(),
                this.onTranslationChange ||
                  (this.onTranslationChange = this.translate.onTranslationChange.subscribe((o) => {
                    this.lastKey &&
                      o.lang === this.translate.currentLang &&
                      ((this.lastKey = null), this.updateValue(t, r, o.translations));
                  })),
                this.onLangChange ||
                  (this.onLangChange = this.translate.onLangChange.subscribe((o) => {
                    this.lastKey && ((this.lastKey = null), this.updateValue(t, r, o.translations));
                  })),
                this.onDefaultLangChange ||
                  (this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
                    this.lastKey && ((this.lastKey = null), this.updateValue(t, r));
                  })),
                this.value
              );
            }
            _dispose() {
              typeof this.onTranslationChange < 'u' &&
                (this.onTranslationChange.unsubscribe(), (this.onTranslationChange = void 0)),
                typeof this.onLangChange < 'u' && (this.onLangChange.unsubscribe(), (this.onLangChange = void 0)),
                typeof this.onDefaultLangChange < 'u' &&
                  (this.onDefaultLangChange.unsubscribe(), (this.onDefaultLangChange = void 0));
            }
            ngOnDestroy() {
              this._dispose();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Fo, 16), _(En, 16));
            }),
            (e.ɵpipe = Et({ name: 'translate', type: e, pure: !1 })),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        yr = (() => {
          class e {
            static forRoot(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.loader || { provide: Kc, useClass: gw },
                  t.compiler || { provide: Qc, useClass: yw },
                  t.parser || { provide: qc, useClass: vw },
                  t.missingTranslationHandler || { provide: Up, useClass: _w },
                  bw,
                  { provide: Wp, useValue: t.isolate },
                  { provide: zp, useValue: t.useDefaultLang },
                  { provide: qp, useValue: t.extend },
                  { provide: Kp, useValue: t.defaultLanguage },
                  Fo,
                ],
              };
            }
            static forChild(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.loader || { provide: Kc, useClass: gw },
                  t.compiler || { provide: Qc, useClass: yw },
                  t.parser || { provide: qc, useClass: vw },
                  t.missingTranslationHandler || { provide: Up, useClass: _w },
                  { provide: Wp, useValue: t.isolate },
                  { provide: zp, useValue: t.useDefaultLang },
                  { provide: qp, useValue: t.extend },
                  { provide: Kp, useValue: t.defaultLanguage },
                  Fo,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      const { isArray: wB } = Array;
      function ww(e) {
        return 1 === e.length && wB(e[0]) ? e[0] : e;
      }
      function Nw(...e) {
        return 1 === (e = ww(e)).length
          ? ut(e[0])
          : new he(
              (function NB(e) {
                return (n) => {
                  let t = [];
                  for (let i = 0; t && !n.closed && i < e.length; i++)
                    t.push(
                      ut(e[i]).subscribe(
                        Ce(n, (r) => {
                          if (t) {
                            for (let o = 0; o < t.length; o++) o !== i && t[o].unsubscribe();
                            t = null;
                          }
                          n.next(r);
                        })
                      )
                    );
                };
              })(e)
            );
      }
      function Xc(...e) {
        const n = Aa(e),
          t = ww(e);
        return t.length
          ? new he((i) => {
              let r = t.map(() => []),
                o = t.map(() => !1);
              i.add(() => {
                r = o = null;
              });
              for (let s = 0; !i.closed && s < t.length; s++)
                ut(t[s]).subscribe(
                  Ce(
                    i,
                    (a) => {
                      if ((r[s].push(a), r.every((l) => l.length))) {
                        const l = r.map((c) => c.shift());
                        i.next(n ? n(...l) : l), r.some((c, u) => !c.length && o[u]) && i.complete();
                      }
                    },
                    () => {
                      (o[s] = !0), !r[s].length && i.complete();
                    }
                  )
                );
              return () => {
                r = o = null;
              };
            })
          : Jt;
      }
      function tt(e) {
        return Ae((n, t) => {
          ut(e).subscribe(Ce(t, () => t.complete(), Pr)), !t.closed && n.subscribe(t);
        });
      }
      function Xp(...e) {
        const n = Aa(e);
        return Ae((t, i) => {
          const r = e.length,
            o = new Array(r);
          let s = e.map(() => !1),
            a = !1;
          for (let l = 0; l < r; l++)
            ut(e[l]).subscribe(
              Ce(
                i,
                (c) => {
                  (o[l] = c), !a && !s[l] && ((s[l] = !0), (a = s.every(Zn)) && (s = null));
                },
                Pr
              )
            );
          t.subscribe(
            Ce(i, (l) => {
              if (a) {
                const c = [l, ...o];
                i.next(n ? n(...c) : c);
              }
            })
          );
        });
      }
      var MB = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
      function Yc(e) {
        return e.replace(/left|right|bottom|top/g, function (n) {
          return MB[n];
        });
      }
      function Xn(e) {
        return e.split('-')[0];
      }
      var OB = { start: 'end', end: 'start' };
      function Tw(e) {
        return e.replace(/start|end/g, function (n) {
          return OB[n];
        });
      }
      var Xt = 'top',
        On = 'bottom',
        In = 'right',
        Yt = 'left',
        Yp = 'auto',
        fa = [Xt, On, In, Yt],
        ko = 'start',
        ha = 'end',
        Ew = 'viewport',
        pa = 'popper',
        Sw = fa.reduce(function (e, n) {
          return e.concat([n + '-' + ko, n + '-' + ha]);
        }, []),
        Mw = [].concat(fa, [Yp]).reduce(function (e, n) {
          return e.concat([n, n + '-' + ko, n + '-' + ha]);
        }, []),
        HB = [
          'beforeRead',
          'read',
          'afterRead',
          'beforeMain',
          'main',
          'afterMain',
          'beforeWrite',
          'write',
          'afterWrite',
        ];
      function cn(e) {
        if (null == e) return window;
        if ('[object Window]' !== e.toString()) {
          var n = e.ownerDocument;
          return (n && n.defaultView) || window;
        }
        return e;
      }
      function br(e) {
        return e instanceof cn(e).Element || e instanceof Element;
      }
      function un(e) {
        return e instanceof cn(e).HTMLElement || e instanceof HTMLElement;
      }
      function Jp(e) {
        return !(typeof ShadowRoot > 'u') && (e instanceof cn(e).ShadowRoot || e instanceof ShadowRoot);
      }
      function Wi(e) {
        return ((br(e) ? e.ownerDocument : e.document) || window.document).documentElement;
      }
      var Dr = Math.max,
        Jc = Math.min,
        Lo = Math.round;
      function Zp() {
        var e = navigator.userAgentData;
        return null != e && e.brands
          ? e.brands
              .map(function (n) {
                return n.brand + '/' + n.version;
              })
              .join(' ')
          : navigator.userAgent;
      }
      function Ow() {
        return !/^((?!chrome|android).)*safari/i.test(Zp());
      }
      function Vo(e, n, t) {
        void 0 === n && (n = !1), void 0 === t && (t = !1);
        var i = e.getBoundingClientRect(),
          r = 1,
          o = 1;
        n &&
          un(e) &&
          ((r = (e.offsetWidth > 0 && Lo(i.width) / e.offsetWidth) || 1),
          (o = (e.offsetHeight > 0 && Lo(i.height) / e.offsetHeight) || 1));
        var a = (br(e) ? cn(e) : window).visualViewport,
          l = !Ow() && t,
          c = (i.left + (l && a ? a.offsetLeft : 0)) / r,
          u = (i.top + (l && a ? a.offsetTop : 0)) / o,
          d = i.width / r,
          f = i.height / o;
        return { width: d, height: f, top: u, right: c + d, bottom: u + f, left: c, x: c, y: u };
      }
      function eg(e) {
        var n = cn(e);
        return { scrollLeft: n.pageXOffset, scrollTop: n.pageYOffset };
      }
      function tg(e) {
        return Vo(Wi(e)).left + eg(e).scrollLeft;
      }
      function bi(e) {
        return cn(e).getComputedStyle(e);
      }
      function Yn(e) {
        return e ? (e.nodeName || '').toLowerCase() : null;
      }
      function Zc(e) {
        return 'html' === Yn(e) ? e : e.assignedSlot || e.parentNode || (Jp(e) ? e.host : null) || Wi(e);
      }
      function ng(e) {
        var n = bi(e);
        return /auto|scroll|overlay|hidden/.test(n.overflow + n.overflowY + n.overflowX);
      }
      function Iw(e) {
        return ['html', 'body', '#document'].indexOf(Yn(e)) >= 0
          ? e.ownerDocument.body
          : un(e) && ng(e)
          ? e
          : Iw(Zc(e));
      }
      function ga(e, n) {
        var t;
        void 0 === n && (n = []);
        var i = Iw(e),
          r = i === (null == (t = e.ownerDocument) ? void 0 : t.body),
          o = cn(i),
          s = r ? [o].concat(o.visualViewport || [], ng(i) ? i : []) : i,
          a = n.concat(s);
        return r ? a : a.concat(ga(Zc(s)));
      }
      function $B(e) {
        return ['table', 'td', 'th'].indexOf(Yn(e)) >= 0;
      }
      function Aw(e) {
        return un(e) && 'fixed' !== bi(e).position ? e.offsetParent : null;
      }
      function _a(e) {
        for (var n = cn(e), t = Aw(e); t && $B(t) && 'static' === bi(t).position; ) t = Aw(t);
        return t && ('html' === Yn(t) || ('body' === Yn(t) && 'static' === bi(t).position))
          ? n
          : t ||
              (function WB(e) {
                var n = /firefox/i.test(Zp());
                if (/Trident/i.test(Zp()) && un(e) && 'fixed' === bi(e).position) return null;
                var r = Zc(e);
                for (Jp(r) && (r = r.host); un(r) && ['html', 'body'].indexOf(Yn(r)) < 0; ) {
                  var o = bi(r);
                  if (
                    'none' !== o.transform ||
                    'none' !== o.perspective ||
                    'paint' === o.contain ||
                    -1 !== ['transform', 'perspective'].indexOf(o.willChange) ||
                    (n && 'filter' === o.willChange) ||
                    (n && o.filter && 'none' !== o.filter)
                  )
                    return r;
                  r = r.parentNode;
                }
                return null;
              })(e) ||
              n;
      }
      function Rw(e, n) {
        var t = n.getRootNode && n.getRootNode();
        if (e.contains(n)) return !0;
        if (t && Jp(t)) {
          var i = n;
          do {
            if (i && e.isSameNode(i)) return !0;
            i = i.parentNode || i.host;
          } while (i);
        }
        return !1;
      }
      function ig(e) {
        return Object.assign({}, e, { left: e.x, top: e.y, right: e.x + e.width, bottom: e.y + e.height });
      }
      function Pw(e, n, t) {
        return n === Ew
          ? ig(
              (function GB(e, n) {
                var t = cn(e),
                  i = Wi(e),
                  r = t.visualViewport,
                  o = i.clientWidth,
                  s = i.clientHeight,
                  a = 0,
                  l = 0;
                if (r) {
                  (o = r.width), (s = r.height);
                  var c = Ow();
                  (c || (!c && 'fixed' === n)) && ((a = r.offsetLeft), (l = r.offsetTop));
                }
                return { width: o, height: s, x: a + tg(e), y: l };
              })(e, t)
            )
          : br(n)
          ? (function zB(e, n) {
              var t = Vo(e, !1, 'fixed' === n);
              return (
                (t.top = t.top + e.clientTop),
                (t.left = t.left + e.clientLeft),
                (t.bottom = t.top + e.clientHeight),
                (t.right = t.left + e.clientWidth),
                (t.width = e.clientWidth),
                (t.height = e.clientHeight),
                (t.x = t.left),
                (t.y = t.top),
                t
              );
            })(n, t)
          : ig(
              (function UB(e) {
                var n,
                  t = Wi(e),
                  i = eg(e),
                  r = null == (n = e.ownerDocument) ? void 0 : n.body,
                  o = Dr(t.scrollWidth, t.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
                  s = Dr(t.scrollHeight, t.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0),
                  a = -i.scrollLeft + tg(e),
                  l = -i.scrollTop;
                return (
                  'rtl' === bi(r || t).direction && (a += Dr(t.clientWidth, r ? r.clientWidth : 0) - o),
                  { width: o, height: s, x: a, y: l }
                );
              })(Wi(e))
            );
      }
      function Bo(e) {
        return e.split('-')[1];
      }
      function rg(e) {
        return ['top', 'bottom'].indexOf(e) >= 0 ? 'x' : 'y';
      }
      function xw(e) {
        var l,
          n = e.reference,
          t = e.element,
          i = e.placement,
          r = i ? Xn(i) : null,
          o = i ? Bo(i) : null,
          s = n.x + n.width / 2 - t.width / 2,
          a = n.y + n.height / 2 - t.height / 2;
        switch (r) {
          case Xt:
            l = { x: s, y: n.y - t.height };
            break;
          case On:
            l = { x: s, y: n.y + n.height };
            break;
          case In:
            l = { x: n.x + n.width, y: a };
            break;
          case Yt:
            l = { x: n.x - t.width, y: a };
            break;
          default:
            l = { x: n.x, y: n.y };
        }
        var c = r ? rg(r) : null;
        if (null != c) {
          var u = 'y' === c ? 'height' : 'width';
          switch (o) {
            case ko:
              l[c] = l[c] - (n[u] / 2 - t[u] / 2);
              break;
            case ha:
              l[c] = l[c] + (n[u] / 2 - t[u] / 2);
          }
        }
        return l;
      }
      function kw(e) {
        return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, e);
      }
      function Lw(e, n) {
        return n.reduce(function (t, i) {
          return (t[i] = e), t;
        }, {});
      }
      function og(e, n) {
        void 0 === n && (n = {});
        var i = n.placement,
          r = void 0 === i ? e.placement : i,
          o = n.strategy,
          s = void 0 === o ? e.strategy : o,
          a = n.boundary,
          l = void 0 === a ? 'clippingParents' : a,
          c = n.rootBoundary,
          u = void 0 === c ? Ew : c,
          d = n.elementContext,
          f = void 0 === d ? pa : d,
          h = n.altBoundary,
          p = void 0 !== h && h,
          g = n.padding,
          m = void 0 === g ? 0 : g,
          y = kw('number' != typeof m ? m : Lw(m, fa)),
          b = e.rects.popper,
          w = e.elements[p ? (f === pa ? 'reference' : pa) : f],
          O = (function qB(e, n, t, i) {
            var r =
                'clippingParents' === n
                  ? (function KB(e) {
                      var n = ga(Zc(e)),
                        i = ['absolute', 'fixed'].indexOf(bi(e).position) >= 0 && un(e) ? _a(e) : e;
                      return br(i)
                        ? n.filter(function (r) {
                            return br(r) && Rw(r, i) && 'body' !== Yn(r);
                          })
                        : [];
                    })(e)
                  : [].concat(n),
              o = [].concat(r, [t]),
              a = o.reduce(function (l, c) {
                var u = Pw(e, c, i);
                return (
                  (l.top = Dr(u.top, l.top)),
                  (l.right = Jc(u.right, l.right)),
                  (l.bottom = Jc(u.bottom, l.bottom)),
                  (l.left = Dr(u.left, l.left)),
                  l
                );
              }, Pw(e, o[0], i));
            return (a.width = a.right - a.left), (a.height = a.bottom - a.top), (a.x = a.left), (a.y = a.top), a;
          })(br(w) ? w : w.contextElement || Wi(e.elements.popper), l, u, s),
          x = Vo(e.elements.reference),
          re = xw({ reference: x, element: b, strategy: 'absolute', placement: r }),
          se = ig(Object.assign({}, b, re)),
          Fe = f === pa ? se : x,
          ke = {
            top: O.top - Fe.top + y.top,
            bottom: Fe.bottom - O.bottom + y.bottom,
            left: O.left - Fe.left + y.left,
            right: Fe.right - O.right + y.right,
          },
          Se = e.modifiersData.offset;
        if (f === pa && Se) {
          var kt = Se[r];
          Object.keys(ke).forEach(function (ct) {
            var Rn = [In, On].indexOf(ct) >= 0 ? 1 : -1,
              Pn = [Xt, On].indexOf(ct) >= 0 ? 'y' : 'x';
            ke[ct] += kt[Pn] * Rn;
          });
        }
        return ke;
      }
      const JB = {
        name: 'flip',
        enabled: !0,
        phase: 'main',
        fn: function YB(e) {
          var n = e.state,
            t = e.options,
            i = e.name;
          if (!n.modifiersData[i]._skip) {
            for (
              var r = t.mainAxis,
                o = void 0 === r || r,
                s = t.altAxis,
                a = void 0 === s || s,
                l = t.fallbackPlacements,
                c = t.padding,
                u = t.boundary,
                d = t.rootBoundary,
                f = t.altBoundary,
                h = t.flipVariations,
                p = void 0 === h || h,
                g = t.allowedAutoPlacements,
                m = n.options.placement,
                y = Xn(m),
                b =
                  l ||
                  (y !== m && p
                    ? (function XB(e) {
                        if (Xn(e) === Yp) return [];
                        var n = Yc(e);
                        return [Tw(e), n, Tw(n)];
                      })(m)
                    : [Yc(m)]),
                w = [m].concat(b).reduce(function (Go, Ki) {
                  return Go.concat(
                    Xn(Ki) === Yp
                      ? (function QB(e, n) {
                          void 0 === n && (n = {});
                          var r = n.boundary,
                            o = n.rootBoundary,
                            s = n.padding,
                            a = n.flipVariations,
                            l = n.allowedAutoPlacements,
                            c = void 0 === l ? Mw : l,
                            u = Bo(n.placement),
                            d = u
                              ? a
                                ? Sw
                                : Sw.filter(function (p) {
                                    return Bo(p) === u;
                                  })
                              : fa,
                            f = d.filter(function (p) {
                              return c.indexOf(p) >= 0;
                            });
                          0 === f.length && (f = d);
                          var h = f.reduce(function (p, g) {
                            return (p[g] = og(e, { placement: g, boundary: r, rootBoundary: o, padding: s })[Xn(g)]), p;
                          }, {});
                          return Object.keys(h).sort(function (p, g) {
                            return h[p] - h[g];
                          });
                        })(n, {
                          placement: Ki,
                          boundary: u,
                          rootBoundary: d,
                          padding: c,
                          flipVariations: p,
                          allowedAutoPlacements: g,
                        })
                      : Ki
                  );
                }, []),
                O = n.rects.reference,
                x = n.rects.popper,
                re = new Map(),
                se = !0,
                Fe = w[0],
                ke = 0;
              ke < w.length;
              ke++
            ) {
              var Se = w[ke],
                kt = Xn(Se),
                ct = Bo(Se) === ko,
                Rn = [Xt, On].indexOf(kt) >= 0,
                Pn = Rn ? 'width' : 'height',
                vt = og(n, { placement: Se, boundary: u, rootBoundary: d, altBoundary: f, padding: c }),
                xn = Rn ? (ct ? In : Yt) : ct ? On : Xt;
              O[Pn] > x[Pn] && (xn = Yc(xn));
              var uu = Yc(xn),
                Or = [];
              if (
                (o && Or.push(vt[kt] <= 0),
                a && Or.push(vt[xn] <= 0, vt[uu] <= 0),
                Or.every(function (Go) {
                  return Go;
                }))
              ) {
                (Fe = Se), (se = !1);
                break;
              }
              re.set(Se, Or);
            }
            if (se)
              for (
                var yg = function (Ki) {
                    var Ea = w.find(function (hu) {
                      var Ir = re.get(hu);
                      if (Ir)
                        return Ir.slice(0, Ki).every(function (bg) {
                          return bg;
                        });
                    });
                    if (Ea) return (Fe = Ea), 'break';
                  },
                  Ta = p ? 3 : 1;
                Ta > 0 && 'break' !== yg(Ta);
                Ta--
              );
            n.placement !== Fe && ((n.modifiersData[i]._skip = !0), (n.placement = Fe), (n.reset = !0));
          }
        },
        requiresIfExists: ['offset'],
        data: { _skip: !1 },
      };
      function ma(e, n, t) {
        return Dr(e, Jc(n, t));
      }
      function sg(e) {
        var n = Vo(e),
          t = e.offsetWidth,
          i = e.offsetHeight;
        return (
          Math.abs(n.width - t) <= 1 && (t = n.width),
          Math.abs(n.height - i) <= 1 && (i = n.height),
          { x: e.offsetLeft, y: e.offsetTop, width: t, height: i }
        );
      }
      const nj = {
          name: 'preventOverflow',
          enabled: !0,
          phase: 'main',
          fn: function tj(e) {
            var n = e.state,
              t = e.options,
              i = e.name,
              r = t.mainAxis,
              o = void 0 === r || r,
              s = t.altAxis,
              a = void 0 !== s && s,
              f = t.tether,
              h = void 0 === f || f,
              p = t.tetherOffset,
              g = void 0 === p ? 0 : p,
              m = og(n, {
                boundary: t.boundary,
                rootBoundary: t.rootBoundary,
                padding: t.padding,
                altBoundary: t.altBoundary,
              }),
              y = Xn(n.placement),
              D = Bo(n.placement),
              b = !D,
              w = rg(y),
              O = (function ZB(e) {
                return 'x' === e ? 'y' : 'x';
              })(w),
              x = n.modifiersData.popperOffsets,
              re = n.rects.reference,
              se = n.rects.popper,
              Fe = 'function' == typeof g ? g(Object.assign({}, n.rects, { placement: n.placement })) : g,
              ke =
                'number' == typeof Fe ? { mainAxis: Fe, altAxis: Fe } : Object.assign({ mainAxis: 0, altAxis: 0 }, Fe),
              Se = n.modifiersData.offset ? n.modifiersData.offset[n.placement] : null,
              kt = { x: 0, y: 0 };
            if (x) {
              if (o) {
                var ct,
                  Rn = 'y' === w ? Xt : Yt,
                  Pn = 'y' === w ? On : In,
                  vt = 'y' === w ? 'height' : 'width',
                  xn = x[w],
                  uu = xn + m[Rn],
                  Or = xn - m[Pn],
                  du = h ? -se[vt] / 2 : 0,
                  yg = D === ko ? re[vt] : se[vt],
                  Ta = D === ko ? -se[vt] : -re[vt],
                  fu = n.elements.arrow,
                  Go = h && fu ? sg(fu) : { width: 0, height: 0 },
                  Ki = n.modifiersData['arrow#persistent']
                    ? n.modifiersData['arrow#persistent'].padding
                    : { top: 0, right: 0, bottom: 0, left: 0 },
                  Ea = Ki[Rn],
                  hu = Ki[Pn],
                  Ir = ma(0, re[vt], Go[vt]),
                  bg = b ? re[vt] / 2 - du - Ir - Ea - ke.mainAxis : yg - Ir - Ea - ke.mainAxis,
                  o$ = b ? -re[vt] / 2 + du + Ir + hu + ke.mainAxis : Ta + Ir + hu + ke.mainAxis,
                  Dg = n.elements.arrow && _a(n.elements.arrow),
                  iT = null != (ct = Se?.[w]) ? ct : 0,
                  l$ = xn + o$ - iT,
                  rT = ma(
                    h ? Jc(uu, xn + bg - iT - (Dg ? ('y' === w ? Dg.clientTop || 0 : Dg.clientLeft || 0) : 0)) : uu,
                    xn,
                    h ? Dr(Or, l$) : Or
                  );
                (x[w] = rT), (kt[w] = rT - xn);
              }
              if (a) {
                var oT,
                  Ar = x[O],
                  pu = 'y' === O ? 'height' : 'width',
                  sT = Ar + m['x' === w ? Xt : Yt],
                  aT = Ar - m['x' === w ? On : In],
                  Cg = -1 !== [Xt, Yt].indexOf(y),
                  lT = null != (oT = Se?.[O]) ? oT : 0,
                  cT = Cg ? sT : Ar - re[pu] - se[pu] - lT + ke.altAxis,
                  uT = Cg ? Ar + re[pu] + se[pu] - lT - ke.altAxis : aT,
                  dT =
                    h && Cg
                      ? (function ej(e, n, t) {
                          var i = ma(e, n, t);
                          return i > t ? t : i;
                        })(cT, Ar, uT)
                      : ma(h ? cT : sT, Ar, h ? uT : aT);
                (x[O] = dT), (kt[O] = dT - Ar);
              }
              n.modifiersData[i] = kt;
            }
          },
          requiresIfExists: ['offset'],
        },
        sj = {
          name: 'arrow',
          enabled: !0,
          phase: 'main',
          fn: function rj(e) {
            var n,
              t = e.state,
              i = e.name,
              r = e.options,
              o = t.elements.arrow,
              s = t.modifiersData.popperOffsets,
              a = Xn(t.placement),
              l = rg(a),
              u = [Yt, In].indexOf(a) >= 0 ? 'height' : 'width';
            if (o && s) {
              var d = (function (n, t) {
                  return kw(
                    'number' !=
                      typeof (n =
                        'function' == typeof n ? n(Object.assign({}, t.rects, { placement: t.placement })) : n)
                      ? n
                      : Lw(n, fa)
                  );
                })(r.padding, t),
                f = sg(o),
                h = 'y' === l ? Xt : Yt,
                p = 'y' === l ? On : In,
                g = t.rects.reference[u] + t.rects.reference[l] - s[l] - t.rects.popper[u],
                m = s[l] - t.rects.reference[l],
                y = _a(o),
                D = y ? ('y' === l ? y.clientHeight || 0 : y.clientWidth || 0) : 0,
                x = D / 2 - f[u] / 2 + (g / 2 - m / 2),
                re = ma(d[h], x, D - f[u] - d[p]);
              t.modifiersData[i] = (((n = {})[l] = re), (n.centerOffset = re - x), n);
            }
          },
          effect: function oj(e) {
            var n = e.state,
              i = e.options.element,
              r = void 0 === i ? '[data-popper-arrow]' : i;
            null != r &&
              (('string' == typeof r && !(r = n.elements.popper.querySelector(r))) ||
                !Rw(n.elements.popper, r) ||
                (n.elements.arrow = r));
          },
          requires: ['popperOffsets'],
          requiresIfExists: ['preventOverflow'],
        };
      function uj(e, n, t) {
        void 0 === t && (t = !1);
        var i = un(n),
          r =
            un(n) &&
            (function cj(e) {
              var n = e.getBoundingClientRect(),
                t = Lo(n.width) / e.offsetWidth || 1,
                i = Lo(n.height) / e.offsetHeight || 1;
              return 1 !== t || 1 !== i;
            })(n),
          o = Wi(n),
          s = Vo(e, r, t),
          a = { scrollLeft: 0, scrollTop: 0 },
          l = { x: 0, y: 0 };
        return (
          (i || (!i && !t)) &&
            (('body' !== Yn(n) || ng(o)) &&
              (a = (function lj(e) {
                return e !== cn(e) && un(e)
                  ? (function aj(e) {
                      return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
                    })(e)
                  : eg(e);
              })(n)),
            un(n) ? (((l = Vo(n, !0)).x += n.clientLeft), (l.y += n.clientTop)) : o && (l.x = tg(o))),
          { x: s.left + a.scrollLeft - l.x, y: s.top + a.scrollTop - l.y, width: s.width, height: s.height }
        );
      }
      function dj(e) {
        var n = new Map(),
          t = new Set(),
          i = [];
        function r(o) {
          t.add(o.name),
            [].concat(o.requires || [], o.requiresIfExists || []).forEach(function (a) {
              if (!t.has(a)) {
                var l = n.get(a);
                l && r(l);
              }
            }),
            i.push(o);
        }
        return (
          e.forEach(function (o) {
            n.set(o.name, o);
          }),
          e.forEach(function (o) {
            t.has(o.name) || r(o);
          }),
          i
        );
      }
      function hj(e) {
        var n;
        return function () {
          return (
            n ||
              (n = new Promise(function (t) {
                Promise.resolve().then(function () {
                  (n = void 0), t(e());
                });
              })),
            n
          );
        };
      }
      var Vw = { placement: 'bottom', modifiers: [], strategy: 'absolute' };
      function Bw() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) n[t] = arguments[t];
        return !n.some(function (i) {
          return !(i && 'function' == typeof i.getBoundingClientRect);
        });
      }
      function gj(e) {
        void 0 === e && (e = {});
        var t = e.defaultModifiers,
          i = void 0 === t ? [] : t,
          r = e.defaultOptions,
          o = void 0 === r ? Vw : r;
        return function (a, l, c) {
          void 0 === c && (c = o);
          var u = {
              placement: 'bottom',
              orderedModifiers: [],
              options: Object.assign({}, Vw, o),
              modifiersData: {},
              elements: { reference: a, popper: l },
              attributes: {},
              styles: {},
            },
            d = [],
            f = !1,
            h = {
              state: u,
              setOptions: function (y) {
                var D = 'function' == typeof y ? y(u.options) : y;
                g(),
                  (u.options = Object.assign({}, o, u.options, D)),
                  (u.scrollParents = {
                    reference: br(a) ? ga(a) : a.contextElement ? ga(a.contextElement) : [],
                    popper: ga(l),
                  });
                var b = (function fj(e) {
                  var n = dj(e);
                  return HB.reduce(function (t, i) {
                    return t.concat(
                      n.filter(function (r) {
                        return r.phase === i;
                      })
                    );
                  }, []);
                })(
                  (function pj(e) {
                    var n = e.reduce(function (t, i) {
                      var r = t[i.name];
                      return (
                        (t[i.name] = r
                          ? Object.assign({}, r, i, {
                              options: Object.assign({}, r.options, i.options),
                              data: Object.assign({}, r.data, i.data),
                            })
                          : i),
                        t
                      );
                    }, {});
                    return Object.keys(n).map(function (t) {
                      return n[t];
                    });
                  })([].concat(i, u.options.modifiers))
                );
                return (
                  (u.orderedModifiers = b.filter(function (Se) {
                    return Se.enabled;
                  })),
                  (function p() {
                    u.orderedModifiers.forEach(function (m) {
                      var D = m.options,
                        w = m.effect;
                      if ('function' == typeof w) {
                        var O = w({ state: u, name: m.name, instance: h, options: void 0 === D ? {} : D });
                        d.push(O || function () {});
                      }
                    });
                  })(),
                  h.update()
                );
              },
              forceUpdate: function () {
                if (!f) {
                  var y = u.elements,
                    D = y.reference,
                    b = y.popper;
                  if (Bw(D, b)) {
                    (u.rects = { reference: uj(D, _a(b), 'fixed' === u.options.strategy), popper: sg(b) }),
                      (u.reset = !1),
                      (u.placement = u.options.placement),
                      u.orderedModifiers.forEach(function (Se) {
                        return (u.modifiersData[Se.name] = Object.assign({}, Se.data));
                      });
                    for (var O = 0; O < u.orderedModifiers.length; O++)
                      if (!0 !== u.reset) {
                        var x = u.orderedModifiers[O],
                          re = x.fn,
                          se = x.options;
                        'function' == typeof re &&
                          (u = re({ state: u, options: void 0 === se ? {} : se, name: x.name, instance: h }) || u);
                      } else (u.reset = !1), (O = -1);
                  }
                }
              },
              update: hj(function () {
                return new Promise(function (m) {
                  h.forceUpdate(), m(u);
                });
              }),
              destroy: function () {
                g(), (f = !0);
              },
            };
          if (!Bw(a, l)) return h;
          function g() {
            d.forEach(function (m) {
              return m();
            }),
              (d = []);
          }
          return (
            h.setOptions(c).then(function (m) {
              !f && c.onFirstUpdate && c.onFirstUpdate(m);
            }),
            h
          );
        };
      }
      var eu = { passive: !0 },
        bj = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };
      function jw(e) {
        var n,
          t = e.popper,
          i = e.popperRect,
          r = e.placement,
          o = e.variation,
          s = e.offsets,
          a = e.position,
          l = e.gpuAcceleration,
          c = e.adaptive,
          u = e.roundOffsets,
          d = e.isFixed,
          f = s.x,
          h = void 0 === f ? 0 : f,
          p = s.y,
          g = void 0 === p ? 0 : p,
          m = 'function' == typeof u ? u({ x: h, y: g }) : { x: h, y: g };
        (h = m.x), (g = m.y);
        var y = s.hasOwnProperty('x'),
          D = s.hasOwnProperty('y'),
          b = Yt,
          w = Xt,
          O = window;
        if (c) {
          var x = _a(t),
            re = 'clientHeight',
            se = 'clientWidth';
          x === cn(t) &&
            'static' !== bi((x = Wi(t))).position &&
            'absolute' === a &&
            ((re = 'scrollHeight'), (se = 'scrollWidth')),
            (r === Xt || ((r === Yt || r === In) && o === ha)) &&
              ((w = On),
              (g -= (d && x === O && O.visualViewport ? O.visualViewport.height : x[re]) - i.height),
              (g *= l ? 1 : -1)),
            (r !== Yt && ((r !== Xt && r !== On) || o !== ha)) ||
              ((b = In),
              (h -= (d && x === O && O.visualViewport ? O.visualViewport.width : x[se]) - i.width),
              (h *= l ? 1 : -1));
        }
        var ct,
          Se = Object.assign({ position: a }, c && bj),
          kt =
            !0 === u
              ? (function Dj(e) {
                  var t = e.y,
                    r = window.devicePixelRatio || 1;
                  return { x: Lo(e.x * r) / r || 0, y: Lo(t * r) / r || 0 };
                })({ x: h, y: g })
              : { x: h, y: g };
        return (
          (h = kt.x),
          (g = kt.y),
          Object.assign(
            {},
            Se,
            l
              ? (((ct = {})[w] = D ? '0' : ''),
                (ct[b] = y ? '0' : ''),
                (ct.transform =
                  (O.devicePixelRatio || 1) <= 1
                    ? 'translate(' + h + 'px, ' + g + 'px)'
                    : 'translate3d(' + h + 'px, ' + g + 'px, 0)'),
                ct)
              : (((n = {})[w] = D ? g + 'px' : ''), (n[b] = y ? h + 'px' : ''), (n.transform = ''), n)
          )
        );
      }
      var Sj = gj({
        defaultModifiers: [
          {
            name: 'eventListeners',
            enabled: !0,
            phase: 'write',
            fn: function () {},
            effect: function _j(e) {
              var n = e.state,
                t = e.instance,
                i = e.options,
                r = i.scroll,
                o = void 0 === r || r,
                s = i.resize,
                a = void 0 === s || s,
                l = cn(n.elements.popper),
                c = [].concat(n.scrollParents.reference, n.scrollParents.popper);
              return (
                o &&
                  c.forEach(function (u) {
                    u.addEventListener('scroll', t.update, eu);
                  }),
                a && l.addEventListener('resize', t.update, eu),
                function () {
                  o &&
                    c.forEach(function (u) {
                      u.removeEventListener('scroll', t.update, eu);
                    }),
                    a && l.removeEventListener('resize', t.update, eu);
                }
              );
            },
            data: {},
          },
          {
            name: 'popperOffsets',
            enabled: !0,
            phase: 'read',
            fn: function vj(e) {
              var n = e.state;
              n.modifiersData[e.name] = xw({
                reference: n.rects.reference,
                element: n.rects.popper,
                strategy: 'absolute',
                placement: n.placement,
              });
            },
            data: {},
          },
          {
            name: 'computeStyles',
            enabled: !0,
            phase: 'beforeWrite',
            fn: function Cj(e) {
              var n = e.state,
                t = e.options,
                i = t.gpuAcceleration,
                r = void 0 === i || i,
                o = t.adaptive,
                s = void 0 === o || o,
                a = t.roundOffsets,
                l = void 0 === a || a,
                u = {
                  placement: Xn(n.placement),
                  variation: Bo(n.placement),
                  popper: n.elements.popper,
                  popperRect: n.rects.popper,
                  gpuAcceleration: r,
                  isFixed: 'fixed' === n.options.strategy,
                };
              null != n.modifiersData.popperOffsets &&
                (n.styles.popper = Object.assign(
                  {},
                  n.styles.popper,
                  jw(
                    Object.assign({}, u, {
                      offsets: n.modifiersData.popperOffsets,
                      position: n.options.strategy,
                      adaptive: s,
                      roundOffsets: l,
                    })
                  )
                )),
                null != n.modifiersData.arrow &&
                  (n.styles.arrow = Object.assign(
                    {},
                    n.styles.arrow,
                    jw(
                      Object.assign({}, u, {
                        offsets: n.modifiersData.arrow,
                        position: 'absolute',
                        adaptive: !1,
                        roundOffsets: l,
                      })
                    )
                  )),
                (n.attributes.popper = Object.assign({}, n.attributes.popper, {
                  'data-popper-placement': n.placement,
                }));
            },
            data: {},
          },
          {
            name: 'applyStyles',
            enabled: !0,
            phase: 'write',
            fn: function Nj(e) {
              var n = e.state;
              Object.keys(n.elements).forEach(function (t) {
                var i = n.styles[t] || {},
                  r = n.attributes[t] || {},
                  o = n.elements[t];
                !un(o) ||
                  !Yn(o) ||
                  (Object.assign(o.style, i),
                  Object.keys(r).forEach(function (s) {
                    var a = r[s];
                    !1 === a ? o.removeAttribute(s) : o.setAttribute(s, !0 === a ? '' : a);
                  }));
              });
            },
            effect: function Tj(e) {
              var n = e.state,
                t = {
                  popper: { position: n.options.strategy, left: '0', top: '0', margin: '0' },
                  arrow: { position: 'absolute' },
                  reference: {},
                };
              return (
                Object.assign(n.elements.popper.style, t.popper),
                (n.styles = t),
                n.elements.arrow && Object.assign(n.elements.arrow.style, t.arrow),
                function () {
                  Object.keys(n.elements).forEach(function (i) {
                    var r = n.elements[i],
                      o = n.attributes[i] || {},
                      a = Object.keys(n.styles.hasOwnProperty(i) ? n.styles[i] : t[i]).reduce(function (l, c) {
                        return (l[c] = ''), l;
                      }, {});
                    !un(r) ||
                      !Yn(r) ||
                      (Object.assign(r.style, a),
                      Object.keys(o).forEach(function (l) {
                        r.removeAttribute(l);
                      }));
                  });
                }
              );
            },
            requires: ['computeStyles'],
          },
        ],
      });
      const Ij = {
          name: 'offset',
          enabled: !0,
          phase: 'main',
          requires: ['popperOffsets'],
          fn: function Oj(e) {
            var n = e.state,
              i = e.name,
              r = e.options.offset,
              o = void 0 === r ? [0, 0] : r,
              s = Mw.reduce(function (u, d) {
                return (
                  (u[d] = (function Mj(e, n, t) {
                    var i = Xn(e),
                      r = [Yt, Xt].indexOf(i) >= 0 ? -1 : 1,
                      o = 'function' == typeof t ? t(Object.assign({}, n, { placement: e })) : t,
                      s = o[0],
                      a = o[1];
                    return (s = s || 0), (a = (a || 0) * r), [Yt, In].indexOf(i) >= 0 ? { x: a, y: s } : { x: s, y: a };
                  })(d, n.rects, o)),
                  u
                );
              }, {}),
              a = s[n.placement],
              c = a.y;
            null != n.modifiersData.popperOffsets &&
              ((n.modifiersData.popperOffsets.x += a.x), (n.modifiersData.popperOffsets.y += c)),
              (n.modifiersData[i] = s);
          },
        },
        Vj = ['*'],
        nH = ['dialog'];
      function lg(e) {
        return 'string' == typeof e;
      }
      function Cr(e) {
        return null != e;
      }
      function jo(e) {
        return (e || document.body).getBoundingClientRect();
      }
      const Gw = { animation: !0, transitionTimerDelayMs: 5 },
        XH = () => {},
        { transitionTimerDelayMs: YH } = Gw,
        va = new Map(),
        Ft = (e, n, t, i) => {
          let r = i.context || {};
          const o = va.get(n);
          if (o)
            switch (i.runningTransition) {
              case 'continue':
                return Jt;
              case 'stop':
                e.run(() => o.transition$.complete()), (r = Object.assign(o.context, r)), va.delete(n);
            }
          const s = t(n, i.animation, r) || XH;
          if (!i.animation || 'none' === window.getComputedStyle(n).transitionProperty)
            return (
              e.run(() => s()),
              P(void 0).pipe(
                (function qH(e) {
                  return (n) =>
                    new he((t) =>
                      n.subscribe({
                        next: (s) => e.run(() => t.next(s)),
                        error: (s) => e.run(() => t.error(s)),
                        complete: () => e.run(() => t.complete()),
                      })
                    );
                })(e)
              )
            );
          const a = new pe(),
            l = new pe(),
            c = a.pipe(
              (function TB(...e) {
                return (n) => Vi(n, P(...e));
              })(!0)
            );
          va.set(n, {
            transition$: a,
            complete: () => {
              l.next(), l.complete();
            },
            context: r,
          });
          const u = (function QH(e) {
            const { transitionDelay: n, transitionDuration: t } = window.getComputedStyle(e);
            return 1e3 * (parseFloat(n) + parseFloat(t));
          })(n);
          return (
            e.runOutsideAngular(() => {
              const d = mt(n, 'transitionend').pipe(
                tt(c),
                Oe(({ target: h }) => h === n)
              );
              Nw(Hp(u + YH).pipe(tt(c)), d, l)
                .pipe(tt(c))
                .subscribe(() => {
                  va.delete(n),
                    e.run(() => {
                      s(), a.next(), a.complete();
                    });
                });
            }),
            a.asObservable()
          );
        };
      let nu = (() => {
          class e {
            constructor() {
              this.animation = Gw.animation;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        qw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        Qw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        Jw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        Zw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      var lt = (() => {
        return (
          ((e = lt || (lt = {}))[(e.Tab = 9)] = 'Tab'),
          (e[(e.Enter = 13)] = 'Enter'),
          (e[(e.Escape = 27)] = 'Escape'),
          (e[(e.Space = 32)] = 'Space'),
          (e[(e.PageUp = 33)] = 'PageUp'),
          (e[(e.PageDown = 34)] = 'PageDown'),
          (e[(e.End = 35)] = 'End'),
          (e[(e.Home = 36)] = 'Home'),
          (e[(e.ArrowLeft = 37)] = 'ArrowLeft'),
          (e[(e.ArrowUp = 38)] = 'ArrowUp'),
          (e[(e.ArrowRight = 39)] = 'ArrowRight'),
          (e[(e.ArrowDown = 40)] = 'ArrowDown'),
          lt
        );
        var e;
      })();
      const ru = (e, n) => !!n && n.some((t) => t.contains(e)),
        eN = (e, n) =>
          !n ||
          null !=
            (function KH(e, n) {
              return !n || typeof e.closest > 'u' ? null : e.closest(n);
            })(e, n),
        pG =
          typeof navigator < 'u' &&
          !!navigator.userAgent &&
          (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
            /Android/.test(navigator.userAgent));
      const tN = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[contenteditable]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');
      function nN(e) {
        const n = Array.from(e.querySelectorAll(tN)).filter((t) => -1 !== t.tabIndex);
        return [n[0], n[n.length - 1]];
      }
      const vG = /\s+/,
        yG = /  +/gi,
        bG = /^start/,
        DG = /^end/,
        CG = /-(top|left)$/,
        wG = /-(bottom|right)$/,
        TG = /^left/,
        EG = /^right/,
        SG = /^start/,
        MG = /^end/;
      function iN({ placement: e, baseClass: n }) {
        let t = Array.isArray(e) ? e : e.split(vG),
          r = t.findIndex((l) => 'auto' === l);
        r >= 0 &&
          [
            'top',
            'bottom',
            'start',
            'end',
            'top-start',
            'top-end',
            'bottom-start',
            'bottom-end',
            'start-top',
            'start-bottom',
            'end-top',
            'end-bottom',
          ].forEach(function (l) {
            null == t.find((c) => -1 !== c.search('^' + l)) && t.splice(r++, 1, l);
          });
        const o = t.map((l) =>
          (function NG(e) {
            return e.replace(bG, 'left').replace(DG, 'right').replace(CG, '-start').replace(wG, '-end');
          })(l)
        );
        return {
          placement: o.shift(),
          modifiers: [
            {
              name: 'bootstrapClasses',
              enabled: !!n,
              phase: 'write',
              fn({ state: l }) {
                const c = new RegExp(n + '(-[a-z]+)*', 'gi'),
                  u = l.elements.popper,
                  d = l.placement;
                let f = u.className;
                (f = f.replace(c, '')),
                  (f += ` ${(function OG(e, n) {
                    let [t, i] = n.split('-');
                    const r = t.replace(TG, 'start').replace(EG, 'end');
                    let o = [r];
                    if (i) {
                      let s = i;
                      ('left' === t || 'right' === t) && (s = s.replace(SG, 'top').replace(MG, 'bottom')),
                        o.push(`${r}-${s}`);
                    }
                    return e && (o = o.map((s) => `${e}-${s}`)), o.join(' ');
                  })(n, d)}`),
                  (f = f.trim().replace(yG, ' ')),
                  (u.className = f);
              },
            },
            JB,
            nj,
            sj,
            { enabled: !0, name: 'flip', options: { fallbackPlacements: o } },
            { enabled: !0, name: 'preventOverflow', phase: 'main', fn: function () {} },
          ],
        };
      }
      function rN(e) {
        return e;
      }
      function AG(e) {
        return (n) => (n.modifiers.push(Ij, { name: 'offset', options: { offset: () => e } }), n);
      }
      new Date(1882, 10, 12), new Date(2174, 10, 25);
      let uN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, x1] })),
            e
          );
        })(),
        jG = (() => {
          class e {
            constructor() {
              (this.autoClose = !0), (this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end']);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        dN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = I({ type: e, selectors: [['', 8, 'navbar']] })),
            e
          );
        })(),
        fN = (() => {
          class e {
            constructor(t, i) {
              (this.elementRef = t), (this._renderer = i), (this._disabled = !1);
            }
            set disabled(t) {
              (this._disabled = '' === t || !0 === t),
                this._renderer.setProperty(this.elementRef.nativeElement, 'disabled', this._disabled);
            }
            get disabled() {
              return this._disabled;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ne), _(vn));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'ngbDropdownItem', '']],
              hostAttrs: [1, 'dropdown-item'],
              hostVars: 3,
              hostBindings: function (t, i) {
                2 & t && (vo('tabIndex', i.disabled ? -1 : 0), Be('disabled', i.disabled));
              },
              inputs: { disabled: 'disabled' },
            })),
            e
          );
        })(),
        gg = (() => {
          class e {
            constructor(t, i) {
              (this.dropdown = t),
                (this.placement = 'bottom'),
                (this.isOpen = !1),
                (this.nativeElement = i.nativeElement);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Ca)), _(Ne));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'ngbDropdownMenu', '']],
              contentQueries: function (t, i, r) {
                if ((1 & t && We(r, fN, 4), 2 & t)) {
                  let o;
                  Re((o = Pe())) && (i.menuItems = o);
                }
              },
              hostVars: 4,
              hostBindings: function (t, i) {
                1 & t &&
                  fe('keydown.ArrowUp', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.ArrowDown', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Home', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.End', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Enter', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Space', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Tab', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Shift.Tab', function (o) {
                    return i.dropdown.onKeyDown(o);
                  }),
                  2 & t && Be('dropdown-menu', !0)('show', i.dropdown.isOpen());
              },
            })),
            e
          );
        })(),
        lu = (() => {
          class e {
            constructor(t, i) {
              (this.dropdown = t), (this.nativeElement = i.nativeElement);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Ca)), _(Ne));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'ngbDropdownAnchor', '']],
              hostAttrs: [1, 'dropdown-toggle'],
              hostVars: 1,
              hostBindings: function (t, i) {
                2 & t && be('aria-expanded', i.dropdown.isOpen());
              },
            })),
            e
          );
        })(),
        hN = (() => {
          class e extends lu {
            constructor(t, i) {
              super(t, i);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Ca)), _(Ne));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'ngbDropdownToggle', '']],
              hostAttrs: [1, 'dropdown-toggle'],
              hostVars: 1,
              hostBindings: function (t, i) {
                1 & t &&
                  fe('click', function () {
                    return i.dropdown.toggle();
                  })('keydown.ArrowUp', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.ArrowDown', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Home', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.End', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Tab', function (o) {
                    return i.dropdown.onKeyDown(o);
                  })('keydown.Shift.Tab', function (o) {
                    return i.dropdown.onKeyDown(o);
                  }),
                  2 & t && be('aria-expanded', i.dropdown.isOpen());
              },
              features: [Ee([{ provide: lu, useExisting: ae(() => e) }]), de],
            })),
            e
          );
        })(),
        Ca = (() => {
          class e {
            constructor(t, i, r, o, s, a, l) {
              (this._changeDetector = t),
                (this._document = r),
                (this._ngZone = o),
                (this._elementRef = s),
                (this._renderer = a),
                (this._destroyCloseHandlers$ = new pe()),
                (this._bodyContainer = null),
                (this._positioning = (function IG() {
                  let e = null;
                  return {
                    createPopper(n) {
                      if (!e) {
                        let i = (n.updatePopperOptions || rN)(iN(n));
                        e = Sj(n.hostElement, n.targetElement, i);
                      }
                    },
                    update() {
                      e && e.update();
                    },
                    setOptions(n) {
                      if (e) {
                        let i = (n.updatePopperOptions || rN)(iN(n));
                        e.setOptions(i);
                      }
                    },
                    destroy() {
                      e && (e.destroy(), (e = null));
                    },
                  };
                })()),
                (this._open = !1),
                (this.openChange = new U()),
                (this.placement = i.placement),
                (this.container = i.container),
                (this.autoClose = i.autoClose),
                (this.display = l ? 'static' : 'dynamic');
            }
            ngAfterContentInit() {
              this._ngZone.onStable.pipe(De(1)).subscribe(() => {
                this._applyPlacementClasses(), this._open && this._setCloseHandlers();
              });
            }
            ngOnChanges(t) {
              if (
                (t.container && this._open && this._applyContainer(this.container),
                t.placement &&
                  !t.placement.firstChange &&
                  (this._positioning.setOptions({
                    hostElement: this._anchor.nativeElement,
                    targetElement: this._bodyContainer || this._menu.nativeElement,
                    placement: this.placement,
                    appendToBody: 'body' === this.container,
                  }),
                  this._applyPlacementClasses()),
                t.dropdownClass)
              ) {
                const { currentValue: i, previousValue: r } = t.dropdownClass;
                this._applyCustomDropdownClass(i, r);
              }
              t.autoClose && this._open && ((this.autoClose = t.autoClose.currentValue), this._setCloseHandlers());
            }
            isOpen() {
              return this._open;
            }
            open() {
              this._open ||
                ((this._open = !0),
                this._applyContainer(this.container),
                this.openChange.emit(!0),
                this._setCloseHandlers(),
                this._anchor &&
                  (this._anchor.nativeElement.focus(),
                  'dynamic' === this.display &&
                    this._ngZone.runOutsideAngular(() => {
                      this._positioning.createPopper({
                        hostElement: this._anchor.nativeElement,
                        targetElement: this._bodyContainer || this._menu.nativeElement,
                        placement: this.placement,
                        appendToBody: 'body' === this.container,
                        updatePopperOptions: AG([0, 2]),
                      }),
                        this._applyPlacementClasses(),
                        (this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positionMenu()));
                    })));
            }
            _setCloseHandlers() {
              this._destroyCloseHandlers$.next(),
                (function _G(e, n, t, i, r, o, s, a) {
                  t &&
                    e.runOutsideAngular(
                      ((e) => (pG ? () => setTimeout(() => e(), 100) : e))(() => {
                        const c = mt(n, 'keydown').pipe(
                            tt(r),
                            Oe((f) => f.which === lt.Escape),
                            at((f) => f.preventDefault())
                          ),
                          u = mt(n, 'mousedown').pipe(
                            L((f) => {
                              const h = f.target;
                              return (
                                2 !== f.button &&
                                !ru(h, s) &&
                                ('inside' === t
                                  ? ru(h, o) && eN(h, a)
                                  : 'outside' === t
                                  ? !ru(h, o)
                                  : eN(h, a) || !ru(h, o))
                              );
                            }),
                            tt(r)
                          ),
                          d = mt(n, 'mouseup').pipe(
                            Xp(u),
                            Oe(([f, h]) => h),
                            uw(0),
                            tt(r)
                          );
                        Nw([c.pipe(L((f) => 0)), d.pipe(L((f) => 1))]).subscribe((f) => e.run(() => i(f)));
                      })
                    );
                })(
                  this._ngZone,
                  this._document,
                  this.autoClose,
                  (t) => {
                    this.close(), 0 === t && this._anchor.nativeElement.focus();
                  },
                  this._destroyCloseHandlers$,
                  this._menu ? [this._menu.nativeElement] : [],
                  this._anchor ? [this._anchor.nativeElement] : [],
                  '.dropdown-item,.dropdown-divider'
                );
            }
            close() {
              this._open &&
                ((this._open = !1),
                this._resetContainer(),
                this._positioning.destroy(),
                this._zoneSubscription?.unsubscribe(),
                this._destroyCloseHandlers$.next(),
                this.openChange.emit(!1),
                this._changeDetector.markForCheck());
            }
            toggle() {
              this.isOpen() ? this.close() : this.open();
            }
            ngOnDestroy() {
              this.close();
            }
            onKeyDown(t) {
              const i = t.which,
                r = this._getMenuElements();
              let o = -1,
                s = null;
              const a = this._isEventFromToggle(t);
              if (
                (!a &&
                  r.length &&
                  r.forEach((l, c) => {
                    l.contains(t.target) && (s = l), l === this._document.activeElement && (o = c);
                  }),
                i !== lt.Space && i !== lt.Enter)
              ) {
                if (i !== lt.Tab) {
                  if (a || s) {
                    if ((this.open(), r.length)) {
                      switch (i) {
                        case lt.ArrowDown:
                          o = Math.min(o + 1, r.length - 1);
                          break;
                        case lt.ArrowUp:
                          if (this._isDropup() && -1 === o) {
                            o = r.length - 1;
                            break;
                          }
                          o = Math.max(o - 1, 0);
                          break;
                        case lt.Home:
                          o = 0;
                          break;
                        case lt.End:
                          o = r.length - 1;
                      }
                      r[o].focus();
                    }
                    t.preventDefault();
                  }
                } else if (t.target && this.isOpen() && this.autoClose) {
                  if (this._anchor.nativeElement === t.target)
                    return void ('body' !== this.container || t.shiftKey
                      ? t.shiftKey && this.close()
                      : (this._renderer.setAttribute(this._menu.nativeElement, 'tabindex', '0'),
                        this._menu.nativeElement.focus(),
                        this._renderer.removeAttribute(this._menu.nativeElement, 'tabindex')));
                  if ('body' === this.container) {
                    const l = this._menu.nativeElement.querySelectorAll(tN);
                    t.shiftKey && t.target === l[0]
                      ? (this._anchor.nativeElement.focus(), t.preventDefault())
                      : !t.shiftKey &&
                        t.target === l[l.length - 1] &&
                        (this._anchor.nativeElement.focus(), this.close());
                  } else
                    mt(t.target, 'focusout')
                      .pipe(De(1))
                      .subscribe(({ relatedTarget: l }) => {
                        this._elementRef.nativeElement.contains(l) || this.close();
                      });
                }
              } else
                s &&
                  (!0 === this.autoClose || 'inside' === this.autoClose) &&
                  mt(s, 'click')
                    .pipe(De(1))
                    .subscribe(() => this.close());
            }
            _isDropup() {
              return this._elementRef.nativeElement.classList.contains('dropup');
            }
            _isEventFromToggle(t) {
              return this._anchor.nativeElement.contains(t.target);
            }
            _getMenuElements() {
              const t = this._menu;
              return null == t ? [] : t.menuItems.filter((i) => !i.disabled).map((i) => i.elementRef.nativeElement);
            }
            _positionMenu() {
              const t = this._menu;
              this.isOpen() &&
                t &&
                ('dynamic' === this.display
                  ? (this._positioning.update(), this._applyPlacementClasses())
                  : this._applyPlacementClasses(this._getFirstPlacement(this.placement)));
            }
            _getFirstPlacement(t) {
              return Array.isArray(t) ? t[0] : t.split(' ')[0];
            }
            _resetContainer() {
              const t = this._renderer;
              this._menu && t.appendChild(this._elementRef.nativeElement, this._menu.nativeElement),
                this._bodyContainer &&
                  (t.removeChild(this._document.body, this._bodyContainer), (this._bodyContainer = null));
            }
            _applyContainer(t = null) {
              if ((this._resetContainer(), 'body' === t)) {
                const i = this._renderer,
                  r = this._menu.nativeElement,
                  o = (this._bodyContainer = this._bodyContainer || i.createElement('div'));
                i.setStyle(o, 'position', 'absolute'),
                  i.setStyle(r, 'position', 'static'),
                  i.setStyle(o, 'z-index', '1055'),
                  i.appendChild(o, r),
                  i.appendChild(this._document.body, o);
              }
              this._applyCustomDropdownClass(this.dropdownClass);
            }
            _applyCustomDropdownClass(t, i) {
              const r = 'body' === this.container ? this._bodyContainer : this._elementRef.nativeElement;
              r && (i && this._renderer.removeClass(r, i), t && this._renderer.addClass(r, t));
            }
            _applyPlacementClasses(t) {
              const i = this._menu;
              if (i) {
                t || (t = this._getFirstPlacement(this.placement));
                const r = this._renderer,
                  o = this._elementRef.nativeElement;
                r.removeClass(o, 'dropup'), r.removeClass(o, 'dropdown');
                const { nativeElement: s } = i;
                'static' === this.display
                  ? ((i.placement = null), r.setAttribute(s, 'data-bs-popper', 'static'))
                  : ((i.placement = t), r.removeAttribute(s, 'data-bs-popper'));
                const a = -1 !== t.search('^top') ? 'dropup' : 'dropdown';
                r.addClass(o, a);
                const l = this._bodyContainer;
                l && (r.removeClass(l, 'dropup'), r.removeClass(l, 'dropdown'), r.addClass(l, a));
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(En), _(jG), _(Xe), _(me), _(Ne), _(vn), _(dN, 8));
            }),
            (e.ɵdir = I({
              type: e,
              selectors: [['', 'ngbDropdown', '']],
              contentQueries: function (t, i, r) {
                if ((1 & t && (We(r, gg, 5), We(r, lu, 5)), 2 & t)) {
                  let o;
                  Re((o = Pe())) && (i._menu = o.first), Re((o = Pe())) && (i._anchor = o.first);
                }
              },
              hostVars: 2,
              hostBindings: function (t, i) {
                2 & t && Be('show', i.isOpen());
              },
              inputs: {
                autoClose: 'autoClose',
                dropdownClass: 'dropdownClass',
                _open: ['open', '_open'],
                placement: 'placement',
                container: 'container',
                display: 'display',
              },
              outputs: { openChange: 'openChange' },
              exportAs: ['ngbDropdown'],
              features: [Ot],
            })),
            e
          );
        })(),
        pN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      class Er {
        constructor(n, t, i) {
          (this.nodes = n), (this.viewRef = t), (this.componentRef = i);
        }
      }
      let HG = (() => {
        class e {
          constructor(t, i) {
            (this._el = t), (this._zone = i);
          }
          ngOnInit() {
            this._zone.onStable
              .asObservable()
              .pipe(De(1))
              .subscribe(() => {
                Ft(
                  this._zone,
                  this._el.nativeElement,
                  (t, i) => {
                    i && jo(t), t.classList.add('show');
                  },
                  { animation: this.animation, runningTransition: 'continue' }
                );
              });
          }
          hide() {
            return Ft(this._zone, this._el.nativeElement, ({ classList: t }) => t.remove('show'), {
              animation: this.animation,
              runningTransition: 'stop',
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Ne), _(me));
          }),
          (e.ɵcmp = yt({
            type: e,
            selectors: [['ngb-modal-backdrop']],
            hostAttrs: [2, 'z-index', '1055'],
            hostVars: 6,
            hostBindings: function (t, i) {
              2 & t &&
                (ar('modal-backdrop' + (i.backdropClass ? ' ' + i.backdropClass : '')),
                Be('show', !i.animation)('fade', i.animation));
            },
            inputs: { animation: 'animation', backdropClass: 'backdropClass' },
            decls: 0,
            vars: 0,
            template: function (t, i) {},
            encapsulation: 2,
          })),
          e
        );
      })();
      class gN {
        close(n) {}
        dismiss(n) {}
      }
      class GG {
        constructor(n, t, i, r) {
          (this._windowCmptRef = n),
            (this._contentRef = t),
            (this._backdropCmptRef = i),
            (this._beforeDismiss = r),
            (this._closed = new pe()),
            (this._dismissed = new pe()),
            (this._hidden = new pe()),
            n.instance.dismissEvent.subscribe((o) => {
              this.dismiss(o);
            }),
            (this.result = new Promise((o, s) => {
              (this._resolve = o), (this._reject = s);
            })),
            this.result.then(null, () => {});
        }
        get componentInstance() {
          if (this._contentRef && this._contentRef.componentRef) return this._contentRef.componentRef.instance;
        }
        get closed() {
          return this._closed.asObservable().pipe(tt(this._hidden));
        }
        get dismissed() {
          return this._dismissed.asObservable().pipe(tt(this._hidden));
        }
        get hidden() {
          return this._hidden.asObservable();
        }
        get shown() {
          return this._windowCmptRef.instance.shown.asObservable();
        }
        close(n) {
          this._windowCmptRef && (this._closed.next(n), this._resolve(n), this._removeModalElements());
        }
        _dismiss(n) {
          this._dismissed.next(n), this._reject(n), this._removeModalElements();
        }
        dismiss(n) {
          if (this._windowCmptRef)
            if (this._beforeDismiss) {
              const t = this._beforeDismiss();
              !(function Hw(e) {
                return e && e.then;
              })(t)
                ? !1 !== t && this._dismiss(n)
                : t.then(
                    (i) => {
                      !1 !== i && this._dismiss(n);
                    },
                    () => {}
                  );
            } else this._dismiss(n);
        }
        _removeModalElements() {
          const n = this._windowCmptRef.instance.hide(),
            t = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : P(void 0);
          n.subscribe(() => {
            const { nativeElement: i } = this._windowCmptRef.location;
            i.parentNode.removeChild(i),
              this._windowCmptRef.destroy(),
              this._contentRef && this._contentRef.viewRef && this._contentRef.viewRef.destroy(),
              (this._windowCmptRef = null),
              (this._contentRef = null);
          }),
            t.subscribe(() => {
              if (this._backdropCmptRef) {
                const { nativeElement: i } = this._backdropCmptRef.location;
                i.parentNode.removeChild(i), this._backdropCmptRef.destroy(), (this._backdropCmptRef = null);
              }
            }),
            Xc(n, t).subscribe(() => {
              this._hidden.next(), this._hidden.complete();
            });
        }
      }
      var wa = (() => {
        return ((e = wa || (wa = {}))[(e.BACKDROP_CLICK = 0)] = 'BACKDROP_CLICK'), (e[(e.ESC = 1)] = 'ESC'), wa;
        var e;
      })();
      let UG = (() => {
          class e {
            constructor(t, i, r) {
              (this._document = t),
                (this._elRef = i),
                (this._zone = r),
                (this._closed$ = new pe()),
                (this._elWithFocus = null),
                (this.backdrop = !0),
                (this.keyboard = !0),
                (this.dismissEvent = new U()),
                (this.shown = new pe()),
                (this.hidden = new pe());
            }
            get fullscreenClass() {
              return !0 === this.fullscreen
                ? ' modal-fullscreen'
                : lg(this.fullscreen)
                ? ` modal-fullscreen-${this.fullscreen}-down`
                : '';
            }
            dismiss(t) {
              this.dismissEvent.emit(t);
            }
            ngOnInit() {
              (this._elWithFocus = this._document.activeElement),
                this._zone.onStable
                  .asObservable()
                  .pipe(De(1))
                  .subscribe(() => {
                    this._show();
                  });
            }
            ngOnDestroy() {
              this._disableEventHandling();
            }
            hide() {
              const { nativeElement: t } = this._elRef,
                i = { animation: this.animation, runningTransition: 'stop' },
                s = Xc(
                  Ft(this._zone, t, () => t.classList.remove('show'), i),
                  Ft(this._zone, this._dialogEl.nativeElement, () => {}, i)
                );
              return (
                s.subscribe(() => {
                  this.hidden.next(), this.hidden.complete();
                }),
                this._disableEventHandling(),
                this._restoreFocus(),
                s
              );
            }
            _show() {
              const t = { animation: this.animation, runningTransition: 'continue' };
              Xc(
                Ft(
                  this._zone,
                  this._elRef.nativeElement,
                  (o, s) => {
                    s && jo(o), o.classList.add('show');
                  },
                  t
                ),
                Ft(this._zone, this._dialogEl.nativeElement, () => {}, t)
              ).subscribe(() => {
                this.shown.next(), this.shown.complete();
              }),
                this._enableEventHandling(),
                this._setFocus();
            }
            _enableEventHandling() {
              const { nativeElement: t } = this._elRef;
              this._zone.runOutsideAngular(() => {
                mt(t, 'keydown')
                  .pipe(
                    tt(this._closed$),
                    Oe((r) => r.which === lt.Escape)
                  )
                  .subscribe((r) => {
                    this.keyboard
                      ? requestAnimationFrame(() => {
                          r.defaultPrevented || this._zone.run(() => this.dismiss(wa.ESC));
                        })
                      : 'static' === this.backdrop && this._bumpBackdrop();
                  });
                let i = !1;
                mt(this._dialogEl.nativeElement, 'mousedown')
                  .pipe(
                    tt(this._closed$),
                    at(() => (i = !1)),
                    st(() => mt(t, 'mouseup').pipe(tt(this._closed$), De(1))),
                    Oe(({ target: r }) => t === r)
                  )
                  .subscribe(() => {
                    i = !0;
                  }),
                  mt(t, 'click')
                    .pipe(tt(this._closed$))
                    .subscribe(({ target: r }) => {
                      t === r &&
                        ('static' === this.backdrop
                          ? this._bumpBackdrop()
                          : !0 === this.backdrop && !i && this._zone.run(() => this.dismiss(wa.BACKDROP_CLICK))),
                        (i = !1);
                    });
              });
            }
            _disableEventHandling() {
              this._closed$.next();
            }
            _setFocus() {
              const { nativeElement: t } = this._elRef;
              if (!t.contains(document.activeElement)) {
                const i = t.querySelector('[ngbAutofocus]'),
                  r = nN(t)[0];
                (i || r || t).focus();
              }
            }
            _restoreFocus() {
              const t = this._document.body,
                i = this._elWithFocus;
              let r;
              (r = i && i.focus && t.contains(i) ? i : t),
                this._zone.runOutsideAngular(() => {
                  setTimeout(() => r.focus()), (this._elWithFocus = null);
                });
            }
            _bumpBackdrop() {
              'static' === this.backdrop &&
                Ft(
                  this._zone,
                  this._elRef.nativeElement,
                  ({ classList: t }) => (t.add('modal-static'), () => t.remove('modal-static')),
                  { animation: this.animation, runningTransition: 'continue' }
                );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Xe), _(Ne), _(me));
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [['ngb-modal-window']],
              viewQuery: function (t, i) {
                if (
                  (1 & t &&
                    (function Wf(e, n, t) {
                      const i = ie();
                      i.firstCreatePass && (H0(i, new V0(e, n, t), -1), 2 == (2 & n) && (i.staticViewQueries = !0)),
                        j0(i, C(), n);
                    })(nH, 7),
                  2 & t)
                ) {
                  let r;
                  Re((r = Pe())) && (i._dialogEl = r.first);
                }
              },
              hostAttrs: ['role', 'dialog', 'tabindex', '-1'],
              hostVars: 7,
              hostBindings: function (t, i) {
                2 & t &&
                  (be('aria-modal', !0)('aria-labelledby', i.ariaLabelledBy)('aria-describedby', i.ariaDescribedBy),
                  ar('modal d-block' + (i.windowClass ? ' ' + i.windowClass : '')),
                  Be('fade', i.animation));
              },
              inputs: {
                animation: 'animation',
                ariaLabelledBy: 'ariaLabelledBy',
                ariaDescribedBy: 'ariaDescribedBy',
                backdrop: 'backdrop',
                centered: 'centered',
                fullscreen: 'fullscreen',
                keyboard: 'keyboard',
                scrollable: 'scrollable',
                size: 'size',
                windowClass: 'windowClass',
                modalDialogClass: 'modalDialogClass',
              },
              outputs: { dismissEvent: 'dismiss' },
              ngContentSelectors: Vj,
              decls: 4,
              vars: 2,
              consts: [
                ['role', 'document'],
                ['dialog', ''],
                [1, 'modal-content'],
              ],
              template: function (t, i) {
                1 & t &&
                  ((function oy(e) {
                    const n = C()[16][6];
                    if (!n.projection) {
                      const i = (n.projection = is(e ? e.length : 1, null)),
                        r = i.slice();
                      let o = n.child;
                      for (; null !== o; ) {
                        const s = e ? GI(o, e) : 0;
                        null !== s && (r[s] ? (r[s].projectionNext = o) : (i[s] = o), (r[s] = o)), (o = o.next);
                      }
                    }
                  })(),
                  T(0, 'div', 0, 1)(2, 'div', 2),
                  (function sy(e, n = 0, t) {
                    const i = C(),
                      r = ie(),
                      o = oo(r, 22 + e, 16, null, t || null);
                    null === o.projection && (o.projection = n),
                      Hu(),
                      64 != (64 & o.flags) &&
                        (function nO(e, n, t) {
                          Km(n[J], 0, n, t, Lm(e, t, n), Hm(t.parent || n[6], t, n));
                        })(r, i, o);
                  })(3),
                  E()()),
                  2 & t &&
                    ar(
                      'modal-dialog' +
                        (i.size ? ' modal-' + i.size : '') +
                        (i.centered ? ' modal-dialog-centered' : '') +
                        i.fullscreenClass +
                        (i.scrollable ? ' modal-dialog-scrollable' : '') +
                        (i.modalDialogClass ? ' ' + i.modalDialogClass : '')
                    );
              },
              styles: [
                'ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n',
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        $G = (() => {
          class e {
            constructor(t) {
              this._document = t;
            }
            hide() {
              const t = Math.abs(window.innerWidth - this._document.documentElement.clientWidth),
                i = this._document.body,
                r = i.style,
                { overflow: o, paddingRight: s } = r;
              if (t > 0) {
                const a = parseFloat(window.getComputedStyle(i).paddingRight);
                r.paddingRight = `${a + t}px`;
              }
              return (
                (r.overflow = 'hidden'),
                () => {
                  t > 0 && (r.paddingRight = s), (r.overflow = o);
                }
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(Xe));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        WG = (() => {
          class e {
            constructor(t, i, r, o, s, a) {
              (this._applicationRef = t),
                (this._injector = i),
                (this._document = r),
                (this._scrollBar = o),
                (this._rendererFactory = s),
                (this._ngZone = a),
                (this._activeWindowCmptHasChanged = new pe()),
                (this._ariaHiddenValues = new Map()),
                (this._scrollBarRestoreFn = null),
                (this._backdropAttributes = ['animation', 'backdropClass']),
                (this._modalRefs = []),
                (this._windowAttributes = [
                  'animation',
                  'ariaLabelledBy',
                  'ariaDescribedBy',
                  'backdrop',
                  'centered',
                  'fullscreen',
                  'keyboard',
                  'scrollable',
                  'size',
                  'windowClass',
                  'modalDialogClass',
                ]),
                (this._windowCmpts = []),
                (this._activeInstances = new U()),
                this._activeWindowCmptHasChanged.subscribe(() => {
                  if (this._windowCmpts.length) {
                    const l = this._windowCmpts[this._windowCmpts.length - 1];
                    ((e, n, t, i = !1) => {
                      this._ngZone.runOutsideAngular(() => {
                        const r = mt(n, 'focusin').pipe(
                          tt(t),
                          L((o) => o.target)
                        );
                        mt(n, 'keydown')
                          .pipe(
                            tt(t),
                            Oe((o) => o.which === lt.Tab),
                            Xp(r)
                          )
                          .subscribe(([o, s]) => {
                            const [a, l] = nN(n);
                            (s === a || s === n) && o.shiftKey && (l.focus(), o.preventDefault()),
                              s === l && !o.shiftKey && (a.focus(), o.preventDefault());
                          }),
                          i &&
                            mt(n, 'click')
                              .pipe(
                                tt(t),
                                Xp(r),
                                L((o) => o[1])
                              )
                              .subscribe((o) => o.focus());
                      });
                    })(0, l.location.nativeElement, this._activeWindowCmptHasChanged),
                      this._revertAriaHidden(),
                      this._setAriaHidden(l.location.nativeElement);
                  }
                });
            }
            _restoreScrollBar() {
              const t = this._scrollBarRestoreFn;
              t && ((this._scrollBarRestoreFn = null), t());
            }
            _hideScrollBar() {
              this._scrollBarRestoreFn || (this._scrollBarRestoreFn = this._scrollBar.hide());
            }
            open(t, i, r) {
              const o =
                  r.container instanceof HTMLElement
                    ? r.container
                    : Cr(r.container)
                    ? this._document.querySelector(r.container)
                    : this._document.body,
                s = this._rendererFactory.createRenderer(null, null);
              if (!o)
                throw new Error(`The specified modal container "${r.container || 'body'}" was not found in the DOM.`);
              this._hideScrollBar();
              const a = new gN(),
                l = this._getContentRef(r.injector || t, i, a, r);
              let c = !1 !== r.backdrop ? this._attachBackdrop(o) : void 0,
                u = this._attachWindowComponent(o, l.nodes),
                d = new GG(u, l, c, r.beforeDismiss);
              return (
                this._registerModalRef(d),
                this._registerWindowCmpt(u),
                d.hidden.pipe(De(1)).subscribe(() =>
                  Promise.resolve(!0).then(() => {
                    this._modalRefs.length ||
                      (s.removeClass(this._document.body, 'modal-open'),
                      this._restoreScrollBar(),
                      this._revertAriaHidden());
                  })
                ),
                (a.close = (f) => {
                  d.close(f);
                }),
                (a.dismiss = (f) => {
                  d.dismiss(f);
                }),
                this._applyWindowOptions(u.instance, r),
                1 === this._modalRefs.length && s.addClass(this._document.body, 'modal-open'),
                c && c.instance && (this._applyBackdropOptions(c.instance, r), c.changeDetectorRef.detectChanges()),
                u.changeDetectorRef.detectChanges(),
                d
              );
            }
            get activeInstances() {
              return this._activeInstances;
            }
            dismissAll(t) {
              this._modalRefs.forEach((i) => i.dismiss(t));
            }
            hasOpenModals() {
              return this._modalRefs.length > 0;
            }
            _attachBackdrop(t) {
              let i = uh(HG, { environmentInjector: this._applicationRef.injector, elementInjector: this._injector });
              return this._applicationRef.attachView(i.hostView), t.appendChild(i.location.nativeElement), i;
            }
            _attachWindowComponent(t, i) {
              let r = uh(UG, {
                environmentInjector: this._applicationRef.injector,
                elementInjector: this._injector,
                projectableNodes: i,
              });
              return this._applicationRef.attachView(r.hostView), t.appendChild(r.location.nativeElement), r;
            }
            _applyWindowOptions(t, i) {
              this._windowAttributes.forEach((r) => {
                Cr(i[r]) && (t[r] = i[r]);
              });
            }
            _applyBackdropOptions(t, i) {
              this._backdropAttributes.forEach((r) => {
                Cr(i[r]) && (t[r] = i[r]);
              });
            }
            _getContentRef(t, i, r, o) {
              return i
                ? i instanceof He
                  ? this._createFromTemplateRef(i, r)
                  : lg(i)
                  ? this._createFromString(i)
                  : this._createFromComponent(t, i, r, o)
                : new Er([]);
            }
            _createFromTemplateRef(t, i) {
              const o = t.createEmbeddedView({
                $implicit: i,
                close(s) {
                  i.close(s);
                },
                dismiss(s) {
                  i.dismiss(s);
                },
              });
              return this._applicationRef.attachView(o), new Er([o.rootNodes], o);
            }
            _createFromString(t) {
              const i = this._document.createTextNode(`${t}`);
              return new Er([[i]]);
            }
            _createFromComponent(t, i, r, o) {
              const s = pt.create({ providers: [{ provide: gN, useValue: r }], parent: t }),
                a = uh(i, { environmentInjector: this._applicationRef.injector, elementInjector: s }),
                l = a.location.nativeElement;
              return (
                o.scrollable && l.classList.add('component-host-scrollable'),
                this._applicationRef.attachView(a.hostView),
                new Er([[l]], a.hostView, a)
              );
            }
            _setAriaHidden(t) {
              const i = t.parentElement;
              i &&
                t !== this._document.body &&
                (Array.from(i.children).forEach((r) => {
                  r !== t &&
                    'SCRIPT' !== r.nodeName &&
                    (this._ariaHiddenValues.set(r, r.getAttribute('aria-hidden')),
                    r.setAttribute('aria-hidden', 'true'));
                }),
                this._setAriaHidden(i));
            }
            _revertAriaHidden() {
              this._ariaHiddenValues.forEach((t, i) => {
                t ? i.setAttribute('aria-hidden', t) : i.removeAttribute('aria-hidden');
              }),
                this._ariaHiddenValues.clear();
            }
            _registerModalRef(t) {
              const i = () => {
                const r = this._modalRefs.indexOf(t);
                r > -1 && (this._modalRefs.splice(r, 1), this._activeInstances.emit(this._modalRefs));
              };
              this._modalRefs.push(t), this._activeInstances.emit(this._modalRefs), t.result.then(i, i);
            }
            _registerWindowCmpt(t) {
              this._windowCmpts.push(t),
                this._activeWindowCmptHasChanged.next(),
                t.onDestroy(() => {
                  const i = this._windowCmpts.indexOf(t);
                  i > -1 && (this._windowCmpts.splice(i, 1), this._activeWindowCmptHasChanged.next());
                });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(Eo), N(pt), N(Xe), N($G), N(Dd), N(me));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        zG = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t), (this.backdrop = !0), (this.fullscreen = !1), (this.keyboard = !0);
            }
            get animation() {
              return void 0 === this._animation ? this._ngbConfig.animation : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(nu));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        KG = (() => {
          class e {
            constructor(t, i, r) {
              (this._injector = t), (this._modalStack = i), (this._config = r);
            }
            open(t, i = {}) {
              const r = { ...this._config, animation: this._config.animation, ...i };
              return this._modalStack.open(this._injector, t, r);
            }
            get activeInstances() {
              return this._modalStack.activeInstances;
            }
            dismissAll(t) {
              this._modalStack.dismissAll(t);
            }
            hasOpenModals() {
              return this._modalStack.hasOpenModals();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(pt), N(WG), N(zG));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        _N = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ providers: [KG] })),
            e
          );
        })(),
        bN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        MN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        IN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        AN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        RN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        PN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        xN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        FN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      new k('live announcer delay', {
        providedIn: 'root',
        factory: function sU() {
          return 100;
        },
      });
      let kN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze] })),
            e
          );
        })(),
        LN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({})),
            e
          );
        })();
      const aU = [qw, Qw, Jw, Zw, uN, pN, _N, bN, LN, MN, IN, AN, RN, PN, xN, FN, kN];
      let cu = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({ imports: [aU, qw, Qw, Jw, Zw, uN, pN, _N, bN, LN, MN, IN, AN, RN, PN, xN, FN, kN] })),
          e
        );
      })();
      const Ci_production = !0,
        Ci_version = '1.0.0',
        Ci_serverUrl = '',
        Ci_defaultLanguage = 'en-US',
        Ci_supportedLanguages = ['en-US', 'fr-FR'];
      let VN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [yr, Ze] })),
            e
          );
        })(),
        lU = (() => {
          class e {
            intercept(t, i) {
              return /^(http|https):/i.test(t.url) || (t = t.clone({ url: Ci_serverUrl + t.url })), i.handle(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      var wi = (() => {
        return (
          ((e = wi || (wi = {}))[(e.Off = 0)] = 'Off'),
          (e[(e.Error = 1)] = 'Error'),
          (e[(e.Warning = 2)] = 'Warning'),
          (e[(e.Info = 3)] = 'Info'),
          (e[(e.Debug = 4)] = 'Debug'),
          wi
        );
        var e;
      })();
      class dn {
        constructor(n) {
          this.source = n;
        }
        static enableProductionMode() {
          dn.level = wi.Warning;
        }
        debug(...n) {
          this.log(console.log, wi.Debug, n);
        }
        info(...n) {
          this.log(console.info, wi.Info, n);
        }
        warn(...n) {
          this.log(console.warn, wi.Warning, n);
        }
        error(...n) {
          this.log(console.error, wi.Error, n);
        }
        log(n, t, i) {
          if (t <= dn.level) {
            const r = this.source ? ['[' + this.source + ']'].concat(i) : i;
            n.apply(console, r), dn.outputs.forEach((o) => o.apply(o, [this.source, t, ...i]));
          }
        }
      }
      (dn.level = wi.Debug), (dn.outputs = []);
      const cU = new dn('ErrorHandlerInterceptor');
      let uU = (() => {
          class e {
            intercept(t, i) {
              return i.handle(t).pipe(qn((r) => this.errorHandler(r)));
            }
            errorHandler(t) {
              throw (Ci_production || cU.error('Request error', t), t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        dU = (() => {
          class e extends Ep {
            shouldDetach(t) {
              return !1;
            }
            store(t, i) {}
            shouldAttach(t) {
              return !1;
            }
            retrieve(t) {
              return null;
            }
            shouldReuseRoute(t, i) {
              return (
                t.routeConfig === i.routeConfig ||
                Boolean(t.routeConfig?.component && t.routeConfig?.component === i.routeConfig?.component)
              );
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (i) {
                return (n || (n = qe(e)))(i || e);
              };
            })()),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const fU = La,
        pU = Symbol('__destroy'),
        BN = Symbol('__decoratorApplied');
      function jN(e) {
        return 'string' == typeof e ? Symbol(`__destroy__${e}`) : pU;
      }
      function HN(e, n) {
        e[n] || (e[n] = new pe());
      }
      function GN(e, n) {
        e[n] && (e[n].next(), e[n].complete(), (e[n] = null));
      }
      function UN(e) {
        e instanceof Lt && e.unsubscribe();
      }
      function $N(e, n) {
        return function () {
          if (
            (e && e.call(this),
            GN(this, jN()),
            n.arrayName &&
              (function _U(e) {
                Array.isArray(e) && e.forEach(UN);
              })(this[n.arrayName]),
            n.checkProperties)
          )
            for (const t in this) n.blackList?.includes(t) || UN(this[t]);
        };
      }
      function WN(e = {}) {
        return (n) => {
          !(function hU(e) {
            return !!e[fU];
          })(n)
            ? (function mU(e, n) {
                e.prototype.ngOnDestroy = $N(e.prototype.ngOnDestroy, n);
              })(n, e)
            : (function vU(e, n) {
                const t = e.ɵpipe;
                t.onDestroy = $N(t.onDestroy, n);
              })(n, e),
            (function gU(e) {
              e.prototype[BN] = !0;
            })(n);
        };
      }
      function QN(e, n) {
        return (t) => {
          const i = jN(n);
          return (
            'string' == typeof n
              ? (function DU(e, n, t) {
                  const i = e[n];
                  HN(e, t),
                    (e[n] = function () {
                      i.apply(this, arguments), GN(this, t), (e[n] = i);
                    });
                })(e, n, i)
              : HN(e, i),
            t.pipe(tt(e[i]))
          );
        };
      }
      Symbol('CheckerHasBeenSet');
      let XN = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({ imports: [Ze, yr, cu] })),
          e
        );
      })();
      const CU = JSON.parse(
          '{"APP_NAME":"ngX-Rocket","About":"About","Hello world !":"Hello world !","Home":"Home","Logged in as":"Logged in as","Login":"Login","Logout":"Logout","Password":"Password","Password is required":"Password is required","Username":"Username","Username is required":"Username is required","Username or password incorrect.":"Username or password incorrect.","Remember me":"Remember me","Version":"Version"}'
        ),
        wU = JSON.parse(
          '{"APP_NAME":"ngX-Rocket","About":"A propos","Hello world !":"Bonjour le monde !","Home":"Accueil","Logged in as":"Connect\xe9 en tant que","Login":"Connexion","Logout":"D\xe9connexion","Password":"Mot de passe","Password is required":"Mot de passe requis","Username":"Identifiant","Username is required":"Identifiant requis","Username or password incorrect.":"Identifiant ou mot de passe incorrect.","Remember me":"Rester connect\xe9","Version":"Version"}'
        ),
        NU = new dn('I18nService'),
        YN = 'language';
      let JN = (() => {
        class e {
          constructor(t) {
            (this.translateService = t), t.setTranslation('en-US', CU), t.setTranslation('fr-FR', wU);
          }
          init(t, i) {
            (this.defaultLanguage = t),
              (this.supportedLanguages = i),
              (this.language = ''),
              (this.langChangeSubscription = this.translateService.onLangChange.subscribe((r) => {
                localStorage.setItem(YN, r.lang);
              }));
          }
          destroy() {
            this.langChangeSubscription && this.langChangeSubscription.unsubscribe();
          }
          set language(t) {
            let i = t || localStorage.getItem(YN) || this.translateService.getBrowserCultureLang() || '',
              r = this.supportedLanguages.includes(i);
            i &&
              !r &&
              ((i = i.split('-')[0]),
              (i = this.supportedLanguages.find((o) => o.startsWith(i)) || ''),
              (r = Boolean(i))),
              (!i || !r) && (i = this.defaultLanguage),
              NU.debug(`Language set to ${(t = i)}`),
              this.translateService.use(t);
          }
          get language() {
            return this.translateService.currentLang;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(Fo));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      function TU(e, n) {
        if ((1 & e && (T(0, 'a', 5), v(1), Ps(2, 'translate'), E()), 2 & e)) {
          const t = oe();
          F(1), $n('\n    ', xs(2, 1, t.currentLanguage), '\n  ');
        }
      }
      function EU(e, n) {
        if ((1 & e && (v(0, '\n    '), T(1, 'button', 6), v(2), E(), v(3, '\n  ')), 2 & e)) {
          const t = oe();
          F(2), $n('\n      ', t.currentLanguage, '\n    ');
        }
      }
      function SU(e, n) {
        if (1 & e) {
          const t = (function Dn() {
            return C();
          })();
          T(0, 'button', 7),
            fe('click', function () {
              const o = (function _n(e) {
                return (W.lFrame.contextLView = e), e[8];
              })(t).$implicit;
              return (function mn(e) {
                return (W.lFrame.contextLView = null), e;
              })(oe().setLanguage(o));
            }),
            v(1),
            Ps(2, 'translate'),
            E();
        }
        if (2 & e) {
          const t = n.$implicit;
          F(1), $n('\n      ', xs(2, 1, t), '\n    ');
        }
      }
      const MU = function (e) {
        return { 'nav-item': e };
      };
      let OU = (() => {
        class e {
          constructor(t) {
            (this.i18nService = t), (this.inNavbar = !1), (this.menuClass = '');
          }
          ngOnInit() {}
          setLanguage(t) {
            this.i18nService.language = t;
          }
          get currentLanguage() {
            return this.i18nService.language;
          }
          get languages() {
            return this.i18nService.supportedLanguages;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(JN));
          }),
          (e.ɵcmp = yt({
            type: e,
            selectors: [['app-language-selector']],
            inputs: { inNavbar: 'inNavbar', menuClass: 'menuClass' },
            decls: 13,
            vars: 7,
            consts: [
              ['ngbDropdown', '', 3, 'ngClass'],
              [
                'id',
                'language-dropdown',
                'class',
                'nav-link',
                'ngbDropdownToggle',
                '',
                'display',
                'dynamic',
                4,
                'ngIf',
                'ngIfElse',
              ],
              ['button', ''],
              ['ngbDropdownMenu', '', 'aria-labelledby', 'language-dropdown', 3, 'ngClass'],
              ['class', 'dropdown-item', 3, 'click', 4, 'ngFor', 'ngForOf'],
              ['id', 'language-dropdown', 'ngbDropdownToggle', '', 'display', 'dynamic', 1, 'nav-link'],
              ['id', 'language-dropdown', 'ngbDropdownToggle', '', 1, 'btn', 'btn-sm', 'btn-light'],
              [1, 'dropdown-item', 3, 'click'],
            ],
            template: function (t, i) {
              if (
                (1 & t &&
                  (T(0, 'div', 0),
                  v(1, '\n  '),
                  Q(2, TU, 3, 3, 'a', 1),
                  v(3, '\n  '),
                  Q(4, EU, 4, 1, 'ng-template', null, 2, Wn),
                  v(6, '\n  '),
                  T(7, 'div', 3),
                  v(8, '\n    '),
                  Q(9, SU, 3, 3, 'button', 4),
                  v(10, '\n  '),
                  E(),
                  v(11, '\n'),
                  E(),
                  v(12, '\n')),
                2 & t)
              ) {
                const r = (function Hn(e) {
                  return jr(
                    (function EE() {
                      return W.lFrame.contextLView;
                    })(),
                    22 + e
                  );
                })(5);
                j(
                  'ngClass',
                  (function Is(e, n, t, i) {
                    return I0(C(), It(), e, n, t, i);
                  })(5, MU, i.inNavbar)
                ),
                  F(2),
                  j('ngIf', i.inNavbar)('ngIfElse', r),
                  F(5),
                  j('ngClass', i.menuClass),
                  F(2),
                  j('ngForOf', i.languages);
              }
            },
            dependencies: [Yb, fr, hr, Ca, hN, gg, Cw],
            styles: ['.nav-link.dropdown-toggle[_ngcontent-%COMP%]{cursor:pointer}'],
          })),
          e
        );
      })();
      const Na = 'credentials';
      let ZN = (() => {
          class e {
            constructor() {
              this._credentials = null;
              const t = sessionStorage.getItem(Na) || localStorage.getItem(Na);
              t && (this._credentials = JSON.parse(t));
            }
            isAuthenticated() {
              return !!this.credentials;
            }
            get credentials() {
              return this._credentials;
            }
            setCredentials(t, i) {
              (this._credentials = t || null),
                t
                  ? (i ? localStorage : sessionStorage).setItem(Na, JSON.stringify(t))
                  : (sessionStorage.removeItem(Na), localStorage.removeItem(Na));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        IU = (() => {
          class e {
            constructor(t) {
              this.credentialsService = t;
            }
            login(t) {
              const i = { username: t.username, token: '123456' };
              return this.credentialsService.setCredentials(i, t.remember), P(i);
            }
            logout() {
              return this.credentialsService.setCredentials(), P(!0);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(ZN));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      const eT = new dn('Login');
      let Sr = class {
        constructor(n, t, i, r) {
          (this.router = n),
            (this.route = t),
            (this.formBuilder = i),
            (this.authenticationService = r),
            (this.version = Ci_version),
            (this.isLoading = !1),
            this.createForm();
        }
        ngOnInit() {}
        login() {
          (this.isLoading = !0),
            this.authenticationService
              .login(this.loginForm.value)
              .pipe(
                Xs(() => {
                  this.loginForm.markAsPristine(), (this.isLoading = !1);
                }),
                QN(this)
              )
              .subscribe(
                (t) => {
                  eT.debug(`${t.username} successfully logged in`),
                    this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: !0 });
                },
                (t) => {
                  eT.debug(`Login error: ${t}`), (this.error = t);
                }
              );
        }
        createForm() {
          this.loginForm = this.formBuilder.group({
            username: ['', OD.required],
            password: ['', OD.required],
            remember: !0,
          });
        }
      };
      (Sr.ɵfac = function (n) {
        return new (n || Sr)(_(ht), _(Hi), _(_L), _(IU));
      }),
        (Sr.ɵcmp = yt({
          type: Sr,
          selectors: [['app-login']],
          decls: 89,
          vars: 13,
          consts: [
            [1, 'login-container', 'bg-light'],
            [1, 'login-box'],
            ['translate', ''],
            [1, 'd-inline-block'],
            [1, 'd-inline-block', 'ml-3'],
            [1, 'container'],
            [1, 'card', 'col-md-6', 'mt-3', 'mx-auto'],
            [1, 'card-body'],
            [1, 'card-title', 'text-center'],
            [1, 'far', 'fa-3x', 'fa-user-circle', 'text-muted'],
            ['novalidate', '', 3, 'formGroup', 'ngSubmit'],
            ['translate', '', 1, 'alert', 'alert-danger', 3, 'hidden'],
            [1, 'm-3'],
            [1, 'd-block', 'my-3'],
            [
              'type',
              'text',
              'formControlName',
              'username',
              'autocomplete',
              'username',
              1,
              'form-control',
              3,
              'placeholder',
            ],
            ['hidden', '', 'translate', ''],
            ['translate', '', 1, 'text-danger', 3, 'hidden'],
            [1, 'd-block', 'mb-3'],
            [
              'type',
              'password',
              'formControlName',
              'password',
              'autocomplete',
              'current-password',
              'required',
              '',
              1,
              'form-control',
              3,
              'placeholder',
            ],
            [1, 'form-check'],
            [1, 'form-check-label'],
            ['type', 'checkbox', 'formControlName', 'remember', 1, 'form-check-input'],
            ['type', 'submit', 1, 'btn', 'btn-primary', 'w-100', 3, 'disabled'],
            [1, 'fas', 'fa-cog', 'fa-spin', 3, 'hidden'],
          ],
          template: function (n, t) {
            1 & n &&
              (T(0, 'div', 0),
              v(1, '\n  '),
              T(2, 'div', 1),
              v(3, '\n    '),
              T(4, 'h1', 2),
              v(5, 'APP_NAME'),
              E(),
              v(6, '\n    '),
              T(7, 'div'),
              v(8, '\n      '),
              T(9, 'h6', 3),
              v(10),
              E(),
              v(11, '\n      '),
              T(12, 'div', 4),
              v(13, '\n        '),
              gt(14, 'app-language-selector'),
              v(15, '\n      '),
              E(),
              v(16, '\n    '),
              E(),
              v(17, '\n    '),
              T(18, 'div', 5),
              v(19, '\n      '),
              T(20, 'div', 6),
              v(21, '\n        '),
              T(22, 'div', 7),
              v(23, '\n          '),
              T(24, 'h4', 8),
              v(25, '\n            '),
              gt(26, 'i', 9),
              v(27, '\n          '),
              E(),
              v(28, '\n          '),
              T(29, 'form', 10),
              fe('ngSubmit', function () {
                return t.login();
              }),
              v(30, '\n            '),
              T(31, 'div', 11),
              v(32, '\n              Username or password incorrect.\n            '),
              E(),
              v(33, '\n            '),
              T(34, 'div', 12),
              v(35, '\n              '),
              T(36, 'label', 13),
              v(37, '\n                '),
              gt(38, 'input', 14),
              Ps(39, 'translate'),
              v(40, '\n                '),
              T(41, 'span', 15),
              v(42, 'Username'),
              E(),
              v(43, '\n                '),
              T(44, 'small', 16),
              v(45, '\n                  Username is required\n                '),
              E(),
              v(46, '\n              '),
              E(),
              v(47, '\n              '),
              T(48, 'label', 17),
              v(49, '\n                '),
              gt(50, 'input', 18),
              Ps(51, 'translate'),
              v(52, '\n                '),
              T(53, 'span', 15),
              v(54, 'Password'),
              E(),
              v(55, '\n                '),
              T(56, 'small', 16),
              v(57, '\n                  Password is required\n                '),
              E(),
              v(58, '\n              '),
              E(),
              v(59, '\n              '),
              T(60, 'div', 19),
              v(61, '\n                '),
              T(62, 'label', 20),
              v(63, '\n                  '),
              gt(64, 'input', 21),
              v(65, '\n                  '),
              T(66, 'span', 2),
              v(67, 'Remember me'),
              E(),
              v(68, '\n                '),
              E(),
              v(69, '\n              '),
              E(),
              v(70, '\n            '),
              E(),
              v(71, '\n            '),
              T(72, 'div', 12),
              v(73, '\n              '),
              T(74, 'button', 22),
              v(75, '\n                '),
              gt(76, 'i', 23),
              v(77, '\n                '),
              T(78, 'span', 2),
              v(79, 'Login'),
              E(),
              v(80, '\n              '),
              E(),
              v(81, '\n            '),
              E(),
              v(82, '\n          '),
              E(),
              v(83, '\n        '),
              E(),
              v(84, '\n      '),
              E(),
              v(85, '\n    '),
              E(),
              v(86, '\n  '),
              E(),
              v(87, '\n'),
              E(),
              v(88, '\n')),
              2 & n &&
                (F(10),
                $n('v', t.version, ''),
                F(19),
                j('formGroup', t.loginForm),
                F(2),
                j('hidden', !t.error || t.isLoading),
                F(7),
                j('placeholder', xs(39, 9, 'Username')),
                F(6),
                j('hidden', t.loginForm.controls.username.valid || t.loginForm.controls.username.untouched),
                F(6),
                j('placeholder', xs(51, 11, 'Password')),
                F(6),
                j('hidden', t.loginForm.controls.password.valid || t.loginForm.controls.password.untouched),
                F(18),
                j('disabled', t.loginForm.invalid || t.isLoading),
                F(2),
                j('hidden', !t.isLoading));
          },
          dependencies: [g1, oc, Lh, JD, ZD, vc, mc, Zh, Dw, OU, Cw],
          styles: [
            '.login-container[_ngcontent-%COMP%]{position:absolute;inset:0}.login-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;min-height:100%}.ng-invalid.ng-touched[_ngcontent-%COMP%]:not(form){border-left:4px solid theme-color("danger")}.container[_ngcontent-%COMP%]{width:100%}',
          ],
        })),
        (Sr = Rg([WN()], Sr));
      const AU = [{ path: 'login', component: Sr, data: { title: 'Login' } }];
      let RU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [ln.forChild(AU), ln] })),
            e
          );
        })(),
        tT = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, F1, yr, cu, XN, RU] })),
            e
          );
        })();
      new dn('AuthenticationGuard');
      let xU = (() => {
        class e {
          constructor(t, i) {
            (this.router = t), (this.credentialsService = i);
          }
          canActivate(t, i) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(N(ht), N(ZN));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      let kU = (() => {
          class e {
            constructor(t) {
              this.httpClient = t;
            }
            getRandomQuote(t) {
              return this.httpClient.get(((e) => `/jokes/random?category=${e.category}`)(t)).pipe(
                L((i) => i.value),
                qn(() => P('Error, could not load joke :-('))
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(kp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        LU = (() => {
          class e {
            constructor(t) {
              this.httpClient = t;
            }
            getEvents() {
              return this.httpClient.get('/assets/data/events.json');
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(N(kp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      function VU(e, n) {
        if ((1 & e && (T(0, 'span', 8)(1, 'span', 9), v(2), E()()), 2 & e)) {
          const t = oe().$implicit;
          F(2), Il(t.time);
        }
      }
      function BU(e, n) {
        if (
          (1 & e &&
            (El(0),
            v(1, '\n      '),
            T(2, 'li'),
            v(3, '\n        '),
            T(4, 'div'),
            v(5, '\n          '),
            T(6, 'div', 4),
            v(7, '\n            '),
            T(8, 'span', 5),
            v(9),
            E(),
            v(10, '\n            '),
            Q(11, VU, 3, 1, 'span', 6),
            v(12, '\n          '),
            E(),
            v(13, '\n          '),
            gt(14, 'div', 7),
            v(15, '\n        '),
            E(),
            v(16, '\n      '),
            E(),
            v(17, '\n    '),
            Sl()),
          2 & e)
        ) {
          const t = n.$implicit,
            i = n.index,
            r = oe();
          F(4),
            (function ky(e, n, t) {
              wn(Kt, Un, lo(C(), e, n, t), !0);
            })('direction-', r.direction(i), ''),
            F(5),
            Il(t.title),
            F(2),
            j('ngIf', 0 != t.display),
            F(3),
            j('innerHTML', t.description, am);
        }
      }
      function jU(e, n) {
        1 & e &&
          (T(0, 'div'),
          v(1, '\n      '),
          v(2, '\n      '),
          T(3, 'li'),
          v(4, '\n        '),
          T(5, 'div', 10),
          v(6, '\n          '),
          T(7, 'div', 4),
          v(8, '\n            '),
          T(9, 'span', 5),
          v(10, 'Apple Inc.'),
          E(),
          v(11, '\n            '),
          T(12, 'span', 8)(13, 'span', 9),
          v(14, '2011 - 2013'),
          E()(),
          v(15, '\n          '),
          E(),
          v(16, '\n          '),
          T(17, 'div', 11),
          v(18, "My first employer. All the stuff I've learned and projects I've been working on."),
          E(),
          v(19, '\n        '),
          E(),
          v(20, '\n      '),
          E(),
          v(21, '\n\n      '),
          v(22, '\n      '),
          T(23, 'li'),
          v(24, '\n        '),
          T(25, 'div', 12),
          v(26, '\n          '),
          T(27, 'div', 4),
          v(28, '\n            '),
          T(29, 'span', 5),
          v(30, 'Harvard University'),
          E(),
          v(31, '\n            '),
          T(32, 'span', 8)(33, 'span', 9),
          v(34, '2008 - 2011'),
          E()(),
          v(35, '\n          '),
          E(),
          v(36, '\n          '),
          T(37, 'div', 11),
          v(38, 'A description of all the lectures and courses I have taken and my final degree?'),
          E(),
          v(39, '\n        '),
          E(),
          v(40, '\n      '),
          E(),
          v(41, '\n    '),
          E());
      }
      let HU = (() => {
          class e {
            constructor() {
              this.events = [];
            }
            direction(t) {
              return t % 2 ? 'r' : 'l';
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [['app-series']],
              inputs: { events: 'events' },
              decls: 12,
              vars: 2,
              consts: [
                [1, 'mybody'],
                [1, 'timeline'],
                [4, 'ngFor', 'ngForOf'],
                [4, 'ngIf'],
                [1, 'flag-wrapper'],
                [1, 'flag'],
                ['class', 'time-wrapper', 4, 'ngIf'],
                [1, 'desc', 3, 'innerHTML'],
                [1, 'time-wrapper'],
                [1, 'time'],
                [1, 'direction-l'],
                [1, 'desc'],
                [1, 'direction-r'],
              ],
              template: function (t, i) {
                1 & t &&
                  (T(0, 'div', 0),
                  v(1, '\n  '),
                  v(2, '\n\n  '),
                  T(3, 'ul', 1),
                  v(4, '\n    '),
                  v(5, '\n    '),
                  Q(6, BU, 18, 6, 'ng-container', 2),
                  v(7, '\n    '),
                  Q(8, jU, 42, 0, 'div', 3),
                  v(9, '\n  '),
                  E(),
                  v(10, '\n'),
                  E(),
                  v(11, '\n')),
                  2 & t && (F(6), j('ngForOf', i.events), F(2), j('ngIf', !1));
              },
              dependencies: [fr, hr],
              styles: [
                '.mybody[_ngcontent-%COMP%]{margin:0;padding:0;background:rgb(230,230,230);color:#323232;font-family:Open Sans,sans-serif;font-size:112.5%;line-height:1.6em}.timeline[_ngcontent-%COMP%]{position:relative;width:660px;margin:20px auto 0;padding:1em 0;list-style-type:none}.timeline[_ngcontent-%COMP%]:before{position:absolute;left:50%;top:0;content:" ";display:block;width:6px;height:100%;margin-left:-3px;background:rgb(80,80,80);background:linear-gradient(to bottom,rgba(80,80,80,0) 0%,rgb(80,80,80) 8%,rgb(80,80,80) 92%,rgba(80,80,80,0) 100%);z-index:5}.timeline[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding:1em 0}.timeline[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:after{content:"";display:block;height:0;clear:both;visibility:hidden}.direction-l[_ngcontent-%COMP%]{position:relative;width:300px;float:left;text-align:right}.direction-r[_ngcontent-%COMP%]{position:relative;width:300px;float:right}.flag-wrapper[_ngcontent-%COMP%]{position:relative;display:inline-block;text-align:center}.flag[_ngcontent-%COMP%]{position:relative;display:inline;background:rgb(248,248,248);padding:6px 10px;border-radius:5px;font-weight:600;text-align:left}.direction-l[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]{box-shadow:-1px 1px 1px #00000026,0 0 1px #00000026}.direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]{box-shadow:1px 1px 1px #00000026,0 0 1px #00000026}.direction-l[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:before, .direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:before{position:absolute;top:50%;right:-40px;content:" ";display:block;width:12px;height:12px;margin-top:-10px;background:#fff;border-radius:10px;border:4px solid rgb(255,80,80);z-index:10}.direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:before{left:-40px}.direction-l[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:after{content:"";position:absolute;left:100%;top:50%;height:0;width:0;margin-top:-8px;border:solid transparent;border-left-color:#f8f8f8;border-width:8px;pointer-events:none}.direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:after{content:"";position:absolute;right:100%;top:50%;height:0;width:0;margin-top:-8px;border:solid transparent;border-right-color:#f8f8f8;border-width:8px;pointer-events:none}.time-wrapper[_ngcontent-%COMP%]{display:inline;line-height:1em;font-size:.66666em;color:#fa5050;vertical-align:middle}.direction-l[_ngcontent-%COMP%]   .time-wrapper[_ngcontent-%COMP%]{float:left}.direction-r[_ngcontent-%COMP%]   .time-wrapper[_ngcontent-%COMP%]{float:right}.time[_ngcontent-%COMP%]{display:inline-block;padding:4px 6px;background:rgb(248,248,248)}.desc[_ngcontent-%COMP%]{margin:1em .75em 0 0;font-size:.77777em;font-style:italic;line-height:1.5em}.direction-r[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{margin:1em 0 0 .75em}@media screen and (max-width: 660px){.timeline[_ngcontent-%COMP%]{width:100%;padding:4em 0 1em}.timeline[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding:2em 0}.direction-l[_ngcontent-%COMP%], .direction-r[_ngcontent-%COMP%]{float:none;width:100%;text-align:center}.flag-wrapper[_ngcontent-%COMP%]{text-align:center}.flag[_ngcontent-%COMP%]{background:rgb(255,255,255);z-index:15}.direction-l[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:before, .direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:before{position:absolute;top:-30px;left:50%;content:" ";display:block;width:12px;height:12px;margin-left:-9px;background:#fff;border-radius:10px;border:4px solid rgb(255,80,80);z-index:10}.direction-l[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:after, .direction-r[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%]:after{content:"";position:absolute;left:50%;top:-8px;height:0;width:0;margin-left:-8px;border:solid transparent;border-bottom-color:#fff;border-width:8px;pointer-events:none}.time-wrapper[_ngcontent-%COMP%]{display:block;position:relative;margin:4px 0 0;z-index:14}.direction-l[_ngcontent-%COMP%]   .time-wrapper[_ngcontent-%COMP%], .direction-r[_ngcontent-%COMP%]   .time-wrapper[_ngcontent-%COMP%]{float:none}.desc[_ngcontent-%COMP%]{position:relative;margin:1em 0 0;padding:1em;background:rgb(245,245,245);box-shadow:0 0 1px #0003;z-index:15}.direction-l[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%], .direction-r[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{position:relative;margin:1em 1em 0;padding:1em;z-index:15}}@media screen and (min-width: 400px) and (max-width: 660px){.direction-l[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%], .direction-r[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{margin:1em 4em 0}}',
              ],
            })),
            e
          );
        })(),
        GU = (() => {
          class e {
            constructor(t, i) {
              (this.quoteService = t), (this.eventService = i), (this.isLoading = !1), (this.events = []);
            }
            ngOnInit() {
              (this.isLoading = !0),
                this.quoteService
                  .getRandomQuote({ category: 'dev' })
                  .pipe(
                    Xs(() => {
                      this.isLoading = !1;
                    })
                  )
                  .subscribe((t) => {
                    this.quote = t;
                  }),
                this.eventService.getEvents().subscribe((t) => {
                  this.events = t.sort((i, r) => i.time - r.time);
                });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(kU), _(LU));
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [['app-home']],
              decls: 11,
              vars: 1,
              consts: [
                [1, 'container-fluid'],
                [1, 'jumbotron', 'text-center'],
                [3, 'events'],
              ],
              template: function (t, i) {
                1 & t &&
                  (T(0, 'div', 0),
                  v(1, '\n  '),
                  T(2, 'div', 1),
                  v(3, '\n    '),
                  gt(4, 'h1'),
                  v(5, '\n    '),
                  gt(6, 'app-series', 2),
                  v(7, '\n    '),
                  v(8, '\n  '),
                  E(),
                  v(9, '\n'),
                  E(),
                  v(10, '\n')),
                  2 & t && (F(6), j('events', i.events));
              },
              dependencies: [HU],
              styles: [
                '@charset "UTF-8";.logo[_ngcontent-%COMP%]{width:100px}q[_ngcontent-%COMP%]{font-style:italic;font-size:1.2rem;quotes:"\\ab  " " \\bb"}',
              ],
            })),
            e
          );
        })(),
        UU = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [['app-shell']],
              decls: 3,
              vars: 0,
              template: function (t, i) {
                1 & t && (v(0, '\n'), gt(1, 'router-outlet'), v(2, '\n'));
              },
              dependencies: [Rc],
            })),
            e
          );
        })();
      class nT {
        static childRoutes(n) {
          return { path: '', component: UU, children: n, canActivate: [xU] };
        }
      }
      const $U = [
        nT.childRoutes([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'home', component: GU, data: { title: 'Home' } },
        ]),
      ];
      let WU = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = K({ type: e })),
          (e.ɵinj = $({ imports: [ln.forChild($U), ln] })),
          e
        );
      })();
      const zU = [];
      let KU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [ln.forChild(zU), ln] })),
            e
          );
        })(),
        qU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, KU] })),
            e
          );
        })(),
        QU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, yr, VN, WU, qU] })),
            e
          );
        })(),
        XU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, yr, cu, tT, XN, ln] })),
            e
          );
        })();
      const JU = [
        nT.childRoutes([
          {
            path: 'about',
            component: (() => {
              class e {
                constructor() {
                  this.version = Ci_version;
                }
                ngOnInit() {}
              }
              return (
                (e.ɵfac = function (t) {
                  return new (t || e)();
                }),
                (e.ɵcmp = yt({
                  type: e,
                  selectors: [['app-about']],
                  decls: 19,
                  vars: 1,
                  consts: [
                    [1, 'container-fluid'],
                    [1, 'jumbotron', 'text-center'],
                    ['translate', ''],
                    [1, 'far', 'fa-bookmark'],
                  ],
                  template: function (t, i) {
                    1 & t &&
                      (T(0, 'div', 0),
                      v(1, '\n  '),
                      T(2, 'div', 1),
                      v(3, '\n    '),
                      T(4, 'h1'),
                      v(5, '\n      '),
                      T(6, 'span', 2),
                      v(7, 'APP_NAME'),
                      E(),
                      v(8, '\n    '),
                      E(),
                      v(9, '\n    '),
                      T(10, 'p'),
                      gt(11, 'i', 3),
                      v(12, ' '),
                      T(13, 'span', 2),
                      v(14, 'Version'),
                      E(),
                      v(15),
                      E(),
                      v(16, '\n  '),
                      E(),
                      v(17, '\n'),
                      E(),
                      v(18, '\n')),
                      2 & t && (F(15), $n(' ', i.version, ''));
                  },
                  dependencies: [Dw],
                })),
                e
              );
            })(),
            data: { title: 'About' },
          },
        ]),
      ];
      let ZU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [ln.forChild(JU), ln] })),
            e
          );
        })(),
        e$ = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [Ze, yr, ZU] })),
            e
          );
        })();
      const t$ = new dn('App');
      let Mr = class {
        constructor(n, t, i, r, o) {
          (this.router = n),
            (this.activatedRoute = t),
            (this.titleService = i),
            (this.translateService = r),
            (this.i18nService = o);
        }
        ngOnInit() {
          Ci_production && dn.enableProductionMode(),
            t$.debug('init'),
            this.i18nService.init(Ci_defaultLanguage, Ci_supportedLanguages);
          const n = this.router.events.pipe(Oe((t) => t instanceof ji));
          Ra(this.translateService.onLangChange, n)
            .pipe(
              L(() => {
                let t = this.activatedRoute;
                for (; t.firstChild; ) t = t.firstChild;
                return t;
              }),
              Oe((t) => 'primary' === t.outlet),
              st((t) => t.data),
              QN(this)
            )
            .subscribe((t) => {
              const i = t.title;
              i && this.titleService.setTitle(this.translateService.instant(i));
            });
        }
        ngOnDestroy() {
          this.i18nService.destroy();
        }
      };
      (Mr.ɵfac = function (n) {
        return new (n || Mr)(_(ht), _(Hi), _(xh), _(Fo), _(JN));
      }),
        (Mr.ɵcmp = yt({
          type: Mr,
          selectors: [['app-root']],
          decls: 2,
          vars: 0,
          template: function (n, t) {
            1 & n && (gt(0, 'router-outlet'), v(1, '\n'));
          },
          dependencies: [Rc],
        })),
        (Mr = Rg([WN()], Mr));
      const n$ = [{ path: '**', redirectTo: '', pathMatch: 'full' }];
      let i$ = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e })),
            (e.ɵinj = $({ imports: [ln.forRoot(n$, { useHash: !0 }), ln] })),
            e
          );
        })(),
        r$ = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = K({ type: e, bootstrap: [Mr] })),
            (e.ɵinj = $({
              providers: [
                { provide: $c, useClass: lU, multi: !0 },
                { provide: $c, useClass: uU, multi: !0 },
                { provide: Ep, useClass: dU },
              ],
              imports: [
                rk,
                DB.register('./ngsw-worker.js', { enabled: Ci_production }),
                x1,
                Z2,
                ln,
                yr.forRoot(),
                cu,
                VN,
                XU,
                QU,
                e$,
                tT,
                i$,
              ],
            })),
            e
          );
        })();
      Ci_production &&
        (function WP() {
          Tb = !1;
        })(),
        ik()
          .bootstrapModule(r$)
          .catch((e) => console.error(e));
    },
  },
  (te) => {
    te((te.s = 74));
  },
]);
