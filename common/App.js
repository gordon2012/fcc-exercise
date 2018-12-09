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
          <h1 className="masthead">Exercise Tracker</h1>

          <div className="container">
            <div className="card">
              <h2 className="masthead">User Stories</h2>
              <ol>
                <li>
                  I can create a user by posting form data username to{' '}
                  <code>/api/exercise/new-user</code> and returned will be an
                  object with username and _id.
                </li>
                <li>
                  I can get an array of all users by getting{' '}
                  <code>api/exercise/users</code> with the same info as when
                  creating a user.
                </li>
                <li>
                  I can add an exercise to any user by posting form data
                  userId(_id), description, duration, and optionally date to{' '}
                  <code>/api/exercise/add</code>. If no date supplied it will
                  use current date. Returned will be the user object with also
                  the exercise fields added.
                </li>
                <li>
                  I can retrieve a full exercise log of any user by getting{' '}
                  <code>/api/exercise/log</code> with a parameter of
                  userId(_id). Return will be the user object with added array
                  log and count (total exercise count).
                </li>
                <li>
                  I can retrieve part of the log of any user by also passing
                  along optional parameters of from & to or limit. (Date format
                  yyyy-mm-dd, limit = int)
                </li>
              </ol>

              <h2 className="masthead">Example Usage</h2>
              <code className="response">
                {`GET /api/exercise/log?{userId}[&from][&to][&limit]`}
              </code>
              <h2 className="masthead">Example Output</h2>
              <code className="response">{`{"_id":"5c0c64aaa9e30b02b4aa71ea", "description":"Deep Squats", "duration":"5", "date":"2018-12-01"}`}</code>
            </div>

            {/* Get Log Form */}
            <div className="card">
              <h2 className="masthead">Retrieve a users's exercise log</h2>
              <form
                ref={form => (this.getFormRef = form)}
                onSubmit={this.handleGetFormSubmit}
              >
                <code className="response">{`GET /api/exercise/log?`}</code>
                <code className="response">
                  <label htmlFor="get">
                    <span>{`{userId}[&from][&to][&limit]`}</span>
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

            {/* New User Form */}
            <div className="card">
              <h2 className="masthead">Create a New User</h2>
              <form
                ref={form => (this.postFormRef = form)}
                onSubmit={this.handlePostFormSubmit}
              >
                <code className="response">POST /api/exercise/new-user</code>

                <code className="response">
                  <label htmlFor="username">
                    <span>username</span>
                    <input type="text" id="username" name="username" />
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

            {/* New Exercise Form  */}
            <div className="card">
              <h2 className="masthead">Add exercises</h2>
              <form
                ref={form => (this.postFormRef = form)}
                onSubmit={this.handlePostFormSubmit}
              >
                <code className="response">POST /api/exercise/add</code>
                <code className="response">
                  {[
                    { name: '_id', label: 'User ID', required: true },
                    {
                      name: 'description',
                      label: 'Description',
                      required: true
                    },
                    {
                      name: 'duration',
                      label: 'Duration (mins)',
                      required: true
                    },
                    {
                      name: 'date',
                      label: 'Date (YYYY-MM-DD)',
                      required: false
                    }
                  ].map(field => (
                    <div key={field.name} className="response input">
                      <label htmlFor={field.name}>
                        <span>{field.label}</span>
                        <input type="text" id={field.name} name={field.name} />
                      </label>
                    </div>
                  ))}
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
