import AuthForm from "../components/AuthForm";

function Login() {
    return (
        <AuthForm 
            method="login"
            route="/api/auth/login"
        />
    );
}

export default Login;