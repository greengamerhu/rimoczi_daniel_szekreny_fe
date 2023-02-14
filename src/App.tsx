import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Card, Container, Form, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

interface State {
  addNev : String,
  addAjto : number,
  addFiok : number,
  addDatum : String,
  addAr : number,
  addElerhetoseg: boolean,
  szekrenyek : Szekreny[]
}
interface Szekreny {
  id : number,
  nev : String,
  ajtok_szama : number,
  fiokok_szama : number,
  gyartas_datum : Date,
  ar : number,
  elerheto: boolean
}
interface szekrenyResponse {
  szekrenyek : Szekreny[]
}




class App extends React.Component< {}, State> {
  constructor(props : {}) {
    super(props)
    this.state = {
      addNev : "",
      addAjto : 0,
      addFiok : 0,
      addDatum : "",
      addAr : 1,
      addElerhetoseg: false,
      szekrenyek : []
    }
  }
  componentDidMount(): void {
    this.loadData()
  }
  deleteFromDatabase = async (id : number)  => {
    await fetch('http://localhost:3000/szekreny/'+ id, {
      method : 'DELETE'
    })
    this.loadData()
  }
  loadData = async () => {
    let response = await fetch("http://localhost:3000/szekreny")
    let data = await response.json() as szekrenyResponse
    this.setState({
      szekrenyek : data.szekrenyek
    })

  }
  addToDB = async () => {
    const {addNev, addAjto, addFiok, addElerhetoseg, addDatum, addAr} = this.state
     
    let szekreny = {
        "nev" : addNev,
        "ajtok_szama" : addAjto,
        "fiokok_szama" : addFiok,
        "gyartas_datum" : addDatum,
        "ar" : addAr,
        "elerheto" : addElerhetoseg
      };

      let response = await fetch("http://localhost:3000/szekreny", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        } ,
        body : JSON.stringify(szekreny)
        
      })
      this.loadData()
  }
  render(): React.ReactNode {
    const {addNev, addAjto, addFiok, addElerhetoseg, addDatum, addAr} = this.state
    return <Container >
      <Form.Group className="mb-3 "  >
        <Form.Label>Név</Form.Label>
        <Form.Control value={addNev.toString()} onChange={e => this.setState({ addNev : e.currentTarget.value}) }
         type="text" placeholder="add meg a szekrény nevét" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>add meg a ajtók számát</Form.Label>
        <Form.Control value={addAjto} onChange={e => this.setState({ addAjto : parseInt(e.currentTarget.value)}) }
         type="number" placeholder="add meg a ajtók számát" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>add meg a fiókok számát</Form.Label>
        <Form.Control value={addFiok} onChange={e => this.setState({ addFiok : parseInt(e.currentTarget.value)}) } type="number" placeholder="add meg a fiókok számát" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>add meg a gyártási dátumot</Form.Label>
        <Form.Control onChange={e => this.setState({ addDatum :  (e.currentTarget.value)}) }  type="date" placeholder="Gyártás dátum" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>add meg az árát</Form.Label>
        <Form.Control value={addAr} onChange={e => this.setState({ addAr : parseInt(e.currentTarget.value)}) } type="number" placeholder="ár" />
      </Form.Group>
      <Form.Group className="mb-3" >
        
      <Form.Label>Elérhetőség</Form.Label>
      <Form.Select onChange={e => this.setState( {addElerhetoseg : e.currentTarget.value == '1'})}>
      <option value="0">Nincs készleten</option>
      <option value="1">Készleten</option>
    </Form.Select>
    </Form.Group>

    <button className='btn btn-secondary ' onClick={this.addToDB}>Felvesz</button>
  
        <Row >
          {
            this.state.szekrenyek.map(szekreny => (
          <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{szekreny.nev} </Card.Title>
              <Card.Text >
                  <p>Ajtók: {szekreny.ajtok_szama} db</p>
                  <p>Fiókok száma: {szekreny.fiokok_szama} db</p>
                  <p>Gyatasi Datum: {szekreny.gyartas_datum.toLocaleString()} </p>
                  <p>Ár: {szekreny.ar} FT</p>
                  <p> elérhető?: {szekreny.elerheto ? "igen" : "nem"}  </p>
              </Card.Text>
            </Card.Body>
            <Card.Footer >
              <Button variant='danger' onClick={(event) => this.deleteFromDatabase(szekreny.id)}>
                Törlés
              </Button>
            </Card.Footer>
          </Card>
          </Col>
          ))
          }

        </Row>
        
      </Container>


  }
}

export default App;
