import { UserProps } from "../types/user";

import { useState } from "react";

import Search from "../components/Search";
import User from "../components/User";
import Error from "../components/Error";
import Loader from "../components/Loader";

const Home = () => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUser = async function (userName: string) {
    if (!userName.trim()) return;

    setUser(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`https://api.github.com/users/${userName}`);
      const data = await res.json();

      if (res.status === 404) {
        setError("Usuário não encontrado!");
        return;
      }

      if (!res.ok) {
        setError(
          data?.message ||
            "Não foi possível buscar o usuário. Tente novamente mais tarde."
        );
        return;
      }

      const { avatar_url, login, location, followers, following } = data;

      const userData: UserProps = {
        avatar_url,
        login,
        location,
        followers,
        following,
      };

      setUser(userData);
    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Search loadUser={loadUser} />
      {isLoading && <Loader />}
      {user && <User {...user} />}
      {error && <Error message={error} />}
    </div>
  );
};

export default Home;
