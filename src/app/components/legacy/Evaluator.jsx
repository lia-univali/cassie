import React, { useEffect, useState } from "react";

// @TODO unused component
const Evaluator = ({ task, onComplete = () => {}, formatter = (v) => v }) => {
  const [busy, setBusy] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    task.evaluate((value) => {
      setBusy(false);
      setResult(value);
      onComplete();
    });
  }, [task]);

  return busy ? <span>Computando...</span> : <span>{formatter(result)}</span>;
};

export default Evaluator;
