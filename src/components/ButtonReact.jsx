import { useState } from "react";

export default function ButtonReact() {
  const [count, setCount] = useState(0);

  function handlerClick() {
    setCount(count + 1);
  }

  return (
    <>
      <button className="bg-green-400" onClick={handlerClick}>
        Click me {count}
      </button>
    </>
  );
}
