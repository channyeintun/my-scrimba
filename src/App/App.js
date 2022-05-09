import React from 'react';
import styles from './App.module.css';
import { Cursor } from '../Cursor';
import { Helper } from '../_helpers';
import MonacoEditor from '../Monaco';

class App extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
                  recording: false,
                  playing: false,
                  record: { events: [], startTime: -1 },
                  cursorState: {
                        x: 0,
                        y: 0
                  }
            }
            this.presentationLayerRef = React.createRef();
      }
      handleRecording = (e) => {
            if (this.state.recording) {
                  Helper.stopRecording(document.documentElement);
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              recording: false,
                        }
                  })
            } else {
                  const newRecord = Helper.startRecording({
                        target: document.documentElement,
                        recording: this.state.record
                  });
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              recording: true,
                              record: newRecord
                        }
                  })
            }
      }
      handlePlayback = (e) => {
            const that = this;
            this.setState(prevState => {
                  return {
                        ...prevState,
                        playing: true
                  }
            })
            Helper.startPlaying({
                  state: this.state,
                  presentationLayer: this.presentationLayerRef.current,
                  updater: function (newState) {
                        that.setState(prevState => {
                              return {
                                    ...prevState,
                                    ...newState
                              }
                        })
                  }
            })
      }
      render() {
            return (
                  <>
                        <div className={styles.container}>

                              <div className={styles.recordSection}>
                                    <button onClick={this.handleRecording}>
                                          {this.state.recording
                                                ? "Recording(click again to stop)"
                                                : "Record"}
                                    </button>
                                    <button
                                          onClick={this.handlePlayback}
                                          disabled={this.state.recording
                                                || !this.state.record.events.length
                                          }>Play</button>
                              </div>
                              <main ref={this.presentationLayerRef} className={styles.presentationLayer}>
                                    {this.state.playing ? <Cursor style={{
                                          top: this.state.cursorState.y,
                                          left: this.state.cursorState.x,
                                    }} /> : null}
                                    <MonacoEditor language="javascript"
                                          value={
                                                "hello world"
                                          }
                                          onValueChange={(v) => console.log(v)}
                                          minimap={{ enabled: false }}
                                          scrollBeyondLastLine={false}
                                          selectOnLineNumbers= {true}
                                    />
                              </main>

                        </div>
                  </>
            );
      }
}

export default App;
