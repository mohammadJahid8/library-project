/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../contexts/AuthContext/AuthProvider";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

const ResetPassword = () => {
  const { isLoading, setUserRefetch, userRefetch } = useContext(AuthContext);
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    values.token = token;
    try {
      const promise = await axios.post(`/users/reset-password`, values);
      if (promise.status === 200) {
        setUserRefetch(!userRefetch);

        toast.success(
          `Password reset Successful! Login with your new password`,
          {
            id: "reset",
            duration: 1000,
            position: "top-center",
          }
        );
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast.error(error.response.data.message || `Log in failed`, {
        id: "login",
        duration: 2000,
        position: "top-right",
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen pt-6 flex justify-center items-center">
      <div className="w-11/12 md:w-5/12 mx-auto p-4 md:p-8 border  rounded-lg shadow-lg my-20">
        <h2 className="text-xl font-medium text-gray-600 mb-2">
          Reset your password
        </h2>
        <form onSubmit={handleSubmit(handleLogin)} className="mt-2">
          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="form-control mb-2">
              <label className="label ps-0">
                <span className="">New Password</span>
              </label>
              <input
                {...register("newPassword", {
                  required: "New Password must be at least six character long",
                })}
                type="password"
                placeholder="New password"
                className="border focus:outline-none rounded-lg p-2 w-full bg-transparent"
              />
              {errors.newPassword && (
                <label className="label text-red-400 text-xs ps-0">
                  <span className="">Provide New password</span>
                </label>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center mt-2 gap-4">
              <button
                disabled={loading}
                className="px-10 py-2 bg-primary text-white rounded-lg hover:shadow-lg shadow"
                type="submit"
              >
                {loading ? "Processing.." : "Reset"}
              </button>
              <Link
                disabled={loading}
                to="/login"
                className="px-10 py-2 bg-primary text-white rounded-lg hover:shadow-lg shadow text-center"
              >
                {"Back to login"}
              </Link>
            </div>
            {/* <div className="text-sm flex justify-between">
              
              
            </div> */}
          </div>
        </form>
      </div>
      <ForgotPassword />
    </div>
  );
};

export default ResetPassword;
