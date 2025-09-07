import AuthForm from "../components/AuthForm";

function Login() {
    return (
        <AuthForm 
            method="login"
            route="/auth/login"
        />
    );
}

export default Login;