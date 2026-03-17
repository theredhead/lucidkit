import { Emitter } from "./emitter";

describe("Emitter", () => {
  let emitter: Emitter<number>;

  beforeEach(() => {
    emitter = new Emitter<number>();
  });

  it("should create", () => {
    expect(emitter).toBeTruthy();
  });

  describe("subscribe", () => {
    it("should invoke the listener when an event is emitted", () => {
      const spy = vi.fn();
      emitter.subscribe(spy);

      emitter.emit(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it("should support multiple listeners", () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      emitter.subscribe(spy1);
      emitter.subscribe(spy2);

      emitter.emit(7);

      expect(spy1).toHaveBeenCalledWith(7);
      expect(spy2).toHaveBeenCalledWith(7);
    });

    it("should return a teardown function", () => {
      const spy = vi.fn();
      const unsub = emitter.subscribe(spy);

      expect(typeof unsub).toBe("function");
    });
  });

  describe("unsubscribe", () => {
    it("should stop receiving events after teardown is called", () => {
      const spy = vi.fn();
      const unsub = emitter.subscribe(spy);

      emitter.emit(1);
      expect(spy).toHaveBeenCalledTimes(1);

      unsub();
      emitter.emit(2);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should not affect other listeners when one unsubscribes", () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const unsub1 = emitter.subscribe(spy1);
      emitter.subscribe(spy2);

      unsub1();
      emitter.emit(99);

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(99);
    });
  });

  describe("emit", () => {
    it("should not throw when there are no listeners", () => {
      expect(() => emitter.emit(0)).not.toThrow();
    });

    it("should invoke listeners synchronously", () => {
      const order: string[] = [];
      emitter.subscribe(() => order.push("listener"));
      order.push("before");
      emitter.emit(1);
      order.push("after");

      expect(order).toEqual(["before", "listener", "after"]);
    });

    it("should isolate listener errors so other listeners still fire", () => {
      const spy = vi.fn();
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      emitter.subscribe(() => {
        throw new Error("boom");
      });
      emitter.subscribe(spy);

      emitter.emit(5);

      expect(spy).toHaveBeenCalledWith(5);
      expect(errorSpy).toHaveBeenCalledOnce();
      errorSpy.mockRestore();
    });

    it("should deliver the correct payload to each listener", () => {
      const received: number[] = [];
      emitter.subscribe((n) => received.push(n));

      emitter.emit(10);
      emitter.emit(20);
      emitter.emit(30);

      expect(received).toEqual([10, 20, 30]);
    });
  });

  describe("typed payloads", () => {
    it("should work with object payloads", () => {
      const objectEmitter = new Emitter<{ id: number; name: string }>();
      const spy = vi.fn();
      objectEmitter.subscribe(spy);

      objectEmitter.emit({ id: 1, name: "test" });

      expect(spy).toHaveBeenCalledWith({ id: 1, name: "test" });
    });

    it("should work with void-like (undefined) payloads", () => {
      const voidEmitter = new Emitter<void>();
      const spy = vi.fn();
      voidEmitter.subscribe(spy);

      voidEmitter.emit(undefined as void);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
