import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route } from 'react-router-dom';


const ProtectedRoute = ({isAuthenticated,user, isAdmin, loading, children}) => {
    console.log(children)
    console.log(isAdmin)
    if(loading === false){
        if(isAuthenticated === false){
            return <Navigate to={'/login'} />
        }

        if(isAdmin === false && user.role !== "admin" || isAdmin === true && user.role !== "admin" ){

            return <Navigate to={'/login'} />
        }

        return children ? children : <Outlet />; 
    }
}

export default ProtectedRoute