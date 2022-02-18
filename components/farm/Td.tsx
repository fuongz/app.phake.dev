const FarmTd = (props: any) => {
  let textVariantClasses = props.textVariant
    ? `text-${props.textVariant}-500`
    : "text-gray-100";

  const value = props.value ? props.value : "";

  if (value) {
    textVariantClasses =
      value < 0
        ? `text-red-500`
        : value > 0
        ? `text-green-500`
        : `text-gray-500`;
  }

  const numberFormat = (number: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(number);
  };

  return (
    <td
      className={`sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 ${textVariantClasses}`}
      colSpan={props.colSpan || 1}
    >
      {(value
        ? props.currency
          ? numberFormat(value, props.currency)
          : value
        : false) || props.children}
    </td>
  );
};

export default FarmTd;
