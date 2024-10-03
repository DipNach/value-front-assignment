import axios from "axios";
import "./App.css";
import React, { useEffect, useState } from "react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const tableData = {
    columns: [{ name: "name" }, { name: "description" }, { name: "" }],
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("https://dummyjson.com/products");

        if (data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error while fetching products", error?.message);
      }finally{
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="container">
      <h1 className="align-center">Product Listing</h1>
      {
        loading?<h2 className="align-center">{"..."}</h2>: <table>
        <tbody>
          <tr>
            {tableData.columns.map((row, index) => (
              <th key={index}>{row.name.toUpperCase()}</th>
            ))}
          </tr>

          {products.map((product) => {
            return (
              <tr className="product-row">
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>
                  <img height={100} width={100} src={product.thumbnail} alt={product.title} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      }
     
    </div>
  );
};

export default App;
