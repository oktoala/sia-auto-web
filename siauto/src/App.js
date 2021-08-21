import unmul from './img/unmul.png';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Header />
      <Main>
        <MainSection />
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

  const [validated, setValidated] = useState(false);
  const [checkRequired, setCheckRequired] = useState(true);
  const [radioRequired, setRadioRequired] = useState(true);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <section className="main-section">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <FormInput type="nim">NIM</FormInput>
        <FormInput type="password">Password</FormInput>
        <Form.Label>Nilai Kuesioner</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormCheckbox">
          {['1', '2', '3', '4', '5'].map((label) => <FormCheckButton
            required={checkRequired} type="checkbox" label={label} />)}
        </Form.Group>
        <Form.Label>Semester</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormRadio">
          {['Ganjil', 'Genap'].map((label) => <FormCheckButton
            required={checkRequired} type="radio" label={label} />)}
        </Form.Group>
        <Form.Group className="mb-3" controlId="basicFormTrust">
          <FormCheckButton type="checkbox" label="Isi Setengah Dulu" />
        </Form.Group>
        <Button variant="primary" type="submit">Mulai</Button>
      </Form>
    </section>
  );
}

/* Form Input */
function FormInput(props) {
  return (
    <Form.Group className="mb-3" controlId={`basicForm${props.children}`}>
      <Form.Label>{props.children}</Form.Label>
      <Form.Control type={props.type} placeholder={`Masukkan ${props.children}`} />
    </Form.Group>
  );
}

/* Kuesioner Checkboxes and RadioButton*/
function FormCheckButton(props) {
  return (
    <Form.Check required={props.required} inline label={props.label} name="group1"
      type={props.type} id={`inline-${props.type}-${props.label}`} />
  );
}



export default App;
