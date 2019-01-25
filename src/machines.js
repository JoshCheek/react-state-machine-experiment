class StateMachine {
  constructor({ initialState, transitions, cb }) {
    this.state       = initialState
    this.transitions = transitions
    this.cb          = cb
  }
  event(eventName) {
    const newState = this.transitions[this.state][eventName]
    if(!newState) return
    this.cb({
      oldState: this.state,
      event:    eventName,
      newState: newState
    })
    this.state = newState
  }

  // could go awry depending on the name of the event, but I don't feel like figuring out how to escape it properly.
  toGraphviz() {
    let gv = "digraph G {\n"
    for(let fromState in this.transitions)
      for(let event in this.transitions[fromState])
        gv += `  ${fromState} -> ${this.transitions[fromState][event]} [\n` +
              `    label = "${event}"\n` +
              `  ]\n`
    gv += `}\n`
    return gv
  }
}

class Reset {
  constructor({ begin: onBeginReset, end: onEndReset }) {
    this.stateMachine = new StateMachine({
      initialState: "initial",
      transitions: {
        initial:   { beginLoading: "loading"   },
        loading:   { endLoading:   "ready"     },
        ready:     { beginLoading: "reloading" },
        reloading: { endLoading:   "ready"     },
      },
      cb: (info) => {
        const { newState, oldState } = info
        const maybehRun = (state, cb) =>
          state === newState && state !== oldState && cb &&
            setImmediate(() => cb(info))
        maybehRun("loading",   onBeginReset)
        maybehRun("reloading", onBeginReset)
        maybehRun("ready",     onEndReset)
      }
    })
  }

  // user mutations
  begin() { this.stateMachine.event("beginLoading") }
  end()   { this.stateMachine.event("endLoading") }

  // user state queries
  isInitial()   { return this.stateMachine.state === "initial"   }
  isLoading()   { return this.stateMachine.state === "loading"   }
  isReady()     { return this.stateMachine.state === "ready"     }
  isReloading() { return this.stateMachine.state === "reloading" }

  // other useful stuff
  toGraphviz()  {
    return this.stateMachine.toGraphviz()
  }
}

export { StateMachine, Reset }

/* you can toggle all the stuff below by commenting this one out

// try this (assuming you have graphviz and imgcat)
// $ node src/machines.js | dot -Tpng | imgcat
const m = new Reset({
  // error is so the graphviz data doesn't mix with the logging data
  // which would cause it to be invalid graphviz syntax
  begin: () => console.error("keep existing state"),
  end:   () => console.error("set state to initial values"),
})
console.log(m.toGraphviz())

Number.prototype.times = function(cb) {
  for(let i = 0; i < this; ++i)
    cb(i)
}
2..times(() => m.begin())
2..times(() => m.end())
3..times(() => m.begin())
3..times(() => m.end())
/**/
