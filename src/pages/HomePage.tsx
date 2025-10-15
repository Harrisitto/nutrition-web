import { useEffect } from "react";
import { useAuth } from "../hooks/redux/hooks/auth";
import { supabase } from "../services/supabase";

const HomePage = () => {
  const auth = useAuth();

  console.log("Auth state in HomePage:", auth);

  useEffect(() => {
    const metaData = auth.user?.user_metadata;
    console.log("User metadata:", metaData);
    (async () => {
      if (!metaData) return;
      if (metaData.allUsers) {
        await supabase.from('allusers').upsert(metaData.allUsers);
      }

      if (metaData.nutritionist) {
        await supabase.from('allnutritionist').upsert(metaData.nutritionist);
      }
    })();
  }, [auth.user])

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
