import { Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { FormCheckType } from 'react-bootstrap/esm/FormCheck';
import { ReactComponent as GithubIcon } from './icons/github.svg';
import { ReactComponent as UnmulIcon } from './icons/unmul.svg';
import { ReactComponent as LogoIcon } from './icons/logo.svg';

interface Props {
  children?: React.ReactNode;
  type?: FormCheckType | undefined;
  label?: string;
  required?: boolean;
  hidden?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
}

interface DataColleger {
  nim: string;
  password: string;
  semId: string | undefined;
  nilai: (string | undefined)[];
  cobaDulu: boolean;
}

const dataColleger: DataColleger = {
  nim: "",
  password: "",
  nilai: [],
  semId: "",
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
              <LogoIcon height="50px" />
            </div>
            <div className="logo_title">
              <span>SIAuto</span>
            </div>
          </a>
        </div>
        <div className="menu">
          <ButtonMenu href="sia.unmul.ac.id/home" label="SIA"  >
            <UnmulIcon height="25px" />
          </ButtonMenu>
          <ButtonMenu href="github.com/oktoala/sia-auto-web" label="Star"  >
            <GithubIcon height="25px" />
          </ButtonMenu>
        </div>
      </div>
    </header>
  );
}

const ButtonMenu = (props: Props) => {
  return (
    <Button variant="light" >
      <a href={`https://${props.href}`} target="_blank" rel="noopener noreferrer">
        {props.children}
        <span>{props.label}</span>
      </a>
    </Button>
  )
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
  const [semester, setSemester] = useState("");
  const [response, setResponse] = useState({ 
    response: "ga" });
  const tahun_ajar = `${curr_year()}/${curr_year() + 1}`;


  function curr_year() {
    const today = new Date();
    const monthGanjil = ["8", "9", "10", "11", "12"];
    const january = "1";
    const monthGenap = ["2", "3", "4", "5", "6", "7"];

    // Get year
    const year = today.getFullYear();

    // Get month
    const month = (today.getMonth() + 1).toString();
    let curr_year = year;

    if (month === january) {
      curr_year = (year - 1);
    } else if (monthGanjil.includes(month)) {
      curr_year = year;
    } else if (monthGenap.includes(month)) {
      curr_year = (year - 1);
    }

    return curr_year;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      console.log("False");
    } else {
      console.log("True");
      dataColleger.nim = (document.querySelector('#basicFormNIM') as HTMLInputElement).value;
      dataColleger.password = (document.querySelector('#basicFormPassword') as HTMLInputElement).value;

      const response = await fetch('http://localhost:5001/test-web-scrap/us-central1/scraper', {
        method: 'POST',
        body: JSON.stringify(dataColleger)
      });

      const data = await response.json().then(data => setResponse({response: data.response}));

      
    }
    console.log(dataColleger);
    setValidated(true);

  }

  function onClickCheckBtn(label: string) {
    /* Detect if the label found in the array */
    const index = dataColleger.nilai.indexOf(label);
    if (index !== -1) {
      console.log("makan");
      dataColleger.nilai.splice(index, 1);
    } else {
      console.log("makan2");
      dataColleger.nilai.push(label);
    }

    dataColleger.nilai.sort();
    console.log(dataColleger.nilai);

    if (dataColleger.nilai.length !== 0) {
      setCheckRequired(false);
      return;
    }

    setCheckRequired(true);

  }

  return (
    <section className="main-section">
      <h3>{`Semester ${tahun_ajar} ${semester}`}</h3>
      <Form noValidate validated={validated} onSubmit={handleSubmit} >
        <FormInput hidden="text">NIM</FormInput>
        <FormInput hidden="password" >Password</FormInput>
        <Form.Label>Nilai Kuesioner</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormCheckbox">
          {['1', '2', '3', '4', '5'].map((label) => <FormCheckButton
            onClick={() => onClickCheckBtn(label)} required={checkRequired} type="checkbox" label={label} />)}
        </Form.Group>
        <Form.Label>Semester</Form.Label>
        <Form.Group className="mb-3" controlId="basicFormRadio">
          {[{
            nama: 'Ganjil',
            id: '1'
          }, {
            nama: 'Genap',
            id: '2'
          }].map((label) => <FormCheckButton
            onClick={() => {
              dataColleger.semId = curr_year() + label.id;
              setSemester(label.nama)
            }} required type="radio" label={label.nama} />)}
        </Form.Group>
        <Form.Group className="mb-3" controlId="basicFormTrust">
          <FormCheckButton onClick={() => dataColleger.cobaDulu = dataColleger.cobaDulu ? false : true} type="checkbox" label="Isi Setengah Dulu" />
        </Form.Group>
        <Button variant="primary" type="submit">Mulai</Button>
      </Form>
      <p>h {response.response} </p>
    </section>
  );
}

/* Form Input */
const FormInput = (props: Props) => {
  return (
    <Form.Group className="mb-3" controlId={`basicForm${props.children}`}>
      <Form.Label>{props.children}</Form.Label>
      <Form.Control name="password" required type={props.hidden} placeholder={`Masukkan ${props.children}`} />
    </Form.Group>
  );
}

/* Kuesioner Checkboxes and RadioButton*/
const FormCheckButton = (props: Props) => {
  return (
    <Form.Check onClick={props.onClick} required={props.required} inline label={props.label} name="group1"
      type={props.type} id={`inline-${props.type}-${props.label}`} />
  );
}


export default App;
