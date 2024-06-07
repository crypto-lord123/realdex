import React from "react";
import Truncate from "react-truncate-string";
const Structure = (props) => {
  return (
    <tr className="text-xs">
      <td>
        <Truncate text={props.structure.address} />
      </td>
      <td>{Number(props.structure.amount).toFixed(3)} BNB</td>
    </tr>
  );
};

export default Structure;
