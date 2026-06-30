import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}) {
    const {isAuthenticated} = useSelector(s => s.auth);

    if(!isAuthenticated) return <Navigate to="/login" replace/>

    return (
        {children}
    )
}

export default ProtectedRoute
