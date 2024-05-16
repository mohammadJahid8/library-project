import { useForm } from "react-hook-form";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const modalCheckboxRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      const promise = await axios.post(`/users/forgot-password`, data);
      if (promise.status === 200) {
        toast.success(`Please check your email for reset password link!`);
        reset();

        setLoading(false);
        if (modalCheckboxRef.current) {
          modalCheckboxRef.current.checked = false;
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast.error(
        error.response.data.message || `Something went wrong!`
      );
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="forgot_password"
        className="modal-toggle"
        ref={modalCheckboxRef}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Enter a email to send reset link
          </h3>
          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="mt-2 w-full space-y-4"
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="form-control">
                <input
                  {...register("email", {
                    required: "Provide email",
                  })}
                  type="text"
                  placeholder="Email"
                  className="border rounded-lg focus:outline-none p-2  w-full bg-transparent"
                />
                {errors.email && (
                  <label className="label text-red-400 text-xs ps-0">
                    <span className="">{errors.email.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="modal-action">
              <label
                htmlFor="forgot_password"
                className="p-btn !bg-error rounded-full cursor-pointer"
              >
                Cancel
              </label>
              <button
                disabled={loading}
                type="submit"
                className="p-btn rounded-full"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
