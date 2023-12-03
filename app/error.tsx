"use client";

interface ErrorProps {
  error: Error;
  reset: Function;
}

const Error = ({ error, reset }: ErrorProps) => {
  return (
    <div>
      <h2>{error.message}</h2>
      <button onClick={() => reset()}>Refresh</button>
    </div>
  );
};

export default Error;
