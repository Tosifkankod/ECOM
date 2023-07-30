import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProduct, deleteProduct } from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/base";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "../Admin/Sidebar";
import { DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { deleteOrder, getAllOrders, getOrderDetails } from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";

const OrderList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    
    const {error,orders} = useSelector(state => state.allOrders);
    const {error:deleteError, isDeleted} = useSelector((state) => state.order)

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
            alert.success("Order Deleted Successfully")
            navigate('/admin/orders');
            dispatch({type: DELETE_ORDER_RESET})

        }
        dispatch(getAllOrders());
    }, [dispatch, alert, error, navigate, isDeleted, deleteError])

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
        {
          field: "status",
          headerName: "Status",
          minWidth: 150,
          flex: 0.5,
          cellClassName: (params) => {
            return params.row.status === "Delivered" ? "greenColor" : "redColor";
          },
        },
        {
          field: "itemsQty",
          headerName: "Items Qty",
          type: "number",
          minWidth: 150,
          flex: 0.3,
        },
        {
          field: "amount",
          headerName: "Amount",
          type: "number",
          minWidth: 270,
          flex: 0.5,
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

                            <Link to={`/admin/order/${params.id}`} >
                                <EditIcon />
                            </Link>
                        

                        <Button 
                            onClick={() => deleteOrderHandler(params.id)}
                         >
                            <DeleteIcon/>
                        </Button>
                    </Fragment>
                )
            },
        }

    ]

    const rows = [];

    orders && orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemQty: item.orderItems.length, 
        amount: item.totalPrice, 
        status: item.orderStatus 
      })
    })


    return(
        <Fragment>
            <MetaData title={`All ORDERS --Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading" >ALL ORDER</h1>
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

export default OrderList;
