export function renderChildren(renders) {
  return (element) => {
    const unrenders = renders.map((render) => render(element)).reverse();
    return () => unrenders.forEach((unrender) => unrender());
  };
}
