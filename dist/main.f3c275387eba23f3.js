'use strict';
(self.webpackChunkng_x_rocket = self.webpackChunkng_x_rocket || []).push([
  [179],
  {
    63: () => {
      function te(e) {
        return 'function' == typeof e;
      }
      function $o(e) {
        const t = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (t.prototype = Object.create(Error.prototype)), (t.prototype.constructor = t), t;
      }
      const Oa = $o(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join('\n  ')}`
                : ''),
              (this.name = 'UnsubscriptionError'),
              (this.errors = t);
          }
      );
      function Ai(e, n) {
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
            const { initialTeardown: r } = this;
            if (te(r))
              try {
                r();
              } catch (o) {
                n = o instanceof Oa ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Og(o);
                } catch (s) {
                  (n = n ?? []), s instanceof Oa ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new Oa(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) Og(n);
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
          t === n ? (this._parentage = null) : Array.isArray(t) && Ai(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && Ai(t, n), n instanceof Lt && n._removeParent(this);
        }
      }
      Lt.EMPTY = (() => {
        const e = new Lt();
        return (e.closed = !0), e;
      })();
      const Sg = Lt.EMPTY;
      function Mg(e) {
        return e instanceof Lt || (e && 'closed' in e && te(e.remove) && te(e.add) && te(e.unsubscribe));
      }
      function Og(e) {
        te(e) ? e() : e.unsubscribe();
      }
      const qr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Aa = {
          setTimeout(e, n, ...t) {
            const { delegate: r } = Aa;
            return r?.setTimeout ? r.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = Aa;
            return (n?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Ag(e) {
        Aa.setTimeout(() => {
          const { onUnhandledError: n } = qr;
          if (!n) throw e;
          n(e);
        });
      }
      function Ii() {}
      const hT = _u('C', void 0, void 0);
      function _u(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let Qr = null;
      function Ia(e) {
        if (qr.useDeprecatedSynchronousErrorHandling) {
          const n = !Qr;
          if ((n && (Qr = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: r } = Qr;
            if (((Qr = null), t)) throw r;
          }
        } else e();
      }
      class mu extends Lt {
        constructor(n) {
          super(), (this.isStopped = !1), n ? ((this.destination = n), Mg(n) && n.add(this)) : (this.destination = bT);
        }
        static create(n, t, r) {
          return new Wo(n, t, r);
        }
        next(n) {
          this.isStopped
            ? yu(
                (function gT(e) {
                  return _u('N', e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? yu(
                (function pT(e) {
                  return _u('E', void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped ? yu(hT, this) : ((this.isStopped = !0), this._complete());
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
      const mT = Function.prototype.bind;
      function vu(e, n) {
        return mT.call(e, n);
      }
      class vT {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (r) {
              Ra(r);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (r) {
              Ra(r);
            }
          else Ra(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              Ra(t);
            }
        }
      }
      class Wo extends mu {
        constructor(n, t, r) {
          let i;
          if ((super(), te(n) || !n)) i = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
          else {
            let o;
            this && qr.useDeprecatedNextContext
              ? ((o = Object.create(n)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: n.next && vu(n.next, o),
                  error: n.error && vu(n.error, o),
                  complete: n.complete && vu(n.complete, o),
                }))
              : (i = n);
          }
          this.destination = new vT(i);
        }
      }
      function Ra(e) {
        qr.useDeprecatedSynchronousErrorHandling
          ? (function _T(e) {
              qr.useDeprecatedSynchronousErrorHandling && Qr && ((Qr.errorThrown = !0), (Qr.error = e));
            })(e)
          : Ag(e);
      }
      function yu(e, n) {
        const { onStoppedNotification: t } = qr;
        t && Aa.setTimeout(() => t(e, n));
      }
      const bT = {
          closed: !0,
          next: Ii,
          error: function yT(e) {
            throw e;
          },
          complete: Ii,
        },
        bu = ('function' == typeof Symbol && Symbol.observable) || '@@observable';
      function Zn(e) {
        return e;
      }
      function Ig(e) {
        return 0 === e.length
          ? Zn
          : 1 === e.length
          ? e[0]
          : function (t) {
              return e.reduce((r, i) => i(r), t);
            };
      }
      let he = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const r = new e();
            return (r.source = this), (r.operator = t), r;
          }
          subscribe(t, r, i) {
            const o = (function CT(e) {
              return (
                (e && e instanceof mu) ||
                ((function wT(e) {
                  return e && te(e.next) && te(e.error) && te(e.complete);
                })(e) &&
                  Mg(e))
              );
            })(t)
              ? t
              : new Wo(t, r, i);
            return (
              Ia(() => {
                const { operator: s, source: a } = this;
                o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
              }),
              o
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (r) {
              t.error(r);
            }
          }
          forEach(t, r) {
            return new (r = Rg(r))((i, o) => {
              const s = new Wo({
                next: (a) => {
                  try {
                    t(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var r;
            return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(t);
          }
          [bu]() {
            return this;
          }
          pipe(...t) {
            return Ig(t)(this);
          }
          toPromise(t) {
            return new (t = Rg(t))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function Rg(e) {
        var n;
        return null !== (n = e ?? qr.Promise) && void 0 !== n ? n : Promise;
      }
      const NT = $o(
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
            const r = new Pg(this, this);
            return (r.operator = t), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new NT();
          }
          next(t) {
            Ia(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers || (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(t);
              }
            });
          }
          error(t) {
            Ia(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(t);
              }
            });
          }
          complete() {
            Ia(() => {
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
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? Sg
              : ((this.currentObservers = null),
                o.push(t),
                new Lt(() => {
                  (this.currentObservers = null), Ai(o, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? t.error(i) : o && t.complete();
          }
          asObservable() {
            const t = new he();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new Pg(n, t)), e;
      })();
      class Pg extends pe {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, r;
          null === (r = null === (t = this.destination) || void 0 === t ? void 0 : t.next) ||
            void 0 === r ||
            r.call(t, n);
        }
        error(n) {
          var t, r;
          null === (r = null === (t = this.destination) || void 0 === t ? void 0 : t.error) ||
            void 0 === r ||
            r.call(t, n);
        }
        complete() {
          var n, t;
          null === (t = null === (n = this.destination) || void 0 === n ? void 0 : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, r;
          return null !== (r = null === (t = this.source) || void 0 === t ? void 0 : t.subscribe(n)) && void 0 !== r
            ? r
            : Sg;
        }
      }
      function xg(e) {
        return te(e?.lift);
      }
      function Re(e) {
        return (n) => {
          if (xg(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError('Unable to lift unknown Observable type');
        };
      }
      function Ce(e, n, t, r, i) {
        return new TT(e, n, t, r, i);
      }
      class TT extends mu {
        constructor(n, t, r, i, o, s) {
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
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    n.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
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
        return Re((t, r) => {
          let i = 0;
          t.subscribe(
            Ce(r, (o) => {
              r.next(e.call(n, o, i++));
            })
          );
        });
      }
      function kg(e, n, t, r) {
        var s,
          i = arguments.length,
          o = i < 3 ? n : null === r ? (r = Object.getOwnPropertyDescriptor(n, t)) : r;
        if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) o = Reflect.decorate(e, n, t, r);
        else
          for (var a = e.length - 1; a >= 0; a--)
            (s = e[a]) && (o = (i < 3 ? s(o) : i > 3 ? s(n, t, o) : s(n, t)) || o);
        return i > 3 && o && Object.defineProperty(n, t, o), o;
      }
      function Xr(e) {
        return this instanceof Xr ? ((this.v = e), this) : new Xr(e);
      }
      function MT(e, n, t) {
        if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
        var i,
          r = t.apply(e, n || []),
          o = [];
        return (
          (i = {}),
          s('next'),
          s('throw'),
          s('return'),
          (i[Symbol.asyncIterator] = function () {
            return this;
          }),
          i
        );
        function s(f) {
          r[f] &&
            (i[f] = function (h) {
              return new Promise(function (p, g) {
                o.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function l(f) {
              f.value instanceof Xr ? Promise.resolve(f.value.v).then(c, u) : d(o[0][2], f);
            })(r[f](h));
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
      function OT(e) {
        if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function Vg(e) {
              var n = 'function' == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                r = 0;
              if (t) return t.call(e);
              if (e && 'number' == typeof e.length)
                return {
                  next: function () {
                    return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
                  },
                };
              throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
            })(e)),
            (t = {}),
            r('next'),
            r('throw'),
            r('return'),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(o) {
          t[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (c) {
                    o({ value: c, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const wu = (e) => e && 'number' == typeof e.length && 'function' != typeof e;
      function Bg(e) {
        return te(e?.then);
      }
      function Hg(e) {
        return te(e[bu]);
      }
      function jg(e) {
        return Symbol.asyncIterator && te(e?.[Symbol.asyncIterator]);
      }
      function Gg(e) {
        return new TypeError(
          `You provided ${
            null !== e && 'object' == typeof e ? 'an invalid object' : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Ug = (function IT() {
        return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
      })();
      function $g(e) {
        return te(e?.[Ug]);
      }
      function Wg(e) {
        return MT(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield Xr(t.read());
              if (i) return yield Xr(void 0);
              yield yield Xr(r);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function zg(e) {
        return te(e?.getReader);
      }
      function ft(e) {
        if (e instanceof he) return e;
        if (null != e) {
          if (Hg(e))
            return (function RT(e) {
              return new he((n) => {
                const t = e[bu]();
                if (te(t.subscribe)) return t.subscribe(n);
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
              });
            })(e);
          if (wu(e))
            return (function PT(e) {
              return new he((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (Bg(e))
            return (function xT(e) {
              return new he((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, Ag);
              });
            })(e);
          if (jg(e)) return Kg(e);
          if ($g(e))
            return (function FT(e) {
              return new he((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (zg(e))
            return (function kT(e) {
              return Kg(Wg(e));
            })(e);
        }
        throw Gg(e);
      }
      function Kg(e) {
        return new he((n) => {
          (function LT(e, n) {
            var t, r, i, o;
            return (function ET(e, n, t, r) {
              return new (t || (t = Promise))(function (o, s) {
                function a(u) {
                  try {
                    c(r.next(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(u) {
                  try {
                    c(r.throw(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(u) {
                  u.done
                    ? o(u.value)
                    : (function i(o) {
                        return o instanceof t
                          ? o
                          : new t(function (s) {
                              s(o);
                            });
                      })(u.value).then(a, l);
                }
                c((r = r.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = OT(e); !(r = yield t.next()).done; ) if ((n.next(r.value), n.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = t.return) && (yield o.call(t));
                } finally {
                  if (i) throw i.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function er(e, n, t, r = 0, i = !1) {
        const o = n.schedule(function () {
          t(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function Ue(e, n, t = 1 / 0) {
        return te(n)
          ? Ue((r, i) => L((o, s) => n(r, o, i, s))(ft(e(r, i))), t)
          : ('number' == typeof n && (t = n),
            Re((r, i) =>
              (function VT(e, n, t, r, i, o, s, a) {
                const l = [];
                let c = 0,
                  u = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !c && n.complete();
                  },
                  h = (g) => (c < r ? p(g) : l.push(g)),
                  p = (g) => {
                    o && n.next(g), c++;
                    let v = !1;
                    ft(t(g, u++)).subscribe(
                      Ce(
                        n,
                        (y) => {
                          i?.(y), o ? h(y) : n.next(y);
                        },
                        () => {
                          v = !0;
                        },
                        void 0,
                        () => {
                          if (v)
                            try {
                              for (c--; l.length && c < r; ) {
                                const y = l.shift();
                                s ? er(n, s, () => p(y)) : p(y);
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
              })(r, i, e, t)
            ));
      }
      function Ri(e = 1 / 0) {
        return Ue(Zn, e);
      }
      const Jt = new he((e) => e.complete());
      function qg(e) {
        return e && te(e.schedule);
      }
      function Cu(e) {
        return e[e.length - 1];
      }
      function Pa(e) {
        return te(Cu(e)) ? e.pop() : void 0;
      }
      function zo(e) {
        return qg(Cu(e)) ? e.pop() : void 0;
      }
      function Qg(e, n = 0) {
        return Re((t, r) => {
          t.subscribe(
            Ce(
              r,
              (i) => er(r, e, () => r.next(i), n),
              () => er(r, e, () => r.complete(), n),
              (i) => er(r, e, () => r.error(i), n)
            )
          );
        });
      }
      function Xg(e, n = 0) {
        return Re((t, r) => {
          r.add(e.schedule(() => t.subscribe(r), n));
        });
      }
      function Yg(e, n) {
        if (!e) throw new Error('Iterable cannot be null');
        return new he((t) => {
          er(t, n, () => {
            const r = e[Symbol.asyncIterator]();
            er(
              t,
              n,
              () => {
                r.next().then((i) => {
                  i.done ? t.complete() : t.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function $e(e, n) {
        return n
          ? (function zT(e, n) {
              if (null != e) {
                if (Hg(e))
                  return (function jT(e, n) {
                    return ft(e).pipe(Xg(n), Qg(n));
                  })(e, n);
                if (wu(e))
                  return (function UT(e, n) {
                    return new he((t) => {
                      let r = 0;
                      return n.schedule(function () {
                        r === e.length ? t.complete() : (t.next(e[r++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (Bg(e))
                  return (function GT(e, n) {
                    return ft(e).pipe(Xg(n), Qg(n));
                  })(e, n);
                if (jg(e)) return Yg(e, n);
                if ($g(e))
                  return (function $T(e, n) {
                    return new he((t) => {
                      let r;
                      return (
                        er(t, n, () => {
                          (r = e[Ug]()),
                            er(
                              t,
                              n,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                o ? t.complete() : t.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => te(r?.return) && r.return()
                      );
                    });
                  })(e, n);
                if (zg(e))
                  return (function WT(e, n) {
                    return Yg(Wg(e), n);
                  })(e, n);
              }
              throw Gg(e);
            })(e, n)
          : ft(e);
      }
      function xa(...e) {
        const n = zo(e),
          t = (function HT(e, n) {
            return 'number' == typeof Cu(e) ? e.pop() : n;
          })(e, 1 / 0),
          r = e;
        return r.length ? (1 === r.length ? ft(r[0]) : Ri(t)($e(r, n))) : Jt;
      }
      function Jg(e = {}) {
        const {
          connector: n = () => new pe(),
          resetOnError: t = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: i = !0,
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
          return Re((g, v) => {
            c++, !d && !u && f();
            const y = (l = l ?? n());
            v.add(() => {
              c--, 0 === c && !d && !u && (a = Nu(p, i));
            }),
              y.subscribe(v),
              !s &&
                c > 0 &&
                ((s = new Wo({
                  next: (D) => y.next(D),
                  error: (D) => {
                    (d = !0), f(), (a = Nu(h, t, D)), y.error(D);
                  },
                  complete: () => {
                    (u = !0), f(), (a = Nu(h, r)), y.complete();
                  },
                })),
                ft(g).subscribe(s));
          })(o);
        };
      }
      function Nu(e, n, ...t) {
        if (!0 === n) return void e();
        if (!1 === n) return;
        const r = new Wo({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return n(...t).subscribe(r);
      }
      function ye(e) {
        for (let n in e) if (e[n] === ye) return n;
        throw Error('Could not find renamed property on target object.');
      }
      function Tu(e, n) {
        for (const t in n) n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
      }
      function be(e) {
        if ('string' == typeof e) return e;
        if (Array.isArray(e)) return '[' + e.map(be).join(', ') + ']';
        if (null == e) return '' + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return '' + n;
        const t = n.indexOf('\n');
        return -1 === t ? n : n.substring(0, t);
      }
      function Eu(e, n) {
        return null == e || '' === e ? (null === n ? '' : n) : null == n || '' === n ? e : e + ' ' + n;
      }
      const KT = ye({ __forward_ref__: ye });
      function ae(e) {
        return (
          (e.__forward_ref__ = ae),
          (e.toString = function () {
            return be(this());
          }),
          e
        );
      }
      function U(e) {
        return Su(e) ? e() : e;
      }
      function Su(e) {
        return 'function' == typeof e && e.hasOwnProperty(KT) && e.__forward_ref__ === ae;
      }
      class S extends Error {
        constructor(n, t) {
          super(
            (function Fa(e, n) {
              return `NG0${Math.abs(e)}${n ? ': ' + n.trim() : ''}`;
            })(n, t)
          ),
            (this.code = n);
        }
      }
      function W(e) {
        return 'string' == typeof e ? e : null == e ? '' : String(e);
      }
      function ka(e, n) {
        throw new S(-201, !1);
      }
      function Gt(e, n) {
        null == e &&
          (function de(e, n, t, r) {
            throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? '' : ` [Expected=> ${t} ${r} ${n} <=Actual]`));
          })(n, e, null, '!=');
      }
      function M(e) {
        return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
      }
      function K(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Mu(e) {
        return Zg(e, La) || Zg(e, t_);
      }
      function Zg(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function e_(e) {
        return e && (e.hasOwnProperty(Ou) || e.hasOwnProperty(tE)) ? e[Ou] : null;
      }
      const La = ye({ ɵprov: ye }),
        Ou = ye({ ɵinj: ye }),
        t_ = ye({ ngInjectableDef: ye }),
        tE = ye({ ngInjectorDef: ye });
      var B = (() => (
        ((B = B || {})[(B.Default = 0)] = 'Default'),
        (B[(B.Host = 1)] = 'Host'),
        (B[(B.Self = 2)] = 'Self'),
        (B[(B.SkipSelf = 4)] = 'SkipSelf'),
        (B[(B.Optional = 8)] = 'Optional'),
        B
      ))();
      let Au;
      function Zt(e) {
        const n = Au;
        return (Au = e), n;
      }
      function n_(e, n, t) {
        const r = Mu(e);
        return r && 'root' == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : t & B.Optional
          ? null
          : void 0 !== n
          ? n
          : void ka(be(e));
      }
      function Nr(e) {
        return { toString: e }.toString();
      }
      var dn = (() => (((dn = dn || {})[(dn.OnPush = 0)] = 'OnPush'), (dn[(dn.Default = 1)] = 'Default'), dn))(),
        xn = (() => {
          return (
            ((e = xn || (xn = {}))[(e.Emulated = 0)] = 'Emulated'),
            (e[(e.None = 2)] = 'None'),
            (e[(e.ShadowDom = 3)] = 'ShadowDom'),
            xn
          );
          var e;
        })();
      const ge = (() =>
          (typeof globalThis < 'u' && globalThis) ||
          (typeof global < 'u' && global) ||
          (typeof window < 'u' && window) ||
          (typeof self < 'u' && typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope && self))(),
        Pi = {},
        ce = [],
        Va = ye({ ɵcmp: ye }),
        Iu = ye({ ɵdir: ye }),
        Ba = ye({ ɵpipe: ye }),
        r_ = ye({ ɵmod: ye }),
        nr = ye({ ɵfac: ye }),
        Ko = ye({ __NG_ELEMENT_ID__: ye });
      let rE = 0;
      function gt(e) {
        return Nr(() => {
          const t = !0 === e.standalone,
            r = {},
            i = {
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
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === dn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: t,
              dependencies: (t && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || ce,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || xn.Emulated,
              id: 'c' + rE++,
              styles: e.styles || ce,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            o = e.dependencies,
            s = e.features;
          return (
            (i.inputs = s_(e.inputs, r)),
            (i.outputs = s_(e.outputs)),
            s && s.forEach((a) => a(i)),
            (i.directiveDefs = o ? () => ('function' == typeof o ? o() : o).map(i_).filter(o_) : null),
            (i.pipeDefs = o ? () => ('function' == typeof o ? o() : o).map(At).filter(o_) : null),
            i
          );
        });
      }
      function i_(e) {
        return _e(e) || Ot(e);
      }
      function o_(e) {
        return null !== e;
      }
      function q(e) {
        return Nr(() => ({
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
      function s_(e, n) {
        if (null == e) return Pi;
        const t = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])), (t[i] = r), n && (n[i] = o);
          }
        return t;
      }
      const O = gt;
      function Mt(e) {
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
        return e[Va] || null;
      }
      function Ot(e) {
        return e[Iu] || null;
      }
      function At(e) {
        return e[Ba] || null;
      }
      function Ut(e, n) {
        const t = e[r_] || null;
        if (!t && !0 === n) throw new Error(`Type ${be(e)} does not have '\u0275mod' property.`);
        return t;
      }
      const Y = 11;
      function Vt(e) {
        return Array.isArray(e) && 'object' == typeof e[1];
      }
      function hn(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function xu(e) {
        return 0 != (8 & e.flags);
      }
      function Ua(e) {
        return 2 == (2 & e.flags);
      }
      function $a(e) {
        return 1 == (1 & e.flags);
      }
      function pn(e) {
        return null !== e.template;
      }
      function cE(e) {
        return 0 != (256 & e[2]);
      }
      function ti(e, n) {
        return e.hasOwnProperty(nr) ? e[nr] : null;
      }
      class fE {
        constructor(n, t, r) {
          (this.previousValue = n), (this.currentValue = t), (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function wt() {
        return c_;
      }
      function c_(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = pE), hE;
      }
      function hE() {
        const e = d_(this),
          n = e?.current;
        if (n) {
          const t = e.previous;
          if (t === Pi) e.previous = n;
          else for (let r in n) t[r] = n[r];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function pE(e, n, t, r) {
        const i =
            d_(e) ||
            (function gE(e, n) {
              return (e[u_] = n);
            })(e, { previous: Pi, current: null }),
          o = i.current || (i.current = {}),
          s = i.previous,
          a = this.declaredInputs[t],
          l = s[a];
        (o[a] = new fE(l && l.currentValue, n, s === Pi)), (e[r] = n);
      }
      wt.ngInherit = !0;
      const u_ = '__ngSimpleChanges__';
      function d_(e) {
        return e[u_] || null;
      }
      function qe(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Wa(e, n) {
        return qe(n[e]);
      }
      function nn(e, n) {
        return qe(n[e.index]);
      }
      function Bu(e, n) {
        return e.data[n];
      }
      function Vi(e, n) {
        return e[n];
      }
      function Wt(e, n) {
        const t = n[e];
        return Vt(t) ? t : t[0];
      }
      function f_(e) {
        return 4 == (4 & e[2]);
      }
      function za(e) {
        return 64 == (64 & e[2]);
      }
      function Tr(e, n) {
        return null == n ? null : e[n];
      }
      function h_(e) {
        e[18] = 0;
      }
      function Hu(e, n) {
        e[5] += n;
        let t = e,
          r = e[3];
        for (; null !== r && ((1 === n && 1 === t[5]) || (-1 === n && 0 === t[5])); ) (r[5] += n), (t = r), (r = r[3]);
      }
      const $ = { lFrame: w_(null), bindingsEnabled: !0 };
      function g_() {
        return $.bindingsEnabled;
      }
      function w() {
        return $.lFrame.lView;
      }
      function re() {
        return $.lFrame.tView;
      }
      function nt() {
        let e = __();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function __() {
        return $.lFrame.currentTNode;
      }
      function Fn(e, n) {
        const t = $.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function ju() {
        return $.lFrame.isParent;
      }
      function Gu() {
        $.lFrame.isParent = !1;
      }
      function It() {
        const e = $.lFrame;
        let n = e.bindingRootIndex;
        return -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
      }
      function Bi() {
        return $.lFrame.bindingIndex++;
      }
      function ir(e) {
        const n = $.lFrame,
          t = n.bindingIndex;
        return (n.bindingIndex = n.bindingIndex + e), t;
      }
      function OE(e, n) {
        const t = $.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), Uu(n);
      }
      function Uu(e) {
        $.lFrame.currentDirectiveIndex = e;
      }
      function y_() {
        return $.lFrame.currentQueryIndex;
      }
      function Wu(e) {
        $.lFrame.currentQueryIndex = e;
      }
      function IE(e) {
        const n = e[1];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[6] : null;
      }
      function b_(e, n, t) {
        if (t & B.SkipSelf) {
          let i = n,
            o = e;
          for (
            ;
            !((i = i.parent), null !== i || t & B.Host || ((i = IE(o)), null === i || ((o = o[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (n = i), (e = o);
        }
        const r = ($.lFrame = D_());
        return (r.currentTNode = n), (r.lView = e), !0;
      }
      function zu(e) {
        const n = D_(),
          t = e[1];
        ($.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function D_() {
        const e = $.lFrame,
          n = null === e ? null : e.child;
        return null === n ? w_(e) : n;
      }
      function w_(e) {
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
      function C_() {
        const e = $.lFrame;
        return ($.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
      }
      const N_ = C_;
      function Ku() {
        const e = C_();
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
      function Rt() {
        return $.lFrame.selectedIndex;
      }
      function Er(e) {
        $.lFrame.selectedIndex = e;
      }
      function Be() {
        const e = $.lFrame;
        return Bu(e.tView, e.selectedIndex);
      }
      function qa(e, n) {
        for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
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
      function Qa(e, n, t) {
        T_(e, n, 3, t);
      }
      function Xa(e, n, t, r) {
        (3 & e[2]) === t && T_(e, n, t, r);
      }
      function qu(e, n) {
        let t = e[2];
        (3 & t) === n && ((t &= 2047), (t += 1), (e[2] = t));
      }
      function T_(e, n, t, r) {
        const o = r ?? -1,
          s = n.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[18] : 0; l < s; l++)
          if ('number' == typeof n[l + 1]) {
            if (((a = n[l]), null != r && a >= r)) break;
          } else
            n[l] < 0 && (e[18] += 65536),
              (a < o || -1 == o) && (HE(e, t, n, l), (e[18] = (4294901760 & e[18]) + l + 2)),
              l++;
      }
      function HE(e, n, t, r) {
        const i = t[r] < 0,
          o = t[r + 1],
          a = e[i ? -t[r] : t[r]];
        if (i) {
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
      class Jo {
        constructor(n, t, r) {
          (this.factory = n), (this.resolving = !1), (this.canSeeViewProviders = t), (this.injectImpl = r);
        }
      }
      function Ya(e, n, t) {
        let r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if ('number' == typeof i) {
            if (0 !== i) break;
            r++;
            const o = t[r++],
              s = t[r++],
              a = t[r++];
            e.setAttribute(n, s, a, o);
          } else {
            const o = i,
              s = t[++r];
            S_(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), r++;
          }
        }
        return r;
      }
      function E_(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function S_(e) {
        return 64 === e.charCodeAt(0);
      }
      function Ja(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let r = 0; r < n.length; r++) {
              const i = n[r];
              'number' == typeof i ? (t = i) : 0 === t || M_(e, t, i, null, -1 === t || 2 === t ? n[++r] : null);
            }
          }
        return e;
      }
      function M_(e, n, t, r, i) {
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
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, n), (o = s + 1)),
          e.splice(o++, 0, t),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      function O_(e) {
        return -1 !== e;
      }
      function Hi(e) {
        return 32767 & e;
      }
      function ji(e, n) {
        let t = (function WE(e) {
            return e >> 16;
          })(e),
          r = n;
        for (; t > 0; ) (r = r[15]), t--;
        return r;
      }
      let Xu = !0;
      function Za(e) {
        const n = Xu;
        return (Xu = e), n;
      }
      let zE = 0;
      const kn = {};
      function es(e, n) {
        const t = Ju(e, n);
        if (-1 !== t) return t;
        const r = n[1];
        r.firstCreatePass && ((e.injectorIndex = n.length), Yu(r.data, e), Yu(n, null), Yu(r.blueprint, null));
        const i = el(e, n),
          o = e.injectorIndex;
        if (O_(i)) {
          const s = Hi(i),
            a = ji(i, n),
            l = a[1].data;
          for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
        }
        return (n[o + 8] = i), o;
      }
      function Yu(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function Ju(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function el(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
        let t = 0,
          r = null,
          i = n;
        for (; null !== i; ) {
          if (((r = V_(i)), null === r)) return -1;
          if ((t++, (i = i[15]), -1 !== r.injectorIndex)) return r.injectorIndex | (t << 16);
        }
        return -1;
      }
      function tl(e, n, t) {
        !(function KE(e, n, t) {
          let r;
          'string' == typeof t ? (r = t.charCodeAt(0) || 0) : t.hasOwnProperty(Ko) && (r = t[Ko]),
            null == r && (r = t[Ko] = zE++);
          const i = 255 & r;
          n.data[e + (i >> 5)] |= 1 << i;
        })(e, n, t);
      }
      function R_(e, n, t) {
        if (t & B.Optional) return e;
        ka();
      }
      function P_(e, n, t, r) {
        if ((t & B.Optional && void 0 === r && (r = null), 0 == (t & (B.Self | B.Host)))) {
          const i = e[9],
            o = Zt(void 0);
          try {
            return i ? i.get(n, r, t & B.Optional) : n_(n, r, t & B.Optional);
          } finally {
            Zt(o);
          }
        }
        return R_(r, 0, t);
      }
      function x_(e, n, t, r = B.Default, i) {
        if (null !== e) {
          if (1024 & n[2]) {
            const s = (function JE(e, n, t, r, i) {
              let o = e,
                s = n;
              for (; null !== o && null !== s && 1024 & s[2] && !(256 & s[2]); ) {
                const a = F_(o, s, t, r | B.Self, kn);
                if (a !== kn) return a;
                let l = o.parent;
                if (!l) {
                  const c = s[21];
                  if (c) {
                    const u = c.get(t, kn, r);
                    if (u !== kn) return u;
                  }
                  (l = V_(s)), (s = s[15]);
                }
                o = l;
              }
              return i;
            })(e, n, t, r, kn);
            if (s !== kn) return s;
          }
          const o = F_(e, n, t, r, kn);
          if (o !== kn) return o;
        }
        return P_(n, t, r, i);
      }
      function F_(e, n, t, r, i) {
        const o = (function XE(e) {
          if ('string' == typeof e) return e.charCodeAt(0) || 0;
          const n = e.hasOwnProperty(Ko) ? e[Ko] : void 0;
          return 'number' == typeof n ? (n >= 0 ? 255 & n : YE) : n;
        })(t);
        if ('function' == typeof o) {
          if (!b_(n, e, r)) return r & B.Host ? R_(i, 0, r) : P_(n, t, r, i);
          try {
            const s = o(r);
            if (null != s || r & B.Optional) return s;
            ka();
          } finally {
            N_();
          }
        } else if ('number' == typeof o) {
          let s = null,
            a = Ju(e, n),
            l = -1,
            c = r & B.Host ? n[16][6] : null;
          for (
            (-1 === a || r & B.SkipSelf) &&
            ((l = -1 === a ? el(e, n) : n[a + 8]),
            -1 !== l && L_(r, !1) ? ((s = n[1]), (a = Hi(l)), (n = ji(l, n))) : (a = -1));
            -1 !== a;

          ) {
            const u = n[1];
            if (k_(o, a, u.data)) {
              const d = QE(a, n, t, s, r, c);
              if (d !== kn) return d;
            }
            (l = n[a + 8]),
              -1 !== l && L_(r, n[1].data[a + 8] === c) && k_(o, a, n)
                ? ((s = u), (a = Hi(l)), (n = ji(l, n)))
                : (a = -1);
          }
        }
        return i;
      }
      function QE(e, n, t, r, i, o) {
        const s = n[1],
          a = s.data[e + 8],
          u = nl(a, s, t, null == r ? Ua(a) && Xu : r != s && 0 != (3 & a.type), i & B.Host && o === a);
        return null !== u ? ts(n, s, u, a) : kn;
      }
      function nl(e, n, t, r, i) {
        const o = e.providerIndexes,
          s = n.data,
          a = 1048575 & o,
          l = e.directiveStart,
          u = o >> 20,
          f = i ? a + u : e.directiveEnd;
        for (let h = r ? a : a + u; h < f; h++) {
          const p = s[h];
          if ((h < l && t === p) || (h >= l && p.type === t)) return h;
        }
        if (i) {
          const h = s[l];
          if (h && pn(h) && h.type === t) return l;
        }
        return null;
      }
      function ts(e, n, t, r) {
        let i = e[t];
        const o = n.data;
        if (
          (function jE(e) {
            return e instanceof Jo;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function qT(e, n) {
              const t = n ? `. Dependency path: ${n.join(' > ')} > ${e}` : '';
              throw new S(-200, `Circular dependency in DI detected for ${e}${t}`);
            })(
              (function le(e) {
                return 'function' == typeof e
                  ? e.name || e.toString()
                  : 'object' == typeof e && null != e && 'function' == typeof e.type
                  ? e.type.name || e.type.toString()
                  : W(e);
              })(o[t])
            );
          const a = Za(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Zt(s.injectImpl) : null;
          b_(e, r, B.Default);
          try {
            (i = e[t] = s.factory(void 0, o, e, r)),
              n.firstCreatePass &&
                t >= r.directiveStart &&
                (function BE(e, n, t) {
                  const { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = n.type.prototype;
                  if (r) {
                    const s = c_(n);
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(e, s),
                      (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(e, s);
                  }
                  i && (t.preOrderHooks || (t.preOrderHooks = [])).push(0 - e, i),
                    o &&
                      ((t.preOrderHooks || (t.preOrderHooks = [])).push(e, o),
                      (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(e, o));
                })(t, o[t], n);
          } finally {
            null !== l && Zt(l), Za(a), (s.resolving = !1), N_();
          }
        }
        return i;
      }
      function k_(e, n, t) {
        return !!(t[n + (e >> 5)] & (1 << e));
      }
      function L_(e, n) {
        return !(e & B.Self || (e & B.Host && n));
      }
      class Gi {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, r) {
          return x_(this._tNode, this._lView, n, r, t);
        }
      }
      function YE() {
        return new Gi(nt(), w());
      }
      function Qe(e) {
        return Nr(() => {
          const n = e.prototype.constructor,
            t = n[nr] || Zu(n),
            r = Object.prototype;
          let i = Object.getPrototypeOf(e.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[nr] || Zu(i);
            if (o && o !== t) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function Zu(e) {
        return Su(e)
          ? () => {
              const n = Zu(U(e));
              return n && n();
            }
          : ti(e);
      }
      function V_(e) {
        const n = e[1],
          t = n.type;
        return 2 === t ? n.declTNode : 1 === t ? e[6] : null;
      }
      function ni(e) {
        return (function qE(e, n) {
          if ('class' === n) return e.classes;
          if ('style' === n) return e.styles;
          const t = e.attrs;
          if (t) {
            const r = t.length;
            let i = 0;
            for (; i < r; ) {
              const o = t[i];
              if (E_(o)) break;
              if (0 === o) i += 2;
              else if ('number' == typeof o) for (i++; i < r && 'string' == typeof t[i]; ) i++;
              else {
                if (o === n) return t[i + 1];
                i += 2;
              }
            }
          }
          return null;
        })(nt(), e);
      }
      const $i = '__parameters__';
      function zi(e, n, t) {
        return Nr(() => {
          const r = (function ed(e) {
            return function (...t) {
              if (e) {
                const r = e(...t);
                for (const i in r) this[i] = r[i];
              }
            };
          })(n);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, c, u) {
              const d = l.hasOwnProperty($i) ? l[$i] : Object.defineProperty(l, $i, { value: [] })[$i];
              for (; d.length <= u; ) d.push(null);
              return (d[u] = d[u] || []).push(s), l;
            }
          }
          return (
            t && (i.prototype = Object.create(t.prototype)), (i.prototype.ngMetadataName = e), (i.annotationCls = i), i
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
          let r = e[t];
          Array.isArray(r) ? (n === e && (n = e.slice(0, t)), zt(r, n)) : n !== e && n.push(r);
        }
        return n;
      }
      function or(e, n) {
        e.forEach((t) => (Array.isArray(t) ? or(t, n) : n(t)));
      }
      function H_(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function rl(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function is(e, n) {
        const t = [];
        for (let r = 0; r < e; r++) t.push(n);
        return t;
      }
      function Kt(e, n, t) {
        let r = Ki(e, n);
        return (
          r >= 0
            ? (e[1 | r] = t)
            : ((r = ~r),
              (function nS(e, n, t, r) {
                let i = e.length;
                if (i == n) e.push(t, r);
                else if (1 === i) e.push(r, e[0]), (e[0] = t);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > n; ) (e[i] = e[i - 2]), i--;
                  (e[n] = t), (e[n + 1] = r);
                }
              })(e, r, n, t)),
          r
        );
      }
      function nd(e, n) {
        const t = Ki(e, n);
        if (t >= 0) return e[1 | t];
      }
      function Ki(e, n) {
        return (function U_(e, n, t) {
          let r = 0,
            i = e.length >> t;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = e[o << t];
            if (n === s) return o << t;
            s > n ? (i = o) : (r = o + 1);
          }
          return ~(i << t);
        })(e, n, 1);
      }
      const os = {},
        id = '__NG_DI_FLAG__',
        ol = 'ngTempTokenPath',
        uS = /\n/gm,
        $_ = '__source';
      let ss;
      function qi(e) {
        const n = ss;
        return (ss = e), n;
      }
      function fS(e, n = B.Default) {
        if (void 0 === ss) throw new S(-203, !1);
        return null === ss ? n_(e, void 0, n) : ss.get(e, n & B.Optional ? null : void 0, n);
      }
      function T(e, n = B.Default) {
        return (
          (function nE() {
            return Au;
          })() || fS
        )(U(e), n);
      }
      function We(e, n = B.Default) {
        return (
          'number' != typeof n && (n = 0 | (n.optional && 8) | (n.host && 1) | (n.self && 2) | (n.skipSelf && 4)),
          T(e, n)
        );
      }
      function od(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const r = U(e[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new S(900, !1);
            let i,
              o = B.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = hS(a);
              'number' == typeof l ? (-1 === l ? (i = a.token) : (o |= l)) : (i = a);
            }
            n.push(T(i, o));
          } else n.push(T(r));
        }
        return n;
      }
      function as(e, n) {
        return (e[id] = n), (e.prototype[id] = n), e;
      }
      function hS(e) {
        return e[id];
      }
      const ls = as(zi('Optional'), 8),
        cs = as(zi('SkipSelf'), 4);
      let ad;
      class rm {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function Mr(e) {
        return e instanceof rm ? e.changingThisBreaksApplicationSecurity : e;
      }
      const LS = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        VS =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      var Xe = (() => (
        ((Xe = Xe || {})[(Xe.NONE = 0)] = 'NONE'),
        (Xe[(Xe.HTML = 1)] = 'HTML'),
        (Xe[(Xe.STYLE = 2)] = 'STYLE'),
        (Xe[(Xe.SCRIPT = 3)] = 'SCRIPT'),
        (Xe[(Xe.URL = 4)] = 'URL'),
        (Xe[(Xe.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
        Xe
      ))();
      function pd(e) {
        const n = (function ps() {
          const e = w();
          return e && e[12];
        })();
        return n
          ? n.sanitize(Xe.URL, e) || ''
          : (function fs(e, n) {
              const t = (function PS(e) {
                return (e instanceof rm && e.getTypeName()) || null;
              })(e);
              if (null != t && t !== n) {
                if ('ResourceURL' === t && 'URL' === n) return !0;
                throw new Error(`Required a safe ${n}, got a ${t} (see https://g.co/ng/security#xss)`);
              }
              return t === n;
            })(e, 'URL')
          ? Mr(e)
          : (function ul(e) {
              return (e = String(e)).match(LS) || e.match(VS) ? e : 'unsafe:' + e;
            })(W(e));
      }
      const gd = new k('ENVIRONMENT_INITIALIZER'),
        fm = new k('INJECTOR', -1),
        hm = new k('INJECTOR_DEF_TYPES');
      class pm {
        get(n, t = os) {
          if (t === os) {
            const r = new Error(`NullInjectorError: No provider for ${be(n)}!`);
            throw ((r.name = 'NullInjectorError'), r);
          }
          return t;
        }
      }
      function JS(...e) {
        return { ɵproviders: gm(0, e) };
      }
      function gm(e, ...n) {
        const t = [],
          r = new Set();
        let i;
        return (
          or(n, (o) => {
            const s = o;
            _d(s, t, [], r) && (i || (i = []), i.push(s));
          }),
          void 0 !== i && _m(i, t),
          t
        );
      }
      function _m(e, n) {
        for (let t = 0; t < e.length; t++) {
          const { providers: i } = e[t];
          or(i, (o) => {
            n.push(o);
          });
        }
      }
      function _d(e, n, t, r) {
        if (!(e = U(e))) return !1;
        let i = null,
          o = e_(e);
        const s = !o && _e(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = e;
        } else {
          const l = e.ngModule;
          if (((o = e_(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l = 'function' == typeof s.dependencies ? s.dependencies() : s.dependencies;
            for (const c of l) _d(c, n, t, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let c;
              r.add(i);
              try {
                or(o.imports, (u) => {
                  _d(u, n, t, r) && (c || (c = []), c.push(u));
                });
              } finally {
              }
              void 0 !== c && _m(c, n);
            }
            if (!a) {
              const c = ti(i) || (() => new i());
              n.push(
                { provide: i, useFactory: c, deps: ce },
                { provide: hm, useValue: i, multi: !0 },
                { provide: gd, useValue: () => T(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              or(l, (u) => {
                n.push(u);
              });
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      const ZS = ye({ provide: String, useValue: ye });
      function md(e) {
        return null !== e && 'object' == typeof e && ZS in e;
      }
      function ri(e) {
        return 'function' == typeof e;
      }
      const vd = new k('Set Injector scope.'),
        fl = {},
        tM = {};
      let yd;
      function hl() {
        return void 0 === yd && (yd = new pm()), yd;
      }
      class Or {}
      class ym extends Or {
        constructor(n, t, r, i) {
          super(),
            (this.parent = t),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Dd(n, (s) => this.processProvider(s)),
            this.records.set(fm, Yi(void 0, this)),
            i.has('environment') && this.records.set(Or, Yi(void 0, this));
          const o = this.records.get(vd);
          null != o && 'string' == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(hm.multi, ce, B.Self)));
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
          const t = qi(this),
            r = Zt(void 0);
          try {
            return n();
          } finally {
            qi(t), Zt(r);
          }
        }
        get(n, t = os, r = B.Default) {
          this.assertNotDestroyed();
          const i = qi(this),
            o = Zt(void 0);
          try {
            if (!(r & B.SkipSelf)) {
              let a = this.records.get(n);
              if (void 0 === a) {
                const l =
                  (function sM(e) {
                    return 'function' == typeof e || ('object' == typeof e && e instanceof k);
                  })(n) && Mu(n);
                (a = l && this.injectableDefInScope(l) ? Yi(bd(n), fl) : null), this.records.set(n, a);
              }
              if (null != a) return this.hydrate(n, a);
            }
            return (r & B.Self ? hl() : this.parent).get(n, (t = r & B.Optional && t === os ? null : t));
          } catch (s) {
            if ('NullInjectorError' === s.name) {
              if (((s[ol] = s[ol] || []).unshift(be(n)), i)) throw s;
              return (function pS(e, n, t, r) {
                const i = e[ol];
                throw (
                  (n[$_] && i.unshift(n[$_]),
                  (e.message = (function gS(e, n, t, r = null) {
                    e = e && '\n' === e.charAt(0) && '\u0275' == e.charAt(1) ? e.slice(2) : e;
                    let i = be(n);
                    if (Array.isArray(n)) i = n.map(be).join(' -> ');
                    else if ('object' == typeof n) {
                      let o = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          o.push(s + ':' + ('string' == typeof a ? JSON.stringify(a) : be(a)));
                        }
                      i = `{${o.join(', ')}}`;
                    }
                    return `${t}${r ? '(' + r + ')' : ''}[${i}]: ${e.replace(uS, '\n  ')}`;
                  })('\n' + e.message, i, t, r)),
                  (e.ngTokenPath = i),
                  (e[ol] = null),
                  e)
                );
              })(s, n, 'R3InjectorError', this.source);
            }
            throw s;
          } finally {
            Zt(o), qi(i);
          }
        }
        resolveInjectorInitializers() {
          const n = qi(this),
            t = Zt(void 0);
          try {
            const r = this.get(gd.multi, ce, B.Self);
            for (const i of r) i();
          } finally {
            qi(n), Zt(t);
          }
        }
        toString() {
          const n = [],
            t = this.records;
          for (const r of t.keys()) n.push(be(r));
          return `R3Injector[${n.join(', ')}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new S(205, !1);
        }
        processProvider(n) {
          let t = ri((n = U(n))) ? n : U(n && n.provide);
          const r = (function rM(e) {
            return md(e) ? Yi(void 0, e.useValue) : Yi(bm(e), fl);
          })(n);
          if (ri(n) || !0 !== n.multi) this.records.get(t);
          else {
            let i = this.records.get(t);
            i || ((i = Yi(void 0, fl, !0)), (i.factory = () => od(i.multi)), this.records.set(t, i)),
              (t = n),
              i.multi.push(n);
          }
          this.records.set(t, r);
        }
        hydrate(n, t) {
          return (
            t.value === fl && ((t.value = tM), (t.value = t.factory())),
            'object' == typeof t.value &&
              t.value &&
              (function oM(e) {
                return null !== e && 'object' == typeof e && 'function' == typeof e.ngOnDestroy;
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = U(n.providedIn);
          return 'string' == typeof t ? 'any' === t || this.scopes.has(t) : this.injectorDefTypes.has(t);
        }
      }
      function bd(e) {
        const n = Mu(e),
          t = null !== n ? n.factory : ti(e);
        if (null !== t) return t;
        if (e instanceof k) throw new S(204, !1);
        if (e instanceof Function)
          return (function nM(e) {
            const n = e.length;
            if (n > 0) throw (is(n, '?'), new S(204, !1));
            const t = (function ZT(e) {
              const n = e && (e[La] || e[t_]);
              if (n) {
                const t = (function eE(e) {
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
      function bm(e, n, t) {
        let r;
        if (ri(e)) {
          const i = U(e);
          return ti(i) || bd(i);
        }
        if (md(e)) r = () => U(e.useValue);
        else if (
          (function vm(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...od(e.deps || []));
        else if (
          (function mm(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => T(U(e.useExisting));
        else {
          const i = U(e && (e.useClass || e.provide));
          if (
            !(function iM(e) {
              return !!e.deps;
            })(e)
          )
            return ti(i) || bd(i);
          r = () => new i(...od(e.deps));
        }
        return r;
      }
      function Yi(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function aM(e) {
        return !!e.ɵproviders;
      }
      function Dd(e, n) {
        for (const t of e) Array.isArray(t) ? Dd(t, n) : aM(t) ? Dd(t.ɵproviders, n) : n(t);
      }
      class Dm {}
      class uM {
        resolveComponentFactory(n) {
          throw (function cM(e) {
            const n = Error(`No component factory found for ${be(e)}. Did you add it to @NgModule.entryComponents?`);
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let gs = (() => {
        class e {}
        return (e.NULL = new uM()), e;
      })();
      function dM() {
        return Ji(nt(), w());
      }
      function Ji(e, n) {
        return new De(nn(e, n));
      }
      let De = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
        }
        return (e.__NG_ELEMENT_ID__ = dM), e;
      })();
      function fM(e) {
        return e instanceof De ? e.nativeElement : e;
      }
      class wd {}
      let mn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function hM() {
                const e = w(),
                  t = Wt(nt().index, e);
                return (Vt(t) ? t : e)[Y];
              })()),
            e
          );
        })(),
        pM = (() => {
          class e {}
          return (e.ɵprov = M({ token: e, providedIn: 'root', factory: () => null })), e;
        })();
      class _s {
        constructor(n) {
          (this.full = n),
            (this.major = n.split('.')[0]),
            (this.minor = n.split('.')[1]),
            (this.patch = n.split('.').slice(2).join('.'));
        }
      }
      const gM = new _s('14.1.3'),
        Cd = {};
      function Md(e) {
        return e.ngOriginalError;
      }
      class Zi {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n);
          this._console.error('ERROR', n), t && this._console.error('ORIGINAL ERROR', t);
        }
        _findOriginalError(n) {
          let t = n && Md(n);
          for (; t && Md(t); ) t = Md(t);
          return t || null;
        }
      }
      const Od = new Map();
      let SM = 0;
      const Id = '__ngContext__';
      function Nt(e, n) {
        Vt(n)
          ? ((e[Id] = n[20]),
            (function OM(e) {
              Od.set(e[20], e);
            })(n))
          : (e[Id] = n);
      }
      function ms(e) {
        const n = e[Id];
        return 'number' == typeof n
          ? (function Mm(e) {
              return Od.get(e) || null;
            })(n)
          : n || null;
      }
      function Rd(e) {
        const n = ms(e);
        return n ? (Vt(n) ? n : n.lView) : null;
      }
      const VM = (() => ((typeof requestAnimationFrame < 'u' && requestAnimationFrame) || setTimeout).bind(ge))();
      function sr(e) {
        return e instanceof Function ? e() : e;
      }
      var Bt = (() => (
        ((Bt = Bt || {})[(Bt.Important = 1)] = 'Important'), (Bt[(Bt.DashCase = 2)] = 'DashCase'), Bt
      ))();
      function xd(e, n) {
        return undefined(e, n);
      }
      function vs(e) {
        const n = e[3];
        return hn(n) ? n[3] : n;
      }
      function Fd(e) {
        return km(e[13]);
      }
      function kd(e) {
        return km(e[4]);
      }
      function km(e) {
        for (; null !== e && !hn(e); ) e = e[4];
        return e;
      }
      function to(e, n, t, r, i) {
        if (null != r) {
          let o,
            s = !1;
          hn(r) ? (o = r) : Vt(r) && ((s = !0), (r = r[0]));
          const a = qe(r);
          0 === e && null !== t
            ? null == i
              ? Gm(n, t, a)
              : ii(n, t, a, i || null, !0)
            : 1 === e && null !== t
            ? ii(n, t, a, i || null, !0)
            : 2 === e
            ? (function Qm(e, n, t) {
                const r = pl(e, n);
                r &&
                  (function nO(e, n, t, r) {
                    e.removeChild(n, t, r);
                  })(e, r, n, t);
              })(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != o &&
              (function oO(e, n, t, r, i) {
                const o = t[7];
                o !== qe(t) && to(n, e, r, o, i);
                for (let a = 10; a < t.length; a++) {
                  const l = t[a];
                  ys(l[1], l, e, n, r, o);
                }
              })(n, e, o, t, i);
        }
      }
      function Vd(e, n, t) {
        return e.createElement(n, t);
      }
      function Vm(e, n) {
        const t = e[9],
          r = t.indexOf(n),
          i = n[3];
        512 & n[2] && ((n[2] &= -513), Hu(i, -1)), t.splice(r, 1);
      }
      function Bd(e, n) {
        if (e.length <= 10) return;
        const t = 10 + n,
          r = e[t];
        if (r) {
          const i = r[17];
          null !== i && i !== e && Vm(i, r), n > 0 && (e[t - 1][4] = r[4]);
          const o = rl(e, 10 + n);
          !(function qM(e, n) {
            ys(e, n, n[Y], 2, null, null), (n[0] = null), (n[6] = null);
          })(r[1], r);
          const s = o[19];
          null !== s && s.detachView(o[1]), (r[3] = null), (r[4] = null), (r[2] &= -65);
        }
        return r;
      }
      function Bm(e, n) {
        if (!(128 & n[2])) {
          const t = n[Y];
          t.destroyNode && ys(e, n, t, 3, null, null),
            (function YM(e) {
              let n = e[13];
              if (!n) return Hd(e[1], e);
              for (; n; ) {
                let t = null;
                if (Vt(n)) t = n[13];
                else {
                  const r = n[10];
                  r && (t = r);
                }
                if (!t) {
                  for (; n && !n[4] && n !== e; ) Vt(n) && Hd(n[1], n), (n = n[3]);
                  null === n && (n = e), Vt(n) && Hd(n[1], n), (t = n && n[4]);
                }
                n = t;
              }
            })(n);
        }
      }
      function Hd(e, n) {
        if (!(128 & n[2])) {
          (n[2] &= -65),
            (n[2] |= 128),
            (function tO(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const i = n[t[r]];
                  if (!(i instanceof Jo)) {
                    const o = t[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(i);
                      } finally {
                      }
                  }
                }
            })(e, n),
            (function eO(e, n) {
              const t = e.cleanup,
                r = n[7];
              let i = -1;
              if (null !== t)
                for (let o = 0; o < t.length - 1; o += 2)
                  if ('string' == typeof t[o]) {
                    const s = t[o + 1],
                      a = 'function' == typeof s ? s(n) : qe(n[s]),
                      l = r[(i = t[o + 2])],
                      c = t[o + 3];
                    'boolean' == typeof c
                      ? a.removeEventListener(t[o], l, c)
                      : c >= 0
                      ? r[(i = c)]()
                      : r[(i = -c)].unsubscribe(),
                      (o += 2);
                  } else {
                    const s = r[(i = t[o + 1])];
                    t[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) (0, r[o])();
                n[7] = null;
              }
            })(e, n),
            1 === n[1].type && n[Y].destroy();
          const t = n[17];
          if (null !== t && hn(n[3])) {
            t !== n[3] && Vm(t, n);
            const r = n[19];
            null !== r && r.detachView(e);
          }
          !(function AM(e) {
            Od.delete(e[20]);
          })(n);
        }
      }
      function Hm(e, n, t) {
        return (function jm(e, n, t) {
          let r = n;
          for (; null !== r && 40 & r.type; ) r = (n = r).parent;
          if (null === r) return t[0];
          if (2 & r.flags) {
            const i = e.data[r.directiveStart].encapsulation;
            if (i === xn.None || i === xn.Emulated) return null;
          }
          return nn(r, t);
        })(e, n.parent, t);
      }
      function ii(e, n, t, r, i) {
        e.insertBefore(n, t, r, i);
      }
      function Gm(e, n, t) {
        e.appendChild(n, t);
      }
      function Um(e, n, t, r, i) {
        null !== r ? ii(e, n, t, r, i) : Gm(e, n, t);
      }
      function pl(e, n) {
        return e.parentNode(n);
      }
      function $m(e, n, t) {
        return zm(e, n, t);
      }
      let zm = function Wm(e, n, t) {
        return 40 & e.type ? nn(e, t) : null;
      };
      function gl(e, n, t, r) {
        const i = Hm(e, r, n),
          o = n[Y],
          a = $m(r.parent || n[6], r, n);
        if (null != i)
          if (Array.isArray(t)) for (let l = 0; l < t.length; l++) Um(o, i, t[l], a, !1);
          else Um(o, i, t, a, !1);
      }
      function _l(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return nn(n, e);
          if (4 & t) return Gd(-1, e[n.index]);
          if (8 & t) {
            const r = n.child;
            if (null !== r) return _l(e, r);
            {
              const i = e[n.index];
              return hn(i) ? Gd(-1, i) : qe(i);
            }
          }
          if (32 & t) return xd(n, e)() || qe(e[n.index]);
          {
            const r = qm(e, n);
            return null !== r ? (Array.isArray(r) ? r[0] : _l(vs(e[16]), r)) : _l(e, n.next);
          }
        }
        return null;
      }
      function qm(e, n) {
        return null !== n ? e[16][6].projection[n.projection] : null;
      }
      function Gd(e, n) {
        const t = 10 + e + 1;
        if (t < n.length) {
          const r = n[t],
            i = r[1].firstChild;
          if (null !== i) return _l(r, i);
        }
        return n[7];
      }
      function Ud(e, n, t, r, i, o, s) {
        for (; null != t; ) {
          const a = r[t.index],
            l = t.type;
          if ((s && 0 === n && (a && Nt(qe(a), r), (t.flags |= 4)), 64 != (64 & t.flags)))
            if (8 & l) Ud(e, n, t.child, r, i, o, !1), to(n, e, i, a, o);
            else if (32 & l) {
              const c = xd(t, r);
              let u;
              for (; (u = c()); ) to(n, e, i, u, o);
              to(n, e, i, a, o);
            } else 16 & l ? Xm(e, n, r, t, i, o) : to(n, e, i, a, o);
          t = s ? t.projectionNext : t.next;
        }
      }
      function ys(e, n, t, r, i, o) {
        Ud(t, r, e.firstChild, n, i, o, !1);
      }
      function Xm(e, n, t, r, i, o) {
        const s = t[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l)) for (let c = 0; c < l.length; c++) to(n, e, i, l[c], o);
        else Ud(e, n, l, s[3], i, o, !0);
      }
      function Ym(e, n, t) {
        e.setAttribute(n, 'style', t);
      }
      function $d(e, n, t) {
        '' === t ? e.removeAttribute(n, 'class') : e.setAttribute(n, 'class', t);
      }
      function Jm(e, n, t) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(n, t);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = n.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          t = i + 1;
        }
      }
      const Zm = 'ng-template';
      function aO(e, n, t) {
        let r = 0;
        for (; r < e.length; ) {
          let i = e[r++];
          if (t && 'class' === i) {
            if (((i = e[r]), -1 !== Jm(i.toLowerCase(), n, 0))) return !0;
          } else if (1 === i) {
            for (; r < e.length && 'string' == typeof (i = e[r++]); ) if (i.toLowerCase() === n) return !0;
            return !1;
          }
        }
        return !1;
      }
      function ev(e) {
        return 4 === e.type && e.value !== Zm;
      }
      function lO(e, n, t) {
        return n === (4 !== e.type || t ? e.value : Zm);
      }
      function cO(e, n, t) {
        let r = 4;
        const i = e.attrs || [],
          o = (function fO(e) {
            for (let n = 0; n < e.length; n++) if (E_(e[n])) return n;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ('number' != typeof l) {
            if (!s)
              if (4 & r) {
                if (((r = 2 | (1 & r)), ('' !== l && !lO(e, l, t)) || ('' === l && 1 === n.length))) {
                  if (vn(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? l : n[++a];
                if (8 & r && null !== e.attrs) {
                  if (!aO(e.attrs, c, t)) {
                    if (vn(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = uO(8 & r ? 'class' : l, i, ev(e), t);
                if (-1 === d) {
                  if (vn(r)) return !1;
                  s = !0;
                  continue;
                }
                if ('' !== c) {
                  let f;
                  f = d > o ? '' : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Jm(h, c, 0)) || (2 & r && c !== f)) {
                    if (vn(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !vn(r) && !vn(l)) return !1;
            if (s && vn(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return vn(r) || s;
      }
      function vn(e) {
        return 0 == (1 & e);
      }
      function uO(e, n, t, r) {
        if (null === n) return -1;
        let i = 0;
        if (r || !t) {
          let o = !1;
          for (; i < n.length; ) {
            const s = n[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++i];
                for (; 'string' == typeof a; ) a = n[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function hO(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const r = e[t];
              if ('number' == typeof r) return -1;
              if (r === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function tv(e, n, t = !1) {
        for (let r = 0; r < n.length; r++) if (cO(e, n[r], t)) return !0;
        return !1;
      }
      function pO(e, n) {
        e: for (let t = 0; t < n.length; t++) {
          const r = n[t];
          if (e.length === r.length) {
            for (let i = 0; i < e.length; i++) if (e[i] !== r[i]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function nv(e, n) {
        return e ? ':not(' + n.trim() + ')' : n;
      }
      function gO(e) {
        let n = e[0],
          t = 1,
          r = 2,
          i = '',
          o = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ('string' == typeof s)
            if (2 & r) {
              const a = e[++t];
              i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
            } else 8 & r ? (i += '.' + s) : 4 & r && (i += ' ' + s);
          else '' !== i && !vn(s) && ((n += nv(o, i)), (i = '')), (r = s), (o = o || !vn(r));
          t++;
        }
        return '' !== i && (n += nv(o, i)), n;
      }
      const z = {};
      function F(e) {
        rv(re(), w(), Rt() + e, !1);
      }
      function rv(e, n, t, r) {
        if (!r)
          if (3 == (3 & n[2])) {
            const o = e.preOrderCheckHooks;
            null !== o && Qa(n, o, t);
          } else {
            const o = e.preOrderHooks;
            null !== o && Xa(n, o, 0, t);
          }
        Er(t);
      }
      function av(e, n = null, t = null, r) {
        const i = lv(e, n, t, r);
        return i.resolveInjectorInitializers(), i;
      }
      function lv(e, n = null, t = null, r, i = new Set()) {
        const o = [t || ce, JS(e)];
        return (r = r || ('object' == typeof e ? void 0 : be(e))), new ym(o, n || hl(), r || null, i);
      }
      let _t = (() => {
        class e {
          static create(t, r) {
            if (Array.isArray(t)) return av({ name: '' }, r, t, '');
            {
              const i = t.name ?? '';
              return av({ name: i }, t.parent, t.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = os),
          (e.NULL = new pm()),
          (e.ɵprov = M({ token: e, providedIn: 'any', factory: () => T(fm) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, n = B.Default) {
        const t = w();
        return null === t ? T(e, n) : x_(nt(), t, U(e), n);
      }
      function Qd() {
        throw new Error('invalid');
      }
      function vl(e, n) {
        return (e << 17) | (n << 2);
      }
      function yn(e) {
        return (e >> 17) & 32767;
      }
      function Xd(e) {
        return 2 | e;
      }
      function ar(e) {
        return (131068 & e) >> 2;
      }
      function Yd(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function Jd(e) {
        return 1 | e;
      }
      function Tv(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const i = t[r],
              o = t[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              Wu(i), s.contentQueries(2, n[o], o);
            }
          }
      }
      function Dl(e, n, t, r, i, o, s, a, l, c, u) {
        const d = n.blueprint.slice();
        return (
          (d[0] = i),
          (d[2] = 76 | r),
          (null !== u || (e && 1024 & e[2])) && (d[2] |= 1024),
          h_(d),
          (d[3] = d[15] = e),
          (d[8] = t),
          (d[10] = s || (e && e[10])),
          (d[Y] = a || (e && e[Y])),
          (d[12] = l || (e && e[12]) || null),
          (d[9] = c || (e && e[9]) || null),
          (d[6] = o),
          (d[20] = (function MM() {
            return SM++;
          })()),
          (d[21] = u),
          (d[16] = 2 == n.type ? e[16] : d),
          d
        );
      }
      function ro(e, n, t, r, i) {
        let o = e.data[n];
        if (null === o)
          (o = (function cf(e, n, t, r, i) {
            const o = __(),
              s = ju(),
              l = (e.data[n] = (function JO(e, n, t, r, i, o) {
                return {
                  type: t,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: n ? n.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
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
              })(0, s ? o : o && o.parent, t, n, r, i));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== o &&
                (s ? null == o.child && null !== l.parent && (o.child = l) : null === o.next && (o.next = l)),
              l
            );
          })(e, n, t, r, i)),
            (function ME() {
              return $.lFrame.inI18n;
            })() && (o.flags |= 64);
        else if (64 & o.type) {
          (o.type = t), (o.value = r), (o.attrs = i);
          const s = (function Yo() {
            const e = $.lFrame,
              n = e.currentTNode;
            return e.isParent ? n : n.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Fn(o, !0), o;
      }
      function io(e, n, t, r) {
        if (0 === t) return -1;
        const i = n.length;
        for (let o = 0; o < t; o++) n.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function wl(e, n, t) {
        zu(n);
        try {
          const r = e.viewQuery;
          null !== r && vf(1, r, t);
          const i = e.template;
          null !== i && Ev(e, n, i, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Tv(e, n),
            e.staticViewQueries && vf(2, e.viewQuery, t);
          const o = e.components;
          null !== o &&
            (function qO(e, n) {
              for (let t = 0; t < n.length; t++) pA(e, n[t]);
            })(n, o);
        } catch (r) {
          throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
        } finally {
          (n[2] &= -5), Ku();
        }
      }
      function bs(e, n, t, r) {
        const i = n[2];
        if (128 != (128 & i)) {
          zu(n);
          try {
            h_(n),
              (function m_(e) {
                return ($.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== t && Ev(e, n, t, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && Qa(n, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && Xa(n, c, 0, null), qu(n, 0);
            }
            if (
              ((function fA(e) {
                for (let n = Fd(e); null !== n; n = kd(n)) {
                  if (!n[2]) continue;
                  const t = n[9];
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r],
                      o = i[3];
                    0 == (512 & i[2]) && Hu(o, 1), (i[2] |= 512);
                  }
                }
              })(n),
              (function dA(e) {
                for (let n = Fd(e); null !== n; n = kd(n))
                  for (let t = 10; t < n.length; t++) {
                    const r = n[t],
                      i = r[1];
                    za(r) && bs(i, r, i.template, r[8]);
                  }
              })(n),
              null !== e.contentQueries && Tv(e, n),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && Qa(n, c);
            } else {
              const c = e.contentHooks;
              null !== c && Xa(n, c, 1), qu(n, 1);
            }
            !(function zO(e, n) {
              const t = e.hostBindingOpCodes;
              if (null !== t)
                try {
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    if (i < 0) Er(~i);
                    else {
                      const o = i,
                        s = t[++r],
                        a = t[++r];
                      OE(s, o), a(2, n[o]);
                    }
                  }
                } finally {
                  Er(-1);
                }
            })(e, n);
            const a = e.components;
            null !== a &&
              (function KO(e, n) {
                for (let t = 0; t < n.length; t++) hA(e, n[t]);
              })(n, a);
            const l = e.viewQuery;
            if ((null !== l && vf(2, l, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && Qa(n, c);
            } else {
              const c = e.viewHooks;
              null !== c && Xa(n, c, 2), qu(n, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (n[2] &= -41),
              512 & n[2] && ((n[2] &= -513), Hu(n[3], -1));
          } finally {
            Ku();
          }
        }
      }
      function QO(e, n, t, r) {
        const i = n[10],
          s = f_(n);
        try {
          !s && i.begin && i.begin(), s && wl(e, n, r), bs(e, n, t, r);
        } finally {
          !s && i.end && i.end();
        }
      }
      function Ev(e, n, t, r, i) {
        const o = Rt(),
          s = 2 & r;
        try {
          Er(-1), s && n.length > 22 && rv(e, n, 22, !1), t(r, i);
        } finally {
          Er(o);
        }
      }
      function uf(e, n, t) {
        !g_() ||
          ((function rA(e, n, t, r) {
            const i = t.directiveStart,
              o = t.directiveEnd;
            e.firstCreatePass || es(t, n), Nt(r, n);
            const s = t.initialInputs;
            for (let a = i; a < o; a++) {
              const l = e.data[a],
                c = pn(l);
              c && lA(n, t, l);
              const u = ts(n, e, a, t);
              Nt(u, n), null !== s && cA(0, a - i, u, l, 0, s), c && (Wt(t.index, n)[8] = u);
            }
          })(e, n, t, nn(t, n)),
          128 == (128 & t.flags) &&
            (function iA(e, n, t) {
              const r = t.directiveStart,
                i = t.directiveEnd,
                o = t.index,
                s = (function AE() {
                  return $.lFrame.currentDirectiveIndex;
                })();
              try {
                Er(o);
                for (let a = r; a < i; a++) {
                  const l = e.data[a],
                    c = n[a];
                  Uu(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && xv(l, c);
                }
              } finally {
                Er(-1), Uu(s);
              }
            })(e, n, t));
      }
      function df(e, n, t = nn) {
        const r = n.localNames;
        if (null !== r) {
          let i = n.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function Mv(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = ff(
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
      function ff(e, n, t, r, i, o, s, a, l, c) {
        const u = 22 + r,
          d = u + i,
          f = (function XO(e, n) {
            const t = [];
            for (let r = 0; r < n; r++) t.push(r < e ? null : z);
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
      function Ov(e, n, t, r) {
        const i = jv(n);
        null === t ? i.push(r) : (i.push(t), e.firstCreatePass && Gv(e).push(r, i.length - 1));
      }
      function Av(e, n, t) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const i = e[r];
            (t = null === t ? {} : t).hasOwnProperty(r) ? t[r].push(n, i) : (t[r] = [n, i]);
          }
        return t;
      }
      function Iv(e, n) {
        const r = n.directiveEnd,
          i = e.data,
          o = n.attrs,
          s = [];
        let a = null,
          l = null;
        for (let c = n.directiveStart; c < r; c++) {
          const u = i[c],
            d = u.inputs,
            f = null === o || ev(n) ? null : uA(d, o);
          s.push(f), (a = Av(d, c, a)), (l = Av(u.outputs, c, l));
        }
        null !== a && (a.hasOwnProperty('class') && (n.flags |= 16), a.hasOwnProperty('style') && (n.flags |= 32)),
          (n.initialInputs = s),
          (n.inputs = a),
          (n.outputs = l);
      }
      function qt(e, n, t, r, i, o, s, a) {
        const l = nn(n, t);
        let u,
          c = n.inputs;
        !a && null != c && (u = c[r])
          ? (yf(e, t, u, r, i), Ua(n) && Rv(t, n.index))
          : 3 & n.type &&
            ((r = (function ZO(e) {
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
            })(r)),
            (i = null != s ? s(i, n.value || '', r) : i),
            o.setProperty(l, r, i));
      }
      function Rv(e, n) {
        const t = Wt(n, e);
        16 & t[2] || (t[2] |= 32);
      }
      function hf(e, n, t, r) {
        let i = !1;
        if (g_()) {
          const o = (function oA(e, n, t) {
              const r = e.directiveRegistry;
              let i = null;
              if (r)
                for (let o = 0; o < r.length; o++) {
                  const s = r[o];
                  tv(t, s.selectors, !1) &&
                    (i || (i = []), tl(es(t, n), e, s.type), pn(s) ? (Fv(e, t), i.unshift(s)) : i.push(s));
                }
              return i;
            })(e, n, t),
            s = null === r ? null : { '': -1 };
          if (null !== o) {
            (i = !0), kv(t, e.data.length, o.length);
            for (let u = 0; u < o.length; u++) {
              const d = o[u];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              c = io(e, n, o.length, null);
            for (let u = 0; u < o.length; u++) {
              const d = o[u];
              (t.mergedAttrs = Ja(t.mergedAttrs, d.hostAttrs)),
                Lv(e, t, n, c, d),
                aA(c, d, s),
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
            Iv(e, t);
          }
          s &&
            (function sA(e, n, t) {
              if (n) {
                const r = (e.localNames = []);
                for (let i = 0; i < n.length; i += 2) {
                  const o = t[n[i + 1]];
                  if (null == o) throw new S(-301, !1);
                  r.push(n[i], o);
                }
              }
            })(t, r, s);
        }
        return (t.mergedAttrs = Ja(t.mergedAttrs, t.attrs)), i;
      }
      function Pv(e, n, t, r, i, o) {
        const s = o.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const l = ~n.index;
          (function nA(e) {
            let n = e.length;
            for (; n > 0; ) {
              const t = e[--n];
              if ('number' == typeof t && t < 0) return t;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(r, i, s);
        }
      }
      function xv(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function Fv(e, n) {
        (n.flags |= 2), (e.components || (e.components = [])).push(n.index);
      }
      function aA(e, n, t) {
        if (t) {
          if (n.exportAs) for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
          pn(n) && (t[''] = e);
        }
      }
      function kv(e, n, t) {
        (e.flags |= 1), (e.directiveStart = n), (e.directiveEnd = n + t), (e.providerIndexes = n);
      }
      function Lv(e, n, t, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = ti(i.type)),
          s = new Jo(o, pn(i), _);
        (e.blueprint[r] = s), (t[r] = s), Pv(e, n, 0, r, io(e, t, i.hostVars, z), i);
      }
      function lA(e, n, t) {
        const r = nn(n, e),
          i = Mv(t),
          o = e[10],
          s = Cl(e, Dl(e, i, null, t.onPush ? 32 : 16, r, n, o, o.createRenderer(r, t), null, null, null));
        e[n.index] = s;
      }
      function Vn(e, n, t, r, i, o) {
        const s = nn(e, n);
        !(function pf(e, n, t, r, i, o, s) {
          if (null == o) e.removeAttribute(n, i, t);
          else {
            const a = null == s ? W(o) : s(o, r || '', i);
            e.setAttribute(n, i, a, t);
          }
        })(n[Y], s, o, e.value, t, r, i);
      }
      function cA(e, n, t, r, i, o) {
        const s = o[n];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const c = s[l++],
              u = s[l++],
              d = s[l++];
            null !== a ? r.setInput(t, d, c, u) : (t[u] = d);
          }
        }
      }
      function uA(e, n) {
        let t = null,
          r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if (0 !== i)
            if (5 !== i) {
              if ('number' == typeof i) break;
              e.hasOwnProperty(i) && (null === t && (t = []), t.push(i, e[i], n[r + 1])), (r += 2);
            } else r += 2;
          else r += 4;
        }
        return t;
      }
      function Vv(e, n, t, r) {
        return new Array(e, !0, !1, n, null, 0, r, t, null, null);
      }
      function hA(e, n) {
        const t = Wt(n, e);
        if (za(t)) {
          const r = t[1];
          48 & t[2] ? bs(r, t, r.template, t[8]) : t[5] > 0 && gf(t);
        }
      }
      function gf(e) {
        for (let r = Fd(e); null !== r; r = kd(r))
          for (let i = 10; i < r.length; i++) {
            const o = r[i];
            if (za(o))
              if (512 & o[2]) {
                const s = o[1];
                bs(s, o, s.template, o[8]);
              } else o[5] > 0 && gf(o);
          }
        const t = e[1].components;
        if (null !== t)
          for (let r = 0; r < t.length; r++) {
            const i = Wt(t[r], e);
            za(i) && i[5] > 0 && gf(i);
          }
      }
      function pA(e, n) {
        const t = Wt(n, e),
          r = t[1];
        (function gA(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
        })(r, t),
          wl(r, t, t[8]);
      }
      function Cl(e, n) {
        return e[13] ? (e[14][4] = n) : (e[13] = n), (e[14] = n), n;
      }
      function _f(e) {
        for (; e; ) {
          e[2] |= 32;
          const n = vs(e);
          if (cE(e) && !n) return e;
          e = n;
        }
        return null;
      }
      function Hv(e) {
        !(function Bv(e) {
          for (let n = 0; n < e.components.length; n++) {
            const t = e.components[n],
              r = Rd(t);
            if (null !== r) {
              const i = r[1];
              QO(i, r, i.template, t);
            }
          }
        })(e[8]);
      }
      function vf(e, n, t) {
        Wu(0), n(e, t);
      }
      const mA = (() => Promise.resolve(null))();
      function jv(e) {
        return e[7] || (e[7] = []);
      }
      function Gv(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function $v(e, n) {
        const t = e[9],
          r = t ? t.get(Zi, null) : null;
        r && r.handleError(n);
      }
      function yf(e, n, t, r, i) {
        for (let o = 0; o < t.length; ) {
          const s = t[o++],
            a = t[o++],
            l = n[s],
            c = e.data[s];
          null !== c.setInput ? c.setInput(l, i, r, a) : (l[a] = i);
        }
      }
      function Nl(e, n, t) {
        let r = t ? e.styles : null,
          i = t ? e.classes : null,
          o = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            'number' == typeof a ? (o = a) : 1 == o ? (i = Eu(i, a)) : 2 == o && (r = Eu(r, a + ': ' + n[++s] + ';'));
          }
        t ? (e.styles = r) : (e.stylesWithoutHost = r), t ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function Tl(e, n, t, r, i = !1) {
        for (; null !== t; ) {
          const o = n[t.index];
          if ((null !== o && r.push(qe(o)), hn(o)))
            for (let a = 10; a < o.length; a++) {
              const l = o[a],
                c = l[1].firstChild;
              null !== c && Tl(l[1], l, c, r);
            }
          const s = t.type;
          if (8 & s) Tl(e, n, t.child, r);
          else if (32 & s) {
            const a = xd(t, n);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = qm(n, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = vs(n[16]);
              Tl(l[1], l, a, r, !0);
            }
          }
          t = i ? t.projectionNext : t.next;
        }
        return r;
      }
      class Ds {
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const n = this._lView,
            t = n[1];
          return Tl(t, n, t.firstChild, []);
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
            if (hn(n)) {
              const t = n[8],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (Bd(n, r), rl(t, r));
            }
            this._attachedToViewContainer = !1;
          }
          Bm(this._lView[1], this._lView);
        }
        onDestroy(n) {
          Ov(this._lView[1], this._lView, null, n);
        }
        markForCheck() {
          _f(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          !(function mf(e, n, t) {
            const r = n[10];
            r.begin && r.begin();
            try {
              bs(e, n, e.template, t);
            } catch (i) {
              throw ($v(n, i), i);
            } finally {
              r.end && r.end();
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
            (function XM(e, n) {
              ys(e, n, n[Y], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new S(902, !1);
          this._appRef = n;
        }
      }
      class vA extends Ds {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          Hv(this._view);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class bf extends gs {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = _e(n);
          return new ws(t, this.ngModule);
        }
      }
      function Wv(e) {
        const n = [];
        for (let t in e) e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class bA {
        constructor(n, t) {
          (this.injector = n), (this.parentInjector = t);
        }
        get(n, t, r) {
          const i = this.injector.get(n, Cd, r);
          return i !== Cd || t === Cd ? i : this.parentInjector.get(n, t, r);
        }
      }
      class ws extends Dm {
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function _O(e) {
              return e.map(gO).join(',');
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : []),
            (this.isBoundToModule = !!t);
        }
        get inputs() {
          return Wv(this.componentDef.inputs);
        }
        get outputs() {
          return Wv(this.componentDef.outputs);
        }
        create(n, t, r, i) {
          let o = (i = i || this.ngModule) instanceof Or ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new bA(n, o) : n,
            a = s.get(wd, null);
          if (null === a) throw new S(407, !1);
          const l = s.get(pM, null),
            c = a.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || 'div',
            d = r
              ? (function YO(e, n, t) {
                  return e.selectRootElement(n, t === xn.ShadowDom);
                })(c, r, this.componentDef.encapsulation)
              : Vd(
                  a.createRenderer(null, this.componentDef),
                  u,
                  (function yA(e) {
                    const n = e.toLowerCase();
                    return 'svg' === n ? 'svg' : 'math' === n ? 'math' : null;
                  })(u)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = (function TA(e, n) {
              return { components: [], scheduler: e || VM, clean: mA, playerHandler: n || null, flags: 0 };
            })(),
            p = ff(0, null, null, 1, 0, null, null, null, null, null),
            g = Dl(null, p, h, f, null, null, a, c, l, s, null);
          let v, y;
          zu(g);
          try {
            const D = (function CA(e, n, t, r, i, o) {
              const s = t[1];
              t[22] = e;
              const l = ro(s, 22, 2, '#host', null),
                c = (l.mergedAttrs = n.hostAttrs);
              null !== c &&
                (Nl(l, c, !0),
                null !== e &&
                  (Ya(i, e, c), null !== l.classes && $d(i, e, l.classes), null !== l.styles && Ym(i, e, l.styles)));
              const u = r.createRenderer(e, n),
                d = Dl(t, Mv(n), null, n.onPush ? 32 : 16, t[22], l, r, u, o || null, null, null);
              return (
                s.firstCreatePass && (tl(es(l, t), s, n.type), Fv(s, l), kv(l, t.length, 1)), Cl(t, d), (t[22] = d)
              );
            })(d, this.componentDef, g, a, c);
            if (d)
              if (r) Ya(c, d, ['ng-version', gM.full]);
              else {
                const { attrs: b, classes: C } = (function mO(e) {
                  const n = [],
                    t = [];
                  let r = 1,
                    i = 2;
                  for (; r < e.length; ) {
                    let o = e[r];
                    if ('string' == typeof o) 2 === i ? '' !== o && n.push(o, e[++r]) : 8 === i && t.push(o);
                    else {
                      if (!vn(i)) break;
                      i = o;
                    }
                    r++;
                  }
                  return { attrs: n, classes: t };
                })(this.componentDef.selectors[0]);
                b && Ya(c, d, b), C && C.length > 0 && $d(c, d, C.join(' '));
              }
            if (((y = Bu(p, 22)), void 0 !== t)) {
              const b = (y.projection = []);
              for (let C = 0; C < this.ngContentSelectors.length; C++) {
                const A = t[C];
                b.push(null != A ? Array.from(A) : null);
              }
            }
            (v = (function NA(e, n, t, r, i) {
              const o = t[1],
                s = (function tA(e, n, t) {
                  const r = nt();
                  e.firstCreatePass &&
                    (t.providersResolver && t.providersResolver(t), Lv(e, r, n, io(e, n, 1, null), t), Iv(e, r));
                  const i = ts(n, e, r.directiveStart, r);
                  Nt(i, n);
                  const o = nn(r, n);
                  return o && Nt(o, n), i;
                })(o, t, n);
              if ((r.components.push(s), (e[8] = s), null !== i)) for (const l of i) l(s, n);
              if (n.contentQueries) {
                const l = nt();
                n.contentQueries(1, s, l.directiveStart);
              }
              const a = nt();
              return (
                !o.firstCreatePass ||
                  (null === n.hostBindings && null === n.hostAttrs) ||
                  (Er(a.index), Pv(t[1], a, 0, a.directiveStart, a.directiveEnd, n), xv(n, s)),
                s
              );
            })(D, this.componentDef, g, h, [EA])),
              wl(p, g, null);
          } finally {
            Ku();
          }
          return new wA(this.componentType, v, Ji(y, g), g, y);
        }
      }
      class wA extends class lM {} {
        constructor(n, t, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new vA(i)),
            (this.componentType = n);
        }
        setInput(n, t) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[n])) {
            const o = this._rootLView;
            yf(o[1], o, i, n, t), Rv(o, this._tNode.index);
          }
        }
        get injector() {
          return new Gi(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      function EA() {
        const e = nt();
        qa(w()[1], e);
      }
      function fe(e) {
        let n = (function zv(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          t = !0;
        const r = [e];
        for (; n; ) {
          let i;
          if (pn(e)) i = n.ɵcmp || n.ɵdir;
          else {
            if (n.ɵcmp) throw new S(903, !1);
            i = n.ɵdir;
          }
          if (i) {
            if (t) {
              r.push(i);
              const s = e;
              (s.inputs = Df(e.inputs)), (s.declaredInputs = Df(e.declaredInputs)), (s.outputs = Df(e.outputs));
              const a = i.hostBindings;
              a && AA(e, a);
              const l = i.viewQuery,
                c = i.contentQueries;
              if (
                (l && MA(e, l),
                c && OA(e, c),
                Tu(e.inputs, i.inputs),
                Tu(e.declaredInputs, i.declaredInputs),
                Tu(e.outputs, i.outputs),
                pn(i) && i.data.animation)
              ) {
                const u = e.data;
                u.animation = (u.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(e), a === fe && (t = !1);
              }
          }
          n = Object.getPrototypeOf(n);
        }
        !(function SA(e) {
          let n = 0,
            t = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const i = e[r];
            (i.hostVars = n += i.hostVars), (i.hostAttrs = Ja(i.hostAttrs, (t = Ja(t, i.hostAttrs))));
          }
        })(r);
      }
      function Df(e) {
        return e === Pi ? {} : e === ce ? [] : e;
      }
      function MA(e, n) {
        const t = e.viewQuery;
        e.viewQuery = t
          ? (r, i) => {
              n(r, i), t(r, i);
            }
          : n;
      }
      function OA(e, n) {
        const t = e.contentQueries;
        e.contentQueries = t
          ? (r, i, o) => {
              n(r, i, o), t(r, i, o);
            }
          : n;
      }
      function AA(e, n) {
        const t = e.hostBindings;
        e.hostBindings = t
          ? (r, i) => {
              n(r, i), t(r, i);
            }
          : n;
      }
      let El = null;
      function oi() {
        if (!El) {
          const e = ge.Symbol;
          if (e && e.iterator) El = e.iterator;
          else {
            const n = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < n.length; ++t) {
              const r = n[t];
              'entries' !== r && 'size' !== r && Map.prototype[r] === Map.prototype.entries && (El = r);
            }
          }
        }
        return El;
      }
      function Cs(e) {
        return !!wf(e) && (Array.isArray(e) || (!(e instanceof Map) && oi() in e));
      }
      function wf(e) {
        return null !== e && ('function' == typeof e || 'object' == typeof e);
      }
      function Tt(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function ve(e, n, t, r) {
        const i = w();
        return Tt(i, Bi(), n) && (re(), Vn(Be(), i, e, n, t, r)), ve;
      }
      function J(e, n, t, r, i, o, s, a) {
        const l = w(),
          c = re(),
          u = e + 22,
          d = c.firstCreatePass
            ? (function BA(e, n, t, r, i, o, s, a, l) {
                const c = n.consts,
                  u = ro(n, e, 4, s || null, Tr(c, a));
                hf(n, t, u, Tr(c, l)), qa(n, u);
                const d = (u.tViews = ff(2, u, r, i, o, n.directiveRegistry, n.pipeRegistry, null, n.schemas, c));
                return null !== n.queries && (n.queries.template(n, u), (d.queries = n.queries.embeddedTView(u))), u;
              })(u, c, l, n, t, r, i, o, s)
            : c.data[u];
        Fn(d, !1);
        const f = l[Y].createComment('');
        gl(c, l, f, d), Nt(f, l), Cl(l, (l[u] = Vv(f, l, f, d))), $a(d) && uf(c, l, d), null != s && df(l, d, a);
      }
      function H(e, n, t) {
        const r = w();
        return Tt(r, Bi(), n) && qt(re(), Be(), r, e, n, r[Y], t, !1), H;
      }
      function Cf(e, n, t, r, i) {
        const s = i ? 'class' : 'style';
        yf(e, t, n.inputs[s], s, r);
      }
      function N(e, n, t, r) {
        const i = w(),
          o = re(),
          s = 22 + e,
          a = i[Y],
          l = (i[s] = Vd(
            a,
            n,
            (function VE() {
              return $.lFrame.currentNamespace;
            })()
          )),
          c = o.firstCreatePass
            ? (function jA(e, n, t, r, i, o, s) {
                const a = n.consts,
                  c = ro(n, e, 2, i, Tr(a, o));
                return (
                  hf(n, t, c, Tr(a, s)),
                  null !== c.attrs && Nl(c, c.attrs, !1),
                  null !== c.mergedAttrs && Nl(c, c.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, c),
                  c
                );
              })(s, o, i, 0, n, t, r)
            : o.data[s];
        Fn(c, !0);
        const u = c.mergedAttrs;
        null !== u && Ya(a, l, u);
        const d = c.classes;
        null !== d && $d(a, l, d);
        const f = c.styles;
        return (
          null !== f && Ym(a, l, f),
          64 != (64 & c.flags) && gl(o, i, l, c),
          0 ===
            (function wE() {
              return $.lFrame.elementDepthCount;
            })() && Nt(l, i),
          (function CE() {
            $.lFrame.elementDepthCount++;
          })(),
          $a(c) &&
            (uf(o, i, c),
            (function Sv(e, n, t) {
              if (xu(n)) {
                const i = n.directiveEnd;
                for (let o = n.directiveStart; o < i; o++) {
                  const s = e.data[o];
                  s.contentQueries && s.contentQueries(1, t[o], o);
                }
              }
            })(o, c, i)),
          null !== r && df(i, c),
          N
        );
      }
      function E() {
        let e = nt();
        ju() ? Gu() : ((e = e.parent), Fn(e, !1));
        const n = e;
        !(function NE() {
          $.lFrame.elementDepthCount--;
        })();
        const t = re();
        return (
          t.firstCreatePass && (qa(t, e), xu(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function UE(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            Cf(t, n, w(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function $E(e) {
              return 0 != (32 & e.flags);
            })(n) &&
            Cf(t, n, w(), n.stylesWithoutHost, !1),
          E
        );
      }
      function Oe(e, n, t, r) {
        return N(e, n, t, r), E(), Oe;
      }
      function Ts(e) {
        return !!e && 'function' == typeof e.then;
      }
      const Ef = function ry(e) {
        return !!e && 'function' == typeof e.subscribe;
      };
      function oe(e, n, t, r) {
        const i = w(),
          o = re(),
          s = nt();
        return (
          (function oy(e, n, t, r, i, o, s, a) {
            const l = $a(r),
              u = e.firstCreatePass && Gv(e),
              d = n[8],
              f = jv(n);
            let h = !0;
            if (3 & r.type || a) {
              const v = nn(r, n),
                y = a ? a(v) : v,
                D = f.length,
                b = a ? (A) => a(qe(A[r.index])) : r.index;
              let C = null;
              if (
                (!a &&
                  l &&
                  (C = (function UA(e, n, t, r) {
                    const i = e.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === t && i[o + 1] === r) {
                          const a = n[7],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        'string' == typeof s && (o += 2);
                      }
                    return null;
                  })(e, n, i, r.index)),
                null !== C)
              )
                ((C.__ngLastListenerFn__ || C).__ngNextListenerFn__ = o), (C.__ngLastListenerFn__ = o), (h = !1);
              else {
                o = ay(r, n, d, o, !1);
                const A = t.listen(y, i, o);
                f.push(o, A), u && u.push(i, b, D, D + 1);
              }
            } else o = ay(r, n, d, o, !1);
            const p = r.outputs;
            let g;
            if (h && null !== p && (g = p[i])) {
              const v = g.length;
              if (v)
                for (let y = 0; y < v; y += 2) {
                  const x = n[g[y]][g[y + 1]].subscribe(o),
                    ie = f.length;
                  f.push(o, x), u && u.push(i, r.index, ie, -(ie + 1));
                }
            }
          })(o, i, i[Y], s, e, n, 0, r),
          oe
        );
      }
      function sy(e, n, t, r) {
        try {
          return !1 !== t(r);
        } catch (i) {
          return $v(e, i), !1;
        }
      }
      function ay(e, n, t, r, i) {
        return function o(s) {
          if (s === Function) return r;
          _f(2 & e.flags ? Wt(e.index, n) : n);
          let l = sy(n, 0, r, s),
            c = o.__ngNextListenerFn__;
          for (; c; ) (l = sy(n, 0, c, s) && l), (c = c.__ngNextListenerFn__);
          return i && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function ue(e = 1) {
        return (function RE(e) {
          return ($.lFrame.contextLView = (function PE(e, n) {
            for (; e > 0; ) (n = n[15]), e--;
            return n;
          })(e, $.lFrame.contextLView))[8];
        })(e);
      }
      function $A(e, n) {
        let t = null;
        const r = (function dO(e) {
          const n = e.attrs;
          if (null != n) {
            const t = n.indexOf(5);
            if (0 == (1 & t)) return n[t + 1];
          }
          return null;
        })(e);
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          if ('*' !== o) {
            if (null === r ? tv(e, o, !0) : pO(r, o)) return i;
          } else t = i;
        }
        return t;
      }
      function vy(e, n, t, r, i) {
        const o = e[t + 1],
          s = null === n;
        let a = r ? yn(o) : ar(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const u = e[a + 1];
          KA(e[a], n) && ((l = !0), (e[a + 1] = r ? Jd(u) : Xd(u))), (a = r ? yn(u) : ar(u));
        }
        l && (e[t + 1] = r ? Xd(o) : Jd(o));
      }
      function KA(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || 'string' != typeof n) && Ki(e, n) >= 0)
        );
      }
      const it = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function yy(e) {
        return e.substring(it.key, it.keyEnd);
      }
      function by(e, n) {
        const t = it.textEnd;
        return t === n
          ? -1
          : ((n = it.keyEnd =
              (function YA(e, n, t) {
                for (; n < t && e.charCodeAt(n) > 32; ) n++;
                return n;
              })(e, (it.key = n), t)),
            go(e, n, t));
      }
      function go(e, n, t) {
        for (; n < t && e.charCodeAt(n) <= 32; ) n++;
        return n;
      }
      function He(e, n) {
        return (
          (function Dn(e, n, t, r) {
            const i = w(),
              o = re(),
              s = ir(2);
            o.firstUpdatePass && Ey(o, e, s, r),
              n !== z &&
                Tt(i, s, n) &&
                My(
                  o,
                  o.data[Rt()],
                  i,
                  i[Y],
                  e,
                  (i[s + 1] = (function aI(e, n) {
                    return null == e || ('string' == typeof n ? (e += n) : 'object' == typeof e && (e = be(Mr(e)))), e;
                  })(n, t)),
                  r,
                  s
                );
          })(e, n, null, !0),
          He
        );
      }
      function ai(e) {
        !(function wn(e, n, t, r) {
          const i = re(),
            o = ir(2);
          i.firstUpdatePass && Ey(i, null, o, r);
          const s = w();
          if (t !== z && Tt(s, o, t)) {
            const a = i.data[Rt()];
            if (Ay(a, r) && !Ty(i, o)) {
              let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== l && (t = Eu(l, t || '')), Cf(i, a, s, t, r);
            } else
              !(function sI(e, n, t, r, i, o, s, a) {
                i === z && (i = ce);
                let l = 0,
                  c = 0,
                  u = 0 < i.length ? i[0] : null,
                  d = 0 < o.length ? o[0] : null;
                for (; null !== u || null !== d; ) {
                  const f = l < i.length ? i[l + 1] : void 0,
                    h = c < o.length ? o[c + 1] : void 0;
                  let g,
                    p = null;
                  u === d
                    ? ((l += 2), (c += 2), f !== h && ((p = d), (g = h)))
                    : null === d || (null !== u && u < d)
                    ? ((l += 2), (p = u))
                    : ((c += 2), (p = d), (g = h)),
                    null !== p && My(e, n, t, r, p, g, s, a),
                    (u = l < i.length ? i[l] : null),
                    (d = c < o.length ? o[c] : null);
                }
              })(
                i,
                a,
                s,
                s[Y],
                s[o + 1],
                (s[o + 1] = (function oI(e, n, t) {
                  if (null == t || '' === t) return ce;
                  const r = [],
                    i = Mr(t);
                  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) e(r, i[o], !0);
                  else if ('object' == typeof i) for (const o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
                  else 'string' == typeof i && n(r, i);
                  return r;
                })(e, n, t)),
                r,
                o
              );
          }
        })(Kt, Gn, e, !0);
      }
      function Gn(e, n) {
        for (
          let t = (function QA(e) {
            return (
              (function wy(e) {
                (it.key = 0), (it.keyEnd = 0), (it.value = 0), (it.valueEnd = 0), (it.textEnd = e.length);
              })(e),
              by(e, go(e, 0, it.textEnd))
            );
          })(n);
          t >= 0;
          t = by(n, t)
        )
          Kt(e, yy(n), !0);
      }
      function Ty(e, n) {
        return n >= e.expandoStartIndex;
      }
      function Ey(e, n, t, r) {
        const i = e.data;
        if (null === i[t + 1]) {
          const o = i[Rt()],
            s = Ty(e, t);
          Ay(o, r) && null === n && !s && (n = !1),
            (n = (function tI(e, n, t, r) {
              const i = (function $u(e) {
                const n = $.lFrame.currentDirectiveIndex;
                return -1 === n ? null : e[n];
              })(e);
              let o = r ? n.residualClasses : n.residualStyles;
              if (null === i)
                0 === (r ? n.classBindings : n.styleBindings) &&
                  ((t = Es((t = Of(null, e, n, t, r)), n.attrs, r)), (o = null));
              else {
                const s = n.directiveStylingLast;
                if (-1 === s || e[s] !== i)
                  if (((t = Of(i, e, n, t, r)), null === o)) {
                    let l = (function nI(e, n, t) {
                      const r = t ? n.classBindings : n.styleBindings;
                      if (0 !== ar(r)) return e[yn(r)];
                    })(e, n, r);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = Of(null, e, n, l[1], r)),
                      (l = Es(l, n.attrs, r)),
                      (function rI(e, n, t, r) {
                        e[yn(t ? n.classBindings : n.styleBindings)] = r;
                      })(e, n, r, l));
                  } else
                    o = (function iI(e, n, t) {
                      let r;
                      const i = n.directiveEnd;
                      for (let o = 1 + n.directiveStylingLast; o < i; o++) r = Es(r, e[o].hostAttrs, t);
                      return Es(r, n.attrs, t);
                    })(e, n, r);
              }
              return void 0 !== o && (r ? (n.residualClasses = o) : (n.residualStyles = o)), t;
            })(i, o, n, r)),
            (function WA(e, n, t, r, i, o) {
              let s = o ? n.classBindings : n.styleBindings,
                a = yn(s),
                l = ar(s);
              e[r] = t;
              let u,
                c = !1;
              if (Array.isArray(t)) {
                const d = t;
                (u = d[1]), (null === u || Ki(d, u) > 0) && (c = !0);
              } else u = t;
              if (i)
                if (0 !== l) {
                  const f = yn(e[a + 1]);
                  (e[r + 1] = vl(f, a)),
                    0 !== f && (e[f + 1] = Yd(e[f + 1], r)),
                    (e[a + 1] = (function kO(e, n) {
                      return (131071 & e) | (n << 17);
                    })(e[a + 1], r));
                } else (e[r + 1] = vl(a, 0)), 0 !== a && (e[a + 1] = Yd(e[a + 1], r)), (a = r);
              else (e[r + 1] = vl(l, 0)), 0 === a ? (a = r) : (e[l + 1] = Yd(e[l + 1], r)), (l = r);
              c && (e[r + 1] = Xd(e[r + 1])),
                vy(e, u, r, !0),
                vy(e, u, r, !1),
                (function zA(e, n, t, r, i) {
                  const o = i ? e.residualClasses : e.residualStyles;
                  null != o && 'string' == typeof n && Ki(o, n) >= 0 && (t[r + 1] = Jd(t[r + 1]));
                })(n, u, e, r, o),
                (s = vl(a, l)),
                o ? (n.classBindings = s) : (n.styleBindings = s);
            })(i, o, n, t, s, r);
        }
      }
      function Of(e, n, t, r, i) {
        let o = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (-1 === a ? (a = t.directiveStart) : a++; a < s && ((o = n[a]), (r = Es(r, o.hostAttrs, i)), o !== e); )
          a++;
        return null !== e && (t.directiveStylingLast = a), r;
      }
      function Es(e, n, t) {
        const r = t ? 1 : 2;
        let i = -1;
        if (null !== n)
          for (let o = 0; o < n.length; o++) {
            const s = n[o];
            'number' == typeof s
              ? (i = s)
              : i === r && (Array.isArray(e) || (e = void 0 === e ? [] : ['', e]), Kt(e, s, !!t || n[++o]));
          }
        return void 0 === e ? null : e;
      }
      function My(e, n, t, r, i, o, s, a) {
        if (!(3 & n.type)) return;
        const l = e.data,
          c = l[a + 1];
        Ol(
          (function mv(e) {
            return 1 == (1 & e);
          })(c)
            ? Oy(l, n, t, i, ar(c), s)
            : void 0
        ) ||
          (Ol(o) ||
            ((function _v(e) {
              return 2 == (2 & e);
            })(c) &&
              (o = Oy(l, null, t, i, a, s))),
          (function sO(e, n, t, r, i) {
            if (n) i ? e.addClass(t, r) : e.removeClass(t, r);
            else {
              let o = -1 === r.indexOf('-') ? void 0 : Bt.DashCase;
              null == i
                ? e.removeStyle(t, r, o)
                : ('string' == typeof i && i.endsWith('!important') && ((i = i.slice(0, -10)), (o |= Bt.Important)),
                  e.setStyle(t, r, i, o));
            }
          })(r, s, Wa(Rt(), t), i, o));
      }
      function Oy(e, n, t, r, i, o) {
        const s = null === n;
        let a;
        for (; i > 0; ) {
          const l = e[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let f = t[i + 1];
          f === z && (f = d ? ce : void 0);
          let h = d ? nd(f, r) : u === r ? f : void 0;
          if ((c && !Ol(h) && (h = nd(l, r)), Ol(h) && ((a = h), s))) return a;
          const p = e[i + 1];
          i = s ? yn(p) : ar(p);
        }
        if (null !== n) {
          let l = o ? n.residualClasses : n.residualStyles;
          null != l && (a = nd(l, r));
        }
        return a;
      }
      function Ol(e) {
        return void 0 !== e;
      }
      function Ay(e, n) {
        return 0 != (e.flags & (n ? 16 : 32));
      }
      function m(e, n = '') {
        const t = w(),
          r = re(),
          i = e + 22,
          o = r.firstCreatePass ? ro(r, i, 1, n, null) : r.data[i],
          s = (t[i] = (function Ld(e, n) {
            return e.createText(n);
          })(t[Y], n));
        gl(r, t, s, o), Fn(o, !1);
      }
      function Ss(e) {
        return Un('', e, ''), Ss;
      }
      function Un(e, n, t) {
        const r = w(),
          i = (function so(e, n, t, r) {
            return Tt(e, Bi(), t) ? n + W(t) + r : z;
          })(r, e, n, t);
        return (
          i !== z &&
            (function lr(e, n, t) {
              const r = Wa(n, e);
              !(function Lm(e, n, t) {
                e.setValue(n, t);
              })(e[Y], r, t);
            })(r, Rt(), i),
          Un
        );
      }
      function _o(e, n, t) {
        const r = w();
        return Tt(r, Bi(), n) && qt(re(), Be(), r, e, n, r[Y], t, !0), _o;
      }
      const vo = 'en-US';
      let Yy = vo;
      function Pf(e, n, t, r, i) {
        if (((e = U(e)), Array.isArray(e))) for (let o = 0; o < e.length; o++) Pf(e[o], n, t, r, i);
        else {
          const o = re(),
            s = w();
          let a = ri(e) ? e : U(e.provide),
            l = bm(e);
          const c = nt(),
            u = 1048575 & c.providerIndexes,
            d = c.directiveStart,
            f = c.providerIndexes >> 20;
          if (ri(e) || !e.multi) {
            const h = new Jo(l, i, _),
              p = Ff(a, n, i ? u : u + f, d);
            -1 === p
              ? (tl(es(c, s), o, a),
                xf(o, e, n.length),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                t.push(h),
                s.push(h))
              : ((t[p] = h), (s[p] = h));
          } else {
            const h = Ff(a, n, u + f, d),
              p = Ff(a, n, u, u + f),
              g = h >= 0 && t[h],
              v = p >= 0 && t[p];
            if ((i && !v) || (!i && !g)) {
              tl(es(c, s), o, a);
              const y = (function CR(e, n, t, r, i) {
                const o = new Jo(e, t, _);
                return (o.multi = []), (o.index = n), (o.componentProviders = 0), C0(o, i, r && !t), o;
              })(i ? wR : DR, t.length, i, r, l);
              !i && v && (t[p].providerFactory = y),
                xf(o, e, n.length, 0),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                t.push(y),
                s.push(y);
            } else xf(o, e, h > -1 ? h : p, C0(t[i ? p : h], l, !i && r));
            !i && r && v && t[p].componentProviders++;
          }
        }
      }
      function xf(e, n, t, r) {
        const i = ri(n),
          o = (function eM(e) {
            return !!e.useClass;
          })(n);
        if (i || o) {
          const l = (o ? U(n.useClass) : n).prototype.ngOnDestroy;
          if (l) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!i && n.multi) {
              const u = c.indexOf(t);
              -1 === u ? c.push(t, [r, l]) : c[u + 1].push(r, l);
            } else c.push(t, l);
          }
        }
      }
      function C0(e, n, t) {
        return t && e.componentProviders++, e.multi.push(n) - 1;
      }
      function Ff(e, n, t, r) {
        for (let i = t; i < r; i++) if (n[i] === e) return i;
        return -1;
      }
      function DR(e, n, t, r) {
        return kf(this.multi, []);
      }
      function wR(e, n, t, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = ts(t, t[1], this.providerFactory.index, r);
          (o = a.slice(0, s)), kf(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), kf(i, o);
        return o;
      }
      function kf(e, n) {
        for (let t = 0; t < e.length; t++) n.push((0, e[t])());
        return n;
      }
      function Ee(e, n = []) {
        return (t) => {
          t.providersResolver = (r, i) =>
            (function bR(e, n, t) {
              const r = re();
              if (r.firstCreatePass) {
                const i = pn(e);
                Pf(t, r.data, r.blueprint, i, !0), Pf(n, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(e) : e, n);
        };
      }
      class ci {}
      class N0 {}
      class T0 extends ci {
        constructor(n, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new bf(this));
          const r = Ut(n);
          (this._bootstrapComponents = sr(r.bootstrap)),
            (this._r3Injector = lv(
              n,
              t,
              [
                { provide: ci, useValue: this },
                { provide: gs, useValue: this.componentFactoryResolver },
              ],
              be(n),
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
      class Lf extends N0 {
        constructor(n) {
          super(), (this.moduleType = n);
        }
        create(n) {
          return new T0(this.moduleType, n);
        }
      }
      class TR extends ci {
        constructor(n, t, r) {
          super(), (this.componentFactoryResolver = new bf(this)), (this.instance = null);
          const i = new ym(
            [...n, { provide: ci, useValue: this }, { provide: gs, useValue: this.componentFactoryResolver }],
            t || hl(),
            r,
            new Set(['environment'])
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(n) {
          this.injector.onDestroy(n);
        }
      }
      function xl(e, n, t = null) {
        return new TR(e, n, t).injector;
      }
      function R0(e, n, t, r, i, o) {
        const s = n + t;
        return Tt(e, s, i)
          ? (function Bn(e, n, t) {
              return (e[n] = t);
            })(e, s + 1, o ? r.call(o, i) : r(i))
          : (function xs(e, n) {
              const t = e[n];
              return t === z ? void 0 : t;
            })(e, s + 1);
      }
      function Fs(e, n) {
        const t = re();
        let r;
        const i = e + 22;
        t.firstCreatePass
          ? ((r = (function UR(e, n) {
              if (n)
                for (let t = n.length - 1; t >= 0; t--) {
                  const r = n[t];
                  if (e === r.name) return r;
                }
            })(n, t.pipeRegistry)),
            (t.data[i] = r),
            r.onDestroy && (t.destroyHooks || (t.destroyHooks = [])).push(i, r.onDestroy))
          : (r = t.data[i]);
        const o = r.factory || (r.factory = ti(r.type)),
          s = Zt(_);
        try {
          const a = Za(!1),
            l = o();
          return (
            Za(a),
            (function HA(e, n, t, r) {
              t >= e.data.length && ((e.data[t] = null), (e.blueprint[t] = null)), (n[t] = r);
            })(t, w(), i, l),
            l
          );
        } finally {
          Zt(s);
        }
      }
      function ks(e, n, t) {
        const r = e + 22,
          i = w(),
          o = Vi(i, r);
        return (function Ls(e, n) {
          return e[1].data[n].pure;
        })(i, r)
          ? R0(i, It(), n, o.transform, t, o)
          : o.transform(t);
      }
      function Hf(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const j = class qR extends pe {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, r) {
          let i = n,
            o = t || (() => null),
            s = r;
          if (n && 'object' == typeof n) {
            const l = n;
            (i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = Hf(o)), i && (i = Hf(i)), s && (s = Hf(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return n instanceof Lt && n.add(a), a;
        }
      };
      function QR() {
        return this._results[oi()]();
      }
      class jf {
        constructor(n = !1) {
          (this._emitDistinctChangesOnly = n),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = oi(),
            r = jf.prototype;
          r[t] || (r[t] = QR);
        }
        get changes() {
          return this._changes || (this._changes = new j());
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
          const r = this;
          r.dirty = !1;
          const i = zt(n);
          (this._changesDetected = !(function eS(e, n, t) {
            if (e.length !== n.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let i = e[r],
                o = n[r];
              if ((t && ((i = t(i)), (o = t(o))), o !== i)) return !1;
            }
            return !0;
          })(r._results, i, t)) &&
            ((r._results = i), (r.length = i.length), (r.last = i[this.length - 1]), (r.first = i[0]));
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
      let Ge = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = JR), e;
      })();
      const XR = Ge,
        YR = class extends XR {
          constructor(n, t, r) {
            super(), (this._declarationLView = n), (this._declarationTContainer = t), (this.elementRef = r);
          }
          createEmbeddedView(n, t) {
            const r = this._declarationTContainer.tViews,
              i = Dl(this._declarationLView, r, n, 16, null, r.declTNode, null, null, null, null, t || null);
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return null !== s && (i[19] = s.createEmbeddedView(r)), wl(r, i, n), new Ds(i);
          }
        };
      function JR() {
        return Fl(nt(), w());
      }
      function Fl(e, n) {
        return 4 & e.type ? new YR(n, e, Ji(e, n)) : null;
      }
      let Cn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = ZR), e;
      })();
      function ZR() {
        return B0(nt(), w());
      }
      const eP = Cn,
        L0 = class extends eP {
          constructor(n, t, r) {
            super(), (this._lContainer = n), (this._hostTNode = t), (this._hostLView = r);
          }
          get element() {
            return Ji(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Gi(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = el(this._hostTNode, this._hostLView);
            if (O_(n)) {
              const t = ji(n, this._hostLView),
                r = Hi(n);
              return new Gi(t[1].data[r + 8], t);
            }
            return new Gi(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = V0(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(n, t, r) {
            let i, o;
            'number' == typeof r ? (i = r) : null != r && ((i = r.index), (o = r.injector));
            const s = n.createEmbeddedView(t || {}, o);
            return this.insert(s, i), s;
          }
          createComponent(n, t, r, i, o) {
            const s =
              n &&
              !(function rs(e) {
                return 'function' == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const d = t || {};
              (a = d.index), (r = d.injector), (i = d.projectableNodes), (o = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? n : new ws(_e(n)),
              c = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const f = (s ? c : this.parentInjector).get(Or, null);
              f && (o = f);
            }
            const u = l.create(c, i, void 0, o);
            return this.insert(u.hostView, a), u;
          }
          insert(n, t) {
            const r = n._lView,
              i = r[1];
            if (
              (function DE(e) {
                return hn(e[3]);
              })(r)
            ) {
              const u = this.indexOf(n);
              if (-1 !== u) this.detach(u);
              else {
                const d = r[3],
                  f = new L0(d, d[6], d[3]);
                f.detach(f.indexOf(n));
              }
            }
            const o = this._adjustIndex(t),
              s = this._lContainer;
            !(function JM(e, n, t, r) {
              const i = 10 + r,
                o = t.length;
              r > 0 && (t[i - 1][4] = n),
                r < o - 10 ? ((n[4] = t[i]), H_(t, 10 + r, n)) : (t.push(n), (n[4] = null)),
                (n[3] = t);
              const s = n[17];
              null !== s &&
                t !== s &&
                (function ZM(e, n) {
                  const t = e[9];
                  n[16] !== n[3][3][16] && (e[2] = !0), null === t ? (e[9] = [n]) : t.push(n);
                })(s, n);
              const a = n[19];
              null !== a && a.insertView(e), (n[2] |= 64);
            })(i, r, s, o);
            const a = Gd(o, s),
              l = r[Y],
              c = pl(l, s[7]);
            return (
              null !== c &&
                (function QM(e, n, t, r, i, o) {
                  (r[0] = i), (r[6] = n), ys(e, r, t, 1, i, o);
                })(i, s[6], l, r, c, a),
              n.attachToViewContainerRef(),
              H_(Gf(s), o, n),
              n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = V0(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              r = Bd(this._lContainer, t);
            r && (rl(Gf(this._lContainer), t), Bm(r[1], r));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              r = Bd(this._lContainer, t);
            return r && null != rl(Gf(this._lContainer), t) ? new Ds(r) : null;
          }
          _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
          }
        };
      function V0(e) {
        return e[8];
      }
      function Gf(e) {
        return e[8] || (e[8] = []);
      }
      function B0(e, n) {
        let t;
        const r = n[e.index];
        if (hn(r)) t = r;
        else {
          let i;
          if (8 & e.type) i = qe(r);
          else {
            const o = n[Y];
            i = o.createComment('');
            const s = nn(e, n);
            ii(
              o,
              pl(o, s),
              i,
              (function rO(e, n) {
                return e.nextSibling(n);
              })(o, s),
              !1
            );
          }
          (n[e.index] = t = Vv(r, n, i, e)), Cl(n, t);
        }
        return new L0(t, e, n);
      }
      class Uf {
        constructor(n) {
          (this.queryList = n), (this.matches = null);
        }
        clone() {
          return new Uf(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class $f {
        constructor(n = []) {
          this.queries = n;
        }
        createEmbeddedView(n) {
          const t = n.queries;
          if (null !== t) {
            const r = null !== n.contentQueries ? n.contentQueries[0] : t.length,
              i = [];
            for (let o = 0; o < r; o++) {
              const s = t.getByIndex(o);
              i.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new $f(i);
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
          for (let t = 0; t < this.queries.length; t++) null !== $0(n, t).matches && this.queries[t].setDirty();
        }
      }
      class H0 {
        constructor(n, t, r = null) {
          (this.predicate = n), (this.flags = t), (this.read = r);
        }
      }
      class Wf {
        constructor(n = []) {
          this.queries = n;
        }
        elementStart(n, t) {
          for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(n, t);
        }
        elementEnd(n) {
          for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
          let t = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== t ? t.length : 0,
              o = this.getByIndex(r).embeddedTView(n, i);
            o && ((o.indexInDeclarationView = r), null !== t ? t.push(o) : (t = [o]));
          }
          return null !== t ? new Wf(t) : null;
        }
        template(n, t) {
          for (let r = 0; r < this.queries.length; r++) this.queries[r].template(n, t);
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
      class zf {
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
            ? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, t), new zf(this.metadata))
            : null;
        }
        isApplyingToNode(n) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let r = n.parent;
            for (; null !== r && 8 & r.type && r.index !== t; ) r = r.parent;
            return t === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(n, t) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              this.matchTNodeWithReadOption(n, t, rP(t, o)), this.matchTNodeWithReadOption(n, t, nl(t, n, o, !1, !1));
            }
          else
            r === Ge
              ? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
              : this.matchTNodeWithReadOption(n, t, nl(t, n, r, !1, !1));
        }
        matchTNodeWithReadOption(n, t, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === De || i === Cn || (i === Ge && 4 & t.type)) this.addMatch(t.index, -2);
              else {
                const o = nl(t, n, i, !1, !1);
                null !== o && this.addMatch(t.index, o);
              }
            else this.addMatch(t.index, r);
          }
        }
        addMatch(n, t) {
          null === this.matches ? (this.matches = [n, t]) : this.matches.push(n, t);
        }
      }
      function rP(e, n) {
        const t = e.localNames;
        if (null !== t) for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
        return null;
      }
      function oP(e, n, t, r) {
        return -1 === t
          ? (function iP(e, n) {
              return 11 & e.type ? Ji(e, n) : 4 & e.type ? Fl(e, n) : null;
            })(n, e)
          : -2 === t
          ? (function sP(e, n, t) {
              return t === De ? Ji(n, e) : t === Ge ? Fl(n, e) : t === Cn ? B0(n, e) : void 0;
            })(e, n, r)
          : ts(e, e[1], t, n);
      }
      function j0(e, n, t, r) {
        const i = n[19].queries[r];
        if (null === i.matches) {
          const o = e.data,
            s = t.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const c = s[l];
            a.push(c < 0 ? null : oP(n, o[c], s[l + 1], t.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function Kf(e, n, t, r) {
        const i = e.queries.getByIndex(t),
          o = i.matches;
        if (null !== o) {
          const s = j0(e, n, i, t);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const c = o[a + 1],
                u = n[-l];
              for (let d = 10; d < u.length; d++) {
                const f = u[d];
                f[17] === f[3] && Kf(f[1], f, c, r);
              }
              if (null !== u[9]) {
                const d = u[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  Kf(h[1], h, c, r);
                }
              }
            }
          }
        }
        return r;
      }
      function Pe(e) {
        const n = w(),
          t = re(),
          r = y_();
        Wu(r + 1);
        const i = $0(t, r);
        if (e.dirty && f_(n) === (2 == (2 & i.metadata.flags))) {
          if (null === i.matches) e.reset([]);
          else {
            const o = i.crossesNgTemplate ? Kf(t, n, r, []) : j0(t, n, i, r);
            e.reset(o, fM), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function ze(e, n, t, r) {
        const i = re();
        if (i.firstCreatePass) {
          const o = nt();
          U0(i, new H0(n, t, r), o.index),
            (function lP(e, n) {
              const t = e.contentQueries || (e.contentQueries = []);
              n !== (t.length ? t[t.length - 1] : -1) && t.push(e.queries.length - 1, n);
            })(i, e),
            2 == (2 & t) && (i.staticContentQueries = !0);
        }
        G0(i, w(), t);
      }
      function xe() {
        return (function aP(e, n) {
          return e[19].queries[n].queryList;
        })(w(), y_());
      }
      function G0(e, n, t) {
        const r = new jf(4 == (4 & t));
        Ov(e, n, r, r.destroy), null === n[19] && (n[19] = new $f()), n[19].queries.push(new Uf(r));
      }
      function U0(e, n, t) {
        null === e.queries && (e.queries = new Wf()), e.queries.track(new zf(n, t));
      }
      function $0(e, n) {
        return e.queries.getByIndex(n);
      }
      function $n(e, n) {
        return Fl(e, n);
      }
      function Ll(...e) {}
      const Bs = new k('Application Initializer');
      let Vl = (() => {
        class e {
          constructor(t) {
            (this.appInits = t),
              (this.resolve = Ll),
              (this.reject = Ll),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (Ts(o)) t.push(o);
                else if (Ef(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  t.push(s);
                }
              }
            Promise.all(t)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === t.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(Bs, 8));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      const Hs = new k('AppId', {
        providedIn: 'root',
        factory: function cb() {
          return `${Zf()}${Zf()}${Zf()}`;
        },
      });
      function Zf() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const ub = new k('Platform Initializer'),
        Co = new k('Platform ID', { providedIn: 'platform', factory: () => 'unknown' }),
        db = new k('appBootstrapListener');
      let MP = (() => {
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
      const cr = new k('LocaleId', {
        providedIn: 'root',
        factory: () =>
          We(cr, B.Optional | B.SkipSelf) ||
          (function OP() {
            return (typeof $localize < 'u' && $localize.locale) || vo;
          })(),
      });
      class IP {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let eh = (() => {
        class e {
          compileModuleSync(t) {
            return new Lf(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const r = this.compileModuleSync(t),
              o = sr(Ut(t).declarations).reduce((s, a) => {
                const l = _e(a);
                return l && s.push(new ws(l)), s;
              }, []);
            return new IP(r, o);
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
      const xP = (() => Promise.resolve(0))();
      function th(e) {
        typeof Zone > 'u'
          ? xP.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask('scheduleMicrotask', e);
      }
      class me {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new j(!1)),
            (this.onMicrotaskEmpty = new j(!1)),
            (this.onStable = new j(!1)),
            (this.onError = new j(!1)),
            typeof Zone > 'u')
          )
            throw new S(908, !1);
          Zone.assertZonePatched();
          const i = this;
          if (((i._nesting = 0), (i._outer = i._inner = Zone.current), Zone.AsyncStackTaggingZoneSpec)) {
            const o = Zone.AsyncStackTaggingZoneSpec;
            i._inner = i._inner.fork(new o('Angular'));
          }
          Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && t),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function FP() {
              let e = ge.requestAnimationFrame,
                n = ge.cancelAnimationFrame;
              if (typeof Zone < 'u' && e && n) {
                const t = e[Zone.__symbol__('OriginalDelegate')];
                t && (e = t);
                const r = n[Zone.__symbol__('OriginalDelegate')];
                r && (n = r);
              }
              return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
            })().nativeRequestAnimationFrame),
            (function VP(e) {
              const n = () => {
                !(function LP(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(ge, () => {
                      e.fakeTopEventTask ||
                        (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                          'fakeTopEventTask',
                          () => {
                            (e.lastRequestAnimationFrameId = -1),
                              rh(e),
                              (e.isCheckStableRunning = !0),
                              nh(e),
                              (e.isCheckStableRunning = !1);
                          },
                          void 0,
                          () => {},
                          () => {}
                        )),
                        e.fakeTopEventTask.invoke();
                    })),
                    rh(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: 'angular',
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, r, i, o, s, a) => {
                  try {
                    return pb(e), t.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection && 'eventTask' === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      gb(e);
                  }
                },
                onInvoke: (t, r, i, o, s, a, l) => {
                  try {
                    return pb(e), t.invoke(i, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), gb(e);
                  }
                },
                onHasTask: (t, r, i, o) => {
                  t.hasTask(i, o),
                    r === i &&
                      ('microTask' == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask), rh(e), nh(e))
                        : 'macroTask' == o.change && (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (t, r, i, o) => (t.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1),
              });
            })(i);
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
        run(n, t, r) {
          return this._inner.run(n, t, r);
        }
        runTask(n, t, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask('NgZoneEvent: ' + i, n, kP, Ll, Ll);
          try {
            return o.runTask(s, t, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(n, t, r) {
          return this._inner.runGuarded(n, t, r);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const kP = {};
      function nh(e) {
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
      function rh(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function pb(e) {
        e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function gb(e) {
        e._nesting--, nh(e);
      }
      class BP {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new j()),
            (this.onMicrotaskEmpty = new j()),
            (this.onStable = new j()),
            (this.onError = new j());
        }
        run(n, t, r) {
          return n.apply(t, r);
        }
        runGuarded(n, t, r) {
          return n.apply(t, r);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, r, i) {
          return n.apply(t, r);
        }
      }
      const _b = new k(''),
        Bl = new k('');
      let sh,
        ih = (() => {
          class e {
            constructor(t, r, i) {
              (this._ngZone = t),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                sh ||
                  ((function HP(e) {
                    sh = e;
                  })(i),
                  i.addToWindow(r)),
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
                        th(() => {
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
                th(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) => !r.updateCb || !r.updateCb(t) || (clearTimeout(r.timeoutId), !1)
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
            addCallback(t, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter((s) => s.timeoutId !== o)),
                    t(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: i });
            }
            whenStable(t, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, r, i), this._runCallbacksIfReady();
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
            findProviders(t, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(me), T(oh), T(Bl));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        oh = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, r) {
              this._applications.set(t, r);
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
            findTestabilityInTree(t, r = !0) {
              return sh?.findTestabilityInTree(this, t, r) ?? null;
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
        Pr = null;
      const mb = new k('AllowMultipleToken'),
        ah = new k('PlatformDestroyListeners');
      class vb {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function bb(e, n, t = []) {
        const r = `Platform: ${n}`,
          i = new k(r);
        return (o = []) => {
          let s = lh();
          if (!s || s.injector.get(mb, !1)) {
            const a = [...t, ...o, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function UP(e) {
                  if (Pr && !Pr.get(mb, !1)) throw new S(400, !1);
                  Pr = e;
                  const n = e.get(wb);
                  (function yb(e) {
                    const n = e.get(ub, null);
                    n && n.forEach((t) => t());
                  })(e);
                })(
                  (function Db(e = [], n) {
                    return _t.create({
                      name: n,
                      providers: [
                        { provide: vd, useValue: 'platform' },
                        { provide: ah, useValue: new Set([() => (Pr = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function WP(e) {
            const n = lh();
            if (!n) throw new S(401, !1);
            return n;
          })();
        };
      }
      function lh() {
        return Pr?.get(wb) ?? null;
      }
      let wb = (() => {
        class e {
          constructor(t) {
            (this._injector = t), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, r) {
            const i = (function zP(e, n) {
                let t;
                return (t = 'noop' === e ? new BP() : ('zone.js' === e ? void 0 : e) || new me(n)), t;
              })(
                r?.ngZone,
                (function Cb(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection: !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection: !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              o = [{ provide: me, useValue: i }];
            return i.run(() => {
              const s = _t.create({ providers: o, parent: this.injector, name: t.moduleType.name }),
                a = t.create(s),
                l = a.injector.get(Zi, null);
              if (!l) throw new S(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const c = i.onError.subscribe({
                    next: (u) => {
                      l.handleError(u);
                    },
                  });
                  a.onDestroy(() => {
                    Hl(this._modules, a), c.unsubscribe();
                  });
                }),
                (function Nb(e, n, t) {
                  try {
                    const r = t();
                    return Ts(r)
                      ? r.catch((i) => {
                          throw (n.runOutsideAngular(() => e.handleError(i)), i);
                        })
                      : r;
                  } catch (r) {
                    throw (n.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(l, i, () => {
                  const c = a.injector.get(Vl);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        (function Jy(e) {
                          Gt(e, 'Expected localeId to be defined'),
                            'string' == typeof e && (Yy = e.toLowerCase().replace(/_/g, '-'));
                        })(a.injector.get(cr, vo) || vo),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, r = []) {
            const i = Tb({}, r);
            return (function jP(e, n, t) {
              const r = new Lf(t);
              return Promise.resolve(r);
            })(0, 0, t).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(No);
            if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!t.instance.ngDoBootstrap) throw new S(403, !1);
              t.instance.ngDoBootstrap(r);
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
            this._modules.slice().forEach((r) => r.destroy()), this._destroyListeners.forEach((r) => r());
            const t = this._injector.get(ah, null);
            t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(_t));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'platform' })),
          e
        );
      })();
      function Tb(e, n) {
        return Array.isArray(n) ? n.reduce(Tb, e) : { ...e, ...n };
      }
      let No = (() => {
        class e {
          constructor(t, r, i) {
            (this._zone = t),
              (this._injector = r),
              (this._exceptionHandler = i),
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
                      th(() => {
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
            this.isStable = xa(o, s.pipe(Jg()));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(t, r) {
            const i = t instanceof Dm;
            if (!this._injector.get(Vl).done)
              throw (
                (!i &&
                  (function Do(e) {
                    const n = _e(e) || Ot(e) || At(e);
                    return null !== n && n.standalone;
                  })(t),
                new S(405, false))
              );
            let s;
            (s = i ? t : this._injector.get(gs).resolveComponentFactory(t)), this.componentTypes.push(s.componentType);
            const a = (function GP(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(ci),
              c = s.create(_t.NULL, [], r || s.selector, a),
              u = c.location.nativeElement,
              d = c.injector.get(_b, null);
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
            const r = t;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(t) {
            const r = t;
            Hl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView),
              this.tick(),
              this.components.push(t),
              this._injector
                .get(db, [])
                .concat(this._bootstrapListeners)
                .forEach((i) => i(t));
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
            return new (t || e)(T(me), T(Or), T(Zi));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      function Hl(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      let Sb = !0,
        Tn = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = QP), e;
        })();
      function QP(e) {
        return (function XP(e, n, t) {
          if (Ua(e) && !t) {
            const r = Wt(e.index, n);
            return new Ds(r, r);
          }
          return 47 & e.type ? new Ds(n[16], n) : null;
        })(nt(), w(), 16 == (16 & e));
      }
      class Rb {
        constructor() {}
        supports(n) {
          return Cs(n);
        }
        create(n) {
          return new nx(n);
        }
      }
      const tx = (e, n) => n;
      class nx {
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
            (this._trackByFn = n || tx);
        }
        forEachItem(n) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) n(t);
        }
        forEachOperation(n) {
          let t = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; t || r; ) {
            const s = !r || (t && t.currentIndex < xb(r, i, o)) ? t : r,
              a = xb(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const c = a - i,
                u = l - i;
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
          let i,
            o,
            s,
            t = this._itHead,
            r = !1;
          if (Array.isArray(n)) {
            this.length = n.length;
            for (let a = 0; a < this.length; a++)
              (o = n[a]),
                (s = this._trackByFn(a, o)),
                null !== t && Object.is(t.trackById, s)
                  ? (r && (t = this._verifyReinsertion(t, o, s, a)),
                    Object.is(t.item, o) || this._addIdentityChange(t, o))
                  : ((t = this._mismatch(t, o, s, a)), (r = !0)),
                (t = t._next);
          } else
            (i = 0),
              (function FA(e, n) {
                if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
                else {
                  const t = e[oi()]();
                  let r;
                  for (; !(r = t.next()).done; ) n(r.value);
                }
              })(n, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (r && (t = this._verifyReinsertion(t, a, s, i)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, i)), (r = !0)),
                  (t = t._next),
                  i++;
              }),
              (this.length = i);
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
        _mismatch(n, t, r, i) {
          let o;
          return (
            null === n ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
            null !== (n = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._reinsertAfter(n, o, i))
              : null !== (n = null === this._linkedRecords ? null : this._linkedRecords.get(r, i))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._moveAfter(n, o, i))
              : (n = this._addAfter(new rx(t, r), o, i)),
            n
          );
        }
        _verifyReinsertion(n, t, r, i) {
          let o = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (n = this._reinsertAfter(o, n._prev, i))
              : n.currentIndex != i && ((n.currentIndex = i), this._addToMoves(n, i)),
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
        _reinsertAfter(n, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
          const i = n._prevRemoved,
            o = n._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _moveAfter(n, t, r) {
          return this._unlink(n), this._insertAfter(n, t, r), this._addToMoves(n, r), n;
        }
        _addAfter(n, t, r) {
          return (
            this._insertAfter(n, t, r),
            (this._additionsTail =
              null === this._additionsTail ? (this._additionsHead = n) : (this._additionsTail._nextAdded = n)),
            n
          );
        }
        _insertAfter(n, t, r) {
          const i = null === t ? this._itHead : t._next;
          return (
            (n._next = i),
            (n._prev = t),
            null === i ? (this._itTail = n) : (i._prev = n),
            null === t ? (this._itHead = n) : (t._next = n),
            null === this._linkedRecords && (this._linkedRecords = new Pb()),
            this._linkedRecords.put(n),
            (n.currentIndex = r),
            n
          );
        }
        _remove(n) {
          return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
          null !== this._linkedRecords && this._linkedRecords.remove(n);
          const t = n._prev,
            r = n._next;
          return null === t ? (this._itHead = r) : (t._next = r), null === r ? (this._itTail = t) : (r._prev = t), n;
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
            null === this._unlinkedRecords && (this._unlinkedRecords = new Pb()),
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
      class rx {
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
      class ix {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(n) {
          null === this._head
            ? ((this._head = this._tail = n), (n._nextDup = null), (n._prevDup = null))
            : ((this._tail._nextDup = n), (n._prevDup = this._tail), (n._nextDup = null), (this._tail = n));
        }
        get(n, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if ((null === t || t <= r.currentIndex) && Object.is(r.trackById, n)) return r;
          return null;
        }
        remove(n) {
          const t = n._prevDup,
            r = n._nextDup;
          return (
            null === t ? (this._head = r) : (t._nextDup = r),
            null === r ? (this._tail = t) : (r._prevDup = t),
            null === this._head
          );
        }
      }
      class Pb {
        constructor() {
          this.map = new Map();
        }
        put(n) {
          const t = n.trackById;
          let r = this.map.get(t);
          r || ((r = new ix()), this.map.set(t, r)), r.add(n);
        }
        get(n, t) {
          const i = this.map.get(n);
          return i ? i.get(n, t) : null;
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
      function xb(e, n, t) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return t && r < t.length && (i = t[r]), r + n + i;
      }
      class Fb {
        constructor() {}
        supports(n) {
          return n instanceof Map || wf(n);
        }
        create() {
          return new ox();
        }
      }
      class ox {
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
            if (!(n instanceof Map || wf(n))) throw new S(900, !1);
          } else n = new Map();
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let t = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(n, (r, i) => {
              if (t && t.key === i) this._maybeAddToChanges(t, r), (this._appendAfter = t), (t = t._next);
              else {
                const o = this._getOrCreateRecordForKey(i, r);
                t = this._insertBeforeOrAppend(t, o);
              }
            }),
            t)
          ) {
            t._prev && (t._prev._next = null), (this._removalsHead = t);
            for (let r = t; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(n, t) {
          if (n) {
            const r = n._prev;
            return (
              (t._next = n),
              (t._prev = r),
              (n._prev = t),
              r && (r._next = t),
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
            const i = this._records.get(n);
            this._maybeAddToChanges(i, t);
            const o = i._prev,
              s = i._next;
            return o && (o._next = s), s && (s._prev = o), (i._next = null), (i._prev = null), i;
          }
          const r = new sx(n);
          return this._records.set(n, r), (r.currentValue = t), this._addToAdditions(r), r;
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
          n instanceof Map ? n.forEach(t) : Object.keys(n).forEach((r) => t(n[r], r));
        }
      }
      class sx {
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
      function kb() {
        return new Ul([new Rb()]);
      }
      let Ul = (() => {
        class e {
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (null != r) {
              const i = r.factories.slice();
              t = t.concat(i);
            }
            return new e(t);
          }
          static extend(t) {
            return { provide: e, useFactory: (r) => e.create(t, r || kb()), deps: [[e, new cs(), new ls()]] };
          }
          find(t) {
            const r = this.factories.find((i) => i.supports(t));
            if (null != r) return r;
            throw new S(901, !1);
          }
        }
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: kb })), e;
      })();
      function Lb() {
        return new js([new Fb()]);
      }
      let js = (() => {
        class e {
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (r) {
              const i = r.factories.slice();
              t = t.concat(i);
            }
            return new e(t);
          }
          static extend(t) {
            return { provide: e, useFactory: (r) => e.create(t, r || Lb()), deps: [[e, new cs(), new ls()]] };
          }
          find(t) {
            const r = this.factories.find((i) => i.supports(t));
            if (r) return r;
            throw new S(901, !1);
          }
        }
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: Lb })), e;
      })();
      const cx = bb(null, 'core', []);
      let ux = (() => {
        class e {
          constructor(t) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(No));
          }),
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({})),
          e
        );
      })();
      function dr(e) {
        return 'boolean' == typeof e ? e : null != e && 'false' !== e;
      }
      function hh(e, n) {
        const t = _e(e),
          r = n.elementInjector || hl();
        return new ws(t).create(r, n.projectableNodes, n.hostElement, n.environmentInjector);
      }
      let $l = null;
      function Wn() {
        return $l;
      }
      const Ye = new k('DocumentToken');
      let ph = (() => {
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
              return (function px() {
                return T(Vb);
              })();
            },
            providedIn: 'platform',
          })),
          e
        );
      })();
      const gx = new k('Location Initialized');
      let Vb = (() => {
        class e extends ph {
          constructor(t) {
            super(), (this._doc = t), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Wn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const r = Wn().getGlobalEventTarget(this._doc, 'window');
            return r.addEventListener('popstate', t, !1), () => r.removeEventListener('popstate', t);
          }
          onHashChange(t) {
            const r = Wn().getGlobalEventTarget(this._doc, 'window');
            return r.addEventListener('hashchange', t, !1), () => r.removeEventListener('hashchange', t);
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
          pushState(t, r, i) {
            Bb() ? this._history.pushState(t, r, i) : (this.location.hash = i);
          }
          replaceState(t, r, i) {
            Bb() ? this._history.replaceState(t, r, i) : (this.location.hash = i);
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
            return new (t || e)(T(Ye));
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return (function _x() {
                return new Vb(T(Ye));
              })();
            },
            providedIn: 'platform',
          })),
          e
        );
      })();
      function Bb() {
        return !!window.history.pushState;
      }
      function gh(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith('/') && t++, n.startsWith('/') && t++, 2 == t ? e + n.substring(1) : 1 == t ? e + n : e + '/' + n
        );
      }
      function Hb(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ('/' === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function fr(e) {
        return e && '?' !== e[0] ? '?' + e : e;
      }
      let di = (() => {
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
              return We(Gb);
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      const jb = new k('appBaseHref');
      let Gb = (() => {
          class e extends di {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? We(Ye).location?.origin ?? '');
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
              return gh(this._baseHref, t);
            }
            path(t = !1) {
              const r = this._platformLocation.pathname + fr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && t ? `${r}${i}` : r;
            }
            pushState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + fr(o));
              this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + fr(o));
              this._platformLocation.replaceState(t, r, s);
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
              return new (t || e)(T(ph), T(jb, 8));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        mx = (() => {
          class e extends di {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ''),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
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
              let r = this._platformLocation.hash;
              return null == r && (r = '#'), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(t) {
              const r = gh(this._baseHref, t);
              return r.length > 0 ? '#' + r : r;
            }
            pushState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + fr(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + fr(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.replaceState(t, r, s);
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
              return new (t || e)(T(ph), T(jb, 8));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        _h = (() => {
          class e {
            constructor(t) {
              (this._subject = new j()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const r = this._locationStrategy.getBaseHref();
              (this._baseHref = Hb(Ub(r))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({ url: this.path(!0), pop: !0, state: i.state, type: i.type });
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
            isCurrentPathEqualTo(t, r = '') {
              return this.path() == this.normalize(t + fr(r));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function yx(e, n) {
                  return e && n.startsWith(e) ? n.substring(e.length) : n;
                })(this._baseHref, Ub(t))
              );
            }
            prepareExternalUrl(t) {
              return t && '/' !== t[0] && (t = '/' + t), this._locationStrategy.prepareExternalUrl(t);
            }
            go(t, r = '', i = null) {
              this._locationStrategy.pushState(i, '', t, r),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(t + fr(r)), i);
            }
            replaceState(t, r = '', i = null) {
              this._locationStrategy.replaceState(i, '', t, r),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(t + fr(r)), i);
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
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = '', r) {
              this._urlChangeListeners.forEach((i) => i(t, r));
            }
            subscribe(t, r, i) {
              return this._subject.subscribe({ next: t, error: r, complete: i });
            }
          }
          return (
            (e.normalizeQueryParams = fr),
            (e.joinWithSlash = gh),
            (e.stripTrailingSlash = Hb),
            (e.ɵfac = function (t) {
              return new (t || e)(T(di));
            }),
            (e.ɵprov = M({
              token: e,
              factory: function () {
                return (function vx() {
                  return new _h(T(di));
                })();
              },
              providedIn: 'root',
            })),
            e
          );
        })();
      function Ub(e) {
        return e.replace(/\/index.html$/, '');
      }
      function Jb(e, n) {
        n = encodeURIComponent(n);
        for (const t of e.split(';')) {
          const r = t.indexOf('='),
            [i, o] = -1 == r ? [t, ''] : [t.slice(0, r), t.slice(r + 1)];
          if (i.trim() === n) return decodeURIComponent(o);
        }
        return null;
      }
      let Zb = (() => {
        class e {
          constructor(t, r, i, o) {
            (this._iterableDiffers = t),
              (this._keyValueDiffers = r),
              (this._ngEl = i),
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
            t.forEachAddedItem((r) => this._toggleClass(r.key, r.currentValue)),
              t.forEachChangedItem((r) => this._toggleClass(r.key, r.currentValue)),
              t.forEachRemovedItem((r) => {
                r.previousValue && this._toggleClass(r.key, !1);
              });
          }
          _applyIterableChanges(t) {
            t.forEachAddedItem((r) => {
              if ('string' != typeof r.item)
                throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${be(r.item)}`);
              this._toggleClass(r.item, !0);
            }),
              t.forEachRemovedItem((r) => this._toggleClass(r.item, !1));
          }
          _applyClasses(t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach((r) => this._toggleClass(r, !0))
                : Object.keys(t).forEach((r) => this._toggleClass(r, !!t[r])));
          }
          _removeClasses(t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach((r) => this._toggleClass(r, !1))
                : Object.keys(t).forEach((r) => this._toggleClass(r, !1)));
          }
          _toggleClass(t, r) {
            (t = t.trim()) &&
              t.split(/\s+/g).forEach((i) => {
                r
                  ? this._renderer.addClass(this._ngEl.nativeElement, i)
                  : this._renderer.removeClass(this._ngEl.nativeElement, i);
              });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Ul), _(js), _(De), _(mn));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [['', 'ngClass', '']],
            inputs: { klass: ['class', 'klass'], ngClass: 'ngClass' },
            standalone: !0,
          })),
          e
        );
      })();
      class rF {
        constructor(n, t, r, i) {
          (this.$implicit = n), (this.ngForOf = t), (this.index = r), (this.count = i);
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
      let To = (() => {
        class e {
          constructor(t, r, i) {
            (this._viewContainer = t),
              (this._template = r),
              (this._differs = i),
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
            const r = this._viewContainer;
            t.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(this._template, new rF(i.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), nD(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((i) => {
              nD(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Cn), _(Ge), _(Ul));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [['', 'ngFor', '', 'ngForOf', '']],
            inputs: { ngForOf: 'ngForOf', ngForTrackBy: 'ngForTrackBy', ngForTemplate: 'ngForTemplate' },
            standalone: !0,
          })),
          e
        );
      })();
      function nD(e, n) {
        e.context.$implicit = n.item;
      }
      let Eo = (() => {
        class e {
          constructor(t, r) {
            (this._viewContainer = t),
              (this._context = new oF()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t), this._updateView();
          }
          set ngIfThen(t) {
            rD('ngIfThen', t), (this._thenTemplateRef = t), (this._thenViewRef = null), this._updateView();
          }
          set ngIfElse(t) {
            rD('ngIfElse', t), (this._elseTemplateRef = t), (this._elseViewRef = null), this._updateView();
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
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Cn), _(Ge));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [['', 'ngIf', '']],
            inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
            standalone: !0,
          })),
          e
        );
      })();
      class oF {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function rD(e, n) {
        if (n && !n.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${be(n)}'.`);
      }
      let st = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({})),
          e
        );
      })();
      const sD = 'browser';
      function Ah(e) {
        return e === sD;
      }
      let xF = (() => {
        class e {}
        return (e.ɵprov = M({ token: e, providedIn: 'root', factory: () => new FF(T(Ye), window) })), e;
      })();
      class FF {
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
          const t = (function kF(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if ('function' == typeof e.createTreeWalker && e.body && (e.body.createShadowRoot || e.body.attachShadow)) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s = o.getElementById(n) || o.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
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
            r = t.left + this.window.pageXOffset,
            i = t.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const n = aD(this.window.history) || aD(Object.getPrototypeOf(this.window.history));
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
      function aD(e) {
        return Object.getOwnPropertyDescriptor(e, 'scrollRestoration');
      }
      class lD {}
      class Ih extends class LF extends class hx {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function fx(e) {
            $l || ($l = e);
          })(new Ih());
        }
        onAndCancel(n, t, r) {
          return (
            n.addEventListener(t, r, !1),
            () => {
              n.removeEventListener(t, r, !1);
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
          const t = (function VF() {
            return (Ws = Ws || document.querySelector('base')), Ws ? Ws.getAttribute('href') : null;
          })();
          return null == t
            ? null
            : (function BF(e) {
                (ec = ec || document.createElement('a')), ec.setAttribute('href', e);
                const n = ec.pathname;
                return '/' === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          Ws = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return Jb(document.cookie, n);
        }
      }
      let ec,
        Ws = null;
      const cD = new k('TRANSITION_ID'),
        jF = [
          {
            provide: Bs,
            useFactory: function HF(e, n, t) {
              return () => {
                t.get(Vl).donePromise.then(() => {
                  const r = Wn(),
                    i = n.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [cD, Ye, _t],
            multi: !0,
          },
        ];
      let UF = (() => {
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
      const tc = new k('EventManagerPlugins');
      let nc = (() => {
        class e {
          constructor(t, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              t.forEach((i) => (i.manager = this)),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, r, i) {
            return this._findPluginFor(r).addEventListener(t, r, i);
          }
          addGlobalEventListener(t, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(t, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            const r = this._eventNameToPlugin.get(t);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(t)) return this._eventNameToPlugin.set(t, s), s;
            }
            throw new Error(`No event manager plugin found for event ${t}`);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(tc), T(me));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class uD {
        constructor(n) {
          this._doc = n;
        }
        addGlobalEventListener(n, t, r) {
          const i = Wn().getGlobalEventTarget(this._doc, n);
          if (!i) throw new Error(`Unsupported event target ${i} for event ${t}`);
          return this.addEventListener(i, t, r);
        }
      }
      let dD = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(t) {
              const r = new Set();
              t.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
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
        zs = (() => {
          class e extends dD {
            constructor(t) {
              super(), (this._doc = t), (this._hostNodes = new Map()), this._hostNodes.set(t.head, []);
            }
            _addStylesToHost(t, r, i) {
              t.forEach((o) => {
                const s = this._doc.createElement('style');
                (s.textContent = o), i.push(r.appendChild(s));
              });
            }
            addHost(t) {
              const r = [];
              this._addStylesToHost(this._stylesSet, t, r), this._hostNodes.set(t, r);
            }
            removeHost(t) {
              const r = this._hostNodes.get(t);
              r && r.forEach(fD), this._hostNodes.delete(t);
            }
            onStylesAdded(t) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(t, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((t) => t.forEach(fD));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(Ye));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function fD(e) {
        Wn().remove(e);
      }
      const Rh = {
          svg: 'http://www.w3.org/2000/svg',
          xhtml: 'http://www.w3.org/1999/xhtml',
          xlink: 'http://www.w3.org/1999/xlink',
          xml: 'http://www.w3.org/XML/1998/namespace',
          xmlns: 'http://www.w3.org/2000/xmlns/',
          math: 'http://www.w3.org/1998/MathML/',
        },
        Ph = /%COMP%/g;
      function rc(e, n, t) {
        for (let r = 0; r < n.length; r++) {
          let i = n[r];
          Array.isArray(i) ? rc(e, i, t) : ((i = i.replace(Ph, e)), t.push(i));
        }
        return t;
      }
      function gD(e) {
        return (n) => {
          if ('__ngUnwrap__' === n) return e;
          !1 === e(n) && (n.preventDefault(), (n.returnValue = !1));
        };
      }
      let xh = (() => {
        class e {
          constructor(t, r, i) {
            (this.eventManager = t),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Fh(t));
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case xn.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new QF(this.eventManager, this.sharedStylesHost, r, this.appId)),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(t),
                  i
                );
              }
              case 1:
              case xn.ShadowDom:
                return new XF(this.eventManager, this.sharedStylesHost, t, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = rc(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(i), this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(nc), T(zs), T(Hs));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Fh {
        constructor(n) {
          (this.eventManager = n), (this.data = Object.create(null)), (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t ? document.createElementNS(Rh[t] || t, n) : document.createElement(n);
        }
        createComment(n) {
          return document.createComment(n);
        }
        createText(n) {
          return document.createTextNode(n);
        }
        appendChild(n, t) {
          (mD(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, r) {
          n && (mD(n) ? n.content : n).insertBefore(t, r);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let r = 'string' == typeof n ? document.querySelector(n) : n;
          if (!r) throw new Error(`The selector "${n}" did not match any elements`);
          return t || (r.textContent = ''), r;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, r, i) {
          if (i) {
            t = i + ':' + t;
            const o = Rh[i];
            o ? n.setAttributeNS(o, t, r) : n.setAttribute(t, r);
          } else n.setAttribute(t, r);
        }
        removeAttribute(n, t, r) {
          if (r) {
            const i = Rh[r];
            i ? n.removeAttributeNS(i, t) : n.removeAttribute(`${r}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, r, i) {
          i & (Bt.DashCase | Bt.Important)
            ? n.style.setProperty(t, r, i & Bt.Important ? 'important' : '')
            : (n.style[t] = r);
        }
        removeStyle(n, t, r) {
          r & Bt.DashCase ? n.style.removeProperty(t) : (n.style[t] = '');
        }
        setProperty(n, t, r) {
          n[t] = r;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, r) {
          return 'string' == typeof n
            ? this.eventManager.addGlobalEventListener(n, t, gD(r))
            : this.eventManager.addEventListener(n, t, gD(r));
        }
      }
      function mD(e) {
        return 'TEMPLATE' === e.tagName && void 0 !== e.content;
      }
      class QF extends Fh {
        constructor(n, t, r, i) {
          super(n), (this.component = r);
          const o = rc(i + '-' + r.id, r.styles, []);
          t.addStyles(o),
            (this.contentAttr = (function zF(e) {
              return '_ngcontent-%COMP%'.replace(Ph, e);
            })(i + '-' + r.id)),
            (this.hostAttr = (function KF(e) {
              return '_nghost-%COMP%'.replace(Ph, e);
            })(i + '-' + r.id));
        }
        applyToHost(n) {
          super.setAttribute(n, this.hostAttr, '');
        }
        createElement(n, t) {
          const r = super.createElement(n, t);
          return super.setAttribute(r, this.contentAttr, ''), r;
        }
      }
      class XF extends Fh {
        constructor(n, t, r, i) {
          super(n),
            (this.sharedStylesHost = t),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: 'open' })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = rc(i.id, i.styles, []);
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
        insertBefore(n, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
        }
      }
      let YF = (() => {
        class e extends uD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, r, i) {
            return t.addEventListener(r, i, !1), () => this.removeEventListener(t, r, i);
          }
          removeEventListener(t, r, i) {
            return t.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(Ye));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const vD = ['alt', 'control', 'meta', 'shift'],
        ZF = {
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
        yD = {
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
        ek = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey };
      let tk = (() => {
        class e extends uD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => Wn().onAndCancel(t, o.domEventName, s));
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split('.'),
              i = r.shift();
            if (0 === r.length || ('keydown' !== i && 'keyup' !== i)) return null;
            const o = e._normalizeKey(r.pop());
            let s = '';
            if (
              (vD.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + '.'));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const a = {};
            return (a.domEventName = i), (a.fullKey = s), a;
          }
          static getEventFullKey(t) {
            let r = '',
              i = (function nk(e) {
                let n = e.key;
                if (null == n) {
                  if (((n = e.keyIdentifier), null == n)) return 'Unidentified';
                  n.startsWith('U+') &&
                    ((n = String.fromCharCode(parseInt(n.substring(2), 16))),
                    3 === e.location && yD.hasOwnProperty(n) && (n = yD[n]));
                }
                return ZF[n] || n;
              })(t);
            return (
              (i = i.toLowerCase()),
              ' ' === i ? (i = 'space') : '.' === i && (i = 'dot'),
              vD.forEach((o) => {
                o != i && (0, ek[o])(t) && (r += o + '.');
              }),
              (r += i),
              r
            );
          }
          static eventCallback(t, r, i) {
            return (o) => {
              e.getEventFullKey(o) === t && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(t) {
            return 'esc' === t ? 'escape' : t;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(Ye));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const sk = bb(cx, 'browser', [
          { provide: Co, useValue: sD },
          {
            provide: ub,
            useValue: function rk() {
              Ih.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Ye,
            useFactory: function ok() {
              return (
                (function TS(e) {
                  ad = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        DD = new k(''),
        wD = [
          {
            provide: Bl,
            useClass: class GF {
              addToWindow(n) {
                (ge.getAngularTestability = (r, i = !0) => {
                  const o = n.findTestabilityInTree(r, i);
                  if (null == o) throw new Error('Could not find testability for element.');
                  return o;
                }),
                  (ge.getAllAngularTestabilities = () => n.getAllTestabilities()),
                  (ge.getAllAngularRootElements = () => n.getAllRootElements()),
                  ge.frameworkStabilizers || (ge.frameworkStabilizers = []),
                  ge.frameworkStabilizers.push((r) => {
                    const i = ge.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(n, t, r) {
                return null == t
                  ? null
                  : n.getTestability(t) ??
                      (r
                        ? Wn().isShadowRoot(t)
                          ? this.findTestabilityInTree(n, t.host, !0)
                          : this.findTestabilityInTree(n, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: _b, useClass: ih, deps: [me, oh, Bl] },
          { provide: ih, useClass: ih, deps: [me, oh, Bl] },
        ],
        CD = [
          { provide: vd, useValue: 'root' },
          {
            provide: Zi,
            useFactory: function ik() {
              return new Zi();
            },
            deps: [],
          },
          { provide: tc, useClass: YF, multi: !0, deps: [Ye, me, Co] },
          { provide: tc, useClass: tk, multi: !0, deps: [Ye] },
          { provide: xh, useClass: xh, deps: [nc, zs, Hs] },
          { provide: wd, useExisting: xh },
          { provide: dD, useExisting: zs },
          { provide: zs, useClass: zs, deps: [Ye] },
          { provide: nc, useClass: nc, deps: [tc, me] },
          { provide: lD, useClass: UF, deps: [] },
          [],
        ];
      let ak = (() => {
          class e {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: e,
                providers: [{ provide: Hs, useValue: t.appId }, { provide: cD, useExisting: Hs }, jF],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(DD, 12));
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ providers: [...CD, ...wD], imports: [st, ux] })),
            e
          );
        })(),
        Lh = (() => {
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
              return new (t || e)(T(Ye));
            }),
            (e.ɵprov = M({
              token: e,
              factory: function (t) {
                let r = null;
                return (
                  (r = t
                    ? new t()
                    : (function ck() {
                        return new Lh(T(Ye));
                      })()),
                  r
                );
              },
              providedIn: 'root',
            })),
            e
          );
        })();
      typeof window < 'u' && window;
      const { isArray: mk } = Array,
        { getPrototypeOf: vk, prototype: yk, keys: bk } = Object;
      function ED(e) {
        if (1 === e.length) {
          const n = e[0];
          if (mk(n)) return { args: n, keys: null };
          if (
            (function Dk(e) {
              return e && 'object' == typeof e && vk(e) === yk;
            })(n)
          ) {
            const t = bk(n);
            return { args: t.map((r) => n[r]), keys: t };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: wk } = Array;
      function Bh(e) {
        return L((n) =>
          (function Ck(e, n) {
            return wk(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      function SD(e, n) {
        return e.reduce((t, r, i) => ((t[r] = n[i]), t), {});
      }
      function MD(...e) {
        const n = Pa(e),
          { args: t, keys: r } = ED(e),
          i = new he((o) => {
            const { length: s } = t;
            if (!s) return void o.complete();
            const a = new Array(s);
            let l = s,
              c = s;
            for (let u = 0; u < s; u++) {
              let d = !1;
              ft(t[u]).subscribe(
                Ce(
                  o,
                  (f) => {
                    d || ((d = !0), c--), (a[u] = f);
                  },
                  () => l--,
                  void 0,
                  () => {
                    (!l || !d) && (c || o.next(r ? SD(r, a) : a), o.complete());
                  }
                )
              );
            }
          });
        return n ? i.pipe(Bh(n)) : i;
      }
      let OD = (() => {
          class e {
            constructor(t, r) {
              (this._renderer = t), (this._elementRef = r), (this.onChange = (i) => {}), (this.onTouched = () => {});
            }
            setProperty(t, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, r);
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
              return new (t || e)(_(mn), _(De));
            }),
            (e.ɵdir = O({ type: e })),
            e
          );
        })(),
        fi = (() => {
          class e extends OD {}
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = Qe(e)))(r || e);
              };
            })()),
            (e.ɵdir = O({ type: e, features: [fe] })),
            e
          );
        })();
      const zn = new k('NgValueAccessor'),
        Nk = { provide: zn, useExisting: ae(() => Hh), multi: !0 };
      let Hh = (() => {
        class e extends fi {
          writeValue(t) {
            this.setProperty('checked', t);
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = Qe(e)))(r || e);
            };
          })()),
          (e.ɵdir = O({
            type: e,
            selectors: [
              ['input', 'type', 'checkbox', 'formControlName', ''],
              ['input', 'type', 'checkbox', 'formControl', ''],
              ['input', 'type', 'checkbox', 'ngModel', ''],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                oe('change', function (o) {
                  return r.onChange(o.target.checked);
                })('blur', function () {
                  return r.onTouched();
                });
            },
            features: [Ee([Nk]), fe],
          })),
          e
        );
      })();
      const Tk = { provide: zn, useExisting: ae(() => ic), multi: !0 },
        Sk = new k('CompositionEventMode');
      let ic = (() => {
        class e extends OD {
          constructor(t, r, i) {
            super(t, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function Ek() {
                  const e = Wn() ? Wn().getUserAgent() : '';
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
            return new (t || e)(_(mn), _(De), _(Sk, 8));
          }),
          (e.ɵdir = O({
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
            hostBindings: function (t, r) {
              1 & t &&
                oe('input', function (o) {
                  return r._handleInput(o.target.value);
                })('blur', function () {
                  return r.onTouched();
                })('compositionstart', function () {
                  return r._compositionStart();
                })('compositionend', function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [Ee([Tk]), fe],
          })),
          e
        );
      })();
      function Fr(e) {
        return null == e || (('string' == typeof e || Array.isArray(e)) && 0 === e.length);
      }
      function AD(e) {
        return null != e && 'number' == typeof e.length;
      }
      const Et = new k('NgValidators'),
        kr = new k('NgAsyncValidators'),
        Ok =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class ID {
        static min(n) {
          return (function RD(e) {
            return (n) => {
              if (Fr(n.value) || Fr(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t < e ? { min: { min: e, actual: n.value } } : null;
            };
          })(n);
        }
        static max(n) {
          return (function PD(e) {
            return (n) => {
              if (Fr(n.value) || Fr(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t > e ? { max: { max: e, actual: n.value } } : null;
            };
          })(n);
        }
        static required(n) {
          return xD(n);
        }
        static requiredTrue(n) {
          return (function FD(e) {
            return !0 === e.value ? null : { required: !0 };
          })(n);
        }
        static email(n) {
          return (function kD(e) {
            return Fr(e.value) || Ok.test(e.value) ? null : { email: !0 };
          })(n);
        }
        static minLength(n) {
          return (function LD(e) {
            return (n) =>
              Fr(n.value) || !AD(n.value)
                ? null
                : n.value.length < e
                ? { minlength: { requiredLength: e, actualLength: n.value.length } }
                : null;
          })(n);
        }
        static maxLength(n) {
          return (function VD(e) {
            return (n) =>
              AD(n.value) && n.value.length > e
                ? { maxlength: { requiredLength: e, actualLength: n.value.length } }
                : null;
          })(n);
        }
        static pattern(n) {
          return (function BD(e) {
            if (!e) return oc;
            let n, t;
            return (
              'string' == typeof e
                ? ((t = ''),
                  '^' !== e.charAt(0) && (t += '^'),
                  (t += e),
                  '$' !== e.charAt(e.length - 1) && (t += '$'),
                  (n = new RegExp(t)))
                : ((t = e.toString()), (n = e)),
              (r) => {
                if (Fr(r.value)) return null;
                const i = r.value;
                return n.test(i) ? null : { pattern: { requiredPattern: t, actualValue: i } };
              }
            );
          })(n);
        }
        static nullValidator(n) {
          return null;
        }
        static compose(n) {
          return WD(n);
        }
        static composeAsync(n) {
          return zD(n);
        }
      }
      function xD(e) {
        return Fr(e.value) ? { required: !0 } : null;
      }
      function oc(e) {
        return null;
      }
      function HD(e) {
        return null != e;
      }
      function jD(e) {
        return Ts(e) ? $e(e) : e;
      }
      function GD(e) {
        let n = {};
        return (
          e.forEach((t) => {
            n = null != t ? { ...n, ...t } : n;
          }),
          0 === Object.keys(n).length ? null : n
        );
      }
      function UD(e, n) {
        return n.map((t) => t(e));
      }
      function $D(e) {
        return e.map((n) =>
          (function Ak(e) {
            return !e.validate;
          })(n)
            ? n
            : (t) => n.validate(t)
        );
      }
      function WD(e) {
        if (!e) return null;
        const n = e.filter(HD);
        return 0 == n.length
          ? null
          : function (t) {
              return GD(UD(t, n));
            };
      }
      function jh(e) {
        return null != e ? WD($D(e)) : null;
      }
      function zD(e) {
        if (!e) return null;
        const n = e.filter(HD);
        return 0 == n.length
          ? null
          : function (t) {
              return MD(UD(t, n).map(jD)).pipe(L(GD));
            };
      }
      function Gh(e) {
        return null != e ? zD($D(e)) : null;
      }
      function KD(e, n) {
        return null === e ? [n] : Array.isArray(e) ? [...e, n] : [e, n];
      }
      function qD(e) {
        return e._rawValidators;
      }
      function QD(e) {
        return e._rawAsyncValidators;
      }
      function Uh(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function sc(e, n) {
        return Array.isArray(e) ? e.includes(n) : e === n;
      }
      function XD(e, n) {
        const t = Uh(n);
        return (
          Uh(e).forEach((i) => {
            sc(t, i) || t.push(i);
          }),
          t
        );
      }
      function YD(e, n) {
        return Uh(n).filter((t) => !sc(e, t));
      }
      class JD {
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
          (this._rawValidators = n || []), (this._composedValidatorFn = jh(this._rawValidators));
        }
        _setAsyncValidators(n) {
          (this._rawAsyncValidators = n || []), (this._composedAsyncValidatorFn = Gh(this._rawAsyncValidators));
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
      class Ft extends JD {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Lr extends JD {
        constructor() {
          super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
        }
      }
      class ZD {
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
      let e1 = (() => {
          class e extends ZD {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Lr, 2));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ['', 'formControlName', ''],
                ['', 'ngModel', ''],
                ['', 'formControl', ''],
              ],
              hostVars: 14,
              hostBindings: function (t, r) {
                2 & t &&
                  He('ng-untouched', r.isUntouched)('ng-touched', r.isTouched)('ng-pristine', r.isPristine)(
                    'ng-dirty',
                    r.isDirty
                  )('ng-valid', r.isValid)('ng-invalid', r.isInvalid)('ng-pending', r.isPending);
              },
              features: [fe],
            })),
            e
          );
        })(),
        t1 = (() => {
          class e extends ZD {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ft, 10));
            }),
            (e.ɵdir = O({
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
              hostBindings: function (t, r) {
                2 & t &&
                  He('ng-untouched', r.isUntouched)('ng-touched', r.isTouched)('ng-pristine', r.isPristine)(
                    'ng-dirty',
                    r.isDirty
                  )('ng-valid', r.isValid)('ng-invalid', r.isInvalid)('ng-pending', r.isPending)(
                    'ng-submitted',
                    r.isSubmitted
                  );
              },
              features: [fe],
            })),
            e
          );
        })();
      const Ks = 'VALID',
        lc = 'INVALID',
        So = 'PENDING',
        qs = 'DISABLED';
      function Kh(e) {
        return (cc(e) ? e.validators : e) || null;
      }
      function r1(e) {
        return Array.isArray(e) ? jh(e) : e || null;
      }
      function qh(e, n) {
        return (cc(n) ? n.asyncValidators : e) || null;
      }
      function i1(e) {
        return Array.isArray(e) ? Gh(e) : e || null;
      }
      function cc(e) {
        return null != e && !Array.isArray(e) && 'object' == typeof e;
      }
      function o1(e, n, t) {
        const r = e.controls;
        if (!(n ? Object.keys(r) : r).length) throw new S(1e3, '');
        if (!r[t]) throw new S(1001, '');
      }
      function s1(e, n, t) {
        e._forEachChild((r, i) => {
          if (void 0 === t[i]) throw new S(1002, '');
        });
      }
      class uc {
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
            (this._composedValidatorFn = r1(this._rawValidators)),
            (this._composedAsyncValidatorFn = i1(this._rawAsyncValidators));
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
          return this.status === Ks;
        }
        get invalid() {
          return this.status === lc;
        }
        get pending() {
          return this.status == So;
        }
        get disabled() {
          return this.status === qs;
        }
        get enabled() {
          return this.status !== qs;
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
          (this._rawValidators = n), (this._composedValidatorFn = r1(n));
        }
        setAsyncValidators(n) {
          (this._rawAsyncValidators = n), (this._composedAsyncValidatorFn = i1(n));
        }
        addValidators(n) {
          this.setValidators(XD(n, this._rawValidators));
        }
        addAsyncValidators(n) {
          this.setAsyncValidators(XD(n, this._rawAsyncValidators));
        }
        removeValidators(n) {
          this.setValidators(YD(n, this._rawValidators));
        }
        removeAsyncValidators(n) {
          this.setAsyncValidators(YD(n, this._rawAsyncValidators));
        }
        hasValidator(n) {
          return sc(this._rawValidators, n);
        }
        hasAsyncValidator(n) {
          return sc(this._rawAsyncValidators, n);
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
          (this.status = qs),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...n, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = Ks),
            this._forEachChild((r) => {
              r.enable({ ...n, onlySelf: !0 });
            }),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!1));
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
              (this.status === Ks || this.status === So) && this._runAsyncValidator(n.emitEvent)),
            !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
            this._parent && !n.onlySelf && this._parent.updateValueAndValidity(n);
        }
        _updateTreeValidity(n = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(n)),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? qs : Ks;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(n) {
          if (this.asyncValidator) {
            (this.status = So), (this._hasOwnPendingAsyncValidator = !0);
            const t = jD(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1), this.setErrors(r, { emitEvent: n });
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
            : t.reduce((r, i) => r && r._find(i), this);
        }
        getError(n, t) {
          const r = t ? this.get(t) : this;
          return r && r.errors ? r.errors[n] : null;
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
          (this.valueChanges = new j()), (this.statusChanges = new j());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? qs
            : this.errors
            ? lc
            : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(So)
            ? So
            : this._anyControlsHaveStatus(lc)
            ? lc
            : Ks;
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
          cc(n) && null != n.updateOn && (this._updateOn = n.updateOn);
        }
        _parentMarkedDirty(n) {
          return !n && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty();
        }
        _find(n) {
          return null;
        }
      }
      class dc extends uc {
        constructor(n, t, r) {
          super(Kh(t), qh(r, t)),
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
        addControl(n, t, r = {}) {
          this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(n, t = {}) {
          this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(n, t, r = {}) {
          this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            t && this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(n) {
          return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
        }
        setValue(n, t = {}) {
          s1(this, 0, n),
            Object.keys(n).forEach((r) => {
              o1(this, !0, r), this.controls[r].setValue(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (Object.keys(n).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = {}, t = {}) {
          this._forEachChild((r, i) => {
            r.reset(n[i], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren({}, (n, t, r) => ((n[r] = t.getRawValue()), n));
        }
        _syncPendingControls() {
          let n = this._reduceChildren(!1, (t, r) => !!r._syncPendingControls() || t);
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          Object.keys(this.controls).forEach((t) => {
            const r = this.controls[t];
            r && n(r, t);
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
          for (const [t, r] of Object.entries(this.controls)) if (this.contains(t) && n(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren({}, (t, r, i) => ((r.enabled || this.disabled) && (t[i] = r.value), t));
        }
        _reduceChildren(n, t) {
          let r = n;
          return (
            this._forEachChild((i, o) => {
              r = t(r, i, o);
            }),
            r
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
      function Qs(e, n) {
        Qh(e, n),
          n.valueAccessor.writeValue(e.value),
          e.disabled && n.valueAccessor.setDisabledState?.(!0),
          (function Bk(e, n) {
            n.valueAccessor.registerOnChange((t) => {
              (e._pendingValue = t),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                'change' === e.updateOn && a1(e, n);
            });
          })(e, n),
          (function jk(e, n) {
            const t = (r, i) => {
              n.valueAccessor.writeValue(r), i && n.viewToModelUpdate(r);
            };
            e.registerOnChange(t),
              n._registerOnDestroy(() => {
                e._unregisterOnChange(t);
              });
          })(e, n),
          (function Hk(e, n) {
            n.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                'blur' === e.updateOn && e._pendingChange && a1(e, n),
                'submit' !== e.updateOn && e.markAsTouched();
            });
          })(e, n),
          (function Vk(e, n) {
            if (n.valueAccessor.setDisabledState) {
              const t = (r) => {
                n.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(t),
                n._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(t);
                });
            }
          })(e, n);
      }
      function hc(e, n, t = !0) {
        const r = () => {};
        n.valueAccessor && (n.valueAccessor.registerOnChange(r), n.valueAccessor.registerOnTouched(r)),
          gc(e, n),
          e && (n._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
      }
      function pc(e, n) {
        e.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(n);
        });
      }
      function Qh(e, n) {
        const t = qD(e);
        null !== n.validator ? e.setValidators(KD(t, n.validator)) : 'function' == typeof t && e.setValidators([t]);
        const r = QD(e);
        null !== n.asyncValidator
          ? e.setAsyncValidators(KD(r, n.asyncValidator))
          : 'function' == typeof r && e.setAsyncValidators([r]);
        const i = () => e.updateValueAndValidity();
        pc(n._rawValidators, i), pc(n._rawAsyncValidators, i);
      }
      function gc(e, n) {
        let t = !1;
        if (null !== e) {
          if (null !== n.validator) {
            const i = qD(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== n.validator);
              o.length !== i.length && ((t = !0), e.setValidators(o));
            }
          }
          if (null !== n.asyncValidator) {
            const i = QD(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== n.asyncValidator);
              o.length !== i.length && ((t = !0), e.setAsyncValidators(o));
            }
          }
        }
        const r = () => {};
        return pc(n._rawValidators, r), pc(n._rawAsyncValidators, r), t;
      }
      function a1(e, n) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          n.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function d1(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      function f1(e) {
        return 'object' == typeof e && null !== e && 2 === Object.keys(e).length && 'value' in e && 'disabled' in e;
      }
      const Ys = class extends uc {
        constructor(n = null, t, r) {
          super(Kh(t), qh(r, t)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(n),
            this._setUpdateStrategy(t),
            this._initObservables(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
            cc(t) && (t.nonNullable || t.initialValueIsDefault) && (this.defaultValue = f1(n) ? n.value : n);
        }
        setValue(n, t = {}) {
          (this.value = this._pendingValue = n),
            this._onChange.length &&
              !1 !== t.emitModelToViewChange &&
              this._onChange.forEach((r) => r(this.value, !1 !== t.emitViewToModelChange)),
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
          d1(this._onChange, n);
        }
        registerOnDisabledChange(n) {
          this._onDisabledChange.push(n);
        }
        _unregisterOnDisabledChange(n) {
          d1(this._onDisabledChange, n);
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
          f1(n)
            ? ((this.value = this._pendingValue = n.value),
              n.disabled ? this.disable({ onlySelf: !0, emitEvent: !1 }) : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = n);
        }
      };
      let m1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
              hostAttrs: ['novalidate', ''],
            })),
            e
          );
        })(),
        y1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      const Zh = new k('NgModelWithFormControlWarning'),
        tL = { provide: Ft, useExisting: ae(() => _c) };
      let _c = (() => {
        class e extends Ft {
          constructor(t, r) {
            super(),
              (this.validators = t),
              (this.asyncValidators = r),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new j()),
              this._setValidators(t),
              this._setAsyncValidators(r);
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
              (gc(this.form, this),
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
            const r = this.form.get(t.path);
            return Qs(r, t), r.updateValueAndValidity({ emitEvent: !1 }), this.directives.push(t), r;
          }
          getControl(t) {
            return this.form.get(t.path);
          }
          removeControl(t) {
            hc(t.control || null, t, !1),
              (function Wk(e, n) {
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
          updateModel(t, r) {
            this.form.get(t.path).setValue(r);
          }
          onSubmit(t) {
            return (
              (this.submitted = !0),
              (function u1(e, n) {
                e._syncPendingControls(),
                  n.forEach((t) => {
                    const r = t.control;
                    'submit' === r.updateOn &&
                      r._pendingChange &&
                      (t.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
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
              const r = t.control,
                i = this.form.get(t.path);
              r !== i && (hc(r || null, t), ((e) => e instanceof Ys)(i) && (Qs(i, t), (t.control = i)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(t) {
            const r = this.form.get(t.path);
            (function l1(e, n) {
              Qh(e, n);
            })(r, t),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(t) {
            if (this.form) {
              const r = this.form.get(t.path);
              r &&
                (function Gk(e, n) {
                  return gc(e, n);
                })(r, t) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Qh(this.form, this), this._oldForm && gc(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Et, 10), _(kr, 10));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [['', 'formGroup', '']],
            hostBindings: function (t, r) {
              1 & t &&
                oe('submit', function (o) {
                  return r.onSubmit(o);
                })('reset', function () {
                  return r.onReset();
                });
            },
            inputs: { form: ['formGroup', 'form'] },
            outputs: { ngSubmit: 'ngSubmit' },
            exportAs: ['ngForm'],
            features: [Ee([tL]), fe, wt],
          })),
          e
        );
      })();
      const iL = { provide: Lr, useExisting: ae(() => np) };
      let np = (() => {
          class e extends Lr {
            constructor(t, r, i, o, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.update = new j()),
                (this._ngModelWarningSent = !1),
                (this._parent = t),
                this._setValidators(r),
                this._setAsyncValidators(i),
                (this.valueAccessor = (function Yh(e, n) {
                  if (!n) return null;
                  let t, r, i;
                  return (
                    Array.isArray(n),
                    n.forEach((o) => {
                      o.constructor === ic
                        ? (t = o)
                        : (function $k(e) {
                            return Object.getPrototypeOf(e.constructor) === fi;
                          })(o)
                        ? (r = o)
                        : (i = o);
                    }),
                    i || r || t || null
                  );
                })(0, o));
            }
            set isDisabled(t) {}
            ngOnChanges(t) {
              this._added || this._setUpControl(),
                (function Xh(e, n) {
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
              return (function fc(e, n) {
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
              return new (t || e)(_(Ft, 13), _(Et, 10), _(kr, 10), _(zn, 10), _(Zh, 8));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'formControlName', '']],
              inputs: {
                name: ['formControlName', 'name'],
                isDisabled: ['disabled', 'isDisabled'],
                model: ['ngModel', 'model'],
              },
              outputs: { update: 'ngModelChange' },
              features: [Ee([iL]), fe, wt],
            })),
            e
          );
        })(),
        hi = (() => {
          class e {
            constructor() {
              this._validator = oc;
            }
            ngOnChanges(t) {
              if (this.inputName in t) {
                const r = this.normalizeInput(t[this.inputName].currentValue);
                (this._enabled = this.enabled(r)),
                  (this._validator = this._enabled ? this.createValidator(r) : oc),
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
            (e.ɵdir = O({ type: e, features: [wt] })),
            e
          );
        })();
      const hL = { provide: Et, useExisting: ae(() => mc), multi: !0 };
      let mc = (() => {
          class e extends hi {
            constructor() {
              super(...arguments),
                (this.inputName = 'required'),
                (this.normalizeInput = dr),
                (this.createValidator = (t) => xD);
            }
            enabled(t) {
              return t;
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = Qe(e)))(r || e);
              };
            })()),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ['', 'required', '', 'formControlName', '', 3, 'type', 'checkbox'],
                ['', 'required', '', 'formControl', '', 3, 'type', 'checkbox'],
                ['', 'required', '', 'ngModel', '', 3, 'type', 'checkbox'],
              ],
              hostVars: 1,
              hostBindings: function (t, r) {
                2 & t && ve('required', r._enabled ? '' : null);
              },
              inputs: { required: 'required' },
              features: [Ee([hL]), fe],
            })),
            e
          );
        })(),
        F1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [y1] })),
            e
          );
        })(),
        k1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [F1] })),
            e
          );
        })(),
        L1 = (() => {
          class e {
            static withConfig(t) {
              return { ngModule: e, providers: [{ provide: Zh, useValue: t.warnOnNgModelWithFormControl }] };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [F1] })),
            e
          );
        })();
      class V1 extends uc {
        constructor(n, t, r) {
          super(Kh(t), qh(r, t)),
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
        insert(n, t, r = {}) {
          this.controls.splice(n, 0, t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(n, t = {}) {
          let r = this._adjustIndex(n);
          r < 0 && (r = 0),
            this.controls[r] && this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: t.emitEvent });
        }
        setControl(n, t, r = {}) {
          let i = this._adjustIndex(n);
          i < 0 && (i = 0),
            this.controls[i] && this.controls[i]._registerOnCollectionChange(() => {}),
            this.controls.splice(i, 1),
            t && (this.controls.splice(i, 0, t), this._registerControl(t)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(n, t = {}) {
          s1(this, 0, n),
            n.forEach((r, i) => {
              o1(this, !1, i), this.at(i).setValue(r, { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (n.forEach((r, i) => {
              this.at(i) && this.at(i).patchValue(r, { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = [], t = {}) {
          this._forEachChild((r, i) => {
            r.reset(n[i], { onlySelf: !0, emitEvent: t.emitEvent });
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
          let n = this.controls.reduce((t, r) => !!r._syncPendingControls() || t, !1);
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          this.controls.forEach((t, r) => {
            n(t, r);
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
      function B1(e) {
        return !!e && (void 0 !== e.asyncValidators || void 0 !== e.validators || void 0 !== e.updateOn);
      }
      let yL = (() => {
        class e {
          constructor() {
            this.useNonNullable = !1;
          }
          get nonNullable() {
            const t = new e();
            return (t.useNonNullable = !0), t;
          }
          group(t, r = null) {
            const i = this._reduceControls(t);
            let o = {};
            return (
              B1(r) ? (o = r) : null !== r && ((o.validators = r.validator), (o.asyncValidators = r.asyncValidator)),
              new dc(i, o)
            );
          }
          control(t, r, i) {
            let o = {};
            return this.useNonNullable
              ? (B1(r) ? (o = r) : ((o.validators = r), (o.asyncValidators = i)), new Ys(t, { ...o, nonNullable: !0 }))
              : new Ys(t, r, i);
          }
          array(t, r, i) {
            const o = t.map((s) => this._createControl(s));
            return new V1(o, r, i);
          }
          _reduceControls(t) {
            const r = {};
            return (
              Object.keys(t).forEach((i) => {
                r[i] = this._createControl(t[i]);
              }),
              r
            );
          }
          _createControl(t) {
            return t instanceof Ys || t instanceof uc
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
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: L1 })),
          e
        );
      })();
      function P(...e) {
        return $e(e, zo(e));
      }
      class pt extends pe {
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
          const { hasError: n, thrownError: t, _value: r } = this;
          if (n) throw t;
          return this._throwIfClosed(), r;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      const vc = $o(
        (e) =>
          function () {
            e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
          }
      );
      function yc(...e) {
        const n = zo(e),
          t = Pa(e),
          { args: r, keys: i } = ED(e);
        if (0 === r.length) return $e([], n);
        const o = new he(
          (function bL(e, n, t = Zn) {
            return (r) => {
              H1(
                n,
                () => {
                  const { length: i } = e,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    H1(
                      n,
                      () => {
                        const c = $e(e[l], n);
                        let u = !1;
                        c.subscribe(
                          Ce(
                            r,
                            (d) => {
                              (o[l] = d), u || ((u = !0), a--), a || r.next(t(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, n, i ? (s) => SD(i, s) : Zn)
        );
        return t ? o.pipe(Bh(t)) : o;
      }
      function H1(e, n, t) {
        e ? er(t, e, n) : n();
      }
      function Vr(...e) {
        return (function DL() {
          return Ri(1);
        })()($e(e, zo(e)));
      }
      function Mo(e) {
        return new he((n) => {
          ft(e()).subscribe(n);
        });
      }
      function Oo(e, n) {
        const t = te(e) ? e : () => e,
          r = (i) => i.error(t());
        return new he(n ? (i) => n.schedule(r, 0, i) : r);
      }
      function op() {
        return Re((e, n) => {
          let t = null;
          e._refCount++;
          const r = Ce(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (t = null);
            const i = e._connection,
              o = t;
            (t = null), i && (!o || i === o) && i.unsubscribe(), n.unsubscribe();
          });
          e.subscribe(r), r.closed || (t = e.connect());
        });
      }
      class sp extends he {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            xg(n) && (this.lift = n.lift);
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
                  (r) => {
                    this._teardown(), t.error(r);
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
          return op()(this);
        }
      }
      function at(e, n) {
        return Re((t, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          t.subscribe(
            Ce(
              r,
              (l) => {
                i?.unsubscribe();
                let c = 0;
                const u = o++;
                ft(e(l, u)).subscribe(
                  (i = Ce(
                    r,
                    (d) => r.next(n ? n(l, d, u, c++) : d),
                    () => {
                      (i = null), a();
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
      function we(e) {
        return e <= 0
          ? () => Jt
          : Re((n, t) => {
              let r = 0;
              n.subscribe(
                Ce(t, (i) => {
                  ++r <= e && (t.next(i), e <= r && t.complete());
                })
              );
            });
      }
      function Ae(e, n) {
        return Re((t, r) => {
          let i = 0;
          t.subscribe(Ce(r, (o) => e.call(n, o, i++) && r.next(o)));
        });
      }
      function Dc(e) {
        return Re((n, t) => {
          let r = !1;
          n.subscribe(
            Ce(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => {
                r || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function j1(e = wL) {
        return Re((n, t) => {
          let r = !1;
          n.subscribe(
            Ce(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => (r ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function wL() {
        return new vc();
      }
      function Br(e, n) {
        const t = arguments.length >= 2;
        return (r) => r.pipe(e ? Ae((i, o) => e(i, o, r)) : Zn, we(1), t ? Dc(n) : j1(() => new vc()));
      }
      function pr(e, n) {
        return te(n) ? Ue(e, n, 1) : Ue(e, 1);
      }
      function lt(e, n, t) {
        const r = te(e) || n || t ? { next: e, error: n, complete: t } : e;
        return r
          ? Re((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                Ce(
                  o,
                  (l) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, l), o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1), null === (l = r.complete) || void 0 === l || l.call(r), o.complete();
                  },
                  (l) => {
                    var c;
                    (a = !1), null === (c = r.error) || void 0 === c || c.call(r, l), o.error(l);
                  },
                  () => {
                    var l, c;
                    a && (null === (l = r.unsubscribe) || void 0 === l || l.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : Zn;
      }
      function Kn(e) {
        return Re((n, t) => {
          let o,
            r = null,
            i = !1;
          (r = n.subscribe(
            Ce(t, void 0, void 0, (s) => {
              (o = ft(e(s, Kn(e)(n)))), r ? (r.unsubscribe(), (r = null), o.subscribe(t)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(t));
        });
      }
      function CL(e, n, t, r, i) {
        return (o, s) => {
          let a = t,
            l = n,
            c = 0;
          o.subscribe(
            Ce(
              s,
              (u) => {
                const d = c++;
                (l = a ? e(l, u, d) : ((a = !0), u)), r && s.next(l);
              },
              i &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function G1(e, n) {
        return Re(CL(e, n, arguments.length >= 2, !0));
      }
      function ap(e) {
        return e <= 0
          ? () => Jt
          : Re((n, t) => {
              let r = [];
              n.subscribe(
                Ce(
                  t,
                  (i) => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) t.next(i);
                    t.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function U1(e, n) {
        const t = arguments.length >= 2;
        return (r) => r.pipe(e ? Ae((i, o) => e(i, o, r)) : Zn, ap(1), t ? Dc(n) : j1(() => new vc()));
      }
      function $1(e) {
        return L(() => e);
      }
      function Js(e) {
        return Re((n, t) => {
          try {
            n.subscribe(t);
          } finally {
            t.add(e);
          }
        });
      }
      const Z = 'primary';
      class TL {
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
      function Ao(e) {
        return new TL(e);
      }
      function EL(e, n, t) {
        const r = t.path.split('/');
        if (r.length > e.length || ('full' === t.pathMatch && (n.hasChildren() || r.length < e.length))) return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(':')) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function qn(e, n) {
        const t = e ? Object.keys(e) : void 0,
          r = n ? Object.keys(n) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let i;
        for (let o = 0; o < t.length; o++) if (((i = t[o]), !W1(e[i], n[i]))) return !1;
        return !0;
      }
      function W1(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            r = [...n].sort();
          return t.every((i, o) => r[o] === i);
        }
        return e === n;
      }
      function z1(e) {
        return Array.prototype.concat.apply([], e);
      }
      function K1(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function mt(e, n) {
        for (const t in e) e.hasOwnProperty(t) && n(e[t], t);
      }
      function gr(e) {
        return Ef(e) ? e : Ts(e) ? $e(Promise.resolve(e)) : P(e);
      }
      const OL = {
          exact: function X1(e, n, t) {
            if (
              !gi(e.segments, n.segments) ||
              !wc(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const r in n.children) if (!e.children[r] || !X1(e.children[r], n.children[r], t)) return !1;
            return !0;
          },
          subset: Y1,
        },
        q1 = {
          exact: function AL(e, n) {
            return qn(e, n);
          },
          subset: function IL(e, n) {
            return Object.keys(n).length <= Object.keys(e).length && Object.keys(n).every((t) => W1(e[t], n[t]));
          },
          ignored: () => !0,
        };
      function Q1(e, n, t) {
        return (
          OL[t.paths](e.root, n.root, t.matrixParams) &&
          q1[t.queryParams](e.queryParams, n.queryParams) &&
          !('exact' === t.fragment && e.fragment !== n.fragment)
        );
      }
      function Y1(e, n, t) {
        return J1(e, n, n.segments, t);
      }
      function J1(e, n, t, r) {
        if (e.segments.length > t.length) {
          const i = e.segments.slice(0, t.length);
          return !(!gi(i, t) || n.hasChildren() || !wc(i, t, r));
        }
        if (e.segments.length === t.length) {
          if (!gi(e.segments, t) || !wc(e.segments, t, r)) return !1;
          for (const i in n.children) if (!e.children[i] || !Y1(e.children[i], n.children[i], r)) return !1;
          return !0;
        }
        {
          const i = t.slice(0, e.segments.length),
            o = t.slice(e.segments.length);
          return !!(gi(e.segments, i) && wc(e.segments, i, r) && e.children[Z]) && J1(e.children[Z], n, o, r);
        }
      }
      function wc(e, n, t) {
        return n.every((r, i) => q1[t](e[i].parameters, r.parameters));
      }
      class pi {
        constructor(n, t, r) {
          (this.root = n), (this.queryParams = t), (this.fragment = r);
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ao(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return xL.serialize(this);
        }
      }
      class ee {
        constructor(n, t) {
          (this.segments = n), (this.children = t), (this.parent = null), mt(t, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Cc(this);
        }
      }
      class Zs {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return this._parameterMap || (this._parameterMap = Ao(this.parameters)), this._parameterMap;
        }
        toString() {
          return nw(this);
        }
      }
      function gi(e, n) {
        return e.length === n.length && e.every((t, r) => t.path === n[r].path);
      }
      let Z1 = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return new cp();
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      class cp {
        parse(n) {
          const t = new UL(n);
          return new pi(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
        }
        serialize(n) {
          const t = `/${ea(n.root, !0)}`,
            r = (function LL(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const r = e[t];
                  return Array.isArray(r) ? r.map((i) => `${Nc(t)}=${Nc(i)}`).join('&') : `${Nc(t)}=${Nc(r)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join('&')}` : '';
            })(n.queryParams);
          return `${t}${r}${
            'string' == typeof n.fragment
              ? `#${(function FL(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ''
          }`;
        }
      }
      const xL = new cp();
      function Cc(e) {
        return e.segments.map((n) => nw(n)).join('/');
      }
      function ea(e, n) {
        if (!e.hasChildren()) return Cc(e);
        if (n) {
          const t = e.children[Z] ? ea(e.children[Z], !1) : '',
            r = [];
          return (
            mt(e.children, (i, o) => {
              o !== Z && r.push(`${o}:${ea(i, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join('//')})` : t
          );
        }
        {
          const t = (function PL(e, n) {
            let t = [];
            return (
              mt(e.children, (r, i) => {
                i === Z && (t = t.concat(n(r, i)));
              }),
              mt(e.children, (r, i) => {
                i !== Z && (t = t.concat(n(r, i)));
              }),
              t
            );
          })(e, (r, i) => (i === Z ? [ea(e.children[Z], !1)] : [`${i}:${ea(r, !1)}`]));
          return 1 === Object.keys(e.children).length && null != e.children[Z]
            ? `${Cc(e)}/${t[0]}`
            : `${Cc(e)}/(${t.join('//')})`;
        }
      }
      function ew(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/g, '$')
          .replace(/%2C/gi, ',');
      }
      function Nc(e) {
        return ew(e).replace(/%3B/gi, ';');
      }
      function up(e) {
        return ew(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
      }
      function Tc(e) {
        return decodeURIComponent(e);
      }
      function tw(e) {
        return Tc(e.replace(/\+/g, '%20'));
      }
      function nw(e) {
        return `${up(e.path)}${(function kL(e) {
          return Object.keys(e)
            .map((n) => `;${up(n)}=${up(e[n])}`)
            .join('');
        })(e.parameters)}`;
      }
      const VL = /^[^\/()?;=#]+/;
      function Ec(e) {
        const n = e.match(VL);
        return n ? n[0] : '';
      }
      const BL = /^[^=?&#]+/,
        jL = /^[^&#]+/;
      class UL {
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
          let r = {};
          return (
            this.peekStartsWith('(') && (r = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) && (r[Z] = new ee(n, t)),
            r
          );
        }
        parseSegment() {
          const n = Ec(this.remaining);
          if ('' === n && this.peekStartsWith(';')) throw new S(4009, !1);
          return this.capture(n), new Zs(Tc(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(';'); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = Ec(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = '';
          if (this.consumeOptional('=')) {
            const i = Ec(this.remaining);
            i && ((r = i), this.capture(r));
          }
          n[Tc(t)] = Tc(r);
        }
        parseQueryParam(n) {
          const t = (function HL(e) {
            const n = e.match(BL);
            return n ? n[0] : '';
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = '';
          if (this.consumeOptional('=')) {
            const s = (function GL(e) {
              const n = e.match(jL);
              return n ? n[0] : '';
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = tw(t),
            o = tw(r);
          if (n.hasOwnProperty(i)) {
            let s = n[i];
            Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o);
          } else n[i] = o;
        }
        parseParens(n) {
          const t = {};
          for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
            const r = Ec(this.remaining),
              i = this.remaining[r.length];
            if ('/' !== i && ')' !== i && ';' !== i) throw new S(4010, !1);
            let o;
            r.indexOf(':') > -1 ? ((o = r.slice(0, r.indexOf(':'))), this.capture(o), this.capture(':')) : n && (o = Z);
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
      function dp(e) {
        return e.segments.length > 0 ? new ee([], { [Z]: e }) : e;
      }
      function Sc(e) {
        const n = {};
        for (const r of Object.keys(e.children)) {
          const o = Sc(e.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
        }
        return (function $L(e) {
          if (1 === e.numberOfChildren && e.children[Z]) {
            const n = e.children[Z];
            return new ee(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new ee(e.segments, n));
      }
      function _i(e) {
        return e instanceof pi;
      }
      function KL(e, n, t, r, i) {
        if (0 === t.length) return Io(n.root, n.root, n.root, r, i);
        const o = (function ow(e) {
          if ('string' == typeof e[0] && 1 === e.length && '/' === e[0]) return new iw(!0, 0, e);
          let n = 0,
            t = !1;
          const r = e.reduce((i, o, s) => {
            if ('object' == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  mt(o.outlets, (l, c) => {
                    a[c] = 'string' == typeof l ? l.split('/') : l;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return 'string' != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split('/').forEach((a, l) => {
                  (0 == l && '.' === a) || (0 == l && '' === a ? (t = !0) : '..' === a ? n++ : '' != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new iw(t, n, r);
        })(t);
        return o.toRoot()
          ? Io(n.root, n.root, new ee([], {}), r, i)
          : (function s(l) {
              const c = (function QL(e, n, t, r) {
                  if (e.isAbsolute) return new Ro(n.root, !0, 0);
                  if (-1 === r) return new Ro(t, t === n.root, 0);
                  return (function sw(e, n, t) {
                    let r = e,
                      i = n,
                      o = t;
                    for (; o > i; ) {
                      if (((o -= i), (r = r.parent), !r)) throw new S(4005, !1);
                      i = r.segments.length;
                    }
                    return new Ro(r, !1, i - o);
                  })(t, r + (ta(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(o, n, e.snapshot?._urlSegment, l),
                u = c.processChildren
                  ? ra(c.segmentGroup, c.index, o.commands)
                  : hp(c.segmentGroup, c.index, o.commands);
              return Io(n.root, c.segmentGroup, u, r, i);
            })(e.snapshot?._lastPathIndex);
      }
      function ta(e) {
        return 'object' == typeof e && null != e && !e.outlets && !e.segmentPath;
      }
      function na(e) {
        return 'object' == typeof e && null != e && e.outlets;
      }
      function Io(e, n, t, r, i) {
        let s,
          o = {};
        r &&
          mt(r, (l, c) => {
            o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
          }),
          (s = e === n ? t : rw(e, n, t));
        const a = dp(Sc(s));
        return new pi(a, o, i);
      }
      function rw(e, n, t) {
        const r = {};
        return (
          mt(e.children, (i, o) => {
            r[o] = i === n ? t : rw(i, n, t);
          }),
          new ee(e.segments, r)
        );
      }
      class iw {
        constructor(n, t, r) {
          if (
            ((this.isAbsolute = n), (this.numberOfDoubleDots = t), (this.commands = r), n && r.length > 0 && ta(r[0]))
          )
            throw new S(4003, !1);
          const i = r.find(na);
          if (i && i !== K1(r)) throw new S(4004, !1);
        }
        toRoot() {
          return this.isAbsolute && 1 === this.commands.length && '/' == this.commands[0];
        }
      }
      class Ro {
        constructor(n, t, r) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = r);
        }
      }
      function hp(e, n, t) {
        if ((e || (e = new ee([], {})), 0 === e.segments.length && e.hasChildren())) return ra(e, n, t);
        const r = (function YL(e, n, t) {
            let r = 0,
              i = n;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= t.length) return o;
              const s = e.segments[i],
                a = t[r];
              if (na(a)) break;
              const l = `${a}`,
                c = r < t.length - 1 ? t[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && c && 'object' == typeof c && void 0 === c.outlets) {
                if (!lw(l, c, s)) return o;
                r += 2;
              } else {
                if (!lw(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, n, t),
          i = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new ee(e.segments.slice(0, r.pathIndex), {});
          return (o.children[Z] = new ee(e.segments.slice(r.pathIndex), e.children)), ra(o, 0, i);
        }
        return r.match && 0 === i.length
          ? new ee(e.segments, {})
          : r.match && !e.hasChildren()
          ? pp(e, n, t)
          : r.match
          ? ra(e, 0, i)
          : pp(e, n, t);
      }
      function ra(e, n, t) {
        if (0 === t.length) return new ee(e.segments, {});
        {
          const r = (function XL(e) {
              return na(e[0]) ? e[0].outlets : { [Z]: e };
            })(t),
            i = {};
          return (
            mt(r, (o, s) => {
              'string' == typeof o && (o = [o]), null !== o && (i[s] = hp(e.children[s], n, o));
            }),
            mt(e.children, (o, s) => {
              void 0 === r[s] && (i[s] = o);
            }),
            new ee(e.segments, i)
          );
        }
      }
      function pp(e, n, t) {
        const r = e.segments.slice(0, n);
        let i = 0;
        for (; i < t.length; ) {
          const o = t[i];
          if (na(o)) {
            const l = JL(o.outlets);
            return new ee(r, l);
          }
          if (0 === i && ta(t[0])) {
            r.push(new Zs(e.segments[n].path, aw(t[0]))), i++;
            continue;
          }
          const s = na(o) ? o.outlets[Z] : `${o}`,
            a = i < t.length - 1 ? t[i + 1] : null;
          s && a && ta(a) ? (r.push(new Zs(s, aw(a))), (i += 2)) : (r.push(new Zs(s, {})), i++);
        }
        return new ee(r, {});
      }
      function JL(e) {
        const n = {};
        return (
          mt(e, (t, r) => {
            'string' == typeof t && (t = [t]), null !== t && (n[r] = pp(new ee([], {}), 0, t));
          }),
          n
        );
      }
      function aw(e) {
        const n = {};
        return mt(e, (t, r) => (n[r] = `${t}`)), n;
      }
      function lw(e, n, t) {
        return e == t.path && qn(n, t.parameters);
      }
      class _r {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class gp extends _r {
        constructor(n, t, r = 'imperative', i = null) {
          super(n, t), (this.type = 0), (this.navigationTrigger = r), (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Hr extends _r {
        constructor(n, t, r) {
          super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Mc extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class cw extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class ZL extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class eV extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class tV extends _r {
        constructor(n, t, r, i, o) {
          super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.shouldActivate = o), (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class nV extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class rV extends _r {
        constructor(n, t, r, i) {
          super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class iV {
        constructor(n) {
          (this.route = n), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class oV {
        constructor(n) {
          (this.route = n), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class sV {
        constructor(n) {
          (this.snapshot = n), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class aV {
        constructor(n) {
          (this.snapshot = n), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class lV {
        constructor(n) {
          (this.snapshot = n), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class cV {
        constructor(n) {
          (this.snapshot = n), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
        }
      }
      class uw {
        constructor(n, t, r) {
          (this.routerEvent = n), (this.position = t), (this.anchor = r), (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class dw {
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
          const t = _p(n, this._root);
          return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(n) {
          const t = _p(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = mp(n, this._root);
          return t.length < 2 ? [] : t[t.length - 2].children.map((i) => i.value).filter((i) => i !== n);
        }
        pathFromRoot(n) {
          return mp(n, this._root).map((t) => t.value);
        }
      }
      function _p(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const r = _p(e, t);
          if (r) return r;
        }
        return null;
      }
      function mp(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const r = mp(e, t);
          if (r.length) return r.unshift(n), r;
        }
        return [];
      }
      class mr {
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
      class fw extends dw {
        constructor(n, t) {
          super(n), (this.snapshot = t), vp(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function hw(e, n) {
        const t = (function dV(e, n) {
            const s = new Oc([], {}, {}, '', {}, Z, n, null, e.root, -1, {});
            return new gw('', new mr(s, []));
          })(e, n),
          r = new pt([new Zs('', {})]),
          i = new pt({}),
          o = new pt({}),
          s = new pt({}),
          a = new pt(''),
          l = new jr(r, i, s, a, o, Z, n, t.root);
        return (l.snapshot = t.root), new fw(new mr(l, []), t);
      }
      class jr {
        constructor(n, t, r, i, o, s, a, l) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
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
          return this._paramMap || (this._paramMap = this.params.pipe(L((n) => Ao(n)))), this._paramMap;
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(L((n) => Ao(n)))), this._queryParamMap
          );
        }
        toString() {
          return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
        }
      }
      function pw(e, n = 'emptyOnly') {
        const t = e.pathFromRoot;
        let r = 0;
        if ('always' !== n)
          for (r = t.length - 1; r >= 1; ) {
            const i = t[r],
              o = t[r - 1];
            if (i.routeConfig && '' === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function fV(e) {
          return e.reduce(
            (n, t) => ({
              params: { ...n.params, ...t.params },
              data: { ...n.data, ...t.data },
              resolve: { ...t.data, ...n.resolve, ...t.routeConfig?.data, ...t._resolvedData },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(r));
      }
      class Oc {
        constructor(n, t, r, i, o, s, a, l, c, u, d, f) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
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
          return this._paramMap || (this._paramMap = Ao(this.params)), this._paramMap;
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ao(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return `Route(url:'${this.url.map((r) => r.toString()).join('/')}', path:'${
            this.routeConfig ? this.routeConfig.path : ''
          }')`;
        }
      }
      class gw extends dw {
        constructor(n, t) {
          super(t), (this.url = n), vp(this, t);
        }
        toString() {
          return _w(this._root);
        }
      }
      function vp(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => vp(e, t));
      }
      function _w(e) {
        const n = e.children.length > 0 ? ` { ${e.children.map(_w).join(', ')} } ` : '';
        return `${e.value}${n}`;
      }
      function yp(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            qn(n.queryParams, t.queryParams) || e.queryParams.next(t.queryParams),
            n.fragment !== t.fragment && e.fragment.next(t.fragment),
            qn(n.params, t.params) || e.params.next(t.params),
            (function SL(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!qn(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.url.next(t.url),
            qn(n.data, t.data) || e.data.next(t.data);
        } else (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function bp(e, n) {
        const t =
          qn(e.params, n.params) &&
          (function RL(e, n) {
            return gi(e, n) && e.every((t, r) => qn(t.parameters, n[r].parameters));
          })(e.url, n.url);
        return t && !(!e.parent != !n.parent) && (!e.parent || bp(e.parent, n.parent));
      }
      function ia(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = n.value;
          const i = (function pV(e, n, t) {
            return n.children.map((r) => {
              for (const i of t.children) if (e.shouldReuseRoute(r.value, i.value.snapshot)) return ia(e, r, i);
              return ia(e, r);
            });
          })(e, n, t);
          return new mr(r, i);
        }
        {
          if (e.shouldAttach(n.value)) {
            const o = e.retrieve(n.value);
            if (null !== o) {
              const s = o.route;
              return (s.value._futureSnapshot = n.value), (s.children = n.children.map((a) => ia(e, a))), s;
            }
          }
          const r = (function gV(e) {
              return new jr(
                new pt(e.url),
                new pt(e.params),
                new pt(e.queryParams),
                new pt(e.fragment),
                new pt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            i = n.children.map((o) => ia(e, o));
          return new mr(r, i);
        }
      }
      const Dp = 'ngNavigationCancelingError';
      function mw(e, n) {
        const { redirectTo: t, navigationBehaviorOptions: r } = _i(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
          i = vw(!1, 0, n);
        return (i.url = t), (i.navigationBehaviorOptions = r), i;
      }
      function vw(e, n, t) {
        const r = new Error('NavigationCancelingError: ' + (e || ''));
        return (r[Dp] = !0), (r.cancellationCode = n), t && (r.url = t), r;
      }
      function yw(e) {
        return bw(e) && _i(e.url);
      }
      function bw(e) {
        return e && e[Dp];
      }
      class _V {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new oa()),
            (this.attachRef = null);
        }
      }
      let oa = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, r) {
            const i = this.getOrCreateContext(t);
            (i.outlet = r), this.contexts.set(t, i);
          }
          onChildOutletDestroyed(t) {
            const r = this.getContext(t);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let r = this.getContext(t);
            return r || ((r = new _V()), this.contexts.set(t, r)), r;
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
      let Ic = (() => {
        class e {
          constructor(t, r, i, o, s) {
            (this.parentContexts = t),
              (this.location = r),
              (this.changeDetector = o),
              (this.environmentInjector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new j()),
              (this.deactivateEvents = new j()),
              (this.attachEvents = new j()),
              (this.detachEvents = new j()),
              (this.name = i || Z),
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
          attach(t, r) {
            (this.activated = t),
              (this._activatedRoute = r),
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
          activateWith(t, r) {
            if (this.isActivated) throw new S(4013, Ac);
            this._activatedRoute = t;
            const i = this.location,
              s = t._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new mV(t, a, i.injector);
            if (
              r &&
              (function vV(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const c = r.resolveComponentFactory(s);
              this.activated = i.createComponent(c, i.length, l);
            } else
              this.activated = i.createComponent(s, {
                index: i.length,
                injector: l,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(), this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(oa), _(Cn), ni('name'), _(Tn), _(Or));
          }),
          (e.ɵdir = O({
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
      class mV {
        constructor(n, t, r) {
          (this.route = n), (this.childContexts = t), (this.parent = r);
        }
        get(n, t) {
          return n === jr ? this.route : n === oa ? this.childContexts : this.parent.get(n, t);
        }
      }
      let Dw = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵcmp = gt({
            type: e,
            selectors: [['ng-component']],
            decls: 1,
            vars: 0,
            template: function (t, r) {
              1 & t && Oe(0, 'router-outlet');
            },
            dependencies: [Ic],
            encapsulation: 2,
          })),
          e
        );
      })();
      function ww(e, n) {
        return e.providers && !e._injector && (e._injector = xl(e.providers, n, `Route: ${e.path}`)), e._injector ?? n;
      }
      function Cp(e) {
        const n = e.children && e.children.map(Cp),
          t = n ? { ...e, children: n } : { ...e };
        return (
          !t.component && !t.loadComponent && (n || t.loadChildren) && t.outlet && t.outlet !== Z && (t.component = Dw),
          t
        );
      }
      function an(e) {
        return e.outlet || Z;
      }
      function Cw(e, n) {
        const t = e.filter((r) => an(r) === n);
        return t.push(...e.filter((r) => an(r) !== n)), t;
      }
      function Nw(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let n = e.parent; n; n = n.parent) {
          const t = n.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class CV {
        constructor(n, t, r, i) {
          (this.routeReuseStrategy = n), (this.futureState = t), (this.currState = r), (this.forwardEvent = i);
        }
        activate(n) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, n), yp(this.futureState.root), this.activateChildRoutes(t, r, n);
        }
        deactivateChildRoutes(n, t, r) {
          const i = Po(t);
          n.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            mt(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(n, t, r) {
          const i = n.value,
            o = t ? t.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, r);
          else o && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const r = t.getContext(n.value.outlet),
            i = r && n.value.component ? r.children : t,
            o = Po(n);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, { componentRef: s, route: n, contexts: a });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const r = t.getContext(n.value.outlet),
            i = r && n.value.component ? r.children : t,
            o = Po(n);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(n, t, r) {
          const i = Po(t);
          n.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r), this.forwardEvent(new cV(o.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new aV(n.value.snapshot));
        }
        activateRoutes(n, t, r) {
          const i = n.value,
            o = t ? t.value : null;
          if ((yp(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                yp(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = Nw(i.snapshot),
                l = a?.get(gs) ?? null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = l),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, r);
        }
      }
      class Tw {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Rc {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function NV(e, n, t) {
        const r = e._root;
        return sa(r, n ? n._root : null, t, [r.value]);
      }
      function Pc(e, n, t) {
        return (Nw(n) ?? t).get(e);
      }
      function sa(e, n, t, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
        const o = Po(n);
        return (
          e.children.forEach((s) => {
            (function EV(e, n, t, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
              const o = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function SV(e, n, t) {
                  if ('function' == typeof t) return t(e, n);
                  switch (t) {
                    case 'pathParamsChange':
                      return !gi(e.url, n.url);
                    case 'pathParamsOrQueryParamsChange':
                      return !gi(e.url, n.url) || !qn(e.queryParams, n.queryParams);
                    case 'always':
                      return !0;
                    case 'paramsOrQueryParamsChange':
                      return !bp(e, n) || !qn(e.queryParams, n.queryParams);
                    default:
                      return !bp(e, n);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l ? i.canActivateChecks.push(new Tw(r)) : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  sa(e, n, o.component ? (a ? a.children : null) : t, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new Rc(a.outlet.component, s));
              } else
                s && aa(n, a, i),
                  i.canActivateChecks.push(new Tw(r)),
                  sa(e, null, o.component ? (a ? a.children : null) : t, r, i);
            })(s, o[s.value.outlet], t, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          mt(o, (s, a) => aa(s, t.getContext(a), i)),
          i
        );
      }
      function aa(e, n, t) {
        const r = Po(e),
          i = e.value;
        mt(r, (o, s) => {
          aa(o, i.component ? (n ? n.children.getContext(s) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new Rc(i.component && n && n.outlet && n.outlet.isActivated ? n.outlet.component : null, i)
          );
      }
      function la(e) {
        return 'function' == typeof e;
      }
      function Np(e) {
        return e instanceof vc || 'EmptyError' === e?.name;
      }
      const xc = Symbol('INITIAL_VALUE');
      function xo() {
        return at((e) =>
          yc(
            e.map((n) =>
              n.pipe(
                we(1),
                (function bc(...e) {
                  const n = zo(e);
                  return Re((t, r) => {
                    (n ? Vr(e, t, n) : Vr(e, t)).subscribe(r);
                  });
                })(xc)
              )
            )
          ).pipe(
            L((n) => {
              for (const t of n)
                if (!0 !== t) {
                  if (t === xc) return xc;
                  if (!1 === t || t instanceof pi) return t;
                }
              return !0;
            }),
            Ae((n) => n !== xc),
            we(1)
          )
        );
      }
      function Ew(e) {
        return (function DT(...e) {
          return Ig(e);
        })(
          lt((n) => {
            if (_i(n)) throw mw(0, n);
          }),
          L((n) => !0 === n)
        );
      }
      const Tp = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Sw(e, n, t, r, i) {
        const o = Ep(e, n, t);
        return o.matched
          ? (function $V(e, n, t, r) {
              const i = n.canMatch;
              return i && 0 !== i.length
                ? P(
                    i.map((s) => {
                      const a = e.get(s),
                        l = (function PV(e) {
                          return e && la(e.canMatch);
                        })(a)
                          ? a.canMatch(n, t)
                          : a(n, t);
                      return gr(l);
                    })
                  ).pipe(xo(), Ew())
                : P(!0);
            })((r = ww(n, r)), n, t).pipe(L((s) => (!0 === s ? o : { ...Tp })))
          : P(o);
      }
      function Ep(e, n, t) {
        if ('' === n.path)
          return 'full' === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? { ...Tp }
            : { matched: !0, consumedSegments: [], remainingSegments: t, parameters: {}, positionalParamSegments: {} };
        const i = (n.matcher || EL)(t, e, n);
        if (!i) return { ...Tp };
        const o = {};
        mt(i.posParams, (a, l) => {
          o[l] = a.path;
        });
        const s = i.consumed.length > 0 ? { ...o, ...i.consumed[i.consumed.length - 1].parameters } : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: t.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function Fc(e, n, t, r, i = 'corrected') {
        if (
          t.length > 0 &&
          (function KV(e, n, t) {
            return t.some((r) => kc(e, n, r) && an(r) !== Z);
          })(e, t, r)
        ) {
          const s = new ee(
            n,
            (function zV(e, n, t, r) {
              const i = {};
              (i[Z] = r), (r._sourceSegment = e), (r._segmentIndexShift = n.length);
              for (const o of t)
                if ('' === o.path && an(o) !== Z) {
                  const s = new ee([], {});
                  (s._sourceSegment = e), (s._segmentIndexShift = n.length), (i[an(o)] = s);
                }
              return i;
            })(e, n, r, new ee(t, e.children))
          );
          return (s._sourceSegment = e), (s._segmentIndexShift = n.length), { segmentGroup: s, slicedSegments: [] };
        }
        if (
          0 === t.length &&
          (function qV(e, n, t) {
            return t.some((r) => kc(e, n, r));
          })(e, t, r)
        ) {
          const s = new ee(
            e.segments,
            (function WV(e, n, t, r, i, o) {
              const s = {};
              for (const a of r)
                if (kc(e, t, a) && !i[an(a)]) {
                  const l = new ee([], {});
                  (l._sourceSegment = e),
                    (l._segmentIndexShift = 'legacy' === o ? e.segments.length : n.length),
                    (s[an(a)] = l);
                }
              return { ...i, ...s };
            })(e, n, t, r, e.children, i)
          );
          return (s._sourceSegment = e), (s._segmentIndexShift = n.length), { segmentGroup: s, slicedSegments: t };
        }
        const o = new ee(e.segments, e.children);
        return (o._sourceSegment = e), (o._segmentIndexShift = n.length), { segmentGroup: o, slicedSegments: t };
      }
      function kc(e, n, t) {
        return (!(e.hasChildren() || n.length > 0) || 'full' !== t.pathMatch) && '' === t.path;
      }
      function Mw(e, n, t, r) {
        return !!(an(e) === r || (r !== Z && kc(n, t, e))) && ('**' === e.path || Ep(n, e, t).matched);
      }
      function Ow(e, n, t) {
        return 0 === n.length && !e.children[t];
      }
      const Lc = !1;
      class Vc {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class Aw {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function ca(e) {
        return Oo(new Vc(e));
      }
      function Iw(e) {
        return Oo(new Aw(e));
      }
      class JV {
        constructor(n, t, r, i, o) {
          (this.injector = n),
            (this.configLoader = t),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const n = Fc(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new ee(n.segments, n.children);
          return this.expandSegmentGroup(this.injector, this.config, t, Z)
            .pipe(L((o) => this.createUrlTree(Sc(o), this.urlTree.queryParams, this.urlTree.fragment)))
            .pipe(
              Kn((o) => {
                if (o instanceof Aw) return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof Vc ? this.noMatchError(o) : o;
              })
            );
        }
        match(n) {
          return this.expandSegmentGroup(this.injector, this.config, n.root, Z)
            .pipe(L((i) => this.createUrlTree(Sc(i), n.queryParams, n.fragment)))
            .pipe(
              Kn((i) => {
                throw i instanceof Vc ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(n) {
          return new S(4002, Lc);
        }
        createUrlTree(n, t, r) {
          const i = dp(n);
          return new pi(i, t, r);
        }
        expandSegmentGroup(n, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(n, t, r).pipe(L((o) => new ee([], o)))
            : this.expandSegment(n, r, t, r.segments, i, !0);
        }
        expandChildren(n, t, r) {
          const i = [];
          for (const o of Object.keys(r.children)) 'primary' === o ? i.unshift(o) : i.push(o);
          return $e(i).pipe(
            pr((o) => {
              const s = r.children[o],
                a = Cw(t, o);
              return this.expandSegmentGroup(n, a, s, o).pipe(L((l) => ({ segment: l, outlet: o })));
            }),
            G1((o, s) => ((o[s.outlet] = s.segment), o), {}),
            U1()
          );
        }
        expandSegment(n, t, r, i, o, s) {
          return $e(r).pipe(
            pr((a) =>
              this.expandSegmentAgainstRoute(n, t, r, a, i, o, s).pipe(
                Kn((c) => {
                  if (c instanceof Vc) return P(null);
                  throw c;
                })
              )
            ),
            Br((a) => !!a),
            Kn((a, l) => {
              if (Np(a)) return Ow(t, i, o) ? P(new ee([], {})) : ca(t);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(n, t, r, i, o, s, a) {
          return Mw(i, t, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(n, t, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s)
              : ca(t)
            : ca(t);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
          return '**' === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s);
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith('/')
            ? Iw(o)
            : this.lineralizeSegments(r, o).pipe(
                Ue((s) => {
                  const a = new ee(s, {});
                  return this.expandSegment(n, a, t, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
          const { matched: a, consumedSegments: l, remainingSegments: c, positionalParamSegments: u } = Ep(t, i, o);
          if (!a) return ca(t);
          const d = this.applyRedirectCommands(l, i.redirectTo, u);
          return i.redirectTo.startsWith('/')
            ? Iw(d)
            : this.lineralizeSegments(i, d).pipe(Ue((f) => this.expandSegment(n, t, r, f.concat(c), s, !1)));
        }
        matchSegmentAgainstRoute(n, t, r, i, o) {
          return '**' === r.path
            ? ((n = ww(r, n)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? P({ routes: r._loadedRoutes, injector: r._loadedInjector })
                    : this.configLoader.loadChildren(n, r)
                  ).pipe(L((a) => ((r._loadedRoutes = a.routes), (r._loadedInjector = a.injector), new ee(i, {}))))
                : P(new ee(i, {})))
            : Sw(t, r, i, n).pipe(
                at(({ matched: s, consumedSegments: a, remainingSegments: l }) =>
                  s
                    ? this.getChildConfig((n = r._injector ?? n), r, i).pipe(
                        Ue((u) => {
                          const d = u.injector ?? n,
                            f = u.routes,
                            { segmentGroup: h, slicedSegments: p } = Fc(t, a, l, f),
                            g = new ee(h.segments, h.children);
                          if (0 === p.length && g.hasChildren())
                            return this.expandChildren(d, f, g).pipe(L((b) => new ee(a, b)));
                          if (0 === f.length && 0 === p.length) return P(new ee(a, {}));
                          const v = an(r) === o;
                          return this.expandSegment(d, g, f, p, v ? Z : o, !0).pipe(
                            L((D) => new ee(a.concat(D.segments), D.children))
                          );
                        })
                      )
                    : ca(t)
                )
              );
        }
        getChildConfig(n, t, r) {
          return t.children
            ? P({ routes: t.children, injector: n })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? P({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function UV(e, n, t, r) {
                  const i = n.canLoad;
                  return void 0 === i || 0 === i.length
                    ? P(!0)
                    : P(
                        i.map((s) => {
                          const a = e.get(s),
                            l = (function OV(e) {
                              return e && la(e.canLoad);
                            })(a)
                              ? a.canLoad(n, t)
                              : a(n, t);
                          return gr(l);
                        })
                      ).pipe(xo(), Ew());
                })(n, t, r).pipe(
                  Ue((i) =>
                    i
                      ? this.configLoader.loadChildren(n, t).pipe(
                          lt((o) => {
                            (t._loadedRoutes = o.routes), (t._loadedInjector = o.injector);
                          })
                        )
                      : (function XV(e) {
                          return Oo(vw(Lc, 3));
                        })()
                  )
                )
            : P({ routes: [], injector: n });
        }
        lineralizeSegments(n, t) {
          let r = [],
            i = t.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren)) return P(r);
            if (i.numberOfChildren > 1 || !i.children[Z]) return Oo(new S(4e3, Lc));
            i = i.children[Z];
          }
        }
        applyRedirectCommands(n, t, r) {
          return this.applyRedirectCreateUrlTree(t, this.urlSerializer.parse(t), n, r);
        }
        applyRedirectCreateUrlTree(n, t, r, i) {
          const o = this.createSegmentGroup(n, t.root, r, i);
          return new pi(o, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
        }
        createQueryParams(n, t) {
          const r = {};
          return (
            mt(n, (i, o) => {
              if ('string' == typeof i && i.startsWith(':')) {
                const a = i.substring(1);
                r[o] = t[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(n, t, r, i) {
          const o = this.createSegments(n, t.segments, r, i);
          let s = {};
          return (
            mt(t.children, (a, l) => {
              s[l] = this.createSegmentGroup(n, a, r, i);
            }),
            new ee(o, s)
          );
        }
        createSegments(n, t, r, i) {
          return t.map((o) => (o.path.startsWith(':') ? this.findPosParam(n, o, i) : this.findOrReturn(o, r)));
        }
        findPosParam(n, t, r) {
          const i = r[t.path.substring(1)];
          if (!i) throw new S(4001, Lc);
          return i;
        }
        findOrReturn(n, t) {
          let r = 0;
          for (const i of t) {
            if (i.path === n.path) return t.splice(r), i;
            r++;
          }
          return n;
        }
      }
      class e2 {}
      class r2 {
        constructor(n, t, r, i, o, s, a, l) {
          (this.injector = n),
            (this.rootComponentType = t),
            (this.config = r),
            (this.urlTree = i),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = l);
        }
        recognize() {
          const n = Fc(
            this.urlTree.root,
            [],
            [],
            this.config.filter((t) => void 0 === t.redirectTo),
            this.relativeLinkResolution
          ).segmentGroup;
          return this.processSegmentGroup(this.injector, this.config, n, Z).pipe(
            L((t) => {
              if (null === t) return null;
              const r = new Oc(
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
                i = new mr(r, t),
                o = new gw(this.url, i);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(n) {
          const t = n.value,
            r = pw(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(r.params)),
            (t.data = Object.freeze(r.data)),
            n.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(n, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(n, t, r)
            : this.processSegment(n, t, r, r.segments, i);
        }
        processChildren(n, t, r) {
          return $e(Object.keys(r.children)).pipe(
            pr((i) => {
              const o = r.children[i],
                s = Cw(t, i);
              return this.processSegmentGroup(n, s, o, i);
            }),
            G1((i, o) => (i && o ? (i.push(...o), i) : null)),
            (function NL(e, n = !1) {
              return Re((t, r) => {
                let i = 0;
                t.subscribe(
                  Ce(r, (o) => {
                    const s = e(o, i++);
                    (s || n) && r.next(o), !s && r.complete();
                  })
                );
              });
            })((i) => null !== i),
            Dc(null),
            U1(),
            L((i) => {
              if (null === i) return null;
              const o = Rw(i);
              return (
                (function o2(e) {
                  e.sort((n, t) =>
                    n.value.outlet === Z ? -1 : t.value.outlet === Z ? 1 : n.value.outlet.localeCompare(t.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(n, t, r, i, o) {
          return $e(t).pipe(
            pr((s) => this.processSegmentAgainstRoute(s._injector ?? n, s, r, i, o)),
            Br((s) => !!s),
            Kn((s) => {
              if (Np(s)) return Ow(r, i, o) ? P([]) : P(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(n, t, r, i, o) {
          if (t.redirectTo || !Mw(t, r, i, o)) return P(null);
          let s;
          if ('**' === t.path) {
            const a = i.length > 0 ? K1(i).parameters : {},
              l = xw(r) + i.length;
            s = P({
              snapshot: new Oc(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                kw(t),
                an(t),
                t.component ?? t._loadedComponent ?? null,
                t,
                Pw(r),
                l,
                Lw(t),
                l
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = Sw(r, t, i, n).pipe(
              L(({ matched: a, consumedSegments: l, remainingSegments: c, parameters: u }) => {
                if (!a) return null;
                const d = xw(r) + l.length;
                return {
                  snapshot: new Oc(
                    l,
                    u,
                    Object.freeze({ ...this.urlTree.queryParams }),
                    this.urlTree.fragment,
                    kw(t),
                    an(t),
                    t.component ?? t._loadedComponent ?? null,
                    t,
                    Pw(r),
                    d,
                    Lw(t),
                    d
                  ),
                  consumedSegments: l,
                  remainingSegments: c,
                };
              })
            );
          return s.pipe(
            at((a) => {
              if (null === a) return P(null);
              const { snapshot: l, consumedSegments: c, remainingSegments: u } = a;
              n = t._injector ?? n;
              const d = t._loadedInjector ?? n,
                f = (function s2(e) {
                  return e.children ? e.children : e.loadChildren ? e._loadedRoutes : [];
                })(t),
                { segmentGroup: h, slicedSegments: p } = Fc(
                  r,
                  c,
                  u,
                  f.filter((v) => void 0 === v.redirectTo),
                  this.relativeLinkResolution
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(L((v) => (null === v ? null : [new mr(l, v)])));
              if (0 === f.length && 0 === p.length) return P([new mr(l, [])]);
              const g = an(t) === o;
              return this.processSegment(d, f, h, p, g ? Z : o).pipe(L((v) => (null === v ? null : [new mr(l, v)])));
            })
          );
        }
      }
      function a2(e) {
        const n = e.value.routeConfig;
        return n && '' === n.path && void 0 === n.redirectTo;
      }
      function Rw(e) {
        const n = [],
          t = new Set();
        for (const r of e) {
          if (!a2(r)) {
            n.push(r);
            continue;
          }
          const i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), t.add(i)) : n.push(r);
        }
        for (const r of t) {
          const i = Rw(r.children);
          n.push(new mr(r.value, i));
        }
        return n.filter((r) => !t.has(r));
      }
      function Pw(e) {
        let n = e;
        for (; n._sourceSegment; ) n = n._sourceSegment;
        return n;
      }
      function xw(e) {
        let n = e,
          t = n._segmentIndexShift ?? 0;
        for (; n._sourceSegment; ) (n = n._sourceSegment), (t += n._segmentIndexShift ?? 0);
        return t - 1;
      }
      function kw(e) {
        return e.data || {};
      }
      function Lw(e) {
        return e.resolve || {};
      }
      const Sp = Symbol('RouteTitle');
      function Vw(e) {
        return 'string' == typeof e.title || null === e.title;
      }
      function Mp(e) {
        return at((n) => {
          const t = e(n);
          return t ? $e(t).pipe(L(() => n)) : P(n);
        });
      }
      let Bw = (() => {
          class e {
            buildTitle(t) {
              let r,
                i = t.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r), (i = i.children.find((o) => o.outlet === Z));
              return r;
            }
            getResolvedTitleForRoute(t) {
              return t.data[Sp];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = M({
              token: e,
              factory: function () {
                return We(Hw);
              },
              providedIn: 'root',
            })),
            e
          );
        })(),
        Hw = (() => {
          class e extends Bw {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const r = this.buildTitle(t);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(Lh));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      class Op {}
      class _2 extends class g2 {
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
      const Ap = new k('', { providedIn: 'root', factory: () => ({}) }),
        Ip = new k('ROUTES');
      let Rp = (() => {
        class e {
          constructor(t, r) {
            (this.injector = t),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t)) return this.componentLoaders.get(t);
            if (t._loadedComponent) return P(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const r = gr(t.loadComponent()).pipe(
                lt((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(t), (t._loadedComponent = o);
                }),
                Js(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              i = new sp(r, () => new pe()).pipe(op());
            return this.componentLoaders.set(t, i), i;
          }
          loadChildren(t, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes) return P({ routes: r._loadedRoutes, injector: r._loadedInjector });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                L((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l,
                    c,
                    u = !1;
                  Array.isArray(a)
                    ? (c = a)
                    : ((l = a.create(t).injector), (c = z1(l.get(Ip, [], B.Self | B.Optional))));
                  return { routes: c.map(Cp), injector: l };
                }),
                Js(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new sp(o, () => new pe()).pipe(op());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(t) {
            return gr(t()).pipe(
              Ue((r) => (r instanceof N0 || Array.isArray(r) ? P(r) : $e(this.compiler.compileModuleAsync(r))))
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(_t), T(eh));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      class v2 {}
      class y2 {
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
      function b2(e) {
        throw e;
      }
      function D2(e, n, t) {
        return n.parse('/');
      }
      const w2 = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
        C2 = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' };
      function Gw() {
        const e = We(Z1),
          n = We(oa),
          t = We(_h),
          r = We(_t),
          i = We(eh),
          o = We(Ip, { optional: !0 }) ?? [],
          s = We(Ap, { optional: !0 }) ?? {},
          a = We(Hw),
          l = We(Bw, { optional: !0 }),
          c = We(v2, { optional: !0 }),
          u = We(Op, { optional: !0 }),
          d = new ct(null, e, n, t, r, i, z1(o));
        return (
          c && (d.urlHandlingStrategy = c),
          u && (d.routeReuseStrategy = u),
          (d.titleStrategy = l ?? a),
          (function N2(e, n) {
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
      let ct = (() => {
        class e {
          constructor(t, r, i, o, s, a, l) {
            (this.rootComponentType = t),
              (this.urlSerializer = r),
              (this.rootContexts = i),
              (this.location = o),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new pe()),
              (this.errorHandler = b2),
              (this.malformedUriErrorHandler = D2),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => P(void 0)),
              (this.urlHandlingStrategy = new y2()),
              (this.routeReuseStrategy = new _2()),
              (this.onSameUrlNavigation = 'ignore'),
              (this.paramsInheritanceStrategy = 'emptyOnly'),
              (this.urlUpdateStrategy = 'deferred'),
              (this.relativeLinkResolution = 'corrected'),
              (this.canceledNavigationResolution = 'replace'),
              (this.configLoader = s.get(Rp)),
              (this.configLoader.onLoadEndListener = (f) => this.triggerEvent(new oV(f))),
              (this.configLoader.onLoadStartListener = (f) => this.triggerEvent(new iV(f))),
              (this.ngModule = s.get(ci)),
              (this.console = s.get(MP));
            const d = s.get(me);
            (this.isNgZoneEnabled = d instanceof me && me.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function ML() {
                return new pi(new ee([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = hw(this.currentUrlTree, this.rootComponentType)),
              (this.transitions = new pt({
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
            const r = this.events;
            return t.pipe(
              Ae((i) => 0 !== i.id),
              L((i) => ({ ...i, extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl) })),
              at((i) => {
                let o = !1,
                  s = !1;
                return P(i).pipe(
                  lt((a) => {
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
                  at((a) => {
                    const l = this.browserUrlTree.toString(),
                      c = !this.navigated || a.extractedUrl.toString() !== l || l !== this.currentUrlTree.toString();
                    if (
                      ('reload' === this.onSameUrlNavigation || c) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        Uw(a.source) && (this.browserUrlTree = a.extractedUrl),
                        P(a).pipe(
                          at((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(new gp(d.id, this.serializeUrl(d.extractedUrl), d.source, d.restoredState)),
                              f !== this.transitions.getValue() ? Jt : Promise.resolve(d)
                            );
                          }),
                          (function ZV(e, n, t, r) {
                            return at((i) =>
                              (function YV(e, n, t, r, i) {
                                return new JV(e, n, t, r, i).apply();
                              })(e, n, t, i.extractedUrl, r).pipe(L((o) => ({ ...i, urlAfterRedirects: o })))
                            );
                          })(this.ngModule.injector, this.configLoader, this.urlSerializer, this.config),
                          lt((d) => {
                            (this.currentNavigation = { ...this.currentNavigation, finalUrl: d.urlAfterRedirects }),
                              (i.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function c2(e, n, t, r, i, o) {
                            return Ue((s) =>
                              (function n2(e, n, t, r, i, o, s = 'emptyOnly', a = 'legacy') {
                                return new r2(e, n, t, r, i, s, a, o).recognize().pipe(
                                  at((l) =>
                                    null === l
                                      ? (function t2(e) {
                                          return new he((n) => n.error(e));
                                        })(new e2())
                                      : P(l)
                                  )
                                );
                              })(e, n, t, s.urlAfterRedirects, r.serialize(s.urlAfterRedirects), r, i, o).pipe(
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
                          lt((d) => {
                            if (((i.targetSnapshot = d.targetSnapshot), 'eager' === this.urlUpdateStrategy)) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(d.urlAfterRedirects, d.rawUrl);
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new ZL(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (c && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
                      const { id: f, extractedUrl: h, source: p, restoredState: g, extras: v } = a,
                        y = new gp(f, this.serializeUrl(h), p, g);
                      r.next(y);
                      const D = hw(h, this.rootComponentType).snapshot;
                      return P(
                        (i = {
                          ...a,
                          targetSnapshot: D,
                          urlAfterRedirects: h,
                          extras: { ...v, skipLocationChange: !1, replaceUrl: !1 },
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), Jt;
                  }),
                  lt((a) => {
                    const l = new eV(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(l);
                  }),
                  L((a) => (i = { ...a, guards: NV(a.targetSnapshot, a.currentSnapshot, this.rootContexts) })),
                  (function FV(e, n) {
                    return Ue((t) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: i,
                        guards: { canActivateChecks: o, canDeactivateChecks: s },
                      } = t;
                      return 0 === s.length && 0 === o.length
                        ? P({ ...t, guardsResult: !0 })
                        : (function kV(e, n, t, r) {
                            return $e(e).pipe(
                              Ue((i) =>
                                (function GV(e, n, t, r, i) {
                                  const o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
                                  return o && 0 !== o.length
                                    ? P(
                                        o.map((a) => {
                                          const l = Pc(a, n, i);
                                          return gr(
                                            (function RV(e) {
                                              return e && la(e.canDeactivate);
                                            })(l)
                                              ? l.canDeactivate(e, n, t, r)
                                              : l(e, n, t, r)
                                          ).pipe(Br());
                                        })
                                      ).pipe(xo())
                                    : P(!0);
                                })(i.component, i.route, t, n, r)
                              ),
                              Br((i) => !0 !== i, !0)
                            );
                          })(s, r, i, e).pipe(
                            Ue((a) =>
                              a &&
                              (function MV(e) {
                                return 'boolean' == typeof e;
                              })(a)
                                ? (function LV(e, n, t, r) {
                                    return $e(n).pipe(
                                      pr((i) =>
                                        Vr(
                                          (function BV(e, n) {
                                            return null !== e && n && n(new sV(e)), P(!0);
                                          })(i.route.parent, r),
                                          (function VV(e, n) {
                                            return null !== e && n && n(new lV(e)), P(!0);
                                          })(i.route, r),
                                          (function jV(e, n, t) {
                                            const r = n[n.length - 1],
                                              o = n
                                                .slice(0, n.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function TV(e) {
                                                    const n = e.routeConfig ? e.routeConfig.canActivateChild : null;
                                                    return n && 0 !== n.length ? { node: e, guards: n } : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  Mo(() =>
                                                    P(
                                                      s.guards.map((l) => {
                                                        const c = Pc(l, s.node, t);
                                                        return gr(
                                                          (function IV(e) {
                                                            return e && la(e.canActivateChild);
                                                          })(c)
                                                            ? c.canActivateChild(r, e)
                                                            : c(r, e)
                                                        ).pipe(Br());
                                                      })
                                                    ).pipe(xo())
                                                  )
                                                );
                                            return P(o).pipe(xo());
                                          })(e, i.path, t),
                                          (function HV(e, n, t) {
                                            const r = n.routeConfig ? n.routeConfig.canActivate : null;
                                            if (!r || 0 === r.length) return P(!0);
                                            const i = r.map((o) =>
                                              Mo(() => {
                                                const s = Pc(o, n, t);
                                                return gr(
                                                  (function AV(e) {
                                                    return e && la(e.canActivate);
                                                  })(s)
                                                    ? s.canActivate(n, e)
                                                    : s(n, e)
                                                ).pipe(Br());
                                              })
                                            );
                                            return P(i).pipe(xo());
                                          })(e, i.route, t)
                                        )
                                      ),
                                      Br((i) => !0 !== i, !0)
                                    );
                                  })(r, o, e, n)
                                : P(a)
                            ),
                            L((a) => ({ ...t, guardsResult: a }))
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  lt((a) => {
                    if (((i.guardsResult = a.guardsResult), _i(a.guardsResult))) throw mw(0, a.guardsResult);
                    const l = new tV(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(l);
                  }),
                  Ae(
                    (a) => !!a.guardsResult || (this.restoreHistory(a), this.cancelNavigationTransition(a, '', 3), !1)
                  ),
                  Mp((a) => {
                    if (a.guards.canActivateChecks.length)
                      return P(a).pipe(
                        lt((l) => {
                          const c = new nV(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(c);
                        }),
                        at((l) => {
                          let c = !1;
                          return P(l).pipe(
                            (function u2(e, n) {
                              return Ue((t) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: i },
                                } = t;
                                if (!i.length) return P(t);
                                let o = 0;
                                return $e(i).pipe(
                                  pr((s) =>
                                    (function d2(e, n, t, r) {
                                      const i = e.routeConfig,
                                        o = e._resolve;
                                      return (
                                        void 0 !== i?.title && !Vw(i) && (o[Sp] = i.title),
                                        (function f2(e, n, t, r) {
                                          const i = (function h2(e) {
                                            return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
                                          })(e);
                                          if (0 === i.length) return P({});
                                          const o = {};
                                          return $e(i).pipe(
                                            Ue((s) =>
                                              (function p2(e, n, t, r) {
                                                const i = Pc(e, n, r);
                                                return gr(i.resolve ? i.resolve(n, t) : i(n, t));
                                              })(e[s], n, t, r).pipe(
                                                Br(),
                                                lt((a) => {
                                                  o[s] = a;
                                                })
                                              )
                                            ),
                                            ap(1),
                                            $1(o),
                                            Kn((s) => (Np(s) ? Jt : Oo(s)))
                                          );
                                        })(o, e, n, r).pipe(
                                          L(
                                            (s) => (
                                              (e._resolvedData = s),
                                              (e.data = pw(e, t).resolve),
                                              i && Vw(i) && (e.data[Sp] = i.title),
                                              null
                                            )
                                          )
                                        )
                                      );
                                    })(s.route, r, e, n)
                                  ),
                                  lt(() => o++),
                                  ap(1),
                                  Ue((s) => (o === i.length ? P(t) : Jt))
                                );
                              });
                            })(this.paramsInheritanceStrategy, this.ngModule.injector),
                            lt({
                              next: () => (c = !0),
                              complete: () => {
                                c || (this.restoreHistory(l), this.cancelNavigationTransition(l, '', 2));
                              },
                            })
                          );
                        }),
                        lt((l) => {
                          const c = new rV(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(c);
                        })
                      );
                  }),
                  Mp((a) => {
                    const l = (c) => {
                      const u = [];
                      c.routeConfig?.loadComponent &&
                        !c.routeConfig._loadedComponent &&
                        u.push(
                          this.configLoader.loadComponent(c.routeConfig).pipe(
                            lt((d) => {
                              c.component = d;
                            }),
                            L(() => {})
                          )
                        );
                      for (const d of c.children) u.push(...l(d));
                      return u;
                    };
                    return yc(l(a.targetSnapshot.root)).pipe(Dc(), we(1));
                  }),
                  Mp(() => this.afterPreactivation()),
                  L((a) => {
                    const l = (function hV(e, n, t) {
                      const r = ia(e, n._root, t ? t._root : void 0);
                      return new fw(r, n);
                    })(this.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                    return (i = { ...a, targetRouterState: l });
                  }),
                  lt((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(a.urlAfterRedirects, a.rawUrl)),
                      (this.routerState = a.targetRouterState),
                      'deferred' === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, n, t) => L((r) => (new CV(n, r.targetRouterState, r.currentRouterState, t).activate(e), r)))(
                    this.rootContexts,
                    this.routeReuseStrategy,
                    (a) => this.triggerEvent(a)
                  ),
                  lt({
                    next() {
                      o = !0;
                    },
                    complete() {
                      o = !0;
                    },
                  }),
                  Js(() => {
                    o || s || this.cancelNavigationTransition(i, '', 1),
                      this.currentNavigation?.id === i.id && (this.currentNavigation = null);
                  }),
                  Kn((a) => {
                    if (((s = !0), bw(a))) {
                      yw(a) || ((this.navigated = !0), this.restoreHistory(i, !0));
                      const l = new Mc(i.id, this.serializeUrl(i.extractedUrl), a.message, a.cancellationCode);
                      if ((r.next(l), yw(a))) {
                        const c = this.urlHandlingStrategy.merge(a.url, this.rawUrlTree),
                          u = {
                            skipLocationChange: i.extras.skipLocationChange,
                            replaceUrl: 'eager' === this.urlUpdateStrategy || Uw(i.source),
                          };
                        this.scheduleNavigation(c, 'imperative', null, u, {
                          resolve: i.resolve,
                          reject: i.reject,
                          promise: i.promise,
                        });
                      } else i.resolve(!1);
                    } else {
                      this.restoreHistory(i, !0);
                      const l = new cw(i.id, this.serializeUrl(i.extractedUrl), a, i.targetSnapshot ?? void 0);
                      r.next(l);
                      try {
                        i.resolve(this.errorHandler(a));
                      } catch (c) {
                        i.reject(c);
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
                const r = 'popstate' === t.type ? 'popstate' : 'hashchange';
                'popstate' === r &&
                  setTimeout(() => {
                    const i = { replaceUrl: !0 },
                      o = t.state?.navigationId ? t.state : null;
                    if (o) {
                      const a = { ...o };
                      delete a.navigationId, delete a.ɵrouterPageId, 0 !== Object.keys(a).length && (i.state = a);
                    }
                    const s = this.parseUrl(t.url);
                    this.scheduleNavigation(s, r, o, i);
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
            (this.config = t.map(Cp)), (this.navigated = !1), (this.lastSuccessfulId = -1);
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
          createUrlTree(t, r = {}) {
            const { relativeTo: i, queryParams: o, fragment: s, queryParamsHandling: a, preserveFragment: l } = r,
              c = i || this.routerState.root,
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
            return null !== d && (d = this.removeEmptyProps(d)), KL(c, this.currentUrlTree, t, d, u ?? null);
          }
          navigateByUrl(t, r = { skipLocationChange: !1 }) {
            const i = _i(t) ? t : this.parseUrl(t),
              o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(o, 'imperative', null, r);
          }
          navigate(t, r = { skipLocationChange: !1 }) {
            return (
              (function T2(e) {
                for (let n = 0; n < e.length; n++) {
                  if (null == e[n]) throw new S(4008, false);
                }
              })(t),
              this.navigateByUrl(this.createUrlTree(t, r), r)
            );
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t);
          }
          parseUrl(t) {
            let r;
            try {
              r = this.urlSerializer.parse(t);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, t);
            }
            return r;
          }
          isActive(t, r) {
            let i;
            if (((i = !0 === r ? { ...w2 } : !1 === r ? { ...C2 } : r), _i(t))) return Q1(this.currentUrlTree, t, i);
            const o = this.parseUrl(t);
            return Q1(this.currentUrlTree, o, i);
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((r, i) => {
              const o = t[i];
              return null != o && (r[i] = o), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (t) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = t.id),
                  (this.currentPageId = t.targetPageId),
                  this.events.next(
                    new Hr(t.id, this.serializeUrl(t.extractedUrl), this.serializeUrl(this.currentUrlTree))
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
          scheduleNavigation(t, r, i, o, s) {
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
                ? (0 === this.currentPageId && (i = this.location.getState()),
                  (d =
                    i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: u,
                targetPageId: d,
                source: r,
                restoredState: i,
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
          setBrowserUrl(t, r) {
            const i = this.urlSerializer.serialize(t),
              o = { ...r.extras.state, ...this.generateNgRouterState(r.id, r.targetPageId) };
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
              ? this.location.replaceState(i, '', o)
              : this.location.go(i, '', o);
          }
          restoreHistory(t, r = !1) {
            if ('computed' === this.canceledNavigationResolution) {
              const i = this.currentPageId - t.targetPageId;
              ('popstate' !== t.source &&
                'eager' !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === i
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === i &&
                  (this.resetState(t), (this.browserUrlTree = t.currentUrlTree), this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(i);
            } else
              'replace' === this.canceledNavigationResolution &&
                (r && this.resetState(t), this.resetUrlToCurrentUrlTree());
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
          cancelNavigationTransition(t, r, i) {
            const o = new Mc(t.id, this.serializeUrl(t.extractedUrl), r, i);
            this.triggerEvent(o), t.resolve(!1);
          }
          generateNgRouterState(t, r) {
            return 'computed' === this.canceledNavigationResolution
              ? { navigationId: t, ɵrouterPageId: r }
              : { navigationId: t };
          }
        }
        return (
          (e.ɵfac = function (t) {
            Qd();
          }),
          (e.ɵprov = M({
            token: e,
            factory: function () {
              return Gw();
            },
            providedIn: 'root',
          })),
          e
        );
      })();
      function Uw(e) {
        return 'imperative' !== e;
      }
      let Pp = (() => {
          class e {
            constructor(t, r, i, o, s) {
              (this.router = t),
                (this.route = r),
                (this.tabIndexAttribute = i),
                (this.renderer = o),
                (this.el = s),
                (this.commands = null),
                (this.onChanges = new pe()),
                this.setTabIndexIfNotOnNativeEl('0');
            }
            setTabIndexIfNotOnNativeEl(t) {
              if (null != this.tabIndexAttribute) return;
              const r = this.renderer,
                i = this.el.nativeElement;
              null !== t ? r.setAttribute(i, 'tabindex', t) : r.removeAttribute(i, 'tabindex');
            }
            ngOnChanges(t) {
              this.onChanges.next(this);
            }
            set routerLink(t) {
              null != t
                ? ((this.commands = Array.isArray(t) ? t : [t]), this.setTabIndexIfNotOnNativeEl('0'))
                : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick() {
              if (null === this.urlTree) return !0;
              const t = {
                skipLocationChange: dr(this.skipLocationChange),
                replaceUrl: dr(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, t), !0;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo: void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: dr(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ct), _(jr), ni('tabindex'), _(mn), _(De));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'routerLink', '', 5, 'a', 5, 'area']],
              hostBindings: function (t, r) {
                1 & t &&
                  oe('click', function () {
                    return r.onClick();
                  });
              },
              inputs: {
                queryParams: 'queryParams',
                fragment: 'fragment',
                queryParamsHandling: 'queryParamsHandling',
                preserveFragment: 'preserveFragment',
                skipLocationChange: 'skipLocationChange',
                replaceUrl: 'replaceUrl',
                state: 'state',
                relativeTo: 'relativeTo',
                routerLink: 'routerLink',
              },
              features: [wt],
            })),
            e
          );
        })(),
        jc = (() => {
          class e {
            constructor(t, r, i) {
              (this.router = t),
                (this.route = r),
                (this.locationStrategy = i),
                (this.commands = null),
                (this.href = null),
                (this.onChanges = new pe()),
                (this.subscription = t.events.subscribe((o) => {
                  o instanceof Hr && this.updateTargetUrlAndHref();
                }));
            }
            set routerLink(t) {
              this.commands = null != t ? (Array.isArray(t) ? t : [t]) : null;
            }
            ngOnChanges(t) {
              this.updateTargetUrlAndHref(), this.onChanges.next(this);
            }
            ngOnDestroy() {
              this.subscription.unsubscribe();
            }
            onClick(t, r, i, o, s) {
              if (
                0 !== t ||
                r ||
                i ||
                o ||
                s ||
                ('string' == typeof this.target && '_self' != this.target) ||
                null === this.urlTree
              )
                return !0;
              const a = {
                skipLocationChange: dr(this.skipLocationChange),
                replaceUrl: dr(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, a), !1;
            }
            updateTargetUrlAndHref() {
              this.href =
                null !== this.urlTree
                  ? this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree))
                  : null;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo: void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: dr(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ct), _(jr), _(di));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ['a', 'routerLink', ''],
                ['area', 'routerLink', ''],
              ],
              hostVars: 2,
              hostBindings: function (t, r) {
                1 & t &&
                  oe('click', function (o) {
                    return r.onClick(o.button, o.ctrlKey, o.shiftKey, o.altKey, o.metaKey);
                  }),
                  2 & t && ve('target', r.target)('href', r.href, pd);
              },
              inputs: {
                target: 'target',
                queryParams: 'queryParams',
                fragment: 'fragment',
                queryParamsHandling: 'queryParamsHandling',
                preserveFragment: 'preserveFragment',
                skipLocationChange: 'skipLocationChange',
                replaceUrl: 'replaceUrl',
                state: 'state',
                relativeTo: 'relativeTo',
                routerLink: 'routerLink',
              },
              features: [wt],
            })),
            e
          );
        })(),
        $w = (() => {
          class e {
            constructor(t, r, i, o, s, a) {
              (this.router = t),
                (this.element = r),
                (this.renderer = i),
                (this.cdr = o),
                (this.link = s),
                (this.linkWithHref = a),
                (this.classes = []),
                (this.isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new j()),
                (this.routerEventsSubscription = t.events.subscribe((l) => {
                  l instanceof Hr && this.update();
                }));
            }
            ngAfterContentInit() {
              P(this.links.changes, this.linksWithHrefs.changes, P(null))
                .pipe(Ri())
                .subscribe((t) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const t = [...this.links.toArray(), ...this.linksWithHrefs.toArray(), this.link, this.linkWithHref]
                .filter((r) => !!r)
                .map((r) => r.onChanges);
              this.linkInputChangesSubscription = $e(t)
                .pipe(Ri())
                .subscribe((r) => {
                  this.isActive !== this.isLinkActive(this.router)(r) && this.update();
                });
            }
            set routerLinkActive(t) {
              const r = Array.isArray(t) ? t : t.split(' ');
              this.classes = r.filter((i) => !!i);
            }
            ngOnChanges(t) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(), this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.linksWithHrefs ||
                !this.router.navigated ||
                Promise.resolve().then(() => {
                  const t = this.hasActiveLinks();
                  this.isActive !== t &&
                    ((this.isActive = t),
                    this.cdr.markForCheck(),
                    this.classes.forEach((r) => {
                      t
                        ? this.renderer.addClass(this.element.nativeElement, r)
                        : this.renderer.removeClass(this.element.nativeElement, r);
                    }),
                    t && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          'aria-current',
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(this.element.nativeElement, 'aria-current'),
                    this.isActiveChange.emit(t));
                });
            }
            isLinkActive(t) {
              const r = (function E2(e) {
                return !!e.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (i) => !!i.urlTree && t.isActive(i.urlTree, r);
            }
            hasActiveLinks() {
              const t = this.isLinkActive(this.router);
              return (
                (this.link && t(this.link)) ||
                (this.linkWithHref && t(this.linkWithHref)) ||
                this.links.some(t) ||
                this.linksWithHrefs.some(t)
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ct), _(De), _(mn), _(Tn), _(Pp, 8), _(jc, 8));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'routerLinkActive', '']],
              contentQueries: function (t, r, i) {
                if ((1 & t && (ze(i, Pp, 5), ze(i, jc, 5)), 2 & t)) {
                  let o;
                  Pe((o = xe())) && (r.links = o), Pe((o = xe())) && (r.linksWithHrefs = o);
                }
              },
              inputs: {
                routerLinkActiveOptions: 'routerLinkActiveOptions',
                ariaCurrentWhenActive: 'ariaCurrentWhenActive',
                routerLinkActive: 'routerLinkActive',
              },
              outputs: { isActiveChange: 'isActiveChange' },
              exportAs: ['routerLinkActive'],
              features: [wt],
            })),
            e
          );
        })();
      class Ww {}
      let zw = (() => {
        class e {
          constructor(t, r, i, o, s) {
            (this.router = t), (this.injector = i), (this.preloadingStrategy = o), (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Ae((t) => t instanceof Hr),
                pr(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, r) {
            const i = [];
            for (const o of r) {
              o.providers && !o._injector && (o._injector = xl(o.providers, t, `Route: ${o.path}`));
              const s = o._injector ?? t,
                a = o._loadedInjector ?? s;
              (o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) || (o.loadComponent && !o._loadedComponent)
                ? i.push(this.preloadConfig(s, o))
                : (o.children || o._loadedRoutes) && i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return $e(i).pipe(Ri());
          }
          preloadConfig(t, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(t, r) : P(null);
              const o = i.pipe(
                Ue((s) =>
                  null === s
                    ? P(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent ? $e([o, this.loader.loadComponent(r)]).pipe(Ri()) : o;
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(ct), T(eh), T(Or), T(Ww), T(Rp));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Kw = new k('');
      let S2 = (() => {
        class e {
          constructor(t, r, i = {}) {
            (this.router = t),
              (this.viewportScroller = r),
              (this.options = i),
              (this.lastId = 0),
              (this.lastSource = 'imperative'),
              (this.restoredId = 0),
              (this.store = {}),
              (i.scrollPositionRestoration = i.scrollPositionRestoration || 'disabled'),
              (i.anchorScrolling = i.anchorScrolling || 'disabled');
          }
          init() {
            'disabled' !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration('manual'),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((t) => {
              t instanceof gp
                ? ((this.store[this.lastId] = this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState ? t.restoredState.navigationId : 0))
                : t instanceof Hr &&
                  ((this.lastId = t.id),
                  this.scheduleScrollEvent(t, this.router.parseUrl(t.urlAfterRedirects).fragment));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((t) => {
              t instanceof uw &&
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
          scheduleScrollEvent(t, r) {
            this.router.triggerEvent(new uw(t, 'popstate' === this.lastSource ? this.store[this.restoredId] : null, r));
          }
          ngOnDestroy() {
            this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription && this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (t) {
            Qd();
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const qw = new k('ROUTER_FORROOT_GUARD'),
        Qw = new k(''),
        M2 = [
          _h,
          { provide: Z1, useClass: cp },
          { provide: ct, useFactory: Gw },
          oa,
          {
            provide: jr,
            useFactory: function O2(e) {
              return e.routerState.root;
            },
            deps: [ct],
          },
          Rp,
        ];
      function A2() {
        return new vb('Router', ct);
      }
      let Qn = (() => {
        class e {
          constructor(t) {}
          static forRoot(t, r) {
            return {
              ngModule: e,
              providers: [
                M2,
                [],
                Xw(t),
                { provide: qw, useFactory: x2, deps: [[ct, new ls(), new cs()]] },
                { provide: Ap, useValue: r || {} },
                r?.useHash ? { provide: di, useClass: mx } : { provide: di, useClass: Gb },
                {
                  provide: Kw,
                  useFactory: () => {
                    const e = We(ct),
                      n = We(xF),
                      t = We(Ap);
                    return t.scrollOffset && n.setOffset(t.scrollOffset), new S2(e, n, t);
                  },
                },
                r?.preloadingStrategy ? j2(r.preloadingStrategy) : [],
                { provide: vb, multi: !0, useFactory: A2 },
                r?.initialNavigation ? k2(r) : [],
                [
                  { provide: Yw, useFactory: F2 },
                  { provide: db, multi: !0, useExisting: Yw },
                ],
              ],
            };
          }
          static forChild(t) {
            return { ngModule: e, providers: [Xw(t)] };
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(qw, 8));
          }),
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({})),
          e
        );
      })();
      function x2(e) {
        return 'guarded';
      }
      function Xw(e) {
        return [{ provide: Ip, multi: !0, useValue: e }];
      }
      function F2() {
        const e = We(_t);
        return (n) => {
          const t = e.get(No);
          if (n !== t.components[0]) return;
          const r = e.get(ct),
            i = e.get(Jw);
          1 === e.get(xp) && r.initialNavigation(),
            e.get(Qw, null, B.Optional)?.setUpPreloading(),
            e.get(Kw, null, B.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            i.next(),
            i.complete();
        };
      }
      const Yw = new k('');
      function k2(e) {
        return [
          'disabled' === e.initialNavigation
            ? [
                {
                  provide: Bs,
                  multi: !0,
                  useFactory: () => {
                    const e = We(ct);
                    return () => {
                      e.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: xp, useValue: 2 },
              ]
            : [],
          'enabledBlocking' === e.initialNavigation
            ? [
                { provide: xp, useValue: 0 },
                {
                  provide: Bs,
                  multi: !0,
                  deps: [_t],
                  useFactory: (e) => {
                    const n = e.get(gx, Promise.resolve(null));
                    let t = !1;
                    return () =>
                      n.then(
                        () =>
                          new Promise((i) => {
                            const o = e.get(ct),
                              s = e.get(Jw);
                            (function r(i) {
                              e.get(ct)
                                .events.pipe(
                                  Ae((s) => s instanceof Hr || s instanceof Mc || s instanceof cw),
                                  L(
                                    (s) =>
                                      s instanceof Hr || (s instanceof Mc && (0 === s.code || 1 === s.code) && null)
                                  ),
                                  Ae((s) => null !== s),
                                  we(1)
                                )
                                .subscribe(() => {
                                  i();
                                });
                            })(() => {
                              i(!0), (t = !0);
                            }),
                              (o.afterPreactivation = () => (i(!0), t || s.closed ? P(void 0) : s)),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]
            : [],
        ];
      }
      const Jw = new k('', { factory: () => new pe() }),
        xp = new k('', { providedIn: 'root', factory: () => 1 });
      function j2(e) {
        return [zw, { provide: Qw, useExisting: zw }, { provide: Ww, useExisting: e }];
      }
      class Zw {}
      class eC {}
      class vr {
        constructor(n) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            n
              ? (this.lazyInit =
                  'string' == typeof n
                    ? () => {
                        (this.headers = new Map()),
                          n.split('\n').forEach((t) => {
                            const r = t.indexOf(':');
                            if (r > 0) {
                              const i = t.slice(0, r),
                                o = i.toLowerCase(),
                                s = t.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, o),
                                this.headers.has(o) ? this.headers.get(o).push(s) : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(n).forEach((t) => {
                            let r = n[t];
                            const i = t.toLowerCase();
                            'string' == typeof r && (r = [r]),
                              r.length > 0 && (this.headers.set(i, r), this.maybeSetNormalizedName(t, i));
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
            (this.lazyInit instanceof vr ? this.copyFrom(this.lazyInit) : this.lazyInit(),
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
          const t = new vr();
          return (
            (t.lazyInit = this.lazyInit && this.lazyInit instanceof vr ? this.lazyInit : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
            t
          );
        }
        applyUpdate(n) {
          const t = n.name.toLowerCase();
          switch (n.op) {
            case 'a':
            case 's':
              let r = n.value;
              if (('string' == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(n.name, t);
              const i = ('a' === n.op ? this.headers.get(t) : void 0) || [];
              i.push(...r), this.headers.set(t, i);
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
      class G2 {
        encodeKey(n) {
          return tC(n);
        }
        encodeValue(n) {
          return tC(n);
        }
        decodeKey(n) {
          return decodeURIComponent(n);
        }
        decodeValue(n) {
          return decodeURIComponent(n);
        }
      }
      const $2 = /%(\d[a-f0-9])/gi,
        W2 = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '3D': '=', '3F': '?', '2F': '/' };
      function tC(e) {
        return encodeURIComponent(e).replace($2, (n, t) => W2[t] ?? n);
      }
      function Gc(e) {
        return `${e}`;
      }
      class Ur {
        constructor(n = {}) {
          if (((this.updates = null), (this.cloneFrom = null), (this.encoder = n.encoder || new G2()), n.fromString)) {
            if (n.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
            this.map = (function U2(e, n) {
              const t = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, '')
                    .split('&')
                    .forEach((i) => {
                      const o = i.indexOf('='),
                        [s, a] =
                          -1 == o ? [n.decodeKey(i), ''] : [n.decodeKey(i.slice(0, o)), n.decodeValue(i.slice(o + 1))],
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
                  const r = n.fromObject[t],
                    i = Array.isArray(r) ? r.map(Gc) : [Gc(r)];
                  this.map.set(t, i);
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
            Object.keys(n).forEach((r) => {
              const i = n[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    t.push({ param: r, value: o, op: 'a' });
                  })
                : t.push({ param: r, value: i, op: 'a' });
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
                  .map((r) => t + '=' + this.encoder.encodeValue(r))
                  .join('&');
              })
              .filter((n) => '' !== n)
              .join('&')
          );
        }
        clone(n) {
          const t = new Ur({ encoder: this.encoder });
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
                      let r = this.map.get(n.param) || [];
                      const i = r.indexOf(Gc(n.value));
                      -1 !== i && r.splice(i, 1), r.length > 0 ? this.map.set(n.param, r) : this.map.delete(n.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class z2 {
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
      function nC(e) {
        return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer;
      }
      function rC(e) {
        return typeof Blob < 'u' && e instanceof Blob;
      }
      function iC(e) {
        return typeof FormData < 'u' && e instanceof FormData;
      }
      class ua {
        constructor(n, t, r, i) {
          let o;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = 'json'),
            (this.method = n.toUpperCase()),
            (function K2(e) {
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
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new vr()),
            this.context || (this.context = new z2()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = t;
            else {
              const a = t.indexOf('?');
              this.urlWithParams = t + (-1 === a ? '?' : a < t.length - 1 ? '&' : '') + s;
            }
          } else (this.params = new Ur()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : nC(this.body) ||
              rC(this.body) ||
              iC(this.body) ||
              (function q2(e) {
                return typeof URLSearchParams < 'u' && e instanceof URLSearchParams;
              })(this.body) ||
              'string' == typeof this.body
            ? this.body
            : this.body instanceof Ur
            ? this.body.toString()
            : 'object' == typeof this.body || 'boolean' == typeof this.body || Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || iC(this.body)
            ? null
            : rC(this.body)
            ? this.body.type || null
            : nC(this.body)
            ? null
            : 'string' == typeof this.body
            ? 'text/plain'
            : this.body instanceof Ur
            ? 'application/x-www-form-urlencoded;charset=UTF-8'
            : 'object' == typeof this.body || 'number' == typeof this.body || 'boolean' == typeof this.body
            ? 'application/json'
            : null;
        }
        clone(n = {}) {
          const t = n.method || this.method,
            r = n.url || this.url,
            i = n.responseType || this.responseType,
            o = void 0 !== n.body ? n.body : this.body,
            s = void 0 !== n.withCredentials ? n.withCredentials : this.withCredentials,
            a = void 0 !== n.reportProgress ? n.reportProgress : this.reportProgress;
          let l = n.headers || this.headers,
            c = n.params || this.params;
          const u = n.context ?? this.context;
          return (
            void 0 !== n.setHeaders && (l = Object.keys(n.setHeaders).reduce((d, f) => d.set(f, n.setHeaders[f]), l)),
            n.setParams && (c = Object.keys(n.setParams).reduce((d, f) => d.set(f, n.setParams[f]), c)),
            new ua(t, r, o, {
              params: c,
              headers: l,
              context: u,
              reportProgress: a,
              responseType: i,
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
      class Fp {
        constructor(n, t = 200, r = 'OK') {
          (this.headers = n.headers || new vr()),
            (this.status = void 0 !== n.status ? n.status : t),
            (this.statusText = n.statusText || r),
            (this.url = n.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class kp extends Fp {
        constructor(n = {}) {
          super(n), (this.type = et.ResponseHeader);
        }
        clone(n = {}) {
          return new kp({
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class Uc extends Fp {
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
      class oC extends Fp {
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
      function Lp(e, n) {
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
      let sC = (() => {
        class e {
          constructor(t) {
            this.handler = t;
          }
          request(t, r, i = {}) {
            let o;
            if (t instanceof ua) o = t;
            else {
              let l, c;
              (l = i.headers instanceof vr ? i.headers : new vr(i.headers)),
                i.params && (c = i.params instanceof Ur ? i.params : new Ur({ fromObject: i.params })),
                (o = new ua(t, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: c,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || 'json',
                  withCredentials: i.withCredentials,
                }));
            }
            const s = P(o).pipe(pr((l) => this.handler.handle(l)));
            if (t instanceof ua || 'events' === i.observe) return s;
            const a = s.pipe(Ae((l) => l instanceof Uc));
            switch (i.observe || 'body') {
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
                throw new Error(`Unreachable: unhandled observe type ${i.observe}}`);
            }
          }
          delete(t, r = {}) {
            return this.request('DELETE', t, r);
          }
          get(t, r = {}) {
            return this.request('GET', t, r);
          }
          head(t, r = {}) {
            return this.request('HEAD', t, r);
          }
          jsonp(t, r) {
            return this.request('JSONP', t, {
              params: new Ur().append(r, 'JSONP_CALLBACK'),
              observe: 'body',
              responseType: 'json',
            });
          }
          options(t, r = {}) {
            return this.request('OPTIONS', t, r);
          }
          patch(t, r, i = {}) {
            return this.request('PATCH', t, Lp(i, r));
          }
          post(t, r, i = {}) {
            return this.request('POST', t, Lp(i, r));
          }
          put(t, r, i = {}) {
            return this.request('PUT', t, Lp(i, r));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(Zw));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class aC {
        constructor(n, t) {
          (this.next = n), (this.interceptor = t);
        }
        handle(n) {
          return this.interceptor.intercept(n, this.next);
        }
      }
      const $c = new k('HTTP_INTERCEPTORS');
      let Q2 = (() => {
        class e {
          intercept(t, r) {
            return r.handle(t);
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
      const X2 = /^\)\]\}',?\n/;
      let lC = (() => {
        class e {
          constructor(t) {
            this.xhrFactory = t;
          }
          handle(t) {
            if ('JSONP' === t.method)
              throw new Error('Attempted to construct Jsonp request without HttpClientJsonpModule installed.');
            return new he((r) => {
              const i = this.xhrFactory.build();
              if (
                (i.open(t.method, t.urlWithParams),
                t.withCredentials && (i.withCredentials = !0),
                t.headers.forEach((h, p) => i.setRequestHeader(h, p.join(','))),
                t.headers.has('Accept') || i.setRequestHeader('Accept', 'application/json, text/plain, */*'),
                !t.headers.has('Content-Type'))
              ) {
                const h = t.detectContentTypeHeader();
                null !== h && i.setRequestHeader('Content-Type', h);
              }
              if (t.responseType) {
                const h = t.responseType.toLowerCase();
                i.responseType = 'json' !== h ? h : 'text';
              }
              const o = t.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = i.statusText || 'OK',
                    p = new vr(i.getAllResponseHeaders()),
                    g =
                      (function Y2(e) {
                        return 'responseURL' in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader('X-Request-URL')
                          : null;
                      })(i) || t.url;
                  return (s = new kp({ headers: p, status: i.status, statusText: h, url: g })), s;
                },
                l = () => {
                  let { headers: h, status: p, statusText: g, url: v } = a(),
                    y = null;
                  204 !== p && (y = typeof i.response > 'u' ? i.responseText : i.response),
                    0 === p && (p = y ? 200 : 0);
                  let D = p >= 200 && p < 300;
                  if ('json' === t.responseType && 'string' == typeof y) {
                    const b = y;
                    y = y.replace(X2, '');
                    try {
                      y = '' !== y ? JSON.parse(y) : null;
                    } catch (C) {
                      (y = b), D && ((D = !1), (y = { error: C, text: y }));
                    }
                  }
                  D
                    ? (r.next(new Uc({ body: y, headers: h, status: p, statusText: g, url: v || void 0 })),
                      r.complete())
                    : r.error(new oC({ error: y, headers: h, status: p, statusText: g, url: v || void 0 }));
                },
                c = (h) => {
                  const { url: p } = a(),
                    g = new oC({
                      error: h,
                      status: i.status || 0,
                      statusText: i.statusText || 'Unknown Error',
                      url: p || void 0,
                    });
                  r.error(g);
                };
              let u = !1;
              const d = (h) => {
                  u || (r.next(a()), (u = !0));
                  let p = { type: et.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    'text' === t.responseType && !!i.responseText && (p.partialText = i.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: et.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                i.addEventListener('load', l),
                i.addEventListener('error', c),
                i.addEventListener('timeout', c),
                i.addEventListener('abort', c),
                t.reportProgress &&
                  (i.addEventListener('progress', d),
                  null !== o && i.upload && i.upload.addEventListener('progress', f)),
                i.send(o),
                r.next({ type: et.Sent }),
                () => {
                  i.removeEventListener('error', c),
                    i.removeEventListener('abort', c),
                    i.removeEventListener('load', l),
                    i.removeEventListener('timeout', c),
                    t.reportProgress &&
                      (i.removeEventListener('progress', d),
                      null !== o && i.upload && i.upload.removeEventListener('progress', f)),
                    i.readyState !== i.DONE && i.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(lD));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Vp = new k('XSRF_COOKIE_NAME'),
        Bp = new k('XSRF_HEADER_NAME');
      class cC {}
      let J2 = (() => {
          class e {
            constructor(t, r, i) {
              (this.doc = t),
                (this.platform = r),
                (this.cookieName = i),
                (this.lastCookieString = ''),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ('server' === this.platform) return null;
              const t = this.doc.cookie || '';
              return (
                t !== this.lastCookieString &&
                  (this.parseCount++, (this.lastToken = Jb(t, this.cookieName)), (this.lastCookieString = t)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(Ye), T(Co), T(Vp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Hp = (() => {
          class e {
            constructor(t, r) {
              (this.tokenService = t), (this.headerName = r);
            }
            intercept(t, r) {
              const i = t.url.toLowerCase();
              if ('GET' === t.method || 'HEAD' === t.method || i.startsWith('http://') || i.startsWith('https://'))
                return r.handle(t);
              const o = this.tokenService.getToken();
              return (
                null !== o &&
                  !t.headers.has(this.headerName) &&
                  (t = t.clone({ headers: t.headers.set(this.headerName, o) })),
                r.handle(t)
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(cC), T(Bp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Z2 = (() => {
          class e {
            constructor(t, r) {
              (this.backend = t), (this.injector = r), (this.chain = null);
            }
            handle(t) {
              if (null === this.chain) {
                const r = this.injector.get($c, []);
                this.chain = r.reduceRight((i, o) => new aC(i, o), this.backend);
              }
              return this.chain.handle(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(eC), T(_t));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        eB = (() => {
          class e {
            static disable() {
              return { ngModule: e, providers: [{ provide: Hp, useClass: Q2 }] };
            }
            static withOptions(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.cookieName ? { provide: Vp, useValue: t.cookieName } : [],
                  t.headerName ? { provide: Bp, useValue: t.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({
              providers: [
                Hp,
                { provide: $c, useExisting: Hp, multi: !0 },
                { provide: cC, useClass: J2 },
                { provide: Vp, useValue: 'XSRF-TOKEN' },
                { provide: Bp, useValue: 'X-XSRF-TOKEN' },
              ],
            })),
            e
          );
        })(),
        tB = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({
              providers: [sC, { provide: Zw, useClass: Z2 }, lC, { provide: eC, useExisting: lC }],
              imports: [eB.withOptions({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })],
            })),
            e
          );
        })();
      const nB = ['addListener', 'removeListener'],
        rB = ['addEventListener', 'removeEventListener'],
        iB = ['on', 'off'];
      function vt(e, n, t, r) {
        if ((te(t) && ((r = t), (t = void 0)), r)) return vt(e, n, t).pipe(Bh(r));
        const [i, o] = (function aB(e) {
          return te(e.addEventListener) && te(e.removeEventListener);
        })(e)
          ? rB.map((s) => (a) => e[s](n, a, t))
          : (function oB(e) {
              return te(e.addListener) && te(e.removeListener);
            })(e)
          ? nB.map(uC(e, n))
          : (function sB(e) {
              return te(e.on) && te(e.off);
            })(e)
          ? iB.map(uC(e, n))
          : [];
        if (!i && wu(e)) return Ue((s) => vt(s, n, t))(ft(e));
        if (!i) throw new TypeError('Invalid event target');
        return new he((s) => {
          const a = (...l) => s.next(1 < l.length ? l : l[0]);
          return i(a), () => o(a);
        });
      }
      function uC(e, n) {
        return (t) => (r) => e[t](n, r);
      }
      const yr = new he(Ii),
        cB = { connector: () => new pe() };
      function dC(e, n = cB) {
        const { connector: t } = n;
        return Re((r, i) => {
          const o = t();
          ft(
            e(
              (function lB(e) {
                return new he((n) => e.subscribe(n));
              })(o)
            )
          ).subscribe(i),
            i.add(r.subscribe(o));
        });
      }
      class fB extends Lt {
        constructor(n, t) {
          super();
        }
        schedule(n, t = 0) {
          return this;
        }
      }
      const Wc = {
          setInterval(e, n, ...t) {
            const { delegate: r } = Wc;
            return r?.setInterval ? r.setInterval(e, n, ...t) : setInterval(e, n, ...t);
          },
          clearInterval(e) {
            const { delegate: n } = Wc;
            return (n?.clearInterval || clearInterval)(e);
          },
          delegate: void 0,
        },
        jp = { now: () => (jp.delegate || Date).now(), delegate: void 0 };
      class da {
        constructor(n, t = da.now) {
          (this.schedulerActionCtor = n), (this.now = t);
        }
        schedule(n, t = 0, r) {
          return new this.schedulerActionCtor(this, n).schedule(r, t);
        }
      }
      da.now = jp.now;
      const fC = new (class pB extends da {
          constructor(n, t = da.now) {
            super(n, t), (this.actions = []), (this._active = !1);
          }
          flush(n) {
            const { actions: t } = this;
            if (this._active) return void t.push(n);
            let r;
            this._active = !0;
            do {
              if ((r = n.execute(n.state, n.delay))) break;
            } while ((n = t.shift()));
            if (((this._active = !1), r)) {
              for (; (n = t.shift()); ) n.unsubscribe();
              throw r;
            }
          }
        })(
          class hB extends fB {
            constructor(n, t) {
              super(n, t), (this.scheduler = n), (this.work = t), (this.pending = !1);
            }
            schedule(n, t = 0) {
              var r;
              if (this.closed) return this;
              this.state = n;
              const i = this.id,
                o = this.scheduler;
              return (
                null != i && (this.id = this.recycleAsyncId(o, i, t)),
                (this.pending = !0),
                (this.delay = t),
                (this.id = null !== (r = this.id) && void 0 !== r ? r : this.requestAsyncId(o, this.id, t)),
                this
              );
            }
            requestAsyncId(n, t, r = 0) {
              return Wc.setInterval(n.flush.bind(n, this), r);
            }
            recycleAsyncId(n, t, r = 0) {
              if (null != r && this.delay === r && !1 === this.pending) return t;
              null != t && Wc.clearInterval(t);
            }
            execute(n, t) {
              if (this.closed) return new Error('executing a cancelled action');
              this.pending = !1;
              const r = this._execute(n, t);
              if (r) return r;
              !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
            }
            _execute(n, t) {
              let i,
                r = !1;
              try {
                this.work(n);
              } catch (o) {
                (r = !0), (i = o || new Error('Scheduled action threw falsy error'));
              }
              if (r) return this.unsubscribe(), i;
            }
            unsubscribe() {
              if (!this.closed) {
                const { id: n, scheduler: t } = this,
                  { actions: r } = t;
                (this.work = this.state = this.scheduler = null),
                  (this.pending = !1),
                  Ai(r, this),
                  null != n && (this.id = this.recycleAsyncId(t, n, null)),
                  (this.delay = null),
                  super.unsubscribe();
              }
            }
          }
        ),
        gB = fC;
      function hC(e, n) {
        return n
          ? (t) =>
              Vr(
                n.pipe(
                  we(1),
                  (function _B() {
                    return Re((e, n) => {
                      e.subscribe(Ce(n, Ii));
                    });
                  })()
                ),
                t.pipe(hC(e))
              )
          : Ue((t, r) => e(t, r).pipe(we(1), $1(t)));
      }
      function Gp(e = 0, n, t = gB) {
        let r = -1;
        return (
          null != n && (qg(n) ? (t = n) : (r = n)),
          new he((i) => {
            let o = (function mB(e) {
              return e instanceof Date && !isNaN(e);
            })(e)
              ? +e - t.now()
              : e;
            o < 0 && (o = 0);
            let s = 0;
            return t.schedule(function () {
              i.closed || (i.next(s++), 0 <= r ? this.schedule(void 0, r) : i.complete());
            }, o);
          })
        );
      }
      function pC(e, n = fC) {
        const t = Gp(e, n);
        return hC(() => t);
      }
      const fa = 'Service workers are disabled or not supported by this browser';
      class zc {
        constructor(n) {
          if (((this.serviceWorker = n), n)) {
            const r = vt(n, 'controllerchange').pipe(L(() => n.controller)),
              o = Vr(
                Mo(() => P(n.controller)),
                r
              );
            (this.worker = o.pipe(Ae((u) => !!u))),
              (this.registration = this.worker.pipe(at(() => n.getRegistration())));
            const c = vt(n, 'message')
              .pipe(L((u) => u.data))
              .pipe(Ae((u) => u && u.type))
              .pipe(
                (function dB(e) {
                  return e
                    ? (n) => dC(e)(n)
                    : (n) =>
                        (function uB(e, n) {
                          const t = te(e) ? e : () => e;
                          return te(n) ? dC(n, { connector: t }) : (r) => new sp(r, t);
                        })(new pe())(n);
                })()
              );
            c.connect(), (this.events = c);
          } else
            this.worker =
              this.events =
              this.registration =
                (function vB(e) {
                  return Mo(() => Oo(new Error(e)));
                })(fa);
        }
        postMessage(n, t) {
          return this.worker
            .pipe(
              we(1),
              lt((r) => {
                r.postMessage({ action: n, ...t });
              })
            )
            .toPromise()
            .then(() => {});
        }
        postMessageWithOperation(n, t, r) {
          const i = this.waitForOperationCompleted(r),
            o = this.postMessage(n, t);
          return Promise.all([o, i]).then(([, s]) => s);
        }
        generateNonce() {
          return Math.round(1e7 * Math.random());
        }
        eventsOfType(n) {
          let t;
          return (t = 'string' == typeof n ? (r) => r.type === n : (r) => n.includes(r.type)), this.events.pipe(Ae(t));
        }
        nextEventOfType(n) {
          return this.eventsOfType(n).pipe(we(1));
        }
        waitForOperationCompleted(n) {
          return this.eventsOfType('OPERATION_COMPLETED')
            .pipe(
              Ae((t) => t.nonce === n),
              we(1),
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
      let yB = (() => {
          class e {
            constructor(t) {
              if (((this.sw = t), (this.subscriptionChanges = new pe()), !t.isEnabled))
                return (this.messages = yr), (this.notificationClicks = yr), void (this.subscription = yr);
              (this.messages = this.sw.eventsOfType('PUSH').pipe(L((i) => i.data))),
                (this.notificationClicks = this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(L((i) => i.data))),
                (this.pushManager = this.sw.registration.pipe(L((i) => i.pushManager)));
              const r = this.pushManager.pipe(at((i) => i.getSubscription()));
              this.subscription = xa(r, this.subscriptionChanges);
            }
            get isEnabled() {
              return this.sw.isEnabled;
            }
            requestSubscription(t) {
              if (!this.sw.isEnabled) return Promise.reject(new Error(fa));
              const r = { userVisibleOnly: !0 };
              let i = this.decodeBase64(t.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+')),
                o = new Uint8Array(new ArrayBuffer(i.length));
              for (let s = 0; s < i.length; s++) o[s] = i.charCodeAt(s);
              return (
                (r.applicationServerKey = o),
                this.pushManager
                  .pipe(
                    at((s) => s.subscribe(r)),
                    we(1)
                  )
                  .toPromise()
                  .then((s) => (this.subscriptionChanges.next(s), s))
              );
            }
            unsubscribe() {
              return this.sw.isEnabled
                ? this.subscription
                    .pipe(
                      we(1),
                      at((r) => {
                        if (null === r) throw new Error('Not subscribed to push notifications.');
                        return r.unsubscribe().then((i) => {
                          if (!i) throw new Error('Unsubscribe failed!');
                          this.subscriptionChanges.next(null);
                        });
                      })
                    )
                    .toPromise()
                : Promise.reject(new Error(fa));
            }
            decodeBase64(t) {
              return atob(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(zc));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        bB = (() => {
          class e {
            constructor(t) {
              if (((this.sw = t), !t.isEnabled))
                return (
                  (this.versionUpdates = yr),
                  (this.available = yr),
                  (this.activated = yr),
                  void (this.unrecoverable = yr)
                );
              (this.versionUpdates = this.sw.eventsOfType([
                'VERSION_DETECTED',
                'VERSION_INSTALLATION_FAILED',
                'VERSION_READY',
                'NO_NEW_VERSION_DETECTED',
              ])),
                (this.available = this.versionUpdates.pipe(
                  Ae((r) => 'VERSION_READY' === r.type),
                  L((r) => ({ type: 'UPDATE_AVAILABLE', current: r.currentVersion, available: r.latestVersion }))
                )),
                (this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED')),
                (this.unrecoverable = this.sw.eventsOfType('UNRECOVERABLE_STATE'));
            }
            get isEnabled() {
              return this.sw.isEnabled;
            }
            checkForUpdate() {
              if (!this.sw.isEnabled) return Promise.reject(new Error(fa));
              const t = this.sw.generateNonce();
              return this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', { nonce: t }, t);
            }
            activateUpdate() {
              if (!this.sw.isEnabled) return Promise.reject(new Error(fa));
              const t = this.sw.generateNonce();
              return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', { nonce: t }, t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(zc));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class Up {}
      const gC = new k('NGSW_REGISTER_SCRIPT');
      function DB(e, n, t, r) {
        return () => {
          if (!Ah(r) || !('serviceWorker' in navigator) || !1 === t.enabled) return;
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
                o = _C(+l[0] || 0);
                break;
              case 'registerWhenStable':
                o = l[0] ? xa(mC(e), _C(+l[0])) : mC(e);
                break;
              default:
                throw new Error(`Unknown ServiceWorker registration strategy: ${t.registrationStrategy}`);
            }
          }
          e.get(me).runOutsideAngular(() =>
            o
              .pipe(we(1))
              .subscribe(() =>
                navigator.serviceWorker
                  .register(n, { scope: t.scope })
                  .catch((a) => console.error('Service worker registration failed with:', a))
              )
          );
        };
      }
      function _C(e) {
        return P(null).pipe(pC(e));
      }
      function mC(e) {
        return e.get(No).isStable.pipe(Ae((t) => t));
      }
      function wB(e, n) {
        return new zc(Ah(n) && !1 !== e.enabled ? navigator.serviceWorker : void 0);
      }
      let CB = (() => {
        class e {
          static register(t, r = {}) {
            return {
              ngModule: e,
              providers: [
                { provide: gC, useValue: t },
                { provide: Up, useValue: r },
                { provide: zc, useFactory: wB, deps: [Up, Co] },
                { provide: Bs, useFactory: DB, deps: [_t, gC, Up, Co], multi: !0 },
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({ providers: [yB, bB] })),
          e
        );
      })();
      function $r(e) {
        return !!e && (e instanceof he || (te(e.lift) && te(e.subscribe)));
      }
      class NB extends pe {
        constructor(n = 1 / 0, t = 1 / 0, r = jp) {
          super(),
            (this._bufferSize = n),
            (this._windowTime = t),
            (this._timestampProvider = r),
            (this._buffer = []),
            (this._infiniteTimeWindow = !0),
            (this._infiniteTimeWindow = t === 1 / 0),
            (this._bufferSize = Math.max(1, n)),
            (this._windowTime = Math.max(1, t));
        }
        next(n) {
          const { isStopped: t, _buffer: r, _infiniteTimeWindow: i, _timestampProvider: o, _windowTime: s } = this;
          t || (r.push(n), !i && r.push(o.now() + s)), this._trimBuffer(), super.next(n);
        }
        _subscribe(n) {
          this._throwIfClosed(), this._trimBuffer();
          const t = this._innerSubscribe(n),
            { _infiniteTimeWindow: r, _buffer: i } = this,
            o = i.slice();
          for (let s = 0; s < o.length && !n.closed; s += r ? 1 : 2) n.next(o[s]);
          return this._checkFinalizedStatuses(n), t;
        }
        _trimBuffer() {
          const { _bufferSize: n, _timestampProvider: t, _buffer: r, _infiniteTimeWindow: i } = this,
            o = (i ? 1 : 2) * n;
          if ((n < 1 / 0 && o < r.length && r.splice(0, r.length - o), !i)) {
            const s = t.now();
            let a = 0;
            for (let l = 1; l < r.length && r[l] <= s; l += 2) a = l;
            a && r.splice(0, a + 1);
          }
        }
      }
      function vC(e, n, t) {
        let r,
          i = !1;
        return (
          e && 'object' == typeof e
            ? ({ bufferSize: r = 1 / 0, windowTime: n = 1 / 0, refCount: i = !1, scheduler: t } = e)
            : (r = e ?? 1 / 0),
          Jg({ connector: () => new NB(r, n, t), resetOnError: !0, resetOnComplete: !1, resetOnRefCountZero: i })
        );
      }
      class Kc {}
      let yC = (() => {
        class e extends Kc {
          getTranslation(t) {
            return P({});
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = Qe(e)))(r || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class $p {}
      let bC = (() => {
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
      function ha(e, n) {
        if (e === n) return !0;
        if (null === e || null === n) return !1;
        if (e != e && n != n) return !0;
        let i,
          o,
          s,
          t = typeof e;
        if (t == typeof n && 'object' == t) {
          if (!Array.isArray(e)) {
            if (Array.isArray(n)) return !1;
            for (o in ((s = Object.create(null)), e)) {
              if (!ha(e[o], n[o])) return !1;
              s[o] = !0;
            }
            for (o in n) if (!(o in s) && typeof n[o] < 'u') return !1;
            return !0;
          }
          if (!Array.isArray(n)) return !1;
          if ((i = e.length) == n.length) {
            for (o = 0; o < i; o++) if (!ha(e[o], n[o])) return !1;
            return !0;
          }
        }
        return !1;
      }
      function Qt(e) {
        return typeof e < 'u' && null !== e;
      }
      function Wp(e) {
        return e && 'object' == typeof e && !Array.isArray(e);
      }
      function DC(e, n) {
        let t = Object.assign({}, e);
        return (
          Wp(e) &&
            Wp(n) &&
            Object.keys(n).forEach((r) => {
              Wp(n[r])
                ? r in e
                  ? (t[r] = DC(e[r], n[r]))
                  : Object.assign(t, { [r]: n[r] })
                : Object.assign(t, { [r]: n[r] });
            }),
          t
        );
      }
      class qc {}
      let wC = (() => {
        class e extends qc {
          constructor() {
            super(...arguments), (this.templateMatcher = /{{\s?([^{}\s]*)\s?}}/g);
          }
          interpolate(t, r) {
            let i;
            return (
              (i =
                'string' == typeof t
                  ? this.interpolateString(t, r)
                  : 'function' == typeof t
                  ? this.interpolateFunction(t, r)
                  : t),
              i
            );
          }
          getValue(t, r) {
            let i = 'string' == typeof r ? r.split('.') : [r];
            r = '';
            do {
              (r += i.shift()),
                !Qt(t) || !Qt(t[r]) || ('object' != typeof t[r] && i.length)
                  ? i.length
                    ? (r += '.')
                    : (t = void 0)
                  : ((t = t[r]), (r = ''));
            } while (i.length);
            return t;
          }
          interpolateFunction(t, r) {
            return t(r);
          }
          interpolateString(t, r) {
            return r
              ? t.replace(this.templateMatcher, (i, o) => {
                  let s = this.getValue(r, o);
                  return Qt(s) ? s : i;
                })
              : t;
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = Qe(e)))(r || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Qc {}
      let CC = (() => {
        class e extends Qc {
          compile(t, r) {
            return t;
          }
          compileTranslations(t, r) {
            return t;
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = Qe(e)))(r || e);
            };
          })()),
          (e.ɵprov = M({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class NC {
        constructor() {
          (this.currentLang = this.defaultLang),
            (this.translations = {}),
            (this.langs = []),
            (this.onTranslationChange = new j()),
            (this.onLangChange = new j()),
            (this.onDefaultLangChange = new j());
        }
      }
      const zp = new k('USE_STORE'),
        Kp = new k('USE_DEFAULT_LANG'),
        qp = new k('DEFAULT_LANGUAGE'),
        Qp = new k('USE_EXTEND');
      let Fo = (() => {
          class e {
            constructor(t, r, i, o, s, a = !0, l = !1, c = !1, u) {
              (this.store = t),
                (this.currentLoader = r),
                (this.compiler = i),
                (this.parser = o),
                (this.missingTranslationHandler = s),
                (this.useDefaultLang = a),
                (this.isolate = l),
                (this.extend = c),
                (this.pending = !1),
                (this._onTranslationChange = new j()),
                (this._onLangChange = new j()),
                (this._onDefaultLangChange = new j()),
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
              let r = this.retrieveTranslations(t);
              typeof r < 'u'
                ? (null == this.defaultLang && (this.defaultLang = t),
                  r.pipe(we(1)).subscribe((i) => {
                    this.changeDefaultLang(t);
                  }))
                : this.changeDefaultLang(t);
            }
            getDefaultLang() {
              return this.defaultLang;
            }
            use(t) {
              if (t === this.currentLang) return P(this.translations[t]);
              let r = this.retrieveTranslations(t);
              return typeof r < 'u'
                ? (this.currentLang || (this.currentLang = t),
                  r.pipe(we(1)).subscribe((i) => {
                    this.changeLang(t);
                  }),
                  r)
                : (this.changeLang(t), P(this.translations[t]));
            }
            retrieveTranslations(t) {
              let r;
              return (
                (typeof this.translations[t] > 'u' || this.extend) &&
                  ((this._translationRequests[t] = this._translationRequests[t] || this.getTranslation(t)),
                  (r = this._translationRequests[t])),
                r
              );
            }
            getTranslation(t) {
              this.pending = !0;
              const r = this.currentLoader.getTranslation(t).pipe(vC(1), we(1));
              return (
                (this.loadingTranslations = r.pipe(
                  L((i) => this.compiler.compileTranslations(i, t)),
                  vC(1),
                  we(1)
                )),
                this.loadingTranslations.subscribe({
                  next: (i) => {
                    (this.translations[t] =
                      this.extend && this.translations[t] ? { ...i, ...this.translations[t] } : i),
                      this.updateLangs(),
                      (this.pending = !1);
                  },
                  error: (i) => {
                    this.pending = !1;
                  },
                }),
                r
              );
            }
            setTranslation(t, r, i = !1) {
              (r = this.compiler.compileTranslations(r, t)),
                (this.translations[t] = (i || this.extend) && this.translations[t] ? DC(this.translations[t], r) : r),
                this.updateLangs(),
                this.onTranslationChange.emit({ lang: t, translations: this.translations[t] });
            }
            getLangs() {
              return this.langs;
            }
            addLangs(t) {
              t.forEach((r) => {
                -1 === this.langs.indexOf(r) && this.langs.push(r);
              });
            }
            updateLangs() {
              this.addLangs(Object.keys(this.translations));
            }
            getParsedResult(t, r, i) {
              let o;
              if (r instanceof Array) {
                let s = {},
                  a = !1;
                for (let l of r) (s[l] = this.getParsedResult(t, l, i)), $r(s[l]) && (a = !0);
                return a
                  ? MD(r.map((c) => ($r(s[c]) ? s[c] : P(s[c])))).pipe(
                      L((c) => {
                        let u = {};
                        return (
                          c.forEach((d, f) => {
                            u[r[f]] = d;
                          }),
                          u
                        );
                      })
                    )
                  : s;
              }
              if (
                (t && (o = this.parser.interpolate(this.parser.getValue(t, r), i)),
                typeof o > 'u' &&
                  null != this.defaultLang &&
                  this.defaultLang !== this.currentLang &&
                  this.useDefaultLang &&
                  (o = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], r), i)),
                typeof o > 'u')
              ) {
                let s = { key: r, translateService: this };
                typeof i < 'u' && (s.interpolateParams = i), (o = this.missingTranslationHandler.handle(s));
              }
              return typeof o < 'u' ? o : r;
            }
            get(t, r) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              if (this.pending)
                return this.loadingTranslations.pipe(pr((i) => ($r((i = this.getParsedResult(i, t, r))) ? i : P(i))));
              {
                let i = this.getParsedResult(this.translations[this.currentLang], t, r);
                return $r(i) ? i : P(i);
              }
            }
            getStreamOnTranslationChange(t, r) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              return Vr(
                Mo(() => this.get(t, r)),
                this.onTranslationChange.pipe(
                  at((i) => {
                    const o = this.getParsedResult(i.translations, t, r);
                    return 'function' == typeof o.subscribe ? o : P(o);
                  })
                )
              );
            }
            stream(t, r) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              return Vr(
                Mo(() => this.get(t, r)),
                this.onLangChange.pipe(
                  at((i) => {
                    const o = this.getParsedResult(i.translations, t, r);
                    return $r(o) ? o : P(o);
                  })
                )
              );
            }
            instant(t, r) {
              if (!Qt(t) || !t.length) throw new Error('Parameter "key" required');
              let i = this.getParsedResult(this.translations[this.currentLang], t, r);
              if ($r(i)) {
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
              return i;
            }
            set(t, r, i = this.currentLang) {
              (this.translations[i][t] = this.compiler.compile(r, i)),
                this.updateLangs(),
                this.onTranslationChange.emit({ lang: i, translations: this.translations[i] });
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
              return new (t || e)(T(NC), T(Kc), T(Qc), T(qc), T($p), T(Kp), T(zp), T(Qp), T(qp));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Xc = (() => {
          class e {
            constructor(t, r, i) {
              (this.translateService = t),
                (this.element = r),
                (this._ref = i),
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
              ha(this.currentParams, t) || ((this.currentParams = t), this.checkNodes(!0));
            }
            ngAfterViewChecked() {
              this.checkNodes();
            }
            checkNodes(t = !1, r) {
              let i = this.element.nativeElement.childNodes;
              i.length ||
                (this.setContent(this.element.nativeElement, this.key), (i = this.element.nativeElement.childNodes));
              for (let o = 0; o < i.length; ++o) {
                let s = i[o];
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
                  this.updateValue(a, s, r);
                }
              }
            }
            updateValue(t, r, i) {
              if (t) {
                if (r.lastKey === t && this.lastParams === this.currentParams) return;
                this.lastParams = this.currentParams;
                let o = (s) => {
                  s !== t && (r.lastKey = t),
                    r.originalContent || (r.originalContent = this.getContent(r)),
                    (r.currentValue = Qt(s) ? s : r.originalContent || t),
                    this.setContent(r, this.key ? r.currentValue : r.originalContent.replace(t, r.currentValue)),
                    this._ref.markForCheck();
                };
                if (Qt(i)) {
                  let s = this.translateService.getParsedResult(i, t, this.currentParams);
                  $r(s) ? s.subscribe({ next: o }) : o(s);
                } else this.translateService.get(t, this.currentParams).subscribe(o);
              }
            }
            getContent(t) {
              return Qt(t.textContent) ? t.textContent : t.data;
            }
            setContent(t, r) {
              Qt(t.textContent) ? (t.textContent = r) : (t.data = r);
            }
            ngOnDestroy() {
              this.onLangChangeSub && this.onLangChangeSub.unsubscribe(),
                this.onDefaultLangChangeSub && this.onDefaultLangChangeSub.unsubscribe(),
                this.onTranslationChangeSub && this.onTranslationChangeSub.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Fo), _(De), _(Tn));
            }),
            (e.ɵdir = O({
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
        TC = (() => {
          class e {
            constructor(t, r) {
              (this.translate = t), (this._ref = r), (this.value = ''), (this.lastKey = null), (this.lastParams = []);
            }
            updateValue(t, r, i) {
              let o = (s) => {
                (this.value = void 0 !== s ? s : t), (this.lastKey = t), this._ref.markForCheck();
              };
              if (i) {
                let s = this.translate.getParsedResult(i, t, r);
                $r(s.subscribe) ? s.subscribe(o) : o(s);
              }
              this.translate.get(t, r).subscribe(o);
            }
            transform(t, ...r) {
              if (!t || !t.length) return t;
              if (ha(t, this.lastKey) && ha(r, this.lastParams)) return this.value;
              let i;
              if (Qt(r[0]) && r.length)
                if ('string' == typeof r[0] && r[0].length) {
                  let o = r[0]
                    .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
                    .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
                  try {
                    i = JSON.parse(o);
                  } catch {
                    throw new SyntaxError(
                      `Wrong parameter in TranslatePipe. Expected a valid Object, received: ${r[0]}`
                    );
                  }
                } else 'object' == typeof r[0] && !Array.isArray(r[0]) && (i = r[0]);
              return (
                (this.lastKey = t),
                (this.lastParams = r),
                this.updateValue(t, i),
                this._dispose(),
                this.onTranslationChange ||
                  (this.onTranslationChange = this.translate.onTranslationChange.subscribe((o) => {
                    this.lastKey &&
                      o.lang === this.translate.currentLang &&
                      ((this.lastKey = null), this.updateValue(t, i, o.translations));
                  })),
                this.onLangChange ||
                  (this.onLangChange = this.translate.onLangChange.subscribe((o) => {
                    this.lastKey && ((this.lastKey = null), this.updateValue(t, i, o.translations));
                  })),
                this.onDefaultLangChange ||
                  (this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
                    this.lastKey && ((this.lastKey = null), this.updateValue(t, i));
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
              return new (t || e)(_(Fo, 16), _(Tn, 16));
            }),
            (e.ɵpipe = Mt({ name: 'translate', type: e, pure: !1 })),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        mi = (() => {
          class e {
            static forRoot(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.loader || { provide: Kc, useClass: yC },
                  t.compiler || { provide: Qc, useClass: CC },
                  t.parser || { provide: qc, useClass: wC },
                  t.missingTranslationHandler || { provide: $p, useClass: bC },
                  NC,
                  { provide: zp, useValue: t.isolate },
                  { provide: Kp, useValue: t.useDefaultLang },
                  { provide: Qp, useValue: t.extend },
                  { provide: qp, useValue: t.defaultLanguage },
                  Fo,
                ],
              };
            }
            static forChild(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.loader || { provide: Kc, useClass: yC },
                  t.compiler || { provide: Qc, useClass: CC },
                  t.parser || { provide: qc, useClass: wC },
                  t.missingTranslationHandler || { provide: $p, useClass: bC },
                  { provide: zp, useValue: t.isolate },
                  { provide: Kp, useValue: t.useDefaultLang },
                  { provide: Qp, useValue: t.extend },
                  { provide: qp, useValue: t.defaultLanguage },
                  Fo,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      const { isArray: TB } = Array;
      function EC(e) {
        return 1 === e.length && TB(e[0]) ? e[0] : e;
      }
      function SC(...e) {
        return 1 === (e = EC(e)).length
          ? ft(e[0])
          : new he(
              (function EB(e) {
                return (n) => {
                  let t = [];
                  for (let r = 0; t && !n.closed && r < e.length; r++)
                    t.push(
                      ft(e[r]).subscribe(
                        Ce(n, (i) => {
                          if (t) {
                            for (let o = 0; o < t.length; o++) o !== r && t[o].unsubscribe();
                            t = null;
                          }
                          n.next(i);
                        })
                      )
                    );
                };
              })(e)
            );
      }
      function Yc(...e) {
        const n = Pa(e),
          t = EC(e);
        return t.length
          ? new he((r) => {
              let i = t.map(() => []),
                o = t.map(() => !1);
              r.add(() => {
                i = o = null;
              });
              for (let s = 0; !r.closed && s < t.length; s++)
                ft(t[s]).subscribe(
                  Ce(
                    r,
                    (a) => {
                      if ((i[s].push(a), i.every((l) => l.length))) {
                        const l = i.map((c) => c.shift());
                        r.next(n ? n(...l) : l), i.some((c, u) => !c.length && o[u]) && r.complete();
                      }
                    },
                    () => {
                      (o[s] = !0), !i[s].length && r.complete();
                    }
                  )
                );
              return () => {
                i = o = null;
              };
            })
          : Jt;
      }
      function tt(e) {
        return Re((n, t) => {
          ft(e).subscribe(Ce(t, () => t.complete(), Ii)), !t.closed && n.subscribe(t);
        });
      }
      function Yp(...e) {
        const n = Pa(e);
        return Re((t, r) => {
          const i = e.length,
            o = new Array(i);
          let s = e.map(() => !1),
            a = !1;
          for (let l = 0; l < i; l++)
            ft(e[l]).subscribe(
              Ce(
                r,
                (c) => {
                  (o[l] = c), !a && !s[l] && ((s[l] = !0), (a = s.every(Zn)) && (s = null));
                },
                Ii
              )
            );
          t.subscribe(
            Ce(r, (l) => {
              if (a) {
                const c = [l, ...o];
                r.next(n ? n(...c) : c);
              }
            })
          );
        });
      }
      var AB = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
      function Jc(e) {
        return e.replace(/left|right|bottom|top/g, function (n) {
          return AB[n];
        });
      }
      function Xn(e) {
        return e.split('-')[0];
      }
      var IB = { start: 'end', end: 'start' };
      function MC(e) {
        return e.replace(/start|end/g, function (n) {
          return IB[n];
        });
      }
      var Xt = 'top',
        Mn = 'bottom',
        On = 'right',
        Yt = 'left',
        Jp = 'auto',
        pa = [Xt, Mn, On, Yt],
        ko = 'start',
        ga = 'end',
        OC = 'viewport',
        _a = 'popper',
        AC = pa.reduce(function (e, n) {
          return e.concat([n + '-' + ko, n + '-' + ga]);
        }, []),
        IC = [].concat(pa, [Jp]).reduce(function (e, n) {
          return e.concat([n, n + '-' + ko, n + '-' + ga]);
        }, []),
        UB = [
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
      function ln(e) {
        if (null == e) return window;
        if ('[object Window]' !== e.toString()) {
          var n = e.ownerDocument;
          return (n && n.defaultView) || window;
        }
        return e;
      }
      function vi(e) {
        return e instanceof ln(e).Element || e instanceof Element;
      }
      function cn(e) {
        return e instanceof ln(e).HTMLElement || e instanceof HTMLElement;
      }
      function Zp(e) {
        return !(typeof ShadowRoot > 'u') && (e instanceof ln(e).ShadowRoot || e instanceof ShadowRoot);
      }
      function Wr(e) {
        return ((vi(e) ? e.ownerDocument : e.document) || window.document).documentElement;
      }
      var yi = Math.max,
        Zc = Math.min,
        Lo = Math.round;
      function eg() {
        var e = navigator.userAgentData;
        return null != e && e.brands
          ? e.brands
              .map(function (n) {
                return n.brand + '/' + n.version;
              })
              .join(' ')
          : navigator.userAgent;
      }
      function RC() {
        return !/^((?!chrome|android).)*safari/i.test(eg());
      }
      function Vo(e, n, t) {
        void 0 === n && (n = !1), void 0 === t && (t = !1);
        var r = e.getBoundingClientRect(),
          i = 1,
          o = 1;
        n &&
          cn(e) &&
          ((i = (e.offsetWidth > 0 && Lo(r.width) / e.offsetWidth) || 1),
          (o = (e.offsetHeight > 0 && Lo(r.height) / e.offsetHeight) || 1));
        var a = (vi(e) ? ln(e) : window).visualViewport,
          l = !RC() && t,
          c = (r.left + (l && a ? a.offsetLeft : 0)) / i,
          u = (r.top + (l && a ? a.offsetTop : 0)) / o,
          d = r.width / i,
          f = r.height / o;
        return { width: d, height: f, top: u, right: c + d, bottom: u + f, left: c, x: c, y: u };
      }
      function tg(e) {
        var n = ln(e);
        return { scrollLeft: n.pageXOffset, scrollTop: n.pageYOffset };
      }
      function ng(e) {
        return Vo(Wr(e)).left + tg(e).scrollLeft;
      }
      function br(e) {
        return ln(e).getComputedStyle(e);
      }
      function Yn(e) {
        return e ? (e.nodeName || '').toLowerCase() : null;
      }
      function eu(e) {
        return 'html' === Yn(e) ? e : e.assignedSlot || e.parentNode || (Zp(e) ? e.host : null) || Wr(e);
      }
      function rg(e) {
        var n = br(e);
        return /auto|scroll|overlay|hidden/.test(n.overflow + n.overflowY + n.overflowX);
      }
      function PC(e) {
        return ['html', 'body', '#document'].indexOf(Yn(e)) >= 0
          ? e.ownerDocument.body
          : cn(e) && rg(e)
          ? e
          : PC(eu(e));
      }
      function ma(e, n) {
        var t;
        void 0 === n && (n = []);
        var r = PC(e),
          i = r === (null == (t = e.ownerDocument) ? void 0 : t.body),
          o = ln(r),
          s = i ? [o].concat(o.visualViewport || [], rg(r) ? r : []) : r,
          a = n.concat(s);
        return i ? a : a.concat(ma(eu(s)));
      }
      function zB(e) {
        return ['table', 'td', 'th'].indexOf(Yn(e)) >= 0;
      }
      function xC(e) {
        return cn(e) && 'fixed' !== br(e).position ? e.offsetParent : null;
      }
      function va(e) {
        for (var n = ln(e), t = xC(e); t && zB(t) && 'static' === br(t).position; ) t = xC(t);
        return t && ('html' === Yn(t) || ('body' === Yn(t) && 'static' === br(t).position))
          ? n
          : t ||
              (function KB(e) {
                var n = /firefox/i.test(eg());
                if (/Trident/i.test(eg()) && cn(e) && 'fixed' === br(e).position) return null;
                var i = eu(e);
                for (Zp(i) && (i = i.host); cn(i) && ['html', 'body'].indexOf(Yn(i)) < 0; ) {
                  var o = br(i);
                  if (
                    'none' !== o.transform ||
                    'none' !== o.perspective ||
                    'paint' === o.contain ||
                    -1 !== ['transform', 'perspective'].indexOf(o.willChange) ||
                    (n && 'filter' === o.willChange) ||
                    (n && o.filter && 'none' !== o.filter)
                  )
                    return i;
                  i = i.parentNode;
                }
                return null;
              })(e) ||
              n;
      }
      function FC(e, n) {
        var t = n.getRootNode && n.getRootNode();
        if (e.contains(n)) return !0;
        if (t && Zp(t)) {
          var r = n;
          do {
            if (r && e.isSameNode(r)) return !0;
            r = r.parentNode || r.host;
          } while (r);
        }
        return !1;
      }
      function ig(e) {
        return Object.assign({}, e, { left: e.x, top: e.y, right: e.x + e.width, bottom: e.y + e.height });
      }
      function kC(e, n, t) {
        return n === OC
          ? ig(
              (function $B(e, n) {
                var t = ln(e),
                  r = Wr(e),
                  i = t.visualViewport,
                  o = r.clientWidth,
                  s = r.clientHeight,
                  a = 0,
                  l = 0;
                if (i) {
                  (o = i.width), (s = i.height);
                  var c = RC();
                  (c || (!c && 'fixed' === n)) && ((a = i.offsetLeft), (l = i.offsetTop));
                }
                return { width: o, height: s, x: a + ng(e), y: l };
              })(e, t)
            )
          : vi(n)
          ? (function qB(e, n) {
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
              (function WB(e) {
                var n,
                  t = Wr(e),
                  r = tg(e),
                  i = null == (n = e.ownerDocument) ? void 0 : n.body,
                  o = yi(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0),
                  s = yi(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0),
                  a = -r.scrollLeft + ng(e),
                  l = -r.scrollTop;
                return (
                  'rtl' === br(i || t).direction && (a += yi(t.clientWidth, i ? i.clientWidth : 0) - o),
                  { width: o, height: s, x: a, y: l }
                );
              })(Wr(e))
            );
      }
      function Bo(e) {
        return e.split('-')[1];
      }
      function og(e) {
        return ['top', 'bottom'].indexOf(e) >= 0 ? 'x' : 'y';
      }
      function LC(e) {
        var l,
          n = e.reference,
          t = e.element,
          r = e.placement,
          i = r ? Xn(r) : null,
          o = r ? Bo(r) : null,
          s = n.x + n.width / 2 - t.width / 2,
          a = n.y + n.height / 2 - t.height / 2;
        switch (i) {
          case Xt:
            l = { x: s, y: n.y - t.height };
            break;
          case Mn:
            l = { x: s, y: n.y + n.height };
            break;
          case On:
            l = { x: n.x + n.width, y: a };
            break;
          case Yt:
            l = { x: n.x - t.width, y: a };
            break;
          default:
            l = { x: n.x, y: n.y };
        }
        var c = i ? og(i) : null;
        if (null != c) {
          var u = 'y' === c ? 'height' : 'width';
          switch (o) {
            case ko:
              l[c] = l[c] - (n[u] / 2 - t[u] / 2);
              break;
            case ga:
              l[c] = l[c] + (n[u] / 2 - t[u] / 2);
          }
        }
        return l;
      }
      function BC(e) {
        return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, e);
      }
      function HC(e, n) {
        return n.reduce(function (t, r) {
          return (t[r] = e), t;
        }, {});
      }
      function sg(e, n) {
        void 0 === n && (n = {});
        var r = n.placement,
          i = void 0 === r ? e.placement : r,
          o = n.strategy,
          s = void 0 === o ? e.strategy : o,
          a = n.boundary,
          l = void 0 === a ? 'clippingParents' : a,
          c = n.rootBoundary,
          u = void 0 === c ? OC : c,
          d = n.elementContext,
          f = void 0 === d ? _a : d,
          h = n.altBoundary,
          p = void 0 !== h && h,
          g = n.padding,
          v = void 0 === g ? 0 : g,
          y = BC('number' != typeof v ? v : HC(v, pa)),
          b = e.rects.popper,
          C = e.elements[p ? (f === _a ? 'reference' : _a) : f],
          A = (function XB(e, n, t, r) {
            var i =
                'clippingParents' === n
                  ? (function QB(e) {
                      var n = ma(eu(e)),
                        r = ['absolute', 'fixed'].indexOf(br(e).position) >= 0 && cn(e) ? va(e) : e;
                      return vi(r)
                        ? n.filter(function (i) {
                            return vi(i) && FC(i, r) && 'body' !== Yn(i);
                          })
                        : [];
                    })(e)
                  : [].concat(n),
              o = [].concat(i, [t]),
              a = o.reduce(function (l, c) {
                var u = kC(e, c, r);
                return (
                  (l.top = yi(u.top, l.top)),
                  (l.right = Zc(u.right, l.right)),
                  (l.bottom = Zc(u.bottom, l.bottom)),
                  (l.left = yi(u.left, l.left)),
                  l
                );
              }, kC(e, o[0], r));
            return (a.width = a.right - a.left), (a.height = a.bottom - a.top), (a.x = a.left), (a.y = a.top), a;
          })(vi(C) ? C : C.contextElement || Wr(e.elements.popper), l, u, s),
          x = Vo(e.elements.reference),
          ie = LC({ reference: x, element: b, strategy: 'absolute', placement: i }),
          se = ig(Object.assign({}, b, ie)),
          ke = f === _a ? se : x,
          Le = {
            top: A.top - ke.top + y.top,
            bottom: ke.bottom - A.bottom + y.bottom,
            left: A.left - ke.left + y.left,
            right: ke.right - A.right + y.right,
          },
          Se = e.modifiersData.offset;
        if (f === _a && Se) {
          var kt = Se[i];
          Object.keys(Le).forEach(function (dt) {
            var In = [On, Mn].indexOf(dt) >= 0 ? 1 : -1,
              Rn = [Xt, Mn].indexOf(dt) >= 0 ? 'y' : 'x';
            Le[dt] += kt[Rn] * In;
          });
        }
        return Le;
      }
      const eH = {
        name: 'flip',
        enabled: !0,
        phase: 'main',
        fn: function ZB(e) {
          var n = e.state,
            t = e.options,
            r = e.name;
          if (!n.modifiersData[r]._skip) {
            for (
              var i = t.mainAxis,
                o = void 0 === i || i,
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
                v = n.options.placement,
                y = Xn(v),
                b =
                  l ||
                  (y !== v && p
                    ? (function JB(e) {
                        if (Xn(e) === Jp) return [];
                        var n = Jc(e);
                        return [MC(e), n, MC(n)];
                      })(v)
                    : [Jc(v)]),
                C = [v].concat(b).reduce(function (Uo, Kr) {
                  return Uo.concat(
                    Xn(Kr) === Jp
                      ? (function YB(e, n) {
                          void 0 === n && (n = {});
                          var i = n.boundary,
                            o = n.rootBoundary,
                            s = n.padding,
                            a = n.flipVariations,
                            l = n.allowedAutoPlacements,
                            c = void 0 === l ? IC : l,
                            u = Bo(n.placement),
                            d = u
                              ? a
                                ? AC
                                : AC.filter(function (p) {
                                    return Bo(p) === u;
                                  })
                              : pa,
                            f = d.filter(function (p) {
                              return c.indexOf(p) >= 0;
                            });
                          0 === f.length && (f = d);
                          var h = f.reduce(function (p, g) {
                            return (p[g] = sg(e, { placement: g, boundary: i, rootBoundary: o, padding: s })[Xn(g)]), p;
                          }, {});
                          return Object.keys(h).sort(function (p, g) {
                            return h[p] - h[g];
                          });
                        })(n, {
                          placement: Kr,
                          boundary: u,
                          rootBoundary: d,
                          padding: c,
                          flipVariations: p,
                          allowedAutoPlacements: g,
                        })
                      : Kr
                  );
                }, []),
                A = n.rects.reference,
                x = n.rects.popper,
                ie = new Map(),
                se = !0,
                ke = C[0],
                Le = 0;
              Le < C.length;
              Le++
            ) {
              var Se = C[Le],
                kt = Xn(Se),
                dt = Bo(Se) === ko,
                In = [Xt, Mn].indexOf(kt) >= 0,
                Rn = In ? 'width' : 'height',
                yt = sg(n, { placement: Se, boundary: u, rootBoundary: d, altBoundary: f, padding: c }),
                Pn = In ? (dt ? On : Yt) : dt ? Mn : Xt;
              A[Rn] > x[Rn] && (Pn = Jc(Pn));
              var du = Jc(Pn),
                Si = [];
              if (
                (o && Si.push(yt[kt] <= 0),
                a && Si.push(yt[Pn] <= 0, yt[du] <= 0),
                Si.every(function (Uo) {
                  return Uo;
                }))
              ) {
                (ke = Se), (se = !1);
                break;
              }
              ie.set(Se, Si);
            }
            if (se)
              for (
                var Cg = function (Kr) {
                    var Ma = C.find(function (pu) {
                      var Mi = ie.get(pu);
                      if (Mi)
                        return Mi.slice(0, Kr).every(function (Ng) {
                          return Ng;
                        });
                    });
                    if (Ma) return (ke = Ma), 'break';
                  },
                  Sa = p ? 3 : 1;
                Sa > 0 && 'break' !== Cg(Sa);
                Sa--
              );
            n.placement !== ke && ((n.modifiersData[r]._skip = !0), (n.placement = ke), (n.reset = !0));
          }
        },
        requiresIfExists: ['offset'],
        data: { _skip: !1 },
      };
      function ya(e, n, t) {
        return yi(e, Zc(n, t));
      }
      function ag(e) {
        var n = Vo(e),
          t = e.offsetWidth,
          r = e.offsetHeight;
        return (
          Math.abs(n.width - t) <= 1 && (t = n.width),
          Math.abs(n.height - r) <= 1 && (r = n.height),
          { x: e.offsetLeft, y: e.offsetTop, width: t, height: r }
        );
      }
      const iH = {
          name: 'preventOverflow',
          enabled: !0,
          phase: 'main',
          fn: function rH(e) {
            var n = e.state,
              t = e.options,
              r = e.name,
              i = t.mainAxis,
              o = void 0 === i || i,
              s = t.altAxis,
              a = void 0 !== s && s,
              f = t.tether,
              h = void 0 === f || f,
              p = t.tetherOffset,
              g = void 0 === p ? 0 : p,
              v = sg(n, {
                boundary: t.boundary,
                rootBoundary: t.rootBoundary,
                padding: t.padding,
                altBoundary: t.altBoundary,
              }),
              y = Xn(n.placement),
              D = Bo(n.placement),
              b = !D,
              C = og(y),
              A = (function tH(e) {
                return 'x' === e ? 'y' : 'x';
              })(C),
              x = n.modifiersData.popperOffsets,
              ie = n.rects.reference,
              se = n.rects.popper,
              ke = 'function' == typeof g ? g(Object.assign({}, n.rects, { placement: n.placement })) : g,
              Le =
                'number' == typeof ke ? { mainAxis: ke, altAxis: ke } : Object.assign({ mainAxis: 0, altAxis: 0 }, ke),
              Se = n.modifiersData.offset ? n.modifiersData.offset[n.placement] : null,
              kt = { x: 0, y: 0 };
            if (x) {
              if (o) {
                var dt,
                  In = 'y' === C ? Xt : Yt,
                  Rn = 'y' === C ? Mn : On,
                  yt = 'y' === C ? 'height' : 'width',
                  Pn = x[C],
                  du = Pn + v[In],
                  Si = Pn - v[Rn],
                  fu = h ? -se[yt] / 2 : 0,
                  Cg = D === ko ? ie[yt] : se[yt],
                  Sa = D === ko ? -se[yt] : -ie[yt],
                  hu = n.elements.arrow,
                  Uo = h && hu ? ag(hu) : { width: 0, height: 0 },
                  Kr = n.modifiersData['arrow#persistent']
                    ? n.modifiersData['arrow#persistent'].padding
                    : { top: 0, right: 0, bottom: 0, left: 0 },
                  Ma = Kr[In],
                  pu = Kr[Rn],
                  Mi = ya(0, ie[yt], Uo[yt]),
                  Ng = b ? ie[yt] / 2 - fu - Mi - Ma - Le.mainAxis : Cg - Mi - Ma - Le.mainAxis,
                  t$ = b ? -ie[yt] / 2 + fu + Mi + pu + Le.mainAxis : Sa + Mi + pu + Le.mainAxis,
                  Tg = n.elements.arrow && va(n.elements.arrow),
                  iT = null != (dt = Se?.[C]) ? dt : 0,
                  i$ = Pn + t$ - iT,
                  oT = ya(
                    h ? Zc(du, Pn + Ng - iT - (Tg ? ('y' === C ? Tg.clientTop || 0 : Tg.clientLeft || 0) : 0)) : du,
                    Pn,
                    h ? yi(Si, i$) : Si
                  );
                (x[C] = oT), (kt[C] = oT - Pn);
              }
              if (a) {
                var sT,
                  Oi = x[A],
                  gu = 'y' === A ? 'height' : 'width',
                  aT = Oi + v['x' === C ? Xt : Yt],
                  lT = Oi - v['x' === C ? Mn : On],
                  Eg = -1 !== [Xt, Yt].indexOf(y),
                  cT = null != (sT = Se?.[A]) ? sT : 0,
                  uT = Eg ? aT : Oi - ie[gu] - se[gu] - cT + Le.altAxis,
                  dT = Eg ? Oi + ie[gu] + se[gu] - cT - Le.altAxis : lT,
                  fT =
                    h && Eg
                      ? (function nH(e, n, t) {
                          var r = ya(e, n, t);
                          return r > t ? t : r;
                        })(uT, Oi, dT)
                      : ya(h ? uT : aT, Oi, h ? dT : lT);
                (x[A] = fT), (kt[A] = fT - Oi);
              }
              n.modifiersData[r] = kt;
            }
          },
          requiresIfExists: ['offset'],
        },
        lH = {
          name: 'arrow',
          enabled: !0,
          phase: 'main',
          fn: function sH(e) {
            var n,
              t = e.state,
              r = e.name,
              i = e.options,
              o = t.elements.arrow,
              s = t.modifiersData.popperOffsets,
              a = Xn(t.placement),
              l = og(a),
              u = [Yt, On].indexOf(a) >= 0 ? 'height' : 'width';
            if (o && s) {
              var d = (function (n, t) {
                  return BC(
                    'number' !=
                      typeof (n =
                        'function' == typeof n ? n(Object.assign({}, t.rects, { placement: t.placement })) : n)
                      ? n
                      : HC(n, pa)
                  );
                })(i.padding, t),
                f = ag(o),
                h = 'y' === l ? Xt : Yt,
                p = 'y' === l ? Mn : On,
                g = t.rects.reference[u] + t.rects.reference[l] - s[l] - t.rects.popper[u],
                v = s[l] - t.rects.reference[l],
                y = va(o),
                D = y ? ('y' === l ? y.clientHeight || 0 : y.clientWidth || 0) : 0,
                x = D / 2 - f[u] / 2 + (g / 2 - v / 2),
                ie = ya(d[h], x, D - f[u] - d[p]);
              t.modifiersData[r] = (((n = {})[l] = ie), (n.centerOffset = ie - x), n);
            }
          },
          effect: function aH(e) {
            var n = e.state,
              r = e.options.element,
              i = void 0 === r ? '[data-popper-arrow]' : r;
            null != i &&
              (('string' == typeof i && !(i = n.elements.popper.querySelector(i))) ||
                !FC(n.elements.popper, i) ||
                (n.elements.arrow = i));
          },
          requires: ['popperOffsets'],
          requiresIfExists: ['preventOverflow'],
        };
      function fH(e, n, t) {
        void 0 === t && (t = !1);
        var r = cn(n),
          i =
            cn(n) &&
            (function dH(e) {
              var n = e.getBoundingClientRect(),
                t = Lo(n.width) / e.offsetWidth || 1,
                r = Lo(n.height) / e.offsetHeight || 1;
              return 1 !== t || 1 !== r;
            })(n),
          o = Wr(n),
          s = Vo(e, i, t),
          a = { scrollLeft: 0, scrollTop: 0 },
          l = { x: 0, y: 0 };
        return (
          (r || (!r && !t)) &&
            (('body' !== Yn(n) || rg(o)) &&
              (a = (function uH(e) {
                return e !== ln(e) && cn(e)
                  ? (function cH(e) {
                      return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
                    })(e)
                  : tg(e);
              })(n)),
            cn(n) ? (((l = Vo(n, !0)).x += n.clientLeft), (l.y += n.clientTop)) : o && (l.x = ng(o))),
          { x: s.left + a.scrollLeft - l.x, y: s.top + a.scrollTop - l.y, width: s.width, height: s.height }
        );
      }
      function hH(e) {
        var n = new Map(),
          t = new Set(),
          r = [];
        function i(o) {
          t.add(o.name),
            [].concat(o.requires || [], o.requiresIfExists || []).forEach(function (a) {
              if (!t.has(a)) {
                var l = n.get(a);
                l && i(l);
              }
            }),
            r.push(o);
        }
        return (
          e.forEach(function (o) {
            n.set(o.name, o);
          }),
          e.forEach(function (o) {
            t.has(o.name) || i(o);
          }),
          r
        );
      }
      function gH(e) {
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
      var jC = { placement: 'bottom', modifiers: [], strategy: 'absolute' };
      function GC() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) n[t] = arguments[t];
        return !n.some(function (r) {
          return !(r && 'function' == typeof r.getBoundingClientRect);
        });
      }
      function mH(e) {
        void 0 === e && (e = {});
        var t = e.defaultModifiers,
          r = void 0 === t ? [] : t,
          i = e.defaultOptions,
          o = void 0 === i ? jC : i;
        return function (a, l, c) {
          void 0 === c && (c = o);
          var u = {
              placement: 'bottom',
              orderedModifiers: [],
              options: Object.assign({}, jC, o),
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
                    reference: vi(a) ? ma(a) : a.contextElement ? ma(a.contextElement) : [],
                    popper: ma(l),
                  });
                var b = (function pH(e) {
                  var n = hH(e);
                  return UB.reduce(function (t, r) {
                    return t.concat(
                      n.filter(function (i) {
                        return i.phase === r;
                      })
                    );
                  }, []);
                })(
                  (function _H(e) {
                    var n = e.reduce(function (t, r) {
                      var i = t[r.name];
                      return (
                        (t[r.name] = i
                          ? Object.assign({}, i, r, {
                              options: Object.assign({}, i.options, r.options),
                              data: Object.assign({}, i.data, r.data),
                            })
                          : r),
                        t
                      );
                    }, {});
                    return Object.keys(n).map(function (t) {
                      return n[t];
                    });
                  })([].concat(r, u.options.modifiers))
                );
                return (
                  (u.orderedModifiers = b.filter(function (Se) {
                    return Se.enabled;
                  })),
                  (function p() {
                    u.orderedModifiers.forEach(function (v) {
                      var D = v.options,
                        C = v.effect;
                      if ('function' == typeof C) {
                        var A = C({ state: u, name: v.name, instance: h, options: void 0 === D ? {} : D });
                        d.push(A || function () {});
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
                  if (GC(D, b)) {
                    (u.rects = { reference: fH(D, va(b), 'fixed' === u.options.strategy), popper: ag(b) }),
                      (u.reset = !1),
                      (u.placement = u.options.placement),
                      u.orderedModifiers.forEach(function (Se) {
                        return (u.modifiersData[Se.name] = Object.assign({}, Se.data));
                      });
                    for (var A = 0; A < u.orderedModifiers.length; A++)
                      if (!0 !== u.reset) {
                        var x = u.orderedModifiers[A],
                          ie = x.fn,
                          se = x.options;
                        'function' == typeof ie &&
                          (u = ie({ state: u, options: void 0 === se ? {} : se, name: x.name, instance: h }) || u);
                      } else (u.reset = !1), (A = -1);
                  }
                }
              },
              update: gH(function () {
                return new Promise(function (v) {
                  h.forceUpdate(), v(u);
                });
              }),
              destroy: function () {
                g(), (f = !0);
              },
            };
          if (!GC(a, l)) return h;
          function g() {
            d.forEach(function (v) {
              return v();
            }),
              (d = []);
          }
          return (
            h.setOptions(c).then(function (v) {
              !f && c.onFirstUpdate && c.onFirstUpdate(v);
            }),
            h
          );
        };
      }
      var tu = { passive: !0 },
        wH = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };
      function UC(e) {
        var n,
          t = e.popper,
          r = e.popperRect,
          i = e.placement,
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
          v = 'function' == typeof u ? u({ x: h, y: g }) : { x: h, y: g };
        (h = v.x), (g = v.y);
        var y = s.hasOwnProperty('x'),
          D = s.hasOwnProperty('y'),
          b = Yt,
          C = Xt,
          A = window;
        if (c) {
          var x = va(t),
            ie = 'clientHeight',
            se = 'clientWidth';
          x === ln(t) &&
            'static' !== br((x = Wr(t))).position &&
            'absolute' === a &&
            ((ie = 'scrollHeight'), (se = 'scrollWidth')),
            (i === Xt || ((i === Yt || i === On) && o === ga)) &&
              ((C = Mn),
              (g -= (d && x === A && A.visualViewport ? A.visualViewport.height : x[ie]) - r.height),
              (g *= l ? 1 : -1)),
            (i !== Yt && ((i !== Xt && i !== Mn) || o !== ga)) ||
              ((b = On),
              (h -= (d && x === A && A.visualViewport ? A.visualViewport.width : x[se]) - r.width),
              (h *= l ? 1 : -1));
        }
        var dt,
          Se = Object.assign({ position: a }, c && wH),
          kt =
            !0 === u
              ? (function CH(e) {
                  var t = e.y,
                    i = window.devicePixelRatio || 1;
                  return { x: Lo(e.x * i) / i || 0, y: Lo(t * i) / i || 0 };
                })({ x: h, y: g })
              : { x: h, y: g };
        return (
          (h = kt.x),
          (g = kt.y),
          Object.assign(
            {},
            Se,
            l
              ? (((dt = {})[C] = D ? '0' : ''),
                (dt[b] = y ? '0' : ''),
                (dt.transform =
                  (A.devicePixelRatio || 1) <= 1
                    ? 'translate(' + h + 'px, ' + g + 'px)'
                    : 'translate3d(' + h + 'px, ' + g + 'px, 0)'),
                dt)
              : (((n = {})[C] = D ? g + 'px' : ''), (n[b] = y ? h + 'px' : ''), (n.transform = ''), n)
          )
        );
      }
      var OH = mH({
        defaultModifiers: [
          {
            name: 'eventListeners',
            enabled: !0,
            phase: 'write',
            fn: function () {},
            effect: function vH(e) {
              var n = e.state,
                t = e.instance,
                r = e.options,
                i = r.scroll,
                o = void 0 === i || i,
                s = r.resize,
                a = void 0 === s || s,
                l = ln(n.elements.popper),
                c = [].concat(n.scrollParents.reference, n.scrollParents.popper);
              return (
                o &&
                  c.forEach(function (u) {
                    u.addEventListener('scroll', t.update, tu);
                  }),
                a && l.addEventListener('resize', t.update, tu),
                function () {
                  o &&
                    c.forEach(function (u) {
                      u.removeEventListener('scroll', t.update, tu);
                    }),
                    a && l.removeEventListener('resize', t.update, tu);
                }
              );
            },
            data: {},
          },
          {
            name: 'popperOffsets',
            enabled: !0,
            phase: 'read',
            fn: function bH(e) {
              var n = e.state;
              n.modifiersData[e.name] = LC({
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
            fn: function NH(e) {
              var n = e.state,
                t = e.options,
                r = t.gpuAcceleration,
                i = void 0 === r || r,
                o = t.adaptive,
                s = void 0 === o || o,
                a = t.roundOffsets,
                l = void 0 === a || a,
                u = {
                  placement: Xn(n.placement),
                  variation: Bo(n.placement),
                  popper: n.elements.popper,
                  popperRect: n.rects.popper,
                  gpuAcceleration: i,
                  isFixed: 'fixed' === n.options.strategy,
                };
              null != n.modifiersData.popperOffsets &&
                (n.styles.popper = Object.assign(
                  {},
                  n.styles.popper,
                  UC(
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
                    UC(
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
            fn: function EH(e) {
              var n = e.state;
              Object.keys(n.elements).forEach(function (t) {
                var r = n.styles[t] || {},
                  i = n.attributes[t] || {},
                  o = n.elements[t];
                !cn(o) ||
                  !Yn(o) ||
                  (Object.assign(o.style, r),
                  Object.keys(i).forEach(function (s) {
                    var a = i[s];
                    !1 === a ? o.removeAttribute(s) : o.setAttribute(s, !0 === a ? '' : a);
                  }));
              });
            },
            effect: function SH(e) {
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
                  Object.keys(n.elements).forEach(function (r) {
                    var i = n.elements[r],
                      o = n.attributes[r] || {},
                      a = Object.keys(n.styles.hasOwnProperty(r) ? n.styles[r] : t[r]).reduce(function (l, c) {
                        return (l[c] = ''), l;
                      }, {});
                    !cn(i) ||
                      !Yn(i) ||
                      (Object.assign(i.style, a),
                      Object.keys(o).forEach(function (l) {
                        i.removeAttribute(l);
                      }));
                  });
                }
              );
            },
            requires: ['computeStyles'],
          },
        ],
      });
      const RH = {
          name: 'offset',
          enabled: !0,
          phase: 'main',
          requires: ['popperOffsets'],
          fn: function IH(e) {
            var n = e.state,
              r = e.name,
              i = e.options.offset,
              o = void 0 === i ? [0, 0] : i,
              s = IC.reduce(function (u, d) {
                return (
                  (u[d] = (function AH(e, n, t) {
                    var r = Xn(e),
                      i = [Yt, Xt].indexOf(r) >= 0 ? -1 : 1,
                      o = 'function' == typeof t ? t(Object.assign({}, n, { placement: e })) : t,
                      s = o[0],
                      a = o[1];
                    return (s = s || 0), (a = (a || 0) * i), [Yt, On].indexOf(r) >= 0 ? { x: a, y: s } : { x: s, y: a };
                  })(d, n.rects, o)),
                  u
                );
              }, {}),
              a = s[n.placement],
              c = a.y;
            null != n.modifiersData.popperOffsets &&
              ((n.modifiersData.popperOffsets.x += a.x), (n.modifiersData.popperOffsets.y += c)),
              (n.modifiersData[r] = s);
          },
        },
        HH = ['*'],
        ij = ['dialog'];
      function cg(e) {
        return 'string' == typeof e;
      }
      function bi(e) {
        return null != e;
      }
      function Ho(e) {
        return (e || document.body).getBoundingClientRect();
      }
      const WC = { animation: !0, transitionTimerDelayMs: 5 },
        Jj = () => {},
        { transitionTimerDelayMs: Zj } = WC,
        ba = new Map(),
        St = (e, n, t, r) => {
          let i = r.context || {};
          const o = ba.get(n);
          if (o)
            switch (r.runningTransition) {
              case 'continue':
                return Jt;
              case 'stop':
                e.run(() => o.transition$.complete()), (i = Object.assign(o.context, i)), ba.delete(n);
            }
          const s = t(n, r.animation, i) || Jj;
          if (!r.animation || 'none' === window.getComputedStyle(n).transitionProperty)
            return (
              e.run(() => s()),
              P(void 0).pipe(
                (function Xj(e) {
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
              (function SB(...e) {
                return (n) => Vr(n, P(...e));
              })(!0)
            );
          ba.set(n, {
            transition$: a,
            complete: () => {
              l.next(), l.complete();
            },
            context: i,
          });
          const u = (function Yj(e) {
            const { transitionDelay: n, transitionDuration: t } = window.getComputedStyle(e);
            return 1e3 * (parseFloat(n) + parseFloat(t));
          })(n);
          return (
            e.runOutsideAngular(() => {
              const d = vt(n, 'transitionend').pipe(
                tt(c),
                Ae(({ target: h }) => h === n)
              );
              SC(Gp(u + Zj).pipe(tt(c)), d, l)
                .pipe(tt(c))
                .subscribe(() => {
                  ba.delete(n),
                    e.run(() => {
                      s(), a.next(), a.complete();
                    });
                });
            }),
            a.asObservable()
          );
        },
        dg = (e, n, t) => {
          let { direction: r, maxHeight: i } = t;
          const { classList: o } = e;
          function s() {
            o.add('collapse'), 'show' === r ? o.add('show') : o.remove('show');
          }
          if (n)
            return (
              i ||
                ((i = (function tG(e) {
                  if (typeof navigator > 'u') return '0px';
                  const { classList: n } = e,
                    t = n.contains('show');
                  t || n.add('show'), (e.style.height = '');
                  const r = e.getBoundingClientRect().height + 'px';
                  return t || n.remove('show'), r;
                })(e)),
                (t.maxHeight = i),
                (e.style.height = 'show' !== r ? i : '0px'),
                o.remove('collapse'),
                o.remove('collapsing'),
                o.remove('show'),
                Ho(e),
                o.add('collapsing')),
              (e.style.height = 'show' === r ? i : '0px'),
              () => {
                s(), o.remove('collapsing'), (e.style.height = '');
              }
            );
          s();
        };
      let Da = (() => {
          class e {
            constructor() {
              this.animation = WC.animation;
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
        XC = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        YC = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        eN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        uG = (() => {
          class e {
            constructor(t) {
              this._ngbConfig = t;
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
              return new (t || e)(T(Da));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        dG = (() => {
          class e {
            constructor(t, r, i) {
              (this._element = t),
                (this._zone = i),
                (this.collapsed = !1),
                (this.ngbCollapseChange = new j()),
                (this.shown = new j()),
                (this.hidden = new j()),
                (this.animation = r.animation);
            }
            ngOnInit() {
              this._runTransition(this.collapsed, !1);
            }
            ngOnChanges({ collapsed: t }) {
              t.firstChange || this._runTransitionWithEvents(this.collapsed, this.animation);
            }
            toggle(t = this.collapsed) {
              (this.collapsed = !t),
                this.ngbCollapseChange.next(this.collapsed),
                this._runTransitionWithEvents(this.collapsed, this.animation);
            }
            _runTransition(t, r) {
              return St(this._zone, this._element.nativeElement, dg, {
                animation: r,
                runningTransition: 'stop',
                context: { direction: t ? 'hide' : 'show' },
              });
            }
            _runTransitionWithEvents(t, r) {
              this._runTransition(t, r).subscribe(() => {
                t ? this.hidden.emit() : this.shown.emit();
              });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(De), _(uG), _(me));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbCollapse', '']],
              inputs: { animation: 'animation', collapsed: ['ngbCollapse', 'collapsed'] },
              outputs: { ngbCollapseChange: 'ngbCollapseChange', shown: 'shown', hidden: 'hidden' },
              exportAs: ['ngbCollapse'],
              features: [wt],
            })),
            e
          );
        })(),
        tN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      var ut = (() => {
        return (
          ((e = ut || (ut = {}))[(e.Tab = 9)] = 'Tab'),
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
          ut
        );
        var e;
      })();
      const iu = (e, n) => !!n && n.some((t) => t.contains(e)),
        nN = (e, n) =>
          !n ||
          null !=
            (function Qj(e, n) {
              return !n || typeof e.closest > 'u' ? null : e.closest(n);
            })(e, n),
        vG =
          typeof navigator < 'u' &&
          !!navigator.userAgent &&
          (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
            /Android/.test(navigator.userAgent));
      const rN = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[contenteditable]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');
      function iN(e) {
        const n = Array.from(e.querySelectorAll(rN)).filter((t) => -1 !== t.tabIndex);
        return [n[0], n[n.length - 1]];
      }
      const wG = /\s+/,
        CG = /  +/gi,
        NG = /^start/,
        TG = /^end/,
        EG = /-(top|left)$/,
        SG = /-(bottom|right)$/,
        OG = /^left/,
        AG = /^right/,
        IG = /^start/,
        RG = /^end/;
      function oN({ placement: e, baseClass: n }) {
        let t = Array.isArray(e) ? e : e.split(wG),
          i = t.findIndex((l) => 'auto' === l);
        i >= 0 &&
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
            null == t.find((c) => -1 !== c.search('^' + l)) && t.splice(i++, 1, l);
          });
        const o = t.map((l) =>
          (function MG(e) {
            return e.replace(NG, 'left').replace(TG, 'right').replace(EG, '-start').replace(SG, '-end');
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
                  (f += ` ${(function PG(e, n) {
                    let [t, r] = n.split('-');
                    const i = t.replace(OG, 'start').replace(AG, 'end');
                    let o = [i];
                    if (r) {
                      let s = r;
                      ('left' === t || 'right' === t) && (s = s.replace(IG, 'top').replace(RG, 'bottom')),
                        o.push(`${i}-${s}`);
                    }
                    return e && (o = o.map((s) => `${e}-${s}`)), o.join(' ');
                  })(n, d)}`),
                  (f = f.trim().replace(CG, ' ')),
                  (u.className = f);
              },
            },
            eH,
            iH,
            lH,
            { enabled: !0, name: 'flip', options: { fallbackPlacements: o } },
            { enabled: !0, name: 'preventOverflow', phase: 'main', fn: function () {} },
          ],
        };
      }
      function sN(e) {
        return e;
      }
      function FG(e) {
        return (n) => (n.modifiers.push(RH, { name: 'offset', options: { offset: () => e } }), n);
      }
      new Date(1882, 10, 12), new Date(2174, 10, 25);
      let fN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st, k1] })),
            e
          );
        })(),
        $G = (() => {
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
        mg = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = O({ type: e, selectors: [['', 8, 'navbar']] })),
            e
          );
        })(),
        hN = (() => {
          class e {
            constructor(t, r) {
              (this.elementRef = t), (this._renderer = r), (this._disabled = !1);
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
              return new (t || e)(_(De), _(mn));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbDropdownItem', '']],
              hostAttrs: [1, 'dropdown-item'],
              hostVars: 3,
              hostBindings: function (t, r) {
                2 & t && (_o('tabIndex', r.disabled ? -1 : 0), He('disabled', r.disabled));
              },
              inputs: { disabled: 'disabled' },
            })),
            e
          );
        })(),
        lu = (() => {
          class e {
            constructor(t, r) {
              (this.dropdown = t),
                (this.placement = 'bottom'),
                (this.isOpen = !1),
                (this.nativeElement = r.nativeElement);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Go)), _(De));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbDropdownMenu', '']],
              contentQueries: function (t, r, i) {
                if ((1 & t && ze(i, hN, 4), 2 & t)) {
                  let o;
                  Pe((o = xe())) && (r.menuItems = o);
                }
              },
              hostVars: 4,
              hostBindings: function (t, r) {
                1 & t &&
                  oe('keydown.ArrowUp', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.ArrowDown', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Home', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.End', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Enter', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Space', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Tab', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Shift.Tab', function (o) {
                    return r.dropdown.onKeyDown(o);
                  }),
                  2 & t && He('dropdown-menu', !0)('show', r.dropdown.isOpen());
              },
            })),
            e
          );
        })(),
        cu = (() => {
          class e {
            constructor(t, r) {
              (this.dropdown = t), (this.nativeElement = r.nativeElement);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Go)), _(De));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbDropdownAnchor', '']],
              hostAttrs: [1, 'dropdown-toggle'],
              hostVars: 1,
              hostBindings: function (t, r) {
                2 & t && ve('aria-expanded', r.dropdown.isOpen());
              },
            })),
            e
          );
        })(),
        vg = (() => {
          class e extends cu {
            constructor(t, r) {
              super(t, r);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ae(() => Go)), _(De));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbDropdownToggle', '']],
              hostAttrs: [1, 'dropdown-toggle'],
              hostVars: 1,
              hostBindings: function (t, r) {
                1 & t &&
                  oe('click', function () {
                    return r.dropdown.toggle();
                  })('keydown.ArrowUp', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.ArrowDown', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Home', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.End', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Tab', function (o) {
                    return r.dropdown.onKeyDown(o);
                  })('keydown.Shift.Tab', function (o) {
                    return r.dropdown.onKeyDown(o);
                  }),
                  2 & t && ve('aria-expanded', r.dropdown.isOpen());
              },
              features: [Ee([{ provide: cu, useExisting: ae(() => e) }]), fe],
            })),
            e
          );
        })(),
        Go = (() => {
          class e {
            constructor(t, r, i, o, s, a, l) {
              (this._changeDetector = t),
                (this._document = i),
                (this._ngZone = o),
                (this._elementRef = s),
                (this._renderer = a),
                (this._destroyCloseHandlers$ = new pe()),
                (this._bodyContainer = null),
                (this._positioning = (function xG() {
                  let e = null;
                  return {
                    createPopper(n) {
                      if (!e) {
                        let r = (n.updatePopperOptions || sN)(oN(n));
                        e = OH(n.hostElement, n.targetElement, r);
                      }
                    },
                    update() {
                      e && e.update();
                    },
                    setOptions(n) {
                      if (e) {
                        let r = (n.updatePopperOptions || sN)(oN(n));
                        e.setOptions(r);
                      }
                    },
                    destroy() {
                      e && (e.destroy(), (e = null));
                    },
                  };
                })()),
                (this._open = !1),
                (this.openChange = new j()),
                (this.placement = r.placement),
                (this.container = r.container),
                (this.autoClose = r.autoClose),
                (this.display = l ? 'static' : 'dynamic');
            }
            ngAfterContentInit() {
              this._ngZone.onStable.pipe(we(1)).subscribe(() => {
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
                const { currentValue: r, previousValue: i } = t.dropdownClass;
                this._applyCustomDropdownClass(r, i);
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
                        updatePopperOptions: FG([0, 2]),
                      }),
                        this._applyPlacementClasses(),
                        (this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positionMenu()));
                    })));
            }
            _setCloseHandlers() {
              this._destroyCloseHandlers$.next(),
                (function bG(e, n, t, r, i, o, s, a) {
                  t &&
                    e.runOutsideAngular(
                      ((e) => (vG ? () => setTimeout(() => e(), 100) : e))(() => {
                        const c = vt(n, 'keydown').pipe(
                            tt(i),
                            Ae((f) => f.which === ut.Escape),
                            lt((f) => f.preventDefault())
                          ),
                          u = vt(n, 'mousedown').pipe(
                            L((f) => {
                              const h = f.target;
                              return (
                                2 !== f.button &&
                                !iu(h, s) &&
                                ('inside' === t
                                  ? iu(h, o) && nN(h, a)
                                  : 'outside' === t
                                  ? !iu(h, o)
                                  : nN(h, a) || !iu(h, o))
                              );
                            }),
                            tt(i)
                          ),
                          d = vt(n, 'mouseup').pipe(
                            Yp(u),
                            Ae(([f, h]) => h),
                            pC(0),
                            tt(i)
                          );
                        SC([c.pipe(L((f) => 0)), d.pipe(L((f) => 1))]).subscribe((f) => e.run(() => r(f)));
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
              const r = t.which,
                i = this._getMenuElements();
              let o = -1,
                s = null;
              const a = this._isEventFromToggle(t);
              if (
                (!a &&
                  i.length &&
                  i.forEach((l, c) => {
                    l.contains(t.target) && (s = l), l === this._document.activeElement && (o = c);
                  }),
                r !== ut.Space && r !== ut.Enter)
              ) {
                if (r !== ut.Tab) {
                  if (a || s) {
                    if ((this.open(), i.length)) {
                      switch (r) {
                        case ut.ArrowDown:
                          o = Math.min(o + 1, i.length - 1);
                          break;
                        case ut.ArrowUp:
                          if (this._isDropup() && -1 === o) {
                            o = i.length - 1;
                            break;
                          }
                          o = Math.max(o - 1, 0);
                          break;
                        case ut.Home:
                          o = 0;
                          break;
                        case ut.End:
                          o = i.length - 1;
                      }
                      i[o].focus();
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
                    const l = this._menu.nativeElement.querySelectorAll(rN);
                    t.shiftKey && t.target === l[0]
                      ? (this._anchor.nativeElement.focus(), t.preventDefault())
                      : !t.shiftKey &&
                        t.target === l[l.length - 1] &&
                        (this._anchor.nativeElement.focus(), this.close());
                  } else
                    vt(t.target, 'focusout')
                      .pipe(we(1))
                      .subscribe(({ relatedTarget: l }) => {
                        this._elementRef.nativeElement.contains(l) || this.close();
                      });
                }
              } else
                s &&
                  (!0 === this.autoClose || 'inside' === this.autoClose) &&
                  vt(s, 'click')
                    .pipe(we(1))
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
              return null == t ? [] : t.menuItems.filter((r) => !r.disabled).map((r) => r.elementRef.nativeElement);
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
                const r = this._renderer,
                  i = this._menu.nativeElement,
                  o = (this._bodyContainer = this._bodyContainer || r.createElement('div'));
                r.setStyle(o, 'position', 'absolute'),
                  r.setStyle(i, 'position', 'static'),
                  r.setStyle(o, 'z-index', '1055'),
                  r.appendChild(o, i),
                  r.appendChild(this._document.body, o);
              }
              this._applyCustomDropdownClass(this.dropdownClass);
            }
            _applyCustomDropdownClass(t, r) {
              const i = 'body' === this.container ? this._bodyContainer : this._elementRef.nativeElement;
              i && (r && this._renderer.removeClass(i, r), t && this._renderer.addClass(i, t));
            }
            _applyPlacementClasses(t) {
              const r = this._menu;
              if (r) {
                t || (t = this._getFirstPlacement(this.placement));
                const i = this._renderer,
                  o = this._elementRef.nativeElement;
                i.removeClass(o, 'dropup'), i.removeClass(o, 'dropdown');
                const { nativeElement: s } = r;
                'static' === this.display
                  ? ((r.placement = null), i.setAttribute(s, 'data-bs-popper', 'static'))
                  : ((r.placement = t), i.removeAttribute(s, 'data-bs-popper'));
                const a = -1 !== t.search('^top') ? 'dropup' : 'dropdown';
                i.addClass(o, a);
                const l = this._bodyContainer;
                l && (i.removeClass(l, 'dropup'), i.removeClass(l, 'dropdown'), i.addClass(l, a));
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Tn), _($G), _(Ye), _(me), _(De), _(mn), _(mg, 8));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [['', 'ngbDropdown', '']],
              contentQueries: function (t, r, i) {
                if ((1 & t && (ze(i, lu, 5), ze(i, cu, 5)), 2 & t)) {
                  let o;
                  Pe((o = xe())) && (r._menu = o.first), Pe((o = xe())) && (r._anchor = o.first);
                }
              },
              hostVars: 2,
              hostBindings: function (t, r) {
                2 & t && He('show', r.isOpen());
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
              features: [wt],
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
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      class Ni {
        constructor(n, t, r) {
          (this.nodes = n), (this.viewRef = t), (this.componentRef = r);
        }
      }
      let WG = (() => {
        class e {
          constructor(t, r) {
            (this._el = t), (this._zone = r);
          }
          ngOnInit() {
            this._zone.onStable
              .asObservable()
              .pipe(we(1))
              .subscribe(() => {
                St(
                  this._zone,
                  this._el.nativeElement,
                  (t, r) => {
                    r && Ho(t), t.classList.add('show');
                  },
                  { animation: this.animation, runningTransition: 'continue' }
                );
              });
          }
          hide() {
            return St(this._zone, this._el.nativeElement, ({ classList: t }) => t.remove('show'), {
              animation: this.animation,
              runningTransition: 'stop',
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(De), _(me));
          }),
          (e.ɵcmp = gt({
            type: e,
            selectors: [['ngb-modal-backdrop']],
            hostAttrs: [2, 'z-index', '1055'],
            hostVars: 6,
            hostBindings: function (t, r) {
              2 & t &&
                (ai('modal-backdrop' + (r.backdropClass ? ' ' + r.backdropClass : '')),
                He('show', !r.animation)('fade', r.animation));
            },
            inputs: { animation: 'animation', backdropClass: 'backdropClass' },
            decls: 0,
            vars: 0,
            template: function (t, r) {},
            encapsulation: 2,
          })),
          e
        );
      })();
      class gN {
        close(n) {}
        dismiss(n) {}
      }
      class zG {
        constructor(n, t, r, i) {
          (this._windowCmptRef = n),
            (this._contentRef = t),
            (this._backdropCmptRef = r),
            (this._beforeDismiss = i),
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
              !(function $C(e) {
                return e && e.then;
              })(t)
                ? !1 !== t && this._dismiss(n)
                : t.then(
                    (r) => {
                      !1 !== r && this._dismiss(n);
                    },
                    () => {}
                  );
            } else this._dismiss(n);
        }
        _removeModalElements() {
          const n = this._windowCmptRef.instance.hide(),
            t = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : P(void 0);
          n.subscribe(() => {
            const { nativeElement: r } = this._windowCmptRef.location;
            r.parentNode.removeChild(r),
              this._windowCmptRef.destroy(),
              this._contentRef && this._contentRef.viewRef && this._contentRef.viewRef.destroy(),
              (this._windowCmptRef = null),
              (this._contentRef = null);
          }),
            t.subscribe(() => {
              if (this._backdropCmptRef) {
                const { nativeElement: r } = this._backdropCmptRef.location;
                r.parentNode.removeChild(r), this._backdropCmptRef.destroy(), (this._backdropCmptRef = null);
              }
            }),
            Yc(n, t).subscribe(() => {
              this._hidden.next(), this._hidden.complete();
            });
        }
      }
      var Ta = (() => {
        return ((e = Ta || (Ta = {}))[(e.BACKDROP_CLICK = 0)] = 'BACKDROP_CLICK'), (e[(e.ESC = 1)] = 'ESC'), Ta;
        var e;
      })();
      let KG = (() => {
          class e {
            constructor(t, r, i) {
              (this._document = t),
                (this._elRef = r),
                (this._zone = i),
                (this._closed$ = new pe()),
                (this._elWithFocus = null),
                (this.backdrop = !0),
                (this.keyboard = !0),
                (this.dismissEvent = new j()),
                (this.shown = new pe()),
                (this.hidden = new pe());
            }
            get fullscreenClass() {
              return !0 === this.fullscreen
                ? ' modal-fullscreen'
                : cg(this.fullscreen)
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
                  .pipe(we(1))
                  .subscribe(() => {
                    this._show();
                  });
            }
            ngOnDestroy() {
              this._disableEventHandling();
            }
            hide() {
              const { nativeElement: t } = this._elRef,
                r = { animation: this.animation, runningTransition: 'stop' },
                s = Yc(
                  St(this._zone, t, () => t.classList.remove('show'), r),
                  St(this._zone, this._dialogEl.nativeElement, () => {}, r)
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
              Yc(
                St(
                  this._zone,
                  this._elRef.nativeElement,
                  (o, s) => {
                    s && Ho(o), o.classList.add('show');
                  },
                  t
                ),
                St(this._zone, this._dialogEl.nativeElement, () => {}, t)
              ).subscribe(() => {
                this.shown.next(), this.shown.complete();
              }),
                this._enableEventHandling(),
                this._setFocus();
            }
            _enableEventHandling() {
              const { nativeElement: t } = this._elRef;
              this._zone.runOutsideAngular(() => {
                vt(t, 'keydown')
                  .pipe(
                    tt(this._closed$),
                    Ae((i) => i.which === ut.Escape)
                  )
                  .subscribe((i) => {
                    this.keyboard
                      ? requestAnimationFrame(() => {
                          i.defaultPrevented || this._zone.run(() => this.dismiss(Ta.ESC));
                        })
                      : 'static' === this.backdrop && this._bumpBackdrop();
                  });
                let r = !1;
                vt(this._dialogEl.nativeElement, 'mousedown')
                  .pipe(
                    tt(this._closed$),
                    lt(() => (r = !1)),
                    at(() => vt(t, 'mouseup').pipe(tt(this._closed$), we(1))),
                    Ae(({ target: i }) => t === i)
                  )
                  .subscribe(() => {
                    r = !0;
                  }),
                  vt(t, 'click')
                    .pipe(tt(this._closed$))
                    .subscribe(({ target: i }) => {
                      t === i &&
                        ('static' === this.backdrop
                          ? this._bumpBackdrop()
                          : !0 === this.backdrop && !r && this._zone.run(() => this.dismiss(Ta.BACKDROP_CLICK))),
                        (r = !1);
                    });
              });
            }
            _disableEventHandling() {
              this._closed$.next();
            }
            _setFocus() {
              const { nativeElement: t } = this._elRef;
              if (!t.contains(document.activeElement)) {
                const r = t.querySelector('[ngbAutofocus]'),
                  i = iN(t)[0];
                (r || i || t).focus();
              }
            }
            _restoreFocus() {
              const t = this._document.body,
                r = this._elWithFocus;
              let i;
              (i = r && r.focus && t.contains(r) ? r : t),
                this._zone.runOutsideAngular(() => {
                  setTimeout(() => i.focus()), (this._elWithFocus = null);
                });
            }
            _bumpBackdrop() {
              'static' === this.backdrop &&
                St(
                  this._zone,
                  this._elRef.nativeElement,
                  ({ classList: t }) => (t.add('modal-static'), () => t.remove('modal-static')),
                  { animation: this.animation, runningTransition: 'continue' }
                );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ye), _(De), _(me));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [['ngb-modal-window']],
              viewQuery: function (t, r) {
                if (
                  (1 & t &&
                    (function qf(e, n, t) {
                      const r = re();
                      r.firstCreatePass && (U0(r, new H0(e, n, t), -1), 2 == (2 & n) && (r.staticViewQueries = !0)),
                        G0(r, w(), n);
                    })(ij, 7),
                  2 & t)
                ) {
                  let i;
                  Pe((i = xe())) && (r._dialogEl = i.first);
                }
              },
              hostAttrs: ['role', 'dialog', 'tabindex', '-1'],
              hostVars: 7,
              hostBindings: function (t, r) {
                2 & t &&
                  (ve('aria-modal', !0)('aria-labelledby', r.ariaLabelledBy)('aria-describedby', r.ariaDescribedBy),
                  ai('modal d-block' + (r.windowClass ? ' ' + r.windowClass : '')),
                  He('fade', r.animation));
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
              ngContentSelectors: HH,
              decls: 4,
              vars: 2,
              consts: [
                ['role', 'document'],
                ['dialog', ''],
                [1, 'modal-content'],
              ],
              template: function (t, r) {
                1 & t &&
                  ((function ly(e) {
                    const n = w()[16][6];
                    if (!n.projection) {
                      const r = (n.projection = is(e ? e.length : 1, null)),
                        i = r.slice();
                      let o = n.child;
                      for (; null !== o; ) {
                        const s = e ? $A(o, e) : 0;
                        null !== s && (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o)), (o = o.next);
                      }
                    }
                  })(),
                  N(0, 'div', 0, 1)(2, 'div', 2),
                  (function cy(e, n = 0, t) {
                    const r = w(),
                      i = re(),
                      o = ro(i, 22 + e, 16, null, t || null);
                    null === o.projection && (o.projection = n),
                      Gu(),
                      64 != (64 & o.flags) &&
                        (function iO(e, n, t) {
                          Xm(n[Y], 0, n, t, Hm(e, t, n), $m(t.parent || n[6], t, n));
                        })(i, r, o);
                  })(3),
                  E()()),
                  2 & t &&
                    ai(
                      'modal-dialog' +
                        (r.size ? ' modal-' + r.size : '') +
                        (r.centered ? ' modal-dialog-centered' : '') +
                        r.fullscreenClass +
                        (r.scrollable ? ' modal-dialog-scrollable' : '') +
                        (r.modalDialogClass ? ' ' + r.modalDialogClass : '')
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
        qG = (() => {
          class e {
            constructor(t) {
              this._document = t;
            }
            hide() {
              const t = Math.abs(window.innerWidth - this._document.documentElement.clientWidth),
                r = this._document.body,
                i = r.style,
                { overflow: o, paddingRight: s } = i;
              if (t > 0) {
                const a = parseFloat(window.getComputedStyle(r).paddingRight);
                i.paddingRight = `${a + t}px`;
              }
              return (
                (i.overflow = 'hidden'),
                () => {
                  t > 0 && (i.paddingRight = s), (i.overflow = o);
                }
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(Ye));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        QG = (() => {
          class e {
            constructor(t, r, i, o, s, a) {
              (this._applicationRef = t),
                (this._injector = r),
                (this._document = i),
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
                (this._activeInstances = new j()),
                this._activeWindowCmptHasChanged.subscribe(() => {
                  if (this._windowCmpts.length) {
                    const l = this._windowCmpts[this._windowCmpts.length - 1];
                    ((e, n, t, r = !1) => {
                      this._ngZone.runOutsideAngular(() => {
                        const i = vt(n, 'focusin').pipe(
                          tt(t),
                          L((o) => o.target)
                        );
                        vt(n, 'keydown')
                          .pipe(
                            tt(t),
                            Ae((o) => o.which === ut.Tab),
                            Yp(i)
                          )
                          .subscribe(([o, s]) => {
                            const [a, l] = iN(n);
                            (s === a || s === n) && o.shiftKey && (l.focus(), o.preventDefault()),
                              s === l && !o.shiftKey && (a.focus(), o.preventDefault());
                          }),
                          r &&
                            vt(n, 'click')
                              .pipe(
                                tt(t),
                                Yp(i),
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
            open(t, r, i) {
              const o =
                  i.container instanceof HTMLElement
                    ? i.container
                    : bi(i.container)
                    ? this._document.querySelector(i.container)
                    : this._document.body,
                s = this._rendererFactory.createRenderer(null, null);
              if (!o)
                throw new Error(`The specified modal container "${i.container || 'body'}" was not found in the DOM.`);
              this._hideScrollBar();
              const a = new gN(),
                l = this._getContentRef(i.injector || t, r, a, i);
              let c = !1 !== i.backdrop ? this._attachBackdrop(o) : void 0,
                u = this._attachWindowComponent(o, l.nodes),
                d = new zG(u, l, c, i.beforeDismiss);
              return (
                this._registerModalRef(d),
                this._registerWindowCmpt(u),
                d.hidden.pipe(we(1)).subscribe(() =>
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
                this._applyWindowOptions(u.instance, i),
                1 === this._modalRefs.length && s.addClass(this._document.body, 'modal-open'),
                c && c.instance && (this._applyBackdropOptions(c.instance, i), c.changeDetectorRef.detectChanges()),
                u.changeDetectorRef.detectChanges(),
                d
              );
            }
            get activeInstances() {
              return this._activeInstances;
            }
            dismissAll(t) {
              this._modalRefs.forEach((r) => r.dismiss(t));
            }
            hasOpenModals() {
              return this._modalRefs.length > 0;
            }
            _attachBackdrop(t) {
              let r = hh(WG, { environmentInjector: this._applicationRef.injector, elementInjector: this._injector });
              return this._applicationRef.attachView(r.hostView), t.appendChild(r.location.nativeElement), r;
            }
            _attachWindowComponent(t, r) {
              let i = hh(KG, {
                environmentInjector: this._applicationRef.injector,
                elementInjector: this._injector,
                projectableNodes: r,
              });
              return this._applicationRef.attachView(i.hostView), t.appendChild(i.location.nativeElement), i;
            }
            _applyWindowOptions(t, r) {
              this._windowAttributes.forEach((i) => {
                bi(r[i]) && (t[i] = r[i]);
              });
            }
            _applyBackdropOptions(t, r) {
              this._backdropAttributes.forEach((i) => {
                bi(r[i]) && (t[i] = r[i]);
              });
            }
            _getContentRef(t, r, i, o) {
              return r
                ? r instanceof Ge
                  ? this._createFromTemplateRef(r, i)
                  : cg(r)
                  ? this._createFromString(r)
                  : this._createFromComponent(t, r, i, o)
                : new Ni([]);
            }
            _createFromTemplateRef(t, r) {
              const o = t.createEmbeddedView({
                $implicit: r,
                close(s) {
                  r.close(s);
                },
                dismiss(s) {
                  r.dismiss(s);
                },
              });
              return this._applicationRef.attachView(o), new Ni([o.rootNodes], o);
            }
            _createFromString(t) {
              const r = this._document.createTextNode(`${t}`);
              return new Ni([[r]]);
            }
            _createFromComponent(t, r, i, o) {
              const s = _t.create({ providers: [{ provide: gN, useValue: i }], parent: t }),
                a = hh(r, { environmentInjector: this._applicationRef.injector, elementInjector: s }),
                l = a.location.nativeElement;
              return (
                o.scrollable && l.classList.add('component-host-scrollable'),
                this._applicationRef.attachView(a.hostView),
                new Ni([[l]], a.hostView, a)
              );
            }
            _setAriaHidden(t) {
              const r = t.parentElement;
              r &&
                t !== this._document.body &&
                (Array.from(r.children).forEach((i) => {
                  i !== t &&
                    'SCRIPT' !== i.nodeName &&
                    (this._ariaHiddenValues.set(i, i.getAttribute('aria-hidden')),
                    i.setAttribute('aria-hidden', 'true'));
                }),
                this._setAriaHidden(r));
            }
            _revertAriaHidden() {
              this._ariaHiddenValues.forEach((t, r) => {
                t ? r.setAttribute('aria-hidden', t) : r.removeAttribute('aria-hidden');
              }),
                this._ariaHiddenValues.clear();
            }
            _registerModalRef(t) {
              const r = () => {
                const i = this._modalRefs.indexOf(t);
                i > -1 && (this._modalRefs.splice(i, 1), this._activeInstances.emit(this._modalRefs));
              };
              this._modalRefs.push(t), this._activeInstances.emit(this._modalRefs), t.result.then(r, r);
            }
            _registerWindowCmpt(t) {
              this._windowCmpts.push(t),
                this._activeWindowCmptHasChanged.next(),
                t.onDestroy(() => {
                  const r = this._windowCmpts.indexOf(t);
                  r > -1 && (this._windowCmpts.splice(r, 1), this._activeWindowCmptHasChanged.next());
                });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(No), T(_t), T(Ye), T(qG), T(wd), T(me));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        XG = (() => {
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
              return new (t || e)(T(Da));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        YG = (() => {
          class e {
            constructor(t, r, i) {
              (this._injector = t), (this._modalStack = r), (this._config = i);
            }
            open(t, r = {}) {
              const i = { ...this._config, animation: this._config.animation, ...r };
              return this._modalStack.open(this._injector, t, i);
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
              return new (t || e)(T(_t), T(QG), T(XG));
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
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ providers: [YG] })),
            e
          );
        })(),
        bN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        MN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        AN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        IN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        RN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        PN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        xN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        FN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      new k('live announcer delay', {
        providedIn: 'root',
        factory: function uU() {
          return 100;
        },
      });
      let kN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st] })),
            e
          );
        })(),
        LN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({})),
            e
          );
        })();
      const dU = [XC, YC, eN, tN, fN, pN, _N, bN, LN, MN, AN, IN, RN, PN, xN, FN, kN];
      let uu = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({ imports: [dU, XC, YC, eN, tN, fN, pN, _N, bN, LN, MN, AN, IN, RN, PN, xN, FN, kN] })),
          e
        );
      })();
      const wr_production = !0,
        wr_version = '1.0.0',
        wr_serverUrl = 'https://api.chucknorris.io',
        wr_defaultLanguage = 'en-US',
        wr_supportedLanguages = ['en-US', 'fr-FR'];
      let VN = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [mi, st] })),
            e
          );
        })(),
        fU = (() => {
          class e {
            intercept(t, r) {
              return /^(http|https):/i.test(t.url) || (t = t.clone({ url: wr_serverUrl + t.url })), r.handle(t);
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
      var Cr = (() => {
        return (
          ((e = Cr || (Cr = {}))[(e.Off = 0)] = 'Off'),
          (e[(e.Error = 1)] = 'Error'),
          (e[(e.Warning = 2)] = 'Warning'),
          (e[(e.Info = 3)] = 'Info'),
          (e[(e.Debug = 4)] = 'Debug'),
          Cr
        );
        var e;
      })();
      class un {
        constructor(n) {
          this.source = n;
        }
        static enableProductionMode() {
          un.level = Cr.Warning;
        }
        debug(...n) {
          this.log(console.log, Cr.Debug, n);
        }
        info(...n) {
          this.log(console.info, Cr.Info, n);
        }
        warn(...n) {
          this.log(console.warn, Cr.Warning, n);
        }
        error(...n) {
          this.log(console.error, Cr.Error, n);
        }
        log(n, t, r) {
          if (t <= un.level) {
            const i = this.source ? ['[' + this.source + ']'].concat(r) : r;
            n.apply(console, i), un.outputs.forEach((o) => o.apply(o, [this.source, t, ...r]));
          }
        }
      }
      (un.level = Cr.Debug), (un.outputs = []);
      const hU = new un('ErrorHandlerInterceptor');
      let pU = (() => {
          class e {
            intercept(t, r) {
              return r.handle(t).pipe(Kn((i) => this.errorHandler(i)));
            }
            errorHandler(t) {
              throw (wr_production || hU.error('Request error', t), t);
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
        gU = (() => {
          class e extends Op {
            shouldDetach(t) {
              return !1;
            }
            store(t, r) {}
            shouldAttach(t) {
              return !1;
            }
            retrieve(t) {
              return null;
            }
            shouldReuseRoute(t, r) {
              return (
                t.routeConfig === r.routeConfig ||
                Boolean(t.routeConfig?.component && t.routeConfig?.component === r.routeConfig?.component)
              );
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = Qe(e)))(r || e);
              };
            })()),
            (e.ɵprov = M({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const _U = Ba,
        vU = Symbol('__destroy'),
        BN = Symbol('__decoratorApplied');
      function HN(e) {
        return 'string' == typeof e ? Symbol(`__destroy__${e}`) : vU;
      }
      function jN(e, n) {
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
            GN(this, HN()),
            n.arrayName &&
              (function bU(e) {
                Array.isArray(e) && e.forEach(UN);
              })(this[n.arrayName]),
            n.checkProperties)
          )
            for (const t in this) n.blackList?.includes(t) || UN(this[t]);
        };
      }
      function WN(e = {}) {
        return (n) => {
          !(function mU(e) {
            return !!e[_U];
          })(n)
            ? (function DU(e, n) {
                e.prototype.ngOnDestroy = $N(e.prototype.ngOnDestroy, n);
              })(n, e)
            : (function wU(e, n) {
                const t = e.ɵpipe;
                t.onDestroy = $N(t.onDestroy, n);
              })(n, e),
            (function yU(e) {
              e.prototype[BN] = !0;
            })(n);
        };
      }
      function QN(e, n) {
        return (t) => {
          const r = HN(n);
          return (
            'string' == typeof n
              ? (function TU(e, n, t) {
                  const r = e[n];
                  jN(e, t),
                    (e[n] = function () {
                      r.apply(this, arguments), GN(this, t), (e[n] = r);
                    });
                })(e, n, r)
              : jN(e, r),
            t.pipe(tt(e[r]))
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
          (e.ɵmod = q({ type: e })),
          (e.ɵinj = K({ imports: [st, mi, uu] })),
          e
        );
      })();
      const EU = JSON.parse(
          '{"APP_NAME":"ngX-Rocket","About":"About","Hello world !":"Hello world !","Home":"Home","Logged in as":"Logged in as","Login":"Login","Logout":"Logout","Password":"Password","Password is required":"Password is required","Username":"Username","Username is required":"Username is required","Username or password incorrect.":"Username or password incorrect.","Remember me":"Remember me","Version":"Version"}'
        ),
        SU = JSON.parse(
          '{"APP_NAME":"ngX-Rocket","About":"A propos","Hello world !":"Bonjour le monde !","Home":"Accueil","Logged in as":"Connect\xe9 en tant que","Login":"Connexion","Logout":"D\xe9connexion","Password":"Mot de passe","Password is required":"Mot de passe requis","Username":"Identifiant","Username is required":"Identifiant requis","Username or password incorrect.":"Identifiant ou mot de passe incorrect.","Remember me":"Rester connect\xe9","Version":"Version"}'
        ),
        MU = new un('I18nService'),
        YN = 'language';
      let JN = (() => {
        class e {
          constructor(t) {
            (this.translateService = t), t.setTranslation('en-US', EU), t.setTranslation('fr-FR', SU);
          }
          init(t, r) {
            (this.defaultLanguage = t),
              (this.supportedLanguages = r),
              (this.language = ''),
              (this.langChangeSubscription = this.translateService.onLangChange.subscribe((i) => {
                localStorage.setItem(YN, i.lang);
              }));
          }
          destroy() {
            this.langChangeSubscription && this.langChangeSubscription.unsubscribe();
          }
          set language(t) {
            let r = t || localStorage.getItem(YN) || this.translateService.getBrowserCultureLang() || '',
              i = this.supportedLanguages.includes(r);
            r &&
              !i &&
              ((r = r.split('-')[0]),
              (r = this.supportedLanguages.find((o) => o.startsWith(r)) || ''),
              (i = Boolean(r))),
              (!r || !i) && (r = this.defaultLanguage),
              MU.debug(`Language set to ${(t = r)}`),
              this.translateService.use(t);
          }
          get language() {
            return this.translateService.currentLang;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(Fo));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      function OU(e, n) {
        if ((1 & e && (N(0, 'a', 5), m(1), Fs(2, 'translate'), E()), 2 & e)) {
          const t = ue();
          F(1), Un('\n    ', ks(2, 1, t.currentLanguage), '\n  ');
        }
      }
      function AU(e, n) {
        if ((1 & e && (m(0, '\n    '), N(1, 'button', 6), m(2), E(), m(3, '\n  ')), 2 & e)) {
          const t = ue();
          F(2), Un('\n      ', t.currentLanguage, '\n    ');
        }
      }
      function IU(e, n) {
        if (1 & e) {
          const t = (function bn() {
            return w();
          })();
          N(0, 'button', 7),
            oe('click', function () {
              const o = (function gn(e) {
                return ($.lFrame.contextLView = e), e[8];
              })(t).$implicit;
              return (function _n(e) {
                return ($.lFrame.contextLView = null), e;
              })(ue().setLanguage(o));
            }),
            m(1),
            Fs(2, 'translate'),
            E();
        }
        if (2 & e) {
          const t = n.$implicit;
          F(1), Un('\n      ', ks(2, 1, t), '\n    ');
        }
      }
      const RU = function (e) {
        return { 'nav-item': e };
      };
      let ZN = (() => {
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
          (e.ɵcmp = gt({
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
            template: function (t, r) {
              if (
                (1 & t &&
                  (N(0, 'div', 0),
                  m(1, '\n  '),
                  J(2, OU, 3, 3, 'a', 1),
                  m(3, '\n  '),
                  J(4, AU, 4, 1, 'ng-template', null, 2, $n),
                  m(6, '\n  '),
                  N(7, 'div', 3),
                  m(8, '\n    '),
                  J(9, IU, 3, 3, 'button', 4),
                  m(10, '\n  '),
                  E(),
                  m(11, '\n'),
                  E(),
                  m(12, '\n')),
                2 & t)
              ) {
                const i = (function Hn(e) {
                  return Vi(
                    (function SE() {
                      return $.lFrame.contextLView;
                    })(),
                    22 + e
                  );
                })(5);
                H(
                  'ngClass',
                  (function Rs(e, n, t, r) {
                    return R0(w(), It(), e, n, t, r);
                  })(5, RU, r.inNavbar)
                ),
                  F(2),
                  H('ngIf', r.inNavbar)('ngIfElse', i),
                  F(5),
                  H('ngClass', r.menuClass),
                  F(2),
                  H('ngForOf', r.languages);
              }
            },
            dependencies: [Zb, To, Eo, Go, vg, lu, TC],
            styles: ['.nav-link.dropdown-toggle[_ngcontent-%COMP%]{cursor:pointer}'],
          })),
          e
        );
      })();
      const Ea = 'credentials';
      let wg = (() => {
          class e {
            constructor() {
              this._credentials = null;
              const t = sessionStorage.getItem(Ea) || localStorage.getItem(Ea);
              t && (this._credentials = JSON.parse(t));
            }
            isAuthenticated() {
              return !!this.credentials;
            }
            get credentials() {
              return this._credentials;
            }
            setCredentials(t, r) {
              (this._credentials = t || null),
                t
                  ? (r ? localStorage : sessionStorage).setItem(Ea, JSON.stringify(t))
                  : (sessionStorage.removeItem(Ea), localStorage.removeItem(Ea));
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
        eT = (() => {
          class e {
            constructor(t) {
              this.credentialsService = t;
            }
            login(t) {
              const r = { username: t.username, token: '123456' };
              return this.credentialsService.setCredentials(r, t.remember), P(r);
            }
            logout() {
              return this.credentialsService.setCredentials(), P(!0);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(wg));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })();
      const tT = new un('Login');
      let Ti = class {
        constructor(n, t, r, i) {
          (this.router = n),
            (this.route = t),
            (this.formBuilder = r),
            (this.authenticationService = i),
            (this.version = wr_version),
            (this.isLoading = !1),
            this.createForm();
        }
        ngOnInit() {}
        login() {
          (this.isLoading = !0),
            this.authenticationService
              .login(this.loginForm.value)
              .pipe(
                Js(() => {
                  this.loginForm.markAsPristine(), (this.isLoading = !1);
                }),
                QN(this)
              )
              .subscribe(
                (t) => {
                  tT.debug(`${t.username} successfully logged in`),
                    this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: !0 });
                },
                (t) => {
                  tT.debug(`Login error: ${t}`), (this.error = t);
                }
              );
        }
        createForm() {
          this.loginForm = this.formBuilder.group({
            username: ['', ID.required],
            password: ['', ID.required],
            remember: !0,
          });
        }
      };
      (Ti.ɵfac = function (n) {
        return new (n || Ti)(_(ct), _(jr), _(yL), _(eT));
      }),
        (Ti.ɵcmp = gt({
          type: Ti,
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
              (N(0, 'div', 0),
              m(1, '\n  '),
              N(2, 'div', 1),
              m(3, '\n    '),
              N(4, 'h1', 2),
              m(5, 'APP_NAME'),
              E(),
              m(6, '\n    '),
              N(7, 'div'),
              m(8, '\n      '),
              N(9, 'h6', 3),
              m(10),
              E(),
              m(11, '\n      '),
              N(12, 'div', 4),
              m(13, '\n        '),
              Oe(14, 'app-language-selector'),
              m(15, '\n      '),
              E(),
              m(16, '\n    '),
              E(),
              m(17, '\n    '),
              N(18, 'div', 5),
              m(19, '\n      '),
              N(20, 'div', 6),
              m(21, '\n        '),
              N(22, 'div', 7),
              m(23, '\n          '),
              N(24, 'h4', 8),
              m(25, '\n            '),
              Oe(26, 'i', 9),
              m(27, '\n          '),
              E(),
              m(28, '\n          '),
              N(29, 'form', 10),
              oe('ngSubmit', function () {
                return t.login();
              }),
              m(30, '\n            '),
              N(31, 'div', 11),
              m(32, '\n              Username or password incorrect.\n            '),
              E(),
              m(33, '\n            '),
              N(34, 'div', 12),
              m(35, '\n              '),
              N(36, 'label', 13),
              m(37, '\n                '),
              Oe(38, 'input', 14),
              Fs(39, 'translate'),
              m(40, '\n                '),
              N(41, 'span', 15),
              m(42, 'Username'),
              E(),
              m(43, '\n                '),
              N(44, 'small', 16),
              m(45, '\n                  Username is required\n                '),
              E(),
              m(46, '\n              '),
              E(),
              m(47, '\n              '),
              N(48, 'label', 17),
              m(49, '\n                '),
              Oe(50, 'input', 18),
              Fs(51, 'translate'),
              m(52, '\n                '),
              N(53, 'span', 15),
              m(54, 'Password'),
              E(),
              m(55, '\n                '),
              N(56, 'small', 16),
              m(57, '\n                  Password is required\n                '),
              E(),
              m(58, '\n              '),
              E(),
              m(59, '\n              '),
              N(60, 'div', 19),
              m(61, '\n                '),
              N(62, 'label', 20),
              m(63, '\n                  '),
              Oe(64, 'input', 21),
              m(65, '\n                  '),
              N(66, 'span', 2),
              m(67, 'Remember me'),
              E(),
              m(68, '\n                '),
              E(),
              m(69, '\n              '),
              E(),
              m(70, '\n            '),
              E(),
              m(71, '\n            '),
              N(72, 'div', 12),
              m(73, '\n              '),
              N(74, 'button', 22),
              m(75, '\n                '),
              Oe(76, 'i', 23),
              m(77, '\n                '),
              N(78, 'span', 2),
              m(79, 'Login'),
              E(),
              m(80, '\n              '),
              E(),
              m(81, '\n            '),
              E(),
              m(82, '\n          '),
              E(),
              m(83, '\n        '),
              E(),
              m(84, '\n      '),
              E(),
              m(85, '\n    '),
              E(),
              m(86, '\n  '),
              E(),
              m(87, '\n'),
              E(),
              m(88, '\n')),
              2 & n &&
                (F(10),
                Un('v', t.version, ''),
                F(19),
                H('formGroup', t.loginForm),
                F(2),
                H('hidden', !t.error || t.isLoading),
                F(7),
                H('placeholder', ks(39, 9, 'Username')),
                F(6),
                H('hidden', t.loginForm.controls.username.valid || t.loginForm.controls.username.untouched),
                F(6),
                H('placeholder', ks(51, 11, 'Password')),
                F(6),
                H('hidden', t.loginForm.controls.password.valid || t.loginForm.controls.password.untouched),
                F(18),
                H('disabled', t.loginForm.invalid || t.isLoading),
                F(2),
                H('hidden', !t.isLoading));
          },
          dependencies: [m1, ic, Hh, e1, t1, mc, _c, np, Xc, ZN, TC],
          styles: [
            '.login-container[_ngcontent-%COMP%]{position:absolute;inset:0}.login-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;min-height:100%}.ng-invalid.ng-touched[_ngcontent-%COMP%]:not(form){border-left:4px solid theme-color("danger")}.container[_ngcontent-%COMP%]{width:100%}',
          ],
        })),
        (Ti = kg([WN()], Ti));
      const PU = [{ path: 'login', component: Ti, data: { title: 'Login' } }];
      let xU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [Qn.forChild(PU), Qn] })),
            e
          );
        })(),
        nT = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st, L1, mi, uu, XN, xU] })),
            e
          );
        })();
      const FU = new un('AuthenticationGuard');
      let kU = (() => {
        class e {
          constructor(t, r) {
            (this.router = t), (this.credentialsService = r);
          }
          canActivate(t, r) {
            return (
              !!this.credentialsService.isAuthenticated() ||
              (FU.debug('Not authenticated, redirecting and adding redirect url...'),
              this.router.navigate(['/login'], { queryParams: { redirect: r.url }, replaceUrl: !0 }),
              !1)
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(T(ct), T(wg));
          }),
          (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      let VU = (() => {
          class e {
            constructor(t) {
              this.httpClient = t;
            }
            getRandomQuote(t) {
              return this.httpClient.get(((e) => `/jokes/random?category=${e.category}`)(t)).pipe(
                L((r) => r.value),
                Kn(() => P('Error, could not load joke :-('))
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(T(sC));
            }),
            (e.ɵprov = M({ token: e, factory: e.ɵfac, providedIn: 'root' })),
            e
          );
        })(),
        BU = (() => {
          class e {
            constructor() {
              this.isLoading = !1;
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [['app-loader']],
              inputs: { isLoading: 'isLoading', message: 'message' },
              decls: 8,
              vars: 2,
              consts: [
                [1, 'text-xs-center', 3, 'hidden'],
                [1, 'fas', 'fa-cog', 'fa-spin', 'fa-3x'],
              ],
              template: function (t, r) {
                1 & t &&
                  (N(0, 'div', 0),
                  m(1, '\n  '),
                  Oe(2, 'i', 1),
                  m(3, ' '),
                  N(4, 'span'),
                  m(5),
                  E(),
                  m(6, '\n'),
                  E(),
                  m(7, '\n')),
                  2 & t && (H('hidden', !r.isLoading), F(5), Ss(r.message));
              },
              styles: ['.fa[_ngcontent-%COMP%]{vertical-align:middle}'],
            })),
            e
          );
        })(),
        HU = (() => {
          class e {
            constructor(t) {
              (this.quoteService = t), (this.isLoading = !1);
            }
            ngOnInit() {
              (this.isLoading = !0),
                this.quoteService
                  .getRandomQuote({ category: 'dev' })
                  .pipe(
                    Js(() => {
                      this.isLoading = !1;
                    })
                  )
                  .subscribe((t) => {
                    this.quote = t;
                  });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(VU));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [['app-home']],
              decls: 19,
              vars: 3,
              consts: [
                [1, 'container-fluid'],
                [1, 'jumbotron', 'text-center'],
                ['src', 'assets/ngx-rocket-logo.png', 'alt', 'angular logo', 1, 'logo'],
                ['translate', ''],
                [3, 'isLoading'],
                [3, 'hidden'],
              ],
              template: function (t, r) {
                1 & t &&
                  (N(0, 'div', 0),
                  m(1, '\n  '),
                  N(2, 'div', 1),
                  m(3, '\n    '),
                  N(4, 'h1'),
                  m(5, '\n      '),
                  Oe(6, 'img', 2),
                  m(7, '\n      '),
                  N(8, 'span', 3),
                  m(9, 'Hello world !'),
                  E(),
                  m(10, '\n    '),
                  E(),
                  m(11, '\n    '),
                  Oe(12, 'app-loader', 4),
                  m(13, '\n    '),
                  N(14, 'q', 5),
                  m(15),
                  E(),
                  m(16, '\n  '),
                  E(),
                  m(17, '\n'),
                  E(),
                  m(18, '\n')),
                  2 & t && (F(12), H('isLoading', r.isLoading), F(2), H('hidden', r.isLoading), F(1), Ss(r.quote));
              },
              dependencies: [Xc, BU],
              styles: [
                '@charset "UTF-8";.logo[_ngcontent-%COMP%]{width:100px}q[_ngcontent-%COMP%]{font-style:italic;font-size:1.2rem;quotes:"\\ab  " " \\bb"}',
              ],
            })),
            e
          );
        })(),
        jU = (() => {
          class e {
            constructor(t, r, i) {
              (this.router = t),
                (this.authenticationService = r),
                (this.credentialsService = i),
                (this.menuHidden = !0);
            }
            ngOnInit() {}
            toggleMenu() {
              this.menuHidden = !this.menuHidden;
            }
            logout() {
              this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: !0 }));
            }
            get username() {
              const t = this.credentialsService.credentials;
              return t ? t.username : null;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(ct), _(eT), _(wg));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [['app-header']],
              decls: 69,
              vars: 4,
              consts: [
                [1, 'navbar', 'navbar-expand-lg', 'navbar-dark', 'bg-dark'],
                [1, 'container-fluid'],
                ['href', 'https://github.com/ngx-rocket', 'translate', '', 1, 'navbar-brand'],
                [
                  'type',
                  'button',
                  'aria-controls',
                  'navbar-menu',
                  'aria-label',
                  'Toggle navigation',
                  1,
                  'navbar-toggler',
                  3,
                  'click',
                ],
                [1, 'navbar-toggler-icon'],
                ['id', 'navbar-menu', 1, 'collapse', 'navbar-collapse', 'float-xs-none', 3, 'ngbCollapse'],
                [1, 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0'],
                ['routerLink', '/home', 'routerLinkActive', 'active', 1, 'nav-item', 'nav-link', 'text-uppercase'],
                [1, 'fas', 'fa-home'],
                ['translate', ''],
                ['routerLink', '/about', 'routerLinkActive', 'active', 1, 'nav-item', 'nav-link', 'text-uppercase'],
                [1, 'fas', 'fa-question-circle'],
                [1, 'navbar-nav', 'ml-auto'],
                [3, 'inNavbar'],
                ['ngbDropdown', '', 'display', 'dynamic', 1, 'nav-item'],
                ['id', 'user-dropdown', 'ngbDropdownToggle', '', 1, 'nav-link'],
                [1, 'fas', 'fa-user-circle'],
                ['ngbDropdownMenu', '', 'aria-labelledby', 'user-dropdown'],
                [1, 'dropdown-header'],
                [1, 'dropdown-divider'],
                ['translate', '', 1, 'dropdown-item', 3, 'click'],
              ],
              template: function (t, r) {
                1 & t &&
                  (N(0, 'header'),
                  m(1, '\n  '),
                  N(2, 'nav', 0),
                  m(3, '\n    '),
                  N(4, 'div', 1),
                  m(5, '\n      '),
                  N(6, 'a', 2),
                  m(7, 'APP_NAME'),
                  E(),
                  m(8, '\n      '),
                  N(9, 'button', 3),
                  oe('click', function () {
                    return r.toggleMenu();
                  }),
                  m(10, '\n        '),
                  Oe(11, 'span', 4),
                  m(12, '\n      '),
                  E(),
                  m(13, '\n      '),
                  N(14, 'div', 5),
                  m(15, '\n        '),
                  N(16, 'div', 6),
                  m(17, '\n          '),
                  N(18, 'a', 7),
                  m(19, '\n            '),
                  Oe(20, 'i', 8),
                  m(21, '\n            '),
                  N(22, 'span', 9),
                  m(23, 'Home'),
                  E(),
                  m(24, '\n          '),
                  E(),
                  m(25, '\n          '),
                  N(26, 'a', 10),
                  m(27, '\n            '),
                  Oe(28, 'i', 11),
                  m(29, '\n            '),
                  N(30, 'span', 9),
                  m(31, 'About'),
                  E(),
                  m(32, '\n          '),
                  E(),
                  m(33, '\n        '),
                  E(),
                  m(34, '\n        '),
                  N(35, 'div', 12),
                  m(36, '\n          '),
                  Oe(37, 'app-language-selector', 13),
                  m(38, '\n          '),
                  N(39, 'div', 14),
                  m(40, '\n            '),
                  N(41, 'a', 15),
                  m(42, '\n              '),
                  Oe(43, 'i', 16),
                  m(44, '\n            '),
                  E(),
                  m(45, '\n            '),
                  N(46, 'div', 17),
                  m(47, '\n              '),
                  N(48, 'h6', 18),
                  m(49, '\n                '),
                  N(50, 'span', 9),
                  m(51, 'Logged in as'),
                  E(),
                  m(52, ' '),
                  N(53, 'b'),
                  m(54),
                  E(),
                  m(55, '\n              '),
                  E(),
                  m(56, '\n              '),
                  Oe(57, 'div', 19),
                  m(58, '\n              '),
                  N(59, 'button', 20),
                  oe('click', function () {
                    return r.logout();
                  }),
                  m(60, 'Logout'),
                  E(),
                  m(61, '\n            '),
                  E(),
                  m(62, '\n          '),
                  E(),
                  m(63, '\n        '),
                  E(),
                  m(64, '\n      '),
                  E(),
                  m(65, '\n    '),
                  E(),
                  m(66, '\n  '),
                  E(),
                  m(67, '\n'),
                  E(),
                  m(68, '\n')),
                  2 & t &&
                    (F(9),
                    ve('aria-expanded', !r.menuHidden),
                    F(5),
                    H('ngbCollapse', r.menuHidden),
                    F(23),
                    H('inNavbar', !0),
                    F(17),
                    Ss(r.username));
              },
              dependencies: [Xc, dG, Go, vg, lu, mg, ZN, jc, $w],
              styles: [
                '.navbar[_ngcontent-%COMP%]{margin-bottom:1rem}.nav-link.dropdown-toggle[_ngcontent-%COMP%]{cursor:pointer}',
              ],
            })),
            e
          );
        })(),
        GU = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [['app-shell']],
              decls: 4,
              vars: 0,
              template: function (t, r) {
                1 & t && (Oe(0, 'app-header'), m(1, '\n'), Oe(2, 'router-outlet'), m(3, '\n'));
              },
              dependencies: [Ic, jU],
            })),
            e
          );
        })();
      class rT {
        static childRoutes(n) {
          return { path: '', component: GU, children: n, canActivate: [kU] };
        }
      }
      const UU = [
        rT.childRoutes([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'home', component: HU, data: { title: 'Home' } },
        ]),
      ];
      let $U = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [Qn.forChild(UU), Qn] })),
            e
          );
        })(),
        WU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st, mi, VN, $U] })),
            e
          );
        })(),
        zU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st, mi, uu, nT, XN, Qn] })),
            e
          );
        })();
      const qU = [
        rT.childRoutes([
          {
            path: 'about',
            component: (() => {
              class e {
                constructor() {
                  this.version = wr_version;
                }
                ngOnInit() {}
              }
              return (
                (e.ɵfac = function (t) {
                  return new (t || e)();
                }),
                (e.ɵcmp = gt({
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
                  template: function (t, r) {
                    1 & t &&
                      (N(0, 'div', 0),
                      m(1, '\n  '),
                      N(2, 'div', 1),
                      m(3, '\n    '),
                      N(4, 'h1'),
                      m(5, '\n      '),
                      N(6, 'span', 2),
                      m(7, 'APP_NAME'),
                      E(),
                      m(8, '\n    '),
                      E(),
                      m(9, '\n    '),
                      N(10, 'p'),
                      Oe(11, 'i', 3),
                      m(12, ' '),
                      N(13, 'span', 2),
                      m(14, 'Version'),
                      E(),
                      m(15),
                      E(),
                      m(16, '\n  '),
                      E(),
                      m(17, '\n'),
                      E(),
                      m(18, '\n')),
                      2 & t && (F(15), Un(' ', r.version, ''));
                  },
                  dependencies: [Xc],
                })),
                e
              );
            })(),
            data: { title: 'About' },
          },
        ]),
      ];
      let QU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [Qn.forChild(qU), Qn] })),
            e
          );
        })(),
        XU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [st, mi, QU] })),
            e
          );
        })();
      const YU = new un('App');
      let Ei = class {
        constructor(n, t, r, i, o) {
          (this.router = n),
            (this.activatedRoute = t),
            (this.titleService = r),
            (this.translateService = i),
            (this.i18nService = o);
        }
        ngOnInit() {
          wr_production && un.enableProductionMode(),
            YU.debug('init'),
            this.i18nService.init(wr_defaultLanguage, wr_supportedLanguages);
          const n = this.router.events.pipe(Ae((t) => t instanceof Hr));
          xa(this.translateService.onLangChange, n)
            .pipe(
              L(() => {
                let t = this.activatedRoute;
                for (; t.firstChild; ) t = t.firstChild;
                return t;
              }),
              Ae((t) => 'primary' === t.outlet),
              at((t) => t.data),
              QN(this)
            )
            .subscribe((t) => {
              const r = t.title;
              r && this.titleService.setTitle(this.translateService.instant(r));
            });
        }
        ngOnDestroy() {
          this.i18nService.destroy();
        }
      };
      (Ei.ɵfac = function (n) {
        return new (n || Ei)(_(ct), _(jr), _(Lh), _(Fo), _(JN));
      }),
        (Ei.ɵcmp = gt({
          type: Ei,
          selectors: [['app-root']],
          decls: 2,
          vars: 0,
          template: function (n, t) {
            1 & n && (Oe(0, 'router-outlet'), m(1, '\n'));
          },
          dependencies: [Ic],
        })),
        (Ei = kg([WN()], Ei));
      const JU = [{ path: '**', redirectTo: '', pathMatch: 'full' }];
      let ZU = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e })),
            (e.ɵinj = K({ imports: [Qn.forRoot(JU), Qn] })),
            e
          );
        })(),
        e$ = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = q({ type: e, bootstrap: [Ei] })),
            (e.ɵinj = K({
              providers: [
                { provide: $c, useClass: fU, multi: !0 },
                { provide: $c, useClass: pU, multi: !0 },
                { provide: Op, useClass: gU },
              ],
              imports: [
                ak,
                CB.register('./ngsw-worker.js', { enabled: wr_production }),
                k1,
                tB,
                Qn,
                mi.forRoot(),
                uu,
                VN,
                zU,
                WU,
                XU,
                nT,
                ZU,
              ],
            })),
            e
          );
        })();
      wr_production &&
        (function qP() {
          Sb = !1;
        })(),
        sk()
          .bootstrapModule(e$)
          .catch((e) => console.error(e));
    },
  },
  (te) => {
    te((te.s = 63));
  },
]);
