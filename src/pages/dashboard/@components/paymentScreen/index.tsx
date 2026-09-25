import { useRedirectToCheckout } from "./@queries/redirectCheckout";
import { SignOut } from "@src/pages/configuration/authManagement/components/buttons";

const PaymentRequiredPage = () => {
  const { loading, handleCheckout } = useRedirectToCheckout();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Suscripción requerida
        </h2>
        <p className="text-gray-600 mb-6">
          Necesitas una suscripción activa para acceder al panel de control y
          gestionar a tus clientes.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-nutrition-green hover:bg-nutrition-green/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Cargando pasarela..." : "Activar suscripción"}
        </button>

        {/* This screen now gates the whole dashboard, so it has to carry the
            only way out: otherwise signing in with the wrong account leaves
            the user stuck here with no sign out. */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default PaymentRequiredPage;
