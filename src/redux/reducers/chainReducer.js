const chainState = {
  chainId: 56,
};
const chainReducer = (state = chainState, action) => {
  switch (action.type) {
    case "UPDATE_CHAIN":
      return { ...state, chainId: action.payload };
    default:
      return state;
  }
};
export default chainReducer;
