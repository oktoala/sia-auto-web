import unmul from './img/unmul.png';
import { Button, Alert } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Header/>
      <MainForm/>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header_container">
        <div className="logo">
          <a className="logo"href="/">
            <div className="logo_image">
              <img width="50px" src={unmul} alt="logo"></img>
            </div>
            <div className="logo_title">
              <span>SIAuto</span>
            </div>
          </a>
        </div>
        <div className="menu">
          <span>Contribute</span>
        </div>
      </div>
    </header>
  );
}

function MainForm() {
  return (
    <section>
      <main>
      <Button>Makan Dulu</Button>
      </main>
    </section>
  );
}


export default App;
