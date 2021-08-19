import unmul from './img/unmul.png'

function App() {
  return (
    <div className="App">
      <Header></Header>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header_container">
        <div className="logo">
          <a className="logo"href="https://dalamkotak.onrender.com">
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




export default App;
