import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/base";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "../Admin/Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstant";

const UsersList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error, users} = useSelector(state => state.allUsers);
    const {error: deleteError, isDeleted, message} = useSelector(state => state.profile)
    
    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

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
            alert.success(message)
            navigate('/admin/users');
            dispatch({type: DELETE_USER_RESET})

        }
        dispatch(getAllUsers());
    }, [dispatch, alert, error, isDeleted, deleteError, navigate, message])

    

    const columns = [
        {field: "id",headerName: "User ID", minWidth:200, flex: 0.5 },
        {field: "Email",headerName: "Email", minWidth:150, flex: 0.5 },
        {field: "Name",headerName: "Name", minWidth:150, flex: 0.1 },
        {field: "Role",headerName: "Role", minWidth:270, flex: 0.1 },
        {   
            field: "actions",
            headerName: "Actions", 
            type: "number",  
            minWidth:150, 
            flex: 0.2, 
            sortable: false, 
            renderCell: (params) =>  {
                return(
                    <Fragment>

                            <Link to={`/admin/user/${params.id}`} >
                                <EditIcon />
                            </Link>
                        

                        <Button 
                            onClick={() => deleteUserHandler(params.id)}
                         >
                            <DeleteIcon/>
                        </Button>
                    </Fragment>
                )
            },
        }

    ]

    const rows = [];

    users && users.forEach((item) => {
        console.log(item)
      rows.push({
        id: item._id,
        Email: item.email, 
        Name: item.name,
        Role: item.role, 
      })
    })


    return(
        <Fragment>
            <MetaData title={`All Users --Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading" >ALL USERS</h1>
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

export default UsersList