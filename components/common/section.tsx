const Section = (props: any) => {
  const { children, title, errors, classes } = props;

  return (
    <section className={`relative ${classes}`}>
      {title && <h1 className="text-2xl font-semibold">{title}</h1>}
      {errors ? (
        <p className={"alert alert-danger py-4 rounded-lg mb-4"}>{errors}</p>
      ) : null}
      {children}
    </section>
  );
};

export default Section;
