import React, { Fragment, useRef, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser,resetPassword,} from "../../actions/userActions";
import { UPDATE_PASSWORD_RESET,UPDATE_PROFILE_RESET} from "../../constants/userConstant";
import LockOpenIcon from "@mui/icons-material/LockOpenOutlined";
import LockIcon from "@mui/icons-material/LockOpen";
import Metadata from "../layout/MetaData";




const ResetPassword = () => {
    let {token} = useParams();
    console.log(token)
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { error, success, loading } = useSelector((state) => state.forgotPassword);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(resetPassword(myForm));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(resetPassword());
        }

        if (success) {
            alert.success("Password Updated Successfully");
            navigate("/login");

    
        }
    }, [dispatch, error, alert, navigate, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <Metadata title="Change Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Update Password</h2>
                            <form
                                className="resetPasswordForm"
                                encType="multipart/form-data"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div >
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <input
                                    value="Update"
                                    type="submit"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ResetPassword;
