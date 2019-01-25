class StateMachine {
  constructor({ initialState, transitions, cb }) {
    this.state = initialState;
    this.transitions = transitions;
    this.cb = cb;
  }
  event(eventName) {
    const newState = this.transitions[this.state][eventName] || this.state;
    this.cb({ oldState: this.state, event: eventName, newState: newState });
    this.state = newState;
  }
}

class Resettable {
  constructor({ begin: onBeginReset, end: onEndReset }) {
    this.onBeginReset = onBeginReset;
    this.onEndReset = onEndReset;
    this.stateMachine = new StateMachine({
      initialState: "initial",
      transitions: {
        initial: { beginLoading: "loading" },
        loading: { endLoading: "loaded" },
        loaded: { beginLoading: "loading" }
      },
      cb: info => this.onTransition(info)
    });
    // onEndReset() // not clear this is right, but good enough for exploration
  }

  onTransition({ oldState, newState }) {
    if (oldState === "initial" && newState === "loading" && this.onBeginReset)
      this.onBeginReset();
    if (oldState === "loading" && newState === "initial" && this.onEndReset)
      this.onEndReset();
  }
  begin() {
    this.stateMachine.event("beginLoading");
  }
  end() {
    this.stateMachine.event("endLoading");
  }
}

export default Resettable;
