import { useState, useRef } from "react";
import types, { func } from "prop-types";
import "./NewAdvertPage.css";
import Layout from "../../layout/Layout.js";
import React from "react";
import Button from "../../shared/Button";
import { postNewAdvert } from "../service";
import { Redirect } from "react-router-dom";


//TODO: en navbar no debe aparecer botón 'Crear Anuncio' (condicional en Header.js)
//TODO: problema con desabilitación del botón: no coge el valor tags: [] como 'not true', pero si como 'false' WTF? (¿usar JSON.stringify?),
//tampoco coge el valor 'compra' (sale:false)


export default function NewAdvertPage({ ...props }) {
  const [fields, setFields] = useState({
    name: "",
    price: 0,
    sale: true,
    tags: [],
    photo: "",
  });

  const [newAdvertId, setNewAdvertId] = useState("");

  const photoRef = useRef(null);
  //photoRef.current.value

  const handleOnChange = (event) => {
    if (
      event.target.type === "text" ||
      event.target.type === "number" ||
      event.target.type === "file"
    ) {
      setFields((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    } else if (event.target.type === "select-multiple") {
      const selected = event.target.selectedOptions;
      console.log(selected);
      const tagsValues = [];

      /* for (let i = 0; i < selected.length; i++)  */
      Array.from(selected).forEach((tag) => {
        tagsValues.push(tag.value);
        setFields((prevState) => ({
          ...prevState,
          [event.target.name]: tagsValues,
        }));
      });
    }
  };

  const handleRadio = (event) => {
    /*     console.log(
      event.target.type,
      event.target.name,
      typeof event.target.value,
      event.target.value
    ); */

    setFields((prevState) =>
      event.target.checked
        ? {
            ...prevState,
            sale:
              event.target.value === "true"
                ? true
                : false /*JSON.parse(event.target.value)*/,
          }
        : { ...prevState }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.target);
      data.set["photo"] = photoRef.current.value;

      const response = await postNewAdvert(data);
      console.log(response);
      setNewAdvertId(response.id);

      /*setFields({
        name: "",
        price: "",
        sale: true,
        tags: [],
        photo: "",
      }); */
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect(() => {}, []);

  if (newAdvertId) {
    return <Redirect to={`/adverts/${newAdvertId}`} />;
  }

  return (
    <Layout {...props}>
      <div name="form-container">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="name">
            Artículo
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleOnChange}
              value={fields.name}
              autoFocus
            />
          </label>

          <label className="form-field" htmlFor="price">
            Precio
            <input
              type="number" //poner de nuevo type=text si esto no sirve para cambiar el tipado de 'price'
              id="price"
              name="price"
              onChange={handleOnChange}
              value={fields.price}
            />
          </label>

          <label className="form-field" htmlFor="sale">
            Venta
            <input
              name="sale"
              type="radio"
              value={true}
              checked={fields.sale === true}
              onChange={handleRadio}
            />
          </label>

          <label className="form-field" htmlFor="sale">
            Compra
            <input
              name="sale"
              type="radio"
              value={false}
              //onChange={(prevState) => setFields({...prevState, sale:false})}
              checked={fields.sale === false}
              onChange={handleRadio}
            />
          </label>

          <label className="form-field">
            Categoría
            <select
              className="form-field-tags"
              name="tags"
              value={fields.tags}
              onChange={handleOnChange}
              multiple={true}
            >
              <option value="lifestyle">Lifestyle</option>
              <option value="mobile">Mobile</option>
              <option value="motor">Motor</option>
              <option value="work">Work</option>
            </select>
          </label>

          <label className="form-field" htmlFor="photo">
            {" "}
            {/*OJO: ESTO ES PASARLE UN FICHERO,  NO UNA URL*/}
            Foto
            <input
              type="file"
              id="photo"
              name="photo"
              ref={photoRef}
           
              /* value={fields.photo} */
            ></input>
          </label>
          <Button
            disabled={
              !fields.name ||
              !fields.price ||
              fields.sale == "" ||
              fields.tags == []
            }
            type="submit"
          >
            Crear anuncio
          </Button>
        </form>
      </div>
    </Layout>
  );
}

//TODO: desactivar el botón si falta algún campo requerido
//TODO: eliminar botón 'crear anuncio' en el Header cuando estoy en esta página

//tal vez conviene aquí un type de tipo shape (clase 5, min 0:30)
//si necesito que algo tenga la propiedad length lo debo definir de tipo

/*
         
                try {
                    const data = new FormData(this)
                    const username = data.get('username')  // valor del input[name="username"]
                    const password = data.get('password')  // valor del input[name="password"]
                    const result = await DataService.registerUser(username, password)

                    */
