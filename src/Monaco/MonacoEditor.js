import * as React from 'react';
import * as monaco from 'monaco-editor';
import loader from '@monaco-editor/loader';

export default class MonacoEditor extends React.Component {
      componentDidMount() {
            const { path, value, language, onValueChange, ...options } = this.props;
            const that = this;

            let proxy = URL.createObjectURL(new Blob([`
                  self.MonacoEnvironment = {
                        baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
                  };
                  importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));

            window.MonacoEnvironment = { getWorkerUrl: () => proxy };

            loader.config({ monaco });

            loader.init().then(monaco => {
                  const model = monaco.editor.createModel(value, language);
                  that._editor = monaco.editor.create(this._node, options);
                  that._editor.setModel(model);
                  that._subscription = model.onDidChangeContent(() => {
                        onValueChange(model.getValue());
                  });
            });
      }

      componentDidUpdate(prevProps) {
            const { path, value, language, onValueChange, ...options } = this.props;

            this._editor.updateOptions(options);

            const model = this._editor.getModel();

            if (value !== model.getValue()) {
                  model.pushEditOperations(
                        [],
                        [
                              {
                                    range: model.getFullModelRange(),
                                    text: value,
                              },
                        ]
                  );
            }
      }

      componentWillUnmount() {
            this._editor && this._editor.getModel().dispose();
            this._subscription && this._subscription.dispose();
            this._editor && this._editor.dispose();
      }

      render() {
            return <div style={{ width: '100%', height: '100%' }} ref={c => this._node = c} />
      }
}