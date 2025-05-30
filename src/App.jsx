import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Col, Container, Form, InputGroup, Modal, Row, Spinner, Button } from "react-bootstrap";
import { useFetchGet, useFetchGetBody, useFetchPostBody } from "./hooks/useFetch.js";
import { useState, useEffect, useContext } from "react";
import { EventoCard } from "./components/EventoCard.jsx";
import { Droppable } from "./components/Droppable.jsx";
import { Draggable } from "./components/Draggable.jsx";
import { EventColumn } from "./components/EventColumn.jsx";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CrearEventoTerminar } from "./views/modals/CrearEventoTerminar.jsx";
import { InputAutocomplete } from "./components/InputAutocomplete.jsx";
import { RefetchContext } from "./contexts/RefetchContext.jsx";
import useForm from "./hooks/useForm.js";
import { Layout } from "./views/Layout.jsx";
import { EventosNavBar } from './components/navbars/EventosNavBar.jsx';
import { CreateButton } from './components/CreateButton.jsx';
import { CrearEvento } from './views/modals/CrearEvento.jsx';

const EventosTablero = () => {

  //Formulario
  const { values, setValues } = useForm({
    componenteId: '',
    yearId: '',
    quarterId: ''
  });

  //Componentes
  const findParamsComponentes = {
    sort: '{}',
    filter: '{}'
  }
  const [componentes, setComponentes] = useState([
    {id: '1', nombre: 'Componente 1'},
    {id: '2', nombre: 'Componente 2'},
    {id: '3', nombre: 'Componente 3'},
    {id: '4', nombre: 'Componente 4'},
    {id: '5', nombre: 'Componente 5'},
  ])

  //Años
  const [years, setYears] = useState([
    {id: '1', nombre: 'AF24'},
    {id: '2', nombre: 'AF25'},
    {id: '3', nombre: 'AF26'},
    {id: '4', nombre: 'AF27'},
    {id: '5', nombre: 'AF28'},
  ])

  //Quarters
  const [findParamsQuarter, setFindParamsQuarter] = useState({
    sort: '{}',
    filter: '{}'
  })
  const [quarters, setQuarters] = useState([
    {id: '1', nombre: 'Q1'},
    {id: '2', nombre: 'Q2'},
    {id: '3', nombre: 'Q3'},
    {id: '4', nombre: 'Q4'},
  ])
  
  //General config
  const { data: dataConfig } = useFetchGet('config');

  //Eventos
  const [eventos, setEventos] = useState([
    {id: '1', nombre: 'Evento 1', estadoRealizacion: 'Pendiente', organizador: {id: '1', nombre: 'Organizador 1'}, fechaInicio: '2024-01-01T10:00:00Z', fechaFinal: '2024-01-01T12:00:00Z', municipio: {id: '1', nombre: 'Municipio 1'}, tarea: {id: '1', nombre: 'Tarea 1'}, colaboradores: [{id: '2', nombre: 'Colaborador 1'}, {id: '3', nombre: 'Colaborador 2'}]},
    {id: '2', nombre: 'Evento 2', estadoRealizacion: 'En Ejecución', organizador: {id: '2', nombre: 'Organizador 2'}, fechaInicio: '2024-01-02T10:00:00Z', fechaFinal: '2024-01-02T12:00:00Z', municipio: {id: '2', nombre: 'Municipio 2'}, tarea: {id: '2', nombre: 'Tarea 2'}, colaboradores: [{id: '3', nombre: 'Colaborador 2'}, {id: '4', nombre: 'Colaborador 3'}, {id: '5', nombre: 'Colaborador 4'}]},
    {id: '3', nombre: 'Evento 3', estadoRealizacion: 'Finalizado', organizador: {id: '3', nombre: 'Organizador 3'}, fechaInicio: '2024-01-03T10:00:00Z', fechaFinal: '2024-01-03T12:00:00Z', municipio: {id: '3', nombre: 'Municipio 3'}, tarea: {id: '3', nombre: 'Tarea 3'}, colaboradores: []},
    {id: '4', nombre: 'Evento 4', estadoRealizacion: 'Pendiente', organizador: {id: '4', nombre: 'Organizador 4'}, fechaInicio: '2024-01-04T10:00:00Z', fechaFinal: '2024-01-04T12:00:00Z', municipio: {id: '4', nombre: 'Municipio 4'}, tarea: {id: '4', nombre: 'Tarea 4'}, colaboradores: [{id: '5', nombre: 'Colaborador 4'}, {id: '6', nombre: 'Colaborador 5'}]},
    {id: '5', nombre: 'Evento 5', estadoRealizacion: 'En Ejecución', organizador: {id: '5', nombre: 'Organizador 5'}, fechaInicio: '2024-01-05T10:00:00Z', fechaFinal: '2024-01-05T12:00:00Z', municipio: {id: '5', nombre: 'Municipio 5'}, tarea: {id: '5', nombre: 'Tarea 5'}, colaboradores: [{id: '6', nombre: 'Colaborador 5'}, {id: '7', nombre: 'Colaborador 6'}, {id: '8', nombre: 'Colaborador 7'}, {id: '9', nombre: 'Colaborador 8'}]},
  ])
  const [queryEventos, setQueryEventos] = useState('')
  const { data, isLoading, setRefetch } = useFetchGetBody(queryEventos, values);

  useEffect(() => {
    if(dataConfig){  
      setValues({
        yearId: dataConfig.find(el => el.attributeKey === 'idCurrentYear')?.attributeValue,
        quarterId: dataConfig.find(el => el.attributeKey === 'idCurrentQuarter')?.attributeValue
      }) 
      setQueryEventos('eventos/tablero')
      setRefetch(true)
    }
  }, [dataConfig, setRefetch, setValues])

  //Refetch inicial
  useEffect(() => {
    if(values.quarterId && values.componenteId){
      setRefetch(true)
    }
  }, [values, setRefetch])
  

  //Cargar eventos
  useEffect(() => {
    if(!isLoading && data){   
      setEventos(data)
      setRefetch(false)
    }
  }, [data, isLoading, setRefetch])


  //Valor para Modal Modificar
  const [currentData, setCurrentData] = useState({});

  //Modal modificar
  const [showEdit, setShowEdit] = useState(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleCloseEdit = ({id, success=false}) => {
    if(!success){
      const evento = eventos?.find(e => e.id === id)
      evento.estadoRealizacion = 'En Ejecución'
    }
    setShowEdit(false);
  }


  //Cambio asincrono de estados de
  const [toggleValues, setToggleValues] = useState({})
  const { setSend } = useFetchPostBody('eventos/tablero/toggle', toggleValues) 

  function handleDragEnd(event) {
    const {active, over} = event;

    setEventos(eventos.map(e => {
      if(over?.id === 'Finalizado'){
        const evento = eventos?.find(e => e.id === active.id)
        setCurrentData({
          id: evento.id,
          nombre: evento.nombre,
        })
        handleShowEdit()
      }

      if(over?.id === 'En Ejecución' || over?.id === 'Pendiente'){
        setToggleValues({
          idEvento: active.id,
          estado: over?.id
        })
        setSend(true)
      }

      if(e.id === active?.id){
        e.estadoRealizacion = over?.id || e.estadoRealizacion
        return e;
      }
      else{
        return e;
      }
    }))
  }

  //DnD
  const [activeId, setActiveId] = useState(null);
  function handleDragStart(event) {
    const {active} = event;
    setActiveId(active.id);
  }

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      delay: 150,
      distance: 10,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    mouseSensor
  );

  return(
    <Layout pagina={`Tablero de Eventos`} footer={false} SiteNavBar={EventosNavBar} breadcrumbs={[
      {link: '/', nombre: 'Inicio'},
      {link: '/eventos', nombre: 'Eventos'},
      {link: '/eventos/tablero', nombre: 'Tablero'}
  ]}>
    <div className="d-flex align-items-center">
      <h2 className="view-title"><i className="bi bi-kanban"></i>{` Tablero de Eventos`}</h2>
    </div>
    <Row className="m-0">
        <Container style={{border: '1px solid lightgray', borderRadius: '10px', marginTop: '0.2rem', marginBottom: '2rem', width: '100%'}}>
          <Row>
            <Col sm={4}>
              <Form.Group className="my-4 d-flex align-items-center">
                <Form.Label className="my-0" style={{marginRight: '1rem'}}>
                  Año Fiscal:
                </Form.Label>
                <InputGroup style={{maxWidth: '300px'}}>
                  <InputAutocomplete 
                    valueList={years} 
                    value={"1"}
                    name={'yearId'}
                    setValues={setValues}
                    setRefetch={() => { }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group className="my-4 d-flex align-items-center">
                <Form.Label className="my-0" style={{marginRight: '1rem'}}>
                  Trimestre:
                </Form.Label>
                <InputGroup style={{maxWidth: '300px'}}>
                  <InputAutocomplete 
                    valueList={quarters} 
                    value={"1"}
                    name={'quarterId'}
                    setValues={setValues}
                    setRefetch={() => { }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group className="my-4 d-flex align-items-center">
                <Form.Label className="my-0" style={{marginRight: '1rem'}}>
                  Componente:
                </Form.Label>
                <InputGroup style={{maxWidth: '300px'}}>
                  <InputAutocomplete 
                    valueList={componentes} 
                    value={"1"}
                    name={'componenteId'}
                    setValues={setValues}
                    setRefetch={() => { }}
                    disabled={false}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Row>

      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
        <Row>
          <Col xs={4}>
            <h3>Eventos Pendientes</h3>
            <hr />
            <Droppable key={'Pendiente'} id={'Pendiente'} Element={EventColumn}>
              <SortableContext 
                items={eventos?.filter(e => e.estadoRealizacion === 'Pendiente')}
                strategy={verticalListSortingStrategy}
              >
                {eventos?.filter(e => e.estadoRealizacion === 'Pendiente').map((e) => (
                  <Draggable key={e.id} id={e.id}>
                    <EventoCard values={e} key={e.id} setRefetch={() => setRefetch(true)} edit={true}/>
                  </Draggable>
                ))}
              </SortableContext>
            </Droppable>
          </Col>
          <Col xs={4}>
            <h3 >Eventos en Ejecución</h3>
            <hr />
            <Droppable key={'En Ejecución'} id={'En Ejecución'} Element={EventColumn}>
              {eventos?.filter(e => e.estadoRealizacion === 'En Ejecución').map((e) => (
                <Draggable key={e.id} id={e.id}>
                  <EventoCard values={e} key={e.id} setRefetch={() => setRefetch(true)}/>
                </Draggable>
              ))}
            </Droppable>
          </Col>
          <Col xs={4}>
            <h3>Eventos Registrados</h3>
            <hr />
            <Droppable key={'Finalizado'} id={'Finalizado'} Element={EventColumn}>
              {eventos?.filter(e => e.estadoRealizacion === 'Finalizado').map((e) => (
                <Draggable key={e.id} id={e.id} finalizado>
                  <EventoCard values={e} key={e.id} setRefetch={() => setRefetch(true)}  />
                </Draggable>
              ))}
            </Droppable>
          </Col>
        </Row>
        <DragOverlay>
          {activeId ? <EventoCard values={eventos.find(e => e.id === activeId)} key={activeId} /> : null}
        </DragOverlay>
      </DndContext>
      <Modal show={showEdit} onHide={handleCloseEdit} autoFocus backdrop='static'>
        <CrearEventoTerminar handleClose={handleCloseEdit} setRefetch={setRefetch} eventValues={currentData}/>  
      </Modal>
  </Layout>
    
  );
}

export default EventosTablero;