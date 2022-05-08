export const Helper = {
      startRecording,
      stopRecording,
      startPlaying
}

let handlers;

function startRecording({ target, recording }) {
      handlers = [
            {
                  eventName: "mousemove",
                  handler: function handleMouseMove(e) {
                        recording.events.push({
                              type: "mousemove",
                              time: Date.now(),
                              clientX: e.clientX,
                              clientY: e.clientY,
                              pageX: e.pageX,
                              pageY: e.pageY,
                              target: e.target
                        });
                  }
            }
      ];
      recording.startTime = Date.now();
      recording.events = [];

      handlers?.map(x => listen(target, x.eventName, x.handler));

      return recording;
}

function stopRecording(target) {
      handlers?.map(x => removeListener(target, x.eventName, x.handler));
}


// Helpers
function listen(target, eventName, handler) {
      return target.addEventListener(eventName, handler, true);
}

function removeListener(target, eventName, handler) {
      return target.removeEventListener(
            eventName,
            handler,
            true
      );
}

function startPlaying({
      state,
      updater,
      presentationLayer
}) {
      const SPEED = 1;
      const recording = state.record;
      let i = 0;
      const startPlay = Date.now();
      (function draw() {
            let event = recording.events[i];
            if (!event) {
                  return;
            }
            let offsetRecording = event.time - recording.startTime;

            let offsetPlay = (Date.now() - startPlay) * SPEED;

            if (offsetPlay >= offsetRecording) {
                  drawEvent(event);
                  i++;
            }

            if (i < recording.events.length) {
                  window.requestAnimationFrame(draw);
            } else {
                  updater({
                        playing: false
                  })
            }
      })();

      function drawEvent(event) {
            if (event.type === "mousemove") {
                 const rect = presentationLayer.getBoundingClientRect();
                  updater({
                        cursorState: {
                              x: event.clientX - rect.left,
                              y: event.clientY - rect.top
                        }
                  })
            }
      }
}
