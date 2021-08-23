import unmul from './img/unmul.png';
import { Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { FormCheckType } from 'react-bootstrap/esm/FormCheck';

interface Props {
  children?: React.ReactNode;
  type?: FormCheckType | undefined;
  label?: string;
  required?: boolean;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
}

interface DataColleger {
  nim: string;
  password: string;
  semester: string | undefined;
  nilai: (string | undefined)[];
  cobaDulu: boolean;
}

const dataColleger: DataColleger = {
  nim: "",
  password: "",
  nilai: [],
  semester: "",
  cobaDulu: false
}

const App = () => {
  return (
    <div className="App">
      <Header />
      <Main>
        <MainSection />
      </Main>
    </div>
  );
}

const Header = () => {
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

const Main = (props: Props) => {
  return (
    <main>
      {props.children}
    </main>
  );
}


const MainSection = () => {

  const [validated, setValidated] = useState(false);
  const [checkRequired, setCheckRequired] = useState(true);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    // const res = await fetch('http://localhost:5001/test-web-scrap/us-central1/scraper', {
    //   method: 'POST',
    //   body: JSON.stringify({dataColleger})
    // })

    dataColleger.nim  = (document.querySelector('#basicFormNIM') as HTMLInputElement).value;
    dataColleger.password  = (document.querySelector('#basicFormPassword') as HTMLInputElement).value;
    
    console.log(dataColleger);

    setValidated(true);
  }

  function onClickCheckBtn(label: string) {
    /* Detect if the label found in the array */
    const index = dataColleger.nilai.indexOf(label);
    if (index !== -1){
      console.log("makan");
      dataColleger.nilai.splice(index, 1);
    } else {
      console.log("makan2");
      dataColleger.nilai.push(label);
    }

    dataColleger.nilai.sort();
    console.log(dataColleger.nilai);

    if (dataColleger.nilai.length !== 0){
      setCheckRequired(false);
      return;
    } 
    
    setCheckRequired(true);
    
  }

  return (
    <section className="main-section">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <FormInput >NIM</FormInput>
        <FormInput >Password</FormInput>
        <Form.Label>Nilai Kuesioner</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormCheckbox">
          {['1', '2', '3', '4', '5'].map((label) => <FormCheckButton
            onClick={() => onClickCheckBtn(label)} required={checkRequired} type="checkbox" label={label} />)}
        </Form.Group>
        <Form.Label>Semester</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormRadio">
          {['Ganjil', 'Genap'].map((label) => <FormCheckButton
            onClick={() => dataColleger.semester = label} required type="radio" label={label} />)}
        </Form.Group>
        <Form.Group className="mb-3" controlId="basicFormTrust">
          <FormCheckButton onClick={() => dataColleger.cobaDulu = dataColleger.cobaDulu ? false : true} type="checkbox" label="Isi Setengah Dulu" />
        </Form.Group>
        <Button variant="primary" type="submit">Mulai</Button>
      </Form>
    </section>
  );
}

/* Form Input */
const FormInput = (props: Props) => {
  return (
    <Form.Group className="mb-3" controlId={`basicForm${props.children}`}>
      <Form.Label>{props.children}</Form.Label>
      <Form.Control required type="text" placeholder={`Masukkan ${props.children}`} />
    </Form.Group>
  );
}

/* Kuesioner Checkboxes and RadioButton*/
const FormCheckButton = (props: Props) => {
  return (
    <Form.Check onClick={props.onClick} required={props.required} inline label={props.label} 
      type={props.type} id={`inline-${props.type}-${props.label}`} />
  );
}


export default App;
