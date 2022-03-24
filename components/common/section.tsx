import Link from 'next/link'

const Section = (props: any) => {
  const { children, title, errors, classes, buttonText, buttonClick } = props

  return (
    <section className={`relative ${classes}`}>
      <div className="flex">
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
        {buttonText &&
          (typeof buttonClick === 'string' ? (
            <Link href={buttonClick || '/'} passHref>
              <button className="btn btn-primary ml-4 text-sm">{buttonText}</button>
            </Link>
          ) : (
            <button className="btn btn-primary ml-4 text-sm" onClick={buttonClick}>
              {buttonText}
            </button>
          ))}
      </div>
      {errors ? <p className={'alert alert-danger py-4 rounded-lg mb-4 mt-4'}>{errors}</p> : null}
      {children}
    </section>
  )
}

export default Section
