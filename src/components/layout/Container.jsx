const Container = ({ children, className = '' }) => {
  return (
    <div className={`container-custom py-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;