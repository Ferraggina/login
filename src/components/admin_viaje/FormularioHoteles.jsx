import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearHotel, uploadImage } from "../../redux/actions/actions";
import "../../sass/_formularioHoteles.scss";
export default function FormularioHoteles() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState("");
  const [alert, setAlert] = useState(null); // Estado para la alerta
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Obtener la función de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fotos = JSON.stringify(selectedImages);
    console.log("Aca Fotos", fotos);
    const nuevoHotel = {
      nombre: nombre,
      direccion: direccion,
      fotos: fotos,
      videos: videos,
    };
    console.log("nuevo hotel", nuevoHotel);

    try {
      // Llamar a la acción para crear el itinerario
      await dispatch(crearHotel(nuevoHotel));

      // Limpiar los campos del formulario
      setNombre("");
      setDireccion("");
      setFotos("");
      setVideos("");
      setSelectedImages([]);

      // Mostrar una alerta de éxito
      setAlert({
        type: "success",
        message: "Su Hotel se agrego exitosamente.",
      });

      // Redirigir al usuario a la página de inicio después de 2 segundos

      // Cambia "/" al URL de la página de inicio que desees
      // 2000 ms (2 segundos)
    } catch (error) {
      // Mostrar una alerta de error
      setAlert({
        type: "danger",
        message: "Hubo un error al crear el Itinerario.",
      });
    }
  };
  // const handleFileInputChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files && files.length > 0) {
  //     setFotos([...fotos, ...files]); // Agrega nuevos archivos al estado existente
  //   }
  // };
  // const handleRemoveFile = (index) => {
  //   const updatedFiles = [...fotos];
  //   updatedFiles.splice(index, 1);
  //   setFotos(updatedFiles);
  // };

  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const response = await dispatch(uploadImage(formData));

        if (response) {
          setSelectedImages([...selectedImages, response]);
        }
      } catch (error) {
        console.error("Error al cargar la imagen en el servidor:", error);
      }
    }
  };
  const removeSelectedImage = (index) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
  };

  return (
    <div className="card-body">
      <form
        className="form-sample"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <br />
        <br />
        <br />
        <h4 className="text-center card-tittle tituloForm">
          Agregar un nuevo Hotel
        </h4>
        <div className="row justify-content-center form-group contenedorFormularioHoteles">
          <div className="col-md-6">
            {/* Alerta condicional */}
            {alert && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}

            <div className="form-group">
              <label className="estilosLabels">Nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={nombre}
                required
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="estilosLabels">Direccion</label>
              <input
                type="text"
                className="form-control"
                placeholder="Direccion"
                value={direccion}
                required
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
            {/* <div className="form-group">
              <label>Añadir Fotos</label>
              <br />
              <input
                type="file"
                className="file-upload-default inputFotosHotel"
                multiple
                onChange={handleFileInputChange}
              />
            </div> */}
            <div className="form-group">
              <label className="estilosLabels">Añadir Fotos</label>
              <br />
              {/* <label htmlFor="file-upload" className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                Seleccionar archivos
              </label> */}
              <div className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="file-upload"
                  className="file-input"
                  onChange={handleImageUpload}
                />
                <label htmlFor="file-upload" className="custom-label">
                  Selecciona archivos
                </label>
              </div>

              {selectedImages &&
                selectedImages.map((image, index) => (
                  <div key={index} className="selected-image-item">
                    <img
                      src={image}
                      alt={`Selected ${index}`}
                      className="selected-image"
                    />
                    <button
                      className="btn btn-danger remove-image"
                      onClick={() => removeSelectedImage(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
            </div>
            {/* Área para mostrar archivos seleccionados */}
            {/* Área para mostrar archivos seleccionados */}
            {/* <div className="selected-files">
              <h4>Fotos Seleccionados:</h4>
              <ul className="renderizadoElegidas">
                {fotos.map((file, index) => (
                  <li className="listadoRenderizadas" key={index}>
                    {file.name}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}
            <div className="form-group">
              <label className="estilosLabels">Añadir enlace de Video</label>
              <input
                type="text"
                className="form-control"
                placeholder="Videos"
                value={videos}
                onChange={(e) => setVideos(e.target.value)}
              />
            </div>

            <div className="form-group"></div>
            <br />
            <button type="submit" className="btn btn-primary estiloBotones">
              Añadir Hotel
            </button>

            {/* Botón de redirección */}
            {alert && alert.type === "success" && (
              <button
                type="button"
                className="btn btn-primary ml-2 estiloBotones"
                onClick={() => navigate("/home")}
              >
                Volver a administracion
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
