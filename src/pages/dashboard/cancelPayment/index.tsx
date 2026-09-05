import { useRedirectToCheckout } from "../@components/paymentScreen/@queries/redirectCheckout";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

/**
 * Landing page for Stripe's `cancel_url`: the nutritionist opened the checkout
 * and backed out, so nothing was charged and no subscription exists.
 */
const CancelPaymentPage = () => {
  const { loading, handleCheckout } = useRedirectToCheckout();
  const { navigateTo } = useAppNavigation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pago cancelado
        </h2>
        <p className="text-gray-600 mb-6">
          No se ha realizado ningún cargo. Puedes volver a intentarlo cuando
          quieras: necesitas una suscripción activa para gestionar a tus
          clientes.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-nutrition-green hover:bg-nutrition-green/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Cargando pasarela..." : "Reintentar el pago"}
          </button>
          <button
            onClick={() => navigateTo(APP_ROUTES.DASHBOARD)}
            className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Volver al panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
