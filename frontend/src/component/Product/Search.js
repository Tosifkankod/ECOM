import React, { Fragment, useState } from "react";
import "./Search.css"
import { useNavigate } from "react-router-dom";
import Metadata from "../layout/MetaData";


const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate('/products');
    }
  }

  return (
    <Fragment>
      <Metadata title={`SEARCH -- ECOMMERCE`} />

      <form onSubmit={searchSubmitHandler} className="SearchBox">
        <input
          type="text"
          placeholder="Search a Product..."
          onChange={e => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
