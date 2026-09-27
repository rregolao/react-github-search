type ErrorProps = {
  message?: string;
};

const Error = ({ message }: ErrorProps) => {
  return (
    <div>
      <p>{message || "Usuário não encontrado!"}</p>
    </div>
  );
};

export default Error;
