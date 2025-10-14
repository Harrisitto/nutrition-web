import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import StyledSvgCkeck from "../components/styled/svg/Check";
import { authService } from "../services/supabase";

const ValidationConfirmedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Extract token from URL parameters
  const token = searchParams.get("token_hash") || searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('No verification token found in URL');
        return;
      }

      setIsVerifying(true);
      
      try {
        const result = await authService.verifyEmail(token);
        
        if (result.success) {
          setVerificationStatus('success');
          
          // Optional: Redirect to login page after a delay
          setTimeout(() => {
            navigate('/login'); // Adjust this route as needed
          }, 3000);
        } else {
          setVerificationStatus('error');
          setErrorMessage(result.error?.message || 'Verification failed');
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred');
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  return (
    <div className="w-full px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        {isVerifying ? (
          <div className="bg-blue-900/20 border-2 border-blue-500 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h1 className="text-3xl font-bold text-black-green mb-2">
                Verifying Email...
              </h1>
              <p className="text-black-green">
                Please wait while we confirm your email address.
              </p>
            </div>
          </div>
        ) : verificationStatus === 'success' ? (
          <div className="bg-green-900/20 border-2 border-green-500 rounded-lg p-8 text-center">
            <div className="mb-6">
              <StyledSvgCkeck />
              <h1 className="text-3xl font-bold text-black-green mb-2">
                Email Verification Successful!
              </h1>
              <p className="text-black-green">
                Your email has been successfully verified.
              </p>
            </div>

            {email && (
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Verified Email:</p>
                <p className="font-semibold text-green-400">{email}</p>
              </div>
            )}

            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-6">
              <h2 className="text-lg text-black-green mb-2">
                ¡Verificación completada!
              </h2>
              <p className="text-black-green text-sm">
                Ya puedes hacer el 'log-in' en la aplicación. Serás redirigido automáticamente en unos segundos...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <h1 className="text-3xl font-bold text-black-green mb-2">
                Verification Failed
              </h1>
              <p className="text-black-green mb-4">
                There was an error verifying your email address.
              </p>
              
              {errorMessage && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-1">Error Details:</p>
                  <p className="font-semibold text-red-400">{errorMessage}</p>
                </div>
              )}
              
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationConfirmedPage;
