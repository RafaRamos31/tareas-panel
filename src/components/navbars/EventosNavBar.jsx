import { Navbar, Container, Nav, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

export const EventosNavBar = () => {

  const [actual, setActual] = useState('');

  useEffect(() => {
    const dirs = window.location.href.split('/')[4]
    setActual(dirs)
  }, [])

  const handleReturn = () => {
    let dirs = window.location.href.split('/')
    // eslint-disable-next-line
    const _ = dirs.pop;
    const url = dirs.join('/')
  }

  const page = 'Eventos';
  const [views] = useState([
    {
      name: 'Tablero',
      url: '/eventos/tablero',
      dir: 'tablero',
      icon: 'bi-kanban'
    },
    {
      name: 'Digitación',
      url: '/eventos/digitar',
      dir: 'digitar',
      icon: 'bi-pencil-square'
    },
    {
      name: 'Consolidar',
      url: '/eventos/consolidado',
      dir: 'consolidado',
      icon: 'bi-graph-up-arrow'
    }
  ])

  const [values, setValues] = useState([])

  useEffect(() => {
    const newValues = views.filter(v => 1 == 1)
    setValues(newValues)
  // eslint-disable-next-line
  }, [views])

  return (
    <>
    <Navbar expand="lg"  className="py-0">
      <Container fluid className='px-0'>
        <Nav className="py-0 d-flex flex-column">
          <div className={`text-start nav-link`} onClick={handleReturn} style={{cursor: 'pointer'}}>
            <Row className="d-flex align-items-center">
              <Col xs={2}>
                <i className={`my-0 bi bi-arrow-return-left`} style={{fontSize: '1.5rem', color: 'var(--main-green)'}}></i>{' '}
              </Col>
              <Col xs={1}>
                <p className="my-0 mb-1 separator" style={{fontSize: '2rem'}}>|</p>
              </Col>
              <Col>
                <p className="my-0" style={{fontSize: '1.2rem'}}>Volver</p>
              </Col>
            </Row>
          </div>
          {
            values.map((link, index) => (
              <a key={index} to={link.url} className={`text-start nav-link ${'tablero' === link.dir ? 'active' : ''}`}>
                <Row className="d-flex align-items-center">
                  <Col xs={2}>
                    <i className={`my-0 bi ${link.icon}`} style={{fontSize: '1.5rem', color: 'var(--main-green)'}}></i>{' '}
                  </Col>
                  <Col xs={1}>
                    <p className="my-0 mb-1 separator" style={{fontSize: '2rem'}}>|</p>
                  </Col>
                  <Col>
                    <p className="my-0" style={{fontSize: '1.2rem'}}>{link.name}</p>
                  </Col>
                </Row>
              </a>
            ))
          }
        </Nav>
      </Container>
    </Navbar>
    </>
  );
};
