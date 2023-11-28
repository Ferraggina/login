import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingText,
  addLandingText,
  updateLandingText,
  deleteLandingText,
} from "../../redux/actions/actions";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../sass/_abm_Viaje.scss";
import Pagination from "../home/Pagination";
import { reuleaux } from "ldrs";

export default function AbmTexto() {
  const dispatch = useDispatch();
  const landingDataText = useSelector((state) => state.landingDataText);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    texto: "",
    activo: false,
    posicion: "",
    titulo: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    dispatch(getLandingText());
    const timeout = setTimeout(() => {
      setIsLoading(false); // Cambia el estado a false después de un tiempo (simulación de carga)
    }, 1500); // Cambia el número a la cantidad de tiempo que desees simular

    return () => clearTimeout(timeout);
  }, [dispatch]);

  const handleEditText = (id) => {
    const editingText = landingDataText.find((text) => text.id === id);
    setFormData({
      texto: editingText.texto,
      activo: editingText.activo === "true", // Establecer 'activo' desde el texto actual
      posicion: editingText.posicion,
      titulo: editingText.titulo,
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleSaveEdits = () => {
    if (editingId) {
      const editingText = landingDataText.find((text) => text.id === editingId);
      const wasActiveBeforeEdit = editingText.activo;
      const newTextIsActive = formData.activo;

      if (!wasActiveBeforeEdit && newTextIsActive) {
        const activeTextsCount = landingDataText.filter(
          (text) => text.activo
        ).length;
        if (activeTextsCount >= 5) {
          alert("No puede haber más de 5 textos activos");
          return;
        }
      }

      dispatch(updateLandingText(editingId, formData));
      setEditingId(null);
      setShowModal(false);
      setFormData({
        // Limpiar el estado del formulario
        texto: "",
        activo: true,
        posicion: "",
        titulo: "",
      });
      alert("Cambios guardados con éxito");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleDeleteText = (id) => {
    dispatch(deleteLandingText(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const activeTextsCount = landingDataText.filter(
      (text) => text.activo
    ).length;
    const newTextIsActive = formData.activo;

    if (newTextIsActive && activeTextsCount >= 5) {
      alert("No puede haber más de 5 textos activos");
    } else {
      if (editingId) {
        handleSaveEdits();
      } else {
        if (formData.texto.trim() !== "") {
          dispatch(
            addLandingText({
              ...formData,
              texto: formData.texto,
              activo: formData.activo,
              posicion: formData.posicion,
              titulo: formData.titulo,
            })
          );
          setFormData({
            texto: "",
            activo: true,
            posicion: "",
            titulo: "",
          });
          setShowModal(false);
        } else {
          alert("El campo de texto no puede estar vacío.");
        }
      }
      console.log("ESTOY FUNCIONANDO");
    }
  };
  const filterLanding = (landing) => {
    // Calcular el índice del primer elemento y del último elemento en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Obtener los elementos de la página actual
    const currentItems = landing.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems;
  };
  const handlePageChange = (pageNumber) => {
    console.log(`Cambiando a la página ${pageNumber}`);
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reiniciar a la primera página cuando cambie la cantidad de elementos por página
  };

  return (
    <div className="custom-container mt-8">
      <br />
      <br />
      <br />
      <br />
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="spinner">
            {/* Contenido del spinner */}

            {reuleaux.register()}
            <l-reuleaux
              size="120"
              stroke="7"
              stroke-length="0.15"
              bg-opacity="0.40"
              speed="1.2"
              color="#244AE0"
            ></l-reuleaux>
          </div>
          <p className="text-center mt-3">Cargando...</p>
        </div>
      ) : (
        <div className="cardViajes">
          <h2 className="text-center encabezadoLista">Administrar Textos</h2>

          <br />
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary botonEditar"
              onClick={() => {
                setFormData({ texto: "", activo: true });
                setShowModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Texto
            </button>
          </div>
          <table className="table table-bordered tablaViaje">
            <thead className="text-center cabecerasDeTabla">
              <tr>
                <th>Titulo</th>
                <th>Texto</th>
                <th>Estado</th>
                <th>Posicion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center cuerpoTabla">
              {filterLanding(landingDataText).map((text) => (
                <tr key={text.id}>
                  <td>
                    <h5>{text.titulo}</h5>
                  </td>
                  <td>
                    <h5>{text.texto}</h5>
                  </td>
                  <td>
                    <h5>
                      {text.activo === "true" ? "Activado" : "Desactivado"}
                    </h5>
                  </td>
                  <td>
                    <h5>{text.posicion}</h5>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary botonEditar"
                      onClick={() => handleEditText(text.id)}
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        style={{ width: "25px", height: "25px" }}
                      ></lord-icon>
                    </button>
                    <button
                      className="btn btn-danger botonEliminar"
                      onClick={() => handleDeleteText(text.id)}
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/xekbkxul.json"
                        trigger="hover"
                        style={{ width: "25px", height: "25px" }}
                      ></lord-icon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination  d-flex justify-content-center align-items-center">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={landingDataText.length}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <p className="mx-2 textoItemsViaje ">
              Cantidad de imagenes por pagina:
            </p>
            <form className="d-flex align-items-center h-100 " action="#">
              {/* Resto de tu código */}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="form-select mx-1 seletItemsViajes"
              >
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </form>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Editar Texto" : "Crear Texto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Titulo:</label>
              <textarea
                className="form-control"
                placeholder="Titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                required
                maxLength={50}
              />
            </div>
            <div className="mb-3">
              <label>Texto:</label>
              <textarea
                className="form-control"
                placeholder="Texto"
                value={formData.texto}
                onChange={(e) =>
                  setFormData({ ...formData, texto: e.target.value })
                }
                required
                maxLength={50}
              />
            </div>
            <div className="mb-3">
              <label>Activo:</label>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) =>
                  setFormData({ ...formData, activo: e.target.checked })
                }
              />
            </div>
            <div className="mb-3">
              <p>Posición:</p>
              <input
                type="text"
                placeholder="Posición"
                value={formData.posicion || ""} // Asegúrate de que el valor sea una cadena
                onChange={(e) =>
                  setFormData({ ...formData, posicion: e.target.value })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleSubmit}
          >
            {editingId ? "Guardar Cambios" : "Crear Texto"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
