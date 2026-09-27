import { RepoProps } from "../types/repo";

import Repo from "../components/Repo";
import BackBtn from "../components/BackBtn";
import Error from "../components/Error";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./Repos.module.css";
import Loader from "../components/Loader";

const Repos = () => {
  const { username } = useParams();

  const [repos, setRepos] = useState<RepoProps[] | [] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadrepos = async function (username: string) {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos`
        );
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setError(
            (data && data.message) ||
              "Não foi possível carregar os repositórios. Tente novamente mais tarde."
          );
          return;
        }

        let orderedRepos = data.sort(
          (a: RepoProps, b: RepoProps) =>
            b.stargazers_count - a.stargazers_count
        );

        orderedRepos = orderedRepos.slice(0, 5);

        setRepos(orderedRepos);
      } catch (err) {
        console.error(err);
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadrepos(username);
    }
  }, [username]);

  if (isLoading) return <Loader />;

  return (
    <div className={classes.repos}>
      <BackBtn />
      <h2>Explore os repositórios do usuário: {username}</h2>
      {error && <Error message={error} />}
      {!error && repos && repos.length === 0 && <p>Não há repositórios.</p>}
      {!error && repos && repos.length > 0 && (
        <div className={classes.repos_container}>
          {repos.map((repo: RepoProps) => (
            <Repo key={repo.name} {...repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repos;
