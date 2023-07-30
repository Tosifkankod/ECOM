import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAllReviews,deleteReviews } from "../../actions/productAction";
import {useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/base";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import Star from '@mui/icons-material/Star'

const ProductReviews = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const [productId, setProductId] = useState("")
    
    const {error: deleteError,isDeleted} = useSelector(state => state.review);
    const {error, loading, reviews} = useSelector(state => state.productReviews);
    
    const DeleteReviewsHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId, productId));
    }

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
        
      

    }


    useEffect(() => {
        if(productId.length === 24){
            dispatch(getAllReviews(productId))
        }


        if(error){
            alert.error(error); 
            dispatch(clearErrors);
        }

        if(deleteError){
            alert.error(error); 
            dispatch(clearErrors);
        }

        if(isDeleted){
            alert.success("Review Deleted Successfully")
            navigate('/admin/reviews');
            dispatch({type: DELETE_REVIEW_RESET})

        }
    }, [dispatch, alert, error, isDeleted, deleteError, navigate, productId])


    const columns = [
        {field: "id",headerName: "Review ID", minWidth:200, flex: 0.6 },
        {field: "user",headerName: "User", minWidth:150, flex: 0.3 },
        {field: "comment",headerName: "comment", minWidth:180 , flex: 0.4 },
        {   
            field: "rating",
            headerName: "Rating",
            type: "number",  
            minWidth:270, 
            flex: 0.5, 
            cellClassName: (params) => {
                console.log(params)
                return (params.id, "role") === "admin" ? "greenColor":"redColor"
            }
        },
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
                        <Button 
                            onClick={() => DeleteReviewsHandler(params.id, "id")}
                         >
                            <DeleteIcon/>
                        </Button>
                    </Fragment>
                )
            },
        }

    ]

    const rows = [];

    reviews && reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating, 
        comment: item.comment, 
        user: item.name 
      })
    })


    return(
        <Fragment>
            <MetaData title={`All Reviews --Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productReviewsContainer">
                <form
                            action=""
                            className="productReviewsForm"
                            encType="multipart/form-data"
                            onSubmit={productReviewsSubmitHandler}
                        >
                            <h1 className="productReviewsFormHeading" >ALL REVIEWS</h1>
                            <div>
                                <Star />
                                <input
                                    type="text"
                                    placeholder="Product Id"
                                    required
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                            </div>

                            <Button
                                id="createProductBtn"
                                type="submit"
                                disabled={
                                    loading ? true : false || productId === "" ? true : false
                                }
                            >
                                Search
                            </Button>
                        </form>
                    {
                        reviews && reviews.length > 0 ? <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableRowSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />: <h1 className="productReviewsFormHeding">NO REVIEWS FOUND</h1>
                    }
                </div>
            </div>
        </Fragment>
    );
};


export default ProductReviews