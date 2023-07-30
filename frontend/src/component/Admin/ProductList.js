import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProduct, deleteProduct } from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/base";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error, products} = useSelector(state => state.products);
    const {error: deleteError, isDeleted} = useSelector(state => state.product);

    useEffect(() => {
        if(error){
            alert.error(error); 
            dispatch(clearErrors);
        }

        if(deleteError){
            alert.error(error); 
            dispatch(clearErrors);
        }

        if(isDeleted){
            alert.success("product Deleted Successfully")
            navigate('/admin/dashboard');
            dispatch({type: DELETE_PRODUCT_RESET})

        }
        dispatch(getAdminProduct());
    }, [dispatch, alert, error, isDeleted, deleteError, navigate])

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        {field: "id",headerName: "Product ID", minWidth:200, flex: 0.5 },
        {field: "name",headerName: "Name", minWidth:150, flex: 0.3 },
        {field: "stock",headerName: "Stock", minWidth:150, flex: 0.3 },
        {field: "price",headerName: "Price", minWidth:270, flex: 0.5 },
        {   
            field: "actions",
            headerName: "Actions", 
            type: "number",  
            minWidth:150, 
            flex: 0.3, 
            sortable: false, 
            renderCell: (params) =>  {
                return(
                    <Fragment>

                            <Link to={`/admin/product/${params.id}`} >
                                <EditIcon />
                            </Link>
                        

                        <Button 
                            onClick={() => deleteProductHandler(params.id)}
                         >
                            <DeleteIcon/>
                        </Button>
                    </Fragment>
                )
            },
        }

    ]

    const rows = [];

    products && products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock, 
        price: item.price, 
        name: item.name 
      })
    })


    return(
        <Fragment>
            <MetaData title={`All Products --Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading" >ALL PRODUCT</h1>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableRowSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default ProductList;
