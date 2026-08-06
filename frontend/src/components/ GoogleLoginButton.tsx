import { GoogleLogin } from "@react-oauth/google";

type GoogleLoginButtonProps = {
    onSuccess: (idToken: string) => void | Promise<void>;
};

export default function GoogleLoginButton({
    onSuccess,
}: GoogleLoginButtonProps) {
    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;

                await onSuccess(credentialResponse.credential);
            }}
        />
    );
}