import React, { Component } from 'react';
import 'babel-polyfill';

class App extends Component {
  state = {
    responses: {
        users: [],
        log: [],
        'new-user': [],
        add: []
    }
  };

  clearExercises = () => {
    this.getExercisesRef.reset();
  };

  clearPostUser = () => {
    this.postUserRef.reset();
  };

  clearPostExercise = () => {
    this.postExerciseRef.reset();
  };

  addResponse = (json, type) => {
    this.setState(prevState => {
        return {
            responses: {
                ...prevState.responses,
                [type]: [
                    {response: json},
                    ...prevState.responses[type]
                ]
            }
        };
    });
  };

  // Handlers
  handleGetUsersSubmit = async event => {
    event.preventDefault();
    event.stopPropagation();

    const response = await fetch(`api/exercise/users`);
    const json = await response.json();

    this.addResponse(json, 'users');
  };

  handleGetExercisesSubmit = async event => {
    event.preventDefault();
    event.stopPropagation();

    const data = new FormData(event.target);
    const params = new URLSearchParams(data).toString();

    const response = await fetch(`api/exercise/log?${params}`);

    const json = await response.json();

    this.addResponse(json, 'log');
    this.clearExercises();
  };

  handlePostUserSubmit = async event => {
    event.preventDefault();
    event.stopPropagation();

    const data = new URLSearchParams(new FormData(event.target));
    const response = await fetch(`api/exercise/new-user`, {
      method: 'POST',
      body: data
    });
    const json = await response.json();

    this.addResponse(json, 'new-user');
    this.clearPostUser();
  };

  handlePostExerciseSubmit = async event => {
    event.preventDefault();
    event.stopPropagation();

    const data = new URLSearchParams(new FormData(event.target));

    for (var pair of data.entries()) {
      if (!pair[1]) {
        data.delete(pair[0]);
      }
    }

    const response = await fetch(`api/exercise/add`, {
      method: 'POST',
      body: data
    });
    const json = await response.json();

    this.addResponse(json, 'add');
    this.clearPostExercise();
  };

  handleResponsesClear = (type) => {
    this.setState(prevState => {
        return {
            responses: {
                ...prevState.responses,
                [type]: []
            }
        };
    });

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

            {/* Get all users */}
            <div className="card">
              <h2 className="masthead">Get all users</h2>
              <form onSubmit={this.handleGetUsersSubmit}>
                <code className="response">{`GET /api/exercise/users`}</code>
                <div className="buttons">
                    <div>
                        <button>Submit</button>
                    </div>
                    <div>
                        <button type="button" onClick={() => this.handleResponsesClear('users')}>
                            Clear
                        </button>
                    </div>
                </div>
              </form>

                {this.state.responses.users.length > 0 ? (
                    <div>
                        <h2 className="masthead">Output</h2>
                        <div className="responses">
                            {this.state.responses.users.map((response, i) => (
                                <code className="response pre" key={i}>
                                {JSON.stringify(response, null, 2)}
                                </code>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Get exercises for a user */}
            <div className="card">
              <h2 className="masthead">Get exercises for a user</h2>
              <form
                ref={form => (this.getExercisesRef = form)}
                onSubmit={this.handleGetExercisesSubmit}
              >
                <code className="response">{`GET /api/exercise/log/:userId[&from][&to][&limit]`}</code>
                <code className="response">
                  {[
                    { name: 'userId', required: true },
                    { name: 'from' },
                    { name: 'to' },
                    { name: 'limit' }
                  ].map(field => (
                    <div key={field.name} className="response input">
                      <label htmlFor={`get-exercises-${field.name}`}>
                        <span>{field.name}</span>
                        <input
                          type="text"
                          id={`get-exercises-${field.name}`}
                          name={field.name}
                          required={field.required}
                        />
                      </label>
                    </div>
                  ))}
                </code>
                <div className="buttons">
                    <div>
                        <button>Submit</button>
                    </div>
                    <div>
                        <button type="button" onClick={() => this.handleResponsesClear('log')}>
                            Clear
                        </button>
                    </div>
                </div>
              </form>

                {this.state.responses.log.length > 0 ? (
                    <div>
                        <h2 className="masthead">Output</h2>
                        <div className="responses">
                            {this.state.responses.log.map((response, i) => (
                                <code className="response pre" key={i}>
                                {JSON.stringify(response, null, 2)}
                                </code>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Add a user */}
            <div className="card">
              <h2 className="masthead">Add a user</h2>
              <form
                ref={form => (this.postUserRef = form)}
                onSubmit={this.handlePostUserSubmit}
              >
                <code className="response">POST /api/exercise/new-user</code>

                <code className="response">
                  <label htmlFor="username">
                    <span>username</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required="required"
                    />
                  </label>
                </code>

                <div className="buttons">
                    <div>
                        <button>Submit</button>
                    </div>
                    <div>
                        <button type="button" onClick={() => this.handleResponsesClear('new-user')}>
                            Clear
                        </button>
                    </div>
                </div>
              </form>

              {this.state.responses['new-user'].length > 0 ? (
                    <div>
                        <h2 className="masthead">Output</h2>
                        <div className="responses">
                            {this.state.responses['new-user'].map((response, i) => (
                                <code className="response pre" key={i}>
                                {JSON.stringify(response, null, 2)}
                                </code>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Add an exercise to a user */}
            <div className="card">
              <h2 className="masthead">Add an exercise to a user</h2>
              <form
                ref={form => (this.postExerciseRef = form)}
                onSubmit={this.handlePostExerciseSubmit}
              >
                <code className="response">POST /api/exercise/add</code>
                <code className="response">
                  {[
                    { name: 'userId', label: 'User ID', required: true },
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
                      <label htmlFor={`add-exercise-${field.name}`}>
                        <span>{field.label}</span>
                        <input
                          type="text"
                          id={`add-exercise-${field.name}`}
                          name={field.name}
                          required={field.required}
                        />
                      </label>
                    </div>
                  ))}
                </code>
                <div className="buttons">
                    <div>
                        <button>Submit</button>
                    </div>
                    <div>
                        <button type="button" onClick={() => this.handleResponsesClear('add')}>
                            Clear
                        </button>
                    </div>
                </div>
              </form>

              {this.state.responses.add.length > 0 ? (
                    <div>
                        <h2 className="masthead">Output</h2>
                        <div className="responses">
                            {this.state.responses.add.map((response, i) => (
                                <code className="response pre" key={i}>
                                {JSON.stringify(response, null, 2)}
                                </code>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
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
