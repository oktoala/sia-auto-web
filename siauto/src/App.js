import unmul from './img/unmul.png';
import { Button, Alert, Form, FormGroup } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Header />
      <Main>
        <MainSection></MainSection>
      </Main>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header_container">
        <div className="logo">
          <a className="logo" href="/">
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

function Main(props) {
  return (
    <main>
      {props.children}
    </main>
  );
}

function MainSection() {
  return (
    <section className="main-section">
      <Form>
        <FormGroups type="nim">NIM</FormGroups>
        <FormGroups type="password">Password</FormGroups>
      </Form>
      <Form.Label>Nilai Kuesioner</Form.Label>
      <Form.Group className="mb-3" controlId="basicFormCheckbox">
        <CheckBoxes label="1" />
        <CheckBoxes label="2" />
      </Form.Group>
      <Button variant="primary" type="submit">Mulai</Button>
    </section>
  );
}



function FormGroups(props) {
  return (
    <Form.Group className="mb-3" controlId={`basicForm${props.children}`}>
      <Form.Label>{props.children}</Form.Label>
      <Form.Control type={props.type} placeholder={`Masukkan ${props.children}`} />
    </Form.Group>
  );
}

function CheckBoxes(props) {
  return (
    <Form.Check inline label={props.label} name="group1"
      type="checkbox" id={`inline-checkbox-${props.label}`} />

  );
}

export default App;
