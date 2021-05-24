import { useState, useEffect } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import gql from 'graphql-tag';

const endPointUrl = 'http://localhost:9000/graphql'
const client = new ApolloClient({
  link: new HttpLink({ uri: endPointUrl }),
  cache: new InMemoryCache()
});

const loadStudentsAsync = async () => {
  const query = gql`
  {
     students{
        id
        firstName
        lastName
        college{
           name
        }
     }
  }`
  const { data } = await client.query({ query });
  return data.students;
}

// doesn't use apollo client
const loadGreeting = async () => {
  const response = await fetch('http://localhost:9000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: '{greeting}' })
  })

  const responseBody = await response.json();

  console.log("end of function");
  return responseBody.data.greeting;
}

//doesn't use apollo client
async function loadSayhello(name) {
  const response = await fetch('http://localhost:9000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: `{sayHello(name:"${name}")}` })
  })
  const rsponseBody = await response.json();
  return rsponseBody.data.sayHello;
}

function App() {
  const [greetingMessage, setGreetingMessage] = useState('');
  const [sayHelloMessage, setSayHelloMessage] = useState('');
  const [userName, setUserName] = useState();
  const [students, setStudents] = useState();

  const loadStudents = async () => {
    await loadStudentsAsync().then(s => {
      console.log("student after", students);
      setStudents(s);
    })
  }

  const showGreeting = async () => {
    await loadGreeting().then(g => {
      console.log("greeting");
      setGreetingMessage(g + " :)");
    })
  }

  const showSayHelloMessage = async () => {
    const name = userName;
    console.log(name);
    await loadSayhello(name).then(m => {
      setSayHelloMessage(m);
    })
  }

  const updateName = event => {
    console.log('event', event.target.value)
    setUserName(event.target.value)
  }

  return (
    <div className="App">
      <section>
        <button id="btnGreet" onClick={showGreeting}>Greet</button>
        <br /> <br />
        <div id="greetingDiv">
          <h1>{greetingMessage}</h1>
        </div>
      </section>

      <hr />

      <section>
        Enter a name:<input id="txtName" type="text" onChange={updateName}
          value={userName} />
        <button id="btnSayhello" onClick={showSayHelloMessage}>SayHello</button>
        <br />
          user name is:{userName}
        <br />
        <div id="SayhelloDiv">
          <h1>{sayHelloMessage}</h1>
        </div>
      </section>

      <div>
        <input type="button" value="loadStudents" onClick={() => loadStudents()} />
        <div>
          <br />
          <hr />
          <table border="3">
            <thead>
              <tr>
                <td>First Name</td>
                <td>Last Name</td>
                <td>college Name</td>
              </tr>
            </thead>

            <tbody>
              {(students && students.map(s => {
                return (
                  <tr key={s.id}>
                    <td>
                      {s.firstName}
                    </td>
                    <td>
                      {s.lastName}
                    </td>
                    <td>
                      {s.college.name}
                    </td>
                  </tr>
                )
              }))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
