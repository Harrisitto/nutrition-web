import { useAuth } from "../hooks/redux/hooks/auth";

const HomePage = () => {
  const auth = useAuth();

  console.log("Auth state in HomePage:", auth);

  if (auth.error || auth.session === null) {
    return (
      <div className="w-full px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black-green mb-4">Error</h1>
          <p className="text-lg text-fade-dark-green leading-relaxed">
            {auth.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black-green mb-4">
          Email verificado con éxito
        </h1>
        <p className="text-lg text-fade-dark-green leading-relaxed">
          Ya puedes iniciar sesión en la aplicación y comenzar a utilizar todas
          las funcionalidades que ofrecemos. ¡Bienvenido a bordo!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
