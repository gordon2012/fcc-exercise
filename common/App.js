import React, { Component } from 'react';
import 'babel-polyfill';

class App extends Component {
  state = {
    responses: []
  };

  handleGetFormSubmit = async event => {
    event.preventDefault();

    const data = new FormData(event.target);
    const response = await fetch(`api/${data.get('get')}`);
    const json = await response.json();

    this.setState({
      responses: [JSON.stringify(json), ...this.state.responses]
    });

    this.handleGetFormClear();
  };

  handlePostFormSubmit = async event => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(event.target));
    const response = await fetch(`api/post`, {
      method: 'POST',
      body: data
    });
    const json = await response.json();

    this.setState({
      responses: [JSON.stringify(json), ...this.state.responses]
    });

    this.handlePostFormClear();
  };

  handleGetFormClear = () => {
    this.getFormRef.reset();
  };

  handlePostFormClear = () => {
    this.postFormRef.reset();
  };

  handleResponsesClear = () => {
    this.setState({ responses: [] });
  };

  render() {
    return (
      <div className="app">
        <main>
          <h1 className="masthead">Microservice Boilerplate</h1>

          <div className="container">
            <div className="card">
              <h2 className="masthead">User Stories</h2>
              <ol>
                <li>
                  The API GET endpoint is <code>GET /api/:input? </code>
                </li>
                <li>
                  The API POST endpoint is <code>POST /api/post </code>
                </li>
              </ol>

              <h2 className="masthead">Example Usage</h2>
              <code className="response">GET /api/hello_world</code>
              <h2 className="masthead">Example Output</h2>
              <code className="response">{`{"method":"get", "input":"hello_world"}`}</code>
            </div>

            <div className="card">
              <h2 className="masthead">GET Request</h2>

              <form
                ref={form => (this.getFormRef = form)}
                onSubmit={this.handleGetFormSubmit}
              >
                <code className="response">
                  <label htmlFor="get">
                    <span>GET /api/</span>
                    <input type="text" id="get" name="get" />
                  </label>
                </code>

                <div className="buttons">
                  <div>
                    <button>Submit</button>
                  </div>
                  <div>
                    <button type="button" onClick={this.handleGetFormClear}>
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="card">
              <h2 className="masthead">POST Request</h2>

              <form
                ref={form => (this.postFormRef = form)}
                onSubmit={this.handlePostFormSubmit}
              >
                <code className="response">POST /api/post</code>

                <code className="response">
                  <label htmlFor="foo">
                    <span>foo</span>
                    <input type="text" id="foo" name="foo" />
                  </label>
                </code>

                <code className="response">
                  <label htmlFor="bar">
                    <span>bar</span>
                    <input type="text" id="bar" name="bar" />
                  </label>
                </code>

                <div className="buttons">
                  <div>
                    <button>Submit</button>
                  </div>
                  <div>
                    <button type="button" onClick={this.handlePostFormClear}>
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {this.state.responses.length > 0 ? (
              <div className="card">
                <h2 className="masthead">Output</h2>
                <div className="responses">
                  {this.state.responses.map((response, i) => (
                    <code className="response" key={i}>
                      {response}
                    </code>
                  ))}
                  <div className="buttons">
                    <div>
                      <button type="button" onClick={this.handleResponsesClear}>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
        <footer>
          A{' '}
          <a
            href="https://freecodecamp.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            freeCodeCamp
          </a>{' '}
          APIs and Microservices Project Boilerplate
        </footer>
      </div>
    );
  }
}
export default App;
