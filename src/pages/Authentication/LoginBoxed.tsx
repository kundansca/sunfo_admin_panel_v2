import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
// @ts-ignore
import { loginUser } from '../../features/auth/authSlice.js';
import PageLoader from '../../extra/PageLoader';

const LoginBoxed = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const { isAuth, loading, error ,errorComponent} = useSelector((state:any) => state.auth);
    const [passwordVisible, setPasswordVisible] = useState("password");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    }, [dispatch]);

    const handleChange = (event:any) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => (prevState === "password" ? "text" : "password"));
    };

    useEffect(() => {
        if (error!==null && errorComponent==="login") {
            Swal.fire({
                title: 'Login Failed',
                text: error,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    }, [error]);

    useEffect(() => {
        if (isAuth) {
            Swal.fire({
                title: 'Login Successful',
                text: 'You have logged in successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/", { replace: true });
                }
            });
        }
    }, [isAuth, navigate]);

    const submitForm = async (event:any) => {
        event.preventDefault();

        if (!loginData.email) {
            Swal.fire({
                icon: "error",
                title: "Email Field Is Required."
            });
            return;
        }

        if (!loginData.password) {
            Swal.fire({
                icon: "error",
                title: "Password Field Is Required."
            });
            return;
        }

        await dispatch(loginUser(loginData));
    };

    const passwordIcon = loginData.password && (
        passwordVisible === "password" ? (
            <AiFillEyeInvisible
                style={{ position: "absolute", right: "20px", bottom: "10px" }}
                size={20}
                onClick={togglePasswordVisibility}
            />
        ) : (
            <AiFillEye
                style={{ position: "absolute", right: "20px", bottom: "10px" }}
                size={20}
                onClick={togglePasswordVisibility}
            />
        )
    );

    return (
        <div>
            <PageLoader loading={loading} />
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="email"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={passwordVisible}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="password"
                                            onChange={handleChange}
                                        />
                                        {passwordIcon}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
